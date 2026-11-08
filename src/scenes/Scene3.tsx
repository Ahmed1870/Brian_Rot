import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC03: LET — legacy redundant formula transforms into LET on the SAME single Excel window.
// Phase 1 (86-100s): legacy formula =IF(XLOOKUP("CUST-002",A:A,B:B)>1000, XLOOKUP("CUST-002",A:A,B:B)*0.1, 0)
//   — XLOOKUP highlighted twice in red (redundant calculation).
// Phase 2 (100-120s): transform to =LET(Sales, XLOOKUP("CUST-002",A:A,B:B), IF(Sales>1000, Sales*0.1, 0))
//   — "Sales" variable glows purple, calculated ONCE.
// Phase 3 (120s+): performance boost badge.
const S = START.s3;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 120, 200, 100][c] ?? XL.colW;

const LEGACY_FORMULA = '=IF(XLOOKUP("CUST-002",A:A,B:B)>1000, XLOOKUP("CUST-002",A:A,B:B)*0.1, 0)';
const LET_FORMULA = '=LET(Sales, XLOOKUP("CUST-002",A:A,B:B), IF(Sales>1000, Sales*0.1, 0))';

// Customer data shown for context
const CUSTOMERS = [
  {id: 'CUST-001', name: 'Ahmed', sales: 850},
  {id: 'CUST-002', name: 'Sara', sales: 1500}, // >1000 → 10% commission
  {id: 'CUST-003', name: 'Omar', sales: 600},
  {id: 'CUST-004', name: 'Mona', sales: 2200},
  {id: 'CUST-005', name: 'Khaled', sales: 450},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 380, fy: 260, z: 1.12}, prog(f, t(2), 30));

  // Phase: 0 = legacy (86-100s), 1 = transform (100-120s), 2 = LET (120s+)
  const phase = f < t(100) ? 0 : f < t(120) ? 1 : 2;
  const transformP = phase === 1 ? prog(f, t(100), 20) : phase === 2 ? 1 : 0;

  // Formula shown: legacy first, then morphs to LET
  const showLet = phase >= 1;
  const formulaText = showLet
    ? LET_FORMULA.slice(0, Math.floor(typed(LET_FORMULA, f, t(100), 2).length))
    : LEGACY_FORMULA.slice(0, Math.floor(typed(LEGACY_FORMULA, f, t(86), 1.5).length));

  // Cursor: D2 → formula bar → Enter (during legacy), then re-click for LET transform
  const d2 = cellCenter(2, 4, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([
    {f: t(86), x: 200, y: fbY},
    {f: t(95), x: d2.x, y: d2.y},   // Enter legacy formula
    {f: t(100), x: 200, y: fbY},    // re-click formula bar to edit
    {f: t(120), x: d2.x, y: d2.y},  // Enter LET formula
    {f: t(122), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [95, 120];
  const curHide = f > t(123);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  // Redundant XLOOKUP highlights (legacy phase)
  const redundantP = phase === 0 ? prog(f, t(92), 14) : 0;
  // Sales variable glow (LET phase)
  const salesVarP = phase === 2 ? prog(f, t(122), 14) * (1 - prog(f, t(130), 12)) : 0;
  // Performance boost badge
  const boostP = phase === 2 ? prog(f, t(125), 14) * (1 - prog(f, t(130), 12)) : 0;

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="LET_Optimization.xlsx" nameBox="D2" formula={formulaText} fbEdit={f >= t(86) && f < t(95.5) || (f >= t(100) && f < t(120.5))}
          cell={(r, c) => {
            if (r === 1) {
              if (c < 1 || c > 4) return undefined;
              const h = ['CustomerID', 'CustomerName', 'Sales', 'Commission'];
              const al: 'l' | 'r' = c >= 3 ? 'r' : 'l';
              return {t: h[c - 1], b: true, bg: '#E2EFDA', al};
            }
            const cust = CUSTOMERS[r - 2];
            if (!cust || c < 1 || c > 4) return undefined;
            switch (c) {
              case 1: return {t: cust.id};
              case 2: return {t: cust.name};
              case 3: return {t: 'EGP ' + cust.sales.toLocaleString('en-US'), al: 'r'};
              case 4: {
                // Commission result: only for CUST-002 (row 3)
                if (r === 3 && phase >= 1) {
                  return {t: 'EGP 150', al: 'r', color: '#107C41'};
                }
                return undefined;
              }
            }
          }} colW={colW}
          sel={{r1: 2, c1: 4, r2: 2, c2: 4}} active={{r: 2, c: 4}}
          thumb={0} thumbSize={0.55}
        >
          {/* Highlight CUST-002 row (the lookup target) */}
          <Neon x={cellCenter(3, 1, {colW}).x - colW(1) / 2} y={cellCenter(3, 1, {colW}).y - XL.rowH / 2} w={colW(1) + colW(2) + colW(3)} h={XL.rowH} color={C.blue} p={prog(f, t(88), 12) * (1 - prog(f, t(130), 12)) * 0.4} />
          {/* Result cell D3 */}
          {phase >= 1 ? (
            <Neon x={cellCenter(3, 4, {colW}).x - colW(4) / 2} y={cellCenter(3, 4, {colW}).y - XL.rowH / 2} w={colW(4)} h={XL.rowH} color={C.green} p={prog(f, t(100), 12) * (1 - prog(f, t(130), 12))} label="= Sales × 10%" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase >= 1 ? C.green : C.red} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Redundant calculation warning (legacy phase) */}
      {redundantP > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: redundantP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.red}`, borderRadius: 14, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.red}22, 0 0 30px ${C.red}44`, display: 'flex', alignItems: 'center', gap: 14}}>
            <svg width={30} height={30} viewBox="0 0 30 30"><circle cx={15} cy={15} r={13} fill="none" stroke={C.red} strokeWidth={2.5} /><line x1={9} y1={9} x2={21} y2={21} stroke={C.red} strokeWidth={2.5} strokeLinecap="round" /><line x1={21} y1={9} x2={9} y2={21} stroke={C.red} strokeWidth={2.5} strokeLinecap="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.red}}>Redundant Calculation ──► XLOOKUP evaluated TWICE (slow &amp; error-prone)</span>
          </div>
        </div>
      ) : null}

      {/* Performance boost badge (LET phase) */}
      {boostP > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: boostP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.green}`, borderRadius: 14, padding: '12px 32px', boxShadow: `0 0 0 6px ${C.green}22, 0 0 30px ${C.green}44`, display: 'flex', alignItems: 'center', gap: 14}}>
            <svg width={32} height={32} viewBox="0 0 32 32"><polyline points="6,16 13,23 26,8" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.green}}>LET Performance Boost ──► XLOOKUP calculated ONCE → variable "Sales" reused</span>
          </div>
        </div>
      ) : null}

      <TopBadge text="LET Function Mechanics ──► Define Variables, Eliminate Redundant Calculation" from={t(86.0)} to={t(110.0)} />
      {boostP < 0.01 && redundantP < 0.01 ? <Caption text="Performance Boost ──► Calculates Expressions ONCE to Eliminate Calculation Bottlenecks" from={t(110.0)} to={t(129.0)} tone="ok" /> : null}
    </Stage>
  );
};
