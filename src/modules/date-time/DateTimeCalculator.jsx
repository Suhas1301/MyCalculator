import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, Globe } from 'lucide-react';

const timezonesList = [
  { name: 'Coordinated Universal Time (UTC)', offset: 0, code: 'UTC' },
  { name: 'India Standard Time (IST)', offset: 5.5, code: 'IST' },
  { name: 'Eastern Standard Time (EST)', offset: -5, code: 'EST' },
  { name: 'Pacific Standard Time (PST)', offset: -8, code: 'PST' },
  { name: 'British Summer Time (BST)', offset: 1, code: 'BST' },
  { name: 'Japan Standard Time (JST)', offset: 9, code: 'JST' }
];

export default function DateTimeCalculator() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('datetime');

  const [activeMode, setActiveMode] = useState('diff'); // diff, zone

  // Date diff states
  const [dateA, setDateA] = useState('2026-05-20');
  const [dateB, setDateB] = useState('2026-12-25');
  const [dateDiffResult, setDateDiffResult] = useState('');

  // Timezone converter states
  const [zoneAIdx, setZoneAIdx] = useState(0); // UTC
  const [zoneBIdx, setZoneBIdx] = useState(1); // IST
  const [timeInput, setTimeInput] = useState('12:00');
  const [timeResult, setTimeResult] = useState('');

  // Compute date difference
  useEffect(() => {
    calculateDateDiff();
  }, [dateA, dateB]);

  // Compute timezone conversions
  useEffect(() => {
    calculateTimezone();
  }, [zoneAIdx, zoneBIdx, timeInput]);

  const calculateDateDiff = () => {
    const dA = new Date(dateA);
    const dB = new Date(dateB);

    if (isNaN(dA) || isNaN(dB)) {
      setDateDiffResult('');
      return;
    }

    const diffTime = Math.abs(dB - dA);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const remainingDays = (diffDays % 365) % 30;

    setDateDiffResult({
      totalDays: diffDays,
      years,
      months,
      days: remainingDays,
      weeks: (diffDays / 7).toFixed(1)
    });
  };

  const calculateTimezone = () => {
    const zA = timezonesList[zoneAIdx];
    const zB = timezonesList[zoneBIdx];

    if (!zA || !zB || !timeInput) return;

    const [hours, minutes] = timeInput.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    // Convert Time A to UTC in minutes
    let timeInMinutes = hours * 60 + minutes;
    
    // Subtract offset A to get UTC minutes
    timeInMinutes = timeInMinutes - zA.offset * 60;
    
    // Add offset B to get Time B minutes
    let destMinutes = timeInMinutes + zB.offset * 60;
    
    // Wrap around 24 hours
    destMinutes = (destMinutes + 24 * 60) % (24 * 60);

    const destHrs = Math.floor(destMinutes / 60);
    const destMins = Math.floor(destMinutes % 60);

    const pad = (n) => n.toString().padStart(2, '0');
    setTimeResult(`${pad(destHrs)}:${pad(destMins)}`);
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
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Date & Time Calculator</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Precise chronological planners and global timezone synchronizers</p>
      </div>

      {/* Select Mode */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '6px',
          width: 'fit-content',
          flexWrap: 'wrap'
        }}
      >
        {[
          { id: 'diff', name: 'Date Difference', icon: Calendar, color: '#ec4899' },
          { id: 'zone', name: 'World Timezone Converter', icon: Globe, color: '#06b6d4' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '20px',
                border: isActive ? `1px solid ${accentColor}` : '1px solid var(--border-color)',
                background: isActive ? `${accentColor}26` : 'rgba(255, 255, 255, 0.02)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? `0 0 12px ${accentColor}40` : 'none'
              }}
            >
              <span style={{ color: isActive ? accentColor : 'rgba(255, 255, 255, 0.4)', display: 'inline-flex', alignItems: 'center' }}>
                <Icon size={16} />
              </span>
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Main calculation card split */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '16px'
        }}
      >
        {/* Left Input Configuration */}
        {activeMode === 'diff' ? (
          <div 
            className="glass-panel"
            style={{
              padding: '20px',
              background: 'rgba(16, 20, 35, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Configure Calendar Dates</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Start Date</label>
                <input
                  type="date"
                  value={dateA}
                  onChange={(e) => setDateA(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>End Date</label>
                <input
                  type="date"
                  value={dateB}
                  onChange={(e) => setDateB(e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Timezone Converter Panel */
          <div 
            className="glass-panel"
            style={{
              padding: '20px',
              background: 'rgba(16, 20, 35, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Configure Timezones</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'flex-end' }}>
              {/* Time input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Input Local Time</label>
                <input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="glass-input math-mono"
                />
              </div>

              {/* Source Timezone select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>From Zone</label>
                <select
                  value={zoneAIdx}
                  onChange={(e) => setZoneAIdx(parseInt(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  {timezonesList.map((z, idx) => (
                    <option key={z.code} value={idx} style={{ background: '#0a0c16' }}>{z.code}</option>
                  ))}
                </select>
              </div>

              {/* Target Timezone select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>To Zone</label>
                <select
                  value={zoneBIdx}
                  onChange={(e) => setZoneBIdx(parseInt(e.target.value))}
                  className="glass-input"
                  style={{ width: '100%', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  {timezonesList.map((z, idx) => (
                    <option key={z.code} value={idx} style={{ background: '#0a0c16' }}>{z.code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Visual results panel */}
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
            textAlign: 'center'
          }}
        >
          {activeMode === 'diff' ? (
            <>
              <Calendar size={36} style={{ color: accentColor }} />
              <div>
                <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 6px 0' }}>Calendar Interval</h3>
                {dateDiffResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="math-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                      {dateDiffResult.totalDays} Days
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      or {dateDiffResult.years} Years, {dateDiffResult.months} Months, {dateDiffResult.days} Days
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Total Weeks: {dateDiffResult.weeks} weeks
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure valid dates to evaluate interval.</span>
                )}
              </div>
            </>
          ) : (
            <>
              <Globe size={36} style={{ color: accentColor }} />
              <div>
                <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 6px 0' }}>Converted Destination Time</h3>
                <div className="math-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
                  {timeResult || '--:--'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {timezonesList[zoneAIdx].code} to {timezonesList[zoneBIdx].code} comparison
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
