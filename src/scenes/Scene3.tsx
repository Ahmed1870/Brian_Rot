import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, fmt, prog, typed, useT, win } from "../lib";

const PURPLE = "#A855F7";
const LINES: [string, number, number][] = [
  ["WITH regional_sales AS (", 94.0, 95.2],
  ["  SELECT region, SUM(amount) AS total_sales FROM sales GROUP BY region", 95.2, 98.4],
  ["),", 98.4, 98.8],
  ["top_regions AS (", 99.0, 100.4],
  ["  SELECT region FROM regional_sales WHERE total_sales > 100000", 100.4, 104.5],
  [")", 104.5, 104.9],
  ["SELECT * FROM top_regions;", 105.2, 107.6],
];
const REG: [string, number][] = [
  ["Cairo", 180000],
  ["Alexandria", 95000],
  ["Giza", 120000],
  ["Mansoura", 60000],
];
const BX = 1110, BW = 740;

export const Scene3: React.FC = () => {
  const t = useT();
  const typing = t > 94.0 && t < 107.7;
  const caret = LINES.findIndex(([, a, b]) => t >= a && t < b);
  const b1 = eb(t, 95.5, 96.2);
  const b2 = eb(t, 100.5, 101.2);
  const b3 = eb(t, 105.5, 106.2);
  const flow = (a: number, d = 1.2) => prog(t, a, a + d);
  const pass = (n: number) => n > 100000;

  return (
    <AbsoluteFill>
      {/* intro */}
      {win(t, 85.6, 94.0, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 280, width: 1000, textAlign: "center", opacity: win(t, 85.6, 94.0, 0.5) }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 56, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 85.6, 86.6)) * 40}px)` }}>
            ربط وتسلسل عدة <span style={{ color: C.blue, fontFamily: MONO }}>CTEs</span>
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: PURPLE, marginTop: 18, opacity: prog(t, 91.4, 92.0) }}>WITH cte1 AS (…), cte2 AS (…)</div>
        </div>
      )}

      {t > 93.4 && (
        <div style={{ opacity: eo(t, 93.4, 94.1), transform: `translateX(${(1 - eo(t, 93.4, 94.2)) * -100}px)` }}>
          <Window x={70} y={150} w={1000} h={470} title="chained_ctes.sql" glow={typing ? 1 : 0}>
            {LINES.map(([txt, a, b], i) => {
              const s = typed(txt, t, a, b);
              return s.length > 0 ? (
                <div key={i} style={{ position: "absolute", left: 22, top: 18 + i * 42 }}>
                  <CodeLine text={s} fs={20} caret={caret === i} />
                </div>
              ) : null;
            })}
          </Window>
        </div>
      )}

      {/* assembly line */}
      {b1 > 0 && (
        <div style={{ position: "absolute", left: BX, top: 150, width: BW, height: 240, opacity: Math.min(1, b1 * 1.4), transform: `translateX(${(1 - Math.min(1, b1)) * 120}px)`, borderRadius: 22, background: C.card2, border: `3px solid ${C.blue}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.blue, margin: "10px 0 0 22px" }}>① regional_sales</div>
          {REG.map(([n, v], i) => (
            <div key={n} style={{ position: "absolute", left: 18, top: 52 + i * 44, width: 704, height: 38, borderRadius: 9, background: `${C.blue}16`, display: "flex", justifyContent: "space-between", padding: "0 14px", fontFamily: MONO, fontWeight: 700, fontSize: 19, lineHeight: "36px", color: C.text, opacity: prog(t, 96.4 + i * 0.3, 96.8 + i * 0.3) }}>
              <span>{n}</span>
              <span style={{ color: "#7DD3FC" }}>{fmt(v)}</span>
            </div>
          ))}
        </div>
      )}
      {b2 > 0 && (
        <div style={{ position: "absolute", left: BX, top: 430, width: BW, height: 160, opacity: Math.min(1, b2 * 1.4), transform: `translateX(${(1 - Math.min(1, b2)) * 120}px)`, borderRadius: 22, background: C.card2, border: `3px solid ${PURPLE}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: PURPLE, margin: "10px 0 0 22px" }}>② top_regions · total_sales &gt; 100,000</div>
          {REG.filter(([, v]) => pass(v)).map(([n], i) => (
            <div key={n} style={{ position: "absolute", left: 18 + i * 360, top: 62, width: 340, height: 44, borderRadius: 9, background: `${PURPLE}22`, border: `2px solid ${PURPLE}`, fontFamily: MONO, fontWeight: 700, fontSize: 21, lineHeight: "40px", paddingLeft: 14, color: C.text, opacity: flow(108.0 + i * 0.4, 0.6) }}>
              {n}
            </div>
          ))}
        </div>
      )}
      {b3 > 0 && (
        <div style={{ position: "absolute", left: BX, top: 630, width: BW, height: 110, opacity: Math.min(1, b3 * 1.4), transform: `translateX(${(1 - Math.min(1, b3)) * 120}px)`, borderRadius: 22, background: `${C.green}14`, border: `3px solid ${C.green}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.green, margin: "10px 0 0 22px" }}>③ SELECT * FROM top_regions</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.text, margin: "4px 0 0 22px", opacity: flow(109.0, 0.6) }}>Cairo · Giza ✓</div>
        </div>
      )}
      {/* flowing dots */}
      {[
        { from: 392, to: 430, a: 107.6 },
        { from: 592, to: 630, a: 109.0 },
      ].map((f, i) => {
        const p = flow(f.a, 1.0);
        return p > 0 && p < 1 ? <div key={i} style={{ position: "absolute", left: BX + BW / 2 - 9, top: f.from + (f.to - f.from) * eio(t, f.a, f.a + 1.0) - 9, width: 18, height: 18, borderRadius: 9, background: C.green, border: "2px solid #fff" }} /> : null;
      })}
      {[392, 592].map((y, i) => (
        <div key={i} style={{ position: "absolute", left: BX + BW / 2 - 3, top: y, width: 6, height: 38, background: i === 0 ? PURPLE : C.green, opacity: prog(t, 101.4 + i * 4.8, 101.8 + i * 4.8) }} />
      ))}

      {/* benefit chips */}
      {[
        { a: 113.3, s: "NO CODE REPETITION", c: C.blue, x: 70 },
        { a: 118.0, s: "SMALL LOGICAL STEPS", c: PURPLE, x: 410 },
        { a: 127.2, s: "FAST DEBUGGING ✓", c: C.green, x: 790 },
      ].map((p) => {
        const e = eb(t, p.a, p.a + 0.5);
        return e > 0 ? (
          <div key={p.s} style={{ position: "absolute", left: p.x, top: 680, width: p.s.length * 14 + 40, height: 58, opacity: Math.min(1, e * 1.5), transform: `scale(${0.8 + 0.2 * Math.min(1, e)})`, borderRadius: 16, background: `${p.c}18`, border: `3px solid ${p.c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 21, lineHeight: "52px", color: p.c }}>
            {p.s}
          </div>
        ) : null;
      })}

      <Banner x={70} y={900} w={1780} a={94.0} b={110.2} color={C.blue} fs={26}>
        Chained CTEs ──► WITH cte1 AS (...), cte2 AS (...)
      </Banner>
      <Banner x={70} y={900} w={1780} a={110.6} b={128.6} color={PURPLE} fs={26}>
        Pipeline Architecture ──► Modular Step-by-Step Logic Simplification
      </Banner>
    </AbsoluteFill>
  );
};
