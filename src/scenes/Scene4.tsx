import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Chip, Stage, sec} from '../kit';
import {CAM0, CAM_SHEET, Cells, DET, Ev, Pick, RangeFx, Sim, TB, cellRect, camLerp, fn, mk, num, picksOf, prog, put, putTable, rangeRect, rev, G40} from '../l40';

// SC04 anchors (s, abs): 131.8-145.2 nested formula typed | 139.4 FILTER | 142.5 SORT | 145.2 Enter + XLOOKUP spill | 148 no helper cols | 153.3 edit L13 -> row appears | 158 zoom out
const S = START.s4;
const t = (g: number) => sec(g - S);
const FM = '=XLOOKUP(SORT(FILTER(tbl_Sales[Product ID], tbl_Sales[Amount]>10000)), tbl_Products[ID], tbl_Products[Details], "' + 'غير متاح' + '")';
const EVS: Ev[] = [
  {r: 2, c: 4, text: FM, start: t(131.8), dur: sec(13.2), enter: t(145.2), r2: 5},
  {r: 13, c: 12, text: '10900', start: t(153.3), dur: 14, enter: t(154.1)},
];
const PICKS = picksOf(EVS, []);
const PRODUCTS = ['P-101', 'P-102', 'P-103', 'P-104', 'P-105', 'P-106'];

const Stg: React.FC<{x: number; title: string; lines: string[]; color: string; p: number; w?: number}> = ({x, title, lines, color, p, w = 138}) => (
  <div style={{position: 'absolute', left: x, top: 360, width: w, opacity: p, transform: `translateY(${(1 - p) * 10}px)`, background: '#fff', border: `3px solid ${color}`, borderRadius: 8, boxShadow: `0 0 14px ${color}88`, fontFamily: MONO, fontSize: 13, color: '#222'}}>
    <div style={{background: color, color: '#0B1222', fontWeight: 700, padding: '2px 8px', fontSize: 13}}>{title}</div>
    <div style={{padding: '4px 8px', lineHeight: '17px'}}>{lines.map((l, i) => <div key={i}>{l}</div>)}</div>
  </div>
);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cam = camLerp(CAM_SHEET, CAM0, prog(f, t(158.0), 40));
  const m: Cells = mk();
  put(m, 1, 4, {t: 'Product Details', b: true, bg: '#DDEBF7'});
  const rows = TB.map((r, i) => (i === 11 && at(154.1) ? ([r[0], r[1], r[2], r[3], 10900] as typeof r) : r));
  putTable(m, rows);
  put(m, 16, 8, {t: 'ID', b: true, bg: '#4472C4', color: '#fff'}); put(m, 16, 9, {t: 'Details', b: true, bg: '#4472C4', color: '#fff'});
  PRODUCTS.forEach((p, i) => { put(m, 17 + i, 8, {t: p, bg: i % 2 === 0 ? '#D9E1F2' : undefined}); put(m, 17 + i, 9, {t: DET[p], bg: i % 2 === 0 ? '#D9E1F2' : undefined}); });
  const out = at(154.1) ? ['P-101', 'P-102', 'P-105', 'P-106'] : ['P-101', 'P-102', 'P-105'];
  const n2 = at(154.3) ? 4 : rev(f, EVS[0].enter, 3, 6);
  for (let i = 0; i < n2; i++) put(m, 2 + i, 4, {t: DET[out[i]]});
  const rowsOut = at(154.1) ? 4 : 3;
  const glowOut = prog(f, EVS[0].enter, 8);
  const grow = prog(f, t(154.3), 8) * (1 - prog(f, t(158.0), 20));

  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="zoom">
      <Sim f={f} cell={fn(m)} evs={EVS} picks={PICKS} cam={cam}>
        <RangeFx rect={rangeRect(2, 4, 1 + rowsOut, 4, G40)} color={C.amber} p={glowOut} fill={0.16} label="Master Query · 1 cell" labelBelow />
        <RangeFx rect={rangeRect(1, 8, 13, 12, G40)} color={C.green} p={prog(f, t(139.4), 8) * (1 - prog(f, t(142.5), 10))} fill={0.06} />
        <RangeFx rect={rangeRect(16, 8, 22, 9, G40)} color={C.blue} p={prog(f, t(145.2), 10) * (1 - prog(f, t(149.0), 14))} fill={0.1} label="tbl_Products" />
        <RangeFx rect={cellRect(13, 12, G40)} color={C.green} p={within(153.3, 156.5) ? 1 : 0} fill={0.25} label="2,950 ──► 10,900" labelBelow />
        <RangeFx rect={cellRect(5, 4, G40)} color={C.green} p={grow} fill={0.3} label="auto-added" labelDx={8} />
        <Stg x={40} title="① FILTER" lines={['P-101', 'P-105', 'P-102']} color={C.blue} p={prog(f, t(139.4), 10) * (1 - prog(f, t(157.0), 10))} />
        <div style={{position: 'absolute', left: 184, top: 400, fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.blue, opacity: prog(f, t(142.5), 8) * (1 - prog(f, t(157.0), 10))}}>→</div>
        <Stg x={206} title="② SORT" lines={['P-101', 'P-102', 'P-105']} color={C.purple} p={prog(f, t(142.5), 10) * (1 - prog(f, t(157.0), 10))} />
        <div style={{position: 'absolute', left: 350, top: 400, fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.purple, opacity: prog(f, t(145.4), 8) * (1 - prog(f, t(157.0), 10))}}>→</div>
        <Stg x={372} title="③ XLOOKUP" lines={['Laptop Pro 16GB', 'Monitor 27" 4K', 'Tablet 10" 256GB']} color={C.amber} p={prog(f, t(145.4), 10) * (1 - prog(f, t(157.0), 10))} w={158} />
      </Sim>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(131.6), 10) * (1 - prog(f, t(139.0), 10))}}><Chip color={C.amber}>XLOOKUP at the end of FILTER + SORT</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(148.0), 10) * (1 - prog(f, t(152.4), 10))}}><Chip color={C.green}>No helper columns · no VLOOKUP chains</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(152.8), 10) * (1 - prog(f, t(160.0), 10))}}><Chip color={C.amber}>Edit the data ──► the report refreshes live</Chip></div>
      <Caption text="Dynamic Lookup Pipeline ──► =XLOOKUP(SORT(FILTER(...)), lookup_arr, return_arr)" from={t(133.0)} to={t(146.6)} />
      <Caption text="Automated Detail Retrieval ──► Filters, Sorts, and Fetches Product Master Details in 1 Cell" from={t(156.8)} to={t(168.2)} tone="ok" />
    </Stage>
  );
};
void num; void cellRect;
