// Math Parser Utility for OmniCalc
// Implements a powerful, safe expression evaluator with custom variable support and standard scientific functions/constants.

const SCIENTIFIC_CONSTANTS = {
  pi: Math.PI,
  e: Math.E, // Euler's number (2.71828)
  qe: 1.602176634e-19, // Elementary charge (mapped to qe to avoid conflict with e)
  e_charge: 1.602176634e-19,
  
  // 40 Scientific Constants (Casio fx-991ES standard CODATA values)
  mp: 1.672621898e-27,        // 01: Proton mass (kg)
  mn: 1.674927471e-27,        // 02: Neutron mass (kg)
  me: 9.10938356e-31,         // 03: Electron mass (kg)
  mmu: 1.883531594e-28,       // 04: Muon mass (kg)
  m_mu: 1.883531594e-28,
  a0: 5.2917721067e-11,       // 05: Bohr radius (m)
  ao: 5.2917721067e-11,
  h: 6.62607015e-34,          // 06: Planck constant (J·s)
  muN: 5.050783697e-27,       // 07: Nuclear magneton (J/T)
  mu_N: 5.050783697e-27,
  muB: 9.274009994e-24,       // 08: Bohr magneton (J/T)
  mu_B: 9.274009994e-24,
  hbar: 1.054571817e-34,      // 09: Rationalized Planck constant (J·s)
  alpha: 7.2973525664e-3,     // 10: Fine-structure constant
  re: 2.8179403227e-15,       // 11: Classical electron radius (m)
  lambdac: 2.4263102367e-12,  // 12: Compton wavelength (m)
  lambda_c: 2.4263102367e-12,
  gammap: 267522189.78,       // 13: Proton gyromagnetic ratio (s^-1 T^-1)
  gamma_p: 267522189.78,
  lambdacp: 1.321409854e-15,  // 14: Proton Compton wavelength (m)
  lambda_cp: 1.321409854e-15,
  lambdacn: 1.3195909048e-15, // 15: Neutron Compton wavelength (m)
  lambda_cn: 1.3195909048e-15,
  Rinf: 10973731.568508,      // 16: Rydberg constant (m^-1)
  R_inf: 10973731.568508,
  u: 1.66053904e-27,          // 17: Atomic mass unit (kg)
  mup: 1.4106067873e-26,      // 18: Proton magnetic moment (J/T)
  mu_p: 1.4106067873e-26,
  mue: -9.28476462e-24,       // 19: Electron magnetic moment (J/T)
  mu_e: -9.28476462e-24,
  mun: -9.662365e-27,         // 20: Neutron magnetic moment (J/T)
  mu_n: -9.662365e-27,
  munn: -9.662365e-27,
  mumu: -4.49044807e-26,      // 21: Muon magnetic moment (J/T)
  mu_mu: -4.49044807e-26,
  F: 96485.33289,             // 22: Faraday constant (C/mol)
  f: 96485.33289,
  Na: 6.02214076e23,          // 24: Avogadro constant (mol^-1)
  na: 6.02214076e23,
  k: 1.380649e-23,            // 25: Boltzmann constant (J/K)
  kb: 1.380649e-23,
  Vm: 0.0224139695,           // 26: Molar volume of ideal gas (m^3/mol)
  vm: 0.0224139695,
  R: 8.314462618,             // 27: Molar gas constant (J/(mol·K))
  r: 8.314462618,
  c0: 299792458,              // 28: Speed of light in vacuum (m/s)
  c: 299792458,
  co: 299792458,
  Co: 299792458,
  C1: 3.741771852e-16,        // 29: First radiation constant (W·m^2)
  c1: 3.741771852e-16,
  C2: 0.0143877687,           // 30: Second radiation constant (m·K)
  c2: 0.0143877687,
  sigma: 5.670374419e-8,      // 31: Stefan-Boltzmann constant (W/(m^2·K^4))
  epsilon0: 8.8541878128e-12, // 32: Vacuum electric permittivity (F/m)
  eps0: 8.8541878128e-12,
  mu0: 1.25663706212e-6,      // 33: Vacuum magnetic permeability (H/m)
  phi0: 2.067833831e-15,      // 34: Magnetic flux quantum (Wb)
  g: 9.80665,                 // 35: Standard gravity (m/s^2)
  G0: 7.748091731e-5,         // 36: Conductance quantum (S)
  g0: 7.748091731e-5,
  Go: 7.748091731e-5,
  Z0: 376.730313461,          // 37: Characteristic impedance of vacuum (ohm)
  z0: 376.730313461,
  zo: 376.730313461,
  Zo: 376.730313461,
  t: 273.15,                  // 38: Celsius temperature standard (K)
  G: 6.67430e-11,             // 39: Newtonian constant of gravitation (m^3/(kg·s^2))
  atm: 101325                 // 40: Standard atmosphere (Pa)
};

// Factorial helper
function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (!Number.isInteger(n)) {
    // Gamma function approximation for non-integers (optional, fallback to integer part)
    n = Math.floor(n);
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Tokenizes mathematical strings
export function tokenize(str) {
  const tokens = [];
  let i = 0;
  
  while (i < str.length) {
    const char = str[i];
    
    // Skip spaces
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    
    // Numbers (including decimals and scientific notation like 1e-5)
    if (/\d/.test(char) || (char === '.' && /\d/.test(str[i + 1]))) {
      let numStr = '';
      while (i < str.length && (/\d/.test(str[i]) || str[i] === '.' || str[i] === 'e' || (str[i] === '-' && str[i-1] === 'e') || (str[i] === '+' && str[i-1] === 'e'))) {
        numStr += str[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(numStr), raw: numStr });
      continue;
    }
    
    // Words (Variables, constants, functions)
    if (/[a-zA-Z]/.test(char)) {
      let wordStr = '';
      while (i < str.length && /[a-zA-Z0-9]/.test(str[i])) {
        wordStr += str[i];
        i++;
      }
      tokens.push({ type: 'WORD', value: wordStr });
      continue;
    }
    
    // Operators & delimiters
    if ('+-*/%^(),!'.includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }
    
    // Unknown characters
    i++;
  }
  return tokens;
}

// Parse and evaluate with a recursive descent parser
export function evaluateExpression(expressionStr, variables = {}, angleMode = 'deg') {
  try {
    // Sanitize string
    let str = expressionStr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi');
      
    // Handle implicit multiplication: e.g., "2pi" -> "2*pi", "4(5)" -> "4*(5)", "x sin(x)" -> "x*sin(x)"
    const tokens = tokenize(str);
    const parsedTokens = [];
    
    for (let k = 0; k < tokens.length; k++) {
      parsedTokens.push(tokens[k]);
      if (k < tokens.length - 1) {
        const curr = tokens[k];
        const next = tokens[k + 1];
        
        // Number followed by word or parenthesis (e.g. 2pi, 2(3))
        if ((curr.type === 'NUMBER' && (next.type === 'WORD' || (next.type === 'OPERATOR' && next.value === '('))) ||
            (curr.type === 'WORD' && next.type === 'NUMBER') ||
            (curr.type === 'WORD' && next.type === 'WORD' && !isFunction(curr.value)) ||
            (curr.type === 'OPERATOR' && curr.value === ')' && next.type === 'NUMBER') ||
            (curr.type === 'OPERATOR' && curr.value === ')' && next.type === 'WORD') ||
            (curr.type === 'OPERATOR' && curr.value === ')' && next.type === 'OPERATOR' && next.value === '(')) {
          parsedTokens.push({ type: 'OPERATOR', value: '*' });
        }
      }
    }

    let tokenIndex = 0;
    
    function peek() {
      return parsedTokens[tokenIndex];
    }
    
    function consume(expectedValue) {
      const token = peek();
      if (!token) throw new Error("Unexpected end of expression");
      if (expectedValue !== undefined && token.value !== expectedValue) {
        throw new Error(`Expected ${expectedValue} but found ${token.value}`);
      }
      tokenIndex++;
      return token;
    }
    
    function isFunction(name) {
      return ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'ln', 'log', 'sqrt', 'abs', 'exp', 'log10'].includes(name.toLowerCase());
    }

    // AST Nodes Parsers
    function parseExpression() {
      return parseAddition();
    }

    function parseAddition() {
      let node = parseMultiplication();
      while (peek() && peek().type === 'OPERATOR' && (peek().value === '+' || peek().value === '-')) {
        const op = consume().value;
        const right = parseMultiplication();
        const left = node;
        node = () => {
          const l = left();
          const r = right();
          return op === '+' ? l + r : l - r;
        };
      }
      return node;
    }

    function parseMultiplication() {
      let node = parseExponentiation();
      while (peek() && peek().type === 'OPERATOR' && (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
        const op = consume().value;
        const right = parseExponentiation();
        const left = node;
        node = () => {
          const l = left();
          const r = right();
          if (op === '*') return l * r;
          if (op === '/') return l / r;
          return l % r;
        };
      }
      return node;
    }

    function parseExponentiation() {
      let node = parseUnary();
      while (peek() && peek().type === 'OPERATOR' && peek().value === '^') {
        consume();
        const right = parseExponentiation(); // right associative
        const left = node;
        node = () => Math.pow(left(), right());
      }
      return node;
    }

    function parseUnary() {
      if (peek() && peek().type === 'OPERATOR' && peek().value === '-') {
        consume();
        const expr = parseUnary();
        return () => -expr();
      }
      if (peek() && peek().type === 'OPERATOR' && peek().value === '+') {
        consume();
        return parseUnary();
      }
      return parseFactorial();
    }

    function parseFactorial() {
      let node = parsePrimary();
      while (peek() && peek().type === 'OPERATOR' && peek().value === '!') {
        consume();
        const baseNode = node;
        node = () => factorial(baseNode());
      }
      return node;
    }

    function parsePrimary() {
      const token = peek();
      if (!token) throw new Error("Unexpected end of expression");
      
      if (token.type === 'NUMBER') {
        consume();
        return () => token.value;
      }
      
      if (token.type === 'OPERATOR' && token.value === '(') {
        consume('(');
        const expr = parseExpression();
        consume(')');
        return expr;
      }
      
      if (token.type === 'WORD') {
        const name = token.value;
        consume();
        
        // Check if it is a function call
        if (isFunction(name)) {
          consume('(');
          const arg = parseExpression();
          consume(')');
          
          return () => {
            const val = arg();
            const lowerName = name.toLowerCase();
            
            // Handle degrees vs radians for trigonometry
            const trigArg = (val) => {
              if (angleMode === 'deg') {
                return val * (Math.PI / 180);
              }
              return val;
            };
            
            const inverseTrigResult = (val) => {
              if (angleMode === 'deg') {
                return val * (180 / Math.PI);
              }
              return val;
            };

            switch (lowerName) {
              case 'sin': return Math.sin(trigArg(val));
              case 'cos': return Math.cos(trigArg(val));
              case 'tan': return Math.tan(trigArg(val));
              case 'asin': return inverseTrigResult(Math.asin(val));
              case 'acos': return inverseTrigResult(Math.acos(val));
              case 'atan': return inverseTrigResult(Math.atan(val));
              case 'sinh': return Math.sinh(val);
              case 'cosh': return Math.cosh(val);
              case 'tanh': return Math.tanh(val);
              case 'ln': return Math.log(val);
              case 'log':
              case 'log10': return Math.log10(val);
              case 'sqrt': return Math.sqrt(val);
              case 'abs': return Math.abs(val);
              case 'exp': return Math.exp(val);
              default: throw new Error(`Unknown function: ${name}`);
            }
          };
        }
        
        // It's a variable or constant
        return () => {
          const lowerName = name.toLowerCase();
          
          // Check variables first
          if (variables[name] !== undefined) {
            return parseFloat(variables[name]);
          }
          if (variables[lowerName] !== undefined) {
            return parseFloat(variables[lowerName]);
          }
          
          // Check scientific constants
          if (SCIENTIFIC_CONSTANTS[name] !== undefined) {
            return SCIENTIFIC_CONSTANTS[name];
          }
          if (SCIENTIFIC_CONSTANTS[lowerName] !== undefined) {
            return SCIENTIFIC_CONSTANTS[lowerName];
          }
          
          throw new Error(`Undefined variable or constant: ${name}`);
        };
      }
      
      throw new Error(`Unexpected token: ${token.value}`);
    }

    const astEval = parseExpression();
    if (tokenIndex < parsedTokens.length) {
      throw new Error("Could not parse entire expression. Check operators.");
    }
    
    const result = astEval();
    if (isNaN(result)) return NaN;
    if (!isFinite(result)) return Infinity;
    return result;
  } catch (error) {
    throw error;
  }
}
