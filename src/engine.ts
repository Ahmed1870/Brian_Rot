// محرك 3D بالـ Canvas: جسيمات + مجسمات زجاجية + مكعب فائق 4D + موجات صدمة.
// كل حاجة دالة في الزمن t (ثواني) وبترجع لنفس الحالة بالظبط عند t=10 زي t=0 (لوب غير محسوس).

export const W = 1080;
export const H = 1920;
export const CX = 540;
export const CY = 930;
const TAU = Math.PI * 2;

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ss = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const eo = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const ei = (x: number) => Math.pow(clamp(x), 3);
export const eio = (x: number) => {
  const c = clamp(x);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
export const hash = (i: number, f: number, k: number) => {
  const x = Math.sin(i * 127.1 + f * 311.7 + k * 74.7) * 43758.5453;
  return x - Math.floor(x);
};
const mulberry32 = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type V3 = [number, number, number];

// ================= الكاميرا =================
const pitchAt = (t: number) => (t < 2.6 ? 0.95 : t < 3.6 ? lerp(0.95, 0.15, ss(2.6, 3.6, t)) : t < 8.8 ? 0.15 : lerp(0.15, 0.95, ss(8.8, 9.9, t)));
export type Cam = {yaw: number; pitch: number};
export const camAt = (t: number): Cam => ({yaw: 0.35 * Math.sin((TAU * t) / 10), pitch: pitchAt(t)});

type Pr = {x: number; y: number; z: number; s: number};
const project = (p: V3, cam: Cam): Pr => {
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const x1 = p[0] * cy + p[2] * sy;
  const z1 = -p[0] * sy + p[2] * cy;
  const y2 = p[1] * cp - z1 * sp;
  const z2 = p[1] * sp + z1 * cp;
  const s = 1500 / (1500 + z2);
  return {x: CX + x1 * s, y: CY + y2 * s, z: z2, s};
};

// ================= Sprites (توهج) =================
const COLORS = ['0,240,255', '37,99,235', '255,255,255', '255,190,40'];
let SPR: HTMLCanvasElement[] | null = null;
const sprites = () => {
  if (SPR) return SPR;
  SPR = COLORS.map((c) => {
    const cv = document.createElement('canvas');
    cv.width = 64;
    cv.height = 64;
    const g = cv.getContext('2d')!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(${c},1)`);
    gr.addColorStop(0.25, `rgba(${c},0.55)`);
    gr.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return cv;
  });
  return SPR;
};

// ================= الجسيمات =================
const NP = 1800;
const V4: number[][] = [];
for (let i = 0; i < 16; i++) V4.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
const E4: [number, number][] = [];
for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) if (!(i & (1 << b))) E4.push([i, i | (1 << b)]);

type Ptc = {r: number; phi: number; zoff: number; edge: number; s: number; off: number[]; dir: V3; sz: number; col: number};
const PT: Ptc[] = (() => {
  const rnd = mulberry32(7);
  return new Array(NP).fill(0).map((_, i) => {
    const u = rnd();
    const z = rnd() * 2 - 1;
    const a = rnd() * TAU;
    const rr = Math.sqrt(1 - z * z);
    return {
      r: 90 + 560 * Math.sqrt(u),
      phi: rnd() * TAU,
      zoff: (rnd() - 0.5) * 240,
      edge: i % E4.length,
      s: rnd(),
      off: [(rnd() - 0.5) * 0.1, (rnd() - 0.5) * 0.1, (rnd() - 0.5) * 0.1, (rnd() - 0.5) * 0.1],
      dir: [rr * Math.cos(a), rr * Math.sin(a), z] as V3,
      sz: rnd(),
      col: u < 0.45 ? 0 : u < 0.78 ? 1 : u < 0.88 ? 2 : 3,
    };
  });
})();

export const tauAt = (t: number) => (t < 3 ? ei(t / 3) : t < 9 ? 1 : 1 - eio((t - 9) / 0.9));

const posA = (p: Ptc, tau: number): V3 => {
  const rr = p.r * (1 - 0.92 * Math.pow(tau, 1.3));
  const ang = p.phi + 2.6 * (p.r / 650) + 10 * tau * (1.2 - p.r / 700);
  return [Math.cos(ang) * rr, Math.sin(ang) * rr, p.zoff * (1 - tau)];
};

const rot2 = (a: number, b: number, ang: number): [number, number] => [a * Math.cos(ang) - b * Math.sin(ang), a * Math.sin(ang) + b * Math.cos(ang)];
const tessAngles = (t: number) => {
  const tt = Math.max(0, t - 3);
  const w = tt + 0.12 * tt * tt;
  return {a: 0.9 * w, b: 0.65 * w, c: 0.4 * w, d: 0.55 * w};
};
const tessScale = (t: number) => 215 * (1 - 0.3 * ss(6.8, 8, t)) * (1 + 0.04 * Math.sin(t * 9));
const tessPoint = (v: number[], t: number): {p: V3; w: number} => {
  const g = tessAngles(t);
  let [x, y, z, w] = v;
  [x, w] = rot2(x, w, g.a);
  [y, z] = rot2(y, z, g.b);
  [x, y] = rot2(x, y, g.c);
  [z, w] = rot2(z, w, g.d);
  const k = 3.6 / (3.6 - w);
  const sc = tessScale(t) * k;
  return {p: [x * sc, y * sc, z * sc], w};
};

type PP = {p: V3; c: number};
const posB = (p: Ptc, t: number, f: number, i: number): PP => {
  const e = E4[p.edge];
  const a = V4[e[0]];
  const b = V4[e[1]];
  const v = [0, 1, 2, 3].map((k) => lerp(a[k], b[k], p.s) + p.off[k]);
  const r = tessPoint(v, t);
  const J = 16 * Math.pow(ss(6.4, 8, t), 2);
  const jx = J ? (hash(i, f, 1) - 0.5) * J : 0;
  const jy = J ? (hash(i, f, 2) - 0.5) * J : 0;
  const jz = J ? (hash(i, f, 3) - 0.5) * J : 0;
  return {p: [r.p[0] + jx, r.p[1] + jy, r.p[2] + jz], c: r.w > 0.25 ? 3 : r.w < -0.25 ? 0 : 2};
};

const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

const BLAST = 1700;
const blastR = (p: Ptc) => BLAST * (0.6 + 0.8 * p.sz);

/** موضع الجسيم i عند الزمن t (المراحل: دوامة → مكعب فائق → انفجار → سحب مغناطيسي للبداية). */
export const ppos = (i: number, t: number): PP => {
  const p = PT[i];
  const f = Math.round(t * 30);
  if (t < 3) return {p: posA(p, tauAt(t)), c: p.col};
  if (t < 8) {
    const a1 = posA(p, 1);
    const b = posB(p, t, f, i);
    const w = ss(3, 3.9, t);
    return {p: mix3(a1, b.p, w), c: w > 0.5 ? b.c : p.col};
  }
  const b8 = posB(p, 8, 240, i);
  if (t < 9) {
    const R = blastR(p) * eo(t - 8);
    return {p: [b8.p[0] + p.dir[0] * R, b8.p[1] + p.dir[1] * R, b8.p[2] + p.dir[2] * R], c: p.sz > 0.5 ? 3 : 2};
  }
  const R9 = blastR(p);
  const c9: V3 = [b8.p[0] + p.dir[0] * R9, b8.p[1] + p.dir[1] * R9, b8.p[2] + p.dir[2] * R9];
  return {p: mix3(c9, posA(p, 0), eio((t - 9) / 0.9)), c: p.col};
};

// ================= المجسمات الزجاجية =================
type Solid = {v: V3[]; e: [number, number][]; f: number[][]};
const unit = (v: number[]): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const edgesOf = (v: V3[]): [number, number][] => {
  let min = Infinity;
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) min = Math.min(min, Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]));
  const out: [number, number][] = [];
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) if (Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]) < min * 1.05) out.push([i, j]);
  return out;
};
const trisOf = (n: number, e: [number, number][]): number[][] => {
  const has = new Set(e.map(([a, b]) => `${a}-${b}`));
  const out: number[][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) if (has.has(`${i}-${j}`) && has.has(`${j}-${k}`) && has.has(`${i}-${k}`)) out.push([i, j, k]);
  return out;
};
const mk = (raw: number[][], faces?: number[][]): Solid => {
  const v = raw.map(unit);
  const e = edgesOf(v);
  return {v, e, f: faces ?? trisOf(v.length, e)};
};
const PHI = (1 + Math.sqrt(5)) / 2;
const SOLIDS = {
  tetra: mk([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]),
  octa: mk([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]),
  icosa: mk([[0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI], [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0], [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1]]),
  cube: mk(
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i & 4 ? 1 : -1, i & 2 ? 1 : -1, i & 1 ? 1 : -1]),
    [[4, 5, 7, 6], [0, 1, 3, 2], [2, 3, 7, 6], [0, 1, 5, 4], [1, 3, 7, 5], [0, 2, 6, 4]],
  ),
  dodeca: mk([
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i & 4 ? 1 : -1, i & 2 ? 1 : -1, i & 1 ? 1 : -1]),
    ...[[0, 1 / PHI, PHI], [0, 1 / PHI, -PHI], [0, -1 / PHI, PHI], [0, -1 / PHI, -PHI], [1 / PHI, PHI, 0], [1 / PHI, -PHI, 0], [-1 / PHI, PHI, 0], [-1 / PHI, -PHI, 0], [PHI, 0, 1 / PHI], [PHI, 0, -1 / PHI], [-PHI, 0, 1 / PHI], [-PHI, 0, -1 / PHI]],
  ], []),
};
const POLYS: {s: Solid; size: number; col: number; a0: [number, number, number]}[] = [
  {s: SOLIDS.icosa, size: 125, col: 0, a0: [0.4, 0.2, 0.1]},
  {s: SOLIDS.octa, size: 135, col: 3, a0: [0.9, 0.5, 0.3]},
  {s: SOLIDS.tetra, size: 150, col: 1, a0: [0.2, 1.1, 0.6]},
  {s: SOLIDS.cube, size: 105, col: 0, a0: [0.7, 0.4, 0.9]},
  {s: SOLIDS.dodeca, size: 125, col: 3, a0: [0.3, 0.8, 0.2]},
  {s: SOLIDS.icosa, size: 95, col: 1, a0: [1.0, 0.1, 0.5]},
];
const fillOf = (c: number, a: number) => `rgba(${COLORS[c]},${a})`;

const rotXYZ = (v: V3, rx: number, ry: number, rz: number): V3 => {
  let [x, y, z] = v;
  [y, z] = rot2(y, z, rx);
  [x, z] = rot2(x, z, ry);
  [x, y] = rot2(x, y, rz);
  return [x, y, z];
};

// ================= الرسم =================
const STARS = (() => {
  const rnd = mulberry32(99);
  return new Array(110).fill(0).map(() => ({x: rnd() * W, y: rnd() * H, r: 0.8 + rnd() * 1.8, k: 3 + Math.floor(rnd() * 6), ph: rnd() * TAU}));
})();

export function drawScene(ctx: CanvasRenderingContext2D, t: number) {
  const sp = sprites();
  const cam = camAt(t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // نجوم خلفية (دورية: بتتكرر كل 10 ثواني)
  for (const s of STARS) {
    ctx.globalAlpha = 0.15 + 0.25 * (0.5 + 0.5 * Math.sin((TAU * t * s.k) / 10 + s.ph));
    ctx.drawImage(sp[0], s.x - s.r * 3, s.y - s.r * 3, s.r * 6, s.r * 6);
  }

  // حلقات النفق: بتتسارع وبترجع لنفس الطور عند t=10
  const env = 1 - 0.75 * ss(3, 3.6, t) * (1 - ss(9, 9.9, t));
  const phi = 40 * Math.pow(t / 10, 2);
  for (let k = 0; k < 7; k++) {
    const u = (((phi + k / 7) % 1) + 1) % 1;
    const r = 70 + 900 * Math.pow(u, 1.6);
    ctx.globalAlpha = Math.sin(Math.PI * u) * 0.32 * env;
    ctx.strokeStyle = k % 2 ? '#2563EB' : '#00F0FF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(CX, CY, r, r * Math.max(0.12, Math.cos(cam.pitch)), 0, 0, TAU);
    ctx.stroke();
  }

  // ===== الجسيمات + خطوط السرعة =====
  const blast = t >= 8 && t < 9;
  for (let i = 0; i < NP; i++) {
    const cur = ppos(i, t);
    const a = project(cur.p, cam);
    const size = (2.4 + PT[i].sz * 3.4) * a.s * (blast ? 1.5 : 1);
    if (t > 0.04) {
      const prev = project(ppos(i, t - 1 / 30).p, cam);
      const dd = Math.hypot(a.x - prev.x, a.y - prev.y);
      if (dd > 7) {
        ctx.globalAlpha = Math.min(0.55, dd / 70);
        ctx.strokeStyle = `rgba(${COLORS[cur.c]},1)`;
        ctx.lineWidth = Math.max(1, size * 0.55);
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = blast ? 0.95 : 0.6;
    ctx.drawImage(sp[cur.c], a.x - size * 2, a.y - size * 2, size * 4, size * 4);
  }

  // ===== المجسمات الزجاجية =====
  const tau = tauAt(t);
  if (tau < 0.985) {
    const wob = 0.25 * Math.sin((TAU * t * 2) / 10);
    const items = POLYS.map((P, k) => {
      const R = 420 * (1 - tau);
      const th = (k * TAU) / 6 + 6.6 * tau;
      const S = P.size * Math.pow(1 - tau, 0.7);
      const c: V3 = [Math.cos(th) * R, Math.sin(th) * R, 110 * Math.sin(2 * th + k)];
      const rx = P.a0[0] + 9 * tau + wob;
      const ry = P.a0[1] + 7 * tau - wob;
      const rz = P.a0[2] + 5 * tau;
      const verts = P.s.v.map((v) => {
        const q = rotXYZ(v, rx, ry, rz);
        return [c[0] + q[0] * S, c[1] + q[1] * S, c[2] + q[2] * S] as V3;
      });
      return {P, k, c, verts, depth: project(c, cam).z};
    }).sort((a, b) => b.depth - a.depth);

    for (const it of items) {
      const pr = it.verts.map((v) => project(v, cam));
      const faces = it.P.s.f
        .map((f) => ({f, z: f.reduce((s, i) => s + pr[i].z, 0) / f.length}))
        .sort((a, b) => b.z - a.z);
      for (const {f} of faces) {
        const n0 = it.verts[f[0]];
        const n1 = it.verts[f[1]];
        const n2 = it.verts[f[2]];
        const ux = n1[0] - n0[0];
        const uy = n1[1] - n0[1];
        const uz = n1[2] - n0[2];
        const vx = n2[0] - n0[0];
        const vy = n2[1] - n0[1];
        const vz = n2[2] - n0[2];
        let nx = uy * vz - uz * vy;
        let ny = uz * vx - ux * vz;
        let nz = ux * vy - uy * vx;
        const l = Math.hypot(nx, ny, nz) || 1;
        nx /= l;
        ny /= l;
        nz /= l;
        const lit = 0.5 + 0.5 * Math.abs(nx * 0.4 - ny * 0.6 - nz * 0.7);
        ctx.globalAlpha = 1 - ss(0.8, 0.985, tau);
        ctx.fillStyle = fillOf(it.P.col, 0.05 + 0.16 * lit);
        ctx.beginPath();
        f.forEach((vi, idx) => (idx ? ctx.lineTo(pr[vi].x, pr[vi].y) : ctx.moveTo(pr[vi].x, pr[vi].y)));
        ctx.closePath();
        ctx.fill();
      }
      const sc = pr[0].s;
      for (const pass of [0, 1]) {
        ctx.globalAlpha = (pass ? 0.8 : 0.16) * (1 - ss(0.8, 0.985, tau));
        ctx.strokeStyle = pass ? '#FFFFFF' : fillOf(it.P.col, 1);
        ctx.lineWidth = (pass ? 2.4 : 8) * sc;
        ctx.beginPath();
        for (const [a, b] of it.P.s.e) {
          ctx.moveTo(pr[a].x, pr[a].y);
          ctx.lineTo(pr[b].x, pr[b].y);
        }
        ctx.stroke();
      }
    }
  }

  // ===== المكعب الفائق (Tesseract) + القلب السائل =====
  const tA = ss(3.3, 4.2, t) * (1 - ss(7.98, 8.05, t));
  if (tA > 0.01) {
    const pts = V4.map((v) => tessPoint(v, t));
    const pr = pts.map((q) => project(q.p, cam));
    const colAt = (w: number) => {
      const k = clamp((w + 1.4) / 2.8);
      return `rgb(${Math.round(lerp(0, 255, k))},${Math.round(lerp(240, 190, k))},${Math.round(lerp(255, 40, k))})`;
    };
    for (const pass of [0, 1]) {
      ctx.lineWidth = pass ? 3.4 : 11;
      ctx.globalAlpha = tA * (pass ? 0.95 : 0.16);
      for (const [a, b] of E4) {
        const g = ctx.createLinearGradient(pr[a].x, pr[a].y, pr[b].x, pr[b].y);
        g.addColorStop(0, colAt(pts[a].w));
        g.addColorStop(1, colAt(pts[b].w));
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(pr[a].x, pr[a].y);
        ctx.lineTo(pr[b].x, pr[b].y);
        ctx.stroke();
      }
    }
    pr.forEach((q, i) => {
      const r = 26 * q.s * (1 + 0.3 * Math.sin(t * 12 + i));
      ctx.globalAlpha = tA;
      ctx.drawImage(sp[pts[i].w > 0 ? 3 : 0], q.x - r, q.y - r, r * 2, r * 2);
      ctx.drawImage(sp[2], q.x - r * 0.5, q.y - r * 0.5, r, r);
    });
    // قلب معدني سائل (ذهبي + سماوي)
    const c0 = project([0, 0, 0], cam);
    const coreR = 60 + 150 * Math.pow(ss(5, 8, t), 2);
    for (let k = 0; k < 6; k++) {
      const ang = t * 3 + (k * TAU) / 6;
      const ox = Math.cos(ang) * (40 + 30 * Math.sin(t * 2 + k));
      const oy = Math.sin(ang * 1.3) * (40 + 30 * Math.cos(t * 2 + k));
      const rr = coreR * (0.8 + 0.4 * Math.sin(t * 5 + k * 2));
      ctx.globalAlpha = tA * 0.38;
      ctx.drawImage(sp[k % 2 ? 3 : 0], c0.x + ox - rr, c0.y + oy - rr, rr * 2, rr * 2);
    }
    ctx.globalAlpha = tA * 0.8;
    ctx.drawImage(sp[2], c0.x - coreR * 0.6, c0.y - coreR * 0.6, coreR * 1.2, coreR * 1.2);
  }

  // ===== موجات الصدمة + السحب المغناطيسي =====
  if (t >= 8 && t < 9.2) {
    for (let k = 0; k < 3; k++) {
      const u = clamp((t - 8 - k * 0.09) / 0.9);
      if (u <= 0) continue;
      ctx.globalAlpha = (1 - u) * 0.95;
      ctx.strokeStyle = k === 1 ? '#FFD76A' : k === 2 ? '#00F0FF' : '#FFFFFF';
      ctx.lineWidth = 16 * (1 - u) + 2;
      ctx.beginPath();
      ctx.ellipse(CX, CY, 1500 * eo(u), 1500 * eo(u) * Math.max(0.35, Math.cos(cam.pitch)), 0, 0, TAU);
      ctx.stroke();
    }
  }
  if (t >= 9 && t < 9.95) {
    const u = (t - 9) / 0.9;
    for (let k = 0; k < 3; k++) {
      const uu = clamp(u - k * 0.1);
      const r = 950 * (1 - eio(uu));
      ctx.globalAlpha = 0.4 * Math.sin(Math.PI * clamp(uu));
      ctx.strokeStyle = k % 2 ? '#2563EB' : '#00F0FF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(CX, CY, r, r * Math.max(0.12, Math.cos(cam.pitch)), 0, 0, TAU);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

// قيم مساعدة للطبقات الـ DOM
export const flashAt = (t: number) => {
  if (t >= 9.5 || t < 7.2) return 0;
  const pre = 0.35 * Math.pow(ss(7.2, 8, t), 2);
  const post = t >= 8 ? Math.exp(-(t - 8) * 9) : 0;
  return Math.max(t < 8 ? pre : 0, post);
};
export const shakeAt = (t: number, f: number) => {
  const a = 10 * Math.pow(ss(7, 8, t), 2) * (t < 8 ? 1 : 0) + (t >= 8 && t < 9.5 ? 24 * Math.exp(-(t - 8) * 6) : 0);
  return {x: (hash(f, 1, 1) - 0.5) * a, y: (hash(f, 2, 2) - 0.5) * a};
};
