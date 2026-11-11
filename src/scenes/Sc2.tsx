import {useCurrentFrame} from "remotion";
import {ArgTip, Cap, Cursor, ExcelApp, Glow, Tag, cellRect, eo, prog} from "../kit";
import {C} from "../theme";
import {BLANKS, W, block, res} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(1, k);
const TJ = (v: string): Tok[] => [{t: "=TEXTJOIN(", c: FC.b}, {t: '", "', c: FC.a}, {t: ","}, {t: v, c: v === "TRUE" ? "#0B8A4B" : "#B91C1C"}, {t: ","}, {t: "A2:A10", c: FC.g}, {t: ")", c: FC.b}];
const CC: Tok[] = [{t: "=CONCAT(", c: FC.p}, {t: "A2:A10", c: FC.g}, {t: ")", c: FC.p}];
const bad = () => BLANKS.map((e, i) => <span key={i}>{e}<span style={e === "" && i < 8 ? {color: "#D97706", background: "#FFF1C9", fontWeight: 700} : undefined}>{i < 8 ? ", " : ""}</span></span>);

export const Sc2 = () => {
  const f = useCurrentFrame();
  const s1 = a(0) + 24, e1 = a(0) + 190, s2 = a(1), e2 = a(1) + 62, s3 = a(4), e3 = a(4) + 96;
  const n1 = nTyped(f, s1, e1 - 12, tlen(TJ("FALSE")));
  const sw = f >= s2 + 20 ? (f >= s2 + 34 ? "TRUE" : "") : "FALSE";
  const toks2 = f >= s2 ? TJ(f >= s2 + 34 ? "TRUE" : f >= s2 + 20 ? "" : "FALSE") : TJ("FALSE");
  const n3 = nTyped(f, s3 + 8, e3 - 12, tlen(CC));
  const phase = f < e1 ? 1 : f < e2 ? 2 : 3;
  const ed1 = f >= s1 - 6 && f < e1, ed2 = f >= s2 && f < e2, ed3 = f >= s3 - 6 && f < e3;
  const clean = f >= e2;
  const cells = [...block(1, 1, [["Items"]], {hdr: true}), ...block(2, 1, BLANKS.map((i) => [i])), {r: 1, c: 3, t: "TEXTJOIN", bold: true, color: "#fff", bg: C.green}, {r: 1, c: 7, t: "CONCAT", bold: true, color: "#fff", bg: C.green},
    ...(clean ? [res(2, 3, "Laptop, Phone, Tablet, Mouse, Cable", "#0B8A4B", "#E8F7F0")] : f >= e1 ? [res(2, 3, <span>{bad()}</span>, "#262626", "#FFF8E0")] : ed1 ? [{r: 2, c: 3, t: <span style={{color: "#555"}}>=TEXTJOIN(", "…</span>}] : []),
    ...(f >= e3 ? [res(2, 7, "LaptopPhoneTabletMouseCable", "#7E22CE", "#F5EBFD")] : ed3 ? [{r: 2, c: 7, t: <span style={{color: "#555"}}>=CONCAT(A2:…</span>}] : [])];
  const C2 = cellRect(3, 2, W), E2 = cellRect(7, 2, W);
  const act = f >= s3 - 14 ? {r: 2, c: 7} : {r: 2, c: 3};
  void sw; void phase;
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(3)}><Tag label="Trailing Delimiter Elimination" color={C.emerald} parts={[{t: "ignore_empty = TRUE", c: C.emerald}, {t: " Prevents Extra Blank Separators"}]} /></Cap>,
      <Cap key="1" f={f} a={a(3)} b={9999}><Tag label="Full Range CONCAT" color={C.purple} parts={[{t: "=CONCAT(A2:A10)", c: C.purple}, {t: " Merges Whole Ranges Without &"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Text"]} name={`${String.fromCharCode(64 + act.c)}2`} editing={ed1 || ed2 || ed3} fx={ed3 || f >= e3 ? <Fx toks={CC} n={f >= e3 ? 999 : n3} /> : f >= s2 ? <Fx toks={toks2} n={999} /> : f >= s1 - 6 ? <Fx toks={TJ("FALSE")} n={f >= e1 ? 999 : n1} /> : ""}
        sheet={{cells, widths: W, active: act, sel: {r1: 2, c1: act.c, r2: 2, c2: act.c}}}>
        {f < s1 - 6 ? <Chip x={330} y={230} w={440} color={C.blue} k={win(f, a(0) - 20 > 0 ? a(0) - 20 : 0, s1 - 6)} size={15}>A2:A10 has empty cells between the items</Chip> : null}
        {ed1 && n1 > 10 ? <ArgTip x={C2.x - 30} y={C2.y + 22} sig={["TEXTJOIN(", "delimiter,", "ignore_empty,", "text1,", "[text2],", "…)"]} cur={Math.min(2, (TJ("FALSE").map((x) => x.t).join("").slice(0, n1).match(/,/g) ?? []).length)} /> : null}
        <Enter x={C2.x + 50} y={C2.y - 4} k={win(f, e1 - 4, e1 + 14, 4) + win(f, e2 - 4, e2 + 14, 4)} /><Enter x={E2.x + 50} y={E2.y - 4} k={win(f, e3 - 4, e3 + 14, 4)} />
        {f >= e1 && f < s2 ? <Chip x={60} y={430} w={560} h={34} color={C.amber} k={win(f, e1 + 6, s2)} size={15}>{'ignore_empty = FALSE → stray ", ," separators ✗'}</Chip> : null}
        {ed2 ? <Glow x={344} y={155} w={46} h={20} color={C.emerald} k={win(f, s2, e2)} fill={0.1} /> : null}
        {clean ? <Glow x={C2.x} y={C2.y} w={330} h={19} color={C.emerald} k={f < e2 + 90 ? win(f, e2, e2 + 90) : 0.8} fill={0.08} /> : null}
        {clean && f < a(3) ? <Chip x={60} y={430} w={560} h={34} color={C.emerald} k={win(f, e2 + 8, a(3))} size={15}>ignore_empty = TRUE → blanks skipped · clean text ✓</Chip> : null}
        {f >= e3 ? <Glow x={E2.x} y={E2.y} w={230} h={19} color={C.purple} k={f < e3 + 90 ? win(f, e3, e3 + 90) : 0.8} fill={0.08} /> : null}
        {f >= a(5) ? <Chip x={60} y={430} w={600} h={34} color={C.emerald} k={eo(prog(f, a(5), 14))} size={15}>CONCAT merges the range · no & · no delimiter option</Chip> : null}
        <Cursor keys={[{f: s1 - 40, x: 640, y: 440}, {f: s1 - 22, x: C2.x + 30, y: C2.y + 8, click: true}, {f: s2 - 6, x: C2.x + 30, y: C2.y + 8, click: true}, {f: s3 - 14, x: E2.x + 30, y: E2.y + 8, click: true}, {f: e3 + 120, x: 900, y: 520}]} />
      </ExcelApp>
    </Stage>
  );
};
