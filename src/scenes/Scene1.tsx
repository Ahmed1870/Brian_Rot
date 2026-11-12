import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {GRAND_TOTAL, PIVOT_ROWS} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track} from '../kit';

const S = START.s1;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 180, 120, 120, 30, 120][c] ?? XL.colW;

/** Power Pivot formula bar overlay. */
const PPFormulaBar: React.FC<{text: string; p: number; color: string}> = ({text, p, color}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', left: 80, top: 130, width: 1760, height: 44,
      background: '#1E1E1E', border: `2px solid ${color}`, borderRadius: 8,
      display: 'flex', alignItems: 'center', paddingLeft: 16, gap: 12,
      opacity: p, zIndex: 40, boxShadow: `0 4px 20px ${color}44`,
    }}>
      <span style={{fontFamily: 'Consolas, monospace', fontSize: 12, color: '#888', minWidth: 60}}>fx</span>
      <span style={{fontFamily: 'Consolas, monospace', fontSize: 16, color: p > 0.5 ? color : '#888', whiteSpace: 'nowrap', overflow: 'hidden'}}>
        {text}
      </span>
      <span style={{opacity: Math.floor(useCurrentFrame() / 14) % 2 === 0 ? 1 : 0, color, fontFamily: 'Consolas, monospace', fontSize: 16}}>|</span>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 320, z: 0.85}, prog(f, t(2), 30));

  // Phase 1: show PivotTable with wrong 100% (red)
  const wrongP = prog(f, t(1), 10);
  // Phase 2: filter removal sweep (blue)
  const sweepP = prog(f, t(6), 16) * (1 - prog(f, t(40), 12));

  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([{f: t(0), x: 900, y: 330}, {f: t(6), x: 300, y: 220}, {f: t(10), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [6];
  const curHide = f > t(12);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="DAX_Filters.xlsx" nameBox="A1" formula="" tab="PivotTable"
          cell={(r, c) => {
            if (r === 1) {
              if (c < 1 || c > 2) return undefined;
              return {t: c === 1 ? 'Branch' : 'Total Sales', b: true, bg: '#E2EFDA', al: c === 2 ? 'r' : 'l'};
            }
            if (r === 7) {
              if (c === 1) return {t: 'Grand Total', b: true, bg: '#F3F3F3', al: 'l'};
              if (c === 2) return {t: GRAND_TOTAL.toLocaleString('en-US'), b: true, al: 'r', bg: '#F3F3F3'};
              return undefined;
            }
            const idx = r - 2;
            if (idx < 0 || idx >= PIVOT_ROWS.length) return undefined;
            const row = PIVOT_ROWS[idx];
            if (c === 1) return {t: row.branch, color: wrongP > 0.3 ? '#991B1B' : undefined};
            if (c === 2) {
              // Before fix: show 100% (wrong). After sweep: show actual sales
              if (sweepP > 0.5) {
                return {t: row.sales.toLocaleString('en-US'), al: 'r', color: '#107C41'};
              }
              return {t: '100%', al: 'r', color: '#991B1B', bg: '#FEE2E2'};
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Red warning on wrong 100% */}
          {wrongP > 0.3 && sweepP < 0.3 ? (
            <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={cellCenter(2, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH * 5} color={C.red} p={wrongP * 0.4} label="WRONG: 100% per row — filter context locked" labelBelow />
          ) : null}
          {/* Filter removal sweep */}
          {sweepP > 0.05 ? (
            <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2)} h={XL.rowH * 6} color={C.blue} p={sweepP * 0.3} label="ALL → filter context removed → grand total unlocked" labelBelow />
          ) : null}
          {/* Filter removal sweep animation */}
          {sweepP > 0 && sweepP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 26}}>
              <line x1={cellCenter(1, 1, {colW}).x - colW(1)} y1={geo(1, 0, 1).rowsTop + (geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop) * sweepP} x2={cellCenter(1, 2, {colW}).x + colW(2)} y2={geo(1, 0, 1).rowsTop + (geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop) * sweepP} stroke={C.blue} strokeWidth={4} opacity={0.9} />
            </svg>
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}><div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 61 من 76 · ختام الوحدة 12</div></div>
      <TopBadge text="الدرس 61 من 76 | ختام الوحدة 12 ──► ALL, ALLEXCEPT & Remove Filters Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Filter Context Overriding ──► Clearing Table Slicers to Compute % of Total Metrics" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
