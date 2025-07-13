// Modular charts component with Chart.js registration
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CalculationResult } from "@/types/calculator";
import { formatCurrency } from "@/utils/calculator";

// Dynamically import all chart components to ensure no SSR issues
const AccumulationChart = dynamic(
    () =>
        import("./charts/AccumulationChart").then((mod) => ({
            default: mod.AccumulationChart,
        })),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="h-[48rem] flex items-center justify-center">
                    <div className="text-gray-500">Caricamento grafico...</div>
                </div>
            </div>
        ),
    }
);

const ContributionsChart = dynamic(
    () =>
        import("./charts/ContributionsChart").then((mod) => ({
            default: mod.ContributionsChart,
        })),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="h-80 flex items-center justify-center">
                    <div className="text-gray-500">Caricamento grafico...</div>
                </div>
            </div>
        ),
    }
);

const AnnualTaxBenefitsChart = dynamic(
    () =>
        import("./charts/AnnualTaxBenefitsChart").then((mod) => ({
            default: mod.AnnualTaxBenefitsChart,
        })),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="h-64 flex items-center justify-center">
                    <div className="text-gray-500">Caricamento grafico...</div>
                </div>
            </div>
        ),
    }
);

const CumulativeTaxBenefitsChart = dynamic(
    () =>
        import("./charts/CumulativeTaxBenefitsChart").then((mod) => ({
            default: mod.CumulativeTaxBenefitsChart,
        })),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="h-64 flex items-center justify-center">
                    <div className="text-gray-500">Caricamento grafico...</div>
                </div>
            </div>
        ),
    }
);

const TfrComparisonChart = dynamic(
    () =>
        import("./charts/TfrComparisonChart").then((mod) => ({
            default: mod.TfrComparisonChart,
        })),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="h-96 flex items-center justify-center">
                    <div className="text-gray-500">Caricamento grafico...</div>
                </div>
            </div>
        ),
    }
);

interface ChartsProps {
    results: CalculationResult;
}

export function Charts({ results }: ChartsProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsClient(true);
        }
    }, []);

    if (!isClient) {
        return (
            <div className="space-y-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                    <div className="h-64 flex items-center justify-center">
                        <div className="text-gray-500">
                            Caricamento grafici...
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            {/* TFR Comparison Chart - Show first for better comparison */}
            <TfrComparisonChart results={results} />

            {/* Growth Over Time Chart */}
            <AccumulationChart results={results} />

            {/* Contributions Breakdown Chart */}
            <ContributionsChart results={results} />

            {/* Tax Benefits Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    🏛️ Benefici Fiscali
                </h2>

                {/* Annual Tax Benefits Chart */}
                <AnnualTaxBenefitsChart results={results} />

                {/* Cumulative Tax Benefits Chart */}
                <CumulativeTaxBenefitsChart results={results} />
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
