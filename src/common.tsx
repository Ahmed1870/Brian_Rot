import React from "react";
import {C, M, MONO} from "./theme";
import {cellBox, tabBox} from "./xl";

export const ctr = (rows: number[], r: number, c: number) => {
  const b = cellBox(rows, r, c);
  return {x: M.x + b.x + b.w / 2, y: M.y + b.y + b.h / 2};
};
export const tabCtr = (name: string) => {
  const b = tabBox(name);
  return {x: M.x + b.x + b.w / 2, y: M.y + M.titleH + M.tabsH / 2};
};
export const toStage = (p: {x: number; y: number}) => ({x: M.x + p.x, y: M.y + p.y});
export const Mono: React.FC<{c?: string; s?: number; children?: React.ReactNode}> = ({c = C.text, s = 22, children}) => (
  <div style={{fontFamily: MONO, fontSize: s, color: c, lineHeight: 1.45, whiteSpace: "nowrap"}}>{children}</div>
);
/** coloured formula: [text, colour][] */
export const Colored: React.FC<{parts: [string, string][]; s?: number}> = ({parts, s = 34}) => (
  <div style={{fontFamily: MONO, fontSize: s, fontWeight: 700, whiteSpace: "nowrap"}}>{parts.map(([t, c], i) => <span key={i} style={{color: c}}>{t}</span>)}</div>
);
/** eased keyframe value */
export const keyv = (f: number, keys: [number, number][]) => {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f0, v0] = keys[i - 1];
    const [f1, v1] = keys[i];
    if (f >= f1) v = v1;
    else if (f > f0) { const t = (f - f0) / (f1 - f0); const e = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t); v = v0 + (v1 - v0) * e; break; }
    else break;
  }
  return v;
};

export type CalCell = {bg?: string; fg?: string; text?: string; ring?: string; strike?: boolean};
const MN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** mini calendar (Sunday first). Fri+Sat shaded (weekend code 7). */
export const MiniCal: React.FC<{year: number; month: number; w: number; cell: (day: number) => CalCell | undefined}> = ({year, month, w, cell}) => {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cw = w / 7, rh = cw * 0.78;
  const names = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const els: React.ReactNode[] = [];
  for (let d = 1; d <= count; d++) {
    const i = d + first - 1, col = i % 7, row = Math.floor(i / 7);
    const c = cell(d);
    els.push(
      <div key={d} style={{position: "absolute", left: col * cw + 3, top: 62 + row * rh + 2, width: cw - 6, height: rh - 4, borderRadius: 8, background: c?.bg ?? (col >= 5 ? "rgba(148,163,184,.14)" : "rgba(148,163,184,.05)"), border: c?.ring ? `2.5px solid ${c.ring}` : "1px solid rgba(148,163,184,.12)", boxShadow: c?.ring ? `0 0 14px ${c.ring}` : "none", color: c?.fg ?? "#CBD5E1", fontFamily: MONO, fontSize: cw * 0.36, fontWeight: 700, textAlign: "center", lineHeight: `${rh - 8}px`, textDecoration: c?.strike ? "line-through" : "none", boxSizing: "border-box"}}>{c?.text ?? d}</div>
    );
  }
  return (
    <div style={{position: "relative", width: w, height: 62 + 6 * rh}}>
      <div style={{position: "absolute", left: 0, top: 0, width: w, textAlign: "center", fontFamily: MONO, fontSize: 24, fontWeight: 700, color: "#F8FAFC"}}>{MN[month - 1]} {year}</div>
      {names.map((n, i) => <div key={n} style={{position: "absolute", left: i * cw, top: 38, width: cw, textAlign: "center", fontFamily: MONO, fontSize: 16, color: i >= 5 ? "#94A3B8" : "#64748B"}}>{n}</div>)}
      {els}
    </div>
  );
};
