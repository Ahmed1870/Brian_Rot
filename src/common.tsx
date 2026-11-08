import React from "react";
import {C, X, M, GRID_Y, RIBBON_Y, MONO, FONT_AR} from "./theme";
import {Dialog, WinBtn, lin as _l} from "./kit";
import {CellSty, cellBox, colName, tabBox} from "./xl";
import {ROWS, HEAD, fmt, rowAt, Row} from "./data";

export const lin = _l;
export const ctr = (rows: number[], r: number, c: number) => {
  const b = cellBox(rows, r, c);
  return {x: M.x + b.x + b.w / 2, y: M.y + b.y + b.h / 2};
};
export const addr = (r: number, c: number) => `${colName(c)}${r}`;
export const tabCtr = (name: string) => {
  const b = tabBox(name);
  return {x: M.x + b.x + b.w / 2, y: M.y + M.titleH + M.tabsH / 2};
};
export const toStage = (p: {x: number; y: number}) => ({x: M.x + p.x, y: M.y + p.y});

/** plain / table body cell for the sample sales data (rows 2..20) */
export const baseCell = (r: number, c: number, big = false): CellSty | undefined => {
  if (r === 1) return c < 5 ? {text: HEAD[c], bold: true} : undefined;
  const d: Row | undefined = big ? (r >= 2 && r <= 50001 ? rowAt(r - 2) : undefined) : r >= 2 && r <= 20 ? ROWS[r - 2] : undefined;
  if (!d) return undefined;
  switch (c) {
    case 0: return {text: String(d.id), num: true};
    case 1: return {text: d.product};
    case 2: return {text: String(d.qty), num: true};
    case 3: return {text: fmt(d.price), num: true};
    case 4: return {text: d.region};
    default: return undefined;
  }
};

export const rawOf = (r: number, c: number): string => {
  const d = r >= 2 && r <= 20 ? ROWS[r - 2] : undefined;
  if (r === 1) return c < 5 ? HEAD[c] : "";
  if (!d) return "";
  return [String(d.id), d.product, String(d.qty), String(d.price), d.region][c] ?? "";
};

export const Cam: React.FC<{s: number; ox?: number; oy?: number; children?: React.ReactNode}> = ({s, ox = 280, oy = 180, children}) => (
  <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</div>
);

export const Ants: React.FC<{x: number; y: number; w: number; h: number; f: number}> = ({x, y, w, h, f}) => (
  <svg width={w + 8} height={h + 8} style={{position: "absolute", left: x - 4, top: y - 4, zIndex: 6, pointerEvents: "none"}}>
    <rect x={4} y={4} width={w} height={h} fill="none" stroke="#222" strokeWidth={2} strokeDasharray="6 5" strokeDashoffset={-f * 0.8} />
  </svg>
);

export const DLG = {x: 520, y: 230, w: 440, h: 224};
export const CreateTableDialog: React.FC<{f: number; a: number; b: number; range: string; checkAt: number; okHot: boolean}> = ({f, a, b, range, checkAt, okHot}) => {
  const pop = Math.max(0, Math.min(1, (f - checkAt) / 10));
  return (
    <Dialog f={f} a={a} b={b} x={DLG.x} y={DLG.y} w={DLG.w} h={DLG.h} title="Create Table">
      <div style={{position: "absolute", left: 18, top: 14, fontSize: 15, fontFamily: FONT_AR}}>Where is the data for your table?</div>
      <div style={{position: "absolute", left: 18, top: 44, width: 380, height: 28, border: "1px solid #7A7A7A", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: 15, fontFamily: FONT_AR}}><span>{range}</span><span style={{fontSize: 11, color: "#555"}}>▦</span></div>
      <div style={{position: "absolute", left: 18, top: 96, display: "flex", alignItems: "center", gap: 9, fontSize: 15, fontFamily: FONT_AR}}>
        <div style={{width: 17, height: 17, border: "1.5px solid #333", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center"}}><span style={{color: X.green, fontWeight: 800, fontSize: 15, lineHeight: "15px", transform: `scale(${0.4 + 0.6 * pop})`, opacity: f >= checkAt - 2 ? 1 : 0.0}}>✓</span></div>
        My table has headers
      </div>
      <div style={{position: "absolute", right: 18, bottom: 14, display: "flex", gap: 10}}><WinBtn label="OK" primary hot={okHot} /><WinBtn label="Cancel" /></div>
    </Dialog>
  );
};
export const CHECK_BOX = {x: DLG.x + 18, y: DLG.y + 34 + 96, w: 240, h: 24};

export const Mono: React.FC<{c?: string; s?: number; children?: React.ReactNode}> = ({c = C.text, s = 22, children}) => (
  <div style={{fontFamily: MONO, fontSize: s, color: c, lineHeight: 1.45, whiteSpace: "nowrap"}}>{children}</div>
);

export {GRID_Y, RIBBON_Y};
