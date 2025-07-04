// Chart color palette and styling constants
export const CHART_COLORS = {
    primary: {
        blue: "rgb(59, 130, 246)",
        green: "rgb(34, 197, 94)",
        purple: "rgb(168, 85, 247)",
        orange: "rgb(249, 115, 22)",
        pink: "rgb(236, 72, 153)",
        cyan: "rgb(14, 165, 233)",
    },
    background: {
        blue: "rgba(59, 130, 246, 0.1)",
        green: "rgba(34, 197, 94, 0.1)",
        purple: "rgba(168, 85, 247, 0.1)",
        orange: "rgba(249, 115, 22, 0.1)",
        pink: "rgba(236, 72, 153, 0.1)",
        cyan: "rgba(14, 165, 233, 0.1)",
    },
    solid: {
        blue: "rgba(59, 130, 246, 0.8)",
        green: "rgba(34, 197, 94, 0.8)",
        purple: "rgba(168, 85, 247, 0.8)",
        orange: "rgba(249, 115, 22, 0.8)",
        pink: "rgba(236, 72, 153, 0.8)",
        cyan: "rgba(14, 165, 233, 0.8)",
    },
} as const;

export const CHART_STYLES = {
    tension: 0.4,
    borderWidth: {
        normal: 1,
        thick: 3,
    },
    borderDash: {
        dashed: [5, 5] as number[],
    },
} as const;
