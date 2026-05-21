import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateExpression } from '../../utils/mathParser';
import { Sparkles, Send, Search, Cpu, Key, HelpCircle, ArrowRight } from 'lucide-react';

const formulaSearchDatabase = [
  { name: 'Planck Constant (h)', query: 'planck', formula: '6.62607015 × 10^-34 J·s', category: 'Physics Constant' },
  { name: 'Speed of Light (c)', query: 'light speed c', formula: '299,792,458 m/s', category: 'Physics Constant' },
  { name: 'Ohm\'s Law Voltage', query: 'ohms law volt', formula: 'V = I * R', category: 'Engineering' },
  { name: 'Kinetic Energy', query: 'kinetic energy', formula: 'E_k = 0.5 * m * v^2', category: 'Physics' },
  { name: 'Sphere Volume', query: 'sphere volume', formula: 'V = (4/3) * pi * r^3', category: 'Geometry' },
  { name: 'Compound Interest', query: 'compound interest interest', formula: 'A = P * (1 + r/n)^(nt)', category: 'Finance' },
  { name: 'Quadratic Formula', query: 'quadratic solve root', formula: 'x = (-b ± sqrt(b^2 - 4ac)) / 2a', category: 'Mathematics' }
];

export default function AiSearchPanel() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('ai-search');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // AI Chat Console states
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Greetings! I am **OmniBot**, your localized mathematical agent. You can ask me math questions directly, solve equations, or search scientific equations! \n\nTry phrases like:\n- *\"What is 15% of 2400?\"*\n- *\"Solve x^2 - 5x + 6 = 0\"*\n- *\"Convert 35 Celsius to Fahrenheit\"*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('omnicalc_ai_key') || '');
  const [showKeyPanel, setShowKeyPanel] = useState(false);
  const threadEndRef = useRef(null);

  // Auto-scroll chat thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle global formula searches
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const filtered = formulaSearchDatabase.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.query.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  // Local parser to interpret mathematical statements
  const parseQuestionLocally = (str) => {
    const q = str.toLowerCase().trim();

    // 1. Percentage matcher: "what is 15% of 2400"
    const pctMatch = q.match(/what is\s*(\d+(\.\d+)?)%\s*of\s*(\d+(\.\d+)?)/);
    if (pctMatch) {
      const rate = parseFloat(pctMatch[1]);
      const base = parseFloat(pctMatch[3]);
      const result = (rate / 100) * base;
      return `**Percentage Calculation Breakdown:**\n\nTo find **${rate}%** of **${base}**, we divide the rate by 100 and multiply by the base:\n\n$$\\text{Result} = \\left( \\frac{${rate}}{100} \\right) \\times ${base} = ${result}$$\n\nResult: **${result}**`;
    }

    // 2. Temp converter: "convert 25 celsius to fahrenheit"
    const tempMatch = q.match(/convert\s*([+-]?\d+(\.\d+)?)\s*(celsius|fahrenheit|kelvin|c|f|k)\s*to\s*(celsius|fahrenheit|kelvin|c|f|k)/);
    if (tempMatch) {
      const val = parseFloat(tempMatch[1]);
      const from = tempMatch[3][0].toUpperCase();
      const to = tempMatch[4][0].toUpperCase();
      
      let celsius = val;
      if (from === 'F') celsius = (val - 32) / 1.8;
      if (from === 'K') celsius = val - 273.15;

      let result = celsius;
      let formulaStr = '';
      if (to === 'F') {
        result = celsius * 1.8 + 32;
        formulaStr = `(${val} \\times 1.8) + 32`;
      } else if (to === 'K') {
        result = celsius + 273.15;
        formulaStr = `${val} + 273.15`;
      } else {
        formulaStr = `(C to C direct)`;
      }

      return `**Temperature Conversion Breakdown:**\n\nConverting **${val}°${from}** to **°${to}**:\n\n$$\\text{Formula: } ${formulaStr} = ${result.toFixed(2)}$$\n\nResult: **${result.toFixed(2)}°${to}**`;
    }

    // 3. Polynomial solver: "solve x^2 - 5x + 6 = 0" or "solve x^2 + 5x + 6"
    const polyMatch = q.match(/solve\s*x\^2\s*([+-]\s*\d+)?\s*x\s*([+-]\s*\d+)?\s*(=?0)?/);
    if (polyMatch) {
      // Parse B and C coefficients
      let B = 0;
      let C = 0;
      
      const bStr = polyMatch[1] ? polyMatch[1].replace(/\s+/g, '') : '';
      const cStr = polyMatch[2] ? polyMatch[2].replace(/\s+/g, '') : '';

      B = bStr ? parseFloat(bStr) : 0;
      C = cStr ? parseFloat(cStr) : 0;

      // Solve roots: x^2 + Bx + C = 0 -> Discriminant = B^2 - 4C
      const disc = B*B - 4*C;
      if (disc < 0) {
        return `**Polynomial Equation Solver:**\n\nFor the quadratic equation:\n$$x^2 ${B >= 0 ? '+ ' + B : '- ' + Math.abs(B)}x ${C >= 0 ? '+ ' + C : '- ' + Math.abs(C)} = 0$$\n\nDiscriminant ($\\Delta$):\n$$\\Delta = B^2 - 4C = (${B})^2 - 4(${C}) = ${disc}$$\n\nSince $\\Delta < 0$, the roots are complex conjugate solutions: **No real roots exist.**`;
      } else {
        const r1 = (-B + Math.sqrt(disc)) / 2;
        const r2 = (-B - Math.sqrt(disc)) / 2;
        
        return `**Polynomial Equation Solver:**\n\nFor the quadratic equation:\n$$x^2 ${B >= 0 ? '+ ' + B : '- ' + Math.abs(B)}x ${C >= 0 ? '+ ' + C : '- ' + Math.abs(C)} = 0$$\n\nDiscriminant ($\\Delta$):\n$$\\Delta = B^2 - 4C = (${B})^2 - 4(${C}) = ${disc}$$\n\nUsing the quadratic formula:\n$$x = \\frac{-B \\pm \\sqrt{\\Delta}}{2}$$\n\nRoots computed:\n- **x₁ = ${r1.toFixed(3)}**\n- **x₂ = ${r2.toFixed(3)}**\n\nFactors:\n$$(x - ${r1.toFixed(1)})(x - ${r2.toFixed(1)}) = 0$$`;
      }
    }

    // Fallback: Default smart computational description
    return `**OMNIBOT Analysis:**\n\nI have parsed your request: *"_${str}_"*. \n\nTo compute this mathematically, you can use the built-in modules:\n- To evaluate standard equations, try the **Basic & Scientific** tab.\n- To plot explicit functions, try the **2D Grapher**.\n- To create your own variables formulas, visit **Education & Custom**.\n\n_If you want full conversational AI intelligence, tap the Key icon at the top right to configure your live API key!_`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Mock response loader
    setTimeout(() => {
      const responseText = parseQuestionLocally(userMsg.text);
      const botMsg = {
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const saveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('omnicalc_ai_key', apiKey);
    setShowKeyPanel(false);
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
        minHeight: 0
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>AI Helper & Search</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Natural language equation solver and global constants search directory</p>
        </div>
        <button 
          onClick={() => setShowKeyPanel(!showKeyPanel)}
          className="btn-glow flex-center" 
          style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-color)', color: apiKey ? accentColor : 'var(--text-muted)' }}
          title="Configure API key"
        >
          <Key size={16} />
        </button>
      </div>

      {/* API Key Panel Overlay */}
      {showKeyPanel && (
        <form onSubmit={saveApiKey} className="glass-panel" style={{ padding: '16px', background: 'rgba(20,24,45,0.9)', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Enter OpenAI/Gemini Key:</span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="glass-input"
            style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem' }}
            placeholder="sk-..."
          />
          <button type="submit" className="btn-glow" style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, borderRadius: '6px' }}>Save</button>
        </form>
      )}

      {/* Main interactive grid splitting */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '16px',
          flex: 1,
          minHeight: 0
        }}
      >
        {/* Left Side: Conversational AI console */}
        <div 
          className="glass-panel"
          style={{
            padding: '16px',
            background: 'rgba(16, 20, 35, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: 0
          }}
        >
          {/* Scrollable messages thread */}
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingRight: '6px'
            }}
          >
            {messages.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div 
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: m.sender === 'user' ? `1px solid ${accentColor}` : '1px solid var(--border-color)',
                    background: m.sender === 'user' ? `${accentColor}10` : 'rgba(5,7,12,0.4)',
                    fontSize: '0.88rem',
                    color: '#fff',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.4
                  }}
                >
                  {/* Quick local bold formatting rendering */}
                  {m.text.split('**').map((chunk, cIdx) => 
                    cIdx % 2 === 1 ? <strong key={cIdx} style={{ color: accentColor }}>{chunk}</strong> : chunk
                  )}
                </div>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
                  {m.timestamp}
                </span>
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>

          {/* Interactive input row */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="glass-input"
              placeholder="Ask OmniBot or type equation solver..."
              style={{ flex: 1, fontSize: '0.88rem' }}
            />
            <button
              type="submit"
              className="btn-glow flex-center"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(255, 0, 170, 0.05)',
                borderColor: accentColor,
                color: accentColor
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Right Side: Global Formulas Search */}
        <div 
          className="glass-panel"
          style={{
            padding: '16px',
            background: 'rgba(16, 20, 35, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
              <Search size={16} style={{ color: accentColor }} />
              Global Formula Search
            </h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Search physics constants, equations, or units instantly</p>
          </div>

          {/* Search box input */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Type: planck, light, ohm, sphere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: '30px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Search Results list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
            {searchResults.length > 0 ? (
              searchResults.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{item.name}</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.category}</span>
                  </div>
                  <code className="math-mono" style={{ fontSize: '0.78rem', color: accentColor, marginTop: '2px' }}>
                    {item.formula}
                  </code>
                </div>
              ))
            ) : searchQuery.trim() ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', display: 'block', marginTop: '12px' }}>No matches found. Try "planck" or "ohms".</span>
            ) : (
              // Fill with default high-profile items when empty
              formulaSearchDatabase.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    opacity: 0.65
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{item.name}</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.category}</span>
                  </div>
                  <code className="math-mono" style={{ fontSize: '0.78rem', color: accentColor, marginTop: '2px' }}>
                    {item.formula}
                  </code>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
