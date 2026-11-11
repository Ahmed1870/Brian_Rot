// Lesson 46 shared scene bits: Excel host window with the raw sheet, ETL pipeline art, manual-workflow cards.
import React from 'react';
import {C, MONO} from './theme';
import {Cam, CAM0, CellV, ExcelApp, ExcelWindow, Mix, clamp, prog} from './kit';
import {RAW_ROWS} from './lq';

export const colW46 = (c: number) => [0, 100, 100, 100, 100, 100, 30, 120, 120, 120, 100][c] ?? 64;
const HDR = {b: true, bg: '#4472C4', color: '#FFFFFF'} as const;
export const rawCell = (r: number, c: number): CellV | undefined => {
  const rows = RAW_ROWS();
  const row = rows[r - 1];
  if (!row || c < 1 || c > 5) return undefined;
  const v = row[c - 1];
  if (r === 1) return {t: String(v), ...HDR};
  if (v === null) return undefined;
  const bg = r % 2 === 0 ? '#D9E1F2' : undefined;
  return c === 5 ? {t: v, num: 1, al: 'r', bg} : {t: v, bg};
};

export type HostProps = {cam?: Cam; tab?: string; cell?: (r: number, c: number) => CellV | undefined; sheets?: string[]; sheet?: string; nameBox?: string; formula?: string; colW?: (c: number) => number; tabHot?: string; ribbonHot?: string; glow?: string; sel?: {r: number; c: number}; children?: React.ReactNode};
export const Host: React.FC<HostProps> = ({cam = CAM0, tab = 'Home', cell = rawCell, sheets = ['Sales_Raw'], sheet = 'Sales_Raw', nameBox = 'A1', formula = '', colW = colW46, tabHot, ribbonHot, glow, sel = {r: 1, c: 1}, children}) => (
  <ExcelWindow cam={cam} glow={glow}>
    <ExcelApp file="manzooma_sales_2026.xlsx" tab={tab} tabHot={tabHot} ribbonHot={ribbonHot} nameBox={nameBox} formula={formula} colW={colW} cell={cell} sel={{r1: sel.r, c1: sel.c, r2: sel.r, c2: sel.c}} active={sel} sheets={sheets} sheet={sheet}>
      {children}
    </ExcelApp>
  </ExcelWindow>
);

/* ------------------------------------------------------------------ screen-level panels */
export const PANEL = {x: 100, y: 170, w: 1720, h: 730};
export const Panel: React.FC<{p: number; color?: string; children?: React.ReactNode}> = ({p, color = C.blue, children}) => (
  <div style={{position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 28, background: 'rgba(11,18,34,0.94)', border: `2px solid ${color}`, boxShadow: `0 40px 120px rgba(2,6,23,.75), 0 0 40px ${color}33`, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, overflow: 'hidden'}}>{children}</div>
);

const NODES = [
  {x: 40, w: 280, k: 'Source', a: 'manzooma_sales_2026.xlsx', b: 'Raw source file', c: '#94A3B8'},
  {x: 390, w: 240, k: 'Extract', a: 'Extract', b: 'Pull raw data', c: C.blue},
  {x: 740, w: 240, k: 'Transform', a: 'Transform', b: 'Clean · types · steps', c: C.blue},
  {x: 1090, w: 240, k: 'Load', a: 'Load', b: 'Close & Load To...', c: C.blue},
  {x: 1400, w: 280, k: 'Out', a: 'Table / Data Model', b: 'Report-ready data', c: C.green},
];
/** ETL pipeline drawn in panel coordinates. `at` = reveal frames for [source, extract, transform, load, out]; `flow` = frame the stream starts. */
export const EtlPipe: React.FC<{f: number; at: number[]; flow: number; y?: number; hot?: number}> = ({f, at, flow, y = 300, hot = -1}) => {
  const pulse = 0.65 + 0.35 * Math.sin(f * 0.14);
  return (
    <div style={{display: 'contents'}} dir="ltr">
      {NODES.map((n, i) => {
        const p = prog(f, at[i], 14);
        const on = hot === i;
        return (
          <div key={n.k} style={{position: 'absolute', left: n.x, top: y, width: n.w, height: 150, borderRadius: 20, background: C.card, border: `3px solid ${n.c}`, opacity: p, transform: `scale(${0.88 + 0.12 * p})`, boxShadow: `0 0 ${(on ? 40 : 16) * pulse}px ${n.c}88`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: n.k === 'Source' ? 18 : n.k === 'Out' ? 28 : 38, fontWeight: 700, color: n.c === '#94A3B8' ? C.text : n.c}}>{n.a}</div>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>{n.b}</div>
          </div>
        );
      })}
      <svg width={PANEL.w} height={PANEL.h} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {NODES.slice(0, -1).map((n, i) => {
          const x1 = n.x + n.w + 6, x2 = NODES[i + 1].x - 8, cy = y + 75;
          const p = prog(f, at[i + 1], 14);
          const dots = f >= flow ? [0, 1, 2].map((k) => ((f - flow) * 0.018 + k / 3) % 1) : [];
          return (
            <g key={i} opacity={p}>
              <line x1={x1} y1={cy} x2={x2} y2={cy} stroke={C.blue} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-f * 1.2} />
              <path d={`M${x2 - 14} ${cy - 10} L${x2} ${cy} L${x2 - 14} ${cy + 10}`} fill="none" stroke={C.blue} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
              {dots.map((d, k) => <circle key={k} cx={x1 + (x2 - x1) * d} cy={cy} r={8} fill={C.blue} style={{filter: `drop-shadow(0 0 8px ${C.blue})`}} />)}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const ManualCards: React.FC<{p: number; strike: number; y?: number}> = ({p, strike, y = 70}) => (
  <div dir="ltr" style={{position: 'absolute', left: 40, top: y, width: 1640, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, opacity: p}}>
    {['Copy', 'Paste', 'Fix errors'].map((n, i) => (
      <div key={n} style={{display: 'flex', alignItems: 'center', gap: 40}}>
        <div style={{position: 'relative', padding: '18px 34px', borderRadius: 18, background: C.card, border: `2px solid ${C.red}`, boxShadow: `0 0 28px ${C.red}55`, fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.text}}>
          {n}
          {i === 2 ? <span style={{marginLeft: 14, color: C.red, fontSize: 26}}>#REF! #N/A</span> : null}
          <div style={{position: 'absolute', left: 8, top: '50%', height: 5, width: `${Math.max(0, strike * 100 - 2)}%`, background: C.red, borderRadius: 3, transform: `rotate(${i % 2 ? 2 : -2}deg)`}} />
        </div>
        {i < 2 ? <span style={{fontFamily: MONO, fontSize: 40, color: C.red}}>──►</span> : null}
      </div>
    ))}
  </div>
);
export {Mix, clamp};
