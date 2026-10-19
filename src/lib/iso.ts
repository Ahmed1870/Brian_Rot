/** 2.5D isometric helpers: world (x right-down, z left-down, y up) -> screen. */
export type Iso = {cx: number; cy: number; s: number};
export type Col = [number, number, number];
export type IBox = {x: number; y: number; z: number; w: number; h: number; d: number; col: Col; a?: number; stroke?: string; dash?: boolean; sw?: number; emissive?: number; key?: string | number};

export const isoP = (x: number, y: number, z: number, o: Iso): [number, number] => [o.cx + (x - z) * 0.866 * o.s, o.cy + (x + z) * 0.5 * o.s - y * o.s];
export const rgba = (c: Col, a = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${+a.toFixed(3)})`;
const shade = (c: Col, k: number): Col => [Math.min(255, c[0] * k), Math.min(255, c[1] * k), Math.min(255, c[2] * k)];

export type IPoly = {pts: [number, number][]; fill: string; stroke?: string; sw: number; dash?: boolean};

/** 3 visible faces (top, +z left, +x right). */
export const boxPolys = (b: IBox, o: Iso): IPoly[] => {
  const {x, y, z, w, h, d} = b;
  const a = b.a ?? 1;
  const e = b.emissive ?? 0;
  const P = (px: number, py: number, pz: number) => isoP(px, py, pz, o);
  const faces: {pts: [number, number][]; k: number}[] = [
    {pts: [P(x, y + h, z), P(x + w, y + h, z), P(x + w, y + h, z + d), P(x, y + h, z + d)], k: 1.0},
    {pts: [P(x, y, z + d), P(x + w, y, z + d), P(x + w, y + h, z + d), P(x, y + h, z + d)], k: 0.76},
    {pts: [P(x + w, y, z), P(x + w, y, z + d), P(x + w, y + h, z + d), P(x + w, y + h, z)], k: 0.56},
  ];
  return faces.map((f) => ({pts: f.pts, fill: rgba(shade(b.col, f.k + e), a), stroke: b.stroke, sw: b.sw ?? 1.5, dash: b.dash}));
};

export const sortBoxes = (bs: IBox[]) => [...bs].sort((p, q) => (p.x + p.z + (p.w + p.d) / 2) - (q.x + q.z + (q.w + q.d) / 2) || p.y - q.y);

export const COL = {
  white: [248, 250, 252] as Col,
  coral: [239, 68, 68] as Col,
  emerald: [16, 185, 129] as Col,
  yellow: [255, 230, 0] as Col,
  slate: [30, 41, 59] as Col,
  navy: [15, 23, 42] as Col,
};
