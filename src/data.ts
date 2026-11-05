// manzooma_store_db — Lesson 46 dataset

/** Regional sales data for monthly MatView dashboard. */
export const REGIONAL_SALES: {region_id: number; region_name: string; month: string; revenue: number}[] = [
  {region_id: 1, region_name: 'Cairo', month: '2024-01', revenue: 450000},
  {region_id: 2, region_name: 'Alexandria', month: '2024-01', revenue: 320000},
  {region_id: 3, region_name: 'Giza', month: '2024-01', revenue: 580000},
  {region_id: 1, region_name: 'Cairo', month: '2024-02', revenue: 520000},
  {region_id: 2, region_name: 'Alexandria', month: '2024-02', revenue: 380000},
  {region_id: 3, region_name: 'Giza', month: '2024-02', revenue: 610000},
  {region_id: 1, region_name: 'Cairo', month: '2024-03', revenue: 610000},
  {region_id: 2, region_name: 'Alexandria', month: '2024-03', revenue: 420000},
];

/** Benchmark cost data (Scene 4). */
export const COST_BENCHMARK = {
  beforeCost: 45210,
  afterCost: 8.42,
};

/** Pipeline layers (Scene 1). */
export const PIPELINE_LAYERS = [
  {layer: 1, label: 'Raw Tables', desc: '10M+ rows · star schema JOINs', color: '#EF4444'},
  {layer: 2, label: 'Pre-Aggregation', desc: 'SUM · GROUP BY · indexed', color: '#38BDF8'},
  {layer: 3, label: 'MatView Snapshot', desc: 'instant read · 0 JOINs', color: '#10B981'},
];
