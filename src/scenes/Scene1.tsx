// SC01 — Office Scripts Cloud Automation Engine (00:00-00:40).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';

const SC = {from: 0, dur: 1200};

export const Scene1: React.FC = () => {
  const local = useCurrentFrame();

  const chaosOp = interpolate(local, [0, 60, 540, 720], [0, 1, 1, 0]);
  const cloudP = interpolate(local, [180, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sealP = interpolate(local, [900, 1080], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="left">
      <TopBadge text="الدرس 73 من 76 ──► الوحدة 14 من 14 ──► Office Scripts vs. VBA Architecture & Cloud Automation" from={60} to={1140} color={C.blue} />

      {/* LEFT: VBA failing on web */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 760, height: 620, opacity: chaosOp}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <svg width="42" height="42" viewBox="0 0 42 42"><path d="M21 4 L38 36 H4 Z" fill="none" stroke={C.red} strokeWidth="3" strokeLinejoin="round" /><line x1="21" y1="16" x2="21" y2="26" stroke={C.red} strokeWidth="3" strokeLinecap="round" /><circle cx="21" cy="32" r="2" fill={C.red} /></svg>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.red}}>{'VBA · يقف على المتصفح'}</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 30px ${C.red}33`}}>
          {/* Browser mock */}
          <div style={{padding: '8px 14px', background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{display: 'flex', gap: 5}}>
              <div style={{width: 10, height: 10, borderRadius: 5, background: '#FF5F57'}} />
              <div style={{width: 10, height: 10, borderRadius: 5, background: '#FEBC2E'}} />
              <div style={{width: 10, height: 10, borderRadius: 5, background: '#28C840'}} />
            </div>
            <div style={{flex: 1, background: C.bg, borderRadius: 4, padding: '4px 12px', fontFamily: MONO, fontSize: 11, color: C.muted}}>excel.office.com/manzooma_sales_2026.xlsx</div>
          </div>

          {/* Error message */}
          <div style={{padding: 50, textAlign: 'center'}}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{margin: '0 auto 20px'}}><circle cx="40" cy="40" r="36" fill="none" stroke={C.red} strokeWidth="3" /><line x1="28" y1="28" x2="52" y2="52" stroke={C.red} strokeWidth="4" strokeLinecap="round" /><line x1="52" y1="28" x2="28" y2="52" stroke={C.red} strokeWidth="4" strokeLinecap="round" /></svg>
            <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.red, marginBottom: 8}}>{'VBA Macros Not Supported'}</div>
            <div style={{fontFamily: FONT, fontSize: 14, color: C.muted}}>{'Excel on the Web لا يدعم أكواد VBA'}</div>
            <div style={{marginTop: 24, padding: '10px 16px', background: C.deep, borderRadius: 6, fontFamily: MONO, fontSize: 12, color: C.muted, display: 'inline-block'}}>.xlsm file blocked by IT policy</div>
          </div>

          {/* Blocked platforms */}
          <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: C.deep, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around'}}>
            {['Web', 'Mac', 'Mobile'].map((p, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 11, color: C.red}}>
                <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="none" stroke={C.red} strokeWidth="1.5" /><line x1="4" y1="4" x2="10" y2="10" stroke={C.red} strokeWidth="1.5" /></svg>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{position: 'absolute', left: 840, top: 470, opacity: interpolate(local, [240, 360, 540], [0, 1, 0])}}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <path d="M5 30 L70 30 M55 15 L70 30 L55 45" fill="none" stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* RIGHT: Office Scripts Cloud Engine */}
      <div style={{position: 'absolute', left: 920, top: 200, width: 920, height: 620, opacity: interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 14 a4 4 0 0 1 1-7 a5 5 0 0 1 10 0 a3 3 0 0 1 -1 7 z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.blue}}>{'Office Scripts · Cloud Engine'}</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 40px ${C.blue}55`}}>
          {/* Cloud header */}
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 56, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', opacity: cloudP}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 14 a4 4 0 0 1 1-7 a5 5 0 0 1 10 0 a3 3 0 0 1 -1 7 z" fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, marginLeft: 10}}>Cloud Script Running</span>
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 12, color: C.muted}}>{'manzooma_sales_2026.xlsx'}</span>
          </div>

          {/* TypeScript code */}
          <div style={{position: 'absolute', left: 16, right: 16, top: 70, bottom: 110, fontFamily: MONO, fontSize: 13, lineHeight: 1.8, opacity: cloudP}}>
            {[
              {l: 'function main(workbook: ExcelScript.Workbook) {', c: C.blue, d: 0},
              {l: '  let sheet = workbook.getActiveWorksheet();', c: C.green, d: 1},
              {l: '  let range = sheet.getUsedRange();', c: C.green, d: 2},
              {l: '  let values = range.getValues();', c: C.purple, d: 3},
              {l: '  range.setValues(values);', c: C.purple, d: 4},
              {l: '}', c: C.blue, d: 5},
            ].map((line, i) => {
              const lp = interpolate(local, [360 + i * 30, 390 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{opacity: lp, transform: `translateX(${(1 - lp) * 16}px)`, color: line.c}}>
                  <span style={{color: C.muted, marginRight: 12, width: 18, display: 'inline-block'}}>{i + 1}</span>{line.l}
                </div>
              );
            })}
          </div>

          {/* Platform badges */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', gap: 14, opacity: cloudP}}>
            {['Web', 'Desktop', 'Mac', 'Mobile', 'Power Automate'].map((p, i) => (
              <div key={i} style={{padding: '8px 16px', background: C.deep, border: `1px solid ${C.blue}`, borderRadius: 6, fontFamily: MONO, fontSize: 12, color: C.blue, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6}}>
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>{'Next-Gen Cloud Scripting ──► Web + Desktop + Power Automate'}</Mix>
        </div>
      </div>

      <Caption text="الدرس 73 من 76 ──► Office Scripts vs. VBA Architecture & Cloud Automation" from={60} to={540} tone="normal" />
      <Caption text="Next-Gen Cloud Scripting ──► Automate Excel on the Web, Desktop & Power Automate Flows" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
