import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Stage, sec} from '../kit';
import {CAM_SHEET, Cells, Ev, Pick, RangeFx, Sim, cellRect, fn, mk, num, picksOf, prog, put, rangeRect, rev} from '../l40';
import {G41, Legacy, T41, lblHdr, putT41, sumB, sumOf, uniqSorted} from '../l41';

// SC02 anchors (s, abs): 41.6 B1 =TRANSPOSE(...) | 45.9-53.3 type 2D SUMIFS | 54.6 Enter -> matrix | 65.7 no $ / no drag
const S = START.s2;
const t = (g: number) => sec(g - S);
const F1 = '=TRANSPOSE(SORT(UNIQUE(tbl_Sales[Category])))';
const F2 = '=SUMIFS(tbl_Sales[Amount], tbl_Sales[Branch], A2#, tbl_Sales[Category], B1#)';
const EVS: Ev[] = [
  {r: 1, c: 2, text: F1, start: t(41.6), dur: sec(3.0), enter: t(44.8), c2: 4},
  {r: 2, c: 2, text: F2, start: t(45.9), dur: sec(7.4), enter: t(54.6), r2: 5, c2: 4},
];
const PICKS = picksOf(EVS, []);
const BR = uniqSorted(T41, 1), CAT = uniqSorted(T41, 2);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const m: Cells = mk();
  put(m, 1, 1, {t: 'Branch', ...lblHdr});
  putT41(m, T41);
  BR.forEach((b, i) => put(m, 2 + i, 1, {t: b}));
  const nH = rev(f, EVS[0].enter, 3, 8), nM = rev(f, EVS[1].enter, 12, 3);
  for (let j = 0; j < nH; j++) put(m, 1, 2 + j, {t: CAT[j], ...lblHdr, al: 'r'});
  for (let k = 0; k < nM; k++) { const i = Math.floor(k / 3), j = k % 3; put(m, 2 + i, 2 + j, num(sumOf(T41, BR[i], CAT[j]))); }
  const legacy = prog(f, t(65.7), 10) * (1 - prog(f, t(71.8), 10));
  const anchor = prog(f, t(57.6), 10) * (1 - prog(f, t(65.4), 12));
  return (
    <Stage dur={SCENES.s2.dur} inFx="left" outFx="left">
      <Sim f={f} cell={fn(m)} evs={EVS} picks={PICKS} geom={G41} cam={CAM_SHEET}>
        <RangeFx rect={rangeRect(2, 1, 5, 1, G41)} color={C.blue} p={prog(f, t(47.6), 10) * (1 - prog(f, t(55.0), 12))} fill={0.1} dashed label="A2# ↓ (down)" labelBelow />
        <RangeFx rect={rangeRect(1, 2, 1, 4, G41)} color={C.purple} p={prog(f, t(50.2), 10) * (1 - prog(f, t(55.0), 12))} fill={0.14} dashed label="B1# → (across)" />
        <RangeFx rect={rangeRect(2, 2, 5, 4, G41)} color={C.green} p={prog(f, EVS[1].enter, 8) * (at(85.0) ? 0 : 1)} fill={0.14} label="2D matrix · 1 formula" labelBelow />
        <RangeFx rect={cellRect(2, 2, G41)} color={C.amber} p={anchor} fill={0.3} label="B2 = the only formula" labelDx={104} />
        <RangeFx rect={rangeRect(2, 11, 17, 11, G41)} color={C.green} p={prog(f, t(46.6), 10) * (1 - prog(f, t(48.6), 10))} fill={0.08} label="sum_range" />
      </Sim>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(41.4), 10) * (1 - prog(f, t(46.0), 10))}}><Chip color={C.purple}>B1# must be a ROW ──► TRANSPOSE</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(46.6), 10) * (1 - prog(f, t(59.0), 10))}}><Chip color={C.green}>A2# (down) × B1# (across) ──► 2D grid</Chip></div>
      <Legacy items={['$A$2', '$B$1', 'Manual drag']} p={legacy} strike={prog(f, t(66.4), 8)} left={500} top={380} />
      <Caption text="2D Spilled Matrix ──► =SUMIFS(sum_range, range1, A2#, range2, B1#)" from={t(47.0)} to={t(59.0)} />
      <Caption text="Single-Cell Table ──► Full Vertical & Horizontal Matrix, No Absolute Anchoring $" from={t(72.4)} to={t(83.3)} tone="ok" />
    </Stage>
  );
};
void sumB;
