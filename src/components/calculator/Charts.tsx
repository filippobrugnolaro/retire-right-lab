// Charts component for visualizing pension fund results
"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TooltipItem,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { CalculationResult } from "@/types/calculator";
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
    Legend,
    Filler
);

interface ChartsProps {
    results: CalculationResult;
}

export function Charts({ results }: ChartsProps) {
    const years = results.yearlyResults.map((r) => `Anno ${r.year}`);

    // Chart 1: Accumulated Value Growth Over Time
    const accumulationData = {
        labels: years,
        datasets: [
            {
                label: "Valore Lordo",
                data: results.yearlyResults.map((r) => r.accumulatedValue),
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Valore Netto",
                data: results.yearlyResults.map((r) => r.netAccumulatedValue),
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Valore Reale (Netto)",
                data: results.yearlyResults.map((r) => r.netRealValue),
                borderColor: "rgb(168, 85, 247)",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Contributi Totali",
                data: results.yearlyResults.map((r, index) => {
                    // Calculate cumulative contributions up to this year
                    return results.yearlyResults
                        .slice(0, index + 1)
                        .reduce(
                            (sum, year) => sum + year.totalContributions,
                            0
                        );
                }),
                borderColor: "rgb(249, 115, 22)",
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                fill: false,
                tension: 0.4,
                borderDash: [5, 5], // Dashed line to distinguish from growth lines
                borderWidth: 3,
            },
        ],
    };

    // Chart 2: Annual Contributions Breakdown
    const contributionsData = {
        labels: years,
        datasets: [
            {
                label: "Investimento Personale",
                data: results.yearlyResults.map((r) => r.investment),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
            },
            {
                label: "Contributo Datore",
                data: results.yearlyResults.map((r) => r.employerContribution),
                backgroundColor: "rgba(34, 197, 94, 0.8)",
                borderColor: "rgb(34, 197, 94)",
                borderWidth: 1,
            },
            {
                label: "Contributo Aderente",
                data: results.yearlyResults.map((r) => r.memberContribution),
                backgroundColor: "rgba(168, 85, 247, 0.8)",
                borderColor: "rgb(168, 85, 247)",
                borderWidth: 1,
            },
            {
                label: "TFR",
                data: results.yearlyResults.map((r) => r.tfr),
                backgroundColor: "rgba(249, 115, 22, 0.8)",
                borderColor: "rgb(249, 115, 22)",
                borderWidth: 1,
            },
        ],
    };

    // Chart 3: Tax Benefits Over Time
    const taxBenefitsData = {
        labels: years,
        datasets: [
            {
                label: "Detrazione Annuale",
                data: results.yearlyResults.map((r) => r.totalFiscalRelaxation),
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Detrazione Cumulativa",
                data: results.yearlyResults.map(
                    (r) => r.cumulativeFiscalRelaxation
                ),
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    font: {
                        size: 12,
                        weight: "bold" as const,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: TooltipItem<"line" | "bar">) {
                        return `${
                            tooltipItem.dataset.label || ""
                        }: ${formatCurrency(tooltipItem.parsed.y)}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                type: "linear" as const,
                ticks: {
                    stepSize: 5000, // €5,000 increments
                    maxTicksLimit: 25, // Allow more ticks
                    precision: 0, // No decimal places
                    callback: function (value: string | number) {
                        return formatCurrency(Number(value));
                    },
                },
                grid: {
                    display: true,
                },
                min: 0, // Explicitly set minimum
            },
        },
        interaction: {
            intersect: false,
            mode: "index" as const,
        },
    };

    const barChartOptions = {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            x: {
                stacked: true,
            },
            y: {
                ...chartOptions.scales.y,
                stacked: true,
            },
        },
    };

    return (
        <div className="space-y-8">
            {/* Growth Over Time Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    📈 Crescita del Capitale nel Tempo
                </h3>
                <div className="h-96">
                    <Line data={accumulationData} options={chartOptions} />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                    Confronto tra valore lordo, netto e potere d&apos;acquisto
                    reale del tuo fondo pensione
                </p>
            </div>

            {/* Contributions Breakdown Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    🏗️ Composizione Contributi Annuali
                </h3>
                <div className="h-80">
                    <Bar data={contributionsData} options={barChartOptions} />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                    Dettaglio di tutti i contributi che alimentano il tuo fondo
                    pensione ogni anno
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tax Benefits Chart */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        🏛️ Benefici Fiscali
                    </h3>
                    <div className="h-64">
                        <Line data={taxBenefitsData} options={chartOptions} />
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                        Risparmio fiscale annuale e cumulativo grazie alle
                        detrazioni
                    </p>
                </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    💡 Insights Chiave
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/70 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(
                                results.netFinalValue -
                                    results.totalContributions
                            )}
                        </div>
                        <div className="text-sm text-gray-700 font-medium">
                            Guadagno Totale
                        </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {(
                                ((results.netFinalValue -
                                    results.totalContributions) /
                                    results.totalContributions) *
                                100
                            ).toFixed(1)}
                            %
                        </div>
                        <div className="text-sm text-gray-700 font-medium">
                            ROI Totale
                        </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(
                                results.yearlyResults[
                                    results.yearlyResults.length - 1
                                ]?.cumulativeFiscalRelaxation || 0
                            )}
                        </div>
                        <div className="text-sm text-gray-700 font-medium">
                            Risparmio Fiscale
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
