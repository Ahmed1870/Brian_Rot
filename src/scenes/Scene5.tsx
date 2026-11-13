// SC05 — Enterprise Execution: Auto-format 50,000 rows in <2ms (02:50-03:30).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {EXEC_STATS, MACRO_STEPS} from '../data';

const SC = {from: 5100, dur: 1200};

export const Scene5: React.FC = () => {
  const local = useCurrentFrame();

  // File load (0-120)
  const loadP = interpolate(local, [0, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Macro execution (120-360)
  const execP = interpolate(local, [120, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Step-by-step reveal (360-720)
  const stepP = (i: number) => interpolate(local, [360 + i * 60, 390 + i * 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Benchmark (720-900)
  const benchP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Seal (900-1200)
  const sealP = interpolate(local, [900, 1180], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const latency = (1 - benchP) * 8 + 1.8;
  const rowsProcessed = Math.floor(benchP * 50000);

  return (
    <Stage dur={SC.dur} inFx="left" outFx="up">
      <TopBadge text="Enterprise Weekly Automation ──► Auto-Format Headers, Column Widths & Totals on 50,000 Rows" from={60} to={630} color={C.green} />

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
              <div style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>loading raw weekly export · 50,000 rows · 12 columns</div>
            </div>
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke={C.border} strokeWidth="3" />
              <circle cx="25" cy="25" r="20" fill="none" stroke={C.blue} strokeWidth="3" strokeDasharray={`${loadP * 125.6} 125.6`} transform="rotate(-90 25 25)" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* Execution timeline */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 1100, opacity: execP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>Macro Execution Pipeline · خطوات الماكرو</div>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, boxShadow: `0 0 30px ${C.green}33`}}>
          {MACRO_STEPS.map((step, i) => {
            const p = stepP(i);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', opacity: p, borderBottom: i < MACRO_STEPS.length - 1 ? `1px solid ${C.border}` : 'none'}}>
                <div style={{width: 32, height: 32, borderRadius: 6, background: p > 0.5 ? C.green : C.deep, border: `1px solid ${C.green}`, color: p > 0.5 ? '#0B1222' : C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700}}>
                  {step.n}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.text}}>{step.label}</div>
                  <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>{step.vba}</div>
                </div>
                {p > 0.5 && <Check size={24} p={p} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution stats */}
      <div style={{position: 'absolute', right: 80, top: 200, width: 660, opacity: execP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>Execution Stats · مؤشرات الأداء</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
          {EXEC_STATS.map((s, i) => {
            const p = stepP(i);
            return (
              <div key={i} style={{background: C.card, border: `2px solid ${s.color}`, borderRadius: 10, padding: 18, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, boxShadow: `0 0 20px ${s.color}33`}}>
                <div style={{fontFamily: FONT, fontSize: 13, color: C.muted}}>{s.l}</div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4}}>
                  <span style={{fontFamily: MONO, fontSize: 32, fontWeight: 700, color: s.color}}>{i === 0 && benchP > 0 ? rowsProcessed.toLocaleString() : s.v}</span>
                  <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>{s.s}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Latency benchmark */}
        <div style={{marginTop: 18, background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 18, boxShadow: `0 0 30px ${C.green}33`, opacity: benchP}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{position: 'relative', width: 100, height: 100}}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke={C.border} strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={C.green} strokeWidth="6" strokeDasharray={`${benchP * 264} 264`} transform="rotate(-90 50 50)" strokeLinecap="round" />
              </svg>
              <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.green}}>{latency.toFixed(1)}</span>
                <span style={{fontFamily: MONO, fontSize: 10, color: C.muted}}>ms</span>
              </div>
            </div>
            <div>
              <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.text}}>Zero-Latency Execution</div>
              <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, marginTop: 4}}>50,000 صف في أقل من 2 ملي ثانية</div>
              <div style={{fontFamily: FONT, fontSize: 13, color: C.green, marginTop: 6, fontWeight: 700}}>✓ صفر أخطاء بشرية</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise seal */}
      <div style={{position: 'absolute', left: 80, top: 880, right: 80, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px', background: `linear-gradient(135deg, ${C.green}, ${C.blue})`, borderRadius: 12, boxShadow: `0 0 40px ${C.green}66`, transform: `scale(${0.85 + 0.15 * sealP})`}}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="24" cy="24" r="18" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M14 24 L21 31 L34 17" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: '#fff'}}>Enterprise Automation Seal</div>
            <div style={{fontFamily: MONO, fontSize: 13, color: '#fff', opacity: 0.9}}>Weekly Macro Pipeline · Manzooma Verified</div>
          </div>
        </div>
      </div>

      <Caption text="Enterprise Weekly Automation ──► Auto-Format Headers, Column Widths & Totals on 50,000 Rows" from={60} to={630} tone="ok" />
      <Caption text="Zero Manual Repetition ──► High-Speed Macro Execution Engine Completing in <2ms" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
