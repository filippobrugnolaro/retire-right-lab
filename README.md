# 🏦 Retire Right Lab - Italian Pension Fund Calculator

A comprehensive **Next.js** pension fund calculator specifically designed for the Italian market. This tool simulates pension fund investments, TFR (Trattamento di Fine Rapporto), ETF reinvestments and personal investments with accurate Italian tax calculations.

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

**Why This Matters:**
This reflects real-world Italian salary structure where employees receive:

-   12 regular monthly salaries
-   1 additional "13th month" salary in December (Christmas bonus)
-   TFR is calculated on all 13 months, but the December payment includes both regular and bonus salary TFR portions

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

The calculator computes four main types of contributions each year:

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

**Detailed Breakdown:**

1. **Employer Contribution** (`employerContribution`):

    - Percentage of gross salary paid by the company (typically 1-3%)
    - Only applies when TFR is redirected to pension fund
    - Example: 2% of €35,000 = €700/year

2. **TFR (Trattamento di Fine Rapporto)** (`tfr`):

    - Fixed at 7.41% of gross annual salary (Italian law)
    - Normally stays in company, but can be redirected to pension fund
    - Calculated on 13 months of salary (including Christmas bonus)
    - Example: 7.41% of €35,000 = €2,593.50/year

3. **Member Contribution** (`memberContribution`):

    - Employee's personal contribution (typically 1-2% of salary)
    - Only when participating in pension fund with TFR
    - Gets tax deduction benefits
    - Example: 1.3% of €35,000 = €455/year

4. **Additional Investment** (`currentInvestment`):
    - Extra voluntary contribution set by user
    - Can be any amount (subject to tax deduction limits)
    - Also gets tax deduction benefits
    - Example: €3,000/year (user choice)

#### 2.2 Income and Investment Growth

The calculator models realistic career progression with periodic increases:

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

**How Growth Works - Step by Step:**

1. **Timing Check**: `(year - 1) % params.frequency === 0`

    - Checks if it's time for an increase based on frequency
    - Example: frequency=2 means every 2 years (years 3, 5, 7...)

2. **Income Growth Types**:

    - **Percentage**: Compound growth (e.g., 3% annually)
        - Year 1: €35,000
        - Year 2: €35,000 × 1.03 = €36,050
        - Year 3: €36,050 × 1.03 = €37,132
    - **Fixed Amount**: Linear growth (e.g., +€1,000 annually)
        - Year 1: €35,000
        - Year 2: €35,000 + €1,000 = €36,000
        - Year 3: €36,000 + €1,000 = €37,000

3. **Investment Adjustments**:
    - Can be **positive** (increasing contributions over time)
    - Can be **negative** (reducing contributions, e.g., -2% for inflation adjustment)
    - Allows modeling changing financial capacity over career

**Real-World Example**:

-   Starting salary: €35,000
-   Income increase: +2% every year
-   Investment: €3,000 initially, -1% every 2 years (inflation adjustment)
-   Result: Income grows with career, investment adjusts for purchasing power

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

**How This Works - Step by Step:**

1. **Income Qualification**: The function uses PREVIOUS year's income to determine which tax brackets you qualify for
2. **Top-Down Application**: Tax deductions are applied starting from the highest bracket you qualify for
3. **Bracket Limits**: Each bracket has a maximum amount that can be deducted at that rate

**Example**: Person with €45,000 income contributing €4,000:

-   Qualifies for 35% bracket (income > €28,000 but < €50,000)
-   €4,000 eligible contribution gets 35% deduction = €1,400 tax savings
-   If income was €55,000, they'd get 43% on the first portion, then 35% on remaining

**Why Previous Year Income?**: Italian tax law requires using prior year income for pension contribution deductions

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

**How TFR Taxation Works - Detailed Explanation:**

1. **5-Year Average Rule**: Italian law requires averaging tax rates over the last 5 years of work
2. **Proportional Calculation**: For each year, calculate what percentage of income falls in each tax bracket
3. **Weighted Average**: The final rate is the average of all proportional rates

**Proportional Tax Calculation Process**:

```typescript
// For each income level, calculate weighted average of tax brackets
if (income <= 28000) {
    proportionalTaxation = 23; // All income in 23% bracket
} else if (income <= 50000) {
    const bracket1Amount = 28000;
    const bracket2Amount = income - 28000;
    proportionalTaxation =
        (bracket1Amount / income) * 23 + (bracket2Amount / income) * 35;
} else {
    const bracket1Amount = 28000; // First €28,000 at 23%
    const bracket2Amount = 22000; // Next €22,000 at 35% (€28k-€50k)
    const bracket3Amount = income - 50000; // Remainder at 43%
    proportionalTaxation =
        (bracket1Amount / income) * 23 +
        (bracket2Amount / income) * 35 +
        (bracket3Amount / income) * 43;
}
```

**Example - €45,000 Income**:

-   €28,000 taxed at 23% = portion weight: 28000/45000 = 62.2%
-   €17,000 taxed at 35% = portion weight: 17000/45000 = 37.8%
-   Proportional rate = (62.2% × 23%) + (37.8% × 35%) = 14.3% + 13.2% = **27.5%**

**Why This Method?**:

-   Prevents tax jumps when crossing bracket thresholds
-   Provides fairer taxation based on career-average income
-   Reflects Italian TFR tax law accurately

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

## 💼 Detailed Salary Examples

Here are three comprehensive examples showing how different income levels work in the Italian pension system:

### Example 1: €25,000 Gross Salary (Entry Level)

**Basic Setup:**

```typescript
const params = {
    annualIncome: 25000,
    investment: 2000, // Additional contribution
    employerContribution: 2.0, // 2%
    memberContribution: 1.3, // 1.3%
    calculateTfr: true,
};
```

**Annual Contributions:**

-   **TFR**: €25,000 × 7.41% = **€1,852.50**
-   **Employer**: €25,000 × 2% = **€500**
-   **Member**: €25,000 × 1.3% = **€325**
-   **Investment**: **€2,000** (user choice)
-   **Total Personal** (Member + Investment): €325 + €2,000 = **€2,325**

**Tax Benefits (Fiscal Relaxation):**

-   Previous year income: €25,000 (≤ €28,000)
-   Tax bracket: **23%**
-   Eligible amount: €2,325 (under €5,164.57 limit)
-   **Tax savings: €2,325 × 23% = €534.75**

**TFR Taxation:**

-   Proportional rate: **23%** (all income in lowest bracket)
-   5-year average: 23% (assuming stable income)

**Monthly Pension Fund Deposits:**

-   Regular contributions: (€500 + €325 + €2,000) ÷ 12 = **€235.42/month**
-   TFR: €1,852.50 ÷ 13 = **€142.50/month** (months 1-11)
-   December: €235.42 + (2 × €142.50) = **€520.42** (double TFR)

---

### Example 2: €33,000 Gross Salary (Mid-Level)

**Basic Setup:**

```typescript
const params = {
    annualIncome: 33000,
    investment: 3000,
    employerContribution: 2.0,
    memberContribution: 1.3,
    calculateTfr: true,
};
```

**Annual Contributions:**

-   **TFR**: €33,000 × 7.41% = **€2,445.30**
-   **Employer**: €33,000 × 2% = **€660**
-   **Member**: €33,000 × 1.3% = **€429**
-   **Investment**: **€3,000**
-   **Total Personal**: €429 + €3,000 = **€3,429**

**Tax Benefits (Fiscal Relaxation):**

-   Previous year income: €33,000 (> €28,000, < €50,000)
-   Available at 35% bracket: €33,000 - €28,000 = **€5,000**
-   Eligible contribution: €3,429 (all qualifies for 35%)
-   **Tax savings: €3,429 × 35% = €1,200.15**

**TFR Taxation (Proportional):**

-   Income €33,000 breakdown:
    -   €28,000 at 23% = (28,000/33,000) × 23% = **19.5%**
    -   €5,000 at 35% = (5,000/33,000) × 35% = **5.3%**
-   **Proportional rate: 19.5% + 5.3% = 24.8%**

**Monthly Pension Fund Deposits:**

-   Regular contributions: (€660 + €429 + €3,000) ÷ 12 = **€340.75/month**
-   TFR: €2,445.30 ÷ 13 = **€188.10/month** (months 1-11)
-   December: €340.75 + (2 × €188.10) = **€716.95** (double TFR)

---

### Example 3: €53,000 Gross Salary (Senior Level)

**Basic Setup:**

```typescript
const params = {
    annualIncome: 53000,
    investment: 4000,
    employerContribution: 2.5, // Higher employer contribution
    memberContribution: 1.5,
    calculateTfr: true,
};
```

**Annual Contributions:**

-   **TFR**: €53,000 × 7.41% = **€3,927.30**
-   **Employer**: €53,000 × 2.5% = **€1,325**
-   **Member**: €53,000 × 1.5% = **€795**
-   **Investment**: **€4,000**
-   **Total Personal**: €795 + €4,000 = **€4,795**

**Tax Benefits (Fiscal Relaxation) - Complex Calculation:**

-   Previous year income: €53,000 (> €50,000)
-   Available at 43% bracket: €53,000 - €50,000 = **€3,000**
-   Available at 35% bracket: €50,000 - €28,000 = **€22,000**
-   Eligible contribution: €4,795

**Tax savings breakdown:**

1. First €3,000 at 43%: €3,000 × 43% = **€1,290**
2. Remaining €1,795 at 35%: €1,795 × 35% = **€628.25**
3. **Total tax savings: €1,290 + €628.25 = €1,918.25**

**TFR Taxation (Proportional):**

-   Income €53,000 breakdown:
    -   €28,000 at 23% = (28,000/53,000) × 23% = **12.2%**
    -   €22,000 at 35% = (22,000/53,000) × 35% = **14.5%**
    -   €3,000 at 43% = (3,000/53,000) × 43% = **2.4%**
-   **Proportional rate: 12.2% + 14.5% + 2.4% = 29.1%**

**Monthly Pension Fund Deposits:**

-   Regular contributions: (€1,325 + €795 + €4,000) ÷ 12 = **€510/month**
-   TFR: €3,927.30 ÷ 13 = **€302.10/month** (months 1-11)
-   December: €510 + (2 × €302.10) = **€1,114.20** (double TFR)

---

### 📊 Comparison Summary

| Salary Level | Monthly Pension Deposit | Annual Tax Savings | TFR Tax Rate | Net Benefit               |
| ------------ | ----------------------- | ------------------ | ------------ | ------------------------- |
| **€25,000**  | €235.42 (+ TFR)         | €534.75            | 23.0%        | Lower but accessible      |
| **€33,000**  | €340.75 (+ TFR)         | €1,200.15          | 24.8%        | Optimal middle ground     |
| **€53,000**  | €510.00 (+ TFR)         | €1,918.25          | 29.1%        | Highest absolute benefits |

**Key Insights:**

-   Higher salaries get better tax deduction rates (35-43% vs 23%)
-   TFR taxation increases proportionally with income level
-   The €5,164.57 deduction limit affects high earners more
-   Monthly compounding benefits increase with contribution amounts

## 🤝 Contributing

We welcome contributions! There are two ways to contribute to this project:

### Option 1: Fork the Repository

1. **Fork** this repository to your own GitHub account
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/retire-right-lab.git`
3. **Create a feature branch** with proper naming: `git checkout -b feature/amazing-feature`
4. **Make your changes** with proper tests and documentation
5. **Commit** with proper message format: `git commit -m 'feat: add amazing feature'`
6. **Push** to your fork: `git push origin feature/amazing-feature`
7. **Create a Pull Request** from your fork to the main repository

### Option 2: Direct Branch (For Collaborators)

If you have write access to this repository:

1. **Clone** the repository: `git clone https://github.com/filippobrugnolaro/retire-right-lab.git`
2. **Create a feature branch** with proper naming: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper tests and documentation
4. **Commit** with proper message format: `git commit -m 'feat: add amazing feature'`
5. **Push** branch: `git push origin feature/amazing-feature`
6. **Create a Pull Request** on GitHub

### 📋 Branch Naming Rules

All branches must follow this pattern: `<type>/<name>`

**Valid types:**

-   `fix/` - Bug fixes
-   `feature/` or `feat/` - New features
-   `refactor/` - Code refactoring
-   `chore/` - Maintenance tasks
-   `docs/` - Documentation changes
-   `test/` - Adding or updating tests

**Examples:**

-   `fix/calculation-error`
-   `feature/new-chart-type`
-   `feat/mobile-responsive`
-   `docs/update-readme`

### 💬 Commit Message Rules

All commit messages must start with one of these keywords:
`fix`, `feature`, `feat`, `refactor`, `chore`, `docs`, `test`, or `merge`/`Merge`

**Format:** `<type>: <description>` or `Merge <branch-info>`

**Examples:**

-   `fix: resolve compound interest calculation`
-   `feat: add new pension fund chart`
-   `docs: update contribution guidelines`
-   `refactor: simplify tax calculation logic`
-   `Merge branch 'feature/new-calculator' into main`
-   `merge pull request #123 from user/fix-bug`

### 🔒 Branch Protection

-   **Main branch is protected** - only codeowners can push directly
-   **All contributors must use Pull Requests** with proper branch naming
-   **Pull Requests require codeowner approval** before merging
-   **CI/CD checks must pass** (build, lint, tests, validations)

For detailed development guidelines, see [DEVELOPMENT.md](DEVELOPMENT.md)

### Development Guidelines

-   Follow TypeScript best practices
-   Add tests for calculation logic
-   Update documentation for new features
-   Ensure responsive design compatibility

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This calculator is for **educational and informational purposes only**. The calculations are based on current Italian tax regulations and market assumptions. Always consult with qualified financial advisors for professional investment advice. The authors are not responsible for any financial decisions made based on this tool.
