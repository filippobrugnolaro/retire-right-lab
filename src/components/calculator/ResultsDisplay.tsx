// Results display component for showing calculation results
"use client";

import { CalculationResult, YearlyResult } from "@/types/calculator";
import { formatCurrency, formatPercentage } from "@/utils/calculator";
import { Charts } from "../charts";

interface ResultsDisplayProps {
    results: CalculationResult;
    isCalculating: boolean;
    onDownloadCSV: () => void;
    duration: number;
    showCardsOnly?: boolean;
    showTableOnly?: boolean;
}

export function ResultsDisplay({
    results,
    isCalculating,
    onDownloadCSV,
    duration,
    showCardsOnly = false,
    showTableOnly = false,
}: ResultsDisplayProps) {
    if (isCalculating) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                <p className="text-lg text-gray-600 font-medium">
                    🔄 Calcolo in corso...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Analizzando i tuoi parametri finanziari
                </p>
            </div>
        );
    }

    // Show only table
    if (showTableOnly) {
        return <YearlyResultsTable results={results.yearlyResults} />;
    }

    // Show only cards (or default behavior)
    return (
        <div className="space-y-8">
            {/* Enhanced Summary Cards with Better Responsive Layout */}
            <div className="space-y-6">
                {/* Primary Results - Most Important Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title="Valore Finale (Netto)"
                        value={formatCurrency(results.netFinalValue)}
                        description="Dopo tassazione"
                        icon="💎"
                        colorScheme="green"
                    />
                    <SummaryCard
                        title="Valore Reale (Netto)"
                        value={formatCurrency(results.netRealFinalValue)}
                        description="Potere d'acquisto netto"
                        icon="🏆"
                        colorScheme="orange"
                    />
                    <SummaryCard
                        title="Contributi Totali"
                        value={formatCurrency(results.totalContributions)}
                        description="Capitale investito"
                        icon="📊"
                        colorScheme="teal"
                    />
                    <SummaryCard
                        title="Rendimento Annualizzato"
                        value={formatPercentage(results.netAnnualizedReturn)}
                        description="Tasso annuo composto netto"
                        icon="🚀"
                        colorScheme="pink"
                    />
                </div>

                {/* Secondary Results - Additional Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SummaryCard
                        title="Valore Finale (Lordo)"
                        value={formatCurrency(results.finalValue)}
                        description="Valore nominale accumulo"
                        icon="💰"
                        colorScheme="blue"
                    />
                    <SummaryCard
                        title="Valore Reale (Lordo)"
                        value={formatCurrency(results.realFinalValue)}
                        description="Potere d'acquisto lordo"
                        icon="📈"
                        colorScheme="purple"
                    />
                    <SummaryCard
                        title="Detrazione Fiscale"
                        value={formatCurrency(
                            results.yearlyResults[
                                results.yearlyResults.length - 1
                            ]?.cumulativeFiscalRelaxation || 0
                        )}
                        description="Risparmio fiscale totale"
                        icon="🏛️"
                        colorScheme="indigo"
                    />
                </div>
            </div>

            {/* Enhanced Performance Summary */}
            <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6 sm:p-8 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full translate-x-12 translate-y-12"></div>

                <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 flex items-center">
                        📋 Riepilogo Performance
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="text-center bg-gradient-to-br from-green-400 to-emerald-500 p-4 sm:p-6 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            <div className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow-sm">
                                {formatCurrency(
                                    results.finalValue -
                                        results.totalContributions
                                )}
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-green-100">
                                💰 Guadagno Totale
                            </div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-blue-400 to-indigo-500 p-4 sm:p-6 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            <div className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow-sm">
                                {formatPercentage(
                                    ((results.finalValue -
                                        results.totalContributions) /
                                        results.totalContributions) *
                                        100
                                )}
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-blue-100">
                                📈 ROI Totale
                            </div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-purple-400 to-pink-500 p-4 sm:p-6 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                            <div className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow-sm">
                                {formatCurrency(
                                    results.finalValue / duration / 12
                                )}
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-purple-100">
                                💳 Rendita Mensile
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Charts Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    📊 Analisi Grafica dei Risultati
                </h3>
                <Charts results={results} duration={duration} />
            </div>

            {/* Show download button and table only if not in cards-only mode */}
            {!showCardsOnly && (
                <>
                    {/* Download Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={onDownloadCSV}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                        >
                            <span>📊</span>
                            <span>Scarica CSV</span>
                        </button>
                    </div>

                    {/* Enhanced Yearly Results Table */}
                    <YearlyResultsTable results={results.yearlyResults} />
                </>
            )}
        </div>
    );
}

// Summary Card Component
interface SummaryCardProps {
    title: string;
    value: string;
    description: string;
    icon: string;
    colorScheme:
        | "blue"
        | "green"
        | "purple"
        | "orange"
        | "teal"
        | "pink"
        | "indigo";
}

function SummaryCard({
    title,
    value,
    description,
    icon,
    colorScheme,
}: SummaryCardProps) {
    const colorClasses = {
        blue: {
            background:
                "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600",
            border: "border-blue-300",
            shadow: "shadow-blue-200/50",
            titleColor: "text-white",
            valueColor: "text-white",
            descColor: "text-blue-100",
            iconBg: "bg-white/20",
            hoverShadow: "hover:shadow-blue-300/60",
        },
        green: {
            background:
                "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600",
            border: "border-emerald-300",
            shadow: "shadow-emerald-200/50",
            titleColor: "text-white",
            valueColor: "text-white",
            descColor: "text-emerald-100",
            iconBg: "bg-white/20",
            hoverShadow: "hover:shadow-emerald-300/60",
        },
        purple: {
            background:
                "bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600",
            border: "border-purple-300",
            shadow: "shadow-purple-200/50",
            titleColor: "text-white",
            valueColor: "text-white",
            descColor: "text-purple-100",
            iconBg: "bg-white/20",
            hoverShadow: "hover:shadow-purple-300/60",
        },
        orange: {
            background:
                "bg-gradient-to-br from-orange-400 via-red-500 to-pink-600",
            border: "border-orange-300",
            shadow: "shadow-orange-200/50",
            titleColor: "text-white",
            valueColor: "text-white",
            descColor: "text-orange-100",
            iconBg: "bg-white/20",
            hoverShadow: "hover:shadow-orange-300/60",
        },
        teal: {
            background:
                "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600",
            border: "border-teal-300",
            shadow: "shadow-teal-200/50",
            titleColor: "text-white",
            valueColor: "text-white",
            descColor: "text-teal-100",
            iconBg: "bg-white/20",
            hoverShadow: "hover:shadow-teal-300/60",
        },
        pink: {
            background:
                "bg-gradient-to-br from-pink-400 via-rose-500 to-red-600",
            border: "border-pink-300",
            shadow: "shadow-pink-200/50",
            titleColor: "text-white",
            valueColor: "text-white",
            descColor: "text-pink-100",
            iconBg: "bg-white/20",
            hoverShadow: "hover:shadow-pink-300/60",
        },
        indigo: {
            background:
                "bg-gradient-to-br from-indigo-400 via-blue-500 to-purple-600",
            border: "border-indigo-300",
            shadow: "shadow-indigo-200/50",
            titleColor: "text-white",
            valueColor: "text-white",
            descColor: "text-indigo-100",
            iconBg: "bg-white/20",
            hoverShadow: "hover:shadow-indigo-300/60",
        },
    };

    const colors = colorClasses[colorScheme];

    return (
        <div
            className={`${colors.background} ${colors.border} p-6 rounded-2xl border-2 ${colors.shadow} shadow-xl ${colors.hoverShadow} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group`}
        >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3
                        className={`text-sm font-bold ${colors.titleColor} uppercase tracking-wider`}
                    >
                        {title}
                    </h3>
                    <div
                        className={`${colors.iconBg} p-2 rounded-xl backdrop-blur-sm`}
                    >
                        <span className="text-2xl">{icon}</span>
                    </div>
                </div>
                <p
                    className={`text-3xl font-bold ${colors.valueColor} mb-2 drop-shadow-sm`}
                >
                    {value}
                </p>
                <p className={`text-sm ${colors.descColor} font-medium`}>
                    {description}
                </p>
            </div>

            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
        </div>
    );
}

// Yearly Results Table Component
interface YearlyResultsTableProps {
    results: YearlyResult[];
}

function YearlyResultsTable({ results }: YearlyResultsTableProps) {
    return (
        <div className="w-full overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-50 to-green-50">
                        <tr>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                📅 Anno
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                💼 Reddito
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                💎 Investimento
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                🏢 Contrib. Datore
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                👤 Contrib. Aderente
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                📋 TFR
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                💸 Detr. Totale
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                📈 Detr. Cumulativa
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                🏛️ Aliquota
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                💰 Valore Lordo
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                                💎 Valore Netto
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                🏆 Valore Reale (Netto)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {results.map((result, index) => (
                            <tr
                                key={result.year}
                                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 ${
                                    index % 2 === 0
                                        ? "bg-gray-50/50"
                                        : "bg-white"
                                }`}
                            >
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100">
                                    {result.year}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-700 border-r border-gray-100">
                                    {formatCurrency(result.income)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-700 border-r border-gray-100">
                                    {formatCurrency(result.investment)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700 border-r border-gray-100">
                                    {formatCurrency(
                                        result.employerContribution
                                    )}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-indigo-700 border-r border-gray-100">
                                    {formatCurrency(result.memberContribution)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-purple-700 border-r border-gray-100">
                                    {formatCurrency(result.tfr)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700 border-r border-gray-100">
                                    {formatCurrency(
                                        result.totalFiscalRelaxation
                                    )}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100">
                                    {formatCurrency(
                                        result.cumulativeFiscalRelaxation
                                    )}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-red-700 border-r border-gray-100">
                                    {result.taxRate.toFixed(1)}%
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100">
                                    {formatCurrency(result.accumulatedValue)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-700 border-r border-gray-100">
                                    {formatCurrency(result.netAccumulatedValue)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-700">
                                    {formatCurrency(result.netRealValue)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
