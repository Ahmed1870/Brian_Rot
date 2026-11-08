import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, SpillBox, Tag, cellRect, eo, prog, rangeRect, rgba} from "../kit";
import {C} from "../theme";
import {block} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(2, k);
const W = [84, 56, 56, 20, 84, 56, 56, 20, 70, 70, 70, 20, 70, 70, 70, 56, 56, 56, 56];
const BR: (string | number)[][] = [["Branch", "Sales", "Target"], ["Cairo", 54000, 50000], ["Alexandria", 42750, 45000], ["Giza", 12000, 20000], ["Mansoura", 31400, 30000], ["Tanta", 22900, 25000]];
const SS: (string | number)[][] = [["Deal", "Rep", "Revenue"], ["D-4021", "Mona", 98000], ["D-4107", "Omar", 87500], ["D-3988", "Salma", 76200], ["D-4150", "Karim", 64100], ["D-4033", "Nour", 52800], ["D-4090", "Hady", 31400], ["D-4002", "Rana", 22900], ["D-4177", "Adel", 14300]];
const D: Tok[] = [{t: "=DROP(", c: FC.p}, {t: "tbl_Branch[#All]", c: FC.b}, {t: ",1)", c: FC.p}];
const T = (n: string): Tok[] => [{t: "=TAKE(", c: FC.a}, {t: "tbl_SortedSales", c: FC.b}, {t: `,${n})`, c: FC.a}];

export const Sc3 = () => {
  const f = useCurrentFrame();
  const dS = a(2), dE = a(2) + 135, tS = a(3), tE = a(3) + 135, nS = a(4) + 20, nE = a(4) + 85;
  const nD = nTyped(f, dS + 10, dE - 15, tlen(D)), nT = nTyped(f, tS + 10, tE - 15, 24);
  const neg = f >= nS + 20;
  const hd = prog(f, dE, 24), dRows = f >= dE + 24;
  const bottom = f >= nE + 6, top = f >= tE + 6;
  const edD = f >= dS && f < dE, edT = (f >= tS && f < tE) || (f >= nS && f < nE);
  const src = (r: number, c: number, n: number) => rangeRect(r, c, r + n - 1, c + 2, W);
  const cells = [...block(1, 1, BR, {hdr: true}), ...block(1, 9, SS, {hdr: true}),
    ...(dRows ? block(1, 5, BR.slice(1), {color: "#6B21A8", bg: "#F5EAFE"}) : []),
    ...(top && !bottom ? block(2, 13, SS.slice(1, 6), {color: "#92400E", bg: "#FFF5E0"}) : []),
    ...(bottom ? block(2, 13, SS.slice(4, 9), {color: "#B91C1C", bg: "#FDECEC"}) : [])];
  const tk = T(neg ? "-5" : "5");
  const act = f >= tS - 12 ? {r: 2, c: 13} : {r: 1, c: 5};
  const hl = (r1: number, r2: number, col: string, k: number) => { const q = rangeRect(r1, 9, r2, 11, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={col} k={k} fill={0.1} />; };
  const E1 = cellRect(5, 1, W), M2 = cellRect(13, 2, W);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={tS}><Tag label="DROP Function" color={C.purple} parts={[{t: "=DROP(array, 1)", c: C.purple}, {t: " Drops First Row/Header to Prevent Duplicate Titles"}]} /></Cap>,
      <Cap key="1" f={f} a={tS} b={a(4)}><Tag label="TAKE Function" color={C.amber} parts={[{t: "=TAKE(array, 5)", c: C.amber}, {t: " Grabs Top 5 Rows"}]} /></Cap>,
      <Cap key="2" f={f} a={a(4)} b={9999}><Tag label="TAKE(array, -5)" color={C.red} parts={[{t: "Negative number = from the END → Bottom Performers"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Reshape"]} name={f >= tS - 12 ? "M2" : "E1"} editing={edD || edT} fx={edT || f >= tE ? <Fx toks={tk} n={f >= tE && f < nS ? 999 : f >= nS ? (neg ? 25 : 24) : nT} /> : f >= dS ? <Fx toks={D} n={f >= dE ? 999 : nD} /> : ""}
        sheet={{cells, widths: W, active: act, sel: {r1: act.r, c1: act.c, r2: act.r, c2: act.c}}}>
        {f < dS ? <Chip x={330} y={420} w={470} color={C.blue} k={win(f, a(0), dS)} size={15}>tbl_Branch (A1:C6)  ·  tbl_SortedSales (I1:K9)</Chip> : null}
        {f >= dS && f < tS ? <Chip x={330} y={420} w={470} color={C.purple} k={win(f, dS + 20, tS)} size={15}>tbl_Branch[#All] includes the header row → DROP 1</Chip> : null}
        {edD && nD <= 5 ? <AutoComp x={E1.x} y={E1.y + 20} typed={"=DROP".slice(0, nD)} /> : null}
        {edD && nD > 6 ? <ArgTip x={E1.x} y={E1.y + 22} sig={["DROP(", "array,", "rows,", "[columns])"]} cur={nD > 22 ? 1 : 0} /> : null}
        {edT && f < nS && nT > 6 ? <ArgTip x={M2.x - 120} y={M2.y + 22} sig={["TAKE(", "array,", "rows,", "[columns])"]} cur={nT > 22 ? 1 : 0} /> : null}
        {edT && f < nS && nT <= 5 ? <AutoComp x={M2.x} y={M2.y + 20} typed={"=TAKE".slice(0, nT)} /> : null}
        <Enter x={E1.x + 90} y={E1.y - 4} k={win(f, dE - 4, dE + 14, 4)} /><Enter x={M2.x - 70} y={M2.y - 4} k={win(f, tE - 4, tE + 14, 4) + win(f, nE - 4, nE + 14, 4)} />
        {hd > 0 && hd < 1 ? (
          <div>
            <div style={{position: "absolute", left: E1.x, top: E1.y - 20 * eo(hd), width: 196, height: 20, background: rgba(C.purple, 0.5 * (1 - hd)), border: `2px solid ${C.purple}`, boxShadow: `0 0 14px ${C.purple}`, color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: "17px", padding: "0 4px", boxSizing: "border-box", opacity: 1 - hd}}>Branch · Sales · Target</div>
          </div>
        ) : null}
        {dRows ? <div><SpillBox r1={1} c1={5} r2={5} c2={7} widths={W} color={C.purple} k={eo(prog(f, dE + 24, 10))} />{f < dE + 110 ? (() => { const q = rangeRect(1, 5, 5, 7, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={C.purple} k={win(f, dE + 24, dE + 110)} fill={0.08} />; })() : null}</div> : null}
        {f >= tE + 6 && f < nS + 20 ? hl(2, 6, C.amber, win(f, tE + 6, nS + 20)) : null}
        {f >= nE + 6 ? hl(5, 9, C.red, eo(prog(f, nE + 6, 12))) : null}
        {top && !bottom ? <SpillBox r1={2} c1={13} r2={6} c2={15} widths={W} color={C.amber} /> : null}
        {bottom ? <SpillBox r1={2} c1={13} r2={6} c2={15} widths={W} color={C.red} /> : null}
        {f >= tE + 20 && f < nS ? <Chip x={M2.x - 300} y={M2.y + 150} w={290} color={C.amber} k={win(f, tE + 20, nS)} size={14}>Top 5 deals by revenue ✓</Chip> : null}
        {f >= nE + 20 ? <Chip x={M2.x - 300} y={M2.y + 150} w={290} color={C.red} k={eo(prog(f, nE + 20, 14))} size={14}>−5 = last 5 rows (bottom) ✓</Chip> : null}
        <Cursor keys={[{f: dS - 20, x: 640, y: 420}, {f: dS, x: E1.x + 20, y: E1.y + 6, click: true}, {f: tS - 16, x: M2.x + 20, y: M2.y + 6, click: true}, {f: nS - 6, x: M2.x + 30, y: M2.y + 8, click: true}, {f: nE + 50, x: 900, y: 480}]} />
      </ExcelApp>
    </Stage>
  );
};
