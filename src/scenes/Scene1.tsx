import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {TEXT_COMPOUND, TEXT_SPLIT_WORDS} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s1;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 260, 30, 120, 120, 120, 120][c] ?? XL.colW;
const FORMULA = '=TEXTSPLIT(A2," ")';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 260, z: 1.1}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(3.0), 1.0);
  const typingDone = f >= t(8.0);
  const spillP = typingDone ? prog(f, t(8.5), 16) : 0;
  const filledCols = Math.floor(spillP * TEXT_SPLIT_WORDS.length);
  const fbEdit = f >= t(3.0) && f < t(8.5);

  // Legacy Text to Columns wizard (red, fading)
  const legacyP = prog(f, t(1), 10) * (1 - prog(f, t(5), 8));

  const fbY = geo(1, 0, 1).fbTop + 14;
  const c2 = cellCenter(2, 3, {colW});
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(2.5), x: c2.x, y: c2.y},
    {f: t(3.0), x: 200, y: fbY},
    {f: t(8.0), x: c2.x, y: c2.y},
    {f: t(10), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [2.5, 3.0, 8.0];
  const curHide = f > t(11);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="TextSplit.xlsx" nameBox={typingDone ? 'C2' : 'A2'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Source text in A2
            if (c === 1) {
              if (r === 1) return {t: 'Combined Text', b: true, bg: '#E2EFDA', al: 'l'};
              if (r === 2) return {t: TEXT_COMPOUND};
              return undefined;
            }
            // Split results in C2:F2 (columns 3-6)
            if (c >= 3 && c <= 6) {
              if (r === 1) {
                const headers = ['First Name', 'Last Name', 'City', 'Role'];
                return {t: headers[c - 3], b: true, bg: '#DBEAFE', al: 'l', color: '#1E40AF'};
              }
              if (r === 2) {
                const idx = c - 3;
                if (idx < filledCols && idx < TEXT_SPLIT_WORDS.length) {
                  return {t: TEXT_SPLIT_WORDS[idx], color: '#1E40AF'};
                }
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={typingDone ? {r1: 2, c1: 3, r2: 2, c2: 3} : {r1: 2, c1: 1, r2: 2, c2: 1}}
          active={typingDone ? {r: 2, c: 3} : {r: 2, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Source highlight */}
          <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={cellCenter(2, 1, {colW}).y - XL.rowH / 2} w={colW(1)} h={XL.rowH} color={C.amber} p={prog(f, t(2), 12) * 0.3 * (1 - prog(f, t(40), 12))} label="Source text" labelBelow />
          {/* Legacy warning (fading) */}
          {legacyP > 0.01 ? (
            <div style={{position: 'absolute', left: 400, top: 120, opacity: legacyP, zIndex: 30, background: `${C.red}22`, border: `2px solid ${C.red}`, borderRadius: 8, padding: '10px 16px'}}>
              <span style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700}}>⚠ Legacy: Text to Columns — slow, manual, static</span>
            </div>
          ) : null}
          {/* Spill border */}
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 3, {colW}).x - colW(3) / 2} y={cellCenter(2, 3, {colW}).y - XL.rowH / 2} w={colW(3) + colW(4) + colW(5) + colW(6)} h={XL.rowH} color={C.blue} p={spillP * (1 - prog(f, t(40), 12))} label="=TEXTSPLIT(A2, ' ') → parsed columns" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}><div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 44 من 76 · الوحدة 9 من 14</div></div>
      <TopBadge text="الدرس 44 من 76 | الوحدة 9 من 14 ──► TEXTSPLIT & Dynamic Text Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Dynamic Column Parsing ──► =TEXTSPLIT(text, col_delimiter) (Replaces Text to Columns)" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
