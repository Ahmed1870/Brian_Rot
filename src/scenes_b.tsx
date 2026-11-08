import React from "react";
import {C, M, GRID_Y, MONO, FONT_AR, COLS, UNIT_PROGRESS, UNIT_DONE, UNIT_TOTAL} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Keys, Neon, Tag, pathAt, prog, typed, vis, lin, Pt} from "./kit";
import {CellSty, ExcelWindow, Grid, Sel, TD, colLeft, colName, rowsRange} from "./xl";
import {ROWS, NEW_ROW, REGIONS, fmt, rev, rowAt, Row} from "./data";
import {Ants, CHECK_BOX, Cam, CreateTableDialog, baseCell, ctr, rawOf, toStage, tabCtr, Mono} from "./common";
import {FORM} from "./scenes_a";

const R1 = rowsRange(1);

/* ───────────────────────── SCENE 4 ───────────────────────── */
const FIELDS = [
  {c: 0, start: 490, cps: 0.3, text: String(NEW_ROW.id), commit: 520},
  {c: 1, start: 530, cps: 0.4, text: NEW_ROW.product, commit: 560},
  {c: 2, start: 568, cps: 0.3, text: String(NEW_ROW.qty), commit: 580},
  {c: 3, start: 586, cps: 0.3, text: String(NEW_ROW.price), commit: 610},
  {c: 4, start: 616, cps: 0.3, text: NEW_ROW.region, commit: 645},
];
const ALL: Row[] = [...ROWS, NEW_ROW];
const byRegion = (rows: Row[]) => REGIONS.map((g) => ({g, v: rows.filter((r) => r.region === g).reduce((s, r) => s + rev(r), 0)}));

export const Scene4: React.FC<{f: number}> = ({f}) => {
  const committed = f >= 245;
  let editF: typeof FIELDS[number] | undefined;
  for (const fl of FIELDS) if (f >= fl.start && f < fl.commit) editF = fl;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1 && c === 5) return {text: "Total Revenue", bold: true};
    if (c === 5 && r >= 2 && r <= 20) {
      if (r === 2 && !committed) return {text: FORM, edit: true};
      return f >= 250 + (r - 2) * 2 ? {text: fmt(rev(ROWS[r - 2])), num: true} : undefined;
    }
    if (r === 21 && f >= 520 && c <= 5) {
      if (c === 5) return {text: fmt((f >= 580 ? NEW_ROW.qty : 0) * (f >= 610 ? NEW_ROW.price : 0)), num: true};
      const fl = FIELDS[c];
      if (f >= fl.commit) return {text: c === 3 ? fmt(NEW_ROW.price) : fl.text, num: c === 0 || c === 2 || c === 3};
      if (f >= fl.start) return {text: typed(fl.text, f, fl.start, fl.cps), edit: true};
      return undefined;
    }
    if (r === 21 && c === 0 && f >= FIELDS[0].start) return {text: typed(FIELDS[0].text, f, FIELDS[0].start, FIELDS[0].cps), edit: true};
    return baseCell(r, c);
  };
  let sel: Sel = {r1: 2, c1: 5, r2: 2, c2: 5};
  if (f >= 245) sel = {r1: 3, c1: 5, r2: 3, c2: 5};
  if (f >= 472) { const c = f < 520 ? 0 : f < 560 ? 1 : f < 580 ? 2 : f < 610 ? 3 : f < 645 ? 4 : -1; sel = c >= 0 ? {r1: 21, c1: c, r2: 21, c2: c} : {r1: 22, c1: 0, r2: 22, c2: 0}; }
  const formula = f < 245 ? FORM : editF ? typed(editF.text, f, editF.start, editF.cps) : f < 472 ? FORM : "";
  const editing = f < 245 || !!editF;
  const refs = f < 245 ? [{r: 2, c: 2, color: "#2F80D0"}, {r: 2, c: 3, color: "#D9480F"}] : [];
  const a21 = ctr(R1, 21, 0);
  const d2 = ctr(R1, 2, 3);
  const dash = prog(f, 777, 834);
  const sc = 1 - 0.44 * dash;
  const refreshed = f >= 950;
  const pv = byRegion(refreshed ? ALL : ROWS);
  const pvTot = pv.reduce((s, x) => s + x.v, 0);
  const pts: Pt[] = [
    {f: 0, x: d2.x + 120, y: d2.y + 120}, {f: 440, x: d2.x + 120, y: d2.y + 120}, {f: 470, x: a21.x, y: a21.y}, {f: 640, x: a21.x + 200, y: a21.y - 120},
    {f: 780, x: 900, y: 520}, {f: 930, x: 800, y: 586}, {f: 1000, x: 820, y: 600}, {f: 1100, x: 1000, y: 700},
  ];
  const cur = pathAt(f, pts);
  const bottom = f >= 520 ? 21 : 20;
  const glow = Math.max(vis(f, 520, 600, 10), vis(f, 645, 700, 10)) * 0.9;
  const lk = vis(f, 840, 1260, 20);
  const flow = (y1: number) => `M 500 500 C 760 500, 860 ${y1}, 1096 ${y1}`;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: `translate(${16.4 * dash}px, ${178.5 * dash}px) scale(${sc})`, transformOrigin: "0 0"}}>
        <ExcelWindow
          f={f} tab="Home" ctxTab nameBox={`${colName(sel.c1)}${sel.r1}`} formula={formula} editing={editing}
          grid={<Grid rows={R1} cell={cell} sel={f >= 777 ? null : sel} refs={refs} table={{top: 1, bottom: bottom, left: 0, right: 5, p: 1, glow, rowsF: f >= 520 ? 20 + prog(f, 520, 534) : 20}} f={f} />}
          overlays={<Neon f={f} a={250} b={345} x={colLeft(5)} y={GRID_Y + M.rowH} w={COLS[5]} h={19 * M.rowH} color={C.green} r={3} />}
        />
      </div>
      <Card f={f} a={40} b={250} x={1010} y={230} w={780} color={C.green} title="Auto-Expansion">
        <Mono c="#A7F3D0" s={25}>↓ Calculated column — the formula fills itself</Mono>
        <Mono c="#A7F3D0" s={25}>↘ New rows join the table automatically</Mono>
      </Card>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, opacity: lk, pointerEvents: "none"}}>
        {[330, 710].map((y) => <path key={y} d={flow(y)} fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-f * 4} style={{filter: `drop-shadow(0 0 8px ${C.blue})`}} />)}
      </svg>
      <Card f={f} a={830} b={1260} x={1100} y={170} w={730} color={C.blue} title="PivotTable  ·  Source: tbl_Sales2026">
        {pv.map((x) => {
          const hot = refreshed && x.g === NEW_ROW.region && f < 1030;
          return (
            <div key={x.g} style={{display: "flex", justifyContent: "space-between", fontSize: 24, height: 36, alignItems: "center", borderBottom: "1px solid #334155", background: hot ? "rgba(16,185,129,.25)" : "transparent", padding: "0 8px"}}>
              <span>{x.g}</span><span style={{fontFamily: MONO, color: hot ? "#6EE7B7" : C.text}}>{fmt(x.v)}</span>
            </div>
          );
        })}
        <div style={{display: "flex", justifyContent: "space-between", fontSize: 24, height: 40, alignItems: "center", fontWeight: 700, padding: "0 8px", color: "#BAE6FD"}}><span>Grand Total</span><span style={{fontFamily: MONO}}>{fmt(pvTot)}</span></div>
      </Card>
      <Card f={f} a={850} b={1260} x={1100} y={600} w={730} color={C.blue} title="Power Query  ·  Source = table name">
        <Mono c="#BAE6FD" s={21}>Source = Excel.CurrentWorkbook(){"{"}</Mono>
        <Mono c="#BAE6FD" s={21}>{'  [Name="tbl_Sales2026"]}[Content]'}</Mono>
        <div style={{fontFamily: MONO, fontSize: 22, marginTop: 8, color: refreshed ? "#6EE7B7" : C.mute}}>{refreshed ? `✓ Loaded: ${ALL.length} rows` : `Loaded: ${ROWS.length} rows`}</div>
      </Card>
      {f >= 880 && f < 1260 ? (
        <div style={{position: "absolute", left: 650, top: 560, width: 300, opacity: vis(f, 880, 1260, 14)}}>
          <div style={{height: 46, borderRadius: 10, background: f >= 938 && f < 960 ? "#064E3B" : "#1E293B", border: `2px solid ${f >= 938 && f < 960 ? C.green : C.blue}`, boxShadow: `0 0 20px ${f >= 938 && f < 960 ? C.green : C.blue}88`, color: C.text, fontFamily: MONO, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"}}>↻  Refresh All</div>
          <div style={{marginTop: 8, fontFamily: MONO, fontSize: 18, color: C.blue, textAlign: "center"}}>no range to edit</div>
        </div>
      ) : null}
      <Keys f={f} a={225} b={292} keys={["Enter"]} press={245} />
      <Keys f={f} a={508} b={545} keys={["Tab"]} press={520} />
      <Keys f={f} a={633} b={672} keys={["Enter"]} press={645} />
      <Click f={f} at={472} x={a21.x} y={a21.y} />
      <Click f={f} at={940} x={800} y={590} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={60} b={540} color={C.green} text="Auto-Calculated Columns ──► Formulas Copy Down Automatically Upon Entry" />
      <Tag f={f} a={660} b={1140} color={C.blue} text="Dynamic Feeding ──► Automatically Feeds PivotTables & Power Query Without Re-selection" />
    </div>
  );
};

/* ───────────────────────── SCENE 5 ───────────────────────── */
export const Scene5: React.FC<{f: number}> = ({f}) => {
  const morph = prog(f, 470, 500);
  const expanded = f >= 560;
  const tab = f >= 484 && f < 522 ? "Table Design" : "Home";
  const ctx = f >= 470 && !(f >= 522 && f < 560);
  const typing = f >= 486 && f < 513;
  const tname = f < 486 ? "Table1" : f < 515 ? typed("tbl_Sales2026", f, 486, 0.5) : "tbl_Sales2026";
  const hdrT = f < 560 ? typed("Total Revenue", f, 526, 0.45) : "Total Revenue";
  const formT = f < 620 ? typed(FORM, f, 572, 0.75) : FORM;
  const rowN = (r: number) => f >= 622 + (r - 2) * 1.2;
  const N = Math.floor(50000 * prog(f, 622, 690));
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  if (f >= 370) sel = {r1: 6, c1: 1, r2: 6, c2: 1};
  if (f >= 524) sel = {r1: 1, c1: 5, r2: 1, c2: 5};
  if (f >= 560) sel = {r1: 2, c1: 5, r2: 2, c2: 5};
  if (f >= 620) sel = {r1: 3, c1: 5, r2: 3, c2: 5};
  const cell = (r: number, c: number): CellSty | undefined => {
    if (c === 5) {
      if (r === 1) return f >= 560 ? {text: "Total Revenue", bold: true} : f >= 526 ? {text: hdrT, edit: true} : undefined;
      if (r === 2 && f >= 572) return f < 620 ? {text: formT, edit: true} : rowN(2) ? {text: fmt(rev(rowAt(0))), num: true} : undefined;
      if (r >= 3 && r <= 24 && f >= 620) return rowN(r) ? {text: fmt(rev(rowAt(r - 2))), num: true} : undefined;
      return undefined;
    }
    return baseCell(r, c, true);
  };
  const editing = (f >= 526 && f < 560) || (f >= 572 && f < 620);
  const formula = f >= 526 && f < 560 ? hdrT : f >= 572 && f < 620 ? formT : f >= 620 ? FORM : f >= 370 ? rawOf(6, 1) : "";
  const b6 = ctr(R1, 6, 1), f1 = ctr(R1, 1, 5), f2 = ctr(R1, 2, 5);
  const td = tabCtr("Table Design");
  const nm = toStage({x: TD.nameBox.x + 75, y: TD.nameBox.y + 12});
  const pts: Pt[] = [
    {f: 0, x: 1500, y: 600}, {f: 340, x: b6.x, y: b6.y}, {f: 366, x: b6.x, y: b6.y}, {f: 440, x: b6.x + 90, y: b6.y + 10}, {f: 470, x: b6.x + 90, y: b6.y + 10},
    {f: 478, x: td.x, y: td.y}, {f: 486, x: td.x, y: td.y}, {f: 498, x: nm.x, y: nm.y}, {f: 518, x: nm.x, y: nm.y}, {f: 524, x: f1.x, y: f1.y}, {f: 566, x: f2.x, y: f2.y}, {f: 700, x: f2.x + 150, y: f2.y + 100},
  ];
  const cur = pathAt(f, pts);
  const chk = toStage({x: CHECK_BOX.x + 10, y: CHECK_BOX.y + 12});
  const seal = prog(f, 740, 785);
  const loaded = lin(f, 60, 200);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab={tab} ctxTab={ctx} tableName={tname} nameFocus={f >= 484 && f < 515 ? 1 : 0} nameTyping={typing}
        nameBox={`${colName(sel.c1)}${sel.r1}`} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} table={{top: 1, bottom: 50001, left: 0, right: expanded ? 5 : 4, p: morph, glow: Math.max(vis(f, 500, 560, 12), vis(f, 560, 600, 12)) * 0.8}} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            <div style={{position: "absolute", left: M.w - 16, top: GRID_Y, width: 14, height: M.rows * M.rowH, background: "#EDEDED"}}><div style={{width: 10, height: 9, margin: "3px 2px", background: "#9A9A9A", borderRadius: 3}} /></div>
            {f >= 436 && f < 470 ? <Ants x={colLeft(0)} y={GRID_Y} w={colLeft(5) - colLeft(0)} h={M.rows * M.rowH} f={f} /> : null}
            <CreateTableDialog f={f} a={436} b={471} range="=$A$1:$E$50001" checkAt={446} okHot={f >= 464} />
            <Neon f={f} a={622} b={705} x={colLeft(5)} y={GRID_Y + M.rowH} w={COLS[5]} h={23 * M.rowH} color={C.green} r={3} />
          </div>
        }
      />
      <Card f={f} a={40} b={310} x={560} y={380} w={800} color={C.blue} title="Opening manzooma_sales_2026.xlsx">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.text}}>50,001 rows × 5 columns (incl. header)</div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", marginTop: 14, overflow: "hidden"}}><div style={{width: `${loaded * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.green})`}} /></div>
        <div style={{fontFamily: MONO, fontSize: 20, color: loaded >= 1 ? "#6EE7B7" : C.mute, marginTop: 8}}>{loaded >= 1 ? "✓ Loaded" : `Loading… ${Math.round(loaded * 100)}%`}</div>
      </Card>
      <Card f={f} a={622} b={770} x={1010} y={230} w={760} color={C.green} title="Calculated Column">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.mute}}>Rows calculated</div>
        <div style={{fontFamily: MONO, fontSize: 52, fontWeight: 700, color: "#6EE7B7"}}>{fmt(N)} / 50,000</div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", marginTop: 10, overflow: "hidden"}}><div style={{width: `${(N / 50000) * 100}%`, height: "100%", background: C.green}} /></div>
        <div style={{fontFamily: MONO, fontSize: 21, color: "#A7F3D0", marginTop: 10, opacity: N >= 50000 ? 1 : 0}}>✓ One formula · zero copying</div>
      </Card>
      {seal > 0 ? (
        <div style={{position: "absolute", left: 1040, top: 190, width: 720, padding: "26px 0 30px", background: "rgba(15,23,42,.96)", border: `2px solid ${C.green}`, borderRadius: 26, boxShadow: `0 0 40px ${C.green}66, 0 24px 60px rgba(0,0,0,.5)`, opacity: vis(f, 740, 1171, 20), transform: `scale(${0.7 + 0.3 * seal})`, transformOrigin: "50% 40%", textAlign: "center"}}>
          <svg width={300} height={300} viewBox="0 0 300 300" style={{filter: `drop-shadow(0 0 26px ${C.green})`}}>
            <circle cx={150} cy={150} r={138} fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="10 12" transform={`rotate(${f * 0.6} 150 150)`} />
            <circle cx={150} cy={150} r={112} fill="rgba(16,185,129,.14)" stroke={C.green} strokeWidth={8} />
            <path d="M98 154 L136 192 L206 112" fill="none" stroke="#6EE7B7" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={170} strokeDashoffset={170 * (1 - prog(f, 760, 800))} />
          </svg>
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: "#6EE7B7", marginTop: 6}}>ENTERPRISE STRUCTURING SEAL</div>
          <div style={{fontFamily: MONO, fontSize: 23, color: C.text, marginTop: 8}}>tbl_Sales2026 · 50,000 rows · 6 columns</div>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.mute, marginTop: 6}}>Zero-maintenance model</div>
        </div>
      ) : null}
      <Keys f={f} a={408} b={456} keys={["Ctrl", "T"]} press={431} />
      <Keys f={f} a={452} b={494} keys={["Enter"]} press={466} />
      <Keys f={f} a={605} b={652} keys={["Enter"]} press={620} />
      <Click f={f} at={370} x={b6.x} y={b6.y} />
      <Click f={f} at={484} x={td.x} y={td.y} />
      <Click f={f} at={524} x={f1.x} y={f1.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={61} b={541} color={C.blue} text="Enterprise Data Structuring ──► Convert 50,000 Rows to tbl_Sales2026 in One Step" />
      <Tag f={f} a={661} b={1141} color={C.green} text="Zero Maintenance Models ──► Instant Calculated Column Expansion" />
    </div>
  );
};

/* ───────────────────────── SCENE 6 ───────────────────────── */
const SKILLS = ["Ctrl + T → Excel Table", "Naming: tbl_Sales2026", "Total Row · SUBTOTAL", "Structured References [@Column]", "Auto-Expansion → PivotTable & Power Query"];
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
            <div><div style={{fontFamily: MONO, fontSize: 22, color: "#6EE7B7", fontWeight: 700}}>Lesson 04 Completed</div><div style={{fontFamily: MONO, fontSize: 19, color: C.text}}>Excel Tables & Structured References Mastered</div></div>
          </div>
          <div style={{marginTop: 30, fontFamily: MONO, fontSize: 20, color: C.mute, display: "flex", justifyContent: "space-between"}}><span>Unit 1 · Architecture & Smart Interface</span><span style={{color: C.text}}>Lesson {UNIT_DONE} of {UNIT_TOTAL}</span></div>
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
          <div style={{fontFamily: FONT_AR, fontSize: 34, fontWeight: 700, color: C.text, direction: "rtl", marginTop: 6}}>الدرس 5: الفرز والتصفية المتقدمة</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: "#BAE6FD", marginTop: 6}}>AutoFilter & Advanced Sort</div>
          <div style={{marginTop: 18, borderRadius: 10, overflow: "hidden", border: "1px solid #475569", width: 560}}>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} style={{display: "flex", height: 34, background: r === 0 ? "#4EA72E" : r % 2 ? "#DCEBD5" : "#fff"}}>
                {[0, 1, 2, 3].map((c) => <div key={c} style={{flex: 1, borderRight: "1px solid #BBB", fontFamily: MONO, fontSize: 17, lineHeight: "34px", padding: "0 10px", color: r === 0 ? "#fff" : "#222", display: "flex", justifyContent: "space-between"}}><span>{r === 0 ? ["ID", "Item", "Qty", "Region"][c] : ""}</span>{r === 0 ? <span style={{fontSize: 11}}>▼</span> : null}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
