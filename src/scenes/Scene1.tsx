import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {EXACTLY_ONCE_CUSTOMERS, SALES, UNIQUE_CUSTOMERS, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC01: UNIQUE Function — typed formula + Enter + spill.
// The user clicks F2, types =UNIQUE(B2:B10, FALSE, TRUE) in the formula bar,
// presses Enter, and the one-time buyers spill into F2:F4.
const S = START.s1;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 110, 130, 130, 110, 160][c] ?? XL.colW;

// Full formula text
const FORMULA = '=UNIQUE(B2:B10, FALSE, TRUE)';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 500, fy: 260, z: 1.12}, prog(f, t(2), 30));

  // Typing animation in the formula bar (3s to 11s)
  const typedFormula = typed(FORMULA, f, t(3.0), 1.2);
  const typingDone = f >= t(11.0);

  // Enter press → results spill (11s)
  const spillP = typingDone ? prog(f, t(11.5), 16) : 0;
  const showResults = spillP > 0.05;

  // Formula bar edit mode (shows blinking cursor while typing)
  const fbEdit = f >= t(3.0) && f < t(11.5);

  // Selection highlight on B2:B10 during typing (when typing B2:B10 part)
  const selStart = f >= t(5.0) && f < t(11.5);

  // Result cells (F2:F4 = exactly_once customers)
  const resultNeon = showResults ? prog(f, t(12), 14) * (1 - prog(f, t(40), 12)) : 0;

  // Highlight exactly_once parameter when mentioned (6-18s)
  const exactlyOnceNeon = prog(f, t(6.0), 12) * (1 - prog(f, t(18), 12));

  // Cursor path: F2 → formula bar → B2 → B10 (drag select) → Enter
  const f2 = cellCenter(2, 6, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const b2 = cellCenter(2, 2, {colW});
  const b10 = cellCenter(10, 2, {colW});
  const f2Cell = cellCenter(2, 6, {colW});

  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(2.5), x: f2.x, y: f2.y},
    {f: t(3.0), x: 200, y: fbY},   // click formula bar
    {f: t(5.0), x: b2.x, y: b2.y}, // select B2
    {f: t(7.0), x: b10.x, y: b10.y}, // drag to B10
    {f: t(11.0), x: 200, y: fbY},  // back to formula bar
    {f: t(11.5), x: f2Cell.x, y: f2Cell.y}, // Enter on F2
    {f: t(13.0), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [2.5, 3.0, 5.0, 11.5];
  const curHide = f > t(13.5);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  // Selection rect on B2:B10
  const g0 = geo(1, 0, 1);
  const selRect = selStart ? {r1: 2, c1: 2, r2: 10, c2: 2} : {r1: 2, c1: 6, r2: 2, c2: 6};

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="tbl_Sales.xlsx" nameBox={typingDone ? 'F2' : 'A1'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Column F (c=6): spill results after Enter
            if (c === 6 && r >= 2 && r <= 4 && showResults) {
              const idx = r - 2;
              if (idx < EXACTLY_ONCE_CUSTOMERS.length) {
                return {t: EXACTLY_ONCE_CUSTOMERS[idx], color: '#107C41'};
              }
            }
            return salesCell(r, c) as any;
          }} colW={colW}
          sel={selRect} active={typingDone ? {r: 2, c: 6} : {r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Neon highlight on lookup range B2:B10 during formula typing */}
          <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={g0.rowsTop} w={colW(2)} h={(cellCenter(10, 2, {colW}).y + XL.rowH / 2) - g0.rowsTop} color={C.blue} p={selStart ? 0.4 : 0} label="array (B2:B10)" labelBelow />
          {/* Neon on result cells F2:F4 */}
          <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6)} h={XL.rowH * 3} color={C.green} p={resultNeon} label="exactly_once result" labelBelow />
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Formula parameter blocks at bottom (educational overlay) */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(2), 12) * (1 - prog(f, t(40), 12)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '10px 18px'}}>
          <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.text}}>=UNIQUE(</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.blue, background: `${C.blue}22`, border: `1.5px solid ${C.blue}`, borderRadius: 6, padding: '4px 10px'}}>array: B2:B10</span>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.amber, background: `${C.amber}22`, border: `1.5px solid ${C.amber}`, borderRadius: 6, padding: '4px 10px'}}>by_col: FALSE</span>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.purple, background: `${C.purple}22`, border: `1.5px solid ${C.purple}`, borderRadius: 6, padding: '4px 10px', boxShadow: exactlyOnceNeon > 0.1 ? `0 0 ${16 * exactlyOnceNeon}px ${C.purple}88` : 'none'}}>exactly_once: TRUE</span>
          <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.text}}>)</span>
        </div>
      </div>

      {/* Lesson counter (top-right) */}
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 17 من 76 · الوحدة 4 من 14</div>
      </div>

      <TopBadge text="الدرس 17 من 76 | الوحدة 4 من 14 ──► Dynamic Deduplication Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="UNIQUE Mechanics ──► =UNIQUE(array, [by_col], [exactly_once]) — Type in Cell, Press Enter, Spill" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
