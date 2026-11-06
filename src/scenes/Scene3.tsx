import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner } from "../components/common";
import { C, eb, eio, eo, fmt, prog, useT, win } from "../lib";

const PURPLE = "#A855F7";
const DATA: [string, number, number, number][] = [
  ["Laptop", 1500, 1350, 1100],
  ["Phone", 900, 950, 700],
  ["Monitor", 400, 380, 420],
];
const CX = [95, 300, 490, 680, 880, 1040];
const CW = [190, 180, 180, 190, 150, 150];
const TY = 190, HY = 262;
const RY = (i: number) => 320 + i * 86;
const maxIdx = (r: number[]) => r.indexOf(Math.max(...r)) ; // within [retail, promo, wholesale]
const minIdx = (r: number[]) => r.indexOf(Math.min(...r));

export const Scene3: React.FC = () => {
  const t = useT();
  const tableIn = eo(t, 87.0, 88.4);
  const vals = DATA.map((d) => [d[1], d[2], d[3]]);

  const SWEEPS: { row: number; a: number; d: number }[] = [
    { row: 0, a: 90.4, d: 1.6 },
    { row: 0, a: 92.6, d: 1.6 },
    ...[0, 1, 2].map((i) => ({ row: i, a: 104.9 + i * 1.2, d: 0.9 })),
    ...[0, 1, 2].map((i) => ({ row: i, a: 114.6 + i * 0.8, d: 0.7 })),
  ];

  const gShown = (i: number) => t > 105.8 + i * 1.2;
  const lShown = (i: number) => t > 115.3 + i * 0.8;

  return (
    <AbsoluteFill>
      {/* table card */}
      <div style={{ position: "absolute", left: 70 - (1 - tableIn) * 400, top: TY, width: 1130, height: 520, opacity: tableIn, borderRadius: 24, background: C.card2, border: `2px solid ${C.line}` }}>
        <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.blue }}>product_prices</div>
      </div>
      {["product", "retail_price", "promo_price", "wholesale_price", "GREATEST", "LEAST"].map((h, c) => {
        const o = c < 4 ? tableIn : c === 4 ? prog(t, 95.0, 95.6) : prog(t, 95.9, 96.5);
        const col = c === 4 ? C.amber : c === 5 ? C.blue : c === 1 && t > 100.2 && t < 104.5 ? C.blue : C.dim;
        return (
          <div key={h} style={{ position: "absolute", left: CX[c], top: HY, width: CW[c], textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: c >= 3 ? 16 : 17, color: col, opacity: o }}>
            {h}
          </div>
        );
      })}
      {DATA.map((d, i) => {
        const e = eb(t, 87.8 + i * 0.25, 88.5 + i * 0.25);
        const mx = maxIdx(vals[i]);
        const mn = minIdx(vals[i]);
        const gHit = gShown(i);
        const lHit = lShown(i);
        return (
          <div key={d[0]} style={{ position: "absolute", left: 0, top: 0, opacity: Math.min(1, e * 1.5) }}>
            <div style={{ position: "absolute", left: 85, top: RY(i), width: 1100, height: 70, borderRadius: 14, background: "#1B2740", border: `1.5px solid ${C.line}` }} />
            <div style={{ position: "absolute", left: CX[0], top: RY(i), width: CW[0], textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, lineHeight: "70px", color: C.text }}>{d[0]}</div>
            {[1, 2, 3].map((k) => {
              const isMax = gHit && k - 1 === mx;
              const isMin = lHit && k - 1 === mn;
              const bc = isMax ? C.amber : isMin ? C.blue : "transparent";
              return (
                <div key={k} style={{ position: "absolute", left: CX[k] + 10, top: RY(i) + 8, width: CW[k] - 20, height: 54, borderRadius: 10, border: `3px solid ${bc}`, background: isMax ? `${C.amber}22` : isMin ? `${C.blue}22` : "transparent", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "48px", color: C.text }}>
                  {fmt(d[k] as number)}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: CX[4] + 10, top: RY(i) + 8, width: 130, height: 54, borderRadius: 10, border: `3px ${gHit ? "solid" : "dashed"} ${gHit ? C.amber : C.line}`, background: gHit ? `${C.amber}28` : "transparent", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "48px", color: C.amber, opacity: t > 95.0 ? 1 : 0 }}>
              {gHit ? fmt(vals[i][mx]) : ""}
            </div>
            <div style={{ position: "absolute", left: CX[5] + 10, top: RY(i) + 8, width: 130, height: 54, borderRadius: 10, border: `3px ${lHit ? "solid" : "dashed"} ${lHit ? C.blue : C.line}`, background: lHit ? `${C.blue}28` : "transparent", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "48px", color: C.blue, opacity: t > 95.9 ? 1 : 0 }}>
              {lHit ? fmt(vals[i][mn]) : ""}
            </div>
          </div>
        );
      })}

      {/* horizontal purple sweeps */}
      {SWEEPS.map((sw, k) => {
        if (t < sw.a || t > sw.a + sw.d + 0.35) return null;
        const w = 560 * eio(t, sw.a, sw.a + sw.d);
        return (
          <div key={k} style={{ position: "absolute", left: 295, top: RY(sw.row) + 31, width: w, height: 8, borderRadius: 4, background: PURPLE, opacity: 0.95 }}>
            <div style={{ position: "absolute", right: -14, top: -11, width: 30, height: 30, borderRadius: 15, background: PURPLE, border: "3px solid #fff" }} />
          </div>
        );
      })}
      {win(t, 90.0, 95.0, 0.4) > 0 && (
        <Arabic2 t={t} />
      )}

      {/* vertical MAX / MIN */}
      {t > 100.2 && t < 104.6 && (
        <>
          <div style={{ position: "absolute", left: CX[1] + CW[1] / 2 - 3, top: 290, width: 6, height: 290 * eio(t, 100.2, 101.8), background: C.blue, opacity: win(t, 100.2, 104.6, 0.3) }} />
          <div style={{ position: "absolute", left: CX[1] + CW[1] / 2 - 14, top: 566, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.blue, opacity: win(t, 101.6, 104.6, 0.3) }}>▼</div>
        </>
      )}
      {[
        { a: 100.4, l: "MAX(retail_price) = 1,500", c: C.blue, x: 95 },
        { a: 100.8, l: "MIN(retail_price) = 400", c: C.dim, x: 560 },
      ].map((m) => {
        const o = win(t, m.a, 104.6, 0.3);
        return o > 0 ? (
          <div key={m.l} style={{ position: "absolute", left: m.x, top: 620, width: 430, height: 56, borderRadius: 14, border: `2.5px solid ${m.c}`, background: `${m.c}18`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, lineHeight: "52px", color: C.text, opacity: o }}>
            {m.l}
          </div>
        ) : null;
      })}

      {/* right panel: comparison cards, then use-cases */}
      {[
        { a: 99.5, y: 190, c: C.blue, k: "MAX() / MIN()", ar: "عمود واحد ↓ رأسي عبر كل الأسطر", end: 117.2 },
        { a: 104.7, y: 370, c: PURPLE, k: "GREATEST() / LEAST()", ar: "عدة أعمدة → أفقي داخل السطر الواحد", end: 117.2 },
        { a: 120.5, y: 190, c: C.amber, k: "SEASONAL PRICES", ar: "مقارنة أسعار المواسم المختلفة", end: 134.4 },
        { a: 124.0, y: 370, c: PURPLE, k: "SHIPPING & DISCOUNTS", ar: "حدّ أدنى وأقصى لرسوم الشحن والخصومات", end: 134.4 },
        { a: 129.6, y: 550, c: C.green, k: "PROFIT MARGIN ✓", ar: "تمنع الخسائر وتحمي هامش الربح", end: 134.4 },
      ].map((cd) => {
        const o = win(t, cd.a, cd.end, 0.45);
        if (o <= 0) return null;
        return (
          <div key={cd.k} style={{ position: "absolute", left: 1240, top: cd.y, width: 610, height: 158, opacity: o, transform: `translateX(${(1 - eo(t, cd.a, cd.a + 0.6)) * 120}px)`, borderRadius: 20, background: `${cd.c}16`, border: `3px solid ${cd.c}`, padding: "14px 24px" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, color: cd.c }}>{cd.k}</div>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 30, color: C.text, direction: "rtl", textAlign: "right", marginTop: 10, lineHeight: 1.35 }}>{cd.ar}</div>
          </div>
        );
      })}

      <Banner x={70} y={900} w={1780} a={90.0} b={109.8} color={PURPLE} fs={25}>
        GREATEST(c1, c2, c3) ──► Horizontal Row-Level Comparison (Vs Vertical MAX)
      </Banner>
      <Banner x={70} y={900} w={1780} a={110.2} b={134.2} color={C.blue} fs={26}>
        LEAST(c1, c2, c3) ──► Extracts Minimum Bound Across Row Columns
      </Banner>
    </AbsoluteFill>
  );
};

const Arabic2: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 300, top: 600, width: 600, textAlign: "center", fontFamily: AR, fontWeight: 900, fontSize: 36, color: PURPLE, direction: "rtl", opacity: win(t, 90.0, 95.0, 0.4) }}>
    ↔ داخل نفس السطر
  </div>
);
