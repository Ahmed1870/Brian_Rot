import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {CROSSTAB, CROSSTAB_MONTHS, FLAT_TABLE, crosstabCell, flatCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC01: Crosstab Matrix (bad) vs Normalized Flat Table (good).
// Single Excel window. The wide crosstab is shown first (red border),
// then transforms into a flat 3-column table (green border) on the SAME grid.
const S = START.s1;
const t = (g: number) => sec(g - S);

const crosstabColW = (c: number) => [0, 160, 100, 100, 100, 100][c] ?? XL.colW;
const flatColW = (c: number) => [0, 160, 120, 120, 120, 120][c] ?? XL.colW;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 280, z: 1.05}, prog(f, t(2), 30));

  // Phase 1 (0-6s): crosstab shown with red border
  // Phase 2 (6-18s): transformation — crosstab fades, flat table appears
  // Phase 3 (18-40s): flat table stable with green border
  const transformP = prog(f, t(6), 24);
  const showFlat = transformP > 0.5;
  const crosstabOpacity = 1 - transformP;
  const flatOpacity = transformP;

  // Which layout to use (cell widths change)
  const cw = showFlat ? flatColW : crosstabColW;

  // Cursor
  const a1 = cellCenter(1, 1, {colW: cw});
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(6), x: a1.x, y: a1.y},
    {f: t(8), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [6];
  const curHide = f > t(9);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Unpivoting.xlsx" nameBox="A1" formula="" tab="Data"
          cell={(r, c) => {
            if (!showFlat) {
              // Crosstab (wide)
              return crosstabCell(r, c) as any;
            }
            // Flat table (normalized) — 3 columns
            const fillRows = Math.floor((transformP - 0.5) * 2 * FLAT_TABLE.length);
            return flatCell(r, c, fillRows) as any;
          }} colW={cw}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Red border on crosstab (fading out) */}
          {crosstabOpacity > 0.01 ? (
            <Neon x={cellCenter(1, 1, {colW: crosstabColW}).x - crosstabColW(1) / 2} y={geo(1, 0, 1).rowsTop} w={crosstabColW(1) + crosstabColW(2) + crosstabColW(3) + crosstabColW(4) + crosstabColW(5)} h={XL.rowH * 5} color={C.red} p={crosstabOpacity * 0.4} label="Crosstab (bad for analysis)" labelBelow />
          ) : null}
          {/* Green border on flat table (appearing) */}
          {flatOpacity > 0.01 ? (
            <Neon x={cellCenter(1, 1, {colW: flatColW}).x - flatColW(1) / 2} y={geo(1, 0, 1).rowsTop} w={flatColW(1) + flatColW(2) + flatColW(3)} h={XL.rowH * (FLAT_TABLE.length + 1)} color={C.green} p={flatOpacity * 0.4} label="Normalized flat table (BI-ready)" labelBelow />
          ) : null}
          {/* Transformation arrows (during transition) */}
          {transformP > 0.2 && transformP < 0.8 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 26}}>
              <line x1={cellCenter(1, 4, {colW: crosstabColW}).x} y1={cellCenter(3, 4, {colW: crosstabColW}).y} x2={cellCenter(3, 1, {colW: flatColW}).x} y2={cellCenter(8, 1, {colW: flatColW}).y} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={(transformP - 0.2) * 1.5} />
            </svg>
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Lesson counter */}
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 26 من 76 · الوحدة 5 من 14</div>
      </div>

      <TopBadge text="الدرس 26 من 76 | الوحدة 5 من 14 ──► Data Reshaping & Unpivoting Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Crosstab vs Flat Table ──► Matrix Layouts Block Pivot Tables; Normalized Data Powers BI" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
