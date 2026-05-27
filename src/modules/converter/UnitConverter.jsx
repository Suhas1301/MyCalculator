import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeftRight, Coins, Ruler, Scale, Flame, RefreshCw, Search, ChevronDown, Grid, Box, Gauge, Zap, Sun, Thermometer, DollarSign, Bitcoin, Banknote } from 'lucide-react';

const converterUnits = {
  length: {
    name: 'Length',
    icon: Ruler,
    units: [
      { name: 'Meter (m)', factor: 1.0 },
      { name: 'Kilometer (km)', factor: 1000.0 },
      { name: 'Centimeter (cm)', factor: 0.01 },
      { name: 'Millimeter (mm)', factor: 0.001 },
      { name: 'Mils (mil)', factor: 0.0000254 },
      { name: 'Mile (mi)', factor: 1609.344 },
      { name: 'Nautical Mile (n mile)', factor: 1852.0 },
      { name: 'Yard (yd)', factor: 0.9144 },
      { name: 'Foot (ft)', factor: 0.3048 },
      { name: 'Inch (in)', factor: 0.0254 },
      { name: 'Parsec (pc)', factor: 3.085677581e16 }
    ]
  },
  weight: {
    name: 'Weight & Mass',
    icon: Scale,
    units: [
      { name: 'Gram (g)', factor: 1.0 },
      { name: 'Kilogram (kg)', factor: 1000.0 },
      { name: 'Pound (lb)', factor: 453.59237 },
      { name: 'Ounce (oz)', factor: 28.349523125 },
      { name: 'Metric Ton (t)', factor: 1000000.0 },
      { name: 'UK Ton (long ton)', factor: 1016046.9088 },
      { name: 'US Ton (short ton)', factor: 907184.74 }
    ]
  },
  speed: {
    name: 'Speed',
    icon: Flame,
    units: [
      { name: 'Meter/second (m/s)', factor: 1.0 },
      { name: 'Meter/hour (m/h)', factor: 0.0002777777777777778 },
      { name: 'Kilometer/second (km/s)', factor: 1000.0 },
      { name: 'Kilometers/hour (km/h)', factor: 0.2777777777777778 },
      { name: 'Inches/second (in/s)', factor: 0.0254 },
      { name: 'Inches/hour (in/h)', factor: 0.000007055555555555556 },
      { name: 'Feet/second (ft/s)', factor: 0.3048 },
      { name: 'Feet/hour (ft/h)', factor: 0.00008466666666666667 },
      { name: 'Miles/second (mi/s)', factor: 1609.344 },
      { name: 'Miles/hour (mph)', factor: 0.44704 },
      { name: 'Knots (kt)', factor: 0.514444 }
    ]
  },
  area: {
    name: 'Area',
    icon: Grid,
    units: [
      { name: 'Square Meter (m²)', factor: 1.0 },
      { name: 'Square Centimeter (cm²)', factor: 0.0001 },
      { name: 'Hectare (ha)', factor: 10000.0 },
      { name: 'Acre (acre)', factor: 4046.8564224 },
      { name: 'Square Kilometer (km²)', factor: 1000000.0 },
      { name: 'Square Foot (ft²)', factor: 0.09290304 },
      { name: 'Square Inch (in²)', factor: 0.00064516 }
    ]
  },
  volume: {
    name: 'Volume',
    icon: Box,
    units: [
      { name: 'Liter (L)', factor: 1.0 },
      { name: 'Gallon (US gal)', factor: 3.785411784 },
      { name: 'Gallon (UK gal)', factor: 4.54609 },
      { name: 'Cubic Meter (m³)', factor: 1000.0 },
      { name: 'Cubic Centimeter (cm³)', factor: 0.001 },
      { name: 'Cubic Inch (in³)', factor: 0.016387064 },
      { name: 'Cubic Foot (ft³)', factor: 28.316846592 },
      { name: 'Milliliter (mL)', factor: 0.001 }
    ]
  },
  pressure: {
    name: 'Pressure',
    icon: Gauge,
    units: [
      { name: 'Pascal (Pa)', factor: 1.0 },
      { name: 'Kilopascal (kPa)', factor: 1000.0 },
      { name: 'Atmosphere (atm)', factor: 101325.0 },
      { name: 'Millimeter of Mercury (mmHg)', factor: 133.322387415 },
      { name: 'Kilogram-force/sq cm (kgf/cm²)', factor: 98066.5 },
      { name: 'Pound-force/sq in (psi / lbf/in²)', factor: 6894.757293168 }
    ]
  },
  power: {
    name: 'Power',
    icon: Zap,
    units: [
      { name: 'Watt (W)', factor: 1.0 },
      { name: 'Kilowatt (kW)', factor: 1000.0 },
      { name: 'Horsepower (hp)', factor: 745.6998715822702 }
    ]
  },
  energy: {
    name: 'Energy',
    icon: Sun,
    units: [
      { name: 'Joule (J)', factor: 1.0 },
      { name: 'Calorie (cal)', factor: 4.184 },
      { name: 'Kilogram-force meter (kgf·m)', factor: 9.80665 },
      { name: 'Kilocalorie (kcal)', factor: 4184.0 },
      { name: 'Kilowatt-hour (kWh)', factor: 3600000.0 }
    ]
  },
  digital: {
    name: 'Digital Storage',
    icon: ArrowLeftRight,
    units: [
      { name: 'Bit (b)', factor: 1.0 },
      { name: 'Byte (B)', factor: 8.0 },
      { name: 'Kilobyte (KB)', factor: 8192.0 },
      { name: 'Megabyte (MB)', factor: 8388608.0 },
      { name: 'Gigabyte (GB)', factor: 8589934592.0 },
      { name: 'Terabyte (TB)', factor: 8796093022208.0 }
    ]
  }
};

const currencyDetails = {
  USD: { country: 'United States', name: 'Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { country: 'European Union', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { country: 'United Kingdom', name: 'Pound Sterling', symbol: '£', flag: '🇬🇧' },
  INR: { country: 'India', name: 'Rupee', symbol: '₹', flag: '🇮🇳' },
  JPY: { country: 'Japan', name: 'Yen', symbol: '¥', flag: '🇯🇵' },
  CAD: { country: 'Canada', name: 'Dollar', symbol: 'C$', flag: '🇨🇦' },
  AUD: { country: 'Australia', name: 'Dollar', symbol: 'A$', flag: '🇦🇺' },
  CHF: { country: 'Switzerland', name: 'Franc', symbol: 'CHF', flag: '🇨🇭' },
  CNY: { country: 'China', name: 'Yuan', symbol: '¥', flag: '🇨🇳' },
  NZD: { country: 'New Zealand', name: 'Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  AED: { country: 'United Arab Emirates', name: 'Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  SAR: { country: 'Saudi Arabia', name: 'Riyal', symbol: 'ر.س', flag: '🇸🇦' },
  SGD: { country: 'Singapore', name: 'Dollar', symbol: 'S$', flag: '🇸🇬' },
  HKD: { country: 'Hong Kong', name: 'Dollar', symbol: 'HK$', flag: '🇭🇰' },
  SEK: { country: 'Sweden', name: 'Krona', symbol: 'kr', flag: '🇸🇪' },
  KRW: { country: 'South Korea', name: 'Won', symbol: '₩', flag: '🇰🇷' },
  MXN: { country: 'Mexico', name: 'Peso', symbol: '$', flag: '🇲🇽' },
  BRL: { country: 'Brazil', name: 'Real', symbol: 'R$', flag: '🇧🇷' },
  ZAR: { country: 'South Africa', name: 'Rand', symbol: 'R', flag: '🇿🇦' },
  RUB: { country: 'Russia', name: 'Ruble', symbol: '₽', flag: '🇷🇺' },
  TRY: { country: 'Turkey', name: 'Lira', symbol: '₺', flag: '🇹🇷' },
  NOK: { country: 'Norway', name: 'Krone', symbol: 'kr', flag: '🇳🇴' },
  DKK: { country: 'Denmark', name: 'Krone', symbol: 'kr', flag: '🇩🇰' },
  PLN: { country: 'Poland', name: 'Zloty', symbol: 'zł', flag: '🇵🇱' },
  THB: { country: 'Thailand', name: 'Baht', symbol: '฿', flag: '🇹🇭' },
  IDR: { country: 'Indonesia', name: 'Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  MYR: { country: 'Malaysia', name: 'Ringgit', symbol: 'RM', flag: '🇲🇾' },
  PHP: { country: 'Philippines', name: 'Peso', symbol: '₱', flag: '🇵🇭' },
  ILS: { country: 'Israel', name: 'Shekel', symbol: '₪', flag: '🇮🇱' }
};

const cryptoDetails = {
  BTC: { name: 'Bitcoin', symbol: '₿' },
  ETH: { name: 'Ethereum', symbol: 'Ξ' },
  SOL: { name: 'Solana', symbol: 'SOL' },
  BNB: { name: 'Binance Coin', symbol: 'BNB' },
  XRP: { name: 'Ripple', symbol: 'XRP' },
  ADA: { name: 'Cardano', symbol: 'ADA' },
  DOGE: { name: 'Dogecoin', symbol: 'Ð' },
  LTC: { name: 'Litecoin', symbol: 'Ł' },
  USDT: { name: 'Tether Stablecoin', symbol: '₮' },
  USD: { name: 'US Dollar', symbol: '$' }
};

const getDisplayName = (code) => {
  const details = currencyDetails[code];
  if (details) {
    return `${details.flag} ${details.country} (${code})`;
  }
  return `${code} (${code})`;
};

const getCryptoDisplayName = (code) => {
  const details = cryptoDetails[code];
  if (details) {
    return `${details.name} (${code})`;
  }
  return `${code} (${code})`;
};

export default function UnitConverter() {
  const { currencyRates, isCurrencyLoading, getAccentColor } = useApp();
  const accentColor = getAccentColor('converter');

  const [activeCategory, setActiveCategory] = useState('length'); // length, weight, speed, digital, currency, temperature
  const [isListView, setIsListView] = useState(false);
  const [listPrimaryUnit, setListPrimaryUnit] = useState(null);
  const [listPrimaryValue, setListPrimaryValue] = useState('1');
  
  // Input states
  const [valFrom, setValFrom] = useState('1');
  const [valTo, setValTo] = useState('');
  
  // Unit selections states
  const [unitFromIndex, setUnitFromIndex] = useState(0);
  const [unitToIndex, setUnitToIndex] = useState(1);
  
  // Currency units selectors
  const [curFrom, setCurFrom] = useState('USD');
  const [curTo, setCurTo] = useState('EUR');

  // Crypto units selectors
  const [cryptoFrom, setCryptoFrom] = useState('BTC');
  const [cryptoTo, setCryptoTo] = useState('USD');

  // Temp units selectors
  const [tempFrom, setTempFrom] = useState('C');
  const [tempTo, setTempTo] = useState('F');

  // Dropdown states & search queries
  const [isOpenFrom, setIsOpenFrom] = useState(false);
  const [isOpenTo, setIsOpenTo] = useState(false);
  const [searchQueryFrom, setSearchQueryFrom] = useState('');
  const [searchQueryTo, setSearchQueryTo] = useState('');

  // Dropdown element references for click-outside detection
  const dropdownFromRef = useRef(null);
  const dropdownToRef = useRef(null);

  // Click-outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownFromRef.current && !dropdownFromRef.current.contains(event.target)) {
        setIsOpenFrom(false);
      }
      if (dropdownToRef.current && !dropdownToRef.current.contains(event.target)) {
        setIsOpenTo(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trigger calculations whenever selectors or inputs change
  useEffect(() => {
    convertValue(valFrom, 'from');
  }, [activeCategory, unitFromIndex, unitToIndex, curFrom, curTo, cryptoFrom, cryptoTo, tempFrom, tempTo]);

  // Main Conversion Router logic
  const convertValue = (val, direction = 'from') => {
    const input = parseFloat(val);
    if (isNaN(input)) {
      if (direction === 'from') setValTo('');
      else setValFrom('');
      return;
    }

    if (activeCategory === 'currency') {
      const fromRate = currencyRates[curFrom];
      const toRate = currencyRates[curTo];
      
      if (direction === 'from') {
        const result = (input / fromRate) * toRate;
        setValTo(Number(result.toFixed(6)).toString());
      } else {
        const result = (input / toRate) * fromRate;
        setValFrom(Number(result.toFixed(6)).toString());
      }
    } 
    
    else if (activeCategory === 'crypto') {
      const fromRate = currencyRates[cryptoFrom];
      const toRate = currencyRates[cryptoTo];
      
      if (direction === 'from') {
        const result = (input / fromRate) * toRate;
        setValTo(Number(result.toFixed(8)).toString());
      } else {
        const result = (input / toRate) * fromRate;
        setValFrom(Number(result.toFixed(8)).toString());
      }
    } 
    
    else if (activeCategory === 'temperature') {
      if (direction === 'from') {
        setValTo(Number(convertTemperature(input, tempFrom, tempTo).toFixed(4)).toString());
      } else {
        setValFrom(Number(convertTemperature(input, tempTo, tempFrom).toFixed(4)).toString());
      }
    } 
    
    else {
      // Normal multiplier categories
      const categoryData = converterUnits[activeCategory];
      if (!categoryData) return;
      const unitFrom = categoryData.units[unitFromIndex];
      const unitTo = categoryData.units[unitToIndex];
      
      if (!unitFrom || !unitTo) return;

      if (direction === 'from') {
        // From unit -> Base -> To unit
        const valInBase = input * unitFrom.factor;
        const result = valInBase / unitTo.factor;
        setValTo(Number(result.toFixed(6)).toString());
      } else {
        // To unit -> Base -> From unit
        const valInBase = input * unitTo.factor;
        const result = valInBase / unitFrom.factor;
        setValFrom(Number(result.toFixed(6)).toString());
      }
    }
  };

  const getConvertedValue = (inputStr, fromId, toId) => {
    if (!inputStr || isNaN(parseFloat(inputStr))) return '';
    if (fromId === toId) return inputStr;
    const input = parseFloat(inputStr);

    if (activeCategory === 'currency') {
      const fromRate = currencyRates[fromId];
      const toRate = currencyRates[toId];
      if (!fromRate || !toRate) return '';
      return Number(((input / fromRate) * toRate).toFixed(6)).toString();
    } else if (activeCategory === 'crypto') {
      const fromRate = currencyRates[fromId];
      const toRate = currencyRates[toId];
      if (!fromRate || !toRate) return '';
      return Number(((input / fromRate) * toRate).toFixed(8)).toString();
    } else if (activeCategory === 'temperature') {
      return Number(convertTemperature(input, fromId, toId).toFixed(4)).toString();
    } else {
      const categoryData = converterUnits[activeCategory];
      const unitFrom = categoryData.units[fromId];
      const unitTo = categoryData.units[toId];
      if (!unitFrom || !unitTo) return '';
      const valInBase = input * unitFrom.factor;
      return Number((valInBase / unitTo.factor).toFixed(6)).toString();
    }
  };

  const convertTemperature = (v, from, to) => {
    if (from === to) return v;
    let celsius = v;
    
    // Convert from origin to Celsius
    if (from === 'F') celsius = (v - 32) / 1.8;
    if (from === 'K') celsius = v - 273.15;

    // Convert from Celsius to destination
    if (to === 'F') return celsius * 1.8 + 32;
    if (to === 'K') return celsius + 273.15;
    return celsius;
  };

  const handleInputChange = (val, direction) => {
    let cleanVal = val;
    if (activeCategory !== 'temperature' && val !== '') {
      const parsed = parseFloat(val);
      if (parsed < 0) {
        cleanVal = Math.abs(parsed).toString();
      } else if (val.includes('-')) {
        cleanVal = val.replace(/-/g, '');
      }
    }
    
    if (direction === 'from') {
      setValFrom(cleanVal);
      convertValue(cleanVal, 'from');
    } else {
      setValTo(cleanVal);
      convertValue(cleanVal, 'to');
    }
  };

  const swapUnits = () => {
    if (activeCategory === 'currency') {
      const temp = curFrom;
      setCurFrom(curTo);
      setCurTo(temp);
    } else if (activeCategory === 'crypto') {
      const temp = cryptoFrom;
      setCryptoFrom(cryptoTo);
      setCryptoTo(temp);
    } else if (activeCategory === 'temperature') {
      const temp = tempFrom;
      setTempFrom(tempTo);
      setTempTo(temp);
    } else {
      const temp = unitFromIndex;
      setUnitFromIndex(unitToIndex);
      setUnitToIndex(temp);
    }
    // Flip inputs too
    setValFrom(valTo);
    setValTo(valFrom);
  };

  const resetSelection = (cat) => {
    setActiveCategory(cat);
    setValFrom('1');
    setValTo('');
    setUnitFromIndex(0);
    setUnitToIndex(1);
    setListPrimaryValue('1');
    setListPrimaryUnit(null);
  };

  const handleListInputChange = (val, unitId) => {
    let cleanVal = val;
    if (activeCategory !== 'temperature' && val !== '') {
      const parsed = parseFloat(val);
      if (parsed < 0) {
        cleanVal = Math.abs(parsed).toString();
      } else if (val.includes('-')) {
        cleanVal = val.replace(/-/g, '');
      }
    }
    setListPrimaryUnit(unitId);
    setListPrimaryValue(cleanVal);
  };

  const renderListView = () => {
    let units = [];
    let initialPrimary = null;
    if (activeCategory === 'currency') {
      units = Object.keys(currencyRates).filter(c => currencyDetails[c]);
      initialPrimary = 'USD';
    } else if (activeCategory === 'crypto') {
      units = Object.keys(cryptoDetails).filter(c => currencyRates[c]);
      initialPrimary = 'BTC';
    } else if (activeCategory === 'temperature') {
      units = ['C', 'F', 'K'];
      initialPrimary = 'C';
    } else {
      units = converterUnits[activeCategory]?.units.map((_, i) => i) || [];
      initialPrimary = 0;
    }

    const primaryUnit = listPrimaryUnit !== null ? listPrimaryUnit : initialPrimary;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '8px', overflowY: 'auto' }}>
        {units.map(uId => {
          const val = uId === primaryUnit ? listPrimaryValue : getConvertedValue(listPrimaryValue, primaryUnit, uId);
          let label = '';
          if (activeCategory === 'currency') label = getDisplayName(uId);
          else if (activeCategory === 'crypto') label = getCryptoDisplayName(uId);
          else if (activeCategory === 'temperature') {
            label = uId === 'C' ? 'Celsius (°C)' : uId === 'F' ? 'Fahrenheit (°F)' : 'Kelvin (K)';
          } else {
            label = converterUnits[activeCategory].units[uId].name;
          }

          return (
            <div key={uId} className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'rgba(5, 7, 12, 0.4)', gap: '16px', flexShrink: 0 }}>
              <div style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</div>
              <input
                type="number"
                value={val}
                onChange={(e) => handleListInputChange(e.target.value, uId)}
                className="glass-input math-mono"
                style={{ width: '200px', padding: '8px 12px', fontSize: '1.2rem', fontWeight: 600, textAlign: 'right' }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const categories = [
    { id: 'length', name: 'Length', icon: Ruler },
    { id: 'weight', name: 'Weight & Mass', icon: Scale },
    { id: 'speed', name: 'Speed', icon: Flame },
    { id: 'area', name: 'Area', icon: Grid },
    { id: 'volume', name: 'Volume', icon: Box },
    { id: 'pressure', name: 'Pressure', icon: Gauge },
    { id: 'power', name: 'Power', icon: Zap },
    { id: 'energy', name: 'Energy', icon: Sun },
    { id: 'digital', name: 'Digital Storage', icon: ArrowLeftRight },
    { id: 'temperature', name: 'Temperature', icon: Thermometer },
    { id: 'currency', name: 'Currency rates', icon: Banknote },
    { id: 'crypto', name: 'Cryptocurrencies', icon: Coins }
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
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Universal Converter Engine</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Precise dimensional calculations and currency conversions</p>
      </div>

      {/* Main interface layout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '16px',
          flex: 1,
          minHeight: 0
        }}
      >
        {/* Sidebar categories picker */}
        <div 
          className="glass-panel"
          style={{
            background: 'rgba(16, 20, 35, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            height: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => resetSelection(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSelected ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderLeft: isSelected ? `3px solid ${accentColor}` : '3px solid transparent',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                className="sidebar-item-btn"
              >
                <Icon size={18} style={{ color: isSelected ? accentColor : 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 600 : 500 }}>{cat.name}</span>
              </button>
            );
          })}
          </div>
        </div>

        {/* Content converter panel */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            background: 'rgba(16, 20, 35, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflowY: 'auto',
            height: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Header with Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {React.createElement(categories.find(c => c.id === activeCategory)?.icon || Settings, { size: 20, style: { color: accentColor } })}
              {categories.find(c => c.id === activeCategory)?.name || 'Converter'}
            </h3>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
              <button 
                onClick={() => setIsListView(false)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: !isListView ? 'rgba(255,255,255,0.1)' : 'transparent', color: !isListView ? '#fff' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
              >
                Dual Panel
              </button>
              <button 
                onClick={() => setIsListView(true)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: isListView ? 'rgba(255,255,255,0.1)' : 'transparent', color: isListView ? '#fff' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
              >
                List View
              </button>
            </div>
          </div>

          {isListView ? renderListView() : (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '16px'
              }}
            >
            {/* FROM panel */}
            <div 
              className="glass-panel"
              style={{
                padding: '20px',
                background: 'rgba(5, 7, 12, 0.4)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>Convert From</span>
              
              {/* Numeric input */}
              <input
                type="number"
                value={valFrom}
                onChange={(e) => handleInputChange(e.target.value, 'from')}
                className="glass-input math-mono"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  width: '100%',
                  padding: '8px 12px'
                }}
              />

              {/* Selector according to category */}
              {activeCategory === 'currency' ? (
                <div ref={dropdownFromRef} style={{ position: 'relative', width: '100%' }}>
                  <button
                    onClick={() => setIsOpenFrom(!isOpenFrom)}
                    className="glass-input"
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {getDisplayName(curFrom)}
                    </span>
                    <ChevronDown size={16} style={{ color: accentColor, opacity: 0.8 }} />
                  </button>
                  
                  {isOpenFrom && (
                    <div
                      className="glass-panel"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '6px',
                        background: 'rgba(10, 12, 22, 0.96)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        zIndex: 100,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Search Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(10, 12, 22, 0.98)', zIndex: 1 }}>
                        <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '6px' }} />
                        <input
                          type="text"
                          placeholder="Search currency or country..."
                          value={searchQueryFrom}
                          onChange={(e) => setSearchQueryFrom(e.target.value)}
                          className="glass-input"
                          style={{
                            flex: 1,
                            fontSize: '0.8rem',
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.02)',
                            border: 'none',
                            outline: 'none'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* Scrollable list */}
                      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                        {Object.keys(currencyRates)
                          .filter(c => currencyDetails[c] !== undefined)
                          .filter(c => {
                            const details = currencyDetails[c];
                            const query = searchQueryFrom.toLowerCase();
                            if (!query) return true;
                            if (c.toLowerCase().includes(query)) return true;
                            if (details) {
                              return details.country.toLowerCase().includes(query) || details.name.toLowerCase().includes(query);
                            }
                            return false;
                          })
                          .map(c => {
                            const isSel = curFrom === c;
                            const details = currencyDetails[c];
                            return (
                              <button
                                key={c}
                                onClick={() => {
                                  setCurFrom(c);
                                  setIsOpenFrom(false);
                                  setSearchQueryFrom('');
                                }}
                                style={{
                                  padding: '8px 12px',
                                  background: isSel ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                  border: 'none',
                                  color: isSel ? accentColor : '#fff',
                                  fontSize: '0.82rem',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'all var(--transition-fast)'
                                }}
                                className="btn-glow"
                              >
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  {getDisplayName(c)}
                                </span>
                                {details && (
                                  <span style={{ fontSize: '0.78rem', color: isSel ? accentColor : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    {details.symbol}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeCategory === 'crypto' ? (
                <div ref={dropdownFromRef} style={{ position: 'relative', width: '100%' }}>
                  <button
                    onClick={() => setIsOpenFrom(!isOpenFrom)}
                    className="glass-input"
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {getCryptoDisplayName(cryptoFrom)}
                    </span>
                    <ChevronDown size={16} style={{ color: accentColor, opacity: 0.8 }} />
                  </button>
                  
                  {isOpenFrom && (
                    <div
                      className="glass-panel"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '6px',
                        background: 'rgba(10, 12, 22, 0.96)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        zIndex: 100,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Search Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(10, 12, 22, 0.98)', zIndex: 1 }}>
                        <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '6px' }} />
                        <input
                          type="text"
                          placeholder="Search cryptocurrency..."
                          value={searchQueryFrom}
                          onChange={(e) => setSearchQueryFrom(e.target.value)}
                          className="glass-input"
                          style={{
                            flex: 1,
                            fontSize: '0.8rem',
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.02)',
                            border: 'none',
                            outline: 'none'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* Scrollable list */}
                      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                        {Object.keys(cryptoDetails)
                          .filter(c => {
                            const details = cryptoDetails[c];
                            const query = searchQueryFrom.toLowerCase();
                            if (!query) return true;
                            if (c.toLowerCase().includes(query)) return true;
                            if (details) {
                              return details.name.toLowerCase().includes(query);
                            }
                            return false;
                          })
                          .map(c => {
                            const isSel = cryptoFrom === c;
                            const details = cryptoDetails[c];
                            return (
                              <button
                                key={c}
                                onClick={() => {
                                  setCryptoFrom(c);
                                  setIsOpenFrom(false);
                                  setSearchQueryFrom('');
                                }}
                                style={{
                                  padding: '8px 12px',
                                  background: isSel ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                  border: 'none',
                                  color: isSel ? accentColor : '#fff',
                                  fontSize: '0.82rem',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'all var(--transition-fast)'
                                }}
                                className="btn-glow"
                              >
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  {getCryptoDisplayName(c)}
                                </span>
                                {details && (
                                  <span style={{ fontSize: '0.78rem', color: isSel ? accentColor : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    {details.symbol}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeCategory === 'temperature' ? (
                <select
                  value={tempFrom}
                  onChange={(e) => setTempFrom(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  <option value="C" style={{ background: '#0a0c16', color: '#fff' }}>Celsius (°C)</option>
                  <option value="F" style={{ background: '#0a0c16', color: '#fff' }}>Fahrenheit (°F)</option>
                  <option value="K" style={{ background: '#0a0c16', color: '#fff' }}>Kelvin (K)</option>
                </select>
              ) : (
                <select
                  value={unitFromIndex}
                  onChange={(e) => setUnitFromIndex(parseInt(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  {converterUnits[activeCategory]?.units.map((unit, idx) => (
                    <option key={unit.name} value={idx} style={{ background: '#0a0c16', color: '#fff' }}>{unit.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* SWAP BUTTON */}
            <button
              onClick={swapUnits}
              className="btn-glow flex-center"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                alignSelf: 'center'
              }}
              title="Swap units"
            >
              <ArrowLeftRight size={16} style={{ color: accentColor }} />
            </button>

            {/* TO panel */}
            <div 
              className="glass-panel"
              style={{
                padding: '20px',
                background: 'rgba(5, 7, 12, 0.4)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>Convert To</span>
              
              {/* Numeric input */}
              <input
                type="number"
                value={valTo}
                onChange={(e) => handleInputChange(e.target.value, 'to')}
                className="glass-input math-mono"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  width: '100%',
                  padding: '8px 12px'
                }}
              />

              {/* Selector according to category */}
              {activeCategory === 'currency' ? (
                <div ref={dropdownToRef} style={{ position: 'relative', width: '100%' }}>
                  <button
                    onClick={() => setIsOpenTo(!isOpenTo)}
                    className="glass-input"
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {getDisplayName(curTo)}
                    </span>
                    <ChevronDown size={16} style={{ color: accentColor, opacity: 0.8 }} />
                  </button>
                  
                  {isOpenTo && (
                    <div
                      className="glass-panel"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '6px',
                        background: 'rgba(10, 12, 22, 0.96)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        zIndex: 100,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Search Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(10, 12, 22, 0.98)', zIndex: 1 }}>
                        <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '6px' }} />
                        <input
                          type="text"
                          placeholder="Search currency or country..."
                          value={searchQueryTo}
                          onChange={(e) => setSearchQueryTo(e.target.value)}
                          className="glass-input"
                          style={{
                            flex: 1,
                            fontSize: '0.8rem',
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.02)',
                            border: 'none',
                            outline: 'none'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* Scrollable list */}
                      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                        {Object.keys(currencyRates)
                          .filter(c => currencyDetails[c] !== undefined)
                          .filter(c => {
                            const details = currencyDetails[c];
                            const query = searchQueryTo.toLowerCase();
                            if (!query) return true;
                            if (c.toLowerCase().includes(query)) return true;
                            if (details) {
                              return details.country.toLowerCase().includes(query) || details.name.toLowerCase().includes(query);
                            }
                            return false;
                          })
                          .map(c => {
                            const isSel = curTo === c;
                            const details = currencyDetails[c];
                            return (
                              <button
                                key={c}
                                onClick={() => {
                                  setCurTo(c);
                                  setIsOpenTo(false);
                                  setSearchQueryTo('');
                                }}
                                style={{
                                  padding: '8px 12px',
                                  background: isSel ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                  border: 'none',
                                  color: isSel ? accentColor : '#fff',
                                  fontSize: '0.82rem',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'all var(--transition-fast)'
                                }}
                                className="btn-glow"
                              >
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  {getDisplayName(c)}
                                </span>
                                {details && (
                                  <span style={{ fontSize: '0.78rem', color: isSel ? accentColor : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    {details.symbol}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeCategory === 'crypto' ? (
                <div ref={dropdownToRef} style={{ position: 'relative', width: '100%' }}>
                  <button
                    onClick={() => setIsOpenTo(!isOpenTo)}
                    className="glass-input"
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {getCryptoDisplayName(cryptoTo)}
                    </span>
                    <ChevronDown size={16} style={{ color: accentColor, opacity: 0.8 }} />
                  </button>
                  
                  {isOpenTo && (
                    <div
                      className="glass-panel"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '6px',
                        background: 'rgba(10, 12, 22, 0.96)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        zIndex: 100,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Search Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(10, 12, 22, 0.98)', zIndex: 1 }}>
                        <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '6px' }} />
                        <input
                          type="text"
                          placeholder="Search cryptocurrency..."
                          value={searchQueryTo}
                          onChange={(e) => setSearchQueryTo(e.target.value)}
                          className="glass-input"
                          style={{
                            flex: 1,
                            fontSize: '0.8rem',
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.02)',
                            border: 'none',
                            outline: 'none'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* Scrollable list */}
                      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                        {Object.keys(cryptoDetails)
                          .filter(c => {
                            const details = cryptoDetails[c];
                            const query = searchQueryTo.toLowerCase();
                            if (!query) return true;
                            if (c.toLowerCase().includes(query)) return true;
                            if (details) {
                              return details.name.toLowerCase().includes(query);
                            }
                            return false;
                          })
                          .map(c => {
                            const isSel = cryptoTo === c;
                            const details = cryptoDetails[c];
                            return (
                              <button
                                key={c}
                                onClick={() => {
                                  setCryptoTo(c);
                                  setIsOpenTo(false);
                                  setSearchQueryTo('');
                                }}
                                style={{
                                  padding: '8px 12px',
                                  background: isSel ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                  border: 'none',
                                  color: isSel ? accentColor : '#fff',
                                  fontSize: '0.82rem',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'all var(--transition-fast)'
                                }}
                                className="btn-glow"
                              >
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  {getCryptoDisplayName(c)}
                                </span>
                                {details && (
                                  <span style={{ fontSize: '0.78rem', color: isSel ? accentColor : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    {details.symbol}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeCategory === 'temperature' ? (
                <select
                  value={tempTo}
                  onChange={(e) => setTempTo(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  <option value="C" style={{ background: '#0a0c16', color: '#fff' }}>Celsius (°C)</option>
                  <option value="F" style={{ background: '#0a0c16', color: '#fff' }}>Fahrenheit (°F)</option>
                  <option value="K" style={{ background: '#0a0c16', color: '#fff' }}>Kelvin (K)</option>
                </select>
              ) : (
                <select
                  value={unitToIndex}
                  onChange={(e) => setUnitToIndex(parseInt(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  {converterUnits[activeCategory]?.units.map((unit, idx) => (
                    <option key={unit.name} value={idx} style={{ background: '#0a0c16', color: '#fff' }}>{unit.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          )}

          {/* Currency loading states / instructions */}
          {activeCategory === 'currency' && (
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'rgba(51, 255, 252, 0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(51, 255, 252, 0.08)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)'
              }}
            >
              <span>{isCurrencyLoading ? 'Syncing latest live foreign exchange markets...' : 'Rates are actively synced with global monetary feeds.'}</span>
              <span style={{ fontWeight: 600, color: accentColor }}>ONLINE SYNCED</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
