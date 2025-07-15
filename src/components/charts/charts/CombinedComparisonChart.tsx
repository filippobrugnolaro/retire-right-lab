// Combined Comparison Chart - Net Values and Real Values in one chart
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

interface CombinedComparisonChartProps {
    results: CalculationResult;
}

export function CombinedComparisonChart({
    results,
}: CombinedComparisonChartProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Check if TFR data exists
    const hasTfrData = results.yearlyResults.some(
        (result) => result.tfrNetValue > 0
    );

    // Check if ETF and personal investment data exist
    const hasEtfData = results.yearlyResults.some(
        (result) => result.etfNetAccumulatedValue > 0
    );
    const hasPersonalData = results.yearlyResults.some(
        (result) => result.personalNetAccumulatedValue > 0
    );

    if (!hasTfrData) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-center py-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        🏢 Confronto Combinato non disponibile
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

    // Data for pension fund values
    const pensionFundNetData = results.yearlyResults.map(
        (result) => result.netAccumulatedValue
    );
    const pensionFundRealData = results.yearlyResults.map(
        (result) => result.netRealValue
    );

    // Data for TFR company values
    const tfrNetData = results.yearlyResults.map(
        (result) => result.tfrNetValue
    );
    const tfrRealData = results.yearlyResults.map(
        (result) => result.tfrNetRealValue
    );

    // Combined data (Pension Fund + ETF)
    const combinedNetData = results.yearlyResults.map(
        (result) => result.netAccumulatedValue + result.etfNetAccumulatedValue
    );
    const combinedRealData = results.yearlyResults.map(
        (result) => result.netRealValue + result.etfNetRealValue
    );

    // Combined TFR + Personal Investment data
    const tfrPlusPersonalNetData = results.yearlyResults.map(
        (result) => result.tfrNetValue + result.personalNetAccumulatedValue
    );
    const tfrPlusPersonalRealData = results.yearlyResults.map(
        (result) => result.tfrNetRealValue + result.personalNetRealValue
    );

    const data = {
        labels: years,
        datasets: [
            // Net values datasets
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
                // Solid line for Netto
            },
            // Real values datasets with solid style
            {
                label: "Fondo Pensione (Reale)",
                data: pensionFundRealData,
                borderColor: CHART_COLORS.primary.cyan,
                backgroundColor: CHART_COLORS.background.cyan,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.2,
            },
            {
                label: "TFR Azienda (Reale)",
                data: tfrRealData,
                borderColor: CHART_COLORS.primary.pink,
                backgroundColor: CHART_COLORS.background.pink,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.2,
            },
            // ETF combined datasets - conditional
            ...(hasEtfData
                ? [
                      {
                          label: "Fondo + ETF (Netto)",
                          data: combinedNetData,
                          borderColor: "rgb(239, 68, 68)", // Red color
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          borderWidth: 3,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                          tension: 0.2,
                          // Solid line for Netto
                      },
                      {
                          label: "Fondo + ETF (Reale)",
                          data: combinedRealData,
                          borderColor: "rgb(168, 85, 247)", // Lighter purple/violet
                          backgroundColor: "rgba(168, 85, 247, 0.1)",
                          borderWidth: 2,
                          pointRadius: 3,
                          pointHoverRadius: 5,
                          tension: 0.2,
                      },
                  ]
                : []),
            // Personal investment combined datasets - conditional
            ...(hasPersonalData
                ? [
                      {
                          label: "TFR + Investimento Contributi Personali (Netto)",
                          data: tfrPlusPersonalNetData,
                          borderColor: CHART_COLORS.primary.blue,
                          backgroundColor: CHART_COLORS.background.blue,
                          borderWidth: 3,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                          tension: 0.2,
                          // Solid line for Netto
                      },
                      {
                          label: "TFR + Investimento Contributi Personali (Reale)",
                          data: tfrPlusPersonalRealData,
                          borderColor: "rgb(99, 102, 241)", // Indigo color
                          backgroundColor: "rgba(99, 102, 241, 0.1)",
                          borderWidth: 2,
                          pointRadius: 3,
                          pointHoverRadius: 5,
                          tension: 0.2,
                      },
                  ]
                : []),
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
                    padding: 15,
                    font: {
                        size: 11,
                        weight: "bold" as const,
                    },
                    // Keep all legend labels
                    filter: function () {
                        return true; // Show all labels
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
    const finalPensionNetValue =
        pensionFundNetData[pensionFundNetData.length - 1];
    const finalPensionRealValue =
        pensionFundRealData[pensionFundRealData.length - 1];
    const finalTfrNetValue = tfrNetData[tfrNetData.length - 1];
    const finalTfrRealValue = tfrRealData[tfrRealData.length - 1];
    const finalCombinedNetValue = hasEtfData
        ? combinedNetData[combinedNetData.length - 1]
        : 0;
    const finalCombinedRealValue = hasEtfData
        ? combinedRealData[combinedRealData.length - 1]
        : 0;
    const finalTfrPlusPersonalNetValue = hasPersonalData
        ? tfrPlusPersonalNetData[tfrPlusPersonalNetData.length - 1]
        : 0;
    const finalTfrPlusPersonalRealValue = hasPersonalData
        ? tfrPlusPersonalRealData[tfrPlusPersonalRealData.length - 1]
        : 0;

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    📊 Crescita del Capitale nel Tempo: Vista Completa
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                    Tutti i confronti uniti in un unico grafico: Fondo Pensione,
                    TFR, ETF e Investimenti Personali (valori netti e reali)
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                        <span className="w-3 h-0.5 bg-green-500 mr-2"></span>
                        💰 Valori Netti (dopo tassazione)
                    </span>
                    <span className="flex items-center">
                        <span className="w-3 h-0.5 bg-cyan-500 mr-2"></span>
                        💎 Valori Reali (potere d&apos;acquisto)
                    </span>
                </div>
            </div>

            {isVisible && (
                <div className="h-[32rem]">
                    <Line data={data} options={options} />
                </div>
            )}

            {/* Enhanced Comparison Summary */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                <h4 className="font-bold text-gray-800 mb-4 text-center">
                    📊 Confronto Finale: Valori Netti vs Reali
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left side - Pension Fund data */}
                    <div className="bg-white/80 rounded-lg p-4 border border-green-200">
                        <h5 className="font-semibold text-green-700 mb-3 text-center">
                            🏛️ Fondo Pensione
                        </h5>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">
                                        Valore Netto 💰
                                    </p>
                                    <p className="text-lg font-bold text-green-600">
                                        {formatCurrency(finalPensionNetValue)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">
                                        Valore Reale 💎
                                    </p>
                                    <p className="text-lg font-bold text-cyan-600">
                                        {formatCurrency(finalPensionRealValue)}
                                    </p>
                                </div>
                            </div>
                            {hasEtfData && (
                                <div className="pt-3 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2 text-center font-medium">
                                        Fondo + ETF Combinato
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-600 mb-1">
                                                Netto 💰
                                            </p>
                                            <p className="text-base font-bold text-purple-600">
                                                {formatCurrency(
                                                    finalCombinedNetValue
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-600 mb-1">
                                                Reale 💎
                                            </p>
                                            <p className="text-base font-bold text-purple-500">
                                                {formatCurrency(
                                                    finalCombinedRealValue
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side - TFR data */}
                    <div className="bg-white/80 rounded-lg p-4 border border-orange-200">
                        <h5 className="font-semibold text-orange-700 mb-3 text-center">
                            🏢 TFR e Alternative
                        </h5>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">
                                        TFR Netto 💰
                                    </p>
                                    <p className="text-lg font-bold text-orange-600">
                                        {formatCurrency(finalTfrNetValue)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">
                                        TFR Reale 💎
                                    </p>
                                    <p className="text-lg font-bold text-pink-600">
                                        {formatCurrency(finalTfrRealValue)}
                                    </p>
                                </div>
                            </div>
                            {hasPersonalData && (
                                <div className="pt-3 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2 text-center font-medium">
                                        TFR + Investimento Personale
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-600 mb-1">
                                                Netto 💰
                                            </p>
                                            <p className="text-base font-bold text-blue-600">
                                                {formatCurrency(
                                                    finalTfrPlusPersonalNetValue
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-600 mb-1">
                                                Reale 💎
                                            </p>
                                            <p className="text-base font-bold text-indigo-600">
                                                {formatCurrency(
                                                    finalTfrPlusPersonalRealValue
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Impact of Inflation */}
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <h6 className="font-semibold text-gray-800 mb-2 text-center">
                        💡 Impatto dell&apos;Inflazione
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                            <p className="text-gray-600 mb-1">
                                Erosione Fondo Pensione
                            </p>
                            <p className="font-bold text-yellow-700">
                                -
                                {formatCurrency(
                                    finalPensionNetValue - finalPensionRealValue
                                )}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600 mb-1">Erosione TFR</p>
                            <p className="font-bold text-yellow-700">
                                -
                                {formatCurrency(
                                    finalTfrNetValue - finalTfrRealValue
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
