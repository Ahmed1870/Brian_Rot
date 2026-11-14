import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, M, VOICE, gx, gy, LESSON, UNIT, TOTAL_UNITS, TITLE_AR, TITLE_EN } from "./theme";
import { CUE, SC } from "./sync";
import {
  FONT, Stage, Header, Caption, Cursor, WP, Neon, Tx, Rect, abs, ExcelWin, Outro, Seal, useSheet, FxItem, rib, tabAt, cellBox, StatGallery, STAT_GAL,
  BRANCHES, FACT, amt, prog, eo, typed, fmt, Sel,
} from "./kit";

const mk = (id: string, s0: number) => (n: string, o = 0) => Math.round((CUE[id + "_" + n] + o) * 30) - s0;
const gw = (w: WP[]): WP[] => w.map((p) => ({ ...p, x: gx(p.x), y: gy(p.y) }));
const ramp = (f: number, t: number, d = 10) => eo(prog(f, t, t + d));
const qInc = (a: number[], k: number) => { const s = [...a].sort((x, y) => x - y); const p = ((s.length - 1) * k) / 4; const lo = Math.floor(p); return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (p - lo); };
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const varS = (a: number[]) => { const m = mean(a); return a.reduce((x, y) => x + (y - m) * (y - m), 0) / (a.length - 1); };
const sdS = (a: number[]) => Math.sqrt(varS(a));
const r0 = (v: number) => fmt(Math.round(v));
const fences = (a: number[]) => { const q1 = qInc(a, 1), q3 = qInc(a, 3), i = q3 - q1; return { q1, q3, i, lo: q1 - 1.5 * i, hi: q3 + 1.5 * i }; };
const A = [48200, 51500, 49800, 50700, 47900, 52100, 50300, 49600, 51200, 48700];
const B = [5000, 95000, 12000, 88000, 20000, 80000, 30000, 70000, 40000, 60000];
const INV = [1200, 1500, 1800, 2100, 2400, 2600, 2900, 3100, 3400, 3600, 3900, 4200, 4600, 5000, 5400, 5900, 6500, 7200, 8100, 17500, 24000];
const FI = fences(INV);
const Chip: React.FC<{ x: number; y: number; w: number; h?: number; c: string; a?: number; children?: React.ReactNode }> = ({ x, y, w, h = 76, c, a = 1, children }) => (
  <div style={abs(x, y, w, h, { opacity: a, background: "rgba(15,23,42,0.96)", border: `3px solid ${c}`, borderRadius: 10, boxSizing: "border-box" })}>{children}</div>
);
const Panel: React.FC<{ x: number; y: number; w: number; h: number; c: string; title: string; a?: number; children?: React.ReactNode }> = ({ x, y, w, h, c, title, a = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, background: C.panel2, border: `2px solid ${c}`, borderRadius: 18, boxSizing: "border-box" }}>
    <div dir="ltr" style={{ position: "absolute", left: 24, top: 16, height: 40, padding: "0 20px", borderRadius: 20, background: c, color: "#0F172A", fontFamily: FONT.ui, fontWeight: 700, fontSize: 22, lineHeight: "40px" }}>{title}</div>
    {children}
  </div>
);
// dot strip on a value axis
const Strip: React.FC<{ x: number; y: number; w: number; vals: number[]; min: number; max: number; c: string; mean?: number; show?: number; flag?: (v: number) => boolean; flagC?: string; scan?: number; r?: number }> =
  ({ x, y, w, vals, min, max, c, mean: mu, show = 99, flag, flagC = C.red, scan, r = 11 }) => {
    const px = (v: number) => ((v - min) / (max - min)) * w;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: 60 }}>
        <div style={{ position: "absolute", left: 0, top: 28, width: w, height: 3, background: C.line }} />
        {mu !== undefined && <div style={{ position: "absolute", left: px(mu) - 2, top: 4, width: 4, height: 52, background: C.amber }} />}
        {vals.map((v, i) => { const fl = flag ? flag(v) && (scan === undefined || px(v) <= scan) : false; return i < show ? <div key={i} style={{ position: "absolute", left: px(v) - r, top: 30 - r, width: 2 * r, height: 2 * r, borderRadius: r, background: fl ? flagC : c, border: fl ? "3px solid #fff" : "none", boxSizing: "border-box" }} /> : null; })}
        {scan !== undefined && <div style={{ position: "absolute", left: scan - 2, top: -6, width: 4, height: 72, background: C.blue }} />}
      </div>
    );
  };
const Bell: React.FC<{ x: number; y: number; w: number; h: number; a1: number; a2: number; a3: number; an: number }> = ({ x, y, w, h, a1, a2, a3, an }) => {
  const zx = (z: number) => w / 2 + (z / 4) * (w / 2); const zy = (z: number) => h - 40 - Math.exp(-(z * z) / 2) * (h - 80);
  const poly = (k: number) => { let d = `M${zx(-k)} ${h - 40}`; for (let i = -k * 20; i <= k * 20; i++) d += `L${zx(i / 20)} ${zy(i / 20)}`; return d + `L${zx(k)} ${h - 40}Z`; };
  let curve = ""; for (let i = -80; i <= 80; i++) curve += `${i === -80 ? "M" : "L"}${zx(i / 20)} ${zy(i / 20)}`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <svg width={w} height={h}>
        <path d={poly(3)} fill={C.blue} opacity={0.12 * a3} /><path d={poly(2)} fill={C.blue} opacity={0.22 * a2} /><path d={poly(1)} fill={C.blue} opacity={0.4 * a1} />
        <path d={curve} stroke={C.blue} strokeWidth={4} fill="none" /><path d={`M0 ${h - 40}H${w}`} stroke={C.line} strokeWidth={2} />
        {[-3, -2, -1, 0, 1, 2, 3].map((z) => <text key={z} x={zx(z)} y={h - 14} fill={C.dim} fontSize={20} textAnchor="middle" fontFamily={FONT.ui}>{z === 0 ? "μ" : `${z > 0 ? "+" : "−"}${Math.abs(z)}σ`}</text>)}
        <circle cx={zx(3.45)} cy={h - 52} r={11} fill={C.red} stroke="#fff" strokeWidth={3} opacity={an} />
      </svg>
      <div dir="ltr" style={{ position: "absolute", left: 6, top: 4, fontFamily: FONT.ui, fontSize: 20, fontWeight: 700, lineHeight: "30px" }}>
        <div style={{ color: C.green, opacity: a1 }}>68% within ±1σ</div><div style={{ color: C.blue, opacity: a2 }}>95% within ±2σ</div><div style={{ color: C.blue, opacity: a3 }}>99.7% within ±3σ</div>
      </div>
      <div dir="ltr" style={{ position: "absolute", left: w - 250, top: 4, width: 250, textAlign: "right", fontFamily: FONT.ui, fontSize: 20, fontWeight: 700, color: C.red, opacity: an }}>beyond ±3σ → anomaly ↓</div>
    </div>
  );
};

// ---------------- Scene 1 ----------------
const S1: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[0]; const dur = s1 - s0; const at = mk("c1", s0);
  const tEng = at("engine", -2.5), tFake = at("fake", -0.3), tHunt = at("hunt", -0.5);
  const card = ramp(f, at("badge")) * (1 - ramp(f, tEng - 6));
  const chips = [["Spread", C.blue, tEng - 100], ["Distribution", C.green, tEng - 70], ["Outliers", C.red, tEng - 40]] as const;
  const dg = ramp(f, tEng);
  const scan = f < tHunt ? undefined : Math.min(700, (f - tHunt) * 4);
  return (
    <Stage dur={dur} fin={0} fout={8}>
      <ExcelWin f={f} name="A1" formula="" sel={{ r1: 0, c1: 0, r2: 0, c2: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.93)" }} />
      <Header f={f} />
      <div style={{ position: "absolute", left: 360, top: 230, width: 1200, height: 540, opacity: card }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "rgba(30,41,59,0.94)", border: `2px solid ${C.blue}` }} />
        <div dir="rtl" style={{ position: "absolute", left: 0, top: 36, width: 1200, textAlign: "center", fontFamily: FONT.ar, fontSize: 34, color: C.dim }}>{`الوحدة ${UNIT} من ${TOTAL_UNITS} — التحليل الإحصائي والتقارير`}</div>
        <div dir="ltr" style={{ position: "absolute", left: 0, top: 100, width: 1200, textAlign: "center", fontFamily: FONT.ui, fontSize: 60, fontWeight: 700, color: C.text }}>Lesson {LESSON}</div>
        <div dir="ltr" style={{ position: "absolute", left: 0, top: 184, width: 1200, textAlign: "center", fontFamily: FONT.ui, fontSize: 42, fontWeight: 600, color: C.blue }}>{TITLE_EN}</div>
        <div dir="rtl" style={{ position: "absolute", left: 0, top: 262, width: 1200, textAlign: "center", fontFamily: FONT.ar, fontSize: 36, color: C.text }}>{TITLE_AR}</div>
        {chips.map(([tx, c, tt], i) => (<div key={tx} dir="ltr" style={{ position: "absolute", left: 60 + i * 380, top: 390, width: 350, height: 70, borderRadius: 35, border: `3px solid ${c}`, background: C.bg, color: C.text, fontFamily: FONT.ui, fontSize: 28, fontWeight: 600, textAlign: "center", lineHeight: "64px", opacity: ramp(f, tt), transform: `translateY(${(1 - ramp(f, tt)) * 18}px)` }}>{tx}</div>))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: dg }}>
        <Panel x={100} y={130} w={800} h={700} c={C.red} title="Same average, hidden volatility" a={ramp(f, tFake - 40)}>
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 90, fontFamily: FONT.ui, fontSize: 26, color: C.green, fontWeight: 700 }}>Branch A · average 50,000</div>
          <Strip x={40} y={140} w={720} vals={A} min={0} max={100000} c={C.green} mean={50000} />
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 260, fontFamily: FONT.ui, fontSize: 26, color: C.red, fontWeight: 700 }}>Branch B · average 50,000</div>
          <Strip x={40} y={310} w={720} vals={B} min={0} max={100000} c={C.red} mean={50000} />
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 450, width: 720, fontFamily: FONT.ui, fontSize: 28, fontWeight: 700, color: C.amber, opacity: ramp(f, tFake) }}>The average alone cannot tell them apart</div>
        </Panel>
        <Panel x={1020} y={130} w={800} h={700} c={C.blue} title="Dispersion & Outliers Engine" a={ramp(f, tHunt - 40)}>
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 90, fontFamily: FONT.ui, fontSize: 26, color: C.blue, fontWeight: 700 }}>Invoice amounts · radar scan</div>
          <Strip x={40} y={160} w={720} vals={INV} min={0} max={26000} c={C.blue} flag={(v) => v > FI.hi} scan={scan} r={9} />
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 300, width: 720, fontFamily: FONT.ui, fontSize: 26, color: C.dim }}>The scan maps the spread and isolates the points far outside it.</div>
        </Panel>
      </div>
      <Caption f={f} t0={at("badge", 0.8)} t1={tEng - 4} color={C.blue} text="Lesson 64 → Distributions, Dispersion & Outliers Engine" />
      <Caption f={f} t0={tEng + 4} t1={dur - 6} color={C.blue} text="Volatility & Anomaly Detection → Measuring Data Spread & Isolating Statistical Outliers" />
    </Stage>
  );
};

// ---------------- Scene 2: STDEV.S & empirical rule ----------------
const DAYS: string[][] = [["Day", "Branch A", "Branch B"], ...A.map((v, i) => [`Day ${i + 1}`, fmt(v), fmt(B[i])]), ["", "", ""], ["Average", "", ""], ["STDEV.S", "", ""], ["VAR.S", "", ""]];
const S2: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[1]; const dur = s1 - s0; const at = mk("c2", s0);
  const tTwo = at("twob"), tA = at("a", -0.2), tB = at("b", -0.2), tSd = at("sd", -0.6), tBig = at("big"), tRule = at("rule", -0.2), tBey = at("beyond", -0.4);
  const tAvg = tTwo + 40;
  const items: FxItem[] = [
    { r: 12, c: 1, t: tAvg, formula: "=AVERAGE(B2:B11)", val: "50,000", fill: { r2: 12, c2: 2, vals: [["50,000", "50,000"]], dur: 20 } },
    { r: 13, c: 1, t: tSd, formula: "=STDEV.S(B2:B11)", val: r0(sdS(A)), fill: { r2: 13, c2: 2, vals: [[r0(sdS(A)), r0(sdS(B))]], dur: 20 } },
    { r: 14, c: 1, t: Math.max(tSd + 150, tBig - 150), formula: "=VAR.S(B2:B11)", val: r0(varS(A)), fill: { r2: 14, c2: 2, vals: [[r0(varS(A)), r0(varS(B))]], dur: 20 } },
  ];
  const sh = useSheet(f, DAYS, items);
  const cb = (r: number, c: number) => ({ x: cellBox(r, c).x + 30, y: cellBox(r, c).y + 10 });
  const wps = gw([{ t: 0, x: 700, y: 400 }, ...items.flatMap((it) => [{ t: it.t - 22, x: cb(it.r, it.c).x, y: cb(it.r, it.c).y }, { t: it.t - 4, x: cb(it.r, it.c).x, y: cb(it.r, it.c).y, click: true } as WP]), { t: items[2].t + 100, x: 900, y: 500 }]);
  const nm = `${String.fromCharCode(65 + sh.sel.c1)}${sh.sel.r1 + 1}`;
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab="Home" name={nm} formula={sh.formula} sel={sh.sel} data={sh.data} edit={sh.edit} right={[1, 2]} tableCols={3}>
        <Panel x={340} y={190} w={1040} h={440} c={C.blue} title="Spread of two branches" a={ramp(f, tTwo)}>
          <div dir="ltr" style={{ position: "absolute", left: 20, top: 60, fontFamily: FONT.ui, fontSize: 15, color: C.green, fontWeight: 700 }}>Branch A: stable</div>
          <Strip x={20} y={80} w={470} vals={A} min={0} max={100000} c={C.green} mean={50000} show={Math.floor(ramp(f, tA, 30) * 10)} r={7} />
          <div dir="ltr" style={{ position: "absolute", left: 20, top: 150, fontFamily: FONT.ui, fontSize: 15, color: C.red, fontWeight: 700 }}>Branch B: volatile</div>
          <Strip x={20} y={170} w={470} vals={B} min={0} max={100000} c={C.red} mean={50000} show={Math.floor(ramp(f, tB, 30) * 10)} r={7} />
          {f >= tSd + 50 && <Chip x={20} y={250} w={470} h={96} c={C.blue} a={ramp(f, tSd + 50)}><Tx x={14} y={6} w={440} h={28} size={15} bold color={C.green} font={FONT.mono}>{`STDEV.S  A = ${r0(sdS(A))}`}</Tx><Tx x={14} y={34} w={440} h={28} size={15} bold color={C.red} font={FONT.mono}>{`STDEV.S  B = ${r0(sdS(B))}`}</Tx><Tx x={14} y={62} w={440} h={26} size={12.5} color="#E2E8F0">{f >= tBig ? "Bigger number → more spread → more risk" : "Same mean, very different spread"}</Tx></Chip>}
          <Bell x={530} y={70} w={490} h={350} a1={ramp(f, tRule)} a2={ramp(f, tRule + 70)} a3={ramp(f, tRule + 130)} an={ramp(f, tBey)} />
        </Panel>
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={tTwo} t1={tRule - 6} color={C.blue} text="Volatility Measurement → STDEV.S(Range) & VAR.S(Range) Quantify Operational Risk" />
      <Caption f={f} t0={tRule} t1={dur - 6} color={C.green} text="Empirical Rule (68 - 95 - 99.7%) → Values Beyond 3σ Flagged as Extreme Anomalies" />
    </Stage>
  );
};

// ---------------- Scene 3: IQR & Tukey fences ----------------
const FLAG = INV.map((v) => (v < FI.lo || v > FI.hi ? "OUTLIER" : ""));
const R2 = (v: number) => fmt(Math.round(v * 100) / 100);
const IDATA: string[][] = [["Invoice", "Amount", "Flag", "Metric", "Value"], ...INV.map((v, i) => [`INV-${1001 + i}`, fmt(v), "", ["Q1", "Q3", "IQR", "Lower Fence", "Upper Fence"][i] ?? "", ""])];
const S3: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[2]; const dur = s1 - s0; const at = mk("c3", s0);
  const tQ1 = at("q1", -0.4), tQ3 = Math.max(at("q3", -0.4), tQ1 + 120), tI = Math.max(at("sub", -0.2), tQ3 + 120), tLo = Math.max(at("low", -0.4), tI + 100), tUp = Math.max(at("up", -0.4), tLo + 120), tFl = Math.max(at("out", -0.2), tUp + 120);
  const items: FxItem[] = [
    { r: 1, c: 4, t: tQ1, formula: "=QUARTILE.INC(B2:B22,1)", val: R2(FI.q1) },
    { r: 2, c: 4, t: tQ3, formula: "=QUARTILE.INC(B2:B22,3)", val: R2(FI.q3) },
    { r: 3, c: 4, t: tI, formula: "=E3-E2", val: R2(FI.i) },
    { r: 4, c: 4, t: tLo, formula: "=E2-1.5*E4", val: R2(FI.lo) },
    { r: 5, c: 4, t: tUp, formula: "=E3+1.5*E4", val: R2(FI.hi) },
    { r: 1, c: 2, t: tFl, formula: '=IF(OR(B2<$E$5,B2>$E$6),"OUTLIER","")', val: FLAG[0], cps: 26, fill: { r2: 21, c2: 2, vals: FLAG.map((v) => [v]), dur: 50 } },
  ];
  const sh = useSheet(f, IDATA, items);
  const cb = (r: number, c: number) => ({ x: cellBox(r, c).x + 30, y: cellBox(r, c).y + 10 });
  const wps = gw([{ t: 0, x: 700, y: 400 }, ...items.flatMap((it) => [{ t: it.t - 22, x: cb(it.r, it.c).x, y: cb(it.r, it.c).y }, { t: it.t - 4, x: cb(it.r, it.c).x, y: cb(it.r, it.c).y, click: true } as WP]), { t: tFl + 160, x: 900, y: 520 }]);
  const nm = `${String.fromCharCode(65 + sh.sel.c1)}${sh.sel.r1 + 1}`;
  const px = (v: number) => 40 + ((v + 6000) / 36000) * 660;
  const typeEnd = (t: number, l: number) => t + Math.ceil((l * 30) / 20) + 12;
  const show = (t: number, l: number) => ramp(f, typeEnd(t, l), 8);
  const flagDone = f >= tFl + 80;
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab="Home" name={nm} formula={sh.formula} sel={sh.sel} data={sh.data} edit={sh.edit} right={[1, 4]} tableCols={3}>
        {flagDone && INV.map((v, i) => FLAG[i] ? <Rect key={i} x={cellBox(i + 1, 0).x} y={cellBox(i + 1, 0).y} w={286} h={20} fill="rgba(168,85,247,0.28)" stroke={C.purple} sw={2} /> : null)}
        <Panel x={410} y={330} w={760} h={330} c={C.purple} title="IQR & Tukey's fences" a={ramp(f, tQ1 - 10)}>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={760} height={330}>
            <path d={`M${px(0)} 200H${px(26000)}`} stroke={C.line} strokeWidth={3} />
            {f >= typeEnd(tQ3, 24) && <rect x={px(FI.q1)} y={150} width={px(FI.q3) - px(FI.q1)} height={100} fill={C.purple} opacity={0.3 * show(tQ3, 24)} stroke={C.purple} strokeWidth={3} />}
            {f >= typeEnd(tQ1, 24) && <path d={`M${px(FI.q1)} 140V260`} stroke="#fff" strokeWidth={3} opacity={show(tQ1, 24)} />}
            {f >= typeEnd(tQ3, 24) && <path d={`M${px(FI.q3)} 140V260`} stroke="#fff" strokeWidth={3} opacity={show(tQ3, 24)} />}
            {f >= typeEnd(tLo, 10) && <path d={`M${px(FI.lo)} 120V280`} stroke={C.amber} strokeWidth={4} strokeDasharray="12 8" opacity={show(tLo, 10)} />}
            {f >= typeEnd(tUp, 10) && <path d={`M${px(FI.hi)} 120V280`} stroke={C.amber} strokeWidth={4} strokeDasharray="12 8" opacity={show(tUp, 10)} />}
            {INV.map((v, i) => { const fl = flagDone && FLAG[i]; return <circle key={i} cx={px(v)} cy={200} r={fl ? 12 : 8} fill={fl ? C.purple : C.blue} stroke={fl ? "#fff" : "none"} strokeWidth={3} />; })}
          </svg>
          <div dir="ltr" style={{ position: "absolute", left: 40, top: 80, fontFamily: FONT.mono, fontSize: 20, color: C.text }}>{f >= typeEnd(tI, 8) ? `IQR = ${R2(FI.q3)} − ${R2(FI.q1)} = ${R2(FI.i)}` : "Middle 50% of the data"}</div>
          {flagDone && <div dir="ltr" style={{ position: "absolute", left: 420, top: 270, fontFamily: FONT.ui, fontSize: 22, fontWeight: 700, color: C.purple, opacity: ramp(f, tFl + 80) }}>OUTLIER DETECTED × {FLAG.filter(Boolean).length}</div>}
        </Panel>
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("iqr", 0.2)} t1={tLo - 6} color={C.purple} text="Interquartile Range (IQR) → IQR = QUARTILE.INC(Range, 3) - QUARTILE.INC(Range, 1)" />
      <Caption f={f} t0={tLo} t1={dur - 6} color={C.purple} text="Tukey's Outlier Fences → Lower: Q1 - 1.5 * IQR | Upper: Q3 + 1.5 * IQR" />
    </Stage>
  );
};

// ---------------- Scene 4: Box and Whisker ----------------
const BR = BRANCHES.map((_, b) => { const v = FACT.filter((r) => r.branch === b).map(amt); const q = fences(v); const sorted = [...v].sort((x, y) => x - y); const inside = sorted.filter((x) => x >= q.lo && x <= q.hi); return { q, med: qInc(v, 2), lo: inside[0], hi: inside[inside.length - 1], out: sorted.filter((x) => x < q.lo || x > q.hi) }; });
const YMAX = Math.ceil(Math.max(...FACT.map(amt)) / 5000) * 5000;
const BDATA: string[][] = [["Branch", "Amount"], ...FACT.slice(0, 21).map((r) => [BRANCHES[r.branch], fmt(amt(r))])];
const S4: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[3]; const dur = s1 - s0; const at = mk("c4", s0);
  const tSel = at("start", 0.6), tIns = at("tool", -1.8), tStat = at("box", -1.2), tPick = tStat + 50, tParts = at("parts", -0.2), tWh = at("whisk", -0.3), tDot = at("dots", -0.3);
  const selR = Math.min(21, Math.floor(ramp(f, tSel, 30) * 21));
  const tab = f >= tIns ? "Insert" : "Home";
  const st = rib("Insert", "stat"); const ti = tabAt("Insert");
  const galX = st.x - 10, galY = st.y + st.h + 4;
  const wps = gw([{ t: 0, x: 600, y: 420 }, { t: tSel - 20, x: cellBox(0, 0).x + 30, y: cellBox(0, 0).y + 10 }, { t: tSel - 2, x: cellBox(0, 0).x + 30, y: cellBox(0, 0).y + 10, click: true }, { t: tSel + 30, x: cellBox(21, 1).x + 30, y: cellBox(21, 1).y + 10 },
    { t: tIns - 20, x: ti.x + 24, y: ti.y + 14 }, { t: tIns, x: ti.x + 24, y: ti.y + 14, click: true }, { t: tStat - 14, x: st.x + 12, y: st.y + 12 }, { t: tStat, x: st.x + 12, y: st.y + 12, click: true },
    { t: tPick - 12, x: galX + 54, y: galY + 172 }, { t: tPick, x: galX + 54, y: galY + 172, click: true }, { t: tPick + 40, x: 1250, y: 500 }]);
  const cx = 360, cy = 215, cw = 800, ch = 420, px0 = cx + 70, pw = cw - 100, py0 = cy + 50, ph = ch - 110;
  const yy = (v: number) => py0 + ph - (v / YMAX) * ph;
  const chart = ramp(f, tPick + 4, 12);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab={tab} name={selR >= 21 ? "A1:B22" : "A1"} formula="Branch" sel={{ r1: 0, c1: 0, r2: f >= tSel ? selR : 0, c2: f >= tSel ? 1 : 0 }} data={BDATA} right={[1]} tableCols={2} hover={f >= tStat - 8 && f < tStat ? "stat" : undefined} down={f >= tStat && f < tStat + 4}>
        {f >= tStat && f < tPick + 4 && <StatGallery x={galX} y={galY} hi={f >= tPick - 8 ? 2 : -1} a={ramp(f, tStat, 6) * (1 - ramp(f, tPick + 2, 4))} />}
        {chart > 0 && (
          <div style={abs(cx, cy, cw, ch, { opacity: chart, background: "#fff", border: "1px solid #BDBDBD", boxSizing: "border-box" })}>
            <Tx x={0} y={8} w={cw} h={26} size={16} bold align="center" color="#444">Sales Amount by Branch</Tx>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={cw} height={ch}>
              {[0, 1, 2, 3, 4].map((i) => { const v = (YMAX / 4) * i; return <g key={i}><path d={`M${70} ${yy(v) - cy}H${cw - 30}`} stroke="#E1E1E1" /><text x={62} y={yy(v) - cy + 4} fontSize={12} fill="#666" textAnchor="end" fontFamily={FONT.ui}>{fmt(v)}</text></g>; })}
              {BR.map((b, i) => {
                const x = px0 - cx + (i + 0.5) * (pw / 4), bw = 70; const c = (v: number) => yy(v) - cy;
                const pb = ramp(f, tParts, 14), pw2 = ramp(f, tWh, 14), po = ramp(f, tDot, 14);
                return (
                  <g key={i}>
                    <rect x={x - bw / 2} y={c(b.q.q3)} width={bw} height={(c(b.q.q1) - c(b.q.q3)) * pb} fill="#9DC3E6" stroke={C.blue} strokeWidth={3} />
                    <path d={`M${x - bw / 2} ${c(b.med)}H${x + bw / 2}`} stroke="#1F3A93" strokeWidth={3} opacity={pb} />
                    <g opacity={pw2} stroke={C.amber} strokeWidth={3}><path d={`M${x} ${c(b.q.q3)}V${c(b.hi)}M${x - 16} ${c(b.hi)}H${x + 16}M${x} ${c(b.q.q1)}V${c(b.lo)}M${x - 16} ${c(b.lo)}H${x + 16}`} fill="none" /></g>
                    {b.out.map((v, j) => <circle key={j} cx={x} cy={c(v)} r={7} fill={C.red} stroke="#fff" strokeWidth={2} opacity={po} />)}
                    <text x={x} y={ch - 28} fontSize={14} fill="#333" textAnchor="middle" fontFamily={FONT.ui}>{BRANCHES[i]}</text>
                  </g>
                );
              })}
            </svg>
            {f >= tParts && <div dir="ltr" style={{ position: "absolute", left: 12, top: ch - 30, fontFamily: FONT.ui, fontSize: 13, color: C.blue, fontWeight: 700, opacity: ramp(f, tParts) }}>■ Q1 · Median · Q3 box</div>}
            {f >= tWh && <div dir="ltr" style={{ position: "absolute", left: 200, top: ch - 30, fontFamily: FONT.ui, fontSize: 13, color: C.amber, fontWeight: 700, opacity: ramp(f, tWh) }}>┬ Whiskers: normal range</div>}
            {f >= tDot && <div dir="ltr" style={{ position: "absolute", left: 420, top: ch - 30, fontFamily: FONT.ui, fontSize: 13, color: C.red, fontWeight: 700, opacity: ramp(f, tDot) }}>● Outliers beyond the fences</div>}
          </div>
        )}
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("start", 0.8)} t1={tParts - 4} color={C.blue} text="Visual Dispersion Analytics → Insert → Statistic Chart → Box and Whisker" />
      <Caption f={f} t0={tParts} t1={dur - 6} color={C.amber} text="Instant Anomaly Mapping → Displays Q1, Median, Q3, Whiskers & Isolated Outlier Dots" />
    </Stage>
  );
};

// ---------------- Scene 5: enterprise ----------------
const BS = BRANCHES.map((_, b) => { const v = FACT.filter((r) => r.branch === b).map(amt); const q = fences(v); return { sd: r0(sdS(v)), q1: r0(q.q1), q3: r0(q.q3), n: String(v.filter((x) => x < q.lo || x > q.hi).length) }; });
const EDATA: string[][] = [["Branch", "STDEV.S", "Q1", "Q3", "Flags"], ...BRANCHES.map((b) => [b, "", "", "", ""])];
const S5: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[4]; const dur = s1 - s0; const at = mk("c5", s0);
  const tB = at("sd", -0.2), tC = Math.max(at("iqr", -0.4), tB + 150), tD = tC + 140, tE = Math.max(at("ms", -1.5), tD + 140), tSeal = at("end", 0.4);
  const IF = "IF(tblSales[Branch]=A2,tblSales[Amount])";
  const mkv = (k: "sd" | "q1" | "q3" | "n") => BS.map((s) => [s[k]]);
  const items: FxItem[] = [
    { r: 1, c: 1, t: tB, formula: `=STDEV.S(${IF})`, val: BS[0].sd, cps: 26, fill: { r2: 4, c2: 1, vals: mkv("sd"), dur: 40 } },
    { r: 1, c: 2, t: tC, formula: `=QUARTILE.INC(${IF},1)`, val: BS[0].q1, cps: 26, fill: { r2: 4, c2: 2, vals: mkv("q1"), dur: 40 } },
    { r: 1, c: 3, t: tD, formula: `=QUARTILE.INC(${IF},3)`, val: BS[0].q3, cps: 26, fill: { r2: 4, c2: 3, vals: mkv("q3"), dur: 40 } },
    { r: 1, c: 4, t: tE, formula: '=COUNTIFS(tblSales[Branch],A2,tblSales[Flag],"OUTLIER")', val: BS[0].n, cps: 30, fill: { r2: 4, c2: 4, vals: mkv("n"), dur: 40 } },
  ];
  const sh = useSheet(f, EDATA, items);
  const cb = (r: number, c: number) => ({ x: cellBox(r, c).x + 30, y: cellBox(r, c).y + 10 });
  const wps = gw([{ t: 0, x: 700, y: 480 }, ...items.flatMap((it) => [{ t: it.t - 22, x: cb(it.r, it.c).x, y: cb(it.r, it.c).y }, { t: it.t - 4, x: cb(it.r, it.c).x, y: cb(it.r, it.c).y, click: true } as WP]), { t: tE + 120, x: 900, y: 520 }]);
  const nm = `${String.fromCharCode(65 + sh.sel.c1)}${sh.sel.r1 + 1}`;
  const done = f >= tE + 90;
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab="Home" name={nm} formula={sh.formula} sel={sh.sel} data={sh.data} edit={sh.edit} right={[1, 2, 3, 4]} tableCols={5}>
        {f >= at("store", -0.3) && f < tB && <Neon x={255} y={2} w={250} h={26} c={C.amber} a={ramp(f, at("store", -0.3))} r={4} />}
        {done && <Chip x={560} y={230} w={640} h={96} c={C.green} a={ramp(f, tE + 90, 10) * (1 - ramp(f, tSeal, 10))}><Tx x={16} y={8} w={600} h={30} size={18} bold color={C.green}>Outlier flags computed per branch ✓</Tx><Tx x={16} y={42} w={610} h={46} size={13.5} color="#E2E8F0" style={{ whiteSpace: "normal", lineHeight: "20px" }}>Flagged invoices can be filtered out of the core analysis</Tx></Chip>}
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} fade={1 - ramp(f, tSeal, 16)} />
      <Seal f={f} t={tSeal} title="DISPERSION AUDIT" sub="Spread & Outliers Mastered" marks={["STDEV.S & VAR.S", "68 · 95 · 99.7% rule", "IQR & Tukey fences", "Box and Whisker"]} />
      <Caption f={f} t0={at("start", 0.8)} t1={tSeal - 4} color={C.green} text="Enterprise Anomaly Audit → Compute Branch STDEV.S & IQR Outlier Flags on 50,000 Invoices" />
      <Caption f={f} t0={tSeal + 10} t1={dur - 6} color={C.green} text="Automated Outlier Flagging → Dispersion & Anomaly Engine Applied to the Sales Table" />
    </Stage>
  );
};

const S6: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[5]; const at = mk("c6", s0);
  return <Outro f={f} dur={s1 - s0} tStart={at("start")} tUnit={at("unit")} tDl={at("dl")} tNext={at("next")} unitNote={`Unit ${UNIT} of ${TOTAL_UNITS} in progress · lesson 2 of the unit`}
    skills={["STDEV.S & VAR.S: measuring spread", "Empirical rule 68 · 95 · 99.7%", "IQR & Tukey fences with QUARTILE.INC", "Box and Whisker chart", "Unit 13 · Statistical Analysis & BI"]}
    nextAr={`الدرس ${LESSON + 1} — الوحدة ${UNIT} من ${TOTAL_UNITS}`} nextEn="Linear Regression & Trend Forecasting" />;
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
void gx; void gy; void typed; void STAT_GAL; void M;
