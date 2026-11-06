import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { LOGO_PATHS } from "../logoData";
import { B, C, clamp, eio, prog, useT, win } from "../lib";

/* ───────────── Logo ───────────── */
export const Logo: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = C.blue,
  style,
}) => (
  <svg width={size} height={size} viewBox="158 155 284 284" style={style}>
    <g transform="translate(0,600) scale(0.1,-0.1)" fill={color} stroke="none">
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  </svg>
);

/* ───────────── Persistent background ─────────────
   Built from static CSS layers + two composited orbs (transform only) so Chromium never
   re-rasterises it — the previous animated SVG pattern cost ~1 s per frame. */
export const Background: React.FC = () => {
  const t = useT();
  const grid =
    "radial-gradient(circle, #1E3A5F 1.8px, transparent 2.6px), linear-gradient(#16233C 1px, transparent 1px), linear-gradient(90deg, #16233C 1px, transparent 1px)";
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: grid, backgroundSize: "60px 60px", backgroundPosition: "30px 30px, 0 0, 0 0", willChange: "transform" }} />
      <div
        style={{
          position: "absolute",
          left: -240,
          top: -360,
          width: 1240,
          height: 1240,
          background: "radial-gradient(circle, #38BDF829 0%, #38BDF800 68%)",
          transform: `translate3d(${Math.sin(t * 0.35) * 160}px, ${Math.cos(t * 0.27) * 90}px, 0)`,
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1000,
          top: 260,
          width: 1120,
          height: 1120,
          background: "radial-gradient(circle, #10B9811C 0%, #10B98100 68%)",
          transform: `translate3d(${Math.cos(t * 0.3) * 150}px, ${Math.sin(t * 0.33) * 100}px, 0)`,
          willChange: "transform",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #00000000 58%, #0000008C 100%)", willChange: "transform" }} />
    </AbsoluteFill>
  );
};

/* ───────────── Top brand bar (scenes 1-5) ───────────── */
export const TopBar: React.FC = () => {
  const t = useT();
  const o = Math.min(prog(t, 0.2, 1.0), 1 - prog(t, B[5] - 0.5, B[5] + 0.3));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 100, opacity: o }}>
      <div style={{ position: "absolute", left: 56, top: 18, display: "flex", alignItems: "center", gap: 14 }}>
        <Logo size={72} />
        <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 28, color: C.text, lineHeight: 1 }}>
          منظومة <span style={{ color: C.blue }}>|</span> SQL From Zero to Professional
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 56,
          top: 28,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 22,
          color: C.blue,
          border: `1.5px solid ${C.blue}66`,
          padding: "8px 18px",
          borderRadius: 999,
          background: "#0B1B33",
        }}
      >
        LESSON 35 · SUBQUERIES &amp; CTEs
      </div>
    </div>
  );
};

/* ───────────── Scene shell with transitions ───────────── */
const KINDS = ["zoom", "left", "up", "expand", "down"] as const;

const xf = (kind: string, x: number, dir: 1 | -1): string => {
  // x: 0 = fully in place, 1 = fully away. dir: 1 = entering, -1 = exiting
  switch (kind) {
    case "zoom":
      return dir === 1 ? `scale(${1 - 0.1 * x})` : `scale(${1 + 0.14 * x})`;
    case "left":
      return `translateX(${dir === 1 ? 240 * x : -240 * x}px)`;
    case "up":
      return `translateY(${dir === 1 ? 170 * x : -170 * x}px)`;
    case "expand":
      return dir === 1 ? `scale(${1 - 0.12 * x})` : `scale(${1 + 0.06 * x})`;
    default:
      return `translateY(${dir === 1 ? -120 * x : 120 * x}px)`;
  }
};

export const Shell: React.FC<{ idx: number; children: React.ReactNode }> = ({ idx, children }) => {
  const t = useT();
  const s = B[idx];
  const e = B[idx + 1];
  if (t < s - 0.75 || t > e + 0.75) return null;
  const inX = idx === 0 ? 0 : 1 - eio(t, s - 0.6, s + 0.6);
  const outX = idx === 5 ? 0 : eio(t, e - 0.6, e + 0.6);
  const inKind = idx > 0 ? KINDS[idx - 1] : "zoom";
  const outKind = idx < 5 ? KINDS[idx] : "zoom";
  const op = (1 - inX) * (1 - outX);
  return (
    <AbsoluteFill
      style={{
        opacity: op,
        transform: `${inX > 0 ? xf(inKind, inX, 1) : ""} ${outX > 0 ? xf(outKind, outX, -1) : ""}`.trim() || undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ───────────── Syntax highlighting ───────────── */
const TOKEN =
  /(--.*$)|\b(GROUP BY|ORDER BY|SELECT|FROM|WHERE|HAVING|LIMIT|AS|DESC|ASC|AND|OR|CASE|WHEN|THEN|ELSE|END)\b|\b(SUM|AVG|COUNT|EXTRACT|YEAR)\b|(\b\d[\d_]*\b)/g;

export const tokenize = (line: string): { text: string; color: string; bold?: boolean }[] => {
  const out: { text: string; color: string; bold?: boolean }[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ text: line.slice(last, i), color: C.text });
    if (m[1]) out.push({ text: m[0], color: "#64748B" });
    else if (m[2]) out.push({ text: m[0], color: C.blue, bold: true });
    else if (m[3]) out.push({ text: m[0], color: C.violet });
    else out.push({ text: m[0], color: C.amber });
    last = i + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), color: C.text });
  return out;
};

export const CodeLine: React.FC<{ text: string; caret?: boolean; fs?: number; override?: string }> = ({
  text,
  caret,
  fs = 26,
  override,
}) => {
  const t = useT();
  const blink = Math.floor(t * 2.4) % 2 === 0;
  return (
    <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: fs, whiteSpace: "pre", direction: "ltr", textAlign: "left", height: fs * 1.55 }}>
      {tokenize(text).map((k, i) => (
        <span key={i} style={{ color: override ?? k.color, fontWeight: k.bold ? 700 : 500 }}>
          {k.text}
        </span>
      ))}
      {caret && <span style={{ display: "inline-block", width: fs * 0.55, height: fs * 1.05, marginLeft: 2, verticalAlign: "text-bottom", background: blink ? C.blue : "transparent" }} />}
    </div>
  );
};

export const Window: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  color?: string;
  glow?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, title, color = C.blue, glow = 0, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: "#0B1222",
      border: `2px solid ${glow > 0 ? color : C.line}`,
      borderRadius: 22,
      boxShadow: glow > 0 ? `0 0 ${Math.min(20, 40 * glow)}px ${color}55` : "none",
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ height: 52, background: "#111B30", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 10 }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: "#EF4444" }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: "#F59E0B" }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: "#10B981" }} />
      <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 19, color: C.dim }}>{title}</span>
    </div>
    <div style={{ position: "relative", width: "100%", height: h - 52 }}>{children}</div>
  </div>
);

/* ───────────── Bottom caption banner ───────────── */
export const Banner: React.FC<{
  x: number;
  y: number;
  w: number;
  a: number;
  b: number;
  color: string;
  children: React.ReactNode;
  fs?: number;
  align?: "left" | "center";
}> = ({ x, y, w, a, b, color, children, fs = 28, align = "center" }) => {
  const t = useT();
  const o = win(t, a, b, 0.5);
  if (o <= 0) return null;
  const rise = (1 - prog(t, a, a + 0.6)) * 26;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + rise,
        width: w,
        opacity: o,
        padding: "16px 28px",
        borderRadius: 18,
        background: `${color}14`,
        border: `2px solid ${color}88`,
        boxShadow: `0 0 20px ${color}30`,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: fs,
        color: C.text,
        textAlign: align,
        direction: "ltr",
        whiteSpace: "pre",
      }}
    >
      {children}
    </div>
  );
};

export const Arabic: React.FC<{ x: number; y: number; w: number; fs?: number; color?: string; o?: number; weight?: number; align?: "right" | "left" | "center"; children: React.ReactNode }> = ({
  x,
  y,
  w,
  fs = 34,
  color = C.text,
  o = 1,
  weight = 700,
  align = "right",
  children,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, direction: "rtl", textAlign: align, fontFamily: AR, fontWeight: weight, fontSize: fs, color, lineHeight: 1.35 }}>{children}</div>
);

export const clampPx = clamp;
