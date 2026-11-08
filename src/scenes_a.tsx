import React from "react";
import {C, M, GRID_Y, MONO, FONT_AR, COLS} from "./theme";
import {A} from "./sync";
import {Card, Click, Cursor, Keys, Neon, Tag, TopBadge, pathAt, prog, typed, vis, Pt} from "./kit";
import {CellSty, ExcelWindow, Grid, Sel, colLeft, colName, rowsRange} from "./xl";
import {NAMES, CITIES, IDS, SALES, LOOKUP_ID, PRODUCTS, MONTHS, MATRIX, fmt} from "./data";
import {Colored, Mono, ctr, keyv, toStage} from "./common";

const R1 = rowsRange(1);
const HDR = "#E3EBF5";
const AMB = C.amber, BLU = C.blue, EME = C.green, PUR = C.purple;
const cw = (c: number) => COLS[c];
const cx = (c: number) => colLeft(c) + cw(c) / 2;
const ry = (r: number) => GRID_Y + (r - 1) * M.rowH;

/* ───────────────────────── SCENE 1: MATCH + INDEX apart ───────────────────────── */
export const Scene1: React.FC<{f: number}> = ({f}) => {
  const F2 = '=MATCH("Cairo",B2:B10,0)';
  const H2 = "=INDEX(A2:A10,4)";
  const H2C = '=INDEX(A2:A10,MATCH("Cairo",B2:B10,0))';
  const f2t = typed(F2, f, 460, 0.22), h2t = typed(H2, f, 690, 0.22);
  const f2done = f >= 600, h2done = f >= 770;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) {
      const h = ["Customer Name", "City", "Customer ID", "Sales"][c];
      if (h) return {text: h, bold: true, bg: HDR};
      if (c === 5) return {text: "MATCH", bold: true, bg: "#FFF1D6", color: "#8A5300"};
      if (c === 7) return {text: "INDEX", bold: true, bg: "#DCEFFB", color: "#0B5C8A"};
      return undefined;
    }
    if (r === 2 && c === 5) return f2done ? {text: "4", num: true, bold: true} : f >= 460 ? {text: f2t, edit: true} : undefined;
    if (r === 2 && c === 7) return h2done ? {text: NAMES[3], bold: true} : f >= 690 ? {text: h2t, edit: true} : undefined;
    if (r >= 2 && r <= 10) {
      const i = r - 2;
      if (c === 0) return {text: NAMES[i]};
      if (c === 1) return {text: CITIES[i]};
      if (c === 2) return {text: String(IDS[i]), num: true};
      if (c === 3) return {text: fmt(SALES[i]), num: true};
    }
    return undefined;
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  if (f >= 444) sel = {r1: 2, c1: 5, r2: 2, c2: 5};
  if (f >= 684) sel = {r1: 2, c1: 7, r2: 2, c2: 7};
  const editing = (f >= 460 && f < 600) || (f >= 690 && f < 770);
  const formula = f < 460 ? "" : f < 600 ? f2t : f < 690 ? F2 : f < 770 ? h2t : f < 860 ? H2 : H2C;
  const nameBox = f < 444 ? "A1" : f < 684 ? "F2" : "H2";
  const f2c = ctr(R1, 2, 5), h2c = ctr(R1, 2, 7);
  const pts: Pt[] = [{f: 0, x: 1500, y: 720}, {f: 300, x: 1400, y: 640}, {f: 440, x: f2c.x, y: f2c.y}, {f: 640, x: f2c.x + 30, y: f2c.y + 40}, {f: 682, x: h2c.x, y: h2c.y}, {f: 900, x: h2c.x + 80, y: h2c.y + 150}];
  const cur = pathAt(f, pts);
  // radar
  const scan = prog(f, 540, 608);
  const b5 = {x: colLeft(1), y: ry(5), w: cw(1), h: M.rowH};
  const ring = (k: number) => {
    const t = (f - 612 - k * 12) / 44;
    if (t < 0 || t > 1) return null;
    const s = 20 + 120 * t;
    return <div key={k} style={{position: "absolute", left: b5.x + b5.w / 2 - s, top: b5.y + 12 - s, width: s * 2, height: s * 2, borderRadius: s, border: `3px solid ${AMB}`, opacity: 1 - t, zIndex: 9}} />;
  };
  const link = prog(f, 830, 900);
  const ax = colLeft(1) + 30, bx = colLeft(0) + 40;
  const dotT = prog(f, 836, 900);
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={nameBox} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            <Neon f={f} a={470} b={700} x={colLeft(1)} y={ry(2)} w={cw(1)} h={9 * M.rowH} color={AMB} r={3} />
            {f >= 540 && f < 614 ? <div style={{position: "absolute", left: colLeft(1), top: ry(2) + scan * (3 * M.rowH) - 3, width: cw(1), height: 6, background: `linear-gradient(90deg, transparent, ${AMB}, transparent)`, boxShadow: `0 0 18px ${AMB}`, zIndex: 9}} /> : null}
            {[0, 1, 2].map(ring)}
            <Neon f={f} a={612} b={870} x={b5.x} y={b5.y} w={b5.w} h={b5.h} color={AMB} r={3} />
            {f >= 620 ? <div style={{position: "absolute", left: colLeft(2) - 70, top: b5.y - 2, opacity: prog(f, 620, 640), padding: "0 10px", height: 28, borderRadius: 14, background: AMB, color: "#1C1100", fontFamily: MONO, fontWeight: 800, fontSize: 18, lineHeight: "28px", zIndex: 10}}>Row # 4</div> : null}
            <Neon f={f} a={700} b={1199} x={colLeft(0)} y={ry(2)} w={cw(0)} h={9 * M.rowH} color={BLU} r={3} />
            <Neon f={f} a={780} b={1199} x={colLeft(0)} y={ry(5)} w={cw(0)} h={M.rowH} color={BLU} r={3} />
            {f >= 780 ? <div style={{position: "absolute", left: colLeft(0) + 0, top: ry(5) + 12, width: M.w - colLeft(0), height: 2, background: `linear-gradient(90deg, ${BLU}, transparent)`, opacity: 0.6 * prog(f, 780, 810) * (1 - prog(f, 1000, 1030)), zIndex: 8}} /> : null}
            {link > 0 ? (
              <svg width={M.w} height={WH} style={{position: "absolute", left: 0, top: 0, zIndex: 11, pointerEvents: "none"}}>
                <defs><linearGradient id="lg1" x1="0" x2="1"><stop offset="0" stopColor={AMB} /><stop offset="1" stopColor={BLU} /></linearGradient></defs>
                <path d={`M ${ax} ${ry(5) + 12} C ${ax} ${ry(5) - 60}, ${bx} ${ry(5) - 60}, ${bx} ${ry(5) + 12}`} fill="none" stroke="url(#lg1)" strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-f * 3} opacity={link} style={{filter: `drop-shadow(0 0 8px ${EME})`}} />
                <circle r={9} fill={EME} cx={ax + (bx - ax) * dotT} cy={ry(5) + 12 - 48 * Math.sin(Math.PI * dotT)} style={{filter: `drop-shadow(0 0 10px ${EME})`}} />
              </svg>
            ) : null}
          </div>
        }
      />
      <Card f={f} a={176} b={444} x={1120} y={330} w={640} color={C.red} title="VLOOKUP limits">
        <Mono c="#FCA5A5" s={23}>✕ Looks only to the right of the key</Mono>
        <Mono c="#FCA5A5" s={23}>✕ Hard-coded column number</Mono>
      </Card>
      <Card f={f} a={840} b={1199} x={1000} y={380} w={800} color={EME} title="MATCH feeds INDEX">
        <Colored s={30} parts={[["=INDEX(", BLU], ["A2:A10", BLU], [",", "#fff"], ["MATCH(", AMB], ['"Cairo",B2:B10,0', AMB], [")", AMB], [")", BLU]]} />
        <div style={{display: "flex", gap: 24, marginTop: 10, fontFamily: MONO, fontSize: 21}}>
          <span style={{color: AMB}}>MATCH → 4</span><span style={{color: C.mute}}>→</span><span style={{color: BLU}}>INDEX → {NAMES[3]}</span>
        </div>
      </Card>
      <Keys f={f} a={582} b={632} keys={["Enter"]} press={600} />
      <Keys f={f} a={752} b={800} keys={["Enter"]} press={770} />
      <Click f={f} at={450} x={f2c.x} y={f2c.y} />
      <Click f={f} at={684} x={h2c.x} y={h2c.y} />
      <Cursor x={cur.x} y={cur.y} />
      <TopBadge f={f} a={60} b={540} ar="الثنائية المتقدمة لفك قيود البحث" en="INDEX & MATCH Dynamic Engine" />
      <Tag f={f} a={660} b={1140} color={AMB} text="MATCH ──► Finds Position (Row #) | INDEX ──► Fetches Value at Coordinates" />
    </div>
  );
};
const WH = 900;

/* ───────────────────────── SCENE 2: left lookup + insertion immunity ───────────────────────── */
const ANS = NAMES[IDS.indexOf(LOOKUP_ID)];
export const Scene2: React.FC<{f: number}> = ({f}) => {
  const ins = f >= 770;
  const F = "=INDEX(A2:A10,MATCH(E2,C2:C10,0))";
  const FI = "=INDEX(A2:A10,MATCH(H2,F2:F10,0))";
  const ft = typed(F, f, 80, 0.3);
  const done = f >= 335;
  // visible col -> data key (inserted layout shifts keys ≥2 by 3)
  const key = (c: number) => (!ins ? c : c < 2 ? c : c >= 5 ? c - 3 : -1);
  const flash = ins ? 0.35 * (1 - prog(f, 770, 900)) : 0;
  const resC = ins ? 8 : 5, inC = ins ? 7 : 4;
  const cell = (r: number, c: number): CellSty | undefined => {
    const k = key(c);
    if (k === -1) return r >= 1 && r <= 10 ? {bg: `rgba(16,185,129,${flash})`} : undefined;
    if (r === 1) {
      const h = ["Customer Name", "City", "Customer ID", "Sales", "Lookup ID", "Customer"][k];
      return h ? {text: h, bold: true, bg: k >= 4 ? "#E3F4EA" : HDR} : undefined;
    }
    if (r === 2 && k === 4) return {text: String(LOOKUP_ID), num: true, bold: true};
    if (r === 2 && k === 5) return f >= 335 ? {text: ANS, bold: true} : f >= 80 ? {text: ft, edit: true} : undefined;
    if (r >= 2 && r <= 10) {
      const i = r - 2;
      if (k === 0) return {text: NAMES[i]};
      if (k === 1) return {text: CITIES[i]};
      if (k === 2) return {text: String(IDS[i]), num: true};
      if (k === 3) return {text: fmt(SALES[i]), num: true};
    }
    return undefined;
  };
  let sel: Sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  if (f >= 70) sel = {r1: 2, c1: 5, r2: 2, c2: 5};
  const colSel = prog(f, 650, 690);
  if (f >= 640 && f < 790) sel = {r1: 1, c1: 2, r2: 24, c2: 2 + Math.round(2 * colSel), t: 1};
  if (f >= 790) sel = {r1: 2, c1: 8, r2: 2, c2: 8};
  const editing = f >= 80 && f < 335;
  const formula = f < 80 ? "" : f < 335 ? ft : f < 790 ? F : FI;
  const nameBox = f < 70 ? "A1" : f < 640 ? "F2" : f < 790 ? "C:E" : "I2";
  const f2c = ctr(R1, 2, 5);
  const hdrC = toStage({x: cx(2), y: GRID_Y - 12}), hdrE = toStage({x: cx(4), y: GRID_Y - 12});
  const ctxP = {x: hdrE.x + 40, y: hdrE.y + 30};
  const insP = {x: ctxP.x + 70, y: ctxP.y + 5 * 28 + 14};
  const pts: Pt[] = [{f: 0, x: 1500, y: 640}, {f: 70, x: f2c.x, y: f2c.y}, {f: 340, x: f2c.x + 40, y: f2c.y + 90}, {f: 628, x: hdrC.x, y: hdrC.y}, {f: 652, x: hdrC.x, y: hdrC.y}, {f: 690, x: hdrE.x, y: hdrE.y}, {f: 706, x: ctxP.x + 40, y: ctxP.y + 20}, {f: 742, x: insP.x, y: insP.y}, {f: 800, x: insP.x + 120, y: insP.y + 120}];
  const cur = pathAt(f, pts);
  const menu = ["Cut", "Copy", "Paste Options:", "Paste Special…", "Insert", "Delete", "Clear Contents", "Format Cells…"];
  const xa = cx(2), xb = cx(0), yb = ry(11) + 30;
  const pass = prog(f, 350, 420);
  const idxR = ins ? 8 : 5;
  void idxR; void resC; void inC;
  const rA = ins ? {a: 0, id: 5} : {a: 0, id: 2};
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={nameBox} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            {f >= 90 && f < 340 ? <Neon f={f} a={90} b={340} x={colLeft(rA.a)} y={ry(2)} w={cw(0)} h={9 * M.rowH} color={BLU} r={3} /> : null}
            {f >= 150 && f < 340 ? <Neon f={f} a={150} b={340} x={colLeft(2)} y={ry(2)} w={cw(2)} h={9 * M.rowH} color={AMB} r={3} /> : null}
            <Neon f={f} a={190} b={335} x={0} y={ry(0) - 0} w={0} h={0} color={EME} />
            {f >= 350 && f < 640 ? (
              <svg width={M.w} height={WH} style={{position: "absolute", left: 0, top: 0, zIndex: 11, pointerEvents: "none", opacity: vis(f, 350, 640, 16)}}>
                <path d={`M ${xa} ${ry(11)} Q ${(xa + xb) / 2} ${yb + 70} ${xb + 14} ${ry(11)}`} fill="none" stroke={EME} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-f * 4} style={{filter: `drop-shadow(0 0 10px ${EME})`}} strokeLinecap="round" />
                <path d={`M ${xb + 14} ${ry(11)} l 4 18 l -22 -10 z`} fill={EME} transform={`rotate(-20 ${xb + 14} ${ry(11)})`} />
                <circle r={9} fill="#fff" cx={xa + (xb - xa) * pass} cy={ry(11) + 52 * Math.sin(Math.PI * pass)} style={{filter: `drop-shadow(0 0 10px ${EME})`}} />
                <text x={xa} y={ry(11) + 32} textAnchor="middle" fill={AMB} fontFamily={MONO} fontSize={18} fontWeight={700}>key (C)</text>
                <text x={xb} y={ry(11) + 32} textAnchor="middle" fill={BLU} fontFamily={MONO} fontSize={18} fontWeight={700}>return (A)</text>
              </svg>
            ) : null}
            {f >= 700 && f < 748 ? (
              <div style={{position: "absolute", left: ctxP.x - M.x, top: ctxP.y - M.y, width: 210, background: "#fff", border: "1px solid #8A8A8A", boxShadow: "0 8px 22px rgba(0,0,0,.35)", zIndex: 12, padding: "4px 0", fontFamily: FONT_AR}}>
                {menu.map((m, i) => <div key={m} style={{height: 28, padding: "0 14px", fontSize: 15, lineHeight: "28px", background: i === 4 && f >= 728 ? "#CDE8F7" : "transparent", color: "#1B1B1B", fontWeight: i === 4 && f >= 728 ? 700 : 400}}>{m}</div>)}
              </div>
            ) : null}
            {ins ? <Neon f={f} a={776} b={1010} x={colLeft(0)} y={ry(2)} w={cw(0)} h={9 * M.rowH} color={EME} r={3} /> : null}
            {ins ? <Neon f={f} a={776} b={1010} x={colLeft(5)} y={ry(2)} w={cw(5)} h={9 * M.rowH} color={EME} r={3} /> : null}
          </div>
        }
      />
      <Card f={f} a={780} b={1015} x={560} y={650} w={760} color={EME} title="Structural Shield  ✓">
        <Mono c="#A7F3D0" s={24}>+3 columns inserted — formula updated itself</Mono>
        <Mono c="#6EE7B7" s={28}>{FI}</Mono>
        <Mono c="#fff" s={24}>→ {ANS}</Mono>
      </Card>
      <Card f={f} a={1015} b={1348} x={560} y={640} w={800} color={C.red} title="VLOOKUP  vs  INDEX & MATCH">
        <Mono c="#FCA5A5" s={22}>VLOOKUP(E2,C2:D10,2,0)</Mono>
        <Mono c="#FCA5A5" s={20}>insert a column between C and D → the hard-coded 2</Mono>
        <Mono c="#FCA5A5" s={20}>now returns the wrong column</Mono>
        <div style={{height: 10}} />
        <Mono c="#6EE7B7" s={22}>INDEX/MATCH ranges move with their columns ✓</Mono>
      </Card>
      <Keys f={f} a={316} b={352} keys={["Enter"]} press={335} />
      <Click f={f} at={652} x={hdrC.x} y={hdrC.y} />
      <Click f={f} at={745} x={insP.x} y={insP.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={60} b={600} color={EME} text="Left-Lookup Freedom ──► INDEX(Return_Range, MATCH(Lookup_Key, Lookup_Range, 0))" />
      <Tag f={f} a={720} b={1260} color={EME} text="Column Insertion Proof ──► Dynamic Range References Never Break Upon Inserting Columns" />
    </div>
  );
};

/* ───────────────────────── SCENE 3: 2D crosshair ───────────────────────── */
export const Scene3: React.FC<{f: number}> = ({f}) => {
  const FM = "=INDEX(B2:G7,MATCH(I2,A2:A7,0),MATCH(J2,B1:G1,0))";
  const ft = typed(FM, f, 100, 0.21);
  const n = ft.length;
  const month = f >= 945 ? "June" : f >= 920 ? typed("June", f, 920, 0.25) : "March";
  const product = f >= 1085 ? "Product D" : f >= 1050 ? typed("Product D", f, 1050, 0.3) : "Product A";
  const colPos = keyv(f, [[0, 3], [945, 3], [975, 6]]);
  const rowPos = keyv(f, [[0, 1], [1085, 1], [1115, 4]]);
  const cp = f >= 975 ? 6 : 3, rp = f >= 1115 ? 4 : 1;
  const val = MATRIX[rp - 1][cp - 1];
  const entered = f >= 665;
  const cell = (r: number, c: number): CellSty | undefined => {
    if (r === 1) {
      if (c === 0) return {text: "Product", bold: true, bg: HDR};
      if (c >= 1 && c <= 6) return {text: MONTHS[c - 1], bold: true, bg: HDR, num: true};
      if (c === 8) return {text: "Product", bold: true, bg: "#E3F4EA"};
      if (c === 9) return {text: "Month", bold: true, bg: "#E3F4EA"};
      if (c === 10) return {text: "Sales (k EGP)", bold: true, bg: "#E3F4EA"};
      return undefined;
    }
    if (r === 2 && c === 8) return {text: product, bold: true, edit: f >= 1050 && f < 1085};
    if (r === 2 && c === 9) return {text: month, bold: true, edit: f >= 920 && f < 945};
    if (r === 2 && c === 10) return entered ? {text: String(val), num: true, bold: true, bg: "#D7F5E4"} : f >= 100 ? {text: ft, edit: true} : undefined;
    if (r >= 2 && r <= 7) {
      if (c === 0) return {text: PRODUCTS[r - 2]};
      if (c >= 1 && c <= 6) return {text: String(MATRIX[r - 2][c - 1]), num: true};
    }
    return undefined;
  };
  let sel: Sel = {r1: 2, c1: 10, r2: 2, c2: 10};
  if (f < 100) sel = {r1: 1, c1: 0, r2: 1, c2: 0};
  const editing = f >= 100 && f < 665;
  const formula = f < 100 ? "" : f < 665 ? ft : FM;
  const k2 = ctr(R1, 2, 10);
  const pts: Pt[] = [{f: 0, x: 1500, y: 700}, {f: 90, x: k2.x, y: k2.y}, {f: 700, x: k2.x - 40, y: k2.y + 60}, {f: 900, x: ctr(R1, 2, 9).x, y: ctr(R1, 2, 9).y}, {f: 1040, x: ctr(R1, 2, 8).x, y: ctr(R1, 2, 8).y}, {f: 1130, x: ctr(R1, 2, 8).x + 30, y: ctr(R1, 2, 8).y + 90}];
  const cur = pathAt(f, pts);
  // beams
  const bx = colLeft(colPos) + cw(0) / 2 * (colPos === 0 ? 1 : 0) + (colPos > 0 ? cw(1) / 2 : 0);
  const by = GRID_Y + rowPos * M.rowH + 12;
  const grow = prog(f, 668, 760);
  const endX = colLeft(6) + cw(6);
  const botY = GRID_Y + 6 * M.rowH + M.rowH;
  const hit = f >= 760;
  const showBeams = f >= 668 && f < 1340;
  const cellX = colLeft(colPos), cellY = GRID_Y + (rowPos - 0) * M.rowH;
  const dash = (x: string) => x;
  void dash;
  return (
    <div style={{position: "absolute", inset: 0}}>
      <ExcelWindow
        f={f} tab="Formulas" nameBox={f < 100 ? "A1" : "K2"} formula={formula} editing={editing}
        grid={<Grid rows={R1} cell={cell} sel={sel} f={f} />}
        overlays={
          <div style={{position: "absolute", inset: 0}}>
            {n >= 14 ? <Neon f={f} a={150} b={680} x={colLeft(1)} y={ry(2)} w={6 * 150} h={6 * M.rowH} color={BLU} r={3} /> : null}
            {n >= 34 ? <Neon f={f} a={250} b={680} x={colLeft(0)} y={ry(2)} w={cw(0)} h={6 * M.rowH} color={AMB} r={3} /> : null}
            {n >= 46 ? <Neon f={f} a={300} b={680} x={colLeft(1)} y={ry(1)} w={6 * 150} h={M.rowH} color={PUR} r={3} /> : null}
            {showBeams ? <div style={{position: "absolute", left: colLeft(0), top: by - 3, width: (endX - colLeft(0)) * grow, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${AMB}, ${AMB}AA)`, boxShadow: `0 0 18px ${AMB}`, zIndex: 9}} /> : null}
            {showBeams ? <div style={{position: "absolute", left: bx - 3, top: GRID_Y - M.hdrH, width: 6, height: (botY - GRID_Y + M.hdrH) * grow, borderRadius: 3, background: `linear-gradient(180deg, ${PUR}, ${PUR}AA)`, boxShadow: `0 0 18px ${PUR}`, zIndex: 9}} /> : null}
            {hit && showBeams ? <div style={{position: "absolute", left: bx - 30, top: by - 30, width: 60, height: 60, borderRadius: 30, border: `4px solid ${EME}`, boxShadow: `0 0 26px ${EME}, inset 0 0 18px ${EME}`, zIndex: 10, transform: `scale(${1 + 0.12 * Math.sin(f / 4)})`}} /> : null}
            {hit && showBeams ? <div style={{position: "absolute", left: cellX + 1, top: cellY - M.rowH + 1, width: cw(1) - 1, height: M.rowH - 1, background: "rgba(16,185,129,.35)", zIndex: 8}} /> : null}
            {hit && showBeams ? <div style={{position: "absolute", left: bx + 34, top: by - 46, padding: "2px 12px", borderRadius: 12, background: EME, color: "#032B1B", fontFamily: MONO, fontWeight: 800, fontSize: 22, zIndex: 11, opacity: prog(f, 760, 780)}}>{val}</div> : null}
            {f >= 400 ? <div style={{position: "absolute", left: colLeft(0), top: ry(9), opacity: vis(f, 400, 640, 12), display: "flex", gap: 20, zIndex: 8}}>
              <div style={{padding: "8px 16px", borderRadius: 10, background: "rgba(15,23,42,.94)", border: `2px solid ${AMB}`, fontFamily: MONO, color: AMB, fontSize: 20, fontWeight: 700}}>MATCH #1 → row {rp}</div>
              <div style={{padding: "8px 16px", borderRadius: 10, background: "rgba(15,23,42,.94)", border: `2px solid ${PUR}`, fontFamily: MONO, color: "#E9D5FF", fontSize: 20, fontWeight: 700, opacity: prog(f, 520, 540)}}>MATCH #2 → column {cp}</div>
            </div> : null}
          </div>
        }
      />
      <Card f={f} a={900} b={1350} x={1010} y={430} w={760} color={EME} title="No fixed index numbers">
        <Mono c="#A7F3D0" s={24}>Change Month or Product → beams re-aim</Mono>
        <Mono c="#fff" s={26}>{product} · {month} = {val}</Mono>
      </Card>
      <Keys f={f} a={645} b={690} keys={["Enter"]} press={665} />
      <Click f={f} at={92} x={k2.x} y={k2.y} />
      <Cursor x={cur.x} y={cur.y} />
      <Tag f={f} a={60} b={640} color={BLU} text="2D Two-Way Lookup ──► INDEX(Matrix, MATCH(Row), MATCH(Column))" />
      <Tag f={f} a={700} b={1250} color={PUR} text="Laser Precision ──► Dynamic Row & Column Intersection Without Fixed Index Numbers" />
    </div>
  );
};
export {colName, A as _A, EME as _E};
