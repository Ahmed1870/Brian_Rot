// manzooma_store_db — Lesson 63 dataset

/** tsvector tokenization example. */
export const TOKENIZATION_EXAMPLE = {
  raw: 'The fast HDMI cable supports 4K resolution',
  lexemes: [
    {word: 'fast', pos: 2},
    {word: 'hdmi', pos: 3},
    {word: 'cable', pos: 4},
    {word: 'support', pos: 5},
    {word: '4k', pos: 6},
    {word: 'resolut', pos: 7},
  ],
  stopWords: ['the', 'a', 'an', 'is', 'of'],
};

/** tsquery example. */
export const TSQUERY_EXAMPLE = "'hdmi' & 'fast'";

/** Enterprise FTS code for Scene 5. */
export const ENTERPRISE_FTS_CODE = [
  "ALTER TABLE store_products ADD COLUMN search_vector tsvector",
  "  GENERATED ALWAYS AS",
  "  (to_tsvector('english', product_name || ' ' || description))",
  "  STORED;",
  "CREATE INDEX idx_fts_products",
  "  ON store_products USING GIN (search_vector);",
];

/** Ranking query for Scene 3. */
export const RANKING_QUERY = [
  'SELECT title,',
  '  ts_rank(search_vector, query) AS rank,',
  "  ts_headline('english', description, query) AS snippet",
  "FROM store_products, to_tsquery('english', 'pro & max') query",
  'WHERE search_vector @@ query',
  'ORDER BY rank DESC;',
];

/** GIN index benchmark data. */
export const FTS_BENCHMARK = {
  likeMs: 4200,
  ftsMs: 0.5,
};
