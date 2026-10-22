export const FPS = 30;
export const DURATION = 2400; // 80s
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  board: '#1A1D20',   // chalkboard (same series as lesson 24)
  chalk: '#EAEAEA',
  yellow: '#F4D03F',
  dim: '#8C9196',
  // aliases for shared helpers (Logo)
  bg: '#1A1D20', white: '#EAEAEA', text: '#EAEAEA', gold: '#F4D03F', cyan: '#EAEAEA', blue: '#EAEAEA', blue2: '#EAEAEA', red: '#F4D03F',
} as const;

export const BRAND = {
  name: 'Monzoma Digital',
  platform: 'solutions.gomaaintelligence.me',
  business: 'analytics.gomaaintelligence.me',
  whatsapp: '+201019672878',
  handle: '@monzoma_digital',
} as const;

/** VO cue sheet in SECONDS (detected from vo_market_basket.mp3 phrase boundaries). */
export const T = {
  // scene 1 - the riddle
  hook: 0.9, phone: 2.0, caseDrop: 5.2, earbuds: 6.4, link: 7.0, notMagic: 8.2, ai: 9.95, mba: 12.1, idea: 18.45,
  // scene 2 - Apriori
  apriori: 25.95, three: 29.95, support: 33.0, supportName: 34.65, supportExp: 36.15,
  confidence: 40.05, confidenceName: 41.55, confidenceExp: 43.1,
  lift: 48.6, liftName: 50.75, liftExp: 52.25, liftRule: 56.05,
  // scene 3 - code
  how: 59.4, sql: 62.1, python: 66.7, powerbi: 71.45,
  // scene 4 - outro
  outro: 75.9, end: 80,
} as const;

export const SCENES = {
  s1: {from: 0, to: 25.3},
  s2: {from: 25.5, to: 58.9},
  s3: {from: 59.0, to: 75.6},
  s4: {from: 75.9, to: 80},
} as const;

/** Arabic captions = the exact VO phrases. */
export const CAPTIONS: {text: string; from: number; to: number}[] = [
  {text: 'ليه لما بتشتري موبايل أونلاين،', from: 0.9, to: 2.9},
  {text: 'بتلاقي الموقع بيقترح عليك فوراً جراب وسماعة؟', from: 3.75, to: 7.2},
  {text: 'ده مش سحر، ده الذكاء الاصطناعي', from: 8.2, to: 11.2},
  {text: 'وتحديداً تحليل سلة المشتريات أو Market Basket Analysis.', from: 12.1, to: 17.1},
  {text: 'الفكرة إننا بنكتشف العلاقات المخفية بين المنتجات عشان نضاعف المبيعات بطريقة الـ Cross-Selling.', from: 18.45, to: 24.6},
  {text: 'السر كله في خوارزمية اسمها أبريوري - Apriori،', from: 25.95, to: 28.9},
  {text: 'واللي بتعتمد على 3 مقاييس:', from: 29.95, to: 31.9},
  {text: 'الأول: الدعم، يعني المنتجين دول ظهروا مع بعض في كام فاتورة؟', from: 33.0, to: 38.8},
  {text: 'التاني: الثقة، يعني لو العميل اشترى موبايل، إيه احتمالية إنه يشتري السماعة؟', from: 40.05, to: 47.4},
  {text: 'التالت والأهم: الرفع - Lift،', from: 48.6, to: 51.4},
  {text: 'وده اللي بيأكد إن الارتباط ده حقيقي مش صدفة،', from: 52.25, to: 55.1},
  {text: 'ولازم قيمته تكون أكبر من واحد.', from: 56.05, to: 57.95},
  {text: 'بننفذ ده برمجياً إزاي؟', from: 59.4, to: 61.0},
  {text: 'في SQL بنستخدم الـ Self Join عشان نربط الفواتير ببعضها،', from: 62.1, to: 65.7},
  {text: 'وفي بايثون مكتبة mlxtend بتخلص الحسبة في ثواني،', from: 66.7, to: 70.4},
  {text: 'وفي باور بي آي بنبني معادلات DAX لاكتشاف الأنماط دي.', from: 71.45, to: 74.9},
];

export const fr = (sec: number) => Math.round(sec * FPS);
