import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, Tag, TopBadge, cellRect, eo, prog, rangeRect} from "../kit";
import {C} from "../theme";
import {W, tblCells} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(0, k);
const X: Tok[] = [{t: "=XMATCH(", c: FC.b}, {t: "A2", c: FC.g}, {t: ","}, {t: "tbl_Sales[Product ID]", c: FC.a}, {t: ")", c: FC.b}];
const M: Tok[] = [{t: "=MATCH(", c: FC.a}, {t: "A2", c: FC.g}, {t: ","}, {t: "tbl_Sales[Product ID]", c: FC.b}, {t: ",0", c: "#B91C1C"}, {t: ")", c: FC.a}];

export const Sc1 = () => {
  const f = useCurrentFrame();
  const xs = a(5), xe = a(6) - 20, ms = a(6) + 10, me = a(7) - 8;
  const nX = nTyped(f, xs, xe - 10, tlen(X)), nM = nTyped(f, ms, me - 10, tlen(M));
  const edX = f >= xs - 6 && f < xe, edM = f >= ms - 6 && f < me;
  const sweep = prog(f, xe + 4, 30);
  const row = f < xe + 4 ? 0 : Math.min(3, Math.floor(sweep * 3.2) + 1);
  const lock = f >= xe + 4 + 28;
  const hl: Record<number, string> = lock ? {3: "#CFEAFB"} : row ? {[row]: "#E4F3FD"} : {};
  const cells = [...tblCells({hl}), {r: 1, c: 1, t: "Product ID", bold: true, color: "#fff", bg: C.green}, {r: 1, c: 2, t: "XMATCH", bold: true, color: "#fff", bg: C.green}, {r: 1, c: 3, t: "MATCH", bold: true, color: "#fff", bg: C.green},
    {r: 2, c: 1, t: "P-103", bg: "#FFF8E0"}, ...(f >= xe ? [{r: 2, c: 2, t: "3", a: "r" as const, bold: true, color: "#0B6FA8"}] : edX ? [{r: 2, c: 2, t: <span style={{color: "#555"}}>=XMATCH(A2,t…</span>}] : []),
    ...(f >= me ? [{r: 2, c: 3, t: "3", a: "r" as const, bold: true}] : edM ? [{r: 2, c: 3, t: <span style={{color: "#555"}}>=MATCH(A2,tb…</span>}] : [])];
  const B2 = cellRect(2, 2, W), C2 = cellRect(3, 2, W), A2c = cellRect(1, 2, W);
  const act = f >= ms - 14 ? {r: 2, c: 3} : f >= xs - 24 ? {r: 2, c: 2} : {r: 2, c: 1};
  const idp = rangeRect(2, 7, 13, 7, W);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(5)}><TopBadge ar="الدرس 38 من 76 | الوحدة 8 من 14" en="XMATCH & Dynamic Search Engine" /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="Default Exact Match" color={C.blue} parts={[{t: "=XMATCH(lookup_value, lookup_array)", c: C.blue}, {t: " (Zero Extra Arguments)"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name={`${String.fromCharCode(64 + act.c)}${act.r}`} editing={edX || edM} fx={edM ? <Fx toks={M} n={nM} /> : f >= xs - 6 && f < me ? <Fx toks={X} n={f >= xe ? 999 : nX} /> : f >= me ? <Fx toks={M} n={999} /> : "P-103"}
        sheet={{cells, widths: W, active: act, sel: {r1: act.r, c1: act.c, r2: act.r, c2: act.c}}}>
        {f < xs - 24 ? <Chip x={60} y={300} w={420} color={C.blue} k={win(f, a(0) + 20, xs - 24)} size={15}>tbl_Sales · 12 of 50,000 rows shown</Chip> : null}
        {f >= a(1) && f < xs ? <Glow x={A2c.x} y={A2c.y} w={A2c.w - 1} h={A2c.h - 1} color={C.amber} k={win(f, a(1), xs)} /> : null}
        {edX && nX <= 4 ? <AutoComp x={B2.x} y={B2.y + 20} typed={"=XMATCH".slice(0, nX)} /> : null}
        {edX && nX > 7 ? <ArgTip x={B2.x - 40} y={B2.y + 22} sig={["XMATCH(", "lookup_value,", "lookup_array,", "[match_mode],", "[search_mode])"]} cur={Math.min(2, (X.map((k) => k.t).join("").slice(0, nX).match(/,/g) ?? []).length + 1) - 1} /> : null}
        {edM && nM <= 3 ? <AutoComp x={C2.x} y={C2.y + 20} typed={"=MATCH".slice(0, nM)} /> : null}
        {edM && nM > 6 ? <ArgTip x={C2.x - 60} y={C2.y + 22} sig={["MATCH(", "lookup_value,", "lookup_array,", "[match_type])"]} cur={Math.min(2, (M.map((k) => k.t).join("").slice(0, nM).match(/,/g) ?? []).length)} /> : null}
        <Enter x={B2.x + 50} y={B2.y - 4} k={win(f, xe - 4, xe + 14, 4)} /><Enter x={C2.x + 50} y={C2.y - 4} k={win(f, me - 4, me + 14, 4)} />
        {row > 0 && !lock ? <Glow x={idp.x} y={rangeRect(row + 1, 7, row + 1, 12, W).y} w={rangeRect(2, 7, 2, 12, W).w - 1} h={19} color={C.blue} k={0.9} fill={0.12} /> : null}
        {lock ? <Glow x={idp.x} y={rangeRect(4, 7, 4, 12, W).y} w={rangeRect(2, 7, 2, 12, W).w - 1} h={19} color={C.blue} k={f < xe + 100 ? win(f, xe + 32, xe + 100) : 0.85} fill={0.12} /> : null}
        {lock && f < a(6) + 20 ? <Chip x={B2.x + 60} y={B2.y + 36} w={260} color={C.blue} k={win(f, xe + 32, a(6) + 20)} size={14}>Position 3 → row of P-103 ✓</Chip> : null}
        {f >= ms + 20 && f < a(7) ? <Chip x={60} y={300} w={460} color={C.red} k={win(f, ms + 20, a(7))} size={15}>Legacy MATCH → the 0 must be typed by hand ✗</Chip> : null}
        {f >= a(7) ? <Chip x={60} y={300} w={500} color={C.blue} k={eo(prog(f, a(7), 14))} size={15}>XMATCH → exact match is the DEFAULT, no 0 needed ✓</Chip> : null}
        <Cursor keys={[{f: xs - 40, x: 640, y: 440}, {f: xs - 22, x: B2.x + 30, y: B2.y + 8, click: true}, {f: ms - 14, x: C2.x + 30, y: C2.y + 8, click: true}, {f: me + 60, x: 900, y: 480}]} />
      </ExcelApp>
    </Stage>
  );
};
void eo;
