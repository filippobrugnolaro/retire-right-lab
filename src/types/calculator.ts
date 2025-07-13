export interface CalculatorParams {
    duration: number; // Durata (anni)
    annualIncome: number; // Reddito Annuale (€)
    investment: number; // Investimento (€)
    calculateTfr: boolean; // Calcola TFR
    employerContribution: number; // Contributo Datore (%)
    memberContribution: number; // Quota Aderente (%)
    inflation: number; // Inflazione (%)
    pensionFundReturn: number; // Rendimento FP (%)
    incomeIncrease: {
        amount: number; // Importo o percentuale
        frequency: number; // Frequenza (anni)
        isPercentage: boolean;
    };
    investmentIncrease: {
        amount: number; // Importo o percentuale
        frequency: number; // Frequenza (anni)
        isPercentage: boolean;
    };
    etfReinvestment: {
        enabled: boolean; // Se reinvestire la detrazione totale in ETF
        annualReturn: number; // Rendimento annuale ETF (%)
        taxRate: number; // Tassazione ETF (%)
    };
    personalInvestment: {
        enabled: boolean; // Se investire contributi personali
        annualReturn: number; // Rendimento annuale (%)
        taxRate: number; // Tassazione (%)
    };
}

export interface YearlyResult {
    year: number;
    age?: number;
    income: number;
    investment: number;
    employerContribution: number;
    memberContribution: number; // Worker's contribution
    tfr: number;
    totalContributions: number;
    accumulatedValue: number;
    realValue: number; // Valore reale considerando inflazione (based on gross)
    taxRate: number; // Tax rate for that year
    netAccumulatedValue: number; // After-tax accumulated value
    netRealValue: number; // After-tax real value (inflation adjusted net value)
    // Fiscal relaxation fields
    investmentFiscalRelaxation: number; // Tax savings from investment only
    totalFiscalRelaxation: number; // Total annual tax savings (same as investment)
    cumulativeFiscalRelaxation: number; // Cumulative tax savings
    // TFR company fields
    tfrTaxationRate: number; // Mean taxation percentage for TFR based on last 5 years
    tfrGrossValue: number; // Gross value of TFR in company (revalued annually with 1.5% + 75% of inflation)
    tfrNetValue: number; // Net value of TFR after applying taxation
    tfrNetRealValue: number; // Net value of TFR adjusted for inflation
    // ETF reinvestment fields
    etfInvestment: number; // Annual ETF investment (equals totalFiscalRelaxation if enabled)
    etfAccumulatedValue: number; // ETF accumulated value (gross)
    etfNetAccumulatedValue: number; // ETF accumulated value after taxation
    etfNetRealValue: number; // ETF net value adjusted for inflation
    // Personal investment fields
    personalInvestmentAmount: number; // Annual personal investment (equals memberContribution * 0.74 if enabled)
    personalContributionsAfterIrpef: number; // Total personal contributions after IRPEF taxation
    personalIrpefRate: number; // Effective IRPEF rate applied to personal contributions
    personalTaxRate: number; // Tax rate applied to personal investment gains
    personalAccumulatedValue: number; // Personal investment accumulated value (gross)
    personalNetAccumulatedValue: number; // Personal investment accumulated value after taxation
    personalNetRealValue: number; // Personal investment net value adjusted for inflation
}

export interface CalculationResult {
    yearlyResults: YearlyResult[];
    totalContributions: number;
    finalValue: number;
    realFinalValue: number;
    netFinalValue: number; // After-tax final value
    netRealFinalValue: number; // After-tax real final value (inflation adjusted net)
    totalReturn: number;
    annualizedReturn: number;
    netAnnualizedReturn: number; // After-tax annualized return
    // ETF reinvestment summary
    totalEtfInvestment: number; // Total amount invested in ETF
    finalEtfValue: number; // Final ETF value (gross)
    netFinalEtfValue: number; // Final ETF value after taxation
    netRealFinalEtfValue: number; // Final ETF value after taxation and inflation
    etfAnnualizedReturn: number; // ETF annualized return (net)
    // Personal investment summary
    totalPersonalInvestment: number; // Total amount invested personally
    finalPersonalValue: number; // Final personal investment value (gross)
    netFinalPersonalValue: number; // Final personal investment value after taxation
    netRealFinalPersonalValue: number; // Final personal investment value after taxation and inflation
    personalAnnualizedReturn: number; // Personal investment annualized return (net)
}
