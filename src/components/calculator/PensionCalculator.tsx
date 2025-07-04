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
    duration: 30,
    annualIncome: 30000,
    investment: 3000,
    calculateTfr: true,
    employerContribution: 1.5,
    memberContribution: 1,
    inflation: 2,
    pensionFundReturn: 5,
    incomeIncrease: {
        amount: 10,
        frequency: 3,
        isPercentage: true,
    },
    investmentIncrease: {
        amount: 10,
        frequency: 5,
        isPercentage: true,
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
        T extends "incomeIncrease" | "investmentIncrease"
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
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            ⚙️ Parametri di Calcolo
                        </h2>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    <ParametersInput
                        params={params}
                        updateParam={updateParam}
                        updateNestedParam={updateNestedParam}
                    />
                </div>
            </div>

            {/* Table Section - Full Width */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            📅 Dettaglio Anno per Anno
                        </h2>
                        <button
                            onClick={handleDownloadCSV}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                        >
                            <span>📊</span>
                            <span>Scarica CSV</span>
                        </button>
                    </div>

                    <ResultsDisplay
                        results={results}
                        isCalculating={isCalculating}
                        onDownloadCSV={handleDownloadCSV}
                        duration={params.duration}
                        showTableOnly={true}
                    />
                </div>
            </div>

            {/* Results Summary Section - Full Width */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            📊 Risultati della Simulazione
                        </h2>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Aggiornato</span>
                        </div>
                    </div>

                    <ResultsDisplay
                        results={results}
                        isCalculating={isCalculating}
                        onDownloadCSV={handleDownloadCSV}
                        duration={params.duration}
                        showCardsOnly={true}
                    />
                </div>
            </div>

            <CalculatorFooter />
        </div>
    );
}
