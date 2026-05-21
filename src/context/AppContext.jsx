import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialCurrencyRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.35,
  JPY: 155.6,
  BTC: 0.000015,
  ETH: 0.00029,
  SOL: 0.0062,
  BNB: 0.00172,
  XRP: 2.0,
  ADA: 2.22,
  DOGE: 6.67,
  LTC: 0.0125,
  USDT: 1.0
};

const defaultCustomFormulas = [
  {
    id: 'f1',
    name: 'Kinetic Energy',
    formula: '0.5 * m * v^2',
    description: 'Calculates the kinetic energy of an object in motion.',
    variables: [
      { name: 'm', label: 'Mass (kg)', defaultValue: '10' },
      { name: 'v', label: 'Velocity (m/s)', defaultValue: '5' }
    ]
  },
  {
    id: 'f2',
    name: 'Body Mass Index (BMI)',
    formula: 'w / (h / 100)^2',
    description: 'Standard BMI calculation using weight and height.',
    variables: [
      { name: 'w', label: 'Weight (kg)', defaultValue: '70' },
      { name: 'h', label: 'Height (cm)', defaultValue: '175' }
    ]
  },
  {
    id: 'f3',
    name: 'Resonant Frequency',
    formula: '1 / (2 * pi * sqrt(L * C))',
    description: 'Resonant frequency of an LC circuit.',
    variables: [
      { name: 'L', label: 'Inductance (H)', defaultValue: '0.001' },
      { name: 'C', label: 'Capacitance (F)', defaultValue: '0.000001' }
    ]
  }
];

export const AppProvider = ({ children }) => {
  const [activeModule, setActiveModule] = useState('basic');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('omnicalc_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [customFormulas, setCustomFormulas] = useState(() => {
    const saved = localStorage.getItem('omnicalc_custom_formulas');
    return saved ? JSON.parse(saved) : defaultCustomFormulas;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('omnicalc_settings');
    return saved ? JSON.parse(saved) : {
      angleMode: 'deg', // deg or rad
      decimalPlaces: 4,
      scientificNotation: false,
      glowIntensity: 'normal' // normal, high, off
    };
  });

  const [currencyRates, setCurrencyRates] = useState(initialCurrencyRates);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('omnicalc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('omnicalc_custom_formulas', JSON.stringify(customFormulas));
  }, [customFormulas]);

  useEffect(() => {
    localStorage.setItem('omnicalc_settings', JSON.stringify(settings));
  }, [settings]);

  // Try to load real exchange rates if possible
  useEffect(() => {
    const fetchRates = async () => {
      setIsCurrencyLoading(true);
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates) {
          const rates = {
            ...data.rates,
            USD: 1.0,
            BTC: data.rates.BTC || 1 / 67000,
            ETH: data.rates.ETH || 1 / 3400,
            SOL: data.rates.SOL || 1 / 160,
            BNB: data.rates.BNB || 1 / 580,
            XRP: data.rates.XRP || 1 / 0.50,
            ADA: data.rates.ADA || 1 / 0.45,
            DOGE: data.rates.DOGE || 1 / 0.15,
            LTC: data.rates.LTC || 1 / 80,
            USDT: data.rates.USDT || 1.0
          };
          setCurrencyRates(rates);
        }
      } catch (err) {
        console.warn("Could not fetch live rates, using fallback rates.", err);
      } finally {
        setIsCurrencyLoading(false);
      }
    };
    fetchRates();
  }, []);

  const addHistoryItem = (expression, result, moduleName = 'basic') => {
    const newItem = {
      id: Date.now().toString(),
      expression,
      result,
      module: moduleName,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 100)); // Cap history at 100 items
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addCustomFormula = (newFormula) => {
    setCustomFormulas(prev => [...prev, { ...newFormula, id: Date.now().toString() }]);
  };

  const deleteCustomFormula = (id) => {
    setCustomFormulas(prev => prev.filter(f => f.id !== id));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Maps module to its corresponding primary color variable
  const getAccentColor = (moduleId) => {
    switch (moduleId) {
      case 'basic': return 'var(--color-basic)';
      case 'advanced-scientific': return 'var(--color-scientific)';
      case 'graphing': return 'var(--color-graphing)';
      case 'programmer': return 'var(--color-programmer)';
      case 'chemistry': return 'var(--color-chemistry)';
      case 'converter': return 'var(--color-financial)';
      case 'financial': return 'var(--color-financial)';
      case 'engineering': return 'var(--color-engineering)';
      case 'datetime': return 'var(--color-datetime)';
      case 'health': return 'var(--color-health)';
      case 'ai-search': return 'var(--color-ai)';
      case 'education': return 'var(--color-education)';
      case 'formulas': return 'var(--color-education)';
      default: return 'var(--color-basic)';
    }
  };

  return (
    <AppContext.Provider value={{
      activeModule,
      setActiveModule,
      history,
      addHistoryItem,
      clearHistory,
      customFormulas,
      addCustomFormula,
      deleteCustomFormula,
      settings,
      updateSetting,
      currencyRates,
      isCurrencyLoading,
      getAccentColor
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
