/** Tiny perspective engine: boxes/quads/lines/dots -> screen-space primitives, painter's-sorted. No WebGL needed. */
export type V3 = {x: number; y: number; z: number};
export type Cam = {x: number; y: number; z: number; yaw: number; pitch: number; f: number; cx: number; cy: number};
export type RGB = [number, number, number];

export type Prim =
  | {k: 'poly'; pts: [number, number][]; fill: string; stroke?: string; sw?: number; z: number; op?: number}
  | {k: 'line'; a: [number, number]; b: [number, number]; stroke: string; sw: number; z: number; op?: number; cap?: boolean}
  | {k: 'dot'; p: [number, number]; r: number; fill: string; z: number; op?: number};

export const rgba = (c: RGB, a = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${+a.toFixed(3)})`;
export const v3 = (x: number, y: number, z: number): V3 => ({x, y, z});

export const toCam = (p: V3, c: Cam): V3 => {
  const x = p.x - c.x, y = p.y - c.y, z = p.z - c.z;
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
  const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  return {x: x1, y: y * cp - z1 * sp, z: y * sp + z1 * cp};
};
export const proj = (p: V3, c: Cam) => {
  const q = toCam(p, c);
  const k = c.f / Math.max(40, q.z);
  return {x: c.cx + q.x * k, y: c.cy + q.y * k, z: q.z, k};
};
export const P2 = (p: V3, c: Cam): [number, number] => {
  const q = proj(p, c);
  return [q.x, q.y];
};

const LIGHT = (() => {
  const l = {x: -0.45, y: -0.75, z: -0.5};
  const n = Math.hypot(l.x, l.y, l.z);
  return {x: l.x / n, y: l.y / n, z: l.z / n};
})();

const FACES: {idx: number[]; n: V3}[] = [
  {idx: [0, 1, 3, 2], n: v3(0, 0, -1)}, // front (towards camera)
  {idx: [4, 5, 7, 6], n: v3(0, 0, 1)},
  {idx: [0, 2, 6, 4], n: v3(-1, 0, 0)},
  {idx: [1, 3, 7, 5], n: v3(1, 0, 0)},
  {idx: [0, 1, 5, 4], n: v3(0, -1, 0)}, // top (y is down)
  {idx: [2, 3, 7, 6], n: v3(0, 1, 0)},
];

const rotZ = (p: V3, pivot: V3, a: number): V3 => {
  const x = p.x - pivot.x, y = p.y - pivot.y;
  return v3(pivot.x + x * Math.cos(a) - y * Math.sin(a), pivot.y + x * Math.sin(a) + y * Math.cos(a), p.z);
};

export type BoxOpts = {
  c: V3; s: V3; col: RGB; alpha?: number; rotZ?: number; pivot?: V3; seams?: boolean; edge?: string; edgeW?: number;
  glass?: boolean; ambient?: number; emissive?: number; bias?: number;
};

/** Box -> faces with directional shading, formwork seams, backface culling (opaque) */
export const boxPrims = (o: BoxOpts, cam: Cam): Prim[] => {
  const out: Prim[] = [];
  const h = {x: o.s.x / 2, y: o.s.y / 2, z: o.s.z / 2};
  const pivot = o.pivot ?? o.c;
  const a = o.rotZ ?? 0;
  const vs: V3[] = [];
  for (let i = 0; i < 8; i++) {
    const p = v3(o.c.x + (i & 1 ? h.x : -h.x), o.c.y + (i & 2 ? h.y : -h.y), o.c.z + (i & 4 ? h.z : -h.z));
    vs.push(a ? rotZ(p, pivot, a) : p);
  }
  const camPos = v3(cam.x, cam.y, cam.z);
  for (const f of FACES) {
    const n = a ? v3(f.n.x * Math.cos(a) - f.n.y * Math.sin(a), f.n.x * Math.sin(a) + f.n.y * Math.cos(a), f.n.z) : f.n;
    const pts3 = f.idx.map((i) => vs[i]);
    const fc = v3((pts3[0].x + pts3[2].x) / 2, (pts3[0].y + pts3[2].y) / 2, (pts3[0].z + pts3[2].z) / 2);
    const toCamV = v3(camPos.x - fc.x, camPos.y - fc.y, camPos.z - fc.z);
    if (!o.glass && n.x * toCamV.x + n.y * toCamV.y + n.z * toCamV.z <= 0) continue;
    const d = Math.max(0, n.x * LIGHT.x + n.y * LIGHT.y + n.z * LIGHT.z);
    const k = Math.min(1.12, (o.ambient ?? 0.3) + 0.85 * d) + (o.emissive ?? 0);
    const pr = pts3.map((p) => proj(p, cam));
    const z = pr.reduce((s, p) => s + p.z, 0) / 4 + (o.bias ?? 0);
    const col: RGB = [Math.min(255, o.col[0] * k), Math.min(255, o.col[1] * k), Math.min(255, o.col[2] * k)];
    const sp = pr.map((p) => [p.x, p.y] as [number, number]);
    out.push({k: 'poly', pts: sp, fill: rgba(col, o.alpha ?? 1), stroke: o.edge, sw: o.edgeW ?? 1.2, z});
    if (o.seams && f.n.y === 0) {
      for (const t of [1 / 3, 2 / 3]) {
        const a0 = pr[0], b0 = pr[3], a1 = pr[1], b1 = pr[2];
        out.push({k: 'line', a: [a0.x + (b0.x - a0.x) * t, a0.y + (b0.y - a0.y) * t], b: [a1.x + (b1.x - a1.x) * t, a1.y + (b1.y - a1.y) * t],
          stroke: 'rgba(0,0,0,0.28)', sw: 2, z: z - 0.5});
      }
    }
  }
  return out;
};

/** Flat quad/polygon in world space. */
export const polyPrim = (pts: V3[], fill: string, cam: Cam, o: {stroke?: string; sw?: number; bias?: number; op?: number; z?: number} = {}): Prim => {
  const pr = pts.map((p) => proj(p, cam));
  return {k: 'poly', pts: pr.map((p) => [p.x, p.y]), fill, stroke: o.stroke, sw: o.sw, z: o.z ?? pr.reduce((s, p) => s + p.z, 0) / pr.length + (o.bias ?? 0), op: o.op};
};
export const linePrim = (a: V3, b: V3, stroke: string, sw: number, cam: Cam, bias = 0, op?: number, zAbs?: number): Prim => {
  const pa = proj(a, cam), pb = proj(b, cam);
  return {k: 'line', a: [pa.x, pa.y], b: [pb.x, pb.y], stroke, sw, z: zAbs ?? (pa.z + pb.z) / 2 + bias, op, cap: true};
};
export const dotPrim = (p: V3, r: number, fill: string, cam: Cam, bias = 0, op?: number): Prim => {
  const q = proj(p, cam);
  return {k: 'dot', p: [q.x, q.y], r: Math.max(0.3, r * q.k), fill, z: q.z + bias, op};
};
/** Far -> near */
export const sortPrims = (ps: Prim[]) => [...ps].sort((a, b) => b.z - a.z);
