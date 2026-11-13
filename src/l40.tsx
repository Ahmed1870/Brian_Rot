// Lesson 40 helpers: sheet data, typing/selection state machine, formula-tip, neon overlays.
import React from 'react';
import {CELLFONT, UIFONT} from './theme';
import {CAM_SHEET, Rect, RangeFx, cellRect, center, rangeRect, typeIn} from './l7';
import {CAM0, CellV, Cam, Cursor, ExcelApp, ExcelWindow, KeyBadge, Ripple, camLerp, clamp, colLetter, prog, track} from './kit';
export {CAM_SHEET, CAM0, RangeFx, cellRect, rangeRect, center, typeIn, camLerp, prog, clamp};
export type {Rect, Cam};

/* ------------------------------------------------------------------ data */
export type Row = [string, string, string, string, number];
export const TB: Row[] = [
  ['P-101', 'Laptop Pro', 'Ahmed Hassan', 'Cairo', 18500],
  ['P-103', 'Keyboard', 'Sara Ali', 'Giza', 1200],
  ['P-105', 'Tablet', 'Omar Khaled', 'Alexandria', 11400],
  ['P-101', 'Laptop Pro', 'Mona Adel', 'Cairo', 8900],
  ['P-104', 'Mouse', 'Youssef Samir', 'Tanta', 450],
  ['P-102', 'Monitor 27"', 'Laila Nabil', 'Cairo', 12800],
  ['P-102', 'Monitor 27"', 'Karim Fathy', 'Giza', 7800],
  ['P-106', 'Headset', 'Nour Hany', 'Alexandria', 3100],
  ['P-103', 'Keyboard', 'Hadeer Salah', 'Cairo', 1350],
  ['P-101', 'Laptop Pro', 'Mostafa Reda', 'Tanta', 9600],
  ['P-104', 'Mouse', 'Ahmed Hassan', 'Cairo', 520],
  ['P-106', 'Headset', 'Sara Ali', 'Alexandria', 2950],
];
export const NEWROW: Row = ['P-103', 'Keyboard', 'Omar Khaled', 'Cairo', 1900];
export const UNIQ = ['P-101', 'P-103', 'P-105', 'P-104', 'P-102', 'P-106'];
export const NAME_OF = (id: string) => TB.find((r) => r[0] === id)![1];
export const DET: Record<string, string> = {'P-101': 'Laptop Pro 16GB', 'P-102': 'Monitor 27" 4K', 'P-103': 'Keyboard Mech', 'P-104': 'Mouse Wireless', 'P-105': 'Tablet 10" 256GB', 'P-106': 'Headset Pro'};
export const fmtN = (n: number) => n.toLocaleString('en-US');
export const NF = 'غير مسجل';

export const cw40 = (c: number) => [0, 80, 16, 16, 150, 110, 100, 24, 90, 130, 110, 100, 90, 90][c] ?? 64;
export const G40 = {colW: cw40};
export const L = {A: 1, D: 4, E: 5, F: 6, H: 8, I: 9, J: 10, K: 11, L: 12, M: 13};

export type Cells = Map<string, CellV>;
export const mk = (): Cells => new Map();
export const put = (m: Cells, r: number, c: number, v: CellV | undefined) => { if (v) m.set(`${r}:${c}`, v); };
export const fn = (m: Cells) => (r: number, c: number) => m.get(`${r}:${c}`);
const HDR: Partial<CellV> = {b: true, bg: '#4472C4', color: '#FFFFFF'};
const BAND = '#D9E1F2';
export const num = (n: number | string, extra: Partial<CellV> = {}): CellV => ({t: typeof n === 'number' ? fmtN(n) : n, num: 1, al: 'r', ...extra});
export const putTable = (m: Cells, rows: Row[]) => {
  ['Product ID', 'Product Name', 'Customer', 'Branch', 'Amount'].forEach((h, i) => put(m, 1, 8 + i, {t: h, ...HDR, al: i === 4 ? 'r' : 'l'}));
  rows.forEach((r, i) => r.forEach((v, j) => put(m, 2 + i, 8 + j, j === 4 ? num(v as number, i % 2 === 0 ? {bg: BAND} : {}) : {t: String(v), bg: i % 2 === 0 ? BAND : undefined})));
};

/* ------------------------------------------------------------------ edit state machine (scene-relative frames) */
export type Ev = {r: number; c: number; text: string; start: number; dur: number; enter: number; r2?: number; c2?: number};
export type Pick = {at: number; r: number; c: number; r2?: number; c2?: number; click?: boolean; move?: {x: number; y: number}};
export const typingNow = (f: number, evs: Ev[]) => evs.find((e) => f >= e.start && f < e.enter) ?? null;
export const picksOf = (evs: Ev[], extra: Pick[]): Pick[] => [...evs.flatMap((e) => [{at: e.start - 12, r: e.r, c: e.c, click: true} as Pick, {at: e.enter, r: e.r + 1, c: e.c} as Pick]), ...extra].sort((a, b) => a.at - b.at);
export const selNow = (f: number, picks: Pick[]) => { let s: Pick = {at: 0, r: 1, c: 1}; picks.forEach((p) => { if (f >= p.at) s = p; }); return s; };
export const fbText = (f: number, evs: Ev[], s: Pick) => {
  const ty = typingNow(f, evs);
  if (ty) return typeIn(ty.text, f, ty.start, ty.dur);
  let out = '';
  evs.filter((e) => f >= e.enter).forEach((e) => { if (s.r >= e.r && s.r <= (e.r2 ?? e.r) && s.c >= e.c && s.c <= (e.c2 ?? e.c)) out = e.text; });
  return out;
};
export const pathOf = (picks: Pick[], g: {colW: (c: number) => number; rowW?: number}, from: {x: number; y: number}) => {
  const pts = [{f: 0, x: from.x, y: from.y}];
  const clicks: number[] = [];
  picks.filter((p) => p.click || p.move).forEach((p) => {
    const tg = p.move ?? center(cellRect(p.r, p.c, g));
    const last = pts[pts.length - 1];
    if (p.at - 24 > last.f) pts.push({f: p.at - 24, x: last.x, y: last.y});
    pts.push({f: Math.max(p.at, pts[pts.length - 1].f + 1), x: tg.x, y: tg.y});
    if (p.click) clicks.push(p.at);
  });
  return {pts, clicks};
};

/* ------------------------------------------------------------------ formula tooltip + in-cell editor */
const SIG: Record<string, string[]> = {
  XLOOKUP: ['lookup_value', 'lookup_array', 'return_array', '[if_not_found]', '[match_mode]', '[search_mode]'],
  FILTER: ['array', 'include', '[if_empty]'], SORT: ['array', '[sort_index]', '[sort_order]', '[by_col]'],
  UNIQUE: ['array', '[by_col]', '[exactly_once]'], TAKE: ['array', 'rows', '[columns]'],
};
export const tipOf = (s: string) => {
  if (!s.startsWith('=')) return null;
  const st: Array<{n: string; i: number}> = [];
  let q = false, br = 0;
  for (let k = 0; k < s.length; k++) {
    const ch = s[k];
    if (ch === '"') { q = !q; continue; }
    if (q) continue;
    if (ch === '[') br++; else if (ch === ']') br = Math.max(0, br - 1);
    else if (br === 0) {
      if (ch === '(') { const m = s.slice(0, k).match(/[A-Z.]+$/); st.push({n: m ? m[0] : '', i: 0}); }
      else if (ch === ',' && st.length) st[st.length - 1].i++;
      else if (ch === ')') st.pop();
    }
  }
  const top = st[st.length - 1];
  return top && SIG[top.n] ? {name: top.n, args: SIG[top.n], i: Math.min(top.i, SIG[top.n].length - 1)} : null;
};
export const FnTip: React.FC<{x: number; y: number; text: string}> = ({x, y, text}) => {
  const tip = tipOf(text);
  if (!tip) return null;
  const w = (tip.name.length + tip.args.join(', ').length + 4) * 6.6 + 16;
  const left = Math.min(x, 1176 - w);
  return (
    <div style={{position: 'absolute', left, top: y + 22, zIndex: 40, background: '#fff', border: '1px solid #9A9A9A', boxShadow: '0 3px 8px rgba(0,0,0,.25)', padding: '2px 8px', fontFamily: UIFONT, fontSize: 12.5, color: '#333', whiteSpace: 'nowrap'}}>
      {tip.name}(
      {tip.args.map((a, k) => <span key={k}>{k ? ', ' : ''}<span style={{fontWeight: k === tip.i ? 700 : 400, color: k === tip.i ? '#000' : '#555'}}>{a}</span></span>)}
      )
    </div>
  );
};
export const CellEdit: React.FC<{rect: Rect; text: string; blink: boolean}> = ({rect, text, blink}) => (
  <div style={{position: 'absolute', left: rect.x, top: rect.y, width: Math.max(rect.w, text.length * 7.35 + 12), height: rect.h, zIndex: 30, background: '#fff', border: '2px solid #107C41', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 3px', fontFamily: CELLFONT, fontSize: 14.67, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden'}}>
    <span>{text}</span>{blink ? <span style={{width: 1, height: 15, background: '#000', marginLeft: 1}} /> : null}
  </div>
);

/* ------------------------------------------------------------------ the simulation shell */
export type KeyFx = {at: number; keys: string[]; dur?: number};
export type SimProps = {
  f: number; cell: (r: number, c: number) => CellV | undefined; evs: Ev[]; picks: Pick[]; geom?: {colW: (c: number) => number; rowW?: number};
  cam: Cam; from?: {x: number; y: number}; keys?: KeyFx[]; selOverride?: Pick | null; scroll?: {r: number; c: number}; thumb?: number; thumbSize?: number;
  sheets?: string[]; sheet?: string; colW?: (c: number) => number; file?: string; tab?: string; hideCursor?: boolean; children?: React.ReactNode;
};
export const Sim: React.FC<SimProps> = ({f, cell, evs, picks, geom = G40, cam, from = {x: 700, y: 520}, keys = [], selOverride, scroll, thumb = 0, thumbSize = 0.5, sheets, sheet, file = 'manzooma_sales_2026.xlsx', tab = 'Home', hideCursor, children}) => {
  const s = selOverride ?? selNow(f, picks);
  const ty = typingNow(f, evs);
  const act = ty ? {r: ty.r, c: ty.c} : {r: s.r, c: s.c};
  const rng = ty ? {r1: ty.r, c1: ty.c, r2: ty.r, c2: ty.c} : {r1: s.r, c1: s.c, r2: s.r2 ?? s.r, c2: s.c2 ?? s.c};
  const bar = fbText(f, evs, s);
  const nameBox = rng.r1 === rng.r2 && rng.c1 === rng.c2 ? `${colLetter(rng.c1)}${rng.r1}` : `${colLetter(rng.c1)}${rng.r1}:${colLetter(rng.c2)}${rng.r2}`;
  const {pts, clicks} = pathOf(picks, geom, from);
  const cur = track(f, pts);
  const typed = ty ? typeIn(ty.text, f, ty.start, ty.dur) : '';
  const blink = Math.floor(f / 14) % 2 === 0;
  const kf: KeyFx[] = [...evs.map((e) => ({at: e.enter, keys: ['Enter'], dur: 30})), ...keys];
  return (
    <div style={{display: 'contents'}}>
    <ExcelWindow cam={cam}>
      <ExcelApp file={file} tab={tab} nameBox={nameBox} formula={bar} fbEdit={!!ty} colW={geom.colW} cell={cell} sel={rng} active={act} scroll={scroll} sheets={sheets ?? ['Sales']} sheet={sheet ?? 'Sales'} thumb={thumb} thumbSize={thumbSize}>
        {children}
        {ty ? <><CellEdit rect={cellRect(ty.r, ty.c, geom)} text={typed} blink={blink} /><FnTip x={cellRect(ty.r, ty.c, geom).x} y={cellRect(ty.r, ty.c, geom).y} text={typed} /></> : null}
        {clicks.map((c) => { const cp = track(c, pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={c} />; })}
        {hideCursor ? null : <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= c && f < c + 4)} />}
      </ExcelApp>
    </ExcelWindow>
    {kf.map((k, i) => { const p = prog(f, k.at, 8) * (1 - prog(f, k.at + (k.dur ?? 40), 8)); return p > 0.01 ? <KeyBadge key={i} keys={k.keys} p={p} /> : null; })}
    </div>
  );
};

/** number of items revealed one-by-one after `start` (frames), `step` frames apart */
export const rev = (f: number, start: number, n: number, step = 5) => (f < start ? 0 : Math.min(n, Math.floor((f - start) / step) + 1));
