export const PRODUCTS = [
  {id: 1, name: 'Laptop', cat: 'Hardware'},
  {id: 2, name: 'Mouse', cat: 'Accessories'},
  {id: 3, name: 'Keyboard', cat: 'Accessories'},
  {id: 4, name: 'Monitor', cat: 'Hardware'},
];
export const SALES = [
  {order: 1001, pid: 1, amt: 30000},
  {order: 1002, pid: 2, amt: 1250},
  {order: 1003, pid: 3, amt: 1800},
  {order: 1004, pid: 4, amt: 4500},
];
/** Filter context on Products: null = no filter on that column. */
export type Ctx = {prods: number[] | null; cats: string[] | null};
export const NOFILTER: Ctx = {prods: null, cats: null};
const prod = (id: number) => PRODUCTS.filter((p) => p.id === id)[0];
const inCtx = (id: number, c: Ctx): boolean => {
  const p = prod(id);
  return (!c.prods || c.prods.includes(p.id)) && (!c.cats || c.cats.includes(p.cat));
};
export const total = (c: Ctx): number => SALES.filter((s) => inCtx(s.pid, c)).reduce((a, s) => a + s.amt, 0);
export const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const pct = (n: number, d: number): string => (d === 0 ? '' : ((n / d) * 100).toFixed(2) + '%');
export const above = (limit: number): number => SALES.filter((s) => s.amt > limit).reduce((a, s) => a + s.amt, 0);

/** Row context of a visual: slicer filters AND the row's Product (and Category when the visual shows it). */
export const rowCtx = (slicer: Ctx, id: number, withCat: boolean): Ctx => {
  const p = prod(id);
  const cats = withCat ? (slicer.cats === null || slicer.cats.includes(p.cat) ? [p.cat] : []) : slicer.cats;
  const prods = slicer.prods === null || slicer.prods.includes(id) ? [id] : [];
  return {prods, cats};
};
// ALL(Products[Product]) / REMOVEFILTERS(Products[Product]): drop the Product filter, keep Category.
export const denomAll = (c: Ctx): number => total({prods: null, cats: c.cats});
// ALLEXCEPT(Products, Products[Category]): drop every Products filter except Category.
export const denomCat = (c: Ctx): number => total({prods: null, cats: c.cats});
export const visible = (slicer: Ctx): number[] => PRODUCTS.filter((p) => inCtx(p.id, slicer)).map((p) => p.id);
export const nameOf = (id: number): string => prod(id).name;
export const catOf = (id: number): string => prod(id).cat;
