// manzooma_store_db — Lesson 57 dataset

/** Physical tables for Scene 1 visualization. */
export const PHYSICAL_TABLES = [
  {name: 'store_orders', x: 80, y: 200, color: '#38BDF8'},
  {name: 'store_customers', x: 80, y: 380, color: '#38BDF8'},
  {name: 'store_products', x: 80, y: 560, color: '#38BDF8'},
];

/** Enterprise view query lines for Scene 5. */
export const ENTERPRISE_VIEW_LINES = [
  'CREATE VIEW vw_store_sales_summary AS',
  '  SELECT o.order_id, c.customer_name, p.product_name,',
  '         o.total_amount',
  '  FROM store_orders o',
  '  JOIN store_customers c ON o.customer_id = c.customer_id',
  '  JOIN store_products p ON o.product_id = p.product_id;',
];

/** Updatable view demo lines for Scene 3. */
export const UPDATABLE_VIEW_LINES = [
  'CREATE OR REPLACE VIEW vw_active_customers AS',
  '  SELECT customer_id, customer_name, city',
  '  FROM store_customers WHERE balance > 0;',
  '-- Updatable: single-table, no aggregates',
  "UPDATE vw_active_customers SET city = 'Cairo'",
  '  WHERE customer_id = 101;',
];
