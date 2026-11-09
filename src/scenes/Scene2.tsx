import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {cwP, prodCell, uniqSorted} from '../data';
import type {CellV} from '../kit';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Ripple, Stage, camLerp, dwell, prog, sec, track} from '../kit';
import {CAM_SHEET, RangeFx, cellRect, center, typeIn} from '../l7';
import {CellDrop, DvDialog} from '../dv';

// SC02: dynamic drop-down with F2#. Anchors (s): 51.6 UNIQUE+SORT | 56.9 spill | 59.9 Data Validation | 60.6 List | 62.6 =F2# | 64.8 hash | 67.5 open | 73.3 new row | 76.3 Gadgets | 77.8 list grows
const S = START.s2;
const t = (g: number) => sec(g - S);
const G0 = {colW: cwP};
const DX = 700, DY = 190;
const FORM = '=SORT(UNIQUE(tbl_Products[Category]))';

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(40.2), 50));

  const grown = at(76.2);
  const nRows = grown ? 10 : 9;
  const spillN = at(56.9) ? uniqSorted(nRows).length : 0;
  const list = uniqSorted(nRows);

  const f2 = center(cellRect(2, 6, G0)), h2r = cellRect(2, 8, G0), h2 = center(h2r), a11 = center(cellRect(11, 1, G0));
  const arrow = {x: h2r.x + h2r.w + 10, y: h2r.y + 11};
  const ditem = (i: number) => ({x: h2r.x + 50, y: h2r.y + h2r.h + 4 + i * 21 + 10});
  const allowBox = {x: DX + 24 + 140, y: DY + 32 + 82 + 12};
  const listItem = {x: DX + 24 + 100, y: DY + 32 + 108 + 3 * 22 + 11};
  const srcBox = {x: DX + 24 + 210, y: DY + 32 + 136 + 12};
  const okBtn = {x: DX + 470 - 190 + 43, y: DY + 32 + 342 + 13};
  const pts = dwell([
    {f: t(39.88), x: 760, y: 520},
    {f: t(51.2), x: f2.x, y: f2.y},
    {f: t(56.8), x: f2.x, y: f2.y},
    {f: t(57.1), x: h2.x, y: h2.y},
    {f: t(60.0), x: h2.x, y: h2.y},
    {f: t(60.4), x: allowBox.x, y: allowBox.y},
    {f: t(60.9), x: listItem.x, y: listItem.y},
    {f: t(61.7), x: srcBox.x, y: srcBox.y},
    {f: t(66.2), x: okBtn.x, y: okBtn.y},
    {f: t(67.3), x: arrow.x, y: arrow.y},
    {f: t(69.0), x: ditem(1).x, y: ditem(1).y},
    {f: t(72.9), x: a11.x, y: a11.y},
    {f: t(77.2), x: arrow.x, y: arrow.y},
    {f: t(80.0), x: ditem(3).x + 30, y: ditem(3).y},
    {f: t(84.5), x: ditem(3).x + 30, y: ditem(3).y},
  ]);
  const cur = track(f, pts);
  const clicks = [51.4, 57.2, 60.5, 61.8, 66.4, 67.5, 69.9, 73.1, 77.4];

  // typing states
  const extra: Record<string, CellV> = {};
  const tF2 = within(51.6, 56.9);
  if (tF2) extra['2,6'] = {t: typeIn(FORM, f, t(51.6), sec(4.6)), al: 'l'};
  const sel = within(73.1, 76.2);
  const tA = typeIn('Smart Watch', f, t(73.3), sec(1.0)), tB = typeIn('Gadgets', f, t(74.5), sec(0.8)), tC = typeIn('3900', f, t(75.5), sec(0.4));
  if (sel) { if (at(73.3)) extra['11,1'] = {t: tA, al: 'l'}; if (at(74.5)) { extra['11,1'] = {t: 'Smart Watch'}; extra['11,2'] = {t: tB, al: 'l'}; } if (at(75.5)) { extra['11,2'] = {t: 'Gadgets'}; extra['11,3'] = {t: tC, al: 'l'}; } }
  const hChoice = at(69.9) ? 'Electronics' : '';
  if (hChoice) extra['2,8'] = {t: hChoice};

  let sx = {r1: 1, c1: 1, r2: 1, c2: 1}; let active = {r: 1, c: 1}; let nameBox = 'A1'; let formula = 'Product';
  const pick = (r: number, c: number, nm: string, fm: string) => { sx = {r1: r, c1: c, r2: r, c2: c}; active = {r, c}; nameBox = nm; formula = fm; };
  if (at(51.4)) pick(2, 6, 'F2', tF2 ? extra['2,6'].t : at(56.9) ? FORM : '');
  if (at(57.2)) pick(2, 8, 'H2', hChoice);
  if (at(69.9)) pick(2, 8, 'H2', 'Electronics');
  if (at(73.1)) pick(11, 1, 'A11', within(73.3, 74.5) ? tA : '');
  if (at(74.5)) pick(11, 2, 'B11', tB);
  if (at(75.5)) pick(11, 3, 'C11', tC);
  if (at(76.2)) pick(12, 1, 'A12', '');
  if (at(77.2)) pick(2, 8, 'H2', 'Electronics');

  const dlg = prog(f, t(59.9), 12) * (1 - prog(f, t(66.5), 8));
  const srcText = typeIn('=F2#', f, t(62.6), sec(2.0));
  const dropOpen = within(67.5, 70.0) || within(77.4, 83.6) ? 1 : 0;
  const hiIdx = within(68.4, 69.9) ? 1 : -1;
  const arrowP = (at(57.2) ? 1 : 0) * (at(66.4) ? 1 : 0);
  const hashP = prog(f, t(64.8), 8) * (1 - prog(f, t(70.5), 10));
  const newItem = within(77.6, 84.0) ? uniqSorted(10).indexOf('Gadgets') : -1;
  const spillFx = prog(f, t(56.9), 10);
  const newFx = prog(f, t(76.3), 10) * (1 - prog(f, t(79.5), 14));
  const kP = prog(f, t(58.0), 6) * (1 - prog(f, t(59.9), 8));
  const spillRect = {x: cellRect(2, 6, G0).x, y: cellRect(2, 6, G0).y, w: cwP(6), h: 21 * Math.max(1, spillN)};

  return (
    <Stage dur={SCENES.s2.dur} inFx="zoom" outFx="left">
      <ExcelWindow cam={cam}>
        <ExcelApp file="Orders" nameBox={nameBox} formula={formula} fbEdit={tF2 || sel} colW={cwP} cell={(r, c) => prodCell(r, c, nRows, spillN, extra)} sel={sx} active={active} thumb={0} thumbSize={0.55}>
          <RangeFx rect={spillRect} color={C.blue} p={spillFx * (1 - hashP * 0)} fill={0.1} label="Spilled range" labelBelow />
          <RangeFx rect={spillRect} color={C.amber} p={hashP} fill={0.2} label="F2#" labelBelow />
          <RangeFx rect={cellRect(5, 6, G0)} color={C.green} p={newFx} fill={0.3} />
          <RangeFx rect={cellRect(2, 8, G0)} color={C.amber} p={prog(f, t(57.3), 8) * (1 - prog(f, t(66.5), 8))} fill={0.1} label="Input cell" labelDx={146} />
          <CellDrop rect={h2r} arrow={arrowP * (1 - 0)} list={list} open={dropOpen} hi={hiIdx} hiNew={newItem} />
          <DvDialog x={DX} y={DY} p={dlg} tab="Settings" allow="List" source={srcText} focus="source" blink={Math.floor(f / 8) % 2 === 0} glow={at(64.8) ? 'source' : at(60.6) ? 'allow' : null} glowColor={at(64.8) ? C.amber : C.green} okHot={within(65.8, 66.5)} allowOpen={within(60.1, 60.9) ? 1 : 0} hiItem={within(60.1, 60.9) ? 'List' : null} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>
      <KeyBadge keys={['Alt', 'A', 'V', 'V']} p={kP} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(51.5), 10) * (1 - prog(f, t(57.5), 10))}}><Chip color={C.blue}>UNIQUE + SORT ──► spills automatically</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(64.8), 10) * (1 - prog(f, t(70.5), 10))}}><Chip color={C.amber}>=F2#  ──►  the whole spilled range</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(73.0), 10)}}><Chip color={C.green}>New product added ──► list updates itself</Chip></div>
      <Caption text="Dynamic Drop-down Lists ──► Set Source to Spilled Range Reference: =F2#" from={t(41.5)} to={t(59.8)} />
      <Caption text="Zero Maintenance ──► Drop-down Options Expand Automatically as Source Arrays Grow" from={t(77.0)} to={t(84.4)} tone="ok" />
    </Stage>
  );
};
