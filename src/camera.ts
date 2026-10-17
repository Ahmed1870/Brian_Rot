import {clamp, hash, ss} from './theme';

/**
 * كاميرا لقطة واحدة متصلة (One-Take): زوم لا نهائي عبر 4 عوالم متداخلة.
 * كل عالم فيه ثقب (Portal) في المنتصف بيطلّ على العالم اللي بعده بمقياس 1/R.
 *  - العالم 1: "بتخسر" (ثقب = تجويف حرف الخاء)  → عالم 2: مكعب/لوحة تحكم (ثقب = نقطة الليزر)
 *  - → عالم 3: كتاب رقمي (ثقب = عمود الكتاب)  → عالم 4: ختم البراند + CTA
 */
export const R = 28; // نسبة التكبير بين كل عالم والتاني
export const HOLE = 40; // نصف قطر الثقب (بيكسل محلي في العالم)
export const T2 = 7.8; // وصول العالم 2 (صمت الفويس بين 7.0 و 7.8)
export const T3 = 16.5; // وصول العالم 3 (صمت 15.7–16.5)
export const T4 = 26.6; // وصول العالم 4 (صمت 25.7–26.6)
export const PUSH = [
  {a: 3.0, b: T2},
  {a: 14.6, b: T3},
  {a: 24.5, b: T4},
];

// انجراف خفيف مستمر (زوم دائم) — ومقادير الدفعات متظبطة عشان كل عالم يوصل بمقياس 1.0 بالظبط ثم ينجرف شوية بس.
const DRIFT = 0.03;
const dd = (t: number) => (DRIFT * t) / 35;
const A1 = 1 - dd(T2);
const A2 = 2 - dd(T3) - A1;
const A3 = 3 - dd(T4) - A1 - A2;
export const depth = (t: number) => dd(t) + A1 * ss(PUSH[0].a, PUSH[0].b, t) + A2 * ss(PUSH[1].a, PUSH[1].b, t) + A3 * ss(PUSH[2].a, PUSH[2].b, t);

/** مقياس العالم k (1..4) عند الزمن t. */
export const scaleOf = (k: number, t: number) => Math.pow(R, depth(t) - (k - 1));

// صدمات الكاميرا (Micro Shakes)
const HITS = [
  {t: 0.2, a: 36, k: 5},
  {t: 6.2, a: 20, k: 7},
  {t: T2, a: 26, k: 6},
  {t: T3, a: 22, k: 6},
  {t: T4 + 0.05, a: 32, k: 6},
  {t: 30.0, a: 16, k: 8},
];
export const shakeAt = (t: number, f: number) => {
  let a = 0;
  for (const h of HITS) if (t >= h.t) a += h.a * Math.exp(-(t - h.t) * h.k);
  for (const p of PUSH) if (t > p.a && t < p.b) a += 5 * Math.sin(Math.PI * clamp((t - p.a) / (p.b - p.a)));
  if (t > 34.8) a *= 1 - ss(34.8, 35, t);
  return {x: (hash(f, 1, 3) - 0.5) * 2 * a, y: (hash(f, 2, 5) - 0.5) * 2 * a};
};
