import React from 'react';

export const currencyDetails = {
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
  ILS: { country: 'Israel', name: 'Shekel', symbol: '₪', flag: '🇮🇱' },
  // Additional important countries
  EGP: { country: 'Egypt', name: 'Pound', symbol: 'E£', flag: '🇪🇬' },
  VND: { country: 'Vietnam', name: 'Dong', symbol: '₫', flag: '🇻🇳' },
  ARS: { country: 'Argentina', name: 'Peso', symbol: '$', flag: '🇦🇷' },
  CLP: { country: 'Chile', name: 'Peso', symbol: '$', flag: '🇨🇱' },
  COP: { country: 'Colombia', name: 'Peso', symbol: '$', flag: '🇨🇴' },
  NGN: { country: 'Nigeria', name: 'Naira', symbol: '₦', flag: '🇳🇬' },
  KES: { country: 'Kenya', name: 'Shilling', symbol: 'KSh', flag: '🇰🇪' },
  PKR: { country: 'Pakistan', name: 'Rupee', symbol: '₨', flag: '🇵🇰' },
  BDT: { country: 'Bangladesh', name: 'Taka', symbol: '৳', flag: '🇧🇩' },
  LKR: { country: 'Sri Lanka', name: 'Rupee', symbol: 'Rs', flag: '🇱🇰' },
  MAD: { country: 'Morocco', name: 'Dirham', symbol: 'MAD', flag: '🇲🇦' }
};

export const getDisplayName = (code) => {
  const details = currencyDetails[code];
  if (details) {
    const isoMap = {
      USD: 'us', EUR: 'eu', GBP: 'gb', INR: 'in', JPY: 'jp', CAD: 'ca', AUD: 'au',
      CHF: 'ch', CNY: 'cn', NZD: 'nz', AED: 'ae', SAR: 'sa', SGD: 'sg', HKD: 'hk',
      SEK: 'se', KRW: 'kr', MXN: 'mx', BRL: 'br', ZAR: 'za', RUB: 'ru', TRY: 'tr',
      NOK: 'no', DKK: 'dk', PLN: 'pl', THB: 'th', IDR: 'id', MYR: 'my', PHP: 'ph', ILS: 'il',
      EGP: 'eg', VND: 'vn', ARS: 'ar', CLP: 'cl', COP: 'co', NGN: 'ng', KES: 'ke', PKR: 'pk', BDT: 'bd', LKR: 'lk',
      MAD: 'ma'
    };
    const isoCode = isoMap[code] || code.slice(0, 2).toLowerCase();
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img 
          src={`https://flagcdn.com/w20/${isoCode}.png`} 
          width="20" 
          alt={details.country}
          style={{ borderRadius: '2px', boxShadow: '0 0 4px rgba(0,0,0,0.3)' }}
        />
        <span>{details.country} ({code})</span>
      </div>
    );
  }
  return <span>{code} ({code})</span>;
};
