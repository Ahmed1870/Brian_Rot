import React from 'react';
import {COL, XL} from './theme';
import {Caret, FONT, Ico} from './kit';
import {Menu, MI, R, center, menuItemRect} from './pivotkit';
import {BR_AR, csvRow, fileDate, fileName, fmtN, moj} from './data47';

export const G = {
  open: {x: 314, y: 70, w: 620, h: 420}, csv: {x: 224, y: 30, w: 800, h: 500}, nav: {x: 174, y: 40, w: 900, h: 480}, folder: {x: 394, y: 170, w: 460, h: 200},
  fprev: {x: 154, y: 50, w: 940, h: 440}, comb: {x: 254, y: 50, w: 740, h: 440}, web: {x: 394, y: 150, w: 470, h: 250}, dss: {x: 274, y: 70, w: 700, h: 420},
  perm: {x: 324, y: 110, w: 600, h: 340}, expl: {x: 244, y: 70, w: 760, h: 420},
};
type D = {x: number; y: number; w: number; h: number};
const f12: React.CSSProperties = {fontFamily: FONT.ui, fontSize: 12, color: '#1B1B1B', whiteSpace: 'nowrap'};
const Abs: React.FC<{r: {x: number; y: number; w?: number; h?: number}; s?: React.CSSProperties; children?: React.ReactNode}> = ({r, s, children}) => <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, ...s}}>{children}</div>;
const Frame: React.FC<{d: D; title: string; children?: React.ReactNode; bg?: string}> = ({d, title, children, bg = '#fff'}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: XL.winW, height: XL.winH, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: d.x, top: d.y, width: d.w, height: d.h, background: bg, border: '1px solid #6E6E6E', boxShadow: '0 12px 34px rgba(0,0,0,.4)'}}>
      <div style={{height: 30, background: '#fff', borderBottom: '1px solid #E3E3E3', ...f12, lineHeight: '30px', paddingLeft: 12, fontWeight: 600}}>{title}</div>
      <Abs r={{x: d.w - 46, y: 0, w: 46, h: 30}} s={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="10" height="10"><path d="M0 0l10 10M10 0L0 10" stroke="#333"/></svg></Abs>
    </div>
    {children}
  </div>
);
export const Bt: React.FC<{r: R; t: string; def?: boolean; hot?: boolean; dis?: boolean; dd?: boolean}> = ({r, t, def, hot, dis, dd}) => (
  <Abs r={r} s={{background: hot ? '#D6E6F5' : dis ? '#F3F3F3' : '#FDFDFD', border: `${def ? 2 : 1}px solid ${def || hot ? '#0F6CBD' : dis ? '#CFCFCF' : '#8A8A8A'}`, borderRadius: 3, boxSizing: 'border-box', textAlign: 'center', ...f12, color: dis ? '#9A9A9A' : '#1B1B1B', lineHeight: `${r.h - (def ? 4 : 2)}px`}}>{t}{dd ? <span style={{marginLeft: 6, fontSize: 9}}>▼</span> : null}</Abs>
);
export const Fld: React.FC<{r: R; t: string; dd?: boolean; open?: boolean; dim?: boolean; caret?: boolean; ar?: boolean}> = ({r, t, dd, open, dim, caret, ar}) => (
  <Abs r={r} s={{background: dim ? '#F3F3F3' : '#fff', border: `1px solid ${open ? '#0F6CBD' : '#8A8A8A'}`, boxSizing: 'border-box', ...f12, fontFamily: ar ? FONT.ar : FONT.ui, lineHeight: `${r.h - 2}px`, paddingLeft: 7, overflow: 'hidden'}}>
    {t}{caret ? <span style={{borderLeft: '1px solid #000', marginLeft: 1}}/> : null}
    {dd ? <svg width="10" height="6" style={{position: 'absolute', right: 8, top: r.h / 2 - 3}}><path d="M0.5 0.5L5 5L9.5 0.5" stroke="#444" strokeWidth="1.3" fill="none"/></svg> : null}
  </Abs>
);
const Lbl: React.FC<{x: number; y: number; t: string; b?: boolean; c?: string}> = ({x, y, t, b, c}) => <Abs r={{x, y}} s={{...f12, fontWeight: b ? 600 : 400, color: c ?? '#1B1B1B'}}>{t}</Abs>;
const Radio: React.FC<{x: number; y: number; t: string; on?: boolean}> = ({x, y, t, on}) => <Abs r={{x, y}} s={{display: 'flex', alignItems: 'center', gap: 6}}><svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="#fff" stroke="#555"/>{on ? <circle cx="7" cy="7" r="3.2" fill="#1B1B1B"/> : null}</svg><span style={f12}>{t}</span></Abs>;
type Col = {h: string; w: number; ar?: boolean; ty?: string};
export const Tbl: React.FC<{x: number; y: number; cols: Col[]; rows: string[][]; rh?: number; hl?: (r: number) => string | undefined; numbered?: boolean}> = ({x, y, cols, rows, rh = 22, hl, numbered}) => {
  let cx = x + (numbered ? 34 : 0);
  return (
    <div>
      {numbered ? <Abs r={{x, y, w: 34, h: rh}} s={{background: '#F3F3F3', border: '1px solid #D9D9D9', boxSizing: 'border-box'}}/> : null}
      {cols.map((c, i) => { const left = cx; cx += c.w; return <Abs key={i} r={{x: left, y, w: c.w, h: rh}} s={{background: '#F3F3F3', border: '1px solid #D9D9D9', boxSizing: 'border-box', ...f12, fontWeight: 600, lineHeight: `${rh - 2}px`, paddingLeft: 6, overflow: 'hidden', fontSize: 11.5}}><span style={{color: '#8A8A8A', fontSize: 9, marginRight: 4}}>{c.ty ?? 'ABC'}</span>{c.h}</Abs>; })}
      {rows.map((row, ri) => {
        let rx = x + (numbered ? 34 : 0);
        return (
          <div key={ri}>
            {numbered ? <Abs r={{x, y: y + rh * (ri + 1), w: 34, h: rh}} s={{background: '#F3F3F3', border: '1px solid #E3E3E3', boxSizing: 'border-box', ...f12, fontSize: 11, textAlign: 'center', lineHeight: `${rh - 2}px`, color: '#666'}}>{ri + 1}</Abs> : null}
            {row.map((v, ci) => { const left = rx; rx += cols[ci].w; return <Abs key={ci} r={{x: left, y: y + rh * (ri + 1), w: cols[ci].w, h: rh}} s={{background: hl?.(ri) ?? '#fff', border: '1px solid #E3E3E3', boxSizing: 'border-box', ...f12, fontFamily: cols[ci].ar ? FONT.ar : FONT.ui, fontSize: cols[ci].ar ? 12.5 : 11.5, lineHeight: `${rh - 2}px`, paddingLeft: 6, overflow: 'hidden', textAlign: cols[ci].ty === '123' ? 'right' : 'left', paddingRight: cols[ci].ty === '123' ? 6 : 0}}>{v}</Abs>; })}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Get Data menu (real structure of the Data tab dropdown) ----------
export const GD_MAIN: MI[] = [{t: 'From File', sub: true}, {t: 'From Database', sub: true}, {t: 'From Azure', sub: true}, {t: 'From Online Services', sub: true}, {t: 'From Other Sources', sub: true}, {t: 'Combine Queries', sub: true}, {t: '', sep: true}, {t: 'Launch Power Query Editor...'}, {t: 'Data Source Settings...'}, {t: 'Query Options'}];
export const GD_SUB: Record<string, MI[]> = {
  file: [{t: 'From Excel Workbook'}, {t: 'From Text/CSV'}, {t: 'From XML'}, {t: 'From JSON'}, {t: 'From PDF'}, {t: 'From Folder'}, {t: 'From SharePoint Folder'}],
  db: [{t: 'From SQL Server Database'}, {t: 'From Microsoft Access Database'}, {t: 'From SQL Server Analysis Services Database (Import)'}, {t: 'From Oracle Database'}, {t: 'From IBM Db2 Database'}, {t: 'From MySQL Database'}],
  other: [{t: 'From Table/Range'}, {t: 'From Web'}, {t: 'From Microsoft Query'}, {t: 'From OData Feed'}, {t: 'From ODBC'}, {t: 'From OLE DB'}, {t: 'Blank Query'}],
};
export const GD_IDX: Record<string, number> = {file: 0, db: 1, other: 4};
export const gdMain = (btn: R) => ({x: btn.x, y: btn.y + btn.h + 2, w: 250});
export const gdMainItem = (btn: R, i: number) => { const m = gdMain(btn); return menuItemRect(m.x, m.y, m.w, GD_MAIN, i); };
export const gdSubBox = (btn: R, which: string) => { const m = gdMain(btn), it = gdMainItem(btn, GD_IDX[which]); return {x: m.x + m.w - 2, y: it.y - 3, w: which === 'db' ? 330 : 230}; };
export const gdSubItem = (btn: R, which: string, i: number) => { const s = gdSubBox(btn, which); return menuItemRect(s.x, s.y, s.w, GD_SUB[which], i); };
export const GetDataMenu: React.FC<{btn: R; sub?: string | null; hot?: number; subHot?: number}> = ({btn, sub, hot, subHot}) => {
  const m = gdMain(btn);
  return (
    <div>
      <Menu x={m.x} y={m.y} w={m.w} items={GD_MAIN} hot={hot}/>
      {sub ? (() => { const s = gdSubBox(btn, sub); return <Menu x={s.x} y={s.y} w={s.w} items={GD_SUB[sub]} hot={subHot}/>; })() : null}
    </div>
  );
};

// ---------- Open file dialog ----------
export const odFile = (i: number): R => ({x: G.open.x + 176, y: G.open.y + 112 + i * 24, w: G.open.w - 190, h: 24});
export const odImport: R = {x: G.open.x + G.open.w - 176, y: G.open.y + G.open.h - 44, w: 78, h: 28};
export const OpenDlg: React.FC<{title: string; files: {n: string; date: string; type: string; size: string}[]; sel: number | null; okHot?: boolean}> = ({title, files, sel, okHot}) => {
  const d = G.open;
  return (
    <Frame d={d} title={title} bg="#fff">
      <Abs r={{x: d.x + 12, y: d.y + 42, w: 26, h: 26}} s={{...f12, fontSize: 16}}>←</Abs>
      <Fld r={{x: d.x + 90, y: d.y + 42, w: 380, h: 26}} t="This PC  ›  Documents  ›  Manzooma  ›  Data" dd/>
      <Fld r={{x: d.x + 484, y: d.y + 42, w: 124, h: 26}} t="Search Data" dim/>
      {['Quick access', '   Desktop', '   Downloads', '   Documents', 'This PC', 'Network'].map((n, i) => <Lbl key={n} x={d.x + 16} y={d.y + 84 + i * 24} t={n} b={!n.startsWith(' ') && i !== 3} c={n.trim() === 'Documents' ? '#0F6CBD' : undefined}/>)}
      <Abs r={{x: d.x + 170, y: d.y + 84, w: d.w - 182, h: 24}} s={{borderBottom: '1px solid #E3E3E3', ...f12, color: '#555', display: 'flex'}}><span style={{width: 200}}>Name</span><span style={{width: 130}}>Date modified</span><span style={{width: 120}}>Type</span><span>Size</span></Abs>
      {files.map((f, i) => { const r = odFile(i); return <Abs key={f.n} r={r} s={{background: sel === i ? '#CCE8FF' : undefined, border: sel === i ? '1px solid #99D1FF' : '1px solid transparent', boxSizing: 'border-box', ...f12, display: 'flex', lineHeight: '22px', alignItems: 'center'}}><span style={{width: 200, paddingLeft: 6}}>{f.n}</span><span style={{width: 130, color: '#555'}}>{f.date}</span><span style={{width: 120, color: '#555'}}>{f.type}</span><span style={{color: '#555'}}>{f.size}</span></Abs>; })}
      <Lbl x={d.x + 170} y={d.y + d.h - 88} t="File name:"/><Fld r={{x: d.x + 240, y: d.y + d.h - 94, w: 250, h: 26}} t={sel !== null ? files[sel].n : ''}/>
      <Fld r={{x: d.x + 500, y: d.y + d.h - 94, w: 108, h: 26}} t="All Files" dd/>
      <Bt r={{x: d.x + 170, y: odImport.y, w: 70, h: 28}} t="Tools" dd/><Bt r={odImport} t="Import" def hot={okHot}/><Bt r={{...odImport, x: odImport.x + 88}} t="Cancel"/>
    </Frame>
  );
};

// ---------- Text/CSV dialog ----------
export const ORIG = ['1256: Arabic (Windows)', '1252: Western European (Windows)', '65001: Unicode (UTF-8)', '1200: Unicode', '20127: US-ASCII'];
export const DELIMS = ['Comma', 'Colon', 'Equals Sign', 'Semicolon', 'Space', 'Tab', '--Custom--', '--Fixed Width--'];
const cd = G.csv;
export const csvOrigin: R = {x: cd.x + 20, y: cd.y + 78, w: 260, h: 26};
export const csvDelim: R = {x: cd.x + 300, y: cd.y + 78, w: 200, h: 26};
export const csvList = (which: 'origin' | 'delim', i: number): R => { const b = which === 'origin' ? csvOrigin : csvDelim; return {x: b.x, y: b.y + b.h + i * 24, w: b.w + (which === 'origin' ? 0 : 20), h: 24}; };
export const csvBtn = {load: {x: cd.x + cd.w - 336, y: cd.y + cd.h - 46, w: 110, h: 30}, tr: {x: cd.x + cd.w - 216, y: cd.y + cd.h - 46, w: 120, h: 30}, cancel: {x: cd.x + cd.w - 86, y: cd.y + cd.h - 46, w: 72, h: 30}};
export const csvCols = (garble: boolean): Col[] => [{h: 'Date', w: 110, ty: '📅'.length ? 'DATE' : ''}, {h: 'Branch', w: 150, ar: !garble}, {h: 'Category', w: 150}, {h: 'Sales Amount', w: 140, ty: '123'}];
export const csvRows = (f: number, n: number, garble: boolean): string[][] => Array.from({length: n}, (_, j) => { const r = csvRow(f, j); return [r.d, garble ? moj(r.br) : r.br, r.cat, String(r.sales)]; });
export const CsvDlg: React.FC<{name: string; origin: string; delim: string; open?: 'origin' | 'delim' | null; hot?: number; loadHot?: boolean; garble: boolean}> = ({name, origin, delim, open, hot, loadHot, garble}) => (
  <Frame d={cd} title={name}>
    <Lbl x={cd.x + 20} y={cd.y + 54} t="File Origin"/><Fld r={csvOrigin} t={origin} dd open={open === 'origin'}/>
    <Lbl x={cd.x + 300} y={cd.y + 54} t="Delimiter"/><Fld r={csvDelim} t={delim} dd open={open === 'delim'}/>
    <Lbl x={cd.x + 520} y={cd.y + 54} t="Data Type Detection"/><Fld r={{x: cd.x + 520, y: cd.y + 78, w: 260, h: 26}} t="Based on first 200 rows" dd/>
    <Tbl x={cd.x + 20} y={cd.y + 124} cols={csvCols(garble)} rows={csvRows(0, 8, garble)} numbered={false}/>
    <Abs r={{x: cd.x + 20, y: cd.y + cd.h - 76}} s={{...f12, color: '#666'}}>The data in the preview has been truncated due to size limits.</Abs>
    <Bt r={csvBtn.load} t="Load" def hot={loadHot} dd/><Bt r={csvBtn.tr} t="Transform Data"/><Bt r={csvBtn.cancel} t="Cancel"/>
    {open === 'origin' ? <Abs r={{x: csvOrigin.x, y: csvOrigin.y + csvOrigin.h, w: csvOrigin.w, h: ORIG.length * 24}} s={{background: '#fff', border: '1px solid #8A8A8A', boxShadow: '0 4px 12px rgba(0,0,0,.25)', zIndex: 5}}>{ORIG.map((n, i) => <Abs key={n} r={{x: 0, y: i * 24, w: csvOrigin.w - 2, h: 24}} s={{background: hot === i ? '#0F6CBD' : n === origin ? '#E5F1FB' : undefined, color: hot === i ? '#fff' : '#1B1B1B', ...f12, lineHeight: '24px', paddingLeft: 8, boxSizing: 'border-box'}}>{n}</Abs>)}</Abs> : null}
    {open === 'delim' ? <Abs r={{x: csvDelim.x, y: csvDelim.y + csvDelim.h, w: csvDelim.w + 20, h: DELIMS.length * 24}} s={{background: '#fff', border: '1px solid #8A8A8A', boxShadow: '0 4px 12px rgba(0,0,0,.25)', zIndex: 5}}>{DELIMS.map((n, i) => <Abs key={n} r={{x: 0, y: i * 24, w: csvDelim.w + 18, h: 24}} s={{background: hot === i ? '#0F6CBD' : n === delim ? '#E5F1FB' : undefined, color: hot === i ? '#fff' : '#1B1B1B', ...f12, lineHeight: '24px', paddingLeft: 8, boxSizing: 'border-box'}}>{n}</Abs>)}</Abs> : null}
  </Frame>
);

// ---------- Navigator ----------
const nd = G.nav;
export const navItem = (i: number): R => ({x: nd.x + 16, y: nd.y + 88 + i * 24, w: 240, h: 24});
export const navBtn = {load: {x: nd.x + nd.w - 336, y: nd.y + nd.h - 46, w: 110, h: 30}, tr: {x: nd.x + nd.w - 216, y: nd.y + nd.h - 46, w: 120, h: 30}, cancel: {x: nd.x + nd.w - 86, y: nd.y + nd.h - 46, w: 72, h: 30}};
export const NavDlg: React.FC<{items: {t: string; ind?: number; ic?: string}[]; sel: number | null; title: string; cols: Col[]; rows: string[][]; loadHot?: boolean; previewT?: string; glow?: string}> = ({items, sel, title, cols, rows, loadHot, previewT, glow}) => (
  <Frame d={nd} title="Navigator">
    <Fld r={{x: nd.x + 16, y: nd.y + 44, w: 240, h: 26}} t="Display Options" dd/>
    {items.map((it, i) => { const r = navItem(i); return <Abs key={i} r={r} s={{background: sel === i ? '#CCE8FF' : undefined, ...f12, lineHeight: '24px', paddingLeft: 8 + (it.ind ?? 0) * 18, display: 'flex', alignItems: 'center', gap: 6, boxSizing: 'border-box'}}>{it.ic ? <Ico k={it.ic} s={15}/> : null}{it.t}</Abs>; })}
    <Abs r={{x: nd.x + 268, y: nd.y + 44, w: nd.w - 284, h: nd.h - 112}} s={{border: `1px solid ${glow ?? '#D0D0D0'}`, boxShadow: glow ? `0 0 14px ${glow}` : undefined, boxSizing: 'border-box'}}/>
    {sel !== null ? <Abs r={{x: nd.x + 280, y: nd.y + 52}} s={{...f12, fontWeight: 600, fontSize: 13}}>{previewT ?? title}</Abs> : <Abs r={{x: nd.x + 400, y: nd.y + 200}} s={{...f12, color: '#777'}}>Select an item to preview</Abs>}
    {sel !== null ? <Tbl x={nd.x + 280} y={nd.y + 82} cols={cols} rows={rows}/> : null}
    <Bt r={navBtn.load} t="Load" def hot={loadHot} dd/><Bt r={navBtn.tr} t="Transform Data"/><Bt r={navBtn.cancel} t="Cancel"/>
  </Frame>
);

// ---------- Folder dialogs ----------
const fd = G.folder;
export const folderField: R = {x: fd.x + 20, y: fd.y + 80, w: 330, h: 28};
export const folderOK: R = {x: fd.x + fd.w - 176, y: fd.y + fd.h - 46, w: 76, h: 28};
export const FolderDlg: React.FC<{title?: string; path: string; caret?: boolean; okHot?: boolean}> = ({title = 'Folder', path, caret, okHot}) => (
  <Frame d={fd} title={title}>
    <Lbl x={fd.x + 20} y={fd.y + 52} t="Folder path"/><Fld r={folderField} t={path} caret={caret}/><Bt r={{x: fd.x + 360, y: fd.y + 80, w: 84, h: 28}} t="Browse..."/>
    <Bt r={folderOK} t="OK" def hot={okHot}/><Bt r={{...folderOK, x: folderOK.x + 88}} t="Cancel"/>
  </Frame>
);
const pd = G.fprev;
export const fpBtn = {combine: {x: pd.x + pd.w - 448, y: pd.y + pd.h - 46, w: 112, h: 30}, load: {x: pd.x + pd.w - 326, y: pd.y + pd.h - 46, w: 90, h: 30}, tr: {x: pd.x + pd.w - 228, y: pd.y + pd.h - 46, w: 120, h: 30}, cancel: {x: pd.x + pd.w - 96, y: pd.y + pd.h - 46, w: 72, h: 30}};
export const CMB_MENU: MI[] = [{t: 'Combine & Transform Data'}, {t: 'Combine & Load'}, {t: 'Combine & Load To...'}];
export const fpMenuBox = {x: fpBtn.combine.x, y: fpBtn.combine.y - 3 * 24 - 12, w: 230};
export const fpMenuItem = (i: number) => menuItemRect(fpMenuBox.x, fpMenuBox.y, fpMenuBox.w, CMB_MENU, i);
export const FolderPreview: React.FC<{path: string; files: number; menu: boolean; hot?: number; combineHot?: boolean; glow?: number}> = ({path, files, menu, hot, combineHot, glow = 0}) => {
  const cols: Col[] = [{h: 'Content', w: 70, ty: ''}, {h: 'Name', w: 150}, {h: 'Extension', w: 80}, {h: 'Date accessed', w: 150, ty: 'DATE'}, {h: 'Date modified', w: 150, ty: 'DATE'}, {h: 'Date created', w: 150, ty: 'DATE'}, {h: 'Attributes', w: 70, ty: ''}, {h: 'Folder Path', w: 90}];
  const rows = Array.from({length: files}, (_, f) => ['Binary', fileName(f), '.csv', fileDate(f), fileDate(f), fileDate(f), 'Record', 'C:\\Manzooma\\Monthly_Sales_Folder\\']);
  return (
    <Frame d={pd} title={path}>
      <Tbl x={pd.x + 20} y={pd.y + 46} cols={cols} rows={rows} rh={22} hl={() => (glow > 0 ? `rgba(245,158,11,${0.3 * glow})` : undefined)}/>
      <Bt r={fpBtn.combine} t="Combine" hot={combineHot} dd/><Bt r={fpBtn.load} t="Load" dd/><Bt r={fpBtn.tr} t="Transform Data"/><Bt r={fpBtn.cancel} t="Cancel"/>
      {menu ? <Menu x={fpMenuBox.x} y={fpMenuBox.y} w={fpMenuBox.w} items={CMB_MENU} hot={hot}/> : null}
    </Frame>
  );
};
const cb = G.comb;
export const cmbOK: R = {x: cb.x + cb.w - 176, y: cb.y + cb.h - 46, w: 76, h: 28};
export const CombineDlg: React.FC<{okHot?: boolean}> = ({okHot}) => (
  <Frame d={cb} title="Combine Files">
    <Lbl x={cb.x + 20} y={cb.y + 46} t="Sample File" b/><Lbl x={cb.x + 20} y={cb.y + 66} t="Example File:" c="#555"/><Fld r={{x: cb.x + 110, y: cb.y + 62, w: 180, h: 26}} t="First File" dd/>
    <Abs r={{x: cb.x + 20, y: cb.y + 100, w: 240, h: 260}} s={{border: '1px solid #D0D0D0', boxSizing: 'border-box'}}/>
    <Lbl x={cb.x + 30} y={cb.y + 110} t="Sales_2026-01.csv" b/><Lbl x={cb.x + 44} y={cb.y + 136} t="Parameter1"/>
    <Tbl x={cb.x + 278} y={cb.y + 100} cols={[{h: 'Date', w: 90, ty: 'DATE'}, {h: 'Branch', w: 130, ar: true}, {h: 'Category', w: 110}, {h: 'Sales Amount', w: 110, ty: '123'}]} rows={csvRows(0, 8, false)}/>
    <Abs r={{x: cb.x + 20, y: cb.y + cb.h - 80}} s={{display: 'flex', alignItems: 'center', gap: 7}}><svg width="14" height="14"><rect x="0.5" y="0.5" width="13" height="13" rx="2" fill="#fff" stroke="#555"/></svg><span style={f12}>Skip files with errors</span></Abs>
    <Bt r={cmbOK} t="OK" def hot={okHot}/><Bt r={{...cmbOK, x: cmbOK.x + 88}} t="Cancel"/>
  </Frame>
);

// ---------- From Web ----------
const wd = G.web;
export const webField: R = {x: wd.x + 20, y: wd.y + 116, w: 430, h: 28};
export const webOK: R = {x: wd.x + wd.w - 176, y: wd.y + wd.h - 46, w: 76, h: 28};
export const WebDlg: React.FC<{url: string; caret?: boolean; okHot?: boolean}> = ({url, caret, okHot}) => (
  <Frame d={wd} title="From Web">
    <Radio x={wd.x + 20} y={wd.y + 46} t="Basic" on/><Radio x={wd.x + 90} y={wd.y + 46} t="Advanced"/>
    <Lbl x={wd.x + 20} y={wd.y + 90} t="URL"/><Fld r={webField} t={url} caret={caret}/>
    <Bt r={webOK} t="OK" def hot={okHot}/><Bt r={{...webOK, x: webOK.x + 88}} t="Cancel"/>
  </Frame>
);

// ---------- Data source settings ----------
const sd = G.dss;
export const dssItem = (i: number): R => ({x: sd.x + 20, y: sd.y + 138 + i * 30, w: 490, h: 30});
export const dssBtn = {change: {x: sd.x + sd.w - 170, y: sd.y + 138, w: 150, h: 30}, perm: {x: sd.x + sd.w - 170, y: sd.y + 178, w: 150, h: 30}, clear: {x: sd.x + sd.w - 170, y: sd.y + 218, w: 150, h: 30}, close: {x: sd.x + sd.w - 96, y: sd.y + sd.h - 46, w: 76, h: 28}};
export const DssDlg: React.FC<{items: string[]; sel: number | null; flash?: number; closeHot?: boolean}> = ({items, sel, flash = 0, closeHot}) => (
  <Frame d={sd} title="Data source settings">
    <Lbl x={sd.x + 20} y={sd.y + 44} t="Manage Data Source Permissions" b/>
    <Lbl x={sd.x + 20} y={sd.y + 64} t="Select the data source to edit its permissions." c="#555"/>
    <Radio x={sd.x + 20} y={sd.y + 92} t="Data sources in current workbook" on/><Radio x={sd.x + 270} y={sd.y + 92} t="Global permissions"/>
    <Abs r={{x: sd.x + 20, y: sd.y + 136, w: 490, h: 200}} s={{border: '1px solid #8A8A8A', boxSizing: 'border-box', background: '#fff'}}/>
    {items.map((it, i) => { const r = dssItem(i); return <Abs key={i} r={{...r, x: r.x + 1, w: r.w - 2}} s={{background: sel === i ? '#CCE8FF' : flash > 0 && i === 0 ? `rgba(16,185,129,${0.3 * flash})` : undefined, ...f12, lineHeight: '30px', paddingLeft: 10, boxSizing: 'border-box', overflow: 'hidden', fontFamily: FONT.mono, fontSize: 11.5}}>{it}</Abs>; })}
    <Bt r={dssBtn.change} t="Change Source..." dis={sel === null}/><Bt r={dssBtn.perm} t="Edit Permissions..." dis={sel === null}/><Bt r={dssBtn.clear} t="Clear Permissions" dis={sel === null}/>
    <Bt r={dssBtn.close} t="Close" hot={closeHot}/>
  </Frame>
);
const pm = G.perm;
export const permOK: R = {x: pm.x + pm.w - 176, y: pm.y + pm.h - 46, w: 76, h: 28};
export const PermDlg: React.FC<{path: string; okHot?: boolean}> = ({path, okHot}) => (
  <Frame d={pm} title="Edit Permissions">
    <Lbl x={pm.x + 20} y={pm.y + 46} t="Data Source" b/><Fld r={{x: pm.x + 20, y: pm.y + 68, w: 560, h: 28}} t={path} dim/>
    <Lbl x={pm.x + 20} y={pm.y + 116} t="Credentials" b/>
    <Abs r={{x: pm.x + 20, y: pm.y + 138, w: 560, h: 64}} s={{border: '1px solid #C8C8C8', boxSizing: 'border-box'}}/>
    <Lbl x={pm.x + 34} y={pm.y + 156} t="Windows: Current user"/><Bt r={{x: pm.x + 480, y: pm.y + 152, w: 84, h: 28}} t="Edit..."/>
    <Lbl x={pm.x + 20} y={pm.y + 218} t="Privacy Level" b/><Fld r={{x: pm.x + 20, y: pm.y + 240, w: 260, h: 28}} t="Organizational" dd/>
    <Bt r={permOK} t="OK" def hot={okHot}/><Bt r={{...permOK, x: permOK.x + 88}} t="Cancel"/>
  </Frame>
);

// ---------- Power Query Editor (separate window in real Excel) ----------
export const pqClose: R = {x: 10, y: 62, w: 76, h: 62};
export const PQEditor: React.FC<{rows: number; steps: string[]; name: string; closeHot?: boolean; glow?: number; status?: string}> = ({rows, steps, name, closeHot, glow = 0, status}) => {
  const cols: Col[] = [{h: 'Source.Name', w: 150}, {h: 'Date', w: 90, ty: 'DATE'}, {h: 'Branch', w: 130, ar: true}, {h: 'Category', w: 120}, {h: 'Sales Amount', w: 120, ty: '123'}];
  const data: string[][] = Array.from({length: rows}, (_, k) => { const f = Math.floor(k / 4), j = (k % 4) * 9; const r = csvRow(f, j); return [fileName(f), r.d, r.br, r.cat, String(r.sales)]; });
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: XL.winW, height: XL.winH, background: '#fff', ...f12, zIndex: 8}}>
      <div style={{height: 30, background: '#F3F3F3', lineHeight: '30px', paddingLeft: 14, fontWeight: 600}}>{name} - Power Query Editor</div>
      <Abs r={{x: XL.winW - 138, y: 0}} s={{display: 'flex'}}>{['M0 8h10', 'M0.5 0.5h9v9h-9z', 'M0 0l10 10M10 0L0 10'].map((d, i) => <div key={i} style={{width: 46, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="10" height="10"><path d={d} stroke="#333" fill="none"/></svg></div>)}</Abs>
      <Abs r={{x: 0, y: 30, w: XL.winW, h: 28}} s={{background: '#F3F3F3', display: 'flex', alignItems: 'flex-end', paddingLeft: 6}}>{['File', 'Home', 'Transform', 'Add Column', 'View', 'Tools', 'Help'].map((t, i) => <div key={t} style={{padding: '0 12px', height: 26, lineHeight: '24px', fontWeight: i === 1 ? 600 : 400, position: 'relative', color: i === 0 ? '#fff' : undefined, background: i === 0 ? '#217346' : undefined}}>{t}{i === 1 ? <div style={{position: 'absolute', left: 8, right: 8, bottom: 0, height: 3, background: '#217346'}}/> : null}</div>)}</Abs>
      <Abs r={{x: 0, y: 58, w: XL.winW, h: 90}} s={{background: '#fff', borderTop: '1px solid #D1D1D1', borderBottom: '1px solid #D1D1D1', boxSizing: 'border-box'}}>
        {[{x: 4, w: 100, l: 'Close'}, {x: 104, w: 330, l: 'Query'}, {x: 434, w: 170, l: 'Manage Columns'}, {x: 604, w: 170, l: 'Reduce Rows'}, {x: 774, w: 90, l: 'Sort'}, {x: 864, w: 250, l: 'Transform'}].map((g) => <Abs key={g.l} r={{x: g.x, y: 0, w: g.w, h: 88}} s={{borderRight: '1px solid #DADADA'}}><Abs r={{x: 0, y: 70, w: g.w}} s={{...f12, fontSize: 11, textAlign: 'center', color: '#605E5C'}}>{g.l}</Abs></Abs>)}
        <Abs r={{x: 10, y: 4, w: 76, h: 62}} s={{display: 'flex', flexDirection: 'column', alignItems: 'center', background: closeHot ? '#CDE6F7' : undefined, border: closeHot ? '1px solid #8FC2E9' : undefined, boxSizing: 'border-box', borderRadius: 3}}><div style={{marginTop: 4}}><Ico k="save" s={28}/></div><span style={{...f12, fontSize: 11, marginTop: 3}}>Close &amp;</span><span style={{...f12, fontSize: 11}}>Load <span style={{fontSize: 8}}>▼</span></span></Abs>
        {[['refresh', 'Refresh Preview', 110], ['opts', 'Properties', 230], ['qc', 'Advanced Editor', 320]].map(([k, l, x], i) => <Abs key={String(l)} r={{x: Number(x), y: 6 + (i % 3) * 0, w: 100, h: 62}} s={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><div style={{marginTop: 4}}><Ico k={String(k)} s={26}/></div><span style={{...f12, fontSize: 11, marginTop: 3}}>{String(l)}</span></Abs>)}
        {[['table', 'Choose', 'Columns', 440], ['delete', 'Remove', 'Columns', 520], ['sort', 'Keep', 'Rows', 610], ['delete', 'Remove', 'Rows', 690], ['sort', 'A↓ Z', '', 784], ['t2c', 'Split', 'Column', 870], ['grp', 'Group', 'By', 940], ['merge', 'Use First Row', 'as Headers', 1010], ['fill', 'Replace', 'Values', 1110]].map(([k, a, b, x]) => <Abs key={String(a) + String(x)} r={{x: Number(x), y: 6, w: 74, h: 62}} s={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><div style={{marginTop: 4}}><Ico k={String(k)} s={26}/></div><span style={{...f12, fontSize: 10.5, marginTop: 3}}>{String(a)}</span><span style={{...f12, fontSize: 10.5}}>{String(b)}</span></Abs>)}
      </Abs>
      <Abs r={{x: 0, y: 148, w: XL.winW, h: 24}} s={{borderBottom: '1px solid #D1D1D1', boxSizing: 'border-box'}}>
        <Abs r={{x: 140, y: 3}} s={{fontFamily: FONT.cell, fontStyle: 'italic', fontWeight: 700, color: '#555'}}>fx</Abs>
        <Abs r={{x: 176, y: 2, w: 1000}} s={{fontFamily: FONT.mono, fontSize: 11.5, lineHeight: '20px'}}>{steps.length ? `= ${steps[steps.length - 1] === 'Source' ? 'Folder.Files("C:\\Manzooma\\Monthly_Sales_Folder")' : 'Table.TransformColumnTypes(#"Expanded Table Column",{{"Date", type date}, {"Sales Amount", Int64.Type}})'}` : ''}</Abs>
      </Abs>
      <Abs r={{x: 0, y: 172, w: 140, h: 364}} s={{borderRight: '1px solid #D1D1D1', background: '#FAFAFA', boxSizing: 'border-box'}}><Abs r={{x: 10, y: 8}} s={{fontWeight: 600}}>Queries [1]</Abs><Abs r={{x: 6, y: 34, w: 126, h: 24}} s={{background: '#E5F1FB', lineHeight: '24px', paddingLeft: 8, display: 'flex', alignItems: 'center', gap: 6, boxSizing: 'border-box'}}><Ico k="table" s={14}/>{name}</Abs></Abs>
      <Tbl x={146} y={174} cols={cols} rows={data} rh={22} numbered hl={() => (glow > 0 ? `rgba(245,158,11,${0.28 * glow})` : undefined)}/>
      <Abs r={{x: 990, y: 172, w: 258, h: 364}} s={{borderLeft: '1px solid #D1D1D1', background: '#FAFAFA', boxSizing: 'border-box'}}>
        <Abs r={{x: 12, y: 8}} s={{fontWeight: 600, fontSize: 13}}>Query Settings</Abs>
        <Abs r={{x: 12, y: 34}} s={{color: '#666', fontSize: 11}}>PROPERTIES</Abs><Fld r={{x: 12, y: 52, w: 230, h: 26}} t={name}/>
        <Abs r={{x: 12, y: 96}} s={{color: '#666', fontSize: 11}}>APPLIED STEPS</Abs>
        {steps.map((st, i) => <Abs key={st} r={{x: 8, y: 116 + i * 26, w: 242, h: 26}} s={{background: i === steps.length - 1 ? '#E5F1FB' : undefined, lineHeight: '26px', paddingLeft: 10, display: 'flex', alignItems: 'center', gap: 8, boxSizing: 'border-box'}}><span style={{color: '#c00', fontSize: 11}}>✕</span>{st}</Abs>)}
      </Abs>
      <Abs r={{x: 0, y: XL.winH - 24, w: XL.winW, h: 24}} s={{background: '#F3F3F3', borderTop: '1px solid #D1D1D1', lineHeight: '24px', paddingLeft: 12, fontSize: 11, color: '#444', boxSizing: 'border-box'}}>{status ?? '5 COLUMNS, 999+ ROWS      Column profiling based on top 1000 rows'}</Abs>
    </div>
  );
};

// ---------- Windows Explorer (drop a new monthly file into the folder) ----------
export const explIcon: R = {x: 1062, y: 170, w: 64, h: 64};
export const explList = (i: number): R => ({x: G.expl.x + 190, y: G.expl.y + 120 + i * 24, w: G.expl.w - 204, h: 24});
export const Explorer: React.FC<{files: number; newHot?: boolean; dropGlow?: number; showSrc?: boolean}> = ({files, newHot, dropGlow = 0, showSrc = true}) => {
  const d = G.expl;
  return (
    <Frame d={d} title="Monthly_Sales_Folder">
      <Fld r={{x: d.x + 120, y: d.y + 40, w: 480, h: 26}} t="This PC  ›  Documents  ›  Manzooma  ›  Monthly_Sales_Folder" dd/><Fld r={{x: d.x + 612, y: d.y + 40, w: 130, h: 26}} t="Search" dim/>
      {['Home', 'Gallery', '', 'Desktop', 'Downloads', 'Documents', 'Manzooma'].map((n, i) => n ? <Lbl key={n} x={d.x + 18} y={d.y + 84 + i * 24} t={n} b={n === 'Manzooma'} c={n === 'Manzooma' ? '#0F6CBD' : undefined}/> : null)}
      <Abs r={{x: d.x + 190, y: d.y + 94, w: d.w - 204, h: 24}} s={{borderBottom: '1px solid #E3E3E3', ...f12, color: '#555', display: 'flex'}}><span style={{width: 260}}>Name</span><span style={{width: 170}}>Date modified</span><span style={{width: 100}}>Type</span><span>Size</span></Abs>
      {Array.from({length: files}, (_, f) => { const r = explList(f); const isNew = f === 12; return <Abs key={f} r={r} s={{...f12, display: 'flex', alignItems: 'center', lineHeight: '24px', background: isNew && dropGlow > 0 ? `rgba(16,185,129,${0.35 * dropGlow})` : isNew && newHot ? '#CCE8FF' : undefined}}><span style={{width: 260, paddingLeft: 4, display: 'flex', gap: 8, alignItems: 'center'}}><Ico k="csv" s={16}/>{fileName(f)}</span><span style={{width: 170, color: '#555'}}>{fileDate(f)}</span><span style={{width: 100, color: '#555'}}>CSV File</span><span style={{color: '#555'}}>6 KB</span></Abs>; })}
      {showSrc ? <Abs r={explIcon} s={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Ico k="csv" s={44}/><span style={{...f12, fontSize: 11, marginTop: 4, color: '#fff', textShadow: '0 1px 2px #000'}}>Sales_2027-01.csv</span></Abs> : null}
    </Frame>
  );
};

// ---------- Queries & Connections pane ----------
export type QItem = {n: string; rows: number; state: 'ok' | 'loading'; prog?: number};
export const QCPane: React.FC<{items: QItem[]; glow?: number}> = ({items, glow = 0}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 250, height: '100%', ...f12}}>
    <Abs r={{x: 10, y: 6}} s={{fontWeight: 600, fontSize: 13}}>Queries &amp; Connections</Abs>
    <Abs r={{x: 10, y: 34, w: 230, h: 26}} s={{display: 'flex', borderBottom: '1px solid #D0D0D0'}}><span style={{padding: '0 12px', borderBottom: '3px solid #217346', fontWeight: 600, lineHeight: '24px'}}>Queries</span><span style={{padding: '0 12px', color: '#666', lineHeight: '24px'}}>Connections</span></Abs>
    <Abs r={{x: 10, y: 66}} s={{color: '#666', fontSize: 11}}>{items.length} queries</Abs>
    {items.map((q, i) => (
      <Abs key={q.n} r={{x: 6, y: 86 + i * 62, w: 238, h: 58}} s={{border: `1px solid ${glow > 0 && q.state === 'ok' ? '#10B981' : '#E1E1E1'}`, background: glow > 0 && q.state === 'ok' ? `rgba(16,185,129,${0.12 * glow})` : '#fff', boxSizing: 'border-box', boxShadow: glow > 0 && q.state === 'ok' ? `0 0 10px rgba(16,185,129,${0.6 * glow})` : undefined}}>
        <Abs r={{x: 8, y: 8}}><Ico k="table" s={18}/></Abs>
        <Abs r={{x: 34, y: 6}} s={{fontWeight: 600}}>{q.n}</Abs>
        <Abs r={{x: 34, y: 26}} s={{color: '#555', fontSize: 11}}>{q.state === 'loading' ? `Loading... ${fmtN(q.rows)} rows` : `${fmtN(q.rows)} rows loaded.`}</Abs>
        {q.state === 'loading' ? <Abs r={{x: 34, y: 44, w: 190, h: 4}} s={{background: '#E1E1E1'}}><div style={{width: `${(q.prog ?? 0) * 100}%`, height: 4, background: '#217346'}}/></Abs> : null}
        <Abs r={{x: 214, y: 8}}><Ico k="refresh" s={16}/></Abs>
      </Abs>
    ))}
  </div>
);
export const BR_LIST = BR_AR;
export {center, Caret};
