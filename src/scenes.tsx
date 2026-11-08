import React from "react";
import { useCurrentFrame } from "remotion";
import { A1, A2, A3, A4, A5, A6 } from "./sync";
import { BIG_N, BRANCHES, SMALL, WIDTHS, bigRows, bigSorted, cellsOf, fillOf, headCells, num, sortRows, trendOf, type Row } from "./data";
import { Excel, F, buildCols, camAt, cellCenter, colX, path, prog, ribbonPos, slotY, stack, typed, lerp, type Cam, type FBtn, type GRow } from "./kit";
import { Cursor, FilterMenu, Logo, FindDialog, KeyCaps, MsgBox, Neon, SceneFx, SortDialog, SubPanel, TopStrip, type FItem } from "./kit_ui";
import { C, GRID_TOP, HEIGHT, XLSX_NAME, WIN_W } from "./theme";

const cols = buildCols(WIDTHS);
const TOTALW = WIDTHS.reduce((a, b) => a + b, 0);
const headRow: GRow = { id: "head", hdr: 1, cells: headCells(), slot: 0, h: 1, head: true };
const mk = (list: Row[], colored: boolean, slots: number[], hs: number[], hdr: (r: Row, i: number) => number, tweak?: (r: Row, cells: ReturnType<typeof cellsOf>) => void): GRow[] => [
  headRow,
  ...list.map((r, i) => { const cells = cellsOf(r, colored); if (tweak) tweak(r, cells); return { id: r.n, hdr: hdr(r, i), cells, slot: slots[i], h: hs[i] }; }),
];
const arrowBtns = (f: number, from: number, openCol = -1, onCols: number[] = []): FBtn[] =>
  cols.slice(0, 8).map((_, c) => ({ c, t: prog(f, from + c * 3, 10), state: onCols.includes(c) ? "on" : c === openCol ? "open" : "off" }));
const win = (a: number, b: number, f: number, r = 8): number => prog(f, a, r) * (1 - prog(f, b, r)); // 0->1->0 window
const uniq = (xs: string[]): string[] => Array.from(new Set(xs));
const at = (cc: number, slot: number): { x: number; y: number } => cellCenter(cols, cc, slot);
const Chip: React.FC<{ x: number; y: number; text: string; color: string; t: number }> = ({ x, y, text, color, t }) => (
  t <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `translateY(${(1 - t) * 8}px)`, background: C.slate, color: C.text, border: `2px solid ${color}`, borderRadius: 8, padding: "6px 12px", boxShadow: `0 0 14px ${color}88`, fontFamily: F.ui, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", zIndex: 45 }}>{text}</div>
);
const Fade: React.FC<{ f: number; dur: number; kind: "left" | "down" | "zoom" | "expand" | "fade"; children: React.ReactNode }> = ({ f, dur, kind, children }) => <SceneFx f={f} dur={dur} kind={kind}>{children}</SceneFx>;

// ================= SC01: AutoFilter =================
export const Scene1: React.FC = () => {
  const f = useCurrentFrame(); const A = A1;
  const keep = (r: Row) => r.branch === "Alex" || r.branch === "Cairo";
  const vis = SMALL.map((r, i) => (keep(r) ? 1 : 1 - prog(f, 1040 + (i % 6) * 2, 22)));
  const slots = stack(vis, 1);
  const filtered = f >= 1040;
  const kept = SMALL.filter(keep).length;
  const x0 = colX(cols, 2), y0 = slotY(1);
  const menuT = win(A.alt, 1040, f, 10);
  const all = f < A.branches;
  const items: FItem[] = uniq(BRANCHES.slice().sort()).map((b) => ({ label: b, checked: all || (b === "Alex" && f >= 985) || (b === "Cairo" && f >= 1000) }));
  const cam: Cam = camAt(f, [{ f: 0, z: 1, cx: 768, cy: 403 }, { f: 470, z: 1, cx: 768, cy: 403 }, { f: 510, z: 1.6, cx: 1130, cy: 150 }, { f: 585, z: 1.6, cx: 1130, cy: 150 }, { f: 625, z: 1.35, cx: 430, cy: 270 }, { f: 880, z: 1.35, cx: 430, cy: 270 }, { f: 915, z: 1.45, cx: 440, cy: 420 }, { f: 1050, z: 1.45, cx: 440, cy: 420 }, { f: 1100, z: 1.2, cx: 430, cy: 330 }]);
  const cur = path(f, [{ f: 930, x: 560, y: 520 }, { f: 968, x: x0 + 20, y: y0 + 222 }, { f: 985, x: x0 + 20, y: y0 + 244 }, { f: 1000, x: x0 + 20, y: y0 + 266 }, { f: 1030, x: x0 + 137, y: y0 + 388 }, { f: 1080, x: 700, y: 560 }]);
  return (
    <Fade f={f} dur={1200} kind="fade">
      <Excel cam={cam} file="manzooma_sales_2026.xlsx" tab="home" glow={{ id: "sortfilter", color: C.blue, t: win(A.autofilter, 585, f, 12) }} nameBox={f >= 750 ? "C1" : "C4"} formula={f >= 750 ? "Store Branch" : SMALL[2].branch}
        grid={{ cols, rows: mk(SMALL, false, slots, vis, (r) => r.n + 2), fixedHdr: !filtered, hdrBlue: filtered, active: f >= 750 ? { c: 2, slot: 0 } : { c: 2, slot: 3 }, fbtns: arrowBtns(f, A.ctrl + 10, menuT > 0 ? 2 : -1, filtered ? [2] : []) }}
        statusLeft={filtered ? `${kept} of ${SMALL.length} records found` : "Ready"}>
        <Neon x={colX(cols, 0)} y={slotY(0)} w={TOTALW} h={20} color={C.blue} t={win(A.ctrl + 10, 700, f, 12)} />
        <FilterMenu x={x0} y={y0} t={menuT} col="Store Branch" items={items} allChecked={all} />
        <Neon x={x0 + 8} y={y0 + 208 + 3 + 22} w={246} h={22} color={C.green} t={win(985, 1036, f, 8)} />
        <Neon x={x0 + 8} y={y0 + 208 + 3 + 44} w={246} h={22} color={C.green} t={win(1000, 1036, f, 8)} />
        {f >= 930 && f < 1085 ? <Cursor x={cur.x} y={cur.y} f={f} clicks={[968, 985, 1000, 1032]} /> : null}
      </Excel>
      <KeyCaps keys={["Ctrl", "Shift", "L"]} f={f} from={A.ctrl - 12} hold={75} />
      <KeyCaps keys={["Alt", "↓"]} f={f} from={A.alt - 14} hold={60} accent={C.green} />
      <TopStrip f={f} badge="Lesson 05 · Unit 1" lines={[{ from: 60, to: 540, text: "الفرز والتصفية المتقدمة والبحث المنظم | Advanced Sort, Filter & Wildcard Search", ar: true }, { from: 660, to: 1140, text: "Shortcut: Ctrl + Shift + L → Toggle AutoFilter | Alt + Down Arrow → Open Menu", color: C.blue }]} />
    </Fade>
  );
};

// ================= SC02: Multi-level sort =================
export const Scene2: React.FC = () => {
  const f = useCurrentFrame(); const A = A2;
  const order = sortRows(SMALL);
  const to = new Map(order.map((r, j) => [r.n, j]));
  const e = SMALL.map((r) => prog(f, 950 + ((to.get(r.n) ?? 0) % 8) * 3, 70));
  const slots = SMALL.map((r, i) => 1 + lerp(i, to.get(r.n) ?? i, e[i]));
  const topIds = new Set<number>(); const seen = new Set<string>();
  order.forEach((r) => { if (!seen.has(r.branch)) { seen.add(r.branch); topIds.add(r.n); } });
  const tint = prog(f, 950, 20) * (1 - prog(f, 1290, 30)) * 0.3;
  const dlgT = win(492, 945, f, 12);
  const sp = ribbonPos("data", "sortbtn");
  const cam: Cam = camAt(f, [{ f: 0, z: 1, cx: 768, cy: 403 }, { f: 380, z: 1, cx: 768, cy: 403 }, { f: 420, z: 1.6, cx: sp.x, cy: 150 }, { f: 480, z: 1.6, cx: sp.x, cy: 150 }, { f: 505, z: 1.45, cx: 768, cy: 340 }, { f: 945, z: 1.45, cx: 768, cy: 340 }, { f: 995, z: 1.25, cx: 480, cy: 340 }]);
  const cur = path(f, [{ f: 400, x: 900, y: 450 }, { f: 470, x: sp.x, y: sp.y }, { f: 560, x: 649, y: 311 }, { f: 681, x: 959, y: 311 }, { f: 715, x: 531, y: 240 }, { f: 757, x: 649, y: 355 }, { f: 896, x: 959, y: 355 }, { f: 935, x: 922, y: 484 }, { f: 990, x: 700, y: 560 }]);
  return (
    <Fade f={f} dur={1350} kind="zoom">
      <Excel cam={cam} file="manzooma_sales_2026.xlsx" tab={f >= A.data ? "data" : "home"} hotTab={{ tab: "Data", color: C.purple, t: win(A.data, 500, f, 10) }} glow={{ id: "sortbtn", color: C.purple, t: win(A.data + 12, 500, f, 10) }}
        nameBox="C1" formula="Store Branch"
        grid={{ cols, rows: mk(SMALL, false, slots, SMALL.map(() => 1), (r) => r.n + 2), fixedHdr: true, active: { c: 2, slot: 0 }, fbtns: arrowBtns(f, -20), cellFx: (id, c) => (f >= A.top && topIds.has(Number(id)) ? "rgba(245,158,11,.38)" : c === 2 ? `rgba(56,189,248,${tint})` : c === 6 ? `rgba(168,85,247,${tint})` : undefined) }}>
        <SortDialog x={478} y={190} t={dlgT} l2={prog(f, A.add + 14, 16)} hi1={f >= A.l1 && f < A.add ? C.blue : undefined} hiO1={f >= A.az && f < A.add ? C.blue : undefined} hi2={f >= A.l2 ? C.purple : undefined} hiO2={f >= A.lts ? C.purple : undefined} add={f >= A.add + 4 && f < A.add + 14 ? 1 : 0} ok={f >= 938 && f < 946 ? 1 : 0} border={C.purple} />
        {f >= 400 && f < 995 ? <Cursor x={cur.x} y={cur.y} f={f} clicks={[480, 722, 940]} /> : null}
      </Excel>
      <KeyCaps keys={["Alt", "A", "S", "S"]} f={f} from={A.altA - 12} hold={70} accent={C.purple} />
      <TopStrip f={f} badge="Lesson 05 · Unit 1" lines={[{ from: 60, to: 600, text: "Custom Sort (Alt + A + SS) → Multi-Level Hierarchical Data Ordering", color: C.purple }, { from: 720, to: 1260, text: "Level 1: Branch (A-Z) → Level 2: Revenue (Largest to Smallest)", color: C.green }]} />
    </Fade>
  );
};

// ================= SC03: Filter by color / icons =================
export const Scene3: React.FC = () => {
  const f = useCurrentFrame(); const A = A3;
  const isG = (r: Row) => fillOf(r.rev) === "green"; const isD = (r: Row) => trendOf(r.mom) === "down";
  const vis = SMALL.map((r, i) => {
    const j = i % 5;
    if (f < 800) return isG(r) ? 1 : 1 - prog(f, 625 + j * 2, 22);
    if (f < 945) return isG(r) ? 1 : prog(f, 800 + j * 2, 25);
    return isD(r) ? 1 : 1 - prog(f, 960 + j * 2, 22);
  });
  const slots = stack(vis, 1);
  const act = (f >= 625 && f < 840) || f >= 945;
  const nG = SMALL.filter(isG).length, nD = SMALL.filter(isD).length;
  const gi = SMALL.findIndex((r) => fillOf(r.rev) === "green"), ri = SMALL.findIndex((r) => fillOf(r.rev) === "red");
  const mG = win(A.click + 6, 598, f, 10), mH = win(A.icons + 6, 1000, f, 10);
  const xG = colX(cols, 6) - 40, xH = colX(cols, 7) - 40, y0 = slotY(1);
  const mom = uniq(SMALL.map((r) => r.mom).sort((a, b) => a - b).map((m) => m + "%")).slice(0, 6);
  const rev = uniq(SMALL.map((r) => r.rev).sort((a, b) => a - b).map((m) => num(m))).slice(0, 6);
  const cam: Cam = camAt(f, [{ f: 0, z: 1.2, cx: 430, cy: 330 }, { f: 1350, z: 1.2, cx: 430, cy: 330 }]);
  const cur = path(f, [{ f: 440, x: 900, y: 450 }, { f: 462, x: at(6, 0).x + 44, y: at(6, 0).y }, { f: 520, x: xG + 100, y: y0 + 142 }, { f: 574, x: xG + 281, y: y0 + 167 }, { f: 700, x: 760, y: 520 }, { f: 880, x: at(7, 0).x + 24, y: at(7, 0).y }, { f: 915, x: xH + 100, y: y0 + 142 }, { f: 938, x: xH + 347, y: y0 + 167 }, { f: 1000, x: 760, y: 560 }]);
  return (
    <Fade f={f} dur={1350} kind="left">
      <Excel cam={cam} file="manzooma_sales_2026.xlsx" tab="data" nameBox="G1" formula="Total Revenue" statusLeft={act ? `${f < 800 ? nG : nD} of ${SMALL.length} records found` : "Ready"}
        grid={{ cols, rows: mk(SMALL, true, slots, vis, (r) => r.n + 2), fixedHdr: !act, hdrBlue: act, active: { c: f >= A.icons ? 7 : 6, slot: 0 }, fbtns: arrowBtns(f, -20, mG > 0 ? 6 : mH > 0 ? 7 : -1, f >= 590 && f < 800 ? [6] : f >= 950 ? [7] : []) }}>
        <Neon x={colX(cols, 6)} y={slotY(gi + 1)} w={108} h={20} color={C.green} t={win(A.green, 450, f, 10)} label="Green = High sales" />
        <Neon x={colX(cols, 6)} y={slotY(ri + 1)} w={108} h={20} color={C.red} t={win(A.green + 30, 450, f, 10)} label="Red = Low sales" />
        <FilterMenu x={xG} y={y0} t={mG} col="Total Revenue" kind="Number" items={rev.map((l) => ({ label: l, checked: true }))} allChecked hover={f >= 520 ? "color" : undefined}
          sub={f >= 524 ? <SubPanel x={262} y={130} title="Filter by Cell Color" swatches={[{ c: "#C6EFCE", id: "green" }, { c: "#FFC7CE", id: "red" }, { c: "#FFFFFF", id: "nofill" }]} hover={f >= 565 ? "green" : undefined} /> : null} />
        <FilterMenu x={xH} y={y0} t={mH} col="MoM %" kind="Number" items={mom.map((l) => ({ label: l, checked: true }))} allChecked hover={f >= 915 ? "color" : undefined}
          sub={f >= 918 ? <SubPanel x={262} y={130} title="Filter by Cell Icon" icons={["up", "side", "down", "none"]} hover={f >= 926 ? "icon-down" : undefined} /> : null} />
        <Neon x={xH + 270 + 64} y={y0 + 156} w={26} h={22} color={C.red} t={win(A.low, 1000, f, 10)} />
        {(f >= 440 && f < 710) || (f >= 870 && f < 1010) ? <Cursor x={cur.x} y={cur.y} f={f} clicks={[A.click + 4, 576, A.icons + 6, 940]} /> : null}
      </Excel>
      <TopStrip f={f} badge="Lesson 05 · Unit 1" lines={[{ from: 90, to: 630, text: "Visual Filtering → Filter by Cell Color, Font Color & Icon Sets", color: C.green }, { from: 750, to: 1290, text: "Visual Speed → Instant Isolation of High-Risk or High-Profit Records", color: C.red }]} />
    </Fade>
  );
};

// ================= SC04: Wildcards =================
export const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const A = A4;
  const isC = (r: Row) => r.branch.startsWith("Cairo");
  const nC = SMALL.filter(isC).length;
  const replaced = f >= 640;
  const findTxt = f < 690 ? typed("Cairo*", f, 440, 0.25) : typed("A?1", f, 692, 0.2);
  const replTxt = f < 690 ? typed("Cairo Main Branch", f, 560, 0.4) : "";
  const dlgT = win(A.ctrlh + 6, 1180, f, 12);
  const flash = replaced ? (1 - prog(f, 640, 60)) * 0.5 : 0;
  const hi = SMALL.filter(isC).map((r) => r.n);
  const cam: Cam = camAt(f, [{ f: 0, z: 1.1, cx: 698, cy: 340 }, { f: 1200, z: 1.1, cx: 698, cy: 340 }]);
  const dx = 860, dy = 230;
  return (
    <Fade f={f} dur={1200} kind="down">
      <Excel cam={cam} file="manzooma_sales_2026.xlsx" tab="home" glow={{ id: "findsel", color: C.amber, t: win(A.ctrlh - 20, 400, f, 12) }} nameBox="C1" formula="Store Branch"
        grid={{ cols, rows: mk(SMALL, false, SMALL.map((_, i) => i + 1), SMALL.map(() => 1), (r) => r.n + 2, (r, cells) => { if (replaced && isC(r)) cells[2].v = "Cairo Main Branch"; }), fixedHdr: true, active: { c: 2, slot: 0 }, hiRows: f >= 500 && f < 640 ? hi : [], cellFx: (id, c) => (c === 2 && replaced && hi.includes(Number(id)) ? `rgba(16,185,129,${flash})` : undefined) }}>
        <FindDialog x={dx} y={dy} t={dlgT} find={findTxt} repl={replTxt} focus={f < 560 || f >= 690 ? "find" : "repl"} hiFind={f >= A.star && f < 690 ? C.amber : f >= A.q ? C.blue : undefined} press={f >= 632 && f < 642 ? "all" : undefined} />
        <Chip x={dx} y={dy + 262} text="*  matches any number of characters" color={C.amber} t={win(A.star, 680, f, 10)} />
        <Chip x={dx} y={dy + 262} text="?  matches exactly one character" color={C.blue} t={win(A.q, 1150, f, 10)} />
        <Chip x={dx} y={dy + 304} text="A?1  →  AB1 ✓   AC1 ✓   A71 ✓   A101 ✗" color={C.green} t={win(A.one, 1150, f, 10)} />
        <MsgBox x={dx + 60} y={dy + 70} title="Microsoft Excel" text={`All done. We made ${nC} replacements.`} t={win(646, 684, f, 8)} />
      </Excel>
      <KeyCaps keys={["Ctrl", "H"]} f={f} from={A.ctrlh - 14} hold={60} accent={C.amber} />
      <TopStrip f={f} badge="Lesson 05 · Unit 1" lines={[{ from: 60, to: 540, text: "Wildcard Mechanics → Asterisk (*) = Any Characters | Question Mark (?) = Single Char", color: C.amber }, { from: 660, to: 1140, text: "Smart Replace (Ctrl + H) → Mass Data Cleanup Without Distorting Structure", color: C.green }]} />
    </Fade>
  );
};

// ================= SC05: 50,000 rows =================
const VIEW = 26;
export const Scene5: React.FC = () => {
  const f = useCurrentFrame(); const A = A5;
  const bottom = f >= 408 && f < 455;
  const off = bottom ? BIG_N - VIEW : 0;
  const src = f >= 565 ? bigSorted() : bigRows();
  const view = src.slice(off, off + VIEW);
  const doRepl = f >= 736;
  const nL = bigRows().filter((r) => r.product.startsWith("Laptop")).length;
  const tint = f >= 565 ? prog(f, 565, 15) * (1 - prog(f, 650, 30)) * 0.3 : 0;
  const flash = doRepl ? (1 - prog(f, 736, 50)) * 0.45 : 0;
  const rows = mk(view, false, view.map((_, k) => k + 1), view.map(() => 1), (_, k) => off + k + 2, (r, cells) => { if (doRepl && r.product.startsWith("Laptop")) cells[3].v = "Laptop Pro"; });
  const rowsFix = rows.map((r) => ({ ...r, id: r.head ? r.id : "r" + String(r.id) }));
  const last = view[view.length - 1];
  const count = Math.round(BIG_N * prog(f, A.file, 130));
  const cam: Cam = camAt(f, [{ f: 0, z: 1.15, cx: 668, cy: 340 }, { f: 396, z: 1.15, cx: 668, cy: 340 }, { f: 406, z: 1.15, cx: 668, cy: 456 }, { f: 455, z: 1.15, cx: 668, cy: 456 }, { f: 465, z: 1.15, cx: 668, cy: 340 }, { f: 1200, z: 1.15, cx: 668, cy: 340 }]);
  const dx = 860, dy = 230;
  const seal = prog(f, A.result + 10, 26);
  const thumb = GRID_TOP + (WIN_W > 0 ? ((HEIGHT / 1.25 - GRID_TOP - 70) * off) / BIG_N : 0);
  return (
    <Fade f={f} dur={1200} kind="expand">
      <Excel cam={cam} file={XLSX_NAME} tab="home" nameBox={bottom ? "A50001" : "A1"} formula={bottom && last ? last.id : "Order ID"} statusLeft="Ready"
        grid={{ cols, rows: rowsFix, fixedHdr: false, active: bottom ? { c: 0, slot: VIEW } : { c: 0, slot: 0 }, fbtns: arrowBtns(f, A.ctrl + 10), cellFx: (_, c) => (c === 2 ? `rgba(56,189,248,${tint})` : c === 6 ? `rgba(168,85,247,${tint})` : c === 3 && doRepl ? `rgba(16,185,129,${flash})` : undefined) }}>
        <div style={{ position: "absolute", left: 0, top: slotY(1) - 1, width: WIN_W, height: 1, background: "#7F7F7F", zIndex: 5 }} />
        <div style={{ position: "absolute", left: WIN_W - 14, top: GRID_TOP, width: 14, height: HEIGHT / 1.25 - GRID_TOP - 70, background: "#F3F3F3", borderLeft: "1px solid #D6D6D6" }}><div style={{ position: "absolute", left: 3, top: thumb - GRID_TOP, width: 8, height: 10, background: "#8A8A8A", borderRadius: 4 }} /></div>
        <SortDialog x={478} y={190} t={win(515, 568, f, 10)} l2={prog(f, 530, 12)} hi1={C.blue} hi2={C.purple} hiO1={C.blue} hiO2={C.purple} ok={f >= 558 && f < 568 ? 1 : 0} border={C.purple} />
        <FindDialog x={dx} y={dy} t={win(A.repl + 18, 800, f, 10)} find={typed("Laptop*", f, 612, 0.3)} repl={typed("Laptop Pro", f, 640, 0.3)} focus={f < 640 ? "find" : "repl"} hiFind={C.amber} press={f >= 730 && f < 740 ? "all" : undefined} />
        <MsgBox x={dx + 60} y={dy + 70} title="Microsoft Excel" text={`All done. We made ${num(nL)} replacements.`} t={win(744, 800, f, 8)} />
      </Excel>
      <div style={{ position: "absolute", right: 28, top: 92, background: "rgba(15,23,42,.92)", border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "8px 18px", fontFamily: F.mono, fontSize: 20, color: C.text, opacity: prog(f, A.file, 12), zIndex: 60 }}>Rows loaded: <span style={{ color: C.blue, fontWeight: 700 }}>{num(count)}</span></div>
      {seal > 0 ? (
        <div style={{ position: "absolute", right: 60, top: 300, width: 330, opacity: seal, transform: `scale(${0.7 + 0.3 * seal})`, zIndex: 60, textAlign: "center" }}>
          <div style={{ width: 170, height: 170, margin: "0 auto", borderRadius: 85, background: `radial-gradient(circle, ${C.green}33, ${C.slate})`, border: `4px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 92, color: C.green }}>✓</div>
          <div style={{ marginTop: 12, background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "8px 12px", fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.text }}>Enterprise Sort & Filter</div>
          <div style={{ marginTop: 8, fontFamily: F.ar, fontWeight: 600, fontSize: 19, color: C.green, background: C.slate, borderRadius: 10, padding: "4px 10px" }}>{num(BIG_N)} صف · صفر أخطاء</div>
        </div>
      ) : null}
      <KeyCaps keys={["Ctrl", "↓"]} f={f} from={392} hold={36} accent={C.blue} />
      <KeyCaps keys={["Ctrl", "Shift", "L"]} f={f} from={A.ctrl - 4} hold={50} />
      <KeyCaps keys={["Alt", "A", "S", "S"]} f={f} from={A.sort - 10} hold={45} accent={C.purple} />
      <KeyCaps keys={["Ctrl", "H"]} f={f} from={A.repl + 6} hold={45} accent={C.amber} />
      <TopStrip f={f} badge="Lesson 05 · Unit 1" lines={[{ from: 60, to: 540, text: "Enterprise Data Sorting → Sort & Filter 50,000 Sales Records Instantly", color: C.blue }, { from: 660, to: 1140, text: "Precision Extraction → Zero-Error Wildcard Replacement & Segment Isolation", color: C.green }]} />
    </Fade>
  );
};

// ================= SC06: outro =================
export const Scene6: React.FC = () => {
  const f = useCurrentFrame(); const A = A6;
  const pr = prog(f, A.unit, 110);
  const skills = ["AutoFilter shortcuts · Ctrl + Shift + L", "Multi-Level Custom Sort · Alt + A + SS", "Filter by Color & Icon Sets", "Wildcards * and ? in Ctrl + H"];
  const fadeOut = 1 - prog(f, 850, 50);
  const card: React.CSSProperties = { background: "rgba(30,41,59,.72)", border: "1.5px solid rgba(148,163,184,.35)", borderRadius: 28, backdropFilter: "blur(6px)" };
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 10%, #16324a 0%, ${C.slate} 55%)`, opacity: Math.min(prog(f, 0, 20), fadeOut) }}>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 20, opacity: prog(f, 0, 20) }}>
        <Logo s={120} />
        <div><div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 46, color: C.text }}>منظومة أكاديمي | Manzooma Excel Masterclass</div><div style={{ fontFamily: F.ui, fontSize: 22, color: "#94A3B8", marginTop: 4 }}>Excel From Zero to Professional</div></div>
      </div>
      <div style={{ ...card, position: "absolute", left: 90, top: 200, width: 1010, height: 680, padding: 44, boxSizing: "border-box", opacity: prog(f, 30, 20), transform: `translateY(${(1 - prog(f, 30, 20)) * 24}px)` }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 38, color: C.text }}>Lesson 05 · AutoFilter & Advanced Sort</div>
        <div style={{ fontFamily: F.ar, fontSize: 28, color: "#CBD5E1", marginTop: 8 }}>اكتمل الدرس الخامس</div>
        <div style={{ marginTop: 34, display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.text }}><span>Unit 1 · Architecture & Smart Interface Setup</span><span style={{ color: C.green }}>{Math.round(pr * 100)}%</span></div>
        <div style={{ marginTop: 12, height: 26, borderRadius: 13, background: "#0B1220", overflow: "hidden", border: "1px solid #334155" }}><div style={{ width: `${pr * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, #34D399)`, boxShadow: `0 0 18px ${C.green}` }} /></div>
        <div style={{ marginTop: 34 }}>
          {skills.map((s, i) => { const t = prog(f, 130 + i * 30, 16); return <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 22, opacity: t, transform: `translateX(${(1 - t) * 30}px)`, fontFamily: F.ui, fontSize: 30, color: C.text }}><span style={{ color: C.green, fontWeight: 700, fontSize: 34 }}>✓</span>{s}</div>; })}
        </div>
        <div style={{ marginTop: 26, display: "flex", gap: 18, opacity: prog(f, A.sheet, 16) }}>
          <div style={{ background: C.slate, border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "10px 18px", fontFamily: F.mono, fontSize: 21, color: C.text }}>{XLSX_NAME}</div>
          <div style={{ background: C.slate, border: `1.5px solid ${C.green}`, borderRadius: 12, padding: "10px 18px", fontFamily: F.mono, fontSize: 21, color: C.green, opacity: prog(f, A.link, 16) }}>solutions.gomaaintelligence.me</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 200, width: 680, display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ ...card, height: 230, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, opacity: prog(f, A.unit + 110, 20), transform: `scale(${0.85 + 0.15 * prog(f, A.unit + 110, 20)})` }}>
          <div style={{ width: 130, height: 130, borderRadius: 65, background: `radial-gradient(circle, ${C.gold}, #B45309)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, color: C.slate, boxShadow: `0 0 40px ${C.gold}88` }}>✓</div>
          <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.gold, lineHeight: "38px" }}>Unit 1 Fully Completed<div style={{ fontWeight: 500, fontSize: 21, color: "#CBD5E1" }}>Architecture & Smart Interface Setup Mastered</div></div>
        </div>
        <div style={{ ...card, height: 420, padding: 34, boxSizing: "border-box", opacity: prog(f, A.next - 10, 20), transform: `translateY(${(1 - prog(f, A.next - 10, 20)) * 30}px)`, border: `1.5px solid ${C.blue}` }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.blue, letterSpacing: 1 }}>NEXT · UNIT 2</div>
          <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 36, color: C.text, marginTop: 10, direction: "rtl", textAlign: "right", lineHeight: "50px" }}>الدرس 6: المراجع النسبية والمطلقة والمختلطة</div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: "#CBD5E1", marginTop: 8 }}>Cell References Mechanics</div>
          <div style={{ marginTop: 22, display: "flex", gap: 12 }}>{["A1", "A$1", "$A1", "$A$1"].map((t) => <div key={t} style={{ flex: 1, height: 64, borderRadius: 8, background: "#fff", border: `2px solid ${C.xGreen}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.cell, fontSize: 28, fontWeight: 700, color: C.ink }}>{t}</div>)}</div>
        </div>
      </div>
    </div>
  );
};
