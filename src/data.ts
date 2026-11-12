// Illustrative sales model: Sales (fact) + Customers, Products, Branches (dimensions). 46,500 + 3,000 + 480 + 20 = 50,000 rows.
export const num = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const h = (a: number, b: number): number => {
  let x = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};
export const N_SALES = 46500, N_CUST = 3000, N_PROD = 480, N_BRANCH = 20, N_TOTAL = N_SALES + N_CUST + N_PROD + N_BRANCH;
const BR = ["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta", "Aswan", "Luxor", "Suez", "Fayoum", "Ismailia"];
const REGION = ["Greater Cairo", "Delta", "Upper Egypt", "Canal"];
const FIRST = ["Ahmed", "Mona", "Omar", "Salma", "Youssef", "Heba", "Karim", "Nour", "Mostafa", "Dina", "Tarek", "Rana"];
const LAST = ["Hassan", "Ali", "Mahmoud", "Ibrahim", "Saleh", "Farouk", "Nabil", "Adel"];
const CITY = ["Cairo", "Giza", "Alexandria", "Mansoura", "Tanta", "Luxor"];
const SEG = ["Retail", "Corporate", "Wholesale"];
const PN = ["Laptop 15", "Wireless Mouse", "Mechanical Keyboard", "Monitor 24", "USB-C Hub", "Webcam HD", "Laser Printer", "Router AX", "Headset Pro", "SSD 1TB"];
const CAT = ["Computers", "Accessories", "Accessories", "Displays", "Accessories", "Accessories", "Printers", "Networking", "Audio", "Storage"];
const PRICE = [18500, 450, 1200, 4200, 650, 900, 5200, 2100, 1500, 1800];
export const branch = (id: number): string[] => [String(id), BR[(id - 1) % 10] + (id > 10 ? " 2" : ""), REGION[(id - 1) % 4]];
export const prod = (id: number): string[] => { const k = (id - 1) % 10; return [String(id), PN[k] + (id > 10 ? " v" + (1 + Math.floor((id - 1) / 10) % 9) : ""), CAT[k], num(PRICE[k])]; };
export const cust = (id: number): string[] => [String(id), FIRST[Math.floor(h(id, 1) * 12)] + " " + LAST[Math.floor(h(id, 2) * 8)], CITY[Math.floor(h(id, 3) * 6)], SEG[Math.floor(h(id, 4) * 3)]];
export const sale = (i: number): string[] => {
  const p = 1 + Math.floor(h(i, 11) * N_PROD), q = 1 + Math.floor(h(i, 12) * 5);
  const d = 1 + Math.floor(h(i, 13) * 330), mo = 1 + Math.floor(d / 28) % 12, dy = 1 + (d % 28);
  return ["INV-" + (100001 + i), mo + "/" + dy + "/2026", String(1 + Math.floor(h(i, 14) * N_CUST)), String(p), String(1 + Math.floor(h(i, 15) * N_BRANCH)), String(q), num(q * PRICE[(p - 1) % 10])];
};
export const SALES_COLS = ["SalesID", "Date", "CustomerID", "ProductID", "BranchID", "Qty", "Amount"];
export const CUST_COLS = ["CustomerID", "CustomerName", "City", "Segment"];
export const PROD_COLS = ["ProductID", "ProductName", "Category", "UnitPrice"];
export const BRANCH_COLS = ["BranchID", "Branch", "Region"];
