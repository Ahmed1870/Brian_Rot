export type Prod = { id: number; n: string; price: string; attrs: string[] };
export const PRODUCTS: Prod[] = [
  { id: 101, n: 'لابتوب', price: '1,250', attrs: ['color: Black', 'warranty: 2 Years'] },
  { id: 102, n: 'تيشيرت', price: '45', attrs: ['size: L', 'color: Blue'] },
  { id: 103, n: 'هاتف', price: '640', attrs: ['color: Gray', 'storage: 256GB', 'warranty: 1 Year'] },
  { id: 104, n: 'سماعة', price: '95', attrs: ['color: White', 'battery: 30h'] },
];
