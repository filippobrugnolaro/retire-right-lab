// TFR Comparison Chart - Pension Fund vs Company TFR
"use client";

import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CalculationResult } from "@/types/calculator";
import { CHART_COLORS } from "../config/chartColors";
import { formatCurrency } from "@/utils/calculator";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface TfrComparisonChartProps {
    results: CalculationResult;
}

export function TfrComparisonChart({ results }: TfrComparisonChartProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Check if TFR data exists
    const hasTfrData = results.yearlyResults.some(
        (result) => result.tfrNetValue > 0
    );

    if (!hasTfrData) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-center py-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        🏢 Confronto TFR non disponibile
                    </h3>
                    <p className="text-gray-600">
                        Attiva il calcolo TFR nelle impostazioni per
                        visualizzare il confronto
                    </p>
                </div>
            </div>
        );
    }

    const years = results.yearlyResults.map((result) => result.year);

    // Data for pension fund net values
    const pensionFundNetData = results.yearlyResults.map(
        (result) => result.netAccumulatedValue
    );

    // Data for pension fund real values
    const pensionFundRealData = results.yearlyResults.map(
        (result) => result.netRealValue
    );

    // Data for TFR company net values
    const tfrNetData = results.yearlyResults.map(
        (result) => result.tfrNetValue
    );

    // Data for TFR company real values
    const tfrRealData = results.yearlyResults.map(
        (result) => result.tfrNetRealValue
    );

    // Data for ETF net values (if enabled)
    const hasEtfData = results.totalEtfInvestment > 0;

    // Combined data (Pension Fund + ETF)
    const combinedNetData = results.yearlyResults.map(
        (result) => result.netAccumulatedValue + result.etfNetAccumulatedValue
    );

    const data = {
        labels: years,
        datasets: [
            {
                label: "Fondo Pensione (Netto)",
                data: pensionFundNetData,
                borderColor: CHART_COLORS.primary.green,
                backgroundColor: CHART_COLORS.background.green,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.2,
            },
            {
                label: "TFR Azienda (Netto)",
                data: tfrNetData,
                borderColor: CHART_COLORS.primary.orange,
                backgroundColor: CHART_COLORS.background.orange,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.2,
                borderDash: [5, 5],
            },
            ...(hasEtfData
                ? [
                      {
                          label: "Fondo + ETF (Netto)",
                          data: combinedNetData,
                          borderColor: CHART_COLORS.primary.purple,
                          backgroundColor: CHART_COLORS.background.purple,
                          borderWidth: 3,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                          tension: 0.2,
                      },
                  ]
                : []),
        ],
    };

    const realValueData = {
        labels: years,
        datasets: [
            {
                label: "Fondo Pensione (Reale)",
                data: pensionFundRealData,
                borderColor: CHART_COLORS.primary.cyan,
                backgroundColor: CHART_COLORS.background.cyan,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.2,
            },
            {
                label: "TFR Azienda (Reale)",
                data: tfrRealData,
                borderColor: CHART_COLORS.primary.pink,
                backgroundColor: CHART_COLORS.background.pink,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.2,
                borderDash: [5, 5],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 20,
                    font: {
                        size: 12,
                        weight: "bold" as const,
                    },
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function (context: {
                        dataset: { label?: string };
                        parsed: { y: number };
                    }) {
                        return `${
                            context.dataset.label || ""
                        }: ${formatCurrency(context.parsed.y)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: "Anno",
                    font: {
                        size: 14,
                        weight: "bold" as const,
                    },
                },
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: "Valore (€)",
                    font: {
                        size: 14,
                        weight: "bold" as const,
                    },
                },
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                    callback: function (value: string | number) {
                        return formatCurrency(Number(value));
                    },
                },
            },
        },
    };

    // Calculate final comparison metrics
    const finalPensionValue = pensionFundNetData[pensionFundNetData.length - 1];
    const finalTfrValue = tfrNetData[tfrNetData.length - 1];
    const finalCombinedValue = combinedNetData[combinedNetData.length - 1];
    const advantage = finalPensionValue - finalTfrValue;
    const advantagePercentage = (finalPensionValue / finalTfrValue - 1) * 100;

    return (
        <div className="space-y-6">
            {/* Net Values Comparison */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                        🏆 Confronto Valori Netti: Fondo Pensione vs TFR Azienda
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Evoluzione dei valori netti nel tempo dopo tassazione
                    </p>
                </div>

                {isVisible && (
                    <div className="h-96">
                        <Line data={data} options={options} />
                    </div>
                )}

                {/* Comparison Summary */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 text-center">
                        📊 Riepilogo Confronto Finale
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">
                                Fondo Pensione
                            </p>
                            <p className="text-lg font-bold text-green-600">
                                {formatCurrency(finalPensionValue)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">
                                TFR Azienda
                            </p>
                            <p className="text-lg font-bold text-orange-600">
                                {formatCurrency(finalTfrValue)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">
                                Vantaggio €
                            </p>
                            <p
                                className={`text-lg font-bold ${
                                    advantage >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {advantage >= 0 ? "+" : ""}
                                {formatCurrency(advantage)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">
                                Vantaggio %
                            </p>
                            <p
                                className={`text-lg font-bold ${
                                    advantage >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {advantage >= 0 ? "+" : ""}
                                {advantagePercentage.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {results.totalEtfInvestment > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">
                                    Fondo + ETF Combinato
                                </p>
                                <p className="text-xl font-bold text-purple-600">
                                    {formatCurrency(finalCombinedValue)}
                                </p>
                                <p className="text-sm text-purple-600 font-semibold">
                                    Vantaggio aggiuntivo: +
                                    {formatCurrency(
                                        finalCombinedValue - finalPensionValue
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Real Values Comparison */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                        💰 Confronto Potere d&apos;Acquisto Reale
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Valori reali considerando l&apos;effetto
                        dell&apos;inflazione
                    </p>
                </div>

                {isVisible && (
                    <div className="h-96">
                        <Line data={realValueData} options={options} />
                    </div>
                )}
            </div>
        </div>
    );
}
