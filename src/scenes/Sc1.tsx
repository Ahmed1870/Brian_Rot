import {useCurrentFrame} from "remotion";
import {Callout, Cap, Cursor, ExcelApp, Glow, Tag, TopBadge, XRay, cellRect, clamp, eo, prog} from "../kit";
import {C, F, M} from "../theme";
import {Chip, Stage, anchor, win, zoomAt} from "./common";

const W = [112, 112, 112, 112];
const a = (k: number) => anchor(0, k);
const COL = [C.blue, C.emerald, C.purple, C.amber];
const LAB = ["Text", "Number", "Date", "Boolean"];
const CAP = ["Left", "Right", "Right", "Center"];

export const Sc1 = () => {
  const f = useCurrentFrame();
  const t0 = [a(5), a(6), a(7), a(8)];
  const shown = t0.map((s) => f >= s);
  const idx = f < t0[1] ? 0 : f < t0[2] ? 1 : f < t0[3] ? 2 : 3;
  const xr = clamp((f - a(13)) / 54);
  const flipped = f >= a(13) + 27;
  const maskT = f >= a(14) ? Math.floor((f - a(14)) / 50) % 2 : -1; // 0 = what you see, 1 = what Excel stores
  const c1Serial = flipped && maskT !== 0;
  const active = f >= a(13) ? {r: 1, c: 3} : {r: 1, c: idx + 1};
  const fxTxt = shown[active.c - 1] ? ["Sales", "5000", c1Serial ? "46023" : "1/1/2026", "TRUE"][active.c - 1] : "";
  const numFmt = active.c === 3 && !c1Serial ? "Date" : "General";
  const cells = [
    ...(shown[0] ? [{r: 1, c: 1, t: "Sales", a: "l" as const}] : []),
    ...(shown[1] ? [{r: 1, c: 2, t: "5000", a: "r" as const}] : []),
    ...(shown[2] ? [{r: 1, c: 3, t: c1Serial ? "46023" : "1/1/2026", a: "r" as const, color: c1Serial ? C.purple : C.txt, bold: c1Serial}] : []),
    ...(shown[3] ? [{r: 1, c: 4, t: "TRUE", a: "c" as const}] : []),
  ];
  const z = zoomAt(f, a(4) - 30, a(4) + 40, 1, 1.45);
  const R = (c: number) => cellRect(c, 1, W);
  const tour = [
    {a: 0, b: a(2), x: 0, y: M.ribTop, w: M.W, h: M.ribH, l: "Ribbon", lx: 420, ly: 330},
    {a: a(2), b: a(3), x: 0, y: M.fbTop, w: M.W, h: M.fbH, l: "Formula Bar", lx: 420, ly: 330},
    {a: a(3), b: a(4) + 10, x: 0, y: M.hdrTop, w: M.W, h: 300, l: "Worksheet Grid", lx: 420, ly: 340},
  ];
  return (
    <Stage z={z} fx={260} fy={230}
      strip={[
        <Cap key="a" f={f} a={a(0)} b={a(4) + 60}><TopBadge ar="أنواع البيانات والتنسيقات الرقمية" en="Data Types & Number Formats" /></Cap>,
        <Cap key="b" f={f} a={a(4) + 60} b={a(9)}><Tag label="Data Types" color={C.blue} parts={[{t: "Text", c: C.blue}, {t: " | "}, {t: "Number", c: C.emerald}, {t: " | "}, {t: "Date", c: C.purple}, {t: " | "}, {t: "Boolean", c: C.amber}]} /></Cap>,
        <Cap key="c" f={f} a={a(9)} b={a(13)}><Tag label="Auto-Alignment" color={C.blue} parts={[{t: "Text (Left)", c: C.blue}, {t: " | "}, {t: "Numbers & Dates (Right)", c: C.emerald}, {t: " | "}, {t: "Booleans (Center)", c: C.amber}]} /></Cap>,
        <Cap key="d" f={f} a={a(13)} b={9999}><Tag label="Stored Value" color={C.purple} parts={[{t: "46023", c: C.purple}, {t: " = "}, {t: "1/1/2026", c: C.ink}, {t: "  (Visual Mask)", c: C.purple}]} /></Cap>,
      ]}>
      <ExcelApp file="Book1" numFmt={numFmt} name={`${String.fromCharCode(64 + active.c)}1`} fx={<span style={{color: c1Serial && active.c === 3 ? C.purple : C.txt, fontWeight: c1Serial && active.c === 3 ? 700 : 400}}>{fxTxt}</span>}
        sheet={{cells, widths: W, active, sel: {r1: 1, c1: active.c, r2: 1, c2: active.c}}}>
        {tour.map((g, i) => {
          const k = win(f, g.a, g.b);
          return k > 0 ? <div key={i}><Glow x={g.x} y={g.y} w={g.w} h={g.h} color={C.blue} k={k} fill={0.05} /><Callout x={g.lx} y={g.ly} w={200} tx={g.lx + 100} ty={g.y + g.h - 6} color={C.blue} k={k} size={17}>{g.l}</Callout></div> : null;
        })}
        {shown.map((s, i) => {
          if (!s) return null;
          const r = R(i + 1);
          const k = eo(prog(f, t0[i], 12)) * (i === 2 ? (f < a(9) - 10 ? 1 : f < a(13) ? 0 : eo(prog(f, a(13), 10))) : 1 - prog(f, a(9) - 10, 10));
          const lab = i === 2 && f >= a(14) ? (maskT === 0 ? "You see" : "Excel stores") : i === 2 && f >= a(13) + 20 ? "Serial number" : LAB[i];
          const lc = i === 2 && f >= a(13) ? C.purple : COL[i];
          return (
            <div key={i}>
              <Glow x={r.x} y={r.y} w={r.w - 1} h={r.h - 1} color={COL[i]} k={k} />
              <Callout x={r.x - 4} y={268 + (i % 2) * 38} w={r.w + 8} tx={r.x + r.w / 2} ty={r.y + r.h + 2} color={lc} k={k} size={15}>{lab}</Callout>
            </div>
          );
        })}
        {[0, 1, 2, 3].map((i) => {
          const k = win(f, a(10 + (i === 3 ? 2 : i === 2 ? 1 : i)) - 6, a(13) - 6, 12);
          if (k <= 0) return null;
          const r = R(i + 1);
          const dir = i === 0 ? -1 : i === 3 ? 0 : 1;
          const t = eo(prog(f, a(10 + (i === 3 ? 2 : i === 2 ? 1 : i)), 26));
          const cx = r.x + r.w / 2 + dir * (r.w / 2 - 14) * t;
          return (
            <div key={"ar" + i} style={{position: "absolute", left: 0, top: 0, opacity: k}}>
              <div style={{position: "absolute", left: r.x, top: r.y + r.h + 22, width: r.w - 1, height: 6, background: "#E5E7EB", borderRadius: 3}} />
              <div style={{position: "absolute", left: cx - 9, top: r.y + r.h + 12, width: 18, height: 26, color: COL[i], fontSize: 22, fontWeight: 700, textAlign: "center", lineHeight: "26px"}}>{dir < 0 ? "◀" : dir > 0 ? "▶" : "◆"}</div>
              <div style={{position: "absolute", left: r.x, top: r.y + r.h + 36, width: r.w - 1, textAlign: "center", color: COL[i], fontWeight: 700, fontSize: 15, fontFamily: F.ui}}>{CAP[i]}</div>
            </div>
          );
        })}
        {f >= a(13) && xr < 1 ? <XRay x={R(3).x} y={R(3).y} w={R(3).w - 1} h={R(3).h - 1} t={xr} /> : null}
        {f >= a(13) + 40 ? <Chip x={R(3).x - 20} y={R(3).y + 150} w={R(3).w + 40} color={C.purple} k={eo(prog(f, a(13) + 40, 12))}>1 = 1-Jan-1900</Chip> : null}
        {f >= a(14) ? <Chip x={R(3).x - 60} y={R(3).y + 184} w={R(3).w + 120} color={C.purple} k={eo(prog(f, a(14), 12))}>46023 = 1-Jan-2026</Chip> : null}
        <Cursor keys={[
          {f: t0[0] - 24, x: 640, y: 420}, {f: t0[0], x: R(1).x + 30, y: R(1).y + 8, click: true},
          {f: t0[1], x: R(2).x + 30, y: R(2).y + 8, click: true}, {f: t0[2], x: R(3).x + 30, y: R(3).y + 8, click: true},
          {f: t0[3], x: R(4).x + 30, y: R(4).y + 8, click: true}, {f: a(13), x: R(3).x + 60, y: R(3).y + 10, click: true},
        ]} />
      </ExcelApp>
    </Stage>
  );
};
