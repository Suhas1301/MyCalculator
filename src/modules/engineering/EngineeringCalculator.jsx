import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield } from 'lucide-react';

const resistorColors = [
  { name: 'Black', value: 0, multiplier: 1, tolerance: null, color: '#000000', textLight: true },
  { name: 'Brown', value: 1, multiplier: 10, tolerance: 1, color: '#8B4513', textLight: true },
  { name: 'Red', value: 2, multiplier: 100, tolerance: 2, color: '#FF0000', textLight: true },
  { name: 'Orange', value: 3, multiplier: 1000, tolerance: null, color: '#FFA500', textLight: false },
  { name: 'Yellow', value: 4, multiplier: 10000, tolerance: null, color: '#FFFF00', textLight: false },
  { name: 'Green', value: 5, multiplier: 100000, tolerance: 0.5, color: '#008000', textLight: true },
  { name: 'Blue', value: 6, multiplier: 1000000, tolerance: 0.25, color: '#0000FF', textLight: true },
  { name: 'Violet', value: 7, multiplier: 10000000, tolerance: 0.1, color: '#EE82EE', textLight: false },
  { name: 'Grey', value: 8, multiplier: null, tolerance: 0.05, color: '#808080', textLight: true },
  { name: 'White', value: 9, multiplier: null, tolerance: null, color: '#FFFFFF', textLight: false },
  { name: 'Gold', value: null, multiplier: 0.1, tolerance: 5, color: '#FFD700', textLight: false },
  { name: 'Silver', value: null, multiplier: 0.01, tolerance: 10, color: '#C0C0C0', textLight: false }
];

export default function EngineeringCalculator() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('engineering');

  // Resistor band states
  const [bandCount, setBandCount] = useState(4); // 4 or 5 bands
  const [band1, setBand1] = useState(1); // Brown
  const [band2, setBand2] = useState(0); // Black
  const [band3, setBand3] = useState(2); // Red (only used if 5-band)
  const [multiplier, setMultiplier] = useState(2); // Red (100)
  const [tolerance, setTolerance] = useState(10); // Gold (5%)

  const [resistanceVal, setResistanceVal] = useState(1000);
  const [toleranceVal, setToleranceVal] = useState(5);

  // Trigger resistor calculator
  useEffect(() => {
    calculateResistor();
  }, [bandCount, band1, band2, band3, multiplier, tolerance]);

  const calculateResistor = () => {
    const b1 = resistorColors[band1]?.value ?? 0;
    const b2 = resistorColors[band2]?.value ?? 0;
    const mult = resistorColors[multiplier]?.multiplier ?? 1;
    const tol = resistorColors[tolerance]?.tolerance ?? 5;

    let totalVal = 0;
    if (bandCount === 4) {
      totalVal = (b1 * 10 + b2) * mult;
    } else {
      const b3 = resistorColors[band3]?.value ?? 0;
      totalVal = (b1 * 100 + b2 * 10 + b3) * mult;
    }

    setResistanceVal(totalVal);
    setToleranceVal(tol);
  };

  // Resistor value formatter
  const formatOhm = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)} MΩ`;
    if (val >= 1000) return `${(val / 1000).toFixed(2)} kΩ`;
    return `${val.toFixed(1)} Ω`;
  };

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
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Engineering & Physics Lab</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Interactive visual resistor color code decoder</p>
      </div>

      {/* Main computational layouts */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Left Side: Visual Resistor and selection dropdowns */}
        <div 
          className="glass-panel"
          style={{
            padding: '20px',
            background: 'rgba(16, 20, 35, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Visual Resistor Display */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '110px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.03)',
              position: 'relative'
            }}
          >
            {/* Resistor Lead Wire (left) */}
            <div style={{ position: 'absolute', left: '10%', right: '10%', height: '4px', background: '#aaa', zIndex: 0 }} />
            
            {/* Resistor Body */}
            <div 
              style={{
                width: '180px',
                height: '42px',
                background: '#d2b48c', // Tan color for body
                borderRadius: '10px',
                border: '1px solid rgba(0,0,0,0.25)',
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '0 12px',
                alignItems: 'center',
                zIndex: 1
              }}
            >
              {/* Band 1 */}
              <div style={{ width: '10px', height: '100%', background: resistorColors[band1].color, transition: 'background 0.3s' }} />
              
              {/* Band 2 */}
              <div style={{ width: '10px', height: '100%', background: resistorColors[band2].color, transition: 'background 0.3s' }} />
              
              {/* Band 3 (5-band only) */}
              {bandCount === 5 && (
                <div style={{ width: '10px', height: '100%', background: resistorColors[band3].color, transition: 'background 0.3s' }} />
              )}
              
              {/* Multiplier Band */}
              <div style={{ width: '10px', height: '100%', background: resistorColors[multiplier].color, transition: 'background 0.3s' }} />
              
              {/* Space spacer gap */}
              <div style={{ width: '20px' }} />
              
              {/* Tolerance Band */}
              <div style={{ width: '10px', height: '100%', background: resistorColors[tolerance].color, transition: 'background 0.3s' }} />
            </div>
          </div>

          {/* Dropdowns selection row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>Configure Band Colors</h4>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '2px' }}>
                <button onClick={() => setBandCount(4)} style={{ background: bandCount === 4 ? accentColor : 'transparent', color: bandCount === 4 ? '#000' : 'var(--text-secondary)', border: 'none', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}>4 BANDS</button>
                <button onClick={() => setBandCount(5)} style={{ background: bandCount === 5 ? accentColor : 'transparent', color: bandCount === 5 ? '#000' : 'var(--text-secondary)', border: 'none', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer' }}>5 BANDS</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {/* Band 1 dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Band 1 (First Digit)</label>
                <select value={band1} onChange={(e) => setBand1(parseInt(e.target.value))} className="glass-input" style={{ fontSize: '0.85rem' }}>
                  {resistorColors.map((color, idx) => color.value !== null && (
                    <option key={color.name} value={idx} style={{ background: '#0a0c16' }}>{color.name} ({color.value})</option>
                  ))}
                </select>
              </div>

              {/* Band 2 dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Band 2 (Second Digit)</label>
                <select value={band2} onChange={(e) => setBand2(parseInt(e.target.value))} className="glass-input" style={{ fontSize: '0.85rem' }}>
                  {resistorColors.map((color, idx) => color.value !== null && (
                    <option key={color.name} value={idx} style={{ background: '#0a0c16' }}>{color.name} ({color.value})</option>
                  ))}
                </select>
              </div>

              {/* Band 3 dropdown (5-band only) */}
              {bandCount === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Band 3 (Third Digit)</label>
                  <select value={band3} onChange={(e) => setBand3(parseInt(e.target.value))} className="glass-input" style={{ fontSize: '0.85rem' }}>
                    {resistorColors.map((color, idx) => color.value !== null && (
                      <option key={color.name} value={idx} style={{ background: '#0a0c16' }}>{color.name} ({color.value})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Multiplier dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Multiplier Band</label>
                <select value={multiplier} onChange={(e) => setMultiplier(parseInt(e.target.value))} className="glass-input" style={{ fontSize: '0.85rem' }}>
                  {resistorColors.map((color, idx) => color.multiplier !== null && (
                    <option key={color.name} value={idx} style={{ background: '#0a0c16' }}>{color.name} (×{color.multiplier})</option>
                  ))}
                </select>
              </div>

              {/* Tolerance dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tolerance Band</label>
                <select value={tolerance} onChange={(e) => setTolerance(parseInt(e.target.value))} className="glass-input" style={{ fontSize: '0.85rem' }}>
                  {resistorColors.map((color, idx) => color.tolerance !== null && (
                    <option key={color.name} value={idx} style={{ background: '#0a0c16' }}>{color.name} (±{color.tolerance}%)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Resistor calculation results stats */}
        <div 
          className="glass-panel"
          style={{
            padding: '20px',
            background: 'rgba(16, 20, 35, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
            minHeight: '280px'
          }}
        >
          <Shield size={36} style={{ color: accentColor }} />
          <div>
            <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 6px 0' }}>Decoded Resistance</h3>
            <div className="math-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              {formatOhm(resistanceVal)}
            </div>
            <span className="badge" style={{ background: 'rgba(255, 215, 0, 0.05)', color: '#ffd700', border: '1px solid rgba(255, 215, 0, 0.15)', display: 'inline-block', marginTop: '6px' }}>
              ± {toleranceVal}% Tolerance
            </span>
          </div>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
            <div>First Digit: <strong style={{ color: '#fff' }}>{resistorColors[band1].value}</strong></div>
            <div>Second Digit: <strong style={{ color: '#fff' }}>{resistorColors[band2].value}</strong></div>
            {bandCount === 5 && <div>Third Digit: <strong style={{ color: '#fff' }}>{resistorColors[band3].value}</strong></div>}
            <div>Multiplier Factor: <strong style={{ color: '#fff' }}>× {resistorColors[multiplier].multiplier}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
