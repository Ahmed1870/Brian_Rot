import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {DUP_CUSTOMERS, DUP_COUNT, UNIQUE_CUSTOMERS_AFTER_DEDUP} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC03: Remove Duplicates — single Excel window with the Remove Duplicates dialog overlay.
// Cursor clicks Data → Remove Duplicates icon, dialog opens, user selects Customer ID column,
// clicks OK, duplicate rows vaporize (fade out + collapse), confirmation popup appears.
const S = START.s3;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 130, 200, 140][c] ?? XL.colW;

/** Remove Duplicates dialog overlay. */
const RemoveDupDialog: React.FC<{p: number; okHot: boolean}> = ({p, okHot}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 480, top: 200, width: 520, background: '#fff', border: '1px solid #8C8C8C', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', borderRadius: 7, opacity: p, zIndex: 40, overflow: 'hidden', transform: `scale(${0.95 + 0.05 * p})`}}>
      {/* Title */}
      <div style={{height: 32, background: '#fff', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', paddingLeft: 12}}>
        <span style={{fontFamily: 'Segoe UI, Open Sans, sans-serif', fontSize: 12.5, color: '#1B1B1B', fontWeight: 600}}>Remove Duplicates</span>
        <svg width={12} height={12} viewBox="0 0 12 12" style={{marginLeft: 'auto', marginRight: 12}}><path d="M1 1l10 10M11 1L1 11" stroke="#333" strokeWidth={1.1} /></svg>
      </div>
      {/* Body */}
      <div style={{padding: '14px 18px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, color: '#1B1B1B'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10}}>
          <div style={{width: 14, height: 14, border: '1px solid #555', background: '#1B1B1B'}} />
          <span>My data has headers</span>
        </div>
        <div style={{marginBottom: 6, fontWeight: 600}}>Columns:</div>
        <div style={{background: '#F3F3F3', border: '1px solid #CFCFCF', padding: '6px', height: 140, overflow: 'hidden'}}>
          {['Customer ID', 'Customer Name', 'Branch'].map((col, i) => (
            <div key={col} style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4}}>
              <div style={{width: 14, height: 14, border: '1px solid #555', background: i === 0 ? '#1B1B1B' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {i === 0 ? <svg width={10} height={10} viewBox="0 0 10 10"><polyline points="1,5 4,8 9,2" fill="none" stroke="#fff" strokeWidth={2} /></svg> : null}
              </div>
              <span style={{color: i === 0 ? '#1B1B1B' : '#888', fontWeight: i === 0 ? 600 : 400}}>{col}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div style={{height: 48, borderTop: '1px solid #E5E5E5', background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14, gap: 8}}>
        <div style={{border: '1px solid #ADADAD', background: '#E9E9E9', padding: '4px 18px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3}}>Cancel</div>
        <div style={{border: `2px solid ${okHot ? '#0F6CBD' : '#ADADAD'}`, background: okHot ? '#CFE8D8' : '#E9E9E9', padding: '4px 18px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3, fontWeight: 700, boxShadow: okHot ? '0 0 12px rgba(15,108,189,0.5)' : 'none'}}>OK</div>
      </div>
    </div>
  );
};

/** Confirmation popup after dedup. */
const ConfirmPopup: React.FC<{p: number; removed: number; remain: number}> = ({p, removed, remain}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 620, top: 280, width: 400, background: '#fff', border: `2px solid ${C.purple}`, borderRadius: 8, boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${C.purple}55`, opacity: p, zIndex: 45, padding: '20px 24px', transform: `scale(${0.9 + 0.1 * p})`}}>
      <div style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 13, color: '#1B1B1B', marginBottom: 8, fontWeight: 600}}>Microsoft Excel</div>
      <div style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 13, color: '#1B1B1B', lineHeight: 1.5}}>
        {removed} duplicate values found and removed;<br />
        {remain} unique values remain.
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 16}}>
        <div style={{border: '2px solid #0F6CBD', background: '#CFE8D8', padding: '4px 24px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3, fontWeight: 700}}>OK</div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 260, z: 1.1}, prog(f, t(2), 30));

  // Phase: 0 = show data with dups, 1 = dialog open, 2 = vaporizing, 3 = clean data + popup
  const dialogP = prog(f, t(88), 12) * (1 - prog(f, t(96), 8));
  const okHot = Math.abs(f - t(96)) < 6;
  const vaporizing = f >= t(96) && f < t(100);
  const cleanP = prog(f, t(100), 14) * (1 - prog(f, t(130), 12));
  const popupP = cleanP;

  // Which rows are duplicates (indices in DUP_CUSTOMERS)
  const dupIndices = [2, 4, 6, 8]; // 0-based indices of duplicates

  // Cursor: Data tab → Remove Duplicates icon → OK → popup OK
  const dataTabX = 580;
  const rdIconX = 700;
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const dialogOkX = 920;
  const dialogOkY = 540;
  const popupOkX = 970;
  const popupOkY = 360;
  const pts = dwell([
    {f: t(87), x: dataTabX, y: ribbonY},
    {f: t(88), x: rdIconX, y: ribbonY},
    {f: t(96), x: dialogOkX, y: dialogOkY},
    {f: t(101), x: popupOkX, y: popupOkY},
    {f: t(103), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [87, 88, 96, 101];
  const curHide = f > t(104);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="RemoveDuplicates.xlsx" nameBox="A1" formula="" tab="Data"
          cell={(r, c) => {
            if (r === 1) {
              if (c < 1 || c > 3) return undefined;
              const h = ['Customer ID', 'Customer Name', 'Branch'];
              return {t: h[c - 1], b: true, bg: '#E2EFDA', al: 'l'};
            }
            // After dedup: only show unique rows
            if (cleanP > 0.5) {
              const idx = r - 2;
              if (idx < 0 || idx >= UNIQUE_CUSTOMERS_AFTER_DEDUP.length) return undefined;
              const row = UNIQUE_CUSTOMERS_AFTER_DEDUP[idx];
              switch (c) {
                case 1: return {t: row.id, color: '#107C41'};
                case 2: return {t: row.name, color: '#107C41'};
                case 3: return {t: row.branch, color: '#107C41'};
              }
            }
            // Before/ during dedup: show all rows
            const idx = r - 2;
            if (idx < 0 || idx >= DUP_CUSTOMERS.length) return undefined;
            const row = DUP_CUSTOMERS[idx];
            // During vaporizing: duplicate rows fade
            if (vaporizing && dupIndices.includes(idx)) {
              const rowVaporP = clamp((f - t(96)) / sec(4));
              return {t: '', bg: `rgba(167,139,250,${0.3 * (1 - rowVaporP)})`, color: '#A855F7'};
            }
            switch (c) {
              case 1: return {t: row.id};
              case 2: return {t: row.name};
              case 3: return {t: row.branch};
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Highlight Customer ID column (the key) */}
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1)} h={geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop} color={C.purple} p={prog(f, t(86), 12) * 0.4 * (1 - prog(f, t(130), 12))} label="Key column" labelBelow />
          {/* Clean data highlight */}
          {cleanP > 0.5 ? (
            <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1) + colW(2) + colW(3)} h={UNIQUE_CUSTOMERS_AFTER_DEDUP.length * XL.rowH + XL.colH} color={C.green} p={cleanP * 0.3} label="Unique rows remain" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.purple} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
          {/* Dialog + popup */}
          <RemoveDupDialog p={dialogP} okHot={okHot} />
          <ConfirmPopup p={popupP} removed={DUP_COUNT} remain={UNIQUE_CUSTOMERS_AFTER_DEDUP.length} />
        </ExcelApp>
      </ExcelWindow>

      {/* Destructive warning badge (bottom) */}
      {cleanP > 0.3 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: clamp(cleanP * 0.8 - 0.2) * (1 - prog(f, t(130), 12))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, background: `${C.red}22`, border: `2.5px solid ${C.red}`, borderRadius: 999, padding: '10px 28px', boxShadow: `0 0 30px ${C.red}44`}}>
            <svg width={28} height={28} viewBox="0 0 28 28"><path d="M14 3 L26 24 H2 Z" fill="none" stroke={C.red} strokeWidth={2.5} strokeLinejoin="round" /><line x1={14} y1={11} x2={14} y2={17} stroke={C.red} strokeWidth={2.5} strokeLinecap="round" /><circle cx={14} cy={21} r={1.5} fill={C.red} /></svg>
            <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.red}}>Destructive Action ──► Permanent modification (Always keep a backup copy)</span>
          </div>
        </div>
      ) : null}

      <TopBadge text="Remove Duplicates Tool ──► Permanent Deduplication Based on Key Columns" from={t(86.0)} to={t(110.0)} />
      {cleanP < 0.3 ? <Caption text="Destructive Warning ──► Permanently Alters Source Data (Always Keep Backup Copy)" from={t(110.0)} to={t(129.0)} tone="danger" /> : null}
    </Stage>
  );
};
