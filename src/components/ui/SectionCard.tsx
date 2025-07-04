// Reusable section card component with consistent styling
"use client";

import { ReactNode } from "react";

interface SectionCardProps {
    title: string;
    icon?: string;
    children: ReactNode;
    colorScheme?: "blue" | "green" | "purple" | "gray";
    className?: string;
}

export function SectionCard({
    title,
    icon,
    children,
    colorScheme = "blue",
    className = "",
}: SectionCardProps) {
    const gradientClasses = {
        blue: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
        green: "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500",
        purple: "bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500",
        gray: "bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-500",
    };

    const titleColorClasses = {
        blue: "text-blue-800",
        green: "text-green-800",
        purple: "text-purple-800",
        gray: "text-gray-800",
    };

    return (
        <div
            className={`${gradientClasses[colorScheme]} p-4 rounded-xl ${className}`}
        >
            <h3
                className={`text-lg font-bold ${titleColorClasses[colorScheme]} mb-4 flex items-center`}
            >
                {icon && <span className="mr-2">{icon}</span>}
                {title}
            </h3>
            {children}
        </div>
    );
}
