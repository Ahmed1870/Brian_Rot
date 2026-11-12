import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {DIV_ERROR, MEASURE_DIVIDE_SAFE, MEASURE_UNSAFE, PIVOT_WITH_PCT} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track} from '../kit';

const S = START.s4;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 180, 120, 120, 30, 120][c] ?? XL.colW;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 320, z: 0.85}, prog(f, t(2), 30));

  // Phase 1: show unsafe division error (131-140s)
  const errorP = prog(f, t(131), 12) * (1 - prog(f, t(140), 8));
  // Phase 2: show safe DIVIDE (142-150s)
  const safeP = prog(f, t(142), 12) * (1 - prog(f, t(170), 12));
  const resultsP = prog(f, t(148), 14) * (1 - prog(f, t(170), 12));

  const pts = dwell([{f: t(131), x: 300, y: 200}, {f: t(142), x: 300, y: 200}, {f: t(148), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [131, 142];
  const curHide = f > t(150);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file="DAX_Filters.xlsx" nameBox="A1" formula="" tab="PivotTable"
          cell={(r, c) => {
            if (r === 1) {
              if (c < 1 || c > 3) return undefined;
              const h = ['Branch', 'Sales', '% Ratio'];
              return {t: h[c - 1], b: true, bg: '#E2EFDA', al: c >= 2 ? 'r' : 'l'};
            }
            const idx = r - 2;
            if (idx < 0 || idx >= PIVOT_WITH_PCT.length) return undefined;
            const row = PIVOT_WITH_PCT[idx];
            if (c === 1) return {t: row.branch};
            if (c === 2) return {t: row.sales.toLocaleString('en-US'), al: 'r'};
            if (c === 3) {
              if (errorP > 0.3) return {t: DIV_ERROR, al: 'r', color: '#EF4444', bg: '#FEE2E2'};
              if (resultsP > 0.3) return {t: row.pct.toFixed(1) + '%', al: 'r', color: '#92400E'};
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} thumb={0} thumbSize={0.55}
        >
          {/* Error highlight */}
          {errorP > 0.3 ? <Neon x={cellCenter(2, 3, {colW}).x - colW(3) / 2} y={cellCenter(2, 3, {colW}).y - XL.rowH / 2} w={colW(3)} h={XL.rowH * 5} color={C.red} p={errorP * 0.4} label="#DIV/0! — unsafe division with /" labelBelow /> : null}
          {/* Safe highlight */}
          {resultsP > 0.05 ? <Neon x={cellCenter(2, 3, {colW}).x - colW(3) / 2} y={cellCenter(2, 3, {colW}).y - XL.rowH / 2} w={colW(3)} h={XL.rowH * 5} color={C.amber} p={resultsP * 0.3} label="DIVIDE(...,0) → error-free ratios" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 142 ? C.amber : C.red} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Comparison badges */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', gap: 30, opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, padding: '12px 28px', boxShadow: `0 0 0 6px ${C.red}22`, opacity: errorP > 0.3 ? 1 : 0.4}}>
          <div style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 4}}>Unsafe:</div>
          <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.red, textDecoration: 'line-through'}}>[Sales] / [All Sales]</div>
          <div style={{fontFamily: MONO, fontSize: 14, color: C.red, marginTop: 4}}>#DIV/0! when slicer empties data</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}><span style={{fontFamily: MONO, fontSize: 28, color: C.text}}>vs</span></div>
        <div style={{background: C.card, border: `2.5px solid ${C.amber}`, borderRadius: 12, padding: '12px 28px', boxShadow: `0 0 0 6px ${C.amber}22, 0 0 30px ${C.amber}44`, opacity: safeP > 0.3 ? 1 : 0.4}}>
          <div style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 4}}>Safe:</div>
          <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.amber}}>DIVIDE(Num, Denom, 0)</div>
          <div style={{fontFamily: MONO, fontSize: 14, color: C.amber, marginTop: 4}}>✓ Returns 0 on empty — no errors</div>
        </div>
      </div>

      <TopBadge text="Divide Protection ──► Always Wrap Filter Removal Ratios inside DIVIDE(Num, Denom, 0)" from={t(131.0)} to={t(150.0)} />
      {resultsP > 0.3 ? <Caption text="Robust Reporting ──► Prevents #DIV/0! Errors When Slicers Return Empty Data" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
