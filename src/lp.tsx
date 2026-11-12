// Lesson 54 helpers: Power Pivot window (Data View + Diagram View) drawn generically, star-schema tables, relationship lines.
import React from 'react';
import {C, MONO, UIFONT} from './theme';
import {Caret, Ico, XL, clamp, prog} from './kit';
import {sale} from './data';

const ab = (x: number, y: number, w?: number, h?: number, extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...extra});
const T: React.CSSProperties = {fontFamily: UIFONT, fontSize: 12, color: '#1B1B1B', whiteSpace: 'nowrap'};

/* ------------------------------------------------------------------ model definition */
export type TId = 'prod' | 'cust' | 'store' | 'date' | 'fact';
export type TDef = {id: TId; name: string; fields: string[]; w: number; rows: string};
export const TABLES: Record<TId, TDef> = {
  prod: {id: 'prod', name: 'Dim_Product', fields: ['ProductKey', 'ProductName', 'Category', 'UnitPrice'], w: 230, rows: '8 rows'},
  cust: {id: 'cust', name: 'Dim_Customer', fields: ['CustomerKey', 'CustomerName', 'City', 'Segment'], w: 230, rows: '400 rows'},
  store: {id: 'store', name: 'Dim_Store', fields: ['StoreKey', 'StoreName', 'City', 'Region'], w: 230, rows: '5 rows'},
  date: {id: 'date', name: 'Dim_Date', fields: ['DateKey', 'Date', 'Month', 'Year'], w: 230, rows: '365 rows'},
  fact: {id: 'fact', name: 'Fact_Sales', fields: ['SaleID', 'ProductKey', 'CustomerKey', 'StoreKey', 'DateKey', 'ShipDateKey', 'Quantity', 'Amount'], w: 270, rows: '50,000 rows'},
};
export const HEAD_H = 26, ROW_H = 20;
export const tH = (id: TId) => HEAD_H + TABLES[id].fields.length * ROW_H + 6;
export type Pos = Record<TId, {x: number; y: number}>;
export const STAR: Pos = {prod: {x: 170, y: 190}, cust: {x: 170, y: 420}, store: {x: 1136, y: 190}, date: {x: 1136, y: 420}, fact: {x: 633, y: 250}};
export const CHAOS: Pos = {prod: {x: 880, y: 440}, cust: {x: 470, y: 190}, store: {x: 260, y: 400}, date: {x: 1010, y: 200}, fact: {x: 640, y: 420}};
export const fieldY = (id: TId, p: Pos, i: number) => p[id].y + HEAD_H + i * ROW_H + ROW_H / 2;
export const fieldX = (id: TId, p: Pos) => p[id].x + TABLES[id].w / 2;
export const lerpPos = (a: Pos, b: Pos, t: number): Pos => {
  const o = {} as Pos;
  (Object.keys(a) as TId[]).forEach((k) => { o[k] = {x: a[k].x + (b[k].x - a[k].x) * t, y: a[k].y + (b[k].y - a[k].y) * t}; });
  return o;
};
/** relationship definitions: dim key (idx 0) -> fact column index */
export type RelId = 'prod' | 'cust' | 'store' | 'date' | 'ship';
export const REL: Record<RelId, {dim: TId; fi: number}> = {prod: {dim: 'prod', fi: 1}, cust: {dim: 'cust', fi: 2}, store: {dim: 'store', fi: 3}, date: {dim: 'date', fi: 4}, ship: {dim: 'date', fi: 5}};
export const relEnds = (r: RelId, p: Pos) => {
  const d = REL[r].dim, left = d === 'prod' || d === 'cust';
  const a = {x: left ? p[d].x + TABLES[d].w : p[d].x, y: fieldY(d, p, 0)};
  const b = {x: left ? p.fact.x : p.fact.x + TABLES.fact.w, y: fieldY('fact', p, REL[r].fi)};
  return {a, b};
};

/* ------------------------------------------------------------------ model data (illustrative, from the lesson generator) */
const BR = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];
const PRODS = Array.from(new Set(Array.from({length: 400}, (_, i) => sale(i + 1).product)));
export const CATS = Array.from(new Set(Array.from({length: 400}, (_, i) => sale(i + 1).category))).sort();
export const STORES = [...BR].sort();
export const factRow = (n: number) => { const s = sale(n); return [String(n), String(101 + PRODS.indexOf(s.product)), String(1000 + ((n * 7) % 400)), String(1 + BR.indexOf(s.branch)), String(20260100 + 1 + ((n * 13) % 28)), String(20260100 + 3 + ((n * 13) % 28)), String(s.qty), s.total.toLocaleString('en-US')]; };
export const FACT_N = 50000;
export const catCount = (cat: string) => { let k = 0; for (let n = 1; n <= FACT_N; n++) if (sale(n).category === cat) k++; return k; };
export const pivotSum = (br: string, cat: string) => { let k = 0; for (let n = 1; n <= FACT_N; n++) { const s = sale(n); if (s.branch === br && s.category === cat) k += s.total; } return k; };
const PIV: Record<string, number> = {};
STORES.forEach((b) => CATS.forEach((c) => { PIV[`${b}|${c}`] = 0; }));
for (let n = 1; n <= FACT_N; n++) { const s = sale(n); PIV[`${s.branch}|${s.category}`] += s.total; }
export const pivot = (b: string, c: string) => PIV[`${b}|${c}`];

/* ------------------------------------------------------------------ geometry of the Power Pivot window */
export const PP = {title: 32, tabs: 30, rib: 62, ribH: 88, body: 150, bodyB: 650, tabsH: 26};
type B = {k: string; a: string; b: string; w: number; ico: string; caret?: boolean; gap?: boolean};
const BTNS: B[] = [
  {k: 'paste', a: 'Paste', b: '', w: 56, ico: 'paste', gap: true},
  {k: 'fromDb', a: 'From', b: 'Database', w: 70, ico: 'table', caret: true}, {k: 'fromSvc', a: 'From Data', b: 'Service', w: 70, ico: 'addins', caret: true}, {k: 'fromOther', a: 'From Other', b: 'Sources', w: 72, ico: 'normal'},
  {k: 'existing', a: 'Existing', b: 'Connections', w: 82, ico: 'normal'}, {k: 'refresh', a: 'Refresh', b: '', w: 60, ico: 'redo', caret: true, gap: true},
  {k: 'sortAZ', a: 'Sort', b: 'A to Z', w: 56, ico: 'sortAsc'}, {k: 'sortZA', a: 'Sort', b: 'Z to A', w: 56, ico: 'sortDesc'}, {k: 'clearSort', a: 'Clear All', b: 'Sorts', w: 62, ico: 'clear', gap: true},
  {k: 'find', a: 'Find', b: '', w: 50, ico: 'find', gap: true},
  {k: 'autosum', a: 'AutoSum', b: '', w: 66, ico: 'autosum', caret: true}, {k: 'kpi', a: 'Create', b: 'KPI', w: 56, ico: 'analyze', gap: true},
  {k: 'dataView', a: 'Data', b: 'View', w: 56, ico: 'table'}, {k: 'diagramView', a: 'Diagram', b: 'View', w: 64, ico: 'pivot'}, {k: 'showHidden', a: 'Show', b: 'Hidden', w: 56, ico: 'normal'}, {k: 'calcArea', a: 'Calculation', b: 'Area', w: 74, ico: 'normal'},
];
export const ppBtn = (k: string) => {
  let x = 8;
  for (const b of BTNS) { if (b.k === k) return {x, y: PP.rib + 4, w: b.w, h: 74, cx: x + b.w / 2, cy: PP.rib + 34}; x += b.w + (b.gap ? 14 : 0); }
  return {x: 0, y: 0, w: 0, h: 0, cx: 0, cy: 0};
};
export const ppTab = (name: string) => { const names = ['File', 'Home', 'Design', 'Advanced']; let x = 0; for (const n of names) { const w = n === 'File' ? 58 : Math.round(n.length * 7.6 + 30); if (n === name) return {x, w, cx: x + w / 2, cy: PP.title + PP.tabs / 2}; x += w; } return {x: 0, w: 0, cx: 0, cy: 0}; };

/* ------------------------------------------------------------------ table box */
export type TState = {glow?: string; glowP?: number; fieldGlow?: Record<number, string>; dim?: number; rowsLabel?: string; hot?: number};
export const TableBox: React.FC<{id: TId; pos: {x: number; y: number}; st?: TState}> = ({id, pos, st = {}}) => {
  const d = TABLES[id];
  const g = st.glowP ?? (st.glow ? 1 : 0);
  return (
    <div style={ab(pos.x, pos.y, d.w, tH(id), {background: '#fff', border: `1.5px solid ${st.glow && g > 0.05 ? st.glow : '#7E8A97'}`, boxShadow: st.glow && g > 0.05 ? `0 0 ${18 * g}px ${st.glow}` : '0 2px 6px rgba(0,0,0,.18)', borderRadius: 3, boxSizing: 'border-box', opacity: 1 - 0.55 * (st.dim ?? 0), zIndex: 4})}>
      <div style={ab(0, 0, d.w, HEAD_H, {background: id === 'fact' ? '#C9D9EE' : '#DDE6F0', borderBottom: '1px solid #9AA6B2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', boxSizing: 'border-box'})}>
        <span style={{...T, fontWeight: 700, fontSize: 12.5}}>{d.name}</span>
        <span style={{...T, fontSize: 10.5, color: '#3C4B5B'}}>{st.rowsLabel ?? ''}</span>
      </div>
      {d.fields.map((fl, i) => {
        const col = st.fieldGlow?.[i];
        return (
          <div key={fl} style={ab(0, HEAD_H + i * ROW_H, d.w, ROW_H, {display: 'flex', alignItems: 'center', padding: '0 10px', background: col ? `${col}33` : 'transparent', boxShadow: col ? `inset 0 0 0 2px ${col}` : 'none', boxSizing: 'border-box'})}>
            <span style={{...T, fontSize: 12.5}}>{fl}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ relationship line */
export type RelState = {p: number; color?: string; dashed?: boolean; one?: number; many?: number; arrow?: number; label?: string; glow?: number; labelColor?: string};
export const RelLine: React.FC<{r: RelId; pos: Pos; st: RelState; f: number}> = ({r, pos, st, f}) => {
  if (st.p <= 0.001) return null;
  const {a, b} = relEnds(r, pos);
  const col = st.color ?? C.green;
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L;
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const m = {x: a.x + dx * 0.55, y: a.y + dy * 0.55};
  const mk = (x: number, y: number, txt: string, p: number) => (
    <g opacity={clamp(p)} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * clamp(p)})`}>
      <circle r={11} fill="#fff" stroke={col} strokeWidth={2} />
      <text textAnchor="middle" y={5} fontSize={15} fontWeight={700} fill="#0B1222" fontFamily="Consolas, monospace">{txt}</text>
    </g>
  );
  const tip = {x: a.x + dx * clamp(st.p), y: a.y + dy * clamp(st.p)};
  return (
    <svg width={1536} height={672} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 3}}>
      <g style={{filter: `drop-shadow(0 0 ${6 * (st.glow ?? 0.7)}px ${col})`}}>
        <line x1={a.x} y1={a.y} x2={tip.x} y2={tip.y} stroke={col} strokeWidth={st.dashed ? 2.5 : 3.2} strokeDasharray={st.dashed ? '8 6' : undefined} strokeLinecap="round" />
      </g>
      {st.p > 0.98 && st.arrow !== undefined ? (
        <g opacity={clamp(st.arrow)} transform={`translate(${m.x} ${m.y}) rotate(${ang})`}><path d="M-9 -8 L9 0 L-9 8 Z" fill={col} stroke="#fff" strokeWidth={1.5} /></g>
      ) : null}
      {st.one !== undefined && st.one > 0 ? mk(a.x + ux * 20, a.y + uy * 20 - 12 * Math.abs(uy) - 8, '1', st.one) : null}
      {st.many !== undefined && st.many > 0 ? mk(b.x - ux * 20, b.y - uy * 20 - 12 * Math.abs(uy) - 8, '*', st.many) : null}
      {st.label && st.p > 0.98 ? (
        <g transform={`translate(${m.x} ${m.y - 30})`}><rect x={-62} y={-13} width={124} height={26} rx={13} fill={st.labelColor ?? col} /><text textAnchor="middle" y={5} fontSize={13} fontWeight={700} fill="#0B1222" fontFamily="Consolas, monospace">{st.label}</text></g>
      ) : null}
      <g style={{display: 'none'}}>{f}</g>
    </svg>
  );
};

/** red tangled mesh between table centres (scene 1) */
export const Mesh: React.FC<{pos: Pos; p: number}> = ({pos, p}) => {
  const ids = Object.keys(pos) as TId[];
  const cx = (i: TId) => pos[i].x + TABLES[i].w / 2, cy = (i: TId) => pos[i].y + tH(i) / 2;
  const lines: React.ReactNode[] = [];
  ids.forEach((a, i) => ids.slice(i + 1).forEach((b) => lines.push(<line key={a + b} x1={cx(a)} y1={cy(a)} x2={cx(b)} y2={cy(b)} stroke={C.red} strokeWidth={3} strokeDasharray="10 7" />)));
  return <svg width={1536} height={672} style={{position: 'absolute', left: 0, top: 0, opacity: p, pointerEvents: 'none', zIndex: 2, filter: `drop-shadow(0 0 6px ${C.red})`}}>{lines}</svg>;
};
/** faint spokes showing the radial layout (not relationships) */
export const Spokes: React.FC<{pos: Pos; p: number}> = ({pos, p}) => {
  const ids: TId[] = ['prod', 'cust', 'store', 'date'];
  const cx = (i: TId) => pos[i].x + TABLES[i].w / 2, cy = (i: TId) => pos[i].y + tH(i) / 2;
  return <svg width={1536} height={672} style={{position: 'absolute', left: 0, top: 0, opacity: p, pointerEvents: 'none', zIndex: 2}}>{ids.map((i) => <line key={i} x1={cx(i)} y1={cy(i)} x2={cx('fact')} y2={cy('fact')} stroke={C.blue} strokeWidth={2} strokeDasharray="3 8" strokeLinecap="round" />)}</svg>;
};

/* ------------------------------------------------------------------ data view body */
export const DataView: React.FC<{table: TId; rows?: number}> = ({table, rows = 17}) => {
  const d = TABLES[table];
  const w = 124;
  const data = (n: number): string[] => {
    if (table === 'fact') return factRow(n);
    if (table === 'prod') return [String(100 + n), PRODS[(n - 1) % PRODS.length], CATS[(n - 1) % CATS.length], String(120 + n * 55)];
    if (table === 'cust') return [String(1000 + n), `Customer ${n}`, STORES[n % 5], n % 2 ? 'Retail' : 'Business'];
    if (table === 'store') return [String(n), `Store ${n}`, STORES[(n - 1) % 5], n % 2 ? 'Delta' : 'Cairo Area'];
    return [String(20260100 + n), `1/${n}/2026`, 'January', '2026'];
  };
  return (
    <div style={ab(0, PP.body, XL.W, PP.bodyB - PP.body, {background: '#fff', overflow: 'hidden'})}>
      <div style={ab(0, 0, d.fields.length * w + 4, 26, {display: 'flex', background: '#F0F0F0', borderBottom: '1px solid #C8C8C8'})}>
        {d.fields.map((fl) => (<div key={fl} style={{width: w, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', borderRight: '1px solid #C8C8C8', boxSizing: 'border-box'}}><span style={{...T, fontWeight: 600}}>{fl}</span><Caret s={8} /></div>))}
      </div>
      {Array.from({length: rows}, (_, i) => (
        <div key={i} style={ab(0, 26 + i * 22, d.fields.length * w + 4, 22, {display: 'flex', borderBottom: '1px solid #EDEDED', background: i % 2 ? '#FAFAFA' : '#fff'})}>
          {data(i + 1).map((v, j) => (<div key={j} style={{width: w, padding: '0 8px', boxSizing: 'border-box', lineHeight: '22px', borderRight: '1px solid #EDEDED', ...T, fontSize: 12.5, textAlign: j === d.fields.length - 1 && table === 'fact' ? 'right' : 'left'}}>{v}</div>))}
        </div>
      ))}
      <div style={ab(0, PP.bodyB - PP.body - PP.tabsH, XL.W, PP.tabsH, {background: '#F3F3F3', borderTop: '1px solid #D1D1D1', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4})}>
        {(['cust', 'date', 'prod', 'store', 'fact'] as TId[]).map((id) => (<div key={id} style={{padding: '3px 14px', background: id === table ? '#fff' : 'transparent', borderBottom: id === table ? `2px solid ${C.green}` : '2px solid transparent', ...T, fontWeight: id === table ? 700 : 400}}>{TABLES[id].name}</div>))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ window */
export type PPProps = {open?: number; view: 'data' | 'diagram'; hotBtn?: string; children?: React.ReactNode; status?: string};
export const PPWin: React.FC<PPProps> = ({open = 1, view, hotBtn, children, status}) => (
  <div style={ab(0, 0, XL.W, XL.H, {background: '#fff', zIndex: 45, overflow: 'hidden', transformOrigin: '50% 50%', transform: `scale(${0.94 + 0.06 * open})`, opacity: clamp(open * 1.6), boxShadow: '0 0 0 2px #8C8C8C, 0 30px 80px rgba(0,0,0,.5)', fontFamily: UIFONT})}>
    <div style={ab(0, 0, XL.W, PP.title, {background: '#fff', borderBottom: '1px solid #E5E5E5'})}>
      <div style={ab(10, 7, 18, 18)}><Ico n="pivot" s={18} c="#107C41" /></div>
      <span style={{...T, fontSize: 12.5, position: 'absolute', left: 40, top: 8}}>Power Pivot for Excel - manzooma_sales_2026.xlsx</span>
      {['min', 'max', 'close'].map((k, i) => (<div key={k} style={ab(XL.W - 138 + i * 46, 0, 46, PP.title, {display: 'flex', alignItems: 'center', justifyContent: 'center'})}><svg width={12} height={12} viewBox="0 0 12 12"><g fill="none" stroke="#333" strokeWidth={1}>{k === 'min' ? <path d="M1 6h10" /> : k === 'max' ? <rect x={1.5} y={1.5} width={9} height={9} /> : <path d="M1 1l10 10M11 1L1 11" />}</g></svg></div>))}
    </div>
    <div style={ab(0, PP.title, XL.W, PP.tabs, {background: '#F3F3F3', borderBottom: '1px solid #D8D8D8'})}>
      {['File', 'Home', 'Design', 'Advanced'].map((n) => { const b = ppTab(n); return (<div key={n} style={ab(b.x, 0, b.w, PP.tabs, {display: 'flex', alignItems: 'center', justifyContent: 'center', background: n === 'File' ? '#107C41' : 'transparent'})}><span style={{...T, fontSize: 13, fontWeight: n === 'Home' ? 700 : 400, color: n === 'File' ? '#fff' : '#1B1B1B'}}>{n}</span>{n === 'Home' ? <div style={ab(b.w / 2 - 14, PP.tabs - 4, 28, 3, {background: '#107C41', borderRadius: 2})} /> : null}</div>); })}
    </div>
    <div style={ab(0, PP.rib, XL.W, PP.ribH, {background: '#FAFAFA', borderBottom: '1px solid #D8D8D8'})}>
      {BTNS.map((b) => {
        const bx = ppBtn(b.k); const on = (b.k === 'diagramView' && view === 'diagram') || (b.k === 'dataView' && view === 'data'); const hot = hotBtn === b.k;
        return (<div key={b.k} style={ab(bx.x, 4, b.w, 74, {display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, borderRadius: 4, background: on ? '#D9E8DF' : hot ? '#E1E1E1' : 'transparent', boxShadow: hot ? `0 0 0 2px ${C.blue}` : 'none'})}>
          <Ico n={b.ico} s={30} /><span style={{...T, marginTop: 4, lineHeight: '14px'}}>{b.a}</span>
          <span style={{...T, lineHeight: '14px', display: 'flex', alignItems: 'center', gap: 3}}>{b.b}{b.caret ? <Caret /> : null}</span>
        </div>);
      })}
    </div>
    {view === 'diagram' ? <div style={ab(0, PP.body, XL.W, PP.bodyB - PP.body, {background: '#F4F6F8', overflow: 'hidden'})} /> : null}
    {children}
    <div style={ab(0, PP.bodyB, XL.W, XL.H - PP.bodyB, {background: '#F3F3F3', borderTop: '1px solid #D1D1D1', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 12px'})}>
      <span style={{...T, fontSize: 11, color: '#444'}}>{status ?? (view === 'diagram' ? 'Diagram View' : 'Data View')}</span>
    </div>
  </div>
);

export {MONO, prog};
