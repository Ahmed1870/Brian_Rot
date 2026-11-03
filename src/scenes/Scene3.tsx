import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner } from "../components/common";
import { C, eb, eio, eo, prog, useT, win } from "../lib";

// leaves (tables) — appear exactly when the narrator names them
const LEAVES = [
  { n: "customers", x: 190, a: 93.1 },
  { n: "orders", x: 490, a: 93.9 },
  { n: "order_items", x: 790, a: 94.6 },
  { n: "products", x: 1090, a: 96.0 },
  { n: "categories", x: 1390, a: 96.8 },
  { n: "discounts", x: 1690, a: 97.5 },
];
const LY = 690;
// join nodes: id, x, y, children, appearance time, algorithm, color
type J = { id: string; x: number; y: number; kids: [string, string]; a: number; algo: string; c: string };
const JOINS: J[] = [
  { id: "J1", x: 340, y: 540, kids: ["customers", "orders"], a: 109.3, algo: "Nested Loop", c: C.violet },
  { id: "J2", x: 565, y: 410, kids: ["J1", "order_items"], a: 111.0, algo: "Merge Join", c: C.amber },
  { id: "J3", x: 1240, y: 540, kids: ["products", "categories"], a: 112.6, algo: "Hash Join", c: C.green },
  { id: "J4", x: 900, y: 290, kids: ["J2", "J3"], a: 114.2, algo: "Hash Join", c: C.green },
  { id: "J5", x: 1300, y: 190, kids: ["J4", "discounts"], a: 115.4, algo: "Hash Join", c: C.green },
];
const pos = (id: string): { x: number; y: number } => {
  const l = LEAVES.find((q) => q.n === id);
  if (l) return { x: l.x, y: LY };
  const j = JOINS.find((q) => q.id === id)!;
  return { x: j.x, y: j.y };
};
const NW = 200, NH = 56;

export const Scene3: React.FC = () => {
  const t = useT();
  // bottom-up light pulse along the optimal path (119.5 → 121.7)
  const pulse = eio(t, 119.5, 121.9);
  const lock = prog(t, 121.9, 122.5);
  const cost = eb(t, 123.0, 123.7);

  return (
    <AbsoluteFill>
      {/* title */}
      <div style={{ position: "absolute", left: 0, top: 112, width: 1920, textAlign: "center", opacity: win(t, 87.6, 130.6, 0.6), fontFamily: AR, fontWeight: 900, fontSize: 36, color: C.text, direction: "rtl" }}>
        شجرة الربط <span style={{ color: C.blue }}>|</span> <span style={{ fontFamily: MONO, fontSize: 30, color: C.blue }}>Query Planner Join Tree</span>
      </div>

      {/* edges (own small svg) */}
      <svg width={1700} height={560} viewBox="100 170 1700 560" style={{ position: "absolute", left: 100, top: 170 }}>
        {JOINS.map((j) =>
          j.kids.map((k) => {
            const a = pos(k);
            const e = prog(t, j.a - 0.3, j.a + 0.5);
            if (e <= 0) return null;
            const y1 = a.y - NH / 2;
            const y2 = j.y + NH / 2;
            const lit = pulse > 0 && t > 119.5;
            return (
              <path
                key={j.id + k}
                d={`M ${a.x} ${y1} C ${a.x} ${(y1 + y2) / 2}, ${j.x} ${(y1 + y2) / 2}, ${j.x} ${y2}`}
                fill="none"
                stroke={lit ? C.blue : C.line}
                strokeWidth={lit ? 5 : 3.5}
                opacity={e}
              />
            );
          }),
        )}
        {/* pulse dot travelling the optimal path */}
        {t > 119.5 && t < 122.6 && (
          <circle
            cx={pulse < 0.5 ? 340 + (565 - 340) * (pulse * 2) : 565 + (900 - 565) * ((pulse - 0.5) * 2)}
            cy={pulse < 0.5 ? 540 + (410 - 540) * (pulse * 2) : 410 + (290 - 410) * ((pulse - 0.5) * 2)}
            r={13}
            fill={C.blue}
            stroke="#fff"
            strokeWidth={3}
          />
        )}
      </svg>

      {/* leaves */}
      {LEAVES.map((l) => {
        const e = eb(t, l.a, l.a + 0.6);
        if (e <= 0) return null;
        return (
          <div
            key={l.n}
            style={{
              position: "absolute",
              left: l.x - NW / 2,
              top: LY - NH / 2 + (1 - Math.min(1, e)) * 60,
              width: NW,
              height: NH,
              opacity: Math.min(1, e * 1.5),
              borderRadius: 14,
              background: `${C.blue}1C`,
              border: `2.5px solid ${C.blue}`,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 22,
              lineHeight: "50px",
              textAlign: "center",
              color: C.text,
            }}
          >
            {l.n}
          </div>
        );
      })}

      {/* "not all at once" */}
      {win(t, 99.3, 102.4, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 120, borderRadius: 24, background: `${C.red}18`, border: `3px solid ${C.red}`, textAlign: "center", opacity: win(t, 99.3, 102.4, 0.4), transform: `scale(${0.85 + 0.15 * eb(t, 99.3, 99.9)})` }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 42, color: C.red, direction: "rtl", marginTop: 10 }}>مش دفعة واحدة ✕</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.dim }}>6 tables ≠ one big step</div>
        </div>
      )}

      {/* planner badge */}
      {t > 105.6 && (
        <div style={{ position: "absolute", left: 70, top: 200, width: 420, height: 130, borderRadius: 22, background: `${C.blue}16`, border: `3px solid ${C.blue}`, opacity: Math.min(prog(t, 105.6, 106.2), 1 - prog(t, 130.0, 130.5)), transform: `scale(${0.8 + 0.2 * eb(t, 105.6, 106.4)})` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.blue, margin: "16px 0 0 22px" }}>Query Planner</div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 26, color: C.text, direction: "rtl", textAlign: "left", margin: "8px 0 0 22px" }}>بيبني شجرة ربط ذكية</div>
        </div>
      )}

      {/* join nodes */}
      {JOINS.map((j, i) => {
        const e = eb(t, j.a, j.a + 0.6);
        if (e <= 0) return null;
        const algoA = 116.0 + (i === 0 ? 1.4 : i === 2 ? 0 : i === 1 ? 2.0 : 2.6);
        const algoShow = prog(t, algoA, algoA + 0.4);
        const on = lock > 0 && (j.id === "J1" || j.id === "J2" || j.id === "J4" || j.id === "J5");
        return (
          <div key={j.id}>
            <div
              style={{
                position: "absolute",
                left: j.x - 56,
                top: j.y - NH / 2,
                width: 112,
                height: NH,
                opacity: Math.min(1, e * 1.5),
                transform: `scale(${0.7 + 0.3 * Math.min(1, e)})`,
                borderRadius: NH / 2,
                background: on ? `${C.blue}33` : "#0B1222",
                border: `3px solid ${on ? C.blue : C.dim}`,
                boxShadow: on ? `0 0 16px ${C.blue}88` : "none",
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 24,
                lineHeight: "50px",
                textAlign: "center",
                color: on ? C.blue : C.text,
              }}
            >
              ⋈
            </div>
            <div style={{ position: "absolute", left: j.x - 90, top: j.y + NH / 2 + 4, width: 180, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 17, color: j.c, opacity: algoShow }}>
              {j.algo}
            </div>
          </div>
        );
      })}

      {/* algorithms legend + cost-based optimizer */}
      {win(t, 116.0, 122.0, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 800, width: 1780, display: "flex", justifyContent: "center", gap: 24, opacity: win(t, 116.0, 122.0, 0.4) }}>
          {[
            { s: "Hash Join", c: C.green },
            { s: "Nested Loop", c: C.violet },
            { s: "Merge Join", c: C.amber },
          ].map((a) => (
            <div key={a.s} style={{ padding: "8px 26px", borderRadius: 999, border: `2.5px solid ${a.c}`, background: `${a.c}16`, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: a.c }}>
              {a.s}
            </div>
          ))}
        </div>
      )}
      {cost > 0 && (
        <div style={{ position: "absolute", left: 1330, top: 330, width: 520, height: 130, borderRadius: 22, background: `${C.green}16`, border: `3px solid ${C.green}`, opacity: Math.min(1, cost * 1.4), transform: `scale(${0.8 + 0.2 * Math.min(1, cost)})`, textAlign: "center" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: 16 }}>Cost-Based Optimizer</div>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl" }}>أعلى سرعة وبدون اختناق ✓</div>
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={103.0} b={120.0} color={C.blue} fs={26}>
        PostgreSQL Query Planner ──► Builds Optimal Join Tree Execution Order
      </Banner>
      <Banner x={70} y={900} w={1780} a={118.5} b={130.6} color={C.green} fs={25}>
        Cost-Based Optimizer ──► Dynamically Selects Hash Join, Nested Loop or Merge Join
      </Banner>
    </AbsoluteFill>
  );
};
