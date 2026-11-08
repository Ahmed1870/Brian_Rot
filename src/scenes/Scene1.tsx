import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {FIRST_NAMES, MERGED_NAMES} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, KeyBadge, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC01: Flash Fill — user types "Ahmed" in B2, presses Ctrl+E, names flash-fill down column B.
// Single Excel window (no split). Real interaction: typing + key press + flash fill sweep.
const S = START.s1;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 240, 160][c] ?? XL.colW;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 240, z: 1.15}, prog(f, t(2), 30));

  // Phase 0 (0-3s): show merged names in column A
  // Phase 1 (3-6s): user types "Ahmed" in B2 (typing animation)
  // Phase 2 (6s): user presses Ctrl+E → Flash Fill sweep fills B3:B9
  // Phase 3 (6-40s): result stable
  const typedName = typed('Ahmed', f, t(3.0), 0.6);
  const typingDone = f >= t(6.0);
  const flashP = typingDone ? prog(f, t(6.5), 16) : 0;
  const filledRows = typingDone ? Math.floor(flashP * (MERGED_NAMES.length - 1)) + 1 : 0;

  // fbEdit while typing
  const fbEdit = f >= t(3.0) && f < t(6.5);
  const formula = fbEdit ? '' : (typingDone ? 'Ahmed' : '');

  // Cursor: B2 → type → press Enter → Ctrl+E (key badge)
  const b2 = cellCenter(2, 2, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(3.0), x: b2.x, y: b2.y},   // click B2 to select
    {f: t(6.0), x: b2.x, y: b2.y},   // press Enter
    {f: t(8.0), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [3.0, 6.0];
  const curHide = f > t(8.5);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  // KeyBadge for Ctrl+E (appears at 6s, fades after)
  const keyP = prog(f, t(6.0), 8) * (1 - prog(f, t(8.0), 8));

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="FlashFill.xlsx" nameBox="B2" formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (r === 1) {
              if (c < 1 || c > 2) return undefined;
              return {t: c === 1 ? 'Merged Name' : 'First Name', b: true, bg: '#E2EFDA', al: 'l'};
            }
            if (r < 2 || r > MERGED_NAMES.length + 1) return undefined;
            if (c === 1) return {t: MERGED_NAMES[r - 2]};
            if (c === 2) {
              if (r === 2) return {t: typedName, color: '#107C41'};
              if (r - 2 <= filledRows - 1) return {t: FIRST_NAMES[r - 2], color: '#107C41'};
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 2, r2: 2, c2: 2}} active={{r: 2, c: 2}}
          thumb={0} thumbSize={0.55}
        >
          {/* Flash Fill lightning sweep on column B */}
          {flashP > 0 && flashP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
              <line x1={cellCenter(1, 2, {colW}).x} y1={geo(1, 0, 1).rowsTop} x2={cellCenter(1, 2, {colW}).x} y2={geo(1, 0, 1).rowsTop + (geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop) * flashP} stroke={C.blue} strokeWidth={4} strokeDasharray="6 3" opacity={0.9} />
              <circle cx={cellCenter(1, 2, {colW}).x} cy={geo(1, 0, 1).rowsTop + (geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop) * flashP} r={8} fill={C.blue} opacity={0.95} />
            </svg>
          ) : null}
          {/* Spill border on column B (result column) */}
          {typingDone ? (
            <Neon x={cellCenter(2, 2, {colW}).x - colW(2) / 2} y={cellCenter(2, 2, {colW}).y - XL.rowH / 2} w={colW(2)} h={XL.rowH * MERGED_NAMES.length} color={C.green} p={flashP * (1 - prog(f, t(40), 12))} label="Flash Fill result" labelBelow />
          ) : null}
          {/* Source column highlight */}
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1)} h={geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop} color={C.amber} p={prog(f, t(2), 12) * 0.3 * (1 - prog(f, t(40), 12))} label="Source" labelBelow />
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Ctrl+E key badge */}
      <KeyBadge keys={['Ctrl', 'E']} p={keyP} color={C.blue} left={1330} top={80} />

      {/* Lesson counter */}
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 24 من 76 · الوحدة 5 من 14</div>
      </div>

      <TopBadge text="الدرس 24 من 76 | الوحدة 5 من 14 ──► Rapid Data Hygiene Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Flash Fill Shortcut ──► Ctrl + E (Pattern Recognition without Formulas)" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
