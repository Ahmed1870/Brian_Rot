import {COL, IBox, Iso} from './iso';
import {clamp, easeInOut, easeOut, lerp, ramp} from './anim';

// ---------------------------------------------------------------- Scene 1: the millionaire fallacy
export const ISO1: Iso = {cx: 207, cy: 1046, s: 1.1};
export const MEAN_H = 520;
const bounce = (t: number) => (t < 0 ? 0 : Math.exp(-t / 7) * Math.cos(t * 0.7));

export const s1Boxes = (f: number): IBox[] => {
  const out: IBox[] = [];
  const hit = 120;
  for (let i = 0; i < 5; i++) {
    const t = ramp(f, 60 + i * 8, 80 + i * 8);
    const pop = easeOut(t) + 0.08 * Math.sin(t * Math.PI);
    const jig = 1 + 0.12 * bounce(f - hit - i);
    out.push({x: i * 150, y: 0, z: 0, w: 100, d: 100, h: Math.max(0.01, 110 * pop * jig), col: COL.white, a: 0.28, stroke: 'rgba(248,250,252,0.8)', sw: 2, emissive: 0.12, key: 'e' + i});
  }
  // the billionaire: falls from the sky at frame 100, lands on 120
  if (f >= 100) {
    const u = clamp((f - 100) / 20);
    const y = u < 1 ? 1700 * (1 - u * u) : 36 * Math.abs(bounce(f - hit)) * (f < hit + 22 ? 1 : 0);
    out.push({x: 250, y, z: -300, w: 240, d: 240, h: 700, col: COL.coral, a: 0.9, stroke: 'rgba(254,202,202,0.7)', sw: 2, emissive: 0.05, key: 'b'});
  }
  // ghost bars: what the Mean CLAIMS (all employees stretched to the mean)
  if (f >= 150 && f < 206) {
    const g = easeOut(ramp(f, 150, 196)) * MEAN_H * (1 - ramp(f, 196, 206));
    for (let i = 0; i < 5; i++) out.push({x: i * 150, y: 0, z: 0, w: 100, d: 100, h: Math.max(0.01, g), col: COL.coral, a: 0.08, stroke: 'rgba(239,68,68,0.95)', dash: true, sw: 2.5, key: 'g' + i});
  }
  return out;
};

// ---------------------------------------------------------------- Scene 2: damage
export const ISO2T: Iso = {cx: 185, cy: 270, s: 0.7};
export const S2_VALUES = [60, 75, 55, 90, 70, 65, 80, 60];
export const S2_OUT = 420;
export const s2TopBoxes = (f: number): IBox[] => {
  const out: IBox[] = [];
  for (let i = 0; i < S2_VALUES.length; i++) {
    const p = easeOut(ramp(f, 352 + i * 4, 372 + i * 4));
    out.push({x: i * 130, y: 0, z: 0, w: 90, d: 90, h: Math.max(0.01, S2_VALUES[i] * 0.9 * p), col: COL.white, a: 0.3, stroke: 'rgba(248,250,252,0.8)', sw: 2, emissive: 0.1, key: 't' + i});
  }
  const u = clamp((f - 372) / 22);
  if (f >= 372) {
    const y = u < 1 ? 600 * (1 - u * u) : 0;
    out.push({x: 8 * 130, y, z: 0, w: 90, d: 90, h: S2_OUT * 0.9, col: COL.coral, a: 0.92, stroke: 'rgba(254,202,202,0.8)', sw: 2, emissive: 0.05, key: 'o'});
  }
  return out;
};
export const s2Mean = (f: number) => {
  const base = S2_VALUES.reduce((a, b) => a + b, 0);
  const before = base / 8;
  const after = (base + S2_OUT) / 9;
  return lerp(before, after, easeInOut(ramp(f, 394, 418))) * 0.9;
};

export const ISO2B: Iso = {cx: 459, cy: 1010, s: 0.75};
export const s2Crates = (f: number): IBox[] => {
  const out: IBox[] = [];
  let n = 0;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++, n++) {
    const t = easeOut(ramp(f, 672 + n * 3, 690 + n * 3));
    out.push({x: i * 125, y: 0, z: j * 125, w: 100, d: 100, h: Math.max(0.01, 70 * t), col: COL.coral, a: 0.75, stroke: 'rgba(254,202,202,0.6)', sw: 1.5, emissive: 0.02, key: 'c' + n});
    const t2 = easeOut(ramp(f, 730 + n * 2, 748 + n * 2));
    if (t2 > 0.02 && (n % 2 === 0)) out.push({x: i * 125 + 8, y: 70, z: j * 125 + 8, w: 84, d: 84, h: 64 * t2, col: COL.coral, a: 0.8, stroke: 'rgba(254,202,202,0.6)', sw: 1.5, key: 'c2' + n});
  }
  return out;
};

// ---------------------------------------------------------------- Scene 3: the median
export const ISO3: Iso = {cx: 194, cy: 800, s: 0.8};
const INIT = [85, 520, 40, 120, 55, 100, 70];
export const SORTED = [...INIT].sort((a, b) => a - b);
export const MEDIAN = SORTED[3];
export const MEAN3 = INIT.reduce((a, b) => a + b, 0) / INIT.length;
export const s3Slot = (i: number) => i * 150;
export const s3Boxes = (f: number): IBox[] => {
  const out: IBox[] = [];
  const beam = ramp(f, 936, 960);
  for (let i = 0; i < INIT.length; i++) {
    const v = INIT[i];
    const sortedIdx = SORTED.indexOf(v);
    const p = easeInOut(ramp(f, 826 + i * 6, 886 + i * 6));
    const x = lerp(s3Slot(i), s3Slot(sortedIdx), p);
    const grow = easeOut(ramp(f, 800 + i * 4, 822 + i * 4));
    const isMed = sortedIdx === 3;
    const isOut = v === 520;
    let col = COL.white, a = 0.3, stroke = 'rgba(248,250,252,0.8)', em = 0.1;
    if (isMed) { col = [lerp(COL.white[0], COL.emerald[0], beam), lerp(COL.white[1], COL.emerald[1], beam), lerp(COL.white[2], COL.emerald[2], beam)]; a = lerp(0.3, 0.95, beam); stroke = beam > 0.1 ? 'rgba(167,243,208,0.95)' : stroke; em = 0.1 + 0.1 * beam; }
    if (isOut && beam > 0) { col = COL.coral; a = lerp(0.3, 0.55, beam); stroke = 'rgba(239,68,68,0.9)'; }
    out.push({x, y: 0, z: 0, w: 100, d: 100, h: Math.max(0.01, v * 0.8 * grow), col, a, stroke, sw: 2, emissive: em, key: 'm' + i});
  }
  return out;
};

// ---------------------------------------------------------------- Scene 4: hubs
export const ISO4A: Iso = {cx: 457, cy: 480, s: 0.8};
export const ISO4B: Iso = {cx: 429, cy: 1100, s: 0.8};
export const s4HubA = (f: number): IBox[] => {
  const out: IBox[] = [];
  for (let i = 0; i < 4; i++) {
    const t = easeOut(ramp(f, 1110 + i * 8, 1134 + i * 8));
    out.push({x: i * 110, y: 0, z: 0, w: 110, d: 200, h: Math.max(0.01, (50 + i * 48) * t), col: COL.yellow, a: 0.5, stroke: 'rgba(255,240,120,0.9)', sw: 2, emissive: 0.1, key: 'a' + i});
  }
  return out;
};
export const s4HubB = (f: number): IBox[] => {
  const out: IBox[] = [];
  const hs = [90, 150, 210, 150, 90];
  for (let i = 0; i < 5; i++) {
    const t = easeOut(ramp(f, 1380 + i * 6, 1404 + i * 6));
    out.push({x: i * 100, y: 0, z: 0, w: 90, d: 180, h: Math.max(0.01, hs[i] * t), col: COL.emerald, a: 0.55, stroke: 'rgba(167,243,208,0.9)', sw: 2, emissive: 0.1, key: 'b' + i});
  }
  return out;
};
