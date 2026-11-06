// manzooma_store_db.employees - one small org chart reused by every scene so the numbers always agree
export type Emp = {id: number; name: string; role: string; lvl: number; mgr: number | null; x: number};
export const EMPS: Emp[] = [
  {id: 1, name: 'Mona', role: 'CEO', lvl: 0, mgr: null, x: 1060},
  {id: 2, name: 'Ahmed', role: 'CTO', lvl: 1, mgr: 1, x: 660},
  {id: 3, name: 'Sara', role: 'CFO', lvl: 1, mgr: 1, x: 1460},
  {id: 4, name: 'Omar', role: 'Dev', lvl: 2, mgr: 2, x: 460},
  {id: 5, name: 'Hany', role: 'Dev', lvl: 2, mgr: 2, x: 860},
  {id: 6, name: 'Laila', role: 'Acct', lvl: 2, mgr: 3, x: 1460},
  {id: 7, name: 'Karim', role: 'Jr', lvl: 3, mgr: 4, x: 460},
  {id: 8, name: 'Dina', role: 'Jr', lvl: 3, mgr: 5, x: 860},
];
export const byId = (id: number) => EMPS.find((e) => e.id === id)!;
export const pathOf = (e: Emp): string[] => (e.mgr === null ? [e.name] : [...pathOf(byId(e.mgr)), e.name]);
/** rows per recursion level: [1], [2,3], [4,5,6], [7,8] */
export const LEVELS = [0, 1, 2, 3].map((l) => EMPS.filter((e) => e.lvl === l));
