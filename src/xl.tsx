// Excel-like (Microsoft 365 desktop, Windows, modern look) interface drawn in pure 2D SVG/HTML.
// No Microsoft logo or licensed icon is used: all glyphs are generic drawings with the same meaning/position.
// Every measurement lives in XL (logical px at 100% Windows scale) so all lessons share the same grid.
import React from 'react';
import {continueRender, delayRender, useCurrentFrame} from 'remotion';
import {CARLITO_BOLD, CARLITO_REGULAR} from './fonts/carlitoData';
import {CELLFONT, UIFONT} from './theme';

export const XL = {
  W: 1536, H: 672,                 // logical app size (scaled to the video window by SCALE)
  SCALE: 1760 / 1536,
  title: 32, tabs: 32, ribbon: 96, fbar: 28, colH: 20, rowH: 20, colW: 64, sheetBar: 26, status: 24, vbar: 16,
  fbLine: 17,                      // extra height per additional formula line when the bar is expanded
};

export const G = {
  green: '#107C41', greenDark: '#0B5B33', tint: 'rgba(16,124,65,0.13)', chrome: '#F3F3F3', ribbonBg: '#FAFAFA',
  line: '#E0E0E0', grid: '#D9D9D9', hdr: '#F3F3F3', hdrSel: '#CFE8D8', ink: '#242424', mute: '#616161', blue: '#0F6CBD', red: '#C42B1C',
};

export const FontLoader: React.FC = () => {
  const [handle] = React.useState(() => delayRender('carlito-font'));
  React.useEffect(() => {
    const faces = [
      new FontFace('Carlito', `url(${CARLITO_REGULAR})`, {weight: '400'}),
      new FontFace('Carlito', `url(${CARLITO_BOLD})`, {weight: '700'}),
    ];
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => { loaded.forEach((f) => (document.fonts as any).add(f)); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle]);
  return null;
};

/* ------------------------------------------------------------------ icons */
type IcoProps = {n: string; s?: number; c?: string};
const S = '#424242';
export const Ico: React.FC<IcoProps> = ({n, s = 16, c}) => {
  const k = c ?? S;
  const sw = 1.5;
  const common = {fill: 'none', stroke: k, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  let g: React.ReactNode = null;
  switch (n) {
    case 'paste': g = (<g {...common}><rect x={5} y={5} width={14} height={16} rx={2} /><rect x={9} y={2.5} width={6} height={4} rx={1} fill="#fff" /><path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" stroke="#107C41" /></g>); break;
    case 'cut': g = (<g {...common}><circle cx={7} cy={18} r={2.8} /><circle cx={17} cy={18} r={2.8} /><path d="M8.6 15.6L16 3M15.4 15.6L8 3" /></g>); break;
    case 'copy': g = (<g {...common}><rect x={8} y={8} width={11} height={13} rx={1.5} /><path d="M5 16V5a1.5 1.5 0 011.5-1.5H15" /></g>); break;
    case 'painter': g = (<g {...common}><rect x={5} y={3} width={13} height={6} rx={1.5} fill="#FFC83D" /><path d="M11.5 9v4M9 13h5v8h-5z" /></g>); break;
    case 'save': g = (<g {...common}><path d="M5 4h11l3 3v13H5z" /><path d="M8 4v5h7V4M8 20v-6h8v6" /></g>); break;
    case 'undo': g = (<g {...common}><path d="M9 6L4 10.5 9 15" /><path d="M4.5 10.5H14a5 5 0 010 10H9" /></g>); break;
    case 'redo': g = (<g {...common}><path d="M15 6l5 4.5L15 15" /><path d="M19.5 10.5H10a5 5 0 000 10h5" /></g>); break;
    case 'pasteValues': g = (<g {...common}><rect x={4} y={5} width={13} height={16} rx={2} /><rect x={7.5} y={2.5} width={6} height={4} rx={1} fill="#fff" /><text x={10.5} y={17} fontSize={8} fontWeight={700} fill="#107C41" stroke="none" textAnchor="middle" fontFamily="Arial">123</text><rect x={14} y={12} width={8} height={9} rx={1.2} fill="#fff" stroke="#107C41" /></g>); break;
    case 'filter': g = (<g {...common}><path d="M4 5h16l-6.2 7.6V19l-3.6 1.8v-8.2z" fill="#DCEBFA" stroke="#0F6CBD" /></g>); break;
    case 'sortAsc': g = (<g {...common}><text x={3} y={10} fontSize={8.5} fontWeight={700} fill="#242424" stroke="none" fontFamily="Arial">A</text><text x={3} y={21} fontSize={8.5} fontWeight={700} fill="#242424" stroke="none" fontFamily="Arial">Z</text><path d="M17 5v14M13.5 15.5L17 19.5l3.5-4" stroke="#0F6CBD" /></g>); break;
    case 'sortDesc': g = (<g {...common}><text x={3} y={10} fontSize={8.5} fontWeight={700} fill="#242424" stroke="none" fontFamily="Arial">Z</text><text x={3} y={21} fontSize={8.5} fontWeight={700} fill="#242424" stroke="none" fontFamily="Arial">A</text><path d="M17 5v14M13.5 8.5L17 4.5l3.5 4" stroke="#0F6CBD" /></g>); break;
    case 'clearFormats': g = (<g {...common}><path d="M14 4l6 6-8.5 8.5H6L3.5 16 14 4z" fill="#FDE7E9" stroke="#C42B1C" /><path d="M8 20h12" /></g>); break;
    case 'bold': g = (<text x={12} y={18} fontSize={17} fontWeight={700} fill={k} textAnchor="middle" fontFamily="Arial">B</text>); break;
    case 'italic': g = (<text x={12} y={18} fontSize={17} fontStyle="italic" fill={k} textAnchor="middle" fontFamily="Georgia, serif">I</text>); break;
    case 'underline': g = (<g><text x={12} y={16.5} fontSize={16} fill={k} textAnchor="middle" fontFamily="Arial">U</text><path d="M6 20.5h12" stroke={k} strokeWidth={1.6} /></g>); break;
    case 'borders': g = (<g {...common}><rect x={4} y={4} width={16} height={16} /><path d="M12 4v16M4 12h16" strokeDasharray="2 2" /></g>); break;
    case 'fill': g = (<g {...common}><path d="M6 12l6-7 6 7-5 5z" /><path d="M19 14c1 1.6 1.6 2.6 1.6 3.5a1.6 1.6 0 01-3.2 0c0-.9.6-1.9 1.6-3.5z" fill="#0F6CBD" stroke="none" /><rect x={3} y={20} width={18} height={2.6} fill="#FFD400" stroke="none" /></g>); break;
    case 'fontColor': g = (<g><text x={12} y={16} fontSize={15} fontWeight={700} fill={k} textAnchor="middle" fontFamily="Arial">A</text><rect x={4} y={19} width={16} height={3} fill="#C42B1C" /></g>); break;
    case 'growFont': g = (<g><text x={9} y={18} fontSize={15} fontWeight={700} fill={k} textAnchor="middle" fontFamily="Arial">A</text><path d="M17 8l3 -4 3 4z" fill={k} stroke="none" transform="translate(-3 0)" /></g>); break;
    case 'shrinkFont': g = (<g><text x={9} y={18} fontSize={12} fontWeight={700} fill={k} textAnchor="middle" fontFamily="Arial">A</text><path d="M17 4l3 4 3-4z" fill={k} stroke="none" transform="translate(-3 0)" /></g>); break;
    case 'alignL': g = (<g {...common}><path d="M4 6h16M4 10h10M4 14h16M4 18h10" /></g>); break;
    case 'alignC': g = (<g {...common}><path d="M4 6h16M7 10h10M4 14h16M7 18h10" /></g>); break;
    case 'alignR': g = (<g {...common}><path d="M4 6h16M10 10h10M4 14h16M10 18h10" /></g>); break;
    case 'alignTop': g = (<g {...common}><path d="M4 4h16" /><path d="M7 8h10M7 12h10" /></g>); break;
    case 'alignMid': g = (<g {...common}><path d="M7 6h10M4 12h16M7 18h10" /></g>); break;
    case 'alignBot': g = (<g {...common}><path d="M7 12h10M7 16h10M4 20h16" /></g>); break;
    case 'orient': g = (<g {...common}><text x={4} y={17} fontSize={10} fill={k} stroke="none" fontFamily="Arial" transform="rotate(-35 8 14)">ab</text><path d="M15 6l4 4M15 10l4-4" /></g>); break;
    case 'wrap': g = (<g {...common}><path d="M4 6h16M4 12h12a3 3 0 010 6H10" /><path d="M12 15.5L9.5 18 12 20.5" /></g>); break;
    case 'merge': g = (<g {...common}><rect x={3.5} y={6} width={17} height={12} /><path d="M7 12h10M9.5 9.5L7 12l2.5 2.5M14.5 9.5L17 12l-2.5 2.5" stroke="#107C41" /></g>); break;
    case 'indentL': g = (<g {...common}><path d="M4 5h16M11 10h9M11 14h9M4 19h16" /><path d="M8 9.5L4.5 12 8 14.5" /></g>); break;
    case 'indentR': g = (<g {...common}><path d="M4 5h16M11 10h9M11 14h9M4 19h16" /><path d="M4.5 9.5L8 12l-3.5 2.5" /></g>); break;
    case 'currency': g = (<g><rect x={3} y={6} width={18} height={12} rx={1.5} fill="none" stroke={k} strokeWidth={1.4} /><text x={12} y={15.5} fontSize={9.5} fontWeight={700} fill="#107C41" textAnchor="middle" fontFamily="Arial">$</text></g>); break;
    case 'percent': g = (<text x={12} y={17.5} fontSize={16} fontWeight={700} fill={k} textAnchor="middle" fontFamily="Arial">%</text>); break;
    case 'comma': g = (<text x={12} y={17} fontSize={17} fontWeight={700} fill={k} textAnchor="middle" fontFamily="Arial">,</text>); break;
    case 'decInc': g = (<g><text x={3} y={15} fontSize={8} fill={k} fontFamily="Arial">.00</text><path d="M5 19h14M15.5 16.5L19 19l-3.5 2.5" fill="none" stroke="#0F6CBD" strokeWidth={1.4} strokeLinecap="round" /></g>); break;
    case 'decDec': g = (<g><text x={3} y={15} fontSize={8} fill={k} fontFamily="Arial">.0</text><path d="M19 19H5M8.5 16.5L5 19l3.5 2.5" fill="none" stroke="#0F6CBD" strokeWidth={1.4} strokeLinecap="round" /></g>); break;
    case 'condFmt': g = (<g><rect x={3} y={4} width={18} height={16} rx={1.5} fill="none" stroke={k} strokeWidth={1.3} /><rect x={5} y={6} width={6} height={4} fill="#F4B183" /><rect x={13} y={6} width={6} height={4} fill="#A9D18E" /><rect x={5} y={12} width={6} height={4} fill="#9DC3E6" /><rect x={13} y={12} width={6} height={4} fill="#FFE699" /></g>); break;
    case 'fmtTable': g = (<g><rect x={3} y={4} width={18} height={16} fill="#fff" stroke={k} strokeWidth={1.3} /><rect x={3} y={4} width={18} height={5} fill="#107C41" /><path d="M3 12.5h18M3 16.5h18M9 9v11M15 9v11" stroke={k} strokeWidth={1} /></g>); break;
    case 'cellStyles': g = (<g><rect x={3} y={5} width={18} height={14} rx={1.5} fill="#fff" stroke={k} strokeWidth={1.3} /><rect x={5.5} y={8} width={5} height={3} fill="#9DC3E6" /><rect x={12.5} y={8} width={6} height={3} fill="#A9D18E" /><rect x={5.5} y={13} width={13} height={3} fill="#FFE699" /></g>); break;
    case 'insert': g = (<g {...common}><rect x={3.5} y={9} width={13} height={10} /><path d="M3.5 14h13M10 9v10" /><path d="M18 3.5v6M15 6.5h6" stroke="#107C41" /></g>); break;
    case 'delete': g = (<g {...common}><rect x={3.5} y={9} width={13} height={10} /><path d="M3.5 14h13M10 9v10" /><path d="M15.5 6.5h6" stroke="#C42B1C" /></g>); break;
    case 'format': g = (<g {...common}><rect x={3.5} y={5} width={13} height={11} /><path d="M3.5 10.5h13M10 5v11" /><circle cx={17.5} cy={17.5} r={3} fill="#fff" stroke="#616161" /></g>); break;
    case 'autosum': g = (<text x={12} y={19} fontSize={21} fontWeight={700} fill="#107C41" textAnchor="middle" fontFamily="Arial">Σ</text>); break;
    case 'fillDown': g = (<g {...common}><rect x={5} y={4} width={14} height={16} /><path d="M12 8v8M8.5 12.5L12 16l3.5-3.5" stroke="#0F6CBD" /></g>); break;
    case 'clear': g = (<g {...common}><path d="M14 4l6 6-8.5 8.5H6L3.5 16 14 4z" fill="#fff" /><path d="M8 20h12" /></g>); break;
    case 'sortFilter': g = (<g {...common}><path d="M3 4.5h9l-3.4 4.2v4.2l-2.2 1.1V8.7z" fill="#DCEBFA" stroke="#0F6CBD" /><text x={14} y={13} fontSize={7.5} fontWeight={700} fill={k} stroke="none" fontFamily="Arial">A</text><text x={14} y={21} fontSize={7.5} fontWeight={700} fill={k} stroke="none" fontFamily="Arial">Z</text><path d="M9 16.5v5M7.2 19.8L9 21.8l1.8-2" stroke="#0F6CBD" /></g>); break;
    case 'find': g = (<g {...common}><circle cx={10} cy={10} r={5.5} /><path d="M14.2 14.2L20 20" strokeWidth={2.2} /></g>); break;
    case 'analyze': g = (<g {...common}><rect x={4} y={12} width={3.5} height={8} fill="#107C41" stroke="none" /><rect x={10} y={8} width={3.5} height={12} fill="#107C41" stroke="none" /><rect x={16} y={14} width={3.5} height={6} fill="#107C41" stroke="none" /><path d="M16 3l1 2.4 2.4 1-2.4 1L16 10l-1-2.6-2.4-1 2.4-1z" fill="#FFC83D" stroke="#FFC83D" /></g>); break;
    case 'addins': g = (<g {...common}><rect x={4} y={4} width={7} height={7} /><rect x={13} y={4} width={7} height={7} /><rect x={4} y={13} width={7} height={7} /><rect x={13} y={13} width={7} height={7} fill="#DCEBFA" stroke="#0F6CBD" /></g>); break;
    case 'pivot': g = (<g {...common}><rect x={3.5} y={4} width={17} height={16} rx={1} /><path d="M3.5 9.5h17M9.5 9.5V20" /><rect x={10} y={10} width={10} height={4.5} fill="#DCEBFA" stroke="none" /><path d="M13 6.8h5" stroke="#107C41" /></g>); break;
    case 'table': g = (<g><rect x={3.5} y={4.5} width={17} height={15} fill="#fff" stroke={k} strokeWidth={1.3} /><rect x={3.5} y={4.5} width={17} height={4} fill="#107C41" /><path d="M3.5 12h17M3.5 15.5h17M9.5 8.5v11M15 8.5v11" stroke={k} strokeWidth={1} /></g>); break;
    case 'shapes': g = (<g {...common}><circle cx={8} cy={8} r={4} fill="#DCEBFA" stroke="#0F6CBD" /><rect x={11} y={11} width={9} height={9} rx={1.5} fill="#E6F4EA" stroke="#107C41" /><path d="M4 20l3-5 3 5z" /></g>); break;
    case 'chart': g = (<g {...common}><path d="M4 4v16h16" /><rect x={7} y={12} width={3} height={6} fill="#107C41" stroke="none" /><rect x={12} y={8} width={3} height={10} fill="#0F6CBD" stroke="none" /><rect x={17} y={14} width={3} height={4} fill="#FFC83D" stroke="none" /></g>); break;
    case 'slicer': g = (<g {...common}><rect x={4} y={3.5} width={16} height={17} rx={1.5} /><rect x={6.5} y={7} width={11} height={3} fill="#107C41" stroke="none" /><rect x={6.5} y={11.5} width={11} height={3} fill="#DCEBFA" stroke="none" /><rect x={6.5} y={16} width={11} height={2.5} fill="#DCEBFA" stroke="none" /></g>); break;
    case 'zoom': g = (<g {...common}><circle cx={10} cy={10} r={5.5} /><path d="M14.2 14.2L20 20" strokeWidth={2.2} /><path d="M7.5 10h5M10 7.5v5" stroke="#107C41" /></g>); break;
    case 'search': g = (<g {...common}><circle cx={10.5} cy={10.5} r={5.5} /><path d="M15 15l5 5" /></g>); break;
    case 'comment': g = (<g {...common}><path d="M4 5h16v11H11l-4.5 4V16H4z" /></g>); break;
    case 'share': g = (<g {...common} stroke="#fff"><circle cx={6.5} cy={12} r={2.4} /><circle cx={17} cy={6} r={2.4} /><circle cx={17} cy={18} r={2.4} /><path d="M8.6 10.8l6.3-3.6M8.6 13.2l6.3 3.6" /></g>); break;
    case 'appIcon': g = (<g><rect x={3} y={3} width={18} height={18} rx={3} fill="#107C41" /><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" /></g>); break;
    case 'user': g = (<g {...common}><circle cx={12} cy={9} r={3.6} /><path d="M5 20c.8-4 3.6-5.6 7-5.6s6.2 1.6 7 5.6" /></g>); break;
    case 'normal': g = (<g {...common}><rect x={4} y={5} width={16} height={14} /><path d="M4 10h16M10 5v14" /></g>); break;
    case 'pageLayout': g = (<g {...common}><rect x={6} y={3.5} width={12} height={17} /><path d="M9 8h6M9 12h6M9 16h6" /></g>); break;
    case 'pageBreak': g = (<g {...common}><rect x={4} y={4} width={16} height={16} /><path d="M12 4v16" stroke="#0F6CBD" strokeDasharray="2 2" /><path d="M4 12h16" stroke="#0F6CBD" strokeDasharray="2 2" /></g>); break;
    case 'check': g = (<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={k} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />); break;
    default: g = null;
  }
  return <svg width={s} height={s} viewBox="0 0 24 24" style={{display: 'block', flexShrink: 0}}>{g}</svg>;
};

export const Caret: React.FC<{c?: string; s?: number}> = ({c = '#616161', s = 8}) => (
  <svg width={s} height={s} viewBox="0 0 8 8" style={{display: 'block', flexShrink: 0}}><path d="M1.2 2.6L4 5.4l2.8-2.8" fill="none" stroke={c} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ------------------------------------------------------------------ geometry helpers (used by scenes for cursors/zooms) */
export const TABS = ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View', 'Automate', 'Help'];
export const TOTAL_TABS_SWEEP = ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];
const tabW = (t: string) => Math.round(t.length * 7.4 + 26);
export const tabBox = (name: string) => {
  let x = 6;
  for (const t of TABS) { const w = tabW(t); if (t === name) return {x, w, cx: x + w / 2}; x += w; }
  if (name === 'Slicer' || name === 'Shape Format') { const w = tabW(name); return {x, w, cx: x + w / 2}; }
  return {x: 0, w: 0, cx: 0};
};
export const QAT_X0 = 44;
export const QAT_STEP = 34;
export const qatCx = (i: number) => QAT_X0 + QAT_STEP * i + QAT_STEP / 2;
export const qatArrowCx = (n: number) => QAT_X0 + QAT_STEP * n + 10;
export const qatBottom = XL.title - 4;

export type Geo = {colHh: number; ribbonH: number; fbTop: number; fbH: number; colTop: number; rowsTop: number; rowsBottom: number; rowW: number; gridRight: number; sheetTop: number; statusTop: number};
export const geo = (ribbon: number, fbExp: number, fbLines: number, rowW = 38, fbOn = 1, headOn = 1): Geo => {
  const ribbonH = Math.round(XL.ribbon * ribbon);
  const fbTop = XL.title + XL.tabs + ribbonH;
  const fbH = Math.round((XL.fbar + Math.round((fbLines - 1) * XL.fbLine * fbExp)) * fbOn);
  const colHh = Math.round(XL.colH * headOn);
  const colTop = fbTop + fbH;
  const rowsTop = colTop + colHh;
  const statusTop = XL.H - XL.status;
  const sheetTop = statusTop - XL.sheetBar;
  return {colHh, ribbonH, fbTop, fbH, colTop, rowsTop, rowsBottom: sheetTop, rowW: Math.round(rowW * headOn), gridRight: XL.W - XL.vbar, sheetTop, statusTop};
};
export const colLetter = (c: number) => {
  let s = ''; let n = c;
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
};
export const NAME_BOX = {x: 6, w: 104, cx: 58};
export const FB_ICONS = {cancelX: 138, enterX: 160, fxX: 184};

/* ------------------------------------------------------------------ props */
export type CellV = {t: string; b?: boolean; i?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string; num?: number | boolean};
export type Rng = {r1: number; c1: number; r2: number; c2: number};
export type ExcelProps = {
  file?: string;
  tab?: string;
  tabHot?: string;                // tab under spotlight/hover
  ribbon?: number;                // 0 collapsed .. 1 expanded
  qat?: string[];
  qatTips?: number;               // 0..1
  qatHot?: number;                // highlighted qat index
  qatCustom?: boolean;
  nameBox?: string;
  nameEdit?: boolean;
  formula?: string;
  fbExp?: number;                 // 0..1 expansion progress
  fbLines?: number;               // number of lines shown when expanded
  fbEdit?: boolean;
  scroll?: {r: number; c: number};
  cell: (r: number, c: number) => CellV | undefined;
  colW?: (c: number) => number;
  sel: Rng;
  active: {r: number; c: number};
  marquee?: Rng;
  marqueeOn?: boolean;
  filterCols?: number[];
  filterHot?: number;
  filterApplied?: number[];       // columns with an active filter (funnel icon)
  rowIds?: number[];              // filtered view: actual row numbers in display order (index 0 is row 1)
  thumb?: number;                 // 0..1 vertical scroll thumb position
  thumbSize?: number;             // 0..1 size of the vertical thumb
  statusLeft?: string;
  stats?: Array<[string, string]>;
  statsGlow?: number;             // 0..1 blue glow on stats
  sheet?: string;
  zoomPct?: number;
  gridOn?: number; headOn?: number; fbOn?: number;   // 1 = shown, 0 = hidden (animatable)
  sheets?: string[]; extraTab?: string; ribbonHot?: string; checks?: Record<string, number>; fields?: Record<string, string>;
  children?: React.ReactNode;
};

const defaultColW = (c: number) => {
  const w = [0, 84, 92, 130, 100, 54, 84, 84, 84];
  return c < w.length ? w[c] : XL.colW;
};
export const colWidth = defaultColW;
export const colX = (c: number, from: number, cw: (c: number) => number) => {
  let x = 0;
  for (let i = from; i < c; i++) x += cw(i);
  return x;
};

/* ------------------------------------------------------------------ small ribbon building blocks */
const ab = (x: number, y: number, w?: number, h?: number, extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...extra});
const lab: React.CSSProperties = {fontFamily: UIFONT, fontSize: 12, color: G.ink, whiteSpace: 'nowrap'};

const Sm: React.FC<{x: number; y: number; icon: string; label?: string; caret?: boolean; w?: number; iconColor?: string; bold?: boolean; bg?: string}> = ({x, y, icon, label, caret, w, iconColor, bg}) => (
  <div style={ab(x, y, w, 22, {display: 'flex', alignItems: 'center', gap: 5, padding: '0 3px', borderRadius: 3, background: bg})}>
    <Ico n={icon} s={16} c={iconColor} />
    {label ? <span style={lab}>{label}</span> : null}
    {caret ? <Caret /> : null}
  </div>
);
const Big: React.FC<{x: number; w: number; icon: string; l1: string; l2?: string; caret?: boolean}> = ({x, w, icon, l1, l2, caret}) => (
  <div style={ab(x, 2, w, 78, {display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4})}>
    <Ico n={icon} s={32} />
    <span style={{...lab, marginTop: 5, lineHeight: '14px'}}>{l1}</span>
    <span style={{...lab, lineHeight: '14px', display: 'flex', alignItems: 'center', gap: 3}}>{l2 ?? ''}{caret ? <Caret /> : null}</span>
  </div>
);
const Combo: React.FC<{x: number; y: number; w: number; text: string}> = ({x, y, w, text}) => (
  <div style={ab(x, y, w, 22, {border: '1px solid #C8C8C8', borderRadius: 3, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px', boxSizing: 'border-box'})}>
    <span style={{...lab, fontFamily: CELLFONT, fontSize: 13}}>{text}</span><Caret />
  </div>
);
const Sep: React.FC = () => <div style={{width: 1, height: 74, background: G.line, margin: '4px 5px 0', flexShrink: 0}} />;
const Grp: React.FC<{name: string; w: number; launcher?: boolean; children?: React.ReactNode}> = ({name, w, launcher, children}) => (
  <div style={{position: 'relative', width: w, height: '100%', flexShrink: 0}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 2, bottom: 16}}>{children}</div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 1, height: 15, textAlign: 'center', fontFamily: UIFONT, fontSize: 11.5, color: G.mute, lineHeight: '15px'}}>{name}</div>
    {launcher ? <svg width={9} height={9} viewBox="0 0 9 9" style={{position: 'absolute', right: 3, bottom: 3}}><path d="M1 1h4M1 1v4M3 3l5 5M8 4.5V8H4.5" fill="none" stroke="#7A7A7A" strokeWidth={1} /></svg> : null}
  </div>
);


export const sheetTabBox = (names: string[], name: string) => {
  let x = 54; let out = {x: 0, w: 0, cx: 0, plusX: 0};
  for (const n of names) { const w = Math.round(n.length * 7.3 + 30); if (n === name) out = {...out, x, w, cx: x + w / 2}; x += w; }
  return {...out, plusX: x + 8};
};

/* ------------------------------------------------------------------ generic ribbons (View, Insert, Slicer): approximate layouts, generic glyphs */
type RItem = {k: string; label: string; icon?: string; kind?: 'big' | 'check' | 'field' | 'sm'; caret?: boolean};
type RGroup = {name: string; w: number; items: RItem[]};
export const RIBBONS: Record<string, RGroup[]> = {
  View: [
    {name: 'Workbook Views', w: 250, items: [{k: 'Normal', label: 'Normal', icon: 'normal', kind: 'big'}, {k: 'PageBreak', label: 'Page Break Preview', icon: 'pageBreak', kind: 'big'}, {k: 'PageLayout', label: 'Page Layout', icon: 'pageLayout', kind: 'big'}]},
    {name: 'Show', w: 200, items: [{k: 'Ruler', label: 'Ruler', kind: 'check'}, {k: 'Gridlines', label: 'Gridlines', kind: 'check'}, {k: 'FormulaBar', label: 'Formula Bar', kind: 'check'}, {k: 'Headings', label: 'Headings', kind: 'check'}]},
    {name: 'Zoom', w: 190, items: [{k: 'Zoom', label: 'Zoom', icon: 'zoom', kind: 'big'}, {k: 'Zoom100', label: '100%', icon: 'zoom', kind: 'big'}, {k: 'ZoomSel', label: 'Zoom to Selection', icon: 'zoom', kind: 'big'}]},
    {name: 'Window', w: 300, items: [{k: 'NewWin', label: 'New Window', icon: 'normal', kind: 'big'}, {k: 'Arrange', label: 'Arrange All', icon: 'normal', kind: 'big'}, {k: 'Freeze', label: 'Freeze Panes', icon: 'normal', kind: 'big', caret: true}, {k: 'Split', label: 'Split', icon: 'normal', kind: 'big'}]},
  ],
  Insert: [
    {name: 'Tables', w: 200, items: [{k: 'PivotTable', label: 'PivotTable', icon: 'pivot', kind: 'big', caret: true}, {k: 'Table', label: 'Table', icon: 'table', kind: 'big'}]},
    {name: 'Illustrations', w: 250, items: [{k: 'Pictures', label: 'Pictures', icon: 'normal', kind: 'big', caret: true}, {k: 'Shapes', label: 'Shapes', icon: 'shapes', kind: 'big', caret: true}, {k: 'Icons', label: 'Icons', icon: 'normal', kind: 'big'}]},
    {name: 'Charts', w: 250, items: [{k: 'Charts', label: 'Recommended Charts', icon: 'chart', kind: 'big'}, {k: 'Column', label: 'Column or Bar', icon: 'chart', kind: 'big', caret: true}, {k: 'Line', label: 'Line or Area', icon: 'chart', kind: 'big', caret: true}]},
    {name: 'Filters', w: 190, items: [{k: 'Slicer', label: 'Slicer', icon: 'slicer', kind: 'big'}, {k: 'Timeline', label: 'Timeline', icon: 'slicer', kind: 'big'}]},
  ],
  Data: [
    {name: 'Get & Transform Data', w: 440, items: [{k: 'GetData', label: 'Get Data', icon: 'table', kind: 'big', caret: true}, {k: 'FromText', label: 'From Text/CSV', icon: 'normal', kind: 'big'}, {k: 'FromWeb', label: 'From Web', icon: 'normal', kind: 'big'}, {k: 'FromTable', label: 'From Table/Range', icon: 'table', kind: 'big'}, {k: 'Recent', label: 'Recent Sources', icon: 'normal', kind: 'big'}, {k: 'Existing', label: 'Existing Connections', icon: 'normal', kind: 'big'}]},
    {name: 'Queries & Connections', w: 300, items: [{k: 'RefreshAll', label: 'Refresh All', icon: 'fillDown', kind: 'big', caret: true}, {k: 'QC', label: 'Queries & Connections', icon: 'pivot', kind: 'big'}, {k: 'Props', label: 'Properties', icon: 'normal', kind: 'big'}]},
    {name: 'Sort & Filter', w: 230, items: [{k: 'Sort', label: 'Sort', icon: 'sortFilter', kind: 'big'}, {k: 'Filter', label: 'Filter', icon: 'filter', kind: 'big'}, {k: 'Adv', label: 'Advanced', icon: 'filter', kind: 'big'}]},
    {name: 'Data Tools', w: 230, items: [{k: 'T2C', label: 'Text to Columns', icon: 'normal', kind: 'big'}, {k: 'Valid', label: 'Data Validation', icon: 'check', kind: 'big', caret: true}]},
  ],
  Slicer: [
    {name: 'Slicer', w: 160, items: [{k: 'Settings', label: 'Slicer Settings', icon: 'slicer', kind: 'big'}, {k: 'Report', label: 'Report Connections', icon: 'slicer', kind: 'big'}]},
    {name: 'Slicer Styles', w: 250, items: [{k: 'Styles', label: 'Quick Styles', icon: 'slicer', kind: 'big', caret: true}]},
    {name: 'Arrange', w: 330, items: [{k: 'Forward', label: 'Bring Forward', icon: 'normal', kind: 'big'}, {k: 'Backward', label: 'Send Backward', icon: 'normal', kind: 'big'}, {k: 'SelPane', label: 'Selection Pane', icon: 'normal', kind: 'big'}, {k: 'Align', label: 'Align', icon: 'normal', kind: 'big', caret: true}]},
    {name: 'Buttons', w: 190, items: [{k: 'Columns', label: 'Columns:', kind: 'field'}, {k: 'BtnHeight', label: 'Height:', kind: 'field'}, {k: 'BtnWidth', label: 'Width:', kind: 'field'}]},
    {name: 'Size', w: 170, items: [{k: 'Height', label: 'Height:', kind: 'field'}, {k: 'Width', label: 'Width:', kind: 'field'}]},
  ],
};
/** Absolute position (inside ribbon area, below title+tabs) of a ribbon item, for cursor targets. */
export const ribbonItemBox = (kind: string, key: string) => {
  const groups = RIBBONS[kind] ?? []; let gx = 6;
  for (const g of groups) {
    let bx = gx + 4; let ci = 0; let fi = 0;
    for (const it of g.items) {
      if (it.kind === 'check') { const col = Math.floor(ci / 2), row = ci % 2; const r = {x: gx + 10 + col * 100, y: XL.title + XL.tabs + 14 + row * 26, w: 96, h: 22}; if (it.k === key) return {...r, cx: r.x + 9, cy: r.y + 11}; ci++; }
      else if (it.kind === 'field') { const r = {x: gx + 10, y: XL.title + XL.tabs + 8 + fi * 26, w: g.w - 20, h: 22}; if (it.k === key) return {...r, cx: r.x + r.w - 24, cy: r.y + 11}; fi++; }
      else { const w = Math.max(62, Math.min(86, it.label.length * 4.2 + 16)); const r = {x: bx, y: XL.title + XL.tabs + 2, w, h: 78}; if (it.k === key) return {...r, cx: r.x + w / 2, cy: r.y + 34}; bx += w; }
    }
    gx += g.w + 11;
  }
  return {x: 0, y: 0, w: 0, h: 0, cx: 0, cy: 0};
};
const GenericRibbon: React.FC<{kind: string; hot?: string; checks: Record<string, number>; fields: Record<string, string>}> = ({kind, hot, checks, fields}) => (
  <div style={{display: 'flex', height: '100%', paddingLeft: 6, overflow: 'hidden'}}>
    {RIBBONS[kind].map((g) => {
      let bx = 4; let ci = 0; let fi = 0;
      return (
        <div key={g.name} style={{display: 'contents'}}>
          <Grp name={g.name} w={g.w}>
            {g.items.map((it) => {
              if (it.kind === 'check') {
                const col = Math.floor(ci / 2), row = ci % 2; ci++; const on = (checks[it.k] ?? 1) > 0.5; const dis = it.k === 'Ruler';
                return (<div key={it.k} style={ab(4 + col * 100, 12 + row * 26, 96, 22, {display: 'flex', alignItems: 'center', gap: 6, background: hot === it.k ? '#E4E4E4' : 'transparent', borderRadius: 3})}>
                  <div style={{width: 14, height: 14, border: `1.5px solid ${dis ? '#B8B8B8' : '#555'}`, borderRadius: 2, boxSizing: 'border-box', background: on && !dis ? '#fff' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{on && !dis ? <svg width={10} height={10} viewBox="0 0 10 10"><path d="M1.5 5.2l2.4 2.4L8.6 2.4" fill="none" stroke="#222" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}</div>
                  <span style={{...lab, color: dis ? '#9A9A9A' : G.ink}}>{it.label}</span></div>);
              }
              if (it.kind === 'field') {
                const row = fi++;
                return (<div key={it.k} style={ab(4, 6 + row * 26, g.w - 14, 22, {display: 'flex', alignItems: 'center', gap: 6})}>
                  <span style={{...lab, width: 92}}>{it.label}</span>
                  <div style={{flex: 1, height: 22, border: `1px solid ${hot === it.k ? G.green : '#C8C8C8'}`, boxShadow: hot === it.k ? `0 0 0 2px ${G.green}55` : 'none', borderRadius: 3, background: '#fff', boxSizing: 'border-box', padding: '0 6px', display: 'flex', alignItems: 'center'}}><span style={{...lab, fontFamily: CELLFONT, fontSize: 13}}>{fields[it.k] ?? ''}</span></div></div>);
              }
              const w = Math.max(62, Math.min(86, it.label.length * 4.2 + 16)); const x = bx; bx += w;
              const words = it.label.split(' ');
              return (<div key={it.k} style={ab(x, 0, w, 78, {display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, background: hot === it.k ? '#E4E4E4' : 'transparent', borderRadius: 4})}>
                <Ico n={it.icon ?? 'normal'} s={32} /><span style={{...lab, marginTop: 5, lineHeight: '14px'}}>{words.length > 1 ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : it.label}</span>
                <span style={{...lab, lineHeight: '14px', display: 'flex', alignItems: 'center', gap: 3}}>{words.length > 1 ? words.slice(Math.ceil(words.length / 2)).join(' ') : ''}{it.caret ? <Caret /> : null}</span></div>);
            })}
          </Grp><Sep />
        </div>
      );
    })}
  </div>
);

const HomeRibbon: React.FC = () => (
  <div style={{display: 'flex', height: '100%', paddingLeft: 6, overflow: 'hidden'}}>
    <Grp name="Clipboard" w={140} launcher>
      <Big x={2} w={46} icon="paste" l1="Paste" caret />
      <Sm x={52} y={0} icon="cut" label="Cut" w={92} />
      <Sm x={52} y={24} icon="copy" label="Copy" caret w={92} />
      <Sm x={52} y={48} icon="painter" label="Format Painter" w={92} />
    </Grp>
    <Sep />
    <Grp name="Font" w={206} launcher>
      <Combo x={2} y={2} w={100} text="Calibri" />
      <Combo x={106} y={2} w={42} text="11" />
      <Sm x={152} y={1} icon="growFont" w={24} />
      <Sm x={176} y={1} icon="shrinkFont" w={24} />
      <Sm x={2} y={30} icon="bold" w={24} />
      <Sm x={26} y={30} icon="italic" w={24} />
      <Sm x={50} y={30} icon="underline" caret w={36} />
      <Sm x={92} y={30} icon="borders" caret w={36} />
      <Sm x={132} y={30} icon="fill" caret w={36} />
      <Sm x={168} y={30} icon="fontColor" caret w={36} />
    </Grp>
    <Sep />
    <Grp name="Alignment" w={236} launcher>
      <Sm x={2} y={1} icon="alignTop" w={24} />
      <Sm x={26} y={1} icon="alignMid" w={24} />
      <Sm x={50} y={1} icon="alignBot" w={24} />
      <Sm x={78} y={1} icon="orient" caret w={36} />
      <Sm x={116} y={1} icon="wrap" label="Wrap Text" w={96} />
      <Sm x={2} y={30} icon="alignL" w={24} />
      <Sm x={26} y={30} icon="alignC" w={24} />
      <Sm x={50} y={30} icon="alignR" w={24} />
      <Sm x={78} y={30} icon="indentL" w={24} />
      <Sm x={100} y={30} icon="indentR" w={24} />
      <Sm x={126} y={30} icon="merge" label="Merge & Center" caret w={116} />
    </Grp>
    <Sep />
    <Grp name="Number" w={170} launcher>
      <Combo x={2} y={2} w={168} text="General" />
      <Sm x={2} y={30} icon="currency" caret w={40} />
      <Sm x={44} y={30} icon="percent" w={24} />
      <Sm x={68} y={30} icon="comma" w={24} />
      <Sm x={96} y={30} icon="decInc" w={26} />
      <Sm x={124} y={30} icon="decDec" w={26} />
    </Grp>
    <Sep />
    <Grp name="Styles" w={240}>
      <Big x={2} w={80} icon="condFmt" l1="Conditional" l2="Formatting" caret />
      <Big x={86} w={76} icon="fmtTable" l1="Format as" l2="Table" caret />
      <Big x={166} w={74} icon="cellStyles" l1="Cell" l2="Styles" caret />
    </Grp>
    <Sep />
    <Grp name="Cells" w={92}>
      <Sm x={2} y={0} icon="insert" label="Insert" caret w={86} />
      <Sm x={2} y={24} icon="delete" label="Delete" caret w={86} />
      <Sm x={2} y={48} icon="format" label="Format" caret w={86} />
    </Grp>
    <Sep />
    <Grp name="Editing" w={214}>
      <Sm x={2} y={0} icon="autosum" label="AutoSum" caret w={92} />
      <Sm x={2} y={24} icon="fillDown" label="Fill" caret w={92} />
      <Sm x={2} y={48} icon="clear" label="Clear" caret w={92} />
      <Big x={96} w={58} icon="sortFilter" l1="Sort &" l2="Filter" caret />
      <Big x={154} w={58} icon="find" l1="Find &" l2="Select" caret />
    </Grp>
    <Sep />
    <Grp name="Add-ins" w={62}>
      <Big x={2} w={58} icon="addins" l1="Add-" l2="ins" caret />
    </Grp>
    <Sep />
    <Grp name="Analysis" w={64}>
      <Big x={0} w={62} icon="analyze" l1="Analyze" l2="Data" />
    </Grp>
  </div>
);

/* ------------------------------------------------------------------ title bar */
const TitleBar: React.FC<{file: string; qat: string[]; qatTips: number; qatHot: number}> = ({file, qat, qatTips, qatHot}) => (
  <div style={ab(0, 0, XL.W, XL.title, {background: G.chrome})}>
    <div style={ab(10, 6, 20, 20)}><Ico n="appIcon" s={20} /></div>
    {qat.map((id, i) => (
      <div key={id} style={ab(QAT_X0 + QAT_STEP * i, 3, QAT_STEP, 26, {display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3, background: qatHot === i ? '#D9D9D9' : 'transparent'})}>
        <Ico n={id} s={16} />
      </div>
    ))}
    <div style={ab(qatArrowCx(qat.length) - 8, 3, 18, 26, {display: 'flex', alignItems: 'center', justifyContent: 'center'})}><Caret s={9} /></div>
    <div style={ab(300, 0, 220, XL.title, {display: 'flex', alignItems: 'center'})}><span style={{...lab, fontSize: 12.5, color: G.ink}}>{file} - Excel</span></div>
    <div style={ab(XL.W / 2 - 190, 4, 420, 24, {background: '#fff', border: '1px solid #D1D1D1', borderRadius: 5, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px'})}>
      <Ico n="search" s={15} /><span style={{...lab, color: '#707070'}}>Search</span>
    </div>
    <div style={ab(XL.W - 255, 5, 22, 22)}><Ico n="user" s={22} c="#605E5C" /></div>
    {['min', 'max', 'close'].map((k, i) => (
      <div key={k} style={ab(XL.W - 138 + i * 46, 0, 46, XL.title, {display: 'flex', alignItems: 'center', justifyContent: 'center'})}>
        <svg width={12} height={12} viewBox="0 0 12 12"><g fill="none" stroke="#333" strokeWidth={1}>
          {k === 'min' ? <path d="M1 6h10" /> : k === 'max' ? <rect x={1.5} y={1.5} width={9} height={9} /> : <path d="M1 1l10 10M11 1L1 11" />}
        </g></svg>
      </div>
    ))}
    {qatTips > 0.01 ? qat.map((id, i) => (
      <div key={'k' + id} style={ab(qatCx(i) - 9, 22, 18, 16, {background: '#1F1F1F', color: '#fff', borderRadius: 3, fontFamily: UIFONT, fontSize: 11, fontWeight: 700, textAlign: 'center', lineHeight: '16px', opacity: qatTips, transform: `scale(${0.7 + 0.3 * qatTips})`, zIndex: 5, boxShadow: '0 1px 3px rgba(0,0,0,.4)'})}>{i + 1}</div>
    )) : null}
  </div>
);

/* ------------------------------------------------------------------ tab strip */
const TabStrip: React.FC<{tab: string; hot?: string; extra?: string}> = ({tab, hot, extra}) => (
  <div style={ab(0, XL.title, XL.W, XL.tabs, {background: G.chrome})}>
    {TABS.map((t) => {
      const b = tabBox(t);
      const act = t === tab;
      return (
        <div key={t} style={ab(b.x, 2, b.w, XL.tabs - 2, {display: 'flex', alignItems: 'center', justifyContent: 'center', background: hot === t ? '#E4E4E4' : 'transparent', borderRadius: 4})}>
          <span style={{fontFamily: UIFONT, fontSize: 13, fontWeight: act ? 700 : 400, color: G.ink}}>{t}</span>
          {act ? <div style={ab(b.w / 2 - 14, XL.tabs - 6, 28, 3, {background: G.green, borderRadius: 2})} /> : null}
        </div>
      );
    })}
    {extra ? (() => { const b = tabBox(extra); const on = tab === extra; return (<div style={ab(b.x, 2, b.w, XL.tabs - 2, {display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'transparent' : 'transparent', borderTop: `2px solid ${G.green}`, borderRadius: 3})}><span style={{fontFamily: UIFONT, fontSize: 13, fontWeight: on ? 700 : 400, color: G.greenDark}}>{extra}</span>{on ? <div style={ab(b.w / 2 - 14, XL.tabs - 6, 28, 3, {background: G.green, borderRadius: 2})} /> : null}</div>); })() : null}
    <div style={ab(XL.W - 224, 4, 92, 24, {border: '1px solid #D1D1D1', borderRadius: 5, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#fff'})}>
      <Ico n="comment" s={14} /><span style={lab}>Comments</span>
    </div>
    <div style={ab(XL.W - 124, 4, 84, 24, {background: G.green, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6})}>
      <Ico n="share" s={14} /><span style={{...lab, color: '#fff'}}>Share</span><Caret c="#fff" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ formula bar */
const FormulaBar: React.FC<{top: number; h: number; nameBox: string; nameEdit: boolean; formula: string; fbExp: number; edit: boolean; blink: boolean}> = ({top, h, nameBox, nameEdit, formula, fbExp, edit, blink}) => (
  <div style={ab(0, top, XL.W, h, {background: '#fff', borderTop: '1px solid #E1E1E1', borderBottom: '1px solid #D1D1D1', boxSizing: 'border-box'})}>
    <div style={ab(NAME_BOX.x, 2, NAME_BOX.w, 22, {border: nameEdit ? `1.5px solid ${G.green}` : '1px solid #C8C8C8', borderRadius: 3, boxSizing: 'border-box', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px'})}>
      <span style={{fontFamily: CELLFONT, fontSize: 14.5, color: G.ink, whiteSpace: 'nowrap'}}>{nameBox}{nameEdit && blink ? <span style={{color: G.green}}>|</span> : null}</span>
      <Caret />
    </div>
    <div style={ab(124, 5, 1, 16, {background: '#C8C8C8'})} />
    <svg style={ab(FB_ICONS.cancelX - 8, 4, 18, 18)} width={18} height={18} viewBox="0 0 18 18"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke={edit ? G.red : '#B0B0B0'} strokeWidth={1.6} strokeLinecap="round" /></svg>
    <svg style={ab(FB_ICONS.enterX - 8, 4, 18, 18)} width={18} height={18} viewBox="0 0 18 18"><path d="M3.5 9.5l3.8 3.8L14.5 5" fill="none" stroke={edit ? G.green : '#B0B0B0'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
    <div style={ab(FB_ICONS.fxX - 6, 3, 22, 20, {fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15, color: '#444', textAlign: 'center', lineHeight: '20px'})}>fx</div>
    <div style={ab(212, 2, XL.W - 212 - 34, h - 4, {border: '1px solid #D1D1D1', borderRadius: 3, boxSizing: 'border-box', background: '#fff', padding: '2px 8px', overflow: 'hidden', fontFamily: CELLFONT, fontSize: 14.5, color: G.ink, whiteSpace: 'pre', lineHeight: `${XL.fbLine}px`})}>
      {formula}{edit && blink ? <span style={{color: '#222'}}>|</span> : null}
    </div>
    <div style={ab(XL.W - 28, 4, 22, 18, {display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${180 * fbExp}deg)`})}><Caret s={10} /></div>
  </div>
);

/* ------------------------------------------------------------------ main component */
export const ExcelApp: React.FC<ExcelProps> = (p) => {
  const f = useCurrentFrame();
  const blink = Math.floor(f / 14) % 2 === 0;
  const ribbon = p.ribbon ?? 1;
  const fbExp = p.fbExp ?? 0;
  const fbLines = p.fbLines ?? 1;
  const scroll = p.scroll ?? {r: 1, c: 1};
  const cw = p.colW ?? defaultColW;
  const maxRowShown = p.rowIds ? p.rowIds[Math.min(p.rowIds.length - 1, scroll.r - 1 + 40)] : scroll.r + 40;
  const rowW0 = maxRowShown >= 10000 ? 50 : maxRowShown >= 1000 ? 44 : 38;
  const gridOn = p.gridOn ?? 1, headOn = p.headOn ?? 1, fbOn = p.fbOn ?? 1;
  const rowW = rowW0;
  const gm = geo(ribbon, fbExp, fbLines, rowW, fbOn, headOn);
  const gridCol = gridOn >= 1 ? G.grid : `rgba(225,225,225,${gridOn})`;
  const nRows = Math.ceil((gm.rowsBottom - gm.rowsTop) / XL.rowH);
  const rows: number[] = [];
  for (let i = 0; i < nRows; i++) {
    const idx = scroll.r - 1 + i;
    if (p.rowIds) { if (idx < p.rowIds.length) rows.push(p.rowIds[idx]); } else rows.push(scroll.r + i);
  }
  const cols: number[] = [];
  let cx = 0;
  for (let c = scroll.c; cx < gm.gridRight - gm.rowW; c++) { cols.push(c); cx += cw(c); }
  const rowIndexOf = (r: number) => rows.indexOf(r);
  const firstRowAtOrAfter = (r: number) => { const i = rows.findIndex((x) => x >= r); return i; };
  const lastRowAtOrBefore = (r: number) => { let k = -1; rows.forEach((x, i) => { if (x <= r) k = i; }); return k; };
  const colPx = (c: number) => gm.rowW + colX(c, scroll.c, cw);
  const rangeRect = (g: Rng) => {
    const i1 = firstRowAtOrAfter(g.r1), i2 = lastRowAtOrBefore(g.r2);
    if (i1 < 0 || i2 < i1) return null;
    const x1 = colPx(Math.max(g.c1, scroll.c));
    const x2 = colPx(g.c2 + 1);
    return {x: x1, y: gm.rowsTop + i1 * XL.rowH, w: x2 - x1, h: (i2 - i1 + 1) * XL.rowH, left: g.c1 >= scroll.c, top: g.r1 >= rows[0], right: true, bottom: g.r2 <= rows[rows.length - 1]};
  };
  const sel = p.sel;
  const selRect = rangeRect(sel);
  const actI = rowIndexOf(p.active.r);
  const actRect = actI >= 0 && p.active.c >= scroll.c ? {x: colPx(p.active.c), y: gm.rowsTop + actI * XL.rowH, w: cw(p.active.c), h: XL.rowH} : null;
  const fullSel = sel.r2 - sel.r1 > 0 || sel.c2 - sel.c1 > 0;
  const mq = p.marquee ? rangeRect(p.marquee) : null;
  const filtered = !!p.rowIds;
  const gridW = gm.gridRight;
  const stats = p.stats ?? [];
  const tab = p.tab ?? 'Home';

  const cellsView: React.ReactNode[] = [];
  rows.forEach((r, ri) => {
    cols.forEach((c) => {
      const w = cw(c);
      const x = colPx(c);
      const y = gm.rowsTop + ri * XL.rowH;
      const cell = p.cell(r, c);
      let spill = 0;
      if (cell && cell.t && !cell.num && !cell.bg && (cell.al ?? 'l') === 'l') {
        let k = c + 1;
        while (k < c + 6 && !p.cell(r, k)?.t) { spill += cw(k); k++; }
      }
      cellsView.push(
        <div key={`${r}:${c}`} style={ab(x, y, w + spill, XL.rowH, {boxSizing: 'border-box', borderRight: spill ? 'none' : `1px solid ${gridCol}`, borderBottom: `1px solid ${gridCol}`, background: cell?.bg ?? 'transparent', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: (cell?.al ?? (cell?.num ? 'r' : 'l')) === 'r' ? 'flex-end' : (cell?.al === 'c' ? 'center' : 'flex-start'), padding: '0 3px 1px'})}>
          {cell ? <span style={{fontFamily: CELLFONT, fontSize: 14.67, fontWeight: cell.b ? 700 : 400, fontStyle: cell.i ? 'italic' : 'normal', color: cell.color ?? '#000', whiteSpace: 'nowrap', lineHeight: '17px'}}>{cell.t}</span> : null}
        </div>,
      );
      if (spill) cellsView.push(<div key={`${r}:${c}:b`} style={ab(x + w + spill - 1, y, 1, XL.rowH, {background: gridCol})} />);
    });
  });

  const isColSel = (c: number) => c >= sel.c1 && c <= sel.c2;
  const isRowSel = (r: number) => r >= sel.r1 && r <= sel.r2;
  const dash = (f * 0.9) % 14;

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: XL.W, height: XL.H, background: '#fff', overflow: 'hidden', fontFamily: UIFONT}}>
      {/* chrome */}
      <TitleBar file={p.file ?? 'Book1'} qat={p.qat ?? ['save', 'undo', 'redo']} qatTips={p.qatTips ?? 0} qatHot={p.qatHot ?? -1} />
      <TabStrip tab={tab} hot={p.tabHot} extra={p.extraTab} />
      {gm.ribbonH > 0 ? (
        <div style={ab(0, XL.title + XL.tabs, XL.W, gm.ribbonH, {background: G.ribbonBg, borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #D8D8D8', overflow: 'hidden', boxSizing: 'border-box'})}>
          <div style={{position: 'absolute', left: 0, top: 0, width: XL.W, height: XL.ribbon, opacity: Math.min(1, ribbon * 1.4)}}>{RIBBONS[tab] ? <GenericRibbon kind={tab} hot={p.ribbonHot} checks={p.checks ?? {}} fields={p.fields ?? {}} /> : <HomeRibbon />}</div>
        </div>
      ) : <div style={ab(0, XL.title + XL.tabs, XL.W, 1, {background: '#D8D8D8'})} />}
      <div style={ab(0, gm.fbTop, XL.W, gm.fbH, {overflow: 'hidden', opacity: fbOn})}><FormulaBar top={0} h={Math.max(XL.fbar, gm.fbH)} nameBox={p.nameBox ?? 'A1'} nameEdit={!!p.nameEdit} formula={p.formula ?? ''} fbExp={fbExp} edit={!!p.fbEdit} blink={blink} /></div>

      {/* grid */}
      <div style={ab(0, gm.colTop, gridW, XL.H - XL.status - XL.sheetBar - gm.colTop, {overflow: 'hidden', background: '#fff'})}>
        <div style={ab(0, 0, gridW, gm.colHh, {background: G.hdr, borderBottom: '1px solid #C6C6C6', overflow: 'hidden', opacity: headOn})} />
        <div style={ab(0, gm.colHh, gm.rowW, 2000, {background: G.hdr, borderRight: '1px solid #C6C6C6', opacity: headOn})} />
        <svg style={ab(gm.rowW - 14, gm.colHh - 14, 12, 12)} width={12} height={12} viewBox="0 0 12 12"><path d="M11 1v10H1z" fill="#BDBDBD" /></svg>
        {cols.map((c) => {
          const s = isColSel(c);
          return (
            <div key={'h' + c} style={ab(colPx(c), 0, cw(c), gm.colHh, {opacity: headOn, overflow: 'hidden', boxSizing: 'border-box', borderRight: '1px solid #C6C6C6', background: s ? G.hdrSel : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UIFONT, fontSize: 12.5, color: s ? G.greenDark : '#444', fontWeight: s ? 700 : 400})}>
              {colLetter(c)}
              {s ? <div style={ab(0, XL.colH - 2, cw(c), 2, {background: G.green})} /> : null}
            </div>
          );
        })}
        {rows.map((r, ri) => {
          const s = isRowSel(r);
          return (
            <div key={'r' + r} style={ab(0, gm.colHh + ri * XL.rowH, gm.rowW, XL.rowH, {opacity: headOn, overflow: 'hidden', boxSizing: 'border-box', borderBottom: '1px solid #C6C6C6', borderRight: '1px solid #C6C6C6', background: s ? G.hdrSel : G.hdr, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UIFONT, fontSize: 12.5, color: s ? G.greenDark : filtered && r > 1 ? G.blue : '#444', fontWeight: s ? 700 : 400})}>
              {r.toLocaleString('en-US').replace(/,/g, '')}
              {s ? <div style={ab(gm.rowW - 2, 0, 2, XL.rowH, {background: G.green})} /> : null}
            </div>
          );
        })}
      </div>
      {/* cells layer (absolute in app coordinates, clipped to grid) */}
      <div style={ab(0, gm.rowsTop, gridW, gm.rowsBottom - gm.rowsTop, {overflow: 'hidden'})}>
        <div style={{position: 'absolute', left: 0, top: -gm.rowsTop}}>{cellsView}</div>
        {/* selection */}
        <svg style={{position: 'absolute', left: 0, top: -gm.rowsTop, width: gridW, height: XL.H, overflow: 'visible'}} width={gridW} height={XL.H}>
          {selRect ? (
            <g>
              {fullSel || !actRect ? (
                <path fillRule="evenodd" fill={G.tint} d={`M${selRect.x} ${selRect.y}h${selRect.w}v${selRect.h}h${-selRect.w}z${actRect ? `M${actRect.x} ${actRect.y}h${actRect.w}v${actRect.h}h${-actRect.w}z` : ''}`} />
              ) : null}
              <rect x={selRect.x} y={selRect.y} width={selRect.w} height={selRect.h} fill="none" stroke={G.green} strokeWidth={2.25} />
              {selRect.bottom ? <rect x={selRect.x + selRect.w - 4} y={selRect.y + selRect.h - 4} width={7} height={7} fill={G.green} stroke="#fff" strokeWidth={1} /> : null}
            </g>
          ) : null}
          {actRect && fullSel ? <rect x={actRect.x} y={actRect.y} width={actRect.w} height={actRect.h} fill="none" stroke={G.green} strokeWidth={1} opacity={0} /> : null}
          {p.marqueeOn && mq ? (
            <g>
              <rect x={mq.x} y={mq.y} width={mq.w} height={mq.h} fill="none" stroke="#fff" strokeWidth={2} />
              <rect x={mq.x} y={mq.y} width={mq.w} height={mq.h} fill="none" stroke={G.green} strokeWidth={2} strokeDasharray="5 4" strokeDashoffset={-dash} />
            </g>
          ) : null}
          {(p.filterCols ?? []).map((c) => {
            if (c < scroll.c || rows[0] !== 1) return null;
            const x = colPx(c + 1) - 18, y = gm.rowsTop + 2;
            const on = p.filterApplied?.includes(c);
            const hot = p.filterHot === c;
            return (
              <g key={'fl' + c}>
                <rect x={x} y={y} width={16} height={16} fill={hot ? '#CFE8D8' : '#F3F3F3'} stroke="#8A8A8A" strokeWidth={1} />
                {on ? <path d={`M${x + 3.5} ${y + 3.5}h9l-3.4 4v4.2l-2.2 1.2v-5.4z`} fill="#0F6CBD" /> : <path d={`M${x + 4} ${y + 6}h8l-4 4.6z`} fill="#333" />}
              </g>
            );
          })}
        </svg>
      </div>
      {/* vertical scrollbar */}
      <div style={ab(XL.W - XL.vbar, gm.colTop, XL.vbar, gm.sheetTop - gm.colTop, {background: '#F0F0F0', borderLeft: '1px solid #DADADA', boxSizing: 'border-box'})}>
        {(() => {
          const span = gm.sheetTop - gm.colTop - 34;
          const size = Math.max(18, span * (p.thumbSize ?? 0.5));
          const top = 17 + (span - size) * (p.thumb ?? 0);
          return <div style={ab(3, top, 9, size, {background: '#C2C2C2', borderRadius: 4})} />;
        })()}
      </div>
      {/* sheet tabs bar */}
      <div style={ab(0, gm.sheetTop, XL.W, XL.sheetBar, {background: G.chrome, borderTop: '1px solid #D1D1D1', boxSizing: 'border-box'})}>
        <svg style={ab(8, 6, 40, 14)} width={40} height={14} viewBox="0 0 40 14"><path d="M8 2L3 7l5 5M32 2l5 5-5 5" fill="none" stroke="#8A8A8A" strokeWidth={1.4} strokeLinecap="round" /></svg>
        {(() => { const names = p.sheets ?? [p.sheet ?? 'Sheet1']; const act = p.sheet ?? names[0]; return names.map((nm) => { const b = sheetTabBox(names, nm); const on = nm === act; return (
          <div key={nm} style={ab(b.x, 0, b.w, XL.sheetBar - 1, {background: on ? '#fff' : 'transparent', borderBottom: on ? `2px solid ${G.green}` : 'none', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #D1D1D1', borderRight: '1px solid #D1D1D1'})}>
            <span style={{fontFamily: UIFONT, fontSize: 12.5, fontWeight: on ? 700 : 400, color: on ? G.green : G.ink}}>{nm}</span>
          </div>); }); })()}
        <div style={ab(sheetTabBox(p.sheets ?? [p.sheet ?? 'Sheet1'], '').plusX, 3, 20, 20, {borderRadius: 10, border: '1px solid #A0A0A0', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#444', lineHeight: '16px', fontFamily: UIFONT})}>+</div>
        <div style={ab(560, 8, XL.W - 560 - 40, 10, {background: '#E4E4E4', borderRadius: 5})}><div style={ab(0, 1, 260, 8, {background: '#C2C2C2', borderRadius: 4})} /></div>
      </div>
      {/* status bar */}
      <div style={ab(0, gm.statusTop, XL.W, XL.status, {background: G.chrome, borderTop: '1px solid #D1D1D1', boxSizing: 'border-box', display: 'flex', alignItems: 'center', fontFamily: UIFONT, fontSize: 12, color: G.ink})}>
        <span style={{marginLeft: 10, minWidth: 40, whiteSpace: 'nowrap'}}>{p.statusLeft ?? 'Ready'}</span>
        <span style={{marginLeft: 18, color: G.mute, whiteSpace: 'nowrap'}}>Accessibility: Good to go</span>
        <div style={{flex: 1}} />
        {stats.length ? (
          <div style={{display: 'flex', gap: 22, marginRight: 22, padding: '2px 10px', borderRadius: 4, background: `rgba(56,189,248,${0.18 * (p.statsGlow ?? 0)})`, boxShadow: `0 0 ${14 * (p.statsGlow ?? 0)}px rgba(56,189,248,${0.8 * (p.statsGlow ?? 0)})`}}>
            {stats.map(([k, v]) => (<span key={k} style={{whiteSpace: 'nowrap'}}>{k}: <b style={{fontWeight: 600}}>{v}</b></span>))}
          </div>
        ) : null}
        <div style={{display: 'flex', gap: 10, marginRight: 14, alignItems: 'center'}}>
          <Ico n="normal" s={15} c={G.green} /><Ico n="pageLayout" s={15} /><Ico n="pageBreak" s={15} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, marginRight: 14}}>
          <span style={{fontSize: 14, color: '#555'}}>−</span>
          <div style={{width: 90, height: 2, background: '#9A9A9A', position: 'relative'}}><div style={ab(43, -4, 4, 10, {background: '#444'})} /></div>
          <span style={{fontSize: 14, color: '#555'}}>+</span>
          <span style={{minWidth: 36, textAlign: 'right'}}>{p.zoomPct ?? 100}%</span>
        </div>
      </div>
      {/* overlays in logical app coordinates */}
      {p.children}
    </div>
  );
};

/** Layout lookup for scenes (cursor targets). */
export const cellCenter = (r: number, c: number, o: {ribbon?: number; fbExp?: number; fbLines?: number; scroll?: {r: number; c: number}; colW?: (c: number) => number; rowW?: number}) => {
  const sc = o.scroll ?? {r: 1, c: 1};
  const cw = o.colW ?? defaultColW;
  const gm = geo(o.ribbon ?? 1, o.fbExp ?? 0, o.fbLines ?? 1, o.rowW ?? 38);
  return {x: gm.rowW + colX(c, sc.c, cw) + cw(c) / 2, y: gm.rowsTop + (r - sc.r) * XL.rowH + XL.rowH / 2};
};
export const colHeaderCenter = (c: number, o: {ribbon?: number; fbExp?: number; fbLines?: number; scroll?: {r: number; c: number}; colW?: (c: number) => number; rowW?: number}) => {
  const sc = o.scroll ?? {r: 1, c: 1};
  const cw = o.colW ?? defaultColW;
  const gm = geo(o.ribbon ?? 1, o.fbExp ?? 0, o.fbLines ?? 1, o.rowW ?? 38);
  return {x: gm.rowW + colX(c, sc.c, cw) + cw(c) / 2, y: gm.colTop + XL.colH / 2};
};
