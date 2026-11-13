import {FPS} from './theme';
// Measured from the mp3 (RMS silence + sentence anchors snapped to energy dips). Seconds, absolute.
export const SCENE_START = [0, 40, 85, 130, 170, 210];
export const SCENE_END = [40, 85, 130, 170, 210, 240];
export const ANCH: number[][] = [
  [1.2, 13.16, 22.34],
  [41.09, 55.33, 66.74],
  [86.14, 91.23, 98.28, 106.92],
  [131.19, 138.63, 145.34],
  [171.15, 180.93, 192.41],
  [210.18, 215.47, 223.97],
];
export const sf = (s: number) => Math.round(s * FPS);
/** anchor k of scene i, in seconds relative to the scene start */
export const an = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
