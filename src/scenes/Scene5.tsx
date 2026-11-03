import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, fmt, prog, typed, useT, win } from "../lib";

const CATS = ["Electronics", "Fashion", "Beauty", "Grocery"];
const YEARS = [2023, 2024, 2025];
const DATA = [
  [38200, 62500, 98400],
  [27900, 54300, 71200],
  [12100, 33800, 58900],
  [9400, 21700, 44600],
];
const MAX = 98400;
const GX = 1010, GY = 214, LABW = 200, CW = 200, CH = 88, GAP = 8;
const cellX = (c: number) => GX + LABW + 10 + c * (CW + 10);
const cellY = (r: number) => GY + r * (CH + GAP);

// ranked result (year DESC, total DESC) among cells >= 50,000
const RANKED = [
  { y: 2025, cat: "Electronics", v: 98400, r: 0, c: 2 },
  { y: 2025, cat: "Fashion", v: 71200, r: 1, c: 2 },
  { y: 2025, cat: "Beauty", v: 58900, r: 2, c: 2 },
  { y: 2024, cat: "Electronics", v: 62500, r: 0, c: 1 },
  { y: 2024, cat: "Fashion", v: 54300, r: 1, c: 1 },
];

const hex = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");

const EX = 70, EY = 140, EW = 900, EH = 450;
const rowTop = (i: number) => 18 + i * 38;

export const Scene5: React.FC = () => {
  const t = useT();

  const L = [
    typed("SELECT category_id,", t, 176.0, 177.2),
    typed("       EXTRACT(YEAR FROM order_date) AS order_year,", t, 177.2, 179.6),
    typed("       SUM(total_amount) AS total_sales", t, 179.6, 181.4),
    typed("FROM orders", t, 181.4, 182.2),
    typed("GROUP BY category_id, order_year", t, 183.3, 186.6),
    typed("HAVING SUM(total_amount) > 50000", t, 197.6, 199.6),
    typed("ORDER BY order_year DESC, total_sales DESC;", t, 199.6, 202.2),
  ];
  const caretRow = L.findIndex((s, i) => s.length > 0 && (i === 6 || L[i + 1].length === 0));
  const typing = (t > 176 && t < 186.8) || (t > 197.6 && t < 202.4);

  const rowGlow = win(t, 186.8, 188.7, 0.3);
  const colGlow = win(t, 188.9, 190.8, 0.3);
  const filterT = prog(t, 200.5, 201.5);
  const gridOn = eo(t, 175.4, 176.8);
  const stamp = eb(t, 205.6, 206.2);
  const kpi = win(t, 208.6, 213.2, 0.4);

  return (
    <AbsoluteFill>
      {/* editor */}
      <div style={{ opacity: eo(t, 175.3, 176.0), transform: `translateX(${(1 - eo(t, 175.3, 176.2)) * -120}px)` }}>
        <Window x={EX} y={EY} w={EW} h={EH} title="enterprise_report.sql" glow={typing ? 1 : 0}>
          {L.map((s, i) =>
            s.length > 0 ? (
              <div key={i} style={{ position: "absolute", left: 24, top: rowTop(i) }}>
                <CodeLine text={s} fs={24} caret={typing && i === caretRow} />
              </div>
            ) : null,
          )}
        </Window>
      </div>

      {/* grid title */}
      <div style={{ position: "absolute", left: GX, top: 122, width: 840, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.dim, opacity: gridOn }}>
        analytics matrix · category × order_year
      </div>

      {/* year headers */}
      {YEARS.map((y, c) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: cellX(c),
            top: 158,
            width: CW,
            height: 48,
            opacity: gridOn,
            borderRadius: 12,
            background: colGlow > 0 ? `${C.blue}30` : "#111B30",
            border: `2px solid ${colGlow > 0 ? C.blue : C.line}`,
            boxShadow: colGlow > 0 ? `0 0 ${Math.min(20, 24 * colGlow)}px ${C.blue}` : "none",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 26,
            lineHeight: "44px",
            color: colGlow > 0 ? C.blue : C.text,
            textAlign: "center",
          }}
        >
          {y}
        </div>
      ))}
      {/* category labels */}
      {CATS.map((n, r) => (
        <div
          key={n}
          style={{
            position: "absolute",
            left: GX,
            top: cellY(r),
            width: LABW,
            height: CH,
            opacity: gridOn,
            borderRadius: 14,
            background: rowGlow > 0 ? `${C.blue}30` : "#111B30",
            border: `2px solid ${rowGlow > 0 ? C.blue : C.line}`,
            boxShadow: rowGlow > 0 ? `0 0 ${Math.min(20, 24 * rowGlow)}px ${C.blue}` : "none",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 23,
            lineHeight: `${CH - 4}px`,
            color: rowGlow > 0 ? C.blue : C.text,
            textAlign: "center",
          }}
        >
          {n}
        </div>
      ))}
      {/* cells */}
      {DATA.map((row, r) =>
        row.map((v, c) => {
          const idx = r * 3 + c;
          const a = 192.0 + idx * 0.3;
          const e = eo(t, a, a + 0.9);
          const pass = v >= 50000;
          const heat = 0.14 + 0.5 * (v / MAX);
          const bg = filterT > 0 ? (pass ? `${C.green}${hex(0.16 + 0.3 * (v / MAX))}` : "#0B1222") : e > 0 ? `${C.blue}${hex(heat)}` : "transparent";
          const border = filterT > 0 ? (pass ? C.green : C.line) : e > 0 ? `${C.blue}99` : `${C.line}`;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: cellX(c),
                top: cellY(r),
                width: CW,
                height: CH,
                opacity: gridOn * (filterT > 0 && !pass ? 1 - 0.65 * filterT : 1),
                borderRadius: 14,
                background: bg,
                border: `${filterT > 0 && pass ? 3 : 2}px ${e > 0 ? "solid" : "dashed"} ${border}`,
                boxShadow: filterT > 0 && pass ? `0 0 ${Math.min(20, 22 + 8 * Math.sin(t * 4 + idx))}px ${C.green}77` : "none",
                textAlign: "center",
                transform: `scale(${0.9 + 0.1 * Math.min(1, e)})`,
              }}
            >
              {e > 0 && (
                <>
                  <div style={{ fontFamily: MONO, fontSize: 15, color: C.dim, marginTop: 8 }}>SUM</div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontWeight: 700,
                      fontSize: 31,
                      color: filterT > 0 ? (pass ? "#6EE7B7" : C.red) : C.text,
                      textDecoration: filterT > 0 && !pass ? "line-through" : "none",
                    }}
                  >
                    {fmt(v * e)}
                  </div>
                </>
              )}
            </div>
          );
        }),
      )}

      {/* HAVING threshold tag */}
      {filterT > 0 && (
        <div style={{ position: "absolute", left: GX + LABW + 10, top: 590 + 16, width: 630, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.green, opacity: filterT }}>
          HAVING &gt; 50,000 → 5 of 12 groups survive
        </div>
      )}

      {/* ranked report */}
      {t > 202.4 && (
        <div style={{ position: "absolute", left: 70, top: 628, width: 900 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim, opacity: prog(t, 202.4, 203.0), marginBottom: 10 }}>
            ORDER BY order_year DESC, total_sales DESC
          </div>
          {RANKED.map((r, i) => {
            const a = 202.8 + i * 0.55;
            const e = eb(t, a, a + 0.6);
            return (
              <div
                key={i}
                style={{
                  height: 56,
                  marginBottom: 8,
                  opacity: Math.min(1, e * 1.4),
                  transform: `translateX(${(1 - Math.min(1, e)) * 420}px)`,
                  borderRadius: 14,
                  background: `${C.green}${hex(0.12 + 0.14 * (r.v / MAX))}`,
                  border: `2.5px solid ${C.green}`,
                  boxShadow: `0 0 20px ${C.green}44`,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "0 20px",
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 25,
                  color: C.text,
                }}
              >
                <span style={{ width: 40, height: 40, borderRadius: 20, background: C.green, color: "#07101F", textAlign: "center", lineHeight: "40px" }}>{i + 1}</span>
                <span style={{ width: 90, color: C.blue }}>{r.y}</span>
                <span style={{ flex: 1 }}>{r.cat}</span>
                <span style={{ color: "#6EE7B7" }}>{fmt(r.v)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* enterprise stamp */}
      {stamp > 0 && (
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 700,
            width: 300,
            height: 110,
            borderRadius: 16,
            border: `6px solid ${C.green}`,
            color: C.green,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 30,
            textAlign: "center",
            lineHeight: "50px",
            paddingTop: 4,
            background: "#0B1222D0",
            transform: `rotate(-9deg) scale(${1.6 - 0.6 * stamp})`,
            opacity: Math.min(1, stamp * 1.5) * (1 - prog(t, 212.6, 213.2)),
            boxShadow: `0 0 20px ${C.green}77`,
          }}
        >
          ENTERPRISE
          <br />
          APPROVED ✓
        </div>
      )}

      {/* KPI dashboard */}
      {kpi > 0 && (
        <div style={{ position: "absolute", left: GX, top: 640, width: 840, opacity: kpi }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", textAlign: "right", marginBottom: 14 }}>
            لوحة مؤشرات الأداء <span style={{ fontFamily: MONO, color: C.blue, fontSize: 26 }}>Dashboard</span>
          </div>
          <div style={{ display: "flex", gap: 25 }}>
            {[
              { k: "TOP CATEGORY", v: "Electronics", c: C.blue },
              { k: "BEST YEAR", v: "2025", c: C.green },
              { k: "GROUPS ≥ 50K", v: "5", c: C.amber },
            ].map((s, i) => {
              const e = eb(t, 208.7 + i * 0.3, 209.4 + i * 0.3);
              return (
                <div
                  key={i}
                  style={{
                    width: 260,
                    height: 170,
                    borderRadius: 20,
                    background: `${s.c}18`,
                    border: `3px solid ${s.c}`,
                    boxShadow: `0 0 20px ${s.c}55`,
                    textAlign: "center",
                    transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`,
                    opacity: Math.min(1, e * 1.5),
                  }}
                >
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.dim, marginTop: 22 }}>{s.k}</div>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: s.v.length > 5 ? 36 : 68, color: s.c, marginTop: s.v.length > 5 ? 38 : 8 }}>{s.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* captions */}
      <Banner x={70} y={992} w={1780} a={176.2} b={196.8} color={C.blue} fs={26}>
        GROUP BY category_id, order_year ──► Multi-Dimensional Matrix Analytics
      </Banner>
      <Banner x={70} y={992} w={1780} a={197.4} b={213.0} color={C.green} fs={26}>
        Enterprise Reporting ──► Grouping + Aggregation + Filtering + Sorting
      </Banner>
    </AbsoluteFill>
  );
};
