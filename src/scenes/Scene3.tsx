import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {RAND_DEC_GRID, RAND_INT_GRID} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s3;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 100, 100, 100][c] ?? XL.colW;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 260, z: 1.05}, prog(f, t(2), 30));

  const intTyped = typed('=RANDARRAY(10, 3, 1000, 5000, TRUE)', f, t(86), 1.2);
  const intDone = f >= t(95);
  const intP = intDone ? prog(f, t(95.5), 16) : 0;

  // Toggle to decimal (FALSE)
  const phase2 = f >= t(105);
  const decTyped = phase2 ? typed('=RANDARRAY(10, 3, 1, 5, FALSE)', f, t(106), 1.0) : '';
  const decDone = f >= t(112);
  const decP = decDone ? prog(f, t(112.5), 14) : 0;

  const fbEdit = (f >= t(86) && f < t(95.5)) || (phase2 && f >= t(106) && f < t(112.5));
  const formula = phase2 ? decTyped : intTyped;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const d2 = cellCenter(2, 2, {colW});
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(95), x: d2.x, y: d2.y},
    {f: t(106), x: 200, y: fbY},
    {f: t(112), x: d2.x, y: d2.y},
    {f: t(114), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [95, 112];
  const curHide = f > t(115);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="RandArray.xlsx" nameBox="B2" formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c < 2 || c > 4) return undefined;
            if (r === 1) return {t: `Col ${c - 1}`, b: true, bg: '#FEF3C7', al: 'c', color: '#92400E'};
            if (r < 2 || r > 11) return undefined;
            const rowIdx = r - 2, colIdx = c - 2;
            if (!phase2) {
              if (intP > (rowIdx * 3 + colIdx) / 30) {
                return {t: String(RAND_INT_GRID[rowIdx][colIdx]), al: 'c', color: '#92400E'};
              }
            } else {
              if (decP > (rowIdx * 3 + colIdx) / 30) {
                return {t: String(RAND_DEC_GRID[rowIdx][colIdx]), al: 'c', color: '#1E40AF'};
              }
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 2, r2: 2, c2: 2}} active={{r: 2, c: 2}}
          thumb={0} thumbSize={0.55}
        >
          {!phase2 && intP > 0.05 ? (
            <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={cellCenter(2, 2, {colW}).y - XL.rowH / 2} w={colW(2) + colW(3) + colW(4)} h={XL.rowH * 10} color={C.amber} p={intP * (1 - prog(f, t(130), 12))} label="=RANDARRAY(10,3,1000,5000,TRUE) — integers" labelBelow />
          ) : null}
          {phase2 && decP > 0.05 ? (
            <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={cellCenter(2, 2, {colW}).y - XL.rowH / 2} w={colW(2) + colW(3) + colW(4)} h={XL.rowH * 10} color={C.blue} p={decP * (1 - prog(f, t(130), 12))} label="=RANDARRAY(...,FALSE) — decimals" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase2 && c >= 106 ? C.blue : C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="Dynamic Random Generator ──► =RANDARRAY(rows, cols, min, max, whole_number)" from={t(86.0)} to={t(105.0)} />
      {phase2 ? <Caption text="Mock Data Engine ──► Generates Integer or Decimal Arrays Without Dragging Formulas" from={t(105.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
