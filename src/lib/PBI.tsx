import React from 'react';
import {COL, FONT_UI, FONT_AR} from '../theme';
import {Ico} from './Icons';
import {CursorState, ramp} from './anim';
import {SampleBadge} from './ui';
import {fmt} from './data41';

// ================= الهيكل (محاكاة Power BI Desktop) =================
export type Rect = {x: number; y: number; w: number; h: number};
export const center = (r: Rect): {x: number; y: number} => ({x: r.x + r.w / 2, y: r.y + r.h / 2});
const inRect = (c: {x: number; y: number}, r: Rect): boolean => c.x >= r.x && c.x <= r.x + r.w && c.y >= r.y && c.y <= r.y + r.h;

const TABS = ['File', 'Home', 'Insert', 'Modeling', 'View', 'Optimize', 'Help'];
export const TABR: Record<string, Rect> = {};
TABS.forEach((t, i) => (TABR[t] = {x: 6 + i * 104, y: 44, w: 100, h: 40}));

type RItem = {id: string; label: string; icon: string};
const RIB: Record<string, RItem[]> = {
  Home: [
    {id: 'paste', label: 'Paste', icon: 'paste'}, {id: 'getdata', label: 'Get data', icon: 'getdata'}, {id: 'enter', label: 'Enter data', icon: 'enterData'},
    {id: 'transform', label: 'Transform\ndata', icon: 'table'}, {id: 'refresh', label: 'Refresh', icon: 'refresh'}, {id: 'newvisual', label: 'New\nvisual', icon: 'newVisual'},
    {id: 'textbox', label: 'Text box', icon: 'textBox'}, {id: 'newMeasureH', label: 'New\nmeasure', icon: 'measure'}, {id: 'quick', label: 'Quick\nmeasure', icon: 'quick'}, {id: 'publish', label: 'Publish', icon: 'publish'},
  ],
  Modeling: [
    {id: 'relations', label: 'Manage\nrelationships', icon: 'relations'}, {id: 'newMeasure', label: 'New\nmeasure', icon: 'measure'}, {id: 'quickM', label: 'Quick\nmeasure', icon: 'quick'},
    {id: 'newColumn', label: 'New\ncolumn', icon: 'newColumn'}, {id: 'newTable', label: 'New\ntable', icon: 'newTable'},
  ],
};
export const RBP: Record<string, Rect> = {};
Object.values(RIB).forEach((items) => items.forEach((it, i) => (RBP[it.id] = {x: 14 + i * 112, y: 92, w: 106, h: 98})));

export type Extra = {name: string; at: number; kind: 'measure' | 'table'};
export type ShellProps = {T: number; cur: CursorState; tab?: 'Home' | 'Modeling'; extras?: Extra[]; children?: React.ReactNode; pressId?: string | null};

export const CANVAS = {x: 56, y: 196, w: 1564, h: 844}; // منطقة العمل الرمادية
export const PAGE = {x: 90, y: 214, w: 1500, h: 816};

export const Shell: React.FC<ShellProps> = ({T, cur, tab = 'Home', extras = [], children}) => {
  const ex = extras.filter((e) => T >= e.at);
  const measures = ex.filter((e) => e.kind === 'measure');
  const tables = ex.filter((e) => e.kind === 'table');
  return (
    <div style={{position: 'absolute', inset: 0, background: '#fff', fontFamily: FONT_UI, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 44, background: '#F3F3F3', borderBottom: `1px solid ${COL.line}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 12}}>
        <Ico n="pqLogo" s={26} />
        <span style={{fontSize: 18, color: COL.text}}>Lesson41_DAX - Power BI Desktop</span>
        <span style={{flex: 1}} />
        <span style={{fontSize: 22, width: 60, textAlign: 'center'}}>—</span><span style={{fontSize: 20, width: 60, textAlign: 'center'}}>☐</span><span style={{fontSize: 22, width: 60, textAlign: 'center'}}>✕</span>
      </div>
      <div style={{position: 'absolute', left: 0, top: 44, width: 1920, height: 40, background: '#F3F3F3'}}>
        {TABS.map((t) => {
          const r = TABR[t];
          const act = t === tab;
          return (
            <div key={t} style={{position: 'absolute', left: r.x, top: 0, width: r.w, height: r.h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: t === 'File' ? '#fff' : COL.text, background: t === 'File' ? COL.blue : act ? '#fff' : inRect(cur, r) ? '#E8E6E4' : 'transparent', borderTop: act ? `3px solid ${COL.yellow}` : undefined, boxSizing: 'border-box'}}>{t}</div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, top: 84, width: 1920, height: 112, background: '#fff', borderBottom: `1px solid ${COL.line}`}} />
      {RIB[tab].map((it) => {
        const r = RBP[it.id];
        const hov = inRect(cur, r);
        return (
          <div key={it.id} style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, boxSizing: 'border-box', background: hov ? (cur.press > 0 ? '#D9D7D5' : '#EDEBE9') : 'transparent', fontSize: 16, color: COL.text, textAlign: 'center', lineHeight: 1.15, whiteSpace: 'pre'}}>
            <Ico n={it.icon} s={40} />
            <div style={{marginTop: 6}}>{it.label}</div>
          </div>
        );
      })}
      {/* التنقل الأيسر */}
      <div style={{position: 'absolute', left: 0, top: 196, width: 56, height: 844, background: COL.panel, borderRight: `1px solid ${COL.line}`}}>
        <div style={{margin: '14px 8px', width: 40, height: 40, background: COL.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4}}><Ico n="report" s={28} /></div>
        <div style={{margin: '14px 8px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico n="tableView" s={28} /></div>
        <div style={{margin: '14px 8px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico n="modelView" s={28} /></div>
      </div>
      {/* لوحة العمل */}
      <div style={{position: 'absolute', left: CANVAS.x, top: CANVAS.y, width: CANVAS.w, height: CANVAS.h, background: '#E6E6E6'}} />
      <div style={{position: 'absolute', left: PAGE.x, top: PAGE.y, width: PAGE.w, height: PAGE.h, background: '#fff'}} />
      {children}
      {/* لوحة Data */}
      <div style={{position: 'absolute', left: 1620, top: 196, width: 300, height: 844, background: '#fff', borderLeft: `2px solid ${COL.line}`, fontSize: 18, color: COL.text}}>
        <div style={{height: 44, display: 'flex', alignItems: 'center', padding: '0 14px', background: COL.panel, borderBottom: `1px solid ${COL.line}`}}>Data</div>
        <div style={{margin: '10px 12px', height: 36, border: `1px solid ${COL.line}`, color: '#8A8886', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 16}}>Search</div>
        <DRow l={0} icon="table" t="Products" />
        {['Category', 'Product', 'ProductID'].map((f) => <DRow key={f} l={1} icon={f === 'ProductID' ? 'key' : 'field'} t={f} />)}
        {measures.map((m) => <DRow key={m.name} l={1} icon="measure" t={m.name} o={ramp(T, m.at, 0.4)} hi />)}
        <DRow l={0} icon="table" t="Sales" />
        {['Line Amount', 'OrderID', 'ProductID'].map((f) => <DRow key={f} l={1} icon={f === 'Line Amount' ? 'sigma' : f === 'ProductID' ? 'key' : 'field'} t={f} />)}
        {tables.map((m) => <DRow key={m.name} l={0} icon="table" t={m.name} o={ramp(T, m.at, 0.4)} hi />)}
      </div>
      <div style={{position: 'absolute', left: 0, top: 1040, width: 1920, height: 40, background: COL.panel, borderTop: `1px solid ${COL.line}`, display: 'flex', alignItems: 'center', padding: '0 70px', fontSize: 16}}>
        <div style={{background: '#fff', borderTop: `3px solid ${COL.yellow}`, padding: '4px 22px'}}>Page 1</div>
      </div>
      <SampleBadge x={1540} y={1047} />
    </div>
  );
};
const DRow: React.FC<{l: number; icon: string; t: string; o?: number; hi?: boolean}> = ({l, icon, t, o = 1, hi}) => (
  <div style={{height: 34, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14 + l * 26, opacity: o, fontSize: 17, background: hi ? COL.yellowSoft : 'transparent'}}>
    <Ico n={icon} s={20} />
    <span style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>{t}</span>
  </div>
);

// ================= عناصر التقرير =================
export const SL = {
  cat: {x: 110, y: 250, w: 300, items: ['Hardware', 'Accessories'], title: 'Category'},
  prod: {x: 110, y: 450, w: 300, items: ['Laptop', 'Mouse', 'Keyboard', 'Monitor'], title: 'Product'},
};
export const slItem = (k: 'cat' | 'prod', i: number): {x: number; y: number} => ({x: SL[k].x + 80, y: SL[k].y + 56 + i * 44 + 22});

export const Slicer: React.FC<{k: 'cat' | 'prod'; sel: string[]; cur: CursorState; o?: number}> = ({k, sel, cur, o = 1}) => {
  const s = SL[k];
  const h = 56 + s.items.length * 44 + 10;
  return (
    <div style={{position: 'absolute', left: s.x, top: s.y, width: s.w, height: h, border: `1px solid ${COL.line}`, background: '#fff', opacity: o, boxSizing: 'border-box'}}>
      <div style={{height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 22, fontWeight: 600, color: COL.text, borderBottom: `1px solid ${COL.line}`}}>{s.title}</div>
      {s.items.map((it, i) => {
        const on = sel.includes(it);
        const p = slItem(k, i);
        const hov = Math.abs(cur.y - p.y) < 22 && cur.x > s.x && cur.x < s.x + s.w;
        return (
          <div key={it} style={{height: 44, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', fontSize: 20, color: COL.text, background: on ? '#FDF3C7' : hov ? '#F3F2F1' : 'transparent'}}>
            <div style={{width: 22, height: 22, border: `2px solid ${on ? COL.ink : '#8A8886'}`, background: on ? COL.ink : '#fff', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>{on ? '✓' : ''}</div>
            {it}
          </div>
        );
      })}
    </div>
  );
};

export const ReportCard: React.FC<{x: number; y: number; w?: number; h?: number; label: string; value: string; badge?: string; hl?: boolean; o?: number; color?: string; size?: number}> = ({x, y, w = 340, h = 150, label, value, badge, hl, o = 1, color = COL.ink, size = 44}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `2px solid ${hl ? COL.yellow : COL.line}`, background: hl ? '#FFFBEA' : '#fff', opacity: o, boxSizing: 'border-box', padding: '12px 16px'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 18, color: COL.sub}}>
      <span>{label}</span>
      {badge ? <span style={{fontSize: 14, background: COL.blueSoft, color: COL.blue, padding: '2px 10px', borderRadius: 10, fontWeight: 600}}>{badge}</span> : null}
    </div>
    <div style={{fontSize: size, fontWeight: 700, color, marginTop: 14, whiteSpace: 'nowrap', overflow: 'hidden', lineHeight: 1.2}}>{value}</div>
  </div>
);

export const BarChart: React.FC<{x: number; y: number; w: number; h: number; title: string; names: string[]; amt: (n: string) => number; o?: number}> = ({x, y, w, h, title, names, amt, o = 1}) => {
  const max = Math.max(...names.map(amt), 1);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `1px solid ${COL.line}`, background: '#fff', opacity: o, boxSizing: 'border-box', padding: '14px 22px'}}>
      <div style={{fontSize: 26, fontWeight: 600, color: COL.ink}}>{title}</div>
      <div style={{marginTop: 18}}>
        {names.length === 0 ? <div style={{fontSize: 20, color: COL.sub}}>(no data)</div> : null}
        {names.map((n) => (
          <div key={n} style={{display: 'flex', alignItems: 'center', gap: 16, height: 54}}>
            <div style={{width: 120, fontSize: 20, color: COL.text}}>{n}</div>
            <div style={{height: 34, width: Math.max(6, (amt(n) / max) * (w - 330)), background: COL.blue}} />
            <div style={{fontSize: 19, color: COL.sub}}>{fmt(amt(n))}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** جدول صغير داخل لوحة العمل (قوائم القيم) */
export const ListTable: React.FC<{x: number; y: number; w: number; head: string; rows: (string | number)[]; hlRow?: (i: number) => string | undefined; o?: number; foot?: string; rowH?: number}> = ({x, y, w, head, rows, hlRow, o = 1, foot, rowH = 42}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, border: `1px solid ${COL.line}`, background: '#fff', fontSize: 22, color: COL.text}}>
    <div style={{height: rowH, display: 'flex', alignItems: 'center', padding: '0 16px', fontWeight: 600, background: COL.panel}}>{head}</div>
    {rows.map((r, i) => (
      <div key={i} style={{height: rowH, display: 'flex', alignItems: 'center', padding: '0 16px', borderTop: `1px solid ${COL.line}`, background: hlRow?.(i), fontStyle: r === '' ? 'italic' : 'normal', color: r === '' ? COL.red : COL.text}}>{r === '' ? '(Blank)' : r}</div>
    ))}
    {foot ? <div style={{padding: '8px 16px', fontFamily: FONT_AR, direction: 'rtl', fontSize: 20, color: COL.sub}}>{foot}</div> : null}
  </div>
);
