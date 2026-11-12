import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, XL, M, VOICE, LOGO, gx, gy, DURATION, LESSON, TOTAL_LESSONS, UNIT, TOTAL_UNITS } from "./theme";
import { CUE, SC } from "./sync";
import {
  FONT, Stage, Header, Caption, Cursor, WP, Neon, Tx, Rect, Ico, Spinner, Sql, Menu, MenuItem, menuItemY, Btn, abs,
  ExcelWin, QCPane, QueryProps, PQWin, NativeQuery, QueryOptions, PQ_STEPS, PQ_SQL, pqStep, pqFileTab, rib, tabAt, QP, QO,
  STEP_MENU, FILE_MENU, OPT_SUB, salesData, cellBox, clamp, prog, eo, eio, lerp, typed, fmt, Sel, nativeDlgBox,
} from "./kit";

const mk = (id: string, s0: number) => (n: string, o = 0) => Math.round((CUE[id + "_" + n] + o) * 30) - s0;
const gw = (w: WP[]): WP[] => w.map((p) => ({ ...p, x: gx(p.x), y: gy(p.y) }));
const cellText = (d: string[][], s: Sel) => { const v = d[s.r1]?.[s.c1] ?? ""; return /^[\d,]+$/.test(v) && v.includes(",") ? v.replace(/,/g, "") : v; };
const ramp = (f: number, t: number, d = 10) => eo(prog(f, t, t + d));
const D = salesData();
const menuTop = (y: number, items: MenuItem[]) => Math.min(y, 660 - (items.reduce((a, i) => a + (i.sep ? 7 : 24), 0) + 6));

// ---------------- Scene 1: concept ----------------
const Lane: React.FC<{ x: number; y: number; w: number; h: number; color: string; title: string; a: number; children?: React.ReactNode }> = ({ x, y, w, h, color, title, a, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, background: C.panel2, border: `2px solid ${color}`, borderRadius: 18, boxSizing: "border-box" }}>
    <div dir="ltr" style={{ position: "absolute", left: 24, top: 14, height: 40, padding: "0 20px", borderRadius: 20, background: color, color: "#0F172A", fontFamily: FONT.ui, fontWeight: 700, fontSize: 22, lineHeight: "40px" }}>{title}</div>
    {children}
  </div>
);
const Node: React.FC<{ x: number; y: number; ic: string; label: string; c: string; s?: number }> = ({ x, y, ic, label, c, s = 84 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 190, height: s + 52 }}>
    <div style={{ position: "absolute", left: 53, top: 0, width: s + 30, height: s + 14, borderRadius: 20, background: C.bg, border: `2px solid ${c}` }}><Ico n={ic} x={15} y={7} s={s} c={c} sw={1.3} /></div>
    <div dir="ltr" style={{ position: "absolute", left: 0, top: s + 22, width: 190, textAlign: "center", fontFamily: FONT.ui, fontSize: 21, fontWeight: 600, color: C.text }}>{label}</div>
  </div>
);
const S1: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[0]; const dur = s1 - s0; const at = mk("c1", s0);
  const tFold = at("fold", -0.6), tLocal = at("local", -0.2), tPush = at("push"), tBg = at("bg");
  const card = ramp(f, at("badge")) * (1 - ramp(f, tFold - 4));
  const diag = ramp(f, tFold);
  const chips = [["Query Folding", C.blue, at("fold", -9.4)], ["Background Refresh", C.purple, at("fold", -6)], ["Privacy & Fast Load", C.amber, at("fold", -3)]] as const;
  const push = ramp(f, tPush);
  const mSteps = ["Source", "Filtered Rows", "Removed Columns"];
  const sqlShort = "select [_].[OrderID], [_].[Region],\n       [_].[Amount]\nfrom [dbo].[Sales] as [_]\nwhere [_].[OrderDate] >= '2026-01-01'";
  const rows = Math.floor(lerp(0, 1284000, eo(prog(f, tLocal, tLocal + 500))));
  const laneA = ramp(f, tLocal) * (1 - 0.45 * push);
  const dash = (f * 5) % 40;
  return (
    <Stage dur={dur} fin={0} fout={8}>
      <PQWin f={f} step={2} dim={0.55 + 0.4 * diag} />
      <Header f={f} />
      <div style={{ position: "absolute", left: 360, top: 250, width: 1200, height: 520, opacity: card }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "rgba(30,41,59,0.94)", border: `2px solid ${C.blue}` }} />
        <div dir="rtl" style={{ position: "absolute", left: 0, top: 36, width: 1200, textAlign: "center", fontFamily: FONT.ar, fontSize: 34, color: C.dim }}>{`ختام الوحدة ${UNIT} من ${TOTAL_UNITS} — Power Query & ETL`}</div>
        <div dir="ltr" style={{ position: "absolute", left: 0, top: 100, width: 1200, textAlign: "center", fontFamily: FONT.ui, fontSize: 60, fontWeight: 700, color: C.text }}>Lesson {LESSON}</div>
        <div dir="ltr" style={{ position: "absolute", left: 0, top: 184, width: 1200, textAlign: "center", fontFamily: FONT.ui, fontSize: 44, fontWeight: 600, color: C.blue }}>Refresh Properties &amp; Query Folding</div>
        <div dir="rtl" style={{ position: "absolute", left: 0, top: 262, width: 1200, textAlign: "center", fontFamily: FONT.ar, fontSize: 36, fontWeight: 500, color: C.text }}>تحديث الاستعلامات وتحسين أدائها</div>
        {chips.map(([t, c, tt], i) => (
          <div key={t} dir="ltr" style={{ position: "absolute", left: 90 + i * 365, top: 380, width: 340, height: 70, borderRadius: 35, border: `3px solid ${c}`, background: C.bg, color: C.text, fontFamily: FONT.ui, fontSize: 28, fontWeight: 600,
            textAlign: "center", lineHeight: "64px", opacity: ramp(f, tt), transform: `translateY(${(1 - ramp(f, tt)) * 18}px)` }}>{t}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 80, top: 104, width: 1760, height: 880, opacity: diag }}>
        <Lane x={0} y={0} w={1760} h={420} color={C.red} title="Local engine: no folding" a={laneA}>
          <Node x={90} y={120} ic="db" label="SQL Server" c={C.red} />
          <Node x={1480} y={120} ic="table" label="Your PC (Excel)" c={C.red} />
          <svg style={{ position: "absolute", left: 300, top: 0 }} width={1160} height={420}>
            <rect x={0} y={178} width={1160} height={34} rx={17} fill={C.bg} stroke={C.red} strokeWidth={2} />
            {Array.from({ length: 16 }).map((_, i) => { const x = (f * 7 + i * 72) % 1140; return <rect key={i} x={x} y={188} width={44} height={14} rx={4} fill={C.red} opacity={Math.min(1, x / 60, (1140 - x) / 60)} />; })}
          </svg>
          <div dir="ltr" style={{ position: "absolute", left: 330, top: 240, width: 1100, textAlign: "center", fontFamily: FONT.mono, fontSize: 34, fontWeight: 700, color: C.red }}>{`Rows pulled to your PC: ${fmt(rows)}`}</div>
          <div style={{ position: "absolute", left: 330, top: 300, width: 1100, height: 16, borderRadius: 8, background: C.bg }}><div style={{ width: 1100 * 0.18 * prog(f, tLocal, tLocal + 500), height: 16, borderRadius: 8, background: C.red }} /></div>
          <div dir="ltr" style={{ position: "absolute", left: 330, top: 336, width: 1100, textAlign: "center", fontFamily: FONT.ui, fontSize: 24, color: C.dim }}>Then filters locally… Excel (Not Responding)</div>
        </Lane>
        <Lane x={0} y={450} w={1760} h={420} color={C.blue} title="Query Folding: the server does the work" a={ramp(f, tFold)}>
          {mSteps.map((n, i) => (
            <div key={n} dir="ltr" style={{ position: "absolute", left: 40, top: 80 + i * 92, width: 330, height: 74, borderRadius: 14, background: C.bg, border: `2px solid ${C.line}`, color: C.text, fontFamily: FONT.mono, fontSize: 26, lineHeight: "70px", paddingLeft: 24, boxSizing: "border-box",
              opacity: ramp(f, tFold + 8 + i * 12), transform: `translateX(${(1 - ramp(f, tFold + 8 + i * 12)) * -30}px)` }}>{`M  ${n}`}</div>
          ))}
          <svg style={{ position: "absolute", left: 380, top: 150 }} width={110} height={120}><path d="M0 60H90M70 40L92 60L70 80" stroke={C.blue} strokeWidth={5} fill="none" strokeDasharray="14 10" strokeDashoffset={-dash} opacity={ramp(f, tFold + 40)} /></svg>
          <div style={{ position: "absolute", left: 500, top: 70, width: 700, height: 260, borderRadius: 16, background: C.bg, border: `3px solid ${C.blue}`, opacity: ramp(f, tFold + 40), boxSizing: "border-box", padding: "16px 20px" }}>
            <div dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 20, fontWeight: 700, color: C.blue, marginBottom: 10 }}>ONE Native SQL Query</div>
            <Sql text={typed(sqlShort, f, tFold + 56, 60)} size={20} lh={34} />
          </div>
          <svg style={{ position: "absolute", left: 1210, top: 150 }} width={150} height={120}><path d="M0 60H120M98 40L122 60L98 80" stroke={C.blue} strokeWidth={5} fill="none" strokeDasharray="14 10" strokeDashoffset={-dash} opacity={ramp(f, tFold + 90)} /></svg>
          <Node x={1380} y={110} ic="db" label="SQL Server" c={C.blue} />
          {push > 0 && <div dir="ltr" style={{ position: "absolute", left: 1340, top: 300, width: 400, textAlign: "center", fontFamily: FONT.ui, fontSize: 23, fontWeight: 600, color: C.green, opacity: push }}>Only the result comes back</div>}
          {tBg < f + 400 && <div dir="ltr" style={{ position: "absolute", left: 40, top: 350, height: 46, padding: "0 22px", borderRadius: 23, border: `2px solid ${C.purple}`, color: C.text, fontFamily: FONT.ui, fontSize: 22, lineHeight: "42px", opacity: ramp(f, tBg) }}>● Refresh runs in the background</div>}
        </Lane>
        {push > 0 && <Neon x={0} y={450} w={1760} h={420} c={C.blue} a={push} r={18} />}
      </div>
      <Caption f={f} t0={at("badge", 0.6)} t1={at("fold", -1)} color={C.blue} text="Unit 10 finale → Query Folding & Refresh Properties" />
      <Caption f={f} t0={at("fold")} t1={dur - 6} color={C.blue} text="Query Optimization → Push Processing to the Source Server via Native SQL Query" />
    </Stage>
  );
};

// ---------------- Scene 2: View Native Query ----------------
const S2: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[1]; const dur = s1 - s0; const at = mk("c2", s0);
  const tSql = at("sql"), tRight = at("right"), tView = at("view", 0.35), tOk = at("server", 3.4), tCustom = tOk + 38, tRight2 = tCustom + 44;
  const st2 = pqStep(2), st4 = pqStep(4);
  const m1 = { x: st2.x + 60, y: menuTop(st2.y + 14, STEP_MENU) };
  const m2 = { x: st4.x + 60, y: menuTop(st4.y + 14, STEP_MENU) };
  const dlgA = ramp(f, tView + 2, 8) * (1 - ramp(f, tOk + 4, 7));
  const step = f >= tCustom ? 4 : 2;
  const menu1 = f >= tRight && f < tView + 4;
  const menu2 = f >= tRight2;
  const m2Items: MenuItem[] = STEP_MENU.map((m, i) => (i === 10 ? { ...m, dis: true } : m));
  const wps = gw([
    { t: 0, x: 760, y: 330 }, { t: tRight - 30, x: 640, y: 380 }, { t: tRight - 2, x: st2.x + 60, y: st2.y + 14 },
    { t: tRight, x: st2.x + 60, y: st2.y + 14, click: true, right: true },
    { t: tView - 6, x: m1.x + 50, y: m1.y + menuItemY(STEP_MENU, 10) }, { t: tView, x: m1.x + 50, y: m1.y + menuItemY(STEP_MENU, 10), click: true },
    { t: tOk - 24, x: nativeDlgBox.x + nativeDlgBox.w - 62, y: nativeDlgBox.y + nativeDlgBox.h - 27 }, { t: tOk, x: nativeDlgBox.x + nativeDlgBox.w - 62, y: nativeDlgBox.y + nativeDlgBox.h - 27, click: true },
    { t: tCustom - 4, x: st4.x + 60, y: st4.y + 14 }, { t: tCustom, x: st4.x + 60, y: st4.y + 14, click: true },
    { t: tRight2 - 2, x: st4.x + 60, y: st4.y + 14 }, { t: tRight2, x: st4.x + 60, y: st4.y + 14, click: true, right: true },
    { t: tRight2 + 22, x: m2.x + 50, y: m2.y + menuItemY(STEP_MENU, 10) },
  ]);
  const sq = ramp(f, tSql) * (1 - ramp(f, tRight - 24, 8));
  const ambA = ramp(f, tRight2 + 12);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <PQWin f={f} step={step} hoverStep={menu1 ? 2 : -1}>
        {sq > 0 && (
          <div style={abs(250, 230, 700, 236, { opacity: sq, background: "#0F172A", border: `3px solid ${C.blue}`, boxSizing: "border-box", padding: "10px 16px", borderRadius: 10 })}>
            <Tx x={16} y={6} w={500} h={24} size={14} bold color={C.blue}>Native SQL Query (generated by Power Query)</Tx>
            <div style={abs(16, 36, 660, 190)}><Sql text={typed(PQ_SQL, f, tSql + 6, 70)} size={13} lh={20} /></div>
          </div>
        )}
        {f >= at("start") && f < tRight && <Neon x={M.win.w - M.pqRight + 4} y={158} w={M.pqRight - 8} h={190} c={C.blue} a={ramp(f, at("start")) * (1 - ramp(f, tRight - 10, 8))} r={4} />}
        {menu1 && <Menu x={m1.x} y={m1.y} w={236} items={STEP_MENU} hi={f >= tView - 12 ? 10 : -1} a={ramp(f, tRight, 4)} />}
        {menu2 && <Menu x={m2.x} y={m2.y} w={236} items={m2Items} hi={f >= tRight2 + 10 ? 10 : -1} a={ramp(f, tRight2, 4)} />}
        {menu2 && <Neon x={m2.x + 2} y={m2.y + menuItemY(STEP_MENU, 10) - 12} w={232} h={24} c={C.amber} a={ambA} r={3} />}
        {menu2 && (
          <div style={abs(250, 250, 600, 76, { opacity: ambA, background: "rgba(15,23,42,0.96)", border: `3px solid ${C.amber}`, borderRadius: 10, boxSizing: "border-box" })}>
            <Tx x={18} y={8} w={560} h={30} size={17} bold color={C.amber}>Folding broke at this step</Tx>
            <Tx x={18} y={38} w={570} h={28} size={14.5} color="#E2E8F0">The custom function runs locally, so View Native Query is disabled</Tx>
          </div>
        )}
        {dlgA > 0 && <NativeQuery a={dlgA} text={typed(PQ_SQL, f, tView + 6, 110)} okDown={f >= tOk && f < tOk + 4} />}
        {dlgA > 0.5 && f > at("green") && <Neon x={nativeDlgBox.x} y={nativeDlgBox.y} w={nativeDlgBox.w} h={nativeDlgBox.h} c={C.green} a={ramp(f, at("green")) * dlgA} r={4} />}
      </PQWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("start", 0.5)} t1={at("server", -0.5)} color={C.blue} text="Applied Steps Inspection → Right-Click Step → View Native Query" />
      <Caption f={f} t0={at("server")} t1={dur - 6} color={C.green} text="Folding Audit → Active SQL Folding (Green) vs. Local Engine Fallback (Amber)" />
    </Stage>
  );
};

// ---------------- Scene 3: Query Properties ----------------
const QC_MENU: MenuItem[] = [{ l: "Edit", ic: "gear" }, { l: "Delete", ic: "minus" }, { l: "Rename" }, { l: "Refresh", ic: "refresh" }, { l: "Load To..." }, { sep: true, l: "" }, { l: "Duplicate" }, { l: "Reference" }, { l: "Merge" }, { l: "Append" },
  { l: "Export Connection File..." }, { sep: true, l: "" }, { l: "Move To Group", sub: true }, { l: "Move Up" }, { l: "Move Down" }, { l: "Show the Peek" }, { l: "Properties...", ic: "props" }];
const S3: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[2]; const dur = s1 - s0; const at = mk("c3", s0);
  const tData = at("data", -0.1), tQc = at("qc", 0.15), tMenu = at("prop", -1.6), tProp = at("prop", 0.5), tBg = at("bg", 0.35), tTimed = at("timed", 0.2), tOpen = at("open", 0.4), tOk = at("end", 3.6), tCell = tOk + 40;
  const tab = f >= tData ? "Data" : "Home";
  const paneW = Math.round(M.pane * eo(prog(f, tQc + 2, tQc + 16)));
  const card = { x: M.win.w - M.pane + 12, y: 276 };
  const mTop = menuTop(card.y + 30, QC_MENU);
  const mx = M.win.w - M.pane - 236 + 150;
  const propY = mTop + menuItemY(QC_MENU, 16);
  const dlgA = ramp(f, tProp, 8) * (1 - ramp(f, tOk + 3, 7));
  const bg = f >= tBg, timed = f >= tTimed, open = f >= tOpen;
  const mins = f >= tTimed + 10 ? typed("60", f, tTimed + 10, 6) : "";
  const q = qpPosLocal();
  const sel: Sel = f >= tCell ? { r1: 4, c1: 3, r2: 4, c2: 3 } : { r1: 2, c1: 2, r2: 2, c2: 2 };
  const wps = gw([
    { t: 0, x: 520, y: 300 }, { t: tData - 24, x: 560, y: 120 }, { t: tData - 2, x: tabAt("Data").x + 28, y: tabAt("Data").y + 14 }, { t: tData, x: tabAt("Data").x + 28, y: tabAt("Data").y + 14, click: true },
    { t: tQc - 18, x: rib("Data", "qc").x + 60, y: rib("Data", "qc").y + 12 }, { t: tQc, x: rib("Data", "qc").x + 60, y: rib("Data", "qc").y + 12, click: true },
    { t: tMenu - 22, x: card.x + 110, y: card.y + 30 }, { t: tMenu, x: card.x + 110, y: card.y + 30, click: true, right: true },
    { t: tProp - 8, x: mx + 70, y: propY }, { t: tProp, x: mx + 70, y: propY, click: true },
    { t: tBg - 22, x: q.bg.x, y: q.bg.y }, { t: tBg, x: q.bg.x, y: q.bg.y, click: true },
    { t: tTimed - 20, x: q.timed.x, y: q.timed.y }, { t: tTimed, x: q.timed.x, y: q.timed.y, click: true },
    { t: tOpen - 14, x: q.open.x, y: q.open.y }, { t: tOpen, x: q.open.x, y: q.open.y, click: true },
    { t: tOk - 30, x: q.ok.x, y: q.ok.y }, { t: tOk, x: q.ok.x, y: q.ok.y, click: true },
    { t: tCell - 18, x: 440, y: 400 }, { t: tCell, x: cellBox(4, 3).x + 30, y: 180 + 20 + cellBox(4, 3).h * 4 + 10 + 0, click: true },
  ]);
  const hov = f >= tQc - 8 && f < tQc ? "qc" : undefined;
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab={tab} name={`${String.fromCharCode(65 + sel.c1)}${sel.r1 + 1}`} formula={cellText(D, sel)} sel={sel} data={D} hover={hov} down={false}
        paneW={paneW} pane={paneW > 0 ? <QCPane x={M.win.w - paneW} state="loaded" f={f} /> : undefined}>
        {f >= tMenu && f < tProp + 4 && <Menu x={mx} y={mTop} w={236} items={QC_MENU} hi={f >= tProp - 10 ? 16 : -1} a={ramp(f, tMenu, 4)} />}
        {dlgA > 0 && <QueryProps a={dlgA} bg={bg} timed={timed} mins={mins} minsFocus={timed && f < tOpen} open={open} okDown={f >= tOk && f < tOk + 4}
          glow={open && f < tOk - 20 ? { k: "open", c: C.purple } : timed && f < tOpen ? { k: "timed", c: C.purple } : bg && f < tTimed ? { k: "bg", c: C.blue } : undefined} />}
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("props", 0.3)} t1={at("work", -0.3)} color={C.blue} text="Query Refresh Automation → Data → Queries & Connections → Properties" />
      <Caption f={f} t0={at("work")} t1={dur - 6} color={C.purple} text="Non-Blocking Operations → Background Refresh & Timed Auto-Refresh Enabled" />
    </Stage>
  );
};
function qpPosLocal() {
  return { bg: { x: QP.x + 44, y: QP.y + 232 }, timed: { x: QP.x + 44, y: QP.y + 258 }, open: { x: QP.x + 44, y: QP.y + 286 }, ok: { x: QP.x + QP.w - 138, y: QP.y + QP.h - 27 } };
}

// ---------------- Scene 4: Privacy & Fast Data Load ----------------
const S4: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[3]; const dur = s1 - s0; const at = mk("c4", s0);
  const tFile = at("file", -0.1), tOpt = tFile + 22, tSub = tFile + 50, tIgn = at("ignore", 0.3), tNav = at("ignore", 4.4), tFast = at("fast", 0.2), tOk = at("end", 1.4);
  const ft = pqFileTab;
  const fm = { x: ft.x, y: ft.y + ft.h };
  const sm = { x: fm.x + 200, y: fm.y + 3 + 24 * 2 + 7 };
  const dlgA = ramp(f, tSub + 4, 8) * (1 - ramp(f, tOk + 3, 7));
  const page: "privacy" | "load" = f >= tNav ? "load" : "privacy";
  const ign = f >= tIgn, fast = f >= tFast;
  const banner = ramp(f, at("start", 0.4)) * (1 - ramp(f, tOk + 8, 14));
  const done = ramp(f, tOk + 12, 10);
  const wps = gw([
    { t: 0, x: 700, y: 400 }, { t: tFile - 26, x: 600, y: 200 }, { t: tFile - 2, x: ft.x + 22, y: ft.y + 14 }, { t: tFile, x: ft.x + 22, y: ft.y + 14, click: true },
    { t: tOpt, x: fm.x + 80, y: fm.y + menuItemY(FILE_MENU, 3) }, { t: tSub - 8, x: sm.x + 60, y: sm.y + menuItemY(OPT_SUB, 0) }, { t: tSub, x: sm.x + 60, y: sm.y + menuItemY(OPT_SUB, 0), click: true },
    { t: tIgn - 22, x: QO.x + 240, y: QO.y + 172 }, { t: tIgn, x: QO.x + 240, y: QO.y + 172, click: true },
    { t: tNav - 18, x: QO.x + 90, y: QO.y + 75 }, { t: tNav, x: QO.x + 90, y: QO.y + 75, click: true },
    { t: tFast - 20, x: QO.x + 232, y: QO.y + 206 }, { t: tFast, x: QO.x + 232, y: QO.y + 206, click: true },
    { t: tOk - 26, x: QO.x + QO.w - 138, y: QO.y + QO.h - 29 }, { t: tOk, x: QO.x + QO.w - 138, y: QO.y + QO.h - 29, click: true },
  ]);
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <PQWin f={f} step={2} tab={f >= tFile && f < tSub + 4 ? "File" : "Home"} banner={banner}>
        {f >= tFile && f < tSub + 6 && <Menu x={fm.x} y={fm.y} w={230} items={FILE_MENU} hi={f >= tOpt ? 3 : -1} a={ramp(f, tFile, 4)} />}
        {f >= tSub - 12 && f < tSub + 6 && <Menu x={sm.x} y={sm.y} w={210} items={OPT_SUB} hi={f >= tSub - 6 ? 0 : -1} a={ramp(f, tSub - 12, 4)} />}
        {dlgA > 0 && <QueryOptions a={dlgA} page={page} ignore={ign} fast={fast} glow={page === "load" ? C.amber : C.green} okDown={f >= tOk && f < tOk + 4} />}
        {done > 0 && (
          <div style={abs(300, 250, 640, 90, { opacity: done, background: "rgba(15,23,42,0.96)", border: `3px solid ${C.green}`, borderRadius: 12, boxSizing: "border-box" })}>
            <Tx x={20} y={10} w={600} h={34} size={21} bold color={C.green}>Privacy prompts removed ✓</Tx>
            <Tx x={20} y={48} w={600} h={28} size={15} color="#E2E8F0">Merging sources no longer stops at the privacy warning</Tx>
          </div>
        )}
      </PQWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} />
      <Caption f={f} t0={at("start", 0.6)} t1={tIgn + 40} color={C.green} text="Privacy & Speed Optimization → Query Options → Privacy & Data Load" />
      <Caption f={f} t0={tFast - 10} t1={dur - 6} color={C.amber} text="Enterprise Acceleration → Ignore Privacy Levels & Fast Data Load Activated" />
    </Stage>
  );
};

// ---------------- Scene 5: enterprise refresh ----------------
const S5: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[4]; const dur = s1 - s0; const at = mk("c5", s0);
  const tRows = at("rows"), tRef = at("refresh", 0.35), tEnd = tRef + 100, tSeal = at("end"), tType = tRef + 30, tEnter = tType + 60;
  const rows = Math.floor(lerp(0, 50000, eo(prog(f, tRows - 10, tRows + 40))));
  const loading = f >= tRef && f < tEnd;
  const p = prog(f, tRef, tEnd);
  const typedTxt = typed("Q4 Target", f, tType, 8);
  const edit = f >= tType - 6 && f < tEnter ? { r: 1, c: 7, text: typedTxt } : undefined;
  const committed = f >= tEnter;
  const data = D.map((r, i) => (i === 1 && committed ? [...r, "", "Q4 Target"].slice(0, 9) : r));
  data[1] = committed ? [...D[1], "", "Q4 Target"] : D[1];
  const sel: Sel = { r1: 1, c1: 7, r2: 1, c2: 7 };
  const pane = <QCPane x={M.win.w - M.pane} state={loading ? "loading" : "loaded"} p={p} f={f} rows={`${fmt(rows)} rows loaded.`} glow={f >= tRows && f < tRef ? C.green : undefined} />;
  const rb = rib("Data", "ra");
  const wps = gw([
    { t: 0, x: 600, y: 500 }, { t: tRows, x: 900, y: 330 }, { t: tRef - 24, x: rb.x + 26, y: rb.y + 30 }, { t: tRef, x: rb.x + 26, y: rb.y + 30, click: true },
    { t: tType - 20, x: cellBox(1, 7).x + 20, y: 180 + 20 + 20 + 10 }, { t: tType - 6, x: cellBox(1, 7).x + 20, y: 180 + 20 + 20 + 10, click: true },
    { t: tEnter + 10, x: 700, y: 520 },
  ]);
  const seal = ramp(f, tSeal, 16);
  const marks = ["Query Folding", "Background Refresh", "Ignore Privacy Levels", "Fast Data Load"];
  return (
    <Stage dur={dur} fin={8} fout={8}>
      <ExcelWin f={f} tab="Data" name={edit ? "H2" : "H2"} formula={edit ? edit.text : committed ? "Q4 Target" : ""} sel={sel} data={data} edit={edit}
        paneW={M.pane} pane={pane} hover={f >= tRef - 10 && f < tRef ? "ra" : undefined} down={f >= tRef && f < tRef + 4} mode={loading ? "Ready" : "Ready"}>
        {f >= at("file", -0.5) && f < tRows && <Neon x={255} y={2} w={250} h={26} c={C.amber} a={ramp(f, at("file", -0.5))} r={4} />}
        {f >= tRef - 4 && f < tRef + 90 && (
          <div style={abs(rb.x - 40, rb.y + 80, 210, 46, { opacity: ramp(f, tRef - 4, 6) * (1 - ramp(f, tRef + 80, 10)), background: "#0F172A", borderRadius: 8, border: `2px solid ${C.blue}`, boxSizing: "border-box" })}>
            <Tx x={0} y={0} w={210} h={42} size={15} align="center" bold color="#fff" font={FONT.mono}>Ctrl + Alt + F5</Tx>
          </div>
        )}
        {f >= tEnd && f < tSeal && (
          <div style={abs(630, 330, 480, 74, { opacity: ramp(f, tEnd, 8), background: "rgba(15,23,42,0.96)", border: `3px solid ${C.green}`, borderRadius: 10, boxSizing: "border-box" })}>
            <Tx x={18} y={8} w={480} h={30} size={18} bold color={C.green}>Refresh complete ✓</Tx>
            <Tx x={18} y={38} w={490} h={26} size={14} color="#E2E8F0">The workbook stayed responsive the whole time</Tx>
          </div>
        )}
      </ExcelWin>
      <Header f={f} />
      <Cursor wps={wps} f={f} fade={1 - seal} />
      {seal > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: seal }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.82)" }} />
          <div style={{ position: "absolute", left: 660, top: 190, width: 600, height: 600, transform: `scale(${0.8 + 0.2 * seal})`, transformOrigin: "300px 300px" }}>
            <svg width={600} height={600} viewBox="0 0 600 600"><circle cx={300} cy={300} r={270} fill={C.panel} stroke={C.green} strokeWidth={10} /><circle cx={300} cy={300} r={236} fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="6 12" opacity={0.7} />
              <path d="M200 305l70 70 140-160" fill="none" stroke={C.green} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={420} strokeDashoffset={420 * (1 - prog(f, tSeal + 6, tSeal + 30))} /></svg>
            <div dir="ltr" style={{ position: "absolute", left: 0, top: 410, width: 600, textAlign: "center", fontFamily: FONT.ui, fontSize: 44, fontWeight: 700, color: C.text }}>UNIT {UNIT} COMPLETE</div>
            <div dir="ltr" style={{ position: "absolute", left: 0, top: 468, width: 600, textAlign: "center", fontFamily: FONT.ui, fontSize: 28, color: C.green }}>Power Query &amp; ETL Mastered</div>
          </div>
          {marks.map((m, i) => (
            <div key={m} dir="ltr" style={{ position: "absolute", left: i < 2 ? 130 : 1330, top: 300 + (i % 2) * 190, width: 460, height: 72, borderRadius: 36, border: `3px solid ${C.green}`, background: C.panel, color: C.text, fontFamily: FONT.ui, fontSize: 28, fontWeight: 600,
              lineHeight: "66px", textAlign: "center", opacity: ramp(f, tSeal + 50 + i * 60), transform: `translateX(${(1 - ramp(f, tSeal + 50 + i * 60)) * (i < 2 ? -40 : 40)}px)` }}>✓ {m}</div>
          ))}
        </div>
      )}
      <Caption f={f} t0={at("start", 0.6)} t1={tSeal - 4} color={C.green} text="Enterprise Refresh Pipeline → Refresh 50,000 Rows in the Background" />
      <Caption f={f} t0={tSeal + 10} t1={dur - 6} color={C.green} text="Unit 10 Completion Seal → Query Folding & Performance Optimization Mastered" />
    </Stage>
  );
};

// ---------------- Scene 6: academy outro ----------------
const S6: React.FC = () => {
  const f = useCurrentFrame(); const [s0, s1] = SC[5]; const dur = s1 - s0; const at = mk("c6", s0);
  const pct = (LESSON / TOTAL_LESSONS) * 100;
  const fill = eio(prog(f, at("unit"), at("unit", 3)));
  const skills = ["Query Folding & View Native Query", "Background & timed refresh", "Ignore Privacy Levels", "Fast Data Load", "Unit 10 · Power Query & ETL"];
  const nx = ramp(f, at("next"), 14);
  return (
    <Stage dur={dur} fin={8} fout={26}>
      <Header f={f} />
      <div style={{ position: "absolute", left: 130, top: 120, width: 1660, height: 860, borderRadius: 32, background: "rgba(30,41,59,0.88)", border: `2px solid ${C.line}`, opacity: ramp(f, 4, 14) }}>
        <Img src={staticFile(LOGO)} style={{ position: "absolute", left: 50, top: 50, width: 330, height: 330, objectFit: "contain", opacity: ramp(f, 10, 16) }} />
        <div dir="ltr" style={{ position: "absolute", left: 20, top: 400, width: 420, textAlign: "center", whiteSpace: "nowrap", fontFamily: FONT.ui, fontSize: 28, fontWeight: 700, color: C.text }}>Manzooma Excel Masterclass</div>
        <div dir="rtl" style={{ position: "absolute", left: 40, top: 446, width: 380, textAlign: "center", fontFamily: FONT.ar, fontSize: 30, color: C.dim }}>منظومة أكاديمي</div>
        <div style={{ position: "absolute", left: 460, top: 44, width: 1160 }}>
          <div dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 46, fontWeight: 700, color: C.green, opacity: ramp(f, at("start"), 12) }}>✓ Lesson {LESSON} complete</div>
          <div dir="rtl" style={{ fontFamily: FONT.ar, fontSize: 38, fontWeight: 500, color: C.text, marginTop: 6, opacity: ramp(f, at("start"), 12) }}>تحديث الاستعلامات وتحسين أدائها</div>
          <div dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 26, color: C.dim, marginTop: 4 }}>Refresh Properties &amp; Query Folding</div>
          <div dir="ltr" style={{ marginTop: 28, fontFamily: FONT.ui, fontSize: 24, color: C.text, display: "flex", justifyContent: "space-between", width: 1100 }}><span>{`Course progress  ${LESSON} / ${TOTAL_LESSONS}`}</span><span style={{ color: C.green, fontWeight: 700 }}>{`${(pct * fill).toFixed(1)}%`}</span></div>
          <div style={{ marginTop: 8, width: 1100, height: 20, borderRadius: 10, background: C.bg }}><div style={{ width: 1100 * (pct / 100) * fill, height: 20, borderRadius: 10, background: C.green }} /></div>
          <div dir="ltr" style={{ marginTop: 18, fontFamily: FONT.ui, fontSize: 22, color: C.dim }}>{`Unit ${UNIT} of ${TOTAL_UNITS} complete`}</div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "row", gap: 8, width: 1100, direction: "ltr" }}>
            {Array.from({ length: TOTAL_UNITS }).map((_, i) => <div key={i} style={{ flex: 1, height: 14, borderRadius: 7, background: i < UNIT * fill ? C.green : C.bg, border: `1px solid ${C.line}` }} />)}
          </div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 6 }}>
            {skills.map((s, i) => (
              <div key={s} dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 28, color: C.text, opacity: ramp(f, at("skills", i * 0.9), 10), transform: `translateX(${(1 - ramp(f, at("skills", i * 0.9), 10)) * 24}px)` }}><span style={{ color: C.green, fontWeight: 700 }}>✓ </span>{s}</div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, top: 520, width: 380, opacity: ramp(f, at("dl"), 12) }}>
          <div dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 21, color: C.dim, textAlign: "center" }}>Exercises &amp; practice file</div>
          <div dir="ltr" style={{ marginTop: 8, padding: "10px 0", borderRadius: 14, border: `2px solid ${C.blue}`, color: C.blue, fontFamily: FONT.mono, fontSize: 22, textAlign: "center" }}>solutions.gomaaintelligence.me</div>
          <div dir="ltr" style={{ marginTop: 10, padding: "10px 0", borderRadius: 14, border: `2px solid ${C.line}`, color: C.text, fontFamily: FONT.mono, fontSize: 18, textAlign: "center" }}>manzooma_sales_2026.xlsx</div>
        </div>
        <div style={{ position: "absolute", left: 460, top: 690, width: 1130, height: 130, borderRadius: 22, background: C.bg, border: `3px solid ${C.purple}`, opacity: nx, transform: `translateY(${(1 - nx) * 24}px)` }}>
          <div dir="rtl" style={{ position: "absolute", left: 30, top: 14, width: 1070, fontFamily: FONT.ar, fontSize: 26, color: C.purple, fontWeight: 700 }}>{`الدرس ${LESSON + 1} — بداية الوحدة ${UNIT + 1} من ${TOTAL_UNITS}`}</div>
          <div dir="ltr" style={{ position: "absolute", left: 30, top: 54, width: 1070, fontFamily: FONT.ui, fontSize: 36, fontWeight: 700, color: C.text }}>Data Model &amp; Power Pivot Engine</div>
        </div>
      </div>
    </Stage>
  );
};

const SCENES = [S1, S2, S3, S4, S5, S6];
export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(VOICE)} />
    {SC.map(([a, b], i) => {
      const Sc = SCENES[i];
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}><Sc /></Sequence>
      );
    })}
  </AbsoluteFill>
);
void DURATION; void XL; void Rect; void Btn; void Spinner; void clamp; void typed; void salesData;
