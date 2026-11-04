import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, fmt, prog, typed, useT, win } from "../lib";

const LINES: [string, number, number][] = [
  ["SELECT b.branch_name, b.sales,", 180.4, 182.2],
  ["       ROUND((b.sales / g.total_company_sales) * 100, 2) AS contribution_pct", 182.2, 185.6],
  ["FROM (", 186.4, 186.9],
  ["    SELECT branch_id, branch_name, SUM(amount) AS sales", 188.2, 190.4],
  ["    FROM branch_sales GROUP BY 1, 2", 190.4, 191.4],
  [") b", 191.4, 191.8],
  ["CROSS JOIN (", 191.9, 192.5],
  ["    SELECT SUM(amount) AS total_company_sales FROM branch_sales", 192.5, 195.0],
  [") g;", 195.0, 195.5],
];
// [branch, sales, pct]
const BR: [string, number, number][] = [
  ["Cairo", 480000, 40.0],
  ["Alexandria", 310000, 25.83],
  ["Giza", 260000, 21.67],
  ["Mansoura", 150000, 12.5],
];
const TOTAL = 1200000;

export const Scene5: React.FC = () => {
  const t = useT();
  const typing = t > 180.4 && t < 195.6;
  const caret = LINES.findIndex(([, a, b]) => t >= a && t < b);
  const intro = win(t, 175.8, 180.6, 0.5);
  const stamp = eb(t, 207.5, 208.1);

  return (
    <AbsoluteFill>
      {/* intro */}
      {intro > 0 && (
        <div style={{ position: "absolute", left: 160, top: 280, width: 1600, textAlign: "center", opacity: intro }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 175.8, 176.9)) * 40}px)` }}>
            التطبيقات <span style={{ color: C.amber }}>المالية</span> والمؤسسية
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.blue, marginTop: 14 }}>manzooma_store_db · contribution analysis</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: C.amber, marginTop: 30, opacity: prog(t, 184.2 - 6, 184.9 - 6) }}>
            share % = branch ÷ total × 100
          </div>
        </div>
      )}

      {/* editor */}
      {t > 179.8 && (
        <div style={{ opacity: eo(t, 179.8, 180.5), transform: `translateX(${(1 - eo(t, 179.8, 180.7)) * -100}px)` }}>
          <Window x={70} y={150} w={1000} h={470} title="branch_contribution.sql" glow={typing ? 1 : 0}>
            {LINES.map(([txt, a, b], i) => {
              const s = typed(txt, t, a, b);
              return s.length > 0 ? (
                <div key={i} style={{ position: "absolute", left: 22, top: 16 + i * 34 }}>
                  <CodeLine text={s} fs={20} caret={caret === i} />
                </div>
              ) : null;
            })}
          </Window>
        </div>
      )}

      {/* formula */}
      {t > 196.0 && (
        <div style={{ position: "absolute", left: 70, top: 660, width: 1000, height: 150, borderRadius: 22, background: `${C.amber}14`, border: `3px solid ${C.amber}`, opacity: prog(t, 196.0, 196.8), transform: `scale(${0.92 + 0.08 * eb(t, 196.0, 196.8)})`, textAlign: "center" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.amber, marginTop: 22 }}>(b.sales ÷ g.total) × 100</div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, direction: "rtl", marginTop: 8 }}>نسبة مساهمة كل فرع في إجمالي الشركة</div>
        </div>
      )}

      {/* derived table b */}
      {(() => {
        const e = eb(t, 188.4, 189.2);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 1110, top: 150, width: 740, height: 230, opacity: Math.min(1, e * 1.4), transform: `translateX(${(1 - Math.min(1, e)) * 120}px)`, borderRadius: 20, background: C.card2, border: `3px solid ${C.blue}` }}>
            <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.blue }}>
              <span>b · sales per branch</span>
              <span style={{ color: C.dim }}>derived</span>
            </div>
            {BR.map(([n, v], i) => (
              <div key={n} style={{ position: "absolute", left: 18, top: 54 + i * 41, width: 704, height: 36, display: "flex", justifyContent: "space-between", padding: "0 14px", borderRadius: 8, background: `${C.blue}16`, fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "36px", color: C.text, opacity: prog(t, 189.2 + i * 0.4, 189.7 + i * 0.4) }}>
                <span>{n}</span>
                <span style={{ color: "#7DD3FC" }}>{fmt(v)}</span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* derived table g */}
      {(() => {
        const e = eb(t, 191.2, 192.0);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 1110, top: 396, width: 740, height: 92, opacity: Math.min(1, e * 1.4), transform: `translateX(${(1 - Math.min(1, e)) * 120}px)`, borderRadius: 20, background: C.card2, border: `3px solid ${C.violet}` }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.violet, margin: "8px 0 0 22px" }}>g · company total</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.text, margin: "0 0 0 22px" }}>{fmt(TOTAL * eo(t, 192.7, 194.0))}</div>
          </div>
        );
      })()}

      {/* contribution matrix */}
      {t > 196.6 && (
        <div style={{ position: "absolute", left: 1110, top: 506, width: 740, height: 336, opacity: eo(t, 196.6, 197.4), transform: `translateY(${(1 - eo(t, 196.6, 197.6)) * 60}px)`, borderRadius: 20, background: "#0B1222", border: `3px solid ${C.green}` }}>
          <div style={{ height: 44, display: "grid", gridTemplateColumns: "1.1fr 1fr 1.3fr", alignItems: "center", padding: "0 22px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.green }}>
            <span>branch_name</span>
            <span>sales</span>
            <span>contribution_pct</span>
          </div>
          {BR.map(([n, v, p], i) => {
            const a = 197.6 + i * 0.5;
            const e = eb(t, a, a + 0.6);
            const cnt = eo(t, a + 0.2, a + 1.6);
            return (
              <div key={n} style={{ position: "absolute", left: 14, top: 54 + i * 66, width: 712, height: 58, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - Math.min(1, e)) * 100}px)`, borderRadius: 12, background: `${C.green}${t > 202 ? "1E" : "10"}`, border: `2px solid ${t > 202 ? C.green : C.line}`, display: "grid", gridTemplateColumns: "1.1fr 1fr 1.3fr", alignItems: "center", padding: "0 12px", fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.text }}>
                <span>{n}</span>
                <span style={{ color: "#7DD3FC" }}>{fmt(v)}</span>
                <span style={{ position: "relative", color: "#6EE7B7" }}>
                  <span style={{ position: "absolute", left: -6, top: 14, width: `${p * 2.2 * cnt}px`, height: 6, borderRadius: 3, background: C.green, opacity: 0.55 }} />
                  <span style={{ position: "relative" }}>{(p * cnt).toFixed(2)}%</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* financial seal */}
      {stamp > 0 && (
        <div style={{ position: "absolute", left: 1480, top: 560, width: 340, height: 100, borderRadius: 14, border: `6px solid ${C.green}`, color: C.green, fontFamily: MONO, fontWeight: 700, fontSize: 26, textAlign: "center", lineHeight: "44px", paddingTop: 4, background: "#0B1222E0", transform: `rotate(-8deg) scale(${1.6 - 0.6 * stamp})`, opacity: Math.min(1, stamp * 1.5) * (1 - prog(t, 212.4, 213.0)) }}>
          FINANCIAL SHARE
          <br />
          APPROVED ✓
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={178.4} b={197.0} color={C.blue} fs={26}>
        Enterprise Derived Tables ──► Aggregates Branch Metrics &amp; Global Totals
      </Banner>
      <Banner x={70} y={900} w={1780} a={197.4} b={213.5} color={C.green} fs={25}>
        Contribution Matrix ──► Computes Exact Market Share &amp; Financial Percentage
      </Banner>
    </AbsoluteFill>
  );
};
