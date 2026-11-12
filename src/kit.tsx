// Shared Manzooma lesson kit: primitives, cursor, stage chrome, Excel UI, Power Query UI.
// Written once, reused by every lesson (change content in scenes, not here).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadAr } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadCal } from "@remotion/google-fonts/Carlito";
import { loadFont as loadUi } from "@remotion/google-fonts/OpenSans";
import { C, XL, M, LOGO, LESSON, TOTAL_LESSONS, UNIT, TOTAL_UNITS, W, H, TITLE_EN } from "./theme";

export type S = React.CSSProperties;
const ar = loadAr("normal", { weights: ["400", "500", "700"], subsets: ["arabic", "latin"] });
const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] });
const cal = loadCal("normal", { weights: ["400", "700"], subsets: ["latin"] });
const ui = loadUi("normal", { weights: ["400", "600"], subsets: ["latin"] });
export const FONT = {
  ar: `${ar.fontFamily}, sans-serif`,
  mono: `${mono.fontFamily}, monospace`,
  cell: `${cal.fontFamily}, Calibri, sans-serif`,
  ui: `${ui.fontFamily}, "Segoe UI", sans-serif`,
};

// ---------- math helpers ----------
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eo = (t: number) => 1 - Math.pow(1 - t, 3);
export const sec = (s: number) => Math.round(s * 30);
export const typed = (s: string, f: number, t0: number, cps = 16) =>
  s.slice(0, Math.max(0, Math.min(s.length, Math.floor(((f - t0) * cps) / 30))));
export const fmt = (n: number) => n.toLocaleString("en-US");

// ---------- tiny layout primitives ----------
export const abs = (x: number, y: number, w: number, h: number, extra: S = {}): S => ({
  position: "absolute", left: x, top: y, width: w, height: h, ...extra,
});
type TxP = { x: number; y: number; w?: number; h?: number; size?: number; color?: string; bold?: boolean;
  align?: "left" | "center" | "right"; font?: string; style?: S; children?: React.ReactNode };
export const Tx: React.FC<TxP> = ({ x, y, w = 400, h = 20, size = 12, color = XL.text, bold, align = "left", font, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, lineHeight: `${h}px`, fontSize: size,
    color, fontWeight: bold ? 700 : 400, textAlign: align, whiteSpace: "nowrap", overflow: "hidden",
    fontFamily: font ?? FONT.ui, ...style }}>{children}</div>
);
export const Rect: React.FC<{ x: number; y: number; w: number; h: number; fill?: string; stroke?: string; sw?: number; r?: number; style?: S; children?: React.ReactNode }> =
  ({ x, y, w, h, fill = "transparent", stroke, sw = 1, r = 0, style, children }) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: fill, borderRadius: r,
      boxSizing: "border-box", border: stroke ? `${sw}px solid ${stroke}` : undefined, ...style }}>{children}</div>
  );
// neon highlight ring (two flat strokes, no blur = cheap to render)
export const Neon: React.FC<{ x: number; y: number; w: number; h: number; c: string; a?: number; r?: number; pulse?: number }> =
  ({ x, y, w, h, c, a = 1, r = 6, pulse = 0 }) => (
    <div style={{ position: "absolute", left: x - 5, top: y - 5, width: w + 10, height: h + 10, opacity: a, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: -3 - pulse, borderRadius: r + 6, border: `2px solid ${c}`, opacity: 0.35 }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: r + 3, border: `3px solid ${c}`, boxSizing: "border-box" }} />
    </div>
  );

// ---------- icons (generic, own drawing; no Microsoft artwork) ----------
const ICO: Record<string, string> = {
  paste: "M9 3h6v3H9zM6 5h3M15 5h3M6 5v16h12V5", cut: "M6 3l9 12M18 3L9 15M7 17a2.5 2.5 0 1 0 .1 0M17 17a2.5 2.5 0 1 0 .1 0",
  copy: "M8 8h11v13H8zM5 16V3h11", brush: "M4 20c3 0 4-1 4-3l9-9-3-3-9 9c-2 0-3 1-1 6zM14 5l3 3",
  refresh: "M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5", table: "M3 5h18v14H3zM3 10h18M3 15h18M9 5v14M15 5v14",
  filter: "M3 4h18l-7 9v7l-4-2v-5z", sort: "M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4",
  az: "M4 7l3-4 3 4M7 3v9M4 21h6l-6-7h6M15 4v16M12 17l3 3 3-3", db: "M5 6c0-2 14-2 14 0v12c0 2-14 2-14 0zM5 6c0 2 14 2 14 0M5 12c0 2 14 2 14 0",
  link: "M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1",
  gear: "M12 8a4 4 0 1 0 .1 0M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",
  search: "M10 4a6 6 0 1 0 .1 0M15 15l6 6", save: "M4 4h14l2 2v14H4zM8 4v6h8V4M8 20v-6h8v6",
  undo: "M9 6L4 11l5 5M4 11h9a6 6 0 0 1 0 10h-3", redo: "M15 6l5 5-5 5M20 11h-9a6 6 0 0 0 0 10h3",
  query: "M5 4h14v16H5zM9 9h6M9 13h6M9 17h3", props: "M4 5h16M4 10h16M4 15h10M17 14l3 3-3 3",
  sigma: "M18 4H6l7 8-7 8h12", borders: "M4 4h16v16H4zM12 4v16M4 12h16", fill: "M5 13l7-8 7 8-7 7zM20 14c1 2 2 3 0 4",
  alignl: "M4 6h16M4 10h10M4 14h16M4 18h10", alignc: "M4 6h16M7 10h10M4 14h16M7 18h10", alignr: "M4 6h16M10 10h10M4 14h16M10 18h10",
  merge: "M4 6h6v12H4zM14 6h6v12h-6zM10 12h4", chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8",
  cond: "M4 4h16v16H4zM4 10h16M10 4v16", plus: "M12 5v14M5 12h14", minus: "M5 12h14", merge2: "M5 5v6a4 4 0 0 0 4 4h6M15 11l4 4-4 4",
  gen: "M4 4h16v16H4zM8 9h8M8 13h8", stock: "M4 18l5-6 4 3 7-9", find: "M10 4a6 6 0 1 0 .1 0M15 15l6 6M7 10h6",
  warn: "M12 3l10 18H2zM12 10v5M12 18v1", db2: "M4 7h16M4 12h16M4 17h16M8 4v16", cols: "M4 4h16v16H4zM9 4v16M15 4v16",
  rows: "M4 4h16v16H4zM4 9h16M4 15h16", group: "M4 6h10M8 12h10M4 18h10", what: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8a4 4 0 1 0 .1 0",
};
export const Ico: React.FC<{ n: string; x: number; y: number; s?: number; c?: string; sw?: number }> = ({ n, x, y, s = 16, c = "#444", sw = 1.8 }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={ICO[n] ?? ICO.gen} />
  </svg>
);

// ---------- cursor ----------
export type WP = { t: number; x: number; y: number; click?: boolean; right?: boolean };
export const curPos = (w: WP[], f: number): [number, number] => {
  if (f <= w[0].t) return [w[0].x, w[0].y];
  for (let i = 0; i < w.length - 1; i++) {
    const a = w[i], b = w[i + 1];
    if (f <= b.t) { const p = eio(prog(f, a.t, b.t)); return [lerp(a.x, b.x, p), lerp(a.y, b.y, p)]; }
  }
  const l = w[w.length - 1];
  return [l.x, l.y];
};
export const Cursor: React.FC<{ wps: WP[]; f: number; fade?: number }> = ({ wps, f, fade = 1 }) => {
  const [x, y] = curPos(wps, f);
  const ripples = wps.filter((w) => w.click && f >= w.t && f < w.t + 16);
  const down = wps.some((w) => w.click && f >= w.t && f < w.t + 4);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, pointerEvents: "none", opacity: fade }}>
      {ripples.map((w) => {
        const p = prog(f, w.t, w.t + 16);
        return <div key={"r" + w.t} style={{ position: "absolute", left: w.x - 22 * p - 4, top: w.y - 22 * p - 4, width: 44 * p + 8, height: 44 * p + 8,
          borderRadius: 40, border: `3px solid ${w.right ? C.purple : C.blue}`, opacity: 1 - p }} />;
      })}
      <svg style={{ position: "absolute", left: x, top: y, transform: down ? "scale(0.9)" : "none", transformOrigin: "0 0" }} width={28} height={38} viewBox="0 0 13 17">
        <path d="M0.5 0.5 L0.5 13.5 L3.7 10.6 L6 16 L8.3 15 L6 9.8 L10.6 9.8 Z" fill="#fff" stroke="#111" strokeWidth={1} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
export const clickedSince = (w: WP[], f: number, i: number) => f - w[i].t; // frames since click i (negative = not yet)

// ---------- stage chrome ----------
export const Stage: React.FC<{ dur: number; fin?: number; fout?: number; children?: React.ReactNode }> = ({ dur, fin = 10, fout = 10, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(fin ? prog(f, 0, fin) : 1, fout ? 1 - prog(f, dur - fout, dur) : 1);
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1200px 700px at 50% 45%, #16213a 0%, #0F172A 70%)" }} />
      {children}
    </AbsoluteFill>
  );
};
export const Header: React.FC<{ f: number }> = ({ f }) => {
  const a = eo(prog(f, 0, 14));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 84, opacity: a }}>
      <Img src={staticFile(LOGO)} style={{ position: "absolute", left: 36, top: 6, width: 72, height: 72, objectFit: "contain" }} />
      <div style={{ position: "absolute", left: 360, top: 14, width: 1200, height: 56, borderRadius: 28, background: C.panel, border: `1px solid ${C.line}`,
        display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18, direction: "ltr" }}>
        <span dir="rtl" style={{ fontFamily: FONT.ar, fontSize: 26, fontWeight: 700, color: C.text }}>{`الدرس ${LESSON} من ${TOTAL_LESSONS} | الوحدة ${UNIT} من ${TOTAL_UNITS}`}</span>
        <span style={{ fontFamily: FONT.ui, fontSize: 24, color: C.blue }}>→</span>
        <span dir="ltr" style={{ fontFamily: FONT.ui, fontSize: 25, fontWeight: 600, color: C.blue }}>{TITLE_EN}</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 22, height: 40, padding: "0 18px", borderRadius: 20, background: C.panel, border: `1px solid ${C.line}`,
        fontFamily: FONT.mono, fontSize: 20, lineHeight: "38px", color: C.dim }}>{`L${LESSON}/${TOTAL_LESSONS}`}</div>
    </div>
  );
};
export const Caption: React.FC<{ f: number; t0: number; t1: number; color: string; text: string }> = ({ f, t0, t1, color, text }) => {
  const a = Math.min(prog(f, t0, t0 + 10), 1 - prog(f, t1 - 10, t1));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 1006, width: W, height: 58, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(${(1 - a) * 12}px)` }}>
      <div dir="ltr" style={{ height: 52, padding: "0 30px", borderRadius: 26, background: C.panel, border: `2px solid ${color}`, color: C.text,
        fontFamily: FONT.ui, fontSize: 25, fontWeight: 600, lineHeight: "48px", whiteSpace: "nowrap" }}>
        <span style={{ color, marginRight: 12 }}>●</span>{text}
      </div>
    </div>
  );
};
export const Spinner: React.FC<{ x: number; y: number; s?: number; f: number; c?: string }> = ({ x, y, s = 18, f, c = XL.green }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round">
    <circle cx={12} cy={12} r={9} stroke="#D0D0D0" />
    <path d="M12 3a9 9 0 0 1 9 9" transform={`rotate(${(f * 12) % 360} 12 12)`} />
  </svg>
);
const SQLK = /\b(select|from|where|as|and|or|group by|order by|left join|on)\b/gi;
export const Sql: React.FC<{ text: string; size?: number; lh?: number; light?: boolean }> = ({ text, size = 15, lh = 22, light }) => (
  <div style={{ fontFamily: FONT.mono, fontSize: size, lineHeight: `${lh}px`, whiteSpace: "pre", color: light ? "#1F2937" : "#CBD5E1" }}>
    {text.split("\n").map((ln, i) => (
      <div key={i}>{ln.split(/(\bselect\b|\bfrom\b|\bwhere\b|\bas\b|\band\b|'[^']*')/gi).map((p, j) => (
        <span key={j} style={{ color: /^(select|from|where|as|and)$/i.test(p) ? (light ? "#0B5CAD" : C.blue) : p.startsWith("'") ? (light ? "#0A7F4F" : C.green) : undefined, fontWeight: /^(select|from|where|as|and)$/i.test(p) ? 700 : 400 }}>{p}</span>
      ))}</div>
    ))}
  </div>
);
void SQLK;

// ---------- Windows-style widgets (nominal coordinates inside <Win>) ----------
export const Win: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={abs(M.win.x, M.win.y, M.win.w * M.Z, M.win.h * M.Z, { overflow: "hidden", borderRadius: 10, background: "#fff", boxSizing: "border-box", border: "1px solid #475569" })}>
    <div style={{ position: "absolute", left: 0, top: 0, width: M.win.w, height: M.win.h, transform: `scale(${M.Z})`, transformOrigin: "0 0", overflow: "hidden" }}>{children}</div>
  </div>
);
export const Btn: React.FC<{ x: number; y: number; w: number; h?: number; label: string; def?: boolean; down?: boolean; dis?: boolean }> = ({ x, y, w, h = 24, label, def, down, dis }) => (
  <div style={abs(x, y, w, h, { boxSizing: "border-box", background: down ? "#CCE4F7" : "#E1E1E1", border: `${def || down ? 2 : 1}px solid ${down ? "#005499" : def ? "#0078D7" : "#ADADAD"}`,
    textAlign: "center", lineHeight: `${h - 4}px`, fontSize: 12, color: dis ? "#9A9A9A" : "#111", fontFamily: FONT.ui })}>{label}</div>
);
export const Chk: React.FC<{ x: number; y: number; label: string; on: boolean; w?: number; dis?: boolean; radio?: boolean }> = ({ x, y, label, on, w = 330, dis, radio }) => (
  <div style={abs(x, y, w, 20)}>
    <div style={abs(0, 3, 14, 14, { boxSizing: "border-box", background: "#fff", border: `1px solid ${dis ? "#BBB" : "#333"}`, borderRadius: radio ? 8 : 0 })}>
      {on && !radio && <svg width={12} height={12} viewBox="0 0 12 12" style={{ position: "absolute", left: 0, top: 0 }}><path d="M2 6.5l3 3 5-6" fill="none" stroke={dis ? "#999" : "#111"} strokeWidth={1.6} /></svg>}
      {on && radio && <div style={abs(3, 3, 6, 6, { borderRadius: 6, background: "#111" })} />}
    </div>
    <Tx x={22} y={0} w={w - 22} h={20} size={12} color={dis ? "#8C8C8C" : "#111"}>{label}</Tx>
  </div>
);
export const Inp: React.FC<{ x: number; y: number; w: number; h?: number; text: string; focus?: boolean; caret?: boolean; dd?: boolean }> = ({ x, y, w, h = 22, text, focus, caret, dd }) => (
  <div style={abs(x, y, w, h, { boxSizing: "border-box", background: "#fff", border: `1px solid ${focus ? "#0078D7" : "#7A7A7A"}`, fontSize: 12, lineHeight: `${h - 2}px`, paddingLeft: 5, fontFamily: FONT.ui, color: "#111", overflow: "hidden", whiteSpace: "nowrap" })}>
    {text}{caret ? <span style={{ borderLeft: "1px solid #111", marginLeft: 1 }} /> : null}
    {dd && <span style={{ position: "absolute", right: 5, top: 0, fontSize: 9, color: "#444" }}>▼</span>}
  </div>
);
export const Dlg: React.FC<{ x: number; y: number; w: number; h: number; title: string; a?: number; children?: React.ReactNode }> = ({ x, y, w, h, title, a = 1, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: M.win.w, height: M.win.h, opacity: a, transform: `scale(${0.97 + 0.03 * a})`, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, pointerEvents: "none" }}>
    <div style={abs(x + 4, y + 6, w, h, { background: "rgba(0,0,0,0.28)" })} />
    <div style={abs(x, y, w, h, { background: XL.dlg, border: "1px solid #7A7A7A", boxSizing: "border-box" })}>
      <div style={abs(0, 0, w - 2, 30, { background: "#fff" })} />
      <Tx x={10} y={0} w={w - 60} h={30} size={12} color="#111">{title}</Tx>
      <Tx x={w - 40} y={0} w={36} h={30} size={14} align="center" color="#111">✕</Tx>
      {children}
    </div>
  </div>
);
export type MenuItem = { l: string; dis?: boolean; sep?: boolean; sub?: boolean; ic?: string };
export const Menu: React.FC<{ x: number; y: number; w: number; items: MenuItem[]; hi?: number; a?: number }> = ({ x, y, w, items, hi = -1, a = 1 }) => {
  let yy = 3;
  const rows = items.map((it, i) => {
    const y0 = yy; yy += it.sep ? 7 : 24;
    return (
      <div key={i} style={abs(2, y0, w - 4, it.sep ? 7 : 24)}>
        {it.sep ? <div style={abs(28, 3, w - 36, 1, { background: "#D4D4D4" })} /> : (
          <div>
            {i === hi && <div style={abs(0, 0, w - 4, 24, { background: XL.hover, border: `1px solid ${XL.hoverLine}`, boxSizing: "border-box" })} />}
            {it.ic && <Ico n={it.ic} x={7} y={4} s={16} c={it.dis ? "#B0B0B0" : "#555"} sw={1.6} />}
            <Tx x={30} y={0} w={w - 60} h={24} size={12.5} color={it.dis ? "#A0A0A0" : "#111"}>{it.l}</Tx>
            {it.sub && <Tx x={w - 24} y={0} w={14} h={24} size={10} color="#444">▶</Tx>}
          </div>
        )}
      </div>
    );
  });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: yy + 3, opacity: a, background: "#fff", border: "1px solid #C8C8C8", boxSizing: "border-box", boxShadow: "3px 4px 0 rgba(0,0,0,0.18)" }}>{rows}</div>
  );
};
export const menuItemY = (items: MenuItem[], idx: number) => {
  let yy = 3;
  for (let i = 0; i < idx; i++) yy += items[i].sep ? 7 : 24;
  return yy + 12;
};

// ---------- Excel ribbon (positions shared by renderer and cursor targets) ----------
type Item = { k: string; l: string; ic: string; big?: boolean; dd?: boolean; box?: number; nl?: boolean };
type Group = { n: string; cols?: Item[][]; rows?: Item[][] };
const I = (k: string, l: string, ic: string, o: Partial<Item> = {}): Item => ({ k, l, ic, ...o });
const RIBBONS: Record<string, Group[]> = {
  PPHome: [
    { n: "Clipboard", cols: [[I("pst", "Paste", "paste", { big: true, dd: true })]] },
    { n: "Get External Data", cols: [[I("fdb", "From Database", "db", { big: true, dd: true })], [I("fos", "From Other Sources", "link", { big: true, dd: true })], [I("fex", "Existing Connections", "link", { big: true })]] },
    { n: "PivotTable", cols: [[I("pvt", "PivotTable", "table", { big: true, dd: true })]] },
    { n: "Formatting", rows: [[I("dty", "Data Type: Whole Number", "", { box: 210 })], [I("fmt2", "Format: General", "", { box: 210 })]] },
    { n: "Sort and Filter", cols: [[I("sa", "Sort A to Z", "az"), I("sz", "Sort Z to A", "az"), I("cas", "Clear All Sorts", "minus")]] },
    { n: "Find", cols: [[I("fnd", "Find", "find", { big: true })]] },
    { n: "Calculations", cols: [[I("asum", "AutoSum", "sigma", { big: true, dd: true })], [I("kpi", "Create KPI", "chart", { big: true })]] },
    { n: "View", cols: [[I("dv", "Data View", "table", { big: true })], [I("dgv", "Diagram View", "db2", { big: true })], [I("shh", "Show Hidden", "gen", { big: true })], [I("cav", "Calculation Area", "cols", { big: true })]] },
  ],
  PQHome: [
    { n: "Close", cols: [[I("cl", "Close & Load", "save", { big: true, dd: true })]] },
    { n: "Query", cols: [[I("rp", "Refresh Preview", "refresh", { big: true, dd: true })], [I("pp", "Properties", "props"), I("ae", "Advanced Editor", "gen"), I("mg", "Manage", "gear", { dd: true })]] },
    { n: "Manage Columns", cols: [[I("cc", "Choose Columns", "cols", { big: true, dd: true })], [I("rcl", "Remove Columns", "minus", { big: true, dd: true })]] },
    { n: "Reduce Rows", cols: [[I("kr", "Keep Rows", "rows", { big: true, dd: true })], [I("rr", "Remove Rows", "rows", { big: true, dd: true })]] },
    { n: "Sort", cols: [[I("s1", "", "az", { nl: true }), I("s2", "", "az", { nl: true })]] },
    { n: "Transform", cols: [[I("sc", "Split Column", "cols", { big: true, dd: true })], [I("gb", "Group By", "group", { big: true })], [I("dt", "Data Type: Any", "gen", { dd: true }), I("uh", "Use First Row as Headers", "table", { dd: true }), I("rv", "Replace Values", "find")]] },
    { n: "Combine", cols: [[I("mq", "Merge Queries", "merge2", { big: true, dd: true })], [I("aq", "Append Queries", "plus", { big: true, dd: true })]] },
  ],
  Home: [
    { n: "Clipboard", cols: [[I("paste", "Paste", "paste", { big: true, dd: true })], [I("cut", "Cut", "cut"), I("copy", "Copy", "copy", { dd: true }), I("fp", "Format Painter", "brush")]] },
    { n: "Font", rows: [[I("fn", "Calibri", "", { box: 104 }), I("fs", "11", "", { box: 38 }), I("fg", "A", "", { nl: true }), I("fs2", "A", "", { nl: true })],
      [I("b", "B", "", { nl: true }), I("i", "I", "", { nl: true }), I("u", "U", "", { nl: true }), I("bd", "", "borders", { nl: true }), I("fl", "", "fill", { nl: true }), I("fc", "A", "", { nl: true })]] },
    { n: "Alignment", rows: [[I("al1", "", "alignl", { nl: true }), I("al2", "", "alignc", { nl: true }), I("al3", "", "alignr", { nl: true }), I("wr", "Wrap Text", "gen")],
      [I("al4", "", "alignl", { nl: true }), I("al5", "", "alignc", { nl: true }), I("al6", "", "alignr", { nl: true }), I("mc", "Merge & Center", "merge", { dd: true })]] },
    { n: "Number", rows: [[I("nf", "General", "", { box: 150 })], [I("cur", "$", "", { nl: true }), I("pct", "%", "", { nl: true }), I("com", ",", "", { nl: true }), I("d1", ".00", "", { nl: true }), I("d2", ".0", "", { nl: true })]] },
    { n: "Styles", cols: [[I("cf", "Conditional Formatting", "cond", { big: true, dd: true })], [I("ft", "Format as Table", "table", { big: true, dd: true })], [I("cs", "Cell Styles", "gen", { big: true, dd: true })]] },
    { n: "Cells", cols: [[I("ins", "Insert", "plus", { big: true, dd: true })], [I("del", "Delete", "minus", { big: true, dd: true })], [I("fmt", "Format", "cols", { big: true, dd: true })]] },
    { n: "Editing", cols: [[I("sum", "AutoSum", "sigma", { dd: true }), I("fill", "Fill", "fill", { dd: true }), I("clr", "Clear", "minus", { dd: true })], [I("sf", "Sort & Filter", "sort", { big: true, dd: true })], [I("fs3", "Find & Select", "find", { big: true, dd: true })]] },
  ],
  Data: [
    { n: "Get & Transform Data", cols: [[I("gd", "Get Data", "db", { big: true, dd: true })], [I("txt", "From Text/CSV", "gen"), I("web", "From Web", "link"), I("tbl", "From Table/Range", "table")], [I("rs", "Recent Sources", "db2"), I("ec", "Existing Connections", "link")]] },
    { n: "Queries & Connections", cols: [[I("ra", "Refresh All", "refresh", { big: true, dd: true })], [I("qc", "Queries & Connections", "query"), I("pr", "Properties", "props"), I("el", "Edit Links", "link")]] },
    { n: "Data Types", cols: [[I("stk", "Stocks", "stock", { big: true })], [I("cur2", "Currencies", "stock", { big: true })]] },
    { n: "Sort & Filter", cols: [[I("az", "", "az", { nl: true }), I("za", "", "az", { nl: true })], [I("srt", "Sort", "sort", { big: true })], [I("flt", "Filter", "filter", { big: true })], [I("rc", "Clear", "minus"), I("rp", "Reapply", "refresh"), I("adv", "Advanced", "filter")]] },
    { n: "Data Tools", cols: [[I("t2c", "Text to Columns", "cols", { big: true })], [I("ff", "Flash Fill", "gen"), I("rd", "Remove Duplicates", "rows"), I("dv", "Data Validation", "gen")], [I("cons", "Consolidate", "merge2"), I("rel", "Relationships", "link"), I("dm", "Manage Data Model", "db")]] },
  ],
};
export type Box = { x: number; y: number; w: number; h: number };
const RY = M.title + M.tabs;
const colWidth = (c: Item[]) => c[0].big ? Math.max(48, Math.max(...c[0].l.split(" ").map((s) => s.length + 2)) * 6.6 + 12)
  : Math.max(...c.map((i) => (i.nl ? 26 : i.box ? i.box + 4 : i.l.length * 6.3 + 32)));
const LAY: Record<string, { items: (Item & Box)[]; groups: { n: string; x: number; w: number }[] }> = {};
Object.keys(RIBBONS).forEach((tab) => {
  let x = 6; const items: (Item & Box)[] = []; const groups: { n: string; x: number; w: number }[] = [];
  RIBBONS[tab].forEach((g) => {
    const x0 = x;
    if (g.cols) g.cols.forEach((c) => {
      const w = colWidth(c);
      c.forEach((it, i) => items.push(it.big ? { ...it, x, y: RY + 3, w, h: 74 } : { ...it, x, y: RY + 3 + i * 25, w, h: 24 }));
      x += w + 2;
    });
    if (g.rows) {
      let mw = 0;
      g.rows.forEach((r, ri) => { let xx = x; r.forEach((it) => { const w = it.nl ? 24 : it.box ? it.box : it.l.length * 6.3 + 32; items.push({ ...it, x: xx, y: RY + 8 + ri * 32, w, h: 26 }); xx += w + 2; }); mw = Math.max(mw, xx - x); });
      x += mw;
    }
    x += 8; groups.push({ n: g.n, x: x0, w: x - x0 }); x += 6;
  });
  LAY[tab] = { items, groups };
});
export const rib = (tab: string, k: string): Box => { const it = LAY[tab].items.find((i) => i.k === k); return it ? { x: it.x, y: it.y, w: it.w, h: it.h } : { x: 0, y: 0, w: 10, h: 10 }; };
const TABS = ["File", "Home", "Insert", "Draw", "Page Layout", "Formulas", "Data", "Review", "View", "Automate", "Help"];
const tabBox: Record<string, Box> = {};
{ let x = 8; TABS.forEach((t) => { const w = t.length * 7 + 24; tabBox[t] = { x, y: M.title, w, h: M.tabs }; x += w; }); }
export const tabAt = (t: string): Box => tabBox[t];

const RibbonItems: React.FC<{ tab: string }> = ({ tab }) => {
  const L = LAY[tab] ?? LAY.Home;
  return (
    <div>
      {L.items.map((it) => (
        <div key={it.k} style={abs(it.x, it.y, it.w, it.h)}>
          {it.big ? (
            <div>
              <Ico n={it.ic} x={(it.w - 30) / 2} y={4} s={30} c={XL.green} sw={1.5} />
              <Tx x={0} y={38} w={it.w} h={15} size={11.5} align="center">{it.l.split(" ").length > 1 ? it.l.split(" ").slice(0, -1).join(" ") : it.l}</Tx>
              <Tx x={0} y={52} w={it.w} h={15} size={11.5} align="center">{it.l.split(" ").length > 1 ? it.l.split(" ").slice(-1)[0] + (it.dd ? " ▾" : "") : it.dd ? "▾" : ""}</Tx>
            </div>
          ) : it.box ? (
            <div><Rect x={0} y={2} w={it.w} h={22} fill="#fff" stroke="#B8B8B8" /><Tx x={5} y={2} w={it.w - 20} h={22} size={12}>{it.l}</Tx><Tx x={it.w - 16} y={2} w={14} h={22} size={8} color="#555">▼</Tx></div>
          ) : it.nl ? (
            it.ic ? <Ico n={it.ic} x={4} y={4} s={16} c="#444" sw={1.6} /> : <Tx x={0} y={0} w={it.w} h={26} size={it.k === "fg" || it.k === "fs2" ? 14 : 13} align="center" bold={it.k === "b"} style={{ fontStyle: it.k === "i" ? "italic" : "normal", textDecoration: it.k === "u" ? "underline" : "none", fontFamily: FONT.cell }}>{it.l}</Tx>
          ) : (
            <div><Ico n={it.ic} x={4} y={4} s={16} c={it.ic === "gen" ? "#666" : XL.green} sw={1.6} /><Tx x={26} y={0} w={it.w - 26} h={24} size={11.5}>{it.l}{it.dd ? " ▾" : ""}</Tx></div>
          )}
        </div>
      ))}
      {L.groups.map((g) => (
        <div key={g.n}>
          <Tx x={g.x} y={RY + 78} w={g.w} h={16} size={11} align="center" color="#555">{g.n}</Tx>
          <div style={abs(g.x + g.w + 2, RY + 6, 1, 84, { background: "#E1E1E1" })} />
        </div>
      ))}
    </div>
  );
};

// ---------- Excel window ----------
export type Sel = { r1: number; c1: number; r2: number; c2: number };
export type Edit = { r: number; c: number; text: string };
const colName = (c: number) => { let s = ""; let n = c + 1; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
export const COLWS = [100, 100, 86, 86, 64, 92];
const colX = (c: number) => M.rowHdrW + (c < COLWS.length ? COLWS.slice(0, c).reduce((a, b) => a + b, 0) : COLWS.reduce((a, b) => a + b, 0) + (c - COLWS.length) * M.colW);
const colWd = (c: number) => (c < COLWS.length ? COLWS[c] : M.colW);
export const cellBox = (r: number, c: number): Box => ({ x: colX(c), y: RY + M.ribbon - 0 + M.fbar + M.colH + r * M.rowH, w: colWd(c), h: M.rowH });
const GY = RY + M.ribbon + M.fbar; // grid top (column headers)
export const GRID_ROWS = 22;
const SBY = M.win.h - M.status - M.sheetBar;

const Chrome = React.memo(({ tab, file }: { tab: string; file: string }) => (
  <div>
    <div style={abs(0, 0, M.win.w, M.title, { background: "#F3F3F3" })} />
    <div style={abs(10, 7, 16, 16, { background: XL.green, borderRadius: 3 })}><svg width={16} height={16} viewBox="0 0 16 16"><path d="M4 4h8v8H4zM4 8h8M8 4v8" stroke="#fff" strokeWidth={1.2} fill="none" /></svg></div>
    <Tx x={34} y={0} w={60} h={30} size={12}>AutoSave</Tx>
    <div style={abs(92, 8, 28, 14, { borderRadius: 7, border: "1px solid #666", boxSizing: "border-box" })}><div style={abs(2, 2, 8, 8, { borderRadius: 4, background: "#666" })} /></div>
    <Tx x={124} y={0} w={24} h={30} size={11} color="#555">Off</Tx>
    <Ico n="save" x={156} y={7} s={16} c="#444" sw={1.5} /><Ico n="undo" x={184} y={7} s={16} c="#444" sw={1.5} /><Ico n="redo" x={208} y={7} s={16} c="#444" sw={1.5} />
    <Tx x={232} y={0} w={14} h={30} size={9} color="#555">▼</Tx>
    <Tx x={262} y={0} w={240} h={30} size={12.5} bold>{file} - Saved</Tx>
    <Rect x={540} y={4} w={340} h={22} fill="#fff" stroke="#C8C8C8" r={4} />
    <Ico n="search" x={548} y={7} s={15} c="#555" sw={1.8} /><Tx x={572} y={4} w={100} h={22} size={12} color="#666">Search</Tx>
    <Tx x={1040} y={0} w={70} h={30} size={12}>Comments</Tx>
    <Rect x={1126} y={4} w={64} h={22} fill={XL.green} r={4} /><Tx x={1126} y={4} w={64} h={22} size={12} color="#fff" align="center">Share</Tx>
    <Tx x={1260} y={0} w={40} h={30} size={14} align="center" color="#333">—</Tx><Tx x={1310} y={0} w={40} h={30} size={13} align="center" color="#333">☐</Tx><Tx x={1355} y={0} w={40} h={30} size={14} align="center" color="#333">✕</Tx>
    <div style={abs(0, M.title, M.win.w, M.tabs, { background: "#F3F3F3" })} />
    {TABS.map((t) => (
      <div key={t}>
        <Tx x={tabBox[t].x} y={M.title} w={tabBox[t].w} h={M.tabs} size={12.5} align="center" bold={t === tab} color={t === tab ? "#111" : "#333"}>{t}</Tx>
        {t === tab && <div style={abs(tabBox[t].x + 10, M.title + M.tabs - 3, tabBox[t].w - 20, 3, { background: XL.green, borderRadius: 2 })} />}
      </div>
    ))}
    <div style={abs(0, RY, M.win.w, M.ribbon, { background: "#fff", borderTop: "1px solid #E1E1E1", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} />
    <RibbonItems tab={tab} />
  </div>
));
export const RibbonHL: React.FC<{ tab: string; k: string; down?: boolean }> = ({ tab, k, down }) => {
  const b = rib(tab, k);
  return <div style={abs(b.x, b.y, b.w, b.h, { background: down ? "rgba(0,0,0,0.14)" : "rgba(0,0,0,0.07)", border: "1px solid #C6C6C6", boxSizing: "border-box", borderRadius: 3 })} />;
};
const FormulaBar: React.FC<{ name: string; text: string; editing?: boolean; w: number }> = ({ name, text, editing, w }) => (
  <div>
    <div style={abs(0, RY + M.ribbon, w, M.fbar, { background: "#fff", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} />
    <Rect x={6} y={RY + M.ribbon + 3} w={104} h={20} fill="#fff" stroke="#BDBDBD" />
    <Tx x={10} y={RY + M.ribbon + 3} w={80} h={20} size={12}>{name}</Tx><Tx x={94} y={RY + M.ribbon + 3} w={14} h={20} size={8} color="#555">▼</Tx>
    <Tx x={122} y={RY + M.ribbon + 3} w={20} h={20} size={13} color={editing ? "#C42B1C" : "#BBB"} align="center">✕</Tx>
    <Tx x={144} y={RY + M.ribbon + 3} w={20} h={20} size={13} color={editing ? XL.green : "#BBB"} align="center">✓</Tx>
    <Tx x={168} y={RY + M.ribbon + 3} w={22} h={20} size={13} color="#555" align="center" style={{ fontStyle: "italic", fontFamily: FONT.cell }}>fx</Tx>
    <Rect x={194} y={RY + M.ribbon + 3} w={w - 230} h={20} fill="#fff" stroke={editing ? "#8A8A8A" : "#E1E1E1"} />
    <Tx x={200} y={RY + M.ribbon + 3} w={w - 250} h={20} size={13} font={FONT.cell}>{text}</Tx>
    <Tx x={w - 30} y={RY + M.ribbon + 3} w={20} h={20} size={9} color="#555" align="center">▼</Tx>
  </div>
);
const Grid: React.FC<{ w: number; data: string[][]; right: number[]; tc: number; table: boolean; sel: Sel; edit?: Edit; ants?: Sel; f: number }> = ({ w, data, right, tc, table, sel, edit, ants, f }) => {
  const nC = Math.ceil((w - M.rowHdrW) / M.colW) + 2;
  const gh = M.colH + GRID_ROWS * M.rowH;
  let hl = "", vl = "";
  for (let r = 0; r <= GRID_ROWS; r++) hl += `M0 ${M.colH + r * M.rowH + 0.5}H${w}`;
  for (let c = 0; c <= nC; c++) vl += `M${colX(c) + 0.5} 0V${gh}`;
  const r1 = Math.min(sel.r1, sel.r2), r2 = Math.max(sel.r1, sel.r2), c1 = Math.min(sel.c1, sel.c2), c2 = Math.max(sel.c1, sel.c2);
  const sb = (a: Sel): Box => { const A = cellBox(Math.min(a.r1, a.r2), Math.min(a.c1, a.c2)), B = cellBox(Math.max(a.r1, a.r2), Math.max(a.c1, a.c2)); return { x: A.x, y: A.y - GY, w: B.x + B.w - A.x, h: B.y + B.h - A.y }; };
  const s = sb({ r1, c1, r2, c2 });
  const multi = r1 !== r2 || c1 !== c2;
  const tW = COLWS.slice(0, tc).reduce((a, b) => a + b, 0);
  return (
    <div style={abs(0, GY, w, gh, { overflow: "hidden", background: "#fff" })}>
      {table && <div style={abs(M.rowHdrW, M.colH, tW, M.rowH, { background: XL.tbl })} />}
      {table && data.slice(1).map((_, i) => i % 2 === 0 ? <div key={"b" + i} style={abs(M.rowHdrW, M.colH + (i + 1) * M.rowH, tW, M.rowH, { background: XL.band })} /> : null)}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={w} height={gh}><path d={hl + vl} stroke={XL.grid} strokeWidth={1} fill="none" /></svg>
      {table && <svg style={{ position: "absolute", left: 0, top: 0 }} width={w} height={gh}><path d={`M${M.rowHdrW} ${M.colH + M.rowH + 0.5}H${M.rowHdrW + tW}`} stroke="#fff" strokeWidth={0} fill="none" /></svg>}
      <div style={abs(0, 0, w, M.colH, { background: XL.hdr, borderBottom: "1px solid #BEBEBE", boxSizing: "border-box" })} />
      <div style={abs(0, 0, M.rowHdrW, gh, { background: XL.hdr, borderRight: "1px solid #BEBEBE", boxSizing: "border-box" })} />
      {Array.from({ length: nC }).map((_, c) => {
        const on = c >= c1 && c <= c2;
        return (
          <div key={"h" + c}>
            <div style={abs(colX(c), 0, colWd(c), M.colH, { background: on ? XL.hdrSel : "transparent", borderRight: "1px solid #D0D0D0", borderBottom: on ? `2px solid ${XL.green}` : undefined, boxSizing: "border-box" })} />
            <Tx x={colX(c)} y={0} w={colWd(c)} h={M.colH} size={12} align="center" color={on ? XL.green : "#444"} bold={on}>{colName(c)}</Tx>
          </div>
        );
      })}
      {Array.from({ length: GRID_ROWS }).map((_, r) => {
        const on = r >= r1 && r <= r2;
        return (
          <div key={"r" + r}>
            <div style={abs(0, M.colH + r * M.rowH, M.rowHdrW, M.rowH, { background: on ? XL.hdrSel : "transparent", borderBottom: "1px solid #D0D0D0", borderRight: on ? `2px solid ${XL.green}` : undefined, boxSizing: "border-box" })} />
            <Tx x={0} y={M.colH + r * M.rowH} w={M.rowHdrW - 2} h={M.rowH} size={12} align="center" color={on ? XL.green : "#444"} bold={on}>{r + 1}</Tx>
          </div>
        );
      })}
      {data.map((row, r) => row.map((v, c) => {
        if (v === "" || (edit && edit.r === r && edit.c === c)) return null;
        const hdr = table && r === 0;
        return <Tx key={r + "_" + c} x={colX(c) + 3} y={M.colH + r * M.rowH} w={colWd(c) - 6} h={M.rowH} size={14.5} font={FONT.cell} bold={hdr} color={hdr ? "#fff" : "#000"} align={right.includes(c) && !hdr ? "right" : "left"}>{v}</Tx>;
      }))}
      {multi && <div style={abs(s.x, s.y, s.w, s.h, { background: XL.greenFill })} />}
      {ants && (() => { const a = sb(ants); return <svg style={{ position: "absolute", left: a.x - 1, top: a.y - 1 }} width={a.w + 3} height={a.h + 3}><rect x={1} y={1} width={a.w} height={a.h} fill="none" stroke="#217346" strokeWidth={2} strokeDasharray="5 4" strokeDashoffset={-(f * 0.7)} /></svg>; })()}
      {edit && (() => { const b = sb({ r1: edit.r, c1: edit.c, r2: edit.r, c2: edit.c }); return (
        <div style={abs(b.x, b.y, Math.max(b.w, 9 * edit.text.length + 12), b.h, { background: "#fff", border: `2px solid ${XL.green}`, boxSizing: "border-box" })}>
          <Tx x={2} y={-1} w={300} h={M.rowH} size={14.5} font={FONT.cell} color="#000">{edit.text}{Math.floor(f / 15) % 2 === 0 ? "|" : ""}</Tx>
        </div>); })()}
      {!edit && <div style={abs(s.x - 1, s.y - 1, s.w + 2, s.h + 2, { border: `2px solid ${XL.green}`, boxSizing: "border-box" })} />}
      {!edit && <div style={abs(s.x + s.w - 4, s.y + s.h - 4, 7, 7, { background: XL.green, border: "1px solid #fff", boxSizing: "border-box" })} />}
    </div>
  );
};
const SheetBar: React.FC<{ w: number; sheet: string }> = ({ w, sheet }) => (
  <div>
    <div style={abs(0, SBY, w, M.sheetBar, { background: "#F3F3F3", borderTop: "1px solid #D4D4D4", boxSizing: "border-box" })} />
    <Tx x={8} y={SBY} w={14} h={M.sheetBar} size={9} color="#777">◀</Tx><Tx x={26} y={SBY} w={14} h={M.sheetBar} size={9} color="#777">▶</Tx>
    {["Sales", "Customers"].map((n, i) => (
      <div key={n}>
        {n === sheet && <div style={abs(50 + i * 84, SBY, 84, M.sheetBar, { background: "#fff", borderBottom: `3px solid ${XL.green}`, boxSizing: "border-box" })} />}
        <Tx x={50 + i * 84} y={SBY} w={84} h={M.sheetBar - 2} size={12} align="center" bold={n === sheet} color={n === sheet ? XL.green : "#333"}>{n}</Tx>
      </div>
    ))}
    <Tx x={222} y={SBY} w={24} h={M.sheetBar} size={18} align="center" color="#555">+</Tx>
  </div>
);
const StatusBar: React.FC<{ w: number; mode: string; stats?: string }> = ({ w, mode, stats }) => (
  <div>
    <div style={abs(0, M.win.h - M.status, w, M.status, { background: "#F3F3F3", borderTop: "1px solid #D4D4D4", boxSizing: "border-box" })} />
    <Tx x={8} y={M.win.h - M.status} w={60} h={M.status} size={11.5}>{mode}</Tx>
    <Tx x={80} y={M.win.h - M.status} w={170} h={M.status} size={11.5} color="#555">Accessibility: Good to go</Tx>
    {stats && <Tx x={w - 560} y={M.win.h - M.status} w={290} h={M.status} size={11.5} align="right">{stats}</Tx>}
    <Ico n="gen" x={w - 232} y={M.win.h - M.status + 4} s={14} c="#555" sw={1.5} /><Ico n="table" x={w - 206} y={M.win.h - M.status + 4} s={14} c="#555" sw={1.5} /><Ico n="cols" x={w - 180} y={M.win.h - M.status + 4} s={14} c="#555" sw={1.5} />
    <Tx x={w - 150} y={M.win.h - M.status} w={14} h={M.status} size={13} color="#555">−</Tx>
    <div style={abs(w - 134, M.win.h - M.status + 11, 70, 2, { background: "#999" })} /><div style={abs(w - 100, M.win.h - M.status + 6, 3, 12, { background: "#555" })} />
    <Tx x={w - 60} y={M.win.h - M.status} w={14} h={M.status} size={13} color="#555">+</Tx><Tx x={w - 44} y={M.win.h - M.status} w={40} h={M.status} size={11.5}>100%</Tx>
  </div>
);
export const QCPane: React.FC<{ x: number; state: "loaded" | "loading"; p?: number; f: number; rows?: string; glow?: string }> = ({ x, state, p = 0, f, rows = "50,000 rows loaded.", glow }) => (
  <div style={abs(x, RY + M.ribbon + M.fbar, M.pane, SBY - (RY + M.ribbon + M.fbar), { background: "#fff", borderLeft: "1px solid #C8C8C8", boxSizing: "border-box", overflow: "hidden" })}>
    <Tx x={12} y={8} w={200} h={22} size={14} bold>Queries &amp; Connections</Tx><Tx x={M.pane - 28} y={8} w={20} h={22} size={13} color="#555">✕</Tx>
    <Tx x={12} y={38} w={70} h={22} size={12.5} bold color={XL.green}>Queries</Tx><Tx x={92} y={38} w={90} h={22} size={12.5} color="#555">Connections</Tx>
    <div style={abs(12, 60, 62, 2, { background: XL.green })} /><div style={abs(0, 61, M.pane, 1, { background: "#E1E1E1" })} />
    <Tx x={12} y={70} w={120} h={20} size={11.5} color="#555">1 query</Tx>
    <div style={abs(12, 96, M.pane - 24, 62, { background: state === "loading" ? "#F2F9F5" : "#fff", border: `1px solid ${glow ?? "#D4D4D4"}`, boxSizing: "border-box" })}>
      <Ico n="table" x={8} y={8} s={20} c={XL.green} sw={1.5} />
      <Tx x={36} y={6} w={160} h={22} size={13} bold>Sales_Fact</Tx>
      <Tx x={36} y={28} w={190} h={20} size={11.5} color="#555">{state === "loading" ? "Refreshing in background…" : rows}</Tx>
      {state === "loading" ? <Spinner x={M.pane - 54} y={8} s={20} f={f} /> : <Tx x={M.pane - 56} y={6} w={24} h={24} size={16} color={XL.green} align="center">✓</Tx>}
      {state === "loading" && <div style={abs(36, 50, 160, 4, { background: "#DDD" })}><div style={abs(0, 0, 160 * p, 4, { background: XL.green })} /></div>}
    </div>
  </div>
);
export const salesData = (n = 21): string[][] => {
  const prod = ["Laptop", "Router", "Monitor", "Printer", "Tablet"], price = [18500, 950, 4200, 3100, 7600], reg = ["Cairo", "Giza", "Alexandria", "Mansoura", "Aswan"];
  const rows: string[][] = [["OrderID", "OrderDate", "Region", "Product", "Qty", "Amount"]];
  let s = 7;
  for (let i = 0; i < n; i++) {
    s = (s * 48271) % 2147483647; const p = s % 5; const q = 1 + ((s >> 3) % 9); const d = 1 + ((s >> 5) % 27);
    rows.push([String(10001 + i), `1/${d}/2026`, reg[(s >> 7) % 5], prod[p], String(q), fmt(q * price[p])]);
  }
  return rows;
};
export const ExcelWin: React.FC<{ right?: number[]; tableCols?: number; f: number; tab?: string; file?: string; name: string; formula: string; sel: Sel; data?: string[][]; edit?: Edit; ants?: Sel;
  pane?: React.ReactNode; paneW?: number; mode?: string; stats?: string; hover?: string; down?: boolean; children?: React.ReactNode }> =
  ({ right, tableCols = 6, f, tab = "Home", file = "manzooma_sales_2026", name, formula, sel, data, edit, ants, pane, paneW = 0, mode = "Ready", stats, hover, down, children }) => {
    const d = data ?? salesData();
    const gw = M.win.w - paneW;
    return (
      <Win>
        <Chrome tab={tab} file={file} />
        {hover && <RibbonHL tab={tab} k={hover} down={down} />}
        <FormulaBar name={name} text={formula} editing={!!edit} w={gw} />
        <Grid w={gw} data={d} right={right ?? [0, 1, 4, 5]} tc={tableCols} table sel={sel} edit={edit} ants={ants} f={f} />
        <div style={abs(gw - M.scroll, GY + M.colH, M.scroll, GRID_ROWS * M.rowH, { background: "#F0F0F0" })}><div style={abs(2, 2, 10, 120, { background: "#C1C1C1" })} /></div>
        <SheetBar w={gw} sheet="Sales" />
        <StatusBar w={M.win.w} mode={edit ? "Enter" : mode} stats={stats} />
        {pane}
        {children}
      </Win>
    );
  };

// ---------- Excel Query Properties dialog (Usage tab) ----------
export const QP = { x: 470, y: 60, w: 460, h: 500 };
export const qpPos = {
  bg: { x: QP.x + 34, y: QP.y + 222 }, timed: { x: QP.x + 34, y: QP.y + 248 }, mins: { x: QP.x + 150, y: QP.y + 246, w: 44, h: 22 },
  open: { x: QP.x + 34, y: QP.y + 276 }, ok: { x: QP.x + QP.w - 176, y: QP.y + QP.h - 40, w: 76, h: 26 },
};
export const QueryProps: React.FC<{ a: number; bg: boolean; timed: boolean; mins: string; minsFocus?: boolean; open: boolean; okDown?: boolean; glow?: { k: string; c: string } }> = ({ a, bg, timed, mins, minsFocus, open, okDown, glow }) => (
  <Dlg x={QP.x} y={QP.y} w={QP.w} h={QP.h} title="Query Properties" a={a}>
    <Tx x={16} y={44} w={70} h={22} size={12}>Query name:</Tx><Inp x={96} y={42} w={344} text="Sales_Fact" />
    <Tx x={16} y={76} w={80} h={22} size={12}>Description:</Tx><Inp x={96} y={74} w={344} h={54} text="" />
    {["Usage", "Definition", "Used In"].map((t, i) => (
      <div key={t}><div style={abs(16 + i * 80, 142, 80, 24, { background: i === 0 ? "#fff" : "#E8E8E8", border: "1px solid #ADADAD", borderBottom: i === 0 ? "1px solid #fff" : "1px solid #ADADAD", boxSizing: "border-box" })} />
        <Tx x={16 + i * 80} y={142} w={80} h={24} size={12} align="center">{t}</Tx></div>
    ))}
    <div style={abs(16, 165, 428, 290, { background: "#fff", border: "1px solid #ADADAD", boxSizing: "border-box" })} />
    <Tx x={28} y={174} w={200} h={20} size={12} bold>Refresh control</Tx>
    <Tx x={28} y={196} w={300} h={20} size={12} color="#444">Last Refreshed: 11/10/2026 9:14 AM</Tx>
    <Chk x={QP.w ? 34 - 0 : 0} y={222 - 0} label="Enable background refresh" on={bg} />
    <Chk x={34} y={248} label="Refresh every" on={timed} w={110} />
    <Inp x={150 - 0} y={246} w={44} text={mins} focus={minsFocus} caret={minsFocus} /><Tx x={202} y={246} w={60} h={22} size={12}>minutes</Tx>
    <Chk x={34} y={276} label="Refresh data when opening the file" on={open} />
    <Chk x={34} y={304} label="Remove data from the external data range before saving the workbook" on={false} dis w={400} />
    <Chk x={34} y={332} label="Refresh this connection on Refresh All" on />
    {glow && <Neon x={glow.k === "bg" ? 30 : glow.k === "timed" ? 30 : 30} y={glow.k === "bg" ? 220 : glow.k === "timed" ? 246 : 274} w={glow.k === "open" ? 290 : glow.k === "timed" ? 250 : 220} h={24} c={glow.c} r={4} />}
    <Btn x={QP.w - 176 - 0} y={QP.h - 40} w={76} h={26} label="OK" def down={okDown} /><Btn x={QP.w - 92} y={QP.h - 40} w={76} h={26} label="Cancel" />
  </Dlg>
);

// ---------- Power Query Editor ----------
export const PQ_STEPS = ["Source", "Navigation", "Filtered Rows", "Removed Other Columns", "Added Custom"];
export const PQ_FORMULA = [
  '= Sql.Database("manzooma-srv01", "manzooma_sales")',
  '= Source{[Schema="dbo",Item="Sales"]}[Data]',
  '= Table.SelectRows(dbo_Sales, each [OrderDate] >= #date(2026, 1, 1))',
  '= Table.SelectColumns(#"Filtered Rows",{"OrderID","OrderDate","Region","Product","Qty","Amount"})',
  '= Table.AddColumn(#"Removed Other Columns", "Tier", each fnTier([Amount]))',
];
export const PQ_SQL = `select [_].[OrderID] as [OrderID],
    [_].[OrderDate] as [OrderDate],
    [_].[Region] as [Region],
    [_].[Product] as [Product],
    [_].[Qty] as [Qty],
    [_].[Amount] as [Amount]
from [dbo].[Sales] as [_]
where [_].[OrderDate] >= '2026-01-01'`;
const PQY = M.title + M.tabs + M.ribbon; // 154
export const pqStep = (i: number): Box => ({ x: M.win.w - M.pqRight + 8, y: PQY + 154 + i * 28, w: M.pqRight - 16, h: 28 });
export const pqFileTab: Box = { x: 8, y: M.title, w: 46, h: M.tabs };
const PQTABS = ["File", "Home", "Transform", "Add Column", "View", "Help"];
const pqTabBox: Record<string, Box> = {};
{ let x = 8; PQTABS.forEach((t) => { const w = t.length * 7 + 26; pqTabBox[t] = { x, y: M.title, w, h: M.tabs }; x += w; }); }
export const pqTab = (t: string): Box => pqTabBox[t];
const PQChrome = React.memo(({ tab }: { tab: string }) => (
  <div>
    <div style={abs(0, 0, M.win.w, M.title + M.tabs, { background: "#F3F3F3" })} />
    <div style={abs(10, 7, 16, 16, { background: "#5B2C83", borderRadius: 3 })}><svg width={16} height={16} viewBox="0 0 16 16"><path d="M4 5h8M4 8h8M4 11h5" stroke="#fff" strokeWidth={1.4} fill="none" /></svg></div>
    <Tx x={36} y={0} w={500} h={30} size={12.5}>manzooma_sales_2026 - Power Query Editor</Tx>
    <Tx x={1260} y={0} w={40} h={30} size={14} align="center" color="#333">—</Tx><Tx x={1310} y={0} w={40} h={30} size={13} align="center" color="#333">☐</Tx><Tx x={1355} y={0} w={40} h={30} size={14} align="center" color="#333">✕</Tx>
    {PQTABS.map((t) => (
      <div key={t}>
        {t === tab && <div style={abs(pqTabBox[t].x, M.title + 2, pqTabBox[t].w, M.tabs - 2, { background: "#fff", border: "1px solid #D4D4D4", borderBottom: "none", boxSizing: "border-box" })} />}
        <Tx x={pqTabBox[t].x} y={M.title} w={pqTabBox[t].w} h={M.tabs} size={12.5} align="center" bold={t === tab}>{t}</Tx>
      </div>
    ))}
    <div style={abs(0, M.title + M.tabs, M.win.w, M.ribbon, { background: "#fff", borderTop: "1px solid #D4D4D4", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} />
    <RibbonItems tab="PQHome" />
  </div>
));
const typeBadge = ["123", "▦", "ABC", "ABC", "123", "1.2", "ABC"];
export const PQWin: React.FC<{ f: number; tab?: string; step: number; hover?: string; hoverStep?: number; banner?: number; dim?: number; children?: React.ReactNode }> =
  ({ f, tab = "Home", step, hover, hoverStep = -1, banner = 0, dim = 0, children }) => {
    const nC = step >= 4 ? 7 : 6;
    const cw = Math.floor((M.win.w - M.pqLeft - M.pqRight - 44) / nC);
    const cx0 = M.pqLeft + 44, ty = PQY + M.fbar;
    const heads = ["OrderID", "OrderDate", "Region", "Product", "Qty", "Amount", "Tier"];
    const d = salesData(18).slice(1);
    return (
      <Win>
        <PQChrome tab={tab} />
        {hover && <RibbonHL tab="PQHome" k={hover} />}
        {/* left queries pane */}
        <div style={abs(0, PQY, M.pqLeft, M.win.h - PQY - M.status, { background: "#F7F7F7", borderRight: "1px solid #D4D4D4", boxSizing: "border-box" })}>
          <Tx x={10} y={8} w={140} h={22} size={12.5} bold>Queries [1]</Tx><Tx x={M.pqLeft - 24} y={8} w={16} h={22} size={13} color="#555">‹</Tx>
          <div style={abs(0, 36, M.pqLeft - 1, 28, { background: "#E3E3E3" })} /><Ico n="table" x={10} y={42} s={16} c={XL.green} sw={1.6} /><Tx x={34} y={36} w={140} h={28} size={12.5}>Sales_Fact</Tx>
        </div>
        {/* formula bar */}
        <div style={abs(M.pqLeft, PQY, M.win.w - M.pqLeft - M.pqRight, M.fbar, { background: "#fff", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} />
        <Tx x={M.pqLeft + 10} y={PQY + 3} w={20} h={20} size={13} color="#C42B1C" align="center">✕</Tx><Tx x={M.pqLeft + 32} y={PQY + 3} w={20} h={20} size={13} color={XL.green} align="center">✓</Tx>
        <Tx x={M.pqLeft + 56} y={PQY + 3} w={22} h={20} size={13} color="#555" align="center" style={{ fontStyle: "italic", fontFamily: FONT.cell }}>fx</Tx>
        <Rect x={M.pqLeft + 84} y={PQY + 3} w={M.win.w - M.pqLeft - M.pqRight - 96} h={20} fill="#fff" stroke="#E1E1E1" />
        <Tx x={M.pqLeft + 90} y={PQY + 3} w={720} h={20} size={12.5} font={FONT.mono}>{PQ_FORMULA[step]}</Tx>
        {/* preview table */}
        <div style={abs(M.pqLeft, ty, M.win.w - M.pqLeft - M.pqRight, M.win.h - ty - M.status, { background: "#fff", overflow: "hidden" })}>
          <div style={abs(0, 0, 44, 36, { background: "#F3F3F3", borderRight: "1px solid #D4D4D4", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} />
          {heads.slice(0, nC).map((h, c) => (
            <div key={h}>
              <div style={abs(44 + c * cw, 0, cw, 36, { background: "#F3F3F3", borderRight: "1px solid #D4D4D4", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} />
              <Tx x={48 + c * cw} y={0} w={32} h={36} size={9.5} color={XL.green} bold font={FONT.mono}>{typeBadge[c]}</Tx>
              <Tx x={80 + c * cw} y={0} w={cw - 100} h={36} size={12.5} bold>{h}</Tx><Tx x={44 + c * cw + cw - 18} y={0} w={14} h={36} size={8} color="#666">▼</Tx>
            </div>
          ))}
          {d.map((row, r) => (
            <div key={r}>
              <div style={abs(0, 36 + r * 22, 44, 22, { background: "#F3F3F3", borderRight: "1px solid #D4D4D4", boxSizing: "border-box" })} />
              <Tx x={0} y={36 + r * 22} w={38} h={22} size={11.5} align="right" color="#666">{r + 1}</Tx>
              {row.slice(0, nC).concat(nC > 6 ? [] : []).map((v, c) => (
                <Tx key={c} x={48 + c * cw} y={36 + r * 22} w={cw - 10} h={22} size={12.5} align={[0, 4, 5].includes(c) ? "right" : "left"}>{c === 5 ? v.replace(/,/g, "") : v}</Tx>
              ))}
              {nC > 6 && <Tx x={48 + 6 * cw} y={36 + r * 22} w={cw - 10} h={22} size={12.5}>{Number(row[5].replace(/,/g, "")) > 20000 ? "High" : Number(row[5].replace(/,/g, "")) > 6000 ? "Mid" : "Low"}</Tx>}
              <div style={abs(44, 36 + (r + 1) * 22 - 1, nC * cw, 1, { background: "#EDEDED" })} />
            </div>
          ))}
        </div>
        {banner > 0 && (
          <div style={abs(M.pqLeft + 44, ty + 36, M.win.w - M.pqLeft - M.pqRight - 44, 64, { background: "#FFF4CE", borderBottom: "1px solid #E6C65C", opacity: banner, boxSizing: "border-box" })}>
            <Ico n="warn" x={16} y={20} s={22} c="#B58900" sw={1.8} />
            <Tx x={50} y={8} w={560} h={22} size={13} bold>Information is required about data privacy.</Tx>
            <Tx x={50} y={32} w={640} h={20} size={12} color="#444">This table combines data from several sources, so privacy levels must be checked first.</Tx>
            <Btn x={600} y={18} w={84} h={26} label="Continue" />
          </div>
        )}
        {/* right settings pane */}
        <div style={abs(M.win.w - M.pqRight, PQY, M.pqRight, M.win.h - PQY - M.status, { background: "#F7F7F7", borderLeft: "1px solid #D4D4D4", boxSizing: "border-box" })}>
          <Tx x={12} y={6} w={180} h={22} size={13.5} bold>Query Settings</Tx>
          <Tx x={12} y={36} w={120} h={18} size={10.5} bold color="#666">PROPERTIES</Tx>
          <Tx x={12} y={58} w={50} h={18} size={11.5}>Name</Tx><Inp x={12} y={78} w={M.pqRight - 28} text="Sales_Fact" />
          <Tx x={12} y={106} w={160} h={18} size={11.5} color="#0F6CBD">All Properties</Tx>
          <Tx x={12} y={130} w={160} h={18} size={10.5} bold color="#666">APPLIED STEPS</Tx>
          {PQ_STEPS.map((n, i) => {
            const b = pqStep(i), on = i === step;
            return (
              <div key={n}>
                {(on || i === hoverStep) && <div style={abs(b.x - (M.win.w - M.pqRight), b.y - PQY, b.w, b.h, { background: on ? "#DADADA" : "#ECECEC" })} />}
                {on && <Tx x={b.x - (M.win.w - M.pqRight) + 4} y={b.y - PQY} w={16} h={b.h} size={11} color="#555">✕</Tx>}
                <Tx x={b.x - (M.win.w - M.pqRight) + 24} y={b.y - PQY} w={170} h={b.h} size={12.5}>{n}</Tx>
                {i < 3 && <Ico n="gear" x={b.x - (M.win.w - M.pqRight) + b.w - 24} y={b.y - PQY + 6} s={15} c="#777" sw={1.5} />}
              </div>
            );
          })}
        </div>
        <div style={abs(0, M.win.h - M.status, M.win.w, M.status, { background: "#F3F3F3", borderTop: "1px solid #D4D4D4", boxSizing: "border-box" })} />
        <Tx x={10} y={M.win.h - M.status} w={200} h={M.status} size={11} color="#444">{nC} COLUMNS, 999+ ROWS</Tx>
        <Tx x={220} y={M.win.h - M.status} w={360} h={M.status} size={11} color="#666">Column profiling based on top 1000 rows</Tx>
        <Tx x={M.win.w - 330} y={M.win.h - M.status} w={320} h={M.status} size={11} color="#666" align="right">PREVIEW DOWNLOADED ON WEDNESDAY</Tx>
        {dim > 0 && <div style={abs(0, 0, M.win.w, M.win.h, { background: `rgba(15,23,42,${dim})` })} />}
        {children}
      </Win>
    );
  };
export const nativeDlgBox = { x: 300, y: 130, w: 760, h: 330 };
export const NativeQuery: React.FC<{ a: number; text: string; okDown?: boolean }> = ({ a, text, okDown }) => (
  <Dlg x={nativeDlgBox.x} y={nativeDlgBox.y} w={nativeDlgBox.w} h={nativeDlgBox.h} title="Native Query" a={a}>
    <Rect x={14} y={44} w={nativeDlgBox.w - 30} h={nativeDlgBox.h - 100} fill="#fff" stroke="#8A8A8A" />
    <div style={abs(22, 50, nativeDlgBox.w - 50, nativeDlgBox.h - 110, { overflow: "hidden" })}><Sql text={text} size={13} lh={19} light /></div>
    <Btn x={nativeDlgBox.w - 100} y={nativeDlgBox.h - 40} w={76} h={26} label="OK" def down={okDown} />
  </Dlg>
);
export const STEP_MENU: MenuItem[] = [
  { l: "Edit Settings", ic: "gear" }, { l: "Rename", ic: "props" }, { l: "Delete", ic: "minus" }, { l: "Delete Until End", ic: "minus" }, { l: "Insert Step After", ic: "plus" }, { sep: true, l: "" },
  { l: "Move Up", ic: "az" }, { l: "Move Down", ic: "az" }, { l: "Extract Previous..." }, { sep: true, l: "" }, { l: "View Native Query", ic: "db" }, { l: "Properties..." },
];
export const FILE_MENU: MenuItem[] = [{ l: "Close & Load", ic: "save" }, { l: "Close & Load To..." }, { sep: true, l: "" }, { l: "Options and settings", sub: true, ic: "gear" }];
export const OPT_SUB: MenuItem[] = [{ l: "Query options", ic: "gear" }, { l: "Data source settings", ic: "db" }];

// ---------- Query Options dialog (Power Query) ----------
export const QO = { x: 300, y: 70, w: 800, h: 520 };
export const qoPos = { priv: { x: QO.x + 24, y: QO.y + 200 }, ignore: { x: QO.x + 232, y: QO.y + 156 }, fast: { x: QO.x + 232, y: QO.y + 210 }, ok: { x: QO.x + QO.w - 176, y: QO.y + QO.h - 42, w: 76, h: 26 } };
export const QueryOptions: React.FC<{ a: number; page: "privacy" | "load"; ignore: boolean; fast: boolean; glow?: string; okDown?: boolean }> = ({ a, page, ignore, fast, glow, okDown }) => (
  <Dlg x={QO.x} y={QO.y} w={QO.w} h={QO.h} title="Query Options" a={a}>
    <div style={abs(0, 30, 200, QO.h - 30, { background: "#fff", borderRight: "1px solid #CFCFCF" })} />
    <Tx x={14} y={42} w={160} h={18} size={11} bold color="#666">GLOBAL</Tx>
    {["Data Load", "Power Query Editor", "Security", "Privacy", "Regional Settings", "Diagnostics"].map((n, i) => (
      <div key={n}>{((page === "privacy" && n === "Privacy") || (page === "load" && n === "Data Load")) && <div style={abs(4, 62 + i * 26, 192, 26, { background: "#CCE4F7" })} />}
        <Tx x={22} y={62 + i * 26} w={170} h={26} size={12.5}>{n}</Tx></div>
    ))}
    <Tx x={14} y={232} w={180} h={18} size={11} bold color="#666">CURRENT WORKBOOK</Tx>
    {["Data Load", "Regional Settings", "Privacy"].map((n, i) => (<Tx key={n} x={22} y={252 + i * 26} w={170} h={26} size={12.5}>{n}</Tx>))}
    {page === "privacy" ? (
      <div>
        <Tx x={224} y={44} w={300} h={26} size={17} bold>Privacy</Tx>
        <Tx x={224} y={80} w={540} h={20} size={12} color="#444">Choose how to combine data from different sources.</Tx>
        <Chk x={226} y={112} radio on={false} label="Always combine data according to your Privacy Level settings for each source" w={540} />
        <Chk x={226} y={136} radio on={false} label="Combine data according to each file’s Privacy Level settings" w={540} />
        <Chk x={226} y={160} radio on={ignore} label="Ignore the Privacy Levels and potentially improve performance" w={540} />
        {glow && ignore && <Neon x={222} y={158} w={410} h={24} c={glow} r={4} />}
      </div>
    ) : (
      <div>
        <Tx x={224} y={44} w={300} h={26} size={17} bold>Data Load</Tx>
        <Tx x={224} y={86} w={300} h={20} size={12} bold>Default Query Load Settings</Tx>
        <Chk x={226} y={110} radio on label="Use standard load settings" w={400} /><Chk x={226} y={132} radio on={false} label="Use custom default load settings" w={400} />
        <Tx x={224} y={170} w={300} h={20} size={12} bold>Fast Data Load</Tx>
        <Chk x={226} y={196} on={fast} label="Fast Data Load" w={300} />
        <Tx x={246} y={216} w={420} h={18} size={11.5} color="#666">Speeds up loading of large tables into the workbook.</Tx>
        {glow && fast && <Neon x={222} y={194} w={160} h={24} c={glow} r={4} />}
      </div>
    )}
    <Btn x={QO.w - 176} y={QO.h - 42} w={76} h={26} label="OK" def down={okDown} /><Btn x={QO.w - 92} y={QO.h - 42} w={76} h={26} label="Cancel" />
  </Dlg>
);

// ---------- Sales model used by DAX lessons (one deterministic dataset => every number is consistent) ----------
export const CUSTOMERS = ["Nile Tech", "Delta Mart", "Cairo Home", "Giza Shop", "Alex Store", "Mansoura"];
export const BRANCHES = ["Cairo", "Giza", "Alexandria", "Mansoura"];
export const CATS = ["Electronics", "Furniture", "Office"];
export type FactRow = { id: number; cust: number; branch: number; cat: number; qty: number; price: number };
export const FACT: FactRow[] = (() => {
  const price = [3200, 1850, 450]; const rows: FactRow[] = []; let s = 11;
  for (let i = 0; i < 48; i++) { s = (s * 48271) % 2147483647; rows.push({ id: 5001 + i, cust: s % 6, branch: (s >> 4) % 4, cat: (s >> 7) % 3, qty: 1 + ((s >> 9) % 6), price: price[(s >> 7) % 3] + 50 * ((s >> 12) % 5) }); }
  return rows;
})();
export const amt = (r: FactRow) => r.qty * r.price;
export const sumWhere = (p: (r: FactRow) => boolean) => FACT.filter(p).reduce((a, r) => a + amt(r), 0);
export const custTotal = (c: number, p: (r: FactRow) => boolean = () => true) => sumWhere((r) => r.cust === c && p(r));

// ---------- Power Pivot window ----------
export type PPCol = { n: string; w: number; r?: boolean; calc?: boolean };
const PPTABS = ["File", "Home", "Design", "Advanced"];
const ppTabBox: Record<string, Box> = {};
{ let x = 8; PPTABS.forEach((t) => { const w = t.length * 7 + 26; ppTabBox[t] = { x, y: M.title, w, h: M.tabs }; x += w; }); }
const PPY = M.title + M.tabs + M.ribbon;
const PPChrome = React.memo(() => (
  <div>
    <div style={abs(0, 0, M.win.w, M.title + M.tabs, { background: "#F3F3F3" })} />
    <div style={abs(10, 7, 16, 16, { background: XL.green, borderRadius: 3 })}><svg width={16} height={16} viewBox="0 0 16 16"><path d="M3 4h10v8H3zM3 8h10M8 4v8" stroke="#fff" strokeWidth={1.2} fill="none" /></svg></div>
    <Tx x={36} y={0} w={640} h={30} size={12.5}>Power Pivot for Excel - manzooma_sales_2026.xlsx</Tx>
    <Tx x={1260} y={0} w={40} h={30} size={14} align="center" color="#333">—</Tx><Tx x={1310} y={0} w={40} h={30} size={13} align="center" color="#333">☐</Tx><Tx x={1355} y={0} w={40} h={30} size={14} align="center" color="#333">✕</Tx>
    {PPTABS.map((t) => (
      <div key={t}>
        {t === "Home" && <div style={abs(ppTabBox[t].x, M.title + 2, ppTabBox[t].w, M.tabs - 2, { background: "#fff", border: "1px solid #D4D4D4", borderBottom: "none", boxSizing: "border-box" })} />}
        <Tx x={ppTabBox[t].x} y={M.title} w={ppTabBox[t].w} h={M.tabs} size={12.5} align="center" bold={t === "Home"}>{t}</Tx>
      </div>
    ))}
    <div style={abs(0, M.title + M.tabs, M.win.w, M.ribbon, { background: "#fff", borderTop: "1px solid #D4D4D4", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} />
    <RibbonItems tab="PPHome" />
  </div>
));
export const PP_ROW0 = PPY + M.fbar + 26; // y of first data row
export const PP_RH = 22;
export const ppCellBox = (cols: PPCol[], r: number, c: number): Box => ({ x: 34 + cols.slice(0, c).reduce((a, b) => a + b.w, 0), y: PP_ROW0 + r * PP_RH, w: cols[c].w, h: PP_RH });
export const PPWin: React.FC<{ f: number; table: string; cols: PPCol[]; rows: string[][]; hi?: number; hiColor?: string; selCol?: number; name: string; formula: string; calc?: { n: string; v: string }[]; dim?: number; children?: React.ReactNode }> =
  ({ table, cols, rows, hi = -1, hiColor = C.amber, selCol = -1, name, formula, calc = [], dim = 0, children }) => {
    const gw = cols.reduce((a, b) => a + b.w, 0);
    return (
      <Win>
        <PPChrome />
        <div style={abs(0, PPY, M.win.w, M.fbar, { background: "#fff", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} />
        <Rect x={6} y={PPY + 3} w={150} h={20} fill="#fff" stroke="#BDBDBD" /><Tx x={10} y={PPY + 3} w={130} h={20} size={12}>{name}</Tx><Tx x={140} y={PPY + 3} w={14} h={20} size={8} color="#555">▼</Tx>
        <Tx x={166} y={PPY + 3} w={20} h={20} size={13} color="#C42B1C" align="center">✕</Tx><Tx x={188} y={PPY + 3} w={20} h={20} size={13} color={XL.green} align="center">✓</Tx>
        <Tx x={212} y={PPY + 3} w={22} h={20} size={13} color="#555" align="center" style={{ fontStyle: "italic", fontFamily: FONT.cell }}>fx</Tx>
        <Rect x={240} y={PPY + 3} w={M.win.w - 256} h={20} fill="#fff" stroke="#E1E1E1" />
        <Tx x={246} y={PPY + 3} w={M.win.w - 270} h={20} size={13} font={FONT.mono}>{formula}</Tx>
        <div style={abs(0, PPY + M.fbar, M.win.w, 540 - PPY - M.fbar, { background: "#fff", overflow: "hidden" })}>
          <div style={abs(0, 0, 34, 26, { background: "#F3F3F3", border: "1px solid #D4D4D4", boxSizing: "border-box" })} />
          {cols.map((c, i) => {
            const x = 34 + cols.slice(0, i).reduce((a, b) => a + b.w, 0);
            return (
              <div key={c.n}>
                <div style={abs(x, 0, c.w, 26, { background: i === selCol ? "#CFE7D9" : c.calc ? "#E5E5F7" : "#F3F3F3", border: "1px solid #D4D4D4", boxSizing: "border-box" })} />
                <Tx x={x + 8} y={0} w={c.w - 28} h={26} size={12.5} bold>{c.n}</Tx><Tx x={x + c.w - 20} y={0} w={14} h={26} size={8} color="#666">▼</Tx>
              </div>
            );
          })}
          {Array.from({ length: 15 }).map((_, r) => (
            <div key={r}>
              <div style={abs(0, 26 + r * PP_RH, 34, PP_RH, { background: "#F3F3F3", border: "1px solid #E1E1E1", boxSizing: "border-box" })} /><Tx x={0} y={26 + r * PP_RH} w={30} h={PP_RH} size={11} align="right" color="#666">{r + 1}</Tx>
              <div style={abs(34, 26 + r * PP_RH, gw, PP_RH, { background: r === hi ? "rgba(245,158,11,0.20)" : "transparent", borderBottom: "1px solid #E8E8E8", boxSizing: "border-box" })} />
            </div>
          ))}
          {cols.map((c, i) => { const x = 34 + cols.slice(0, i).reduce((a, b) => a + b.w, 0); return <div key={"v" + i} style={abs(x + c.w - 1, 0, 1, 26 + 15 * PP_RH, { background: "#E1E1E1" })} />; })}
          {rows.map((row, r) => row.map((v, c) => v === "" ? null : <Tx key={r + "_" + c} x={34 + cols.slice(0, c).reduce((a, b) => a + b.w, 0) + 8} y={26 + r * PP_RH} w={cols[c].w - 16} h={PP_RH} size={13} align={cols[c].r ? "right" : "left"} color={cols[c].calc ? "#3B3B8F" : "#111"}>{v}</Tx>))}
          {hi >= 0 && <div style={abs(34, 26 + hi * PP_RH, gw, PP_RH, { border: `2px solid ${hiColor}`, boxSizing: "border-box" })} />}
        </div>
        <div style={abs(0, 540, M.win.w, 100, { background: "#FAFAFA", borderTop: "1px solid #BDBDBD", boxSizing: "border-box" })}>
          {calc.map((m, i) => (
            <div key={m.n} style={abs(8 + i * 330, 6, 320, 84, { background: "#fff", border: "1px solid #D4D4D4", boxSizing: "border-box" })}>
              <Tx x={8} y={4} w={300} h={20} size={12} bold>{m.n}:</Tx><Tx x={8} y={26} w={300} h={22} size={13} font={FONT.mono} color="#1F3A93">{m.v}</Tx>
            </div>
          ))}
        </div>
        <div style={abs(0, 640, M.win.w, M.sheetBar, { background: "#F3F3F3", borderTop: "1px solid #D4D4D4", boxSizing: "border-box" })} />
        {["Fact_Sales", "Dim_Customer"].map((n, i) => (<div key={n}>{n === table && <div style={abs(8 + i * 110, 640, 110, M.sheetBar, { background: "#fff", borderBottom: `3px solid ${XL.green}`, boxSizing: "border-box" })} />}<Tx x={8 + i * 110} y={640} w={110} h={M.sheetBar - 2} size={12} align="center" bold={n === table} color={n === table ? XL.green : "#333"}>{n}</Tx></div>))}
        <div style={abs(0, M.win.h - M.status, M.win.w, M.status, { background: "#F3F3F3", borderTop: "1px solid #D4D4D4", boxSizing: "border-box" })} />
        <Tx x={10} y={M.win.h - M.status} w={300} h={M.status} size={11} color="#444">{`Record: ◀ 1 of ${rows.length > 0 ? 48 : 0} ▶`}</Tx>
        {dim > 0 && <div style={abs(0, 0, M.win.w, M.win.h, { background: `rgba(15,23,42,${dim})` })} />}
        {children}
      </Win>
    );
  };

// ---------- Slicer + PivotTable Fields pane ----------
export const Slicer: React.FC<{ x: number; y: number; w: number; title: string; items: string[]; sel: number; hi?: number }> = ({ x, y, w, title, items, sel, hi = -1 }) => (
  <div style={abs(x, y, w, 34 + items.length * 28, { background: "#fff", border: "1px solid #A6A6A6", boxSizing: "border-box" })}>
    <div style={abs(0, 0, w, 28, { background: "#F3F3F3", borderBottom: "1px solid #D4D4D4", boxSizing: "border-box" })} /><Tx x={8} y={0} w={w - 40} h={28} size={12.5} bold>{title}</Tx>
    <Ico n="filter" x={w - 24} y={6} s={14} c={sel >= 0 ? "#333" : "#AAA"} sw={1.6} />
    {items.map((it, i) => (
      <div key={it} style={abs(6, 32 + i * 28, w - 12, 24, { background: i === sel ? "#BDD7EE" : i === hi ? "#EAF2FA" : "#fff", border: `1px solid ${i === sel ? "#5B9BD5" : "#C8C8C8"}`, boxSizing: "border-box" })}><Tx x={8} y={0} w={w - 28} h={22} size={12}>{it}</Tx></div>
    ))}
  </div>
);
export const slicerItem = (x: number, y: number, w: number, i: number): [number, number] => [x + w / 2, y + 32 + i * 28 + 12];
export const PTFields: React.FC<{ x: number; h: number; rows?: string; vals?: string }> = ({ x, h, rows = "CustomerName", vals = "Total Sales" }) => (
  <div style={abs(x, 180, M.pane, h, { background: "#fff", borderLeft: "1px solid #C8C8C8", boxSizing: "border-box", overflow: "hidden" })}>
    <Tx x={12} y={8} w={220} h={22} size={14} bold>PivotTable Fields</Tx><Tx x={M.pane - 28} y={8} w={20} h={22} size={13} color="#555">✕</Tx>
    <Tx x={12} y={36} w={240} h={18} size={11.5} color="#555">Choose fields to add to report:</Tx>
    <Rect x={12} y={58} w={M.pane - 24} h={22} fill="#fff" stroke="#BDBDBD" /><Tx x={18} y={58} w={150} h={22} size={12} color="#888">Search</Tx>
    {["Fact_Sales", "Dim_Customer", "Dim_Branch"].map((n, i) => (<div key={n}><Tx x={14} y={90 + i * 22} w={14} h={20} size={9} color="#555">▶</Tx><Ico n="table" x={32} y={92 + i * 22} s={14} c={XL.green} sw={1.6} /><Tx x={52} y={90 + i * 22} w={180} h={20} size={12}>{n}</Tx></div>))}
    <Tx x={12} y={170} w={200} h={18} size={11.5} color="#555">Drag fields between areas below:</Tx>
    {[["Filters", 0, 0], ["Columns", 1, 0], ["Rows", 0, 1], ["Values", 1, 1]].map(([n, cx, cy]) => (
      <div key={n as string} style={abs(12 + (cx as number) * 124, 194 + (cy as number) * 92, 120, 86, { border: "1px solid #D4D4D4", boxSizing: "border-box" })}>
        <Tx x={6} y={2} w={100} h={18} size={11} color="#555">{n as string}</Tx>
        {n === "Rows" && <Rect x={6} y={26} w={106} h={22} fill="#fff" stroke="#BDBDBD"><Tx x={4} y={0} w={96} h={20} size={11}>{rows}</Tx></Rect>}
        {n === "Values" && <Rect x={6} y={26} w={106} h={22} fill="#fff" stroke="#BDBDBD"><Tx x={4} y={0} w={96} h={20} size={11}>{vals}</Tx></Rect>}
      </div>
    ))}
  </div>
);
