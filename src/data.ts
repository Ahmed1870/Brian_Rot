// manzooma_store_db - one small dataset reused by every scene so the numbers always agree
export const CUSTOMERS = [
  {id: 101, name: 'Ali'},
  {id: 102, name: 'Mona'},
  {id: 105, name: 'Omar'},
  {id: 110, name: 'Sara'},
  {id: 112, name: 'Hany'},
  {id: 120, name: 'Dina'},
  {id: 140, name: 'Laila'},
  {id: 150, name: 'Karim'},
];
/** customer_id values returned by the inner subquery (the dynamic 1D array). */
export const SET_IDS = [101, 105, 112, 140];

export const PRODUCTS = [
  {id: 10, name: 'Mouse'},
  {id: 20, name: 'Cable'},
  {id: 30, name: 'Keyboard'},
  {id: 40, name: 'Monitor'},
  {id: 50, name: 'Webcam'},
];
/** promo_items.product_id - contains one NULL (the trap). */
export const PROMO: (number | null)[] = [10, 20, null];

export const PRICE_SET = [100, 200, 300];
export const PRICES = [
  {n: 'Cable', p: 80},
  {n: 'Mouse', p: 150},
  {n: 'Keyboard', p: 250},
  {n: 'Webcam', p: 320},
  {n: 'Monitor', p: 380},
];
