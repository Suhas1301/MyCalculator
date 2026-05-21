import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import BasicCalculator from './modules/basic/BasicCalculator';
import GraphingCalculator from './modules/graphing/GraphingCalculator';
import ChemistryCalculator from './modules/chemistry/ChemistryCalculator';
import UnitConverter from './modules/converter/UnitConverter';
import ProgrammerCalculator from './modules/programmer/ProgrammerCalculator';
import FinancialCalculator from './modules/financial/FinancialCalculator';
import EngineeringCalculator from './modules/engineering/EngineeringCalculator';
import DateTimeCalculator from './modules/date-time/DateTimeCalculator';
import HealthCalculator from './modules/health/HealthCalculator';
import AiSearchPanel from './modules/ai-search/AiSearchPanel';
import EducationSuite from './modules/education/EducationSuite';
import FormulaSearch from './modules/formulas/FormulaSearch';
import { X, Trash2, Sliders, Check } from 'lucide-react';

function DashboardContent() {
  const { activeModule, history, clearHistory, settings, updateSetting, getAccentColor } = useApp();
  
  // Overlay draws states
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const accentColor = getAccentColor(activeModule);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'basic': return <BasicCalculator />;
      case 'graphing': return <GraphingCalculator />;
      case 'chemistry': return <ChemistryCalculator />;
      case 'converter': return <UnitConverter />;
      case 'programmer': return <ProgrammerCalculator />;
      case 'financial': return <FinancialCalculator />;
      case 'engineering': return <EngineeringCalculator />;
      case 'datetime': return <DateTimeCalculator />;
      case 'health': return <HealthCalculator />;
      case 'ai-search': return <AiSearchPanel />;
      case 'education': return <EducationSuite />;
      case 'formulas': return <FormulaSearch />;
      default: return <BasicCalculator />;
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      {/* Visual background blurred neon blobs */}
      <div className="neon-auras">
        <div className="aura-blob aura-1" style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }} />
        <div className="aura-blob aura-2" />
        <div className="aura-blob aura-3" />
      </div>

      {/* Sidebar Nav */}
      <Sidebar 
        onOpenSettings={() => { setShowSettings(true); setShowHistory(false); }} 
        onOpenHistory={() => { setShowHistory(true); setShowSettings(false); }} 
      />

      {/* Main Content Dashboard */}
      <main 
        className="glass-panel"
        style={{
          flex: 1,
          margin: '12px',
          marginLeft: '6px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 24px)',
          overflow: 'hidden',
          background: 'rgba(10, 12, 22, 0.45)',
          position: 'relative'
        }}
      >
        {/* Active Module Panel Render */}
        <div style={{ flex: 1, height: '100%', minHeight: 0 }}>
          {renderActiveModule()}
        </div>

        {/* ================= PREFERENCES SETTINGS OVERLAY ================= */}
        {showSettings && (
          <div 
            className="glass-panel animate-scale"
            style={{
              position: 'absolute',
              top: '70px',
              right: '24px',
              width: '320px',
              zIndex: 100,
              padding: '20px',
              background: 'rgba(12, 15, 28, 0.95)',
              boxShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 15px ${accentColor}10`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Sliders size={16} style={{ color: accentColor }} />
                Preferences
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
              {/* Decimal Precision selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--text-secondary)' }}>Calculation Precision (Decimals)</label>
                <select
                  value={settings.decimalPlaces}
                  onChange={(e) => updateSetting('decimalPlaces', parseInt(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  {[2, 3, 4, 6, 8, 10].map(n => (
                    <option key={n} value={n} style={{ background: '#0a0c16' }}>{n} decimal places</option>
                  ))}
                </select>
              </div>

              {/* Haptic trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Keyboard Haptic Feedback</span>
                <button
                  onClick={() => updateSetting('keyboardHaptics', !settings.keyboardHaptics)}
                  className="btn-glow"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: `1px solid ${settings.keyboardHaptics ? accentColor : 'var(--border-color)'}`,
                    background: settings.keyboardHaptics ? `${accentColor}10` : 'transparent',
                    color: settings.keyboardHaptics ? accentColor : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {settings.keyboardHaptics ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Angle mode readout */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Angle measurement unit</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 700, color: accentColor }}>
                  {settings.angleMode}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= HISTORY DRAWER OVERLAY ================= */}
        {showHistory && (
          <div 
            className="glass-panel animate-scale"
            style={{
              position: 'absolute',
              top: '70px',
              right: '24px',
              width: '360px',
              height: '420px',
              zIndex: 100,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(12, 15, 28, 0.95)',
              boxShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 15px ${accentColor}10`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Calculation History</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={clearHistory}
                  className="btn-glow flex-center"
                  style={{ width: '28px', height: '28px', border: 'none', color: 'var(--color-chemistry)', borderRadius: '6px' }}
                  title="Clear history catalog"
                >
                  <Trash2 size={14} />
                </button>
                <button 
                  onClick={() => setShowHistory(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* History List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                      <span>{item.module}</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <code className="math-mono" style={{ color: '#fff', wordBreak: 'break-all' }}>{item.expression}</code>
                    <code className="math-mono" style={{ color: accentColor, fontWeight: 700, textAlign: 'right' }}>= {item.result}</code>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  History is empty. Run calculations to fill catalog.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
