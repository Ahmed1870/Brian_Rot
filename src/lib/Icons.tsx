import React from 'react';

// أيقونات SVG مرسومة يدوياً (ليست نسخاً من أيقونات Microsoft) - 32×32
const g = '#605E5C';
const y = '#F2C811';
const b = '#0F6CBD';
const gn = '#107C10';
const r = '#C4314B';
const sw = {strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

const Tbl = (
  <>
    <rect x="4" y="6" width="24" height="20" rx="2" fill="#fff" stroke={g} {...sw} />
    <path d="M4 12h24M4 18h24M12 6v20M20 6v20" stroke={g} strokeWidth="1.1" />
  </>
);
const Cyl = (
  <>
    <ellipse cx="14" cy="8" rx="9" ry="3.5" fill="#fff" stroke={g} {...sw} />
    <path d="M5 8v14c0 2 4 3.5 9 3.5s9-1.5 9-3.5V8" fill="#fff" stroke={g} {...sw} />
  </>
);

const ICONS: Record<string, React.ReactNode> = {
  closeApply: (<>{Tbl}<circle cx="23" cy="23" r="7" fill={y} /><path d="M19.5 23l2.5 2.5 4.5-5" stroke="#201F1E" {...sw} fill="none" /></>),
  newSource: (<>{Cyl}<circle cx="23" cy="23" r="6.5" fill={gn} /><path d="M23 19.5v7M19.5 23h7" stroke="#fff" {...sw} /></>),
  recent: (<>{Cyl}<circle cx="23" cy="23" r="6.5" fill="#fff" stroke={b} {...sw} /><path d="M23 20v3.5l2.5 1.5" stroke={b} {...sw} fill="none" /></>),
  enterData: (<>{Tbl}<path d="M17 28l2-6 8-8 4 4-8 8z" fill={y} stroke={g} {...sw} /></>),
  dsSettings: (<>{Cyl}<circle cx="23" cy="23" r="5" fill="#fff" stroke={g} {...sw} /><circle cx="23" cy="23" r="1.6" fill={g} /></>),
  params: (<><path d="M5 10h22M5 16h22M5 22h22" stroke={g} {...sw} /><circle cx="11" cy="10" r="3" fill={y} stroke={g} {...sw} /><circle cx="21" cy="16" r="3" fill={y} stroke={g} {...sw} /><circle cx="13" cy="22" r="3" fill={y} stroke={g} {...sw} /></>),
  refresh: (<>{Tbl}<path d="M25 18a7 7 0 1 1-2-5" stroke={gn} {...sw} fill="none" /><path d="M24 8v5h-5" stroke={gn} {...sw} fill="none" /></>),
  props: (<><rect x="7" y="4" width="18" height="24" rx="2" fill="#fff" stroke={g} {...sw} /><path d="M11 10h10M11 15h10M11 20h6" stroke={g} {...sw} /></>),
  adv: (<><rect x="4" y="6" width="24" height="20" rx="2" fill="#fff" stroke={g} {...sw} /><path d="M12 12l-4 4 4 4M20 12l4 4-4 4" stroke={b} {...sw} fill="none" /></>),
  manage: (<>{Tbl}<path d="M10 27h12" stroke={b} {...sw} /></>),
  chooseCols: (<><rect x="4" y="5" width="7" height="22" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="13" y="5" width="7" height="22" rx="1.5" fill={y} stroke={g} {...sw} /><rect x="22" y="5" width="7" height="22" rx="1.5" fill="#fff" stroke={g} {...sw} /><circle cx="22" cy="24" r="6" fill={gn} /><path d="M19 24l2.2 2.2L25.5 21" stroke="#fff" {...sw} fill="none" /></>),
  removeCols: (<><rect x="4" y="5" width="7" height="22" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="13" y="5" width="7" height="22" rx="1.5" fill="#FCE4E8" stroke={r} {...sw} /><rect x="22" y="5" width="7" height="22" rx="1.5" fill="#fff" stroke={g} {...sw} /><circle cx="22" cy="24" r="6" fill={r} /><path d="M19.5 21.5l5 5M24.5 21.5l-5 5" stroke="#fff" {...sw} /></>),
  keepRows: (<><rect x="4" y="5" width="24" height="6" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="4" y="13" width="24" height="6" rx="1.5" fill={y} stroke={g} {...sw} /><rect x="4" y="21" width="24" height="6" rx="1.5" fill="#fff" stroke={g} {...sw} /><circle cx="24" cy="24" r="6" fill={gn} /><path d="M21 24l2.2 2.2L27 21" stroke="#fff" {...sw} fill="none" /></>),
  removeRows: (<><rect x="4" y="5" width="24" height="6" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="4" y="13" width="24" height="6" rx="1.5" fill="#FCE4E8" stroke={r} {...sw} /><rect x="4" y="21" width="24" height="6" rx="1.5" fill="#fff" stroke={g} {...sw} /><circle cx="24" cy="24" r="6" fill={r} /><path d="M21.5 21.5l5 5M26.5 21.5l-5 5" stroke="#fff" {...sw} /></>),
  sortAZ: (<><path d="M8 5v22M4 23l4 4 4-4" stroke={b} {...sw} fill="none" /><text x="15" y="14" fontSize="10" fontWeight="700" fill={g}>A</text><text x="15" y="27" fontSize="10" fontWeight="700" fill={g}>Z</text></>),
  sortZA: (<><path d="M8 5v22M4 23l4 4 4-4" stroke={b} {...sw} fill="none" /><text x="15" y="14" fontSize="10" fontWeight="700" fill={g}>Z</text><text x="15" y="27" fontSize="10" fontWeight="700" fill={g}>A</text></>),
  split: (<><rect x="4" y="6" width="10" height="20" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="18" y="6" width="10" height="20" rx="1.5" fill="#fff" stroke={g} {...sw} /><path d="M14 16h4" stroke={b} {...sw} /></>),
  groupBy: (<>{Tbl}<text x="11" y="25" fontSize="12" fontWeight="700" fill={b}>Σ</text></>),
  dtype: (<><rect x="3" y="8" width="26" height="16" rx="2" fill="#fff" stroke={g} {...sw} /><text x="6" y="20" fontSize="9" fontWeight="700" fill={b}>ABC</text></>),
  firstRow: (<>{Tbl}<rect x="4" y="6" width="24" height="6" fill={y} opacity=".7" /><path d="M16 22v-6M13 18l3-3 3 3" stroke={b} {...sw} fill="none" /></>),
  replace: (<><text x="3" y="14" fontSize="10" fontWeight="700" fill={g}>1</text><text x="19" y="27" fontSize="10" fontWeight="700" fill={b}>2</text><path d="M12 11h12l-3-3M20 21H8l3 3" stroke={g} {...sw} fill="none" /></>),
  merge: (<><rect x="3" y="5" width="12" height="10" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="3" y="17" width="12" height="10" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="19" y="10" width="10" height="12" rx="1.5" fill={y} stroke={g} {...sw} /><path d="M15 10l4 6-4 6" stroke={b} {...sw} fill="none" /></>),
  append: (<><rect x="4" y="4" width="24" height="9" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="4" y="19" width="24" height="9" rx="1.5" fill={y} stroke={g} {...sw} /><path d="M16 14v4" stroke={b} {...sw} /></>),
  combine: (<><rect x="4" y="5" width="14" height="10" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="10" y="12" width="14" height="10" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="14" y="19" width="14" height="9" rx="1.5" fill={y} stroke={g} {...sw} /></>),
  textA: (<><rect x="4" y="6" width="24" height="20" rx="3" fill="#fff" stroke={g} {...sw} /><path d="M9 12h14M9 17h14M9 22h8" stroke={b} {...sw} /></>),
  vision: (<><path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z" fill="#fff" stroke={g} {...sw} /><circle cx="16" cy="16" r="4" fill={b} /></>),
  azure: (<><path d="M6 24l7-16 4 9 3-4 6 11z" fill={b} opacity=".85" /></>),
  pqLogo: (<><rect x="3" y="3" width="26" height="26" rx="5" fill={y} /><path d="M9 10h8a4 4 0 0 1 0 8H9z" fill="#201F1E" /><path d="M18 19l6 6" stroke="#201F1E" strokeWidth="3" strokeLinecap="round" /></>),
  measure: (<><rect x="6" y="3" width="20" height="26" rx="2.5" fill="#fff" stroke={g} {...sw} /><rect x="10" y="7" width="12" height="6" fill={y} stroke={g} strokeWidth="1" /><path d="M11 18h2M19 18h2M11 23h2M19 23h2M15 18h2M15 23h2" stroke={g} {...sw} /></>),
  newTable: (<>{Tbl}<circle cx="24" cy="24" r="6.5" fill={gn} /><path d="M24 20.5v7M20.5 24h7" stroke="#fff" {...sw} /></>),
  newColumn: (<><rect x="4" y="5" width="7" height="22" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="13" y="5" width="7" height="22" rx="1.5" fill="#fff" stroke={g} {...sw} /><circle cx="25" cy="22" r="6" fill={gn} /><path d="M25 19v6M22 22h6" stroke="#fff" {...sw} /></>),
  quick: (<><rect x="6" y="3" width="20" height="26" rx="2.5" fill="#fff" stroke={g} {...sw} /><path d="M17 8l-5 9h4l-1 7 6-10h-4z" fill={y} stroke={g} strokeWidth="1" /></>),
  publish: (<><rect x="5" y="14" width="22" height="13" rx="2" fill="#fff" stroke={g} {...sw} /><path d="M16 20V5M11 10l5-5 5 5" stroke={b} {...sw} fill="none" /></>),
  paste: (<><rect x="6" y="6" width="20" height="23" rx="2" fill="#fff" stroke={g} {...sw} /><rect x="11" y="3" width="10" height="6" rx="1.5" fill={y} stroke={g} strokeWidth="1.2" /></>),
  getdata: (<>{Cyl}<path d="M21 20l5 5M26 20v5h-5" stroke={b} {...sw} fill="none" /></>),
  newVisual: (<><rect x="4" y="5" width="24" height="22" rx="2" fill="#fff" stroke={g} {...sw} /><rect x="8" y="16" width="4" height="8" fill={y} /><rect x="14" y="11" width="4" height="13" fill={b} /><rect x="20" y="14" width="4" height="10" fill={gn} /></>),
  textBox: (<><rect x="4" y="6" width="24" height="20" rx="2" fill="#fff" stroke={g} {...sw} /><text x="10" y="21" fontSize="13" fontWeight="700" fill={b}>T</text></>),
  relations: (<><rect x="3" y="5" width="11" height="9" rx="1.5" fill="#fff" stroke={g} {...sw} /><rect x="18" y="18" width="11" height="9" rx="1.5" fill="#fff" stroke={g} {...sw} /><path d="M14 10h6v8" stroke={b} {...sw} fill="none" /></>),
  report: (<><rect x="5" y="5" width="22" height="22" rx="2" fill="none" stroke="#fff" strokeWidth="2" /><path d="M10 22v-6M16 22V10M22 22v-9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></>),
  tableView: (<><rect x="5" y="6" width="22" height="20" rx="1.5" fill="none" stroke={g} strokeWidth="2" /><path d="M5 12h22M5 18h22M13 6v20" stroke={g} strokeWidth="1.5" /></>),
  modelView: (<><rect x="4" y="6" width="10" height="8" fill="none" stroke={g} strokeWidth="2" /><rect x="18" y="18" width="10" height="8" fill="none" stroke={g} strokeWidth="2" /><path d="M14 10h4v12" stroke={g} strokeWidth="2" fill="none" /></>),
  sigma: (<text x="6" y="24" fontSize="22" fontWeight="700" fill={g}>Σ</text>),
  key: (<><circle cx="11" cy="16" r="5" fill="none" stroke={g} strokeWidth="2.4" /><path d="M16 16h12M24 16v5M28 16v4" stroke={g} strokeWidth="2.4" fill="none" /></>),
  field: (<><rect x="6" y="8" width="20" height="16" rx="2" fill="none" stroke={g} strokeWidth="2" /><path d="M6 14h20" stroke={g} strokeWidth="2" /></>),
  caret: (<path d="M9 13l7 7 7-7" stroke={g} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />),
  table: Tbl,
  warn: (<><path d="M16 4l13 23H3z" fill={y} stroke="#201F1E" {...sw} /><path d="M16 12v8M16 23.5v.5" stroke="#201F1E" strokeWidth="2.2" strokeLinecap="round" /></>),
  check: (<><circle cx="16" cy="16" r="13" fill={gn} /><path d="M9.5 16.5l4.5 4.5 9-10" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>),
  cross: (<><circle cx="16" cy="16" r="13" fill={r} /><path d="M10.5 10.5l11 11M21.5 10.5l-11 11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></>),
  gear: (<><circle cx="16" cy="16" r="5" fill="none" stroke={g} strokeWidth="2.2" /><path d="M16 3v5M16 24v5M3 16h5M24 16h5M7 7l3.5 3.5M21.5 21.5L25 25M25 7l-3.5 3.5M10.5 21.5L7 25" stroke={g} strokeWidth="2.2" strokeLinecap="round" /></>),
  refreshSm: (<><path d="M25 17a9 9 0 1 1-3-7" stroke={b} strokeWidth="2.4" fill="none" strokeLinecap="round" /><path d="M24 5v6h-6" stroke={b} strokeWidth="2.4" fill="none" strokeLinecap="round" /></>),
  qIcon: (<><rect x="5" y="5" width="22" height="22" rx="2" fill="#fff" stroke={g} strokeWidth="2" /><path d="M5 11h22M5 17h22M13 5v22" stroke={g} strokeWidth="1.4" /></>),
  folder: (<path d="M3 8h9l3 3h14v15H3z" fill={y} stroke={g} strokeWidth="1.6" strokeLinejoin="round" />),
};

export const Ico: React.FC<{n: string; s?: number}> = ({n, s = 32}) => (
  <svg width={s} height={s} viewBox="0 0 32 32" style={{display: 'block', flex: 'none'}}>
    {ICONS[n] ?? null}
  </svg>
);
