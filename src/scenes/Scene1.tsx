// SC01 — Reading & Editing Core VBA Scripts Engine (00:00-00:40).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';

const SC = {from: 0, dur: 1200};

export const Scene1: React.FC = () => {
  const local = useCurrentFrame();

  const chaosOp = interpolate(local, [0, 60, 540, 720], [0, 1, 1, 0]);
  const vbaP = interpolate(local, [180, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sealP = interpolate(local, [900, 1080], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="fade" outFx="left">
      <TopBadge text="الدرس 72 من 76 ──► الوحدة 14 من 14 ──► Reading & Editing Core VBA Scripts Engine" from={60} to={1140} color={C.blue} />

      {/* LEFT: Rigid recorded macro breaking */}
      <div style={{position: 'absolute', left: 80, top: 200, width: 760, height: 620, opacity: chaosOp}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <svg width="42" height="42" viewBox="0 0 42 42"><path d="M21 4 L38 36 H4 Z" fill="none" stroke={C.red} strokeWidth="3" strokeLinejoin="round" /><line x1="21" y1="16" x2="21" y2="26" stroke={C.red} strokeWidth="3" strokeLinecap="round" /><circle cx="21" cy="32" r="2" fill={C.red} /></svg>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.red}}>ماكرو جامد · بيتكسر مع زيادة الصفوف</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 30px ${C.red}33`}}>
          {/* Code with fixed range */}
          <div style={{padding: 18, fontFamily: MONO, fontSize: 14, lineHeight: 1.8}}>
            <div style={{color: C.muted, marginBottom: 8}}>{'— Recorded Macro (RIGID) —'}</div>
            <div style={{color: C.blue}}>Sub FormatReport()</div>
            <div style={{color: C.muted}}>    <span style={{color: C.green}}>'</span> Fixed to 500 rows</div>
            <div style={{color: C.red, textDecoration: 'line-through'}}>    Range("A1:E500").Select</div>
            <div style={{color: C.red, textDecoration: 'line-through'}}>    Selection.Font.Bold = True</div>
            <div style={{color: C.blue}}>End Sub</div>
          </div>

          {/* Error message */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: C.red, color: '#fff', padding: 18, fontFamily: FONT, fontSize: 16, fontWeight: 700}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="2" /><line x1="8" y1="8" x2="16" y2="16" stroke="#fff" strokeWidth="2" /><line x1="16" y1="8" x2="8" y2="16" stroke="#fff" strokeWidth="2" /></svg>
              <span>⚠ Error: Row 501+ not formatted (hardcoded range)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow showing transformation */}
      <div style={{position: 'absolute', left: 840, top: 470, opacity: interpolate(local, [240, 360, 540], [0, 1, 0])}}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <path d="M5 30 L70 30 M55 15 L70 30 L55 45" fill="none" stroke={C.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* RIGHT: Adaptive VBA */}
      <div style={{position: 'absolute', left: 920, top: 200, width: 920, height: 620, opacity: interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 42, height: 42, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.blue}`}}>
            <svg width="22" height="22" viewBox="0 0 22 22"><rect x="4" y="3" width="14" height="16" rx="1" fill="none" stroke="#fff" strokeWidth="2" /><path d="M7 7 H15 M7 10 H15 M7 13 H12" stroke="#fff" strokeWidth="1.5" /></svg>
          </div>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.blue}}>Core VBA Scripts · مرن وديناميكي</div>
        </div>
        <div style={{position: 'relative', width: '100%', height: 560, background: C.card, border: `2px solid ${C.blue}`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 40px ${C.blue}55`}}>
          {/* VBE-like header */}
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 44, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 16px'}}>
            <div style={{display: 'flex', gap: 6, marginRight: 16}}>
              <div style={{width: 12, height: 12, borderRadius: 6, background: '#FF5F57'}} />
              <div style={{width: 12, height: 12, borderRadius: 6, background: '#FEBC2E'}} />
              <div style={{width: 12, height: 12, borderRadius: 6, background: '#28C840'}} />
            </div>
            <span style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>Module1 (Code) — VBAProject</span>
          </div>

          {/* Dynamic VBA code */}
          <div style={{position: 'absolute', left: 16, right: 16, top: 60, bottom: 80, fontFamily: MONO, fontSize: 14, lineHeight: 1.7, opacity: vbaP}}>
            {[
              {l: 'Sub FormatReport()', c: C.blue, delay: 0},
              {l: "    ' Refactored - dynamic", c: C.green, delay: 1},
              {l: '    Dim LastRow As Long', c: C.blue, delay: 2},
              {l: '    LastRow = Cells(Rows.Count, 1).End(xlUp).Row', c: C.purple, delay: 3},
              {l: '    Range("A1:E" & LastRow).Font.Bold = True', c: C.green, delay: 4},
              {l: '    Application.ScreenUpdating = False', c: C.amber, delay: 5},
              {l: 'End Sub', c: C.blue, delay: 6},
            ].map((line, i) => {
              const lp = interpolate(local, [300 + i * 30, 330 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{opacity: lp, transform: `translateX(${(1 - lp) * 20}px)`, color: line.c}}>
                  <span style={{color: C.muted, marginRight: 12, width: 20, display: 'inline-block'}}>{i + 1}</span>{line.l}
                </div>
              );
            })}
          </div>

          {/* Adaptive badge */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', opacity: vbaP}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, background: C.blue, color: '#0B1222', padding: '12px 26px', borderRadius: 8, fontWeight: 700, fontFamily: FONT, fontSize: 16, boxShadow: `0 0 20px ${C.blue}66`}}>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 10 H17 M11 5 L17 10 L11 15" fill="none" stroke="#0B1222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>يتكيف مع أي عدد صفوف تلقائياً</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>Dynamic Code Refactoring ──► Rigid Macros → Adaptive VBA Logic</Mix>
        </div>
      </div>

      <Caption text="الدرس 72 من 76 ──► Reading & Editing Core VBA Scripts Engine" from={60} to={540} tone="normal" />
      <Caption text="Dynamic Code Refactoring ──► Transforming Rigid Recorded Macros into Adaptive VBA Logic" from={660} to={1140} tone="ok" />
    </Stage>
  );
};
