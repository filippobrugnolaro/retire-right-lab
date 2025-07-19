# 🏦 Retire Right Lab - Italian Pension Fund Calculator

A comprehensive **Next.js** pension fund calculator specifically designed for the Italian market. This tool simulates pension fund investments, TFR (Trattamento di Fine Rapporto), ETF reinvestments, and personal investments with accurate Italian tax calculations.

## 📊 What This Calculator Does

This calculator provides detailed projections for retirement planning in Italy, comparing different investment strategies:

-   **Pension Fund (Fondo Pensione)** with TFR conversion
-   **Company TFR** traditional accumulation
-   **ETF Reinvestment** of tax deductions
-   **Personal Investment** alternative

## 🧮 Complete Calculation Methodology

### 1. 📈 Monthly Compound Interest Calculations

#### 1.1 Pension Fund with TFR Timing

The pension fund calculation uses **monthly compounding** with special handling for TFR (13-month salary structure):

```typescript
function calculatePensionFundMonthlyCompound(
    currentAccumulated: number,
    yearlyContribution: number,
    yearlyTfr: number,
    annualRate: number
): number {
    const monthlyRate = annualRate / 100 / 12;
    const monthlyContribution = yearlyContribution / 12;
    const monthlyTfrPortion = yearlyTfr / 13; // TFR divided by 13 months

    let accumulated = currentAccumulated;

    // Months 1-11: Regular contributions + monthly TFR portion
    for (let month = 0; month < 11; month++) {
        accumulated =
            accumulated * (1 + monthlyRate) +
            monthlyContribution +
            monthlyTfrPortion;
    }

    // Month 12: Regular contribution + DOUBLE TFR portion (12th + 13th month paid together)
    accumulated =
        accumulated * (1 + monthlyRate) +
        monthlyContribution +
        2 * monthlyTfrPortion;

    return accumulated;
}
```

**Key Points:**

-   **Regular contributions** (investment + employer + worker): divided by 12 months
-   **TFR**: divided by 13 months, but 12th and 13th portions paid together in December
-   **Monthly formula**: `A(t+1) = A(t) × (1 + r/12) + monthly_contribution + tfr_portion`

#### 1.2 ETF and Personal Investment Compounding

Standard monthly compounding for ETF and personal investments:

```typescript
function calculateETFMonthlyCompound(
    currentAccumulated: number,
    yearlyContribution: number,
    annualRate: number
): number {
    const monthlyRate = annualRate / 100 / 12;
    const monthlyContribution = yearlyContribution / 12;

    let accumulated = currentAccumulated;

    for (let month = 0; month < 12; month++) {
        accumulated = accumulated * (1 + monthlyRate) + monthlyContribution;
    }

    return accumulated;
}
```

**Formula**: `A(t+1) = A(t) × (1 + r/12) + contribution/12`

### 2. 💰 Contribution Calculations

#### 2.1 Annual Contributions

```typescript
// Employer contribution (only if TFR is calculated)
const employerContribution = params.calculateTfr
    ? currentIncome * (params.employerContribution / 100)
    : 0;

// TFR calculation (7.41% of gross salary)
const tfr = params.calculateTfr ? currentIncome * 0.0741 : 0;

// Member/worker contribution (only if TFR is calculated)
const memberContribution = params.calculateTfr
    ? currentIncome * (params.memberContribution / 100)
    : 0;

// Additional investment (user-defined)
const currentInvestment = params.investment; // Updated yearly based on increases
```

#### 2.2 Income and Investment Growth

```typescript
// Income increases
if (year > 1 && (year - 1) % params.incomeIncrease.frequency === 0) {
    if (params.incomeIncrease.isPercentage) {
        currentIncome *= 1 + params.incomeIncrease.amount / 100;
    } else {
        currentIncome += params.incomeIncrease.amount;
    }
}

// Investment increases (can be negative for inflation adjustments)
if (year > 1 && (year - 1) % params.investmentIncrease.frequency === 0) {
    if (params.investmentIncrease.isPercentage) {
        currentInvestment *= 1 + params.investmentIncrease.amount / 100;
    } else {
        currentInvestment += params.investmentIncrease.amount;
    }
}
```

### 3. 🏦 Tax Calculations

#### 3.1 Fiscal Relaxation (Detrazione Fiscale)

Tax deductions available on personal contributions with income-based brackets:

```typescript
function calculateFiscalRelaxation(
    amount: number,
    previousYearIncome: number
): number {
    let relaxation = 0;
    let remainingAmount = Math.min(amount, 5164.57); // Maximum eligible amount

    if (previousYearIncome > 50000) {
        // 43% rate for income > €50,000
        const availableAtHighest = previousYearIncome - 50000;
        const amountAtHighest = Math.min(remainingAmount, availableAtHighest);
        relaxation += amountAtHighest * 0.43;
        remainingAmount -= amountAtHighest;

        // 35% rate for €28,000-€50,000 bracket
        if (remainingAmount > 0) {
            const amountAtMiddle = Math.min(remainingAmount, 22000);
            relaxation += amountAtMiddle * 0.35;
            remainingAmount -= amountAtMiddle;
        }

        // 23% rate for €0-€28,000 bracket
        if (remainingAmount > 0) {
            relaxation += remainingAmount * 0.23;
        }
    } else if (previousYearIncome > 28000) {
        // 35% rate for €28,000-€50,000
        const availableAtHighest = previousYearIncome - 28000;
        const amountAtHighest = Math.min(remainingAmount, availableAtHighest);
        relaxation += amountAtHighest * 0.35;
        remainingAmount -= amountAtHighest;

        // 23% rate for remaining
        if (remainingAmount > 0) {
            relaxation += remainingAmount * 0.23;
        }
    } else {
        // 23% rate for income ≤ €28,000
        relaxation = remainingAmount * 0.23;
    }

    return relaxation;
}
```

**Tax Brackets:**

-   **23%**: Income €0 - €28,000
-   **35%**: Income €28,001 - €50,000
-   **43%**: Income > €50,000

**Important**: Maximum eligible amount for deductions: **€5,164.57**

#### 3.2 Pension Fund Taxation

Progressive taxation based on years of participation:

```typescript
const calculateTaxRate = (years: number): number => {
    if (years <= 15) return 15; // 15% for first 15 years
    if (years >= 35) return 9; // 9% minimum after 35 years
    return 15 - (years - 15) * 0.3; // Decreases 0.3% per year from year 16-35
};
```

**Tax Formula**: `Tax = 15% - 0.3% × (years - 15)` for years 16-35

#### 3.3 TFR Taxation

TFR taxation uses proportional taxation based on average of last 5 years:

```typescript
function calculateTfrTaxationRate(
    yearlyResults: YearlyResult[],
    currentYear: number,
    currentIncome: number
): number {
    let totalProportionalTaxation = 0;
    const yearsToConsider = Math.min(currentYear, 5);

    // Calculate proportional tax for each year based on income
    // Then average over the years considered

    return totalProportionalTaxation / yearsToConsider;
}
```

**Proportional Tax Calculation**:

```typescript
// For each income level, calculate weighted average of tax brackets
if (income <= 28000) {
    proportionalTaxation = 23;
} else if (income <= 50000) {
    const bracket1Amount = 28000;
    const bracket2Amount = income - 28000;
    proportionalTaxation =
        (bracket1Amount / income) * 23 + (bracket2Amount / income) * 35;
} else {
    const bracket1Amount = 28000;
    const bracket2Amount = 22000;
    const bracket3Amount = income - 50000;
    proportionalTaxation =
        (bracket1Amount / income) * 23 +
        (bracket2Amount / income) * 35 +
        (bracket3Amount / income) * 43;
}
```

### 4. 🏢 TFR Company Calculation

TFR accumulation in company with annual revaluation:

```typescript
// TFR revaluation rate: 1.5% fixed + 75% of inflation
const tfrRevaluationRate = 1.5 + 0.75 * params.inflation;

// Annual TFR accumulation with revaluation
tfrGrossAccumulated =
    tfrGrossAccumulated * (1 + tfrRevaluationRate / 100) +
    tfr * (1 + tfrRevaluationRate / 100);

// Apply taxation
const tfrNetValue = tfrGrossAccumulated * (1 - tfrTaxationRate / 100);
```

**Formula**: `TFR(t+1) = TFR(t) × (1 + revaluation_rate) + current_year_tfr × (1 + revaluation_rate)`

### 5. 📊 ETF Reinvestment Strategy

ETF reinvestment uses tax savings from fiscal relaxation:

```typescript
// ETF investment equals total fiscal relaxation
const etfInvestment = params.etfReinvestment.enabled
    ? totalFiscalRelaxation
    : 0;

// Calculate ETF accumulation with monthly compounding
etfAccumulatedValue = calculateETFMonthlyCompound(
    etfAccumulatedValue,
    etfInvestment,
    params.etfReinvestment.annualReturn
);

// Tax only on gains (not contributions)
const etfGains = Math.max(0, etfAccumulatedValue - totalEtfContributions);
const etfTaxOnGains = etfGains * (params.etfReinvestment.taxRate / 100);
const etfNetAccumulatedValue = etfAccumulatedValue - etfTaxOnGains;
```

### 6. 🎯 Personal Investment Alternative

Personal investment after IRPEF taxation:

```typescript
// Total personal contributions subject to IRPEF
const totalPersonalContributions = memberContribution + currentInvestment;

// Calculate IRPEF tax on contributions
const irpefTaxOnPersonalContributions = calculateIrpefTax(
    totalPersonalContributions,
    currentIncome
);

// Net investment amount after IRPEF
const personalInvestmentAmount =
    totalPersonalContributions - irpefTaxOnPersonalContributions;

// Calculate accumulation, then tax only gains
personalAccumulatedValue = calculateETFMonthlyCompound(
    personalAccumulatedValue,
    personalInvestmentAmount,
    params.personalInvestment.annualReturn
);

// Tax only on gains (capital gains tax)
const totalGains = Math.max(
    0,
    personalAccumulatedValue - totalPersonalInvestments
);
const totalTaxOnGains = totalGains * (params.personalInvestment.taxRate / 100);
personalNetAccumulatedValue = personalAccumulatedValue - totalTaxOnGains;
```

### 7. 💹 Inflation Adjustment (Real Values)

All calculations include inflation-adjusted "real values":

```typescript
// Real value calculation
const realValue = nominalValue / Math.pow(1 + params.inflation / 100, year);

// Net real value (after tax and inflation)
const netRealValue = netValue / Math.pow(1 + params.inflation / 100, year);
```

**Formula**: `Real Value = Nominal Value / (1 + inflation)^years`

### 8. 📈 Return Calculations

#### Annualized Returns

```typescript
// Gross annualized return
const annualizedReturn =
    Math.pow(finalValue / totalContributions, 1 / params.duration) - 1;

// Net annualized return (after taxes)
const netAnnualizedReturn =
    Math.pow(netFinalValue / totalContributions, 1 / params.duration) - 1;
```

**Formula**: `Annualized Return = (Final Value / Initial Investment)^(1/years) - 1`

## 🔍 Key Features & Assumptions

### Monthly vs Annual Contributions

-   **Pension Fund**: Monthly contributions with special TFR timing (13-month structure)
-   **ETF/Personal**: Standard 12-month equal contributions
-   **Compounding**: Applied monthly for more accurate projections

### Tax Timing

-   **Fiscal Relaxation**: Applied in year N+1 based on year N contributions and income
-   **Pension Fund Tax**: Applied at withdrawal (simulated annually)
-   **ETF/Personal Tax**: Only on gains, not contributions

### Italian Specifics

-   **TFR Rate**: 7.41% of gross salary
-   **TFR Revaluation**: 1.5% + 75% of inflation
-   **13th Month**: Paid in December with regular December salary
-   **Tax Brackets**: Accurate Italian IRPEF brackets (23%, 35%, 43%)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm, yarn, pnpm, or bun

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/filippobrugnolaro/retire-right-lab.git
cd retire-right-lab

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to access the calculator.

### Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
├── components/
│   ├── calculator/         # Main calculator components
│   ├── charts/            # Chart visualizations
│   └── ui/                # Reusable UI components
├── types/
│   └── calculator.ts      # TypeScript interfaces
└── utils/
    └── calculator.ts      # All calculation logic & formulas
```

## 🧪 Using the Calculator

### Basic Parameters

-   **Duration**: Investment period in years
-   **Annual Income**: Gross annual salary
-   **Investment**: Additional yearly contribution
-   **TFR**: Enable/disable TFR calculation
-   **Employer/Member Contributions**: Percentage rates

### Advanced Options

-   **Income/Investment Increases**: Periodic adjustments
-   **ETF Reinvestment**: Invest tax savings in ETF
-   **Personal Investment**: Alternative investment strategy
-   **Custom Returns**: Pension fund, ETF, and personal investment returns

### Results & Analysis

The calculator provides:

-   **Yearly projections** with detailed breakdowns
-   **Comparative analysis** between strategies
-   **Tax impact** calculations
-   **Real vs nominal** values
-   **Interactive charts** for visualization
-   **CSV export** functionality

## 🔬 Technical Implementation

### Calculation Engine

The core calculation logic in `src/utils/calculator.ts` implements:

-   Monthly compound interest calculations
-   Progressive taxation systems
-   Inflation adjustments
-   Multiple investment strategy comparisons

### Type Safety

Full TypeScript implementation with comprehensive interfaces in `src/types/calculator.ts`

### Performance

-   Optimized calculations using memoization
-   Efficient chart rendering with Chart.js
-   Responsive design for all devices

## 📊 Example Calculation

For a 30-year-old with €35,000 annual income, investing €3,000 yearly:

```typescript
const params = {
    duration: 35,
    annualIncome: 35000,
    investment: 3000,
    calculateTfr: true,
    employerContribution: 2.0, // 2%
    memberContribution: 1.3, // 1.3%
    inflation: 2.0,
    pensionFundReturn: 4.0,
    // ... other parameters
};

const results = calculatePensionFund(params);
```

This generates complete projections showing:

-   Annual TFR: €2,593.50
-   Employer contribution: €700
-   Member contribution: €455
-   Tax savings: ~€700-€1,400 (based on income bracket)
-   35-year pension fund projection with monthly compounding

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper tests
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

-   Follow TypeScript best practices
-   Add tests for calculation logic
-   Update documentation for new features
-   Ensure responsive design compatibility

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This calculator is for **educational and informational purposes only**. The calculations are based on current Italian tax regulations and market assumptions. Always consult with qualified financial advisors for professional investment advice. The authors are not responsible for any financial decisions made based on this tool.

---

**Made with ❤️ for Italian retirement planning**
