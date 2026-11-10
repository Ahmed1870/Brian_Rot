import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CAIRO_SALES, FILTERED_SCAN_RESULT, salesCell} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s4;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 80, 100, 90, 30, 110][c] ?? XL.colW;
const FORMULA = '=SCAN(0,FILTER(D2:D9,B2:B9="Cairo"),LAMBDA(acc,val,acc+val))';

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 380, fy: 260, z: 1.05}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(131), 0.9);
  const typingDone = f >= t(142);
  const spillP = typingDone ? prog(f, t(142.5), 16) : 0;
  const filledRows = Math.floor(spillP * FILTERED_SCAN_RESULT.length);
  const fbEdit = f >= t(131) && f < t(142.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const f2 = cellCenter(2, 6, {colW});
  const pts = dwell([{f: t(131), x: 200, y: fbY}, {f: t(142), x: f2.x, y: f2.y}, {f: t(144), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [142];
  const curHide = f > t(145);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="FilteredScan.xlsx" nameBox="F2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 9) return salesCell(r, c) as any;
            if (c === 6) {
              if (r === 1) return {t: 'Filtered Running Balance', b: true, bg: '#D1FAE5', al: 'r', color: '#107C41'};
              const idx = r - 2;
              if (idx < filledRows && idx < FILTERED_SCAN_RESULT.length) {
                return {t: FILTERED_SCAN_RESULT[idx].toLocaleString('en-US'), al: 'r', color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 6, r2: 2, c2: 6}} active={{r: 2, c: 6}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 9} color={C.amber} p={0.12} label="Source table" labelBelow />
          {/* Highlight Cairo rows in source */}
          {CAIRO_SALES.map((row, i) => {
            const sourceRowIdx = CAIRO_SALES.findIndex((s) => s.id === row.id) + 2;
            return <Neon key={i} x={cellCenter(sourceRowIdx, 2, {colW}).x - colW(2) / 2} y={cellCenter(sourceRowIdx, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH} color={C.blue} p={prog(f, t(135), 10) * 0.4 * (1 - prog(f, t(170), 12))} />;
          })}
          {spillP > 0.05 ? <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6)} h={XL.rowH * FILTERED_SCAN_RESULT.length} color={C.green} p={spillP * (1 - prog(f, t(170), 12))} label="=SCAN(0, FILTER(...), LAMBDA(...))" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 16px'}}>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue}}>FILTER</span>
          <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>→</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>SCAN</span>
          <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>= filtered running balance</span>
        </div>
      </div>

      <TopBadge text="Filtered Running Balance ──► =SCAN(0, FILTER(array, condition), LAMBDA(acc, val, acc + val))" from={t(131.0)} to={t(150.0)} />
      {spillP > 0.3 ? <Caption text="Condition-Based Accumulation ──► Computes Spilled Running Balance for Filtered Criteria" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
