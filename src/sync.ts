import {FPS} from './theme';
// Measured from the mp3 (RMS silence + sentence anchors snapped to energy dips). Seconds, absolute.
export const SCENE_START = [0, 40, 85, 130, 170, 210];
export const SCENE_END = [40, 85, 130, 170, 210, 240];
export const ANCH: number[][] = [
  [1.17, 8.49, 15.08, 22.01, 25.65, 30.86],
  [41.26, 47.88, 59.91, 64.03, 75.1],
  [86.19, 94.86, 105.83, 114.04],
  [131.2, 137.48, 148.28, 159.43, 163.58],
  [171.22, 180.91, 192.15],
  [210.26, 216.68, 224.62],
];
export const sf = (s: number) => Math.round(s * FPS);
/** anchor k of scene i, in seconds relative to the scene start */
export const an = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
