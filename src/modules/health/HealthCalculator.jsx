import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartPulse, User, Dumbbell, Droplet } from 'lucide-react';

const bmiRanges = [
  {
    name: 'Underweight',
    range: '< 18.5',
    description: 'Minimal body fat. May indicate nutritional deficiency or health issues.',
    color: '#00f0ff',
    activeCheck: (val) => val > 0 && val < 18.5
  },
  {
    name: 'Healthy Weight',
    range: '18.5 - 24.9',
    description: 'Optimal body composition. Low risk of weight-related health conditions.',
    color: '#00ff66',
    activeCheck: (val) => val >= 18.5 && val < 25.0
  },
  {
    name: 'Overweight',
    range: '25.0 - 29.9',
    description: 'Increased body fat. Moderate risk of developing weight-related conditions.',
    color: '#ffd700',
    activeCheck: (val) => val >= 25.0 && val < 30.0
  },
  {
    name: 'Obese',
    range: '≥ 30.0',
    description: 'High body fat concentration. Elevated risk for metabolic and cardiovascular disease.',
    color: '#ff3366',
    activeCheck: (val) => val >= 30.0
  }
];

export default function HealthCalculator() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('health');

  const [activeTab, setActiveTab] = useState('bmi'); // bmi, bmr

  // Common/BMI states
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(175); // cm
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male'); // male, female

  // BMR activity state
  const [activity, setActivity] = useState(1.375); // activity multiplier

  // Computation results
  const [bmi, setBmi] = useState(0);
  const [bmiCategory, setBmiCategory] = useState({ name: 'Normal', color: '#00ff66' });
  const [bmr, setBmr] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    calculateHealth();
  }, [activeTab, weight, height, age, gender, activity]);

  const calculateHealth = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // meters
    const a = parseInt(age);

    if (isNaN(w) || isNaN(h) || h <= 0 || w <= 0) return;

    // BMI = weight / height^2
    const computedBmi = w / (h * h);
    setBmi(computedBmi);

    // BMI Category
    if (computedBmi < 18.5) {
      setBmiCategory({ name: 'Underweight', color: '#00f0ff' });
    } else if (computedBmi < 25.0) {
      setBmiCategory({ name: 'Healthy Weight', color: '#00ff66' });
    } else if (computedBmi < 30.0) {
      setBmiCategory({ name: 'Overweight', color: '#ffd700' });
    } else {
      setBmiCategory({ name: 'Obese', color: '#ff3366' });
    }

    // BMR (Harris-Benedict Equation)
    let computedBmr = 0;
    if (gender === 'male') {
      computedBmr = 88.362 + (13.397 * w) + (4.799 * (h * 100)) - (5.677 * a);
    } else {
      computedBmr = 447.593 + (9.247 * w) + (3.098 * (h * 100)) - (4.330 * a);
    }
    setBmr(computedBmr);

    // Active calories
    setCalories(computedBmr * parseFloat(activity));
  };

  // Render linear SVG gauge for BMI
  const renderBmiGauge = () => {
    // Normal range is 15 to 35
    const minVal = 15;
    const maxVal = 35;
    const clampedBmi = Math.max(minVal, Math.min(maxVal, bmi));
    
    // Percentage along the bar
    const percentage = ((clampedBmi - minVal) / (maxVal - minVal)) * 100;

    return (
      <div style={{ width: '100%', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
          <span>15 (Under)</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>35 (Obese)</span>
        </div>
        
        {/* Colorful linear bar */}
        <div 
          style={{ 
            height: '8px', 
            width: '100%', 
            borderRadius: '4px',
            background: 'linear-gradient(to right, #00f0ff 0%, #00f0ff 17.5%, #00ff66 17.5%, #00ff66 50%, #ffd700 50%, #ffd700 75%, #ff3366 75%, #ff3366 100%)',
            position: 'relative'
          }}
        >
          {/* Slider cursor indicator */}
          <div 
            style={{
              position: 'absolute',
              top: '-3px',
              left: `${percentage}%`,
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#fff',
              border: `2.5px solid ${bmiCategory.color}`,
              boxShadow: `0 0 10px ${bmiCategory.color}`,
              transform: 'translateX(-50%)',
              transition: 'left 0.5s ease',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    );
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
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>Health & Fitness Lab</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Basal metabolic rate formulas and body mass composition indexes</p>
      </div>

      {/* Select Tab */}
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
          { id: 'bmi', name: 'Body Mass Index (BMI)', icon: User, color: '#10b981' },
          { id: 'bmr', name: 'BMR & Calories', icon: HeartPulse, color: '#f43f5e' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* Grid splits */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Left Inputs configuration */}
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
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Configure Parameters</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="glass-input math-mono"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="glass-input math-mono"
              />
            </div>

            {activeTab === 'bmr' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="glass-input math-mono"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Biological Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="glass-input font-sans"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="male" style={{ background: '#0a0c16' }}>Male</option>
                    <option value="female" style={{ background: '#0a0c16' }}>Female</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Active Lifestyle Scale</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(parseFloat(e.target.value))}
                    className="glass-input font-sans"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="1.2" style={{ background: '#0a0c16' }}>Sedentary (No exercise)</option>
                    <option value="1.375" style={{ background: '#0a0c16' }}>Lightly Active (Exercise 1-3 days/wk)</option>
                    <option value="1.55" style={{ background: '#0a0c16' }}>Moderately Active (Exercise 3-5 days/wk)</option>
                    <option value="1.725" style={{ background: '#0a0c16' }}>Very Active (Hard exercise 6-7 days/wk)</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Output visual panels */}
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
          {activeTab === 'bmi' ? (
            <>
              <HeartPulse size={36} style={{ color: accentColor }} />
              <div style={{ width: '100%' }}>
                <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 6px 0' }}>Body Mass Index</h3>
                <div className="math-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
                  {bmi.toFixed(1)}
                </div>
                <span className="badge" style={{ background: `${bmiCategory.color}15`, color: bmiCategory.color, border: `1px solid ${bmiCategory.color}35`, display: 'inline-block', marginTop: '6px' }}>
                  {bmiCategory.name}
                </span>
                
                {/* Horizontal slider gauge */}
                {renderBmiGauge()}
              </div>
            </>
          ) : (
            <>
              <Dumbbell size={36} style={{ color: accentColor }} />
              <div style={{ width: '100%' }}>
                <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>BMR (Basal Calories)</h3>
                <div className="math-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  {bmr.toFixed(0)} <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>kcal/day</span>
                </div>
                
                <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '8px 0 4px 0', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>TDEE (Active Calories)</h3>
                <div className="math-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: accentColor }}>
                  {calories.toFixed(0)} <span style={{ fontSize: '0.78rem', color: '#fff' }}>kcal/day</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* WHO BMI Classification Reference Chart */}
      {activeTab === 'bmi' && (
        <div
          style={{
            marginTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <h3 style={{ fontSize: '1.0rem', fontWeight: 700, color: '#fff', margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={16} style={{ color: accentColor }} />
            WHO BMI Classification Reference
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              width: '100%'
            }}
          >
            {bmiRanges.map((range) => {
              const isActive = bmi > 0 && range.activeCheck(bmi);
              return (
                <div
                  key={range.name}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    background: isActive ? 'rgba(255, 255, 255, 0.04)' : 'rgba(16, 20, 35, 0.2)',
                    border: isActive ? `1.5px solid ${range.color}` : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: isActive ? `0 0 15px ${range.color}25, inset 0 0 10px ${range.color}15` : 'none',
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: bmi > 0 ? (isActive ? 1.0 : 0.6) : 0.9,
                    transform: isActive ? 'translateY(-2px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? '#fff' : 'var(--text-secondary)' }}>
                      {range.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: isActive ? `${range.color}20` : 'rgba(255,255,255,0.03)',
                        color: range.color,
                        border: `1px solid ${isActive ? range.color + '40' : 'rgba(255,255,255,0.05)'}`
                      }}
                    >
                      {range.range}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                    {range.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
