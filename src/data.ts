// Lesson 75 — Performance Tuning & Calculation Management

export const CALC_MODES = [
  {n: 'Automatic', desc: 'إعادة حساب مع كل تعديل', active: false, color: '#94A3B8'},
  {n: 'Automatic Except for Data Tables', desc: 'ما عدا جداول البيانات', active: false, color: '#10B981'},
  {n: 'Manual', desc: 'حساب يدوي عند الطلب', active: true, color: '#10B981'},
];

export const RECALC_KEYS = [
  {k: 'F9', desc: 'كل المصنفات المفتوحة', color: '#10B981'},
  {k: 'Shift + F9', desc: 'الشيت النشط فقط', color: '#10B981'},
  {k: 'Ctrl + Alt + F9', desc: 'إعادة حساب شاملة إجبارية', color: '#10B981'},
];

export const BINARY_STEPS = [
  {step: 1, range: '1 → 50,000', halved: '25,000'},
  {step: 2, range: '1 → 25,000', halved: '12,500'},
  {step: 3, range: '1 → 12,500', halved: '6,250'},
  {step: 4, range: '1 → 6,250', halved: '3,125'},
  {step: 5, range: '1 → 3,125', halved: '1,562'},
  {step: 16, range: 'found ✓', halved: '1'},
];

export const LET_BEFORE = '=IF(XLOOKUP(A,B,C)>0, XLOOKUP(A,B,C)*0.15, 0)';
export const LET_AFTER = '=LET(val, XLOOKUP(A,B,C), IF(val>0, val*0.15, 0))';

export const EXEC_STATS = [
  {l: 'الصفوف', v: '50,000', s: 'rows', color: '#10B981'},
  {l: 'زمن الحساب', v: '1.8', s: 'ms', color: '#38BDF8'},
  {l: 'حجم الملف', v: '12MB', s: '↓60%', color: '#A855F7'},
  {l: 'خطوات البحث', v: '16', s: 'vs 50K', color: '#F59E0B'},
];

export const FILE_SIZES = [
  {stage: 'Original (.xlsx)', size: 30, color: '#EF4444', label: '30 MB'},
  {stage: 'After Check Performance', size: 22, color: '#F59E0B', label: '22 MB'},
  {stage: 'After Binary + LET', size: 18, color: '#A855F7', label: '18 MB'},
  {stage: 'Final (.xlsb)', size: 12, color: '#10B981', label: '12 MB'},
];
