import type {ReactNode} from 'react';
import {C, FONT} from '../theme';

export const TITLE_H = 40;
export const TABS_H = 44;
export const RIB_Y = TITLE_H + TABS_H; // 84
export const RIB_H = 116;
export const BODY_Y = RIB_Y + RIB_H; // 200
export const RAIL_W = 60;
export const DATA_W = 330;
export const DATA_X = 1920 - DATA_W;
export const STATUS_H = 34;
export const FORM_H = 190;
export const GRID_Y = BODY_Y + FORM_H + 20; // 410
export const GRID_X = RAIL_W + 40;

type RI = {id: string; label: string; ico: string; caret?: boolean};
const L = (id: string, label: string, ico: string, caret = false): RI => ({id, label, ico, caret});
const HOME: Array<{g: string; items: RI[]}> = [
  {g: 'Clipboard', items: [L('paste', 'Paste', 'grid', true)]},
  {g: 'Data', items: [L('getdata', 'Get\ndata', 'grid', true), L('excel', 'Excel\nworkbook', 'grid'), L('enter', 'Enter\ndata', 'grid')]},
  {g: 'Queries', items: [L('transform', 'Transform\ndata', 'grid', true), L('refresh', 'Refresh', 'refresh')]},
  {g: 'Calculations', items: [L('newmeasure', 'New\nmeasure', 'fx'), L('quick', 'Quick\nmeasure', 'fx')]},
  {g: 'Share', items: [L('publish', 'Publish', 'pub')]},
];
const TT: Array<{g: string; items: RI[]}> = [
  {g: 'Relationships', items: [L('manage', 'Manage\nrelationships', 'rel')]},
  {g: 'Calculations', items: [L('newmeasure', 'New\nmeasure', 'fx'), L('quick', 'Quick\nmeasure', 'fx'), L('newcol', 'New\ncolumn', 'fx'), L('newtable', 'New\ntable', 'grid')]},
];
export const TABS = ['File', 'Home', 'Insert', 'Modeling', 'View', 'Optimize', 'Help'];
const TAB_W = 118;

type Placed = RI & {x: number; w: number; y: number; h: number};
const layout = (tab: string) => {
  const gs = tab === 'Home' ? HOME : tab === 'Table tools' ? TT : [];
  const items: Placed[] = [];
  const groups: Array<{g: string; x: number; w: number}> = [];
  let x = 14;
  for (const grp of gs) {
    const gx = x;
    for (const it of grp.items) {
      items.push({...it, x, w: 108, y: RIB_Y + 6, h: 84});
      x += 108;
    }
    groups.push({g: grp.g, x: gx, w: x - gx});
    x += 20;
  }
  return {items, groups};
};
export const itemC = (tab: string, id: string): {x: number; y: number} => {
  const it = layout(tab).items.find((i) => i.id === id);
  if (!it) throw new Error('ribbon item not found: ' + tab + '/' + id);
  return {x: it.x + it.w / 2, y: it.y + it.h / 2};
};
const tabNames = (view: string): string[] => (view === 'table' ? [...TABS, 'Table tools'] : TABS);
export const tabC = (view: string, name: string): {x: number; y: number} => ({
  x: 16 + tabNames(view).indexOf(name) * TAB_W + (TAB_W - 8) / 2,
  y: TITLE_H + TABS_H / 2,
});
export const railC = (view: 'report' | 'table' | 'model' | 'dax'): {x: number; y: number} => ({
  x: RAIL_W / 2,
  y: BODY_Y + 50 + ['report', 'table', 'model', 'dax'].indexOf(view) * 76,
});

const Ico = ({k, size = 44}: {k: string; size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    {k === 'fx' ? (
      <g>
        <rect x={4} y={6} width={36} height={32} rx={4} fill="#FFF4C2" stroke="#B7950B" strokeWidth={2} />
        <text x={22} y={30} textAnchor="middle" fontSize={20} fontWeight={700} fill="#7A5B00" fontFamily="PBI, sans-serif">
          fx
        </text>
      </g>
    ) : k === 'refresh' ? (
      <path d="M32 14 a13 13 0 1 0 3 12 M33 6 v10 h-10" stroke="#2B7CD3" strokeWidth={3.5} fill="none" />
    ) : k === 'rel' ? (
      <g stroke="#2B7CD3" strokeWidth={2.5} fill="#fff">
        <rect x={3} y={6} width={14} height={14} />
        <rect x={27} y={24} width={14} height={14} />
        <path d="M17 13 h10 v11" fill="none" />
      </g>
    ) : k === 'pub' ? (
      <path d="M22 8 v24 M12 18 l10 -10 l10 10 M8 36 h28" stroke="#2B7CD3" strokeWidth={3.5} fill="none" />
    ) : (
      <g>
        <rect x={5} y={8} width={34} height={28} fill="#fff" stroke="#605E5C" strokeWidth={2} />
        <rect x={5} y={8} width={34} height={8} fill="#2B7CD3" />
        <path d="M16 16 v20 M28 16 v20 M5 25 h34" stroke="#A19F9D" strokeWidth={1.5} />
      </g>
    )}
  </svg>
);

const RailIco = ({v, on}: {v: string; on: boolean}) => (
  <svg width={34} height={34} viewBox="0 0 34 34" fill="none" stroke={on ? '#201F1E' : '#605E5C'} strokeWidth={2.4}>
    {v === 'report' ? (
      <g>
        <rect x={5} y={18} width={6} height={11} />
        <rect x={14} y={9} width={6} height={20} />
        <rect x={23} y={14} width={6} height={15} />
      </g>
    ) : v === 'table' ? (
      <g>
        <rect x={4} y={7} width={26} height={20} />
        <path d="M4 14 h26 M4 20 h26 M13 7 v20" />
      </g>
    ) : v === 'model' ? (
      <g>
        <rect x={3} y={5} width={12} height={10} />
        <rect x={19} y={19} width={12} height={10} />
        <path d="M15 10 h8 v9" />
      </g>
    ) : (
      <path d="M12 8 l-8 9 l8 9 M22 8 l8 9 l-8 9" />
    )}
  </svg>
);

export type DataRow = {label: string; kind: 'table' | 'col' | 'calc' | 'measure'};
export const dataRows = (_showPS: boolean, measures: string[]): DataRow[] => [
  {label: 'Products', kind: 'table'},
  {label: 'ProductID', kind: 'col'},
  {label: 'Product', kind: 'col'},
  {label: 'Category', kind: 'col'},
  {label: 'Sales', kind: 'table'},
  {label: 'OrderID', kind: 'col'},
  {label: 'ProductID', kind: 'col'},
  {label: 'Line Amount', kind: 'col'},
  ...measures.map((m) => ({label: m, kind: 'measure'} as DataRow)),
];
const DATA_Y = BODY_Y + 100;
export const dataRowC = (showPS: boolean, measures: string[], label: string, kind: string): {x: number; y: number} => {
  const rows = dataRows(showPS, measures);
  const i = rows.findIndex((r) => r.label === label && r.kind === kind);
  return {x: DATA_X + 110, y: DATA_Y + i * 36 + 18};
};

export type DeskProps = {
  view: 'report' | 'table' | 'model';
  tab: string;
  open?: string;
  selTable: string;
  showPS: boolean;
  measures: string[];
  status?: string;
  children?: ReactNode;
};

export const Desk = ({view, tab, open, selTable, showPS, measures, status, children}: DeskProps) => {
  const {items, groups} = layout(tab);
  const tn = tabNames(view);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: '#F3F2F1', fontFamily: FONT, overflow: 'hidden', direction: 'ltr'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: TITLE_H, background: '#FFFFFF', borderBottom: '1px solid ' + C.grid}}>
        <div style={{position: 'absolute', left: 14, top: 8, width: 14, height: 24, background: C.yellow}} />
        <div style={{position: 'absolute', left: 44, top: 0, lineHeight: TITLE_H + 'px', fontSize: 20, color: C.ink}}>Untitled - Power BI Desktop</div>
        <div style={{position: 'absolute', left: 760, top: 5, width: 400, height: 30, border: '1px solid ' + C.line, borderRadius: 4, lineHeight: '28px', paddingLeft: 12, fontSize: 18, color: C.light, boxSizing: 'border-box'}}>Search</div>
        <div style={{position: 'absolute', right: 0, top: 0, display: 'flex', fontSize: 22, color: C.ink}}>
          {['—', '☐', '✕'].map((g) => (
            <div key={g} style={{width: 66, textAlign: 'center', lineHeight: TITLE_H + 'px'}}>{g}</div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: TITLE_H, width: 1920, height: TABS_H, background: '#FFFFFF', borderBottom: '1px solid ' + C.line}}>
        {tn.map((t, i) => (
          <div key={t} style={{position: 'absolute', left: 16 + i * TAB_W, top: 6, width: TAB_W - 8, height: TABS_H - 6, textAlign: 'center', lineHeight: TABS_H - 8 + 'px', fontSize: 21, boxSizing: 'border-box', color: t === 'File' ? '#FFFFFF' : t === 'Table tools' ? '#8A5A00' : t === tab ? C.ink : C.gray, background: t === 'File' ? '#2B579A' : t === tab ? '#FAF9F8' : '#FFFFFF', border: t === tab ? '1px solid ' + C.line : '1px solid transparent', borderBottom: t === tab ? '1px solid #FAF9F8' : '1px solid transparent', fontWeight: t === tab ? 700 : 400, whiteSpace: 'nowrap', overflow: 'visible'}}>
            {t}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, top: RIB_Y, width: 1920, height: RIB_H, background: '#FAF9F8', borderBottom: '1px solid ' + C.line}}>
        {items.map((it) => (
          <div key={it.id} style={{position: 'absolute', left: it.x, top: it.y - RIB_Y, width: it.w, height: it.h, background: open === it.id ? '#C8C6C4' : 'transparent', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 4}}><Ico k={it.ico} /></div>
            <div style={{textAlign: 'center', fontSize: 16, lineHeight: '18px', color: C.ink, marginTop: 4}}>
              {it.label.split('\n').map((l, i, a) => (<div key={i}>{l}{it.caret && i === a.length - 1 ? ' ▾' : ''}</div>))}
            </div>
          </div>
        ))}
        {groups.map((g) => (
          <div key={g.g} style={{position: 'absolute', left: g.x, top: RIB_H - 24, width: g.w, textAlign: 'center', fontSize: 14, color: C.gray}}>
            {g.g}
            <div style={{position: 'absolute', right: -10, top: -90, width: 1, height: 108, background: C.line}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, top: BODY_Y, width: RAIL_W, height: 1080 - BODY_Y - STATUS_H, background: '#FFFFFF', borderRight: '1px solid ' + C.line}}>
        {(['report', 'table', 'model', 'dax'] as const).map((v, i) => (
          <div key={v} style={{position: 'absolute', left: 0, top: 33 + i * 76, width: RAIL_W, height: 34, display: 'flex', justifyContent: 'center'}}>
            {v === view ? <div style={{position: 'absolute', left: 0, top: -6, width: 5, height: 46, background: C.yellow}} /> : null}
            <RailIco v={v} on={v === view} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: DATA_X, top: BODY_Y, width: DATA_W, height: 1080 - BODY_Y - STATUS_H, background: '#FFFFFF', borderLeft: '1px solid ' + C.line}}>
        <div style={{padding: '12px 16px', fontSize: 22, fontWeight: 700, color: C.ink}}>Data</div>
        <div style={{margin: '0 16px', height: 38, border: '1px solid ' + C.line, lineHeight: '36px', paddingLeft: 10, fontSize: 18, color: C.light, boxSizing: 'border-box'}}>Search</div>
        <div style={{position: 'absolute', left: 0, top: 100 - 0, width: DATA_W}}>
          {dataRows(showPS, measures).map((r, i) => (
            <div key={i} style={{height: 36, lineHeight: '36px', fontSize: 20, color: C.ink, paddingLeft: r.kind === 'table' ? 16 : 56, background: r.kind === 'table' && r.label === selTable ? '#FFF1B8' : 'transparent', fontWeight: r.kind === 'table' ? 700 : 400}}>
              {r.kind === 'table' ? '▾ ' : r.kind === 'calc' || r.kind === 'measure' ? 'ƒ ' : ''}
              {r.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 1080 - STATUS_H, width: 1920, height: STATUS_H, background: '#F3F2F1', borderTop: '1px solid ' + C.line, lineHeight: STATUS_H + 'px', paddingLeft: 76, fontSize: 16, color: C.gray}}>
        {status ?? (view === 'table' ? 'Table: ' + selTable + ' (4 rows)' : view === 'report' ? 'Page 1 of 1' : '')}
      </div>
      {children}
    </div>
  );
};

export type GridCol = {h: string; w: number; num?: boolean};
export const TableGrid = ({x = GRID_X, y = GRID_Y, cols, rows, hiRow = -1, selCol = -1}: {x?: number; y?: number; cols: GridCol[]; rows: string[][]; hiRow?: number; selCol?: number}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: FONT, background: '#FFFFFF', border: '1px solid ' + C.grid, direction: 'ltr'}}>
    <div style={{display: 'flex', height: 52, background: '#F8F8F8', borderBottom: '1px solid ' + C.grid}}>
      {cols.map((c, i) => (
        <div key={c.h} style={{width: c.w, lineHeight: '52px', padding: '0 14px', boxSizing: 'border-box', fontSize: 22, fontWeight: 700, color: C.ink, background: selCol === i ? C.selHead : 'transparent', borderRight: '1px solid ' + C.grid}}>{c.h}</div>
      ))}
    </div>
    {rows.map((r, ri) => (
      <div key={ri} style={{display: 'flex', height: 50, borderBottom: '1px solid ' + C.grid, background: hiRow === ri ? '#FFF1B8' : '#FFFFFF'}}>
        {r.map((v, ci) => (
          <div key={ci} style={{width: cols[ci].w, lineHeight: '50px', padding: '0 14px', boxSizing: 'border-box', fontSize: 23, color: C.ink, textAlign: cols[ci].num ? 'right' : 'left', borderRight: '1px solid ' + C.grid}}>{v}</div>
        ))}
      </div>
    ))}
  </div>
);
