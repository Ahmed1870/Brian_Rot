import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {HEAD5, cust5, fmtInt, sale} from '../data';
import {Caption, Chip, Stage, clamp, sec} from '../kit';
import {CAM0, CAM_SHEET, Cells, Ev, NF, Pick, RangeFx, Sim, camLerp, fn, mk, num, picksOf, prog, put, rangeRect, rev} from '../l40';

// SC05 anchors (s, abs): 171.3 loading | 177.2 Ctrl+Down | 179.0 Ctrl+Home | 181-183.6 =TAKE | 184.4-190.6 bulk XLOOKUP | 190.7 spill 4 cols x 8 rows | 192.2 seal
const S = START.s5;
const t = (g: number) => sec(g - S);
const cw5b = (c: number) => [0, 84, 90, 100, 130, 54, 96, 24, 90, 24, 100, 130, 54, 96][c] ?? 64;
const G5 = {colW: cw5b};
const LAST = 50001;
const FT = '=TAKE(tbl_Sales[Order ID], -8)';
const FX = '=XLOOKUP(H2#, tbl_Sales[Order ID], tbl_Sales[[Branch]:[Total]], "' + NF + '")';
const EVS: Ev[] = [
  {r: 2, c: 8, text: FT, start: t(181.0), dur: sec(2.6), enter: t(183.6), r2: 9},
  {r: 2, c: 10, text: FX, start: t(184.4), dur: sec(6.2), enter: t(190.6), r2: 9, c2: 13},
];
const EXTRA: Pick[] = [{at: t(176.6), r: 1, c: 1, click: true}];
const PICKS = picksOf(EVS, EXTRA);
const LASTN = Array.from({length: 8}, (_, i) => 49993 + i);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const open = prog(f, t(175.8), 14);
  const loading = prog(f, t(171.3), 10) * (1 - prog(f, t(175.6), 10));
  const bar = clamp((f - t(171.8)) / sec(3.4));
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(177.0), 30));
  const bottom = within(177.3, 179.0);
  const scroll = bottom ? {r: 49985, c: 1} : {r: 1, c: 1};
  const m: Cells = mk();
  const data = (r: number, c: number) => {
    if (r === 1) return c >= 1 && c <= 6 ? {t: HEAD5[c - 1], b: true, bg: '#4472C4', color: '#fff', al: c >= 5 ? ('r' as const) : ('l' as const)} : undefined;
    if (r > LAST || c < 1 || c > 6) return undefined;
    const n = r - 1; const s = sale(n); const band = n % 2 === 1 ? '#D9E1F2' : undefined;
    return [undefined, {t: s.id, bg: band}, {t: cust5(n), bg: band}, {t: s.branch, bg: band}, {t: s.product, bg: band}, num(s.qty, {bg: band}), num(s.total, {bg: band})][c];
  };
  put(m, 1, 8, {t: 'Invoices', b: true, bg: '#DDEBF7'});
  ['Branch', 'Product', 'Qty', 'Total'].forEach((h, i) => put(m, 1, 10 + i, {t: h, b: true, bg: '#DDEBF7', al: i > 1 ? 'r' : 'l'}));
  const nH = rev(f, EVS[0].enter, 8, 6), nJ = rev(f, EVS[1].enter, 8, 3);
  LASTN.forEach((n, i) => {
    const s = sale(n);
    if (i < nH) put(m, 2 + i, 8, {t: s.id});
    if (i < nJ) { put(m, 2 + i, 10, {t: s.branch}); put(m, 2 + i, 11, {t: s.product}); put(m, 2 + i, 12, num(s.qty)); put(m, 2 + i, 13, num(s.total)); }
  });
  const base = fn(m);
  const cell = (r: number, c: number) => base(r, c) ?? (!within(179, 0) ? data(r, c) : data(r, c));
  const seal = prog(f, t(192.2), 18);
  const counter = Math.round(50000 * clamp((f - t(176.6)) / sec(1.4)));
  const jump = bottom ? {at: t(177.3), r: 50001, c: 1} : null;

  return (
    <Stage dur={SCENES.s5.dur} inFx="zoom" outFx="up">
      <div style={{opacity: open}}>
        <Sim f={f} cell={cell} evs={EVS} picks={PICKS} geom={G5} cam={cam} scroll={scroll} thumb={bottom ? 1 : 0} thumbSize={0.02} selOverride={jump} keys={[{at: t(177.2), keys: ['Ctrl', '↓'], dur: 40}, {at: t(179.0), keys: ['Ctrl', 'Home'], dur: 40}]}>
          <RangeFx rect={rangeRect(1, 1, 12, 6, G5)} color={C.blue} p={prog(f, t(180.0), 8) * (1 - prog(f, t(181.4), 10)) * (within(179.0, 181.4) ? 1 : 0)} fill={0.05} label="tbl_Sales · 50,000 rows" />
          <RangeFx rect={rangeRect(2, 8, 9, 8, G5)} color={C.blue} p={prog(f, EVS[0].enter + 30, 8) * (1 - prog(f, t(193.0), 20))} fill={0.12} label="H2#" labelBelow />
          <RangeFx rect={rangeRect(2, 10, 9, 13, G5)} color={C.green} p={prog(f, t(190.6), 8) * (1 - prog(f, t(199.0), 24))} fill={0.12} label="4 columns × 8 invoices" labelBelow />
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
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(181.2), 10) * (1 - prog(f, t(190.4), 10))}}><Chip color={C.blue}>TAKE(…, -8) ──► last 8 invoices spill in H2#</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(190.8), 10) * (1 - prog(f, t(199.0), 10))}}><Chip color={C.green}>1 formula ──► 8 invoices × 4 columns</Chip></div>
      <div style={{position: 'absolute', left: 1330, top: 560, width: 420, padding: '10px 0 14px', borderRadius: 24, background: 'rgba(11,18,34,0.92)', border: `2px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}66`, textAlign: 'center', opacity: seal, transform: `scale(${0.7 + 0.3 * seal})`}}>
        <svg width={150} height={150} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -4}}>ENTERPRISE XLOOKUP</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>50,000 rows · bulk spilled lookup</div>
      </div>
      <Caption text="Enterprise XLOOKUP Engine ──► Bulk Search & Fetch 50,000 Rows Instantly" from={t(178.0)} to={t(190.0)} />
      <Caption text="Spilled Multi-Column Lookup ──► No Manual Drag, No Broken References" from={t(193.4)} to={t(207.2)} tone="ok" />
    </Stage>
  );
};
