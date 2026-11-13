// Lesson 71 — Macro Recorder Automation
// Realistic VBA snippets + KPI numbers for manzooma_sales_2026.xlsm

export const VBA_ABS = `Sub FormatHeader()
    Range("A1:E1").Select
    Selection.Font.Bold = True
    Selection.Interior.Color = RGB(16, 124, 65)
    Selection.Font.Color = RGB(255, 255, 255)
End Sub`;

export const VBA_REL = `Sub FormatNextRow()
    ActiveCell.Offset(1, 0).Select
    Selection.Font.Bold = True
    Selection.Interior.Color = RGB(38, 189, 248)
End Sub`;

export const MACRO_STEPS = [
  {n: '01', label: 'تحديد نطاق الترويسة', vba: 'Range("A1:F1").Select', icon: 'select'},
  {n: '02', label: 'تطبيق الخط العريض', vba: 'Selection.Font.Bold = True', icon: 'bold'},
  {n: '03', label: 'تلوين خلفية الترويسة', vba: 'Selection.Interior.Color = RGB(...)', icon: 'fill'},
  {n: '04', label: 'ضبط عرض الأعمدة', vba: 'Columns.AutoFit', icon: 'autofit'},
  {n: '05', label: 'تجميد الصف العلوي', vba: 'ActiveWindow.FreezePanes = True', icon: 'freeze'},
  {n: '06', label: 'إضافة معادلة الإجمالي', vba: 'Range("F2").Formula = "=SUM(B2:E2)"', icon: 'sum'},
];

export const RECORD_DIALOG = {
  name: 'FormatWeeklyReport',
  shortcut: 'Ctrl+Shift+M',
  store: 'Personal Macro Workbook',
  desc: 'تنسيق تقرير المبيعات الأسبوعي تلقائياً',
};

export const STORAGE_OPTIONS = [
  {id: 'this', name: 'This Workbook', sub: 'الملف الحالي', ext: '.xlsm', desc: 'يحفظ الكود داخل الملف — لازم حفظ بصيغة Macro-Enabled', color: '#EF4444', warn: 'الحفظ بصيغة .xlsx يمسح كل الأكواد فوراً'},
  {id: 'personal', name: 'Personal Macro Workbook', sub: 'ملف الماكرو الشخصي', ext: '.XLSB', desc: 'يحفظ في ملف مخفي PERSONAL.XLSB — متاح عبر كل ملفات Excel', color: '#A855F7', warn: 'يحمل تلقائياً مع فتح Excel'},
];

export const EXEC_STATS = [
  {l: 'الصفوف المؤتمتة', v: '50,000', s: 'rows', color: '#10B981'},
  {l: 'زمن التنفيذ', v: '1.8', s: 'ms', color: '#38BDF8'},
  {l: 'الخطوات المسجلة', v: '6', s: 'steps', color: '#A855F7'},
  {l: 'الأخطاء البشرية', v: '0', s: 'errors', color: '#F59E0B'},
];

export const FILE_TYPES = [
  {ext: '.xlsx', name: 'Excel Workbook', macro: false, color: '#EF4444', desc: 'صيغة افتراضية — تحذف كل الماكروهات نهائياً'},
  {ext: '.xlsm', name: 'Macro-Enabled', macro: true, color: '#10B981', desc: 'الصيغة الصحيحة لحفظ الماكرو مع الملف'},
  {ext: '.xlsb', name: 'Personal Workbook', macro: true, color: '#A855F7', desc: 'ملف مخفي عالمي لكل الماكروهات'},
];

export const SHORTCUT_KEYS = [
  {k: 'Ctrl', color: '#F59E0B'},
  {k: 'Shift', color: '#F59E0B'},
  {k: 'M', color: '#10B981'},
];
