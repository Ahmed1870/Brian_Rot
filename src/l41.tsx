// Lesson 41 data + shared bits (SUMIFS / COUNTIFS / AVERAGEIFS over spilled criteria).
import React from 'react';
import {C, MONO} from './theme';
import {sale} from './data';
import {Cells, put, num, fmtN} from './l40';
import {prog} from './kit';

export type R41 = [string, string, string, number]; // order id, branch, category, amount
export const T41: R41[] = [
  ['ORD-101', 'Cairo', 'Electronics', 18500], ['ORD-102', 'Giza', 'Accessories', 1200], ['ORD-103', 'Alexandria', 'Office', 3400], ['ORD-104', 'Cairo', 'Accessories', 850],
  ['ORD-105', 'Tanta', 'Electronics', 9600], ['ORD-106', 'Cairo', 'Office', 2300], ['ORD-107', 'Giza', 'Electronics', 12800], ['ORD-108', 'Alexandria', 'Accessories', 640],
  ['ORD-109', 'Cairo', 'Electronics', 7200], ['ORD-110', 'Tanta', 'Office', 1900], ['ORD-111', 'Giza', 'Accessories', 980], ['ORD-112', 'Alexandria', 'Electronics', 15400],
  ['ORD-113', 'Cairo', 'Accessories', 1350], ['ORD-114', 'Tanta', 'Accessories', 520], ['ORD-115', 'Giza', 'Office', 2750], ['ORD-116', 'Alexandria', 'Office', 1800],
];
export const NEW41: R41 = ['ORD-117', 'Aswan', 'Electronics', 8800];
export const cw41 = (c: number) => [0, 100, 100, 100, 100, 24, 100, 24, 80, 100, 100, 90][c] ?? 64;
export const G41 = {colW: cw41};
export const uniqSorted = (rows: R41[], k: 1 | 2) => Array.from(new Set(rows.map((r) => r[k]))).sort();
export const sumOf = (rows: R41[], b: string, c: string) => rows.filter((r) => r[1] === b && r[2] === c).reduce((s, r) => s + r[3], 0);
export const cntOf = (rows: R41[], b: string, c: string) => rows.filter((r) => r[1] === b && r[2] === c).length;
export const sumB = (rows: R41[], b: string) => rows.filter((r) => r[1] === b).reduce((s, r) => s + r[3], 0);
export const avgB = (rows: R41[], b: string) => { const x = rows.filter((r) => r[1] === b); return Math.round(x.reduce((s, r) => s + r[3], 0) / x.length); };
export const HDR41 = {b: true, bg: '#4472C4', color: '#FFFFFF'} as const;
export const lblHdr = {b: true, bg: '#DDEBF7'} as const;
export const putT41 = (m: Cells, rows: R41[]) => {
  ['Order ID', 'Branch', 'Category', 'Amount'].forEach((h, i) => put(m, 1, 8 + i, {t: h, ...HDR41, al: i === 3 ? 'r' : 'l'}));
  rows.forEach((r, i) => r.forEach((v, j) => { const bg = i % 2 === 0 ? '#D9E1F2' : undefined; put(m, 2 + i, 8 + j, j === 3 ? num(v as number, {bg}) : {t: String(v), bg}); }));
};

/* 50,000-row aggregates (exact, from the same generator that draws the sheet) */
export const BIGN = 50000;
const bs = new Map<string, number>();
const bsC = new Map<string, number>();
for (let n = 1; n <= BIGN; n++) { const s = sale(n); const k = `${s.branch}|${s.category}`; bs.set(k, (bs.get(k) ?? 0) + s.total); bsC.set(k, (bsC.get(k) ?? 0) + 1); }
export const BIG_BR = Array.from(new Set(Array.from({length: 200}, (_, i) => sale(i + 1).branch))).sort();
export const BIG_CAT = Array.from(new Set(Array.from({length: 200}, (_, i) => sale(i + 1).category))).sort();
export const bigSum = (b: string, c: string) => bs.get(`${b}|${c}`) ?? 0;
export const bigCnt = (b: string, c: string) => bsC.get(`${b}|${c}`) ?? 0;

/** red struck-through legacy cards (manual drag / $ anchors) */
export const Legacy: React.FC<{items: string[]; p: number; strike: number; left?: number; top?: number}> = ({items, p, strike, left = 560, top = 300}) => (
  <div style={{position: 'absolute', left, top, width: 800, display: 'flex', gap: 36, justifyContent: 'center', opacity: p, transform: `scale(${0.92 + 0.08 * p})`}} dir="ltr">
    {items.map((n, i) => (
      <div key={n} style={{position: 'relative', padding: '16px 28px', borderRadius: 18, background: C.card, border: `2px solid ${C.red}`, boxShadow: `0 0 30px ${C.red}55`, fontFamily: MONO, fontSize: 32, fontWeight: 700, color: C.text}}>
        {n}
        <div style={{position: 'absolute', left: 8, top: '50%', height: 5, width: `${Math.max(0, strike * 100 - 2)}%`, background: C.red, borderRadius: 3, transform: `rotate(${i % 2 ? 2 : -2}deg)`}} />
      </div>
    ))}
  </div>
);
export const SealBox: React.FC<{p: number; title: string; sub: string}> = ({p, title, sub}) => (
  <div style={{position: 'absolute', left: 1330, top: 560, width: 420, padding: '10px 0 14px', borderRadius: 24, background: 'rgba(11,18,34,0.92)', border: `2px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}66`, textAlign: 'center', opacity: p, transform: `scale(${0.7 + 0.3 * p})`}}>
    <svg width={150} height={150} viewBox="0 0 230 230">
      <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
      <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
      <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -4}}>{title}</div>
    <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>{sub}</div>
  </div>
);
export const chipPos = (show: number, hide: number, f: number): number => prog(f, show, 10) * (1 - prog(f, hide, 10));
export {fmtN};
