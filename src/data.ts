// manzooma_store_db — Lesson 58 dataset

/** Performance benchmark data for Scene 2. */
export const PERF_BENCHMARK = {
  standardViewMs: 4800,
  materializedViewMs: 0.4,
  standardLabel: '4.8s',
  materializedLabel: '0.4ms',
};

/** Enterprise materialized view query lines. */
export const ENTERPRISE_MVIEW_LINES = [
  'CREATE MATERIALIZED VIEW mv_store_monthly_performance AS',
  "  SELECT DATE_TRUNC('month', order_date) AS month,",
  '         product_id, SUM(total_amount) AS revenue',
  '  FROM store_orders GROUP BY 1, 2;',
  'CREATE UNIQUE INDEX idx_mv_store_perf',
  '  ON mv_store_monthly_performance(month, product_id);',
];

/** Refresh strategy commands. */
export const REFRESH_COMMANDS = [
  'CREATE UNIQUE INDEX idx_mv_id ON mv_sales (summary_id);',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales;',
];
