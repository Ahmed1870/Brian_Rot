import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {APPEND_TOTAL, BRANCH_SHEETS} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC02: Power Query Append — single Excel window with PQ editor overlay.
// Phase 1 (40-55s): PQ editor shows 4 branch sheets → Append Queries → master stream (amber).
// Phase 2 (55-85s): drop new file into folder → Refresh → new data merges (green).
const S = START.s2;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 180, 100, 100, 100][c] ?? XL.colW;

/** Power Query editor overlay (simplified). */
const PQEditor: React.FC<{p: number; appendP: number; newFileP: number; refreshP: number}> = ({p, appendP, newFileP, refreshP}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', left: 380, top: 130, width: 820, height: 580,
      background: '#fff', border: '1px solid #8C8C8C', boxShadow: '0 12px 40px rgba(0,0,0,0.6)', borderRadius: 7,
      opacity: p, zIndex: 40, overflow: 'hidden', transform: `scale(${0.95 + 0.05 * p})`,
    }}>
      {/* Title bar */}
      <div style={{height: 32, background: '#0F6CBD', display: 'flex', alignItems: 'center', paddingLeft: 12}}>
        <span style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 12.5, color: '#fff', fontWeight: 600}}>Power Query Editor — Append Queries</span>
      </div>
      {/* Content */}
      <div style={{padding: '16px 20px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, color: '#1B1B1B'}}>
        {/* Branch sheets list */}
        <div style={{marginBottom: 12, fontWeight: 700, fontSize: 14}}>Source Tables:</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16}}>
          {BRANCH_SHEETS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px',
              background: appendP > i / BRANCH_SHEETS.length ? `${C.amber}22` : '#F3F3F3',
              border: `1px solid ${appendP > i / BRANCH_SHEETS.length ? C.amber : '#CFCFCF'}`, borderRadius: 4,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16"><rect x={2} y={3} width={12} height={10} fill="none" stroke="#0F6CBD" strokeWidth={1.5} rx={1} /><path d="M2 6h12M2 9h12" stroke="#0F6CBD" strokeWidth={0.8} /></svg>
              <span style={{flex: 1, fontFamily: 'Consolas, monospace', fontSize: 12}}>{s.name}</span>
              <span style={{color: '#5E5E5E', fontSize: 11}}>{s.rows.toLocaleString()} rows</span>
              {appendP > (i + 0.5) / BRANCH_SHEETS.length ? <span style={{color: C.green, fontSize: 14, fontWeight: 700}}>✓</span> : null}
            </div>
          ))}
        </div>
        {/* Append result */}
        <div style={{background: `${C.amber}11`, border: `2px solid ${C.amber}`, borderRadius: 6, padding: '12px 16px', marginBottom: 12}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
            <svg width={20} height={20} viewBox="0 0 20 20"><path d="M10 3v10M6 9l4 4 4-4" fill="none" stroke={C.amber} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{fontWeight: 700, color: '#92400E', fontSize: 14}}>Append Result:</span>
          </div>
          <div style={{fontFamily: 'Consolas, monospace', fontSize: 13, color: '#92400E'}}>
            Master Stream: {Math.floor(appendP * APPEND_TOTAL).toLocaleString()} rows
          </div>
        </div>
        {/* New file dropped (phase 2) */}
        {newFileP > 0.01 ? (
          <div style={{background: `${C.green}11`, border: `2px solid ${C.green}`, borderRadius: 6, padding: '12px 16px', opacity: newFileP, transform: `translateY(${(1 - newFileP) * 10}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
              <svg width={20} height={20} viewBox="0 0 20 20"><path d="M10 3v10M6 9l4 4 4-4" fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{fontWeight: 700, color: '#107C41', fontSize: 14}}>New File Detected:</span>
            </div>
            <div style={{fontFamily: 'Consolas, monospace', fontSize: 13, color: '#107C41', marginBottom: 8}}>
              Mansoura_Sales.xlsx dropped into folder
            </div>
            {/* Refresh button */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, background: refreshP > 0.3 ? C.green : '#E9E9E9',
              border: `2px solid ${C.green}`, borderRadius: 4, padding: '4px 16px',
              fontFamily: 'Segoe UI, sans-serif', fontSize: 13, fontWeight: 700, color: refreshP > 0.3 ? '#fff' : C.green,
              boxShadow: refreshP > 0.3 ? `0 0 12px ${C.green}88` : 'none',
            }}>
              <svg width={14} height={14} viewBox="0 0 14 14"><path d="M7 2a5 5 0 015 5M12 7a5 5 0 01-5 5M7 12a5 5 0 01-5-5M2 7a5 5 0 015-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" /></svg>
              Refresh
            </div>
            {refreshP > 0.5 ? (
              <div style={{marginTop: 8, fontFamily: 'Consolas, monospace', fontSize: 12, color: C.green, fontWeight: 700}}>
                ✓ Auto-merged: +13,200 rows → {(APPEND_TOTAL + 13200).toLocaleString()} total
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 280, z: 1.0}, prog(f, t(2), 30));

  const pqOpenP = prog(f, t(42), 10) * (1 - prog(f, t(85), 12));
  const appendP = prog(f, t(45), 18) * (1 - prog(f, t(85), 12));
  const newFileP = prog(f, t(60), 12) * (1 - prog(f, t(85), 12));
  const refreshP = prog(f, t(65), 14) * (1 - prog(f, t(85), 12));

  // Cursor: Data tab → Get Data → PQ opens → Refresh button
  const dataTabX = 580;
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const refreshBtnX = 720;
  const refreshBtnY = 430;
  const pts = dwell([
    {f: t(41), x: dataTabX, y: ribbonY},
    {f: t(65), x: refreshBtnX, y: refreshBtnY},
    {f: t(67), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [41, 65];
  const curHide = f > t(68);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Append.xlsx" nameBox="A1" formula="" tab="Data"
          cell={(r, c) => {
            // Master stream table (visible after append)
            if (appendP > 0.1 && r >= 1 && r <= 12 && c >= 1 && c <= 4) {
              if (r === 1) {
                const h = ['Branch', 'OrderID', 'Product', 'Amount'];
                return {t: h[c - 1], b: true, bg: `${C.amber}22`, al: c >= 3 ? 'r' : 'l', color: '#92400E'};
              }
              const visibleRows = Math.floor(appendP * 11);
              if (r - 1 <= visibleRows) {
                return c === 1 ? {t: 'Cairo', color: '#92400E'} : c === 2 ? {t: `ORD-${1000 + r}`, color: '#92400E'} : c === 3 ? {t: 'Mouse', color: '#92400E'} : {t: '1050', al: 'r', color: '#92400E'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Master stream border */}
          {appendP > 0.1 ? (
            <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 12} color={C.amber} p={appendP * 0.3} label="Master Stream (Append)" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 65 ? C.green : C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
          {/* PQ editor overlay */}
          <PQEditor p={pqOpenP} appendP={appendP} newFileP={newFileP} refreshP={refreshP} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="Power Query Append ──► Combines Multiple Tables/Files Vertically into One Master Stream" from={t(42.0)} to={t(65.0)} />
      {refreshP > 0.5 ? <Caption text="Dynamic Folder Ingestion ──► New Files Dropped into Folder Merge Automatically on Refresh" from={t(65.0)} to={t(84.0)} tone="ok" /> : null}
      {refreshP < 0.5 && pqOpenP > 0.1 ? <Caption text="Power Query Append ──► Combines Multiple Tables/Files Vertically into One Master Stream" from={t(42.0)} to={t(65.0)} /> : null}
    </Stage>
  );
};
