import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {MATRIX_3x3, TOCOL_RESULT, WRAPCOLS_RESULT} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC03: TOCOL + WRAPCOLS — typed formulas on the same grid.
// Phase 1 (85-100s): type =TOCOL(B2:D4, 1), matrix flattens into single column (blue).
// Phase 2 (100-130s): type =WRAPCOLS(A2#, 3), column wraps back into 3-column grid (green).
const S = START.s3;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 100, 100, 100, 120, 100, 100, 100][c] ?? XL.colW;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 380, fy: 260, z: 1.1}, prog(f, t(2), 30));

  // Phase control
  const phase2 = f >= t(100);
  const tocolTyped = typed('=TOCOL(B2:D4, 1)', f, t(86), 1.2);
  const tocolDone = f >= t(95);
  const tocolSpillP = tocolDone ? prog(f, t(95.5), 14) : 0;

  const wrapTyped = phase2 ? typed('=WRAPCOLS(B2#, 3)', f, t(101), 1.2) : '';
  const wrapDone = f >= t(110);
  const wrapSpillP = wrapDone ? prog(f, t(110.5), 14) : 0;

  const fbEdit = (f >= t(86) && f < t(95.5)) || (phase2 && f >= t(101) && f < t(110.5));

  // Cursor: formula bar → Enter (TOCOL), then formula bar → Enter (WRAPCOLS)
  const fbY = geo(1, 0, 1).fbTop + 14;
  const f2 = cellCenter(2, 5, {colW});
  const f6 = cellCenter(6, 5, {colW});
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(95), x: f2.x, y: f2.y},
    {f: t(101), x: 200, y: fbY},
    {f: t(110), x: f6.x, y: f6.y},
    {f: t(112), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [95, 110];
  const curHide = f > t(113);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Reshaping.xlsx" nameBox={phase2 ? 'F2' : 'E2'} formula={phase2 ? wrapTyped : tocolTyped} fbEdit={fbEdit}
          cell={(r, c) => {
            // Source matrix B2:D4 (columns 2-4, rows 2-4)
            if (c >= 2 && c <= 4 && r >= 2 && r <= 4) {
              if (r === 1 || c === 1) return undefined;
              const val = MATRIX_3x3[r - 2][c - 2];
              return {t: String(val), al: 'c'};
            }
            if (r === 1 && c >= 2 && c <= 4) return {t: `Col ${c - 1}`, b: true, bg: '#E2EFDA', al: 'c'};
            if (c === 1 && r >= 2 && r <= 4) return {t: `Row ${r - 1}`, b: true, bg: '#E2EFDA', al: 'l'};

            // TOCOL result (column E, rows 2-10)
            if (c === 5) {
              if (r === 1) return {t: 'TOCOL', b: true, bg: '#DBEAFE', al: 'c', color: '#1E40AF'};
              const idx = r - 2;
              if (idx < TOCOL_RESULT.length && tocolSpillP > idx / TOCOL_RESULT.length) {
                return {t: String(TOCOL_RESULT[idx]), al: 'c', color: '#1E40AF'};
              }
              return undefined;
            }
            // WRAPCOLS result (columns F-H, rows 2-4)
            if (phase2 && c >= 6 && c <= 8) {
              if (r === 1) return {t: c === 6 ? 'WRAPCOLS' : '', b: true, bg: '#D1FAE5', al: 'c', color: '#107C41'};
              const rowIdx = r - 2;
              const colIdx = c - 6;
              if (rowIdx < 3 && colIdx < 3 && wrapSpillP > rowIdx / 3) {
                return {t: String(WRAPCOLS_RESULT[rowIdx][colIdx]), al: 'c', color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={phase2 ? {r1: 2, c1: 6, r2: 2, c2: 6} : {r1: 2, c1: 5, r2: 2, c2: 5}}
          active={phase2 ? {r: 2, c: 6} : {r: 2, c: 5}}
          thumb={0} thumbSize={0.55}
        >
          {/* Source matrix highlight */}
          <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={cellCenter(2, 2, {colW}).y - XL.rowH / 2} w={colW(2) + colW(3) + colW(4)} h={XL.rowH * 3} color={C.amber} p={prog(f, t(86), 12) * 0.3 * (1 - prog(f, t(130), 12))} label="Source matrix" labelBelow />
          {/* TOCOL result border */}
          {tocolSpillP > 0.05 ? (
            <Neon x={cellCenter(2, 5, {colW}).x - colW(5) / 2} y={cellCenter(2, 5, {colW}).y - XL.rowH / 2} w={colW(5)} h={XL.rowH * 9} color={C.blue} p={tocolSpillP * (1 - prog(f, t(130), 12))} label="=TOCOL (flattened)" labelBelow />
          ) : null}
          {/* WRAPCOLS result border */}
          {wrapSpillP > 0.05 ? (
            <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6) + colW(7) + colW(8)} h={XL.rowH * 3} color={C.green} p={wrapSpillP * (1 - prog(f, t(130), 12))} label="=WRAPCOLS (reshaped)" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 95 ? C.blue : C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Bottom formula badge */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(86), 12) * (1 - prog(f, t(130), 12)))}}>
        <div style={{display: 'flex', gap: 20, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '10px 20px'}}>
          <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: phase2 ? C.muted : C.blue, opacity: phase2 ? 0.5 : 1}}>=TOCOL(B2:D4, 1) → 1 vector</div>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>│</span>
          <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: phase2 ? C.green : C.muted, opacity: phase2 ? 1 : 0.5}}>=WRAPCOLS(B2#, 3) → 3×3 grid</div>
        </div>
      </div>

      <TopBadge text="=TOCOL(Array, 1) ──► Flattens Matrix into Single Vector (Ignores Blanks)" from={t(86.0)} to={t(100.0)} />
      {phase2 ? <Caption text="=WRAPCOLS(Vector, 3) ──► Reshapes Single Vectors Back into Multi-Column Grids" from={t(100.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
