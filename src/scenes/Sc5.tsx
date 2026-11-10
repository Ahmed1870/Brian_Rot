import {useCurrentFrame} from "remotion";
import {Cap, Cursor, ExcelApp, Glow, SpillBox, Tag, cellRect, eo, prog, rangeRect, rgba} from "../kit";
import {C, F} from "../theme";
import {block, int} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(4, k);
const W = [100, 90, 100, 130, 20, 20, 100, 96, 100, 56, 56, 56, 56, 56, 56];
const IDS = ["INV-00412", "INV-27650", "INV-49871"], POS = [412, 27650, 49871], AMT = [18400, 42750, 9300], LAST = 49987;
const TB: (string | number)[][] = [["Invoice ID", "Branch", "Sales Amount"], ...Array.from({length: 14}, (_, i) => ["INV-" + String(i + 1).padStart(5, "0"), ["Cairo", "Alexandria", "Giza", "Mansoura"][i % 4], 4000 + ((i * 3977) % 60000)])];
const TB1: Tok[] = [{t: "=XMATCH(", c: FC.b}, {t: "A2:A4", c: FC.g}, {t: ","}, {t: "tbl_Sales[Invoice ID]", c: FC.a}, {t: ")", c: FC.b}];
const TC: Tok[] = [{t: "=INDEX(", c: FC.g}, {t: "tbl_Sales[Sales Amount]", c: FC.a}, {t: ","}, {t: "B2#", c: FC.p}, {t: ")", c: FC.g}];
const TD: Tok[] = [{t: "=XMATCH(", c: FC.b}, {t: '"Cairo"', c: FC.a}, {t: ","}, {t: "tbl_Sales[Branch]", c: FC.g}, {t: ",0,-1", c: "#0B8A4B"}, {t: ")", c: FC.b}];

export const Sc5 = () => {
  const f = useCurrentFrame();
  const b0 = a(3), c0 = a(3) + 84, d0 = a(3) + 166;
  const eB = b0 + 68, eC = c0 + 68, eD = d0 + 58;
  const nB = nTyped(f, b0, eB - 8, tlen(TB1)), nC = nTyped(f, c0, eC - 8, tlen(TC)), nD = nTyped(f, d0, eD - 8, tlen(TD));
  const phase = f < b0 ? 0 : f < c0 - 4 ? 1 : f < d0 - 4 ? 2 : 3;
  const act = [{r: 2, c: 1}, {r: 2, c: 2}, {r: 2, c: 3}, {r: 2, c: 4}][phase];
  const edB = f >= b0 - 6 && f < eB, edC = f >= c0 - 6 && f < eC, edD = f >= d0 - 6 && f < eD;
  const cells = [...block(1, 7, TB, {hdr: true}), ...block(1, 1, [["Invoice ID", "Row", "Amount", "Last Cairo row"]], {hdr: true}), ...block(2, 1, IDS.map((i) => [i]), {bg: "#FFF8E0"}),
    ...(f >= eB ? POS.map((v, i) => ({r: i + 2, c: 2, t: int(v), a: "r" as const, bold: true, color: "#0B8A4B", bg: "#E8F7F0"})) : edB ? [{r: 2, c: 2, t: <span style={{color: "#555"}}>=XMATCH(A2…</span>}] : []),
    ...(f >= eC ? AMT.map((v, i) => ({r: i + 2, c: 3, t: usd(v), a: "r" as const, bold: true, color: "#0B8A4B", bg: "#E8F7F0"})) : edC ? [{r: 2, c: 3, t: <span style={{color: "#555"}}>=INDEX(tbl…</span>}] : []),
    ...(f >= eD ? [{r: 2, c: 4, t: int(LAST), a: "r" as const, bold: true, color: "#0B8A4B", bg: "#E8F7F0"}] : edD ? [{r: 2, c: 4, t: <span style={{color: "#555"}}>=XMATCH("Cai…</span>}] : [])];
  const seal = eo(prog(f, a(4), 24));
  const cur = cellRect(act.c, 2, W);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(4)}><Tag label="Enterprise Dynamic Indexing" color={C.emerald} parts={[{t: "Retrieve & Index 50,000 Sales Records Instantly"}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Sub-Millisecond Search" color={C.emerald} parts={[{t: "High-Speed XMATCH & INDEX Matrix Search"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name={`${String.fromCharCode(64 + act.c)}2`} editing={edB || edC || edD} fx={edC || (f >= eC && f < d0 - 6) ? <Fx toks={TC} n={f >= eC ? 999 : nC} /> : edD || f >= eD ? <Fx toks={TD} n={f >= eD ? 999 : nD} /> : f >= b0 - 6 ? <Fx toks={TB1} n={f >= eB ? 999 : nB} /> : ""}
        sheet={{cells, widths: W, active: act, sel: {r1: 2, c1: act.c, r2: 2, c2: act.c}}}>
        {f >= a(0) && f < a(1) ? <Chip x={60} y={330} w={470} color={C.emerald} k={win(f, a(0), a(1))} size={15}>manzooma_sales_2026.xlsx · loaded</Chip> : null}
        {f >= a(1) && f < b0 - 6 ? <Chip x={60} y={330} w={560} color={C.blue} k={win(f, a(1), b0 - 6)} size={15}>tbl_Sales · 50,000 rows (first 14 shown)</Chip> : null}
        {f >= eB && f < eC ? <SpillBox r1={2} c1={2} r2={4} c2={2} widths={W} /> : null}
        {f >= eC ? <div><SpillBox r1={2} c1={2} r2={4} c2={2} widths={W} /><SpillBox r1={2} c1={3} r2={4} c2={3} widths={W} /></div> : null}
        {f >= eB && f < eB + 90 ? (() => { const q = rangeRect(2, 2, 4, 2, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={C.emerald} k={win(f, eB, eB + 90)} fill={0.08} />; })() : null}
        {f >= eC && f < eC + 90 ? (() => { const q = rangeRect(2, 3, 4, 3, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={C.emerald} k={win(f, eC, eC + 90)} fill={0.08} />; })() : null}
        <Enter x={cellRect(2, 2, W).x + 40} y={cellRect(2, 2, W).y - 4} k={win(f, eB - 4, eB + 14, 4)} /><Enter x={cellRect(3, 2, W).x + 40} y={cellRect(3, 2, W).y - 4} k={win(f, eC - 4, eC + 14, 4)} /><Enter x={cellRect(4, 2, W).x + 40} y={cellRect(4, 2, W).y - 4} k={win(f, eD - 4, eD + 14, 4)} />
        {f >= eD && f < a(4) + 30 ? <Chip x={60} y={330} w={560} color={C.emerald} k={win(f, eD, a(4) + 30)} size={14}>Row positions · invoice amounts · last Cairo row — instant</Chip> : null}
        {seal > 0 ? (
          <div style={{position: "absolute", left: 640, top: 300, width: 440, height: 190, opacity: seal, transform: `scale(${0.8 + 0.2 * seal})`, background: C.slate, border: `3px solid ${C.emerald}`, borderRadius: 18, boxShadow: `0 0 ${30 * seal}px ${rgba(C.emerald, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, boxSizing: "border-box", fontFamily: F.ui}}>
            <svg width="78" height="78" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="5" /><path d="M24 43 L37 56 L61 28" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div><div style={{color: C.emerald, fontWeight: 700, fontSize: 26}}>Enterprise XMATCH</div><div style={{color: C.ink, fontSize: 17, marginTop: 6}}>50,000 rows<br />indexed instantly</div></div>
          </div>
        ) : null}
        <Cursor keys={[{f: b0 - 40, x: 640, y: 440}, {f: b0 - 20, x: cellRect(2, 2, W).x + 30, y: cellRect(2, 2, W).y + 8, click: true}, {f: c0 - 14, x: cellRect(3, 2, W).x + 30, y: cellRect(3, 2, W).y + 8, click: true}, {f: d0 - 14, x: cellRect(4, 2, W).x + 30, y: cellRect(4, 2, W).y + 8, click: true}, {f: a(4) + 60, x: 900, y: 580}]} />
      </ExcelApp>
    </Stage>
  );
};
void cur0();
function cur0() { return 0; }
const usd = (n: number) => "$" + int(n);
