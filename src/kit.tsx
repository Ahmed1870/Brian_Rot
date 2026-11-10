import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadOpen} from '@remotion/google-fonts/OpenSans';
import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {COL, XL, LOGO_FILE} from './theme';

const open = loadOpen('normal', {weights: ['400', '600', '700'], subsets: ['latin']});
const plex = loadPlex('normal', {weights: ['400', '500', '600', '700'], subsets: ['arabic', 'latin']});
const mono = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']});
export const FONT = {
  ui: `${open.fontFamily}, 'Segoe UI', 'Noto Sans', 'DejaVu Sans', sans-serif`,
  cell: `Carlito, Calibri, 'Liberation Sans', Arial, sans-serif`,
  ar: `${plex.fontFamily}, 'Noto Sans Arabic', sans-serif`,
  mono: `${mono.fontFamily}, 'DejaVu Sans Mono', monospace`,
};

// ---------- math helpers ----------
export const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const pg = (t: number, a: number, b: number) => cl((t - a) / (b - a));
export const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const pe = (t: number, a: number, b: number) => ease(pg(t, a, b));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * pg(t, a, b)));
export const colName = (c: number) =>
  c < 26 ? String.fromCharCode(65 + c) : String.fromCharCode(64 + Math.floor(c / 26)) + String.fromCharCode(65 + (c % 26));
export const parseRef = (s: string): {r: number; c: number} | null => {
  const m = /^\$?([A-Z]{1,2})\$?(\d+)$/.exec(s);
  if (!m) return null;
  let c = 0;
  for (const ch of m[1]) c = c * 26 + ch.charCodeAt(0) - 64;
  return {c: c - 1, r: parseInt(m[2], 10)};
};
export const fmtInt = (n: number) => n.toLocaleString('en-US');

// ---------- types ----------
export type Cell = {t: string; f?: string; al?: 'l' | 'r' | 'c'; b?: boolean; bg?: string; col?: string; tri?: boolean; ovf?: boolean; pre?: boolean; bt?: string; bb?: string; dd?: boolean; ind?: number; i?: boolean};
export type Sel = {r1: number; c1: number; r2: number; c2: number; ar: number; ac: number; handle?: boolean};
export type Rect = {x: number; y: number; w: number; h: number};
export type Geo = {hw: number; rect: (r1: number, c1: number, r2: number, c2: number) => Rect | null; cell: (r: number, c: number) => Rect | null; cx: (c: number) => number};
export type Cur = {x: number; y: number; k?: 'arrow' | 'cross'};
export type View = {
  top: number; freeze: boolean; showF?: boolean; hw?: number;
  cell: (r: number, c: number) => Cell | undefined;
  sel?: Sel; edit?: {r: number; c: number; text: string; caret?: boolean};
  mode?: string; fb?: string; name?: string;
  ov?: (g: Geo) => React.ReactNode; cursor?: (g: Geo) => Cur | null;
  stats?: {avg: string; cnt: string; sum: string};
  sheet: number; sheets?: string[]; widths?: number[]; paneW?: number; pane?: React.ReactNode; layer?: React.ReactNode; ribbon?: string; hi?: string; tab?: number; ctx?: boolean; file: string; vs?: {pos: number; size: number};
};

// ---------- formula text with Excel range-finder colours ----------
const REF = /((?<![A-Za-z])\$?[A-Z]{1,2}\$?\d+)/g;
export const refsOf = (text: string) => (text.match(REF) ?? []).map((s) => s);
export const FormulaText: React.FC<{text: string; color?: boolean}> = ({text, color = true}) => {
  const parts = text.split(REF);
  let k = -1;
  return (
    <span>
      {parts.map((p, i) => {
        if (i % 2 === 1) {
          k++;
          return <span key={i} style={{color: color ? XL.refColors[k % XL.refColors.length] : undefined}}>{p}</span>;
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
};

// ---------- icons (generic, drawn in code, no brand artwork) ----------
const SW = {strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const ICONS: Record<string, React.ReactNode> = {
  paste: <g><rect x="4" y="5" width="13" height="16" rx="1.5" fill="#C58B3C"/><rect x="8" y="3" width="5" height="4" rx="1" fill="#6B4A1F"/><rect x="10" y="9" width="11" height="13" rx="1" fill="#fff" stroke="#6B7280"/><path d="M12 13h7M12 16h7M12 19h5" stroke="#9CA3AF" {...SW}/></g>,
  cut: <g><path d="M7 3l7 11M17 3l-7 11" stroke="#4B5563" strokeWidth="1.6" {...SW}/><circle cx="7" cy="18" r="3" stroke="#2F6FEB" strokeWidth="1.6" fill="none"/><circle cx="17" cy="18" r="3" stroke="#2F6FEB" strokeWidth="1.6" fill="none"/></g>,
  copy: <g><rect x="8" y="3" width="11" height="14" rx="1.5" fill="#fff" stroke="#6B7280"/><rect x="4" y="7" width="11" height="14" rx="1.5" fill="#fff" stroke="#2F6FEB"/></g>,
  painter: <g><rect x="4" y="3" width="14" height="6" rx="1.5" fill="#F2C94C" stroke="#B7791F"/><path d="M11 9v4" stroke="#6B7280" strokeWidth="1.6" {...SW}/><rect x="9" y="13" width="4" height="8" rx="1" fill="#9CA3AF" stroke="#6B7280"/></g>,
  border: <g><rect x="4" y="4" width="16" height="16" stroke="#6B7280" strokeDasharray="2 2" fill="none"/><path d="M4 20h16" stroke="#111" strokeWidth="2.2"/></g>,
  fill: <g><path d="M5 12l7-7 7 7-6 6z" fill="#E5E7EB" stroke="#4B5563" {...SW}/><path d="M19 14c1.5 2 1.5 3 0 3s-1.5-1 0-3z" fill="#2F6FEB"/><rect x="3" y="20" width="18" height="3" fill="#FFE14D"/></g>,
  fcolor: <g><text x="12" y="17" textAnchor="middle" fontSize="17" fontWeight="700" fill="#111" fontFamily="Carlito, Calibri, sans-serif">A</text><rect x="4" y="19" width="16" height="3" fill="#E5484D"/></g>,
  aL: <path d="M4 6h16M4 10h10M4 14h16M4 18h10" stroke="#4B5563" strokeWidth="1.6" {...SW}/>,
  aC: <path d="M4 6h16M7 10h10M4 14h16M7 18h10" stroke="#4B5563" strokeWidth="1.6" {...SW}/>,
  aR: <path d="M4 6h16M10 10h10M4 14h16M10 18h10" stroke="#4B5563" strokeWidth="1.6" {...SW}/>,
  vT: <g><path d="M4 4h16" stroke="#111" strokeWidth="1.6" {...SW}/><path d="M6 8h12M6 12h8" stroke="#6B7280" strokeWidth="1.6" {...SW}/></g>,
  vM: <g><path d="M4 12h16" stroke="#111" strokeWidth="1" strokeDasharray="2 2"/><path d="M6 8h12M6 16h8" stroke="#6B7280" strokeWidth="1.6" {...SW}/></g>,
  vB: <g><path d="M4 20h16" stroke="#111" strokeWidth="1.6" {...SW}/><path d="M6 12h12M6 16h8" stroke="#6B7280" strokeWidth="1.6" {...SW}/></g>,
  orient: <g><path d="M5 19l9-9" stroke="#4B5563" strokeWidth="1.6" {...SW}/><path d="M14 6h5v5" stroke="#2F6FEB" strokeWidth="1.6" {...SW}/></g>,
  wrap: <g><path d="M4 6h16M4 12h12a3 3 0 010 6h-4M4 18h5" stroke="#4B5563" strokeWidth="1.6" {...SW}/><path d="M13 16l-2 2 2 2" stroke="#2F6FEB" strokeWidth="1.6" {...SW}/></g>,
  merge: <g><rect x="3" y="6" width="18" height="12" stroke="#4B5563" fill="none"/><path d="M7 12h10M9 10l-2 2 2 2M15 10l2 2-2 2" stroke="#2F6FEB" strokeWidth="1.5" {...SW}/></g>,
  indent: <g><path d="M4 5h16M12 10h8M12 15h8M4 20h16" stroke="#4B5563" strokeWidth="1.6" {...SW}/><path d="M4 9l4 3-4 3z" fill="#2F6FEB"/></g>,
  dedent: <g><path d="M4 5h16M12 10h8M12 15h8M4 20h16" stroke="#4B5563" strokeWidth="1.6" {...SW}/><path d="M8 9l-4 3 4 3z" fill="#2F6FEB"/></g>,
  dollar: <text x="12" y="18" textAnchor="middle" fontSize="18" fontWeight="700" fill="#217346" fontFamily="Carlito, Calibri, sans-serif">$</text>,
  pct: <text x="12" y="18" textAnchor="middle" fontSize="17" fontWeight="700" fill="#4B5563" fontFamily="Carlito, Calibri, sans-serif">%</text>,
  comma: <text x="12" y="18" textAnchor="middle" fontSize="20" fontWeight="700" fill="#4B5563" fontFamily="Carlito, Calibri, sans-serif">,</text>,
  decP: <g><text x="2" y="14" fontSize="10" fontWeight="700" fill="#4B5563" fontFamily="Carlito, Calibri, sans-serif">.0</text><path d="M13 17h8M18 14l3 3-3 3" stroke="#2F6FEB" strokeWidth="1.5" {...SW}/></g>,
  decM: <g><text x="2" y="14" fontSize="10" fontWeight="700" fill="#4B5563" fontFamily="Carlito, Calibri, sans-serif">.00</text><path d="M21 17h-8M16 14l-3 3 3 3" stroke="#2F6FEB" strokeWidth="1.5" {...SW}/></g>,
  cond: <g><rect x="3" y="4" width="18" height="16" stroke="#6B7280" fill="#fff"/><rect x="5" y="7" width="8" height="3" fill="#E5484D"/><rect x="5" y="12" width="12" height="3" fill="#F2C94C"/><rect x="5" y="17" width="5" height="2" fill="#12A150"/></g>,
  table: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#6B7280"/><rect x="3" y="4" width="18" height="4" fill="#2F6FEB"/><path d="M3 12h18M3 16h18M9 8v12M15 8v12" stroke="#9CA3AF"/></g>,
  styles: <g><rect x="3" y="6" width="18" height="12" rx="2" fill="#E2EFDA" stroke="#217346"/><path d="M7 12h10" stroke="#217346" strokeWidth="2" {...SW}/></g>,
  insert: <g><rect x="3" y="3" width="14" height="14" stroke="#6B7280" fill="#fff"/><path d="M3 10h14M10 3v14" stroke="#D1D5DB"/><circle cx="17" cy="17" r="5" fill="#12A150"/><path d="M17 14.5v5M14.5 17h5" stroke="#fff" strokeWidth="1.6" {...SW}/></g>,
  delete: <g><rect x="3" y="3" width="14" height="14" stroke="#6B7280" fill="#fff"/><path d="M3 10h14M10 3v14" stroke="#D1D5DB"/><circle cx="17" cy="17" r="5" fill="#E5484D"/><path d="M14.5 17h5" stroke="#fff" strokeWidth="1.8" {...SW}/></g>,
  format: <g><rect x="3" y="3" width="14" height="14" stroke="#6B7280" fill="#fff"/><path d="M3 10h14M10 3v14" stroke="#D1D5DB"/><circle cx="17" cy="17" r="4.5" fill="#6B7280"/><circle cx="17" cy="17" r="1.8" fill="#fff"/></g>,
  sigma: <path d="M18 5H7l6 7-6 7h11" stroke="#217346" strokeWidth="2.2" {...SW}/>,
  fillDown: <g><rect x="4" y="3" width="12" height="16" stroke="#6B7280" fill="#fff"/><path d="M10 8v9M7 14l3 3 3-3" stroke="#2F6FEB" strokeWidth="1.6" {...SW}/></g>,
  clear: <g><path d="M4 15l8-9 8 7-5 6H8z" fill="#F9A8D4" stroke="#6B7280" {...SW}/></g>,
  sort: <g><path d="M3 5h8M3 9h6M3 13h4" stroke="#4B5563" strokeWidth="1.6" {...SW}/><path d="M13 5h8l-3 5v7l-2 2v-9z" fill="#2F6FEB"/></g>,
  find: <g><circle cx="10" cy="10" r="6" stroke="#4B5563" strokeWidth="1.8" fill="#fff"/><path d="M15 15l6 6" stroke="#4B5563" strokeWidth="2.2" {...SW}/></g>,
  pivot: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#6B7280"/><rect x="3" y="4" width="18" height="4" fill="#2F6FEB"/><rect x="3" y="8" width="5" height="12" fill="#BFD6F7"/><path d="M8 12h13M8 16h13M13 8v12" stroke="#9CA3AF"/><path d="M15 2l3 3-3 3" stroke="#E5A000" strokeWidth="1.6" fill="none"/></g>,
  recpivot: <g><rect x="3" y="5" width="14" height="13" fill="#fff" stroke="#6B7280"/><rect x="3" y="5" width="14" height="3.5" fill="#2F6FEB"/><path d="M9 8.5v9.5M3 12h14M3 15h14" stroke="#9CA3AF"/><circle cx="18" cy="17" r="4" fill="#F2C94C" stroke="#B7791F"/></g>,
  pic: <g><rect x="3" y="5" width="18" height="14" rx="1.5" fill="#E8F1FB" stroke="#6B7280"/><circle cx="9" cy="10" r="2" fill="#F2C94C"/><path d="M4 18l5-5 4 4 3-3 4 4" stroke="#12A150" strokeWidth="1.8" fill="none"/></g>,
  shapes: <g><circle cx="9" cy="9" r="5" fill="#BFD6F7" stroke="#2F6FEB"/><rect x="11" y="11" width="9" height="9" fill="#F9C9C9" stroke="#E5484D"/></g>,
  icons: <g><path d="M12 4l2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8z" fill="#F2C94C" stroke="#B7791F"/></g>,
  addin: <g><rect x="4" y="4" width="7" height="7" fill="#2F6FEB"/><rect x="13" y="4" width="7" height="7" fill="#12A150"/><rect x="4" y="13" width="7" height="7" fill="#E5A000"/><rect x="13" y="13" width="7" height="7" fill="#E5484D"/></g>,
  chart: <g><rect x="4" y="12" width="4" height="8" fill="#2F6FEB"/><rect x="10" y="7" width="4" height="13" fill="#12A150"/><rect x="16" y="4" width="4" height="16" fill="#F2C94C"/></g>,
  pchart: <g><rect x="4" y="12" width="4" height="8" fill="#2F6FEB"/><rect x="10" y="7" width="4" height="13" fill="#12A150"/><path d="M15 4l3 3-3 3" stroke="#E5A000" strokeWidth="1.8" fill="none"/></g>,
  map3d: <g><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z" fill="#D5EBD9" stroke="#12A150"/><path d="M9 4v13M15 7v13" stroke="#12A150"/></g>,
  spark: <g><path d="M3 17l4-6 4 3 5-8 5 6" stroke="#2F6FEB" strokeWidth="2" fill="none"/></g>,
  slicer: <g><rect x="3" y="4" width="11" height="16" rx="1.5" fill="#fff" stroke="#6B7280"/><rect x="5" y="7" width="7" height="3" fill="#7FB6F0"/><rect x="5" y="12" width="7" height="3" fill="#E5E7EB"/><path d="M15 6h6l-2 4v6l-2 2v-8z" fill="#2F6FEB"/></g>,
  timeline: <g><rect x="2" y="6" width="20" height="12" rx="1.5" fill="#fff" stroke="#6B7280"/><rect x="6" y="10" width="9" height="4" fill="#7FB6F0"/><path d="M4 16h16" stroke="#9CA3AF"/></g>,
  link: <g><path d="M10 14l4-4M8 11l-2 2a3 3 0 004 4l2-2M16 13l2-2a3 3 0 00-4-4l-2 2" stroke="#2F6FEB" strokeWidth="1.8" fill="none" strokeLinecap="round"/></g>,
  comment: <g><path d="M4 5h16v11H11l-4 4v-4H4z" fill="#FFF2CC" stroke="#B7791F"/></g>,
  textbox: <g><rect x="4" y="5" width="16" height="14" fill="#fff" stroke="#6B7280"/><path d="M8 9h8M12 9v7" stroke="#111" strokeWidth="1.6"/></g>,
  symbol: <text x="12" y="18" textAnchor="middle" fontSize="18" fontWeight="700" fill="#4B5563" fontFamily="Carlito, Calibri, sans-serif">Ω</text>,
  refresh: <g><path d="M19 8a8 8 0 10.5 8" stroke="#12A150" strokeWidth="2.4" fill="none" strokeLinecap="round"/><path d="M19 3v6h-6" stroke="#12A150" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>,
  datasrc: <g><ellipse cx="11" cy="6" rx="7" ry="3" fill="#BFD6F7" stroke="#2F6FEB"/><path d="M4 6v10c0 1.7 3 3 7 3s7-1.3 7-3V6" fill="none" stroke="#2F6FEB"/><path d="M15 18l5 3-1-5" stroke="#E5A000" strokeWidth="1.6" fill="none"/></g>,
  fclear: <g><path d="M5 15l7-9 7 7-5 6H8z" fill="#F9A8D4" stroke="#6B7280"/></g>,
  fselect: <g><rect x="4" y="4" width="16" height="16" stroke="#2F6FEB" strokeDasharray="3 2" fill="#E8F1FB"/></g>,
  fmove: <g><rect x="3" y="4" width="10" height="10" fill="#fff" stroke="#6B7280"/><path d="M12 16h8M17 13l3 3-3 3" stroke="#2F6FEB" strokeWidth="1.8" fill="none"/></g>,
  flist: <g><rect x="4" y="4" width="16" height="16" fill="#fff" stroke="#6B7280"/><path d="M7 8h2M7 12h2M7 16h2M11 8h6M11 12h6M11 16h6" stroke="#4B5563" strokeWidth="1.5"/></g>,
  plusm: <g><rect x="3" y="3" width="8" height="8" fill="#fff" stroke="#6B7280"/><path d="M5 7h4M7 5v4" stroke="#4B5563"/><rect x="3" y="13" width="8" height="8" fill="#fff" stroke="#6B7280"/><path d="M5 17h4" stroke="#4B5563"/></g>,
  hdrs: <g><rect x="3" y="5" width="18" height="14" fill="#fff" stroke="#6B7280"/><rect x="3" y="5" width="18" height="4" fill="#BFD6F7"/><rect x="3" y="9" width="5" height="10" fill="#DCE6F1"/></g>,
  grp: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#6B7280"/><path d="M7 9h10M7 13h6" stroke="#4B5563" strokeWidth="1.6"/><path d="M5 7v8" stroke="#2F6FEB" strokeWidth="2"/></g>,
  opts: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#6B7280"/><circle cx="12" cy="12" r="3.5" fill="#6B7280"/><circle cx="12" cy="12" r="1.4" fill="#fff"/></g>,
  subt: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#6B7280"/><path d="M3 9h18M3 15h18" stroke="#9CA3AF"/><rect x="3" y="15" width="18" height="5" fill="#BFD6F7"/></g>,
  grand: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#6B7280"/><path d="M3 9h18" stroke="#9CA3AF"/><rect x="3" y="15" width="18" height="5" fill="#2F6FEB"/></g>,
  layout: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#6B7280"/><path d="M9 4v16M3 10h18M3 15h18" stroke="#9CA3AF"/><rect x="3" y="4" width="6" height="6" fill="#BFD6F7"/></g>,
  blank: <g><rect x="3" y="4" width="18" height="16" fill="#fff" stroke="#6B7280"/><path d="M3 9h18M3 15h18" stroke="#9CA3AF"/><rect x="3" y="9" width="18" height="6" fill="#E5E7EB"/></g>,
  search: <g><circle cx="10" cy="10" r="5.5" stroke="#6B7280" strokeWidth="1.8" fill="none"/><path d="M14.5 14.5L20 20" stroke="#6B7280" strokeWidth="2" {...SW}/></g>,
  save: <g><path d="M4 4h13l3 3v13H4z" stroke="#4B5563" strokeWidth="1.6" fill="#fff" {...SW}/><rect x="8" y="4" width="7" height="5" fill="#9CA3AF"/><rect x="7" y="13" width="10" height="7" fill="#E5E7EB" stroke="#6B7280"/></g>,
  undo: <path d="M9 7L4 12l5 5M4 12h10a6 6 0 010 12" transform="translate(0 -4)" stroke="#4B5563" strokeWidth="1.8" {...SW}/>,
  redo: <path d="M15 7l5 5-5 5M20 12H10a6 6 0 000 12" transform="translate(0 -4)" stroke="#9CA3AF" strokeWidth="1.8" {...SW}/>,
};
const Ico: React.FC<{k: string; s?: number}> = ({k, s = 20}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{display: 'block'}}>{ICONS[k]}</svg>
);
const Caret: React.FC<{c?: string}> = ({c = '#555'}) => (
  <svg width="8" height="5" viewBox="0 0 8 5" style={{display: 'block'}}><path d="M0.5 0.5L4 4L7.5 0.5" stroke={c} strokeWidth="1.2" fill="none"/></svg>
);

// ---------- ribbon ----------
const lab: React.CSSProperties = {fontFamily: FONT.ui, fontSize: 11, color: '#323130', lineHeight: '13px', whiteSpace: 'nowrap'};
const A: React.FC<{x: number; y: number; w?: number; h?: number; children?: React.ReactNode; s?: React.CSSProperties}> = ({x, y, w, h, children, s}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...s}}>{children}</div>
);
const Row: React.FC<{k: string; label: string; x: number; y: number; caret?: boolean}> = ({k, label, x, y, caret}) => (
  <A x={x} y={y} s={{display: 'flex', alignItems: 'center', gap: 5, height: 20}}>
    <Ico k={k} s={16}/><span style={lab}>{label}</span>{caret ? <Caret/> : null}
  </A>
);
const Big: React.FC<{k: string; l1: string; l2?: string; x: number; w: number; caret?: boolean}> = ({k, l1, l2, x, w, caret}) => (
  <A x={x} y={4} w={w} h={62} s={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <Ico k={k} s={30}/>
    <span style={{...lab, marginTop: 4, textAlign: 'center'}}>{l1}</span>
    {l2 ? <span style={{...lab, textAlign: 'center'}}>{l2}</span> : null}
    {caret ? <div style={{marginTop: 2}}><Caret/></div> : null}
  </A>
);
const Group: React.FC<{x: number; w: number; label: string; children: React.ReactNode}> = ({x, w, label, children}) => (
  <div style={{position: 'absolute', left: x, top: 0, width: w, height: XL.ribbonH, borderRight: '1px solid #DADADA'}}>
    {children}
    <div style={{...lab, position: 'absolute', left: 0, width: w, top: 70, textAlign: 'center', color: '#605E5C'}}>{label}</div>
  </div>
);
const Box22: React.FC<{x: number; y: number; w: number; t: string}> = ({x, y, w, t}) => (
  <A x={x} y={y} w={w} h={22} s={{border: '1px solid #C8C6C4', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5px', boxSizing: 'border-box'}}>
    <span style={{fontFamily: FONT.cell, fontSize: 14, color: '#201F1E'}}>{t}</span><Caret/>
  </A>
);
const Ribbon: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: XL.titleH + XL.tabsH, width: XL.winW, height: XL.ribbonH, background: '#fff', borderBottom: `1px solid ${XL.chromeLine}`, borderTop: `1px solid ${XL.chromeLine}`, boxSizing: 'border-box'}}>
    <Group x={4} w={124} label="Clipboard">
      <Big k="paste" l1="Paste" x={2} w={44} caret/>
      <Row k="cut" label="Cut" x={52} y={4}/><Row k="copy" label="Copy" x={52} y={24} caret/><Row k="painter" label="Format Painter" x={52} y={44}/>
    </Group>
    <Group x={128} w={228} label="Font">
      <Box22 x={8} y={6} w={96} t="Calibri"/><Box22 x={108} y={6} w={38} t="11"/>
      <A x={152} y={7}><span style={{fontFamily: FONT.cell, fontSize: 17, fontWeight: 700, color: '#333'}}>A</span></A>
      <A x={172} y={10}><span style={{fontFamily: FONT.cell, fontSize: 13, fontWeight: 700, color: '#333'}}>A</span></A>
      <A x={8} y={36} s={{fontFamily: FONT.cell, fontSize: 16, fontWeight: 700, color: '#222'}}>B</A>
      <A x={28} y={36} s={{fontFamily: FONT.cell, fontSize: 16, fontStyle: 'italic', color: '#222'}}>I</A>
      <A x={46} y={36} s={{fontFamily: FONT.cell, fontSize: 16, textDecoration: 'underline', color: '#222'}}>U</A>
      <A x={70} y={36}><Ico k="border" s={18}/></A><A x={92} y={43}><Caret/></A>
      <A x={110} y={36}><Ico k="fill" s={18}/></A><A x={132} y={43}><Caret/></A>
      <A x={150} y={36}><Ico k="fcolor" s={18}/></A><A x={172} y={43}><Caret/></A>
    </Group>
    <Group x={356} w={232} label="Alignment">
      <A x={8} y={6}><Ico k="vT" s={18}/></A><A x={30} y={6}><Ico k="vM" s={18}/></A><A x={52} y={6}><Ico k="vB" s={18}/></A><A x={80} y={6}><Ico k="orient" s={18}/></A>
      <Row k="wrap" label="Wrap Text" x={110} y={5}/>
      <A x={8} y={36}><Ico k="aL" s={18}/></A><A x={30} y={36}><Ico k="aC" s={18}/></A><A x={52} y={36}><Ico k="aR" s={18}/></A>
      <A x={80} y={36}><Ico k="dedent" s={18}/></A><A x={102} y={36}><Ico k="indent" s={18}/></A>
      <Row k="merge" label="Merge & Center" x={126} y={35} caret/>
    </Group>
    <Group x={588} w={150} label="Number">
      <Box22 x={8} y={6} w={134} t="General"/>
      <A x={8} y={36}><Ico k="dollar" s={18}/></A><A x={28} y={43}><Caret/></A>
      <A x={46} y={36}><Ico k="pct" s={18}/></A><A x={68} y={36}><Ico k="comma" s={18}/></A>
      <A x={92} y={36}><Ico k="decP" s={18}/></A><A x={116} y={36}><Ico k="decM" s={18}/></A>
    </Group>
    <Group x={738} w={150} label="Styles">
      <Big k="cond" l1="Conditional" l2="Formatting" x={2} w={58} caret/>
      <Big k="table" l1="Format as" l2="Table" x={62} w={46} caret/>
      <Big k="styles" l1="Cell" l2="Styles" x={108} w={40} caret/>
    </Group>
    <Group x={888} w={100} label="Cells">
      <Row k="insert" label="Insert" x={8} y={4} caret/><Row k="delete" label="Delete" x={8} y={24} caret/><Row k="format" label="Format" x={8} y={44} caret/>
    </Group>
    <Group x={988} w={200} label="Editing">
      <Row k="sigma" label="AutoSum" x={8} y={4} caret/><Row k="fillDown" label="Fill" x={8} y={24} caret/><Row k="clear" label="Clear" x={8} y={44} caret/>
      <Big k="sort" l1="Sort &" l2="Filter" x={80} w={56} caret/>
      <Big k="find" l1="Find &" l2="Select" x={138} w={58} caret/>
    </Group>
    <A x={1224} y={66}><svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 5L5 1L9 5" stroke="#555" strokeWidth="1.3" fill="none"/></svg></A>
  </div>
);

// ---------- other ribbon tabs (Insert / PivotTable Analyze / Design) ----------
type RItem = {k: string; l: string; l2?: string; caret?: boolean; box?: number; ck?: boolean};
type RCol = {big?: RItem; small?: RItem[]; gallery?: boolean};
type RGrp = {label: string; cols: RCol[]};
const B = (k: string, l: string, l2?: string, caret?: boolean): RCol => ({big: {k, l, l2, caret}});
const SM = (...it: RItem[]): RCol => ({small: it});
const I = (k: string, l: string, caret?: boolean): RItem => ({k, l, caret});
const RIB: Record<string, RGrp[]> = {
  insert: [
    {label: 'Tables', cols: [B('pivot', 'PivotTable', undefined, true), B('recpivot', 'Recommended', 'PivotTables'), B('table', 'Table')]},
    {label: 'Illustrations', cols: [SM(I('pic', 'Pictures', true), I('shapes', 'Shapes', true), I('icons', 'Icons'))]},
    {label: 'Add-ins', cols: [SM(I('addin', 'Get Add-ins'), I('addin', 'My Add-ins', true))]},
    {label: 'Charts', cols: [B('chart', 'Recommended', 'Charts'), B('chart', 'Column or', 'Bar Chart', true), B('pchart', 'PivotChart', undefined, true)]},
    {label: 'Tours', cols: [B('map3d', '3D Map', undefined, true)]},
    {label: 'Sparklines', cols: [SM(I('spark', 'Line'), I('chart', 'Column'), I('chart', 'Win/Loss'))]},
    {label: 'Filters', cols: [B('slicer', 'Slicer'), B('timeline', 'Timeline')]},
    {label: 'Links', cols: [B('link', 'Link', undefined, true)]},
    {label: 'Comments', cols: [B('comment', 'Comment')]},
    {label: 'Text', cols: [B('textbox', 'Text', 'Box')]},
    {label: 'Symbols', cols: [B('symbol', 'Symbols', undefined, true)]},
  ],
  analyze: [
    {label: 'PivotTable', cols: [{small: [{k: 'pname', l: 'PivotTable1', box: 100}, I('opts', 'Options', true)]}]},
    {label: 'Active Field', cols: [{small: [{k: 'afield', l: 'Sum of Sales Amount', box: 140}, I('opts', 'Field Settings')]}]},
    {label: 'Group', cols: [SM(I('grp', 'Group Selection'), I('grp', 'Ungroup'), I('grp', 'Group Field'))]},
    {label: 'Filter', cols: [B('slicer', 'Insert', 'Slicer'), B('timeline', 'Insert', 'Timeline'), B('slicer', 'Filter', 'Connections')]},
    {label: 'Data', cols: [B('refresh', 'Refresh', undefined, true), B('datasrc', 'Change Data', 'Source', true)]},
    {label: 'Actions', cols: [SM(I('fclear', 'Clear', true), I('fselect', 'Select', true), I('fmove', 'Move PivotTable'))]},
    {label: 'Tools', cols: [B('pchart', 'PivotChart'), B('recpivot', 'Recommended', 'PivotTables')]},
    {label: 'Show', cols: [SM(I('flist', 'Field List'), I('plusm', '+/- Buttons'), I('hdrs', 'Field Headers'))]},
  ],
  design: [
    {label: 'Layout', cols: [B('subt', 'Subtotals', undefined, true), B('grand', 'Grand', 'Totals', true), B('layout', 'Report', 'Layout', true), B('blank', 'Blank', 'Rows', true)]},
    {label: 'PivotTable Style Options', cols: [{small: [{k: 'ck1', l: 'Row Headers', ck: true}, {k: 'ck2', l: 'Column Headers', ck: true}]}, {small: [{k: 'ck3', l: 'Banded Rows', ck: true}, {k: 'ck4', l: 'Banded Columns', ck: true}]}]},
    {label: 'PivotTable Styles', cols: [{gallery: true}]},
  ],
};
const colWd = (c: RCol) => (c.gallery ? 260 : c.big ? Math.max(46, Math.round(Math.max(c.big.l.length, (c.big.l2 ?? '').length) * 6.6 + 14)) : Math.round(Math.max(...(c.small ?? []).map((i) => i.box ?? i.l.length * 6.2 + 34)) + 6));
const RTOP = XL.titleH + XL.tabsH + 1;
export type BtnPos = {x: number; y: number; w: number; h: number};
export const ribbonLayout = (id: string) => {
  const pos: Record<string, BtnPos> = {};
  const groups: {x: number; w: number; g: RGrp}[] = [];
  let x = 4;
  for (const g of RIB[id]) {
    const gx = x;
    let cx = gx + 4;
    for (const c of g.cols) {
      const w = colWd(c);
      if (c.big) pos[c.big.k + (pos[c.big.k] ? '2' : '')] = {x: cx, y: RTOP + 4, w, h: 62};
      (c.small ?? []).forEach((it, i) => { pos[it.k + (pos[it.k] ? '2' : '')] = {x: cx, y: RTOP + 4 + i * 21, w, h: 20}; });
      cx += w;
    }
    groups.push({x: gx, w: cx - gx + 4, g});
    x = cx + 4;
  }
  return {groups, pos};
};
export const RibbonDyn: React.FC<{id: string; hi?: string}> = ({id, hi}) => {
  const {groups, pos} = ribbonLayout(id);
  const seen: Record<string, number> = {};
  const hl = (key: string) => (hi === key ? {background: '#CDE6F7', border: '1px solid #8FC2E9', boxSizing: 'border-box' as const, borderRadius: 3} : {});
  return (
    <div style={{position: 'absolute', left: 0, top: XL.titleH + XL.tabsH, width: XL.winW, height: XL.ribbonH, background: '#fff', borderBottom: `1px solid ${XL.chromeLine}`, borderTop: `1px solid ${XL.chromeLine}`, boxSizing: 'border-box'}}>
      {groups.map((gr, gi) => {
        let cx = gr.x + 4;
        return (
          <div key={gi} style={{position: 'absolute', left: gr.x, top: 0, width: gr.w, height: XL.ribbonH, borderRight: '1px solid #DADADA'}}>
            {gr.g.cols.map((c, ci) => {
              const w = colWd(c), left = cx - gr.x;
              cx += w;
              if (c.gallery) return (
                <div key={ci} style={{position: 'absolute', left, top: 8, width: w, height: 56, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 4}}>
                  {['#2F6FEB', '#E5A000', '#12A150', '#8E4EC6', '#E5484D', '#6B7280', '#2F6FEB', '#E5A000', '#12A150', '#8E4EC6', '#E5484D', '#6B7280'].map((cc, i) => <div key={i} style={{border: '1px solid #C8C6C4', background: '#fff', display: 'flex', flexDirection: 'column'}}><div style={{height: 7, background: cc}}/><div style={{flex: 1, background: `${cc}22`}}/></div>)}
                </div>
              );
              if (c.big) {
                const k = c.big.k + (seen[c.big.k] ? '2' : ''); seen[c.big.k] = 1;
                return (
                  <div key={ci} style={{position: 'absolute', left, top: 4, width: w, height: 62, display: 'flex', flexDirection: 'column', alignItems: 'center', ...hl(k)}}>
                    <div style={{marginTop: 3}}><Ico k={c.big.k} s={30}/></div>
                    <span style={{...lab, marginTop: 3}}>{c.big.l}</span>
                    {c.big.l2 ? <span style={lab}>{c.big.l2}</span> : null}
                    {c.big.caret ? <div style={{marginTop: 2}}><Caret/></div> : null}
                  </div>
                );
              }
              return (
                <div key={ci}>
                  {(c.small ?? []).map((it, i) => {
                    const k = it.k + (seen[it.k] ? '2' : ''); seen[it.k] = 1;
                    return (
                      <div key={i} style={{position: 'absolute', left, top: 4 + i * 21, width: w, height: 20, display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4, boxSizing: 'border-box', ...hl(k)}}>
                        {it.box ? <div style={{width: it.box, height: 18, border: '1px solid #C8C6C4', background: '#fff', ...lab, lineHeight: '16px', paddingLeft: 4, boxSizing: 'border-box'}}>{it.l}</div>
                          : it.ck ? <span style={{display: 'flex', alignItems: 'center', gap: 6}}><svg width="13" height="13" viewBox="0 0 13 13"><rect x="0.5" y="0.5" width="12" height="12" fill="#fff" stroke="#6B7280"/>{it.k !== 'ck4' ? <path d="M3 6.5l2.5 2.5L10 4" stroke="#217346" strokeWidth="1.6" fill="none"/> : null}</svg><span style={lab}>{it.l}</span></span>
                          : <span style={{display: 'flex', alignItems: 'center', gap: 5}}><Ico k={it.k} s={16}/><span style={lab}>{it.l}</span>{it.caret ? <Caret/> : null}</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div style={{...lab, position: 'absolute', left: 0, width: gr.w, top: 70, textAlign: 'center', color: '#605E5C'}}>{gr.g.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- title bar + tabs ----------
const TABS = ['File', 'Home', 'Insert', 'Draw', 'Page Layout', 'Formulas', 'Data', 'Review', 'View', 'Automate', 'Help'];
const TitleBar: React.FC<{file: string}> = ({file}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: XL.winW, height: XL.titleH, background: XL.titleBg, fontFamily: FONT.ui, fontSize: 12, color: '#323130'}}>
    <A x={10} y={7}><svg width="18" height="18" viewBox="0 0 18 18"><rect width="18" height="18" rx="3" fill={XL.green}/><path d="M4 6h10M4 9h10M4 12h10M8 4v10" stroke="#fff" strokeWidth="1.1"/></svg></A>
    <A x={38} y={8} s={{display: 'flex', alignItems: 'center', gap: 6}}>
      <span>AutoSave</span>
      <svg width="32" height="16" viewBox="0 0 32 16"><rect x="0.5" y="0.5" width="31" height="15" rx="7.5" fill="#fff" stroke="#6B7280"/><circle cx="8" cy="8" r="4" fill="#6B7280"/></svg>
      <span>Off</span>
    </A>
    <A x={150} y={7}><Ico k="save" s={18}/></A><A x={176} y={7}><Ico k="undo" s={18}/></A><A x={200} y={7}><Ico k="redo" s={18}/></A>
    <A x={232} y={8} s={{fontWeight: 600, whiteSpace: 'nowrap'}}>{file} <span style={{fontWeight: 400, color: '#605E5C'}}>• Saved</span></A>
    <A x={454} y={5} w={340} h={22} s={{background: '#fff', border: '1px solid #C8C6C4', borderRadius: 4, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', color: '#605E5C'}}>
      <Ico k="search" s={14}/><span>Search</span>
    </A>
    <A x={XL.winW - 292} y={5} w={64} h={22} s={{border: `1px solid ${XL.green}`, color: XL.green, borderRadius: 4, boxSizing: 'border-box', textAlign: 'center', lineHeight: '20px', fontWeight: 600}}>Share</A>
    {['M0 8h10', 'M0.5 0.5h9v9h-9z', 'M0 0l10 10M10 0L0 10'].map((d, i) => (
      <A key={i} x={XL.winW - 138 + i * 46} y={0} w={46} h={XL.titleH} s={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="10" height="10" viewBox="0 0 10 10"><path d={d} stroke="#333" strokeWidth="1" fill="none"/></svg>
      </A>
    ))}
  </div>
);
const CTX_TABS = ['PivotTable Analyze', 'Design'];
const tw = (l: string) => (l === 'File' ? 48 : Math.round(l.length * 7 + 24));
export const tabRect = (i: number, ctx: boolean) => {
  const labs = ctx ? [...TABS, ...CTX_TABS] : TABS;
  let x = 6;
  for (let k = 0; k < i; k++) x += tw(labs[k]) + (k === 0 ? 4 : 0);
  return {x, y: XL.titleH, w: tw(labs[i]), h: XL.tabsH};
};
const TabsBar: React.FC<{tab: number; ctx: boolean}> = ({tab, ctx}) => {
  const labs = ctx ? [...TABS, ...CTX_TABS] : TABS;
  return (
    <div style={{position: 'absolute', left: 0, top: XL.titleH, width: XL.winW, height: XL.tabsH, background: XL.chrome, fontFamily: FONT.ui, fontSize: 12.5, color: '#323130'}}>
      {labs.map((t, i) => {
        const r = tabRect(i, ctx);
        return (
          <div key={t} style={{position: 'absolute', left: r.x, top: 2, width: r.w, height: 26, textAlign: 'center', lineHeight: '24px', fontWeight: i === tab ? 600 : 400, color: i === 0 ? '#fff' : undefined, background: i === 0 ? XL.green : undefined, borderRadius: i === 0 ? '3px 3px 0 0' : 0, whiteSpace: 'nowrap'}}>
            {t}
            {i === tab ? <div style={{position: 'absolute', left: 9, right: 9, bottom: 0, height: 3, background: XL.green, borderRadius: 2}}/> : null}
          </div>
        );
      })}
    </div>
  );
};

// ---------- overlays ----------
export const Box: React.FC<{r: Rect | null; c: string; w?: number; glow?: number; fill?: string; dash?: boolean; pad?: number}> = ({r, c, w = 2, glow = 0, fill, dash, pad = 0}) =>
  r ? (
    <div style={{position: 'absolute', left: r.x - pad, top: r.y - pad, width: r.w + pad * 2, height: r.h + pad * 2, boxSizing: 'border-box', border: `${w}px ${dash ? 'dashed' : 'solid'} ${c}`, background: fill, boxShadow: glow ? `0 0 ${12 * glow}px ${c}, inset 0 0 ${8 * glow}px ${c}55` : undefined, pointerEvents: 'none'}}/>
  ) : null;
export const Band: React.FC<{r: Rect | null; c: string; op: number}> = ({r, c, op}) =>
  r ? <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, background: c, opacity: op}}/> : null;
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; c: string; w?: number; p?: number; glow?: boolean}> = ({x1, y1, x2, y2, c, w = 3, p = 1, glow = true}) => {
  if (p <= 0) return null;
  const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
  const ang = Math.atan2(y2 - y1, x2 - x1), hl = 11;
  const hx = (a: number) => ex - hl * Math.cos(ang + a), hy = (a: number) => ey - hl * Math.sin(ang + a);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none'}}>
      <g style={{filter: glow ? `drop-shadow(0 0 4px ${c})` : undefined}}>
        <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={c} strokeWidth={w} strokeLinecap="round"/>
        <polygon points={`${ex},${ey} ${hx(0.5)},${hy(0.5)} ${hx(-0.5)},${hy(-0.5)}`} fill={c}/>
      </g>
    </svg>
  );
};
export const Lock: React.FC<{x: number; y: number; s?: number; closed: number; c: string}> = ({x, y, s = 26, closed, c}) => {
  const lift = (1 - closed) * 7;
  return (
    <svg style={{position: 'absolute', left: x - s / 2, top: y - s / 2, filter: `drop-shadow(0 0 5px ${c})`}} width={s} height={s} viewBox="0 0 24 24">
      <path d={`M7 11V${8 - lift / 2}a5 5 0 0110 0V11`} transform={`translate(0 ${-lift})`} stroke={c} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <rect x="4" y="11" width="16" height="11" rx="2.5" fill={c}/>
      <circle cx="12" cy="16" r="1.8" fill="#0F172A"/>
    </svg>
  );
};
export const Seal: React.FC<{x: number; y: number; s: number; p: number}> = ({x, y, s, p}) => (
  <svg style={{position: 'absolute', left: x - s / 2, top: y - s / 2, opacity: p, transform: `scale(${0.6 + 0.4 * p})`, filter: `drop-shadow(0 0 14px ${COL.green})`}} width={s} height={s} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="none" stroke={COL.green} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.7"/>
    <path d="M50 10l30 10v24c0 21-13 36-30 44-17-8-30-23-30-44V20z" fill="#052E1F" stroke={COL.green} strokeWidth="3"/>
    <path d="M34 50l11 11 22-24" stroke={COL.green} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const Ants: React.FC<{r: Rect | null}> = ({r}) => {
  const f = useCurrentFrame();
  if (!r) return null;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
      <rect x={r.x + 1} y={r.y + 1} width={r.w - 2} height={r.h - 2} fill="none" stroke="#fff" strokeWidth="2"/>
      <rect x={r.x + 1} y={r.y + 1} width={r.w - 2} height={r.h - 2} fill="none" stroke={XL.green} strokeWidth="2" strokeDasharray="5 4" strokeDashoffset={-f * 0.7}/>
    </svg>
  );
};
const CursorG: React.FC<{c: Cur}> = ({c}) => (
  <svg style={{position: 'absolute', left: c.x - (c.k === 'cross' ? 9 : 1), top: c.y - (c.k === 'cross' ? 9 : 1), pointerEvents: 'none', filter: 'drop-shadow(1px 2px 1.5px rgba(0,0,0,.35))'}} width="20" height="26" viewBox="0 0 20 26">
    {c.k === 'cross'
      ? <g><path d="M9 1v16M1 9h16" stroke="#fff" strokeWidth="4"/><path d="M9 2v14M2 9h14" stroke="#111" strokeWidth="1.6"/></g>
      : <path d="M2 1v17l4.2-4 3 7.2 2.6-1.1-3-7H15z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round"/>}
  </svg>
);

// ---------- the Excel window ----------
export const ExcelWindow: React.FC<{v: View; tab?: number}> = ({v, tab: tabProp = 1}) => {
  const tab = v.tab ?? tabProp;
  const PW = v.paneW ?? 0;
  const hw = v.hw ?? XL.rowHdrW;
  const SHEETS = v.sheets ?? ['Sales', 'Mixed', 'Matrix'];
  const {rowH, colW} = XL;
  const WID = (c: number) => v.widths?.[c] ?? colW;
  const xs: number[] = [hw];
  for (let c = 0; c < 60; c++) xs.push(xs[c] + WID(c));
  const nScroll = v.freeze ? XL.visRows - 1 : XL.visRows;
  const first = v.top, last = v.top + nScroll - 1;
  const rows: number[] = [];
  if (v.freeze) rows.push(1);
  for (let r = first; r <= last; r++) rows.push(r);
  const ry = (r: number): number | null => (v.freeze && r === 1 ? 0 : r >= first && r <= last ? (r - first + (v.freeze ? 1 : 0)) * rowH : null);
  const vis = (r: number) => ry(r) !== null;
  const rect = (r1: number, c1: number, r2: number, c2: number): Rect | null => {
    if (!vis(r1) && !vis(r2) && ((r1 < first && r2 < first && !(v.freeze && (r1 === 1 || r2 === 1))) || (r1 > last && r2 > last))) return null;
    const a = vis(r1) ? r1 : r1 < first ? first : last;
    const b = vis(r2) ? r2 : r2 < first ? first : last;
    const ya = ry(a) as number, yb = ry(b) as number;
    return {x: xs[c1], y: Math.min(ya, yb), w: xs[c2 + 1] - xs[c1], h: Math.abs(yb - ya) + rowH};
  };
  const g: Geo = {hw, rect, cell: (r, c) => rect(r, c, r, c), cx: (c) => xs[c]};
  const gy = XL.titleH + XL.tabsH + XL.ribbonH + XL.fbarH; // top of column headers
  const gridW = XL.winW - XL.vscroll - PW;
  const sel = v.sel;
  const ed = v.edit;
  const nameTxt = v.name ?? (sel ? colName(sel.ac) + sel.ar : 'A1');
  const mode = v.mode ?? (ed ? 'Enter' : 'Ready');
  const cur = v.cursor ? v.cursor(g) : null;
  const colSel = (c: number) => !!sel && c >= Math.min(sel.c1, sel.c2) && c <= Math.max(sel.c1, sel.c2);
  const rowSel = (r: number) => !!sel && r >= Math.min(sel.r1, sel.r2) && r <= Math.max(sel.r1, sel.r2);
  let nCols = 0;
  while (nCols < 59 && xs[nCols] < gridW) nCols++;
  const cells: React.ReactNode[] = [];
  for (const r of rows) {
    const y = ry(r) as number;
    for (let c = 0; c < nCols; c++) {
      if (ed && ed.r === r && ed.c === c) continue;
      const s = v.cell(r, c);
      if (!s) continue;
      const txt = v.showF && s.f ? s.f : s.t;
      const al = s.al ?? (/^-?[\d.,]+%?$/.test(s.t) ? 'r' : 'l');
      const x = xs[c];
      const wide = s.ovf ? 120 : 0;
      cells.push(
        <div key={`${r}_${c}`} style={{position: 'absolute', left: al === 'r' && s.ovf ? x - wide : x, top: y, width: WID(c) + wide, height: rowH, boxSizing: 'border-box', padding: s.ind ? `0 3px 0 ${3 + s.ind}px` : '0 3px', borderTop: s.bt ? `2px solid ${s.bt}` : undefined, borderBottom: s.bb ? `2px solid ${s.bb}` : undefined, background: s.ovf ? undefined : s.bg, color: s.col ?? '#000', fontFamily: FONT.cell, fontSize: 14.67, lineHeight: `${rowH - 1}px`, fontWeight: s.b ? 700 : 400, fontStyle: s.i ? 'italic' : undefined, textAlign: al === 'r' ? 'right' : al === 'c' ? 'center' : 'left', whiteSpace: s.pre ? 'pre' : 'nowrap', overflow: s.ovf ? 'visible' : 'hidden'}}>
          {s.ovf && s.bg ? <div style={{position: 'absolute', left: al === 'r' ? wide : 0, top: 0, width: WID(c), height: rowH, background: s.bg, zIndex: -1}}/> : null}
          {txt}
          {s.dd ? <div style={{position: 'absolute', right: 2, top: 2, width: 15, height: 15, background: '#F3F3F3', border: '1px solid #A6A6A6', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="8" height="5" viewBox="0 0 8 5"><path d="M0 0h8L4 5z" fill="#444"/></svg></div> : null}
          {s.tri ? <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, borderTop: '6px solid #1E8E3E', borderRight: '6px solid transparent'}}/> : null}
        </div>,
      );
    }
  }
  // selection
  const selR = sel ? rect(sel.r1, sel.c1, sel.r2, sel.c2) : null;
  const actR = sel ? rect(sel.ar, sel.ac, sel.ar, sel.ac) : null;
  const multi = sel && (sel.r1 !== sel.r2 || sel.c1 !== sel.c2);
  const tint = XL.tint;
  const bands: React.ReactNode[] = [];
  if (selR && actR && multi && !ed) {
    const bx = [
      {x: selR.x, y: selR.y, w: selR.w, h: actR.y - selR.y},
      {x: selR.x, y: actR.y + actR.h, w: selR.w, h: selR.y + selR.h - actR.y - actR.h},
      {x: selR.x, y: actR.y, w: actR.x - selR.x, h: actR.h},
      {x: actR.x + actR.w, y: actR.y, w: selR.x + selR.w - actR.x - actR.w, h: actR.h},
    ];
    bx.forEach((b, i) => b.w > 0 && b.h > 0 && bands.push(<div key={i} style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, background: tint}}/>));
  }
  const edRect = ed ? rect(ed.r, ed.c, ed.r, ed.c) : null;
  const edRefs = ed ? refsOf(ed.text) : [];
  const edW = ed ? Math.max(colW, ed.text.length * 7.6 + 10) : 0;
  const thumb = v.vs ?? {pos: 0, size: 0.2};
  const sbH = 340 - 34;
  return (
    <div style={{position: 'relative', width: XL.winW, height: XL.winH, background: '#fff', overflow: 'hidden', fontFamily: FONT.ui}}>
      <TitleBar file={v.file}/>
      <TabsBar tab={tab} ctx={!!v.ctx}/>
      {v.ribbon && v.ribbon !== 'home' ? <RibbonDyn id={v.ribbon} hi={v.hi}/> : <Ribbon/>}
      {/* formula bar */}
      <div style={{position: 'absolute', left: 0, top: XL.titleH + XL.tabsH + XL.ribbonH, width: XL.winW - PW, height: XL.fbarH, background: '#fff', borderBottom: `1px solid ${XL.chromeLine}`, boxSizing: 'border-box'}}>
        <A x={4} y={2} w={104} h={20} s={{border: '1px solid #C8C6C4', boxSizing: 'border-box', fontFamily: FONT.cell, fontSize: 14, padding: '0 6px', lineHeight: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><span>{nameTxt}</span><Caret/></A>
        <A x={118} y={4}><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke={ed ? '#444' : '#B3B0AD'} strokeWidth="1.5"/></svg></A>
        <A x={140} y={4}><svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7.5l3.5 3.5L12 3.5" stroke={ed ? XL.green : '#B3B0AD'} strokeWidth="1.6" fill="none"/></svg></A>
        <A x={162} y={2} s={{fontFamily: FONT.cell, fontStyle: 'italic', fontSize: 15, color: '#555', fontWeight: 700}}>fx</A>
        <A x={186} y={2} w={XL.winW - PW - 214} h={20} s={{borderLeft: '1px solid #C8C6C4', paddingLeft: 6, boxSizing: 'border-box', fontFamily: FONT.cell, fontSize: 14.67, lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {ed ? <span><FormulaText text={ed.text}/>{ed.caret ? <span style={{borderLeft: '1px solid #000', marginLeft: 1}}/> : null}</span> : <span>{v.fb ?? ''}</span>}
        </A>
        <A x={XL.winW - PW - 22} y={8}><Caret/></A>
      </div>
      {/* grid area */}
      <div style={{position: 'absolute', left: 0, top: gy, width: gridW, height: XL.colHdrH + rowH * XL.visRows, overflow: 'hidden', background: '#fff'}}>
        {/* column headers */}
        <div style={{position: 'absolute', left: 0, top: 0, width: gridW, height: XL.colHdrH, background: XL.hdrBg, borderBottom: `1px solid #C8C6C4`, boxSizing: 'border-box'}}>
          <svg style={{position: 'absolute', right: 0, bottom: 0, left: 0}} width={hw} height={XL.colHdrH}><path d={`M${hw - 4} ${XL.colHdrH - 4}V${XL.colHdrH - 14}L${hw - 14} ${XL.colHdrH - 4}z`} fill="#B5B5B5"/></svg>
          {Array.from({length: nCols}, (_, c) => (
            <div key={c} style={{position: 'absolute', left: xs[c], top: 0, width: WID(c), height: XL.colHdrH, boxSizing: 'border-box', borderLeft: '1px solid #D4D4D4', textAlign: 'center', lineHeight: `${XL.colHdrH - 1}px`, fontFamily: FONT.cell, fontSize: 14, color: colSel(c) ? XL.green : XL.hdrText, background: colSel(c) ? XL.greenSoft : undefined, borderBottom: colSel(c) ? `2px solid ${XL.green}` : undefined}}>{colName(c)}</div>
          ))}
        </div>
        {/* rows area */}
        <div style={{position: 'absolute', left: 0, top: XL.colHdrH, width: gridW, height: rowH * XL.visRows, overflow: 'hidden', backgroundImage: v.widths ? `linear-gradient(to bottom, transparent ${rowH - 1}px, ${XL.grid} ${rowH - 1}px)` : `linear-gradient(to right, transparent ${colW - 1}px, ${XL.grid} ${colW - 1}px), linear-gradient(to bottom, transparent ${rowH - 1}px, ${XL.grid} ${rowH - 1}px)`, backgroundSize: v.widths ? `100% ${rowH}px` : `${colW}px 100%, 100% ${rowH}px`, backgroundPosition: v.widths ? '0 0' : `${hw}px 0, 0 0`}}>
          {v.widths ? Array.from({length: nCols}, (_, c) => <div key={`v${c}`} style={{position: 'absolute', left: xs[c + 1] - 1, top: 0, width: 1, height: '100%', background: XL.grid}}/>) : null}
          <div style={{position: 'absolute', left: 0, top: 0, width: hw, height: '100%', background: XL.hdrBg, borderRight: '1px solid #C8C6C4', boxSizing: 'border-box'}}/>
          {rows.map((r) => (
            <div key={`h${r}`} style={{position: 'absolute', left: 0, top: ry(r) as number, width: hw, height: rowH, boxSizing: 'border-box', borderBottom: '1px solid #D4D4D4', textAlign: 'center', lineHeight: `${rowH - 1}px`, fontFamily: FONT.cell, fontSize: 14, color: rowSel(r) ? XL.green : XL.hdrText, background: rowSel(r) ? XL.greenSoft : XL.hdrBg, borderRight: rowSel(r) ? `2px solid ${XL.green}` : '1px solid #C8C6C4'}}>{r}</div>
          ))}
          {cells}
          {v.freeze ? <div style={{position: 'absolute', left: 0, top: rowH - 1, width: '100%', height: 1, background: '#7A7A7A'}}/> : null}
          {bands}
          {edRect && ed ? (
            <div style={{position: 'absolute', left: edRect.x, top: edRect.y, width: edW, height: rowH, background: '#fff', boxSizing: 'border-box', border: `2px solid ${XL.green}`, fontFamily: FONT.cell, fontSize: 14.67, lineHeight: `${rowH - 4}px`, padding: '0 2px', whiteSpace: 'nowrap', zIndex: 3}}>
              <FormulaText text={ed.text}/>{ed.caret ? <span style={{borderLeft: '1px solid #000', marginLeft: 1}}/> : null}
            </div>
          ) : null}
          {ed ? edRefs.map((tk, i) => { const p = parseRef(tk); const rr = p && p.c < 50 ? rect(p.r, p.c, p.r, p.c) : null; return rr ? <Box key={i} r={rr} c={XL.refColors[i % XL.refColors.length]} w={2}/> : null; }) : null}
          {selR && !ed ? <Box r={selR} c={XL.green} w={2}/> : null}
          {selR && actR && !ed && (sel?.handle ?? true) ? <div style={{position: 'absolute', left: selR.x + selR.w - 5, top: selR.y + selR.h - 5, width: 7, height: 7, background: XL.green, border: '1px solid #fff', boxSizing: 'border-box', zIndex: 4}}/> : null}
          {v.ov ? v.ov(g) : null}
        </div>
      </div>
      {v.pane ? <div style={{position: 'absolute', left: XL.winW - PW, top: XL.titleH + XL.tabsH + XL.ribbonH, width: PW, height: XL.winH - XL.statusH - (XL.titleH + XL.tabsH + XL.ribbonH), background: '#fff', borderLeft: '1px solid #D1D1D1', overflow: 'hidden'}}>{v.pane}</div> : null}
      {v.layer ? <div style={{position: 'absolute', left: 0, top: 0, width: XL.winW, height: XL.winH, zIndex: 15, pointerEvents: 'none'}}>{v.layer}</div> : null}
      {cur ? <div style={{position: 'absolute', left: 0, top: gy + XL.colHdrH, width: XL.winW, height: 0, overflow: 'visible', zIndex: 20}}><CursorG c={cur}/></div> : null}
      {/* vertical scrollbar */}
      <div style={{position: 'absolute', left: gridW, top: gy, width: XL.vscroll, height: 340, background: '#F0F0F0', borderLeft: '1px solid #DADADA', boxSizing: 'border-box'}}>
        <svg width="16" height="10" style={{position: 'absolute', left: 0, top: 4}}><path d="M4 7l4-4 4 4" stroke="#777" strokeWidth="1.4" fill="none"/></svg>
        <div style={{position: 'absolute', left: 3, width: 10, top: 17 + thumb.pos * (sbH - 17), height: Math.max(14, thumb.size * sbH), background: '#C1C1C1', borderRadius: 2}}/>
        <svg width="16" height="10" style={{position: 'absolute', left: 0, bottom: 4}}><path d="M4 3l4 4 4-4" stroke="#777" strokeWidth="1.4" fill="none"/></svg>
      </div>
      {/* sheet tabs bar */}
      <div style={{position: 'absolute', left: 0, top: gy + 340, width: XL.winW - PW, height: XL.sheetBarH, background: '#F3F3F3', borderTop: `1px solid ${XL.chromeLine}`, boxSizing: 'border-box', fontFamily: FONT.ui, fontSize: 12}}>
        <A x={8} y={7}><svg width="40" height="10"><path d="M6 1L2 5l4 4M30 1l4 4-4 4" stroke="#8A8A8A" strokeWidth="1.4" fill="none"/></svg></A>
        {SHEETS.map((s, i) => {
          const x = 54 + SHEETS.slice(0, i).reduce((a, n) => a + n.length * 7.2 + 28, 0);
          const act = i === v.sheet;
          return (
            <A key={s} x={x} y={0} w={s.length * 7.2 + 24} h={23} s={{background: act ? '#fff' : undefined, borderBottom: act ? `3px solid ${XL.green}` : undefined, color: act ? XL.green : '#444', fontWeight: act ? 700 : 400, textAlign: 'center', lineHeight: '22px', boxSizing: 'border-box', boxShadow: act ? '0 0 0 1px #DADADA' : undefined}}>{s}</A>
          );
        })}
        <A x={54 + SHEETS.reduce((a, n) => a + n.length * 7.2 + 28, 0) + 2} y={3}><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill="none" stroke="#8A8A8A"/><path d="M9 5v8M5 9h8" stroke="#555" strokeWidth="1.3"/></svg></A>
        <A x={XL.winW - PW - 330} y={7} w={310} h={10} s={{background: '#E6E6E6', borderRadius: 2}}><div style={{position: 'absolute', left: 6, top: 1, width: 120, height: 8, background: '#C1C1C1', borderRadius: 2}}/></A>
      </div>
      {/* status bar */}
      <div style={{position: 'absolute', left: 0, top: XL.winH - XL.statusH, width: XL.winW, height: XL.statusH, background: '#F3F3F3', borderTop: `1px solid ${XL.chromeLine}`, boxSizing: 'border-box', fontFamily: FONT.ui, fontSize: 12, color: '#323130'}}>
        <A x={12} y={4} s={{whiteSpace: 'nowrap'}}>{mode}</A>
        <A x={84} y={3} s={{display: 'flex', alignItems: 'center', gap: 6, color: '#605E5C', whiteSpace: 'nowrap'}}><svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="none" stroke="#6B7280"/><path d="M4 7.2l2 2 4-4.4" stroke="#6B7280" strokeWidth="1.3" fill="none"/></svg>Accessibility: Good to go</A>
        {v.stats ? (
          <A x={520} y={4} s={{display: 'flex', gap: 22, whiteSpace: 'nowrap'}}>
            <span>Average: {v.stats.avg}</span><span>Count: {v.stats.cnt}</span><span>Sum: {v.stats.sum}</span>
          </A>
        ) : null}
        <A x={XL.winW - 250} y={4} s={{display: 'flex', alignItems: 'center', gap: 12}}>
          <svg width="52" height="14" viewBox="0 0 52 14"><rect x="1" y="1" width="14" height="12" fill="#fff" stroke="#6B7280"/><rect x="19" y="1" width="14" height="12" fill="none" stroke="#9CA3AF"/><rect x="37" y="1" width="14" height="12" fill="none" stroke="#9CA3AF"/><path d="M1 5h14M8 1v12" stroke="#9CA3AF"/></svg>
          <svg width="96" height="14" viewBox="0 0 96 14"><path d="M2 7h8M84 7h8M88 3v8" stroke="#6B7280" strokeWidth="1.2"/><path d="M16 7h60" stroke="#9CA3AF"/><rect x="44" y="2" width="4" height="10" fill="#6B7280"/></svg>
          <span>100%</span>
        </A>
      </div>
    </div>
  );
};

// ---------- stage pieces (outside the Excel window: typography never overlaps artwork) ----------
export const StageBg: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(1200px 700px at 70% 10%, #16233F 0%, ${COL.slate} 60%)`}}>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.5}}>
      <defs><pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#1E293B"/></pattern></defs>
      <rect width="1920" height="1080" fill="url(#dots)"/>
    </svg>
  </div>
);
export const Logo: React.FC<{h: number; op?: number}> = ({h, op = 1}) => (
  <Img src={staticFile(LOGO_FILE)} style={{height: h, width: 'auto', filter: 'invert(1)', opacity: op}}/>
);
export const ExcelFrame: React.FC<{children: React.ReactNode; tx?: number; ty?: number; sc?: number; op?: number; zoom?: number; zx?: number; zy?: number}> = ({children, tx = 0, ty = 0, sc = 1, op = 1, zoom = 1, zx = 0, zy = 0}) => (
  <div style={{position: 'absolute', left: XL.winX, top: XL.winY, width: XL.winW * XL.scale, height: XL.winH * XL.scale, transform: `translate(${tx}px, ${ty}px) scale(${sc})`, opacity: op, borderRadius: 10, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.55), 0 0 0 1px #334155'}}>
    <div style={{width: XL.winW, height: XL.winH, transform: `scale(${XL.scale})`, transformOrigin: '0px 0px'}}>
      <div style={{width: XL.winW, height: XL.winH, transform: `scale(${zoom})`, transformOrigin: `${zx}px ${zy}px`}}>{children}</div>
    </div>
  </div>
);
const TONE = {blue: COL.blue, green: COL.green, red: COL.red, amber: COL.amber, purple: COL.purple};
export type Tone = keyof typeof TONE;
export const fade = (f: number, a: number, b: number, io = 12) => Math.min(pg(f, a, a + io), 1 - pg(f, b - io, b));
export const TopBadge: React.FC<{f: number; a: number; b: number; ar: string; en: string}> = ({f, a, b, ar, en}) => {
  const o = fade(f, a, b, 14);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 140, width: 1360, top: 12, height: 76, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: o, transform: `translateY(${(1 - o) * -14}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '8px 30px', background: COL.panel, border: '1px solid #334155', borderRadius: 16, boxShadow: `0 0 0 2px ${COL.blue}22, 0 10px 30px rgba(0,0,0,.4)`}}>
        <span dir="rtl" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 36, color: COL.text, whiteSpace: 'nowrap'}}>{ar}</span>
        <span style={{width: 3, height: 34, background: COL.blue, borderRadius: 2}}/>
        <span dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: 30, color: COL.blue, whiteSpace: 'nowrap'}}>{en}</span>
      </div>
    </div>
  );
};
export const Caption: React.FC<{f: number; a: number; b: number; text: string; tone: Tone; tag?: {t: string; tone: Tone}}> = ({f, a, b, text, tone, tag}) => {
  const o = fade(f, a, b, 12);
  if (o <= 0) return null;
  const ci = text.indexOf('──►');
  const l = text.slice(0, ci).trim();
  const r = text.slice(ci + 3).trim();
  const c = TONE[tone];
  const lg = text.length > 70;
  return (
    <div dir="ltr" style={{position: 'absolute', left: 48, top: 978, height: 84, display: 'flex', alignItems: 'center', gap: 18, opacity: o, transform: `translateY(${(1 - o) * 16}px)`}}>
      <div style={{width: 6, height: 62, background: c, borderRadius: 3, boxShadow: `0 0 14px ${c}`}}/>
      <span style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: lg ? 27 : 32, color: c, background: `${c}1F`, border: `1.5px solid ${c}66`, borderRadius: 10, padding: '6px 16px', whiteSpace: 'nowrap'}}>{l}</span>
      <svg width="46" height="20" viewBox="0 0 46 20"><path d="M2 10h38M32 3l9 7-9 7" stroke={COL.muted} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span style={{fontFamily: FONT.ar, fontWeight: 500, fontSize: lg ? 29 : 34, color: COL.text, whiteSpace: 'nowrap'}}>{r}</span>
      {tag ? <span style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 26, color: TONE[tag.tone], background: `${TONE[tag.tone]}22`, border: `1.5px solid ${TONE[tag.tone]}`, borderRadius: 999, padding: '4px 18px', whiteSpace: 'nowrap'}}>{tag.t}</span> : null}
    </div>
  );
};
export const KeyCap: React.FC<{label: string; down?: boolean; c?: string; w?: number}> = ({label, down, c = COL.text, w = 88}) => (
  <div style={{width: w, height: 64, borderRadius: 12, background: down ? '#1B2638' : '#273449', border: `2px solid ${down ? COL.amber : '#475569'}`, boxShadow: down ? `0 2px 0 #0B1220, 0 0 18px ${COL.amber}66` : '0 7px 0 #0B1220', transform: `translateY(${down ? 5 : 0}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.mono, fontWeight: 700, fontSize: 28, color: c}}>{label}</div>
);
export const CycleRow: React.FC<{states: string[]; idx: number; c: string}> = ({states, idx, c}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
    {states.map((s, i) => (
      <div key={s} style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <span style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, padding: '6px 14px', borderRadius: 10, color: i === idx ? '#0F172A' : COL.muted, background: i === idx ? c : '#1E293B', border: `1.5px solid ${i === idx ? c : '#334155'}`, boxShadow: i === idx ? `0 0 16px ${c}88` : undefined}}>{s}</span>
        {i < states.length - 1 ? <svg width="18" height="12"><path d="M1 6h14M11 2l5 4-5 4" stroke={COL.muted} strokeWidth="1.8" fill="none"/></svg> : null}
      </div>
    ))}
  </div>
);
