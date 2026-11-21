// نموذج الدرس 41 (بيانات تجريبية ثابتة) + منطق تقييم السياق المستخدم في كل الأرقام المعروضة.
export type Product = {id: number; name: string; cat: 'Hardware' | 'Accessories'};
export const PRODUCTS: Product[] = [
  {id: 1, name: 'Laptop', cat: 'Hardware'},
  {id: 2, name: 'Mouse', cat: 'Accessories'},
  {id: 3, name: 'Keyboard', cat: 'Accessories'},
  {id: 4, name: 'Monitor', cat: 'Hardware'},
];
export const SALES = [
  {order: 1001, pid: 1, amt: 30000},
  {order: 1002, pid: 2, amt: 1250},
  {order: 1003, pid: 3, amt: 1800},
  {order: 1004, pid: 4, amt: 4500},
];
export const CATS = ['Hardware', 'Accessories'] as const;
export const NAMES = PRODUCTS.map((p) => p.name);

/** السياق: الفئات والمنتجات المحددة في الـ Slicers (فارغ = بلا فلتر) */
export type Ctx = {cats: string[]; prods: string[]};
export const visible = (c: Ctx): Product[] =>
  PRODUCTS.filter((p) => (!c.cats.length || c.cats.includes(p.cat)) && (!c.prods.length || c.prods.includes(p.name)));
export const visibleProducts = (c: Ctx): number => visible(c).length; // COUNTROWS(VALUES(...))
export const hasOne = (c: Ctx): boolean => visible(c).length === 1;
export const selectedProduct = (c: Ctx, alt = 'No Single Selection'): string => (hasOne(c) ? visible(c)[0].name : alt);
export const status = (c: Ctx): string => (hasOne(c) ? 'Single Product' : 'No Single Product');
export const dynTitle = (c: Ctx): string => 'Sales Analysis - ' + selectedProduct(c, 'All or Multiple Products');
export const amountOf = (name: string): number => {
  const p = PRODUCTS.find((x) => x.name === name);
  return SALES.filter((s) => s.pid === p?.id).reduce((a, s) => a + s.amt, 0);
};
export const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** نسخة الاختبار المنفصلة: Sales فيه ProductID = 99 غير موجود في Products */
export const TEST_SALES_PIDS = [1, 2, 3, 4, 99];
/** مثال توضيحي منفصل (ليس من بيانات النموذج): عمود ProductID لو تكرر في عمليات بيع كثيرة */
export const ILLUSTRATIVE_PIDS = [1, 2, 1, 3, 1, 4, 2, 3];
export const uniq = <T,>(a: T[]): T[] => a.filter((x, i) => a.indexOf(x) === i);

/** الميزات الأربع - الأكواد كما في الدرس */
export const DAX = {
  vals: 'Unique Products - VALUES =\nVALUES ( Products[Product] )',
  dist: 'Unique Products - DISTINCT =\nDISTINCT ( Products[Product] )',
  visible: 'Visible Products =\nCOUNTROWS (\n    VALUES ( Products[Product] )\n)',
  selected: 'Selected Product =\nSELECTEDVALUE (\n    Products[Product],\n    "No Single Selection"\n)',
  status: 'Product Selection Status =\nIF (\n    HASONEVALUE ( Products[Product] ),\n    "Single Product",\n    "No Single Product"\n)',
  title: 'Dynamic Title =\n"Sales Analysis - "\n    & SELECTEDVALUE (\n        Products[Product],\n        "All or Multiple Products"\n    )',
};
