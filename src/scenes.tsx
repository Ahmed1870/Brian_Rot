import React from 'react';
import {A} from './anchors';
import {ar, mono} from './fonts';
import {Chip, Cursor, DLGP, DPOS, FilterMenu, Grid, Logo, Menu, MI, P, P5W, PB, PVW, PivotOptDlg, Ring, Stage, TABX, Tag, Tip, TopBadge, Win, cellWin, clamp, colName, fade, kf, pls, setCols, useT, xOf} from './kit';
import {C, FILE, M, WIN, Z} from './theme';

const W8 = '#F8FAFC';
const GOLD = '#FBBF24';
const RED_T = '#FECACA', BLUE_T = '#BAE6FD', GREEN_T = '#BBF7D0', PURP_T = '#E9D5FF', HEAD_T = '#E2EFDA';
const GP = '=GETPIVOTDATA("Sales Amount",$A$3,"Branch",';
type HL = (number | string)[];
const pt = (t: number, k: [number, {x: number; y: number}][]) => ({
  x: kf(t, k.map((q) => [q[0], q[1].x] as [number, number])),
  y: kf(t, k.map((q) => [q[0], q[1].y] as [number, number])),
});
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.floor(s.length * clamp((t - a) / (b - a))));
const cfg0 = {fr: 0, fc: 0, sr: 1, sc: 0};
const cw = (c: number) => xOf(c + 1) - xOf(c);
const cellL = (r: number, c: number) => cellWin(cfg0, r, c, true);
const cellP = (r: number, c: number) => {
  const q = cellL(r, c);
  return P(q.x, q.y);
};
const corner = (r: number, c: number) => {
  const q = cellL(r, c);
  return P(q.x + cw(c) / 2 - 3, q.y + 8);
};
const a3btn = () => {
  const q = cellL(3, 0);
  return P(q.x + cw(0) / 2 - 11, q.y);
};
const FM = {x: 42, y: 262};
const fmItem = (i: number) => P(FM.x + 100, FM.y + 4 + 11 + i * 26);
const OM = () => ({x: PB.popt.x, y: PB.popt.y + PB.popt.h});
const omItem = (i: number) => P(OM().x + 80, OM().y + 4 + 11 + i * 22);
const optBtn = () => P(PB.popt.x + 50, PB.popt.y + 11);
const analyzeTab = () => P(TABX['PivotTable Analyze'].x + 52, 46);
const Hud: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 4, top: -24}}><Logo s={136} /></div>
    {children}
  </div>
);
type WB = {kind: string; selR: number; selC: number; formula: string; tab?: string; ctx?: boolean; rangeR?: number; over?: React.ReactNode; hl?: string};
const WinB: React.FC<WB> = (p) => (
  <Win {...WIN} title={`${FILE} - Excel`} tab={p.tab ?? 'Home'} ctx={p.ctx} hl={p.hl} sheets={[{n: 'Pivot'}, {n: 'Data'}]} act={0} nameBox={`${colName(p.selC)}${p.selR}`} formula={p.formula} over={p.over}>
    {({gw, gh}) => <Grid gw={gw} gh={gh} kind={p.kind} fr={0} fc={0} sr={1} sc={0} selR={p.selR} selC={p.selC} rangeR={p.rangeR} rangeC={p.selC} />}
  </Win>
);
const inPivot = (r: number, c: number) => c <= 1 && r >= 3 && r <= 9;
const kindOf = (k: string, sort: string, modes: string, flags: string, edit: string, hl: HL[]) => `${k}|${sort}|${modes}|${flags}|${edit}|${JSON.stringify(hl)}`;
const Note: React.FC<{text: string; c: string; a: number; y?: number; x?: number}> = ({text, c, a, y = 720, x = 960}) => <Chip x={x} y={y} center text={text} c={c} a={a} size={26} />;

/* ───────── SCENE 1 — =B4 breaks, GETPIVOTDATA holds ───────── */
export const Scene1: React.FC<{from: number}> = ({from}) => {
  setCols(PVW);
  const t = useT(from);
  const a = A[1];
  const sort = t >= 44.4 ? 'z' : t >= 32.3 ? 'a' : 'd';
  const GPF = GP + '"Cairo")';
  let modes = '-----', edit = '', formula = '';
  if (t >= 25.5 && t < 27.4) { const s = typed('=B4', t, 25.5, 27.2); edit = `E4,4:${s}`; formula = s; }
  else if (t >= 27.4 && t < 36.9) { const n = t < 28.6 ? 1 : t < 28.8 ? 2 : t < 29.0 ? 3 : t < 29.2 ? 4 : 5; modes = 'r'.repeat(n) + '-'.repeat(5 - n); formula = '=B4'; }
  else if (t >= 36.9 && t < 41.8) { const s = typed(GPF, t, 37.0, 41.6); modes = 'rrrrr'; edit = `E4,4:${s}`; formula = s; }
  else if (t >= 41.8) { modes = 'grrrr'; formula = GPF; }
  const hl: HL[] = [];
  if (t >= 16.5) hl.push([3, 3, 3, 4, HEAD_T]);
  for (let i = 0; i < 5; i++) {
    if (modes[i] === 'r' && t >= 32.5) hl.push([4 + i, 4, RED_T]);
    if (modes[i] === 'g') hl.push([4 + i, 4, BLUE_T]);
  }
  const menu = (t >= 31.1 && t < 32.4) || (t >= 43.2 && t < 44.6);
  const sel = menu ? [3, 0] : [4, 4];
  const ctx = inPivot(sel[0], sel[1]);
  const over = (
    <div>
      {menu && <FilterMenu x={FM.x} y={FM.y} hl={t < 40 ? (t >= 31.7 ? 0 : -1) : t >= 44.0 ? 1 : -1} ghost={0} />}
      {t >= 38.0 && t < 41.8 && <Tip x={cellL(4, 4).x - cw(4) / 2} y={cellL(4, 4).y + 10} text="GETPIVOTDATA(data_field, pivot_table, [field1, item1], ...)" />}
    </div>
  );
  const E4 = cellP(4, 4), h4 = corner(4, 4), h8 = corner(8, 4), A3 = a3btn();
  const cur = pt(t, [[0, {x: 1000, y: 520}], [24.6, {x: 1000, y: 520}], [24.7, E4], [27.9, E4], [28.0, h4], [29.4, h8], [30.8, A3], [31.1, A3], [31.7, fmItem(0)], [32.3, fmItem(0)], [36.4, E4], [36.5, E4], [43.0, A3], [43.3, A3], [44.0, fmItem(1)], [44.5, fmItem(1)], [46, {x: 1000, y: 520}]]);
  const rowTop = P(0, 180 + 20 + 40).y;
  return (
    <Stage>
      <WinB kind={kindOf('pv', sort, modes, t >= 16.5 ? 'hn' : '', edit, hl)} selR={sel[0]} selC={sel[1]} ctx={ctx} formula={menu ? 'Row Labels' : formula} over={over} rangeR={t >= 28.2 && t < 29.6 ? 8 : undefined} />
      <Ring x={P(M.rowW - 2, 0).x} y={rowTop - 2} w={(xOf(2) + 4) * Z} h={(7 * 20 + 4) * Z} c={C.blue} t={t} a={fade(t, a.pivot, 15.5)} r={8} />
      <Note text="PivotTable — Sum of Sales Amount by Branch" c={C.blue} a={fade(t, a.pivot, 15.5)} y={760} />
      <Note text="Custom financial report linked to the PivotTable" c={C.blue} a={fade(t, 16.8, 24.5)} y={760} />
      <Note text="⚠ Report now shows WRONG numbers (B4 moved)" c={C.red} a={fade(t, 33.0, 36.8)} y={760} />
      <Note text="✓ E4 stays correct: Cairo = 1,858,000" c={C.green} a={fade(t, 45.0, 49.0)} y={760} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[24.8, 28.1, 31.1, 32.3, 36.6, 43.3, 44.5]} />
      <Hud>
        <TopBadge text="الدرس 32 من 76 | ختام الوحدة 6 → Pivot Extraction & Security Engine" a={fade(t, 2, 18)} />
        <Tag text="Hardcoded Cell Failure → =B4 Breaks on Pivot Sort; GETPIVOTDATA Guarantees Data Accuracy" c={C.blue} a={fade(t, 27, 49)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 2 — dynamic argument linking ───────── */
export const Scene2: React.FC<{from: number}> = ({from}) => {
  setCols(PVW);
  const t = useT(from);
  const a = A[2];
  const sort = t >= 75.4 ? 'a' : 'd';
  let text = GP + 'D4)';
  const editing = t >= 58.4 && t < 64.0;
  if (t < 60.6) text = GP + '"Cairo")';
  else if (t < 61.8) { const rem = Math.max(0, 7 - Math.floor((7 * (t - 60.6)) / 1.1)); text = GP + '"Cairo"'.slice(0, rem) + ')'; }
  else if (t < 62.9) text = GP + ')';
  const n = t < 66.8 ? 1 : t < 67.4 ? 1 : t < 67.9 ? 2 : t < 68.3 ? 3 : t < 68.7 ? 4 : 5;
  const modes = 'g'.repeat(n) + '-'.repeat(5 - n);
  const hl: HL[] = [[3, 3, 3, 4, HEAD_T]];
  for (let i = 0; i < n; i++) hl.push([4 + i, 4, t >= 69.0 ? GREEN_T : BLUE_T]);
  if (editing && t >= 62.9) hl.push([4, 3, BLUE_T]);
  const menu = t >= 73.6 && t < 75.4;
  const sel = menu ? [3, 0] : [4, 4];
  const over = menu ? <FilterMenu x={FM.x} y={FM.y} hl={t >= 74.8 ? 0 : -1} ghost={0} /> : null;
  const E4 = cellP(4, 4), D4 = cellP(4, 3), h4 = corner(4, 4), h8 = corner(8, 4), A3 = a3btn();
  const cur = pt(t, [[51.4, {x: 1000, y: 520}], [58.0, E4], [58.4, E4], [62.4, D4], [62.9, D4], [66.3, h4], [66.8, h4], [69.0, h8], [73.0, A3], [73.6, A3], [74.8, fmItem(0)], [75.4, fmItem(0)], [77, {x: 1000, y: 520}]]);
  const f = t < 58.4 ? GP + '"Cairo")' : editing ? text : GP + 'D4)';
  return (
    <Stage>
      <WinB kind={kindOf('pv', sort, modes, 'hn', editing ? `E4,4:${text}` : '', hl)} selR={sel[0]} selC={sel[1]} ctx={inPivot(sel[0], sel[1])} formula={menu ? 'Row Labels' : f} over={over} rangeR={t >= 66.8 && t < 69.2 ? 8 : undefined} />
      <Ring x={E4.x - 85} y={E4.y - 16} w={170} h={32} c={C.amber} t={t} a={fade(t, a.hard, 60.5)} r={6} />
      <Note text={'Hardcoded text "Cairo" → change one branch only'} c={C.amber} a={fade(t, a.hard, 60.5)} y={760} />
      <Note text="Cell reference D4 instead of text" c={C.blue} a={fade(t, 62.4, 66.5)} y={760} />
      <Note text="Auto-fill → every branch updates ✓" c={C.green} a={fade(t, a.spill - 0.4, 73)} y={760} />
      <Note text="Report stays correct after sorting the PivotTable" c={C.green} a={fade(t, 75.8, 83.5)} y={760} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[58.4, 62.9, 66.8, 73.6, 75.4]} />
      <Hud>
        <Tag text={'Dynamic Syntax → =GETPIVOTDATA("Sales Amount", $A$3, "Branch", D4)'} c={C.blue} a={fade(t, 52, 70)} />
        <Tag text="Dynamic Linking → Replace Hardcoded Strings with Cell References for Auto-Fill Capability" c={C.green} a={fade(t, 71, 84.6)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 3 — Generate GetPivotData toggle ───────── */
export const Scene3: React.FC<{from: number}> = ({from}) => {
  setCols(PVW);
  const t = useT(from);
  const a = A[3];
  let sel = [4, 4];
  if (t >= 88.3 && t < 92.7) sel = [4, 6];
  else if (t >= 92.7 && t < 101.0) sel = [5, 1];
  else if (t >= 101.0 && t < 104.5) sel = [4, 6];
  else if (t >= 104.5 && t < 108.4) sel = [5, 1];
  else if (t >= 108.4) sel = [4, 6];
  const ctx = inPivot(sel[0], sel[1]);
  const analyze = ctx && ((t >= 94.1 && t < 101.0) || (t >= 105.5 && t < 108.4));
  let edit = '';
  if (t >= 88.9 && t < 90.1) edit = 'E4,6:=';
  else if (t >= 90.1 && t < 92.6) edit = `E4,6:${GP}"Cairo")`;
  else if (t >= 101.8 && t < 102.6) edit = 'E4,6:=';
  else if (t >= 102.6 && t < 104.0) edit = 'E4,6:=B4';
  else if ((t >= 104.0 && t < 109.0)) edit = 'V4,6:1,858,000';
  else if (t >= 109.0 && t < 109.4) edit = 'E4,6:=';
  else if (t >= 109.4 && t < 111.6) edit = `E4,6:${GP}"Cairo")`;
  else if (t >= 111.6) edit = 'V4,6:1,858,000';
  const hl: HL[] = [[3, 3, 3, 4, HEAD_T]];
  if (edit === 'E4,6:=B4') hl.push([4, 6, PURP_T]);
  const m1 = t >= 96.0 && t < 98.2, m2 = t >= 106.0 && t < 107.9;
  const on = m1 ? t < 97.9 : t >= 107.3;
  const items: MI[] = [{l: 'Options…', hl: false}, {l: 'Show Report Filter Pages…'}, {l: 'Generate GetPivotData', chk: on, hl: (m1 && t >= 97.0) || (m2 && t >= 106.9)}];
  const over = (m1 || m2) ? <Menu x={OM().x} y={OM().y} w={232} items={items} /> : null;
  const G4 = cellP(4, 6), B4 = cellP(4, 1), B5 = cellP(5, 1);
  const cur = pt(t, [[86, {x: 1000, y: 520}], [87.9, G4], [88.3, G4], [89.7, B4], [90.1, B4], [92.7, B5], [92.9, B5], [93.9, analyzeTab()], [94.1, analyzeTab()], [95.8, optBtn()], [96.0, optBtn()], [97.2, omItem(2)], [97.9, omItem(2)], [100.7, G4], [101.0, G4], [102.5, B4], [102.6, B4], [104.5, B5], [104.6, B5], [105.4, analyzeTab()], [105.5, analyzeTab()], [105.9, optBtn()], [106.0, optBtn()], [107.2, omItem(2)], [107.3, omItem(2)], [108.3, G4], [108.4, G4], [109.3, B4], [109.4, B4], [112, {x: 1000, y: 520}]]);
  const formula = edit.startsWith('E4,6:') ? edit.slice(5) : edit.startsWith('V') ? edit.slice(5) : sel[0] === 5 ? '1,265,000' : '';
  const toggled = t >= 97.9 && t < 107.3;
  return (
    <Stage>
      <WinB kind={kindOf('pv', 'd', 'ggggg', 'hn', edit, hl)} selR={sel[0]} selC={sel[1]} ctx={ctx} tab={analyze ? 'PivotTable Analyze' : 'Home'} hl={m1 || m2 ? 'popt' : undefined} formula={formula} over={over} />
      <Note text="Clicking a pivot cell auto-writes a LONG GETPIVOTDATA formula" c={C.amber} a={fade(t, 90.4, 92.6)} y={760} />
      <Note text="Generate GetPivotData: OFF  ◯" c={C.purple} a={fade(t, 98.3, 104.2)} y={760} />
      <Note text="=B4 — plain cell reference" c={C.purple} a={fade(t, 102.8, 105)} y={700} />
      <Note text="Generate GetPivotData: ON  ●  → full syntax again" c={C.blue} a={fade(t, 107.6, 114)} y={760} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[88.3, 90.1, 92.9, 94.1, 96.0, 97.9, 101.0, 102.6, 104.6, 105.5, 106.0, 107.3, 108.4, 109.4]} />
      <Hud>
        <Tag text="Feature Control → PivotTable Analyze → Options → Uncheck Generate GetPivotData" c={C.purple} a={fade(t, 93.5, 104)} />
        <Tag text="Formula Writing Flexibility → Toggle Between Automatic Full Syntax and Standard Cell Referencing" c={C.purple} a={fade(t, 105, 114.6)} />
        {toggled && <div />}
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 4 — pivot security & cache hygiene ───────── */
export const Scene4: React.FC<{from: number}> = ({from}) => {
  setCols(PVW);
  const t = useT(from);
  const a = A[4];
  const dlg = t >= 120.6 && t < 137.7;
  const details = t < 126.3, save = t < 128.8;
  const retain = t >= 133.8 ? 'None' : 'Automatic';
  const ddOpen = t >= 131.8 && t < 133.9;
  const fm1 = t >= 137.9 && t < 140.3, fm2 = t >= 142.0 && t < 146.6;
  const ghost = fm1 ? 1 : fm2 ? kf(t, [[142.4, 1], [143.2, 0]]) : 1;
  const fmOpen = fm1 || fm2;
  const om = t >= 119.0 && t < 120.6;
  const sel = fmOpen ? [3, 0] : [4, 1];
  const items: MI[] = [{l: 'Options…', hl: t >= 119.9}, {l: 'Show Report Filter Pages…'}, {l: 'Generate GetPivotData', chk: true}];
  const over = (
    <div>
      {om && <Menu x={OM().x} y={OM().y} w={232} items={items} />}
      {fmOpen && <FilterMenu x={FM.x} y={FM.y} hl={-1} ghost={ghost} />}
    </div>
  );
  const D = (k: keyof typeof DPOS) => DLGP(DPOS[k].x, DPOS[k].y);
  const refresh = P(PB.refresh.x + 25, PB.refresh.y + 30);
  const A3 = a3btn();
  const cur = pt(t, [[116.6, {x: 1000, y: 560}], [118.4, optBtn()], [119.0, optBtn()], [119.9, omItem(0)], [120.5, omItem(0)], [122.0, D('tabData')], [123.5, D('tabData')], [125.9, D('details')], [126.3, D('details')], [128.4, D('save')], [128.8, D('save')], [131.4, D('dd')], [131.8, D('dd')], [133.1, D('ddNone')], [133.8, D('ddNone')], [137.0, D('ok')], [137.5, D('ok')], [137.8, A3], [137.9, A3], [140.5, refresh], [140.8, refresh], [141.8, A3], [142.0, A3], [146.7, {x: 1000, y: 560}]]);
  const hl: HL[] = [[3, 3, 3, 4, HEAD_T]];
  return (
    <Stage>
      <WinB kind={kindOf('pv', 'd', 'ggggg', 'hn', '', hl)} selR={sel[0]} selC={sel[1]} ctx tab="PivotTable Analyze" hl={om ? 'popt' : t >= 140.6 && t < 141.4 ? 'refresh' : undefined} formula={sel[0] === 3 ? 'Row Labels' : '1,858,000'} over={over} />
      {dlg && <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, background: 'rgba(0,0,0,.38)', zIndex: 40, borderRadius: 10}} />}
      {dlg && <PivotOptDlg tab={t >= 123.5 ? 4 : 0} save={save} details={details} refresh={false} retain={retain} ddOpen={ddOpen} ddHl={t >= 133.2 ? 1 : 0} okHl={t >= 137.3} ring={t >= 126.4 && t < 131 ? 'details' : t >= 133.9 && t < 138 ? 'dd' : ''} ringC={t < 133 ? C.red : C.green} />}
      <Chip x={1340} y={430} text="Drill-Down leak BLOCKED" c={C.red} a={fade(t, 127.0, 131.5)} size={26} />
      <Chip x={1340} y={520} text="Smaller file · source not stored" c={C.amber} a={fade(t, 128.9, 131.5)} size={24} />
      <Chip x={1340} y={610} text="Ghost items purged on refresh" c={C.green} a={fade(t, 134.0, 138.2)} size={24} />
      <Note text="Deleted items still listed: Luxor, Tanta (ghost items)" c={C.amber} a={fade(t, 138.2, 140.3)} y={760} x={1180} />
      <Note text="Refresh PivotTable" c={C.blue} a={fade(t, 140.9, 141.9)} y={760} x={1180} />
      <Note text="Ghost items purged ✓ — clean filter list" c={C.green} a={fade(t, 143.4, 148.6)} y={760} x={1180} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[119.0, 120.5, 123.5, 126.3, 128.8, 131.8, 133.8, 137.5, 137.9, 140.8, 142.0]} />
      <Hud>
        <Tag text="Data Leak Prevention → PivotTable Options → Data → Uncheck Enable show details" c={C.red} a={fade(t, 118, 133)} />
        <Tag text="Filter Hygiene → Number of items to retain per field → None (Purges Deleted Ghost Items)" c={C.green} a={fade(t, 134, 149.6)} />
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 5 — 50,000 rows ───────── */
export const Scene5: React.FC<{from: number}> = ({from}) => {
  setCols(P5W);
  const t = useT(from);
  const a = A[5];
  const GPS = GP + 'E4)';
  const GPP = '=GETPIVOTDATA("Profit",$A$3,"Branch",E4)';
  const nf = t < 169.0 ? 1 : t < 169.4 ? 2 : t < 169.7 ? 3 : t < 170.0 ? 4 : 5;
  const ng = t < 174.2 ? 1 : t < 174.6 ? 2 : t < 174.9 ? 3 : t < 175.2 ? 4 : 5;
  const fOn = t >= 168.6, gOn = t >= 173.8;
  const mf = fOn ? 'g'.repeat(nf) + '-'.repeat(5 - nf) : '-----';
  const mg = gOn ? 'g'.repeat(ng) + '-'.repeat(5 - ng) : '-----';
  let edit = '', formula = '';
  if (t >= 165.2 && t < 168.6) { const s = typed(GPS, t, 165.2, 168.4); edit = `E4,5:${s}`; formula = s; }
  else if (t >= 168.6 && t < 170.3) formula = GPS;
  else if (t >= 170.4 && t < 173.8) { const s = typed(GPP, t, 170.4, 173.6); edit = `E4,6:${s}`; formula = s; }
  else if (t >= 173.8) formula = GPP;
  const hl: HL[] = t >= 161.5 ? [[3, 4, 3, 6, HEAD_T]] : [];
  for (let i = 0; i < 5; i++) {
    if (mf[i] === 'g') hl.push([4 + i, 5, t >= 175.6 ? GREEN_T : BLUE_T]);
    if (mg[i] === 'g') hl.push([4 + i, 6, t >= 175.6 ? GREEN_T : BLUE_T]);
  }
  const selC = t >= 170.3 ? 6 : 5;
  const F4 = cellP(4, 5), G4 = cellP(4, 6), hF4 = corner(4, 5), hF8 = corner(8, 5), hG4 = corner(4, 6), hG8 = corner(8, 6);
  const cur = pt(t, [[150.4, {x: 1100, y: 640}], [164.9, F4], [165.0, F4], [168.9, hF4], [170.1, hF8], [170.3, G4], [170.4, G4], [174.1, hG4], [175.3, hG8], [176, {x: 1100, y: 640}]]);
  const sealP = kf(t, [[176.2, 0], [177.1, 1]]);
  const sealA = clamp(sealP) * clamp((183.6 - t) / 0.5);
  const load = fade(t, 150.8, 158.2, 0.4);
  return (
    <Stage>
      <WinB kind={kindOf('p5', 'd', `${mf};${mg}`, t >= 161.5 ? 'hn' : '', edit, hl)} selR={4} selC={selC} formula={formula} rangeR={(t >= 168.9 && t < 170.3) || (t >= 174.1 && t < 175.5) ? 8 : undefined} />
      <Ring x={P(235, 3).x} y={P(235, 3).y} w={330 * Z} h={26 * Z} c={C.green} t={t} a={fade(t, a.file - 0.3, 166)} />
      <Note text="50,000 data rows → PivotTable summary" c={C.green} a={fade(t, a.fifty - 0.3, 168.4)} y={760} />
      <Note text="Dynamic link — no hard-coded cells" c={C.green} a={fade(t, 169.2, 172.4)} y={760} />
      <Note text="Profit report via GETPIVOTDATA" c={C.blue} a={fade(t, 174.6, 177.6)} y={760} />
      <Note text="Secure cache: Enable show details OFF · Retain items None" c={C.amber} a={fade(t, 178.0, 183.4)} y={760} />
      <Cursor x={cur.x} y={cur.y} t={t} left={[165.0, 168.9, 170.4, 174.1]} />
      {load > 0.01 && (
        <div style={{position: 'absolute', left: 560, top: 400, width: 800, height: 220, opacity: load, borderRadius: 20, background: 'rgba(15,23,42,.96)', border: `3px solid ${C.blue}`, boxShadow: `0 0 30px ${C.blue}66`, zIndex: 60, fontFamily: ar, color: W8, textAlign: 'center', paddingTop: 36, boxSizing: 'border-box'}}>
          <div style={{fontSize: 38, fontWeight: 700, direction: 'ltr'}}>Loading {FILE}</div>
          <div style={{fontSize: 28, color: C.dim, marginTop: 6}}>50,000 rows</div>
          <div style={{margin: '24px 60px 0', height: 14, background: '#334155', borderRadius: 7}}><div style={{width: `${kf(t, [[151.2, 0], [157.6, 100]])}%`, height: 14, background: C.blue, borderRadius: 7}} /></div>
        </div>
      )}
      <Hud>
        <Tag text="Enterprise Pivot Extraction → Dynamic Financial Statement Linking Across 50,000 Sales Rows" c={C.blue} a={fade(t, 152, 167)} />
        <Tag text="Zero Data Leaks → Secure Cache Settings & Dynamic GETPIVOTDATA Execution" c={C.green} a={fade(t, 168, 183.4)} />
        {sealA > 0.01 && (
          <div style={{position: 'absolute', left: 1450, top: 470, width: 420, height: 420, opacity: sealA, transform: `scale(${0.5 + 0.5 * clamp(sealP)})`, zIndex: 80}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, #065F46 0%, #0F172A 72%)', border: `6px solid ${C.green}`, boxShadow: `0 0 ${40 + 26 * pls(t, 1.6)}px ${C.green}`}} />
            <div style={{position: 'absolute', inset: 24, borderRadius: '50%', border: `2px dashed ${C.green}`, transform: `rotate(${(t - 176) * 30}deg)`}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', fontSize: 110, color: C.green, lineHeight: '110px'}}>✓</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 195, textAlign: 'center', fontFamily: ar, fontWeight: 700, fontSize: 32}}>Enterprise Pivot Security</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 245, textAlign: 'center', fontFamily: ar, fontWeight: 600, fontSize: 28, color: '#6EE7B7'}}>Zero Data Leaks</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 305, textAlign: 'center', fontFamily: mono, fontSize: 21, color: C.dim}}>{FILE}</div>
          </div>
        )}
      </Hud>
    </Stage>
  );
};

/* ───────── SCENE 6 — lesson 32 / unit 6 complete ───────── */
export const Scene6: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[6];
  const pop = (s: number) => {
    const p = clamp((t - s) / 0.6);
    return {opacity: p, transform: `translateY(${(1 - p) * 26}px)`};
  };
  const prog = kf(t, [[185.6, 0], [189.0, 42.1]]);
  const skills = ['GETPIVOTDATA — stays correct when the PivotTable changes', 'Dynamic argument linking — cell reference + auto-fill', 'Generate GetPivotData toggle — full syntax or =B4', 'Pivot security — Enable show details OFF, Retain items None'];
  const out = clamp((t - 231.1) / 8.9);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 80, top: 110, width: 1760, height: 860, borderRadius: 32, background: 'rgba(30,41,59,.78)', border: '2px solid rgba(148,163,184,.35)', boxShadow: '0 30px 90px rgba(0,0,0,.5)', fontFamily: ar, color: W8, ...pop(a.great - 0.2)}}>
        <div style={{position: 'absolute', left: 60, top: 50, display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{margin: '-56px -44px'}}><Logo s={230} /></div>
          <div>
            <div dir="rtl" style={{fontSize: 52, fontWeight: 700, whiteSpace: 'nowrap'}}>منظومة أكاديمي | Manzooma Excel Masterclass</div>
            <div style={{fontSize: 28, color: C.dim, marginTop: 4}}>Excel From Zero to Professional — Unit 6: Pivot Tables & Aggregation Engine</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 240, width: 840, ...pop(a.skills)}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 18, background: 'rgba(56,189,248,.16)', border: `3px solid ${C.blue}`, boxShadow: `0 0 ${14 + 12 * pls(t, 1.8)}px ${C.blue}66`, fontSize: 30, fontWeight: 600, direction: 'ltr'}}>
            <span style={{fontSize: 40, color: C.blue}}>✓</span>Lesson 32 of 76 · Unit 6 Mastered (100% Complete)
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 360, width: 800, ...pop(a.skills + 0.4)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, color: C.dim, direction: 'ltr'}}><span>Course progress · lesson 32 of 76</span><span style={{color: W8, fontWeight: 700}}>{prog.toFixed(1)}%</span></div>
          <div style={{marginTop: 12, height: 26, borderRadius: 13, background: '#334155', overflow: 'hidden'}}><div style={{width: `${prog}%`, height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, boxShadow: `0 0 18px ${C.blue}`}} /></div>
          <div style={{display: 'flex', gap: 8, marginTop: 22, direction: 'ltr'}}>
            {Array.from({length: 14}, (_, i) => <div key={i} style={{flex: 1, height: 16, borderRadius: 5, background: i < 6 && t >= 189.4 + 0.25 * i ? C.blue : '#334155', boxShadow: i < 6 && t >= 189.4 + 0.25 * i ? `0 0 10px ${C.blue}` : 'none'}} />)}
          </div>
          <div style={{fontSize: 22, color: C.dim, marginTop: 8, direction: 'ltr'}}>Units completed: 6 of 14</div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 560, width: 840, direction: 'ltr'}}>
          {skills.map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 25, margin: '0 0 18px', ...pop(a.skills + 1.2 + i * 0.7)}}>
              <span style={{width: 36, height: 36, borderRadius: 18, background: C.blue, color: '#0F172A', textAlign: 'center', lineHeight: '36px', fontWeight: 700, fontSize: 24, flex: 'none'}}>✓</span>{s}
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 940, top: 250, width: 760, height: 290, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.blue}`, padding: '28px 40px', boxSizing: 'border-box', direction: 'ltr', ...pop(a.down)}}>
          <div style={{fontSize: 30, color: C.dim}} dir="rtl">الملفات والتدريبات</div>
          <div style={{fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.blue, marginTop: 16}}>{FILE}</div>
          <div style={{fontFamily: mono, fontSize: 36, fontWeight: 700, color: W8, marginTop: 22, padding: '14px 18px', border: `2px dashed ${C.blue}`, borderRadius: 14, boxShadow: `0 0 ${10 + 14 * pls(t, 1.8)}px ${C.blue}55`}}>solutions.gomaaintelligence.me</div>
        </div>
        <div style={{position: 'absolute', left: 940, top: 580, width: 760, height: 270, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.purple}`, padding: '24px 40px', boxSizing: 'border-box', boxShadow: t >= a.next ? `0 0 ${12 + 12 * pls(t, 2.2)}px ${C.purple}66` : 'none', ...pop(a.next - 0.6)}}>
          <div dir="rtl" style={{fontSize: 28, color: C.dim}}>الدرس القادم — الوحدة 7 من 14</div>
          <div dir="rtl" style={{fontSize: 40, fontWeight: 700, marginTop: 8, lineHeight: '56px'}}>الدرس 33: القوائم الديناميكية والدوال المنسابة</div>
          <div style={{fontSize: 30, color: '#C4B5FD', marginTop: 8, direction: 'ltr', fontWeight: 600}}>Dynamic Arrays & Spilled Formulas →</div>
        </div>
      </div>
      <Hud />
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: out}} />
    </Stage>
  );
};
