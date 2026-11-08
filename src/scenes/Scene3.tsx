import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CUSTOMERS, customerCell} from '../data';
import {
  CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec,
} from '../kit';

// SC03: Multi-Column Dynamic Array Spill Engine.
// Anchors (s): 86.0 formula in F2 | 90.0 spill flow | 100.0 spill border | 110.0 comparison (1 XLOOKUP = 3 VLOOKUPs)
const S = START.s3;
const t = (g: number) => sec(g - S);

const custColW = (c: number) => [0, 120, 200, 110, 160, 200, 200, 200][c] ?? XL.colW;
const cc = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += custColW(i);
  return {x: x + custColW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 560, fy: 220, z: 1.15}, prog(f, t(2), 30));

  const spillP = prog(f, t(90), 24);
  const f2Lit = clamp(spillP * 3);
  const g2Lit = clamp(spillP * 3 - 1);
  const h2Lit = clamp(spillP * 3 - 2);
  const borderP = prog(f, t(100), 14) * (1 - prog(f, t(130), 12));
  const cmpP = prog(f, t(110), 14) * (1 - prog(f, t(130), 12));

  const g = geo(1, 0, 1);
  const showCmp = cmpP > 0.01;

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="tbl_Customers.xlsx" nameBox="F2" formula='=XLOOKUP(E2, A2:A16, B2:D16)'
          cell={(r, c) => {
            if (c <= 4) return customerCell(r, c) as any;
            if (c === 5 && r === 2) return {t: 'CUST-002'};
            if (r === 2 && c === 6 && f2Lit > 0) return {t: 'Sara Mohamed', color: '#107C41'};
            if (r === 2 && c === 7 && g2Lit > 0) return {t: 'Giza', color: '#107C41'};
            if (r === 2 && c === 8 && h2Lit > 0) return {t: '+20 100 222 2222', color: '#107C41'};
            return undefined;
          }} colW={custColW}
          sel={{r1: 2, c1: 6, r2: 2, c2: 6}} active={{r: 2, c: 6}} thumb={0} thumbSize={0.55}
        >
          <Neon x={cc(2, 5).x - custColW(5) / 2} y={cc(2, 5).y - XL.rowH / 2} w={custColW(5)} h={XL.rowH} color={C.amber} p={prog(f, t(86), 12) * (1 - prog(f, t(130), 12))} label="lookup_value" labelBelow />
          <Neon x={cc(1, 1).x - custColW(1) / 2} y={g.colTop} w={custColW(1)} h={g.rowsBottom - g.colTop} color={C.blue} p={prog(f, t(87), 12) * 0.4 * (1 - prog(f, t(130), 12))} label="lookup_array" labelBelow />
          <Neon x={cc(1, 2).x - custColW(2) / 2} y={g.colTop} w={custColW(2) + custColW(3) + custColW(4)} h={g.rowsBottom - g.colTop} color={C.green} p={prog(f, t(88), 12) * 0.4 * (1 - prog(f, t(130), 12))} label="return_array (3 cols)" labelBelow />
          <Neon x={cc(2, 6).x - custColW(6) / 2} y={cc(2, 6).y - XL.rowH / 2} w={custColW(6)} h={XL.rowH} color={C.blue} p={f2Lit * 0.7} />
          <Neon x={cc(2, 7).x - custColW(7) / 2} y={cc(2, 7).y - XL.rowH / 2} w={custColW(7)} h={XL.rowH} color={C.blue} p={g2Lit * 0.7} />
          <Neon x={cc(2, 8).x - custColW(8) / 2} y={cc(2, 8).y - XL.rowH / 2} w={custColW(8)} h={XL.rowH} color={C.blue} p={h2Lit * 0.7} />
          {/* spill range border with large label */}
          {borderP > 0 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 27}}>
              <rect x={cc(2, 6).x - custColW(6) / 2 - 3} y={cc(2, 6).y - XL.rowH / 2 - 3} width={custColW(6) + custColW(7) + custColW(8) + 6} height={XL.rowH + 6} fill="none" stroke={C.blue} strokeWidth={3} strokeDasharray="7 4" opacity={borderP} />
              <rect x={cc(2, 6).x - custColW(6) / 2} y={cc(2, 6).y - XL.rowH / 2 - 32} width={260} height={26} fill={C.blue} rx={5} opacity={borderP} />
              <text x={cc(2, 6).x - custColW(6) / 2 + 130} y={cc(2, 6).y - XL.rowH / 2 - 14} textAnchor="middle" fill="#0B1222" fontFamily="Consolas, monospace" fontSize={16} fontWeight={700} opacity={borderP}>Spill Range F2:H2</text>
            </svg>
          ) : null}
        </ExcelApp>
      </ExcelWindow>

      {/* Comparison badge — replaces Caption when visible */}
      {showCmp ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: cmpP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.blue}`, borderRadius: 14, padding: '16px 40px', boxShadow: `0 0 0 6px ${C.blue}22, 0 0 36px ${C.blue}55`, display: 'flex', alignItems: 'center', gap: 24}}>
            <span style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green}}>1 XLOOKUP</span>
            <span style={{fontFamily: MONO, fontSize: 32, color: C.text}}>=</span>
            <span style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.red, textDecoration: 'line-through'}}>3 VLOOKUPs</span>
            <span style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>· saves 80% of report time</span>
          </div>
        </div>
      ) : (
        <Caption text="Multi-Column Spill Engine ──► 1 Single Formula Returns Multiple Adjacent Columns (F2:H2)" from={t(86.0)} to={t(110.0)} />
      )}

      <TopBadge text="Multi-Column Spill Engine ──► 1 Single Formula Returns Multiple Adjacent Columns (F2:H2)" from={t(86.0)} to={t(110.0)} />
    </Stage>
  );
};
