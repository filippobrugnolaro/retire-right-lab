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
}
