// Lesson 76 — Comprehensive Enterprise Capstone Project

export const PIPELINE_STAGES = [
  {n: '01', l: 'Power Query ETL', sub: 'سحب وتنظيف البيانات', color: '#10B981'},
  {n: '02', l: 'Star Schema', sub: 'نموذج بيانات علائقي', color: '#10B981'},
  {n: '03', l: 'DAX Measures', sub: 'مقاييس ذكاء زمني', color: '#A855F7'},
  {n: '04', l: 'Dynamic Arrays', sub: 'FILTER + XLOOKUP + LET', color: '#A855F7'},
  {n: '05', l: 'Executive Dashboard', sub: 'KPI Cards + Slicers', color: '#F59E0B'},
  {n: '06', l: 'VBA PDF Export', sub: 'تقرير تنفيذي بضغطة', color: '#F59E0B'},
];

export const STAR_SCHEMA = {
  fact: {name: 'Fact_Sales', x: 460, y: 220, w: 200, h: 80},
  dims: [
    {name: 'Dim_Products', x: 120, y: 60, w: 180, h: 60, field: 'ProductKey'},
    {name: 'Dim_Customers', x: 820, y: 60, w: 180, h: 60, field: 'CustomerKey'},
    {name: 'Dim_Branches', x: 120, y: 380, w: 180, h: 60, field: 'BranchKey'},
    {name: 'Dim_Date', x: 820, y: 380, w: 180, h: 60, field: 'DateKey'},
  ],
};

export const DAX_MEASURES = [
  {n: 'Total Revenue', code: 'Total Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])', c: '#A855F7'},
  {n: 'YTD Revenue', code: 'YTD = TOTALYTD([Total Revenue], Dim_Date[Date])', c: '#A855F7'},
  {n: 'YoY Growth %', code: 'YoY % = DIVIDE([Rev]-[PY], [PY])', c: '#A855F7'},
  {n: 'PY Revenue', code: 'PY = CALCULATE([Rev], SAMEPERIODLASTYEAR(Dim_Date[Date]))', c: '#A855F7'},
];

export const KPIS = [
  {l: 'إجمالي المبيعات', v: '12.8M', d: '+18.4%', up: true, c: '#10B981'},
  {l: 'صافي الربح', v: '3.21M', d: '+9.8%', up: true, c: '#38BDF8'},
  {l: 'هامش الربح', v: '25.0%', d: '-2.1%', up: false, c: '#EF4444'},
  {l: 'YoY Growth', v: '+18.4%', d: 'vs 2025', up: true, c: '#F59E0B'},
];

export const EXEC_STATS = [
  {l: 'الصفوف الخام', v: '50,000', s: 'rows', color: '#10B981'},
  {l: 'زمن المعالجة', v: '1.8', s: 'ms', color: '#38BDF8'},
  {l: 'مراحل المشروع', v: '6', s: 'stages', color: '#A855F7'},
  {l: 'تقرير PDF', v: '1', s: 'export', color: '#F59E0B'},
];
