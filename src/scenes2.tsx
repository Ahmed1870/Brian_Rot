import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { C, M, GRID_Y, LESSON, LESSONS, UNIT, UNITS } from "./theme";
import { FUI, FAR, FMONO } from "./fonts";
import { ExcelWindow, Grid, Cell, Caption, Callout, ChartBox, Plot, Dialog, Glass, Logo, cellRect, colX, prog, eo, eio, typed, vis } from "./kit";
import { anch, SC_START } from "./timing";
import { SEAS_Y, seasonalModel, slope, intercept, rsq, forecastLinear, enterprise, f1, f2 } from "./data";

const hdr = (t: string): Cell => ({ v: t, b: true, bg: "#E8F1EC" });

/* ===================== SC04 : FORECAST.ETS + confidence band ===================== */
const WD4 = [96, 96, 30, 110, 140, 130];
export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const a = anch(3);
  const mdl = seasonalModel(12);
  const cells: Record<string, Cell> = { A1: hdr("Month #"), B1: hdr("Sales"), D1: hdr("Target"), E1: hdr("ETS Forecast"), F1: hdr("± 95% CI") };
  SEAS_Y.forEach((v, i) => { cells[`A${i + 2}`] = { v: String(i + 1) }; cells[`B${i + 2}`] = { v: String(v) }; });
  cells.D2 = { v: "25" };
  const t1 = a(3, 0.15), t2 = a(3, 0.55);
  const fx1 = "=FORECAST.ETS(D2,B2:B25,A2:A25)", fx2 = "=FORECAST.ETS.CONFINT(D2,B2:B25,A2:A25)";
  if (f >= t1 + 50) cells.E2 = { v: f1(mdl.fc[0].v) };
  if (f >= t2 + 50) cells.F2 = { v: f1(mdl.fc[0].ci) };
  let nameBox = "A1", formula = "", editing = false, sel: { a: string; b?: string } = { a: "A1" };
  if (f >= t1 && f < t2) { nameBox = "E2"; sel = { a: "E2" }; formula = f < t1 + 50 ? typed(fx1, f, t1 + 4, 22) : fx1; editing = f < t1 + 50; }
  if (f >= t2) { nameBox = "F2"; sel = { a: "F2" }; formula = f < t2 + 50 ? typed(fx2, f, t2 + 4, 24) : fx2; editing = f < t2 + 50; }
  const onData = f >= a(2, 0.45);
  const dlgO = vis(f, a(2, 0.72), a(3, 0.12), 12);
  const lin = eio(prog(f, a(1, 0.45), a(1, 0.9)));
  const ets = eio(prog(f, a(3, 0.05), a(3, 0.45)));
  const band = eio(prog(f, a(3, 0.5), a(3, 0.92)));
  const cw = 1060, ch = 560, cx = colX(7, WD4) + 40;
  const xs = Array.from({ length: 24 }, (_, i) => i + 1);
  const mL = slope(SEAS_Y, xs), bL = intercept(SEAS_Y, xs);
  const nF = Math.floor(12 * ets);
  return (
    <>
      <ExcelWindow tab={onData ? "Data" : "Home"} hl={onData && f < a(3, 0.12) ? "fsheet" : undefined} hlCol={C.amber} nameBox={nameBox} formula={formula} editing={editing} sheets={["Sales", "Forecast", "Seasonal"]} activeSheet={2} mode={editing ? "Enter" : "Ready"} f={f}>
        <Grid cells={cells} wd={WD4} sel={sel} f={f}>
          <ChartBox x={cx - colX(0)} y={6} w={cw} h={ch} title="Monthly Sales: history and forecast" o={eo(prog(f, a(0, 0.3), a(0, 0.6)))}>
            <Plot w={cw} h={ch} xd={[1, 36]} yd={[100, 520]} tx={[1, 6, 12, 18, 24, 30, 36]} ty={[100, 200, 300, 400, 500]} xt="Month #" yt="Sales (K EGP)">
              {(sx, sy) => (
                <g>
                  {band > 0 ? <polygon fill={C.amber} opacity="0.28" points={[...mdl.fc.slice(0, Math.max(1, Math.round(12 * band) || 1)).map((p) => `${sx(p.t)},${sy(p.hi)}`), ...mdl.fc.slice(0, Math.max(1, Math.round(12 * band) || 1)).reverse().map((p) => `${sx(p.t)},${sy(p.lo)}`)].join(" ")} /> : null}
                  <polyline fill="none" stroke="#4472C4" strokeWidth="3.5" points={SEAS_Y.map((v, i) => `${sx(i + 1)},${sy(v)}`).join(" ")} />
                  {lin > 0 ? <line x1={sx(1)} y1={sy(bL + mL)} x2={sx(1 + 35 * lin)} y2={sy(bL + mL * (1 + 35 * lin))} stroke={C.red} strokeWidth="4" strokeDasharray="10 6" /> : null}
                  {ets > 0 ? <polyline fill="none" stroke={C.amber} strokeWidth="4.5" style={{ filter: `drop-shadow(0 0 7px ${C.amber})` }} points={[`${sx(24)},${sy(SEAS_Y[23])}`, ...mdl.fc.slice(0, nF).map((p) => `${sx(p.t)},${sy(p.v)}`)].join(" ")} /> : null}
                  {lin > 0.9 && f < a(2, 0.5) ? [11, 23].map((x) => <g key={x}><circle cx={sx(x)} cy={sy(SEAS_Y[x - 1])} r="15" fill="none" stroke={C.red} strokeWidth="3.5" /></g>) : null}
                </g>
              )}
            </Plot>
          </ChartBox>
        </Grid>
      </ExcelWindow>
      {dlgO > 0.01 ? (
        <Dialog x={560} y={330} w={760} h={520} title="Create Forecast Worksheet" ok="Create" o={dlgO}>
          <div style={{ height: 150, background: "#fff", border: "1px solid #ADADAD", position: "relative" }}>
            <svg width="720" height="150"><polyline fill="none" stroke="#4472C4" strokeWidth="3" points={SEAS_Y.map((v, i) => `${20 + i * 17},${140 - (v - 150) * 0.55}`).join(" ")} /><polyline fill="none" stroke={C.amber} strokeWidth="3" points={mdl.fc.map((p) => `${20 + (p.t - 1) * 17},${140 - (p.v - 150) * 0.55}`).join(" ")} /></svg>
          </div>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "250px 1fr", rowGap: 8, fontSize: 18 }}>
            <span>Forecast End</span><span>36</span><span>Forecast Start</span><span>25</span><span>Confidence Interval</span><span style={{ color: "#B45F06", fontWeight: 700 }}>95%</span><span>Seasonality</span><span>◉ Detect Automatically</span><span>Include forecast statistics</span><span>☑</span>
          </div>
        </Dialog>
      ) : null}
      <Caption tag="Seasonal" col={C.red} lead="A straight line cuts through seasonal peaks" f={f} a={a(1, 0.0)} b={a(2, 0.4)} />
      <Caption tag="Seasonal Forecasting" col={C.amber} lead="Captures cyclic peaks" code="FORECAST.ETS(Target_Date, Values, Timeline)" f={f} a={a(2, 0.4)} b={a(3, 0.5)} />
      <Caption tag="95% Confidence" col={C.amber} lead="Upper & lower bounds" code="FORECAST.ETS.CONFINT(...)   Data › Forecast Sheet" f={f} a={a(3, 0.5)} b={a(3, 1.0) + 40} />
    </>
  );
};

/* ===================== SC05 : enterprise run on manzooma_sales_2026.xlsx ===================== */
const WD5 = [110, 120, 175, 100, 30, 210, 100, 30, 110, 140, 170, 150, 110, 110];
export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const a = anch(4);
  const E = enterprise();
  const mdl = seasonalModel(6, E.sa);
  const cells: Record<string, Cell> = { A1: hdr("Month"), B1: hdr("Transactions"), C1: hdr("Marketing Spend"), D1: hdr("Sales"), F1: hdr("Metric"), G1: hdr("Value"), I1: hdr("Month"), J1: hdr("Planned Spend"), K1: hdr("FORECAST.LINEAR"), L1: hdr("FORECAST.ETS"), M1: hdr("Lower 95%"), N1: hdr("Upper 95%") };
  E.lab.forEach((l, i) => { cells[`A${i + 2}`] = { v: l }; cells[`B${i + 2}`] = { v: E.tx[i].toLocaleString("en-US") }; cells[`C${i + 2}`] = { v: String(E.sp[i]) }; cells[`D${i + 2}`] = { v: String(E.sa[i]) }; });
  cells.A26 = { v: "Total", b: true }; cells.B26 = { v: E.tx.reduce((s, v) => s + v, 0).toLocaleString("en-US"), b: true };
  cells.F2 = { v: "R² (Sales vs Spend)", b: true };
  const fm = ["Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"];
  if (f >= a(1, 0.1)) fm.forEach((m, i) => { cells[`I${i + 2}`] = { v: m }; cells[`J${i + 2}`] = { v: String(E.plan[i]) }; });
  if (f < a(1, 0.1)) ["I1", "J1", "K1", "L1", "M1", "N1"].forEach((k) => delete cells[k]);
  const scroll = 7 * eio(prog(f, a(0, 0.35), a(0, 0.95))) * (1 - eio(prog(f, a(1, 0.0), a(1, 0.2))));
  const t1 = a(1, 0.25), t2 = a(1, 0.5), t3 = a(1, 0.72);
  const fx1 = "=RSQ(D2:D25,C2:C25)", fx2 = "=FORECAST.LINEAR(J2,$D$2:$D$25,$C$2:$C$25)", fx3 = "=FORECAST.ETS(I2,$D$2:$D$25,$A$2:$A$25)";
  if (f >= t1 + 36) cells.G2 = { v: f2(rsq(E.sa, E.sp)) };
  const nK = f >= t2 + 40 ? Math.min(6, 1 + Math.floor((f - t2 - 40) / 6)) : 0;
  for (let i = 0; i < nK; i++) cells[`K${i + 2}`] = { v: f1(forecastLinear(E.plan[i], E.sa, E.sp)) };
  const nL = f >= t3 + 40 ? Math.min(6, 1 + Math.floor((f - t3 - 40) / 6)) : 0;
  for (let i = 0; i < nL; i++) { cells[`L${i + 2}`] = { v: f1(mdl.fc[i].v) }; cells[`M${i + 2}`] = { v: f1(mdl.fc[i].lo) }; cells[`N${i + 2}`] = { v: f1(mdl.fc[i].hi) }; }
  let nameBox = "A1", formula = "", editing = false, sel: { a: string; b?: string } = { a: "A1" };
  if (f >= t1 && f < t2) { nameBox = "G2"; sel = { a: "G2" }; formula = f < t1 + 36 ? typed(fx1, f, t1 + 4, 22) : fx1; editing = f < t1 + 36; }
  if (f >= t2 && f < t3) { nameBox = nK >= 6 ? "K2:K7" : "K2"; sel = nK >= 6 ? { a: "K2", b: "K7" } : { a: "K2" }; formula = f < t2 + 40 ? typed(fx2, f, t2 + 4, 26) : fx2; editing = f < t2 + 40; }
  if (f >= t3) { nameBox = nL >= 6 ? "L2:N7" : "L2"; sel = nL >= 6 ? { a: "L2", b: "N7" } : { a: "L2" }; formula = f < t3 + 40 ? typed(fx3, f, t3 + 4, 26) : fx3; editing = f < t3 + 40; }
  const sealO = eo(prog(f, a(2, 0.35), a(2, 0.6)));
  const rg = cellRect("I2", "N7", WD5, scroll);
  return (
    <>
      <ExcelWindow tab="Formulas" nameBox={nameBox} formula={formula} editing={editing} sheets={["Sales", "Forecast", "Summary"]} activeSheet={2} mode={editing ? "Enter" : "Ready"} f={f}>
        <Grid cells={cells} wd={WD5} scroll={scroll} sel={sel} f={f} />
      </ExcelWindow>
      {f >= a(0, 0.05) ? <Glass x={1190} y={400} w={650} h={96} col={C.cyan} o={vis(f, a(0, 0.05), a(1, 0.2), 12)}>
        <div style={{ padding: "12px 22px", fontFamily: FUI, color: C.text }}><div style={{ fontSize: 28, fontFamily: FMONO }}>manzooma_sales_2026.xlsx</div><div style={{ fontSize: 23, color: C.mute }}>50,000 transactions → 24 monthly points</div></div>
      </Glass> : null}
      {nL >= 6 ? <Callout x={rg.x} y={rg.y} w={rg.w} h={rg.h} col={C.green} f={f} a={t3 + 80} b={a(2, 0.6)} /> : null}
      {sealO > 0.01 ? (
        <div style={{ position: "absolute", left: 1110, top: 700, width: 740, opacity: sealO, transform: `scale(${0.92 + 0.08 * sealO})`, background: "rgba(16,40,35,.96)", border: `3px solid ${C.green}`, borderRadius: 20, boxShadow: `0 0 34px ${C.green}`, padding: "18px 28px", fontFamily: FUI, color: C.text, display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="31" fill="none" stroke={C.green} strokeWidth="5" /><path d="M20 36l10 10 20-23" fill="none" stroke={C.green} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div><div style={{ fontSize: 34, fontWeight: 700 }}>Enterprise Forecasting Model</div><div style={{ fontSize: 24, color: C.green }}>Instant recalculation on aggregated data</div></div>
        </div>
      ) : null}
      <Caption tag="Enterprise Model" col={C.green} lead="Deploy on 50,000 rows" code="RSQ · FORECAST.LINEAR · FORECAST.ETS" f={f} a={a(0, 0.2)} b={a(2, 0.3)} />
      <Caption tag="High-Speed" col={C.green} lead="Predictive modeling engine, Q3 and Q4 projections" f={f} a={a(2, 0.3)} b={a(2, 1.0) + 60} />
    </>
  );
};

/* ===================== SC06 : outro ===================== */
export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const a = anch(5);
  const pct = (LESSON / LESSONS) * 100;
  const fade = 1 - eo(prog(f, 1110, 1140));
  const skills = ["SLOPE · INTERCEPT · RSQ", "FORECAST.LINEAR · TREND", "FORECAST.ETS · CONFINT · Forecast Sheet"];
  const rtl = { direction: "rtl" as const, fontFamily: FAR };
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 700px at 50% 30%, #1B2B4B 0%, ${C.bg} 70%)`, opacity: fade }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: eo(prog(f, a(0, 0), a(0, 0.4))) }}>
        <div style={{ display: "flex", justifyContent: "center" }}><Logo h={120} /></div>
        <div style={{ fontFamily: FUI, fontSize: 64, fontWeight: 700, color: C.text, marginTop: 8 }}>Manzooma Excel Masterclass</div>
        <div style={{ ...rtl, fontSize: 30, color: C.mute }}>منظومة أكاديمي</div>
      </div>
      <Glass x={110} y={380} w={870} h={470} col={C.green} o={eo(prog(f, a(1, 0), a(1, 0.3)))}>
        <div style={{ padding: "26px 36px", fontFamily: FUI, color: C.text }}>
          <div style={{ fontSize: 26, color: C.green }}>Lesson {LESSON} complete</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 4 }}>Linear Regression & Trend Forecasting</div>
          <div style={{ marginTop: 22 }}>{skills.map((s, i) => <div key={s} style={{ fontSize: 29, marginBottom: 12, opacity: eo(prog(f, a(1, 0.3) + i * 20, a(1, 0.3) + i * 20 + 14)) }}><span style={{ color: C.green, fontWeight: 700 }}>✓</span>  {s}</div>)}</div>
          <div style={{ marginTop: 26, ...rtl, fontSize: 26 }}>الدرس {LESSON} من {LESSONS} — الوحدة {UNIT} من {UNITS}</div>
          <div style={{ marginTop: 10, height: 22, borderRadius: 11, background: "#334155" }}><div style={{ width: `${pct * eio(prog(f, a(1, 0.2), a(1, 0.95)))}%`, height: 22, borderRadius: 11, background: C.green, boxShadow: `0 0 14px ${C.green}` }} /></div>
          <div style={{ fontSize: 24, color: C.mute, marginTop: 8 }}>{(pct * eio(prog(f, a(1, 0.2), a(1, 0.95)))).toFixed(1)}%</div>
        </div>
      </Glass>
      <Glass x={1010} y={380} w={800} h={200} col={C.cyan} o={eo(prog(f, a(2, 0.1), a(2, 0.4)))}>
        <div style={{ padding: "26px 34px", fontFamily: FUI, color: C.text }}>
          <div style={{ fontSize: 26, color: C.cyan }}>Practice files and exercises</div>
          <div style={{ fontSize: 40, fontFamily: FMONO, marginTop: 10 }}>solutions.gomaaintelligence.me</div>
          <div style={{ fontSize: 24, color: C.mute, marginTop: 8 }}>manzooma_sales_2026.xlsx</div>
        </div>
      </Glass>
      <Glass x={1010} y={610} w={800} h={240} col={C.purple} o={eo(prog(f, a(3, 0.15), a(3, 0.45)))}>
        <div style={{ padding: "26px 34px", fontFamily: FUI, color: C.text }}>
          <div style={{ fontSize: 26, color: C.purple }}>Next lesson · {LESSON + 1}</div>
          <div style={{ fontSize: 38, fontWeight: 700, marginTop: 8 }}>Scenario Analysis & Sensitivity Modeling</div>
          <div style={{ ...rtl, fontSize: 30, color: C.mute, marginTop: 10 }}>تحليل السيناريوهات والحساسية</div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};
