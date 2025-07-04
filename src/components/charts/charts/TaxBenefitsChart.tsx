// Tax benefits chart component
"use client";

import { Line } from "react-chartjs-2";
import { CalculationResult } from "@/types/calculator";
import { createTaxBenefitsChartData } from "../utils/chartDataTransformers";
import { createBaseChartOptions } from "../config/chartOptions";

interface TaxBenefitsChartProps {
    results: CalculationResult;
}

export function TaxBenefitsChart({ results }: TaxBenefitsChartProps) {
    const chartData = createTaxBenefitsChartData(results);
    const chartOptions = createBaseChartOptions();

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                🏛️ Benefici Fiscali
            </h3>
            <div className="h-64">
                <Line data={chartData} options={chartOptions} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
                Risparmio fiscale annuale e cumulativo grazie alle detrazioni
            </p>
        </div>
    );
}
