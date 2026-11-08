import React from 'react';
import {COL, XL} from './theme';
import {Ants, Arrow, Band, Box, Cell, Geo, Lock, Sel, Seal, View, colName, pe, pg, typed} from './kit';
import {CATS, IN, INC, K, MAT_SUM, PRICE, RATE, SUM_COMM_50K, TIER, band, comm, ctr, fmtN, hdrC, hp, hwFor, mv, one, path, reg, rng, rr, sales} from './data';

type Out = {v: View; zoom: number; zx: number; zy: number};
const wrap = (o: number, kids: React.ReactNode) => <div style={{position: 'absolute', inset: 0, opacity: o}}>{kids}</div>;

// ======================= SCENE 3: mixed references =======================
export const T3 = {
  g1: [12.5, 14.0], g2: [23.3, 24.4, 25.4], g3: [31.8, 33.3, 34.8, 36.3], showOn: 15.6, showOff: 38.5, ctrlTick: [14.4, 15.4],
};
export const s3 = (t: number): Out => {
  const LV = [100, 200, 300], RV = [10, 20, 30];
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let name: string | undefined;
  let mode: string | undefined;
  let ants: {r1: number; c1: number; r2: number; c2: number} | null = null;
  if (t >= 9.9) sel = one(3, 0);
  if (t >= 10.5 && t < 15.2) {
    const txt = t < 12.5 ? typed('=A1', t, 10.7, 11.4) : t < 14.0 ? '=$A$1' : '=A$1';
    edit = {r: 3, c: 0, text: txt, caret: true}; name = 'A3'; mode = 'Enter';
  }
  if (t >= 15.2) sel = one(4, 0);
  if (t >= 15.9) sel = one(3, 0);
  if (t >= 16.4 && t < 19.4) ants = {r1: 3, c1: 0, r2: 3, c2: 0};
  if (t >= 16.8) sel = {...one(3, 1), c2: 1 + Math.round(pe(t, 16.8, 17.3)), ar: 3, ac: 1};
  if (t >= 18.2) sel = rng(4, 0, 4 + Math.round(pe(t, 18.2, 18.7) * 1), 2, 4, 0);
  if (t >= 19.4) sel = rng(4, 0, 5, 2, 4, 0);
  if (t >= 21.0) sel = one(2, 9);
  if (t >= 21.5 && t < 26.3) {
    const txt = t < 23.3 ? typed('=H2', t, 21.7, 22.4) : t < 24.4 ? '=$H$2' : t < 25.4 ? '=H$2' : '=$H2';
    edit = {r: 2, c: 9, text: txt, caret: true}; name = 'J2'; mode = 'Enter';
  }
  if (t >= 26.3) sel = one(3, 9);
  if (t >= 26.8) sel = one(2, 9);
  if (t >= 26.9 && t < 29.0) ants = {r1: 2, c1: 9, r2: 2, c2: 9};
  if (t >= 27.3) sel = rng(2, 10, 2, 11, 2, 10);
  if (t >= 28.4) sel = rng(3, 9, 4, 11, 3, 9);
  if (t >= 29.6) sel = one(7, 5);
  if (t >= 29.9 && t < 37.8) {
    const k = T3.g3.filter((x) => t >= x).length;
    const txt = k === 0 ? typed('=A1', t, 29.9, 30.5) : ['=$A$1', '=A$1', '=$A1', '=A1'][k - 1];
    edit = {r: 7, c: 5, text: txt, caret: true}; name = 'F7'; mode = 'Enter';
  }
  if (t >= 37.8) sel = one(1, 0);
  const showF = t >= T3.showOn && t < T3.showOff;
  const left = (r: number, c: number): Cell | undefined => {
    if (r === 1 && c < 3) return {t: String(LV[c]), bg: IN, col: INC, b: true};
    const on = (r === 3 && c === 0 && t >= 15.2) || (r === 3 && (c === 1 || c === 2) && t >= 17.6) || (r >= 4 && r <= 5 && c <= 2 && t >= 18.9);
    if (r >= 3 && r <= 5 && c <= 2 && on) return {t: String(LV[c]), f: `=${colName(c)}$1`};
    return undefined;
  };
  const right = (r: number, c: number): Cell | undefined => {
    if (c === 7 && r >= 2 && r <= 4) return {t: String(RV[r - 2]), bg: IN, col: INC, b: true};
    const on = (r === 2 && c === 9 && t >= 26.3) || (r === 2 && (c === 10 || c === 11) && t >= 27.9) || (r >= 3 && r <= 4 && c >= 9 && c <= 11 && t >= 28.9);
    if (r >= 2 && r <= 4 && c >= 9 && c <= 11 && on) return {t: String(RV[r - 2]), f: `=$H${r}`};
    return undefined;
  };
  const ov = (g: Geo) => {
    const fa = pe(t, 0.8, 1.6) * (0.6 + 0.25 * Math.sin(t * 2.4));
    const conA = pe(t, 19.5, 20.4) * (1 - pe(t, 38.3, 39));
    const rcA = pe(t, 29.1, 30.0) * (1 - pe(t, 38.3, 39));
    const r1 = rr(g, 1, 0), r5 = rr(g, 5, 0);
    const arrows: React.ReactNode[] = [];
    for (let c = 0; c < 3; c++) {
      const x = g.cx(c) + XL.colW - 6;
      arrows.push(<Arrow key={`l${c}`} x1={x} y1={r5.y + 17} x2={x} y2={r1.y + 24} c={COL.blue} w={2.5} p={pe(t, 19.5 + c * 0.25, 20.4 + c * 0.25)}/>);
    }
    for (let r = 2; r <= 4; r++) {
      const y = rr(g, r, 9).y + 19;
      arrows.push(<Arrow key={`r${r}`} x1={g.cx(12) - 4} y1={y} x2={g.cx(8) + 3} y2={y} c={COL.purple} w={2.5} p={pe(t, 29.1 + (r - 2) * 0.25, 30.0 + (r - 2) * 0.25)}/>);
    }
    const m2 = rr(g, 2, 12), m5 = rr(g, 5, 12), a6 = rr(g, 6, 0);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(fa, <div style={{position: 'absolute', inset: 0}}><Box r={g.rect(1, 0, 6, 3)} c={COL.blue} w={2} glow={0.9} dash/><Box r={g.rect(1, 7, 6, 12)} c={COL.purple} w={2} glow={0.9} dash/></div>)}
        {t >= 1 ? <Box r={g.rect(1, 0, 1, 2)} c={COL.blue} w={2} glow={0.5}/> : null}
        {t >= 1 ? <Box r={g.rect(2, 7, 4, 7)} c={COL.purple} w={2} glow={0.5}/> : null}
        {wrap(conA, <div style={{position: 'absolute', inset: 0}}>{arrows.slice(0, 3)}<Arrow x1={g.cx(0) + 8} y1={a6.y + 10} x2={g.cx(3) + 46} y2={a6.y + 10} c={COL.blue} w={3}/></div>)}
        {wrap(rcA, <div style={{position: 'absolute', inset: 0}}>{arrows.slice(3)}<Arrow x1={m2.x + 32} y1={m2.y + 4} x2={m5.x + 32} y2={m5.y + 14} c={COL.purple} w={3}/></div>)}
        {ants ? <Ants r={g.rect(ants.r1, ants.c1, ants.r2, ants.c2)}/> : null}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 11, 14), a3 = ctr(g, 3, 0), b3 = ctr(g, 3, 1), c3 = ctr(g, 3, 2), a4 = ctr(g, 4, 0), c5 = ctr(g, 5, 2), j2 = ctr(g, 2, 9), k2 = ctr(g, 2, 10), l2 = ctr(g, 2, 11), j3 = ctr(g, 3, 9), l4 = ctr(g, 4, 11), f7 = ctr(g, 7, 5);
    const ks: K[] = [
      [0, rest.x, rest.y], [9.0, rest.x, rest.y], [9.7, a3.x, a3.y], [16.7, a3.x, a3.y], [16.8, b3.x, b3.y], [17.3, c3.x, c3.y], [18.1, a4.x, a4.y], [18.7, c5.x, c5.y], [20.5, c5.x, c5.y],
      [20.9, j2.x, j2.y], [27.0, j2.x, j2.y], [27.3, k2.x, k2.y], [27.6, l2.x, l2.y], [28.3, j3.x, j3.y], [28.8, l4.x, l4.y], [29.5, f7.x, f7.y], [37.8, f7.x, f7.y], [39.2, rest.x, rest.y],
    ];
    return path(t, ks);
  };
  const v: View = {top: 2, freeze: false, showF, cell: (r, c) => left(r, c) ?? right(r, c), sel, edit, name, mode, ov, cursor, sheet: 1, file: 'Cell_References_Practice'};
  v.top = 1;
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ======================= SCENE 4: matrix =======================
export const s4 = (t: number): Out => {
  const trOf = (r: number, c: number) => (r === 5 ? (c === 2 ? 17.8 : 29.6 + ((c - 2) / 9) * 1.6) : 33.0 + (r - 6 + (c - 2)) * 0.07);
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let fb = '';
  let name: string | undefined;
  let mode: string | undefined;
  let stats: View['stats'];
  if (t >= 7.9) sel = one(5, 2);
  if (t >= 12.5 && t < 17.8) { edit = {r: 5, c: 2, text: typed('=$B5*C$4', t, 12.5, 17.0), caret: true}; name = 'C5'; mode = 'Enter'; }
  if (t >= 17.8) sel = one(6, 2);
  if (t >= 28.8) { sel = one(5, 2); fb = '=$B5*C$4'; }
  if (t >= 29.6) { sel = rng(5, 2, 5, 2 + Math.round(pe(t, 29.6, 31.2) * 9), 5, 2); fb = ''; }
  if (t >= 31.6) sel = rng(5, 2, 5 + Math.round(pe(t, 31.6, 33.0) * 4), 11, 5, 2);
  if (t >= 33.0) sel = rng(5, 2, 9, 11, 5, 2);
  if (t >= 35.8) stats = {avg: fmtN(MAT_SUM / 50), cnt: '50', sum: fmtN(MAT_SUM)};
  if (t >= 37.8) { sel = one(9, 11); fb = '=$B9*L$4'; stats = undefined; }
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 2 && c === 0) return {t: 'Discount Matrix (EGP)', b: true, ovf: true, al: 'l'};
    if (r === 3) return c === 0 ? hdrC('Tier') : c === 1 ? hdrC('Discount') : c >= 2 && c <= 11 ? hdrC(CATS[c - 2]) : undefined;
    if (r === 4) return c === 0 ? {t: 'Price', b: true} : c >= 2 && c <= 11 ? {t: String(PRICE[c - 2]), bg: IN, col: INC, b: true} : undefined;
    if (r >= 5 && r <= 9) {
      if (c === 0) return {t: TIER[r - 5]};
      if (c === 1) return {t: `${RATE[r - 5]}%`, bg: IN, col: INC, b: true};
      if (c >= 2 && c <= 11) {
        const tr = trOf(r, c);
        if (t < tr) return undefined;
        const g1 = 1 - pg(t, tr, tr + 1.2);
        const bg = g1 > 0.02 ? `rgba(16,185,129,${0.55 * g1})` : t >= 34.8 ? '#D1FAE5' : undefined;
        return {t: String(mv(r, c)), f: `=$B${r}*${colName(c)}$4`, bg};
      }
    }
    return undefined;
  };
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 3);
    const intro = pe(t, 3.0, 3.8) * (1 - pe(t, 17.5, 18.2));
    const pc = pe(t, 19.5, 20.5), pr = pe(t, 23.5, 24.5);
    const b59 = g.rect(5, 1, 9, 1), r4 = g.rect(4, 2, 4, 11), b10 = rr(g, 10, 1), m4 = rr(g, 4, 12);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(intro, <div style={{position: 'absolute', inset: 0}}><Box r={b59} c={COL.purple} w={2} glow={pulse}/><Box r={r4} c={COL.blue} w={2} glow={pulse}/></div>)}
        {pc > 0 && t < 29 ? <Box r={b59} c={COL.purple} w={2} glow={0.4} fill="rgba(168,85,247,0.12)"/> : null}
        {pr > 0 && t < 29 ? <Box r={r4} c={COL.blue} w={2} glow={0.4} fill="rgba(56,189,248,0.12)"/> : null}
        {pc > 0 && t < 29 ? <Lock x={b10.x + b10.w / 2} y={b10.y + 10} closed={pc} c={COL.purple}/> : null}
        {pr > 0 && t < 29 ? <Lock x={m4.x + m4.w / 2} y={m4.y + 10} closed={pr} c={COL.blue}/> : null}
        {t >= 17.8 && t < 29 ? <Box r={g.cell(5, 2)} c={COL.amber} w={3} glow={pulse} pad={1}/> : null}
        {wrap(pe(t, 33.4, 34.6) * (1 - pe(t, 38.5, 39.5)), <Box r={g.rect(5, 2, 9, 11)} c={COL.green} w={3} glow={0.9}/>)}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 12, 6), c5 = ctr(g, 5, 2), h52 = hp(g, 5, 2), h511 = hp(g, 5, 11), h911 = hp(g, 9, 11), l9 = ctr(g, 9, 11);
    const ks: K[] = [
      [0, rest.x, rest.y], [7.0, rest.x, rest.y], [7.8, c5.x, c5.y], [28.2, c5.x, c5.y], [29.2, c5.x, c5.y], [29.55, h52.x, h52.y, 'cross'], [29.6, h52.x, h52.y, 'cross'], [31.2, h511.x, h511.y, 'cross'],
      [31.6, h511.x, h511.y, 'cross'], [33.0, h911.x, h911.y, 'cross'], [34.6, ctr(g, 9, 10).x, ctr(g, 9, 10).y, 'arrow'], [37.6, l9.x, l9.y], [39.2, rest.x, rest.y],
    ];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, cell, sel, edit, fb, name, mode, stats, ov, cursor, sheet: 2, file: 'Cell_References_Practice'};
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ======================= SCENE 5: 50,000 rows =======================
export const T5 = {ctrlDown1: 4.0, home: 8.5, ctrlDown2: 19.6, ctrlShiftUp: 23.0};
export const s5 = (t: number): Out => {
  const top = t < 4.0 ? 2 : t < 8.5 ? 49987 : t < 19.6 ? 2 : t < 31.0 ? 49987 : t < 36 ? 24990 : 2;
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let fb = '';
  let name: string | undefined;
  let mode: string | undefined;
  let stats: View['stats'];
  if (t >= 4.0 && t < 8.5) { sel = one(50001, 0); }
  if (t >= 11.0 && t < 19.6) { sel = one(2, 3); }
  if (t >= 12.0 && t < 16.5) { edit = {r: 2, c: 3, text: typed('=C2*$K$2', t, 12.0, 15.6), caret: true}; name = 'D2'; mode = 'Enter'; }
  if (t >= 16.5) sel = one(3, 3);
  if (t >= 17.5 && t < 19.6) { sel = one(2, 3); fb = '=C2*$K$2'; }
  if (t >= 18.6 && t < 19.6) sel = rng(2, 3, 50001, 3, 2, 3);
  if (t >= 19.6) { sel = one(50001, 3); fb = '=C50001*$K$2'; }
  if (t >= 23.0) { sel = rng(2, 3, 50001, 3, 2, 3); fb = ''; name = 'D2:D50001'; stats = {avg: fmtN(SUM_COMM_50K / 50000), cnt: '50,000', sum: fmtN(SUM_COMM_50K)}; }
  if (t >= 31.0) { sel = one(25000, 3); fb = '=C25000*$K$2'; name = undefined; stats = undefined; }
  if (t >= 36.0) { sel = one(1, 0); fb = ''; }
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 1) return c < 4 ? hdrC(['Order', 'Region', 'Sales', 'Comm.'][c]) : undefined;
    if (r === 2 && c === 9) return {t: 'Commission Rate', al: 'r', ovf: true, b: true};
    if (r === 2 && c === 10) return {t: '4%', bg: IN, col: INC, b: true};
    if (r < 2 || r > 50001 || c > 3) return undefined;
    const bg = band(r);
    if (c === 0) return {t: String(10000 + r), bg};
    if (c === 1) return {t: reg(r), bg};
    if (c === 2) return {t: String(sales(r)), bg};
    if (r === 2 && t >= 16.5) return {t: '500', f: '=C2*$K$2', bg};
    if (r >= 3 && t >= 18.6) {
      const g1 = 1 - pg(t, 18.6, 19.8);
      return {t: String(comm(r)), f: `=C${r}*$K$2`, bg: g1 > 0.02 ? `rgba(16,185,129,${0.4 * g1})` : bg};
    }
    return {t: '', bg};
  };
  const ov = (g: Geo) => {
    const k2 = g.cell(2, 10), l2 = rr(g, 2, 11);
    const green = t >= 14.0;
    const lk = pe(t, 14.0, 15.0);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {t >= 12.0 && k2 ? <Box r={k2} c={green ? COL.green : COL.amber} w={3} glow={green ? 0.9 : 0.5 + 0.3 * Math.sin(t * 3)} pad={1}/> : null}
        {t >= 14.0 && k2 ? <Lock x={l2.x + 22} y={l2.y + 10} closed={lk} c={COL.green}/> : null}
        <Seal x={970} y={150} s={130} p={pe(t, 27.0, 28.4)}/>
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const d2 = ctr(g, 2, 3), h2 = hp(g, 2, 3);
    const ks: K[] = [
      [0, 700, 200], [10.4, 700, 200], [10.9, d2.x, d2.y], [17.3, d2.x, d2.y], [18.4, h2.x, h2.y, 'cross'], [19.0, h2.x, h2.y, 'cross'], [19.9, 263, 310, 'arrow'], [22.9, 263, 310],
      [23.2, 263, 100], [30.9, 263, 100], [31.4, 263, 230], [35.9, 263, 230], [37.0, 700, 200],
    ];
    return path(t, ks);
  };
  const v: View = {top, freeze: true, hw: hwFor(top + 14), cell, sel, edit, fb, name, mode, stats, ov, cursor, sheet: 0, sheets: ['Sales_2026', 'Summary'], file: 'manzooma_sales_2026.xlsx', vs: {pos: top / 50001 * 0.85, size: 0.0004}};
  return {v, zoom: 1, zx: 0, zy: 0};
};
