import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CHOOSECOLS_RESULT, SALES_TABLE, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s2;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 100, 100, 100, 30, 100, 100, 100][c] ?? XL.colW;
const FORMULA = '=CHOOSECOLS(A1:D7, 1, 4, 2)';

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 260, z: 0.98}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(42), 1.1);
  const typingDone = f >= t(50);
  const spillP = typingDone ? prog(f, t(50.5), 16) : 0;
  const filledRows = Math.floor(spillP * CHOOSECOLS_RESULT.length);
  const fbEdit = f >= t(42) && f < t(50.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const h2 = cellCenter(2, 7, {colW});
  const pts = dwell([
    {f: t(42), x: 200, y: fbY},
    {f: t(50), x: h2.x, y: h2.y},
    {f: t(52), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [50];
  const curHide = f > t(53);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="ChooseCols.xlsx" nameBox="H2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 7) return salesCell(r, c) as any;
            if (c >= 7 && c <= 9) {
              if (r === 1) {
                const h = ['OrderID', 'Amount', 'Name'];
                return {t: h[c - 7], b: true, bg: '#D1FAE5', al: c === 8 ? 'r' : 'l', color: '#107C41'};
              }
              const idx = r - 2;
              if (idx < filledRows && idx < CHOOSECOLS_RESULT.length) {
                const row = CHOOSECOLS_RESULT[idx];
                return c === 7 ? {t: row.col1, color: '#107C41'} : c === 8 ? {t: row.col2, al: 'r', color: '#107C41'} : {t: row.col3, color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 7, r2: 2, c2: 7}} active={{r: 2, c: 7}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 7} color={C.amber} p={0.15} label="Source table (untouched)" labelBelow />
          {/* Highlight columns 1, 4, 2 being extracted */}
          {spillP > 0.05 && spillP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 26}}>
              <line x1={cellCenter(1, 1, {colW}).x} y1={geo(1, 0, 1).rowsTop - 10} x2={cellCenter(1, 7, {colW}).x} y2={geo(1, 0, 1).rowsTop - 10} stroke={C.green} strokeWidth={2.5} strokeDasharray="5 3" opacity={spillP} />
              <line x1={cellCenter(1, 4, {colW}).x} y1={geo(1, 0, 1).rowsTop - 5} x2={cellCenter(1, 8, {colW}).x} y2={geo(1, 0, 1).rowsTop - 5} stroke={C.green} strokeWidth={2.5} strokeDasharray="5 3" opacity={spillP} />
              <line x1={cellCenter(1, 2, {colW}).x} y1={geo(1, 0, 1).rowsTop} x2={cellCenter(1, 9, {colW}).x} y2={geo(1, 0, 1).rowsTop} stroke={C.green} strokeWidth={2.5} strokeDasharray="5 3" opacity={spillP} />
            </svg>
          ) : null}
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7) + colW(8) + colW(9)} h={XL.rowH * CHOOSECOLS_RESULT.length} color={C.green} p={spillP * (1 - prog(f, t(85), 12))} label="=CHOOSECOLS(..., 1, 4, 2) — reordered" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <TopBadge text="Column Slicing ──► =CHOOSECOLS(tbl_Sales, 1, 4, 2) (Reorders Columns Dynamically)" from={t(42.0)} to={t(60.0)} />
      {spillP > 0.3 ? <Caption text="Non-Destructive ETL ──► Extracts Target Columns Without Altering Source Table Structure" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
