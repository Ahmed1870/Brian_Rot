import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {REPS, SORTBY_RESULT, repCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, clamp, dwell, geo, prog, sec, track, typed, cellCenter,
} from '../kit';

// SC03: SORTBY — multi-level sort by external columns.
// Table: A=RepName, B=Region. Hidden criteria: D=TotalSales, E=Tenure.
// Formula: =SORTBY(A2:A5, D2:D5, -1, E2:E5, 1)
// Result: Laila(52k,3y), Tarek(52k,7y), Yasser(45k,5y), Nour(38k,2y)
const S = START.s3;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 200, 180, 30, 140, 100][c] ?? XL.colW;
const FORMULA = '=SORTBY(A2:A5, D2:D5, -1, E2:E5, 1)';

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 460, fy: 240, z: 1.15}, prog(f, t(2), 30));

  const typedFormula = typed(FORMULA, f, t(86), 1.1);
  const typingDone = f >= t(93);
  const spillP = typingDone ? prog(f, t(93.5), 16) : 0;
  const showResult = spillP > 0.05;

  // Highlight criteria columns
  const crit1P = prog(f, t(95), 14) * (1 - prog(f, t(130), 12)); // TotalSales (D)
  const crit2P = prog(f, t(100), 14) * (1 - prog(f, t(130), 12)); // Tenure (E)

  // Cursor: G2 (result cell) → formula bar → Enter
  const g2 = cellCenter(2, 7, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(93), x: g2.x, y: g2.y},
  ]);
  const cur = track(f, pts);
  const clicks = [86, 93];
  const curHide = f > t(95);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Sales_Reps.xlsx" nameBox="G2" formula={typedFormula} fbEdit={f >= t(86) && f < t(93.5)}
          cell={(r, c) => {
            // Columns A-B: RepName, Region (visible)
            if (c <= 2) return repCell(r, c) as any;
            // Column C: spacer (narrow)
            if (c === 3) return undefined;
            // Column D: TotalSales (hidden criteria, shown faded)
            if (c === 4) {
              if (r === 1) return {t: 'TotalSales', b: true, bg: '#FEF3C7', al: 'r', color: '#92400E'};
              const rep = REPS[r - 2];
              if (!rep) return undefined;
              return {t: 'EGP ' + rep.total.toLocaleString('en-US'), al: 'r', color: '#92400E'};
            }
            // Column E: Tenure (hidden criteria)
            if (c === 5) {
              if (r === 1) return {t: 'Tenure', b: true, bg: '#CFFAFE', al: 'r', color: '#155E75'};
              const rep = REPS[r - 2];
              if (!rep) return undefined;
              return {t: rep.tenure + 'y', al: 'r', color: '#155E75'};
            }
            // Column G: spilled SORTBY result
            if (c === 7) {
              if (r === 1) return {t: 'SORTBY Result', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
              if (showResult) {
                const idx = r - 2;
                if (idx < SORTBY_RESULT.length) {
                  return {t: SORTBY_RESULT[idx], color: '#107C41'};
                }
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 7, r2: 2, c2: 7}} active={{r: 2, c: 7}} thumb={0} thumbSize={0.55}
        >
          {/* Criterion 1: TotalSales DESC (amber) */}
          <Neon x={cellCenter(1, 4, {colW}).x - colW(4) / 2} y={geo(1, 0, 1).rowsTop} w={colW(4)} h={XL.rowH * 5} color={C.amber} p={crit1P * 0.5} label="Criteria 1: DESC" labelBelow />
          {/* Criterion 2: Tenure ASC (cyan) */}
          <Neon x={cellCenter(1, 5, {colW}).x - colW(5) / 2} y={geo(1, 0, 1).rowsTop} w={colW(5)} h={XL.rowH * 5} color={C.cyan} p={crit2P * 0.5} label="Criteria 2: ASC" labelBelow />
          {/* Result highlight */}
          {showResult ? (
            <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7)} h={XL.rowH * 4} color={C.green} p={spillP} label="Multi-level sorted" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Multi-axis badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 945, display: 'flex', justifyContent: 'center', opacity: crit2P > 0.01 ? crit2P : 0}}>
        <div style={{background: C.card, border: `2.5px solid ${C.cyan}`, borderRadius: 12, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.cyan}22`, display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.amber}}>1° Sales DESC</span>
          <span style={{fontFamily: MONO, fontSize: 20, color: C.text}}>→</span>
          <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.cyan}}>2° Tenure ASC</span>
          <span style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>· ties broken by tenure</span>
        </div>
      </div>

      <TopBadge text="SORTBY Superiority ──► Sorts Ranges Based on External/Unseen Columns or Multi-Criteria" from={t(86.0)} to={t(110.0)} />
      {crit2P < 0.01 ? <Caption text="Multi-Level Syntax ──► =SORTBY(array, by_array1, order1, [by_array2, order2])" from={t(110.0)} to={t(129.0)} /> : null}
    </Stage>
  );
};
