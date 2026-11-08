import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {SKU_RAW, SKU_SPLIT, TEXT_DATES_FIXED, TEXT_DATES_RAW} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC02: Text to Columns — single Excel window.
// Phase 1 (40-55s): comma-separated SKUs split into 3 columns (Data tab → Text to Columns → Delimited, Comma).
// Phase 2 (55-85s): text-formatted dates → real dates (Step 3: Date YMD).
// The cursor clicks through the ribbon (Data tab → Text to Columns icon) and the wizard opens as an overlay.
const S = START.s2;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 220, 100, 100, 100][c] ?? XL.colW;

/** Text to Columns wizard dialog (3 steps). */
const Wizard: React.FC<{step: number; p: number; mode: 'delimited' | 'date'}> = ({step, p, mode}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 380, top: 130, width: 700, height: 460, background: '#fff', border: '1px solid #8C8C8C', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', borderRadius: 7, opacity: p, zIndex: 40, overflow: 'hidden', transform: `scale(${0.95 + 0.05 * p})`}}>
      {/* Title bar */}
      <div style={{height: 32, background: '#fff', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', paddingLeft: 12}}>
        <span style={{fontFamily: 'Segoe UI, Open Sans, sans-serif', fontSize: 12.5, color: '#1B1B1B'}}>Convert Text to Columns Wizard</span>
        <span style={{marginLeft: 'auto', marginRight: 56, fontWeight: 600, fontFamily: 'Segoe UI, sans-serif', fontSize: 12, color: '#444'}}>?</span>
        <svg width={12} height={12} viewBox="0 0 12 12" style={{marginRight: 12}}><path d="M1 1l10 10M11 1L1 11" stroke="#333" strokeWidth={1.1} /></svg>
      </div>
      {/* Step indicator */}
      <div style={{padding: '14px 18px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, color: '#1B1B1B'}}>
        <div style={{marginBottom: 10, fontWeight: 700}}>Step {step} of 3</div>
        {step === 1 ? (
          <div>
            <div style={{marginBottom: 8}}>Choose the file type that best describes your data:</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6}}>
              <div style={{width: 14, height: 14, border: '1px solid #555', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {mode === 'delimited' ? <div style={{width: 8, height: 8, borderRadius: 4, background: '#1B1B1B'}} /> : null}
              </div>
              <span>Delimited — Characters such as commas or tabs separate each field</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <div style={{width: 14, height: 14, border: '1px solid #555', borderRadius: 7}} />
              <span style={{color: '#888'}}>Fixed width — Fields are aligned in columns with spaces</span>
            </div>
          </div>
        ) : null}
        {step === 2 ? (
          <div>
            <div style={{marginBottom: 8, fontWeight: 700}}>Delimiters</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6}}>
              <div style={{width: 14, height: 14, border: '1px solid #555', background: mode === 'delimited' ? '#1B1B1B' : '#fff'}} />
              <span>Comma</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6}}>
              <div style={{width: 14, height: 14, border: '1px solid #555'}} />
              <span style={{color: '#888'}}>Tab</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <div style={{width: 14, height: 14, border: '1px solid #555'}} />
              <span style={{color: '#888'}}>Space</span>
            </div>
            <div style={{marginTop: 12, background: '#F3F3F3', border: '1px solid #CFCFCF', padding: '6px 8px', fontFamily: 'Consolas, monospace', fontSize: 12, color: '#444'}}>
              Data preview: {mode === 'delimited' ? 'CAIRO | STORE | 2026' : '2026-12-31'}
            </div>
          </div>
        ) : null}
        {step === 3 ? (
          <div>
            <div style={{marginBottom: 8}}>Column data format:</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8}}>
              <div style={{width: 14, height: 14, border: '1px solid #555', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {mode === 'date' ? <div style={{width: 8, height: 8, borderRadius: 4, background: '#1B1B1B'}} /> : null}
              </div>
              <span>Date:</span>
              <div style={{border: '1px solid #8A8A8A', background: '#fff', padding: '2px 8px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, color: '#1B1B1B'}}>MDY ▾</div>
            </div>
            <div style={{marginTop: 10, background: '#F3F3F3', border: '1px solid #CFCFCF', padding: '6px 8px', fontFamily: 'Consolas, monospace', fontSize: 12, color: '#444'}}>
              Preview: {mode === 'date' ? '12/31/2026' : 'CAIRO | STORE | 2026'}
            </div>
          </div>
        ) : null}
      </div>
      {/* Footer buttons */}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, borderTop: '1px solid #E5E5E5', background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14, gap: 8}}>
        <div style={{border: '1px solid #ADADAD', background: '#E9E9E9', padding: '4px 16px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3}}>Cancel</div>
        <div style={{border: '1px solid #ADADAD', background: '#E9E9E9', padding: '4px 16px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3}}>&lt; Back</div>
        <div style={{border: '2px solid #0F6CBD', background: '#E9E9E9', padding: '4px 16px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3, fontWeight: 700}}>Next &gt;</div>
        <div style={{border: '2px solid #0F6CBD', background: '#CFE8D8', padding: '4px 16px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3, fontWeight: 700}}>Finish</div>
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 360, fy: 240, z: 1.12}, prog(f, t(2), 30));

  // Phase 1: SKU split (40-55s). Phase 2: date conversion (55-85s).
  const phase2 = f >= t(55);
  const splitP = prog(f, t(48), 14); // SKU columns appear
  const dateP = prog(f, t(63), 14);   // dates convert

  // Wizard overlay
  const wizardStep1P = prog(f, t(43), 10) * (1 - prog(f, t(46), 8));
  const wizardStep2P = prog(f, t(46), 10) * (1 - prog(f, t(49), 8));
  const wizardStep3P_date = prog(f, t(58), 10) * (1 - prog(f, t(63), 8));

  // Cursor: Data tab → Text to Columns icon (ribbon) → wizard steps
  const dataTabX = 580; // approximate Data tab position in ribbon
  const ttcIconX = 640; // Text to Columns icon in Data ribbon
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const wizardNext1X = 1020; // Next button in wizard step 1
  const wizardNext1Y = 560;
  const pts = dwell([
    {f: t(42), x: dataTabX, y: ribbonY},      // click Data tab
    {f: t(43), x: ttcIconX, y: ribbonY},      // click Text to Columns
    {f: t(46), x: wizardNext1X, y: wizardNext1Y},  // click Next (step 1→2)
    {f: t(49), x: wizardNext1X, y: wizardNext1Y},  // click Next (step 2→3) — but for split we finish here
    {f: t(57), x: dataTabX, y: ribbonY},      // re-click Data tab for dates
    {f: t(58), x: ttcIconX, y: ribbonY},      // Text to Columns for dates
    {f: t(63), x: 800, y: 560},               // Finish for date conversion
    {f: t(65), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [42, 43, 46, 49, 57, 58, 63];
  const curHide = f > t(66);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="TextToColumns.xlsx" nameBox="A1" formula="" tab="Data"
          cell={(r, c) => {
            if (phase2) {
              // Phase 2: dates
              if (r === 1) {
                if (c < 1 || c > 1) return undefined;
                return {t: 'Date (Text)', b: true, bg: '#E2EFDA', al: 'l'};
              }
              const idx = r - 2;
              if (idx < 0 || idx >= TEXT_DATES_RAW.length) return undefined;
              if (dateP > 0.5) {
                return {t: TEXT_DATES_FIXED[idx], color: '#107C41'};
              }
              return {t: TEXT_DATES_RAW[idx], color: '#92400E'};
            }
            // Phase 1: SKUs
            if (r === 1) {
              if (c < 1 || c > 3) return undefined;
              if (c === 1) return {t: 'Merged SKU', b: true, bg: '#E2EFDA', al: 'l'};
              return {t: `Col ${c - 1}`, b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
            }
            const idx = r - 2;
            if (idx < 0 || idx >= SKU_RAW.length) return undefined;
            if (c === 1) {
              return {t: SKU_RAW[idx], color: splitP > 0.5 ? '#92400E' : undefined};
            }
            if (splitP > 0.3 && c >= 2 && c <= 3) {
              const parts = SKU_SPLIT[idx];
              if (parts && parts[c - 2]) {
                return {t: parts[c - 2], color: '#107C41'};
              }
            }
            return undefined;
          }} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Highlight source column A */}
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1)} h={geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop} color={phase2 ? C.amber : C.blue} p={prog(f, t(42), 12) * 0.3 * (1 - prog(f, t(85), 12))} label={phase2 ? 'Text dates' : 'Source'} labelBelow />
          {/* Split result highlight */}
          {!phase2 && splitP > 0.3 ? (
            <Neon x={cellCenter(1, 2, {colW}).x - colW(2) / 2} y={geo(1, 0, 1).rowsTop} w={colW(2) + colW(3)} h={geo(1, 0, 1).rowsBottom - geo(1, 0, 1).rowsTop} color={C.amber} p={splitP * 0.4} label="Split columns" labelBelow />
          ) : null}
          {/* Date conversion highlight */}
          {phase2 && dateP > 0.5 ? (
            <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={geo(1, 0, 1).rowsTop} w={colW(1)} h={(TEXT_DATES_RAW.length + 1) * XL.rowH} color={C.green} p={dateP} label="Real Excel dates" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase2 && c >= 57 ? C.green : C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
          {/* Wizard overlays */}
          <Wizard step={1} p={wizardStep1P} mode={phase2 ? 'date' : 'delimited'} />
          <Wizard step={2} p={wizardStep2P} mode={phase2 ? 'date' : 'delimited'} />
          {phase2 ? <Wizard step={3} p={wizardStep3P_date} mode="date" /> : null}
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="Text to Columns Wizard ──► Split by Delimiters or Convert Text Dates" from={t(42.0)} to={t(60.0)} />
      {phase2 && dateP < 0.3 ? <Caption text="Secret Date Fixer ──► Convert Text-Formatted Dates to Native Excel Dates via Step 3" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
      {!phase2 ? <Caption text="Text to Columns ──► Split by Delimiters (Comma, Tab, Space) or Fixed Width" from={t(42.0)} to={t(55.0)} /> : null}
    </Stage>
  );
};
