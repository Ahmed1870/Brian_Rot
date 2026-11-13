import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Menu, Stage, menuItemY, prog, sec} from '../kit';
import {PPWin} from '../lp';
import {Pointer, Wp, menuOf} from '../lq';
import {Host} from '../l46';
import {Tag, colW54, factCell} from '../l54';
import {AuditGrid, GCol, SBar, SizePanel, guid, stamp} from '../l56';
import {sale} from '../data';

// SC02 anchors (s, abs): 43.3 grid+sizes | 47.2 distinct counts | 51.2 TimeStamp red | 55.4 GUID red | 61.5 can't compress | 70.0 click col | 70.8 PQ tag | 74.8 split | 78.9-80.4 delete GUID | 81.0-82.0 delete Notes | 82.8 shrink
const S = START.s2;
const t = (g: number) => sec(g - S);
const GX = 20, GY = 164;
const MI = ['Copy', 'Insert Column', 'Delete Columns', 'Rename Column', 'Freeze Columns', 'Hide from Client Tools'];
const MNW = 230;
const miY = (top: number) => menuItemY(top, MI.map((l) => ({label: l})), 2);
const TOP = GY + 40;
const PTS: Wp[] = [
  {f: 0, x: 700, y: 560}, {f: t(69.7), x: GX + 90 + 95, y: GY + 20}, {f: t(70.0), x: GX + 90 + 95, y: GY + 20},
  {f: t(78.8), x: GX + 90 + 240 + 100, y: GY + 20}, {f: t(79.0), x: GX + 90 + 240 + 100, y: GY + 20},
  {f: t(80.0), x: GX + 90 + 240 + 140, y: miY(TOP)}, {f: t(80.2), x: GX + 90 + 240 + 140, y: miY(TOP)},
  {f: t(80.95), x: GX + 90 + 240 + 85, y: GY + 20}, {f: t(81.0), x: GX + 90 + 240 + 85, y: GY + 20},
  {f: t(81.7), x: GX + 90 + 240 + 125, y: miY(TOP)}, {f: t(81.8), x: GX + 90 + 240 + 125, y: miY(TOP)}, {f: t(83.5), x: 760, y: 560},
];
const CLICKS = [70.0, 79.0, 80.2, 81.0, 81.8].map(t);
let amtDistinct = 0; { const s = new Set<number>(); for (let n = 1; n <= 50000; n++) s.add(sale(n).total); amtDistinct = s.size; }
const ids = Array.from({length: 13}, (_, i) => i + 1);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const gridP = prog(f, t(43.3), 14);
  const split = prog(f, t(74.8), 18);
  const gDel = prog(f, t(80.3), 12), nDel = prog(f, t(82.0), 12);
  const hl = (g: number) => prog(f, t(g), 10);
  const cols: GCol[] = [
    {k: 'SaleID', w: 90, sub: at(47.2) ? '50,000 unique' : '', cell: (i) => String(ids[i]), num: true},
    {k: 'TransactionTimeStamp', w: 190, vis: 1 - split, sub: at(47.2) ? '≈ 50,000 unique' : '', hl: at(51.2) ? C.red : undefined, hlP: hl(51.2), cell: (i) => stamp(i)},
    {k: 'TransactionDate', w: 120, vis: split, sub: split > 0.5 ? '365 unique' : '', hl: C.green, hlP: split, cell: (i) => stamp(i).slice(0, 10)},
    {k: 'TransactionTime', w: 120, vis: split, sub: split > 0.5 ? '≤ 1,440 unique' : '', hl: C.green, hlP: split, cell: (i) => stamp(i).slice(11, 16)},
    {k: 'TransactionGUID', w: 200, vis: 1 - gDel, sub: at(47.2) ? '≈ 50,000 unique' : '', hl: at(55.4) ? C.red : undefined, hlP: hl(55.4), cell: (i) => guid(i + 3)},
    {k: 'Notes', w: 170, vis: 1 - nDel, sub: at(47.2) ? 'text · not used' : '', hl: at(78.9) ? C.amber : undefined, hlP: hl(78.9), cell: (i) => ['free text…', 'call back', 'gift wrap', 'see email'][i % 4]},
    {k: 'ProductKey', w: 100, sub: at(47.2) ? '8 unique' : '', cell: (i) => String(101 + ((i * 3) % 8)), num: true},
    {k: 'Amount', w: 100, sub: at(47.2) ? `${amtDistinct} unique` : '', cell: (i) => String(sale(i + 1).total), num: true},
  ];
  const sp = split, gd = gDel, nd = nDel;
  const shrink = prog(f, t(82.8), 24);
  const bars: SBar[] = [
    {k: 'SaleID', pct: 3, color: C.blue},
    {k: 'TransactionTimeStamp', pct: 44 * (1 - sp), color: C.red},
    {k: 'TransactionDate', pct: 2 * sp, color: C.green},
    {k: 'TransactionTime', pct: 6 * sp, color: C.green},
    {k: 'TransactionGUID', pct: 27 * (1 - gd), color: C.red},
    {k: 'Notes', pct: 17 * (1 - nd), color: C.amber},
    {k: 'ProductKey', pct: 1, color: C.blue},
    {k: 'Amount', pct: 8, color: C.blue},
  ];
  const tot = bars.reduce((a, b) => a + b.pct, 0);
  const good = tot <= 25;
  const menu1 = f >= t(79.05) && f < t(80.4), menu2 = f >= t(81.05) && f < t(82.0);
  return (
    <Stage dur={SCENES.s2.dur} inFx="zoom" outFx="left">
      <Host cell={factCell} colW={colW54} sheets={['Fact_Sales']} sheet="Fact_Sales" tab="Power Pivot">
        <PPWin view="data" status="Data View · Fact_Sales">
          <div style={{opacity: gridP}}><AuditGrid cols={cols} x={GX} y={GY} rows={13} /></div>
          {gridP > 0.05 ? <SizePanel x={930} y={GY} w={560} bars={bars} title="Column size audit · % of model (illustrative)" total={good ? `${Math.round(tot)}%  ▼ ${Math.round(100 - tot)}%` : `${Math.round(tot)}%`} totalColor={good ? C.green : C.red} /> : null}
          <Tag x={GX + 90} y={GY + 340} text="High Cardinality ──► almost every value is unique" color={C.red} p={hl(51.4) * (1 - hl(70.0))} dark />
          <Tag x={GX + 90} y={GY + 376} text="VertiPaq can't compress unique values ──► bigger model" color={C.red} p={hl(61.5) * (1 - hl(70.0))} dark />
          <Tag x={GX + 90} y={GY + 340} text="Power Query ▸ Add Column ▸ Date ▸ Date Only · Time ▸ Time Only" color={C.blue} p={hl(70.8) * (1 - hl(78.6))} dark />
          <Tag x={GX + 90} y={GY + 376} text="Round Time to the minute ──► at most 1,440 distinct values" color={C.green} p={hl(75.8) * (1 - hl(78.6))} dark />
          <Tag x={GX + 90} y={GY + 340} text="Delete columns no report uses" color={C.amber} p={hl(79.0) * (1 - hl(82.6))} dark />
          <Tag x={GX + 90} y={GY + 340} text={'✓ Model ≈ 80% smaller (illustrative)'} color={C.green} p={shrink} />
          {menu1 ? <Menu x={GX + 90 + 240 + 70} y={TOP} w={MNW} items={menuOf(MI, f >= t(79.9) ? 'Delete Columns' : '')} /> : null}
          {menu2 ? <Menu x={GX + 90 + 240 + 20} y={TOP} w={MNW} items={menuOf(MI, f >= t(81.6) ? 'Delete Columns' : '')} /> : null}
          <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(83.6)} />
        </PPWin>
      </Host>
      <Caption text="High-Cardinality Mitigation ──► Split DateTime into Separate Date & Time Columns" from={t(42.0)} to={t(61.0)} />
      <Caption text="VertiPaq Memory Optimization ──► Removing Unused Text Columns Cuts Model Size by up to 80%" from={t(64.0)} to={t(85.0)} tone="ok" />
    </Stage>
  );
};
