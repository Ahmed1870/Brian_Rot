import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, SpillBox, Tag, cellRect, eo, prog, rangeRect, rgba} from "../kit";
import {C, F} from "../theme";
import {block} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(3, k);
const W = [60, 44, 50, 50, 60, 16, 60, 44, 50, 50, 60, 16, 76, 60, 76, 56, 56, 56, 56];
const H5 = ["Product", "Units", "Price", "Cost", "Revenue"];
const CA: [string, number, number, number][] = [["Laptop", 12, 4500, 36000], ["Phone", 30, 1400, 30000], ["Tablet", 8, 2000, 11000], ["Mouse", 40, 200, 5600], ["Cable", 90, 150, 9000], ["Monitor", 10, 3200, 22000]];
const AL: [string, number, number, number][] = [["Laptop", 9, 4500, 28000], ["Phone", 21, 1400, 20000], ["Tablet", 6, 2000, 8400], ["Mouse", 55, 200, 8000], ["Cable", 120, 150, 12000], ["Monitor", 7, 3200, 15500]];
const full = (r: [string, number, number, number]) => [r[0], r[1], r[2], r[3], r[1] * r[2]];
const STACK = [...CA, ...AL].map(full);
const OUT = STACK.map((r) => [r[0], r[2], r[4]]).sort((x, y) => (y[2] as number) - (x[2] as number)).slice(0, 10);
const T: Tok[] = [{t: "=TAKE(", c: FC.g}, {t: "SORT(", c: FC.a}, {t: "CHOOSECOLS(", c: FC.c}, {t: "VSTACK(", c: FC.b}, {t: "tbl_Cairo,tbl_Alex"}, {t: ")", c: FC.b}, {t: ",1,3,5)", c: FC.c}, {t: ",3,-1)", c: FC.a}, {t: ",10)", c: FC.g}];
const STG: [string, string, string, string][] = [["VSTACK", "12 × 5", "Cairo + Alex", C.blue], ["CHOOSECOLS", "12 × 3", "cols 1, 3, 5", "#06B6D4"], ["SORT", "12 × 3", "Revenue ↓", C.amber], ["TAKE", "10 × 3", "Top 10", C.emerald]];

export const Sc4 = () => {
  const f = useCurrentFrame();
  const ts = a(0) + 20, en = a(5);
  const n = nTyped(f, ts + 10, a(4) + 90, tlen(T));
  const ed = f >= ts && f < en;
  const rowsShown = f >= en + 24 ? Math.min(10, Math.floor((f - en - 24) / 3) + 1) : 0;
  const cells = [...block(1, 1, [H5, ...CA.map(full)], {hdr: true}), ...block(1, 7, [H5, ...AL.map(full)], {hdr: true}),
    ...(rowsShown ? block(2, 13, OUT.slice(0, rowsShown), {color: C.green, bg: "#E8F7F0"}) : ed ? [{r: 2, c: 13, t: <span style={{color: "#555"}}>=TAKE(SORT(CHOO…</span>}] : [])];
  const M2 = cellRect(13, 2, W);
  const tint = (c1: number, col: string) => { const q = rangeRect(1, c1, 7, c1 + 4, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={col} k={0.9} fill={0.05} />; };
  const pk = prog(f, en + 6, 56);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={en}><Tag label="Master Pipeline" color={C.emerald} parts={[{t: "TAKE(SORT(CHOOSECOLS(VSTACK(Data1, Data2), cols), index, order), 10)"}]} /></Cap>,
      <Cap key="1" f={f} a={en} b={9999}><Tag label="All-in-One Execution" color={C.emerald} parts={[{t: "Combine, Slice, Sort & Take in a Single Dynamic Formula"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Pipeline"]} name="M2" editing={ed} fx={f >= ts ? <Fx toks={T} n={f >= en ? 999 : n} /> : ""}
        sheet={{cells, widths: W, active: {r: 2, c: 13}, sel: {r1: 2, c1: 13, r2: 2, c2: 13}}}>
        {ed ? <div>{tint(1, FC.b)}{tint(7, FC.c)}</div> : null}
        {ed && n <= 5 ? <AutoComp x={M2.x} y={M2.y + 20} typed={"=TAKE".slice(0, n)} /> : null}
        {ed && n > 6 && n < 40 ? <ArgTip x={M2.x - 120} y={M2.y + 22} sig={n > 20 ? ["VSTACK(", "array1,", "[array2],", "…)"] : ["TAKE(", "array,", "rows,", "[columns])"]} cur={0} /> : null}
        <Enter x={M2.x - 70} y={M2.y - 4} k={win(f, en - 4, en + 14, 4)} />
        {[0, 1, 2, 3].map((i) => {
          const lit = eo(prog(f, a(i + 1), 14)), s = STG[i];
          return (
            <div key={i}>
              <div style={{position: "absolute", left: 30 + i * 296, top: 480, width: 270, height: 74, opacity: 0.35 + 0.65 * lit, background: C.slate, border: `2.5px solid ${s[3]}`, borderRadius: 12, boxShadow: `0 0 ${16 * lit}px ${rgba(s[3], 0.7)}`, boxSizing: "border-box", padding: "8px 14px", fontFamily: F.ui, color: "#fff"}}>
                <div style={{fontSize: 20, fontWeight: 700, color: s[3]}}>{i + 1}. {s[0]}</div>
                <div style={{fontSize: 15, marginTop: 4}}>{s[1]} · {s[2]}</div>
              </div>
              {i < 3 ? <div style={{position: "absolute", left: 302 + i * 296, top: 508, width: 24, color: s[3], fontSize: 26, fontWeight: 700, opacity: 0.35 + 0.65 * lit}}>→</div> : null}
            </div>
          );
        })}
        {pk > 0 && pk < 1 ? <div style={{position: "absolute", left: 30 + 1146 * eo(pk), top: 510, width: 20, height: 20, borderRadius: 10, background: C.emerald, boxShadow: `0 0 16px ${C.emerald}`}} /> : null}
        {rowsShown > 0 ? <div><SpillBox r1={2} c1={13} r2={11} c2={15} widths={W} k={eo(prog(f, en + 24, 8))} />{f < en + 150 ? (() => { const q = rangeRect(2, 13, 11, 15, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={C.emerald} k={win(f, en + 24, en + 150)} fill={0.08} />; })() : null}</div> : null}
        {f >= a(5) + 70 ? <Chip x={M2.x - 30} y={444} w={300} color={C.emerald} k={eo(prog(f, a(5) + 70, 14))} size={14}>One cell · 10 rows × 3 cols ✓</Chip> : null}
        <Cursor keys={[{f: ts - 20, x: 640, y: 420}, {f: ts, x: M2.x + 20, y: M2.y + 6, click: true}, {f: en + 50, x: 900, y: 470}]} />
      </ExcelApp>
    </Stage>
  );
};
