import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, fmt, prog, typed, useT, win } from "../lib";

const LINES: [string, number, number][] = [
  ["SELECT c.name AS customer, p.name AS product, p.unit_price,", 180.2, 181.0],
  ["       d.discount_pct,", 181.0, 181.3],
  ["       p.unit_price * (1 - d.discount_pct / 100.0) AS net_total", 181.3, 182.0],
  ["FROM customers c", 182.0, 182.4],
  ["JOIN orders o       ON o.customer_id = c.customer_id", 182.4, 183.4],
  ["JOIN order_items oi ON oi.order_id = o.order_id", 183.5, 184.5],
  ["JOIN products p     ON p.product_id = oi.product_id", 184.7, 185.8],
  ["JOIN discounts d    ON p.unit_price BETWEEN d.min_price AND d.max_price", 186.0, 188.0],
  ["                    AND o.region_id = d.region_id;", 188.0, 189.2],
];
const NODES = [
  { n: "customers", a: 181.9 },
  { n: "orders", a: 182.5 },
  { n: "order_items", a: 183.6 },
  { n: "products", a: 184.8 },
  { n: "discounts", a: 186.2 },
];
const NX = (i: number) => 70 + i * 380;
const COLS = [
  { k: "customer", a: 192.2, w: 140 },
  { k: "product", a: 192.8, w: 130 },
  { k: "price", a: 194.0, w: 110 },
  { k: "disc.", a: 195.0, w: 90 },
  { k: "net_total", a: 197.0, w: 160 },
];
// [customer, product, price, pct, net]
const REPORT: [string, string, number, number, number][] = [
  ["Ali Hassan", "Laptop", 1450, 15, 1232.5],
  ["Sara Adel", "Monitor", 780, 10, 702],
  ["Omar Nabil", "Keyboard", 340, 10, 306],
  ["Mona Samir", "Mouse", 120, 5, 114],
];

export const Scene5: React.FC = () => {
  const t = useT();
  const typing = t > 180.2 && t < 189.3;
  const caret = LINES.findIndex(([, a, b]) => t >= a && t < b);
  const intro = win(t, 172.9, 180.4, 0.5);
  const stamp = eb(t, 205.6, 206.2);

  return (
    <AbsoluteFill>
      {/* intro card */}
      {intro > 0 && (
        <div style={{ position: "absolute", left: 160, top: 260, width: 1600, textAlign: "center", opacity: intro }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 68, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 172.9, 174.0)) * 40}px)` }}>
            الاستعلام <span style={{ color: C.green }}>الجبار</span> لمنظومة ستور
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.blue, marginTop: 14 }}>manzooma_store_db · 5-table enterprise pipeline</div>
        </div>
      )}

      {/* editor */}
      {t > 179.6 && (
        <div style={{ opacity: eo(t, 179.6, 180.3), transform: `translateX(${(1 - eo(t, 179.6, 180.5)) * -100}px)` }}>
          <Window x={70} y={150} w={1000} h={470} title="executive_invoice_report.sql" glow={typing ? 1 : 0}>
            {LINES.map(([txt, a, b], i) => {
              const s = typed(txt, t, a, b);
              return s.length > 0 ? (
                <div key={i} style={{ position: "absolute", left: 22, top: 16 + i * 34 }}>
                  <CodeLine text={s} fs={21} caret={caret === i} />
                </div>
              ) : null;
            })}
          </Window>
        </div>
      )}

      {/* report */}
      {t > 189.3 && (
        <div style={{ opacity: eo(t, 189.3, 190.1), transform: `translateX(${(1 - eo(t, 189.3, 190.3)) * 120}px)` }}>
          <Window x={1110} y={150} w={740} h={470} title="invoice_report" color={C.green} glow={t > 197 ? 1 : 0}>
            <div style={{ position: "absolute", left: 20, top: 14, display: "flex", gap: 10 }}>
              {COLS.map((c) => (
                <div key={c.k} style={{ width: c.w, fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.blue, opacity: prog(t, c.a, c.a + 0.4), borderBottom: `2px solid ${C.blue}66`, paddingBottom: 6 }}>
                  {c.k}
                </div>
              ))}
            </div>
            {REPORT.map((r, i) => {
              const a = 195.4 + i * 0.45;
              const e = eb(t, a, a + 0.5);
              const cnt = eo(t, 197.0 + i * 0.2, 198.4 + i * 0.2);
              return e > 0 ? (
                <div
                  key={r[0]}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 62 + i * 66,
                    width: 712,
                    height: 56,
                    opacity: Math.min(1, e * 1.5),
                    transform: `translateX(${(1 - Math.min(1, e)) * 80}px)`,
                    borderRadius: 12,
                    background: `${C.green}${t > 198.4 ? "18" : "0E"}`,
                    border: `2px solid ${t > 198.4 ? C.green : C.line}`,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    paddingLeft: 6,
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 19,
                    color: C.text,
                  }}
                >
                  <span style={{ width: 140 }}>{r[0]}</span>
                  <span style={{ width: 130 }}>{r[1]}</span>
                  <span style={{ width: 110, color: C.blue }}>{fmt(r[2])}</span>
                  <span style={{ width: 90, color: C.amber }}>{r[3]}%</span>
                  <span style={{ width: 160, color: "#6EE7B7" }}>{(r[4] * cnt).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ) : null;
            })}
            {t > 203.5 && (
              <div style={{ position: "absolute", left: 20, top: 340, padding: "8px 24px", borderRadius: 999, border: `2.5px solid ${C.green}`, background: `${C.green}18`, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.green, opacity: prog(t, 203.5, 204.0), transform: `scale(${0.8 + 0.2 * eb(t, 203.5, 204.1)})`, transformOrigin: "left center" }}>
                ⚡ &lt; 1 ms
              </div>
            )}
            {t > 207.0 && (
              <div style={{ position: "absolute", left: 220, top: 340, padding: "8px 24px", borderRadius: 999, border: `2.5px solid ${C.green}`, background: `${C.green}18`, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.green, opacity: prog(t, 207.0, 207.5), transform: `scale(${0.8 + 0.2 * eb(t, 207.0, 207.6)})`, transformOrigin: "left center" }}>
                ZERO-GAP ✓
              </div>
            )}
          </Window>
        </div>
      )}

      {/* stamp */}
      {stamp > 0 && (
        <div
          style={{
            position: "absolute",
            left: 1480,
            top: 430,
            width: 330,
            height: 100,
            borderRadius: 14,
            border: `6px solid ${C.green}`,
            color: C.green,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            textAlign: "center",
            lineHeight: "46px",
            paddingTop: 2,
            background: "#0B1222E0",
            transform: `rotate(-8deg) scale(${1.6 - 0.6 * stamp})`,
            opacity: Math.min(1, stamp * 1.5) * (1 - prog(t, 210.0, 210.5)),
          }}
        >
          EXECUTIVE
          <br />
          APPROVED ✓
        </div>
      )}

      {/* table nodes + 5 laser streams (small svg) */}
      <svg width={1780} height={90} viewBox="70 630 1780 90" style={{ position: "absolute", left: 70, top: 630 }}>
        {NODES.map((nd, i) => {
          const e = prog(t, nd.a, nd.a + 0.5);
          if (e <= 0) return null;
          const cx = NX(i) + 130;
          const tx = 1190 + i * 130;
          return (
            <path
              key={nd.n}
              d={`M ${cx} 700 C ${cx} 664, ${tx} 690, ${tx} 636`}
              fill="none"
              stroke={C.green}
              strokeWidth={4}
              strokeDasharray="12 10"
              strokeDashoffset={-(t - nd.a) * 120}
              opacity={e * (t > 189.3 ? 1 : 0.35)}
            />
          );
        })}
      </svg>
      {NODES.map((nd, i) => {
        const e = eb(t, nd.a, nd.a + 0.6);
        if (e <= 0) return null;
        return (
          <div
            key={nd.n}
            style={{
              position: "absolute",
              left: NX(i),
              top: 700,
              width: 260,
              height: 62,
              opacity: Math.min(1, e * 1.5),
              transform: `translateY(${(1 - Math.min(1, e)) * 40}px)`,
              borderRadius: 14,
              background: `${C.blue}1A`,
              border: `2.5px solid ${C.blue}`,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 22,
              lineHeight: "56px",
              textAlign: "center",
              color: C.text,
            }}
          >
            {i + 1} · {nd.n}
          </div>
        );
      })}

      <Banner x={70} y={900} w={1780} a={173.0} b={189.6} color={C.blue} fs={24}>
        5-Table Enterprise Pipeline ──► Customers ➔ Orders ➔ Items ➔ Products ➔ Discounts
      </Banner>
      <Banner x={70} y={900} w={1780} a={199.8} b={210.4} color={C.green} fs={24}>
        Sub-Millisecond Executive Reporting ──► Complete Zero-Gap Financial Breakdown
      </Banner>
    </AbsoluteFill>
  );
};
