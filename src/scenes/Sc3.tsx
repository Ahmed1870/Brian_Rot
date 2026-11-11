import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, Tag, cellRect, eo, prog, rangeRect} from "../kit";
import {C} from "../theme";
import {SALES, W, block, res, uniq} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(2, k);
const T = (br: string): Tok[] => [{t: "=TEXTJOIN(", c: FC.a}, {t: '", "'}, {t: ","}, {t: "TRUE", c: FC.p}, {t: ","}, {t: "UNIQUE(", c: FC.b}, {t: "FILTER(", c: FC.c}, {t: "tbl_Sales[Product]", c: FC.g}, {t: ","}, {t: "tbl_Sales[Branch]="}, {t: `"${br}"`, c: FC.a}, {t: ")))", c: FC.b}];

export const Sc3 = () => {
  const f = useCurrentFrame();
  const ts = a(1) + 6, en = a(2) - 8, chg = a(5) - 10, en2 = a(5) + 56;
  const n = nTyped(f, ts + 8, en - 14, tlen(T("Cairo")));
  const ed = f >= ts - 6 && f < en, ed2 = f >= chg && f < en2;
  const br = f >= en2 ? "Alex" : "Cairo";
  const items = uniq(br);
  const kk = f >= en2 ? Math.min(items.length, Math.floor((f - en2 - 4) / 8) + 1) : f >= a(3) ? Math.min(items.length, Math.floor((f - a(3)) / 14) + 1) : 0;
  const txt = items.slice(0, kk).join(", ");
  const hlRows = f >= en ? SALES.map((r, i) => (r[1] === br ? i + 2 : 0)).filter(Boolean) : [];
  const dup = f >= a(2) + 20 && f < en2 ? SALES.map((r, i) => (r[1] === "Cairo" && SALES.findIndex((x) => x[0] === r[0] && x[1] === "Cairo") !== i ? i + 2 : 0)).filter(Boolean) : [];
  const cells = [...block(1, 7, [["Product", "Branch", "Amount"], ...SALES], {hdr: true}).map((c) => (hlRows.includes(c.r) ? {...c, bg: dup.includes(c.r) ? "#FBE0E0" : "#FFF1C9"} : c)), {r: 1, c: 4, t: "Summary", bold: true, color: "#fff", bg: C.green},
    ...(kk > 0 ? [res(2, 4, txt, "#92400E", "#FFF1C9")] : ed ? [{r: 2, c: 4, t: <span style={{color: "#555"}}>=TEXTJOIN(", "…</span>}] : [])];
  const D2 = cellRect(4, 2, W);
  const tk = ed2 ? T(f >= chg + 30 ? "Alex" : "Cairo") : T(br);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(4)}><Tag label="Filtered Text Summary" color={C.amber} parts={[{t: '=TEXTJOIN(", ", TRUE, UNIQUE(FILTER(...)))', c: C.amber}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Single-Cell Executive Summary" color={C.purple} parts={[{t: "Merges Filtered Array Results into 1 Clean Cell"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Text"]} name="D2" editing={ed || ed2} fx={ed || f >= en ? <Fx toks={tk} n={f >= en ? 999 : n} /> : ""}
        sheet={{cells, widths: W, active: {r: 2, c: 4}, sel: {r1: 2, c1: 4, r2: 2, c2: 4}}}>
        {f < ts - 6 ? <Chip x={60} y={330} w={500} color={C.blue} k={win(f, a(0) + 20, ts - 6)} size={15}>tbl_Sales · products repeat inside each branch</Chip> : null}
        {ed && n <= 6 ? <AutoComp x={D2.x} y={D2.y + 20} typed={"=TEXTJOIN".slice(0, n)} /> : null}
        {ed && n > 10 ? <ArgTip x={D2.x - 30} y={D2.y + 22} sig={["TEXTJOIN(", "delimiter,", "ignore_empty,", "text1,", "[text2],", "…)"]} cur={Math.min(2, (T("Cairo").map((x) => x.t).join("").slice(0, n).match(/,/g) ?? []).length)} /> : null}
        <Enter x={D2.x + 50} y={D2.y - 4} k={win(f, en - 4, en + 14, 4) + win(f, en2 - 4, en2 + 14, 4)} />
        {f >= en && f < a(5) ? (() => { const q = rangeRect(2, 7, 13, 9, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={C.amber} k={win(f, en, a(5), 14)} fill={0.04} />; })() : null}
        {dup.map((r) => <div key={r} style={{position: "absolute", left: rangeRect(r, 10, r, 10, W).x - 2, top: rangeRect(r, 10, r, 10, W).y, color: C.red, fontWeight: 700, fontSize: 13, lineHeight: "19px"}}>duplicate ✗</div>)}
        {kk > 0 && f < a(5) ? <Glow x={D2.x} y={D2.y} w={300} h={19} color={C.amber} k={win(f, a(3), a(5))} fill={0.08} /> : null}
        {f >= a(3) && f < a(4) ? <Chip x={60} y={330} w={560} color={C.amber} k={win(f, a(3), a(4))} size={15}>FILTER → UNIQUE → TEXTJOIN · one cell</Chip> : null}
        {f >= a(4) && f < chg ? <Chip x={60} y={330} w={560} color={C.purple} k={win(f, a(4), chg)} size={15}>No PivotTable needed for a text summary</Chip> : null}
        {f >= en2 ? <Chip x={60} y={330} w={560} color={C.amber} k={win(f, en2, 9999, 14)} size={15}>{'Branch "Cairo" → "Alex" · summary updates live ✓'}</Chip> : null}
        <Cursor keys={[{f: ts - 36, x: 640, y: 440}, {f: ts - 20, x: D2.x + 30, y: D2.y + 8, click: true}, {f: chg - 4, x: D2.x + 30, y: D2.y + 8, click: true}, {f: en2 + 60, x: 900, y: 520}]} />
      </ExcelApp>
    </Stage>
  );
};
void eo; void prog;
