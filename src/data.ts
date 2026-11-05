// manzooma_store_db — Lesson 39 dataset
// Daily revenue data for running totals and moving averages.

/** Daily revenue for 12 days — used across scenes 1, 2, 3, 5. */
export const DAILY_REVENUE: {day: number; date: string; amount: number}[] = [
  {day: 1, date: '2024-01-01', amount: 1200},
  {day: 2, date: '2024-01-02', amount: 950},
  {day: 3, date: '2024-01-03', amount: 1450},
  {day: 4, date: '2024-01-04', amount: 800},
  {day: 5, date: '2024-01-05', amount: 1600},
  {day: 6, date: '2024-01-06', amount: 1100},
  {day: 7, date: '2024-01-07', amount: 1850},
  {day: 8, date: '2024-01-08', amount: 1300},
  {day: 9, date: '2024-01-09', amount: 2100},
  {day: 10, date: '2024-01-10', amount: 1750},
  {day: 11, date: '2024-01-11', amount: 2200},
  {day: 12, date: '2024-01-12', amount: 1900},
];

/** Precomputed running totals (for visual consistency). */
export const RUNNING_TOTALS: number[] = DAILY_REVENUE.reduce<number[]>((acc, row, i) => {
  acc.push((acc[i - 1] ?? 0) + row.amount);
  return acc;
}, []);

/** Precomputed 7-day moving averages (first 6 days use available window). */
export const MOVING_AVGS: number[] = DAILY_REVENUE.map((row, i) => {
  const start = Math.max(0, i - 6);
  const window = DAILY_REVENUE.slice(start, i + 1);
  const sum = window.reduce((a, b) => a + b.amount, 0);
  return Math.round((sum / window.length) * 100) / 100;
});

/** Performance numbers for Scene 4. */
export const PERF = {
  rowsScanned: 1000000,
  fullScanMs: 1240.5,
  windowAggMs: 0.42,
};

/** Enterprise YTD cumulative chart points (for Scene 5). */
export const YTD_POINTS = DAILY_REVENUE.map((r, i) => ({
  day: r.day,
  daily: r.amount,
  cumulative: RUNNING_TOTALS[i],
  mavg: MOVING_AVGS[i],
}));
