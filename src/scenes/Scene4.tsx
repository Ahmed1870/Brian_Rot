import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Stage, sec} from '../kit';
import {CAM_SHEET, Cells, Ev, RangeFx, Sim, fn, mk, num, picksOf, prog, put, rangeRect, rev} from '../l40';
import {G41, T41, avgB, cntOf, lblHdr, putT41, sumB, sumOf, uniqSorted} from '../l41';

// SC04 anchors (s, abs): 131.5 A10 =A2# | 134.2 B9 =B1# | 136.8-142.8 COUNTIFS | 141.8-146.8 AVERAGEIFS | 150.5 count+avg+sum | 157 KPI matrix
const S = START.s4;
const t = (g: number) => sec(g - S);
const FC = '=COUNTIFS(tbl_Sales[Branch], A10#, tbl_Sales[Category], B9#)';
const FV = '=AVERAGEIFS(tbl_Sales[Amount], tbl_Sales[Branch], A2#)';
const EVS: Ev[] = [
  {r: 10, c: 1, text: '=A2#', start: t(131.6), dur: 40, enter: t(133.4), r2: 13},
  {r: 9, c: 2, text: '=B1#', start: t(134.0), dur: 40, enter: t(135.8), c2: 4},
  {r: 10, c: 2, text: FC, start: t(136.8), dur: sec(6.0), enter: t(143.2), r2: 13, c2: 4},
  {r: 2, c: 6, text: FV, start: t(143.8), dur: sec(4.2), enter: t(148.4), r2: 5},
];
const PICKS = picksOf(EVS, []);
const BR = uniqSorted(T41, 1), CAT = uniqSorted(T41, 2);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const m: Cells = mk();
  put(m, 1, 1, {t: 'Branch', ...lblHdr}); put(m, 1, 6, {t: 'Avg Amount', ...lblHdr, al: 'r'}); put(m, 9, 1, {t: 'Orders', ...lblHdr});
  putT41(m, T41);
  BR.forEach((b, i) => put(m, 2 + i, 1, {t: b}));
  CAT.forEach((c, j) => put(m, 1, 2 + j, {t: c, ...lblHdr, al: 'r'}));
  BR.forEach((b, i) => CAT.forEach((c, j) => put(m, 2 + i, 2 + j, num(sumOf(T41, b, c)))));
  const nA = rev(f, EVS[0].enter, 4, 5), nH = rev(f, EVS[1].enter, 3, 6), nC = rev(f, EVS[2].enter, 12, 3), nV = rev(f, EVS[3].enter, 4, 5);
  for (let i = 0; i < nA; i++) put(m, 10 + i, 1, {t: BR[i]});
  for (let j = 0; j < nH; j++) put(m, 9, 2 + j, {t: CAT[j], ...lblHdr, al: 'r'});
  for (let k = 0; k < nC; k++) { const i = Math.floor(k / 3), j = k % 3; put(m, 10 + i, 2 + j, num(cntOf(T41, BR[i], CAT[j]))); }
  for (let i = 0; i < nV; i++) put(m, 2 + i, 6, num(avgB(T41, BR[i])));
  const lock = prog(f, t(157.0), 12) * (1 - prog(f, t(168.0), 20));
  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="zoom">
      <Sim f={f} cell={fn(m)} evs={EVS} picks={PICKS} geom={G41} cam={CAM_SHEET}>
        <RangeFx rect={rangeRect(10, 2, 13, 4, G41)} color={C.purple} p={prog(f, EVS[2].enter, 8) * (1 - prog(f, t(157.0), 14) * 0.5)} fill={0.14} label="COUNTIFS · order counts" labelBelow />
        <RangeFx rect={rangeRect(2, 6, 5, 6, G41)} color={C.green} p={prog(f, EVS[3].enter, 8) * (1 - prog(f, t(157.0), 14) * 0.5)} fill={0.14} label="AVERAGEIFS" labelBelow />
        <RangeFx rect={rangeRect(2, 2, 5, 4, G41)} color={C.blue} p={prog(f, t(150.6), 10) * (1 - prog(f, t(157.0), 14))} fill={0.1} label="SUMIFS · totals" labelBelow />
        <RangeFx rect={rangeRect(1, 1, 13, 6, G41)} color={C.green} p={lock} fill={0.05} label="KPI matrix: Count · Average · Sum" />
      </Sim>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(131.4), 10) * (1 - prog(f, t(137.0), 10))}}><Chip color={C.purple}>=A2# and =B1# copy the labels</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(143.4), 10) * (1 - prog(f, t(150.0), 10))}}><Chip color={C.purple}>Same A2# / B1# pattern</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(150.6), 10) * (1 - prog(f, t(157.0), 10))}}><Chip color={C.green}>Count + Average + Sum ──► one grid</Chip></div>
      <Caption text="Statistical Spilled Arrays ──► =COUNTIFS(range1, A2#, range2, B1#)" from={t(137.0)} to={t(149.2)} />
      <Caption text="Complete KPI Matrix ──► Count, Average & Sum Dynamic Arrays Together" from={t(157.2)} to={t(168.2)} tone="ok" />
    </Stage>
  );
};
