export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const TOTAL = 6300;

/** ألوان الطباشير: أبيض، أصفر هادي، وردي طباشيري. */
export const CH = {white: '#F1EEE4', yellow: '#F2D45C', pink: '#F2A7BC', dim: 'rgba(241,238,228,0.55)'} as const;

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const eio = (x: number) => {
  const c = clamp(x);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
};
export const eo = (x: number) => 1 - Math.pow(1 - clamp(x), 2);
/** تقدّم (0..1) من الزمن t بين a و a+dur بحركة ناعمة. */
export const prog = (t: number, a: number, dur: number) => eio((t - a) / dur);
