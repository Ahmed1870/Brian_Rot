export const W = 1080;
export const H = 1920;
export const CX = 540;
export const CY = 960;
export const FPS = 30;
export const TOTAL = 1050; // 35 ثانية

export const C = {
  ink: '#050505',
  white: '#FFFFFF',
  yellow: '#FFE600',
  cyan: '#00F0FF',
  mute: 'rgba(255,255,255,0.55)',
  hair: 'rgba(255,255,255,0.08)',
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
