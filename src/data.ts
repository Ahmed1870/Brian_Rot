// Manzooma — Lesson 13: XLOOKUP Architecture & Dynamic Features.
// Three tables drive the lesson:
//   1. tbl_Customers  (master customer file with Name/Phone/Branch) — Scenes 1, 2, 3, 5
//   2. Transactions   (duplicate Customer A records for reverse search) — Scene 4
//   3. Sales big file (50,000 rows)                                  — Scene 5

/* ------------------------------------------------------------------ customers */
export const CUSTOMERS_HEAD = ['CustomerID', 'CustomerName', 'Branch', 'Phone'];
export type Customer = {id: string; name: string; branch: string; phone: string};
export const CUSTOMERS: Customer[] = [
  {id: 'CUST-001', name: 'Ahmed Hassan',   branch: 'Cairo',       phone: '+20 100 111 1111'},
  {id: 'CUST-002', name: 'Sara Mohamed',   branch: 'Giza',        phone: '+20 100 222 2222'},
  {id: 'CUST-003', name: 'Omar Ibrahim',   branch: 'Giza',        phone: '+20 100 333 3333'},
  {id: 'CUST-004', name: 'Mona Saleh',     branch: 'Dokki',       phone: '+20 100 444 4444'},
  {id: 'CUST-005', name: 'Khaled Adel',    branch: 'Cairo',       phone: '+20 100 555 5555'},
  {id: 'CUST-006', name: 'Hana Youssef',   branch: 'Cairo',       phone: '+20 100 666 6666'},
  {id: 'CUST-007', name: 'Yasser Nabil',   branch: 'Alexandria',  phone: '+20 100 777 7777'},
  {id: 'CUST-008', name: 'Laila Fawzi',    branch: 'Tanta',       phone: '+20 100 888 8888'},
  {id: 'CUST-009', name: 'Tarek Mostafa',  branch: 'Ismailia',    phone: '+20 100 999 9999'},
  {id: 'CUST-010', name: 'Nour Hisham',    branch: 'Luxor',       phone: '+20 101 000 0000'},
  {id: 'CUST-011', name: 'Dina Ehab',      branch: 'Fayoum',      phone: '+20 101 111 1111'},
  {id: 'CUST-012', name: 'Sherif Wagdy',   branch: 'Red Sea',     phone: '+20 101 222 2222'},
  {id: 'CUST-013', name: 'Amira Sami',     branch: 'Port Said',   phone: '+20 101 333 3333'},
  {id: 'CUST-014', name: 'Karim Tawfik',   branch: 'Alexandria',  phone: '+20 101 444 4444'},
  {id: 'CUST-015', name: 'Reem Adel',      branch: 'Cairo',       phone: '+20 101 555 5555'},
];

export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};
export const customerCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    return {t: CUSTOMERS_HEAD[c - 1], b: true, bg: '#E2EFDA', al: 'l'};
  }
  const row = CUSTOMERS[r - 2];
  if (!row || c < 1 || c > 4) return undefined;
  switch (c) {
    case 1: return {t: row.id};
    case 2: return {t: row.name};
    case 3: return {t: row.branch};
    default: return {t: row.phone};
  }
};

/* ------------------------------------------------------------------ transactions (Scene 4: reverse search) */
// Customer A (CUST-001) appears multiple times; the LATEST is at the bottom.
export const TXN_HEAD = ['TxnID', 'CustomerID', 'Date', 'SaleAmount'];
export type Txn = {id: string; customerId: string; date: string; amount: number};
export const TXNS: Txn[] = [
  {id: 'TXN-1001', customerId: 'CUST-001', date: '2026-01-15', amount: 1200},
  {id: 'TXN-1002', customerId: 'CUST-002', date: '2026-01-22', amount: 850},
  {id: 'TXN-1003', customerId: 'CUST-001', date: '2026-02-10', amount: 2100},
  {id: 'TXN-1004', customerId: 'CUST-003', date: '2026-02-18', amount: 540},
  {id: 'TXN-1005', customerId: 'CUST-001', date: '2026-03-05', amount: 1750},
  {id: 'TXN-1006', customerId: 'CUST-004', date: '2026-03-12', amount: 980},
  {id: 'TXN-1007', customerId: 'CUST-001', date: '2026-04-01', amount: 3200},   // latest for CUST-001
  {id: 'TXN-1008', customerId: 'CUST-005', date: '2026-04-08', amount: 670},
  {id: 'TXN-1009', customerId: 'CUST-001', date: '2026-05-20', amount: 4100},   // even more recent
  {id: 'TXN-1010', customerId: 'CUST-006', date: '2026-05-27', amount: 2300},
];
export const txnCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 4) return undefined;
    return {t: TXN_HEAD[c - 1], b: true, bg: '#E2EFDA', al: c === 4 ? 'r' : 'l'};
  }
  const t = TXNS[r - 2];
  if (!t || c < 1 || c > 4) return undefined;
  switch (c) {
    case 1: return {t: t.id};
    case 2: return {t: t.customerId};
    case 3: return {t: t.date};
    default: return {t: 'EGP ' + t.amount.toLocaleString('en-US'), al: 'r'};
  }
};

/* ------------------------------------------------------------------ big sales */
const SALE_PRODUCTS = [
  ['Wireless Mouse', 'Accessories', 350],
  ['USB-C Cable', 'Accessories', 120],
  ['Laptop Stand', 'Office', 900],
  ['Office Chair', 'Furniture', 3200],
  ['Notebook A5', 'Stationery', 45],
  ['Desk Lamp', 'Office', 650],
  ['Monitor 24"', 'Electronics', 4800],
  ['Keyboard', 'Accessories', 750],
] as const;
const SALE_BRANCHES = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta'];

export type SaleRow = {id: string; customerId: string; branch: string; product: string; qty: number; price: number; total: number};

export const sale = (n: number): SaleRow => {
  const h = (n * 2654435761) >>> 0;
  const p = SALE_PRODUCTS[(h >>> 3) % SALE_PRODUCTS.length];
  const qty = 1 + ((h >>> 9) % 6);
  const custIdx = (h >>> 5) % CUSTOMERS.length;
  return {
    id: `ORD-${1000 + n}`,
    customerId: CUSTOMERS[custIdx].id,
    branch: SALE_BRANCHES[(h >>> 13) % SALE_BRANCHES.length],
    product: p[0],
    qty,
    price: p[2],
    total: qty * p[2],
  };
};

export const BIG_ROWS = 50000;
export const BIG_LAST = BIG_ROWS + 1;
export const fmtInt = (n: number) => n.toLocaleString('en-US');
