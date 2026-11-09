import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {cwD, pivotCell} from '../data';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, Ripple, Stage, TopBadge, camLerp, dwell, prog, sec, sheetTabBox, track} from '../kit';
import {CAM_SHEET, RangeFx, typeIn} from '../l7';
import {ChartBar, ChartLine, DEMO, ALL, LA, SlicerBox, ZoneBox} from '../dash';

// SC01 anchors (s): 3 badge | 14.5-27.5 wireframe | 28 separate calc / presentation | 32.1 new sheet | 33-36.4 rename | 37 charts in | 38.6 grid snap
const S = START.s1;
const t = (g: number) => sec(g - S);
const NAME = 'Executive Dashboard';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(5.5), 50));

  const renaming = within(33.0, 36.4);
  const tabLabel = within(33.0, 33.6) ? 'Sheet1' : renaming ? typeIn(NAME, f, t(33.5), sec(2.8)) : NAME;
  const sheets = at(32.1) ? ['Data', 'Pivots', tabLabel || ' '] : ['Data', 'Pivots'];
  const active = at(32.1) ? sheets[2] : 'Pivots';
  const plus = sheetTabBox(sheets, '').plusX;
  const tabRect = (nm: string) => { const b = sheetTabBox(sheets, nm); return {x: b.x, y: 622, w: b.w, h: 26}; };
  const onDash = at(32.1);

  const pts = dwell([
    {f: t(0), x: 780, y: 520},
    {f: t(27.5), x: 820, y: 470},
    {f: t(31.4), x: plus + 10, y: 636},
    {f: t(33.0), x: tabRect(sheets[2] ?? 'x').x + 40, y: 636},
    {f: t(36.8), x: 900, y: 440},
    {f: t(40.0), x: 900, y: 440},
  ]);
  const cur = track(f, pts);
  const clicks = [32.1, 33.0, 33.25];

  const wire = prog(f, t(14.5), 14) * (1 - prog(f, t(27.4), 14));
  const sepP = prog(f, t(28.0), 12) * (1 - prog(f, t(32.0), 10));
  const chart1 = prog(f, t(37.0), 14), chart2 = prog(f, t(38.0), 14);
  const snap = prog(f, t(38.6), 12);
  const scatter = !onDash;
  const pvHi = prog(f, t(5.0), 10) * (1 - prog(f, t(14.0), 10));

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="left">
      <ExcelWindow cam={cam}>
        <ExcelApp file="manzooma_sales_2026.xlsx" nameBox="A1" formula="" colW={cwD} cell={(r, c) => (onDash ? undefined : pivotCell(r, c))} sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} sheets={sheets} sheet={active} thumb={0} thumbSize={0.55}>
          {scatter ? <ChartBar rect={{x: 560, y: 224, w: 330, h: 210}} d={DEMO} sel={ALL} plain selected={within(9, 14)} /> : null}
          {scatter ? <ChartLine rect={{x: 920, y: 300, w: 330, h: 210}} d={DEMO} sel={ALL} plain /> : null}
          {scatter ? <RangeFx rect={{x: 38, y: 238, w: 440, h: 190}} color={C.amber} p={pvHi} fill={0.08} label="Scattered reports" labelBelow /> : null}
          <ChartBar rect={LA.chart1} d={DEMO} sel={ALL} p={chart1} />
          <ChartLine rect={LA.chart2} d={DEMO} sel={ALL} p={chart2} />
          <SlicerBox rect={LA.slicer} cols={1} sel={ALL} p={prog(f, t(38.0), 14)} />
          <ZoneBox rect={{x: LA.cards[0].x, y: LA.cards[0].y, w: LA.cards[3].x + 220 - LA.cards[0].x, h: 78}} color={C.blue} p={snap} label="KPI CARDS" />
          <ZoneBox rect={LA.slicer} color={C.purple} p={snap} label="FILTERS" />
          <ZoneBox rect={{x: 60, y: 312, w: 900, h: 300}} color={C.blue} p={snap} label="CHARTS" />
          <RangeFx rect={tabRect('Data')} color={C.amber} p={sepP} fill={0.2} />
          <RangeFx rect={tabRect('Pivots')} color={C.amber} p={sepP} fill={0.2} />
          {onDash && sepP < 0.01 && !at(36.4) ? <RangeFx rect={tabRect(sheets[2])} color={C.blue} p={prog(f, t(32.1), 8)} fill={0.2} /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="الدرس 31 من 76 | الوحدة 6 من 14 ──► Pivot Dashboards & KPI Engine" from={t(2.0)} to={t(18.0)} />

      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: `rgba(11,18,34,${0.7 * wire})`, opacity: wire > 0.01 ? 1 : 0}} />
      <div style={{position: 'absolute', left: 360, top: 230, width: 1200, height: 640, opacity: wire, transform: `scale(${0.94 + 0.06 * wire})`, borderRadius: 26, background: C.card, border: `2px solid ${C.blue}`, boxShadow: `0 0 50px ${C.blue}44`}} dir="ltr">
        <div style={{position: 'absolute', left: 40, top: 22, fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.text}}>Executive Dashboard</div>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 40 + i * 282, top: 84, width: 262, height: 100, borderRadius: 18, border: `2.5px solid #06B6D4`, background: '#0B1222', opacity: prog(f, t(16 + i * 0.8), 10), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.green}}>{['1,250,000', '312,500', '8,418', '148'][i]}</div>)}
        <div style={{position: 'absolute', left: 40, top: 204, width: 1120, height: 62, borderRadius: 12, border: `2px solid ${C.purple}`, background: `${C.purple}22`, opacity: prog(f, t(20.5), 10), display: 'flex', gap: 10, padding: 10, boxSizing: 'border-box'}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{flex: 1, borderRadius: 8, background: i === 0 ? C.amber : '#581C87'}} />)}</div>
        <div style={{position: 'absolute', left: 40, top: 286, width: 548, height: 312, borderRadius: 14, border: `2px solid ${C.blue}`, background: `${C.blue}18`, opacity: prog(f, t(23), 10)}}>
          <svg width={548} height={312}>{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={30 + i * 62} y={240 - [150, 90, 80, 50, 60, 36, 44, 78][i]} width={42} height={[150, 90, 80, 50, 60, 36, 44, 78][i]} rx={4} fill={C.blue} />)}</svg>
        </div>
        <div style={{position: 'absolute', left: 612, top: 286, width: 548, height: 312, borderRadius: 14, border: `2px solid ${C.blue}`, background: `${C.blue}18`, opacity: prog(f, t(25), 10)}}>
          <svg width={548} height={312}><path d="M30 220L100 190L170 170L240 150L310 160L380 120L450 130L520 90" fill="none" stroke={C.amber} strokeWidth={5} strokeLinejoin="round" /></svg>
        </div>
      </div>

      <div style={{position: 'absolute', left: 100, top: 150, opacity: prog(f, t(5.0), 10) * (1 - prog(f, t(14.0), 10))}}><Chip color={C.amber}>Scattered pivot reports</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: sepP}}><Chip color={C.amber}>Calculation tabs: Data · Pivots</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 130, opacity: sepP}}><Chip color={C.blue}>Presentation tab: Executive Dashboard</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(37.0), 10)}}><Chip color={C.blue}>2 pivot charts ──► Dashboard</Chip></div>
      <div style={{position: 'absolute', left: 1340, top: 82, opacity: snap, fontFamily: MONO}}><Chip color={C.blue}>⊞ layout grid snapped</Chip></div>
      <Caption text="Canvas Setup ──► Dedicated Dashboard Tab (Separate Calculations from UI Layout)" from={t(28.5)} to={t(39.6)} />
    </Stage>
  );
};
