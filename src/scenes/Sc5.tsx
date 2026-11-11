import {useCurrentFrame} from "remotion";
import {Cap, Cursor, ExcelApp, Glow, Tag, cellRect, eo, prog, rgba} from "../kit";
import {C, F} from "../theme";
import {block, res} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(4, k);
const W = [170, 24, 130, 130, 130, 130, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56];
const T1: Tok[] = [{t: "=TEXTJOIN(", c: FC.b}, {t: '", "'}, {t: ","}, {t: "TRUE", c: FC.p}, {t: ","}, {t: "UNIQUE(", c: FC.g}, {t: "tbl_Sales[Branch]", c: FC.a}, {t: "))", c: FC.g}];
const T2: Tok[] = [{t: "=TEXTJOIN(", c: FC.a}, {t: '", "'}, {t: ","}, {t: "TRUE", c: FC.p}, {t: ","}, {t: "UNIQUE(", c: FC.b}, {t: "FILTER(", c: FC.c}, {t: "tbl_Sales[Product]", c: FC.g}, {t: ","}, {t: "tbl_Sales[Branch]="}, {t: '"Cairo"', c: FC.a}, {t: ")))", c: FC.b}];
const T3: Tok[] = [{t: "=CONCAT(", c: FC.p}, {t: "UNIQUE(", c: FC.b}, {t: "tbl_Sales[Region]", c: FC.g}, {t: "))", c: FC.p}];
const OUT = ["Cairo, Alexandria, Giza, Mansoura, Tanta", "Laptop, Phone, Tablet, Monitor, Mouse, Cable", "EastWestNorthSouth"];
const COL = ["#0B6FA8", "#92400E", "#7E22CE"], BG = ["#E4F3FD", "#FFF1C9", "#F5EBFD"];

export const Sc5 = () => {
  const f = useCurrentFrame();
  const S = [a(2), a(2) + 96, a(2) + 214], E = [a(2) + 78, a(2) + 204, a(2) + 268];
  const TK = [T1, T2, T3];
  const ns = TK.map((t, i) => nTyped(f, S[i], E[i] - 8, tlen(t)));
  const ph = f < S[1] - 6 ? 0 : f < S[2] - 6 ? 1 : 2;
  const ed = [0, 1, 2].map((i) => f >= S[i] - 6 && f < E[i]);
  const cells = [...block(1, 1, [["Summary"]], {hdr: true}), {r: 1, c: 3, t: "Result", bold: true, color: "#fff", bg: C.green}, {r: 2, c: 1, t: "All branches"}, {r: 4, c: 1, t: "Cairo products"}, {r: 6, c: 1, t: "Regions (CONCAT)"},
    ...[0, 1, 2].map((i) => (f >= E[i] ? res(2 + i * 2, 3, OUT[i], COL[i], BG[i]) : ed[i] ? {r: 2 + i * 2, c: 3, t: <span style={{color: "#555"}}>=TEXT…</span>} : null)).filter(Boolean) as never[]];
  const seal = eo(prog(f, a(4), 24));
  const cur = cellRect(3, 2 + ph * 2, W);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(4)}><Tag label="Enterprise Text Concatenation" color={C.emerald} parts={[{t: "Aggregate & Merge 50,000 Text Records Instantly"}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Zero Latency Text Pipeline" color={C.emerald} parts={[{t: "High-Speed TEXTJOIN & CONCAT Processing"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Text"]} name={`C${2 + ph * 2}`} editing={ed.some(Boolean)} fx={f >= S[0] - 6 ? <Fx toks={TK[ph]} n={f >= E[ph] ? 999 : ns[ph]} /> : ""}
        sheet={{cells, widths: W, active: {r: 2 + ph * 2, c: 3}, sel: {r1: 2 + ph * 2, c1: 3, r2: 2 + ph * 2, c2: 3}}}>
        {f >= a(0) && f < a(1) ? <Chip x={60} y={330} w={470} color={C.emerald} k={win(f, a(0), a(1))} size={15}>manzooma_sales_2026.xlsx · loaded</Chip> : null}
        {f >= a(1) && f < S[0] - 6 ? <Chip x={60} y={330} w={500} color={C.blue} k={win(f, a(1), S[0] - 6)} size={15}>tbl_Sales · 50,000 rows</Chip> : null}
        {[0, 1, 2].map((i) => (f >= E[i] && f < E[i] + 90 ? <Glow key={i} x={cellRect(3, 2 + i * 2, W).x} y={cellRect(3, 2 + i * 2, W).y} w={i === 1 ? 330 : i === 0 ? 290 : 150} h={19} color={[C.blue, C.amber, C.purple][i]} k={win(f, E[i], E[i] + 90)} fill={0.1} /> : null))}
        {[0, 1, 2].map((i) => <Enter key={"e" + i} x={cellRect(3, 2 + i * 2, W).x + 50} y={cellRect(3, 2 + i * 2, W).y - 4} k={win(f, E[i] - 4, E[i] + 14, 4)} />)}
        {f >= E[2] && f < a(4) + 20 ? <Chip x={60} y={330} w={560} color={C.emerald} k={win(f, E[2], a(4) + 20)} size={14}>3 text summaries · live · no copy-paste</Chip> : null}
        {seal > 0 ? (
          <div style={{position: "absolute", left: 640, top: 340, width: 440, height: 190, opacity: seal, transform: `scale(${0.8 + 0.2 * seal})`, background: C.slate, border: `3px solid ${C.emerald}`, borderRadius: 18, boxShadow: `0 0 ${30 * seal}px ${rgba(C.emerald, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, boxSizing: "border-box", fontFamily: F.ui}}>
            <svg width="78" height="78" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="5" /><path d="M24 43 L37 56 L61 28" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div><div style={{color: C.emerald, fontWeight: 700, fontSize: 26}}>Enterprise TEXTJOIN</div><div style={{color: C.ink, fontSize: 17, marginTop: 6}}>50,000 rows<br />merged instantly</div></div>
          </div>
        ) : null}
        <Cursor keys={[{f: S[0] - 30, x: 640, y: 440}, {f: S[0] - 14, x: cellRect(3, 2, W).x + 30, y: cellRect(3, 2, W).y + 8, click: true}, {f: S[1] - 14, x: cellRect(3, 4, W).x + 30, y: cellRect(3, 4, W).y + 8, click: true}, {f: S[2] - 14, x: cellRect(3, 6, W).x + 30, y: cellRect(3, 6, W).y + 8, click: true}, {f: a(4) + 60, x: 900, y: 580}]} />
        {void cur}
      </ExcelApp>
    </Stage>
  );
};
