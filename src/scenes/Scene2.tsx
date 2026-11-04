import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Arabic, Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, fmt, prog, typed, useT, win } from "../lib";

const SUMS = [1850, 920, 2400, 610];
const NAMES = ["C101", "C102", "C103", "C104"];
const AVG = 1445;
const BASE = 640, BX = (i: number) => 1110 + i * 170, BWD = 110;
const bh = (v: number) => (v / 2400) * 300;

export const Scene2: React.FC = () => {
  const t = useT();
  const phase2 = t > 63.3;

  const P = [typed("SELECT AVG(SUM(total_amount))", t, 55.2, 58.8), typed("FROM orders;", t, 58.8, 59.6)];
  const outer = t > 74.7 ? typed("SELECT AVG(total_spent) AS avg_spent", t, 75.0, 77.0) : typed("SELECT *", t, 64.0, 64.8);
  const F = [
    outer,
    typed("FROM (", t, 64.8, 65.4),
    typed("  SELECT customer_id, SUM(total_amount) AS total_spent", t, 66.2, 69.8),
    typed("  FROM orders", t, 69.8, 70.6),
    typed("  GROUP BY customer_id", t, 70.6, 71.6),
    typed(") AS customer_summary;", t, 71.6, 72.8),
  ];
  const caret2 = t < 64.8 ? 0 : t < 66.2 ? 1 : t < 69.8 ? 2 : t < 70.6 ? 3 : t < 71.6 ? 4 : t < 72.8 ? 5 : t > 74.7 && t < 77.1 ? 0 : -1;
  const shake = t > 59.6 && t < 60.4 ? Math.sin((t - 59.6) * 90) * 9 * (1 - prog(t, 59.6, 60.4)) : 0;
  const err = win(t, 59.6, 63.4, 0.35);
  const step1 = t > 68.6;
  const step2 = t > 74.7;
  const barsOp = (i: number) => eo(t, 46.0 + i * 0.45, 46.8 + i * 0.45);

  return (
    <AbsoluteFill>
      {/* concept: aggregate of aggregates */}
      {win(t, 44.4, 53.2, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 220, width: 930, opacity: win(t, 44.4, 53.2, 0.5), textAlign: "center" }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 44.4, 45.4)) * 40}px)` }}>
            تجميع <span style={{ color: C.blue }}>على</span> تجميع
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.blue, marginTop: 26, opacity: prog(t, 47.0, 47.8) }}>SUM ➔ AVG</div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 32, color: C.dim, direction: "rtl", marginTop: 26, opacity: prog(t, 50.0, 50.8) }}>معالجة تجميعية على مرتين</div>
        </div>
      )}

      {/* editor */}
      {t > 52.6 && (
        <div style={{ opacity: eo(t, 52.6, 53.3), transform: `translateX(${shake}px)` }}>
          <Window x={70} y={190} w={930} h={320} title={phase2 ? "two_step_aggregation.sql" : "nested_aggregate.sql"} color={phase2 ? C.green : C.red} glow={err > 0 || (phase2 && t < 73) ? 1 : 0}>
            {!phase2 &&
              P.map((s, i) =>
                s.length > 0 ? (
                  <div key={i} style={{ position: "absolute", left: 26, top: 20 + i * 40 }}>
                    <CodeLine text={s} fs={26} caret={t < 59.7 && ((i === 0 && t < 58.8) || (i === 1 && t >= 58.8))} override={err > 0 ? "#FCA5A5" : undefined} />
                  </div>
                ) : null,
              )}
            {phase2 &&
              F.map((s, i) =>
                s.length > 0 ? (
                  <div key={i} style={{ position: "absolute", left: 26, top: 18 + i * 38 }}>
                    <CodeLine text={s} fs={24} caret={caret2 === i} />
                  </div>
                ) : null,
              )}
          </Window>
        </div>
      )}

      {/* error card */}
      {err > 0 && (
        <div style={{ position: "absolute", left: 70, top: 540, width: 930, height: 150, borderRadius: 22, background: `${C.red}1C`, border: `3px solid ${C.red}`, opacity: err, padding: "20px 30px" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 29, color: C.red }}>{typed("ERROR: aggregate function calls cannot be nested", t, 59.7, 62.7)}</div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, direction: "rtl", marginTop: 14, opacity: prog(t, 62.6, 63.2) }}>المحرك رفض الكود فوراً — خطأ استدعاء مكرر</div>
        </div>
      )}

      {/* two-step chips */}
      {phase2 && (
        <div style={{ position: "absolute", left: 70, top: 540, width: 930, display: "flex", alignItems: "center", gap: 20 }}>
          {[
            { a: 68.6, c: C.green, k: "STEP 1", v: "SUM()  inner" },
            { a: 74.7, c: C.blue, k: "STEP 2", v: "AVG()  outer" },
          ].map((s, i) => {
            const e = eb(t, s.a, s.a + 0.5);
            return (
              <React.Fragment key={s.k}>
                {i === 1 && <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: C.dim, opacity: prog(t, 74.4, 74.8) }}>➔</div>}
                <div style={{ width: 430, height: 100, borderRadius: 20, background: `${s.c}18`, border: `3px solid ${s.c}`, opacity: Math.min(1, e * 1.5), transform: `scale(${0.85 + 0.15 * Math.min(1, e)})`, textAlign: "center" }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: s.c, marginTop: 12 }}>{s.k}</div>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.text }}>{s.v}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
      {t > 78.0 && (
        <div style={{ position: "absolute", left: 70, top: 668, width: 930, height: 74, borderRadius: 18, background: `${C.green}1A`, border: `3px solid ${C.green}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: "68px", color: C.green, opacity: prog(t, 78.0, 78.6), transform: `scale(${0.9 + 0.1 * eb(t, 78.0, 78.7)})` }}>
          avg_spent = {fmt(AVG)} ✓
        </div>
      )}

      {/* right: bars + average */}
      <div style={{ position: "absolute", left: 1060, top: 190, width: 790, height: 540, borderRadius: 24, background: C.card2, border: `2px solid ${C.line}`, opacity: eo(t, 45.6, 46.4) }} />
      <div style={{ position: "absolute", left: 1090, top: 202, fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim, opacity: prog(t, 45.8, 46.4) }}>SUM per customer ➔ AVG of the sums</div>
      {NAMES.map((n, i) => {
        const e = barsOp(i);
        if (e <= 0) return null;
        const col = step1 || t > 59.6 ? (step1 ? C.green : C.dim) : C.blue;
        return (
          <div key={n}>
            <div style={{ position: "absolute", left: BX(i), top: BASE - bh(SUMS[i]) * e, width: BWD, height: bh(SUMS[i]) * e, borderRadius: "12px 12px 0 0", background: `${col}77`, border: `3px solid ${col}` }} />
            <div style={{ position: "absolute", left: BX(i) - 20, top: BASE - bh(SUMS[i]) * e - 34, width: BWD + 40, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.text, opacity: e }}>{fmt(SUMS[i])}</div>
            <div style={{ position: "absolute", left: BX(i), top: BASE + 8, width: BWD, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.dim }}>{n}</div>
          </div>
        );
      })}
      {t > 50.8 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 1090,
              top: BASE - bh(AVG) - 2,
              width: 730 * eio(t, 50.8, 52.0),
              height: 0,
              borderTop: `4px dashed ${step2 ? C.green : C.amber}`,
            }}
          />
          <div style={{ position: "absolute", left: 1520, top: BASE - bh(AVG) - 40, width: 300, textAlign: "right", fontFamily: MONO, fontWeight: 700, fontSize: 24, color: step2 ? C.green : C.amber, opacity: prog(t, 51.6, 52.2) }}>
            AVG = {fmt(AVG)}
          </div>
        </>
      )}
      {err > 0 && (
        <div style={{ position: "absolute", left: 1060, top: 190, width: 790, height: 540, borderRadius: 24, background: `${C.red}14`, border: `3px solid ${C.red}`, opacity: err * 0.9, textAlign: "center" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.red, marginTop: 220 }}>AVG(SUM(x)) ✕</div>
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={55.0} b={65.5} color={C.red} fs={26}>
        AVG(SUM(...)) ──► ERROR: aggregate function calls cannot be nested
      </Banner>
      <Banner x={70} y={900} w={1780} a={66.8} b={86.0} color={C.green} fs={26}>
        Derived Table Solution ──► Step 1: SUM() Inner ➔ Step 2: AVG() Outer
      </Banner>
    </AbsoluteFill>
  );
};
