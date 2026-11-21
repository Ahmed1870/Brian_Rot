import {FPS, TOTAL_FRAMES} from './theme';
import {SCENE_START_SEC, ANCHOR_SEC} from './timing';

export const fr = (sec: number): number => Math.round(sec * FPS);

export const A = (key: string): number => {
  const v = ANCHOR_SEC[key];
  if (v === undefined) throw new Error('Unknown anchor: ' + key);
  return fr(v);
};

export const SCENE_KEYS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
export const FADE = 8;

export const SCENES = SCENE_KEYS.map((k, i) => {
  const from = fr(SCENE_START_SEC[k]);
  const to = i < SCENE_KEYS.length - 1 ? fr(SCENE_START_SEC[SCENE_KEYS[i + 1]]) : TOTAL_FRAMES;
  return {key: k, from, to};
});

export type Cues = {click: number[]; pop: number[]; key: number[]};
