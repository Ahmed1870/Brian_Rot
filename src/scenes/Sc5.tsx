import {useCurrentFrame} from "remotion";
import {Cap, Cursor, ExcelApp, Glow, SpillBox, Tag, cellRect, eo, prog, rangeRect, rgba} from "../kit";
import {C, F} from "../theme";
import {block, int} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(4, k);
const W = [64, 52, 70, 44, 64, 16, 56, 56, 56, 56, 56, 16, 70, 80, 80, 56, 56, 56, 56];
const SRC = [["Deal", "Date", "Channel", "Units", "Revenue"], ...Array.from({length: 19}, (_, k) => { const i = k + 1; return ["D-" + (1000 + i * 37), "1/" + (i + 2), i % 3 === 0 ? "Wholesale" : "Retail", 5 + ((i * 7) % 40), 20000 + ((i * 3571) % 75000)]; })];
const OUT = Array.from({length: 20}, (_, i) => ["D-" + (40000 + ((i * 7919) % 10000)), (i * 5) % 3 === 0 ? "Wholesale" : "Retail", Math.round((250000 - i * 7300 - ((i * i * 37) % 2100)) / 100) * 100]);
const T: Tok[] = [{t: "=TAKE(", c: FC.g}, {t: "SORT(", c: FC.a}, {t: "CHOOSECOLS(", c: FC.c}, {t: "VSTACK(", c: FC.b}, {t: "tbl_Retail,tbl_Wholesale"}, {t: ")", c: FC.b}, {t: ",1,3,5)", c: FC.c}, {t: ",3,-1)", c: FC.a}, {t: ",20)", c: FC.g}];

export const Sc5 = () => {
  const f = useCurrentFrame();
  const ts = a(3), en = a(3) + 140;
  const nb = "M1".slice(0, Math.floor((f - a(2) - 10) / 8) + 1);
  const nav = f >= a(2) && f < a(2) + 40;
  const n = nTyped(f, ts, en - 10, tlen(T));
  const ed = f >= ts && f < en;
  const rows = f >= en + 4 ? Math.min(20, Math.floor((f - en - 4) / 2) + 1) : 0;
  const cells = [...block(1, 1, SRC, {hdr: true}), ...(rows ? block(1, 13, OUT.slice(0, rows), {color: C.green, bg: "#E8F7F0"}).map((c) => (c.c === 15 ? {...c, t: "$" + c.t} : c)) : ed ? [{r: 1, c: 13, t: <span style={{color: "#555"}}>=TAKE(SORT(CHOO…</span>}] : [])];
  const seal = eo(prog(f, a(4), 24));
  const M1 = cellRect(13, 1, W);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(4)}><Tag label="Enterprise Matrix Reshaping" color={C.emerald} parts={[{t: "Consolidate & Slice 50,000 Sales Rows Instantly"}]} /></Cap>,
      <Cap key="1" f={f} a={a(4)} b={9999}><Tag label="Zero VBA Overhead" color={C.emerald} parts={[{t: "Dynamic Stacking & Trimming Pipeline"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Retail", "Wholesale", "Top20"]} activeSheet="Top20" name={nav ? nb : f >= a(2) + 40 ? "M1" : "A1"} editing={ed} fx={f >= ts ? <Fx toks={T} n={f >= en ? 999 : n} /> : ""}
        sheet={{cells, widths: W, active: f >= a(2) + 40 ? {r: 1, c: 13} : {r: 1, c: 1}, sel: f >= a(2) + 40 ? {r1: 1, c1: 13, r2: 1, c2: 13} : {r1: 1, c1: 1, r2: 1, c2: 1}}}>
        {f >= a(0) && f < a(1) ? <Chip x={330} y={250} w={460} color={C.emerald} k={win(f, a(0), a(1))} size={15}>manzooma_sales_2026.xlsx · loaded</Chip> : null}
        {f >= a(1) && f < a(2) + 40 ? <Chip x={330} y={250} w={560} color={C.blue} k={win(f, a(1), a(2) + 40)} size={15}>tbl_Retail 25,000 + tbl_Wholesale 25,000 = 50,000 rows</Chip> : null}
        {nav ? <Glow x={4} y={155} w={104} h={22} color={C.blue} k={win(f, a(2), a(2) + 40)} /> : null}
        {ed ? <Chip x={330} y={290} w={420} color={C.amber} k={win(f, ts, en)} size={14}>VSTACK → CHOOSECOLS → SORT → TAKE 20</Chip> : null}
        <Enter x={M1.x - 70} y={M1.y - 4} k={win(f, en - 4, en + 14, 4)} />
        {rows > 0 ? <div><SpillBox r1={1} c1={13} r2={20} c2={15} widths={W} k={eo(prog(f, en + 4, 8))} />{f < en + 150 ? (() => { const q = rangeRect(1, 13, 20, 15, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={C.emerald} k={win(f, en + 4, en + 150)} fill={0.07} />; })() : null}</div> : null}
        {f >= en + 50 && f < a(4) ? <Chip x={330} y={290} w={420} color={C.emerald} k={win(f, en + 50, a(4))} size={14}>Top 20 of 50,000 · one formula · no VBA</Chip> : null}
        {seal > 0 ? (
          <div style={{position: "absolute", left: 880, top: 330, width: 380, height: 190, opacity: seal, transform: `scale(${0.8 + 0.2 * seal})`, background: C.slate, border: `3px solid ${C.emerald}`, borderRadius: 18, boxShadow: `0 0 ${30 * seal}px ${rgba(C.emerald, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, boxSizing: "border-box", fontFamily: F.ui}}>
            <svg width="78" height="78" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="5" /><path d="M24 43 L37 56 L61 28" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div><div style={{color: C.emerald, fontWeight: 700, fontSize: 24}}>Enterprise Reshaping</div><div style={{color: C.ink, fontSize: 17, marginTop: 6}}>5 functions · 1 formula<br />50,000 rows · zero VBA</div></div>
          </div>
        ) : null}
        <Cursor keys={[{f: a(2) - 10, x: 700, y: 420}, {f: a(2) + 4, x: 60, y: 166, click: true}, {f: ts - 6, x: M1.x + 20, y: M1.y + 6}, {f: en + 60, x: 900, y: 500}]} />
      </ExcelApp>
    </Stage>
  );
};
void int;
