// Accumulation chart component showing growth over time
"use client";

import { Line } from "react-chartjs-2";
import { CalculationResult } from "@/types/calculator";
import { createAccumulationChartData } from "../utils/chartDataTransformers";
import { createBaseChartOptions } from "../config/chartOptions";

interface AccumulationChartProps {
    results: CalculationResult;
}

export function AccumulationChart({ results }: AccumulationChartProps) {
    const chartData = createAccumulationChartData(results);
    const chartOptions = createBaseChartOptions();

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                📈 Crescita del Capitale nel Tempo
            </h3>
            <div className="h-80">
                <Line data={chartData} options={chartOptions} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
                Confronto tra valore lordo, netto e potere d&apos;acquisto reale
                del tuo fondo pensione
            </p>
        </div>
    );
}
