// manzooma_store_db — Lesson 47 dataset

/** B-Tree node data for visualization. */
export const BTREE_NODES = {
  root: {label: 'Root', value: 50, x: 480, y: 40},
  internal: [
    {label: 'Internal', value: 25, x: 240, y: 130},
    {label: 'Internal', value: 75, x: 720, y: 130},
  ],
  leaves: [
    {label: 'Leaf', value: 10, x: 120, y: 230},
    {label: 'Leaf', value: 25, x: 240, y: 230},
    {label: 'Leaf', value: 40, x: 360, y: 230},
    {label: 'Leaf', value: 50, x: 600, y: 230},
    {label: 'Leaf', value: 75, x: 720, y: 230},
    {label: 'Leaf', value: 90, x: 840, y: 230},
  ],
};

/** JSONB document for GIN demo. */
export const JSONB_DOC = '{"name": "Wireless Mouse", "specs": {"dpi": 1600, "wireless": true}, "tags": ["gaming", "office"]}';

/** JSONB keys for inverted index. */
export const JSONB_KEYS = [
  {key: 'name', value: 'Wireless Mouse'},
  {key: 'specs.dpi', value: '1600'},
  {key: 'specs.wireless', value: 'true'},
  {key: 'tags[0]', value: 'gaming'},
  {key: 'tags[1]', value: 'office'},
];

/** Index types comparison. */
export const INDEX_TYPES = [
  {type: 'B-Tree', desc: 'ranges, equality, sorting', color: '#38BDF8', ops: '< <= = >= >'},
  {type: 'Hash', desc: 'exact equality only', color: '#38BDF8', ops: '='},
  {type: 'GIN', desc: 'arrays, JSONB, full-text', color: '#F59E0B', ops: '@> ?'},
  {type: 'GiST', desc: 'spatial, ranges, overlaps', color: '#A855F7', ops: '&& << >>'},
];

/** Enterprise index queries. */
export const ENTERPRISE_INDEXES = [
  {type: 'B-Tree', target: 'unit_price', desc: 'price range queries', color: '#38BDF8'},
  {type: 'GIN', target: 'specs_jsonb', desc: 'JSONB containment', color: '#F59E0B'},
  {type: 'GiST', target: 'delivery_point', desc: 'GIS spatial search', color: '#A855F7'},
];
