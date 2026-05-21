const fs = require('fs');
const path = require('path');

const jsxContent = `import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateExpression } from '../../utils/mathParser';
import { Trash2, Grid, Table as TableIcon, BarChart2 } from 'lucide-react';
import * as math from 'mathjs';
import './AdvancedScientificCalculator.css';

const MODES = [
  { id: 'STAT', name: 'Statistics' },
  { id: 'TABLE', name: 'Table' },
  { id: 'CMPLX', name: 'Complex' },
  { id: 'EQN', name: 'Equation' },
  { id: 'BASE-N', name: 'Base-N' },
  { id: 'MATRIX', name: 'Matrix' },
  { id: 'VECTOR', name: 'Vector' }
];

export default function AdvancedScientificCalculator() {
  const { addHistoryItem, settings, updateSetting, getAccentColor } = useApp();
  const accentColor = getAccentColor('advanced-scientific');

  const [activeMode, setActiveMode] = useState('MATRIX');

  const [tokens, setTokens] = useState([]);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(true);
  const displayRef = useRef(null);

  // Matrix State Manager
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [selectedMatrixId, setSelectedMatrixId] = useState('A');
  const [matrices, setMatrices] = useState({
    A: [[0, 0], [0, 0]],
    B: [[0, 0], [0, 0]],
    C: [[0, 0], [0, 0]]
  });
  
  const [showStatModal, setShowStatModal] = useState(false);
  const [statData, setStatData] = useState([{x:0}]);
  const [statResults, setStatResults] = useState(null);

  const [showTableModal, setShowTableModal] = useState(false);
  const [tableSetup, setTableSetup] = useState({ func: 'x^2', start: 1, end: 5, step: 1 });
  const [tableResults, setTableResults] = useState(null);

  const playHaptic = () => {
    if (settings.keyboardHaptics && navigator.vibrate) navigator.vibrate(10);
  };

  useEffect(() => {
    if (displayRef.current) {
      const cursorEl = displayRef.current.querySelector('.cursor-active');
      if (cursorEl) cursorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [cursorIndex, tokens]);

  const handleInsert = (value, type = 'num', display = null) => {
    playHaptic();
    setError('');
    const newToken = { type, value, display: display || value };
    setTokens(prev => {
      const newTokens = [...prev];
      newTokens.splice(cursorIndex, 0, newToken);
      return newTokens;
    });
    setCursorIndex(prev => prev + 1);
  };

  const handleDelete = () => {
    playHaptic();
    setError('');
    if (cursorIndex > 0) {
      setTokens(prev => {
        const newTokens = [...prev];
        newTokens.splice(cursorIndex - 1, 1);
        return newTokens;
      });
      setCursorIndex(prev => prev - 1);
    }
  };

  const handleClear = () => {
    playHaptic();
    setTokens([]);
    setCursorIndex(0);
    setResult(null);
    setError('');
  };

  const calculateResult = () => {
    playHaptic();
    if (tokens.length === 0) return;
    
    const expressionString = tokens.map(t => t.value).join('');
    try {
      let finalResult = null;
      if (activeMode === 'STAT' || activeMode === 'TABLE') {
        const res = evaluateExpression(expressionString, {}, settings.angleMode);
        if (isNaN(res)) { setError('Math Error'); return; }
        finalResult = Number(res.toFixed(settings.decimalPlaces)).toString();
      } else {
        // Pass matrices in scope
        const scope = { 
          MatA: matrices.A, 
          MatB: matrices.B, 
          MatC: matrices.C 
        };
        
        let res = math.evaluate(expressionString, scope);
        
        if (activeMode === 'BASE-N') {
          finalResult = Number(res).toString(2) + ' (BIN)';
        } else {
          finalResult = res;
        }
      }
      
      const stringForHistory = (typeof finalResult === 'string' || typeof finalResult === 'number') 
                                ? finalResult.toString() 
                                : 'Matrix Result';
      addHistoryItem(expressionString, stringForHistory, 'Advanced Mode');
      setResult(finalResult);
      setError('');
    } catch (e) {
      console.error(e);
      setError('Syntax Error');
      setResult(null);
    }
  };

  const openModeModal = () => {
    playHaptic();
    if (activeMode === 'MATRIX' || activeMode === 'VECTOR') setShowMatrixModal(true);
    if (activeMode === 'STAT') setShowStatModal(true);
    if (activeMode === 'TABLE') setShowTableModal(true);
  };

  const renderMatrixModal = () => {
    const currentMat = matrices[selectedMatrixId];
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5, 7, 12, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ width: '90%', maxWidth: '450px', background: 'rgba(12, 15, 28, 0.95)', padding: '24px', borderRadius: '16px', border: \`1px solid \${accentColor}\` }}>
          <h3 style={{ color: '#fff', margin: '0 0 16px 0' }}>Matrix Manager</h3>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['A', 'B', 'C'].map(id => (
              <button 
                key={id}
                className="btn-glow" 
                onClick={() => setSelectedMatrixId(id)}
                style={{ flex: 1, padding: '8px', background: selectedMatrixId === id ? accentColor : 'rgba(255,255,255,0.05)', color: selectedMatrixId === id ? '#000' : '#fff', fontWeight: selectedMatrixId === id ? 'bold' : 'normal' }}
              >
                Mat{id}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button className="btn-glow" onClick={() => {
              const newMat = [...currentMat, new Array(currentMat[0].length).fill(0)];
              setMatrices({...matrices, [selectedMatrixId]: newMat});
            }} style={{ padding: '6px', fontSize: '0.8rem', flex: 1 }}>+ Row</button>
            <button className="btn-glow" onClick={() => {
              const newMat = currentMat.slice(0, -1);
              setMatrices({...matrices, [selectedMatrixId]: newMat});
            }} disabled={currentMat.length <= 1} style={{ padding: '6px', fontSize: '0.8rem', flex: 1 }}>- Row</button>
            <button className="btn-glow" onClick={() => {
              const newMat = currentMat.map(r => [...r, 0]);
              setMatrices({...matrices, [selectedMatrixId]: newMat});
            }} style={{ padding: '6px', fontSize: '0.8rem', flex: 1 }}>+ Col</button>
            <button className="btn-glow" onClick={() => {
              const newMat = currentMat.map(r => r.slice(0, -1));
              setMatrices({...matrices, [selectedMatrixId]: newMat});
            }} disabled={currentMat[0].length <= 1} style={{ padding: '6px', fontSize: '0.8rem', flex: 1 }}>- Col</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
            {currentMat.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px' }}>
                {row.map((val, j) => (
                  <input 
                    key={j} 
                    type="number" 
                    value={val} 
                    onChange={e => {
                      const newMat = currentMat.map(r => [...r]);
                      newMat[i][j] = Number(e.target.value) || 0;
                      setMatrices({...matrices, [selectedMatrixId]: newMat});
                    }}
                    className="glass-input math-mono" 
                    style={{ flex: 1, minWidth: '60px', padding: '8px', textAlign: 'center' }}
                  />
                ))}
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-glow" onClick={() => setShowMatrixModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)' }}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (error) return <span style={{color: 'var(--color-chemistry)'}}>{error}</span>;
    if (result === null) return null;

    if (Array.isArray(result) || result.constructor.name === 'Matrix') {
      const arr = result.valueOf();
      const is1D = !Array.isArray(arr[0]);
      const rows = is1D ? [arr] : arr;
      
      return (
        <div style={{ display: 'inline-block', borderLeft: \`2px solid \${accentColor}\`, borderRight: \`2px solid \${accentColor}\`, borderRadius: '4px', padding: '4px', margin: '4px 0' }}>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((val, j) => (
                    <td key={j} style={{ padding: '2px 8px', textAlign: 'center', fontSize: '1.2rem', color: '#fff' }}>
                      {typeof val === 'number' ? Number(val.toFixed(settings.decimalPlaces)) : val.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (typeof result === 'object' && result.re !== undefined) {
       // Complex number
       const re = Number(result.re.toFixed(settings.decimalPlaces));
       const im = Number(result.im.toFixed(settings.decimalPlaces));
       return <span>= {re} {im >= 0 ? '+' : '-'} {Math.abs(im)}i</span>;
    }

    return <span>= {result.toString()}</span>;
  };

  return (
    <div className="animate-slide advanced-scientific-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px', position: 'relative' }} onClick={() => setIsFocused(true)}>
      {showMatrixModal && renderMatrixModal()}
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Advanced Modes</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Specialized Calculations</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '2px' }}>
            <button onClick={() => { playHaptic(); updateSetting('angleMode', 'deg'); }} style={{ background: settings.angleMode === 'deg' ? accentColor : 'transparent', color: settings.angleMode === 'deg' ? '#000' : 'var(--text-secondary)', border: 'none', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}>DEG</button>
            <button onClick={() => { playHaptic(); updateSetting('angleMode', 'rad'); }} style={{ background: settings.angleMode === 'rad' ? accentColor : 'transparent', color: settings.angleMode === 'rad' ? '#000' : 'var(--text-secondary)', border: 'none', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}>RAD</button>
          </div>
        </div>
      </div>

      {/* Mode Selector Row */}
      <div className="mode-selector-scroll" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
        {MODES.map(mode => (
          <button key={mode.id} onClick={() => { playHaptic(); setActiveMode(mode.id); handleClear(); }} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', border: \`1px solid \${activeMode === mode.id ? accentColor : 'var(--border-color)'}\`, background: activeMode === mode.id ? \`\${accentColor}15\` : 'rgba(0,0,0,0.2)', color: activeMode === mode.id ? accentColor : 'var(--text-secondary)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}>{mode.id}</button>
        ))}
      </div>

      {/* Screen Area */}
      <div className="glass-panel display-screen" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(5, 7, 12, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', minHeight: '160px', boxShadow: \`0 0 25px rgba(0, 240, 255, 0.02), inset 0 0 15px rgba(255, 255, 255, 0.01)\`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: accentColor }} />
        
        <div style={{ position: 'absolute', top: '10px', left: '12px', display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: accentColor, background: \`\${accentColor}20\`, padding: '2px 6px', borderRadius: '4px' }}>{activeMode}</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', background: \`rgba(255,255,255,0.05)\`, padding: '2px 6px', borderRadius: '4px' }}>{settings.angleMode.toUpperCase()}</span>
        </div>

        <div className="math-mono input-scroll" ref={displayRef} style={{ width: '100%', fontSize: '2rem', textAlign: 'left', color: '#fff', display: 'flex', alignItems: 'center', overflowX: 'auto', whiteSpace: 'nowrap', marginTop: '15px' }}>
          {[...Array(tokens.length + 1)].map((_, i) => (
            <React.Fragment key={i}>
              <div 
                className={\`cursor-slot \${i === cursorIndex && isFocused ? 'cursor-active' : ''}\`}
                onClick={(e) => { e.stopPropagation(); playHaptic(); setCursorIndex(i); }}
                style={{ display: 'inline-flex', alignItems: 'center', width: i === cursorIndex ? '8px' : '4px', height: '100%', cursor: 'text', position: 'relative' }}
              >
                {i === cursorIndex && isFocused && (
                  <span className="cursor-blink" style={{ position: 'absolute', width: '3px', height: '80%', background: accentColor, left: '2px', boxShadow: \`0 0 5px \${accentColor}\` }} />
                )}
              </div>
              {i < tokens.length && (
                <span onClick={(e) => { e.stopPropagation(); playHaptic(); setCursorIndex(i + 1); }} style={{ cursor: 'text', color: tokens[i].type === 'func' ? 'var(--color-chemistry)' : tokens[i].type === 'op' ? accentColor : '#fff', padding: '0 1px' }}>
                  {tokens[i].display}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="math-mono" style={{ fontSize: '1.4rem', color: accentColor, fontWeight: 700, marginTop: '8px', minHeight: '2rem', textAlign: 'right', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          {renderResult()}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minHeight: 0 }}>
        {/* Top Control row - Setup Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
          <button className="btn-sci secondary" style={{ color: 'var(--text-secondary)', padding: '6px 12px' }} onClick={handleClear}>CLEAR ALL</button>
          {['MATRIX', 'VECTOR'].includes(activeMode) ? (
            <button className="btn-sci secondary" style={{ color: accentColor, display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: \`1px solid \${accentColor}\`, background: \`rgba(0,240,255,0.05)\`, borderRadius: '6px' }} onClick={openModeModal}>
              {activeMode} MANAGER <Grid size={14} />
            </button>
          ) : <div style={{width: '90px'}}/>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '14px', flex: 1, minHeight: 0 }}>
          {/* Advanced Mode Specific Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr', gap: '8px' }}>
            {activeMode === 'MATRIX' || activeMode === 'VECTOR' ? (
              <>
                <button className="btn-sci" style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.08)' }} onClick={() => handleInsert('MatA', 'num', 'MatA')}>MatA</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.08)' }} onClick={() => handleInsert('MatB', 'num', 'MatB')}>MatB</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.08)' }} onClick={() => handleInsert('MatC', 'num', 'MatC')}>MatC</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('math.det(', 'func', 'det(')}>det</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('math.inv(', 'func', 'inv(')}>inv</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('math.transpose(', 'func', 'trn(')}>trn</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('math.trace(', 'func', 'tr(')}>trace</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('math.cross(', 'func', 'cross(')}>cross</button>
              </>
            ) : activeMode === 'CMPLX' ? (
              <>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('i', 'num', 'i')}>i</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('math.arg(', 'func', 'arg(')}>arg</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('math.conj(', 'func', 'conj(')}>conj</button>
                <button className="btn-sci" style={{ gridColumn: 'span 2' }} onClick={() => handleInsert('abs(', 'func', 'abs(')}>abs</button>
              </>
            ) : (
              <>
                <button className="btn-sci" onClick={() => handleInsert('math.inv(', 'func', 'inv(')}>x⁻¹</button>
                <button className="btn-sci" onClick={() => handleInsert('sqrt(', 'func', '√(')}>√</button>
                <button className="btn-sci" onClick={() => handleInsert('^2', 'op', '²')}>x²</button>
                <button className="btn-sci" onClick={() => handleInsert('^', 'op', '^')}>x^y</button>
                <button className="btn-sci" onClick={() => handleInsert('log10(', 'func', 'log(')}>log</button>
                <button className="btn-sci" onClick={() => handleInsert('ln(', 'func', 'ln(')}>ln</button>
                <button className="btn-sci" onClick={() => handleInsert('sin(', 'func', 'sin(')}>sin</button>
                <button className="btn-sci" onClick={() => handleInsert('cos(', 'func', 'cos(')}>cos</button>
              </>
            )}
            
            <button className="btn-sci" onClick={() => handleInsert('(', 'op', '(')}>(</button>
            <button className="btn-sci" onClick={() => handleInsert(')', 'op', ')')}>)</button>
            <button className="btn-sci" onClick={() => handleInsert('[', 'op', '[')}>[</button>
            <button className="btn-sci" onClick={() => handleInsert(']', 'op', ']')}>]</button>
          </div>

          {/* Standard Numeric Pad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr', gap: '8px' }}>
            <button className="btn-sci op clear" onClick={handleClear} style={{ background: 'rgba(255, 51, 102, 0.05)', color: 'var(--color-chemistry)', borderColor: 'rgba(255, 51, 102, 0.15)' }}>AC</button>
            <button className="btn-sci op clear" onClick={handleDelete} style={{ background: 'rgba(255, 107, 0, 0.05)', color: 'var(--color-engineering)', borderColor: 'rgba(255, 107, 0, 0.15)' }}>DEL</button>
            <button className="btn-sci op" onClick={() => handleInsert(',', 'op', ',')}>,</button>
            <button className="btn-sci op" onClick={() => handleInsert('/', 'op', '÷')}>÷</button>
            
            <button className="btn-sci num" onClick={() => handleInsert('7')}>7</button>
            <button className="btn-sci num" onClick={() => handleInsert('8')}>8</button>
            <button className="btn-sci num" onClick={() => handleInsert('9')}>9</button>
            <button className="btn-sci op" onClick={() => handleInsert('*', 'op', '×')}>×</button>
            
            <button className="btn-sci num" onClick={() => handleInsert('4')}>4</button>
            <button className="btn-sci num" onClick={() => handleInsert('5')}>5</button>
            <button className="btn-sci num" onClick={() => handleInsert('6')}>6</button>
            <button className="btn-sci op" onClick={() => handleInsert('-', 'op', '−')}>−</button>
            
            <button className="btn-sci num" onClick={() => handleInsert('1')}>1</button>
            <button className="btn-sci num" onClick={() => handleInsert('2')}>2</button>
            <button className="btn-sci num" onClick={() => handleInsert('3')}>3</button>
            <button className="btn-sci op" onClick={() => handleInsert('+', 'op', '+')}>+</button>
            
            <button className="btn-sci num" onClick={() => handleInsert('0')} style={{ gridColumn: 'span 2' }}>0</button>
            <button className="btn-sci num" onClick={() => handleInsert('.')}>.</button>
            <button className="btn-sci eval" style={{ background: accentColor, color: '#000', border: 'none', boxShadow: \`0 4px 15px \${accentColor}40\` }} onClick={calculateResult}>=</button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

const cssContent = `.advanced-scientific-container {
  font-family: var(--font-sans);
  height: 100%;
}

.mode-selector-scroll::-webkit-scrollbar {
  height: 0px;
  background: transparent; 
}

.input-scroll::-webkit-scrollbar {
  height: 4px;
}

.input-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.btn-sci {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  font-family: var(--font-mono);
}

.btn-sci:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.btn-sci:active {
  transform: scale(0.95);
}

.btn-sci.secondary {
  font-size: 0.75rem;
  font-weight: 700;
  background: transparent;
  border: 1px solid transparent;
}

.btn-sci.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-sci.num {
  font-size: 1.2rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.02);
}

.btn-sci.op {
  font-size: 1.1rem;
}

.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
}

.glass-input:focus {
  border-color: var(--color-basic);
  background: rgba(255, 255, 255, 0.08);
}
`;

fs.writeFileSync(path.join('src', 'modules', 'advanced-scientific', 'AdvancedScientificCalculator.jsx'), jsxContent);
fs.writeFileSync(path.join('src', 'modules', 'advanced-scientific', 'AdvancedScientificCalculator.css'), cssContent);
