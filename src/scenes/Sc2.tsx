import {useCurrentFrame} from "remotion";
import type {ReactNode} from "react";
import {Cap, Cursor, ExcelApp, FormatCellsDialog, Glow, KeyCaps, NUMBOX, Tag, cellRect, eo, lerp, prog, rangeRect, rgba, typed} from "../kit";
import {C, F, M} from "../theme";
import {Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(1, k);
const W = [90, 100];
const CODE = "#,##0;-#,##0;0;@";
const ZC = [C.emerald, C.red, C.amber, C.blue];
const ZN = ["Positive", "Negative", "Zero", "Text"];
const ZX = ["#,##0", "-#,##0", "0", "@"];
const ZE = ["1250 → 1,250", "-1250 → -1,250", "0 → 0", "Hello → Hello"];

const codeNode = (s: string): ReactNode => {
  let z = 0;
  return s.split("").map((ch, i) => {
    if (ch === ";") { z++; return <span key={i} style={{color: C.yellow, fontWeight: 700}}>;</span>; }
    return <span key={i} style={{color: ZC[Math.min(z, 3)]}}>{ch}</span>;
  });
};

export const Sc2 = () => {
  const f = useCurrentFrame();
  const sel = f >= a(1) + 50 ? {r1: 2, c1: 2, r2: 5, c2: 2} : {r1: 2, c1: 2, r2: 2, c2: 2};
  const dK = eo(prog(f, a(2) + 50, 12)) * (1 - eo(prog(f, a(9) + 150, 10)));
  const cat = f >= a(2) + 110 ? "Custom" : "Number";
  const tp = typed(CODE, f, a(3), 4.4);
  const typeNode = f < a(2) + 110 ? "General" : codeNode(tp);
  const cells = [
    {r: 1, c: 2, t: "Sales", bold: true, a: "c" as const},
    {r: 2, c: 2, t: "1250", a: "r" as const}, {r: 3, c: 2, t: "-1250", a: "r" as const}, {r: 4, c: 2, t: "0", a: "r" as const}, {r: 5, c: 2, t: "N/A", a: "l" as const},
    {r: 1, c: 1, t: "Zone", bold: true}, {r: 2, c: 1, t: "Positive"}, {r: 3, c: 1, t: "Negative"}, {r: 4, c: 1, t: "Zero"}, {r: 5, c: 1, t: "Text"},
  ];
  // code card
  const cardK = eo(prog(f, a(3) + 20, 14)) * (1 - eo(prog(f, a(9) + 170, 10)));
  const split = eo(prog(f, a(4), 22)) * (1 - eo(prog(f, a(9), 22)));
  const semi = eo(prog(f, a(3) + 40, 14));
  const pulse = 0.6 + 0.4 * Math.sin(f / 5);
  const widths = [150, 160, 92, 92];
  const cur = f < a(5) ? -1 : f < a(6) ? 0 : f < a(7) ? 1 : f < a(8) ? 2 : f < a(9) ? 3 : -1;
  const B2 = cellRect(2, 2, W);
  const rg = rangeRect(2, 2, 5, 2, W);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(2)} b={a(3)}><Tag label="Format Cells" color={C.blue} parts={[{t: "Ctrl + 1", c: C.yellow}, {t: "  →  Number tab  →  "}, {t: "Custom", c: C.blue}]} /></Cap>,
      <Cap key="1" f={f} a={a(3)} b={a(9) + 10}><Tag label="Custom Format Syntax" color={C.blue} parts={[{t: "Positive", c: C.emerald}, {t: " ; ", c: C.yellow}, {t: "Negative", c: C.red}, {t: " ; ", c: C.yellow}, {t: "Zero", c: C.amber}, {t: " ; ", c: C.yellow}, {t: "Text", c: C.blue}]} /></Cap>,
      <Cap key="2" f={f} a={a(9) + 10} b={9999}><Tag label="Core Rule" color={C.emerald} parts={[{t: "Semi-colons (;) Separate the 4 Formatting Zones"}]} /></Cap>,
    ]}>
      <ExcelApp file="Book1" numFmt={f >= a(9) + 150 ? "Custom" : "General"} name={f >= a(1) + 50 ? "B2" : "B2"} fx="1250" status={f >= a(1) + 50 ? {avg: "0", count: "4", sum: "0"} : undefined}
        sheet={{cells, widths: W, sel, active: {r: 2, c: 2}}}>
        {f < a(1) + 20 ? <Chip x={B2.x + 120} y={B2.y - 2} w={250} color={C.purple} k={win(f, a(0), a(1) + 20)}>Mask ≠ Value — stored number is untouched</Chip> : null}
        {f >= a(1) && f < a(2) + 30 ? <Glow x={NUMBOX.x} y={NUMBOX.y} w={NUMBOX.w} h={NUMBOX.h} color={C.blue} k={win(f, a(1), a(2) + 30)} /> : null}
        <Cursor keys={[{f: a(1) - 10, x: 760, y: 420}, {f: a(1) + 8, x: B2.x + 20, y: B2.y + 6, click: true}, {f: a(1) + 50, x: rg.x + 40, y: rg.y + rg.h - 4}, {f: a(2) + 20, x: 640, y: 380}]} />
        {f >= a(2) + 20 && f < a(2) + 100 ? <KeyCaps x={600} y={300} keys={["Ctrl", "1"]} k={win(f, a(2) + 20, a(2) + 100)} /> : null}
        {dK > 0 ? <FormatCellsDialog x={70} y={196} k={dK} cat={cat} type={typeNode} sample={cat === "Custom" && tp.length >= 5 ? "1,250" : "1250"} listSel={cat === "Custom" ? -1 : -1} typeGlow={f >= a(3) ? C.yellow : undefined} /> : null}
        {cardK > 0 ? (
          <div style={{position: "absolute", left: 512, top: 214, width: 736, height: 300, opacity: cardK, transform: `translateY(${(1 - cardK) * 14}px)`, background: C.slate, border: `2px solid ${rgba(C.blue, 0.7)}`, borderRadius: 12, boxShadow: `0 0 20px ${rgba(C.blue, 0.35)}`, fontFamily: F.mono, boxSizing: "border-box"}}>
            <div style={{position: "absolute", left: 24, top: 14, fontSize: 15, color: C.blue, fontWeight: 700, fontFamily: F.ui}}>Custom Format Code</div>
            <div style={{position: "absolute", left: 0, top: 64, width: 736, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: lerp(0, 14, split)}}>
              {widths.map((w, i) => {
                const lit = eo(prog(f, a(5 + i), 12));
                const on = cur === i ? 1 : 0;
                return (
                  <div key={i} style={{display: "flex", alignItems: "flex-start", gap: lerp(0, 14, split)}}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: w, gap: 12}}>
                      <div style={{width: w, height: 70, borderRadius: 10, border: `2px solid ${rgba(ZC[i], 0.35 + 0.65 * lit)}`, background: rgba(ZC[i], 0.08 + 0.2 * lit), boxShadow: on ? `0 0 ${14 * pulse + 8}px ${ZC[i]}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, color: ZC[i], transform: `scale(${1 + 0.06 * on})`, boxSizing: "border-box"}}>{ZX[i]}</div>
                      <div style={{opacity: lit, color: ZC[i], fontFamily: F.ui, fontWeight: 700, fontSize: 18}}>{ZN[i]}</div>
                      <div style={{opacity: eo(prog(f, a(5 + i) + 6, 12)), color: C.ink, fontSize: 13, whiteSpace: "nowrap"}}>{ZE[i]}</div>
                    </div>
                    {i < 3 ? <div style={{fontSize: 44, fontWeight: 700, color: C.yellow, textShadow: `0 0 ${16 * semi * pulse}px ${C.yellow}`, width: 22, textAlign: "center", lineHeight: "62px"}}>;</div> : null}
                  </div>
                );
              })}
            </div>
            <div style={{position: "absolute", left: 0, top: 252, width: 736, textAlign: "center", color: C.yellow, fontFamily: F.ui, fontWeight: 700, fontSize: 18, opacity: eo(prog(f, a(9), 14))}}>4 zones · 3 semi-colons ✓</div>
          </div>
        ) : null}
      </ExcelApp>
    </Stage>
  );
};
