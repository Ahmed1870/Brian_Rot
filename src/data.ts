import { C } from './theme';

export type Emp = { n: string; d: number; s: number };
/** 10 employees in their original (mixed) table order */
export const EMP: Emp[] = [
  { n: 'أحمد', d: 10, s: 9000 },
  { n: 'خالد', d: 20, s: 8000 },
  { n: 'عمر', d: 30, s: 7000 },
  { n: 'سارة', d: 10, s: 6000 },
  { n: 'منى', d: 20, s: 4000 },
  { n: 'هبة', d: 30, s: 6500 },
  { n: 'ليلى', d: 10, s: 5000 },
  { n: 'يوسف', d: 20, s: 6000 },
  { n: 'نور', d: 30, s: 4500 },
  { n: 'كريم', d: 10, s: 8000 },
];
export const DEPT_COLOR: Record<number, string> = { 10: C.purple, 20: C.client, 30: C.opt };
export const DEPTS = [10, 20, 30];
export const sum = (d: number) => EMP.filter((e) => e.d === d).reduce((a, e) => a + e.s, 0);
export const avg = (d: number) => sum(d) / EMP.filter((e) => e.d === d).length;
export const ALL_AVG = EMP.reduce((a, e) => a + e.s, 0) / EMP.length;
export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
/** index of each employee after grouping by department (stable) */
export const GROUPED: number[] = (() => {
  const out: number[] = new Array(EMP.length).fill(0);
  let k = 0;
  for (const d of DEPTS) EMP.forEach((e, i) => { if (e.d === d) out[i] = k++; });
  return out;
})();
