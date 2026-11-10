import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Stage, sec} from '../kit';
import {CAM_SHEET, Cells, Ev, NEWROW, Pick, RangeFx, Row, Sim, TB, cellRect, fmtN, fn, mk, num, picksOf, prog, put, putTable, rangeRect, rev, G40} from '../l40';

// SC03 anchors (s, abs): 87-90.8 default formula | 96.9-105.8 reverse formula | 105.9-109 sweep | 111.2 horizontal block | 112.4-116 HLOOKUP-style | 121 new row | 124.2 refresh
const S = START.s3;
const t = (g: number) => sec(g - S);
const FD = '=XLOOKUP("Cairo", tbl_Sales[Branch], tbl_Sales[Amount])';
const FR = '=XLOOKUP("Cairo", tbl_Sales[Branch], tbl_Sales[Amount], , 0, -1)';
const FH = '=XLOOKUP("Mar", I16:M16, I17:M17)';
const EVS: Ev[] = [
  {r: 4, c: 4, text: FD, start: t(87.0), dur: sec(3.6), enter: t(90.8)},
  {r: 2, c: 4, text: FR, start: t(97.3), dur: sec(8.0), enter: t(105.8)},
  {r: 20, c: 9, text: FH, start: t(112.6), dur: sec(3.2), enter: t(116.0)},
];
const EXTRA: Pick[] = [{at: t(120.9), r: 14, c: 8, click: true}];
const PICKS = picksOf(EVS, EXTRA);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
const SALES = [12400, 15800, 14200, 17300, 16100], PROFIT = [3100, 3950, 3550, 4320, 4030];
const cairoRows = (rows: Row[]) => rows.map((r, i) => (r[3] === 'Cairo' ? i + 2 : 0)).filter(Boolean);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const newN = rev(f, t(121.3), 5, 6);
  const rows: Row[] = newN > 0 ? [...TB, NEWROW] : TB;
  const m: Cells = mk();
  put(m, 1, 1, {t: 'Mode', b: true, bg: '#DDEBF7'}); put(m, 2, 1, {t: 'Last (-1)'}); put(m, 4, 1, {t: 'First (1)'});
  putTable(m, TB);
  if (newN > 0) NEWROW.forEach((v, j) => { if (j < newN) put(m, 14, 8 + j, j === 4 ? num(v as number, {bg: '#D9E1F2'}) : {t: String(v), bg: '#D9E1F2'}); });
  const last = at(124.4) ? 1900 : 520;
  if (at(90.8)) put(m, 4, 4, num(18500));
  if (at(105.8)) put(m, 2, 4, num(last));
  const hb = prog(f, t(111.2), 10);
  if (hb > 0) {
    put(m, 16, 8, {t: 'Month', b: true, bg: '#4472C4', color: '#fff'}); put(m, 17, 8, {t: 'Sales', bg: '#D9E1F2'}); put(m, 18, 8, {t: 'Profit'});
    MONTHS.forEach((mo, i) => { put(m, 16, 9 + i, {t: mo, b: true, bg: '#4472C4', color: '#fff', al: 'r'}); put(m, 17, 9 + i, num(SALES[i], {bg: '#D9E1F2'})); put(m, 18, 9 + i, num(PROFIT[i])); });
    put(m, 20, 8, {t: 'Result', b: true});
    if (at(116.0)) put(m, 20, 9, num(14200));
  }
  const cr = cairoRows(rows);
  const cairoP = prog(f, t(89.0), 10) * (1 - prog(f, t(96.3), 12));
  const first = prog(f, t(91.0), 8) * (1 - prog(f, t(96.3), 12));
  const sweepY = Math.min(1, Math.max(0, (f - t(105.9)) / sec(2.6)));
  const row13 = cellRect(13, 8, G40), row12 = cellRect(12, 8, G40);
  const sweepRect = {x: row13.x, y: row13.y - sweepY * (row13.y - row12.y), w: 540, h: 20};
  const lastHit = prog(f, t(108.6), 8) * (1 - prog(f, t(112.0), 14));
  const refresh = prog(f, t(124.4), 10) * (1 - prog(f, t(128.0), 20));
  const hs = Math.min(1, Math.max(0, (f - t(116.1)) / sec(1.8)));
  const hx = cellRect(16, 9, G40).x;

  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="up">
      <Sim f={f} cell={fn(m)} evs={EVS} picks={PICKS} cam={CAM_SHEET}>
        {cr.map((r) => <RangeFx key={r} rect={cellRect(r, 11, G40)} color={C.amber} p={cairoP} fill={0.28} />)}
        <RangeFx rect={rangeRect(2, 8, 2, 12, G40)} color={C.amber} p={first} fill={0.18} label="first match = 18,500" labelBelow />
        {sweepY > 0 && sweepY < 1 ? <RangeFx rect={sweepRect} color={C.green} p={1} fill={0.25} label="searching bottom → top" /> : null}
        <RangeFx rect={rangeRect(12, 8, 12, 12, G40)} color={C.green} p={lastHit} fill={0.22} label={'last Cairo = ' + fmtN(520)} labelBelow />
        <RangeFx rect={cellRect(2, 4, G40)} color={C.green} p={refresh} fill={0.3} label="520 ──► 1,900" labelBelow />
        <RangeFx rect={rangeRect(14, 8, 14, 12, G40)} color={C.blue} p={prog(f, t(121.3), 8) * (1 - prog(f, t(127.0), 14))} fill={0.12} label="new row: table expands" labelBelow />
        <RangeFx rect={rangeRect(16, 9, 16, 13, G40)} color={C.purple} p={prog(f, t(116.1), 8) * (1 - prog(f, t(121.0), 12))} fill={0.12} label="lookup_array (row)" />
        <RangeFx rect={rangeRect(17, 9, 17, 13, G40)} color={C.purple} p={prog(f, t(116.6), 8) * (1 - prog(f, t(121.0), 12))} fill={0.12} label="return_array (row)" labelBelow />
        {hs > 0 && hs < 1 ? <RangeFx rect={{x: hx, y: cellRect(16, 9, G40).y, w: (cellRect(16, 11, G40).x + 90 - hx) * hs, h: 20}} color={C.purple} p={1} fill={0.3} /> : null}
        <RangeFx rect={cellRect(20, 9, G40)} color={C.purple} p={prog(f, t(116.0), 8) * (1 - prog(f, t(122.0), 20))} fill={0.28} />
      </Sim>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(87.5), 10) * (1 - prog(f, t(96.4), 10))}}><Chip color={C.amber}>Default (1) ──► first match only</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(97.0), 10) * (1 - prog(f, t(110.5), 10))}}><Chip color={C.green}>search_mode = -1 ──► last to first</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(117.4), 10) * (1 - prog(f, t(120.5), 10))}}><Chip color={C.purple}>Column order does not matter</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(121.0), 10) * (1 - prog(f, t(128.0), 10))}}><Chip color={C.blue}>New rows ──► references never break</Chip></div>
      <Caption text="Reverse Search (-1) ──► Retrieves the Last Transaction Record Instantly" from={t(98.0)} to={t(110.2)} />
      <Caption text="Bi-Directional Engine ──► Replaces Both VLOOKUP and HLOOKUP Seamlessly" from={t(112.2)} to={t(120.4)} />
      <Caption text="Tables expand ──► the formula keeps working, no broken references" from={t(121.4)} to={t(128.2)} tone="ok" />
    </Stage>
  );
};
