import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {HEAD5, cust5, cw5, fmtInt, sale} from '../data';
import type {CellV} from '../kit';
import {CAM_SHEET, RangeFx, rangeRect} from '../l7';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, Ripple, Stage, camLerp, clamp, dwell, prog, sec, sheetTabBox, track} from '../kit';
import {ALL, BIG, ChartBar, ChartLine, KpiShape, LB, SlicerBox, fmt, kpiOf, only, rollSeq, slicerItem} from '../dash';

// SC05 anchors (s): 166.5 loading | 174.5 dashboard tab | 176.5 50,000 | 180.5 Cairo | 183 +Giza | 185.5 Alexandria | 188 clear | 190.5 scan | 192 seal
const S = START.s5;
const t = (g: number) => sec(g - S);
const LAST = 50001;
const SHEETS = ['Data', 'Pivots', 'Executive Dashboard'];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const big = BIG();
  const open = prog(f, t(171.2), 14);
  const loading = prog(f, t(166.6), 10) * (1 - prog(f, t(171.0), 10));
  const bar = clamp((f - t(167.0)) / sec(3.6));
  const onDash = at(174.6);
  const camp = camLerp(CAM0, CAM_SHEET, prog(f, t(175.0), 30));

  const dataCell = (r: number, c: number): CellV | undefined => {
    if (r === 1) return c >= 1 && c <= 6 ? {t: HEAD5[c - 1], b: true, bg: '#E2EFDA', al: c >= 5 ? 'r' : 'l'} : undefined;
    if (r > LAST || c < 1 || c > 6) return undefined;
    const n = r - 1; const s = sale(n);
    return [undefined, {t: s.id}, {t: cust5(n)}, {t: s.branch}, {t: s.product}, {t: String(s.qty), num: s.qty, al: 'r' as const}, {t: fmtInt(s.total), num: s.total, al: 'r' as const}][c] as CellV;
  };

  const selAt = (g: number) => (g < 180.5 ? ALL : g < 183 ? only(0) : g < 185.5 ? only(0, 1) : g < 188 ? only(2) : ALL);
  const sel = selAt(f / 30 + S);
  const val = (k: number) => {
    const g0 = [174.8, 176.0, 176.4, 176.8][k];
    const marks = [g0, 180.5, 183, 185.5, 188].map((g) => { const kp = kpiOf(selAt(g + 0.01), big); return {at: t(g), v: [kp.sales, kp.profit, kp.orders, kp.avg][k]}; });
    return Math.round(rollSeq(f, marks, sec(k === 0 ? 1.8 : 0.9)));
  };
  const it = (i: number) => { const r = slicerItem(LB.slicer, 4, i); return {x: r.x + r.w / 2, y: r.y + r.h / 2}; };
  const hot = within(180.4, 180.9) ? 0 : within(182.9, 183.4) ? 1 : within(185.4, 185.9) ? 2 : -1;
  const tabB = sheetTabBox(SHEETS, 'Executive Dashboard');
  const clr = {x: LB.slicer.x + LB.slicer.w - 30, y: LB.slicer.y + 14};
  const pts = dwell([
    {f: t(166.06), x: 800, y: 460},
    {f: t(174.0), x: 800, y: 460},
    {f: t(174.5), x: tabB.cx, y: 636},
    {f: t(179.8), x: it(0).x, y: it(0).y},
    {f: t(182.6), x: it(1).x, y: it(1).y},
    {f: t(185.1), x: it(2).x, y: it(2).y},
    {f: t(187.6), x: clr.x, y: clr.y},
    {f: t(189.0), x: 760, y: 520},
  ]);
  const cur = track(f, pts);
  const clicks = [174.6, 180.5, 183.0, 185.5, 188.0];
  const sweep = clamp((f - t(190.5)) / sec(1.5));
  const seal = prog(f, t(192.0), 18);
  const counter = Math.round(50000 * clamp((f - t(176.3)) / sec(1.2)));
  const sweepR = rangeRect(2, 1, 18, 6, {});

  return (
    <Stage dur={SCENES.s5.dur} inFx="zoom" outFx="up">
      <div style={{opacity: open}}>
        <ExcelWindow cam={camp}>
          <ExcelApp file="manzooma_sales_2026.xlsx" tab="View" checks={{Gridlines: onDash ? 0 : 1, Headings: onDash ? 0 : 1, FormulaBar: 0}} gridOn={onDash ? 0 : 1} headOn={onDash ? 0 : 1} fbOn={0} nameBox="A1" formula="" colW={cw5} cell={(r, c) => (onDash ? (r <= 40 ? {t: '', bg: '#0F172A'} : undefined) : dataCell(r, c))} sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} sheets={SHEETS} sheet={onDash ? 'Executive Dashboard' : 'Data'} thumb={0} thumbSize={0.02}>
            {onDash ? (
              <div style={{position: 'absolute', left: -38, top: -48}}>
                <ChartBar rect={LB.chart1} d={big} sel={sel} />
                <ChartLine rect={LB.chart2} d={big} sel={sel} />
                {LB.cards.map((c, i) => <KpiShape key={i} rect={c} value={fmt(val(i))} green={1} glow={Math.max(0, 1 - (f - t(180.5)) / 40) * (at(180.5) ? 1 : 0)} label={['Total Sales', 'Profit', 'Orders', 'Avg Order'][i]} locked={1} />)}
                <SlicerBox rect={LB.slicer} cols={4} sel={sel} dark={1} hot={hot} locked={1} />
                {sweep > 0 && sweep < 1 ? <RangeFx rect={{x: 60, y: 222 + sweep * 380, w: 1100, h: 22}} color={C.green} p={1} fill={0.28} /> : null}
              </div>
            ) : null}
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

      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(175.0), 12) * (1 - prog(f, t(180.0), 10)), fontFamily: MONO}}><Chip color={C.green}>{fmtInt(counter)} rows ──► 1 dashboard</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(180.3), 10) * (1 - prog(f, t(190.0), 10))}}><Chip color={C.amber}>Slicer click ──► 4 linked cards refresh</Chip></div>
      <div style={{position: 'absolute', left: 1330, top: 560, width: 420, padding: '10px 0 14px', borderRadius: 24, background: 'rgba(11,18,34,0.92)', border: `2px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}66`, textAlign: 'center', opacity: seal, transform: `scale(${0.7 + 0.3 * seal})`}}>
        <svg width={150} height={150} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -4}}>ENTERPRISE DASHBOARD</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>50,000 rows · locked canvas</div>
      </div>
      <Caption text="Enterprise Pivot Dashboard ──► Integrated Executive App UI Engine for 50,000 Sales Records" from={t(169.0)} to={t(190.0)} />
      <Caption text="App-Like Performance ──► Instant Linked KPI Updates & Protected Canvas Execution" from={t(191.6)} to={t(204.4)} tone="ok" />
    </Stage>
  );
};
