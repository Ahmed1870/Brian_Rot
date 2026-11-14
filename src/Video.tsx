import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, M, Y, W, H, DURATION, VOICE_FILE, MODEL, profit, fmt } from "./theme";
import { SCENE_START, BEATS } from "./sync";
import {
  AR, MONO, CELLF, T, Bg, TopBar, Chrome, FormulaBar, Grid, StatusStats, Dialog, Btn, Field, ListBox, Radio, Check, MenuList,
  Pointer, Click, Neon, Arrow, Tag, Pill, Glyph, ribbonItemRect, cellRect, tabX, prog, easeOut, easeIO, lerp, typed, clamp,
  Cell, Rng, ref as cref,
} from "./kit";

// ---------- data ----------
const IN = "#0B5CAD", HDR = "#E7F1EA";
const MODEL_COLS = [260, 150, 40, 130, 130, 130, 130, 130, 130, 130, 110, 110, 110, 80];
const SUM_COLS = [30, 200, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 40];
const SALES_COLS = [150, 160, 250, 90, 140, 120, 130, 170, 110, 110, 110, 110, 120];
const DISC = [0.05, 0.1, 0.15, 0.2, 0.25], SHIP = [15, 20, 25, 30, 35];
const SHEETS = "Model";

const modelCells = (v: Record<string, string> = {}): Record<string, Cell> => {
  const d: Record<string, string> = { B3: "500", B4: "10%", B5: "300", B6: "25", B7: "20,000", B8: "1,000,000", B9: "200,000", B10: fmt(1500000), B11: fmt(1700000), ...v };
  const rows: [string, string][] = [["Selling Price (EGP)", "B3"], ["Discount %", "B4"], ["Unit Cost (EGP)", "B5"], ["Shipping / Unit (EGP)", "B6"], ["Units Sold", "B7"], ["Fixed Costs (EGP)", "B8"], ["Depreciation (EGP)", "B9"]];
  const o: Record<string, Cell> = { A1: { v: "Manzooma Store – Profit Model 2026", b: true, fs: 24 }, A2: { v: "Assumption", b: true, fill: HDR }, B2: { v: "Value", b: true, fill: HDR, a: "r" } };
  rows.forEach(([l, k], i) => { o["A" + (i + 3)] = { v: l }; o[k] = { v: d[k], col: IN }; });
  o.A10 = { v: "Net Profit (EGP)", b: true }; o.B10 = { v: d.B10, b: true, fill: "#F3F3F3" };
  o.A11 = { v: "Cash Flow (EGP)", b: true }; o.B11 = { v: d.B11, b: true, fill: "#F3F3F3" };
  return o;
};
const heat = (v: number, lo: number, hi: number) => {
  const t = clamp((v - lo) / (hi - lo)), R = [248, 105, 107], Yl = [255, 235, 132], G = [99, 190, 123];
  const [a, b, u] = t < 0.5 ? [R, Yl, t * 2] : [Yl, G, (t - 0.5) * 2];
  return `rgb(${a.map((x, i) => Math.round(lerp(x, b[i], u))).join(",")})`;
};
const ALL = DISC.flatMap((d) => SHIP.map((s) => profit(d, s)));
const LO = Math.min(...ALL), HI = Math.max(...ALL);
// matrix: top row = discount (E3:I3), left column = shipping (D4:D8), corner D3 = =B10
const matrixCells = (f: number, hdrAt: number, valAt: number, heatAt: number, corner = true): Record<string, Cell> => {
  const o = modelCells();
  if (corner) o.D3 = { v: fmt(1500000), b: true, fill: "#F3F3F3" };
  o.D2 = { v: "Shipping ↓", b: true, fs: 17, col: C.xlTxt2 }; o.E2 = { v: "Discount % →", b: true, fs: 17, col: C.xlTxt2 };
  DISC.forEach((d, i) => { if (f >= hdrAt + i * 10) o[cref(4 + i, 3)] = { v: Math.round(d * 100) + "%", b: true, fill: HDR, a: "r" }; });
  SHIP.forEach((s, i) => { if (f >= hdrAt + 60 + i * 10) o[cref(3, 4 + i)] = { v: String(s), b: true, fill: HDR, a: "r" }; });
  DISC.forEach((d, ci) => SHIP.forEach((s, ri) => {
    const v = profit(d, s), k = ri * 5 + ci;
    if (f >= valAt + k * 1.6) o[cref(4 + ci, 4 + ri)] = { v: fmt(v), a: "r", fill: f >= heatAt ? heat(v, LO, HI) : undefined, fs: 19, col: v < 0 ? "#C00000" : C.xlTxt };
  }));
  return o;
};
const Vis = (f: number, a: number, b = 1e9, d = 12) => Math.min(prog(f, a, d), 1 - prog(f, b - d, d));

type WP = { f: number; tab: string; sheets?: string; active?: number; name: string; fx: string; colW: number[]; cells: Record<string, Cell>; sel?: { c: number; r: number } | null; range?: Rng | null; ants?: Rng | null; stats?: string; caret?: boolean; handle?: boolean; row0?: number };
const Win = (p: WP) => (
  <g>
    <Bg />
    <Chrome tab={p.tab} file="manzooma_sales_2026.xlsx" sheets={p.sheets || SHEETS} active={p.active || 0} />
    <FormulaBar name={p.name} text={p.fx} caret={p.caret} f={p.f} />
    <Grid colW={p.colW} cells={p.cells} sel={p.sel} range={p.range} ants={p.ants} f={p.f} handle={p.handle} row0={p.row0} />
    {p.stats ? <StatusStats s={p.stats} /> : null}
  </g>
);
const ctr = (r: { x: number; y: number; w: number; h: number }): [number, number] => [r.x + r.w / 2, r.y + r.h / 2];
const WI = ribbonItemRect("Data", "What-If Analysis");
const MENU = { x: WI.x - 10, y: Y.ribbon + 100 };
const menuItemY = (i: number) => MENU.y + 6 + i * 36 + 18;
const FadeIn = ({ f, children }: { f: number; children: React.ReactNode }) => <g opacity={prog(f, 0, 12)}>{children}</g>;

// ================= SCENE 1 =================
const S1 = () => {
  const f = useCurrentFrame(); const [, b1, b2] = BEATS[0];
  const dim = prog(f, 50, 30);
  const val = f < 150 ? 1500000 : Math.round(lerp(1500000, -20000, easeIO(prog(f, 150, 120))));
  const broken = val < 0;
  const curve = (y: number) => `M1130 560 C1300 560 1350 ${y} 1530 ${y}`;
  const ys = [470, 560, 650];
  const nodes: [string, string, string][] = [["Best Case", fmt(2480000), C.green], ["Base Case", fmt(1500000), C.blue], ["Worst Case", fmt(-20000), C.amber]];
  return (
    <g>
      <Win f={f} tab="Home" name="B10" fx="=B7*(B3*(1-B4)-B5-B6)-B8" colW={MODEL_COLS} cells={modelCells()} sel={{ c: 1, r: 10 }} />
      <rect x={M.winX} y={Y.fb} width={M.winW} height={Y.sheet - Y.fb} fill={C.bg} opacity={0.9 * dim} />
      <g opacity={prog(f, 70, 24)}>
        <rect x={110} y={350} width={800} height={470} rx={22} fill={C.panel} />
        <Neon x={110} y={350} w={800} h={470} c={C.red} rx={22} f={f} op={prog(f, 90, 20)} />
        <T x={150} y={410} size={34} w={700}>Single-Point Forecast</T>
        <T x={870} y={410} size={24} fill={C.mute} anchor="end" rtl>رقم واحد جامد</T>
        <T x={510} y={560} size={96} w={600} anchor="middle" font={MONO} fill={broken ? C.red : C.text}>{fmt(val)}</T>
        <T x={510} y={608} size={24} anchor="middle" fill={C.mute}>EGP Net Profit – one fixed assumption</T>
        {["Price -4%", "Discount x2", "Shipping +40%"].map((s, i) => <Pill key={s} x={150 + i * 250} y={650} w={226} c={C.red} label={s} op={prog(f, 150 + i * 14, 14)} size={22} />)}
        <T x={510} y={760} size={32} w={700} anchor="middle" fill={broken ? C.red : C.mute} op={prog(f, 250, 20)}>{broken ? "✗  The model breaks" : ""}</T>
      </g>
      <g opacity={prog(f, 300, 30)}>
        <rect x={1010} y={350} width={800} height={470} rx={22} fill={C.panel} />
        <Neon x={1010} y={350} w={800} h={470} c={C.blue} rx={22} f={f} op={prog(f, b1, 30)} />
        <T x={1050} y={410} size={34} w={700}>What-If Analysis Engine</T>
        <circle cx={1100} cy={560} r={38} fill={C.bg} stroke={C.blue} strokeWidth={3} /><T x={1100} y={567} size={18} anchor="middle" w={700}>Model</T>
        {ys.map((y, i) => { const p = prog(f, b1 + i * 25, 40); return (
          <g key={i} opacity={Math.min(1, p * 3)}>
            <path d={curve(y)} fill="none" stroke={nodes[i][2]} strokeWidth={5} strokeLinecap="round" strokeDasharray="470" strokeDashoffset={470 * (1 - easeOut(p))} />
            <g opacity={prog(p, 0.7, 0.3)}><rect x={1530} y={y - 34} width={240} height={68} rx={12} fill={C.bg} stroke={nodes[i][2]} strokeWidth={2.5} />
              <T x={1650} y={y - 6} size={19} anchor="middle" fill={C.mute}>{nodes[i][0]}</T><T x={1650} y={y + 24} size={26} anchor="middle" w={600} font={MONO} fill={nodes[i][2]}>{nodes[i][1]}</T></g>
          </g>); })}
        {[["Scenario Manager", C.green, 1050], ["Goal Seek", C.purple, 1330], ["Data Table", C.amber, 1530]].map(([l, c, x], i) => <Pill key={l as string} x={x as number} y={730} w={l === "Scenario Manager" ? 250 : 170} c={c as string} label={l as string} op={prog(f, b2 + i * 22, 16)} size={21} />)}
      </g>
      <Tag f={f} a={90} b={540} c={C.blue} title="Scenario Analysis & Sensitivity Modeling Engine" sub="Lesson 66 • Unit 13 of 14" />
      <Tag f={f} a={700} b={1220} c={C.blue} title="Enterprise What-If Modeling" sub="Stress-Testing Profits Across Dynamic Market Conditions" />
    </g>
  );
};

// ================= SCENE 2 =================
const SM = { x: 560, y: 270, w: 720, h: 520 }, AD = { x: 640, y: 290, w: 640, h: 470 }, VD = { x: 700, y: 300, w: 560, h: 410 }, SD = { x: 700, y: 330, w: 520, h: 300 };
const SCN = ["Best Case", "Base Case", "Worst Case"];
const S2 = () => {
  const f = useCurrentFrame(); const [, b1, b2, b3] = BEATS[1];
  const [wx, wy] = ctr(WI);
  const smOpen = f >= 130 && f < 975, addOpen = f >= 200 && f < 320, valOpen = (f >= 325 && f < 410) || (f >= b2 && f < 760), sumOpen = f >= 885 && f < 970, onSum = f >= 975;
  const n = (f >= 410 ? 1 : 0) + (f >= 470 ? 1 : 0) + (f >= 530 ? 1 : 0);
  const items = SCN.slice(0, n);
  const worst = f >= b2;
  const vals = worst ? ["480", "0.2", "35"] : ["520", "0.05", "20"];
  const addBtn: [number, number] = [SM.x + 508 + 95, SM.y + 74 + 18], sumBtn: [number, number] = [SM.x + 508 + 95, SM.y + 250 + 18];
  const pts: [number, number, number][] = [[0, 1500, 520], [62, wx, wy], [100, wx - 40, menuItemY(0)], [125, wx - 40, menuItemY(0)], [180, addBtn[0], addBtn[1]], [200, addBtn[0], addBtn[1]],
    [300, AD.x + 400, AD.y + 420], [316, AD.x + 400, AD.y + 420], [395, VD.x + 380, VD.y + 370], [405, VD.x + 380, VD.y + 370], [560, 1000, 700], [840, 1000, 700], [878, sumBtn[0], sumBtn[1]], [884, sumBtn[0], sumBtn[1]],
    [955, SD.x + 330, SD.y + 250], [962, SD.x + 330, SD.y + 250], [1100, 1300, 520]];
  const sc: [number, number, string, string, string, string][] = [[3, 6, "Selling Price", "$B$3", "", ""]];
  void sc;
  // scenario summary sheet
  const S: Record<string, Cell> = {};
  const rowAt = (k: number) => f >= 985 + k * 14;
  if (onSum) {
    S.B2 = { v: "Scenario Summary", b: true, fs: 26 };
    const hd = (k: string, v: string) => (S[k] = { v, b: true, fill: "#D9D9D9", a: "r" });
    hd("D4", "Current Values:"); hd("E4", "Best Case"); hd("F4", "Base Case"); hd("G4", "Worst Case");
    const tb: [number, string, string, string[]][] = [[6, "Selling Price", "$B$3", ["500", "520", "500", "480"]], [7, "Discount %", "$B$4", ["10%", "5%", "10%", "20%"]], [8, "Shipping / Unit", "$B$6", ["25", "20", "25", "35"]], [10, "Net Profit", "$B$10", [fmt(1500000), fmt(2480000), fmt(1500000), fmt(-20000)]], [11, "Cash Flow", "$B$11", [fmt(1700000), fmt(2680000), fmt(1700000), fmt(180000)]]];
    S.B5 = { v: "Changing Cells:", b: true }; S.B9 = { v: "Result Cells:", b: true };
    tb.forEach(([r, name, a1, v], k) => { if (!rowAt(k)) return; S["B" + r] = { v: name }; S["C" + r] = { v: a1, a: "l" };
      v.forEach((x, i) => { S[cref(3 + i, r)] = { v: x, a: "r", fill: r < 9 && i > 0 ? "#D9D9D9" : undefined, b: r >= 10, col: x.startsWith("-") ? "#C00000" : C.xlTxt }; }); });
    S.B13 = { v: "Notes: Current Values column shows the changing cells' values when the report was created.", fs: 17, col: C.xlTxt2 };
  }
  const cellsN = onSum ? S : modelCells();
  const hi = n === 0 ? undefined : n - 1;
  return (
    <g>
      <Win f={f} tab="Data" sheets={onSum ? "Model|Scenario Summary" : "Model"} active={onSum ? 1 : 0} name={onSum ? "D10" : "B3"} fx={onSum ? "1500000" : "500"}
        colW={onSum ? SUM_COLS : MODEL_COLS} cells={cellsN} sel={onSum ? { c: 3, r: 10 } : { c: 1, r: 3 }} />
      <Neon x={WI.x} y={WI.y} w={WI.w} h={WI.h} c={C.green} op={Vis(f, 30, 130)} f={f} />
      {f >= 74 && f < 125 ? <MenuList x={MENU.x} y={MENU.y} w={300} items={["Scenario Manager...", "Goal Seek...", "Data Table..."]} hi={0} /> : null}
      {smOpen ? <Dialog x={SM.x} y={SM.y} w={SM.w} h={SM.h} title="Scenario Manager" op={prog(f, 130, 8)}>
        <T x={SM.x + 24} y={SM.y + 66} size={16}>Scenarios:</T>
        <ListBox x={SM.x + 24} y={SM.y + 74} w={460} h={224} items={items} sel={hi} />
        {n === 0 ? <T x={SM.x + 34} y={SM.y + 104} size={16} fill={C.xlTxt2}>No Scenarios defined. Choose Add to add scenarios.</T> : null}
        {["Add...", "Delete", "Edit...", "Merge...", "Summary..."].map((l, i) => <Btn key={l} x={SM.x + 508} y={SM.y + 74 + i * 44} w={190} label={l} down={(l === "Add..." && f >= 192 && f < 200)} />)}
        <T x={SM.x + 24} y={SM.y + 330} size={16}>Changing cells:</T>
        <rect x={SM.x + 24} y={SM.y + 338} width={672} height={34} fill="#fff" stroke="#7A7A7A" /><T x={SM.x + 32} y={SM.y + 361} size={18} font={CELLF}>{n ? "$B$3,$B$4,$B$6" : ""}</T>
        <T x={SM.x + 24} y={SM.y + 400} size={16}>Comment:</T>
        <rect x={SM.x + 24} y={SM.y + 408} width={672} height={34} fill="#fff" stroke="#7A7A7A" /><T x={SM.x + 32} y={SM.y + 431} size={18} font={CELLF}>{n ? "Created by Manzooma Academy on 11/13/2026" : ""}</T>
        <Btn x={SM.x + 420} y={SM.y + 468} w={130} label="Show" /><Btn x={SM.x + 566} y={SM.y + 468} w={130} label="Close" />
      </Dialog> : null}
      {addOpen ? <Dialog x={AD.x} y={AD.y} w={AD.w} h={AD.h} title="Add Scenario">
        <Field x={AD.x + 24} y={AD.y + 70} w={AD.w - 48} label="Scenario name:" text={typed("Best Case", f, 205, 12)} focus={f < 252} f={f} pick={false} />
        <Field x={AD.x + 24} y={AD.y + 150} w={AD.w - 48} label="Changing cells:" text={typed("B3,B4,B6", f, 255, 12)} focus={f >= 252} f={f} />
        <T x={AD.x + 24} y={AD.y + 240} size={16}>Comment:</T><rect x={AD.x + 24} y={AD.y + 248} width={AD.w - 48} height={80} fill="#fff" stroke="#7A7A7A" />
        <T x={AD.x + 24} y={AD.y + 362} size={16} w={600}>Protection</T><Check x={AD.x + 24} y={AD.y + 394} label="Prevent changes" on /><Check x={AD.x + 260} y={AD.y + 394} label="Hide" />
        <Btn x={AD.x + 380} y={AD.y + 410} w={110} label="OK" def down={f >= 314} /><Btn x={AD.x + 506} y={AD.y + 410} w={110} label="Cancel" />
      </Dialog> : null}
      {valOpen ? <Dialog x={VD.x} y={VD.y} w={VD.w} h={VD.h} title="Scenario Values">
        <T x={VD.x + 24} y={VD.y + 68} size={17}>Enter values for each of the changing cells.</T>
        {["$B$3", "$B$4", "$B$6"].map((a, i) => <g key={a}><T x={VD.x + 24} y={VD.y + 126 + i * 56} size={17}>{i + 1}:</T><T x={VD.x + 70} y={VD.y + 126 + i * 56} size={17} fill={C.xlTxt2}>{a}</T>
          <rect x={VD.x + 150} y={VD.y + 102 + i * 56} width={380} height={32} fill="#fff" stroke={i === 0 ? "#0F6CBD" : "#7A7A7A"} /><T x={VD.x + 160} y={VD.y + 125 + i * 56} size={18} font={CELLF}>{typed(vals[i], f, (worst ? b2 + 20 : 330) + i * 14, 12)}</T></g>)}
        <T x={VD.x + 24} y={VD.y + 296} size={15} fill={C.xlTxt2}>{worst ? "Worst Case" : "Best Case"}</T>
        <Btn x={VD.x + 24} y={VD.y + 340} w={110} label="Add" /><Btn x={VD.x + 300} y={VD.y + 340} w={110} label="OK" def down={f >= 403 && f < 410} /><Btn x={VD.x + 424} y={VD.y + 340} w={110} label="Cancel" />
      </Dialog> : null}
      {f >= b2 && f < 760 ? <Pill x={VD.x - 30} y={VD.y + VD.h + 24} w={620} c={C.green} label="Changing cells: up to 32 per scenario" op={prog(f, b2, 14)} size={22} /> : null}
      {sumOpen ? <Dialog x={SD.x} y={SD.y} w={SD.w} h={SD.h} title="Scenario Summary">
        <T x={SD.x + 24} y={SD.y + 70} size={17} w={600}>Report type</T><Radio x={SD.x + 30} y={SD.y + 106} label="Scenario summary" on /><Radio x={SD.x + 30} y={SD.y + 140} label="Scenario PivotTable report" />
        <Field x={SD.x + 24} y={SD.y + 168} w={SD.w - 48} label="Result cells:" text="B10:B11" f={f} />
        <Btn x={SD.x + 280} y={SD.y + 250} w={100} label="OK" def down={f >= 960} /><Btn x={SD.x + 394} y={SD.y + 250} w={100} label="Cancel" />
      </Dialog> : null}
      {f >= 876 && f < 970 ? <Neon x={SM.x + 508} y={SM.y + 250} w={190} h={36} c={C.green} f={f} /> : null}
      {onSum ? <g><Neon x={cellRect(SUM_COLS, 1, 4).x - 6} y={cellRect(SUM_COLS, 1, 4).y - 4} w={970} h={8 * 30 + 8} c={C.green} f={f} op={prog(f, 985, 20)} />
        <g opacity={prog(f, 1120, 20)}><rect x={1160} y={470} width={630} height={150} rx={16} fill={C.panel} stroke={C.green} strokeWidth={2.5} />
          <T x={1475} y={522} size={26} w={700} anchor="middle" fill={C.green}>✓ Original model unchanged</T><T x={1475} y={566} size={22} anchor="middle" font={MONO} fill={C.text}>Model!B10 = 1,500,000</T><T x={1475} y={600} size={18} anchor="middle" fill={C.mute}>Report is generated on a new sheet</T></g></g> : null}
      <Pointer pts={pts} f={f} />
      {[70, 120, 192, 316, 405, 878, 962].map((a, i) => <Click key={i} x={[wx, wx - 40, addBtn[0], AD.x + 400, VD.x + 380, sumBtn[0], SD.x + 330][i]} y={[wy, menuItemY(0), addBtn[1], AD.y + 420, VD.y + 370, sumBtn[1], SD.y + 250][i]} f={f} at={a} />)}
      <Tag f={f} a={20} b={640} c={C.green} title="Scenario Manager" sub="Best Case | Base Case | Worst Case • up to 32 changing cells" />
      <Tag f={f} a={880} b={1241} c={C.green} title="Automated Comparison" sub="Scenario Summary → executive side-by-side profit report" />
    </g>
  );
};

// ================= SCENE 3 =================
const GS = { x: 560, y: 330, w: 600, h: 300 };
const S3 = () => {
  const f = useCurrentFrame(); const [, b1, b2, b3, b4] = BEATS[2];
  const [wx, wy] = ctr(WI);
  const open = f >= 100 && f < 1062, status = f >= b4 && f < 1180;
  const cur = [1500000, 1875000, 1968750, 1992188, 1998047, 1999512, 1999878, 2000000];
  const it = clamp(Math.floor((f - (b4 + 10)) / 7), 0, 7);
  const solved = f >= b4 + 66;
  const done = f >= 1180;
  const cells = modelCells(done ? { B7: "24,000", B10: fmt(2000000), B11: fmt(2200000) } : {});
  const b10 = cellRect(MODEL_COLS, 1, 10), b7 = cellRect(MODEL_COLS, 1, 7);
  const ap = easeOut(prog(f, b2, 50));
  const pts: [number, number, number][] = [[0, 1500, 520], [20, wx, wy], [60, wx, wy], [90, wx - 40, menuItemY(1)], [108, wx - 40, menuItemY(1)], [600, 900, 700], [b3, GS.x + 300, GS.y + 100], [b3 + 200, GS.x + 300, GS.y + 160], [b4 - 20, GS.x + 360, GS.y + 270], [b4, GS.x + 360, GS.y + 270], [b4 + 80, 1100, 700]];
  return (
    <g>
      <Win f={f} tab="Data" name={done ? "B10" : "B10"} fx="=B7*(B3*(1-B4)-B5-B6)-B8" colW={MODEL_COLS} cells={cells} sel={{ c: 1, r: 10 }} />
      <Neon x={WI.x} y={WI.y} w={WI.w} h={WI.h} c={C.purple} op={Vis(f, 10, 100)} f={f} />
      {f >= 24 && f < 108 ? <MenuList x={MENU.x} y={MENU.y} w={300} items={["Scenario Manager...", "Goal Seek...", "Data Table..."]} hi={1} /> : null}
      {open && !status ? <Dialog x={GS.x} y={GS.y} w={GS.w} h={GS.h} title="Goal Seek" op={prog(f, 108, 8) * (1 - Vis(f, 200, 600, 20) * 0.0)}>
        <Field x={GS.x + 24} y={GS.y + 62} w={GS.w - 48} label="Set cell:" text={typed("B10", f, b3, 10)} focus={f >= b3 && f < b3 + 70} f={f} />
        <Field x={GS.x + 24} y={GS.y + 126} w={GS.w - 48} label="To value:" text={typed("2000000", f, b3 + 70, 10)} focus={f >= b3 + 70 && f < b3 + 150} f={f} pick={false} />
        <Field x={GS.x + 24} y={GS.y + 190} w={GS.w - 48} label="By changing cell:" text={typed("B7", f, b3 + 150, 10)} focus={f >= b3 + 150} f={f} />
        <Btn x={GS.x + GS.w - 236} y={GS.y + 252} w={104} label="OK" def down={f >= b4 - 6} /><Btn x={GS.x + GS.w - 120} y={GS.y + 252} w={104} label="Cancel" />
      </Dialog> : null}
      {open && !status ? <g>
        <Neon x={GS.x + 24} y={GS.y + 70} w={GS.w - 48} h={34} c={C.purple} f={f} op={Vis(f, b3, b3 + 70, 8)} />
        <Neon x={GS.x + 24} y={GS.y + 134} w={GS.w - 48} h={34} c={C.purple} f={f} op={Vis(f, b3 + 70, b3 + 150, 8)} />
        <Neon x={GS.x + 24} y={GS.y + 198} w={GS.w - 48} h={34} c={C.purple} f={f} op={Vis(f, b3 + 150, b4 - 10, 8)} /></g> : null}
      {status ? <Dialog x={GS.x} y={GS.y} w={640} h={290} title="Goal Seek Status">
        <T x={GS.x + 24} y={GS.y + 76} size={18}>Goal Seeking with Cell B10</T>
        <T x={GS.x + 24} y={GS.y + 102} size={18}>{solved ? "found a solution." : "is seeking a solution…"}</T>
        <T x={GS.x + 24} y={GS.y + 150} size={18}>Target value:  2000000</T><T x={GS.x + 24} y={GS.y + 182} size={18}>Current value:  {fmt(cur[it])}</T>
        <Btn x={GS.x + 470} y={GS.y + 62} w={140} label="Step" /><Btn x={GS.x + 470} y={GS.y + 106} w={140} label="Pause" />
        <Btn x={GS.x + 250} y={GS.y + 236} w={110} label="OK" def down={f >= 1170} /><Btn x={GS.x + 374} y={GS.y + 236} w={110} label="Cancel" />
      </Dialog> : null}
      {status ? <g opacity={prog(f, b4 + 4, 10)}><rect x={1200} y={400} width={560} height={210} rx={16} fill={C.panel} stroke={C.purple} strokeWidth={2.5} />
        <T x={1480} y={446} size={22} anchor="middle" fill={C.mute}>Goal Seek • iterations (max 100)</T>
        <T x={1480} y={510} size={54} anchor="middle" w={700} font={MONO} fill={C.purple}>#{it + 1}</T>
        <T x={1480} y={572} size={26} anchor="middle" font={MONO}>Units = {fmt(Math.round((cur[it] + MODEL.fixed) / 125))}</T></g> : null}
      {f >= b1 && f < 560 ? <g opacity={Vis(f, b1, 560)}><rect x={1150} y={400} width={620} height={200} rx={18} fill={C.panel} stroke={C.purple} strokeWidth={2.5} />
        <T x={1460} y={460} size={26} anchor="middle" w={600}>The manager asks:</T><T x={1460} y={508} size={30} anchor="middle" w={700} fill={C.purple}>How many units for 2,000,000 EGP?</T><T x={1460} y={560} size={22} anchor="middle" fill={C.mute}>or reach the Break-Even Point</T></g> : null}
      {f >= b2 && f < 780 ? <g opacity={Vis(f, b2, 780)}>
        <Neon x={b10.x} y={b10.y} w={b10.w} h={b10.h} c={C.purple} f={f} /><Neon x={b7.x} y={b7.y} w={b7.w} h={b7.h} c={C.purple} f={f} />
        <path d={`M${b10.x + b10.w + 6} ${b10.y + 15} H${b10.x + b10.w + 70} V${lerp(b10.y + 15, b7.y + 15, ap)}`} fill="none" stroke={C.purple} strokeWidth={5} strokeLinecap="round" />
        {ap > 0.97 ? <Arrow x1={b10.x + b10.w + 70} y1={b7.y + 15} x2={b7.x + b7.w + 8} y2={b7.y + 15} c={C.purple} /> : null}
        <T x={b10.x + b10.w + 90} y={b10.y + 22} size={22} fill={C.purple} w={600}>Result (known)</T><T x={b7.x + b7.w + 90} y={b7.y + 22} size={22} fill={C.purple} w={600}>Input (unknown)</T>
        <Pill x={b10.x + b10.w + 110} y={(b10.y + b7.y) / 2 + 8} w={190} c={C.purple} label="Works backwards" op={prog(f, b2 + 40, 14)} size={20} /></g> : null}
      {done ? <g><Neon x={b7.x} y={b7.y} w={b7.w} h={b7.h} c={C.purple} f={f} op={prog(f, 1180, 12)} />
        <g opacity={prog(f, 1190, 14)}><rect x={1100} y={330} width={690} height={92} rx={16} fill={C.panel} stroke={C.purple} strokeWidth={2.5} /><T x={1445} y={386} size={28} w={700} anchor="middle" fill={C.text}>2,000,000 EGP target → 24,000 units</T></g>
        <g opacity={prog(f, 1250, 14)}><rect x={1100} y={440} width={690} height={92} rx={16} fill={C.panel} stroke={C.green} strokeWidth={2.5} /><T x={1445} y={496} size={28} w={700} anchor="middle" fill={C.text}>To value = 0 → Break-Even = 8,000 units</T></g></g> : null}
      <Pointer pts={pts} f={f} />
      {[[wx, wy, 60], [wx - 40, menuItemY(1), 104], [GS.x + 360, GS.y + 270, b4 - 6]].map(([x, y, a], i) => <Click key={i} x={x} y={y} f={f} at={a} />)}
      <Tag f={f} a={40} b={640} c={C.purple} title="Reverse Optimization • Goal Seek" sub="Set Cell → To Value → By Changing Cell" />
      <Tag f={f} a={900} b={1371} c={C.purple} title="Instant Break-Even Solver" sub="Solves target sales volume or price in a fraction of a second" />
    </g>
  );
};

// ================= SCENE 4 =================
const DT = { x: 640, y: 330, w: 540, h: 260 };
const S4 = () => {
  const f = useCurrentFrame(); const [, b1, b2, b3, b4] = BEATS[3];
  const hdrAt = 300, valAt = 655, heatAt = 800;
  const [wx, wy] = ctr(WI);
  const home = f >= 735 && f < 850; const tab = f >= 856 ? "Formulas" : home ? "Home" : "Data";
  const cells = matrixCells(f, hdrAt, valAt, heatAt, f >= 280);
  const range: Rng | null = f >= 570 && f < 790 ? { c1: 3, r1: 3, c2: 8, r2: 8 } : null;
  const sel = f >= 523 && f < 570 ? { c: 3, r: 3 } : f >= 790 ? { c: 4, r: 4 } : null;
  const fx = f >= 523 && f < 570 ? "=B10" : f >= 790 ? "{=TABLE(B4,B6)}" : "";
  const nm = f >= 570 && f < 790 ? "D3:I8" : f >= 790 ? "E4" : "D3";
  const cf = ribbonItemRect("Home", "Conditional Formatting"), co = ribbonItemRect("Formulas", "Calculation Options");
  const pick = f >= 930 ? 1 : 0;
  const d3 = cellRect(MODEL_COLS, 3, 3);
  const pts: [number, number, number][] = [[0, 1500, 520], [20, wx, wy], [60, wx, wy], [96, wx - 40, menuItemY(2)], [112, wx - 40, menuItemY(2)], [560, 900, 650], [590, wx, wy], [602, wx, wy], [636, wx - 40, menuItemY(2)], [648, wx - 40, menuItemY(2)], [676, DT.x + 340, DT.y + 220], [684, DT.x + 340, DT.y + 220],
    [722, tabX("Home").x + 30, Y.tabs + 20], [732, tabX("Home").x + 30, Y.tabs + 20], [750, cf.x + cf.w / 2, cf.y + 60], [760, cf.x + cf.w / 2, cf.y + 60], [780, cf.x + 150, cf.y + 100 + 3 * 36 + 20], [794, cf.x + 150, cf.y + 100 + 3 * 36 + 20],
    [848, tabX("Formulas").x + 30, Y.tabs + 20], [856, tabX("Formulas").x + 30, Y.tabs + 20], [880, co.x + co.w / 2, co.y + 60], [892, co.x + co.w / 2, co.y + 60], [926, co.x + 150, co.y + 112 + 36 + 18], [934, co.x + 150, co.y + 112 + 36 + 18], [1000, 1300, 700]];
  const swatch = (x: number, y: number, k: number, on: boolean) => <g key={k}><rect x={x} y={y} width={58} height={58} fill="#fff" stroke={on ? C.xlSel : "#B4B4B4"} strokeWidth={on ? 3 : 1} />{["#F8696B", "#FFEB84", "#63BE7B"].map((c, i) => <rect key={i} x={x + 6} y={y + 6 + i * 15.3} width={46} height={15.3} fill={k === 0 ? c : k === 1 ? ["#63BE7B", "#FFEB84", "#F8696B"][i] : k === 2 ? ["#fff", "#C5DEF0", "#5A8AC6"][i] : ["#5A8AC6", "#C5DEF0", "#fff"][i]} />)}</g>;
  return (
    <g>
      <Win f={f} tab={tab} name={nm} fx={fx} colW={MODEL_COLS} cells={cells} sel={sel} range={range} handle={f >= 790 ? false : undefined} />
      <Neon x={WI.x} y={WI.y} w={WI.w} h={WI.h} c={C.amber} op={tab === "Data" ? Vis(f, 10, 112) : 0} f={f} />
      {f >= 44 && f < 112 || f >= 612 && f < 650 ? <MenuList x={MENU.x} y={MENU.y} w={300} items={["Scenario Manager...", "Goal Seek...", "Data Table..."]} hi={2} /> : null}
      {f >= b1 && f < b2 ? <g opacity={Vis(f, b1, b2)}>
        <Pill x={1130} y={380} w={330} c={f >= 330 ? C.mute : C.amber} label="One-Variable Data Table" size={22} /><Pill x={1130} y={436} w={330} c={C.amber} label="Two-Variable Data Table" size={22} op={prog(f, 300, 14)} />
        <T x={1130} y={520} size={21} fill={C.mute} op={prog(f, 330, 14)}>Selling price × supplier cost, in one grid</T></g> : null}
      {f >= 523 && f < 640 ? <Neon x={d3.x} y={d3.y} w={d3.w} h={d3.h} c={C.amber} f={f} op={Vis(f, 523, 640)} /> : null}
      {f >= 523 && f < 640 ? <g opacity={Vis(f, 530, 640)}><rect x={1130} y={330} width={640} height={86} rx={14} fill={C.panel} stroke={C.amber} strokeWidth={2.5} /><T x={1450} y={382} size={25} w={600} anchor="middle">Master profit formula in the top-left corner</T></g> : null}
      {f >= 610 && f < 686 ? <Dialog x={DT.x} y={DT.y} w={DT.w} h={DT.h} title="Data Table">
        <Field x={DT.x + 24} y={DT.y + 62} w={DT.w - 48} label="Row input cell:" text={typed("B4", f, 626, 10)} focus={f < 650} f={f} />
        <Field x={DT.x + 24} y={DT.y + 126} w={DT.w - 48} label="Column input cell:" text={typed("B6", f, 652, 10)} focus={f >= 650} f={f} />
        <Btn x={DT.x + 296} y={DT.y + 200} w={100} label="OK" def down={f >= 676} /><Btn x={DT.x + 410} y={DT.y + 200} w={100} label="Cancel" /></Dialog> : null}
      {f >= 750 && f < 796 ? <g><MenuList x={cf.x} y={cf.y + 100} w={300} items={["Highlight Cells Rules  ▸", "Top/Bottom Rules  ▸", "Data Bars  ▸", "Color Scales  ▸", "Icon Sets  ▸", "New Rule...", "Clear Rules  ▸", "Manage Rules..."]} hi={3} />
        {f >= 762 ? <g><rect x={cf.x + 306} y={cf.y + 180} width={286} height={100} fill="#fff" stroke="#B4B4B4" />{[0, 1, 2, 3].map((k) => swatch(cf.x + 318 + k * 66, cf.y + 196, k, k === 0))}</g> : null}</g> : null}
      {f >= 800 && f < 850 ? <Neon x={cellRect(MODEL_COLS, 4, 4).x} y={cellRect(MODEL_COLS, 4, 4).y} w={650} h={150} c={C.amber} f={f} op={Vis(f, 800, 850)} /> : null}
      {f >= 868 && f < 1010 ? <g><MenuList x={co.x} y={co.y + 112} w={420} items={[`${pick === 0 ? "✓ " : "    "}Automatic`, `${pick === 1 ? "✓ " : "    "}Automatic Except for Data Tables`, "    Manual"]} hi={pick === 1 ? 1 : f >= 905 ? 1 : 0} />
        <Neon x={co.x + 4} y={co.y + 112 + 42} w={412} h={34} c={C.amber} f={f} op={prog(f, 905, 12)} /></g> : null}
      {f >= 970 ? <g opacity={prog(f, 970, 14)}><rect x={1130} y={600} width={640} height={170} rx={16} fill={C.panel} stroke={C.amber} strokeWidth={2.5} />
        <T x={1450} y={650} size={25} w={600} anchor="middle">Data Tables refresh only when you decide</T>
        <rect x={1370} y={680} width={160} height={64} rx={12} fill={C.bg} stroke={C.amber} strokeWidth={3} /><T x={1450} y={725} size={38} w={600} anchor="middle" font={MONO} fill={C.amber}>F9</T></g> : null}
      <Pointer pts={pts} f={f} />
      {[[wx, wy, 40], [wx, wy, 600], [wx - 40, menuItemY(2), 640], [DT.x + 340, DT.y + 220, 676], [tabX("Home").x + 30, Y.tabs + 20, 728], [cf.x + 150, cf.y + 100 + 3 * 36 + 20, 788], [tabX("Formulas").x + 30, Y.tabs + 20, 850], [co.x + co.w / 2, co.y + 60, 876], [co.x + 150, co.y + 112 + 36 + 18, 928]].map(([x, y, a], i) => <Click key={i} x={x} y={y} f={f} at={a} />)}
      <Tag f={f} a={60} b={700} c={C.amber} title="2D Sensitivity Matrix" sub="Two-Variable Data Table + Color Scales heatmap" />
      <Tag f={f} a={860} b={1179} c={C.amber} title="Calculation Speed Guard" sub="Automatic Except for Data Tables • refresh with F9" />
    </g>
  );
};

// ================= SCENE 5 =================
const PRODUCTS: [string, number][] = [["Wireless Mouse", 350], ["USB-C Cable", 120], ["Laptop Stand", 480], ["Keyboard", 650], ["Headphones", 900]];
const salesCells = (): Record<string, Cell> => {
  const o: Record<string, Cell> = {};
  ["Order ID", "Date", "Product", "Qty", "Unit Price", "Discount", "Shipping", "Revenue (EGP)"].forEach((h, i) => (o[String.fromCharCode(65 + i) + 1] = { v: h, b: true, fill: C.xlGreen, col: "#fff", a: i > 2 ? "r" : "l" }));
  for (let r = 2; r <= 15; r++) {
    const k = r - 2, [pn, pr] = PRODUCTS[k % 5], q = 1 + ((k * 7) % 6), d = [0, 0.05, 0.1, 0.15][k % 4], sh = [20, 25, 30][k % 3], fl = r % 2 ? "#E2EFDA" : undefined;
    const row = ["ORD-" + (100001 + k * 3), `2026-10-${String(1 + k).padStart(2, "0")}`, pn, String(q), String(pr), Math.round(d * 100) + "%", String(sh), fmt(Math.round(q * pr * (1 - d)))];
    row.forEach((v, i) => (o[String.fromCharCode(65 + i) + r] = { v, a: i > 2 ? "r" : "l", fill: fl }));
  }
  return o;
};
const S5CELLS = salesCells();
const S5 = () => {
  const f = useCurrentFrame(); const [, b1, b2, b3, b4] = BEATS[4];
  const cnt = Math.round(50000 * easeOut(prog(f, 20, 100)));
  const card = (y: number, c: string, a: number, title: string, sub: string, body: React.ReactNode) => (
    <g opacity={prog(f, a, 16)} transform={`translate(0 ${(1 - easeOut(prog(f, a, 16))) * 16})`}>
      <rect x={920} y={y} width={920} height={132} rx={16} fill={C.panel} /><Neon x={920} y={y} w={920} h={132} c={c} f={f} rx={16} op={prog(f, a, 16)} />
      <T x={950} y={y + 50} size={28} w={700}>{title}</T><T x={950} y={y + 90} size={20} fill={C.mute}>{sub}</T>{body}
      <T x={1812} y={y + 40} size={26} anchor="end" fill={c} op={prog(f, a + 30, 14)}>✓</T></g>);
  const seal = easeOut(prog(f, b4, 24));
  return (
    <g>
      <Win f={f} tab="Data" sheets="Sales_2026|Model" name="D2:D50001" fx="" colW={SALES_COLS} cells={S5CELLS} range={{ c1: 3, r1: 2, c2: 3, r2: 50001 }} sel={{ c: 3, r: 2 }} stats={f >= 20 ? `Count: ${fmt(cnt)}` : ""} />
      <g opacity={prog(f, 0, 14)}><rect x={60} y={Y.sheet - 56} width={0} height={0} /></g>
      <g opacity={Vis(f, 10, b1 + 40, 14)}><rect x={1120} y={420} width={640} height={110} rx={16} fill={C.panel} stroke={C.green} strokeWidth={2.5} />
        <T x={1440} y={470} size={26} w={700} anchor="middle">manzooma_sales_2026.xlsx</T><T x={1440} y={508} size={30} w={700} anchor="middle" font={MONO} fill={C.green}>{fmt(cnt)} rows</T></g>
      {card(390, C.amber, b1, "2D Data Table", "Discount % × Shipping cost", <g>{DISC.flatMap((d, ci) => SHIP.map((s, ri) => <rect key={ci * 5 + ri} x={1560 + ci * 40} y={ 402 + ri * 22} width={36} height={19} fill={heat(profit(d, s), LO, HI)} opacity={prog(f, b1 + 10 + (ci + ri) * 3, 10)} />))}</g>)}
      {card(536, C.purple, b2, "Goal Seek • Q4 Break-Even", "Set cell → Net Profit,  To value → 0", <T x={1780} y={640} size={36} anchor="end" w={700} font={MONO} fill={C.purple} op={prog(f, b2 + 30, 14)}>18,400 units</T>)}
      {card(682, C.green, b3, "Scenario Summary", "Best | Base | Worst", <g>{[[2480000, C.green], [1500000, C.blue], [-20000, C.amber]].map(([v, c], i) => <g key={i} opacity={prog(f, b3 + 10 + i * 8, 12)}><rect x={1470} y={706 + i * 28} width={Math.max(10, (v as number) / 2480000 * 220)} height={20} fill={c as string} /><T x={1470 + Math.max(10, (v as number) / 2480000 * 220) + 10} y={723 + i * 28} size={17} font={MONO}>{fmt(v as number)}</T></g>)}</g>)}
      {f >= b4 ? <g opacity={seal}><rect x={110} y={400} width={720} height={400} rx={22} fill={C.bg} opacity={0.94} /><circle cx={470} cy={560} r={112 * seal} fill={C.panel} stroke={C.green} strokeWidth={6} />
        <circle cx={470} cy={560} r={96 * seal} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="4 8" />
        <path d="M418 560 L455 598 L526 520" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="190" strokeDashoffset={190 * (1 - prog(f, b4 + 10, 24))} />
        <T x={470} y={730} size={30} w={700} anchor="middle" fill={C.green}>Enterprise Sensitivity Seal</T><T x={470} y={768} size={22} anchor="middle" fill={C.mute}>50,000 rows • near-instant results</T></g> : null}
      <Tag f={f} a={60} b={700} c={C.green} title="Enterprise What-If Pipeline" sub="Scenario Summary + Goal Seek + 2D Data Table on 50,000 rows" />
      <Tag f={f} a={b4 + 10} b={1124} c={C.green} title="Zero-Surprise Risk Modeling" sub="Fast sensitivity simulation on the full dataset" />
    </g>
  );
};

// ================= SCENE 6 =================
const S6 = () => {
  const f = useCurrentFrame(); const [, b1, b2] = BEATS[5];
  const bar = easeOut(prog(f, 40, 200));
  const skills = ["Scenario Manager + Scenario Summary", "Goal Seek: Break-Even Solver", "Two-Variable Data Table + Color Scales", "Automatic Except for Data Tables + F9"];
  return (
    <g>
      <Bg />
      <g opacity={prog(f, 0, 20)}>
        <rect x={210} y={110} width={1500} height={840} rx={30} fill={C.panel} opacity={0.8} stroke="rgba(248,250,252,0.16)" strokeWidth={2} />
        <image href={staticFile("manzooma-logo.svg")} x={230} y={120} width={170} height={170} />
        <T x={430} y={190} size={48} w={700} rtl>منظومة أكاديمي | Manzooma Excel Masterclass</T>
        <T x={430} y={240} size={28} fill={C.green} w={600}>Scenario Analysis & Sensitivity Modeling – Mastered</T>
        <T x={250} y={338} size={26} w={600} rtl>الدرس 66 من 76 • الوحدة 13 من 14</T><T x={1670} y={338} size={26} w={700} anchor="end" font={MONO} fill={C.green}>{(86.8 * bar).toFixed(1)}%</T>
        <rect x={250} y={356} width={1420} height={24} rx={12} fill={C.bg} /><rect x={250} y={356} width={1420 * 0.868 * bar} height={24} rx={12} fill={C.green} />
        {skills.map((s, i) => <g key={s} opacity={prog(f, 60 + i * 50, 16)}><circle cx={270} cy={470 + i * 78} r={20} fill={C.green} /><path d={`M${260} ${470 + i * 78} l7 8 l13 -16`} stroke={C.bg} strokeWidth={4} fill="none" strokeLinecap="round" /><T x={310} y={480 + i * 78} size={29}>{s}</T></g>)}
      </g>
      <g opacity={prog(f, b1, 18)}><rect x={1000} y={430} width={670} height={190} rx={18} fill={C.bg} stroke={C.blue} strokeWidth={2.5} />
        <T x={1030} y={480} size={22} fill={C.mute}>Files & practice</T><T x={1030} y={535} size={34} w={700} font={MONO} fill={C.blue}>solutions.gomaaintelligence.me</T><T x={1030} y={585} size={26} font={MONO}>manzooma_sales_2026.xlsx</T></g>
      <g opacity={prog(f, b2, 18)}><rect x={1000} y={650} width={670} height={250} rx={18} fill={C.bg} stroke={C.green} strokeWidth={2.5} />
        <T x={1640} y={702} size={24} fill={C.green} anchor="end" rtl>الدرس القادم • 67</T><T x={1640} y={768} size={38} w={700} anchor="end" rtl>اختيار المخطط المناسب للبيانات</T>
        <T x={1030} y={850} size={28} fill={C.mute} font={MONO}>Choosing the Right Chart for Data</T></g>
      <rect x={0} y={0} width={W} height={H} fill="#000" opacity={prog(f, 985, 40)} />
    </g>
  );
};

// ================= COMPOSITION =================
const SC = [S1, S2, S3, S4, S5, S6];
export const Video = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <Bg />
      {SC.map((S, i) => (
        <Sequence key={i} from={SCENE_START[i]} durationInFrames={SCENE_START[i + 1] - SCENE_START[i]} layout="none"><S /></Sequence>
      ))}
      <Sequence from={0} durationInFrames={SCENE_START[5]} layout="none"><TopBar /></Sequence>
    </svg>
    <Audio src={staticFile(VOICE_FILE)} />
  </AbsoluteFill>
);
export const TOTAL = DURATION;
