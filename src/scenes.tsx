import React from 'react';
import {A} from './anchors';
import {ar, mono} from './fonts';
import {
  ArrangeDlg, Cam, Chip, ColorSub, Cursor, FreezeMenu, Grid, Keys, Logo, MENU_IH, Menu, P, Ring, SUB_H, SplitBars, SplitGrid, Stage, Tag, TopBadge, VB, TABX,
  Win, cellWin, clamp, cell, fade, formulaOf, gridTop, kf, pls, shRect, sheetY, useT, xOf, colName, WinProps, MI,
} from './kit';
import {C, FILE, M, WIN, Z} from './theme';

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const steps = (t: number, s: number[]) => s.filter((v) => t >= v).length;
const pt = (t: number, k: [number, {x: number; y: number}][]) => ({
  x: kf(t, k.map((q) => [q[0], q[1].x] as [number, number])),
  y: kf(t, k.map((q) => [q[0], q[1].y] as [number, number])),
});
const gx = (g: {fr: number; fc: number; sr: number; sc: number}, r: number, c: number, rb = true, win = WIN) => {
  const q = cellWin(g, r, c, rb);
  return P(q.x, q.y, win);
};
const Hud: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 4, top: -24}}><Logo s={136} /></div>
    {children}
  </div>
);

/* ───────────────────────── SCENE 1 — sheet tabs, Tab Color, Group Sheets ───────────────────────── */
export const Scene1: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[1];
  const names = ['Sales', 'Expenses', 'Summary'];
  const SY = sheetY(WIN.h);
  const r0 = shRect(names, 0), r1 = shRect(names, 1), r2 = shRect(names, 2);
  const tc = (r: {x: number; w: number}) => P(r.x + r.w / 2, SY + 14);
  const grouped = t >= 25.4 && t < 34.1;
  const m1 = t >= 16.35 && t < 19.2, m2 = t >= 20.35 && t < 22.0, m3 = t >= 31.85 && t < 34.1;
  const n = m3 ? 11 : 10;
  const mh = 8 + n * MENU_IH;
  const my = SY - mh;
  const mx = m2 ? r1.x : r0.x;
  const hov = m1 ? (t >= 17.2 ? 6 : -1) : m2 ? (t >= 21.0 ? 6 : -1) : t >= 33.2 ? 10 : -1;
  const sub = (m1 && t >= 17.6) || (m2 && t >= 21.1);
  const sw = m1 ? (t >= 18.7 ? 5 : -1) : t >= 21.6 ? 7 : -1;
  const items: MI[] = ['Insert…', 'Delete', 'Rename', 'Move or Copy…', 'View Code', 'Protect Sheet…', 'Tab Color', 'Hide', 'Unhide…', 'Select All Sheets', 'Ungroup Sheets'].slice(0, n).map((l, i) => ({l, sub: l === 'Tab Color', hl: i === hov}));
  const sheets = [{n: 'Sales', c: t >= 19.1 ? '#00B050' : undefined}, {n: 'Expenses', c: t >= 21.9 ? '#0070C0' : undefined}, {n: 'Summary'}];
  const item = (x0: number, i: number) => P(x0 + 60, my + 4 + i * MENU_IH + 11);
  const sub0 = SY - SUB_H;
  const S1 = P(r0.x + 170 + 8 + 5 * 18 + 8, sub0 + 158), S2 = P(r1.x + 170 + 8 + 7 * 18 + 8, sub0 + 158);
  const my3 = SY - (8 + 11 * MENU_IH);
  const I3 = P(r0.x + 60, my3 + 4 + 10 * MENU_IH + 11);
  const cur = pt(t, [
    [0, {x: 900, y: 700}], [15.4, tc(r0)], [16.3, tc(r0)], [17.2, item(r0.x, 6)], [17.9, item(r0.x, 6)], [18.8, S1], [19.1, S1],
    [19.9, tc(r1)], [20.35, tc(r1)], [21.0, item(r1.x, 6)], [21.4, item(r1.x, 6)], [21.8, S2], [22.0, S2],
    [22.9, tc(r0)], [23.4, tc(r0)], [24.35, tc(r1)], [25.4, tc(r2)], [26.5, {x: 900, y: 660}], [30.6, {x: 900, y: 660}],
    [31.8, tc(r0)], [33.2, I3], [34.1, I3], [35.5, {x: 900, y: 640}],
  ]);
  const gcfg = {fr: 0, fc: 0, sr: 1, sc: 0};
  const strip = {x: P(r0.x - 6, SY).x, y: P(0, SY).y, w: (r2.x + r2.w - r0.x + 12) * Z, h: 28 * Z};
  const over = (
    <div>
      {(m1 || m2 || m3) && <Menu x={mx} y={my} w={170} items={items} />}
      {sub && <ColorSub x={mx + 170} y={sub0} hover={sw} />}
    </div>
  );
  return (
    <Stage>
      <Cam t={t} k={[[0, 640, 780, 1.8], [24.0, 640, 780, 1.8], [25.4, 960, 540, 1], [30.0, 960, 540, 1], [31.2, 640, 780, 1.8], [36.0, 640, 780, 1.8], [37.6, 960, 540, 1]]}>
        <Win {...WIN} title={`${FILE} - Excel`} group={grouped} groupGlow={0.6 + 0.4 * pls(t)} tab="Home" sheets={sheets} act={0} sel={grouped ? [0, 1, 2] : [0]} nameBox="A1" formula="Branch" over={over}>
          {({gw, gh}) => <Grid gw={gw} gh={gh} kind="sales" {...gcfg} selR={1} selC={0} />}
        </Win>
        <Ring x={strip.x} y={strip.y} w={strip.w} h={strip.h} c={C.blue} t={t} a={fade(t, 2.2, 13.6) + fade(t, 22.2, 26.0)} />
        <Chip x={strip.x + strip.w / 2} y={strip.y - 74} center text="Sheet Tabs" c={C.blue} a={fade(t, 13.7, 16.1)} />
        <Ring x={P(235, 3).x} y={P(235, 3).y} w={300 * Z} h={26 * Z} c={C.blue} t={t} a={fade(t, 25.5, 31.0)} />
        <Chip x={960} y={170} center text="[Group] → edits apply to ALL 3 sheets" c={C.blue} a={fade(t, a.same - 0.4, 30.8)} />
        <Chip x={640} y={520} center text="⚠ Ungroup right after you finish" c={C.amber} a={fade(t, a.warn - 0.2, 34.0)} />
        <Cursor x={cur.x} y={cur.y} t={t} left={[19.1, 21.9, 23.4, 24.35, 25.4, 34.1]} right={[16.3, 20.35, 31.85]} />
      </Cam>
      <Hud>
        <TopBadge text="إدارة أوراق العمل والتحكم في النوافذ | Sheet & Window Controls" a={fade(t, 2, 18)} />
        <Tag text="Sheet Grouping: Hold Ctrl + Click Tabs → Edit Multiple Sheets Simultaneously" c={C.blue} a={fade(t, 22.5, 38)} />
        <Keys keys={['Ctrl', 'Click']} n={1} a={fade(t, 22.6, 25.9)} c={C.blue} />
      </Hud>
    </Stage>
  );
};

/* ───────────────────────── SCENE 2 — Freeze Panes ───────────────────────── */
export const Scene2: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[2];
  const tab = t < 54.6 ? 'Home' : 'View';
  const fr = t < 60.3 ? 0 : t < 64.4 ? 1 : t < 72.4 ? 0 : 1;
  const fc = t < 72.4 ? 0 : 2;
  const srRaw = kf(t, [[40, 1], [41.6, 1], [44.6, 4200], [51.0, 4200], [52.8, 1], [60.5, 1], [62.6, 1500], [63.0, 1500], [63.9, 1], [72.6, 1], [78.4, 1], [80.6, 3200]]);
  const sr = Math.max(srRaw, fr + 1);
  const sc = t < 80.6 ? fc : kf(t, [[80.6, 2], [82.4, 8]]);
  const c2 = t >= 67.5;
  const selR = c2 ? 2 : 1, selC = c2 ? 2 : 0;
  const lines = t >= 60.3 && t < 64.4 ? kf(t, [[60.3, 0], [60.8, 1]]) : t >= 72.4 ? kf(t, [[72.4, 0], [72.9, 1]]) : 0;
  const tint = t >= 72.8 ? kf(t, [[72.8, 0], [73.6, 1], [78.0, 1], [79.0, 0.3]]) : t >= 60.3 && t < 64.4 ? 0.5 : 0;
  const cfg = {fr, fc, sr, sc};
  const mF = t >= 57.0 && t < 60.4, mU = t >= 63.6 && t < 64.5;
  const fb = VB.frz;
  const menuHover = mF ? (t < 58.4 ? 0 : 1) : 0;
  const F = P(fb.x + fb.w / 2, fb.y + 33);
  const menuItem = (i: number) => P(fb.x + 120, 156 + i * 52 + 26);
  const V = P(TABX.View.x + 21, 46);
  const C2pos = gx({fr: 0, fc: 0, sr: 1, sc: 0}, 2, 2);
  const cur = pt(t, [
    [40, {x: 1300, y: 640}], [44, {x: 1100, y: 650}], [52.2, {x: 1100, y: 650}], [54.4, V], [55.9, F], [57.0, F], [58.5, menuItem(1)], [60.3, menuItem(1)], [61.0, {x: 1000, y: 620}],
    [63.3, {x: 1000, y: 620}], [63.55, F], [63.9, menuItem(0)], [64.4, menuItem(0)], [65.3, {x: 900, y: 520}], [67.4, C2pos], [69.0, {x: 1000, y: 700}], [85, {x: 1000, y: 700}],
  ]);
  const camP = {x: F.x, y: F.y + 110};
  const kR = steps(t, [61.2, 61.55, 61.9, 62.25]), kFf = steps(t, [71.1, 71.45, 71.8, 72.15]);
  const kn = t < 64 ? kR : kFf;
  const c2s = gx(cfg, 2, 2);
  const warn = t >= 46.0 && t < 50.6;
  const over = (
    <div>
      {(mF || mU) && <FreezeMenu x={fb.x} y={152} frozen={mU} hover={mU ? (t >= 63.9 ? 0 : -1) : menuHover} />}
    </div>
  );
  const topY = P(0, gridTop(true) + M.hdr).y;
  return (
    <Stage>
      <Cam t={t} k={[[40, 960, 540, 1], [54.8, 960, 540, 1], [55.9, camP.x, camP.y, 1.7], [60.6, camP.x, camP.y, 1.7], [61.2, 960, 540, 1], [63.2, 960, 540, 1], [63.6, camP.x, camP.y, 1.7], [64.6, camP.x, camP.y, 1.7], [65.4, 960, 540, 1]]}>
        <Win {...WIN} title={`${FILE} - Excel`} tab={tab} hl={mF || mU ? 'frz' : undefined} keytips={kn >= 1 && kn < 2} sheets={[{n: 'Sales', c: '#00B050'}, {n: 'Expenses', c: '#0070C0'}, {n: 'Summary'}]} act={0} nameBox={`${colName(selC)}${selR}`} formula={formulaOf('sales', selR, selC)} over={over}>
          {({gw, gh}) => <Grid gw={gw} gh={gh} kind="sales" {...cfg} selR={selR} selC={selC} glow={C.green} lines={lines} tint={tint} />}
        </Win>
        <Chip x={960} y={topY + 120} center text="⚠ Headers are gone — which column is this?" c={C.red} a={fade(t, 46.0, 50.6)} />
        {warn && <Ring x={P(40, gridTop(true) + M.hdr).x} y={topY - 4} w={1100 * Z} h={26} c={C.red} t={t} a={0.9} r={6} />}
        <Chip x={960} y={topY + 120} center text="Row 1 stays visible while you scroll" c={C.green} a={fade(t, 60.7, 63.4)} />
        <Chip x={1330} y={190} text="Shortcut for the same command" c={C.blue} a={fade(t, 61.0, 63.3)} />
        <Chip x={P(260, 0).x} y={P(0, gridTop(true) + M.hdr + 3).y} text="Row 1 frozen" c={C.green} a={fade(t, 73.0, 78.0)} size={24} />
        <Chip x={P(30, 0).x} y={P(0, gridTop(true) + 150).y} text="Cols A–B frozen" c={C.green} a={fade(t, 73.0, 78.0)} size={24} />
        <Chip x={c2s.x - 70} y={c2s.y - 95} text="▲ ABOVE" c={C.green} a={fade(t, a.every, 77.8)} size={24} />
        <Chip x={c2s.x - 270} y={c2s.y - 24} text="◀ LEFT" c={C.green} a={fade(t, a.every + 0.4, 77.8)} size={24} />
        <Cursor x={cur.x} y={cur.y} t={t} left={[54.5, 57.0, 60.3, 63.55, 64.4, 67.5]} />
      </Cam>
      <Hud>
        <Tag text="Freeze Panes Rule → Freezes Everything ABOVE and LEFT of Active Cell" c={C.green} a={fade(t, 42, 60)} />
        <Tag text="Active Cell [C2] → Locks Row 1 & Columns A, B" c={C.green} a={fade(t, 64, 82)} />
        <Keys keys={t < 64 ? ['Alt', 'W', 'F', 'R'] : ['Alt', 'W', 'F', 'F']} n={kn} a={fade(t, 61.0, 63.3) + fade(t, 70.9, 73.2)} c={C.green} />
      </Hud>
    </Stage>
  );
};

/* ───────────────────────── SCENE 3 — Split Window ───────────────────────── */
export const Scene3: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const cfg0 = {fr: 0, fc: 0, sr: 1, sc: 0};
  const E8 = t >= 90.6;
  const p = kf(t, [[93.9, 0], [94.9, 1]]);
  const split = t >= 94.9;
  const sx = kf(t, [[116.8, xOf(4)], [119.6, xOf(2)]]);
  const sy = kf(t, [[116.8, 140], [119.6, 80]]);
  const rb = kf(t, [[107.9, 8], [110.4, 49993]]);
  const cr = kf(t, [[111.6, 4], [113.4, 8], [114.5, 8], [115.8, 4]]);
  const sb = VB.split;
  const S = P(sb.x + 30, sb.y + 11);
  const handle = (x: number, y: number) => P(M.rowW + x + 3, gridTop(true) + M.hdr + y + 3);
  const H0 = handle(xOf(4), 140), H1 = handle(xOf(2), 80);
  const cur = pt(t, [
    [85, {x: 1000, y: 640}], [90.4, gx(cfg0, 8, 4)], [90.6, gx(cfg0, 8, 4)], [92.3, S], [93.8, S], [95.5, {x: 900, y: 700}], [116.0, H0], [116.8, H0], [119.6, H1], [120.6, {x: 900, y: 700}],
  ]);
  const camP = {x: S.x, y: S.y + 110};
  const gy0 = gridTop(true) + M.hdr;
  const ghh = WIN.h / Z - gridTop(true) - M.sheet - M.status - M.hdr;
  const bar = 6;
  const quad = [
    P(M.rowW + sx / 2, gy0 + sy / 2), P(M.rowW + sx + bar + (1150 - M.rowW - M.sb - sx) / 2, gy0 + sy / 2),
    P(M.rowW + sx / 2, gy0 + sy + bar + (ghh - sy) / 2), P(M.rowW + sx + bar + (1150 - M.rowW - M.sb - sx) / 2, gy0 + sy + bar + (ghh - sy) / 2),
  ];
  return (
    <Stage>
      <Cam t={t} k={[[85, 960, 540, 1], [91.6, 960, 540, 1], [92.4, camP.x, camP.y, 1.7], [95.0, camP.x, camP.y, 1.7], [95.8, 960, 540, 1]]}>
        <Win {...WIN} title={`${FILE} - Excel`} tab="View" hl={t > 92.6 && t < 94.4 ? 'split' : undefined} keytips={steps(t, [98.2, 98.55, 98.9]) === 1} sheets={[{n: 'Sales', c: '#00B050'}, {n: 'Expenses', c: '#0070C0'}, {n: 'Summary'}]} act={0} nameBox={E8 ? 'E8' : 'A1'} formula={E8 ? formulaOf('sales', 8, 4) : 'Branch'}>
          {({gw, gh}) => split
            ? <SplitGrid gw={gw} gh={gh} kind="sales" sx={sx} sy={sy} rt={1} rb={rb} cl={0} cr={cr} />
            : (
              <div style={{position: 'absolute', inset: 0}}>
                <Grid gw={gw} gh={gh} kind="sales" {...cfg0} selR={E8 ? 8 : 1} selC={E8 ? 4 : 0} />
                {p > 0 && <SplitBars gw={gw} gh={gh} sx={xOf(4)} sy={140} p={p} />}
              </div>
            )}
        </Win>
        <Chip x={P(140, 0).x} y={P(0, gy0 + 4).y} text="Row 1" c={C.green} a={fade(t, 88.2, 93.5)} size={24} />
        <Chip x={P(140, 0).x} y={P(0, gy0 + ghh - 30).y} text="Row 50,000" c={C.purple} a={fade(t, 88.8, 93.5)} size={24} />
        <Chip x={960} y={590} center text="Compare far-apart rows in one sheet?" c={C.amber} a={fade(t, 89.0, 93.3)} />
        {quad.map((q, i) => <Chip key={i} x={q.x - 28} y={q.y - 24} text={String(i + 1)} c={C.purple} a={split ? fade(t, 101.2, 106.0) : 0} size={30} />)}
        <Chip x={quad[1].x - 130} y={quad[1].y - 24} text="Still shows Row 1" c={C.green} a={fade(t, 110.8, 115.5)} size={24} />
        <Chip x={quad[3].x - 120} y={quad[3].y - 24} text="Row 50,000" c={C.purple} a={fade(t, 110.9, 115.5)} size={24} />
        <Cursor x={cur.x} y={cur.y} t={t} left={[90.6, 93.9, 116.8]} />
      </Cam>
      <Hud>
        <Tag text="Split Window (Alt + W + S) → Divides Grid into 4 Independent Scroll Panes" c={C.purple} a={fade(t, 88, 106)} />
        <Tag text="Split Feature → Compare Row 1 with Row 50,000 on the Same Worksheet" c={C.purple} a={fade(t, 110, 126)} />
        <Keys keys={['Alt', 'W', 'S']} n={steps(t, [98.2, 98.55, 98.9])} a={fade(t, 98.0, 100.4)} c={C.purple} />
      </Hud>
    </Stage>
  );
};

/* ───────────────────────── SCENE 4 — New Window, Side by Side, Synchronous Scrolling ───────────────────────── */
const R_FULL = {x: 40, y: 100, w: 1840, h: 888};
const R_TOP = {x: 40, y: 100, w: 1840, h: 434};
const R_BOT = {x: 40, y: 554, w: 1840, h: 434};
const R_L = {x: 40, y: 100, w: 910, h: 888};
const R_R = {x: 970, y: 100, w: 910, h: 888};
type R = typeof R_FULL;
const mix = (a: R, b: R, p: number): R => ({x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p)});
const Pair: React.FC<{t: number; r1: R; r2: R; two: boolean; ribbon: boolean; act2: number; sheets: {n: string; c?: string}[]; k1: 'jan' | 'cairo'; k2: 'feb' | 'alex'; sr: number; sc: number; glow?: string; g2?: string; tab: string; hl?: string; fc: number}> = (q) => {
  const mk = (r: R, id: number, act: number, kind: 'jan' | 'feb' | 'cairo' | 'alex', glow?: string) => {
    const cfg = {fr: 1, fc: q.fc, sr: Math.max(q.sr, 2), sc: q.fc ? Math.max(q.sc, q.fc) : q.sc};
    const props: Omit<WinProps, 'children'> = {...r, title: q.two ? `${FILE}:${id} - Excel` : `${FILE} - Excel`, tab: q.tab, ribbon: q.ribbon, hl: q.ribbon ? q.hl : undefined, sheets: q.sheets, act, nameBox: q.fc ? 'C2' : 'A1', formula: q.fc ? formulaOf(kind, 2, 2) : 'Branch', glow};
    return (
      <Win key={id} {...props}>
        {({gw, gh}) => <Grid gw={gw} gh={gh} kind={kind} {...cfg} selR={q.fc ? 2 : 1} selC={q.fc ? 2 : 0} glow={C.blue} lines={q.fc ? 0.8 : 0} />}
      </Win>
    );
  };
  return (
    <div>
      {mk(q.r1, 1, 0, q.k1, q.glow)}
      {q.two && mk(q.r2, 2, q.act2, q.act2 ? q.k2 : q.k1, q.g2)}
    </div>
  );
};
const SyncBand: React.FC<{t: number; a: number; row: number}> = ({t, a, row}) => (
  <div style={{position: 'absolute', left: 0, top: 0, opacity: a, pointerEvents: 'none', zIndex: 30}}>
    <div style={{position: 'absolute', left: 40, top: P(0, 88 + M.hdr + 6 * 20).y - 100 + 100, width: 1840, height: 20 * Z, background: 'rgba(56,189,248,.20)', borderTop: `2px solid ${C.blue}`, borderBottom: `2px solid ${C.blue}`}} />
    <div style={{position: 'absolute', left: 960 - 26, top: P(0, 88 + M.hdr + 6 * 20).y - 8, width: 52, height: 52, borderRadius: 26, background: '#0F172A', border: `3px solid ${C.blue}`, color: C.blue, fontSize: 34, textAlign: 'center', lineHeight: '46px', boxShadow: `0 0 ${16 + 14 * pls(t, 0.9)}px ${C.blue}`}}>⇄</div>
    <div style={{position: 'absolute', left: 960, top: P(0, 88 + M.hdr + 6 * 20).y - 62, transform: 'translateX(-50%)', color: '#E0F2FE', fontFamily: mono, fontWeight: 700, fontSize: 24, background: 'rgba(15,23,42,.9)', padding: '2px 14px', borderRadius: 8, border: `2px solid ${C.blue}`, whiteSpace: 'nowrap'}}>Row {row}</div>
  </div>
);
export const Scene4: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const two = t >= 140.9;
  const sp = kf(t, [[146.2, 0], [147.1, 1]]);
  const vp = kf(t, [[153.0, 0], [154.0, 1]]);
  const r1 = mix(mix(R_FULL, R_TOP, sp), R_L, vp);
  const r2 = mix(mix(R_FULL, R_BOT, sp), R_R, vp);
  const ribbon = sp < 0.02;
  const act2 = t >= 144.2 ? 1 : 0;
  const sr = kf(t, [[155.6, 1], [158.0, 260], [160.0, 260], [163.0, 1800], [165.5, 1800], [167.2, 40]]);
  const names = ['Jan', 'Feb'];
  const SY = sheetY(WIN.h);
  const nb = VB.neww, sbb = VB.sbs;
  const NW = P(nb.x + 24, nb.y + 30), SB = P(sbb.x + 60, sbb.y + 11);
  const rf = shRect(names, 1);
  const FebTab = P(rf.x + rf.w / 2, SY + 14);
  const dlg = {x: 700, y: 300};
  const pickVert = t >= 152.5;
  const cur = pt(t, [
    [130, {x: 1000, y: 640}], [137.4, NW], [139.1, NW], [141.8, {x: 1100, y: 500}], [144.0, FebTab], [144.2, FebTab], [145.4, SB], [146.2, SB], [147.6, {x: 960, y: 560}], [151.5, {x: 900, y: 420}],
    [152.4, {x: dlg.x + 96, y: dlg.y + 168}], [152.5, {x: dlg.x + 96, y: dlg.y + 168}], [152.95, {x: dlg.x + 325, y: dlg.y + 298}], [154.4, {x: 500, y: 620}], [155.4, {x: 500, y: 620}], [168, {x: 520, y: 700}],
  ]);
  const camA = {x: NW.x, y: NW.y + 120}, camB = {x: SB.x, y: SB.y + 120};
  const kN = steps(t, [140.7, 141.0, 141.32]), kB = steps(t, [146.9, 147.2, 147.47]), kS = steps(t, [150.6, 150.95, 151.25, 151.55]);
  const keys = t < 144 ? ['Alt', 'W', 'N'] : t < 150 ? ['Alt', 'W', 'B'] : ['Alt', 'W', 'Y', '1'];
  const kn = t < 144 ? kN : t < 150 ? kB : kS;
  const ka = fade(t, 140.4, 141.9) + fade(t, 146.6, 148.6) + fade(t, 150.4, 152.5);
  const syncOn = t >= 155.6;
  const glowOn = t >= 153.6;
  const flash = fade(t, 141.0, 142.6, 0.2);
  return (
    <Stage>
      <Cam t={t} k={[[130, 960, 540, 1], [136.6, 960, 540, 1], [137.4, camA.x, camA.y, 1.7], [141.8, camA.x, camA.y, 1.7], [142.6, 960, 540, 1], [145.0, 960, 540, 1], [145.7, camB.x, camB.y, 1.7], [146.9, camB.x, camB.y, 1.7], [147.8, 960, 540, 1]]}>
        <Pair t={t} r1={r1} r2={r2} two={two} ribbon={ribbon} act2={act2} sheets={[{n: 'Jan'}, {n: 'Feb'}]} k1="jan" k2="feb" sr={sr} sc={0} fc={0} tab="View" hl={t > 137.6 && t < 139.4 ? 'neww' : t > 145.5 && t < 146.6 ? 'sbs' : undefined}
          glow={glowOn ? C.blue : undefined} g2={glowOn ? C.blue : flash > 0.05 ? C.blue : undefined} />
        {syncOn && <SyncBand t={t} a={fade(t, 155.6, 168.2, 0.5)} row={Math.round(Math.max(sr, 2)) + 5} />}
        {t >= 151.6 && t < 153.2 && <ArrangeDlg x={dlg.x} y={dlg.y} pick={pickVert ? 2 : 0} ok={t >= 152.95} />}
        <Chip x={960} y={560} center text="Compare Jan vs Feb in one file?" c={C.amber} a={fade(t, 131.0, 138.4)} />
        <Chip x={960} y={170} center text={`New Window → ${FILE}:2`} c={C.blue} a={fade(t, 141.4, 145.6)} />
        <Chip x={960} y={170} center text="View ▸ Arrange All ▸ Vertical" c={C.blue} a={fade(t, 150.2, 152.6)} />
        <Chip x={960} y={230} center text="Synchronous Scrolling ✓ ON" c={C.blue} a={fade(t, 149.4, 154.0)} />
        <Cursor x={cur.x} y={cur.y} t={t} left={[139.1, 144.2, 146.2, 152.5, 152.95]} />
      </Cam>
      <Hud>
        <Tag text="New Window (Alt + W + N) → Creates Live Synchronized Instance of Current File" c={C.blue} a={fade(t, 132, 148)} />
        <Tag text="Side-by-Side Scrolling → Sync Scroll 2 Worksheets Simultaneously" c={C.blue} a={fade(t, 152, 166)} />
        <Keys keys={keys} n={kn} a={ka} c={C.blue} />
      </Hud>
    </Stage>
  );
};

/* ───────────────────────── SCENE 5 — Enterprise execution ───────────────────────── */
export const Scene5: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[5];
  const frozen = t >= 187.9;
  const fc = frozen ? 2 : 0;
  const two = t >= 190.4;
  const vp = kf(t, [[191.9, 0], [192.8, 1]]);
  const r1 = mix(R_FULL, R_L, vp), r2 = mix(R_FULL, R_R, vp);
  const ribbon = vp < 0.02;
  const srRaw = kf(t, [[171.2, 1], [180.6, 1], [183.4, 49990], [185.0, 1], [188.0, 1], [189.9, 3000], [194.0, 3000], [196.4, 12000], [197.5, 12000], [199.4, 31000], [206, 48000]]);
  const sc = !frozen ? 0 : kf(t, [[187.9, 2], [189.0, 6], [190.4, 6], [191.6, 2]]);
  const cfg = {fr: frozen ? 1 : 0, fc, sr: srRaw, sc};
  const c2 = t >= 185.4;
  const names = ['Cairo', 'Alexandria'];
  const SY = sheetY(WIN.h);
  const V = P(TABX.View.x + 21, 46);
  const C2p = gx({fr: 0, fc: 0, sr: 1, sc: 0}, 2, 2);
  const tabA = shRect(names, 1);
  const AlexTab = P(tabA.x + tabA.w / 2, SY + 14, R_R);
  const cur = pt(t, [
    [171, {x: 1100, y: 640}], [185.2, C2p], [185.4, C2p], [185.85, V], [186.0, V], [187.0, {x: 1000, y: 620}], [192.6, {x: 1000, y: 620}], [192.8, AlexTab], [192.95, AlexTab], [194.4, {x: 520, y: 640}], [207, {x: 560, y: 700}],
  ]);
  const act2 = t >= 192.95 ? 1 : 0;
  const mk = (r: R, id: number, act: number, kind: 'cairo' | 'alex', glow?: string) => (
    <Win key={id} {...r} title={two ? `${FILE}:${id} - Excel` : `${FILE} - Excel`} tab={t < 185.9 ? 'Home' : 'View'} ribbon={ribbon} keytips={id === 1 && steps(t, [186.8, 187.1, 187.4, 187.7]) === 1} sheets={[{n: 'Cairo'}, {n: 'Alexandria'}]} act={act} nameBox={c2 ? 'C2' : 'A1'} formula={c2 ? formulaOf(kind, 2, 2) : 'Branch'} glow={glow}>
      {({gw, gh}) => <Grid gw={gw} gh={gh} kind={kind} {...cfg} sr={Math.max(cfg.sr, cfg.fr + 1)} selR={c2 ? 2 : 1} selC={c2 ? 2 : 0} glow={C.green} lines={frozen ? 0.9 : 0} tint={frozen ? 0.25 : 0} />}
    </Win>
  );
  const kk = t < 189 ? ['Alt', 'W', 'F', 'F'] : ['Alt', 'W', t < 191 ? 'N' : 'B'];
  const kn = t < 189 ? steps(t, [186.8, 187.1, 187.4, 187.7]) : t < 191 ? steps(t, [189.6, 189.9, 190.2]) : steps(t, [191.2, 191.5, 191.8]);
  const ka = fade(t, 186.6, 188.4) + fade(t, 189.4, 190.6) + fade(t, 191.0, 192.1);
  const sealP = kf(t, [[a.speed, 0], [a.speed + 0.9, 1]]);
  const sealA = clamp(sealP) * clamp((208 - t) / 0.6);
  const load = fade(t, 171.6, 178.8, 0.4);
  return (
    <Stage>
      <Cam t={t} k={[[171, 960, 540, 1]]}>
        {mk(r1, 1, 0, 'cairo', t >= 192.8 ? C.blue : undefined)}
        {two && mk(r2, 2, act2, act2 ? 'alex' : 'cairo', t >= 192.8 ? C.blue : undefined)}
        {t >= 194.0 && <SyncBand t={t} a={fade(t, 194.0, 208, 0.5)} row={Math.round(Math.max(srRaw, 2)) + 5} />}
        <Ring x={P(235, 3).x} y={P(235, 3).y} w={330 * Z} h={26 * Z} c={C.green} t={t} a={two ? 0 : fade(t, a.file - 0.2, 183.5)} />
        <Chip x={960} y={560} center text="50,000 data rows → scrolled in seconds" c={C.green} a={fade(t, 181.0, 184.6)} />
        <Chip x={960} y={170} center text="Freeze Panes on C2 → keeps headers + Branch visible" c={C.green} a={fade(t, 188.0, 190.2)} />
        <Chip x={960} y={170} center text="Cairo ⇄ Alexandria — same rows, side by side" c={C.blue} a={fade(t, 192.9, 198.6)} />
        <Cursor x={cur.x} y={cur.y} t={t} left={[185.4, 185.85, 192.95]} />
        {load > 0.01 && (
          <div style={{position: 'absolute', left: 560, top: 400, width: 800, height: 220, opacity: load, borderRadius: 20, background: 'rgba(15,23,42,.96)', border: `3px solid ${C.blue}`, boxShadow: `0 0 30px ${C.blue}66`, zIndex: 60, fontFamily: ar, color: '#F8FAFC', textAlign: 'center', paddingTop: 36, boxSizing: 'border-box'}}>
            <div style={{fontSize: 38, fontWeight: 700, direction: 'ltr'}}>Loading {FILE}</div>
            <div style={{fontSize: 28, color: C.dim, marginTop: 6}}>50,000 rows</div>
            <div style={{margin: '24px 60px 0', height: 14, background: '#334155', borderRadius: 7}}><div style={{width: `${kf(t, [[172.0, 0], [178.2, 100]])}%`, height: 14, background: C.blue, borderRadius: 7}} /></div>
          </div>
        )}
      </Cam>
      <Hud>
        <Tag text="Enterprise Navigation → Seamless 50,000 Row Scroll with Custom Cell Freeze" c={C.blue} a={fade(t, 172, 188)} />
        <Tag text="Multi-Branch Audit → Live Side-by-Side Comparison via Dual Window Instance" c={C.green} a={fade(t, 192, 206)} />
        <Keys keys={kk} n={kn} a={ka} c={C.green} />
        {sealA > 0.01 && (
          <div style={{position: 'absolute', left: 960 - 230, top: 540 - 230, width: 460, height: 460, opacity: sealA, transform: `scale(${0.5 + 0.5 * clamp(sealP)})`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, #065F46 0%, #0F172A 72%)', border: `6px solid ${C.green}`, boxShadow: `0 0 ${50 + 30 * pls(t, 1.6)}px ${C.green}`}} />
            <div style={{position: 'absolute', inset: 26, borderRadius: '50%', border: `2px dashed ${C.green}`, transform: `rotate(${(t - a.speed) * 30}deg)`}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontSize: 120, color: C.green, lineHeight: '120px'}}>✓</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontFamily: ar, fontWeight: 700, fontSize: 36, color: '#F8FAFC'}}>Enterprise Navigation</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 276, textAlign: 'center', fontFamily: ar, fontWeight: 600, fontSize: 30, color: '#6EE7B7'}}>Faster Audit Review</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 340, textAlign: 'center', fontFamily: mono, fontSize: 24, color: C.dim}}>{FILE}</div>
          </div>
        )}
      </Hud>
    </Stage>
  );
};

/* ───────────────────────── SCENE 6 — Academy outro ───────────────────────── */
export const Scene6: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const a = A[6];
  const pop = (s: number) => {
    const p = clamp((t - s) / 0.6);
    return {opacity: p, transform: `translateY(${(1 - p) * 26}px)`};
  };
  const prog = kf(t, [[211.6, 0], [214.6, 21.4]]);
  const skills = ['Sheet Tabs, Tab Color & Group Sheets', 'Freeze Panes — Alt + W + F + F', 'Split Window — Alt + W + S', 'New Window & Side by Side — Alt + W + N / B'];
  const out = clamp((t - 238.3) / 1.6);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 80, top: 110, width: 1760, height: 860, borderRadius: 32, background: 'rgba(30,41,59,.78)', border: '2px solid rgba(148,163,184,.35)', boxShadow: '0 30px 90px rgba(0,0,0,.5)', fontFamily: ar, color: '#F8FAFC', ...pop(a.great - 0.2)}}>
        <div style={{position: 'absolute', left: 60, top: 50, display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{margin: '-56px -44px'}}><Logo s={230} /></div>
          <div>
            <div dir="rtl" style={{fontSize: 56, fontWeight: 700}}>منظومة أكاديمي | Manzooma Excel Masterclass</div>
            <div style={{fontSize: 28, color: C.dim, marginTop: 4}}>Excel From Zero to Professional — Unit 1: Architecture & Smart Interface Setup</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 250, width: 800, ...pop(211.0)}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 18, background: 'rgba(16,185,129,.16)', border: `3px solid ${C.green}`, fontSize: 32, fontWeight: 600, direction: 'ltr'}}>
            <span style={{fontSize: 40, color: C.green}}>✓</span>Lesson 03 Completed: Sheet & Freeze Panes Mastered
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 370, width: 800, ...pop(211.4)}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, color: C.dim, direction: 'ltr'}}><span>Unit 1 progress</span><span style={{color: '#F8FAFC', fontWeight: 700}}>{Math.round(prog)}%</span></div>
          <div style={{marginTop: 12, height: 26, borderRadius: 13, background: '#334155', overflow: 'hidden'}}><div style={{width: `${prog / 100 * 100 * (100 / 100)}%`, height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${C.green}, ${C.blue})`, boxShadow: `0 0 18px ${C.green}`, maxWidth: '100%'}} /></div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 500, width: 800, direction: 'ltr'}}>
          {skills.map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 31, margin: '0 0 22px', ...pop(212.0 + i * 0.7)}}>
              <span style={{width: 40, height: 40, borderRadius: 20, background: C.green, color: '#0F172A', textAlign: 'center', lineHeight: '40px', fontWeight: 700, fontSize: 26}}>✓</span>{s}
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 940, top: 250, width: 760, height: 300, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.blue}`, padding: '30px 40px', boxSizing: 'border-box', direction: 'ltr', ...pop(a.down)}}>
          <div style={{fontSize: 30, color: C.dim}} dir="rtl">الملفات والتدريبات</div>
          <div style={{fontFamily: mono, fontSize: 30, fontWeight: 700, color: C.blue, marginTop: 18}}>{FILE}</div>
          <div style={{fontFamily: mono, fontSize: 36, fontWeight: 700, color: '#F8FAFC', marginTop: 24, padding: '14px 18px', border: `2px dashed ${C.blue}`, borderRadius: 14, boxShadow: `0 0 ${10 + 14 * pls(t, 1.8)}px ${C.blue}55`}}>solutions.gomaaintelligence.me</div>
        </div>
        <div style={{position: 'absolute', left: 940, top: 590, width: 760, height: 280, borderRadius: 24, background: 'rgba(15,23,42,.7)', border: `2px solid ${C.purple}`, padding: '30px 40px', boxSizing: 'border-box', ...pop(a.next - 0.6)}}>
          <div dir="rtl" style={{fontSize: 30, color: C.dim}}>الدرس القادم</div>
          <div dir="rtl" style={{fontSize: 44, fontWeight: 700, marginTop: 14, lineHeight: '62px'}}>الدرس 4: الجداول الديناميكية والمراجع المهيكلة</div>
          <div style={{fontSize: 32, color: '#C4B5FD', marginTop: 12, direction: 'ltr', fontWeight: 600}}>Excel Tables & Structured References →</div>
        </div>
      </div>
      <Hud />
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: out}} />
    </Stage>
  );
};
