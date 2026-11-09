import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Menu, Ripple, Stage, dwell, menuItemY, prog, ribbonItemBox, sec, tabBox, track} from '../kit';
import type {MenuItem} from '../kit';
import {RangeFx} from '../l7';
import {ALL, ChartBar, ChartLine, DEMO, FormatPane, KpiShape, LB, PANE, SlicerBox, fmt, kpiOf, paneRadio} from '../dash';

// SC04 anchors (s): 136 View | 138 Gridlines | 141 Headings | 143.4 Formula Bar | 145.1 dark canvas | 148.8 select all objects | 154 right-click | 155.4 pane | 157.2 Don't move or size | 158+ locked
const S = START.s4;
const t = (g: number) => sec(g - S);
const MENU: MenuItem[] = [{label: 'Cut', icon: 'cut'}, {label: 'Copy', icon: 'copy'}, {label: 'Paste Options:', dim: true}, {label: '', sep: true}, {label: 'Group', arrow: true}, {label: 'Bring to Front', arrow: true}, {label: 'Send to Back', arrow: true}, {label: '', sep: true}, {label: 'Assign Macro…'}, {label: 'Edit Alt Text…'}, {label: 'Size and Properties…', hot: true}, {label: 'Format Object…'}];
const MIDX = 10;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const gridOn = 1 - prog(f, t(138.4), 12), headOn = 1 - prog(f, t(141.4), 12), fbOn = 1 - prog(f, t(143.8), 12);
  const dy = (1 - fbOn) * -28 + (1 - headOn) * -20, dx = (1 - headOn) * -38;
  const darkRows = Math.floor(prog(f, t(145.1), sec(2.4)) * 40);
  const tab = at(136.0) ? 'View' : 'Home';
  const checks = {Gridlines: gridOn, Headings: headOn, FormulaBar: fbOn};
  const hotChk = within(137.7, 138.5) ? 'Gridlines' : within(140.7, 141.5) ? 'Headings' : within(143.1, 143.9) ? 'FormulaBar' : undefined;

  const tgt = LB.cards.map((c) => ({x: c.x + c.w / 2 + dx, y: c.y + c.h / 2 + dy}));
  const objs = [...LB.cards, LB.chart1, LB.chart2, LB.slicer];
  const objAt = [148.9, 149.5, 150.1, 150.7, 151.5, 152.3, 153.0];
  const selected = (k: number) => at(objAt[k]) && !at(157.6);
  const centerOf = (r: {x: number; y: number; w: number; h: number}) => ({x: r.x + r.w / 2 + dx, y: r.y + r.h / 2 + dy});
  const sl = centerOf(LB.slicer);
  const menuPos = {x: sl.x + 120, y: sl.y - 8};
  const menuP = within(154.0, 155.2);
  const radio = at(157.2) ? 2 : 0;
  const lockP = (k: number) => prog(f, t(158.1 + 0.28 * k), 12);
  const vw = ribbonItemBox('View', 'Gridlines'), vh = ribbonItemBox('View', 'Headings'), vf = ribbonItemBox('View', 'FormulaBar'), vt = tabBox('View');
  const sizeProps = {x: menuPos.x + 70, y: menuItemY(menuPos.y, MENU, MIDX)};
  const pts = dwell([
    {f: t(131.0), x: 760, y: 520},
    {f: t(135.2), x: 760, y: 520},
    {f: t(135.9), x: vt.cx, y: 48},
    {f: t(137.5), x: vw.cx, y: vw.cy},
    {f: t(140.5), x: vh.cx, y: vh.cy},
    {f: t(142.9), x: vf.cx, y: vf.cy},
    {f: t(145.0), x: 900, y: 420},
    {f: t(148.6), x: tgt[0].x, y: tgt[0].y},
    {f: t(149.5), x: tgt[1].x, y: tgt[1].y},
    {f: t(150.1), x: tgt[2].x, y: tgt[2].y},
    {f: t(150.7), x: tgt[3].x, y: tgt[3].y},
    {f: t(151.5), x: centerOf(LB.chart1).x, y: centerOf(LB.chart1).y},
    {f: t(152.3), x: centerOf(LB.chart2).x, y: centerOf(LB.chart2).y},
    {f: t(153.0), x: sl.x, y: sl.y},
    {f: t(154.0), x: sl.x, y: sl.y},
    {f: t(154.9), x: sizeProps.x, y: sizeProps.y},
    {f: t(156.3), x: paneRadio(0).x + 80, y: paneRadio(0).y},
    {f: t(157.2), x: paneRadio(2).x + 80, y: paneRadio(2).y},
    {f: t(159.0), x: 700, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [136.0, 138.0, 141.0, 143.4, 148.9, 149.5, 150.1, 150.7, 151.5, 152.3, 153.0, 154.0, 154.95, 157.2];
  const lockedAll = prog(f, t(158.0), 14);
  const glowAll = prog(f, t(159.8), 14);
  const cardVals = kpiOf(ALL, DEMO);
  const vals = [cardVals.sales, cardVals.profit, cardVals.orders, cardVals.avg];

  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="zoom">
      <ExcelWindow cam={CAM0}>
        <ExcelApp file="manzooma_sales_2026.xlsx" tab={tab} ribbonHot={hotChk} checks={checks} gridOn={gridOn} headOn={headOn} fbOn={fbOn} nameBox="Branch" formula="" cell={(r) => (r <= darkRows ? {t: '', bg: '#0F172A'} : undefined)} sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}} sheets={['Data', 'Pivots', 'Executive Dashboard']} sheet="Executive Dashboard" thumb={0} thumbSize={0.55}>
          <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${dx}px, ${dy}px)`}}>
            <ChartBar rect={LB.chart1} d={DEMO} sel={ALL} selected={selected(4)} locked={lockP(4)} />
            <ChartLine rect={LB.chart2} d={DEMO} sel={ALL} selected={selected(5)} locked={lockP(5)} />
            {LB.cards.map((c, i) => <KpiShape key={i} rect={c} value={fmt(vals[i])} green={1} label={['Total Sales', 'Profit', 'Orders', 'Avg Order'][i]} selected={selected(i)} locked={lockP(i)} />)}
            <SlicerBox rect={LB.slicer} cols={4} sel={ALL} dark={1} selected={selected(6)} locked={lockP(6)} />
            <RangeFx rect={{x: 52, y: 214, w: 1120, h: 404}} color={C.green} p={glowAll * (1 - prog(f, t(164.8), 12))} fill={0.04} label="Protected canvas" labelBelow />
          </div>
          {menuP ? <Menu x={menuPos.x} y={menuPos.y} w={190} items={MENU} /> : null}
          <FormatPane p={prog(f, t(155.4), 10)} radio={radio} glow={within(157.2, 160) ? 1 : 0} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c === 154.0 ? '#2563EB' : undefined} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>
      <KeyBadge keys={['Ctrl', '+ Click']} p={prog(f, t(148.6), 6) * (1 - prog(f, t(153.6), 8))} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(132.0), 10) * (1 - prog(f, t(135.6), 8))}}><Chip color={C.blue}>App-Like UX ──► View tab</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(145.2), 10) * (1 - prog(f, t(148.4), 8))}}><Chip color={C.blue}>Ctrl+A ──► Fill: Slate ──► clean dark canvas</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(148.8), 10) * (1 - prog(f, t(154.0), 8))}}><Chip color={C.amber}>Select all cards, charts and the slicer</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: lockedAll}}><Chip color={C.green}>🔒 Objects locked in place</Chip></div>
      <Caption text="App-Like Interface ──► View ──► Uncheck Gridlines, Headings, & Formula Bar" from={t(133.0)} to={t(148.0)} />
      <Caption text="Layout Protection ──► Format Shape ──► Properties ──► Don't move or size with cells" from={t(154.4)} to={t(165.2)} tone="ok" />
    </Stage>
  );
};
