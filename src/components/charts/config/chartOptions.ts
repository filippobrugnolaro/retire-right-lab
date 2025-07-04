// Chart configuration options
import { TooltipItem } from "chart.js";
import { formatCurrency } from "@/utils/calculator";

export const createBaseChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "top" as const,
            labels: {
                font: {
                    size: 12,
                    weight: "bold" as const,
                },
            },
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem: TooltipItem<"line" | "bar">) {
                    return `${
                        tooltipItem.dataset.label || ""
                    }: ${formatCurrency(tooltipItem.parsed.y)}`;
                },
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: function (value: string | number) {
                    return formatCurrency(Number(value));
                },
            },
        },
    },
    interaction: {
        intersect: false,
        mode: "index" as const,
    },
});

export const createStackedBarOptions = () => {
    const baseOptions = createBaseChartOptions();
    return {
        ...baseOptions,
        scales: {
            ...baseOptions.scales,
            x: {
                stacked: true,
            },
            y: {
                ...baseOptions.scales.y,
                stacked: true,
            },
        },
    };
};
