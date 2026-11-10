import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Stage, TopBadge, sec} from '../kit';
import {CAM0, CAM_SHEET, Cells, Ev, Pick, RangeFx, Sim, camLerp, fn, mk, num, picksOf, prog, put, rangeRect, rev} from '../l40';
import {G41, Legacy, T41, lblHdr, putT41, sumB, uniqSorted} from '../l41';

// SC01 anchors (s, abs): 3.8 A2 =SORT(UNIQUE) | 11.5 click A2 | 22.4-28.2 type SUMIFS | 26.5 "A2#" | 30.3 Enter + spill
const S = START.s1;
const t = (g: number) => sec(g - S);
const F1 = '=SORT(UNIQUE(tbl_Sales[Branch]))';
const F2 = '=SUMIFS(tbl_Sales[Amount], tbl_Sales[Branch], A2#)';
const EVS: Ev[] = [
  {r: 2, c: 1, text: F1, start: t(3.8), dur: sec(2.4), enter: t(6.4), r2: 5},
  {r: 2, c: 2, text: F2, start: t(22.4), dur: sec(5.8), enter: t(30.3), r2: 5},
];
const EXTRA: Pick[] = [{at: t(11.5), r: 2, c: 1, click: true}];
const PICKS = picksOf(EVS, EXTRA);
const BR = uniqSorted(T41, 1);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(2.0), 40));
  const nA = rev(f, EVS[0].enter, 4, 5), nB = rev(f, EVS[1].enter, 4, 6);
  const m: Cells = mk();
  put(m, 1, 1, {t: 'Branch', ...lblHdr}); put(m, 1, 2, {t: 'Total Sales', ...lblHdr, al: 'r'});
  putT41(m, T41);
  for (let i = 0; i < nA; i++) put(m, 2 + i, 1, {t: BR[i]});
  for (let i = 0; i < nB; i++) put(m, 2 + i, 2, num(sumB(T41, BR[i])));
  const legacy = prog(f, t(22.4), 10) * (1 - prog(f, t(26.0), 10));
  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="left">
      <Sim f={f} cell={fn(m)} evs={EVS} picks={PICKS} geom={G41} cam={cam}>
        <RangeFx rect={rangeRect(1, 8, 17, 11, G41)} color={C.amber} p={prog(f, t(1.2), 10) * (1 - prog(f, t(3.0), 10))} fill={0.06} label="tbl_Sales" />
        <RangeFx rect={rangeRect(2, 1, 5, 1, G41)} color={C.blue} p={prog(f, EVS[0].enter + 8, 10) * (within(11.7, 33.0) ? 1 : 0)} fill={0.1} dashed label={within(25.8, 33.0) ? 'A2#  (spilled branches)' : undefined} labelBelow />
        <RangeFx rect={rangeRect(2, 2, 5, 2, G41)} color={C.blue} p={prog(f, EVS[1].enter, 8) * (1 - prog(f, t(37.0), 20))} fill={0.12} label="one formula · 4 totals" labelBelow />
        <RangeFx rect={rangeRect(2, 11, 17, 11, G41)} color={C.green} p={prog(f, t(23.6), 10) * (1 - prog(f, t(26.4), 10))} fill={0.1} label="sum_range" />
        <RangeFx rect={rangeRect(2, 9, 17, 9, G41)} color={C.purple} p={prog(f, t(24.6), 10) * (1 - prog(f, t(27.6), 10))} fill={0.1} label="criteria_range" />
      </Sim>
      <TopBadge text="الدرس 41 من 76 | الوحدة 8 من 14 ──► SUMIFS & Dynamic Array Integration" from={t(2.0)} to={t(17.5)} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(17.9), 10) * (1 - prog(f, t(22.3), 10))}}><Chip color={C.blue}>SUMIFS + spilled criteria</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(26.2), 10) * (1 - prog(f, t(37.0), 10))}}><Chip color={C.green}>A2# ──► all branches at once</Chip></div>
      <Legacy items={['Manual drag', '$A$2 anchors']} p={legacy} strike={prog(f, t(23.4), 8)} />
      <Caption text="Spilled Criteria Aggregation ──► =SUMIFS(sum_range, criteria_range, A2#)" from={t(31.0)} to={t(38.3)} />
    </Stage>
  );
};
