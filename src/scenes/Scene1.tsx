import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {SALES_RAW, SC01_RESULT, salesCell} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s1;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 90, 80, 100, 90, 80, 90, 30, 90, 80, 100, 90, 80, 90][c] ?? XL.colW;
const FORMULA = '=SORTBY(FILTER(A1:F11,B1:B11="Cairo"),F1:F11,-1)';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 500, fy: 280, z: 0.92}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(3.0), 1.0);
  const typingDone = f >= t(9.0);
  const spillP = typingDone ? prog(f, t(9.5), 16) : 0;
  const filledRows = Math.floor(spillP * SC01_RESULT.length);
  const fbEdit = f >= t(3.0) && f < t(9.5);
  const fbY = geo(1, 0, 1).fbTop + 14;
  const e2 = cellCenter(2, 8, {colW});
  const pts = dwell([{f: t(0), x: 900, y: 330}, {f: t(2.5), x: e2.x, y: e2.y}, {f: t(3.0), x: 200, y: fbY}, {f: t(9.0), x: e2.x, y: e2.y}, {f: t(11), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [2.5, 3.0, 9.0];
  const curHide = f > t(12);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file="tbl_Sales.xlsx" nameBox={typingDone ? 'H2' : 'A1'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 6 && r <= 11) return salesCell(r, c) as any;
            if (c >= 8 && c <= 13) {
              if (r === 1) { const h = salesCell(1, c - 7); return h ? {...h, bg: '#DBEAFE', color: '#1E40AF'} : undefined; }
              const idx = r - 2;
              if (idx < filledRows && idx < SC01_RESULT.length) {
                const row = SC01_RESULT[idx];
                const cols = [row.id, row.branch, row.product, row.category, row.region, row.amount.toLocaleString('en-US')];
                return {t: cols[c - 8], al: c === 13 ? 'r' : 'l', color: '#1E40AF'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={typingDone ? {r1: 2, c1: 8, r2: 2, c2: 8} : {r1: 1, c1: 1, r2: 1, c2: 1}}
          active={typingDone ? {r: 2, c: 8} : {r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4) + colW(5) + colW(6)} h={XL.rowH * 11} color={C.amber} p={prog(f, t(2), 12) * 0.15 * (1 - prog(f, t(40), 12))} label="Source: tbl_Sales" labelBelow />
          {spillP > 0.05 ? <Neon x={cellCenter(2, 8, {colW}).x - colW(8) / 2} y={cellCenter(2, 8, {colW}).y - XL.rowH / 2} w={colW(8) + colW(9) + colW(10) + colW(11) + colW(12) + colW(13)} h={XL.rowH * SC01_RESULT.length} color={C.blue} p={spillP * (1 - prog(f, t(40), 12))} label="=SORTBY(FILTER(...), Amount, -1)" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}><div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 39 من 76 · الوحدة 8 من 14</div></div>
      <TopBadge text="الدرس 39 من 76 | الوحدة 8 من 14 ──► FILTER & SORTBY Synergy Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Dynamic Synergy ──► =SORTBY(FILTER(array, include), by_array, sort_order)" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
