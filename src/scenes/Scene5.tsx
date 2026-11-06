import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, fmt, prog, typed, useT, win } from "../lib";

const LINES: [string, number, number][] = [
  ["WITH high_value_customers AS (", 181.4, 182.4],
  ["  SELECT customer_id, SUM(total_amount) AS total_spent", 182.4, 183.6],
  ["  FROM orders GROUP BY customer_id HAVING SUM(total_amount) > 5000", 183.6, 185.2],
  [")", 185.2, 185.4],
  ["SELECT c.customer_name, hvc.total_spent", 185.4, 186.3],
  ["FROM customers c JOIN high_value_customers hvc ON c.customer_id = hvc.customer_id", 186.3, 188.0],
  ["WHERE EXISTS (", 188.0, 188.6],
  ["  SELECT 1 FROM orders o", 188.6, 189.4],
  ["  WHERE o.customer_id = c.customer_id AND o.order_date >= NOW() - INTERVAL '30 days'", 189.4, 192.5],
  [");", 192.5, 193.0],
];
// name, total_spent, days since last order
const CUST: [string, number, number][] = [
  ["Ali Hassan", 12400, 5],
  ["Sara Adel", 8900, 12],
  ["Omar Nabil", 6300, 21],
  ["Hany Fathy", 7200, 74],
  ["Mona Samir", 5400, 28],
];

export const Scene5: React.FC = () => {
  const t = useT();
  const typing = t > 181.4 && t < 193.1;
  const caret = LINES.findIndex(([, a, b]) => t >= a && t < b);
  const intro = win(t, 170.5, 181.0, 0.5);
  const stamp = eb(t, 204.2, 204.8);
  const filter = prog(t, 189.8, 190.6);

  return (
    <AbsoluteFill>
      {intro > 0 && (
        <div style={{ position: "absolute", left: 160, top: 300, width: 1600, textAlign: "center", opacity: intro }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 62, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 170.5, 171.6)) * 40}px)` }}>
            التطبيقات <span style={{ color: C.green }}>المؤسسية</span> في منظومة ستور
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 30, marginTop: 30 }}>
            {[{ a: 175.9, s: "WITH", c: C.blue }, { a: 176.5, s: "EXISTS", c: C.green }].map((p) => (
              <div key={p.s} style={{ padding: "10px 34px", borderRadius: 16, border: `3px solid ${p.c}`, background: `${p.c}18`, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: p.c, opacity: prog(t, p.a, p.a + 0.4), transform: `scale(${0.8 + 0.2 * eb(t, p.a, p.a + 0.5)})` }}>
                {p.s}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 34, color: C.dim, direction: "rtl", marginTop: 26, opacity: prog(t, 179.0, 179.8) }}>شرائح العملاء الأكثر شراءً</div>
        </div>
      )}

      {t > 180.8 && (
        <div style={{ opacity: eo(t, 180.8, 181.5), transform: `translateX(${(1 - eo(t, 180.8, 181.7)) * -100}px)` }}>
          <Window x={70} y={150} w={1000} h={450} title="active_high_value_cohort.sql" glow={typing ? 1 : 0}>
            {LINES.map(([txt, a, b], i) => {
              const s = typed(txt, t, a, b);
              return s.length > 0 ? (
                <div key={i} style={{ position: "absolute", left: 20, top: 14 + i * 33 }}>
                  <CodeLine text={s} fs={18} caret={caret === i} />
                </div>
              ) : null;
            })}
          </Window>
        </div>
      )}

      {/* pipeline chips */}
      {[
        { a: 181.9, s: "CTE · revenue per customer", c: C.blue, x: 70 },
        { a: 185.5, s: "EXISTS · last 30 days", c: C.green, x: 400 },
        { a: 195.6, s: "cohort ✓", c: C.violet, x: 730 },
      ].map((p) => {
        const e = eb(t, p.a, p.a + 0.5);
        return e > 0 ? (
          <div key={p.s} style={{ position: "absolute", left: p.x, top: 630, width: p.s.length * 13 + 40, height: 56, opacity: Math.min(1, e * 1.5), transform: `scale(${0.8 + 0.2 * Math.min(1, e)})`, borderRadius: 14, background: `${p.c}18`, border: `3px solid ${p.c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "50px", color: p.c }}>
            {p.s}
          </div>
        ) : null;
      })}
      {win(t, 192.4, 195.2, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 712, width: 1000, textAlign: "center", fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", opacity: win(t, 192.4, 195.2, 0.4) }}>
          من غير <span style={{ color: C.red, fontFamily: MONO }}>JOINs</span> عريضة بتكرر الصفوف
        </div>
      )}

      {/* report */}
      {t > 185.6 && (
        <div style={{ opacity: eo(t, 185.6, 186.3), transform: `translateX(${(1 - eo(t, 185.6, 186.5)) * 120}px)` }}>
          <Window x={1110} y={150} w={740} h={540} title="high_value_customers" color={t > 190.6 ? C.green : C.blue} glow={t > 196 ? 1 : 0}>
            <div style={{ position: "absolute", left: 20, top: 12, width: 700, display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.blue }}>
              <span>customer_name</span>
              <span>total_spent</span>
              <span style={{ opacity: prog(t, 189.0, 189.6) }}>last_order</span>
            </div>
            {CUST.map(([n, v, d], i) => {
              const a = 186.4 + i * 0.4;
              const e = eb(t, a, a + 0.5);
              const out = d > 30;
              const st = out ? filter : 0;
              return (
                <div key={n} style={{ position: "absolute", left: 12, top: 50 + i * 86, width: 716, height: 74, opacity: Math.min(1, e * 1.5) * (1 - 0.6 * st), transform: `translateX(${(1 - Math.min(1, e)) * 100}px)`, borderRadius: 14, background: st > 0.5 ? `${C.red}14` : t > 190.6 ? `${C.green}18` : "#1B2740", border: `2.5px solid ${st > 0.5 ? C.red : t > 190.6 ? C.green : C.line}` }}>
                  <div style={{ position: "absolute", left: 8, top: 8, width: 700, display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.text, textDecoration: st > 0.5 ? "line-through" : "none" }}>
                    <span>{n}</span>
                    <span style={{ color: "#7DD3FC" }}>{fmt(v)}</span>
                    <span style={{ color: out ? C.red : "#6EE7B7", opacity: prog(t, 189.0, 189.6) }}>{d} days ago</span>
                  </div>
                  <div style={{ position: "absolute", left: 20, top: 44, fontFamily: MONO, fontWeight: 700, fontSize: 15, color: st > 0.5 ? C.red : C.green, opacity: t > 190.6 ? 1 : 0 }}>
                    {st > 0.5 ? "✕ no order in 30 days" : "✓ active & high-value"}
                  </div>
                </div>
              );
            })}
          </Window>
        </div>
      )}

      {/* marketing chips */}
      {[
        { a: 202.9, s: "RETARGETING CAMPAIGNS", c: C.amber, x: 1110 },
        { a: 205.2, s: "HIGH-MARGIN PRODUCTS", c: C.green, x: 1110 },
      ].map((p, i) => {
        const e = eb(t, p.a, p.a + 0.5);
        return e > 0 ? (
          <div key={p.s} style={{ position: "absolute", left: p.x, top: 720 + i * 70, width: 560, height: 56, opacity: Math.min(1, e * 1.5), transform: `scale(${0.85 + 0.15 * Math.min(1, e)})`, transformOrigin: "left center", borderRadius: 14, background: `${p.c}18`, border: `3px solid ${p.c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, lineHeight: "50px", color: p.c }}>
            {p.s}
          </div>
        ) : null;
      })}

      {stamp > 0 && (
        <div style={{ position: "absolute", left: 1500, top: 560, width: 330, height: 100, borderRadius: 14, border: `6px solid ${C.green}`, color: C.green, fontFamily: MONO, fontWeight: 700, fontSize: 25, textAlign: "center", lineHeight: "44px", paddingTop: 4, background: "#0B1222E0", transform: `rotate(-8deg) scale(${1.6 - 0.6 * stamp})`, opacity: Math.min(1, stamp * 1.5) * (1 - prog(t, 208.0, 208.6)) }}>
          EXECUTIVE COHORT
          <br />
          APPROVED ✓
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={172.0} b={195.0} color={C.blue} fs={25}>
        Enterprise Architecture ──► Chained CTE + EXISTS Semi-Join Pipeline
      </Banner>
      <Banner x={70} y={900} w={1780} a={195.5} b={208.6} color={C.green} fs={25}>
        Targeted Cohort Isolation ──► High-Value Active Customer Segmentation
      </Banner>
    </AbsoluteFill>
  );
};
