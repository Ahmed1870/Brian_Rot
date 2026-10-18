export const W = 1080;
export const H = 1920;
export const CX = 540;
export const CY = 960;
export const FPS = 30;
export const TOTAL = 540; // 18 ثانية

export const C = {
  bg: '#0F172A',
  bgDeep: '#0A0F1E',
  white: '#F8FAFC',
  green: '#22C55E',
  red: '#EF4444',
  emerald: '#10B981',
  mute: 'rgba(248,250,252,0.55)',
  line: 'rgba(248,250,252,0.14)',
} as const;

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ss = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const eo = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const eio = (x: number) => {
  const c = clamp(x);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
export const hash = (a: number, b: number, c = 0) => {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return x - Math.floor(x);
};

/** توقيتات (ثواني) متظبطة على الفويس: 0.44 جملة 1 · 4.99 "استنى" · 6.25 "كبّر الشاشة" · صمت 7.25–9.5 · 9.5 "أخطر معلومة" · 11.0 "الناقصة" */
export const TIME = {click: 1.0, pull: 5.0, alarm: 6.0, collapse: 9.2, ring: 9.6, lock: 11.0, seal: 11.9};
