// Manzooma Store V2 Capstone — Lesson 68 dataset (Portfolio & Career Readiness)

/** GitHub portfolio repository structure. */
export const GITHUB_REPO = {
  name: 'Manzooma-Store-V2-Capstone',
  owner: 'ahmed-sql-analyst',
  url: 'github.com/ahmed-sql-analyst/Manzooma-Store-V2-Capstone',
  stars: 142,
  forks: 38,
  description: 'Enterprise PostgreSQL 16 capstone: 15-table schema, analytics pipeline, performance tuning, security & backup',
  folders: [
    {name: '/schema', desc: 'DDL scripts · constraints · ERD', files: 8, color: 'blue'},
    {name: '/queries', desc: 'CTEs · window functions · materialized views', files: 12, color: 'purple'},
    {name: '/benchmarks', desc: 'Performance tuning results · GIN/B-Tree', files: 6, color: 'green'},
    {name: '/security', desc: 'Roles · RLS · pg_dump scripts', files: 5, color: 'amber'},
    {name: '/docs', desc: 'README.md · ERD diagrams · architecture', files: 4, color: 'blue'},
  ],
  readme: {
    title: 'Manzooma Store V2 — Enterprise SQL Capstone',
    sections: ['Business Problem', 'Data Architecture (ERD)', 'DDL Schema (15 tables)', 'Analytics Pipeline', 'Performance Benchmarks (10min → 0.4s)', 'Security & Backup Strategy', 'Career Readiness Notes'],
  },
};

/** Technical interview skills evaluated. */
export const INTERVIEW_SKILLS = [
  {skill: 'Performance Tuning', detail: 'shared_buffers · work_mem · EXPLAIN ANALYZE', color: 'blue', mastery: 95},
  {skill: 'Window Functions', detail: 'LAG · LEAD · NTILE · SUM OVER', color: 'purple', mastery: 92},
  {skill: 'CTE Optimization', detail: 'Multi-stage CTEs · Materialized Views', color: 'green', mastery: 90},
  {skill: 'Index Selection', detail: 'B-Tree vs GIN vs GiST trade-offs', color: 'amber', mastery: 88},
  {skill: 'Normalization', detail: '1NF · 2NF · 3NF · ERD design', color: 'blue', mastery: 94},
  {skill: 'Security & RLS', detail: 'GRANT/REVOKE · Row-Level Security', color: 'purple', mastery: 87},
];

/** Think Aloud live coding steps. */
export const THINK_ALOUD_STEPS = [
  {step: 1, title: 'Clarify Requirements', desc: 'Understand the business question', color: 'amber', icon: '?'},
  {step: 2, title: 'Structure CTEs', desc: 'Break into modular stages', color: 'blue', icon: 'CTE'},
  {step: 3, title: 'Write Clean Code', desc: 'Readable · commented · typed', color: 'green', icon: '</>'},
  {step: 4, title: 'Discuss Complexity', desc: 'Time · memory · index choice', color: 'purple', icon: 'O(n)'},
  {step: 5, title: 'Optimize Indexes', desc: 'B-Tree vs GIN · avoid Seq Scan', color: 'green', icon: '⚡'},
];

/** Live coding solution query. */
export const LIVE_CODING_QUERY = [
  '-- Interview Question: Top 5 products by monthly revenue growth',
  'WITH monthly_sales AS (',
  '  SELECT date_trunc(\'month\', o.order_date) AS month,',
  '         p.product_name, SUM(oi.quantity * oi.unit_price) AS revenue',
  '  FROM store_orders o',
  '  JOIN store_order_items oi ON oi.order_id = o.order_id',
  '  JOIN store_products p ON p.product_id = oi.product_id',
  '  GROUP BY 1, 2',
  '),',
  'growth AS (',
  '  SELECT product_name, month, revenue,',
  '         LAG(revenue) OVER (PARTITION BY product_name ORDER BY month) AS prev_rev',
  '  FROM monthly_sales',
  ')',
  'SELECT product_name, month, revenue,',
  '       ROUND((revenue - prev_rev) / NULLIF(prev_rev, 0) * 100, 1) AS growth_pct',
  'FROM growth',
  'WHERE prev_rev IS NOT NULL',
  'ORDER BY growth_pct DESC',
  'LIMIT 5;',
];

/** Senior evaluation radar criteria. */
export const EVALUATION_CRITERIA = [
  {criterion: 'Scalable Queries', score: 95, color: 'green', detail: 'Index Scan · no Seq Scan'},
  {criterion: 'Memory Safety', score: 90, color: 'blue', detail: 'work_mem · no disk spill'},
  {criterion: 'FK Integrity', score: 92, color: 'purple', detail: 'ON DELETE RESTRICT/CASCADE'},
  {criterion: 'Index Awareness', score: 88, color: 'amber', detail: 'B-Tree vs GIN vs GiST'},
  {criterion: 'Architectural Thinking', score: 94, color: 'green', detail: '3NF · ERD · schema design'},
];

/** Career readiness deployment stats. */
export const CAREER_READINESS = {
  gitPushCmd: 'git push origin main',
  repoFiles: 35,
  repoCommits: 68,
  querySpeedup: '10min → 0.4s',
  speedupFactor: '1500×',
  roles: ['SQL Data Analyst', 'Database Engineer', 'Data Engineer', 'BI Developer'],
  readinessPct: 100,
};

/** Course completion stats for graduation. */
export const COURSE_STATS = {
  totalLessons: 68,
  totalModules: 16,
  totalHours: 45,
  totalQueries: 850,
  totalExercises: 320,
  certification: 'SQL From Zero to Professional — Certified',
  completionPct: 100,
};
