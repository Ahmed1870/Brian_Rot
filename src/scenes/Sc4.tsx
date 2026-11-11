import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, Tag, cellRect, eo, prog, rangeRect, rgba} from "../kit";
import {C, F} from "../theme";
import {CODES, W, block, res} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(3, k);
const T: Tok[] = [{t: "=TEXTJOIN(", c: FC.g}, {t: '" | "', c: FC.a}, {t: ","}, {t: "TRUE", c: FC.p}, {t: ","}, {t: "TEXTBEFORE(", c: FC.c}, {t: "FILTER(", c: FC.a}, {t: "tbl_Sales[Code]", c: FC.b}, {t: ","}, {t: "tbl_Sales[Amount]>10000"}, {t: ","}, {t: '"No Sales"', c: FC.a}, {t: ")", c: FC.a}, {t: ","}, {t: '"-"', c: FC.a}, {t: ',,,,"No Sales"', c: "#B91C1C"}, {t: "))", c: FC.c}];
const KEEP = CODES.map((c, i) => (c[1] > 10000 ? i : -1)).filter((i) => i >= 0);
const PRE = KEEP.map((i) => CODES[i][0].split("-")[0]);

export const Sc4 = () => {
  const f = useCurrentFrame();
  const ts = a(0) + 30, en = a(4);
  const n = nTyped(f, ts, en - 14, tlen(T));
  const ed = f >= ts - 6 && f < en;
  const done = f >= en + 40;
  const pk = prog(f, en + 4, 56);
  const hl = f >= en ? KEEP.map((i) => i + 2) : [];
  const cells = [...block(1, 7, [["Code", "Amount"], ...CODES], {hdr: true}).map((c) => (hl.includes(c.r) ? {...c, bg: "#E8F7F0"} : c)), {r: 1, c: 4, t: "Summary", bold: true, color: "#fff", bg: C.green}, ...(done ? [res(2, 4, PRE.join(" | "), "#0B8A4B", "#E8F7F0")] : ed ? [{r: 2, c: 4, t: <span style={{color: "#555"}}>=TEXTJOIN(" | "…</span>}] : [])];
  const D2 = cellRect(4, 2, W);
  const ST: [string, string, string][] = [["FILTER", "5 codes · Amount > 10,000", C.amber], ["TEXTBEFORE", PRE.join(" ") + " (before “-”)", "#06B6D4"], ["TEXTJOIN", '" | " between items', C.emerald], ["Safe", 'if_empty / if_not_found = "No Sales"', C.blue]];
  const lit = [a(0) + 70, a(1), a(2), a(3)];
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(5)}><Tag label="Master Concatenation Pipeline" color={C.emerald} parts={[{t: '=TEXTJOIN(" | ", TRUE, TEXTBEFORE(FILTER(...), "-"))'}]} /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="Error-Safe Text Pipeline" color={C.emerald} parts={[{t: "Extracts, Filters & Merges Code Arrays Safely"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Text"]} name="D2" editing={ed} fx={f >= ts - 6 ? <Fx toks={T} n={f >= en ? 999 : n} /> : ""}
        sheet={{cells, widths: W, active: {r: 2, c: 4}, sel: {r1: 2, c1: 4, r2: 2, c2: 4}}}>
        {f < ts - 6 ? <Chip x={60} y={300} w={500} color={C.blue} k={win(f, a(0), ts - 6)} size={15}>Codes like ELC-1001 · keep the prefix before “-”</Chip> : null}
        {ed && n <= 6 ? <AutoComp x={D2.x} y={D2.y + 20} typed={"=TEXTJOIN".slice(0, n)} /> : null}
        {ed && n > 10 ? <ArgTip x={D2.x - 30} y={D2.y + 22} sig={["TEXTJOIN(", "delimiter,", "ignore_empty,", "text1,", "[text2],", "…)"]} cur={Math.min(2, (T.map((x) => x.t).join("").slice(0, n).match(/,/g) ?? []).length)} /> : null}
        <Enter x={D2.x + 50} y={D2.y - 4} k={win(f, en - 4, en + 14, 4)} />
        {f >= en && f < en + 150 ? (() => { const q = rangeRect(2, 7, 9, 8, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={C.emerald} k={win(f, en, en + 150)} fill={0.05} />; })() : null}
        {done ? <Glow x={D2.x} y={D2.y} w={200} h={19} color={C.emerald} k={f < en + 130 ? win(f, en + 40, en + 130) : 0.8} fill={0.1} /> : null}
        {ST.map((s, i) => {
          const k = eo(prog(f, lit[i], 14));
          return (
            <div key={i}>
              <div style={{position: "absolute", left: 30 + i * 300, top: 470, width: 276, height: 78, opacity: 0.35 + 0.65 * k, background: C.slate, border: `2.5px solid ${s[2]}`, borderRadius: 12, boxShadow: `0 0 ${16 * k}px ${rgba(s[2], 0.7)}`, boxSizing: "border-box", padding: "8px 12px", fontFamily: F.ui, color: "#fff"}}>
                <div style={{fontSize: 19, fontWeight: 700, color: s[2]}}>{i + 1}. {s[0]}</div><div style={{fontSize: 13.5, marginTop: 4}}>{s[1]}</div>
              </div>
              {i < 3 ? <div style={{position: "absolute", left: 308 + i * 300, top: 498, width: 24, color: s[2], fontSize: 24, fontWeight: 700, opacity: 0.35 + 0.65 * k}}>→</div> : null}
            </div>
          );
        })}
        {pk > 0 && pk < 1 ? <div style={{position: "absolute", left: 30 + 1146 * eo(pk), top: 500, width: 20, height: 20, borderRadius: 10, background: C.emerald, boxShadow: `0 0 16px ${C.emerald}`}} /> : null}
        {f >= a(3) && f < a(5) ? <Chip x={60} y={300} w={640} h={32} color={C.blue} k={win(f, a(3), a(5))} size={14}>No match → "No Sales" text instead of #CALC! / #N/A ✓</Chip> : null}
        {f >= a(5) ? <Chip x={60} y={300} w={640} h={32} color={C.emerald} k={eo(prog(f, a(5), 14))} size={14}>ELC | ELC | FUR | ELC | FUR · live text dashboard ✓</Chip> : null}
        <Cursor keys={[{f: ts - 36, x: 640, y: 440}, {f: ts - 20, x: D2.x + 30, y: D2.y + 8, click: true}, {f: en + 90, x: 900, y: 440}]} />
      </ExcelApp>
    </Stage>
  );
};
