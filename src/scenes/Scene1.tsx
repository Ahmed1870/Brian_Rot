import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {EMPLOYEES, employeeCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s1;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 80, 200][c] ?? XL.colW;
const FORMULA = '=SEQUENCE(COUNTA(B2:B100))';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 280, fy: 260, z: 1.15}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(3.0), 1.1);
  const typingDone = f >= t(9.0);
  const spillP = typingDone ? prog(f, t(9.5), 16) : 0;
  const filledRows = Math.floor(spillP * EMPLOYEES.length);
  const fbEdit = f >= t(3.0) && f < t(9.5);

  const a2 = cellCenter(2, 1, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(2.5), x: a2.x, y: a2.y},
    {f: t(3.0), x: 200, y: fbY},
    {f: t(9.0), x: a2.x, y: a2.y},
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
          file="AutoNumber.xlsx" nameBox={typingDone ? 'A2' : 'A1'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c === 2) return employeeCell(r, c) as any;
            if (c === 1) {
              if (r === 1) return {t: 'ID', b: true, bg: '#E2EFDA', al: 'l'};
              if (r >= 2 && r <= EMPLOYEES.length + 1) {
                const idx = r - 2;
                if (idx < filledRows) return {t: String(idx + 1), color: '#107C41', al: 'c'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={typingDone ? {r1: 2, c1: 1, r2: 2, c2: 1} : {r1: 1, c1: 1, r2: 1, c2: 1}}
          active={typingDone ? {r: 2, c: 1} : {r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={geo(1, 0, 1).rowsTop} w={colW(2)} h={XL.rowH * EMPLOYEES.length} color={C.amber} p={prog(f, t(2), 12) * 0.3 * (1 - prog(f, t(40), 12))} label="COUNTA source (B2:B100)" labelBelow />
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={cellCenter(2, 1, {colW}).y - XL.rowH / 2} w={colW(1)} h={XL.rowH * EMPLOYEES.length} color={C.blue} p={spillP * (1 - prog(f, t(40), 12))} label="=SEQUENCE spill" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 36 من 76 · الوحدة 7 من 14</div>
      </div>
      <TopBadge text="الدرس 36 من 76 | الوحدة 7 من 14 ──► SEQUENCE & RANDARRAY Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Auto-Numbering ──► =SEQUENCE(COUNTA(B2:B100)) (Zero Manual Drag Fill)" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
