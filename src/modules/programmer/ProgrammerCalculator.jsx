import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Binary, Cpu, Copy, Check, Lock, Shield, Code, Repeat } from 'lucide-react';

export default function ProgrammerCalculator() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('programmer');
  
  // Tab control state: base, regex, password, rot13
  const [activeTab, setActiveTab] = useState('regex');

  // ─── TAB 1: BASE CONVERTER STATE ──────────────────────────────────────────
  const [val, setVal] = useState(42); 
  const [inputs, setInputs] = useState({
    DEC: '42',
    HEX: '2A',
    OCT: '52',
    BIN: '101010'
  });

  // Re-synchronize inputs whenever numerical value changes
  useEffect(() => {
    setInputs({
      DEC: val.toString(10),
      HEX: val.toString(16).toUpperCase(),
      OCT: val.toString(8),
      BIN: val.toString(2)
    });
  }, [val]);

  const handleInputChange = (text, base) => {
    let sanitized = text;
    let baseVal = 10;
    
    if (base === 'DEC') {
      sanitized = text.replace(/[^0-9]/g, '');
      baseVal = 10;
    } else if (base === 'HEX') {
      sanitized = text.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
      baseVal = 16;
    } else if (base === 'OCT') {
      sanitized = text.replace(/[^0-7]/g, '');
      baseVal = 8;
    } else if (base === 'BIN') {
      sanitized = text.replace(/[^0-1]/g, '');
      baseVal = 2;
    }

    setInputs(prev => ({ ...prev, [base]: sanitized }));

    if (!sanitized) {
      setVal(0);
      return;
    }

    const parsed = parseInt(sanitized, baseVal);
    if (!isNaN(parsed)) {
      setVal(parsed >>> 0);
    }
  };

  const toggleBit = (bitIndex) => {
    const mask = 1 << bitIndex;
    const newVal = (val ^ mask) >>> 0;
    setVal(newVal);
  };

  const runBitwise = (op, operand) => {
    let result = val;
    switch (op) {
      case 'AND': result = val & operand; break;
      case 'OR': result = val | operand; break;
      case 'XOR': result = val ^ operand; break;
      case 'NOT': result = ~val; break;
      case 'SHL': result = val << 1; break;
      case 'SHR': result = val >>> 1; break;
      default: break;
    }
    setVal(result >>> 0);
  };

  const renderBits = () => {
    const bytes = [];
    for (let b = 3; b >= 0; b--) {
      const bitRow = [];
      for (let i = 7; i >= 0; i--) {
        const bitIdx = b * 8 + i;
        const isSet = (val & (1 << bitIdx)) !== 0;
        
        bitRow.push(
          <div
            key={bitIdx}
            onClick={() => toggleBit(bitIdx)}
            style={{
              width: '26px',
              height: '32px',
              borderRadius: '4px',
              border: isSet ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.04)',
              background: isSet ? `${accentColor}15` : 'rgba(255,255,255,0.01)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '2px 0',
              transition: 'all var(--transition-fast)'
            }}
            className="btn-glow"
            title={`Bit ${bitIdx}`}
          >
            <span style={{ fontSize: '0.45rem', color: 'var(--text-muted)' }}>{bitIdx}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isSet ? accentColor : 'var(--text-secondary)' }}>
              {isSet ? '1' : '0'}
            </span>
          </div>
        );
      }
      
      bytes.push(
        <div 
          key={b} 
          style={{ 
            display: 'flex', 
            gap: '3px', 
            padding: '8px', 
            background: 'rgba(255,255,255,0.01)', 
            borderRadius: '6px', 
            border: '1px solid rgba(255,255,255,0.02)'
          }}
        >
          {bitRow}
        </div>
      );
    }
    return bytes;
  };

  const bitwiseOps = [
    { label: 'AND 0xFF', action: () => runBitwise('AND', 0xFF) },
    { label: 'OR 0x0F', action: () => runBitwise('OR', 0x0F) },
    { label: 'XOR 0xF0', action: () => runBitwise('XOR', 0xF0) },
    { label: 'NOT (~)', action: () => runBitwise('NOT') },
    { label: 'LSH (<< 1)', action: () => runBitwise('SHL') },
    { label: 'RSH (>> 1)', action: () => runBitwise('SHR') },
    { label: 'CLEAR (0)', action: () => setVal(0) },
    { label: 'INVERT', action: () => setVal((~val) >>> 0) }
  ];

  // ─── TAB 2: REGEX EXPRESSION BUILDER STATE ──────────────────────────────────
  const [testText, setTestText] = useState(
    'Contact us at support@antigravity-ai.com or admin@domain.org.\n' +
    'Launch date is 2026-05-21! Visited https://google.com and http://localhost:5173.'
  );
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [globalFlag, setGlobalFlag] = useState(true);
  const [caseFlag, setCaseFlag] = useState(true);
  const [multilineFlag, setMultilineFlag] = useState(false);
  const [copiedRegex, setCopiedRegex] = useState(false);

  // Helper builder states
  const [rulePrefix, setRulePrefix] = useState(false);
  const [ruleSuffix, setRuleSuffix] = useState(false);
  const [ruleContentType, setRuleContentType] = useState('letters'); // letters, digits, whitespace, alphanumeric, custom
  const [ruleCustomContent, setRuleCustomContent] = useState('a-z');
  const [ruleQuantifier, setRuleQuantifier] = useState('atleast1'); // atleast1, optional, zero_or_more, exactly, range
  const [ruleExactCount, setRuleExactCount] = useState('3');
  const [ruleRangeMin, setRuleRangeMin] = useState('2');
  const [ruleRangeMax, setRuleRangeMax] = useState('5');

  // Trigger builder whenever helper rules change
  useEffect(() => {
    let charClass = '';
    if (ruleContentType === 'letters') charClass = '[a-zA-Z]';
    else if (ruleContentType === 'digits') charClass = '\\d';
    else if (ruleContentType === 'whitespace') charClass = '\\s';
    else if (ruleContentType === 'alphanumeric') charClass = '[a-zA-Z0-9]';
    else charClass = ruleCustomContent ? `[${ruleCustomContent}]` : '.';

    let quant = '';
    if (ruleQuantifier === 'atleast1') quant = '+';
    else if (ruleQuantifier === 'optional') quant = '?';
    else if (ruleQuantifier === 'zero_or_more') quant = '*';
    else if (ruleQuantifier === 'exactly') quant = `{${ruleExactCount}}`;
    else quant = `{${ruleRangeMin},${ruleRangeMax}}`;

    const pref = rulePrefix ? '^' : '';
    const suff = ruleSuffix ? '$' : '';

    setRegexPattern(pref + charClass + quant + suff);
  }, [rulePrefix, ruleSuffix, ruleContentType, ruleCustomContent, ruleQuantifier, ruleExactCount, ruleRangeMin, ruleRangeMax]);

  const loadRegexPreset = (type) => {
    if (type === 'email') {
      setRegexPattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
    } else if (type === 'url') {
      setRegexPattern('https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)');
    } else if (type === 'ip') {
      setRegexPattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)');
    } else if (type === 'phone') {
      setRegexPattern('\\+?\\(?[0-9]{3}\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}');
    } else if (type === 'date') {
      setRegexPattern('\\d{4}-\\d{2}-\\d{2}');
    } else if (type === 'alphanumeric') {
      setRegexPattern('[a-zA-Z0-9]+');
    }
  };

  const getRegexMatches = () => {
    if (!regexPattern) return [];
    try {
      const flags = (globalFlag ? 'g' : '') + (caseFlag ? 'i' : '') + (multilineFlag ? 'm' : '');
      const regex = new RegExp(regexPattern, flags);
      const matches = [];
      let match;
      
      if (globalFlag) {
        regex.lastIndex = 0;
        let safety = 0;
        while ((match = regex.exec(testText)) !== null && safety < 1000) {
          safety++;
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      return matches;
    } catch (e) {
      return { err: e.message };
    }
  };

  const regexMatches = getRegexMatches();
  const isRegexValid = !(regexMatches && regexMatches.err);

  const renderHighlightedText = () => {
    if (!regexPattern || !isRegexValid) return testText;
    try {
      const flags = (globalFlag ? 'g' : '') + (caseFlag ? 'i' : '') + (multilineFlag ? 'm' : '');
      const regex = new RegExp(regexPattern, flags);
      
      if (!globalFlag) {
        const match = regex.exec(testText);
        if (!match) return testText;
        const start = match.index;
        const end = start + match[0].length;
        return (
          <>
            {testText.slice(0, start)}
            <mark style={{ background: 'rgba(0,240,255,0.3)', color: '#00f0ff', border: '1px solid rgba(0,240,255,0.6)', borderRadius: '3px', padding: '1px 2px', textShadow: '0 0 6px rgba(0,240,255,0.4)' }}>
              {match[0]}
            </mark>
            {testText.slice(end)}
          </>
        );
      }
      
      const elements = [];
      let lastIndex = 0;
      let match;
      let safety = 0;
      regex.lastIndex = 0;
      
      while ((match = regex.exec(testText)) !== null && safety < 1000) {
        safety++;
        const start = match.index;
        const end = start + match[0].length;
        
        if (start > lastIndex) {
          elements.push(testText.slice(lastIndex, start));
        }
        
        elements.push(
          <mark key={`m-${start}-${safety}`} style={{ background: 'rgba(0,255,102,0.22)', color: '#00ff66', border: '1px solid rgba(0,255,102,0.4)', borderRadius: '3px', padding: '1px 2px', textShadow: '0 0 8px rgba(0,255,102,0.3)', margin: '0 1px' }}>
            {match[0]}
          </mark>
        );
        
        lastIndex = end;
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
      
      if (lastIndex < testText.length) {
        elements.push(testText.slice(lastIndex));
      }
      
      return elements.length > 0 ? elements : testText;
    } catch (e) {
      return testText;
    }
  };

  const copyRegexToClipboard = () => {
    const pattern = `/${regexPattern}/${(globalFlag ? 'g' : '') + (caseFlag ? 'i' : '') + (multilineFlag ? 'm' : '')}`;
    navigator.clipboard.writeText(pattern);
    setCopiedRegex(true);
    setTimeout(() => setCopiedRegex(false), 2000);
  };

  // ─── TAB 3: PASSWORD GENERATOR STATE ────────────────────────────────────────
  const [pwdLength, setPwdLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeSpecific, setExcludeSpecific] = useState('');
  const [password, setPassword] = useState('');
  const [copiedPwd, setCopiedPwd] = useState(false);

  const generatePassword = () => {
    let pool = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (includeUpper) pool += upper;
    if (includeLower) pool += lower;
    if (includeNumbers) pool += numbers;
    if (includeSymbols) pool += symbols;
    
    if (excludeSimilar) {
      const sim = /[ilI1o0O\|]/g;
      pool = pool.replace(sim, '');
    }
    
    if (excludeSpecific) {
      for (const c of excludeSpecific) {
        pool = pool.split(c).join('');
      }
    }
    
    if (pool.length === 0) {
      setPassword('Select character sets');
      return;
    }
    
    let generated = '';
    const cryptoObj = window.crypto || window.msCrypto;
    
    if (cryptoObj) {
      const array = new Uint32Array(pwdLength);
      cryptoObj.getRandomValues(array);
      for (let i = 0; i < pwdLength; i++) {
        generated += pool[array[i] % pool.length];
      }
    } else {
      for (let i = 0; i < pwdLength; i++) {
        generated += pool[Math.floor(Math.random() * pool.length)];
      }
    }
    
    setPassword(generated);
  };

  useEffect(() => {
    if (activeTab === 'password') generatePassword();
  }, [pwdLength, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar, excludeSpecific, activeTab]);

  const copyPwdToClipboard = () => {
    if (!password || password.startsWith('Select')) return;
    navigator.clipboard.writeText(password);
    setCopiedPwd(true);
    setTimeout(() => setCopiedPwd(false), 2000);
  };

  // Dynamic Entropy calculation
  const getPasswordEntropy = () => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 26;
    if (excludeSimilar) poolSize -= 7;
    if (excludeSpecific) poolSize = Math.max(1, poolSize - excludeSpecific.length);
    
    if (poolSize <= 0) return 0;
    const entropy = pwdLength * Math.log2(poolSize);
    return Math.round(entropy);
  };

  const entropy = getPasswordEntropy();

  const getStrengthMeta = (ent) => {
    if (ent < 40) return { label: 'Weak', color: '#ff3366', shadow: 'rgba(255,51,102,0.4)', pct: 25 };
    if (ent >= 40 && ent < 60) return { label: 'Medium', color: '#fbbf24', shadow: 'rgba(251,191,36,0.4)', pct: 50 };
    if (ent >= 60 && ent < 80) return { label: 'Strong', color: '#00ff66', shadow: 'rgba(0,255,102,0.4)', pct: 75 };
    return { label: 'Cyber-Secure / Military Grade', color: '#00f0ff', shadow: 'rgba(0,240,255,0.4)', pct: 100 };
  };

  const strength = getStrengthMeta(entropy);

  const formatPassword = (pwd) => {
    if (!pwd || pwd.startsWith('Select')) return <span style={{ color: 'var(--text-muted)' }}>{pwd}</span>;
    return pwd.split('').map((char, i) => {
      let color = '#fff';
      let shadow = 'none';
      if (/[0-9]/.test(char)) {
        color = '#fbbf24'; 
        shadow = 'rgba(251,191,36,0.2)';
      } else if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(char)) {
        color = '#ff3366'; 
        shadow = 'rgba(255,51,102,0.2)';
      } else if (/[a-z]/.test(char)) {
        color = '#38bdf8'; 
      }
      return (
        <span key={i} style={{ color, textShadow: shadow !== 'none' ? `0 0 6px ${shadow}` : 'none', fontWeight: 700 }}>
          {char}
        </span>
      );
    });
  };

  // ─── TAB 4: ROT13 & CAESAR CIPHER STATE ────────────────────────────────────
  const [cipherText, setCipherText] = useState('Antigravity Premium Calculator 2026!');
  const [cipherShift, setCipherShift] = useState(13);
  const [cipherMode, setCipherMode] = useState('rot13'); // rot13, rot18, rot47, caesar
  const [copiedCipher, setCopiedCipher] = useState(false);

  const runCipher = (text) => {
    if (!text) return '';
    
    if (cipherMode === 'rot13') {
      return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
      });
    }
    
    if (cipherMode === 'rot18') {
      return text.replace(/[a-zA-Z0-9]/g, (c) => {
        if (/[0-9]/.test(c)) {
          return String.fromCharCode(((c.charCodeAt(0) - 48 + 5) % 10) + 48);
        }
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
      });
    }
    
    if (cipherMode === 'rot47') {
      return text.split('').map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
          return String.fromCharCode(((code - 33 + 47) % 94) + 33);
        }
        return char;
      }).join('');
    }
    
    if (cipherMode === 'caesar') {
      return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + cipherShift) % 26) + base);
      });
    }
    
    return text;
  };

  const cipherOutput = runCipher(cipherText);

  const copyCipherToClipboard = () => {
    navigator.clipboard.writeText(cipherOutput);
    setCopiedCipher(true);
    setTimeout(() => setCopiedCipher(false), 2000);
  };

  const swapCipherText = () => {
    setCipherText(cipherOutput);
  };

  return (
    <div 
      className="animate-slide"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '16px',
        padding: '8px'
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Programmer Hex/Bin</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Unsigned 32-bit registers, interactive bits flip grid, live regex builder, password keys, and ROT13 transposition</p>
        </div>
      </div>

      {/* Top Tab switcher header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '8px',
        padding: '6px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        width: '100%'
      }}>
        {[
          { id: 'base', name: 'Base & Flip Grid', icon: <Binary size={14} /> },
          { id: 'regex', name: 'Regex Builder', icon: <Code size={14} /> },
          { id: 'password', name: 'Password Gen', icon: <Lock size={14} /> },
          { id: 'rot13', name: 'ROT13 & Caesar', icon: <Repeat size={14} /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: isActive ? `${accentColor}18` : 'transparent',
                border: isActive ? `1px solid ${accentColor}40` : '1px solid transparent',
                borderRadius: '8px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? `0 0 12px ${accentColor}20` : 'none',
                width: '100%'
              }}
              className="btn-glow"
            >
              {tab.icon}
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'base' && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '16px',
            flex: 1
          }}
          className="grid-mobile-1fr"
        >
          {/* Left: Base values */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Synchronized Inputs */}
            <div 
              className="glass-panel"
              style={{
                padding: '20px',
                background: 'rgba(16, 20, 35, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {['HEX', 'DEC', 'OCT', 'BIN'].map(base => (
                <div key={base} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="math-mono" style={{ width: '42px', fontSize: '0.85rem', fontWeight: 700, color: accentColor }}>{base}</span>
                  <input
                    type="text"
                    value={inputs[base]}
                    onChange={(e) => handleInputChange(e.target.value, base)}
                    className="glass-input math-mono"
                    style={{ flex: 1, fontSize: base === 'BIN' ? '0.98rem' : '1.1rem', letterSpacing: '0.05em', color: '#fff' }}
                    placeholder={`${base}ADECIMAL`}
                  />
                </div>
              ))}
            </div>

            {/* Interactive registers flip grid */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Binary size={18} style={{ color: accentColor }} />
                  Interactive 32-bit Flip Grid
                </h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>4 BYTES × 8 BITS</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '4px' }} className="grid-mobile-1fr">
                {renderBits()}
              </div>
            </div>
          </div>

          {/* Right: Bitwise logic */}
          <div 
            className="glass-panel"
            style={{
              padding: '16px',
              background: 'rgba(16, 20, 35, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
                <Cpu size={16} style={{ color: accentColor }} />
                Bitwise Arithmetic
              </h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Manipulate bits instantly using standard logic operands</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', flex: 1 }}>
              {bitwiseOps.map((op) => (
                <button
                  key={op.label}
                  onClick={op.action}
                  className="btn-glow math-mono"
                  style={{
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: '1px solid rgba(255,255,255,0.04)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 0'
                  }}
                >
                  {op.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '12px', background: 'rgba(5,7,12,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>ASCII representation</span>
              <span className="math-mono" style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>
                {val >= 32 && val <= 126 ? `Char: "${String.fromCharCode(val)}"` : 'Char: [Non-printable]'}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'regex' && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '16px',
            flex: 1
          }}
          className="grid-mobile-1fr"
        >
          {/* Left: Regex Customizer & Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(16,20,35,0.45)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 2px 0' }}>
                  <Code size={16} style={{ color: accentColor }} />
                  Visual Regex Builder
                </h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Select pre-defined presets or construct custom token rules dynamically below.</p>
              </div>

              {/* Presets Chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quick Presets</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {[
                    { id: 'email', name: 'Email Address' },
                    { id: 'url', name: 'URL / Links' },
                    { id: 'ip', name: 'IPv4 Address' },
                    { id: 'phone', name: 'Phone (US)' },
                    { id: 'date', name: 'Date YYYY-MM-DD' },
                    { id: 'alphanumeric', name: 'Alphanumeric' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => loadRegexPreset(p.id)}
                      className="btn-glow"
                      style={{ padding: '5px 10px', fontSize: '0.65rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic rule helpers */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rule Assembly Helpers</span>
                
                {/* Prefix/Suffix */}
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={rulePrefix} onChange={e => setRulePrefix(e.target.checked)} style={{ cursor: 'pointer' }} />
                    Starts with (^)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={ruleSuffix} onChange={e => setRuleSuffix(e.target.checked)} style={{ cursor: 'pointer' }} />
                    Ends with ($)
                  </label>
                </div>

                {/* Match Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Match Character Class</label>
                    <select value={ruleContentType} onChange={e => setRuleContentType(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem', cursor: 'pointer', padding: '6px' }}>
                      <option value="letters" style={{ background: '#0a0c16' }}>Letters [a-zA-Z]</option>
                      <option value="digits" style={{ background: '#0a0c16' }}>Digits Only [\d]</option>
                      <option value="whitespace" style={{ background: '#0a0c16' }}>Whitespace [\s]</option>
                      <option value="alphanumeric" style={{ background: '#0a0c16' }}>Alphanumeric [a-zA-Z0-9]</option>
                      <option value="custom" style={{ background: '#0a0c16' }}>Custom Class []</option>
                    </select>
                  </div>

                  {ruleContentType === 'custom' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Custom Content</label>
                      <input type="text" value={ruleCustomContent} onChange={e => setRuleCustomContent(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem' }} placeholder="e.g. a-z0-9_" />
                    </div>
                  )}
                </div>

                {/* Quantifier type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Quantity / Repeat factor</label>
                    <select value={ruleQuantifier} onChange={e => setRuleQuantifier(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem', cursor: 'pointer', padding: '6px' }}>
                      <option value="atleast1" style={{ background: '#0a0c16' }}>At least 1 (+)</option>
                      <option value="optional" style={{ background: '#0a0c16' }}>Optional / 0 or 1 (?)</option>
                      <option value="zero_or_more" style={{ background: '#0a0c16' }}>Zero or more (*)</option>
                      <option value="exactly" style={{ background: '#0a0c16' }}>Exactly N times</option>
                      <option value="range" style={{ background: '#0a0c16' }}>Range (Min to Max)</option>
                    </select>
                  </div>

                  {ruleQuantifier === 'exactly' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>N Times</label>
                      <input type="number" value={ruleExactCount} onChange={e => setRuleExactCount(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem' }} />
                    </div>
                  )}

                  {ruleQuantifier === 'range' && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Min</label>
                        <input type="number" value={ruleRangeMin} onChange={e => setRuleRangeMin(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Max</label>
                        <input type="number" value={ruleRangeMax} onChange={e => setRuleRangeMax(e.target.value)} className="glass-input" style={{ fontSize: '0.72rem' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Active pattern display, Live Playground, Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(16,20,35,0.4)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Regex output string */}
              <div style={{ background: 'rgba(5,7,12,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Generated Regular Expression</span>
                  <button onClick={copyRegexToClipboard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: accentColor, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.62rem' }}>
                    {copiedRegex ? <Check size={12} /> : <Copy size={12} />}
                    {copiedRegex ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontWeight: 'bold' }}>/</span>
                  <input
                    type="text"
                    value={regexPattern}
                    onChange={e => setRegexPattern(e.target.value)}
                    className="math-mono"
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', fontWeight: 600 }}
                  />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontWeight: 'bold' }}>/</span>
                  
                  {/* Flags inline */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { id: 'g', name: 'g', active: globalFlag, set: setGlobalFlag, title: 'Global match (all occurrences)' },
                      { id: 'i', name: 'i', active: caseFlag, set: setCaseFlag, title: 'Case-insensitive' },
                      { id: 'm', name: 'm', active: multilineFlag, set: setMultilineFlag, title: 'Multiline anchors' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => f.set(!f.active)}
                        style={{
                          background: f.active ? `${accentColor}25` : 'rgba(255,255,255,0.02)',
                          border: f.active ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '4px',
                          color: f.active ? accentColor : 'var(--text-muted)',
                          fontSize: '0.68rem',
                          fontFamily: 'monospace',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title={f.title}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
                {!isRegexValid && (
                  <div style={{ color: '#ff3366', fontSize: '0.65rem', marginTop: '2px', fontWeight: 600 }}>
                    Syntax Error: {regexMatches.err}
                  </div>
                )}
              </div>

              {/* Test Input Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Test Strings Playground</span>
                <textarea
                  value={testText}
                  onChange={e => setTestText(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', height: '80px', fontSize: '0.78rem', fontFamily: 'monospace', resize: 'vertical', lineHeight: 1.4 }}
                  placeholder="Insert test logs or text matching criteria here..."
                />
              </div>

              {/* Matches highlighted block */}
              {isRegexValid && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                    <span>Active Match Highlights</span>
                    <span style={{ color: regexMatches.length > 0 ? '#00ff66' : 'var(--text-muted)', fontWeight: 'bold' }}>
                      {regexMatches.length} Matches Found
                    </span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(5,7,12,0.6)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      minHeight: '80px',
                      maxHeight: '120px',
                      overflowY: 'auto',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.45
                    }}
                  >
                    {renderHighlightedText()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '16px',
            flex: 1
          }}
          className="grid-mobile-1fr"
        >
          {/* Left: Generator Criteria config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(16,20,35,0.45)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 2px 0' }}>
                  <Lock size={16} style={{ color: accentColor }} />
                  Futuristic Password Generator
                </h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Configure parameters and slide the length to generate high-entropy security credentials.</p>
              </div>

              {/* Length Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#fff' }}>
                  <span>Password Length</span>
                  <span style={{ color: accentColor, fontWeight: 'bold' }}>{pwdLength} Characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={pwdLength}
                  onChange={e => setPwdLength(parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'ew-resize', accentColor }}
                />
              </div>

              {/* Character set checkboxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={includeUpper} onChange={e => setIncludeUpper(e.target.checked)} style={{ cursor: 'pointer' }} />
                  Uppercase (A-Z)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={includeLower} onChange={e => setIncludeLower(e.target.checked)} style={{ cursor: 'pointer' }} />
                  Lowercase (a-z)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} style={{ cursor: 'pointer' }} />
                  Numbers (0-9)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} style={{ cursor: 'pointer' }} />
                  Special Characters
                </label>
              </div>

              {/* Advanced exclusions */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={excludeSimilar} onChange={e => setExcludeSimilar(e.target.checked)} style={{ cursor: 'pointer' }} />
                  Exclude similar characters (i, l, 1, o, 0, O)
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Custom Character Exclusions</label>
                  <input
                    type="text"
                    value={excludeSpecific}
                    onChange={e => setExcludeSpecific(e.target.value)}
                    className="glass-input"
                    style={{ fontSize: '0.72rem', padding: '6px' }}
                    placeholder="e.g. {}[]/@"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Strength indicator and formatted password display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(16,20,35,0.4)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Formatted Output display */}
              <div style={{ background: 'rgba(5,7,12,0.6)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Generated Credential</span>
                  <button onClick={copyPwdToClipboard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: accentColor, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.62rem' }}>
                    {copiedPwd ? <Check size={12} /> : <Copy size={12} />}
                    {copiedPwd ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <div
                  style={{
                    fontSize: pwdLength > 32 ? '0.85rem' : '1.1rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.08em',
                    padding: '8px 0',
                    wordBreak: 'break-all',
                    minHeight: '34px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  {formatPassword(password)}
                </div>
              </div>

              {/* Entropy Assessment */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Security Analytics</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '2px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{entropy} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-secondary)' }}>bits of entropy</span></span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: strength.color }}>{strength.label}</span>
                  </div>
                </div>

                {/* Strength Gauge Bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      width: `${strength.pct}%`,
                      height: '100%',
                      background: strength.color,
                      boxShadow: `0 0 10px ${strength.shadow}`,
                      transition: 'all 0.4s ease'
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'monospace', lineHeight: 1.4 }}>
                  Entropy metrics indicate the total mathematical complexity ($2^E$ possibilities).<br />
                  {entropy < 40 ? '⚠️ High hazard: vulnerable to microsecond cracking.' :
                   entropy >= 40 && entropy < 60 ? '⚡ Safe for generic web logins.' :
                   entropy >= 60 && entropy < 80 ? '🔒 Superb: recommended for core user servers.' :
                   '🛡️ Military shield: resistant to planetary brute force.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rot13' && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            flex: 1
          }}
          className="grid-mobile-1fr"
        >
          {/* Left panel: Input Area & Shift Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(16,20,35,0.45)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 2px 0' }}>
                  <Repeat size={16} style={{ color: accentColor }} />
                  ROT13 &amp; Caesar Cipher
                </h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Rotate alphabetic characters by fixed positions in real-time.</p>
              </div>

              {/* Mode Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Transposition Cipher Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                  {[
                    { id: 'rot13', name: 'ROT13' },
                    { id: 'rot18', name: 'ROT18' },
                    { id: 'rot47', name: 'ROT47' },
                    { id: 'caesar', name: 'Caesar' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setCipherMode(m.id)}
                      className="btn-glow"
                      style={{
                        padding: '6px 2px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: cipherMode === m.id ? `${accentColor}18` : 'rgba(255,255,255,0.02)',
                        border: cipherMode === m.id ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '6px',
                        color: cipherMode === m.id ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for Caesar shift */}
              {cipherMode === 'caesar' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', animation: 'fadeIn 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#fff' }}>
                    <span>Caesar Shift Key (Positions)</span>
                    <span style={{ color: accentColor, fontWeight: 'bold' }}>{cipherShift} Places</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={cipherShift}
                    onChange={e => setCipherShift(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'ew-resize', accentColor }}
                  />
                </div>
              )}

              {/* Text Input area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Plaintext Input Area</span>
                <textarea
                  value={cipherText}
                  onChange={e => setCipherText(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', height: '110px', fontSize: '0.78rem', fontFamily: 'monospace', resize: 'vertical', lineHeight: 1.4 }}
                  placeholder="Type plain text to transpose..."
                />
              </div>
            </div>
          </div>

          {/* Right panel: Output block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(16,20,35,0.4)', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Transposed Ciphertext</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={swapCipherText} style={{ background: 'none', border: 'none', cursor: 'pointer', color: accentColor, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.62rem' }}>
                    <Repeat size={12} />
                    SWAP
                  </button>
                  <button onClick={copyCipherToClipboard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: accentColor, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.62rem' }}>
                    {copiedCipher ? <Check size={12} /> : <Copy size={12} />}
                    {copiedCipher ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* Transposed outputs display */}
              <textarea
                readOnly
                value={cipherOutput}
                className="glass-input"
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: '160px',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  background: 'rgba(5,7,12,0.6)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  color: accentColor,
                  textShadow: `0 0 4px ${accentColor}25`,
                  lineHeight: 1.45,
                  cursor: 'default',
                  resize: 'none'
                }}
              />

              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace', lineHeight: 1.3 }}>
                ROT13 (rotation by 13 positions) acts as its own inverse. Swapping ROT13 results recovers the initial plaintext instantly. ROT18 rotates digits by 5. ROT47 shifts 94 printable ASCII characters.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
