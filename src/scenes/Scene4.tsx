import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {customerCell} from '../data';
import {
  CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec,
} from '../kit';

// SC04: Hardcoded Col_Index_Num breakage — inserting a column silently returns wrong data.
// Anchors (s): 131.0 3-col table + VLOOKUP returns Address (green) | 135.0 insert MiddleName column | 137.0 4-col table + wrong result (amber)
//              145.0 silent corruption warning | 155.0 explanation
const S = START.s4;
const t = (g: number) => sec(g - S);

const colW3 = (c: number) => [0, 120, 200, 300][c] ?? XL.colW;
const colW4 = (c: number) => [0, 120, 200, 150, 300][c] ?? XL.colW;

const cCell = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  const cw = colW3;
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += cw(i);
  return {x: x + cw(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();

  const cam = camLerp(CAM0, {fx: 350, fy: 280, z: 1.18}, prog(f, t(2), 30));

  // insert phase: 0 = before insert, 1 = flash, 2 = after insert
  const inserted = f >= t(136);
  const flashP = f >= t(135.5) && f < t(136.8) ? clamp(1 - (f - t(135.5)) / 18) : 0;
  const insertAnim = prog(f, t(135), 12); // insert indicator animation

  // result display
  const correctP = prog(f, t(132), 14) * (1 - prog(f, t(135.5), 8)); // green result (before insert)
  const wrongP = prog(f, t(137), 14) * (1 - prog(f, t(170), 12));     // amber result (after insert)

  // silent corruption warning
  const warnP = prog(f, t(145), 14) * (1 - prog(f, t(170), 12));

  // column highlight
  const col3Neon = (inserted ? wrongP : correctP);
  const g = geo(1, 0, 1);

  const cw = inserted ? colW4 : colW3;
  const cell = inserted ? (r: number, c: number) => customerCell(r, c, {insert: true}) : customerCell;
  const col3Pos = (() => {
    let x = g.rowW;
    for (let i = 1; i < 3; i++) x += cw(i);
    return {x: x + cw(3) / 2, y: g.colTop + 4};
  })();

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="tbl_Customers.xlsx" nameBox="A2" formula="=VLOOKUP(A2, tbl_Customers, 3, FALSE)"
          cell={cell as any} colW={cw}
          sel={{r1: 2, c1: 1, r2: 2, c2: 1}} active={{r: 2, c: 1}} thumb={0} thumbSize={0.55}
        >
          {/* highlight column 3 (the col_index_num target) */}
          <Neon x={col3Pos.x - cw(3) / 2} y={g.colTop} w={cw(3)} h={g.rowsBottom - g.colTop} color={inserted ? C.amber : C.green} p={col3Neon * 0.5} label={inserted ? 'col 3 = MiddleName (wrong!)' : 'col 3 = Address (correct)'} />
          {/* highlight result cell */}
          <Neon x={col3Pos.x - cw(3) / 2} y={cCell(2, 3).y - XL.rowH / 2} w={cw(3)} h={XL.rowH} color={inserted ? C.amber : C.green} p={col3Neon} />

          {/* insert column indicator (before flash) */}
          {!inserted && insertAnim > 0 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 26}}>
              <rect x={col3Pos.x - 75} y={g.colTop - 30 - 40 * insertAnim} width={150} height={22} fill={C.amber} rx={4} opacity={insertAnim} />
              <text x={col3Pos.x} y={g.colTop - 14 - 40 * insertAnim} textAnchor="middle" fill="#0F172A" fontFamily="Consolas, monospace" fontSize={14} fontWeight={700} opacity={insertAnim}>↓ MiddleName</text>
            </svg>
          ) : null}

          {/* flash overlay during insert */}
          {flashP > 0 ? (
            <div style={{position: 'absolute', left: 0, top: 0, width: XL.W, height: XL.H, background: '#fff', opacity: flashP * 0.7, pointerEvents: 'none', zIndex: 30}} />
          ) : null}
        </ExcelApp>
      </ExcelWindow>

      {/* result badge (before insert — correct) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: correctP}}>
        <div style={{background: C.card, border: `2px solid ${C.green}`, borderRadius: 12, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.green}22`}}>
          <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>{`✓ =VLOOKUP(A2, tbl_Customers, 3, FALSE) → "12 Tahrir St, Cairo" (Address)`}</span>
        </div>
      </div>

      {/* result badge (after insert — wrong) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: wrongP}}>
        <div style={{background: C.card, border: `2px solid ${C.amber}`, borderRadius: 12, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.amber}22, 0 0 30px ${C.amber}44`}}>
          <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.amber}}>{`✗ =VLOOKUP(A2, tbl_Customers, 3, FALSE) → "M." (MiddleName — WRONG!)`}</span>
        </div>
      </div>

      {/* silent corruption warning */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 975, display: 'flex', justifyContent: 'center', opacity: warnP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: `${C.amber}18`, border: `2px solid ${C.amber}`, borderRadius: 999, padding: '8px 28px'}}>
          <svg width={28} height={28} viewBox="0 0 28 28"><path d="M14 3 L26 24 H2 Z" fill="none" stroke={C.amber} strokeWidth={2.5} strokeLinejoin="round" /><line x1={14} y1={11} x2={14} y2={17} stroke={C.amber} strokeWidth={2.5} strokeLinecap="round" /><circle cx={14} cy={21} r={1.5} fill={C.amber} /></svg>
          <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.amber}}>SILENT DATA CORRUPTION — No Formula Error Triggered</span>
        </div>
      </div>

      <TopBadge text="Hardcoded Index Danger ──► Static Column Numbers Fail Upon Inserting Columns" from={t(131)} to={t(150)} />
      <Caption text="Silent Data Corruption ──► Returns Wrong Data Field Without Triggering Formula Errors" from={t(145)} to={t(169)} tone="danger" />
    </Stage>
  );
};
