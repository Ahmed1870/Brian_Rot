import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {TOCOL_RESULT, matrixCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s1;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 80, 90, 70, 80, 80, 30, 100][c] ?? XL.colW;
const FORMULA = '=TOCOL(B2:E6, 1)';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 380, fy: 260, z: 1.05}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(3.0), 1.0);
  const typingDone = f >= t(9.0);
  const spillP = typingDone ? prog(f, t(9.5), 16) : 0;
  const filledRows = Math.floor(spillP * TOCOL_RESULT.length);
  const fbEdit = f >= t(3.0) && f < t(9.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const g2 = cellCenter(2, 7, {colW});
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(2.5), x: g2.x, y: g2.y},
    {f: t(3.0), x: 200, y: fbY},
    {f: t(9.0), x: g2.x, y: g2.y},
    {f: t(11), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [2.5, 3.0, 9.0];
  const curHide = f > t(12);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Reshape.xlsx" nameBox={typingDone ? 'G2' : 'B2'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c >= 2 && c <= 5 && r >= 1 && r <= 6) return matrixCell(r, c) as any;
            if (c === 7) {
              if (r === 1) return {t: 'TOCOL result', b: true, bg: '#DBEAFE', al: 'l', color: '#1E40AF'};
              const idx = r - 2;
              if (idx < filledRows && idx < TOCOL_RESULT.length) {
                return {t: TOCOL_RESULT[idx] as string, color: '#1E40AF'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={typingDone ? {r1: 2, c1: 7, r2: 2, c2: 7} : {r1: 2, c1: 2, r2: 2, c2: 2}}
          active={typingDone ? {r: 2, c: 7} : {r: 2, c: 2}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 2, {colW}).x - colW(2) / 2} y={geo(1, 0, 1).rowsTop} w={colW(2) + colW(3) + colW(4) + colW(5)} h={XL.rowH * 6} color={C.amber} p={prog(f, t(2), 12) * 0.2 * (1 - prog(f, t(40), 12))} label="Source: 2D matrix (with blanks)" labelBelow />
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7)} h={XL.rowH * TOCOL_RESULT.length} color={C.blue} p={spillP * (1 - prog(f, t(40), 12))} label="=TOCOL(B2:E6, 1) — flattened, no blanks" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 37 من 76 · ختام الوحدة 7</div>
      </div>
      <TopBadge text="الدرس 37 من 76 | ختام الوحدة 7 ──► Array Reshaping Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Matrix Flattening ──► =TOCOL(array, 1) (Flattens 2D Grids & Ignores Blanks)" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
