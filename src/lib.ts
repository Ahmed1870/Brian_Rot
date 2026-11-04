import { createContext, useContext } from "react";
import { Easing } from "remotion";

export const FPS = 30;
export const TOTAL_FRAMES = 7200;

/** Scene boundaries (seconds) — placed in the middle of the real silences of the voiceover. */
export const B = [0, 44.1, 86.4, 129.75, 175.4, 213.9, 240];

export const C = {
  bg: "#0F172A",
  bg2: "#0B1222",
  card: "#1E293B",
  card2: "#17223A",
  line: "#334155",
  blue: "#38BDF8",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  text: "#F8FAFC",
  dim: "#94A3B8",
  violet: "#A78BFA",
};

export const TimeCtx = createContext(0);
export const useT = (): number => useContext(TimeCtx);

export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
export const prog = (t: number, a: number, b: number): number => clamp((t - a) / (b - a));

const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const outBack = (x: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** ease-out */
export const eo = (t: number, a: number, b: number): number => outExpo(prog(t, a, b));
/** ease in-out */
export const eio = (t: number, a: number, b: number): number => inOut(prog(t, a, b));
/** ease-out with overshoot */
export const eb = (t: number, a: number, b: number): number => outBack(prog(t, a, b));
/** fade in at a, fade out at b */
export const win = (t: number, a: number, b: number, f = 0.4): number =>
  Math.min(prog(t, a, a + f), 1 - prog(t, b - f, b));
/** typewriter */
export const typed = (s: string, t: number, a: number, b: number): string =>
  s.slice(0, Math.floor(s.length * prog(t, a, b) + 0.0001));
/** deterministic pseudo random 0..1 */
export const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const fmt = (n: number): string => Math.round(n).toLocaleString("en-US");
