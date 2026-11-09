import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {PIPELINE_RESULT, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s4;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 100, 100, 100, 30, 100, 100, 100][c] ?? XL.colW;
const FORMULA = '=CHOOSECOLS(SORT(FILTER(A1:D7,D1:D7>1000),3,-1),1,4,3)';

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 260, z: 0.98}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(131), 1.0);
  const typingDone = f >= t(142);
  const spillP = typingDone ? prog(f, t(142.5), 16) : 0;
  const filledRows = Math.floor(spillP * PIPELINE_RESULT.length);
  const fbEdit = f >= t(131) && f < t(142.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const h2 = cellCenter(2, 7, {colW});
  const pts = dwell([
    {f: t(131), x: 200, y: fbY},
    {f: t(142), x: h2.x, y: h2.y},
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
          file="Pipeline.xlsx" nameBox="H2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 7) return salesCell(r, c) as any;
            if (c >= 7 && c <= 9) {
              if (r === 1) {
                const h = ['OrderID', 'Amount', 'Product'];
                return {t: h[c - 7], b: true, bg: '#D1FAE5', al: c === 8 ? 'r' : 'l', color: '#107C41'};
              }
              const idx = r - 2;
              if (idx < filledRows && idx < PIPELINE_RESULT.length) {
                const row = PIPELINE_RESULT[idx];
                return c === 7 ? {t: row.id, color: '#107C41'} : c === 8 ? {t: row.amount, al: 'r', color: '#107C41'} : {t: row.product, color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 7, r2: 2, c2: 7}} active={{r: 2, c: 7}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 7} color={C.amber} p={0.15} label="Source table" labelBelow />
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7) + colW(8) + colW(9)} h={XL.rowH * PIPELINE_RESULT.length} color={C.green} p={spillP * (1 - prog(f, t(170), 12))} label="=CHOOSECOLS(SORT(FILTER(...)), 1, 4, 3)" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 16px'}}>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue}}>FILTER</span>
          <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>→</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.amber}}>SORT</span>
          <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>→</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>CHOOSECOLS</span>
          <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>= 1 formula = executive report</span>
        </div>
      </div>

      <TopBadge text="Master Reshaping Pipeline ──► =CHOOSECOLS(SORT(FILTER(...)), 1, 4, 3)" from={t(131.0)} to={t(150.0)} />
      {spillP > 0.3 ? <Caption text="Custom Executive Reports ──► Filters, Sorts, and Selects Target Columns in One Dynamic Stream" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
