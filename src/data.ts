// manzooma_store_v2 — Lesson 65 dataset (Capstone Schema Architecture)

/** ERD entities for Manzooma Store V2 — 15-table capstone. */
export const ERD_ENTITIES = [
  {name: 'store_customers', color: 'blue', x: 200, y: 120, fields: ['customer_id PK', 'full_name', 'email UQ', 'phone', 'created_at']},
  {name: 'store_branches', color: 'green', x: 700, y: 80, fields: ['branch_id PK', 'branch_name', 'city', 'location', 'is_active']},
  {name: 'store_products', color: 'amber', x: 1200, y: 120, fields: ['product_id PK', 'sku UQ', 'name', 'price', 'stock_qty']},
  {name: 'store_orders', color: 'purple', x: 700, y: 360, fields: ['order_id PK', 'customer_id FK', 'branch_id FK', 'total_amount', 'order_date']},
  {name: 'store_order_items', color: 'red', x: 1200, y: 360, fields: ['item_id PK', 'order_id FK', 'product_id FK', 'quantity', 'unit_price']},
  {name: 'store_inventory', color: 'blue', x: 200, y: 360, fields: ['inventory_id PK', 'branch_id FK', 'product_id FK', 'qty_on_hand', 'reorder_pt']},
  {name: 'store_audit_logs', color: 'purple', x: 1200, y: 600, fields: ['log_id PK', 'table_name', 'action', 'row_pk', 'logged_at']},
];

/** ERD relationship lines (entity-pair connectors). */
export const ERD_RELATIONS = [
  {from: 'store_customers', to: 'store_orders', label: '1:N', color: 'blue'},
  {from: 'store_branches', to: 'store_orders', label: '1:N', color: 'green'},
  {from: 'store_branches', to: 'store_inventory', label: '1:N', color: 'green'},
  {from: 'store_products', to: 'store_order_items', label: '1:N', color: 'amber'},
  {from: 'store_orders', to: 'store_order_items', label: '1:N', color: 'purple'},
  {from: 'store_products', to: 'store_inventory', label: '1:N', color: 'amber'},
];

/** Normalization steps for Scene 2. */
export const NORMALIZATION_STEPS = [
  {
    nf: '1NF',
    title: 'Atomic Values',
    color: 'red',
    problem: 'comma-separated lists in a single column',
    fix: 'split into separate rows · one value per cell',
    example_before: 'tags: "laptop, ssd, 16gb"',
    example_after: 'tags table → product_id, tag_value',
  },
  {
    nf: '2NF',
    title: 'Full Dependency',
    color: 'amber',
    problem: 'partial dependency on composite key',
    fix: 'move partially-dependent columns to their own table',
    example_before: 'order_items(order_id, product_id, product_name)',
    example_after: 'order_items(order_id, product_id) · products(product_id, name)',
  },
  {
    nf: '3NF',
    title: 'Transitive Elimination',
    color: 'green',
    problem: 'non-key columns depend on other non-key columns',
    fix: 'extract transitively-dependent columns into separate entity',
    example_before: 'orders(order_id, customer_id, customer_city)',
    example_after: 'orders(order_id, customer_id) · customers(customer_id, city)',
  },
];

/** DDL example for store_orders table. */
export const DDL_STORE_ORDERS = [
  'CREATE TABLE store_orders (',
  '  order_id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,',
  '  customer_id     INT NOT NULL,',
  '  branch_id       INT NOT NULL,',
  '  total_amount    NUMERIC(12,2) NOT NULL,',
  '  order_date      TIMESTAMPTZ DEFAULT now(),',
  '  CONSTRAINT fk_orders_customer',
  '    FOREIGN KEY (customer_id) REFERENCES store_customers(customer_id)',
  '    ON DELETE RESTRICT,',
  '  CONSTRAINT fk_orders_branch',
  '    FOREIGN KEY (branch_id) REFERENCES store_branches(branch_id)',
  '    ON DELETE RESTRICT,',
  '  CONSTRAINT chk_orders_amount',
  '    CHECK (total_amount >= 0)',
  ');',
];

/** DDL example for store_order_items with ON DELETE CASCADE. */
export const DDL_ORDER_ITEMS = [
  'CREATE TABLE store_order_items (',
  '  item_id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,',
  '  order_id        INT NOT NULL,',
  '  product_id      INT NOT NULL,',
  '  quantity        INT NOT NULL,',
  '  unit_price      NUMERIC(12,2) NOT NULL,',
  '  CONSTRAINT fk_items_order',
  '    FOREIGN KEY (order_id) REFERENCES store_orders(order_id)',
  '    ON DELETE CASCADE,',
  '  CONSTRAINT fk_items_product',
  '    FOREIGN KEY (product_id) REFERENCES store_products(product_id)',
  '    ON DELETE RESTRICT,',
  '  CONSTRAINT chk_items_qty',
  '    CHECK (quantity > 0)',
  ');',
];

/** PostgreSQL 16 system catalog entries for Scene 4. */
export const SYSTEM_CATALOG = [
  {relname: 'store_customers', relkind: 'r', reltuples: 480000, n_att: 5},
  {relname: 'store_products', relkind: 'r', reltuples: 27000, n_att: 5},
  {relname: 'store_branches', relkind: 'r', reltuples: 18, n_att: 5},
  {relname: 'store_orders', relkind: 'r', reltuples: 12400000, n_att: 5},
  {relname: 'store_order_items', relkind: 'r', reltuples: 41200000, n_att: 5},
  {relname: 'store_inventory', relkind: 'r', reltuples: 540, n_att: 5},
  {relname: 'store_audit_logs', relkind: 'r', reltuples: 9800000, n_att: 5},
];

/** B-Tree FK index validation examples. */
export const FK_INDEX_CHECKS = [
  {table: 'store_orders', fk_col: 'customer_id', parent: 'store_customers', action: 'RESTRICT', index: 'store_customers_pkey', latency_ms: 0.04},
  {table: 'store_orders', fk_col: 'branch_id', parent: 'store_branches', action: 'RESTRICT', index: 'store_branches_pkey', latency_ms: 0.03},
  {table: 'store_order_items', fk_col: 'order_id', parent: 'store_orders', action: 'CASCADE', index: 'store_orders_pkey', latency_ms: 0.04},
  {table: 'store_order_items', fk_col: 'product_id', parent: 'store_products', action: 'RESTRICT', index: 'store_products_pkey', latency_ms: 0.05},
];

/** Capstone deployment script for Scene 5 — 15 relational tables. */
export const CAPSTONE_DEPLOY_CODE = [
  '-- manzooma_store_v2_schema.sql · 15-table capstone',
  '\\i manzooma_store_v2_schema.sql',
  '',
  '-- Schema: manzooma_store_v2',
  'CREATE SCHEMA IF NOT EXISTS manzooma_store_v2;',
  'SET search_path TO manzooma_store_v2;',
  '',
  '-- Core entities (7 tables)',
  'CREATE TABLE store_customers (...);',
  'CREATE TABLE store_branches (...);',
  'CREATE TABLE store_products (...);',
  'CREATE TABLE store_orders (...);',
  'CREATE TABLE store_order_items (...);',
  'CREATE TABLE store_inventory (...);',
  'CREATE TABLE store_audit_logs (...);',
  '',
  '-- Auxiliary entities (8 tables)',
  'CREATE TABLE store_payments (...);',
  'CREATE TABLE store_shipments (...);',
  'CREATE TABLE store_returns (...);',
  'CREATE TABLE store_categories (...);',
  'CREATE TABLE store_suppliers (...);',
  'CREATE TABLE store_reviews (...);',
  'CREATE TABLE store_coupons (...);',
  'CREATE TABLE store_employees (...);',
];

/** Capstone deployment verification. */
export const CAPSTONE_VERIFICATION = {
  totalTables: 15,
  totalForeignKeys: 28,
  totalCheckConstraints: 22,
  totalUniqueConstraints: 17,
  fkViolations: 0,
  deploymentMs: 4200,
  schemaSizeMb: 38.6,
};
