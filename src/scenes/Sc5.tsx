import {useCurrentFrame} from "remotion";
import type {ReactNode} from "react";
import {Callout, Cap, Cursor, ExcelApp, FormatCellsDialog, Glow, KeyCaps, Sheet, Tag, cellRect, clamp, eo, prog, rgba, typed} from "../kit";
import {C, F, M} from "../theme";
import {Chip, Stage, anchor, win} from "./common";

const a = (k: number) => anchor(4, k);
const W = [100, 100, 100, 100];
const BR = ["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta", "Aswan"];
const N = 50000;
const rev = (i: number) => 4000000 + ((i * 7919301) % 11000000);
const cost = (i: number) => Math.round(rev(i) * (0.72 + ((i * 37) % 40) / 100));
let sB = 0, sC = 0;
for (let i = 1; i <= N; i++) { sB += rev(i); sC += cost(i); }
const sD = sB - sC;
const ROWS = 18;
const m1 = (v: number) => (Math.round(Math.abs(v) / 100000) / 10).toFixed(1);
const fMil = (v: number) => `$${m1(v)}M`;
const fArr = (v: number) => (v > 0 ? `▲ $${m1(v)}M` : v < 0 ? `▼ ($${m1(v)}M)` : "-");
const CODE1 = '$#,##0.0,,"M"';
const CODE2 = '[Color10]▲ $#,##0.0,,"M";[Red]▼ ($#,##0.0,,"M");"-";@';
const ZC = [C.emerald, C.red, C.amber, C.blue];
const codeNode = (s: string): ReactNode => {
  let z = 0;
  return s.split("").map((ch, i) => {
    if (ch === ";") { z++; return <span key={i} style={{color: C.yellow, fontWeight: 700}}>;</span>; }
    return <span key={i} style={{color: ZC[Math.min(z, 3)]}}>{ch}</span>;
  });
};
const build = (bc: number, d: number) => {
  // bc: 0..1 progress of millions format on B:C ; d: 0..1 progress of arrow format on D (per-row waves)
  const cells: {r: number; c: number; t: ReactNode; a?: "l" | "r" | "c"; color?: string; bold?: boolean; bg?: string}[] = [
    {r: 1, c: 1, t: "Branch", bold: true}, {r: 1, c: 2, t: "Revenue", bold: true, a: "c"}, {r: 1, c: 3, t: "Costs", bold: true, a: "c"}, {r: 1, c: 4, t: "Profit", bold: true, a: "c"},
  ];
  for (let i = 1; i <= ROWS; i++) {
    const r = i + 1;
    const R = rev(i), K = cost(i), P = R - K;
    const wb = clamp(bc * (ROWS + 6) - i);
    const wd = clamp(d * (ROWS + 6) - i);
    cells.push({r, c: 1, t: BR[i % 6]});
    cells.push({r, c: 2, t: wb > 0.5 ? fMil(R) : String(R), a: "r", bg: wb > 0 && wb < 1 ? rgba(C.emerald, 0.35 * Math.sin(Math.PI * wb)) : undefined});
    cells.push({r, c: 3, t: wb > 0.5 ? fMil(K) : String(K), a: "r", bg: wb > 0 && wb < 1 ? rgba(C.emerald, 0.35 * Math.sin(Math.PI * wb)) : undefined});
    cells.push({r, c: 4, t: wd > 0.5 ? fArr(P) : String(P), a: "r", color: wd > 0.5 ? (P > 0 ? "#008000" : P < 0 ? "#FF0000" : C.txt) : C.txt, bg: wd > 0 && wd < 1 ? rgba(P < 0 ? C.red : C.emerald, 0.35 * Math.sin(Math.PI * wd)) : undefined});
  }
  return cells;
};
const groupNum = (n: number) => String(Math.round(n));

export const Sc5 = () => {
  const f = useCurrentFrame();
  const open1 = a(2) + 85, ok1 = a(3) + 100, open2 = a(4) + 20, ok2 = a(4) + 105;
  const bc = clamp((f - ok1) / 40);
  const d = clamp((f - ok2) / 40);
  const split = a(5);
    const phase = f < ok1 ? 0 : f < ok2 ? 1 : 2;
  const selCols = f >= a(2) && f < ok1 ? {r1: 1, c1: 2, r2: 1, c2: 3, whole: "col" as const} : f >= a(4) && f < ok2 ? {r1: 1, c1: 4, r2: 1, c2: 4, whole: "col" as const} : undefined;
  const status = f >= a(2) + 30 && f < ok1 ? {avg: ((sB + sC) / (2 * N + 2)).toFixed(3), count: String(2 * N + 2), sum: String(sB + sC)} : f >= a(4) + 10 && f < ok2 ? {avg: (sD / N).toFixed(3), count: String(N + 1), sum: String(sD)} : undefined;
  const dK1 = eo(prog(f, open1, 12)) * (1 - eo(prog(f, ok1, 8)));
  const dK2 = eo(prog(f, open2, 12)) * (1 - eo(prog(f, ok2, 8)));
  const hB = cellRect(2, 1, W), hC = cellRect(3, 1, W), hD = cellRect(4, 1, W);
  const sealK = eo(prog(f, split + 60, 24));
  const common = {file: "manzooma_financials_2026.xlsx", sheets: ["Financials"]};
  const app = (cells: ReturnType<typeof build>, withOverlays: boolean, label?: string) => (
    <ExcelApp {...common} name={withOverlays && selCols ? (selCols.c1 === 2 ? "B:C" : "D:D") : "A1"} numFmt={phase === 0 || !withOverlays ? "General" : "Custom"} fx={withOverlays && selCols ? "" : "Branch"} status={withOverlays ? status : undefined}
      sheet={{cells, widths: W, sel: withOverlays ? selCols : undefined, active: {r: 1, c: 1}}}>
      {label ? <div style={{position: "absolute", left: 0, top: 0}} /> : null}
    </ExcelApp>
  );
  return (
    <Stage strip={[
      <Cap key="0" f={f} a={a(0)} b={a(6)}><Tag label="Enterprise Financials" color={C.emerald} parts={[{t: "Transforming Raw Data to Executive Financial Views"}]} /></Cap>,
      <Cap key="1" f={f} a={a(6)} b={9999}><Tag label="Precision & Clarity" color={C.emerald} parts={[{t: "Zero Formula Distortion with Custom Formats"}]} /></Cap>,
    ]}>
      <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H}}>
        {app(build(bc, d), true)}
        {f < split ? (
          <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H, pointerEvents: "none"}}>
            {f >= a(0) && f < a(1) ? <Chip x={520} y={232} w={470} h={28} color={C.emerald} k={win(f, a(0), a(1))} size={15}>manzooma_financials_2026.xlsx · 50,000 rows</Chip> : null}
            {f >= a(1) && f < a(2) ? <Callout x={620} y={300} w={330} tx={hB.x + 60} ty={hB.y + 150} color={C.red} k={win(f, a(1), a(2))} size={15}>Long raw numbers — cluttered</Callout> : null}
            <Cursor keys={[{f: a(2) - 20, x: 700, y: 420}, {f: a(2) + 6, x: hB.x + 40, y: hB.y - 16, click: true}, {f: a(2) + 30, x: hC.x + 40, y: hC.y - 16, click: true}, {f: open1 - 40, x: 760, y: 440}, {f: ok1 - 16, x: 700, y: 430}, {f: ok1 - 4, x: 395, y: 590, click: true}, {f: a(4), x: 700, y: 420}, {f: a(4) + 12, x: hD.x + 40, y: hD.y - 16, click: true}, {f: ok2 - 16, x: 700, y: 430}, {f: ok2 - 4, x: 395, y: 590, click: true}, {f: split, x: 900, y: 300}]} />
            {f >= a(2) + 55 && f < a(2) + 115 ? <KeyCaps x={620} y={290} keys={["Ctrl", "1"]} k={win(f, a(2) + 55, a(2) + 115)} /> : null}
            {dK1 > 0 ? <FormatCellsDialog x={70} y={196} k={dK1} cat="Custom" type={<span style={{color: C.emerald}}>{typed(CODE1, f, a(3), 5)}</span>} sample={typed(CODE1, f, a(3), 5).length >= CODE1.length ? fMil(rev(1)) : String(rev(1))} typeGlow={C.emerald} okHot={f >= ok1 - 6 ? 1 : 0} /> : null}
            {dK2 > 0 ? <FormatCellsDialog x={70} y={196} k={dK2} cat="Custom" type={codeNode(typed(CODE2, f, open2 + 12, 38))} sample={typed(CODE2, f, open2 + 12, 38).length > 30 ? <span style={{color: "#FF0000"}}>{fArr(-1000000)}</span> : String(rev(1) - cost(1))} typeGlow={C.yellow} okHot={f >= ok2 - 6 ? 1 : 0} /> : null}
            {f >= a(3) + 100 && f < a(4) ? <Glow x={hB.x} y={hB.y} w={hC.x + hC.w - hB.x - 1} h={ROWS * 20} color={C.emerald} k={win(f, a(3) + 100, a(4))} fill={0.05} /> : null}
          </div>
        ) : null}
      </div>
      {f >= split ? (
        <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H, pointerEvents: "none"}}>
          <div style={{position: "absolute", left: 0, top: 0, width: M.W, height: M.H, background: rgba(C.slate, 0.72 * eo(prog(f, split, 16)))}} />
          {[0, 1].map((p) => {
            const k = eo(prog(f, split + 6 + p * 8, 22));
            const x = p === 0 ? 24 : 474;
            return (
              <div key={p} style={{position: "absolute", left: x + (p === 0 ? -1 : 1) * (1 - k) * 80, top: 196, width: 440, opacity: k}}>
                <Chip x={0} y={0} w={440} h={32} color={p === 0 ? C.red : C.emerald} size={17}>{p === 0 ? "BEFORE · raw numbers" : "AFTER · executive view"}</Chip>
                <div style={{position: "absolute", left: 0, top: 40, width: 440, height: 292, overflow: "hidden", border: `2px solid ${p === 0 ? C.red : C.emerald}`, borderRadius: 8, boxShadow: `0 0 18px ${rgba(p === 0 ? C.red : C.emerald, 0.45)}`, boxSizing: "border-box", background: "#fff"}}>
                  <div style={{position: "absolute", left: 0, top: -M.hdrTop, width: M.W, height: M.H}}>
                    <Sheet cells={build(p, p)} widths={W} />
                  </div>
                </div>
              </div>
            );
          })}
          {sealK > 0 ? (
            <div style={{position: "absolute", left: 930, top: 250, width: 330, height: 190, opacity: sealK, transform: `scale(${0.8 + 0.2 * sealK})`, transformOrigin: "50% 50%", background: C.slate, border: `3px solid ${C.emerald}`, borderRadius: 18, boxShadow: `0 0 ${30 * sealK}px ${rgba(C.emerald, 0.6)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, boxSizing: "border-box", fontFamily: F.ui}}>
              <svg width="72" height="72" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill={rgba(C.emerald, 0.2)} stroke={C.emerald} strokeWidth="5" /><path d="M24 43 L37 56 L61 28" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div><div style={{color: C.emerald, fontWeight: 700, fontSize: 24}}>Enterprise Format</div><div style={{color: C.ink, fontSize: 16, marginTop: 6}}>Same numbers.<br />Clear view.</div></div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
};
void groupNum;
