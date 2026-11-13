// SC02 — Z-Pattern Visual Hierarchy & KPI Cards · Snap to Grid (00:40–01:25).
import React from 'react';
import {useCurrentFrame, interpolate, spring} from 'remotion';
import {C, FONT, FPS, MONO} from '../theme';
import {Stage, TopBadge, Caption, Chip, Mix, Check} from '../kit';
import {KPI, fmt, fmtCompact} from '../data';

const SC = {from: 1200, dur: 1350};

const Spark: React.FC<{data: number[]; color: string; w?: number; h?: number}> = ({data, color, w = 90, h = 26}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / r) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / r) * (h - 4) - 2} r={3} fill={color} />
    </svg>
  );
};

export const Scene2: React.FC = () => {
  const local = useCurrentFrame();

  // Z-pattern trace progress (1200→1560)
  const zTrace = interpolate(local, [0, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // KPI cards reveal one by one (1560→2040)
  const kpiReveal = (i: number) => interpolate(local, [360 + i * 80, 440 + i * 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Snap to Grid (2040→2550)
  const snapP = interpolate(local, [840, 1080], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Snap glow pulse
  const snapGlow = Math.max(0, Math.sin((local - 840) * 0.2));

  // Z-pattern path points (in dashboard grid coords)
  const zPoints = [
    {x: 80, y: 90},    // top-left
    {x: 1840, y: 90},  // top-right
    {x: 80, y: 540},   // middle-left
    {x: 1840, y: 540}, // middle-right
  ];

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Z-Pattern Visual Hierarchy ──► Top Filters ──► Executive KPI Cards ──► Core Charts" from={60} to={720} color={C.green} />

      {/* Dashboard frame */}
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 740, background: C.card, border: `2px solid ${C.border}`, borderRadius: 14, overflow: 'hidden'}}>
        {/* Title bar */}
        <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 70, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 24px'}}>
          <div style={{width: 36, height: 36, background: C.green, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="2" width="7" height="7" fill="#fff" /><rect x="11" y="2" width="7" height="7" fill="#fff" opacity="0.8" /><rect x="2" y="11" width="7" height="7" fill="#fff" opacity="0.8" /><rect x="11" y="11" width="7" height="7" fill="#fff" /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginLeft: 14}}>لوحة قيادة المبيعات التنفيذية</span>
          {/* Filter chips */}
          <div style={{marginLeft: 'auto', display: 'flex', gap: 10}}>
            {['الفرع: الكل', 'السنة: 2026', 'الفئة: الكل'].map((x, i) => (
              <div key={i} style={{padding: '8px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, fontFamily: FONT, fontSize: 13, color: C.muted}}>
                {x}
              </div>
            ))}
          </div>
        </div>

        {/* Snap-to-grid ghost guides */}
        <div style={{position: 'absolute', inset: 0, opacity: snapP * 0.5, pointerEvents: 'none'}}>
          <svg width="1760" height="740" style={{position: 'absolute', inset: 0}}>
            {/* Vertical guides */}
            {[20, 460, 900, 1340, 1740].map((x) => (
              <line key={`v${x}`} x1={x} y1={90} x2={x} y2={680} stroke={C.green} strokeWidth={1} strokeDasharray="6 6" />
            ))}
            {/* Horizontal guides */}
            <line x1={20} y1={90} x2={1740} y2={90} stroke={C.green} strokeWidth={1} strokeDasharray="6 6" />
            <line x1={20} y1={250} x2={1740} y2={250} stroke={C.green} strokeWidth={1} strokeDasharray="6 6" />
            <line x1={20} y1={680} x2={1740} y2={680} stroke={C.green} strokeWidth={1} strokeDasharray="6 6" />
          </svg>
        </div>

        {/* Z-pattern trace */}
        <svg width="1760" height="740" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          <defs>
            <linearGradient id="zpath" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.green} stopOpacity="0.2" />
              <stop offset="100%" stopColor={C.green} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Top horizontal */}
          <line x1={zPoints[0].x} y1={zPoints[0].y} x2={zPoints[0].x + (zPoints[1].x - zPoints[0].x) * Math.min(1, zTrace * 2)} y2={zPoints[0].y} stroke="url(#zpath)" strokeWidth={3} strokeDasharray="8 6" />
          {/* Diagonal to middle */}
          {zTrace > 0.5 && (
            <line
              x1={zPoints[1].x}
              y1={zPoints[1].y}
              x2={zPoints[2].x + (zPoints[3].x - zPoints[2].x) * Math.max(0, (zTrace - 0.5) * 2)}
              y2={zPoints[3].y}
              stroke={C.green}
              strokeWidth={3}
              strokeDasharray="8 6"
              opacity={Math.min(1, (zTrace - 0.5) * 2)}
            />
          )}
          {/* Bottom horizontal */}
          {zTrace > 0.5 && (
            <line x1={zPoints[2].x} y1={zPoints[2].y} x2={zPoints[2].x + (zPoints[3].x - zPoints[2].x) * Math.min(1, (zTrace - 0.5) * 2)} y2={zPoints[2].y} stroke={C.green} strokeWidth={3} strokeDasharray="8 6" opacity={Math.min(1, (zTrace - 0.5) * 2)} />
          )}
          {/* Eye icon following Z path */}
          {zTrace < 1 && (() => {
            const seg = Math.floor(zTrace * 3);
            const segT = (zTrace * 3) % 1;
            const a = zPoints[seg] || zPoints[0];
            const b = zPoints[Math.min(seg + 1, 3)] || zPoints[3];
            const eyeX = a.x + (b.x - a.x) * segT;
            const eyeY = a.y + (b.y - a.y) * segT;
            return (
              <g transform={`translate(${eyeX}, ${eyeY})`}>
                <ellipse cx={0} cy={0} rx={14} ry={9} fill="none" stroke={C.green} strokeWidth={2} />
                <circle cx={0} cy={0} r={5} fill={C.green} />
              </g>
            );
          })()}
        </svg>

        {/* KPI Cards row (4 cards) */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 90, height: 160, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: '0 14px'}}>
          {KPI.map((k, i) => {
            const p = kpiReveal(i);
            const offY = (1 - p) * 24;
            return (
              <div key={i} style={{position: 'relative', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, opacity: p, transform: `translateY(${offY}px)`, boxShadow: snapP > 0 && snapP < 1 ? `0 0 ${20 * snapGlow}px ${C.green}66` : 'none'}}>
                <div style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>{k.label}</div>
                <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: k.color, marginTop: 4}}>{fmt(k.value, k.fmt as 'currency' | 'percent' | 'int')}{k.suffix}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6}}>
                  <div>
                    <span style={{fontFamily: MONO, fontSize: 12, color: k.arrow >= 0 ? C.green : C.red, fontWeight: 700}}>{k.arrow >= 0 ? '▲' : '▼'} {Math.abs(k.arrow).toFixed(1)}%</span>
                    <div style={{fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 2}}>vs 2025</div>
                  </div>
                  <Spark data={k.spark} color={k.color} />
                </div>
                {/* Snap badge */}
                {snapP > 0.3 && (
                  <div style={{position: 'absolute', right: 8, top: 8, fontSize: 10, fontFamily: MONO, color: C.green, opacity: snapP}}> snapped ✓</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Charts area */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 270, bottom: 30, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, padding: '0 14px'}}>
          <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, opacity: interpolate(local, [560, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            <div style={{fontFamily: FONT, fontSize: 14, color: C.muted, marginBottom: 8}}>اتجاه المبيعات الشهري · 2026</div>
            <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
              <polyline points="20,170 70,150 120,165 170,120 220,100 270,110 320,80 370,90 420,100 470,75 520,60 570,40" fill="none" stroke={C.green} strokeWidth={3} />
              <polyline points="20,170 70,150 120,165 170,120 220,100 270,110 320,80 370,90 420,100 470,75 520,60 570,40 570,195 20,195" fill={C.green} fillOpacity={0.15} stroke="none" />
            </svg>
          </div>
          <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, opacity: interpolate(local, [640, 760], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            <div style={{fontFamily: FONT, fontSize: 14, color: C.muted, marginBottom: 8}}>{'توزيع الفئات'}</div>
            <svg width="400" height="200" viewBox="0 0 200 180" preserveAspectRatio="xMidYMid meet">
              <circle cx="100" cy="90" r="60" fill="none" stroke="#334155" strokeWidth="24" />
              <circle cx="100" cy="90" r="60" fill="none" stroke={C.blue} strokeWidth="24" strokeDasharray="130 377" transform="rotate(-90 100 90)" />
              <circle cx="100" cy="90" r="60" fill="none" stroke={C.green} strokeWidth="24" strokeDasharray="85 377" strokeDashoffset="-130" transform="rotate(-90 100 90)" />
              <circle cx="100" cy="90" r="60" fill="none" stroke={C.purple} strokeWidth="24" strokeDasharray="55 377" strokeDashoffset="-215" transform="rotate(-90 100 90)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Alt+Drag hint */}
      <div style={{position: 'absolute', left: 80, top: 900, display: 'flex', alignItems: 'center', gap: 14, opacity: snapP}}>
        <div style={{background: C.deep, border: `2px solid ${C.green}`, borderRadius: 8, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: `0 0 20px ${C.green}55`}}>
          <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.green, padding: '4px 12px', background: C.card, borderRadius: 4, border: `1px solid ${C.green}`}}>Alt</span>
          <span style={{fontFamily: FONT, fontSize: 20, color: C.text}}>+</span>
          <svg width="50" height="20"><path d="M5 10 L40 10 M30 4 L40 10 L30 16" fill="none" stroke={C.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{fontFamily: FONT, fontSize: 18, fontWeight: 600, color: C.green}}>Snap to Grid · محاذاة دقيقة</span>
        </div>
        <Check size={36} p={snapP} />
        <Mix style={{fontFamily: FONT, fontSize: 20, fontWeight: 600, color: C.green}}>Uniform Card Padding ✓</Mix>
      </div>

      <Caption text="Z-Pattern Visual Hierarchy ──► Top Filters ──► Executive KPI Cards ──► Core Charts" from={60} to={720} tone="ok" />
      <Caption text="Precision Alignment ──► Use Alt + Drag (Snap to Grid) & Uniform Card Padding" from={840} to={1320} tone="ok" />
    </Stage>
  );
};
