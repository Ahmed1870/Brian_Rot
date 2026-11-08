import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from "remotion";
import {C, FONT_AR, FONT_MONO, MONO, LOGO_FILE, W, H} from "./theme";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const lin = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
export const prog = (f: number, a: number, b: number) => EASE(lin(f, a, b));
/** visibility window: fades in at a, out at b */
export const vis = (f: number, a: number, b: number, d = 10) => Math.min(lin(f, a, a + d), 1 - lin(f, b - d, b));
export const typed = (s: string, f: number, start: number, cps = 0.6) =>
  s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - start) * cps))));

export type Pt = {f: number; x: number; y: number};
export const pathAt = (f: number, pts: Pt[]) => {
  const fs = pts.map((p) => p.f);
  const o = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic)};
  return {x: interpolate(f, fs, pts.map((p) => p.x), o), y: interpolate(f, fs, pts.map((p) => p.y), o)};
};

export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(1300px 760px at 28% 18%, #17233D 0%, ${C.bg} 62%, #0A0F1D 100%)`}}>
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: 0.55}}>
      <defs>
        <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#1E293B" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#dots)" />
    </svg>
    <Img src={staticFile(LOGO_FILE)} style={{position: "absolute", left: 40, top: 2, width: 90, height: 90}} />
  </AbsoluteFill>
);

/** scene wrapper: fade or slide in/out */
export const Move: React.FC<{
  f: number;
  len: number;
  inD?: "x" | "y" | "none" | "cut";
  outD?: "x" | "y" | "none" | "cut";
  n?: number;
  children?: React.ReactNode;
}> = ({f, len, inD = "none", outD = "none", n = 14, children}) => {
  const i = 1 - prog(f, 0, n);
  const o = prog(f, len - n, len);
  const dx = (inD === "x" ? i * 140 : 0) - (outD === "x" ? o * 140 : 0);
  const dy = (inD === "y" ? i * 90 : 0) - (outD === "y" ? o * 90 : 0);
  const op = (inD === "cut" ? 1 : 1 - i) * (outD === "cut" ? 1 : 1 - o);
  return <AbsoluteFill style={{opacity: op, transform: `translate(${dx}px, ${dy}px)`}}>{children}</AbsoluteFill>;
};

export const TopBadge: React.FC<{f: number; a: number; b: number; ar: string; en: string}> = ({f, a, b, ar, en}) => {
  const o = vis(f, a, b, 14);
  if (o <= 0) return null;
  return (
    <div style={{position: "absolute", top: 20, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${(1 - o) * -14}px)`}}>
      <div style={{display: "flex", alignItems: "center", gap: 16, padding: "10px 30px", borderRadius: 999, background: "rgba(30,41,59,.94)", border: `1.5px solid ${C.green}`, boxShadow: `0 0 26px ${C.green}55`, fontSize: 27, fontWeight: 700, color: C.text, direction: "rtl", fontFamily: FONT_AR}}>
        <span>{ar}</span>
        <span style={{color: C.green}}>|</span>
        <bdi dir="ltr" style={{color: "#A7F3D0"}}>{en}</bdi>
      </div>
    </div>
  );
};

/** bottom tag: "left ──► right" */
export const Tag: React.FC<{f: number; a: number; b: number; color: string; text: string}> = ({f, a, b, color, text}) => {
  const o = vis(f, a, b, 14);
  if (o <= 0) return null;
  const parts = text.split("──►");
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: 22, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${(1 - o) * 18}px)`}}>
      <div style={{display: "flex", alignItems: "center", gap: 14, padding: "12px 28px 12px 0", borderRadius: 12, background: "rgba(15,23,42,.96)", border: `1.5px solid ${color}88`, boxShadow: `0 0 28px ${color}44`, fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.text, overflow: "hidden", whiteSpace: "nowrap"}}>
        <div style={{width: 8, alignSelf: "stretch", background: color, marginRight: 8}} />
        <span style={{color: "#CBD5E1"}}>{parts[0].trim()}</span>
        {parts.length > 1 ? <span style={{color}}>{"──►"}</span> : null}
        {parts.length > 1 ? <span>{parts[1].trim()}</span> : null}
      </div>
    </div>
  );
};

export const Card: React.FC<{f: number; a: number; b: number; x: number; y: number; w: number; color: string; title?: string; children?: React.ReactNode}> = ({f, a, b, x, y, w, color, title, children}) => {
  const o = vis(f, a, b, 14);
  if (o <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, opacity: o, transform: `translateY(${(1 - o) * 16}px) scale(${0.96 + 0.04 * o})`, background: "rgba(15,23,42,.95)", border: `2px solid ${color}`, borderRadius: 16, padding: "16px 22px", boxShadow: `0 0 30px ${color}55, 0 18px 40px rgba(0,0,0,.45)`, color: C.text, fontFamily: FONT_AR}}>
      {title ? <div style={{fontSize: 22, fontWeight: 700, color, marginBottom: 8, fontFamily: MONO}}>{title}</div> : null}
      {children}
    </div>
  );
};

export const Neon: React.FC<{f: number; a: number; b: number; x: number; y: number; w: number; h: number; color: string; r?: number}> = ({f, a, b, x, y, w, h, color, r = 6}) => {
  const o = vis(f, a, b, 10);
  if (o <= 0) return null;
  const p = 0.7 + 0.3 * Math.sin(f / 6);
  return <div style={{position: "absolute", left: x - 3, top: y - 3, width: w + 6, height: h + 6, borderRadius: r, border: `2.5px solid ${color}`, opacity: o, boxShadow: `0 0 ${16 * p}px ${color}, 0 0 ${38 * p}px ${color}88, inset 0 0 ${10 * p}px ${color}55`, pointerEvents: "none"}} />;
};

export const Keys: React.FC<{f: number; a: number; b: number; keys: string[]; press: number; x?: number; y?: number}> = ({f, a, b, keys, press, x = 1470, y = 842}) => {
  const o = vis(f, a, b, 10);
  if (o <= 0) return null;
  const down = f >= press && f < press + 14;
  return (
    <div style={{position: "absolute", left: x, top: y, display: "flex", gap: 10, alignItems: "center", opacity: o, transform: `translateY(${(1 - o) * 12}px)`}}>
      {keys.map((k, i) => (
        <div key={k + i} style={{display: "flex", alignItems: "center", gap: 10}}>
          <div style={{minWidth: 62, height: 52, padding: "0 16px", borderRadius: 10, background: down ? "#064E3B" : "#1E293B", border: `2px solid ${down ? C.green : C.line}`, boxShadow: down ? `0 0 22px ${C.green}, inset 0 -2px 0 #022C22` : "0 6px 0 #0B1220", transform: `translateY(${down ? 5 : 0}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.text}}>{k}</div>
          {i < keys.length - 1 ? <span style={{color: C.mute, fontSize: 24, fontFamily: MONO}}>+</span> : null}
        </div>
      ))}
    </div>
  );
};

export const Cursor: React.FC<{x: number; y: number; o?: number}> = ({x, y, o = 1}) => (
  <svg width="30" height="36" viewBox="0 0 30 36" style={{position: "absolute", left: x - 3, top: y - 2, opacity: o, filter: "drop-shadow(0 3px 4px rgba(0,0,0,.5))", pointerEvents: "none"}}>
    <path d="M3 2 L3 27 L9.5 21 L14 31 L18.5 29 L14 19.5 L23 19.5 Z" fill="#fff" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const Click: React.FC<{f: number; at: number; x: number; y: number}> = ({f, at, x, y}) => {
  const t = lin(f, at, at + 16);
  if (t <= 0 || t >= 1) return null;
  return <div style={{position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 44, border: `3px solid ${C.blue}`, opacity: 1 - t, transform: `scale(${0.4 + t})`, pointerEvents: "none"}} />;
};

export const WinBtn: React.FC<{label: string; primary?: boolean; hot?: boolean}> = ({label, primary, hot}) => (
  <div style={{minWidth: 84, height: 30, padding: "0 14px", borderRadius: 4, border: `${primary ? 2 : 1}px solid ${primary ? "#0F6CBD" : "#8A8A8A"}`, background: hot ? "#CFE4F7" : "#FDFDFD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#1B1B1B", fontFamily: FONT_AR}}>{label}</div>
);

export const Dialog: React.FC<{f: number; a: number; b: number; x: number; y: number; w: number; h: number; title: string; children?: React.ReactNode}> = ({f, a, b, x, y, w, h, title, children}) => {
  const o = vis(f, a, b, 8);
  if (o <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${0.93 + 0.07 * o})`, background: "#F0F0F0", border: "1px solid #6B6B6B", boxShadow: "0 22px 60px rgba(0,0,0,.55)", fontFamily: FONT_AR, color: "#1B1B1B"}}>
      <div style={{height: 34, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 0 12px", fontSize: 15}}>
        <span>{title}</span>
        <div style={{display: "flex"}}>
          <div style={{width: 40, textAlign: "center", fontSize: 15}}>?</div>
          <div style={{width: 46, textAlign: "center", fontSize: 17, lineHeight: "34px"}}>✕</div>
        </div>
      </div>
      <div style={{position: "relative", padding: 18, height: h - 34}}>{children}</div>
    </div>
  );
};
export {FONT_MONO};
