import {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../theme';

/** بداية المشهد بالثواني (من الفيديو كله) */
export const SceneStart = createContext(0);

/** الزمن المطلق بالثواني (ثابت ومحدَّد بالفريم - لا عشوائية) */
export const useT = (): number => {
  const f = useCurrentFrame();
  const s = useContext(SceneStart);
  return s + f / FPS;
};

export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
export const ease = (t: number): number => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOut = (t: number): number => 1 - Math.pow(1 - clamp(t), 3);
/** 0→1 بعد الزمن t0 خلال d ثانية */
export const ramp = (T: number, t0: number, d = 0.4): number => easeOut((T - t0) / d);
/** ظاهر بين a و b مع تلاشي */
export const win = (T: number, a: number, b: number, fade = 0.3): number =>
  ramp(T, a, fade) * (1 - ramp(T, b, fade));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export type WP = {t: number; x: number; y: number; click?: boolean; key?: boolean};

export type CursorState = {x: number; y: number; press: number};

/** مسار المؤشر: الوصول إلى كل نقطة عند الزمن t، والتحرك يبدأ قبلها بمدة تناسب المسافة */
export const cursorAt = (wps: WP[], T: number): CursorState => {
  const first = wps[0];
  let x = first.x;
  let y = first.y;
  for (let i = 1; i < wps.length; i++) {
    const a = wps[i - 1];
    const b = wps[i];
    if (T >= b.t) {
      x = b.x;
      y = b.y;
      continue;
    }
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const dur = clamp(dist / 1600, 0.3, 0.85);
    const start = Math.max(a.t, b.t - dur);
    const p = ease((T - start) / (b.t - start));
    x = lerp(a.x, b.x, p);
    y = lerp(a.y, b.y, p);
    break;
  }
  let press = 0;
  for (const w of wps) {
    if (w.click && T >= w.t && T < w.t + 0.22) press = 1 - (T - w.t) / 0.22;
  }
  return {x, y, press};
};

export const clickTimes = (wps: WP[]): number[] => wps.filter((w) => w.click).map((w) => w.t);
export const keyTimes = (wps: WP[]): number[] => wps.filter((w) => w.key).map((w) => w.t);
