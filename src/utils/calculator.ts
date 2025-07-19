import {
    CalculatorParams,
    CalculationResult,
    YearlyResult,
} from "@/types/calculator";

// Function to calculate monthly compound interest for pension fund with correct TFR timing
// TFR 12th and 13th month portions are both paid in December (no compounding between them)
function calculatePensionFundMonthlyCompound(
    currentAccumulated: number,
    yearlyContribution: number,
    yearlyTfr: number,
    annualRate: number
): number {
    const monthlyRate = annualRate / 100 / 12;
    const monthlyContribution = yearlyContribution / 12;
    const monthlyTfrPortion = yearlyTfr / 13; // Each month's TFR portion

    let accumulated = currentAccumulated;

    // Calculate months 1-11: regular contributions + 11 monthly TFR portions
    for (let month = 0; month < 11; month++) {
        accumulated =
            accumulated * (1 + monthlyRate) +
            monthlyContribution +
            monthlyTfrPortion;
    }

    // Month 12: regular contribution + both 12th and 13th month TFR portions (paid together in December)
    accumulated =
        accumulated * (1 + monthlyRate) +
        monthlyContribution +
        2 * monthlyTfrPortion;

    return accumulated;
}

// Function to calculate monthly compound interest for ETF (similar to pension fund)
function calculateETFMonthlyCompound(
    currentAccumulated: number,
    yearlyContribution: number,
    annualRate: number
): number {
    const monthlyRate = annualRate / 100 / 12;
    const monthlyContribution = yearlyContribution / 12;

    let accumulated = currentAccumulated;

    // Calculate month by month
    for (let month = 0; month < 12; month++) {
        accumulated = accumulated * (1 + monthlyRate) + monthlyContribution;
    }

    return accumulated;
}

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

// Function to calculate TFR taxation rate based on proportional taxation of current and previous years
function calculateTfrTaxationRate(
    yearlyResults: YearlyResult[],
    currentYear: number,
    currentIncome: number
): number {
    let totalProportionalTaxation = 0;
    const yearsToConsider = Math.min(currentYear, 5); // Consider at most the last 5 years including current year

    // Calculate proportional taxation for current year
    let currentYearProportionalTaxation = 0;
    if (currentIncome <= 28000) {
        currentYearProportionalTaxation = 23;
    } else if (currentIncome <= 50000) {
        const bracket1Amount = 28000;
        const bracket2Amount = currentIncome - 28000;
        currentYearProportionalTaxation =
            (bracket1Amount / currentIncome) * 23 +
            (bracket2Amount / currentIncome) * 35;
    } else {
        const bracket1Amount = 28000;
        const bracket2Amount = 22000; // 50k - 28k
        const bracket3Amount = currentIncome - 50000;
        currentYearProportionalTaxation =
            (bracket1Amount / currentIncome) * 23 +
            (bracket2Amount / currentIncome) * 35 +
            (bracket3Amount / currentIncome) * 43;
    }

    totalProportionalTaxation += currentYearProportionalTaxation;

    // Add proportional taxation from previous years (up to 4 previous years for a total of 5)
    const previousYearsToConsider = Math.min(currentYear - 1, 4);
    for (let i = 0; i < previousYearsToConsider; i++) {
        const yearIndex = currentYear - 2 - i; // Index in yearlyResults array (0-based)
        if (yearIndex >= 0) {
            const yearData = yearlyResults[yearIndex];
            const income = yearData.income;

            let proportionalTaxation = 0;

            // Calculate proportional taxation based on income brackets
            if (income <= 28000) {
                proportionalTaxation = 23;
            } else if (income <= 50000) {
                const bracket1Amount = 28000;
                const bracket2Amount = income - 28000;
                proportionalTaxation =
                    (bracket1Amount / income) * 23 +
                    (bracket2Amount / income) * 35;
            } else {
                const bracket1Amount = 28000;
                const bracket2Amount = 22000; // 50k - 28k
                const bracket3Amount = income - 50000;
                proportionalTaxation =
                    (bracket1Amount / income) * 23 +
                    (bracket2Amount / income) * 35 +
                    (bracket3Amount / income) * 43;
            }

            totalProportionalTaxation += proportionalTaxation;
        }
    }

    return totalProportionalTaxation / yearsToConsider;
}

// Function to calculate IRPEF tax amount on a given income
function calculateIrpefTax(income: number, currentYearIncome: number): number {
    // Calculate proportional taxation based on current year income brackets (like TFR)
    let effectiveRate = 0;

    if (currentYearIncome <= 28000) {
        effectiveRate = 23;
    } else if (currentYearIncome <= 50000) {
        const bracket1Amount = 28000;
        const bracket2Amount = currentYearIncome - 28000;
        effectiveRate =
            (bracket1Amount / currentYearIncome) * 23 +
            (bracket2Amount / currentYearIncome) * 35;
    } else {
        const bracket1Amount = 28000;
        const bracket2Amount = 22000; // 50k - 28k
        const bracket3Amount = currentYearIncome - 50000;
        effectiveRate =
            (bracket1Amount / currentYearIncome) * 23 +
            (bracket2Amount / currentYearIncome) * 35 +
            (bracket3Amount / currentYearIncome) * 43;
    }

    return income * (effectiveRate / 100);
}

// Function to calculate effective IRPEF tax rate (mean aliquota)
function calculateEffectiveIrpefRate(
    income: number,
    currentYearIncome: number
): number {
    // Calculate proportional taxation based on current year income brackets
    if (currentYearIncome <= 28000) {
        return 23;
    } else if (currentYearIncome <= 50000) {
        const bracket1Amount = 28000;
        const bracket2Amount = currentYearIncome - 28000;
        return (
            (bracket1Amount / currentYearIncome) * 23 +
            (bracket2Amount / currentYearIncome) * 35
        );
    } else {
        const bracket1Amount = 28000;
        const bracket2Amount = 22000; // 50k - 28k
        const bracket3Amount = currentYearIncome - 50000;
        return (
            (bracket1Amount / currentYearIncome) * 23 +
            (bracket2Amount / currentYearIncome) * 35 +
            (bracket3Amount / currentYearIncome) * 43
        );
    }
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
    let tfrGrossAccumulated = 0; // Track accumulated TFR gross value
    let etfAccumulatedValue = 0; // Track accumulated ETF value
    let personalAccumulatedValue = 0; // Track accumulated personal investment value (gross)
    let personalNetAccumulatedValue = 0; // Track accumulated personal investment value (net, after taxes)
    let totalEtfContributions = 0; // Track total ETF contributions
    let totalPersonalInvestments = 0; // Track total personal investments

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

        // Calculate employer contribution only if TFR is included
        const employerContribution = params.calculateTfr
            ? currentIncome * (params.employerContribution / 100)
            : 0;

        // Calculate TFR (Trattamento di Fine Rapporto)
        const tfr = params.calculateTfr ? currentIncome * 0.0741 : 0;

        // Calculate member contribution only if TFR is included
        const memberContribution = params.calculateTfr
            ? currentIncome * (params.memberContribution / 100)
            : 0;

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

        // Calculate TFR taxation rate (mean of current and previous years proportional taxation)
        const tfrTaxationRate = calculateTfrTaxationRate(
            yearlyResults,
            year,
            currentIncome
        );

        // Calculate TFR gross value in company with yearly revaluation (1.5% + 75% of inflation)
        const tfrRevaluationRate = 1.5 + 0.75 * params.inflation;
        // Apply yearly revaluation to previous accumulated amount, then add current year TFR with its revaluation
        tfrGrossAccumulated =
            tfrGrossAccumulated * (1 + tfrRevaluationRate / 100) +
            tfr * (1 + tfrRevaluationRate / 100);

        // Calculate TFR net value (applying taxation)
        const tfrNetValue = tfrGrossAccumulated * (1 - tfrTaxationRate / 100);

        // Calculate TFR net real value (adjusted for inflation)
        const tfrNetRealValue =
            tfrNetValue / Math.pow(1 + params.inflation / 100, year);

        // Total yearly contributions (excluding TFR which is handled separately)
        const yearlyContributionsExcludingTfr =
            currentInvestment + employerContribution + memberContribution;

        // Total yearly contributions (for display purposes)
        const totalYearlyContributions = yearlyContributionsExcludingTfr + tfr;

        // Calculate tax rate based on years in pension fund
        // 15% for first 15 years, then decreases by 0.3% per year until 9% at 35 years
        const calculateTaxRate = (years: number): number => {
            if (years <= 15) return 15;
            if (years >= 35) return 9;
            return 15 - (years - 15) * 0.3;
        };

        const taxRate = calculateTaxRate(year);

        // Calculate gross accumulated value with monthly compounding
        // TFR: 11 monthly portions (months 1-11) + double portion in December (12th + 13th month)
        accumulatedValue = calculatePensionFundMonthlyCompound(
            accumulatedValue,
            yearlyContributionsExcludingTfr,
            tfr,
            params.pensionFundReturn
        );

        // Calculate net accumulated value (after taxes applied to total value)
        // Tax is applied to the entire accumulated value at withdrawal
        netAccumulatedValue = accumulatedValue * (1 - taxRate / 100);

        // Calculate real values (adjusted for inflation)
        const realValue =
            accumulatedValue / Math.pow(1 + params.inflation / 100, year);
        const netRealValue =
            netAccumulatedValue / Math.pow(1 + params.inflation / 100, year);

        // ETF reinvestment calculations
        const etfInvestment = params.etfReinvestment.enabled
            ? totalFiscalRelaxation
            : 0;

        if (params.etfReinvestment.enabled) {
            // ETF calculation with monthly compound interest (similar to pension fund):
            etfAccumulatedValue = calculateETFMonthlyCompound(
                etfAccumulatedValue,
                etfInvestment,
                params.etfReinvestment.annualReturn
            );
            totalEtfContributions += etfInvestment;
        }

        // Calculate ETF net values (after taxation on gains only)
        const etfGains = params.etfReinvestment.enabled
            ? Math.max(0, etfAccumulatedValue - totalEtfContributions)
            : 0;
        const etfTaxOnGains = etfGains * (params.etfReinvestment.taxRate / 100);
        const etfNetAccumulatedValue = params.etfReinvestment.enabled
            ? etfAccumulatedValue - etfTaxOnGains
            : 0;

        // Calculate ETF net real value (adjusted for inflation)
        const etfNetRealValue = params.etfReinvestment.enabled
            ? etfNetAccumulatedValue /
              Math.pow(1 + params.inflation / 100, year)
            : 0;

        // Personal investment calculations (investing total personal contributions after IRPEF tax)
        const totalPersonalContributions =
            memberContribution + currentInvestment;
        const irpefTaxOnPersonalContributions = params.personalInvestment
            .enabled
            ? calculateIrpefTax(totalPersonalContributions, currentIncome)
            : 0;
        const personalInvestmentAmount = params.personalInvestment.enabled
            ? totalPersonalContributions - irpefTaxOnPersonalContributions
            : 0;
        const personalIrpefRate = params.personalInvestment.enabled
            ? calculateEffectiveIrpefRate(
                  totalPersonalContributions,
                  currentIncome
              )
            : 0;

        if (params.personalInvestment.enabled) {
            // Personal investment calculation with monthly compound interest,
            // but taxes applied only at year end

            // Calculate gross accumulated value using monthly compounding
            personalAccumulatedValue = calculateETFMonthlyCompound(
                personalAccumulatedValue,
                personalInvestmentAmount,
                params.personalInvestment.annualReturn
            );

            // Track total contributions for reference
            totalPersonalInvestments += personalInvestmentAmount;

            // Calculate total gains accumulated so far
            const totalGains = Math.max(
                0,
                personalAccumulatedValue - totalPersonalInvestments
            );

            // Apply tax only on total gains (not monthly, but on cumulative gains)
            const totalTaxOnGains =
                totalGains * (params.personalInvestment.taxRate / 100);

            // Calculate net accumulated value (gross - total tax on all gains)
            personalNetAccumulatedValue =
                personalAccumulatedValue - totalTaxOnGains;
        }

        const displayPersonalNetAccumulatedValue = personalNetAccumulatedValue;

        // Calculate personal investment net real value (adjusted for inflation)
        const personalNetRealValue = params.personalInvestment.enabled
            ? displayPersonalNetAccumulatedValue /
              Math.pow(1 + params.inflation / 100, year)
            : 0;

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
            tfrTaxationRate,
            tfrGrossValue: tfrGrossAccumulated,
            tfrNetValue,
            tfrNetRealValue,
            etfInvestment,
            etfAccumulatedValue: params.etfReinvestment.enabled
                ? etfAccumulatedValue
                : 0,
            etfNetAccumulatedValue,
            etfNetRealValue,
            personalInvestmentAmount,
            personalContributionsAfterIrpef: params.personalInvestment.enabled
                ? personalInvestmentAmount
                : 0,
            personalIrpefRate,
            personalTaxRate: params.personalInvestment.enabled
                ? params.personalInvestment.taxRate
                : 0,
            personalAccumulatedValue: params.personalInvestment.enabled
                ? personalAccumulatedValue
                : 0,
            personalNetAccumulatedValue: displayPersonalNetAccumulatedValue,
            personalNetRealValue,
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

    // ETF summary calculations
    const totalEtfInvestment = params.etfReinvestment.enabled
        ? yearlyResults.reduce((sum, result) => sum + result.etfInvestment, 0)
        : 0;
    const finalEtfValue = params.etfReinvestment.enabled
        ? etfAccumulatedValue
        : 0;
    // Fix: Calculate net ETF value using the same method as yearly calculations (tax only gains)
    const etfTotalGains = params.etfReinvestment.enabled
        ? Math.max(0, finalEtfValue - totalEtfInvestment)
        : 0;
    const etfTaxOnGains =
        etfTotalGains * (params.etfReinvestment.taxRate / 100);
    const netFinalEtfValue = params.etfReinvestment.enabled
        ? finalEtfValue - etfTaxOnGains
        : 0;
    const netRealFinalEtfValue = params.etfReinvestment.enabled
        ? netFinalEtfValue /
          Math.pow(1 + params.inflation / 100, params.duration)
        : 0;
    const etfAnnualizedReturn =
        params.etfReinvestment.enabled && totalEtfInvestment > 0
            ? Math.pow(
                  netFinalEtfValue / totalEtfInvestment,
                  1 / params.duration
              ) - 1
            : 0;

    // Personal investment summary calculations
    const totalPersonalInvestment = params.personalInvestment.enabled
        ? yearlyResults.reduce(
              (sum, result) => sum + result.personalInvestmentAmount,
              0
          )
        : 0;
    const finalPersonalValue = params.personalInvestment.enabled
        ? personalAccumulatedValue
        : 0;
    // Fix: Calculate net personal value using the same method as yearly calculations (tax only gains)
    const personalTotalGains = params.personalInvestment.enabled
        ? Math.max(0, finalPersonalValue - totalPersonalInvestment)
        : 0;
    const personalTaxOnGains =
        personalTotalGains * (params.personalInvestment.taxRate / 100);
    const netFinalPersonalValue = params.personalInvestment.enabled
        ? finalPersonalValue - personalTaxOnGains
        : 0;
    const netRealFinalPersonalValue = params.personalInvestment.enabled
        ? netFinalPersonalValue /
          Math.pow(1 + params.inflation / 100, params.duration)
        : 0;
    const personalAnnualizedReturn =
        params.personalInvestment.enabled && totalPersonalInvestment > 0
            ? Math.pow(
                  netFinalPersonalValue / totalPersonalInvestment,
                  1 / params.duration
              ) - 1
            : 0;

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
        totalEtfInvestment,
        finalEtfValue,
        netFinalEtfValue,
        netRealFinalEtfValue,
        etfAnnualizedReturn: etfAnnualizedReturn * 100,
        totalPersonalInvestment,
        finalPersonalValue,
        netFinalPersonalValue,
        netRealFinalPersonalValue,
        personalAnnualizedReturn: personalAnnualizedReturn * 100,
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
        "FP Lordo",
        "FP Netto",
        "FP Reale Lordo",
        "FP Reale Netto",
        "TFR Aliquota Tassazione (%)",
        "TFR Valore Lordo Azienda",
        "TFR Valore Netto Azienda",
        "TFR Valore Netto Reale Azienda",
        "ETF Lordo",
        "ETF Netto",
        "ETF Reale Netto",
        "ETF Aliquota (%)",
        "Investimento Personale Annuale",
        "Contributi Personali Dopo IRPEF",
        "Investimento Personale Lordo",
        "Investimento Personale Netto",
        "Investimento Personale Reale Netto",
        "Investimento Personale Aliquota (%)",
    ];

    // Calculate ETF tax rate from the data (it's consistent across all years)
    const etfTaxRate = results.find(
        (r) => r.etfAccumulatedValue > 0 && r.etfNetAccumulatedValue > 0
    )
        ? (1 -
              results.find((r) => r.etfAccumulatedValue > 0)!
                  .etfNetAccumulatedValue /
                  results.find((r) => r.etfAccumulatedValue > 0)!
                      .etfAccumulatedValue) *
          100
        : 0;

    // Calculate personal investment tax rate from the data (it's consistent across all years)
    const personalTaxRate = results.find(
        (r) =>
            r.personalAccumulatedValue > 0 && r.personalNetAccumulatedValue > 0
    )
        ? (1 -
              results.find((r) => r.personalAccumulatedValue > 0)!
                  .personalNetAccumulatedValue /
                  results.find((r) => r.personalAccumulatedValue > 0)!
                      .personalAccumulatedValue) *
          100
        : 0;

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
                result.tfrTaxationRate.toFixed(1),
                result.tfrGrossValue.toFixed(2),
                result.tfrNetValue.toFixed(2),
                result.tfrNetRealValue.toFixed(2),
                result.etfAccumulatedValue.toFixed(2),
                result.etfNetAccumulatedValue.toFixed(2),
                result.etfNetRealValue.toFixed(2),
                result.etfInvestment > 0 ? etfTaxRate.toFixed(1) : "0.0",
                result.personalInvestmentAmount.toFixed(2),
                result.personalContributionsAfterIrpef.toFixed(2),
                result.personalAccumulatedValue.toFixed(2),
                result.personalNetAccumulatedValue.toFixed(2),
                result.personalNetRealValue.toFixed(2),
                result.personalInvestmentAmount > 0
                    ? personalTaxRate.toFixed(1)
                    : "0.0",
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
