import {useCurrentFrame} from "remotion";
import {Callout, Cap, Cursor, ExcelApp, FormatCellsDialog, Glow, KeyCaps, Tag, cellRect, clamp, eo, lerp, prog, rangeRect, rgba, typed} from "../kit";
import {C, F} from "../theme";
import {Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(2, k);
const W = [110, 110, 110];
const CODE = '$#,##0.0,, "M"';
const RAW = [15000000, 8250000, 23400000, 4750000];
const fmtM = (n: number) => `$${(Math.round(n / 100000) / 10).toFixed(1)}M`;
const NAMES = ["Sales 2026", "Sales 2025", "Online", "Retail"];

export const Sc3 = () => {
  const f = useCurrentFrame();
  const applyAt = a(5);
  const applied = f >= applyAt + 4;
  const dK = eo(prog(f, a(3) + 4, 12)) * (1 - eo(prog(f, applyAt, 8)));
  const tp = typed(CODE, f, a(4), 2.05);
  const done = tp.length >= CODE.length;
  const cells = [
    {r: 1, c: 1, t: "Item", bold: true}, {r: 1, c: 2, t: "Revenue", bold: true, a: "c" as const}, {r: 1, c: 3, t: "x 2", bold: true, a: "c" as const},
    ...RAW.map((v, i) => ({r: i + 2, c: 1, t: NAMES[i]})),
    ...RAW.map((v, i) => ({r: i + 2, c: 2, t: applied ? fmtM(v) : String(v), a: "r" as const, color: applied ? C.green : C.txt, bold: applied})),
    ...(f >= a(8) ? [{r: 2, c: 3, t: String(RAW[0] * 2), a: "r" as const}] : []),
  ];
  const B2 = cellRect(2, 2, W);
  const rg = rangeRect(2, 2, 5, 2, W);
  const selOn = f >= a(2) + 10;
  const sel = selOn ? {r1: 2, c1: 2, r2: 5, c2: 2} : {r1: 2, c1: 2, r2: 2, c2: 2};
  const fxGlow = f >= a(6) && f < a(8) + 120 ? C.purple : undefined;
  // zeros-shrink animation (15,000,000 → $15.0M)
  const sh = eo(prog(f, applyAt + 2, 36));
  const showShrink = f >= applyAt + 2 && f < applyAt + 150;
  const kS = win(f, applyAt + 2, applyAt + 150, 12);
  // balance (math integrity)
  const bk = win(f, a(8), 9999, 14);
  const tilt = 14 * Math.exp(-(f - a(8)) / 18) * Math.cos((f - a(8)) / 4);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(3)} b={a(5) + 40}><Tag label="Millions Scale Format" color={C.emerald} parts={[{t: "Type: "}, {t: '$#,##0.0,, "M"', c: C.emerald}, {t: " for Executive Reports"}]} /></Cap>,
      <Cap key="1" f={f} a={a(5) + 40} b={9999}><Tag label="Integrity Protection" color={C.purple} parts={[{t: "Displays "}, {t: "$15.0M", c: C.emerald}, {t: " | Stores Full Value: "}, {t: "15,000,000", c: C.purple}]} /></Cap>,
    ]}>
      <ExcelApp file="Book1" name={selOn && !applied ? "B2:B5" : "B2"} numFmt={applied ? "Custom" : "General"} fx={<span style={{color: fxGlow ? C.purple : C.txt, fontWeight: fxGlow ? 700 : 400}}>{String(RAW[0])}</span>} fxGlow={fxGlow}
        status={selOn ? (applied ? undefined : {avg: "12850000", count: "4", sum: "51400000"}) : undefined}
        sheet={{cells, widths: W, sel, active: {r: 2, c: 2}}}>
        {f >= a(1) && f < a(3) ? <Glow x={B2.x} y={B2.y} w={B2.w - 1} h={B2.h - 1} color={C.emerald} k={win(f, a(1), a(3))} /> : null}
        {f >= a(2) && f < a(3) ? <Callout x={B2.x + 150} y={B2.y + 50} w={250} tx={rg.x + rg.w} ty={rg.y + rg.h / 2} color={C.red} k={win(f, a(2), a(3))} size={15}>Visual clutter for management</Callout> : null}
        <Cursor keys={[{f: a(2) - 20, x: 700, y: 420}, {f: a(2) + 2, x: B2.x + 30, y: B2.y + 6, click: true}, {f: a(2) + 40, x: rg.x + 50, y: rg.y + rg.h - 4}, {f: a(3) + 10, x: 700, y: 420}, {f: applyAt - 18, x: 700, y: 420}, {f: applyAt - 4, x: 395, y: 590, click: true}, {f: applyAt + 30, x: 700, y: 420}]} />
        {f >= a(3) - 10 && f < a(3) + 40 ? <KeyCaps x={620} y={290} keys={["Ctrl", "1"]} k={win(f, a(3) - 10, a(3) + 40)} /> : null}
        {dK > 0 ? <FormatCellsDialog x={70} y={196} k={dK} cat="Custom" type={<span style={{color: C.green}}>{tp}</span>} sample={done ? "$15.0M" : "15000000"} sampleColor={done ? C.green : undefined} typeGlow={C.emerald} okHot={f >= applyAt - 6 ? 1 : 0} /> : null}
        {kS > 0 ? (
          <div style={{position: "absolute", left: 540, top: 250, width: 520, height: 150, opacity: kS, background: C.slate, border: `2px solid ${C.emerald}`, borderRadius: 14, boxShadow: `0 0 24px ${rgba(C.emerald, 0.5)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 54, color: C.emerald, boxSizing: "border-box"}}>
            <span>$15</span>
            <span style={{display: "inline-block", overflow: "hidden", width: lerp(190, 0, sh), opacity: 1 - sh, color: C.red, whiteSpace: "nowrap", transform: `scaleX(${lerp(1, 0.2, sh)})`, transformOrigin: "left"}}>,000,000</span>
            <span style={{color: C.ink, opacity: sh}}>.0</span>
            <span style={{color: C.yellow, textShadow: `0 0 ${18 * sh}px ${C.yellow}`}}>{sh > 0.4 ? "M" : ""}</span>
          </div>
        ) : null}
        {f >= a(6) && f < a(8) ? <Callout x={380} y={260} w={310} tx={420} ty={168} color={C.purple} k={win(f, a(6), a(8))} size={16}>Formula Bar: still 15000000</Callout> : null}
        {f >= a(7) && f < a(8) ? <Chip x={rg.x + rg.w + 30} y={rg.y + 4} w={190} color={C.emerald} k={win(f, a(7), a(8))}>Executive-ready ✓</Chip> : null}
        {bk > 0 ? (
          <div style={{position: "absolute", left: 640, top: 270, width: 560, height: 250, opacity: bk, background: C.slate, border: `2px solid ${C.purple}`, borderRadius: 14, boxShadow: `0 0 22px ${rgba(C.purple, 0.45)}`, boxSizing: "border-box", fontFamily: F.ui}}>
            <div style={{position: "absolute", left: 20, top: 12, color: C.purple, fontWeight: 700, fontSize: 16}}>Math integrity — C2 = B2 × 2</div>
            <svg width="560" height="250" style={{position: "absolute", left: 0, top: 0}}>
              <g transform={`rotate(${tilt} 280 110)`}>
                <line x1="90" y1="110" x2="470" y2="110" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
                <line x1="90" y1="110" x2="90" y2="150" stroke={C.ink} strokeWidth="2" /><line x1="470" y1="110" x2="470" y2="150" stroke={C.ink} strokeWidth="2" />
                <g transform={`rotate(${-tilt} 90 150)`}><rect x="30" y="150" width="120" height="48" rx="8" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="2" /><text x="90" y="182" fontSize="22" fontWeight="700" textAnchor="middle" fill={C.emerald} fontFamily={F.mono}>$15.0M</text></g>
                <g transform={`rotate(${-tilt} 470 150)`}><rect x="395" y="150" width="150" height="48" rx="8" fill={rgba(C.purple, 0.2)} stroke={C.purple} strokeWidth="2" /><text x="470" y="182" fontSize="20" fontWeight="700" textAnchor="middle" fill={C.purple} fontFamily={F.mono}>15,000,000</text></g>
              </g>
              <path d="M280 110 L280 200 M250 210 H310" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
              <circle cx="280" cy="110" r="9" fill={C.yellow} />
            </svg>
            <div style={{position: "absolute", left: 0, top: 214, width: 560, textAlign: "center", color: C.ink, fontWeight: 700, fontSize: 16, opacity: clamp((f - a(8) - 30) / 14)}}>C2 = 30,000,000 ✓  same value, different mask</div>
          </div>
        ) : null}
      </ExcelApp>
    </Stage>
  );
};
