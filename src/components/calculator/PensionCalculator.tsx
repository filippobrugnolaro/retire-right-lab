"use client";

import { useState, useMemo } from "react";
import { CalculatorParams, CalculationResult } from "@/types/calculator";
import {
    calculatePensionFund,
    exportToCSV,
    downloadCSV,
} from "@/utils/calculator";

// Import all the new modular components
import { CalculatorHeader } from "@/components/ui/CalculatorHeader";
import { ParametersInput } from "@/components/calculator/ParametersInput";
import { ResultsDisplay } from "@/components/calculator/ResultsDisplay";
import { CalculatorFooter } from "@/components/ui/CalculatorFooter";

const defaultParams: CalculatorParams = {
    duration: 40,
    annualIncome: 30000,
    investment: 3000,
    calculateTfr: true,
    employerContribution: 2,
    memberContribution: 1.3,
    inflation: 2,
    pensionFundReturn: 4,
    incomeIncrease: {
        amount: 1000,
        frequency: 1,
        isPercentage: false,
    },
    investmentIncrease: {
        amount: -13,
        frequency: 2,
        isPercentage: true,
    },
    etfReinvestment: {
        enabled: false,
        annualReturn: 7,
        taxRate: 26,
    },
    personalInvestment: {
        enabled: false,
        annualReturn: 7,
        taxRate: 26,
    },
};

export default function PensionCalculator() {
    const [params, setParams] = useState<CalculatorParams>(defaultParams);
    const [isCalculating, setIsCalculating] = useState(false);

    const results: CalculationResult = useMemo(() => {
        setIsCalculating(true);
        const calculation = calculatePensionFund(params);
        setTimeout(() => setIsCalculating(false), 500);
        return calculation;
    }, [params]);

    const updateParam = <K extends keyof CalculatorParams>(
        key: K,
        value: CalculatorParams[K]
    ) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    };

    const updateNestedParam = <
        T extends
            | "incomeIncrease"
            | "investmentIncrease"
            | "etfReinvestment"
            | "personalInvestment"
    >(
        parentKey: T,
        childKey: keyof CalculatorParams[T],
        value: number | boolean
    ) => {
        setParams((prev) => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: value,
            },
        }));
    };

    const handleDownloadCSV = () => {
        const csvContent = exportToCSV(results.yearlyResults);
        downloadCSV(csvContent);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <CalculatorHeader results={results} duration={params.duration} />

            {/* Parameters Section - Full Width Horizontal with Accordion */}
            <div className="w-full px-2 sm:px-4 lg:px-6 py-8">
                <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gray-200/60 p-4 sm:p-6 lg:p-8 hover:shadow-3xl transition-all duration-500 relative overflow-hidden group">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-teal-200/20 rounded-full translate-x-16 translate-y-16 group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                                ⚙️ Parametri di Calcolo
                            </h2>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-lg"></div>
                                <span className="text-sm font-semibold text-gray-600 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full">
                                    Tempo Reale
                                </span>
                            </div>
                        </div>

                        <ParametersInput
                            params={params}
                            updateParam={updateParam}
                            updateNestedParam={updateNestedParam}
                        />
                    </div>
                </div>
            </div>

            {/* Table Section - Full Width */}
            <div className="w-full px-2 sm:px-4 lg:px-6 py-8">
                <div className="bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gray-200/60 p-4 sm:p-6 lg:p-8 hover:shadow-3xl transition-all duration-500 relative overflow-hidden group">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full -translate-y-18 translate-x-18 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full translate-y-14 -translate-x-14 group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 via-green-600 to-blue-600 bg-clip-text text-transparent flex items-center">
                                📅 Dettaglio Anno per Anno
                            </h2>
                            <button
                                onClick={handleDownloadCSV}
                                className="px-8 py-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:via-green-800 hover:to-emerald-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3 border border-green-500/20"
                            >
                                <span className="text-lg">📊</span>
                                <span>Scarica CSV</span>
                            </button>
                        </div>

                        <ResultsDisplay
                            results={results}
                            isCalculating={isCalculating}
                            onDownloadCSV={handleDownloadCSV}
                            showTableOnly={true}
                        />
                    </div>
                </div>
            </div>

            {/* Results Summary Section - Full Width */}
            <div className="w-full px-2 sm:px-4 lg:px-6 py-8">
                <div className="bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gray-200/60 p-4 sm:p-6 lg:p-8 hover:shadow-3xl transition-all duration-500 relative overflow-hidden group">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-1/2 w-44 h-44 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full -translate-x-22 -translate-y-22 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 right-1/3 w-36 h-36 bg-gradient-to-br from-pink-200/20 to-red-200/20 rounded-full translate-x-18 translate-y-18 group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 via-orange-600 to-red-600 bg-clip-text text-transparent flex items-center">
                                📊 Risultati della Simulazione
                            </h2>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-2xl border border-orange-200/50 shadow-lg">
                                <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-sm"></span>
                                <span className="font-semibold">
                                    Aggiornato
                                </span>
                            </div>
                        </div>

                        <ResultsDisplay
                            results={results}
                            isCalculating={isCalculating}
                            onDownloadCSV={handleDownloadCSV}
                            showCardsOnly={true}
                        />
                    </div>
                </div>
            </div>

            <CalculatorFooter />
        </div>
    );
}
