// manzooma_store_db - small datasets reused by the scenes so the numbers always agree (values in thousands)
export const BRANCHES = ['Cairo', 'Alex', 'Giza'];
export const QS = ['Q1', 'Q2', 'Q3', 'Q4'];
export const SALES: number[][] = [
  [120, 150, 180, 210],
  [90, 110, 95, 140],
  [70, 85, 100, 125],
];
/** vertical (long) form: one row per branch + quarter */
export const LONG = BRANCHES.flatMap((b, bi) => QS.map((q, qi) => ({branch: b, q, qi, bi, amount: SALES[bi][qi]})));
export const Q_TOTAL = QS.map((_, qi) => SALES.reduce((a, r) => a + r[qi], 0));
export const B_TOTAL = SALES.map((r) => r.reduce((a, b) => a + b, 0));
export const XTAB = [
  {branch: 'Cairo', elec: 500, cloth: 300},
  {branch: 'Alex', elec: 380, cloth: 260},
  {branch: 'Giza', elec: 420, cloth: 190},
];
