import {FPS} from './theme';
// Measured from the mp3 (RMS silence + sentence anchors snapped to energy dips). Seconds, absolute.
export const SCENE_START = [0, 40, 85, 130, 170, 210];
export const SCENE_END = [40, 85, 130, 170, 210, 240];
export const ANCH: number[][] = [
  [1.15, 11.13, 20.4, 23.88, 30.69],
  [41.21, 48.09, 59.65, 70.84],
  [86.24, 93.05, 100.65, 115.5],
  [131.21, 139.07, 151.15],
  [171.18, 181.65, 192.66],
  [210.22, 217.92, 224.57],
];
export const sf = (s: number) => Math.round(s * FPS);
/** anchor k of scene i, in seconds relative to the scene start */
export const an = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
