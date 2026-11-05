// manzooma_store_db — Lesson 44 dataset

/** Products table data for updatable views demos. */
export const PRODUCTS: {id: number; name: string; price: number; status: string}[] = [
  {id: 101, name: 'Wireless Mouse', price: 120, status: 'active'},
  {id: 102, name: 'USB Cable', price: 45, status: 'active'},
  {id: 103, name: 'Mechanical Keyboard', price: 280, status: 'active'},
  {id: 104, name: 'Old Monitor', price: 90, status: 'discontinued'},
  {id: 105, name: 'Webcam HD', price: 150, status: 'active'},
  {id: 106, name: 'Broken Speaker', price: 0, status: 'discontinued'},
  {id: 107, name: 'Dock Station', price: 320, status: 'active'},
  {id: 108, name: 'Legacy Printer', price: 60, status: 'discontinued'},
];

/** Inventory products for Scene 5 enterprise dashboard. */
export const INVENTORY: {id: number; name: string; unit_price: number; status: string}[] = [
  {id: 201, name: 'Premium Headset', unit_price: 450, status: 'available'},
  {id: 202, name: 'Bluetooth Speaker', unit_price: 180, status: 'available'},
  {id: 203, name: 'Gaming Mouse', unit_price: 220, status: 'available'},
  {id: 204, name: 'USB Hub', unit_price: 65, status: 'available'},
  {id: 205, name: 'Discontinued Webcam', unit_price: 0, status: 'unavailable'},
];

/** Auto-updatable rules checklist (Scene 2). */
export const AUTO_UPDATABLE_RULES: {rule: string; passed: boolean}[] = [
  {rule: 'Single base table in FROM', passed: true},
  {rule: 'No GROUP BY / HAVING', passed: true},
  {rule: 'No DISTINCT / LIMIT / OFFSET', passed: true},
  {rule: 'No aggregate functions', passed: true},
  {rule: 'No window functions', passed: true},
  {rule: 'No UNION / INTERSECT / EXCEPT', passed: true},
];
