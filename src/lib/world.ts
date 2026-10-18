import {Cam, Prim, V3, boxPrims, dotPrim, linePrim, polyPrim, proj, rgba, v3} from './engine';
import {clamp, easeInOut, easeOut, hash, kf, lerp, ramp} from './anim';
import {RGB as PAL} from '../theme';

const TAU = Math.PI * 2;
const CONC = PAL.concrete;
const EM = PAL.emerald;
const CR = PAL.crimson;

// =====================================================================================
// ACT I — the paradox pendulum
// =====================================================================================
export const CAM1: Cam = {x: 0, y: 0, z: -1400, yaw: 0, pitch: 0, f: 1400, cx: 540, cy: 900};
const PIV = v3(0, -1000, 0);
const LEN = 1250;
const PANE = {x0: -670, x1: -190, y0: -800, y1: 800, z: 480};
export const IMPACT = v3(-300, 120, PANE.z);

/** Heavy slow pendulum: quarter period lands exactly on frame 90 (max swing right). */
export const swing = (f: number) => 0.3 * Math.min(1, f / 14) * Math.sin((TAU * f) / 360);

type Crack = {pts: [number, number][]; len: number; delay: number; w: number};
const CRACKS: Crack[] = (() => {
  const out: Crack[] = [];
  const clampP = (x: number, y: number): [number, number] => [clamp(x, PANE.x0, PANE.x1), clamp(y, PANE.y0, PANE.y1)];
  for (let i = 0; i < 12; i++) {
    let a = (i / 12) * TAU + (hash(i * 3.1) - 0.5) * 0.4;
    let [x, y] = [IMPACT.x, IMPACT.y];
    const pts: [number, number][] = [[x, y]];
    const n = 5 + (i % 3);
    for (let s = 0; s < n; s++) {
      const l = 70 + hash(i * 7 + s) * 150;
      a += (hash(i * 11 + s * 5) - 0.5) * 0.55;
      [x, y] = clampP(x + Math.cos(a) * l, y + Math.sin(a) * l);
      pts.push([x, y]);
      if (s === 1 || s === 3) {
        // fine hairline branch
        let bx = x, by = y;
        const bp: [number, number][] = [[bx, by]];
        const ba = a + (s === 1 ? 0.9 : -0.9);
        for (let q = 0; q < 2; q++) {
          [bx, by] = clampP(bx + Math.cos(ba + q * 0.2) * (50 + hash(i + q) * 70), by + Math.sin(ba + q * 0.2) * (50 + hash(i * 2 + q) * 70));
          bp.push([bx, by]);
        }
        const bl = bp.slice(1).reduce((t, p, j) => t + Math.hypot(p[0] - bp[j][0], p[1] - bp[j][1]), 0);
        out.push({pts: bp, len: bl, delay: 0.25 + hash(i * 13 + s) * 0.2, w: 1.2});
      }
    }
    const len = pts.slice(1).reduce((t, p, j) => t + Math.hypot(p[0] - pts[j][0], p[1] - pts[j][1]), 0);
    out.push({pts, len, delay: hash(i * 17) * 0.12, w: 3});
  }
  return out;
})();

export const act1Prims = (f: number) => {
  const cam = CAM1;
  const prims: Prim[] = [];
  const th = swing(f);
  const bx = LEN * Math.sin(th);
  // --- room: wall, floor, formwork ---
  prims.push(polyPrim([v3(-1600, -3200, 500), v3(1600, -3200, 500), v3(1600, 1300, 500), v3(-1600, 1300, 500)], 'rgba(25,32,47,1)', cam, {z: 2000}));
  for (let y = -3000; y <= 1000; y += 200) prims.push(linePrim(v3(-1400, y, 500), v3(1400, y, 500), 'rgba(255,255,255,0.045)', 2, cam, 0, 1, 1999));
  for (let x = -1400; x <= 1400; x += 700) prims.push(linePrim(v3(x, -1000, 500), v3(x, 1300, 500), 'rgba(255,255,255,0.045)', 2, cam, 0, 1, 1999));
  prims.push(polyPrim([v3(-1600, 700, -1100), v3(1600, 700, -1100), v3(1600, 700, 500), v3(-1600, 700, 500)], 'rgba(15,20,31,1)', cam, {z: 1950}));
  for (let z = -1100; z <= 500; z += 160) prims.push(linePrim(v3(-1400, 700, z), v3(1400, 700, z), 'rgba(255,255,255,0.06)', 2, cam, 0, 1, 1949));
  for (let x = -1400; x <= 1400; x += 350) prims.push(linePrim(v3(x, 700, -1100), v3(x, 700, 500), 'rgba(255,255,255,0.06)', 2, cam, 0, 1, 1949));

  // --- frosted glass pane (vibrates after impact) ---
  const vib = f >= 90 ? 9 * Math.exp(-(f - 90) / 9) * Math.sin((f - 90) * 1.9) : 0;
  const pz = PANE.z;
  const px = (x: number) => x + vib;
  prims.push(polyPrim([v3(px(PANE.x0), PANE.y0, pz), v3(px(PANE.x1), PANE.y0, pz), v3(px(PANE.x1), PANE.y1, pz), v3(px(PANE.x0), PANE.y1, pz)], 'rgba(243,244,246,0.11)', cam,
    {stroke: 'rgba(243,244,246,0.55)', sw: 5, z: 1880}));
  prims.push(polyPrim([v3(px(PANE.x0 + 30), PANE.y0 + 30, pz), v3(px(PANE.x1 - 30), PANE.y0 + 30, pz), v3(px(PANE.x1 - 30), PANE.y1 - 30, pz), v3(px(PANE.x0 + 30), PANE.y1 - 30, pz)],
    'rgba(243,244,246,0.06)', cam, {stroke: 'rgba(243,244,246,0.18)', sw: 2, z: 1879}));
  prims.push(linePrim(v3(px(PANE.x0), 0, pz), v3(px(PANE.x1), 0, pz), 'rgba(243,244,246,0.45)', 4, cam, 0, 1, 1878));

  // --- the pendulum (rest pose rotated about the pivot) ---
  const rot = -th;
  const common = {rotZ: rot, pivot: PIV, col: CONC, seams: true, edge: 'rgba(0,0,0,0.35)'};
  prims.push(...boxPrims({c: v3(0, -1030, 0), s: v3(280, 70, 220), col: CONC, seams: true, edge: 'rgba(0,0,0,0.35)'}, cam));
  prims.push(...boxPrims({...common, c: v3(0, -470, 0), s: v3(18, 1060, 18), col: [90, 98, 112]}, cam));
  prims.push(...boxPrims({...common, c: v3(0, 250, 0), s: v3(300, 380, 300)}, cam));
  prims.push(...boxPrims({...common, c: v3(0, 455, 0), s: v3(350, 50, 350), col: [200, 203, 210]}, cam));
  prims.push(...boxPrims({...common, c: v3(0, 20, 0), s: v3(130, 60, 130), col: [200, 203, 210]}, cam));

  // --- the paradox: shadow swings LEFT while the mass swings RIGHT ---
  const xs = -1.55 * bx;
  const ys = 200;
  const sz = 1870;
  const rect = (w: number, h: number) => [v3(xs - w / 2, ys - h / 2, 470), v3(xs + w / 2, ys - h / 2, 470), v3(xs + w / 2, ys + h / 2, 470), v3(xs - w / 2, ys + h / 2, 470)];
  prims.push(polyPrim(rect(600, 760), 'rgba(2,4,9,0.16)', cam, {z: sz}));
  prims.push(polyPrim(rect(560, 720), 'rgba(2,4,9,0.22)', cam, {z: sz - 0.1}));
  prims.push(polyPrim(rect(520, 680), 'rgba(2,4,9,0.34)', cam, {z: sz - 0.2}));
  const rd = 20;
  prims.push(polyPrim([v3(-rd, -1000, 470), v3(rd, -1000, 470), v3(xs + rd, ys, 470), v3(xs - rd, ys, 470)], 'rgba(2,4,9,0.30)', cam, {z: sz - 0.3}));

  // --- hydraulic stress cracks (start on frame 90) ---
  const g = easeOut(ramp(f, 90, 140));
  if (g > 0) {
    const glow = ramp(f, 112, 150);
    for (const c of CRACKS) {
      const gi = clamp((g - c.delay) / (1 - c.delay));
      let remain = gi * c.len;
      const seg: [number, number][] = [c.pts[0]];
      for (let i = 1; i < c.pts.length && remain > 0; i++) {
        const [x0, y0] = c.pts[i - 1], [x1, y1] = c.pts[i];
        const l = Math.hypot(x1 - x0, y1 - y0);
        const t = Math.min(1, remain / l);
        seg.push([lerp(x0, x1, t), lerp(y0, y1, t)]);
        remain -= l;
      }
      for (let i = 1; i < seg.length; i++) {
        const a = v3(px(seg[i - 1][0]), seg[i - 1][1], pz - 2), b = v3(px(seg[i][0]), seg[i][1], pz - 2);
        if (glow > 0 && c.w > 2) prims.push(linePrim(a, b, rgba(EM, 0.5 * glow), 11, cam, 0, 1, 1876));
        prims.push(linePrim(a, b, 'rgba(250,250,250,0.92)', c.w, cam, 0, 1, 1875));
      }
    }
  }
  return {prims, impactScreen: (() => { const q = proj(v3(px(IMPACT.x), IMPACT.y, pz), cam); return [q.x, q.y] as [number, number]; })()};
};

// =====================================================================================
// ACTS II + III — the diorama: tower, unlit room, lens, sand -> model
// =====================================================================================
const LENS = v3(0, 700, 700);
const LENS_R = 1100;
const TOWER = v3(-430, 700, 650);
const FLOORS = 14;
const MISSING = 5;
const ROOM = {c: v3(470, 350, 760), s: v3(560, 700, 560)};

export const CAMF: Cam = {x: 0, y: 100, z: -1100, yaw: 0, pitch: 0, f: 1400, cx: 540, cy: 900};
const KF = [150, 190, 330, 400, 450, 510];
export const dioCam = (f: number): Cam => ({
  x: kf(f, KF, [-430, -420, -100, 0, 0, 0]),
  y: kf(f, KF, [260, 200, 100, -500, -700, 100]),
  z: kf(f, KF, [-700, -450, -1800, -2400, -2200, -1100]),
  pitch: kf(f, KF, [0, 0.02, 0.1, 0.28, 0.38, 0]),
  yaw: 0.03 * Math.sin(f / 40) * (1 - ramp(f, 450, 510)),
  f: 1400, cx: 540, cy: 900,
});

const collapseT = (k: number) => 190 + Math.abs(k - MISSING) * 7 + (k > MISSING ? 0 : 4);

// model (balanced architectural piece) -------------------------------------------------
type MBox = {c: V3; s: V3; col: [number, number, number]};
export const MODEL: MBox[] = [
  {c: v3(0, 660, 700), s: v3(780, 80, 420), col: CONC},
  {c: v3(-260, 390, 700), s: v3(180, 460, 200), col: CONC},
  {c: v3(260, 390, 700), s: v3(180, 460, 200), col: CONC},
  {c: v3(0, 110, 700), s: v3(820, 100, 300), col: CONC},
  {c: v3(0, -40, 700), s: v3(260, 200, 200), col: [226, 228, 233]},
];
const surfacePoint = (i: number): V3 => {
  const areas = MODEL.map((m) => m.s.x * m.s.y + m.s.x * m.s.z);
  let r = hash(i * 1.37) * areas.reduce((a, b) => a + b, 0);
  let bi = 0;
  while (bi < MODEL.length - 1 && r > areas[bi]) { r -= areas[bi]; bi++; }
  const m = MODEL[bi];
  const front = hash(i * 2.11) < 0.7;
  const x = m.c.x + (hash(i * 3.3) - 0.5) * m.s.x;
  return front ? v3(x, m.c.y + (hash(i * 4.9) - 0.5) * m.s.y, m.c.z - m.s.z / 2 - 2) : v3(x, m.c.y - m.s.y / 2 - 2, m.c.z + (hash(i * 5.7) - 0.5) * m.s.z);
};

export const modelPrims = (cam: Cam, p: number, f: number): Prim[] => {
  if (p <= 0.01) return [];
  const out: Prim[] = [];
  for (const m of MODEL) out.push(...boxPrims({c: m.c, s: m.s, col: m.col, alpha: p, seams: true, edge: `rgba(0,0,0,${0.3 * p})`, bias: -40}, cam));
  // emerald core in the void between the piers (the missing decision, found)
  const c = v3(0, 390, 640);
  const r = 70 + 4 * Math.sin(f / 9);
  const d = [v3(c.x, c.y - r, c.z), v3(c.x + r * 0.78, c.y, c.z), v3(c.x, c.y + r, c.z), v3(c.x - r * 0.78, c.y, c.z)];
  out.push(polyPrim(d.map((q) => v3(q.x * 1.9, c.y + (q.y - c.y) * 1.9, q.z)), rgba(EM, 0.14 * p), cam, {z: 1350}));
  out.push(polyPrim(d, rgba(EM, 0.95 * p), cam, {stroke: 'rgba(250,250,250,0.8)', sw: 2, z: 1300}));
  out.push(polyPrim(d.map((q) => v3(c.x + (q.x - c.x) * 0.45, c.y + (q.y - c.y) * 0.45, q.z - 5)), 'rgba(250,255,252,0.85)', cam, {z: 1290}));
  return out;
};

// sand grains ---------------------------------------------------------------------------
const G_PER = 30;
const PILE_X = TOWER.x;
const PILE_W = 340;
const pileH = (x: number) => Math.max(0, 230 * (1 - Math.pow((x - PILE_X) / PILE_W, 2)));
type Grain = {x0: number; y0: number; z0: number; lx: number; ly: number; lz: number; t0: number; fall: number; k: number; ts: number; dur: number; tgt: V3; ctl: V3};
const GRAINS: Grain[] = (() => {
  const out: Grain[] = [];
  let n = 0;
  for (let k = 0; k < FLOORS; k++) {
    if (k === MISSING) continue;
    for (let j = 0; j < G_PER; j++, n++) {
      const x0 = TOWER.x + (hash(n * 1.1) - 0.5) * 280, z0 = TOWER.z + (hash(n * 2.3) - 0.5) * 280;
      const y0 = 700 - 55 - k * 110 + (hash(n * 3.7) - 0.5) * 90;
      const lx = PILE_X + (hash(n * 4.1) - 0.5) * 2 * PILE_W * 0.95;
      const ly = 700 - pileH(lx) * Math.pow(hash(n * 5.3), 0.6) * 0.95;
      const lz = 650 + (hash(n * 6.7) - 0.5) * 260;
      const fall = Math.sqrt((2 * Math.max(10, ly - y0)) / 0.8);
      const tgt = surfacePoint(n);
      out.push({x0, y0, z0, lx, ly, lz, t0: collapseT(k) + hash(n * 7.9) * 14, fall, k, ts: 352 + hash(n * 8.3) * 60, dur: 60 + hash(n * 9.1) * 25, tgt,
        ctl: v3(lerp(lx, 0, 0.55), 700 - 180 - hash(n * 10.3) * 170, 700 + (hash(n * 11.7) - 0.5) * 200)});
    }
  }
  return out;
})();

const bez = (a: V3, c: V3, b: V3, t: number): V3 => {
  const u = 1 - t;
  return v3(u * u * a.x + 2 * u * t * c.x + t * t * b.x, u * u * a.y + 2 * u * t * c.y + t * t * b.y, u * u * a.z + 2 * u * t * c.z + t * t * b.z);
};

const circ = (cx: number, cz: number, r: number, y: number, n = 64) => Array.from({length: n}, (_, i) => v3(cx + Math.cos((i / n) * TAU) * r, y, cz + Math.sin((i / n) * TAU) * r));

export const dioramaPrims = (fIn: number, withModel = true): {prims: Prim[]; cam: Cam} => {
  const f = Math.min(fIn, 510);
  const cam = dioCam(f);
  const prims: Prim[] = [];
  const beam = ramp(f, 340, 362) * (1 - ramp(f, 455, 490));
  const flick = 0.85 + 0.15 * Math.sin(f * 0.9);

  // lens: rim, face, rings, emerald caustic
  prims.push(polyPrim(circ(LENS.x, LENS.z, LENS_R, 790), 'rgba(4,6,11,1)', cam, {z: 9100}));
  prims.push(polyPrim(circ(LENS.x, LENS.z, LENS_R, 740), 'rgba(7,10,18,1)', cam, {z: 9090}));
  prims.push(polyPrim(circ(LENS.x, LENS.z, LENS_R, 700), 'rgba(10,15,26,1)', cam, {stroke: 'rgba(243,244,246,0.35)', sw: 3, z: 9080}));
  [950, 800, 650, 500, 350, 200].forEach((r, i) => {
    const lit = beam * clamp((f - 362 - i * 5) / 12);
    prims.push(polyPrim(circ(LENS.x, LENS.z, r, 699, 72), 'rgba(0,0,0,0)', cam, {stroke: lit > 0.02 ? rgba(EM, 0.55 * lit) : 'rgba(243,244,246,0.13)', sw: lit > 0.02 ? 3.5 : 2, z: 9070 - i}));
  });
  for (let i = 0; i < 4; i++) prims.push(polyPrim(circ(LENS.x, LENS.z, 90 + i * 60, 698, 40), rgba(EM, 0.06 * beam * flick), cam, {z: 9060 - i}));
  // specular arc on the lens
  const arc = Array.from({length: 18}, (_, i) => v3(Math.cos(-2.3 + i * 0.045) * 1020, 698, LENS.z + Math.sin(-2.3 + i * 0.045) * 1020));
  for (let i = 1; i < arc.length; i++) prims.push(linePrim(arc[i - 1], arc[i], 'rgba(250,250,250,0.22)', 5, cam, 0, 1, 9050));

  // shadow of the unlit room crawling across the lens
  const L = 1300 * easeInOut(ramp(f, 170, 300));
  const sh = (a: number, al: number, zz: number) => prims.push(polyPrim([v3(190, 699, 480 - a), v3(190, 699, 1040 + a), v3(190 - L, 699, 1040 + 0.25 * L + a), v3(190 - L, 699, 480 - 0.25 * L - a)], `rgba(0,0,0,${al})`, cam, {z: zz}));
  if (L > 2) { sh(60, 0.18, 8990); sh(30, 0.22, 8989); sh(0, 0.35, 8988); }

  // emerald beam through the lens
  if (beam > 0.02) {
    [[560, 0.05], [340, 0.09], [170, 0.18], [56, 0.5]].forEach(([w, a], i) => {
      const hw = (w as number) / 2;
      prims.push(polyPrim([v3(-hw, 1500, 700), v3(hw, 1500, 700), v3(hw * 0.6, -1300, 700), v3(-hw * 0.6, -1300, 700)], rgba(EM, (a as number) * beam * flick), cam, {z: 8000 - i}));
    });
  }

  // unlit concrete room: pure mass (almost no light) + doorway void
  prims.push(...boxPrims({c: ROOM.c, s: ROOM.s, col: [34, 40, 56], ambient: 0.35, edge: 'rgba(243,244,246,0.10)', seams: true, bias: 200}, cam));
  prims.push(polyPrim([v3(360, 700, 478), v3(580, 700, 478), v3(580, 320, 478), v3(360, 320, 478)], 'rgba(0,0,0,0.92)', cam, {stroke: 'rgba(243,244,246,0.16)', sw: 2, z: 7000}));

  // tower floors: pristine glass, crimson void at the missing slab, collapsing into sand
  for (let k = 0; k < FLOORS; k++) {
    const yc = 700 - 55 - k * 110;
    if (k === MISSING) {
      const o = (0.45 + 0.4 * Math.sin(f / 6)) * (1 - ramp(f, 255, 285));
      const hx = 150, hz = 150, y0 = yc - 52, y1 = yc + 52;
      const q = (y: number) => [v3(TOWER.x - hx, y, TOWER.z - hz), v3(TOWER.x + hx, y, TOWER.z - hz), v3(TOWER.x + hx, y, TOWER.z + hz), v3(TOWER.x - hx, y, TOWER.z + hz)];
      prims.push(polyPrim(q(y0), 'rgba(0,0,0,0)', cam, {stroke: rgba(CR, o), sw: 3, z: 500}));
      prims.push(polyPrim(q(y1), rgba(CR, 0.07 * o), cam, {stroke: rgba(CR, o), sw: 3, z: 501}));
      for (const [sx, sz2] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) prims.push(linePrim(v3(TOWER.x + hx * sx, y0, TOWER.z + hz * sz2), v3(TOWER.x + hx * sx, y1, TOWER.z + hz * sz2), rgba(CR, o), 3, cam, 0, 1, 502));
      continue;
    }
    const t = ramp(f, collapseT(k), collapseT(k) + 16);
    if (t >= 1) continue;
    const sy = 1 - t * t;
    prims.push(...boxPrims({c: v3(TOWER.x, yc + (1 - sy) * 52, TOWER.z), s: v3(300, 104 * sy, 300), col: [214, 238, 236], alpha: 0.2 * (1 - t), glass: true, edge: `rgba(243,244,246,${0.6 * (1 - t)})`, edgeW: 1.6, bias: 0}, cam));
    for (const mx of [-100, 0, 100]) prims.push(linePrim(v3(TOWER.x + mx, yc - 52 * sy + (1 - sy) * 52, TOWER.z - 150), v3(TOWER.x + mx, yc + 52, TOWER.z - 150), `rgba(243,244,246,${0.28 * (1 - t)})`, 2, cam, 0, 1, 499));
  }

  // sand pile (grows while the tower falls, drains while the beam lifts it)
  let landed = 0, departed = 0;
  for (const g of GRAINS) {
    if (f >= g.t0 + g.fall) landed++;
    if (f >= g.ts) departed++;
  }
  const hs = clamp((landed - departed) / GRAINS.length * 1.15);
  if (hs > 0.01) {
    const pts: V3[] = [v3(PILE_X - PILE_W, 700, 640)];
    for (let i = 0; i <= 24; i++) { const x = PILE_X - PILE_W + (i / 24) * 2 * PILE_W; pts.push(v3(x, 700 - pileH(x) * hs * 0.9, 640)); }
    pts.push(v3(PILE_X + PILE_W, 700, 640));
    prims.push(polyPrim(pts, 'rgba(228,229,233,0.55)', cam, {stroke: 'rgba(243,244,246,0.5)', sw: 2, z: 800}));
  }

  // grains: fall (Act II) then streamed by the beam into the model (Act III)
  const solid = ramp(f, 440, 472);
  for (let i = 0; i < GRAINS.length; i++) {
    const g = GRAINS[i];
    if (f < g.t0) continue;
    let p: V3;
    let tint = 0;
    if (f < g.ts) {
      const u = f - g.t0;
      if (u < g.fall) {
        const tt = u / g.fall;
        p = v3(lerp(g.x0, g.lx, tt), g.y0 + 0.4 * u * u, lerp(g.z0, g.lz, tt));
      } else p = v3(g.lx, g.ly, g.lz);
    } else {
      const u = easeInOut(clamp((f - g.ts) / g.dur));
      p = bez(v3(g.lx, g.ly, g.lz), g.ctl, g.tgt, u);
      tint = Math.sin(Math.PI * clamp((f - g.ts) / g.dur));
    }
    const fade = 1 - ramp(f, 462, 484);
    const col: [number, number, number] = [lerp(CONC[0], EM[0], tint), lerp(CONC[1], EM[1], tint), lerp(CONC[2], EM[2], tint)];
    if (fade > 0.01) prims.push(dotPrim(p, 3.4 + 1.6 * tint, rgba(col, 0.95 * fade), cam, -3));
  }

  if (withModel) prims.push(...modelPrims(cam, solid, f));
  return {prims, cam};
};
