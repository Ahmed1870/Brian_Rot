import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {TEXT_COMPLEX, TEXT_CSV, TEXT_CSV_ROWS, TEXT_MULTI_SPLIT} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s2;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 300, 30, 160, 30, 120, 120, 120, 120, 120][c] ?? XL.colW;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 400, fy: 260, z: 0.95}, prog(f, t(2), 30));

  // Phase 1: vertical row split =TEXTSPLIT(A2, , ",")
  const vertTyped = typed('=TEXTSPLIT(A2,,",")', f, t(42), 1.0);
  const vertDone = f >= t(48);
  const vertP = vertDone ? prog(f, t(48.5), 14) : 0;
  const vertFill = Math.floor(vertP * TEXT_CSV_ROWS.length);

  // Phase 2: multi-delimiter =TEXTSPLIT(A2, {" ","-","\,"})
  const phase2 = f >= t(58);
  const multiTyped = phase2 ? typed('=TEXTSPLIT(A2,{" ","-","\,"})', f, t(58.5), 1.0) : '';
  const multiDone = f >= t(65);
  const multiP = multiDone ? prog(f, t(65.5), 14) : 0;
  const multiFill = Math.floor(multiP * TEXT_MULTI_SPLIT.length);

  const fbEdit = (f >= t(42) && f < t(48.5)) || (phase2 && f >= t(58.5) && f < t(65.5));
  const formula = phase2 ? multiTyped : vertTyped;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const c2 = cellCenter(2, 3, {colW});
  const e2 = cellCenter(2, 5, {colW});
  const pts = dwell([
    {f: t(42), x: 200, y: fbY},
    {f: t(48), x: c2.x, y: c2.y},
    {f: t(58.5), x: 200, y: fbY},
    {f: t(65), x: e2.x, y: e2.y},
    {f: t(67), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [48, 65];
  const curHide = f > t(68);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="MultiSplit.xlsx" nameBox={phase2 ? 'E2' : 'C2'} formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Source A2
            if (c === 1) {
              if (r === 1) return {t: 'Source Text', b: true, bg: '#E2EFDA', al: 'l'};
              if (r === 2) return {t: phase2 ? TEXT_COMPLEX : TEXT_CSV};
              return undefined;
            }
            // Vertical result C2:C8 (column 3)
            if (c === 3 && !phase2) {
              if (r === 1) return {t: 'Vertical Split', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
              const idx = r - 2;
              if (idx < vertFill && idx < TEXT_CSV_ROWS.length) {
                return {t: TEXT_CSV_ROWS[idx], color: '#107C41'};
              }
              return undefined;
            }
            // Multi-delimiter result E2:I2 (columns 5-9)
            if (c >= 5 && c <= 9 && phase2) {
              if (r === 1) {
                const headers = ['Code', 'City', 'Type', 'Num', 'Extra'];
                return {t: headers[c - 5], b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
              }
              if (r === 2) {
                const idx = c - 5;
                if (idx < multiFill && idx < TEXT_MULTI_SPLIT.length) {
                  return {t: TEXT_MULTI_SPLIT[idx], color: '#92400E'};
                }
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={phase2 ? {r1: 2, c1: 5, r2: 2, c2: 5} : {r1: 2, c1: 3, r2: 2, c2: 3}}
          active={phase2 ? {r: 2, c: 5} : {r: 2, c: 3}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={cellCenter(2, 1, {colW}).y - XL.rowH / 2} w={colW(1)} h={XL.rowH} color={C.amber} p={0.2} label="Source" labelBelow />
          {!phase2 && vertP > 0.05 ? <Neon x={cellCenter(2, 3, {colW}).x - colW(3) / 2} y={cellCenter(2, 3, {colW}).y - XL.rowH / 2} w={colW(3)} h={XL.rowH * TEXT_CSV_ROWS.length} color={C.green} p={vertP * (1 - prog(f, t(58), 8))} label="=TEXTSPLIT(A2, , ',') → vertical" labelBelow /> : null}
          {phase2 && multiP > 0.05 ? <Neon x={cellCenter(2, 5, {colW}).x - colW(5) / 2} y={cellCenter(2, 5, {colW}).y - XL.rowH / 2} w={colW(5) + colW(6) + colW(7) + colW(8) + colW(9)} h={XL.rowH} color={C.purple} p={multiP * (1 - prog(f, t(85), 12))} label='=TEXTSPLIT(A2, {" ","-","\,"}) → multi-delimiter' labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase2 && c >= 58 ? C.purple : C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <TopBadge text="Vertical Row Parsing ──► =TEXTSPLIT(text, , row_delimiter) Spills Vertical Array" from={t(42.0)} to={t(58.0)} />
      {phase2 ? <Caption text='Multi-Delimiter Array ──► =TEXTSPLIT(text, {" ", "-", ","}) Parses Mixed Separators' from={t(58.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
