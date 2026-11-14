export const COMP_ID = "XL-L67-Choosing-The-Right-Chart";
export const LESSON = 67;
export const LESSONS = 76;
export const UNIT = 13;
export const UNITS = 14;
export const VOICE = "voiceover_lesson_67.mp3";
export const LOGO = "manzooma_logo.svg";
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DUR = 7200;

export const C = {
  bg: '#0F172A', panel: '#1E293B', panel2: '#162033', line: '#2B3A55', text: '#F8FAFC', dim: '#94A3B8',
  blue: '#38BDF8', green: '#10B981', amber: '#F59E0B', purple: '#A855F7', red: '#EF4444',
  xl: '#14532D', cell: '#111C31',
};

// Scene bounds (seconds, from the real mp3) and sentence end times per scene.
export const SB = [0, 39.2, 80.3, 125.5, 164.2, 202.1, 240];
export const AN: number[][] = [
  [14.23, 24.95, 39.17],
  [46.88, 52.45, 64.41, 80.29],
  [85.51, 91.48, 105.58, 125.52],
  [132.4, 139.96, 149.0, 164.22],
  [174.3, 192.85, 202.14],
  [205.26, 209.94, 222.31, 234.65],
];

// Illustrative dataset (50,000 rows, total 12,000,000 EGP = 12,000 K)
export const PRODUCTS = [
  {k: 1, n: 'Charger', cat: 'Power', price: 150, m: 0.18, sales: 3600000},
  {k: 2, n: 'Earbuds', cat: 'Audio', price: 300, m: 0.31, sales: 3900000},
  {k: 3, n: 'Power Bank', cat: 'Power', price: 240, m: 0.27, sales: 1800000},
  {k: 4, n: 'Mouse', cat: 'Accessories', price: 200, m: 0.22, sales: 1500000},
  {k: 5, n: 'Phone Case', cat: 'Accessories', price: 60, m: 0.38, sales: 600000},
  {k: 6, n: 'USB Cable', cat: 'Cables', price: 60, m: 0.15, sales: 600000},
];
export const STORES = [
  {k: 1, n: 'Nasr City', r: 'Cairo', sales: 4820000, hm: 2520000},
  {k: 2, n: 'Dokki', r: 'Giza', sales: 3150000, hm: 1620000},
  {k: 3, n: 'Smouha', r: 'Alexandria', sales: 2640000, hm: 1380000},
  {k: 4, n: 'Downtown', r: 'Mansoura', sales: 1390000, hm: 780000},
];
