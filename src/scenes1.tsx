import React from "react";
import { useCurrentFrame } from "remotion";
import { C, M, GRID_Y } from "./theme";
import { FUI } from "./fonts";
import { ExcelWindow, Grid, Cell, Caption, Callout, ChartBox, Plot, Dialog, cellRect, prog, eo, eio, typed, vis, statsText, colX } from "./kit";
import { anch } from "./timing";
import { AD, SALES, MONTHS, slope, intercept, rsq, forecastLinear, trend, f1, f2, f4 } from "./data";

const hdr = (t: string): Cell => ({ v: t, b: true, bg: "#E8F1EC" });
const fixed = (n: number) => String(Math.round(n));

/* ===================== SC01 : why forecast ===================== */
export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const a = anch(0);
  const cells: Record<string, Cell> = { A1: hdr("Month"), B1: hdr("Ad_Spend"), C1: hdr("Sales") };
  MONTHS.forEach((m, i) => { cells[`A${i + 2}`] = { v: `${m}-25` }; cells[`B${i + 2}`] = { v: String(AD[i]) }; cells[`C${i + 2}`] = { v: String(SALES[i]) }; });
  const x0 = M.winX + M.rowHdrW + colX(4), y0 = GRID_Y + M.colH + 8;
  const pw = 640, ph = 548;
  const t1 = eo(prog(f, a(2, 0.0), a(2, 0.35))), t2 = eio(prog(f, a(2, 0.35), a(2, 0.9)));
  const idx = SALES.map((_, i) => i + 1);
  const m = slope(SALES, idx), b = intercept(SALES, idx);
  const pl = 120;
  return (
    <>
      <ExcelWindow tab="Home" nameBox="A1" formula="" sheets={["Sales", "Forecast", "Summary"]} activeSheet={0} f={f}>
        <Grid cells={cells} sel={{ a: "A1" }} f={f}>
          {/* red: guessing */}
          <ChartBox x={colX(4) - 0 - 0 + 0} y={8} w={pw} h={ph} title="Manual guess" o={eo(prog(f, a(1, 0.1), a(1, 0.4)))}>
            <Plot w={pw} h={ph} xd={[0, 18]} yd={[150, 600]} tx={[0, 6, 12, 18]} ty={[200, 300, 400, 500, 600]} xt="Month">
              {(sx, sy) => (
                <g>
                  <polyline fill="none" stroke="#7F7F7F" strokeWidth="3" points={SALES.map((v, i) => `${sx(i + 1)},${sy(v)}`).join(" ")} />
                  {[[13, 330], [14, 520], [15, 280], [16, 560], [17, 300], [18, 450]].map(([x, y], i) => <g key={i} opacity={eo(prog(f, a(2, 0.0) + i * 6, a(2, 0.0) + i * 6 + 14))}><circle cx={sx(x)} cy={sy(y)} r="9" fill="none" stroke={C.red} strokeWidth="3" /><text x={sx(x)} y={sy(y) + 7} textAnchor="middle" fontSize="20" fill={C.red} fontFamily={FUI}>?</text></g>)}
                </g>
              )}
            </Plot>
          </ChartBox>
          <ChartBox x={colX(4) + pw + 30} y={8} w={pw} h={ph} title="Regression trend" o={eo(prog(f, a(1, 0.4), a(1, 0.8)))}>
            <Plot w={pw} h={ph} xd={[0, 18]} yd={[150, 600]} tx={[0, 6, 12, 18]} ty={[200, 300, 400, 500, 600]} xt="Month">
              {(sx, sy) => (
                <g>
                  <polyline fill="none" stroke="#7F7F7F" strokeWidth="3" points={SALES.map((v, i) => `${sx(i + 1)},${sy(v)}`).join(" ")} />
                  <line x1={sx(1)} y1={sy(b + m)} x2={sx(1 + 17 * t1)} y2={sy(b + m * (1 + 17 * t1))} stroke={C.cyan} strokeWidth="4" strokeDasharray={t1 < 1 ? "none" : "none"} />
                  {t2 > 0 ? <line x1={sx(12)} y1={sy(b + m * 12)} x2={sx(12 + 6 * t2)} y2={sy(b + m * (12 + 6 * t2))} stroke={C.cyan} strokeWidth="6" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.cyan})` }} /> : null}
                </g>
              )}
            </Plot>
          </ChartBox>
        </Grid>
      </ExcelWindow>
      <Callout x={M.winX + M.rowHdrW + colX(4) + 14} y={GRID_Y + M.colH + 12} w={pw - 20} h={ph - 10} col={C.red} f={f} a={a(2, 0.0)} b={a(2, 0.55)} />
      <Callout x={M.winX + M.rowHdrW + colX(4) + pw + 44} y={GRID_Y + M.colH + 12} w={pw - 20} h={ph - 10} col={C.cyan} f={f} a={a(2, 0.4)} b={a(2, 1.0) + 60} />
      <Caption tag="Predictive BI" col={C.cyan} lead="Scientific Demand & Revenue Forecasting Models" f={f} a={a(2, 0.15)} b={a(2, 1.0) + 90} />
    </>
  );
};

/* ===================== SC02 : SLOPE / INTERCEPT / RSQ ===================== */
const WD2 = [96, 96, 96, 30, 180, 110];
export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const a = anch(1);
  const m = slope(SALES, AD), b = intercept(SALES, AD), r2 = rsq(SALES, AD);
  const cells: Record<string, Cell> = { A1: hdr("Month"), B1: hdr("Ad_Spend"), C1: hdr("Sales") };
  MONTHS.forEach((mm, i) => { cells[`A${i + 2}`] = { v: `${mm}-25` }; cells[`B${i + 2}`] = { v: String(AD[i]) }; cells[`C${i + 2}`] = { v: String(SALES[i]) }; });
  // steps
  const F = [
    { cell: "F2", lab: "Slope (m)", fx: "=SLOPE(C2:C13,B2:B13)", val: f4(m), t0: a(2, 0.32), t1: a(2, 0.5) },
    { cell: "F3", lab: "Intercept (b)", fx: "=INTERCEPT(C2:C13,B2:B13)", val: f2(b), t0: a(2, 0.55), t1: a(2, 0.72) },
    { cell: "F4", lab: "R² (RSQ)", fx: "=RSQ(C2:C13,B2:B13)", val: f2(r2), t0: a(2, 0.78), t1: a(2, 0.98) },
  ];
  cells.E1 = hdr("Metric"); cells.F1 = hdr("Value");
  let nameBox = "A1", formula = "", editing = false, sel: { a: string; b?: string } = { a: "A1" }; let hl: string | undefined;
  F.forEach((s, i) => {
    cells[`E${i + 2}`] = { v: s.lab, b: true };
    if (f >= s.t0 + 40) cells[s.cell] = { v: s.val };
    if (f >= s.t0 && f < s.t1 + 40) { nameBox = s.cell; sel = { a: s.cell }; formula = typed(s.fx, f, s.t0 + 6, 20); editing = f < s.t0 + 40 && f >= s.t0; }
    if (f >= s.t0 + 40 && f < s.t1 + 40) formula = s.fx;
  });
  if (f < F[0].t0 && f >= a(1, 0.2)) { sel = { a: "B1", b: "C13" }; nameBox = "B1:C13"; }
  const tab = f >= a(4, 0.1) ? "Insert" : "Home";
  if (f >= a(4, 0.1) && f < a(4, 0.3)) { hl = "chScatter"; nameBox = "B1:C13"; sel = { a: "B1", b: "C13" }; }
  if (f >= a(4, 0.3)) { sel = { a: "H22" }; nameBox = "Chart 1"; formula = ""; }
  const chartO = eo(prog(f, a(4, 0.28), a(4, 0.4)));
  const dr = eio(prog(f, a(4, 0.42), a(4, 0.7)));
  const cw = 760, ch = 540, cx = colX(7, WD2), cy = 6;
  const stats = f < F[0].t0 && f >= a(1, 0.2) ? statsText([...AD, ...SALES]) : "";
  const gaugeO = eo(prog(f, a(3, 0.15), a(3, 0.45)));
  return (
    <>
      <ExcelWindow tab={tab} hl={hl} hlCol={C.green} nameBox={nameBox} formula={formula} editing={editing} sheets={["Sales", "Forecast", "Summary"]} activeSheet={0} stats={stats} mode={editing ? "Enter" : "Ready"} f={f}>
        <Grid cells={cells} wd={WD2} sel={sel} f={f}>
          {chartO > 0.01 ? (
            <ChartBox x={cx} y={cy} w={cw} h={ch} title="Sales vs Ad_Spend" selected={f >= a(4, 0.3)} o={chartO}>
              <Plot w={cw} h={ch} xd={[10, 70]} yd={[150, 450]} tx={[10, 20, 30, 40, 50, 60, 70]} ty={[150, 250, 350, 450]} xt="Ad_Spend (K EGP)" yt="Sales (K EGP)">
                {(sx, sy) => (
                  <g>
                    {AD.map((x, i) => <circle key={i} cx={sx(x)} cy={sy(SALES[i])} r="7" fill="#4472C4" />)}
                    <line x1={sx(18)} y1={sy(b + m * 18)} x2={sx(18 + 47 * dr)} y2={sy(b + m * (18 + 47 * dr))} stroke={C.green} strokeWidth="4" />
                    {dr > 0.95 ? <g><text x={sx(18) + 8} y={sy(430)} fontSize="22" fill="#404040" fontFamily={FUI}>y = {f1(m)}x + {f1(b)}</text><text x={sx(18) + 8} y={sy(430) + 28} fontSize="22" fill="#404040" fontFamily={FUI}>R² = {f2(r2)}</text></g> : null}
                  </g>
                )}
              </Plot>
            </ChartBox>
          ) : null}
        </Grid>
      </ExcelWindow>
      {f >= a(0, 0.3) && f < a(1, 0.0) + 120 ? (
        <div style={{ position: "absolute", left: 1120, top: 360, opacity: vis(f, a(0, 0.3), a(1, 0.0) + 120, 12), background: "rgba(30,41,59,.95)", border: `2px solid ${C.green}`, borderRadius: 16, padding: "16px 30px", fontFamily: FUI, fontSize: 52, color: C.text, boxShadow: `0 0 26px ${C.green}77` }}>y = <span style={{ color: C.green }}>m</span>x + <span style={{ color: C.green }}>b</span></div>
      ) : null}
      {gaugeO > 0.01 && f < a(4, 0.1) ? (
        <div style={{ position: "absolute", left: 1180, top: 400, width: 520, height: 150, opacity: gaugeO * (1 - eo(prog(f, a(4, 0.02), a(4, 0.1)))), background: "rgba(30,41,59,.96)", border: `2px solid ${C.green}`, borderRadius: 18, boxShadow: `0 0 28px ${C.green}77`, fontFamily: FUI, color: C.text, padding: "14px 26px" }}>
          <div style={{ fontSize: 24, color: C.mute }}>Goodness of fit  0 ≤ R² ≤ 1</div>
          <div style={{ marginTop: 10, height: 18, borderRadius: 9, background: "#334155", position: "relative" }}><div style={{ width: `${r2 * 100 * eo(prog(f, a(3, 0.2), a(3, 0.6)))}%`, height: 18, borderRadius: 9, background: C.green }} /></div>
          <div style={{ fontSize: 52, marginTop: 4 }}>R² = <span style={{ color: C.green }}>{f2(r2)}</span></div>
        </div>
      ) : null}
      {F.map((s, i) => { const r = cellRect(s.cell, undefined, WD2); return <Callout key={s.cell} x={r.x} y={r.y} w={r.w} h={r.h} col={C.green} f={f} a={s.t0 + 40} b={s.t1 + 90} />; })}
      <Caption tag="Regression" col={C.green} lead="y = mx + b" code="SLOPE(Known_Y, Known_X)  &  INTERCEPT(Known_Y, Known_X)" f={f} a={a(0, 0.1)} b={a(2, 1.0)} />
      <Caption tag="Goodness-of-Fit" col={C.green} lead="R² validates model reliability" code="RSQ(Known_Y, Known_X)" f={f} a={a(3, 0.0)} b={a(4, 1.0) + 60} />
    </>
  );
};

/* ===================== SC03 : FORECAST.LINEAR & TREND ===================== */
const WD3 = [96, 96, 96, 30, 150, 30, 130, 150];
export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const a = anch(2);
  const mon = Array.from({ length: 12 }, (_, i) => i + 1);
  const newV = SALES[11] + 40; // live edit of the current month
  const edited = f >= a(3, 0.62);
  const sales = SALES.map((v, i) => (i === 11 && edited ? newV : v));
  const tgt = 80;
  const fut = [13, 14, 15, 16, 17, 18];
  const tr = trend(sales, mon, fut);
  const fl = forecastLinear(tgt, sales, AD);
  const cells: Record<string, Cell> = { A1: hdr("Month #"), B1: hdr("Ad_Spend"), C1: hdr("Sales"), E1: hdr("Target Ad Spend"), E3: hdr("Forecast Sales"), G1: hdr("Future Month"), H1: hdr("Trend Forecast") };
  mon.forEach((mm, i) => { cells[`A${i + 2}`] = { v: String(mm) }; cells[`B${i + 2}`] = { v: String(AD[i]) }; cells[`C${i + 2}`] = { v: String(sales[i]), bg: i === 11 && edited ? "#FFF2CC" : undefined }; });
  cells.E2 = { v: String(tgt) };
  const t1 = a(1, 0.3), t2 = a(2, 0.3);
  const fx1 = "=FORECAST.LINEAR(E2,C2:C13,B2:B13)", fx2 = "=TREND(C2:C13,A2:A13,G2:G7)";
  fut.forEach((v, i) => { cells[`G${i + 2}`] = { v: String(v) }; });
  if (f >= t1 + 48) cells.E4 = { v: f1(fl) };
  const spillN = f >= t2 + 52 ? Math.min(6, 1 + Math.floor((f - t2 - 52) / 5)) : 0;
  for (let i = 0; i < spillN; i++) cells[`H${i + 2}`] = { v: f1(tr[i]), col: i === 0 ? C.ink : C.ink };
  let nameBox = "A1", formula = "", editing = false, sel: { a: string; b?: string } = { a: "A1" };
  if (f >= t1 && f < t2 - 10) { nameBox = "E4"; sel = { a: "E4" }; formula = f < t1 + 48 ? typed(fx1, f, t1 + 4, 22) : fx1; editing = f < t1 + 48; }
  if (f >= t2 - 10) { nameBox = "H2"; sel = { a: "H2" }; formula = f < t2 + 52 ? typed(fx2, f, t2 + 4, 22) : fx2; editing = f < t2 + 52; }
  if (f >= a(3, 0.45) && f < a(3, 0.62)) { nameBox = "C13"; sel = { a: "C13" }; formula = typed(String(newV), f, a(3, 0.47), 6); editing = true; }
  if (edited) { nameBox = "C13"; sel = { a: "C13" }; formula = String(newV); }
  const spill = spillN > 0 ? cellRect("H2", `H${1 + spillN}`, WD3) : null;
  const rows = cellRect("H2", "H7", WD3);
  const pulse = edited ? eo(1 - prog(f, a(3, 0.62), a(3, 0.62) + 50)) : 0;
  return (
    <>
      <ExcelWindow tab="Formulas" hl={f < t1 ? "more" : undefined} hlCol={C.purple} nameBox={nameBox} formula={formula} editing={editing} sheets={["Sales", "Forecast", "Summary"]} activeSheet={1} mode={editing ? "Enter" : "Ready"} f={f}>
        <Grid cells={cells} sel={sel} wd={WD3} f={f} />
      </ExcelWindow>
      {spill ? <div style={{ position: "absolute", left: spill.x, top: spill.y, width: spill.w, height: spill.h, border: "2px solid #4A7EBB", boxSizing: "border-box", pointerEvents: "none" }} /> : null}
      {spillN > 0 ? <Callout x={rows.x} y={rows.y} w={rows.w} h={rows.h} col={C.purple} f={f} a={t2 + 52} b={a(3, 0.45)} /> : null}
      {pulse > 0.02 ? <Callout x={rows.x} y={rows.y} w={rows.w} h={rows.h} col={C.purple} f={f} a={a(3, 0.62)} b={a(3, 1.0)} /> : null}
      {f >= t1 + 48 ? <Callout x={cellRect("E4", undefined, WD3).x} y={cellRect("E4", undefined, WD3).y} w={cellRect("E4", undefined, WD3).w} h={cellRect("E4", undefined, WD3).h} col={C.purple} f={f} a={t1 + 48} b={t1 + 140} /> : null}
      <Caption tag="Point Forecast" col={C.purple} lead="Single future value" code="FORECAST.LINEAR(x, Known_Y, Known_X)" f={f} a={a(1, 0.0)} b={a(2, 0.2)} />
      <Caption tag="Dynamic Array" col={C.purple} lead="Spills multi-period projections" code="TREND(Known_Y, Known_X, New_X)" f={f} a={a(2, 0.2)} b={a(3, 0.4)} />
      <Caption tag="Live Update" col={C.purple} lead="Change C13 → every forecast recalculates" f={f} a={a(3, 0.4)} b={a(3, 1.0) + 50} />
    </>
  );
};
