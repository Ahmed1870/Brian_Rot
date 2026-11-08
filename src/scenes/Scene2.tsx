import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {AUDIT_TOTAL, EVAL_FORMULA, EVAL_STEPS, WATCH_ITEMS, auditCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track,
} from '../kit';

// SC02: Evaluate Formula + Watch Window — single Excel window.
// Phase 1 (40-65s): Evaluate Formula dialog opens, user clicks Evaluate 5 times, each step shows underlined expr → value.
// Phase 2 (65-85s): Watch Window docks (floating panel), showing 3 KPI cells.
const S = START.s2;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 200, 80, 120, 140][c] ?? XL.colW;

/** Evaluate Formula dialog overlay. */
const EvalDialog: React.FC<{p: number; stepIdx: number; stepUnderline: string}> = ({p, stepIdx, stepUnderline}) => {
  if (p <= 0.01) return null;
  const step = EVAL_STEPS[Math.min(stepIdx, EVAL_STEPS.length - 1)];
  return (
    <div style={{position: 'absolute', left: 350, top: 120, width: 800, height: 480, background: '#fff', border: '1px solid #8C8C8C', boxShadow: '0 12px 40px rgba(0,0,0,0.6)', borderRadius: 7, opacity: p, zIndex: 40, overflow: 'hidden', transform: `scale(${0.95 + 0.05 * p})`}}>
      {/* Title */}
      <div style={{height: 32, background: '#fff', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', paddingLeft: 12}}>
        <span style={{fontFamily: 'Segoe UI, Open Sans, sans-serif', fontSize: 12.5, color: '#1B1B1B', fontWeight: 600}}>Evaluate Formula</span>
        <svg width={12} height={12} viewBox="0 0 12 12" style={{marginLeft: 'auto', marginRight: 12}}><path d="M1 1l10 10M11 1L1 11" stroke="#333" strokeWidth={1.1} /></svg>
      </div>
      {/* Body */}
      <div style={{padding: '14px 18px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, color: '#1B1B1B'}}>
        <div style={{marginBottom: 10, fontWeight: 600}}>Reference: 'Sales'!E20</div>
        {/* Formula with underline highlight */}
        <div style={{background: '#F3F3F3', border: '1px solid #CFCFCF', padding: '12px 10px', fontFamily: 'Consolas, monospace', fontSize: 15, color: '#242424', minHeight: 60, lineHeight: 1.6, position: 'relative', overflow: 'hidden', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
          {step.expr.split(step.underline).map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && step.underline ? (
                <span style={{background: `${C.amber}66`, borderBottom: `2px solid ${C.amber}`, color: '#92400E', fontWeight: 700}}>{step.underline}</span>
              ) : null}
            </React.Fragment>
          ))}
        </div>
        {/* Evaluation display */}
        <div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{color: '#5E5E5E'}}>Evaluation:</span>
          <span style={{background: `${C.amber}22`, border: `1px solid ${C.amber}`, borderRadius: 4, padding: '2px 10px', fontFamily: 'Consolas, monospace', fontSize: 14, fontWeight: 700, color: '#92400E'}}>
            {step.value !== undefined ? (typeof step.value === 'boolean' ? (step.value ? 'TRUE' : 'FALSE') : String(step.value)) : ''}
          </span>
        </div>
      </div>
      {/* Footer buttons */}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, borderTop: '1px solid #E5E5E5', background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14, gap: 8}}>
        <div style={{border: '1px solid #ADADAD', background: '#E9E9E9', padding: '4px 16px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3}}>Close</div>
        <div style={{border: '1px solid #ADADAD', background: '#E9E9E9', padding: '4px 16px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3}}>Step In</div>
        <div style={{border: '2px solid #0F6CBD', background: '#CFE8D8', padding: '4px 22px', fontFamily: 'Segoe UI, sans-serif', fontSize: 12, borderRadius: 3, fontWeight: 700}}>Evaluate</div>
      </div>
    </div>
  );
};

/** Watch Window floating panel. */
const WatchWindow: React.FC<{p: number}> = ({p}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 50, top: 120, width: 520, background: '#fff', border: `2px solid ${C.cyan}`, boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${C.cyan}55`, borderRadius: 7, opacity: p, zIndex: 42, overflow: 'hidden', transform: `scale(${0.9 + 0.1 * p})`}}>
      {/* Title bar */}
      <div style={{height: 30, background: C.cyan, display: 'flex', alignItems: 'center', paddingLeft: 12}}>
        <span style={{fontFamily: 'Segoe UI, sans-serif', fontSize: 12.5, color: '#fff', fontWeight: 700}}>Watch Window</span>
        <svg width={12} height={12} viewBox="0 0 12 12" style={{marginLeft: 'auto', marginRight: 10}}><path d="M1 1l10 10M11 1L1 11" stroke="#fff" strokeWidth={1.3} /></svg>
      </div>
      {/* Header row */}
      <div style={{display: 'flex', background: '#F3F3F3', borderBottom: '1px solid #CFCFCF', fontFamily: 'Segoe UI, sans-serif', fontSize: 11, fontWeight: 700, color: '#1B1B1B'}}>
        <div style={{width: 80, padding: '4px 8px', borderRight: '1px solid #CFCFCF'}}>Book</div>
        <div style={{width: 90, padding: '4px 8px', borderRight: '1px solid #CFCFCF'}}>Sheet</div>
        <div style={{width: 70, padding: '4px 8px', borderRight: '1px solid #CFCFCF'}}>Cell</div>
        <div style={{flex: 1, padding: '4px 8px'}}>Value</div>
      </div>
      {/* Data rows */}
      {WATCH_ITEMS.map((item, i) => (
        <div key={i} style={{display: 'flex', fontFamily: 'Segoe UI, sans-serif', fontSize: 11, color: '#1B1B1B', borderBottom: i < WATCH_ITEMS.length - 1 ? '1px solid #E5E5E5' : 'none'}}>
          <div style={{width: 80, padding: '4px 8px', borderRight: '1px solid #CFCFCF'}}>Sales</div>
          <div style={{width: 90, padding: '4px 8px', borderRight: '1px solid #CFCFCF'}}>{item.sheet}</div>
          <div style={{width: 70, padding: '4px 8px', borderRight: '1px solid #CFCFCF', fontFamily: 'Consolas, monospace', fontWeight: 700, color: '#0F6CBD'}}>{item.cell}</div>
          <div style={{flex: 1, padding: '4px 8px', fontFamily: 'Consolas, monospace', fontWeight: 700, color: '#107C41'}}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 280, z: 1.08}, prog(f, t(2), 30));

  // Phase 1: Evaluate Formula dialog (42-60s)
  const evalOpenP = prog(f, t(42), 10);
  // Step index: each Evaluate click advances the step (every 3s)
  const evalStepIdx = Math.floor(clamp((f - t(45)) / sec(15)) * (EVAL_STEPS.length - 1));
  const evalCloseP = f >= t(60) ? prog(f, t(60), 8) : 0;
  const evalVisibleP = evalOpenP * (1 - evalCloseP);

  // Phase 2: Watch Window (65-85s)
  const watchP = f >= t(65) ? prog(f, t(65), 12) * (1 - prog(f, t(85), 12)) : 0;

  // Cursor: Formulas tab → Evaluate Formula icon → Evaluate button (×5) → Watch Window icon
  const formulasTabX = 580;
  const evalIconX = 880;
  const evalBtnX = 1080;
  const evalBtnY = 565;
  const watchIconX = 940;
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const pts = dwell([
    {f: t(41), x: formulasTabX, y: ribbonY},
    {f: t(42), x: evalIconX, y: ribbonY},
    {f: t(45), x: evalBtnX, y: evalBtnY},
    {f: t(48), x: evalBtnX, y: evalBtnY},
    {f: t(51), x: evalBtnX, y: evalBtnY},
    {f: t(54), x: evalBtnX, y: evalBtnY},
    {f: t(57), x: evalBtnX, y: evalBtnY},
    {f: t(65), x: watchIconX, y: ribbonY},
    {f: t(67), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [42, 45, 48, 51, 54, 57, 65];
  const curHide = f > t(68);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Sales_Audit.xlsx" nameBox="E20" formula={EVAL_FORMULA} tab="Formulas"
          cell={(r, c) => {
            if (c === 5 && r === 20) {
              return {t: 'EGP ' + AUDIT_TOTAL.toLocaleString('en-US'), al: 'r', b: true, bg: '#D1FAE5', color: '#107C41'};
            }
            return auditCell(r, c) as any;
          }} colW={colW}
          sel={{r1: 20, c1: 5, r2: 20, c2: 5}} active={{r: 20, c: 5}}
          thumb={0} thumbSize={0.55}
        >
          {/* Highlight E20 */}
          <Neon x={cellCenter(20, 5, {colW}).x - colW(5) / 2} y={cellCenter(20, 5, {colW}).y - XL.rowH / 2} w={colW(5)} h={XL.rowH} color={C.amber} p={prog(f, t(42), 12) * (1 - prog(f, t(85), 12))} label="Audited cell" labelBelow />
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 65 ? C.cyan : C.amber} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
          {/* Evaluate Formula dialog */}
          <EvalDialog p={evalVisibleP} stepIdx={evalStepIdx} stepUnderline={EVAL_STEPS[Math.min(evalStepIdx, EVAL_STEPS.length - 1)].underline} />
          {/* Watch Window */}
          <WatchWindow p={watchP} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="Evaluate Formula ──► Step-by-Step Execution Inspection for Complex Nested Formulas" from={t(42.0)} to={t(65.0)} />
      {watchP < 0.01 ? <Caption text="Evaluate Formula ──► Step-by-Step Execution Inspection for Complex Nested Formulas" from={t(42.0)} to={t(65.0)} /> : <Caption text="Watch Window ──► Floating Monitor Box for Critical KPI Cells Across Multiple Sheets" from={t(65.0)} to={t(84.0)} tone="ok" />}
    </Stage>
  );
};
