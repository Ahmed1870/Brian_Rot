import {useCurrentFrame} from "remotion";
import {Callout, Cap, Cursor, ExcelApp, Glow, Tag, cellRect, clamp, eo, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {W, tbl, usd} from "../data";
import {Chip, Fx, Stage, anchor, win, type Tok} from "./common";

const a = (k: number) => anchor(1, k);
const G = "#0B8A4B", B = "#0B6FA8", A = "#B7791F";
const BASE: Tok[] = [{t: "=SUMIFS("}, {t: "tbl_Sales2026[Revenue]", c: G}, {t: ","}, {t: "tbl_Sales2026[Branch]", c: B}, {t: ","}, {t: '"Cairo"', c: A}];
const part = (f: number, s: number, len: number, cps = 14) => Math.min(len, Math.max(0, Math.floor(((f - s) * cps) / 30)));
const int = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const Sc2 = () => {
  const f = useCurrentFrame();
  const nA = part(f, a(2), 23, 18), nB = part(f, a(5), 5, 8), nAmp = f >= a(5) + 60 ? 1 : 0, nH = f >= a(7) ? 2 : 0;
  const extra: Tok[] = [{t: ",tbl_Sales2026[Revenue]".slice(0, nA), c: B}, {t: ',">="'.slice(0, nB), c: A}, {t: "&".slice(0, nAmp), c: A}, {t: "H1".slice(0, nH), c: A}];
  const full = nA + nB + nAmp + nH >= 31;
  const toks: Tok[] = [...BASE, ...extra, {t: f < a(2) || full ? ")" : ""}];
  const commit = a(7) + 45;
  const chg = a(8) + 100;
  const h1 = f >= chg + 30 ? 75000 : 50000;
  const total = f < commit ? 21684500 : h1 === 75000 ? 4115000 : 7240000;
  const typing = f >= a(2) && f < commit;
  const H1 = cellRect(8, 1, W), F2 = cellRect(6, 2, W);
  const flash = f >= commit && f < commit + 50 ? prog(f, commit, 6) * (1 - prog(f, commit + 20, 30)) : f >= chg + 30 && f < chg + 90 ? prog(f, chg + 30, 6) * (1 - prog(f, chg + 50, 40)) : 0;
  const cells = [...tbl(), {r: 2, c: 5, t: "Cairo total", bold: true}, {r: 2, c: 6, t: usd(total), a: "r" as const, bold: true, color: C.green, bg: flash > 0 ? rgba(C.emerald, 0.35 * flash) : undefined},
    ...(f >= a(2) ? [{r: 1, c: 7, t: "Min revenue", a: "r" as const, bold: true}, {r: 1, c: 8, t: f >= chg && f < chg + 30 ? <span>{"75000".slice(0, Math.floor((f - chg) / 5))}</span> : int(h1), a: "r" as const, bold: true, bg: rgba(C.amber, 0.25)}] : [])];
  const cardK = win(f, a(6), a(8) + 190, 14);
  const link = prog(f, a(6) + 20, 50);
  const str = `">=${h1}"`;
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(3)} b={a(8)}><Tag label="Dynamic Cell Linking" color={C.amber} parts={[{t: "Criteria Syntax: "}, {t: '">="&H1', c: C.amber}, {t: "  (Concatenation Rule)"}]} /></Cap>,
      <Cap key="1" f={f} a={a(8)} b={9999}><Tag label="Multi-Criteria SUMIFS" color={C.emerald} parts={[{t: "Filter by Branch AND Revenue Threshold Simultaneously"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Sales"]} name={f >= chg && f < chg + 30 ? "H1" : "F2"} editing={typing || (f >= chg && f < chg + 30)} fx={f >= chg && f < chg + 30 ? <span>{"75000".slice(0, Math.floor((f - chg) / 5))}</span> : <Fx toks={toks} n={999} />}
        sheet={{cells, widths: W, active: f >= chg && f < chg + 30 ? {r: 1, c: 8} : {r: 2, c: 6}, sel: f >= chg && f < chg + 30 ? {r1: 1, c1: 8, r2: 1, c2: 8} : {r1: 2, c1: 6, r2: 2, c2: 6}}}>
        {f >= a(4) && f < a(8) + 190 ? <Glow x={H1.x} y={H1.y} w={H1.w - 1} h={H1.h - 1} color={C.amber} k={win(f, a(4), a(8) + 190)} /> : null}
        {f >= a(4) && f < a(6) ? <Callout x={700} y={290} w={230} tx={H1.x + 40} ty={H1.y + 20} color={C.amber} k={win(f, a(4), a(6))} size={15}>External cell: H1 = 50,000</Callout> : null}
        {f >= a(2) && f < a(4) ? <Glow x={cellRect(3, 1, W).x} y={cellRect(3, 1, W).y} w={91} h={340} color={C.blue} k={win(f, a(2), a(4))} fill={0.06} /> : null}
        {f >= commit && f < commit + 90 ? <Chip x={F2.x + F2.w + 20} y={F2.y} w={300} color={C.emerald} k={win(f, commit, commit + 90)} size={14}>Cairo AND Revenue ≥ 50,000 → $7,240,000</Chip> : null}
        {f >= chg + 30 && f < chg + 160 ? <Chip x={F2.x + F2.w + 20} y={F2.y} w={300} color={C.emerald} k={win(f, chg + 30, chg + 160)} size={14}>Recalculated instantly → $4,115,000</Chip> : null}
        {cardK > 0 ? (
          <div style={{position: "absolute", left: 610, top: 284, width: 650, height: 170, opacity: cardK, background: C.slate, border: `2px solid ${rgba(C.amber, 0.75)}`, borderRadius: 14, boxShadow: `0 0 20px ${rgba(C.amber, 0.3)}`, fontFamily: F.mono, boxSizing: "border-box", color: C.ink}}>
            <div style={{position: "absolute", left: 18, top: 12, fontSize: 15, fontWeight: 700, color: C.amber, fontFamily: F.ui}}>Concatenation: text + cell</div>
            <div style={{position: "absolute", left: 30, top: 52, width: 120, height: 48, border: `2px solid ${C.amber}`, borderRadius: 10, background: rgba(C.amber, 0.15), color: C.amber, fontWeight: 700, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center"}}>{'">="'}</div>
            <div style={{position: "absolute", left: 176, top: 48, width: 56, height: 56, borderRadius: 28, border: `2px solid ${C.amber}`, background: rgba(C.amber, 0.25), color: C.amber, fontWeight: 700, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${16 * link}px ${C.amber}`}}>&amp;</div>
            <div style={{position: "absolute", left: 260, top: 52, width: 150, height: 48, border: `2px solid ${C.amber}`, borderRadius: 10, background: rgba(C.amber, 0.15), color: C.amber, fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center"}}>H1 = {int(h1)}</div>
            <div style={{position: "absolute", left: 150, top: 76, width: 26 * link, height: 3, background: C.amber}} /><div style={{position: "absolute", left: 232, top: 76, width: 28 * link, height: 3, background: C.amber}} />
            <div style={{position: "absolute", left: 428, top: 60, fontSize: 28, color: C.ink, opacity: link}}>⇒</div>
            <div style={{position: "absolute", left: 470, top: 52, width: 160, height: 48, border: `2px solid ${C.emerald}`, borderRadius: 10, background: rgba(C.emerald, 0.15), color: C.emerald, fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", opacity: link}}>{str}</div>
            <div style={{position: "absolute", left: 30, top: 124, fontSize: 14, color: "#CBD5E1", fontFamily: F.ui}}>The criterion is built as text, so changing H1 changes the result.</div>
          </div>
        ) : null}
        <Cursor keys={[{f: chg - 20, x: 900, y: 420}, {f: chg, x: H1.x + 30, y: H1.y + 8, click: true}, {f: chg + 80, x: 900, y: 460}]} />
      </ExcelApp>
    </Stage>
  );
};
void clamp;
