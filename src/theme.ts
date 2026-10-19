export const FPS = 30;
export const DURATION = 1800;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  bg: '#0F172A',      // Deep Slate Navy
  text: '#F8FAFC',    // Polar White
  white: '#F8FAFC',
  coral: '#EF4444',   // outlier / false success
  red: '#EF4444',
  emerald: '#10B981', // median / solution
  yellow: '#FFE600',  // CTA / highlight
  gold: '#FFE600',
  cyan: '#38BDF8',
  blue: '#2563EB',
  blue2: '#3B82F6',
  dim: '#94A3B8',
  slate: '#1E293B',
} as const;

export const BRAND = {
  name: 'Monzoma Digital',
  handle: '@monzoma.digital',
  solutions: 'solutions.gomaaintelligence.me',
  analytics: 'analytics.gomaaintelligence.me',
  phoneIntl: '+20 101 967 2878',
  phoneLocal: '01019672878',
} as const;

/** Scene windows (global frames), aligned to the detected voice-over phrases. */
export const SCENES = {
  s1: {from: 0, dur: 348},     // hook:        0.2-10.8s
  s2: {from: 336, dur: 462},   // damage:     11.3-26.0s
  s3: {from: 786, dur: 324},   // median:     26.4-36.4s
  s4: {from: 1098, dur: 390},  // ecosystem:  36.8-49.0s
  s5: {from: 1476, dur: 324},  // brand/CTA:  49.4-59.6s
} as const;

/** Kinetic captions (global frames) = the exact VO transcript, phrase by phrase. */
export const CAPTIONS: {text: string; from: number; to: number}[] = [
  {text: 'لو دخل مليارير كافيه فيه 5 موظفين.. المتوسط الحسابي هيقول إنهم كلهم ملاك ملايين!', from: 6, to: 160},
  {text: 'بس الحقيقة؟ كلهم مفلسين!', from: 180, to: 236},
  {text: 'ودي الخدعة اللي بتدمر أرباح الشركات كل يوم!', from: 249, to: 326},
  {text: 'المتوسط الحسابي أو الـ Mean بيتأثر بكسر ثانية بأي رقم شاذ..', from: 339, to: 464},
  {text: 'فتفتكر إن مبيعاتك ممتازة، بينما عميل واحد بس هو اللي رفع الرقم،', from: 477, to: 659},
  {text: 'وباقي منتجاتك مركونة في المخازن بتخسر!', from: 672, to: 782},
  {text: 'عشان كده المحلل الاحترافي بيعتمد على الوسيط أو الـ Median..', from: 792, to: 920},
  {text: 'الرقم الحقيقي اللي في النص بالضبط، وبيكشف حجم التجارة الصافي بدون أي تضليل.', from: 936, to: 1094},
  {text: 'عايز تؤسس عقليتك وتتعلم صح؟ أدخل على موقعنا التعليمي..', from: 1104, to: 1364},
  {text: 'ولو عندك بيزنس ومحتاج إنقاذ مباشر.. جاهزين لتشخيص أرباحك.', from: 1374, to: 1472},
  {text: 'تواصل معانا عبر الواتساب..', from: 1482, to: 1550},
  {text: 'وتابعنا.. واكتب كلمة "مهتم" في التعليقات دلوقتي، عشان يوصلك دليل الكورس فوراً على الخاص!', from: 1572, to: 1795},
];
