import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {TXNS, txnCell} from '../data';
import {
  CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec,
} from '../kit';

// SC04: Reverse Search Engine — search_mode = -1 (bottom-up scan).
// Anchors (s): 131.0 table | 135.0 formula with -1 | 140.0 bottom-up scan | 145.0 lock on latest | 155.0 comparison
const S = START.s4;
const t = (g: number) => sec(g - S);

const txnColW = (c: number) => [0, 130, 130, 130, 160][c] ?? XL.colW;
const cc = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += txnColW(i);
  return {x: x + txnColW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

const BottomUpScan: React.FC<{p: number; lockedP: number; lockRow: number}> = ({p, lockedP, lockRow}) => {
  const g = geo(1, 0, 1);
  const colB = cc(1, 2);
  const topY = g.colTop + 4;
  const bottomY = cc(TXNS.length + 1, 2).y;
  const scanY = bottomY - (bottomY - topY) * p;
  const lockY = cc(lockRow, 2).y;
  return (
    <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 26}}>
      {p > 0 && p < 1 ? (
        <>
          <line x1={colB.x} y1={bottomY} x2={colB.x} y2={scanY} stroke={C.cyan} strokeWidth={4} strokeDasharray="8 5" opacity={0.9} />
          <circle cx={colB.x} cy={scanY} r={10} fill={C.cyan} opacity={0.95}>
            <animate attributeName="r" values="8;12;8" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <text x={colB.x + 22} y={scanY + 6} fill={C.cyan} fontFamily="Consolas, monospace" fontSize={18} fontWeight={700}>↑ scanning up</text>
        </>
      ) : null}
      {lockedP > 0 ? (
        <>
          <circle cx={colB.x} cy={lockY} r={18 + 8 * (1 - lockedP)} fill="none" stroke={C.cyan} strokeWidth={4} opacity={lockedP} />
          <rect x={cc(lockRow, 1).x - txnColW(1) / 2} y={lockY - XL.rowH / 2} width={txnColW(1) + txnColW(2) + txnColW(3) + txnColW(4)} height={XL.rowH} fill="none" stroke={C.cyan} strokeWidth={3.5} opacity={lockedP * 0.95} rx={3} />
          <text x={cc(lockRow, 4).x + txnColW(4) / 2 + 14} y={lockY + 6} fill={C.cyan} fontFamily="Consolas, monospace" fontSize={18} fontWeight={700} opacity={lockedP}>✓ latest record</text>
        </>
      ) : null}
    </svg>
  );
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 320, fy: 280, z: 1.15}, prog(f, t(2), 30));

  const scanP = prog(f, t(140), 18);
  const lockP = prog(f, t(145), 14) * (1 - prog(f, t(170), 12));
  const lockRow = 10;
  const lookupP = prog(f, t(131), 12) * (1 - prog(f, t(170), 12));
  const g = geo(1, 0, 1);
  const showCmp = lockP > 0.01;

  return (
    <Stage dur={SCENES.s4.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Transactions.xlsx" nameBox="E2" formula='=XLOOKUP("CUST-001", B2:B11, D2:D11, , , -1)'
          cell={(r, c) => txnCell(r, c) as any} colW={txnColW}
          sel={{r1: 2, c1: 5, r2: 2, c2: 5}} active={{r: 2, c: 5}} thumb={0} thumbSize={0.55}
        >
          <Neon x={cc(1, 2).x - txnColW(2) / 2} y={g.colTop} w={txnColW(2)} h={g.rowsBottom - g.colTop} color={C.blue} p={prog(f, t(132), 12) * 0.4 * (1 - prog(f, t(170), 12))} label="lookup_array" labelBelow />
          <Neon x={cc(1, 4).x - txnColW(4) / 2} y={g.colTop} w={txnColW(4)} h={g.rowsBottom - g.colTop} color={C.green} p={prog(f, t(133), 12) * 0.4 * (1 - prog(f, t(170), 12))} label="return_array" labelBelow />
          <Neon x={cc(2, 5).x - txnColW(5) / 2} y={cc(2, 5).y - XL.rowH / 2} w={txnColW(5)} h={XL.rowH} color={C.amber} p={lookupP} label="lookup_value" labelBelow />
          {[2, 4, 6, 8, 10].map((r) => (
            <Neon key={r} x={cc(r, 2).x - txnColW(2) / 2} y={cc(r, 2).y - XL.rowH / 2} w={txnColW(2)} h={XL.rowH} color={C.amber} p={prog(f, t(134), 12) * 0.3 * (1 - prog(f, t(140), 12))} />
          ))}
          <BottomUpScan p={scanP} lockedP={lockP} lockRow={lockRow} />
          {/* Result badge — large cyan box */}
          {lockP > 0 ? (
            <div style={{
              position: 'absolute',
              left: cc(2, 6).x - 100,
              top: cc(2, 6).y - XL.rowH / 2 - 4,
              width: 200, height: XL.rowH + 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: lockP, transform: `scale(${0.85 + 0.15 * lockP})`, zIndex: 28,
            }}>
              <div style={{
                background: `${C.cyan}33`, border: `3px solid ${C.cyan}`, borderRadius: 8,
                padding: '6px 16px', fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.cyan,
                boxShadow: `0 0 24px ${C.cyan}aa, inset 0 0 10px ${C.cyan}33`, whiteSpace: 'nowrap',
              }}>EGP 4,100</div>
            </div>
          ) : null}
        </ExcelApp>
      </ExcelWindow>

      {/* Comparison: full-width two-panel layout, replaces Caption */}
      {showCmp ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: lockP}}>
          <div style={{display: 'flex', gap: 36, alignItems: 'stretch'}}>
            {/* Left: default (top-down) */}
            <div style={{background: C.card, border: `2px solid ${C.muted}`, borderRadius: 12, padding: '14px 32px', minWidth: 380}}>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 6}}>Default (top-down):</div>
              <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.muted, textDecoration: 'line-through'}}>EGP 1,200 — TXN-1001 (oldest)</div>
            </div>
            {/* VS divider */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontFamily: MONO, fontSize: 28, color: C.text, fontWeight: 700}}>vs</span>
            </div>
            {/* Right: search_mode = -1 */}
            <div style={{background: C.card, border: `2.5px solid ${C.cyan}`, borderRadius: 12, padding: '14px 32px', minWidth: 380, boxShadow: `0 0 36px ${C.cyan}55`}}>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.cyan, marginBottom: 6}}>search_mode = -1 (bottom-up):</div>
              <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.cyan}}>EGP 4,100 — TXN-1009 (LATEST)</div>
            </div>
          </div>
        </div>
      ) : (
        <Caption text="Reverse Search Engine ──► Parameter #6 [search_mode = -1] Scans Bottom-to-Top" from={t(131.0)} to={t(145.0)} />
      )}

      <TopBadge text="Reverse Search Engine ──► Parameter #6 [search_mode = -1] Scans Bottom-to-Top" from={t(131.0)} to={t(145.0)} />
    </Stage>
  );
};
