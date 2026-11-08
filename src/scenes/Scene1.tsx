import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {PRODUCT_EXPANDED_COUNT, PRODUCT_INITIAL_COUNT, productCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC01: SEQUENCE — typed formula → numbers 1001..1100 spill → auto-expand with COUNTA.
// Single Excel window (no split screen). The formula bar shows the typed formula.
const S = START.s1;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 120, 220][c] ?? XL.colW;
const FORMULA = '=SEQUENCE(COUNTA(B2:B100), 1, 1001, 1)';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 280, fy: 260, z: 1.12}, prog(f, t(2), 30));

  // Typing animation in formula bar (3s to 11s)
  const typedFormula = typed(FORMULA, f, t(3.0), 1.2);
  const typingDone = f >= t(11.0);

  // Spill progress: numbers fill A2 downward (11.5s onwards)
  const spillP = typingDone ? prog(f, t(11.5), 18) : 0;
  const filledRows = Math.floor(spillP * PRODUCT_INITIAL_COUNT);

  // Auto-expand: at 25s, more products appear in column B → SEQUENCE auto-expands
  const expanded = f >= t(25);
  const expandP = expanded ? prog(f, t(25), 14) : 0;

  // fbEdit mode (blinking cursor while typing)
  const fbEdit = f >= t(3.0) && f < t(11.5);

  // Cursor path: A2 → formula bar → B2:B100 select → Enter
  const a2 = cellCenter(2, 1, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const b2 = cellCenter(2, 2, {colW});
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(2.5), x: a2.x, y: a2.y},
    {f: t(3.0), x: 200, y: fbY},
    {f: t(13.0), x: b2.x, y: b2.y},
    {f: t(14.0), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [2.5, 3.0, 11.0];
  const curHide = f > t(14.5);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  const g0 = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Sequence_Generator.xlsx" nameBox={typingDone ? 'A2' : 'A1'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Column A: spilled SEQUENCE numbers
            if (c === 1) {
              if (r === 1) return {t: 'OrderID', b: true, bg: '#E2EFDA', al: 'l'};
              const count = expanded ? PRODUCT_EXPANDED_COUNT : PRODUCT_INITIAL_COUNT;
              if (r < 2 || r > count + 1) return undefined;
              const visibleCount = expanded ? count : Math.min(filledRows, count);
              if (r - 1 <= visibleCount) {
                return {t: String(1000 + r - 1), color: '#107C41'};
              }
              return undefined;
            }
            // Column B: products
            return productCell(r, c, {expanded}) as any;
          }} colW={colW}
          sel={{r1: 2, c1: 1, r2: 2, c2: 1}} active={typingDone ? {r: 2, c: 1} : {r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Spill border on column A (rows 2..count+1) */}
          {spillP > 0.05 ? (
            <Neon
              x={cellCenter(2, 1, {colW}).x - colW(1) / 2}
              y={cellCenter(2, 1, {colW}).y - XL.rowH / 2}
              w={colW(1)}
              h={XL.rowH * (expanded ? PRODUCT_EXPANDED_COUNT : PRODUCT_INITIAL_COUNT)}
              color={expanded ? C.green : C.blue}
              p={spillP * (1 - prog(f, t(40), 12))}
              label={expanded ? 'Auto-expanded (COUNTA)' : 'SEQUENCE spill'}
              labelBelow
            />
          ) : null}
          {/* COUNTA highlight on B2:B100 during typing */}
          {fbEdit ? (
            <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={g0.rowsTop} w={colW(2)} h={g0.rowsBottom - g0.rowsTop} color={C.amber} p={0.3} label="COUNTA range" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Parameter blocks at bottom */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(2), 12) * (1 - prog(f, t(40), 12)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '10px 18px'}}>
          <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.text}}>=SEQUENCE(</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.blue, background: `${C.blue}22`, border: `1.5px solid ${C.blue}`, borderRadius: 6, padding: '4px 10px'}}>rows: COUNTA(B2:B100)</span>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.amber, background: `${C.amber}22`, border: `1.5px solid ${C.amber}`, borderRadius: 6, padding: '4px 10px'}}>cols: 1</span>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.green, background: `${C.green}22`, border: `1.5px solid ${C.green}`, borderRadius: 6, padding: '4px 10px'}}>start: 1001</span>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.purple, background: `${C.purple}22`, border: `1.5px solid ${C.purple}`, borderRadius: 6, padding: '4px 10px'}}>step: 1</span>
          <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.text}}>)</span>
        </div>
      </div>

      {/* Lesson counter */}
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 19 من 76 · الوحدة 4 من 14</div>
      </div>

      <TopBadge text="الدرس 19 من 76 | الوحدة 4 من 14 ──► Dynamic Generation & LET Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="SEQUENCE Mechanics ──► =SEQUENCE(rows, [columns], [start], [step]) — Auto-Expanding IDs" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
