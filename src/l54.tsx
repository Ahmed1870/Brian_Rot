// Lesson 54 shared bits: Excel fact sheet, teaching tags, drag chip, relationship state builder.
import React from 'react';
import {C, MONO} from './theme';
import {CellV, clamp, prog, track, dwell} from './kit';
import {factRow, REL, RelId, RelState} from './lp';
import {Wp} from './lq';

export const colW54 = (c: number) => [0, 70, 90, 90, 90, 90, 100, 90, 90, 40][c] ?? 64;
const H = ['SaleID', 'ProductKey', 'CustomerKey', 'StoreKey', 'DateKey', 'ShipDateKey', 'Quantity', 'Amount'];
export const factCell = (r: number, c: number): CellV | undefined => {
  if (c < 1 || c > 8) return undefined;
  if (r === 1) return {t: H[c - 1], b: true, bg: '#4472C4', color: '#FFFFFF', al: c === 8 ? 'r' : 'l'};
  if (r > 22) return undefined;
  const v = factRow(r - 1)[c - 1];
  const bg = r % 2 === 0 ? '#D9E1F2' : undefined;
  return c === 1 || c > 5 ? {t: v, num: 1, al: 'r', bg} : {t: v, bg};
};

/** small teaching pill drawn in window coordinates */
export const Tag: React.FC<{x: number; y: number; text: string; color: string; p: number; dark?: boolean; w?: number}> = ({x, y, text, color, p, dark, w}) => (
  p > 0.01 ? (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translateY(${(1 - clamp(p)) * 8}px) scale(${0.85 + 0.15 * clamp(p)})`, transformOrigin: '0 50%', opacity: clamp(p), zIndex: 30, background: dark ? '#0B1222' : color, color: dark ? color : '#0B1222', border: `2px solid ${color}`, borderRadius: 999, padding: '3px 12px', fontFamily: MONO, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: `0 0 14px ${color}88`, textAlign: 'center'}}>{text}</div>
  ) : null
);
export const DragChip: React.FC<{x: number; y: number; text: string; p: number}> = ({x, y, text, p}) => (
  p > 0.01 ? <div style={{position: 'absolute', left: x + 14, top: y + 10, zIndex: 60, background: '#fff', border: `2px solid ${C.green}`, borderRadius: 4, padding: '2px 10px', fontFamily: 'Segoe UI, Open Sans, sans-serif', fontSize: 12.5, boxShadow: '0 4px 12px rgba(0,0,0,.35)', opacity: p}}>{text}</div> : null
);
/** pointer position (same path rules as Pointer) */
export const ptrAt = (f: number, pts: Wp[]) => track(f, dwell(pts, 8));

/** relationship state from its drop frame and the time it is shown */
export const relSt = (f: number, drop: number, o: {one?: number; many?: number; arrow?: number; dashed?: boolean; color?: string; label?: string; labelColor?: string} = {}): RelState => ({
  p: f < drop ? 0 : prog(f, drop, 22), one: o.one !== undefined ? prog(f, o.one, 8) : undefined, many: o.many !== undefined ? prog(f, o.many, 8) : undefined, arrow: o.arrow !== undefined ? prog(f, o.arrow, 8) : undefined,
  dashed: o.dashed, color: o.color, label: o.label, labelColor: o.labelColor,
});
export type {RelId};
export {REL};
