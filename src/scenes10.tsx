import React from 'react';
import {COL, XL} from './theme';
import {ANCH, SCENE_END, SCENE_START} from './sync';
import {Arrow, Box, Cell, Geo, Rect, Seal, Sel, View, pe, pg} from './kit';
import {IN, INC, K, band, ctr, fmtN, hdrC, hp, hwFor, one, path, rng, rr, sales} from './data';

type Out = {v: View; zoom: number; zx: number; zy: number};
const A = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
const END = (i: number) => SCENE_END[i] - SCENE_START[i];
export const at = (i: number, k: number, f: number) => {
  const a = A(i, k), b = k + 1 < ANCH[i].length ? A(i, k + 1) : END(i);
  return a + f * (b - a);
};
const wrap = (o: number, kids: React.ReactNode) => <div style={{position: 'absolute', inset: 0, opacity: o}}>{kids}</div>;
const ER = (t: string, b?: boolean): Cell => ({t, al: 'c', b});
const emer = (a: number) => `rgba(16,185,129,${a})`;
/** typing a wrapper around an existing formula: prefix typed first, then suffix */
const wrapTyped = (t: number, t0: number, t1: number, pre: string, inner: string, suf: string) => {
  if (t < t0) return '=' + inner;
  const q = pg(t, t0, t1);
  return q < 0.55 ? '=' + pre.slice(0, Math.round((pre.length * q) / 0.55)) + inner : '=' + pre + inner + suf.slice(0, Math.round((suf.length * (q - 0.55)) / 0.45));
};
const Dim: React.FC<{o: number; holes: (Rect | null)[]}> = ({o, holes}) => {
  const hs = holes.filter((h): h is Rect => h !== null);
  const d = 'M-10 -10H2000V1000H-10Z' + hs.map((h) => `M${h.x - 2} ${h.y - 2}h${h.w + 4}v${h.h + 4}h${-h.w - 4}Z`).join('');
  return <svg style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: o, pointerEvents: 'none'}}><path d={d} fillRule="evenodd" fill="rgba(15,23,42,0.72)"/></svg>;
};
const Warn: React.FC<{x: number; y: number; c: string; s?: number}> = ({x, y, c, s = 26}) => (
  <svg style={{position: 'absolute', left: x - s / 2, top: y - s / 2, filter: `drop-shadow(0 0 6px ${c})`}} width={s} height={s} viewBox="0 0 24 24">
    <path d="M12 3L22 20H2z" fill={c} stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><rect x="11" y="9" width="2" height="6" fill="#0F172A"/><rect x="11" y="16.5" width="2" height="2" fill="#0F172A"/>
  </svg>
);

// ---------------- shared report sheet (scenes 1-2) ----------------
const PROD = ['Laptop', 'Mobile', 'Tablet', 'Printer', 'Monitor', 'Keyboard', 'Router', 'Camera'];
const REG = ['Cairo', 'Giza', 'Alex', 'Tanta', 'Luxor', 'Cairo', 'Aswan', 'Suez'];
const CS = [12000, 9000, 15000, 6000, 8400, 10500, 7200, 9600];
const DS = ['30', '30', '0', '30', 'n/a', '30', '30', '30'];
const BUD: Record<string, number> = {Cairo: 50000, Giza: 40000, Alex: 30000, Tanta: 20000, Luxor: 15000};
const E_RAW = ['400', '300', '#DIV/0!', '200', '#VALUE!', '350', '240', '320'];
const E_FIX = ['400', '300', '0', '200', '0', '350', '240', '320'];
const report = (r: number, c: number, eFix: (r: number) => boolean, eAll: boolean, bgOf: (r: number) => string | undefined): Cell | undefined => {
  if (r === 1) return c < 7 ? hdrC(['Product', 'Region', 'Sales', 'Days', 'Per Day', 'Budget', 'Left'][c]) : c === 9 ? hdrC('Region') : c === 10 ? hdrC('Budget') : undefined;
  if (r >= 2 && r <= 6 && (c === 9 || c === 10)) { const k = Object.keys(BUD)[r - 2]; return c === 9 ? {t: k} : {t: String(BUD[k]), bg: IN, col: INC}; }
  if (r === 11 || r === 12) {
    if (c === 0) return {t: r === 11 ? 'Total' : 'Average', b: true};
    if (c === 4) return eAll ? {t: r === 11 ? '1810' : '226.25', f: r === 11 ? '=SUM(E2:E9)' : '=AVERAGE(E2:E9)', b: true} : ER('#DIV/0!', true);
    if (c === 6) return ER('#N/A', true);
    return undefined;
  }
  if (r < 2 || r > 9) return undefined;
  const i = r - 2, bg = band(r);
  const bud = BUD[REG[i]];
  if (c === 0) return {t: PROD[i], bg};
  if (c === 1) return {t: REG[i], bg};
  if (c === 2) return {t: String(CS[i]), bg};
  if (c === 3) return {t: DS[i], bg, al: 'r'};
  if (c === 4) {
    if (eFix(r)) return {t: E_FIX[i], f: `=IFERROR(C${r}/D${r},0)`, bg: bgOf(r) ?? bg};
    return E_RAW[i].startsWith('#') ? {...ER(E_RAW[i]), bg} : {t: E_RAW[i], f: `=C${r}/D${r}`, bg};
  }
  if (c === 5) return bud ? {t: String(bud), f: `=VLOOKUP(B${r},$J$2:$K$6,2,FALSE)`, bg} : {...ER('#N/A'), bg};
  if (c === 6) return bud ? {t: String(bud - CS[i]), f: `=F${r}-C${r}`, bg} : {...ER('#N/A'), bg};
  return undefined;
};

// ================= SCENE 1: errors & propagation =================
export const s1 = (t: number): Out => {
  const tNA = at(0, 2, 0.45), tDV = at(0, 2, 0.62), tVA = at(0, 2, 0.85), tProp = at(0, 3, 0.05), tDim = at(0, 3, 0.55);
  let sel: Sel = one(1, 0);
  let fb = '';
  if (t >= at(0, 3, 0.15)) { sel = one(11, 4); fb = '=SUM(E2:E9)'; }
  if (t >= at(0, 3, 0.6)) { sel = one(12, 6); fb = '=AVERAGE(G2:G9)'; }
  if (t >= at(0, 4, 0.3)) { sel = one(11, 6); fb = '=SUM(G2:G9)'; }
  const ov = (g: Geo) => {
    const pulse = 0.55 + 0.35 * Math.sin(t * 4);
    const errs: [number, number, number][] = [[8, 6, tNA], [9, 6, tNA + 0.25], [4, 4, tDV], [6, 4, tVA]];
    const holes = [...errs.map(([r, c]) => g.cell(r, c)), g.rect(11, 4, 12, 4), g.rect(11, 6, 12, 6)];
    const arrows = [4, 6].map((c) => {
      const lastR = c === 4 ? 6 : 9, x = g.cx(c) + 4;
      return <Arrow key={c} x1={x} y1={rr(g, lastR, c).y + XL.rowH - 3} x2={x} y2={rr(g, 11, c).y + 1} c={COL.red} w={3} p={pe(t, tProp + (c === 4 ? 0 : 0.4), tProp + 1.3 + (c === 4 ? 0 : 0.4))}/>;
    });
    return (
      <div style={{position: 'absolute', inset: 0}}>
        <Dim o={pe(t, tDim, tDim + 0.8) * (1 - pe(t, 36, 37.4))} holes={holes}/>
        {errs.map(([r, c, tt], i) => { const p = pe(t, tt, tt + 0.4); return p > 0 ? <div key={i} style={{position: 'absolute', inset: 0, opacity: p}}><Box r={g.cell(r, c)} c={COL.red} w={2.5} glow={pulse} pad={1}/></div> : null; })}
        {arrows}
        {wrap(pe(t, tProp + 1.0, tProp + 1.5), <div style={{position: 'absolute', inset: 0}}><Box r={g.rect(11, 4, 12, 4)} c={COL.red} w={2.5} glow={pulse} pad={1}/><Box r={g.rect(11, 6, 12, 6)} c={COL.red} w={2.5} glow={pulse} pad={1}/></div>)}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 14, 13), e11 = ctr(g, 11, 4), g12 = ctr(g, 12, 6), g11 = ctr(g, 11, 6);
    const ks: K[] = [[0, rest.x, rest.y], [at(0, 3, 0), rest.x, rest.y], [at(0, 3, 0.15) - 0.4, e11.x, e11.y], [at(0, 3, 0.6) - 0.4, g12.x, g12.y], [at(0, 4, 0.3) - 0.4, g11.x, g11.y], [36, g11.x, g11.y], [37.5, rest.x, rest.y]];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, cell: (r, c) => report(r, c, () => false, false, () => undefined), sel, fb, ov, cursor, sheet: 0, sheets: ['Report', 'Compare', 'Fallback'], file: 'Error_Handling_Practice'};
  return {v, zoom: 1 + 0.18 * pe(t, 37.4, 39.8), zx: 330, zy: 160};
};

// ================= SCENE 2: IFERROR =================
export const T2 = {e: A(1, 3)};
export const s2 = (t: number): Out => {
  const tE4 = A(1, 0) + 1.0, tDbl = A(1, 1) + 1.2, tT0 = A(1, 2) + 0.3, tT1 = A(1, 2) + 4.5, tEnter = A(1, 3) + 0.2, tClick = A(1, 3) + 1.0, tF0 = A(1, 3) + 1.6, tF1 = A(1, 3) + 3.2;
  const tr = (r: number) => (r === 2 ? tEnter : tF0 + ((r - 2) / 7) * (tF1 - tF0));
  const fixed = (r: number) => t >= tr(r);
  const bgOf = (r: number) => { const g1 = 1 - pg(t, tr(r), tr(r) + 1.2); return g1 > 0.02 ? emer(0.45 * g1) : undefined; };
  const eAll = t >= tF1 + 0.2;
  let sel: Sel = one(11, 6);
  let fb = '=SUM(G2:G9)';
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  if (t >= tE4) { sel = one(4, 4); fb = '=C4/D4'; }
  if (t >= tDbl && t < tEnter) { sel = one(2, 4); edit = {r: 2, c: 4, text: wrapTyped(t, tT0, tT1, 'IFERROR(', 'C2/D2', ',0)'), caret: true}; mode = 'Edit'; name = 'E2'; }
  if (t >= tEnter) { sel = one(3, 4); fb = ''; }
  if (t >= tClick) { sel = one(2, 4); fb = '=IFERROR(C2/D2,0)'; }
  if (t >= tF0) sel = rng(2, 4, 2 + Math.round(pe(t, tF0 + 0.2, tF1) * 7), 4, 2, 4);
  if (t >= tF1 + 0.1) sel = rng(2, 4, 9, 4, 2, 4);
  if (t >= A(1, 4) + 1.0) { sel = one(11, 4); fb = '=SUM(E2:E9)'; }
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 4);
    const raw4 = 1 - pe(t, tr(4), tr(4) + 0.3), raw6 = 1 - pe(t, tr(6), tr(6) + 0.3);
    const sealA = pe(t, tEnter, tEnter + 0.6) * (1 - pe(t, tF1 + 2, tF1 + 3));
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(raw4, <Box r={g.cell(4, 4)} c={COL.red} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(raw6, <Box r={g.cell(6, 4)} c={COL.red} w={2.5} glow={pulse} pad={1}/>)}
        <Box r={g.cell(8, 6)} c={COL.red} w={2} glow={0.4} pad={1}/><Box r={g.cell(9, 6)} c={COL.red} w={2} glow={0.4} pad={1}/>
        <Box r={g.rect(11, 6, 12, 6)} c={COL.red} w={2} glow={0.4} pad={1}/>
        {wrap(1 - pe(t, tF1 + 0.2, tF1 + 0.6), <Box r={g.rect(11, 4, 12, 4)} c={COL.red} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, tF1 + 0.3, tF1 + 0.9), <Box r={g.rect(11, 4, 12, 4)} c={COL.green} w={3} glow={0.9} pad={1}/>)}
        {wrap(pe(t, tF1, tF1 + 0.6), <Box r={g.rect(2, 4, 9, 4)} c={COL.green} w={2.5} glow={0.5}/>)}
        {sealA > 0 ? <Seal x={g.cx(12) + 30} y={rr(g, 6, 12).y + 10} s={96} p={sealA}/> : null}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 14, 13), e4 = ctr(g, 4, 4), e2 = ctr(g, 2, 4), h2 = hp(g, 2, 4), h9 = hp(g, 9, 4), e11 = ctr(g, 11, 4);
    const ks: K[] = [[0, rest.x, rest.y], [tE4 - 0.6, rest.x, rest.y], [tE4, e4.x, e4.y], [tDbl - 0.7, e4.x, e4.y], [tDbl, e2.x, e2.y], [tClick - 0.2, e2.x, e2.y], [tF0 - 0.05, h2.x, h2.y, 'cross'], [tF0, h2.x, h2.y, 'cross'], [tF1, h9.x, h9.y, 'cross'], [tF1 + 0.9, e11.x, e11.y, 'arrow'], [END(1), e11.x, e11.y]];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, cell: (r, c) => report(r, c, fixed, eAll, bgOf), sel, edit, fb, name, mode, ov, cursor, sheet: 0, sheets: ['Report', 'Compare', 'Fallback'], file: 'Error_Handling_Practice'};
  return {v, zoom: 1 + 0.18 * (1 - pe(t, 1.0, 3.0)), zx: 330, zy: 160};
};

// ================= SCENE 3: IFNA vs IFERROR =================
export const s3 = (t: number): Out => {
  const tL0 = A(2, 1) + 0.8, tLE = A(2, 1) + 4.2, tR0 = A(2, 3) + 0.4, tRE = A(2, 3) + 4.3, tK0 = A(2, 3) + 6.3, tKE = A(2, 3) + 9.0;
  const LI = ['Laptop', 'Mobile', 'Tablet'], LS = [12000, 9000, 6000], LD = ['30', '0', '30'], LP = ['400', '0', '200'];
  const codes = ['A-100', 'A-900', 'A-300'], RJ = ['30', '30', '0'];
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 2) { const h = ['Item', 'Sales', 'Days', 'Per Day']; if (c < 4) return hdrC(h[c]); const h2 = ['Code', 'Product', 'Sales', 'Days', 'Per Day']; if (c >= 6 && c <= 10) return hdrC(h2[c - 6]); if (c === 12) return hdrC('Code'); if (c === 13) return hdrC('Product'); return undefined; }
    if (r >= 3 && r <= 5) {
      const i = r - 3, bg = band(r);
      if (c === 0) return {t: LI[i], bg}; if (c === 1) return {t: String(LS[i]), bg}; if (c === 2) return {t: LD[i], bg};
      if (c === 3) { if (i === 1) return t >= tLE ? {t: '0', f: '=IFERROR(B4/C4,0)', bg: 'rgba(245,158,11,0.3)'} : ER('#DIV/0!'); return {t: LP[i], bg}; }
      if (c === 6) return {t: codes[i], bg};
      if (c === 7) { if (i === 1) return t >= tRE ? {t: 'Not Found', f: '=IFNA(VLOOKUP(G4,$M$3:$N$5,2,FALSE),"Not Found")', bg: 'rgba(168,85,247,0.22)', ovf: true} : ER('#N/A'); return {t: LI[i], bg}; }
      if (c === 8) return {t: String(LS[i]), bg}; if (c === 9) return {t: RJ[i], bg};
      if (c === 10) return i === 2 ? ER('#DIV/0!') : {t: LP[i === 1 ? 2 : 0] === '200' ? '300' : '400', bg};
      if (c === 12) return {t: ['A-100', 'A-200', 'A-300'][i]};
      if (c === 13) return {t: LI[i]};
    }
    return undefined;
  };
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  let fb = '';
  if (t >= A(2, 1) + 0.2) { sel = one(4, 3); fb = '=B4/C4'; }
  if (t >= tL0 && t < tLE) { edit = {r: 4, c: 3, text: wrapTyped(t, tL0 + 0.5, tLE - 0.4, 'IFERROR(', 'B4/C4', ',0)'), caret: true}; mode = 'Edit'; name = 'D4'; }
  if (t >= tLE) { sel = one(4, 3); fb = '=IFERROR(B4/C4,0)'; }
  if (t >= A(2, 2)) { sel = one(4, 7); fb = '=VLOOKUP(G4,$M$3:$N$5,2,FALSE)'; }
  if (t >= tR0 && t < tRE) { edit = {r: 4, c: 7, text: wrapTyped(t, tR0 + 0.4, tRE - 0.4, 'IFNA(', 'VLOOKUP(G4,$M$3:$N$5,2,FALSE)', ',"Not Found")'), caret: true}; mode = 'Edit'; name = 'H4'; }
  if (t >= tRE) { sel = one(4, 7); fb = '=IFNA(VLOOKUP(G4,$M$3:$N$5,2,FALSE),"Not Found")'; }
  if (t >= tK0) { sel = one(5, 10); fb = '=I5/J5'; }
  if (t >= tK0 && t < tKE) { edit = {r: 5, c: 10, text: wrapTyped(t, tK0 + 0.3, tKE - 0.4, 'IFNA(', 'I5/J5', ',"n/a")'), caret: true}; mode = 'Edit'; name = 'K5'; }
  if (t >= tKE) { sel = one(5, 10); fb = '=IFNA(I5/J5,"n/a")'; }
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 3.4);
    const fa = pe(t, 0.8, 1.6);
    const holeA = pe(t, tLE, tLE + 0.5), holeP = pe(t, tRE, tRE + 0.5), holeR = pe(t, tKE, tKE + 0.5);
    const f4 = rr(g, 4, 5);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(fa, <div style={{position: 'absolute', inset: 0}}><Box r={g.rect(2, 0, 5, 3)} c={COL.amber} w={2} glow={0.5 + 0.2 * Math.sin(t * 2)} dash pad={2}/><Box r={g.rect(2, 6, 5, 10)} c={COL.purple} w={2} glow={0.5 + 0.2 * Math.sin(t * 2)} dash pad={2}/></div>)}
        {wrap(holeA, <div style={{position: 'absolute', inset: 0}}><Box r={g.cell(4, 2)} c={COL.amber} w={2} glow={pulse} pad={1}/><Box r={g.cell(4, 3)} c={COL.amber} w={3} glow={pulse + 0.3} pad={1}/><Warn x={f4.x + 32} y={f4.y + 10} c={COL.amber}/></div>)}
        {wrap(holeP, <Box r={g.cell(4, 7)} c={COL.purple} w={3} glow={pulse + 0.3} pad={1}/>)}
        {wrap(holeR, <Box r={g.cell(5, 10)} c={COL.red} w={3} glow={pulse + 0.4} pad={1}/>)}
        {wrap(pe(t, A(2, 2) + 0.5, A(2, 2) + 1.2) * (1 - holeP), <Box r={g.cell(4, 7)} c={COL.red} w={2} glow={0.5} pad={1}/>)}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 12, 9), d4 = ctr(g, 4, 3), h4 = ctr(g, 4, 7), k5 = ctr(g, 5, 10);
    const ks: K[] = [[0, rest.x, rest.y], [A(2, 1), rest.x, rest.y], [A(2, 1) + 0.2, d4.x, d4.y], [A(2, 2) - 0.4, d4.x, d4.y], [A(2, 2), h4.x, h4.y], [tK0 - 0.4, h4.x, h4.y], [tK0, k5.x, k5.y], [END(2) - 8, k5.x, k5.y], [END(2) - 6, rest.x, rest.y]];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, cell, sel, edit, fb, name, mode, ov, cursor, sheet: 1, sheets: ['Report', 'Compare', 'Fallback'], file: 'Error_Handling_Practice'};
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ================= SCENE 4: fallback values =================
export const s4 = (t: number): Out => {
  const CODES = ['A-100', 'A-200', 'A-404', 'A-300', 'A-777', 'A-400'];
  const BV = [12000, 9000, 0, 6000, 0, 15000], CV = ['13200', '9900', '0', '6600', '0', '16500'];
  const CAT = ['Laptops', 'Phones', '', 'Printers', '', 'Screens'];
  const miss = (i: number) => i === 2 || i === 4;
  const tB0 = A(3, 1) + 0.4, tBE = A(3, 1) + 3.2, tBf0 = A(3, 1) + 3.5, tBf1 = A(3, 1) + 4.5, tC0 = A(3, 1) + 4.9, tC1 = A(3, 1) + 6.1;
  const tD0 = A(3, 2) + 0.3, tDE = A(3, 2) + 3.7, tDf0 = A(3, 2) + 4.2, tDf1 = A(3, 2) + 5.4, tP = A(3, 2) + 7.2;
  const trB = (r: number) => (r === 2 ? tBE : tBf0 + ((r - 2) / 5) * (tBf1 - tBf0));
  const trD = (r: number) => (r === 2 ? tDE : tDf0 + ((r - 2) / 5) * (tDf1 - tDf0));
  const bAll = t >= tBf1 + 0.1, blank = t >= tC0 && t < tC1, pending = t >= tP;
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 1) return c < 4 ? hdrC(['Code', 'Sales', 'Forecast', 'Category'][c]) : c >= 8 && c <= 10 ? hdrC(['Code', 'Sales', 'Category'][c - 8]) : undefined;
    if (r >= 2 && r <= 5 && c >= 8 && c <= 10) return {t: [['A-100', '12000', 'Laptops'], ['A-200', '9000', 'Phones'], ['A-300', '6000', 'Printers'], ['A-400', '15000', 'Screens']][r - 2][c - 8]};
    if (r === 9) {
      if (c === 0) return {t: 'Total', b: true};
      if (c === 1) return bAll ? {t: '42000', f: '=SUM(B2:B7)', b: true} : ER('#N/A', true);
      if (c === 2) return bAll ? (blank ? ER('#VALUE!', true) : {t: '46200', f: '=SUM(C2:C7)', b: true}) : ER('#N/A', true);
      return undefined;
    }
    if (r < 2 || r > 7) return undefined;
    const i = r - 2, bg = band(r);
    if (c === 0) return {t: CODES[i], bg};
    if (c === 1) {
      if (t < trB(r)) return miss(i) ? {...ER('#N/A'), bg} : {t: String(BV[i]), f: `=VLOOKUP(A${r},$I$2:$K$5,2,FALSE)`, bg};
      const g1 = 1 - pg(t, trB(r), trB(r) + 1.2);
      const b2 = g1 > 0.02 ? emer(0.5 * g1) : miss(i) ? emer(0.28) : bg;
      return miss(i) && blank ? {t: '', f: `=IFERROR(VLOOKUP(A${r},$I$2:$K$5,2,FALSE),"")`, bg: b2} : {t: String(BV[i]), f: `=IFERROR(VLOOKUP(A${r},$I$2:$K$5,2,FALSE),0)`, bg: b2};
    }
    if (c === 2) {
      if (t < trB(r)) return miss(i) ? {...ER('#N/A'), bg} : {t: CV[i], f: `=B${r}*1.1`, bg};
      return miss(i) && blank ? {...ER('#VALUE!'), bg} : {t: CV[i], f: `=B${r}*1.1`, bg};
    }
    if (c === 3) {
      if (t < trD(r)) return miss(i) ? {...ER('#N/A'), bg} : {t: CAT[i], f: `=VLOOKUP(A${r},$I$2:$K$5,3,FALSE)`, bg};
      const g1 = 1 - pg(t, trD(r), trD(r) + 1.2);
      const col = pending ? '245,158,11' : '56,189,248';
      const b2 = g1 > 0.02 ? `rgba(${col},${0.5 * g1})` : miss(i) ? `rgba(${col},0.22)` : bg;
      return {t: miss(i) ? (pending ? 'Data Pending' : '') : CAT[i], f: `=IFERROR(VLOOKUP(A${r},$I$2:$K$5,3,FALSE),${pending ? '"Data Pending"' : '""'})`, bg: b2, ovf: true};
    }
    return undefined;
  };
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  let fb = '';
  if (t >= A(3, 1) - 0.4) { sel = one(2, 1); fb = '=VLOOKUP(A2,$I$2:$K$5,2,FALSE)'; }
  if (t >= tB0 && t < tBE) { edit = {r: 2, c: 1, text: wrapTyped(t, tB0 + 0.2, tBE - 0.3, 'IFERROR(', 'VLOOKUP(A2,$I$2:$K$5,2,FALSE)', ',0)'), caret: true}; mode = 'Edit'; name = 'B2'; }
  if (t >= tBf0) sel = rng(2, 1, 2 + Math.round(pe(t, tBf0, tBf1) * 5), 1, 2, 1);
  if (t >= tBf1) { sel = one(4, 1); fb = blank ? '=IFERROR(VLOOKUP(A4,$I$2:$K$5,2,FALSE),"")' : '=IFERROR(VLOOKUP(A4,$I$2:$K$5,2,FALSE),0)'; }
  if (t >= tC1) { sel = one(4, 2); fb = '=B4*1.1'; }
  if (t >= A(3, 2) - 0.3) { sel = one(2, 3); fb = '=VLOOKUP(A2,$I$2:$K$5,3,FALSE)'; }
  if (t >= tD0 && t < tDE) { edit = {r: 2, c: 3, text: wrapTyped(t, tD0 + 0.2, tDE - 0.3, 'IFERROR(', 'VLOOKUP(A2,$I$2:$K$5,3,FALSE)', ',"")'), caret: true}; mode = 'Edit'; name = 'D2'; }
  if (t >= tDf0) sel = rng(2, 3, 2 + Math.round(pe(t, tDf0, tDf1) * 5), 3, 2, 3);
  if (t >= tDf1) { sel = one(4, 3); fb = pending ? '=IFERROR(VLOOKUP(A4,$I$2:$K$5,3,FALSE),"Data Pending")' : '=IFERROR(VLOOKUP(A4,$I$2:$K$5,3,FALSE),"")'; }
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 3.6);
    const rawA = 1 - pe(t, tBf1, tBf1 + 0.5), rawD = 1 - pe(t, tDf1, tDf1 + 0.5);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(pe(t, A(3, 0) + 0.8, A(3, 0) + 1.6) * Math.max(rawA, 0), <div style={{position: 'absolute', inset: 0}}><Box r={g.rect(2, 1, 9, 2)} c={COL.red} w={2} glow={pulse} dash/><Box r={g.rect(2, 3, 7, 3)} c={COL.red} w={2} glow={pulse} dash/></div>)}
        {wrap(pe(t, tBf1, tBf1 + 0.6), <Box r={g.rect(2, 1, 7, 1)} c={COL.green} w={2.5} glow={0.7}/>)}
        {wrap(pe(t, tBf1 + 0.2, tBf1 + 0.8), <Box r={g.rect(9, 1, 9, 2)} c={COL.green} w={2.5} glow={0.8} pad={1}/>)}
        {wrap(blank ? 1 : 0, <div style={{position: 'absolute', inset: 0}}><Box r={g.cell(4, 2)} c={COL.red} w={2.5} glow={0.9} pad={1}/><Box r={g.cell(6, 2)} c={COL.red} w={2.5} glow={0.9} pad={1}/><Box r={g.cell(9, 2)} c={COL.red} w={2.5} glow={0.9} pad={1}/></div>)}
        {wrap(pe(t, tDf1, tDf1 + 0.6), <Box r={g.rect(2, 3, 7, 3)} c={pending ? COL.amber : COL.blue} w={2.5} glow={0.7}/>)}
        {wrap(pe(t, A(3, 3), A(3, 3) + 1.0), <Box r={g.rect(1, 0, 9, 3)} c={COL.green} w={2.5} glow={0.5} dash pad={3}/>)}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 12, 9), b2 = ctr(g, 2, 1), d2 = ctr(g, 2, 3), hb2 = hp(g, 2, 1), hb7 = hp(g, 7, 1), hd2 = hp(g, 2, 3), hd7 = hp(g, 7, 3), b4 = ctr(g, 4, 1), d4 = ctr(g, 4, 3);
    const ks: K[] = [[0, rest.x, rest.y], [A(3, 1) - 0.9, rest.x, rest.y], [A(3, 1) - 0.4, b2.x, b2.y], [tBf0 - 0.1, b2.x, b2.y], [tBf0, hb2.x, hb2.y, 'cross'], [tBf1, hb7.x, hb7.y, 'cross'], [tBf1 + 0.6, b4.x, b4.y, 'arrow'], [A(3, 2) - 0.7, b4.x, b4.y], [A(3, 2) - 0.3, d2.x, d2.y], [tDf0 - 0.1, d2.x, d2.y], [tDf0, hd2.x, hd2.y, 'cross'], [tDf1, hd7.x, hd7.y, 'cross'], [tDf1 + 0.6, d4.x, d4.y, 'arrow'], [END(3) - 5, d4.x, d4.y], [END(3) - 3, rest.x, rest.y]];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, cell, sel, edit, fb, name, mode, ov, cursor, sheet: 2, sheets: ['Report', 'Compare', 'Fallback'], file: 'Error_Handling_Practice'};
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ================= SCENE 5: 50,000 rows =================
const prevOf = (r: number) => (r % 7 === 3 ? 0 : Math.round((sales(r) * 100) / (100 + ((r % 9) - 2) * 5)));
const growth = (r: number) => (prevOf(r) === 0 ? 0 : sales(r) / prevOf(r) - 1);
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const CATN = ['Laptops', 'Phones', 'Printers', 'Screens', 'Routers'];
const codeOf = (r: number) => (r % 11 === 0 ? 'A-999' : `A-${100 * ((r % 5) + 1)}`);
const AVG_G = (() => { let s = 0; for (let r = 2; r <= 50001; r++) s += growth(r); return s / 50000; })();
let TOT_S = 0;
for (let r = 2; r <= 50001; r++) TOT_S += sales(r);
export const T5 = {down1: A(4, 0) + 3.5, home: A(4, 0) + 7.0, down2: A(4, 2) + 1.0};
export const s5 = (t: number): Out => {
  const tD0 = A(4, 1) + 0.2, tDE = A(4, 1) + 2.5, tDF = A(4, 1) + 3.2, tF0 = A(4, 1) + 4.6, tFE = A(4, 1) + 7.7, tFF = A(4, 1) + 8.3, tI = A(4, 1) + 4.0;
  const top = t >= T5.down1 && t < T5.home ? 49987 : t >= T5.down2 && t < T5.down2 + 8 ? 49987 : 2;
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 1) return c < 6 ? hdrC(['Order', 'Prev', 'Sales', 'Growth', 'Code', 'Category'][c]) : c === 10 ? hdrC('Code') : c === 11 ? hdrC('Category') : undefined;
    if (r >= 2 && r <= 6 && (c === 10 || c === 11)) return {t: c === 10 ? `A-${100 * (r - 1)}` : CATN[r - 2]};
    if (r === 2 && c === 7) return {t: 'Avg Growth', al: 'r', ovf: true, b: true};
    if (r === 3 && c === 7) return {t: 'Total Sales', al: 'r', ovf: true, b: true};
    if (r === 2 && c === 8) return t >= tI ? {t: pct(AVG_G), f: '=AVERAGE(D2:D50001)', b: true, bg: emer(0.3 * (1 - pg(t, tI, tI + 1.6)))} : ER('#DIV/0!', true);
    if (r === 3 && c === 8) return {t: String(TOT_S), f: '=SUM(C2:C50001)', b: true};
    if (r < 2 || r > 50001 || c > 5) return undefined;
    const bg = band(r);
    if (c === 0) return {t: String(10000 + r), bg};
    if (c === 1) return {t: String(prevOf(r)), bg};
    if (c === 2) return {t: String(sales(r)), bg};
    if (c === 3) {
      const fx = r === 2 ? t >= tDE : t >= tDF;
      const g1 = 1 - pg(t, r === 2 ? tDE : tDF, (r === 2 ? tDE : tDF) + 1.2);
      if (fx) return {t: pct(growth(r)), f: `=IFERROR(C${r}/B${r}-1,0)`, bg: g1 > 0.02 ? emer(0.45 * g1) : bg};
      return prevOf(r) === 0 ? {...ER('#DIV/0!'), bg} : {t: pct(growth(r)), f: `=C${r}/B${r}-1`, bg};
    }
    if (c === 4) return {t: codeOf(r), bg};
    const fx = r === 2 ? t >= tFE : t >= tFF;
    const g1 = 1 - pg(t, r === 2 ? tFE : tFF, (r === 2 ? tFE : tFF) + 1.2);
    const bad = r % 11 === 0;
    if (fx) return {t: bad ? 'Unassigned' : CATN[r % 5], f: `=IFNA(VLOOKUP(E${r},$K$2:$L$6,2,0),"Unassigned")`, bg: g1 > 0.02 ? `rgba(168,85,247,${0.4 * g1})` : bad ? 'rgba(168,85,247,0.16)' : bg, ovf: true};
    return bad ? {...ER('#N/A'), bg} : {t: CATN[r % 5], f: `=VLOOKUP(E${r},$K$2:$L$6,2,0)`, bg};
  };
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  let fb = '';
  if (t >= T5.down1 && t < T5.home) { sel = one(50001, 0); }
  if (t >= tD0 - 0.4) { sel = one(2, 3); fb = '=C2/B2-1'; }
  if (t >= tD0 && t < tDE) { edit = {r: 2, c: 3, text: wrapTyped(t, tD0 + 0.2, tDE - 0.3, 'IFERROR(', 'C2/B2-1', ',0)'), caret: true}; mode = 'Edit'; name = 'D2'; }
  if (t >= tDF) sel = rng(2, 3, 50001, 3, 2, 3);
  if (t >= tDF + 1.0) { sel = one(2, 5); fb = '=VLOOKUP(E2,$K$2:$L$6,2,0)'; }
  if (t >= tF0 && t < tFE) { edit = {r: 2, c: 5, text: wrapTyped(t, tF0 + 0.2, tFE - 0.3, 'IFNA(', 'VLOOKUP(E2,$K$2:$L$6,2,0)', ',"Unassigned")'), caret: true}; mode = 'Edit'; name = 'F2'; }
  if (t >= tFF) sel = rng(2, 5, 50001, 5, 2, 5);
  if (t >= T5.down2) { sel = one(50001, 5); fb = '=IFNA(VLOOKUP(E50001,$K$2:$L$6,2,0),"Unassigned")'; }
  if (t >= T5.down2 + 8) { sel = one(1, 0); fb = ''; }
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 3.6);
    const rawD = 1 - pe(t, tDF, tDF + 0.5), rawF = 1 - pe(t, tFF, tFF + 0.5);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(rawD * pe(t, A(4, 0) + 0.4, A(4, 0) + 1.2), <div style={{position: 'absolute', inset: 0}}><Box r={g.cell(3, 3)} c={COL.red} w={2.5} glow={pulse} pad={1}/><Box r={g.cell(10, 3)} c={COL.red} w={2.5} glow={pulse} pad={1}/><Box r={g.cell(2, 8)} c={COL.red} w={2.5} glow={pulse} pad={1}/></div>)}
        {wrap(rawF * pe(t, A(4, 0) + 0.8, A(4, 0) + 1.6), <Box r={g.cell(11, 5)} c={COL.red} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, tI, tI + 0.6) * (1 - pe(t, tI + 3, tI + 4)), <Box r={g.cell(2, 8)} c={COL.green} w={3} glow={0.9} pad={1}/>)}
        <Seal x={940} y={150} s={130} p={pe(t, A(4, 2) + 4.5, A(4, 2) + 5.9) * (1 - pe(t, A(4, 2) + 12, A(4, 2) + 13))}/>
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const d2 = ctr(g, 2, 3), hd = hp(g, 2, 3), f2 = ctr(g, 2, 5), hf = hp(g, 2, 5);
    const ks: K[] = [[0, 700, 200], [tD0 - 1.2, 700, 200], [tD0 - 0.4, d2.x, d2.y], [tDF - 0.7, d2.x, d2.y], [tDF - 0.2, hd.x, hd.y, 'cross'], [tDF + 0.4, hd.x, hd.y, 'cross'], [tDF + 0.9, f2.x, f2.y, 'arrow'], [tFF - 0.7, f2.x, f2.y], [tFF - 0.2, hf.x, hf.y, 'cross'], [tFF + 0.4, hf.x, hf.y, 'cross'], [tFF + 1.0, 700, 200, 'arrow'], [END(4), 700, 200]];
    return path(t, ks);
  };
  const v: View = {top, freeze: true, hw: hwFor(top + 14), cell, sel, edit, fb, name, mode, ov, cursor, sheet: 0, sheets: ['Sales_2026', 'Summary'], file: 'manzooma_sales_2026.xlsx', vs: {pos: (top / 50001) * 0.85, size: 0.0004}};
  return {v, zoom: 1, zx: 0, zy: 0};
};
