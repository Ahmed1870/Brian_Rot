import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SORT_FILTER_RESULT, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s4;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 90, 110, 100, 30, 100, 90, 110, 100][c] ?? XL.colW;
const FORMULA = '=SORT(FILTER(A1:D11, (B:B="Cairo") * (D:D>5000), "No Data"), 3, -1)';

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 480, fy: 280, z: 0.95}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(131), 1.0);
  const typingDone = f >= t(142);
  const spillP = typingDone ? prog(f, t(142.5), 16) : 0;
  const filledRows = Math.floor(spillP * SORT_FILTER_RESULT.length);
  const fbEdit = f >= t(131) && f < t(142.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const f2 = cellCenter(2, 6, {colW});
  const pts = dwell([
    {f: t(131), x: 200, y: fbY},
    {f: t(142), x: f2.x, y: f2.y},
    {f: t(144), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [142];
  const curHide = f > t(145);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Chaining.xlsx" nameBox="F2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 11) return salesCell(r, c) as any;
            if (c >= 6 && c <= 9) {
              if (r === 1) {
                const h = ['OrderID', 'Branch', 'Product', 'Amount'];
                return {t: h[c - 6], b: true, bg: '#FEF3C7', al: c === 9 ? 'r' : 'l', color: '#92400E'};
              }
              const idx = r - 2;
              if (idx < filledRows && idx < SORT_FILTER_RESULT.length) {
                const row = SORT_FILTER_RESULT[idx];
                return c === 6 ? {t: row.id, color: '#92400E'} : c === 7 ? {t: row.branch, color: '#92400E'} : c === 8 ? {t: row.product, color: '#92400E'} : {t: row.amount.toLocaleString('en-US'), al: 'r', color: '#92400E'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 6, r2: 2, c2: 6}} active={{r: 2, c: 6}}
          thumb={0} thumbSize={0.55}
        >
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6) + colW(7) + colW(8) + colW(9)} h={XL.rowH * SORT_FILTER_RESULT.length} color={C.amber} p={spillP * (1 - prog(f, t(170), 12))} label="=SORT(FILTER(...)) — filtered + sorted descending" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 16px'}}>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>SORT</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>(</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue}}>FILTER</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>(...) +</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.amber}}>SORT</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>chain → 1 formula = full report</span>
        </div>
      </div>

      <TopBadge text="Advanced Formula Chaining ──► =SORT(FILTER(array, include, if_empty), sort_index, sort_order)" from={t(131.0)} to={t(150.0)} />
      {spillP > 0.3 ? <Caption text="Automated Reporting ──► Filters and Sorts Target Records Dynamically in a Single Formula" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
