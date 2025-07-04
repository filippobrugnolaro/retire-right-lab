// Contributions breakdown chart component
"use client";

import { Bar } from "react-chartjs-2";
import { CalculationResult } from "@/types/calculator";
import { createContributionsChartData } from "../utils/chartDataTransformers";
import { createStackedBarOptions } from "../config/chartOptions";

interface ContributionsChartProps {
    results: CalculationResult;
}

export function ContributionsChart({ results }: ContributionsChartProps) {
    const chartData = createContributionsChartData(results);
    const chartOptions = createStackedBarOptions();

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                🏗️ Composizione Contributi Annuali
            </h3>
            <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
                Dettaglio di tutti i contributi che alimentano il tuo fondo
                pensione ogni anno
            </p>
        </div>
    );
}
