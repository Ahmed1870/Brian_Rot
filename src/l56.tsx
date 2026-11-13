// Lesson 56 shared bits: model data (derived from the lesson generator), column audit grid, size bars, memory gauge.
import React from 'react';
import {C, MONO, UIFONT} from './theme';
import {clamp, CellV} from './kit';
import {sale} from './data';
import {CATS} from './lp';

const PRODS = Array.from(new Set(Array.from({length: 400}, (_, i) => sale(i + 1).product)));
const PCAT: Record<string, string> = {}; const PPRICE: Record<string, number> = {};
for (let i = 1; i <= 400; i++) { const s = sale(i); PCAT[s.product] = s.category; PPRICE[s.product] = s.price; }
export const MISS = 'Keyboard';
export const MISS_KEY = 101 + PRODS.indexOf(MISS);
export const prodRows = PRODS.map((p, i) => ({key: 101 + i, name: p, cat: PCAT[p], price: PPRICE[p]}));
export const MISS_ROW = prodRows.find((r) => r.name === MISS)!;
export const OK_ROWS = prodRows.filter((r) => r.name !== MISS);
export const MISS_CAT = MISS_ROW.cat;

export const REGION: Record<string, string> = {Cairo: 'Greater Cairo', Giza: 'Greater Cairo', Alexandria: 'Coastal', Mansoura: 'Delta', Tanta: 'Delta'};
export const REGIONS = ['Coastal', 'Delta', 'Greater Cairo'];
const CS: Record<string, number> = {}, RC: Record<string, number> = {};
let missSum = 0, total = 0;
for (let n = 1; n <= 50000; n++) {
  const s = sale(n); total += s.total;
  if (s.product === MISS) missSum += s.total; else CS[s.category] = (CS[s.category] ?? 0) + s.total;
  const k = `${REGION[s.branch]}|${s.category}`; RC[k] = (RC[k] ?? 0) + s.total;
}
export const BLANK_SUM = missSum, GRAND = total;
export const catSum = (cat: string, fixed: boolean) => (CS[cat] ?? 0) + (fixed && cat === MISS_CAT ? missSum : 0);
export const regCat = (r: string, c: string) => RC[`${r}|${c}`] ?? 0;
export const fmt = (n: number) => n.toLocaleString('en-US');
export {CATS};

/* ---------------------------------------------------------------- audit grid (Power Pivot data view, custom columns) */
const T: React.CSSProperties = {fontFamily: UIFONT, fontSize: 12.5, color: '#1B1B1B', whiteSpace: 'nowrap'};
export type GCol = {k: string; w: number; hl?: string; hlP?: number; sub?: string; vis?: number; cell: (i: number) => string; num?: boolean};
export const stamp = (i: number) => { const d = 1 + ((i * 7) % 28), h = (i * 5) % 24, m = (i * 13) % 60, s = (i * 29) % 60; const p = (x: number) => String(x).padStart(2, '0'); return `2026-03-${p(d)} ${p(h)}:${p(m)}:${p(s)}`; };
export const guid = (i: number) => { const h = (n: number) => ((i * 2654435761 + n * 40503) >>> 0).toString(16).padStart(8, '0'); return `${h(1)}-${h(2).slice(0, 4)}-${h(3).slice(0, 4)}`; };
/** Draws the grid; columns with vis<=0 are skipped, 0<vis<1 squeeze (width scales) */
export const AuditGrid: React.FC<{cols: GCol[]; rows?: number; x: number; y: number}> = ({cols, rows = 12, x, y}) => {
  const vis = cols.filter((c) => (c.vis ?? 1) > 0.01);
  const total = vis.reduce((a, c) => a + c.w * clamp(c.vis ?? 1), 0);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: total + 4, background: '#fff', border: '1px solid #C8C8C8', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,.15)'}}>
      <div style={{display: 'flex', height: 40, background: '#F0F0F0', borderBottom: '1px solid #C8C8C8'}}>
        {vis.map((c) => { const w = c.w * clamp(c.vis ?? 1); return (
          <div key={c.k} style={{width: w, overflow: 'hidden', borderRight: '1px solid #C8C8C8', boxSizing: 'border-box', padding: '4px 8px', background: c.hl ? `${c.hl}${Math.round(40 * clamp(c.hlP ?? 1)).toString(16).padStart(2, '0')}` : undefined, boxShadow: c.hl ? `inset 0 0 0 ${2 * clamp(c.hlP ?? 1)}px ${c.hl}` : undefined}}>
            <div style={{...T, fontWeight: 700}}>{c.k}</div><div style={{...T, fontSize: 10.5, color: c.hl ?? '#556'}}>{c.sub ?? ''}</div>
          </div>); })}
      </div>
      {Array.from({length: rows}, (_, i) => (
        <div key={i} style={{display: 'flex', height: 22, borderBottom: '1px solid #EDEDED', background: i % 2 ? '#FAFAFA' : '#fff'}}>
          {vis.map((c) => { const w = c.w * clamp(c.vis ?? 1); return (
            <div key={c.k} style={{...T, width: w, overflow: 'hidden', borderRight: '1px solid #EDEDED', boxSizing: 'border-box', padding: '0 8px', lineHeight: '22px', textAlign: c.num ? 'right' : 'left', background: c.hl ? `${c.hl}${Math.round(18 * clamp(c.hlP ?? 1)).toString(16).padStart(2, '0')}` : undefined}}>{c.cell(i)}</div>); })}
        </div>
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------- size bars (VertiPaq-analyzer style, own drawing) */
export type SBar = {k: string; pct: number; color: string; note?: string};
export const SizePanel: React.FC<{x: number; y: number; w: number; bars: SBar[]; title: string; total: string; totalColor: string}> = ({x, y, w, bars, title, total, totalColor}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, background: '#0F172A', border: `2px solid ${C.blue}`, borderRadius: 10, padding: '10px 14px 12px', boxShadow: `0 0 22px ${C.blue}55`, zIndex: 30}} dir="ltr">
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.text}}><span>{title}</span><span style={{color: totalColor}}>{total}</span></div>
    {bars.map((b) => (
      <div key={b.k} style={{marginTop: 8}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 11.5, color: C.muted}}><span>{b.k}</span><span style={{color: b.color}}>{b.note ?? `${Math.round(b.pct)}%`}</span></div>
        <div style={{height: 10, borderRadius: 5, background: '#1E293B', overflow: 'hidden', marginTop: 2}}><div style={{width: `${clamp(b.pct / 100) * 100}%`, height: '100%', background: b.color, borderRadius: 5, boxShadow: `0 0 8px ${b.color}`}} /></div>
      </div>
    ))}
  </div>
);

/** memory gauge: pct of the bar 0..1, optional cap marker */
export const Gauge: React.FC<{x: number; y: number; w: number; label: string; val: string; pct: number; color: string; cap?: string; p: number; sub?: string}> = ({x, y, w, label, val, pct, color, cap, p, sub}) => (
  p > 0.01 ? (
    <div dir="ltr" style={{position: 'absolute', left: x, top: y, width: w, background: '#0B1222', border: `2px solid ${color}`, borderRadius: 12, padding: '8px 14px 10px', boxShadow: `0 0 20px ${color}66`, opacity: clamp(p), zIndex: 32}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 14, fontWeight: 700}}><span style={{color: C.text}}>{label}</span><span style={{color}}>{val}</span></div>
      <div style={{position: 'relative', height: 16, borderRadius: 8, background: '#1E293B', marginTop: 6}}>
        <div style={{width: `${clamp(pct) * 100}%`, height: '100%', borderRadius: 8, background: color, boxShadow: `0 0 10px ${color}`}} />
        {cap ? <div style={{position: 'absolute', right: 0, top: -4, width: 3, height: 24, background: C.amber}} /> : null}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 11.5, color: C.muted, marginTop: 4}}><span>{sub ?? ''}</span><span style={{color: C.amber}}>{cap ?? ''}</span></div>
    </div>
  ) : null
);

/** finished Region x Category pivot (rows 3..8, cols 1..7) */
export const pivotFull = (r: number, c: number): CellV | undefined => {
  const rowSum = (g: string) => CATS.reduce((a, k) => a + regCat(g, k), 0);
  if (r === 3) return c === 1 ? {t: 'Sum of Amount', b: true} : c === 2 ? {t: 'Column Labels', b: true} : undefined;
  if (r === 4) return c === 1 ? {t: 'Row Labels', b: true, bg: '#DDEBF7'} : c <= 6 ? {t: CATS[c - 2], b: true, bg: '#DDEBF7', al: 'r'} : c === 7 ? {t: 'Grand Total', b: true, bg: '#DDEBF7', al: 'r'} : undefined;
  const i = r - 5;
  if (i >= 0 && i < REGIONS.length) { const g = REGIONS[i]; return c === 1 ? {t: g} : c <= 6 && c >= 2 ? {t: fmt(regCat(g, CATS[c - 2])), num: 1, al: 'r'} : c === 7 ? {t: fmt(rowSum(g)), num: 1, al: 'r', b: true} : undefined; }
  if (i === REGIONS.length) return c === 1 ? {t: 'Grand Total', b: true, bg: '#F2F2F2'} : c <= 6 && c >= 2 ? {t: fmt(REGIONS.reduce((a, g) => a + regCat(g, CATS[c - 2]), 0)), num: 1, al: 'r', b: true, bg: '#F2F2F2'} : c === 7 ? {t: fmt(REGIONS.reduce((a, g) => a + rowSum(g), 0)), num: 1, al: 'r', b: true, bg: '#F2F2F2'} : undefined;
  return undefined;
};
