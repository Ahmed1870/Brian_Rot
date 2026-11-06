// manzooma_store_db — Lesson 53 dataset

/** ACID properties data. */
export const ACID_PROPERTIES = [
  {letter: 'A', name: 'Atomicity', desc: 'All-or-Nothing Execution', color: '#38BDF8', icon: 'atom'},
  {letter: 'C', name: 'Consistency', desc: 'Valid State Transition', color: '#F59E0B', icon: 'balance'},
  {letter: 'I', name: 'Isolation', desc: 'Zero Concurrency Interference', color: '#A855F7', icon: 'wall'},
  {letter: 'D', name: 'Durability', desc: 'Power Failure Proof (WAL)', color: '#10B981', icon: 'shield'},
];

/** Enterprise transaction query lines. */
export const ENTERPRISE_TX_LINES = [
  'BEGIN;',
  'UPDATE store_customers SET balance = balance - 1500',
  '  WHERE customer_id = 101;',
  'UPDATE store_products SET stock_qty = stock_qty - 1',
  '  WHERE product_id = 502;',
  'COMMIT; -- or ROLLBACK on insufficient balance',
];

/** WAL log entries for visualization. */
export const WAL_ENTRIES = [
  {xid: 'XID: 804921', lsn: 'LSN: 0/1A2B3C', action: 'INSERT store_customers', status: 'logged'},
  {xid: 'XID: 804921', lsn: 'LSN: 0/1A2B4D', action: 'UPDATE store_products', status: 'logged'},
  {xid: 'XID: 804921', lsn: 'LSN: 0/1A2B5E', action: 'COMMIT', status: 'flushed'},
];
