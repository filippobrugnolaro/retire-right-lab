import {
    CalculatorParams,
    CalculationResult,
    YearlyResult,
} from "@/types/calculator";

// Function to calculate fiscal relaxation based on income brackets
function calculateFiscalRelaxation(
    amount: number,
    previousYearIncome: number
): number {
    // Income brackets: 23% for 0-28k, 35% for 28k-50k, 43% for >50k
    // Apply the highest rate first based on previous year income, then work down

    let relaxation = 0;
    let remainingAmount = amount;

    if (previousYearIncome > 50000) {
        // Start with 43% rate (highest bracket they qualify for)
        const availableAtHighest = previousYearIncome - 50000;
        const amountAtHighest = Math.min(remainingAmount, availableAtHighest);
        relaxation += amountAtHighest * 0.43;
        remainingAmount -= amountAtHighest;

        // Then 35% rate for middle bracket
        if (remainingAmount > 0) {
            const amountAtMiddle = Math.min(remainingAmount, 22000); // 50k - 28k
            relaxation += amountAtMiddle * 0.35;
            remainingAmount -= amountAtMiddle;
        }

        // Finally 23% rate for lowest bracket
        if (remainingAmount > 0) {
            relaxation += remainingAmount * 0.23;
        }
    } else if (previousYearIncome > 28000) {
        // Start with 35% rate (highest bracket they qualify for)
        const availableAtHighest = previousYearIncome - 28000;
        const amountAtHighest = Math.min(remainingAmount, availableAtHighest);
        relaxation += amountAtHighest * 0.35;
        remainingAmount -= amountAtHighest;

        // Then 23% rate for remaining amount
        if (remainingAmount > 0) {
            relaxation += remainingAmount * 0.23;
        }
    } else {
        // Only qualify for 23% rate
        relaxation = amount * 0.23;
    }

    return relaxation;
}

export function calculatePensionFund(
    params: CalculatorParams
): CalculationResult {
    const yearlyResults: YearlyResult[] = [];
    let accumulatedValue = 0;
    let netAccumulatedValue = 0;
    let currentIncome = params.annualIncome;
    let currentInvestment = params.investment;
    let cumulativeFiscalRelaxation = 0;

    for (let year = 1; year <= params.duration; year++) {
        // Apply income increase
        if (year > 1 && (year - 1) % params.incomeIncrease.frequency === 0) {
            if (params.incomeIncrease.isPercentage) {
                currentIncome *= 1 + params.incomeIncrease.amount / 100;
            } else {
                currentIncome += params.incomeIncrease.amount;
            }
        }

        // Apply investment increase
        if (
            year > 1 &&
            (year - 1) % params.investmentIncrease.frequency === 0
        ) {
            if (params.investmentIncrease.isPercentage) {
                currentInvestment *= 1 + params.investmentIncrease.amount / 100;
            } else {
                currentInvestment += params.investmentIncrease.amount;
            }
        }

        // Calculate employer contribution
        const employerContribution =
            currentIncome * (params.employerContribution / 100);

        // Calculate TFR (Trattamento di Fine Rapporto)
        const tfr = params.calculateTfr ? currentIncome * 0.0741 : 0;

        // Calculate member contribution
        const memberContribution =
            currentIncome * (params.memberContribution / 100);

        // Apply maximum limit for fiscal relaxation eligibility
        // The sum of investment + member contribution cannot exceed €5,164.57 for tax deduction purposes
        const maxEligibleAmount = 5164.57;

        // Calculate fiscal relaxation based on previous year income
        // First year has no fiscal relaxation (no previous year earnings)
        // Apply relaxation to investment + worker contribution (not employer contribution)
        let investmentFiscalRelaxation = 0;

        if (year > 1) {
            const previousYearIncome = yearlyResults[year - 2].income;
            // Use previous year's investment and member contribution amounts
            const previousYearInvestment = yearlyResults[year - 2].investment;
            const previousYearMemberContribution =
                yearlyResults[year - 2].memberContribution;
            const previousYearTotalContribution =
                previousYearInvestment + previousYearMemberContribution;
            // Apply the same maximum limit to previous year amounts
            const previousYearEligibleAmount = Math.min(
                previousYearTotalContribution,
                maxEligibleAmount
            );
            investmentFiscalRelaxation = calculateFiscalRelaxation(
                previousYearEligibleAmount,
                previousYearIncome
            );
        }

        const totalFiscalRelaxation = investmentFiscalRelaxation;
        cumulativeFiscalRelaxation += totalFiscalRelaxation;

        // Total yearly contributions
        const totalYearlyContributions =
            currentInvestment + employerContribution + tfr + memberContribution;

        // Calculate tax rate based on years in pension fund
        // 15% for first 15 years, then decreases by 0.3% per year until 9% at 35 years
        const calculateTaxRate = (years: number): number => {
            if (years <= 15) return 15;
            if (years >= 35) return 9;
            return 15 - (years - 15) * 0.3;
        };

        const taxRate = calculateTaxRate(year);

        // Calculate gross accumulated value (before taxes)
        accumulatedValue =
            accumulatedValue * (1 + params.pensionFundReturn / 100) +
            totalYearlyContributions;

        // Calculate net accumulated value (after taxes applied to total value)
        // Tax is applied to the entire accumulated value at withdrawal
        netAccumulatedValue = accumulatedValue * (1 - taxRate / 100);

        // Calculate real values (adjusted for inflation)
        const realValue =
            accumulatedValue / Math.pow(1 + params.inflation / 100, year);
        const netRealValue =
            netAccumulatedValue / Math.pow(1 + params.inflation / 100, year);

        yearlyResults.push({
            year,
            income: currentIncome,
            investment: currentInvestment,
            employerContribution,
            memberContribution,
            tfr,
            totalContributions: totalYearlyContributions,
            accumulatedValue,
            realValue,
            taxRate,
            netAccumulatedValue,
            netRealValue,
            investmentFiscalRelaxation,
            totalFiscalRelaxation,
            cumulativeFiscalRelaxation,
        });
    }

    const totalContributions = yearlyResults.reduce(
        (sum, result) => sum + result.totalContributions,
        0
    );
    const finalValue = accumulatedValue;
    const netFinalValue = netAccumulatedValue;
    const realFinalValue =
        finalValue / Math.pow(1 + params.inflation / 100, params.duration);
    const netRealFinalValue =
        netFinalValue / Math.pow(1 + params.inflation / 100, params.duration);
    const totalReturn = finalValue - totalContributions;
    const annualizedReturn = Math.pow(
        finalValue / totalContributions,
        1 / params.duration - 1
    );
    const netAnnualizedReturn = Math.pow(
        netFinalValue / totalContributions,
        1 / params.duration - 1
    );

    return {
        yearlyResults,
        totalContributions,
        finalValue,
        realFinalValue,
        netFinalValue,
        netRealFinalValue,
        totalReturn,
        annualizedReturn: annualizedReturn * 100,
        netAnnualizedReturn: netAnnualizedReturn * 100,
    };
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPercentage(percentage: number): string {
    return new Intl.NumberFormat("it-IT", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    }).format(percentage / 100);
}

export function exportToCSV(results: YearlyResult[]): string {
    const headers = [
        "Anno",
        "Reddito",
        "Investimento",
        "Contributo Datore",
        "Contributo Aderente",
        "TFR",
        "Contributi Totali",
        "Detrazione Totale",
        "Detrazione Cumulativa",
        "Aliquota Fiscale (%)",
        "Valore Accumulato (Lordo)",
        "Valore Accumulato (Netto)",
        "Valore Reale (Lordo)",
        "Valore Reale (Netto)",
    ];

    const csvContent = [
        headers.join(","),
        ...results.map((result) =>
            [
                result.year,
                result.income.toFixed(2),
                result.investment.toFixed(2),
                result.employerContribution.toFixed(2),
                result.memberContribution.toFixed(2),
                result.tfr.toFixed(2),
                result.totalContributions.toFixed(2),
                result.totalFiscalRelaxation.toFixed(2),
                result.cumulativeFiscalRelaxation.toFixed(2),
                result.taxRate.toFixed(1),
                result.accumulatedValue.toFixed(2),
                result.netAccumulatedValue.toFixed(2),
                result.realValue.toFixed(2),
                result.netRealValue.toFixed(2),
            ].join(",")
        ),
    ].join("\n");

    return csvContent;
}

export function downloadCSV(
    csvContent: string,
    filename: string = "simulazione-fondo-pensione.csv"
): void {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
