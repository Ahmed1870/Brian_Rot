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
