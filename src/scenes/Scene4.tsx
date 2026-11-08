import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC04: Static Tools vs Dynamic Arrays — single Excel window (NO split screen).
// Phase 1 (130-145s): Static Flash Fill — user typed "Ahmed" before, now adds new row at bottom.
//   The Flash Fill result column does NOT update → red X on the empty cell.
// Phase 2 (145-170s): Switch to =TEXTSPLIT(A2, ",") / =UNIQUE(B2:B100)# — when new row added, dynamic formula auto-expands → green ✓.
// The transformation happens on the SAME grid, showing the architectural difference.
const S = START.s4;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 240, 160][c] ?? XL.colW;

// Source data grows: 3 rows initially, +1 new row added at 140s (static phase) and again at 150s (dynamic phase)
const INITIAL_ROWS = ['Ahmed Ali - Cairo', 'Sara Mohamed - Giza', 'Omar Ibrahim - Cairo'];
const FIRST_NAMES = ['Ahmed', 'Sara', 'Omar'];
const NEW_ROW = 'Mona Saleh - Dokki';
const NEW_FIRST = 'Mona';

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 320, fy: 260, z: 1.12}, prog(f, t(2), 30));

  // Phase 1: static (130-148s). Phase 2: dynamic (148-170s).
  const phase = f < t(148) ? 'static' : 'dynamic';
  const staticNewRow = f >= t(140);
  const staticFailP = staticNewRow ? prog(f, t(141), 12) : 0;

  const dynamicNewRow = f >= t(150);
  const dynamicExpandP = dynamicNewRow ? prog(f, t(151), 12) : 0;

  // Formula display
  const formula = phase === 'dynamic' ? typed('=TEXTSPLIT(A2, "-")', f, t(148), 1.5) : '';
  const typingDone = f >= t(154);
  const fbEdit = phase === 'dynamic' && f >= t(148) && f < t(155);

  // Cursor: type formula in B2 (dynamic phase), press Enter
  const b2 = cellCenter(2, 2, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const a5 = cellCenter(5, 1, {colW}); // new row position
  const pts = dwell([
    {f: t(131), x: a5.x, y: a5.y},       // click A5 to add new row (static phase)
    {f: t(140), x: a5.x, y: a5.y},       // type new data
    {f: t(148), x: 200, y: fbY},         // formula bar (switch to dynamic)
    {f: t(155), x: b2.x, y: b2.y},       // Enter on B2
    {f: t(157), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [131, 148, 155];
  const curHide = f > t(158);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="StaticVsDynamic.xlsx" nameBox={phase === 'dynamic' && typingDone ? 'B2' : 'A1'} formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (r === 1) {
              if (c < 1 || c > 2) return undefined;
              return {t: c === 1 ? 'Source' : phase === 'dynamic' ? 'TEXTSPLIT result' : 'Flash Fill (static)', b: true, bg: phase === 'dynamic' ? '#D1FAE5' : '#E2EFDA', al: 'l', color: phase === 'dynamic' ? '#107C41' : undefined};
            }
            // Column A: source data
            if (c === 1) {
              const allRows = (staticNewRow || dynamicNewRow) ? [...INITIAL_ROWS, NEW_ROW] : INITIAL_ROWS;
              const idx = r - 2;
              if (idx < 0 || idx >= allRows.length) return undefined;
              const isNew = idx === allRows.length - 1 && (staticNewRow || dynamicNewRow);
              return {t: allRows[idx], color: isNew ? '#92400E' : undefined, bg: isNew ? '#FEF3C7' : undefined};
            }
            // Column B: result
            if (c === 2) {
              const allNames = (staticNewRow || dynamicNewRow) ? [...FIRST_NAMES, NEW_FIRST] : FIRST_NAMES;
              const idx = r - 2;
              if (idx < 0 || idx >= allNames.length) return undefined;
              if (phase === 'static') {
                // Static: first 3 filled, new row (idx 3) empty → fail
                if (idx < 3) return {t: allNames[idx], color: '#92400E'};
                if (idx === 3 && staticFailP > 0) return undefined; // empty (Flash Fill didn't update)
                return undefined;
              }
              // Dynamic: all rows filled including new one
              return {t: allNames[idx], color: '#107C41'};
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 2, r2: 2, c2: 2}} active={typingDone ? {r: 2, c: 2} : {r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Red X on the empty static result cell (B5 — idx 3) */}
          {phase === 'static' && staticFailP > 0 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
              <circle cx={cellCenter(5, 2, {colW}).x} cy={cellCenter(5, 2, {colW}).y} r={16} fill="none" stroke={C.red} strokeWidth={3} opacity={staticFailP} />
              <line x1={cellCenter(5, 2, {colW}).x - 10} y1={cellCenter(5, 2, {colW}).y - 10} x2={cellCenter(5, 2, {colW}).x + 10} y2={cellCenter(5, 2, {colW}).y + 10} stroke={C.red} strokeWidth={3} opacity={staticFailP} />
              <line x1={cellCenter(5, 2, {colW}).x + 10} y1={cellCenter(5, 2, {colW}).y - 10} x2={cellCenter(5, 2, {colW}).x - 10} y2={cellCenter(5, 2, {colW}).y + 10} stroke={C.red} strokeWidth={3} opacity={staticFailP} />
            </svg>
          ) : null}
          {/* Green check on dynamic expanded cell */}
          {phase === 'dynamic' && dynamicExpandP > 0 ? (
            <Neon x={cellCenter(5, 2, {colW}).x - colW(2) / 2} y={cellCenter(5, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH} color={C.green} p={dynamicExpandP} label="Auto-expanded ✓" labelBelow />
          ) : null}
          {/* Spill border on column B (dynamic) */}
          {phase === 'dynamic' && typingDone ? (
            <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={cellCenter(2, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH * (dynamicNewRow ? 4 : 3)} color={C.blue} p={prog(f, t(155), 12) * 0.4 * (1 - prog(f, t(170), 12))} label="TEXTSPLIT spill" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase === 'dynamic' && c >= 148 ? C.green : C.red} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Bottom comparison badge */}
      {phase === 'static' && staticFailP > 0.3 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: staticFailP * (1 - prog(f, t(148), 8))}}>
          <div style={{background: C.card, border: `2.5px solid ${C.red}`, borderRadius: 14, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.red}22`, display: 'flex', alignItems: 'center', gap: 14}}>
            <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.red}}>Static Tools ──► One-time cleanup, ZERO auto-refresh on new data</span>
          </div>
        </div>
      ) : null}
      {phase === 'dynamic' && dynamicExpandP > 0.3 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: dynamicExpandP * (1 - prog(f, t(170), 12))}}>
          <div style={{background: C.card, border: `2.5px solid ${C.green}`, borderRadius: 14, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.green}22, 0 0 30px ${C.green}44`, display: 'flex', alignItems: 'center', gap: 14}}>
            <svg width={28} height={28} viewBox="0 0 28 28"><polyline points="6,14 12,20 22,8" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.green}}>Dynamic Formulas ──► Auto-updating pipelines for live models</span>
          </div>
        </div>
      ) : null}

      <TopBadge text="Architectural Comparison ──► Static Tools vs Dynamic Array Formulas" from={t(131.0)} to={t(150.0)} />
      {phase === 'static' && staticFailP < 0.3 ? <Caption text="Static Tools (Flash Fill / Remove Dupes) ──► One-time Cleanup, Zero Auto-Refresh" from={t(131.0)} to={t(145.0)} tone="danger" /> : null}
      {phase === 'dynamic' && dynamicExpandP < 0.3 ? <Caption text="Dynamic Formulas (TEXTSPLIT / UNIQUE#) ──► Auto-Updating Pipelines for Live Models" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
