// Parameters input component for the pension calculator
"use client";

import { useState } from "react";
import { CalculatorParams } from "@/types/calculator";
import { InputField } from "@/components/ui/InputField";
import { ToggleButton } from "@/components/ui/ToggleButton";

interface ParametersInputProps {
    params: CalculatorParams;
    updateParam: <K extends keyof CalculatorParams>(
        key: K,
        value: CalculatorParams[K]
    ) => void;
    updateNestedParam: <
        T extends "incomeIncrease" | "investmentIncrease" | "etfReinvestment" | "personalInvestment"
    >(
        parentKey: T,
        childKey: keyof CalculatorParams[T],
        value: number | boolean
    ) => void;
}

interface AccordionSectionProps {
    title: string;
    icon: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    colorScheme?: "blue" | "green" | "purple" | "orange";
}

function AccordionSection({
    title,
    icon,
    isOpen,
    onToggle,
    children,
    colorScheme = "blue",
}: AccordionSectionProps) {
    const colorClasses = {
        blue: "border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 text-blue-800",
        green: "border-green-200 bg-green-50/50 hover:bg-green-100/50 text-green-800",
        purple: "border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-purple-800",
        orange: "border-orange-200 bg-orange-50/50 hover:bg-orange-100/50 text-orange-800",
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <button
                onClick={onToggle}
                className={`w-full px-6 py-4 text-left font-semibold flex items-center justify-between transition-all duration-300 ${colorClasses[colorScheme]}`}
            >
                <div className="flex items-center space-x-3">
                    <span className="text-xl">{icon}</span>
                    <span className="text-lg">{title}</span>
                </div>
                <div
                    className={`transform transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[2000px]" : "max-h-0"
                }`}
            >
                <div className="p-6 bg-white border-t border-gray-100 pb-8">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function ParametersInput({
    params,
    updateParam,
    updateNestedParam,
}: ParametersInputProps) {
    const [openSections, setOpenSections] = useState({
        basic: true,
        returns: true,
        advanced: false,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const tfrOptions = [
        { value: true, label: "✅ Sì, includi TFR" },
        { value: false, label: "❌ No, escludi TFR" },
    ];

    const toggleOptions = [
        { value: true, label: "Percentuale (%)" },
        { value: false, label: "Valore (€)" },
    ];

    return (
        <div className="space-y-4">
            {/* Basic Parameters Section */}
            <AccordionSection
                title="Parametri Principali"
                icon="📊"
                isOpen={openSections.basic}
                onToggle={() => toggleSection("basic")}
                colorScheme="blue"
            >
                <div className="space-y-4">
                    <InputField
                        id="duration"
                        label="Durata"
                        icon="🕐"
                        value={params.duration}
                        onChange={(value) =>
                            updateParam("duration", value as number)
                        }
                        min={1}
                        max={50}
                        suffix="anni"
                        helpText="Durata dell'investimento in anni"
                        colorScheme="blue"
                    />

                    <InputField
                        id="annualIncome"
                        label="Reddito Annuale"
                        icon="💼"
                        value={params.annualIncome}
                        onChange={(value) =>
                            updateParam("annualIncome", value as number)
                        }
                        min={0}
                        step={1000}
                        suffix="€"
                        helpText="Reddito lordo annuale"
                        colorScheme="blue"
                    />

                    <InputField
                        id="investment"
                        label="Investimento Annuale"
                        icon="💎"
                        value={params.investment}
                        onChange={(value) =>
                            updateParam("investment", value as number)
                        }
                        min={0}
                        step={100}
                        suffix="€"
                        helpText="Importo annuale investito nel fondo pensione"
                        colorScheme="blue"
                    />

                    <InputField
                        id="calculateTfr"
                        label="Calcola TFR"
                        icon="📋"
                        value={params.calculateTfr ? "true" : "false"}
                        onChange={(value) => {
                            const tfrEnabled = Boolean(value);
                            updateParam("calculateTfr", tfrEnabled);
                            // Reset employer contribution and member contribution to 0 when TFR is disabled
                            if (!tfrEnabled) {
                                updateParam("employerContribution", 0);
                                updateParam("memberContribution", 0);
                            }
                        }}
                        type="select"
                        options={tfrOptions}
                        helpText="Include il TFR (Trattamento di Fine Rapporto) nel calcolo"
                        colorScheme="blue"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            id="employerContribution"
                            label="Contributo Datore"
                            icon="🏢"
                            value={params.employerContribution}
                            onChange={(value) =>
                                updateParam(
                                    "employerContribution",
                                    value as number
                                )
                            }
                            min={0}
                            max={100}
                            step={0.1}
                            suffix="%"
                            helpText={
                                params.calculateTfr
                                    ? "Percentuale di contributo del datore di lavoro"
                                    : "Disponibile solo quando il TFR è incluso"
                            }
                            colorScheme="blue"
                            disabled={!params.calculateTfr}
                        />

                        <InputField
                            id="memberContribution"
                            label="Quota Aderente"
                            icon="👤"
                            value={params.memberContribution}
                            onChange={(value) =>
                                updateParam(
                                    "memberContribution",
                                    value as number
                                )
                            }
                            min={0}
                            max={100}
                            step={0.1}
                            suffix="%"
                            helpText={
                                params.calculateTfr
                                    ? "Percentuale di contribuzione dell'aderente"
                                    : "Disponibile solo quando il TFR è incluso"
                            }
                            colorScheme="blue"
                            disabled={!params.calculateTfr}
                        />
                    </div>
                </div>
            </AccordionSection>

            {/* Returns and Inflation Section */}
            <AccordionSection
                title="Rendimenti e Inflazione"
                icon="📈"
                isOpen={openSections.returns}
                onToggle={() => toggleSection("returns")}
                colorScheme="green"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        id="inflation"
                        label="Inflazione"
                        icon="📉"
                        value={params.inflation}
                        onChange={(value) =>
                            updateParam("inflation", value as number)
                        }
                        min={0}
                        max={20}
                        step={0.1}
                        suffix="%"
                        helpText="Tasso di inflazione annuale previsto"
                        colorScheme="green"
                    />

                    <InputField
                        id="pensionFundReturn"
                        label="Rendimento FP"
                        icon="📊"
                        value={params.pensionFundReturn}
                        onChange={(value) =>
                            updateParam("pensionFundReturn", value as number)
                        }
                        min={0}
                        max={30}
                        step={0.1}
                        suffix="%"
                        helpText="Rendimento annuale previsto del fondo pensione"
                        colorScheme="green"
                    />
                </div>
            </AccordionSection>

            {/* Advanced Options Section */}
            <AccordionSection
                title="Opzioni Avanzate"
                icon="⚙️"
                isOpen={openSections.advanced}
                onToggle={() => toggleSection("advanced")}
                colorScheme="purple"
            >
                <div className="space-y-6">
                    {/* Income Increase Section */}
                    <div className="bg-purple-50/30 rounded-lg p-4">
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    suffix={
                                        params.incomeIncrease.isPercentage
                                            ? "%"
                                            : "€"
                                    }
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
                    </div>

                    {/* Investment Increase Section */}
                    <div className="bg-purple-50/30 rounded-lg p-4">
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
                                        params.investmentIncrease.isPercentage
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    suffix={
                                        params.investmentIncrease.isPercentage
                                            ? "%"
                                            : "€"
                                    }
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

                    {/* ETF Reinvestment Section */}
                    <div className="bg-purple-50/30 rounded-lg p-4">
                        <h4 className="text-md font-bold text-purple-800 mb-4 flex items-center">
                            📊 Reinvestimento ETF Detrazione
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-3">
                                    Reinvesti Detrazione Totale in ETF
                                    <span
                                        className="text-purple-600 cursor-help ml-2 hover:text-purple-800 transition-colors"
                                        title="Reinvesti la detrazione fiscale annuale in ETF"
                                    >
                                        ❓
                                    </span>
                                </label>
                                <ToggleButton
                                    options={[
                                        {
                                            value: true,
                                            label: "✅ Sì, reinvesti in ETF",
                                        },
                                        {
                                            value: false,
                                            label: "❌ No, non reinvestire",
                                        },
                                    ]}
                                    selectedValue={
                                        params.etfReinvestment.enabled
                                    }
                                    onChange={(value) =>
                                        updateNestedParam(
                                            "etfReinvestment",
                                            "enabled",
                                            value
                                        )
                                    }
                                    colorScheme="purple"
                                />
                            </div>

                            {params.etfReinvestment.enabled && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField
                                        id="etfAnnualReturn"
                                        label="Rendimento ETF"
                                        icon="📈"
                                        value={
                                            params.etfReinvestment.annualReturn
                                        }
                                        onChange={(value) =>
                                            updateNestedParam(
                                                "etfReinvestment",
                                                "annualReturn",
                                                value as number
                                            )
                                        }
                                        min={0}
                                        max={30}
                                        step={0.1}
                                        suffix="%"
                                        helpText="Rendimento annuale previsto dell'ETF"
                                        colorScheme="purple"
                                    />

                                    <InputField
                                        id="etfTaxRate"
                                        label="Tassazione ETF"
                                        icon="💰"
                                        value={params.etfReinvestment.taxRate}
                                        onChange={(value) =>
                                            updateNestedParam(
                                                "etfReinvestment",
                                                "taxRate",
                                                value as number
                                            )
                                        }
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        suffix="%"
                                        helpText="Aliquota di tassazione dell'ETF (es. 26%)"
                                        colorScheme="purple"
                                    />
                                </div>                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal Investment Section */}
                    <div className="bg-orange-50/30 rounded-lg p-4">
                        <h4 className="text-md font-bold text-orange-800 mb-4 flex items-center">
                            💰 Investimento Contributi Personali
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-3">
                                    Investi Contributi Personali (dopo IRPEF)
                                    <span
                                        className="text-orange-600 cursor-help ml-2 hover:text-orange-800 transition-colors"
                                        title="Investi il totale dei contributi personali (al netto delle tasse IRPEF) in investimenti alternativi"
                                    >
                                        ❓
                                    </span>
                                </label>
                                <ToggleButton
                                    options={[
                                        {
                                            value: true,
                                            label: "✅ Sì, investi contributi",
                                        },
                                        {
                                            value: false,
                                            label: "❌ No, non investire",
                                        },
                                    ]}
                                    selectedValue={
                                        params.personalInvestment.enabled
                                    }
                                    onChange={(value) =>
                                        updateNestedParam(
                                            "personalInvestment",
                                            "enabled",
                                            value
                                        )
                                    }
                                    colorScheme="orange"
                                />
                            </div>

                            {params.personalInvestment.enabled && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField
                                        id="personalAnnualReturn"
                                        label="Rendimento Investimento"
                                        icon="📈"
                                        value={
                                            params.personalInvestment.annualReturn
                                        }
                                        onChange={(value) =>
                                            updateNestedParam(
                                                "personalInvestment",
                                                "annualReturn",
                                                value as number
                                            )
                                        }
                                        min={0}
                                        max={30}
                                        step={0.1}
                                        suffix="%"
                                        helpText="Rendimento annuale previsto dell'investimento"
                                        colorScheme="orange"
                                    />

                                    <InputField
                                        id="personalTaxRate"
                                        label="Tassazione Investimento"
                                        icon="💰"
                                        value={params.personalInvestment.taxRate}
                                        onChange={(value) =>
                                            updateNestedParam(
                                                "personalInvestment",
                                                "taxRate",
                                                value as number
                                            )
                                        }
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        suffix="%"
                                        helpText="Aliquota di tassazione dell'investimento (es. 26%)"
                                        colorScheme="orange"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
            </AccordionSection>
        </div>
    );
}
