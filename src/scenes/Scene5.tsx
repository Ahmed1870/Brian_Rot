import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Menu, Stage, XL, CellV, ribbonItemBox, menuItemY, pop, prog, sec} from '../kit';
import {CATS, PPWin, RelId, RelLine, STAR, STORES, TableBox, TId, TState, fieldX, fieldY, pivot} from '../lp';
import {Pointer, Wp, menuOf} from '../lq';
import {Host} from '../l46';
import {DragChip, Tag, colW54, factCell, ptrAt, relSt} from '../l54';

// SC05 anchors (s, abs): 171 file+counts | 177.1-183.3 four drags | 184.0 star done | 185.4 Insert>PivotTable | 186.3 From Data Model | 187.0-188.4 tick fields | 188.6 pivot | 192.0 slicer Giza | 196.0 clear | 198.4 seal
const S = START.s5;
const t = (g: number) => sec(g - S);
const P = STAR;
const DR: Array<{rel: RelId; dim: TId; fi: number; grab: number; drop: number; name: string}> = [
  {rel: 'cust', dim: 'cust', fi: 2, grab: 177.1, drop: 178.4, name: 'CustomerKey'}, {rel: 'date', dim: 'date', fi: 4, grab: 179.2, drop: 180.4, name: 'DateKey'},
  {rel: 'store', dim: 'store', fi: 3, grab: 181.0, drop: 182.0, name: 'StoreKey'}, {rel: 'prod', dim: 'prod', fi: 1, grab: 182.6, drop: 183.5, name: 'ProductKey'},
];
const kp = (d: TId) => ({x: fieldX(d, P), y: fieldY(d, P, 0)});
const fp = (i: number) => ({x: fieldX('fact', P), y: fieldY('fact', P, i)});
const PTS_A: Wp[] = [{f: 0, x: 760, y: 560}];
DR.forEach((d) => { PTS_A.push({f: t(d.grab - 0.1), ...kp(d.dim)}); PTS_A.push({f: t(d.drop - 0.1), ...fp(d.fi)}); });
PTS_A.push({f: t(184.4), x: 760, y: 560});
const CL_A = DR.map((d) => t(d.grab));

const PIVB = ribbonItemBox('Insert', 'PivotTable');
const MN = {x: PIVB.x, y: XL.title + XL.tabs + XL.ribbon, w: 250};
const MI = ['From Table/Range', 'From External Data Source', 'From Data Model', 'From Power BI'];
const miY = menuItemY(MN.y, MI.map((l) => ({label: l})), 2);
const PANE_ROWS: Array<[string, number]> = [['Dim_Customer', 0], ['Dim_Date', 0], ['Dim_Product', 0], ['ProductKey', 1], ['ProductName', 1], ['Category', 1], ['UnitPrice', 1], ['Dim_Store', 0], ['StoreKey', 1], ['StoreName', 1], ['City', 1], ['Region', 1], ['Fact_Sales', 0], ['SaleID', 1], ['Quantity', 1], ['Amount', 1]];
const rowY = (i: number) => 232 + i * 20 + 10;
const CHK = (i: number) => ({x: 1236 + 36, y: rowY(i)});
const SLC = {x: 800, y: 230};
const GIZA = {x: SLC.x + 75, y: SLC.y + 24 + STORES.indexOf('Giza') * 24 + 12};
const PTS_B: Wp[] = [
  {f: 0, x: 700, y: 520}, {f: t(185.1), x: PIVB.cx, y: PIVB.cy}, {f: t(185.4), x: PIVB.cx, y: PIVB.cy}, {f: t(186.2), x: MN.x + 80, y: miY}, {f: t(186.35), x: MN.x + 80, y: miY},
  {f: t(186.9), ...CHK(5)}, {f: t(187.0), ...CHK(5)}, {f: t(187.6), ...CHK(10)}, {f: t(187.7), ...CHK(10)}, {f: t(188.3), ...CHK(15)}, {f: t(188.4), ...CHK(15)},
  {f: t(191.8), ...GIZA}, {f: t(192.0), ...GIZA}, {f: t(195.8), ...GIZA}, {f: t(196.0), ...GIZA}, {f: t(197.0), x: 700, y: 480},
];
const CL_B = [185.4, 186.35, 187.0, 187.7, 188.4, 192.0, 196.0].map(t);
const fmt = (n: number) => n.toLocaleString('en-US');
const colW5 = (c: number) => [0, 130, 100, 100, 100, 100, 100, 110][c] ?? 64;
const CAT5 = CATS;
const ST5 = STORES;

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const ppOpen = 1 - prog(f, t(184.4), 10);
  const cnt = prog(f, t(171.4), 70);
  const labels: Record<TId, string> = {fact: `${fmt(Math.round(50000 * cnt))} rows`, cust: `${Math.round(400 * cnt)} rows`, date: `${Math.round(365 * cnt)} rows`, prod: `${Math.round(8 * cnt)} rows`, store: `${Math.round(5 * cnt)} rows`};
  const dragA = DR.find((d) => at(d.grab + 0.3) && !at(d.drop));
  const ptA = ptrAt(f, PTS_A);
  const stT = (id: TId): TState => {
    const fg: Record<number, string> = {};
    DR.forEach((d) => { if (at(d.grab) && !at(d.drop + 0.8)) { if (d.dim === id) fg[0] = C.purple; if (id === 'fact') fg[d.fi] = C.blue; } });
    return {rowsLabel: labels[id], fieldGlow: Object.keys(fg).length ? fg : undefined};
  };
  const menuOn = f >= t(185.4) && f < t(186.5);
  const paneOn = prog(f, t(186.5), 10);
  const ticks: Record<string, boolean> = {Category: at(187.0), City: at(187.7), Amount: at(188.4)};
  const sel = at(192.0) && !at(196.0) ? 'Giza' : null;
  const colShow = (k: number) => at(188.7 + k * 0.18);
  const rowsShown = ST5.filter((s) => !sel || s === sel);
  const cell = (r: number, c: number): CellV | undefined => {
    if (!ticks.Amount || !ticks.City || !ticks.Category) return paneOn > 0.5 && r === 3 && c === 1 ? {t: 'PivotTable1', b: true} : undefined;
    if (r === 3) return c === 1 ? {t: 'Sum of Amount', b: true} : c === 2 ? {t: 'Column Labels', b: true} : undefined;
    if (r === 4) return c === 1 ? {t: 'Row Labels', b: true, bg: '#DDEBF7'} : c <= 6 ? (colShow(c - 2) ? {t: CAT5[c - 2], b: true, bg: '#DDEBF7', al: 'r'} : undefined) : c === 7 ? (colShow(5) ? {t: 'Grand Total', b: true, bg: '#DDEBF7', al: 'r'} : undefined) : undefined;
    const i = r - 5;
    if (i >= 0 && i < rowsShown.length) {
      const s = rowsShown[i];
      if (c === 1) return {t: s};
      if (c >= 2 && c <= 6) return colShow(c - 2) ? {t: fmt(pivot(s, CAT5[c - 2])), num: 1, al: 'r'} : undefined;
      if (c === 7) return colShow(5) ? {t: fmt(CAT5.reduce((a, k) => a + pivot(s, k), 0)), num: 1, al: 'r', b: true} : undefined;
    }
    if (i === rowsShown.length) {
      if (c === 1) return {t: 'Grand Total', b: true, bg: '#F2F2F2'};
      if (c >= 2 && c <= 6) return colShow(c - 2) ? {t: fmt(rowsShown.reduce((a, s) => a + pivot(s, CAT5[c - 2]), 0)), num: 1, al: 'r', b: true, bg: '#F2F2F2'} : undefined;
      if (c === 7) return colShow(5) ? {t: fmt(rowsShown.reduce((a, s) => a + CAT5.reduce((x, k) => x + pivot(s, k), 0), 0)), num: 1, al: 'r', b: true, bg: '#F2F2F2'} : undefined;
    }
    return undefined;
  };
  const slc = prog(f, t(190.6), 10);
  return (
    <Stage dur={SCENES.s5.dur} inFx="up" outFx="fade">
      <Host tab={at(184.6) ? 'Insert' : 'Home'} cell={cell} colW={colW5} sheets={['Report']} sheet="Report" glow={C.green} ribbonHot={menuOn ? 'PivotTable' : undefined}>
        {ppOpen > 0.01 ? (
          <PPWin open={ppOpen} view="diagram">
            {DR.map((d) => <RelLine key={d.rel} r={d.rel} pos={P} f={f} st={relSt(f, t(d.drop), {one: t(d.drop) + 10, many: t(d.drop) + 18, arrow: t(d.drop) + 26, color: C.green})} />)}
            {(['prod', 'cust', 'store', 'date', 'fact'] as TId[]).map((id) => <TableBox key={id} id={id} pos={P[id]} st={stT(id)} />)}
            <Tag x={P.fact.x} y={P.fact.y - 34} text="manzooma_sales_2026.xlsx" color={C.blue} p={prog(f, t(171.0), 10)} dark />
            <Tag x={P.fact.x + 20} y={P.fact.y + 210} text="✓ 4 active 1:* relationships" color={C.green} p={prog(f, t(184.0), 10)} dark />
            {dragA ? <DragChip x={ptA.x} y={ptA.y} text={dragA.name} p={1} /> : null}
            <Pointer f={f} pts={PTS_A} clicks={CL_A} hide={at(184.3)} />
          </PPWin>
        ) : null}
        {menuOn ? <Menu x={MN.x} y={MN.y} w={MN.w} items={menuOf(MI, f >= t(186.1) ? 'From Data Model' : '')} /> : null}
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
        {slc > 0.01 && ppOpen < 0.01 ? (
          <div style={{position: 'absolute', left: SLC.x, top: SLC.y, width: 150, background: '#fff', border: '1.5px solid #6B7785', boxShadow: '0 4px 12px rgba(0,0,0,.25)', opacity: slc, zIndex: 9, fontFamily: 'sans-serif'}}>
            <div style={{height: 22, background: '#DDE6F0', fontSize: 12, fontWeight: 700, padding: '0 8px', lineHeight: '22px'}}>City (Dim_Store)</div>
            {ST5.map((s) => <div key={s} style={{height: 24, fontSize: 12.5, lineHeight: '24px', padding: '0 10px', background: sel === s ? '#107C41' : '#fff', color: sel === s ? '#fff' : '#222', borderTop: '1px solid #EEE'}}>{s}</div>)}
          </div>
        ) : null}
        {ppOpen < 0.01 ? <Pointer f={f} pts={PTS_B} clicks={CL_B} hide={at(197.2)} /> : null}
      </Host>
      <div style={{position: 'absolute', left: 1330, top: 560, width: 420, padding: '10px 0 14px', borderRadius: 24, background: 'rgba(11,18,34,0.92)', border: `2px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}66`, textAlign: 'center', opacity: pop(f, t(198.4)), transform: `scale(${0.7 + 0.3 * pop(f, t(198.4))})`, zIndex: 9}} dir="ltr">
        <svg width={150} height={150} viewBox="0 0 230 230"><circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} /><circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" /><polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.green, marginTop: -4}}>ENTERPRISE STAR SCHEMA</div>
        <div style={{fontFamily: MONO, fontSize: 19, color: C.text}}>50,000 rows · 4 active relationships</div>
      </div>
      <Caption text="Enterprise Star Schema Pipeline ──► Build 4 Active Relationships Across 50,000 Sales Rows" from={t(172.0)} to={t(190.0)} />
      <Caption text="Fast Relational Queries ──► High-Speed Star Schema Engine Over 50,000 Rows" from={t(193.0)} to={t(208.0)} tone="ok" />
    </Stage>
  );
};
