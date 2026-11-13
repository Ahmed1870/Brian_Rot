import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Menu, Stage, XL, CellV, ribbonItemBox, menuItemY, prog, sec} from '../kit';
import {tabBox} from '../xl';
import {Pointer, Wp, menuOf} from '../lq';
import {Host} from '../l46';
import {Tag} from '../l54';
import {CATS, REGIONS, fmt, regCat} from '../l56';

// SC04 anchors (s, abs): 134.2 Insert | 138.2 PivotTable | 140.1 From Data Model | 141.6 OK | 143.8/145.6/148.3 tick Category/Region/Amount | 148.7 spool | 158.3 no lookups | 160.5 no helper tables | 166.0 slicer Delta | 169.0 clear
const S = START.s4;
const t = (g: number) => sec(g - S);
const INS = tabBox('Insert');
const PIVB = ribbonItemBox('Insert', 'PivotTable');
const MN = {x: PIVB.x, y: XL.title + XL.tabs + XL.ribbon, w: 250};
const MI = ['From Table/Range', 'From External Data Source', 'From Data Model', 'From Power BI'];
const miY = menuItemY(MN.y, MI.map((l) => ({label: l})), 2);
const DLG = {x: 560, y: 250, w: 420, h: 176};
const OK = {x: DLG.x + DLG.w - 150, y: DLG.y + DLG.h - 26};
const PANE_ROWS: Array<[string, number]> = [['Dim_Customer', 0], ['Dim_Date', 0], ['Dim_Product', 0], ['ProductKey', 1], ['ProductName', 1], ['Category', 1], ['UnitPrice', 1], ['Dim_Store', 0], ['StoreKey', 1], ['StoreName', 1], ['City', 1], ['Region', 1], ['Fact_Sales', 0], ['SaleID', 1], ['Quantity', 1], ['Amount', 1]];
const rowY = (i: number) => 232 + i * 20 + 10;
const CHK = (i: number) => ({x: 1236 + 36, y: rowY(i)});
const SLC = {x: 840, y: 230};
const DELTA = {x: SLC.x + 75, y: SLC.y + 22 + REGIONS.indexOf('Delta') * 24 + 12};
const PTS: Wp[] = [
  {f: 0, x: 760, y: 560}, {f: t(133.9), x: INS.cx, y: 48}, {f: t(134.2), x: INS.cx, y: 48},
  {f: t(137.9), x: PIVB.cx, y: PIVB.cy}, {f: t(138.2), x: PIVB.cx, y: PIVB.cy}, {f: t(139.9), x: MN.x + 80, y: miY}, {f: t(140.1), x: MN.x + 80, y: miY},
  {f: t(141.4), x: OK.x + 40, y: OK.y + 12}, {f: t(141.6), x: OK.x + 40, y: OK.y + 12},
  {f: t(143.6), ...CHK(5)}, {f: t(143.8), ...CHK(5)}, {f: t(145.4), ...CHK(11)}, {f: t(145.6), ...CHK(11)}, {f: t(148.1), ...CHK(15)}, {f: t(148.3), ...CHK(15)},
  {f: t(165.8), ...DELTA}, {f: t(166.0), ...DELTA}, {f: t(168.8), ...DELTA}, {f: t(169.0), ...DELTA}, {f: t(170.0), x: 700, y: 500},
];
const CLICKS = [134.2, 138.2, 140.1, 141.6, 143.8, 145.6, 148.3, 166.0, 169.0].map(t);
const colW4 = (c: number) => [0, 150, 100, 100, 100, 100, 100, 110][c] ?? 64;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const menuOn = f >= t(138.2) && f < t(140.3);
  const dlg = prog(f, t(140.3), 8) * (1 - prog(f, t(141.7), 6));
  const paneOn = prog(f, t(141.8), 10);
  const ticks: Record<string, boolean> = {Category: at(143.8), Region: at(145.6), Amount: at(148.3)};
  const sel = at(166.0) && !at(169.0) ? 'Delta' : null;
  const colShow = (k: number) => at(148.7 + k * 0.16);
  const regs = REGIONS.filter((r) => !sel || r === sel);
  const full = ticks.Amount && ticks.Region && ticks.Category;
  const cell = (r: number, c: number): CellV | undefined => {
    if (!full) return paneOn > 0.5 && r === 3 && c === 1 ? {t: 'PivotTable1', b: true} : undefined;
    if (r === 3) return c === 1 ? {t: 'Sum of Amount', b: true} : c === 2 ? {t: 'Column Labels', b: true} : undefined;
    if (r === 4) return c === 1 ? {t: 'Row Labels', b: true, bg: '#DDEBF7'} : c <= 6 ? (colShow(c - 2) ? {t: CATS[c - 2], b: true, bg: '#DDEBF7', al: 'r'} : undefined) : c === 7 ? (colShow(5) ? {t: 'Grand Total', b: true, bg: '#DDEBF7', al: 'r'} : undefined) : undefined;
    const i = r - 5;
    const rowSum = (g: string) => CATS.reduce((a, k) => a + regCat(g, k), 0);
    if (i >= 0 && i < regs.length) {
      const g = regs[i];
      if (c === 1) return {t: g};
      if (c >= 2 && c <= 6) return colShow(c - 2) ? {t: fmt(regCat(g, CATS[c - 2])), num: 1, al: 'r'} : undefined;
      if (c === 7) return colShow(5) ? {t: fmt(rowSum(g)), num: 1, al: 'r', b: true} : undefined;
    }
    if (i === regs.length) {
      if (c === 1) return {t: 'Grand Total', b: true, bg: '#F2F2F2'};
      if (c >= 2 && c <= 6) return colShow(c - 2) ? {t: fmt(regs.reduce((a, g) => a + regCat(g, CATS[c - 2]), 0)), num: 1, al: 'r', b: true, bg: '#F2F2F2'} : undefined;
      if (c === 7) return colShow(5) ? {t: fmt(regs.reduce((a, g) => a + rowSum(g), 0)), num: 1, al: 'r', b: true, bg: '#F2F2F2'} : undefined;
    }
    return undefined;
  };
  const slc = prog(f, t(164.0), 10);
  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="fade">
      <Host tab={at(134.4) ? 'Insert' : 'Home'} cell={cell} colW={colW4} sheets={['Report']} sheet="Report" glow={at(148.7) ? C.green : undefined} ribbonHot={menuOn ? 'PivotTable' : undefined}>
        {menuOn ? <Menu x={MN.x} y={MN.y} w={MN.w} items={menuOf(MI, f >= t(139.8) ? 'From Data Model' : '')} /> : null}
        {dlg > 0.01 ? (
          <div style={{position: 'absolute', left: DLG.x, top: DLG.y, width: DLG.w, height: DLG.h, background: '#fff', border: '1px solid #888', boxShadow: '0 12px 40px rgba(0,0,0,.4)', zIndex: 40, opacity: dlg, fontFamily: 'sans-serif', fontSize: 12.5}}>
            <div style={{height: 28, background: '#F3F3F3', borderBottom: '1px solid #ddd', padding: '0 10px', lineHeight: '28px', fontWeight: 700}}>PivotTable from Data Model</div>
            <div style={{padding: '10px 14px'}}>Choose where you want the PivotTable to be placed</div>
            <div style={{padding: '0 24px', lineHeight: '22px'}}>◉ New Worksheet<br />○ Existing Worksheet</div>
            {[['OK', OK.x - DLG.x - 0, true], ['Cancel', OK.x - DLG.x + 90, false]].map(([l, x, ok]) => (
              <div key={String(l)} style={{position: 'absolute', left: Number(x), top: DLG.h - 40, width: 80, height: 26, border: `1px solid ${ok ? '#107C41' : '#999'}`, background: ok ? '#E6F2EA' : '#fff', textAlign: 'center', lineHeight: '24px'}}>{l}</div>
            ))}
          </div>
        ) : null}
        {paneOn > 0.01 ? (
          <div style={{position: 'absolute', left: 1236, top: 160, width: 300, height: 432, background: '#fff', borderLeft: '1px solid #C8C8C8', boxShadow: '-6px 0 18px rgba(0,0,0,.12)', fontFamily: 'sans-serif', zIndex: 10, opacity: paneOn}}>
            <div style={{height: 26, padding: '0 12px', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center'}}>PivotTable Fields</div>
            <div style={{padding: '0 12px', fontSize: 11.5, color: '#555'}}>Choose fields to add to report</div>
            <div style={{display: 'flex', gap: 18, padding: '6px 12px', fontSize: 12, borderBottom: '1px solid #E0E0E0', marginTop: 4}}><span style={{color: '#555'}}>ACTIVE</span><b style={{borderBottom: '2px solid #107C41'}}>ALL</b></div>
            {PANE_ROWS.map(([n, leaf], i) => (
              <div key={n} style={{position: 'absolute', left: leaf ? 34 : 12, top: rowY(i) - 160 - 10, height: 20, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6}}>
                {leaf ? (<span style={{width: 13, height: 13, border: '1px solid #666', background: ticks[n] ? '#107C41' : '#fff', color: '#fff', fontSize: 10, lineHeight: '11px', textAlign: 'center', display: 'inline-block'}}>{ticks[n] ? '✓' : ''}</span>) : <span style={{fontSize: 10, color: '#555'}}>▸</span>}
                <span style={{fontWeight: leaf ? 400 : 700}}>{n}</span>
              </div>
            ))}
          </div>
        ) : null}
        {slc > 0.01 ? (
          <div style={{position: 'absolute', left: SLC.x, top: SLC.y, width: 150, background: '#fff', border: '1.5px solid #6B7785', boxShadow: '0 4px 12px rgba(0,0,0,.25)', opacity: slc, zIndex: 9, fontFamily: 'sans-serif'}}>
            <div style={{height: 22, background: '#DDE6F0', fontSize: 12, fontWeight: 700, padding: '0 8px', lineHeight: '22px'}}>Region (Dim_Store)</div>
            {REGIONS.map((s) => <div key={s} style={{height: 24, fontSize: 12.5, lineHeight: '24px', padding: '0 10px', background: sel === s ? '#107C41' : '#fff', color: sel === s ? '#fff' : '#222', borderTop: '1px solid #EEE'}}>{s}</div>)}
          </div>
        ) : null}
        <Tag x={300} y={430} text="0 lookup formulas ──► the relationships do the join" color={C.green} p={prog(f, t(158.3), 10) * (1 - prog(f, t(164.0), 10))} dark />
        <Tag x={300} y={466} text="No helper tables ──► Fact + Dimensions stay separate" color={C.green} p={prog(f, t(160.5), 10) * (1 - prog(f, t(164.0), 10))} dark />
        <Pointer f={f} pts={PTS} clicks={CLICKS} hide={at(170.4)} />
      </Host>
      <Caption text="Operational Model Execution ──► Insert ──► PivotTable ──► From Data Model" from={t(132.0)} to={t(148.0)} />
      <Caption text="Multi-Dimensional Aggregation ──► Consolidates Products, Stores & Sales Instantly" from={t(152.0)} to={t(168.0)} tone="ok" />
    </Stage>
  );
};
