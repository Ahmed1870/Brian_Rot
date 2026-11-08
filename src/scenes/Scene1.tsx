import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CUSTOMERS, customerCell} from '../data';
import {
  CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, colHeaderCenter, geo, prog, sec,
} from '../kit';

// SC01: VLOOKUP Syntax Deconstruction + Vertical Scan Engine.
// Anchors (s): 1.0 lesson intro | 2.5 lookup_value | 3.5 table_array | 4.5 col_index_num | 5.5 range_lookup
//              6.0 vertical scan | 12.0 horizontal shift | 14.0 result extraction | 18.0 syntax caption
const S = START.s1;
const t = (g: number) => sec(g - S);

// Custom column widths for the customers table.
const custColW = (c: number) => [0, 120, 200, 300][c] ?? XL.colW;

// The 4 VLOOKUP argument blocks.
const ARGS = [
  {label: 'lookup_value',   value: 'A2',            color: C.amber},
  {label: 'table_array',    value: 'tbl_Customers', color: C.blue},
  {label: 'col_index_num',  value: '3',             color: C.purple},
  {label: 'range_lookup',   value: 'FALSE',         color: C.green},
];

const FormulaBlocks: React.FC<{lit: number[]}> = ({lit}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, opacity: clamp(prog(f, t(1.5), 14))}}>
      <span style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.text}}>=VLOOKUP(</span>
      {ARGS.map((a, i) => {
        const p = lit[i];
        return (
          <React.Fragment key={i}>
            {i > 0 ? <span style={{fontFamily: MONO, fontSize: 30, color: C.muted}}>,</span> : null}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              opacity: 0.35 + 0.65 * p,
              transform: `scale(${0.92 + 0.08 * p})`,
              transition: 'none',
            }}>
              <div style={{
                minWidth: 180, padding: '8px 18px', borderRadius: 10,
                background: `${a.color}${p > 0.1 ? '22' : '00'}`,
                border: `2px solid ${a.color}`,
                boxShadow: p > 0.1 ? `0 0 ${20 * p}px ${a.color}77, inset 0 0 ${10 * p}px ${a.color}33` : 'none',
                fontFamily: MONO, fontSize: 26, fontWeight: 700, color: p > 0.1 ? C.text : C.muted,
                textAlign: 'center',
              }}>{a.value}</div>
              <div style={{fontFamily: MONO, fontSize: 13, color: a.color, opacity: 0.4 + 0.6 * p, fontWeight: 600}}>{a.label}</div>
            </div>
          </React.Fragment>
        );
      })}
      <span style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.text}}>)</span>
    </div>
  );
};

/** Vertical scan arrow that sweeps down a column then shifts right. */
const ScanArrow: React.FC<{phase: number; sweepY: number; shiftX: number; resultP: number}> = ({phase, sweepY, shiftX, resultP}) => {
  // phase 0: idle, 1: sweeping down, 2: shifting right, 3: result
  if (phase === 0) return null;
  const g = geo(1, 0, 1);
  const colA = colHeaderCenter(1, {colW: custColW});
  const colC = colHeaderCenter(3, {colW: custColW});
  const topY = g.colTop + 4;
  const arrowX = phase >= 2 ? colA.x + (colC.x - colA.x) * shiftX : colA.x;
  const arrowY = phase === 1 ? topY + sweepY : (cellCenter(2, 1, {colW: custColW}).y);

  return (
    <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 25}}>
      {/* vertical scan line */}
      {phase === 1 ? (
        <line x1={colA.x} y1={topY} x2={colA.x} y2={arrowY} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.8}>
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.4s" repeatCount="indefinite" />
        </line>
      ) : null}
      {phase >= 2 ? (
        <line x1={colA.x} y1={cellCenter(2, 1, {colW: custColW}).y} x2={arrowX} y2={cellCenter(2, 1, {colW: custColW}).y} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.9} />
      ) : null}
      {/* arrowhead */}
      <circle cx={arrowX} cy={arrowY} r={6} fill={phase >= 2 ? C.green : C.amber} opacity={0.9} />
      {/* result pulse */}
      {phase >= 3 ? (
        <rect x={colC.x - custColW(3) / 2} y={cellCenter(2, 3, {colW: custColW}).y - XL.rowH / 2} width={custColW(3)} height={XL.rowH} fill="none" stroke={C.green} strokeWidth={3} opacity={resultP} rx={3} />
      ) : null}
    </svg>
  );
};

// helper to compute cell center in Excel logical coords
const cellCenter = (r: number, c: number, o: {colW?: (c: number) => number}) => {
  const cw = o.colW ?? custColW;
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += cw(i);
  return {x: x + cw(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();

  // gentle camera drift toward the table center
  const cam = camLerp(CAM0, {fx: 400, fy: 280, z: 1.15}, prog(f, t(2), 40));

  // formula block light-up sequence
  const lit = [
    prog(f, t(2.5), 12),
    prog(f, t(3.5), 12),
    prog(f, t(4.5), 12),
    prog(f, t(5.5), 12),
  ];

  // scan phases: 0 idle, 1 sweep down (6-12s), 2 shift right (12-14s), 3 result (14+)
  const phase = f < t(6) ? 0 : f < t(12) ? 1 : f < t(14) ? 2 : 3;
  const sweepY = phase === 1 ? clamp((f - t(6)) / sec(6)) * (cellCenter(16, 1, {}).y - geo(1, 0, 1).colTop) : 0;
  const shiftX = phase === 2 ? clamp((f - t(12)) / sec(2)) : 1;
  const resultP = phase >= 3 ? prog(f, t(14), 12) : 0;

  // highlight lookup_value cell A2 and result cell C2
  const a2Neon = prog(f, t(2.5), 12) * (1 - prog(f, t(40), 12));
  const c2Neon = resultP;

  const g = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="tbl_Customers.xlsx" nameBox="A2" formula="=VLOOKUP(A2, tbl_Customers, 3, FALSE)" fbEdit={false}
          cell={(r, c) => customerCell(r, c) as any} colW={custColW}
          sel={{r1: 2, c1: 1, r2: 2, c2: 1}} active={{r: 2, c: 1}} thumb={0} thumbSize={0.55}
        >
          {/* lookup_value highlight on A2 */}
          <Neon x={cellCenter(2, 1, {colW: custColW}).x - custColW(1) / 2} y={cellCenter(2, 1, {colW: custColW}).y - XL.rowH / 2} w={custColW(1)} h={XL.rowH} color={C.amber} p={a2Neon} label="lookup_value" labelBelow />
          {/* result highlight on C2 */}
          <Neon x={cellCenter(2, 3, {colW: custColW}).x - custColW(3) / 2} y={cellCenter(2, 3, {colW: custColW}).y - XL.rowH / 2} w={custColW(3)} h={XL.rowH} color={C.green} p={c2Neon} label="Address (col 3)" labelBelow />
          {/* column A scan strip */}
          <Neon x={cellCenter(1, 1, {colW: custColW}).x - custColW(1) / 2} y={g.colTop} w={custColW(1)} h={g.rowsBottom - g.colTop} color={C.blue} p={prog(f, t(6), 10) * (1 - prog(f, t(14), 8)) * 0.4} />
          <ScanArrow phase={phase} sweepY={sweepY} shiftX={shiftX} resultP={resultP} />
        </ExcelApp>
      </ExcelWindow>
      <FormulaBlocks lit={lit} />
      <TopBadge text="دالة البحث الرأسي التقليدية | VLOOKUP Architecture & Limitations" from={t(2.0)} to={t(18.0)} />
      <Caption text="VLOOKUP Syntax ──► =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
