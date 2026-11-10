import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {SALES_RAW, SCAN_RESULT, salesCell} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s1;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 80, 100, 90, 30, 110][c] ?? XL.colW;
const FORMULA = '=SCAN(0,D2:D9,LAMBDA(acc,val,acc+val))';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 380, fy: 260, z: 1.05}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(3.0), 1.0);
  const typingDone = f >= t(9.0);
  const spillP = typingDone ? prog(f, t(9.5), 16) : 0;
  const filledRows = Math.floor(spillP * SCAN_RESULT.length);
  const fbEdit = f >= t(3.0) && f < t(9.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const f2 = cellCenter(2, 6, {colW});
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(2.5), x: f2.x, y: f2.y},
    {f: t(3.0), x: 200, y: fbY},
    {f: t(9.0), x: f2.x, y: f2.y},
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
          file="Accumulator.xlsx" nameBox={typingDone ? 'F2' : 'A1'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 9) return salesCell(r, c) as any;
            if (c === 6) {
              if (r === 1) return {t: 'Running Balance', b: true, bg: '#DBEAFE', al: 'r', color: '#1E40AF'};
              const idx = r - 2;
              if (idx < filledRows && idx < SCAN_RESULT.length) {
                return {t: SCAN_RESULT[idx].toLocaleString('en-US'), al: 'r', color: '#1E40AF'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={typingDone ? {r1: 2, c1: 6, r2: 2, c2: 6} : {r1: 1, c1: 1, r2: 1, c2: 1}}
          active={typingDone ? {r: 2, c: 6} : {r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 9} color={C.amber} p={prog(f, t(2), 12) * 0.15 * (1 - prog(f, t(40), 12))} label="Source: tbl_Sales" labelBelow />
          {spillP > 0.05 ? <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6)} h={XL.rowH * SCAN_RESULT.length} color={C.blue} p={spillP * (1 - prog(f, t(40), 12))} label="=SCAN result (running balance)" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}><div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 43 من 76 · ختام الوحدة 8</div></div>
      <TopBadge text="الدرس 43 من 76 | ختام الوحدة 8 ──► REDUCE & SCAN Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Accumulator Logic ──► =SCAN(0, array, LAMBDA(acc, val, acc + val))" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
