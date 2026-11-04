// manzooma_store_db — Lesson 26 dataset
// All emails, names, and patterns are consistent across scenes.

/** Chaotic email inputs that flow through the case-normalization gates in Scene 1. */
export const CHAOTIC_EMAILS: string[] = [
  'jOhN.dOe@mAnZoOmA.cOm',
  'SaRa.MaLiK@ManZooma.COM',
  'ahmed1870@GmAiL.CoM',
  'KaRiM.Wael@manzooma.org',
];

/** Result of applying each function to the chaotic email (precomputed for visual consistency). */
export const CASE_RESULTS = {
  raw: 'jOhN.dOe@mAnZoOmA.cOm',
  lower: 'john.doe@manzooma.com',
  upper: 'JOHN.DOE@MANZOOMA.COM',
  initcap: 'John.Doe@Manzooma.Com',
};

/** Customer names used in LIKE / ILIKE matching (Scene 2). */
export const NAMES: {id: number; name: string; email: string}[] = [
  {id: 1, name: 'ahmed', email: 'ahmed@manzooma.com'},
  {id: 2, name: 'Ahmed', email: 'Ahmed@Manzooma.com'},
  {id: 3, name: 'sara', email: 'sara@gmail.com'},
  {id: 4, name: 'Sara', email: 'Sara@Manzooma.com'},
  {id: 5, name: 'omar', email: 'omar@manzooma.com'},
  {id: 6, name: 'Laila', email: 'Laila@Gmail.com'},
];

/** Emails evaluated by the regex mesh filter (Scene 3). */
export const EMAILS: {addr: string; valid: boolean}[] = [
  {addr: 'john.doe@manzooma.com', valid: true},
  {addr: 'ahmed1870@gmail.com', valid: true},
  {addr: 'sara@@manzooma.com', valid: false},
  {addr: 'karim.wael@', valid: false},
  {addr: 'laila.malik@manzooma.org', valid: true},
  {addr: 'no-domain', valid: false},
  {addr: 'hany@manzooma.co', valid: true},
  {addr: '@nodomain.com', valid: false},
];

/** Email regex pattern shown on screen (PostgreSQL POSIX style, case-insensitive). */
export const EMAIL_REGEX = "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$";

/** Enterprise customers (Scene 5) — names that get INITCAP(LOWER()) applied. */
export const ENTERPRISE_CUSTOMERS: {raw: string; clean: string; email: string; domain: string}[] = [
  {raw: 'aHMEd', clean: 'Ahmed', email: 'AHMED@manzooma.com', domain: 'manzooma.com'},
  {raw: 'saRA', clean: 'Sara', email: 'sara@manzooma.com', domain: 'manzooma.com'},
  {raw: 'OMAR', clean: 'Omar', email: 'Omar@Manzooma.com', domain: 'manzooma.com'},
  {raw: 'lAiLa', clean: 'Laila', email: 'laila@manzooma.com', domain: 'manzooma.com'},
  {raw: 'kArIm', clean: 'Karim', email: 'karim@gmail.com', domain: 'gmail.com'},
  {raw: 'hAnY', clean: 'Hany', email: 'HANY@manzooma.com', domain: 'manzooma.com'},
];

/** Performance benchmark numbers (Scene 4). */
export const PERF = {
  rowsScanned: 1000000,
  fullScanMs: 842.7,
  indexSeekMs: 0.18,
};
