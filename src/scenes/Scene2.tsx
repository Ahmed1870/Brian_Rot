import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {PRICING, PRICING_EXTRA, pricingCell, pricingRowCount} from '../data';
import {CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec} from '../kit';
import {SpillBorder, GlowingToken, ExpansionArrows} from '../fx';

// SC02: Spill Range Border + # Operator + Dynamic Expansion.
// Anchors: 41.0 spill border appears | 52.0 =SUM(D2#) with # glowing | 70.0 expand with 2 new rows
const S = START.s2;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 200, 80, 140, 140, 140][c] ?? XL.colW;
const cc = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += colW(i);
  return {x: x + colW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 420, fy: 240, z: 1.15}, prog(f, t(2), 30));

  const expanded = f >= t(68);
  const rowCount = pricingRowCount(expanded);

  // Spill border on column D (rows 2..rowCount+1)
  const borderP = prog(f, t(41), 14) * (1 - prog(f, t(85), 12));
  const g0 = geo(1, 0, 1);
  const spillTop = cc(2, 4).y - XL.rowH / 2;
  const spillBottom = cc(rowCount + 1, 4).y + XL.rowH / 2;
  const spillH = spillBottom - spillTop;

  // # operator glow
  const hashP = prog(f, t(52), 14) * (1 - prog(f, t(85), 12));
  // Formula bar shows =SUM(D2#)
  const formula = f >= t(52) ? '=SUM(D2#)' : '=B2:B10 * C2:C10';

  // Expansion animation
  const expandP = prog(f, t(68), 18);
  // SUM result updates
  const allRows = expanded ? [...PRICING, ...PRICING_EXTRA] : PRICING;
  const sumTotal = allRows.reduce((a, r) => a + r.qty * r.price, 0);
  const sumP = prog(f, t(52), 14) * (1 - prog(f, t(85), 12));

  const showHashBadge = hashP > 0.01;
  const showExpandBadge = expandP > 0.01 && expandP < 0.95;

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Pricing_365.xlsx" nameBox="D2" formula={formula}
          cell={(r, c) => {
            if (c === 4 && r >= 2 && r <= rowCount + 1) {
              const idx = r - 2;
              const rows = expanded ? [...PRICING, ...PRICING_EXTRA] : PRICING;
              if (idx < rows.length) {
                const row = rows[idx];
                return {t: 'EGP ' + (row.qty * row.price).toLocaleString('en-US'), al: 'r', color: '#107C41'};
              }
            }
            return pricingCell(r, c, {expanded}) as any;
          }} colW={colW}
          sel={{r1: 2, c1: 4, r2: 2, c2: 4}} active={{r: 2, c: 4}} thumb={0} thumbSize={0.55}
        >
          {/* Spill border around column D */}
          <SpillBorder x={cc(2, 4).x - colW(4) / 2} y={spillTop} w={colW(4)} h={spillH} p={borderP} color={C.blue} label="Spill Range" />

          {/* # operator glowing token near formula bar area (cell E2 shows SUM result) */}
          {showHashBadge ? (
            <GlowingToken text="#" x={cc(2, 5).x - 8} y={cc(2, 5).y - 18} p={hashP} color={C.amber} size={32} />
          ) : null}

          {/* Expansion arrows when new rows appear */}
          {showExpandBadge ? (
            <ExpansionArrows x={cc(rowCount, 4).x + colW(4) / 2 + 8} y={cc(rowCount, 4).y - 20} p={expandP} color={C.green} />
          ) : null}

          {/* SUM result cell E2 */}
          {sumP > 0 ? (
            <Neon x={cc(2, 5).x - colW(5) / 2} y={cc(2, 5).y - XL.rowH / 2} w={colW(5)} h={XL.rowH} color={C.green} p={sumP} label="=SUM(D2#)" labelBelow />
          ) : null}
        </ExcelApp>
      </ExcelWindow>

      {/* Bottom: # operator explanation (replaces Caption when visible) */}
      {showHashBadge ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: hashP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.amber}`, borderRadius: 14, padding: '14px 36px', boxShadow: `0 0 0 6px ${C.amber}22, 0 0 30px ${C.amber}44`, display: 'flex', alignItems: 'center', gap: 16}}>
            <GlowingToken text="#" x={0} y={0} p={1} color={C.amber} size={28} />
            <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.amber, paddingLeft: 20}}>Spill Reference Operator ──► D2# reads the ENTIRE spilled range dynamically</span>
          </div>
        </div>
      ) : showExpandBadge ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: expandP}}>
          <div style={{background: C.card, border: `2.5px solid ${C.green}`, borderRadius: 14, padding: '14px 36px', boxShadow: `0 0 0 6px ${C.green}22, 0 0 30px ${C.green}44`, display: 'flex', alignItems: 'center', gap: 16}}>
            <svg width={32} height={32} viewBox="0 0 32 32"><polyline points="6,16 13,23 26,8" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>Dynamic Expansion ──► Border + SUM auto-update, no formula change needed</span>
          </div>
        </div>
      ) : (
        <Caption text="Spill Range Border ──► Blue Neon Outline Represents Active Array Boundary" from={t(42.0)} to={t(60.0)} />
      )}

      <TopBadge text="Spill Range Border + # Operator ──► Dynamic Array Reference Engine" from={t(42.0)} to={t(60.0)} />
    </Stage>
  );
};
