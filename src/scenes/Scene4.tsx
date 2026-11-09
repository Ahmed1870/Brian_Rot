import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {PRODUCTS_LIST, SAMPLE_1, SAMPLE_2} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, KeyBadge, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s4;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 200, 30, 200][c] ?? XL.colW;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 320, fy: 260, z: 1.1}, prog(f, t(2), 30));

  // Type formula
  const typedFormula = typed('=INDEX(A2:A11, RANDARRAY(5,1,1,COUNTA(A2:A11),TRUE))', f, t(131), 1.1);
  const typingDone = f >= t(143);
  const spillP = typingDone ? prog(f, t(143.5), 14) : 0;

  // F9 refresh (145s)
  const f9P = prog(f, t(145), 8) * (1 - prog(f, t(147), 8));
  const f9Active = f >= t(145) && f < t(147);
  const showSample2 = f >= t(146);

  const fbEdit = f >= t(131) && f < t(143.5);
  const formula = typedFormula;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const c2 = cellCenter(2, 3, {colW});
  const pts = dwell([
    {f: t(131), x: 200, y: fbY},
    {f: t(143), x: c2.x, y: c2.y},
    {f: t(145), x: c2.x, y: c2.y},
    {f: t(147), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [143, 145];
  const curHide = f > t(148);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  const currentSample = showSample2 ? SAMPLE_2 : SAMPLE_1;

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Sampling.xlsx" nameBox="C2" formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Source products A2:A11
            if (c === 1 && r >= 2 && r <= 11) {
              if (r === 1) return undefined;
              return {t: PRODUCTS_LIST[r - 2]};
            }
            if (r === 1 && c === 1) return {t: 'Products', b: true, bg: '#E2EFDA', al: 'l'};
            // Sampling result C2:C6
            if (c === 3 && r >= 2 && r <= 6) {
              if (r === 1) return undefined;
              const idx = r - 2;
              if (idx < 5 && spillP > idx / 5) {
                const sampleIdx = currentSample[idx];
                return {t: PRODUCTS_LIST[sampleIdx], color: '#107C41'};
              }
              return undefined;
            }
            if (r === 1 && c === 3) return {t: 'Random Sample', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 3, r2: 2, c2: 3}} active={{r: 2, c: 3}}
          thumb={0} thumbSize={0.55}
        >
          {/* Source highlight */}
          <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1)} h={XL.rowH * 10} color={C.amber} p={0.15} label="Source: tbl_Products" labelBelow />
          {/* Sampling result border */}
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 3, {colW}).x - colW(3) / 2} y={cellCenter(2, 3, {colW}).y - XL.rowH / 2} w={colW(3)} h={XL.rowH * 5} color={C.green} p={spillP * (1 - prog(f, t(170), 12))} label={f9Active ? 'F9 → samples refreshed!' : '=INDEX(..., RANDARRAY(...)) result'} labelBelow />
          ) : null}
          {/* F9 flash effect */}
          {f9P > 0.01 ? (
            <div style={{position: 'absolute', left: cellCenter(2, 3, {colW}).x - colW(3) / 2, top: cellCenter(2, 3, {colW}).y - XL.rowH / 2, width: colW(3), height: XL.rowH * 5, background: C.green, opacity: f9P * 0.3, borderRadius: 4, zIndex: 27, pointerEvents: 'none'}} />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 145 ? C.blue : C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* F9 key badge */}
      <KeyBadge keys={['F9']} p={f9P} color={C.blue} left={1330} top={80} />

      <TopBadge text="Random Sampling Engine ──► =INDEX(array, RANDARRAY(rows, 1, 1, COUNTA(array), TRUE))" from={t(131.0)} to={t(150.0)} />
      {f9Active ? <Caption text="Dynamic Simulation ──► Instant Monte-Carlo Style Data Sampling Triggered by F9" from={t(145.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
