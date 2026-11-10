import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, Tag, cellRect, eo, prog, rangeRect, rgba} from "../kit";
import {C} from "../theme";
import {TB, W, tblCells} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(1, k);
const R: Tok[] = [{t: "=XMATCH(", c: FC.b}, {t: '"Cairo"', c: FC.a}, {t: ","}, {t: "tbl_Sales[Branch]", c: FC.g}, {t: ",0,-1", c: "#0B8A4B"}, {t: ")", c: FC.b}];
const T: Tok[] = [{t: "=XMATCH(", c: FC.b}, {t: '"Tech*"', c: FC.a}, {t: ","}, {t: "tbl_Sales[Category]", c: FC.g}, {t: ",2", c: FC.p}, {t: ")", c: FC.b}];
const arg = (toks: Tok[], n: number) => (toks.map((k) => k.t).join("").slice(0, n).match(/,/g) ?? []).length;

export const Sc2 = () => {
  const f = useCurrentFrame();
  const rs = a(1) + 10, re = a(2) + 100, ts = a(4) - 10, te = a(5) + 70;
  const nR = nTyped(f, rs, re - 12, tlen(R)), nT = nTyped(f, ts + 20, te - 12, tlen(T));
  const edR = f >= rs - 8 && f < re, edT = f >= ts + 8 && f < te;
  const jump = prog(f, re + 6, 60);
  const resR = f >= re + 66, resT = f >= te + 30;
  const tech = f >= te + 4 ? TB.map((r, i) => (String(r[2]).startsWith("Tech") ? i + 1 : 0)).filter(Boolean) : [];
  const hl: Record<number, string> = {};
  if (resR) hl[10] = "#D6F3E7";
  tech.forEach((r) => { hl[r] = r === 3 && resT ? "#EAD7FB" : hl[r] ?? "#F5EBFD"; });
  const cells = [...tblCells({hl}), {r: 1, c: 1, t: "Search", bold: true, color: "#fff", bg: C.green}, {r: 1, c: 2, t: "Position", bold: true, color: "#fff", bg: C.green}, {r: 2, c: 1, t: "Last Cairo"}, {r: 4, c: 1, t: "First Tech*"},
    ...(resR ? [{r: 2, c: 2, t: "10", a: "r" as const, bold: true, color: "#0B8A4B"}] : edR ? [{r: 2, c: 2, t: <span style={{color: "#555"}}>=XMATCH("Cai…</span>}] : []),
    ...(resT ? [{r: 4, c: 2, t: "3", a: "r" as const, bold: true, color: "#7E22CE"}] : edT ? [{r: 4, c: 2, t: <span style={{color: "#555"}}>=XMATCH("Tec…</span>}] : [])];
  const B2 = cellRect(2, 2, W), B4 = cellRect(2, 4, W);
  const act = f >= ts ? {r: 4, c: 2} : {r: 2, c: 2};
  const rowY = (r: number) => rangeRect(r + 1, 7, r + 1, 7, W).y;
  const px = rangeRect(2, 7, 2, 7, W).x - 18;
  const pos = 12 - Math.min(2, Math.floor(jump * 2.99));
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(4)}><Tag label="Reverse Search (-1)" color={C.emerald} parts={[{t: "=XMATCH(value, array, 0, -1)", c: C.emerald}, {t: " Finds Last Occurrence Instantly"}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Wildcard Matching (2)" color={C.purple} parts={[{t: '=XMATCH("Tech*", array, 2)', c: C.purple}, {t: " Supports * and ?"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name={`B${act.r}`} editing={edR || edT} fx={edT || f >= te ? <Fx toks={T} n={f >= te ? 999 : nT} /> : f >= rs - 8 ? <Fx toks={R} n={f >= re ? 999 : nR} /> : ""}
        sheet={{cells, widths: W, active: act, sel: {r1: act.r, c1: 2, r2: act.r, c2: 2}}}>
        {f < rs ? <Chip x={60} y={300} w={420} color={C.blue} k={win(f, a(0) + 10, rs)} size={15}>Forward search finds the FIRST match only</Chip> : null}
        {edR && nR <= 4 ? <AutoComp x={B2.x} y={B2.y + 20} typed={"=XMATCH".slice(0, nR)} /> : null}
        {edR && nR > 7 ? <ArgTip x={B2.x - 40} y={B2.y + 22} sig={["XMATCH(", "lookup_value,", "lookup_array,", "[match_mode],", "[search_mode])"]} cur={Math.min(3, arg(R, nR))} /> : null}
        {edT && nT > 7 ? <ArgTip x={B4.x - 40} y={B4.y + 22} sig={["XMATCH(", "lookup_value,", "lookup_array,", "[match_mode],", "[search_mode])"]} cur={Math.min(2, arg(T, nT))} /> : null}
        <Enter x={B2.x + 50} y={B2.y - 4} k={win(f, re - 4, re + 14, 4)} /><Enter x={B4.x + 50} y={B4.y - 4} k={win(f, te - 4, te + 14, 4)} />
        {jump > 0 && !resR ? <div style={{position: "absolute", left: px, top: rowY(pos), fontSize: 18, color: C.emerald, textShadow: `0 0 10px ${C.emerald}`, lineHeight: "19px"}}>▶</div> : null}
        {jump > 0 ? [12, 11].filter((r) => 12 - Math.min(2, Math.floor(jump * 2.99)) < r).map((r) => <div key={r} style={{position: "absolute", left: px - 4, top: rowY(r), fontSize: 14, color: C.red, fontWeight: 700, lineHeight: "19px"}}>✗</div>) : null}
        {resR ? <Glow x={rangeRect(2, 7, 2, 7, W).x} y={rowY(10)} w={rangeRect(2, 7, 2, 12, W).w - 1} h={19} color={C.emerald} k={f < re + 150 ? win(f, re + 66, re + 150) : 0.85} fill={0.1} /> : null}
        {resR && f < a(3) ? <Chip x={B2.x + 60} y={B2.y + 36} w={290} color={C.emerald} k={win(f, re + 66, a(3))} size={14}>Last Cairo = row 10 (first = row 1)</Chip> : null}
        {resT ? <Glow x={rangeRect(2, 9, 2, 9, W).x} y={rowY(3)} w={rangeRect(2, 9, 2, 9, W).w - 1} h={19} color={C.purple} k={0.9} fill={0.12} /> : null}
        {f >= a(6) ? <Chip x={60} y={300} w={520} color={C.purple} k={eo(prog(f, a(6), 14))} size={15}>*  any text   ·   ?  exactly one character</Chip> : null}
        <Cursor keys={[{f: rs - 30, x: 640, y: 440}, {f: rs - 10, x: B2.x + 30, y: B2.y + 8, click: true}, {f: ts + 4, x: B4.x + 30, y: B4.y + 8, click: true}, {f: te + 60, x: 900, y: 480}]} />
      </ExcelApp>
    </Stage>
  );
};
void rgba;
