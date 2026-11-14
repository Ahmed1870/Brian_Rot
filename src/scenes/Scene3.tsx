// SC03 — Stage 2: DAX Time Intelligence & Non-Volatile Dynamic Arrays (01:25-02:10).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {DAX_MEASURES} from '../data';

const SC = {from: 2550, dur: 1350};

export const Scene3: React.FC = () => {
  const local = useCurrentFrame();

  // DAX measures reveal (0-540)
  const daxP = interpolate(local, [0, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const measureP = (i: number) => interpolate(local, [60 + i * 80, 120 + i * 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Dynamic arrays (540-900)
  const dynP = interpolate(local, [540, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const dynFunctions = [
    {n: 'FILTER', desc: 'تصفية ديناميكية', code: 'FILTER(Products, Products[Price] > 100)'},
    {n: 'SORTBY', desc: 'ترتيب ديناميكي', code: 'SORTBY(Sales, Sales[Date], 1)'},
    {n: 'XLOOKUP (2)', desc: 'بحث ثنائي', code: 'XLOOKUP(A, B, C, , , 2)'},
    {n: 'LET', desc: 'تخزين متغيرات', code: 'LET(v, XLOOKUP(...), IF(v>0, v*0.15, 0))'},
  ];

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Stage 2: DAX Time Intelligence ──► CALCULATE, SUMX, TOTALYTD & SAMEPERIODLASTYEAR" from={60} to={630} color={C.purple} />

      {/* LEFT: DAX Measures editor */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 880, height: 680, opacity: daxP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 44, height: 44, borderRadius: 8, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 7 L8 11 L4 15 M11 7 L15 11 L11 15 M18 14 V18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.purple}}>{'DAX Measures'}</div>
        </div>

        <div style={{background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 18, height: 580, boxShadow: `0 0 30px ${C.purple}33`}}>
          {/* Editor header */}
          <div style={{display: 'flex', alignItems: 'center', padding: '8px 12px', background: C.deep, borderRadius: 6, marginBottom: 16, gap: 10}}>
            <span style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>{'DAX Editor — Measures'}</span>
            <span style={{marginLeft: 'auto', fontFamily: FONT, fontSize: 12, color: C.purple}}>{'Time Intelligence'}</span>
          </div>

          {/* DAX measures */}
          {DAX_MEASURES.map((m, i) => {
            const p = measureP(i);
            return (
              <div key={i} style={{marginBottom: 14, opacity: p, transform: `translateX(${(1 - p) * 20}px)`, padding: 14, background: C.deep, border: `1px solid ${C.purple}`, borderRadius: 8}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                  <div style={{width: 24, height: 24, borderRadius: 4, background: C.purple, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 11, fontWeight: 700}}>{'ƒ'}</div>
                  <span style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text}}>{m.n}</span>
                </div>
                <div style={{fontFamily: MONO, fontSize: 13, color: m.c, padding: '8px 12px', background: C.bg, borderRadius: 4, wordBreak: 'break-all'}}>
                  {m.code}
                </div>
              </div>
            );
          })}

          {/* Zero volatile badge */}
          <div style={{marginTop: 16, padding: 12, background: `${C.green}22`, border: `1px solid ${C.green}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10}}>
            <Check size={24} p={1} />
            <span style={{fontFamily: FONT, fontSize: 14, color: C.green, fontWeight: 700}}>{'Zero Volatile Functions · No OFFSET / INDIRECT'}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Dynamic Arrays engine */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 880, height: 680, opacity: dynP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Non-Volatile Dynamic Query Engine'}</div>

        <div style={{background: C.card, border: `2px solid ${C.purple}`, borderRadius: 12, padding: 18, height: 580, boxShadow: `0 0 30px ${C.purple}33`}}>
          {/* Dynamic functions grid */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18}}>
            {dynFunctions.map((f, i) => {
              const p = interpolate(local, [540 + i * 60, 600 + i * 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 16}px)`, padding: 16, background: C.deep, border: `1px solid ${C.purple}`, borderRadius: 10}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                    <div style={{padding: '4px 10px', background: C.purple, color: '#fff', borderRadius: 4, fontFamily: MONO, fontSize: 13, fontWeight: 700}}>{f.n}</div>
                  </div>
                  <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 8}}>{f.desc}</div>
                  <div style={{fontFamily: MONO, fontSize: 11, color: C.purple, padding: '6px 8px', background: C.bg, borderRadius: 4, wordBreak: 'break-all'}}>
                    {f.code}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spill visualization */}
          <div style={{padding: 16, background: C.deep, border: `1px solid ${C.purple}`, borderRadius: 8}}>
            <div style={{fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10}}>{'Dynamic Array Spill'}</div>
            <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
              {Array.from({length: 24}).map((_, i) => {
                const filled = interpolate(local, [720 + i * 10, 780 + i * 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) > 0.5;
                return (
                  <div key={i} style={{width: 36, height: 24, background: filled ? C.purple : C.bg, border: `1px solid ${filled ? C.purple : C.border}`, borderRadius: 3, fontFamily: MONO, fontSize: 9, color: filled ? '#fff' : C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {filled ? '◆' : ''}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop: 8, fontFamily: MONO, fontSize: 11, color: C.purple}}>{'instant query response'}</div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.purple}33`}}>
          <Check size={40} p={sealP} color={C.purple} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.purple}}>{'Non-Volatile Dynamic Engine ──► FILTER + SORTBY + Binary XLOOKUP + LET'}</Mix>
        </div>
      </div>

      <Caption text="Stage 2: DAX Time Intelligence ──► CALCULATE, SUMX, TOTALYTD & SAMEPERIODLASTYEAR (YoY %)" from={60} to={630} tone="normal" />
      <Caption text="Non-Volatile Dynamic Query Engine ──► FILTER + SORTBY + Binary XLOOKUP + LET (Zero Volatile Load)" from={750} to={1320} tone="normal" />
    </Stage>
  );
};
