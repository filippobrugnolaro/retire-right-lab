// Results display component for showing calculation results
"use client";

import { CalculationResult, YearlyResult } from "@/types/calculator";
import { formatCurrency, formatPercentage } from "@/utils/calculator";
import { Charts } from "../charts";

import { CalculatorParams } from "@/types/calculator";

interface ResultsDisplayProps {
    results: CalculationResult;
    isCalculating: boolean;
    onDownloadCSV: () => void;
    showCardsOnly?: boolean;
    showTableOnly?: boolean;
    params?: CalculatorParams;
}

export function ResultsDisplay({
    results,
    isCalculating,
    onDownloadCSV,
    showCardsOnly = false,
    showTableOnly = false,
    params,
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
        return (
            <YearlyResultsTable calculationResult={results} params={params} />
        );
    }

    // Show only cards (or default behavior)
    const lastResult = results.yearlyResults[results.yearlyResults.length - 1];
    const hasTfrData = lastResult?.tfrNetValue > 0;
    const hasEtfData = results.totalEtfInvestment > 0;

    return (
        <div className="space-y-10 pb-8">
            {/* Main Comparison Section */}
            <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-8 rounded-3xl border-2 border-indigo-200/60 shadow-2xl">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center flex items-center justify-center">
                    🏆 Confronto Finale: Fondo Pensione vs TFR Aziendale
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Pension Fund Results */}
                    <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 p-6 rounded-2xl text-white shadow-xl">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🏛️</div>
                            <h3 className="text-xl font-bold mb-4">
                                Fondo Pensione
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm opacity-90">
                                        Valore Finale Netto
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(results.netFinalValue)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-90">
                                        Potere d&apos;Acquisto Reale
                                    </p>
                                    <p className="text-xl font-semibold">
                                        {formatCurrency(
                                            results.netRealFinalValue
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-90">
                                        Rendimento Annualizzato
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {formatPercentage(
                                            results.netAnnualizedReturn
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TFR Company Results */}
                    <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 p-6 rounded-2xl text-white shadow-xl">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🏢</div>
                            <h3 className="text-xl font-bold mb-4">
                                TFR in Azienda
                            </h3>
                            {hasTfrData ? (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm opacity-90">
                                            Valore Finale Netto
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(
                                                lastResult.tfrNetValue
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">
                                            Potere d&apos;Acquisto Reale
                                        </p>
                                        <p className="text-xl font-semibold">
                                            {formatCurrency(
                                                lastResult.tfrNetRealValue
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">
                                            Rendimento Annualizzato
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {formatPercentage(
                                                (() => {
                                                    // TFR grows at 1.5% + 75% of inflation rate
                                                    // Get inflation rate from the calculation parameters
                                                    if (
                                                        results.yearlyResults
                                                            .length === 0
                                                    )
                                                        return 0;

                                                    const firstYear =
                                                        results
                                                            .yearlyResults[0];
                                                    if (
                                                        !firstYear ||
                                                        firstYear.tfr === 0
                                                    )
                                                        return 0;

                                                    // Calculate the annualized return using CAGR formula
                                                    const years =
                                                        results.yearlyResults
                                                            .length;
                                                    const totalTfrContributions =
                                                        results.yearlyResults.reduce(
                                                            (sum, r) =>
                                                                sum + r.tfr,
                                                            0
                                                        );

                                                    if (
                                                        totalTfrContributions ===
                                                            0 ||
                                                        years === 0
                                                    )
                                                        return 0;

                                                    // Use CAGR formula: (Final Value / Initial Investment)^(1/years) - 1
                                                    const annualizedReturn =
                                                        Math.pow(
                                                            lastResult.tfrNetValue /
                                                                totalTfrContributions,
                                                            1 / years - 1
                                                        ) * 100;

                                                    return annualizedReturn;
                                                })()
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-lg opacity-75">
                                        TFR non calcolato
                                    </p>
                                    <p className="text-sm opacity-60">
                                        Attiva il calcolo TFR per vedere il
                                        confronto
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comparison Summary */}
                {hasTfrData && (
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                            📊 Vantaggio Fondo Pensione
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Differenza Netta
                                </p>
                                <p
                                    className={`text-xl font-bold ${
                                        results.netFinalValue >
                                        lastResult.tfrNetValue
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {formatCurrency(
                                        results.netFinalValue -
                                            lastResult.tfrNetValue
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Differenza Reale
                                </p>
                                <p
                                    className={`text-xl font-bold ${
                                        results.netRealFinalValue >
                                        lastResult.tfrNetRealValue
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {formatCurrency(
                                        results.netRealFinalValue -
                                            lastResult.tfrNetRealValue
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Vantaggio %
                                </p>
                                <p
                                    className={`text-xl font-bold ${
                                        results.netFinalValue >
                                        lastResult.tfrNetValue
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {formatPercentage(
                                        (results.netFinalValue /
                                            lastResult.tfrNetValue -
                                            1) *
                                            100
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ETF Reinvestment Results */}
            {hasEtfData && (
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 rounded-3xl border-2 border-emerald-200/60 shadow-2xl">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-8 text-center flex items-center justify-center">
                        📈 Risultati ETF Reinvestimento Detrazioni
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <SummaryCard
                            title="ETF Investimento Totale"
                            value={formatCurrency(results.totalEtfInvestment)}
                            description="Detrazioni reinvestite in ETF"
                            icon="💰"
                            colorScheme="teal"
                        />
                        <SummaryCard
                            title="ETF Finale (Netto)"
                            value={formatCurrency(results.netFinalEtfValue)}
                            description="Valore ETF dopo tassazione"
                            icon="�"
                            colorScheme="green"
                        />
                        <SummaryCard
                            title="ETF Reale (Netto)"
                            value={formatCurrency(results.netRealFinalEtfValue)}
                            description="Potere d'acquisto ETF netto"
                            icon="🏆"
                            colorScheme="orange"
                        />
                        <SummaryCard
                            title="ETF Rendimento"
                            value={formatPercentage(
                                results.etfAnnualizedReturn
                            )}
                            description="Tasso annuo composto ETF"
                            icon="🚀"
                            colorScheme="pink"
                        />
                    </div>

                    {/* Combined Total with ETF */}
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                            🎯 Totale Combinato (Fondo + ETF)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Valore Totale Netto
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        results.netFinalValue +
                                            results.netFinalEtfValue
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Potere d&apos;Acquisto Totale
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(
                                        results.netRealFinalValue +
                                            results.netRealFinalEtfValue
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    vs Solo Fondo
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                    +{formatCurrency(results.netFinalEtfValue)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Personal Investment Results */}
            {results.totalPersonalInvestment > 0 && (
                <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-8 rounded-3xl border-2 border-orange-200/60 shadow-2xl">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-8 text-center flex items-center justify-center">
                        💰 Risultati Investimento Contributi Personali
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <SummaryCard
                            title="Investimento Totale"
                            value={formatCurrency(
                                results.totalPersonalInvestment
                            )}
                            description="Totale contributi personali investiti (dopo IRPEF)"
                            icon="💵"
                            colorScheme="orange"
                        />
                        <SummaryCard
                            title="Investimento Finale (Netto)"
                            value={formatCurrency(
                                results.netFinalPersonalValue
                            )}
                            description="Valore dopo tassazione finale"
                            icon="💎"
                            colorScheme="green"
                        />
                        <SummaryCard
                            title="Investimento Reale (Netto)"
                            value={formatCurrency(
                                results.netRealFinalPersonalValue
                            )}
                            description="Potere d'acquisto netto"
                            icon="🏆"
                            colorScheme="orange"
                        />
                        <SummaryCard
                            title="Rendimento Investimento"
                            value={formatPercentage(
                                results.personalAnnualizedReturn
                            )}
                            description="Tasso annuo composto netto"
                            icon="🚀"
                            colorScheme="pink"
                        />
                    </div>

                    {/* Combined Total: TFR + Personal Investment */}
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                            🎯 Totale Combinato (TFR azienda + Investimento
                            Contributi Personali)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Valore Totale Netto
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        (lastResult?.tfrNetValue || 0) +
                                            results.netFinalPersonalValue
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Potere d&apos;Acquisto Totale
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(
                                        (lastResult?.tfrNetRealValue || 0) +
                                            results.netRealFinalPersonalValue
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    vs Solo TFR
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                    +
                                    {formatCurrency(
                                        results.netFinalPersonalValue
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Summary Cards */}
            <div className="space-y-8">
                <h2 className="text-xl font-bold text-gray-800 text-center">
                    📋 Riepilogo Dettagliato
                </h2>

                {/* Primary Results */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                    <SummaryCard
                        title="Contributi Totali"
                        value={formatCurrency(results.totalContributions)}
                        description="Capitale investito nel fondo"
                        icon="📊"
                        colorScheme="blue"
                    />
                    <SummaryCard
                        title="Guadagno Lordo"
                        value={formatCurrency(
                            results.finalValue - results.totalContributions
                        )}
                        description="Plusvalenza totale"
                        icon="�"
                        colorScheme="green"
                    />
                    <SummaryCard
                        title="Detrazione Fiscale"
                        value={formatCurrency(
                            lastResult?.cumulativeFiscalRelaxation || 0
                        )}
                        description="Risparmio fiscale totale"
                        icon="🏛️"
                        colorScheme="indigo"
                    />
                    <SummaryCard
                        title="ROI Totale"
                        value={formatPercentage(
                            ((results.finalValue - results.totalContributions) /
                                results.totalContributions) *
                                100
                        )}
                        description="Ritorno sull'investimento"
                        icon="📈"
                        colorScheme="purple"
                    />
                </div>

                {/* Secondary Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                    <SummaryCard
                        title="Fondo Finale (Lordo)"
                        value={formatCurrency(results.finalValue)}
                        description="Valore nominale accumulo"
                        icon="💎"
                        colorScheme="teal"
                    />
                    <SummaryCard
                        title="Fondo Reale (Lordo)"
                        value={formatCurrency(results.realFinalValue)}
                        description="Potere d'acquisto lordo"
                        icon="🏆"
                        colorScheme="orange"
                    />
                    <SummaryCard
                        title="Rendimento Lordo"
                        value={formatPercentage(results.annualizedReturn)}
                        description="Tasso annuo composto lordo"
                        icon="🚀"
                        colorScheme="pink"
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
                    <YearlyResultsTable
                        calculationResult={results}
                        params={params}
                    />
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
    calculationResult: CalculationResult;
    params?: CalculatorParams;
}

function YearlyResultsTable({
    calculationResult,
    params,
}: YearlyResultsTableProps) {
    const results = calculationResult.yearlyResults;
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
            {/* Table 1: Contributions - Full width at top */}
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
                                            result.employerContribution +
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

            {/* Second row: Pension Fund and TFR Values side by side */}
            <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
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
                                        Fondo Lordo
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                        Fondo Netto
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider border-r border-blue-400">
                                        Fondo Reale
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                                        Aliquota Fondo (%)
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
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.accumulatedValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-600 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.netAccumulatedValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.netRealValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600 text-center">
                                            {result.taxRate.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gradient-to-r from-blue-100 to-purple-100 font-bold border-t-2 border-blue-400">
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                        FINALE
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.accumulatedValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-600 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.netAccumulatedValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.netRealValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600 text-center">
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
                                        TFR Reale
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
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.tfrGrossValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-teal-600 border-r border-gray-100 text-center">
                                            {formatCurrency(result.tfrNetValue)}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-600 border-r border-gray-100 text-center">
                                            {formatCurrency(
                                                result.tfrNetRealValue
                                            )}
                                        </td>
                                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-orange-600 text-center">
                                            {result.tfrTaxationRate.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gradient-to-r from-orange-100 to-red-100 font-bold border-t-2 border-orange-400">
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                        FINALE
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.tfrGrossValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-teal-600 border-r border-gray-100 text-center">
                                        {formatCurrency(lastResult.tfrNetValue)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-600 border-r border-gray-100 text-center">
                                        {formatCurrency(
                                            lastResult.tfrNetRealValue
                                        )}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-orange-600 text-center">
                                        -
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Third row: ETF and Personal Investment Tables - Side by side if both exist, full width if only one */}
            {(() => {
                const hasEtfData = results.some(
                    (result: YearlyResult) => result.etfInvestment > 0
                );
                const hasPersonalData = results.some(
                    (result: YearlyResult) =>
                        result.personalInvestmentAmount > 0
                );

                if (!hasEtfData && !hasPersonalData) return null;

                const shouldShowSideBySide = hasEtfData && hasPersonalData;

                return (
                    <div
                        className={
                            shouldShowSideBySide
                                ? "grid gap-4 lg:gap-6 grid-cols-1 xl:grid-cols-2"
                                : "w-full"
                        }
                    >
                        {/* ETF Table */}
                        {hasEtfData && (
                            <div className="w-full overflow-hidden">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                                    Valori ETF Reinvestimento
                                </h3>
                                <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-200">
                                    <table className="w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
                                            <tr>
                                                <th className="px-2 sm:px-4 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-emerald-400">
                                                    Anno
                                                </th>
                                                <th className="px-2 sm:px-4 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-emerald-400">
                                                    Detrazione Totale
                                                </th>
                                                <th className="px-2 sm:px-4 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-emerald-400">
                                                    ETF Lordo
                                                </th>
                                                <th className="px-2 sm:px-4 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-emerald-400">
                                                    ETF Netto
                                                </th>
                                                <th className="px-2 sm:px-4 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-emerald-400">
                                                    ETF Reale Netto
                                                </th>
                                                <th className="px-2 sm:px-4 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                                    ETF Aliquota (%)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {results.map((result, index) => (
                                                <tr
                                                    key={result.year}
                                                    className={`hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 ${
                                                        index % 2 === 0
                                                            ? "bg-gray-50/50"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                                        {result.year}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-green-700 border-r border-gray-100 text-center">
                                                        {formatCurrency(
                                                            result.totalFiscalRelaxation
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                                        {formatCurrency(
                                                            result.etfAccumulatedValue
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-emerald-600 border-r border-gray-100 text-center">
                                                        {formatCurrency(
                                                            result.etfNetAccumulatedValue
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-teal-600 border-r border-gray-100 text-center">
                                                        {formatCurrency(
                                                            result.etfNetRealValue
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-red-600 text-center">
                                                        {params &&
                                                        params.etfReinvestment &&
                                                        typeof params
                                                            .etfReinvestment
                                                            .taxRate ===
                                                            "number"
                                                            ? `${params.etfReinvestment.taxRate.toFixed(
                                                                  1
                                                              )}%`
                                                            : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gradient-to-r from-emerald-100 to-teal-100 font-bold border-t-2 border-emerald-400">
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                                    FINALE
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-green-700 border-r border-gray-100 text-center">
                                                    {formatCurrency(
                                                        results.reduce(
                                                            (sum, r) =>
                                                                sum +
                                                                (r.totalFiscalRelaxation ||
                                                                    0),
                                                            0
                                                        )
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                                    {formatCurrency(
                                                        lastResult.etfAccumulatedValue
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-emerald-600 border-r border-gray-100 text-center">
                                                    {formatCurrency(
                                                        lastResult.etfNetAccumulatedValue
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-teal-600 border-r border-gray-100 text-center">
                                                    {formatCurrency(
                                                        lastResult.etfNetRealValue
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-red-600 text-center">
                                                    -
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Personal Investment Table */}
                        {hasPersonalData && (
                            <div className="w-full overflow-hidden">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                                    Valori Investimento Totale Contributi
                                    Personali
                                </h3>
                                <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-200">
                                    <table className="w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-orange-600 to-amber-600">
                                            <tr>
                                                <th className="px-1 sm:px-2 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                                    Anno
                                                </th>
                                                <th className="px-1 sm:px-2 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                                    Contributi Personali
                                                </th>
                                                <th className="px-1 sm:px-2 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                                    Aliquota IRPEF (%)
                                                </th>
                                                <th className="px-1 sm:px-2 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                                    Dopo IRPEF
                                                </th>
                                                <th className="px-1 sm:px-2 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                                    Valore Netto
                                                </th>
                                                <th className="px-1 sm:px-2 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-r border-orange-400">
                                                    Valore Reale
                                                </th>
                                                <th className="px-1 sm:px-2 py-4 text-center text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                                                    Aliquota (%)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {results.map((result, index) => (
                                                <tr
                                                    key={result.year}
                                                    className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-200 ${
                                                        index % 2 === 0
                                                            ? "bg-gray-50"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                                        {result.year}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                                        {formatCurrency(
                                                            result.employerContribution +
                                                                result.memberContribution +
                                                                result.investment
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-red-600 border-r border-gray-100 text-center">
                                                        {result.personalIrpefRate >
                                                        0
                                                            ? `${result.personalIrpefRate.toFixed(
                                                                  1
                                                              )}%`
                                                            : "-"}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                                        {formatCurrency(
                                                            result.personalContributionsAfterIrpef >
                                                                0
                                                                ? result.personalContributionsAfterIrpef
                                                                : result.memberContribution +
                                                                      result.investment
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-emerald-600 border-r border-gray-100 text-center">
                                                        {formatCurrency(
                                                            result.personalNetAccumulatedValue
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-amber-600 border-r border-gray-100 text-center">
                                                        {formatCurrency(
                                                            result.personalNetRealValue
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-red-600 text-center">
                                                        {result.personalTaxRate >
                                                        0
                                                            ? `${result.personalTaxRate.toFixed(
                                                                  1
                                                              )}%`
                                                            : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gradient-to-r from-orange-100 to-amber-100 font-bold border-t-2 border-orange-400">
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-900 border-r border-gray-100 text-center">
                                                    FINALE
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                                    {formatCurrency(
                                                        results.reduce(
                                                            (sum, result) =>
                                                                sum +
                                                                result.memberContribution +
                                                                result.investment,
                                                            0
                                                        )
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-red-600 border-r border-gray-100 text-center">
                                                    -
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-gray-800 border-r border-gray-100 text-center">
                                                    {formatCurrency(
                                                        results.reduce(
                                                            (sum, result) =>
                                                                sum +
                                                                (result.personalContributionsAfterIrpef >
                                                                0
                                                                    ? result.personalContributionsAfterIrpef
                                                                    : result.memberContribution +
                                                                      result.investment),
                                                            0
                                                        )
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-emerald-600 border-r border-gray-100 text-center">
                                                    {formatCurrency(
                                                        lastResult.personalNetAccumulatedValue
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-amber-600 border-r border-gray-100 text-center">
                                                    {formatCurrency(
                                                        lastResult.personalNetRealValue
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-2 py-3 whitespace-nowrap text-xs sm:text-sm font-bold text-red-600 text-center">
                                                    -
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })()}
        </div>
    );
}
