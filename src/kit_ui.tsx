// Shared overlays: cursor, key caps, neon callouts, Windows dialogs, filter menu, caption strip.
import React from "react";
import { Img, staticFile } from "remotion";
import { Arrow, F, Icon, prog } from "./kit";
import { C, LOGO_FILE, STRIP_H, WIDTH } from "./theme";

const ui = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: F.ui, fontSize: size, color: C.ink, ...extra });

// Mouse pointer + click ripple (logical coords, lives inside the Excel stage).
export const Cursor: React.FC<{ x: number; y: number; f: number; clicks?: number[] }> = ({ x, y, f, clicks = [] }) => {
  const rip = clicks.map((c) => ({ c, t: prog(f, c, 12) })).find((r) => r.t > 0 && r.t < 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 50, pointerEvents: "none" }}>
      {rip ? <div style={{ position: "absolute", left: -14, top: -14, width: 28, height: 28, borderRadius: 14, border: `2px solid ${C.blue}`, opacity: 1 - rip.t, transform: `scale(${0.4 + rip.t})` }} /> : null}
      <svg width="22" height="28" viewBox="0 0 22 28" style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(1px 2px 2px rgba(0,0,0,.35))" }}>
        <path d="M2 2 L2 21 L7 16.5 L10.5 25 L14 23.5 L10.6 15.4 L17 15 Z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Neon callout rectangle around a UI region (logical coords).
export const Neon: React.FC<{ x: number; y: number; w: number; h: number; color: string; t: number; label?: string; labelPos?: "top" | "bottom" }> = ({ x, y, w, h, color, t, label, labelPos = "bottom" }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x - 4, top: y - 4, width: w + 8, height: h + 8, borderRadius: 6, border: `2px solid ${color}`, boxShadow: `0 0 ${8 + 10 * t}px ${color}, inset 0 0 8px ${color}55`, opacity: t, pointerEvents: "none", zIndex: 40 }}>
      {label ? <div style={{ position: "absolute", left: 0, [labelPos === "top" ? "bottom" : "top"]: h + 14, whiteSpace: "nowrap", background: C.slate, color: C.text, border: `1.5px solid ${color}`, borderRadius: 6, padding: "4px 10px", ...ui(13, { color: C.text, fontWeight: 600 }) }}>{label}</div> : null}
    </div>
  )
);

// Keyboard shortcut caps shown in screen space (outside the camera).
export const KeyCaps: React.FC<{ keys: string[]; f: number; from: number; hold?: number; accent?: string; bottom?: number }> = ({ keys, f, from, hold = 60, accent = C.blue, bottom = 40 }) => {
  const a = prog(f, from, 8) * (1 - prog(f, from + hold, 10));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: WIDTH, bottom, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(${(1 - a) * 14}px)`, zIndex: 60, pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", background: "rgba(15,23,42,.92)", border: `1.5px solid ${accent}`, borderRadius: 16, padding: "14px 26px", boxShadow: `0 0 28px ${accent}66` }}>
        {keys.map((k, i) => {
          const press = prog(f, from + 6 + i * 7, 6);
          return (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {i > 0 ? <span style={{ color: C.text, fontFamily: F.mono, fontSize: 30 }}>+</span> : null}
              <div style={{ minWidth: 64, height: 58, padding: "0 20px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: press > 0.5 ? accent : "#334155", color: press > 0.5 ? C.slate : C.text, fontFamily: F.mono, fontWeight: 700, fontSize: 28, boxShadow: press > 0.5 ? "0 2px 0 #0b1220" : "0 6px 0 #0b1220", transform: `translateY(${press > 0.5 ? 4 : 0}px)` }}>{k}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Windows-style dialogs ----------
export const Dialog: React.FC<{ x: number; y: number; w: number; h: number; title: string; t?: number; border?: string; children?: React.ReactNode }> = ({ x, y, w, h, title, t = 1, border, children }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#F0F0F0", border: `1px solid ${border ?? "#7A7A7A"}`, boxShadow: border ? `0 0 18px ${border}, 0 8px 28px rgba(0,0,0,.35)` : "0 8px 28px rgba(0,0,0,.35)", boxSizing: "border-box", opacity: Math.min(1, t * 1.5), transform: `scale(${0.96 + 0.04 * t})`, transformOrigin: "50% 40%", zIndex: 30 }}>
      <div style={{ height: 30, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 0 10px", ...ui(12) }}>
        <span>{title}</span>
        <div style={{ display: "flex", height: "100%" }}><div style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center", ...ui(13) }}>?</div><div style={{ width: 44, display: "flex", alignItems: "center", justifyContent: "center", ...ui(14) }}>✕</div></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 30, right: 0, bottom: 0 }}>{children}</div>
    </div>
  )
);
export const DBtn: React.FC<{ x: number; y: number; w: number; label: string; def?: boolean; press?: number; h?: number }> = ({ x, y, w, label, def, press = 0, h = 24 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: press > 0.5 ? "#CCE4F7" : "#E1E1E1", border: `${def ? 2 : 1}px solid ${press > 0.5 ? "#005499" : def ? "#0078D7" : "#ADADAD"}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...ui(12) }}>{label}</div>
);
export const Field: React.FC<{ x: number; y: number; w: number; value: string; dd?: boolean; h?: number; caret?: boolean; hi?: string }> = ({ x, y, w, value, dd, h = 23, caret, hi }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#fff", border: `1px solid ${hi ?? "#7A7A7A"}`, boxShadow: hi ? `0 0 10px ${hi}` : undefined, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 0 6px", ...ui(12.5) }}>
    <span style={{ whiteSpace: "pre" }}>{value}{caret ? <span style={{ borderLeft: "1px solid #000", marginLeft: 1 }} /> : null}</span>
    {dd ? <Icon k="chev" s={11} /> : null}
  </div>
);
export const Lbl: React.FC<{ x: number; y: number; text: string; bold?: boolean; color?: string }> = ({ x, y, text, bold, color }) => (
  <div style={{ position: "absolute", left: x, top: y, whiteSpace: "nowrap", ...ui(12.5, { fontWeight: bold ? 600 : 400, color: color ?? C.ink }) }}>{text}</div>
);

// Info message box ("All done. We made N replacements.")
export const MsgBox: React.FC<{ x: number; y: number; title: string; text: string; t: number }> = ({ x, y, title, text, t }) => (
  <Dialog x={x} y={y} w={330} h={132} title={title} t={t}>
    <div style={{ position: "absolute", left: 16, top: 20, width: 32, height: 32, borderRadius: 16, background: "#0078D7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", ...ui(20, { color: "#fff", fontWeight: 700 }) }}>i</div>
    <Lbl x={62} y={26} text={text} />
    <DBtn x={236} y={66} w={76} label="OK" def />
  </Dialog>
);

// AutoFilter dropdown (x,y = top-left under the header cell).
export type FItem = { label: string; checked: boolean; icon?: "up" | "side" | "down"; sw?: string };
export const FilterMenu: React.FC<{ x: number; y: number; t: number; col: string; items: FItem[]; allChecked?: boolean; hover?: string; sub?: React.ReactNode; hasClear?: boolean; kind?: "Text" | "Number" }> = ({ x, y, t, col, items, allChecked, hover, sub, hasClear, kind = "Text" }) => {
  if (t <= 0) return null;
  const Row: React.FC<{ icon?: string; label: string; arrow?: boolean; off?: boolean; id?: string }> = ({ icon, label, arrow, off, id }) => (
    <div style={{ height: 24, display: "flex", alignItems: "center", gap: 8, padding: "0 8px", background: hover && id === hover ? "#E5F1FB" : "transparent", opacity: off ? 0.45 : 1, ...ui(12.5) }}>
      <div style={{ width: 18 }}>{icon ? <Icon k={icon} s={15} /> : null}</div><span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{label}</span>{arrow ? <span style={{ fontSize: 10 }}>▶</span> : null}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 262, background: "#fff", border: "1px solid #A0A0A0", boxShadow: "0 6px 20px rgba(0,0,0,.3)", opacity: Math.min(1, t * 1.6), transform: `translateY(${(1 - t) * -6}px)`, zIndex: 35, boxSizing: "border-box" }}>
      <Row icon="sortaz" label="Sort A to Z" /><Row icon="sortza" label="Sort Z to A" />
      <div style={{ height: 1, background: "#E1E1E1", margin: "2px 0" }} />
      <Row label="Sort by Color" arrow /><Row label="Sheet View" arrow />
      <div style={{ height: 1, background: "#E1E1E1", margin: "2px 0" }} />
      <Row icon="clearf" label={`Clear Filter From "${col}"`} off={!hasClear} id="clear" />
      <Row label="Filter by Color" arrow id="color" />
      <Row label={`${kind} Filters`} arrow />
      <div style={{ margin: "4px 8px", height: 22, border: "1px solid #A0A0A0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px", ...ui(12, { color: "#777" }) }}>Search<Icon k="search" s={13} /></div>
      <div style={{ margin: "0 8px", height: 162, border: "1px solid #CFCFCF", padding: "3px 0", boxSizing: "border-box", overflow: "hidden" }}>
        {[{ label: "(Select All)", checked: !!allChecked } as FItem, ...items].map((it, i) => (
          <div key={i} style={{ height: 22, display: "flex", alignItems: "center", gap: 7, padding: "0 6px", ...ui(12.5) }}>
            <div style={{ width: 13, height: 13, border: "1px solid #666", boxSizing: "border-box", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: C.xGreen, fontSize: 11, fontWeight: 700 }}>{it.checked ? "✓" : ""}</div>
            {it.icon ? <Arrow kind={it.icon} /> : null}<span>{it.label}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "relative", height: 36 }}>
        <div style={{ position: "absolute", right: 90, top: 6, width: 70, height: 24, border: "2px solid #0078D7", background: "#E1E1E1", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...ui(12) }}>OK</div>
        <div style={{ position: "absolute", right: 10, top: 6, width: 70, height: 24, border: "1px solid #ADADAD", background: "#E1E1E1", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...ui(12) }}>Cancel</div>
      </div>
      {sub}
    </div>
  );
};
// Submenu panel used by "Filter by Color" (cell colour swatches / icons).
export const SubPanel: React.FC<{ x: number; y: number; title: string; swatches?: { c: string; id: string }[]; icons?: ("up" | "side" | "down" | "none")[]; hover?: string }> = ({ x, y, title, swatches, icons, hover }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 190, background: "#fff", border: "1px solid #A0A0A0", boxShadow: "0 6px 20px rgba(0,0,0,.3)", padding: "6px 8px 8px", boxSizing: "border-box" }}>
    <div style={ui(12, { fontWeight: 700, marginBottom: 6 })}>{title}</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {(swatches ?? []).map((s) => <div key={s.id} style={{ width: 22, height: 22, background: s.c, border: `2px solid ${hover === s.id ? "#0078D7" : "#9A9A9A"}`, boxSizing: "border-box" }} />)}
      {(icons ?? []).map((k, i) => <div key={i} style={{ width: 26, height: 22, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${hover === "icon-" + k ? "#0078D7" : "transparent"}`, boxSizing: "border-box", background: hover === "icon-" + k ? "#E5F1FB" : "transparent" }}>{k === "none" ? <span style={ui(10)}>—</span> : <Arrow kind={k} s={15} />}</div>)}
    </div>
  </div>
);

// Logo: the SVG has wide padding, so it is cropped by oversizing inside a clipped box.
export const Logo: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ width: s, height: s, overflow: "hidden", position: "relative", flex: "none" }}>
    <Img src={staticFile(LOGO_FILE)} style={{ position: "absolute", left: -s * 0.5, top: -s * 0.5, width: s * 2, height: s * 2, filter: "invert(1)" }} />
  </div>
);

// ---------- caption strip (Slate, top of the frame) ----------
export const TopStrip: React.FC<{ f: number; lines: { from: number; to: number; text: string; color?: string; ar?: boolean }[]; badge?: string }> = ({ f, lines, badge }) => {
  const cur = lines.find((l) => f >= l.from && f <= l.to);
  const a = cur ? prog(f, cur.from, 12) * (1 - prog(f, cur.to - 12, 12)) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: STRIP_H, background: C.slate, borderBottom: `2px solid ${C.xGreen}`, boxSizing: "border-box", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: 330 }}>
        <Logo s={64} />
        <div style={{ fontFamily: F.ar, fontWeight: 700, fontSize: 24, color: C.text, lineHeight: "26px" }}>منظومة<div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: "#94A3B8", letterSpacing: 1 }}>MANZOOMA</div></div>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(${(1 - a) * 8}px)` }}>
        {cur ? <div style={{ fontFamily: cur.ar ? F.ar : F.ui, fontWeight: 600, fontSize: cur.text.length > 60 ? 22 : 26, color: cur.color ?? C.text, background: C.slate2, border: `1.5px solid ${cur.color ?? C.blue}`, borderRadius: 12, padding: "6px 22px", whiteSpace: "nowrap", unicodeBidi: "plaintext", direction: cur.ar ? "rtl" : "ltr", boxShadow: `0 0 16px ${(cur.color ?? C.blue)}44` }}>{cur.text}</div> : null}
      </div>
      <div style={{ width: 330, display: "flex", justifyContent: "flex-end", fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: "#94A3B8" }}>{badge ?? ""}</div>
    </div>
  );
};

// Scene wrapper: soft fade in/out + a 2D move (slide/zoom), calm, no flicker.
export const SceneFx: React.FC<{ f: number; dur: number; kind: "left" | "down" | "zoom" | "expand" | "fade"; children: React.ReactNode }> = ({ f, dur, kind, children }) => {
  const i = prog(f, 0, 16), o = 1 - prog(f, dur - 12, 12);
  const k = 1 - i;
  const tr = kind === "left" ? `translateX(${k * 60}px)` : kind === "down" ? `translateY(${k * -50}px)` : kind === "zoom" ? `scale(${1 + k * 0.08})` : kind === "expand" ? `scale(${0.94 + 0.06 * i})` : "none";
  return <div style={{ position: "absolute", inset: 0, opacity: Math.min(i, o), transform: tr, transformOrigin: "50% 50%" }}>{children}</div>;
};

// ---------- reusable dialogs: Sort / Find and Replace ----------
export const SortDialog: React.FC<{ x: number; y: number; t: number; l2: number; hi1?: string; hi2?: string; hiO1?: string; hiO2?: string; add?: number; ok?: number; border?: string }> = ({ x, y, t, l2, hi1, hi2, hiO1, hiO2, add = 0, ok = 0, border }) => (
  <Dialog x={x} y={y} w={580} h={318} title="Sort" t={t} border={border}>
    <DBtn x={10} y={8} w={86} label="+ Add Level" press={add} />
    <DBtn x={100} y={8} w={96} label="✕ Delete Level" />
    <DBtn x={200} y={8} w={86} label="Copy Level" />
    <DBtn x={290} y={8} w={26} label="▲" /><DBtn x={318} y={8} w={26} label="▼" />
    <DBtn x={352} y={8} w={76} label="Options..." />
    <div style={{ position: "absolute", left: 440, top: 12, width: 13, height: 13, border: "1px solid #444", background: "#fff", boxSizing: "border-box", color: C.xGreen, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
    <Lbl x={458} y={10} text="My data has headers" />
    <div style={{ position: "absolute", left: 10, top: 44, width: 560, height: 196, background: "#fff", border: "1px solid #A0A0A0", boxSizing: "border-box" }}>
      <div style={{ height: 24, background: "#F7F7F7", borderBottom: "1px solid #D0D0D0" }}>
        <Lbl x={62} y={4} text="Column" /><Lbl x={270} y={4} text="Sort On" /><Lbl x={398} y={4} text="Order" />
      </div>
      <Lbl x={10} y={40} text="Sort by" />
      <Field x={62} y={36} w={198} value="Store Branch" dd hi={hi1} /><Field x={268} y={36} w={120} value="Cell Values" dd /><Field x={396} y={36} w={150} value="A to Z" dd hi={hiO1} />
      <div style={{ opacity: l2, transform: `translateY(${(1 - l2) * 8}px)` }}>
        <Lbl x={10} y={84} text="Then by" />
        <Field x={62} y={80} w={198} value="Total Revenue" dd hi={hi2} /><Field x={268} y={80} w={120} value="Cell Values" dd /><Field x={396} y={80} w={150} value="Largest to Smallest" dd hi={hiO2} />
      </div>
    </div>
    <DBtn x={406} y={252} w={76} label="OK" def press={ok} /><DBtn x={490} y={252} w={76} label="Cancel" />
  </Dialog>
);
export const FindDialog: React.FC<{ x: number; y: number; t: number; find: string; repl: string; focus?: "find" | "repl"; hiFind?: string; press?: string }> = ({ x, y, t, find, repl, focus, hiFind, press }) => (
  <Dialog x={x} y={y} w={460} h={246} title="Find and Replace" t={t}>
    <div style={{ position: "absolute", left: 10, top: 8, width: 52, height: 24, border: "1px solid #ADADAD", borderBottom: "none", background: "#F0F0F0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...ui(12) }}>Find</div>
    <div style={{ position: "absolute", left: 62, top: 6, width: 66, height: 26, border: "1px solid #ADADAD", borderBottom: "none", background: "#fff", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...ui(12, { fontWeight: 600 }) }}>Replace</div>
    <div style={{ position: "absolute", left: 10, top: 32, width: 440, height: 1, background: "#ADADAD" }} />
    <Lbl x={16} y={50} text="Find what:" /><Field x={110} y={46} w={250} value={find} caret={focus === "find"} hi={hiFind} /><DBtn x={368} y={46} w={72} label="Format..." />
    <Lbl x={16} y={90} text="Replace with:" /><Field x={110} y={86} w={250} value={repl} caret={focus === "repl"} /><DBtn x={368} y={86} w={72} label="Format..." />
    <DBtn x={16} y={128} w={90} label="Options >>" />
    <DBtn x={16} y={176} w={92} label="Replace All" press={press === "all" ? 1 : 0} /><DBtn x={112} y={176} w={76} label="Replace" /><DBtn x={192} y={176} w={76} label="Find All" /><DBtn x={272} y={176} w={84} label="Find Next" /><DBtn x={360} y={176} w={80} label="Close" />
  </Dialog>
);

// ---------- formula-entry helpers (shared by every function lesson) ----------
export type Seg = { t: string; c?: string; bg?: string; b?: boolean };
export const CellEditor: React.FC<{ x: number; y: number; segs: Seg[]; minW?: number }> = ({ x, y, segs, minW = 70 }) => {
  const len = segs.reduce((a, s) => a + s.t.length, 0);
  return (
    <div style={{ position: "absolute", left: x - 1, top: y - 1, width: Math.max(minW, len * 7.4 + 12), height: 22, background: "#fff", border: `2px solid ${C.xGreen}`, boxSizing: "border-box", padding: "0 3px", display: "flex", alignItems: "center", fontFamily: F.cell, fontSize: 14.67, whiteSpace: "pre", zIndex: 25 }}>
      {segs.map((s, i) => <span key={i} style={{ color: s.c ?? C.ink, background: s.bg, fontWeight: s.b ? 700 : 400, borderRadius: 3, boxShadow: s.bg ? `0 0 10px ${s.bg}` : undefined }}>{s.t}</span>)}
      <span style={{ borderLeft: "1px solid #000", height: 15, marginLeft: 1 }} />
    </div>
  );
};
// Colour the arguments of a typed function call (Excel colours referenced ranges).
export const argSegs = (text: string, colors: string[]): Seg[] => {
  const out: Seg[] = []; let cur = ""; let arg = -1; let q = false; let depth = 0;
  const flush = (): void => { if (cur) out.push({ t: cur, c: arg >= 0 ? colors[Math.min(arg, colors.length - 1)] : undefined }); cur = ""; };
  for (const ch of text) {
    if (ch === '"') q = !q;
    if (!q && ch === "(") { depth++; cur += ch; if (depth === 1) { flush(); arg = 0; } continue; }
    if (!q && ch === ")") { depth--; }
    if (!q && ch === "," && depth === 1) { flush(); out.push({ t: ",", c: undefined }); arg++; continue; }
    cur += ch;
  }
  flush();
  return out;
};
export const argIndex = (text: string): number => {
  let q = false, depth = 0, n = 0;
  for (const ch of text) { if (ch === '"') q = !q; if (q) continue; if (ch === "(") depth++; else if (ch === ")") depth--; else if (ch === "," && depth === 1) n++; }
  return n;
};
export const FuncTip: React.FC<{ x: number; y: number; name: string; params: string[]; active: number }> = ({ x, y, name, params, active }) => (
  <div style={{ position: "absolute", left: x, top: y, background: "#fff", border: "1px solid #8A8A8A", padding: "3px 8px", fontFamily: F.ui, fontSize: 12.5, whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,.25)", zIndex: 26, color: C.ink }}>
    <span>{name}(</span>
    {params.map((p, i) => <span key={i}><span style={{ fontWeight: i === active ? 700 : 400, textDecoration: i === active ? "underline" : "none" }}>{p}</span>{i < params.length - 1 ? ", " : ""}</span>)}
    <span>)</span>
  </div>
);
export const ErrTag: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  t <= 0 ? null : (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: "absolute", left: x, top: y + 1, opacity: t, zIndex: 24 }}>
      <path d="M9 1 L17 9 L9 17 L1 9 Z" fill="#F2C94C" stroke="#9A7B00" strokeWidth="1" /><text x="9" y="13" fontSize="11" fontWeight="700" textAnchor="middle" fill="#333" fontFamily="Arial">!</text>
    </svg>
  )
);
export const Shield: React.FC<{ x: number; y: number; t: number; label: string; color: string }> = ({ x, y, t, label, color }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `scale(${0.7 + 0.3 * t})`, transformOrigin: "0 0", zIndex: 45, display: "flex", alignItems: "center", gap: 12, background: C.slate, border: `2px solid ${color}`, borderRadius: 14, padding: "8px 16px", boxShadow: `0 0 22px ${color}` }}>
      <svg width="40" height="46" viewBox="0 0 40 46"><path d="M20 2 L37 8 V22 C37 33 29 41 20 44 C11 41 3 33 3 22 V8 Z" fill={`${color}33`} stroke={color} strokeWidth="2.5" /><path d="M12 23 L18 29 L29 16" fill="none" stroke={C.text} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 18, color: C.text, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  )
);
export const KpiCard: React.FC<{ x: number; y: number; label: string; value: string; color: string; t: number; flash?: number }> = ({ x, y, label, value, color, t, flash = 0 }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: 168, opacity: t, transform: `translateY(${(1 - t) * 10}px)`, background: C.slate, border: `2px solid ${color}`, borderRadius: 12, padding: "8px 14px", boxShadow: `0 0 ${10 + 22 * flash}px ${color}`, zIndex: 40 }}>
      <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 12, color: "#94A3B8", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.text, marginTop: 2 }}>{value}</div>
    </div>
  )
);
// Boolean logic matrix: shows how * (AND) and + (OR) combine two TRUE/FALSE columns.
export const LogicMatrix: React.FC<{ x: number; y: number; t: number; f: number; mode: "and" | "or"; rows: { branch: string; amount: number }[]; color: string }> = ({ x, y, t, f, mode, rows, color }) => {
  if (t <= 0) return null;
  const cell = (w: number, txt: string, c?: string, b?: boolean): React.ReactNode => <div style={{ width: w, textAlign: "center", color: c ?? C.text, fontWeight: b ? 700 : 400 }}>{txt}</div>;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 400, opacity: t, background: C.slate, border: `2px solid ${color}`, borderRadius: 12, padding: "8px 10px", boxShadow: `0 0 18px ${color}88`, fontFamily: F.mono, fontSize: 11.5, zIndex: 40 }}>
      <div style={{ display: "flex", color: "#94A3B8", marginBottom: 4 }}>{cell(66, "Branch")}{cell(56, "Amount")}{cell(100, "Branch=Cairo")}{cell(100, mode === "and" ? "Amount>5000" : "Branch=Alex")}{cell(40, mode === "and" ? "×" : "+", color, true)}</div>
      {rows.map((r, i) => {
        const a = r.branch === "Cairo"; const b = mode === "and" ? r.amount > 5000 : r.branch === "Alex";
        const res = mode === "and" ? Number(a) * Number(b) : Number(a) + Number(b);
        const ap = prog(f, 12 + i * 6, 10);
        return (
          <div key={i} style={{ display: "flex", height: 22, alignItems: "center", opacity: ap, background: res > 0 ? "rgba(16,185,129,.18)" : "transparent", borderRadius: 4 }}>
            {cell(66, r.branch)}{cell(56, num0(r.amount))}{cell(100, a ? "TRUE" : "FALSE", a ? C.green : "#F87171")}{cell(100, b ? "TRUE" : "FALSE", b ? C.green : "#F87171")}{cell(40, String(res), res > 0 ? C.green : "#F87171", true)}
          </div>
        );
      })}
    </div>
  );
};
const num0 = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// ---------- Conditional Formatting UI (shared by every CF lesson) ----------
export const CFMenu: React.FC<{ x: number; y: number; t: number; hover?: string }> = ({ x, y, t, hover }) => {
  if (t <= 0) return null;
  const items: [string, boolean, string][] = [["Highlight Cells Rules", true, "hl"], ["Top/Bottom Rules", true, "tb"], ["Data Bars", true, "db"], ["Color Scales", true, "cs"], ["Icon Sets", true, "is"], ["-", false, ""], ["New Rule...", false, "new"], ["Clear Rules", true, "clr"], ["Manage Rules...", false, "mgr"]];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 232, background: "#fff", border: "1px solid #A0A0A0", boxShadow: "0 6px 20px rgba(0,0,0,.3)", opacity: Math.min(1, t * 1.6), transform: `translateY(${(1 - t) * -6}px)`, zIndex: 35, padding: "3px 0" }}>
      {items.map(([label, arrow, id], i) => label === "-" ? <div key={i} style={{ height: 1, background: "#E1E1E1", margin: "3px 0" }} /> : (
        <div key={i} style={{ height: 26, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", background: hover === id ? "#E5F1FB" : "transparent", ...ui(12.5) }}>
          <Icon k={id === "new" ? "cond" : id === "mgr" ? "styles" : "cond"} s={15} /><span style={{ flex: 1 }}>{label}</span>{arrow ? <span style={{ fontSize: 10 }}>▶</span> : null}
        </div>
      ))}
    </div>
  );
};
export const NewRuleDialog: React.FC<{ x: number; y: number; t: number; segs: Seg[]; preview: string; ok?: number; hiFormula?: string }> = ({ x, y, t, segs, preview, ok = 0, hiFormula }) => {
  const types = ["Format all cells based on their values", "Format only cells that contain", "Format only top or bottom ranked values", "Format only values that are above or below average", "Format only unique or duplicate values", "Use a formula to determine which cells to format"];
  return (
    <Dialog x={x} y={y} w={520} h={474} title="New Formatting Rule" t={t}>
      <Lbl x={12} y={8} text="Select a Rule Type:" />
      <div style={{ position: "absolute", left: 12, top: 28, width: 496, height: 138, background: "#fff", border: "1px solid #7A7A7A", boxSizing: "border-box", padding: "2px 0" }}>
        {types.map((s, i) => <div key={i} style={{ height: 22, display: "flex", alignItems: "center", padding: "0 8px", background: i === 5 ? "#0078D7" : "transparent", ...ui(12.5, { color: i === 5 ? "#fff" : C.ink }) }}>{s}</div>)}
      </div>
      <Lbl x={12} y={178} text="Edit the Rule Description:" />
      <Lbl x={12} y={204} text="Format values where this formula is true:" bold />
      <div style={{ position: "absolute", left: 12, top: 226, width: 496, height: 26, background: "#fff", border: `1px solid ${hiFormula ?? "#7A7A7A"}`, boxShadow: hiFormula ? `0 0 12px ${hiFormula}` : undefined, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 6px", fontFamily: F.cell, fontSize: 14.67, whiteSpace: "pre" }}>
        {segs.map((s, i) => <span key={i} style={{ color: s.c ?? C.ink, background: s.bg, fontWeight: s.b ? 700 : 400, borderRadius: 3, boxShadow: s.bg ? `0 0 10px ${s.bg}` : undefined }}>{s.t}</span>)}
        <span style={{ borderLeft: "1px solid #000", height: 15, marginLeft: 1 }} />
      </div>
      <Lbl x={12} y={282} text="Preview:" />
      <div style={{ position: "absolute", left: 72, top: 272, width: 230, height: 32, background: preview, border: "1px solid #A0A0A0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...ui(14, { fontFamily: F.cell }) }}>AaBbCcYyZz</div>
      <DBtn x={322} y={274} w={110} label="Format..." />
      <DBtn x={308} y={396} w={96} label="OK" def press={ok} /><DBtn x={412} y={396} w={96} label="Cancel" />
    </Dialog>
  );
};
export type CFRule = { formula: string; color: string; applies: string; appliesHi?: string; stop: boolean; stopHi?: string };
export const RulesManager: React.FC<{ x: number; y: number; t: number; rules: CFRule[]; selected?: number; arrows?: string }> = ({ x, y, t, rules, selected = 0, arrows }) => (
  <Dialog x={x} y={y} w={720} h={372} title="Conditional Formatting Rules Manager" t={t}>
    <Lbl x={12} y={12} text="Show formatting rules for:" /><Field x={170} y={8} w={190} value="This Worksheet" dd />
    <DBtn x={12} y={42} w={96} label="New Rule..." /><DBtn x={112} y={42} w={96} label="Edit Rule..." /><DBtn x={212} y={42} w={96} label="Delete Rule" />
    <DBtn x={560} y={42} w={32} label="▲" /><DBtn x={596} y={42} w={32} label="▼" />
    {arrows ? <div style={{ position: "absolute", left: 556, top: 38, width: 76, height: 32, borderRadius: 4, border: `2px solid ${arrows}`, boxShadow: `0 0 12px ${arrows}`, boxSizing: "border-box" }} /> : null}
    <div style={{ position: "absolute", left: 12, top: 80, width: 696, height: 214, background: "#fff", border: "1px solid #A0A0A0", boxSizing: "border-box" }}>
      <div style={{ height: 24, background: "#F7F7F7", borderBottom: "1px solid #D0D0D0", position: "relative" }}>
        <Lbl x={8} y={4} text="Rule (applied in the order shown)" /><Lbl x={330} y={4} text="Format" /><Lbl x={440} y={4} text="Applies to" /><Lbl x={596} y={4} text="Stop If True" />
      </div>
      {rules.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: 24 + i * 40, width: 694, height: 40, background: i === selected ? "#E5F1FB" : "transparent", borderBottom: "1px solid #EEE" }}>
          <div style={{ position: "absolute", left: 8, top: 11, whiteSpace: "nowrap", ...ui(12, { fontFamily: F.cell, fontSize: 13.5 }) }}>Formula: {r.formula}</div>
          <div style={{ position: "absolute", left: 330, top: 9, width: 96, height: 22, background: r.color, border: "1px solid #A0A0A0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...ui(12, { fontFamily: F.cell }) }}>AaBbCc</div>
          <div style={{ position: "absolute", left: 440, top: 8, width: 150, height: 24, background: "#fff", border: `${r.appliesHi ? 2 : 1}px solid ${r.appliesHi ?? "#7A7A7A"}`, boxShadow: r.appliesHi ? `0 0 14px ${r.appliesHi}` : undefined, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 6px", ...ui(12.5, { fontFamily: F.cell }) }}>{r.applies}</div>
          <div style={{ position: "absolute", left: 622, top: 12, width: 15, height: 15, background: "#fff", border: `${r.stopHi ? 2 : 1}px solid ${r.stopHi ?? "#555"}`, boxShadow: r.stopHi ? `0 0 12px ${r.stopHi}` : undefined, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", color: C.xGreen, fontSize: 12, fontWeight: 700 }}>{r.stop ? "✓" : ""}</div>
        </div>
      ))}
    </div>
    <DBtn x={438} y={310} w={80} label="OK" def /><DBtn x={526} y={310} w={80} label="Close" /><DBtn x={614} y={310} w={80} label="Apply" />
  </Dialog>
);

// ---------- Pivot / chart / slicer UI (shared by every pivot lesson) ----------
export const CtxMenu: React.FC<{ x: number; y: number; t: number; items: { label: string; arrow?: boolean; sep?: boolean; id?: string }[]; hover?: string; w?: number }> = ({ x, y, t, items, hover, w = 250 }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: w, background: "#fff", border: "1px solid #A0A0A0", boxShadow: "0 6px 20px rgba(0,0,0,.3)", opacity: Math.min(1, t * 1.6), transform: `translateY(${(1 - t) * -6}px)`, zIndex: 36, padding: "3px 0" }}>
      {items.map((it, i) => it.sep ? <div key={i} style={{ height: 1, background: "#E1E1E1", margin: "3px 0" }} /> : (
        <div key={i} style={{ height: 24, display: "flex", alignItems: "center", padding: "0 12px 0 30px", background: hover && it.id === hover ? "#E5F1FB" : "transparent", ...ui(12.5) }}><span style={{ flex: 1, whiteSpace: "nowrap" }}>{it.label}</span>{it.arrow ? <span style={{ fontSize: 10 }}>▶</span> : null}</div>
      ))}
    </div>
  )
);
export const FieldsPane: React.FC<{ top: number; h: number; fields: { name: string; on: boolean }[]; rows: string[]; values: string[]; cols?: string[]; filters?: string[]; glow?: { area: "rows" | "values"; color: string; t: number } }> = ({ top, h, fields, rows, values, cols = [], filters = [], glow }) => {
  const area = (id: string, label: string, items: string[], x: number, y: number): React.ReactNode => {
    const g = glow && glow.area === id && glow.t > 0.02;
    return (
      <div key={id} style={{ position: "absolute", left: x, top: y, width: 128, height: 84, border: `1px solid ${g && glow ? glow.color : "#BDBDBD"}`, boxShadow: g && glow ? `0 0 14px ${glow.color}` : undefined, background: "#fff", boxSizing: "border-box", padding: 4 }}>
        <div style={ui(11, { color: C.inkSoft, marginBottom: 3 })}>{label}</div>
        {items.map((s, i) => <div key={i} style={{ height: 18, background: "#F3F3F3", border: "1px solid #D0D0D0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px", marginBottom: 2, ...ui(11) }}><span>{s}</span><span style={{ fontSize: 8 }}>▼</span></div>)}
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 1536 - 290, top, width: 290, height: h, background: "#fff", border: "1px solid #BDBDBD", boxSizing: "border-box", zIndex: 28 }}>
      <div style={{ height: 30, background: "#F3F3F3", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", ...ui(13, { fontWeight: 600 }) }}><span>PivotTable Fields</span><span style={{ fontSize: 11 }}>▾  ✕</span></div>
      <div style={{ padding: "8px 10px 0", ...ui(12, { color: C.inkSoft }) }}>Choose fields to add to report:</div>
      <div style={{ margin: "6px 10px", height: 22, border: "1px solid #BDBDBD", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px", ...ui(12, { color: "#888" }) }}>Search<Icon k="search" s={13} /></div>
      <div style={{ padding: "0 10px" }}>
        {fields.map((f, i) => <div key={i} style={{ height: 22, display: "flex", alignItems: "center", gap: 8, ...ui(12.5) }}><div style={{ width: 13, height: 13, border: "1px solid #666", boxSizing: "border-box", color: C.xGreen, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{f.on ? "✓" : ""}</div>{f.name}</div>)}
      </div>
      <div style={{ padding: "8px 10px 0", ...ui(12, { color: C.inkSoft }) }}>Drag fields between areas below:</div>
      {area("filters", "▼ Filters", filters, 10, 262)}{area("columns", "▥ Columns", cols, 150, 262)}{area("rows", "☰ Rows", rows, 10, 352)}{area("values", "Σ Values", values, 150, 352)}
    </div>
  );
};
export const Slicer: React.FC<{ x: number; y: number; t: number; title: string; items: string[]; sel: string[]; glow?: string; hover?: string }> = ({ x, y, t, title, items, sel, glow, hover }) => (
  t <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, width: 176, background: "#fff", border: `1px solid ${glow ?? "#A6A6A6"}`, boxShadow: glow ? `0 0 16px ${glow}` : "0 2px 8px rgba(0,0,0,.2)", opacity: t, transform: `scale(${0.94 + 0.06 * t})`, transformOrigin: "0 0", zIndex: 30, boxSizing: "border-box" }}>
      <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", ...ui(13, { fontWeight: 600 }) }}><span>{title}</span><span style={{ fontSize: 12, color: "#555" }}>☰ ⛉</span></div>
      <div style={{ padding: "2px 6px 8px" }}>
        {items.map((s) => { const on = sel.includes(s); return <div key={s} style={{ height: 28, marginBottom: 3, border: `1px solid ${on ? "#5B9BD5" : "#C8C8C8"}`, background: on ? "#BDD7EE" : hover === s ? "#EEF5FB" : "#fff", display: "flex", alignItems: "center", padding: "0 10px", ...ui(13, { color: on ? "#1F3864" : "#444", fontWeight: on ? 600 : 400 }) }}>{s}</div>; })}
      </div>
    </div>
  )
);
export const Timeline: React.FC<{ x: number; y: number; t: number; range: [number, number]; glow?: string }> = ({ x, y, t, range, glow }) => {
  if (t <= 0) return null;
  const mons = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 520, height: 108, background: "#fff", border: `1px solid ${glow ?? "#A6A6A6"}`, boxShadow: glow ? `0 0 16px ${glow}` : "0 2px 8px rgba(0,0,0,.2)", opacity: t, zIndex: 30, boxSizing: "border-box" }}>
      <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", ...ui(13, { fontWeight: 600 }) }}><span>Date</span><span style={ui(11, { color: C.inkSoft })}>MONTHS ▾</span></div>
      <div style={{ margin: "0 10px", height: 20, background: "#F3F3F3", ...ui(11, { color: C.inkSoft }), display: "flex", alignItems: "center", paddingLeft: 6 }}>2026</div>
      <div style={{ position: "relative", margin: "6px 10px 0", height: 34, borderBottom: "1px solid #BDBDBD" }}>
        {mons.map((m, i) => <div key={m} style={{ position: "absolute", left: i * 41.2, top: 0, width: 41, height: 28, textAlign: "center", ...ui(11, { color: "#555", lineHeight: "28px" }) }}>{m}</div>)}
        <div style={{ position: "absolute", left: range[0] * 41.2, top: 0, width: (range[1] - range[0] + 1) * 41.2, height: 28, background: "rgba(91,155,213,.45)", border: "1px solid #5B9BD5", boxSizing: "border-box" }} />
      </div>
    </div>
  );
};
const niceMax = (v: number): number => { if (v <= 0) return 1; const s = Math.pow(10, Math.floor(Math.log10(v))); for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * s >= v * 1.04) return m * s; return 10 * s; };
const fmtY = (v: number): string => (v >= 1e6 ? (v / 1e6).toFixed(v % 1e6 === 0 ? 0 : 1) + "M" : v >= 1e3 ? Math.round(v / 1e3) + "K" : String(Math.round(v)));
export type ChartProps = { x: number; y: number; w: number; h: number; t: number; title: string; cats: string[]; vals: number[]; color?: string; horiz?: boolean; groups?: { label: string; from: number; to: number }[]; btns?: { label: string; x: number; y: number }[]; btnT?: number; btnColor?: string; glow?: string; growth?: number; hi?: number; pm?: boolean; sel?: boolean; yMax?: number };
export const ChartBox: React.FC<ChartProps> = (p) => {
  const L = p.horiz ? 84 : 56, R = 18, T = 40, B = p.groups ? 66 : 44;
  const pw = p.w - L - R, ph = p.h - T - B; const n = Math.max(1, p.cats.length);
  const mx = p.yMax ?? niceMax(Math.max(...p.vals, 1)); const g = p.growth ?? 1; const col = p.color ?? "#4472C4";
  const ticks = [0, 1, 2, 3, 4, 5].map((i) => (mx * i) / 5);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, width: p.w, height: p.h, background: "#fff", border: `${p.glow ? 2 : 1}px solid ${p.glow ?? (p.sel ? "#5B9BD5" : "#D9D9D9")}`, boxShadow: p.glow ? `0 0 18px ${p.glow}` : undefined, opacity: p.t, transform: `scale(${0.96 + 0.04 * p.t})`, transformOrigin: "50% 50%", boxSizing: "border-box", zIndex: 24 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 8, textAlign: "center", ...ui(14, { color: "#595959" }) }}>{p.title}</div>
      <svg width={p.w} height={p.h} style={{ position: "absolute", left: 0, top: 0 }}>
        {ticks.map((tv, i) => p.horiz ? (
          <g key={i}><line x1={L + (pw * i) / 5} x2={L + (pw * i) / 5} y1={T} y2={T + ph} stroke="#E4E4E4" /><text x={L + (pw * i) / 5} y={T + ph + 14} fontSize="10" textAnchor="middle" fill="#666" fontFamily="Arial">{fmtY(tv)}</text></g>
        ) : (
          <g key={i}><line x1={L} x2={L + pw} y1={T + ph - (ph * i) / 5} y2={T + ph - (ph * i) / 5} stroke="#E4E4E4" /><text x={L - 6} y={T + ph - (ph * i) / 5 + 3} fontSize="10" textAnchor="end" fill="#666" fontFamily="Arial">{fmtY(tv)}</text></g>
        ))}
        {p.cats.map((c, i) => {
          const v = (p.vals[i] ?? 0) * g; const hi = p.hi === i;
          if (p.horiz) { const bh = (ph / n) * 0.62, by = T + (ph / n) * i + ((ph / n) - bh) / 2; return <g key={i}><rect x={L} y={by} width={(v / mx) * pw} height={bh} fill={hi ? "#F59E0B" : col} /><text x={L - 6} y={by + bh / 2 + 4} fontSize="10.5" textAnchor="end" fill="#555" fontFamily="Arial">{c}</text></g>; }
          const bw = (pw / n) * 0.6, bx = L + (pw / n) * i + ((pw / n) - bw) / 2, bh = (v / mx) * ph;
          return <g key={i}><rect x={bx} y={T + ph - bh} width={bw} height={bh} fill={hi ? "#F59E0B" : col} /><text x={bx + bw / 2} y={T + ph + 14} fontSize={n > 10 ? 9 : 10.5} textAnchor="middle" fill="#555" fontFamily="Arial">{c}</text></g>;
        })}
        {!p.horiz ? <line x1={L} x2={L + pw} y1={T + ph} y2={T + ph} stroke="#BFBFBF" /> : <line x1={L} x2={L} y1={T} y2={T + ph} stroke="#BFBFBF" />}
        {(p.groups ?? []).map((gr, i) => <g key={i}><line x1={L + (pw / n) * gr.from + 3} x2={L + (pw / n) * (gr.to + 1) - 3} y1={T + ph + 22} y2={T + ph + 22} stroke="#BFBFBF" /><text x={L + (pw / n) * ((gr.from + gr.to + 1) / 2)} y={T + ph + 36} fontSize="11" textAnchor="middle" fill="#444" fontFamily="Arial" fontWeight="700">{gr.label}</text></g>)}
      </svg>
      {(p.btns ?? []).map((b, i) => (p.btnT ?? 0) > 0.02 ? <div key={i} style={{ position: "absolute", left: b.x, top: b.y, opacity: p.btnT, height: 20, padding: "0 8px", background: "#F2F2F2", border: `${p.btnColor ? 2 : 1}px solid ${p.btnColor ?? "#A6A6A6"}`, boxShadow: p.btnColor ? `0 0 10px ${p.btnColor}` : undefined, borderRadius: 3, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, ...ui(11) }}>{b.label}<span style={{ fontSize: 8 }}>▼</span></div> : null)}
      {p.pm ? <div style={{ position: "absolute", right: 8, bottom: 6, display: "flex", gap: 4 }}>{["+", "−"].map((s) => <div key={s} style={{ width: 20, height: 20, border: "1px solid #A6A6A6", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", ...ui(14) }}>{s}</div>)}</div> : null}
    </div>
  );
};
export const GroupingDialog: React.FC<{ x: number; y: number; t: number; sel: string[]; glow?: string; ok?: number; startAt: string; endAt: string }> = ({ x, y, t, sel, glow, ok = 0, startAt, endAt }) => {
  const opts = ["Seconds", "Minutes", "Hours", "Days", "Months", "Quarters", "Years"];
  return (
    <Dialog x={x} y={y} w={300} h={400} title="Grouping" t={t}>
      <Lbl x={12} y={8} text="Auto" bold />
      <div style={{ position: "absolute", left: 14, top: 36, width: 13, height: 13, background: "#fff", border: "1px solid #444", boxSizing: "border-box", color: C.xGreen, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
      <Lbl x={36} y={34} text="Starting at:" /><Field x={120} y={30} w={160} value={startAt} />
      <div style={{ position: "absolute", left: 14, top: 72, width: 13, height: 13, background: "#fff", border: "1px solid #444", boxSizing: "border-box", color: C.xGreen, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
      <Lbl x={36} y={70} text="Ending at:" /><Field x={120} y={66} w={160} value={endAt} />
      <Lbl x={12} y={110} text="By" bold />
      <div style={{ position: "absolute", left: 12, top: 132, width: 276, height: 172, background: "#fff", border: `1px solid ${glow ?? "#7A7A7A"}`, boxShadow: glow ? `0 0 14px ${glow}` : undefined, boxSizing: "border-box", padding: "2px 0" }}>
        {opts.map((o) => <div key={o} style={{ height: 24, display: "flex", alignItems: "center", padding: "0 10px", background: sel.includes(o) ? "#0078D7" : "transparent", ...ui(12.5, { color: sel.includes(o) ? "#fff" : C.ink }) }}>{o}</div>)}
      </div>
      <DBtn x={104} y={326} w={86} label="OK" def press={ok} /><DBtn x={198} y={326} w={86} label="Cancel" />
    </Dialog>
  );
};
export const ReportConnDialog: React.FC<{ x: number; y: number; t: number; checked: boolean[]; glow?: string; ok?: number; title: string; names: string[] }> = ({ x, y, t, checked, glow, ok = 0, title, names }) => (
  <Dialog x={x} y={y} w={420} h={330} title={title} t={t}>
    <Lbl x={12} y={10} text="Select the PivotTables and PivotCharts to connect to:" />
    <div style={{ position: "absolute", left: 12, top: 34, width: 396, height: 200, background: "#fff", border: `1px solid ${glow ?? "#7A7A7A"}`, boxShadow: glow ? `0 0 14px ${glow}` : undefined, boxSizing: "border-box", padding: "4px 0" }}>
      {names.map((n, i) => <div key={n} style={{ height: 30, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", background: checked[i] && glow ? "rgba(168,85,247,.10)" : "transparent", ...ui(13) }}><div style={{ width: 14, height: 14, border: `1px solid ${checked[i] && glow ? glow : "#555"}`, boxSizing: "border-box", background: "#fff", color: C.xGreen, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{checked[i] ? "✓" : ""}</div>{n}</div>)}
    </div>
    <DBtn x={228} y={252} w={86} label="OK" def press={ok} /><DBtn x={322} y={252} w={86} label="Cancel" />
  </Dialog>
);
export const InsertChartDialog: React.FC<{ x: number; y: number; t: number; pick: boolean; ok?: number; glow?: string }> = ({ x, y, t, pick, ok = 0, glow }) => {
  const cats = ["Recommended Charts", "All Charts", "Column", "Line", "Pie", "Bar", "Area", "X Y (Scatter)"];
  return (
    <Dialog x={x} y={y} w={600} h={400} title="Insert Chart" t={t}>
      <div style={{ position: "absolute", left: 12, top: 10, width: 180, height: 310, background: "#fff", border: "1px solid #A0A0A0", boxSizing: "border-box", padding: "2px 0" }}>
        {cats.map((c) => <div key={c} style={{ height: 26, display: "flex", alignItems: "center", padding: "0 10px", background: c === "Column" ? "#0078D7" : "transparent", ...ui(12.5, { color: c === "Column" ? "#fff" : C.ink }) }}>{c}</div>)}
      </div>
      <div style={{ position: "absolute", left: 204, top: 10, width: 384, height: 310, background: "#fff", border: "1px solid #A0A0A0", boxSizing: "border-box", padding: 12 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {["Clustered Column", "Stacked Column", "100% Stacked"].map((n, i) => (
            <div key={n} style={{ width: 82, height: 62, border: `2px solid ${i === 0 && pick ? (glow ?? "#0078D7") : "#C8C8C8"}`, boxShadow: i === 0 && pick && glow ? `0 0 14px ${glow}` : undefined, boxSizing: "border-box", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, padding: 6 }}>
              {[22, 38, 30, 44].map((hh, j) => <div key={j} style={{ width: 9, height: hh * (i === 2 ? 1.1 : 1), background: j % 2 ? "#ED7D31" : "#4472C4" }} />)}
            </div>
          ))}
        </div>
        <div style={ui(13, { fontWeight: 600 })}>{pick ? "Clustered Column" : "Column"}</div>
        <div style={{ marginTop: 8, height: 150, border: "1px solid #E1E1E1", background: "#FAFAFA", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 14, padding: 14 }}>
          {[60, 90, 75, 110, 85, 120].map((hh, j) => <div key={j} style={{ width: 28, height: hh, background: "#4472C4" }} />)}
        </div>
      </div>
      <DBtn x={400} y={340} w={90} label="OK" def press={ok} /><DBtn x={498} y={340} w={90} label="Cancel" />
    </Dialog>
  );
};

// ---------- Name Manager UI (shared by every named-formula lesson) ----------
export const NewNameDialog: React.FC<{ x: number; y: number; t: number; name: string; refers: Seg[]; ok?: number; hiName?: string; hiRefers?: string }> = ({ x, y, t, name, refers, ok = 0, hiName, hiRefers }) => (
  <Dialog x={x} y={y} w={460} h={300} title="New Name" t={t}>
    <Lbl x={14} y={16} text="Name:" /><Field x={100} y={12} w={330} value={name} hi={hiName} caret={!!hiName} />
    <Lbl x={14} y={52} text="Scope:" /><Field x={100} y={48} w={200} value="Workbook" dd />
    <Lbl x={14} y={90} text="Comment:" />
    <div style={{ position: "absolute", left: 100, top: 86, width: 330, height: 66, background: "#fff", border: "1px solid #7A7A7A", boxSizing: "border-box" }} />
    <Lbl x={14} y={172} text="Refers to:" />
    <div style={{ position: "absolute", left: 100, top: 168, width: 330, height: 26, background: "#fff", border: `1px solid ${hiRefers ?? "#7A7A7A"}`, boxShadow: hiRefers ? `0 0 12px ${hiRefers}` : undefined, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 6px", fontFamily: F.cell, fontSize: 13.5, whiteSpace: "pre", overflow: "hidden" }}>
      {refers.map((s, i) => <span key={i} style={{ color: s.c ?? C.ink, background: s.bg, fontWeight: s.b ? 700 : 400 }}>{s.t}</span>)}
    </div>
    <DBtn x={254} y={228} w={86} label="OK" def press={ok} /><DBtn x={348} y={228} w={86} label="Cancel" />
  </Dialog>
);
export const NameManager: React.FC<{ x: number; y: number; t: number; names: { name: string; refers: string; hi?: string }[]; newPress?: number; closePress?: number }> = ({ x, y, t, names, newPress = 0, closePress = 0 }) => (
  <Dialog x={x} y={y} w={680} h={372} title="Name Manager" t={t}>
    <DBtn x={12} y={10} w={80} label="New..." press={newPress} /><DBtn x={96} y={10} w={80} label="Edit..." /><DBtn x={180} y={10} w={80} label="Delete" /><DBtn x={576} y={10} w={92} label="Filter ▾" />
    <div style={{ position: "absolute", left: 12, top: 44, width: 656, height: 210, background: "#fff", border: "1px solid #A0A0A0", boxSizing: "border-box" }}>
      <div style={{ height: 24, background: "#F7F7F7", borderBottom: "1px solid #D0D0D0", position: "relative" }}>
        <Lbl x={8} y={4} text="Name" /><Lbl x={160} y={4} text="Value" /><Lbl x={260} y={4} text="Refers To" /><Lbl x={560} y={4} text="Scope" />
      </div>
      {names.map((n, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: 24 + i * 26, width: 654, height: 26, background: "#E5F1FB", border: n.hi ? `2px solid ${n.hi}` : undefined, boxShadow: n.hi ? `0 0 14px ${n.hi}` : undefined, boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 8, top: 5, ...ui(12.5, { fontWeight: 600 }) }}>{n.name}</div>
          <div style={{ position: "absolute", left: 260, top: 5, whiteSpace: "nowrap", ...ui(12, { fontFamily: F.cell, fontSize: 13 }) }}>{n.refers}</div>
          <div style={{ position: "absolute", left: 560, top: 5, ...ui(12.5) }}>Workbook</div>
        </div>
      ))}
    </div>
    <Lbl x={12} y={262} text="Refers to:" />
    <div style={{ position: "absolute", left: 12, top: 282, width: 656, height: 26, background: "#fff", border: "1px solid #A0A0A0", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 6px", fontFamily: F.cell, fontSize: 13.5 }}>{names[0]?.refers ?? ""}</div>
    <DBtn x={588} y={322} w={80} label="Close" press={closePress} />
  </Dialog>
);
