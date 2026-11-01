import {hash} from './lib/anim';

export const FIRST = ['محمد', 'علي', 'محمود', 'مصطفى', 'عمر', 'يوسف', 'كريم', 'هدى', 'منى', 'نور', 'ياسمين', 'سلمى', 'إسلام', 'طارق', 'دينا', 'ريم', 'خالد', 'حسن', 'آية', 'ندى'];
export const LAST = ['حسن', 'إبراهيم', 'السيد', 'فتحي', 'رمضان', 'سعيد', 'مراد', 'نصر', 'شاهين', 'عادل', 'زكي', 'عثمان'];
export const STREETS = ['شارع النيل، المعادي', 'شارع الهرم، الجيزة', 'مدينة نصر، القاهرة', 'شارع فيصل، الجيزة', 'سموحة، الإسكندرية', 'التجمع الخامس', 'الزمالك، القاهرة', 'المهندسين، الجيزة', 'الشيخ زايد', 'مصر الجديدة'];
export const PRODUCTS = [
  {n: 'سماعة بلوتوث', p: 450},
  {n: 'شاحن سريع 65W', p: 320},
  {n: 'ماوس لاسلكي', p: 280},
  {n: 'كيبورد ميكانيكي', p: 1150},
  {n: 'حقيبة لابتوب', p: 690},
  {n: 'شاشة 27 بوصة', p: 4800},
  {n: 'كاميرا ويب HD', p: 540},
  {n: 'باور بانك 20000', p: 610},
  {n: 'حامل موبايل', p: 120},
  {n: 'فلاشة 128GB', p: 260},
];

export const AHMED = {name: 'أحمد محمود', phone: '01000000001', address: '12 شارع التحرير، الدقي'};
export const NEW_PHONE = '01099999999';

// 50 rows of the flat file belong to the same customer (rows 12 and 148 are the ones the lesson edits / compares)
export const AHMED_ROWS: number[] = (() => {
  const cand: number[] = [];
  for (let n = 2; n <= 200; n++) if (n !== 12 && n !== 148) cand.push(n);
  cand.sort((a, b) => hash(a * 7.7) - hash(b * 7.7));
  const picked = cand.slice(0, 48);
  picked.push(12, 148);
  return picked.sort((a, b) => a - b);
})();
const AHMED_SET = new Set(AHMED_ROWS);
export const isAhmed = (n: number): boolean => AHMED_SET.has(n);

export type SheetRow = {
  n: number;
  id: string;
  date: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  qty: string;
  ahmed: boolean;
};

export const COLS: {key: keyof SheetRow; title: string; w: number; mono?: boolean}[] = [
  {key: 'n', title: '#', w: 60, mono: true},
  {key: 'id', title: 'الطلب', w: 118, mono: true},
  {key: 'date', title: 'التاريخ', w: 158, mono: true},
  {key: 'name', title: 'العميل', w: 176},
  {key: 'phone', title: 'الهاتف', w: 178, mono: true},
  {key: 'address', title: 'العنوان', w: 286},
  {key: 'product', title: 'المنتج', w: 172},
  {key: 'qty', title: 'الكمية', w: 70, mono: true},
];
export const COLS_W = COLS.reduce((a, c) => a + c.w, 0);

export function getRow(n: number): SheetRow {
  const ahmed = isAhmed(n);
  const m = 1 + Math.floor(hash(n * 1.7) * 9);
  const d = 1 + Math.floor(hash(n * 2.3) * 27);
  const prod = PRODUCTS[Math.floor(hash(n * 3.1) * PRODUCTS.length)];
  if (ahmed) {
    return {n, id: '#' + (10000 + n * 3), date: `2026-0${m}-${d < 10 ? '0' + d : d}`, name: AHMED.name, phone: AHMED.phone, address: AHMED.address, product: prod.n, qty: String(1 + Math.floor(hash(n * 4.1) * 3)), ahmed};
  }
  const f = FIRST[Math.floor(hash(n * 5.3) * FIRST.length)];
  const l = LAST[Math.floor(hash(n * 6.7) * LAST.length)];
  const net = ['10', '11', '12', '15'][Math.floor(hash(n * 8.9) * 4)];
  let digits = '';
  for (let i = 0; i < 8; i++) digits += Math.floor(hash(n * 13.1 + i * 3.7) * 10);
  return {n, id: '#' + (10000 + n * 3), date: `2026-0${m}-${d < 10 ? '0' + d : d}`, name: `${f} ${l}`, phone: `0${net}${digits}`, address: STREETS[Math.floor(hash(n * 9.9) * STREETS.length)], product: prod.n, qty: String(1 + Math.floor(hash(n * 4.1) * 3)), ahmed};
}
