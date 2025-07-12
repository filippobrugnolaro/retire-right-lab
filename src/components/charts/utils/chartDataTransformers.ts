// Data transformation utilities for charts
import { CalculationResult } from "@/types/calculator";
import { CHART_COLORS, CHART_STYLES } from "../config/chartColors";

export const createAccumulationChartData = (results: CalculationResult) => {
    const years = results.yearlyResults.map((r) => `Anno ${r.year}`);

    return {
        labels: years,
        datasets: [
            {
                label: "Valore Lordo",
                data: results.yearlyResults.map((r) => r.accumulatedValue),
                borderColor: CHART_COLORS.primary.blue,
                backgroundColor: CHART_COLORS.background.blue,
                fill: true,
                tension: CHART_STYLES.tension,
            },
            {
                label: "Valore Netto",
                data: results.yearlyResults.map((r) => r.netAccumulatedValue),
                borderColor: CHART_COLORS.primary.green,
                backgroundColor: CHART_COLORS.background.green,
                fill: true,
                tension: CHART_STYLES.tension,
            },
            {
                label: "Valore Reale (Netto)",
                data: results.yearlyResults.map((r) => r.netRealValue),
                borderColor: CHART_COLORS.primary.purple,
                backgroundColor: CHART_COLORS.background.purple,
                fill: true,
                tension: CHART_STYLES.tension,
            },
            {
                label: "Contributi Totali",
                data: results.yearlyResults.map((r, index) => {
                    return results.yearlyResults
                        .slice(0, index + 1)
                        .reduce(
                            (sum, year) => sum + year.totalContributions,
                            0
                        );
                }),
                borderColor: CHART_COLORS.primary.orange,
                backgroundColor: CHART_COLORS.background.orange,
                fill: false,
                tension: CHART_STYLES.tension,
                borderDash: CHART_STYLES.borderDash.dashed,
                borderWidth: CHART_STYLES.borderWidth.thick,
            },
        ],
    };
};

export const createContributionsChartData = (results: CalculationResult) => {
    const years = results.yearlyResults.map((r) => `Anno ${r.year}`);

    return {
        labels: years,
        datasets: [
            {
                label: "Investimento Personale",
                data: results.yearlyResults.map((r) => r.investment),
                backgroundColor: CHART_COLORS.solid.blue,
                borderColor: CHART_COLORS.primary.blue,
                borderWidth: CHART_STYLES.borderWidth.normal,
            },
            {
                label: "Contributo Datore",
                data: results.yearlyResults.map((r) => r.employerContribution),
                backgroundColor: CHART_COLORS.solid.green,
                borderColor: CHART_COLORS.primary.green,
                borderWidth: CHART_STYLES.borderWidth.normal,
            },
            {
                label: "Contributo Aderente",
                data: results.yearlyResults.map((r) => r.memberContribution),
                backgroundColor: CHART_COLORS.solid.purple,
                borderColor: CHART_COLORS.primary.purple,
                borderWidth: CHART_STYLES.borderWidth.normal,
            },
            {
                label: "TFR",
                data: results.yearlyResults.map((r) => r.tfr),
                backgroundColor: CHART_COLORS.solid.orange,
                borderColor: CHART_COLORS.primary.orange,
                borderWidth: CHART_STYLES.borderWidth.normal,
            },
        ],
    };
};

export const createAnnualTaxBenefitsChartData = (
    results: CalculationResult
) => {
    const years = results.yearlyResults.map((r) => `Anno ${r.year}`);

    return {
        labels: years,
        datasets: [
            {
                label: "Detrazione Annuale",
                data: results.yearlyResults.map((r) => r.totalFiscalRelaxation),
                borderColor: CHART_COLORS.primary.green,
                backgroundColor: CHART_COLORS.background.green,
                fill: true,
                tension: CHART_STYLES.tension,
            },
        ],
    };
};

export const createCumulativeTaxBenefitsChartData = (
    results: CalculationResult
) => {
    const years = results.yearlyResults.map((r) => `Anno ${r.year}`);

    return {
        labels: years,
        datasets: [
            {
                label: "Detrazione Cumulativa",
                data: results.yearlyResults.map(
                    (r) => r.cumulativeFiscalRelaxation
                ),
                borderColor: CHART_COLORS.primary.blue,
                backgroundColor: CHART_COLORS.background.blue,
                fill: true,
                tension: CHART_STYLES.tension,
            },
        ],
    };
};
