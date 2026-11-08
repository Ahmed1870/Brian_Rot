export const NAMES = ["أحمد سمير", "منى عادل", "خالد فؤاد", "سارة حسن", "يوسف نبيل", "هدى كمال", "طارق مراد", "نادية رضا", "كريم صلاح"];
export const CITIES = ["Alexandria", "Giza", "Aswan", "Cairo", "Luxor", "Mansoura", "Tanta", "Suez", "Cairo"];
export const IDS = [1004, 1007, 1001, 1009, 1003, 1006, 1002, 1008, 1005];
export const SALES = [18500, 7200, 12400, 9800, 15300, 6100, 11200, 8700, 13900];
export const LOOKUP_ID = 1006;
export const PRODUCTS = ["Product A", "Product B", "Product C", "Product D", "Product E", "Product F"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const MATRIX = [
  [42, 38, 51, 47, 55, 60],
  [30, 35, 33, 41, 39, 44],
  [22, 25, 28, 24, 30, 33],
  [55, 52, 58, 61, 57, 63],
  [18, 21, 19, 23, 26, 24],
  [36, 40, 44, 42, 48, 51],
];
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const bigRow = (i: number) => ({order: 5001 + i, cid: IDS[(i * 5 + 2) % 9], amount: 500 + ((i * 37) % 4000)});
export const nameOf = (id: number) => NAMES[IDS.indexOf(id)];
