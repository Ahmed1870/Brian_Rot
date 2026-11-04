import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Arabic, Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, fmt, prog, typed, useT, win } from "../lib";

const ROWS: [number, number][] = [
  [101, 1850],
  [102, 920],
  [103, 2400],
  [104, 610],
];
const CX = 1130, CY = 190, CW = 720, CH = 380;

export const Scene1: React.FC = () => {
  const t = useT();
  const L = [
    typed("SELECT customer_id, total_spent", t, 15.8, 17.0),
    typed("FROM (", t, 17.1, 17.8),
    typed("  SELECT customer_id, SUM(total_amount) AS total_spent", t, 18.0, 20.6),
    typed("  FROM orders", t, 20.6, 21.4),
    typed("  GROUP BY customer_id", t, 21.4, 22.6),
    typed(")", t, 22.6, 22.9) + typed(" AS customer_summary;", t, 33.9, 35.4),
  ];
  const caret = t < 17.1 ? 0 : t < 18.0 ? 1 : t < 20.6 ? 2 : t < 21.4 ? 3 : t < 22.6 ? 4 : t < 33.9 ? -1 : 5;
  const typing = (t > 15.8 && t < 22.9) || (t > 33.9 && t < 35.5);
  const box = eo(t, 19.0, 20.2);
  const card = eb(t, 20.5, 21.3);
  const alias = eb(t, 34.8, 35.5);

  return (
    <AbsoluteFill>
      {/* top badge 2s–18s */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 116,
          width: 1000,
          height: 58,
          opacity: win(t, 2.0, 18.0, 0.6),
          transform: `translateY(${(1 - prog(t, 2.0, 2.7)) * -24}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          borderRadius: 999,
          border: `2px solid ${C.blue}88`,
          background: "#0B1B33",
        }}
      >
        <span style={{ fontFamily: AR, fontWeight: 900, fontSize: 30, color: C.text, direction: "rtl" }}>الجداول المشتقة</span>
        <span style={{ color: C.blue, fontSize: 26 }}>|</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.blue }}>Derived Tables (Subqueries in FROM)</span>
      </div>

      {/* intro: where we are */}
      {win(t, 5.6, 18.0, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 230, width: 1000, opacity: win(t, 5.6, 18.0, 0.5) }}>
          <Arabic x={0} y={0} w={1000} fs={38} color={C.text} o={prog(t, 5.6, 6.4)}>
            اتعلمنا الاستعلامات الفرعية في:
          </Arabic>
          {[
            { a: 8.7, k: "SELECT", c: C.green, ok: true },
            { a: 9.9, k: "WHERE", c: C.green, ok: true },
            { a: 14.6, k: "FROM", c: C.blue, ok: false },
          ].map((p, i) => {
            const e = eb(t, p.a, p.a + 0.5);
            return (
              <div
                key={p.k}
                style={{
                  position: "absolute",
                  left: i * 330,
                  top: 110,
                  width: 300,
                  height: 110,
                  opacity: Math.min(1, e * 1.5),
                  transform: `scale(${0.8 + 0.2 * Math.min(1, e)})`,
                  borderRadius: 22,
                  background: `${p.c}18`,
                  border: `3px solid ${p.c}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: p.c, marginTop: 14 }}>{p.k}</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: p.ok ? C.green : C.blue }}>{p.ok ? "subquery ✓" : "subquery ?"}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* editor */}
      {t > 15.0 && (
        <div style={{ opacity: eo(t, 15.0, 15.8), transform: `translateX(${(1 - eo(t, 15.0, 15.9)) * -120}px)` }}>
          <Window x={70} y={190} w={1000} h={380} title="customer_summary.sql" glow={typing ? 1 : 0}>
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 88,
                width: 880,
                height: 126,
                borderRadius: 14,
                border: `3px solid ${C.blue}`,
                background: `${C.blue}10`,
                opacity: box * (t > 23.5 ? 0.55 : 1),
                transform: `scaleY(${0.3 + 0.7 * box})`,
                transformOrigin: "top",
              }}
            />
            {L.map((s, i) =>
              s.length > 0 ? (
                <div key={i} style={{ position: "absolute", left: 28, top: 18 + i * 38 }}>
                  <CodeLine text={s} fs={24} caret={caret === i} />
                </div>
              ) : null,
            )}
          </Window>
        </div>
      )}

      {/* virtual temp table card */}
      {card > 0 && (
        <div
          style={{
            position: "absolute",
            left: CX,
            top: CY,
            width: CW,
            height: CH,
            opacity: Math.min(1, card * 1.4),
            transform: `translateX(${(1 - Math.min(1, card)) * -260}px) scale(${0.7 + 0.3 * Math.min(1, card)})`,
            transformOrigin: "left center",
            borderRadius: 26,
            background: C.card2,
            border: `3px solid ${C.blue}`,
            boxShadow: `0 0 20px ${C.blue}55`,
          }}
        >
          <div style={{ height: 62, display: "flex", alignItems: "center", padding: "0 26px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.blue }}>
            virtual temp table · in memory
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "14px 40px 6px", fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.dim }}>
            <span>customer_id</span>
            <span style={{ textAlign: "right" }}>total_spent</span>
          </div>
          {ROWS.map(([id, v], i) => {
            const e = eb(t, 21.0 + i * 0.35, 21.6 + i * 0.35);
            return (
              <div
                key={id}
                style={{
                  position: "absolute",
                  left: 24,
                  top: 124 + i * 62,
                  width: CW - 48,
                  height: 52,
                  opacity: Math.min(1, e * 1.5),
                  transform: `translateX(${(1 - Math.min(1, e)) * 100}px)`,
                  borderRadius: 12,
                  background: `${C.blue}18`,
                  border: `2px solid ${C.blue}77`,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  padding: "0 16px",
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 24,
                  color: C.text,
                }}
              >
                <span>{id}</span>
                <span style={{ textAlign: "right", color: "#7DD3FC" }}>{fmt(v * eo(t, 21.2 + i * 0.35, 22.2 + i * 0.35))}</span>
              </div>
            );
          })}
        </div>
      )}
      {/* derived / inline view labels */}
      {[
        { a: 22.5, s: "Derived Table", c: C.blue },
        { a: 23.7, s: "Inline View", c: C.violet },
      ].map((p, i) => {
        const e = eb(t, p.a, p.a + 0.5);
        return e > 0 ? (
          <div key={p.s} style={{ position: "absolute", left: CX + i * 250, top: CY + CH + 18, padding: "8px 22px", borderRadius: 999, border: `2.5px solid ${p.c}`, background: `${p.c}18`, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: p.c, opacity: Math.min(1, e * 1.5), transform: `scale(${0.8 + 0.2 * Math.min(1, e)})` }}>
            {p.s}
          </div>
        ) : null;
      })}
      {/* alias tag */}
      {alias > 0 && (
        <div
          style={{
            position: "absolute",
            left: CX + CW - 340,
            top: CY - 28,
            width: 330,
            height: 50,
            borderRadius: 999,
            background: C.green,
            color: "#07101F",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 22,
            lineHeight: "50px",
            textAlign: "center",
            opacity: Math.min(1, alias * 1.5),
            transform: `scale(${1.6 - 0.6 * Math.min(1, alias)})`,
            boxShadow: `0 0 ${Math.round(20 - 10 * Math.min(1, alias))}px ${C.green}`,
          }}
        >
          AS customer_summary
        </div>
      )}
      {/* outer query reads through the alias */}
      {t > 40.0 && (
        <>
          <div style={{ position: "absolute", left: 1074, top: 276, width: 56, height: 0, borderTop: `4px dashed ${C.green}`, opacity: prog(t, 40.0, 40.5) }} />
          <div style={{ position: "absolute", left: CX, top: CY + CH + 18 + 64, width: 720, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, opacity: prog(t, 40.0, 40.6) }}>
            customer_summary.total_spent ✓
          </div>
        </>
      )}

      {/* strict rule */}
      {win(t, 24.8, 30.4, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 620, width: 1000, height: 110, borderRadius: 22, background: `${C.amber}16`, border: `3px solid ${C.amber}`, opacity: win(t, 24.8, 30.4, 0.4), transform: `scale(${0.9 + 0.1 * eb(t, 24.8, 25.4)})`, textAlign: "center" }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 40, color: C.amber, direction: "rtl", marginTop: 8 }}>⚠ قاعدة هندسية صارمة</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.text }}>every derived table must have an alias</div>
        </div>
      )}
      {t > 30.6 && (
        <Arabic x={70} y={620} w={1000} fs={34} color={C.text} o={Math.min(prog(t, 30.6, 31.4), 1)}>
          الـ <span style={{ color: C.green, fontFamily: MONO }}>Alias</span> بيعرّف الجدول في الذاكرة، وبيخلّي الاستعلام الخارجي يوصل لأعمدته
        </Arabic>
      )}

      <Banner x={70} y={900} w={1780} a={22.0} b={43.8} color={C.blue} fs={26}>
        FROM (Subquery) AS alias ──► Mandatory Table Alias in PostgreSQL
      </Banner>
    </AbsoluteFill>
  );
};
