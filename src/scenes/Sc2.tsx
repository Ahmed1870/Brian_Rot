import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, SpillBox, Tag, cellRect, eo, prog, rangeRect, rgba} from "../kit";
import {C} from "../theme";
import {block} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(1, k);
const W = [56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 24, 76, 76, 76, 56, 56, 56];
const HEAD = ["ID", "Date", "Branch", "Product", "Cat", "Units", "Price", "Disc", "Cost", "Tax", "Region", "Revenue"];
const RAW: [string, string, string, string, string, number, number, number, number, number, string][] = [
  ["S-101", "1/5", "Cairo", "Laptop", "Tech", 12, 4500, 0, 36000, 7560, "East"], ["S-102", "1/6", "Alex", "Phone", "Tech", 30, 1400, 500, 30000, 5810, "North"], ["S-103", "1/7", "Giza", "Tablet", "Tech", 8, 2000, 0, 11000, 2240, "West"],
  ["S-104", "1/8", "Cairo", "Mouse", "Acc", 40, 200, 0, 5600, 1120, "East"], ["S-105", "1/9", "Giza", "Cable", "Acc", 90, 150, 150, 9000, 1869, "West"],
];
const ROWS = RAW.map((r) => [...r, r[5] * r[6] - r[7]]);
const T: Tok[] = [{t: "=CHOOSECOLS(", c: FC.c}, {t: "tbl_Master", c: FC.b}, {t: ","}, {t: "1", c: FC.a}, {t: ","}, {t: "3", c: FC.a}, {t: ","}, {t: "12", c: FC.a}, {t: ")", c: FC.c}];
const KEEP = [1, 3, 12];

export const Sc2 = () => {
  const f = useCurrentFrame();
  const ts = a(1), en = a(4) + 135;
  const n = nTyped(f, ts + 10, a(4) + 100, tlen(T));
  const ed = f >= ts && f < en;
  const beams = KEEP.map((c, i) => prog(f, a(4) + i * 40, 24));
  const dim = f >= a(4) + 10 && f < a(5) ? eo(prog(f, a(4) + 10, 20)) : f >= a(5) ? 0.0 : 0;
  const slide = prog(f, en, 36);
  const out = ROWS.map((r) => [r[0], r[2], r[11]]);
  const cells = [...block(1, 1, [HEAD, ...ROWS.map((r) => r.slice(0, 12))], {hdr: true}),
    ...(f >= en + 36 ? block(2, 14, out, {color: "#0E7490", bg: "#E0F7FA"}).map((c) => ({...c, bold: c.c === 16})) : []),
    ...(f >= en + 36 ? block(1, 14, [["ID", "Branch", "Revenue"]], {hdr: true}).map((c) => ({...c, bg: "#0891B2"})) : ed ? [{r: 2, c: 14, t: <span style={{color: "#555"}}>=CHOOSECOLS(tbl_M…</span>}] : [])];
  const col = (c: number) => rangeRect(1, c, 6, c, W);
  const N2 = cellRect(14, 2, W);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(5)}><Tag label="CHOOSECOLS Mechanics" color={C.amber} parts={[{t: "=CHOOSECOLS(array, "}, {t: "col_1, col_3, col_12", c: C.amber}, {t: ") Extracts Target Columns"}]} /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="Zero Clutter" color={C.emerald} parts={[{t: "Strips Unwanted Columns Without Changing Source Data"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Master"]} name="N2" editing={ed} fx={f >= ts ? <Fx toks={T} n={f >= en ? 999 : n} /> : ""}
        sheet={{cells, widths: W, active: {r: 2, c: 14}, sel: {r1: 2, c1: 14, r2: 2, c2: 14}}}>
        {f < a(1) ? <Chip x={330} y={330} w={420} color={C.blue} k={win(f, a(0), a(1))} size={15}>tbl_Master · 12 columns wide</Chip> : null}
        {dim > 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((c) => !KEEP.includes(c)).map((c) => <div key={c} style={{position: "absolute", left: col(c).x, top: col(c).y, width: col(c).w - 1, height: col(c).h, background: `rgba(255,255,255,${0.72 * dim})`}} />) : null}
        {KEEP.map((c, i) => beams[i] > 0 && f < a(5) + 60 ? <div key={c}><Glow x={col(c).x} y={col(c).y} w={col(c).w - 1} h={col(c).h} color={C.amber} k={eo(beams[i])} fill={0.1} /><div style={{position: "absolute", left: col(c).x + 26, top: col(c).y - 6 + 100 * beams[i], width: 4, height: 28, background: C.amber, boxShadow: `0 0 12px ${C.amber}`, opacity: 1 - beams[i] * 0.6}} /></div> : null)}
        {ed && n <= 12 ? <AutoComp x={N2.x} y={N2.y + 20} typed={"=CHOOSECOLS".slice(0, n)} /> : null}
        {ed && n > 12 ? <ArgTip x={N2.x - 120} y={N2.y + 22} sig={["CHOOSECOLS(", "array,", "col_num1,", "[col_num2],", "…)"]} cur={Math.min(3, (T.map((k) => k.t).join("").slice(0, n).match(/,/g) ?? []).length)} /> : null}
        <Enter x={N2.x + 60} y={N2.y - 4} k={win(f, en - 4, en + 14, 4)} />
        {slide > 0 && slide < 1 ? KEEP.map((c, i) => { const s = col(c), d = rangeRect(1, 14 + i, 6, 14 + i, W); return <div key={c} style={{position: "absolute", left: s.x + (d.x - s.x) * eo(slide), top: s.y, width: s.w - 1, height: s.h, background: rgba("#06B6D4", 0.4), border: "2px solid #06B6D4", boxShadow: "0 0 14px #06B6D4"}} />; }) : null}
        {f >= en + 36 ? <div><SpillBox r1={2} c1={14} r2={6} c2={16} widths={W} color="#06B6D4" k={eo(prog(f, en + 36, 10))} />{f < en + 130 ? <Glow x={rangeRect(1, 14, 6, 16, W).x} y={rangeRect(1, 14, 6, 16, W).y} w={rangeRect(1, 14, 6, 16, W).w - 1} h={rangeRect(1, 14, 6, 16, W).h - 1} color="#06B6D4" k={win(f, en + 36, en + 130)} fill={0.1} /> : null}</div> : null}
        {f >= a(5) ? <Chip x={330} y={330} w={420} color={C.emerald} k={eo(prog(f, a(5), 14))} size={15}>Source table untouched ✓ · 3 of 12 columns</Chip> : null}
        <Cursor keys={[{f: ts - 20, x: 700, y: 420}, {f: ts, x: N2.x + 20, y: N2.y + 6, click: true}, {f: en + 60, x: 900, y: 470}]} />
      </ExcelApp>
    </Stage>
  );
};
