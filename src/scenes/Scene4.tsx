import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {FLAT_TABLE} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC04: Master Formula Unpivoting Pipeline — =HSTACK(TOCOL(IDs), TOCOL(Headers), TOCOL(Values)).
// Single Excel window. Typed formula builds a flat table from 3 TOCOL streams.
const S = START.s4;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 160, 120, 120][c] ?? XL.colW;
const FORMULA = '=HSTACK(TOCOL(A2:A5), TOCOL(B1:E1, 1), TOCOL(B2:E5, 1))';

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 260, z: 1.1}, prog(f, t(2), 30));

  // Typing the master formula (131-145s)
  const typedFormula = typed(FORMULA, f, t(131), 1.1);
  const typingDone = f >= t(145);
  const fbEdit = f >= t(131) && f < t(145.5);

  // Spill progress: 3 streams fill simultaneously
  const spillP = typingDone ? prog(f, t(146), 18) : 0;
  const filledRows = Math.floor(spillP * FLAT_TABLE.length);

  // Stream highlights (each TOCOL arm)
  const stream1P = prog(f, t(134), 12) * (1 - prog(f, t(170), 12)); // IDs (blue)
  const stream2P = prog(f, t(137), 12) * (1 - prog(f, t(170), 12)); // Headers (amber)
  const stream3P = prog(f, t(140), 12) * (1 - prog(f, t(170), 12)); // Values (green)

  // Cursor: formula bar → Enter
  const fbY = geo(1, 0, 1).fbTop + 14;
  const g2 = cellCenter(2, 7, {colW}); // result cell G2
  const pts = dwell([
    {f: t(131), x: 200, y: fbY},
    {f: t(145), x: g2.x, y: g2.y},
    {f: t(147), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [145];
  const curHide = f > t(148);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Pipeline.xlsx" nameBox="G2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Result table G2:I5 (columns 7-9)
            if (c >= 7 && c <= 9) {
              if (r === 1) return undefined;
              const idx = r - 2;
              if (idx < FLAT_TABLE.length && idx < filledRows) {
                const row = FLAT_TABLE[idx];
                if (c === 7) return {t: row.product, color: '#107C41'};
                if (c === 8) return {t: row.attribute, color: '#107C41'};
                if (c === 9) return {t: row.value.toLocaleString('en-US'), al: 'r', color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 7, r2: 2, c2: 7}} active={{r: 2, c: 7}}
          thumb={0} thumbSize={0.55}
        >
          {/* 3 stream highlights */}
          <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7)} h={XL.rowH * FLAT_TABLE.length} color={C.blue} p={stream1P * 0.3} label="Stream 1: IDs" labelBelow />
          <Neon x={cellCenter(2, 8, {colW}).x - colW(8) / 2} y={cellCenter(2, 8, {colW}).y - XL.rowH / 2} w={colW(8)} h={XL.rowH * FLAT_TABLE.length} color={C.amber} p={stream2P * 0.3} label="Stream 2: Headers" labelBelow />
          <Neon x={cellCenter(2, 9, {colW}).x - colW(9) / 2} y={cellCenter(2, 9, {colW}).y - XL.rowH / 2} w={colW(9)} h={XL.rowH * FLAT_TABLE.length} color={C.green} p={stream3P * 0.3} label="Stream 3: Values" labelBelow />
          {/* Spill border on full result */}
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 7, {colW}).x - colW(7) / 2} y={cellCenter(2, 7, {colW}).y - XL.rowH / 2} w={colW(7) + colW(8) + colW(9)} h={XL.rowH * FLAT_TABLE.length} color={C.green} p={spillP * (1 - prog(f, t(170), 12))} label="HSTACK unpivoted flat table" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* 3 stream badges at bottom */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', gap: 12, opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{background: `${C.blue}22`, border: `1.5px solid ${C.blue}`, borderRadius: 8, padding: '8px 14px', boxShadow: stream1P > 0.1 ? `0 0 ${14 * stream1P}px ${C.blue}88` : 'none', opacity: 0.4 + 0.6 * stream1P}}>
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue}}>TOCOL(IDs)</div>
        </div>
        <div style={{background: `${C.amber}22`, border: `1.5px solid ${C.amber}`, borderRadius: 8, padding: '8px 14px', boxShadow: stream2P > 0.1 ? `0 0 ${14 * stream2P}px ${C.amber}88` : 'none', opacity: 0.4 + 0.6 * stream2P}}>
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.amber}}>TOCOL(Headers)</div>
        </div>
        <div style={{background: `${C.green}22`, border: `1.5px solid ${C.green}`, borderRadius: 8, padding: '8px 14px', boxShadow: stream3P > 0.1 ? `0 0 ${14 * stream3P}px ${C.green}88` : 'none', opacity: 0.4 + 0.6 * stream3P}}>
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>TOCOL(Values)</div>
        </div>
      </div>

      <TopBadge text="Formula-Based Unpivoting ──► =HSTACK(TOCOL(IDs), TOCOL(Headers), TOCOL(Values))" from={t(131.0)} to={t(150.0)} />
      {spillP < 0.3 ? <Caption text="Live Unpivoting ──► Instant Formula-Driven Unpivoting Engine with Zero Manual Power Query Refresh" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
