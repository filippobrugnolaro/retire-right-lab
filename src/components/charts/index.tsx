// Modular charts component with Chart.js registration
"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { CalculationResult } from "@/types/calculator";
import { formatCurrency } from "@/utils/calculator";
import { AccumulationChart } from "./charts/AccumulationChart";
import { ContributionsChart } from "./charts/ContributionsChart";
import { TaxBenefitsChart } from "./charts/TaxBenefitsChart";
import { MonthlyPensionChart } from "./charts/MonthlyPensionChart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartsProps {
  results: CalculationResult;
  duration: number;
}

export function Charts({ results, duration }: ChartsProps) {
  return (
    <div className="space-y-8">
      {/* Growth Over Time Chart */}
      <AccumulationChart results={results} />

      {/* Contributions Breakdown Chart */}
      <ContributionsChart results={results} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tax Benefits Chart */}
        <TaxBenefitsChart results={results} />

        {/* Monthly Pension Projection */}
        <MonthlyPensionChart results={results} duration={duration} />
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          💡 Insights Chiave
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                results.netFinalValue - results.totalContributions
              )}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              Guadagno Totale
            </div>
          </div>
          <div className="bg-white/70 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {(
                ((results.netFinalValue - results.totalContributions) /
                  results.totalContributions) *
                100
              ).toFixed(1)}
              %
            </div>
            <div className="text-sm text-gray-700 font-medium">
              ROI Totale
            </div>
          </div>
          <div className="bg-white/70 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(
                results.yearlyResults[results.yearlyResults.length - 1]
                  ?.cumulativeFiscalRelaxation || 0
              )}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              Risparmio Fiscale
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}