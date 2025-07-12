// Header component for the pension calculator
"use client";

import { CalculationResult } from "@/types/calculator";
import { formatCurrency, formatPercentage } from "@/utils/calculator";

interface CalculatorHeaderProps {
    results: CalculationResult;
    duration: number;
}

export function CalculatorHeader({ results, duration }: CalculatorHeaderProps) {
    return (
        <>
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-50">
                <div className="w-full px-2 sm:px-4 lg:px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                💰 Calcolatore Fondo Pensione
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                                Pianifica il tuo futuro finanziario con
                                precisione
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span>Calcolo in tempo reale</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Summary Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-4">
                <div className="w-full px-2 sm:px-4 lg:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(results.netFinalValue)}
                            </div>
                            <div className="text-sm opacity-90">
                                Valore Finale (Netto)
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(results.netRealFinalValue)}
                            </div>
                            <div className="text-sm opacity-90">
                                Valore Reale (Netto)
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {formatPercentage(results.netAnnualizedReturn)}
                            </div>
                            <div className="text-sm opacity-90">
                                Rendimento Netto
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {duration} anni
                            </div>
                            <div className="text-sm opacity-90">Durata</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
