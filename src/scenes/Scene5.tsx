import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {HEAD5, cust5, cw5, fmtInt, sale} from '../data';
import type {CellV} from '../kit';
import {Caption, Chip, Cursor, ExcelApp, ExcelWindow, Ripple, Stage, clamp, dwell, prog, sec, track} from '../kit';
import {CAM_SHEET, KpiCard, RangeFx, cellRect, center, rangeRect, typeIn} from '../l7';

// SC05: enterprise file, three rules over 50,000 rows. Anchors (s): 171.4 loading | 175 file | 185.4 fifty thousand | 187.2 list | 189.3 COUNTIF | 191.0 whole number | 192.4 scan | 195.0 seal
const S = START.s5;
const t = (g: number) => sec(g - S);
const G0 = {colW: cw5};
const LAST = 50001;
const RULES = [
  {rng: 'D2:D50001', c1: 4, title: 'DROP-DOWN', sub: 'قائمة منسدلة ديناميكية', value: '=F2#', formula: 'List · spilled source', color: C.amber, g: 185.6, card: 187.2},
  {rng: 'A2:A50001', c1: 1, title: 'NO DUPLICATES', sub: 'منع التكرار', value: 'COUNTIF = 1', formula: '=COUNTIF(A:A,A2)=1', color: C.purple, g: 187.9, card: 189.3},
  {rng: 'F2:F50001', c1: 6, title: 'WHOLE NUMBER', sub: 'حدود منطقية', value: '1 – 100,000', formula: 'Whole number · between', color: C.blue, g: 189.6, card: 191.0},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const open = prog(f, t(174.4), 14);
  const loading = prog(f, t(171.4), 10) * (1 - prog(f, t(174.4), 10));
  const bar = clamp((f - t(171.7)) / sec(2.5));

  const cellFn = (r: number, c: number): CellV | undefined => {
    if (r === 1) return c >= 1 && c <= 6 ? {t: HEAD5[c - 1], b: true, bg: '#E2EFDA', al: c === 5 || c === 6 ? 'r' : 'l'} : undefined;
    if (r > LAST || c < 1 || c > 6) return undefined;
    const n = r - 1; const s = sale(n);
    switch (c) {
      case 1: return {t: s.id};
      case 2: return {t: cust5(n)};
      case 3: return {t: s.branch};
      case 4: return {t: s.product};
      case 5: return {t: String(s.qty), num: s.qty, al: 'r'};
      default: return {t: fmtInt(s.total), num: s.total, al: 'r'};
    }
  };

  let sel = {r1: 1, c1: 1, r2: 1, c2: 1}; let active = {r: 1, c: 1}; let nameBox = 'A1'; let formula = 'Order ID';
  let nbEdit = false;
  RULES.forEach((k) => {
    if (at(k.g + 1.2)) { sel = {r1: 2, c1: k.c1, r2: LAST, c2: k.c1}; active = {r: 2, c: k.c1}; nameBox = k.rng.split(':')[0]; formula = cellFn(2, k.c1)?.t ?? ''; }
    if (within(k.g, k.g + 1.2)) { nbEdit = true; nameBox = typeIn(k.rng, f, t(k.g), sec(1.0)); }
  });

  const geo = {colW: cw5, scroll: {r: 1, c: 1}};
  const p0 = center(cellRect(2, 4, geo)), p1 = center(cellRect(2, 1, geo)), p2 = center(cellRect(2, 6, geo));
  const pts = dwell([
    {f: t(170.0), x: 700, y: 440},
    {f: t(185.2), x: 380, y: 160},
    {f: t(186.9), x: p0.x, y: p0.y + 30},
    {f: t(187.8), x: 380, y: 160},
    {f: t(189.0), x: p1.x, y: p1.y + 30},
    {f: t(189.5), x: 380, y: 160},
    {f: t(190.7), x: p2.x, y: p2.y + 30},
    {f: t(192.5), x: p2.x + 120, y: p2.y + 200},
  ]);
  const cur = track(f, pts);
  const clicks = [186.9, 189.0, 190.7];

  const cardX = [160, 760, 1360];
  const glowAll = prog(f, t(192.3), 14) * (1 - prog(f, t(196.4), 18));
  const sweep = clamp((f - t(192.5)) / sec(1.6));
  const seal = prog(f, t(195.0), 18);
  const rowsChip = prog(f, t(185.2), 10) * (1 - prog(f, t(187.0), 10));
  const counter = Math.round(50000 * clamp((f - t(185.4)) / sec(1.2)));
  const seen = RULES.map((k) => prog(f, t(k.card), 12));
  const sweepRect = rangeRect(2, 1, 18, 6, geo);

  return (
    <Stage dur={SCENES.s5.dur} inFx="zoom" outFx="up">
      <div style={{opacity: open}}>
        <ExcelWindow cam={CAM_SHEET}>
          <ExcelApp file="manzooma_sales_2026.xlsx" nameBox={nameBox} nameEdit={nbEdit} formula={formula} colW={cw5} cell={cellFn} sel={sel} active={active} sheet="Sales" thumb={0} thumbSize={0.02}>
            {sweep > 0 && sweep < 1 ? <RangeFx rect={{x: sweepRect.x, y: sweepRect.y + sweep * (sweepRect.h - 24), w: sweepRect.w, h: 24}} color={C.green} p={1} fill={0.28} /> : null}
            {RULES.map((k, i) => <RangeFx key={k.title} rect={{x: cellRect(2, k.c1, geo).x, y: cellRect(2, k.c1, geo).y, w: cw5(k.c1), h: 21 * 17}} color={k.color} p={seen[i] * (1 - prog(f, t(196.4), 14))} fill={0.12} />)}
            {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
            <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
          </ExcelApp>
        </ExcelWindow>
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

      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(175.0), 12), fontFamily: MONO}}><Chip color={C.green}>manzooma_sales_2026.xlsx</Chip></div>
      <div style={{position: 'absolute', left: 520, top: 82, opacity: rowsChip, fontFamily: MONO}}><Chip color={C.blue}>{fmtInt(counter)} rows protected</Chip></div>

      {RULES.map((k, i) => (
        <KpiCard key={k.title} x={cardX[i]} y={640} w={400} h={220} title={k.title} sub={k.sub} value={k.value} formula={k.formula} color={k.color} p={seen[i]} glow={Math.max(glowAll, Math.max(0, 1 - (f - t(k.card)) / 40) * (at(k.card) ? 1 : 0))} />
      ))}

      <div style={{position: 'absolute', left: 1450, top: 190, width: 330, textAlign: 'center', opacity: seal, transform: `scale(${0.7 + 0.3 * seal})`}}>
        <svg width={220} height={220} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -4}}>ZERO HUMAN ERROR</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>3 rules · 50,000 rows</div>
      </div>

      <Caption text="Enterprise Data Quality ──► Protect 50,000 Rows via Dynamic Validation Controls" from={t(172.5)} to={t(194.6)} />
      <Caption text="Zero Human Error ──► High-Speed Input Control & Dynamic Drop-down Lists" from={t(195.4)} to={t(207.0)} tone="ok" />
    </Stage>
  );
};
