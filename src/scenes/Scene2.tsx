// SC02 — Calculation Modes, F9 Shortcuts & Multi-Threading (00:40-01:25).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {CALC_MODES, RECALC_KEYS} from '../data';

const SC = {from: 1200, dur: 1350};

export const Scene2: React.FC = () => {
  const local = useCurrentFrame();

  // Calc options dropdown (0-360)
  const optP = interpolate(local, [0, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const selP = interpolate(local, [180, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // F9 keys (360-720)
  const keyP = (i: number) => interpolate(local, [360 + i * 120, 420 + i * 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Multi-threaded cores (720-1080)
  const coreP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Calculation Modes ──► Automatic | Automatic Except Data Tables | Manual" from={60} to={720} color={C.green} />

      {/* LEFT: Formulas tab + Calculation Options dropdown */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 880, height: 680, opacity: optP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Formulas → Calculation Options'}</div>

        {/* Ribbon with Formulas tab */}
        <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 14, height: 60, marginBottom: 14}}>
          {['File', 'Home', 'Insert'].map((t) => (
            <div key={t} style={{padding: '6px 12px', fontFamily: FONT, fontSize: 13, color: C.muted}}>{t}</div>
          ))}
          <div style={{padding: '8px 16px', background: C.green, color: '#0B1222', borderRadius: 4, fontFamily: FONT, fontSize: 14, fontWeight: 700}}>Formulas</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 14}}>
            <div style={{padding: '8px 14px', background: C.deep, border: `1px solid ${C.green}`, borderRadius: 4, fontFamily: FONT, fontSize: 13, color: C.green, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8}}>
              Calculation Options
              <svg width="12" height="8" viewBox="0 0 12 8"><path d="M2 2 L6 6 L10 2" fill="none" stroke={C.green} strokeWidth="1.5" /></svg>
            </div>
          </div>
        </div>

        {/* Dropdown menu */}
        <div style={{marginLeft: 180, width: 380, background: C.card, border: `2px solid ${C.green}`, borderRadius: 8, padding: 8, boxShadow: `0 12px 30px rgba(2,6,23,0.7), 0 0 20px ${C.green}33`, opacity: selP}}>
          {CALC_MODES.map((m, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: m.active ? `${C.green}22` : 'transparent', borderRadius: 6, cursor: 'pointer', border: m.active ? `1px solid ${m.color}` : '1px solid transparent'}}>
              <div style={{width: 16, height: 16, borderRadius: 8, border: `2px solid ${m.color}`, background: m.active ? m.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {m.active && <div style={{width: 4, height: 4, borderRadius: 2, background: '#fff'}} />}
              </div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: m.active ? m.color : C.text}}>{m.n}</div>
                <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{m.desc}</div>
              </div>
              {m.active && <span style={{fontFamily: MONO, fontSize: 11, color: C.green, fontWeight: 700}}>{'✓ selected'}</span>}
            </div>
          ))}
        </div>

        {/* F9 keys panel */}
        <div style={{marginTop: 24}}>
          <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12}}>{'Precision Recalculation Keys'}</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12}}>
            {RECALC_KEYS.map((k, i) => {
              const p = keyP(i);
              return (
                <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`, padding: 16, background: C.card, border: `2px solid ${k.color}`, borderRadius: 10, boxShadow: `0 0 15px ${k.color}33`}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                    <div style={{padding: '6px 12px', background: k.color, color: '#0B1222', borderRadius: 6, fontFamily: MONO, fontSize: 16, fontWeight: 700}}>{k.k}</div>
                  </div>
                  <div style={{fontFamily: FONT, fontSize: 12, color: C.muted}}>{k.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Multi-threaded cores */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 880, height: 680, opacity: coreP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Multi-Threaded Calculation'}</div>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: 22, height: 580, boxShadow: `0 0 30px ${C.green}33`}}>
          {/* Setting label */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18}}>
            <svg width="28" height="28" viewBox="0 0 28 28"><rect x="4" y="4" width="20" height="20" rx="2" fill="none" stroke={C.green} strokeWidth="2" /><path d="M9 14 L13 18 L19 10" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div>
              <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.green}}>{'Enable multi-threaded calculation'}</div>
              <div style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>{'File → Options → Advanced → Formulas'}</div>
            </div>
          </div>

          {/* 8 CPU cores grid */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20}}>
            {Array.from({length: 8}).map((_, i) => {
              const active = coreP > i / 8;
              const pulse = 0.7 + Math.sin((local - 720 + i * 5) * 0.2) * 0.3;
              return (
                <div key={i} style={{padding: 14, background: active ? `${C.green}22` : C.deep, border: `2px solid ${active ? C.green : C.border}`, borderRadius: 10, textAlign: 'center', boxShadow: active ? `0 0 ${10 * pulse}px ${C.green}` : 'none'}}>
                  <div style={{fontFamily: MONO, fontSize: 12, color: active ? C.green : C.muted, fontWeight: 700}}>{'Core ' + (i + 1)}</div>
                  <div style={{marginTop: 8, height: 30, background: C.deep, borderRadius: 4, overflow: 'hidden'}}>
                    <div style={{width: active ? `${60 + Math.sin(local * 0.3 + i) * 30}%` : '0%', height: '100%', background: C.green, transition: 'width 0.2s'}} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance summary */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10}}>
            <div style={{padding: 12, background: C.deep, border: `1px solid ${C.green}`, borderRadius: 8, textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.green}}>{'8x'}</div>
              <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{'parallel cores'}</div>
            </div>
            <div style={{padding: 12, background: C.deep, border: `1px solid ${C.blue}`, borderRadius: 8, textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.blue}}>{'1.8ms'}</div>
              <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{'recalc time'}</div>
            </div>
            <div style={{padding: 12, background: C.deep, border: `1px solid ${C.amber}`, borderRadius: 8, textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.amber}}>{'100%'}</div>
              <div style={{fontFamily: FONT, fontSize: 11, color: C.muted}}>{'CPU usage'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} color={C.green} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'Precision Recalc & Multi-Threading ──► F9 / Shift+F9 / Ctrl+Alt+F9 + All CPU Cores Active'}</Mix>
        </div>
      </div>

      <Caption text="Calculation Modes ──► Automatic | Automatic Except Data Tables | Manual" from={60} to={720} tone="ok" />
      <Caption text="Precision Recalc & Multi-Threading ──► F9 / Shift+F9 / Ctrl+Alt+F9 + All CPU Cores Active" from={840} to={1320} tone="ok" />
    </Stage>
  );
};
