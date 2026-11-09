import React from "react";
import {C, M, GRID_Y, MONO, COLS} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Keys, Neon, Tag, TopBadge, pathAt, prog, typed, vis, lin, Pt} from "./kit";
import {CellSty, ExcelWindow, Grid, Sel, colLeft, colName, rowsRange} from "./xl";
import {INV, D, fmtD, eomonth, dayOf, HOLIDAYS, workdayIntl, countedDays, isWeekend7, yearfrac3, yearfrac0, monthsBetween, edate, days, ASSETS, HIRE, ASOF, f2} from "./data";
import {Mono, MiniCal, CalCell, ctr, keyv} from "./common";

const R1 = rowsRange(1);
const HDR = "#E3EBF5";
const BLU = C.blue, EME = C.green, AMB = C.amber, CYA = "#06B6D4", PUR = C.purple, RED = C.red;
const cw = (c: number) => COLS[c];
const ry = (r: number) => GRID_Y + (r - 1) * M.rowH;

/* ───────────────────────── SCENE 1: EOMONTH ───────────────────────── */
export const Scene1: React.FC<{f: number}> = ({f}) => {
  const B2F = "=EOMONTH(A2,0)", C2F = "=EOMONTH(A2,3)";
  const bt = typed(B2F, f, 640, 0.25), ct = typed(C2F, f, 760, 0.25);
  const bDone = f >= 720, cDone = f >= 850;
  const fillAt = (r: number) => f >= 920 + (r - 3) * 10;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) { const h = ["Invoice Date", "Due (EOM)", "Due (+3 EOM)"][c]; return h ? {text: h, bold: true, bg: HDR} : undefined; }
    if (r < 2 || r > 6) return undefined;
    const t = INV[r - 2];
    if (c === 0) return {text: fmtD(t), num: true};
    if (c === 1) return r === 2 ? (bDone ? {text: fmtD(eomonth(t, 0)), num: true, bold: true} : f >= 640 ? {text: bt, edit: true} : undefined) : fillAt(r) ? {text: fmtD(eomonth(t, 0)), num: true} : undefined;
    if (c === 2) return r === 2 ? (cDone ? {text: fmtD(eomonth(t, 3)), num: true, bold: true} : f >= 760 ? {text: ct, edit: true} : undefined) : fillAt(r) ? {text: fmtD(eomonth(t, 3)), num: true} : undefined;
    return undefined;
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  if (f >= 600) sel = {r1: 2, c1: 1, r2: 2, c2: 1};
  if (f >= 740) sel = {r1: 2, c1: 2, r2: 2, c2: 2};
  if (f >= 860) sel = {r1: 3, c1: 2, r2: 3, c2: 2};
  const editing = (f >= 640 && f < 720) || (f >= 760 && f < 850);
  const formula = f >= 640 && f < 720 ? bt : f >= 720 && f < 760 ? B2F : f >= 760 && f < 850 ? ct : f >= 850 ? C2F : "";
  const b2 = ctr(R1, 2, 1), c2 = ctr(R1, 2, 2);
  const pts: Pt[] = [{f: 0, x: 1500, y: 700}, {f: 590, x: b2.x + 60, y: b2.y + 90}, {f: 632, x: b2.x, y: b2.y}, {f: 750, x: c2.x, y: c2.y}, {f: 900, x: c2.x + 100, y: c2.y + 160}];
  const cur = pathAt(f, pts);
  const feb = (d: number): CalCell | undefined => (f >= 720 ? (d === 28 ? {bg: BLU, fg: "#06283D", ring: BLU} : d === 15 ? {ring: AMB} : undefined) : d === 15 ? {bg: AMB, fg: "#1C1100", ring: AMB} : undefined);
  const may = (d: number): CalCell | undefined => (d === 31 ? {bg: EME, fg: "#032B1B", ring: EME} : d === 15 ? {ring: AMB} : undefined);
  const prg = (v: number, label: string, col: string) => (
    <div style={{marginTop: 10}}>
      <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, color: C.mute}}><span>{label}</span><span style={{color: col}}>{(v * 100).toFixed(1)}%</span></div>
      <div style={{height: 14, borderRadius: 8, background: "#0B1220", overflow: "hidden", marginTop: 4}}><div style={{width: `${v * 100 * prog(f, 70, 190)}%`, height: "100%", background: col}} /></div>
    </div>
  );
  const chips: [string, string][] = [["EOMONTH", BLU], ["WORKDAY.INTL", EME], ["YEARFRAC", CYA], ["DATEDIF", PUR]];
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={f < 600 ? "A1" : f < 740 ? "B2" : f < 860 ? "C2" : "C3"} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            <Neon f={f} a={720} b={1196} x={colLeft(1)} y={ry(2)} w={cw(1)} h={M.rowH} color={BLU} r={3} />
            <Neon f={f} a={850} b={1196} x={colLeft(2)} y={ry(2)} w={cw(2)} h={M.rowH} color={EME} r={3} />
            <Neon f={f} a={950} b={1196} x={colLeft(1)} y={ry(6)} w={cw(1)} h={M.rowH} color={EME} r={3} />
          </div>
        }
      />
      <Card f={f} a={50} b={389} x={1010} y={250} w={780} color={BLU} title="الدرس 21 من 76  ──►  ختام الوحدة 4 من 14">
        {prg(21 / 76, "Course progress · lesson 21 of 76", BLU)}
        {prg(1, "Unit 4 · Dynamic Arrays, Text & Date Functions", EME)}
      </Card>
      <Card f={f} a={400} b={634} x={1010} y={250} w={780} color={BLU} title="Date & Time Intelligence Engine">
        <div style={{display: "flex", gap: 16, flexWrap: "wrap"}}>
          {chips.map(([t, col], i) => <div key={t} style={{opacity: prog(f, 410 + i * 14, 430 + i * 14), border: `2px solid ${col}`, borderRadius: 12, padding: "8px 16px", fontFamily: MONO, fontSize: 24, fontWeight: 700, color: col, boxShadow: `0 0 16px ${col}55`}}>{t}</div>)}
        </div>
      </Card>
      <Card f={f} a={700} b={1196} x={960} y={230} w={400} color={BLU} title="=EOMONTH(A2,0)">
        <MiniCal year={2026} month={2} w={356} cell={feb} />
        <Mono c="#BAE6FD" s={20}>15-Feb-2026 → {fmtD(eomonth(INV[0], 0))}</Mono>
      </Card>
      <Card f={f} a={850} b={1196} x={1420} y={230} w={400} color={EME} title="=EOMONTH(A2,3)">
        <MiniCal year={2026} month={5} w={356} cell={may} />
        <Mono c="#A7F3D0" s={20}>3 months on → {fmtD(eomonth(INV[0], 3))}</Mono>
      </Card>
      <Card f={f} a={960} b={1196} x={1000} y={680} w={830} color={EME} title="Leap year handled ✓">
        <Mono c="#A7F3D0" s={24}>{fmtD(INV[4])} → {fmtD(eomonth(INV[4], 0))}   (Feb 2028 has 29 days)</Mono>
      </Card>
      <Keys f={f} a={702} b={742} keys={["Enter"]} press={720} />
      <Keys f={f} a={832} b={872} keys={["Enter"]} press={850} />
      <Click f={f} at={632} x={b2.x} y={b2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <TopBadge f={f} a={60} b={540} ar="الدرس 21 من 76 | ختام الوحدة 4" en="Date & Time Intelligence Engine" />
      <Tag f={f} a={660} b={1140} color={BLU} text="EOMONTH Engine ──► =EOMONTH(start_date, months) Auto-Calculates Month-End Due Dates" />
    </div>
  );
};

/* ───────────────────────── SCENE 2: WORKDAY.INTL ───────────────────────── */
const START = D(2026, 3, 1);
const COUNTED = countedDays(START, 30, HOLIDAYS);
const REAL = COUNTED[29];
const NAIVE = START + 30 * 86400000;
const PY = 120, PH = 720, PW = 880;
export const Scene2: React.FC<{f: number}> = ({f}) => {
  const o = prog(f, 40, 70);
  const n = Math.min(30, Math.max(0, Math.floor(((f - 704) / 146) * 30) + (f >= 704 ? 1 : 0)));
  const done = f >= 850;
  const FW = "=WORKDAY.INTL(A2,30,7,Holidays)";
  const ft = typed(FW, f, 120, 0.3);
  const left = (d: number): CalCell | undefined => (d === 1 ? {bg: AMB, fg: "#1C1100", ring: AMB} : d === 31 ? {bg: AMB, fg: "#1C1100", ring: AMB} : undefined);
  const cal = (month: number) => (d: number): CalCell | undefined => {
    const t = D(2026, month, d);
    if (t === START) return {bg: "#334155", fg: "#fff", ring: C.mute};
    if (HOLIDAYS.includes(t) && f >= 250) return {bg: "rgba(245,158,11,.35)", fg: "#FDE68A", strike: n >= 1 && t < (COUNTED[Math.max(0, n - 1)] ?? 0) ? true : false, ring: AMB};
    const idx = COUNTED.indexOf(t);
    if (idx >= 0 && idx < n) return idx === 29 && done ? {bg: EME, fg: "#032B1B", ring: EME, text: "30"} : {bg: "rgba(16,185,129,.55)", fg: "#fff", text: String(idx + 1)};
    return undefined;
  };
  const codes: [string, string][] = [["1", "Sat + Sun"], ["7", "Fri + Sat"], ["11", "Sun only"]];
  const pulse = 0.6 + 0.4 * Math.sin(f / 6);
  const panel: React.CSSProperties = {position: "absolute", top: PY, width: PW, height: PH, opacity: o, transform: `translateY(${(1 - o) * 24}px)`, background: "rgba(15,23,42,.94)", borderRadius: 18, fontFamily: MONO};
  return (
    <div style={{position: "absolute", inset: 0}}>
      <div style={{...panel, left: 50, border: `2px solid ${AMB}`, boxShadow: `0 0 ${24 * pulse}px ${AMB}55`}}>
        <div style={{padding: "16px 28px 0", fontSize: 30, fontWeight: 700, color: AMB}}>Naïve addition</div>
        <div style={{padding: "6px 28px 0", fontSize: 26, color: C.text}}>=A2+30</div>
        <div style={{padding: "10px 28px 0", fontSize: 22, color: C.mute}}>{fmtD(START)} + 30 days = <span style={{color: "#FDE68A", fontWeight: 700}}>{fmtD(NAIVE)}</span></div>
        <div style={{position: "absolute", left: 40, top: 190}}><MiniCal year={2026} month={3} w={400} cell={left} /></div>
        <div style={{position: "absolute", left: 480, top: 220, width: 370, fontSize: 22, color: "#FCD34D", lineHeight: 1.5, opacity: prog(f, 380, 420)}}>
          ⚠ Counts calendar days.<br />Ignores Fri / Sat weekends<br />and official holidays.
        </div>
      </div>
      <div style={{...panel, left: 990, border: `2px solid ${EME}`, boxShadow: `0 0 24px ${EME}44`}}>
        <div style={{padding: "16px 28px 0", fontSize: 30, fontWeight: 700, color: EME}}>WORKDAY.INTL</div>
        <div style={{padding: "6px 28px 0", fontSize: 26, color: C.text, height: 38}}>{ft}</div>
        <div style={{padding: "10px 28px 0", display: "flex", gap: 12, opacity: prog(f, 350, 380)}}>
          {codes.map(([c, t]) => <div key={c} style={{padding: "6px 12px", borderRadius: 10, border: `2px solid ${c === "7" ? EME : C.line}`, background: c === "7" && f >= 400 ? "rgba(16,185,129,.25)" : "transparent", boxShadow: c === "7" && f >= 400 ? `0 0 ${16 * pulse}px ${EME}` : "none", fontSize: 19, color: c === "7" ? "#A7F3D0" : C.mute}}>{c} = {t}</div>)}
        </div>
        <div style={{position: "absolute", left: 20, top: 190}}><MiniCal year={2026} month={3} w={400} cell={cal(3)} /></div>
        <div style={{position: "absolute", left: 450, top: 190}}><MiniCal year={2026} month={4} w={400} cell={cal(4)} /></div>
        <div style={{position: "absolute", left: 28, top: PH - 120, right: 28, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{opacity: prog(f, 520, 550), padding: "8px 14px", borderRadius: 10, border: `2px solid ${AMB}`, fontSize: 19, color: "#FDE68A"}}>Holidays: 22 · 23 · 24 Mar</div>
          <div style={{fontSize: 24, color: C.text, opacity: prog(f, 704, 724)}}>Workdays counted <span style={{color: "#6EE7B7", fontWeight: 700}}>{n} / 30</span></div>
        </div>
      </div>
      {f >= 884 ? (
        <div style={{position: "absolute", left: 360, top: 870, width: 1200, opacity: prog(f, 884, 910), transform: `translateY(${(1 - prog(f, 884, 910)) * 16}px)`, display: "flex", justifyContent: "center", gap: 28, alignItems: "center", fontFamily: MONO, fontSize: 28, fontWeight: 700}}>
          <span style={{color: "#FCD34D"}}>Naïve {fmtD(NAIVE)}</span><span style={{color: C.mute}}>→</span>
          <span style={{color: "#6EE7B7", textShadow: `0 0 18px ${EME}`}}>Real {fmtD(REAL)}</span><span style={{color: C.mute}}>(+{days(NAIVE, REAL)} days)</span>
        </div>
      ) : null}
      <Tag f={f} a={60} b={600} color={EME} text="WORKDAY.INTL Mechanics ──► =WORKDAY.INTL(start_date, days, [weekend], [holidays])" />
      <Tag f={f} a={720} b={1260} color={EME} text="Project Scheduling ──► Dynamically Skips Weekends & Custom Holidays to Return Real Deadlines" />
    </div>
  );
};

/* ───────────────────────── SCENE 3: YEARFRAC + DATEDIF ───────────────────────── */
const Y2F = "=YEARFRAC(A2,B2,3)";
const SAFE = "=G2-EDATE(F2,DATEDIF(F2,G2,\"M\"))";
export const Scene3: React.FC<{f: number}> = ({f}) => {
  const yt = typed(Y2F, f, 90, 0.25), hT = typed('=DATEDIF(F2,G2,"Y")', f, 660, 0.3), iT = typed('=DATEDIF(F2,G2,"YM")', f, 755, 0.3);
  const kT = typed('=DATEDIF(F2,G2,"MD")', f, 850, 0.3), sT = typed(SAFE, f, 1060, 0.3);
  const yDone = f >= 190, hDone = f >= 740, iDone = f >= 830, kDone = f >= 925, sDone = f >= 1190;
  const rowShow = (r: number) => f >= 280 + (r - 2) * 20;
  const mths = monthsBetween(HIRE[0], ASOF);
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) {
      const h = ["Start", "End", "YEARFRAC b=3", "YEARFRAC b=0", "", "Hire Date", "As Of", "Years (Y)", "Months (YM)", "Days (safe)", "Days (MD)"][c];
      return h ? {text: h, bold: true, bg: c >= 5 ? "#E3F4EA" : HDR} : undefined;
    }
    if (r >= 2 && r <= 4) {
      const [a, b] = ASSETS[r - 2];
      if (c === 0) return {text: fmtD(a), num: true};
      if (c === 1) return {text: fmtD(b), num: true};
      if (c === 2) return r === 2 ? (yDone ? {text: f2(yearfrac3(a, b)), num: true, bold: true, bg: "#D3F3F8"} : f >= 90 ? {text: yt, edit: true} : undefined) : rowShow(r) ? {text: f2(yearfrac3(a, b)), num: true} : undefined;
      if (c === 3) return rowShow(r) ? {text: f2(yearfrac0(a, b)), num: true} : undefined;
    }
    if (r === 2 || r === 3) {
      const h = HIRE[r - 2];
      if (c === 5) return {text: fmtD(h), num: true};
      if (c === 6) return {text: fmtD(ASOF), num: true};
      if (r === 2) {
        if (c === 7) return hDone ? {text: String(Math.floor(mths / 12)), num: true, bold: true} : f >= 660 ? {text: hT, edit: true} : undefined;
        if (c === 8) return iDone ? {text: String(mths % 12), num: true, bold: true} : f >= 755 ? {text: iT, edit: true} : undefined;
        if (c === 9) return sDone ? {text: String(days(edate(h, monthsBetween(h, ASOF)), ASOF)), num: true, bold: true, bg: "#D7F5E4"} : f >= 1060 ? {text: sT, edit: true} : undefined;
        if (c === 10) return kDone ? {text: "⚠ avoid", bold: true, color: "#C00000"} : f >= 850 ? {text: kT, edit: true} : undefined;
      }
    }
    return undefined;
  };
  let sel: Sel = {r1: 2, c1: 2, r2: 2, c2: 2};
  if (f >= 740) sel = {r1: 2, c1: 7, r2: 2, c2: 7};
  if (f >= 830) sel = {r1: 2, c1: 8, r2: 2, c2: 8};
  if (f >= 925) sel = {r1: 2, c1: 10, r2: 2, c2: 10};
  if (f >= 1190) sel = {r1: 2, c1: 9, r2: 2, c2: 9};
  const editing = (f >= 90 && f < 190) || (f >= 660 && f < 740) || (f >= 755 && f < 830) || (f >= 850 && f < 925) || (f >= 1060 && f < 1190);
  const formula = f < 90 ? "" : f < 190 ? yt : f < 660 ? Y2F : f < 740 ? hT : f < 755 ? '=DATEDIF(F2,G2,"Y")' : f < 830 ? iT : f < 850 ? '=DATEDIF(F2,G2,"YM")' : f < 925 ? kT : f < 1060 ? '=DATEDIF(F2,G2,"MD")' : f < 1190 ? sT : SAFE;
  const nameBox = f < 660 ? "C2" : f < 755 ? "H2" : f < 850 ? "I2" : f < 1060 ? "K2" : "J2";
  const c2 = ctr(R1, 2, 2), h2 = ctr(R1, 2, 7), k2 = ctr(R1, 2, 10);
  const pts: Pt[] = [{f: 0, x: 1500, y: 700}, {f: 80, x: c2.x, y: c2.y}, {f: 600, x: c2.x + 60, y: c2.y + 120}, {f: 650, x: h2.x, y: h2.y}, {f: 840, x: k2.x, y: k2.y}, {f: 1100, x: k2.x - 150, y: k2.y + 160}];
  const cur = pathAt(f, pts);
  const pulse = 0.6 + 0.4 * Math.sin(f / 5);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={nameBox} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            <Neon f={f} a={190} b={640} x={colLeft(2)} y={ry(2)} w={cw(2)} h={M.rowH} color={CYA} r={3} />
            <Neon f={f} a={925} b={1100} x={colLeft(10)} y={ry(2)} w={cw(10)} h={M.rowH} color={RED} r={3} />
            <Neon f={f} a={1190} b={1353} x={colLeft(9)} y={ry(2)} w={cw(9)} h={M.rowH} color={EME} r={3} />
          </div>
        }
      />
      <Card f={f} a={190} b={640} x={640} y={400} w={800} color={CYA} title="YEARFRAC = exact fraction of a year">
        <Mono c="#A5F3FC" s={24}>{days(ASSETS[0][0], ASSETS[0][1])} days ÷ 365 = {yearfrac3(ASSETS[0][0], ASSETS[0][1]).toFixed(4)} ≈ 0.75</Mono>
        <Mono c="#67E8F9" s={22}>basis 3 = actual/365   ·   basis 0 = 30/360</Mono>
      </Card>
      <Card f={f} a={640} b={832} x={640} y={420} w={800} color={PUR} title="DATEDIF = service & age">
        <Mono c="#E9D5FF" s={24}>{fmtD(HIRE[0])} → {fmtD(ASOF)}</Mono>
        <Mono c="#fff" s={26}>{Math.floor(mths / 12)} years · {mths % 12} months</Mono>
      </Card>
      {f >= 832 && f < 1048 ? (
        <div style={{position: "absolute", left: 480, top: 400, width: 960, opacity: vis(f, 832, 1048, 14), transform: `scale(${0.96 + 0.04 * prog(f, 832, 860)})`, background: "rgba(15,23,42,.97)", border: `3px solid ${PUR}`, borderRadius: 18, padding: "20px 28px", boxShadow: `0 0 ${34 * pulse}px ${PUR}, 0 24px 60px rgba(0,0,0,.5)`}}>
          <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: "#E9D5FF"}}>DATEDIF  ·  "MD" unit</div>
          <div style={{fontFamily: MONO, fontSize: 25, color: "#FCA5A5", marginTop: 10, lineHeight: 1.4, textShadow: `0 0 ${14 * pulse}px ${RED}`}}>Caution: 'MD' unit may return negative or inaccurate day values in certain date ranges</div>
        </div>
      ) : null}
      <Card f={f} a={1048} b={1353} x={560} y={400} w={840} color={EME} title="Safe alternative for the remaining days">
        <Mono c="#A7F3D0" s={24}>{SAFE}</Mono>
        <Mono c="#fff" s={24}>= {fmtD(ASOF)} − {fmtD(edate(HIRE[0], monthsBetween(HIRE[0], ASOF)))} = {days(edate(HIRE[0], monthsBetween(HIRE[0], ASOF)), ASOF)} days</Mono>
      </Card>
      <Keys f={f} a={172} b={212} keys={["Enter"]} press={190} />
      <Click f={f} at={80} x={c2.x} y={c2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={93} b={633} color={CYA} text="YEARFRAC Precision ──► =YEARFRAC(start_date, end_date, [basis]) Returns Exact Fractional Years" />
      <Tag f={f} a={753} b={1293} color={PUR} text={'DATEDIF Warning ──► Avoid "MD" — Microsoft Documents Known Limitations With This Unit'} />
    </div>
  );
};
export {colName, A as _A, HIRE as _H, isWeekend7 as _w, workdayIntl as _wi, keyv as _k, lin as _l};
