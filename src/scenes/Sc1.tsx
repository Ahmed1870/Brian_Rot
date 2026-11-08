import {useCurrentFrame} from "remotion";
import {Cap, Cursor, ExcelApp, Glow, Tag, TopBadge, cellRect, clamp, eo, prog, rangeRect, rgba} from "../kit";
import {C, F} from "../theme";
import {ROWS, W, tbl, usd} from "../data";
import {Chip, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(0, k);
const TOK: Tok[] = [{t: "=SUMIFS("}, {t: "tbl_Sales2026[Revenue]", c: "#0B8A4B"}, {t: ","}, {t: "tbl_Sales2026[Branch]", c: "#0B6FA8"}, {t: ","}, {t: '"Cairo"', c: "#B7791F"}, {t: ")"}];
const TOTAL = 21684500;

export const Sc1 = () => {
  const f = useCurrentFrame();
  const n = nTyped(f, a(4), a(6) + 70, tlen(TOK));
  const commit = a(8);
  const done = f >= commit;
  const editing = f >= a(4) && !done;
  const cairo = ROWS.map((r, i) => (r[0] === "Cairo" ? i : -1)).filter((i) => i >= 0);
  const hl = f >= a(8) - 30 ? (i: number, r: (typeof ROWS)[number]) => (r[0] === "Cairo" ? rgba(C.amber, 0.28) : undefined) : undefined;
  const val = Math.round(TOTAL * eo(prog(f, commit + 70, 50)));
  const cells = [...tbl(hl), {r: 2, c: 5, t: "Cairo total", bold: true}, ...(done ? [{r: 2, c: 6, t: f < commit + 120 ? usd(val) : usd(TOTAL), a: "r" as const, bold: true, color: C.green}] : f >= a(4) ? [{r: 2, c: 6, t: <span style={{color: "#555"}}>{"=SUMIFS(tbl_Sales…"}</span>}] : [])];
  const F2 = cellRect(6, 2, W);
  const col = (c: number) => rangeRect(1, c, 17, c, W);
  const blk = [
    {t: "sum_range", v: "tbl_Sales2026[Revenue]", c: C.emerald, w: 236, s: a(6)},
    {t: "criteria_range1", v: "tbl_Sales2026[Branch]", c: C.blue, w: 214, s: a(7)},
    {t: "criteria1", v: '"Cairo"', c: C.amber, w: 112, s: a(7) + 36},
  ];
  const cardK = win(f, a(6), a(8) + 20, 14);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(6)}><TopBadge ar="الدوال الشرطية التجميعية للمجموعات" en="Aggregate Conditional Functions Engine" /></Cap>,
      <Cap key="1" f={f} a={a(6)} b={9999}><Tag label="SUMIFS Syntax" color={C.emerald} parts={[{t: "=SUMIFS("}, {t: "sum_range", c: C.emerald}, {t: ", "}, {t: "criteria_range1", c: C.blue}, {t: ", "}, {t: "criteria1", c: C.amber}, {t: ", ...)"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name="F2" editing={editing} fx={f >= a(4) ? <Fx toks={TOK} n={done ? 999 : n} /> : ""}
        sheet={{cells, widths: W, active: {r: 2, c: 6}, sel: {r1: 2, c1: 6, r2: 2, c2: 6}}}>
        {f < a(4) ? <Chip x={600} y={236} w={420} color={C.blue} k={win(f, a(0) + 30, a(4))} size={14}>tbl_Sales2026 · first 16 of 50,000 rows</Chip> : null}
        {f >= a(6) && f < a(8) + 30 ? <Glow x={col(3).x} y={col(3).y} w={col(3).w - 1} h={col(3).h} color={C.emerald} k={win(f, a(6), a(7))} fill={0.07} /> : null}
        {f >= a(7) && f < a(8) + 30 ? <Glow x={col(1).x} y={col(1).y} w={col(1).w - 1} h={col(1).h} color={C.blue} k={win(f, a(7), a(8))} fill={0.07} /> : null}
        {cardK > 0 ? (
          <div style={{position: "absolute", left: 610, top: 262, width: 650, height: 150, opacity: cardK, background: C.slate, border: `2px solid ${rgba(C.emerald, 0.7)}`, borderRadius: 14, boxShadow: `0 0 20px ${rgba(C.emerald, 0.3)}`, fontFamily: F.mono, boxSizing: "border-box", padding: "14px 18px", color: C.ink}}>
            <div style={{fontSize: 18, fontWeight: 700, marginBottom: 12}}>SUMIFS(<span style={{color: C.emerald}}> 1st </span>, <span style={{color: C.blue}}> 2nd </span>, <span style={{color: C.amber}}> 3rd </span>)</div>
            <div style={{display: "flex", gap: 14}}>
              {blk.map((b) => {
                const k = eo(prog(f, b.s, 12));
                return (
                  <div key={b.t} style={{width: b.w, opacity: 0.25 + 0.75 * k, transform: `translateY(${(1 - k) * 10}px)`}}>
                    <div style={{fontSize: 14, color: b.c, fontWeight: 700, fontFamily: F.ui, marginBottom: 6}}>{b.t}</div>
                    <div style={{border: `2px solid ${b.c}`, background: rgba(b.c, 0.15), borderRadius: 8, padding: "10px 6px", fontSize: 13, fontWeight: 700, color: b.c, textAlign: "center", boxShadow: `0 0 ${12 * k}px ${rgba(b.c, 0.6)}`, whiteSpace: "nowrap"}}>{b.v}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {f >= a(5) && f < a(8) ? <Chip x={610} y={430} w={650} h={34} color={C.red} k={win(f, a(5), a(8))} size={16}>SUMIF(range, criteria, [sum_range])  ← sum_range is LAST</Chip> : null}
        {f >= a(9) ? <Chip x={610} y={262} w={650} h={34} color={C.emerald} k={eo(prog(f, a(9), 14))} size={17}>SUMIFS(sum_range, …)  ← sum_range is FIRST ✓</Chip> : null}
        {cairo.map((i, j) => {
          const s = commit + j * 8;
          const t = prog(f, s, 36);
          if (t <= 0 || t >= 1) return null;
          const from = cellRect(3, i + 2, W);
          const x = from.x + (F2.x - from.x) * eo(t), y = from.y + (F2.y - from.y) * eo(t);
          return <div key={i} style={{position: "absolute", left: x, top: y, padding: "0 6px", height: 18, borderRadius: 9, background: C.emerald, color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: "18px", opacity: 1 - t * 0.4}}>{usd(ROWS[i][2])}</div>;
        })}
        {done && f < commit + 140 ? <Glow x={F2.x} y={F2.y} w={F2.w - 1} h={F2.h - 1} color={C.emerald} k={win(f, commit + 60, commit + 140)} /> : null}
        <Cursor keys={[{f: a(4) - 20, x: 700, y: 420}, {f: a(4), x: F2.x + 30, y: F2.y + 8, click: true}, {f: commit + 160, x: 900, y: 450}]} />
      </ExcelApp>
    </Stage>
  );
};
void clamp;
