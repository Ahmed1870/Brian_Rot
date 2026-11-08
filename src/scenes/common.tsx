import type {ReactNode} from "react";
import {CLAUSES, SCENE_START} from "../anchors";
import {M, C, F} from "../theme";
import {Camera, Strip, clamp, pos, prog, rgba} from "../kit";

/** local frame of clause k of scene i (t = sec(g - S) in the plan) */
export const anchor = (i: number, k: number) => CLAUSES[i][k] - SCENE_START[i];
/** 0→1→0 window between local frames a and b */
export const win = (f: number, a: number, b: number, d = 10) => Math.min(prog(f, a, d), 1 - prog(f, b - d, d));
/** Camera + Strip shell: window area 1920x984, caption strip below. */
export const Stage = ({z = 1, fx = 0, fy = 0, strip, children}: {z?: number; fx?: number; fy?: number; strip?: ReactNode; children: ReactNode}) => (
  <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: C.slate}}>
    <div style={pos(0, 0, 1920, M.H * M.S, {overflow: "hidden"})}>
      <Camera z={z} fx={fx} fy={fy}>{children}</Camera>
    </div>
    <Strip>{strip}</Strip>
  </div>
);
/** small neon chip in native coordinates */
export const Chip = ({x, y, w, h = 26, color, k = 1, children, size = 14}: {x: number; y: number; w: number; h?: number; color: string; k?: number; children: ReactNode; size?: number}) => (
  <div style={pos(x, y + (1 - k) * 6, w, h, {display: "flex", alignItems: "center", justifyContent: "center", background: C.slate, border: `1.5px solid ${color}`, borderRadius: 6, color, fontWeight: 700, fontSize: size, opacity: k, boxShadow: `0 0 12px ${rgba(color, 0.5)}`, boxSizing: "border-box", whiteSpace: "nowrap", fontFamily: F.ui})}>{children}</div>
);
export const zoomAt = (f: number, a: number, b: number, from: number, to: number) => from + (to - from) * (1 - Math.pow(1 - clamp((f - a) / (b - a)), 3));

export type Tok = {t: string; c?: string};
export const tlen = (k: Tok[]) => k.reduce((s, x) => s + x.t.length, 0);
export const Fx = ({toks, n, base}: {toks: Tok[]; n: number; base?: string}) => {
  let left = n;
  return <span>{toks.map((k, i) => { const s = k.t.slice(0, Math.max(0, left)); left -= k.t.length; return s ? <span key={i} style={{color: k.c ?? base ?? C.txt}}>{s}</span> : null; })}</span>;
};
export const nTyped = (f: number, s: number, e: number, total: number) => Math.round(total * clamp((f - s) / (e - s)));
export const Enter = ({x, y, k}: {x: number; y: number; k: number}) => (k > 0 ? <div style={{position: "absolute", left: x, top: y - (1 - k) * 6, opacity: k, padding: "3px 10px", borderRadius: 6, background: C.slate, color: "#fff", border: `1.5px solid ${C.blue}`, borderBottom: `4px solid ${C.blue}`, fontFamily: F.mono, fontWeight: 700, fontSize: 13}}>Enter ↵</div> : null);
export const FC = {g: "#0B8A4B", a: "#B7791F", b: "#0B6FA8", c: "#0891B2", p: "#7E22CE"};
