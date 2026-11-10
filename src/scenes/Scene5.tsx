import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {fmtInt, sale} from '../data';
import {Caption, Chip, Stage, clamp, sec} from '../kit';
import {CAM0, CAM_SHEET, Cells, Ev, RangeFx, Sim, camLerp, fn, mk, num, picksOf, prog, put, rangeRect, rev} from '../l40';
import {BIG_BR, BIG_CAT, SealBox, bigSum, lblHdr} from '../l41';

// SC05 anchors (s, abs): 171.3 loading | 177.3 Ctrl+Down | 179.2 Ctrl+Home | 180.6 G2 list | 183.4 H1 headers | 187.0-191.8 2D SUMIFS | 192.2 seal
const S = START.s5;
const t = (g: number) => sec(g - S);
const cw = (c: number) => [0, 84, 100, 100, 90, 24, 24, 100, 100, 100, 100, 100, 100][c] ?? 64;
const G5 = {colW: cw};
const LAST = 50001;
const FG = '=SORT(UNIQUE(tbl_Sales[Branch]))';
const FH = '=TRANSPOSE(SORT(UNIQUE(tbl_Sales[Category])))';
const FM = '=SUMIFS(tbl_Sales[Amount], tbl_Sales[Branch], G2#, tbl_Sales[Category], H1#)';
const EVS: Ev[] = [
  {r: 2, c: 7, text: FG, start: t(180.6), dur: sec(2.4), enter: t(183.2), r2: 6},
  {r: 1, c: 8, text: FH, start: t(183.6), dur: sec(3.0), enter: t(186.8), c2: 12},
  {r: 2, c: 8, text: FM, start: t(187.2), dur: sec(4.4), enter: t(191.8), r2: 6, c2: 12},
];
const PICKS = picksOf(EVS, []);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const open = prog(f, t(175.8), 14);
  const loading = prog(f, t(171.3), 10) * (1 - prog(f, t(175.6), 10));
  const bar = clamp((f - t(171.8)) / sec(3.4));
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(177.0), 30));
  const bottom = within(177.3, 179.2);
  const scroll = bottom ? {r: 49985, c: 1} : {r: 1, c: 1};
  const base: Cells = mk();
  put(base, 1, 7, {t: 'Branch', ...lblHdr});
  const nG = rev(f, EVS[0].enter, 5, 5), nH = rev(f, EVS[1].enter, 5, 6), nM = rev(f, EVS[2].enter, 25, 2);
  BIG_BR.forEach((b, i) => { if (i < nG) put(base, 2 + i, 7, {t: b}); });
  BIG_CAT.forEach((c, j) => { if (j < nH) put(base, 1, 8 + j, {t: c, ...lblHdr, al: 'r'}); });
  for (let k = 0; k < nM; k++) { const i = Math.floor(k / 5), j = k % 5; put(base, 2 + i, 8 + j, num(bigSum(BIG_BR[i], BIG_CAT[j]))); }
  const data = (r: number, c: number) => {
    if (r === 1) return c >= 1 && c <= 4 ? {t: ['Order ID', 'Branch', 'Category', 'Amount'][c - 1], b: true, bg: '#4472C4', color: '#fff', al: c === 4 ? ('r' as const) : ('l' as const)} : undefined;
    if (r > LAST || c < 1 || c > 4) return undefined;
    const n = r - 1; const s = sale(n); const bg = n % 2 === 1 ? '#D9E1F2' : undefined;
    return [undefined, {t: s.id, bg}, {t: s.branch, bg}, {t: s.category, bg}, num(s.total, {bg})][c];
  };
  const b = fn(base);
  const cell = (r: number, c: number) => b(r, c) ?? data(r, c);
  const seal = prog(f, t(192.2), 18);
  const counter = Math.round(50000 * clamp((f - t(176.6)) / sec(1.4)));
  const jump = bottom ? {at: t(177.3), r: 50001, c: 1} : null;
  return (
    <Stage dur={SCENES.s5.dur} inFx="zoom" outFx="up">
      <div style={{opacity: open}}>
        <Sim f={f} cell={cell} evs={EVS} picks={PICKS} geom={G5} cam={cam} scroll={scroll} thumb={bottom ? 1 : 0} thumbSize={0.02} selOverride={jump} keys={[{at: t(177.2), keys: ['Ctrl', '↓'], dur: 40}, {at: t(179.2), keys: ['Ctrl', 'Home'], dur: 40}]}>
          <RangeFx rect={rangeRect(1, 1, 12, 4, G5)} color={C.blue} p={prog(f, t(179.6), 8) * (1 - prog(f, t(181.4), 10)) * (within(179.6, 181.4) ? 1 : 0)} fill={0.05} label="tbl_Sales · 50,000 rows" />
          <RangeFx rect={rangeRect(2, 8, 6, 12, G5)} color={C.green} p={prog(f, EVS[2].enter, 8) * (1 - prog(f, t(199.0), 24))} fill={0.12} label="5 × 5 matrix · 50,000 rows" labelBelow />
        </Sim>
      </div>
      <div style={{position: 'absolute', left: 560, top: 292, width: 800, opacity: loading}} dir="ltr">
        <div style={{borderRadius: 26, border: `2px solid ${C.green}`, background: C.card, padding: '34px 44px', boxShadow: `0 30px 90px rgba(2,6,23,.8), 0 0 40px ${C.green}44`}}>
          <div style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.text}}>manzooma_sales_2026.xlsx</div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginTop: 6}}>Manzooma Store · enterprise sales database</div>
          <div style={{height: 22, borderRadius: 11, background: C.deep, border: `2px solid ${C.border}`, marginTop: 26, overflow: 'hidden'}}>
            <div style={{width: `${bar * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, boxShadow: `0 0 16px ${C.green}`}} />
          </div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.green, marginTop: 12}}>Loading {fmtInt(Math.round(bar * 50000))} rows…</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(176.8), 12) * (1 - prog(f, t(181.0), 10))}}><Chip color={C.green}>{fmtInt(counter)} rows in tbl_Sales</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(181.2), 10) * (1 - prog(f, t(187.0), 10))}}><Chip color={C.blue}>G2# branches · H1# categories</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(187.4), 10) * (1 - prog(f, t(199.0), 10))}}><Chip color={C.green}>1 formula ──► 25 totals from 50,000 rows</Chip></div>
      <SealBox p={seal} title="ENTERPRISE SUMIFS" sub="50,000 rows · 2D spilled matrix" />
      <Caption text="Enterprise Spilled Aggregation ──► Aggregate 50,000 Sales Rows Across Dynamic Criteria" from={t(178.0)} to={t(190.6)} />
      <Caption text="SUMIFS# 2D Matrix ──► No Manual Drag, No Anchoring, Fully Dynamic" from={t(193.4)} to={t(207.0)} tone="ok" />
    </Stage>
  );
};
