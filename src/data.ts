// manzooma_store_db — Lesson 64 dataset (PostgreSQL Extensions)

/** pg_trgm trigram decomposition example: word "Manzooma" → trigrams. */
export const TRIGRAM_EXAMPLE = {
  raw: 'Manzooma',
  trigrams: ['  m', ' ma', 'man', 'anz', 'nzo', 'zoo', 'oom', 'oma', 'ma '],
  fuzzyQuery: 'Manzoma',
  similarity: 0.778,
};

/** pgcrypto example: crypt() with Blowfish salt. */
export const PGCRYPTO_EXAMPLE = {
  rawPassword: 'Pass123',
  salt: '$2a$06$',
  hashStart: '$2a$06$wH9QvKp3xZ8mJ2cT1nB5oO',
  fullHashLen: 60,
  algo: 'bf (Blowfish)',
};

/** PostGIS spatial example. */
export const POSTGIS_EXAMPLE = {
  branchA: {name: 'Cairo Branch', x: 31.2, y: 30.0},
  branchB: {name: 'Giza Branch', x: 31.3, y: 30.1},
  distanceKm: 13.42,
  customer: {x: 31.21, y: 30.02, name: 'Customer #4821'},
};

/** pg_extension system catalog entries. */
export const PG_EXTENSION_CATALOG = [
  {extname: 'pg_trgm', extversion: '1.7', extrelocatable: true, color: 'blue'},
  {extname: 'pgcrypto', extversion: '1.3', extrelocatable: false, color: 'purple'},
  {extname: 'postgis', extversion: '3.4', extrelocatable: false, color: 'green'},
];

/** Enterprise capstone code for Scene 5 — manzooma_store_db. */
export const ENTERPRISE_EXTENSIONS_CODE = [
  "-- Step 1: enable advanced extensions",
  "CREATE EXTENSION IF NOT EXISTS pg_trgm;",
  "CREATE EXTENSION IF NOT EXISTS pgcrypto;",
  "CREATE EXTENSION IF NOT EXISTS postgis;",
  "",
  "-- Step 2: secure customer passwords (pgcrypto)",
  "UPDATE store_customers",
  "  SET password_hash = crypt('Pass123', gen_salt('bf'));",
  "",
  "-- Step 3: nearest branch routing (PostGIS)",
  "SELECT store_name, location <-> ST_MakePoint(31.2, 30.0) AS km",
  "  FROM store_branches",
  "  ORDER BY km ASC",
  "  LIMIT 1;",
];

/** Extension invocation queries for Scene 3. */
export const EXTENSION_QUERIES = [
  "CREATE EXTENSION IF NOT EXISTS pg_trgm;",
  "CREATE EXTENSION IF NOT EXISTS pgcrypto;",
  "CREATE EXTENSION IF NOT EXISTS postgis;",
  "",
  "-- Fuzzy search via pg_trgm % operator",
  "SELECT product_name FROM store_products",
  "  WHERE product_name % 'Manzoma';",
  "",
  "-- Blowfish password hashing via pgcrypto",
  "SELECT crypt('Pass123', gen_salt('bf'));",
  "",
  "-- Spatial distance via PostGIS",
  "SELECT ST_Distance(",
  "  ST_MakePoint(31.2, 30.0),",
  "  ST_MakePoint(31.3, 30.1)",
  ") AS deg_distance;",
];

/** Engine internals query for Scene 4 — pg_extension catalog & GiST/GIN. */
export const ENGINE_INTERNALS_CODE = [
  "-- System catalog: registered extensions",
  "SELECT extname, extversion, extrelocatable",
  "  FROM pg_extension ORDER BY extname;",
  "",
  "-- Accelerate fuzzy search via GIN trigram index",
  "CREATE INDEX idx_trgm_products",
  "  ON store_products USING GIN (product_name gin_trgm_ops);",
  "",
  "-- Accelerate spatial routing via GiST",
  "CREATE INDEX idx_gist_branches",
  "  ON store_branches USING GIST (location);",
];

/** Benchmark: extensions enabled vs not. */
export const EXTENSIONS_BENCHMARK = {
  beforeMs: 4800,
  afterMs: 0.6,
};
