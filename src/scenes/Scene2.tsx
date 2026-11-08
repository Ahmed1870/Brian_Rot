import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CUSTOMERS, customerCell} from '../data';
import {
  CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec,
} from '../kit';

// SC02: Native Error Handling (if_not_found) + Default Exact Matching.
// Anchors (s): 41.0 formula | 45.0 search CUST-999 | 50.0 "Customer Not Found" purple | 60.0 exact match badge | 75.0 IFERROR ban
const S = START.s2;
const t = (g: number) => sec(g - S);

const custColW = (c: number) => [0, 120, 200, 110, 200, 200][c] ?? XL.colW;
const cc = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += custColW(i);
  return {x: x + custColW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 650, fy: 220, z: 1.08}, prog(f, t(2), 30));

  const searchP = prog(f, t(45), 18);
  const notFoundP = prog(f, t(50), 14) * (1 - prog(f, t(85), 12));
  const exactP = prog(f, t(60), 14) * (1 - prog(f, t(85), 12));
  const banP = prog(f, t(75), 14) * (1 - prog(f, t(85), 12));

  const g = geo(1, 0, 1);
  const colA = cc(1, 1);

  // Determine what to show in the bottom area:
  // - When exactP is showing: "Exact Match is DEFAULT" badge
  // - When banP is showing: "IFERROR no longer needed" badge
  // - Otherwise: Caption text
  const showExact = exactP > 0.01;
  const showBan = banP > 0.01;

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="tbl_Customers.xlsx" nameBox="E2" formula='=XLOOKUP("CUST-999", A2:A16, B2:B16, "Customer Not Found")'
          cell={(r, c) => customerCell(r, c) as any} colW={custColW}
          sel={{r1: 1, c1: 5, r2: 1, c2: 5}} active={{r: 1, c: 5}} thumb={0} thumbSize={0.55}
        >
          <Neon x={colA.x - custColW(1) / 2} y={g.colTop} w={custColW(1)} h={g.rowsBottom - g.colTop} color={C.blue} p={prog(f, t(42), 12) * 0.4 * (1 - prog(f, t(85), 12))} />
          <Neon x={cc(1, 2).x - custColW(2) / 2} y={g.colTop} w={custColW(2)} h={g.rowsBottom - g.colTop} color={C.green} p={prog(f, t(43), 12) * 0.4 * (1 - prog(f, t(85), 12))} />

          {/* scan sweep */}
          {searchP > 0 && searchP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 26}}>
              <line x1={colA.x} y1={g.colTop} x2={colA.x} y2={g.colTop + (g.rowsBottom - g.colTop) * searchP} stroke={C.amber} strokeWidth={4} strokeDasharray="8 5" opacity={0.85} />
              <circle cx={colA.x} cy={g.colTop + (g.rowsBottom - g.colTop) * searchP} r={8} fill={C.amber} opacity={0.9} />
            </svg>
          ) : null}

          {/* "Customer Not Found" — LARGE purple output replacing #N/A */}
          {notFoundP > 0 ? (
            <div style={{
              position: 'absolute',
              left: cc(1, 5).x - custColW(5) / 2 - 10,
              top: cc(1, 5).y - XL.rowH / 2 - 4,
              width: custColW(5) + 20,
              height: XL.rowH + 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: notFoundP,
              transform: `scale(${0.85 + 0.15 * notFoundP})`,
              zIndex: 28,
            }}>
              <div style={{
                background: `${C.purple}33`,
                border: `3px solid ${C.purple}`,
                borderRadius: 8,
                padding: '6px 14px',
                fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.purple,
                boxShadow: `0 0 24px ${C.purple}aa, inset 0 0 10px ${C.purple}33`,
                whiteSpace: 'nowrap',
              }}>
                "Customer Not Found"
              </div>
            </div>
          ) : null}

          <Neon x={cc(1, 5).x - custColW(5) / 2} y={cc(1, 5).y - XL.rowH / 2} w={custColW(5)} h={XL.rowH} color={C.amber} p={prog(f, t(41), 12) * (1 - prog(f, t(50), 12))} label="lookup_value" labelBelow />
        </ExcelApp>
      </ExcelWindow>

      {/* Bottom area: either badge or caption, never both (prevents overlap) */}
      {showExact ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: exactP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.green}`, borderRadius: 14, padding: '16px 40px', boxShadow: `0 0 0 6px ${C.green}22, 0 0 36px ${C.green}55`, display: 'flex', alignItems: 'center', gap: 18}}>
            <svg width={40} height={40} viewBox="0 0 40 40"><circle cx={20} cy={20} r={18} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} /><polyline points="11,21 18,28 31,12" fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green}}>Exact Match is DEFAULT — No need for FALSE or 0</span>
          </div>
        </div>
      ) : showBan ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: banP}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, background: `${C.purple}22`, border: `2.5px solid ${C.purple}`, borderRadius: 999, padding: '12px 32px', boxShadow: `0 0 30px ${C.purple}44`}}>
            <svg width={30} height={30} viewBox="0 0 30 30"><circle cx={15} cy={15} r={13} fill="none" stroke={C.purple} strokeWidth={3} /><line x1={8} y1={8} x2={22} y2={22} stroke={C.purple} strokeWidth={3} strokeLinecap="round" /><line x1={22} y1={8} x2={8} y2={22} stroke={C.purple} strokeWidth={3} strokeLinecap="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.purple}}>IFERROR Eliminated — Native if_not_found (Parameter #4)</span>
          </div>
        </div>
      ) : (
        <Caption text='Native Error Handling ──► Parameter #4 [if_not_found] Replaces IFERROR Completely' from={t(42.0)} to={t(60.0)} />
      )}

      <TopBadge text="Native Error Handling ──► Parameter #4 [if_not_found] Replaces IFERROR Completely" from={t(42.0)} to={t(60.0)} />
      {!showExact && !showBan ? <Caption text='Default Exact Match ──► Zero Need for "FALSE" or "0" (Match Mode Defaults to 0)' from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
