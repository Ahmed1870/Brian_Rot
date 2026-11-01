import React from 'react';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {hash, hash2} from '../lib/anim';

// The "real" file behind the dashboard: an enormous, messy spreadsheet.
// Built once (static) so camera moves only transform it. Bars/fills are merged into a handful of <path>s for fast rasterising.
export const SHEET_X0 = -2600;
export const SHEET_Y0 = 152;
const W = 7800;
const H = 4600;
const LETTERS_H = 48;
export const ROW_H = 52;
export const ROW1_Y = SHEET_Y0 + LETTERS_H; // y of row 1 in world space

const colName = (i: number): string => {
  let s = '';
  let n = i;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
};

const widths: number[] = [];
const xs: number[] = [];
(() => {
  let x = 0;
  let c = 0;
  while (x < W) {
    const w = 150 + Math.floor(hash(c * 3.7) * 170);
    widths.push(w);
    xs.push(x);
    x += w;
    c++;
  }
})();

const NUM = ['0', '1', '3', '12', '450', '1,250', '98.5', '-', '0.00', '7', '2026'];
const TXT = ['NULL', 'N/A', '???', 'FINAL', 'copy', 'old', 'check!', 'TBD', 'x', 'v2', '(1)'];
const AR = ['تم', 'نسخة', 'مكرر', 'راجع', 'قديم', 'جديد', 'لا', 'مؤجل', '؟؟', 'ملغي'];
const DATE = ['2026-01-04', '2025-12-30', '03/11/26', '2026-02-18', '1/7', '2026-09-02'];
const ERR = ['#REF!', '#N/A', '#VALUE!', '#DIV/0!', '#NAME?'];

type Cell = {x: number; y: number; w: number; text: string; color: string; ar: boolean};

const BARS_A: string[] = [];
const BARS_B: string[] = [];
const FILL_Y: string[] = [];
const FILL_R: string[] = [];
const FILL_G: string[] = [];
const TRI: string[] = [];
const CELLS: Cell[] = [];

(() => {
  const rows = Math.floor((H - LETTERS_H) / ROW_H);
  for (let r = 1; r < rows; r++) {
    const y = LETTERS_H + r * ROW_H;
    for (let c = 0; c < widths.length; c++) {
      const x = xs[c];
      const w = widths[c];
      const k = hash2(r, c);
      if (k < 0.5) {
        const bw = (0.35 + hash2(r + 7, c) * 0.5) * (w - 30);
        (hash2(r, c + 5) > 0.5 ? BARS_A : BARS_B).push(`M${x + 16} ${y + 26}h${bw.toFixed(0)}`);
      } else if (k < 0.62) {
        const type = Math.floor(hash(c * 1.3) * 4);
        let text = '';
        let ar = false;
        if (type === 0) text = NUM[Math.floor(hash2(r, c + 11) * NUM.length)];
        else if (type === 1) text = TXT[Math.floor(hash2(r, c + 12) * TXT.length)];
        else if (type === 2) {
          text = AR[Math.floor(hash2(r, c + 13) * AR.length)];
          ar = true;
        } else text = DATE[Math.floor(hash2(r, c + 14) * DATE.length)];
        CELLS.push({x: x + 14, y: y + 34, w, text, color: '#94A3B8', ar});
      } else if (k < 0.66) {
        FILL_Y.push(`M${x + 2} ${y + 2}h${w - 4}v${ROW_H - 4}h${-(w - 4)}z`);
        CELLS.push({x: x + 14, y: y + 34, w, text: NUM[Math.floor(hash2(r, c + 21) * NUM.length)], color: '#FDE68A', ar: false});
      } else if (k < 0.685) {
        FILL_R.push(`M${x + 2} ${y + 2}h${w - 4}v${ROW_H - 4}h${-(w - 4)}z`);
        CELLS.push({x: x + 14, y: y + 34, w, text: ERR[Math.floor(hash2(r, c + 31) * ERR.length)], color: '#FCA5A5', ar: false});
      } else if (k < 0.705) {
        FILL_G.push(`M${x + 2} ${y + 2}h${w - 4}v${ROW_H - 4}h${-(w - 4)}z`);
      }
      if (hash2(r + 3, c + 9) > 0.985) TRI.push(`M${x + w - 14} ${y + 1}l13 0l0 13z`);
    }
  }
})();

export const ChaosSheet: React.FC = React.memo(() => {
  const rowsN = Math.floor((H - LETTERS_H) / ROW_H);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <pattern id="rowlines" width="40" height={ROW_H} patternUnits="userSpaceOnUse" y={LETTERS_H}>
          <line x1="0" y1={ROW_H - 0.5} x2="40" y2={ROW_H - 0.5} stroke="#334155" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="#0C1426" />
      <rect y={LETTERS_H} width={W} height={H - LETTERS_H} fill="url(#rowlines)" />
      <path d={FILL_Y.join('')} fill="rgba(251,191,36,0.22)" />
      <path d={FILL_R.join('')} fill="rgba(239,68,68,0.26)" />
      <path d={FILL_G.join('')} fill="rgba(52,211,153,0.2)" />
      <path d={BARS_A.join('')} stroke="#475569" strokeWidth="10" strokeLinecap="round" opacity="0.55" fill="none" transform={`translate(0 ${LETTERS_H})`} />
      <path d={BARS_B.join('')} stroke="#64748B" strokeWidth="10" strokeLinecap="round" opacity="0.35" fill="none" transform={`translate(0 ${LETTERS_H})`} />
      <path d={xs.map((x) => `M${x} 0V${H}`).join('')} stroke="#334155" strokeWidth="1.5" fill="none" />
      <path d={TRI.join('')} fill="#EF4444" transform={`translate(0 ${LETTERS_H})`} />
      {/* column letters */}
      <rect width={W} height={LETTERS_H} fill="#111B31" />
      {xs.map((x, c) => (
        <text key={c} x={x + widths[c] / 2} y={32} textAnchor="middle" fontFamily={FONT_MONO} fontSize="22" fill="#64748B">
          {colName(c)}
        </text>
      ))}
      {CELLS.map((cell, i) => (
        <text key={i} x={cell.ar ? cell.x + cell.w - 30 : cell.x} y={cell.y + LETTERS_H} textAnchor={cell.ar ? 'end' : 'start'} fontFamily={cell.ar ? FONT_AR : FONT_MONO} fontSize="20" fill={cell.color} opacity="0.9" style={{direction: cell.ar ? 'rtl' : 'ltr'}}>
          {cell.text}
        </text>
      ))}
      <text x={-14} y={LETTERS_H + 36} textAnchor="end" fontFamily={FONT_MONO} fontSize="20" fill={C.mute}>
        {rowsN}
      </text>
    </svg>
  );
});
