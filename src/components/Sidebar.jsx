import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  LineChart,
  FlaskConical,
  Scale,
  Binary,
  TrendingUp,
  Zap,
  Clock,
  HeartPulse,
  Sparkles,
  BookOpen,
  Sigma,
  ChevronLeft,
  ChevronRight,
  Settings,
  History
} from 'lucide-react';

const modules = [
  { id: 'basic', name: 'Basic & Scientific', icon: Calculator, desc: 'Standard Arithmetic & Functions' },
  { id: 'advanced-scientific', name: 'Advanced Math Suite', icon: Sigma, desc: 'Matrix, Vector, Equation, Stat' },
  { id: 'graphing', name: 'Graph Plotter', icon: LineChart, desc: 'Visualize Equations' },
  { id: 'chemistry', name: 'Chemistry & Periodic', icon: FlaskConical, desc: 'Molecules & Table' },
  { id: 'converter', name: 'Unit Converter', icon: Scale, desc: 'Units & Live Exchange' },
  { id: 'programmer', name: 'Programmer', icon: Binary, desc: 'Bases & Bitwise' },
  { id: 'financial', name: 'Financial suite', icon: TrendingUp, desc: 'EMI, SIP & Loan' },
  { id: 'engineering', name: 'Engineering & Physics', icon: Zap, desc: 'Circuitry & Formulas' },
  { id: 'datetime', name: 'Date & Time', icon: Clock, desc: 'Zones & Date diffs' },
  { id: 'health', name: 'Health & Fitness', icon: HeartPulse, desc: 'BMI, BMR & Calories' },
  { id: 'ai-search', name: 'AI Helper & Search', icon: Sparkles, desc: 'Local natural language solver' },
  { id: 'education', name: 'Education & Custom', icon: BookOpen, desc: 'Quizzes & formula builder' },
  { id: 'formulas', name: 'Formula Search & Solver', icon: Sigma, desc: 'Integral, Derivative, Trig & Physics' }
];

export default function Sidebar({ onOpenSettings, onOpenHistory }) {
  const { activeModule, setActiveModule, getAccentColor } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`glass-panel sidebar-container ${collapsed ? 'collapsed' : 'expanded'}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 24px)',
        margin: '12px',
        marginRight: '6px',
        width: collapsed ? '80px' : '280px',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        zIndex: 10,
        position: 'relative',
        background: 'var(--bg-sidebar)',
      }}
    >
      {/* Brand Header */}
      <div
        className="sidebar-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '20px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--color-basic) 0%, var(--color-scientific) 100%)',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#fff'
              }}
            >
              Ω
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', margin: 0 }}>OMNICALC</h1>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>ULTIMATE MATHEMATICS</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-basic) 0%, var(--color-scientific) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.3rem',
              color: '#fff',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
            }}
          >
            Ω
          </div>
        )}

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="btn-glow"
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: '6px'
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="btn-glow"
          style={{
            width: '28px',
            height: '28px',
            margin: '10px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Nav List */}
      <nav
        style={{
          flex: 1,
          padding: '12px 10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = activeModule === m.id;
          const accentColor = getAccentColor(m.id);

          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: isActive ? `linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)` : 'transparent',
                border: 'none',
                borderLeft: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                gap: '14px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                position: 'relative'
              }}
              className="sidebar-item-btn"
              title={collapsed ? m.name : undefined}
            >
              {/* Active glow backing */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '15%',
                    left: 0,
                    width: '10px',
                    height: '70%',
                    background: accentColor,
                    filter: 'blur(8px)',
                    opacity: 0.5,
                    pointerEvents: 'none'
                  }}
                />
              )}

              <Icon
                size={20}
                style={{
                  color: isActive ? accentColor : 'var(--text-secondary)',
                  transition: 'color var(--transition-fast)',
                  flexShrink: 0
                }}
              />

              {!collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>
                    {m.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {m.desc}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Settings & History */}
      <div
        style={{
          padding: '12px 10px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        <button
          onClick={onOpenHistory}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            textAlign: 'left',
            cursor: 'pointer',
            gap: '14px',
            transition: 'all var(--transition-fast)'
          }}
          className="btn-glow"
        >
          <History size={18} />
          {!collapsed && <span style={{ fontSize: '0.85rem' }}>Calculation History</span>}
        </button>

        <button
          onClick={onOpenSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            textAlign: 'left',
            cursor: 'pointer',
            gap: '14px',
            transition: 'all var(--transition-fast)'
          }}
          className="btn-glow"
        >
          <Settings size={18} />
          {!collapsed && <span style={{ fontSize: '0.85rem' }}>Preferences</span>}
        </button>
      </div>
    </aside>
  );
}
