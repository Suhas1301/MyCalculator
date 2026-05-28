import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Copy, Check, Sigma, HelpCircle, Play, Sparkles } from 'lucide-react';

const formulaLibrary = [
  // Calculus (Derivatives & Integrals)
  {
    category: 'Calculus',
    name: 'Power Rule (Derivative)',
    expression: 'd/dx[x^n] = n * x^(n-1)',
    desc: 'Basic rule for differentiating power functions where n is any real number.',
    tags: ['derivative', 'power', 'calculus'],
    variables: [
      { name: 'x', label: 'Base variable (x)', defaultValue: '2', unit: '' },
      { name: 'n', label: 'Power exponent (n)', defaultValue: '3', unit: '' }
    ],
    solve: (v) => {
      const x = parseFloat(v.x);
      const n = parseFloat(v.n);
      if (isNaN(x) || isNaN(n)) return '';
      return n * Math.pow(x, n - 1);
    },
    resultLabel: "d/dx [x^n]"
  },
  {
    category: 'Calculus',
    name: 'Derivative of Exponential e^x',
    expression: 'd/dx[e^(k*x)] = k * e^(k*x)',
    desc: 'The derivative of an exponential function with growth constant k.',
    tags: ['derivative', 'exponential', 'euler', 'calculus'],
    variables: [
      { name: 'x', label: 'Variable (x)', defaultValue: '1', unit: '' },
      { name: 'k', label: 'Growth constant (k)', defaultValue: '2', unit: '' }
    ],
    solve: (v) => {
      const x = parseFloat(v.x);
      const k = parseFloat(v.k);
      if (isNaN(x) || isNaN(k)) return '';
      return k * Math.exp(k * x);
    },
    resultLabel: "d/dx [e^(k*x)]"
  },
  {
    category: 'Calculus',
    name: 'Derivative of Natural Logarithm ln(x)',
    expression: 'd/dx[ln(x)] = 1/x',
    desc: 'The derivative of natural log function. Represents instant rate of log scaling.',
    tags: ['derivative', 'logarithm', 'ln', 'calculus'],
    variables: [
      { name: 'x', label: 'Independent variable (x)', defaultValue: '5', unit: '' }
    ],
    solve: (v) => {
      const x = parseFloat(v.x);
      if (isNaN(x)) return '';
      if (x === 0) return 'Undefined (x = 0)';
      return 1 / x;
    },
    resultLabel: "d/dx [ln(x)]"
  },
  {
    category: 'Calculus',
    name: 'Power Rule (Definite Integration)',
    expression: '∫[a to b] x^n dx = (b^(n+1) - a^(n+1)) / (n+1)',
    desc: 'Calculates the definite integral (area under curve) for x^n from limit a to limit b.',
    tags: ['integral', 'power', 'definite', 'calculus'],
    variables: [
      { name: 'a', label: 'Lower limit (a)', defaultValue: '0', unit: '' },
      { name: 'b', label: 'Upper limit (b)', defaultValue: '3', unit: '' },
      { name: 'n', label: 'Power exponent (n)', defaultValue: '2', unit: '' }
    ],
    solve: (v) => {
      const a = parseFloat(v.a);
      const b = parseFloat(v.b);
      const n = parseFloat(v.n);
      if (isNaN(a) || isNaN(b) || isNaN(n)) return '';
      if (n === -1) {
        if (a <= 0 || b <= 0) return 'Undefined (log of non-positive)';
        return Math.log(b) - Math.log(a);
      }
      return (Math.pow(b, n + 1) - Math.pow(a, n + 1)) / (n + 1);
    },
    resultLabel: "Definite Integral Area"
  },
  {
    category: 'Calculus',
    name: 'Definite Integral of e^(k*x)',
    expression: '∫[a to b] e^(k*x) dx = (e^(k*b) - e^(k*a)) / k',
    desc: 'Integrates the natural exponential function scaling from limit a to limit b.',
    tags: ['integral', 'exponential', 'definite', 'calculus'],
    variables: [
      { name: 'a', label: 'Lower limit (a)', defaultValue: '0', unit: '' },
      { name: 'b', label: 'Upper limit (b)', defaultValue: '2', unit: '' },
      { name: 'k', label: 'Multiplier (k)', defaultValue: '1', unit: '' }
    ],
    solve: (v) => {
      const a = parseFloat(v.a);
      const b = parseFloat(v.b);
      const k = parseFloat(v.k);
      if (isNaN(a) || isNaN(b) || isNaN(k)) return '';
      if (k === 0) return b - a;
      return (Math.exp(k * b) - Math.exp(k * a)) / k;
    },
    resultLabel: "Definite Integral Area"
  },
  {
    category: 'Calculus',
    name: 'Definite Integral of 1/x',
    expression: '∫[a to b] 1/x dx = ln|b| - ln|a|',
    desc: 'The definite integral of the reciprocal function over bounds [a, b].',
    tags: ['integral', 'reciprocal', 'logarithm', 'calculus'],
    variables: [
      { name: 'a', label: 'Lower limit (a)', defaultValue: '1', unit: '' },
      { name: 'b', label: 'Upper limit (b)', defaultValue: '5', unit: '' }
    ],
    solve: (v) => {
      const a = parseFloat(v.a);
      const b = parseFloat(v.b);
      if (isNaN(a) || isNaN(b)) return '';
      if (a === 0 || b === 0) return 'Undefined (division by zero)';
      if ((a < 0 && b > 0) || (a > 0 && b < 0)) return 'Crosses asymptote at x = 0';
      return Math.log(Math.abs(b)) - Math.log(Math.abs(a));
    },
    resultLabel: "Definite Integral Area"
  },

  // Trigonometry
  {
    category: 'Trigonometry',
    name: 'Pythagorean Theorem',
    expression: 'c = sqrt(a^2 + b^2)',
    desc: 'Solves the hypotenuse c of a right-angled triangle given legs a and b.',
    tags: ['trig', 'pythagorean', 'triangle', 'geometry'],
    variables: [
      { name: 'a', label: 'Leg side length (a)', defaultValue: '3', unit: '' },
      { name: 'b', label: 'Leg side length (b)', defaultValue: '4', unit: '' }
    ],
    solve: (v) => {
      const a = parseFloat(v.a);
      const b = parseFloat(v.b);
      if (isNaN(a) || isNaN(b)) return '';
      return Math.sqrt(a * a + b * b);
    },
    resultLabel: "Hypotenuse (c)"
  },
  {
    category: 'Trigonometry',
    name: 'Law of Cosines (Side c)',
    expression: 'c = sqrt(a^2 + b^2 - 2*a*b*cos(C))',
    desc: 'Finds the length of side c in any arbitrary triangle given sides a, b and angle C in degrees.',
    tags: ['trig', 'cosine', 'triangle', 'geometry'],
    variables: [
      { name: 'a', label: 'Side length (a)', defaultValue: '5', unit: '' },
      { name: 'b', label: 'Side length (b)', defaultValue: '7', unit: '' },
      { name: 'C', label: 'Angle C (degrees)', defaultValue: '60', unit: '°' }
    ],
    solve: (v) => {
      const a = parseFloat(v.a);
      const b = parseFloat(v.b);
      const Cdeg = parseFloat(v.C);
      if (isNaN(a) || isNaN(b) || isNaN(Cdeg)) return '';
      const Crad = (Cdeg * Math.PI) / 180;
      return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(Crad));
    },
    resultLabel: "Third Side (c)"
  },
  {
    category: 'Trigonometry',
    name: 'Basic Ratios (Sin, Cos, Tan)',
    expression: 'sin(θ), cos(θ), tan(θ)',
    desc: 'Computes standard trigonometric ratios for any angle θ entered in degrees.',
    tags: ['trig', 'sine', 'cosine', 'tangent', 'ratios'],
    variables: [
      { name: 'theta', label: 'Angle (θ in degrees)', defaultValue: '45', unit: '°' }
    ],
    solve: (v) => {
      const theta = parseFloat(v.theta);
      if (isNaN(theta)) return '';
      const rad = (theta * Math.PI) / 180;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      const t = Math.abs(c) < 1e-15 ? 'Infinity' : Math.tan(rad);
      return `sin: ${s.toFixed(5)}, cos: ${c.toFixed(5)}, tan: ${typeof t === 'number' ? t.toFixed(5) : t}`;
    },
    resultLabel: "Trigonometric Ratios"
  },
  {
    category: 'Trigonometry',
    name: 'Euler\'s Euler Formula Coordinates',
    expression: 'e^(i*x) = cos(x) + i*sin(x)',
    desc: 'Computes the polar coordinates complex representation values for e^(i*x) where x is in radians.',
    tags: ['trig', 'euler', 'complex', 'exponential'],
    variables: [
      { name: 'x', label: 'Radian input (x)', defaultValue: '3.14159', unit: 'rad' }
    ],
    solve: (v) => {
      const x = parseFloat(v.x);
      if (isNaN(x)) return '';
      const real = Math.cos(x);
      const imag = Math.sin(x);
      return `${real.toFixed(5)} + ${imag.toFixed(5)}i`;
    },
    resultLabel: "Complex Output (Z)"
  },

  // Physics
  {
    category: 'Physics',
    name: 'Newton\'s Second Law (Force)',
    expression: 'F = m * a',
    desc: 'Calculates the net force required to accelerate a body of mass m with acceleration a.',
    tags: ['physics', 'force', 'newton', 'mechanics'],
    variables: [
      { name: 'm', label: 'Mass (m)', defaultValue: '10', unit: 'kg' },
      { name: 'a', label: 'Acceleration (a)', defaultValue: '9.81', unit: 'm/s²' }
    ],
    solve: (v) => {
      const m = parseFloat(v.m);
      const a = parseFloat(v.a);
      if (isNaN(m) || isNaN(a)) return '';
      return m * a;
    },
    resultLabel: "Force (F)",
    resultUnit: "N"
  },
  {
    category: 'Physics',
    name: 'Einstein\'s Mass-Energy Equivalence',
    expression: 'E = m * c^2',
    desc: 'Relates rest mass m directly to equivalent thermodynamic energy E using light velocity.',
    tags: ['physics', 'energy', 'einstein', 'relativity'],
    variables: [
      { name: 'm', label: 'Rest Mass (m)', defaultValue: '0.001', unit: 'kg' }
    ],
    solve: (v) => {
      const m = parseFloat(v.m);
      if (isNaN(m)) return '';
      const c = 299792458;
      return m * c * c;
    },
    resultLabel: "Equivalent Energy (E)",
    resultUnit: "J"
  },
  {
    category: 'Physics',
    name: 'Newtonian Gravitational Force',
    expression: 'F = G * (m1 * m2) / r^2',
    desc: 'Calculates attractive gravitational force between two point masses separation distance r.',
    tags: ['physics', 'gravity', 'force', 'astronomy'],
    variables: [
      { name: 'm1', label: 'First Mass (m1)', defaultValue: '5.97e24', unit: 'kg' },
      { name: 'm2', label: 'Second Mass (m2)', defaultValue: '7.34e22', unit: 'kg' },
      { name: 'r', label: 'Distance between centers (r)', defaultValue: '3.84e8', unit: 'm' }
    ],
    solve: (v) => {
      const m1 = parseFloat(v.m1);
      const m2 = parseFloat(v.m2);
      const r = parseFloat(v.r);
      if (isNaN(m1) || isNaN(m2) || isNaN(r)) return '';
      const G = 6.6743e-11;
      if (r === 0) return 'Infinite Force (r = 0)';
      return (G * m1 * m2) / (r * r);
    },
    resultLabel: "Gravitational Force (F)",
    resultUnit: "N"
  },
  {
    category: 'Physics',
    name: 'Coulomb\'s Electrostatic Force',
    expression: 'F = k_e * (|q1 * q2|) / r^2',
    desc: 'Calculates attraction or repulsion electrostatic force between point charges q1, q2.',
    tags: ['physics', 'electrostatics', 'charge', 'electricity'],
    variables: [
      { name: 'q1', label: 'Charge 1 (q1)', defaultValue: '1e-6', unit: 'C' },
      { name: 'q2', label: 'Charge 2 (q2)', defaultValue: '-2e-6', unit: 'C' },
      { name: 'r', label: 'Separation distance (r)', defaultValue: '0.05', unit: 'm' }
    ],
    solve: (v) => {
      const q1 = parseFloat(v.q1);
      const q2 = parseFloat(v.q2);
      const r = parseFloat(v.r);
      if (isNaN(q1) || isNaN(q2) || isNaN(r)) return '';
      const k = 8.9875517923e9;
      if (r === 0) return 'Infinite Force (r = 0)';
      return (k * Math.abs(q1 * q2)) / (r * r);
    },
    resultLabel: "Electrostatic Force (F)",
    resultUnit: "N"
  },
  {
    category: 'Physics',
    name: 'Ohm\'s Law Electrical Solver',
    expression: 'V = I * R',
    desc: 'Solves voltage V, or computes respective loads when electrical factors change.',
    tags: ['physics', 'electronics', 'voltage', 'circuit'],
    variables: [
      { name: 'I', label: 'Current (I)', defaultValue: '2', unit: 'A' },
      { name: 'R', label: 'Resistance (R)', defaultValue: '10', unit: 'Ω' }
    ],
    solve: (v) => {
      const I = parseFloat(v.I);
      const R = parseFloat(v.R);
      if (isNaN(I) || isNaN(R)) return '';
      return I * R;
    },
    resultLabel: "Voltage (V)",
    resultUnit: "V"
  },
  {
    category: 'Physics',
    name: 'Kinetic Energy',
    expression: 'KE = 0.5 * m * v^2',
    desc: 'Energy possessed by mass object in motion scaling to velocity squared.',
    tags: ['physics', 'energy', 'kinetic', 'velocity'],
    variables: [
      { name: 'm', label: 'Mass (m)', defaultValue: '5', unit: 'kg' },
      { name: 'v', label: 'Velocity (v)', defaultValue: '10', unit: 'm/s' }
    ],
    solve: (v) => {
      const m = parseFloat(v.m);
      const vVal = parseFloat(v.v);
      if (isNaN(m) || isNaN(vVal)) return '';
      return 0.5 * m * vVal * vVal;
    },
    resultLabel: "Kinetic Energy (KE)",
    resultUnit: "J"
  },
  {
    category: 'Physics',
    name: 'Gravitational Potential Energy',
    expression: 'PE = m * g * h',
    desc: 'Stored mechanical energy of an object based on its height relative to a gravity frame.',
    tags: ['physics', 'energy', 'potential', 'gravity'],
    variables: [
      { name: 'm', label: 'Mass (m)', defaultValue: '2', unit: 'kg' },
      { name: 'h', label: 'Elevation Height (h)', defaultValue: '10', unit: 'm' },
      { name: 'g', label: 'Gravity Acceleration (g)', defaultValue: '9.81', unit: 'm/s²' }
    ],
    solve: (v) => {
      const m = parseFloat(v.m);
      const h = parseFloat(v.h);
      const g = parseFloat(v.g);
      if (isNaN(m) || isNaN(h) || isNaN(g)) return '';
      return m * g * h;
    },
    resultLabel: "Potential Energy (PE)",
    resultUnit: "J"
  },
  {
    category: 'Physics',
    name: 'Wave Velocity propagation',
    expression: 'v = f * λ',
    desc: 'Wavelength lambda times frequency yields total wave velocity propagation.',
    tags: ['physics', 'wave', 'frequency', 'sound', 'optics'],
    variables: [
      { name: 'f', label: 'Frequency (f)', defaultValue: '440', unit: 'Hz' },
      { name: 'lambda', label: 'Wavelength (λ)', defaultValue: '0.78', unit: 'm' }
    ],
    solve: (v) => {
      const f = parseFloat(v.f);
      const lambda = parseFloat(v.lambda);
      if (isNaN(f) || isNaN(lambda)) return '';
      return f * lambda;
    },
    resultLabel: "Velocity (v)",
    resultUnit: "m/s"
  },
  {
    category: 'Physics',
    name: 'Ideal Gas State Law',
    expression: 'P = (n * R * T) / V',
    desc: 'Solves standard gas pressure P given quantity moles, temperature Kelvin, and volume.',
    tags: ['physics', 'gas', 'thermodynamics', 'pressure'],
    variables: [
      { name: 'n', label: 'Gas quantity (n)', defaultValue: '1', unit: 'mol' },
      { name: 'T', label: 'Temperature (T)', defaultValue: '298', unit: 'K' },
      { name: 'V', label: 'Volume (V)', defaultValue: '0.024', unit: 'm³' }
    ],
    solve: (v) => {
      const n = parseFloat(v.n);
      const T = parseFloat(v.T);
      const V = parseFloat(v.V);
      if (isNaN(n) || isNaN(T) || isNaN(V)) return '';
      const R = 8.31446;
      if (V === 0) return 'Infinite Pressure (V = 0)';
      return (n * R * T) / V;
    },
    resultLabel: "Pressure (P)",
    resultUnit: "Pa"
  },
  {
    category: 'Geometry',
    name: 'Circle Area & Circumference',
    expression: 'Area = π * r^2 | Circumference = 2 * π * r',
    desc: 'Calculates the 2D area and outer boundary (circumference) of a circle using radius r.',
    tags: ['geometry', 'circle', 'area', 'perimeter'],
    variables: [
      { name: 'r', label: 'Radius (r)', defaultValue: '5', unit: 'm' }
    ],
    solve: (v) => {
      const r = parseFloat(v.r);
      if (isNaN(r)) return '';
      if (r < 0) return 'Invalid negative radius';
      const area = Math.PI * r * r;
      const circ = 2 * Math.PI * r;
      return `Area: ${area.toFixed(4)} m², Circumference: ${circ.toFixed(4)} m`;
    },
    resultLabel: "Circle Metrics"
  },
  {
    category: 'Geometry',
    name: 'Rectangle Area & Perimeter',
    expression: 'Area = w * h | Perimeter = 2 * (w + h)',
    desc: 'Calculates the 2D surface area and outer boundary perimeter of a rectangle.',
    tags: ['geometry', 'rectangle', 'area', 'perimeter'],
    variables: [
      { name: 'w', label: 'Width (w)', defaultValue: '6', unit: 'm' },
      { name: 'h', label: 'Height (h)', defaultValue: '4', unit: 'm' }
    ],
    solve: (v) => {
      const w = parseFloat(v.w);
      const h = parseFloat(v.h);
      if (isNaN(w) || isNaN(h)) return '';
      if (w < 0 || h < 0) return 'Invalid negative dimension';
      const area = w * h;
      const perim = 2 * (w + h);
      return `Area: ${area.toFixed(4)} m², Perimeter: ${perim.toFixed(4)} m`;
    },
    resultLabel: "Rectangle Metrics"
  },
  {
    category: 'Geometry',
    name: 'Triangle Area',
    expression: 'Area = 0.5 * b * h',
    desc: 'Calculates the planar surface area of a triangle given its base b and height h.',
    tags: ['geometry', 'triangle', 'area'],
    variables: [
      { name: 'b', label: 'Base length (b)', defaultValue: '8', unit: 'm' },
      { name: 'h', label: 'Vertical height (h)', defaultValue: '5', unit: 'm' }
    ],
    solve: (v) => {
      const b = parseFloat(v.b);
      const h = parseFloat(v.h);
      if (isNaN(b) || isNaN(h)) return '';
      if (b < 0 || h < 0) return 'Invalid negative dimension';
      return 0.5 * b * h;
    },
    resultLabel: "Triangle Area",
    resultUnit: "m²"
  },
  {
    category: 'Geometry',
    name: 'Sphere Volume & Surface Area',
    expression: 'Volume = (4/3)*π*r^3 | Surface Area = 4*π*r^2',
    desc: 'Calculates the 3D volume capacity and total outer surface area of a sphere.',
    tags: ['geometry', 'sphere', 'volume', 'surface area'],
    variables: [
      { name: 'r', label: 'Radius (r)', defaultValue: '3', unit: 'm' }
    ],
    solve: (v) => {
      const r = parseFloat(v.r);
      if (isNaN(r)) return '';
      if (r < 0) return 'Invalid negative radius';
      const vol = (4 / 3) * Math.PI * Math.pow(r, 3);
      const sa = 4 * Math.PI * r * r;
      return `Volume: ${vol.toFixed(4)} m³, Surface Area: ${sa.toFixed(4)} m²`;
    },
    resultLabel: "Sphere Metrics"
  },
  {
    category: 'Geometry',
    name: 'Cylinder Volume & Surface Area',
    expression: 'Volume = π * r^2 * h | Surface Area = 2*π*r*(r + h)',
    desc: 'Calculates the 3D volume capacity and total outer surface area of a circular cylinder.',
    tags: ['geometry', 'cylinder', 'volume', 'surface area'],
    variables: [
      { name: 'r', label: 'Base Radius (r)', defaultValue: '2', unit: 'm' },
      { name: 'h', label: 'Height (h)', defaultValue: '6', unit: 'm' }
    ],
    solve: (v) => {
      const r = parseFloat(v.r);
      const h = parseFloat(v.h);
      if (isNaN(r) || isNaN(h)) return '';
      if (r < 0 || h < 0) return 'Invalid negative dimension';
      const vol = Math.PI * r * r * h;
      const sa = 2 * Math.PI * r * (r + h);
      return `Volume: ${vol.toFixed(4)} m³, Surface Area: ${sa.toFixed(4)} m²`;
    },
    resultLabel: "Cylinder Metrics"
  },
  {
    category: 'Geometry',
    name: 'Cone Volume & Surface Area',
    expression: 'Volume = (1/3)*π*r^2*h | Surface Area = π*r*(r + sqrt(r^2 + h^2))',
    desc: 'Calculates the 3D volume capacity and total outer surface area of a circular cone.',
    tags: ['geometry', 'cone', 'volume', 'surface area'],
    variables: [
      { name: 'r', label: 'Base Radius (r)', defaultValue: '3', unit: 'm' },
      { name: 'h', label: 'Height (h)', defaultValue: '4', unit: 'm' }
    ],
    solve: (v) => {
      const r = parseFloat(v.r);
      const h = parseFloat(v.h);
      if (isNaN(r) || isNaN(h)) return '';
      if (r < 0 || h < 0) return 'Invalid negative dimension';
      const vol = (1 / 3) * Math.PI * r * r * h;
      const slant = Math.sqrt(r * r + h * h);
      const sa = Math.PI * r * (r + slant);
      return `Volume: ${vol.toFixed(4)} m³, Surface Area: ${sa.toFixed(4)} m²`;
    },
    resultLabel: "Cone Metrics"
  }
];

export default function FormulaSearch() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('formulas');

  // Interactive filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Solver states
  const [activeFormula, setActiveFormula] = useState(formulaLibrary[0]);
  const [solverInputs, setSolverInputs] = useState({});
  const [solvedValue, setSolvedValue] = useState('');

  // Synchronize inputs when a new formula is selected
  useEffect(() => {
    if (activeFormula) {
      const initial = {};
      activeFormula.variables.forEach(v => {
        initial[v.name] = v.defaultValue;
      });
      setSolverInputs(initial);
    }
  }, [activeFormula]);

  // Compute live solution in real-time as values change
  useEffect(() => {
    if (activeFormula && Object.keys(solverInputs).length > 0) {
      try {
        const val = activeFormula.solve(solverInputs);
        if (typeof val === 'number') {
          // Format standard floats cleanly
          if (Math.abs(val) > 1e6 || (Math.abs(val) < 1e-4 && val !== 0)) {
            setSolvedValue(val.toExponential(5));
          } else {
            setSolvedValue(Number(val.toFixed(6)).toString());
          }
        } else {
          setSolvedValue(val);
        }
      } catch (err) {
        setSolvedValue('Calculation Error');
      }
    } else {
      setSolvedValue('');
    }
  }, [solverInputs, activeFormula]);

  const handleInputChange = (name, value) => {
    setSolverInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
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
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Scientific Formula Library</h2>

      </div>

      {/* Main computational split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '16px',
          flex: 1,
          minHeight: 0
        }}
      >
        {/* Left Side: Library catalog with search and filters */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            background: 'rgba(16, 20, 35, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minHeight: 0
          }}
        >
          {/* Header Search bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sigma size={18} style={{ color: accentColor }} />
              Formulas Lookup
            </h3>

            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search equations, tags, variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '38px', fontSize: '0.82rem', height: '36px' }}
              />
            </div>
          </div>

          {/* Category Filters row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            {['All', 'Calculus', 'Trigonometry', 'Physics', 'Geometry'].map((cat) => {
              const isActive = selectedCategory === cat;
              let chipColor = accentColor;
              if (cat === 'Calculus') chipColor = 'var(--color-basic)';
              else if (cat === 'Trigonometry') chipColor = 'var(--color-chemistry)';
              else if (cat === 'Physics') chipColor = 'var(--color-programmer)';
              else if (cat === 'Geometry') chipColor = 'var(--color-health)';

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
                    background: isActive ? `${chipColor}15` : 'rgba(255,255,255,0.02)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat === 'Calculus' ? 'Calculus (Integrals & Derivatives)' : cat}
                </button>
              );
            })}
          </div>

          {/* Scrollable list catalog */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '12px',
              paddingRight: '4px'
            }}
          >
            {(() => {
              const query = searchQuery.toLowerCase().trim();
              const filtered = formulaLibrary.filter(f => {
                const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
                const matchesSearch = !query ||
                  f.name.toLowerCase().includes(query) ||
                  f.expression.toLowerCase().includes(query) ||
                  f.desc.toLowerCase().includes(query) ||
                  f.tags.some(t => t.toLowerCase().includes(query));
                return matchCat && matchesSearch;
              });

              if (filtered.length === 0) {
                return (
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px', color: 'var(--text-muted)' }}>
                    <Search size={36} style={{ opacity: 0.5 }} />
                    <span style={{ fontSize: '0.85rem' }}>No equations match your search request.</span>
                  </div>
                );
              }

              return filtered.map((f, idx) => {
                let catColor = 'var(--color-basic)'; // Calculus
                if (f.category === 'Trigonometry') catColor = 'var(--color-chemistry)';
                if (f.category === 'Physics') catColor = 'var(--color-programmer)';

                const isSelected = activeFormula?.name === f.name;
                const isCopied = copiedIndex === idx;

                return (
                  <div
                    key={f.name}
                    onClick={() => setActiveFormula(f)}
                    className="glass-panel"
                    style={{
                      padding: '14px',
                      background: isSelected ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.005)',
                      border: isSelected ? `1.5px solid ${accentColor}` : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '10px',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 15px ${accentColor}10` : 'none'
                    }}
                  >
                    <div>
                      {/* Badge and action row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: `${catColor}15`,
                            color: catColor,
                            border: `1px solid ${catColor}20`
                          }}
                        >
                          {f.category}
                        </span>

                        <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleCopy(f.expression, idx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: isCopied ? '#00ff66' : 'var(--text-secondary)',
                              padding: '4px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            className="btn-glow"
                            title="Copy Raw Expression"
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: '8px 0 4px 0' }}>{f.name}</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>{f.desc}</p>
                    </div>

                    {/* Formula text code block */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <code
                        className="math-mono"
                        style={{
                          fontSize: '0.78rem',
                          color: '#fff',
                          padding: '8px 10px',
                          background: 'rgba(0,0,0,0.25)',
                          borderRadius: '6px',
                          display: 'block',
                          borderLeft: `2.5px solid ${catColor}`,
                          wordBreak: 'break-all'
                        }}
                      >
                        {f.expression}
                      </code>

                      {/* Solver active feedback indicator */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {f.tags.slice(0, 2).map(t => (
                            <span key={t} style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: '0.6rem', color: accentColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Play size={8} fill={accentColor} /> SOLVER ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Right Side: Interactive solver panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: 0, boxSizing: 'border-box' }}>
          {activeFormula ? (
            <div
              className="glass-panel"
              style={{
                padding: '24px',
                background: 'rgba(16, 20, 35, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                height: '100%',
                overflowY: 'auto',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 15px ${accentColor}05`
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: accentColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: '4px'
                  }}
                >
                  <Sparkles size={12} />
                  Active Live Calculator
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {activeFormula.name}
                </h3>
              </div>

              {/* Monospace Formula Display */}
              <div
                style={{
                  padding: '14px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <code
                  className="math-mono"
                  style={{
                    fontSize: '1.05rem',
                    color: '#fff',
                    wordBreak: 'break-all',
                    fontWeight: 700
                  }}
                >
                  {activeFormula.expression}
                </code>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Formula Definition</span>
              </div>

              {/* Dynamic Inputs grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Adjust Parameters
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeFormula.variables.map(v => (
                    <div
                      key={v.name}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {v.label}
                        </label>
                        <code className="math-mono" style={{ fontSize: '0.78rem', color: accentColor, fontWeight: 700 }}>
                          {v.name} {v.unit ? `(${v.unit})` : ''}
                        </code>
                      </div>

                      <input
                        type="number"
                        value={solverInputs[v.name] ?? ''}
                        onChange={(e) => handleInputChange(v.name, e.target.value)}
                        className="glass-input math-mono"
                        style={{
                          width: '100%',
                          fontSize: '0.9rem',
                          padding: '6px 10px',
                          background: 'rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlighted Solution Glow panel */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(5, 7, 12, 0.5)',
                  borderRadius: '12px',
                  border: `1.5px solid rgba(157, 255, 0, 0.15)`,
                  boxShadow: `0 0 20px rgba(157, 255, 0, 0.03)`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: 'center'
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}
                >
                  {activeFormula.resultLabel} {activeFormula.resultUnit ? `(${activeFormula.resultUnit})` : ''}
                </span>

                <span
                  className="math-mono"
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: '#fff',
                    textShadow: `0 0 15px ${accentColor}20`,
                    wordBreak: 'break-all'
                  }}
                >
                  {solvedValue || '0'}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="glass-panel flex-center"
              style={{
                padding: '24px',
                background: 'rgba(16, 20, 35, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '12px',
                color: 'var(--text-muted)',
                height: '100%',
                minHeight: '320px'
              }}
            >
              <HelpCircle size={42} style={{ opacity: 0.3 }} />
              <span style={{ fontSize: '0.85rem' }}>Select any formula card from the library to open its solver sandbox</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
