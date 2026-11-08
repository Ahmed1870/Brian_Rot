import React from 'react';
import {COL} from './theme';
import {Arrow, Band, Box, Cell, Geo, Lock, Sel, View, pe, pg, typed} from './kit';
import {IN, INC, K, SUM_TAX_1001, band, ctr, fmtN, hdrC, hp, hwFor, one, path, prod, reg, rng, rr, sales, tax} from './data';

export const salesCell = (r: number, c: number, max: number, d: (r: number, bg: string | undefined) => Cell | undefined): Cell | undefined => {
  if (r === 1) {
    if (c < 4) return hdrC(['Product', 'Region', 'Sales', 'Tax'][c]);
    if (c === 6) return {t: 'Tax Rate', al: 'r', ovf: true, b: true};
    if (c === 7) return {t: '14%', bg: IN, col: INC, b: true};
    return undefined;
  }
  if (r > max) return undefined;
  const bg = band(r);
  if (c === 0) return {t: prod(r), bg};
  if (c === 1) return {t: reg(r), bg};
  if (c === 2) return {t: String(sales(r)), bg};
  if (c === 3) return d(r, bg) ?? {t: '', bg};
  return undefined;
};
const wrap = (o: number, kids: React.ReactNode) => <div style={{position: 'absolute', inset: 0, opacity: o}}>{kids}</div>;

// ======================= SCENE 1: relative reference shift =======================
export const s1 = (t: number): {v: View; zoom: number; zx: number; zy: number} => {
  let sel: Sel = one(1, 0);
  let fb = '';
  let name: string | undefined;
  let mode: string | undefined;
  let edit: View['edit'];
  if (t >= 10.8) { sel = one(1, 7); fb = '14%'; }
  if (t >= 14.7) { sel = one(2, 3); fb = ''; }
  if (t >= 15.9 && t < 18.8) { edit = {r: 2, c: 3, text: typed('=C2*H1', t, 15.9, 18.4), caret: true}; name = 'D2'; }
  if (t >= 18.8) { sel = one(3, 3); fb = ''; }
  if (t >= 19.6) { sel = one(2, 3); fb = '=C2*H1'; }
  if (t >= 20.0 && t < 21.7) sel = rng(2, 3, 2 + Math.round(pe(t, 20.1, 21.6) * 7), 3, 2, 3);
  if (t >= 21.7) sel = rng(2, 3, 9, 3, 2, 3);
  if (t >= 22.5) { sel = one(3, 3); fb = '=C3*H2'; }
  if (t >= 22.9 && t < 26.3) { edit = {r: 3, c: 3, text: '=C3*H2', caret: true}; mode = 'Edit'; name = 'D3'; }
  if (t >= 26.3) { sel = one(4, 3); fb = '=C4*H3'; }
  if (t >= 26.7 && t < 33.5) { edit = {r: 4, c: 3, text: '=C4*H3', caret: true}; mode = 'Edit'; name = 'D4'; }
  if (t >= 33.5) { sel = one(2, 3); fb = '=C2*H1'; }
  const d = (r: number, bg: string | undefined): Cell | undefined => {
    if (r === 2 && t >= 18.8) return {t: '1750', f: '=C2*H1', bg};
    if (r >= 3 && r <= 9 && t >= 21.7) return {t: '0', f: `=C${r}*H${r - 1}`, bg, tri: t >= 27.3};
    return undefined;
  };
  const redA = pe(t, 22.9, 23.6) * (1 - pe(t, 35.5, 37));
  const p1 = pe(t, 22.9, 24.3), p2 = pe(t, 26.7, 28.0);
  const ov = (g: Geo) => {
    const h1 = rr(g, 1, 7), h2 = rr(g, 2, 7), h3 = rr(g, 3, 7);
    const amber = pe(t, 1.0, 1.6) * (0.55 + 0.3 * Math.sin(t * 3.2)) * (1 - 0.5 * pe(t, 35.5, 37));
    const ax = g.cx(8) + 32, y1 = h1.y + 10, len = 20 * (p1 + p2);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        <Box r={h1} c={COL.amber} w={3} glow={amber} pad={1}/>
        {wrap(redA, (
          <div style={{position: 'absolute', inset: 0}}>
            {wrap(p1, <Box r={h2} c={COL.red} w={2} glow={0.8} dash/>)}
            {wrap(p2, <Box r={h3} c={COL.red} w={2} glow={0.8} dash/>)}
            {len > 0 ? <Arrow x1={ax} y1={y1} x2={ax} y2={y1 + len} c={COL.red} w={3.5}/> : null}
            {p1 > 0 ? <Band r={{x: g.cx(8), y: y1 - 1, w: 32, h: 2}} c={COL.red} op={0.9}/> : null}
            {p1 > 0.95 ? <Band r={{x: g.cx(8), y: y1 + 19, w: 32, h: 2}} c={COL.red} op={0.9}/> : null}
            {p2 > 0.5 ? <Band r={{x: g.cx(8), y: y1 + 39, w: 32, h: 2}} c={COL.red} op={0.9}/> : null}
            {wrap(pe(t, 27.3, 28.0), <Box r={g.rect(3, 3, 9, 3)} c={COL.red} w={2} glow={0.6}/>)}
          </div>
        ))}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 12, 13), h1c = ctr(g, 1, 7), d2 = ctr(g, 2, 3), d3 = ctr(g, 3, 3), d4 = ctr(g, 4, 3), h2p = hp(g, 2, 3), h9p = hp(g, 9, 3);
    const ks: K[] = [
      [0, rest.x, rest.y], [8.5, rest.x, rest.y], [10.4, h1c.x, h1c.y], [12.0, h1c.x, h1c.y], [14.3, d2.x, d2.y], [19.9, d2.x, d2.y],
      [20.0, h2p.x, h2p.y, 'cross'], [20.1, h2p.x, h2p.y, 'cross'], [21.6, h9p.x, h9p.y, 'cross'], [22.4, d3.x, d3.y, 'arrow'], [26.0, d3.x, d3.y],
      [26.25, d4.x, d4.y], [33.4, d4.x, d4.y], [33.9, d2.x, d2.y], [37.0, d2.x, d2.y], [38.0, rest.x, rest.y],
    ];
    return path(t, ks);
  };
  const v: View = {top: 2, freeze: true, cell: (r, c) => salesCell(r, c, 9, d), sel, edit, fb, name, mode, ov, cursor, sheet: 0, file: 'Cell_References_Practice'};
  return {v, zoom: 1 + 0.18 * pe(t, 37.4, 39.8), zx: 330, zy: 160};
};

// ======================= SCENE 2: absolute reference + F4 =======================
export const T2 = {f4: 12.2, enter: 20.4};
export const s2 = (t: number): {v: View; zoom: number; zx: number; zy: number} => {
  const top = 2 + Math.round(pe(t, 30, 32.5) * 990);
  let sel: Sel = one(2, 3);
  let fb = '=C2*H1';
  let name: string | undefined;
  let mode: string | undefined;
  let edit: View['edit'];
  let stats: View['stats'];
  if (t >= 4.0 && t < T2.enter) { edit = {r: 2, c: 3, text: t >= T2.f4 ? '=C2*$H$1' : '=C2*H1', caret: true}; mode = 'Edit'; name = 'D2'; }
  if (t >= T2.enter) { sel = one(3, 3); fb = ''; }
  if (t >= 22.0) { sel = one(2, 3); fb = '=C2*$H$1'; }
  if (t >= 24.2) sel = rng(2, 3, 2 + Math.round(pe(t, 24.5, 26.0) * 7), 3, 2, 3);
  if (t >= 26.3) sel = rng(2, 3, 9, 3, 2, 3);
  if (t >= 26.8) { sel = one(3, 3); fb = '=C3*$H$1'; }
  if (t >= 26.9 && t < 28.1) { edit = {r: 3, c: 3, text: '=C3*$H$1', caret: true}; mode = 'Edit'; name = 'D3'; }
  if (t >= 28.1) { sel = one(4, 3); fb = '=C4*$H$1'; }
  if (t >= 28.2 && t < 29.2) { edit = {r: 4, c: 3, text: '=C4*$H$1', caret: true}; mode = 'Edit'; name = 'D4'; }
  if (t >= 29.3) { sel = one(2, 3); fb = '=C2*$H$1'; }
  if (t >= 32.9) { sel = one(1001, 3); fb = '=C1001*$H$1'; }
  if (t >= 36.0) {
    sel = rng(2, 3, 1001, 3, 2, 3); fb = ''; name = 'D2:D1001';
    stats = {avg: fmtN(SUM_TAX_1001 / 1000), cnt: '1,000', sum: fmtN(SUM_TAX_1001)};
  }
  const d = (r: number, bg: string | undefined): Cell | undefined => {
    if (r === 2) return {t: '1750', f: t >= T2.enter ? '=C2*$H$1' : '=C2*H1', bg};
    if (r <= 9) {
      const tr = 24.2 + ((r - 2) / 7) * 1.8;
      if (t < tr) return {t: '0', f: `=C${r}*H${r - 1}`, bg, tri: true};
      const g1 = 1 - pg(t, tr, tr + 1.2);
      return {t: String(tax(r)), f: `=C${r}*$H$1`, bg: g1 > 0.02 ? `rgba(16,185,129,${0.4 * g1})` : bg};
    }
    if (r <= 1001 && t >= 29.6) {
      const g1 = 1 - pg(t, 29.6, 31.4);
      return {t: String(tax(r)), f: `=C${r}*$H$1`, bg: g1 > 0.02 ? `rgba(16,185,129,${0.4 * g1})` : bg};
    }
    return undefined;
  };
  const colA = pe(t, 13.8, 14.8), rowA = pe(t, 16.0, 17.0);
  const ov = (g: Geo) => {
    const h1 = rr(g, 1, 7);
    const colR = g.rect(top, 7, top + 14, 7), row1 = g.rect(1, 0, 1, 17);
    const green = t >= T2.f4;
    const pulse = 0.55 + 0.3 * Math.sin(t * 3.2);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {colA > 0 ? <Box r={colR} c={COL.green} w={1.5} fill={`rgba(16,185,129,${0.1 * colA})`}/> : null}
        {rowA > 0 ? <Box r={row1} c={COL.green} w={1.5} fill={`rgba(16,185,129,${0.1 * rowA})`}/> : null}
        <Box r={h1} c={green ? COL.green : COL.amber} w={3} glow={green ? 0.9 : pulse} pad={1}/>
        {colA > 0 && colR ? <Lock x={colR.x + colR.w / 2} y={colR.y + colR.h - 14} closed={colA} c={COL.green}/> : null}
        {rowA > 0 && row1 ? <Lock x={g.cx(17) + 34} y={row1.y + 10} closed={rowA} c={COL.green}/> : null}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 12, 13), d2 = ctr(g, 2, 3), d3 = ctr(g, 3, 3), d4 = ctr(g, 4, 3), h2p = hp(g, 2, 3), h9p = hp(g, 9, 3);
    const ks: K[] = [
      [0, rest.x, rest.y], [3.1, rest.x, rest.y], [3.8, d2.x, d2.y], [4.6, d2.x, d2.y], [5.8, 232, -32], [12.0, 232, -32], [20.2, 232, -32], [21.6, d2.x, d2.y],
      [24.0, d2.x, d2.y], [24.2, h2p.x, h2p.y, 'cross'], [24.5, h2p.x, h2p.y, 'cross'], [26.0, h9p.x, h9p.y, 'cross'], [26.6, d3.x, d3.y, 'arrow'], [28.0, d3.x, d3.y],
      [28.1, d4.x, d4.y], [29.1, d4.x, d4.y], [29.3, d2.x, d2.y], [29.55, h2p.x, h2p.y, 'cross'], [29.9, 1239, 4, 'arrow'], [30.0, 1239, 4], [32.5, 1239, 250], [32.9, 257, 210],
      [36.0, 257, 210], [37.2, 640, 150],
    ];
    return path(t, ks);
  };
  const v: View = {top, freeze: true, hw: hwFor(top + 14), cell: (r, c) => salesCell(r, c, 1001, d), sel, edit, fb, name, mode, stats, ov, cursor, sheet: 0, file: 'Cell_References_Practice', vs: {pos: (top - 2) / 1000 * 0.85, size: 0.06}};
  return {v, zoom: 1 + 0.18 * (1 - pe(t, 1.5, 3.5)), zx: 330, zy: 160};
};
