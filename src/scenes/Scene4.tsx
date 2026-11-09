import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {EXACTLY_ONCE_CUSTOMERS, MULTI_SORT_RESULT, SALES_RAW, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC04: exactly_once (rare values) + multi-level SORTBY.
const S = START.s4;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 130, 110, 120, 100, 30, 160][c] ?? XL.colW;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 460, fy: 280, z: 0.95}, prog(f, t(2), 30));

  const eoTyped = typed('=UNIQUE(C2:C11, , TRUE)', f, t(131), 1.2);
  const eoDone = f >= t(138);
  const eoP = eoDone ? prog(f, t(138.5), 14) : 0;
  const eoFilled = Math.floor(eoP * EXACTLY_ONCE_CUSTOMERS.length);
  const eoFbEdit = f >= t(131) && f < t(138.5);

  const phase2 = f >= t(145);
  const msTyped = phase2 ? typed('=SORTBY(A1:D11, B1:B11, 1, D1:D11, -1)', f, t(145.5), 1.2) : '';
  const msDone = f >= t(155);
  const msP = msDone ? prog(f, t(155.5), 14) : 0;
  const msFilled = Math.floor(msP * MULTI_SORT_RESULT.length);
  const msFbEdit = phase2 && f >= t(145.5) && f < t(155.5);

  const fbEdit = eoFbEdit || msFbEdit;
  const formula = phase2 ? msTyped : eoTyped;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const g2 = cellCenter(2, 7, {colW});
  const a13 = cellCenter(13, 1, {colW});
  const pts = dwell([
    {f: t(131), x: 200, y: fbY},
    {f: t(138), x: g2.x, y: g2.y},
    {f: t(145.5), x: 200, y: fbY},
    {f: t(155), x: a13.x, y: a13.y},
    {f: t(157), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [138, 155];
  const curHide = f > t(158);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  const g0 = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Advanced.xlsx" nameBox={phase2 ? 'A13' : 'G2'} formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 11) return salesCell(r, c) as any;
            if (!phase2 && c === 7) {
              if (r === 1) return {t: 'Rare Customers', b: true, bg: '#DBEAFE', al: 'l', color: '#1E40AF'};
              const idx = r - 2;
              if (idx < eoFilled && idx < EXACTLY_ONCE_CUSTOMERS.length) {
                return {t: EXACTLY_ONCE_CUSTOMERS[idx], color: '#1E40AF'};
              }
              return undefined;
            }
            if (phase2 && c <= 4 && r >= 13) {
              if (r === 13) return salesCell(1, c) as any;
              const idx = r - 14;
              if (idx < msFilled && idx < MULTI_SORT_RESULT.length) {
                const row = MULTI_SORT_RESULT[idx];
                return c === 1 ? {t: row.category, color: '#107C41'} : c === 2 ? {t: row.branch, color: '#107C41'} : c === 3 ? {t: row.customer, color: '#107C41'} : {t: row.amount.toLocaleString('en-US'), al: 'r', color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={phase2 ? {r1: 13, c1: 1, r2: 13, c2: 1} : {r1: 2, c1: 7, r2: 2, c2: 7}}
          active={phase2 ? {r: 13, c: 1} : {r: 2, c: 7}}
          thumb={0} thumbSize={0.55}
        >
          {!phase2 && eoP > 0.05 ? (
            <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7)} h={XL.rowH * EXACTLY_ONCE_CUSTOMERS.length} color={C.blue} p={eoP * (1 - prog(f, t(170), 12))} label="exactly_once — appeared 1 time only" labelBelow />
          ) : null}
          {phase2 && msP > 0.05 ? (
            <Neon x={cellCenter(14, 1, {colW}).x - colW(1) / 2} y={cellCenter(14, 1, {colW}).y - XL.rowH / 2} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * MULTI_SORT_RESULT.length} color={C.green} p={msP * (1 - prog(f, t(170), 12))} label="SORTBY — Region ASC + Amount DESC" labelBelow />
          ) : null}
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={g0.rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 11} color={C.amber} p={0.15} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase2 ? C.green : C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: phase2 ? C.muted : C.blue, opacity: phase2 ? 0.5 : 1}}>exactly_once → rare customers</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>|</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: phase2 ? C.green : C.muted, opacity: phase2 ? 1 : 0.5}}>SORTBY multi-level → Region ASC + Amount DESC</span>
        </div>
      </div>

      <TopBadge text="Isolated Rare Values ──► =UNIQUE(array, , TRUE) Filters Single-Occurrence Items" from={t(131.0)} to={t(145.0)} />
      {phase2 ? <Caption text="Multi-Level Array Sorting ──► =SORTBY(array, by_col1, order1, by_col2, order2)" from={t(145.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
