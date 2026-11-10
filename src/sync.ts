import {FPS} from './theme';
// Measured from the mp3 (RMS silence + sentence anchors snapped to energy dips). Seconds, absolute.
export const SCENE_START = [0, 40, 85, 130, 170, 210];
export const SCENE_END = [40, 85, 130, 170, 210, 240];
export const ANCH: number[][] = [
  [1.22, 11.54, 22.0, 28.75],
  [41.19, 50.3, 60.95, 72.67],
  [86.21, 94.75, 107.92, 115.11],
  [131.14, 137.68, 143.92, 157.73],
  [171.2, 182.16, 192.78],
  [210.2, 216.99, 224.86],
];
export const sf = (s: number) => Math.round(s * FPS);
/** anchor k of scene i, in seconds relative to the scene start */
export const an = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
