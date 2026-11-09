import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Cursor, ExcelApp, ExcelWindow, Ripple, Stage, camLerp, dwell, prog, ribbonItemBox, sec, tabBox, track} from '../kit';
import {CAM_SHEET, RangeFx, typeIn} from '../l7';
import {ALL, CAM_TOP, ChartBar, ChartLine, DEMO, KpiShape, LA, LB, NSS, NewSlicerStyle, SlicerBox, fmt, kpiOf, layoutAt, nssElem, only, rollSeq, slicerItem} from '../dash';

// SC03 anchors (s): 85 vertical problem | 97.8 select slicer | 98.6 Slicer tab | 100.8 Columns | 103.2 type 4 | 105-110 resize+move | 112.4 Quick Styles | 113.6 New Slicer Style | 118 OK | 119.5 filter clicks
const S = START.s3;
const t = (g: number) => sec(g - S);
const eo = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const lr = (a: any, b: any, k: number) => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k});

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const camA = camLerp(CAM_SHEET, CAM_TOP, prog(f, t(97.6), 24));
  const cam = camLerp(camA, CAM_SHEET, prog(f, t(111.0), 30));

  const h1 = eo((f - t(105.0)) / sec(4.6)), h2 = eo((f - t(109.4)) / sec(3.4));
  const L = layoutAt(h2);
  const slicerR = lr(LA.slicer, LB.slicer, h1);
  const cols = at(104.0) ? 4 : 1;
  const selSlicer = within(97.8, 111.6);
  const tab = at(98.6) && !at(119.0) ? 'Slicer' : 'Home';
  const dark = prog(f, t(118.3), 14);
  const dialogP = prog(f, t(113.4), 10) * (1 - prog(f, t(118.2), 8));
  const nm = typeIn('Manzooma Dark', f, t(114.0), sec(1.6));
  const hiE = within(116.0, 117.0) ? 2 : within(117.0, 118.0) ? 4 : -1;
  const colField = within(103.2, 111) ? '4' : '1';
  const hotField = within(100.8, 104.0) ? 'Columns' : undefined;

  const selAt = (g: number) => (g < 119.5 ? ALL : g < 123.5 ? only(0, 1) : g < 126.5 ? only(2) : ALL);
  const sel = selAt(f / 30 + S);
  const val = (k: number) => {
    const marks = [119.5, 123.5, 126.5].map((g) => ({at: t(g), v: (() => { const kp = kpiOf(selAt(g + 0.01), DEMO); return [kp.sales, kp.profit, kp.orders, kp.avg][k]; })()}));
    const base = kpiOf(ALL, DEMO); const b0 = [base.sales, base.profit, base.orders, base.avg][k];
    return Math.round(f < marks[0].at ? b0 : rollSeq(f, marks, sec(0.8)));
  };
  const itemPos = (i: number) => { const r = slicerItem(LB.slicer, 4, i); return {x: r.x + r.w / 2, y: r.y + r.h / 2}; };
  const itemA = (i: number) => { const r = slicerItem(LA.slicer, 1, i); return {x: r.x + r.w / 2, y: r.y + r.h / 2}; };
  const hot = within(119.4, 119.9) ? 0 : within(122.4, 122.9) ? 1 : within(125.6, 126.1) ? 2 : -1;
  const colBox = ribbonItemBox('Slicer', 'Columns'), stl = ribbonItemBox('Slicer', 'Styles'), stab = tabBox('Slicer');
  const okB = {x: NSS.x + NSS.w - 190 + 42, y: NSS.y + 280 + 14};
  const pts = dwell([
    {f: t(83.55), x: 700, y: 520},
    {f: t(97.0), x: 700, y: 520},
    {f: t(97.8), x: itemA(2).x - 40, y: LA.slicer.y + 12},
    {f: t(98.5), x: stab.cx, y: 48},
    {f: t(100.6), x: colBox.cx, y: colBox.cy},
    {f: t(104.6), x: colBox.cx, y: colBox.cy},
    {f: t(105.2), x: LA.slicer.x + LA.slicer.w, y: LA.slicer.y + LA.slicer.h},
    {f: t(109.2), x: LB.slicer.x + LB.slicer.w, y: LB.slicer.y + LB.slicer.h},
    {f: t(112.2), x: stl.cx, y: stl.cy},
    {f: t(113.8), x: nssElem(0).x, y: nssElem(0).y},
    {f: t(116.0), x: nssElem(2).x, y: nssElem(2).y},
    {f: t(117.0), x: nssElem(4).x, y: nssElem(4).y},
    {f: t(117.9), x: okB.x, y: okB.y},
    {f: t(119.3), x: itemPos(0).x, y: itemPos(0).y},
    {f: t(122.3), x: itemPos(1).x, y: itemPos(1).y},
    {f: t(125.5), x: itemPos(2).x, y: itemPos(2).y},
    {f: t(128.5), x: 800, y: 470},
  ]);
  const cur = track(f, pts);
  const clicks = [97.8, 98.6, 100.8, 112.4, 117.9, 119.5, 122.5, 125.7];
  const warn = prog(f, t(85.0), 14) * (1 - prog(f, t(96.2), 18));
  const saved = prog(f, t(126.5), 14);

  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="up">
      <ExcelWindow cam={cam}>
        <ExcelApp file="manzooma_sales_2026.xlsx" tab={tab} extraTab={at(97.8) ? 'Slicer' : undefined} ribbonHot={hotField} fields={{Columns: colField, BtnHeight: '0.26"', BtnWidth: '1.5"', Height: '4.08"', Width: '2.0"', Caption: 'Branch'}} nameBox="Branch" formula="" cell={() => undefined} sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} sheets={['Data', 'Pivots', 'Executive Dashboard']} sheet="Executive Dashboard" thumb={0} thumbSize={0.55}>
          <ChartBar rect={L.chart1} d={DEMO} sel={sel} />
          <ChartLine rect={L.chart2} d={DEMO} sel={sel} />
          {L.cards.map((c, i) => <KpiShape key={i} rect={c} value={fmt(val(i))} green={1} label={['Total Sales', 'Profit', 'Orders', 'Avg Order'][i]} />)}
          <SlicerBox rect={slicerR} cols={cols} sel={sel} dark={dark} selected={selSlicer} hot={hot} warn={warn} />
          <RangeFx rect={{x: LA.slicer.x - 4, y: LA.slicer.y, w: LA.slicer.w + 8, h: LA.slicer.h}} color={C.red} p={warn * 0.9} fill={0.08} label="Wastes report space" labelBelow dashed />
          <RangeFx rect={{x: LB.slicer.x, y: LB.slicer.y, w: LB.slicer.w, h: LB.slicer.h}} color={C.green} p={saved * (1 - prog(f, t(130.4), 10))} fill={0.06} label="Compact filter bar" labelBelow />
          <NewSlicerStyle p={dialogP} name={nm} hi={hiE} applied={at(117.5)} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(85.2), 10) * (1 - prog(f, t(96.0), 10))}}><Chip color={C.red}>Vertical slicer ──► eats the report area</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(104.0), 10) * (1 - prog(f, t(111.0), 10))}}><Chip color={C.amber}>Columns: 4 ──► buttons reflow horizontally</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(118.4), 10) * (1 - prog(f, t(125.0), 10))}}><Chip color={C.amber}>Selected = amber</Chip></div>
      <div style={{position: 'absolute', left: 420, top: 82, opacity: prog(f, t(118.4), 10) * (1 - prog(f, t(125.0), 10))}}><Chip color={C.purple}>Unselected = purple</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: saved}}><Chip color={C.green}>Report space saved</Chip></div>
      <Caption text="Multi-Column Slicer Toolbar ──► Slicer ──► Buttons ──► Columns: 4" from={t(98.0)} to={t(112.4)} />
      <Caption text="Custom Dark Styling ──► Compact Horizontal Filter Bar for Web-App Feel" from={t(113.0)} to={t(129.8)} tone="ok" />
    </Stage>
  );
};
