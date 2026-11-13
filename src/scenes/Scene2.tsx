// SC02 — VBE (Alt+F11) & Stripping .Select Bloat (00:40-01:25).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {VBA_BLOATED, VBA_CLEAN, CODE_COLORS} from '../data';

const SC = {from: 1200, dur: 1350};

export const Scene2: React.FC = () => {
  const local = useCurrentFrame();

  // Alt+F11 press (0-120)
  const keyP = interpolate(local, [0, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // VBE open (120-360)
  const vbeP = interpolate(local, [120, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Bloat reveal (240-480)
  const bloatP = interpolate(local, [240, 480], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Refactor: strike + replace (480-900)
  const strikeP = interpolate(local, [540, 720], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cleanP = interpolate(local, [720, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Visual Basic Editor (Alt + F11) ──► Project Explorer → Modules → Sub ... End Sub" from={60} to={720} color={C.green} />

      {/* Alt+F11 keys */}
      <div style={{position: 'absolute', left: 80, top: 170, display: 'flex', alignItems: 'center', gap: 14, opacity: keyP}}>
        <div style={{display: 'flex', gap: 8}}>
          {['Alt', 'F11'].map((k, i) => {
            const press = interpolate(local, [i * 30, i * 30 + 20, i * 30 + 50], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={i} style={{
                padding: '14px 26px', background: press > 0.3 ? C.green : C.deep, color: press > 0.3 ? '#0B1222' : C.text,
                border: `2px solid ${C.green}`, borderRadius: 8, fontFamily: MONO, fontSize: 22, fontWeight: 700,
                transform: `translateY(${press > 0.5 ? 4 : 0}px) scale(${press > 0.5 ? 0.95 : 1})`,
                boxShadow: press > 0.5 ? `0 0 20px ${C.green}` : 'none',
              }}>{k}</div>
            );
          })}
        </div>
        <span style={{fontFamily: FONT, fontSize: 18, color: C.muted}}>→ فتح محرر Visual Basic</span>
      </div>

      {/* LEFT: VBE Project Explorer */}
      <div style={{position: 'absolute', left: 80, top: 250, width: 480, height: 580, opacity: vbeP}}>
        <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, height: '100%'}}>
          <div style={{padding: '10px 14px', background: C.deep, borderBottom: `1px solid ${C.border}`, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text}}>Project Explorer</div>
          <div style={{padding: 14, fontFamily: MONO, fontSize: 13, color: C.muted, lineHeight: 2.2}}>
            <div style={{color: C.amber}}>📁 VBAProject (manzooma_sales_2026.xlsm)</div>
            <div style={{paddingLeft: 16}}>📁 Microsoft Excel Objects</div>
            <div style={{paddingLeft: 32}}>📄 Sheet1 (Sales)</div>
            <div style={{paddingLeft: 32}}>📄 ThisWorkbook</div>
            <div style={{paddingLeft: 16, color: C.green, fontWeight: 700}}>📁 Modules ✓</div>
            <div style={{paddingLeft: 32, color: C.green, background: `${C.green}22`, borderRadius: 4, padding: '2px 8px', display: 'inline-block'}}>📄 Module1 ← FormatReport</div>
            <div style={{paddingLeft: 16}}>📁 Forms</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Code editor - bloat → clean */}
      <div style={{position: 'absolute', left: 600, top: 250, width: 1240, height: 580, opacity: vbeP}}>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 8, height: '100%', overflow: 'hidden', boxShadow: `0 0 30px ${C.green}33`}}>
          {/* Editor header */}
          <div style={{display: 'flex', alignItems: 'center', padding: '8px 14px', background: C.deep, borderBottom: `1px solid ${C.border}`, gap: 10}}>
            <span style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>Module1 (Code)</span>
            <span style={{marginLeft: 'auto', fontFamily: FONT, fontSize: 13, color: strikeP > 0.5 ? C.green : C.red}}>
              {strikeP > 0.5 ? '✓ Refactored' : '⚠ Bloated — needs cleanup'}
            </span>
          </div>

          {/* Code lines */}
          <div style={{padding: 18, fontFamily: MONO, fontSize: 14, lineHeight: 2}}>
            {/* BLOATED lines (struck through as strikeP increases) */}
            {VBA_BLOATED.map((line, i) => {
              const lp = interpolate(local, [240 + i * 25, 270 + i * 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const isStruck = line.strike && strikeP > 0.5;
              return (
                <div key={`b${i}`} style={{opacity: isStruck ? lp * (1 - cleanP) : lp, color: (CODE_COLORS as any)[line.color] || C.text, textDecoration: isStruck ? 'line-through' : 'none'}}>
                  <span style={{color: C.muted, marginRight: 12, width: 20, display: 'inline-block'}}>{line.n}</span>{line.code}
                </div>
              );
            })}

            {/* CLEAN lines (appear as cleanP increases) */}
            {cleanP > 0 && VBA_CLEAN.map((line, i) => {
              const lp = interpolate(local, [720 + i * 30, 750 + i * 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={`c${i}`} style={{opacity: lp * cleanP, color: (CODE_COLORS as any)[line.color] || C.text, marginTop: i === 0 ? 20 : 0, borderTop: i === 0 ? `2px dashed ${C.green}` : 'none', paddingTop: i === 0 ? 12 : 0}}>
                  <span style={{color: C.muted, marginRight: 12, width: 20, display: 'inline-block'}}>{line.n}</span>{line.code}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Refactoring arrow indicator */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.green}33`}}>
          <Check size={40} p={sealP} color={C.green} />
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green}}>Clean Direct Addressing ──► Strip .Select / Selection; Address Range & Cells Directly</Mix>
        </div>
      </div>

      <Caption text="Visual Basic Editor (Alt + F11) ──► Project Explorer → Modules → Sub ... End Sub" from={60} to={720} tone="ok" />
      <Caption text="Clean Direct Addressing ──► Strip .Select / Selection Bloat; Address Range & Cells Directly" from={840} to={1320} tone="ok" />
    </Stage>
  );
};
