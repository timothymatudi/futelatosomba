import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './MortgageCalculator.css';

const DRC_BANKS = [
  { name: 'Rawbank', rate: 18.0 },
  { name: 'Equity Bank Congo', rate: 20.0 },
  { name: 'TMB (Trust Merchant Bank)', rate: 22.0 },
  { name: 'UBA Congo', rate: 21.0 },
  { name: 'FBNBank Congo', rate: 19.5 },
  { name: 'Custom rate', rate: null },
];

const CDF_RATE = 2800; // approx CDF per USD

const fmt = (amount, currency) =>
  currency === 'CDF'
    ? new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(amount)
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

const PieChart = ({ principal, interest }) => {
  const total = principal + interest;
  if (!total) return null;
  const pct = principal / total;
  const r = 54;
  const cx = 64, cy = 64;
  const angle = pct * 2 * Math.PI;
  const x = cx + r * Math.sin(angle);
  const y = cy - r * Math.cos(angle);
  const large = pct > 0.5 ? 1 : 0;
  return (
    <svg viewBox="0 0 128 128" width="128" height="128" className="pie-chart">
      <circle cx={cx} cy={cy} r={r} fill="#e5e7eb" />
      {pct > 0 && pct < 1 && (
        <path
          d={`M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 ${large},1 ${x},${y} Z`}
          fill="#007fff"
        />
      )}
      {pct >= 1 && <circle cx={cx} cy={cy} r={r} fill="#007fff" />}
    </svg>
  );
};

const MortgageCalculator = () => {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState(80000);
  const [deposit, setDeposit] = useState(16000);
  const [bankIdx, setBankIdx] = useState(0);
  const [customRate, setCustomRate] = useState(18.0);
  const [term, setTerm] = useState(10);
  const [monthlyIncome, setMonthlyIncome] = useState(2000);

  const rate = DRC_BANKS[bankIdx].rate ?? customRate;

  const result = useMemo(() => {
    const priceUSD = currency === 'CDF' ? Number(price) / CDF_RATE : Number(price);
    const depositUSD = currency === 'CDF' ? Number(deposit) / CDF_RATE : Number(deposit);
    const incomeUSD = currency === 'CDF' ? Number(monthlyIncome) / CDF_RATE : Number(monthlyIncome);
    const principal = Math.max(priceUSD - depositUSD, 0);
    const monthlyRate = Number(rate) / 100 / 12;
    const months = Number(term) * 12;

    const monthlyPayment = monthlyRate === 0
      ? principal / months
      : principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    const totalRepayment = monthlyPayment * months;
    const totalInterest = totalRepayment - principal;
    const affordabilityRatio = incomeUSD > 0 ? (monthlyPayment / incomeUSD) * 100 : 0;
    const depositPct = priceUSD > 0 ? (depositUSD / priceUSD) * 100 : 0;

    // First 12 months amortization
    let balance = principal;
    const schedule = [];
    for (let i = 1; i <= Math.min(12, months); i++) {
      const interestPmt = balance * monthlyRate;
      const principalPmt = monthlyPayment - interestPmt;
      balance -= principalPmt;
      schedule.push({ month: i, principal: principalPmt, interest: interestPmt, balance: Math.max(balance, 0) });
    }

    const display = (v) => currency === 'CDF' ? v * CDF_RATE : v;

    return {
      principal: display(principal),
      monthlyPayment: display(monthlyPayment),
      totalRepayment: display(totalRepayment),
      totalInterest: display(totalInterest),
      affordabilityRatio,
      depositPct,
      affordable: affordabilityRatio <= 35,
      schedule: schedule.map(r => ({ ...r, principal: display(r.principal), interest: display(r.interest), balance: display(r.balance) })),
      principalRaw: principal,
      totalInterestRaw: totalInterest,
    };
  }, [price, deposit, rate, term, monthlyIncome, currency]);

  const toDisplay = (v) => currency === 'CDF' ? Math.round(v * CDF_RATE) : v;

  return (
    <div className="mortgage-page">
      <section className="mortgage-hero">
        <h1>{t('mortgageCalculatorTitle')}</h1>
        <p>{t('mortgageCalculatorSubtitle')}</p>
        <div className="currency-toggle">
          <button className={currency === 'USD' ? 'active' : ''} onClick={() => { setCurrency('USD'); setPrice(80000); setDeposit(16000); setMonthlyIncome(2000); }}>USD $</button>
          <button className={currency === 'CDF' ? 'active' : ''} onClick={() => { setCurrency('CDF'); setPrice(toDisplay(80000)); setDeposit(toDisplay(16000)); setMonthlyIncome(toDisplay(2000)); }}>CDF FC</button>
        </div>
      </section>

      <div className="mortgage-container">
        <div className="mortgage-panel">
          <h2>{t('mortgageLoanDetails')}</h2>

          <div className="bank-presets">
            <p className="preset-label">{t('mortgageBankPreset')}</p>
            <div className="preset-buttons">
              {DRC_BANKS.map((b, i) => (
                <button
                  key={b.name}
                  className={`preset-btn ${bankIdx === i ? 'active' : ''}`}
                  onClick={() => setBankIdx(i)}
                >
                  {b.name}{b.rate ? ` — ${b.rate}%` : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="mortgage-form">
            <label>
              {t('mortgagePropertyPrice')} ({currency})
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>

            <label>
              {t('mortgageDeposit')} ({currency})
              <div className="input-with-pct">
                <input type="number" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                <span className="pct-badge">{result.depositPct.toFixed(0)}%</span>
              </div>
            </label>

            {DRC_BANKS[bankIdx].rate === null && (
              <label>
                {t('mortgageInterestRate')} (%)
                <input type="number" min="0" step="0.5" value={customRate} onChange={(e) => setCustomRate(e.target.value)} />
              </label>
            )}

            <label>
              {t('mortgageTerm')} ({t('years')})
              <input type="number" min="1" max="15" value={term} onChange={(e) => setTerm(Math.min(15, Math.max(1, e.target.value)))} />
              <span className="field-hint">{t('mortgageTermHint')}</span>
            </label>

            <label>
              {t('mortgageMonthlyIncome')} ({currency})
              <input type="number" min="0" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
            </label>
          </div>

          <div className="drc-tip">
            <span>💡</span>
            <p>{t('mortgageDRCTip')}</p>
          </div>
        </div>

        <div className="mortgage-results">
          <div className="result-card primary">
            <span>{t('mortgageMonthlyPayment')}</span>
            <strong>{fmt(result.monthlyPayment || 0, currency)}</strong>
            <em>{t('mortgagePerMonth')}</em>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <span>{t('mortgageLoanAmount')}</span>
              <strong>{fmt(result.principal || 0, currency)}</strong>
            </div>
            <div className="result-card">
              <span>{t('mortgageTotalInterest')}</span>
              <strong>{fmt(result.totalInterest || 0, currency)}</strong>
            </div>
            <div className="result-card">
              <span>{t('mortgageTotalRepayment')}</span>
              <strong>{fmt(result.totalRepayment || 0, currency)}</strong>
            </div>
            <div className={`result-card ${result.affordable ? 'good' : 'warning'}`}>
              <span>{t('mortgageAffordabilityRatio')}</span>
              <strong>{Number.isFinite(result.affordabilityRatio) ? result.affordabilityRatio.toFixed(1) : '0.0'}%</strong>
            </div>
          </div>

          <div className="pie-section">
            <PieChart principal={result.principalRaw} interest={result.totalInterestRaw} />
            <div className="pie-legend">
              <div><span className="dot blue"></span>{t('mortgagePrincipal')}: {fmt(result.principal || 0, currency)}</div>
              <div><span className="dot grey"></span>{t('mortgageTotalInterest')}: {fmt(result.totalInterest || 0, currency)}</div>
            </div>
          </div>

          <p className="mortgage-note">
            {result.affordable ? t('mortgageAffordable') : t('mortgageNotAffordable')}
          </p>
          <p className="mortgage-disclaimer">{t('mortgageDisclaimer')}</p>
        </div>
      </div>

      {result.schedule.length > 0 && (
        <div className="amortization-section">
          <div className="amortization-inner">
            <h3>{t('mortgageFirstYearBreakdown')}</h3>
            <div className="amort-table-wrap">
              <table className="amort-table">
                <thead>
                  <tr>
                    <th>{t('mortgageMonth')}</th>
                    <th>{t('mortgagePrincipal')}</th>
                    <th>{t('mortgageTotalInterest')}</th>
                    <th>{t('mortgageBalance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map(row => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>{fmt(row.principal, currency)}</td>
                      <td>{fmt(row.interest, currency)}</td>
                      <td>{fmt(row.balance, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MortgageCalculator;
