export const BR_AR = ['القاهرة', 'الجيزة', 'الإسكندرية', 'طنطا', 'أسوان'];
export const CATS = ['Electronics', 'Furniture', 'Appliances'];
const W1252: Record<number, string> = {0x80: '€', 0x82: '‚', 0x83: 'ƒ', 0x84: '„', 0x85: '…', 0x86: '†', 0x87: '‡', 0x88: 'ˆ', 0x89: '‰', 0x8a: 'Š', 0x8b: '‹', 0x8c: 'Œ', 0x8e: 'Ž', 0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—', 0x98: '˜', 0x99: '™', 0x9a: 'š', 0x9b: '›', 0x9c: 'œ', 0x9e: 'ž', 0x9f: 'Ÿ'};
/** what UTF-8 Arabic text looks like when read with a Western (Windows-1252) code page */
export const moj = (s: string) => Array.from(new TextEncoder().encode(s)).map((b) => (b < 0x80 || b >= 0xa0 ? String.fromCharCode(b) : W1252[b] ?? '')).join('');
const pad = (n: number) => String(n).padStart(2, '0');
export const csvRow = (f: number, j: number, year = 2026) => {
  const i = f * 120 + j;
  return {d: `${(f % 12) + 1}/${(j % 27) + 1}/${year}`, br: BR_AR[(i * 3 + (i % 7)) % 5], cat: CATS[(i * 5) % 3], sales: 10 * (60 + ((i * 7919) % 940))};
};
export const fileName = (f: number) => (f < 12 ? `Sales_2026-${pad(f + 1)}.csv` : 'Sales_2027-01.csv');
export const fileDate = (f: number) => (f < 12 ? `${f + 1}/28/2026 9:14 PM` : '1/5/2027 10:02 AM');
export const ROWS_PER_FILE = 120;
export const fmtN = (x: number) => x.toLocaleString('en-US');
