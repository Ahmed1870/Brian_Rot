import React from 'react';
import {COL, XL} from './theme';
import {ANCH, SCENE_END, SCENE_START} from './sync';
import {Box, Cell, FONT, Geo, Ico, Seal, Sel, View, pe, pg, ribbonLayout, tabRect, typed} from './kit';
import {K, band, hdrC, one, path} from './data';
import {CATS, csvRow, fileName, fmtN} from './data47';
import {BR_AR} from './data47';
import {Menu, PANE, R, center} from './pivotkit';
import {CMB_MENU, CombineDlg, CsvDlg, DELIMS, DssDlg, Explorer, FolderDlg, FolderPreview, GetDataMenu, NavDlg, ORIG, OpenDlg, PQEditor, PermDlg, QCPane, QItem, WebDlg, cmbOK, csvBtn, csvList, csvOrigin, csvDelim, dssBtn, dssItem, explIcon, explList, folderOK, fpBtn, fpMenuItem, gdMainItem, gdSubItem, navBtn, navItem, odFile, odImport, permOK, pqClose, webOK} from './pqkit';

type Out = {v: View; zoom: number; zx: number; zy: number};
const A = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
const END = (i: number) => SCENE_END[i] - SCENE_START[i];
const emer = (a: number) => `rgba(16,185,129,${a})`;
const wrap = (o: number, kids: React.ReactNode) => <div style={{position: 'absolute', inset: 0, opacity: o}}>{kids}</div>;
const wcK = (t: number, p: {x: number; y: number}, kind?: 'arrow' | 'cross'): K => [t, p.x, p.y - 192, kind];
const cur = (t: number, ks: K[]) => { const c = path(t, [...ks].sort((a, b) => a[0] - b[0])); return {x: c.x, y: c.y, k: c.k}; };
const BTN = ribbonLayout('data').pos;
const GD: R = BTN.getdata;
const DATA_TAB = center(tabRect(6, false));
const REST: K = [0, 760, -60];

// ---------- tables loaded into the sheet ----------
const csvCell = (r: number, c: number, f: number, n: number, glow = 0): Cell | undefined => {
  if (r === 1) return c < 4 ? hdrC(['Date', 'Branch', 'Category', 'Sales Amount'][c]) : undefined;
  if (r < 2 || r > n + 1 || c > 3) return undefined;
  const x = csvRow(f, r - 2), bg = glow > 0 ? emer(0.35 * glow) : band(r);
  return [{t: x.d, bg, al: 'r' as const}, {t: x.br, bg, ar: true}, {t: x.cat, bg}, {t: String(x.sales), bg}][c];
};
const foldCell = (r: number, c: number, n: number, glowFrom = n, glow = 0): Cell | undefined => {
  if (r === 1) return c < 5 ? hdrC(['Source.Name', 'Date', 'Branch', 'Category', 'Sales Amount'][c]) : undefined;
  if (r < 2 || r > n + 1 || c > 4) return undefined;
  const k = r - 2, f = Math.floor(k / 120), x = csvRow(f, k % 120, f < 12 ? 2026 : 2027);
  const bg = k >= glowFrom && glow > 0 ? emer(0.45 * glow) : band(r);
  return [{t: fileName(f), bg}, {t: x.d, bg, al: 'r' as const}, {t: x.br, bg, ar: true}, {t: x.cat, bg}, {t: String(x.sales), bg}][c];
};
const sheet25 = (r: number, c: number): Cell | undefined => {
  if (r === 1) return c < 4 ? hdrC(['Date', 'Branch', 'Category', 'Sales Amount'][c]) : undefined;
  if (r < 2 || r > 150 || c > 3) return undefined;
  const i = r - 2, bg = band(r);
  return [{t: `${(i % 12) + 1}/${(i % 27) + 1}/2025`, bg, al: 'r' as const}, {t: BR_AR[(i * 3) % 5], bg, ar: true}, {t: CATS[(i * 5) % 3], bg}, {t: String(10 * (50 + ((i * 6151) % 900))), bg}][c];
};
const base = {top: 1, freeze: false, tab: 6, ribbon: 'data'} as const;

// ============================ SCENE 1: connectors overview ============================
const SRC = [{n: 'CSV', x: 960, y: 38}, {n: 'SQL', x: 1020, y: 104}, {n: 'Web', x: 1044, y: 172}, {n: 'PDF', x: 1020, y: 240}, {n: 'Folder', x: 960, y: 302}];
const HUB = {x: 560, y: 170};
const bez = (a: {x: number; y: number}, b: {x: number; y: number}, s: number) => {
  const c1 = {x: a.x + 200, y: a.y}, c2 = {x: b.x - 200, y: b.y}, u = 1 - s;
  return {x: u * u * u * a.x + 3 * u * u * s * c1.x + 3 * u * s * s * c2.x + s * s * s * b.x, y: u * u * u * a.y + 3 * u * u * s * c1.y + 3 * u * s * s * c2.y + s * s * s * b.y};
};
const NodeIcon: React.FC<{n: string}> = ({n}) => n === 'CSV' ? <Ico k="csv" s={26}/> : n === 'SQL' ? <Ico k="getdata" s={26}/> : n === 'Web' ? <Ico k="globe" s={26}/> : n === 'PDF'
  ? <svg width="26" height="26" viewBox="0 0 24 24"><path d="M5 3h10l4 4v14H5z" fill="#fff" stroke="#6B7280"/><rect x="5" y="12" width="14" height="5" fill="#E5484D"/></svg>
  : <svg width="26" height="26" viewBox="0 0 24 24"><path d="M2 6h8l2 2h10v11H2z" fill="#F2C94C" stroke="#B7791F"/></svg>;
export const s1 = (t: number): Out => {
  const a0 = A(0, 0), a1 = A(0, 1), a2 = A(0, 2);
  const tTab = a2 + 11.5;
  const ks: K[] = [REST, [tTab - 1.5, 760, -60], wcK(tTab, DATA_TAB), [END(0), DATA_TAB.x, DATA_TAB.y - 192]];
  const c = cur(t, ks);
  const manual = pe(t, a0 + 2.0, a0 + 3.0) * (1 - 0.7 * pe(t, a1 + 0.5, a1 + 1.5));
  const ov = (_g: Geo) => (
    <div style={{position: 'absolute', inset: 0}}>
      {wrap(manual, (
        <div style={{position: 'absolute', inset: 0}}>
          <svg style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'}}>
            <path d="M104 170H150M224 170H270" stroke={COL.red} strokeWidth="3" strokeDasharray="6 6" fill="none"/>
            <circle cx="190" cy="170" r="70" fill="none" stroke={COL.red} strokeWidth="4" opacity="0.8"/><path d="M140 120l100 100" stroke={COL.red} strokeWidth="5" opacity="0.8"/>
          </svg>
          {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 62 + i * 120, top: 148, width: 44, height: 44, borderRadius: 10, background: '#fff', border: `2px solid ${COL.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 12px ${COL.red}88`}}>{i === 0 ? <Ico k="csv" s={26}/> : i === 1 ? <Ico k="copy" s={26}/> : <Ico k="table" s={26}/>}</div>)}
        </div>
      ))}
      <svg style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible'}}>
        {SRC.map((s, i) => {
          const p = pe(t, a1 + 0.6 + i * 0.9, a1 + 1.8 + i * 0.9);
          const A0 = {x: HUB.x + 34, y: HUB.y}, B0 = {x: s.x - 26, y: s.y};
          const d = `M${A0.x} ${A0.y}C${A0.x + 200} ${A0.y} ${B0.x - 200} ${B0.y} ${B0.x} ${B0.y}`;
          const flow = pe(t, a1 + 2.5 + i * 0.9, a1 + 3.5 + i * 0.9);
          return (
            <g key={s.n} style={{filter: `drop-shadow(0 0 5px ${COL.blue})`}}>
              <path d={d} pathLength={1} stroke={COL.blue} strokeWidth="3.5" fill="none" strokeDasharray={`${p} 2`} strokeLinecap="round"/>
              {flow > 0 ? [0, 1, 2].map((k) => { const q = bez(A0, B0, ((t * 0.35 + k / 3 + i * 0.13) % 1)); return <circle key={k} cx={q.x} cy={q.y} r="4" fill="#fff" opacity={flow}/>; }) : null}
            </g>
          );
        })}
      </svg>
      {wrap(pe(t, a1 + 0.2, a1 + 0.8), <div style={{position: 'absolute', left: HUB.x - 32, top: HUB.y - 32, width: 64, height: 64, borderRadius: 14, background: XL.green, boxShadow: `0 0 ${18 + 8 * Math.sin(t * 3)}px ${COL.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="40" height="40" viewBox="0 0 40 40"><path d="M6 10h28M6 20h28M6 30h28M15 6v28" stroke="#fff" strokeWidth="2.4"/></svg></div>)}
      {SRC.map((s, i) => { const o = pe(t, a1 + 1.4 + i * 0.9, a1 + 2.0 + i * 0.9); return <div key={s.n} style={{position: 'absolute', left: s.x - 22, top: s.y - 22, width: 44, height: 44, borderRadius: 22, background: '#fff', border: `2px solid ${COL.blue}`, boxShadow: `0 0 14px ${COL.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o}}><NodeIcon n={s.n}/></div>; })}
      {SRC.map((s, i) => { const o = pe(t, a2 + 0.5 + i * 0.7, a2 + 1.0 + i * 0.7); return <div key={s.n} style={{position: 'absolute', left: s.x + 32, top: s.y - 10, width: 54, textAlign: 'left', fontFamily: FONT.mono, fontWeight: 700, fontSize: 12, color: COL.blue, background: '#E8F4FD', border: `1px solid ${COL.blue}`, borderRadius: 10, padding: '1px 6px', opacity: o, boxSizing: 'content-box'}}>{s.n}</div>; })}
    </div>
  );
  const tabNow = t >= tTab + 0.2 ? 6 : 1;
  const v: View = {top: 1, freeze: false, tab: tabNow, ribbon: tabNow === 6 ? 'data' : 'home', cell: () => undefined, sel: one(1, 0), ov, cursor: () => c, sheet: 0, sheets: ['Sheet1'], file: 'Book1'};
  return {v, zoom: 1 + 0.16 * pe(t, 37.4, 39.8), zx: 380, zy: 100};
};

// ============================ SCENE 2: CSV + workbook ============================
export const s2 = (t: number): Out => {
  const a0 = A(1, 0), a1 = A(1, 1), a2 = A(1, 2);
  const T = {data: a0 + 1.0, gd: a0 + 3.4, file: a0 + 4.6, csvHot: a0 + 6.4, csvClick: a0 + 7.6, open: a0 + 8.0, pick: a0 + 10.0, impHot: a0 + 11.2, imp: a0 + 11.5, dlg: a0 + 11.8,
    oDd: a1 + 1.0, oHot: a1 + 2.6, oPick: a1 + 3.0, dDd: a1 + 4.6, dHot: a1 + 5.4, dPick: a1 + 5.8, loadHot: a1 + 8.0, load: a1 + 8.5,
    gd2: a2 + 0.8, file2: a2 + 1.8, wb: a2 + 2.8, wbClick: a2 + 3.6, open2: a2 + 4.0, pick2: a2 + 5.2, impHot2: a2 + 6.4, imp2: a2 + 6.7, nav: a2 + 7.1, navSel: a2 + 9.0, loadHot2: a2 + 13.5, load2: a2 + 14.0};
  const gdb = GD;
  const imp = center(odImport), loadB = center(csvBtn.load), navLoad = center(navBtn.load);
  const ks: K[] = [REST, [a0 + 0.3, 760, -60], wcK(T.data, DATA_TAB), wcK(T.gd - 0.5, DATA_TAB), wcK(T.gd, center(gdb)), wcK(T.file - 0.2, center(gdMainItem(gdb, 0))), wcK(T.csvHot, center(gdSubItem(gdb, 'file', 1))), wcK(T.csvClick, center(gdSubItem(gdb, 'file', 1))),
    wcK(T.pick - 0.4, center(odFile(0))), wcK(T.pick, center(odFile(0))), wcK(T.imp - 0.3, imp), wcK(T.imp, imp),
    wcK(T.oDd - 0.4, center(csvOrigin)), wcK(T.oDd, center(csvOrigin)), wcK(T.oPick - 0.2, center(csvList('origin', 2))), wcK(T.oPick, center(csvList('origin', 2))), wcK(T.dDd - 0.3, center(csvDelim)), wcK(T.dDd, center(csvDelim)), wcK(T.dPick - 0.2, center(csvList('delim', 0))), wcK(T.dPick, center(csvList('delim', 0))), wcK(T.load - 0.3, loadB), wcK(T.load, loadB),
    wcK(T.gd2 - 0.5, [{x: 760, y: 300}][0]), wcK(T.gd2, center(gdb)), wcK(T.file2 - 0.1, center(gdMainItem(gdb, 0))), wcK(T.wbClick, center(gdSubItem(gdb, 'file', 0))), wcK(T.pick2 - 0.3, center(odFile(0))), wcK(T.pick2, center(odFile(0))), wcK(T.imp2 - 0.3, imp), wcK(T.imp2, imp),
    wcK(T.navSel - 0.4, center(navItem(1))), wcK(T.navSel, center(navItem(1))), wcK(T.load2 - 0.3, navLoad), wcK(T.load2, navLoad), wcK(END(1) - 3, {x: 700, y: 330})];
  const c = cur(t, ks);
  const loaded1 = t >= T.load, loaded2 = t >= T.load2;
  const origin = t >= T.oPick ? ORIG[2] : ORIG[1];
  const garble = t < T.oPick;
  const dlg = t >= T.dlg && t < T.load + 0.2;
  const openD = (t >= T.open && t < T.imp + 0.2) ? <OpenDlg title="Import Data" files={[{n: 'Sales_2026-01.csv', date: '1/28/2026 9:14 PM', type: 'CSV File', size: '6 KB'}, {n: 'Sales_2026-02.csv', date: '2/28/2026 9:14 PM', type: 'CSV File', size: '6 KB'}, {n: 'Notes.txt', date: '1/2/2026 8:00 AM', type: 'Text Document', size: '1 KB'}]} sel={t >= T.pick ? 0 : null} okHot={t >= T.impHot}/> : (t >= T.open2 && t < T.imp2 + 0.2) ? <OpenDlg title="Import Data" files={[{n: 'Sales_2025.xlsx', date: '12/30/2025 5:41 PM', type: 'Excel Workbook', size: '48 KB'}, {n: 'Targets.xlsx', date: '1/3/2026 1:12 PM', type: 'Excel Workbook', size: '19 KB'}]} sel={t >= T.pick2 ? 0 : null} okHot={t >= T.impHot2}/> : null;
  const menuOpen = (t >= T.gd + 0.15 && t < T.csvClick + 0.1) || (t >= T.gd2 + 0.15 && t < T.wbClick + 0.1);
  const m1 = t < T.csvClick + 0.1;
  const menu = menuOpen ? <GetDataMenu btn={gdb} sub={(m1 ? t >= T.file : t >= T.file2) ? 'file' : null} hot={(m1 ? t >= T.file : t >= T.file2) ? 0 : undefined} subHot={m1 ? (t >= T.csvHot ? 1 : undefined) : (t >= T.wb ? 0 : undefined)}/> : null;
  const nav = t >= T.nav && t < T.load2 + 0.2 ? <NavDlg title="tbl_Sales2025" items={[{t: 'Sales_2025.xlsx [2]', ic: 'csv'}, {t: 'tbl_Sales2025', ind: 1, ic: 'table'}, {t: 'Sheet1', ind: 1, ic: 'table'}]} sel={t >= T.navSel ? 1 : null} cols={[{h: 'Date', w: 90, ty: 'DATE'}, {h: 'Branch', w: 130, ar: true}, {h: 'Category', w: 110}, {h: 'Sales Amount', w: 120, ty: '123'}]} rows={Array.from({length: 9}, (_, i) => { const r = sheet25(i + 2, 0); return [r?.t ?? '', sheet25(i + 2, 1)?.t ?? '', sheet25(i + 2, 2)?.t ?? '', sheet25(i + 2, 3)?.t ?? '']; })} loadHot={t >= T.loadHot2} previewT="tbl_Sales2025" glow={t >= T.navSel ? COL.purple : undefined}/> : null;
  const layer = (
    <div>
      {menu}{openD}
      {dlg ? <CsvDlg name="Sales_2026-01.csv" origin={origin} delim="Comma" open={t >= T.oDd && t < T.oPick + 0.2 ? 'origin' : t >= T.dDd && t < T.dPick + 0.2 ? 'delim' : null} hot={t >= T.oHot && t < T.oPick + 0.2 ? 2 : t >= T.dHot && t < T.dPick + 0.2 ? 0 : undefined} loadHot={t >= T.loadHot} garble={garble}/> : null}
      {nav}
    </div>
  );
  const q: QItem[] = [...(loaded2 ? [{n: 'tbl_Sales2025', rows: 149, state: 'ok' as const}] : []), ...(loaded1 ? [{n: 'Sales_2026-01', rows: 120, state: 'ok' as const}] : [])];
  const sheets = loaded2 ? ['tbl_Sales2025', 'Sales_2026-01', 'Sheet1'] : loaded1 ? ['Sales_2026-01', 'Sheet1'] : ['Sheet1'];
  const gl = Math.max(loaded1 ? 1 - pg(t, T.load, T.load + 1.6) : 0, loaded2 ? 1 - pg(t, T.load2, T.load2 + 1.6) : 0);
  const cell = (r: number, cc: number) => (loaded2 ? sheet25(r, cc) : loaded1 ? csvCell(r, cc, 0, 120, gl) : undefined);
  const ov = (g: Geo) => (
    <div style={{position: 'absolute', inset: 0}}>
      {wrap(pe(t, T.oPick, T.oPick + 0.5) * (1 - pe(t, T.dPick + 1, T.dPick + 1.6)) * 0, null)}
      {wrap(gl, <Box r={g.rect(1, 0, 16, 3)} c={loaded2 ? COL.purple : COL.green} w={2.5} glow={0.7}/>)}
    </div>
  );
  const v: View = {...base, widths: [80, 110, 100, 100], cell, sel: one(2, 0), ov, paneW: q.length ? PANE.w : 0, pane: q.length ? <QCPane items={q} glow={gl}/> : undefined, layer, cursor: () => c, sheet: 0, sheets, file: 'External_Data_Practice'};
  return {v, zoom: 1 + 0.16 * (1 - pe(t, 1.0, 3.0)), zx: 380, zy: 100};
};

// ============================ SCENE 3: From Folder ============================
export const T3 = {a: A(2, 3)};
export const s3 = (t: number): Out => {
  const a0 = A(2, 0), a1 = A(2, 1), a2 = A(2, 2), a3 = A(2, 3);
  const T = {gd: a0 + 0.6, file: a0 + 1.6, fold: a0 + 3.4, click: a1 + 0.3, dlg: a1 + 0.7, type0: a1 + 1.8, type1: a1 + 4.2, okHot: a1 + 4.6, ok: a1 + 4.9, prev: a1 + 5.3,
    cmbHot: a2 + 0.4, cmb: a2 + 0.7, mHot: a2 + 1.7, mClick: a2 + 2.3, cdlg: a2 + 2.6, cok: a2 + 4.6, cokC: a2 + 4.9, pq: a2 + 5.3, close: a3 + 1.2, closeHot: a3 + 0.8,
    ex: a3 + 4.0, drag0: a3 + 5.5, drag1: a3 + 7.5, exClose: a3 + 9.6, rf: a3 + 11.0, rf0: a3 + 11.4, rf1: a3 + 12.8};
  const PATH = 'C:\\Manzooma\\Monthly_Sales_Folder';
  const gdb = GD;
  const ks: K[] = [REST, [a0 + 0.1, 760, -60], wcK(T.gd, center(gdb)), wcK(T.file - 0.1, center(gdMainItem(gdb, 0))), wcK(T.fold, center(gdSubItem(gdb, 'file', 5))), wcK(T.click, center(gdSubItem(gdb, 'file', 5))), wcK(T.type0 - 0.3, {x: 640, y: 292}), wcK(T.ok - 0.3, center(folderOK)), wcK(T.ok, center(folderOK)),
    wcK(T.cmb - 0.4, center(fpBtn.combine)), wcK(T.cmb, center(fpBtn.combine)), wcK(T.mClick - 0.3, center(fpMenuItem(0))), wcK(T.mClick, center(fpMenuItem(0))), wcK(T.cokC - 0.3, center(cmbOK)), wcK(T.cokC, center(cmbOK)), wcK(T.pq + 1, {x: 500, y: 300}),
    wcK(T.close - 0.4, center(pqClose)), wcK(T.close, center(pqClose)),
    [T.ex + 1.0, explIcon.x + 30, explIcon.y + 30 - 192], [T.drag0, explIcon.x + 30, explIcon.y + 30 - 192], [T.drag1, explList(12).x + 100, explList(12).y + 12 - 192], [T.exClose, explList(12).x + 100, explList(12).y + 12 - 192],
    wcK(T.rf - 0.3, center(BTN.refreshall)), wcK(T.rf, center(BTN.refreshall)), wcK(END(2) - 3, {x: 700, y: 330})];
  const c = cur(t, ks);
  const showPQ = t >= T.pq && t < T.close + 0.2;
  const afterLoad = t >= T.close + 0.3;
  const filesNow = t >= T.drag1 + 0.1 ? 13 : 12;
  const rowsNow = t < T.rf0 ? 1440 : t < T.rf1 ? 1440 : 1560;
  const loading = t >= T.rf0 && t < T.rf1;
  const gl2 = t >= T.rf1 ? 1 - pg(t, T.rf1, T.rf1 + 1.6) : 0;
  const glowLoad = afterLoad ? 1 - pg(t, T.close + 0.3, T.close + 2.0) : 0;
  const steps = ['Source', 'Filtered Hidden Files1', 'Invoke Custom Function1', 'Renamed Columns1', 'Removed Other Columns1', 'Expanded Table Column1', 'Changed Type'];
  const nSteps = Math.min(steps.length, Math.max(1, Math.floor((t - T.pq) / 0.3) + 1));
  const pqRows = Math.min(24, Math.round(24 * pe(t, T.pq + 0.3, T.pq + 1.8)));
  const layer = (
    <div>
      {t >= T.gd + 0.15 && t < T.click + 0.1 ? <GetDataMenu btn={gdb} sub={t >= T.file ? 'file' : null} hot={t >= T.file ? 0 : undefined} subHot={t >= T.fold ? 5 : undefined}/> : null}
      {t >= T.dlg && t < T.ok + 0.2 ? <FolderDlg path={typed(PATH, t, T.type0, T.type1)} caret={t < T.ok} okHot={t >= T.okHot}/> : null}
      {t >= T.prev && t < T.cokC && t < T.cdlg ? <FolderPreview path={PATH} files={12} menu={t >= T.cmb && t < T.mClick + 0.1} hot={t >= T.mHot ? 0 : undefined} combineHot={t >= T.cmbHot} glow={pe(t, T.prev + 0.2, T.prev + 1.0) * (1 - pe(t, T.cmb, T.cmb + 0.8))}/> : null}
      {t >= T.cdlg && t < T.cokC + 0.2 ? <CombineDlg okHot={t >= T.cok}/> : null}
      {showPQ ? <PQEditor rows={pqRows} steps={steps.slice(0, nSteps)} name="Monthly_Sales_Folder" closeHot={t >= T.closeHot} glow={pe(t, T.pq + 0.3, T.pq + 1.0) * (1 - pe(t, T.pq + 3, T.pq + 4))} status={'5 COLUMNS, 999+ ROWS      Column profiling based on top 1000 rows'}/> : null}
      {t >= T.ex && t < T.exClose ? <Explorer files={filesNow} newHot={t >= T.drag1 + 0.1} dropGlow={t >= T.drag1 + 0.1 ? 1 - pg(t, T.drag1 + 0.1, T.drag1 + 1.8) : 0} showSrc={t < T.drag1}/> : null}
      {t >= T.drag0 && t < T.drag1 ? <div style={{position: 'absolute', left: c.x + 6, top: c.y + 192 + 6, opacity: 0.85}}><Ico k="csv" s={34}/></div> : null}
    </div>
  );
  const q: QItem[] = afterLoad ? [{n: 'Monthly_Sales_Folder', rows: loading ? 1440 + Math.round(120 * pe(t, T.rf0, T.rf1)) : rowsNow, state: loading ? 'loading' : 'ok', prog: pe(t, T.rf0, T.rf1)}] : [];
  const cell = (r: number, cc: number) => (afterLoad ? foldCell(r, cc, rowsNow, 1440, gl2) : undefined);
  const ov = (g: Geo) => <div style={{position: 'absolute', inset: 0}}>{wrap(glowLoad, <Box r={g.rect(1, 0, 16, 4)} c={COL.amber} w={2.5} glow={0.8}/>)}{wrap(gl2, <Box r={g.rect(1, 0, 16, 4)} c={COL.green} w={2.5} glow={0.8}/>)}</div>;
  const v: View = {...base, widths: [130, 80, 110, 100, 100], cell, sel: one(2, 0), ov, paneW: q.length ? PANE.w : 0, pane: q.length ? <QCPane items={q} glow={Math.max(glowLoad, gl2)}/> : undefined, layer, hi: t >= T.rf - 0.4 && t < T.rf + 0.3 ? 'refreshall' : undefined, cursor: () => c,
    sheet: 0, sheets: afterLoad ? ['Monthly_Sales_Folder', 'Sheet1'] : ['Sheet1'], file: 'External_Data_Practice', vs: {pos: 0, size: 0.04}};
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ============================ SCENE 4: Web + Data Source Settings ============================
export const s4 = (t: number): Out => {
  const a0 = A(3, 0), a1 = A(3, 1), a2 = A(3, 2);
  const T = {gd: a0 + 0.6, db: a0 + 1.4, dbHot: a0 + 2.2, oth: a0 + 3.4, web: a0 + 4.4, webClick: a0 + 5.0, dlg: a0 + 5.4, u0: a0 + 5.5, u1: a0 + 6.9, okHot: a0 + 7.1, ok: a0 + 7.3, nav: a0 + 7.7,
    sel: a1 + 0.6, loadHot: a1 + 1.6, load: a1 + 1.9, gd2: a1 + 3.0, dssHot: a1 + 4.0, dssClick: a1 + 4.5, dss: a1 + 4.9,
    pick: a2 + 0.8, chg: a2 + 2.0, t0: a2 + 3.0, t1: a2 + 5.4, okHot2: a2 + 5.8, ok2: a2 + 6.2, perm: a2 + 8.0, permD: a2 + 8.3, pokHot: a2 + 10.8, pok: a2 + 11.1, close: a2 + 12.5};
  const URL = 'https://stats.example.org/branches';
  const OLD = 'C:\\Manzooma\\Monthly_Sales_Folder', NEW = 'D:\\Reports\\Monthly_Sales_Folder';
  const gdb = GD;
  const ks: K[] = [REST, [a0 + 0.1, 760, -60], wcK(T.gd, center(gdb)), wcK(T.db, center(gdMainItem(gdb, 1))), wcK(T.dbHot, center(gdSubItem(gdb, 'db', 0))), wcK(T.oth, center(gdMainItem(gdb, 4))), wcK(T.web, center(gdSubItem(gdb, 'other', 1))), wcK(T.webClick, center(gdSubItem(gdb, 'other', 1))),
    wcK(T.u0 - 0.3, {x: 640, y: 320}), wcK(T.ok - 0.2, center(webOK)), wcK(T.ok, center(webOK)), wcK(T.sel - 0.4, center(navItem(1))), wcK(T.sel, center(navItem(1))), wcK(T.load - 0.3, center(navBtn.load)), wcK(T.load, center(navBtn.load)),
    wcK(T.gd2 - 0.5, {x: 760, y: 320}), wcK(T.gd2, center(gdb)), wcK(T.dssHot, center(gdMainItem(gdb, 8))), wcK(T.dssClick, center(gdMainItem(gdb, 8))), wcK(T.pick - 0.4, center(dssItem(0))), wcK(T.pick, center(dssItem(0))), wcK(T.chg - 0.3, center(dssBtn.change)), wcK(T.chg, center(dssBtn.change)),
    wcK(T.t0 - 0.2, {x: 640, y: 300}), wcK(T.ok2 - 0.3, center(folderOK)), wcK(T.ok2, center(folderOK)), wcK(T.perm - 0.4, center(dssBtn.perm)), wcK(T.perm, center(dssBtn.perm)), wcK(T.pok - 0.3, center(permOK)), wcK(T.pok, center(permOK)), wcK(T.close - 0.3, center(dssBtn.close)), wcK(T.close, center(dssBtn.close)), wcK(END(3) - 3, {x: 700, y: 330})];
  const c = cur(t, ks);
  const loaded = t >= T.load;
  const sub = t >= T.oth ? 'other' : t >= T.db ? 'db' : null;
  const menu1 = t >= T.gd + 0.15 && t < T.webClick + 0.1;
  const menu2 = t >= T.gd2 + 0.15 && t < T.dssClick + 0.1;
  const dssOpen = t >= T.dss && t < T.close + 0.2;
  const changed = t >= T.ok2;
  const items = [changed ? NEW : OLD, URL, 'C:\\Manzooma\\Data\\Sales_2026-01.csv'];
  const layer = (
    <div>
      {menu1 ? <GetDataMenu btn={gdb} sub={sub} hot={t >= T.oth ? 4 : t >= T.db ? 1 : undefined} subHot={t >= T.web ? 1 : t >= T.dbHot && t < T.oth ? 0 : undefined}/> : null}
      {menu2 ? <GetDataMenu btn={gdb} sub={null} hot={t >= T.dssHot ? 8 : undefined}/> : null}
      {t >= T.dlg && t < T.ok + 0.2 ? <WebDlg url={typed(URL, t, T.u0, T.u1)} caret={t < T.ok} okHot={t >= T.okHot}/> : null}
      {t >= T.nav && t < T.load + 0.2 ? <NavDlg title="Table 0" items={[{t: 'Display Options'}, {t: 'Table 0', ind: 1, ic: 'table'}, {t: 'Suggested Tables', ind: 0}]} sel={t >= T.sel ? 1 : null} cols={[{h: 'Region', w: 120}, {h: 'Branch', w: 120}, {h: 'Target (EGP)', w: 130, ty: '123'}]} rows={[['Greater Cairo', 'Cairo', '5,200,000'], ['Greater Cairo', 'Giza', '4,100,000'], ['Alexandria', 'Alex', '3,300,000'], ['Delta', 'Tanta', '2,000,000'], ['Upper Egypt', 'Aswan', '1,500,000']]} loadHot={t >= T.loadHot} previewT="Table 0" glow={t >= T.sel ? COL.blue : undefined}/> : null}
      {dssOpen ? <DssDlg items={items} sel={t >= T.pick && t < T.close ? 0 : null} flash={changed ? 1 - pg(t, T.ok2, T.ok2 + 1.6) : 0} closeHot={t >= T.close - 0.2}/> : null}
      {t >= T.chg && t < T.ok2 + 0.2 ? <FolderDlg title="Folder" path={t < T.t0 ? OLD : typed(NEW, t, T.t0, T.t1)} caret={t < T.ok2} okHot={t >= T.okHot2}/> : null}
      {t >= T.permD && t < T.pok + 0.2 ? <PermDlg path={NEW} okHot={t >= T.pokHot}/> : null}
    </div>
  );
  const q: QItem[] = loaded ? [{n: 'Table 0', rows: 5, state: 'ok'}] : [];
  const cell = (r: number, cc: number): Cell | undefined => {
    if (!loaded) return undefined;
    if (r === 1) return cc < 3 ? hdrC(['Region', 'Branch', 'Target (EGP)'][cc]) : undefined;
    if (r >= 2 && r <= 6 && cc < 3) { const row = [['Greater Cairo', 'Cairo', '5200000'], ['Greater Cairo', 'Giza', '4100000'], ['Alexandria', 'Alex', '3300000'], ['Delta', 'Tanta', '2000000'], ['Upper Egypt', 'Aswan', '1500000']][r - 2]; return {t: row[cc], bg: band(r)}; }
    return undefined;
  };
  const gl = loaded ? 1 - pg(t, T.load, T.load + 1.6) : 0;
  const v: View = {...base, widths: [110, 90, 110], cell, sel: one(2, 0), ov: (g: Geo) => <div style={{position: 'absolute', inset: 0}}>{wrap(gl, <Box r={g.rect(1, 0, 6, 2)} c={COL.blue} w={2.5} glow={0.8}/>)}</div>, paneW: q.length ? PANE.w : 0, pane: q.length ? <QCPane items={q} glow={gl}/> : undefined, layer, cursor: () => c, sheet: 0, sheets: loaded ? ['Table 0', 'Sheet1'] : ['Sheet1'], file: 'External_Data_Practice'};
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ============================ SCENE 5: Refresh All on the enterprise file ============================
export const T5 = {key: A(4, 1) + 3.0};
export const s5 = (t: number): Out => {
  const a0 = A(4, 0), a1 = A(4, 1), a2 = A(4, 2);
  const tQ = a0 + 2.0, tPane = a0 + 2.4, tRef = a1 + 3.0;
  const SRCS = [{n: 'Sales_CSV', old: 4800, nw: 5000}, {n: 'Sales_2025_Excel', old: 11500, nw: 12000}, {n: 'Monthly_Folder', old: 28800, nw: 30000}, {n: 'Web_Rates', old: 2900, nw: 3000}];
  const st = (k: number) => { const s0 = tRef + 0.2 + k * 0.9, s1 = s0 + 2.0; return {s0, s1, p: pe(t, s0, s1)}; };
  const q: QItem[] = SRCS.map((s, k) => { const {s0, s1, p} = st(k); const loading = t >= s0 && t < s1; return {n: s.n, rows: t >= s1 ? s.nw : loading ? Math.round(s.old + (s.nw - s.old) * p) : s.old, state: loading ? 'loading' : 'ok', prog: p}; });
  const doneAll = t >= st(3).s1;
  const total = q.reduce((a, b) => a + b.rows, 0);
  const ks: K[] = [REST, [a0 + 0.3, 760, -60], wcK(tQ, center(BTN.qc)), wcK(tQ + 0.3, center(BTN.qc)), wcK(tRef - 0.5, {x: 560, y: 330}), wcK(END(4) - 6, {x: 560, y: 330})];
  const c = cur(t, ks);
  const gl = doneAll ? 1 - pg(t, st(3).s1, st(3).s1 + 1.6) : 0;
  const cell = (r: number, cc: number): Cell | undefined => {
    if (r === 1) return cc < 3 ? hdrC(['Source', 'Rows', 'Status'][cc]) : undefined;
    if (cc > 2) return undefined;
    if (r >= 2 && r <= 5) { const k = r - 2, x = q[k]; return cc === 0 ? {t: SRCS[k].n, bg: band(r)} : cc === 1 ? {t: fmtN(x.rows), bg: x.state === 'loading' ? 'rgba(56,189,248,0.25)' : t >= st(k).s1 ? emer(0.4 * Math.max(0, 1 - pg(t, st(k).s1, st(k).s1 + 1.6))) || band(r) : band(r), al: 'r'} : {t: x.state === 'loading' ? 'Refreshing...' : t >= st(k).s1 ? 'Updated' : 'Connected', bg: band(r)}; }
    if (r === 6) return cc === 0 ? {t: 'Total', b: true, bt: '#8EA9DB'} : cc === 1 ? {t: fmtN(total), b: true, al: 'r', bt: '#8EA9DB', bg: gl > 0 ? emer(0.4 * gl) : undefined} : cc === 2 ? {t: doneAll ? '4 of 4 sources' : '', b: true, bt: '#8EA9DB'} : undefined;
    return undefined;
  };
  const ov = (g: Geo) => (
    <div style={{position: 'absolute', inset: 0}}>
      {wrap(pe(t, a2 + 0.8, a2 + 1.6) * (1 - pe(t, a2 + 9, a2 + 10)), <Box r={g.rect(1, 0, 6, 2)} c={COL.green} w={3} glow={0.9}/>)}
      <Seal x={700} y={150} s={130} p={pe(t, a2 + 3.5, a2 + 4.9)}/>
    </div>
  );
  const v: View = {...base, widths: [140, 90, 120], cell, sel: one(2, 0), ov, paneW: t >= tPane ? PANE.w : 0, pane: t >= tPane ? <QCPane items={q} glow={gl}/> : undefined, cursor: () => c, hi: t >= tQ - 0.4 && t < tQ + 0.3 ? 'qc' : undefined,
    sheet: 0, sheets: ['Summary', 'Sales_CSV', 'Sales_2025_Excel', 'Monthly_Folder', 'Web_Rates'], file: 'manzooma_sales_2026.xlsx'};
  return {v, zoom: 1, zx: 0, zy: 0};
};
void Menu; void CMB_MENU; void DELIMS; void pg;
