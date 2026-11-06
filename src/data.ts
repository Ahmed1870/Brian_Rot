// manzooma_store_db — Lesson 56 dataset

/** Row lock types for Scene 2. */
export const ROW_LOCK_TYPES = [
  {type: 'FOR UPDATE', desc: 'Locks rows against writes & deletes', color: '#EF4444'},
  {type: 'FOR NO KEY UPDATE', desc: 'Locks for non-key modifications', color: '#F59E0B'},
  {type: 'FOR SHARE', desc: 'Shared read lock, blocks writes', color: '#38BDF8'},
  {type: 'FOR KEY SHARE', desc: 'Lightest key protection lock', color: '#10B981'},
];

/** Table lock levels for Scene 3. */
export const TABLE_LOCK_LEVELS = [
  {level: 'ACCESS SHARE', desc: 'SELECT (auto)', color: '#10B981'},
  {level: 'ROW SHARE', desc: 'SELECT FOR UPDATE/SHARE', color: '#38BDF8'},
  {level: 'ROW EXCLUSIVE', desc: 'INSERT/UPDATE/DELETE', color: '#F59E0B'},
  {level: 'SHARE UPDATE EXCLUSIVE', desc: 'VACUUM/ANALYZE', color: '#F59E0B'},
  {level: 'SHARE', desc: 'CREATE INDEX', color: '#A855F7'},
  {level: 'SHARE ROW EXCLUSIVE', desc: 'Concurrent CREATE INDEX', color: '#A855F7'},
  {level: 'EXCLUSIVE', desc: 'Rare maintenance', color: '#EF4444'},
  {level: 'ACCESS EXCLUSIVE', desc: 'ALTER/DROP/TRUNCATE', color: '#EF4444'},
];

/** Enterprise inventory query lines. */
export const ENTERPRISE_LOCK_LINES = [
  'BEGIN;',
  'SELECT product_id, stock_qty FROM store_products',
  '  WHERE product_id = 502 FOR UPDATE;',
  'UPDATE store_products SET stock_qty = stock_qty - 1',
  '  WHERE product_id = 502;',
  'COMMIT;',
];

/** Job queue query for SKIP LOCKED demo. */
export const JOB_QUEUE_LINES = [
  'SELECT * FROM job_queue',
  '  FOR UPDATE SKIP LOCKED',
  '  LIMIT 1;',
];
