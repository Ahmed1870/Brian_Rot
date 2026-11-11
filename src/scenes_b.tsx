import React from "react";
import {C, M, GRID_Y, MONO, FONT_AR, UNIT_PROGRESS} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Keys, Neon, Tag, pathAt, prog, typed, vis, lin, Pt} from "./kit";
import {CellSty, ExcelWindow, Grid, Sel, colLeft, colName, rowsRange} from "./xl";
import {Dialog, WinBtn} from "./kit";
import {QTY, PRICE, fmt, rev, bigQ, bigP, BIG_TOTAL} from "./data";
import {Mono, ctr, Tip, MenuBox} from "./common";
import {COLS} from "./theme";

const R1 = rowsRange(1);
const HDR = "#E3EBF5";
const BLU = C.blue, EME = C.green, AMB = C.amber, PUR = C.purple, RED = C.red;
const cw = (c: number) => COLS[c];
const ry = (r: number) => GRID_Y + (r - 1) * M.rowH;

/* ───────────────────────── SCENE 4: legacy CSE vs 365 ───────────────────────── */
export const Scene4: React.FC<{f: number}> = ({f}) => {
  const FM = "=A2:A10*B2:B10";
  const lt = typed(FM, f, 215, 0.22), mt = typed(FM, f, 515, 0.22);
  const legacy = f >= 300 && f < 470, fade = 1 - lin(f, 470, 505), legOn = f >= 300 && fade > 0;
  const modern = f >= 590;
  const lAlpha = f < 470 ? 1 : fade;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) { const h = ["Qty", "Unit Price", "", "", "Legacy", "", "Dynamic"][c]; return h ? {text: h, bold: true, bg: c === 4 ? "#FBE3E3" : c === 6 ? "#E3F4EA" : HDR} : undefined; }
    if (r < 2 || r > 10) return undefined;
    if (c === 0) return {text: String(QTY[r - 2]), num: true};
    if (c === 1) return {text: fmt(PRICE[r - 2]), num: true};
    if (c === 4) {
      if (r === 2 && f >= 215 && f < 300) return {text: lt, edit: true};
      return legOn ? (f >= 300 + (r - 2) * 3 ? {text: fmt(rev(r - 2)), num: true, color: `rgba(36,36,36,${lAlpha})`, bg: `rgba(251,227,227,${lAlpha})`} : undefined) : undefined;
    }
    if (c === 6) {
      if (r === 2 && f >= 515 && f < 590) return {text: mt, edit: true};
      return modern && f >= 592 + (r - 2) * 3 ? {text: fmt(rev(r - 2)), num: true} : undefined;
    }
    return undefined;
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0}, nm = "A1";
  const dragT = prog(f, 70, 110);
  if (f >= 60) { sel = {r1: 2, c1: 4, r2: 10, c2: 4, t: dragT}; nm = dragT < 1 ? "9R x 1C" : "E2"; }
  if (f >= 340 && f < 470) { sel = {r1: 5, c1: 4, r2: 5, c2: 4}; nm = "E5"; }
  if (f >= 500 && f < 590) { sel = {r1: 2, c1: 6, r2: 2, c2: 6}; nm = "G2"; }
  if (f >= 595) { sel = {r1: 3, c1: 6, r2: 3, c2: 6}; nm = "G3"; }
  const editing = (f >= 215 && f < 300) || (f >= 515 && f < 590);
  const formula = f < 215 ? "" : f < 300 ? lt : f < 340 ? "{=A2:A10*B2:B10}" : f < 470 ? "{=A2:A10*B2:B10}" : f < 515 ? "" : f < 590 ? mt : FM;
  const e2 = ctr(R1, 2, 4), e10 = ctr(R1, 10, 4), e5 = ctr(R1, 5, 4), g2 = ctr(R1, 2, 6);
  const ok = {x: M.x + 760 + 60, y: M.y + 232 + 150};
  const pts: Pt[] = [{f: 0, x: 1500, y: 700}, {f: 56, x: e2.x, y: e2.y}, {f: 108, x: e10.x, y: e10.y}, {f: 215, x: e10.x + 60, y: e10.y - 30}, {f: 340, x: e5.x + 60, y: e5.y + 20}, {f: 354, x: e5.x, y: e5.y}, {f: 420, x: e5.x + 50, y: e5.y + 30}, {f: 436, x: ok.x, y: ok.y}, {f: 450, x: ok.x, y: ok.y}, {f: 500, x: g2.x + 60, y: g2.y + 50}, {f: 510, x: g2.x, y: g2.y}, {f: 700, x: g2.x + 100, y: g2.y + 120}];
  const cur = pathAt(f, pts);
  const pulse = 0.6 + 0.4 * Math.sin(f / 6);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Home" nameBox={nm} formula={formula} formulaDim={f >= 595} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            {legOn ? <div style={{position: "absolute", left: colLeft(4), top: ry(2), width: cw(4), height: 9 * M.rowH, border: `2.5px solid ${RED}`, boxShadow: `0 0 ${16 * pulse}px ${RED}`, opacity: lAlpha, boxSizing: "border-box", zIndex: 6}} /> : null}
            {modern ? <div style={{position: "absolute", left: colLeft(6), top: ry(2), width: cw(6), height: 9 * M.rowH * prog(f, 592, 620), border: `2.5px solid ${EME}`, boxShadow: `0 0 ${16 * pulse}px ${EME}`, boxSizing: "border-box", zIndex: 6}} /> : null}
            {legacy && f >= 354 && f < 400 ? <Tip x={colLeft(4) + cw(4) + 12} y={ry(5) - 2} text="Part of a legacy array — locked as one block" /> : null}
            <Dialog f={f} a={398} b={444} x={760} y={232} w={440} h={200} title="Microsoft Excel">
              <div style={{position: "absolute", left: 20, top: 24, fontSize: 16}}>You can't change part of an array.</div>
              <div style={{position: "absolute", right: 18, bottom: 14}}><WinBtn label="OK" primary hot={f >= 436} /></div>
            </Dialog>
          </div>
        }
      />
      <Card f={f} a={31} b={199} x={1000} y={250} w={800} color={AMB} title="Legacy CSE  vs  Excel 365">
        <Mono c="#FCA5A5" s={22}>1. Select the whole output range first</Mono>
        <Mono c="#FCA5A5" s={22}>2. Type the formula</Mono>
        <Mono c="#FCA5A5" s={22}>3. Ctrl + Shift + Enter</Mono>
      </Card>
      <Card f={f} a={300} b={465} x={1000} y={250} w={800} color={RED} title="{=A2:A10*B2:B10}">
        <Mono c="#FCA5A5" s={22}>Curly braces appear in the formula bar</Mono>
        <Mono c="#FCA5A5" s={22}>Edit one cell → "can't change part of an array"</Mono>
      </Card>
      <Card f={f} a={600} b={652} x={1000} y={250} w={800} color={EME} title="Excel 365">
        <Mono c="#A7F3D0" s={24}>Type once → Enter → it spills</Mono>
      </Card>
      <Card f={f} a={652} b={1131} x={960} y={230} w={880} color={EME} title="Legacy CSE  →  Dynamic Arrays">
        <div style={{display: "flex", gap: 26}}>
          <div style={{flex: 1, border: `2px solid ${RED}`, borderRadius: 12, padding: "10px 16px"}}>
            {["Select range first", "Ctrl+Shift+Enter", "{ braces }", "Locked array block"].map((t) => <Mono key={t} c="#FCA5A5" s={22}>✕ {t}</Mono>)}
          </div>
          <div style={{flex: 1, border: `2px solid ${EME}`, borderRadius: 12, padding: "10px 16px"}}>
            {["Type in one cell", "Enter", "Spills + # follows", "Resizes by itself"].map((t) => <Mono key={t} c="#A7F3D0" s={22}>✓ {t}</Mono>)}
          </div>
        </div>
        <Mono c={C.mute} s={19}>Legacy CSE still works for compatibility — you just don't need it.</Mono>
      </Card>
      <Keys f={f} a={282} b={332} keys={["Ctrl", "Shift", "Enter"]} press={300} x={1330} />
      <Keys f={f} a={572} b={612} keys={["Enter"]} press={590} />
      <Click f={f} at={56} x={e2.x} y={e2.y} />
      <Click f={f} at={354} x={e5.x} y={e5.y} />
      <Click f={f} at={438} x={ok.x} y={ok.y} />
      <Click f={f} at={510} x={g2.x} y={g2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={60} b={540} color={RED} text="Legacy CSE Formulas ──► {=...} via Ctrl+Shift+Enter (Still Works, No Longer Needed)" />
      <Tag f={f} a={660} b={1100} color={EME} text="Excel 365 Engine ──► Native Dynamic Array Spilling with Standard Enter Key" />
    </div>
  );
};
export {colName as _cn, rowsRange as _rr, MenuBox as _mb};

/* ───────────────────────── SCENE 5: 50,000-row enterprise demo ───────────────────────── */
const F5 = "=A2:A50001*B2:B50001", S5 = "=SUM(C2#)";
export const Scene5: React.FC<{f: number}> = ({f}) => {
  const ft = typed(F5, f, 360, 0.33), st = typed(S5, f, 570, 0.18);
  const spilled = f >= 442, tot = f >= 650;
  const N = Math.floor(50000 * prog(f, 442, 560));
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) { const h = ["Qty", "Unit Price", "Revenue", "", "", "Total"][c]; return h ? {text: h, bold: true, bg: c === 5 ? "#EFE6FB" : HDR} : undefined; }
    if (r < 2 || r > 50001) return undefined;
    if (c === 0) return {text: String(bigQ(r - 2)), num: true};
    if (c === 1) return {text: fmt(bigP(r - 2)), num: true};
    if (c === 2) { if (r === 2 && f >= 360 && f < 440) return {text: ft, edit: true}; return spilled && f >= 442 + (r - 2) * 1.4 ? {text: fmt(bigQ(r - 2) * bigP(r - 2)), num: true} : undefined; }
    if (c === 5 && r === 2) return tot ? {text: fmt(BIG_TOTAL), num: true, bold: true, bg: "#EFE6FB"} : f >= 570 ? {text: st, edit: true} : undefined;
    return undefined;
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0}, nm = "A1";
  if (f >= 345) { sel = {r1: 2, c1: 2, r2: 2, c2: 2}; nm = "C2"; }
  if (f >= 444) { sel = {r1: 3, c1: 2, r2: 3, c2: 2}; nm = "C3"; }
  if (f >= 556) { sel = {r1: 2, c1: 5, r2: 2, c2: 5}; nm = "F2"; }
  const editing = (f >= 360 && f < 440) || (f >= 570 && f < 650);
  const formula = f < 360 ? "" : f < 440 ? ft : f < 570 ? F5 : f < 650 ? st : S5;
  const c2 = ctr(R1, 2, 2), f2 = ctr(R1, 2, 5);
  const pts: Pt[] = [{f: 0, x: 1500, y: 600}, {f: 335, x: c2.x + 60, y: c2.y + 60}, {f: 345, x: c2.x, y: c2.y}, {f: 520, x: c2.x + 90, y: c2.y + 140}, {f: 548, x: f2.x, y: f2.y}, {f: 700, x: f2.x + 120, y: f2.y + 120}];
  const cur = pathAt(f, pts);
  const seal = prog(f, 700, 745);
  const loaded = lin(f, 60, 200);
  const pulse = 0.6 + 0.4 * Math.sin(f / 6);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={nm} formula={formula} formulaDim={f >= 444 && f < 556} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            <div style={{position: "absolute", left: M.w - 16, top: GRID_Y, width: 14, height: M.rows * M.rowH, background: "#EDEDED"}}><div style={{width: 10, height: 9, margin: "3px 2px", background: "#9A9A9A", borderRadius: 3}} /></div>
            {spilled ? <div style={{position: "absolute", left: colLeft(2), top: ry(2), width: cw(2), height: Math.min(23, 23 * prog(f, 442, 520)) * M.rowH, border: `2.5px solid ${tot ? PUR : BLU}`, borderBottom: "none", boxShadow: `0 0 ${14 * pulse}px ${tot ? PUR : BLU}`, boxSizing: "border-box", zIndex: 6}} /> : null}
            {tot ? <Neon f={f} a={650} b={760} x={colLeft(5)} y={ry(2)} w={cw(5)} h={M.rowH} color={PUR} r={3} /> : null}
          </div>
        }
      />
      <Card f={f} a={40} b={330} x={560} y={380} w={800} color={BLU} title="Opening manzooma_sales_2026.xlsx">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.text}}>50,001 rows (incl. header)</div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", marginTop: 14, overflow: "hidden"}}><div style={{width: `${loaded * 100}%`, height: "100%", background: `linear-gradient(90deg, ${BLU}, ${EME})`}} /></div>
        <div style={{fontFamily: MONO, fontSize: 20, color: loaded >= 1 ? "#6EE7B7" : C.mute, marginTop: 8}}>{loaded >= 1 ? "✓ Loaded" : `Loading… ${Math.round(loaded * 100)}%`}</div>
      </Card>
      <Card f={f} a={442} b={705} x={1010} y={230} w={780} color={BLU} title="One spill formula">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.mute}}>Rows spilled from C2</div>
        <div style={{fontFamily: MONO, fontSize: 46, fontWeight: 700, color: "#93C5FD"}}>{fmt(N)} / 50,000</div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", marginTop: 10, overflow: "hidden"}}><div style={{width: `${(N / 50000) * 100}%`, height: "100%", background: BLU}} /></div>
      </Card>
      {seal > 0 ? (
        <div style={{position: "absolute", left: 1040, top: 170, width: 720, padding: "26px 0 30px", background: "rgba(15,23,42,.96)", border: `2px solid ${EME}`, borderRadius: 26, boxShadow: `0 0 40px ${EME}66, 0 24px 60px rgba(0,0,0,.5)`, opacity: vis(f, 700, 966, 20), transform: `scale(${0.7 + 0.3 * seal})`, transformOrigin: "50% 40%", textAlign: "center"}}>
          <svg width={260} height={260} viewBox="0 0 300 300" style={{filter: `drop-shadow(0 0 26px ${EME})`}}>
            <circle cx={150} cy={150} r={138} fill="none" stroke={EME} strokeWidth={3} strokeDasharray="10 12" transform={`rotate(${f * 0.6} 150 150)`} />
            <circle cx={150} cy={150} r={112} fill="rgba(16,185,129,.14)" stroke={EME} strokeWidth={8} />
            <path d="M98 154 L136 192 L206 112" fill="none" stroke="#6EE7B7" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={170} strokeDashoffset={170 * (1 - prog(f, 720, 760))} />
          </svg>
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: "#6EE7B7", marginTop: 4}}>ENTERPRISE DYNAMIC ARRAY SEAL</div>
          <div style={{fontFamily: MONO, fontSize: 23, color: C.text, marginTop: 8}}>50,000 rows · 2 formulas · 0 fill-downs</div>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.mute, marginTop: 6}}>Total = {fmt(BIG_TOTAL)}</div>
        </div>
      ) : null}
      <Keys f={f} a={422} b={462} keys={["Enter"]} press={440} />
      <Keys f={f} a={632} b={672} keys={["Enter"]} press={650} />
      <Click f={f} at={345} x={c2.x} y={c2.y} />
      <Click f={f} at={548} x={f2.x} y={f2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={61} b={541} color={BLU} text="Enterprise Dynamic Arrays ──► Spill Calculated Matrices Across 50,000 Sales Records in One Formula" />
      <Tag f={f} a={700} b={940} color={EME} text="Zero Manual Fill-Down ──► One Spill Formula + the # Operator Replace Thousands of Copied Formulas" />
    </div>
  );
};

/* ───────────────────────── SCENE 6 ───────────────────────── */
const SKILLS = ["Spill physics: one formula, many cells", "#SPILL! causes and their fixes", "Spill operator # (C2#)", "Implicit intersection @", "Dynamic arrays vs legacy CSE"];
export const Scene6: React.FC<{f: number}> = ({f}) => {
  const a = A[5];
  const fill = prog(f, 60, 170);
  const pct = (UNIT_PROGRESS * 100 * fill).toFixed(1);
  const fade = 1 - lin(f, 1150, 1200);
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
            <div><div style={{fontFamily: MONO, fontSize: 22, color: "#6EE7B7", fontWeight: 700}}>Lesson 33 Completed</div><div style={{fontFamily: MONO, fontSize: 19, color: C.text}}>Dynamic Arrays Engine Mastered</div></div>
          </div>
          <div style={{marginTop: 30, fontFamily: MONO, fontSize: 20, color: C.mute, display: "flex", justifyContent: "space-between"}}><span>Course progress · lesson 33 of 76</span><span style={{color: C.text}}>Unit 7 of 14</span></div>
          <div style={{height: 22, borderRadius: 12, background: "#0B1220", marginTop: 10, overflow: "hidden", border: `1px solid ${C.line}`}}><div style={{width: `${UNIT_PROGRESS * 100 * fill}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, boxShadow: `0 0 18px ${C.green}`}} /></div>
          <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: "#6EE7B7", marginTop: 8, textAlign: "right"}}>{pct}%</div>
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 18, color: C.mute}}><span>Units complete · 6 of 14</span><span style={{color: "#6EE7B7"}}>42.9%</span></div>
          <div style={{height: 12, borderRadius: 8, background: "#0B1220", marginTop: 4, overflow: "hidden", border: `1px solid ${C.line}`}}><div style={{width: `${(6 / 14) * 100 * fill}%`, height: "100%", background: C.green}} /></div>
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
          <div style={{fontFamily: FONT_AR, fontSize: 34, fontWeight: 700, color: C.text, direction: "rtl", marginTop: 6}}>الدرس 34 (الوحدة 7 من 14)</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: "#BAE6FD", marginTop: 6}}>UNIQUE & SORT Engine</div>
          <div style={{marginTop: 18, borderRadius: 10, overflow: "hidden", border: "1px solid #475569", width: 560}}>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} style={{display: "flex", height: 34, background: r === 0 ? "#4EA72E" : r % 2 ? "#DCEBD5" : "#fff"}}>
                {[0, 1, 2, 3].map((c) => <div key={c} style={{flex: 1, borderRight: "1px solid #BBB", fontFamily: MONO, fontSize: 17, lineHeight: "34px", padding: "0 10px", color: r === 0 ? "#fff" : "#222", display: "flex", justifyContent: "space-between"}}><span>{r === 0 ? ["Name", "Region", "Sales", "Rank"][c] : ""}</span>{r === 0 ? <span style={{fontSize: 11}}>▼</span> : null}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
