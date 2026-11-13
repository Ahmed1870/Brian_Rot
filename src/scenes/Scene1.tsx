// SC01 — Volatile Functions & Performance Impact Engine (00:00-00:40).
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

  // Animated CPU spike
  const cpuSpike = 50 + Math.sin(local * 0.3) * 35 + 15;

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="left">
      <TopBadge text="الدرس 74 من 76 ──► الوحدة 14 من 14 ──► Volatile Functions & Performance Impact Engine" from={60} to={1140} color={C.blue} />

      {/* LEFT: Lagging workbook */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 760, height: 620, opacity: chaosOp}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <svg width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="18" fill="none" stroke={C.red} strokeWidth="3" /><line x1="21" y1="10" x2="21" y2="22" stroke={C.red} strokeWidth="3" strokeLinecap="round" /><circle cx="21" cy="29" r="2" fill={C.red} /></svg>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.red}}>{'شيت متجمد · 100% CPU'}</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 30px ${C.red}33`}}>
          {/* Excel-like header */}
          <div style={{padding: '12px 18px', background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 10, height: 10, borderRadius: 5, background: '#FF5F57'}} />
            <div style={{width: 10, height: 10, borderRadius: 5, background: '#FEBC2E'}} />
            <div style={{width: 10, height: 10, borderRadius: 5, background: '#28C840'}} />
            <span style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginLeft: 10}}>{'manzooma_sales_2026.xlsx'}</span>
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 12, color: C.red, fontWeight: 700}}>{'(Not Responding)'}</span>
          </div>

          {/* CPU spike visual */}
          <div style={{padding: 30}}>
            <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.red, marginBottom: 12}}>{'CPU Usage Spike'}</div>
            <div style={{display: 'flex', gap: 4, height: 80, alignItems: 'flex-end', marginBottom: 20}}>
              {Array.from({length: 24}).map((_, i) => {
                const h = 30 + Math.abs(Math.sin(i + local * 0.15)) * 50;
                return <div key={i} style={{flex: 1, height: `${h}%`, background: h > 70 ? C.red : C.amber, borderRadius: 2}} />;
              })}
            </div>

            {/* Volatile formula trigger */}
            <div style={{padding: 14, background: C.deep, border: `1px solid ${C.red}`, borderRadius: 8, fontFamily: MONO, fontSize: 16}}>
              <div style={{color: C.muted, marginBottom: 6, fontSize: 13}}>{'Cell B2 edited →'}</div>
              <div style={{color: C.red, fontWeight: 700}}>{'=OFFSET(A1, ROW()-1, 0) + TODAY()'}</div>
              <div style={{color: C.muted, marginTop: 6, fontSize: 13}}>{'→ 50,000 cells recalculated'}</div>
            </div>

            <div style={{marginTop: 20, display: 'flex', justifyContent: 'space-around', fontFamily: MONO, fontSize: 13}}>
              <div style={{color: C.red}}>{'⚡ CPU: ' + Math.round(cpuSpike) + '%'}</div>
              <div style={{color: C.amber}}>{'⏱ 8.4s delay'}</div>
              <div style={{color: C.muted}}>{'🐛 8 volatile fns'}</div>
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

      {/* RIGHT: Clean Volatile Functions Engine */}
      <div style={{position: 'absolute', left: 920, top: 200, width: 920, height: 620, opacity: interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 11 L8 16 L19 5" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.blue}}>{'Volatile Functions Engine'}</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 40px ${C.blue}55`}}>
          {/* Engine header */}
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 56, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', opacity: engineP}}>
            <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke={C.blue} strokeWidth="2" /><path d="M6 10 L9 13 L14 7" fill="none" stroke={C.blue} strokeWidth="2" /></svg>
            <span style={{fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700, marginLeft: 12}}>{'Performance Scan Running'}</span>
          </div>

          {/* Scanning lines representing tree cleanup */}
          <div style={{position: 'absolute', left: 24, right: 24, top: 80, bottom: 100, opacity: engineP}}>
            <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 16}}>{'Calculation Tree Cleanup'}</div>

            {/* Volatile nodes being scanned */}
            {['=OFFSET(A1,5,2)', '=INDIRECT(B1)', '=TODAY()', '=RAND()'].map((fn, i) => {
              const p = interpolate(local, [240 + i * 60, 320 + i * 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const replaced = p > 0.7;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', marginBottom: 10, background: C.deep, border: `1px solid ${replaced ? C.green : C.red}`, borderRadius: 8, opacity: p}}>
                  <div style={{width: 24, height: 24, borderRadius: 12, background: replaced ? C.green : C.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700}}>{replaced ? '✓' : '!'}</div>
                  <div style={{fontFamily: MONO, fontSize: 18, flex: 1, color: replaced ? C.green : C.red, textDecoration: replaced ? 'line-through' : 'none'}}>{fn}</div>
                  <div style={{fontFamily: MONO, fontSize: 13, color: replaced ? C.green : C.muted}}>{replaced ? 'replaced ✓' : 'detected'}</div>
                </div>
              );
            })}

            <div style={{marginTop: 14, padding: 14, background: `${C.green}22`, border: `1px solid ${C.green}`, borderRadius: 8, fontFamily: FONT, fontSize: 16, color: C.green, fontWeight: 700, textAlign: 'center'}}>
              {'⚡ Recalc time: 1.8ms (500x faster)'}
            </div>
          </div>

          {/* Bottom speed bar */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', gap: 14, opacity: engineP}}>
            {['INDEX', 'XLOOKUP', 'Tables', '$B$1'].map((m, i) => (
              <div key={i} style={{padding: '8px 18px', background: C.deep, border: `1px solid ${C.green}`, borderRadius: 6, fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>{m}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'Eliminate Lag & Stutter ──► Purge Volatile Recalculation Chains'}</Mix>
        </div>
      </div>

      <Caption text="الدرس 74 من 76 ──► Volatile Functions & Performance Impact Engine" from={60} to={540} tone="normal" />
      <Caption text="Eliminate Lag & Stutter ──► Purging Forced Recalculation Chains in Enterprise Workbooks" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
