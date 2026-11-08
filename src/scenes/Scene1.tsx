import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {PRICING, pricingCell} from '../data';
import {CAM0, Caption, ExcelApp, ExcelWindow, Stage, TopBadge, XL, geo, prog, sec, clamp} from '../kit';
import {LiquidSpill, DragHandle, GlowingToken} from '../fx';

// SC01: Dynamic Arrays vs Legacy Formulas — side-by-side comparison.
// Left: legacy drag-fill (amber, struggling). Right: dynamic array spill (blue, instant liquid).
const S = START.s1;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 200, 80, 140, 140][c] ?? XL.colW;
const cc = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += colW(i);
  return {x: x + colW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

/** Mini Excel panel at a fixed scale inside a positioned container. */
const Panel: React.FC<{x: number; y: number; scale: number; title: string; titleColor: string; children?: React.ReactNode}> = ({x, y, scale, title, titleColor, children}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
      <div style={{width: 14, height: 14, borderRadius: 7, background: titleColor, boxShadow: `0 0 12px ${titleColor}`}} />
      <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: titleColor}}>{title}</span>
    </div>
    <div style={{position: 'relative', width: XL.W * scale, height: XL.H * scale, borderRadius: 10, overflow: 'hidden', border: `2px solid ${titleColor}55`, boxShadow: `0 20px 60px rgba(2,6,23,0.6), 0 0 30px ${titleColor}22`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: XL.W, height: XL.H, transformOrigin: '0 0', transform: `scale(${scale})`}}>
        {children}
      </div>
    </div>
  </div>
);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = prog(f, t(1.0), 12);

  // LEFT: legacy drag-fill. Cursor struggles from row 2 down to row 10.
  // Each row takes ~0.5s (slow). Shows amber drag handle shaking.
  const dragStart = t(3.0);
  const dragRow = 2 + Math.floor(clamp((f - dragStart) / sec(6)) * 8); // rows 2..10 over 6s
  const dragDone = f >= t(9.0);

  // RIGHT: dynamic array spill. Formula in D2, results spill instantly.
  const spillStart = t(3.0);
  const spillP = prog(f, t(3.0), sec(1.5)); // instant spill in 1.5s

  const scale = 0.62;
  const panelY = 165;
  const leftX = 40;
  const rightX = 40 + XL.W * scale + 40;

  const g = geo(1, 0, 1);
  const dataRows = PRICING.length;

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      {/* fade-in overlay */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.bg, opacity: 1 - fadeIn, pointerEvents: 'none'}} />

      {/* LEFT panel: Legacy Drag-Fill */}
      <div style={{position: 'absolute', left: leftX, top: panelY, opacity: fadeIn}}>
        <Panel x={0} y={0} scale={scale} title="Legacy: Manual Drag-Fill" titleColor={C.amber}>
          <ExcelApp
            file="Pricing_Old.xlsx" nameBox="D2" formula="=B2*C2"
            cell={(r, c) => {
              // Only show results in rows the drag has reached
              if (c === 4 && r >= 2 && r <= dataRows + 1) {
                const reached = r <= dragRow;
                if (reached) {
                  const row = PRICING[r - 2];
                  return {t: 'EGP ' + (row.qty * row.price).toLocaleString('en-US'), al: 'r', color: '#92400E'};
                }
                return {t: ''};
              }
              return pricingCell(r, c) as any;
            }} colW={colW}
            sel={{r1: 2, c1: 4, r2: 2, c2: 4}} active={{r: 2, c: 4}} thumb={0} thumbSize={0.55}
          >
            {/* Drag handle at current row */}
            <DragHandle x={cc(dragRow, 4).x + colW(4) / 2 - 4} y={cc(dragRow, 4).y - XL.rowH / 2} p={1} struggling={!dragDone} />
          </ExcelApp>
        </Panel>
        <div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, opacity: dragDone ? 0 : 1}}>
          <svg width={24} height={24} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} fill="none" stroke={C.amber} strokeWidth={2.5} /><path d="M12 7v5M12 16v.5" stroke={C.amber} strokeWidth={2.5} strokeLinecap="round" /></svg>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.amber}}>Slow: drag handle copies formula cell-by-cell</span>
        </div>
      </div>

      {/* RIGHT panel: Dynamic Array Spill */}
      <div style={{position: 'absolute', left: rightX, top: panelY, opacity: fadeIn}}>
        <Panel x={0} y={0} scale={scale} title="Excel 365: Dynamic Array Spill" titleColor={C.blue}>
          <ExcelApp
            file="Pricing_365.xlsx" nameBox="D2" formula="=B2:B10 * C2:C10"
            cell={(r, c) => {
              if (c === 4 && r >= 2 && r <= dataRows + 1) {
                if (spillP > 0) {
                  const row = PRICING[r - 2];
                  const rowProgress = clamp(spillP * dataRows - (r - 2));
                  if (rowProgress > 0) {
                    return {t: 'EGP ' + (row.qty * row.price).toLocaleString('en-US'), al: 'r', color: '#107C41'};
                  }
                }
                return {t: ''};
              }
              return pricingCell(r, c) as any;
            }} colW={colW}
            sel={{r1: 2, c1: 4, r2: 2, c2: 4}} active={{r: 2, c: 4}} thumb={0} thumbSize={0.55}
          >
            {/* Liquid spill flow down column D */}
            <LiquidSpill x={cc(2, 4).x - colW(4) / 2} topY={g.rowsTop} bottomY={cc(dataRows + 1, 4).y + XL.rowH / 2} w={colW(4)} p={spillP} color={C.blue} />
          </ExcelApp>
        </Panel>
        <div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, opacity: spillP > 0.5 ? 1 : 0}}>
          <svg width={24} height={24} viewBox="0 0 24 24"><polyline points="5,13 10,18 19,7" fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.green}}>Instant: 1 formula spills all results in 1 click</span>
        </div>
      </div>

      {/* Lesson counter badge (top-right) */}
      <div style={{position: 'absolute', right: 56, top: 80, opacity: fadeIn}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 15 من 76 · الوحدة 4 من 14</div>
      </div>

      <TopBadge text="الدرس 15 من 76 | الوحدة 4 من 14 ──► Dynamic Arrays & Spill Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Single-Cell Formula ──► =B2:B10 * C2:C10 Spills Results Automatically Across Grid" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
