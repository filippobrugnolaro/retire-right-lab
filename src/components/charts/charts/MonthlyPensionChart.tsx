// Monthly pension projection chart component
"use client";

import { Bar } from "react-chartjs-2";
import { CalculationResult } from "@/types/calculator";
import { createMonthlyPensionChartData } from "../utils/chartDataTransformers";
import { createBaseChartOptions } from "../config/chartOptions";

interface MonthlyPensionChartProps {
    results: CalculationResult;
    duration: number;
}

export function MonthlyPensionChart({
    results,
    duration,
}: MonthlyPensionChartProps) {
    const chartData = createMonthlyPensionChartData(results, duration);
    const chartOptions = createBaseChartOptions();

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                💳 Proiezione Rendita Mensile
            </h3>
            <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
                Stima della rendita mensile basata sull&apos;accumulo a diversi
                traguardi temporali
            </p>
        </div>
    );
}
