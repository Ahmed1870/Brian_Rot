import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, SpillBox, Tag, cellRect, eo, prog, rangeRect} from "../kit";
import {C} from "../theme";
import {TB, W, block, int, tblCells} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(2, k);
const T: Tok[] = [{t: "=INDEX(", c: FC.g}, {t: "tbl_Sales", c: FC.a}, {t: ","}, {t: "XMATCH(", c: FC.b}, {t: "A2#", c: FC.p}, {t: ","}, {t: "tbl_Sales[Product ID]", c: FC.a}, {t: ")", c: FC.b}, {t: ","}, {t: "XMATCH(", c: FC.b}, {t: '"Sales Amount"', c: FC.a}, {t: ","}, {t: "tbl_Sales[#Headers]", c: FC.a}, {t: ")", c: FC.b}, {t: ")", c: FC.g}];
const L1 = T.slice(0, 9).reduce((s, k) => s + k.t.length, 0);
const IDS = ["P-101", "P-102", "P-103", "P-104", "P-105"];
const ROW = IDS.map((id) => TB.findIndex((r) => r[0] === id) + 1);
const VAL = ROW.map((r) => TB[r - 1][3] as number);

export const Sc3 = () => {
  const f = useCurrentFrame();
  const s1 = a(1) + 20, e1 = a(2) + 110, s2 = a(3), en = a(4);
  const n = nTyped(f, s1, e1, L1) + (f >= s2 ? nTyped(f, s2, en - 20, tlen(T) - L1) : 0);
  const ed = f >= s1 - 8 && f < en;
  const cross = prog(f, en + 4, 50), shift = f >= en + 170;
  const spilled = f >= en + 44;
  const order = shift ? [3, 0, 1, 2, 4, 5] : [0, 1, 2, 3, 4, 5];
  const sc = shift ? 7 : 10; // table column index of "Sales Amount"
  const k = Math.floor(cross * 5.99);
  const hl: Record<number, string> = {};
  if (cross > 0 && f < en + 120) for (let i = 0; i <= k; i++) hl[ROW[i]] = "#EAD7FB";
  const cells = [...tblCells({order, hl}), ...block(1, 1, [["Product ID"]], {hdr: true}), ...block(2, 1, IDS.map((i) => [i]), {bg: "#F5EBFD"}), {r: 1, c: 5, t: "Sales Amount", bold: true, color: "#fff", bg: C.green},
    ...(spilled ? VAL.map((v, i) => ({r: i + 2, c: 5, t: int(v), a: "r" as const, bold: true, color: "#0B8A4B", bg: "#E8F7F0"})) : ed ? [{r: 2, c: 5, t: <span style={{color: "#555"}}>=INDEX(tbl_Sal…</span>}] : [])];
  const Ws = shift ? W.map((w, i) => (i === 6 ? 112 : i === 7 ? 80 : i === 8 ? 96 : i === 9 ? 124 : w)) : W;
  const E2 = cellRect(5, 2, Ws), col = rangeRect(2, sc, 13, sc, Ws);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(4)}><Tag label="2D Dynamic Matrix Lookup" color={C.emerald} parts={[{t: "=INDEX(Table, XMATCH(Spill#), XMATCH(Header))", c: C.emerald}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Dynamic Column & Row Indexing" color={C.purple} parts={[{t: "Robust Matrix Retrieval Immune to Column Shifts"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name={ed || spilled ? "E2" : "A2"} editing={ed} fx={ed || spilled ? <Fx toks={T} n={f >= en ? 999 : n} /> : "=UNIQUE(tbl_Sales[Product ID])"}
        sheet={{cells, widths: Ws, active: ed || spilled ? {r: 2, c: 5} : {r: 2, c: 1}, sel: ed || spilled ? {r1: 2, c1: 5, r2: 2, c2: 5} : {r1: 2, c1: 1, r2: 2, c2: 1}}}>
        <SpillBox r1={2} c1={1} r2={6} c2={1} widths={W} color="#1F6FEB" />
        {f < s1 - 8 ? <Chip x={60} y={330} w={440} color={C.purple} k={win(f, a(0) + 20, s1 - 8)} size={15}>A2# = the whole spilled list of Product IDs</Chip> : null}
        {ed && n <= 6 ? <AutoComp x={E2.x} y={E2.y + 20} typed={"=INDEX".slice(0, n)} /> : null}
        {ed && n > 7 && n < L1 ? <ArgTip x={E2.x - 30} y={E2.y + 22} sig={["INDEX(", "array,", "row_num,", "[column_num],", "[area_num])"]} cur={n > L1 - 2 ? 2 : 1} /> : null}
        {ed && n >= L1 ? <ArgTip x={E2.x - 30} y={E2.y + 22} sig={["INDEX(", "array,", "row_num,", "[column_num],", "[area_num])"]} cur={2} /> : null}
        <Enter x={E2.x + 50} y={E2.y - 4} k={win(f, en - 4, en + 14, 4)} />
        {f >= a(2) + 40 && f < en ? <Glow x={rangeRect(2, 1, 6, 1, W).x} y={rangeRect(2, 1, 6, 1, W).y} w={rangeRect(2, 1, 6, 1, W).w - 1} h={rangeRect(2, 1, 6, 1, W).h - 1} color={C.purple} k={win(f, a(2) + 40, en)} fill={0.08} /> : null}
        {f >= a(3) + 20 && f < en + 120 ? <Glow x={col.x} y={col.y} w={col.w - 1} h={col.h - 1} color={C.blue} k={win(f, a(3) + 20, en + 120)} fill={0.07} /> : null}
        {spilled ? <div><SpillBox r1={2} c1={5} r2={6} c2={5} widths={W} k={eo(prog(f, en + 44, 8))} />{f < en + 150 ? <Glow x={E2.x} y={E2.y} w={E2.w - 1} h={rangeRect(2, 5, 6, 5, W).h - 1} color={C.emerald} k={win(f, en + 44, en + 150)} fill={0.08} /> : null}</div> : null}
        {shift ? <Glow x={rangeRect(1, 7, 13, 7, W).x} y={rangeRect(1, 7, 13, 7, W).y} w={rangeRect(1, 7, 13, 7, W).w - 1} h={rangeRect(1, 7, 13, 7, W).h - 1} color={C.blue} k={win(f, en + 170, en + 260)} fill={0.07} /> : null}
        {shift && f < a(4) + 330 ? <Chip x={60} y={330} w={520} color={C.emerald} k={win(f, en + 176, a(4) + 330)} size={15}>Columns moved (index 4 → 1) · results unchanged ✓</Chip> : null}
        {spilled && !shift ? <Chip x={60} y={330} w={420} color={C.emerald} k={win(f, en + 50, en + 170)} size={15}>5 IDs → 5 amounts · one formula</Chip> : null}
        <Cursor keys={[{f: s1 - 40, x: 640, y: 440}, {f: s1 - 22, x: E2.x + 30, y: E2.y + 8, click: true}, {f: en + 260, x: 900, y: 480}]} />
      </ExcelApp>
    </Stage>
  );
};
