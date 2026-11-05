// manzooma_store_db — Lesson 40 dataset
// Monthly sales and customer orders for LAG/LEAD/FIRST_VALUE/LAST_VALUE demos.

/** Monthly sales for LAG demo (Scene 1 & 5). */
export const MONTHLY_SALES: {month: string; sales: number}[] = [
  {month: '2024-01', sales: 45000},
  {month: '2024-02', sales: 52000},
  {month: '2024-03', sales: 48000},
  {month: '2024-04', sales: 61000},
  {month: '2024-05', sales: 55000},
  {month: '2024-06', sales: 67000},
  {month: '2024-07', sales: 72000},
  {month: '2024-08', sales: 69000},
];

/** Precomputed MoM growth percentages for visual consistency. */
export const MOM_GROWTH: (number | null)[] = MONTHLY_SALES.map((r, i) => {
  if (i === 0) return null;
  const prev = MONTHLY_SALES[i - 1].sales;
  return Math.round(((r.sales - prev) / prev) * 1000) / 10;
});

/** Customer orders for LEAD demo (Scene 2 & 5). */
export const CUSTOMER_ORDERS: {customer_id: number; order_date: string; amount: number}[] = [
  {customer_id: 101, order_date: '2024-01-15', amount: 1200},
  {customer_id: 101, order_date: '2024-02-20', amount: 850},
  {customer_id: 101, order_date: '2024-04-10', amount: 2100},
  {customer_id: 102, order_date: '2024-01-08', amount: 3400},
  {customer_id: 102, order_date: '2024-03-15', amount: 1500},
  {customer_id: 103, order_date: '2024-02-12', amount: 950},
  {customer_id: 103, order_date: '2024-05-01', amount: 1800},
];

/** Daily amounts for FIRST_VALUE / LAST_VALUE demo (Scene 3). */
export const DAILY_AMOUNTS: {day: number; date: string; amount: number}[] = [
  {day: 1, date: '2024-06-01', amount: 1200},
  {day: 2, date: '2024-06-02', amount: 950},
  {day: 3, date: '2024-06-03', amount: 1450},
  {day: 4, date: '2024-06-04', amount: 800},
  {day: 5, date: '2024-06-05', amount: 1600},
  {day: 6, date: '2024-06-06', amount: 1100},
  {day: 7, date: '2024-06-07', amount: 1850},
];

/** Enterprise cohort data for Scene 5 dashboard. */
export const ENTERPRISE_COHORT = MONTHLY_SALES.map((m, i) => ({
  month: m.month,
  sales: m.sales,
  prev_sales: i === 0 ? 0 : MONTHLY_SALES[i - 1].sales,
  mom_pct: MOM_GROWTH[i],
}));
