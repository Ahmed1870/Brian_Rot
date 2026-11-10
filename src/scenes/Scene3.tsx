import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {TEXT_2D_PARSED, TEXT_SPACES, TEXT_SPACES_CLEAN} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s3;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 300, 30, 100, 100, 100, 30, 100, 100][c] ?? XL.colW;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 380, fy: 260, z: 1.0}, prog(f, t(2), 30));

  // Phase 1: ignore_empty
  const ieTyped = typed('=TEXTSPLIT(A2," ",,TRUE)', f, t(86), 1.0);
  const ieDone = f >= t(93);
  const ieP = ieDone ? prog(f, t(93.5), 14) : 0;
  const ieFill = Math.floor(ieP * TEXT_SPACES_CLEAN.length);

  // Phase 2: pad_with (2D matrix)
  const phase2 = f >= t(100);
  const padTyped = phase2 ? typed('=TEXTSPLIT(A2:A4," ",",",TRUE,0,"N/A")', f, t(101), 1.0) : '';
  const padDone = f >= t(108);
  const padP = padDone ? prog(f, t(108.5), 14) : 0;

  const fbEdit = (f >= t(86) && f < t(93.5)) || (phase2 && f >= t(101) && f < t(108.5));
  const formula = phase2 ? padTyped : ieTyped;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const c2 = cellCenter(2, 3, {colW});
  const g2 = cellCenter(2, 7, {colW});
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(93), x: c2.x, y: c2.y},
    {f: t(101), x: 200, y: fbY},
    {f: t(108), x: g2.x, y: g2.y},
    {f: t(110), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [93, 108];
  const curHide = f > t(111);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="CleanText.xlsx" nameBox={phase2 ? 'G2' : 'C2'} formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Source A2 (or A2:A4 for phase 2)
            if (c === 1) {
              if (r === 1) return {t: 'Source Text', b: true, bg: '#E2EFDA', al: 'l'};
              if (r === 2) return {t: TEXT_SPACES};
              if (phase2 && r >= 3 && r <= 4) {
                const texts = ['Ahmed Cairo', 'Sara Alex'];
                return {t: texts[r - 3] ?? 'Omar'};
              }
              return undefined;
            }
            // ignore_empty result C2:E2 (columns 3-5)
            if (!phase2 && c >= 3 && c <= 5) {
              if (r === 1) {
                const headers = ['Word 1', 'Word 2', 'Word 3'];
                return {t: headers[c - 3], b: true, bg: '#FEF3C7', al: 'l', color: '#92400E'};
              }
              if (r === 2) {
                const idx = c - 3;
                if (idx < ieFill && idx < TEXT_SPACES_CLEAN.length) {
                  return {t: TEXT_SPACES_CLEAN[idx], color: '#92400E'};
                }
              }
              return undefined;
            }
            // pad_with 2D result G2:H4 (columns 7-8)
            if (phase2 && c >= 7 && c <= 8) {
              if (r === 1) {
                const headers = ['Col 1', 'Col 2'];
                return {t: headers[c - 7], b: true, bg: '#FEF3C7', al: 'l', color: '#92400E'};
              }
              const rowIdx = r - 2;
              if (rowIdx < TEXT_2D_PARSED.length && padP > rowIdx / 3) {
                const row = TEXT_2D_PARSED[rowIdx];
                const val = c === 7 ? row[0] : row[1] ?? 'N/A';
                return {t: val, color: val === 'N/A' ? C.amber : '#92400E', bg: val === 'N/A' ? `${C.amber}22` : undefined};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={phase2 ? {r1: 2, c1: 7, r2: 2, c2: 7} : {r1: 2, c1: 3, r2: 2, c2: 3}}
          active={phase2 ? {r: 2, c: 7} : {r: 2, c: 3}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={cellCenter(2, 1, {colW}).y - XL.rowH / 2} w={colW(1)} h={XL.rowH * (phase2 ? 4 : 1)} color={C.amber} p={0.2} label="Source text (with consecutive spaces)" labelBelow />
          {!phase2 && ieP > 0.05 ? <Neon x={cellCenter(2, 3, {colW}).x - colW(3) / 2} y={cellCenter(2, 3, {colW}).y - XL.rowH / 2} w={colW(3) + colW(4) + colW(5)} h={XL.rowH} color={C.amber} p={ieP * (1 - prog(f, t(100), 8))} label="ignore_empty=TRUE → clean words" labelBelow /> : null}
          {phase2 && padP > 0.05 ? <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7) + colW(8)} h={XL.rowH * 3} color={C.amber} p={padP * (1 - prog(f, t(130), 12))} label='pad_with="N/A" → no #N/A errors' labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <TopBadge text="Empty Space Filtering ──► ignore_empty = TRUE Eliminates Blank Spill Cells" from={t(86.0)} to={t(100.0)} />
      {phase2 ? <Caption text='Matrix Padding Shield ──► pad_with = "N/A" Prevents #N/A in 2D Text Arrays' from={t(100.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
