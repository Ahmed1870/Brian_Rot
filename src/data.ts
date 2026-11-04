// manzooma_store_db - small datasets reused by the scenes so the numbers always agree
export const PHONES = [
  {v: '01012345678', note: 'valid'},
  {v: '0101234567', note: 'too short'},
  {v: '010123456789', note: 'too long'},
];
export const SKUS = [
  {sku: 'ELEC-2026-99', cat: 'ELE'},
  {sku: 'HOME-2025-14', cat: 'HOM'},
  {sku: 'TOYS-2026-07', cat: 'TOY'},
];
export const NAMES: {first: string; last: string | null}[] = [
  {first: 'Ahmed', last: 'Hassan'},
  {first: 'Mona', last: null},
];
export const EMAILS = ['ali@old-domain.com', 'sara@old-domain.com', 'omar@old-domain.com', 'hany@old-domain.com'];
