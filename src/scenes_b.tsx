import React from "react";
import {C, M, GRID_Y, MONO, FONT_AR, UNIT_PROGRESS, COLS} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Keys, Neon, Tag, pathAt, prog, typed, vis, lin, Pt} from "./kit";
import {CellSty, ExcelWindow, Grid, Sel, colLeft, colName, rowsRange} from "./xl";
import {CONTRACTS, HOLIDAYS, bigRow, eomonth, fmt, fmtD} from "./data";
import {Colored, Mono, ctr} from "./common";

const R1 = rowsRange(1);
const BLU = C.blue, EME = C.green, AMB = C.amber;
const cw = (c: number) => COLS[c];
const ry = (r: number) => GRID_Y + (r - 1) * M.rowH;
const HDR = "#E3EBF5";

/* ───────────────────────── SCENE 4: spill + hashtag ───────────────────────── */
const SPILL0 = 18;
export const Scene4: React.FC<{f: number}> = ({f}) => {
  const BF = "=EOMONTH(A2#,0)", AF = "=SORT(tbl_Contracts[Start])";
  const bt = typed(BF, f, 290, 0.25);
  const added = f >= 720 ? Math.min(5, Math.floor((f - 720) / 22) + 1) : 0;
  const N = SPILL0 + added;
  const aShow = (r: number) => r - 2 < N;
  const bShow = (r: number) => (r - 2 < SPILL0 ? f >= 420 + (r - 2) * 3 : r - 2 < N && f >= 720 + (r - 2 - SPILL0) * 22 + 8);
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) return c === 0 ? {text: "Contract Start", bold: true, bg: HDR} : c === 1 ? {text: "Due (EOM)", bold: true, bg: HDR} : undefined;
    if (r < 2 || r > 24) return undefined;
    if (c === 0) return aShow(r) ? {text: fmtD(CONTRACTS[r - 2]), num: true, bg: r - 2 >= SPILL0 ? "#DDF3E6" : undefined} : undefined;
    if (c === 1) {
      if (r === 2 && f >= 290 && f < 420) return {text: bt, edit: true};
      return bShow(r) ? {text: fmtD(eomonth(CONTRACTS[r - 2], 0)), num: true, bg: r - 2 >= SPILL0 ? "#DDF3E6" : undefined} : undefined;
    }
    return undefined;
  };
  let sel: Sel = {r1: 2, c1: 0, r2: 2, c2: 0};
  if (f >= 290) sel = {r1: 2, c1: 1, r2: 2, c2: 1};
  const editing = f >= 290 && f < 420;
  const formula = f < 290 ? AF : f < 420 ? bt : BF;
  const hashGlow = f >= 340 ? 0.6 + 0.4 * Math.sin(f / 5) : 0;
  const b2 = ctr(R1, 2, 1), aEnd = ctr(R1, 20, 0);
  const pts: Pt[] = [{f: 0, x: 1500, y: 700}, {f: 270, x: b2.x + 40, y: b2.y + 60}, {f: 290, x: b2.x, y: b2.y}, {f: 560, x: b2.x + 200, y: b2.y + 200}, {f: 760, x: aEnd.x + 120, y: aEnd.y}];
  const cur = pathAt(f, pts);
  const spillBox = (c: number, on: boolean) => on ? <div key={c} style={{position: "absolute", left: colLeft(c), top: ry(2), width: cw(c), height: N * M.rowH, border: `2.5px solid ${BLU}`, boxShadow: `0 0 14px ${BLU}88`, boxSizing: "border-box", zIndex: 6, pointerEvents: "none"}} /> : null;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={f < 290 ? "A2" : "B2"} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={<div style={{position: "absolute", inset: 0}}>{spillBox(0, f >= 40)}{spillBox(1, f >= 420)}</div>}
      />
      <Card f={f} a={340} b={665} x={1000} y={260} w={800} color={AMB} title="Spill reference  A2#">
        <Colored s={36} parts={[["=EOMONTH(", BLU], ["A2", BLU], ["#", AMB], [",0)", BLU]]} />
        <div style={{fontFamily: MONO, fontSize: 22, color: "#FDE68A", marginTop: 10, textShadow: `0 0 ${14 * hashGlow}px ${AMB}`}}># = the whole spilled range that starts at A2</div>
      </Card>
      <Card f={f} a={720} b={1199} x={1000} y={200} w={820} color={EME} title="New contracts → tbl_Contracts">
        {CONTRACTS.slice(SPILL0 - 2, SPILL0 + 5).map((t, i) => {
          const k = SPILL0 - 2 + i;
          const on = k < SPILL0 || k - SPILL0 < added;
          return <div key={k} style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22, height: 32, color: k >= SPILL0 ? "#6EE7B7" : C.mute, opacity: on ? 1 : 0.15, borderBottom: "1px solid #334155"}}><span>#{k + 1}</span><span>{fmtD(t)}</span></div>;
        })}
      </Card>
      <Card f={f} a={760} b={1199} x={1000} y={560} w={820} color={BLU} title="Spill size">
        <div style={{fontFamily: MONO, fontSize: 46, fontWeight: 700, color: "#6EE7B7"}}>{SPILL0} → {N} rows</div>
        <Mono c={C.mute} s={20}>A2# and B2# both grow — nothing to copy</Mono>
      </Card>
      <Keys f={f} a={402} b={442} keys={["Enter"]} press={420} />
      <Click f={f} at={290} x={b2.x} y={b2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={60} b={540} color={BLU} text="Spilled Date Matrices ──► =EOMONTH(A2#, 0) Evaluates Entire Spilled Date Ranges Instantly" />
      <Tag f={f} a={660} b={1140} color={EME} text="Real-time Schedules ──► Payment Schedules Expand Dynamically as New Contracts Are Added" />
    </div>
  );
};

/* ───────────────────────── SCENE 5: 50,000-row enterprise demo ───────────────────────── */
const FB = "=EOMONTH([@InvoiceDate],1)";
const FC = "=WORKDAY.INTL([@InvoiceDate],30,7,Holidays)";
export const Scene5: React.FC<{f: number}> = ({f}) => {
  const bh = typed("DueDate", f, 360, 0.5), ch = typed("Delivery", f, 546, 0.5);
  const bt = typed(FB, f, 380, 0.5), ct = typed(FC, f, 560, 0.6);
  const bRow = (r: number) => f >= 482 + (r - 2) * 1.2, cRow = (r: number) => f >= 652 + (r - 2) * 1.2;
  const N1 = Math.floor(50000 * prog(f, 482, 540)), N2 = Math.floor(50000 * prog(f, 652, 710));
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) {
      if (c === 0) return {text: "InvoiceDate", bold: true};
      if (c === 1) return f >= 378 ? {text: "DueDate", bold: true} : f >= 360 ? {text: bh, edit: true} : undefined;
      if (c === 2) return f >= 556 ? {text: "Delivery", bold: true} : f >= 546 ? {text: ch, edit: true} : undefined;
      return undefined;
    }
    if (r < 2 || r > 50001 || c > 2) return undefined;
    const d = bigRow(r - 2);
    if (c === 0) return {text: fmtD(d.inv), num: true};
    if (c === 1) {
      if (r === 2 && f >= 380 && f < 480) return {text: bt, edit: true};
      return f >= 482 && bRow(r) ? {text: fmtD(d.due), num: true} : undefined;
    }
    if (r === 2 && f >= 560 && f < 650) return {text: ct, edit: true};
    return f >= 652 && cRow(r) ? {text: fmtD(d.del), num: true} : undefined;
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  if (f >= 360) sel = {r1: 1, c1: 1, r2: 1, c2: 1};
  if (f >= 380) sel = {r1: 2, c1: 1, r2: 2, c2: 1};
  if (f >= 482) sel = {r1: 3, c1: 1, r2: 3, c2: 1};
  if (f >= 546) sel = {r1: 1, c1: 2, r2: 1, c2: 2};
  if (f >= 560) sel = {r1: 2, c1: 2, r2: 2, c2: 2};
  if (f >= 652) sel = {r1: 3, c1: 2, r2: 3, c2: 2};
  const editing = (f >= 360 && f < 378) || (f >= 380 && f < 480) || (f >= 546 && f < 556) || (f >= 560 && f < 650);
  const formula = f >= 360 && f < 378 ? bh : f >= 380 && f < 480 ? bt : f >= 482 && f < 546 ? FB : f >= 546 && f < 556 ? ch : f >= 560 && f < 650 ? ct : f >= 652 ? FC : "";
  const d2 = ctr(R1, 2, 1), e2 = ctr(R1, 2, 2);
  const pts: Pt[] = [{f: 0, x: 1500, y: 600}, {f: 340, x: d2.x + 160, y: d2.y + 100}, {f: 372, x: d2.x, y: d2.y}, {f: 540, x: d2.x + 60, y: d2.y + 120}, {f: 556, x: e2.x, y: e2.y}, {f: 700, x: e2.x + 150, y: e2.y + 130}];
  const cur = pathAt(f, pts);
  const seal = prog(f, 700, 745);
  const loaded = lin(f, 60, 200);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={f < 360 ? "A1" : f < 380 ? "B1" : f < 482 ? "B2" : f < 546 ? "B3" : f < 560 ? "C1" : f < 652 ? "C2" : "C3"} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} table={{top: 1, bottom: 50001, left: 0, right: f >= 556 ? 2 : f >= 378 ? 1 : 0, p: 1, glow: Math.max(vis(f, 378, 430, 12), vis(f, 556, 610, 12)) * 0.8}} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            <div style={{position: "absolute", left: M.w - 16, top: GRID_Y, width: 14, height: M.rows * M.rowH, background: "#EDEDED"}}><div style={{width: 10, height: 9, margin: "3px 2px", background: "#9A9A9A", borderRadius: 3}} /></div>
            <Neon f={f} a={482} b={560} x={colLeft(1)} y={GRID_Y + M.rowH} w={cw(1)} h={23 * M.rowH} color={EME} r={3} />
            <Neon f={f} a={652} b={730} x={colLeft(2)} y={GRID_Y + M.rowH} w={cw(2)} h={23 * M.rowH} color={EME} r={3} />
          </div>
        }
      />
      <Card f={f} a={40} b={330} x={560} y={380} w={800} color={BLU} title="Opening manzooma_sales_2026.xlsx">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.text}}>50,001 rows (incl. header)</div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", marginTop: 14, overflow: "hidden"}}><div style={{width: `${loaded * 100}%`, height: "100%", background: `linear-gradient(90deg, ${BLU}, ${EME})`}} /></div>
        <div style={{fontFamily: MONO, fontSize: 20, color: loaded >= 1 ? "#6EE7B7" : C.mute, marginTop: 8}}>{loaded >= 1 ? "✓ Loaded" : `Loading… ${Math.round(loaded * 100)}%`}</div>
      </Card>
      <Card f={f} a={150} b={485} x={1140} y={200} w={640} color={AMB} title="Holidays  ·  named range">
        {HOLIDAYS.map((t) => <div key={t} style={{fontFamily: MONO, fontSize: 24, color: "#FDE68A", height: 34, borderBottom: "1px solid #334155"}}>{fmtD(t)}</div>)}
      </Card>
      <Card f={f} a={482} b={705} x={1010} y={230} w={780} color={EME} title="Calculated Columns">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.mute}}>DueDate</div>
        <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: "#6EE7B7"}}>{fmt(N1)} / 50,000</div>
        <div style={{fontFamily: MONO, fontSize: 24, color: C.mute, marginTop: 6}}>Delivery</div>
        <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: "#6EE7B7"}}>{fmt(N2)} / 50,000</div>
      </Card>
      {seal > 0 ? (
        <div style={{position: "absolute", left: 1040, top: 170, width: 720, padding: "26px 0 30px", background: "rgba(15,23,42,.96)", border: `2px solid ${EME}`, borderRadius: 26, boxShadow: `0 0 40px ${EME}66, 0 24px 60px rgba(0,0,0,.5)`, opacity: vis(f, 700, 1171, 20), transform: `scale(${0.7 + 0.3 * seal})`, transformOrigin: "50% 40%", textAlign: "center"}}>
          <svg width={260} height={260} viewBox="0 0 300 300" style={{filter: `drop-shadow(0 0 26px ${EME})`}}>
            <circle cx={150} cy={150} r={138} fill="none" stroke={EME} strokeWidth={3} strokeDasharray="10 12" transform={`rotate(${f * 0.6} 150 150)`} />
            <circle cx={150} cy={150} r={112} fill="rgba(16,185,129,.14)" stroke={EME} strokeWidth={8} />
            <path d="M98 154 L136 192 L206 112" fill="none" stroke="#6EE7B7" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={170} strokeDashoffset={170 * (1 - prog(f, 720, 760))} />
          </svg>
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: "#6EE7B7", marginTop: 4}}>ENTERPRISE DATE ENGINE SEAL</div>
          <div style={{fontFamily: MONO, fontSize: 23, color: C.text, marginTop: 8}}>tbl_Sales · 50,000 rows · 2 formulas</div>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.mute, marginTop: 6}}>Zero manual calendar math</div>
        </div>
      ) : null}
      <Keys f={f} a={462} b={502} keys={["Enter"]} press={480} />
      <Keys f={f} a={632} b={672} keys={["Enter"]} press={650} />
      <Click f={f} at={372} x={d2.x} y={d2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={61} b={541} color={BLU} text="Enterprise Date Automation ──► Process 50,000 Due Dates & Contract Spans in One Step" />
      <Tag f={f} a={661} b={1141} color={EME} text="Zero Manual Calendar Math ──► Automated Payment Schedules & Deadlines From One Formula Each" />
    </div>
  );
};

/* ───────────────────────── SCENE 6 ───────────────────────── */
const SKILLS = ["EOMONTH → month-end due dates", "WORKDAY.INTL → real project deadlines", "YEARFRAC → exact year fractions", "DATEDIF → and its \"MD\" limitation", "Date functions + the # spill reference"];
export const Scene6: React.FC<{f: number}> = ({f}) => {
  const a = A[5];
  const fill = prog(f, 60, 170);
  const pct = (UNIT_PROGRESS * 100 * fill).toFixed(1);
  const fade = 1 - lin(f, 880, 930);
  const glass: React.CSSProperties = {background: "rgba(30,41,59,.78)", border: "1.5px solid rgba(148,163,184,.28)", borderRadius: 22, boxShadow: "0 24px 60px rgba(0,0,0,.45)"};
  return (
    <div style={{position: "absolute", inset: 0, background: `rgba(0,0,0,${1 - fade})`}}>
      <div style={{position: "absolute", inset: 0, opacity: fade * prog(f, 0, 26)}}>
        <div style={{position: "absolute", left: 130, top: 120, width: 1660, height: 840, ...glass}} />
        <div style={{position: "absolute", left: 130, top: 150, width: 1660, textAlign: "center", fontFamily: FONT_AR, color: C.text, opacity: prog(f, 4, 30)}}>
          <div style={{fontSize: 50, fontWeight: 700, direction: "rtl"}}>منظومة أكاديمي <span style={{color: C.green}}>|</span> <bdi dir="ltr">Manzooma Excel Masterclass</bdi></div>
          <div style={{fontSize: 24, color: C.mute, marginTop: 6}}><bdi dir="ltr">Excel From Zero to Professional</bdi></div>
        </div>
        <div style={{position: "absolute", left: 190, top: 300, width: 800, opacity: prog(f, a[0], a[0] + 24), transform: `translateY(${(1 - prog(f, a[0], a[0] + 24)) * 20}px)`}}>
          <div style={{display: "inline-flex", alignItems: "center", gap: 16, padding: "12px 24px", borderRadius: 16, background: "rgba(16,185,129,.16)", border: `2px solid ${C.green}`, boxShadow: `0 0 24px ${C.green}55`}}>
            <div style={{width: 44, height: 44, borderRadius: 22, background: C.green, color: "#052E16", fontSize: 30, fontWeight: 800, textAlign: "center", lineHeight: "44px"}}>✓</div>
            <div><div style={{fontFamily: MONO, fontSize: 22, color: "#6EE7B7", fontWeight: 700}}>Lesson 21 Completed</div><div style={{fontFamily: MONO, fontSize: 19, color: C.text}}>Unit 4 Mastered · 100% Complete</div></div>
          </div>
          <div style={{marginTop: 30, fontFamily: MONO, fontSize: 20, color: C.mute, display: "flex", justifyContent: "space-between"}}><span>Course progress · lesson 21 of 76</span><span style={{color: C.text}}>Unit 4 of 14</span></div>
          <div style={{height: 22, borderRadius: 12, background: "#0B1220", marginTop: 10, overflow: "hidden", border: `1px solid ${C.line}`}}><div style={{width: `${UNIT_PROGRESS * 100 * fill}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, boxShadow: `0 0 18px ${C.green}`}} /></div>
          <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: "#6EE7B7", marginTop: 8, textAlign: "right"}}>{pct}%</div>
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 18, color: C.mute}}><span>Unit 4 · 7 of 7 lessons</span><span style={{color: "#6EE7B7"}}>100%</span></div>
          <div style={{height: 12, borderRadius: 8, background: "#0B1220", marginTop: 4, overflow: "hidden", border: `1px solid ${C.line}`}}><div style={{width: `${100 * fill}%`, height: "100%", background: C.green}} /></div>
          <div style={{marginTop: 12}}>
            {SKILLS.map((t, i) => (
              <div key={t} style={{display: "flex", gap: 14, alignItems: "center", height: 40, opacity: prog(f, 80 + i * 22, 100 + i * 22), transform: `translateX(${(1 - prog(f, 80 + i * 22, 100 + i * 22)) * -24}px)`}}>
                <span style={{color: C.green, fontSize: 28, fontWeight: 800}}>✓</span><span style={{fontFamily: MONO, fontSize: 24, color: C.text}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{position: "absolute", left: 1050, top: 300, width: 680, padding: "20px 28px", ...glass, border: `1.5px solid ${C.green}88`, opacity: prog(f, a[1], a[1] + 24), transform: `translateY(${(1 - prog(f, a[1], a[1] + 24)) * 24}px)`}}>
          <div style={{fontFamily: FONT_AR, fontSize: 26, color: C.mute, direction: "rtl"}}>الملفات والتدريبات</div>
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.text, marginTop: 8}}>manzooma_sales_2026.xlsx</div>
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green, marginTop: 8, textShadow: `0 0 16px ${C.green}88`}}>solutions.gomaaintelligence.me</div>
        </div>
        <div style={{position: "absolute", left: 1050, top: 540, width: 680, height: 330, padding: "20px 28px", ...glass, border: `1.5px solid ${C.blue}88`, opacity: prog(f, a[2], a[2] + 24), transform: `translateY(${(1 - prog(f, a[2], a[2] + 24)) * 24}px)`}}>
          <div style={{fontFamily: FONT_AR, fontSize: 26, color: C.blue, direction: "rtl", fontWeight: 700}}>الدرس القادم</div>
          <div style={{fontFamily: FONT_AR, fontSize: 34, fontWeight: 700, color: C.text, direction: "rtl", marginTop: 6}}>الدرس 22 (الوحدة 5 من 14)</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: "#BAE6FD", marginTop: 6}}>Data Validation & Dynamic Dropdowns</div>
          <div style={{marginTop: 18, borderRadius: 10, overflow: "hidden", border: "1px solid #475569", width: 560}}>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} style={{display: "flex", height: 34, background: r === 0 ? "#4EA72E" : r % 2 ? "#DCEBD5" : "#fff"}}>
                {[0, 1, 2, 3].map((c) => <div key={c} style={{flex: 1, borderRight: "1px solid #BBB", fontFamily: MONO, fontSize: 17, lineHeight: "34px", padding: "0 10px", color: r === 0 ? "#fff" : "#222", display: "flex", justifyContent: "space-between"}}><span>{r === 0 ? ["Item", "Status", "Owner", "Due"][c] : ""}</span>{r === 0 ? <span style={{fontSize: 11}}>▼</span> : null}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
