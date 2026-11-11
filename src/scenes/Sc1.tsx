import {useCurrentFrame} from "remotion";
import {ArgTip, AutoComp, Cap, Cursor, ExcelApp, Glow, Tag, TopBadge, cellRect, eo, prog, rangeRect} from "../kit";
import {C} from "../theme";
import {ITEMS, W, block, res} from "../data";
import {Chip, Enter, FC, Fx, Stage, anchor, nTyped, tlen, win, type Tok} from "./common";

const a = (k: number) => anchor(0, k);
const T: Tok[] = [{t: "=TEXTJOIN(", c: FC.b}, {t: '", "', c: FC.a}, {t: ","}, {t: "TRUE", c: FC.p}, {t: ","}, {t: "A2:A10", c: FC.g}, {t: ")", c: FC.b}];

export const Sc1 = () => {
  const f = useCurrentFrame();
  const ts = a(5), en = a(6) - 12;
  const n = nTyped(f, ts + 8, en - 12, tlen(T));
  const ed = f >= ts - 6 && f < en;
  const k = f >= en + 4 ? Math.min(9, Math.floor((f - en - 4) / 8) + 1) : 0;
  const done = k >= 9;
  const text = ITEMS.slice(0, k).join(", ");
  const cells = [...block(1, 1, [["Items"]], {hdr: true}), ...block(2, 1, ITEMS.map((i) => [i]), {bg: undefined}).map((c) => ({...c, bg: k > 0 && c.r - 2 < k ? "#E4F3FD" : c.r % 2 ? "#EAF4EE" : undefined})), {r: 1, c: 3, t: "TEXTJOIN", bold: true, color: "#fff", bg: C.green},
    ...(k > 0 ? [res(2, 3, text, "#0B6FA8", "#E4F3FD")] : ed ? [{r: 2, c: 3, t: <span style={{color: "#555"}}>=TEXTJOIN(", "…</span>}] : [])];
  const C2 = cellRect(3, 2, W), q = rangeRect(2, 1, 10, 1, W);
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(5)}><TopBadge ar="الدرس 45 من 76 | الوحدة 9 من 14" en="TEXTJOIN & CONCAT Dynamic Engine" /></Cap>,
      <Cap key="1" f={f} a={a(5)} b={9999}><Tag label="Dynamic Array Concatenation" color={C.blue} parts={[{t: '=TEXTJOIN(", ", TRUE, A2:A10)', c: C.blue}, {t: " (Replaces Legacy &)"}]} /></Cap>,
    ]}>
      <ExcelApp file="manzooma_sales_2026.xlsx" sheets={["Text"]} name="C2" editing={ed} fx={f >= ts - 6 ? <Fx toks={T} n={f >= en ? 999 : n} /> : ""}
        sheet={{cells, widths: W, active: {r: 2, c: 3}, sel: {r1: 2, c1: 3, r2: 2, c2: 3}}}>
        {f < ts - 6 ? <Chip x={330} y={230} w={420} color={C.blue} k={win(f, a(0) + 20, ts - 6)} size={15}>A2:A10 · 9 items to join into one cell</Chip> : null}
        {ed ? <Glow x={q.x} y={q.y} w={q.w - 1} h={q.h - 1} color={FC.g} k={0.9} fill={0.05} /> : null}
        {ed && n <= 6 ? <AutoComp x={C2.x} y={C2.y + 20} typed={"=TEXTJOIN".slice(0, n)} /> : null}
        {ed && n > 10 ? <ArgTip x={C2.x - 30} y={C2.y + 22} sig={["TEXTJOIN(", "delimiter,", "ignore_empty,", "text1,", "[text2],", "…)"]} cur={Math.min(3, (T.map((x) => x.t).join("").slice(0, n).match(/,/g) ?? []).length)} /> : null}
        <Enter x={C2.x + 50} y={C2.y - 4} k={win(f, en - 4, en + 14, 4)} />
        {k > 0 && k < 9 ? <Glow x={q.x} y={cellRect(1, 1 + k, W).y} w={q.w - 1} h={19} color={C.blue} k={0.9} fill={0.12} /> : null}
        {done && f < a(7) ? <Glow x={C2.x} y={C2.y} w={620} h={19} color={C.blue} k={win(f, en + 80, a(7))} fill={0.08} /> : null}
        {f >= a(6) && f < a(7) ? <Chip x={60} y={420} w={640} h={34} color={C.red} k={win(f, a(6), a(7))} size={15}>{'Legacy: =A2&", "&A3&", "&A4&", "&A5&…  (CONCATENATE needs every cell) ✗'}</Chip> : null}
        {f >= a(7) ? <Chip x={60} y={420} w={640} h={34} color={C.blue} k={eo(prog(f, a(7), 14))} size={15}>TEXTJOIN: one range · one delimiter · one formula ✓</Chip> : null}
        <Cursor keys={[{f: ts - 36, x: 640, y: 440}, {f: ts - 20, x: C2.x + 30, y: C2.y + 8, click: true}, {f: en + 130, x: 900, y: 500}]} />
      </ExcelApp>
    </Stage>
  );
};
