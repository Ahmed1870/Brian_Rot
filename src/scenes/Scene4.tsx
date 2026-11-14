import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, CellV, XL, prog, sec} from '../kit';
import {Stage} from '../kit';
import {sheetTabBox} from '../xl';
import {Pointer, Wp} from '../lq';
import {Tag} from '../l54';
import {CATS, DESC, EDIT_VAL, Host63, MEAN_EDIT, ST, catP90, catTrim, cellC, f4, fmt, salesCell} from '../l63';

// SC04 anchors (s, abs): 139.1 static | 139.8 Sales tab | 140.4 type 9,999,999 | 142.3 back | 142.9 not updated | 145 AVERAGE | 147.4 MEDIAN | 149.8 TRIMMEAN | 156.3 PERCENTILE.INC | 158.7 category formulas | 164.8-168.8 change category
const S = START.s4;
const t = (g: number) => sec(g - S);
const SH = ['Sales', 'Analysis'];
const TY = XL.H - 24 - 13;
const cwA = (c: number) => [0, 200, 130, 30, 190, 150][c] ?? 64;
const cc = (r: number, c: number) => cellC(r, c, cwA);
const gG2 = (() => { const p = cellC(2, 7); return p; })();
const ddItem = (i: number) => ({x: cc(8, 5).x, y: cc(9, 5).y - 6 + i * 22 + 11});
const EV: Array<[number, number, number]> = [
  [139.8, sheetTabBox(SH, 'Sales').cx, TY], [140.3, gG2.x, gG2.y], [142.3, sheetTabBox(SH, 'Analysis').cx, TY],
  [144.8, cc(3, 5).x, cc(3, 5).y], [147.3, cc(4, 5).x, cc(4, 5).y], [149.7, cc(5, 5).x, cc(5, 5).y], [156.1, cc(6, 5).x, cc(6, 5).y],
  [158.6, cc(9, 5).x, cc(9, 5).y], [160.6, cc(10, 5).x, cc(10, 5).y], [164.8, cc(8, 5).x, cc(8, 5).y], [166.2, ddItem(1).x, ddItem(1).y], [168.0, cc(8, 5).x, cc(8, 5).y], [168.8, ddItem(3).x, ddItem(3).y],
];
const PTS: Wp[] = [{f: 0, x: 900, y: 560}];
const CLICKS: number[] = [];
EV.forEach(([g, x, y]) => { PTS.push({f: t(g - 0.3), x, y}, {f: t(g), x, y}); CLICKS.push(t(g)); });
PTS.push({f: t(170.0), x: 1000, y: 540});
const ty = (s: string, f: number, a: number, b: number) => s.slice(0, Math.floor(s.length * prog(f, t(a), sec(b - a)) + 0.0001));
const F = {avg: '=AVERAGE(Sales[Total])', med: '=MEDIAN(Sales[Total])', trim: '=TRIMMEAN(Sales[Total],0.1)', p90: '=PERCENTILE.INC(Sales[Total],0.9)',
  ct: '=TRIMMEAN(FILTER(Sales[Total],Sales[Category]=$E$8),0.1)', cp: '=PERCENTILE.INC(FILTER(Sales[Total],Sales[Category]=$E$8),0.9)'};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const onSales = f >= t(139.8) && f < t(142.3);
  const edit = ty('9999999', f, 140.5, 141.5);
  const cat = at(168.8) ? 'Office' : at(166.2) ? 'Electronics' : 'Accessories';
  const ddOpen = (at(164.8) && !at(166.3)) || (at(168.0) && !at(168.9));
  const tA = ty(F.avg, f, 145.0, 146.4), tM = ty(F.med, f, 147.4, 148.2), tT = ty(F.trim, f, 149.8, 151.6), tP = ty(F.p90, f, 156.3, 157.9), tC = ty(F.ct, f, 158.7, 160.4), tCP = ty(F.cp, f, 160.7, 162.4);
  const editVal = at(141.6) ? fmt(EDIT_VAL) : edit;
  const done = (a: number, b: number) => (at(b) ? 2 : at(a) ? 1 : 0);
  const stAvg = done(145.0, 146.5), stMed = done(147.4, 148.3), stTrim = done(149.8, 151.7), stP = done(156.3, 158.0), stC = done(158.7, 160.5), stCP = done(160.7, 162.5);
  const cell = (r: number, c: number): CellV | undefined => {
    if (onSales) return salesCell(r, c, at(140.4) ? editVal : undefined);
    if (c === 1 || c === 2) {
      if (r === 1) return c === 1 ? {t: 'Total  (ToolPak output · static)', b: true, bg: '#F2F2F2'} : {t: '', bg: '#F2F2F2'};
      const i = r - 3; if (i < 0 || i > 15) return undefined;
      const hot = i === 0 && at(142.9);
      return c === 1 ? {t: DESC[i][0]} : {t: f4(DESC[i][1]), num: 1, al: 'r', bg: hot ? '#FECACA' : undefined, b: hot};
    }
    if (c !== 4 && c !== 5) return undefined;
    if (c === 4 && r === 2) return at(144.5) ? {t: 'Dynamic formulas', b: true, bg: '#FFF2CC'} : undefined;
    if (c === 5 && r === 2) return at(144.5) ? {t: '', bg: '#FFF2CC'} : undefined;
    const row = (lab: string, st: number, typed: string, val: string): CellV | undefined => c === 4 ? (st > 0 ? {t: lab} : undefined) : st === 2 ? {t: val, num: 1, al: 'r', b: true, bg: '#FEF3C7'} : st === 1 ? {t: typed} : undefined;
    if (r === 3) return row('AVERAGE', stAvg, tA, f4(MEAN_EDIT));
    if (r === 4) return row('MEDIAN', stMed, tM, fmt(ST.median));
    if (r === 5) return row('TRIMMEAN(0.1)', stTrim, tT, f4(ST.tm));
    if (r === 6) return row('PERCENTILE.INC(0.9)', stP, tP, fmt(ST.p90));
    if (r === 8) return c === 4 ? (at(158.5) ? {t: 'Category', b: true} : undefined) : at(158.5) ? {t: cat, bg: '#E9D5FF', b: true} : undefined;
    if (r === 9) return row('TRIMMEAN · category', stC, tC, f4(catTrim(cat)));
    if (r === 10) return row('P90 · category', stCP, tCP, fmt(catP90(cat)));
    return undefined;
  };
  const cur = f >= t(168.0) ? {r: 8, c: 5} : f >= t(164.8) ? {r: 8, c: 5} : f >= t(160.6) ? {r: 10, c: 5} : f >= t(158.6) ? {r: 9, c: 5} : f >= t(156.1) ? {r: 6, c: 5} : f >= t(149.7) ? {r: 5, c: 5} : f >= t(147.3) ? {r: 4, c: 5} : f >= t(144.8) ? {r: 3, c: 5} : {r: 1, c: 1};
  const typing = (at(145.0) && !at(146.5)) || (at(147.4) && !at(148.3)) || (at(149.8) && !at(151.7)) || (at(156.3) && !at(158.0)) || (at(158.7) && !at(160.5)) || (at(160.7) && !at(162.5));
  const fText = at(160.7) ? (at(162.5) ? F.cp : tCP) : at(158.7) ? (at(160.5) ? F.ct : tC) : at(156.3) ? (at(158.0) ? F.p90 : tP) : at(149.8) ? (at(151.7) ? F.trim : tT) : at(147.4) ? (at(148.3) ? F.med : tM) : at(145.0) ? (at(146.5) ? F.avg : tA) : '';
  const sel = onSales ? {r: 2, c: 7} : cur;
  const nm = onSales ? 'G2' : `${'ABCDE'[sel.c - 1]}${sel.r}`;
  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="fade">
      <Host63 cell={cell} colW={onSales ? undefined : cwA} sheets={SH} sheet={onSales ? 'Sales' : 'Analysis'} sel={{r1: sel.r, c1: sel.c, r2: sel.r, c2: sel.c}} active={sel} nameBox={nm} formula={onSales ? (at(141.6) ? String(EDIT_VAL) : edit) : fText} fbEdit={typing || (onSales && at(140.5) && !at(141.6)) ? true : undefined}>
        {ddOpen ? (
          <div style={{position: 'absolute', left: cc(8, 5).x - 75, top: cc(9, 5).y - 6, width: 150, background: '#fff', border: '1px solid #777', boxShadow: '0 6px 16px rgba(0,0,0,.3)', zIndex: 40, fontFamily: 'sans-serif', fontSize: 13}}>
            {CATS.map((k) => <div key={k} style={{height: 22, lineHeight: '22px', padding: '0 8px', background: k === (at(168.0) && !at(168.9) ? 'Office' : 'Electronics') && ((at(166.0) && !at(166.3)) || at(168.7)) ? '#CFE8D8' : '#fff'}}>{k}</div>)}
          </div>
        ) : null}
        <Tag x={620} y={300} text="ToolPak output = Static Values ──► cannot refresh" color={C.red} p={prog(f, t(139.1), 10) * (1 - prog(f, t(139.7), 6))} dark />
        <Tag x={620} y={300} text={`Source changed to ${fmt(EDIT_VAL)} ──► ToolPak Mean stays ${f4(ST.mean)}`} color={C.red} p={prog(f, t(142.9), 10) * (1 - prog(f, t(144.6), 8))} dark />
        <Tag x={620} y={430} text={`Live AVERAGE → ${f4(MEAN_EDIT)} (static: ${f4(ST.mean)})`} color={C.amber} p={prog(f, t(146.6), 10) * (1 - prog(f, t(148.0), 6))} dark />
        <Tag x={620} y={430} text="MEDIAN is dynamic and outlier-resistant" color={C.amber} p={prog(f, t(148.4), 10) * (1 - prog(f, t(149.6), 6))} dark />
        <Tag x={620} y={430} text="TRIMMEAN 0.1 ──► drops 5% from each end, outlier ignored" color={C.amber} p={prog(f, t(151.8), 10) * (1 - prog(f, t(155.5), 8))} dark />
        <Tag x={620} y={430} text="PERCENTILE.INC 0.9 ──► where the top 10% starts" color={C.amber} p={prog(f, t(158.1), 10) * (1 - prog(f, t(158.6), 4))} dark />
        <Tag x={620} y={470} text="FILTER + formulas ──► recalculates with the chosen category" color={C.amber} p={prog(f, t(162.6), 10)} dark />
        <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(170.1)} />
      </Host63>
      <Caption text="Static vs. Dynamic ──► ToolPak Outputs Are Static — Use Dynamic Formulas for Live Dashboards" from={t(132.0)} to={t(148.0)} tone="danger" />
      <Caption text="Advanced Dynamic Functions ──► TRIMMEAN (Trims Extremes) & PERCENTILE.INC (Quantile Slicing)" from={t(152.0)} to={t(168.0)} />
    </Stage>
  );
};
