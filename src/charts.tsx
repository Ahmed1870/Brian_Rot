import React from 'react';
import {C} from './theme';
import {AR, MONO, eo, fmt} from './kit';

const Tx: React.FC<{x: number; y: number; s: string; c?: string; z?: number; a?: 'start' | 'middle' | 'end'; r?: number; b?: boolean; o?: number}> = ({x, y, s, c = C.dim, z = 16, a = 'middle', r = 0, b, o = 1}) => (
  <text x={x} y={y} fill={c} fontSize={z} textAnchor={a} fontFamily={AR} fontWeight={b ? 700 : 400} opacity={o} transform={r ? `rotate(${r} ${x} ${y})` : undefined}>{s}</text>
);
const FR: React.FC<{w: number; h: number; bg?: string; children?: React.ReactNode}> = ({w, h, bg = '#0F172A', children}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block'}}><rect x={0} y={0} width={w} height={h} fill={bg} rx={10} />{children}</svg>
);
const pc = (p: number) => eo(Math.min(1, Math.max(0, p)));

/* vertical / horizontal clustered bars, optional fake-3D depth, truncated axis, legend, grid, data labels */
export const Bars: React.FC<{w: number; h: number; d: {l: string; v: number}[]; dir?: 'v' | 'h'; p?: number; min?: number; max?: number; col?: string; grid?: boolean; lab?: boolean; angled?: boolean; title?: string; depth?: number; legend?: string; bg?: string}> = ({w, h, d, dir = 'v', p = 1, min = 0, max, col = C.blue, grid = true, lab = false, angled = false, title, depth = 0, legend, bg}) => {
  const mx = max ?? Math.max(...d.map((x) => x.v));
  const n = d.length;
  const left = dir === 'h' ? Math.min(330, Math.max(...d.map((x) => x.l.length)) * 9 + 20) : 70;
  const bottom = dir === 'v' ? (angled ? 120 : 46) : 44;
  const top = (title ? 54 : 22) + (legend ? 26 : 0);
  const right = lab && dir === 'h' ? 80 : 30;
  const pw = w - left - right - depth;
  const ph = h - top - bottom;
  const sc = (v: number) => Math.max(0, (v - min) / (mx - min));
  const e = pc(p);
  const ticks = [0, 1, 2, 3, 4].map((i) => min + ((mx - min) * i) / 4);
  const out: React.ReactNode[] = [];
  ticks.forEach((t, i) => {
    const f = sc(t);
    if (dir === 'v') {
      const y = top + ph - f * ph;
      if (grid) out.push(<line key={'g' + i} x1={left} x2={left + pw} y1={y} y2={y} stroke={depth ? '#64748B' : '#334155'} strokeWidth={depth ? 2 : 1} />);
      out.push(<Tx key={'t' + i} x={left - 10} y={y + 5} s={fmt(t)} a="end" />);
    } else {
      const x = left + f * pw;
      if (grid) out.push(<line key={'g' + i} y1={top} y2={top + ph} x1={x} x2={x} stroke="#334155" strokeWidth={1} />);
      if (grid || !lab) out.push(<Tx key={'t' + i} x={x} y={top + ph + 24} s={fmt(t)} />);
    }
  });
  d.forEach((q, i) => {
    const f = sc(q.v) * e;
    if (dir === 'v') {
      const cw = pw / n;
      const bw = cw * 0.6;
      const x = left + i * cw + (cw - bw) / 2;
      const hh = f * ph;
      const y = top + ph - hh;
      if (depth) {
        out.push(<polygon key={'s' + i} points={`${x + bw},${y} ${x + bw + depth},${y - depth} ${x + bw + depth},${y + hh - depth} ${x + bw},${y + hh}`} fill="#075985" />);
        out.push(<polygon key={'u' + i} points={`${x},${y} ${x + depth},${y - depth} ${x + bw + depth},${y - depth} ${x + bw},${y}`} fill="#7DD3FC" />);
      }
      out.push(<rect key={'b' + i} x={x} y={y} width={bw} height={hh} fill={col} />);
      if (lab) out.push(<Tx key={'l' + i} x={x + bw / 2} y={y - 8} s={fmt(q.v)} c={C.text} z={18} b o={e} />);
      out.push(angled ? <Tx key={'x' + i} x={x + bw / 2 + 6} y={top + ph + 16} s={q.l} a="end" r={-45} z={15} /> : <Tx key={'x' + i} x={x + bw / 2} y={top + ph + 28} s={q.l} z={17} c={C.text} />);
    } else {
      const ch = ph / n;
      const bh = ch * 0.64;
      const y = top + i * ch + (ch - bh) / 2;
      out.push(<rect key={'b' + i} x={left} y={y} width={f * pw} height={bh} fill={col} />);
      if (lab) out.push(<Tx key={'l' + i} x={left + f * pw + 8} y={y + bh / 2 + 6} s={fmt(q.v)} c={C.text} z={16} a="start" b o={e} />);
      out.push(<Tx key={'x' + i} x={left - 10} y={y + bh / 2 + 6} s={q.l} a="end" c={C.text} z={n > 10 ? 16 : 19} />);
    }
  });
  return (
    <FR w={w} h={h} bg={bg}>
      {title ? <Tx x={w / 2} y={34} s={title} c={C.text} z={22} b /> : null}
      {legend ? <g><rect x={left} y={title ? 46 : 8} width={16} height={16} fill={col} /><Tx x={left + 24} y={title ? 60 : 22} s={legend} a="start" c={C.text} z={16} /></g> : null}
      {out}
      <line x1={left} x2={left} y1={top} y2={top + ph} stroke="#64748B" strokeWidth={2} />
      <line x1={left} x2={left + pw} y1={top + ph} y2={top + ph} stroke="#64748B" strokeWidth={2} />
    </FR>
  );
};

export const Lines: React.FC<{w: number; h: number; d: number[]; labels: string[]; p?: number; col?: string; grid?: boolean; title?: string; lab?: boolean}> = ({w, h, d, labels, p = 1, col = C.green, grid = true, title, lab = false}) => {
  const left = 70, right = 34, top = title ? 56 : 24, bottom = 46;
  const pw = w - left - right, ph = h - top - bottom;
  const mx = Math.ceil(Math.max(...d) / 200) * 200;
  const X = (i: number) => left + (i * pw) / (d.length - 1);
  const Y = (v: number) => top + ph - (v / mx) * ph;
  const path = d.map((v, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(v)}`).join(' ');
  const e = pc(p);
  return (
    <FR w={w} h={h}>
      {title ? <Tx x={w / 2} y={34} s={title} c={C.text} z={22} b /> : null}
      {[0, 1, 2, 3, 4].map((i) => {
        const v = (mx * i) / 4;
        return <g key={i}>{grid ? <line x1={left} x2={left + pw} y1={Y(v)} y2={Y(v)} stroke="#334155" /> : null}<Tx x={left - 10} y={Y(v) + 5} s={fmt(v)} a="end" /></g>;
      })}
      {labels.map((l, i) => <Tx key={i} x={X(i)} y={top + ph + 28} s={l} c={C.text} z={d.length > 8 ? 15 : 17} />)}
      <path d={path} fill="none" stroke={col} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e} />
      {d.map((v, i) => (e >= i / (d.length - 1) ? <circle key={i} cx={X(i)} cy={Y(v)} r={6} fill={col} /> : null))}
      {lab && e >= 1 ? <Tx x={X(d.length - 1)} y={Y(d[d.length - 1]) - 14} s={fmt(d[d.length - 1])} c={C.text} z={18} b /> : null}
      <line x1={left} x2={left} y1={top} y2={top + ph} stroke="#64748B" strokeWidth={2} />
      <line x1={left} x2={left + pw} y1={top + ph} y2={top + ph} stroke="#64748B" strokeWidth={2} />
    </FR>
  );
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const q = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = q(a0);
  const [x1, y1] = q(a1);
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1} Z`;
};
export const PIE12 = ['#38BDF8', '#10B981', '#F59E0B', '#A855F7', '#EF4444', '#EC4899', '#14B8A6', '#84CC16', '#F97316', '#6366F1', '#06B6D4', '#EAB308'];
export const Pie: React.FC<{w: number; h: number; v: number[]; cols: string[]; names: string[]; p?: number; lab?: boolean; title?: string; rm?: number}> = ({w, h, v, cols, names, p = 1, lab = true, title, rm = 70}) => {
  const tot = v.reduce((a, b) => a + b, 0);
  const cx = w / 2, cy = (title ? 50 : 0) + (h - (title ? 50 : 0)) / 2, r = Math.min(w, h - (title ? 50 : 0)) / 2 - rm;
  const sweep = 2 * Math.PI * pc(p);
  let acc = 0;
  const out: React.ReactNode[] = [];
  v.forEach((x, i) => {
    const a0 = -Math.PI / 2 + (acc / tot) * 2 * Math.PI;
    const a1 = -Math.PI / 2 + ((acc + x) / tot) * 2 * Math.PI;
    acc += x;
    const lim = -Math.PI / 2 + sweep;
    if (a0 >= lim) return;
    out.push(<path key={i} d={arc(cx, cy, r, a0, Math.min(a1, lim))} fill={cols[i]} stroke="#0F172A" strokeWidth={2} />);
    if (lab && a1 <= lim + 0.01) {
      const m = (a0 + a1) / 2;
      const lx = cx + (r + 38) * Math.cos(m);
      const ly = cy + (r + 38) * Math.sin(m);
      out.push(<Tx key={'l' + i} x={lx} y={ly + 5} s={`${names[i]} ${((x / tot) * 100).toFixed(v.length > 6 ? 0 : 1)}%`} c={C.text} z={v.length > 6 ? 15 : 20} b={v.length <= 6} />);
    }
  });
  return <FR w={w} h={h}>{title ? <Tx x={w / 2} y={34} s={title} c={C.text} z={22} b /> : null}{out}</FR>;
};

export const Stack: React.FC<{w: number; h: number; rows: {l: string; v: number[]}[]; cols: string[]; names: string[]; p?: number; title?: string}> = ({w, h, rows, cols, names, p = 1, title}) => {
  const left = 130, right = 30, top = 100, bottom = 40;
  const pw = w - left - right, ph = h - top - bottom;
  const mx = 5000;
  const e = pc(p);
  const ch = ph / rows.length;
  const out: React.ReactNode[] = [];
  rows.forEach((r, i) => {
    let acc = 0;
    const y = top + i * ch + ch * 0.18;
    out.push(<Tx key={'r' + i} x={left - 12} y={y + ch * 0.32 + 6} s={r.l} a="end" c={C.text} z={19} />);
    r.v.forEach((x, j) => {
      const x0 = left + (acc / mx) * pw * e;
      const ww = (x / mx) * pw * e;
      acc += x;
      out.push(<rect key={i + '_' + j} x={x0} y={y} width={ww} height={ch * 0.64} fill={cols[j]} />);
      if (ww > 60) out.push(<Tx key={'v' + i + j} x={x0 + ww / 2} y={y + ch * 0.32 + 6} s={fmt(x)} c="#0F172A" z={17} b />);
    });
  });
  return (
    <FR w={w} h={h}>
      {title ? <Tx x={w / 2} y={34} s={title} c={C.text} z={22} b /> : null}
      {names.map((nm, j) => <g key={j}><rect x={left + j * 190} y={56} width={16} height={16} fill={cols[j]} /><Tx x={left + j * 190 + 24} y={70} s={nm} a="start" c={C.text} z={17} /></g>)}
      {out}
      <line x1={left} x2={left} y1={top} y2={top + ph} stroke="#64748B" strokeWidth={2} />
    </FR>
  );
};

export const corr = (pts: number[][]) => {
  const n = pts.length, mx = pts.reduce((a, q) => a + q[0], 0) / n, my = pts.reduce((a, q) => a + q[1], 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  pts.forEach((q) => { sxy += (q[0] - mx) * (q[1] - my); sxx += (q[0] - mx) ** 2; syy += (q[1] - my) ** 2; });
  return {r: sxy / Math.sqrt(sxx * syy), m: sxy / sxx, b: my - (sxy / sxx) * mx};
};
export const Scatter: React.FC<{w: number; h: number; pts: number[][]; p?: number; title?: string; xl: string; yl: string; col?: string; ym?: number}> = ({w, h, pts, p = 1, title, xl, yl, col = C.purple, ym = 1000}) => {
  const left = 78, right = 30, top = title ? 56 : 24, bottom = 66;
  const pw = w - left - right, ph = h - top - bottom;
  const xm = 100;
  const X = (v: number) => left + (v / xm) * pw;
  const Y = (v: number) => top + ph - (v / ym) * ph;
  const k = corr(pts);
  const e = pc(p);
  return (
    <FR w={w} h={h}>
      {title ? <Tx x={w / 2} y={34} s={title} c={C.text} z={22} b /> : null}
      {[0, 25, 50, 75, 100].map((v) => <Tx key={v} x={X(v)} y={top + ph + 26} s={String(v)} />)}
      {[0, 1, 2, 3, 4].map((i) => <Tx key={i} x={left - 10} y={Y((ym * i) / 4) + 5} s={fmt((ym * i) / 4)} a="end" />)}
      <Tx x={left + pw / 2} y={h - 12} s={xl} c={C.text} z={17} />
      <Tx x={20} y={top + ph / 2} s={yl} c={C.text} z={17} r={-90} />
      {pts.map((q, i) => (e >= i / pts.length ? <circle key={i} cx={X(q[0])} cy={Y(q[1])} r={8} fill={col} opacity={0.9} /> : null))}
      {e >= 1 ? <line x1={X(0)} y1={Y(k.b)} x2={X(100)} y2={Y(k.m * 100 + k.b)} stroke={C.text} strokeWidth={3} strokeDasharray="8 6" /> : null}
      {e >= 1 ? <Tx x={left + 16} y={top + 26} s={`r = ${k.r.toFixed(2)}`} a="start" c={C.text} z={22} b /> : null}
      <line x1={left} x2={left} y1={top} y2={top + ph} stroke="#64748B" strokeWidth={2} />
      <line x1={left} x2={left + pw} y1={top + ph} y2={top + ph} stroke="#64748B" strokeWidth={2} />
    </FR>
  );
};

export const Hist: React.FC<{w: number; h: number; d: number[]; labels: string[]; p?: number; title?: string; col?: string}> = ({w, h, d, labels, p = 1, title, col = C.purple}) => {
  const left = 76, right = 30, top = title ? 56 : 24, bottom = 66;
  const pw = w - left - right, ph = h - top - bottom;
  const mx = 2000;
  const cw = pw / d.length;
  const e = pc(p);
  return (
    <FR w={w} h={h}>
      {title ? <Tx x={w / 2} y={34} s={title} c={C.text} z={22} b /> : null}
      {[0, 500, 1000, 1500, 2000].map((v) => <Tx key={v} x={left - 10} y={top + ph - (v / mx) * ph + 5} s={fmt(v)} a="end" />)}
      {d.map((v, i) => <rect key={i} x={left + i * cw + 1} y={top + ph - (v / mx) * ph * e} width={cw - 2} height={(v / mx) * ph * e} fill={col} />)}
      {labels.map((l, i) => <Tx key={'x' + i} x={left + i * cw + cw / 2} y={top + ph + 26} s={l} c={C.text} z={16} />)}
      <Tx x={left + pw / 2} y={h - 10} s="Customer age (equal bins)" c={C.dim} z={16} />
      <line x1={left} x2={left} y1={top} y2={top + ph} stroke="#64748B" strokeWidth={2} />
      <line x1={left} x2={left + pw} y1={top + ph} y2={top + ph} stroke="#64748B" strokeWidth={2} />
    </FR>
  );
};
