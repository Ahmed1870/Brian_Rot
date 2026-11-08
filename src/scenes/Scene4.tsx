import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {PRICING, pricingCell} from '../data';
import {CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec} from '../kit';
import {SpillBorder, GlowingToken, ImpactRing} from '../fx';

// SC04: @ Operator — implicit intersection (scalar) vs full array spill.
// Anchors: 131.0 formula with @ | 135.0 scalar mode (single result) | 145.0 remove @ → full spill
const S = START.s4;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 200, 80, 140, 140, 140][c] ?? XL.colW;
const cc = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += colW(i);
  return {x: x + colW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 240, z: 1.15}, prog(f, t(2), 30));

  // Phase 0: @ present (scalar, only D2 has result). Phase 1: @ removed (full spill)
  const atRemoved = f >= t(145);
  const formula = atRemoved ? '=B2:B10 * C2:C10' : '=@B2:B10 * C2:C10';
  const rowCount = PRICING.length;

  // @ glow
  const atGlowP = prog(f, t(131), 14) * (1 - prog(f, t(145), 8));
  // Spill progress after @ removal
  const spillP = atRemoved ? prog(f, t(145), 16) : 0;
  // Scalar result glow (D2 only)
  const scalarP = prog(f, t(135), 14) * (1 - prog(f, t(145), 8));
  // Impact when @ removed
  const unleashP = prog(f, t(145), 14);

  const g0 = geo(1, 0, 1);
  const spillTop = cc(2, 4).y - XL.rowH / 2;
  const spillBottom = cc(rowCount + 1, 4).y + XL.rowH / 2;
  const spillH = spillBottom - spillTop;

  const showScalarBadge = scalarP > 0.01;
  const showUnleashBadge = unleashP > 0.01 && unleashP < 0.95;

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Pricing_365.xlsx" nameBox="D2" formula={formula}
          cell={(r, c) => {
            if (c === 4 && r >= 2 && r <= rowCount + 1) {
              const idx = r - 2;
              if (idx < PRICING.length) {
                const row = PRICING[idx];
                // Scalar mode: only D2 has result. Array mode: all rows up to spillP
                if (atRemoved) {
                  const visibleRows = Math.floor(spillP * rowCount);
                  if (r - 2 < visibleRows) {
                    return {t: 'EGP ' + (row.qty * row.price).toLocaleString('en-US'), al: 'r', color: '#107C41'};
                  }
                  return {t: ''};
                } else {
                  // Scalar: only D2
                  if (r === 2 && scalarP > 0) {
                    return {t: 'EGP ' + (row.qty * row.price).toLocaleString('en-US'), al: 'r', color: '#92400E'};
                  }
                  return {t: ''};
                }
              }
            }
            return pricingCell(r, c) as any;
          }} colW={colW}
          sel={{r1: 2, c1: 4, r2: 2, c2: 4}} active={{r: 2, c: 4}} thumb={0} thumbSize={0.55}
        >
          {/* @ glowing token near formula bar */}
          {atGlowP > 0.01 ? (
            <GlowingToken text="@" x={cc(1, 4).x - 100} y={g0.fbTop - 8} p={atGlowP} color={C.amber} size={32} />
          ) : null}

          {/* Scalar result highlight (only D2, amber) */}
          {scalarP > 0.01 ? (
            <Neon x={cc(2, 4).x - colW(4) / 2} y={cc(2, 4).y - XL.rowH / 2} w={colW(4)} h={XL.rowH} color={C.amber} p={scalarP} label="Scalar: 1 value only" labelBelow />
          ) : null}

          {/* Spill border (blue, after @ removal) */}
          {spillP > 0.01 ? (
            <SpillBorder x={cc(2, 4).x - colW(4) / 2} y={spillTop} w={colW(4)} h={spillH} p={spillP} color={C.blue} label="Full Array Spill" />
          ) : null}

          {/* Impact ring when @ removed */}
          {showUnleashBadge ? (
            <ImpactRing x={cc(2, 4).x} y={cc(2, 4).y} p={unleashP} color={C.green} maxR={70} />
          ) : null}
        </ExcelApp>
      </ExcelWindow>

      {/* Bottom badge */}
      {showScalarBadge ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: scalarP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.amber}`, borderRadius: 14, padding: '14px 36px', boxShadow: `0 0 0 6px ${C.amber}22, 0 0 30px ${C.amber}44`, display: 'flex', alignItems: 'center', gap: 16}}>
            <GlowingToken text="@" x={0} y={0} p={1} color={C.amber} size={28} />
            <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.amber, paddingLeft: 20}}>Implicit Intersection (@) ──► Forces single-cell scalar evaluation</span>
          </div>
        </div>
      ) : showUnleashBadge ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: unleashP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.green}`, borderRadius: 14, padding: '14px 36px', boxShadow: `0 0 0 6px ${C.green}22, 0 0 30px ${C.green}44`, display: 'flex', alignItems: 'center', gap: 16}}>
            <svg width={32} height={32} viewBox="0 0 32 32"><polyline points="7,16 14,23 25,8" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>Array vs Scalar ──► Removing @ unleashes full dynamic array spill</span>
          </div>
        </div>
      ) : (
        <Caption text="Implicit Intersection (@) ──► Forces Single-Cell (Scalar) Evaluation for Legacy Compatibility" from={t(131.0)} to={t(135.0)} />
      )}

      <TopBadge text="@ Operator ──► Implicit Intersection Mechanics" from={t(131.0)} to={t(145.0)} />
    </Stage>
  );
};
