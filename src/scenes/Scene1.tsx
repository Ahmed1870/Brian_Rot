import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, prog, rnd, typed, useT, win } from "../lib";

const MESSY = [
  "SELECT name FROM customers WHERE id IN (",
  "  SELECT customer_id FROM orders WHERE total > (",
  "    SELECT AVG(total) FROM orders WHERE region IN (",
  "      SELECT region FROM stores WHERE active = 1",
  "    )",
  "  )",
  ");",
];
const BLOCKS = [
  { y: 200, c: C.blue, k: "WITH active_stores AS ( … )", s: "CTE 1 · named temporary table", a: 26.0 },
  { y: 350, c: C.blue, k: "avg_total AS ( … )", s: "CTE 2 · reads CTE 1", a: 26.6 },
  { y: 500, c: C.green, k: "SELECT … FROM avg_total", s: "main query", a: 27.2 },
];

export const Scene1: React.FC = () => {
  const t = useT();
  const messy = Math.min(prog(t, 6.2, 6.8), 1 - prog(t, 25.3, 25.9));
  const plate = t > 22.3 && t < 27.4 ? (t < 25.0 ? eo(t, 22.3, 25.0) : 1 - eo(t, 25.6, 27.2)) : 0;
  const chaos = win(t, 16.0, 25.3, 0.4);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 116, width: 1000, height: 58, opacity: win(t, 2.0, 18.0, 0.6), transform: `translateY(${(1 - prog(t, 2.0, 2.7)) * -24}px)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, borderRadius: 999, border: `2px solid ${C.blue}88`, background: "#0B1B33" }}>
        <span style={{ fontFamily: AR, fontWeight: 900, fontSize: 28, color: C.text, direction: "rtl" }}>الاستعلامات الفرعية و CTEs</span>
        <span style={{ color: C.blue, fontSize: 26 }}>|</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.blue }}>Subqueries &amp; Common Table Expressions</span>
      </div>

      {/* unit 10 intro */}
      {win(t, 1.4, 6.0, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 300, width: 1000, textAlign: "center", opacity: win(t, 1.4, 6.0, 0.4) }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 1.4, 2.4)) * 40}px)` }}>
            الوحدة <span style={{ color: C.blue }}>العاشرة</span>
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.dim, marginTop: 14 }}>Subqueries, CTEs &amp; Advanced Structures</div>
        </div>
      )}

      {/* messy nested code */}
      {messy > 0 && (
        <div style={{ opacity: messy }}>
          <Window x={70} y={190} w={1000} h={470} title="messy_nested.sql" color={chaos > 0 ? C.red : C.blue} glow={chaos > 0 ? 1 : 0}>
            {MESSY.map((s, i) => {
              const txt = typed(s, t, 6.6 + i * 1.2, 7.6 + i * 1.2);
              return txt.length > 0 ? (
                <div key={i} style={{ position: "absolute", left: 24 + (chaos > 0 ? (rnd(i) - 0.5) * 18 * Math.sin(t * 5 + i) : 0), top: 20 + i * 52, transform: `rotate(${chaos > 0 ? (rnd(i + 3) - 0.5) * 2.4 : 0}deg)` }}>
                  <CodeLine text={txt} fs={21} />
                </div>
              ) : null;
            })}
          </Window>
        </div>
      )}
      {win(t, 15.0, 17.5, 0.3) > 0 && (
        <div style={{ position: "absolute", left: 770, top: 150, padding: "8px 22px", borderRadius: 999, border: `2.5px solid ${C.violet}`, background: `${C.violet}18`, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.violet, opacity: win(t, 15.0, 17.5, 0.3) }}>
          Subqueries
        </div>
      )}
      {chaos > 0 && t > 21.0 && (
        <div style={{ position: "absolute", left: 70, top: 690, width: 1000, textAlign: "center", fontFamily: AR, fontWeight: 900, fontSize: 40, color: C.red, direction: "rtl", opacity: Math.min(chaos, prog(t, 21.0, 21.6)) }}>
          فوضوي وصعب القراءة ✕
        </div>
      )}

      {/* organising piston */}
      {plate > 0 && (
        <div style={{ position: "absolute", left: 70, top: 60 + plate * 130, width: 1000, opacity: Math.min(1, plate * 2) }}>
          <div style={{ marginLeft: 480, width: 40, height: 80, background: "#475569" }} />
          <div style={{ width: 1000, height: 64, borderRadius: 14, background: C.blue, boxShadow: `0 0 18px ${C.blue}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, lineHeight: "62px", color: "#07101F" }}>
            WITH cte_name AS ( )
          </div>
        </div>
      )}

      {/* modular blocks */}
      {BLOCKS.map((b, i) => {
        const e = eb(t, b.a, b.a + 0.6);
        return e > 0 ? (
          <div key={b.k}>
            <div style={{ position: "absolute", left: 70, top: b.y, width: 1000, height: 110, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - Math.min(1, e)) * -160}px)`, borderRadius: 20, background: `${b.c}16`, border: `3px solid ${b.c}`, padding: "16px 28px" }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: b.c }}>{b.k}</div>
              <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 8 }}>{b.s}</div>
            </div>
            {i < 2 && <div style={{ position: "absolute", left: 566, top: b.y + 110, width: 8, height: 40, background: C.green, opacity: prog(t, b.a + 0.5, b.a + 0.9) }} />}
          </div>
        ) : null;
      })}

      {/* benefits */}
      {[
        { a: 31.6, s: "جداول مؤقتة اسمية في الذاكرة", c: C.blue },
        { a: 35.4, s: "سلسلة منظمة وسهلة القراءة ✓", c: C.green },
        { a: 36.8, s: "سهلة الصيانة والاختبار ✓", c: C.green },
      ].map((p, i) => {
        const e = eb(t, p.a, p.a + 0.5);
        return e > 0 ? (
          <div key={i} style={{ position: "absolute", left: 1130, top: 220 + i * 150, width: 720, height: 120, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - Math.min(1, e)) * 140}px)`, borderRadius: 22, background: `${p.c}16`, border: `3px solid ${p.c}`, fontFamily: AR, fontWeight: 900, fontSize: 36, lineHeight: "114px", color: C.text, direction: "rtl", textAlign: "center" }}>
            {p.s}
          </div>
        ) : null;
      })}

      <Banner x={70} y={900} w={1780} a={22.0} b={38.8} color={C.blue} fs={26}>
        WITH cte_name AS (...) ──► Modular &amp; Readable Temporary Tables
      </Banner>
    </AbsoluteFill>
  );
};
