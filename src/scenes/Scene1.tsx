import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Arabic, Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, lerp, prog, typed, useT, win } from "../lib";

const PRODUCTS = [
  { n: "Cable", p: 45, t: 0 },
  { n: "Mouse", p: 120, t: 0 },
  { n: "Keyboard", p: 340, t: 1 },
  { n: "Monitor", p: 780, t: 1 },
  { n: "Laptop", p: 1450, t: 2 },
  { n: "Phone", p: 2300, t: 2 },
];
const TIERS = [
  { n: "Bronze", lo: 0, hi: 199, pct: 5 },
  { n: "Silver", lo: 200, hi: 999, pct: 10 },
  { n: "Gold", lo: 1000, hi: 2999, pct: 15 },
];
const PX = 70, TX = 1380, CY = 190, CW = 470, CH = 540;
const rowTop = (i: number) => CY + 118 + i * 56;
const BXS = [600, 860, 1120], BW = 240, BY = 540, BH = 110;
const LAND0 = 35.9, LAND_STEP = 0.62, FLY = 0.8;

const landT = (i: number) => LAND0 + i * LAND_STEP + FLY;
const dotX = (i: number) => {
  const pr = PRODUCTS[i];
  const tr = TIERS[pr.t];
  return BXS[pr.t] + 20 + ((pr.p - tr.lo) / (tr.hi - tr.lo)) * (BW - 40);
};

export const Scene1: React.FC = () => {
  const t = useT();
  const firstLand = (k: number) => Math.min(...PRODUCTS.map((p, i) => (p.t === k ? landT(i) : 999)));

  return (
    <AbsoluteFill>
      {/* top badge 2s–18s */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 116,
          width: 750,
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
        <span style={{ fontFamily: AR, fontWeight: 900, fontSize: 30, color: C.text, direction: "rtl" }}>شروط الربط غير المتساوية</span>
        <span style={{ color: C.blue, fontSize: 26 }}>|</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.blue }}>Non-Equi Joins &amp; Range Matching</span>
      </div>

      {/* products card */}
      <div
        style={{
          position: "absolute",
          left: PX - (1 - eo(t, 1.2, 2.2)) * 520,
          top: CY,
          width: CW,
          height: CH,
          borderRadius: 24,
          background: C.card2,
          border: `2px solid ${C.blue}66`,
        }}
      >
        <div style={{ height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `1.5px solid ${C.line}` }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.blue }}>products</span>
          <span style={{ fontFamily: MONO, fontSize: 17, color: C.dim, marginLeft: "auto" }}>unit_price</span>
        </div>
      </div>
      {PRODUCTS.map((p, i) => {
        const a = eb(t, 2.0 + i * 0.25, 2.7 + i * 0.25);
        const landed = prog(t, landT(i), landT(i) + 0.4);
        return (
          <div
            key={p.n}
            style={{
              position: "absolute",
              left: PX + 20,
              top: rowTop(i),
              width: CW - 40,
              height: 46,
              opacity: Math.min(1, a * 1.5),
              transform: `translateX(${(1 - Math.min(1, a)) * -80}px)`,
              borderRadius: 12,
              background: "#1B2740",
              border: `1.5px solid ${landed > 0 ? C.green : C.line}`,
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 0.9fr",
              alignItems: "center",
              padding: "0 16px",
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 22,
              color: C.text,
            }}
          >
            <span>{p.n}</span>
            <span style={{ color: C.blue, textAlign: "right" }}>{p.p.toLocaleString("en-US")}</span>
            <span style={{ color: C.green, textAlign: "right", opacity: landed }}>→ {TIERS[p.t].pct}%</span>
          </div>
        );
      })}

      {/* tiers card */}
      <div
        style={{
          position: "absolute",
          left: TX + (1 - eo(t, 1.4, 2.4)) * 520,
          top: CY,
          width: CW,
          height: CH,
          borderRadius: 24,
          background: C.card2,
          border: `2px solid ${C.amber}66`,
        }}
      >
        <div style={{ height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `1.5px solid ${C.line}` }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.amber }}>discount_tiers</span>
        </div>
        {TIERS.map((tr, k) => {
          const hit = prog(t, firstLand(k), firstLand(k) + 0.4);
          return (
            <div
              key={tr.n}
              style={{
                position: "absolute",
                left: 20,
                top: 82 + k * 150,
                width: CW - 44,
                height: 126,
                borderRadius: 16,
                background: hit > 0 ? `${C.green}1A` : `${C.amber}12`,
                border: `2.5px solid ${hit > 0 ? C.green : C.amber}`,
                padding: "12px 20px",
                opacity: eo(t, 3.0 + k * 0.3, 3.8 + k * 0.3),
              }}
            >
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.amber }}>{tr.n}</div>
              <div style={{ fontFamily: MONO, fontSize: 21, color: C.dim, marginTop: 4 }}>
                min {tr.lo.toLocaleString("en-US")} · max {tr.hi.toLocaleString("en-US")}
              </div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: hit > 0 ? C.green : C.dim, marginTop: 2 }}>{tr.pct}% off</div>
            </div>
          );
        })}
      </div>

      {/* editor */}
      <div style={{ opacity: eo(t, 5.4, 6.0) }}>
        <Window x={600} y={190} w={750} h={250} title="products ⋈ discount_tiers" glow={t > 31.5 && t < 36.5 ? 1 : 0}>
          <div style={{ position: "absolute", left: 24, top: 18, opacity: t > 24.9 ? 0.35 : 1 }}>
            <CodeLine text={typed("ON o.customer_id = c.customer_id", t, 6.0, 9.0)} fs={22} caret={t > 6.0 && t < 9.1} override={t > 13.9 && t < 24.9 ? "#FCA5A5" : undefined} />
          </div>
          <div style={{ position: "absolute", left: 24, top: 68 }}>
            <CodeLine text={typed("ON p.unit_price BETWEEN d.min_price AND d.max_price", t, 31.6, 36.2)} fs={22} caret={t > 31.6 && t < 36.3} />
          </div>
          {[
            { a: 30.5, s: ">" },
            { a: 31.1, s: "<" },
            { a: 31.8, s: "BETWEEN" },
          ].map((o, i) => {
            const e = eb(t, o.a, o.a + 0.4);
            return e > 0 ? (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 24 + i * 96,
                  top: 126,
                  minWidth: o.s.length > 2 ? 190 : 72,
                  height: 50,
                  opacity: Math.min(1, e * 1.5),
                  transform: `scale(${0.7 + 0.3 * Math.min(1, e)})`,
                  borderRadius: 12,
                  background: `${C.blue}22`,
                  border: `2.5px solid ${C.blue}`,
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 26,
                  lineHeight: "46px",
                  textAlign: "center",
                  color: C.blue,
                  marginLeft: i === 2 ? 0 : 0,
                }}
              >
                {o.s}
              </div>
            ) : null;
          })}
        </Window>
      </div>
      {/* "= only?" question */}
      {win(t, 13.9, 21.4, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 1000, top: 460, width: 350, opacity: win(t, 13.9, 21.4, 0.4), textAlign: "center" }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 34, color: C.red, direction: "rtl" }}>المساواة وحدها ✕ مش كفاية</div>
        </div>
      )}

      {/* axis: tier blocks */}
      {TIERS.map((tr, k) => {
        const a = eb(t, 16.0 + k * 0.5, 16.8 + k * 0.5);
        if (a <= 0) return null;
        const hit = prog(t, firstLand(k), firstLand(k) + 0.4);
        return (
          <div
            key={tr.n}
            style={{
              position: "absolute",
              left: BXS[k],
              top: BY,
              width: BW,
              height: BH,
              opacity: Math.min(1, a * 1.5),
              transform: `scaleY(${0.4 + 0.6 * Math.min(1, a)})`,
              transformOrigin: "bottom",
              borderRadius: 14,
              background: hit > 0 ? `${C.green}22` : `${C.amber}1C`,
              border: `3px solid ${hit > 0 ? C.green : C.amber}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.amber, marginTop: 10 }}>{tr.n}</div>
            <div style={{ fontFamily: MONO, fontSize: 19, color: C.dim }}>
              {tr.lo.toLocaleString("en-US")} – {tr.hi.toLocaleString("en-US")}
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: hit > 0 ? C.green : C.dim }}>{hit > 0 ? `${tr.pct}%` : "?"}</div>
          </div>
        );
      })}
      {win(t, 17.0, 40.5, 0.5) > 0 &&
        ["0", "200", "1,000", "3,000"].map((s, i) => (
          <div key={s} style={{ position: "absolute", left: 600 + i * 253 - 40, top: BY + BH + 8, width: 80, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.dim, opacity: win(t, 17.0, 40.5, 0.5) }}>
            {s}
          </div>
        ))}

      {/* time-range chip */}
      {win(t, 19.0, 22.2, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 600, top: 700, width: 750, height: 96, opacity: win(t, 19.0, 22.2, 0.4), borderRadius: 18, background: `${C.violet}16`, border: `2.5px solid ${C.violet}`, textAlign: "center" }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 30, color: C.text, direction: "rtl", marginTop: 6 }}>وكمان مطابقة زمنية بين التواريخ</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.violet }}>BETWEEN start_date AND end_date</div>
        </div>
      )}

      {/* non-equi stamp */}
      {t > 24.9 && (
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 706,
            width: 670,
            height: 82,
            borderRadius: 18,
            background: `${C.blue}1E`,
            border: `3px solid ${C.blue}`,
            textAlign: "center",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 40,
            lineHeight: "76px",
            color: C.blue,
            transform: `scale(${1.25 - 0.25 * eb(t, 24.9, 25.5)})`,
            opacity: Math.min(prog(t, 24.9, 25.2), 1 - prog(t, 39.9, 40.4)),
          }}
        >
          NON-EQUI JOIN&nbsp;&nbsp;≠
        </div>
      )}

      {/* flying price dots */}
      {PRODUCTS.map((p, i) => {
        const ts = LAND0 + i * LAND_STEP;
        const f = eio(t, ts, ts + FLY);
        if (t < ts - 0.01) return null;
        const x = lerp(PX + CW - 20, dotX(i), f);
        const y0 = rowTop(i) + 23;
        const y = lerp(y0, BY - 28, f) - Math.sin(Math.PI * f) * 90;
        const landed = f >= 1;
        return (
          <div key={p.n} style={{ position: "absolute", left: x - 11, top: y - 11 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: landed ? C.green : C.blue, border: "2px solid #fff", boxShadow: `0 0 ${landed ? 10 : 18}px ${landed ? C.green : C.blue}` }} />
            <div style={{ position: "absolute", left: -34, top: -30, width: 90, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 16, color: landed ? C.green : C.blue }}>{p.p}</div>
          </div>
        );
      })}

      <Banner x={370} y={900} w={1180} a={22.0} b={40.2} color={C.blue} fs={24}>
        ON p.price BETWEEN d.min_price AND d.max_price ──► Dynamic Range Alignment
      </Banner>
      <Arabic x={600} y={806} w={750} fs={26} color={C.dim} o={win(t, 35.5, 40.2, 0.4)} align="center">
        كل سعر بيستقر في الشريحة اللي نطاقها بيحتويه
      </Arabic>
    </AbsoluteFill>
  );
};
