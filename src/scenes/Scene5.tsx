import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BIG_LAST, BIG_STATS, CAIRO_STATS, Cell, HEAD, fmtInt, fmtStat, sale, smallCell, tierOf} from '../data';
import {
  dwell, CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, FilterMenu, KeyBadge, Ripple, Stage, camLerp, cellCenter, clamp, filterMenuGeom, geo, prog, qatCx, sec, track, Cam,
} from '../kit';

// SC05: enterprise file manzooma_sales_2026.xlsx (50,000 rows): Alt+2 filter, Alt+1 paste values, status bar totals.
// Anchors (s): 169.84 file | 173.88 50,000 rows | 176.03 Alt+2 | 178.66 Alt+1 | 183.85 status bar | 187.17 80%
const S = START.s5;
const t = (g: number) => sec(g - S);
const QAT = ['pasteValues', 'filter', 'sortAsc', 'clearFormats'];

const bigCell = (r: number, c: number): Cell | undefined => {
  if (r === 1) return smallCell(1, c);
  if (r < 2 || r > BIG_LAST || c < 1 || c > 8) return undefined;
  const s = sale(r - 1);
  switch (c) {
    case 1: return {t: s.id};
    case 2: return {t: s.branch};
    case 3: return {t: s.product};
    case 4: return {t: s.category};
    case 5: return {t: String(s.qty), num: s.qty};
    case 6: return {t: fmtInt(s.price), num: s.price};
    case 7: return {t: fmtInt(s.total), num: s.total};
    default: return {t: tierOf(s.total)};
  }
};
const CAIRO_ROWS: number[] = [1];
for (let n = 1; CAIRO_ROWS.length < 80; n++) if (sale(n).branch === 'Cairo') CAIRO_ROWS.push(n + 1);
const CAM_F: Cam = {fx: 520, fy: 330, z: 1.35};
const CAM_S: Cam = {fx: 1000, fy: 600, z: 1.7};

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  let cam: Cam = CAM0;
  cam = camLerp(cam, CAM_F, prog(f, t(175.8), 36));
  cam = camLerp(cam, CAM0, prog(f, t(179.6), 36));
  cam = camLerp(cam, CAM_S, prog(f, t(182.8), 40));
  cam = camLerp(cam, CAM0, prog(f, t(189.0), 50));

  const opened = at(169.6);
  const flash = opened ? 0.7 * (1 - prog(f, t(169.6), 14)) : 0;
  const jump = at(173.4) && !at(175.2);
  const filtered = at(178.25);
  const pasted = at(178.7);
  const first = filtered ? CAIRO_ROWS[1] : 2;

  let sel = {r1: 1, c1: 1, r2: 1, c2: 1};
  let active = {r: 1, c: 1};
  let scroll = {r: 1, c: 1};
  let nameBox = 'A1';
  let formula = 'Order ID';
  if (jump) { sel = {r1: BIG_LAST, c1: 1, r2: BIG_LAST, c2: 1}; active = {r: BIG_LAST, c: 1}; scroll = {r: BIG_LAST - 18, c: 1}; nameBox = `A${BIG_LAST}`; formula = sale(BIG_LAST - 1).id; }
  if (at(178.0)) { sel = {r1: 2, c1: 7, r2: BIG_LAST, c2: 7}; active = {r: first, c: 7}; nameBox = `G${first}`; formula = pasted ? String(sale(first - 1).total) : `=E${first}*F${first}`; }
  if (filtered) scroll = {r: 1, c: 1};

  const stats: Array<[string, string]> | undefined = at(178.0)
    ? (() => {
      const s = filtered ? CAIRO_STATS : BIG_STATS;
      return [['Average', fmtStat(s.sum / s.numCount)], ['Count', fmtInt(s.count)], ['Numerical Count', fmtInt(s.numCount)], ['Min', fmtInt(s.min)], ['Max', fmtInt(s.max)], ['Sum', fmtInt(s.sum)]] as Array<[string, string]>;
    })()
    : undefined;
  const statsGlow = prog(f, t(183.85), 12) * (1 - prog(f, t(190.0), 14));

  const tips = prog(f, t(175.9), 8) * (1 - prog(f, t(177.0), 8));
  const showFilter = at(176.1);
  const menuOpen = at(176.9) && !at(178.25);
  const fg = filterMenuGeom(196, 226);
  const checks: Record<string, number> = {};
  ['(Select All)', 'Alexandria', 'Cairo', 'Giza', 'Mansoura', 'Tanta'].forEach((n) => { checks[n] = 1; });
  if (at(177.4)) Object.keys(checks).forEach((n) => { checks[n] = 0; });
  if (at(177.8)) checks['Cairo'] = 1;

  const alt1 = at(178.66) && !at(181.0);
  const keys = at(178.66) ? ['Alt', '1'] : at(175.8) ? ['Alt', '2'] : at(173.4) ? (at(175.0) ? ['Ctrl', 'Home'] : ['Ctrl', '↓']) : ['Ctrl'];
  const keyP = Math.max(prog(f, t(173.4), 8) * (1 - prog(f, t(175.6), 8)), prog(f, t(175.8), 8) * (1 - prog(f, t(179.0), 8)) + 0, prog(f, t(178.66), 8) * (1 - prog(f, t(181.2), 10)));

  const gc = cellCenter(first, 7, {});
  const btn = {x: 204, y: geo(1, 0, 1).rowsTop + 10};
  const pts = dwell([
    {f: t(161.3), x: 900, y: 360},
    {f: t(176.6), x: btn.x, y: btn.y},
    {f: t(177.35), x: fg.checkX, y: fg.checkY(0)},
    {f: t(177.75), x: fg.checkX, y: fg.checkY(2)},
    {f: t(178.15), x: fg.ok.x, y: fg.ok.y},
    {f: t(178.6), x: gc.x, y: gc.y},
    {f: t(181.5), x: 900, y: 420},
  ]);
  const cur = track(f, pts);
  const clicks = [176.9, 177.4, 177.8, 178.2];
  const marquee = at(178.3) && !at(178.8) ? {r1: 2, c1: 7, r2: BIG_LAST, c2: 7} : undefined;
  const seal = prog(f, t(187.2), 18);
  const filterRows = filtered ? CAIRO_ROWS : undefined;

  return (
    <Stage dur={SCENES.s5.dur} inFx="none" outFx="none">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file={opened ? 'manzooma_sales_2026' : 'Book1'} qat={QAT} qatTips={tips} qatHot={f >= t(176.0) && f < t(177.2) ? 1 : alt1 ? 0 : -1}
          nameBox={nameBox} formula={formula} cell={opened ? bigCell : smallCell} sel={sel} active={active} scroll={scroll} rowIds={filterRows}
          filterCols={showFilter ? [1, 2, 3, 4, 5, 6, 7, 8] : undefined} filterApplied={filtered ? [2] : undefined}
          marquee={marquee} marqueeOn={!!marquee} stats={stats} statsGlow={statsGlow} sheet={opened ? 'Sales' : 'Sheet1'}
          statusLeft={filtered ? '10,000 of 50,000 records found' : 'Ready'}
          thumb={jump ? 1 : 0} thumbSize={opened ? 0.02 : 0.55}
        >
          {menuOpen ? <FilterMenu x={196} y={226} branch={HEAD[1]} checks={checks} hotOk={Math.abs(f - t(178.15)) < 6} /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} hide={!at(176.3) || at(181.4)} />
          {QAT.length ? <div style={{display: 'none'}}>{qatCx(0)}</div> : null}
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 770, background: '#fff', opacity: flash, pointerEvents: 'none', borderRadius: 14}} />
      <KeyBadge keys={keys} p={clamp(keyP)} />
      <div style={{position: 'absolute', left: 560, top: 82, opacity: prog(f, t(173.9), 12) * (1 - prog(f, t(176.0), 10)), fontFamily: MONO}}>
        <Chip color={C.blue}>50,000 rows · {fmtInt(BIG_LAST)} with header</Chip>
      </div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(169.84), 12), fontFamily: MONO}}>
        <Chip color={C.green}>manzooma_sales_2026.xlsx</Chip>
      </div>
      <div style={{position: 'absolute', left: 1330, top: 330, width: 330, textAlign: 'center', opacity: seal, transform: `scale(${0.7 + 0.3 * seal})`}}>
        <svg width={230} height={230} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -6}}>ENTERPRISE READY</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>80%+ less routine time</div>
      </div>
      <Caption text="Production Environment ──► Instant Data Filtering & Cleaning via Custom QAT" from={t(163.0)} to={t(183.0)} />
      <Caption text="Execution Efficiency ──► 80%+ Less Time on Routine Setup for Data Analysts" from={t(187.1)} to={t(197.4)} tone="ok" />
    </Stage>
  );
};
