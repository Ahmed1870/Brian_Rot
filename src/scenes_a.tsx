import React from "react";
import {C, M, GRID_Y, MONO, COLS} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Keys, Neon, Tag, TopBadge, pathAt, prog, typed, vis, lin, Pt} from "./kit";
import {CellSty, ExcelWindow, Grid, Sel, colLeft, colName, rowsRange, tabBox, HOME_MERGE, TD_CONVERT, TD} from "./xl";
import {Dialog, WinBtn} from "./kit";
import {QTY, PRICE, fmt, rev, TOT9, TOT11} from "./data";
import {Mono, Colored, ErrBadge, MenuBox, Tip, DashBox, ctr, tabCtr, toStage} from "./common";

const R1 = rowsRange(1);
const HDR = "#E3EBF5";
const BLU = C.blue, EME = C.green, AMB = C.amber, PUR = C.purple, RED = C.red;
const cw = (c: number) => COLS[c];
const ry = (r: number) => GRID_Y + (r - 1) * M.rowH;
const cell0 = (r: number, c: number, nrows: number): CellSty | undefined => {
  if (r === 1) return c === 0 ? {text: "Qty", bold: true, bg: HDR} : c === 1 ? {text: "Unit Price", bold: true, bg: HDR} : c === 2 ? {text: "Revenue", bold: true, bg: HDR} : undefined;
  if (r >= 2 && r <= nrows + 1) {
    if (c === 0) return {text: String(QTY[r - 2]), num: true};
    if (c === 1) return {text: fmt(PRICE[r - 2]), num: true};
  }
  return undefined;
};
const spillBox = (c: number, r1: number, n: number, color: string, o = 1) => (
  <div style={{position: "absolute", left: colLeft(c), top: ry(r1), width: cw(c), height: n * M.rowH, border: `2.5px solid ${color}`, boxShadow: `0 0 14px ${color}88`, opacity: o, boxSizing: "border-box", zIndex: 6, pointerEvents: "none"}} />
);

/* ───────────────────────── SCENE 1: spill physics ───────────────────────── */
export const Scene1: React.FC<{f: number}> = ({f}) => {
  const FM = "=A2:A10*B2:B10";
  const ft = typed(FM, f, 860, 0.22);
  const n = ft.length;
  const spilled = f >= 982;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (c === 2 && r === 2) return spilled ? {text: fmt(rev(0)), num: true} : f >= 860 ? {text: ft, edit: true} : cell0(r, c, 9);
    if (c === 2 && r >= 3 && r <= 10) return spilled && f >= 982 + (r - 2) * 3 ? {text: fmt(rev(r - 2)), num: true} : undefined;
    return cell0(r, c, 9);
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  if (f >= 840) sel = {r1: 2, c1: 2, r2: 2, c2: 2};
  if (f >= 984) sel = {r1: 3, c1: 2, r2: 3, c2: 2};
  if (f >= 1180) sel = {r1: 5, c1: 2, r2: 5, c2: 2};
  const editing = f >= 860 && f < 980;
  const formula = f < 860 ? "" : f < 980 ? ft : FM;
  const c2 = ctr(R1, 2, 2), c5 = ctr(R1, 5, 2), c10 = ctr(R1, 10, 2);
  const pts: Pt[] = [{f: 0, x: 1500, y: 720}, {f: 600, x: 1300, y: 600}, {f: 832, x: c2.x + 120, y: c2.y + 60}, {f: 846, x: c2.x, y: c2.y}, {f: 1000, x: c2.x + 80, y: c2.y + 100}, {f: 1172, x: c5.x, y: c5.y}, {f: 1300, x: c5.x + 100, y: c5.y + 40}, {f: 1380, x: c10.x + 8, y: c10.y + 14}];
  const cur = pathAt(f, pts);
  const refs = [] as {r: number; c: number; color: string}[];
  const sp = prog(f, 982, 1010);
  const pulse = 0.6 + 0.4 * Math.sin(f / 6);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Home" nameBox={f < 840 ? "A1" : f < 984 ? "C2" : f < 1180 ? "C3" : "C5"} formula={formula} formulaDim={f >= 1180} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} refs={refs} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            {n >= 7 && f < 982 ? <div style={{position: "absolute", left: colLeft(0), top: ry(2), width: cw(0), height: 9 * M.rowH, border: "2px dashed #2F80D0", background: "rgba(47,128,208,.10)", boxSizing: "border-box", zIndex: 5}} /> : null}
            {n >= 14 && f < 982 ? <div style={{position: "absolute", left: colLeft(1), top: ry(2), width: cw(1), height: 9 * M.rowH, border: "2px dashed #D9480F", background: "rgba(217,72,15,.10)", boxSizing: "border-box", zIndex: 5}} /> : null}
            {spilled ? <div style={{position: "absolute", left: colLeft(2), top: ry(2), width: cw(2), height: 9 * M.rowH * sp, border: `2.5px solid ${BLU}`, boxShadow: `0 0 ${16 * pulse}px ${BLU}`, boxSizing: "border-box", zIndex: 6}} /> : null}
            <Neon f={f} a={982} b={1100} x={colLeft(2)} y={ry(2)} w={cw(2)} h={M.rowH} color={EME} r={3} />
            {f >= 1180 ? <Tip x={colLeft(2) + cw(2) + 14} y={ry(5) - 4} text="Spilled cell — formula lives in C2 (anchor)" o={prog(f, 1180, 1200) * (1 - prog(f, 1330, 1350))} /> : null}
          </div>
        }
      />
      <Card f={f} a={50} b={476} x={1010} y={250} w={780} color={BLU} title="الدرس 33 من 76  ──►  بداية الوحدة 7 من 14">
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, color: C.mute}}><span>Course progress · lesson 33 of 76</span><span style={{color: BLU}}>{(33 / 76 * 100).toFixed(1)}%</span></div>
        <div style={{height: 14, borderRadius: 8, background: "#0B1220", overflow: "hidden", marginTop: 6}}><div style={{width: `${(33 / 76) * 100 * prog(f, 80, 220)}%`, height: "100%", background: BLU}} /></div>
        <div style={{display: "flex", gap: 6, marginTop: 14}}>{Array.from({length: 14}, (_, i) => <div key={i} style={{flex: 1, height: 14, borderRadius: 4, background: i < 6 ? EME : i === 6 ? AMB : "#1E293B", boxShadow: i === 6 ? `0 0 12px ${AMB}` : "none"}} />)}</div>
        <div style={{fontFamily: MONO, fontSize: 19, color: C.mute, marginTop: 6}}>Units 1–6 done · unit 7 starts now</div>
      </Card>
      <Card f={f} a={490} b={832} x={1010} y={250} w={780} color={BLU} title="Dynamic Arrays Engine">
        {["Spill physics", "Anchor cell", "#SPILL! fixes", "# and @ operators"].map((t, i) => <div key={t} style={{opacity: prog(f, 500 + i * 30, 520 + i * 30), fontFamily: MONO, fontSize: 25, color: "#BAE6FD", lineHeight: 1.55}}>▸ {t}</div>)}
      </Card>
      <Card f={f} a={1250} b={1528} x={1010} y={300} w={780} color={RED} title="Manual fill-down  ✕">
        <Mono c="#FCA5A5" s={24}>No dragging the fill handle.</Mono>
        <Mono c="#FCA5A5" s={24}>No Ctrl+Shift+Enter.</Mono>
        <Mono c="#6EE7B7" s={24}>One formula → the engine fills the rest ✓</Mono>
      </Card>
      <Keys f={f} a={962} b={1002} keys={["Enter"]} press={980} />
      <Click f={f} at={846} x={c2.x} y={c2.y} />
      <Click f={f} at={1172} x={c5.x} y={c5.y} />
      <Cursor x={cur.x} y={cur.y} />
      <TopBadge f={f} a={60} b={540} ar="الدرس 33 من 76 | الوحدة 7 من 14" en="Dynamic Arrays Engine" />
      <Tag f={f} a={660} b={1140} color={BLU} text="Spill Physics ──► Single Formula in Anchor Cell Spills Results Automatically" />
    </div>
  );
};

/* ───────────────────────── SCENE 2: #SPILL! causes & fixes ───────────────────────── */
const SP = "#SPILL!";
export const Scene2: React.FC<{f: number}> = ({f}) => {
  // block 1: A,B,C rows 2..6 (obstacle in C4) · block 2: E,F,G (merged G4:G5) · block 3: table I,J,K
  const F1 = "=A2:A6*B2:B6", F2 = "=E2:E6*F2:F6", F3 = "=I2:I6*J2:J6";
  const t1 = typed(F1, f, 70, 0.25), t2 = typed(F2, f, 225, 0.25), t3 = typed(F3, f, 370, 0.25);
  const enter1 = 130, enter2 = 285, enter3 = 430;
  const fixObs = 660, fixMerge = 742, fixTbl = 814;
  const sp1 = f >= fixObs, sp2 = f >= fixMerge, sp3 = f >= fixTbl;
  const obsGone = f >= 655;
  const merged = f < fixMerge;
  const tableOn = f < fixTbl;
  const spillCell = (r: number, c0: number, base: number, ok: boolean, since: number): CellSty | undefined => ok ? (f >= since + (r - 2) * 3 ? {text: fmt(QTY[base + r - 2] * PRICE[base + r - 2]), num: true} : undefined) : undefined;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) {
      const h = ["Qty", "Unit Price", "Revenue", "", "Qty", "Unit Price", "Revenue", "", "Qty", "Unit Price", "Revenue"][c];
      return h ? {text: h, bold: true, bg: c >= 8 && tableOn ? undefined : HDR, ...(c >= 8 && !tableOn ? {bg: "#4EA72E", color: "#fff"} : {})} : undefined;
    }
    if (r < 2 || r > 6) return undefined;
    const i = r - 2;
    const num = (v: number, b = 0): CellSty => ({text: fmt(v), num: true, ...(c >= 8 && !tableOn ? {bg: i % 2 === 1 ? "#DCEBD5" : undefined} : {})});
    if (c === 0) return {text: String(QTY[i]), num: true};
    if (c === 1) return num(PRICE[i]);
    if (c === 2) {
      if (r === 2) return sp1 ? spillCell(r, 2, 0, true, fixObs + 4) : f >= enter1 ? {text: SP, err: true} : f >= 70 ? {text: t1, edit: true} : undefined;
      if (r === 4 && !obsGone) return {text: "Check"};
      return spillCell(r, 2, 0, sp1, fixObs + 4);
    }
    if (c === 4) return {text: String(QTY[i + 5]), num: true};
    if (c === 5) return num(PRICE[i + 5]);
    if (c === 6) {
      if (r === 2) return sp2 ? spillCell(r, 6, 5, true, fixMerge + 4) : f >= enter2 ? {text: SP, err: true} : f >= 225 ? {text: t2, edit: true} : undefined;
      return spillCell(r, 6, 5, sp2 && !(r === 4 || r === 5 ? merged : false), fixMerge + 4);
    }
    if (c === 8) return {text: String(QTY[i + 2]), num: true, ...(!tableOn ? {bg: i % 2 === 1 ? "#DCEBD5" : undefined} : {})};
    if (c === 9) return num(PRICE[i + 2]);
    if (c === 10) {
      if (r === 2) return sp3 ? spillCell(r, 10, 2, true, fixTbl + 4) : f >= enter3 ? {text: SP, err: true} : f >= 370 ? {text: t3, edit: true} : undefined;
      return spillCell(r, 10, 2, sp3, fixTbl + 4);
    }
    return undefined;
  };
  // selection / active cell
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  let nameBox = "A1";
  const set = (r: number, c: number, r2 = r, c2 = c, nm?: string) => { sel = {r1: r, c1: c, r2, c2}; nameBox = nm ?? `${colName(c)}${r}`; };
  if (f >= 60) set(2, 2);
  if (f >= 130) set(2, 2);
  if (f >= 215) set(2, 6);
  if (f >= 360) set(2, 10);
  if (f >= 600 && f < 640) set(2, 2);
  if (f >= 640 && f < 660) set(4, 2);
  if (f >= 676 && f < 742) set(4, 6, 5, 6, "G4:G5");
  if (f >= 742 && f < 756) set(2, 6);
  if (f >= 756) set(3, 10);
  const editing = (f >= 70 && f < enter1) || (f >= 225 && f < enter2) || (f >= 370 && f < enter3);
  const formula = f < 70 ? "" : f < enter1 ? t1 : f < 225 ? F1 : f < enter2 ? t2 : f < 370 ? F2 : f < enter3 ? t3 : F3;
  // ribbon tab
  const tab = f >= 770 && f < 816 ? "Table Design" : f >= 690 && f < 745 ? "Home" : "Home";
  const ctx = f >= 756 && f < fixTbl + 2;
  // coordinates
  const c2 = ctr(R1, 2, 2), g2 = ctr(R1, 2, 6), k2 = ctr(R1, 2, 10), c4 = ctr(R1, 4, 2);
  const badge1 = toStage({x: colLeft(2) - 22, y: ry(2) + 2}), g4 = ctr(R1, 4, 6), g5 = ctr(R1, 5, 6);
  const mergeDrop = toStage({x: HOME_MERGE.x + HOME_MERGE.w - 14, y: HOME_MERGE.y + 12});
  const unmerge = toStage({x: HOME_MERGE.x + 70, y: HOME_MERGE.y + HOME_MERGE.h + 4 + 26 * 3 + 13});
  const tdTab = tabCtr("Table Design"), k3 = ctr(R1, 3, 10);
  const conv = toStage({x: TD_CONVERT.x + 80, y: TD_CONVERT.y + 12});
  const menuItem = toStage({x: colLeft(2) - 22 + 90, y: ry(2) + 26 + 4 + 26 * 3 + 13});
  const yes = {x: M.x + 760 + 40, y: M.y + 232 + 150};
  const pts: Pt[] = [
    {f: 0, x: 1500, y: 720}, {f: 56, x: c2.x, y: c2.y}, {f: 150, x: c2.x + 60, y: c2.y + 90},
    {f: 212, x: g2.x, y: g2.y}, {f: 300, x: g2.x + 60, y: g2.y + 90}, {f: 356, x: k2.x, y: k2.y}, {f: 450, x: k2.x - 80, y: k2.y + 120},
    {f: 596, x: badge1.x + 10, y: badge1.y + 10}, {f: 612, x: badge1.x + 10, y: badge1.y + 10}, {f: 632, x: menuItem.x, y: menuItem.y}, {f: 646, x: menuItem.x, y: menuItem.y},
    {f: 658, x: c4.x, y: c4.y}, {f: 672, x: g4.x, y: g4.y}, {f: 684, x: g5.x, y: g5.y}, {f: 700, x: mergeDrop.x, y: mergeDrop.y}, {f: 712, x: mergeDrop.x, y: mergeDrop.y},
    {f: 732, x: unmerge.x, y: unmerge.y}, {f: 746, x: unmerge.x, y: unmerge.y}, {f: 756, x: k3.x, y: k3.y}, {f: 770, x: tdTab.x, y: tdTab.y}, {f: 790, x: conv.x, y: conv.y}, {f: 798, x: conv.x, y: conv.y},
    {f: 810, x: yes.x, y: yes.y}, {f: 860, x: yes.x + 100, y: yes.y + 120},
  ];
  const cur = pathAt(f, pts);
  const err1 = f >= enter1 && !sp1, err2 = f >= enter2 && !sp2, err3 = f >= enter3 && !sp3;
  const pulse = 0.6 + 0.4 * Math.sin(f / 6);
  const mgOverlay = merged ? <div style={{position: "absolute", left: colLeft(6) + 1, top: ry(4) + 1, width: cw(6) - 1, height: 2 * M.rowH - 1, background: "#fff", border: `1px solid #BDBDBD`, zIndex: 4}} /> : null;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab={tab} ctxTab={ctx} tableName="Table1" nameBox={nameBox} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} table={tableOn ? {top: 1, bottom: 6, left: 8, right: 10, p: 1} : undefined} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            {mgOverlay}
            {err1 ? <DashBox x={colLeft(2)} y={ry(2)} w={cw(2)} h={5 * M.rowH} color="#7A7A7A" /> : null}
            {err2 ? <DashBox x={colLeft(6)} y={ry(2)} w={cw(6)} h={5 * M.rowH} color="#7A7A7A" /> : null}
            {err3 ? <DashBox x={colLeft(10)} y={ry(2)} w={cw(10)} h={5 * M.rowH} color="#7A7A7A" /> : null}
            {err1 ? <ErrBadge x={colLeft(2) - 22} y={ry(2) + 2} /> : null}
            {err2 ? <ErrBadge x={colLeft(6) - 22} y={ry(2) + 2} /> : null}
            {err3 ? <ErrBadge x={colLeft(10) - 22} y={ry(2) + 2} /> : null}
            {err1 && f >= 150 && f < 193 ? <Tip x={colLeft(2) + 30} y={ry(2) + 26} text="Spill range isn't blank" o={prog(f, 150, 160)} /> : null}
            {err2 && f >= 300 && f < 350 ? <Tip x={colLeft(6) + 30} y={ry(2) + 26} text="Spill range has merged cells" o={prog(f, 300, 310)} /> : null}
            {err3 && f >= 440 && f < 500 ? <Tip x={colLeft(10) + 30} y={ry(2) + 26} text="Spill range in table" o={prog(f, 440, 450)} /> : null}
            {f >= 600 && f < 646 ? <MenuBox x={colLeft(2) - 22} y={ry(2) + 26} w={250} hot={f >= 622 ? 3 : -1} items={["Spill range isn't blank", "Help on this error", "Show Calculation Steps…", "Select Obstructing Cells", "Ignore Error", "Edit in Formula Bar"]} /> : null}
            {f >= 700 && f < 740 ? <MenuBox x={HOME_MERGE.x} y={HOME_MERGE.y + HOME_MERGE.h + 2} w={170} hot={f >= 720 ? 3 : -1} items={["Merge & Center", "Merge Across", "Merge Cells", "Unmerge Cells"]} /> : null}
            {f >= 600 && f < 646 ? <Neon f={f} a={622} b={646} x={colLeft(2)} y={ry(4)} w={cw(2)} h={M.rowH} color={RED} r={3} /> : null}
            {f >= 150 && f < 215 ? <Neon f={f} a={150} b={215} x={colLeft(2)} y={ry(4)} w={cw(2)} h={M.rowH} color={RED} r={3} /> : null}
            {f >= 300 && f < 360 ? <Neon f={f} a={300} b={360} x={colLeft(6)} y={ry(4)} w={cw(6)} h={2 * M.rowH} color={RED} r={3} /> : null}
            {f >= 690 && f < 745 ? <Neon f={f} a={690} b={745} x={HOME_MERGE.x} y={HOME_MERGE.y} w={HOME_MERGE.w} h={HOME_MERGE.h} color={BLU} r={4} /> : null}
            {f >= 775 && f < 800 ? <Neon f={f} a={775} b={800} x={TD_CONVERT.x} y={TD_CONVERT.y} w={TD_CONVERT.w} h={TD_CONVERT.h} color={BLU} r={4} /> : null}
            {sp1 ? spillBox(2, 2, 5, f >= 825 ? EME : BLU) : null}
            {sp2 ? spillBox(6, 2, 5, f >= 825 ? EME : BLU) : null}
            {sp3 ? spillBox(10, 2, 5, f >= 825 ? EME : BLU) : null}
            <Dialog f={f} a={798} b={820} x={760} y={232} w={440} h={200} title="Microsoft Excel">
              <div style={{position: "absolute", left: 20, top: 18, fontSize: 16, width: 400, lineHeight: 1.4}}>Do you want to convert the table to a normal range?</div>
              <div style={{position: "absolute", right: 18, bottom: 14, display: "flex", gap: 10}}><WinBtn label="Yes" primary hot={f >= 808} /><WinBtn label="No" /></div>
            </Dialog>
          </div>
        }
      />
      <Card f={f} a={45} b={193} x={1400} y={300} w={460} color={RED} title="#SPILL!">
        <Mono c="#FCA5A5" s={22}>The engine can't spill</Mono>
        <Mono c="#FCA5A5" s={22}>into the cells below C2</Mono>
      </Card>
      <Card f={f} a={193} b={588} x={1400} y={300} w={460} color={RED} title="Three root causes">
        {["① Obstacle in the spill path", "② Merged cells", "③ Excel Table (official)"].map((t, i) => <div key={t} style={{opacity: prog(f, 205 + i * 130, 225 + i * 130), fontFamily: MONO, fontSize: 22, color: "#FCA5A5", lineHeight: 1.6}}>{t}</div>)}
      </Card>
      <Card f={f} a={588} b={825} x={1400} y={300} w={460} color={AMB} title="Three fixes">
        {["① Delete the obstacle", "② Unmerge Cells", "③ Convert to Range"].map((t, i) => <div key={t} style={{opacity: prog(f, 600 + i * 70, 620 + i * 70), fontFamily: MONO, fontSize: 22, color: "#FDE68A", lineHeight: 1.6}}>{t}</div>)}
      </Card>
      <Card f={f} a={850} b={1194} x={1400} y={300} w={460} color={EME} title="Path unblocked ✓">
        {["Obstacle cleared", "Cells unmerged", "Table → range"].map((t, i) => <div key={t} style={{opacity: prog(f, 860 + i * 25, 880 + i * 25), fontFamily: MONO, fontSize: 22, color: "#A7F3D0", lineHeight: 1.6}}>✓ {t}</div>)}
      </Card>
      <Keys f={f} a={112} b={152} keys={["Enter"]} press={130} />
      <Keys f={f} a={267} b={307} keys={["Enter"]} press={285} />
      <Keys f={f} a={412} b={452} keys={["Enter"]} press={430} />
      <Keys f={f} a={636} b={676} keys={["Delete"]} press={655} />
      <Click f={f} at={56} x={c2.x} y={c2.y} />
      <Click f={f} at={212} x={g2.x} y={g2.y} />
      <Click f={f} at={356} x={k2.x} y={k2.y} />
      <Click f={f} at={604} x={badge1.x + 10} y={badge1.y + 10} />
      <Click f={f} at={640} x={menuItem.x} y={menuItem.y} />
      <Click f={f} at={706} x={mergeDrop.x} y={mergeDrop.y} />
      <Click f={f} at={740} x={unmerge.x} y={unmerge.y} />
      <Click f={f} at={772} x={tdTab.x} y={tdTab.y} />
      <Click f={f} at={796} x={conv.x} y={conv.y} />
      <Click f={f} at={810} x={yes.x} y={yes.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={60} b={600} color={RED} text="#SPILL! Error Fix ──► Clear Obstacles | Unmerge Cells | Convert Table to Range" />
      <Tag f={f} a={840} b={1180} color={EME} text="Path Unblocked ──► Dynamic Array Spills Instantly Upon Path Clearance" />
    </div>
  );
};

/* ───────────────────────── SCENE 3: # operator and @ ───────────────────────── */
export const Scene3: React.FC<{f: number}> = ({f}) => {
  const EF = "=SUM(C2#)", ET = typed(EF, f, 300, 0.1), n = ET.length;
  const FF = "=@A2:A10", FT = typed(FF, f, 695, 0.25);
  const fields = [{c: 0, r: 11, s: 480, t: "10", e: 495}, {c: 1, r: 11, s: 500, t: "390", e: 520}, {c: 0, r: 12, s: 525, t: "13", e: 540}, {c: 1, r: 12, s: 545, t: "175", e: 565}];
  const grown = f >= 642;
  const NR = grown ? 11 : 9;
  const fText = f < 595 ? "=A2:A10*B2:B10" : f < 612 ? "=A2:A10*B2:B10" : f < 622 ? "=A2:A12*B2:B10" : "=A2:A12*B2:B12";
  const editC = f >= 595 && f < 640;
  const ePoint = f >= 420;
  const total = f >= 642 ? TOT11 : TOT9;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) { const h = ["Qty", "Unit Price", "Revenue", "", "Total", "Row value"][c]; return h ? {text: h, bold: true, bg: c >= 4 ? "#EFE6FB" : HDR} : undefined; }
    if (r >= 11 && r <= 12 && c <= 1) {
      const fl = fields.find((x) => x.r === r && x.c === c)!;
      if (f >= fl.e) return {text: c === 1 ? fmt(Number(fl.t)) : fl.t, num: true};
      return f >= fl.s ? {text: typed(fl.t, f, fl.s, 0.3), edit: true, num: true} : undefined;
    }
    if (c === 2 && r >= 2 && r <= 12) {
      if (r === 2 && editC) return {text: fText, edit: true};
      if (r <= 10) return {text: fmt(rev(r - 2)), num: true};
      return grown && f >= 642 + (r - 11) * 4 ? {text: fmt(rev(r - 2)), num: true} : undefined;
    }
    if (c === 4 && r === 2) return ePoint ? {text: fmt(total), num: true, bold: true, bg: f >= 642 && f < 720 ? "#EFE6FB" : undefined} : f >= 300 ? {text: ET, edit: true} : undefined;
    if (c === 5 && r === 5) return f >= 750 ? {text: String(QTY[3]), num: true, bold: true, bg: "#FFF3D6"} : f >= 695 ? {text: FT, edit: true} : undefined;
    if (r >= 2 && r <= 10) { if (c === 0) return {text: String(QTY[r - 2]), num: true}; if (c === 1) return {text: fmt(PRICE[r - 2]), num: true}; }
    return undefined;
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0}, nm = "A1";
  const S = (r: number, c: number) => { sel = {r1: r, c1: c, r2: r, c2: c}; nm = `${colName(c)}${r}`; };
  if (f >= 280) S(2, 4);
  if (f >= 475) S(11, 0);
  if (f >= 500) S(11, 1);
  if (f >= 525) S(12, 0);
  if (f >= 545) S(12, 1);
  if (f >= 580) S(2, 2);
  if (f >= 642) S(2, 2);
  if (f >= 685) S(5, 5);
  const editing = (f >= 300 && f < 420) || (f >= 480 && f < 565) || editC || (f >= 695 && f < 750);
  const formula = f < 300 ? "" : f < 420 ? ET : f < 480 ? EF : f < 590 ? "" : f < 640 ? fText : f < 695 ? "=A2:A12*B2:B12" : f < 750 ? FT : FF;
  const e2 = ctr(R1, 2, 4), a11 = ctr(R1, 11, 0), c2 = ctr(R1, 2, 2), f5 = ctr(R1, 5, 5);
  const pts: Pt[] = [{f: 0, x: 1500, y: 700}, {f: 270, x: e2.x + 40, y: e2.y + 40}, {f: 282, x: e2.x, y: e2.y}, {f: 440, x: e2.x + 60, y: e2.y + 120}, {f: 474, x: a11.x, y: a11.y}, {f: 570, x: a11.x + 40, y: a11.y + 60}, {f: 585, x: c2.x, y: c2.y}, {f: 680, x: c2.x + 120, y: c2.y + 90}, {f: 688, x: f5.x, y: f5.y}, {f: 800, x: f5.x + 90, y: f5.y + 100}];
  const cur = pathAt(f, pts);
  const spN = NR * (f >= 642 ? 1 : 1);
  const growH = f >= 642 ? 9 + 2 * prog(f, 642, 665) : 9;
  const lst = f >= 330 && f < 350;
  const pulse = 0.6 + 0.4 * Math.sin(f / 6);
  void spN;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={nm} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            <div style={{position: "absolute", left: colLeft(2), top: ry(2), width: cw(2), height: growH * M.rowH, border: `2.5px solid ${f >= 380 ? PUR : BLU}`, boxShadow: `0 0 ${14 * pulse}px ${f >= 380 ? PUR : BLU}`, boxSizing: "border-box", zIndex: 6, background: f >= 380 && f < 897 ? "rgba(168,85,247,.10)" : "transparent"}} />
            {n >= 8 && f < 420 ? <div style={{position: "absolute", left: colLeft(2), top: ry(2), width: cw(2), height: 9 * M.rowH, border: "2px dashed #A855F7", zIndex: 7}} /> : null}
            {lst ? <MenuBox x={colLeft(4)} y={ry(2) + 26} w={200} hot={1} items={["SUBTOTAL", "SUM", "SUMIF", "SUMIFS", "SUMPRODUCT"]} /> : null}
            {f >= 350 && f < 420 ? <Tip x={colLeft(4)} y={ry(2) + 26} text="SUM(number1, [number2], …)" /> : null}
            {f >= 420 ? <Neon f={f} a={642} b={730} x={colLeft(4)} y={ry(2)} w={cw(4)} h={M.rowH} color={PUR} r={3} /> : null}
            {f >= 750 ? <Neon f={f} a={750} b={897} x={colLeft(5)} y={ry(5)} w={cw(5)} h={M.rowH} color={AMB} r={3} /> : null}
            {f >= 750 && f < 897 ? <Tip x={colLeft(5) + cw(5) + 12} y={ry(5) - 2} text="@ keeps only the value on the same row (A5)" o={prog(f, 750, 765)} /> : null}
            {f >= 595 && f < 640 ? <div style={{position: "absolute", left: colLeft(2) + cw(2) + 12, top: ry(2) - 2, padding: "2px 10px", background: AMB, color: "#1C1100", fontFamily: MONO, fontWeight: 800, fontSize: 16, zIndex: 12}}>F2 · edit mode</div> : null}
          </div>
        }
      />
      <Card f={f} a={45} b={298} x={1020} y={250} w={780} color={PUR} title="Spill Range Operator  #">
        <Mono c="#E9D5FF" s={25}>C2   → the anchor cell only</Mono>
        <Mono c="#fff" s={25}>C2#  → the whole spilled range</Mono>
      </Card>
      <Card f={f} a={298} b={470} x={1020} y={250} w={780} color={PUR} title="=SUM(C2#)">
        <Colored s={42} parts={[["=SUM(", PUR], ["C2", "#E9D5FF"], ["#", AMB], [")", PUR]]} />
      </Card>
      <Card f={f} a={642} b={897} x={1020} y={250} w={780} color={PUR} title="# follows the spill">
        <Mono c="#E9D5FF" s={24}>Array grew 9 → 11 rows</Mono>
        <Mono c="#fff" s={24}>=SUM(C2#) updated: {fmt(TOT11)}</Mono>
      </Card>
      <Card f={f} a={897} b={1181} x={940} y={250} w={860} color={PUR} title="# vs @">
        <div style={{display: "flex", gap: 24}}>
          <div style={{flex: 1, border: `2px solid ${PUR}`, borderRadius: 12, padding: "10px 16px"}}><Mono c="#E9D5FF" s={30}>C2#</Mono><Mono c={C.mute} s={20}>whole dynamic range</Mono></div>
          <div style={{flex: 1, border: `2px solid ${AMB}`, borderRadius: 12, padding: "10px 16px"}}><Mono c="#FDE68A" s={30}>@A2:A10</Mono><Mono c={C.mute} s={20}>one value (implicit ∩)</Mono></div>
        </div>
      </Card>
      <Keys f={f} a={330} b={352} keys={["Tab"]} press={346} />
      <Keys f={f} a={400} b={440} keys={["Enter"]} press={420} />
      <Keys f={f} a={494} b={524} keys={["Tab"]} press={497} />
      <Keys f={f} a={575} b={605} keys={["F2"]} press={590} />
      <Keys f={f} a={622} b={662} keys={["Enter"]} press={640} />
      <Keys f={f} a={730} b={770} keys={["Enter"]} press={750} />
      <Click f={f} at={282} x={e2.x} y={e2.y} />
      <Click f={f} at={474} x={a11.x} y={a11.y} />
      <Click f={f} at={585} x={c2.x} y={c2.y} />
      <Click f={f} at={688} x={f5.x} y={f5.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={90} b={630} color={PUR} text="Spill Operator (#) ──► =SUM(C2#) References the Entire Dynamic Spilled Range" />
      <Tag f={f} a={700} b={1140} color={AMB} text="Implicit Intersection (@) ──► Restricts Dynamic Spill Engine to Single Value Scalar" />
    </div>
  );
};
export {colName as _cn, Colored as _Co, lin as _l, tabBox as _tb, TD as _TD, TOT9 as _t9, TOT11 as _t11, PUR as _P, AMB as _A2, A as _A};
