import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, UIFONT} from '../theme';
import {PRODUCTS, productCell} from '../data';
import {
  Caption, ExcelApp, Neon, Stage, TopBadge, XL, clamp, geo, prog, sec,
} from '../kit';

// SC02: Exact Match (FALSE/0) vs Approximate Match (TRUE/1) — split screen.
// Anchors (s): 41.0 split appears | 43.0 left scan | 47.0 left result (green) | 53.0 right scan | 57.0 right result (red)
//              69.0 mandatory rule badge
const S = START.s2;
const t = (g: number) => sec(g - S);

const prodColW = (c: number) => [0, 130, 200, 110][c] ?? XL.colW;

// cell center in Excel logical coordinates for the products table
const pCell = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += prodColW(i);
  return {x: x + prodColW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

/** Mini Excel panel: renders ExcelApp at a fixed scale inside a positioned container. */
const Panel: React.FC<{
  x: number; y: number; scale: number; title: string; titleColor: string;
  children?: React.ReactNode;
}> = ({x, y, scale, title, titleColor, children}) => {
  const f = useCurrentFrame();
  const w = XL.W * scale, h = XL.H * scale;
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
        <div style={{width: 14, height: 14, borderRadius: 7, background: titleColor, boxShadow: `0 0 12px ${titleColor}`}} />
        <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: titleColor}}>{title}</span>
      </div>
      <div style={{position: 'relative', width: w, height: h, borderRadius: 10, overflow: 'hidden', border: `2px solid ${titleColor}55`, boxShadow: `0 20px 60px rgba(2,6,23,0.6), 0 0 30px ${titleColor}22`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: XL.W, height: XL.H, transformOrigin: '0 0', transform: `scale(${scale})`}}>
          {children}
        </div>
      </div>
    </div>
  );
};

/** Scan arrow that sweeps down column A then shifts right to column C. */
const ScanTrail: React.FC<{scanP: number; shiftP: number; matchRow: number; color: string; wrong?: boolean}> = ({scanP, shiftP, matchRow, color, wrong}) => {
  const g = geo(1, 0, 1);
  const colAx = pCell(1, 1).x;
  const topY = g.colTop + 4;
  const bottomY = pCell(matchRow, 1).y;
  const curY = topY + (bottomY - topY) * scanP;
  const colCx = pCell(1, 3).x;
  const arrowX = shiftP > 0 ? colAx + (colCx - colAx) * shiftP : colAx;
  const arrowY = bottomY;
  return (
    <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 25}}>
      {/* sweep trail */}
      {scanP > 0 ? <line x1={colAx} y1={topY} x2={colAx} y2={curY} stroke={color} strokeWidth={3} strokeDasharray="5 4" opacity={0.7} /> : null}
      {/* horizontal shift */}
      {shiftP > 0 ? <line x1={colAx} y1={arrowY} x2={arrowX} y2={arrowY} stroke={color} strokeWidth={3} opacity={0.85} /> : null}
      {/* arrowhead */}
      <circle cx={arrowX} cy={arrowY} r={7} fill={color} opacity={0.9} />
      {wrong ? (
        <g>
          <line x1={arrowX - 12} y1={arrowY - 12} x2={arrowX + 12} y2={arrowY + 12} stroke={color} strokeWidth={3} />
          <line x1={arrowX + 12} y1={arrowY - 12} x2={arrowX - 12} y2={arrowY + 12} stroke={color} strokeWidth={3} />
        </g>
      ) : null}
    </svg>
  );
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = prog(f, t(1.0), 12);

  // LEFT: exact match scan (43-47s), result (47+)
  const leftScan = prog(f, t(43.0), 16);
  const leftShift = prog(f, t(47.0), 10);
  const leftResult = prog(f, t(48.5), 12);
  const leftNeon = prog(f, t(47.0), 10) * (1 - prog(f, t(85), 12));

  // RIGHT: approximate match scan (53-57s), wrong result (57+)
  const rightScan = prog(f, t(53.0), 16);
  const rightShift = prog(f, t(57.0), 10);
  const rightResult = prog(f, t(58.5), 12);
  const rightNeon = prog(f, t(57.0), 10) * (1 - prog(f, t(85), 12));

  // mandatory rule badge (69+)
  const ruleP = prog(f, t(69.0), 14) * (1 - prog(f, t(85), 12));

  const scale = 0.55;
  const px = 60, py = 185;
  const pw = XL.W * scale;

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      {/* fade-in overlay */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.bg, opacity: 1 - fadeIn, pointerEvents: 'none'}} />

      {/* LEFT panel: Exact Match (FALSE / 0) */}
      <div style={{position: 'absolute', left: px, top: py - 30, opacity: fadeIn}}>
        <Panel x={0} y={0} scale={scale} title="Exact Match — FALSE / 0" titleColor={C.green}>
          <ExcelApp
            file="Products.xlsx" nameBox="E2" formula='=VLOOKUP("PROD-902", A1:C9, 3, FALSE)'
            cell={(r, c) => productCell(r, c) as any} colW={prodColW}
            sel={{r1: 3, c1: 1, r2: 3, c2: 1}} active={{r: 3, c: 1}} thumb={0} thumbSize={0.55}
          >
            <Neon x={pCell(3, 1).x - prodColW(1) / 2} y={pCell(3, 1).y - XL.rowH / 2} w={prodColW(1)} h={XL.rowH} color={C.green} p={leftNeon} />
            <Neon x={pCell(3, 3).x - prodColW(3) / 2} y={pCell(3, 3).y - XL.rowH / 2} w={prodColW(3)} h={XL.rowH} color={C.green} p={leftResult} label="$450 ✓" labelBelow />
            <ScanTrail scanP={leftScan} shiftP={leftShift} matchRow={3} color={C.green} />
          </ExcelApp>
        </Panel>
        {/* result summary */}
        <div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, opacity: leftResult}}>
          <svg width={36} height={36} viewBox="0 0 36 36"><circle cx={18} cy={18} r={16} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} /><polyline points="10,19 16,25 28,11" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.green}}>PROD-902 → EGP 450</span>
        </div>
      </div>

      {/* RIGHT panel: Approx Match Trap (TRUE / 1) */}
      <div style={{position: 'absolute', left: px + pw + 50, top: py - 30, opacity: fadeIn}}>
        <Panel x={0} y={0} scale={scale} title="Approx Match Trap — TRUE / 1" titleColor={C.red}>
          <ExcelApp
            file="Products.xlsx" nameBox="E2" formula='=VLOOKUP("PROD-902", A1:C9, 3)'
            cell={(r, c) => productCell(r, c) as any} colW={prodColW}
            sel={{r1: 2, c1: 1, r2: 2, c2: 1}} active={{r: 2, c: 1}} thumb={0} thumbSize={0.55}
          >
            <Neon x={pCell(2, 1).x - prodColW(1) / 2} y={pCell(2, 1).y - XL.rowH / 2} w={prodColW(1)} h={XL.rowH} color={C.red} p={rightNeon} />
            <Neon x={pCell(2, 3).x - prodColW(3) / 2} y={pCell(2, 3).y - XL.rowH / 2} w={prodColW(3)} h={XL.rowH} color={C.red} p={rightResult} label="$350 ✗ WRONG" labelBelow />
            <ScanTrail scanP={rightScan} shiftP={rightShift} matchRow={2} color={C.red} wrong={rightResult > 0.3} />
          </ExcelApp>
        </Panel>
        <div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, opacity: rightResult}}>
          <svg width={36} height={36} viewBox="0 0 36 36"><circle cx={18} cy={18} r={16} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} /><line x1={12} y1={12} x2={24} y2={24} stroke={C.red} strokeWidth={4} strokeLinecap="round" /><line x1={24} y1={12} x2={12} y2={24} stroke={C.red} strokeWidth={4} strokeLinecap="round" /></svg>
          <span style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.red}}>PROD-902 → EGP 350 (wrong!)</span>
        </div>
      </div>

      {/* mandatory rule badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: ruleP}}>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 999, padding: '14px 44px', boxShadow: `0 0 0 6px ${C.green}22, 0 0 30px ${C.green}44`}}>
          <span style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.green}}>⚠ Always append 0 or FALSE for codes, IDs & text lookups</span>
        </div>
      </div>

      <Caption text="Exact Match (FALSE / 0) ──► Mandated for Unique IDs, Codes & Text Lookups" from={t(42.0)} to={t(60.0)} tone="ok" />
      <Caption text="Approx Match Trap (TRUE / 1) ──► Returns Wrong Adjacent Values Unless Table is Sorted" from={t(60.0)} to={t(84.0)} tone="danger" />
    </Stage>
  );
};
