import React from 'react';
import {COL, XL} from './theme';
import {FONT} from './kit';

// ---------- geometry shared with the scenes (window coordinates, logical px) ----------
export type R = {x: number; y: number; w: number; h: number};
export const DG = {
  create: {x: 424, y: 100, w: 400, h: 340},
  slicers: {x: 484, y: 110, w: 300, h: 340},
  timeline: {x: 494, y: 150, w: 290, h: 250},
  vfs: {x: 420, y: 46, w: 410, h: 456},
};
export const okPos = (d: {x: number; y: number; w: number; h: number}): R => ({x: d.x + d.w - 170, y: d.y + d.h - 40, w: 74, h: 26});
export const PANE = {x: XL.winW - 250, y: XL.titleH + XL.tabsH + XL.ribbonH, w: 250};
export const FIELDS = ['Date', 'Branch', 'Region', 'Category', 'Product', 'Sales Amount', 'Profit'];
export const paneField = (n: string): R => ({x: PANE.x + 10, y: PANE.y + 78 + FIELDS.indexOf(n) * 18, w: 230, h: 18});
export type Z = 'F' | 'C' | 'R' | 'V';
export const paneZone = (z: Z): R => ({x: PANE.x + (z === 'F' || z === 'R' ? 8 : 130), y: PANE.y + (z === 'F' || z === 'C' ? 230 : 304), w: 112, h: z === 'R' || z === 'V' ? 82 : 66});
export const paneChip = (z: Z, i: number): R => { const q = paneZone(z); return {x: q.x + 4, y: q.y + 20 + i * 20, w: q.w - 8, h: 18}; };
export const VFS = {
  tab0: {x: DG.vfs.x + 16, y: DG.vfs.y + 118, w: 150, h: 24}, tab1: {x: DG.vfs.x + 168, y: DG.vfs.y + 118, w: 120, h: 24},
  item: (i: number): R => ({x: DG.vfs.x + 34, y: DG.vfs.y + 208 + i * 20, w: 200, h: 20}),
  dd: {x: DG.vfs.x + 34, y: DG.vfs.y + 188, w: 300, h: 24},
  ddItem: (i: number): R => ({x: DG.vfs.x + 34, y: DG.vfs.y + 212 + i * 22, w: 300, h: 22}),
};
export const SUMM = ['Sum', 'Count', 'Average', 'Max', 'Min', 'Product'];
export const SHOW = ['No Calculation', '% of Grand Total', '% of Column Total', '% of Row Total', '% Of...', '% of Parent Row Total'];
export const MENU_ITEM_H = 24;
export const center = (r: R) => ({x: r.x + r.w / 2, y: r.y + r.h / 2});

// ---------- Windows-style dialog primitives ----------
const f12: React.CSSProperties = {fontFamily: FONT.ui, fontSize: 12, color: '#1B1B1B', whiteSpace: 'nowrap'};
const At: React.FC<{x: number; y: number; w?: number; h?: number; s?: React.CSSProperties; children?: React.ReactNode}> = ({x, y, w, h, s, children}) => <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...s}}>{children}</div>;
export const Dlg: React.FC<{d: {x: number; y: number; w: number; h: number}; title: string; children?: React.ReactNode}> = ({d, title, children}) => (
  <div style={{position: 'absolute', left: d.x, top: d.y, width: d.w, height: d.h, background: '#F0F0F0', border: '1px solid #7A7A7A', boxShadow: '0 10px 30px rgba(0,0,0,.35)', ...f12}}>
    <div style={{height: 30, background: '#fff', borderBottom: '1px solid #E0E0E0', lineHeight: '30px', paddingLeft: 12, fontWeight: 600}}>{title}</div>
    <At x={d.w - 78} y={0} s={{display: 'flex', gap: 0}}>
      <div style={{width: 32, height: 30, textAlign: 'center', lineHeight: '30px', color: '#444'}}>?</div>
      <div style={{width: 46, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="10" height="10"><path d="M0 0l10 10M10 0L0 10" stroke="#333" strokeWidth="1"/></svg></div>
    </At>
    {children}
  </div>
);
export const DT: React.FC<{x: number; y: number; t: string; b?: boolean; dim?: boolean}> = ({x, y, t, b, dim}) => <At x={x} y={y} s={{...f12, fontWeight: b ? 600 : 400, color: dim ? '#8A8A8A' : '#1B1B1B'}}>{t}</At>;
export const DRadio: React.FC<{x: number; y: number; t: string; on?: boolean}> = ({x, y, t, on}) => (
  <At x={x} y={y} s={{display: 'flex', alignItems: 'center', gap: 6}}>
    <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="#fff" stroke="#555"/>{on ? <circle cx="7" cy="7" r="3.2" fill="#1B1B1B"/> : null}</svg><span style={f12}>{t}</span>
  </At>
);
export const DCheck: React.FC<{x: number; y: number; t: string; on?: boolean; hot?: boolean}> = ({x, y, t, on, hot}) => (
  <At x={x} y={y} s={{display: 'flex', alignItems: 'center', gap: 7, ...(hot ? {background: '#DCEBFA'} : {})}}>
    <svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="2" fill={on ? '#0F6CBD' : '#fff'} stroke={on ? '#0F6CBD' : '#555'}/>{on ? <path d="M3 7.2l2.8 2.8L11 4.2" stroke="#fff" strokeWidth="1.8" fill="none"/> : null}</svg><span style={f12}>{t}</span>
  </At>
);
export const DField: React.FC<{x: number; y: number; w: number; t: string; dd?: boolean; dim?: boolean; open?: boolean}> = ({x, y, w, t, dd, dim, open}) => (
  <At x={x} y={y} w={w} h={24} s={{background: dim ? '#F3F3F3' : '#fff', border: `1px solid ${open ? '#0F6CBD' : '#8A8A8A'}`, boxSizing: 'border-box', ...f12, lineHeight: '22px', paddingLeft: 6, color: dim ? '#8A8A8A' : '#1B1B1B'}}>
    {t}{dd ? <svg width="10" height="6" style={{position: 'absolute', right: 8, top: 9}}><path d="M0.5 0.5L5 5L9.5 0.5" stroke="#444" strokeWidth="1.3" fill="none"/></svg> : null}
  </At>
);
export const DBtn: React.FC<{r: R; t: string; def?: boolean; hot?: boolean; d: {x: number; y: number}}> = ({r, t, def, hot, d}) => (
  <At x={r.x - d.x} y={r.y - d.y} w={r.w} h={r.h} s={{background: hot ? '#D6E6F5' : '#FDFDFD', border: `${def ? 2 : 1}px solid ${def || hot ? '#0F6CBD' : '#8A8A8A'}`, borderRadius: 3, boxSizing: 'border-box', textAlign: 'center', lineHeight: def ? '20px' : '22px', ...f12}}>{t}</At>
);

export const CreateDlg: React.FC<{okHot?: boolean}> = ({okHot}) => {
  const d = DG.create, ok = okPos(d);
  return (
    <Dlg d={d} title="Create PivotTable">
      <DT x={14} y={44} t="Choose the data that you want to analyze"/>
      <DRadio x={22} y={66} t="Select a table or range" on/>
      <DT x={44} y={92} t="Table/Range:"/><DField x={122} y={88} w={254} t="tbl_Sales"/>
      <DRadio x={22} y={118} t="Use an external data source"/>
      <At x={44} y={138} w={150} h={22} s={{border: '1px solid #BDBDBD', background: '#F3F3F3', ...f12, color: '#8A8A8A', textAlign: 'center', lineHeight: '20px', boxSizing: 'border-box'}}>Choose Connection...</At>
      <DT x={14} y={170} t="Choose where you want the PivotTable to be placed"/>
      <DRadio x={22} y={192} t="New Worksheet" on/>
      <DRadio x={22} y={214} t="Existing Worksheet"/>
      <DT x={44} y={240} t="Location:" dim/><DField x={122} y={236} w={254} t="" dim/>
      <DT x={14} y={270} t="Choose whether you want to analyze multiple tables"/>
      <DCheck x={22} y={292} t="Add this data to the Data Model"/>
      <DBtn r={ok} t="OK" def hot={okHot} d={d}/><DBtn r={{...ok, x: ok.x + 84}} t="Cancel" d={d}/>
    </Dlg>
  );
};
export const SlicerDlg: React.FC<{checked: string[]; hotItem?: string; okHot?: boolean}> = ({checked, hotItem, okHot}) => {
  const d = DG.slicers, ok = okPos(d);
  return (
    <Dlg d={d} title="Insert Slicers">
      <At x={12} y={42} w={276} h={236} s={{background: '#fff', border: '1px solid #8A8A8A', boxSizing: 'border-box'}}>
        {FIELDS.map((n, i) => <DCheck key={n} x={8} y={6 + i * 24} t={n} on={checked.includes(n)} hot={hotItem === n}/>)}
      </At>
      <DBtn r={ok} t="OK" def hot={okHot} d={d}/><DBtn r={{...ok, x: ok.x + 84}} t="Cancel" d={d}/>
    </Dlg>
  );
};
export const TimelineDlg: React.FC<{checked: boolean; okHot?: boolean}> = ({checked, okHot}) => {
  const d = DG.timeline, ok = okPos(d);
  return (
    <Dlg d={d} title="Insert Timelines">
      <At x={12} y={42} w={266} h={150} s={{background: '#fff', border: '1px solid #8A8A8A', boxSizing: 'border-box'}}><DCheck x={8} y={6} t="Date" on={checked}/></At>
      <DBtn r={ok} t="OK" def hot={okHot} d={d}/><DBtn r={{...ok, x: ok.x + 84}} t="Cancel" d={d}/>
    </Dlg>
  );
};
export const VfsDlg: React.FC<{tab: 0 | 1; summ: string; show: string; open: boolean; hotItem?: number; okHot?: boolean; custom: string}> = ({tab, summ, show, open, hotItem, okHot, custom}) => {
  const d = DG.vfs, ok = okPos(d);
  return (
    <Dlg d={d} title="Value Field Settings">
      <DT x={14} y={46} t="Source Name:"/><DT x={98} y={46} t="Sales Amount" b/>
      <DT x={14} y={76} t="Custom Name:"/><DField x={98} y={72} w={290} t={custom}/>
      <At x={16} y={118} w={150} h={24} s={{background: tab === 0 ? '#fff' : '#E6E6E6', border: '1px solid #8A8A8A', borderBottom: tab === 0 ? '1px solid #fff' : '1px solid #8A8A8A', boxSizing: 'border-box', ...f12, textAlign: 'center', lineHeight: '22px', zIndex: 2}}>Summarize Values By</At>
      <At x={168} y={118} w={120} h={24} s={{background: tab === 1 ? '#fff' : '#E6E6E6', border: '1px solid #8A8A8A', borderBottom: tab === 1 ? '1px solid #fff' : '1px solid #8A8A8A', boxSizing: 'border-box', ...f12, textAlign: 'center', lineHeight: '22px', zIndex: 2}}>Show Values As</At>
      <At x={16} y={141} w={378} h={236} s={{background: '#fff', border: '1px solid #8A8A8A', boxSizing: 'border-box'}}/>
      {tab === 0 ? (
        <div>
          <DT x={30} y={152} t="Summarize value field by"/>
          <DT x={30} y={172} t="Choose the type of calculation that you want to use"/><DT x={30} y={188} t="to summarize data from the selected field"/>
          <At x={30} y={208} w={340} h={124} s={{background: '#fff', border: '1px solid #8A8A8A', boxSizing: 'border-box'}}>
            {SUMM.map((n, i) => <At key={n} x={2} y={2 + i * 20} w={334} h={20} s={{background: n === summ ? '#0F6CBD' : undefined, ...f12, color: n === summ ? '#fff' : '#1B1B1B', lineHeight: '20px', paddingLeft: 6, boxSizing: 'border-box'}}>{n}</At>)}
          </At>
        </div>
      ) : (
        <div>
          <DT x={30} y={152} t="Show values as"/>
          <DField x={34} y={176} w={300} t={show} dd open={open}/>
          <DT x={34} y={216} t="Base field:" dim/><DField x={34} y={234} w={300} t="" dim/>
          <DT x={34} y={270} t="Base item:" dim/><DField x={34} y={288} w={300} t="" dim/>
          {open ? (
            <At x={34} y={200} w={300} h={SHOW.length * 22 + 2} s={{background: '#fff', border: '1px solid #8A8A8A', boxSizing: 'border-box', zIndex: 4, boxShadow: '0 4px 12px rgba(0,0,0,.25)'}}>
              {SHOW.map((n, i) => <At key={n} x={1} y={1 + i * 22} w={296} h={22} s={{background: hotItem === i ? '#0F6CBD' : undefined, ...f12, color: hotItem === i ? '#fff' : '#1B1B1B', lineHeight: '22px', paddingLeft: 6, boxSizing: 'border-box'}}>{n}</At>)}
            </At>
          ) : null}
        </div>
      )}
      <At x={16} y={d.h - 40} w={120} h={26} s={{background: '#FDFDFD', border: '1px solid #8A8A8A', borderRadius: 3, boxSizing: 'border-box', ...f12, textAlign: 'center', lineHeight: '24px'}}>Number Format...</At>
      <DBtn r={ok} t="OK" def hot={okHot} d={d}/><DBtn r={{...ok, x: ok.x + 84}} t="Cancel" d={d}/>
    </Dlg>
  );
};

// ---------- popup menu ----------
export type MI = {t: string; sep?: boolean; dis?: boolean; on?: boolean; sub?: boolean};
export const menuH = (items: MI[]) => items.reduce((a, i) => a + (i.sep ? 9 : MENU_ITEM_H), 6);
export const menuItemRect = (x: number, y: number, w: number, items: MI[], idx: number): R => {
  let yy = y + 3;
  for (let i = 0; i < idx; i++) yy += items[i].sep ? 9 : MENU_ITEM_H;
  return {x, y: yy, w, h: MENU_ITEM_H};
};
export const Menu: React.FC<{x: number; y: number; w: number; items: MI[]; hot?: number}> = ({x, y, w, items, hot}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, background: '#fff', border: '1px solid #C8C6C4', boxShadow: '0 6px 18px rgba(0,0,0,.3)', borderRadius: 4, padding: '3px 0', boxSizing: 'content-box', ...f12}}>
    {items.map((it, i) => it.sep ? <div key={i} style={{height: 9, display: 'flex', alignItems: 'center'}}><div style={{height: 1, background: '#E1E1E1', width: '100%'}}/></div> : (
      <div key={i} style={{height: MENU_ITEM_H, lineHeight: `${MENU_ITEM_H}px`, paddingLeft: 30, background: hot === i ? '#E5F1FB' : undefined, color: it.dis ? '#9A9A9A' : '#1B1B1B', position: 'relative'}}>
        {it.on ? <svg width="14" height="14" viewBox="0 0 14 14" style={{position: 'absolute', left: 9, top: 5}}><path d="M2 7.5l3.5 3.5L12 3.5" stroke="#217346" strokeWidth="1.8" fill="none"/></svg> : null}
        {it.t}
        {it.sub ? <svg width="6" height="10" viewBox="0 0 6 10" style={{position: 'absolute', right: 10, top: 7}}><path d="M1 1l4 4-4 4" stroke="#444" strokeWidth="1.4" fill="none"/></svg> : null}
      </div>
    ))}
  </div>
);

// ---------- PivotTable Fields pane ----------
export type Zones = {F: string[]; C: string[]; R: string[]; V: string[]};
const ZN: Record<Z, string> = {F: 'Filters', C: 'Columns', R: 'Rows', V: 'Values'};
export const FieldPane: React.FC<{zones: Zones; glow?: Z | 'all' | null; glowC?: string; hotField?: string; valLabels?: Record<string, string>}> = ({zones, glow, glowC = COL.purple, hotField, valLabels}) => {
  const used = new Set([...zones.F, ...zones.C, ...zones.R, ...zones.V]);
  const px = PANE.x, py = PANE.y;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: PANE.w, height: '100%', ...f12}}>
      <At x={10} y={6} s={{fontWeight: 600, fontSize: 13}}>PivotTable Fields</At>
      <At x={PANE.w - 36} y={9} s={{display: 'flex', gap: 8}}><svg width="10" height="6"><path d="M0.5 0.5L5 5L9.5 0.5" stroke="#555" strokeWidth="1.3" fill="none"/></svg><svg width="10" height="10"><path d="M0 0l10 10M10 0L0 10" stroke="#555"/></svg></At>
      <At x={10} y={32} s={{color: '#444'}}>Choose fields to add to report:</At>
      <At x={PANE.w - 28} y={30}><svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="2.5" fill="#666"/><circle cx="7" cy="7" r="5.5" fill="none" stroke="#666" strokeDasharray="2 1.6"/></svg></At>
      <At x={10} y={50} w={PANE.w - 20} h={22} s={{border: '1px solid #8A8A8A', boxSizing: 'border-box', lineHeight: '20px', paddingLeft: 6, color: '#8A8A8A', background: '#fff'}}>Search</At>
      <At x={4} y={76} w={PANE.w - 8} h={130} s={{border: '1px solid #E1E1E1', background: '#fff', boxSizing: 'border-box'}}/>
      {FIELDS.map((n, i) => (
        <At key={n} x={10} y={78 + i * 18 - 0} w={230} h={18} s={{display: 'flex', alignItems: 'center', gap: 7, background: hotField === n ? '#E5F1FB' : undefined}}>
          <svg width="13" height="13" viewBox="0 0 13 13"><rect x="0.5" y="0.5" width="12" height="12" rx="1.5" fill={used.has(n) ? '#0F6CBD' : '#fff'} stroke={used.has(n) ? '#0F6CBD' : '#666'}/>{used.has(n) ? <path d="M3 6.7l2.3 2.3L10 4" stroke="#fff" strokeWidth="1.7" fill="none"/> : null}</svg>
          <span style={{fontWeight: used.has(n) ? 600 : 400}}>{n}</span>
        </At>
      ))}
      <At x={10} y={211} s={{color: '#444'}}>Drag fields between areas below:</At>
      {(['F', 'C', 'R', 'V'] as Z[]).map((z) => {
        const q = paneZone(z);
        const items = zones[z];
        const on = glow === z || glow === 'all';
        return (
          <div key={z}>
            <At x={q.x - PANE.x + 0} y={q.y - PANE.y} w={q.w} h={q.h} s={{background: '#fff', border: `1px solid ${on ? glowC : '#BDBDBD'}`, boxShadow: on ? `0 0 12px ${glowC}, inset 0 0 8px ${glowC}55` : undefined, boxSizing: 'border-box'}}>
              <At x={6} y={2} s={{color: '#444'}}>{ZN[z]}</At>
            </At>
            {items.map((it, i) => {
              const c = paneChip(z, i);
              return (
                <At key={it} x={c.x - PANE.x} y={c.y - PANE.y} w={c.w} h={c.h} s={{background: '#F3F3F3', border: '1px solid #C8C6C4', boxSizing: 'border-box', lineHeight: '18px', paddingLeft: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 16}}>
                  {valLabels?.[it] ?? it}
                  <svg width="8" height="5" style={{position: 'absolute', right: 4, top: 7}}><path d="M0 0h8L4 5z" fill="#444"/></svg>
                </At>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Slicer & Timeline objects (drawn inside the grid overlay, grid coordinates) ----------
export const Slicer: React.FC<{x: number; y: number; title: string; items: string[]; sel: string[] | null; op?: number}> = ({x, y, title, items, sel, op = 1}) => {
  const h = 32 + items.length * 26 + 8;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 150, height: h, background: '#fff', border: '1px solid #A6A6A6', boxShadow: '0 4px 12px rgba(0,0,0,.25)', opacity: op, ...f12}}>
      <div style={{height: 28, lineHeight: '28px', paddingLeft: 8, fontWeight: 600, fontSize: 13, background: '#F7F7F7', borderBottom: '1px solid #E1E1E1'}}>{title}</div>
      <svg width="40" height="14" style={{position: 'absolute', right: 6, top: 7}}><path d="M2 2h12M2 7h12M2 12h12" stroke="#666" strokeWidth="1.4"/><path d="M22 2h14l-5 6v5l-4-2V8z" fill="none" stroke="#666" strokeWidth="1.3"/></svg>
      {items.map((n, i) => {
        const on = sel === null || sel.includes(n);
        return <div key={n} style={{position: 'absolute', left: 6, top: 32 + i * 26, width: 138, height: 24, boxSizing: 'border-box', border: `1px solid ${on ? '#2F78C4' : '#C8C6C4'}`, background: on ? '#CFE3F7' : '#fff', color: on ? '#1B1B1B' : '#8A8A8A', textAlign: 'center', lineHeight: '22px'}}>{n}</div>;
      })}
    </div>
  );
};
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const Timeline: React.FC<{x: number; y: number; sel: number | null; op?: number}> = ({x, y, sel, op = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 330, height: 92, background: '#fff', border: '1px solid #A6A6A6', boxShadow: '0 4px 12px rgba(0,0,0,.25)', opacity: op, ...f12}}>
    <div style={{height: 26, lineHeight: '26px', paddingLeft: 8, fontWeight: 600, fontSize: 13, background: '#F7F7F7', borderBottom: '1px solid #E1E1E1'}}>Date</div>
    <div style={{position: 'absolute', right: 8, top: 5, color: '#444'}}>{sel === null ? 'All Periods' : `${MON[sel][0]}${MON[sel].slice(1).toLowerCase()} 2026`}  <span style={{marginLeft: 6, fontSize: 11}}>MONTHS ▾</span></div>
    <div style={{position: 'absolute', left: 8, top: 32, color: '#666'}}>2026</div>
    <div style={{position: 'absolute', left: 8, top: 50, width: 314, height: 24, display: 'flex'}}>
      {MON.map((m, i) => <div key={m} style={{flex: 1, borderRight: '1px solid #E1E1E1', background: sel === i ? '#7FB6F0' : '#F3F3F3', textAlign: 'center', lineHeight: '24px', fontSize: 10.5, color: '#444'}}>{m}</div>)}
    </div>
    <div style={{position: 'absolute', left: 8, top: 78, width: 314, height: 6, background: '#E6E6E6'}}><div style={{width: 90, height: 6, background: '#B5B5B5'}}/></div>
  </div>
);
