const DAY = 86400000;
export const D = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d);
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtD = (t: number) => {
  const d = new Date(t);
  return `${String(d.getUTCDate()).padStart(2, "0")}-${MON[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
};
export const dayOf = (t: number) => new Date(t).getUTCDate();
export const eomonth = (t: number, m: number) => {
  const d = new Date(t);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + m + 1, 0);
};
/** WORKDAY.INTL with weekend code 7 (Friday + Saturday) */
export const isWeekend7 = (t: number) => {
  const w = new Date(t).getUTCDay();
  return w === 5 || w === 6;
};
export const HOLIDAYS = [D(2026, 3, 22), D(2026, 3, 23), D(2026, 3, 24)];
export const workdayIntl = (start: number, days: number, hol: number[]) => {
  let t = start, c = 0;
  while (c < days) {
    t += DAY;
    if (isWeekend7(t) || hol.includes(t)) continue;
    c++;
  }
  return t;
};
export const countedDays = (start: number, days: number, hol: number[]) => {
  const out: number[] = [];
  let t = start;
  while (out.length < days) {
    t += DAY;
    if (isWeekend7(t) || hol.includes(t)) continue;
    out.push(t);
  }
  return out;
};
export const yearfrac3 = (a: number, b: number) => (b - a) / DAY / 365;
export const yearfrac0 = (a: number, b: number) => {
  const x = new Date(a), y = new Date(b);
  const d1 = Math.min(x.getUTCDate(), 30), d2 = y.getUTCDate() === 31 && d1 === 30 ? 30 : y.getUTCDate();
  return ((y.getUTCFullYear() - x.getUTCFullYear()) * 360 + (y.getUTCMonth() - x.getUTCMonth()) * 30 + (d2 - d1)) / 360;
};
export const monthsBetween = (a: number, b: number) => {
  const x = new Date(a), y = new Date(b);
  return (y.getUTCFullYear() - x.getUTCFullYear()) * 12 + (y.getUTCMonth() - x.getUTCMonth()) - (y.getUTCDate() < x.getUTCDate() ? 1 : 0);
};
export const edate = (t: number, m: number) => {
  const d = new Date(t);
  const first = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + m, 1);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + m + 1, 0)).getUTCDate();
  return first + (Math.min(d.getUTCDate(), last) - 1) * DAY;
};
export const days = (a: number, b: number) => Math.round((b - a) / DAY);
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const f2 = (n: number, d = 2) => n.toFixed(d);

export const INV = [D(2026, 2, 15), D(2026, 3, 3), D(2026, 1, 28), D(2026, 4, 19), D(2028, 2, 10)];
export const ASSETS: [number, number][] = [[D(2026, 1, 1), D(2026, 10, 1)], [D(2025, 3, 15), D(2025, 9, 15)], [D(2024, 7, 1), D(2024, 12, 31)]];
export const HIRE = [D(2021, 1, 15), D(2023, 8, 31)];
export const ASOF = D(2026, 3, 10);
export const CONTRACTS = Array.from({length: 23}, (_, i) => D(2026, 1, 5) + i * 17 * DAY);
export const bigRow = (i: number) => {
  const inv = D(2026, 1, 1) + ((i * 3) % 330) * DAY;
  return {inv, due: eomonth(inv, 1), del: workdayIntl(inv, 30, HOLIDAYS)};
};
