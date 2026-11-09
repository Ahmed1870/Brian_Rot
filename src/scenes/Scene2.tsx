import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SALES_RAW, SC02_RESULT, salesCell} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s2;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 90, 80, 100, 90, 80, 90, 30, 180][c] ?? XL.colW;
const FORMULA = '=SORTBY(FILTER(C2:C11,B2:B11="Cairo"),F2:F11,-1)';

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 280, z: 0.95}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(42), 1.1);
  const typingDone = f >= t(50);
  const spillP = typingDone ? prog(f, t(50.5), 16) : 0;
  const filledRows = Math.floor(spillP * SC02_RESULT.length);
  const fbEdit = f >= t(42) && f < t(50.5);
  const fbY = geo(1, 0, 1).fbTop + 14;
  const h2 = cellCenter(2, 8, {colW});
  const pts = dwell([{f: t(42), x: 200, y: fbY}, {f: t(50), x: h2.x, y: h2.y}, {f: t(52), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [50];
  const curHide = f > t(53);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file="External.xlsx" nameBox="H2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 6 && r <= 11) return salesCell(r, c) as any;
            if (c === 8) {
              if (r === 1) return {t: 'Product (sorted by hidden Amount)', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
              const idx = r - 2;
              if (idx < filledRows && idx < SC02_RESULT.length) return {t: SC02_RESULT[idx], color: '#107C41'};
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 8, r2: 2, c2: 8}} active={{r: 2, c: 8}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4) + colW(5) + colW(6)} h={XL.rowH * 11} color={C.amber} p={0.12} label="Source table" labelBelow />
          {/* Highlight hidden Amount column (col 6) in purple */}
          <Neon x={cellCenter(1, 6, {colW}).x - colW(6) / 2} y={geo(1, 0, 1).rowsTop} w={colW(6)} h={XL.rowH * 11} color={C.purple} p={prog(f, t(48), 12) * 0.4 * (1 - prog(f, t(85), 12))} label="Hidden sort array (Amount)" labelBelow />
          {/* Arrow from Amount column to result */}
          {spillP > 0.1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 26}}>
              <line x1={cellCenter(2, 6, {colW}).x} y1={cellCenter(2, 6, {colW}).y} x2={cellCenter(2, 8, {colW}).x} y2={cellCenter(2, 8, {colW}).y} stroke={C.purple} strokeWidth={2.5} strokeDasharray="6 3" opacity={spillP * 0.7} />
            </svg>
          ) : null}
          {spillP > 0.05 ? <Neon x={cellCenter(2, 8, {colW}).x - colW(8) / 2} y={cellCenter(2, 8, {colW}).y - XL.rowH / 2} w={colW(8)} h={XL.rowH * SC02_RESULT.length} color={C.green} p={spillP * (1 - prog(f, t(85), 12))} label="Products sorted by Amount (Amount NOT shown)" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <TopBadge text="External Array Sorting ──► Sort Filtered Results Using Unseen Columns" from={t(42.0)} to={t(60.0)} />
      {spillP > 0.3 ? <Caption text="Pure Executive Output ──► Product Names Sorted by Amount Without Amount Column" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
