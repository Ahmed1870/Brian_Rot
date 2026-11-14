import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6, SCENES } from "./sync";
import { ALL_FLAGS, BIG_N, CTRL, MCODE, NO_FLAGS, bigRaw, bigStats, num, pview, smallRaw, stepsOf, type Flags, type PView } from "./data";
import { F, camAt, prog, ribbonPos, stack, typed } from "./kit";
import { KeyCaps, Logo, SceneFx, TopStrip } from "./kit_ui";
import { CtxMenu, PQGrid, PQStage, PQ_BODY, PQ_HEAD, PQ_LEFT, ReplaceErrorsDialog, ReplaceValuesDialog, SplitDialog, pqColX, type PQGridProps, type PQRow } from "./kit_pq";
import { C, WIN_H, WIN_W, XLSX_NAME } from "./theme";

const badge = "Lesson 48 / 76 · Unit 10 / 14";
const win = (a: number, b: number, f: number, r = 8): number => prog(f, a, r) * (1 - prog(f, b, r));
const D = SCENES.map((s) => s.end - s.start);
const sl = (d: number, f: number, a: string, b: string, ca: string, cb: string, ar = false): React.ReactNode => (
  <TopStrip f={f} badge={badge} lines={[{ from: 60, to: Math.round(d * 0.45), text: a, color: ca, ar }, { from: Math.round(d * 0.55), to: Math.round(d * 0.95), text: b, color: cb }]} />
);
const Chip: React.FC<{ x: number; y: number; text: string; color: string; t: number }> = ({ x, y, text, color, t }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `translateY(${(1 - t) * 8}px)`, background: C.slate, color: C.text, border: `2px solid ${color}`, borderRadius: 8, padding: "6px 12px", boxShadow: `0 0 14px ${color}88`, fontFamily: F.ui, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", zIndex: 45 }}>{text}</div>
);
const Seal: React.FC<{ t: number; line1: string; line2: string }> = ({ t, line1, line2 }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: 1200, top: 770, width: 330, opacity: t, transform: `scale(${0.7 + 0.3 * t})`, zIndex: 60, textAlign: "center" }}>
      <div style={{ width: 110, height: 110, margin: "0 auto", borderRadius: 55, background: `radial-gradient(circle, ${C.green}33, ${C.slate})`, border: `4px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58, color: C.green }}>✓</div>
      <div style={{ marginTop: 10, background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "8px 12px", fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.text }}>{line1}</div>
      <div style={{ marginTop: 8, fontFamily: F.ar, fontWeight: 600, fontSize: 19, color: C.green, background: C.slate, borderRadius: 10, padding: "4px 10px" }}>{line2}</div>
    </div>
  )
);
const rgba = (c: string, a: number): string => `rgba(${c === "red" ? "239,68,68" : c === "green" ? "16,185,129" : c === "purple" ? "168,85,247" : c === "amber" ? "245,158,11" : "56,189,248"},${Math.max(0, Math.min(1, a))})`;
const rowsOf = (v: PView, hs?: (i: number, dup: boolean) => number): PQRow[] => { const h = v.rows.map((r, i) => (hs ? hs(i, r.dup) : 1)); const sl2 = stack(h, 0); return v.rows.map((r, i) => ({ id: r.key, cells: r.cells, h: h[i], slot: sl2[i] })); };
const stepList = (flags: Flags, times: Record<string, number>, f: number): { name: string; t?: number }[] => stepsOf(flags).map((n) => ({ name: n, t: times[n] !== undefined ? prog(f, times[n], 12) : 1 }));
const camP = { z: 1, cx: 768, cy: 403 };
const camD = { z: 1.3, cx: 768, cy: 380 };
const FREE_X = 880;
const rowIdx = (id: string): number => Number(id.slice(1));

// ================= SC01: dirty vs clean =================
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const raw = smallRaw();
  const dirty = pview(raw, NO_FLAGS), clean = pview(raw, ALL_FLAGS);
  const scan = prog(f, A.tools, 200);
  const pulse = 0.8 + 0.2 * Math.sin(f / 9);
  const reds = win(A.hours, A.tools + 30, f, 10) * pulse;
  const all = stepsOf(ALL_FLAGS);
  const steps = all.map((n, i) => ({ name: n, t: i < 2 ? 1 : prog(f, A.tools + (i - 1) * 18, 12) })).filter((s) => (s.t ?? 1) > 0.02);
  const gh = WIN_H - PQ_BODY - 24 - PQ_HEAD;
  const cleanGrid = { cols: clean.cols, rows: rowsOf(clean), q: clean.q, clip: scan };
  return (
    <SceneFx f={f} dur={D[0]} kind="fade">
      <PQStage cam={camAt(f, [{ f: 0, ...camP }, { f: 1200, ...camP }])} tab="pqhome" formula={MCODE[steps[steps.length - 1].name]} steps={steps} sel={steps.length - 1} ncols={scan > 0.5 ? 7 : 6} nrows="999+"
        grid={{ cols: dirty.cols, rows: rowsOf(dirty), q: dirty.q, cellFx: (id, c) => { const r = raw[rowIdx(id)]; if (!r) return undefined; if ((c === 1 && (r.cust.trim() !== r.cust || r.cust.includes(CTRL))) || (c === 4 && (r.amt === null || r.amt === "N/A"))) return rgba("red", 0.28 * reds); return undefined; } }}
        extraGrid={scan > 0.01 ? <PQGridClean g={cleanGrid} /> : null}>
        {scan > 0 && scan < 1 ? <div style={{ position: "absolute", left: PQ_LEFT, top: PQ_BODY + PQ_HEAD + scan * gh, width: WIN_W - PQ_LEFT - 250, height: 3, background: C.blue, boxShadow: `0 0 18px 4px ${C.blue}`, zIndex: 20 }} /> : null}
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Power Query Editor" color={C.blue} t={win(A.pq, 648, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Manual cleanup = hours of work" color={C.red} t={win(A.hours, 720, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 110} text="Spaces · nulls · errors · duplicates" color={C.red} t={win(A.manual, 805, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 160} text="Complex formulas for dates & errors" color={C.amber} t={win(A.formulas, 805, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Direct tools: clean · fix types · split columns" color={C.blue} t={win(A.tools, 1020, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 110} text="Every action is recorded in Applied Steps →" color={C.green} t={win(A.tools + 60, 1080, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Non-destructive: the source table never changes" color={C.green} t={prog(f, A.end - 10, 12)} />
      </PQStage>
      {sl(D[0], f, "الدرس 48 من 76 | الوحدة 10 من 14 → Data Cleaning & Transformation Engine", "Automated Data Scrubbing → Handle Nulls, Errors, Types & Delimiters (Non-Destructive)", C.blue, C.blue, true)}
    </SceneFx>
  );
};
const PQGridClean: React.FC<{ g: PQGridProps }> = ({ g }) => <PQGrid {...g} />;

// ================= SC02: types, nulls, fill down, errors =================
const TYPE_ITEMS = ["Decimal Number", "Currency", "Whole Number", "Percentage", "Date/Time", "Date", "Time", "Date/Time/Timezone", "Duration", "Text", "True/False", "Binary", "Using Locale..."].map((l) => ({ label: l, id: l === "Decimal Number" ? "dec" : l === "Date" ? "date" : l }));
const HDR_MENU = [{ label: "Copy" }, { label: "Remove Columns" }, { label: "Remove Other Columns" }, { label: "Duplicate Column" }, { label: "Add Column From Examples..." }, { sep: true, label: "" }, { label: "Remove Duplicates" }, { label: "Remove Errors" }, { sep: true, label: "" }, { label: "Change Type", arrow: true }, { label: "Transform", arrow: true }, { label: "Replace Values...", id: "rv" }, { label: "Replace Errors..." }, { label: "Split Column", arrow: true }, { label: "Group By..." }, { label: "Fill", arrow: true }];
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const raw = smallRaw();
  const fl: Flags = { ...NO_FLAGS, amtType: f >= 302, dateType: f >= 362, nullFix: f >= 572, fill: f >= 668, errFix: f >= 912 };
  const v = pview(raw, fl, true);
  const tab = f >= 595 ? "pqtransform" : "pqhome";
  const times = { "Changed Type1": 302, "Replaced Value": 572, "Filled Down": 668, "Replaced Errors": 912 };
  const steps = stepList(fl, times, f);
  const last = steps[steps.length - 1].name;
  const sel = f >= 812 && f < 912 ? [4] : f >= 600 && f < 700 ? [2] : f >= 440 && f < 580 ? [4] : [];
  const cols = v.cols;
  const hx = (c: number): number => pqColX(cols, c) + 4;
  const fp = ribbonPos("pqtransform", "tfill"), ep = ribbonPos("pqtransform", "treplacee");
  const cam = camAt(f, [{ f: 0, ...camP }, { f: 476, ...camP }, { f: 496, ...camD }, { f: 576, ...camD }, { f: 596, ...camP }, { f: 846, ...camP }, { f: 862, ...camD }, { f: 918, ...camD }, { f: 936, ...camP }, { f: 1350, ...camP }]);
  const glowId = f < 595 ? "dtype" : f < 700 ? "tfill" : "treplacee";
  return (
    <SceneFx f={f} dur={D[1]} kind="left">
      <PQStage cam={cam} tab={tab} glow={{ id: glowId, color: C.green, t: f >= 612 && f < 668 ? win(612, 668, f, 8) : f >= 826 && f < 860 ? win(826, 860, f, 8) : 0 }} formula={MCODE[last]} steps={steps} sel={steps.length - 1} ncols={cols.length} nrows={String(v.rows.length)}
        grid={{ cols, rows: rowsOf(v), q: v.q, selCols: sel, typeGlow: { c: f < 340 ? 4 : 5, color: C.green, t: win(A.icon, 302, f, 8) + win(326, 362, f, 8) },
          cellFx: (id, c) => { const i = v.rows.findIndex((x) => x.key === id); if (i < 0) return undefined; const row = v.rows[i];
            if (c === 2 && row.filled[2]) return rgba("purple", 0.4 * win(668 + i * 3, 668 + i * 3 + 55, f, 8));
            if (c === 4 && raw[Number(id.slice(1))].amt === null) return rgba("green", 0.4 * win(572, 640, f, 8));
            if (c === 4 && raw[Number(id.slice(1))].amt === "N/A" && fl.errFix) return rgba("green", 0.4 * win(912, 980, f, 8));
            return undefined; } }}>
        <CtxMenu x={hx(4) - 6} y={PQ_BODY + 36} t={win(255, 302, f, 8)} items={TYPE_ITEMS} hover={f >= 276 ? "dec" : undefined} w={210} />
        <CtxMenu x={hx(5) - 6} y={PQ_BODY + 36} t={win(330, 362, f, 8)} items={TYPE_ITEMS} hover={f >= 346 ? "date" : undefined} w={210} />
        <CtxMenu x={hx(4) - 6} y={PQ_BODY + 36} t={win(452, 490, f, 8)} items={HDR_MENU} hover={f >= 470 ? "rv" : undefined} w={230} />
        <CtxMenu x={fp.x - 20} y={fp.y + 30} t={win(620, 668, f, 8)} items={[{ label: "Down", id: "down" }, { label: "Up" }]} hover={f >= 640 ? "down" : undefined} w={120} />
        <CtxMenu x={ep.x - 20} y={ep.y + 30} t={win(828, 862, f, 8)} items={[{ label: "Replace Errors...", id: "re" }]} hover={f >= 842 ? "re" : undefined} w={170} />
        <ReplaceValuesDialog x={560} y={230} t={win(492, 576, f, 10)} find={typed("null", f, 498, 0.2)} repl={typed("0", f, 524, 0.2)} ok={f >= 560 && f < 572 ? 1 : 0} hi={C.green} />
        <ReplaceErrorsDialog x={560} y={250} t={win(864, 920, f, 10)} val={typed("0", f, 872, 0.2)} ok={f >= 900 && f < 912 ? 1 : 0} hi={C.green} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Data Types: ABC → 1.2 Decimal  ·  ABC → Date" color={C.green} t={win(A.types, 440, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 110} text="Converting 'N/A' to a number creates Error cells" color={C.amber} t={win(318, 440, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="null = an empty value → Replace Values → 0" color={C.green} t={win(A.null, 600, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Fill Down copies the value above into empty cells" color={C.purple} t={win(A.fill, 800, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Replace Errors → a safe value keeps the query running" color={C.green} t={win(A.errors, 1010, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 110} text="Quality bars = 100% valid" color={C.green} t={prog(f, A.safe, 12)} />
      </PQStage>
      {sl(D[1], f, "Data Type Optimization → Convert Header Types (Text, Whole Number, Date)", "Null & Error Mitigation → Replace Values & Fill Down Eliminates Missing Gaps", C.green, C.green)}
    </SceneFx>
  );
};

// ================= SC03: remove duplicates & split =================
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const raw = smallRaw();
  const base: Flags = { ...NO_FLAGS, amtType: true, dateType: true, nullFix: true, fill: true, errFix: true };
  const fl: Flags = { ...base, dedupe: f >= 482, split: f >= 782 };
  const v = pview(raw, f >= 482 ? fl : { ...fl, dedupe: false }, f < 482);
  const times = { "Removed Duplicates": 482, "Split Column by Delimiter": 782, "Changed Type2": 782 };
  const steps = stepList(fl, times, f);
  const last = steps[steps.length - 1].name;
  const hs = (_i: number, dup: boolean): number => (f < 482 && dup ? 1 - prog(f, 452, 28) : 1);
  const rp = ribbonPos("pqhome", "removerows"), sp = ribbonPos("pqhome", "splitcol");
  const cols = v.cols;
  const cam = camAt(f, [{ f: 0, ...camP }, { f: 686, ...camP }, { f: 704, ...camD }, { f: 786, ...camD }, { f: 808, ...camP }, { f: 1230, ...camP }]);
  const nDup = smallRaw().length - pview(raw, ALL_FLAGS).rows.length;
  const hover = f < 330 ? "top" : f < 393 ? "blank" : "dups";
  return (
    <SceneFx f={f} dur={D[2]} kind="down">
      <PQStage cam={cam} tab="pqhome" glow={{ id: f < 640 ? "removerows" : "splitcol", color: C.amber, t: f < 640 ? win(A.home, 432, f, 10) : win(636, 792, f, 10) }} formula={MCODE[last]} steps={steps} sel={steps.length - 1} ncols={cols.length} nrows={String(v.rows.length)}
        grid={{ cols, rows: rowsOf(v, hs), q: v.q, selCols: f >= 640 && f < 790 ? [3] : [], colGlow: f >= 782 ? [{ c: 3, color: C.amber, t: win(782, 880, f, 8) }, { c: 4, color: C.amber, t: win(782, 880, f, 8) }] : [],
          cellFx: (id, c) => { const i = v.rows.findIndex((x) => x.key === id); if (i < 0) return undefined; if (v.rows[i].dup && f >= 418 && f < 482) return rgba("amber", 0.5 * prog(f, 418, 12)); if (f >= 782 && (c === 3 || c === 4)) return rgba("amber", 0.35 * win(782, 860, f, 8)); return undefined; } }}>
        <CtxMenu x={rp.x - 40} y={rp.y + 34} t={win(A.remove, 428, f, 8)} hover={hover} w={240}
          items={[{ label: "Remove Top Rows...", id: "top" }, { label: "Remove Bottom Rows..." }, { label: "Remove Alternate Rows..." }, { label: "Remove Duplicates", id: "dups" }, { label: "Remove Blank Rows", id: "blank" }, { label: "Remove Errors" }]} />
        <CtxMenu x={sp.x - 40} y={sp.y + 34} t={win(642, 694, f, 8)} hover={f >= 656 ? "bd" : undefined} w={260}
          items={[{ label: "By Delimiter...", id: "bd" }, { label: "By Number of Characters..." }, { label: "By Positions..." }, { label: "By Lowercase to Uppercase" }, { label: "By Uppercase to Lowercase" }, { label: "By Digit to Non-Digit" }, { label: "By Non-Digit to Digit" }]} />
        <SplitDialog x={520} y={200} t={win(696, 792, f, 10)} delim={typed("-", f, 702, 0.2)} ok={f >= 772 && f < 782 ? 1 : 0} hi={f >= A.dash ? C.amber : undefined} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Reduce Rows: remove what you don't need" color={C.amber} t={win(A.rows, 277, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Remove Rows ▾ → Top · Bottom · Alternate · Duplicates · Blank · Errors" color={C.amber} t={win(A.remove + 8, 330, f, 10)} />
        <Chip x={FREE_X - 120} y={PQ_BODY + 60} text="Blank Rows = rows where ALL columns are empty — run it BEFORE replacing nulls" color={C.amber} t={win(330, 393, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text={`Remove Duplicates → ${nDup} repeated rows removed (${smallRaw().length} → ${smallRaw().length - nDup})`} color={C.amber} t={win(486, 640, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Item = product code + branch in ONE column" color={C.purple} t={win(A.split, 700, f, 10)} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Two independent columns: Item.1 · Item.2" color={C.amber} t={prog(f, A.cols, 12)} />
      </PQStage>
      {sl(D[2], f, "Row Purging Engine → Home → Remove Rows (Remove Top Rows, Remove Duplicates)", "Delimiter Column Splitting → Split Column → By Delimiter Parses Complex Strings", C.amber, C.purple)}
    </SceneFx>
  );
};

// ================= SC04: Trim & Clean =================
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const raw = smallRaw();
  const base: Flags = { ...NO_FLAGS, amtType: true, dateType: true, nullFix: true, fill: true, errFix: true, dedupe: true, split: true };
  const fl: Flags = { ...base, trim: f >= 470, clean: f >= 645 };
  const v = pview(raw, fl);
  const times = { "Trimmed Text": 470, "Cleaned Text": 645 };
  const steps = stepList(fl, times, f);
  const last = steps[steps.length - 1].name;
  const fp = ribbonPos("pqtransform", "tformat");
  const sA = raw.find((r) => r.cust.trim() !== r.cust && !r.cust.includes(CTRL) && r.cust.startsWith(" ") && r.cust.endsWith(" "));
  const sB = raw.find((r) => r.cust.includes(CTRL));
  const fmtItems = [{ label: "lowercase" }, { label: "UPPERCASE" }, { label: "Capitalize Each Word" }, { label: "Trim", id: "trim" }, { label: "Clean", id: "clean" }, { label: "Add Prefix..." }, { label: "Add Suffix..." }];
  const cols = v.cols;
  return (
    <SceneFx f={f} dur={D[3]} kind="expand">
      <PQStage cam={camAt(f, [{ f: 0, ...camP }, { f: 1320, ...camP }])} tab="pqtransform" hotTab={{ tab: "Transform", color: C.green, t: win(A.tab - 10, 420, f, 10) }} glow={{ id: "tformat", color: C.green, t: win(A.format - 6, 650, f, 10) }}
        formula={MCODE[last]} formulaGlow={f >= A.mcode && f < 910 ? C.green : undefined} stepsGlow={f >= A.steps && f < 1100 ? C.green : undefined} steps={steps} sel={steps.length - 1} ncols={cols.length} nrows={String(v.rows.length)}
        grid={{ cols, rows: rowsOf(v), q: v.q, selCols: f >= 300 ? [1] : [], cellFx: (id, c) => { const i = Number(id.slice(1)); if (c !== 1) return undefined; const k = v.rows.findIndex((x) => x.key === id); if (f >= 470 && f < 560) return rgba("green", 0.4 * win(470 + k * 3, 470 + k * 3 + 40, f, 8)); if (f >= 645 && f < 740 && raw[i].cust.includes(CTRL)) return rgba("green", 0.5 * win(645, 735, f, 8)); return undefined; } }}>
        <CtxMenu x={fp.x - 30} y={fp.y + 34} t={Math.max(win(A.format, 470, f, 8), win(592, 650, f, 8))} hover={f < 560 ? (f >= 440 ? "trim" : undefined) : f >= 616 ? "clean" : undefined} w={210} items={fmtItems} />
        <Chip x={FREE_X} y={PQ_BODY + 60} text="Direct text cleaning — no formulas" color={C.green} t={win(A.direct, 300, f, 10)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 60} text={sA ? `Trim:  "${sA.cust}"  →  "${sA.cust.trim()}"` : "Trim"} color={C.green} t={win(A.trim, 600, f, 10)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 110} text="Trim removes leading & trailing spaces" color={C.green} t={win(A.spaces, 600, f, 10)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 60} text={sB ? `Clean:  "${sB.cust.trim()}"  →  "${sB.cust.split(CTRL).join("").trim()}"` : "Clean"} color={C.green} t={win(A.clean, 800, f, 10)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 110} text="□ = a non-printable character (Text.Clean removes it)" color={C.green} t={win(A.clean + 12, 800, f, 10)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 60} text="M code written for you: Text.Trim · Text.Clean" color={C.green} t={win(A.mcode, 1000, f, 10)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 110} text="Applied Steps = a repeatable recipe: Refresh → same cleaning on new data" color={C.green} t={win(A.steps + 20, 1250, f, 10)} />
      </PQStage>
      {sl(D[3], f, "Direct Text Sanitization → Transform → Format → Trim & Clean", "Automatic M-Code Generation → Executes Text.Trim & Text.Clean Instantly", C.green, C.green)}
    </SceneFx>
  );
};

// ================= SC05: 50,000 rows =================
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const raw = bigRaw(25);
  const st = React.useMemo(() => bigStats(), []);
  const T0 = 525, dt = 16;
  const fl: Flags = { ...NO_FLAGS, amtType: f >= T0, dateType: f >= T0, nullFix: f >= T0 + dt, fill: f >= T0 + 2 * dt, errFix: f >= T0 + 3 * dt, dedupe: f >= T0 + 4 * dt, split: f >= T0 + 5 * dt, trim: f >= T0 + 6 * dt, clean: f >= T0 + 7 * dt };
  const v = pview(raw, fl);
  const times: Record<string, number> = { "Changed Type1": T0, "Replaced Value": T0 + dt, "Filled Down": T0 + 2 * dt, "Replaced Errors": T0 + 3 * dt, "Removed Duplicates": T0 + 4 * dt, "Split Column by Delimiter": T0 + 5 * dt, "Changed Type2": T0 + 5 * dt, "Trimmed Text": T0 + 6 * dt, "Cleaned Text": T0 + 7 * dt };
  const steps = stepList(fl, times, f);
  const last = steps[steps.length - 1].name;
  const count = Math.round(BIG_N * prog(f, A.file, 130));
  const cols = v.cols;
  return (
    <SceneFx f={f} dur={D[4]} kind="expand">
      <PQStage cam={camAt(f, [{ f: 0, ...camP }, { f: 1200, ...camP }])} tab="pqtransform" title="manzooma_sales_2026 - Power Query Editor" formula={MCODE[last]} steps={steps} sel={steps.length - 1} ncols={cols.length} nrows="999+"
        grid={{ cols, rows: rowsOf(v), q: v.q, cellFx: (id, c) => { const k = Number(id.slice(1)); const r = raw[k]; if (!r) return undefined; const bad = (c === 1 && !fl.trim && (r.cust.trim() !== r.cust || r.cust.includes(CTRL))) || (c === 4 && (r.amt === null || r.amt === "N/A") && !(fl.nullFix && fl.errFix)); return bad ? rgba("red", 0.22 * win(A.rows, T0 + 7 * dt + 20, f, 10)) : undefined; } }}>
        <Chip x={FREE_X - 60} y={PQ_BODY + 60} text={`${num(st.nulls)} nulls  ·  ${num(st.errs)} errors  ·  ${num(st.dups)} duplicates  ·  messy text`} color={C.red} t={win(A.rows, T0, f, 10)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 60} text="Same steps as the lesson — recorded once" color={C.blue} t={win(T0, T0 + 8 * dt + 60, f, 10)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 110} text={`${num(BIG_N)} rows in  →  ${num(st.clean)} clean rows out`} color={C.green} t={prog(f, A.ms - 40, 12)} />
        <Chip x={FREE_X - 60} y={PQ_BODY + 160} text="Refresh re-runs every step on new data" color={C.blue} t={prog(f, A.ms, 12)} />
        <div style={{ position: "absolute", left: FREE_X - 60, top: PQ_BODY + 250, width: 330, opacity: prog(f, A.days + 30, 14), background: "#fff", border: `2px solid ${C.green}`, borderRadius: 8, padding: "10px 14px", boxShadow: `0 0 16px ${C.green}`, zIndex: 45, fontFamily: F.ui, fontSize: 14, color: C.ink }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Queries & Connections</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: C.xGreen, fontWeight: 700 }}>✓</span>Sales · {num(st.clean)} rows loaded</div>
        </div>
      </PQStage>
      <div style={{ position: "absolute", right: 28, top: 92, background: "rgba(15,23,42,.92)", border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "8px 18px", fontFamily: F.mono, fontSize: 19, color: C.text, opacity: prog(f, A.file, 12), zIndex: 60 }}>manzooma_sales_2026 · <span style={{ color: C.blue, fontWeight: 700 }}>{num(count)}</span> rows</div>
      <Seal t={prog(f, A.days + 10, 26)} line1="Enterprise Data Cleaning" line2={`${num(BIG_N)} صف · تنظيف آلي`} />
      <KeyCaps keys={["Refresh"]} f={f} from={A.ms + 40} hold={40} accent={C.blue} />
      {sl(D[4], f, "Enterprise Data Cleaning → Scrub & Transform 50,000 Sales Records", "Repeatable Power Query Pipeline → Refresh Applies Every Step Again", C.blue, C.green)}
    </SceneFx>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, 60, 110);
  const pct = (48 / 76) * 100;
  const skills = ["Data Types · Replace Values · Fill Down", "Remove Duplicates · Split Column by Delimiter", "Transform → Format → Trim & Clean", "Applied Steps = a repeatable M-code recipe"];
  const fadeOut = 1 - prog(f, 880, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28 };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 700, padding: 44, boxSizing: "border-box", opacity: prog(f, 20, 20), transform: `translateY(${(1 - prog(f, 20, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 48 · Data Cleaning in Power Query</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8, direction: "rtl", textAlign: "left" }}>الدرس الثامن والأربعون | الوحدة العاشرة</div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Course progress · Lesson 48 of 76</span><span style={{ color: C.green }}>{(pr * pct).toFixed(1)}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 10, fontFamily: F.ui, fontSize: 20, color: "#94A3B8" }}>Unit 10 of 14 · Power Query & ETL · Lesson 3 of the unit</div>
        <div style={{ marginTop: 28 }}>
          {skills.map((s, i) => { const t = prog(f, 110 + i * 28, 16); return <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, opacity: t, transform: `translateX(${(1 - t) * 30}px)`, fontFamily: F.ui, fontSize: 28, color: C.text }}><span style={{ color: C.green, fontWeight: 700, fontSize: 34 }}>✓</span>{s}</div>; })}
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 18, opacity: prog(f, A.sheet, 16) }}>
          <div style={{ background: C.slate, border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "10px 18px", fontFamily: F.mono, fontSize: 21, color: C.text }}>{XLSX_NAME}</div>
          <div style={{ background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "10px 18px", fontFamily: F.mono, fontSize: 21, color: C.green, opacity: prog(f, A.link, 16) }}>solutions.gomaaintelligence.me</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 200, width: 680, display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ ...card, height: 230, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, opacity: prog(f, 190, 20), transform: `scale(${0.85 + 0.15 * prog(f, 190, 20)})` }}>
          <div style={{ width: 130, height: 130, borderRadius: 65, background: `radial-gradient(circle, ${C.green}, #047857)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, color: C.slate, boxShadow: `0 0 40px ${C.green}88` }}>✓</div>
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.green, lineHeight: "38px" }}>Data Cleaning Engine<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>Lesson 48 mastered</div></div>
        </div>
        <div style={{ ...card, height: 440, padding: 34, boxSizing: "border-box", opacity: prog(f, A.l49 - 20, 20), transform: `translateY(${(1 - prog(f, A.l49 - 20, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · LESSON 49 · UNIT 10</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 34, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "48px" }}>الدرس 49: دمج الاستعلامات وتجميع مصادر الملفات</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#CBD5E1", marginTop: 8 }}>Merge Queries & Append Queries</div>
          <div style={{ marginTop: 22, display: "flex", gap: 12 }}>{["Merge", "Append", "Combine Files"].map((t) => <div key={t} style={{ flex: 1, height: 56, borderRadius: 8, background: "#fff", border: `2px solid ${C.xGreen}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontSize: 20, fontWeight: 700, color: C.ink }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
