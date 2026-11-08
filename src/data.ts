// Manzooma — Lesson 11: VLOOKUP Architecture.
// Three tables drive the lesson:
//   1. tbl_Customers  (master customer file)  — Scenes 1, 3, 4, 5
//   2. Products       (code-indexed)          — Scene 2 (exact vs approx match)
//   3. Sales big file (50,000 rows)           — Scene 5 (enterprise merge)

/* ------------------------------------------------------------------ customers */
export const CUSTOMERS_HEAD = ['CustomerID', 'CustomerName', 'Address'];
export type Customer = {id: string; name: string; address: string; middle?: string};
export const CUSTOMERS: Customer[] = [
  {id: 'CUST-001', name: 'Ahmed Hassan',   address: '12 Tahrir St, Cairo'},
  {id: 'CUST-002', name: 'Sara Mohamed',   address: '45 Nile Rd, Giza'},
  {id: 'CUST-003', name: 'Omar Ibrahim',   address: '78 Pyramid Ave, Giza'},
  {id: 'CUST-004', name: 'Mona Saleh',     address: '33 Orman St, Dokki'},
  {id: 'CUST-005', name: 'Khaled Adel',     address: '9 Maadi Corniche, Cairo'},
  {id: 'CUST-006', name: 'Hana Youssef',   address: '67 Heliopolis Rd, Cairo'},
  {id: 'CUST-007', name: 'Yasser Nabil',   address: '21 Smouha Blvd, Alexandria'},
  {id: 'CUST-008', name: 'Laila Fawzi',    address: '14 Mansoura St, Tanta'},
  {id: 'CUST-009', name: 'Tarek Mostafa',  address: '88 Suez Canal Rd, Ismailia'},
  {id: 'CUST-010', name: 'Nour Hisham',     address: '5 Aswan Promenade, Luxor'},
  {id: 'CUST-011', name: 'Dina Ehab',       address: '52 Fayoum St, Fayoum'},
  {id: 'CUST-012', name: 'Sherif Wagdy',    address: '7 Hurghada Bay, Red Sea'},
  {id: 'CUST-013', name: 'Amira Sami',      address: '39 Port Said St, Port Said'},
  {id: 'CUST-014', name: 'Karim Tawfik',    address: '60 Mansheya Sq, Alexandria'},
  {id: 'CUST-015', name: 'Reem Adel',       address: '18 Shubra St, Cairo'},
];

/** Customer table cell. With insert flag the table grows to 4 columns (MiddleName injected after Name). */
export type CCell = {t: string; b?: boolean; al?: 'l' | 'c' | 'r'; bg?: string; color?: string};
export const customerCell = (r: number, c: number, opts?: {insert?: boolean; highlightCol?: number; highlightColor?: string}): CCell | undefined => {
  const ins = !!opts?.insert;
  if (r === 1) {
    if (ins) {
      const h = ['CustomerID', 'CustomerName', 'MiddleName', 'Address'];
      if (c < 1 || c > 4) return undefined;
      const bg = '#E2EFDA';
      return {t: h[c - 1], b: true, bg, al: 'l'};
    }
    if (c < 1 || c > 3) return undefined;
    return {t: CUSTOMERS_HEAD[c - 1], b: true, bg: '#E2EFDA', al: 'l'};
  }
  const row = CUSTOMERS[r - 2];
  if (!row) return undefined;
  if (ins) {
    if (c < 1 || c > 4) return undefined;
    const hcol = opts?.highlightCol;
    if (hcol === c) return {t: ['N/A', '—', 'N/A', '—'][c-1] ?? '', bg: (opts?.highlightColor ?? '#F59E0B') + '22'};
    switch (c) {
      case 1: return {t: row.id};
      case 2: return {t: row.name};
      case 3: return {t: row.middle ?? 'M.'};
      default: return {t: row.address};
    }
  }
  if (c < 1 || c > 3) return undefined;
  switch (c) {
    case 1: return {t: row.id};
    case 2: return {t: row.name};
    default: return {t: row.address};
  }
};

/* ------------------------------------------------------------------ products */
export const PRODUCTS_HEAD = ['ProductCode', 'ProductName', 'Price'];
export type Product = {code: string; name: string; price: number};
// Sorted ascending by code so that an accidental approximate match returns a *different* adjacent product.
export const PRODUCTS: Product[] = [
  {code: 'PROD-901', name: 'Wireless Mouse', price: 350},
  {code: 'PROD-902', name: 'USB-C Cable',    price: 450},   // exact target
  {code: 'PROD-903', name: 'Laptop Stand',   price: 900},
  {code: 'PROD-904', name: 'Office Chair',   price: 3200},
  {code: 'PROD-905', name: 'Notebook A5',    price: 45},
  {code: 'PROD-906', name: 'Desk Lamp',      price: 650},
  {code: 'PROD-907', name: 'Monitor 24"',    price: 4800},
  {code: 'PROD-908', name: 'Mechanical Keyboard', price: 750},
];
export const productCell = (r: number, c: number): CCell | undefined => {
  if (r === 1) {
    if (c < 1 || c > 3) return undefined;
    return {t: PRODUCTS_HEAD[c - 1], b: true, bg: '#E2EFDA', al: c === 3 ? 'r' : 'l'};
  }
  const p = PRODUCTS[r - 2];
  if (!p || c < 1 || c > 3) return undefined;
  switch (c) {
    case 1: return {t: p.code};
    case 2: return {t: p.name};
    default: return {t: 'EGP ' + p.price.toLocaleString('en-US'), al: 'r'};
  }
};

/* ------------------------------------------------------------------ big sales */
// Reuses the deterministic generator idea from the reference project but with a CustomerID column.
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

/** Deterministic pseudo-random sale for an order index (1-based). CustomerID rotates through CUST-001..015 so VLOOKUP results are real. */
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
export const BIG_LAST = BIG_ROWS + 1;   // header + data

export const fmtInt = (n: number) => n.toLocaleString('en-US');
