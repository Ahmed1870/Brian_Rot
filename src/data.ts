// manzooma_store_db - small datasets reused by the scenes so the numbers always agree
export const TIERS = {
  gold: {name: 'Gold', off: '15% Off', min: 10000},
  silver: {name: 'Silver', off: '10% Off', min: 5000},
  bronze: {name: 'Bronze', off: '5% Off', min: 0},
};
export const CUSTOMERS = [
  {name: 'Sara', spent: 15800, tier: 'gold'},
  {name: 'Ahmed', spent: 12500, tier: 'gold'},
  {name: 'Mona', spent: 7200, tier: 'silver'},
  {name: 'Hany', spent: 5400, tier: 'silver'},
  {name: 'Omar', spent: 3100, tier: 'bronze'},
  {name: 'Laila', spent: 800, tier: 'bronze'},
] as const;
export const ORDERS = [
  {id: 1, status: 'shipped', amount: 1200},
  {id: 2, status: 'shipped', amount: 800},
  {id: 3, status: 'cancelled', amount: 450},
  {id: 4, status: 'shipped', amount: 2100},
  {id: 5, status: 'cancelled', amount: 300},
  {id: 6, status: 'shipped', amount: 650},
];
