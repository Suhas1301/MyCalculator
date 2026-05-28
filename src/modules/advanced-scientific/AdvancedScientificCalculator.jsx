import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { create, all } from 'mathjs';
import './AdvancedScientificCalculator.css';
import { Settings, Calculator, Activity, Table2, Layers, X, FunctionSquare, Hash, Grip, ArrowRight } from 'lucide-react';

// Setup mathjs
const math = create(all, {});

const MODES = [
  { id: 'MATRIX', label: 'MATRIX', icon: Grip, color: '#f43f5e' },
  { id: 'VECTOR', label: 'VECTOR', icon: ArrowRight, color: '#10b981' },
  { id: 'CMPLX', label: 'COMPLEX', icon: Layers, color: '#8b5cf6' },
  { id: 'EQN', label: 'EQUATION', icon: FunctionSquare, color: '#ec4899' },
  { id: 'STAT', label: 'STATISTICS', icon: Activity, color: '#f59e0b' },
  { id: 'TABLE', label: 'TABLE', icon: Table2, color: '#38bdf8' },
  { id: 'BASE-N', label: 'BASE-N', icon: Hash, color: '#14b8a6' }
];

export default function AdvancedScientificCalculator() {
  const { settings, getAccentColor } = useApp();
  const accentColor = getAccentColor('advanced-scientific');
  const [activeMode, setActiveMode] = useState('MATRIX');
  const [error, setError] = useState('');

  // MATRIX STATE
  const [matrices, setMatrices] = useState([
    { name: 'A', r: 2, c: 2, data: [[0, 0], [0, 0]] },
    { name: 'B', r: 2, c: 2, data: [[0, 0], [0, 0]] }
  ]);
  const [matrixExp, setMatrixExp] = useState('');
  const [matrixResult, setMatrixResult] = useState(null);

  // CMPLX STATE
  const [complexExp, setComplexExp] = useState('');
  const [complexResult, setComplexResult] = useState('');

  // EQN STATE
  const [eqnType, setEqnType] = useState('linear2'); // linear2, linear3, quad, cubic
  const [eqnCoeffs, setEqnCoeffs] = useState([[0,0,0],[0,0,0]]);
  const [eqnResult, setEqnResult] = useState(null);

  // BASE-N STATE
  const [baseNValue, setBaseNValue] = useState('0');
  const [baseNMode, setBaseNMode] = useState('DEC'); // HEX, DEC, OCT, BIN

  // STAT STATE
  const [statData, setStatData] = useState([{ x: 0, y: 0 }]);
  const [statResult, setStatResult] = useState(null);
  // VECTOR STATE
  const [vectorA, setVectorA] = useState([0, 0, 0]);
  const [vectorB, setVectorB] = useState([0, 0, 0]);
  const [vectorResult, setVectorResult] = useState(null);

  const handleMatrixCountChange = (count) => {
    const c = Math.max(1, Math.min(10, count));
    setMatrices(prev => {
      const newM = [...prev];
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (c < newM.length) {
        return newM.slice(0, c);
      } else {
        for (let i = newM.length; i < c; i++) {
          newM.push({ name: alphabet[i], r: 2, c: 2, data: [[0, 0], [0, 0]] });
        }
        return newM;
      }
    });
  };

  const handleMatrixDimChange = (idx, field, val) => {
    const num = Math.max(1, Math.min(10, Number(val) || 1));
    setMatrices(prev => {
      const newM = [...prev];
      const mat = { ...newM[idx], [field]: num };
      
      const newData = [];
      for (let r = 0; r < mat.r; r++) {
        const row = [];
        for (let c = 0; c < mat.c; c++) {
           row.push(mat.data[r]?.[c] || 0);
        }
        newData.push(row);
      }
      mat.data = newData;
      newM[idx] = mat;
      return newM;
    });
  };

  const handleMatrixDataChange = (idx, r, c, val) => {
    const num = Number(val) || 0;
    setMatrices(prev => {
      const newM = [...prev];
      const mat = { ...newM[idx] };
      mat.data = [...mat.data];
      mat.data[r] = [...mat.data[r]];
      mat.data[r][c] = num;
      newM[idx] = mat;
      return newM;
    });
  };

  const calculateMatrix = () => {
    try {
      setError('');
      if (!matrixExp) return;
      const scope = {};
      matrices.forEach(m => {
        scope[m.name] = m.data;
      });
      const res = math.evaluate(matrixExp, scope);
      setMatrixResult(res);
    } catch (e) {
      setError('Matrix operation failed: ' + e.message);
    }
  };

  const renderMatrixMode = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Number of Matrices:</span>
        <input 
          type="number" 
          className="glass-input" 
          value={matrices.length} 
          onChange={e => handleMatrixCountChange(e.target.value)}
          min={1} max={10}
          style={{ width: '60px', padding: '6px', color: '#fff', textAlign: 'center' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', maxHeight: '400px', overflowY: 'auto' }}>
        {matrices.map((m, idx) => (
          <div key={m.name} className="matrix-grid">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-scientific)', fontWeight: 700 }}>Matrix {m.name}</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <input type="number" className="glass-input" style={{ width: '40px', padding: '2px', textAlign: 'center', fontSize: '0.8rem', color: '#fff' }} value={m.r} onChange={e => handleMatrixDimChange(idx, 'r', e.target.value)} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>×</span>
                <input type="number" className="glass-input" style={{ width: '40px', padding: '2px', textAlign: 'center', fontSize: '0.8rem', color: '#fff' }} value={m.c} onChange={e => handleMatrixDimChange(idx, 'c', e.target.value)} />
              </div>
            </div>
            
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {m.data.map((row, r) => (
                <div key={r} className="matrix-row">
                  {row.map((val, c) => (
                    <input
                      key={c}
                      type="number"
                      className="matrix-input"
                      value={val === 0 ? '' : val}
                      placeholder="0"
                      onChange={(e) => handleMatrixDataChange(idx, r, c, e.target.value)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
        <input 
          type="text"
          className="glass-input math-mono"
          style={{ flex: 1, padding: '10px 14px', color: '#fff', fontSize: '1.1rem' }}
          placeholder="Expression (e.g. A * B + inv(C))"
          value={matrixExp}
          onChange={e => setMatrixExp(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && calculateMatrix()}
        />
        <button 
          className="btn-glow" 
          onClick={calculateMatrix} 
          style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--color-scientific)', border: 'none', color: '#fff', fontWeight: 600 }}
        >
          Calculate
        </button>
      </div>

      {matrixResult !== null && (
        <div className="result-panel">
          <h4>Result</h4>
          {(() => {
            const resArray = matrixResult && matrixResult.toArray ? matrixResult.toArray() : matrixResult;
            if (Array.isArray(resArray)) {
              return (
                <div className="matrix-grid" style={{ display: 'inline-flex' }}>
                  {resArray.map((row, r) => (
                    <div key={r} className="matrix-row">
                      {(Array.isArray(row) ? row : [row]).map((val, c) => (
                        <div key={c} style={{ minWidth: '50px', padding: '0 4px', textAlign: 'center', color: '#fff', fontFamily: 'monospace' }}>
                          {Number(Number(val).toFixed(4))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            }
            return <div style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'monospace' }}>{typeof matrixResult === 'number' ? Number(matrixResult.toFixed(4)) : String(matrixResult)}</div>;
          })()}
        </div>
      )}
    </div>
  );

  const calculateComplex = () => {
    try {
      setError('');
      const res = math.evaluate(complexExp);
      setComplexResult(math.format(res, { precision: 14 }));
    } catch (e) {
      setError('Invalid complex expression');
    }
  };

  const renderComplexMode = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Enter complex expression (use <b>i</b> for imaginary unit):</p>
      <input
        type="text"
        className="glass-input math-mono"
        style={{ width: '100%', padding: '12px', fontSize: '1.2rem', color: '#fff' }}
        placeholder="e.g. (3 + 2i) * (1 - 4i)"
        value={complexExp}
        onChange={(e) => setComplexExp(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && calculateComplex()}
      />
      <button 
        className="btn-glow" 
        onClick={calculateComplex} 
        style={{ padding: '10px', borderRadius: '8px', background: 'var(--color-scientific)', border: 'none', color: '#fff', fontWeight: 600 }}
      >
        Calculate
      </button>

      {complexResult && (
        <div className="result-panel">
          <h4>Result</h4>
          <div style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'monospace' }}>{complexResult}</div>
        </div>
      )}
    </div>
  );

  const renderPlaceholder = (title) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
      <p><b>{title}</b> Mode is active.</p>
      <p style={{ fontSize: '0.8rem' }}>UI specifically tailored for {title.toLowerCase()} calculation.</p>
    </div>
  );


  const handleStatChange = (index, field, value) => {
    const newData = [...statData];
    newData[index] = { ...newData[index], [field]: Number(value) };
    setStatData(newData);
  };

  const calculateStat = () => {
    try {
      setError('');
      const xVals = statData.map(d => d.x);
      const yVals = statData.map(d => d.y);
      const meanX = math.mean(xVals);
      const meanY = math.mean(yVals);
      const varX = math.variance(xVals, 'uncorrected');
      const varY = math.variance(yVals, 'uncorrected');
      const stdX = math.std(xVals, 'uncorrected');
      
      // linear regression y = a + bx
      let Sxx = 0, Sxy = 0;
      for (let i = 0; i < statData.length; i++) {
        Sxx += Math.pow(xVals[i] - meanX, 2);
        Sxy += (xVals[i] - meanX) * (yVals[i] - meanY);
      }
      
      let b = 0, a = 0;
      if (Sxx !== 0) {
        b = Sxy / Sxx;
        a = meanY - b * meanX;
      }

      setStatResult({
        n: statData.length,
        meanX: meanX.toFixed(4),
        stdX: stdX.toFixed(4),
        varX: varX.toFixed(4),
        meanY: meanY.toFixed(4),
        a: a.toFixed(4),
        b: b.toFixed(4)
      });
    } catch (e) {
      setError("Stat error: " + e.message);
    }
  };

  const renderStatMode = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn-glow" onClick={() => setStatData([...statData, { x: 0, y: 0 }])} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }}>+ Add Row</button>
        <button className="btn-glow" onClick={() => setStatData([{ x: 0, y: 0 }])} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }}>Reset</button>
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <table className="stat-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No.</th>
              <th>X</th>
              <th>Y</th>
            </tr>
          </thead>
          <tbody>
            {statData.map((row, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-secondary)' }}>{i + 1}</td>
                <td><input type="number" className="stat-input" value={row.x === 0 ? '' : row.x} placeholder="0" onChange={e => handleStatChange(i, 'x', e.target.value)} /></td>
                <td><input type="number" className="stat-input" value={row.y === 0 ? '' : row.y} placeholder="0" onChange={e => handleStatChange(i, 'y', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn-glow" onClick={calculateStat} style={{ padding: '10px', borderRadius: '8px', background: 'var(--color-scientific)', border: 'none', color: '#fff', fontWeight: 600 }}>Calculate Statistics</button>

      {statResult && (
        <div className="result-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div><b style={{ color: 'var(--text-secondary)' }}>n:</b> {statResult.n}</div>
          <div><b style={{ color: 'var(--text-secondary)' }}>x̄:</b> {statResult.meanX}</div>
          <div><b style={{ color: 'var(--text-secondary)' }}>σx:</b> {statResult.stdX}</div>
          <div><b style={{ color: 'var(--text-secondary)' }}>ȳ:</b> {statResult.meanY}</div>
          <div style={{ gridColumn: '1 / -1', marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            <span style={{ color: 'var(--color-scientific)', fontSize: '0.85rem' }}>Linear Regression (y = a + bx)</span><br />
            a = {statResult.a}, b = {statResult.b}
          </div>
        </div>
      )}
    </div>
  );

  const [tableFunc, setTableFunc] = useState('x^2');
  const [tableStart, setTableStart] = useState(1);
  const [tableEnd, setTableEnd] = useState(5);
  const [tableStep, setTableStep] = useState(1);
  const [tableResult, setTableResult] = useState(null);

  const calculateTable = () => {
    try {
      setError('');
      const f = math.compile(tableFunc);
      const res = [];
      const s = Number(tableStart);
      const e = Number(tableEnd);
      const st = Number(tableStep);
      
      if (st <= 0) throw new Error("Step must be positive");
      if ((e - s) / st > 100) throw new Error("Table too large (max 100 rows)");
      
      for (let x = s; x <= e; x += st) {
        res.push({ x: x, y: f.evaluate({ x }) });
      }
      setTableResult(res);
    } catch (err) {
      setError("Table error: " + err.message);
    }
  };

  const renderTableMode = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: 'var(--color-scientific)', fontWeight: 700 }}>f(x) = </span>
        <input 
          type="text" 
          className="glass-input math-mono" 
          style={{ flex: 1, padding: '8px 12px', color: '#fff', fontSize: '1.1rem' }}
          value={tableFunc}
          onChange={(e) => setTableFunc(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Start</span>
          <input type="number" className="glass-input" style={{ width: '100%', padding: '6px', color: '#fff', textAlign: 'center' }} value={tableStart} onChange={e => setTableStart(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>End</span>
          <input type="number" className="glass-input" style={{ width: '100%', padding: '6px', color: '#fff', textAlign: 'center' }} value={tableEnd} onChange={e => setTableEnd(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Step</span>
          <input type="number" className="glass-input" style={{ width: '100%', padding: '6px', color: '#fff', textAlign: 'center' }} value={tableStep} onChange={e => setTableStep(e.target.value)} />
        </div>
      </div>

      <button className="btn-glow" onClick={calculateTable} style={{ padding: '10px', borderRadius: '8px', background: 'var(--color-scientific)', border: 'none', color: '#fff', fontWeight: 600 }}>Generate Table</button>

      {tableResult && (
        <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <table className="stat-table">
            <thead>
              <tr>
                <th>x</th>
                <th>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {tableResult.map((row, i) => (
                <tr key={i}>
                  <td className="math-mono">{Number(row.x.toFixed(4))}</td>
                  <td className="math-mono" style={{ color: 'var(--color-scientific)' }}>{Number(row.y.toFixed(4))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const handleVectorChange = (vectorId, i, val) => {
    const num = Number(val) || 0;
    if (vectorId === 'A') {
      const newA = [...vectorA];
      newA[i] = num;
      setVectorA(newA);
    } else {
      const newB = [...vectorB];
      newB[i] = num;
      setVectorB(newB);
    }
  };

  const calculateVector = (op) => {
    try {
      setError('');
      let res;
      if (op === 'A+B') res = math.add(vectorA, vectorB);
      else if (op === 'A-B') res = math.subtract(vectorA, vectorB);
      else if (op === 'dot') res = math.dot(vectorA, vectorB);
      else if (op === 'cross') res = math.cross(vectorA, vectorB);
      else if (op === 'magA') res = Math.sqrt(math.dot(vectorA, vectorA));
      
      setVectorResult(res);
    } catch (e) {
      setError('Vector operation failed: ' + e.message);
    }
  };

  const renderVectorMode = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="matrix-grid">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center' }}>Vector A</span>
          <div className="matrix-row">
            {vectorA.map((val, i) => (
              <input
                key={i}
                type="number"
                className="matrix-input"
                value={val === 0 ? '' : val}
                placeholder="0"
                onChange={(e) => handleVectorChange('A', i, e.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="matrix-grid">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center' }}>Vector B</span>
          <div className="matrix-row">
            {vectorB.map((val, i) => (
              <input
                key={i}
                type="number"
                className="matrix-input"
                value={val === 0 ? '' : val}
                placeholder="0"
                onChange={(e) => handleVectorChange('B', i, e.target.value)}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button className="btn-glow" onClick={() => calculateVector('A+B')} style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-scientific-glow)', border: '1px solid var(--color-scientific)', color: '#fff' }}>A + B</button>
        <button className="btn-glow" onClick={() => calculateVector('A-B')} style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-scientific-glow)', border: '1px solid var(--color-scientific)', color: '#fff' }}>A - B</button>
        <button className="btn-glow" onClick={() => calculateVector('dot')} style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-scientific-glow)', border: '1px solid var(--color-scientific)', color: '#fff' }}>Dot Product</button>
        <button className="btn-glow" onClick={() => calculateVector('cross')} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)', color: '#fff' }}>Cross Product</button>
        <button className="btn-glow" onClick={() => calculateVector('magA')} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)', color: '#fff' }}>|A|</button>
      </div>

      {vectorResult !== null && (
        <div className="result-panel">
          <h4>Result</h4>
          {Array.isArray(vectorResult) ? (
             <div className="matrix-grid" style={{ display: 'inline-flex' }}>
               <div className="matrix-row">
                 {vectorResult.map((val, i) => (
                   <div key={i} style={{ width: '50px', textAlign: 'center', color: '#fff', fontFamily: 'monospace' }}>
                     {Number(val.toFixed(4))}
                   </div>
                 ))}
               </div>
             </div>
          ) : (
            <div style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'monospace' }}>{Number(vectorResult.toFixed(4))}</div>
          )}
        </div>
      )}
    </div>
  );

  const calculateEqn = () => {
    try {
      setError('');
      if (eqnType === 'quad') {
        const [a, b, c] = eqnCoeffs[0];
        if (a === 0) throw new Error("Not a quadratic equation (a=0)");
        const discriminant = b * b - 4 * a * c;
        if (discriminant >= 0) {
          const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          setEqnResult(`x₁ = ${root1}, x₂ = ${root2}`);
        } else {
          const real = (-b / (2 * a)).toFixed(4);
          const imag = (Math.sqrt(Math.abs(discriminant)) / (2 * a)).toFixed(4);
          setEqnResult(`x₁ = ${real} + ${imag}i, x₂ = ${real} - ${imag}i`);
        }
      } else if (eqnType === 'linear2') {
         // a1 x + b1 y = c1
         // a2 x + b2 y = c2
         const [[a1, b1, c1], [a2, b2, c2]] = eqnCoeffs;
         const det = a1 * b2 - a2 * b1;
         if (det === 0) throw new Error("No unique solution (Determinant = 0)");
         const x = (c1 * b2 - c2 * b1) / det;
         const y = (a1 * c2 - a2 * c1) / det;
         setEqnResult(`x = ${x}, y = ${y}`);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEqnChange = (row, col, val) => {
    const newCoeffs = [...eqnCoeffs];
    newCoeffs[row][col] = Number(val);
    setEqnCoeffs(newCoeffs);
  };

  const renderEqnMode = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className={`mode-btn ${eqnType === 'linear2' ? 'active' : ''}`} onClick={() => { setEqnType('linear2'); setEqnCoeffs([[0,0,0],[0,0,0]]); setEqnResult(null); }}>Linear (2 Vars)</button>
        <button className={`mode-btn ${eqnType === 'quad' ? 'active' : ''}`} onClick={() => { setEqnType('quad'); setEqnCoeffs([[0,0,0]]); setEqnResult(null); }}>Quadratic</button>
      </div>

      <div className="matrix-grid">
        {eqnType === 'linear2' && (
          <>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Format: ax + by = c</p>
            {[0, 1].map(r => (
               <div key={r} className="matrix-row" style={{ alignItems: 'center', gap: '4px' }}>
                 <input type="number" className="matrix-input" placeholder="a" onChange={e => handleEqnChange(r, 0, e.target.value)} /> x + 
                 <input type="number" className="matrix-input" placeholder="b" onChange={e => handleEqnChange(r, 1, e.target.value)} /> y = 
                 <input type="number" className="matrix-input" placeholder="c" onChange={e => handleEqnChange(r, 2, e.target.value)} />
               </div>
            ))}
          </>
        )}
        {eqnType === 'quad' && (
          <>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Format: ax² + bx + c = 0</p>
            <div className="matrix-row" style={{ alignItems: 'center', gap: '4px' }}>
              <input type="number" className="matrix-input" placeholder="a" onChange={e => handleEqnChange(0, 0, e.target.value)} /> x² + 
              <input type="number" className="matrix-input" placeholder="b" onChange={e => handleEqnChange(0, 1, e.target.value)} /> x + 
              <input type="number" className="matrix-input" placeholder="c" onChange={e => handleEqnChange(0, 2, e.target.value)} /> = 0
            </div>
          </>
        )}
      </div>

      <button className="btn-glow" onClick={calculateEqn} style={{ padding: '10px', borderRadius: '8px', background: 'var(--color-scientific)', border: 'none', color: '#fff', fontWeight: 600 }}>Solve</button>

      {eqnResult && (
        <div className="result-panel">
          <h4>Solution</h4>
          <div style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'monospace' }}>{eqnResult}</div>
        </div>
      )}
    </div>
  );

  const handleBaseN = (base, value) => {
    try {
      setError('');
      if (!value) {
        setBaseNValue('0');
        return;
      }
      let decValue = 0;
      if (base === 'DEC') decValue = parseInt(value, 10);
      else if (base === 'HEX') decValue = parseInt(value, 16);
      else if (base === 'OCT') decValue = parseInt(value, 8);
      else if (base === 'BIN') decValue = parseInt(value, 2);

      if (isNaN(decValue)) throw new Error("Invalid input for base " + base);
      setBaseNValue(decValue.toString(10));
    } catch (e) {
      setError(e.message);
    }
  };

  const renderBaseNMode = () => {
    const num = parseInt(baseNValue, 10) || 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Edit any field to convert:</p>
        
        {['HEX', 'DEC', 'OCT', 'BIN'].map(base => {
           let valStr = '';
           if (base === 'HEX') valStr = num.toString(16).toUpperCase();
           if (base === 'DEC') valStr = num.toString(10);
           if (base === 'OCT') valStr = num.toString(8);
           if (base === 'BIN') valStr = num.toString(2);

           return (
             <div key={base} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <div style={{ width: '40px', color: 'var(--color-scientific)', fontWeight: 700, fontSize: '0.85rem' }}>{base}</div>
               <input 
                 type="text" 
                 className="glass-input math-mono" 
                 style={{ flex: 1, padding: '8px 12px', color: '#fff' }}
                 value={valStr}
                 onChange={(e) => handleBaseN(base, e.target.value)}
               />
             </div>
           );
        })}
      </div>
    );
  };

  return (
    <div className="adv-sci-container animate-slide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Advanced Math Suite</h2>

        </div>
      </div>

      {/* Mode Selector */}
      <div className="mode-selector">
        {MODES.map(mode => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              className={`mode-btn ${isActive ? 'active' : ''}`}
              onClick={() => { setActiveMode(mode.id); setError(''); setMatrixResult(null); setComplexResult(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: isActive ? `${accentColor}26` : 'rgba(255, 255, 255, 0.02)',
                borderColor: isActive ? accentColor : 'var(--border-color)',
                boxShadow: isActive ? `0 0 12px ${accentColor}40` : 'none',
              }}
            >
              <span style={{ color: isActive ? accentColor : 'rgba(255, 255, 255, 0.4)', display: 'inline-flex', alignItems: 'center' }}>
                <Icon size={14} />
              </span>
              {mode.label}
            </button>
          )
        })}
      </div>

      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)', borderRadius: '8px', color: 'var(--color-chemistry)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Mode Content */}
      <div className="glass-panel" style={{ flex: 1, padding: '20px', borderRadius: '16px', overflowY: 'auto' }}>
        {activeMode === 'MATRIX' && renderMatrixMode()}
        {activeMode === 'CMPLX' && renderComplexMode()}
        {activeMode === 'VECTOR' && renderVectorMode()}
        {activeMode === 'EQN' && renderEqnMode()}
        {activeMode === 'STAT' && renderStatMode()}
        {activeMode === 'TABLE' && renderTableMode()}
        {activeMode === 'BASE-N' && renderBaseNMode()}
      </div>
    </div>
  );
}
