// Results display component for showing calculation results
"use client";

import { CalculationResult, YearlyResult } from "@/types/calculator";
import { formatCurrency, formatPercentage } from "@/utils/calculator";
import { Charts } from "../charts";

interface ResultsDisplayProps {
    results: CalculationResult;
    isCalculating: boolean;
    onDownloadCSV: () => void;
    showCardsOnly?: boolean;
    showTableOnly?: boolean;
}

export function ResultsDisplay({
    results,
    isCalculating,
    onDownloadCSV,
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
        <div className="space-y-10 pb-8">
            {/* Enhanced Summary Cards with Better Responsive Layout */}
            <div className="space-y-8">
                {/* Primary Results - Most Important Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
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
            <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 sm:p-10 rounded-3xl border-2 border-gray-200/60 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group">
                {/* Enhanced decorative background elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-teal-200/20 rounded-full translate-x-16 translate-y-16 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 rounded-full translate-x-12 -translate-y-12 group-hover:scale-125 transition-transform duration-700"></div>

                <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-700 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center">
                        📋 Riepilogo Performance
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
                        <div className="text-center bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 p-4 sm:p-6 lg:p-8 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden group">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>{" "}
                            <div className="relative z-10">
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-sm">
                                    {formatCurrency(
                                        results.finalValue -
                                            results.totalContributions
                                    )}
                                </div>
                                <div className="text-sm sm:text-base font-semibold text-green-100">
                                    💰 Guadagno Totale
                                </div>
                            </div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 p-4 sm:p-6 lg:p-8 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden group">
                            {/* Decorative elements */}
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>

                            <div className="relative z-10">
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-sm">
                                    {formatPercentage(
                                        ((results.finalValue -
                                            results.totalContributions) /
                                            results.totalContributions) *
                                            100
                                    )}
                                </div>
                                <div className="text-sm sm:text-base font-semibold text-blue-100">
                                    📈 ROI Totale
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Charts Section */}
            <div className="bg-gradient-to-br from-gray-50 via-slate-50/50 to-blue-50/50 rounded-3xl p-8 border-2 border-gray-200/60 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full translate-y-14 -translate-x-14 group-hover:scale-110 transition-transform duration-700"></div>

                <div className="relative z-10">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8 flex items-center">
                        📊 Analisi Grafica dei Risultati
                    </h3>
                    <Charts results={results} />
                </div>
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
            className={`${colors.background} ${colors.border} p-4 sm:p-6 lg:p-7 rounded-3xl border-2 ${colors.shadow} shadow-xl ${colors.hoverShadow} hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden group`}
        >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Additional decorative elements */}
            <div className="absolute top-2 right-2 w-16 h-16 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-500"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
                    <h3
                        className={`text-xs sm:text-sm lg:text-sm font-bold ${colors.titleColor} uppercase tracking-wider`}
                    >
                        {title}
                    </h3>
                    <div
                        className={`${colors.iconBg} p-1.5 sm:p-2 lg:p-3 rounded-2xl backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                        <span className="text-lg sm:text-xl lg:text-2xl">
                            {icon}
                        </span>
                    </div>
                </div>
                <p
                    className={`text-lg sm:text-2xl lg:text-3xl font-bold ${colors.valueColor} mb-1.5 sm:mb-2 lg:mb-3 drop-shadow-sm`}
                >
                    {value}
                </p>
                <p
                    className={`text-xs sm:text-sm ${colors.descColor} font-medium leading-relaxed`}
                >
                    {description}
                </p>
            </div>

            {/* Enhanced decorative corner element */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
    );
}

// Yearly Results Table Component
interface YearlyResultsTableProps {
    results: YearlyResult[];
}

// Yearly Results Table Component
interface YearlyResultsTableProps {
    results: YearlyResult[];
}

function YearlyResultsTable({ results }: YearlyResultsTableProps) {
    // Calculate totals for the first table
    const totals = results.reduce(
        (acc, result) => ({
            income: acc.income + result.income,
            tfr: acc.tfr + result.tfr,
            employerContribution:
                acc.employerContribution + result.employerContribution,
            memberContribution:
                acc.memberContribution + result.memberContribution,
            investment: acc.investment + result.investment,
            totalPersonalContributions:
                acc.totalPersonalContributions +
                result.memberContribution +
                result.investment,
            totalFiscalRelaxation:
                acc.totalFiscalRelaxation + result.totalFiscalRelaxation,
        }),
        {
            income: 0,
            tfr: 0,
            employerContribution: 0,
            memberContribution: 0,
            investment: 0,
            totalPersonalContributions: 0,
            totalFiscalRelaxation: 0,
        }
    );

    const lastResult = results[results.length - 1];

    return (
        <div className="space-y-8">
            {/* Table 1: Contributions */}
            <div className="w-full overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Contributi e Detrazioni
                </h3>
                <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-200">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                            <tr>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                    Anno
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                    Reddito
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                    TFR
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                    Contributi Datore
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                    Contributi Aderente
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                    Investimento
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                    Totale Contributi Personali
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                                    Detrazione Totale
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
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                        {result.year}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-700 border-r border-gray-100 text-center">
                                        {formatCurrency(result.income)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-purple-700 border-r border-gray-100 text-center">
                                        {formatCurrency(result.tfr)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            result.employerContribution
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-indigo-700 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            result.memberContribution
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-700 border-r border-gray-100 text-center">
                                        {formatCurrency(result.investment)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-cyan-700 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            result.memberContribution +
                                                result.investment
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-700 text-center">
                                        {formatCurrency(
                                            result.totalFiscalRelaxation
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {/* Totals row */}
                            <tr className="bg-gradient-to-r from-yellow-100 to-orange-100 font-bold border-t-2 border-yellow-400">
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                    TOTALE
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-700 border-r border-gray-100 text-center">
                                    {formatCurrency(totals.income)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-purple-700 border-r border-gray-100 text-center">
                                    {formatCurrency(totals.tfr)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-700 border-r border-gray-100 text-center">
                                    {formatCurrency(
                                        totals.employerContribution
                                    )}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-700 border-r border-gray-100 text-center">
                                    {formatCurrency(totals.memberContribution)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-blue-700 border-r border-gray-100 text-center">
                                    {formatCurrency(totals.investment)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-cyan-700 border-r border-gray-100 text-center">
                                    {formatCurrency(
                                        totals.totalPersonalContributions
                                    )}
                                </td>
                                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-700 text-center">
                                    {formatCurrency(
                                        totals.totalFiscalRelaxation
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tables 2 and 3: Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Table 2: Pension Fund Values */}
                <div className="w-full overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                        Valori Fondo Pensione
                    </h3>
                    <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-200">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                                <tr>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                        Anno
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                        Valore Lordo
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                        Valore Netto
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                        Valore Reale Netto
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                                        Aliquota FP (%)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {results.map((result, index) => (
                                    <tr
                                        key={result.year}
                                        className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                                            index % 2 === 0
                                                ? "bg-gray-50/50"
                                                : "bg-white"
                                        }`}
                                    >
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                            {result.year}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.accumulatedValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-700 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.netAccumulatedValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-700 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.netRealValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-red-700 text-center">
                                            {result.taxRate.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                                {/* Final values row */}
                                <tr className="bg-gradient-to-r from-blue-100 to-purple-100 font-bold border-t-2 border-blue-400">
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                        FINALE
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.accumulatedValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-700 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.netAccumulatedValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-700 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.netRealValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-red-700 text-center">
                                        -
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Table 3: TFR Values */}
                <div className="w-full overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                        Valori TFR Azienda
                    </h3>
                    <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-200">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-orange-600 to-red-600">
                                <tr>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                        Anno
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                        TFR Lordo
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                        TFR Netto
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                        TFR Netto Reale
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                                        TFR Aliquota (%)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {results.map((result, index) => (
                                    <tr
                                        key={result.year}
                                        className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 ${
                                            index % 2 === 0
                                                ? "bg-gray-50/50"
                                                : "bg-white"
                                        }`}
                                    >
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                            {result.year}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.tfrGrossValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-teal-700 border-r border-gray-100 text-center">
                                            {formatCurrency(result.tfrNetValue)}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-700 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.tfrNetRealValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-orange-700 text-center">
                                            {result.tfrTaxationRate.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                                {/* Final values row */}
                                <tr className="bg-gradient-to-r from-orange-100 to-red-100 font-bold border-t-2 border-orange-400">
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                        FINALE
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.tfrGrossValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-teal-700 border-r border-gray-100 text-center">
                                        {formatCurrency(lastResult.tfrNetValue)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-700 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.tfrNetRealValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-orange-700 text-center">
                                        -
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
