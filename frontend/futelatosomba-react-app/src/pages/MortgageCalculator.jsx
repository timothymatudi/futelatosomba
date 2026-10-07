import React, { useMemo, useState } from 'react';
import './MortgageCalculator.css';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const MortgageCalculator = () => {
  const [price, setPrice] = useState(250000);
  const [deposit, setDeposit] = useState(50000);
  const [rate, setRate] = useState(8.5);
  const [term, setTerm] = useState(20);
  const [monthlyIncome, setMonthlyIncome] = useState(4500);

  const result = useMemo(() => {
    const principal = Math.max(Number(price) - Number(deposit), 0);
    const monthlyRate = Number(rate) / 100 / 12;
    const months = Number(term) * 12;

    const monthlyPayment = monthlyRate === 0
      ? principal / months
      : principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    const totalRepayment = monthlyPayment * months;
    const totalInterest = totalRepayment - principal;
    const affordabilityRatio = Number(monthlyIncome) > 0 ? (monthlyPayment / Number(monthlyIncome)) * 100 : 0;

    return {
      principal,
      monthlyPayment,
      totalRepayment,
      totalInterest,
      affordabilityRatio,
      affordable: affordabilityRatio <= 35,
    };
  }, [price, deposit, rate, term, monthlyIncome]);

  return (
    <div className="mortgage-page">
      <section className="mortgage-hero">
        <h1>Mortgage Calculator</h1>
        <p>Estimate monthly payments and affordability before you contact an agent.</p>
      </section>

      <div className="mortgage-container">
        <div className="mortgage-panel">
          <h2>Property and loan details</h2>
          <div className="mortgage-form">
            <label>
              Property price
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>

            <label>
              Deposit / down payment
              <input type="number" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
            </label>

            <label>
              Interest rate (%)
              <input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
            </label>

            <label>
              Mortgage term (years)
              <input type="number" min="1" max="40" value={term} onChange={(e) => setTerm(e.target.value)} />
            </label>

            <label>
              Monthly household income
              <input type="number" min="0" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
            </label>
          </div>
        </div>

        <div className="mortgage-results">
          <div className="result-card primary">
            <span>Estimated monthly payment</span>
            <strong>{currencyFormatter.format(result.monthlyPayment || 0)}</strong>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <span>Loan amount</span>
              <strong>{currencyFormatter.format(result.principal || 0)}</strong>
            </div>
            <div className="result-card">
              <span>Total interest</span>
              <strong>{currencyFormatter.format(result.totalInterest || 0)}</strong>
            </div>
            <div className="result-card">
              <span>Total repayment</span>
              <strong>{currencyFormatter.format(result.totalRepayment || 0)}</strong>
            </div>
            <div className={`result-card ${result.affordable ? 'good' : 'warning'}`}>
              <span>Payment / income ratio</span>
              <strong>{Number.isFinite(result.affordabilityRatio) ? result.affordabilityRatio.toFixed(1) : '0.0'}%</strong>
            </div>
          </div>

          <p className="mortgage-note">
            {result.affordable
              ? 'This estimate is within a common affordability guideline of 35% of monthly income.'
              : 'This estimate is above 35% of monthly income. Consider a larger deposit, lower price, or longer term.'}
          </p>
          <p className="mortgage-disclaimer">
            This is an estimate only. Actual lender terms, fees, insurance, taxes and exchange rates may differ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
