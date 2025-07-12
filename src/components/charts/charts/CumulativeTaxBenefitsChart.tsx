// Cumulative tax benefits chart component
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CalculationResult } from "@/types/calculator";
import { createCumulativeTaxBenefitsChartData } from "../utils/chartDataTransformers";
import { createBaseChartOptions } from "../config/chartOptions";

// Dynamically import the Line component to avoid SSR issues
const LineChart = dynamic(
    async () => {
        // Import and register Chart.js components
        const chartjs = await import("chart.js");
        const reactChartjs = await import("react-chartjs-2");

        // Register Chart.js components
        chartjs.Chart.register(
            chartjs.CategoryScale,
            chartjs.LinearScale,
            chartjs.PointElement,
            chartjs.LineElement,
            chartjs.Title,
            chartjs.Tooltip,
            chartjs.Legend,
            chartjs.Filler
        );

        return { default: reactChartjs.Line };
    },
    {
        ssr: false,
        loading: () => (
            <div className="h-64 flex items-center justify-center">
                <div className="text-gray-500">Caricamento grafico...</div>
            </div>
        ),
    }
);

interface CumulativeTaxBenefitsChartProps {
    results: CalculationResult;
}

export function CumulativeTaxBenefitsChart({
    results,
}: CumulativeTaxBenefitsChartProps) {
    const [chartData, setChartData] = useState<ReturnType<
        typeof createCumulativeTaxBenefitsChartData
    > | null>(null);
    const [chartOptions, setChartOptions] = useState<ReturnType<
        typeof createBaseChartOptions
    > | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                setChartData(createCumulativeTaxBenefitsChartData(results));
                setChartOptions(createBaseChartOptions());
            } catch (error) {
                console.error("Error creating chart data:", error);
            }
        }
    }, [results]);

    if (!chartData || !chartOptions) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    📈 Detrazioni Cumulative
                </h3>
                <div className="h-64 flex items-center justify-center">
                    <div className="text-gray-500">Caricamento grafico...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                📈 Detrazioni Cumulative
            </h3>
            <div className="h-64">
                <LineChart data={chartData} options={chartOptions} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
                Accumulo totale del risparmio fiscale nel tempo
            </p>
        </div>
    );
}
