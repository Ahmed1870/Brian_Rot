import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {HEAD5, KPI5, cust5, cw5, fmt2, fmtInt, sale} from '../data';
import type {CellV} from '../kit';
import {Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Ripple, Stage, clamp, dwell, prog, sec, track} from '../kit';
import {CAM_SHEET, KpiCard, RangeFx, cellRect, center, rangeRect, typeIn} from '../l7';

// SC05: enterprise file, four KPI formulas.
// Anchors (s): 171.5 loading | 174.8 file | 180.6 fifty thousand | 183.4 SUM | 185.6 AVERAGE | 187.9 COUNT | 189.9 COUNTA | 192.4 four functions across 50,000 rows | 196.7 seal
const S = START.s5;
const t = (g: number) => sec(g - S);
const G0 = {colW: cw5};
const LAST = 50001;
const KPI = [
  {label: 'Total Revenue', formula: '=SUM(F2:F50001)', value: fmtInt(KPI5.sum), title: 'SUM', sub: 'إجمالي الإيرادات', color: C.green, row: 2, g: 183.5, enter: 185.0, card: 185.1},
  {label: 'Avg Ticket', formula: '=AVERAGE(F2:F50001)', value: fmt2(KPI5.avg), title: 'AVERAGE', sub: 'متوسط قيمة الأوردر', color: C.blue, row: 3, g: 185.7, enter: 187.4, card: 187.5},
  {label: 'Total Orders', formula: '=COUNT(F2:F50001)', value: fmtInt(KPI5.count), title: 'COUNT', sub: 'المعاملات الرقمية', color: C.gold, row: 4, g: 188.0, enter: 189.45, card: 189.5},
  {label: 'Active Clients', formula: '=COUNTA(B2:B50001)', value: fmtInt(KPI5.counta), title: 'COUNTA', sub: 'العملاء النشطين', color: C.purple, row: 5, g: 190.0, enter: 191.6, card: 191.7},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const open = prog(f, t(174.4), 14);
  const loading = prog(f, t(171.4), 10) * (1 - prog(f, t(174.4), 10));
  const bar = clamp((f - t(171.7)) / sec(2.5));

  // scroll jump (Ctrl+Down then Ctrl+Home)
  const jump = within(181.0, 182.6);
  const scroll = jump ? {r: LAST - 16, c: 1} : {r: 1, c: 1};
  const geoO = {colW: cw5, scroll: {r: 1, c: 1}};

  const typing = KPI.map((k) => f >= t(k.g) && f < t(k.enter));
  const typed = KPI.map((k) => typeIn(k.formula, f, t(k.g), sec(k.enter - k.g - 0.3)));
  const done = KPI.map((k) => at(k.enter));

  const cellFn = (r: number, c: number): CellV | undefined => {
    if (r === 1) {
      if (c >= 1 && c <= 6) return {t: HEAD5[c - 1], b: true, bg: '#E2EFDA', al: c === 5 || c === 6 ? 'r' : 'l'};
      if (c === 8) return {t: 'KPI Summary', b: true, bg: '#DDEBF7'};
      if (c === 9) return {t: 'Value', b: true, bg: '#DDEBF7', al: 'r'};
      return undefined;
    }
    if (r >= 2 && r <= 5 && !jump) {
      const k = KPI[r - 2];
      if (c === 8) return {t: k.label, b: true};
      if (c === 9) return typing[r - 2] ? {t: typed[r - 2], al: 'l'} : done[r - 2] ? {t: k.value, al: 'r', b: true, num: 1} : undefined;
    }
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

  // selection / formula bar
  let sel = {r1: 1, c1: 1, r2: 1, c2: 1}; let active = {r: 1, c: 1}; let nameBox = 'A1'; let formula = 'Order ID';
  if (jump) { sel = {r1: LAST, c1: 1, r2: LAST, c2: 1}; active = {r: LAST, c: 1}; nameBox = `A${LAST}`; formula = sale(LAST - 1).id; }
  KPI.forEach((k, i) => {
    if (at(k.g - 0.1)) { sel = {r1: k.row, c1: 9, r2: k.row, c2: 9}; active = {r: k.row, c: 9}; nameBox = `I${k.row}`; formula = typing[i] ? typed[i] : done[i] ? k.formula : ''; }
    if (at(k.enter) && i < 3) { sel = {r1: k.row + 1, c1: 9, r2: k.row + 1, c2: 9}; active = {r: k.row + 1, c: 9}; nameBox = `I${k.row + 1}`; formula = ''; }
  });
  if (at(191.6)) { sel = {r1: 6, c1: 9, r2: 6, c2: 9}; active = {r: 6, c: 9}; nameBox = 'I6'; formula = ''; }

  const ptsT = KPI.map((k) => center(cellRect(k.row, 9, geoO)));
  const pts = dwell([
    {f: t(170.0), x: 700, y: 440},
    {f: t(183.2), x: ptsT[0].x, y: ptsT[0].y},
    {f: t(185.5), x: ptsT[1].x, y: ptsT[1].y},
    {f: t(187.8), x: ptsT[2].x, y: ptsT[2].y},
    {f: t(189.8), x: ptsT[3].x, y: ptsT[3].y},
    {f: t(192.5), x: ptsT[3].x + 120, y: ptsT[3].y + 160},
  ]);
  const cur = track(f, pts);
  const clicks = [183.4, 185.6, 187.9, 189.9];

  const cardX = [100, 540, 980, 1420];
  const glowAll = prog(f, t(192.3), 14) * (1 - prog(f, t(196.4), 18));
  const sweep = clamp((f - t(192.5)) / sec(3.3));
  const seal = prog(f, t(196.7), 18);
  const rowsChip = prog(f, t(180.5), 10) * (1 - prog(f, t(183.2), 10));
  const counter = Math.round(50000 * clamp((f - t(180.6)) / sec(1.8)));
  const keyP = Math.max(prog(f, t(180.7), 6) * (1 - prog(f, t(182.0), 8)), prog(f, t(182.6), 6) * (1 - prog(f, t(183.6), 8)));
  const keys = at(182.6) ? ['Ctrl', 'Home'] : ['Ctrl', '↓'];
  const seen = KPI.map((k) => prog(f, t(k.card), 12));
  const sweepRect = rangeRect(2, 1, 18, 6, geoO);

  return (
    <Stage dur={SCENES.s5.dur} inFx="zoom" outFx="up">
      <div style={{opacity: open}}>
        <ExcelWindow cam={CAM_SHEET}>
          <ExcelApp
            file="manzooma_sales_2026.xlsx" nameBox={nameBox} formula={formula} fbEdit={typing.some(Boolean)} colW={cw5} cell={cellFn} sel={sel} active={active} scroll={scroll} sheet="Sales"
            thumb={jump ? 1 : 0} thumbSize={0.02}
          >
            {sweep > 0 && sweep < 1 ? <RangeFx rect={{x: sweepRect.x, y: sweepRect.y + sweep * (sweepRect.h - 24), w: sweepRect.w, h: 24}} color={C.green} p={1} fill={0.28} /> : null}
            {KPI.map((k, i) => <RangeFx key={k.label} rect={cellRect(k.row, 9, geoO)} color={k.color} p={seen[i] * (1 - prog(f, t(196.4), 14))} fill={0.2} />)}
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
      <div style={{position: 'absolute', left: 520, top: 82, opacity: rowsChip, fontFamily: MONO}}><Chip color={C.blue}>{fmtInt(counter)} rows · Ctrl + ↓</Chip></div>
      <KeyBadge keys={keys} p={keyP} />

      {KPI.map((k, i) => (
        <KpiCard key={k.title} x={cardX[i]} y={640} w={400} h={220} title={k.title} sub={k.sub} value={k.value} formula={k.formula} color={k.color} p={seen[i]} glow={Math.max(glowAll, Math.max(0, 1 - (f - t(k.card)) / 40) * (at(k.card) ? 1 : 0))} />
      ))}

      <div style={{position: 'absolute', left: 1450, top: 190, width: 330, textAlign: 'center', opacity: seal, transform: `scale(${0.7 + 0.3 * seal})`}}>
        <svg width={220} height={220} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -4}}>ENTERPRISE READY</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>4 / 4 KPIs · 50,000 rows</div>
      </div>

      <Caption text="Enterprise KPI Extraction ──► SUM, AVERAGE, COUNT, COUNTA Across 50,000 Rows" from={t(172.5)} to={t(196.0)} />
      <Caption text="Executive Summary ──► Instant Core Statistical Indicators Across 50,000 Rows" from={t(196.6)} to={t(207.0)} tone="ok" />
    </Stage>
  );
};
