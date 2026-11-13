// Lesson 73 — Office Scripts vs VBA Architecture

// TypeScript Office Script (main + getUsedRange + getValues/setValues)
export const TS_SCRIPT = [
  {n: 1, code: 'function main(workbook: ExcelScript.Workbook) {', c: 'kw'},
  {n: 2, code: '  let sheet = workbook.getActiveWorksheet();', c: 'obj'},
  {n: 3, code: '  let range = sheet.getUsedRange();', c: 'green'},
  {n: 4, code: '  let values: string[][] = range.getValues();', c: 'purple'},
  {n: 5, code: '  for (let i = 0; i < values.length; i++) {', c: 'kw'},
  {n: 6, code: '    let profit = Number(values[i][3]) - Number(values[i][2]);', c: 'amber'},
  {n: 7, code: '    values[i][5] = profit.toString();', c: 'amber'},
  {n: 8, code: '  }', c: 'kw'},
  {n: 9, code: '  range.setValues(values);', c: 'purple'},
  {n: 10, code: '}', c: 'kw'},
];

export const TS_COLORS: Record<string, string> = {
  kw: '#38BDF8',
  obj: '#10B981',
  green: '#10B981',
  purple: '#A855F7',
  amber: '#F59E0B',
};

// Comparison matrix: VBA vs Office Scripts
export const COMPARISON = [
  {
    aspect: 'بيئة التشغيل',
    aspectEn: 'Platform',
    vba: 'Desktop Only',
    office: 'Web + Desktop + Mac',
    vbaBad: true,
    officeGood: true,
  },
  {
    aspect: 'صيغة الملف',
    aspectEn: 'File Format',
    vba: '.xlsm (محظور من IT)',
    office: '.xlsx (آمن)',
    vbaBad: true,
    officeGood: true,
  },
  {
    aspect: 'مكان تخزين الكود',
    aspectEn: 'Code Storage',
    vba: 'داخل الملف',
    office: 'OneDrive / SharePoint',
    vbaBad: true,
    officeGood: true,
  },
  {
    aspect: 'التشغيل الخلفي',
    aspectEn: 'Background Run',
    vba: 'لا يدعم',
    office: 'Power Automate',
    vbaBad: true,
    officeGood: true,
  },
  {
    aspect: 'المشاركة الجماعية',
    aspectEn: 'Team Sharing',
    vba: 'صعب (نسخ يدوي)',
    office: 'بنقرة زر',
    vbaBad: true,
    officeGood: true,
  },
];

// Decision matrix - when to use each
export const VBA_USES = [
  {icon: 'disk', l: 'الوصول للملفات المحلية على الويندوز'},
  {icon: 'outlook', l: 'التحكم في Outlook و Word عبر COM'},
  {icon: 'form', l: 'بناء واجهات إدخال UserForms'},
];

export const OFFICE_USES = [
  {icon: 'web', l: 'التعاون السحابي عبر Excel Web'},
  {icon: 'share', l: 'مشاركة السكربت مع الفريق'},
  {icon: 'flow', l: 'الجدولة التلقائية عبر Power Automate'},
];

export const EXEC_STATS = [
  {l: 'الصفوف المعالجة', v: '50,000', s: 'rows', color: '#10B981'},
  {l: 'زمن التنفيذ', v: '1.8', s: 'ms', color: '#38BDF8'},
  {l: 'صيغة الملف', v: '.xlsx', s: 'safe', color: '#A855F7'},
  {l: 'التدخل البشري', v: '0', s: 'manual', color: '#F59E0B'},
];

export const POWER_AUTOMATE_TRIGGERS = [
  {icon: 'mail', l: 'وصول إيميل جديد'},
  {icon: 'file', l: 'تحديث ملف SharePoint'},
  {icon: 'time', l: 'جدولة يومية'},
  {icon: 'team', l: 'رسالة Teams'},
];
