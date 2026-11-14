import React from "react";
import {C, M, MONO} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Neon, Tag, TopBadge, pathAt, prog, typed, vis, Pt} from "./kit";
import {PQWindow, CondDialog, CustDialog, BTN, st, pqTabStage, colX, colW, TBL_Y, HDR_H, ROW_H, DX, dpt, CD, CU} from "./pq";
import {Mono} from "./common";
import {MenuBox} from "./common";
import {mkCols, mkCell, pick, F_TYPE, F_COND, F_NET, F_LOC, CAT, NET, LOC, BASE} from "./pqscn";
import {money} from "./data";

const BLU = C.blue, EME = C.green, AMB = C.amber, RED = C.red;
const Q1 = [{name: "Sales", kind: "table" as const}];
const colNeon = (cols: ReturnType<typeof mkCols>, k: string, n: number, color: string, a: number, b: number, f: number) => (
  <Neon f={f} a={a} b={b} x={colX(cols, k)} y={TBL_Y} w={colW(cols, k)} h={HDR_H + n * ROW_H} color={color} r={3} />
);

/* ───────────────────────── SCENE 1 ───────────────────────── */
export const Scene1: React.FC<{f: number}> = ({f}) => {
  const rows = pick(14);
  const cols = mkCols(false, false, false);
  const ghost = [CAT, NET, LOC];
  const gx = (i: number) => colX(cols, "Amount") + colW(cols, "Amount") + ghost.slice(0, i).reduce((a, c) => a + c.w, 0);
  const pts: Pt[] = [{f: 0, x: 1500, y: 760}, {f: 500, x: 1300, y: 640}, {f: 800, x: 1180, y: 560}, {f: 1100, x: 1260, y: 700}];
  const cur = pathAt(f, pts);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <PQWindow f={f} tab="Home" queries={Q1} steps={["Source", "Changed Type"]} sel={1} formula={F_TYPE} cols={cols} nRows={14} cell={mkCell(rows, {}, f)}>
        <div style={{position: "absolute", inset: 0}}>
          {ghost.map((g, i) => {
            const t = prog(f, 760 + i * 50, 800 + i * 50);
            if (t <= 0) return null;
            return (
              <div key={g.k} style={{position: "absolute", left: gx(i), top: TBL_Y, width: g.w, height: HDR_H + 14 * ROW_H, border: `2.5px dashed ${BLU}`, background: "rgba(56,189,248,.08)", boxShadow: `0 0 18px ${BLU}88`, opacity: t * (1 - prog(f, 1180, 1250)), boxSizing: "border-box", zIndex: 6}}>
                <div style={{padding: "8px 10px", fontFamily: MONO, fontWeight: 700, fontSize: 15, color: "#075985"}}>{g.label}</div>
                <div style={{position: "absolute", left: 0, top: HDR_H, width: "100%", height: (HDR_H * 0 + 14 * ROW_H) * t, background: `repeating-linear-gradient(180deg, rgba(56,189,248,.28) 0 2px, transparent 2px 28px)`}} />
              </div>
            );
          })}
        </div>
      </PQWindow>
      <Card f={f} a={50} b={388} x={1090} y={250} w={720} color={BLU} title="الدرس 50 من 76  ──►  الوحدة 10 من 14">
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, color: C.mute}}><span>Course progress · lesson 50 of 76</span><span style={{color: BLU}}>{(50 / 76 * 100).toFixed(1)}%</span></div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", overflow: "hidden", marginTop: 6}}><div style={{width: `${(50 / 76) * 100 * prog(f, 80, 220)}%`, height: "100%", background: BLU}} /></div>
        <div style={{display: "flex", gap: 6, marginTop: 14}}>{Array.from({length: 14}, (_, i) => <div key={i} style={{flex: 1, height: 14, borderRadius: 4, background: i < 9 ? EME : i === 9 ? AMB : "#1E293B", boxShadow: i === 9 ? `0 0 12px ${AMB}` : "none"}} />)}</div>
        <div style={{fontFamily: MONO, fontSize: 19, color: C.mute, marginTop: 6}}>Unit 10 · Power Query & ETL</div>
      </Card>
      <Card f={f} a={400} b={697} x={1090} y={250} w={720} color={BLU} title="Native column logic">
        {["Conditional Column", "Custom Column (M)", "M Parameters", "Advanced Editor"].map((t, i) => <div key={t} style={{opacity: prog(f, 410 + i * 30, 430 + i * 30), fontFamily: MONO, fontSize: 25, color: "#BAE6FD", lineHeight: 1.55}}>▸ {t}</div>)}
      </Card>
      <Card f={f} a={700} b={1312} x={1090} y={200} w={720} color={RED} title="Worksheet IF formulas">
        <Mono c="#FCA5A5" s={20}>=IF(G2&gt;10000,"VIP",IF(G2&gt;5000,"Premium","Standard"))</Mono>
        <Mono c="#FCA5A5" s={20}>one formula in every row · lives in the sheet</Mono>
      </Card>
      <Card f={f} a={760} b={1312} x={1090} y={420} w={720} color={BLU} title="Power Query">
        <Mono c="#BAE6FD" s={22}>Add Column → Conditional / Custom</Mono>
        <Mono c="#BAE6FD" s={22}>one query step · applies to every row</Mono>
      </Card>
      <Cursor x={cur.x} y={cur.y} />
      <TopBadge f={f} a={60} b={540} ar="الدرس 50 من 76 | الوحدة 10 من 14" en="Conditional & Custom M Columns" />
      <Tag f={f} a={660} b={1140} color={BLU} text="Native Data Enrichment ──► Conditional Logic, Custom M Code & Dynamic Parameters" />
    </div>
  );
};

/* ───────────────────────── SCENE 2: Conditional Column ───────────────────────── */
export const Scene2: React.FC<{f: number}> = ({f}) => {
  const rows = pick(14);
  const added = f >= 590;
  const cols = mkCols(added, false, false);
  const tab = f >= 34 ? "Add Column" : "Home";
  const nameT = typed("CustomerCategory", f, 190, 0.3);
  const v1 = typed("10000", f, 305, 0.2), o1 = typed("VIP", f, 335, 0.2), v2 = typed("5000", f, 400, 0.2), o2 = typed("Premium", f, 425, 0.25), els = typed("Standard", f, 462, 0.2);
  const foc = f < 190 ? "" : f < 250 ? "name" : f < 305 ? "" : f < 330 ? "v1" : f < 335 ? "" : f < 355 ? "o1" : f < 400 ? "" : f < 422 ? "v2" : f < 425 ? "" : f < 455 ? "o2" : f < 462 ? "" : f < 495 ? "else" : "";
  const dlgOpen = f >= 158 && f < 585;
  const D = DX.cond, tabP = pqTabStage("Add Column"), condP = st(BTN.conditional);
  const nameP = dpt(D, CD.name.x + 100, CD.name.y + 15), c1P = dpt(D, CD.c1.x + 60, CD.c1.y + 15), op1P = dpt(D, CD.op1.x + 60, CD.op1.y + 15), v1P = dpt(D, CD.v1.x + 40, CD.v1.y + 15), o1P = dpt(D, CD.o1.x + 40, CD.o1.y + 15);
  const addP = dpt(D, 80, CD.add1y + 15), v2P = dpt(D, CD.v1.x + 40, CD.c2y + 15), o2P = dpt(D, CD.o1.x + 40, CD.c2y + 15), elP = dpt(D, CD.c1.x + 60, CD.els2y + 15), okP = dpt(D, CD.ok.x, CD.ok.y);
  const pts: Pt[] = [{f: 0, x: 1500, y: 760}, {f: 28, x: tabP.x, y: tabP.y}, {f: 130, x: condP.x, y: condP.y}, {f: 186, x: nameP.x, y: nameP.y}, {f: 258, x: c1P.x, y: c1P.y}, {f: 281, x: op1P.x, y: op1P.y}, {f: 302, x: v1P.x, y: v1P.y}, {f: 332, x: o1P.x, y: o1P.y}, {f: 375, x: addP.x, y: addP.y}, {f: 396, x: v2P.x, y: v2P.y}, {f: 421, x: o2P.x, y: o2P.y}, {f: 458, x: elP.x, y: elP.y}, {f: 575, x: okP.x, y: okP.y}, {f: 640, x: okP.x + 150, y: okP.y + 120}];
  const cur = pathAt(f, pts);
  const rule2 = f >= 380;
  const op1T = f >= 292 ? "is greater than" : f >= 281 ? "equals" : "equals", op2 = f >= 392 ? "is greater than" : "equals";
  const cnt = (c: string) => rows.filter((r) => r.cat === c).length;
  const steps = added ? ["Source", "Changed Type", "Added Conditional Column"] : ["Source", "Changed Type"];
  return (
    <div style={{position: "absolute", inset: 0}}>
      <PQWindow f={f} tab={tab} queries={Q1} steps={steps} sel={steps.length - 1} formula={added ? F_COND : F_TYPE} cols={cols} nRows={14} cell={mkCell(rows, {cat: 592}, f)} hdrSel={added ? "CustomerCategory" : undefined} hot={f >= 112 && f < 160 ? "conditional" : undefined}>
        {added ? colNeon(cols, "CustomerCategory", 14, EME, 590, 1037, f) : null}
      </PQWindow>
      <CondDialog f={f} a={158} b={585} foc={foc} name={f >= 190 ? nameT : "Custom"} c1={f >= 262 ? "Amount" : "OrderID"} op1={op1T} v1={v1} o1={o1} rule2={rule2} c2={f >= 385 ? "Amount" : "OrderID"} op2={op2} v2={v2} o2={o2} els={els} okHot={f >= 560} addHot={f >= 368 && f < 382} />
      {f >= 281 && f < 296 ? <MenuBox x={op1P.x - 60} y={op1P.y + 18} w={230} hot={f >= 288 ? 6 : -1} items={["equals", "does not equal", "begins with", "ends with", "contains", "does not contain", "is greater than"]} /> : null}
      <Card f={f} a={0} b={160} x={1090} y={250} w={720} color={EME} title="Conditional Column">
        <Mono c="#A7F3D0" s={24}>Add Column → General → Conditional Column</Mono>
      </Card>
      <Card f={f} a={600} b={1037} x={1090} y={230} w={720} color={EME} title="CustomerCategory">
        {[["VIP", "Amount > 10000", "#FCD34D"], ["Premium", "Amount > 5000", "#7DD3FC"], ["Standard", "everything else", "#CBD5E1"]].map(([t, d, col], i) => (
          <div key={t} style={{opacity: prog(f, 610 + i * 30, 630 + i * 30), display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24, color: col, lineHeight: 1.6}}><span>{t}</span><span style={{color: C.mute}}>{d}</span><span>{[cnt("VIP"), cnt("Premium"), cnt("Standard")][i]} rows</span></div>
        ))}
      </Card>
      <Click f={f} at={28} x={tabP.x} y={tabP.y} />
      <Click f={f} at={132} x={condP.x} y={condP.y} />
      <Click f={f} at={186} x={nameP.x} y={nameP.y} />
      <Click f={f} at={258} x={c1P.x} y={c1P.y} />
      <Click f={f} at={282} x={op1P.x} y={op1P.y} />
      <Click f={f} at={302} x={v1P.x} y={v1P.y} />
      <Click f={f} at={332} x={o1P.x} y={o1P.y} />
      <Click f={f} at={375} x={addP.x} y={addP.y} />
      <Click f={f} at={396} x={v2P.x} y={v2P.y} />
      <Click f={f} at={421} x={o2P.x} y={o2P.y} />
      <Click f={f} at={458} x={elP.x} y={elP.y} />
      <Click f={f} at={575} x={okP.x} y={okP.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={60} b={600} color={EME} text="Conditional Column Builder ──► Add Column ──► Conditional Column" />
      <Tag f={f} a={700} b={1000} color={EME} text={'Multi-Tier Logic ──► If Amount > 10000 Then "VIP" Else If Amount > 5000 Then "Premium" Else "Standard"'} />
      {dlgOpen ? null : null}
    </div>
  );
};

/* ───────────────────────── SCENE 3: Custom Column ───────────────────────── */
export const Scene3: React.FC<{f: number}> = ({f}) => {
  const rows = pick(14);
  const net = f >= 372, loc = f >= 665;
  const cols = mkCols(true, net, loc);
  const steps = ["Source", "Changed Type", "Added Conditional Column", ...(net ? ["Added Custom"] : []), ...(loc ? ["Added Custom1"] : [])];
  const nm1 = typed("NetValue", f, 150, 0.3), fm1 = typed("[UnitPrice] * [Quantity] * (1 - [DiscountRate])", f, 205, 0.4);
  const nm2 = typed("Location", f, 455, 0.3), fm2 = typed('Text.Combine({[Branch], [Region]}, " - ")', f, 500, 0.4);
  const d1 = f >= 128 && f < 366, d2 = f >= 440 && f < 658;
  const foc1 = f < 148 ? "" : f < 185 ? "name" : f < 195 ? "" : f < 335 ? "f" : "";
  const foc2 = f < 452 ? "" : f < 490 ? "name" : f < 497 ? "" : f < 610 ? "f" : "";
  const D = DX.cust, custP = st(BTN.custom);
  const nameP = dpt(D, CU.name.x + 100, CU.name.y + 15), fP = dpt(D, CU.formula.x + 200, CU.formula.y + 60), okP = dpt(D, CU.ok.x, CU.ok.y);
  const pts: Pt[] = [{f: 0, x: 1400, y: 700}, {f: 100, x: custP.x, y: custP.y}, {f: 146, x: nameP.x, y: nameP.y}, {f: 192, x: fP.x, y: fP.y}, {f: 356, x: okP.x, y: okP.y}, {f: 420, x: custP.x, y: custP.y}, {f: 450, x: nameP.x, y: nameP.y}, {f: 497, x: fP.x, y: fP.y}, {f: 648, x: okP.x, y: okP.y}, {f: 720, x: okP.x + 200, y: okP.y + 140}];
  const cur = pathAt(f, pts);
  const formula = loc ? F_LOC : net ? F_NET : '= Table.AddColumn(#"Changed Type", "CustomerCategory", …)';
  return (
    <div style={{position: "absolute", inset: 0}}>
      <PQWindow f={f} tab="Add Column" queries={Q1} steps={steps} sel={steps.length - 1} formula={formula} cols={cols} nRows={14} cell={mkCell(rows, {cat: -1000, net: 374, loc: 667}, f)} hdrSel={loc ? "Location" : net ? "NetValue" : undefined} hot={(f >= 85 && f < 130) || (f >= 405 && f < 442) ? "custom" : undefined}>
        {net ? colNeon(cols, "NetValue", 14, AMB, 372, 1164, f) : null}
        {loc ? colNeon(cols, "Location", 14, AMB, 665, 1164, f) : null}
      </PQWindow>
      <CustDialog f={f} a={128} b={366} foc={foc1} name={f >= 150 ? nm1 : "Custom"} formula={fm1} okHot={f >= 350} ok={f >= 335} />
      <CustDialog f={f} a={440} b={658} foc={foc2} name={f >= 455 ? nm2 : "Custom"} formula={fm2} okHot={f >= 640} ok={f >= 612} />
      <Card f={f} a={0} b={128} x={1090} y={250} w={720} color={AMB} title="Custom Column">
        <Mono c="#FDE68A" s={24}>Add Column → General → Custom Column</Mono>
      </Card>
      <Card f={f} a={737} b={1164} x={1090} y={230} w={720} color={AMB} title="M formulas · evaluated per row">
        <Mono c="#FDE68A" s={19}>[UnitPrice] * [Quantity] * (1 - [DiscountRate])</Mono>
        <Mono c="#FDE68A" s={19}>Text.Combine({"{"}[Branch], [Region]{"}"}, " - ")</Mono>
        <Mono c="#fff" s={22}>Row 1 → {money(rows[0].net)} · {rows[0].loc}</Mono>
      </Card>
      <Click f={f} at={100} x={custP.x} y={custP.y} />
      <Click f={f} at={146} x={nameP.x} y={nameP.y} />
      <Click f={f} at={192} x={fP.x} y={fP.y} />
      <Click f={f} at={358} x={okP.x} y={okP.y} />
      <Click f={f} at={420} x={custP.x} y={custP.y} />
      <Click f={f} at={450} x={nameP.x} y={nameP.y} />
      <Click f={f} at={497} x={fP.x} y={fP.y} />
      <Click f={f} at={648} x={okP.x} y={okP.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={90} b={630} color={AMB} text="Custom Column & M Code ──► Add Column ──► Custom Column" />
      <Tag f={f} a={700} b={1140} color={C.purple} text="Advanced M Formulas ──► [UnitPrice] * [Quantity] * (1 - [DiscountRate])" />
      {d1 || d2 ? null : null}
    </div>
  );
};
export {BASE as _B, vis as _v, M as _M, A as _A};
