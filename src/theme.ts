export const FPS = 30;
export const DURATION = 600;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  bg: '#121316',       // Studio Canvas: Dark Charcoal Slate
  cream: '#F4F1EA',    // Tactile Paper: Warm Alabaster Cream
  emerald: '#0D9488',  // Free Vault accent: Concrete Emerald
  carbon: '#18181B',   // Contrast & text: Carbon Black
  yellow: '#EAB308',   // CTA: Warm Sun Yellow
  // helpers for shared ui/logo
  white: '#F4F1EA', text: '#F4F1EA', gold: '#EAB308', cyan: '#0D9488', blue: '#0D9488', blue2: '#0D9488',
  red: '#B91C1C', dim: '#A8A29E', paperDark: '#D8D2C4', grid: '#D9D4C7',
} as const;

export const BRAND = {
  name: 'Monzoma Digital',
  handle: '@monzoma.digital',
  waLocal: '01019672878',
  waIntl: '+201019672878',
} as const;

/** Scene windows (global frames) aligned to the detected voice-over phrases. */
export const SCENES = {
  s1: {from: 0, dur: 144},     // hook            0.15-4.25s
  s2: {from: 132, dur: 138},   // value burst     4.6-8.2s
  s3: {from: 258, dur: 150},   // rapid carousel  8.75-12.55s
  s4: {from: 396, dur: 204},   // brand + CTA     13.15-19.1s
} as const;

export const CAPTIONS: {text: string; from: number; to: number}[] = [
  {text: 'لو بتسجل مصاريفك في ورقة أو بتسعر شغلك بالبركة..', from: 5, to: 95},
  {text: 'وقف كركبة!', from: 103, to: 128},
  {text: 'بنقدملك قسم كامل لشيتات وقوالب Excel مجانية 100%!', from: 138, to: 246},
  {text: 'ميزانية البيت، حاسبة التسعير، الفواتير، والمذاكرة.. بضغطة زرار واحدة!', from: 262, to: 376},
  {text: 'تواصل معانا واتساب وتابعنا على السوشيال ميديا..', from: 394, to: 468},
  {text: 'واكتب كلمة "مهتم" في التعليقات دلوقتي عشان توصلك الروابط مجاناً فوراً!', from: 474, to: 596},
];
