// Reusable input field component with consistent styling
"use client";

interface InputFieldProps {
    id: string;
    label: string;
    icon?: string;
    value: number | string;
    onChange: (value: number | string | boolean) => void;
    type?: "number" | "text" | "select";
    min?: number;
    max?: number;
    step?: number | string;
    suffix?: string;
    helpText?: string;
    options?: { value: string | boolean; label: string }[];
    colorScheme?: "blue" | "green" | "purple" | "orange";
    className?: string;
    disabled?: boolean;
}

export function InputField({
    id,
    label,
    icon,
    value,
    onChange,
    type = "number",
    min,
    max,
    step,
    suffix,
    helpText,
    options,
    colorScheme = "blue",
    className = "",
    disabled = false,
}: InputFieldProps) {
    const colorClasses = {
        blue: "focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400",
        green: "focus:ring-green-500 focus:border-green-500 hover:border-green-400",
        purple: "focus:ring-purple-500 focus:border-purple-500 hover:border-purple-400",
        orange: "focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400",
    };

    const helpColorClasses = {
        blue: "text-blue-600 hover:text-blue-800",
        green: "text-green-600 hover:text-green-800",
        purple: "text-purple-600 hover:text-purple-800",
        orange: "text-orange-600 hover:text-orange-800",
    };

    return (
        <div className={`group ${className}`}>
            <label
                htmlFor={id}
                className="flex items-center text-sm font-bold text-gray-900 mb-2"
            >
                {icon && <span className="mr-2">{icon}</span>}
                {label}
                {helpText && (
                    <span
                        className={`cursor-help ml-2 transition-colors ${helpColorClasses[colorScheme]}`}
                        title={helpText}
                    >
                        ❓
                    </span>
                )}
            </label>
            <div className="relative">
                {type === "select" && options ? (
                    <select
                        id={id}
                        value={value.toString()}
                        onChange={(e) => {
                            const val = e.target.value;
                            onChange(
                                val === "true"
                                    ? true
                                    : val === "false"
                                    ? false
                                    : val
                            );
                        }}
                        disabled={disabled}
                        className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 text-black font-semibold text-lg transition-all duration-200 ${
                            disabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : colorClasses[colorScheme]
                        }`}
                    >
                        {options.map((option) => (
                            <option
                                key={option.value.toString()}
                                value={option.value.toString()}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={(e) =>
                            onChange(
                                type === "number"
                                    ? Number(e.target.value)
                                    : e.target.value
                            )
                        }
                        disabled={disabled}
                        className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 text-black font-semibold text-lg transition-all duration-200 ${
                            disabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : colorClasses[colorScheme]
                        }`}
                        min={min}
                        max={max}
                        step={step}
                    />
                )}
                {suffix && (
                    <div
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium ${
                            disabled ? "text-gray-300" : "text-gray-400"
                        }`}
                    >
                        {suffix}
                    </div>
                )}
            </div>
        </div>
    );
}
