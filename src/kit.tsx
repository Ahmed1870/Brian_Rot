import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, FPS, H, LOGO, M, SC, W, WIN, X, Z} from './theme';
import {ar, mono, ui} from './fonts';

/* ───────── motion helpers ───────── */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ez = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
export const kf = (t: number, p: [number, number][]): number => {
  if (t <= p[0][0]) return p[0][1];
  for (let i = 1; i < p.length; i++) {
    if (t <= p[i][0]) {
      const [a, va] = p[i - 1];
      const [b, vb] = p[i];
      return b === a ? vb : va + (vb - va) * ez((t - a) / (b - a));
    }
  }
  return p[p.length - 1][1];
};
export const useT = (from: number) => (useCurrentFrame() + from) / FPS;
export const fade = (t: number, a: number, b: number, f = 0.35) => clamp((t - a) / f) * clamp((b - t) / f);
export const pls = (t: number, s = 1.4) => 0.5 + 0.5 * Math.sin((t * 6.2832) / s);

/* ───────── sample data (lesson 32: PivotTable + custom report) ───────── */
export const NROWS = 50001;
export const NC = 14;
export const PVW = [130, 170, 40, 120, 170, 40, 380, 64, 64, 64, 64, 64, 64, 64];
export const P5W = [120, 160, 130, 30, 110, 150, 130, 64, 64, 64, 64, 64, 64, 64];
export const WCOL: number[] = [...PVW];
/** switch the column-width set (called once at the top of each scene, before its grid renders) */
export const setCols = (a: number[]) => { WCOL.length = 0; WCOL.push(...a); };
export const xOf = (c: number) => {
  const i = Math.min(NC - 1, Math.floor(c));
  let x = 0;
  for (let k = 0; k < i; k++) x += WCOL[k];
  return x + (c - i) * WCOL[i];
};
export const BRN = ['Cairo', 'Alex', 'Giza', 'Mansoura', 'Aswan'];
export const SALES = [1858000, 1265000, 1105000, 759000, 584000];
export const PROFIT = [428000, 291000, 238000, 152000, 117000];
/** pivot row order: d = by value (default), a = A to Z, z = Z to A */
export const ORD: Record<string, number[]> = {d: [0, 1, 2, 3, 4], a: [1, 4, 0, 2, 3], z: [3, 2, 0, 4, 1]};
export const fmt = (n: number) => n.toLocaleString('en-US');
/** kind = 'pv|sort|modes|flags|edit|[hl]'  (p5 = same with Profit column; modes 'ggggg;ggg--' = Sales;Profit report columns)
 *  modes per report row: r = plain reference to the pivot cell (=B4..), g = GETPIVOTDATA (by branch name), - = empty
 *  flags: h = report header, n = branch names.   edit = 'E4,4:text' (cell in edit mode) or 'V4,6:text' (committed value)
 *  hl = JSON [[row,col,color] | [row1,col1,row2,col2,color]] */
export type Kind = string;
type PK = {k: string; a: string; b: string; c: string; d: string; hl: Map<string, string>; ed: {r: number; c: number; t: string; editing: boolean} | null};
let lastK = '';
let lastP: PK = {k: '', a: '', b: '', c: '', d: '', hl: new Map(), ed: null};
const parseKind = (kind: string): PK => {
  if (kind === lastK) return lastP;
  const q = kind.split('|');
  const js = q.length > 1 && q[q.length - 1].startsWith('[') ? q[q.length - 1] : '[]';
  const hl = new Map<string, string>();
  for (const e of JSON.parse(js) as (string | number)[][]) {
    if (e.length === 3) hl.set(`${e[0]},${e[1]}`, String(e[2]));
    else for (let r = Number(e[0]); r <= Number(e[2]); r++) for (let c = Number(e[1]); c <= Number(e[3]); c++) hl.set(`${r},${c}`, String(e[4]));
  }
  const d = q[4] && !q[4].startsWith('[') ? q[4] : '';
  const m = /^([EV])(\d+),(\d+):([\s\S]*)$/.exec(d);
  lastK = kind;
  lastP = {k: q[0], a: q[1] ?? 'd', b: q[2] ?? '', c: q[3] ?? '', d, hl, ed: m ? {r: Number(m[2]), c: Number(m[3]), t: m[4], editing: m[1] === 'E'} : null};
  return lastP;
};
export const hlOf = (kind: Kind, row: number, col: number) => parseKind(kind).hl.get(`${row},${col}`);
export const editOf = (kind: Kind, row: number, col: number) => {
  const e = parseKind(kind).ed;
  return e && e.r === row && e.c === col ? e : null;
};
export const cell = (kind: Kind, row: number, col: number): {t: string; n: boolean} => {
  const p = parseKind(kind);
  const ed = p.ed;
  if (ed && ed.r === row && ed.c === col) return {t: ed.t, n: !ed.editing && /^[\d,]+$/.test(ed.t)};
  const p5 = p.k === 'p5';
  const ord = ORD[p.a] ?? ORD.d;
  const pw = p5 ? 3 : 2;
  const nc = p5 ? 4 : 3; // report names column
  if (row === 3) {
    if (col === 0) return {t: 'Row Labels  ▾', n: false};
    if (col === 1) return {t: 'Sum of Sales Amount', n: false};
    if (p5 && col === 2) return {t: 'Sum of Profit', n: false};
    if (p.c.includes('h')) {
      if (col === nc) return {t: 'Branch', n: false};
      if (col === nc + 1) return {t: 'Sales Report', n: false};
      if (p5 && col === 6) return {t: 'Profit Report', n: false};
    }
    return {t: '', n: false};
  }
  if (row === 9) {
    if (col === 0) return {t: 'Grand Total', n: false};
    if (col === 1) return {t: fmt(SALES.reduce((x, y) => x + y, 0)), n: true};
    if (p5 && col === 2) return {t: fmt(PROFIT.reduce((x, y) => x + y, 0)), n: true};
    return {t: '', n: false};
  }
  if (row < 4 || row > 8) return {t: '', n: false};
  const i = row - 4;
  if (col < pw) {
    if (col === 0) return {t: BRN[ord[i]], n: false};
    if (col === 1) return {t: fmt(SALES[ord[i]]), n: true};
    return {t: fmt(PROFIT[ord[i]]), n: true};
  }
  if (col === nc && p.c.includes('n')) return {t: BRN[i], n: false};
  const [mf, mg] = p.b.split(';');
  if (col === nc + 1) {
    const m = (mf ?? '')[i];
    return m === 'g' ? {t: fmt(SALES[i]), n: true} : m === 'r' ? {t: fmt(SALES[ord[i]]), n: true} : {t: '', n: false};
  }
  if (p5 && col === 6) {
    const m = (mg ?? '')[i];
    return m === 'g' ? {t: fmt(PROFIT[i]), n: true} : m === 'r' ? {t: fmt(PROFIT[ord[i]]), n: true} : {t: '', n: false};
  }
  return {t: '', n: false};
};
export const colName = (c: number) => String.fromCharCode(65 + c);

/* ───────── grid ───────── */
const RH = M.rowH;
const Block: React.FC<{x: number; y: number; w: number; h: number; r0: number; c0: number; kind: Kind}> = ({x, y, w, h, r0, c0, kind}) => {
  const out: React.ReactNode[] = [];
  const r = Math.floor(r0);
  const off = -(r0 - r) * RH;
  const c = Math.floor(c0);
  const pw = kind.startsWith('p5') ? 3 : 2;
  for (let i = 0; off + i * RH < h; i++) {
    const row = r + i;
    if (row > NROWS) break;
    let cx = -(c0 - c) * WCOL[c];
    for (let cc = c; cc < NC && cx < w; cc++) {
      const v = cell(kind, row, cc);
      const hl = hlOf(kind, row, cc);
      const base = (row === 3 || row === 9) && cc < pw;
      const ed = editOf(kind, row, cc);
      const live = !!ed && ed.editing;
      out.push(
        <div key={`${i}-${cc}`} style={{position: 'absolute', left: cx, top: off + i * RH, width: live ? 440 : WCOL[cc], height: RH, boxSizing: 'border-box', borderRight: `1px solid ${X.grid}`, borderBottom: `1px solid ${X.grid}`, padding: '0 4px', lineHeight: `${RH - 1}px`, fontSize: 12.5, whiteSpace: 'nowrap', overflow: live ? 'visible' : 'hidden', zIndex: live ? 4 : undefined, textAlign: v.n ? 'right' : 'left', background: live ? '#fff' : hl ?? (base ? '#DDEBF7' : '#fff'), color: '#000', fontWeight: hl || base ? 700 : 400}}>
          {v.t}
        </div>,
      );
      cx += WCOL[cc];
    }
  }
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', background: '#fff'}}>{out}</div>;
};
const hdrBase: React.CSSProperties = {position: 'absolute', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, borderRight: `1px solid ${X.line}`, borderBottom: `1px solid ${X.line}`};
const ColHdr: React.FC<{x: number; w: number; c0: number; selC: number}> = ({x, w, c0, selC}) => {
  const out: React.ReactNode[] = [];
  const c = Math.floor(c0);
  let cx = -(c0 - c) * WCOL[c];
  for (let cc = c; cc < NC && cx < w; cc++) {
    const s = cc === selC;
    out.push(<div key={cc} style={{...hdrBase, left: cx, top: 0, width: WCOL[cc], height: M.hdr, background: s ? X.gsel : '#F0F0F0', color: s ? X.green : '#444', fontWeight: s ? 700 : 400, borderBottom: s ? `2px solid ${X.green}` : `1px solid ${X.line}`}}>{colName(cc)}</div>);
    cx += WCOL[cc];
  }
  return <div style={{position: 'absolute', left: x, top: 0, width: w, height: M.hdr, overflow: 'hidden'}}>{out}</div>;
};
const RowHdr: React.FC<{y: number; h: number; r0: number; selR: number}> = ({y, h, r0, selR}) => {
  const out: React.ReactNode[] = [];
  const r = Math.floor(r0);
  const off = -(r0 - r) * RH;
  for (let i = 0; off + i * RH < h; i++) {
    const row = r + i;
    const s = row === selR;
    out.push(<div key={i} style={{...hdrBase, left: 0, top: off + i * RH, width: M.rowW, height: RH, background: s ? X.gsel : '#F0F0F0', color: s ? X.green : '#444', fontWeight: s ? 700 : 400, borderRight: s ? `2px solid ${X.green}` : `1px solid ${X.line}`}}>{row}</div>);
  }
  return <div style={{position: 'absolute', left: 0, top: y, width: M.rowW, height: h, overflow: 'hidden'}}>{out}</div>;
};
const Bar: React.FC<{vert: boolean; len: number; pos: number; thumb: number}> = ({vert, len, pos, thumb}) => (
  <div style={{position: 'absolute', background: '#F0F0F0', ...(vert ? {right: 0, top: M.hdr, width: M.sb, height: len} : {})}}>
    <div style={{position: 'absolute', left: 3, top: 14 + pos * (len - 28 - thumb), width: M.sb - 6, height: thumb, background: '#C1C1C1', borderRadius: 3}} />
    <div style={{position: 'absolute', left: 3, top: 3, fontSize: 7, color: '#777'}}>▲</div>
    <div style={{position: 'absolute', left: 3, bottom: 3, fontSize: 7, color: '#777'}}>▼</div>
  </div>
);
export type GridCfg = {kind: Kind; fr: number; fc: number; sr: number; sc: number; selR: number; selC: number; rangeR?: number; rangeC?: number; glow?: string; tint?: number; lines?: number};
export const cellXY = (g: Pick<GridCfg, 'fr' | 'fc' | 'sr' | 'sc'>, r: number, c: number) => {
  const fw = xOf(g.fc);
  const fh = g.fr * RH;
  const x = c < g.fc ? M.rowW + xOf(c) : M.rowW + fw + (xOf(c) - xOf(g.sc));
  const y = r <= g.fr ? M.hdr + (r - 1) * RH : M.hdr + fh + (r - g.sr) * RH;
  return {x, y, w: WCOL[c], h: RH};
};
export const gridTop = (ribbon: boolean) => M.title + M.tabs + (ribbon ? M.ribbon : 0) + M.formula;
export const cellWin = (g: Pick<GridCfg, 'fr' | 'fc' | 'sr' | 'sc'>, r: number, c: number, ribbon = true) => {
  const p = cellXY(g, r, c);
  return {x: p.x + p.w / 2, y: gridTop(ribbon) + p.y + p.h / 2};
};
const Sel: React.FC<{g: GridCfg; ox: number; oy: number; aw: number; ah: number}> = ({g, ox, oy, aw, ah}) => {
  const a = cellXY(g, g.selR, g.selC);
  const e = g.rangeR ? cellXY(g, g.rangeR, g.rangeC ?? g.selC) : a;
  const inFrR = g.selR <= g.fr;
  const inFrC = g.selC < g.fc;
  const fw = xOf(g.fc);
  const fh = g.fr * RH;
  const rx0 = inFrC ? ox : ox + fw;
  const rx1 = inFrC ? ox + fw : ox + aw;
  const ry0 = inFrR ? oy : oy + fh;
  const ry1 = inFrR ? oy + fh : oy + ah;
  const x0 = a.x, y0 = a.y, x1 = e.x + e.w, y1 = e.y + e.h;
  const rng = !!g.rangeR;
  return (
    <div style={{position: 'absolute', left: rx0, top: ry0, width: rx1 - rx0, height: ry1 - ry0, overflow: 'hidden', pointerEvents: 'none'}}>
      {rng && <div style={{position: 'absolute', left: x0 - rx0, top: y0 - ry0, width: x1 - x0, height: y1 - y0, background: 'rgba(33,115,70,.14)'}} />}
      <div style={{position: 'absolute', left: x0 - rx0 - 1, top: y0 - ry0 - 1, width: x1 - x0 + 1, height: y1 - y0 + 1, border: `2px solid ${X.green}`, boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: x1 - rx0 - 4, top: y1 - ry0 - 4, width: 7, height: 7, background: X.green, border: '1px solid #fff', boxSizing: 'border-box'}} />
    </div>
  );
};
export const Grid: React.FC<{gw: number; gh: number} & GridCfg> = (g) => {
  const ox = M.rowW, oy = M.hdr, aw = g.gw - ox - M.sb, ah = g.gh - oy;
  const fw = xOf(g.fc), fh = g.fr * RH;
  const fz = g.fr > 0 || g.fc > 0;
  const glow = g.glow ?? C.green;
  const ln = g.lines ?? 0;
  const thumb = Math.max(24, (ah / (NROWS * RH)) * (ah - 28));
  return (
    <div style={{position: 'absolute', inset: 0, background: '#fff'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: ox, height: oy, background: '#F0F0F0', borderRight: `1px solid ${X.line}`, borderBottom: `1px solid ${X.line}`}}>
        <div style={{position: 'absolute', right: 4, bottom: 3, width: 0, height: 0, borderLeft: '10px solid transparent', borderBottom: '10px solid #B5B5B5'}} />
      </div>
      <ColHdr x={ox} w={fw} c0={0} selC={g.selC} />
      <ColHdr x={ox + fw} w={aw - fw} c0={g.sc} selC={g.selC} />
      <RowHdr y={oy} h={fh} r0={1} selR={g.selR} />
      <RowHdr y={oy + fh} h={ah - fh} r0={g.sr} selR={g.selR} />
      {fz && g.fr > 0 && g.fc > 0 && <Block x={ox} y={oy} w={fw} h={fh} r0={1} c0={0} kind={g.kind} />}
      {g.fr > 0 && <Block x={ox + fw} y={oy} w={aw - fw} h={fh} r0={1} c0={g.sc} kind={g.kind} />}
      {g.fc > 0 && <Block x={ox} y={oy + fh} w={fw} h={ah - fh} r0={g.sr} c0={0} kind={g.kind} />}
      <Block x={ox + fw} y={oy + fh} w={aw - fw} h={ah - fh} r0={g.sr} c0={g.sc} kind={g.kind} />
      {g.selR > 0 && <Sel g={g} ox={ox} oy={oy} aw={aw} ah={ah} />}
      {fz && g.fr > 0 && <div style={{position: 'absolute', left: ox, top: oy + fh - 1, width: aw, height: 2, background: '#7A7A7A'}} />}
      {fz && g.fc > 0 && <div style={{position: 'absolute', left: ox + fw - 1, top: oy, width: 2, height: ah, background: '#7A7A7A'}} />}
      {ln > 0 && g.fr > 0 && <div style={{position: 'absolute', left: ox, top: oy + fh - 2, width: aw, height: 3, background: glow, opacity: ln, boxShadow: `0 0 7px ${glow}`}} />}
      {ln > 0 && g.fc > 0 && <div style={{position: 'absolute', left: ox + fw - 2, top: oy, width: 3, height: ah, background: glow, opacity: ln, boxShadow: `0 0 7px ${glow}`}} />}
      {(g.tint ?? 0) > 0 && g.fr > 0 && <div style={{position: 'absolute', left: ox, top: oy, width: aw, height: fh, background: glow, opacity: (g.tint ?? 0) * 0.18, pointerEvents: 'none'}} />}
      {(g.tint ?? 0) > 0 && g.fc > 0 && <div style={{position: 'absolute', left: ox, top: oy, width: fw, height: ah, background: glow, opacity: (g.tint ?? 0) * 0.18, pointerEvents: 'none'}} />}
      <Bar vert len={ah} pos={clamp((g.sr - 1) / NROWS)} thumb={thumb} />
    </div>
  );
};
export const SplitGrid: React.FC<{gw: number; gh: number; kind: Kind; sx: number; sy: number; rt: number; rb: number; cl: number; cr: number; glow?: string; selR?: number; selC?: number}> = (g) => {
  const ox = M.rowW, oy = M.hdr, aw = g.gw - ox - M.sb, ah = g.gh - oy, bar = 6;
  const glow = g.glow ?? C.purple;
  const rw = aw - g.sx - bar, bh = ah - g.sy - bar;
  const sR = g.selR ?? -1, sC = g.selC ?? -1;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#fff'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: ox, height: oy, background: '#F0F0F0', borderRight: `1px solid ${X.line}`, borderBottom: `1px solid ${X.line}`}} />
      <ColHdr x={ox} w={g.sx} c0={g.cl} selC={sC} />
      <ColHdr x={ox + g.sx + bar} w={rw} c0={g.cr} selC={sC} />
      <RowHdr y={oy} h={g.sy} r0={g.rt} selR={sR} />
      <RowHdr y={oy + g.sy + bar} h={bh} r0={g.rb} selR={sR} />
      <Block x={ox} y={oy} w={g.sx} h={g.sy} r0={g.rt} c0={g.cl} kind={g.kind} />
      <Block x={ox + g.sx + bar} y={oy} w={rw} h={g.sy} r0={g.rt} c0={g.cr} kind={g.kind} />
      <Block x={ox} y={oy + g.sy + bar} w={g.sx} h={bh} r0={g.rb} c0={g.cl} kind={g.kind} />
      <Block x={ox + g.sx + bar} y={oy + g.sy + bar} w={rw} h={bh} r0={g.rb} c0={g.cr} kind={g.kind} />
      <div style={{position: 'absolute', left: ox, top: oy + g.sy, width: aw, height: bar, background: '#BDBDBD', boxShadow: `0 0 10px ${glow}`, borderTop: `1px solid ${glow}`, borderBottom: `1px solid ${glow}`}} />
      <div style={{position: 'absolute', left: ox + g.sx, top: oy, width: bar, height: ah, background: '#BDBDBD', boxShadow: `0 0 10px ${glow}`, borderLeft: `1px solid ${glow}`, borderRight: `1px solid ${glow}`}} />
      <div style={{position: 'absolute', left: ox + g.sx - 5, top: oy + g.sy - 5, width: 16, height: 16, borderRadius: 8, background: glow, boxShadow: `0 0 14px ${glow}`}} />
      <Bar vert len={ah} pos={clamp((g.rb - 1) / NROWS)} thumb={24} />
    </div>
  );
};
/** growing split bars while the single grid is still shown */
export const SplitBars: React.FC<{gw: number; gh: number; sx: number; sy: number; p: number}> = ({gw, gh, sx, sy, p}) => {
  const ox = M.rowW, oy = M.hdr, aw = gw - ox - M.sb, ah = gh - oy;
  const c = C.purple;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: ox + sx - p * sx, top: oy + sy, width: p * aw, height: 6, background: c, boxShadow: `0 0 14px ${c}`}} />
      <div style={{position: 'absolute', left: ox + sx, top: oy + sy - p * sy, width: 6, height: p * ah, background: c, boxShadow: `0 0 14px ${c}`}} />
    </div>
  );
};

/* ───────── ribbon ───────── */
type It = {k: string; l: string; ic?: string; big?: boolean; w?: number; dd?: boolean; chk?: boolean; box?: boolean};
type Grp = {n: string; cols: It[][]};
const VIEW: Grp[] = [
  {n: 'Workbook Views', cols: [[{k: 'normal', l: 'Normal', ic: 'grid', big: true, w: 50}], [{k: 'pbp', l: 'Page Break\nPreview', ic: 'pbp', big: true, w: 62}], [{k: 'plv', l: 'Page\nLayout', ic: 'plv', big: true, w: 48}], [{k: 'cv', l: 'Custom\nViews', ic: 'cv', big: true, w: 52}]]},
  {n: 'Show', cols: [[{k: 'ruler', l: 'Ruler', chk: true, w: 76}, {k: 'grid', l: 'Gridlines', chk: true, w: 76}], [{k: 'fbar', l: 'Formula Bar', chk: true, w: 90}, {k: 'hdgs', l: 'Headings', chk: true, w: 90}]]},
  {n: 'Zoom', cols: [[{k: 'zoom', l: 'Zoom', ic: 'zoom', big: true, w: 44}], [{k: 'z100', l: '100%', ic: 'z100', big: true, w: 44}], [{k: 'zsel', l: 'Zoom to\nSelection', ic: 'zsel', big: true, w: 62}]]},
  {n: 'Window', cols: [[{k: 'neww', l: 'New\nWindow', ic: 'neww', big: true, w: 48}], [{k: 'arr', l: 'Arrange\nAll', ic: 'arr', big: true, w: 48}], [{k: 'frz', l: 'Freeze\nPanes', ic: 'frz', big: true, w: 52, dd: true}],
    [{k: 'split', l: 'Split', ic: 'split', w: 62}, {k: 'hide', l: 'Hide', ic: 'hide', w: 62}, {k: 'unhide', l: 'Unhide', ic: 'unhide', w: 62}],
    [{k: 'sbs', l: 'View Side by Side', ic: 'sbs', w: 138}, {k: 'sync', l: 'Synchronous Scrolling', ic: 'sync', w: 138}, {k: 'reset', l: 'Reset Window Position', ic: 'reset', w: 138}],
    [{k: 'swt', l: 'Switch\nWindows', ic: 'swt', big: true, w: 58, dd: true}]]},
  {n: 'Macros', cols: [[{k: 'macro', l: 'Macros', ic: 'macro', big: true, w: 50, dd: true}]]},
];
const HOME: Grp[] = [
  {n: 'Clipboard', cols: [[{k: 'paste', l: 'Paste', ic: 'g', big: true, w: 44, dd: true}], [{k: 'cut', l: 'Cut', ic: 'g', w: 84}, {k: 'copy', l: 'Copy', ic: 'g', w: 84, dd: true}, {k: 'fpt', l: 'Format Painter', ic: 'g', w: 84}]]},
  {n: 'Font', cols: [[{k: 'font', l: 'Calibri', box: true, dd: true, w: 104}, {k: 'biu', l: 'B   I   U   ▾', box: true, w: 104}], [{k: 'fsz', l: '11', box: true, dd: true, w: 48}, {k: 'brd', l: '⊞ ▾  A ▾', box: true, w: 48}]]},
  {n: 'Alignment', cols: [[{k: 'al1', l: '≡  ≡  ≡', box: true, w: 80}, {k: 'al2', l: '≡  ≡  ≡', box: true, w: 80}], [{k: 'wrap', l: 'Wrap Text', ic: 'g', w: 94}, {k: 'mrg', l: 'Merge & Center', ic: 'g', w: 94, dd: true}]]},
  {n: 'Number', cols: [[{k: 'num', l: 'General', box: true, dd: true, w: 96}, {k: 'num2', l: '$ ▾  %  ,  .0', box: true, w: 96}]]},
  {n: 'Styles', cols: [[{k: 'cf', l: 'Conditional\nFormatting', ic: 'g', big: true, w: 70, dd: true}], [{k: 'fat', l: 'Format as\nTable', ic: 'g', big: true, w: 56, dd: true}], [{k: 'cs', l: 'Cell\nStyles', ic: 'g', big: true, w: 46, dd: true}]]},
  {n: 'Cells', cols: [[{k: 'ins', l: 'Insert', ic: 'g', big: true, w: 44, dd: true}], [{k: 'del', l: 'Delete', ic: 'g', big: true, w: 44, dd: true}], [{k: 'fmt', l: 'Format', ic: 'g', big: true, w: 44, dd: true}]]},
  {n: 'Editing', cols: [[{k: 'sum', l: 'AutoSum', ic: 'g', w: 70, dd: true}, {k: 'fill', l: 'Fill', ic: 'g', w: 70, dd: true}, {k: 'clr', l: 'Clear', ic: 'g', w: 70, dd: true}], [{k: 'sort', l: 'Sort &\nFilter', ic: 'g', big: true, w: 48, dd: true}], [{k: 'find', l: 'Find &\nSelect', ic: 'g', big: true, w: 52, dd: true}]]},
];
const PIV: Grp[] = [
  {n: 'PivotTable', cols: [[{k: 'pvlbl', l: 'PivotTable Name:', ic: '', w: 104}, {k: 'pvname', l: 'PivotTable1', box: true, w: 104}, {k: 'popt', l: 'Options', ic: 'g', w: 104, dd: true}]]},
  {n: 'Active Field', cols: [[{k: 'aflbl', l: 'Active Field:', ic: '', w: 124}, {k: 'afbox', l: 'Sum of Sales', box: true, w: 124}, {k: 'afset', l: 'Field Settings', ic: 'g', w: 124}]]},
  {n: 'Group', cols: [[{k: 'grp', l: 'Group Selection', ic: 'g', w: 112}, {k: 'ungrp', l: 'Ungroup', ic: 'g', w: 112}, {k: 'grpf', l: 'Group Field', ic: 'g', w: 112}]]},
  {n: 'Filter', cols: [[{k: 'slic', l: 'Insert\nSlicer', ic: 'g', big: true, w: 48}], [{k: 'tlin', l: 'Insert\nTimeline', ic: 'g', big: true, w: 52}], [{k: 'fconn', l: 'Filter\nConnections', ic: 'g', big: true, w: 62}]]},
  {n: 'Data', cols: [[{k: 'refresh', l: 'Refresh', ic: 'reset', big: true, w: 50, dd: true}], [{k: 'chds', l: 'Change Data\nSource', ic: 'g', big: true, w: 66, dd: true}]]},
  {n: 'Actions', cols: [[{k: 'clr', l: 'Clear', ic: 'g', w: 96, dd: true}, {k: 'sel', l: 'Select', ic: 'g', w: 96, dd: true}, {k: 'mov', l: 'Move PivotTable', ic: 'g', w: 96}]]},
  {n: 'Calculations', cols: [[{k: 'calc', l: 'Fields, Items\n& Sets', ic: 'g', big: true, w: 72, dd: true}]]},
  {n: 'Tools', cols: [[{k: 'pchart', l: 'PivotChart', ic: 'g', big: true, w: 58}], [{k: 'recp', l: 'Recommended\nPivotTables', ic: 'g', big: true, w: 78}]]},
];
const PPH: Grp[] = [
  {n: 'Clipboard', cols: [[{k: 'ppaste', l: 'Paste', ic: 'g', big: true, w: 40, dd: true}]]},
  {n: 'Get External Data', cols: [[{k: 'getext', l: 'From\nDatabase', ic: 'g', big: true, w: 58, dd: true}]]},
  {n: 'Refresh', cols: [[{k: 'ppref', l: 'Refresh', ic: 'reset', big: true, w: 48, dd: true}]]},
  {n: 'PivotTable', cols: [[{k: 'pptbl', l: 'PivotTable', ic: 'g', big: true, w: 56, dd: true}]]},
  {n: 'Formatting', cols: [[{k: 'dtype', l: 'Data Type: Whole Number', box: true, w: 118, dd: true}, {k: 'ffmt', l: 'Format: General', box: true, w: 118, dd: true}, {k: 'fcur', l: '$ ▾   %   ,   .0   .00', box: true, w: 118}]]},
  {n: 'Sort and Filter', cols: [[{k: 'sorta', l: 'Sort A to Z', ic: 'g', w: 90}, {k: 'sortz', l: 'Sort Z to A', ic: 'g', w: 90}, {k: 'csort', l: 'Clear All Sorts', ic: 'g', w: 90}]]},
  {n: 'Find', cols: [[{k: 'pfind', l: 'Find', ic: 'zoom', big: true, w: 38}]]},
  {n: 'Calculations', cols: [[{k: 'asum', l: 'AutoSum', ic: 'g', w: 72, dd: true}, {k: 'kpi', l: 'Create KPI', ic: 'g', w: 72, dd: true}]]},
  {n: 'View', cols: [[{k: 'dview', l: 'Data\nView', ic: 'grid', big: true, w: 44}], [{k: 'diag', l: 'Diagram\nView', ic: 'arr', big: true, w: 50}], [{k: 'hidden', l: 'Show\nHidden', ic: 'g', big: true, w: 46}], [{k: 'carea', l: 'Calculation\nArea', ic: 'g', big: true, w: 64}]]},
];
type RB = {g: string; gx: number; gw: number; items: {it: It; x: number; y: number; w: number; h: number}[]};
const layout = (spec: Grp[]): RB[] => {
  let x = 4;
  const out: RB[] = [];
  for (const g of spec) {
    const gx = x;
    let cx = x + 5;
    const items: RB['items'] = [];
    for (const col of g.cols) {
      const w = Math.max(...col.map((i) => i.w ?? 56));
      col.forEach((it, i) => items.push({it, x: cx, y: it.big ? 4 : 4 + i * 22, w, h: it.big ? 66 : 22}));
      cx += w;
    }
    out.push({g: g.n, gx, gw: cx + 5 - gx, items});
    x = cx + 5;
  }
  return out;
};
const LV = layout(VIEW);
const LH = layout(HOME);
const LP = layout(PIV);
const LPP = layout(PPH);
/** Power Pivot Home button rects (window-logical px) */
export const PPB: Record<string, {x: number; y: number; w: number; h: number}> = {};
LPP.forEach((g) => g.items.forEach((i) => { PPB[i.it.k] = {x: i.x, y: i.y + M.title + M.tabs, w: i.w, h: i.h}; }));
/** PivotTable Analyze button rects, in window-logical px */
export const PB: Record<string, {x: number; y: number; w: number; h: number}> = {};
LP.forEach((g) => g.items.forEach((i) => { PB[i.it.k] = {x: i.x, y: i.y + M.title + M.tabs, w: i.w, h: i.h}; }));
/** View-tab button rects, in window-logical px */
export const VB: Record<string, {x: number; y: number; w: number; h: number}> = {};
LV.forEach((g) => g.items.forEach((i) => { VB[i.it.k] = {x: i.x, y: i.y + M.title + M.tabs, w: i.w, h: i.h}; }));
export const TABS: [string, number][] = [['File', 38], ['Home', 44], ['Insert', 48], ['Draw', 42], ['Page Layout', 84], ['Formulas', 58], ['Data', 40], ['Review', 52], ['View', 42], ['Automate', 62], ['Help', 40]];
export const TABX: Record<string, {x: number; w: number}> = {};
export const CTX: [string, number][] = [['PivotTable Analyze', 104], ['Design', 46]];
(() => { let x = 10; [...TABS, ...CTX].forEach(([n, w]) => { TABX[n] = {x, w}; x += w + 8; }); })();
const KT: Record<string, string> = {File: 'F', Home: 'H', Insert: 'N', Draw: 'JI', 'Page Layout': 'P', Formulas: 'M', Data: 'A', Review: 'R', View: 'W'};

const Ico: React.FC<{k: string; s: number}> = ({k, s}) => {
  const g = X.green, b = '#2B7CD3', d = '#555', o = '#C55A11';
  const R = (x: number, y: number, w: number, h: number, f = 'none', st = d, sw = 1.2) => <rect x={x} y={y} width={w} height={h} fill={f} stroke={st} strokeWidth={sw} rx={1} />;
  const L = (a: number, b2: number, c: number, e: number, st = d, sw = 1.2) => <line x1={a} y1={b2} x2={c} y2={e} stroke={st} strokeWidth={sw} />;
  let el: React.ReactNode;
  switch (k) {
    case 'grid': el = <g>{R(3, 4, 18, 16, '#fff')}{L(3, 9, 21, 9)}{L(3, 14, 21, 14)}{L(9, 4, 9, 20)}{L(15, 4, 15, 20)}</g>; break;
    case 'pbp': el = <g>{R(4, 3, 16, 18, '#fff')}{L(4, 12, 20, 12, b, 2)}{L(12, 3, 12, 21, b, 2)}</g>; break;
    case 'plv': el = <g>{R(4, 3, 16, 18, '#fff')}{L(7, 8, 17, 8)}{L(7, 12, 17, 12)}{L(7, 16, 14, 16)}</g>; break;
    case 'cv': el = <g>{R(3, 5, 18, 14, '#fff')}<circle cx={12} cy={12} r={3.5} fill="none" stroke={b} strokeWidth={1.5} /></g>; break;
    case 'zoom': el = <g><circle cx={10} cy={10} r={6} fill="#fff" stroke={d} strokeWidth={1.5} />{L(15, 15, 21, 21, d, 2.2)}</g>; break;
    case 'z100': el = <g><circle cx={10} cy={10} r={6} fill="#fff" stroke={d} strokeWidth={1.5} />{L(15, 15, 21, 21, d, 2.2)}<text x={5.4} y={12.4} fontSize={6.5} fill={g} fontWeight={700}>100</text></g>; break;
    case 'zsel': el = <g><circle cx={10} cy={10} r={6} fill="#fff" stroke={d} strokeWidth={1.5} />{L(15, 15, 21, 21, d, 2.2)}{R(7, 7, 6, 6, 'none', g, 1)}</g>; break;
    case 'neww': el = <g>{R(3, 5, 18, 15, '#fff')}{R(3, 5, 18, 4, b, b)}{L(12, 12, 12, 18, g, 2)}{L(9, 15, 15, 15, g, 2)}</g>; break;
    case 'arr': el = <g>{R(3, 4, 8, 7, '#fff')}{R(13, 4, 8, 7, '#fff')}{R(3, 13, 8, 7, '#fff')}{R(13, 13, 8, 7, '#fff')}</g>; break;
    case 'frz': el = <g>{R(3, 4, 18, 16, '#fff')}{R(3, 4, 18, 5, '#BFE0CC', g)}{R(3, 4, 5, 16, '#BFE0CC', g)}{L(3, 9, 21, 9, g, 2)}{L(8, 4, 8, 20, g, 2)}</g>; break;
    case 'split': el = <g>{R(3, 4, 18, 16, '#fff')}{L(3, 12, 21, 12, d, 3)}{L(12, 4, 12, 20, d, 3)}</g>; break;
    case 'hide': el = <g>{R(3, 5, 18, 14, '#fff')}{L(7, 12, 17, 12, o, 2)}</g>; break;
    case 'unhide': el = <g>{R(3, 5, 18, 14, '#fff')}{L(7, 12, 17, 12, g, 2)}{L(12, 7, 12, 17, g, 2)}</g>; break;
    case 'sbs': el = <g>{R(2, 4, 9, 16, '#fff')}{R(13, 4, 9, 16, '#fff')}{L(4, 9, 9, 9, b)}{L(15, 9, 20, 9, b)}</g>; break;
    case 'sync': el = <g>{R(2, 4, 9, 16, '#fff')}{R(13, 4, 9, 16, '#fff')}{L(6.5, 7, 6.5, 17, b, 2)}{L(17.5, 7, 17.5, 17, b, 2)}</g>; break;
    case 'reset': el = <g>{R(3, 5, 18, 14, '#fff')}{L(7, 14, 15, 9, b, 1.6)}</g>; break;
    case 'swt': el = <g>{R(7, 3, 14, 11, '#fff')}{R(3, 9, 14, 11, '#fff')}</g>; break;
    case 'macro': el = <g><circle cx={12} cy={12} r={7} fill="#fff" stroke={d} strokeWidth={1.5} /><circle cx={12} cy={12} r={3} fill={o} /></g>; break;
    default: {
      let n = 0;
      for (let i = 0; i < k.length; i++) n += k.charCodeAt(i);
      el = <g>{R(4, 4, 16, 16, '#fff', n % 2 ? g : b, 1.4)}{L(7, 9, 17, 9)}{L(7, 13, 17, 13)}{L(7, 17, 13, 17)}</g>;
    }
  }
  return <svg width={s} height={s} viewBox="0 0 24 24">{el}</svg>;
};
const Ribbon: React.FC<{tab: string; hl?: string; pr?: string}> = ({tab, hl, pr}) => {
  const L = tab === 'View' ? LV : tab === 'PivotTable Analyze' ? LP : tab === 'PPHome' ? LPP : LH;
  return (
    <div style={{position: 'absolute', left: 0, top: M.title + M.tabs, width: '100%', height: M.ribbon, background: X.ribbon, borderTop: `1px solid ${X.line}`, borderBottom: `1px solid ${X.line}`, overflow: 'hidden'}}>
      {L.map((g) => (
        <div key={g.g}>
          <div style={{position: 'absolute', left: g.gx + g.gw - 1, top: 6, width: 1, height: 78, background: X.line}} />
          <div style={{position: 'absolute', left: g.gx, width: g.gw, top: 74, textAlign: 'center', fontSize: 10.5, color: X.dim}}>{g.g}</div>
          {g.items.map(({it, x, y, w, h}) => {
            if (!it.l && !it.ic) return null;
            const on = hl === it.k, p = pr === it.k;
            const st: React.CSSProperties = {position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', borderRadius: 4, background: p ? '#CFCFCF' : on ? '#E3E3E3' : 'transparent', border: on || p ? '1px solid #BDBDBD' : '1px solid transparent', fontSize: 11, color: X.text, whiteSpace: 'pre', textAlign: 'center'};
            if (it.box) return <div key={it.k} style={{...st, border: '1px solid #BDBDBD', background: '#fff', lineHeight: '20px', borderRadius: 2, padding: '0 4px', textAlign: 'left'}}>{it.l}{it.dd ? <span style={{float: 'right', fontSize: 8}}>▾</span> : null}</div>;
            if (it.chk) return <div key={it.k} style={{...st, textAlign: 'left', lineHeight: '20px', paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 6}}><div style={{width: 12, height: 12, border: '1px solid #666', background: '#fff', color: X.green, fontSize: 11, lineHeight: '11px', textAlign: 'center'}}>{it.k === 'ruler' ? '' : '✓'}</div>{it.l}</div>;
            if (it.big) return <div key={it.k} style={{...st, paddingTop: 3}}><div style={{display: 'flex', justifyContent: 'center'}}><Ico k={it.ic ?? 'g'} s={30} /></div><div style={{lineHeight: '12px', marginTop: 2}}>{it.l}{it.dd ? ' ▾' : ''}</div></div>;
            return <div key={it.k} style={{...st, display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4, textAlign: 'left'}}>{it.ic !== '' && <Ico k={it.ic ?? 'g'} s={16} />}{it.l}{it.dd ? ' ▾' : ''}</div>;
          })}
        </div>
      ))}
    </div>
  );
};

/* ───────── window chrome ───────── */
export const shRect = (names: string[], i: number) => {
  let x = 70;
  for (let k = 0; k < i; k++) x += 24 + names[k].length * 7.4 + 14;
  return {x, w: 24 + names[i].length * 7.4 + 14};
};
export const winH = (h: number) => h / Z;
export const sheetY = (h: number) => winH(h) - M.status - M.sheet;
export type Sheet = {n: string; c?: string};
export type WinProps = {
  x: number; y: number; w: number; h: number; title: string; group?: boolean; groupGlow?: number; tab: string; ribbon?: boolean; hl?: string; pr?: string;
  sheets: Sheet[]; act: number; sel?: number[]; nameBox: string; formula: string; stats?: string; glow?: string; keytips?: boolean; ctx?: boolean;
  children: (g: {gw: number; gh: number}) => React.ReactNode; over?: React.ReactNode;
};
export const Win: React.FC<WinProps> = (p) => {
  const WL = p.w / Z, HL = p.h / Z;
  const rb = p.ribbon ?? true;
  const gy = gridTop(rb);
  const gh = HL - gy - M.sheet - M.status;
  const wide = WL > 900;
  const sel = p.sel ?? [p.act];
  const names = p.sheets.map((s) => s.n);
  return (
    <div style={{position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h, overflow: 'hidden', borderRadius: 10, background: '#fff', boxShadow: p.glow ? `0 0 0 3px ${p.glow}, 0 0 46px ${p.glow}` : '0 30px 80px rgba(0,0,0,.55)'}}>
      <div style={{width: WL, height: HL, transform: `scale(${Z})`, transformOrigin: '0 0', position: 'relative', fontFamily: ui, fontSize: 12, color: X.text, background: '#fff'}}>
        {/* title bar */}
        <div style={{position: 'absolute', left: 0, top: 0, width: WL, height: M.title, background: '#fff', display: 'flex', alignItems: 'center'}}>
          <div style={{marginLeft: 10, width: 18, height: 18, borderRadius: 4, background: X.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico k="grid" s={14} /></div>
          {wide && <div style={{marginLeft: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11}}>AutoSave <div style={{width: 28, height: 14, borderRadius: 7, border: '1px solid #777', position: 'relative'}}><div style={{position: 'absolute', left: 2, top: 2, width: 8, height: 8, borderRadius: 4, background: '#777'}} /></div>Off</div>}
          {wide && <div style={{marginLeft: 14, letterSpacing: 8, color: '#555', fontSize: 13}}>▣ ↶ ↷</div>}
          <div style={{marginLeft: wide ? 18 : 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, whiteSpace: 'nowrap'}}>
            {p.title}
            {p.group && <span style={{background: '#38BDF8', color: '#0F172A', fontWeight: 700, borderRadius: 4, padding: '0 6px', lineHeight: '18px', boxShadow: `0 0 ${14 * (p.groupGlow ?? 1)}px #38BDF8`}}>[Group]</span>}
          </div>
          {wide && <div style={{position: 'absolute', left: 600, top: 4, width: 300, height: 24, border: '1px solid #C8C8C8', borderRadius: 4, background: '#fff', fontSize: 12, color: '#777', lineHeight: '22px', paddingLeft: 10, boxSizing: 'border-box'}}>🔍 Search</div>}
          <div style={{position: 'absolute', right: 0, top: 0, display: 'flex', fontSize: 14, color: '#333'}}>
            {['—', '▢', '✕'].map((s) => <div key={s} style={{width: 46, height: M.title, textAlign: 'center', lineHeight: `${M.title}px`}}>{s}</div>)}
          </div>
        </div>
        {/* tabs */}
        <div style={{position: 'absolute', left: 0, top: M.title, width: WL, height: M.tabs, background: '#fff'}}>
          {[...TABS, ...(p.ctx ? CTX : [])].map(([n, w]) => {
            const a = n === p.tab;
            return (
              <div key={n} style={{position: 'absolute', left: TABX[n].x, top: 0, width: w, height: M.tabs, textAlign: 'center', lineHeight: `${M.tabs - 2}px`, fontSize: 12.5, color: a ? X.green : '#333', fontWeight: a ? 700 : 400, borderBottom: a ? `3px solid ${X.green}` : '3px solid transparent', boxSizing: 'border-box', boxShadow: n === 'PivotTable Analyze' || n === 'Design' ? 'inset 0 3px 0 #8E9AAF' : 'none'}}>
                {n}
                {p.keytips && KT[n] && <div style={{position: 'absolute', left: w / 2 - 8, top: 17, minWidth: 16, height: 14, background: '#262626', color: '#fff', fontSize: 9.5, lineHeight: '14px', borderRadius: 2, fontWeight: 700}}>{KT[n]}</div>}
              </div>
            );
          })}
        </div>
        {rb && <Ribbon tab={p.tab} hl={p.hl} pr={p.pr} />}
        {/* formula bar */}
        <div style={{position: 'absolute', left: 0, top: gy - M.formula, width: WL, height: M.formula, background: X.ribbon, borderBottom: `1px solid ${X.line}`}}>
          <div style={{position: 'absolute', left: 4, top: 3, width: 90, height: 21, border: '1px solid #C8C8C8', background: '#fff', lineHeight: '19px', paddingLeft: 6, boxSizing: 'border-box', fontSize: 12.5}}>{p.nameBox}<span style={{position: 'absolute', right: 5, fontSize: 8, color: '#555'}}>▾</span></div>
          <div style={{position: 'absolute', left: 104, top: 3, width: 76, height: 21, lineHeight: '21px', fontSize: 14, color: '#555', letterSpacing: 10}}>⋮ ✕ ✓</div>
          <div style={{position: 'absolute', left: 168, top: 3, width: 24, height: 21, lineHeight: '21px', fontSize: 12, fontStyle: 'italic', fontWeight: 700, color: '#444'}}>fx</div>
          <div style={{position: 'absolute', left: 196, top: 3, right: 20, height: 21, border: '1px solid #C8C8C8', background: '#fff', lineHeight: '19px', paddingLeft: 6, boxSizing: 'border-box', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden'}}>{p.formula}</div>
        </div>
        <div style={{position: 'absolute', left: 0, top: gy, width: WL, height: gh, overflow: 'hidden'}}>{p.children({gw: WL, gh})}</div>
        {/* sheet bar */}
        <div style={{position: 'absolute', left: 0, top: HL - M.status - M.sheet, width: WL, height: M.sheet, background: X.chrome, borderTop: `1px solid ${X.line}`}}>
          <div style={{position: 'absolute', left: 8, top: 5, fontSize: 10, color: '#777', letterSpacing: 8}}>◀ ▶</div>
          {p.sheets.map((s, i) => {
            const r = shRect(names, i);
            const on = sel.includes(i);
            const act = i === p.act;
            return (
              <div key={s.n} style={{position: 'absolute', left: r.x, top: 0, width: r.w, height: M.sheet, boxSizing: 'border-box', textAlign: 'center', lineHeight: `${M.sheet - 4}px`, fontSize: 12.5, background: on ? '#fff' : s.c ? `linear-gradient(#F3F3F3, ${s.c}55)` : 'transparent', color: on ? (act ? X.green : '#222') : '#444', fontWeight: act ? 700 : 400, boxShadow: on ? '0 -1px 0 #D1D1D1, 1px 0 0 #D1D1D1, -1px 0 0 #D1D1D1' : 'none'}}>
                {s.n}
                {s.c && <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: s.c}} />}
                {on && !s.c && act && <div style={{position: 'absolute', left: 6, right: 6, bottom: 0, height: 2, background: X.green}} />}
              </div>
            );
          })}
          <div style={{position: 'absolute', left: shRect(names, names.length - 1).x + shRect(names, names.length - 1).w + 10, top: 3, width: 20, height: 20, borderRadius: 10, border: '1px solid #999', textAlign: 'center', lineHeight: '17px', fontSize: 16, color: '#555'}}>+</div>
          <div style={{position: 'absolute', right: 20, top: 11, width: 220, height: 6, background: '#DDD', borderRadius: 3}}><div style={{width: 60, height: 6, background: '#AAA', borderRadius: 3}} /></div>
        </div>
        {/* status bar */}
        <div style={{position: 'absolute', left: 0, bottom: 0, width: WL, height: M.status, background: X.chrome, borderTop: `1px solid ${X.line}`, fontSize: 11.5, lineHeight: `${M.status}px`, color: '#444'}}>
          <span style={{marginLeft: 10}}>Ready</span>
          {wide && <span style={{marginLeft: 24, color: '#666'}}>♿ Accessibility: Good to go</span>}
          {p.stats && <span style={{position: 'absolute', right: 300, top: 0}}>{p.stats}</span>}
          <span style={{position: 'absolute', right: 12, top: 0, letterSpacing: 4}}>▦ ▤ ▥ &nbsp; − ──●── + 100%</span>
        </div>
        {p.over}
      </div>
    </div>
  );
};

/* ───────── menus / dialogs (logical coords inside a window) ───────── */
export type MI = {l: string; sub?: boolean; hl?: boolean; dis?: boolean; d?: string; chk?: boolean};
export const MENU_IH = 22;
export const Menu: React.FC<{x: number; y: number; w: number; items: MI[]}> = ({x, y, w, items}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,.28)', padding: '4px 0', zIndex: 5}}>
    {items.map((m) => (
      <div key={m.l} style={{height: m.d ? 52 : MENU_IH, boxSizing: 'border-box', margin: '0 4px', borderRadius: 3, padding: m.d ? '5px 8px' : '0 8px', lineHeight: `${MENU_IH}px`, fontSize: 12.5, background: m.hl ? '#CCE4F7' : 'transparent', color: m.dis ? '#A0A0A0' : '#222', display: 'flex', justifyContent: 'space-between', flexDirection: m.d ? 'column' : 'row'}}>
        <span style={{fontWeight: m.d ? 700 : 400, lineHeight: '16px'}}>{m.chk !== undefined && <span style={{display: 'inline-block', width: 20, color: X.green, fontWeight: 700}}>{m.chk ? '✓' : ''}</span>}{m.l}</span>
        {m.d && <span style={{fontSize: 10.5, lineHeight: '12px', color: '#555'}}>{m.d}</span>}
        {m.sub && <span>▸</span>}
      </div>
    ))}
  </div>
);
export const THEME_ROW = ['#FFFFFF', '#000000', '#E7E6E6', '#44546A', '#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'];
export const STD_ROW = ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'];
export const SUB_H = 226;
export const SUB_W = 196;
const shade = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(a >= 0 ? v + (255 - v) * a : v * (1 + a));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
export const ColorSub: React.FC<{x: number; y: number; hover?: number}> = ({x, y, hover}) => (
  <div style={{position: 'absolute', left: x, top: y, width: SUB_W, height: SUB_H, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,.28)', zIndex: 6, fontSize: 11.5, color: '#333'}}>
    <div style={{position: 'absolute', left: 8, top: 4}}>Theme Colors</div>
    {[0, 1, 2, 3, 4, 5].map((r) => THEME_ROW.map((c, i) => <div key={`${r}${i}`} style={{position: 'absolute', left: 8 + i * 18, top: 22 + r * 18, width: 16, height: 16, background: r === 0 ? c : shade(c, [0, 0.8, 0.6, 0.4, -0.25, -0.5][r]), border: '1px solid #DDD', boxSizing: 'border-box'}} />))}
    <div style={{position: 'absolute', left: 8, top: 134}}>Standard Colors</div>
    {STD_ROW.map((c, i) => <div key={c} style={{position: 'absolute', left: 8 + i * 18, top: 150, width: 16, height: 16, background: c, border: hover === i ? '2px solid #1B6FD1' : '1px solid #DDD', boxSizing: 'border-box', transform: hover === i ? 'scale(1.25)' : 'none'}} />)}
    <div style={{position: 'absolute', left: 8, top: 176, lineHeight: '22px'}}>▫ No Color</div>
    <div style={{position: 'absolute', left: 8, top: 198, lineHeight: '22px'}}>🎨 More Colors…</div>
  </div>
);
export const FreezeMenu: React.FC<{x: number; y: number; frozen: boolean; hover: number}> = ({x, y, frozen, hover}) => (
  <Menu x={x} y={y} w={300} items={[
    {l: frozen ? 'Unfreeze Panes' : 'Freeze Panes', d: frozen ? 'Unlock all rows and columns to scroll through the entire worksheet.' : 'Keep rows and columns visible while the rest of the worksheet scrolls (based on current selection).', hl: hover === 0},
    {l: 'Freeze Top Row', d: 'Keep the top row visible while scrolling through the rest of the worksheet.', hl: hover === 1},
    {l: 'Freeze First Column', d: 'Keep the first column visible while scrolling through the rest of the worksheet.', hl: hover === 2},
  ]} />
);
export const ArrangeDlg: React.FC<{x: number; y: number; pick: number; ok: boolean}> = ({x, y, pick, ok}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 330 * Z, height: 206 * Z, transform: 'none'}}>
    <div style={{width: 330, height: 206, transform: `scale(${Z})`, transformOrigin: '0 0', background: '#F0F0F0', border: '1px solid #8A8A8A', boxShadow: '0 12px 40px rgba(0,0,0,.5)', fontFamily: ui, fontSize: 12.5, color: '#222', position: 'relative'}}>
      <div style={{height: 28, background: '#fff', lineHeight: '28px', paddingLeft: 10}}>Arrange Windows<span style={{position: 'absolute', right: 14}}>✕</span></div>
      <div style={{position: 'absolute', left: 12, top: 40, width: 306, height: 106, border: '1px solid #BBB'}}>
        <div style={{position: 'absolute', left: 8, top: -9, background: '#F0F0F0', padding: '0 4px'}}>Arrange</div>
        {['Tiled', 'Horizontal', 'Vertical', 'Cascade'].map((n, i) => (
          <div key={n} style={{position: 'absolute', left: 16, top: 14 + i * 22, display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 13, height: 13, borderRadius: 7, border: '1px solid #444', background: '#fff', position: 'relative'}}>{pick === i && <div style={{position: 'absolute', left: 3, top: 3, width: 7, height: 7, borderRadius: 4, background: '#1B6FD1'}} />}</div>{n}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 14, top: 154, display: 'flex', alignItems: 'center', gap: 8}}><div style={{width: 13, height: 13, border: '1px solid #444', background: '#fff', color: '#1B6FD1', fontSize: 11, lineHeight: '12px', textAlign: 'center'}}>✓</div>Windows of active workbook</div>
      <div style={{position: 'absolute', left: 168, top: 174, width: 70, height: 24, background: '#E1E1E1', border: ok ? '2px solid #1B6FD1' : '1px solid #1B6FD1', textAlign: 'center', lineHeight: '22px', boxSizing: 'border-box'}}>OK</div>
      <div style={{position: 'absolute', left: 246, top: 174, width: 70, height: 24, background: '#E1E1E1', border: '1px solid #ADADAD', textAlign: 'center', lineHeight: '22px', boxSizing: 'border-box'}}>Cancel</div>
    </div>
  </div>
);

export const Tip: React.FC<{x: number; y: number; text: string}> = ({x, y, text}) => (
  <div style={{position: 'absolute', left: x, top: y, background: '#FFFFE1', border: '1px solid #8A8A8A', padding: '2px 6px', fontSize: 11, whiteSpace: 'nowrap', zIndex: 8, boxShadow: '1px 2px 4px rgba(0,0,0,.25)', fontFamily: ui, color: '#000'}}>{text}</div>
);
const GHOSTS = ['Luxor', 'Tanta'];
/** PivotTable row-label filter dropdown; ghost = 0..1 (deleted items still listed until the cache is cleaned) */
export const FilterMenu: React.FC<{x: number; y: number; hl: number; ghost: number}> = ({x, y, hl, ghost}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 214, background: '#fff', border: '1px solid #C8C8C8', borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,.28)', zIndex: 6, fontFamily: ui, fontSize: 12.5, color: '#222', paddingBottom: 6}}>
    {['Sort A to Z', 'Sort Z to A'].map((l, i) => <div key={l} style={{height: 22, lineHeight: '22px', padding: '0 10px', margin: '4px 4px 0', borderRadius: 3, background: hl === i ? '#CCE4F7' : 'transparent'}}>{l}</div>)}
    <div style={{height: 1, background: '#DDD', margin: '6px 6px'}} />
    <div style={{margin: '0 8px 4px', height: 22, border: '1px solid #BBB', lineHeight: '20px', paddingLeft: 6, color: '#888', fontSize: 11.5}}>Search</div>
    <div style={{margin: '0 8px', border: '1px solid #DDD', padding: '2px 0'}}>
      {['(Select All)', 'Alex', 'Aswan', 'Cairo', 'Giza', 'Luxor', 'Mansoura', 'Tanta'].map((n) => {
        const g = GHOSTS.includes(n);
        return (
          <div key={n} style={{height: g ? 18 * ghost : 18, lineHeight: '18px', overflow: 'hidden', opacity: g ? ghost : 1, padding: '0 6px', display: 'flex', gap: 6, color: g ? '#8A8A8A' : '#222', fontStyle: g ? 'italic' : 'normal'}}>
            <span style={{display: 'inline-block', width: 12, height: 12, border: '1px solid #666', marginTop: 3, lineHeight: '11px', fontSize: 11, color: X.green, textAlign: 'center'}}>✓</span>{n}
          </div>
        );
      })}
    </div>
    <div style={{display: 'flex', justifyContent: 'flex-end', gap: 6, margin: '8px 8px 0'}}>
      {['OK', 'Cancel'].map((b) => <div key={b} style={{width: 64, height: 22, border: '1px solid #ADADAD', background: '#E1E1E1', textAlign: 'center', lineHeight: '20px'}}>{b}</div>)}
    </div>
  </div>
);
/** PivotTable Options dialog (screen space, scaled like the window). tab: 0 = Layout & Format, 4 = Data */
export const DLG = {x: 608, y: 150, w: 704, h: 768};
export const DLGP = (lx: number, ly: number) => ({x: DLG.x + lx * Z, y: DLG.y + ly * Z});
export const DPOS = {tabLayout: {x: 56, y: 84}, tabData: {x: 330, y: 84}, save: {x: 30, y: 131}, details: {x: 30, y: 155}, refresh: {x: 30, y: 179}, dd: {x: 327, y: 243}, ddNone: {x: 300, y: 284}, ok: {x: 302, y: 457}};
export const PivotOptDlg: React.FC<{tab: number; save: boolean; details: boolean; refresh: boolean; retain: string; ddOpen: boolean; ddHl: number; okHl: boolean; ring?: string; ringC?: string}> = (p) => {
  const cb = (x: number, y: number, on: boolean, l: string) => (
    <div key={l} style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'}}>
      <div style={{width: 13, height: 13, border: '1px solid #444', background: '#fff', color: '#1B6FD1', fontSize: 11, lineHeight: '12px', textAlign: 'center'}}>{on ? '✓' : ''}</div>{l}
    </div>
  );
  const tabs: [string, number, number][] = [['Layout & Format', 8, 96], ['Totals & Filters', 104, 92], ['Display', 196, 56], ['Printing', 252, 56], ['Data', 308, 44], ['Alt Text', 352, 58]];
  return (
    <div style={{position: 'absolute', left: DLG.x, top: DLG.y, width: DLG.w, height: DLG.h, zIndex: 90}}>
      <div style={{width: 440, height: 480, transform: `scale(${Z})`, transformOrigin: '0 0', background: '#F0F0F0', border: '1px solid #8A8A8A', boxShadow: '0 16px 50px rgba(0,0,0,.55)', fontFamily: ui, fontSize: 12.5, color: '#222', position: 'relative'}}>
        <div style={{height: 28, background: '#fff', lineHeight: '28px', paddingLeft: 10}}>PivotTable Options<span style={{position: 'absolute', right: 14, letterSpacing: 12}}>? ✕</span></div>
        <div style={{position: 'absolute', left: 14, top: 40}}>PivotTable Name:</div>
        <div style={{position: 'absolute', left: 130, top: 36, width: 296, height: 22, border: '1px solid #8A8A8A', background: '#fff', lineHeight: '20px', paddingLeft: 6, boxSizing: 'border-box'}}>PivotTable1</div>
        {tabs.map(([n, x, w], i) => <div key={n} style={{position: 'absolute', left: x, top: i === p.tab ? 72 : 76, width: w, height: i === p.tab ? 25 : 21, border: '1px solid #ADADAD', borderBottom: i === p.tab ? '1px solid #fff' : '1px solid #ADADAD', background: i === p.tab ? '#fff' : '#ECECEC', textAlign: 'center', lineHeight: '22px', fontSize: 11.5, boxSizing: 'border-box', zIndex: i === p.tab ? 2 : 0}}>{n}</div>)}
        <div style={{position: 'absolute', left: 8, top: 96, width: 424, height: 328, border: '1px solid #ADADAD', background: '#fff'}}>
          {p.tab === 0 && (
            <div>
              <div style={{position: 'absolute', left: 10, top: 8, color: '#555'}}>Layout</div>
              {cb(16, 28, false, 'Merge and center cells with labels')}
              <div style={{position: 'absolute', left: 16, top: 52}}>When in compact form indent row labels:<span style={{marginLeft: 8, border: '1px solid #8A8A8A', padding: '0 6px'}}>1</span> character(s)</div>
              <div style={{position: 'absolute', left: 16, top: 80}}>Display fields in report filter area:<span style={{marginLeft: 8, border: '1px solid #8A8A8A', padding: '0 6px'}}>Down, Then Over ▾</span></div>
              <div style={{position: 'absolute', left: 16, top: 106}}>Report filter fields per column:<span style={{marginLeft: 8, border: '1px solid #8A8A8A', padding: '0 14px'}}>0</span></div>
              <div style={{position: 'absolute', left: 10, top: 138, color: '#555'}}>Format</div>
              {cb(16, 158, true, 'For error values show:')}
              {cb(16, 182, true, 'For empty cells show:')}
              {cb(16, 206, true, 'Autofit column widths on update')}
              {cb(16, 230, true, 'Preserve cell formatting on update')}
            </div>
          )}
          {p.tab === 4 && (
            <div>
              <div style={{position: 'absolute', left: 10, top: 6, color: '#555'}}>PivotTable Data</div>
              <div style={{position: 'absolute', left: 6, top: 18, width: 404, height: 94, border: '1px solid #D0D0D0'}} />
              {cb(24, 28, p.save, 'Save source data with file')}
              {cb(24, 52, p.details, 'Enable show details')}
              {cb(24, 76, p.refresh, 'Refresh data when opening the file')}
              <div style={{position: 'absolute', left: 10, top: 124, color: '#555'}}>Retain items deleted from the data source</div>
              <div style={{position: 'absolute', left: 6, top: 136, width: 404, height: 54, border: '1px solid #D0D0D0'}} />
              <div style={{position: 'absolute', left: 24, top: 150}}>Number of items to retain per field:</div>
              <div style={{position: 'absolute', left: 252, top: 144, width: 150, height: 22, border: '1px solid #8A8A8A', background: '#fff', lineHeight: '20px', paddingLeft: 6, boxSizing: 'border-box'}}>{p.retain}<span style={{position: 'absolute', right: 6, fontSize: 9}}>▼</span></div>
              {p.ddOpen && (
                <div style={{position: 'absolute', left: 252, top: 166, width: 150, border: '1px solid #8A8A8A', background: '#fff', zIndex: 5}}>
                  {['Automatic', 'None', 'Max'].map((n, i) => <div key={n} style={{height: 20, lineHeight: '20px', paddingLeft: 6, background: p.ddHl === i ? '#1B6FD1' : '#fff', color: p.ddHl === i ? '#fff' : '#222'}}>{n}</div>)}
                </div>
              )}
            </div>
          )}
        </div>
        {p.ring === 'details' && <div style={{position: 'absolute', left: 28, top: 144, width: 300, height: 24, border: `3px solid ${p.ringC}`, borderRadius: 6, boxShadow: `0 0 14px ${p.ringC}`, zIndex: 6}} />}
        {p.ring === 'dd' && <div style={{position: 'absolute', left: 246, top: 236, width: 162, height: 30, border: `3px solid ${p.ringC}`, borderRadius: 6, boxShadow: `0 0 14px ${p.ringC}`, zIndex: 6}} />}
        <div style={{position: 'absolute', left: 262, top: 444, width: 80, height: 26, background: '#E1E1E1', border: p.okHl ? '2px solid #1B6FD1' : '1px solid #1B6FD1', textAlign: 'center', lineHeight: '24px', boxSizing: 'border-box'}}>OK</div>
        <div style={{position: 'absolute', left: 352, top: 444, width: 80, height: 26, background: '#E1E1E1', border: '1px solid #ADADAD', textAlign: 'center', lineHeight: '24px', boxSizing: 'border-box'}}>Cancel</div>
      </div>
    </div>
  );
};

/* ───────── Power Pivot window ───────── */
export const PPW = {x: 40, y: 100, w: 1340, h: 888};
export type PPCol = {n: string; w: number; calc?: boolean; add?: boolean};
export type PPMeasure = {n: string; v: string; sel?: boolean; a?: number; c?: string};
export const PP_COLS: PPCol[] = [{n: 'OrderID', w: 70}, {n: 'OrderDate', w: 86}, {n: 'Branch', w: 80}, {n: 'Product', w: 92}, {n: 'Quantity', w: 66}, {n: 'SalesAmount', w: 96}, {n: 'TotalCost', w: 96}];
export const PP_TABLES = ['Fact_Sales', 'DimBranch', 'DimProduct'];
const PROD = [['Laptop', 18500], ['Mouse', 250], ['Keyboard', 480], ['Monitor', 4200], ['Printer', 3600], ['Headset', 900], ['Webcam', 750], ['Router', 1100]] as [string, number][];
const hh = (n: number, k: number) => {
  let x = (Math.imul(n, 2654435761) + Math.imul(k, 40503)) >>> 0;
  x ^= x >>> 15;
  x = Math.imul(x, 2246822519) >>> 0;
  x ^= x >>> 13;
  return x >>> 0;
};
/** deterministic Fact_Sales rows: [OrderID, OrderDate, Branch, Product, Quantity, SalesAmount, TotalCost, Margin] */
export const ppRow = (i: number) => {
  const q = 1 + (hh(i, 3) % 12);
  const [p, pr] = PROD[hh(i, 2) % 8];
  const s = q * pr;
  const c = Math.round((s * (62 + (hh(i, 4) % 17))) / 100);
  const d = new Date(Date.UTC(2026, 0, 1 + (hh(i, 5) % 120)));
  const ds = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  return {id: String(100001 + i), date: ds, br: ['Cairo', 'Alex', 'Giza', 'Mansoura', 'Aswan'][hh(i, 1) % 5], prod: p, qty: String(q), sales: s, cost: c, margin: s - c};
};
export const ppGeo = (h: number, calcH: number) => {
  const HL = h / Z;
  const top = M.title + M.tabs + M.ribbon + M.formula;
  return {HL, top, gridH: HL - top - 48 - calcH, calcTop: HL - 48 - calcH, tabsY: HL - 48, statusY: HL - 22};
};
export const Intelli: React.FC<{x: number; y: number; items: string[]; hl: number}> = ({x, y, items, hl}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 190, background: '#fff', border: '1px solid #8A8A8A', boxShadow: '2px 4px 8px rgba(0,0,0,.3)', zIndex: 9, fontFamily: ui, fontSize: 12}}>
    {items.map((n, i) => <div key={n} style={{height: 20, lineHeight: '20px', padding: '0 6px', background: i === hl ? '#CCE4F7' : '#fff', display: 'flex', gap: 6}}><span style={{color: '#1B6FD1', fontStyle: 'italic', fontWeight: 700}}>fx</span>{n}</div>)}
  </div>
);
type PPProps = {x: number; y: number; w: number; h: number; hl?: string; name: string; formula: string; fxGlow?: string; cols: PPCol[]; rows: string[][]; cellHl?: Record<string, string>; scan?: number; scanC?: string; sel?: [number, number] | null; calcH: number; measures: PPMeasure[]; record: string; table: number; formulaErr?: boolean; over?: React.ReactNode};
export const PPWin: React.FC<PPProps> = (p) => {
  const WL = p.w / Z, HL = p.h / Z;
  const g = ppGeo(p.h, p.calcH);
  let cx = 0;
  const colX = p.cols.map((c) => { const x = cx; cx += c.w; return x; });
  return (
    <div style={{position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h, overflow: 'hidden', borderRadius: 10, background: '#fff', boxShadow: '0 30px 80px rgba(0,0,0,.55)'}}>
      <div style={{width: WL, height: HL, transform: `scale(${Z})`, transformOrigin: '0 0', position: 'relative', fontFamily: ui, fontSize: 12, color: X.text, background: '#fff'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: WL, height: M.title, display: 'flex', alignItems: 'center', background: '#fff'}}>
          <div style={{marginLeft: 10, width: 18, height: 18, borderRadius: 4, background: X.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico k="grid" s={14} /></div>
          <div style={{marginLeft: 12, fontSize: 12.5}}>Power Pivot for Excel - manzooma_sales_2026.xlsx</div>
          <div style={{position: 'absolute', right: 0, top: 0, display: 'flex', fontSize: 14, color: '#333'}}>{['—', '▢', '✕'].map((s) => <div key={s} style={{width: 46, height: M.title, textAlign: 'center', lineHeight: `${M.title}px`}}>{s}</div>)}</div>
        </div>
        <div style={{position: 'absolute', left: 0, top: M.title, width: WL, height: M.tabs, background: '#fff'}}>
          {[['File', 40], ['Home', 44], ['Design', 50], ['Advanced', 64]].map(([n, w], i) => (
            <div key={n} style={{position: 'absolute', left: 10 + [0, 48, 100, 158][i], top: 0, width: w as number, height: M.tabs, textAlign: 'center', lineHeight: `${M.tabs - 2}px`, fontSize: 12.5, background: n === 'File' ? X.green : 'transparent', color: n === 'File' ? '#fff' : n === 'Home' ? X.green : '#333', fontWeight: n === 'Home' ? 700 : 400, borderBottom: n === 'Home' ? `3px solid ${X.green}` : '3px solid transparent', boxSizing: 'border-box'}}>{n}</div>
          ))}
        </div>
        <Ribbon tab="PPHome" hl={p.hl} />
        <div style={{position: 'absolute', left: 0, top: g.top - M.formula, width: WL, height: M.formula, background: X.ribbon, borderBottom: `1px solid ${X.line}`}}>
          <div style={{position: 'absolute', left: 4, top: 3, width: 150, height: 21, border: '1px solid #C8C8C8', background: '#fff', lineHeight: '19px', paddingLeft: 6, boxSizing: 'border-box', fontSize: 12.5, overflow: 'hidden', whiteSpace: 'nowrap'}}>{p.name}</div>
          <div style={{position: 'absolute', left: 164, top: 3, width: 26, height: 21, lineHeight: '21px', fontSize: 13, fontStyle: 'italic', fontWeight: 700, color: p.fxGlow ?? '#444', textShadow: p.fxGlow ? `0 0 10px ${p.fxGlow}` : 'none'}}>fx</div>
          <div style={{position: 'absolute', left: 194, top: 3, right: 8, height: 21, border: `1px solid ${p.fxGlow ?? '#C8C8C8'}`, boxShadow: p.fxGlow ? `0 0 8px ${p.fxGlow}` : 'none', background: '#fff', lineHeight: '19px', paddingLeft: 6, boxSizing: 'border-box', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', color: p.formulaErr ? '#C00000' : '#000', textDecoration: p.formulaErr ? 'underline wavy #C00000' : 'none'}}>{p.formula}</div>
        </div>
        <div style={{position: 'absolute', left: 0, top: g.top, width: WL, height: g.gridH, overflow: 'hidden', background: '#fff'}}>
          {p.cols.map((c, i) => (
            <div key={i} style={{position: 'absolute', left: colX[i], top: 0, width: c.w, height: 24, boxSizing: 'border-box', background: c.add ? '#F3F3F3' : c.calc ? '#C5D9F1' : '#DCE6F1', borderRight: '1px solid #A9B8CC', borderBottom: '2px solid #8FA6C4', lineHeight: '22px', padding: '0 6px', fontWeight: 700, fontSize: 12, fontStyle: c.add ? 'italic' : 'normal', color: c.add ? '#888' : '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden'}}>{c.n}{!c.add && <span style={{float: 'right', fontSize: 8, color: '#555', lineHeight: '22px'}}>▼</span>}</div>
          ))}
          {p.rows.map((r, ri) => (
            <div key={ri}>
              {r.map((v, ci) => {
                const key = `${ri},${ci}`;
                const isNum = /^[-\d,.]+$/.test(v);
                return <div key={ci} style={{position: 'absolute', left: colX[ci], top: 24 + ri * 20, width: p.cols[ci].w, height: 20, boxSizing: 'border-box', borderRight: '1px solid #E1E1E1', borderBottom: '1px solid #E1E1E1', background: p.cellHl?.[key] ?? (ri % 2 ? '#F7F9FC' : '#fff'), padding: '0 6px', lineHeight: '19px', fontSize: 12.5, textAlign: isNum ? 'right' : 'left', whiteSpace: 'nowrap', overflow: 'hidden'}}>{v}</div>;
              })}
            </div>
          ))}
          {p.sel && <div style={{position: 'absolute', left: colX[p.sel[1]] - 1, top: 24 + p.sel[0] * 20 - 1, width: p.cols[p.sel[1]].w + 1, height: 21, border: '2px solid #1B6FD1', boxSizing: 'border-box', pointerEvents: 'none'}} />}
          {p.scan !== undefined && p.scan >= 0 && <div style={{position: 'absolute', left: 0, top: 24 + p.scan * 20, width: cx, height: 20, background: `${p.scanC ?? '#F59E0B'}55`, borderTop: `2px solid ${p.scanC ?? '#F59E0B'}`, borderBottom: `2px solid ${p.scanC ?? '#F59E0B'}`, boxShadow: `0 0 12px ${p.scanC ?? '#F59E0B'}`}} />}
        </div>
        {p.calcH > 0 && (
          <div style={{position: 'absolute', left: 0, top: g.calcTop, width: WL, height: p.calcH, overflow: 'hidden', background: '#F2F2F2', borderTop: '4px solid #8FA6C4'}}>
            {[0, 1, 2, 3].map((col) => [0, 1].map((row) => <div key={`${col}${row}`} style={{position: 'absolute', left: col * 200, top: 4 + row * 44, width: 200, height: 44, boxSizing: 'border-box', border: '1px solid #D0D0D0', background: '#fff'}} />))}
            {p.measures.map((m, i) => {
              const col = Math.floor(i / 2), row = i % 2;
              const c = m.c ?? '#10B981';
              return (
                <div key={m.n} style={{position: 'absolute', left: col * 200, top: 4 + row * 44, width: 200, height: 44, boxSizing: 'border-box', border: m.sel ? '2px solid #1B6FD1' : `1px solid ${c}`, background: `${c}18`, padding: '3px 8px', opacity: m.a ?? 1, boxShadow: `0 0 ${m.sel ? 0 : 8}px ${c}88`}}>
                  <div style={{fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap'}}>{m.n}:</div>
                  <div style={{fontSize: 13, textAlign: 'right', fontWeight: 700, color: c}}>{m.v}</div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{position: 'absolute', left: 0, top: g.tabsY, width: WL, height: 26, background: X.chrome, borderTop: `1px solid ${X.line}`}}>
          {PP_TABLES.map((n, i) => <div key={n} style={{position: 'absolute', left: 8 + i * 96, top: 0, width: 92, height: 26, textAlign: 'center', lineHeight: '24px', fontSize: 12, background: i === p.table ? '#fff' : 'transparent', fontWeight: i === p.table ? 700 : 400, color: i === p.table ? X.green : '#444', boxShadow: i === p.table ? '0 -1px 0 #D1D1D1, 1px 0 0 #D1D1D1, -1px 0 0 #D1D1D1' : 'none'}}>{n}</div>)}
        </div>
        <div style={{position: 'absolute', left: 0, top: g.statusY, width: WL, height: 22, background: X.chrome, borderTop: `1px solid ${X.line}`, fontSize: 11.5, lineHeight: '22px', color: '#444', paddingLeft: 10}}>Record: ◀ ◀ {p.record} ▶ ▶|</div>
        {p.over}
      </div>
    </div>
  );
};

/* ───────── screen-space overlays ───────── */
export const P = (lx: number, ly: number, win = WIN) => ({x: win.x + lx * Z, y: win.y + ly * Z});
export const Cursor: React.FC<{x: number; y: number; t: number; left?: number[]; right?: number[]}> = ({x, y, t, left = [], right = []}) => (
  <div style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 50}}>
    {[...left.map((c) => ({c, k: C.blue})), ...right.map((c) => ({c, k: C.amber}))].map(({c, k}) => {
      const p = (t - c) / 0.55;
      return p > 0 && p < 1 ? <div key={`${k}${c}`} style={{position: 'absolute', left: x - 30 * p - 6, top: y - 30 * p - 6, width: 60 * p + 12, height: 60 * p + 12, borderRadius: '50%', border: `4px solid ${k}`, opacity: 1 - p}} /> : null;
    })}
    <svg style={{position: 'absolute', left: x - 2, top: y - 2, filter: 'drop-shadow(2px 3px 3px rgba(0,0,0,.5))'}} width={30} height={42} viewBox="0 0 15 21">
      <path d="M1 1 L1 17 L5 13.4 L8 20 L10.4 19 L7.6 12.6 L13 12.6 Z" fill="#fff" stroke="#000" strokeWidth={1.1} strokeLinejoin="round" />
    </svg>
  </div>
);
export const Ring: React.FC<{x: number; y: number; w: number; h: number; c: string; t: number; a?: number; r?: number}> = ({x, y, w, h, c, t, a = 1, r = 12}) => (
  <div style={{position: 'absolute', left: x - 6, top: y - 6, width: w + 12, height: h + 12, borderRadius: r, border: `4px solid ${c}`, boxSizing: 'border-box', opacity: a * (0.7 + 0.3 * pls(t)), boxShadow: `0 0 ${18 + 12 * pls(t)}px ${c}, inset 0 0 14px ${c}55`, pointerEvents: 'none', zIndex: 40}} />
);
export const Chip: React.FC<{x: number; y: number; text: string; c: string; a?: number; center?: boolean; size?: number}> = ({x, y, text, c, a = 1, center, size = 26}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: center ? 'translateX(-50%)' : 'none', opacity: a, padding: '8px 18px', borderRadius: 12, background: 'rgba(15,23,42,.94)', border: `3px solid ${c}`, color: '#F8FAFC', fontFamily: ar, fontWeight: 600, fontSize: size, whiteSpace: 'nowrap', boxShadow: `0 0 20px ${c}88`, zIndex: 45, direction: 'ltr'}}>{text}</div>
);
export const Cam: React.FC<{t: number; k: [number, number, number, number][]; children: React.ReactNode}> = ({t, k, children}) => {
  const cx = kf(t, k.map((q) => [q[0], q[1]] as [number, number]));
  const cy = kf(t, k.map((q) => [q[0], q[2]] as [number, number]));
  const s = kf(t, k.map((q) => [q[0], q[3]] as [number, number]));
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${W / 2}px,${H / 2}px) scale(${s}) translate(${-cx}px,${-cy}px)`}}>{children}</div>;
};

/* ───────── HUD (screen space, outside the camera) ───────── */
export const Logo: React.FC<{s?: number}> = ({s = 64}) => <Img src={staticFile(LOGO)} style={{width: s, height: s, filter: 'invert(1)'}} />;
export const TopBadge: React.FC<{text: string; a: number}> = ({text, a}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * -16}px)`}}>
    <div dir="rtl" style={{padding: '8px 34px', borderRadius: 16, background: 'rgba(30,41,59,.95)', border: `3px solid ${C.blue}`, color: '#F8FAFC', fontFamily: ar, fontWeight: 700, fontSize: 34, boxShadow: `0 0 26px ${C.blue}77`}}>{text}</div>
  </div>
);
export const Tag: React.FC<{text: string; c: string; a: number}> = ({text, c, a}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * 20}px)`, direction: 'ltr'}}>
    <div style={{padding: '10px 30px', borderRadius: 14, background: 'rgba(15,23,42,.95)', border: `3px solid ${c}`, borderLeftWidth: 12, color: '#F8FAFC', fontFamily: ar, fontWeight: 600, fontSize: 30, boxShadow: `0 0 24px ${c}66`, whiteSpace: 'nowrap'}}>{text}</div>
  </div>
);
export const Keys: React.FC<{keys: string[]; n: number; a: number; c: string}> = ({keys, n, a, c}) => (
  <div style={{position: 'absolute', right: 40, top: 20, opacity: a, display: 'flex', alignItems: 'center', gap: 10, direction: 'ltr'}}>
    {keys.map((k, i) => {
      const on = n > i;
      return (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10}}>
          {i > 0 && <span style={{color: C.dim, fontFamily: mono, fontSize: 28}}>+</span>}
          <div style={{minWidth: 64, height: 60, padding: '0 16px', boxSizing: 'border-box', borderRadius: 12, border: `3px solid ${on ? c : '#475569'}`, background: on ? c : '#1E293B', color: on ? '#0F172A' : '#CBD5E1', fontFamily: mono, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: on ? `0 0 22px ${c}` : 'none', transform: `scale(${on && n < i + 1.4 ? 1.1 : 1})`}}>{k}</div>
        </div>
      );
    })}
  </div>
);
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: `radial-gradient(circle at 50% 35%, ${C.panel} 0%, ${C.bg} 72%)`}}>{children}</div>
);
