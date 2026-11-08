import {useCurrentFrame} from "remotion";
import type {ReactNode} from "react";
import {Cap, ExcelApp, Tag, cellRect, clamp, eo, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {int, tbl, usd} from "../data";
import {Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(4, k);
const W5 = [92, 82, 84, 20, 100, 126, 126, 100, 100, 100];
// [criteria, sum, deals, min, max]  (counts add up to 50,000 rows; avg = sum / deals)
const B: [string, number, number, number, number][] = [["Cairo*", 38946800, 21200, 850, 182000], ["Alexandria", 17380000, 11000, 700, 168500], ["Giza", 12620000, 8800, 900, 139000], ["Mansoura", 8010000, 5600, 1050, 122400], ["Tanta", 4520000, 3400, 640, 98700]];
const HDR = ["SUMIFS", "AVERAGEIFS", "COUNTIFS", "MINIFS", "MAXIFS"];
const COLS = [C.emerald, C.blue, C.purple, C.amber, C.emerald];
const FX = [
  "=SUMIFS(tbl_Sales2026[Revenue],tbl_Sales2026[Branch],$E2)", "=AVERAGEIFS(tbl_Sales2026[Revenue],tbl_Sales2026[Branch],$E2)", "=COUNTIFS(tbl_Sales2026[Branch],$E2)",
  "=MINIFS(tbl_Sales2026[Revenue],tbl_Sales2026[Branch],$E2)", "=MAXIFS(tbl_Sales2026[Revenue],tbl_Sales2026[Branch],$E2)",
];
const val = (k: number, r: (typeof B)[number]) => [usd(r[1]), usd(r[1] / r[2]), int(r[2]), usd(r[3]), usd(r[4])][k];

export const Sc5 = () => {
  const f = useCurrentFrame();
  const s0 = a(3);
  const col = (k: number) => clamp((f - (s0 + k * 46)) / 46);
  const cur = Math.min(4, Math.max(0, Math.floor((f - s0) / 46)));
  const started = f >= s0;
  const cells: {r: number; c: number; t: ReactNode; a?: "l" | "r" | "c"; bold?: boolean; color?: string; bg?: string}[] = [...tbl()];
  cells.push({r: 1, c: 5, t: "Branch", bold: true, color: "#fff", bg: C.green});
  HDR.forEach((h, k) => cells.push({r: 1, c: 6 + k, t: h, bold: true, color: "#fff", bg: C.green, a: "c"}));
  B.forEach((r, i) => {
    cells.push({r: i + 2, c: 5, t: r[0], bold: true});
    HDR.forEach((_, k) => {
      const t = clamp(col(k) * 6.5 - i);
      cells.push({r: i + 2, c: 6 + k, t: t > 0.5 ? val(k, r) : "", a: "r", bg: t > 0 && t < 1 ? rgba(COLS[k], 0.4 * Math.sin(Math.PI * t)) : undefined});
    });
  });
  const seal = eo(prog(f, a(4), 24));
  const done = f >= s0 + 5 * 46;
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(4)}><Tag label="Enterprise Aggregate Reporting" color={C.emerald} parts={[{t: "Summarize 50,000 Sales Records via IFS Suite"}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Automated Executive Summaries" color={C.emerald} parts={[{t: "Zero-Filter Multi-Criteria Aggregation"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name={started ? `${String.fromCharCode(70 + cur)}2` : "E2"} editing={started && !done} fx={started ? FX[cur] : ""}
        sheet={{cells, widths: W5, active: {r: 2, c: 6 + cur}, sel: started && !done ? {r1: 2, c1: 6 + cur, r2: 6, c2: 6 + cur} : undefined}}>
        {f >= a(0) && f < a(2) ? <Chip x={330} y={344} w={420} color={C.emerald} k={win(f, a(0), a(2))} size={15}>manzooma_sales_2026.xlsx · loaded</Chip> : null}
        {f >= a(2) && f < s0 + 100 ? <Chip x={330} y={344} w={420} color={C.blue} k={win(f, a(2), s0 + 100)} size={15}>tbl_Sales2026 · 50,000 rows × 3 columns</Chip> : null}
        {started && !done ? <Chip x={330} y={344} w={420} color={COLS[cur]} k={1} size={15}>{HDR[cur]} → 5 branches in one pass</Chip> : null}
        {done ? <Chip x={330} y={344} w={520} color={C.emerald} k={win(f, s0 + 5 * 46, 9999, 14)} size={15}>50,000 rows → instant · zero manual filtering</Chip> : null}
        {seal > 0 ? (
          <div style={{position: "absolute", left: 640, top: 386, width: 440, height: 200, opacity: seal, transform: `scale(${0.8 + 0.2 * seal})`, background: C.slate, border: `3px solid ${C.emerald}`, borderRadius: 18, boxShadow: `0 0 ${30 * seal}px ${rgba(C.emerald, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, boxSizing: "border-box", fontFamily: F.ui}}>
            <svg width="78" height="78" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="5" /><path d="M24 43 L37 56 L61 28" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div><div style={{color: C.emerald, fontWeight: 700, fontSize: 26}}>Enterprise Aggregate</div><div style={{color: C.ink, fontSize: 17, marginTop: 6}}>100% automated summary<br />5 functions · 50,000 rows</div></div>
          </div>
        ) : null}
      </ExcelApp>
    </Stage>
  );
};
void cellRect;
