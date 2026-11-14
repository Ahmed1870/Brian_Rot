// Lesson 46 helpers: Power Query Editor simulation (generic drawing, no Microsoft artwork), Import Data dialog, pointer.
import React from 'react';
import {C, MONO, UIFONT} from './theme';
import {Cursor, Ripple, Ico, Caret, G, XL, Menu, Btn, Radio, CheckBox, Dlg, tabBox, ribbonItemBox, track, dwell, prog, clamp} from './kit';
import {RangeFx} from './l7';

const ab = (x: number, y: number, w?: number, h?: number, extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...extra});
const T: React.CSSProperties = {fontFamily: UIFONT, fontSize: 12, color: '#1B1B1B', whiteSpace: 'nowrap'};

/* ------------------------------------------------------------------ data (illustrative) */
const D: string[][] = [
  ['ORD-2001', '2026-01-05', 'Cairo', 'Electronics', '18500'], ['ORD-2002', '2026-01-07', 'Giza', 'Accessories', '1200'], ['ORD-2003', '2026-01-09', 'Alexandria', 'Office', '3400'],
  ['ORD-2004', '2026-01-12', 'Cairo', 'Accessories', '850'], ['ORD-2005', '2026-01-14', 'Tanta', 'Electronics', '9600'], ['ORD-2006', '2026-01-18', 'Cairo', 'Office', '2300'],
  ['ORD-2007', '2026-01-21', 'Giza', 'Electronics', '12800'], ['ORD-2008', '2026-01-25', 'Alexandria', 'Accessories', '640'], ['ORD-2009', '2026-02-02', 'Cairo', 'Electronics', '7200'],
  ['ORD-2010', '2026-02-06', 'Tanta', 'Office', '1900'], ['ORD-2011', '2026-02-11', 'Giza', 'Accessories', '980'], ['ORD-2012', '2026-02-15', 'Alexandria', 'Electronics', '15400'],
  ['ORD-2013', '2026-02-19', 'Cairo', 'Accessories', '1350'], ['ORD-2014', '2026-02-23', 'Tanta', 'Accessories', '520'], ['ORD-2015', '2026-03-01', 'Giza', 'Office', '2750'],
];
export const HEADS = ['Order ID', 'Order Date', 'Branch', 'Category', 'Amount'];
const BLANK_AT = [5, 11]; // blank rows inserted before data index 5 and 11
export type View = {hdr: boolean; typed: boolean; blanks: boolean}; // blanks = blank rows REMOVED
export const STEP_VIEW = (steps: string[], sel: number): View => {
  const n = steps.slice(0, sel + 1);
  const rm = n.indexOf('Removed Blank Rows') >= 0;
  return {hdr: n.indexOf('Promoted Headers') >= 0, typed: n.indexOf('Changed Type') >= 0, blanks: rm};
};
export const FB: Record<string, string> = {
  Source: '= Excel.Workbook(File.Contents("C:\\Data\\manzooma_sales_2026.xlsx"), null, true)',
  Navigation: '= Source{[Item="Sales_Raw",Kind="Sheet"]}[Data]',
  'Promoted Headers': '= Table.PromoteHeaders(Sales_Raw_Sheet, [PromoteAllScalars=true])',
  'Changed Type': '= Table.TransformColumnTypes(#"Promoted Headers",{{"Order Date", type date}})',
  'Removed Blank Rows': '= Table.SelectRows(#"Changed Type", each not List.IsEmpty(List.RemoveMatchingItems(Record.FieldValues(_), {"", null})))',
  Trimmed: '= Table.TransformColumns(#"Changed Type",{{"Branch", Text.Trim, type text}})',
};
const fmtDate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return `${m}/${d}/${y}`; };

type PR = (string | null)[];
const rowsFor = (v: View): {head: string[]; rows: PR[]} => {
  const data: PR[] = [];
  D.forEach((r, i) => { if (BLANK_AT.includes(i) && !v.blanks) data.push([null, null, null, null, null]); data.push(r); });
  if (v.hdr) return {head: HEADS, rows: data};
  return {head: ['Column1', 'Column2', 'Column3', 'Column4', 'Column5'], rows: [HEADS, ...data]};
};

/* ------------------------------------------------------------------ geometry */
export const PQ = {title: 32, tabs: 30, rib: 62, ribH: 88, fb: 150, fbH: 26, body: 176, bodyB: 650, qW: 190, sW: 290, gx0: 190, gx1: 1246, hdrH: 44, rowH: 22};
export const ZONES = {
  ribbon: {x: 0, y: PQ.rib, w: XL.W, h: PQ.ribH}, queries: {x: 0, y: PQ.body, w: PQ.qW, h: PQ.bodyB - PQ.body},
  preview: {x: PQ.gx0, y: PQ.body, w: PQ.gx1 - PQ.gx0, h: PQ.bodyB - PQ.body}, settings: {x: PQ.gx1, y: PQ.body, w: PQ.sW, h: PQ.bodyB - PQ.body},
};
const CW = [120, 130, 140, 140, 120];
const COLX0 = PQ.gx0 + 40;
export const colX = (i: number) => COLX0 + CW.slice(0, i).reduce((a, b) => a + b, 0);
export const typeIconPos = (i: number) => ({x: colX(i) + 14, y: PQ.body + 14});
export const rowY = (i: number) => PQ.body + PQ.hdrH + i * PQ.rowH;

type Btn = {k: string; a: string; b: string; w: number; ico: string; caret?: boolean; gap?: boolean};
const BTNS: Btn[] = [
  {k: 'closeLoad', a: 'Close &', b: 'Load', w: 90, ico: 'save', caret: true, gap: true},
  {k: 'refresh', a: 'Refresh', b: 'Preview', w: 74, ico: 'redo', caret: true}, {k: 'adv', a: 'Advanced', b: 'Editor', w: 74, ico: 'normal'}, {k: 'manage', a: 'Manage', b: '', w: 66, ico: 'pageLayout', caret: true, gap: true},
  {k: 'choose', a: 'Choose', b: 'Columns', w: 74, ico: 'table', caret: true}, {k: 'removeCols', a: 'Remove', b: 'Columns', w: 74, ico: 'delete', caret: true, gap: true},
  {k: 'keep', a: 'Keep', b: 'Rows', w: 66, ico: 'filter', caret: true}, {k: 'remRows', a: 'Remove', b: 'Rows', w: 70, ico: 'delete', caret: true, gap: true},
  {k: 'sort', a: 'Sort', b: '', w: 54, ico: 'sortFilter', gap: true},
  {k: 'split', a: 'Split', b: 'Column', w: 66, ico: 'merge', caret: true}, {k: 'group', a: 'Group', b: 'By', w: 58, ico: 'pivot'}, {k: 'dtype', a: 'Data Type:', b: 'Any', w: 80, ico: 'normal', caret: true},
  {k: 'firstRow', a: 'Use First Row', b: 'as Headers', w: 102, ico: 'table', caret: true}, {k: 'replace', a: 'Replace', b: 'Values', w: 66, ico: 'find', gap: true},
  {k: 'merge', a: 'Merge', b: 'Queries', w: 72, ico: 'merge', caret: true}, {k: 'append', a: 'Append', b: 'Queries', w: 72, ico: 'insert', caret: true},
];
const btnBox = (k: string) => {
  let x = 8;
  for (const b of BTNS) { if (b.k === k) return {x, y: PQ.rib + 4, w: b.w, h: 74, cx: x + b.w / 2, cy: PQ.rib + 34}; x += b.w + (b.gap ? 12 : 0); }
  return {x: 0, y: 0, w: 0, h: 0, cx: 0, cy: 0};
};
export const pqBtn = btnBox;
export const pqTab = (name: string) => { const names = ['File', 'Home', 'Transform', 'Add Column', 'View', 'Tools', 'Help']; let x = 0; for (const n of names) { const w = n === 'File' ? 58 : Math.round(n.length * 7.6 + 28); if (n === name) return {x, w, cx: x + w / 2, cy: PQ.title + PQ.tabs / 2}; x += w; } return {x: 0, w: 0, cx: 0, cy: 0}; };
export const stepPos = (i: number) => ({y: 316 + i * 26 + 13, nameX: PQ.gx1 + 100, xX: PQ.gx1 + 20, gearX: PQ.gx1 + PQ.sW - 22});
export const STEP_TOP = 316;

/* ------------------------------------------------------------------ pointer (clicks + ripple + path) */
export type Wp = {f: number; x: number; y: number};
export const Pointer: React.FC<{f: number; pts: Wp[]; clicks: number[]; hide?: boolean}> = ({f, pts, clicks, hide}) => {
  const path = dwell(pts, 8);
  const cur = track(f, path);
  return (
    <div style={{display: 'contents'}}>
      {clicks.map((c) => { const p = track(c, path); return <Ripple key={c} x={p.x} y={p.y} f={f} at={c} />; })}
      {hide ? null : <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= c && f < c + 4)} />}
    </div>
  );
};

/* ------------------------------------------------------------------ small glyphs */
const TypeIco: React.FC<{k: 'any' | 'date' | 'abc' | '123'}> = ({k}) => {
  if (k === 'date') return (<svg width={16} height={14} viewBox="0 0 16 14"><rect x={1.5} y={1.5} width={13} height={11} rx={1.5} fill="#fff" stroke="#555" strokeWidth={1.2} /><rect x={1.5} y={1.5} width={13} height={3.4} fill="#555" /><path d="M5 7.5h6M5 10h4" stroke="#555" strokeWidth={1} /></svg>);
  const t = k === 'any' ? 'ABC\n123' : k === 'abc' ? 'ABC' : '123';
  return (<span style={{fontFamily: UIFONT, fontSize: k === 'any' ? 6.5 : 8.5, fontWeight: 700, color: '#555', lineHeight: k === 'any' ? '7px' : '10px', whiteSpace: 'pre', textAlign: 'center', display: 'inline-block', minWidth: 16, border: '1px solid #8A8A8A', borderRadius: 2, padding: '1px 1px'}}>{t}</span>);
};

/* ------------------------------------------------------------------ editor */
export type PQProps = {
  open?: number; view: View; steps: string[]; sel: number; xHot?: number; xRed?: number; flash?: Record<number, number>; ghost?: {name: string; p: number} | null;
  fb: string; fbGlow?: number; zones?: {ribbon?: number; queries?: number; preview?: number; settings?: number}; srcCard?: number; hotBtn?: string; hotHdr?: number; hotType?: number;
  query?: string; status?: string; dateGlow?: number; gearHot?: number; children?: React.ReactNode; tab?: string;
};
export const PQEditor: React.FC<PQProps> = ({open = 1, view, steps, sel, xHot = -1, xRed = 0, flash = {}, ghost, fb, fbGlow = 0, zones = {}, srcCard = 0, hotBtn, hotType = -1, query = 'Sales_Raw', status, dateGlow = 0, gearHot = -1, children, tab = 'Home'}) => {
  const {head, rows} = rowsFor(view);
  const tIcon = (i: number): 'any' | 'date' => (view.typed && i === 1 ? 'date' : 'any');
  const stat = status ?? `5 COLUMNS, ${rows.length} ROWS`;
  return (
    <div style={ab(0, 0, XL.W, XL.H, {background: '#fff', zIndex: 45, overflow: 'hidden', transformOrigin: '50% 50%', transform: `scale(${0.94 + 0.06 * open})`, opacity: clamp(open * 1.6), boxShadow: '0 0 0 2px #8C8C8C, 0 30px 80px rgba(0,0,0,.5)', fontFamily: UIFONT})}>
      {/* title */}
      <div style={ab(0, 0, XL.W, PQ.title, {background: '#fff', borderBottom: '1px solid #E5E5E5'})}>
        <div style={ab(10, 7, 18, 18)}><Ico n="table" s={18} c="#107C41" /></div>
        <span style={{...T, fontSize: 12.5, position: 'absolute', left: 40, top: 8}}>{query} - Power Query Editor</span>
        {['min', 'max', 'close'].map((k, i) => (
          <div key={k} style={ab(XL.W - 138 + i * 46, 0, 46, PQ.title, {display: 'flex', alignItems: 'center', justifyContent: 'center'})}>
            <svg width={12} height={12} viewBox="0 0 12 12"><g fill="none" stroke="#333" strokeWidth={1}>{k === 'min' ? <path d="M1 6h10" /> : k === 'max' ? <rect x={1.5} y={1.5} width={9} height={9} /> : <path d="M1 1l10 10M11 1L1 11" />}</g></svg>
          </div>
        ))}
      </div>
      {/* tabs */}
      <div style={ab(0, PQ.title, XL.W, PQ.tabs, {background: '#F3F3F3', borderBottom: '1px solid #D8D8D8'})}>
        {['File', 'Home', 'Transform', 'Add Column', 'View', 'Tools', 'Help'].map((n) => {
          const b = pqTab(n); const on = n === tab;
          return (<div key={n} style={ab(b.x, 0, b.w, PQ.tabs, {display: 'flex', alignItems: 'center', justifyContent: 'center', background: n === 'File' ? '#107C41' : 'transparent'})}>
            <span style={{...T, fontSize: 13, fontWeight: on ? 700 : 400, color: n === 'File' ? '#fff' : '#1B1B1B'}}>{n}</span>
            {on ? <div style={ab(b.w / 2 - 14, PQ.tabs - 4, 28, 3, {background: '#107C41', borderRadius: 2})} /> : null}
          </div>);
        })}
      </div>
      {/* ribbon */}
      <div style={ab(0, PQ.rib, XL.W, PQ.ribH, {background: '#FAFAFA', borderBottom: '1px solid #D8D8D8'})}>
        {BTNS.map((b) => {
          const bx = btnBox(b.k);
          const hot = hotBtn === b.k;
          return (<div key={b.k} style={ab(bx.x, 4, b.w, 74, {display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, borderRadius: 4, background: hot ? '#E1E1E1' : 'transparent', boxShadow: hot ? `0 0 0 2px ${C.blue}` : 'none'})}>
            <Ico n={b.ico} s={30} />
            <span style={{...T, marginTop: 4, lineHeight: '14px'}}>{b.a}</span>
            <span style={{...T, lineHeight: '14px', display: 'flex', alignItems: 'center', gap: 3}}>{b.b}{b.caret ? <Caret /> : null}</span>
          </div>);
        })}
        <div style={ab(4, PQ.ribH - 14, XL.W, 12)} />
      </div>
      {/* formula bar */}
      <div style={ab(0, PQ.fb, XL.W, PQ.fbH, {background: '#fff', borderBottom: '1px solid #D8D8D8', boxSizing: 'border-box'})}>
        <svg style={ab(10, 5, 16, 16)} width={16} height={16} viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="#B0B0B0" strokeWidth={1.6} strokeLinecap="round" /></svg>
        <svg style={ab(34, 5, 16, 16)} width={16} height={16} viewBox="0 0 16 16"><path d="M2.5 8.5l3.8 3.8L13.5 4" fill="none" stroke="#B0B0B0" strokeWidth={1.8} strokeLinecap="round" /></svg>
        <div style={ab(58, 3, 22, 20, {fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15, color: '#444'})}>fx</div>
        <div style={ab(88, 2, XL.W - 100, PQ.fbH - 4, {border: `1px solid ${fbGlow > 0.1 ? C.amber : '#D1D1D1'}`, boxShadow: fbGlow > 0.1 ? `0 0 ${12 * fbGlow}px ${C.amber}` : 'none', borderRadius: 3, boxSizing: 'border-box', padding: '0 8px', fontFamily: 'Consolas, "DejaVu Sans Mono", monospace', fontSize: 13, color: '#222', whiteSpace: 'pre', overflow: 'hidden', display: 'flex', alignItems: 'center'})}>{fb}</div>
      </div>
      {/* queries pane */}
      <div style={ab(0, PQ.body, PQ.qW, PQ.bodyB - PQ.body, {background: '#F7F7F7', borderRight: '1px solid #D8D8D8', boxSizing: 'border-box'})}>
        <div style={ab(0, 0, PQ.qW, 24, {borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', padding: '0 10px'})}><span style={{...T, fontWeight: 700}}>Queries [1]</span></div>
        <div style={ab(0, 28, PQ.qW, 26, {background: '#E1E1E1', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px'})}><Ico n="table" s={16} c="#107C41" /><span style={T}>{query}</span></div>
        <div style={ab(10, PQ.bodyB - PQ.body - 106, PQ.qW - 20, 88, {borderRadius: 8, border: `2px solid ${C.green}`, background: '#ECFDF5', opacity: srcCard, transform: `translateY(${(1 - srcCard) * 12}px)`, padding: '8px 10px', boxSizing: 'border-box'})}>
          <div style={{...T, fontSize: 10.5, fontWeight: 700, color: '#047857'}}>SOURCE FILE</div>
          <div style={{...T, fontSize: 11.5, marginTop: 3}}>manzooma_sales_2026.xlsx</div>
          <div style={{...T, fontSize: 12, fontWeight: 700, color: '#047857', marginTop: 8}}>✓ Not modified</div>
        </div>
      </div>
      {/* data preview */}
      <div style={ab(PQ.gx0, PQ.body, PQ.gx1 - PQ.gx0, PQ.bodyB - PQ.body, {background: '#fff', overflow: 'hidden'})}>
        <div style={ab(0, 0, 40, PQ.hdrH, {background: '#F0F0F0', borderBottom: '1px solid #C8C8C8', borderRight: '1px solid #C8C8C8', boxSizing: 'border-box'})} />
        {head.map((h, i) => {
          const hotT = hotType === i;
          return (<div key={i} style={ab(colX(i) - PQ.gx0, 0, CW[i], PQ.hdrH, {background: i === 1 && dateGlow > 0 ? `rgba(16,185,129,${0.18 * dateGlow})` : '#F0F0F0', borderBottom: '1px solid #C8C8C8', borderRight: '1px solid #C8C8C8', boxSizing: 'border-box', padding: '4px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3})}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <div style={{borderRadius: 3, boxShadow: hotT ? `0 0 0 2px ${C.blue}` : 'none', background: hotT ? '#DDEBF7' : 'transparent', display: 'flex'}}><TypeIco k={tIcon(i)} /></div>
              <span style={{...T, fontSize: 12.5, fontWeight: 600, flex: 1}}>{h}</span>
              <Caret s={8} />
            </div>
          </div>);
        })}
        {rows.map((r, ri) => (
          <div key={ri} style={ab(0, PQ.hdrH + ri * PQ.rowH, PQ.gx1 - PQ.gx0, PQ.rowH, {borderBottom: '1px solid #EDEDED', boxSizing: 'border-box'})}>
            <div style={ab(0, 0, 40, PQ.rowH, {background: '#F7F7F7', borderRight: '1px solid #C8C8C8', boxSizing: 'border-box', textAlign: 'center', lineHeight: `${PQ.rowH}px`, ...T, color: '#666'})}>{ri + 1}</div>
            {r.map((v, ci) => {
              const isDate = ci === 1 && view.typed && v !== null;
              const shown = v === null ? 'null' : isDate ? fmtDate(v) : v;
              return (<div key={ci} style={ab(colX(ci) - PQ.gx0, 0, CW[ci], PQ.rowH, {borderRight: '1px solid #EDEDED', boxSizing: 'border-box', padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: isDate ? 'flex-end' : 'flex-start', background: ci === 1 && dateGlow > 0 && v !== null ? `rgba(16,185,129,${0.1 * dateGlow})` : 'transparent'})}>
                <span style={{...T, fontSize: 12.5, fontStyle: v === null ? 'italic' : 'normal', color: v === null ? '#8A8A8A' : '#1B1B1B'}}>{shown}</span>
              </div>);
            })}
          </div>
        ))}
      </div>
      {/* query settings */}
      <div style={ab(PQ.gx1, PQ.body, PQ.sW, PQ.bodyB - PQ.body, {background: '#F7F7F7', borderLeft: '1px solid #D8D8D8', boxSizing: 'border-box'})}>
        <div style={ab(0, 0, PQ.sW, 24, {borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', padding: '0 10px'})}><span style={{...T, fontWeight: 700}}>Query Settings</span></div>
        <div style={ab(12, 34, 200, 16)}><span style={{...T, fontSize: 11, fontWeight: 700, color: '#555'}}>PROPERTIES</span></div>
        <div style={ab(12, 56, PQ.sW - 24, 24, {border: '1px solid #C8C8C8', background: '#fff', borderRadius: 3, boxSizing: 'border-box', padding: '0 8px', display: 'flex', alignItems: 'center'})}><span style={T}>{query}</span></div>
        <div style={ab(12, 86, 200, 16)}><span style={{...T, color: '#0F6CBD'}}>All Properties</span></div>
        <div style={ab(12, 112, 200, 16)}><span style={{...T, fontSize: 11, fontWeight: 700, color: '#555'}}>APPLIED STEPS</span></div>
      </div>
      {steps.map((s, i) => {
        const y = STEP_TOP + i * 26;
        const on = i === sel;
        const fl = flash[i] ?? 0;
        const showX = on || xHot === i;
        return (
          <div key={s + i} style={ab(PQ.gx1 + 4, y, PQ.sW - 8, 25, {display: 'flex', alignItems: 'center', background: fl > 0.05 ? `rgba(16,185,129,${0.28 * fl})` : on ? '#DCDCDC' : 'transparent', border: fl > 0.05 ? `1.5px solid rgba(16,185,129,${fl})` : '1.5px solid transparent', boxShadow: fl > 0.05 ? `0 0 ${16 * fl}px ${C.green}` : 'none', borderRadius: 3, boxSizing: 'border-box', zIndex: 3, opacity: 1 - 0})}>
            <div style={ab(8, 5, 14, 14, {display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: showX ? 1 : 0})}>
              <svg width={11} height={11} viewBox="0 0 12 12"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke={xHot === i && xRed > 0.3 ? C.red : '#666'} strokeWidth={xHot === i ? 2.2 : 1.6} strokeLinecap="round" /></svg>
            </div>
            <span style={{...T, marginLeft: 30, fontSize: 12.5}}>{s}</span>
            {s === 'Source' ? <div style={{marginLeft: 'auto', marginRight: 8, display: 'flex', borderRadius: 3, boxShadow: gearHot === i ? `0 0 0 2px ${C.amber}` : 'none'}}><Ico n="addins" s={14} c="#666" /></div> : null}
          </div>
        );
      })}
      {ghost && ghost.p > 0.01 ? (
        <div style={ab(PQ.gx1 + 4, STEP_TOP + steps.length * 26, PQ.sW - 8, 25, {display: 'flex', alignItems: 'center', background: `rgba(245,158,11,${0.3 * ghost.p})`, border: `2px solid ${C.amber}`, boxShadow: `0 0 18px ${C.amber}`, borderRadius: 3, boxSizing: 'border-box', opacity: ghost.p, transform: `translateX(${(1 - ghost.p) * 40}px)`, zIndex: 3})}>
          <span style={{...T, marginLeft: 30, fontSize: 12.5, textDecoration: 'line-through', color: '#B45309'}}>{ghost.name}</span>
        </div>
      ) : null}
      {/* status bar */}
      <div style={ab(0, PQ.bodyB, XL.W, XL.H - PQ.bodyB, {background: '#F3F3F3', borderTop: '1px solid #D1D1D1', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 28})}>
        <span style={{...T, fontSize: 10.5, color: '#444'}}>{stat}</span>
        <span style={{...T, fontSize: 10.5, color: '#444'}}>COLUMN PROFILING BASED ON TOP 1000 ROWS</span>
        <div style={{flex: 1}} />
        <span style={{...T, fontSize: 10.5, color: '#444'}}>PREVIEW DOWNLOADED ON WEDNESDAY, NOVEMBER 11, 2026</span>
      </div>
      {/* zone highlights */}
      <RangeFx rect={ZONES.ribbon} color={C.blue} p={zones.ribbon ?? 0} fill={0.07} label="1 · Ribbon" labelBelow labelDx={600} />
      <RangeFx rect={ZONES.queries} color={C.green} p={zones.queries ?? 0} fill={0.07} label="2 · Queries pane" labelBelow labelDx={8} />
      <RangeFx rect={ZONES.preview} color={C.blue} p={zones.preview ?? 0} fill={0.05} label="3 · Data preview" labelBelow labelDx={500} />
      <RangeFx rect={ZONES.settings} color={C.green} p={zones.settings ?? 0} fill={0.07} label="4 · Applied Steps" labelBelow labelDx={60} />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ menus */
export const DT_ITEMS = ['Decimal Number', 'Fixed decimal number', 'Whole Number', 'Percentage', 'Date/Time', 'Date', 'Time', 'Date/Time/Timezone', 'Duration', 'Text', 'True/False'];
export const RR_ITEMS = ['Remove Top Rows', 'Remove Bottom Rows', 'Remove Alternate Rows', 'Remove Duplicates', 'Remove Blank Rows', 'Remove Errors'];
export const CL_ITEMS = ['Close & Load', 'Close & Load To...'];
export const menuOf = (labels: string[], hot: string, extra?: Partial<Record<string, any>>) => labels.map((l) => ({label: l, hot: l === hot, ...(extra?.[l] ?? {})}));

/* ------------------------------------------------------------------ Excel Data tab: Get Data menu */
export const GD_ITEMS = [
  {label: 'From File', arrow: true}, {label: 'From Database', arrow: true}, {label: 'From Azure', arrow: true}, {label: 'From Online Services', arrow: true}, {label: 'From Other Sources', arrow: true}, {label: 'Combine Queries', arrow: true},
  {sep: true, label: ''}, {label: 'Launch Power Query Editor...'}, {label: 'Data Source Settings...'}, {label: 'Query Options'},
];
export const getDataBox = () => ribbonItemBox('Data', 'GetData');
export const dataTabPos = () => { const b = tabBox('Data'); return {x: b.cx, y: XL.title + XL.tabs / 2}; };

/* ------------------------------------------------------------------ Import Data dialog (Close & Load To...) */
export const IMP = {x: 548, y: 130, w: 440, h: 360};
export const impPos = {
  table: {x: IMP.x + 31, y: IMP.y + 32 + 40 + 9}, conn: {x: IMP.x + 31, y: IMP.y + 32 + 118 + 9}, dm: {x: IMP.x + 31, y: IMP.y + 32 + 240 + 9}, ok: {x: IMP.x + 290, y: IMP.y + 32 + 282 + 13},
};
export const ImportDlg: React.FC<{p: number; table: number; conn: number; dm: number; okHot?: boolean; glowTable?: number; glowConn?: number; glowDm?: number}> = ({p, table, conn, dm, okHot, glowTable = 0, glowConn = 0, glowDm = 0}) => {
  const f = 0;
  void f;
  const where = 1 - 0.55 * conn;
  return (
    <Dlg x={IMP.x} y={IMP.y} w={IMP.w} h={IMP.h} title="Import Data" p={p}>
      <div style={ab(16, 10, 400, 16)}><span style={T}>Select how you want to view this data in your workbook.</span></div>
      <Glow g={glowTable} x={14} y={36} w={290} h={26} color={C.blue} />
      <Radio x={24} y={40} label="Table" p={table} w={260} />
      <Radio x={24} y={66} label="PivotTable Report" p={0} w={260} />
      <Radio x={24} y={92} label="PivotChart" p={0} w={260} />
      <Glow g={glowConn} x={14} y={114} w={320} h={26} color={C.green} />
      <Radio x={24} y={118} label="Only Create Connection" p={conn} w={290} />
      <div style={ab(16, 152, 400, 16, {opacity: where})}><span style={T}>Where do you want to put the data?</span></div>
      <div style={{opacity: where}}>
        <Radio x={24} y={176} label="Existing worksheet:" p={1 - conn} w={160} />
        <div style={ab(190, 172, 200, 22, {border: '1px solid #8A8A8A', background: '#fff', boxSizing: 'border-box', padding: '0 6px', display: 'flex', alignItems: 'center'})}><span style={T}>=$A$1</span></div>
        <Radio x={24} y={204} label="New worksheet" p={0} w={200} />
      </div>
      <Glow g={glowDm} x={14} y={236} w={300} h={26} color={C.green} />
      <CheckBox x={24} y={240} label="Add this data to the Data Model" p={dm} w={280} />
      <Btn x={16} y={282} w={96} label="Properties..." />
      <Btn x={250} y={282} w={80} label="OK" def hot={okHot} />
      <Btn x={340} y={282} w={80} label="Cancel" />
    </Dlg>
  );
};
const Glow: React.FC<{g: number; x: number; y: number; w: number; h: number; color: string}> = ({g, x, y, w, h, color}) => (g > 0.02 ? <div style={ab(x, y, w, h, {border: `2px solid ${color}`, borderRadius: 6, boxShadow: `0 0 ${14 * g}px ${color}`, opacity: g, boxSizing: 'border-box'})} /> : null);

export const RAW_ROWS = (): (string | null)[][] => { const {head, rows} = rowsFor({hdr: true, typed: false, blanks: false}); return [head, ...rows]; };
export {prog, clamp, MONO};
