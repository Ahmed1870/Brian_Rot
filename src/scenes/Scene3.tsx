import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {PRICING, pricingCell} from '../data';
import {CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec} from '../kit';
import {SpillBorder, ImpactRing, GlowingToken} from '../fx';

// SC03: #SPILL! Error — obstacle blocks spill, then cleared.
// Anchors: 86.0 spill starts | 90.0 hits obstacle at F5 (purple border + #SPILL! badge) | 110.0 clear F5 → spill flows
const S = START.s3;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 200, 80, 140, 140, 140, 140][c] ?? XL.colW;
const cc = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += colW(i);
  return {x: x + colW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 480, fy: 260, z: 1.15}, prog(f, t(2), 30));

  // Phases: 0 = spilling, 1 = blocked, 2 = cleared
  const blocked = f >= t(90) && f < t(110);
  const cleared = f >= t(110);

  // Spill progress
  const spillP = cleared ? prog(f, t(110), 16) : blocked ? clamp(prog(f, t(86), 12) * 0.35) : prog(f, t(86), 12) * 0.35;

  const rowCount = PRICING.length;

  // Impact ring when error appears (90s) and when cleared (110s)
  const errImpact = prog(f, t(90), 12);
  const clrImpact = prog(f, t(110), 12);

  // #SPILL! badge
  const errBadgeP = blocked ? clamp(prog(f, t(90), 14)) * (1 - prog(f, t(110), 8)) : 0;

  const g0 = geo(1, 0, 1);
  const spillTop = cc(2, 4).y - XL.rowH / 2;
  const spillBottom = cc(rowCount + 1, 4).y + XL.rowH / 2;
  const spillH = spillBottom - spillTop;

  // The obstacle cell F5 (row 5) — has old text "OLD DATA"
  const obstacleCleared = cleared;
  const obstacleRow = 5;

  const showErrBadge = errBadgeP > 0.01;
  const showClrBadge = clrImpact > 0.01 && clrImpact < 0.95;

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Pricing_365.xlsx" nameBox="D2" formula="=B2:B10 * C2:C10"
          cell={(r, c) => {
            // Column D: spill results (only up to obstacle if blocked, full if cleared)
            if (c === 4 && r >= 2 && r <= rowCount + 1) {
              const idx = r - 2;
              if (idx < PRICING.length) {
                const visibleRows = Math.floor(spillP * rowCount);
                if (r - 2 < visibleRows || cleared) {
                  const row = PRICING[idx];
                  return {t: 'EGP ' + (row.qty * row.price).toLocaleString('en-US'), al: 'r', color: '#107C41'};
                }
                return {t: ''};
              }
            }
            // Column F: obstacle at F5 (row 5)
            if (c === 6 && r === obstacleRow && !obstacleCleared) {
              return {t: 'OLD DATA', bg: '#FEF3C7', color: '#92400E'};
            }
            return pricingCell(r, c) as any;
          }} colW={colW}
          sel={{r1: 2, c1: 4, r2: 2, c2: 4}} active={{r: 2, c: 4}} thumb={0} thumbSize={0.55}
        >
          {/* Spill border — blue when flowing, purple when blocked, blue again when cleared */}
          <SpillBorder
            x={cc(2, 4).x - colW(4) / 2}
            y={spillTop}
            w={colW(4)}
            h={spillH}
            p={prog(f, t(86), 12) * (1 - prog(f, t(130), 12))}
            color={blocked ? C.purple : C.blue}
            label={blocked ? '#SPILL! Blocked' : 'Spill Range'}
          />

          {/* #SPILL! error badge on D2 */}
          {showErrBadge ? (
            <>
              <GlowingToken text="#SPILL!" x={cc(2, 4).x - 50} y={cc(2, 4).y - 18} p={errBadgeP} color={C.red} size={22} />
              <ImpactRing x={cc(2, 4).x} y={cc(2, 4).y} p={errImpact} color={C.red} maxR={50} />
            </>
          ) : null}

          {/* Obstacle cell F5 highlight (purple when blocking) */}
          {blocked ? (
            <Neon x={cc(obstacleRow, 6).x - colW(6) / 2} y={cc(obstacleRow, 6).y - XL.rowH / 2} w={colW(6)} h={XL.rowH} color={C.purple} p={1} label="BLOCKING" labelBelow />
          ) : null}

          {/* Clearance impact ring on F5 */}
          {showClrBadge ? (
            <ImpactRing x={cc(obstacleRow, 6).x} y={cc(obstacleRow, 6).y} p={clrImpact} color={C.green} maxR={60} />
          ) : null}
        </ExcelApp>
      </ExcelWindow>

      {/* Bottom badge: error causes / resolution */}
      {showErrBadge ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: errBadgeP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.purple}`, borderRadius: 14, padding: '14px 36px', boxShadow: `0 0 0 6px ${C.purple}22, 0 0 30px ${C.purple}44`, display: 'flex', alignItems: 'center', gap: 16}}>
            <svg width={32} height={32} viewBox="0 0 32 32"><path d="M16 4 L28 26 H4 Z" fill="none" stroke={C.purple} strokeWidth={2.5} strokeLinejoin="round" /><line x1={16} y1={13} x2={16} y2={19} stroke={C.purple} strokeWidth={2.5} strokeLinecap="round" /><circle cx={16} cy={23} r={1.5} fill={C.purple} /></svg>
            <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.purple}}>#SPILL! Causes ──► Blocked Path · Merged Cells · Inside Excel Table</span>
          </div>
        </div>
      ) : showClrBadge ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: clrImpact}}>
          <div style={{background: C.card, border: `2.5px solid ${C.green}`, borderRadius: 14, padding: '14px 36px', boxShadow: `0 0 0 6px ${C.green}22, 0 0 30px ${C.green}44`, display: 'flex', alignItems: 'center', gap: 16}}>
            <svg width={32} height={32} viewBox="0 0 32 32"><polyline points="7,16 14,23 25,8" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>Instant Resolution ──► Clear blocking cell → spill auto-restores</span>
          </div>
        </div>
      ) : (
        <Caption text="#SPILL! Error Causes ──► Blocked Path, Merged Cells, or Inside Structured Excel Tables" from={t(86.0)} to={t(90.0)} tone="danger" />
      )}

      <TopBadge text="#SPILL! Error ──► Diagnose Obstacles & Restore Spill Flow" from={t(86.0)} to={t(110.0)} />
    </Stage>
  );
};
