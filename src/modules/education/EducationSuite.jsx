import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateExpression } from '../../utils/mathParser';
import { GraduationCap, Plus, Trash2, CheckCircle2, AlertTriangle, Play, HelpCircle, Search, Copy, Check } from 'lucide-react';

const formulaLibrary = [
  // Integrals & Derivatives (Calculus)
  {
    category: 'Calculus',
    name: 'Power Rule (Derivative)',
    expression: 'd/dx[x^n] = n * x^(n-1)',
    latex: '\\frac{d}{dx}[x^n] = n x^{n-1}',
    desc: 'Basic rule for differentiating power functions where n is any real number.',
    tags: ['derivative', 'power', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Derivative of sin(x)',
    expression: 'd/dx[sin(x)] = cos(x)',
    latex: '\\frac{d}{dx}[\\sin(x)] = \\cos(x)',
    desc: 'The rate of change of the sine function is the cosine function.',
    tags: ['derivative', 'sine', 'trigonometric', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Derivative of cos(x)',
    expression: 'd/dx[cos(x)] = -sin(x)',
    latex: '\\frac{d}{dx}[\\cos(x)] = -\\sin(x)',
    desc: 'The rate of change of the cosine function is negative sine.',
    tags: ['derivative', 'cosine', 'trigonometric', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Derivative of e^x',
    expression: 'd/dx[e^x] = e^x',
    latex: '\\frac{d}{dx}[e^x] = e^x',
    desc: 'The exponential function is its own derivative, representing natural continuous growth.',
    tags: ['derivative', 'exponential', 'euler', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Derivative of ln(x)',
    expression: 'd/dx[ln(x)] = 1/x',
    latex: '\\frac{d}{dx}[\\ln(x)] = \\frac{1}{x}',
    desc: 'The derivative of the natural logarithm function is reciprocal x.',
    tags: ['derivative', 'logarithm', 'ln', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Power Rule (Integration)',
    expression: '∫ x^n dx = (x^(n+1))/(n+1) + C',
    latex: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
    desc: 'Reverses the power rule of differentiation. Valid for n not equal to -1.',
    tags: ['integral', 'power', 'antiderivative', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Integral of 1/x',
    expression: '∫ 1/x dx = ln|x| + C',
    latex: '\\int \\frac{1}{x} \\, dx = \\ln|x| + C',
    desc: 'The antiderivative of the reciprocal function, resulting in the natural logarithm.',
    tags: ['integral', 'reciprocal', 'logarithm', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Integral of e^x',
    expression: '∫ e^x dx = e^x + C',
    latex: '\\int e^x \\, dx = e^x + C',
    desc: 'The antiderivative of the natural exponential function remains identical.',
    tags: ['integral', 'exponential', 'euler', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Integral of sin(x)',
    expression: '∫ sin(x) dx = -cos(x) + C',
    latex: '\\int \\sin(x) \\, dx = -\\cos(x) + C',
    desc: 'Integrating sine yields negative cosine.',
    tags: ['integral', 'sine', 'trigonometric', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Integral of cos(x)',
    expression: '∫ cos(x) dx = sin(x) + C',
    latex: '\\int \\cos(x) \\, dx = \\sin(x) + C',
    desc: 'Integrating cosine yields sine.',
    tags: ['integral', 'cosine', 'trigonometric', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Integration by Parts',
    expression: '∫ u dv = u*v - ∫ v du',
    latex: '\\int u \\, dv = uv - \\int v \\, du',
    desc: 'Advanced method of integration based on the product rule of differentiation.',
    tags: ['integral', 'parts', 'product', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Chain Rule',
    expression: 'd/dx[f(g(x))] = f\'(g(x)) * g\'(x)',
    latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
    desc: 'Differentiates composition of functions (function inside a function).',
    tags: ['derivative', 'chain', 'composite', 'calculus']
  },
  {
    category: 'Calculus',
    name: 'Quotient Rule',
    expression: 'd/dx[u/v] = (u\'*v - u*v\') / v^2',
    latex: '\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}',
    desc: 'Rule for finding the derivative of a function that is the ratio of two functions.',
    tags: ['derivative', 'quotient', 'ratio', 'calculus']
  },

  // Trigonometry
  {
    category: 'Trigonometry',
    name: 'Pythagorean Trigonometric Identity',
    expression: 'sin^2(x) + cos^2(x) = 1',
    latex: '\\sin^2(x) + \\cos^2(x) = 1',
    desc: 'Fundamental relation linking sine and cosine for any angle based on right triangle properties.',
    tags: ['trig', 'pythagorean', 'identity', 'geometry']
  },
  {
    category: 'Trigonometry',
    name: 'Double Angle Identity (Sine)',
    expression: 'sin(2x) = 2 * sin(x) * cos(x)',
    latex: '\\sin(2x) = 2\\sin(x)\\cos(x)',
    desc: 'Expands the sine of a double angle into individual sine and cosine factors.',
    tags: ['trig', 'double', 'sine', 'identity']
  },
  {
    category: 'Trigonometry',
    name: 'Double Angle Identity (Cosine)',
    expression: 'cos(2x) = cos^2(x) - sin^2(x)',
    latex: '\\cos(2x) = \\cos^2(x) - \\sin^2(x)',
    desc: 'Expresses cosine of a double angle. Can also be written as 2*cos^2(x)-1 or 1-2*sin^2(x).',
    tags: ['trig', 'double', 'cosine', 'identity']
  },
  {
    category: 'Trigonometry',
    name: 'Tangent Quotient Relation',
    expression: 'tan(x) = sin(x) / cos(x)',
    latex: '\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}',
    desc: 'Defines tangent as the ratio of sine to cosine of the same angle.',
    tags: ['trig', 'tangent', 'ratio', 'identity']
  },
  {
    category: 'Trigonometry',
    name: 'Euler\'s Formula',
    expression: 'e^(i*x) = cos(x) + i * sin(x)',
    latex: 'e^{ix} = \\cos(x) + i\\sin(x)',
    desc: 'Deep mathematical formula linking complex exponentials with trigonometric functions.',
    tags: ['trig', 'complex', 'euler', 'exponent']
  },
  {
    category: 'Trigonometry',
    name: 'Sine Addition Formula',
    expression: 'sin(a + b) = sin(a)*cos(b) + cos(a)*sin(b)',
    latex: '\\sin(a + b) = \\sin(a)\\cos(b) + \\cos(a)\\sin(b)',
    desc: 'Calculates the sine of the sum of two distinct angles.',
    tags: ['trig', 'sum', 'sine', 'identity']
  },
  {
    category: 'Trigonometry',
    name: 'Cosine Addition Formula',
    expression: 'cos(a + b) = cos(a)*cos(b) - sin(a)*sin(b)',
    latex: '\\cos(a + b) = \\cos(a)\\cos(b) - \\sin(a)\\sin(b)',
    desc: 'Calculates the cosine of the sum of two distinct angles.',
    tags: ['trig', 'sum', 'cosine', 'identity']
  },

  // Physics
  {
    category: 'Physics',
    name: 'Newton\'s Second Law',
    expression: 'F = m * a',
    latex: 'F = m a',
    desc: 'Net force applied on an object is proportional to its mass times its acceleration vector.',
    tags: ['physics', 'force', 'newton', 'mechanics']
  },
  {
    category: 'Physics',
    name: 'Einstein\'s Mass-Energy Equivalence',
    expression: 'E = m * c^2',
    latex: 'E = m c^2',
    desc: 'Mass and energy are interchangeable, proportional to the speed of light squared.',
    tags: ['physics', 'relativity', 'energy', 'einstein']
  },
  {
    category: 'Physics',
    name: 'Ideal Gas Law',
    expression: 'P * V = n * R * T',
    latex: 'P V = n R T',
    desc: 'State equation relating pressure, volume, gas amount, and temperature of an ideal gas.',
    tags: ['physics', 'thermodynamics', 'gas', 'chemistry']
  },
  {
    category: 'Physics',
    name: 'Coulomb\'s Law of Electrostatics',
    expression: 'F = k_e * (|q1 * q2|) / r^2',
    latex: 'F = k_e \\frac{|q_1 q_2|}{r^2}',
    desc: 'Calculates force of electrostatic attraction or repulsion between two stationary point charges.',
    tags: ['physics', 'electrostatics', 'charge', 'force']
  },
  {
    category: 'Physics',
    name: 'Kinetic Energy Formula',
    expression: 'KE = 0.5 * m * v^2',
    latex: 'KE = \\frac{1}{2} m v^2',
    desc: 'The energy possessed by an object due to its motion, proportional to speed squared.',
    tags: ['physics', 'energy', 'kinetic', 'mechanics']
  },
  {
    category: 'Physics',
    name: 'Gravitational Potential Energy',
    expression: 'PE = m * g * h',
    latex: 'PE = m g h',
    desc: 'Stored mechanical energy of an object relative to its elevation height in a uniform gravitational field.',
    tags: ['physics', 'energy', 'gravity', 'potential']
  },
  {
    category: 'Physics',
    name: 'Wave Speed Formula',
    expression: 'v = f * λ',
    latex: 'v = f \\lambda',
    desc: 'Relates velocity of propagation of a wave to its frequency and wavelength.',
    tags: ['physics', 'wave', 'optics', 'sound']
  },
  {
    category: 'Physics',
    name: 'Ohm\'s Law (Electrodynamics)',
    expression: 'V = I * R',
    latex: 'V = I R',
    desc: 'Electrical voltage is equal to current flowing through a conductor multiplied by its resistance.',
    tags: ['physics', 'electronics', 'voltage', 'circuits']
  },
  {
    category: 'Physics',
    name: 'Law of Universal Gravitation',
    expression: 'F = G * (m1 * m2) / r^2',
    latex: 'F = G \\frac{m_1 m_2}{r^2}',
    desc: 'Calculates the mutual attractive gravitational force between two physical point masses.',
    tags: ['physics', 'gravity', 'force', 'astronomy']
  },
  {
    category: 'Physics',
    name: 'Planck-Einstein Quantization Relation',
    expression: 'E = h * v',
    latex: 'E = h \\nu',
    desc: 'Relates the energy of a quantum photon particle to its electromagnetic oscillation frequency.',
    tags: ['physics', 'quantum', 'light', 'energy']
  }
];

const builtInTrigAndMathWords = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'ln', 'log', 'log10', 'sqrt', 'abs', 'exp', 'pi', 'e', 'h', 'c', 'g', 'na', 'kb'];

export default function EducationSuite() {
  const { customFormulas, addCustomFormula, deleteCustomFormula, getAccentColor } = useApp();
  const accentColor = getAccentColor('education');

  const [activeTab, setActiveTab] = useState('custom'); // custom, search, cheat, quiz
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  // Custom formula creator states
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaText, setNewFormulaText] = useState('');
  const [newFormulaDesc, setNewFormulaDesc] = useState('');
  const [discoveredVars, setDiscoveredVars] = useState([]);
  
  // Custom formula evaluation states
  const [selectedFormulaId, setSelectedFormulaId] = useState(null);
  const [evalVarValues, setEvalVarValues] = useState({});
  const [evalResult, setEvalResult] = useState('');
  const [evalError, setEvalError] = useState('');

  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const quizzes = [
    {
      question: 'What is the limit of (sin(x) / x) as x approaches 0?',
      options: ['0', '1', 'Infinity', 'Undefined'],
      answerIdx: 1,
      explanation: 'Squeeze theorem or L\'Hopital\'s rule proves that lim (x->0) sin(x)/x = 1.'
    },
    {
      question: 'Evaluate the integral of 2x dx from 1 to 3.',
      options: ['4', '6', '8', '10'],
      answerIdx: 2,
      explanation: 'The anti-derivative of 2x is x^2. Evaluating x^2 from 1 to 3 gives 3^2 - 1^2 = 9 - 1 = 8.'
    },
    {
      question: 'An object of mass 5kg is accelerated at 4m/s^2. Calculate the net force in Newtons.',
      options: ['1.25 N', '9 N', '20 N', '45 N'],
      answerIdx: 2,
      explanation: 'Force (F) = mass (m) * acceleration (a). F = 5kg * 4m/s^2 = 20 N.'
    }
  ];

  const cheatSheets = [
    { category: 'Algebra', name: 'Quadratic Equation Formula', formula: '(-b + sqrt(b^2 - 4*a*c)) / (2*a)', desc: 'Solves quadratic roots.' },
    { category: 'Geometry', name: 'Sphere Volume', formula: '(4/3) * pi * r^3', desc: 'Volume of a sphere.' },
    { category: 'Physics', name: 'Gravitational Force', formula: 'G * m1 * m2 / r^2', desc: 'Newtonian gravitational pull.' },
    { category: 'Calculus', name: 'Derivative of x^n', formula: 'n * x^(n-1)', desc: 'Power rule derivative.' }
  ];

  // Scan equation for variables
  const scanVariables = () => {
    if (!newFormulaText.trim()) return;
    
    // Find all word characters and filter out numbers and math functions
    const regex = /[a-zA-Z]+/g;
    const matches = newFormulaText.match(regex) || [];
    
    // De-duplicate and filter math functions
    const vars = Array.from(new Set(matches))
      .filter(v => !builtInTrigAndMathWords.includes(v.toLowerCase()));

    setDiscoveredVars(vars.map(v => ({ name: v, label: `${v} Parameter`, defaultValue: '1' })));
  };

  const handleCreateFormula = (e) => {
    e.preventDefault();
    if (!newFormulaName.trim() || !newFormulaText.trim() || discoveredVars.length === 0) return;

    const newFormulaObj = {
      name: newFormulaName.trim(),
      formula: newFormulaText.trim(),
      description: newFormulaDesc.trim(),
      variables: discoveredVars
    };

    addCustomFormula(newFormulaObj);
    
    // Clear creator form
    setNewFormulaName('');
    setNewFormulaText('');
    setNewFormulaDesc('');
    setDiscoveredVars([]);
  };

  // Run computation on a custom formula
  const selectFormulaToEval = (f) => {
    setSelectedFormulaId(f.id);
    const initialVals = {};
    f.variables.forEach(v => {
      initialVals[v.name] = v.defaultValue;
    });
    setEvalVarValues(initialVals);
    setEvalResult('');
    setEvalError('');
  };

  const handleVarValueChange = (name, val) => {
    setEvalVarValues(prev => ({ ...prev, [name]: val }));
  };

  const runCustomFormula = (f) => {
    try {
      const res = evaluateExpression(f.formula, evalVarValues, 'rad');
      if (isNaN(res)) {
        setEvalError('Evaluation returned NaN');
      } else {
        setEvalResult(res.toString());
        setEvalError('');
      }
    } catch (e) {
      setEvalError(e.message || 'Evaluation Error');
    }
  };

  const submitQuiz = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedAnswer === quizzes[quizIdx].answerIdx) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuiz = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizIdx(prev => (prev + 1) % quizzes.length);
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
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Education & Custom Formulas</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Create custom formulas, explore reference cheat-sheets, and practice quizzes</p>
      </div>

      {/* Selector Subtabs */}
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
        <button
          onClick={() => setActiveTab('custom')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'custom' ? accentColor : 'transparent',
            color: activeTab === 'custom' ? '#000' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          Custom Formula Builder
        </button>
        <button
          onClick={() => setActiveTab('search')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'search' ? accentColor : 'transparent',
            color: activeTab === 'search' ? '#000' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          Formula Search Library
        </button>
        <button
          onClick={() => setActiveTab('cheat')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'cheat' ? accentColor : 'transparent',
            color: activeTab === 'cheat' ? '#000' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          Formula Cheat-Sheets
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'quiz' ? accentColor : 'transparent',
            color: activeTab === 'quiz' ? '#000' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          Practice Quizzes
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'custom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
          {/* Left panel: Creator & List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Custom formula creator form */}
            <form onSubmit={handleCreateFormula} className="glass-panel" style={{ padding: '20px', background: 'rgba(16,20,35,0.4)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Create Custom Formula</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Formula Name</label>
                  <input
                    type="text"
                    placeholder="Ohm's Voltage"
                    value={newFormulaName}
                    onChange={(e) => setNewFormulaName(e.target.value)}
                    className="glass-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Formula Expression</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="I * R"
                      value={newFormulaText}
                      onChange={(e) => setNewFormulaText(e.target.value)}
                      className="glass-input math-mono"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={scanVariables}
                      className="btn-glow"
                      style={{ padding: '0 12px', fontSize: '0.72rem', fontWeight: 600, borderRadius: '8px' }}
                    >
                      Scan
                    </button>
                  </div>
                </div>
              </div>

              {/* Variable definition fields */}
              {discoveredVars.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Discovered Variables:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {discoveredVars.map((v, idx) => (
                      <div key={v.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="math-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: accentColor }}>{v.name}:</span>
                        <input
                          type="text"
                          value={v.label}
                          onChange={(e) => {
                            const updated = [...discoveredVars];
                            updated[idx].label = e.target.value;
                            setDiscoveredVars(updated);
                          }}
                          className="glass-input"
                          style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={discoveredVars.length === 0}
                className="btn-glow flex-center"
                style={{
                  padding: '10px 0',
                  borderRadius: '8px',
                  background: discoveredVars.length > 0 ? accentColor : 'rgba(255,255,255,0.02)',
                  color: discoveredVars.length > 0 ? '#000' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                <Plus size={16} style={{ marginRight: '6px' }} /> Save Custom Formula
              </button>
            </form>

            {/* Custom formula saved list */}
            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(16,20,35,0.35)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Saved Formula Catalog</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {customFormulas.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.02)',
                      border: selectedFormulaId === f.id ? `1px solid ${accentColor}` : '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', margin: '0 0 2px 0' }}>{f.name}</h4>
                      <code className="math-mono" style={{ fontSize: '0.78rem', color: accentColor }}>{f.formula}</code>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginTop: '4px' }}>
                      <button
                        onClick={() => selectFormulaToEval(f)}
                        className="btn-glow flex-center"
                        style={{ flex: 1, padding: '4px 0', fontSize: '0.72rem', fontWeight: 600, gap: '4px', borderRadius: '6px' }}
                      >
                        <Play size={12} style={{ color: accentColor }} /> Run
                      </button>
                      <button
                        onClick={() => deleteCustomFormula(f.id)}
                        className="btn-glow flex-center"
                        style={{ width: '26px', height: '26px', background: 'transparent', border: 'none', borderRadius: '6px', color: 'var(--color-chemistry)' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Active evaluation playground */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {selectedFormulaId ? (() => {
              const activeFormula = customFormulas.find(f => f.id === selectedFormulaId);
              if (!activeFormula) return null;

              return (
                <div 
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    background: 'rgba(16, 20, 35, 0.45)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    height: '100%'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 2px 0' }}>{activeFormula.name}</h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Input variables parameters to compute final expression</p>
                  </div>

                  {/* Input parameters list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                    {activeFormula.variables.map((v) => (
                      <div key={v.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v.label} (<code>{v.name}</code>)</label>
                        <input
                          type="number"
                          value={evalVarValues[v.name] || ''}
                          onChange={(e) => handleVarValueChange(v.name, e.target.value)}
                          className="glass-input math-mono"
                          style={{ fontSize: '0.85rem' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Run Button */}
                  <button
                    onClick={() => runCustomFormula(activeFormula)}
                    className="btn-glow flex-center"
                    style={{
                      padding: '12px 0',
                      borderRadius: '8px',
                      background: accentColor,
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    Compute Result
                  </button>

                  {/* Outputs */}
                  {evalResult && (
                    <div style={{ padding: '12px', background: 'rgba(5,7,12,0.4)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Computed Output</span>
                      <span className="math-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                        {evalResult}
                      </span>
                    </div>
                  )}

                  {evalError && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-chemistry)', fontWeight: 500, textAlign: 'center' }}>
                      {evalError}
                    </div>
                  )}
                </div>
              );
            })() : (
              <div 
                className="glass-panel"
                style={{
                  padding: '24px',
                  background: 'rgba(16, 20, 35, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)',
                  height: '100%',
                  minHeight: '260px'
                }}
              >
                <GraduationCap size={36} />
                <span style={{ fontSize: '0.8rem' }}>Select a custom formula to evaluate</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div 
          className="glass-panel animate-fade" 
          style={{ 
            padding: '20px', 
            background: 'rgba(16, 20, 35, 0.4)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px' 
          }}
        >
          {/* Header & Search Input */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Interactive Formula Search</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>Search and copy key equations in Calculus, Trigonometry, and Physics</p>
            </div>
            
            {/* Search Input bar */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search formulas, tags, laws..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '36px', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            {['All', 'Calculus', 'Trigonometry', 'Physics'].map((cat) => {
              const isActive = selectedCategory === cat;
              let chipColor = accentColor;
              if (cat === 'Calculus') chipColor = '#00f0ff';
              else if (cat === 'Trigonometry') chipColor = '#ff3366';
              else if (cat === 'Physics') chipColor = '#ffd700';

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="btn-glow"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isActive ? `1.5px solid ${chipColor}` : '1px solid rgba(255,255,255,0.05)',
                    background: isActive ? `${chipColor}15` : 'rgba(255,255,255,0.01)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat === 'Calculus' ? 'Calculus (Integrals & Derivatives)' : cat}
                </button>
              );
            })}
          </div>

          {/* Formulas list grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
            {(() => {
              const filtered = formulaLibrary.filter(f => {
                const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
                const matchesSearch = 
                  f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.expression.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
                return matchCat && matchesSearch;
              });

              if (filtered.length === 0) {
                return (
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px', color: 'var(--text-muted)' }}>
                    <Search size={32} />
                    <span style={{ fontSize: '0.85rem' }}>No formulas found matching "{searchQuery}"</span>
                  </div>
                );
              }

              return filtered.map((f, idx) => {
                let categoryColor = '#00f0ff'; // Calculus
                if (f.category === 'Trigonometry') categoryColor = '#ff3366';
                if (f.category === 'Physics') categoryColor = '#ffd700';

                const isCopied = copiedIndex === idx;

                return (
                  <div
                    key={f.name}
                    className="glass-panel"
                    style={{
                      padding: '16px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div>
                      {/* Top Row: Category Badge & Title */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span 
                          style={{ 
                            fontSize: '0.62rem', 
                            fontWeight: 700, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.05em',
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            background: `${categoryColor}10`,
                            color: categoryColor,
                            border: `1.5px solid ${categoryColor}25`
                          }}
                        >
                          {f.category}
                        </span>
                        
                        {/* Interactive Copy Button */}
                        <button
                          onClick={() => handleCopy(f.expression, idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isCopied ? '#00ff66' : 'var(--text-secondary)',
                            transition: 'color 0.2s ease',
                            padding: '4px',
                            borderRadius: '4px'
                          }}
                          className="btn-glow"
                          title="Copy expression"
                        >
                          {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>

                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: '8px 0 6px 0' }}>{f.name}</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.4 }}>{f.desc}</p>
                    </div>

                    {/* Formula Text Box */}
                    <div>
                      <code 
                        className="math-mono" 
                        style={{ 
                          fontSize: '0.82rem', 
                          color: '#fff', 
                          padding: '10px 12px', 
                          background: 'rgba(0,0,0,0.3)', 
                          borderRadius: '8px', 
                          display: 'block', 
                          borderLeft: `3px solid ${categoryColor}`,
                          wordBreak: 'break-all'
                        }}
                      >
                        {f.expression}
                      </code>

                      {/* Tags list */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {f.tags.map(t => (
                          <span key={t} style={{ fontSize: '0.58rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '2px 6px', borderRadius: '4px' }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {activeTab === 'cheat' && (
        <div className="glass-panel animate-fade" style={{ padding: '20px', background: 'rgba(16, 20, 35, 0.4)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 12px 0' }}>Formula Cheat-Sheets</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {cheatSheets.map((sheet, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: accentColor }}>{sheet.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reference Card</span>
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: '4px 0 2px 0' }}>{sheet.name}</h4>
                <code className="math-mono" style={{ fontSize: '0.8rem', color: '#00f0ff', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', display: 'block', margin: '4px 0' }}>
                  {sheet.formula}
                </code>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>{sheet.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div 
          className="glass-panel animate-fade"
          style={{
            padding: '24px',
            background: 'rgba(16, 20, 35, 0.4)',
            maxWidth: '680px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: accentColor }}>Mathematics Quiz</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Score: {score} / {quizzes.length}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Question {quizIdx + 1} of {quizzes.length}</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '4px', lineHeight: 1.4 }}>{quizzes[quizIdx].question}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quizzes[quizIdx].options.map((opt, oIdx) => {
              let optBorder = '1px solid var(--border-color)';
              let optBg = 'transparent';
              
              if (selectedAnswer === oIdx) {
                optBorder = `1px solid ${accentColor}`;
                optBg = 'rgba(255,255,255,0.02)';
              }
              
              if (quizSubmitted) {
                if (oIdx === quizzes[quizIdx].answerIdx) {
                  optBorder = '1px solid #00ff66';
                  optBg = 'rgba(0, 255, 102, 0.05)';
                } else if (selectedAnswer === oIdx) {
                  optBorder = '1px solid #ff3366';
                  optBg = 'rgba(255, 51, 102, 0.05)';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => !quizSubmitted && setSelectedAnswer(oIdx)}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: optBorder,
                    background: optBg,
                    color: '#fff',
                    textAlign: 'left',
                    cursor: quizSubmitted ? 'default' : 'pointer',
                    fontSize: '0.88rem',
                    transition: 'all var(--transition-fast)'
                  }}
                  className={quizSubmitted ? undefined : 'btn-glow'}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {!quizSubmitted ? (
              <button
                onClick={submitQuiz}
                disabled={selectedAnswer === null}
                className="btn-glow flex-center"
                style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, background: selectedAnswer !== null ? accentColor : 'rgba(255,255,255,0.01)', color: selectedAnswer !== null ? '#000' : 'var(--text-muted)' }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuiz}
                className="btn-glow flex-center"
                style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, background: accentColor, color: '#000' }}
              >
                Next Question
              </button>
            )}
          </div>

          {quizSubmitted && (
            <div 
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                gap: '10px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}
            >
              {selectedAnswer === quizzes[quizIdx].answerIdx ? (
                <CheckCircle2 size={16} style={{ color: '#00ff66', flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertTriangle size={16} style={{ color: '#ff3366', flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <strong>{selectedAnswer === quizzes[quizIdx].answerIdx ? 'Correct!' : 'Incorrect.'}</strong> {quizzes[quizIdx].explanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
