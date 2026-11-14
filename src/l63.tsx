// Lesson 63 shared bits: real statistics of the 50,000-row sales data, Excel host, ToolPak dialogs.
import React from 'react';
import {C, MONO, UIFONT} from './theme';
import {CAM0, CellV, ExcelApp, ExcelWindow, XL, clamp} from './kit';
import {sale} from './data';

/* ---------------------------------------------------------------- statistics (computed from the lesson generator) */
export const N = 50000;
const RAW = Array.from({length: N}, (_, i) => sale(i + 1).total);
const SORT = [...RAW].sort((a, b) => a - b);
export const pctInc = (s: number[], p: number) => { const r = p * (s.length - 1); const lo = Math.floor(r); return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (r - lo); };
export const trimMean = (s: number[], p: number) => { const k = Math.floor((s.length * p) / 2); const a = s.slice(k, s.length - k); return a.reduce((x, y) => x + y, 0) / a.length; };
const modeOf = (a: number[]) => { const m: Record<number, number> = {}; let b = a[0], bc = 0; a.forEach((x) => { m[x] = (m[x] ?? 0) + 1; if (m[x] > bc) { bc = m[x]; b = x; } }); return {v: b, c: bc}; };
export const meanOf = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
export const medOf = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const mean = meanOf(RAW);
const sd = Math.sqrt(RAW.reduce((a, x) => a + (x - mean) ** 2, 0) / (N - 1));
const z = (p: number) => RAW.reduce((a, x) => a + ((x - mean) / sd) ** p, 0);
export const ST = {
  n: N, sum: RAW.reduce((a, b) => a + b, 0), mean, se: sd / Math.sqrt(N), median: medOf(RAW), mode: modeOf(RAW).v, modeCnt: modeOf(RAW).c, sd, vr: sd * sd,
  kurt: (N * (N + 1) * z(4)) / ((N - 1) * (N - 2) * (N - 3)) - (3 * (N - 1) ** 2) / ((N - 2) * (N - 3)), skew: (N / ((N - 1) * (N - 2))) * z(3),
  min: SORT[0], max: SORT[N - 1], range: SORT[N - 1] - SORT[0], tm: trimMean(SORT, 0.1), p90: pctInc(SORT, 0.9), q1: pctInc(SORT, 0.25), q3: pctInc(SORT, 0.75),
  conf: (1.96001 * sd) / Math.sqrt(N),
};
export const OUT_N = (() => { const f = ST.q3 + 1.5 * (ST.q3 - ST.q1); return RAW.filter((x) => x > f).length; })();
export const OUT_FENCE = ST.q3 + 1.5 * (ST.q3 - ST.q1);
export const EDIT_VAL = 9999999;
export const MEAN_EDIT = (ST.sum - RAW[0] + EDIT_VAL) / N;
export const CATS = ['Accessories', 'Electronics', 'Furniture', 'Office', 'Stationery'];
const BYCAT: Record<string, number[]> = {};
CATS.forEach((c) => { BYCAT[c] = []; });
for (let n = 1; n <= N; n++) { const s = sale(n); BYCAT[s.category].push(s.total); }
CATS.forEach((c) => BYCAT[c].sort((a, b) => a - b));
export const catTrim = (c: string) => trimMean(BYCAT[c], 0.1);
export const catP90 = (c: string) => pctInc(BYCAT[c], 0.9);
export const catN = (c: string) => BYCAT[c].length;
// small teaching sample: 14 ordinary sales (<= 4,800) + one huge outlier typed in live
export const SAMPLE: number[] = []; export const SAMP_IDS: string[] = [];
for (let n = 1; SAMPLE.length < 14; n++) { const v = sale(n).total; if (v <= 4800) { SAMPLE.push(v); SAMP_IDS.push(sale(n).id); } }
export const OUTLIER = 28800; // the real maximum invoice of the dataset
export const OUT_ID = (() => { for (let n = 1; n <= N; n++) if (sale(n).total === OUTLIER) return sale(n).id; return 'SO-OUT'; })();
export const SMODE = modeOf(SAMPLE).v;
export const fmt = (n: number) => n.toLocaleString('en-US');
export const f4 = (n: number) => (Number.isInteger(n) ? fmt(n) : n.toLocaleString('en-US', {minimumFractionDigits: 4, maximumFractionDigits: 4}));
export const f2 = (n: number) => n.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

/** the 16 rows of Descriptive Statistics output */
export const DESC: Array<[string, number]> = [
  ['Mean', ST.mean], ['Standard Error', ST.se], ['Median', ST.median], ['Mode', ST.mode], ['Standard Deviation', ST.sd], ['Sample Variance', ST.vr], ['Kurtosis', ST.kurt], ['Skewness', ST.skew],
  ['Range', ST.range], ['Minimum', ST.min], ['Maximum', ST.max], ['Sum', ST.sum], ['Count', N], ['Largest(1)', ST.max], ['Smallest(1)', ST.min], ['Confidence Level(95.0%)', ST.conf],
];

/* ---------------------------------------------------------------- sales sheet */
export const cwS = (c: number) => [0, 84, 92, 130, 100, 54, 84, 84, 84][c] ?? 64;
const HEADS = ['Order ID', 'Branch', 'Product', 'Category', 'Qty', 'Unit Price', 'Total', 'Tier'];
export const salesCell = (r: number, c: number, edit?: string): CellV | undefined => {
  if (c < 1 || c > 8) return undefined;
  if (r === 1) return {t: HEADS[c - 1], b: true, bg: '#4472C4', color: '#FFFFFF', al: c >= 5 && c <= 7 ? 'r' : 'l'};
  const s = sale(r - 1); const bg = r % 2 === 0 ? '#D9E1F2' : undefined;
  switch (c) {
    case 1: return {t: s.id, bg}; case 2: return {t: s.branch, bg}; case 3: return {t: s.product, bg}; case 4: return {t: s.category, bg};
    case 5: return {t: String(s.qty), num: 1, al: 'r', bg}; case 6: return {t: fmt(s.price), num: 1, al: 'r', bg};
    case 7: return edit !== undefined && r === 2 ? {t: edit, num: 1, al: 'r', bg: '#FDE68A', b: true} : {t: fmt(s.total), num: 1, al: 'r', bg};
    default: return {t: s.total >= 5000 ? 'Premium' : s.total >= 1000 ? 'Standard' : 'Basic', bg};
  }
};

/* ---------------------------------------------------------------- Excel host with selection / formula bar */
export type H63 = {tab?: string; cell: (r: number, c: number) => CellV | undefined; colW?: (c: number) => number; sheets?: string[]; sheet?: string; sel?: {r1: number; c1: number; r2: number; c2: number}; active?: {r: number; c: number};
  nameBox?: string; formula?: string; checks?: Record<string, number>; ribbonHot?: string; glow?: string; fbEdit?: boolean; children?: React.ReactNode};
export const Host63: React.FC<H63> = ({tab = 'Home', cell, colW = cwS, sheets = ['Sales'], sheet = 'Sales', sel = {r1: 1, c1: 1, r2: 1, c2: 1}, active, nameBox = 'A1', formula = '', checks, ribbonHot, glow, fbEdit, children}) => (
  <ExcelWindow cam={CAM0} glow={glow}>
    <ExcelApp file="manzooma_sales_2026.xlsx" tab={tab} ribbonHot={ribbonHot} nameBox={nameBox} formula={formula} fbEdit={fbEdit} colW={colW} cell={cell} sel={sel} active={active ?? {r: sel.r1, c: sel.c1}} sheets={sheets} sheet={sheet} checks={checks}>
      {children}
    </ExcelApp>
  </ExcelWindow>
);
/** logical position of a cell centre (rows start at 208, row header 38) */
export const cellC = (r: number, c: number, cw: (c: number) => number = cwS) => { let x = 38; for (let i = 1; i < c; i++) x += cw(i); return {x: x + cw(c) / 2, y: 208 + (r - 1) * 20 + 10}; };

/* ---------------------------------------------------------------- dialog primitives (logical coordinates) */
const ab = (x: number, y: number, w?: number, h?: number, e?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...e});
const TX: React.CSSProperties = {fontFamily: UIFONT, fontSize: 12.5, color: '#1B1B1B', whiteSpace: 'nowrap'};
export const Win: React.FC<{x: number; y: number; w: number; h: number; title: string; p: number; children?: React.ReactNode}> = ({x, y, w, h, title, p, children}) => (
  p > 0.01 ? (
    <div style={ab(x, y, w, h, {background: '#F0F0F0', border: '1px solid #7A7A7A', boxShadow: '0 14px 44px rgba(0,0,0,.45)', zIndex: 60, opacity: clamp(p * 1.4), transform: `scale(${0.96 + 0.04 * clamp(p)})`, transformOrigin: '50% 40%'})}>
      <div style={ab(0, 0, w, 28, {background: '#fff', borderBottom: '1px solid #DDD', ...TX, lineHeight: '28px', padding: '0 10px', fontSize: 12.5})}>{title}<span style={{position: 'absolute', right: 14, top: 0, fontSize: 14}}>✕</span></div>
      {children}
    </div>
  ) : null
);
export const Btn: React.FC<{x: number; y: number; w?: number; label: string; hot?: boolean; def?: boolean}> = ({x, y, w = 80, label, hot, def}) => (
  <div style={ab(x, y, w, 26, {border: `1px solid ${hot || def ? '#107C41' : '#999'}`, background: hot ? '#CFE8D8' : '#E6E6E6', boxShadow: hot ? '0 0 0 2px #107C4166' : undefined, textAlign: 'center', lineHeight: '24px', ...TX})}>{label}</div>
);
export const Chk: React.FC<{x: number; y: number; label: string; on: boolean; hot?: boolean}> = ({x, y, label, on, hot}) => (
  <div style={ab(x, y, 300, 20, {display: 'flex', alignItems: 'center', gap: 7, ...TX, background: hot ? '#DDEFE4' : undefined})}>
    <span style={{width: 14, height: 14, border: '1.5px solid #444', background: '#fff', textAlign: 'center', lineHeight: '12px', fontSize: 12, color: '#107C41', fontWeight: 700}}>{on ? '✓' : ''}</span>{label}
  </div>
);
export const Rad: React.FC<{x: number; y: number; label: string; on: boolean}> = ({x, y, label, on}) => (
  <div style={ab(x, y, 220, 20, {display: 'flex', alignItems: 'center', gap: 7, ...TX})}>
    <span style={{width: 14, height: 14, border: '1.5px solid #444', background: '#fff', borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>{on ? <span style={{width: 7, height: 7, borderRadius: 4, background: '#107C41'}} /> : null}</span>{label}
  </div>
);
export const Fld: React.FC<{x: number; y: number; w: number; text: string; caret?: boolean}> = ({x, y, w, text, caret}) => (
  <div style={ab(x, y, w, 22, {background: '#fff', border: '1px solid #8A8A8A', ...TX, lineHeight: '20px', padding: '0 6px', boxSizing: 'border-box', fontFamily: 'Consolas, monospace'})}>{text}{caret ? <span style={{borderRight: '1.5px solid #000'}} /> : null}</div>
);

/** backstage (File) */
export const BACK = {optX: 115, optY: 598};
export const Backstage: React.FC<{p: number; hot?: boolean}> = ({p, hot}) => {
  const items = ['Home', 'New', 'Open', 'Info', 'Save', 'Save As', 'Print', 'Share', 'Export', 'Publish', 'Close'];
  return p > 0.01 ? (
    <div style={ab(0, XL.title, XL.W, XL.H - XL.title, {background: '#fff', zIndex: 55, opacity: clamp(p * 1.5)})}>
      <div style={ab(0, 0, 230, XL.H - XL.title, {background: '#107C41'})}>
        {items.map((n, i) => <div key={n} style={ab(0, 40 + i * 34 + (i > 2 ? 18 : 0), 230, 34, {color: '#fff', ...TX, fontSize: 14, lineHeight: '34px', padding: '0 34px', background: n === 'Info' ? '#0B5E31' : undefined})}>{n}</div>)}
        {['Account', 'Feedback'].map((n, i) => <div key={n} style={ab(0, 500 + i * 34 - 34, 230, 34, {color: '#fff', ...TX, fontSize: 14, lineHeight: '34px', padding: '0 34px'})}>{n}</div>)}
        <div style={ab(0, BACK.optY - XL.title - 17, 230, 34, {color: '#fff', ...TX, fontSize: 14, lineHeight: '34px', padding: '0 34px', background: hot ? '#2E9E62' : undefined})}>Options</div>
      </div>
      <div style={ab(270, 40, 600, 80, {...TX, fontSize: 28, fontWeight: 700})}>Info</div>
      <div style={ab(270, 100, 700, 30, {...TX, fontSize: 18})}>manzooma_sales_2026</div>
    </div>
  ) : null;
};
export const OPT = {x: 300, y: 64, w: 936, h: 540};
export const OPT_NAV = ['General', 'Formulas', 'Data', 'Proofing', 'Save', 'Language', 'Accessibility', 'Advanced', 'Customize Ribbon', 'Quick Access Toolbar', 'Add-ins', 'Trust Center'];
export const optNav = (i: number) => ({x: OPT.x + 90, y: OPT.y + 60 + i * 26 + 10});
export const OPT_GO = {x: OPT.x + 660, y: OPT.y + OPT.h - 96, w: 64, h: 26};
export const OptionsDlg: React.FC<{p: number; nav: number; goHot?: boolean}> = ({p, nav, goHot}) => (
  <Win x={OPT.x} y={OPT.y} w={OPT.w} h={OPT.h} title="Excel Options" p={p}>
    <div style={ab(0, 28, 200, OPT.h - 28, {background: '#F7F7F7', borderRight: '1px solid #D0D0D0'})}>
      {OPT_NAV.map((n, i) => <div key={n} style={ab(0, 32 + i * 26, 200, 26, {...TX, lineHeight: '26px', padding: '0 20px', background: i === nav ? '#CFE8D8' : undefined, fontWeight: i === nav ? 700 : 400})}>{n}</div>)}
    </div>
    <div style={ab(220, 40, 680, 24, {...TX, fontSize: 15, fontWeight: 700})}>{nav === 10 ? 'View and manage Microsoft Office Add-ins.' : OPT_NAV[nav]}</div>
    {nav === 10 ? (
      <div style={{display: 'contents'}}>
        <div style={ab(220, 76, 680, 22, {...TX, color: '#555', fontWeight: 700})}>Add-ins</div>
        <div style={ab(220, 100, 690, 210, {background: '#fff', border: '1px solid #BBB'})}>
          <div style={ab(0, 0, 690, 22, {background: '#EEE', ...TX, lineHeight: '22px', padding: '0 8px'})}>Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Location &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type</div>
          <div style={ab(8, 30, 600, 20, {...TX, color: '#666'})}>Active Application Add-ins: none</div>
          <div style={ab(8, 70, 600, 20, {...TX, color: '#666'})}>Inactive Application Add-ins: Analysis ToolPak, Solver Add-in …</div>
        </div>
        <div style={ab(220, OPT.h - 100, 80, 22, {...TX, lineHeight: '22px', fontWeight: 700, marginTop: 4})}>Manage:</div>
        <Fld x={300} y={OPT.h - 98} w={180} text="Excel Add-ins  ▾" />
        <Btn x={OPT_GO.x - OPT.x} y={OPT_GO.y - OPT.y} w={OPT_GO.w} label="Go…" hot={goHot} />
      </div>
    ) : null}
    <Btn x={OPT.w - 190} y={OPT.h - 40} w={80} label="OK" def />
    <Btn x={OPT.w - 100} y={OPT.h - 40} w={80} label="Cancel" />
  </Win>
);
export const ADD = {x: 560, y: 130, w: 430, h: 350};
export const ADD_ITEMS = ['Analysis ToolPak', 'Analysis ToolPak - VBA', 'Euro Currency Tools', 'Solver Add-in'];
export const addChk = (i: number) => ({x: ADD.x + 30, y: ADD.y + 66 + i * 24 + 12});
export const ADD_OK = {x: ADD.x + ADD.w - 60, y: ADD.y + 73};
export const AddinsDlg: React.FC<{p: number; on: boolean; okHot?: boolean}> = ({p, on, okHot}) => (
  <Win x={ADD.x} y={ADD.y} w={ADD.w} h={ADD.h} title="Add-ins" p={p}>
    <div style={ab(16, 36, 300, 18, TX)}>Add-ins available:</div>
    <div style={ab(16, 58, 300, 160, {background: '#fff', border: '1px solid #8A8A8A'})}>
      {ADD_ITEMS.map((n, i) => <Chk key={n} x={8} y={8 + i * 24} label={n} on={i === 0 && on} />)}
    </div>
    <Btn x={ADD.w - 100} y={60 - 28 + 28} label="OK" hot={okHot} def /><Btn x={ADD.w - 100} y={92} label="Cancel" /><Btn x={ADD.w - 100} y={124} label="Browse…" /><Btn x={ADD.w - 100} y={156} label="Automation…" />
    <div style={ab(16, 236, ADD.w - 32, 90, {border: '1px solid #BBB', background: '#fff', padding: 8, boxSizing: 'border-box', ...TX, whiteSpace: 'normal', lineHeight: '17px'})}><b>Analysis ToolPak</b><br />Provides data analysis tools for statistical and engineering analysis</div>
  </Win>
);
export const DA = {x: 600, y: 120, w: 380, h: 420};
export const DA_LIST = ['Anova: Single Factor', 'Anova: Two-Factor With Replication', 'Anova: Two-Factor Without Replication', 'Correlation', 'Covariance', 'Descriptive Statistics', 'Exponential Smoothing', 'F-Test Two-Sample for Variances', 'Fourier Analysis', 'Histogram', 'Moving Average', 'Random Number Generation', 'Rank and Percentile'];
export const daItem = (i: number) => ({x: DA.x + 120, y: DA.y + 64 + i * 22 + 11});
export const DA_OK = {x: DA.x + DA.w - 56, y: DA.y + 67};
export const DataAnalysisDlg: React.FC<{p: number; sel: number; okHot?: boolean}> = ({p, sel, okHot}) => (
  <Win x={DA.x} y={DA.y} w={DA.w} h={DA.h} title="Data Analysis" p={p}>
    <div style={ab(16, 34, 200, 18, TX)}>Analysis Tools</div>
    <div style={ab(16, 54, 252, 300, {background: '#fff', border: '1px solid #8A8A8A', overflow: 'hidden'})}>
      {DA_LIST.map((n, i) => <div key={n} style={ab(0, 6 + i * 22, 252, 22, {...TX, lineHeight: '22px', padding: '0 8px', background: i === sel ? '#0A64C8' : undefined, color: i === sel ? '#fff' : '#1B1B1B'})}>{n}</div>)}
    </div>
    <Btn x={DA.w - 96} y={54} label="OK" hot={okHot} def /><Btn x={DA.w - 96} y={86} label="Cancel" /><Btn x={DA.w - 96} y={118} label="Help" />
  </Win>
);
export const DS = {x: 520, y: 62, w: 540, h: 530};
export const DS_OK = {x: DS.x + DS.w - 56, y: DS.y + 53};
export const dsPt = (k: 'input' | 'labels' | 'ws' | 'summary' | 'conf' | 'kl' | 'ks') => ({input: {x: DS.x + 270, y: DS.y + 65}, labels: {x: DS.x + 35, y: DS.y + 126}, ws: {x: DS.x + 35, y: DS.y + 206}, summary: {x: DS.x + 35, y: DS.y + 262}, conf: {x: DS.x + 35, y: DS.y + 290}, kl: {x: DS.x + 35, y: DS.y + 318}, ks: {x: DS.x + 35, y: DS.y + 346}}[k]);
export const DescDlg: React.FC<{p: number; input: string; caret?: boolean; labels: boolean; summary: boolean; conf: boolean; kl: boolean; ks: boolean; okHot?: boolean}> = ({p, input, caret, labels, summary, conf, kl, ks, okHot}) => (
  <Win x={DS.x} y={DS.y} w={DS.w} h={DS.h} title="Descriptive Statistics" p={p}>
    <div style={ab(16, 36, 100, 18, {...TX, fontWeight: 700})}>Input</div>
    <div style={ab(28, 56, 120, 18, TX)}>Input Range:</div><Fld x={150} y={54} w={240} text={input} caret={caret} />
    <div style={ab(28, 88, 120, 18, TX)}>Grouped By:</div><Rad x={150} y={88} label="Columns" on /><Rad x={260} y={88} label="Rows" on={false} />
    <Chk x={28} y={116} label="Labels in first row" on={labels} />
    <div style={ab(16, 148, 120, 18, {...TX, fontWeight: 700})}>Output options</div>
    <Rad x={28} y={168} label="Output Range:" on={false} /><Fld x={170} y={166} w={220} text="" />
    <Rad x={28} y={196} label="New Worksheet Ply:" on /><Fld x={170} y={194} w={220} text="Stats" />
    <Rad x={28} y={224} label="New Workbook" on={false} />
    <Chk x={28} y={252} label="Summary statistics" on={summary} />
    <Chk x={28} y={280} label="Confidence Level for Mean:" on={conf} /><Fld x={250} y={278} w={60} text={conf ? '95' : ''} /><span style={ab(316, 280, 20, 18, TX)}>%</span>
    <Chk x={28} y={308} label="Kth Largest:" on={kl} /><Fld x={250} y={306} w={60} text={kl ? '1' : ''} />
    <Chk x={28} y={336} label="Kth Smallest:" on={ks} /><Fld x={250} y={334} w={60} text={ks ? '1' : ''} />
    <Btn x={DS.w - 96} y={40} label="OK" hot={okHot} def /><Btn x={DS.w - 96} y={72} label="Cancel" /><Btn x={DS.w - 96} y={104} label="Help" />
  </Win>
);
export {C, MONO};

/** 12-bin histogram of the 50,000 totals (bin width 2,400, 0..28,800) */
export const BIN_W = 2400;
export const BINS = (() => { const b = Array(12).fill(0); for (let n = 1; n <= N; n++) b[Math.min(11, Math.floor(sale(n).total / BIN_W))]++; return b as number[]; })();
export const Hist: React.FC<{x: number; y: number; w: number; h: number; p: number; mark: number; color?: string; fence?: number}> = ({x, y, w, h, p, mark, color = C.blue, fence = 0}) => {
  const mx = Math.max(...BINS); const bw = (w - 20) / 12; const xs = (v: number) => 10 + (v / (BIN_W * 12)) * (w - 20);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: x, top: y, zIndex: 30, overflow: 'visible'}}>
      <rect width={w} height={h} rx={12} fill="#0B1222" stroke={color} strokeWidth={2} opacity={clamp(p)} />
      {BINS.map((c, i) => { const bh = (c / mx) * (h - 60) * clamp(p * 1.3 - i * 0.03); return <rect key={i} x={10 + i * bw + 2} y={h - 24 - bh} width={bw - 4} height={Math.max(0, bh)} fill={color} opacity={0.85} />; })}
      <line x1={10} y1={h - 24} x2={w - 10} y2={h - 24} stroke="#475569" />
      {fence > 0.01 ? (
        <g opacity={clamp(fence)}>
          <rect x={xs(OUT_FENCE)} y={20} width={w - 10 - xs(OUT_FENCE)} height={h - 44} fill={C.red} opacity={0.18} />
          <line x1={xs(OUT_FENCE)} x2={xs(OUT_FENCE)} y1={20} y2={h - 24} stroke={C.amber} strokeWidth={3} strokeDasharray="5 4" />
          <text x={xs(OUT_FENCE) + 6} y={h - 60} fill={C.amber} fontFamily={MONO} fontSize={12} fontWeight={700}>Q3 + 1.5×IQR = {fmt(Math.round(OUT_FENCE))}</text>
        </g>
      ) : null}
      {mark > 0.01 ? (
        <g opacity={clamp(mark)}>
          <line x1={xs(ST.mean)} x2={xs(ST.mean)} y1={20} y2={h - 24} stroke={C.red} strokeWidth={3} strokeDasharray="6 4" />
          <text x={xs(ST.mean) + 6} y={34} fill={C.red} fontFamily={MONO} fontSize={13} fontWeight={700}>Mean {f2(ST.mean)}</text>
          <line x1={xs(ST.median)} x2={xs(ST.median)} y1={20} y2={h - 24} stroke={C.purple} strokeWidth={3} />
          <text x={xs(ST.median) + 8} y={54} textAnchor="start" fill={C.purple} fontFamily={MONO} fontSize={13} fontWeight={700}>Median {fmt(ST.median)}</text>
        </g>
      ) : null}
      <text x={12} y={h - 6} fill="#94A3B8" fontFamily={MONO} fontSize={11}>0</text><text x={w - 12} y={h - 6} textAnchor="end" fill="#94A3B8" fontFamily={MONO} fontSize={11}>28,800 · Total per invoice</text>
    </svg>
  );
};
