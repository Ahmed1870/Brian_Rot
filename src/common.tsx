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
