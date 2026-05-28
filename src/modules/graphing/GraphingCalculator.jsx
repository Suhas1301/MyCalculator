import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateExpression } from '../../utils/mathParser';
import { Plus, Trash2, Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut, Info } from 'lucide-react';

export default function GraphingCalculator() {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor('graphing');
  const canvasRef = useRef(null);

  // ================= 2D STATE VARIABLES =================
  const [equations, setEquations] = useState([]);
  const [newEqText, setNewEqText] = useState('');
  const [scale, setScale] = useState(40); // Pixels per unit
  const [center, setCenter] = useState({ x: 0, y: 0 }); // Center coordinate of the viewport in math units
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, mathX: 0, mathY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const centerStart = useRef({ x: 0, y: 0 });

  // Preset Colors for graph lines
  const colorsPreset = ['#00f0ff', '#bd00ff', '#00ff66', '#ffd700', '#ff3366', '#ff6b00'];

  // ================= 2D GRAPHING DRAW FUNCTION =================
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear with semi-transparent deep space color
    ctx.fillStyle = '#06080d';
    ctx.fillRect(0, 0, width, height);

    // Calculate grid center in pixels
    const pixelCenterX = width / 2 - center.x * scale;
    const pixelCenterY = height / 2 + center.y * scale;

    // Draw Grid Lines & Numbers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '10px var(--font-sans)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const step = 1; // 1 unit per grid line
    const gridSpacing = step * scale;

    // Vertical grid lines
    const startX = pixelCenterX % gridSpacing;
    for (let x = startX; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Label math coordinates on X axis
      const val = ((x - pixelCenterX) / scale).toFixed(0);
      if (val !== '0') {
        ctx.fillText(val, x, Math.min(Math.max(15, pixelCenterY + 12), height - 15));
      }
    }

    // Horizontal grid lines
    const startY = pixelCenterY % gridSpacing;
    for (let y = startY; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Label math coordinates on Y axis
      const val = (-(y - pixelCenterY) / scale).toFixed(0);
      if (val !== '0') {
        ctx.textAlign = 'right';
        ctx.fillText(val, Math.min(Math.max(15, pixelCenterX - 8), width - 8), y);
      }
    }

    // Draw Primary Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;

    // Y-Axis
    ctx.beginPath();
    ctx.moveTo(pixelCenterX, 0);
    ctx.lineTo(pixelCenterX, height);
    ctx.stroke();

    // X-Axis
    ctx.beginPath();
    ctx.moveTo(0, pixelCenterY);
    ctx.lineTo(width, pixelCenterY);
    ctx.stroke();

    // Label origin
    ctx.textAlign = 'right';
    ctx.fillText('0', pixelCenterX - 6, pixelCenterY + 10);

    // Plot Active Equations
    equations.forEach(eq => {
      if (!eq.active) return;

      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      let isFirst = true;

      // Plot line by iterating over each pixel on the X axis
      for (let pixelX = 0; pixelX < width; pixelX += 2) {
        // Convert screen pixelX to math coordinate x
        const x = (pixelX - pixelCenterX) / scale;

        try {
          // Evaluate math parser for x
          const y = evaluateExpression(eq.text, { x });

          if (!isNaN(y) && isFinite(y)) {
            // Convert math coordinate y to screen pixelY
            const pixelY = pixelCenterY - y * scale;

            // Draw lines inside canvas viewport
            if (pixelY >= -100 && pixelY <= height + 100) {
              if (isFirst) {
                ctx.moveTo(pixelX, pixelY);
                isFirst = false;
              } else {
                ctx.lineTo(pixelX, pixelY);
              }
            } else {
              isFirst = true; // reset path if jumps out of view
            }
          } else {
            isFirst = true;
          }
        } catch (e) {
          isFirst = true;
        }
      }
      ctx.stroke();
    });

    // Draw mouse crosshair / hover coordinate tracking
    if (isHovering && !isDragging) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;

      // Vertical crosshair
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, height);
      ctx.stroke();

      // Horizontal crosshair
      ctx.beginPath();
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(width, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Floating coordinates card
      const label = `(${mousePos.mathX.toFixed(2)}, ${mousePos.mathY.toFixed(2)})`;
      ctx.fillStyle = 'rgba(16, 20, 35, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      const textWidth = ctx.measureText(label).width;
      const cardW = textWidth + 24;
      const cardH = 26;
      let cardX = mousePos.x + 15;
      let cardY = mousePos.y - 15;

      // Boundary check for coordinates popup
      if (cardX + cardW > width) cardX = mousePos.x - cardW - 15;
      if (cardY - cardH < 0) cardY = mousePos.y + 15;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY - cardH, cardW, cardH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = '11px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, cardX + cardW / 2, cardY - cardH / 2);
    }
  };

  // Canvas size resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 450;
      draw();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [equations, center, scale, isHovering, mousePos, isDragging]);

  // Redraw when viewport drag properties change
  useEffect(() => {
    draw();
  }, [equations, center, scale, isHovering, mousePos, isDragging]);

  // ================= INTERACTIVE MOUSE EVENT HANDLERS =================
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    dragStart.current = { x, y };
    centerStart.current = { ...center };
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = x - dragStart.current.x;
      const deltaY = y - dragStart.current.y;

      setCenter({
        x: centerStart.current.x - deltaX / scale,
        y: centerStart.current.y + deltaY / scale
      });
    } else {
      // Compute grid hover mathematical coordinates
      const pixelCenterX = canvas.width / 2 - center.x * scale;
      const pixelCenterY = canvas.height / 2 + center.y * scale;
      const mathX = (x - pixelCenterX) / scale;
      const mathY = -(y - pixelCenterY) / scale;

      setMousePos({ x, y, mathX, mathY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor) => {
    setScale(prev => Math.max(10, Math.min(500, prev * factor)));
  };

  const resetViewport = () => {
    setScale(40);
    setCenter({ x: 0, y: 0 });
  };

  // ================= 2D EQUATION MANAGER ACTIONS =================
  const addEquation = (e) => {
    e.preventDefault();
    if (!newEqText.trim()) return;

    const nextColor = colorsPreset[equations.length % colorsPreset.length];
    const newEq = {
      id: Date.now().toString(),
      text: newEqText.trim(),
      color: nextColor,
      active: true
    };

    setEquations(prev => [...prev, newEq]);
    setNewEqText('');
  };

  const deleteEquation = (id) => {
    setEquations(prev => prev.filter(eq => eq.id !== id));
  };

  const toggleEquation = (id) => {
    setEquations(prev => prev.map(eq => eq.id === id ? { ...eq, active: !eq.active } : eq));
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
      {/* Dynamic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#fff' }}>
            2D Equation Grapher
          </h2>

        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => handleZoom(1.2)} className="btn-glow" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', borderRadius: '6px' }}>
            <ZoomIn size={14} style={{ color: accentColor }} /> Zoom In
          </button>
          <button onClick={() => handleZoom(0.85)} className="btn-glow" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', borderRadius: '6px' }}>
            <ZoomOut size={14} style={{ color: accentColor }} /> Zoom Out
          </button>
          <button onClick={resetViewport} className="btn-glow" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', borderRadius: '6px' }}>
            <RotateCcw size={14} style={{ color: accentColor }} /> Reset View
          </button>
        </div>
      </div>

      {/* Main Graph Panel Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '16px',
          flex: 1,
          minHeight: 0
        }}
        className="grid-mobile-1fr"
      >
        {/* Equations Input Panel */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            background: 'rgba(16, 20, 35, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto'
          }}
        >
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>Equations</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Enter explicit functions of x, like <code>x^2 - 1</code> or <code>sin(x)</code></p>
          </div>

          {/* Add Equation Form */}
          <form onSubmit={addEquation} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: accentColor
                }}
              >
                y =
              </span>
              <input
                type="text"
                placeholder="sin(x) * cos(x)"
                value={newEqText}
                onChange={(e) => setNewEqText(e.target.value)}
                className="glass-input"
                style={{
                  width: '100%',
                  paddingLeft: '32px',
                  fontSize: '0.88rem'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-glow"
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: 'rgba(0, 255, 102, 0.05)',
                borderColor: accentColor,
                color: accentColor
              }}
            >
              <Plus size={18} />
            </button>
          </form>

          {/* Equations List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
            {equations.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                No active equations. Enter a function of x above (e.g. sin(x)) to begin plotting.
              </div>
            ) : (
              equations.map((eq) => (
                <div
                  key={eq.id}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${eq.active ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255,255,255,0.02)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    opacity: eq.active ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1 }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: eq.color,
                        boxShadow: `0 0 10px ${eq.color}`,
                        flexShrink: 0
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span
                        className="math-mono"
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        y = {eq.text}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button
                      onClick={() => toggleEquation(eq.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="btn-glow"
                      title={eq.active ? 'Hide function' : 'Show function'}
                    >
                      {eq.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => deleteEquation(eq.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-chemistry)',
                        cursor: 'pointer',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="btn-glow"
                      title="Delete equation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>


        </div>

        {/* Interactive Plot Canvas Panel */}
        <div
          className="glass-panel"
          style={{
            position: 'relative',
            background: '#06080d',
            height: '100%',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'crosshair'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { setIsHovering(false); setIsDragging(false); }}
          onMouseEnter={() => setIsHovering(true)}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
}
