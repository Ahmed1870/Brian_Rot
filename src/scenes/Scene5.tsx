import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, prog, typed, useT, win } from "../lib";

const LINES: [string, number, number][] = [
  ["SELECT product_id,", 180.4, 181.6],
  ["       COALESCE(product_name, 'Uncategorized') AS clean_name,", 181.8, 184.4],
  ["       ROUND(revenue / NULLIF(units_sold, 0), 2) AS avg_unit_price,", 184.4, 187.3],
  ["       GREATEST(discounted_price, min_allowed_price) AS final_price", 187.5, 190.0],
  ["FROM product_financials;", 190.0, 191.0],
];
// product_id, clean_name, avg_unit_price, final_price
const REP: { id: string; name: string; nameFix: boolean; avg: string; avgNull: boolean; fin: string; floor: boolean }[] = [
  { id: "P-101", name: "Laptop Pro", nameFix: false, avg: "1,250.00", avgNull: false, fin: "1,100", floor: true },
  { id: "P-102", name: "Uncategorized", nameFix: true, avg: "45.50", avgNull: false, fin: "62", floor: false },
  { id: "P-103", name: "Keyboard", nameFix: false, avg: "NULL", avgNull: true, fin: "35", floor: true },
  { id: "P-104", name: "Monitor Z", nameFix: false, avg: "360.00", avgNull: false, fin: "380", floor: false },
];
const COLS = [
  { k: "product_id", w: 110 },
  { k: "clean_name", w: 190 },
  { k: "avg_unit_price", w: 190 },
  { k: "final_price", w: 150 },
];
const HL = [
  { row: 2, a: 188.5, b: 192.2, c: C.green },
  { row: 1, a: 194.3, b: 197.0, c: C.blue },
  { row: 3, a: 197.3, b: 200.6, c: C.amber },
];

export const Scene5: React.FC = () => {
  const t = useT();
  const typing = t > 180.4 && t < 191.1;
  const caret = LINES.findIndex(([, a, b]) => t >= a && t < b);
  const intro = win(t, 175.8, 180.4, 0.5);
  const stamp = eb(t, 204.0, 204.6);

  return (
    <AbsoluteFill>
      {intro > 0 && (
        <div style={{ position: "absolute", left: 160, top: 300, width: 1600, textAlign: "center", opacity: intro }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 175.8, 176.9)) * 40}px)` }}>
            التطبيقات <span style={{ color: C.green }}>المالية</span> والمؤسسية
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.blue, marginTop: 16 }}>manzooma_store_db · protected financial report</div>
        </div>
      )}

      {t > 179.8 && (
        <div style={{ opacity: eo(t, 179.8, 180.5), transform: `translateX(${(1 - eo(t, 179.8, 180.7)) * -100}px)` }}>
          <Window x={70} y={150} w={1000} h={400} title="executive_pricing_report.sql" glow={typing ? 1 : 0}>
            {HL.map((h) => {
              const o = win(t, h.a, h.b, 0.3);
              return o > 0 ? <div key={h.row} style={{ position: "absolute", left: 10, top: 12 + h.row * 34, width: 970, height: 34, borderRadius: 8, background: `${h.c}22`, border: `2px solid ${h.c}`, opacity: o }} /> : null;
            })}
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

      {/* function chain */}
      {[
        { a: 182.2, s: "COALESCE", c: C.blue },
        { a: 183.0, s: "NULLIF", c: C.green },
        { a: 183.6, s: "GREATEST", c: C.amber },
      ].map((f, i) => {
        const e = eb(t, f.a, f.a + 0.5);
        return e > 0 ? (
          <React.Fragment key={f.s}>
            <div style={{ position: "absolute", left: 70 + i * 360, top: 600, width: 300, height: 76, opacity: Math.min(1, e * 1.5), transform: `scale(${0.8 + 0.2 * Math.min(1, e)})`, borderRadius: 18, background: `${f.c}18`, border: `3px solid ${f.c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, lineHeight: "70px", color: f.c }}>
              {f.s}
            </div>
            {i < 2 && <div style={{ position: "absolute", left: 70 + i * 360 + 308, top: 612, fontFamily: MONO, fontWeight: 700, fontSize: 36, color: C.dim, opacity: Math.min(1, e) }}>+</div>}
          </React.Fragment>
        ) : null;
      })}
      {t > 192.0 && (
        <Arabic3 t={t} />
      )}

      {/* report */}
      {t > 191.0 && (
        <div style={{ opacity: eo(t, 191.0, 191.8), transform: `translateX(${(1 - eo(t, 191.0, 192.0)) * 120}px)` }}>
          <Window x={1110} y={150} w={740} h={560} title="executive_pricing_report" color={C.green} glow={t > 200 ? 1 : 0}>
            <div style={{ position: "absolute", left: 18, top: 14, display: "flex", gap: 8 }}>
              {COLS.map((c) => (
                <div key={c.k} style={{ width: c.w, fontFamily: MONO, fontWeight: 700, fontSize: 16, color: C.blue, borderBottom: `2px solid ${C.blue}66`, paddingBottom: 6 }}>
                  {c.k}
                </div>
              ))}
            </div>
            {REP.map((r, i) => {
              const a = 192.2 + i * 0.6;
              const e = eb(t, a, a + 0.5);
              const showFix = r.nameFix && t > 194.3;
              const showNull = r.avgNull && t > 190.4;
              const showFloor = r.floor && t > 197.3;
              return (
                <div key={r.id} style={{ position: "absolute", left: 12, top: 56 + i * 112, width: 712, height: 100, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - Math.min(1, e)) * 80}px)`, borderRadius: 14, background: "#1B2740", border: `2px solid ${C.line}` }}>
                  <div style={{ position: "absolute", left: 8, top: 10, display: "flex", gap: 8, fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.text }}>
                    <span style={{ width: 110 }}>{r.id}</span>
                    <span style={{ width: 190, color: showFix ? C.blue : C.text }}>{r.name}</span>
                    <span style={{ width: 190, color: r.avgNull ? C.green : "#7DD3FC" }}>{r.avg}</span>
                    <span style={{ width: 150, color: showFloor ? C.amber : "#6EE7B7" }}>{r.fin}</span>
                  </div>
                  <div style={{ position: "absolute", left: 8, top: 56, display: "flex", gap: 8, fontFamily: MONO, fontWeight: 700, fontSize: 14 }}>
                    <span style={{ width: 110 }} />
                    <span style={{ width: 190, color: C.blue, opacity: showFix ? 1 : 0 }}>◂ COALESCE default</span>
                    <span style={{ width: 190, color: C.green, opacity: showNull ? 1 : 0 }}>◂ NULLIF: no crash</span>
                    <span style={{ width: 150, color: C.amber, opacity: showFloor ? 1 : 0 }}>◂ GREATEST floor</span>
                  </div>
                </div>
              );
            })}
          </Window>
        </div>
      )}

      {/* integrity seal */}
      {stamp > 0 && (
        <div style={{ position: "absolute", left: 1470, top: 600, width: 340, height: 100, borderRadius: 14, border: `6px solid ${C.green}`, color: C.green, fontFamily: MONO, fontWeight: 700, fontSize: 25, textAlign: "center", lineHeight: "44px", paddingTop: 4, background: "#0B1222E0", transform: `rotate(-8deg) scale(${1.6 - 0.6 * stamp})`, opacity: Math.min(1, stamp * 1.5) * (1 - prog(t, 214.8, 215.4)) }}>
          FINANCIAL INTEGRITY
          <br />
          VERIFIED ✓
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={178.4} b={200.8} color={C.blue} fs={25}>
        Enterprise Financial Shielding ──► COALESCE + NULLIF + GREATEST Pipeline
      </Banner>
      <Banner x={70} y={900} w={1780} a={201.2} b={216.2} color={C.green} fs={25}>
        Zero Mismatch &amp; Robust Reporting ──► Guaranteed Business Logic Security
      </Banner>
    </AbsoluteFill>
  );
};

const Arabic3: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 70, top: 720, width: 1000, textAlign: "right", fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", opacity: Math.min(prog(t, 192.0, 192.8), 1 - prog(t, 215.0, 215.6)), lineHeight: 1.5 }}>
    {t < 197.3 ? "ضمان عدم القسمة على صفر + قيم نمطية نظيفة" : "سعر أدنى حامي = مفيش بيع أقل من كلفة التوريد"}
  </div>
);
