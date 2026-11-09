import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SALES_RAW, SC03_RESULT, salesCell} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s3;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 90, 80, 100, 90, 80, 90, 30, 90, 80, 100, 90, 80, 90][c] ?? XL.colW;
const FORMULA = '=SORTBY(FILTER(A1:F11,(F1:F11>5000)*(D1:D11="Tech")),E1:E11,1,F1:F11,-1)';

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 500, fy: 280, z: 0.92}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(86), 1.0);
  const typingDone = f >= t(96);
  const spillP = typingDone ? prog(f, t(96.5), 16) : 0;
  const filledRows = Math.floor(spillP * SC03_RESULT.length);
  const fbEdit = f >= t(86) && f < t(96.5);
  const fbY = geo(1, 0, 1).fbTop + 14;
  const e2 = cellCenter(2, 8, {colW});
  const pts = dwell([{f: t(86), x: 200, y: fbY}, {f: t(96), x: e2.x, y: e2.y}, {f: t(98), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [96];
  const curHide = f > t(99);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file="MultiSort.xlsx" nameBox="H2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 6 && r <= 11) return salesCell(r, c) as any;
            if (c >= 8 && c <= 13) {
              if (r === 1) { const h = salesCell(1, c - 7); return h ? {...h, bg: '#FEF3C7', color: '#92400E'} : undefined; }
              const idx = r - 2;
              if (idx < filledRows && idx < SC03_RESULT.length) {
                const row = SC03_RESULT[idx];
                const cols = [row.id, row.branch, row.product, row.category, row.region, row.amount.toLocaleString('en-US')];
                return {t: cols[c - 8], al: c === 13 ? 'r' : 'l', color: '#92400E'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 8, r2: 2, c2: 8}} active={{r: 2, c: 8}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4) + colW(5) + colW(6)} h={XL.rowH * 11} color={C.amber} p={0.12} label="Source table" labelBelow />
          {/* Highlight Region (col 5) and Amount (col 6) — the sort arrays */}
          <Neon x={cellCenter(1, 5, {colW}).x - colW(5) / 2} y={geo(1, 0, 1).rowsTop} w={colW(5)} h={XL.rowH * 11} color={C.purple} p={prog(f, t(92), 12) * 0.3 * (1 - prog(f, t(130), 12))} label="Sort 1: Region ASC" labelBelow />
          <Neon x={cellCenter(1, 6, {colW}).x - colW(6) / 2} y={geo(1, 0, 1).rowsTop} w={colW(6)} h={XL.rowH * 11} color={C.amber} p={prog(f, t(95), 12) * 0.3 * (1 - prog(f, t(130), 12))} label="Sort 2: Amount DESC" labelBelow />
          {spillP > 0.05 ? <Neon x={cellCenter(2, 8, {colW}).x - colW(8) / 2} y={cellCenter(2, 8, {colW}).y - XL.rowH / 2} w={colW(8) + colW(9) + colW(10) + colW(11) + colW(12) + colW(13)} h={XL.rowH * SC03_RESULT.length} color={C.amber} p={spillP * (1 - prog(f, t(130), 12))} label="Multi-level filtered sort result" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <TopBadge text="Multi-Level Filtered Sort ──► =SORTBY(FILTER(...), Region, 1, Amount, -1)" from={t(86.0)} to={t(105.0)} />
      {spillP > 0.3 ? <Caption text="Boolean Condition + Multi-Sort ──► Sorts Filtered Data Across Multiple Fields Dynamically" from={t(105.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
