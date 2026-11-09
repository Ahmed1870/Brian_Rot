import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {DATE_SEQUENCE, GRID_2D} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s2;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 80, 80, 80, 80, 80, 30, 100][c] ?? XL.colW;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 380, fy: 260, z: 1.1}, prog(f, t(2), 30));

  // Phase 1: 2D grid =SEQUENCE(5, 5, 100, 10)
  const gridTyped = typed('=SEQUENCE(5, 5, 100, 10)', f, t(42), 1.2);
  const gridDone = f >= t(50);
  const gridP = gridDone ? prog(f, t(50.5), 16) : 0;

  // Phase 2: date sequence =SEQUENCE(12, 1, DATE(2026,1,1), 31)
  const phase2 = f >= t(60);
  const dateTyped = phase2 ? typed('=SEQUENCE(12,1,DATE(2026,1,1),31)', f, t(60.5), 1.2) : '';
  const dateDone = f >= t(68);
  const dateP = dateDone ? prog(f, t(68.5), 14) : 0;

  const fbEdit = (f >= t(42) && f < t(50.5)) || (phase2 && f >= t(60.5) && f < t(68.5));
  const formula = phase2 ? dateTyped : gridTyped;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const a2 = cellCenter(2, 1, {colW});
  const g2 = cellCenter(2, 7, {colW});
  const pts = dwell([
    {f: t(42), x: 200, y: fbY},
    {f: t(50), x: a2.x, y: a2.y},
    {f: t(60.5), x: 200, y: fbY},
    {f: t(68), x: g2.x, y: g2.y},
    {f: t(70), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [50, 68];
  const curHide = f > t(71);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="2DGrid.xlsx" nameBox={phase2 ? 'G2' : 'A2'} formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            // 2D grid: A2:E6 (columns 1-5, rows 2-6)
            if (!phase2 && c >= 1 && c <= 5 && r >= 2 && r <= 6) {
              const rowIdx = r - 2, colIdx = c - 1;
              if (gridP > (rowIdx * 5 + colIdx) / 25) {
                return {t: String(GRID_2D[rowIdx][colIdx]), al: 'c', color: '#107C41'};
              }
              return undefined;
            }
            // Date sequence: G2:G13 (column 7, rows 2-13)
            if (phase2 && c === 7 && r >= 2 && r <= 13) {
              const idx = r - 2;
              if (dateP > idx / 12) {
                return {t: DATE_SEQUENCE[idx], al: 'c', color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={phase2 ? {r1: 2, c1: 7, r2: 2, c2: 7} : {r1: 2, c1: 1, r2: 2, c2: 1}}
          active={phase2 ? {r: 2, c: 7} : {r: 2, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {!phase2 && gridP > 0.05 ? (
            <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={cellCenter(2, 1, {colW}).y - XL.rowH / 2} w={colW(1) + colW(2) + colW(3) + colW(4) + colW(5)} h={XL.rowH * 5} color={C.green} p={gridP * (1 - prog(f, t(85), 12))} label="=SEQUENCE(5,5,100,10) — 2D grid" labelBelow />
          ) : null}
          {phase2 && dateP > 0.05 ? (
            <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7)} h={XL.rowH * 12} color={C.purple} p={dateP * (1 - prog(f, t(85), 12))} label="=SEQUENCE(12,1,DATE,31) — date calendar" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase2 && c >= 60 ? C.purple : C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(42), 12) * (1 - prog(f, t(85), 12)))}}>
        <div style={{display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: phase2 ? C.muted : C.green, opacity: phase2 ? 0.5 : 1}}>=SEQUENCE(5, 5, 100, 10) → 2D matrix</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>|</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: phase2 ? C.purple : C.muted, opacity: phase2 ? 1 : 0.5}}>=SEQUENCE(12, 1, DATE, 31) → calendar</span>
        </div>
      </div>

      <TopBadge text="2D Grid Generation ──► =SEQUENCE(rows, columns, start, step)" from={t(42.0)} to={t(60.0)} />
      {phase2 ? <Caption text="Dynamic Date Sequence ──► Generate Automated Calendar Arrays in Single Cell" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
