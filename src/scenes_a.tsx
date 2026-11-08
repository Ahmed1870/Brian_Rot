import React from "react";
import {C, M, GRID_Y, MONO, FONT_AR} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Keys, Neon, Tag, TopBadge, pathAt, prog, typed, vis, Pt} from "./kit";
import {CellSty, ExcelWindow, Grid, Sel, TD, colLeft, colName, rowsRange} from "./xl";
import {ROWS, fmt, REGIONS, CAIRO} from "./data";
import {Ants, CHECK_BOX, Cam, CreateTableDialog, baseCell, ctr, lin, rawOf, toStage, tabCtr, Mono} from "./common";
import {COLS} from "./theme";

const R1 = rowsRange(1);

/* ───────────────────────── SCENE 1 ───────────────────────── */
export const Scene1: React.FC<{f: number}> = ({f}) => {
  const morph = prog(f, 775, 837);
  const growing = f >= 36 && f < 464;
  const t = prog(f, 40, 92);
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  let nameBox = "A1";
  if (growing && f >= 40) { sel = {r1: 1, c1: 0, r2: 20, c2: 4, t}; nameBox = t < 1 ? "20R x 5C" : "A1"; }
  if (f >= 464) { sel = {r1: 6, c1: 1, r2: 6, c2: 1}; nameBox = "B6"; }
  const glow = vis(f, 830, 1130, 24) * 0.9;
  const e20 = ctr(R1, 20, 4);
  const b6 = ctr(R1, 6, 1);
  const chk = toStage({x: CHECK_BOX.x + 10, y: CHECK_BOX.y + 12});
  const arrow = toStage({x: colLeft(1) + COLS[1] - 11, y: GRID_Y + 12});
  const td = tabCtr("Table Design");
  const pts: Pt[] = [
    {f: 0, x: 1500, y: 760}, {f: 30, x: ctr(R1, 1, 0).x, y: ctr(R1, 1, 0).y}, {f: 38, x: ctr(R1, 1, 0).x, y: ctr(R1, 1, 0).y},
    {f: 92, x: e20.x, y: e20.y}, {f: 420, x: e20.x + 40, y: e20.y + 30}, {f: 456, x: b6.x, y: b6.y}, {f: 640, x: b6.x + 90, y: b6.y - 10},
    {f: 715, x: chk.x, y: chk.y}, {f: 782, x: chk.x + 70, y: chk.y + 100}, {f: 880, x: arrow.x, y: arrow.y}, {f: 1000, x: arrow.x, y: arrow.y},
    {f: 1100, x: td.x - 120, y: td.y + 80}, {f: 1175, x: td.x, y: td.y},
  ];
  const cur = pathAt(f, pts);
  const cell = (r: number, c: number): CellSty | undefined => baseCell(r, c);
  const bandX = colLeft(0) + (colLeft(5) - colLeft(0)) * lin(f, 775, 835);
  const camS = 1 + 0.08 * prog(f, 1160, 1200);
  const sweep = f >= 775 && f < 845;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <Cam s={camS}>
        <ExcelWindow
          f={f} tab="Home" ctxTab={f >= 800} nameBox={nameBox}
          formula={f >= 464 ? rawOf(6, 1) : f >= 36 ? "Order ID" : ""}
          grid={<Grid rows={R1} cell={cell} sel={sel} table={{top: 1, bottom: 20, left: 0, right: 4, p: morph, glow}} f={f} />}
          overlays={
            <div style={{position: "absolute", inset: 0}}>
              {f >= 585 && f < 775 ? <Ants x={colLeft(0)} y={GRID_Y} w={colLeft(5) - colLeft(0)} h={20 * M.rowH} f={f} /> : null}
              {sweep ? <div style={{position: "absolute", left: bandX - 40, top: GRID_Y, width: 80, height: 20 * M.rowH, background: `linear-gradient(90deg, transparent, ${C.green}AA, transparent)`, zIndex: 7, opacity: 1 - lin(f, 820, 845)}} /> : null}
              <CreateTableDialog f={f} a={585} b={775} range="=$A$1:$E$20" checkAt={712} okHot={f >= 768} />
              <Neon f={f} a={700} b={775} x={CHECK_BOX.x} y={CHECK_BOX.y} w={CHECK_BOX.w} h={CHECK_BOX.h} color={C.green} r={4} />
              <Neon f={f} a={880} b={1010} x={colLeft(1) + COLS[1] - 20} y={GRID_Y + 2} w={20} h={20} color={C.green} r={3} />
            </div>
          }
        />
        <Card f={f} a={175} b={454} x={1010} y={330} w={680} color={C.red} title="Plain Range  A2:A5000">
          <div style={{fontSize: 24, fontFamily: MONO, color: "#FCA5A5"}}>✕ Rigid — does not grow with your data</div>
          <div style={{fontSize: 21, color: C.mute, marginTop: 6, fontFamily: MONO}}>New rows? Edit every formula by hand.</div>
        </Card>
        <Keys f={f} a={555} b={662} keys={["Ctrl", "T"]} press={580} />
        <Keys f={f} a={752} b={812} keys={["Enter"]} press={770} />
        <Click f={f} at={464} x={b6.x} y={b6.y} />
        <Click f={f} at={722} x={chk.x} y={chk.y} />
        <Cursor x={cur.x} y={cur.y} />
      </Cam>
      <TopBadge f={f} a={60} b={540} ar="الجداول الديناميكية والمراجع المهيكلة" en="Excel Tables & Structured References" />
      <Tag f={f} a={660} b={1140} color={C.green} text="Shortcut: Ctrl + T ──► Converts Plain Ranges to Dynamic Excel Tables" />
    </div>
  );
};

/* ───────────────────────── SCENE 2 ───────────────────────── */
const cairoRows = ROWS.map((d, i) => ({d, r: i + 2})).filter((x) => x.d.region === CAIRO).map((x) => x.r);
const MENU = ["None", "Average", "Count", "Count Numbers", "Max", "Min", "Sum", "StdDev", "Var", "More Functions…"];
const TOTAL_Y = GRID_Y + 20 * M.rowH;

const TotalMenu: React.FC<{c: number; hot: number}> = ({c, hot}) => {
  const top = TOTAL_Y - (MENU.length * 26 + 8);
  return (
    <div style={{position: "absolute", left: colLeft(c), top, width: 178, height: MENU.length * 26 + 8, background: "#fff", border: "1px solid #8A8A8A", boxShadow: "0 8px 22px rgba(0,0,0,.35)", zIndex: 12, padding: "4px 0", fontFamily: FONT_AR}}>
      {MENU.map((m, i) => <div key={m} style={{height: 26, padding: "0 14px", fontSize: 15, lineHeight: "26px", background: hot === i ? "#CDE8F7" : "transparent", color: "#1B1B1B", fontWeight: hot === i ? 700 : 400}}>{m}</div>)}
    </div>
  );
};
const menuPos = (c: number, i: number) => toStage({x: colLeft(c) + 90, y: TOTAL_Y - (MENU.length * 26 + 8) + 4 + i * 26 + 13});

export const Scene2: React.FC<{f: number}> = ({f}) => {
  const filtered = f >= 1122;
  const rows = filtered ? [1, ...cairoRows, 21, ...rowsRange(22, 24 - 6)].slice(0, 24) : R1;
  const totalOn = f >= 668;
  const dropP = prog(f, 668, 694);
  const visRows = filtered ? cairoRows : ROWS.map((_, i) => i + 2);
  const sumQty = visRows.reduce((s, r) => s + ROWS[r - 2].qty, 0);
  const avgPrice = visRows.reduce((s, r) => s + ROWS[r - 2].price, 0) / visRows.length;
  const qtyShown = f >= 812;
  const avgShown = f >= 952;
  // Table name box
  const typing = f >= 394 && f < 432;
  const nameFocus = f >= 262 && f < 432 ? 1 : 0;
  const tname = f < 394 ? "Table1" : f < 432 ? typed("tbl_Sales2026", f, 394, 0.4) : "tbl_Sales2026";
  // active cell
  let sel: Sel = {r1: 6, c1: 1, r2: 6, c2: 1};
  let formula = rawOf(6, 1);
  if (f >= 742 && f < 897) { sel = {r1: 21, c1: 2, r2: 21, c2: 2}; formula = qtyShown ? "=SUBTOTAL(109,[Quantity])" : ""; }
  if (f >= 897) { sel = {r1: 21, c1: 3, r2: 21, c2: 3}; formula = avgShown ? "=SUBTOTAL(101,[Unit Price])" : ""; }
  const nameBox = `${colName(sel.c1)}${sel.r1}`;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (totalOn && r === 21) {
      if (c === 0) return {text: "Total", bold: true};
      if (c === 2 && qtyShown) return {text: String(sumQty), num: true, bold: true};
      if (c === 3 && avgShown) return {text: fmt(avgPrice), num: true, bold: true};
      if (c === 4) return {text: String(visRows.length), num: true, bold: true};
      return undefined;
    }
    return baseCell(r, c);
  };
  const tabNow = f >= 54 ? "Table Design" : "Home";
  const td = tabCtr("Table Design");
  const nm = toStage({x: TD.nameBox.x + 75, y: TD.nameBox.y + 12});
  const c21 = ctr(rows, 21, 2);
  const arrC = toStage({x: colLeft(2) + COLS[2] - 12, y: TOTAL_Y + 12});
  const arrD = toStage({x: colLeft(3) + COLS[3] - 12, y: TOTAL_Y + 12});
  const sumP = menuPos(2, 6);
  const avgP = menuPos(3, 1);
  const e1 = toStage({x: colLeft(4) + COLS[4] - 11, y: GRID_Y + 12});
  const pts: Pt[] = [
    {f: 0, x: td.x, y: td.y}, {f: 46, x: td.x, y: td.y}, {f: 200, x: nm.x, y: nm.y}, {f: 258, x: nm.x, y: nm.y}, {f: 440, x: nm.x + 50, y: nm.y + 30},
    {f: 600, x: M.x + 1000, y: M.y + 430}, {f: 700, x: c21.x, y: c21.y}, {f: 742, x: arrC.x, y: arrC.y}, {f: 788, x: sumP.x, y: sumP.y}, {f: 812, x: sumP.x, y: sumP.y},
    {f: 880, x: arrD.x, y: arrD.y}, {f: 936, x: avgP.x, y: avgP.y}, {f: 954, x: avgP.x, y: avgP.y}, {f: 1070, x: e1.x, y: e1.y}, {f: 1130, x: e1.x + 30, y: e1.y + 120},
  ];
  const cur = pathAt(f, pts);
  const camS = 1.08 - 0.08 * prog(f, 0, 26);
  const totIdx = rows.indexOf(21);
  const totGeo = totalOn && totIdx >= 0 ? {x: colLeft(0), y: GRID_Y + totIdx * M.rowH, w: colLeft(5) - colLeft(0), h: M.rowH} : null;
  const menuC = f >= 745 && f < 814;
  const menuD = f >= 898 && f < 958;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <Cam s={camS}>
        <ExcelWindow
          f={f} tab={tabNow} ctxTab tableName={tname} nameFocus={nameFocus} nameTyping={typing} totalRow={totalOn}
          nameBox={nameBox} formula={formula}
          grid={<Grid rows={rows} cell={cell} sel={sel} table={{top: 1, bottom: totalOn ? 21 : 20, left: 0, right: 4, p: 1, total: totalOn ? 21 : undefined, rowsF: filtered ? undefined : 20 + dropP * (totalOn ? 1 : 0), filterCol: filtered ? 4 : undefined, glow: vis(f, 668, 760, 16) * 0.8}} f={f} />}
          overlays={
            <div style={{position: "absolute", inset: 0}}>
              {f >= 54 ? <Neon f={f} a={250} b={470} x={TD.nameBox.x} y={TD.nameBox.y} w={TD.nameBox.w} h={TD.nameBox.h} color={C.blue} r={4} /> : null}
              <Neon f={f} a={650} b={730} x={TD.totalChk.x - 3} y={TD.totalChk.y - 2} w={TD.totalChk.w} h={TD.totalChk.h + 2} color={C.green} r={4} />
              {totGeo ? <Neon f={f} a={700} b={1346} x={totGeo.x} y={totGeo.y} w={totGeo.w} h={totGeo.h} color={C.purple} r={3} /> : null}
              {menuC ? <TotalMenu c={2} hot={f >= 786 ? 6 : -1} /> : null}
              {menuD ? <TotalMenu c={3} hot={f >= 934 ? 1 : -1} /> : null}
              {f >= 1076 && f < 1124 ? (
                <div style={{position: "absolute", left: colLeft(4) - 60, top: GRID_Y + 26, width: 200, height: 196, background: "#fff", border: "1px solid #8A8A8A", boxShadow: "0 8px 22px rgba(0,0,0,.35)", zIndex: 12, padding: "8px 12px", fontSize: 14.5, fontFamily: FONT_AR, color: "#222"}}>
                  <div style={{color: "#666", marginBottom: 6}}>Filter by value</div>
                  {["(Select All)", ...REGIONS].map((g) => (
                    <div key={g} style={{display: "flex", gap: 8, height: 24, alignItems: "center"}}>
                      <div style={{width: 14, height: 14, border: "1.5px solid #555", background: g === CAIRO ? "#107C41" : "#fff", color: "#fff", fontSize: 11, lineHeight: "12px", textAlign: "center"}}>{g === CAIRO ? "✓" : ""}</div>{g}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          }
        />
        <Card f={f} a={434} b={592} x={980} y={300} w={760} color={C.blue} title="Why name it?">
          <Mono c="#BAE6FD" s={26}>=SUM(tbl_Sales2026[Quantity])</Mono>
          <Mono c="#BAE6FD" s={26}>=COUNTA(tbl_Sales2026[Order ID])</Mono>
          <div style={{fontSize: 22, color: C.mute, marginTop: 8, fontFamily: MONO}}>Readable · Reusable · Never breaks</div>
        </Card>
        <Card f={f} a={1050} b={1330} x={980} y={300} w={780} color={C.purple} title="SUBTOTAL ignores filtered-out rows">
          <Mono c="#E9D5FF" s={25}>109 = SUM    101 = AVERAGE    103 = COUNTA</Mono>
          <div style={{fontSize: 22, color: C.mute, marginTop: 8, fontFamily: MONO}}>Filter Region → totals follow the visible rows.</div>
        </Card>
        <Keys f={f} a={636} b={724} keys={["Ctrl", "Shift", "T"]} press={664} />
        <Click f={f} at={50} x={td.x} y={td.y} />
        <Click f={f} at={262} x={nm.x} y={nm.y} />
        <Click f={f} at={742} x={arrC.x} y={arrC.y} />
        <Click f={f} at={812} x={sumP.x} y={sumP.y} />
        <Click f={f} at={897} x={arrD.x} y={arrD.y} />
        <Click f={f} at={952} x={avgP.x} y={avgP.y} />
        <Click f={f} at={1075} x={e1.x} y={e1.y} />
        <Cursor x={cur.x} y={cur.y} />
      </Cam>
      <Tag f={f} a={60} b={600} color={C.blue} text="Architecture Rule ──► Rename Tables with Standards: tbl_Sales2026" />
      <Tag f={f} a={720} b={1260} color={C.green} text="Toggle Total Row (Ctrl + Shift + T) ──► Dynamic SUBTOTAL Functions" />
    </div>
  );
};

/* ───────────────────────── SCENE 3 ───────────────────────── */
export const FORM = "=[@Quantity]*[@[Unit Price]]";
export const Scene3: React.FC<{f: number}> = ({f}) => {
  const a = A[2];
  const expanded = f >= 150;
  const refsBlue = "#2F80D0";
  const refsRed = "#D9480F";
  // F1 typing
  const hdrTyped = f < 150 ? typed("Total Revenue", f, 100, 0.35) : "Total Revenue";
  // F2 content
  let f2 = "";
  let f2edit = false;
  const refs: {r: number; c: number; color: string}[] = [];
  if (f >= 290 && f < 382) {
    f2 = typed("=C2*D2", f, 290, 0.2);
    f2edit = true;
    if (f2.length >= 3) refs.push({r: 2, c: 2, color: refsBlue});
    if (f2.length >= 6) refs.push({r: 2, c: 3, color: refsRed});
  }
  if (f >= 400) {
    f2edit = true;
    f2 = "=";
    if (f >= 440) { f2 = "=[@Quantity]"; refs.push({r: 2, c: 2, color: refsBlue}); }
    if (f >= 500) f2 = "=[@Quantity]*";
    if (f >= 535) { f2 = FORM; refs.push({r: 3 - 1, c: 3, color: refsRed}); }
  }
  const sel: Sel = f < 92 ? {r1: 2, c1: 0, r2: 2, c2: 0} : f < 150 ? {r1: 1, c1: 5, r2: 1, c2: 5} : {r1: 2, c1: 5, r2: 2, c2: 5};
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1 && c === 5) return f < 150 ? (hdrTyped ? {text: hdrTyped, edit: f >= 96} : undefined) : {text: "Total Revenue", bold: true};
    if (r === 2 && c === 5 && f2edit) return {text: f2, edit: true};
    return baseCell(r, c);
  };
  const nameBox = `${colName(sel.c1)}${sel.r1}`;
  const formulaBar = f < 150 ? (f >= 96 ? hdrTyped : "") : f2;
  const editing = (f >= 96 && f < 150) || f2edit;
  const f1 = ctr(R1, 1, 5), f2c = ctr(R1, 2, 5), c2 = ctr(R1, 2, 2), d2 = ctr(R1, 2, 3);
  const pts: Pt[] = [
    {f: 0, x: 1300, y: 520}, {f: 62, x: f1.x, y: f1.y}, {f: 148, x: f1.x, y: f1.y}, {f: 240, x: f2c.x, y: f2c.y}, {f: 380, x: f2c.x + 10, y: f2c.y},
    {f: 436, x: c2.x, y: c2.y}, {f: 520, x: c2.x + 10, y: c2.y + 4}, {f: 534, x: d2.x, y: d2.y}, {f: 640, x: d2.x + 120, y: d2.y + 120},
  ];
  const cur = pathAt(f, pts);
  const chips: [string, string, string][] = [["[@Quantity]", "column of the current row", C.green], ["*", "multiply", C.mute], ["[@[Unit Price]]", "name with a space → double brackets", C.blue]];
  const anat = typed(FORM, f, 640, 0.22);
  const atGlow = f >= 821 ? 0.6 + 0.4 * Math.sin(f / 5) : 0;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Home" ctxTab={expanded} nameBox={nameBox} formula={formulaBar} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} refs={refs} table={{top: 1, bottom: 20, left: 0, right: expanded ? 5 : 4, p: 1, glow: vis(f, 150, 215, 14)}} f={f} />}
      />
      <Card f={f} a={a[0] + 200} b={a[1]} x={1010} y={150} w={780} color={C.amber} title="Structured References">
        <Mono c="#FDE68A" s={26}>tbl_Sales2026[Revenue]   ← whole column</Mono>
        <Mono c="#FDE68A" s={26}>[@Revenue]                ← this row</Mono>
      </Card>
      <Card f={f} a={286} b={412} x={1010} y={300} w={640} color={C.amber} title="Old Syntax">
        <Mono c="#FDE68A" s={40}>=C2*D2</Mono>
        <div style={{fontSize: 21, color: C.mute, marginTop: 4, fontFamily: MONO}}>Cell addresses — unreadable & fragile</div>
      </Card>
      <Card f={f} a={624} b={922} x={330} y={540} w={1260} color={C.amber} title="Structured Reference">
        <div style={{fontFamily: MONO, fontSize: 54, fontWeight: 700, color: "#FDE68A", height: 76, whiteSpace: "nowrap"}}>
          {anat.split("").map((ch, i) => <span key={i} style={ch === "@" ? {color: C.amber, textShadow: `0 0 ${24 * atGlow}px ${C.amber}`, background: atGlow > 0 ? `rgba(245,158,11,${0.25 * atGlow})` : "transparent"} : undefined}>{ch}</span>)}
        </div>
        <div style={{display: "flex", gap: 18, marginTop: 10}}>
          {chips.map(([t, d, col], i) => (
            <div key={t} style={{opacity: prog(f, 770 + i * 14, 790 + i * 14), border: `2px solid ${col}`, borderRadius: 12, padding: "8px 16px", boxShadow: `0 0 18px ${col}55`}}>
              <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: col}}>{t}</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.mute}}>{d}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card f={f} a={830} b={1000} x={1020} y={440} w={520} color={C.amber} title="[@] = Current Row">
        <div style={{fontSize: 22, fontFamily: MONO, color: "#FDE68A"}}>Same formula, every row</div>
      </Card>
      <Card f={f} a={922} b={1352} x={260} y={520} w={1400} color={C.green} title="Old  vs  Modern">
        <div style={{display: "flex", gap: 36}}>
          <div style={{flex: 1, border: `2px solid ${C.red}`, borderRadius: 14, padding: "12px 20px"}}>
            <div style={{fontFamily: MONO, fontSize: 20, color: "#FCA5A5"}}>Old</div>
            <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700}}>=C2*D2</div>
            <div style={{fontFamily: MONO, fontSize: 19, color: C.mute}}>What is C? What is D?</div>
          </div>
          <div style={{flex: 2, border: `2px solid ${C.green}`, borderRadius: 14, padding: "12px 20px", boxShadow: `0 0 22px ${C.green}55`}}>
            <div style={{fontFamily: MONO, fontSize: 20, color: "#6EE7B7"}}>Modern</div>
            <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700}}>{FORM}</div>
            <div style={{fontFamily: MONO, fontSize: 19, color: C.mute}}>Quantity × Unit Price — readable by any analyst</div>
          </div>
        </div>
        <div style={{display: "flex", gap: 34, marginTop: 14, fontFamily: MONO, fontSize: 21, color: "#A7F3D0"}}>
          {["✓ Self-documenting", "✓ No wrong-cell errors", "✓ Safe when rows move"].map((t, i) => <span key={t} style={{opacity: prog(f, 1010 + i * 24, 1030 + i * 24)}}>{t}</span>)}
        </div>
      </Card>
      <Click f={f} at={92} x={f1.x} y={f1.y} />
      <Click f={f} at={440} x={c2.x} y={c2.y} />
      <Click f={f} at={535} x={d2.x} y={d2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={300} b={800} color={C.amber} text="Old Syntax: =C2*D2 ──► Modern Syntax: =[@Quantity]*[@[Unit Price]]" />
      <Tag f={f} a={830} b={1290} color={C.amber} text="Symbol [@] ──► References the Value in the Current Row of the Table" />
    </div>
  );
};
