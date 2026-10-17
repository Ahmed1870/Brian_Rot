import {spring} from 'remotion';
import {clamp} from './anim';

/**
 * ONE-TAKE INFINITE ZOOM.
 * Every scene is a 1080x1920 layer. Scene i+1 lives *inside a portal* (hollow) of scene i, scaled by q_i.
 * The camera zooms by S = e^L and its position is a pure function of S, so the portal always grows smoothly to full screen.
 */
export const CTR = {x: 540, y: 960};
export const PORTALS = [
  {x: 540, y: 900, q: 0.125}, // hollow centre of the huge "+"       -> SplitScreen
  {x: 795, y: 1080, q: 1 / 3}, // preview window in the right card    -> DashboardScene
  {x: 540, y: 800, q: 1 / 6}, // hollow centre of the margin gauge   -> SealScene
] as const;

/** [start, end] of each push-through. Springs: mass .5 / stiffness 120 / damping 14. */
export const WINDOWS: [number, number][] = [[212, 252], [506, 546], [740, 780]];
export const DWELLS: [number, number][] = [[0, 212], [252, 506], [546, 740], [780, 1016]];
export const REWIND: [number, number] = [1016, 1050];

export const Q: number[] = [1];
export const W: {x: number; y: number}[] = [{...CTR}];
for (let i = 0; i < 3; i++) {
  Q.push(Q[i] * PORTALS[i].q);
  W.push({x: W[i].x + Q[i] * (PORTALS[i].x - CTR.x), y: W[i].y + Q[i] * (PORTALS[i].y - CTR.y)});
}
const LNS = Q.map((q) => -Math.log(q));
const CFG = {mass: 0.5, stiffness: 120, damping: 14};

const prog = (f: number, a: number, b: number) => {
  const dur = b - a;
  const p = spring({frame: f - a, fps: 30, config: CFG, durationInFrames: dur});
  const end = spring({frame: dur, fps: 30, config: CFG, durationInFrames: dur});
  return p / end;
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** ln(zoom) for frame f. 0 at frame 0 AND at frame 1050 => seamless loop. */
export const logZoom = (f: number) => {
  for (let i = 0; i < 3; i++) {
    const [a, b] = WINDOWS[i];
    if (f >= a && f < b) return LNS[i] + (LNS[i + 1] - LNS[i]) * prog(f, a, b);
  }
  if (f >= REWIND[0]) {
    const r = clamp((f - REWIND[0]) / (REWIND[1] - REWIND[0]));
    return LNS[3] * (1 - easeInOut(r));
  }
  for (let i = 0; i < 4; i++) {
    const [a, b] = DWELLS[i];
    if (f >= a && f <= b) return LNS[i] + 0.06 * Math.sin((Math.PI * (f - a)) / (b - a)); // continuous push
  }
  return 0;
};

/** Content clock: rewinds to 0 during the last 34 frames so frame 1050 == frame 0 (cards re-close, text re-bounces). */
export const timeEff = (f: number) => {
  if (f < REWIND[0]) return f;
  const r = clamp((f - REWIND[0]) / (REWIND[1] - REWIND[0]));
  return REWIND[0] * (1 - easeInOut(r));
};

export const camAt = (S: number) => {
  let i = 0;
  while (i < 2 && S >= 1 / Q[i + 1]) i++;
  const Si = 1 / Q[i];
  const q = PORTALS[i].q;
  let w = (Si / S - q) / (1 - q);
  if (i === 2 && w < 0) w = 0;
  return {x: W[i + 1].x + (W[i].x - W[i + 1].x) * w, y: W[i + 1].y + (W[i].y - W[i + 1].y) * w};
};

export const layerTransform = (i: number, S: number, cam: {x: number; y: number}) => {
  const s = S * Q[i];
  const tx = CTR.x + S * (W[i].x - cam.x) - s * CTR.x;
  const ty = CTR.y + S * (W[i].y - cam.y) - s * CTR.y;
  return {s, css: `translate(${tx}px, ${ty}px) scale(${s})`};
};

/** A layer is skipped once its child portal already fills the screen, or when it is sub-pixel small. */
export const layerVisible = (i: number, S: number) => {
  const s = S * Q[i];
  if (s < 0.02) return false;
  if (i < 3 && S * Q[i + 1] >= 1.0) return false;
  return true;
};
