// SC05 — Enterprise Execution on manzooma_sales_2026.xlsx (02:50–03:30).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {KPI, BRANCHES, MONTHS, TREND, CATEGORIES, fmt, fmtCompact} from '../data';

const SC = {from: 5100, dur: 1200};

const Spark: React.FC<{data: number[]; color: string; w?: number; h?: number}> = ({data, color, w = 110, h = 32}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / r) * (h - 6) - 3}`).join(' ');
  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id={`spark-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`${pts} ${w},${h} 0,${h}`} fill={`url(#spark-${color.slice(1)})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / r) * (h - 6) - 3} r={3.5} fill={color} />
    </svg>
  );
};

export const Scene5: React.FC = () => {
  const local = useCurrentFrame();

  // File load (0→120)
  const loadP = interpolate(local, [0, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Dashboard build (5220→5400)
  const buildP = interpolate(local, [120, 300], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Slicer interaction (5400→5700)
  const filterP = interpolate(local, [300, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Latency benchmark (5700→6000)
  const benchP = interpolate(local, [600, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Enterprise seal (6000→6300)
  const sealP = interpolate(local, [900, 1180], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Animated latency value
  const latency = (1 - benchP) * 8 + 1.8;

  return (
    <Stage dur={SC.dur} inFx="left" outFx="up">
      <TopBadge text="Enterprise Sales Cockpit ──► 4 Dynamic KPI Cards + Horizontal Slicers + 3 Synced Charts (50,000 Rows)" from={60} to={630} color={C.green} />

      {/* File load banner */}
      {loadP < 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', opacity: loadP}}>
          <div style={{background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, padding: '20px 40px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 0 30px ${C.blue}44`}}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <rect x="6" y="4" width="28" height="32" rx="2" fill={C.green} />
              <rect x="6" y="4" width="28" height="8" fill="#0B5B33" />
              <path d="M12 18 H28 M12 22 H28 M12 26 H22" stroke="#fff" strokeWidth="1.5" />
            </svg>
            <div>
              <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.text}}>manzooma_sales_2026.xlsx</div>
              <div style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>loading 50,000 rows · 12 columns · 4.2 MB</div>
            </div>
            <div style={{width: 50, height: 50}}>
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke={C.border} strokeWidth="3" />
                <circle cx="25" cy="25" r="20" fill="none" stroke={C.blue} strokeWidth="3" strokeDasharray={`${loadP * 125.6} 125.6`} transform="rotate(-90 25 25)" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Final dashboard */}
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 740, background: C.card, border: `2px solid ${C.green}`, borderRadius: 14, overflow: 'hidden', opacity: buildP, boxShadow: `0 0 40px ${C.green}44`}}>
        {/* Title bar */}
        <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 64, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 24px'}}>
          <div style={{width: 36, height: 36, background: C.green, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="2" width="7" height="7" fill="#fff" /><rect x="11" y="2" width="7" height="7" fill="#fff" opacity="0.85" /><rect x="2" y="11" width="7" height="7" fill="#fff" opacity="0.85" /><rect x="11" y="11" width="7" height="7" fill="#fff" /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.text, marginLeft: 14}}>منظومة ستور · لوحة قيادة المبيعات التنفيذية</span>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 13, color: C.muted}}>
            <span>manzooma_sales_2026.xlsx</span>
            <span>·</span>
            <span style={{color: C.green}}>50,000 rows</span>
          </div>
        </div>

        {/* Horizontal Slicers */}
        <div style={{position: 'absolute', left: 16, right: 16, top: 76, height: 50, display: 'flex', gap: 12, alignItems: 'center', padding: '0 12px'}}>
          <div style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>الفروع:</div>
          <div style={{display: 'flex', gap: 4}}>
            {BRANCHES.slice(0, 6).map((b, i) => {
              const sel = filterP > 0.3 && i !== 4; // skip one branch when filter active
              return (
                <div key={i} style={{padding: '6px 10px', background: sel ? C.green : C.deep, color: sel ? '#0B1222' : C.muted, borderRadius: 4, fontFamily: FONT, fontSize: 11, fontWeight: 600, border: `1px solid ${sel ? C.green : C.border}`, transition: 'all 0.2s'}}>
                  {b.short}
                </div>
              );
            })}
          </div>
          <div style={{width: 1, height: 32, background: C.border}} />
          <div style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>السنة:</div>
          <div style={{display: 'flex', gap: 4}}>
            {['2024', '2025', '2026'].map((y, i) => {
              const sel = y === '2026';
              return (
                <div key={i} style={{padding: '6px 12px', background: sel ? C.amber : C.deep, color: sel ? '#0B1222' : C.muted, borderRadius: 4, fontFamily: MONO, fontSize: 11, fontWeight: 700, border: `1px solid ${sel ? C.amber : C.border}`}}>
                  {y}
                </div>
              );
            })}
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, opacity: filterP}}>
            <span style={{fontFamily: MONO, fontSize: 11, color: C.green}}>●</span>
            <span style={{fontFamily: MONO, fontSize: 11, color: C.green}}>live sync</span>
          </div>
        </div>

        {/* KPI Cards (4) */}
        <div style={{position: 'absolute', left: 16, right: 16, top: 138, height: 130, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '0 12px'}}>
          {KPI.map((k, i) => {
            const p = interpolate(local, [140 + i * 30, 240 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const filterApplied = filterP > 0.3 && filterP < 0.7 ? Math.abs(Math.sin((local - 300) * 0.3)) * 5 : 0;
            return (
              <div key={i} style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, opacity: p, transform: `translateY(${(1 - p) * 12}px)`, borderLeft: `4px solid ${k.color}`}}>
                <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{k.label}</div>
                <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: k.color, marginTop: 2}}>
                  {fmt(k.value + (filterApplied > 0 && i === 0 ? -120000 : 0), k.fmt as 'currency' | 'percent' | 'int')}{k.suffix}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4}}>
                  <div>
                    <span style={{fontFamily: MONO, fontSize: 12, color: k.arrow >= 0 ? C.green : C.red, fontWeight: 700}}>{k.arrow >= 0 ? '▲' : '▼'} {Math.abs(k.arrow + (filterApplied > 0 && i === 2 ? -0.5 : 0)).toFixed(1)}%</span>
                  </div>
                  <Spark data={k.spark} color={k.color} w={90} h={24} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div style={{position: 'absolute', left: 16, right: 16, top: 290, bottom: 16, display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 12, padding: '0 12px'}}>
          {/* Trend line chart */}
          <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
              <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text}}>اتجاه المبيعات الشهري</div>
              <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>2026</div>
            </div>
            <svg width="100%" height="240" viewBox="0 0 600 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.blue} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[60, 120, 180, 240].map((y) => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#1E293B" strokeWidth="1" />)}
              {/* Area */}
              <polyline points={TREND.map((d, i) => `${(i / (TREND.length - 1)) * 580 + 10},${230 - (d.v / 1600) * 200}`).join(' ') + ` 590,240 10,240`} fill="url(#trend-area)" stroke="none" />
              {/* Line */}
              <polyline points={TREND.map((d, i) => `${(i / (TREND.length - 1)) * 580 + 10},${230 - (d.v / 1600) * 200}`).join(' ')} fill="none" stroke={C.blue} strokeWidth={2.5} />
              {/* X labels */}
              {TREND.map((d, i) => i % 2 === 0 && <text key={i} x={(i / (TREND.length - 1)) * 580 + 10} y="236" fontSize="10" fill={C.muted} textAnchor="middle" fontFamily="monospace">{d.m}</text>)}
            </svg>
          </div>

          {/* Branch bar chart */}
          <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12}}>
            <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8}}>حصة الفروع</div>
            <svg width="100%" height="240" viewBox="0 0 280 240" preserveAspectRatio="none">
              {BRANCHES.map((b, i) => {
                const h = (b.pct / 35) * 200;
                return (
                  <g key={i}>
                    <rect x={20 + i * 44} y={220 - h} width="32" height={h} fill={C.green} rx={2} />
                    <text x={36 + i * 44} y="234" fontSize="10" fill={C.muted} textAnchor="middle" fontFamily="monospace">{b.short}</text>
                    <text x={36 + i * 44} y={220 - h - 4} fontSize="9" fill={C.text} textAnchor="middle" fontFamily="monospace">{b.pct.toFixed(0)}%</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Category donut */}
          <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12}}>
            <div style={{fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8}}>توزيع الفئات</div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200}}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="60" fill="none" stroke="#334155" strokeWidth="24" />
                {(() => {
                  let offset = 0;
                  const total = CATEGORIES.reduce((s, c) => s + c.value, 0);
                  return CATEGORIES.map((c, i) => {
                    const len = (c.value / total) * 377;
                    const el = (
                      <circle
                        key={i}
                        cx="90"
                        cy="90"
                        r="60"
                        fill="none"
                        stroke={c.color}
                        strokeWidth="24"
                        strokeDasharray={`${len} 377`}
                        strokeDashoffset={-offset}
                        transform="rotate(-90 90 90)"
                      />
                    );
                    offset += len;
                    return el;
                  });
                })()}
                <text x="90" y="86" textAnchor="middle" fill={C.text} fontFamily="monospace" fontSize="20" fontWeight="700">5</text>
                <text x="90" y="105" textAnchor="middle" fill={C.muted} fontFamily="monospace" fontSize="11">فئات</text>
              </svg>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center'}}>
              {CATEGORIES.map((c, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 4, fontFamily: MONO, fontSize: 9, color: C.muted}}>
                  <div style={{width: 8, height: 8, background: c.color, borderRadius: 2}} />
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latency benchmark */}
      <div style={{position: 'absolute', left: 80, top: 900, width: 880, opacity: benchP}}>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 0 30px ${C.green}33`}}>
          <div style={{position: 'relative', width: 80, height: 80}}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke={C.border} strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={C.green} strokeWidth="6" strokeDasharray={`${benchP * 213.6} 213.6`} transform="rotate(-90 40 40)" strokeLinecap="round" />
            </svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>{latency.toFixed(1)}ms</span>
              <span style={{fontFamily: MONO, fontSize: 8, color: C.muted}}>refresh</span>
            </div>
          </div>
          <div>
            <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.text}}>Zero-Latency UX Performance</div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginTop: 2}}>50,000 rows · محرك Excel بيحدّث الداشبورد في &lt;2ms مع كل ضغطة فلتر</div>
          </div>
        </div>
      </div>

      {/* Enterprise seal */}
      <div style={{position: 'absolute', right: 80, top: 900, opacity: sealP}}>
        <div style={{background: `linear-gradient(135deg, ${C.green}, ${C.blue})`, borderRadius: 12, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: `0 0 40px ${C.green}66`, transform: `scale(${0.8 + 0.2 * sealP})`}}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="24" cy="24" r="18" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M14 24 L21 31 L34 17" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: '#fff'}}>Enterprise Dashboard UX</div>
            <div style={{fontFamily: MONO, fontSize: 12, color: '#fff', opacity: 0.85}}>BI-Grade Executive Cockpit · Manzooma Verified</div>
          </div>
        </div>
      </div>

      <Caption text="Enterprise Sales Cockpit ──► 4 Dynamic KPI Cards + Horizontal Slicers + 3 Synced Charts (50,000 Rows)" from={60} to={630} tone="ok" />
      <Caption text="Zero Latency UX Performance ──► High-Speed Interactive Dashboard Engine Responding in <2ms" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
