import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {REDUCE_RESULT, SALES_RAW, salesCell} from '../data';
import {CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed} from '../kit';

const S = START.s3;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 100, 80, 100, 90, 30, 110][c] ?? XL.colW;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 380, fy: 260, z: 1.0}, prog(f, t(2), 30));

  // Phase 1: REDUCE formula → single value
  const reduceTyped = typed('=REDUCE(0,D2:D9,LAMBDA(acc,val,acc+val))', f, t(86), 1.0);
  const reduceDone = f >= t(95);
  const reduceP = reduceDone ? prog(f, t(95.5), 14) : 0;
  const fbEdit1 = f >= t(86) && f < t(95.5);

  // Phase 2: VSTACK stacking via REDUCE
  const phase2 = f >= t(100);
  const stackTyped = phase2 ? typed('=REDUCE(A1,A2:A3,LAMBDA(a,v,VSTACK(a,FILTER(D:D,B:B=v))))', f, t(101), 1.0) : '';
  const stackDone = f >= t(110);
  const stackP = stackDone ? prog(f, t(110.5), 14) : 0;
  const fbEdit2 = phase2 && f >= t(101) && f < t(110.5);

  const fbEdit = fbEdit1 || fbEdit2;
  const formula = phase2 ? stackTyped : reduceTyped;

  const fbY = geo(1, 0, 1).fbTop + 14;
  const f2 = cellCenter(2, 6, {colW});
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(95), x: f2.x, y: f2.y},
    {f: t(101), x: 200, y: fbY},
    {f: t(110), x: f2.x, y: f2.y},
    {f: t(112), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [95, 110];
  const curHide = f > t(113);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Reduce.xlsx" nameBox="F2" formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            if (c <= 4 && r <= 9) return salesCell(r, c) as any;
            if (c === 6) {
              if (!phase2) {
                // REDUCE: single result
                if (r === 1) return {t: 'REDUCE Total', b: true, bg: '#D1FAE5', al: 'r', color: '#107C41'};
                if (r === 2 && reduceP > 0.3) {
                  return {t: REDUCE_RESULT.toLocaleString('en-US'), al: 'r', color: '#107C41', b: true};
                }
                return undefined;
              } else {
                // VSTACK: stacked tables (showing 2 blocks)
                if (r === 1) return {t: 'Stacked Tables', b: true, bg: '#FEF3C7', al: 'l', color: '#92400E'};
                // Block 1: Cairo sales
                if (r >= 2 && r <= 4 && stackP > 0.2) {
                  const cairoRows = SALES_RAW.filter((s) => s.branch === 'Cairo').slice(0, 3);
                  const idx = r - 2;
                  if (idx < cairoRows.length) {
                    return {t: `${cairoRows[idx].id} | ${cairoRows[idx].product}`, color: '#92400E'};
                  }
                }
                if (r === 5) return {t: '---', color: C.muted, al: 'c'};
                // Block 2: Giza sales
                if (r >= 6 && r <= 8 && stackP > 0.5) {
                  const gizaRows = SALES_RAW.filter((s) => s.branch === 'Giza').slice(0, 3);
                  const idx = r - 6;
                  if (idx < gizaRows.length) {
                    return {t: `${gizaRows[idx].id} | ${gizaRows[idx].product}`, color: '#92400E'};
                  }
                }
                return undefined;
              }
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 2, c1: 6, r2: 2, c2: 6}} active={{r: 2, c: 6}}
          thumb={0} thumbSize={0.55}
        >
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 9} color={C.amber} p={0.12} label="Source array" labelBelow />
          {!phase2 && reduceP > 0.05 ? <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6)} h={XL.rowH} color={C.purple} p={reduceP * (1 - prog(f, t(100), 8))} label="=REDUCE → single total" labelBelow /> : null}
          {phase2 && stackP > 0.05 ? <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6)} h={XL.rowH * 7} color={C.amber} p={stackP * (1 - prog(f, t(130), 12))} label="REDUCE + VSTACK → stacked tables" labelBelow /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase2 && c >= 100 ? C.amber : C.purple} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(86), 12) * (1 - prog(f, t(130), 12)))}}>
        <div style={{display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          {!phase2 ? <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.purple}}>=REDUCE(0, array, LAMBDA(acc, val, acc + val)) → single result</span> : <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.amber}}>=REDUCE(headers, ranges, LAMBDA(acc, val, VSTACK(acc, ...))) → stacked tables</span>}
        </div>
      </div>

      <TopBadge text="Array Reduction Pattern ──► =REDUCE(0, array, LAMBDA(acc, val, acc + val))" from={t(86.0)} to={t(100.0)} />
      {phase2 ? <Caption text="Dynamic Array Stacking ──► Combines Multiple Spill Arrays via REDUCE & VSTACK" from={t(100.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
