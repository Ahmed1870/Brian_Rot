import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {PIPELINE_INPUT, PIPELINE_RESULT} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s4;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 300, 30, 200][c] ?? XL.colW;
const FORMULA = '=TEXTJOIN(" | ",TRUE,TEXTBEFORE(TEXTSPLIT(A2,","),"-"))';

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 260, z: 1.05}, prog(f, t(2), 30));
  const typedFormula = typed(FORMULA, f, t(131), 0.8);
  const typingDone = f >= t(142);
  const resultP = typingDone ? prog(f, t(142.5), 14) : 0;
  const fbEdit = f >= t(131) && f < t(142.5);

  const fbY = geo(1, 0, 1).fbTop + 14;
  const c2 = cellCenter(2, 3, {colW});
  const pts = dwell([{f: t(131), x: 200, y: fbY}, {f: t(142), x: c2.x, y: c2.y}, {f: t(144), x: 900, y: 330}]);
  const cur = track(f, pts);
  const clicks = [142];
  const curHide = f > t(145);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Pipeline.xlsx" nameBox="C2" formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c === 1) {
              if (r === 1) return {t: 'Combined Codes', b: true, bg: '#E2EFDA', al: 'l'};
              if (r === 2) return {t: PIPELINE_INPUT};
              return undefined;
            }
            if (c === 3) {
              if (r === 1) return {t: 'Pipeline Result', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
              if (r === 2 && resultP > 0.3) {
                return {t: PIPELINE_RESULT, color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 3, r2: 2, c2: 3}} active={{r: 2, c: 3}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={cellCenter(2, 1, {colW}).y - XL.rowH / 2} w={colW(1)} h={XL.rowH} color={C.amber} p={0.2} label="Source: comma-separated codes" labelBelow />
          {resultP > 0.05 ? <Neon x={cellCenter(2, 3, {colW}).x - colW(3) / 2} y={cellCenter(2, 3, {colW}).y - XL.rowH / 2} w={colW(3)} h={XL.rowH} color={C.green} p={resultP * (1 - prog(f, t(170), 12))} label="=TEXTJOIN(...,TEXTBEFORE(TEXTSPLIT(...)))" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(131), 12) * (1 - prog(f, t(170), 12)))}}>
        <div style={{display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 16px'}}>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.blue}}>TEXTSPLIT</span>
          <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>→</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.purple}}>TEXTBEFORE</span>
          <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>→</span>
          <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green}}>TEXTJOIN</span>
          <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>= parse + extract + recombine</span>
        </div>
      </div>
      <TopBadge text="Master Text Pipeline ──► =TEXTJOIN('|', TRUE, TEXTBEFORE(TEXTSPLIT(...), '-'))" from={t(131.0)} to={t(150.0)} />
      {resultP > 0.3 ? <Caption text="Dynamic Text Engineering ──► Parses, Filters, Extracts & Recombines Text in 1 Cell" from={t(150.0)} to={t(169.0)} tone="ok" /> : null}
    </Stage>
  );
};
