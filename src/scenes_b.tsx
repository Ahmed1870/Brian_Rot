import React from "react";
import {C, M, GRID_Y, MONO, FONT_AR, UNIT_PROGRESS} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Keys, Neon, Tag, TopBadge, pathAt, prog, typed, vis, lin, Pt} from "./kit";
import {CellSty, ExcelWindow, Grid, Sel, colLeft, rowsRange} from "./xl";
import {IDS, NAMES, bigRow, fmt, nameOf} from "./data";
import {Mono, ctr, keyv} from "./common";

const R1 = rowsRange(1);
const AMB = C.amber, BLU = C.blue, EME = C.green;

/* ───────────────────────── SCENE 4: scope comparison + gauge ───────────────────────── */
const LET = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));
const PW = 820, PH = 520, PY = 150;
const Panel: React.FC<{f: number; x: number; title: string; color: string; formula: string; lit: (i: number) => number; count: number; note: string}> = ({f, x, title, color, formula, lit, count, note}) => {
  const o = prog(f, 40, 70);
  const cw = (PW - 60) / 26;
  return (
    <div style={{position: "absolute", left: x, top: PY, width: PW, height: PH, opacity: o, transform: `translateY(${(1 - o) * 24}px)`, background: "rgba(15,23,42,.94)", border: `2px solid ${color}`, borderRadius: 18, boxShadow: `0 0 30px ${color}44`, fontFamily: MONO}}>
      <div style={{padding: "16px 28px 0", fontSize: 30, fontWeight: 700, color}}>{title}</div>
      <div style={{padding: "6px 28px 0", fontSize: 23, color: C.text}}>{formula}</div>
      <div style={{position: "absolute", left: 30, top: 118, width: PW - 60, height: 270, display: "flex", gap: 0}}>
        {LET.map((l, i) => {
          const a = lit(i);
          return <div key={l} style={{width: cw, height: 270, boxSizing: "border-box", border: "1px solid #334155", background: `rgba(${color === C.red ? "239,68,68" : "16,185,129"},${0.05 + 0.6 * a})`, boxShadow: a > 0.5 ? `0 0 14px ${color}` : "none", color: a > 0.5 ? "#fff" : C.mute, fontSize: 15, textAlign: "center", paddingTop: 4}}>{i === 0 || i === 4 || i === 25 ? l : ""}</div>;
        })}
      </div>
      <div style={{position: "absolute", left: 30, top: 408, fontSize: 28, fontWeight: 700, color: C.text}}>{count} column{count === 1 ? "" : "s"} in scope</div>
      <div style={{position: "absolute", left: 30, top: 456, fontSize: 19, color: C.mute}}>{note}</div>
    </div>
  );
};
const polar = (cx: number, cy: number, r: number, t: number) => {
  const d = Math.PI * (1 - t);
  return [cx + r * Math.cos(d), cy - r * Math.sin(d)];
};
const arc = (cx: number, cy: number, r: number, t0: number, t1: number) => {
  const [x0, y0] = polar(cx, cy, r, t0), [x1, y1] = polar(cx, cy, r, t1);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
};
export const Scene4: React.FC<{f: number}> = ({f}) => {
  const vl = f < 222 ? 0 : Math.min(26, Math.floor((f - 222) / 4) + 1);
  const imOn = f >= 377;
  const im = !imOn ? 0 : f >= 400 ? 2 : 1;
  const needle = keyv(f, [[588, 1], [610, 1], [720, 0.077]]);
  const [nx, ny] = polar(960, 910, 150, needle);
  const gx = 960, gy = 910, gr = 190;
  const gv = f >= 588;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <Panel f={f} x={80} title="VLOOKUP" color={C.red} formula="=VLOOKUP(H2, A:Z, 5, 0)" lit={(i) => (i < vl ? 1 : 0)} count={vl} note="table_array = A:Z → every column is a dependency" />
      <Panel f={f} x={1020} title="INDEX & MATCH" color={EME} formula="=INDEX(E:E, MATCH(H2, A:A, 0))" lit={(i) => (imOn && (i === 0 || (i === 4 && f >= 400)) ? 1 : 0)} count={im} note="only the lookup column + the result column" />
      {gv ? (
        <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: prog(f, 588, 612)}}>
          <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
            <path d={arc(gx, gy, gr, 0, 0.33)} stroke={EME} strokeWidth={26} fill="none" />
            <path d={arc(gx, gy, gr, 0.34, 0.66)} stroke={AMB} strokeWidth={26} fill="none" />
            <path d={arc(gx, gy, gr, 0.67, 1)} stroke={C.red} strokeWidth={26} fill="none" />
            <line x1={gx} y1={gy} x2={nx} y2={ny} stroke="#fff" strokeWidth={7} strokeLinecap="round" style={{filter: `drop-shadow(0 0 10px ${EME})`}} />
            <circle cx={gx} cy={gy} r={14} fill="#fff" />
          </svg>
          <div style={{position: "absolute", left: 960 - 260, top: 925, width: 520, textAlign: "center", fontFamily: MONO, color: C.text}}>
            <div style={{fontSize: 22, color: C.mute}}>Calculation scope (illustrative)</div>
            <div style={{fontSize: 34, fontWeight: 700, color: needle < 0.4 ? "#6EE7B7" : "#FCA5A5"}}>26 → 2 columns</div>
          </div>
        </div>
      ) : null}
      <TopBadge f={f} a={37} b={560} ar="الذاكرة الحسابية والأداء" en="Calculation Scope" />
      <Tag f={f} a={60} b={540} color={EME} text="Memory Optimization ──► Processes ONLY 2 Specific Columns Instead of Entire Data Tables" />
      <Tag f={f} a={660} b={1140} color={EME} text="Lighter Scope ──► Fewer Dependencies To Recalculate in Large Financial Models" />
    </div>
  );
};

/* ───────────────────────── SCENE 5: 50,000-row enterprise demo ───────────────────────── */
const FORM5 = "=INDEX(tbl_Customers[CustomerName],MATCH([@CustomerID],tbl_Customers[CustomerID],0))";
export const Scene5: React.FC<{f: number}> = ({f}) => {
  const hdrT = typed("Customer", f, 380, 0.4);
  const ft = typed(FORM5, f, 410, 0.6);
  const rowN = (r: number) => f >= 562 + (r - 2) * 1.2;
  const N = Math.floor(50000 * prog(f, 562, 640));
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) {
      if (c === 0) return {text: "Order ID", bold: true};
      if (c === 1) return {text: "CustomerID", bold: true};
      if (c === 2) return {text: "Amount", bold: true};
      if (c === 3) return f >= 402 ? {text: "Customer", bold: true} : f >= 380 ? {text: hdrT, edit: true} : undefined;
      return undefined;
    }
    if (r > 50001 || r < 2) return undefined;
    const d = bigRow(r - 2);
    if (c === 0) return {text: String(d.order), num: true};
    if (c === 1) return {text: String(d.cid), num: true};
    if (c === 2) return {text: fmt(d.amount), num: true};
    if (c === 3) {
      if (r === 2 && f >= 410 && f < 562) return {text: ft, edit: true};
      return f >= 562 && rowN(r) ? {text: nameOf(d.cid)} : undefined;
    }
    return undefined;
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  if (f >= 380) sel = {r1: 1, c1: 3, r2: 1, c2: 3};
  if (f >= 405) sel = {r1: 2, c1: 3, r2: 2, c2: 3};
  if (f >= 562) sel = {r1: 3, c1: 3, r2: 3, c2: 3};
  const editing = (f >= 380 && f < 402) || (f >= 410 && f < 562);
  const formula = f >= 380 && f < 402 ? hdrT : f >= 410 && f < 562 ? ft : f >= 562 ? FORM5 : "";
  const d2 = ctr(R1, 2, 3);
  const pts: Pt[] = [{f: 0, x: 1500, y: 600}, {f: 340, x: d2.x + 200, y: d2.y + 100}, {f: 400, x: d2.x, y: d2.y}, {f: 700, x: d2.x + 160, y: d2.y + 120}];
  const cur = pathAt(f, pts);
  const seal = prog(f, 700, 745);
  const loaded = lin(f, 60, 200);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={f < 380 ? "A1" : f < 405 ? "D1" : f < 562 ? "D2" : "D3"} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} table={{top: 1, bottom: 50001, left: 0, right: f >= 402 ? 3 : 2, p: 1, glow: vis(f, 402, 460, 12) * 0.8}} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            <div style={{position: "absolute", left: M.w - 16, top: GRID_Y, width: 14, height: M.rows * M.rowH, background: "#EDEDED"}}><div style={{width: 10, height: 9, margin: "3px 2px", background: "#9A9A9A", borderRadius: 3}} /></div>
            <Neon f={f} a={562} b={650} x={colLeft(3)} y={GRID_Y + M.rowH} w={150} h={23 * M.rowH} color={EME} r={3} />
          </div>
        }
      />
      <Card f={f} a={40} b={310} x={560} y={380} w={800} color={BLU} title="Opening manzooma_sales_2026.xlsx">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.text}}>50,001 rows × 3 columns (incl. header)</div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", marginTop: 14, overflow: "hidden"}}><div style={{width: `${loaded * 100}%`, height: "100%", background: `linear-gradient(90deg, ${BLU}, ${EME})`}} /></div>
        <div style={{fontFamily: MONO, fontSize: 20, color: loaded >= 1 ? "#6EE7B7" : C.mute, marginTop: 8}}>{loaded >= 1 ? "✓ Loaded" : `Loading… ${Math.round(loaded * 100)}%`}</div>
      </Card>
      <Card f={f} a={150} b={560} x={1120} y={200} w={660} color={BLU} title="tbl_Customers  ·  Customers sheet">
        {[0, 1, 2, 3, 4].map((i) => {
          const id = 1001 + i;
          return <div key={id} style={{display: "flex", justifyContent: "space-between", fontSize: 24, height: 34, borderBottom: "1px solid #334155"}}><span style={{fontFamily: MONO, color: "#BAE6FD"}}>{id}</span><span>{nameOf(id)}</span></div>;
        })}
      </Card>
      <Card f={f} a={562} b={770} x={1010} y={230} w={760} color={EME} title="Calculated Column">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.mute}}>Rows matched</div>
        <div style={{fontFamily: MONO, fontSize: 52, fontWeight: 700, color: "#6EE7B7"}}>{fmt(N)} / 50,000</div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", marginTop: 10, overflow: "hidden"}}><div style={{width: `${(N / 50000) * 100}%`, height: "100%", background: EME}} /></div>
      </Card>
      {seal > 0 ? (
        <div style={{position: "absolute", left: 1040, top: 170, width: 720, padding: "26px 0 30px", background: "rgba(15,23,42,.96)", border: `2px solid ${EME}`, borderRadius: 26, boxShadow: `0 0 40px ${EME}66, 0 24px 60px rgba(0,0,0,.5)`, opacity: vis(f, 700, 1171, 20), transform: `scale(${0.7 + 0.3 * seal})`, transformOrigin: "50% 40%", textAlign: "center"}}>
          <svg width={260} height={260} viewBox="0 0 300 300" style={{filter: `drop-shadow(0 0 26px ${EME})`}}>
            <circle cx={150} cy={150} r={138} fill="none" stroke={EME} strokeWidth={3} strokeDasharray="10 12" transform={`rotate(${f * 0.6} 150 150)`} />
            <circle cx={150} cy={150} r={112} fill="rgba(16,185,129,.14)" stroke={EME} strokeWidth={8} />
            <path d="M98 154 L136 192 L206 112" fill="none" stroke="#6EE7B7" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={170} strokeDashoffset={170 * (1 - prog(f, 720, 760))} />
          </svg>
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: "#6EE7B7", marginTop: 4}}>ENTERPRISE INDEX/MATCH SEAL</div>
          <div style={{fontFamily: MONO, fontSize: 23, color: C.text, marginTop: 8}}>tbl_Sales · 50,000 rows · 1 formula</div>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.mute, marginTop: 6}}>Zero-breakage architecture</div>
        </div>
      ) : null}
      <Card f={f} a={880} b={1171} x={1010} y={800} w={780} color={C.purple} title="Same pattern → 2D commission lookup">
        <Mono c="#E9D5FF" s={22}>INDEX(Rates, MATCH(Region), MATCH(Tier))</Mono>
      </Card>
      <Keys f={f} a={545} b={592} keys={["Enter"]} press={562} />
      <Click f={f} at={402} x={d2.x} y={d2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={61} b={541} color={BLU} text="Enterprise Matrix Lookup ──► Execute INDEX & MATCH Across 50,000 Sales Records" />
      <Tag f={f} a={661} b={1141} color={EME} text="Zero-Breakage Merging ──► Ranges Move With Your Columns, Not Against Them" />
    </div>
  );
};

/* ───────────────────────── SCENE 6 ───────────────────────── */
const SKILLS = ["MATCH finds the position · INDEX fetches the value", "Left-Lookup Freedom", "Column Insertion Immunity", "2D Two-Way Lookup", "Lighter calculation scope"];
export const Scene6: React.FC<{f: number}> = ({f}) => {
  const a = A[5];
  const fill = prog(f, 60, 170);
  const pct = Math.round(UNIT_PROGRESS * 100 * fill);
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
            <div><div style={{fontFamily: MONO, fontSize: 22, color: "#6EE7B7", fontWeight: 700}}>Lesson 12 Completed</div><div style={{fontFamily: MONO, fontSize: 19, color: C.text}}>INDEX & MATCH Engine Mastered</div></div>
          </div>
          <div style={{marginTop: 30, fontFamily: MONO, fontSize: 20, color: C.mute, display: "flex", justifyContent: "space-between"}}><span>Unit 3 · Lookup & Data Merging</span><span style={{color: C.text}}>Lesson 12</span></div>
          <div style={{height: 22, borderRadius: 12, background: "#0B1220", marginTop: 10, overflow: "hidden", border: `1px solid ${C.line}`}}><div style={{width: `${UNIT_PROGRESS * 100 * fill}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, boxShadow: `0 0 18px ${C.green}`}} /></div>
          <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: "#6EE7B7", marginTop: 8, textAlign: "right"}}>{pct}%</div>
          <div style={{marginTop: 18}}>
            {SKILLS.map((t, i) => (
              <div key={t} style={{display: "flex", gap: 14, alignItems: "center", height: 46, opacity: prog(f, 80 + i * 22, 100 + i * 22), transform: `translateX(${(1 - prog(f, 80 + i * 22, 100 + i * 22)) * -24}px)`}}>
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
          <div style={{fontFamily: FONT_AR, fontSize: 34, fontWeight: 700, color: C.text, direction: "rtl", marginTop: 6}}>الدرس 13: الدالة الحديثة الشاملة</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: "#BAE6FD", marginTop: 6}}>XLOOKUP Masterclass</div>
          <div style={{marginTop: 18, borderRadius: 10, overflow: "hidden", border: "1px solid #475569", width: 560}}>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} style={{display: "flex", height: 34, background: r === 0 ? "#4EA72E" : r % 2 ? "#DCEBD5" : "#fff"}}>
                {[0, 1, 2, 3].map((c) => <div key={c} style={{flex: 1, borderRight: "1px solid #BBB", fontFamily: MONO, fontSize: 17, lineHeight: "34px", padding: "0 10px", color: r === 0 ? "#fff" : "#222", display: "flex", justifyContent: "space-between"}}><span>{r === 0 ? ["Key", "Name", "City", "Sales"][c] : ""}</span>{r === 0 ? <span style={{fontSize: 11}}>▼</span> : null}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
