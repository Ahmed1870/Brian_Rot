import {useCurrentFrame} from "remotion";
import {Cap, Cursor, ExcelApp, Glow, Tag, cellRect, clamp, eo, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {ROWS, W, tbl, usd} from "../data";
import {Chip, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(3, k);
const G = "#0B8A4B", B = "#0B6FA8", A = "#B7791F";
const mk = (fn: string): Tok[] => [{t: `=${fn}(`}, {t: "tbl_Sales2026[Revenue]", c: G}, {t: ","}, {t: "tbl_Sales2026[Product]", c: B}, {t: ","}, {t: '"Product A"', c: A}, {t: ","}, {t: "tbl_Sales2026[Branch]", c: B}, {t: ","}, {t: '"Cairo"', c: A}, {t: ")"}];
const MIN = mk("MINIFS"), MAX = mk("MAXIFS");
const idx = ROWS.map((r, i) => (r[0] === "Cairo" && r[1] === "Product A" ? i : -1)).filter((i) => i >= 0);

export const Sc4 = () => {
  const f = useCurrentFrame();
  const t1 = a(2) + 130, t2 = a(3) + 130;
  const nMin = nTyped(f, a(2), a(2) + 115, tlen(MIN)), nMax = nTyped(f, a(3), a(3) + 115, tlen(MAX));
  const showMax = f >= a(3);
  const hl = f >= a(0) + 20 ? (i: number) => (idx.includes(i) ? rgba(C.blue, 0.2) : undefined) : undefined;
  const cells = [...tbl(hl), {r: 2, c: 5, t: "Floor (MINIFS)", bold: true}, {r: 3, c: 5, t: "Ceiling (MAXIFS)", bold: true},
    ...(f >= t1 ? [{r: 2, c: 6, t: "$1,200", a: "r" as const, bold: true, color: "#B7791F"}] : []), ...(f >= t2 ? [{r: 3, c: 6, t: "$145,000", a: "r" as const, bold: true, color: C.green}] : [])];
  const row = (i: number) => cellRect(1, i + 2, W);
  const r1200 = idx.find((i) => ROWS[i][2] === 1200) ?? 4, r145 = idx.find((i) => ROWS[i][2] === 145000) ?? 9;
  const gk = win(f, a(4), 9999, 16);
  const gx = (v: number) => 40 + (v / 150000) * 590;
  const grow = eo(prog(f, a(4) + 20, 60));
  const x0 = gx(1200), x1 = x0 + (gx(145000) - x0) * grow;
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(4)}><Tag label="MINIFS & MAXIFS" color={C.amber} parts={[{t: "Extract Minimum & Maximum Values Matching Specific Criteria"}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Outlier & Range Detection" color={C.emerald} parts={[{t: "Identify Floor "}, {t: "($1,200)", c: C.amber}, {t: " & Ceiling "}, {t: "($145,000)", c: C.emerald}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name={showMax ? "F3" : "F2"} editing={(f >= a(2) && f < t1) || (f >= a(3) && f < t2)} fx={f >= a(3) ? <Fx toks={MAX} n={nMax} /> : f >= a(2) ? <Fx toks={MIN} n={nMin} /> : ""}
        sheet={{cells, widths: W, active: showMax ? {r: 3, c: 6} : {r: 2, c: 6}, sel: showMax ? {r1: 3, c1: 6, r2: 3, c2: 6} : {r1: 2, c1: 6, r2: 2, c2: 6}}}>
        {f >= a(0) + 20 && f < a(2) ? <Chip x={600} y={236} w={360} color={C.blue} k={win(f, a(0) + 20, a(2))} size={15}>Focus: Product A · Cairo (4 visible deals)</Chip> : null}
        {f >= t1 && f < t1 + 120 ? <Glow x={row(r1200).x} y={row(r1200).y} w={row(r1200).w + 90 + 92 - 1 + 12} h={19} color={C.amber} k={win(f, t1, t1 + 120)} /> : null}
        {f >= t2 && f < t2 + 120 ? <Glow x={row(r145).x} y={row(r145).y} w={row(r145).w + 90 + 92 - 1 + 12} h={19} color={C.emerald} k={win(f, t2, t2 + 120)} /> : null}
        {f >= t1 && f < a(4) ? <Glow x={cellRect(6, 2, W).x} y={cellRect(6, 2, W).y} w={131} h={19} color={C.amber} k={eo(prog(f, t1, 10))} /> : null}
        {f >= t2 && f < a(4) + 60 ? <Glow x={cellRect(6, 3, W).x} y={cellRect(6, 3, W).y} w={131} h={19} color={C.emerald} k={eo(prog(f, t2, 10))} /> : null}
        {gk > 0 ? (
          <div style={{position: "absolute", left: 590, top: 262, width: 670, height: 190, opacity: gk, background: C.slate, border: `2px solid ${rgba(C.emerald, 0.7)}`, borderRadius: 14, boxShadow: `0 0 20px ${rgba(C.emerald, 0.3)}`, boxSizing: "border-box", fontFamily: F.ui, color: C.ink}}>
            <div style={{position: "absolute", left: 20, top: 12, fontSize: 16, fontWeight: 700, color: C.emerald}}>Min–Max Range · Product A · Cairo</div>
            <div style={{position: "absolute", left: 40, top: 84, width: 590, height: 6, background: "#334155", borderRadius: 3}} />
            <div style={{position: "absolute", left: x0, top: 80, width: Math.max(0, x1 - x0), height: 14, background: `linear-gradient(90deg, ${C.amber}, ${C.emerald})`, borderRadius: 7, boxShadow: `0 0 14px ${rgba(C.emerald, 0.6)}`}} />
            <div style={{position: "absolute", left: x0 - 7, top: 77, width: 14, height: 20, borderRadius: 7, background: C.amber, boxShadow: `0 0 12px ${C.amber}`}} />
            <div style={{position: "absolute", left: x1 - 7, top: 77, width: 14, height: 20, borderRadius: 7, background: C.emerald, boxShadow: `0 0 12px ${C.emerald}`, opacity: grow > 0.02 ? 1 : 0}} />
            <div style={{position: "absolute", left: 14, top: 112, fontSize: 18, fontWeight: 700, color: C.amber}}>Floor $1,200</div>
            <div style={{position: "absolute", left: 470, top: 112, width: 180, textAlign: "right", fontSize: 18, fontWeight: 700, color: C.emerald}}>Ceiling $145,000</div>
            <div style={{position: "absolute", left: 0, top: 144, width: 670, textAlign: "center", fontSize: 22, fontWeight: 700, opacity: clamp((f - a(4) - 70) / 14)}}>Range = $145,000 − $1,200 = $143,800</div>
          </div>
        ) : null}
        <Cursor keys={[{f: a(2) - 20, x: 900, y: 420}, {f: a(2), x: cellRect(6, 2, W).x + 30, y: cellRect(6, 2, W).y + 8, click: true}, {f: a(3), x: cellRect(6, 3, W).x + 30, y: cellRect(6, 3, W).y + 8, click: true}, {f: a(3) + 140, x: 900, y: 500}]} />
      </ExcelApp>
    </Stage>
  );
};
void usd;
