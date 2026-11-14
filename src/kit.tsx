import React, {createContext, useContext} from 'react';
import {Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadAr} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {C, FPS, LESSON, LESSONS, LOGO, UNIT, UNITS} from './theme';

export const AR = loadAr('normal', {weights: ['400', '600', '700'], subsets: ['arabic', 'latin']}).fontFamily;
export const MONO = loadMono('normal', {weights: ['400', '600'], subsets: ['latin']}).fontFamily;

/* ---------- time / easing ---------- */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const pr = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const eo = (x: number) => 1 - Math.pow(1 - x, 3);
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const fadeIn = (t: number, a: number, d = 0.5) => eo(pr(t, a, a + d));
export const typed = (s: string, t: number, a: number, cps: number) => s.slice(0, Math.floor(clamp((t - a) * cps, 0, s.length)));
export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
export const pick = <T,>(list: [number, T][], t: number, init: T): T => {
  let v = init;
  for (const [a, x] of list) if (t >= a) v = x;
  return v;
};

const SceneCtx = createContext(0);
export const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = Math.round(from * FPS);
  return (
    <Sequence from={f} durationInFrames={Math.round(to * FPS) - f}>
      <SceneCtx.Provider value={f / FPS}>{children}</SceneCtx.Provider>
    </Sequence>
  );
};
/** absolute audio time in seconds (t(g) = g - S is implicit: S is the scene start) */
export const useT = () => useContext(SceneCtx) + useCurrentFrame() / FPS;

/* ---------- cursor: every hover / press is derived from the real cursor position ---------- */
export type Click = {t: number; x: number; y: number};
type Cur = {x: number; y: number; down: boolean};
const CurCtx = createContext<Cur>({x: -99, y: -99, down: false});
const OffCtx = createContext({x: 0, y: 0});
const P0 = {x: 1040, y: 760};

export function curPos(cl: Click[], t: number) {
  if (!cl.length) return P0;
  if (t <= cl[0].t) {
    const k = eio(pr(t, cl[0].t - 1.1, cl[0].t - 0.05));
    return {x: P0.x + (cl[0].x - P0.x) * k, y: P0.y + (cl[0].y - P0.y) * k};
  }
  let i = 0;
  while (i + 1 < cl.length && cl[i + 1].t <= t) i++;
  const a = cl[i];
  const b = cl[i + 1];
  if (!b) return {x: a.x, y: a.y};
  const arr = b.t - 0.05;
  const dep = Math.min(a.t + 0.3, arr - 0.2);
  const k = eio(pr(t, dep, arr));
  return {x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k};
}

export const CursorProvider: React.FC<{clicks: Click[]; children: React.ReactNode}> = ({clicks, children}) => {
  const t = useT();
  const p = curPos(clicks, t);
  const down = clicks.some((c) => t >= c.t && t < c.t + 0.16);
  const first = clicks.length ? clicks[0].t - 1.3 : 0;
  const last = clicks.length ? clicks[clicks.length - 1].t + 2.6 : 0;
  const op = fadeIn(t, first, 0.3) * (1 - pr(t, last - 0.5, last));
  return (
    <CurCtx.Provider value={{x: p.x, y: p.y, down}}>
      {children}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none', zIndex: 60, opacity: op}}>
        {clicks.map((c, i) => {
          const k = pr(t, c.t, c.t + 0.55);
          if (k <= 0 || k >= 1) return null;
          const r = 8 + 36 * eo(k);
          return <div key={i} style={{position: 'absolute', left: c.x - r, top: c.y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', border: `3px solid ${C.blue}`, opacity: 1 - k}} />;
        })}
        <svg width={40} height={44} viewBox="0 0 24 28" style={{position: 'absolute', left: p.x - 2, top: p.y - 2, transform: `scale(${down ? 0.88 : 1})`, transformOrigin: '2px 2px'}}>
          <path d="M2 2 L2 22 L7 17.5 L10.5 26 L14 24.5 L10.5 16.5 L17 16.5 Z" fill="#fff" stroke="#0F172A" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      </div>
    </CurCtx.Provider>
  );
};

export function useHit(x: number, y: number, w: number, h: number) {
  const c = useContext(CurCtx);
  const o = useContext(OffCtx);
  const ax = o.x + x;
  const ay = o.y + y;
  const hover = c.x >= ax && c.x <= ax + w && c.y >= ay && c.y <= ay + h;
  return {hover, press: hover && c.down};
}

/* ---------- icons ---------- */
const IC: Record<string, string> = {
  save: 'M4 4h13l3 3v13H4z M8 4v6h8V4 M8 20v-6h8v6',
  undo: 'M9 6L4 11l5 5 M4 11h9a5 5 0 010 10h-3',
  redo: 'M15 6l5 5-5 5 M20 11h-9a5 5 0 000 10h3',
  paste: 'M8 4h8v3H8z M6 5H4v16h16V5h-2 M8 12h8 M8 16h8',
  copy: 'M8 8h12v12H8z M4 16V4h12',
  cut: 'M6 3l9 11 M18 3l-9 11 M7 16a3 3 0 100 6 3 3 0 000-6z M17 16a3 3 0 100 6 3 3 0 000-6z',
  brush: 'M4 20h8 M14 4l6 6-8 8-6-6z',
  fill: 'M5 14l7-9 7 9a7 7 0 01-14 0z',
  table: 'M3 5h18v14H3z M3 10h18 M3 15h18 M9 5v14 M15 5v14',
  pivot: 'M3 5h18v14H3z M3 10h18 M9 5v14 M13 17l4-4 M17 17h-4',
  chart: 'M5 20V10 M11 20V4 M17 20v-7 M3 20h18',
  line: 'M3 18l5-6 4 3 8-10 M3 20h18',
  slicer: 'M4 4h16v4H4z M4 10h16v4H4z M4 16h10v4H4z',
  manage: 'M5 6c0-2 14-2 14 0v12c0 2-14 2-14 0z M5 6c0 2 14 2 14 0 M5 12c0 2 14 2 14 0',
  addmodel: 'M4 6c0-2 12-2 12 0v10c0 2-12 2-12 0z M4 6c0 2 12 2 12 0 M18 14v6 M15 17h6',
  kpi: 'M4 17a8 8 0 0116 0 M12 17l4-6',
  detect: 'M10 4a6 6 0 100 12 6 6 0 000-12z M15 15l5 5',
  refresh: 'M20 12a8 8 0 10-3 6 M20 5v7h-7',
  filter: 'M3 5h18l-7 8v6l-4-2v-4z',
  sort: 'M7 4v16 M3 8l4-4 4 4 M17 20V4 M13 16l4 4 4-4',
  diagram: 'M3 4h7v6H3z M14 14h7v6h-7z M10 7h4v10',
  calc: 'M6 3h12v18H6z M9 7h6 M9 11h2 M13 11h2 M9 15h2 M13 15h2',
  db: 'M4 6h16v12H4z M4 10h16 M8 6v12',
  check: 'M4 12l5 5L20 6',
  close: 'M5 5l14 14 M19 5L5 19',
  doc: 'M6 3h9l4 4v14H6z M9 12h7 M9 16h7',
  gear: 'M12 9a3 3 0 100 6 3 3 0 000-6z M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1',
  lock: 'M6 11h12v9H6z M8 11V8a4 4 0 018 0v3',
  pie: 'M12 3a9 9 0 109 9h-9z M14 3.5A9 9 0 0120.5 10H14z',
  scatter: 'M5 19h14 M5 19V5 M9 14h.01 M13 10h.01 M17 7h.01 M8 9h.01 M15 15h.01',
  hist: 'M4 20v-6h4v6 M8 20V8h4v12 M12 20V4h4v16 M16 20v-9h4v9 M3 20h18',
};
const ICT: Record<string, string> = {bold: 'B', italic: 'I', pct: '%', comma: ',', sum: 'Σ', fx: 'fx', cur: '$', measure: 'fx'};
export const Ic: React.FC<{n: string; s?: number; c?: string}> = ({n, s = 28, c = '#E2E8F0'}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {IC[n] ? <path d={IC[n]} /> : <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700" fill={c} stroke="none" fontFamily={AR}>{ICT[n] || '?'}</text>}
  </svg>
);

/* ---------- DAX text with colours ---------- */
export const Dax: React.FC<{s: string; size?: number}> = ({s, size = 22}) => {
  const parts = s.split(/(\[[^\]]*\]?|"[^"]*"?|[A-Z][A-Z0-9]+(?=\()|\b\d+(?:\.\d+)?\b)/g).filter((p) => p !== '');
  return (
    <span style={{fontFamily: MONO, fontSize: size, whiteSpace: 'pre', direction: 'ltr', unicodeBidi: 'isolate'}}>
      {parts.map((p, i) => {
        const f = p[0];
        const col = f === '[' ? '#7DD3FC' : f === '"' ? '#FCA5A5' : /\d/.test(f) ? '#FDE68A' : /[A-Z]/.test(f) && /^[A-Z][A-Z0-9]+$/.test(p) ? C.blue : C.text;
        return <span key={i} style={{color: col}}>{p}</span>;
      })}
    </span>
  );
};

/* ---------- ribbon model ---------- */
export type RB = {id: string; l: string; ic: string; big?: boolean};
export type RG = {n: string; b: RB[]};
export type AppDef = {title: string; tabs: string[]; rib: Record<string, RG[]>};
export function layoutRib(gs: RG[]) {
  const items: {id: string; x: number; y: number; w: number; h: number; l: string; ic: string; big: boolean}[] = [];
  const groups: {x: number; w: number; n: string}[] = [];
  let x = 8;
  for (const g of gs) {
    const gx = x;
    let i = 0;
    while (i < g.b.length) {
      const b = g.b[i];
      if (b.big) {
        const bw = Math.max(92, Math.max(...b.l.split(' ').map((q) => q.length)) * 9.4 + 8);
        items.push({id: b.id, x, y: 6, w: bw, h: 84, l: b.l, ic: b.ic, big: true});
        x += bw + 4;
        i++;
      } else {
        const col: RB[] = [];
        while (col.length < 3 && g.b[i] && !g.b[i].big) col.push(g.b[i++]);
        col.forEach((q, j) => items.push({id: q.id, x, y: 6 + j * 29, w: 158, h: 28, l: q.l, ic: q.ic, big: false}));
        x += 162;
      }
    }
    groups.push({x: gx, w: x - gx, n: g.n});
    x += 12;
  }
  return {items, groups};
}
export function tabRects(tabs: string[]) {
  let x = 14;
  return tabs.map((t) => {
    const w = 28 + t.length * 12.5;
    const r = {t, x, w};
    x += w + 4;
    return r;
  });
}
export const WW = 1230;
export const WH = 800;
export const BODY_Y = 236;
export const ribPt = (app: AppDef, tab: string, id: string, ox: number, oy: number) => {
  const it = layoutRib(app.rib[tab]).items.find((i) => i.id === id)!;
  return {x: ox + it.x + it.w / 2, y: oy + 78 + it.y + it.h / 2};
};
export const tabPt = (app: AppDef, tab: string, ox: number, oy: number) => {
  const r = tabRects(app.tabs).find((q) => q.t === tab)!;
  return {x: ox + r.x + r.w / 2, y: oy + 58};
};
export const okPt = (ox: number, oy: number) => ({x: ox + 217, y: oy + 216});
export const sheetRects = (names: string[]) => {
  let x = 10;
  return names.map((n) => {
    const w = 34 + n.length * 11.5;
    const r = {n, x, w};
    x += w + 4;
    return r;
  });
};
export const sheetPt = (names: string[], n: string, ox: number, oy: number) => {
  const r = sheetRects(names).find((q) => q.n === n)!;
  return {x: ox + r.x + r.w / 2, y: oy + WH - 46};
};

const g = (l: string, ic: string, big = true): RB => ({id: l, l, ic, big});
export const XL: AppDef = {
  title: 'manzooma_sales_2026.xlsx - Excel',
  tabs: ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View', 'Power Pivot'],
  rib: {
    Home: [
      {n: 'Clipboard', b: [g('Paste', 'paste'), g('Cut', 'cut', false), g('Copy', 'copy', false), g('Format Painter', 'brush', false)]},
      {n: 'Font', b: [g('Bold', 'bold', false), g('Italic', 'italic', false), g('Fill Color', 'fill', false)]},
      {n: 'Number', b: [g('Currency', 'cur', false), g('Percent', 'pct', false), g('Comma', 'comma', false)]},
      {n: 'Editing', b: [g('AutoSum', 'sum'), g('Sort & Filter', 'sort'), g('Find & Select', 'detect')]},
    ],
    Insert: [
      {n: 'Tables', b: [g('PivotTable', 'pivot'), g('Table', 'table')]},
      {n: 'Charts', b: [g('Recommended Charts', 'chart'), g('Column Chart', 'chart'), g('Bar Chart', 'chart'), g('Line Chart', 'line'), g('Pie Chart', 'pie'), g('Scatter', 'scatter'), g('Histogram', 'hist')]},
      {n: 'Filters', b: [g('Slicer', 'slicer'), g('Timeline', 'calc')]},
    ],
    'Page Layout': [{n: 'Themes', b: [g('Themes', 'doc'), g('Margins', 'table'), g('Orientation', 'doc')]}],
    Formulas: [
      {n: 'Function Library', b: [g('Insert Function', 'fx'), g('AutoSum', 'sum'), g('Logical', 'check'), g('Lookup', 'detect')]},
      {n: 'Calculation', b: [g('Calculate Now', 'calc'), g('Options', 'gear')]},
    ],
    Data: [
      {n: 'Get & Transform', b: [g('Get Data', 'db'), g('Refresh All', 'refresh')]},
      {n: 'Sort & Filter', b: [g('Sort', 'sort'), g('Filter', 'filter')]},
      {n: 'Data Tools', b: [g('Data Model', 'manage')]},
    ],
    Review: [{n: 'Proofing', b: [g('Spelling', 'check'), g('Comments', 'doc')]}],
    View: [{n: 'Show', b: [g('Gridlines', 'table', false), g('Formula Bar', 'fx', false), g('Headings', 'doc', false)]}],
    'Power Pivot': [
      {n: 'Data Model', b: [g('Manage', 'manage'), g('Add to Data Model', 'addmodel')]},
      {n: 'Calculations', b: [g('Measures', 'measure'), g('KPIs', 'kpi')]},
      {n: 'Tables', b: [g('Detect', 'detect')]},
      {n: 'Settings', b: [g('Settings', 'gear')]},
    ],
  },
};
export const XLC: AppDef = {
  ...XL,
  tabs: [...XL.tabs, 'Chart Design'],
  rib: {...XL.rib, 'Chart Design': [
    {n: 'Chart Layouts', b: [g('Add Chart Element', 'chart'), g('Quick Layout', 'table')]},
    {n: 'Chart Styles', b: [g('Change Colors', 'fill')]},
    {n: 'Data', b: [g('Switch Row/Column', 'sort'), g('Select Data', 'db')]},
    {n: 'Type', b: [g('Change Chart Type', 'chart')]},
  ]},
};
export const PP: AppDef = {
  title: 'Power Pivot for Excel - manzooma_sales_2026.xlsx',
  tabs: ['File', 'Home', 'Design', 'Advanced'],
  rib: {
    Home: [
      {n: 'Clipboard', b: [g('Paste', 'paste')]},
      {n: 'Get External Data', b: [g('From Database', 'manage'), g('From Other Sources', 'db')]},
      {n: 'Refresh', b: [g('Refresh', 'refresh'), g('PivotTable', 'pivot')]},
      {n: 'Formatting', b: [g('Data Type', 'doc', false), g('Format', 'cur', false), g('Sort A to Z', 'sort', false)]},
      {n: 'Calculations', b: [g('AutoSum', 'sum')]},
      {n: 'View', b: [g('Data View', 'table'), g('Diagram View', 'diagram'), g('Calculation Area', 'calc')]},
    ],
    Design: [{n: 'Columns', b: [g('Add', 'addmodel'), g('Delete', 'close'), g('Freeze', 'lock')]}],
    Advanced: [{n: 'Perspectives', b: [g('Perspectives', 'doc'), g('Summarize By', 'sum')]}],
  },
};

/* ---------- small interactive atoms ---------- */
export const Hit: React.FC<{x: number; y: number; w: number; h: number; r?: number; children?: React.ReactNode; base?: string; style?: React.CSSProperties}> = ({x, y, w, h, r = 6, children, base = 'transparent', style}) => {
  const {hover, press} = useHit(x, y, w, h);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, boxSizing: 'border-box', background: press ? 'rgba(56,189,248,.32)' : hover ? 'rgba(255,255,255,.12)' : base, border: hover ? `1px solid ${press ? C.blue : 'rgba(255,255,255,.28)'}` : '1px solid transparent', transform: press ? 'scale(.96)' : 'none', ...style}}>
      {children}
    </div>
  );
};

/* ---------- application window (Excel / Power Pivot) ---------- */
export const AppWin: React.FC<{
  app: AppDef; ox: number; oy: number; tab: string; tabAt?: number;
  fx: {name: string; text: string; typing?: boolean; ok?: boolean}; sheets: string[]; sheet: number;
  status?: string; statusR?: string; op?: number; sc?: number; overlay?: React.ReactNode; children?: React.ReactNode;
}> = ({app, ox, oy, tab, tabAt, fx, sheets, sheet, status = 'Ready', statusR = '', op = 1, sc = 1, overlay, children}) => {
  const t = useT();
  const rib = layoutRib(app.rib[tab]);
  const rk = tabAt === undefined ? 1 : fadeIn(t, tabAt, 0.3);
  const tr = tabRects(app.tabs);
  const sr = sheetRects(sheets);
  return (
    <OffCtx.Provider value={{x: ox, y: oy}}>
      <div style={{position: 'absolute', left: ox, top: oy, width: WW, height: WH, background: C.panel, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.line}`, boxShadow: '0 24px 60px rgba(0,0,0,.55)', opacity: op, transform: `scale(${sc})`, transformOrigin: '50% 40%', fontFamily: AR, color: C.text}}>
        {/* title bar */}
        <div style={{position: 'absolute', left: 0, top: 0, width: WW, height: 38, background: C.xl}} />
        <Hit x={10} y={5} w={30} h={28}><div style={{padding: 2}}><Ic n="save" s={22} /></div></Hit>
        <Hit x={44} y={5} w={30} h={28}><div style={{padding: 2}}><Ic n="undo" s={22} /></div></Hit>
        <Hit x={78} y={5} w={30} h={28}><div style={{padding: 2}}><Ic n="redo" s={22} /></div></Hit>
        <div style={{position: 'absolute', left: 0, top: 0, width: WW, height: 38, lineHeight: '38px', textAlign: 'center', fontSize: 19, fontWeight: 600, direction: 'ltr'}}>{app.title}</div>
        <div style={{position: 'absolute', right: 14, top: 0, height: 38, lineHeight: '36px', fontSize: 20, letterSpacing: 26, color: '#D1FAE5', direction: 'ltr'}}>−▢✕</div>
        {/* tabs */}
        <div style={{position: 'absolute', left: 0, top: 38, width: WW, height: 40, background: '#17233A'}} />
        {tr.map((r) => (
          <Hit key={r.t} x={r.x} y={42} w={r.w} h={34} r={5}>
            <div style={{height: '100%', lineHeight: '32px', textAlign: 'center', fontSize: 19, fontWeight: r.t === tab ? 700 : 400, color: r.t === tab ? C.text : C.dim, borderBottom: r.t === tab ? `3px solid ${C.green}` : '3px solid transparent', boxSizing: 'border-box', direction: 'ltr'}}>{r.t}</div>
          </Hit>
        ))}
        {/* ribbon */}
        <div style={{position: 'absolute', left: 0, top: 78, width: WW, height: 118, background: '#1B2840', borderBottom: `1px solid ${C.line}`, opacity: rk}}>
          {rib.groups.map((gp, i) => (
            <div key={i} style={{position: 'absolute', left: gp.x + gp.w + 5, top: 8, width: 1, height: 100, background: C.line}}>
              <div style={{position: 'absolute', left: -gp.w - 5, top: 88, width: gp.w, textAlign: 'center', fontSize: 14, color: C.dim, direction: 'ltr'}}>{gp.n}</div>
            </div>
          ))}
          {rib.items.map((it) => (
            <Hit key={it.id} x={it.x} y={it.y} w={it.w} h={it.h}>
              {it.big ? (
                <div style={{textAlign: 'center', paddingTop: 6, direction: 'ltr'}}>
                  <Ic n={it.ic} s={38} c={C.blue} />
                  <div style={{fontSize: 15, lineHeight: '17px', marginTop: 2}}>{it.l}</div>
                </div>
              ) : (
                <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '3px 8px', fontSize: 16, direction: 'ltr', whiteSpace: 'nowrap'}}>
                  <Ic n={it.ic} s={20} c={C.blue} />
                  <span>{it.l}</span>
                </div>
              )}
            </Hit>
          ))}
        </div>
        {/* formula bar */}
        <div style={{position: 'absolute', left: 0, top: 196, width: WW, height: 40, background: '#17233A'}} />
        <div style={{position: 'absolute', left: 8, top: 201, width: 150, height: 30, background: C.cell, border: `1px solid ${C.line}`, borderRadius: 4, lineHeight: '28px', paddingLeft: 10, fontSize: 18, fontFamily: MONO, boxSizing: 'border-box', direction: 'ltr'}}>{fx.name}</div>
        <Hit x={172} y={201} w={30} h={30}><div style={{padding: 3, opacity: fx.ok ? 1 : 0.35}}><Ic n="close" s={22} c={C.red} /></div></Hit>
        <Hit x={204} y={201} w={30} h={30} base={fx.ok ? 'rgba(16,185,129,.18)' : 'transparent'}><div style={{padding: 3, opacity: fx.ok ? 1 : 0.35}}><Ic n="check" s={22} c={C.green} /></div></Hit>
        <div style={{position: 'absolute', left: 240, top: 201, width: 40, height: 30, lineHeight: '30px', textAlign: 'center', fontSize: 18, fontStyle: 'italic', color: C.dim, fontFamily: MONO}}>fx</div>
        <div style={{position: 'absolute', left: 286, top: 201, width: WW - 296, height: 30, background: C.cell, border: `1px solid ${fx.typing ? C.green : C.line}`, borderRadius: 4, lineHeight: '28px', paddingLeft: 10, boxSizing: 'border-box', overflow: 'hidden', whiteSpace: 'nowrap'}}>
          <Dax s={fx.text} size={19} />
          {fx.typing ? <span style={{display: 'inline-block', width: 2, height: 20, background: C.text, verticalAlign: 'middle', marginLeft: 1}} /> : null}
        </div>
        {/* body */}
        <OffCtx.Provider value={{x: ox, y: oy + BODY_Y}}>
          <div style={{position: 'absolute', left: 0, top: BODY_Y, width: WW, height: WH - BODY_Y - 62, overflow: 'hidden', background: C.cell}}>{children}</div>
        </OffCtx.Provider>
        {/* sheet tabs + status */}
        <div style={{position: 'absolute', left: 0, top: WH - 62, width: WW, height: 32, background: '#17233A', borderTop: `1px solid ${C.line}`}} />
        {sr.map((r, i) => (
          <Hit key={r.n} x={r.x} y={WH - 60} w={r.w} h={28} r={4} base={i === sheet ? '#0F172A' : 'transparent'}>
            <div style={{height: '100%', lineHeight: '26px', textAlign: 'center', fontSize: 17, color: i === sheet ? C.green : C.dim, fontWeight: i === sheet ? 700 : 400, borderBottom: i === sheet ? `3px solid ${C.green}` : 'none', boxSizing: 'border-box', direction: 'ltr'}}>{r.n}</div>
          </Hit>
        ))}
        <div style={{position: 'absolute', left: 0, top: WH - 30, width: WW, height: 30, background: C.xl, fontSize: 16, lineHeight: '30px', direction: 'ltr'}}>
          <span style={{position: 'absolute', left: 14}}>{status}</span>
          <span style={{position: 'absolute', right: 20, fontFamily: MONO, fontSize: 15}}>{statusR}</span>
        </div>
        {overlay}
      </div>
    </OffCtx.Provider>
  );
};

/* ---------- grid (column letters or names, selection, active cell, fill handle) ---------- */
export type GCol = {n?: string; w: number; a?: 'l' | 'r' | 'c'};
export const Grid: React.FC<{
  x?: number; y?: number; cols: GCol[]; rows: number; rowH?: number; headH?: number; rnW?: number; letters?: boolean;
  cell: (c: number, r: number) => string; sty?: (c: number, r: number) => React.CSSProperties | undefined;
  sel?: {c1: number; r1: number; c2: number; r2: number; handle?: boolean} | null; headRow?: boolean;
}> = ({x = 0, y = 0, cols, rows, rowH = 30, headH = 28, rnW = 56, letters = true, cell, sty, sel = null, headRow = false}) => {
  const cx: number[] = [];
  let acc = rnW;
  cols.forEach((c) => { cx.push(acc); acc += c.w; });
  const tw = acc;
  const L = (i: number) => String.fromCharCode(65 + i);
  const inSelC = (c: number) => !!sel && c >= sel.c1 && c <= sel.c2;
  const inSelR = (r: number) => !!sel && r >= sel.r1 && r <= sel.r2;
  const els: React.ReactNode[] = [];
  cols.forEach((c, i) => els.push(
    <div key={'h' + i} style={{position: 'absolute', left: cx[i], top: 0, width: c.w, height: headH, background: inSelC(i) ? '#1F4D3A' : C.panel, borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, boxSizing: 'border-box', textAlign: 'center', lineHeight: headH - 2 + 'px', fontSize: 17, color: inSelC(i) ? C.text : C.dim, fontWeight: inSelC(i) ? 700 : 400, direction: 'ltr'}}>{letters ? L(i) : c.n}</div>
  ));
  for (let r = 0; r < rows; r++) {
    const top = headH + r * rowH;
    els.push(<div key={'n' + r} style={{position: 'absolute', left: 0, top, width: rnW, height: rowH, background: inSelR(r) ? '#1F4D3A' : C.panel, borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, boxSizing: 'border-box', textAlign: 'center', lineHeight: rowH - 2 + 'px', fontSize: 16, color: inSelR(r) ? C.text : C.dim}}>{r + 1}</div>);
    cols.forEach((c, i) => {
      const s = cell(i, r);
      const st = sty ? sty(i, r) : undefined;
      els.push(<div key={r + '_' + i} style={{position: 'absolute', left: cx[i], top, width: c.w, height: rowH, borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, boxSizing: 'border-box', padding: '0 10px', lineHeight: rowH - 2 + 'px', fontSize: 19, textAlign: c.a === 'r' ? 'right' : c.a === 'c' ? 'center' : 'left', whiteSpace: 'nowrap', overflow: 'hidden', direction: 'ltr', color: headRow && r === 0 ? C.text : '#DCE6F5', fontWeight: headRow && r === 0 ? 700 : 400, ...st}}>{s}</div>);
    });
  }
  let selEl: React.ReactNode = null;
  if (sel) {
    const sx = cx[sel.c1];
    const sy = headH + sel.r1 * rowH;
    const sw = cx[sel.c2] + cols[sel.c2].w - sx;
    const sh = (sel.r2 - sel.r1 + 1) * rowH;
    const single = sel.c1 === sel.c2 && sel.r1 === sel.r2;
    selEl = (
      <div style={{position: 'absolute', left: sx, top: sy, width: sw, height: sh, border: `3px solid ${C.green}`, background: single ? 'transparent' : 'rgba(16,185,129,.14)', boxSizing: 'border-box', pointerEvents: 'none'}}>
        {sel.handle === false ? null : <div style={{position: 'absolute', right: -7, bottom: -7, width: 11, height: 11, background: C.green, border: `2px solid ${C.cell}`}} />}
      </div>
    );
  }
  return <div style={{position: 'absolute', left: x, top: y, width: tw, height: headH + rows * rowH}}>{els}{selEl}</div>;
};

/* ---------- dialog box ---------- */
export const Dialog: React.FC<{x: number; y: number; w: number; h: number; title: string; o: number; children?: React.ReactNode}> = ({x, y, w, h, title, o, children}) => (
  <div style={{position: 'absolute', left: x, top: y + (1 - o) * 14, width: w, height: h, opacity: o, background: '#1E293B', border: `1px solid ${C.blue}`, borderRadius: 8, boxShadow: '0 18px 50px rgba(0,0,0,.6)', fontFamily: AR, color: C.text, direction: 'ltr', zIndex: 20}}>
    <div style={{height: 40, background: '#0B3B5A', borderRadius: '8px 8px 0 0', lineHeight: '40px', paddingLeft: 14, fontSize: 19, fontWeight: 600}}>{title}<span style={{position: 'absolute', right: 14}}>✕</span></div>
    {children}
  </div>
);

/* ---------- screen furniture ---------- */
export const Card: React.FC<{x: number; y: number; w: number; h: number; col?: string; o?: number; glow?: boolean; children?: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, col = C.line, o = 1, glow = false, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y + (1 - o) * 22, width: w, height: h, opacity: o, background: C.panel, border: `2px solid ${col}`, borderRadius: 18, boxSizing: 'border-box', boxShadow: glow ? `0 0 34px ${col}66` : 'none', fontFamily: AR, color: C.text, ...style}}>{children}</div>
);

export const Tag: React.FC<{a: number; b: number; col: string; k: string; v: string; y?: number}> = ({a, b, col, k, v, y = 950}) => {
  const t = useT();
  const o = fadeIn(t, a, 0.45) * (1 - pr(t, b - 0.4, b));
  if (o <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 40, top: y + (1 - o) * 18, width: 1840, height: 74, opacity: o, background: 'rgba(15,23,42,.92)', border: `2px solid ${col}`, borderRadius: 16, boxShadow: `0 0 28px ${col}55`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 18, direction: 'ltr', fontFamily: AR, fontSize: 31, whiteSpace: 'nowrap', overflow: 'hidden'}}>
      <span style={{color: col, fontWeight: 700}}>{k}</span>
      <span style={{color: C.dim}}>──►</span>
      <span style={{color: C.text}}>{v}</span>
    </div>
  );
};

const Pill: React.FC<{children: React.ReactNode; col: string}> = ({children, col}) => (
  <span style={{border: `2px solid ${col}`, borderRadius: 14, padding: '4px 20px', color: C.text, background: 'rgba(15,23,42,.9)', direction: 'rtl', fontWeight: 600}}>{children}</span>
);
export const Chrome: React.FC<{title?: string}> = ({title = 'CALCULATE, FILTER & Context Modification Engine'}) => {
  const t = useT();
  const o = fadeIn(t, 0.4, 0.8);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 96, opacity: o, fontFamily: AR, fontSize: 28, display: 'flex', alignItems: 'center', gap: 18, paddingLeft: 40, direction: 'ltr'}}>
      <Img src={staticFile(LOGO)} style={{width: 70, height: 70}} />
      <Pill col={C.blue}>الدرس {LESSON} من {LESSONS}</Pill>
      <span style={{color: C.dim}}>──►</span>
      <Pill col={C.green}>الوحدة {UNIT} من {UNITS}</Pill>
      <span style={{color: C.text, fontWeight: 600, marginLeft: 10}}>{title}</span>
    </div>
  );
};
