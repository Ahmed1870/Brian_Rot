// manzooma_store_db — Lesson 41 dataset
// Customer spending for NTILE quartiles, delivery hours for percentiles.

/** Customer spending data for NTILE(4) quartile demo (Scene 1 & 5). */
export const CUSTOMER_SPENDING: {id: number; name: string; total_spent: number}[] = [
  {id: 1, name: 'Karim', total_spent: 12500},
  {id: 2, name: 'Laila', total_spent: 11200},
  {id: 3, name: 'Ahmed', total_spent: 9800},
  {id: 4, name: 'Sara', total_spent: 8600},
  {id: 5, name: 'Omar', total_spent: 7400},
  {id: 6, name: 'Dina', total_spent: 6100},
  {id: 7, name: 'Hany', total_spent: 5200},
  {id: 8, name: 'Mona', total_spent: 4300},
  {id: 9, name: 'Ali', total_spent: 3400},
  {id: 10, name: 'Nora', total_spent: 2100},
];

/** Precomputed NTILE(4) quartile assignments (10 rows / 4 buckets = 3,3,2,2). */
export const NTILE_QUARTILES = CUSTOMER_SPENDING.map((c, i) => {
  // 10 rows, 4 buckets: bucket sizes are 3,3,2,2 (remainder 2 distributed to first 2)
  if (i < 3) return 1;
  if (i < 6) return 2;
  if (i < 8) return 3;
  return 4;
});

/** Rank data for PERCENT_RANK / CUME_DIST demo (Scene 2). */
export const RANK_DATA: {day: number; sales: number}[] = [
  {day: 1, sales: 1200},
  {day: 2, sales: 950},
  {day: 3, sales: 1450},
  {day: 4, sales: 800},
  {day: 5, sales: 1600},
  {day: 6, sales: 1100},
  {day: 7, sales: 1850},
];

/** Precomputed PERCENT_RANK and CUME_DIST values. */
export const RANK_RESULTS = RANK_DATA.map((row, i, arr) => {
  const total = arr.length;
  const rank = i + 1; // 1-indexed rank (assuming sorted ascending)
  const percentRank = total === 1 ? 0 : (rank - 1) / (total - 1);
  const cumeDist = rank / total;
  return {day: row.day, sales: row.sales, percentRank, cumeDist};
});

/** Delivery hours for PERCENTILE_CONT / PERCENTILE_DISC demo (Scene 3). */
export const DELIVERY_HOURS: number[] = [2.1, 2.5, 3.0, 3.2, 3.8, 4.0, 4.5, 5.0, 5.5, 6.2];

/** Precomputed percentile values for P=0.90. */
export const PERCENTILE_RESULTS = {
  p90_cont: 5.57, // linear interpolation between 5.5 and 6.2 at 0.90
  p90_disc: 5.0,  // first discrete value where cumulative dist >= 0.90
};

/** Enterprise P95 SLA data per region (Scene 5). */
export const REGION_SLA: {region: string; p95_sla: number; deliveries: number}[] = [
  {region: 'Cairo', p95_sla: 4.2, deliveries: 1240},
  {region: 'Alexandria', p95_sla: 5.1, deliveries: 890},
  {region: 'Giza', p95_sla: 3.8, deliveries: 1560},
  {region: 'Luxor', p95_sla: 6.5, deliveries: 420},
];
