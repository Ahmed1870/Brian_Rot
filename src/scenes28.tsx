import React from 'react';
import {COL, XL} from './theme';
import {ANCH, SCENE_END, SCENE_START} from './sync';
import {Box, Cell, Geo, Seal, Sel, View, colName, pe, pg, ribbonLayout, tabRect} from './kit';
import {K, band, hdrC, hwFor, one, path, rng} from './data';
import {BIG, BR, CAT, Flt, N1, N2, PROD, REGION, avg, dateStr, fmt, fmt2, pct, row, sum} from './data28';
import {CreateDlg, DG, FIELDS, FieldPane, Menu, MI, PANE, R, SHOW, SUMM, SlicerDlg, Slicer, Timeline, TimelineDlg, VFS, VfsDlg, Z, Zones, center, menuItemRect, okPos, paneChip, paneField, paneZone} from './pivotkit';

type Out = {v: View; zoom: number; zx: number; zy: number};
const A = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
const END = (i: number) => SCENE_END[i] - SCENE_START[i];
const emer = (a: number) => `rgba(16,185,129,${a})`;
const wrap = (o: number, kids: React.ReactNode) => <div style={{position: 'absolute', inset: 0, opacity: o}}>{kids}</div>;
const wc = (p: {x: number; y: number}) => ({x: p.x, y: p.y - 192});
const wcK = (t: number, p: {x: number; y: number}, kind?: 'arrow' | 'cross'): K => [t, p.x, p.y - 192, kind];
const sheetTab = (names: string[], i: number): R => ({x: 54 + names.slice(0, i).reduce((a, n) => a + n.length * 7.2 + 28, 0), y: 512, w: names[i].length * 7.2 + 24, h: 23});
const PIV_HDR = (t: string, dd?: boolean): Cell => ({t, b: true, bg: '#DDEBF7', bb: '#8EA9DB', dd, al: 'l'});
const PIV_GT = (t: string): Cell => ({t, b: true, bg: '#DDEBF7', bt: '#8EA9DB', al: t === 'Grand Total' ? 'l' : undefined});
const DATA_W = [80, 70, 110, 90, 90, 100, 70];
const dataCell = (r: number, c: number, n: number): Cell | undefined => {
  if (r === 1) return c < 7 ? hdrC(FIELDS[c]) : undefined;
  if (r < 2 || r > n + 1 || c > 6) return undefined;
  const x = row(r - 2), bg = band(r);
  return [{t: dateStr(x.day), bg, al: 'r'}, {t: x.br, bg}, {t: REGION[x.br], bg}, {t: x.cat, bg}, {t: x.prod, bg}, {t: String(x.sales), bg}, {t: String(x.profit), bg}][c] as Cell;
};
const Ghost: React.FC<{p: {x: number; y: number} | null; t: string}> = ({p, t}) => p ? <div style={{position: 'absolute', left: p.x + 8, top: p.y + 10, padding: '2px 8px', background: '#fff', border: '1px solid #0F6CBD', boxShadow: '0 3px 8px rgba(0,0,0,.3)', fontFamily: 'sans-serif', fontSize: 12, whiteSpace: 'nowrap', opacity: 0.95}}>{t}</div> : null;
const cursorOf = (t: number, ks: K[]) => path(t, ks);

// ============================ SCENE 1: Insert PivotTable ============================
export const T1 = {down: A(0, 0) + 3.0, home: A(0, 0) + 6.5};
export const s1 = (t: number): Out => {
  const a1 = A(0, 1), a2 = A(0, 2), a3 = A(0, 3);
  const tI = a1 + 2.0, tPB = a1 + 3.8, tD0 = a1 + 4.0, tOK = a1 + 8.2, tDropR = a2 + 1.9, tDropV = a2 + 4.1;
  const rb = ribbonLayout('insert').pos.pivot, okb = okPos(DG.create);
  const catF = center(paneField('Category')), rZ = center(paneChip('R', 0)), salF = center(paneField('Sales Amount')), vZ = center(paneChip('V', 0));
  const insTab = center(tabRect(2, false)), pbc = center(rb), okc = center(okb);
  const ks: K[] = [
    [0, 760, 130], [T1.down - 0.5, 760, 130], [a1, 760, 130], wcK(a1 + 0.9, {x: 60, y: 232}), wcK(tI - 0.4, {x: 60, y: 232}), wcK(tI, insTab), wcK(tPB - 0.5, insTab), wcK(tPB - 0.1, pbc), wcK(tOK - 0.8, pbc), wcK(tOK - 0.1, okc), wcK(tOK + 0.5, okc),
    wcK(a2 + 0.3, catF), wcK(a2 + 0.5, catF), wcK(tDropR, rZ, 'arrow'), wcK(a2 + 2.4, rZ), wcK(a2 + 2.6, salF), wcK(tDropV, vZ), wcK(a3 + 1.0, {x: 175, y: 244}), wcK(END(0), {x: 175, y: 244}),
  ];
  const dragging = (t >= a2 + 0.5 && t < tDropR) ? 'Category' : (t >= a2 + 2.6 && t < tDropV) ? 'Sales Amount' : null;
  const cur = cursorOf(t, ks);
  if (t < tOK + 0.3) {
    const top = t >= T1.down && t < T1.home ? 2390 : 2;
    let sel: Sel = one(1, 0), name: string | undefined;
    if (t >= a1 + 0.9) sel = one(2, 0);
    if (t >= T1.down && t < T1.home) { sel = one(2401, 0); }
    const v: View = {top, freeze: true, hw: hwFor(top + 14), widths: DATA_W, cell: (r, c) => dataCell(r, c, N1), sel, name, tab: t >= tI ? 2 : 1, ribbon: t >= tI ? 'insert' : 'home', hi: t >= tPB - 0.4 && t < tD0 + 0.3 ? 'pivot' : undefined,
      layer: t >= tD0 ? <CreateDlg okHot={t >= tOK - 0.3}/> : null, cursor: () => wc(cur) && {...wc(cur), k: cur.k}, sheet: 0, sheets: ['tbl_Sales'], file: 'Pivot_Practice'};
    return {v, zoom: 1, zx: 0, zy: 0};
  }
  const zones: Zones = {F: [], C: [], R: t >= tDropR ? ['Category'] : [], V: t >= tDropV ? ['Sales Amount'] : []};
  const tSw = (k: number) => tDropV + 0.2 + k * 0.25;
  const cell = (r: number, c: number): Cell | undefined => {
    if (!zones.R.length) {
      if (r >= 3 && r <= 12 && c <= 2) return {t: r === 3 && c === 0 ? 'PivotTable1' : r === 4 && c === 0 ? 'To build a report, choose fields' : r === 5 && c === 0 ? 'from the PivotTable Field List' : '', bg: '#EEF3FA', b: r === 3 && c === 0, ovf: false};
      return undefined;
    }
    if (r === 3) return c === 0 ? PIV_HDR('Row Labels', true) : c === 1 && zones.V.length ? PIV_HDR('Sum of Sales Amount') : undefined;
    if (r >= 4 && r <= 6) {
      if (c === 0) return {t: CAT[r - 4]};
      if (c === 1 && zones.V.length) { const g1 = 1 - pg(t, tSw(r - 4), tSw(r - 4) + 1.2); return {t: fmt(sum(N1, 'sales', {cat: CAT[r - 4]})), bg: t >= tSw(r - 4) && g1 > 0.02 ? emer(0.5 * g1) : t < tSw(r - 4) ? '#fff' : undefined}; }
      return undefined;
    }
    if (r === 7) return c === 0 ? PIV_GT('Grand Total') : c === 1 ? (zones.V.length ? {...PIV_GT(fmt(sum(N1, 'sales', {}))), al: 'r'} : PIV_GT('')) : undefined;
    return undefined;
  };
  let sel: Sel = one(3, 0), fb = '';
  if (t >= a3 + 1.0) { sel = one(5, 1); fb = fmt(sum(N1, 'sales', {cat: CAT[1]})); }
  const ov = (g: Geo) => (
    <div style={{position: 'absolute', inset: 0}}>
      {wrap(pe(t, tDropV + 0.4, tDropV + 1.0) * (1 - pe(t, a3 + 4, a3 + 6)), <Box r={g.rect(3, 0, 7, 1)} c={COL.green} w={2.5} glow={0.8}/>)}
    </div>
  );
  const v: View = {top: 1, freeze: false, widths: [150, 150, 100], cell, sel, fb, ov, paneW: PANE.w, pane: <FieldPane zones={zones} hotField={dragging ?? undefined}/>, ctx: true, tab: 2, ribbon: 'insert',
    layer: <Ghost p={dragging ? cur : null} t={dragging ?? ''}/>, cursor: () => ({...wc(cur), k: cur.k}), sheet: 0, sheets: ['Sheet1', 'tbl_Sales'], file: 'Pivot_Practice'};
  return {v, zoom: 1 + 0.18 * pe(t, 37.4, 39.8), zx: 1100, zy: 300};
};

// ============================ SCENE 2: 4 zones + Value Field Settings ============================
type Mode = 'sum' | 'avg' | 'pct';
export const crossCells = (t: number, mode: Mode, withFilter: boolean, branchOn: number, f: Flt = {}, n = N1): ((r: number, c: number) => Cell | undefined) => (r, c) => {
  const base = (cat?: string, br?: string) => mode === 'avg' ? avg(n, {cat, br}, f) : sum(n, 'sales', {cat, br}, f);
  const gt = sum(n, 'sales', {}, f);
  const show = (cat?: string, br?: string) => mode === 'pct' ? pct(base(cat, br) / gt) : mode === 'avg' ? fmt2(base(cat, br)) : fmt(base(cat, br));
  const nm = mode === 'avg' ? 'Average of Sales Amount' : 'Sum of Sales Amount';
  if (withFilter && r === 1) return c === 0 ? {t: 'Region', b: true} : c === 1 ? {t: '(All)', dd: true, bg: '#fff'} : undefined;
  const hasB = branchOn > 0;
  if (!hasB) {
    if (r === 3) return c === 0 ? PIV_HDR('Row Labels', true) : c === 1 ? PIV_HDR(nm) : undefined;
    if (r >= 4 && r <= 6) return c === 0 ? {t: CAT[r - 4]} : c === 1 ? {t: show(CAT[r - 4])} : undefined;
    if (r === 7) return c === 0 ? PIV_GT('Grand Total') : c === 1 ? {...PIV_GT(show()), al: 'r'} : undefined;
    return undefined;
  }
  const bgOf = (cc: number) => { const g1 = 1 - pg(t, branchOn + cc * 0.08, branchOn + cc * 0.08 + 1.2); return t >= branchOn && g1 > 0.02 ? emer(0.45 * g1) : undefined; };
  if (r === 3) return c === 0 ? {t: nm, b: true, bg: '#DDEBF7', ovf: true, al: 'l'} : c === 1 ? PIV_HDR('Column Labels', true) : c <= 6 ? {t: '', bg: '#DDEBF7'} : undefined;
  if (r === 4) return c === 0 ? PIV_HDR('Row Labels', true) : c >= 1 && c <= 5 ? {...PIV_HDR(BR[c - 1]), al: 'r'} : c === 6 ? {...PIV_HDR('Grand Total'), al: 'r'} : undefined;
  if (r >= 5 && r <= 7) {
    const cat = CAT[r - 5];
    if (c === 0) return {t: cat};
    if (c >= 1 && c <= 5) return {t: show(cat, BR[c - 1]), bg: bgOf(c)};
    if (c === 6) return {t: show(cat), b: true, bg: bgOf(6)};
  }
  if (r === 8) return c === 0 ? PIV_GT('Grand Total') : c >= 1 && c <= 5 ? {...PIV_GT(show(undefined, BR[c - 1])), al: 'r'} : c === 6 ? {...PIV_GT(show()), al: 'r'} : undefined;
  return undefined;
};
const MENU_V: MI[] = [{t: 'Move Up', dis: true}, {t: 'Move Down', dis: true}, {t: 'Move to Beginning', dis: true}, {t: 'Move to End', dis: true}, {t: '', sep: true}, {t: 'Move to Report Filter'}, {t: 'Move to Row Labels'}, {t: 'Move to Column Labels'}, {t: 'Move to Values', dis: true}, {t: '', sep: true}, {t: 'Remove Field'}, {t: 'Value Field Settings...'}];
export const s2 = (t: number): Out => {
  const a0 = A(1, 0), a1 = A(1, 1), a2 = A(1, 2);
  const tDropC = a1 + 1.9, tDropF = a1 + 4.5;
  const m1 = {menu: a2 + 1.0, hot: a2 + 1.7, dlg: a2 + 2.0, avg: a2 + 3.0, ok: a2 + 4.2};
  const m2 = {menu: a2 + 5.6, hot: a2 + 6.2, dlg: a2 + 6.4, sum: a2 + 7.2, tab: a2 + 7.9, dd: a2 + 8.7, pick: a2 + 9.6, ok: a2 + 10.8};
  const mode: Mode = t >= m2.ok ? 'pct' : t >= m1.ok ? 'avg' : 'sum';
  const zones: Zones = {F: t >= tDropF ? ['Region'] : [], C: t >= tDropC ? ['Branch'] : [], R: ['Category'], V: ['Sales Amount']};
  const glow: Z | null = t >= a0 + 3.8 && t < a0 + 5.3 ? 'R' : t >= a0 + 5.3 && t < a0 + 6.8 ? 'C' : t >= a0 + 6.8 && t < a0 + 8.3 ? 'V' : t >= a0 + 8.3 && t < a0 + 9.8 ? 'F' : null;
  const chip = paneChip('V', 0), arrow = {x: chip.x + chip.w - 8, y: chip.y + 9};
  const mx = PANE.x + 14, my = 246, mItems = MENU_V;
  const menuHot = center(menuItemRect(mx, my, 226, mItems, 11));
  const okc = center(okPos(DG.vfs)), brF = center(paneField('Branch')), cZ = center(paneChip('C', 0)), rgF = center(paneField('Region')), fZ = center(paneChip('F', 0));
  const ks: K[] = [
    [0, 760, -60], [a0 + 2, 760, -60], wcK(a1 + 0.4, brF), wcK(a1 + 0.6, brF), wcK(tDropC, cZ, 'arrow'), wcK(a1 + 2.6, cZ), wcK(a1 + 3.0, rgF), wcK(tDropF, fZ), wcK(a2 + 0.3, arrow), wcK(m1.menu - 0.2, arrow), wcK(m1.hot, menuHot), wcK(m1.dlg + 0.1, menuHot),
    wcK(m1.avg - 0.4, center(VFS.item(2))), wcK(m1.avg, center(VFS.item(2))), wcK(m1.ok - 0.4, okc), wcK(m1.ok, okc), wcK(m2.menu - 0.4, arrow), wcK(m2.menu, arrow), wcK(m2.hot, menuHot), wcK(m2.dlg + 0.1, menuHot),
    wcK(m2.sum - 0.4, center(VFS.item(0))), wcK(m2.sum, center(VFS.item(0))), wcK(m2.tab - 0.3, center(VFS.tab1)), wcK(m2.tab, center(VFS.tab1)), wcK(m2.dd - 0.3, center(VFS.dd)), wcK(m2.dd, center(VFS.dd)),
    wcK(m2.pick - 0.3, center(VFS.ddItem(1))), wcK(m2.pick, center(VFS.ddItem(1))), wcK(m2.ok - 0.3, okc), wcK(m2.ok, okc), wcK(END(1) - 5, {x: 600, y: 330}),
  ];
  const cur = cursorOf(t, ks);
  const drag = t >= a1 + 0.6 && t < tDropC ? 'Branch' : t >= a1 + 3.0 && t < tDropF ? 'Region' : null;
  const showMenu = (t >= m1.menu && t < m1.dlg) || (t >= m2.menu && t < m2.dlg);
  const menuHotIdx = (t >= m1.hot && t < m1.dlg) || (t >= m2.hot && t < m2.dlg) ? 11 : undefined;
  const dlg1 = t >= m1.dlg && t < m1.ok + 0.2, dlg2 = t >= m2.dlg && t < m2.ok + 0.2;
  const layer = (
    <div>
      <Ghost p={drag ? cur : null} t={drag ?? ''}/>
      {showMenu ? <Menu x={mx} y={my} w={226} items={mItems} hot={menuHotIdx}/> : null}
      {dlg1 ? <VfsDlg tab={0} summ={t >= m1.avg ? 'Average' : 'Sum'} show="No Calculation" open={false} custom={t >= m1.avg ? 'Average of Sales Amount' : 'Sum of Sales Amount'} okHot={t >= m1.ok - 0.3}/> : null}
      {dlg2 ? <VfsDlg tab={t >= m2.tab ? 1 : 0} summ={t >= m2.sum ? 'Sum' : 'Average'} show={t >= m2.pick ? '% of Grand Total' : 'No Calculation'} open={t >= m2.dd && t < m2.pick + 0.3} hotItem={t >= m2.pick - 0.5 ? 1 : undefined} custom={t >= m2.sum ? 'Sum of Sales Amount' : 'Average of Sales Amount'} okHot={t >= m2.ok - 0.3}/> : null}
    </div>
  );
  const cell = crossCells(t, mode, t >= tDropF, t >= tDropC ? tDropC : 0);
  const ov = (g: Geo) => (
    <div style={{position: 'absolute', inset: 0}}>
      {wrap(pe(t, m1.ok, m1.ok + 0.5) * (1 - pe(t, m1.ok + 2, m1.ok + 3)), <Box r={g.rect(5, 1, 8, 6)} c={COL.green} w={2.5} glow={0.7}/>)}
      {wrap(pe(t, m2.ok, m2.ok + 0.6), <Box r={g.rect(5, 1, 8, 6)} c={COL.blue} w={3} glow={0.9}/>)}
    </div>
  );
  const v: View = {top: 1, freeze: false, widths: t >= tDropC ? [150, 96, 96, 96, 96, 96, 100] : [150, 150, 100], cell, sel: one(5, 1), ov, paneW: PANE.w, pane: <FieldPane zones={zones} glow={glow} hotField={drag ?? undefined} valLabels={{'Sales Amount': mode === 'avg' ? 'Average of Sales Amount' : 'Sum of Sales Amount'}}/>,
    layer, cursor: () => ({...wc(cur), k: cur.k}), ctx: true, tab: 2, ribbon: 'insert', sheet: 0, sheets: ['Sheet1', 'tbl_Sales'], file: 'Pivot_Practice'};
  return {v, zoom: 1 + 0.18 * (1 - pe(t, 1.0, 3.0)), zx: 1100, zy: 300};
};

// ============================ SCENE 3: Report Layout ============================
const LAYOUT_MENU = (layout: string, rep: boolean): MI[] => [{t: 'Show in Compact Form', on: layout === 'compact'}, {t: 'Show in Outline Form'}, {t: 'Show in Tabular Form', on: layout === 'tabular'}, {t: '', sep: true}, {t: 'Repeat All Item Labels', on: rep}, {t: 'Do Not Repeat Item Labels', on: !rep}];
export const s3 = (t: number): Out => {
  const a0 = A(2, 0), a1 = A(2, 1), a2 = A(2, 2);
  const tDes = a1 + 0.8, tM1 = a1 + 3.0, tHot1 = a1 + 4.0, tTab = a1 + 4.7, tM2 = a2 + 0.8, tHot2 = a2 + 2.0, tRep = a2 + 2.6;
  const tabular = t >= tTab, rep = t >= tRep;
  const layout = tabular ? 'tabular' : 'compact';
  const rl = ribbonLayout('design').pos.layout;
  const mx = rl.x, my = rl.y + rl.h + 2;
  const items = LAYOUT_MENU(layout, rep);
  const ks: K[] = [
    [0, 700, 130], [a0 + 3, 700, 130], [a1 - 0.7, 70, 70], [a1 - 0.2, 70, 70], wcK(tDes, center(tabRect(12, true))), wcK(tM1 - 0.4, center(tabRect(12, true))), wcK(tM1 - 0.05, center(rl)), wcK(tHot1 - 0.4, center(menuItemRect(mx, my, 230, LAYOUT_MENU('compact', false), 2))), wcK(tTab - 0.1, center(menuItemRect(mx, my, 230, LAYOUT_MENU('compact', false), 2))),
    wcK(tM2 - 0.3, center(rl)), wcK(tM2, center(rl)), wcK(tHot2, center(menuItemRect(mx, my, 230, LAYOUT_MENU('tabular', false), 4))), wcK(tRep - 0.1, center(menuItemRect(mx, my, 230, LAYOUT_MENU('tabular', false), 4))), wcK(tRep + 1.2, {x: 700, y: 330}), wcK(END(2), {x: 700, y: 330}),
  ];
  const cur = cursorOf(t, ks);
  const showMenu = (t >= tM1 && t < tTab) || (t >= tM2 && t < tRep);
  const hotIdx = t >= tHot1 && t < tTab ? 2 : t >= tHot2 && t < tRep ? 4 : undefined;
  const cell = (r: number, c: number): Cell | undefined => {
    const SUMC = (cat: string, prodName?: string) => fmt(sum(N1, 'sales', {cat, prod: prodName}));
    if (r === 3) {
      if (!tabular) return c === 0 ? PIV_HDR('Row Labels', true) : c === 1 ? PIV_HDR('Sum of Sales Amount') : undefined;
      return c === 0 ? PIV_HDR('Category', true) : c === 1 ? PIV_HDR('Product', true) : c === 2 ? PIV_HDR('Sum of Sales Amount') : undefined;
    }
    if (r >= 4 && r <= 15) {
      const ci = Math.floor((r - 4) / 4), k = (r - 4) % 4, cat = CAT[ci];
      if (!tabular) {
        if (k === 0) return c === 0 ? {t: cat, b: true, bg: '#EEF4FB'} : c === 1 ? {t: SUMC(cat), b: true, bg: '#EEF4FB'} : undefined;
        return c === 0 ? {t: PROD[cat][k - 1], ind: 14} : c === 1 ? {t: SUMC(cat, PROD[cat][k - 1])} : undefined;
      }
      const g1 = (cc: number) => { const q = 1 - pg(t, tTab + cc * 0.2 + (r % 4) * 0.05, tTab + cc * 0.2 + 1.2); return q > 0.02 ? emer(0.45 * q) : undefined; };
      const gr = (rr: number) => { const q = 1 - pg(t, tRep + (rr % 4) * 0.1, tRep + (rr % 4) * 0.1 + 1.2); return q > 0.02 ? emer(0.55 * q) : undefined; };
      if (k < 3) {
        if (c === 0) { const show = k === 0 || rep; return {t: show ? cat : '', b: true, bg: t >= tRep && k > 0 ? gr(r) : undefined}; }
        if (c === 1) return {t: PROD[cat][k], bg: g1(1)};
        if (c === 2) return {t: SUMC(cat, PROD[cat][k]), bg: g1(2)};
      } else {
        if (c === 0) return {t: `${cat} Total`, b: true, bg: '#EEF4FB', bt: '#8EA9DB'};
        if (c === 1) return {t: '', bg: '#EEF4FB', bt: '#8EA9DB'};
        if (c === 2) return {t: SUMC(cat), b: true, bg: '#EEF4FB', bt: '#8EA9DB'};
      }
      return undefined;
    }
    if (r === 16) {
      if (!tabular) return c === 0 ? PIV_GT('Grand Total') : c === 1 ? {...PIV_GT(fmt(sum(N1, 'sales', {}))), al: 'r'} : undefined;
      return c === 0 ? PIV_GT('Grand Total') : c === 1 ? PIV_GT('') : c === 2 ? {...PIV_GT(fmt(sum(N1, 'sales', {}))), al: 'r'} : undefined;
    }
    return undefined;
  };
  const ov = (g: Geo) => (
    <div style={{position: 'absolute', inset: 0}}>
      {wrap(pe(t, a0 + 0.8, a0 + 1.6) * (1 - pe(t, tTab, tTab + 0.5)), <Box r={g.rect(3, 0, 16, 0)} c={COL.amber} w={2.5} glow={0.5 + 0.3 * Math.sin(t * 3.4)} dash/>)}
      {wrap(pe(t, tTab, tTab + 0.6) * (1 - pe(t, tTab + 3, tTab + 4)), <Box r={g.rect(3, 0, 16, 2)} c={COL.green} w={2.5} glow={0.8}/>)}
      {wrap(pe(t, tRep, tRep + 0.5), <Box r={g.rect(3, 0, 16, 2)} c={COL.green} w={2.5} glow={0.6}/>)}
    </div>
  );
  const zones: Zones = {F: [], C: [], R: ['Category', 'Product'], V: ['Sales Amount']};
  const v: View = {top: 1, freeze: false, widths: tabular ? [110, 110, 150] : [150, 150], cell, sel: one(4, 0), ov, paneW: PANE.w, pane: <FieldPane zones={zones}/>,
    layer: <div>{showMenu ? <Menu x={mx} y={my} w={230} items={items} hot={hotIdx}/> : null}</div>, cursor: () => ({...wc(cur), k: cur.k}), ctx: true, tab: t >= tDes + 0.2 ? 12 : 2, ribbon: t >= tDes + 0.2 ? 'design' : 'insert',
    hi: t >= tM1 - 0.3 && t < tM1 + 0.4 ? 'layout' : t >= tM2 - 0.3 && t < tM2 + 0.4 ? 'layout' : undefined, sheet: 0, sheets: ['Sheet1', 'tbl_Sales'], file: 'Pivot_Practice'};
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ============================ SCENE 4: slicers, timeline, refresh ============================
export const T4 = {down: A(3, 2) + 1.6, paste: A(3, 2) + 3.0};
const SX = 330, SY = 20, TX = 500, TY = 20;
export const s4 = (t: number): Out => {
  const a0 = A(3, 0), a1 = A(3, 1), a2 = A(3, 2), a3 = A(3, 3);
  const tAn = a0 + 0.5, tSl = a0 + 1.8, tSlD = a0 + 2.0, tChk = a0 + 3.2, tSlOK = a0 + 4.2, tTl = a0 + 5.0, tTlD = a0 + 5.2, tTlChk = a0 + 5.9, tTlOK = a0 + 6.7;
  const tCairo = a1 + 0.8, tGiza = a1 + 2.6, tMar = a1 + 4.2;
  const tData = a2 + 0.5, tDown = T4.down, tPaste = T4.paste, tPaste1 = a2 + 4.2, tSc0 = a2 + 4.4, tSc1 = a2 + 5.4, tBack = a2 + 6.2, tAn2 = a2 + 7.0, tRef = a2 + 8.0;
  const onData = t >= tData + 0.2 && t < tBack + 0.2;
  const sheets = ['Sheet1', 'tbl_Sales'];
  const an = ribbonLayout('analyze').pos, anTab = center(tabRect(11, true));
  const slB = center(an.slicer), tlB = center(an.timeline), refB = center(an.refresh);
  const dS = DG.slicers, dT = DG.timeline;
  const chkBr = {x: dS.x + 12 + 8 + 40, y: dS.y + 42 + 6 + 24 + 7}, chkTl = {x: dT.x + 12 + 8 + 20, y: dT.y + 42 + 6 + 7};
  const gridC = (gx: number, gy: number): K => [0, gx, gy];
  const cairo = {x: SX + 75, y: SY + 32 + 12}, giza = {x: SX + 75, y: SY + 32 + 12 + 26}, mar = {x: TX + 8 + (314 / 12) * 2.5, y: TY + 62};
  const t1 = center(sheetTab(sheets, 1)), t0 = center(sheetTab(sheets, 0));
  const kk = (tt: number, p: {x: number; y: number}): K => [tt, p.x, p.y];
  const ks: K[] = [
    [0, 760, -60], [a0, 760, -60], wcK(tAn, anTab), wcK(tSl - 0.1, slB), wcK(tChk - 0.3, chkBr), wcK(tChk, chkBr), wcK(tSlOK - 0.3, center(okPos(dS))), wcK(tSlOK, center(okPos(dS))), wcK(tTl - 0.1, tlB), wcK(tTlChk - 0.3, chkTl), wcK(tTlChk, chkTl), wcK(tTlOK - 0.3, center(okPos(dT))), wcK(tTlOK, center(okPos(dT))),
    kk(tCairo - 0.4, cairo), kk(tCairo, cairo), kk(tGiza - 0.4, giza), kk(tGiza, giza), kk(tMar - 0.4, mar), kk(tMar, mar), wcK(tData - 0.3, t1), wcK(tData, t1), [tData + 1.2, 600, 100], wcK(tBack - 0.4, t0), wcK(tBack, t0), wcK(tAn2 - 0.3, anTab), wcK(tAn2, anTab), wcK(tRef - 0.4, refB), wcK(tRef, refB), wcK(END(3) - 5, {x: 600, y: 330}),
  ];
  const cur = cursorOf(t, ks);
  if (onData) {
    const nNew = t < tPaste ? 0 : Math.round(100 * pe(t, tPaste, tPaste1));
    const top = t < tDown ? 2 : t < tSc0 ? 2390 : 2390 + Math.round(98 * pe(t, tSc0, tSc1));
    let sel: Sel = one(2, 0), name: string | undefined;
    if (t >= tDown) { sel = one(2401, 0); }
    if (t >= tPaste) { sel = rng(2402, 0, 2401 + Math.max(nNew, 1), 6, 2402, 0); name = `A2402:G${2401 + Math.max(nNew, 1)}`; }
    const ov = (g: Geo) => <div style={{position: 'absolute', inset: 0}}>{wrap(pe(t, tPaste, tPaste + 0.5) * (1 - pe(t, tSc1 + 0.3, tSc1 + 1.0)), <Box r={g.rect(2402, 0, 2401 + Math.max(nNew, 1), 6)} c={COL.green} w={2.5} glow={0.7}/>)}</div>;
    const v: View = {top, freeze: true, hw: hwFor(top + 14), widths: DATA_W, cell: (r, c) => dataCell(r, c, N1 + nNew), sel, name, ov, tab: 1, ribbon: 'home', cursor: () => ({...wc(cur), k: cur.k}), sheet: 1, sheets, file: 'Pivot_Practice', vs: {pos: 0.9, size: 0.02}};
    return {v, zoom: 1, zx: 0, zy: 0};
  }
  const slSel = t >= tGiza ? ['Giza'] : t >= tCairo ? ['Cairo'] : null;
  const mon = t >= tMar ? 2 : null;
  const flt: Flt = {br: slSel, m: mon};
  const n = t >= tRef + 0.3 ? N2 : N1;
  const cell = crossCells(t, 'sum', false, 0, flt, n);
  const ev = [tCairo, tGiza, tMar];
  const chg = Math.max(0, ...ev.map((e) => (t >= e ? 1 - pg(t, e, e + 1.0) : 0)));
  const rf = t >= tRef + 0.3 ? 1 - pg(t, tRef + 0.3, tRef + 1.6) : 0;
  const ov = (g: Geo) => (
    <div style={{position: 'absolute', inset: 0}}>
      <Slicer x={SX} y={SY} title="Branch" items={BR} sel={slSel} op={pe(t, tSlOK + 0.2, tSlOK + 0.7)}/>
      <Timeline x={TX} y={TY} sel={mon} op={pe(t, tTlOK + 0.2, tTlOK + 0.7)}/>
      {wrap(chg, <Box r={g.rect(4, 1, 7, 1)} c={COL.blue} w={2.5} glow={0.8}/>)}
      {wrap(rf, <Box r={g.rect(4, 1, 7, 1)} c={COL.green} w={3} glow={1}/>)}
    </div>
  );
  const layer = (
    <div>
      {t >= tSlD && t < tSlOK + 0.2 ? <SlicerDlg checked={t >= tChk ? ['Branch'] : []} hotItem={t >= tChk - 0.5 ? 'Branch' : undefined} okHot={t >= tSlOK - 0.3}/> : null}
      {t >= tTlD && t < tTlOK + 0.2 ? <TimelineDlg checked={t >= tTlChk} okHot={t >= tTlOK - 0.3}/> : null}
    </div>
  );
  const tabNow = t < tAn ? 2 : t >= tBack && t < tAn2 + 0.2 ? 1 : 11;
  const hi = t >= tSl - 0.4 && t < tSl + 0.3 ? 'slicer' : t >= tTl - 0.4 && t < tTl + 0.3 ? 'timeline' : t >= tRef - 0.4 && t < tRef + 0.3 ? 'refresh' : undefined;
  const zones: Zones = {F: [], C: [], R: ['Category'], V: ['Sales Amount']};
  const v: View = {top: 1, freeze: false, widths: [150, 150, 40], cell, sel: one(4, 1), ov, paneW: PANE.w, pane: <FieldPane zones={zones}/>, layer, cursor: () => ({...wc(cur), k: cur.k}), ctx: true, tab: tabNow, ribbon: tabNow === 11 ? 'analyze' : tabNow === 2 ? 'insert' : 'home', hi, sheet: 0, sheets, file: 'Pivot_Practice'};
  void a3;
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ============================ SCENE 5: 50,000 rows ============================
export const T5 = {down1: A(4, 0) + 2.5, home: A(4, 0) + 5.5};
export const s5 = (t: number): Out => {
  const a0 = A(4, 0), a1 = A(4, 1), a2 = A(4, 2);
  const tI = a0 + 6.0, tPB = a0 + 7.0, tD = a0 + 7.3, tOK = a0 + 9.8;
  const rb = ribbonLayout('insert').pos.pivot, okb = okPos(DG.create);
  const insTab = center(tabRect(2, false));
  const dr = {R: a1 + 1.6, V1: a1 + 3.4, V2: a1 + 5.2, V3: a1 + 7.0};
  const mn = {menu: a1 + 7.4, hot: a1 + 7.9, dlg: a1 + 8.1, tab: a1 + 8.5, dd: a1 + 9.0, pick: a1 + 9.5, ok: a1 + 10.2};
  const chip3 = paneChip('V', 2), arrow3 = {x: chip3.x + chip3.w - 8, y: chip3.y + 9};
  const mItems = MENU_V, mx = PANE.x + 14, my = 240;
  const menuHot = center(menuItemRect(mx, my, 226, mItems, 11));
  const okc = center(okPos(DG.vfs));
  const ks: K[] = [
    [0, 760, -60], [a0 + 8.5, 760, -60], wcK(tI, insTab), wcK(tPB - 0.1, center(rb)), wcK(tOK - 0.8, center(rb)), wcK(tOK - 0.1, center(okb)), wcK(tOK + 0.5, center(okb)),
    wcK(a1 + 0.3, center(paneField('Branch'))), wcK(a1 + 0.5, center(paneField('Branch'))), wcK(dr.R, center(paneChip('R', 0)), 'arrow'), wcK(a1 + 2.2, center(paneField('Sales Amount'))), wcK(dr.V1, center(paneChip('V', 0))), wcK(a1 + 3.8, center(paneField('Profit'))), wcK(dr.V2, center(paneChip('V', 1))),
    wcK(a1 + 5.6, center(paneField('Sales Amount'))), wcK(dr.V3, center(paneChip('V', 2))), wcK(mn.menu - 0.2, arrow3), wcK(mn.hot, menuHot), wcK(mn.dlg + 0.05, menuHot), wcK(mn.tab - 0.2, center(VFS.tab1)), wcK(mn.tab, center(VFS.tab1)), wcK(mn.dd - 0.2, center(VFS.dd)), wcK(mn.dd, center(VFS.dd)),
    wcK(mn.pick - 0.2, center(VFS.ddItem(1))), wcK(mn.pick, center(VFS.ddItem(1))), wcK(mn.ok - 0.2, okc), wcK(mn.ok, okc), wcK(END(4) - 6, {x: 600, y: 330}),
  ];
  const cur = cursorOf(t, ks);
  if (t < tOK + 0.3) {
    const top = t >= T5.down1 && t < T5.home ? 49987 : 2;
    let sel: Sel = one(2, 0), name: string | undefined;
    if (t >= T5.down1 && t < T5.home) sel = one(50001, 0);
    const v: View = {top, freeze: true, hw: hwFor(top + 14), widths: DATA_W, cell: (r, c) => dataCell(r, c, 50000), sel, name, tab: t >= tI ? 2 : 1, ribbon: t >= tI ? 'insert' : 'home', hi: t >= tPB - 0.4 && t < tD + 0.3 ? 'pivot' : undefined,
      layer: t >= tD ? <CreateDlg okHot={t >= tOK - 0.3}/> : null, cursor: () => ({...wc(cur), k: cur.k}), sheet: 0, sheets: ['Sales_2026'], file: 'manzooma_sales_2026.xlsx', vs: {pos: (top / 50001) * 0.85, size: 0.0004}};
    return {v, zoom: 1, zx: 0, zy: 0};
  }
  const V = ['Sales Amount', 'Profit', 'Sales Amount '];
  const zones: Zones = {F: [], C: [], R: t >= dr.R ? ['Branch'] : [], V: [t >= dr.V1 ? V[0] : '', t >= dr.V2 ? V[1] : '', t >= dr.V3 ? V[2] : ''].filter(Boolean)};
  const tbl = (r: number, c: number): Cell | undefined => {
    const sw = (td: number, k: number) => { const g1 = 1 - pg(t, td + 0.2 + k * 0.2, td + 1.4 + k * 0.2); return g1 > 0.02 && t >= td + 0.2 + k * 0.2 ? emer(0.5 * g1) : undefined; };
    const renamed = t >= mn.pick + 0.1;
    if (!zones.R.length) return r >= 3 && r <= 12 && c <= 2 ? {t: r === 3 && c === 0 ? 'PivotTable1' : r === 4 && c === 0 ? 'To build a report, choose fields' : r === 5 && c === 0 ? 'from the PivotTable Field List' : '', bg: '#EEF3FA', b: r === 3 && c === 0} : undefined;
    if (r === 3) return c === 0 ? PIV_HDR('Row Labels', true) : c === 1 && t >= dr.V1 ? PIV_HDR('Sum of Sales Amount') : c === 2 && t >= dr.V2 ? PIV_HDR('Sum of Profit') : c === 3 && t >= dr.V3 ? PIV_HDR(renamed ? 'Sales %' : 'Sum of Sales Amount2') : undefined;
    if (r >= 4 && r <= 8) {
      const b = BR[r - 4], k = r - 4;
      if (c === 0) return {t: b};
      if (c === 1 && t >= dr.V1) return {t: fmt(BIG.s[b]), bg: sw(dr.V1, k)};
      if (c === 2 && t >= dr.V2) return {t: fmt(BIG.p[b]), bg: sw(dr.V2, k)};
      if (c === 3 && t >= dr.V3) return {t: t >= mn.ok ? pct(BIG.s[b] / BIG.ts) : fmt(BIG.s[b]), bg: t >= mn.ok ? sw(mn.ok - 0.2, k) : sw(dr.V3, k)};
      return undefined;
    }
    if (r === 9) return c === 0 ? PIV_GT('Grand Total') : c === 1 && t >= dr.V1 ? {...PIV_GT(fmt(BIG.ts)), al: 'r'} : c === 2 && t >= dr.V2 ? {...PIV_GT(fmt(BIG.tp)), al: 'r'} : c === 3 && t >= dr.V3 ? {...PIV_GT(t >= mn.ok ? '100.00%' : fmt(BIG.ts)), al: 'r'} : undefined;
    return undefined;
  };
  const drag = t >= a1 + 0.5 && t < dr.R ? 'Branch' : t >= a1 + 2.2 && t < dr.V1 ? 'Sales Amount' : t >= a1 + 3.8 && t < dr.V2 ? 'Profit' : t >= a1 + 5.6 && t < dr.V3 ? 'Sales Amount' : null;
  const layer = (
    <div>
      <Ghost p={drag ? cur : null} t={drag ?? ''}/>
      {t >= mn.menu && t < mn.dlg ? <Menu x={mx} y={my} w={226} items={mItems} hot={t >= mn.hot ? 11 : undefined}/> : null}
      {t >= mn.dlg && t < mn.ok + 0.2 ? <VfsDlg tab={t >= mn.tab ? 1 : 0} summ="Sum" show={t >= mn.pick ? '% of Grand Total' : 'No Calculation'} open={t >= mn.dd && t < mn.pick + 0.3} hotItem={t >= mn.pick - 0.5 ? 1 : undefined} custom={t >= mn.pick + 0.1 ? 'Sales %' : 'Sum of Sales Amount2'} okHot={t >= mn.ok - 0.3}/> : null}
    </div>
  );
  const ov = (g: Geo) => (
    <div style={{position: 'absolute', inset: 0}}>
      {wrap(pe(t, a2 + 1.0, a2 + 1.8) * (1 - pe(t, a2 + 8, a2 + 9)), <Box r={g.rect(3, 0, 9, 3)} c={COL.green} w={3} glow={0.9}/>)}
      <Seal x={820} y={150} s={130} p={pe(t, a2 + 3.5, a2 + 4.9)}/>
    </div>
  );
  const v: View = {top: 1, freeze: false, widths: [130, 150, 130, 130], cell: tbl, sel: one(3, 0), ov, paneW: PANE.w, pane: <FieldPane zones={zones} hotField={drag === 'Sales Amount' || drag === 'Profit' || drag === 'Branch' ? drag : undefined} valLabels={{'Sales Amount': 'Sum of Sales Amount', Profit: 'Sum of Profit', 'Sales Amount ': t >= mn.pick + 0.1 ? 'Sales %' : 'Sum of Sales Amount2'}}/>,
    layer, cursor: () => ({...wc(cur), k: cur.k}), ctx: true, tab: 2, ribbon: 'insert', sheet: 0, sheets: ['Sheet1', 'Sales_2026'], file: 'manzooma_sales_2026.xlsx'};
  return {v, zoom: 1, zx: 0, zy: 0};
};
