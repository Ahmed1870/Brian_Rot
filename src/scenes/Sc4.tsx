import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Tag, cellRect, eo, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {W, block} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(3, k);
const T: Tok[] = [{t: "=XMATCH(", c: FC.b}, {t: "Target_ID", c: FC.g}, {t: ","}, {t: "tbl_Sales[Sorted_ID]", c: FC.a}, {t: ",0,2", c: FC.c}, {t: ")", c: FC.b}];
const IDS = ["1005", "1012", "1030", "1047", "1062", "1081", "1099"];

export const Sc4 = () => {
  const f = useCurrentFrame();
  const ts = a(2), en = a(4) + 78;
  const n = nTyped(f, ts, a(4) + 50, tlen(T));
  const ed = f >= ts - 8 && f < en;
  const lin = f >= a(3) ? Math.min(6, Math.floor((f - a(3)) / 14) + 1) : 0;
  const b1 = f >= a(4), b2 = f >= a(4) + 40;
  const cells = [...block(1, 7, [["Sorted_ID"], ...IDS.map((i) => [i])], {hdr: true}), {r: 1, c: 1, t: "Target_ID", bold: true, color: "#fff", bg: C.green}, {r: 1, c: 2, t: "Position", bold: true, color: "#fff", bg: C.green}, {r: 2, c: 1, t: "1081", a: "r" as const, bg: "#FFF8E0"},
    ...(f >= en ? [{r: 2, c: 2, t: "6", a: "r" as const, bold: true, color: "#0B6FA8"}] : ed ? [{r: 2, c: 2, t: <span style={{color: "#555"}}>=XMATCH(Targ…</span>}] : [])];
  const B2 = cellRect(2, 2, W);
  const box = (x: number, y: number, i: number, st: "off" | "dim" | "cur" | "hit" | "vis") => (
    <div key={i} style={{position: "absolute", left: x + i * 58, top: y, width: 52, height: 34, borderRadius: 6, boxSizing: "border-box", fontFamily: F.mono, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
      color: st === "dim" ? "#475569" : "#fff", background: st === "hit" ? rgba(C.blue, 0.35) : st === "cur" ? rgba(C.blue, 0.2) : st === "vis" ? rgba(C.amber, 0.3) : "#111C33", border: `2px solid ${st === "hit" ? C.blue : st === "cur" ? C.blue : st === "vis" ? C.amber : "#334155"}`, boxShadow: st === "hit" ? `0 0 14px ${C.blue}` : "none", opacity: st === "dim" ? 0.35 : 1}}>{IDS[i]}</div>
  );
  const bst = (i: number) => (!b1 ? "off" : !b2 ? (i === 3 ? "cur" : "off") : i < 4 ? "dim" : i === 5 ? "hit" : "off");
  const panel = f >= a(3) - 10 ? eo(prog(f, a(3) - 10, 14)) : 0;
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(5)}><Tag label="Binary Search Speed" color={C.blue} parts={[{t: "=XMATCH(value, array, 0, 2)", c: C.blue}, {t: " (Binary Search Ascending)"}]} /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="High-Performance Indexing" color={C.emerald} parts={[{t: "Divides Sorted Data Halves for Sub-Millisecond Retrieval"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name="B2" editing={ed} fx={f >= ts - 8 ? <Fx toks={T} n={f >= en ? 999 : n} /> : "1081"}
        sheet={{cells, widths: W, active: {r: 2, c: 2}, sel: {r1: 2, c1: 2, r2: 2, c2: 2}}}>
        {f < ts - 8 ? <Chip x={60} y={330} w={460} color={C.blue} k={win(f, a(0) + 20, ts - 8)} size={15}>Target_ID = 1081 · Sorted_ID is sorted ascending</Chip> : null}
        {ed && n <= 4 ? <AutoComp x={B2.x} y={B2.y + 20} typed={"=XMATCH".slice(0, n)} /> : null}
        {ed && n > 7 ? <ArgTip x={B2.x - 40} y={B2.y + 22} sig={["XMATCH(", "lookup_value,", "lookup_array,", "[match_mode],", "[search_mode])"]} cur={Math.min(3, (T.map((k) => k.t).join("").slice(0, n).match(/,/g) ?? []).length + (n > 30 ? 0 : 0))} /> : null}
        <Enter x={B2.x + 50} y={B2.y - 4} k={win(f, en - 4, en + 14, 4)} />
        {panel > 0 ? (
          <div style={{position: "absolute", left: 640, top: 232, width: 600, height: 300, opacity: panel, background: C.slate, border: `2px solid ${rgba(C.blue, 0.7)}`, borderRadius: 14, boxShadow: `0 0 20px ${rgba(C.blue, 0.3)}`, boxSizing: "border-box", fontFamily: F.ui, color: "#fff"}}>
            <div style={{position: "absolute", left: 20, top: 12, fontWeight: 700, fontSize: 16, color: C.amber}}>Linear search · row by row</div>
            {IDS.map((_, i) => box(20, 44, i, i < lin ? (lin >= 6 && i === 5 ? "vis" : "vis") : "off"))}
            <div style={{position: "absolute", left: 440, top: 50, fontWeight: 700, fontSize: 20, color: C.amber}}>{lin} steps</div>
            <div style={{position: "absolute", left: 20, top: 120, fontWeight: 700, fontSize: 16, color: C.blue}}>Binary search · split in halves</div>
            {IDS.map((_, i) => box(20, 152, i, bst(i) as "off"))}
            <div style={{position: "absolute", left: 440, top: 158, fontWeight: 700, fontSize: 20, color: C.blue}}>{b2 ? "2 steps ✓" : b1 ? "1 step" : "–"}</div>
            <div style={{position: "absolute", left: 20, top: 200, width: 560, fontSize: 14, color: "#CBD5E1", opacity: b1 ? 1 : 0}}>Step 1: middle = 1047 &lt; 1081 → keep the right half</div>
            <div style={{position: "absolute", left: 20, top: 224, width: 560, fontSize: 14, color: "#CBD5E1", opacity: b2 ? 1 : 0}}>Step 2: middle of 1062…1099 = 1081 ✓ found at position 6</div>
          </div>
        ) : null}
        {f >= a(5) ? <Chip x={640} y={548 - 10} w={600} h={30} color={C.emerald} k={eo(prog(f, a(5), 14))} size={14}>50,000 rows → at most 16 steps (log₂ 50,000 ≈ 15.6)</Chip> : null}
        <Cursor keys={[{f: ts - 40, x: 640, y: 440}, {f: ts - 22, x: B2.x + 30, y: B2.y + 8, click: true}, {f: en + 60, x: 900, y: 580}]} />
      </ExcelApp>
    </Stage>
  );
};
