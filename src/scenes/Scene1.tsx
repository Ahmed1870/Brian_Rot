// SC01 — Performance Tuning & Calculation Management Engine (00:00-00:40).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';

const SC = {from: 0, dur: 1200};

export const Scene1: React.FC = () => {
  const local = useCurrentFrame();

  const chaosOp = interpolate(local, [0, 60, 540, 720], [0, 1, 1, 0]);
  const engineP = interpolate(local, [180, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sealP = interpolate(local, [900, 1080], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Animated calc progress (stuck at 12%)
  const stuckPct = 12 + Math.sin(local * 0.1) * 2;

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="left">
      <TopBadge text="الدرس 75 من 76 ──► الوحدة 14 من 14 ──► Performance Tuning & Calculation Management Engine" from={60} to={1140} color={C.blue} />

      {/* LEFT: Stalled calculating */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 760, height: 620, opacity: chaosOp}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <svg width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="18" fill="none" stroke={C.red} strokeWidth="3" /><line x1="21" y1="11" x2="21" y2="21" stroke={C.red} strokeWidth="3" strokeLinecap="round" /><path d="M21 26 V28" stroke={C.red} strokeWidth="3" strokeLinecap="round" /></svg>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.red}}>{'شيت متجمد · Calculating 12%'}</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 30px ${C.red}33`}}>
          {/* Excel header */}
          <div style={{padding: '12px 18px', background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 10, height: 10, borderRadius: 5, background: '#FF5F57'}} />
            <div style={{width: 10, height: 10, borderRadius: 5, background: '#FEBC2E'}} />
            <div style={{width: 10, height: 10, borderRadius: 5, background: '#28C840'}} />
            <span style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginLeft: 10}}>{'manzooma_sales_2026.xlsx'}</span>
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 12, color: C.red, fontWeight: 700}}>{'(Not Responding)'}</span>
          </div>

          {/* Stuck calc bar */}
          <div style={{padding: 30}}>
            <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.red, marginBottom: 12}}>{'Calculating (8 Threads)'}</div>
            <div style={{height: 24, background: C.deep, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 6}}>
              <div style={{width: `${stuckPct}%`, height: '100%', background: `linear-gradient(90deg, ${C.red}, ${C.amber})`, transition: 'width 0.1s', boxShadow: `0 0 12px ${C.red}`}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 13, marginBottom: 20}}>
              <span style={{color: C.red}}>{stuckPct.toFixed(0) + '% · stuck'}</span>
              <span style={{color: C.muted}}>{'8.4s elapsed'}</span>
            </div>

            {/* Heavy formula trigger */}
            <div style={{padding: 14, background: C.deep, border: `1px solid ${C.red}`, borderRadius: 8, fontFamily: MONO, fontSize: 14}}>
              <div style={{color: C.muted, marginBottom: 6, fontSize: 12}}>{'50,000 row linear scan'}</div>
              <div style={{color: C.red, fontWeight: 700, fontSize: 15}}>{'=XLOOKUP(A2, Keys, Values)'}</div>
              <div style={{color: C.muted, marginTop: 6, fontSize: 12}}>{'→ 50,000 comparisons per row'}</div>
            </div>

            <div style={{marginTop: 20, display: 'flex', justifyContent: 'space-around', fontFamily: MONO, fontSize: 13}}>
              <div style={{color: C.red}}>{'⚡ CPU: 94%'}</div>
              <div style={{color: C.amber}}>{'💾 30 MB bloat'}</div>
              <div style={{color: C.muted}}>{'🐌 Linear search'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{position: 'absolute', left: 840, top: 470, opacity: interpolate(local, [240, 360, 540], [0, 1, 0])}}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <path d="M5 30 L70 30 M55 15 L70 30 L55 45" fill="none" stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* RIGHT: Performance Tuning Engine */}
      <div style={{position: 'absolute', left: 920, top: 200, width: 920, height: 620, opacity: interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 11 L8 16 L19 5" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.blue}}>{'Performance Tuning Engine'}</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 40px ${C.blue}55`}}>
          {/* Header */}
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 56, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', opacity: engineP}}>
            <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke={C.blue} strokeWidth="2" /><path d="M6 10 L9 13 L14 7" fill="none" stroke={C.blue} strokeWidth="2" /></svg>
            <span style={{fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700, marginLeft: 12}}>{'Optimization Active'}</span>
          </div>

          {/* 3 optimization pillars */}
          <div style={{position: 'absolute', left: 24, right: 24, top: 80, bottom: 100, opacity: engineP}}>
            {[
              {n: '01', l: 'Calculation Governance', v: 'Manual + F9', c: C.green, p: 0},
              {n: '02', l: 'Binary Search', v: '50K → 16 steps', c: C.purple, p: 1},
              {n: '03', l: 'Workbook Compression', v: '30MB → 12MB', c: C.amber, p: 2},
            ].map((pillar, i) => {
              const p = interpolate(local, [240 + i * 80, 320 + i * 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: 18, background: C.deep, border: `1px solid ${pillar.c}`, borderRadius: 10, marginBottom: 12, opacity: p, transform: `translateX(${(1 - p) * 20}px)`}}>
                  <div style={{width: 44, height: 44, borderRadius: 8, background: pillar.c, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700}}>{pillar.n}</div>
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.text}}>{pillar.l}</div>
                    <div style={{fontFamily: MONO, fontSize: 13, color: pillar.c, marginTop: 2}}>{pillar.v}</div>
                  </div>
                  <div style={{width: 28, height: 28, borderRadius: 14, background: pillar.c, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700}}>✓</div>
                </div>
              );
            })}

            {/* Final speed */}
            <div style={{padding: 14, background: `${C.green}22`, border: `1px solid ${C.green}`, borderRadius: 8, fontFamily: FONT, fontSize: 18, color: C.green, fontWeight: 700, textAlign: 'center'}}>
              {'⚡ Recalc: 1.8ms · File: 12MB · 60% smaller'}
            </div>
          </div>

          {/* Bottom badges */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', gap: 14, opacity: engineP}}>
            {['Manual Mode', 'Binary (2)', 'LET()', '.xlsb'].map((m, i) => (
              <div key={i} style={{padding: '8px 18px', background: C.deep, border: `1px solid ${C.green}`, borderRadius: 6, fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>{m}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'Enterprise Speed Governance ──► Calculation Control + Binary Lookups + Bloat Elimination'}</Mix>
        </div>
      </div>

      <Caption text="الدرس 75 من 76 ──► Performance Tuning & Calculation Management Engine" from={60} to={540} tone="normal" />
      <Caption text="Enterprise Speed Governance ──► Calculation Control, Binary Lookups & Workbook Bloat Elimination" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
