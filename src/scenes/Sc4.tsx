import {useCurrentFrame} from "remotion";
import type {ReactNode} from "react";
import {Callout, Cap, Cursor, ExcelApp, FormatCellsDialog, KeyCaps, Tag, cellRect, clamp, eo, prog, rangeRect, rgba} from "../kit";
import {C, F} from "../theme";
import {Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(3, k);
const W = [100, 100];
const NAMES = ["Laptops", "Phones", "Tablets", "Monitors", "Cables", "Docks", "Chargers"];
const VAL = [5000, -2500, 0, 12000, -800, 3400, 0];
const CODE = '[Color10]▲ #,##0;[Red]▼ (#,##0);"-";@';
const ZC = [C.emerald, C.red, C.amber, C.blue];
const GREEN = "#008000";
const int = (n: number) => Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const shown = (v: number) => (v > 0 ? `▲ ${int(v)}` : v < 0 ? `▼ (${int(v)})` : "-");
const col = (v: number) => (v > 0 ? GREEN : v < 0 ? "#FF0000" : C.txt);

const codeNode = (s: string): ReactNode => {
  let z = 0;
  return s.split("").map((ch, i) => {
    if (ch === ";") { z++; return <span key={i} style={{color: C.yellow, fontWeight: 700}}>;</span>; }
    return <span key={i} style={{color: ZC[Math.min(z, 3)]}}>{ch}</span>;
  });
};

export const Sc4 = () => {
  const f = useCurrentFrame();
  const t1 = prog(f, a(2), a(3) - a(2));
  const t2 = prog(f, a(3), a(4) - a(3));
  const t3 = prog(f, a(4), a(5) - a(4));
  const n = Math.round(f < a(2) ? 0 : f < a(3) ? 16 * t1 : f < a(4) ? 16 + 15 * t2 : 31 + 6 * t3);
  const tp = CODE.slice(0, n);
  const dOpen = a(1) + 140;
  const apply = a(5);
  const dK = eo(prog(f, dOpen, 12)) * (1 - eo(prog(f, apply, 8)));
  const rev = VAL.map((v, i) => clamp((f - (apply + 4 + i * 5)) / 8));
  const rg = rangeRect(2, 2, 8, 2, W);
  const B2 = cellRect(2, 2, W);
  const selFull = f >= a(1) + 60;
  const cells = [
    {r: 1, c: 1, t: "Product", bold: true}, {r: 1, c: 2, t: "Change", bold: true, a: "c" as const},
    ...NAMES.map((t, i) => ({r: i + 2, c: 1, t})),
    ...VAL.map((v, i) => {
      const k = rev[i];
      const on = k > 0.5;
      const flash = Math.sin(Math.PI * k);
      const fc = v > 0 ? "16,128,65" : v < 0 ? "239,68,68" : "245,158,11";
      return {r: i + 2, c: 2, t: on ? shown(v) : String(v), a: "r" as const, color: on ? col(v) : C.txt, bg: k > 0 && k < 1 ? `rgba(${fc},${0.45 * flash})` : undefined};
    }),
  ];
  const showStats = selFull && f < apply;
  const legend = [
    {k: 0, c: C.emerald, t: "▲  Positive = green", y: B2.y - 2},
    {k: 1, c: C.red, t: "▼  Negative = red", y: B2.y + 18},
    {k: 2, c: C.amber, t: "-   Zero = dash", y: B2.y + 38},
  ];
  const cmp = win(f, a(7), 9999, 14);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(6)}><Tag label="Dynamic Indicators" color={C.emerald} parts={[{t: "[Color10]▲ #,##0", c: C.emerald}, {t: " ; ", c: C.yellow}, {t: "[Red]▼ (#,##0)", c: C.red}, {t: " ; ", c: C.yellow}, {t: '"-"', c: C.amber}]} /></Cap>,
      <Cap key="1" f={f} a={a(6)} b={9999}><Tag label="Zero Lag Formatting" color={C.emerald} parts={[{t: "Native Color & Arrow Formatting Without Conditional Rules"}]} /></Cap>,
    ]}>
      <ExcelApp file="Book1" name={selFull && f < apply ? "B2:B8" : "B2"} numFmt={f >= apply + 10 ? "Custom" : "General"} fx={String(VAL[0])}
        status={showStats ? {avg: "2442.857143", count: "7", sum: "17100"} : undefined}
        sheet={{cells, widths: W, sel: selFull ? {r1: 2, c1: 2, r2: 8, c2: 2} : {r1: 2, c1: 2, r2: 2, c2: 2}, active: {r: 2, c: 2}}}>
        <Cursor keys={[{f: a(1) - 20, x: 700, y: 420}, {f: a(1) + 4, x: B2.x + 30, y: B2.y + 6, click: true}, {f: a(1) + 60, x: rg.x + 50, y: rg.y + rg.h - 4}, {f: dOpen - 30, x: 760, y: 440}, {f: apply - 18, x: 700, y: 430}, {f: apply - 4, x: 395, y: 590, click: true}, {f: apply + 30, x: 780, y: 330}]} />
        {f >= a(1) + 90 && f < a(1) + 150 ? <KeyCaps x={620} y={290} keys={["Ctrl", "1"]} k={win(f, a(1) + 90, a(1) + 150)} /> : null}
        {dK > 0 ? <FormatCellsDialog x={70} y={196} k={dK} cat="Custom" type={codeNode(tp)} sample={n >= 16 ? <span style={{color: GREEN}}>▲ 5,000</span> : "5000"} typeGlow={C.yellow} okHot={f >= apply - 6 ? 1 : 0} /> : null}
        {f >= a(2) + 90 && f < a(5) ? <Chip x={520} y={236} w={460} h={30} color={C.amber} k={win(f, a(2) + 90, a(5))} size={14}>[Color10] = dark green · [Green] is neon lime on white</Chip> : null}
        {legend.map((l) => {
          const s = a(6) + l.k * 34;
          const k = eo(prog(f, s, 12));
          return k > 0 ? <Callout key={l.k} x={B2.x + B2.w + 60} y={B2.y + 96 + l.k * 46} w={230} tx={B2.x + B2.w - 4} ty={l.y + 10} color={l.c} k={k} size={15}>{l.t}</Callout> : null;
        })}
        {cmp > 0 ? (
          <div style={{position: "absolute", left: 640, top: 330, width: 560, height: 150, opacity: cmp, background: C.slate, border: `2px solid ${C.emerald}`, borderRadius: 14, boxShadow: `0 0 22px ${rgba(C.emerald, 0.4)}`, fontFamily: F.ui, boxSizing: "border-box", padding: "16px 24px", color: C.ink}}>
            <div style={{fontSize: 18, fontWeight: 700, color: C.emerald}}>Custom Number Format</div>
            <div style={{fontSize: 15, marginTop: 4}}>0 rules to manage · file stays light · instant</div>
            <div style={{fontSize: 18, fontWeight: 700, color: "#94A3B8", marginTop: 14}}>Conditional Formatting</div>
            <div style={{fontSize: 15, marginTop: 4, color: "#94A3B8"}}>rules list to maintain on every range</div>
          </div>
        ) : null}
      </ExcelApp>
    </Stage>
  );
};
