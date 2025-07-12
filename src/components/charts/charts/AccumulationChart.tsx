// Accumulation chart component showing growth over time
"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CalculationResult } from "@/types/calculator";
import { createAccumulationChartData } from "../utils/chartDataTransformers";
import { createBaseChartOptions } from "../config/chartOptions";
import { formatCurrency } from "@/utils/calculator";

// Dynamically import the Line component to avoid SSR issues
const LineChart = dynamic(
    async () => {
        // Import and register Chart.js components
        const chartjs = await import("chart.js");
        const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
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
            chartjs.Filler,
            zoomPlugin
        );

        return { default: reactChartjs.Line };
    },
    {
        ssr: false,
        loading: () => (
            <div className="h-[48rem] flex items-center justify-center">
                <div className="text-gray-500">Caricamento grafico...</div>
            </div>
        ),
    }
);

interface AccumulationChartProps {
    results: CalculationResult;
}

export function AccumulationChart({ results }: AccumulationChartProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartRef = useRef<any>(null);
    const [isZoomEnabled, setIsZoomEnabled] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [chartData, setChartData] = useState<ReturnType<
        typeof createAccumulationChartData
    > | null>(null);

    // Ensure component only renders on client side and Chart.js is available
    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsClient(true);
            // Create chart data only on client side
            try {
                const data = createAccumulationChartData(results);
                setChartData(data);
            } catch (error) {
                console.error("Error creating chart data:", error);
            }
        }
    }, [results]);

    // Don't render on server side or if chart data isn't ready
    if (!isClient || !chartData) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        📈 Crescita del Capitale nel Tempo
                    </h3>
                </div>
                <div className="h-[48rem] flex items-center justify-center">
                    <div className="text-gray-500">Caricamento grafico...</div>
                </div>
            </div>
        );
    }

    // Function to reset zoom
    const resetZoom = () => {
        if (chartRef.current && typeof window !== "undefined") {
            const chart = chartRef.current;
            if (chart.resetZoom) {
                chart.resetZoom();
            }
        }
    };

    // Function to toggle zoom mode
    const toggleZoomMode = () => {
        setIsZoomEnabled(!isZoomEnabled);
    };

    // Calculate max value to help Chart.js scale properly
    const maxValue = Math.max(
        ...results.yearlyResults.map((r) =>
            Math.max(r.accumulatedValue, r.netAccumulatedValue, r.netRealValue)
        )
    );

    // Calculate step size for exactly 20 ticks
    const numberOfTicks = 20;
    const calculatedStepSize = Math.ceil(maxValue / (numberOfTicks - 1));

    // Round step size to a nice number (nearest 1000, 5000, 10000, etc.)
    const roundedStepSize = Math.ceil(calculatedStepSize / 1000) * 1000;

    // Calculate max based on the rounded step size
    const suggestedMax = roundedStepSize * (numberOfTicks - 1);

    // Create custom options for accumulation chart with calculated Y-axis increments
    const baseOptions = createBaseChartOptions();
    const customChartOptions = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            zoom: {
                zoom: {
                    wheel: {
                        enabled: isZoomEnabled, // Enable/disable based on state
                        speed: 0.1,
                    },
                    pinch: {
                        enabled: isZoomEnabled, // Enable/disable based on state
                    },
                    mode: "xy" as const, // Allow zooming in both directions
                },
                pan: {
                    enabled: true, // Always enable panning (click and drag)
                    mode: "xy" as const, // Allow panning in both directions
                    speed: 20,
                    threshold: 10,
                },
                limits: {
                    y: {
                        min: 0,
                        max: suggestedMax,
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                type: "linear" as const,
                min: 0,
                max: suggestedMax,
                ticks: {
                    stepSize: roundedStepSize, // Calculated step size for 20 ticks
                    maxTicksLimit: 20, // Exactly 20 ticks
                    precision: 0,
                    callback: function (value: string | number) {
                        return formatCurrency(Number(value));
                    },
                },
                grid: {
                    display: true,
                    color: "rgba(0, 0, 0, 0.1)",
                    lineWidth: 1,
                },
            },
            x: {
                grid: {
                    display: true,
                    color: "rgba(0, 0, 0, 0.05)",
                },
            },
        },
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    📈 Crescita del Capitale nel Tempo
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={toggleZoomMode}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                            isZoomEnabled
                                ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:from-green-600 hover:via-green-700 hover:to-green-700"
                                : "bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:from-red-600 hover:via-red-700 hover:to-red-700"
                        }`}
                        title={
                            isZoomEnabled
                                ? "Disable zoom mode"
                                : "Enable zoom mode"
                        }
                    >
                        {isZoomEnabled ? "🔍 Zoom ON" : "🔍 Zoom OFF"}
                    </button>
                    <button
                        onClick={resetZoom}
                        className="px-3 py-1 text-sm rounded-lg transition-colors duration-200 bg-blue-100 hover:bg-blue-200 text-blue-700"
                        title="Reset zoom"
                    >
                        ↩️ Reset
                    </button>
                </div>
            </div>
            <div className="h-[48rem]">
                <LineChart
                    ref={chartRef}
                    data={chartData}
                    options={customChartOptions}
                />
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4 rounded-r-lg">
                <div className="flex items-start">
                    <div className="text-blue-400 mr-3 text-xl">💡</div>
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-2">
                            Come navigare nel grafico:
                        </p>
                        <ul className="space-y-1 text-xs">
                            <li>
                                <strong>�️ Trascinamento:</strong> Sempre attivo
                                per spostarsi nel grafico
                            </li>
                            <li>
                                <strong>🔍 Zoom:</strong> Attiva il pulsante per
                                usare la rotellina del mouse
                            </li>
                            <li>
                                <strong>🔄 Reset:</strong> Sempre disponibile
                                per tornare alla vista iniziale
                            </li>
                        </ul>
                        <p className="mt-2 text-xs opacity-75">
                            Confronto tra valore lordo, netto e potere
                            d&apos;acquisto reale del tuo fondo pensione
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
