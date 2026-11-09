import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Ripple, Stage, camLerp, dwell, prog, ribbonItemBox, sec, tabBox, track} from '../kit';
import {CAM_SHEET, RangeFx, typeIn} from '../l7';
import {ALL, CAM_TOP, ChartBar, ChartLine, DEMO, KpiShape, LA, ShapesGallery, SlicerBox, fmt, kpiOf, only, rollSeq, shapeCell, slicerItem} from '../dash';

// SC02 anchors (s): 46 Linked KPI Cards | 49.2 Insert | 51.6 Rounded Rectangle | 53.7 select | 54.8 =Pivots!B4 | 56.6 number stream | 65.3 Cairo | 69 +Giza | 72 clear | 73.5 cards 2-4 | 78 filter again
const S = START.s2;
const t = (g: number) => sec(g - S);
const FORM = '=Pivots!B4';
const C1 = LA.cards[0];
const LABELS = [['Total Sales', 'B4'], ['Profit', 'B5'], ['Orders', 'B6'], ['Avg Order', 'B7']];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const camA = camLerp(CAM_SHEET, CAM_TOP, prog(f, t(48.6), 24));
  const cam = camLerp(camA, CAM_SHEET, prog(f, t(57.0), 30));

  const selAt = (g: number) => (g < 65.3 ? ALL : g < 69 ? only(0) : g < 72 ? ALL.map((_, i) => i < 2) : g < 78 ? ALL : g < 81.8 ? only(2, 3) : ALL);
  const sel = selAt(f / 30 + S);
  const slicerR = LA.slicer;
  const hot = within(65.2, 65.7) ? 0 : within(68.9, 69.4) ? 1 : within(78.0, 78.5) ? 2 : within(79.0, 79.5) ? 3 : -1;

  const tab = within(49.2, 53.4) ? 'Insert' : 'Home';
  const galleryP = prog(f, t(50.0), 8) * (1 - prog(f, t(51.9), 6));
  const draw = prog(f, t(51.8), sec(1.2));
  const fillP = prog(f, t(53.2), 24);
  const shapeOn = at(51.8);
  const rectNow = {x: C1.x, y: C1.y, w: C1.w * draw, h: C1.h * draw};
  const selected = within(53.7, 64.2);
  const typing = within(54.8, 56.5);
  const formula = typing ? typeIn(FORM, f, t(54.8), sec(1.5)) : at(56.5) && selected ? FORM : '';
  const nameBox = selected ? 'Rectangle: Rounded Corners 1' : 'A1';

  // KPI values over time (same events drive all four cards)
  const shown = [56.6, 73.5, 74.7, 75.9];
  const evs = (k: number) => {
    const marks = [shown[k], 65.3, 69, 72, 78, 81.8].filter((g) => g >= shown[k]);
    return marks.map((g) => { const kp = kpiOf(selAt(g + 0.01), DEMO); return {at: t(g), v: [kp.sales, kp.profit, kp.orders, kp.avg][k]}; });
  };
  const val = (k: number) => Math.round(rollSeq(f, evs(k), k === 0 && !at(65.3) ? sec(2.2) : sec(0.9)));
  const cardP = [at(51.8) ? 1 : 0, prog(f, t(73.5), 10), prog(f, t(74.7), 10), prog(f, t(75.9), 10)];
  const streaming = within(56.6, 59.0);
  const glow = [Math.max(prog(f, t(56.6), 10) * (1 - prog(f, t(60.5), 20)), within(65.3, 67) ? 1 : 0, within(69, 70.5) ? 1 : 0, within(72, 73.5) ? 1 : 0), 0, 0, 0];
  const greenAmt = prog(f, t(56.6), 12);

  // pointer
  const shp = ribbonItemBox('Insert', 'Shapes'), ins = tabBox('Insert');
  const g1 = shapeCell(1);
  const fbPos = {x: 560, y: 174};
  const it = (i: number) => { const r = slicerItem(slicerR, 1, i); return {x: r.x + r.w / 2, y: r.y + r.h / 2}; };
  const clr = {x: slicerR.x + slicerR.w - 30, y: slicerR.y + 14};
  const pts = dwell([
    {f: t(40.3), x: 700, y: 520},
    {f: t(48.7), x: 700, y: 520},
    {f: t(49.2), x: ins.cx, y: 48},
    {f: t(50.0), x: shp.cx, y: shp.cy},
    {f: t(51.4), x: g1.x, y: g1.y},
    {f: t(51.8), x: C1.x + 6, y: C1.y + 6},
    {f: t(53.0), x: C1.x + C1.w, y: C1.y + C1.h},
    {f: t(53.6), x: C1.x + C1.w / 2, y: C1.y + C1.h / 2},
    {f: t(54.5), x: fbPos.x, y: fbPos.y},
    {f: t(56.8), x: fbPos.x, y: fbPos.y},
    {f: t(57.2), x: 600, y: 420},
    {f: t(64.6), x: it(0).x, y: it(0).y},
    {f: t(68.8), x: it(1).x, y: it(1).y},
    {f: t(71.7), x: clr.x, y: clr.y},
    {f: t(72.6), x: 700, y: 480},
    {f: t(77.6), x: it(2).x, y: it(2).y},
    {f: t(78.9), x: it(3).x, y: it(3).y},
    {f: t(81.5), x: clr.x, y: clr.y},
    {f: t(83.0), x: 720, y: 470},
  ]);
  const cur = track(f, pts);
  const clicks = [49.2, 50.0, 51.5, 53.7, 54.6, 65.3, 69.0, 72.0, 78.0, 79.0, 81.8];
  const keyP = prog(f, t(73.2), 6) * (1 - prog(f, t(76.5), 8));

  return (
    <Stage dur={SCENES.s2.dur} inFx="left" outFx="up">
      <ExcelWindow cam={cam}>
        <ExcelApp file="manzooma_sales_2026.xlsx" tab={tab} nameBox={nameBox} formula={formula} fbEdit={typing} cell={() => undefined} sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} sheets={['Data', 'Pivots', 'Executive Dashboard']} sheet="Executive Dashboard" thumb={0} thumbSize={0.55}>
          <ChartBar rect={LA.chart1} d={DEMO} sel={sel} />
          <ChartLine rect={LA.chart2} d={DEMO} sel={sel} />
          <SlicerBox rect={slicerR} cols={1} sel={sel} hot={hot} />
          {shapeOn ? <KpiShape rect={rectNow} value={at(56.6) ? fmt(val(0)) : ''} fillP={fillP} glow={glow[0]} green={greenAmt} selected={selected} label={at(53.4) ? 'Total Sales  ·  =Pivots!B4' : undefined} /> : null}
          {[1, 2, 3].map((k) => <KpiShape key={k} rect={LA.cards[k]} value={fmt(val(k))} p={cardP[k]} label={`${LABELS[k][0]}  ·  =Pivots!${LABELS[k][1]}`} green={1} glow={within(72, 73.5) ? 1 : 0} />)}
          <RangeFx rect={{x: 0, y: 160, w: 1536, h: 28}} color={C.purple} p={prog(f, t(54.5), 8) * (1 - prog(f, t(57.0), 10))} fill={0.12} />
          <ShapesGallery p={galleryP} hi={within(50.8, 51.9) ? 1 : -1} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>

      <KeyBadge keys={['Ctrl', 'C', 'Ctrl', 'V']} p={keyP} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(45.5), 10) * (1 - prog(f, t(49.0), 8))}}><Chip color={C.blue}>Dynamic Linked KPI Cards</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(54.6), 10) * (1 - prog(f, t(58.0), 8))}}><Chip color={C.purple}>=Pivots!B4 ──► linked to the pivot cell</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(65.2), 10)}}><Chip color={C.green}>Slicer click ──► cards update instantly</Chip></div>
      <Caption text="Linked KPI Cards ──► Insert Shape ──► Formula Bar: =Pivots!B4" from={t(42.5)} to={t(60.0)} />
      <Caption text="Live Executive Metric ──► Dynamic Number Update on Filter Change" from={t(64.0)} to={t(82.0)} tone="ok" />
    </Stage>
  );
};
