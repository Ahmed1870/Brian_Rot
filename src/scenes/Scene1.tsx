// SC01 — Dashboard UX Engine: chaotic sheet vs single-screen cockpit (00:00–00:40).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Chip, Mix, Check, Warn} from '../kit';

const SC = {from: 0, dur: 1200};

export const Scene1: React.FC = () => {
  const local = useCurrentFrame();

  // Chaotic sheet entrance — fades out by frame 540
  const chaosOp = interpolate(local, [0, 60, 540, 720], [0, 1, 1, 0]);
  // Cockpit assembly starts at 180, full by 720
  const cockpitP = interpolate(local, [180, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final verdict: 5-second clarity check by 1000
  const sealP = interpolate(local, [900, 1080], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // KPI card values for the cockpit (static preview)
  const kpis = [
    {l: 'إجمالي المبيعات', v: '12.8M', s: 'ج.م', d: '+14.2%', col: C.green},
    {l: 'صافي الربح', v: '3.21M', s: 'ج.م', d: '+9.8%', col: C.blue},
    {l: 'هامش الربح', v: '25.0%', s: '', d: '-1.4%', col: C.purple},
    {l: 'معدل النمو', v: '+14.2%', s: '', d: 'YoY', col: C.amber},
  ];

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="left">
      <TopBadge text="الدرس 69 من 76 ──► الوحدة 13 من 14 ──► Dashboard Design & Executive UX Engine" from={60} to={1140} color={C.blue} />

      {/* Chaotic sheet on the left */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 760, height: 620, opacity: chaosOp}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <Warn size={42} color={C.red} />
          <div style={{fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.red}}>شيت مزدحم · تدوّه الإدارة</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 30px ${C.red}33`}}>
          <svg width="760" height="560" style={{position: 'absolute', inset: 0}}>
            {/* Tiny cells scattered everywhere */}
            {Array.from({length: 18}).map((_, i) => {
              const x = 20 + (i % 6) * 120 + Math.sin(i) * 30;
              const y = 30 + Math.floor(i / 6) * 80 + Math.cos(i) * 20;
              const w = 80 + (i * 13) % 60;
              const h = 30 + (i * 7) % 30;
              const c = ['#EF4444', '#F59E0B', '#A855F7', '#FBBF24'][i % 4];
              return <rect key={i} x={x} y={y} width={w} height={h} fill={c} fillOpacity={0.15} stroke={c} strokeWidth={1} />;
            })}
            {/* Random mini charts */}
            {Array.from({length: 4}).map((_, i) => (
              <g key={i} transform={`translate(${50 + i * 180}, ${420})`}>
                <rect width="160" height="100" fill="#0B1222" stroke="#334155" />
                <polyline
                  points={Array.from({length: 8}).map((_, j) => `${j * 20},${80 - (Math.sin(i + j) * 30 + 40)}`).join(' ')}
                  fill="none"
                  stroke={['#EF4444', '#F59E0B', '#A855F7', '#FBBF24'][i]}
                  strokeWidth={2}
                />
              </g>
            ))}
            {/* Scroll indicator */}
            <g transform="translate(720, 540)">
              <rect x="-30" y="-20" width="30" height="20" fill="#1E293B" stroke="#475569" />
              <path d="M-20,-10 L-10,0 L-20,10" fill="none" stroke="#94A3B8" strokeWidth={2} />
            </g>
            <text x="640" y="555" fontFamily="monospace" fontSize="12" fill="#94A3B8">scroll ▼</text>
          </svg>
        </div>
      </div>

      {/* Arrow showing transformation */}
      <div style={{position: 'absolute', left: 840, top: 470, opacity: interpolate(local, [240, 360, 540], [0, 1, 0])}}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <path d="M5 30 L70 30 M55 15 L70 30 L55 45" fill="none" stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Clean dashboard cockpit on the right */}
      <div style={{position: 'absolute', left: 920, top: 200, width: 920, height: 620, opacity: interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 21, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><rect x="2" y="2" width="8" height="8" fill="#fff" /><rect x="12" y="2" width="8" height="8" fill="#fff" opacity="0.7" /><rect x="2" y="12" width="8" height="8" fill="#fff" opacity="0.7" /><rect x="12" y="12" width="8" height="8" fill="#fff" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.blue}}>شاشة قيادة تنفيذية · No-Scroll Cockpit</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 40px ${C.blue}55`}}>
          {/* Title bar */}
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 56, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', opacity: cockpitP}}>
            <span style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.text}}>لوحة قيادة المبيعات · manzooma_sales_2026.xlsx</span>
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 14, color: C.muted}}>50,000 rows · &lt;2ms</span>
          </div>

          {/* KPI cards row */}
          <div style={{position: 'absolute', left: 16, right: 16, top: 70, height: 130, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12}}>
            {kpis.map((k, i) => {
              const cardP = interpolate(local, [180 + i * 40, 360 + i * 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, opacity: cardP, transform: `translateY(${(1 - cardP) * 20}px)`}}>
                  <div style={{fontFamily: FONT, fontSize: 12, color: C.muted}}>{k.l}</div>
                  <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: k.col, marginTop: 6}}>{k.v}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}>
                    <span style={{fontFamily: MONO, fontSize: 13, color: k.d.startsWith('-') ? C.red : C.green}}>{k.d.startsWith('-') ? '▼' : '▲'} {k.d}</span>
                    <svg width="50" height="20">
                      <polyline points="" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts area */}
          <div style={{position: 'absolute', left: 16, right: 16, top: 215, bottom: 16, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12}}>
            {/* Big trend chart */}
            <div style={{gridColumn: '1', gridRow: '1 / 3', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, opacity: cockpitP}}>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 6}}>اتجاه المبيعات الشهري</div>
              <svg width="100%" height="92%" viewBox="0 0 400 220" preserveAspectRatio="none">
                <polyline points="20,180 50,160 80,175 110,140 140,120 170,130 200,100 230,110 260,125 290,95 320,80 350,60" fill="none" stroke={C.blue} strokeWidth={3} />
                <polyline points="20,180 50,160 80,175 110,140 140,120 170,130 200,100 230,110 260,125 290,95 320,80 350,60 350,200 20,200" fill={C.blue} fillOpacity={0.15} stroke="none" />
              </svg>
            </div>
            {/* Donut */}
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, opacity: cockpitP}}>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 6}}>توزيع الفئات</div>
              <svg width="100%" height="80%" viewBox="0 0 200 160">
                <circle cx="100" cy="80" r="55" fill="none" stroke="#334155" strokeWidth="22" />
                <circle cx="100" cy="80" r="55" fill="none" stroke={C.blue} strokeWidth="22" strokeDasharray="120 345" transform="rotate(-90 100 80)" />
                <circle cx="100" cy="80" r="55" fill="none" stroke={C.green} strokeWidth="22" strokeDasharray="80 345" strokeDashoffset="-120" transform="rotate(-90 100 80)" />
                <circle cx="100" cy="80" r="55" fill="none" stroke={C.purple} strokeWidth="22" strokeDasharray="60 345" strokeDashoffset="-200" transform="rotate(-90 100 80)" />
                <text x="100" y="78" textAnchor="middle" fill={C.text} fontFamily="monospace" fontSize="14" fontWeight="700">5 فئات</text>
                <text x="100" y="95" textAnchor="middle" fill={C.muted} fontFamily="monospace" fontSize="10">2026</text>
              </svg>
            </div>
            {/* Branch bars */}
            <div style={{background: C.deep, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, opacity: cockpitP}}>
              <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 6}}>حصة الفروع</div>
              <svg width="100%" height="80%" viewBox="0 0 200 120" preserveAspectRatio="none">
                {[60, 80, 40, 100, 50, 30].map((v, i) => (
                  <rect key={i} x={10 + i * 32} y={110 - v} width="22" height={v} fill={C.green} rx={2} />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} />
          <Mix style={{fontFamily: FONT, fontSize: 24, fontWeight: 700, color: C.green}}>5-Second Executive Clarity ──► Single-Screen No-Scroll Cockpit</Mix>
        </div>
      </div>

      <Caption text="الدرس 69 من 76 ──► Dashboard Design & Executive UX Engine" from={60} to={540} tone="normal" />
      <Caption text="5-Second Executive Clarity ──► Single-Screen No-Scroll Cockpit Architecture" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
