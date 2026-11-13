// Lesson 74 — Volatile Functions & Performance Impact

export const VOLATILE_FNS = [
  {n: 'TODAY()', desc: 'تاريخ اليوم', color: '#EF4444'},
  {n: 'NOW()', desc: 'الوقت الحالي', color: '#EF4444'},
  {n: 'RAND()', desc: 'رقم عشوائي', color: '#EF4444'},
  {n: 'RANDBETWEEN()', desc: 'رقم بين حدّين', color: '#EF4444'},
  {n: 'OFFSET()', desc: 'إزاحة نطاق', color: '#EF4444'},
  {n: 'INDIRECT()', desc: 'مرجع نصي', color: '#EF4444'},
  {n: 'INFO()', desc: 'معلومات النظام', color: '#EF4444'},
  {n: 'CELL()', desc: 'خصائص الخلية', color: '#EF4444'},
];

export const REPLACEMENTS = [
  {
    bad: 'OFFSET(A1, 5, 2)',
    badLabel: 'Volatile',
    good: 'INDEX(A:A, 6)',
    goodLabel: 'Non-Volatile',
    desc: 'استبدال OFFSET بـ INDEX',
    badColor: '#EF4444',
    goodColor: '#A855F7',
  },
  {
    bad: 'INDIRECT("Sheet" & A1)',
    badLabel: 'Volatile',
    good: 'XLOOKUP(A1, Keys, Sheets)',
    goodLabel: 'Non-Volatile',
    desc: 'استبدال INDIRECT بـ XLOOKUP',
    badColor: '#EF4444',
    goodColor: '#A855F7',
  },
  {
    bad: '=TODAY() × 50,000 rows',
    badLabel: '50K recalcs',
    good: '$B$1 = TODAY()',
    goodLabel: '1 recalc',
    desc: 'عزل TODAY في خلية واحدة',
    badColor: '#EF4444',
    goodColor: '#A855F7',
  },
];

export const TRAPS = [
  {n: 'Conditional Formatting', desc: 'التنسيق الشرطي على عمود كامل', icon: 'cf'},
  {n: 'Data Validation', desc: 'التحقق من البيانات على نطاق واسع', icon: 'dv'},
  {n: 'Named Ranges', desc: 'الأسماء المعرفة على A:A', icon: 'nr'},
];

export const EXEC_STATS = [
  {l: 'الصفوف المعاد حسابها', v: '50,000', s: 'rows', color: '#10B981'},
  {l: 'زمن إعادة الحساب', v: '1.8', s: 'ms', color: '#38BDF8'},
  {l: 'الدوال المتغيرة المحذوفة', v: '50K+', s: 'removed', color: '#EF4444'},
  {l: 'تحسين الأداء', v: '500x', s: 'faster', color: '#A855F7'},
];
