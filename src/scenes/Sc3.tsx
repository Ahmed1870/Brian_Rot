import {useCurrentFrame} from "remotion";
import {Cap, ExcelApp, Tag, eo, prog, rgba} from "../kit";
import {C, F, M} from "../theme";
import {W, tbl} from "../data";
import {Fx, Stage, anchor, nTyped, tlen, type Tok} from "./common";

const a = (k: number) => anchor(2, k);
const mk = (fn: string, pre: string, star: boolean): Tok[] => [{t: `=${fn}(${pre}`}, {t: '"Cairo*"', c: star ? C.amber : undefined}, {t: ',Revenue,">50000")'}];
const Panel = ({x, color, title, toks, n, big, sub, k, star, f, matched}: {x: number; color: string; title: string; toks: Tok[]; n: number; big: string; sub: string; k: number; star: boolean; f: number; matched: number}) => (
  <div style={{position: "absolute", left: x, top: 196, width: 600, height: 360, opacity: k, transform: `translateY(${(1 - k) * 24}px)`, background: C.slate, border: `2.5px solid ${color}`, borderRadius: 16, boxShadow: `0 0 26px ${rgba(color, 0.4)}`, boxSizing: "border-box", padding: 22, fontFamily: F.ui, color: C.ink}}>
    <div style={{fontSize: 26, fontWeight: 700, color}}>{title}</div>
    <div style={{marginTop: 14, height: 40, borderRadius: 8, background: "#111C33", border: "1px solid #334155", padding: "0 12px", display: "flex", alignItems: "center", fontFamily: F.mono, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden"}}><Fx toks={toks} n={n} base={C.ink} /></div>
    <div style={{marginTop: 16, fontSize: 76, fontWeight: 700, color, textAlign: "center", textShadow: `0 0 ${18 * prog(f, 0, 1)}px ${rgba(color, 0.5)}`}}>{big}</div>
    <div style={{textAlign: "center", fontSize: 17, color: "#CBD5E1"}}>{sub}</div>
    <div style={{display: "flex", gap: 10, justifyContent: "center", marginTop: 18, opacity: star ? 1 : 0}}>
      {["Cairo", "Cairo East", "Cairo West"].map((t, i) => <div key={t} style={{opacity: eo(prog(matched, i * 8, 10)), padding: "5px 12px", border: `1.5px solid ${C.amber}`, borderRadius: 14, color: C.amber, fontWeight: 700, fontSize: 15}}>✓ {t}</div>)}
    </div>
    <div style={{position: "absolute", left: 22, bottom: 12, fontSize: 12.5, color: "#94A3B8"}}>Branch = tbl_Sales2026[Branch] · Revenue = tbl_Sales2026[Revenue]</div>
  </div>
);

export const Sc3 = () => {
  const f = useCurrentFrame();
  const L = mk("COUNTIFS", "Branch,", f >= a(3)), R = mk("AVERAGEIFS", "Revenue,Branch,", f >= a(3));
  const nL = nTyped(f, a(2), a(2) + 110, tlen(L)), nR = nTyped(f, a(2) + 165, a(2) + 285, tlen(R));
  const cnt = Math.round(142 * eo(prog(f, a(2) + 125, 30))), avg = Math.round(68500 * eo(prog(f, a(2) + 300, 30)));
  const kP = eo(prog(f, a(1), 20));
  const star = f >= a(3);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(1)} b={a(2) + 165}><Tag label="COUNTIFS" color={C.purple} parts={[{t: "Counts Records Matching ALL Criteria "}, {t: "(No sum_range needed)", c: C.purple}]} /></Cap>,
      <Cap key="1" f={f} a={a(2) + 165} b={a(3)}><Tag label="AVERAGEIFS" color={C.blue} parts={[{t: "Averages Values Matching Criteria"}]} /></Cap>,
      <Cap key="2" f={f} a={a(3)} b={9999}><Tag label="Wildcard" color={C.amber} parts={[{t: '"Cairo*"', c: C.amber}, {t: " matches every branch that starts with Cairo"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name="A1" fx="Branch" sheet={{cells: tbl(), widths: W}}>
        <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H, background: rgba(C.slate, 0.78 * kP)}} />
        <Panel x={24} color={C.purple} title="COUNTIFS" toks={L} n={nL} big={f >= a(2) + 125 ? String(cnt) : "–"} sub="rows match ALL criteria" k={kP} star={star} f={f} matched={f - a(3)} />
        <Panel x={656} color={C.blue} title="AVERAGEIFS" toks={R} n={nR} big={f >= a(2) + 300 ? "$" + avg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "–"} sub="average of the matching rows only" k={eo(prog(f, a(1) + 10, 20))} star={star} f={f} matched={f - a(3)} />
        {f >= a(4) ? <div style={{position: "absolute", left: 340, top: 566, width: 600, height: 26, opacity: eo(prog(f, a(4), 14)), textAlign: "center", fontFamily: F.mono, fontSize: 16, fontWeight: 700, color: C.emerald}}>142 × $68,500 = $9,727,000 ✓ same rows, same total</div> : null}
      </ExcelApp>
    </Stage>
  );
};
