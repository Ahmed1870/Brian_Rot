// manzooma_store_db — Lesson 54 dataset

/** Savepoint path steps for Scene 1 visualization. */
export const SAVEPOINT_PATH = [
  {label: 'BEGIN', type: 'start', color: '#F59E0B'},
  {label: 'Step 1: INSERT', type: 'step', color: '#38BDF8'},
  {label: 'SAVEPOINT A', type: 'savepoint', color: '#38BDF8'},
  {label: 'Step 2: UPDATE', type: 'step', color: '#38BDF8'},
  {label: 'SAVEPOINT B', type: 'savepoint', color: '#38BDF8'},
  {label: 'Step 3: ERROR', type: 'error', color: '#EF4444'},
];

/** Enterprise checkout transaction lines. */
export const ENTERPRISE_TX_LINES = [
  'BEGIN;',
  "UPDATE store_orders SET status = 'paid' WHERE order_id = 901;",
  'SAVEPOINT coupon_apply;',
  "UPDATE store_orders SET discount = 200 WHERE coupon_code = 'INVALID';",
  'ROLLBACK TO SAVEPOINT coupon_apply; -- Reverts coupon only',
  'COMMIT;',
];

/** Subtransaction data for Scene 4. */
export const SUBTRANSACTIONS = [
  {label: 'XID: 804921', type: 'main', color: '#A855F7', sub: []},
  {label: 'XID: 804921', type: 'main', color: '#A855F7', sub: [
    {label: 'SubXID: 804922', savepoint: 'sp_a', color: '#38BDF8'},
  ]},
  {label: 'XID: 804921', type: 'main', color: '#A855F7', sub: [
    {label: 'SubXID: 804922', savepoint: 'sp_a', color: '#38BDF8'},
    {label: 'SubXID: 804923', savepoint: 'sp_b', color: '#38BDF8'},
  ]},
];
