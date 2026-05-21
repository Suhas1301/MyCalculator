import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateExpression } from '../../utils/mathParser';
import { History, Trash2, ArrowLeft, Bookmark, BookOpen, X, Search } from 'lucide-react';

const CONSTANT_GROUPS = [
  {
    id: 'math',
    name: 'Mathematical Constants',
    color: '#a78bfa',
    constants: [
      { id: 'M01', symbol: 'π', name: 'Pi', value: '3.14159265358979', units: '', formulaSymbol: 'pi' },
      { id: 'M02', symbol: 'e', name: "Euler's Number", value: '2.71828182845904', units: '', formulaSymbol: 'e' },
      { id: 'M03', symbol: 'φ', name: 'Golden Ratio', value: '1.61803398874989', units: '', formulaSymbol: 'phi' },
      { id: 'M04', symbol: 'i', name: 'Imaginary Unit', value: '√(−1)', units: '', formulaSymbol: 'i' },
      { id: 'M05', symbol: 'γ', name: 'Euler-Mascheroni Constant', value: '0.57721566490153', units: '', formulaSymbol: 'egamma' },
      { id: 'M06', symbol: '√2', name: "Pythagoras' Constant", value: '1.41421356237309', units: '', formulaSymbol: 'sqrt2' },
      { id: 'M07', symbol: 'ln 2', name: 'Natural Log of 2', value: '0.69314718055994', units: '', formulaSymbol: 'ln2' },
    ]
  },
  {
    id: 'algebra',
    name: 'Algebra & Number Theory',
    color: '#f472b6',
    constants: [
      { id: 'A01', symbol: 'ζ(2)', name: 'Basel Constant (π²/6)', value: '1.64493406684822', units: '', formulaSymbol: 'zeta2' },
      { id: 'A02', symbol: 'ζ(3)', name: "Apéry's Constant", value: '1.20205690315959', units: '', formulaSymbol: 'zeta3' },
      { id: 'A03', symbol: 'G_C', name: "Catalan's Constant", value: '0.91596559417721', units: '', formulaSymbol: 'catalan' },
      { id: 'A04', symbol: 'K', name: "Khinchin's Constant", value: '2.68545200106530', units: '', formulaSymbol: 'khinchin' },
      { id: 'A05', symbol: 'δ_F', name: 'Feigenbaum Delta', value: '4.66920160910299', units: '', formulaSymbol: 'feig_d' },
      { id: 'A06', symbol: 'α_F', name: 'Feigenbaum Alpha', value: '2.50290787509589', units: '', formulaSymbol: 'feig_a' },
      { id: 'A07', symbol: 'μ_RS', name: 'Ramanujan-Soldner Const.', value: '1.45136923488338', units: '', formulaSymbol: 'soldner' },
    ]
  },
  {
    id: 'physics',
    name: 'Scientific Constants',
    color: '#00f0ff',
    constants: [
      { id: 'P01', symbol: 'm_p', name: 'Proton mass', value: '1.672621898 × 10⁻²⁷', units: 'kg', formulaSymbol: 'mp' },
      { id: 'P02', symbol: 'm_n', name: 'Neutron mass', value: '1.674927471 × 10⁻²⁷', units: 'kg', formulaSymbol: 'mn' },
      { id: 'P03', symbol: 'm_e', name: 'Electron mass', value: '9.10938356 × 10⁻³¹', units: 'kg', formulaSymbol: 'me' },
      { id: 'P04', symbol: 'm_μ', name: 'Muon mass', value: '1.883531594 × 10⁻²⁸', units: 'kg', formulaSymbol: 'mmu' },
      { id: 'P05', symbol: 'h', name: 'Planck constant', value: '6.62607015 × 10⁻³⁴', units: 'J·s', formulaSymbol: 'h' },
      { id: 'P06', symbol: 'ħ', name: 'Rationalized Planck (ħ)', value: '1.054571817 × 10⁻³⁴', units: 'J·s', formulaSymbol: 'hbar' },
      { id: 'P07', symbol: 'c₀', name: 'Speed of light in vacuum', value: '299792458', units: 'm/s', formulaSymbol: 'c0' },
      { id: 'P08', symbol: 'e', name: 'Elementary charge', value: '1.602176634 × 10⁻¹⁹', units: 'C', formulaSymbol: 'qe' },
      { id: 'P09', symbol: 'α', name: 'Fine-structure constant', value: '7.2973525664 × 10⁻³', units: '', formulaSymbol: 'alpha' },
      { id: 'P10', symbol: 'a₀', name: 'Bohr radius', value: '5.2917721067 × 10⁻¹¹', units: 'm', formulaSymbol: 'a0' },
      { id: 'P11', symbol: 'r_e', name: 'Classical electron radius', value: '2.8179403227 × 10⁻¹⁵', units: 'm', formulaSymbol: 're' },
      { id: 'P12', symbol: 'λ_c', name: 'Compton wavelength', value: '2.4263102367 × 10⁻¹²', units: 'm', formulaSymbol: 'lambdac' },
      { id: 'P13', symbol: 'R_∞', name: 'Rydberg constant', value: '10973731.568508', units: 'm⁻¹', formulaSymbol: 'Rinf' },
      { id: 'P14', symbol: 'σ', name: 'Stefan-Boltzmann constant', value: '5.670374419 × 10⁻⁸', units: 'W/(m²·K⁴)', formulaSymbol: 'sigma' },
      { id: 'P15', symbol: 'ε₀', name: 'Vacuum electric permittivity', value: '8.8541878128 × 10⁻¹²', units: 'F/m', formulaSymbol: 'epsilon0' },
      { id: 'P16', symbol: 'μ₀', name: 'Vacuum magnetic permeability', value: '1.25663706212 × 10⁻⁶', units: 'H/m', formulaSymbol: 'mu0' },
      { id: 'P17', symbol: 'Z₀', name: 'Vacuum impedance', value: '376.730313461', units: 'Ω', formulaSymbol: 'Z0' },
      { id: 'P18', symbol: 'G₀', name: 'Conductance quantum', value: '7.748091731 × 10⁻⁵', units: 'S', formulaSymbol: 'G0' },
      { id: 'P19', symbol: 'φ₀', name: 'Magnetic flux quantum', value: '2.067833831 × 10⁻¹⁵', units: 'Wb', formulaSymbol: 'phi0' },
      { id: 'P20', symbol: 'G', name: 'Newtonian gravitational const.', value: '6.67430 × 10⁻¹¹', units: 'm³/(kg·s²)', formulaSymbol: 'G' },
      { id: 'P21', symbol: 'g', name: 'Standard gravity', value: '9.80665', units: 'm/s²', formulaSymbol: 'g' },
      { id: 'P22', symbol: 'γ_p', name: 'Proton gyromagnetic ratio', value: '2.6752218978 × 10⁸', units: 's⁻¹·T⁻¹', formulaSymbol: 'gammap' },
      { id: 'P23', symbol: 'μ_B', name: 'Bohr magneton', value: '9.274009994 × 10⁻²⁴', units: 'J/T', formulaSymbol: 'muB' },
      { id: 'P24', symbol: 'μ_N', name: 'Nuclear magneton', value: '5.050783697 × 10⁻²⁷', units: 'J/T', formulaSymbol: 'muN' },
      { id: 'P25', symbol: 'μ_p', name: 'Proton magnetic moment', value: '1.4106067873 × 10⁻²⁶', units: 'J/T', formulaSymbol: 'mup' },
      { id: 'P26', symbol: 'μ_e', name: 'Electron magnetic moment', value: '-9.28476462 × 10⁻²⁴', units: 'J/T', formulaSymbol: 'mue' },
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry Constants',
    color: '#4ade80',
    constants: [
      { id: 'C01', symbol: 'N_A', name: 'Avogadro constant', value: '6.02214076 × 10²³', units: 'mol⁻¹', formulaSymbol: 'Na' },
      { id: 'C02', symbol: 'k_B', name: 'Boltzmann constant', value: '1.380649 × 10⁻²³', units: 'J/K', formulaSymbol: 'k' },
      { id: 'C03', symbol: 'R', name: 'Molar gas constant', value: '8.314462618', units: 'J/(mol·K)', formulaSymbol: 'R' },
      { id: 'C04', symbol: 'F', name: 'Faraday constant', value: '96485.33289', units: 'C/mol', formulaSymbol: 'F' },
      { id: 'C05', symbol: 'V_m', name: 'Molar volume of ideal gas', value: '0.0224139695', units: 'm³/mol', formulaSymbol: 'Vm' },
      { id: 'C06', symbol: 'u', name: 'Atomic mass unit', value: '1.660539040 × 10⁻²⁷', units: 'kg', formulaSymbol: 'u' },
      { id: 'C07', symbol: 'atm', name: 'Standard atmosphere', value: '101325', units: 'Pa', formulaSymbol: 'atm' },
      { id: 'C08', symbol: 'T₀', name: 'Celsius offset (273.15 K)', value: '273.15', units: 'K', formulaSymbol: 't' },
      { id: 'C09', symbol: 'C₁', name: 'First radiation constant', value: '3.741771852 × 10⁻¹⁶', units: 'W·m²', formulaSymbol: 'C1' },
      { id: 'C10', symbol: 'C₂', name: 'Second radiation constant', value: '0.0143877687', units: 'm·K', formulaSymbol: 'C2' },
      { id: 'C11', symbol: 'λ_c,p', name: 'Proton Compton wavelength', value: '1.321409854 × 10⁻¹⁵', units: 'm', formulaSymbol: 'lambdacp' },
      { id: 'C12', symbol: 'μ_n', name: 'Neutron magnetic moment', value: '-9.662365 × 10⁻²⁷', units: 'J/T', formulaSymbol: 'mun' },
    ]
  }
];

// Flat list derived from groups — used for search and filtering
const ALL_CONSTANTS = CONSTANT_GROUPS.flatMap(g =>
  g.constants.map(c => ({ ...c, groupId: g.id, groupName: g.name, groupColor: g.color }))
);

const bookStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleUp {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
`;

function ConstantRow({ constant, onSelect, query }) {
  const isMatch = (text) => {
    if (!query) return false;
    return text.toLowerCase().includes(query.toLowerCase());
  };

  const highlightText = (text) => {
    if (!query || !isMatch(text)) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    const length = query.length;
    return (
      <>
        {text.substring(0, index)}
        <mark style={{ background: 'rgba(0, 240, 255, 0.35)', color: '#fff', borderRadius: '2px', padding: '0 1px' }}>
          {text.substring(index, index + length)}
        </mark>
        {text.substring(index + length)}
      </>
    );
  };

  return (
    <div
      onClick={() => onSelect(constant.formulaSymbol)}
      className="btn-glow"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        borderRadius: '10px',
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.03)',
        transition: 'all 0.15s ease',
        height: '58px',
        boxSizing: 'border-box',
        flexShrink: 0
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        {/* Index Badge */}
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            fontFamily: 'monospace',
            background: 'rgba(0, 240, 255, 0.06)',
            color: 'rgba(0, 240, 255, 0.8)',
            border: '1px solid rgba(0, 240, 255, 0.12)',
            borderRadius: '4px',
            width: '22px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {constant.id}
        </span>
        
        {/* Symbol and Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{ width: '48px', flexShrink: 0 }}>
            <span className="math-mono" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {constant.symbol}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>
              {highlightText(constant.name)}
            </span>
            <span className="math-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {constant.value} <span style={{ fontSize: '0.62rem', color: '#a0aed0' }}>{constant.units}</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Insertable Alias Badge */}
      <div style={{ textAlign: 'right', marginLeft: '8px', flexShrink: 0 }}>
        <span
          className="math-mono"
          style={{
            fontSize: '0.68rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '5px',
            padding: '2px 6px',
            color: 'rgba(0, 240, 255, 0.8)',
            fontWeight: 500,
            whiteSpace: 'nowrap'
          }}
        >
          {constant.formulaSymbol}
        </span>
      </div>
    </div>
  );
}

export default function BasicCalculator() {
  const { addHistoryItem, settings, updateSetting, getAccentColor } = useApp();
  const [expression, setExpression] = useState('');
  const [livePreview, setLivePreview] = useState('');
  const [error, setError] = useState('');
  const [showScientific, setShowScientific] = useState(true);
  const accentColor = getAccentColor('basic');

  const [showBookModal, setShowBookModal] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [keepBookOpen, setKeepBookOpen] = useState(false);
  const [mobilePage, setMobilePage] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConstant = (symbol) => {
    playHaptic();
    setExpression(prev => prev + symbol);
    if (!keepBookOpen) {
      setShowBookModal(false);
    }
  };

  const displayRef = useRef(null);

  // Evaluate expression in real-time as the user types
  useEffect(() => {
    if (!expression.trim()) {
      setLivePreview('');
      setError('');
      return;
    }
    
    // Quick sanitization check to prevent incomplete trailing operator crashes
    const sanitized = expression.trim();
    if (/[+\-*/%^!(]$/.test(sanitized)) {
      setLivePreview('');
      return;
    }

    try {
      const res = evaluateExpression(sanitized, {}, settings.angleMode);
      if (isNaN(res)) {
        setLivePreview('');
      } else {
        const decimals = settings.decimalPlaces;
        setLivePreview(Number(res.toFixed(decimals)).toString());
        setError('');
      }
    } catch (e) {
      setLivePreview('');
    }
  }, [expression, settings.angleMode, settings.decimalPlaces]);

  // Haptic feedback mock
  const playHaptic = () => {
    if (settings.keyboardHaptics && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleKeyPress = (value) => {
    playHaptic();
    setError('');
    
    if (value === 'AC') {
      setExpression('');
      setLivePreview('');
      setError('');
    } else if (value === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
    } else if (value === '=') {
      handleCalculate();
    } else {
      setExpression(prev => prev + value);
    }
  };

  const handleCalculate = () => {
    if (!expression.trim()) return;
    try {
      const res = evaluateExpression(expression, {}, settings.angleMode);
      if (isNaN(res)) {
        setError('Invalid expression');
      } else {
        const decimals = settings.decimalPlaces;
        const resultString = Number(res.toFixed(decimals)).toString();
        addHistoryItem(expression, resultString, 'Basic & Scientific');
        setExpression(resultString);
        setLivePreview('');
        setError('');
      }
    } catch (e) {
      setError(e.message || 'Calculation Error');
    }
  };

  // Dynamic scientific constants insert
  const insertConstant = (symbol) => {
    playHaptic();
    setExpression(prev => prev + symbol);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid firing when user is typing in general input fields elsewhere
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      const key = e.key;
      if (/\d/.test(key) || '+-*/().!^%'.includes(key)) {
        e.preventDefault();
        handleKeyPress(key);
      } else if (key === 'Enter') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('DEL');
      } else if (key === 'Escape') {
        e.preventDefault();
        handleKeyPress('AC');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, settings.angleMode]);

  const buttons = [
    { label: 'AC', type: 'clear', action: () => handleKeyPress('AC') },
    { label: '(', type: 'paren', action: () => handleKeyPress('(') },
    { label: ')', type: 'paren', action: () => handleKeyPress(')') },
    { label: 'DEL', type: 'delete', action: () => handleKeyPress('DEL') },
    
    { label: '7', type: 'num', action: () => handleKeyPress('7') },
    { label: '8', type: 'num', action: () => handleKeyPress('8') },
    { label: '9', type: 'num', action: () => handleKeyPress('9') },
    { label: '÷', type: 'op', action: () => handleKeyPress('/') },
    
    { label: '4', type: 'num', action: () => handleKeyPress('4') },
    { label: '5', type: 'num', action: () => handleKeyPress('5') },
    { label: '6', type: 'num', action: () => handleKeyPress('6') },
    { label: '×', type: 'op', action: () => handleKeyPress('*') },
    
    { label: '1', type: 'num', action: () => handleKeyPress('1') },
    { label: '2', type: 'num', action: () => handleKeyPress('2') },
    { label: '3', type: 'num', action: () => handleKeyPress('3') },
    { label: '−', type: 'op', action: () => handleKeyPress('-') },
    
    { label: '0', type: 'num', action: () => handleKeyPress('0') },
    { label: '.', type: 'num', action: () => handleKeyPress('.') },
    { label: '=', type: 'equals', action: () => handleKeyPress('=') },
    { label: '+', type: 'op', action: () => handleKeyPress('+') },
  ];

  const scientificButtons = [
    { label: 'sin', action: () => handleKeyPress('sin(') },
    { label: 'cos', action: () => handleKeyPress('cos(') },
    { label: 'tan', action: () => handleKeyPress('tan(') },
    { label: 'x^y', action: () => handleKeyPress('^') },
    
    { label: 'asin', action: () => handleKeyPress('asin(') },
    { label: 'acos', action: () => handleKeyPress('acos(') },
    { label: 'atan', action: () => handleKeyPress('atan(') },
    { label: 'sqrt', action: () => handleKeyPress('sqrt(') },
    
    { label: 'sinh', action: () => handleKeyPress('sinh(') },
    { label: 'cosh', action: () => handleKeyPress('cosh(') },
    { label: 'tanh', action: () => handleKeyPress('tanh(') },
    { label: 'exp', action: () => handleKeyPress('exp(') },
    
    { label: 'ln', action: () => handleKeyPress('ln(') },
    { label: 'log', action: () => handleKeyPress('log10(') },
    { label: 'x!', action: () => handleKeyPress('!') },
    { label: 'mod', action: () => handleKeyPress('%') },
    
    { label: 'π', action: () => handleKeyPress('pi') },
    { label: 'e', action: () => handleKeyPress('e') },
    { label: '10^x', action: () => handleKeyPress('10^(') },
    { label: 'abs', action: () => handleKeyPress('abs(') }
  ];

  const constants = [
    { name: 'π', symbol: 'pi', desc: 'Ratio of circumference to diameter' },
    { name: 'e', symbol: 'e', desc: 'Euler\'s Number' },
    { name: 'h', symbol: 'h', desc: 'Planck\'s Constant' },
    { name: 'c', symbol: 'c', desc: 'Speed of Light' },
    { name: 'G', symbol: 'G', desc: 'Gravitational Constant' },
    { name: 'Na', symbol: 'Na', desc: 'Avogadro\'s Number' },
    { name: 'kb', symbol: 'kb', desc: 'Boltzmann Constant' },
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
        position: 'relative'
      }}
    >
      {/* Top Banner Options */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Scientific Engine</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>High-precision scientific parsing & calculation</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Angle Toggle Mode */}
          <div 
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '2px'
            }}
          >
            <button
              onClick={() => { playHaptic(); updateSetting('angleMode', 'deg'); }}
              style={{
                background: settings.angleMode === 'deg' ? accentColor : 'transparent',
                color: settings.angleMode === 'deg' ? '#000' : 'var(--text-secondary)',
                border: 'none',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              DEG
            </button>
            <button
              onClick={() => { playHaptic(); updateSetting('angleMode', 'rad'); }}
              style={{
                background: settings.angleMode === 'rad' ? accentColor : 'transparent',
                color: settings.angleMode === 'rad' ? '#000' : 'var(--text-secondary)',
                border: 'none',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              RAD
            </button>
          </div>

          <button
            onClick={() => { playHaptic(); setShowScientific(!showScientific); }}
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: `1px solid ${showScientific ? accentColor : 'var(--border-color)'}`,
              background: showScientific ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
              color: showScientific ? accentColor : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            SCIENTIFIC PAD
          </button>

          {showScientific && (
            <button
              onClick={() => { playHaptic(); setShowBookModal(true); }}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: `1px solid ${accentColor}`,
                background: 'rgba(0, 240, 255, 0.05)',
                color: accentColor,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              className="btn-glow"
              title="Open Scientific Constants Reference Book"
            >
              <BookOpen size={14} />
              CONSTANTS
            </button>
          )}
        </div>
      </div>

      {/* Immersive Glass Screen */}
      <div 
        className="glass-panel"
        style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(5, 7, 12, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          minHeight: '140px',
          boxShadow: `0 0 25px rgba(0, 240, 255, 0.02), inset 0 0 15px rgba(255, 255, 255, 0.01)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glowing border indicator */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: accentColor }} />
        
        {/* Math Display Input */}
        <div 
          className="math-mono"
          ref={displayRef}
          style={{
            width: '100%',
            fontSize: expression.length > 18 ? '1.8rem' : '2.4rem',
            fontWeight: 500,
            textAlign: 'right',
            color: '#fff',
            wordBreak: 'break-all',
            overflowY: 'auto',
            maxHeight: '80px',
            lineHeight: 1.2
          }}
        >
          {expression || '0'}
        </div>

        {/* Real-time result preview or error readout */}
        {livePreview && (
          <div 
            className="math-mono"
            style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              marginTop: '4px',
              opacity: 0.75
            }}
          >
            = {livePreview}
          </div>
        )}

        {error && (
          <div 
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-chemistry)',
              marginTop: '4px',
              fontWeight: 500
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Main Core Layout: Keyboard Grid (Drawer removed, keypads now take full width!) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '16px',
          flex: 1,
          minHeight: 0
        }}
      >
        {/* Keypads layout: Side-by-side grid if scientific mode is active */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: (showScientific && !isMobile) ? '1.1fr 1fr' : '1fr', 
            gap: '14px',
            flex: 1,
            minHeight: 0
          }}
        >
          {/* Scientific buttons pad (4 columns, 5 rows - 20 buttons total) */}
          {showScientific && (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridAutoRows: '1fr',
                gap: '8px'
              }}
            >
              {scientificButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  style={{
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    background: 'rgba(189, 0, 255, 0.05)',
                    color: 'var(--color-scientific)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '52px'
                  }}
                  className="btn-glow"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Core Basic Layout Grid (4 columns, 5 rows) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: '1fr',
              gap: '8px'
            }}
          >
            {buttons.map((btn) => {
              let btnBg = 'rgba(255, 255, 255, 0.02)';
              let btnColor = 'var(--text-primary)';
              let border = '1px solid rgba(255, 255, 255, 0.04)';
              
              if (btn.type === 'clear') {
                btnBg = 'rgba(255, 51, 102, 0.05)';
                btnColor = 'var(--color-chemistry)';
                border = '1px solid rgba(255, 51, 102, 0.15)';
              } else if (btn.type === 'delete') {
                btnBg = 'rgba(255, 107, 0, 0.05)';
                btnColor = 'var(--color-engineering)';
                border = '1px solid rgba(255, 107, 0, 0.15)';
              } else if (btn.type === 'op' || btn.type === 'paren') {
                btnBg = 'rgba(0, 240, 255, 0.03)';
                btnColor = accentColor;
                border = '1px solid rgba(0, 240, 255, 0.1)';
              } else if (btn.type === 'equals') {
                btnBg = accentColor;
                btnColor = '#000';
                border = `1px solid ${accentColor}`;
              }

              return (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  style={{
                    borderRadius: '12px',
                    fontSize: btn.type === 'equals' ? '1.35rem' : '1.2rem',
                    fontWeight: btn.type === 'num' ? 500 : 700,
                    color: btnColor,
                    background: btnBg,
                    border: border,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '52px',
                    boxShadow: btn.type === 'equals' ? `0 4px 15px rgba(0, 240, 255, 0.25)` : 'none'
                  }}
                  className={btn.type === 'equals' ? undefined : 'btn-glow'}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Book-like Scientific Constants Reference Modal */}
      {showBookModal && (() => {
        // Filter by group and search query
        const filtered = ALL_CONSTANTS.filter(c => {
          const matchesGroup = selectedGroup === 'All' || c.groupId === selectedGroup;
          const q = bookSearchQuery.toLowerCase();
          const matchesSearch = !bookSearchQuery ||
            c.name.toLowerCase().includes(q) ||
            c.symbol.toLowerCase().includes(q) ||
            c.formulaSymbol.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.groupName.toLowerCase().includes(q);
          return matchesGroup && matchesSearch;
        });

        // Symmetrical half splitting for desktop book layout
        const half = Math.ceil(filtered.length / 2);
        const leftPageConstants = filtered.slice(0, half);
        const rightPageConstants = filtered.slice(half);

        // Mobile Pagination
        const ITEMS_PER_PAGE_MOBILE = 12;
        const mobilePageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE_MOBILE);
        const mobileConstants = filtered.slice(
          (mobilePage - 1) * ITEMS_PER_PAGE_MOBILE,
          mobilePage * ITEMS_PER_PAGE_MOBILE
        );

        // Helper: renders a constant list with group section headers
        const renderWithGroups = (constants) => {
          const items = [];
          let lastGroupId = null;
          constants.forEach((c, idx) => {
            if (c.groupId !== lastGroupId) {
              lastGroupId = c.groupId;
              items.push(
                <div
                  key={`gh-${c.groupId}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 2px 3px 2px',
                    marginTop: idx > 0 ? '10px' : '0',
                    borderBottom: `1px solid ${c.groupColor}30`,
                    flexShrink: 0
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.groupColor, flexShrink: 0, boxShadow: `0 0 6px ${c.groupColor}` }} />
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.groupColor }}>
                    {c.groupName}
                  </span>
                </div>
              );
            }
            items.push(
              <ConstantRow key={c.id} constant={c} onSelect={handleSelectConstant} query={bookSearchQuery} />
            );
          });
          return items;
        };

        return (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              background: 'rgba(5, 7, 12, 0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '12px' : '24px',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={() => setShowBookModal(false)}
          >
            <style dangerouslySetInnerHTML={{ __html: bookStyles }} />
            
            <div 
              style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '1100px',
                height: isMobile ? '85vh' : '75vh',
                background: 'linear-gradient(135deg, rgba(20, 24, 40, 0.98) 0%, rgba(10, 12, 22, 0.99) 100%)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: '16px',
                boxShadow: '0 0 0 4px rgba(10,12,22,0.95), 0 0 0 6px rgba(0,240,255,0.15), 0 25px 60px rgba(0,0,0,0.85)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px 24px 10px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.01)',
                  gap: '10px',
                  zIndex: 20,
                  flexShrink: 0
                }}
              >
                {/* Row 1: Title + Search + Close */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={20} style={{ color: accentColor }} />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                        Scientific Constants Reference Book
                      </h3>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
                        Select a constant to insert its symbol • {ALL_CONSTANTS.length} constants in {CONSTANT_GROUPS.length} groups
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={13} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search name, symbol..."
                        value={bookSearchQuery}
                        onChange={(e) => { setBookSearchQuery(e.target.value); setMobilePage(1); }}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          padding: '5px 10px 5px 28px',
                          fontSize: '0.8rem',
                          color: '#fff',
                          width: '200px',
                          outline: 'none',
                          transition: 'all 0.15s ease'
                        }}
                        className="focus-glow"
                      />
                      {bookSearchQuery && (
                        <button onClick={() => setBookSearchQuery('')} style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                          <X size={11} />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setShowBookModal(false)}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      title="Close Reference Book"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Row 2: Group filter chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[{ id: 'All', name: 'All Groups', color: accentColor }, ...CONSTANT_GROUPS].map(g => {
                    const isActive = selectedGroup === g.id;
                    const chipColor = g.color || accentColor;
                    return (
                      <button
                        key={g.id}
                        onClick={() => { setSelectedGroup(g.id); setMobilePage(1); }}
                        style={{
                          padding: '3px 12px',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: isActive ? `1.5px solid ${chipColor}` : '1px solid rgba(255,255,255,0.07)',
                          background: isActive ? `${chipColor}18` : 'rgba(255,255,255,0.02)',
                          color: isActive ? chipColor : 'var(--text-secondary)',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        className="btn-glow"
                      >
                        {g.id !== 'All' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: chipColor, display: 'inline-block', flexShrink: 0 }} />}
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Book Pages Container */}
              <div 
                style={{
                  flex: 1,
                  position: 'relative',
                  display: 'flex',
                  background: 'rgba(5, 7, 12, 0.2)',
                  minHeight: 0
                }}
              >
                {/* Spine Crease (Desktop Only) */}
                {!isMobile && (
                  <div 
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '30px',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 55%, rgba(0,0,0,0.5) 100%)',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
                      zIndex: 10,
                      pointerEvents: 'none',
                      transform: 'translateX(-50%)'
                    }}
                  />
                )}

                {/* Pages Viewport */}
                {isMobile ? (
                  /* Mobile Single Page View */
                  <div 
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '16px',
                      overflowY: 'auto',
                      gap: '8px'
                    }}
                  >
                    {mobileConstants.length > 0 ? renderWithGroups(mobileConstants) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '0.85rem' }}>
                        No constants found
                      </div>
                    )}
                  </div>
                ) : (
                  /* Desktop Two Page View */
                  <>
                    {/* Left Page */}
                    <div 
                      style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '20px 24px 20px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        borderRight: '1px solid rgba(255,255,255,0.02)'
                      }}
                    >
                      <div style={{ 
                        fontSize: '0.72rem', 
                        color: 'var(--text-muted)', 
                        borderBottom: '1px solid rgba(255,255,255,0.04)', 
                        paddingBottom: '6px',
                        marginBottom: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexShrink: 0
                      }}>
                        <span>TABLE OF PHYSICAL CONSTANTS</span>
                        <span>PAGE 1</span>
                      </div>
                      {leftPageConstants.length > 0 ? renderWithGroups(leftPageConstants) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '0.85rem' }}>
                          No matches on this page
                        </div>
                      )}
                    </div>

                    {/* Right Page */}
                    <div 
                      style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '20px 20px 20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        borderLeft: '1px solid rgba(0,0,0,0.3)'
                      }}
                    >
                      <div style={{ 
                        fontSize: '0.72rem', 
                        color: 'var(--text-muted)', 
                        borderBottom: '1px solid rgba(255,255,255,0.04)', 
                        paddingBottom: '6px',
                        marginBottom: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexShrink: 0
                      }}>
                        <span>PAGE 2</span>
                        <span>CODATA RECOMMENDED VALUES</span>
                      </div>
                      {rightPageConstants.length > 0 ? renderWithGroups(rightPageConstants) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '0.85rem' }}>
                          No matches on this page
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 24px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(5, 7, 12, 0.4)',
                  flexWrap: 'wrap',
                  gap: '12px',
                  zIndex: 20
                }}
              >
                {/* Keep Open Toggle */}
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    userSelect: 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={keepBookOpen}
                    onChange={(e) => setKeepBookOpen(e.target.checked)}
                    style={{
                      accentColor: accentColor,
                      width: '14px',
                      height: '14px',
                      cursor: 'pointer'
                    }}
                  />
                  Keep book open after selecting constant
                </label>

                {/* Symmetrical / Pagination Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Total: {filtered.length} of {ALL_CONSTANTS.length} constants
                  </span>
                  
                  {/* Mobile Page Controls */}
                  {isMobile && mobilePageCount > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => setMobilePage(prev => Math.max(1, prev - 1))}
                        disabled={mobilePage === 1}
                        style={{
                          padding: '4px 10px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '6px',
                          color: mobilePage === 1 ? 'var(--text-muted)' : '#fff',
                          fontSize: '0.72rem',
                          cursor: mobilePage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Prev
                      </button>
                      <span style={{ fontSize: '0.72rem', color: '#fff', fontFamily: 'monospace' }}>
                        {mobilePage} / {mobilePageCount}
                      </span>
                      <button
                        onClick={() => setMobilePage(prev => Math.min(mobilePageCount, prev + 1))}
                        disabled={mobilePage === mobilePageCount}
                        style={{
                          padding: '4px 10px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '6px',
                          color: mobilePage === mobilePageCount ? 'var(--text-muted)' : '#fff',
                          fontSize: '0.72rem',
                          cursor: mobilePage === mobilePageCount ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
