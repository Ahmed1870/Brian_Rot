import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {UNIQUE_BRANCHES_SORTED} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC03: SORT(UNIQUE(...)) combo + Data Validation dropdown linked to spill.
// Phase 1 (85-100s): type =SORT(UNIQUE(tbl_Sales[Branch])) → sorted unique branches spill.
// Phase 2 (100-130s): open Data Validation dialog → set Source: =$F$2# → dropdown appears → new branch auto-syncs.
const S = START.s3;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 160, 120, 120, 100, 160][c] ?? XL.colW;

/** Data Validation dialog overlay. */
const DataValidationDialog: React.FC<{p: number; sourceTyped: string}> = ({p, sourceTyped}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', left: 380, top: 200, width: 600, height: 380,
      background: '#fff', border: '1px solid #8C8C8C', boxShadow: '0 12px 40px rgba(0,0,0,0.6)', borderRadius: 7,
      opacity: p, zIndex: 40, overflow: 'hidden', transform: `scale(${0.95 + 0.05 * p})`,
    }}>
      <div style={{height: 32, background: '#fff', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', paddingLeft: 12}}>
        <span style={{fontFamily: 'Segoe UI, Open Sans, sans-serif', fontSize: 12.5, color: '#1B1B1B', fontWeight: 600}}>Data Validation</span>
        <svg width={12} height={12} viewBox="0 0 12 12" style={{marginLeft: 'auto', marginRight: 12}}><path d="M1 1l10 10M11 1L1 11" stroke="#333" strokeWidth={1.1} /></svg>
      </div>
      <div style={{padding: '16px 20px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, color: '#1B1B1B'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
          <span style={{minWidth: 70}}>Allow:</span>
          <div style={{border: '1px solid #8A8A8A', background: '#fff', padding: '3px 8px', fontSize: 12}}>List ▾</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
          <span style={{minWidth: 70}}>Source:</span>
          <div style={{border: `2px solid ${C.amber}`, background: `${C.amber}11`, padding: '4px 8px', fontFamily: 'Consolas, monospace', fontSize: 13, fontWeight: 700, color: '#92400E', minWidth: 200}}>
            {sourceTyped}<span style={{opacity: 0.6, color: C.amber}}>|</span>
          </div>
        </div>
        <div style={{marginTop: 16, background: '#F3F3F3', border: '1px solid #CFCFCF', padding: '8px 12px', fontSize: 11, color: '#5E5E5E'}}>
          The # operator references the entire spilled array from cell F2. New data auto-syncs.
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 44, borderTop: '1px solid #E5E5E5', background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14, gap: 8}}>
        <div style={{border: '1px solid #ADADAD', background: '#E9E9E9', padding: '4px 18px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3}}>Cancel</div>
        <div style={{border: '2px solid #0F6CBD', background: '#CFE8D8', padding: '4px 22px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3, fontWeight: 700}}>OK</div>
      </div>
    </div>
  );
};

/** Dropdown arrow icon on a cell (shows Data Validation list). */
const DropdownArrow: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: p, zIndex: 25}}>
      <svg width={16} height={16} viewBox="0 0 16 16"><path d="M3 5l5 6 5-6" fill="none" stroke="#0F6CBD" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
};

/** Dropdown list popup showing the sorted unique branches. */
const DropdownList: React.FC<{x: number; y: number; p: number; items: string[]; newItems?: string[]}> = ({x, y, p, items, newItems}) => {
  if (p <= 0.01) return null;
  const allItems = newItems ? [...items, ...newItems] : items;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 160,
      background: '#fff', border: '1px solid #8C8C8C', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', borderRadius: 4,
      opacity: p, zIndex: 35, overflow: 'hidden',
    }}>
      {allItems.map((item, i) => (
        <div key={i} style={{
          padding: '4px 10px', fontFamily: 'Consolas, monospace', fontSize: 13, color: '#1B1B1B',
          background: newItems && i >= items.length ? `${C.amber}22` : 'transparent',
          borderBottom: i < allItems.length - 1 ? '1px solid #E5E5E5' : 'none',
          fontWeight: newItems && i >= items.length ? 700 : 400,
        }}>
          {item}
          {newItems && i >= items.length ? <span style={{color: C.amber, marginLeft: 6, fontSize: 10}}>NEW</span> : null}
        </div>
      ))}
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 280, z: 1.0}, prog(f, t(2), 30));

  // Phase 1: type SORT(UNIQUE(...)) formula
  const formulaTyped = typed('=SORT(UNIQUE(B2:B11))', f, t(86), 1.2);
  const formulaDone = f >= t(94);
  const spillP = formulaDone ? prog(f, t(94.5), 14) : 0;
  const fbEdit1 = f >= t(86) && f < t(94.5);

  // Phase 2: Data Validation dialog
  const dvP = prog(f, t(100), 10) * (1 - prog(f, t(112), 8));
  const sourceTyped = typed('=$F$2#', f, t(103), 0.8);
  const dvSourceDone = f >= t(108);

  // Dropdown appears after DV OK
  const dropdownP = prog(f, t(112), 10) * (1 - prog(f, t(130), 12));

  // New branch added (auto-sync)
  const newBranchP = f >= t(118) ? prog(f, t(118), 12) : 0;
  const showNewBranch = newBranchP > 0.3;

  // Cursor: F2 → formula bar → Enter → Data tab → Data Validation icon → OK → dropdown cell
  const f2 = cellCenter(2, 6, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const dataTabX = 580;
  const dvIconX = 620;
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const okBtnX = 940;
  const okBtnY = 540;
  const dropdownCell = cellCenter(15, 6, {colW});
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(94), x: f2.x, y: f2.y},
    {f: t(100), x: dataTabX, y: ribbonY},
    {f: t(101), x: dvIconX, y: ribbonY},
    {f: t(108), x: okBtnX, y: okBtnY},
    {f: t(112), x: dropdownCell.x, y: dropdownCell.y},
    {f: t(114), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [94, 100, 101, 108, 112];
  const curHide = f > t(115);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Dropdowns.xlsx" nameBox={dvSourceDone ? 'F15' : 'F2'} formula={formulaTyped} fbEdit={fbEdit1} tab="Data"
          cell={(r, c) => {
            // SORT(UNIQUE) result in column F
            if (c === 6) {
              if (r === 1) return {t: 'Branch (Sorted Unique)', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
              const idx = r - 2;
              const allBranches = showNewBranch ? [...UNIQUE_BRANCHES_SORTED, 'Giza'] : UNIQUE_BRANCHES_SORTED;
              if (idx < allBranches.length && spillP > idx / allBranches.length) {
                const isNew = showNewBranch && idx === allBranches.length - 1;
                return {t: allBranches[idx], color: '#107C41', bg: isNew ? `${C.amber}22` : undefined};
              }
              return undefined;
            }
            // Dropdown cell F15
            if (c === 6 && r === 15 && dropdownP > 0.3) {
              return {t: showNewBranch ? 'Alex' : 'Alex', color: '#0F6CBD', bg: '#fff'};
            }
            if (c === 6 && r === 14) return {t: 'Select Branch:', b: true, al: 'l'};
            return undefined;
          }} colW={colW}
          sel={dvSourceDone ? {r1: 15, c1: 6, r2: 15, c2: 6} : {r1: 2, c1: 6, r2: 2, c2: 6}}
          active={dvSourceDone ? {r: 15, c: 6} : {r: 2, c: 6}}
          thumb={0} thumbSize={0.55}
        >
          {/* Spill border on SORT(UNIQUE) result */}
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6)} h={XL.rowH * (showNewBranch ? UNIQUE_BRANCHES_SORTED.length + 1 : UNIQUE_BRANCHES_SORTED.length)} color={C.amber} p={spillP * (1 - prog(f, t(130), 12))} label={showNewBranch ? 'Auto-synced: +Giza (NEW)' : '=SORT(UNIQUE(...)) spill'} labelBelow />
          ) : null}
          {/* Dropdown arrow on F15 */}
          <DropdownArrow x={cellCenter(15, 6, {colW}).x + colW(6) / 2 - 20} y={cellCenter(15, 6, {colW}).y - 8} p={dropdownP} />
          {/* Dropdown list popup */}
          {dropdownP > 0.3 ? (
            <DropdownList x={cellCenter(15, 6, {colW}).x - colW(6) / 2} y={cellCenter(15, 6, {colW}).y + XL.rowH / 2 + 2} p={dropdownP} items={UNIQUE_BRANCHES_SORTED} newItems={showNewBranch ? ['Giza'] : undefined} />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 108 ? C.amber : C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
          {/* Data Validation dialog */}
          <DataValidationDialog p={dvP} sourceTyped={sourceTyped} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="Dynamic Formula Combination ──► =SORT(UNIQUE(tbl_Sales[Branch]))" from={t(86.0)} to={t(110.0)} />
      {dvP < 0.01 && spillP < 0.3 ? <Caption text="Dynamic Formula Combination ──► =SORT(UNIQUE(tbl_Sales[Branch]))" from={t(86.0)} to={t(100.0)} /> : null}
      {dropdownP > 0.3 ? <Caption text="Smart Data Validation ──► Source: =$F$2# Auto-Updates Dropdowns on New Data Entry" from={t(110.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
