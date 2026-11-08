export type Row = {id: number; product: string; qty: number; price: number; region: string};

const PRODUCTS: [string, number][] = [
  ["لابتوب", 18500],
  ["ماوس لاسلكي", 350],
  ["كيبورد ميكانيكي", 1200],
  ["شاشة 24 بوصة", 4200],
  ["سماعات رأس", 900],
  ["طابعة ليزر", 5600],
  ["هارد خارجي", 2100],
  ["كاميرا ويب", 780],
];
export const REGIONS = ["القاهرة", "الإسكندرية", "الجيزة", "أسوان", "المنصورة"];
const QTY = [3, 12, 5, 2, 8, 1, 4, 10, 6, 3, 7, 2, 9, 5, 1, 4, 11, 6, 3];

export const rowAt = (i: number): Row => ({
  id: 1001 + i,
  product: PRODUCTS[i % 8][0],
  qty: QTY[i % 19],
  price: PRODUCTS[i % 8][1],
  region: REGIONS[(i * 2 + 1) % 5],
});
export const ROWS: Row[] = QTY.map((_, i) => rowAt(i)); // excel rows 2..20
export const NEW_ROW: Row = {id: 1020, product: "طابعة ليزر", qty: 3, price: 5600, region: "الجيزة"};
export const HEAD = ["Order ID", "Product", "Quantity", "Unit Price", "Region"];
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const rev = (r: Row) => r.qty * r.price;
export const CAIRO = REGIONS[0];
