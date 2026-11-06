// manzooma_store_db — Lesson 52 dataset

/** Non-SARGable vs SARGable comparison examples. */
export const SARGABLE_EXAMPLES = [
  {
    bad: "WHERE LOWER(name) = 'admin'",
    good: "WHERE name = 'admin' OR name = 'Admin'",
    issue: 'Function wrapping kills index',
    fix: 'Use expression index or rewrite',
  },
  {
    bad: 'WHERE price * 1.1 > 100',
    good: 'WHERE price > 100 / 1.1',
    issue: 'Column arithmetic invalidates B-Tree',
    fix: 'Move arithmetic to constant side',
  },
  {
    bad: "WHERE name LIKE '%store'",
    good: "WHERE name LIKE 'store%'",
    issue: 'Leading wildcard breaks B-Tree traversal',
    fix: 'Use prefix match or pg_trgm GIN index',
  },
  {
    bad: 'WHERE phone_no = 0100',
    good: "WHERE phone_no = '0100'",
    issue: 'Implicit casting prevents index usage',
    fix: 'Match column types explicitly',
  },
];

/** Selectivity benchmark data (Scene 4). */
export const SELECTIVITY = {
  highValue: 0.001,
  lowValue: 0.85,
  highLabel: 'High Selectivity',
  lowLabel: 'Low Selectivity',
};

/** Enterprise query for Scene 5. */
export const ENTERPRISE_QUERY_LINES = [
  'SELECT order_id, customer_id, total_amount',
  'FROM store_orders',
  "WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE)",
  '  AND total_amount > 5000 / 1.10;',
];
