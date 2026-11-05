// manzooma_store_db — Lesson 45 dataset

/** Annual sales summary data for materialized view demos. */
export const ANNUAL_SALES: {store_id: number; sales_year: string; total_revenue: number}[] = [
  {store_id: 1, sales_year: '2023', total_revenue: 1250000},
  {store_id: 2, sales_year: '2023', total_revenue: 980000},
  {store_id: 3, sales_year: '2023', total_revenue: 1620000},
  {store_id: 4, sales_year: '2023', total_revenue: 740000},
  {store_id: 5, sales_year: '2023', total_revenue: 2110000},
  {store_id: 1, sales_year: '2024', total_revenue: 1480000},
  {store_id: 2, sales_year: '2024', total_revenue: 1120000},
  {store_id: 3, sales_year: '2024', total_revenue: 1950000},
];

/** Benchmark timing data (Scene 3). */
export const BENCHMARK = {
  beforeMs: 252000, // 4.2 minutes in ms
  afterMs: 2, // 0.002 seconds in ms
  beforeLabel: '4.2 Minutes',
  afterLabel: '0.002 Seconds',
};

/** Store names for Scene 5 dashboard. */
export const STORE_NAMES: {id: number; name: string; region: string}[] = [
  {id: 1, name: 'Cairo Downtown', region: 'Cairo'},
  {id: 2, name: 'Alexandria Bay', region: 'Alexandria'},
  {id: 3, name: 'Giza Plaza', region: 'Giza'},
  {id: 4, name: 'Luxor Temple', region: 'Luxor'},
  {id: 5, name: 'Aswan Nile', region: 'Aswan'},
];
