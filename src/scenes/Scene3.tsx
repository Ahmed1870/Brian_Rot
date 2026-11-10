import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Stage, sec} from '../kit';
import {CAM_SHEET, Cells, Ev, RangeFx, Sim, cellRect, fn, mk, num, picksOf, prog, put, rangeRect, rev} from '../l40';
import {G41, NEW41, T41, lblHdr, putT41, sumB, uniqSorted} from '../l41';

// SC03 anchors (s, abs): 87.0 A2 =SORT(UNIQUE) | 91.8-100.8 nested SUMIFS | 101.2 Enter | 110.5-114 add Aswan row | 114.2 auto-sync | 124 SPILL note
const S = START.s3;
const t = (g: number) => sec(g - S);
const FA = '=SORT(UNIQUE(tbl_Sales[Branch]))';
const FB = '=SUMIFS(tbl_Sales[Amount], tbl_Sales[Branch], SORT(UNIQUE(tbl_Sales[Branch])))';
const EVS: Ev[] = [
  {r: 2, c: 1, text: FA, start: t(87.0), dur: sec(3.0), enter: t(90.3), r2: 5},
  {r: 2, c: 2, text: FB, start: t(91.8), dur: sec(9.0), enter: t(101.2), r2: 5},
  {r: 18, c: 8, text: NEW41[0], start: t(110.5), dur: 12, enter: t(111.2)},
  {r: 18, c: 9, text: NEW41[1], start: t(111.5), dur: 10, enter: t(112.1)},
  {r: 18, c: 10, text: NEW41[2], start: t(112.4), dur: 14, enter: t(113.1)},
  {r: 18, c: 11, text: String(NEW41[3]), start: t(113.4), dur: 10, enter: t(114.0)},
];
const PICKS = picksOf(EVS, []);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const added = at(114.0);
  const rows = added ? [...T41, NEW41] : T41;
  const br = uniqSorted(rows, 1);
  const m: Cells = mk();
  put(m, 1, 1, {t: 'Branch', ...lblHdr}); put(m, 1, 2, {t: 'Total Sales', ...lblHdr, al: 'r'});
  putT41(m, T41);
  const cells = [NEW41[0], NEW41[1], NEW41[2], NEW41[3]];
  [111.2, 112.1, 113.1, 114.0].forEach((g, j) => { if (at(g)) put(m, 18, 8 + j, j === 3 ? num(cells[j] as number, {bg: '#D9E1F2'}) : {t: String(cells[j]), bg: '#D9E1F2'}); });
  const nA = added ? br.length : rev(f, EVS[0].enter, 4, 5), nB = added ? br.length : rev(f, EVS[1].enter, 4, 6);
  for (let i = 0; i < nA; i++) put(m, 2 + i, 1, {t: br[i]});
  for (let i = 0; i < nB; i++) put(m, 2 + i, 2, num(sumB(rows, br[i])));
  const aswanRow = br.indexOf('Aswan') + 2;
  const sync = prog(f, t(114.2), 10) * (1 - prog(f, t(122.0), 20));
  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="up">
      <Sim f={f} cell={fn(m)} evs={EVS} picks={PICKS} geom={G41} cam={CAM_SHEET}>
        <RangeFx rect={rangeRect(2, 1, 1 + br.length, 2, G41)} color={C.amber} p={prog(f, EVS[1].enter, 8) * (1 - prog(f, t(108.0), 14))} fill={0.12} label="UNIQUE + SORT + SUMIFS" labelBelow />
        <RangeFx rect={rangeRect(18, 8, 18, 11, G41)} color={C.blue} p={prog(f, t(110.4), 8) * (1 - prog(f, t(117.0), 14))} fill={0.12} label="new record (Aswan)" labelBelow />
        <RangeFx rect={rangeRect(aswanRow, 1, aswanRow, 2, G41)} color={C.amber} p={sync} fill={0.32} label="Aswan added automatically" labelDx={210} />
        <RangeFx rect={cellRect(7, 1, G41)} color={C.red} p={prog(f, t(123.8), 10) * (1 - prog(f, t(129.0), 12))} fill={0.12} dashed label="keep the spill area empty (else #SPILL!)" labelDx={6} />
      </Sim>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(90.4), 10) * (1 - prog(f, t(95.0), 10))}}><Chip color={C.amber}>UNIQUE ──► SORT ──► branch list</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(101.4), 10) * (1 - prog(f, t(109.8), 10))}}><Chip color={C.amber}>Live report ──► no formula edits</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(114.4), 10) * (1 - prog(f, t(123.6), 10))}}><Chip color={C.purple}>New branch ──► joins the report instantly</Chip></div>
      <Caption text="Dynamic Pipeline ──► =SUMIFS(sum_arr, criteria_arr, SORT(UNIQUE(array)))" from={t(92.0)} to={t(109.6)} />
      <Caption text="Zero-Maintenance ──► Automatically Integrates New Data Entries Without Formula Edits" from={t(114.6)} to={t(123.4)} />
    </Stage>
  );
};
