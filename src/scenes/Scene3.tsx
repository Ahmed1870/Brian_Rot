import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {ERROR_CARDS} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC03: Error Diagnostics — #SPILL!, #CALC!, #REF! + IFERROR vs IFNA comparison.
// Single Excel window. Three error cards appear one after another, then a comparison badge.
const S = START.s3;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 160, 200, 160, 160, 200][c] ?? XL.colW;

/** Error card showing the error code, cause, and fix. */
const ErrorCard: React.FC<{x: number; y: number; error: {code: string; color: string; title: string; desc: string; fix: string; fixColor: string}; p: number; resolvedP: number}> = ({x, y, error, p, resolvedP}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 460, opacity: p,
      transform: `scale(${0.9 + 0.1 * p}) translateY(${(1 - p) * 20}px)`, zIndex: 35,
    }}>
      <div style={{
        background: 'rgba(30,41,59,0.95)', border: `2.5px solid ${error.color}`,
        borderRadius: 12, padding: '16px 20px',
        boxShadow: `0 0 0 6px ${error.color}22, 0 8px 30px rgba(2,6,23,0.6), 0 0 30px ${error.color}44`,
      }}>
        {/* Error code */}
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
          <div style={{fontFamily: MONO, fontSize: 32, fontWeight: 700, color: error.color, textShadow: `0 0 12px ${error.color}88`}}>{error.code}</div>
          <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.text}}>{error.title}</div>
        </div>
        {/* Cause */}
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 10}}>Cause: {error.desc}</div>
        {/* Fix (appears when resolved) */}
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, opacity: resolvedP}}>
          <svg width={24} height={24} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} fill={`${error.fixColor}22`} stroke={error.fixColor} strokeWidth={2.5} /><polyline points="7,12 11,16 17,9" fill="none" stroke={error.fixColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: error.fixColor}}>Fix: {error.fix}</span>
        </div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 460, fy: 280, z: 1.05}, prog(f, t(2), 30));

  // Three error cards appear sequentially
  const card1P = prog(f, t(86), 12) * (1 - prog(f, t(95), 8));     // #SPILL!
  const card2P = prog(f, t(95), 12) * (1 - prog(f, t(105), 8));    // #CALC!
  const card3P = prog(f, t(105), 12) * (1 - prog(f, t(115), 8));   // #REF!
  // Resolution progress for each
  const resolve1P = prog(f, t(92), 12);
  const resolve2P = prog(f, t(101), 12);
  const resolve3P = prog(f, t(111), 12);

  // IFERROR vs IFNA comparison badge (115s+)
  const comparisonP = prog(f, t(115), 14) * (1 - prog(f, t(130), 12));

  // Cursor: moves between error cells
  const pts = dwell([
    {f: t(85), x: 700, y: 330},
    {f: t(95), x: 800, y: 360},
    {f: t(105), x: 750, y: 380},
  ]);
  const cur = track(f, pts);
  const curHide = f > t(116);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Error_Diagnostics.xlsx" nameBox="A1" formula="" tab="Formulas"
          cell={(r, c) => {
            // Show error cells in the grid
            if (c === 2 && r === 3) return {t: '#SPILL!', color: '#EF4444', bg: '#FEE2E2'};
            if (c === 2 && r === 5) return {t: '#CALC!', color: '#92400E', bg: '#FEF3C7'};
            if (c === 2 && r === 7) return {t: '#REF!', color: '#EF4444', bg: '#FEE2E2'};
            if (r === 1 && c === 2) return {t: 'Formula Result', b: true, bg: '#E2EFDA', al: 'l'};
            return undefined;
          }} colW={colW}
          sel={{r1: 3, c1: 2, r2: 3, c2: 2}} active={{r: 3, c: 2}}
          thumb={0} thumbSize={0.55}
        >
          {/* Highlight error cells */}
          <Neon x={cellCenter(3, 2, {colW}).x - colW(2) / 2} y={cellCenter(3, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH} color={C.red} p={card1P > 0.3 ? 0.5 : 0} />
          <Neon x={cellCenter(5, 2, {colW}).x - colW(2) / 2} y={cellCenter(5, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH} color={C.amber} p={card2P > 0.3 ? 0.5 : 0} />
          <Neon x={cellCenter(7, 2, {colW}).x - colW(2) / 2} y={cellCenter(7, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH} color={C.red} p={card3P > 0.3 ? 0.5 : 0} />
          <Cursor x={cur.x} y={cur.y} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Error cards overlay (right side) */}
      <ErrorCard x={1140} y={150} error={ERROR_CARDS[0]} p={card1P} resolvedP={resolve1P} />
      <ErrorCard x={1140} y={150} error={ERROR_CARDS[1]} p={card2P} resolvedP={resolve2P} />
      <ErrorCard x={1140} y={150} error={ERROR_CARDS[2]} p={card3P} resolvedP={resolve3P} />

      {/* IFERROR vs IFNA comparison badge (bottom) */}
      {comparisonP > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 945, display: 'flex', justifyContent: 'center', opacity: comparisonP}}>
          <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
            {/* IFERROR (bad) */}
            <div style={{background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, padding: '12px 28px', boxShadow: `0 0 0 6px ${C.red}22`}}>
              <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 4}}>Blind wrapping:</div>
              <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.red, textDecoration: 'line-through'}}>IFERROR(formula, "")</div>
              <div style={{fontFamily: MONO, fontSize: 14, color: C.red, marginTop: 4}}>hides #REF! structural bugs ✗</div>
            </div>
            <span style={{fontFamily: MONO, fontSize: 28, color: C.text, fontWeight: 700}}>vs</span>
            {/* IFNA (good) */}
            <div style={{background: C.card, border: `2.5px solid ${C.purple}`, borderRadius: 12, padding: '12px 28px', boxShadow: `0 0 0 6px ${C.purple}22, 0 0 30px ${C.purple}44`}}>
              <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 4}}>Targeted wrapping:</div>
              <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.purple}}>IFNA(formula, "Not Found")</div>
              <div style={{fontFamily: MONO, fontSize: 14, color: C.purple, marginTop: 4}}>catches #N/A only, exposes #REF! ✓</div>
            </div>
          </div>
        </div>
      ) : null}

      <TopBadge text="Modern Error Audit ──► #SPILL! (Blocked) & #CALC! (Empty Array) & #REF! (Deleted)" from={t(86.0)} to={t(115.0)} />
      {comparisonP < 0.01 ? <Caption text="Modern Error Audit ──► #SPILL! (Blocked Array Path) & #CALC! (Empty Dynamic Array Result)" from={t(86.0)} to={t(110.0)} tone="danger" /> : null}
      {comparisonP > 0.01 ? <Caption text="Safe Error Handling ──► Prefer IFNA Over Blind IFERROR to Avoid Hiding Structural Bug (#REF!)" from={t(115.0)} to={t(129.0)} /> : null}
    </Stage>
  );
};
