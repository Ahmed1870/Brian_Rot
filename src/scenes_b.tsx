import React from "react";
import {C, M, MONO, FONT_AR, UNIT_PROGRESS} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Neon, Tag, pathAt, prog, typed, vis, lin, Pt} from "./kit";
import {PQWindow, ParamDialog, FiltDialog, AdvEditor, BTN, st, pqTabStage, colX, colW, TBL_Y, HDR_H, ROW_H, DX, dpt, PA, FI, AD} from "./pq";
import {Mono, MenuBox} from "./common";
import {mkCols, mkCell, pick, F_COND, F_FILT, F_LOC} from "./pqscn";
import {M_CODE, COUNT_BY, fmt} from "./data";

const BLU = C.blue, EME = C.green, AMB = C.amber, PUR = C.purple;
const QS = [{name: "Sales", kind: "table" as const}];
const QP = [{name: "Sales", kind: "table" as const}, {name: "TargetBranch", kind: "param" as const}];
const ALL5 = ["Source", "Changed Type", "Added Conditional Column", "Added Custom", "Added Custom1"];
const colNeon = (cols: ReturnType<typeof mkCols>, k: string, n: number, color: string, a: number, b: number, f: number) => (
  <Neon f={f} a={a} b={b} x={colX(cols, k)} y={TBL_Y} w={colW(cols, k)} h={HDR_H + n * ROW_H} color={color} r={3} />
);

/* ───────────────────────── SCENE 4: parameters + Advanced Editor ───────────────────────── */
export const Scene4: React.FC<{f: number}> = ({f}) => {
  const cols = mkCols(true, true, true);
  const filt = f >= 515, branch = f >= 612 ? "Alex" : "Cairo";
  const rows = pick(14, filt ? branch : undefined);
  const steps = filt ? [...ALL5, "Filtered Rows"] : ALL5;
  const hasParam = f >= 392;
  const dl1 = f >= 106 && f < 392, dl2 = f >= 562 && f < 612;
  const typedName = typed("TargetBranch", f, 155, 0.25);
  const nameNow = f < 125 ? "" : f < 155 ? "Parameter1" : typedName;
  const items1 = ["Cairo", "Alex", "Giza", "Aswan"].filter((_, i) => f >= 265 + i * 13);
  const foc1 = f >= 150 && f < 205 ? "name" : f >= 215 && f < 228 ? "type" : f >= 245 && f < 258 ? "sug" : f >= 320 && f < 332 ? "def" : f >= 345 && f < 357 ? "cur" : "";
  const D1 = DX.param, newP = dpt(D1, PA.newBtn.x, PA.newBtn.y), pNameP = dpt(D1, PA.name.x + 200, PA.name.y + 15), pTypeP = dpt(D1, PA.type.x + 100, PA.type.y + 15), pSugP = dpt(D1, PA.sug.x + 100, PA.sug.y + 15), pDefP = dpt(D1, PA.def.x + 100, PA.def.y + 15), pCurP = dpt(D1, PA.cur.x + 100, PA.cur.y + 15), pOkP = dpt(D1, PA.ok.x, PA.ok.y);
  const mp = st(BTN.manageParams), adv = st(BTN.advanced), homeT = pqTabStage("Home");
  const brHdr = {x: M.x + colX(cols, "Branch") + colW(cols, "Branch") - 14, y: M.y + TBL_Y + 18};
  const fD = DX.filt, fVt = dpt(fD, FI.vt.x + 90, FI.vt.y + 15), fPv = dpt(fD, FI.pv.x + 90, FI.pv.y + 15), fOk = dpt(fD, FI.ok.x, FI.ok.y);
  const eD = DX.adv, eDone = dpt(eD, AD.done.x, AD.done.y);
  const menu1 = {x: mp.x - 50, y: mp.y + 52};
  const pts: Pt[] = [
    {f: 0, x: 1400, y: 700}, {f: 14, x: homeT.x, y: homeT.y}, {f: 48, x: mp.x, y: mp.y}, {f: 98, x: menu1.x + 60, y: menu1.y + 18}, {f: 122, x: newP.x, y: newP.y}, {f: 148, x: pNameP.x, y: pNameP.y},
    {f: 216, x: pTypeP.x, y: pTypeP.y}, {f: 246, x: pSugP.x, y: pSugP.y}, {f: 320, x: pDefP.x, y: pDefP.y}, {f: 345, x: pCurP.x, y: pCurP.y}, {f: 380, x: pOkP.x, y: pOkP.y},
    {f: 404, x: brHdr.x, y: brHdr.y}, {f: 436, x: brHdr.x + 130, y: brHdr.y + 150}, {f: 455, x: fVt.x, y: fVt.y}, {f: 470, x: fPv.x, y: fPv.y}, {f: 505, x: fOk.x, y: fOk.y},
    {f: 528, x: mp.x, y: mp.y}, {f: 556, x: menu1.x + 60, y: menu1.y + 18}, {f: 578, x: pCurP.x, y: pCurP.y}, {f: 603, x: pOkP.x, y: pOkP.y},
    {f: 644, x: adv.x, y: adv.y}, {f: 700, x: adv.x + 200, y: adv.y + 250}, {f: 1095, x: eDone.x, y: eDone.y}, {f: 1150, x: eDone.x + 100, y: eDone.y - 100},
  ];
  const cur = pathAt(f, pts);
  const shown = f < 656 ? 0 : Math.min(M_CODE.length, Math.floor((f - 656) / 7) + 1);
  const groups = [[1], [2, 3, 4], [5, 6], [7, 8], [9, 10], [11]];
  const gi = f < 800 ? -1 : Math.min(5, Math.floor((f - 800) / 45));
  const hl = gi >= 0 && f < 1060 ? groups[gi] : f >= 1060 && f < 1100 ? [11] : [];
  const hlColor = f >= 1060 ? PUR : gi % 2 === 0 ? BLU : AMB;
  const pulse = 0.6 + 0.4 * Math.sin(f / 5);
  const editor = f >= 656 && f < 1112;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <PQWindow f={f} tab="Home" queries={hasParam ? QP : QS} steps={steps} sel={steps.length - 1} formula={filt ? F_FILT : F_LOC} cols={cols} nRows={14} cell={mkCell(rows, {cat: -1000, net: -1000, loc: -1000}, f)} hdrSel={filt ? "Branch" : undefined} hot={f >= 36 && f < 106 ? "manageParams" : f >= 525 && f < 562 ? "manageParams" : f >= 625 && f < 656 ? "advanced" : undefined}
        status={filt ? `10 COLUMNS, ${rows.length} ROWS    Filtered by TargetBranch = "${branch}"` : undefined}>
        {filt ? colNeon(cols, "Branch", 14, PUR, 515, 700, f) : null}
        {hasParam ? <Neon f={f} a={392} b={470} x={0} y={242} w={196} h={30} color={PUR} r={3} /> : null}
      </PQWindow>
      <ParamDialog f={f} a={106} b={392} foc={foc1} list={f >= 125 ? [nameNow] : []} sel={0} name={nameNow} type={f >= 225 ? "Text" : "Any"} sug={f >= 255 ? "List of values" : "Any value"} items={items1} def={f >= 330 ? "Cairo" : ""} cur={f >= 355 ? "Cairo" : ""} okHot={f >= 372} newHot={f >= 118 && f < 132} />
      <ParamDialog f={f} a={562} b={612} foc={f >= 575 && f < 590 ? "cur" : ""} list={["TargetBranch"]} sel={0} name="TargetBranch" type="Text" sug="List of values" items={["Cairo", "Alex", "Giza", "Aswan"]} def="Cairo" cur={f >= 585 ? "Alex" : "Cairo"} okHot={f >= 598} newHot={false} />
      <FiltDialog f={f} a={440} b={520} param={f >= 462} pname={f >= 480 ? "TargetBranch" : ""} okHot={f >= 498} />
      {(f >= 60 && f < 106) || (f >= 535 && f < 562) ? <MenuBox x={menu1.x} y={menu1.y} w={170} hot={f >= 86 || f >= 553 ? 0 : -1} items={["Manage Parameters", "Edit Parameters"]} /> : null}
      {f >= 408 && f < 450 ? <MenuBox x={brHdr.x - 60} y={brHdr.y + 14} w={200} hot={f >= 418 ? 5 : -1} items={["Sort Ascending", "Sort Descending", "Clear Sort", "Clear Filter", "Remove Empty", "Text Filters  ▸", "Search"]} /> : null}
      {f >= 424 && f < 450 ? <MenuBox x={brHdr.x + 140} y={brHdr.y + 14 + 26 * 5 + 4} w={200} hot={f >= 430 ? 0 : -1} items={["Equals…", "Does Not Equal…", "Begins With…", "Contains…"]} /> : null}
      <AdvEditor f={f} a={656} b={1112} lines={M_CODE} shown={shown} hl={hl} hlColor={hlColor} letIn={f >= 770} doneHot={f >= 1088} />
      <Card f={f} a={185} b={523} x={1090} y={160} w={720} color={PUR} title="M Parameter · TargetBranch">
        <Mono c="#E9D5FF" s={26}>TargetBranch = "{branch}"</Mono>
        <Mono c="#E9D5FF" s={20}>Table.SelectRows(…, each [Branch] = TargetBranch)</Mono>
      </Card>
      <Card f={f} a={612} b={760} x={1090} y={160} w={720} color={PUR} title="Parameter changed">
        <Mono c="#E9D5FF" s={26}>"Cairo" → "Alex"</Mono>
        <Mono c={C.mute} s={20}>the query refreshed itself · {pick(14, "Alex").length} preview rows</Mono>
      </Card>
      <Click f={f} at={14} x={homeT.x} y={homeT.y} />
      <Click f={f} at={50} x={mp.x} y={mp.y} />
      <Click f={f} at={100} x={menu1.x + 60} y={menu1.y + 18} />
      <Click f={f} at={125} x={newP.x} y={newP.y} />
      <Click f={f} at={150} x={pNameP.x} y={pNameP.y} />
      <Click f={f} at={218} x={pTypeP.x} y={pTypeP.y} />
      <Click f={f} at={248} x={pSugP.x} y={pSugP.y} />
      <Click f={f} at={322} x={pDefP.x} y={pDefP.y} />
      <Click f={f} at={347} x={pCurP.x} y={pCurP.y} />
      <Click f={f} at={380} x={pOkP.x} y={pOkP.y} />
      <Click f={f} at={406} x={brHdr.x} y={brHdr.y} />
      <Click f={f} at={455} x={fVt.x} y={fVt.y} />
      <Click f={f} at={470} x={fPv.x} y={fPv.y} />
      <Click f={f} at={505} x={fOk.x} y={fOk.y} />
      <Click f={f} at={530} x={mp.x} y={mp.y} />
      <Click f={f} at={558} x={menu1.x + 60} y={menu1.y + 18} />
      <Click f={f} at={578} x={pCurP.x} y={pCurP.y} />
      <Click f={f} at={603} x={pOkP.x} y={pOkP.y} />
      <Click f={f} at={648} x={adv.x} y={adv.y} />
      <Click f={f} at={1095} x={eDone.x} y={eDone.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={60} b={540} color={PUR} text="Dynamic M Parameters ──► Manage Parameters Drives Dynamic Data Filtering" />
      <Tag f={f} a={760} b={1140} color={EME} text="Advanced M Editor ──► let ... in Block Architecture for Complete Code Audit" />
      {editor && pulse > 2 ? null : null}
    </div>
  );
};

/* ───────────────────────── SCENE 5: 50,000-row demo ───────────────────────── */
export const Scene5: React.FC<{f: number}> = ({f}) => {
  const cols = mkCols(true, true, true);
  const branch = f >= 585 ? "Alex" : "Cairo";
  const rows = pick(14, branch);
  const dimmed = (f >= 306 && f < 440) ? 0.3 : (f >= 620 && f < 780) ? 0.3 : 1;
  const op = f < 306 ? 1 : f < 330 ? 1 - 0.7 * prog(f, 306, 330) : f < 440 ? 0.3 : f < 460 ? 0.3 + 0.7 * prog(f, 440, 460) : f < 620 ? 1 : f < 640 ? 1 - 0.7 * prog(f, 620, 640) : 0.3;
  void dimmed;
  const loaded = prog(f, 60, 200);
  const mp = st(BTN.manageParams), cl = st(BTN.closeLoad);
  const menu1 = {x: mp.x - 50, y: mp.y + 52};
  const D1 = DX.param, pCurP = dpt(D1, PA.cur.x + 100, PA.cur.y + 15), pOkP = dpt(D1, PA.ok.x, PA.ok.y);
  const dl = f >= 490 && f < 585;
  const load1 = prog(f, 332, 400), load2 = prog(f, 632, 690);
  const rowsLoaded = f < 600 ? COUNT_BY.Cairo : COUNT_BY.Alex;
  const paneProg = f < 600 ? load1 : load2;
  const paneOn = (f >= 312 && f < 440) || (f >= 612 && f < 790);
  const pts: Pt[] = [{f: 0, x: 1400, y: 700}, {f: 270, x: cl.x, y: cl.y}, {f: 302, x: cl.x, y: cl.y}, {f: 340, x: cl.x + 100, y: cl.y + 200}, {f: 446, x: mp.x, y: mp.y}, {f: 482, x: menu1.x + 60, y: menu1.y + 18}, {f: 512, x: pCurP.x, y: pCurP.y}, {f: 570, x: pOkP.x, y: pOkP.y}, {f: 600, x: cl.x, y: cl.y}, {f: 616, x: cl.x, y: cl.y}, {f: 680, x: cl.x + 200, y: cl.y + 240}];
  const cur = pathAt(f, pts);
  const seal = prog(f, 800, 845);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <PQWindow f={f} tab="Home" queries={QP} steps={[...ALL5, "Filtered Rows"]} sel={5} formula={F_FILT} cols={cols} nRows={14} cell={mkCell(rows, {cat: -1000, net: -1000, loc: -1000}, f)} hdrSel="Branch" dim={op}
        hot={(f >= 275 && f < 312) || (f >= 596 && f < 628) ? "closeLoad" : f >= 440 && f < 490 ? "manageParams" : undefined} status={`10 COLUMNS, 999+ ROWS    Column profiling based on top 1000 rows    ·    TargetBranch = "${branch}"`} />
      {paneOn ? (
        <div style={{position: "absolute", left: 1040, top: 170, width: 740, opacity: vis(f, f < 440 ? 312 : 612, f < 440 ? 440 : 790, 14), background: "#fff", border: "1px solid #8A8A8A", boxShadow: "0 20px 60px rgba(0,0,0,.55)", fontFamily: FONT_AR, color: "#222", borderRadius: 6, zIndex: 20}}>
          <div style={{background: "#107C41", color: "#fff", padding: "10px 16px", fontSize: 18, fontWeight: 700}}>Queries & Connections</div>
          <div style={{padding: "14px 16px", display: "flex", gap: 24, fontSize: 15, color: "#555", borderBottom: "1px solid #E0E0E0"}}><span style={{color: "#107C41", fontWeight: 700}}>Queries</span><span>Connections</span></div>
          <div style={{padding: "16px"}}>
            <div style={{display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 700}}><span>Sales</span><span style={{fontSize: 15, color: paneProg >= 1 ? "#107C41" : "#666", fontWeight: 400}}>{paneProg >= 1 ? `${fmt(rowsLoaded)} rows loaded.` : `Loading… ${Math.round(paneProg * 100)}%`}</span></div>
            <div style={{height: 8, background: "#E6E6E6", borderRadius: 4, marginTop: 10, overflow: "hidden"}}><div style={{width: `${paneProg * 100}%`, height: "100%", background: "#107C41"}} /></div>
            <div style={{fontSize: 14, color: "#777", marginTop: 10}}>TargetBranch = "{branch}"  ·  loaded from manzooma_sales_2026.xlsx (50,000 rows)</div>
          </div>
        </div>
      ) : null}
      <ParamDialog f={f} a={490} b={585} foc={f >= 510 && f < 525 ? "cur" : ""} list={["TargetBranch"]} sel={0} name="TargetBranch" type="Text" sug="List of values" items={["Cairo", "Alex", "Giza", "Aswan"]} def="Cairo" cur={f >= 520 ? "Alex" : "Cairo"} okHot={f >= 560} newHot={false} />
      {f >= 460 && f < 490 ? <MenuBox x={menu1.x} y={menu1.y} w={170} hot={f >= 478 ? 0 : -1} items={["Manage Parameters", "Edit Parameters"]} /> : null}
      <Card f={f} a={40} b={300} x={560} y={380} w={800} color={BLU} title="Opening manzooma_sales_2026.xlsx">
        <div style={{fontFamily: MONO, fontSize: 24, color: C.text}}>50,000 rows → Power Query</div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", marginTop: 14, overflow: "hidden"}}><div style={{width: `${loaded * 100}%`, height: "100%", background: `linear-gradient(90deg, ${BLU}, ${EME})`}} /></div>
        <div style={{fontFamily: MONO, fontSize: 20, color: loaded >= 1 ? "#6EE7B7" : C.mute, marginTop: 8}}>{loaded >= 1 ? "✓ Loaded" : `Loading… ${Math.round(loaded * 100)}%`}</div>
      </Card>
      {seal > 0 ? (
        <div style={{position: "absolute", left: 1040, top: 190, width: 720, padding: "26px 0 30px", background: "rgba(15,23,42,.96)", border: `2px solid ${EME}`, borderRadius: 26, boxShadow: `0 0 40px ${EME}66, 0 24px 60px rgba(0,0,0,.5)`, opacity: vis(f, 800, 1377, 20), transform: `scale(${0.7 + 0.3 * seal})`, transformOrigin: "50% 40%", textAlign: "center", zIndex: 30}}>
          <svg width={240} height={240} viewBox="0 0 300 300" style={{filter: `drop-shadow(0 0 26px ${EME})`}}>
            <circle cx={150} cy={150} r={138} fill="none" stroke={EME} strokeWidth={3} strokeDasharray="10 12" transform={`rotate(${f * 0.6} 150 150)`} />
            <circle cx={150} cy={150} r={112} fill="rgba(16,185,129,.14)" stroke={EME} strokeWidth={8} />
            <path d="M98 154 L136 192 L206 112" fill="none" stroke="#6EE7B7" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={170} strokeDashoffset={170 * (1 - prog(f, 820, 860))} />
          </svg>
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: "#6EE7B7", marginTop: 4}}>ENTERPRISE M LOGIC SEAL</div>
          <div style={{fontFamily: MONO, fontSize: 23, color: C.text, marginTop: 8}}>Cairo {fmt(COUNT_BY.Cairo)}  ·  Alex {fmt(COUNT_BY.Alex)} rows</div>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.mute, marginTop: 6}}>one query · one parameter · 50,000 rows</div>
        </div>
      ) : null}
      <Click f={f} at={300} x={cl.x} y={cl.y} />
      <Click f={f} at={448} x={mp.x} y={mp.y} />
      <Click f={f} at={484} x={menu1.x + 60} y={menu1.y + 18} />
      <Click f={f} at={512} x={pCurP.x} y={pCurP.y} />
      <Click f={f} at={570} x={pOkP.x} y={pOkP.y} />
      <Click f={f} at={612} x={cl.x} y={cl.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={61} b={541} color={BLU} text="Enterprise M Logic Pipeline ──► Apply Conditional Columns & Parameters to 50,000 Rows" />
      <Tag f={f} a={860} b={1340} color={EME} text="Zero Manual Rework ──► Change One Parameter, Refresh, and the Whole Report Follows" />
    </div>
  );
};
export {typed as _t, lin as _l, F_COND as _fc, A as _A, FONT_AR as _F};

/* ───────────────────────── SCENE 6 ───────────────────────── */
const SKILLS = ["Conditional Column — If / Else If / Else", "Custom Column with M code", "Text.Combine for text merging", "M Parameters (TargetBranch)", "Advanced Editor — let … in"];
export const Scene6: React.FC<{f: number}> = ({f}) => {
  const a = A[5];
  const fill = prog(f, 60, 170);
  const pct = (UNIT_PROGRESS * 100 * fill).toFixed(1);
  const fade = 1 - lin(f, 1065, 1115);
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
            <div><div style={{fontFamily: MONO, fontSize: 22, color: "#6EE7B7", fontWeight: 700}}>Lesson 50 Completed</div><div style={{fontFamily: MONO, fontSize: 19, color: C.text}}>Conditional & Custom M Columns Mastered</div></div>
          </div>
          <div style={{marginTop: 30, fontFamily: MONO, fontSize: 20, color: C.mute, display: "flex", justifyContent: "space-between"}}><span>Course progress · lesson 50 of 76</span><span style={{color: C.text}}>Unit 10 of 14</span></div>
          <div style={{height: 22, borderRadius: 12, background: "#0B1220", marginTop: 10, overflow: "hidden", border: `1px solid ${C.line}`}}><div style={{width: `${UNIT_PROGRESS * 100 * fill}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, boxShadow: `0 0 18px ${C.green}`}} /></div>
          <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: "#6EE7B7", marginTop: 8, textAlign: "right"}}>{pct}%</div>
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 18, color: C.mute}}><span>Units complete · 9 of 14</span><span style={{color: "#6EE7B7"}}>64.3%</span></div>
          <div style={{height: 12, borderRadius: 8, background: "#0B1220", marginTop: 4, overflow: "hidden", border: `1px solid ${C.line}`}}><div style={{width: `${(9 / 14) * 100 * fill}%`, height: "100%", background: C.green}} /></div>
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
          <div style={{fontFamily: FONT_AR, fontSize: 34, fontWeight: 700, color: C.text, direction: "rtl", marginTop: 6}}>الدرس 51 (الوحدة 10 من 14)</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: "#BAE6FD", marginTop: 6}}>Refresh Properties & Query Folding</div>
          <div style={{marginTop: 18, borderRadius: 10, overflow: "hidden", border: "1px solid #475569", width: 560}}>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} style={{display: "flex", height: 34, background: r === 0 ? "#4EA72E" : r % 2 ? "#DCEBD5" : "#fff"}}>
                {[0, 1, 2, 3].map((c) => <div key={c} style={{flex: 1, borderRight: "1px solid #BBB", fontFamily: MONO, fontSize: 17, lineHeight: "34px", padding: "0 10px", color: r === 0 ? "#fff" : "#222", display: "flex", justifyContent: "space-between"}}><span>{r === 0 ? ["Query", "Source", "Folding", "Refresh"][c] : ""}</span>{r === 0 ? <span style={{fontSize: 11}}>▼</span> : null}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
