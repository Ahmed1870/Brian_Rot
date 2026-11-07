import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner } from "../components/common";
import { C, eb, eo, prog, useT, win } from "../lib";

const PURPLE = "#A855F7";

type Step = { a: number; tx: "A" | "B" | "PG"; text: string; res?: string; c: string };
const CARDS: { x: number; a: number; c: string; en: string; ar: string; steps: Step[] }[] = [
  {
    x: 70, a: 46.4, c: C.red, en: "Dirty Read", ar: "القراءة القذرة",
    steps: [
      { a: 48.9, tx: "B", text: "UPDATE balance = 200", res: "not committed", c: PURPLE },
      { a: 50.6, tx: "A", text: "SELECT balance", res: "200 ✕ dirty", c: C.red },
      { a: 52.2, tx: "B", text: "ROLLBACK", res: "back to 100", c: PURPLE },
      { a: 54.8, tx: "PG", text: "reads committed only", res: "100 ✓", c: C.green },
    ],
  },
  {
    x: 690, a: 57.7, c: PURPLE, en: "Non-Repeatable Read", ar: "القراءة غير التكرارية",
    steps: [
      { a: 60.0, tx: "A", text: "SELECT balance", res: "100", c: C.blue },
      { a: 64.2, tx: "B", text: "UPDATE = 200; COMMIT", res: "committed", c: PURPLE },
      { a: 66.6, tx: "A", text: "SELECT balance again", res: "200 ≠ 100 ✕", c: C.red },
    ],
  },
  {
    x: 1310, a: 68.7, c: C.amber, en: "Phantom Read", ar: "قراءة الشبح",
    steps: [
      { a: 71.6, tx: "A", text: "SELECT … WHERE amount > 50", res: "2 rows", c: C.blue },
      { a: 75.0, tx: "B", text: "INSERT amount = 80; COMMIT", res: "committed", c: PURPLE },
      { a: 78.2, tx: "A", text: "same SELECT again", res: "3 rows ✕ phantom", c: C.amber },
    ],
  },
];
const CW = 540, CY = 190, CH = 560;

export const Scene2: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      {win(t, 41.3, 46.2, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 0, top: 300, width: 1920, textAlign: "center", opacity: win(t, 41.3, 46.2, 0.4) }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 41.3, 42.3)) * 40}px)` }}>
            مشكلات التزامن <span style={{ color: C.red }}>الثلاث</span> الشهيرة
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.dim, marginTop: 18, opacity: prog(t, 44.6, 45.3) }}>3 Primary Anomalies</div>
        </div>
      )}

      {CARDS.map((cd) => {
        const e = eb(t, cd.a, cd.a + 0.7);
        if (e <= 0) return null;
        const active = cd.steps.some((s) => t >= s.a) && t < (cd.steps[cd.steps.length - 1].a + 6);
        return (
          <div key={cd.en} style={{ position: "absolute", left: cd.x, top: CY, width: CW, height: CH, opacity: Math.min(1, e * 1.4), transform: `translateY(${(1 - Math.min(1, e)) * 80}px)`, borderRadius: 26, background: C.card2, border: `${active ? 4 : 2}px solid ${active ? cd.c : C.line}`, boxShadow: active ? `0 0 18px ${cd.c}55` : "none" }}>
            <div style={{ padding: "18px 26px 0" }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: cd.en.length > 12 ? 29 : 34, color: cd.c }}>{cd.en}</div>
              <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 30, color: C.text, direction: "rtl", textAlign: "left", marginTop: 6 }}>{cd.ar}</div>
            </div>
            {cd.steps.map((s, i) => {
              const se = eb(t, s.a, s.a + 0.5);
              if (se <= 0) return null;
              const tc = s.tx === "A" ? C.blue : s.tx === "B" ? PURPLE : C.green;
              return (
                <div key={i} style={{ position: "absolute", left: 18, top: 138 + i * 100, width: CW - 36, height: 88, opacity: Math.min(1, se * 1.5), transform: `translateX(${(1 - Math.min(1, se)) * 80}px)`, borderRadius: 16, background: `${s.c}16`, border: `2.5px solid ${s.c}`, padding: "8px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 62, height: 30, borderRadius: 15, background: tc, color: "#07101F", fontFamily: MONO, fontWeight: 700, fontSize: 17, lineHeight: "30px", textAlign: "center" }}>{s.tx === "PG" ? "PG" : `Tx ${s.tx}`}</span>
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.text }}>{s.text}</span>
                  </div>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: s.c, marginTop: 8, paddingLeft: 74, opacity: prog(t, s.a + 0.5, s.a + 1.0) }}>➔ {s.res}</div>
                </div>
              );
            })}
          </div>
        );
      })}

      {t > 56.0 && t < 68.0 && (
        <div style={{ position: "absolute", left: 70, top: 770, width: 540, height: 60, borderRadius: 16, background: `${C.green}1E`, border: `3px solid ${C.green}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "54px", color: C.green, opacity: win(t, 56.0, 68.0, 0.4) }}>
          Read Uncommitted ➔ Read Committed
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={42.0} b={53.8} color={C.red} fs={25}>
        3 Primary Anomalies: Dirty Read | Non-Repeatable Read | Phantom Read
      </Banner>
      <Banner x={70} y={900} w={1780} a={54.2} b={68.0} color={C.green} fs={25}>
        PostgreSQL Native Shield ──► Read Uncommitted Automatically Escalated to Read Committed
      </Banner>
      <Banner x={70} y={900} w={1780} a={68.5} b={84.8} color={C.amber} fs={25}>
        Phantom Read ──► New Rows Matching Your Query Suddenly Appear
      </Banner>
    </AbsoluteFill>
  );
};
