// SC01 — Comprehensive Enterprise Capstone Engine (00:00-00:40).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {PIPELINE_STAGES} from '../data';

const SC = {from: 0, dur: 1200};

export const Scene1: React.FC = () => {
  const local = useCurrentFrame();

  const chaosOp = interpolate(local, [0, 60, 540, 720], [0, 1, 1, 0]);
  const pipelineP = interpolate(local, [180, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sealP = interpolate(local, [900, 1080], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="left">
      <TopBadge text="الدرس 76 من 76 ──► الوحدة 14 من 14 ──► Comprehensive Enterprise Capstone Project" from={60} to={1140} color={C.blue} />

      {/* LEFT: Chaotic manual spreadsheets */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 620, height: 620, opacity: chaosOp}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <svg width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="18" fill="none" stroke={C.red} strokeWidth="3" /><line x1="14" y1="14" x2="28" y2="28" stroke={C.red} strokeWidth="3" strokeLinecap="round" /><line x1="28" y1="14" x2="14" y2="28" stroke={C.red} strokeWidth="3" strokeLinecap="round" /></svg>
          <div style={{fontFamily: FONT, fontSize: 24, fontWeight: 700, color: C.red}}>{'شيتات يدوية متفرقة'}</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 30px ${C.red}33`}}>
          <div style={{padding: '24px 20px'}}>
            {/* Scattered sheets */}
            {[
              {n: 'sales_jan.xlsx', x: 20, y: 0, rot: -3},
              {n: 'customers.csv', x: 180, y: 30, rot: 2},
              {n: 'products_v2.xlsx', x: 60, y: 130, rot: -1},
              {n: 'branches.xls', x: 240, y: 160, rot: 4},
              {n: 'manual_calc.xlsx', x: 100, y: 270, rot: -2},
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute', left: s.x, top: s.y,
                width: 200, padding: 12, background: C.deep,
                border: `1px solid ${C.red}`, borderRadius: 6,
                transform: `rotate(${s.rot}deg)`,
                fontFamily: MONO, fontSize: 12, color: C.red,
                boxShadow: `0 4px 12px rgba(0,0,0,0.4)`,
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
                  <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" rx="1" fill="none" stroke={C.red} strokeWidth="1.5" /></svg>
                  {s.n}
                </div>
                <div style={{color: C.muted, fontSize: 10}}>{'copy-paste errors ⚠'}</div>
              </div>
            ))}

            {/* Bottom error summary */}
            <div style={{position: 'absolute', bottom: 16, left: 16, right: 16, padding: 12, background: C.deep, border: `1px solid ${C.red}`, borderRadius: 6, display: 'flex', justifyContent: 'space-around', fontFamily: MONO, fontSize: 12}}>
              <span style={{color: C.red}}>{'❌ no relations'}</span>
              <span style={{color: C.red}}>{'❌ manual errors'}</span>
              <span style={{color: C.red}}>{'❌ no automation'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{position: 'absolute', left: 720, top: 470, opacity: interpolate(local, [240, 360, 540], [0, 1, 0])}}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M5 30 L50 30 M35 15 L50 30 L35 45" fill="none" stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* RIGHT: End-to-End BI Pipeline */}
      <div style={{position: 'absolute', left: 820, top: 200, width: 1020, height: 620, opacity: interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 11 L7 16 L19 5" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.blue}}>{'End-to-End BI Pipeline'}</div>
        </div>

        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 40px ${C.blue}55`}}>
          {/* Pipeline flow */}
          <div style={{padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 12}}>
            {PIPELINE_STAGES.map((s, i) => {
              const p = interpolate(local, [360 + i * 40, 400 + i * 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateX(${(1 - p) * 20}px)`}}>
                  <div style={{width: 48, height: 48, borderRadius: 8, background: s.color, color: '#0B1222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, boxShadow: `0 0 12px ${s.color}66`}}>{s.n}</div>
                  <div style={{flex: 1, padding: '12px 16px', background: C.deep, border: `1px solid ${s.color}`, borderRadius: 8}}>
                    <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.text}}>{s.l}</div>
                    <div style={{fontFamily: MONO, fontSize: 12, color: s.color, marginTop: 2}}>{s.sub}</div>
                  </div>
                  {p > 0.8 && <Check size={28} p={1} color={s.color} />}
                </div>
              );
            })}

            {/* Final seal at bottom */}
            <div style={{marginTop: 'auto', padding: 14, background: `${C.green}22`, border: `1px solid ${C.green}`, borderRadius: 8, fontFamily: FONT, fontSize: 16, color: C.green, fontWeight: 700, textAlign: 'center', opacity: pipelineP}}>
              {'⚡ 50,000 rows → Executive PDF in <2ms'}
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'End-to-End BI Architecture ──► Raw Data → Star Schema → DAX → Executive Dashboard'}</Mix>
        </div>
      </div>

      <Caption text="الدرس 76 من 76 ──► Comprehensive Enterprise Capstone Project" from={60} to={540} tone="normal" />
      <Caption text="End-to-End BI Architecture ──► Raw Data Ingestion → Star Schema → DAX → Executive Dashboard" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
