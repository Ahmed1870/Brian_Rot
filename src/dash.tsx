// Lesson 31: dashboard canvas pieces drawn in logical Excel coordinates (shapes, linked KPI cards, charts, slicer, Format Shape pane).
import React from 'react';
import {C, CELLFONT, UIFONT} from './theme';
import {clamp, lerp} from './kit';
import {sale} from './data';
import {Caret, G, Ico} from './xl';

const ab = (x: number, y: number, w?: number, h?: number, extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...extra});
const T: React.CSSProperties = {fontFamily: UIFONT, fontSize: 12, color: '#1B1B1B', whiteSpace: 'nowrap'};
export type R = {x: number; y: number; w: number; h: number};

/* ------------------------------------------------------------------ data */
export const BR = ['Cairo', 'Giza', 'Alexandria', 'Tanta', 'Mansoura', 'Aswan', 'Luxor', 'Suez'];
export const MARGIN = 0.25;
export const DEMO = {sales: [342500, 198000, 176500, 98000, 112000, 67500, 83000, 172500], orders: [2306, 1333, 1189, 660, 754, 455, 559, 1162]};
let bigCache: {sales: number[]; orders: number[]} | null = null;
export const BIG = () => {
  if (bigCache) return bigCache;
  const sales = BR.map(() => 0), orders = BR.map(() => 0);
  for (let n = 1; n <= 50000; n++) { const h = (n * 2654435761) >>> 0; const i = (h >>> 5) % BR.length; sales[i] += sale(n).total; orders[i] += 1; }
  bigCache = {sales, orders};
  return bigCache;
};
export type DS = {sales: number[]; orders: number[]};
export const kpiOf = (sel: boolean[], d: DS) => {
  let sales = 0, orders = 0;
  d.sales.forEach((v, i) => { if (sel[i]) { sales += v; orders += d.orders[i]; } });
  return {sales, profit: Math.round(sales * MARGIN), orders, avg: orders ? Math.round(sales / orders) : 0};
};
export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
export const ALL = BR.map(() => true);
export const only = (...idx: number[]) => BR.map((_, i) => idx.includes(i));

/* ------------------------------------------------------------------ layouts (A: tall slicer on the right, B: horizontal slicer bar on top) */
const lerpR = (a: R, b: R, t: number): R => ({x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t)});
export const LA = {slicer: {x: 1000, y: 222, w: 160, h: 392}, cards: [60, 290, 520, 750].map((x) => ({x, y: 222, w: 220, h: 78})), chart1: {x: 60, y: 312, w: 440, h: 300}, chart2: {x: 510, y: 312, w: 450, h: 300}};
export const LB = {slicer: {x: 60, y: 222, w: 1100, h: 76}, cards: [60, 334, 608, 882].map((x) => ({x, y: 318, w: 262, h: 70})), chart1: {x: 60, y: 398, w: 540, h: 216}, chart2: {x: 612, y: 398, w: 548, h: 216}};
export const layoutAt = (t: number) => ({slicer: lerpR(LA.slicer, LB.slicer, t), cards: LA.cards.map((c, i) => lerpR(c, LB.cards[i], t)), chart1: lerpR(LA.chart1, LB.chart1, t), chart2: lerpR(LA.chart2, LB.chart2, t)});

/* ------------------------------------------------------------------ KPI card = rounded rectangle shape with linked text */
export const KpiShape: React.FC<{rect: R; label?: string; value: string; p?: number; fillP?: number; glow?: number; green?: number; selected?: boolean; link?: string; locked?: number}> = ({rect, label, value, p = 1, fillP = 1, glow = 0, green = 0, selected, locked = 0}) => {
  if (p <= 0.01) return null;
  const border = `rgb(${Math.round(lerp(79, 6, fillP))},${Math.round(lerp(129, 182, fillP))},${Math.round(lerp(189, 212, fillP))})`;
  const bg = `rgb(${Math.round(lerp(68, 15, fillP))},${Math.round(lerp(114, 23, fillP))},${Math.round(lerp(196, 42, fillP))})`;
  return (
    <div style={ab(rect.x, rect.y, rect.w, rect.h, {opacity: clamp(p), zIndex: 10})}>
      {label ? <div style={ab(0, -17, rect.w, 16, {...T, fontSize: 12, fontWeight: 700, color: '#475569'})}>{label}</div> : null}
      <div style={{width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: 16, background: bg, border: `2.5px solid ${border}`, boxShadow: `0 0 ${10 + 26 * glow}px ${green > 0 ? C.green : C.blue}${glow > 0.05 ? 'AA' : '33'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{fontFamily: UIFONT, fontWeight: 700, fontSize: rect.w > 250 ? 38 : 34, color: green > 0.05 ? '#6EE7B7' : '#F8FAFC', letterSpacing: -0.5, textShadow: green > 0.05 ? `0 0 ${14 * green}px ${C.green}` : 'none'}}>{value}</span>
      </div>
      {selected ? <Handles rect={{x: 0, y: 0, w: rect.w, h: rect.h}} /> : null}
      {locked > 0.01 ? <Lock rect={{x: 0, y: 0, w: rect.w, h: rect.h}} p={locked} /> : null}
    </div>
  );
};

/** Excel shape selection handles (8 white circles) */
export const Handles: React.FC<{rect: R; color?: string; sq?: boolean}> = ({rect, color = '#6B7280', sq}) => {
  const xs = [0, rect.w / 2, rect.w], ys = [0, rect.h / 2, rect.h];
  const pts: Array<[number, number]> = [];
  xs.forEach((x, i) => ys.forEach((y, j) => { if (!(i === 1 && j === 1)) pts.push([x, y]); }));
  return (
    <div style={{position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, boxSizing: 'border-box', border: `1px solid ${color}`, pointerEvents: 'none', zIndex: 20}}>
      {pts.map(([x, y], i) => <div key={i} style={ab(x - 4.5, y - 4.5, 9, 9, {borderRadius: sq ? 1 : 5, background: '#fff', border: `1.3px solid ${color}`, boxSizing: 'border-box'})} />)}
    </div>
  );
};
export const Lock: React.FC<{rect: R; p: number}> = ({rect, p}) => (
  <div style={ab(rect.x + rect.w - 22, rect.y - 12, 26, 26, {borderRadius: 13, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${14 * p}px ${C.green}`, transform: `scale(${0.4 + 0.6 * clamp(p)})`, opacity: clamp(p), zIndex: 25})}>
    <svg width={14} height={14} viewBox="0 0 14 14"><rect x={2.5} y={6} width={9} height={6.5} rx={1.2} fill="#fff" /><path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" fill="none" stroke="#fff" strokeWidth={1.6} /></svg>
  </div>
);

/* ------------------------------------------------------------------ charts (pivot charts drawn as dark cards) */
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MSH = [7, 7.5, 8, 8.5, 8, 8.5, 9, 9.5, 9, 8.5, 8, 8.5];
export const ChartBar: React.FC<{rect: R; d: DS; sel: boolean[]; p?: number; selected?: boolean; locked?: number; plain?: boolean}> = ({rect, d, sel, p = 1, selected, locked = 0, plain}) => {
  if (p <= 0.01) return null;
  const max = Math.max(...d.sales), pw = rect.w - 36, ph = rect.h - 64, bw = pw / BR.length;
  return (
    <div style={ab(rect.x, rect.y, rect.w, rect.h, {opacity: clamp(p), zIndex: 8, transform: `translateX(${(1 - clamp(p)) * -50}px)`})}>
      <div style={{width: '100%', height: '100%', borderRadius: 10, background: plain ? '#fff' : '#1E293B', border: `1.5px solid ${plain ? '#C8C8C8' : '#334155'}`, boxSizing: 'border-box'}} />
      <div style={ab(14, 8, rect.w - 28, 20, {...T, fontSize: 14, fontWeight: 700, color: plain ? '#333' : '#F8FAFC'})}>Sales by Branch</div>
      <svg style={ab(0, 0, rect.w, rect.h)} width={rect.w} height={rect.h}>
        {d.sales.map((v, i) => {
          const h = (v / max) * (ph - 4); const x = 18 + i * bw + bw * 0.16;
          return (<g key={i}><rect x={x} y={34 + ph - h} width={bw * 0.68} height={h} rx={3} fill={sel[i] ? (plain ? '#4472C4' : C.blue) : (plain ? '#C9D3E8' : '#334155')} /><text x={x + bw * 0.34} y={rect.h - 12} fontSize={rect.w > 500 ? 11 : 10} textAnchor="middle" fill={plain ? '#555' : '#94A3B8'} fontFamily={UIFONT}>{BR[i].slice(0, 5)}</text></g>);
        })}
        <path d={`M18 ${34 + ph}H${rect.w - 18}`} stroke={plain ? '#BBB' : '#475569'} strokeWidth={1} />
      </svg>
      {selected ? <Handles rect={{x: 0, y: 0, w: rect.w, h: rect.h}} sq /> : null}
      {locked > 0.01 ? <Lock rect={{x: 0, y: 0, w: rect.w, h: rect.h}} p={locked} /> : null}
    </div>
  );
};
export const ChartLine: React.FC<{rect: R; d: DS; sel: boolean[]; p?: number; selected?: boolean; locked?: number; plain?: boolean}> = ({rect, d, sel, p = 1, selected, locked = 0, plain}) => {
  if (p <= 0.01) return null;
  const total = kpiOf(sel, d).sales / 12; const pw = rect.w - 40, ph = rect.h - 66;
  const full = kpiOf(ALL, d).sales / 12;
  const pts = MSH.map((m, i) => [24 + (i / 11) * pw, 38 + ph - ((total * (m / 8.4)) / (full * 1.25)) * ph]);
  const line = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('');
  const col = plain ? '#ED7D31' : C.amber;
  return (
    <div style={ab(rect.x, rect.y, rect.w, rect.h, {opacity: clamp(p), zIndex: 8, transform: `translateX(${(1 - clamp(p)) * -50}px)`})}>
      <div style={{width: '100%', height: '100%', borderRadius: 10, background: plain ? '#fff' : '#1E293B', border: `1.5px solid ${plain ? '#C8C8C8' : '#334155'}`, boxSizing: 'border-box'}} />
      <div style={ab(14, 8, rect.w - 28, 20, {...T, fontSize: 14, fontWeight: 700, color: plain ? '#333' : '#F8FAFC'})}>Monthly Sales Trend</div>
      <svg style={ab(0, 0, rect.w, rect.h)} width={rect.w} height={rect.h}>
        <path d={`${line}L${pts[11][0]} ${38 + ph}L${pts[0][0]} ${38 + ph}Z`} fill={`${col}22`} />
        <path d={line} fill="none" stroke={col} strokeWidth={3} strokeLinejoin="round" />
        {pts.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={3.2} fill={col} />)}
        {MONTHS.map((m, i) => <text key={i} x={pts[i][0]} y={rect.h - 12} fontSize={11} textAnchor="middle" fill={plain ? '#555' : '#94A3B8'} fontFamily={UIFONT}>{m}</text>)}
        <path d={`M24 ${38 + ph}H${rect.w - 16}`} stroke={plain ? '#BBB' : '#475569'} strokeWidth={1} />
      </svg>
      {selected ? <Handles rect={{x: 0, y: 0, w: rect.w, h: rect.h}} sq /> : null}
      {locked > 0.01 ? <Lock rect={{x: 0, y: 0, w: rect.w, h: rect.h}} p={locked} /> : null}
    </div>
  );
};

/* ------------------------------------------------------------------ slicer */
/** Item rect (absolute app coords) for cursor targets. */
export const slicerItem = (rect: R, cols: number, i: number): R => {
  const pad = rect.h < 100 ? 4 : 6, head = rect.h < 100 ? 22 : 28; const rows = Math.ceil(BR.length / cols);
  const w = (rect.w - pad * 2 - (cols - 1) * 4) / cols;
  const h = Math.min(30, (rect.h - head - pad * 2 - (rows - 1) * 4) / rows);
  const col = i % cols, row = Math.floor(i / cols);
  return {x: rect.x + pad + col * (w + 4), y: rect.y + head + pad + row * (h + 4), w, h};
};
export const SlicerBox: React.FC<{rect: R; cols: number; sel: boolean[]; dark?: number; selected?: boolean; hot?: number; warn?: number; p?: number; locked?: number; title?: string}> = ({rect, cols, sel, dark = 0, selected, hot = -1, warn = 0, p = 1, locked = 0, title = 'Branch'}) => {
  if (p <= 0.01) return null;
  const allOn = sel.every(Boolean);
  const mixc = (a: [number, number, number], b: [number, number, number]) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], dark))).join(',')})`;
  return (
    <div style={ab(rect.x, rect.y, rect.w, rect.h, {opacity: clamp(p), zIndex: 12})}>
      <div style={{width: '100%', height: '100%', boxSizing: 'border-box', background: mixc([255, 255, 255], [15, 23, 42]), border: `1.5px solid ${mixc([200, 200, 200], [71, 85, 105])}`, boxShadow: warn > 0.01 ? `0 0 ${24 * warn}px ${C.blue}, 0 0 0 ${3 * warn}px ${C.blue}` : 'none'}} />
      <div style={ab(8, 4, rect.w - 60, 20, {...T, fontWeight: 700, fontSize: 13, color: mixc([40, 40, 40], [248, 250, 252])})}>{title}</div>
      <div style={ab(rect.w - 44, 5, 38, 18, {display: 'flex', gap: 8, justifyContent: 'flex-end', opacity: rect.w > 100 ? 1 : 0})}>
        <Ico n="filter" s={16} c={mixc([90, 90, 90], [148, 163, 184])} />
      </div>
      {BR.map((n, i) => {
        const r = slicerItem({x: 0, y: 0, w: rect.w, h: rect.h}, cols, i);
        const on = sel[i];
        const dSel = on && !allOn ? 1 : on ? 0.85 : 0;
        // default style: selected = blue-grey fill; dark style: selected = amber, unselected = purple
        const bg = on ? mixc([197, 217, 241], [245, 158, 11]) : mixc([255, 255, 255], [88, 36, 130]);
        const bd = on ? mixc([120, 150, 190], [251, 191, 36]) : mixc([210, 210, 210], [168, 85, 247]);
        const tx = on ? mixc([31, 56, 100], [15, 23, 42]) : mixc([120, 120, 120], [233, 213, 255]);
        return (
          <div key={n} style={ab(r.x, r.y, r.w, r.h, {boxSizing: 'border-box', background: bg, border: `1.5px solid ${hot === i ? '#fff' : bd}`, boxShadow: hot === i ? `0 0 14px ${dark > 0.5 ? C.amber : C.blue}` : dark > 0.5 && on ? `0 0 ${10 * dSel}px ${C.amber}88` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'})}>
            <span style={{...T, fontSize: cols > 1 && r.w < 80 ? 10 : 12.5, fontWeight: 600, color: tx, textOverflow: 'ellipsis', overflow: 'hidden'}}>{n}</span>
          </div>
        );
      })}
      {selected ? <Handles rect={{x: 0, y: 0, w: rect.w, h: rect.h}} sq /> : null}
      {locked > 0.01 ? <Lock rect={{x: 0, y: 0, w: rect.w, h: rect.h}} p={locked} /> : null}
    </div>
  );
};

/* ------------------------------------------------------------------ Insert > Shapes gallery (approximate) */
export const SHAPES_MENU = {x: 283, y: 152, w: 252, h: 190};
export const shapeCell = (i: number) => ({x: SHAPES_MENU.x + 14 + (i % 8) * 28 + 12, y: SHAPES_MENU.y + 82 + Math.floor(i / 8) * 28 + 12});
export const ShapesGallery: React.FC<{p: number; hi: number}> = ({p, hi}) => p <= 0.01 ? null : (
  <div style={ab(SHAPES_MENU.x, SHAPES_MENU.y, SHAPES_MENU.w, SHAPES_MENU.h, {background: '#fff', border: '1px solid #CFCFCF', borderRadius: 6, boxShadow: '0 6px 20px rgba(0,0,0,.3)', opacity: clamp(p), zIndex: 40})}>
    <div style={ab(10, 6, 200, 16, {...T, fontWeight: 700, fontSize: 11.5, color: '#444'})}>Recent Shapes</div>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} style={ab(14 + i * 28, 26, 24, 24, {display: 'flex', alignItems: 'center', justifyContent: 'center'})}><svg width={18} height={18} viewBox="0 0 18 18"><rect x={2} y={4} width={14} height={10} rx={i % 3 === 0 ? 4 : 0} fill="none" stroke="#555" strokeWidth={1.2} /></svg></div>)}
    <div style={ab(10, 64, 200, 16, {...T, fontWeight: 700, fontSize: 11.5, color: '#444'})}>Rectangles</div>
    <div style={ab(10, 84, 230, 18, {...T, fontSize: 10.5, color: '#888', opacity: 0})}>.</div>
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} style={ab(14 + (i % 8) * 28, 82 + Math.floor(i / 8) * 28, 24, 24, {display: 'flex', alignItems: 'center', justifyContent: 'center', background: hi === i ? '#E6E6E6' : 'transparent', border: hi === i ? '1px solid #8A8A8A' : '1px solid transparent', boxSizing: 'border-box'})}>
        <svg width={18} height={18} viewBox="0 0 18 18">{i === 0 ? <rect x={2} y={4} width={14} height={10} fill="none" stroke="#555" strokeWidth={1.2} /> : i === 1 ? <rect x={2} y={4} width={14} height={10} rx={4} fill="none" stroke="#555" strokeWidth={1.2} /> : <path d={i < 4 ? 'M2 4h10l4 4v6H2z' : 'M2 4h14v10H2z M5 4v10'} fill="none" stroke="#555" strokeWidth={1.2} />}</svg>
      </div>
    ))}
    {hi === 1 ? <div style={ab(40, 142, 200, 24, {background: '#fff', border: '1px solid #999', ...T, fontSize: 11.5, padding: '3px 8px', boxShadow: '0 2px 6px rgba(0,0,0,.25)', boxSizing: 'border-box'})}>Rectangle: Rounded Corners</div> : null}
  </div>
);

/* ------------------------------------------------------------------ Format Shape task pane (Size & Properties) */
export const PANE = {x: 1236, y: 64, w: 300, h: 558};
export const paneRadio = (i: number) => ({x: PANE.x + 30, y: PANE.y + 190 + i * 30 + 12});
export const paneTabIcon = (i: number) => ({x: PANE.x + 34 + i * 38, y: PANE.y + 94});
const RADIOS = ['Move and size with cells', 'Move but don’t size with cells', 'Don’t move or size with cells'];
export const FormatPane: React.FC<{p: number; radio: number; glow?: number; title?: string}> = ({p, radio, glow = 0, title = 'Format Shape'}) => p <= 0.01 ? null : (
  <div style={ab(PANE.x + (1 - clamp(p)) * 40, PANE.y, PANE.w, PANE.h, {background: '#fff', border: '1px solid #C8C8C8', boxShadow: '-6px 0 18px rgba(0,0,0,.22)', opacity: clamp(p), zIndex: 45, boxSizing: 'border-box'})}>
    <div style={ab(12, 10, 200, 20, {...T, fontSize: 15, fontWeight: 700})}>{title}</div>
    <div style={ab(PANE.w - 28, 12, 16, 16, {})}><svg width={12} height={12} viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="#333" strokeWidth={1.2} /></svg></div>
    <div style={ab(12, 44, 150, 20, {...T, fontWeight: 700, color: G.greenDark, borderBottom: `2px solid ${G.green}`, paddingBottom: 3})}>Shape Options</div>
    <div style={ab(150, 44, 120, 20, {...T, color: '#666'})}>Text Options</div>
    <div style={ab(0, 70, PANE.w, 1, {background: '#E1E1E1'})} />
    {['fill', 'format', 'normal'].map((ic, i) => <div key={ic} style={ab(16 + i * 38, 76, 32, 30, {borderRadius: 4, background: i === 2 ? '#E7F3EC' : 'transparent', borderBottom: i === 2 ? `2px solid ${G.green}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'})}><Ico n={ic} s={18} c={i === 2 ? G.greenDark : '#555'} /></div>)}
    <div style={ab(0, 112, PANE.w, 1, {background: '#E1E1E1'})} />
    <div style={ab(12, 122, 200, 20, {...T, color: '#555'})}>▸ Size</div>
    <div style={ab(12, 158, 200, 20, {...T, color: '#555', fontWeight: 600})}>▾ Properties</div>
    {RADIOS.map((l, i) => {
      const on = radio === i; const g = i === 2 ? glow : 0;
      return (
        <div key={l} style={ab(12, 190 + 0 + i * 30 - 0, PANE.w - 20, 24, {display: 'flex', alignItems: 'center', gap: 8, transform: 'translateY(0)', background: g > 0.05 ? `rgba(16,185,129,${0.18 * g})` : 'transparent', borderRadius: 4, boxShadow: g > 0.05 ? `0 0 ${14 * g}px ${C.green}` : 'none'})}>
          <div style={{width: 15, height: 15, borderRadius: 8, border: '1.3px solid #444', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'}}>{on ? <div style={{width: 8, height: 8, borderRadius: 4, background: '#1B1B1B'}} /> : null}</div>
          <span style={{...T, fontSize: 12.5}}>{l}</span>
        </div>
      );
    })}
    {['Locked', 'Print object'].map((l, i) => (
      <div key={l} style={ab(12, 296 + i * 28 - 8, 200, 20, {display: 'flex', alignItems: 'center', gap: 8})}>
        <div style={{width: 14, height: 14, border: '1.3px solid #444', boxSizing: 'border-box', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width={10} height={10} viewBox="0 0 10 10"><path d="M1.5 5.2l2.4 2.4L8.6 2.4" fill="none" stroke="#222" strokeWidth={1.5} /></svg></div><span style={{...T, fontSize: 12.5}}>{l}</span>
      </div>
    ))}
    <div style={ab(12, 360, 260, 20, {...T, color: '#555'})}>▸ Text Box</div>
    <div style={ab(12, 390, 260, 20, {...T, color: '#555'})}>▸ Alt Text</div>
  </div>
);

/* ------------------------------------------------------------------ New Slicer Style dialog */
export const NSS = {x: 330, y: 120, w: 470, h: 330};
export const nssElem = (i: number) => ({x: NSS.x + 24 + 120, y: NSS.y + 32 + 78 + i * 22 + 11});
export const NSS_ITEMS = ['Whole Slicer', 'Header', 'Selected Item with Data', 'Selected Item with No Data', 'Unselected Item with Data', 'Unselected Item with No Data', 'Hovered Selected Item with Data'];
export const NewSlicerStyle: React.FC<{p: number; name: string; hi: number; applied?: boolean}> = ({p, name, hi, applied}) => p <= 0.01 ? null : (
  <div style={ab(NSS.x, NSS.y + (1 - clamp(p)) * 14, NSS.w, NSS.h, {background: '#fff', border: '1px solid #8C8C8C', borderRadius: 7, boxShadow: '0 12px 40px rgba(0,0,0,.45)', opacity: clamp(p), zIndex: 50, overflow: 'hidden', boxSizing: 'border-box'})}>
    <div style={ab(0, 0, NSS.w, 32, {borderBottom: '1px solid #E5E5E5'})}><span style={{...T, position: 'absolute', left: 12, top: 8, fontSize: 12.5}}>New Slicer Style</span></div>
    <div style={ab(24, 44, 60, 18, T)}>Name:</div>
    <div style={ab(70, 40, 250, 24, {border: '1px solid #8A8A8A', boxSizing: 'border-box', padding: '0 6px', display: 'flex', alignItems: 'center'})}><span style={{...T, fontFamily: CELLFONT, fontSize: 13.5}}>{name}</span></div>
    <div style={ab(24, 76, 200, 18, T)}>Slicer Element:</div>
    <div style={ab(24, 94, 230, 154, {border: '1px solid #8A8A8A', boxSizing: 'border-box', background: '#fff', overflow: 'hidden'})}>
      {NSS_ITEMS.map((l, i) => <div key={l} style={ab(0, i * 22, 230, 22, {background: hi === i ? '#CCE8FF' : 'transparent', display: 'flex', alignItems: 'center', padding: '0 6px'})}><span style={T}>{l}</span></div>)}
    </div>
    <div style={ab(268, 76, 100, 18, T)}>Preview</div>
    <div style={ab(268, 94, 178, 154, {border: '1px solid #BDBDBD', background: applied ? '#0F172A' : '#fff', boxSizing: 'border-box', padding: 8})}>
      {[0, 1, 2].map((i) => <div key={i} style={{height: 22, marginBottom: 6, background: applied ? (i === 0 ? C.amber : '#581C87') : (i === 0 ? '#C5D9F1' : '#fff'), border: `1.5px solid ${applied ? (i === 0 ? '#FBBF24' : C.purple) : '#BDBDBD'}`}} />)}
    </div>
    <div style={ab(24, 258, 120, 24, {boxSizing: 'border-box', border: '1px solid #ADADAD', background: '#E9E9E9', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'})}><span style={T}>Format…</span></div>
    <div style={ab(NSS.w - 190, 280, 84, 28, {boxSizing: 'border-box', border: '2px solid #0F6CBD', background: '#E9E9E9', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'})}><span style={T}>OK</span></div>
    <div style={ab(NSS.w - 98, 280, 84, 28, {boxSizing: 'border-box', border: '1px solid #ADADAD', background: '#E9E9E9', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'})}><span style={T}>Cancel</span></div>
  </div>
);

/* ------------------------------------------------------------------ misc */
export const ZoneBox: React.FC<{rect: R; color: string; p: number; label: string; dashed?: boolean}> = ({rect, color, p, label, dashed = true}) => p <= 0.01 ? null : (
  <div style={ab(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4, {boxSizing: 'border-box', border: `2.5px ${dashed ? 'dashed' : 'solid'} ${color}`, borderRadius: 10, background: `${color}14`, boxShadow: `0 0 ${16 * clamp(p)}px ${color}88`, opacity: clamp(p), zIndex: 6})}>
    <div style={ab(8, -10, undefined, 18, {fontFamily: UIFONT, fontSize: 11.5, fontWeight: 700, color: '#0B1222', background: color, borderRadius: 9, padding: '0 8px', lineHeight: '18px'})}>{label}</div>
  </div>
);
export const Dots: React.FC<{c?: string}> = ({c}) => <Caret c={c} />;

export const CAM_TOP = {fx: 590, fy: 330, z: 1.25};
/** Piecewise number roll: events [{at (frames), v}] each eases from the previous value. */
export const rollSeq = (f: number, ev: Array<{at: number; v: number}>, dur: number) => {
  let prev = 0, cur = 0;
  for (const e of ev) { if (f >= e.at) { prev = cur; cur = e.v; } else break; }
  const last = [...ev].reverse().find((e) => f >= e.at);
  if (!last) return 0;
  const p = clamp((f - last.at) / dur); const k = 1 - Math.pow(1 - p, 3);
  return prev + (cur - prev) * k;
};
