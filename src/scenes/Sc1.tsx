import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, SpillBox, Tag, TopBadge, cellRect, eo, prog, rangeRect, rgba} from "../kit";
import {C} from "../theme";
import {ALEX, CAIRO, GIZA, HDR, block, int} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(0, k);
const W = [70, 56, 70, 20, 70, 56, 70, 20, 70, 56, 70, 20, 70, 56, 70, 56, 56, 56, 56];
const V: Tok[] = [{t: "=VSTACK(", c: FC.g}, {t: "tbl_Cairo", c: FC.b}, {t: ","}, {t: "tbl_Alex", c: FC.c}, {t: ","}, {t: "tbl_Giza", c: FC.a}, {t: ")", c: FC.g}];
const H: Tok[] = [{t: "=HSTACK(", c: FC.b}, {t: "tbl_Cairo[Revenue]", c: FC.g}, {t: ","}, {t: "tbl_Alex[Revenue]", c: FC.c}, {t: ")", c: FC.b}];
const back = (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
const NAMES: [string, string][] = [["VSTACK", C.emerald], ["HSTACK", C.blue], ["CHOOSECOLS", C.amber], ["TAKE", C.amber], ["DROP", C.purple]];

export const Sc1 = () => {
  const f = useCurrentFrame();
  const t1 = a(6) + 25, e1 = a(7) + 10, t2 = a(8), e2 = a(9) + 70;
  const n1 = nTyped(f, t1, a(7) - 15, tlen(V)), n2 = nTyped(f, t2, a(9) + 45, tlen(H));
  const ed1 = f >= t1 && f < e1, ed2 = f >= t2 && f < e2;
  const sp = clampT(f, e1, 40), sp2 = f >= e2;
  const hdr = (r0: number, c0: number, rows: (string | number)[][]) => block(r0, c0, [HDR, ...rows], {hdr: true});
  const stack = [...CAIRO, ...ALEX, ...GIZA];
  const cells = [...hdr(1, 1, CAIRO), ...hdr(1, 5, ALEX), ...hdr(1, 9, GIZA),
    ...(f >= e1 + 36 ? block(2, 13, stack, {color: C.green, bg: "#E8F7F0"}) : ed1 ? [{r: 2, c: 13, t: <span style={{color: "#555"}}>=VSTACK(tbl…</span>}] : []),
    ...(sp2 ? block(12, 13, CAIRO.map((r, i) => [r[2], ALEX[i][2]]), {color: C.blue, bg: "#E6F2FB"}) : ed2 ? [{r: 12, c: 13, t: <span style={{color: "#555"}}>=HSTACK(tbl…</span>}] : [])];
  const act = f >= t2 ? {r: 12, c: 13} : {r: 2, c: 13};
  const tint = (r1: number, c1: number, r2: number, c2: number, col: string, k: number) => { const q = rangeRect(r1, c1, r2, c2, W); return <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={col} k={k} fill={0.06} />; };
  const ghost = (i: number, srcC: number, dstR: number) => {
    if (sp <= 0 || sp >= 1) return null;
    const s = rangeRect(2, srcC, 4, srcC + 2, W), d = rangeRect(dstR, 13, dstR + 2, 15, W);
    const t = Math.min(1, Math.max(0, (sp * 40 - i * 6) / 28)), e = back(t);
    return <div key={i} style={{position: "absolute", left: s.x + (d.x - s.x) * e, top: s.y + (d.y - s.y) * e, width: s.w, height: s.h, background: rgba(C.emerald, 0.35), border: `2px solid ${C.emerald}`, boxShadow: `0 0 14px ${C.emerald}`, boxSizing: "border-box"}} />;
  };
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(5)}><TopBadge ar="الدرس 18 من 76 | الوحدة 4 من 14" en="Dynamic Array Reshaping Engine" /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="VSTACK & HSTACK" color={C.emerald} parts={[{t: "=VSTACK(array1, array2)", c: C.emerald}, {t: " Stack Vertically | "}, {t: "HSTACK", c: C.blue}, {t: " Side-by-Side"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Branches"]} name={`${f >= t2 ? "M12" : "M2"}`} editing={ed1 || ed2} fx={ed2 || (f >= e2) ? <Fx toks={H} n={f >= e2 ? 999 : n2} /> : f >= t1 ? <Fx toks={V} n={f >= e1 ? 999 : n1} /> : ""}
        sheet={{cells, widths: W, active: act, sel: {r1: act.r, c1: act.c, r2: act.r, c2: act.c}}}>
        {f < a(6) ? <Chip x={40} y={296} w={470} color={C.blue} k={win(f, a(0) + 40, a(6))} size={15}>tbl_Cairo · tbl_Alex · tbl_Giza  (3 branch tables)</Chip> : null}
        {NAMES.map(([n, c], i) => { const k = eo(prog(f, a(5) + i * 14, 12)) * (1 - prog(f, a(6) - 10, 10)); return k > 0 ? <Chip key={n} x={40 + i * 96 + (i > 1 ? 20 : 0)} y={340} w={n === "CHOOSECOLS" ? 120 : 90} color={c} k={k} size={14}>{n}</Chip> : null; })}
        {f >= a(6) && f < a(7) ? <Chip x={40} y={390} w={330} color={C.red} k={win(f, a(6), a(7) + 20)} size={15}>Copy-paste / VBA ✗  →  one formula ✓</Chip> : null}
        {ed1 ? <div>{tint(1, 1, 4, 3, FC.b, 0.9)}{tint(1, 5, 4, 7, FC.c, 0.9)}{tint(1, 9, 4, 11, FC.a, 0.9)}</div> : null}
        {ed1 && n1 <= 5 ? <AutoComp x={cellRect(13, 2, W).x} y={cellRect(13, 2, W).y + 20} typed={"=VSTACK".slice(0, n1)} /> : null}
        {ed1 && n1 > 8 ? <ArgTip x={cellRect(13, 2, W).x} y={cellRect(13, 2, W).y + 22} sig={["VSTACK(", "array1,", "[array2],", "…)"]} cur={Math.min(2, (V.map((k) => k.t).join("").slice(0, n1).match(/,/g) ?? []).length)} /> : null}
        {ed2 && n2 > 8 ? <ArgTip x={cellRect(13, 12, W).x} y={cellRect(13, 12, W).y + 22} sig={["HSTACK(", "array1,", "[array2],", "…)"]} cur={Math.min(1, (H.map((k) => k.t).join("").slice(0, n2).match(/,/g) ?? []).length)} /> : null}
        <Enter x={cellRect(13, 2, W).x + 80} y={cellRect(13, 2, W).y - 4} k={win(f, e1 - 4, e1 + 14, 4)} />
        <Enter x={cellRect(13, 12, W).x + 80} y={cellRect(13, 12, W).y - 4} k={win(f, e2 - 4, e2 + 14, 4)} />
        {ghost(0, 1, 2)}{ghost(1, 5, 5)}{ghost(2, 9, 8)}
        {f >= e1 + 36 ? <div><SpillBox r1={2} c1={13} r2={10} c2={15} widths={W} k={eo(prog(f, e1 + 36, 10))} />{f < e1 + 120 ? <Glow x={rangeRect(2, 13, 10, 15, W).x} y={rangeRect(2, 13, 10, 15, W).y} w={rangeRect(2, 13, 10, 15, W).w - 1} h={rangeRect(2, 13, 10, 15, W).h - 1} color={C.emerald} k={win(f, e1 + 36, e1 + 120)} fill={0.1} /> : null}</div> : null}
        {sp2 ? <div><SpillBox r1={12} c1={13} r2={14} c2={14} widths={W} k={eo(prog(f, e2, 10))} color={C.blue} />{f < e2 + 90 ? <Glow x={rangeRect(12, 13, 14, 14, W).x} y={rangeRect(12, 13, 14, 14, W).y} w={rangeRect(12, 13, 14, 14, W).w - 1} h={rangeRect(12, 13, 14, 14, W).h - 1} color={C.blue} k={win(f, e2, e2 + 90)} fill={0.1} /> : null}</div> : null}
        {f >= e1 + 60 && f < a(8) ? <Chip x={cellRect(13, 2, W).x - 250} y={cellRect(13, 2, W).y + 150} w={240} color={C.emerald} k={win(f, e1 + 60, a(8))} size={14}>9 rows × 3 cols · one formula</Chip> : null}
        <Cursor keys={[{f: a(6) - 6, x: 640, y: 420}, {f: a(6) + 12, x: cellRect(13, 2, W).x + 20, y: cellRect(13, 2, W).y + 6, click: true}, {f: t2 - 14, x: cellRect(13, 12, W).x + 20, y: cellRect(13, 12, W).y + 6, click: true}, {f: e2 + 40, x: 900, y: 460}]} />
      </ExcelApp>
    </Stage>
  );
};
function clampT(f: number, s: number, d: number) { return Math.min(1, Math.max(0, (f - s) / d)); }
void int;
