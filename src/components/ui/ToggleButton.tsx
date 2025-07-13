// Reusable toggle button component for percentage/value switches
"use client";

interface ToggleButtonProps {
    options: { value: boolean; label: string }[];
    selectedValue: boolean;
    onChange: (value: boolean) => void;
    colorScheme?: "blue" | "green" | "purple" | "orange";
}

export function ToggleButton({
    options,
    selectedValue,
    onChange,
    colorScheme = "blue",
}: ToggleButtonProps) {
    const activeClasses = {
        blue: "bg-blue-700 text-white border-blue-700",
        green: "bg-green-700 text-white border-green-700",
        purple: "bg-purple-700 text-white border-purple-700",
        orange: "bg-orange-700 text-white border-orange-700",
    };

    const inactiveClasses = {
        blue: "bg-white text-gray-900 border-gray-300 hover:border-blue-500",
        green: "bg-white text-gray-900 border-gray-300 hover:border-green-500",
        purple: "bg-white text-gray-900 border-gray-300 hover:border-purple-500",
        orange: "bg-white text-gray-900 border-gray-300 hover:border-orange-500",
    };

    return (
        <div className="flex space-x-2">
            {options.map((option) => (
                <button
                    key={option.value.toString()}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg border-2 transition-all ${
                        selectedValue === option.value
                            ? activeClasses[colorScheme]
                            : inactiveClasses[colorScheme]
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
