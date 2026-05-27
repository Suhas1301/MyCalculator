import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Landmark, TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';

export default function FinancialCalculator() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('financial');

  const [activeTab, setActiveTab] = useState('loan'); // loan, sip, compound

  // Loan EMI inputs
  const [loanPrincipal, setLoanPrincipal] = useState(100000);
  const [loanRate, setLoanRate] = useState(7.5);
  const [loanTenure, setLoanTenure] = useState(5); // years

  // SIP inputs
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12.0);
  const [sipTenure, setSipTenure] = useState(10); // years

  // Compound Interest inputs
  const [compPrincipal, setCompPrincipal] = useState(50000);
  const [compMonthly, setCompMonthly] = useState(1000);
  const [compRate, setCompRate] = useState(8.0);
  const [compTenure, setCompTenure] = useState(10); // years
  const [compFreq, setCompFreq] = useState(12); // compounding per year (12 = monthly, 4 = quarterly, 1 = annually)

  // Output stats state
  const [results, setResults] = useState({
    primary: 0,
    secondary: 0,
    tertiary: 0,
    percentage: 50 // Principal relative to interest ratio
  });

  useEffect(() => {
    calculateResults();
  }, [activeTab, loanPrincipal, loanRate, loanTenure, sipMonthly, sipRate, sipTenure, compPrincipal, compMonthly, compRate, compTenure, compFreq]);

  const calculateResults = () => {
    if (activeTab === 'loan') {
      const P = parseFloat(loanPrincipal);
      const annualR = parseFloat(loanRate);
      const N = parseFloat(loanTenure) * 12; // total months
      
      if (isNaN(P) || isNaN(annualR) || isNaN(N) || P <= 0 || annualR <= 0 || N <= 0) return;

      const r = (annualR / 12) / 100; // monthly rate
      
      // EMI = P * r * (1+r)^N / ((1+r)^N - 1)
      const emi = P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
      const totalRepay = emi * N;
      const totalInterest = totalRepay - P;

      setResults({
        primary: emi,          // Monthly Payment
        secondary: totalInterest, // Total Interest
        tertiary: totalRepay,     // Total Payments
        percentage: (P / totalRepay) * 100
      });
    } 
    
    else if (activeTab === 'sip') {
      const P = parseFloat(sipMonthly);
      const annualR = parseFloat(sipRate);
      const N = parseFloat(sipTenure) * 12; // total months
      
      if (isNaN(P) || isNaN(annualR) || isNaN(N) || P <= 0 || annualR <= 0 || N <= 0) return;

      const i = (annualR / 12) / 100; // monthly return rate
      
      // Future Value = P * [ ( (1 + i)^N - 1 ) / i ] * (1 + i)
      const futureVal = P * ((Math.pow(1 + i, N) - 1) / i) * (1 + i);
      const totalInvest = P * N;
      const wealthGained = futureVal - totalInvest;

      setResults({
        primary: futureVal,     // Total Wealth
        secondary: totalInvest,   // Total Invested
        tertiary: wealthGained,   // Wealth Gained
        percentage: (totalInvest / futureVal) * 100
      });
    } 
    
    else if (activeTab === 'compound') {
      const P = parseFloat(compPrincipal);
      const PMT = parseFloat(compMonthly);
      const r = parseFloat(compRate) / 100;
      const t = parseFloat(compTenure);
      const n = parseInt(compFreq);
      
      if (isNaN(P) || isNaN(PMT) || isNaN(r) || isNaN(t) || isNaN(n) || t <= 0) return;

      const totalPayments = n * t;
      const ratePerPeriod = r / n;
      
      // Compound interest formula: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
      const compoundPrincipalPart = P * Math.pow(1 + ratePerPeriod, totalPayments);
      const compoundContributionPart = PMT * ((Math.pow(1 + ratePerPeriod, totalPayments) - 1) / ratePerPeriod);
      const futureVal = compoundPrincipalPart + compoundContributionPart;
      
      const totalInvest = P + (PMT * 12 * t);
      const interestGained = futureVal - totalInvest;

      setResults({
        primary: futureVal,       // Total accumulated wealth
        secondary: totalInvest,     // Total contributions
        tertiary: interestGained,   // Interest accrued
        percentage: (totalInvest / futureVal) * 100
      });
    }
  };

  // Helper for currency formatting
  const fmt = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Dynamic SVG Circular Donut Chart Render
  const renderDonutChart = () => {
    const strokeDash = 2 * Math.PI * 40; // circum = 251.3
    const value = results.percentage; // percentage of principal
    const fillOffset = strokeDash - (strokeDash * value) / 100;

    return (
      <svg width="180" height="180" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        {/* Glow Filters */}
        <defs>
          <filter id="glow-primary" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Interest Circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="10"
        />

        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="rgba(51, 255, 252, 0.2)"
          strokeWidth="10"
        />

        {/* Secondary Circle (Interest contribution) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#0099ff"
          strokeWidth="10"
          strokeDasharray={strokeDash}
          strokeDashoffset={0}
        />

        {/* Primary Circle (Principal/Invested contribution) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke={accentColor}
          strokeWidth="10"
          strokeDasharray={strokeDash}
          strokeDashoffset={fillOffset}
          strokeLinecap="round"
          filter="url(#glow-primary)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
    );
  };

  const tabs = [
    { id: 'loan', name: 'Loan EMI Planner', icon: Landmark },
    { id: 'sip', name: 'SIP Wealth Gainer', icon: TrendingUp },
    { id: 'compound', name: 'Compound Accrual', icon: DollarSign }
  ];

  return (
    <div 
      className="animate-slide"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '16px',
        padding: '8px',
        overflowY: 'auto'
      }}
    >
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Financial Calculators</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>High-fidelity wealth modeling, interest accruals, and interactive schedules</p>
      </div>

      {/* Tabs */}
      <div 
        style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '4px',
          width: 'fit-content'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: isActive ? `1px solid ${accentColor}40` : '1px solid transparent',
                background: isActive ? `${accentColor}18` : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? `0 0 12px ${accentColor}20` : 'none'
              }}
            >
              <Icon size={16} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Calculator Body Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '16px',
          alignItems: 'start'
        }}
      >
        {/* Left Side: Dynamic Inputs Form Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '20px',
            background: 'rgba(16, 20, 35, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Configure Parameters</h3>

          {activeTab === 'loan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Principal Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Loan Principal Amount</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={loanPrincipal}
                    onChange={(e) => setLoanPrincipal(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                  />
                </div>
              </div>

              {/* Interest Rate Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual Interest Rate (%)</label>
                <div style={{ position: 'relative' }}>
                  <Percent size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={loanRate}
                    onChange={(e) => setLoanRate(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                    step="0.1"
                  />
                </div>
              </div>

              {/* Tenure Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Loan Tenure (Years)</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sip' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Monthly contribution */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly Systematic Contribution</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={sipMonthly}
                    onChange={(e) => setSipMonthly(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                  />
                </div>
              </div>

              {/* Annual Interest Rate */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expected Annual Return (%)</label>
                <div style={{ position: 'relative' }}>
                  <Percent size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={sipRate}
                    onChange={(e) => setSipRate(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                    step="0.1"
                  />
                </div>
              </div>

              {/* Tenure input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tenure Duration (Years)</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={sipTenure}
                    onChange={(e) => setSipTenure(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compound' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Initial Principal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Initial Investment Principal</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={compPrincipal}
                    onChange={(e) => setCompPrincipal(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                  />
                </div>
              </div>

              {/* Monthly Contribution */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recurring Monthly Contribution</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={compMonthly}
                    onChange={(e) => setCompMonthly(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                  />
                </div>
              </div>

              {/* Rate input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual Yield Rate (%)</label>
                <div style={{ position: 'relative' }}>
                  <Percent size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={compRate}
                    onChange={(e) => setCompRate(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                    step="0.1"
                  />
                </div>
              </div>

              {/* Tenure input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Duration (Years)</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    value={compTenure}
                    onChange={(e) => setCompTenure(e.target.value)}
                    className="glass-input math-mono"
                    style={{ width: '100%', paddingLeft: '32px' }}
                  />
                </div>
              </div>

              {/* Compounding frequency select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compounding Interval</label>
                <select
                  value={compFreq}
                  onChange={(e) => setCompFreq(parseInt(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  <option value="12" style={{ background: '#0a0c16' }}>Monthly (12 times/yr)</option>
                  <option value="4" style={{ background: '#0a0c16' }}>Quarterly (4 times/yr)</option>
                  <option value="1" style={{ background: '#0a0c16' }}>Annually (1 time/yr)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Charts & Computational Breakdown Details */}
        <div 
          className="glass-panel"
          style={{
            padding: '20px',
            background: 'rgba(16, 20, 35, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          {/* Dynamic Donut Chart Display */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {renderDonutChart()}
            {/* Center Label Percentage text */}
            <div 
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{results.percentage.toFixed(0)}%</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Principal</span>
            </div>
          </div>

          {/* Core financial readouts */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {activeTab === 'loan' ? 'Monthly EMI:' : 'Future Wealth Accumulation:'}
              </span>
              <span className="math-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: accentColor }}>
                {fmt(results.primary)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {activeTab === 'loan' ? 'Total Principal:' : 'Total Invested Capital:'}
                </span>
              </div>
              <span className="math-mono" style={{ fontWeight: 600, color: '#fff' }}>
                {activeTab === 'loan' ? fmt(loanPrincipal) : fmt(results.secondary)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0099ff' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {activeTab === 'loan' ? 'Total Interest Accrued:' : 'Total Wealth Earnings:'}
                </span>
              </div>
              <span className="math-mono" style={{ fontWeight: 600, color: '#fff' }}>
                {activeTab === 'loan' ? fmt(results.secondary) : fmt(results.tertiary)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingTop: '8px', borderTop: '1px solid var(--border-color)', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Payments value:</span>
              <span className="math-mono" style={{ fontWeight: 700, color: '#fff' }}>
                {activeTab === 'loan' ? fmt(results.tertiary) : fmt(results.primary)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
