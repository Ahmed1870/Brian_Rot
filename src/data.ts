import {C} from './theme';

export type Status = 'Completed' | 'Returned' | 'Cancelled';
export type Order = {id: number; customer: string; status: Status; amount: number; year: number};

// manzooma_store_db.orders - one small dataset reused by every scene so the numbers always agree
export const ORDERS: Order[] = [
  {id: 1, customer: 'Ali', status: 'Completed', amount: 1200, year: 2023},
  {id: 2, customer: 'Mona', status: 'Completed', amount: 800, year: 2024},
  {id: 3, customer: 'Omar', status: 'Returned', amount: 300, year: 2023},
  {id: 4, customer: 'Sara', status: 'Completed', amount: 1500, year: 2024},
  {id: 5, customer: 'Ali', status: 'Cancelled', amount: 400, year: 2024},
  {id: 6, customer: 'Mona', status: 'Completed', amount: 600, year: 2023},
  {id: 7, customer: 'Omar', status: 'Completed', amount: 900, year: 2024},
  {id: 8, customer: 'Sara', status: 'Returned', amount: 250, year: 2024},
  {id: 9, customer: 'Ali', status: 'Completed', amount: 1100, year: 2024},
  {id: 10, customer: 'Mona', status: 'Cancelled', amount: 350, year: 2023},
];

export const statusColor = (s: Status): string => (s === 'Completed' ? C.green : s === 'Returned' ? C.amber : C.red);

export const TOTAL_COMPLETED = ORDERS.filter((o) => o.status === 'Completed').reduce((a, o) => a + o.amount, 0); // 6100
export const TOTAL_RETURNED = ORDERS.filter((o) => o.status === 'Returned').reduce((a, o) => a + o.amount, 0); // 550
export const COUNT_CANCELLED = ORDERS.filter((o) => o.status === 'Cancelled').length; // 2
export const COUNT_COMPLETED = ORDERS.filter((o) => o.status === 'Completed').length; // 6

export const CUSTOMERS = ['Ali', 'Mona', 'Omar', 'Sara'];
export const YEARS = [2023, 2024];
/** Completed sales of one customer in one year (what SUM(...) FILTER (WHERE ...) returns). */
export const pivotCell = (customer: string, year: number): number =>
  ORDERS.filter((o) => o.customer === customer && o.year === year && o.status === 'Completed').reduce((a, o) => a + o.amount, 0);

/** Completed sales per customer & year in LONG format (the vertical table that gets pivoted). Missing combos have no row. */
export const YEARLY = CUSTOMERS.flatMap((c) => YEARS.map((y) => ({c, y, a: pivotCell(c, y)}))).filter((r) => r.a > 0);
