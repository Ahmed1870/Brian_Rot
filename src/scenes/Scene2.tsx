import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {GRAND_TOTAL, MEASURE_ALL, MEASURE_PCT, PIVOT_WITH_PCT} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s2;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 180, 120, 120, 30, 120][c] ?? XL.colW;

/** Power Pivot measure editor overlay — simulates the real PP formula bar. */
const MeasureEditor: React.FC<{p: number; title: string; formula: string; color: string; typingP: number}> = ({p, title, formula, color, typingP}) => {
  if (p <= 0.01) return null;
  const shownFormula = formula.slice(0, Math.floor(typingP * formula.length));
  const blink = Math.floor(useCurrentFrame() / 14) % 2 === 0 ? 1 : 0;
  return (
    <div style={{
      position: 'absolute', left: 120, top: 140, width: 1680, height: 120,
      background: '#1E1E1E', border: `2px solid ${color}`, borderRadius: 10,
      opacity: p, zIndex: 40, boxShadow: `0 8px 30px ${color}44`, overflow: 'hidden',
    }}>
      <div style={{height: 32, background: '#2D2D2D', borderBottom: '1px solid #444', display: 'flex', alignItems: 'center', paddingLeft: 16}}>
        <span style={{fontFamily: 'Consolas, monospace', fontSize: 13, color: '#888'}}>Power Pivot — Measure Editor</span>
        <span style={{marginLeft: 'auto', marginRight: 16, fontFamily: 'Consolas, monospace', fontSize: 12, color: color, fontWeight: 700}}>{title}</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', paddingLeft: 16, paddingTop: 8, gap: 10}}>
        <span style={{fontFamily: 'Consolas, monospace', fontSize: 13, color: '#666', minWidth: 30}}>fx:</span>
        <span style={{fontFamily: 'Consolas, monospace', fontSize: 16, color: color, whiteSpace: 'pre'}}>{shownFormula}</span>
        {typingP < 1 ? <span style={{opacity: blink, color, fontFamily: 'Consolas, monospace', fontSize: 16}}>|</span> : null}
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 360, z: 0.8}, prog(f, t(2), 30));

  // Phase 1: type ALL measure (42-50s)
  const allTypeP = prog(f, t(42), 18);
  const allDone = f >= t(50);
  // Phase 2: type % Total measure (52-58s)
  const pctTypeP = prog(f, t(52), 14);
  const pctDone = f >= t(58);
  // Phase 3: results appear (60-85s)
  const resultsP = prog(f, t(60), 16) * (1 - prog(f, t(85), 12));

  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([{f: t(42), x: 200, y: 170}, {f: t(52), x: 200, y: 170}, {f: t(60), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [42, 52, 60];
  const curHide = f > t(62);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="DAX_Filters.xlsx" nameBox="A1" formula="" tab="PivotTable"
          cell={(r, c) => {
            if (r === 1) {
              if (c < 1 || c > 3) return undefined;
              const headers = ['Branch', 'Total Sales', '% of Total'];
              return {t: headers[c - 1], b: true, bg: '#E2EFDA', al: c >= 2 ? 'r' : 'l'};
            }
            if (r === 7) {
              if (c === 1) return {t: 'Grand Total', b: true, bg: '#F3F3F3', al: 'l'};
              if (c === 2) return {t: GRAND_TOTAL.toLocaleString('en-US'), b: true, al: 'r', bg: '#F3F3F3'};
              if (c === 3) return {t: '100.0%', b: true, al: 'r', bg: '#F3F3F3'};
              return undefined;
            }
            const idx = r - 2;
            if (idx < 0 || idx >= PIVOT_WITH_PCT.length) return undefined;
            const row = PIVOT_WITH_PCT[idx];
            if (c === 1) return {t: row.branch};
            if (c === 2) return {t: row.sales.toLocaleString('en-US'), al: 'r', color: resultsP > 0.3 ? '#107C41' : undefined};
            if (c === 3) {
              if (resultsP > 0.3) return {t: row.pct.toFixed(1) + '%', al: 'r', color: '#107C41'};
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Grand total highlight (denominator lock) */}
          {allDone ? <Neon x={cellCenter(7, 2, {colW}).x - colW(2) / 2} y={cellCenter(7, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH} color={C.green} p={prog(f, t(50), 12) * 0.5 * (1 - prog(f, t(85), 12))} label="Denominator locked: ALL → grand total" labelBelow /> : null}
          {/* % column results */}
          {resultsP > 0.05 ? <Neon x={cellCenter(2, 3, {colW}).x - colW(3) / 2} y={cellCenter(2, 3, {colW}).y - XL.rowH / 2} w={colW(3)} h={XL.rowH * 5} color={C.green} p={resultsP * 0.3} label="DIVIDE → accurate % ratios" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Power Pivot measure editor — ALL measure */}
      {f >= t(42) && f < t(52) ? (
        <MeasureEditor p={prog(f, t(42), 8)} title="ALL Measure" formula={MEASURE_ALL} color={C.green} typingP={allTypeP} />
      ) : null}
      {/* Power Pivot measure editor — % Total measure */}
      {f >= t(52) ? (
        <MeasureEditor p={clamp(prog(f, t(52), 8)) * (1 - prog(f, t(85), 12))} title="% Total Measure" formula={MEASURE_PCT} color={C.green} typingP={pctTypeP} />
      ) : null}

      <TopBadge text="ALL Function Mechanics ──► CALCULATE([Total Sales], ALL(Fact_Sales))" from={t(42.0)} to={t(60.0)} />
      {resultsP > 0.3 ? <Caption text="Dynamic Percentage Ratios ──► DIVIDE([Total Sales], [All Sales]) Computes Unfiltered Ratios" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
