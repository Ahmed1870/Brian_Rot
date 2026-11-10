import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SALES_RAW, SCAN_RESULT, salesCell} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s2;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 80, 100, 90, 110, 30, 110][c] ?? XL.colW;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 260, z: 0.98}, prog(f, t(2), 30));

  // Phase 1: show legacy formula (red)
  const legacyP = prog(f, t(42), 12) * (1 - prog(f, t(50), 8));
  // Phase 2: type SCAN formula (green)
  const scanTyped = typed('=SCAN(0,D2:D9,LAMBDA(acc,val,acc+val))', f, t(50), 1.0);
  const scanDone = f >= t(57);
  const spillP = scanDone ? prog(f, t(57.5), 16) : 0;
  const filledRows = Math.floor(spillP * SCAN_RESULT.length);
  const fbEdit = f >= t(50) && f < t(57.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const e2 = cellCenter(2, 7, {colW});
  const pts = dwell([
    {f: t(42), x: 200, y: fbY},
    {f: t(50), x: e2.x, y: e2.y},
    {f: t(57), x: e2.x, y: e2.y},
    {f: t(59), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [50, 57];
  const curHide = f > t(60);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="RunningBalance.xlsx" nameBox="E2" formula={scanTyped} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 9) return salesCell(r, c) as any;
            // Column E (5): legacy formula (red, fading)
            if (c === 5) {
              if (r === 1) return {t: 'Legacy SUM($)', b: true, bg: '#FEE2E2', al: 'r', color: '#991B1B'};
              const idx = r - 2;
              if (idx < SALES_RAW.length && legacyP > 0.3) {
                const running = SALES_RAW.slice(0, idx + 1).reduce((s, row) => s + row.amount, 0);
                return {t: running.toLocaleString('en-US'), al: 'r', color: '#991B1B', bg: '#FEE2E2'};
              }
              return undefined;
            }
            // Column G (7): SCAN result (green)
            if (c === 7) {
              if (r === 1) return {t: 'SCAN Balance', b: true, bg: '#D1FAE5', al: 'r', color: '#107C41'};
              const idx = r - 2;
              if (idx < filledRows && idx < SCAN_RESULT.length) {
                return {t: SCAN_RESULT[idx].toLocaleString('en-US'), al: 'r', color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 7, r2: 2, c2: 7}} active={{r: 2, c: 7}}
          thumb={0} thumbSize={0.55}
        >
          {/* Legacy column border (red, fading) */}
          {legacyP > 0.01 ? <Neon x={cellCenter(2, 5, {colW}).x - colW(5) / 2} y={cellCenter(2, 5, {colW}).y - XL.rowH / 2} w={colW(5)} h={XL.rowH * SALES_RAW.length} color={C.red} p={legacyP * 0.4} label="Legacy: =SUM($C$2:C2) — slow, anchored" labelBelow /> : null}
          {/* SCAN column border (green) */}
          {spillP > 0.05 ? <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7)} h={XL.rowH * SCAN_RESULT.length} color={C.green} p={spillP * (1 - prog(f, t(85), 12))} label="=SCAN — zero anchoring, 1 cell" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Comparison badge at bottom */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(42), 12) * (1 - prog(f, t(85), 12)))}}>
        <div style={{display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.red, textDecoration: 'line-through', opacity: legacyP > 0.3 ? 1 : 0.4}}>=SUM($C$2:C2) → slow, $ anchoring</span>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>vs</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.green, opacity: spillP > 0.3 ? 1 : 0.4}}>=SCAN(0, ...) → 1 cell, 0 anchoring</span>
        </div>
      </div>

      <TopBadge text="Running Balance Engine ──► Calculates Intermediate Totals in 1 Single Cell" from={t(42.0)} to={t(60.0)} />
      {spillP > 0.3 ? <Caption text="Zero Formula Anchoring ──► Replaces Legacy =SUM($C$2:C2) Without Dollar Signs $" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
