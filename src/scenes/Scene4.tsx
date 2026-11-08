import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CIRCULAR_FORMULA} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC04: Circular Reference detection + Remove Arrows sweep.
// Phase 1 (130-145s): A1 = A1 + B1 (circular) → red warning banner + red arrows.
// Phase 2 (145-170s): fix formula → press Remove Arrows → all arrows swept away cleanly.
const S = START.s4;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 160, 160, 160][c] ?? XL.colW;

/** Circular reference warning banner (top of Excel, like Excel's real warning). */
const CircularBanner: React.FC<{p: number}> = ({p}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', left: 80, top: 130, right: 80, height: 36,
      background: `${C.red}22`, border: `2px solid ${C.red}`, borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      opacity: p, zIndex: 50, boxShadow: `0 4px 20px ${C.red}44`,
      transform: `translateY(${(1 - p) * -20}px)`,
    }}>
      <svg width={22} height={22} viewBox="0 0 22 22"><path d="M11 2 L20 19 H2 Z" fill="none" stroke={C.red} strokeWidth={2} strokeLinejoin="round" /><line x1={11} y1={9} x2={11} y2={13} stroke={C.red} strokeWidth={2} strokeLinecap="round" /><circle cx={11} cy={16} r={1.2} fill={C.red} /></svg>
      <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.red}}>Circular Reference Warning: A1 refers to itself — calculation frozen!</span>
    </div>
  );
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 320, fy: 300, z: 1.1}, prog(f, t(2), 30));

  // Phase 1: circular reference
  const circularP = prog(f, t(131), 12) * (1 - prog(f, t(140), 10));
  // Phase 2: fixed + Remove Arrows
  const fixedP = prog(f, t(140), 10);
  const removeArrowsP = prog(f, t(145), 14);
  const cleanP = prog(f, t(150), 12) * (1 - prog(f, t(170), 12));

  // Formula display: circular first, then fixed
  const formula = fixedP > 0.3 ? '=B1+C1' : CIRCULAR_FORMULA;
  const fbEdit = f >= t(131) && f < t(140.5);

  // Cursor: A1 → formula bar → fix → Remove Arrows icon
  const a1 = cellCenter(1, 1, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const removeArrowsIconX = 990;
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const pts = dwell([
    {f: t(131), x: 200, y: fbY},
    {f: t(140), x: a1.x, y: a1.y},
    {f: t(145), x: removeArrowsIconX, y: ribbonY},
    {f: t(147), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [131, 140, 145];
  const curHide = f > t(148);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Circular_Ref.xlsx" nameBox="A1" formula={formula} fbEdit={fbEdit} tab="Formulas"
          cell={(r, c) => {
            if (r === 1 && c === 1) {
              if (fixedP > 0.3) {
                return {t: '250', al: 'r', color: '#107C41'};
              }
              return {t: '0', al: 'r', color: '#EF4444', bg: '#FEE2E2'};
            }
            if (r === 1 && c === 2) return {t: '100', al: 'r'};
            if (r === 1 && c === 3) return {t: '150', al: 'r'};
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Red circular arrow on A1 (during circular phase) */}
          {circularP > 0.01 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
              <path d={`M ${a1.x + 30} ${a1.y - 15} A 40 40 0 1 1 ${a1.x + 30} ${a1.y + 15}`} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="6 4" opacity={circularP} markerEnd="url(#circArrow)" />
              <defs><marker id="circArrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill={C.red} /></marker></defs>
            </svg>
          ) : null}
          {/* A1 highlight */}
          <Neon x={a1.x - colW(1) / 2} y={a1.y - XL.rowH / 2} w={colW(1)} h={XL.rowH} color={fixedP > 0.3 ? C.green : C.red} p={prog(f, t(131), 10) * (1 - prog(f, t(170), 12))} label={fixedP > 0.3 ? 'Fixed ✓' : 'Circular!'} labelBelow />
          {/* Remove Arrows sweep effect */}
          {removeArrowsP > 0 && removeArrowsP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 27}}>
              <line x1={0} y1={geo(1, 0, 1).rowsTop + (geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop) * removeArrowsP} x2={XL.W} y2={geo(1, 0, 1).rowsTop + (geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop) * removeArrowsP} stroke={C.blue} strokeWidth={4} opacity={0.9} />
            </svg>
          ) : null}
          {/* Clean canvas border (after sweep) */}
          {cleanP > 0.01 ? (
            <Neon x={geo(1, 0, 1).rowW} y={geo(1, 0, 1).rowsTop} w={XL.W - geo(1, 0, 1).rowW - XL.vbar} h={geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop} color={C.blue} p={cleanP * 0.2} label="Clean canvas" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 145 ? C.blue : C.red} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Circular reference banner */}
      <CircularBanner p={circularP} />

      <TopBadge text="Circular Reference Audit ──► Detect & Eliminate Calculation Loops" from={t(131.0)} to={t(150.0)} />
      {cleanP < 0.01 ? <Caption text="Circular Reference Audit ──► Detect & Eliminate Calculation Loops that Freeze Calculations" from={t(131.0)} to={t(145.0)} tone="danger" /> : null}
      {cleanP > 0.01 ? <Caption text="Clean Canvas ──► Remove Arrows Resets Auditing Visuals for Final Executive Reporting" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
