import {FPS} from './theme';
// Measured from the mp3 (RMS silence + sentence anchors snapped to energy dips). Seconds, absolute.
export const SCENE_START = [0, 40, 85, 130, 170, 210];
export const SCENE_END = [40, 85, 130, 170, 210, 240];
export const ANCH: number[][] = [
  [1.15, 8.15, 16.15, 22.78, 29.02],
  [41.19, 43.75, 51.82, 57.24, 66.87],
  [86.15, 92.33, 98.74, 104.62, 114.54],
  [131.24, 137.42, 143.87, 155.51],
  [171.15, 181.2, 190.23],
  [210.2, 218.74, 225.93],
];
export const sf = (s: number) => Math.round(s * FPS);
/** anchor k of scene i, in seconds relative to the scene start */
export const an = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
