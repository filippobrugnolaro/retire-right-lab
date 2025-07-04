// Advanced options component for income and investment increases
"use client";

import { CalculatorParams } from "@/types/calculator";
import { InputField } from "@/components/ui/InputField";
import { SectionCard } from "@/components/ui/SectionCard";
import { ToggleButton } from "@/components/ui/ToggleButton";

interface AdvancedOptionsProps {
    params: CalculatorParams;
    updateNestedParam: <T extends "incomeIncrease" | "investmentIncrease">(
        parentKey: T,
        childKey: keyof CalculatorParams[T],
        value: number | boolean
    ) => void;
    showAdvanced: boolean;
    setShowAdvanced: (show: boolean) => void;
}

export function AdvancedOptions({
    params,
    updateNestedParam,
    showAdvanced,
    setShowAdvanced,
}: AdvancedOptionsProps) {
    const toggleOptions = [
        { value: true, label: "Percentuale (%)" },
        { value: false, label: "Valore (€)" },
    ];

    return (
        <>
            {/* Advanced Options Toggle */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
                <span>{showAdvanced ? "🔼" : "🔽"}</span>
                <span>
                    {showAdvanced ? "Nascondi" : "Mostra"} Opzioni Avanzate
                </span>
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
                <SectionCard
                    title="Opzioni Avanzate"
                    icon="⚙️"
                    colorScheme="purple"
                    className="animate-fadeIn"
                >
                    <div className="space-y-6">
                        {/* Income Increase Section */}
                        <div>
                            <h4 className="text-md font-bold text-purple-800 mb-4 flex items-center">
                                📈 Aumento Reddito
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">
                                        Variazione del Reddito
                                        <span
                                            className="text-purple-600 cursor-help ml-2 hover:text-purple-800 transition-colors"
                                            title="Aumento periodico del reddito"
                                        >
                                            ❓
                                        </span>
                                    </label>
                                    <ToggleButton
                                        options={toggleOptions}
                                        selectedValue={
                                            params.incomeIncrease.isPercentage
                                        }
                                        onChange={(value) =>
                                            updateNestedParam(
                                                "incomeIncrease",
                                                "isPercentage",
                                                value
                                            )
                                        }
                                        colorScheme="purple"
                                    />
                                </div>

                                <InputField
                                    id="incomeAmount"
                                    label="Importo"
                                    value={params.incomeIncrease.amount}
                                    onChange={(value) =>
                                        updateNestedParam(
                                            "incomeIncrease",
                                            "amount",
                                            value as number
                                        )
                                    }
                                    min={0}
                                    colorScheme="purple"
                                />

                                <InputField
                                    id="incomeFrequency"
                                    label="Frequenza"
                                    value={params.incomeIncrease.frequency}
                                    onChange={(value) =>
                                        updateNestedParam(
                                            "incomeIncrease",
                                            "frequency",
                                            value as number
                                        )
                                    }
                                    min={1}
                                    suffix="anni"
                                    colorScheme="purple"
                                />
                            </div>
                        </div>

                        {/* Investment Increase Section */}
                        <div>
                            <h4 className="text-md font-bold text-purple-800 mb-4 flex items-center">
                                📈 Aumento Investimento
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">
                                        Variazione dell&apos;Investimento
                                        <span
                                            className="text-purple-600 cursor-help ml-2 hover:text-purple-800 transition-colors"
                                            title="Aumento periodico dell'investimento"
                                        >
                                            ❓
                                        </span>
                                    </label>
                                    <ToggleButton
                                        options={toggleOptions}
                                        selectedValue={
                                            params.investmentIncrease
                                                .isPercentage
                                        }
                                        onChange={(value) =>
                                            updateNestedParam(
                                                "investmentIncrease",
                                                "isPercentage",
                                                value
                                            )
                                        }
                                        colorScheme="purple"
                                    />
                                </div>

                                <InputField
                                    id="investmentAmount"
                                    label="Importo"
                                    value={params.investmentIncrease.amount}
                                    onChange={(value) =>
                                        updateNestedParam(
                                            "investmentIncrease",
                                            "amount",
                                            value as number
                                        )
                                    }
                                    min={0}
                                    colorScheme="purple"
                                />

                                <InputField
                                    id="investmentFrequency"
                                    label="Frequenza"
                                    value={params.investmentIncrease.frequency}
                                    onChange={(value) =>
                                        updateNestedParam(
                                            "investmentIncrease",
                                            "frequency",
                                            value as number
                                        )
                                    }
                                    min={1}
                                    suffix="anni"
                                    colorScheme="purple"
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>
            )}
        </>
    );
}
