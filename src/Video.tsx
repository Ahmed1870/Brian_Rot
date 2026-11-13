import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, M, VOICE, gx, gy, LESSON, UNIT, TOTAL_UNITS, TITLE_AR, TITLE_EN } from "./theme";
import { CUE, SC } from "./sync";
import {
  FONT, Stage, Header, Caption, Cursor, WP, Neon, Tx, Rect, abs, ExcelWin, PPWin, PPCol, PTFields, rib, ppCellBox, Outro, Seal,
  BRANCHES, FACT, amt, sumWhere, prog, eo, typed, fmt, PQ_SQL,
} from "./kit";

const mk = (id: string, s0: number) => (n: string, o = 0) => Math.round((CUE[id + "_" + n] + o) * 30) - s0;
const gw = (w: WP[]): WP[] => w.map((p) => ({ ...p, x: gx(p.x), y: gy(p.y) }));
const ramp = (f: number, t: number, d = 10) => eo(prog(f, t, t + d));
const ALL = sumWhere(() => true);
const Chip: React.FC<{ x: number; y: number; w: number; h?: number; c: string; a?: number; children?: React.ReactNode }> = ({ x, y, w, h = 76, c, a = 1, children }) => (
  <div style={abs(x, y, w, h, { opacity: a, background: "rgba(15,23,42,0.96)", border: `3px solid ${c}`, borderRadius: 10, boxSizing: "border-box" })}>{children}</div>
);
const Box: React.FC<{ x: number; y: number; w: number; h: number; c: string; title: string; a?: number; children?: React.ReactNode }> = ({ x, y, w, h, c, title, a = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, background: C.panel2, border: `2px solid ${c}`, borderRadius: 18, boxSizing: "border-box" }}>
    <div dir="ltr" style={{ position: "absolute", left: 24, top: 16, height: 40, padding: "0 20px", borderRadius: 20, background: c, color: "#0F172A", fontFamily: FONT.ui, fontWeight: 700, fontSize: 22, lineHeight: "40px" }}>{title}</div>
    {children}
  </div>
);
const Row: React.FC<{ x: number; y: number; w: number; h: number; c: string; hi: boolean; l: string; r: string; a?: number }> = ({ x, y, w, h, c, hi, l, r, a = 1 }) => (
  <div dir="ltr" style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 10, border: `2px solid ${hi ? c : C.line}`, background: hi ? "rgba(255,255,255,0.08)" : C.bg, fontFamily: FONT.mono, fontSize: 24, lineHeight: `${h - 4}px`, color: C.text, paddingLeft: 18, boxSizing: "border-box" }}>
    {l}<span style={{ position: "absolute", right: 18, color: hi ? c : C.dim, fontWeight: 700 }}>{r}</span></div>
);
const R6 = FACT.slice(0, 6);

// ---------------- Scene 1 ----------------
const S1: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[0]; const dur = s1 - s0; const at = mk("c1", s0);
  const tEng = at("engine", -1.2), tWrong = at("wrong", -0.5), tBloat = at("bloat", -0.5);
  const card = ramp(f, at("badge")) * (1 - ramp(f, tEng - 6));
  const chips = [["Aggregators", C.blue, at("engine", -7)], ["Iterators", C.green, at("engine", -5)], ["Smart function choice", C.purple, at("engine", -3)]] as const;
  const dg = ramp(f, tEng); const t = Math.max(0, f - tEng);
  const bi = Math.floor(t / 22) % 7, ri = Math.floor(t / 30) % 5;
  const run5 = FACT.slice(0, ri + 1).reduce((a, r) => a + amt(r), 0);
  return (
    <Stage dur={dur} fin={0} fout={8}>
      <PPWin f={f} table="Fact_Sales" cols={[]} rows={[]} name="" formula="" dim={0.93} />
      <Header f={f} />
      <div style={{ position: "absolute", left: 360, top: 230, width: 1200, height: 540, opacity: card }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "rgba(30,41,59,0.94)", border: `2px solid ${C.blue}` }} />
        <div dir="rtl" style={{ position: "absolute", left: 0, top: 36, width: 1200, textAlign: "center", fontFamily: FONT.ar, fontSize: 34, color: C.dim }}>{`الوحدة ${UNIT} من ${TOTAL_UNITS} — DAX & Evaluation Context`}</div>
        <div dir="ltr" style={{ position: "absolute", left: 0, top: 100, width: 1200, textAlign: "center", fontFamily: FONT.ui, fontSize: 60, fontWeight: 700, color: C.text }}>Lesson {LESSON}</div>
        <div dir="ltr" style={{ position: "absolute", left: 0, top: 184, width: 1200, textAlign: "center", fontFamily: FONT.ui, fontSize: 44, fontWeight: 600, color: C.blue }}>{TITLE_EN}</div>
        <div dir="rtl" style={{ position: "absolute", left: 0, top: 262, width: 1200, textAlign: "center", fontFamily: FONT.ar, fontSize: 36, color: C.text }}>{TITLE_AR}</div>
        {chips.map(([tx, c, tt], i) => (
          <div key={tx} dir="ltr" style={{ position: "absolute", left: 40 + i * 385, top: 390, width: 365, height: 70, borderRadius: 35, border: `3px solid ${c}`, background: C.bg, color: C.text, fontFamily: FONT.ui, fontSize: 26, fontWeight: 600, textAlign: "center", lineHeight: "64px", opacity: ramp(f, tt), transform: `translateY(${(1 - ramp(f, tt)) * 18}px)` }}>{tx}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: dg }}>
        <Box x={100} y={130} w={800} h={700} c={C.blue} title="Aggregators: SUM(Table[Column])">
          {R6.map((r, i) => <Row key={r.id} x={40} y={80 + i * 66} w={720} h={58} c={C.blue} hi={i === bi} l={`SalesAmount #${i + 1}`} r={fmt(amt(r))} />)}
          <div style={{ position: "absolute", left: 30, top: 70 + bi * 66, width: 740, height: 76, border: `3px solid ${C.blue}`, borderRadius: 10, background: "rgba(56,189,248,0.12)" }} />
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 500, fontFamily: FONT.ui, fontSize: 30, fontWeight: 700, color: C.blue }}>One column → one number</div>
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 556, fontFamily: FONT.mono, fontSize: 26, color: C.text }}>{`Σ = ${fmt(R6.reduce((a, r) => a + amt(r), 0))}`}</div>
        </Box>
        <Box x={1020} y={130} w={800} h={700} c={C.green} title="Iterators: SUMX(Table, Expression)">
          {FACT.slice(0, 5).map((r, i) => <Row key={r.id} x={40} y={80 + i * 66} w={720} h={58} c={C.green} hi={i === ri} l={`${r.qty} × ${fmt(r.price)}`} r={fmt(amt(r))} />)}
          <div style={{ position: "absolute", left: 30, top: 70 + ri * 66, width: 740, height: 76, border: `3px solid ${C.green}`, borderRadius: 10, background: "rgba(16,185,129,0.12)" }} />
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 500, fontFamily: FONT.ui, fontSize: 30, fontWeight: 700, color: C.green }}>Row by row → then summed</div>
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 556, fontFamily: FONT.mono, fontSize: 26, color: C.text }}>{`Running Σ = ${fmt(run5)}`}</div>
        </Box>
        <Chip x={100} y={860} w={800} h={92} c={C.red} a={ramp(f, tWrong)}><Tx x={20} y={8} w={760} h={34} size={22} bold color="#fff" font={FONT.mono}>SUM(Fact_Sales[Quantity] * Fact_Sales[UnitPrice])</Tx><Tx x={20} y={48} w={760} h={32} size={20} bold color={C.red}>✕ Invalid: SUM takes a single column reference</Tx></Chip>
        <Chip x={1020} y={860} w={800} h={92} c={C.red} a={ramp(f, tBloat)}><Tx x={20} y={8} w={760} h={34} size={22} bold color="#fff" font={FONT.mono}>Calculated column Revenue added</Tx><Tx x={20} y={48} w={760} h={32} size={20} bold color={C.red}>✕ Extra stored column makes the model heavier</Tx></Chip>
      </div>
      <Caption f={f} t0={at("badge", 0.8)} t1={tEng - 4} color={C.blue} text="Lesson 59 → Aggregators vs. Iterators Engine" />
      <Caption f={f} t0={tEng + 4} t1={dur - 6} color={C.blue} text="DAX Function Dual Engine → Aggregators (Single Column) vs. Iterators (Row-by-Row Expression)" />
    </Stage>
  );
};

// ---------------- Scene 2: aggregators ----------------
const COLS: PPCol[] = [{ n: "SalesID", w: 90 }, { n: "Customer", w: 130 }, { n: "Quantity", w: 90, r: true }, { n: "UnitPrice", w: 100, r: true }, { n: "SalesAmount", w: 130, r: true }];
const ROWS = FACT.slice(0, 15).map((r, i) => [String(r.id), ["Nile Tech", "Delta Mart", "Cairo Home", "Giza Shop", "Alex Store", "Mansoura"][r.cust], String(r.qty), fmt(r.price), fmt(amt(r))]);
const FB = { x: 240, y: 154, w: 1144, h: 26 };
const S2: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[1]; const dur = s1 - s0; const at = mk("c2", s0);
  const tF = at("start", 0.4), tBeam = at("one", 0.2), tRes = tBeam + 50, tBad = at("noexpr", -0.2);
  const good = "Total Sales := SUM(Fact_Sales[SalesAmount])";
  const bad = "Total := SUM(Fact_Sales[Quantity] * Fact_Sales[UnitPrice])";
  const bp = prog(f, tBeam, tBeam + 45);
  const c4 = ppCellBox(COLS, 0, 4);
  const formula = f >= tBad ? typed(bad, f, tBad, 22) : typed(good, f, tF, 16);
  const err = f >= tBad + Math.ceil(bad.length * 30 / 22) + 6;
  const calc = [{ n: "Total Sales", v: f >= tRes && f < tBad ? fmt(ALL) : "" }];
  const wps = gw([{ t: 0, x: 900, y: 330 }, { t: tF - 18, x: 700, y: 168 }, { t: tF, x: 700, y: 168, click: true }, { t: tBeam - 10, x: c4.x + 60, y: c4.y + 20 }, { t: tBad - 20, x: 700, y: 168 }, { t: tBad, x: 700, y: 168, click: true }]);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <PPWin f={f} table="Fact_Sales" cols={COLS} rows={ROWS} selCol={4} name={f >= tBad ? "Total" : "Total Sales"} formula={formula} calc={calc}>
        {bp > 0 && bp < 1 && <div style={abs(c4.x, c4.y - 26, c4.w, 26 + 15 * 22 * bp, { background: "rgba(56,189,248,0.22)", borderBottom: `4px solid ${C.blue}`, boxSizing: "border-box" })} />}
        {f >= tBeam && f < tBad && <Neon x={c4.x} y={c4.y - 26} w={c4.w} h={15 * 22 + 26} c={C.blue} a={0.9} r={3} />}
        {f >= at("start") && <Chip x={680} y={215} w={640} c={C.blue} a={ramp(f, at("start"), 12)}><Tx x={18} y={8} w={600} h={30} size={18} bold color={C.blue}>Aggregators</Tx><Tx x={18} y={38} w={610} h={28} size={14.5} color="#E2E8F0">SUM · AVERAGE · MIN · MAX</Tx></Chip>}
        {f >= tBeam && <Chip x={680} y={310} w={640} h={90} c={C.blue} a={ramp(f, tBeam, 10)}><Tx x={18} y={8} w={600} h={30} size={16} bold color="#fff">One existing numeric column</Tx><Tx x={18} y={44} w={610} h={30} size={14} color="#E2E8F0">{f >= tRes ? `Evaluated directly in the filter context → ${fmt(ALL)}` : "Scanning SalesAmount…"}</Tx></Chip>}
        {f >= tBad - 4 && <Neon x={FB.x} y={FB.y} w={FB.w} h={FB.h} c={C.red} a={ramp(f, tBad - 4) * (err ? 1 : 0.5)} r={3} />}
        {err && <Chip x={560} y={430} w={760} h={100} c={C.red} a={ramp(f, tBad + 40, 8)}><Tx x={18} y={8} w={720} h={30} size={18} bold color={C.red}>Syntax error</Tx><Tx x={18} y={40} w={730} h={50} size={14.5} color="#E2E8F0">SUM accepts a column reference only. Use SUMX for math between columns.</Tx></Chip>}
      </PPWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("start", 0.8)} t1={tBad - 6} color={C.blue} text="Aggregators Architecture → Evaluates Single Column Directly inside Filter Context" />
      <Caption f={f} t0={tBad} t1={dur - 6} color={C.blue} text="Syntax Rule → Accepts Table[Column] Reference Only, Expression Math Invalid" />
    </Stage>
  );
};

// ---------------- Scene 3: iterators ----------------
const S3: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[2]; const dur = s1 - s0; const at = mk("c3", s0);
  const tF = at("start", 0.4), tT = at("table", -0.2), tE = at("expr", -0.2), tScan = at("rc", 0.5), tRam = at("ram", -0.5);
  const formula = typed("Total Revenue := SUMX(Fact_Sales, Fact_Sales[Quantity] * Fact_Sales[UnitPrice])", f, tF, 18);
  const n = f < tScan ? 0 : Math.min(FACT.length, Math.floor((f - tScan) / 4) + 1);
  const hi = n === 0 ? -1 : Math.min(14, n - 1);
  const run = FACT.slice(0, n).reduce((a, r) => a + amt(r), 0);
  const rows = FACT.slice(0, 15).map((r, i) => [String(r.id), ROWS[i][1], String(r.qty), fmt(r.price), ""]);
  const done = n >= FACT.length;
  const wps = gw([{ t: 0, x: 900, y: 330 }, { t: tF - 18, x: 700, y: 168 }, { t: tF, x: 700, y: 168, click: true }, { t: tScan - 10, x: 900, y: 420 }]);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <PPWin f={f} table="Fact_Sales" cols={COLS.slice(0, 4)} rows={rows.map((r) => r.slice(0, 4))} hi={hi} hiColor={C.green} name="Total Revenue" formula={formula} calc={[{ n: "Total Revenue", v: done ? fmt(ALL) : "" }]}>
        <Chip x={500} y={215} w={820} h={64} c={C.green} a={ramp(f, at("xfn"), 12)}><Tx x={18} y={6} w={780} h={26} size={18} bold color={C.green}>Iterators (X-Functions): SUMX · AVERAGEX</Tx><Tx x={18} y={34} w={790} h={26} size={13.5} color="#E2E8F0">SUMX(Table, Expression) creates a temporary Row Context</Tx></Chip>
        {f >= tT && <Chip x={500} y={296} w={400} h={64} c={C.green} a={ramp(f, tT, 8)}><Tx x={14} y={4} w={380} h={26} size={15} bold color={C.green}>① Table</Tx><Tx x={14} y={32} w={380} h={26} size={15} color="#fff" font={FONT.mono}>Fact_Sales</Tx></Chip>}
        {f >= tE && <Chip x={920} y={296} w={460} h={64} c={C.green} a={ramp(f, tE, 8)}><Tx x={14} y={4} w={440} h={26} size={15} bold color={C.green}>② Expression (per row)</Tx><Tx x={14} y={32} w={440} h={26} size={15} color="#fff" font={FONT.mono}>[Quantity] * [UnitPrice]</Tx></Chip>}
        {n > 0 && <Chip x={500} y={380} w={880} h={104} c={C.green} a={ramp(f, tScan, 8)}><Tx x={18} y={6} w={840} h={30} size={17} bold color="#fff" font={FONT.mono}>{`Row ${n}: ${FACT[n - 1].qty} × ${fmt(FACT[n - 1].price)} = ${fmt(amt(FACT[n - 1]))}`}</Tx><Tx x={18} y={44} w={840} h={50} size={22} bold color={C.green} font={FONT.mono}>{`Running total = ${fmt(run)}  (${n} / ${FACT.length} rows)`}</Tx></Chip>}
        {f >= tRam && <Chip x={500} y={500} w={620} h={64} c={C.green} a={ramp(f, tRam, 8)}><Tx x={18} y={4} w={590} h={30} size={18} bold color={C.green}>Columns added to the model: 0</Tx><Tx x={18} y={34} w={590} h={26} size={13.5} color="#E2E8F0">Evaluated on demand, nothing stored in RAM</Tx></Chip>}
      </PPWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("start", 0.8)} t1={tScan + 30} color={C.green} text="Iterators Architecture (X-Functions) → SUMX(Table, Expression) Creates Temporary Row Context" />
      <Caption f={f} t0={tScan + 40} t1={dur - 6} color={C.green} text="On-Demand Row Evaluation → Row-by-Row Math without Adding Permanent Columns" />
    </Stage>
  );
};

// ---------------- Scene 4: selection guide ----------------
const S4: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[3]; const dur = s1 - s0; const at = mk("c4", s0);
  const tCol = at("col", -0.3), tBloat = at("bloat", -0.6), tSumx = at("sumx", -0.6), tLean = at("lean", -0.4);
  const grow = ramp(f, tBloat + 10, 30);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <Header f={f} />
      <Box x={100} y={130} w={800} h={690} c={C.red} title="Calculated column + SUM" a={ramp(f, tBloat)}>
        <div dir="ltr" style={{ position: "absolute", left: 40, top: 90, fontFamily: FONT.mono, fontSize: 24, color: C.text, lineHeight: "44px" }}>
          <div>{typed("Revenue = [Quantity] * [UnitPrice]", f, tBloat + 6, 40)}</div>
          <div style={{ color: C.dim }}>{typed("Total = SUM(Fact_Sales[Revenue])", f, tBloat + 50, 40)}</div>
        </div>
        <div dir="ltr" style={{ position: "absolute", left: 40, top: 250, fontFamily: FONT.ui, fontSize: 24, color: C.dim }}>Model size</div>
        <div style={{ position: "absolute", left: 40, top: 292, width: 720, height: 50, borderRadius: 10, background: C.bg, border: `2px solid ${C.line}`, overflow: "hidden" }}>
          <div style={{ width: 360, height: 50, background: C.dim, opacity: 0.6 }} /><div style={{ position: "absolute", left: 360, top: 0, width: 330 * grow, height: 50, background: C.red }} /></div>
        <div dir="ltr" style={{ position: "absolute", left: 40, top: 360, fontFamily: FONT.ui, fontSize: 26, fontWeight: 700, color: C.red, opacity: grow }}>+ 1 stored column for every row (50,000 values)</div>
        <div dir="ltr" style={{ position: "absolute", left: 40, top: 420, fontFamily: FONT.ui, fontSize: 24, color: C.dim, opacity: grow }}>The column stays in memory even when no report uses it.</div>
      </Box>
      <Box x={1020} y={130} w={800} h={690} c={C.purple} title="SUMX measure" a={ramp(f, tSumx)}>
        <div dir="ltr" style={{ position: "absolute", left: 40, top: 90, fontFamily: FONT.mono, fontSize: 21, color: C.text, lineHeight: "44px", width: 730, whiteSpace: "normal" }}>{typed("Total Revenue = SUMX(Fact_Sales, Fact_Sales[Quantity] * Fact_Sales[UnitPrice])", f, tSumx + 6, 40)}</div>
        <div dir="ltr" style={{ position: "absolute", left: 40, top: 250, fontFamily: FONT.ui, fontSize: 24, color: C.dim }}>Model size</div>
        <div style={{ position: "absolute", left: 40, top: 292, width: 720, height: 50, borderRadius: 10, background: C.bg, border: `2px solid ${C.line}`, overflow: "hidden" }}><div style={{ width: 360, height: 50, background: C.dim, opacity: 0.6 }} /></div>
        <div dir="ltr" style={{ position: "absolute", left: 40, top: 360, fontFamily: FONT.ui, fontSize: 26, fontWeight: 700, color: C.purple, opacity: ramp(f, tLean) }}>0 extra columns stored</div>
        <div dir="ltr" style={{ position: "absolute", left: 40, top: 420, fontFamily: FONT.ui, fontSize: 24, color: C.dim, opacity: ramp(f, tLean) }}>Row Context lives only while the measure runs.</div>
      </Box>
      {f >= tLean && <Neon x={1020} y={130} w={800} h={690} c={C.purple} a={ramp(f, tLean)} r={18} />}
      <Chip x={100} y={850} w={800} h={92} c={C.blue} a={ramp(f, tCol)}><Tx x={20} y={8} w={760} h={34} size={22} bold color={C.blue}>Existing numeric column</Tx><Tx x={20} y={46} w={760} h={34} size={22} color="#fff" font={FONT.mono}>→ SUM(Table[Column])</Tx></Chip>
      <Chip x={1020} y={850} w={800} h={92} c={C.purple} a={ramp(f, tSumx)}><Tx x={20} y={8} w={760} h={34} size={22} bold color={C.purple}>Math between columns</Tx><Tx x={20} y={46} w={760} h={34} size={22} color="#fff" font={FONT.mono}>→ SUMX(Table, Expression)</Tx></Chip>
      <Caption f={f} t0={at("start", 0.8)} t1={tLean} color={C.blue} text="Architecture Selection → Use SUM for Existing Columns, SUMX for On-the-Fly Mathematics" />
      <Caption f={f} t0={tLean + 6} t1={dur - 6} color={C.purple} text="Memory Optimization → Replacing Calculated Columns with SUMX Keeps Models Lean" />
    </Stage>
  );
};

// ---------------- Scene 5: enterprise ----------------
const bStat = BRANCHES.map((_, b) => { const rs = FACT.filter((r) => r.branch === b); const v = rs.reduce((a, r) => a + amt(r), 0); return [fmt(v), fmt(Math.round(v / Math.max(1, rs.length)))]; });
const PIV: string[][] = [["Row Labels", "Revenue", "Avg Line"], ...BRANCHES.map((b, i) => [b, bStat[i][0], bStat[i][1]]), ["Grand Total", fmt(ALL), fmt(Math.round(ALL / FACT.length))]];
const S5: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[4]; const dur = s1 - s0; const at = mk("c5", s0);
  const tM = at("measure", 0.2), tRef = at("ms", -2.2), tSeal = at("end", 0.5);
  const rb = rib("Data", "ra"); const done = f >= tRef + 50;
  const wps = gw([{ t: 0, x: 600, y: 520 }, { t: tRef - 30, x: rb.x + 26, y: rb.y + 30 }, { t: tRef, x: rb.x + 26, y: rb.y + 30, click: true }, { t: tRef + 50, x: 700, y: 520 }]);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab="Data" name="A2" formula="Cairo" sel={{ r1: 1, c1: 0, r2: 1, c2: 0 }} data={PIV} right={[1, 2]} tableCols={3} paneW={M.pane} pane={<PTFields x={M.win.w - M.pane} h={460} rows="Branch" vals="Revenue, Avg Line" />}
        hover={f >= tRef - 8 && f < tRef ? "ra" : undefined} down={f >= tRef && f < tRef + 4}>
        {f >= at("file", -0.5) && f < tM && <Neon x={255} y={2} w={250} h={26} c={C.amber} a={ramp(f, at("file", -0.5))} r={4} />}
        {f >= tM && (
          <div style={abs(340, 196, 760, 130, { opacity: ramp(f, tM, 10), background: "rgba(15,23,42,0.97)", border: `3px solid ${C.green}`, borderRadius: 10, boxSizing: "border-box" })}>
            <Tx x={16} y={6} w={770} h={24} size={14} bold color={C.green}>Measures · no calculated column added</Tx>
            <Tx x={16} y={32} w={770} h={44} size={12.5} color="#fff" font={FONT.mono} style={{ whiteSpace: "normal", lineHeight: "20px" }}>{typed("Revenue := SUMX(Fact_Sales, Fact_Sales[Quantity] * Fact_Sales[UnitPrice])", f, tM + 4, 40)}</Tx>
            <Tx x={16} y={80} w={770} h={44} size={12.5} color="#fff" font={FONT.mono} style={{ whiteSpace: "normal", lineHeight: "20px" }}>{typed("Avg Line := AVERAGEX(Fact_Sales, Fact_Sales[Quantity] * Fact_Sales[UnitPrice])", f, tM + 70, 40)}</Tx>
          </div>
        )}
        {f >= tRef && f < tRef + 50 && <Chip x={340} y={346} w={420} h={50} c={C.blue} a={ramp(f, tRef, 6) * (1 - ramp(f, tRef + 40, 8))}><Tx x={16} y={0} w={380} h={44} size={16} bold color="#fff">Refresh All — iterating rows…</Tx></Chip>}
        {done && f < tSeal && <Chip x={340} y={346} w={460} h={64} c={C.green} a={ramp(f, tRef + 50, 8)}><Tx x={16} y={6} w={420} h={26} size={17} bold color={C.green}>Iterator measures updated ✓</Tx><Tx x={16} y={32} w={430} h={24} size={13} color="#E2E8F0">Same table size, zero extra columns</Tx></Chip>}
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} fade={1 - ramp(f, tSeal, 16)} />
      <Seal f={f} t={tSeal} title="ITERATORS READY" sub="SUMX & AVERAGEX Mastered" marks={["SUM · AVERAGE · MIN · MAX", "SUMX · AVERAGEX", "Temporary Row Context", "SUM vs SUMX rule"]} />
      <Caption f={f} t0={at("start", 0.8)} t1={tSeal - 4} color={C.green} text="Enterprise Function Pipeline → Deploy SUMX & AVERAGEX Across 50,000 Sales Transactions" />
      <Caption f={f} t0={tSeal + 10} t1={dur - 6} color={C.green} text="Zero Storage Overhead → In-Memory Iterator Evaluation without Extra Columns" />
    </Stage>
  );
};

const S6: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[5]; const at = mk("c6", s0);
  return <Outro f={f} dur={s1 - s0} tStart={at("start")} tUnit={at("unit")} tDl={at("dl")} tNext={at("next")} unitNote={`Unit ${UNIT} of ${TOTAL_UNITS} in progress · lesson 3 of the unit`}
    skills={["Aggregators: SUM, AVERAGE, MIN, MAX", "Iterators: SUMX, AVERAGEX", "Temporary Row Context", "Choosing SUM vs SUMX", "Unit 12 · DAX & Evaluation Context"]}
    nextAr={`الدرس ${LESSON + 1} — الوحدة ${UNIT} من ${TOTAL_UNITS}`} nextEn="CALCULATE, FILTER & Context Modification" />;
};

const SCENES = [S1, S2, S3, S4, S5, S6];
export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(VOICE)} />
    {SC.map(([a, b], i) => {
      const Sc = SCENES[i];
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}><Sc /></Sequence>
      );
    })}
  </AbsoluteFill>
);
void Rect; void gx; void gy; void PQ_SQL;
