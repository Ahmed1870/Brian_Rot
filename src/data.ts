// manzooma_store_v2 — Lesson 66 dataset (End-to-End Analytics Pipeline)

/** KPI cards for Scene 2 — executive dashboard metrics. */
export const KPI_CARDS = [
  {name: 'CLV', full: 'Customer Lifetime Value', value: 'EGP 4,820', trend: '+12.4%', color: 'green', formula: 'SUM(total_amount) OVER (PARTITION BY customer_id)'},
  {name: 'MRR', full: 'Monthly Recurring Revenue', value: 'EGP 1.24M', trend: '+8.7%', color: 'blue', formula: "SUM(total_amount) WHERE date_trunc('month', order_date) = ..."},
  {name: 'Churn', full: 'Customer Churn Rate', value: '3.2%', trend: '-0.8%', color: 'amber', formula: "1 - (active_customers / total_customers) OVER month"},
  {name: 'Retention', full: 'Cohort Retention Rate', value: '94.1%', trend: '+2.1%', color: 'green', formula: 'NTILE(4) OVER (ORDER BY first_order_date) cohort tracking'},
];

/** Multi-stage CTE pipeline for Scene 3. */
export const PIPELINE_CTE_CODE = [
  '-- Lesson 66 · End-to-End Analytics Pipeline',
  'CREATE MATERIALIZED VIEW mv_executive_summary AS',
  'WITH',
  '  monthly_sales AS (',
  '    SELECT date_trunc(\'month\', order_date) AS month,',
  '           customer_id, SUM(total_amount) AS revenue',
  '    FROM store_orders GROUP BY 1, 2',
  '  ),',
  '  customer_cohorts AS (',
  '    SELECT customer_id,',
  '           date_trunc(\'month\', MIN(order_date)) AS cohort_month,',
  '           NTILE(4) OVER (ORDER BY MIN(order_date)) AS cohort_id',
  '    FROM store_orders GROUP BY 1',
  '  ),',
  '  growth_metrics AS (',
  '    SELECT month,',
  '           SUM(revenue) AS mrr,',
  '           LAG(SUM(revenue)) OVER (ORDER BY month) AS prev_mrr,',
  '           SUM(SUM(revenue)) OVER (ORDER BY month) AS cumulative_revenue',
  '    FROM monthly_sales GROUP BY 1',
  '  )',
  'SELECT g.month, g.mrr, g.cumulative_revenue,',
  '       CASE WHEN g.prev_mrr > 0',
  '            THEN ROUND((g.mrr - g.prev_mrr) / g.prev_mrr * 100, 2)',
  '            ELSE 0 END AS growth_pct,',
  '       COUNT(DISTINCT c.customer_id) AS active_customers',
  'FROM growth_metrics g',
  'LEFT JOIN monthly_sales m ON m.month = g.month',
  'LEFT JOIN customer_cohorts c ON c.cohort_month <= g.month',
  'GROUP BY g.month, g.mrr, g.cumulative_revenue, g.prev_mrr',
  'ORDER BY g.month;',
];

/** REFRESH strategy code for Scene 3 second editor. */
export const REFRESH_CODE = [
  '-- Zero-downtime refresh strategy',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_executive_summary;',
  '',
  '-- Query the cached executive dashboard (sub-second)',
  'SELECT month, mrr, cumulative_revenue, growth_pct',
  '  FROM mv_executive_summary',
  '  ORDER BY month DESC',
  '  LIMIT 12;',
  '',
  '-- Refresh job: schedule daily at 02:00 AM',
  '-- cron.schedule(\'refresh_kpis\', \'0 2 * * *\',',
  '--   $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_executive_summary;$$);',
];

/** Parallel worker configuration for Scene 4. */
export const PARALLEL_WORKERS = [
  {id: 1, name: 'worker_1', rows: '3.1M', color: 'blue', pct: 25, status: 'aggregating'},
  {id: 2, name: 'worker_2', rows: '3.4M', color: 'blue', pct: 27, status: 'aggregating'},
  {id: 3, name: 'worker_3', rows: '2.9M', color: 'blue', pct: 23, status: 'aggregating'},
  {id: 4, name: 'worker_4', rows: '3.2M', color: 'blue', pct: 25, status: 'aggregating'},
];

/** work_mem hash aggregation stats. */
export const HASH_AGG_STATS = {
  totalRows: '12.6M',
  hashBuckets: 8192,
  workMemMB: 64,
  diskSpill: false,
  executionMs: 380,
  memoryUtil: 78,
};

/** Enterprise dashboard code for Scene 5. */
export const ENTERPRISE_PIPELINE_CODE = [
  '-- Lesson 66 · pipeline_executive_kpis',
  '-- Step 1: refresh materialized view (zero downtime)',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_kpis;',
  '',
  '-- Step 2: query executive dashboard (sub-second)',
  'SELECT month, mrr, cumulative_revenue,',
  '       growth_pct, retention_rate, top_product',
  '  FROM mv_daily_kpis',
  '  WHERE month >= date_trunc(\'month\', CURRENT_DATE) - INTERVAL \'11 months\'',
  '  ORDER BY month DESC;',
  '',
  '-- Performance: 0.4ms execution · 10 minutes → 0.4 seconds = 1500× speedup',
];

/** Enterprise dashboard verification. */
export const EXECUTIVE_DASHBOARD = {
  beforeMs: 600000,
  afterMs: 0.4,
  speedup: 1500000,
  monthlyRevenue: 'EGP 1.24M',
  retentionRate: '94.1%',
  topProduct: 'Manzooma Pro 16"',
  lastRefresh: '02:00 AM today',
  uptime: '99.97%',
};
