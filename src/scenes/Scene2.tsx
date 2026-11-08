import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {RAND_GRID} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC02: RANDARRAY — typed formula → 10x4 random integer grid pops into existence.
// Single Excel window (no split). Numbers appear cell-by-cell in a wave.
const S = START.s2;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 100, 100, 100, 100, 110][c] ?? XL.colW;
const FORMULA = '=RANDARRAY(10, 4, 100, 500, TRUE)';

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 240, z: 1.18}, prog(f, t(2), 30));

  const typedFormula = typed(FORMULA, f, t(42), 1.3);
  const typingDone = f >= t(51);
  const fbEdit = f >= t(42) && f < t(51);

  // Random array pop: cells fill in a diagonal wave (45s onwards)
  const popP = typingDone ? prog(f, t(51), 22) : 0;
  // Each cell (r,c) appears when wave reaches it (diagonal sweep)
  const cellVisible = (r: number, c: number) => {
    if (popP <= 0) return false;
    const delay = ((r - 2) + (c - 2)) / 14; // 0..~1.3
    return popP > delay;
  };

  // Cursor: B2 → formula bar → Enter
  const b2 = cellCenter(2, 2, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([
    {f: t(41), x: 900, y: 330},
    {f: t(42), x: 200, y: fbY},
    {f: t(51), x: b2.x, y: b2.y},
    {f: t(53), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [42, 51];
  const curHide = f > t(53.5);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Simulation_Grid.xlsx" nameBox={typingDone ? 'B2' : 'A1'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (r === 1 && c >= 2 && c <= 5) {
              return {t: 'Col ' + (c - 1), b: true, bg: '#FEF3C7', al: 'c', color: '#92400E'};
            }
            if (r >= 2 && r <= 11 && c >= 2 && c <= 5) {
              if (cellVisible(r, c)) {
                const val = RAND_GRID[r - 2][c - 2];
                return {t: String(val), al: 'c', color: '#92400E'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 2, r2: 2, c2: 2}} active={typingDone ? {r: 2, c: 2} : {r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Spill border around the 10x4 random grid */}
          {popP > 0.05 ? (
            <Neon
              x={cellCenter(2, 2, {colW}).x - colW(2) / 2}
              y={cellCenter(2, 2, {colW}).y - XL.rowH / 2}
              w={colW(2) + colW(3) + colW(4) + colW(5)}
              h={XL.rowH * 10}
              color={C.amber}
              p={popP * (1 - prog(f, t(85), 12))}
              label="10×4 Random Integer Grid"
              labelBelow
            />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Parameter blocks at bottom */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(42), 12) * (1 - prog(f, t(85), 12)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '10px 16px', flexWrap: 'wrap', justifyContent: 'center'}}>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.text}}>=RANDARRAY(</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue, background: `${C.blue}22`, border: `1.5px solid ${C.blue}`, borderRadius: 6, padding: '4px 8px'}}>rows: 10</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue, background: `${C.blue}22`, border: `1.5px solid ${C.blue}`, borderRadius: 6, padding: '4px 8px'}}>cols: 4</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.amber, background: `${C.amber}22`, border: `1.5px solid ${C.amber}`, borderRadius: 6, padding: '4px 8px'}}>min: 100</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.amber, background: `${C.amber}22`, border: `1.5px solid ${C.amber}`, borderRadius: 6, padding: '4px 8px'}}>max: 500</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>,</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.cyan, background: `${C.cyan}22`, border: `1.5px solid ${C.cyan}`, borderRadius: 6, padding: '4px 8px'}}>whole_num: TRUE</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.text}}>)</span>
        </div>
      </div>

      {/* Stress testing badge (when grid is populated) */}
      {popP > 0.5 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: clamp((popP - 0.5) * 2) * (1 - prog(f, t(85), 12))}}>
          <div style={{background: C.card, border: `2.5px solid ${C.cyan}`, borderRadius: 14, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.cyan}22, 0 0 30px ${C.cyan}44`, display: 'flex', alignItems: 'center', gap: 14}}>
            <svg width={30} height={30} viewBox="0 0 30 30"><circle cx={15} cy={15} r={13} fill="none" stroke={C.cyan} strokeWidth={2.5} /><path d="M15 8v7l5 3" fill="none" stroke={C.cyan} strokeWidth={2.5} strokeLinecap="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.cyan}}>Stress Testing ──► 40 random integers generated instantly for simulation</span>
          </div>
        </div>
      ) : null}

      <TopBadge text="RANDARRAY Mechanics ──► =RANDARRAY([rows], [cols], [min], [max], [whole_num])" from={t(42.0)} to={t(60.0)} />
      {popP < 0.5 ? <Caption text="Stress Testing ──► Instantly Generates Random Simulation Data Across Grids" from={t(60.0)} to={t(84.0)} /> : null}
    </Stage>
  );
};
