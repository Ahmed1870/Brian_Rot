import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner } from "../components/common";
import { C, eb, eio, eo, fmt, prog, useT, win } from "../lib";

const RAW = ["customer_id", "email", "city", "order_date", "status", "total_amount"];
const EXPOSED = ["customer_id", "total_orders", "total_spent"];
const ST = [
  { x: 90, k: "1 · FROM", s: "inner subquery", a: 94.2, c: C.blue },
  { x: 690, k: "2 · WHERE", s: "outer query", a: 105.3, c: C.amber },
  { x: 1290, k: "3 · SELECT", s: "outer query", a: 116.3, c: C.green },
];
const RY = 300, ROWH = 52;
const PROBES = [119.5, 122.0, 123.9];

const probe = (t: number, a: number) => {
  const dt = t - a;
  if (dt < 0 || dt > 1.9) return null;
  if (dt < 0.9) return { x: 1280 - (1280 - 668) * eio(dt, 0, 0.9), o: 1, hit: 0 };
  if (dt < 1.2) return { x: 668, o: 1, hit: 1 - (dt - 0.9) / 0.3 };
  const p = (dt - 1.2) / 0.7;
  return { x: 668 + (1000 - 668) * p, o: 1 - p, hit: 0 };
};

export const Scene3: React.FC = () => {
  const t = useT();
  const barrier = eb(t, 106.5, 107.2);
  const hitNow = PROBES.map((a) => probe(t, a)).find((p) => p && p.hit > 0);
  const emailY = RY + 70 + 1 * ROWH + 22;

  return (
    <AbsoluteFill>
      {/* pipeline stations */}
      {ST.map((s, i) => {
        const e = eb(t, 89.4 + i * 0.3, 90.1 + i * 0.3);
        const lit = t >= s.a;
        return e > 0 ? (
          <div
            key={s.k}
            style={{
              position: "absolute",
              left: s.x,
              top: 150,
              width: 540,
              height: 84,
              opacity: Math.min(1, e * 1.5),
              transform: `translateY(${(1 - Math.min(1, e)) * -40}px)`,
              borderRadius: 20,
              background: lit ? `${s.c}22` : "#111B30",
              border: `${lit ? 4 : 2}px solid ${lit ? s.c : C.line}`,
              boxShadow: lit ? `0 0 18px ${s.c}66` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
            }}
          >
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: lit ? s.c : C.text }}>{s.k}</span>
            <span style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>{s.s}</span>
          </div>
        ) : null;
      })}
      {[0, 1].map((i) => (
        <div key={i} style={{ position: "absolute", left: 90 + 540 + i * 600 + 6, top: 186, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.dim, opacity: prog(t, 90.6, 91.2) }}>
          ➔
        </div>
      ))}

      {/* raw table */}
      {(() => {
        const e = eo(t, 90.0, 91.0);
        return (
          <div style={{ position: "absolute", left: 90, top: RY, width: 470, height: 420, opacity: e, transform: `translateX(${(1 - e) * -120}px)`, borderRadius: 24, background: C.card2, border: `2px solid ${C.line}` }}>
            <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim }}>orders · raw table · disk</div>
            {RAW.map((c, i) => {
              const isEmail = c === "email";
              const flash = isEmail && hitNow ? hitNow.hit : 0;
              return (
                <div
                  key={c}
                  style={{
                    position: "absolute",
                    left: 18,
                    top: 70 + i * ROWH,
                    width: 434,
                    height: 44,
                    borderRadius: 10,
                    background: flash > 0 ? `${C.red}33` : "#1B2740",
                    border: `2px solid ${flash > 0 ? C.red : C.line}`,
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 21,
                    lineHeight: "40px",
                    paddingLeft: 16,
                    color: C.text,
                  }}
                >
                  {c}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* barrier */}
      {barrier > 0 && (
        <div
          style={{
            position: "absolute",
            left: 610,
            top: RY - 10,
            width: 34,
            height: 440,
            opacity: Math.min(1, barrier * 1.4),
            transform: `scaleY(${0.3 + 0.7 * Math.min(1, barrier)})`,
            borderRadius: 14,
            background: `${C.red}${hitNow ? "55" : "26"}`,
            border: `3px solid ${C.red}`,
          }}
        />
      )}

      {/* derived card */}
      {(() => {
        const e = eb(t, 97.0, 97.8);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 720, top: RY, width: 470, height: 420, opacity: Math.min(1, e * 1.4), transform: `scale(${0.85 + 0.15 * Math.min(1, e)})`, borderRadius: 24, background: C.card2, border: `3px solid ${C.blue}`, boxShadow: `0 0 18px ${C.blue}44` }}>
            <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.blue }}>customer_summary · RAM</div>
            {EXPOSED.map((c, i) => {
              const a = 97.7 + i * 0.5;
              const r = eb(t, a, a + 0.5);
              const lit = t > 114.4 && t < 118.0;
              return (
                <div
                  key={c}
                  style={{
                    position: "absolute",
                    left: 18,
                    top: 70 + i * 62,
                    width: 434,
                    height: 50,
                    opacity: Math.min(1, r * 1.5),
                    transform: `translateX(${(1 - Math.min(1, r)) * 80}px)`,
                    borderRadius: 10,
                    background: lit ? `${C.green}33` : `${C.blue}22`,
                    border: `2.5px solid ${lit ? C.green : C.blue}`,
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 23,
                    lineHeight: "45px",
                    paddingLeft: 16,
                    color: C.text,
                  }}
                >
                  {c}
                </div>
              );
            })}
            {t > 100.1 && (
              <div style={{ position: "absolute", left: 18, bottom: 16, width: 434, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.green, opacity: prog(t, 100.1, 100.7) }}>
                materialized in memory ✓
              </div>
            )}
          </div>
        );
      })()}

      {/* outer query */}
      {(() => {
        const e = eb(t, 102.5, 103.3);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 1290, top: RY, width: 540, height: 420, opacity: Math.min(1, e * 1.4), transform: `translateX(${(1 - Math.min(1, e)) * 140}px)`, borderRadius: 24, background: "#0B1222", border: `2px solid ${C.amber}` }}>
            <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.amber }}>outer query</div>
            <div style={{ padding: "22px 24px", fontFamily: MONO, fontWeight: 500, fontSize: 22, lineHeight: 1.7, color: C.text, whiteSpace: "pre" }}>
              <span style={{ color: C.blue, fontWeight: 700 }}>SELECT</span> customer_id, total_spent{"\n"}
              <span style={{ color: C.blue, fontWeight: 700 }}>FROM</span> customer_summary{"\n"}
              <span style={{ color: C.blue, fontWeight: 700 }}>WHERE</span> total_spent &gt; 1000;
            </div>
            {t > 111.0 && (
              <div style={{ position: "absolute", left: 24, bottom: 20, width: 492, fontFamily: AR, fontWeight: 700, fontSize: 26, color: C.green, direction: "rtl", textAlign: "right", opacity: prog(t, 111.0, 111.8) }}>
                بيشوف الأعمدة المعرّضة صراحةً بس
              </div>
            )}
          </div>
        );
      })()}

      {/* green probe (allowed) */}
      {t > 112.0 && t < 114.2 && (
        <div style={{ position: "absolute", left: 1280 - (1280 - 1170) * eio(t, 112.0, 113.4), top: RY + 70 + 2 * 62 + 12, width: 120, height: 28, borderRadius: 14, background: C.green, color: "#07101F", fontFamily: MONO, fontWeight: 700, fontSize: 16, textAlign: "center", lineHeight: "28px", opacity: win(t, 112.0, 114.2, 0.25) }}>
          total_spent ✓
        </div>
      )}
      {/* red probes (blocked) */}
      {PROBES.map((a) => {
        const p = probe(t, a);
        if (!p || p.o <= 0) return null;
        return (
          <div key={a} style={{ position: "absolute", left: p.x, top: emailY - 14, width: 110, height: 28, opacity: p.o, borderRadius: 14, background: p.hit > 0 || p.o < 1 ? C.red : C.blue, color: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: 16, textAlign: "center", lineHeight: "28px", boxShadow: `0 0 12px ${p.hit > 0 || p.o < 1 ? C.red : C.blue}` }}>
            {p.hit > 0 || p.o < 1 ? "email ✕" : "email ?"}
          </div>
        );
      })}

      {/* scope title */}
      {win(t, 107.2, 111.6, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 610, top: 246, width: 700, height: 50, opacity: win(t, 107.2, 111.6, 0.4), borderRadius: 999, border: `2.5px solid ${C.blue}`, background: "#0B1B33", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 26, lineHeight: "46px", color: C.blue }}>
          Scope of Visibility
        </div>
      )}

      {/* protection */}
      {[
        { a: 125.7, x: 560, s: "DATA PROTECTION ✓", c: C.green, w: 410 },
        { a: 127.2, x: 990, s: "MEMORY ▼", c: C.amber, w: 300 },
      ].map((p) => {
        const e = eb(t, p.a, p.a + 0.5);
        return e > 0 ? (
          <div key={p.s} style={{ position: "absolute", left: p.x, top: 752, width: p.w, height: 60, opacity: Math.min(1, e * 1.5), transform: `scale(${0.8 + 0.2 * Math.min(1, e)})`, borderRadius: 16, background: `${p.c}1A`, border: `3px solid ${p.c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 26, lineHeight: "54px", color: p.c }}>
            {p.s}
          </div>
        ) : null;
      })}

      <Banner x={70} y={900} w={1780} a={90.2} b={106.0} color={C.blue} fs={26}>
        Execution Order: Inner Subquery Materializes FIRST in FROM Stage
      </Banner>
      <Banner x={70} y={900} w={1780} a={106.6} b={129.3} color={C.red} fs={25}>
        Scope of Visibility ──► Outer Query Can ONLY Access Exposed Subquery Columns
      </Banner>
      <div style={{ display: "none" }}>{fmt(0)}</div>
    </AbsoluteFill>
  );
};
