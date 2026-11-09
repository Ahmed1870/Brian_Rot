import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BOOLEAN_MASK_AND, FILTER_AND, SALES_RAW, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

const S = START.s2;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 90, 110, 100, 30, 60, 60, 60][c] ?? XL.colW;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 460, fy: 280, z: 0.92}, prog(f, t(2), 30));
  const typedFormula = typed('(B:B="Cairo") * (D:D>5000)', f, t(42), 1.2);
  const typingDone = f >= t(50);
  const maskP = typingDone ? prog(f, t(50.5), 18) : 0;
  const spillP = prog(f, t(65), 16) * (1 - prog(f, t(85), 12));
  const filledRows = Math.floor(spillP * FILTER_AND.length);
  const fbEdit = f >= t(42) && f < t(50.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([
    {f: t(42), x: 200, y: fbY},
    {f: t(50), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [42];
  const curHide = f > t(51);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Boolean.xlsx" nameBox="A1" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 11) return salesCell(r, c) as any;
            if (c >= 6 && c <= 8 && r <= 11) {
              if (r === 1) {
                const h = ['Cond1', 'Cond2', 'Result'];
                const colors = [C.blue, C.amber, C.green];
                return {t: h[c - 6], b: true, bg: '#1E293B', al: 'c', color: colors[c - 6]};
              }
              const idx = r - 2;
              if (idx < BOOLEAN_MASK_AND.length) {
                const mask = BOOLEAN_MASK_AND[idx];
                const val = c === 6 ? mask.cond1 : c === 7 ? mask.cond2 : mask.result;
                const showP = c === 6 ? maskP : c === 7 ? Math.max(0, maskP - 0.15) : Math.max(0, maskP - 0.3);
                if (showP > idx / 12) {
                  const color = val === 1 ? C.green : C.red;
                  return {t: String(val), al: 'c', color, bg: val === 1 ? `${C.green}11` : `${C.red}11`};
                }
                return undefined;
              }
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 6, {colW}).x - colW(6) / 2} y={geo(1, 0, 1).rowsTop} w={colW(6) + colW(7) + colW(8)} h={XL.rowH * 11} color={C.green} p={maskP * 0.3} label="Boolean Mask (1=keep, 0=hide)" labelBelow />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(42), 12) * (1 - prog(f, t(85), 12)))}}>
        <div style={{display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.blue}}>(Branch="Cairo")</span>
          <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.amber}}>*</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.amber}}>(Amount&gt;5000)</span>
          <span style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>=</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.green}}>[1, 0, 1, ...] → AND filter mask</span>
        </div>
      </div>

      <TopBadge text="AND Logic (*) ──► (range1 = cond1) * (range2 = cond2) (Both Must Be TRUE)" from={t(42.0)} to={t(60.0)} />
      {maskP > 0.5 ? <Caption text="Boolean Mask ──► [TRUE, FALSE] * [TRUE, TRUE] = [1, 0] Filter Array Mask" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
