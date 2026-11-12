import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, M, VOICE, LOGO, gx, gy, LESSON, TOTAL_LESSONS, UNIT, TOTAL_UNITS, TITLE_AR, TITLE_EN } from "./theme";
import { CUE, SC } from "./sync";
import {
  FONT, Stage, Header, Caption, Cursor, WP, Neon, Tx, Rect, abs, ExcelWin, PPWin, PPCol, PTFields, Slicer, slicerItem, rib, tabAt, ppCellBox,
  CUSTOMERS, BRANCHES, CATS, FACT, FactRow, amt, sumWhere, custTotal, prog, eo, lerp, typed, fmt, Sel, Ico,
} from "./kit";

const mk = (id: string, s0: number) => (n: string, o = 0) => Math.round((CUE[id + "_" + n] + o) * 30) - s0;
const gw = (w: WP[]): WP[] => w.map((p) => ({ ...p, x: gx(p.x), y: gy(p.y) }));
const ramp = (f: number, t: number, d = 10) => eo(prog(f, t, t + d));
const ALL = sumWhere(() => true);
const TOT = CUSTOMERS.map((_, i) => custTotal(i));
const SORTED = [...TOT].sort((a, b) => b - a);
const GOLD = SORTED[1], SILVER = SORTED[3];
const tier = (v: number) => (v >= GOLD ? "Gold" : v >= SILVER ? "Silver" : "Bronze");
const pivot = (b: number, c: number, tiers = false): string[][] => {
  const p = (r: FactRow) => (b < 0 || r.branch === b) && (c < 0 || r.cat === c);
  const rows: string[][] = [tiers ? ["Row Labels", "Total Sales", "Tier"] : ["Row Labels", "Total Sales"]];
  CUSTOMERS.forEach((n, i) => { const v = custTotal(i, p); if (v > 0) rows.push(tiers ? [n, fmt(v), tier(TOT[i])] : [n, fmt(v)]); });
  rows.push(tiers ? ["Grand Total", fmt(sumWhere(p)), ""] : ["Grand Total", fmt(sumWhere(p))]);
  return rows;
};
const Chip: React.FC<{ x: number; y: number; w: number; h?: number; c: string; a?: number; children?: React.ReactNode }> = ({ x, y, w, h = 76, c, a = 1, children }) => (
  <div style={abs(x, y, w, h, { opacity: a, background: "rgba(15,23,42,0.96)", border: `3px solid ${c}`, borderRadius: 10, boxSizing: "border-box" })}>{children}</div>
);
const FactGrid: React.FC<{ x: number; y: number; w: number; match: (r: FactRow) => boolean; shrink: number; color: string; label: string }> = ({ x, y, w, match, shrink, color, label }) => {
  const sw = (w - 16) / 8;
  const n = FACT.filter(match).length;
  return (
    <div style={abs(x, y, w, 60 + 6 * 36, { background: "#fff", border: "1px solid #A6A6A6", boxSizing: "border-box" })}>
      <Tx x={10} y={4} w={w - 20} h={24} size={14} bold>{label}</Tx><Tx x={10} y={28} w={w - 20} h={22} size={12.5} color={color} bold>{`${n} of ${FACT.length} rows in the current filter`}</Tx>
      {FACT.map((r, i) => {
        const m = match(r); const k = m ? 1 : 1 - 0.7 * shrink;
        return <div key={r.id} style={abs(8 + (i % 8) * sw + 2, 56 + Math.floor(i / 8) * 36, sw - 4, 32, { background: m ? color : "#E5E7EB", opacity: m ? 1 : 1 - 0.65 * shrink, transform: `scale(${k})`, borderRadius: 3 })}>
          <Tx x={0} y={0} w={sw - 4} h={32} size={11} align="center" color={m ? "#fff" : "#666"} font={FONT.mono}>{r.id}</Tx></div>;
      })}
    </div>
  );
};

// ---------------- Scene 1 ----------------
const S1: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[0]; const dur = s1 - s0; const at = mk("c1", s0);
  const tEng = at("engine", -1.5), tWrong = at("wrong", -1);
  const card = ramp(f, at("badge")) * (1 - ramp(f, tEng - 6));
  const chips = [["Row Context", C.amber, at("engine", -6)], ["Filter Context", C.green, at("engine", -4)], ["Context Transition", C.purple, at("engine", -2)]] as const;
  const dg = ramp(f, tEng);
  const t = f - tEng;
  const rowI = Math.floor(Math.max(0, t) / 26) % 5, colI = Math.floor(Math.max(0, t) / 38) % 6;
  const heads = ["Customer", "Branch", "Category", "Qty", "Price", "Amount"];
  const cw = 140, rh = 74;
  return (
    <Stage dur={dur} fin={0} fout={8}>
      <PPWin f={f} table="Fact_Sales" cols={[]} rows={[]} name="" formula="" dim={0.93} />
      <Header f={f} />
      <div style={{ position: "absolute", left: 360, top: 230, width: 1200, height: 540, opacity: card }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "rgba(30,41,59,0.94)", border: `2px solid ${C.blue}` }} />
        <div dir="rtl" style={{ position: "absolute", left: 0, top: 36, width: 1200, textAlign: "center", fontFamily: FONT.ar, fontSize: 34, color: C.dim }}>{`الوحدة ${UNIT} من ${TOTAL_UNITS} — DAX & Evaluation Context`}</div>
        <div dir="ltr" style={{ position: "absolute", left: 0, top: 100, width: 1200, textAlign: "center", fontFamily: FONT.ui, fontSize: 60, fontWeight: 700, color: C.text }}>Lesson {LESSON}</div>
        <div dir="ltr" style={{ position: "absolute", left: 0, top: 184, width: 1200, textAlign: "center", fontFamily: FONT.ui, fontSize: 42, fontWeight: 600, color: C.blue }}>{TITLE_EN}</div>
        <div dir="rtl" style={{ position: "absolute", left: 0, top: 262, width: 1200, textAlign: "center", fontFamily: FONT.ar, fontSize: 36, color: C.text }}>{TITLE_AR}</div>
        {chips.map(([tx, c, tt], i) => (
          <div key={tx} dir="ltr" style={{ position: "absolute", left: 60 + i * 380, top: 390, width: 350, height: 70, borderRadius: 35, border: `3px solid ${c}`, background: C.bg, color: C.text, fontFamily: FONT.ui, fontSize: 28, fontWeight: 600, textAlign: "center", lineHeight: "64px", opacity: ramp(f, tt), transform: `translateY(${(1 - ramp(f, tt)) * 18}px)` }}>{tx}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: dg }}>
        <div style={{ position: "absolute", left: 100, top: 130, width: 700, height: 830, borderRadius: 18, background: C.panel2, border: `2px solid ${C.red}`, opacity: ramp(f, tWrong) }}>
          <div dir="ltr" style={{ position: "absolute", left: 24, top: 16, height: 40, padding: "0 20px", borderRadius: 20, background: C.red, color: "#0F172A", fontFamily: FONT.ui, fontWeight: 700, fontSize: 22, lineHeight: "40px" }}>Without context awareness</div>
          <div dir="ltr" style={{ position: "absolute", left: 24, top: 80, fontFamily: FONT.mono, fontSize: 22, color: C.text }}>{typed("SalesTotal = SUM(Fact_Sales[SalesAmount])", f, tWrong + 8, 40)}</div>
          {CUSTOMERS.map((n, i) => (
            <div key={n} dir="ltr" style={{ position: "absolute", left: 24, top: 150 + i * 80, width: 650, height: 62, borderRadius: 12, border: `2px solid ${C.red}`, background: C.bg, opacity: ramp(f, tWrong + 40 + i * 12), fontFamily: FONT.mono, fontSize: 26, lineHeight: "58px", color: C.text, paddingLeft: 20, boxSizing: "border-box" }}>
              {n}<span style={{ position: "absolute", right: 20, color: C.red, fontWeight: 700 }}>{fmt(ALL)}</span></div>
          ))}
          <div dir="ltr" style={{ position: "absolute", left: 24, top: 650, width: 650, fontFamily: FONT.ui, fontSize: 24, color: C.red, opacity: ramp(f, tWrong + 130) }}>Same grand total on every row ✗</div>
        </div>
        <div style={{ position: "absolute", left: 860, top: 130, width: 960, height: 830, borderRadius: 18, background: C.panel2, border: `2px solid ${C.blue}` }}>
          <div dir="ltr" style={{ position: "absolute", left: 24, top: 16, height: 40, padding: "0 20px", borderRadius: 20, background: C.blue, color: "#0F172A", fontFamily: FONT.ui, fontWeight: 700, fontSize: 22, lineHeight: "40px" }}>Evaluation Context Dual Engine</div>
          <div style={{ position: "absolute", left: 40, top: 130, width: 6 * cw, height: 5 * rh + 56 }}>
            {heads.map((h, c) => <div key={h} dir="ltr" style={{ position: "absolute", left: c * cw, top: 0, width: cw - 4, height: 50, background: C.bg, border: `1px solid ${C.line}`, color: C.dim, fontFamily: FONT.ui, fontSize: 21, fontWeight: 600, lineHeight: "48px", textAlign: "center", boxSizing: "border-box" }}>{h}</div>)}
            {FACT.slice(0, 5).map((r, i) => [CUSTOMERS[r.cust], BRANCHES[r.branch], CATS[r.cat], String(r.qty), fmt(r.price), fmt(amt(r))].map((v, c) => (
              <div key={i + "_" + c} dir="ltr" style={{ position: "absolute", left: c * cw, top: 56 + i * rh, width: cw - 4, height: rh - 4, background: i === rowI && c === colI ? "rgba(56,189,248,0.35)" : C.bg, border: `1px solid ${i === rowI && c === colI ? C.blue : C.line}`, color: C.text, fontFamily: FONT.ui, fontSize: 22, lineHeight: `${rh - 6}px`, textAlign: "center", boxSizing: "border-box" }}>{v}</div>
            )))}
            <div style={{ position: "absolute", left: -6, top: 56 + rowI * rh - 4, width: 6 * cw + 6, height: rh + 4, border: `4px solid ${C.amber}`, borderRadius: 8, background: "rgba(245,158,11,0.12)", boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: colI * cw - 4, top: -6, width: cw + 4, height: 5 * rh + 62, border: `4px solid ${C.green}`, borderRadius: 8, background: "rgba(16,185,129,0.10)", boxSizing: "border-box" }} />
          </div>
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 640, fontFamily: FONT.ui, fontSize: 28, fontWeight: 700, color: C.amber }}>→ Row Context: one row at a time (iteration)</div>
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 700, fontFamily: FONT.ui, fontSize: 28, fontWeight: 700, color: C.green }}>↓ Filter Context: the visible subset (aggregation)</div>
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 770, fontFamily: FONT.ui, fontSize: 24, color: C.blue }}>Every DAX result = row context + filter context</div>
        </div>
      </div>
      <Caption f={f} t0={at("badge", 0.8)} t1={tEng - 4} color={C.blue} text="Lesson 58 → Evaluation Context Engine" />
      <Caption f={f} t0={tEng + 4} t1={dur - 6} color={C.blue} text="Evaluation Context Dual Engine → Row Context (Iteration) vs. Filter Context (Aggregation)" />
    </Stage>
  );
};

// ---------------- Scene 2: row context ----------------
const FCOLS: PPCol[] = [{ n: "SalesID", w: 90 }, { n: "Customer", w: 130 }, { n: "Quantity", w: 90, r: true }, { n: "UnitPrice", w: 100, r: true }, { n: "LineTotal", w: 130, r: true, calc: true }];
const S2: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[1]; const dur = s1 - s0; const at = mk("c2", s0);
  const tAuto = at("auto"), tScan = at("iter", 0.2), tLimit = at("limit");
  const hi = f < tScan ? -1 : Math.min(14, Math.floor((f - tScan) / 10));
  const rows = FACT.slice(0, 15).map((r, i) => [String(r.id), CUSTOMERS[r.cust], String(r.qty), fmt(r.price), hi >= i ? fmt(amt(r)) : ""]);
  const formula = typed("= [Quantity] * [UnitPrice]", f, tAuto + 6, 14);
  const cp = ppCellBox(FCOLS, 0, 4);
  const wps = gw([{ t: 0, x: 900, y: 300 }, { t: tAuto - 20, x: 700, y: 170 }, { t: tAuto, x: 700, y: 170, click: true }, { t: tScan - 14, x: cp.x + 60, y: cp.y + 11 }, { t: tScan, x: cp.x + 60, y: cp.y + 11 }, { t: tLimit - 10, x: 1000, y: 420 }]);
  const lim = ramp(f, tLimit + 4);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <PPWin f={f} table="Fact_Sales" cols={FCOLS} rows={rows} hi={hi} selCol={4} name="LineTotal" formula={formula}>
        {f >= at("start") && <Chip x={680} y={215} w={640} c={C.amber} a={ramp(f, at("start"), 12)}><Tx x={18} y={8} w={600} h={30} size={18} bold color={C.amber}>Row Context</Tx><Tx x={18} y={38} w={610} h={28} size={14.5} color="#E2E8F0">The engine sees the current row only</Tx></Chip>}
        {f >= tScan - 20 && <Chip x={680} y={310} w={640} h={90} c={C.amber} a={ramp(f, tScan - 20) * (1 - 0.0)}><Tx x={18} y={8} w={600} h={30} size={16} bold color="#fff" font={FONT.mono}>{hi >= 0 ? `Row ${hi + 1}: ${FACT[hi].qty} × ${fmt(FACT[hi].price)} = ${fmt(amt(FACT[hi]))}` : "Row 1: …"}</Tx><Tx x={18} y={44} w={610} h={30} size={14} color="#E2E8F0">Iterating row by row inside a calculated column</Tx></Chip>}
        {f >= tLimit && (
          <div style={abs(680, 430, 640, 170, { opacity: lim })}>
            <Rect x={0} y={20} w={230} h={64} fill="#0F172A" stroke={C.amber} sw={3} r={10}><Tx x={0} y={0} w={230} h={58} size={16} color="#fff" align="center" bold>Fact_Sales row</Tx></Rect>
            <Tx x={236} y={14} w={160} h={72} size={44} color={C.red} align="center" bold>✕</Tx>
            <Rect x={410} y={20} w={230} h={64} fill="#0F172A" stroke={C.line} sw={3} r={10}><Tx x={0} y={0} w={230} h={58} size={16} color="#94A3B8" align="center" bold>Dim_Customer</Tx></Rect>
            <Chip x={0} y={104} w={640} h={56} c={C.amber}><Tx x={16} y={0} w={610} h={50} size={16} color={C.amber} bold>Row Context has no auto-filtering power across relationships</Tx></Chip>
          </div>
        )}
      </PPWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("start", 0.6)} t1={tLimit - 6} color={C.amber} text="Row Context Architecture → Evaluates Current Row Values Only (No Auto-Filtering)" />
      <Caption f={f} t0={tLimit} t1={dur - 6} color={C.amber} text="Row-by-Row Iteration → Active inside Calculated Columns & Iterator Functions like SUMX" />
    </Stage>
  );
};

// ---------------- Scene 3: filter context ----------------
const S3: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[2]; const dur = s1 - s0; const at = mk("c3", s0);
  const tSl = at("slicers", -0.9), tC1 = at("slicers", 1.3), tC2 = at("slicers", 3.4), tBeam = at("beam", -1), tMeas = at("measure", 0.1);
  const b = f >= tC1 ? 0 : -1, c = f >= tC2 ? 0 : -1;
  const data = pivot(b, c);
  const match = (r: FactRow) => (f < tC1 || r.branch === 0) && (f < tC2 || r.cat === 0);
  const tNon = Math.min(f >= tC1 ? tC1 : 1e9, f >= tC2 ? tC2 : 1e9);
  const sx1 = 640, sx2 = 800, sy = 200;
  const wps = gw([{ t: 0, x: 500, y: 330 }, { t: tC1 - 22, x: slicerItem(sx1, sy, 140, 0)[0], y: slicerItem(sx1, sy, 140, 0)[1] }, { t: tC1, x: slicerItem(sx1, sy, 140, 0)[0], y: slicerItem(sx1, sy, 140, 0)[1], click: true },
    { t: tC2 - 20, x: slicerItem(sx2, sy, 140, 0)[0], y: slicerItem(sx2, sy, 140, 0)[1] }, { t: tC2, x: slicerItem(sx2, sy, 140, 0)[0], y: slicerItem(sx2, sy, 140, 0)[1], click: true }, { t: tMeas - 20, x: 500, y: 520 }]);
  const sl = ramp(f, tSl, 12);
  const tot = sumWhere((r) => r.branch === 0 && r.cat === 0);
  const sel: Sel = { r1: 1, c1: 0, r2: 1, c2: 0 };
  const beamA = ramp(f, tBeam, 8) * (1 - ramp(f, tBeam + 70, 12));
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab="Home" name="A2" formula={data[1][0]} sel={sel} data={data} right={[1]} tableCols={2} paneW={M.pane} pane={<PTFields x={M.win.w - M.pane} h={460} />}>
        {f >= at("start", 9) && f < tSl && <Neon x={30} y={180 + 26} w={160} h={20} c={C.green} a={ramp(f, at("start", 9)) * (1 - ramp(f, tSl - 14, 8))} r={2} />}
        <div style={{ opacity: sl }}>
          <Slicer x={sx1} y={sy} w={140} title="Branch" items={BRANCHES} sel={b} />
          <Slicer x={sx2} y={sy} w={140} title="Category" items={CATS} sel={c} />
          <FactGrid x={250} y={sy} w={370} match={match} shrink={ramp(f, tNon, 12)} color={C.green} label="Fact_Sales" />
        </div>
        {beamA > 0 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={M.win.w} height={M.win.h}>
            {[0, 1].map((i) => <path key={i} d={`M${i ? sx2 : sx1} ${sy + 80}C${i ? sx2 - 80 : sx1 - 40} ${sy + 150} 560 ${sy + 120} 622 ${sy + 120}`} stroke={C.green} strokeWidth={4} fill="none" strokeDasharray="14 10" strokeDashoffset={-f * 4} opacity={beamA} />)}
          </svg>
        )}
        {f >= tMeas && (
          <div style={abs(250, 440, 760, 110, { opacity: ramp(f, tMeas, 10), background: "rgba(15,23,42,0.97)", border: `3px solid ${C.green}`, borderRadius: 10, boxSizing: "border-box" })}>
            <Tx x={18} y={8} w={720} h={28} size={15} bold color="#fff" font={FONT.mono}>{typed("Total Sales := SUM(Fact_Sales[SalesAmount])", f, tMeas + 4, 34)}</Tx>
            <Tx x={18} y={46} w={720} h={50} size={20} bold color={C.green}>{f >= tMeas + 50 ? `Cairo + Electronics → ${fmt(tot)}` : ""}</Tx>
          </div>
        )}
        {f >= tMeas + 50 && <Neon x={30} y={180 + 20 + 22 * 5 - 22 * 0 + 2 - 100 + (data.length - 1) * 20 + 0} w={160} h={20} c={C.green} a={0.9} r={2} />}
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("start", 1)} t1={tMeas - 4} color={C.green} text="Filter Context Architecture → Dynamic Data Subset Formed by Slicers & Report Headers" />
      <Caption f={f} t0={tMeas} t1={dur - 6} color={C.green} text="Dynamic Aggregation → Measures Evaluate Exclusively Inside Active Filter Boundaries" />
    </Stage>
  );
};

// ---------------- Scene 4: context transition ----------------
const DCOLS: PPCol[] = [{ n: "CustomerID", w: 100 }, { n: "CustomerName", w: 160 }, { n: "City", w: 130 }, { n: "SalesTotal", w: 170, r: true, calc: true }];
const CITY = ["Cairo", "Cairo", "Giza", "Giza", "Alexandria", "Mansoura"];
const S4: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[3]; const dur = s1 - s0; const at = mk("c4", s0);
  const tF1 = at("start", 0.6), tWrong = at("wantto"), tM = at("call", 0.2), tCalc = at("calc", 0.1), tShift = at("shift", -0.4);
  const rowT = (i: number) => tShift + i * 14;
  const stage = f >= tShift ? 3 : f >= tWrong ? 1 : 0;
  const f1 = "= SUM(Fact_Sales[SalesAmount])", f2 = "= [Total Sales]", f3 = "= CALCULATE(SUM(Fact_Sales[SalesAmount]))";
  const formula = f >= tCalc ? typed(f3, f, tCalc, 24) : f >= tM ? typed(f2, f, tM, 16) : typed(f1, f, tF1, 14);
  const rows = CUSTOMERS.map((n, i) => [`C-0${i + 1}`, n, CITY[i], stage === 1 ? fmt(ALL) : stage === 3 && f >= rowT(i) ? fmt(TOT[i]) : stage === 3 ? fmt(ALL) : ""]);
  const cur = stage === 3 ? Math.min(5, Math.floor((f - tShift) / 14)) : -1;
  const doneAll = stage === 3 && f >= rowT(5) + 14;
  const hiRow = doneAll ? -1 : cur;
  const wrong = stage === 1 || (stage === 3 && !doneAll);
  const ok = ramp(f, tShift);
  const match = (r: FactRow) => (cur < 0 ? true : r.cust === cur);
  const hc = cur < 0 ? C.red : C.purple;
  const cp = ppCellBox(DCOLS, 0, 3);
  const wps = gw([{ t: 0, x: 900, y: 350 }, { t: tF1 - 20, x: 560, y: 170 }, { t: tF1 - 2, x: 560, y: 170, click: true }, { t: tM - 4, x: 700, y: 170 }, { t: tShift, x: cp.x + 80, y: cp.y + 11 }]);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <PPWin f={f} table="Dim_Customer" cols={DCOLS} rows={rows} hi={hiRow} hiColor={C.purple} selCol={3} name="SalesTotal" formula={formula} calc={[{ n: "Total Sales", v: "=SUM(Fact_Sales[SalesAmount])" }]}>
        {stage === 1 && !doneAll && <Neon x={34 + 100 + 160 + 130} y={180 + 26 + 0 - 26 + 26 - 26 + 26 - 0} w={170} h={6 * 22} c={C.red} a={ramp(f, tWrong)} r={4} />}
        {stage === 1 && <Chip x={800} y={460} w={520} h={84} c={C.red} a={ramp(f, tWrong + 6)}><Tx x={16} y={8} w={490} h={28} size={17} bold color={C.red}>Wrong: the same grand total on every row</Tx><Tx x={16} y={40} w={490} h={36} size={13.5} color="#E2E8F0">No filter reaches Fact_Sales from the current row</Tx></Chip>}
        {f >= tM && <div style={{ opacity: ramp(f, tM, 10) }}><FactGrid x={700} y={215} w={620} match={match} shrink={cur < 0 ? 0 : 1} color={hc === C.red ? "#64748B" : C.purple} label={cur < 0 ? "Fact_Sales" : `Fact_Sales filtered by CustomerID = C-0${cur + 1}`} /></div>}
        {f >= tShift - 10 && <Neon x={240} y={156} w={M.win.w - 256} h={22} c={C.purple} a={ok * (1 - ramp(f, rowT(5) + 30, 10))} r={3} />}
        {f >= tShift && <Chip x={800} y={460} w={520} h={84} c={C.purple} a={ok}><Tx x={16} y={8} w={490} h={28} size={17} bold color={C.purple}>Context Transition</Tx><Tx x={16} y={40} w={490} h={36} size={13.5} color="#E2E8F0">Row values become a filter on Fact_Sales for each customer</Tx></Chip>}
      </PPWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("start", 0.8)} t1={tM - 6} color={wrong ? C.red : C.purple} text="Context Transition Mechanics → Converts Current Row Context into Equivalent Filter Context" />
      <Caption f={f} t0={tM} t1={dur - 6} color={C.purple} text="Explicit Measure Call → Implicitly Invokes CALCULATE to Filter Models Row-by-Row" />
    </Stage>
  );
};

// ---------------- Scene 5: enterprise ----------------
const S5: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[4]; const dur = s1 - s0; const at = mk("c5", s0);
  const tRows = at("rows", -1), tRef = at("ms", -1.2), tSeal = at("end");
  const showTier = f >= tRows + 40;
  const data = pivot(-1, -1, showTier);
  const rb = rib("Data", "ra");
  const refreshing = f >= tRef && f < tRef + 50;
  const wps = gw([{ t: 0, x: 600, y: 520 }, { t: tRef - 30, x: rb.x + 26, y: rb.y + 30 }, { t: tRef, x: rb.x + 26, y: rb.y + 30, click: true }, { t: tRef + 50, x: 700, y: 520 }]);
  const seal = ramp(f, tSeal, 16);
  const marks = ["Row Context", "Filter Context", "Context Transition", "Explicit Measures"];
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab="Data" name="A2" formula="Nile Tech" sel={{ r1: 1, c1: 0, r2: 1, c2: 0 }} data={data} right={[1]} tableCols={showTier ? 3 : 2} paneW={M.pane} pane={<PTFields x={M.win.w - M.pane} h={460} vals={showTier ? "Total Sales, Tier" : "Total Sales"} />}
        hover={f >= tRef - 8 && f < tRef ? "ra" : undefined} down={f >= tRef && f < tRef + 4}>
        {f >= at("file", -0.5) && f < tRows && <Neon x={255} y={2} w={250} h={26} c={C.amber} a={ramp(f, at("file", -0.5))} r={4} />}
        {f >= tRows && (
          <div style={abs(330, 200, 780, 96, { opacity: ramp(f, tRows, 10), background: "rgba(15,23,42,0.97)", border: `3px solid ${C.purple}`, borderRadius: 10, boxSizing: "border-box" })}>
            <Tx x={16} y={6} w={750} h={26} size={15} bold color={C.purple}>Dim_Customer[Tier] — uses Context Transition</Tx>
            <Tx x={16} y={34} w={750} h={56} size={13} color="#fff" font={FONT.mono} style={{ whiteSpace: "normal", lineHeight: "20px" }}>{typed(`=IF([Total Sales]>=${GOLD},"Gold",IF([Total Sales]>=${SILVER},"Silver","Bronze"))`, f, tRows + 4, 36)}</Tx>
          </div>
        )}
        {refreshing && <Chip x={330} y={320} w={420} h={50} c={C.blue} a={ramp(f, tRef, 6) * (1 - ramp(f, tRef + 40, 8))}><Tx x={16} y={0} w={380} h={44} size={16} bold color="#fff">Refresh All — recalculating contexts…</Tx></Chip>}
        {f >= tRef + 50 && f < tSeal && <Chip x={330} y={320} w={420} h={64} c={C.green} a={ramp(f, tRef + 50, 8)}><Tx x={16} y={6} w={380} h={26} size={17} bold color={C.green}>Evaluation complete ✓</Tx><Tx x={16} y={32} w={390} h={24} size={13} color="#E2E8F0">Every customer total and tier updated</Tx></Chip>}
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} fade={1 - seal} />
      {seal > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: seal }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.84)" }} />
          <div style={{ position: "absolute", left: 660, top: 190, width: 600, height: 600, transform: `scale(${0.8 + 0.2 * seal})`, transformOrigin: "300px 300px" }}>
            <svg width={600} height={600} viewBox="0 0 600 600"><circle cx={300} cy={300} r={270} fill={C.panel} stroke={C.green} strokeWidth={10} /><circle cx={300} cy={300} r={236} fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="6 12" opacity={0.7} />
              <path d="M200 305l70 70 140-160" fill="none" stroke={C.green} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={420} strokeDashoffset={420 * (1 - prog(f, tSeal + 6, tSeal + 30))} /></svg>
            <div dir="ltr" style={{ position: "absolute", left: 0, top: 410, width: 600, textAlign: "center", fontFamily: FONT.ui, fontSize: 42, fontWeight: 700, color: C.text }}>EVALUATION CONTEXT</div>
            <div dir="ltr" style={{ position: "absolute", left: 0, top: 466, width: 600, textAlign: "center", fontFamily: FONT.ui, fontSize: 28, color: C.green }}>Mastered</div>
          </div>
          {marks.map((m, i) => (
            <div key={m} dir="ltr" style={{ position: "absolute", left: i < 2 ? 130 : 1330, top: 300 + (i % 2) * 190, width: 460, height: 72, borderRadius: 36, border: `3px solid ${C.green}`, background: C.panel, color: C.text, fontFamily: FONT.ui, fontSize: 28, fontWeight: 600, lineHeight: "66px", textAlign: "center", opacity: ramp(f, tSeal + 50 + i * 60), transform: `translateX(${(1 - ramp(f, tSeal + 50 + i * 60)) * (i < 2 ? -40 : 40)}px)` }}>✓ {m}</div>
          ))}
        </div>
      )}
      <Caption f={f} t0={at("start", 0.6)} t1={tSeal - 4} color={C.green} text="Enterprise Evaluation Pipeline → Execute Context Transition Across 50,000 Customer Records" />
      <Caption f={f} t0={tSeal + 10} t1={dur - 6} color={C.green} text="Evaluation Context Seal → Row, Filter & Context Transition Mastered" />
    </Stage>
  );
};

// ---------------- Scene 6: outro ----------------
const S6: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[5]; const dur = s1 - s0; const at = mk("c6", s0);
  const pct = (LESSON / TOTAL_LESSONS) * 100;
  const fill = eo(prog(f, at("unit"), at("unit", 3)));
  const skills = ["Row Context", "Filter Context", "Context Transition", "Explicit measures & CALCULATE", "Unit 12 · DAX & Evaluation Context"];
  const nx = ramp(f, at("next"), 14);
  return (
    <Stage dur={dur} fin={8} fout={26}>
      <Header f={f} />
      <div style={{ position: "absolute", left: 130, top: 120, width: 1660, height: 860, borderRadius: 32, background: "rgba(30,41,59,0.88)", border: `2px solid ${C.line}`, opacity: ramp(f, 4, 14) }}>
        <Img src={staticFile(LOGO)} style={{ position: "absolute", left: 50, top: 50, width: 330, height: 330, objectFit: "contain", opacity: ramp(f, 10, 16) }} />
        <div dir="ltr" style={{ position: "absolute", left: 20, top: 400, width: 420, textAlign: "center", whiteSpace: "nowrap", fontFamily: FONT.ui, fontSize: 28, fontWeight: 700, color: C.text }}>Manzooma Excel Masterclass</div>
        <div dir="rtl" style={{ position: "absolute", left: 40, top: 446, width: 380, textAlign: "center", fontFamily: FONT.ar, fontSize: 30, color: C.dim }}>منظومة أكاديمي</div>
        <div style={{ position: "absolute", left: 460, top: 44, width: 1160 }}>
          <div dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 46, fontWeight: 700, color: C.green, opacity: ramp(f, at("start"), 12) }}>✓ Lesson {LESSON} complete</div>
          <div dir="rtl" style={{ fontFamily: FONT.ar, fontSize: 38, fontWeight: 500, color: C.text, marginTop: 6, opacity: ramp(f, at("start"), 12) }}>{TITLE_AR}</div>
          <div dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 26, color: C.dim, marginTop: 4 }}>{TITLE_EN}</div>
          <div dir="ltr" style={{ marginTop: 28, fontFamily: FONT.ui, fontSize: 24, color: C.text, display: "flex", justifyContent: "space-between", width: 1100 }}><span>{`Course progress  ${LESSON} / ${TOTAL_LESSONS}`}</span><span style={{ color: C.green, fontWeight: 700 }}>{`${(pct * fill).toFixed(1)}%`}</span></div>
          <div style={{ marginTop: 8, width: 1100, height: 20, borderRadius: 10, background: C.bg }}><div style={{ width: 1100 * (pct / 100) * fill, height: 20, borderRadius: 10, background: C.green }} /></div>
          <div dir="ltr" style={{ marginTop: 18, fontFamily: FONT.ui, fontSize: 22, color: C.dim }}>{`Unit ${UNIT} of ${TOTAL_UNITS} in progress · lesson 2 of the unit`}</div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "row", gap: 8, width: 1100, direction: "ltr" }}>
            {Array.from({ length: TOTAL_UNITS }).map((_, i) => <div key={i} style={{ flex: 1, height: 14, borderRadius: 7, background: i < UNIT - 1 ? (i < (UNIT - 1) * fill ? C.green : C.bg) : i === UNIT - 1 ? (fill > 0.9 ? C.purple : C.bg) : C.bg, border: `1px solid ${C.line}` }} />)}
          </div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 6 }}>
            {skills.map((s, i) => (
              <div key={s} dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 28, color: C.text, opacity: ramp(f, at("unit", 1.5 + i * 1.3), 10), transform: `translateX(${(1 - ramp(f, at("unit", 1.5 + i * 1.3), 10)) * 24}px)` }}><span style={{ color: C.green, fontWeight: 700 }}>✓ </span>{s}</div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, top: 520, width: 380, opacity: ramp(f, at("dl"), 12) }}>
          <div dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 21, color: C.dim, textAlign: "center" }}>Exercises &amp; practice file</div>
          <div dir="ltr" style={{ marginTop: 8, padding: "10px 0", borderRadius: 14, border: `2px solid ${C.blue}`, color: C.blue, fontFamily: FONT.mono, fontSize: 22, textAlign: "center" }}>solutions.gomaaintelligence.me</div>
          <div dir="ltr" style={{ marginTop: 10, padding: "10px 0", borderRadius: 14, border: `2px solid ${C.line}`, color: C.text, fontFamily: FONT.mono, fontSize: 18, textAlign: "center" }}>manzooma_sales_2026.xlsx</div>
        </div>
        <div style={{ position: "absolute", left: 460, top: 690, width: 1130, height: 130, borderRadius: 22, background: C.bg, border: `3px solid ${C.purple}`, opacity: nx, transform: `translateY(${(1 - nx) * 24}px)` }}>
          <div dir="rtl" style={{ position: "absolute", left: 30, top: 14, width: 1070, fontFamily: FONT.ar, fontSize: 26, color: C.purple, fontWeight: 700 }}>{`الدرس ${LESSON + 1} — الوحدة ${UNIT} من ${TOTAL_UNITS}`}</div>
          <div dir="ltr" style={{ position: "absolute", left: 30, top: 54, width: 1070, fontFamily: FONT.ui, fontSize: 36, fontWeight: 700, color: C.text }}>Aggregators vs. Iterators in DAX</div>
        </div>
      </div>
    </Stage>
  );
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
void Ico; void tabAt; void gx; void gy;
