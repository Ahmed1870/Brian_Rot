import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Arabic, Banner, CodeLine } from "../components/common";
import { C, eb, eio, eo, fmt, lerp, prog, typed, useT, win } from "../lib";

const CATS = [
  { id: 1, name: "Electronics", c: C.blue },
  { id: 2, name: "Fashion", c: C.green },
  { id: 3, name: "Grocery", c: C.amber },
];
// [order_id, category_id, total_amount]
const ORDERS: [number, number, number][] = [
  [101, 2, 420], [102, 1, 1200], [103, 3, 150], [104, 1, 800], [105, 2, 380], [106, 3, 220],
  [107, 1, 650], [108, 2, 510], [109, 3, 95], [110, 1, 830], [111, 2, 290], [112, 3, 185],
];
const SUMS = [3480, 1600, 650];
const TOTAL = 5730;

const TX = 70, TY = 140, TW = 640;
const ROW0 = 262, ROWS = 50;
const BX = (k: number) => 780 + k * 370;
const BW = 330, B_TOP = 360, B_BOT = 780, STACK_BOT = 765;

const FLY0 = 23.4, FLY_STEP = 0.44, FLY_DUR = 0.72;

export const Scene1: React.FC = () => {
  const t = useT();

  // slot index per order inside its bucket
  const counts = [0, 0, 0];
  const slots = ORDERS.map(([, cat]) => counts[cat - 1]++);

  const cp = eio(t, 33.0, 34.2);
  const stackH = 208 * lerp(1, 0.2, cp);
  const plateBottom =
    t < 33.0 ? lerp(372, 555, eo(t, 32.0, 33.0)) : t < 34.4 ? STACK_BOT - stackH - 2 : lerp(STACK_BOT - 208 * 0.2 - 2, 372, eio(t, 34.5, 35.4));
  const pistonOn = win(t, 31.9, 35.7, 0.3);
  const colored = prog(t, 20.8, 21.6);
  const rowsFade = 1 - prog(t, 34.25, 34.5);
  const sumShow = prog(t, 34.3, 34.8);

  return (
    <AbsoluteFill>
      {/* ───────── SVG layer: buckets, pistons, arrows ───────── */}
      <svg width={1170} height={620} viewBox="700 190 1170 620" style={{ position: "absolute", left: 700, top: 190 }}>
        <defs>
          <filter id="s1glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* buckets */}
        {CATS.map((cat, k) => {
          const p = eb(t, 20.9 + k * 0.25, 21.9 + k * 0.25);
          if (p <= 0) return null;
          const x0 = BX(k);
          const rise = (1 - p) * 140;
          const pulse = win(t, 29.3 + k * 0.5, 30.4 + k * 0.5, 0.25);
          return (
            <g key={k} transform={`translate(0 ${rise})`} opacity={Math.min(1, p * 1.4)}>
              <path
                d={`M ${x0} ${B_TOP} L ${x0} ${B_BOT - 40} Q ${x0} ${B_BOT} ${x0 + 40} ${B_BOT} L ${x0 + BW - 40} ${B_BOT} Q ${x0 + BW} ${B_BOT} ${x0 + BW} ${B_BOT - 40} L ${x0 + BW} ${B_TOP}`}
                fill={`${cat.c}10`}
                stroke={cat.c}
                strokeWidth={4}
                strokeLinejoin="round"
              />
              {pulse > 0 && (
                <rect x={x0 - 10} y={B_TOP - 70} width={BW + 20} height={64} rx={16} fill="none" stroke={cat.c} strokeWidth={3} opacity={pulse} />
              )}
            </g>
          );
        })}

        {/* pistons */}
        {pistonOn > 0 &&
          CATS.map((cat, k) => {
            const x0 = BX(k);
            return (
              <g key={k} opacity={pistonOn}>
                <rect x={x0 + BW / 2 - 9} y={352} width={18} height={Math.max(0, plateBottom - 22 - 352)} fill="#475569" />
                <rect x={x0 + 14} y={plateBottom - 22} width={BW - 28} height={22} rx={8} fill={cat.c} />
              </g>
            );
          })}
      </svg>

      {/* global aggregation arrows (own small SVG: only this region repaints) */}
      {win(t, 10.0, 15.8, 0.4) > 0 && (
        <svg width={320} height={440} viewBox="705 310 320 440" style={{ position: "absolute", left: 705, top: 310, opacity: win(t, 10.0, 15.8, 0.4) }}>
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M ${712} ${330 + i * 150} C ${860} ${330 + i * 150}, ${900} ${540}, ${1010} ${540}`}
              fill="none"
              stroke={C.blue}
              strokeWidth={3}
              strokeDasharray="14 12"
              strokeDashoffset={-t * 90}
              opacity={0.8}
            />
          ))}
        </svg>
      )}

      {/* ───────── Top badge (2s–18s) ───────── */}
      {win(t, 2.0, 18.0, 0.6) > 0 && (
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 124,
            width: 1070,
            height: 62,
            opacity: win(t, 2.0, 18.0, 0.6),
            transform: `translateY(${(1 - prog(t, 2.0, 2.7)) * -24}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            borderRadius: 999,
            border: `2px solid ${C.blue}88`,
            background: "#0B1B33",
            boxShadow: `0 0 20px ${C.blue}33`,
          }}
        >
          <span style={{ fontFamily: AR, fontWeight: 900, fontSize: 34, color: C.text, direction: "rtl" }}>التجميع الفئوي</span>
          <span style={{ color: C.blue, fontSize: 30 }}>|</span>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.blue }}>Grouped Aggregation &amp; Bucketing</span>
        </div>
      )}

      {/* ───────── Table card ───────── */}
      <div
        style={{
          position: "absolute",
          left: TX - (1 - eo(t, 0.1, 1.1)) * 500,
          top: TY,
          width: TW,
          height: 740,
          borderRadius: 24,
          background: C.card2,
          border: `2px solid ${C.line}`,
          boxShadow: "none",
        }}
      >
        <div style={{ height: 60, display: "flex", alignItems: "center", gap: 14, padding: "0 24px", borderBottom: `1.5px solid ${C.line}` }}>
          <svg width={30} height={30} viewBox="0 0 30 30">
            <ellipse cx="15" cy="7" rx="11" ry="5" fill="none" stroke={C.blue} strokeWidth="2.2" />
            <path d="M4 7v16c0 2.8 5 5 11 5s11-2.2 11-5V7" fill="none" stroke={C.blue} strokeWidth="2.2" />
            <path d="M4 15c0 2.8 5 5 11 5s11-2.2 11-5" fill="none" stroke={C.blue} strokeWidth="2.2" />
          </svg>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.text }}>orders</span>
          <span style={{ fontFamily: MONO, fontSize: 18, color: C.dim, marginLeft: "auto" }}>manzooma_store_db</span>
        </div>
        <div style={{ height: 50, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center", padding: "0 44px 0 44px", fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.dim }}>
          <span>order_id</span>
          <span
            style={{
              textAlign: "center",
              color: colored > 0 ? C.blue : C.dim,
              textShadow: colored > 0 && win(t, 29.3, 31.6, 0.3) > 0 ? `0 0 18px ${C.blue}` : "none",
            }}
          >
            category_id
          </span>
          <span style={{ textAlign: "right" }}>total_amount</span>
        </div>
        {ORDERS.map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 22, top: ROW0 - TY + i * ROWS, width: 596, height: 42, borderRadius: 10, border: `1px dashed ${C.line}55` }} />
        ))}
      </div>

      {/* ───────── Flying rows ───────── */}
      {ORDERS.map(([id, cat, amt], i) => {
        const appear = eb(t, 0.8 + i * 0.14, 1.3 + i * 0.14);
        if (appear <= 0) return null;
        const k = cat - 1;
        const ts = FLY0 + i * FLY_STEP;
        const p = eio(t, ts, ts + FLY_DUR);
        const s = slots[i];
        const col = CATS[k].c;
        const tableLeft = TX - (1 - eo(t, 0.1, 1.1)) * 500 + 22;
        const x = lerp(tableLeft, BX(k) + 20, p);
        const w = lerp(596, 290, p);
        const lift = Math.sin(Math.PI * p) * 80;
        // compressed geometry
        const step = 52 * lerp(1, 0.2, cp);
        const h = lerp(42, 44, p) * (p >= 1 ? lerp(1, 0.2, cp) : 1);
        const slotTop = STACK_BOT - (s + 1) * step + (p >= 1 ? 6 * lerp(1, 0.2, cp) : 6);
        const y = lerp(ROW0 + i * ROWS, slotTop, p) - lift;
        const op = Math.min(1, appear) * (p >= 1 ? rowsFade : 1);
        if (op <= 0) return null;
        const fs = p >= 1 ? 22 * Math.min(1, Math.max(0.55, lerp(1, 0.2, cp) * 1.4)) : 21;
        const landed = p >= 1 && t < ts + FLY_DUR + 0.25 ? 1 - prog(t, ts + FLY_DUR, ts + FLY_DUR + 0.25) : 0;
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: h,
              opacity: op,
              borderRadius: 10,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              alignItems: "center",
              padding: p > 0.5 ? "0 16px" : "0 22px",
              background: colored > 0 ? `${col}${p > 0.5 ? "30" : "18"}` : "#1B2740",
              border: `1.5px solid ${colored > 0 ? col : C.line}`,
              boxShadow: landed > 0 ? `0 0 ${Math.min(20, 24 * landed)}px ${col}` : "none",
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: fs,
              color: C.text,
            }}
          >
            <span>#{id}</span>
            <span style={{ color: colored > 0 ? col : C.text, fontWeight: 700, textAlign: "center" }}>{cat}</span>
            <span style={{ textAlign: "right" }}>{amt}</span>
          </div>
        );
      })}

      {/* ───────── Global aggregation demo (8.4s–16s) ───────── */}
      {win(t, 8.4, 15.9, 0.45) > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: win(t, 8.4, 15.9, 0.45) }}>
          <div
            style={{
              position: "absolute",
              left: 800,
              top: 230,
              width: 1000,
              padding: "16px 26px",
              borderRadius: 16,
              background: "#0B1222",
              border: `2px solid ${C.line}`,
            }}
          >
            <CodeLine text={typed("SELECT SUM(total_amount) FROM orders;", t, 8.5, 10.0)} caret={t < 10.1} fs={30} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 1010,
              top: 410,
              width: 560,
              height: 260,
              borderRadius: 26,
              background: `${C.blue}14`,
              border: `3px solid ${C.blue}`,
              boxShadow: `0 0 ${Math.min(20, 30 + 20 * Math.sin(t * 5))}px ${C.blue}55`,
              transform: `scale(${0.85 + 0.15 * eb(t, 10.2, 11.0)})`,
              opacity: prog(t, 10.2, 10.8),
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 28 }}>Global Aggregation · 1 row</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 100, color: C.blue, marginTop: 6 }}>{fmt(TOTAL * eo(t, 10.8, 12.4))}</div>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, direction: "rtl" }}>الجدول كله في رقم واحد</div>
          </div>
        </div>
      )}

      {/* ───────── Real-world questions (16.4s–20.6s) ───────── */}
      {[
        { a: 16.5, y: 330, en: "SUM(total_amount)  per department ?", ar: "إجمالي مبيعات كل قسم" },
        { a: 18.45, y: 520, en: "AVG(total_amount)  per city ?", ar: "متوسط طلبات كل مدينة" },
      ].map((q, i) => {
        const o = win(t, q.a, 20.6, 0.4);
        if (o <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 880,
              top: q.y,
              width: 880,
              height: 140,
              opacity: o,
              transform: `translateX(${(1 - eo(t, q.a, q.a + 0.6)) * 160}px)`,
              borderRadius: 24,
              background: C.card,
              border: `2px solid ${C.violet}88`,
              boxShadow: `0 0 20px ${C.violet}22`,
              padding: "22px 34px",
            }}
          >
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.violet }}>{q.en}</div>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 40, color: C.text, direction: "rtl", textAlign: "right", marginTop: 6 }}>{q.ar}</div>
          </div>
        );
      })}

      {/* ───────── GROUP BY keyword ───────── */}
      {t > 20.66 && (
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 208,
            width: 560,
            height: 70,
            borderRadius: 16,
            background: `${C.blue}1A`,
            border: `3px solid ${C.blue}`,
            boxShadow: `0 0 ${Math.min(20, 34 + 40 * (1 - prog(t, 20.66, 21.6)))}px ${C.blue}77`,
            transform: `scale(${1 + 0.3 * (1 - eb(t, 20.66, 21.2))})`,
            transformOrigin: "left center",
            display: "flex",
            alignItems: "center",
            paddingLeft: 24,
            opacity: Math.min(prog(t, 20.66, 20.9), 1 - prog(t, 38.4, 38.9)),
          }}
        >
          <CodeLine text="GROUP BY category_id" fs={34} />
        </div>
      )}
      <Arabic x={1360} y={214} w={490} fs={32} color={C.blue} o={win(t, 29.3, 31.7, 0.35)}>
        نفس القيمة = نفس الوعاء
      </Arabic>

      {/* ───────── Bucket tabs ───────── */}
      {CATS.map((cat, k) => {
        const p = eb(t, 20.9 + k * 0.25, 21.9 + k * 0.25);
        if (p <= 0) return null;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: BX(k),
              top: B_TOP - 64 + (1 - p) * 140,
              width: BW,
              height: 54,
              opacity: Math.min(1, p * 1.4),
              borderRadius: 14,
              background: cat.c,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 23,
              color: "#07101F",
            }}
          >
            <span>category_id = {cat.id}</span>
          </div>
        );
      })}
      {CATS.map((cat, k) => {
        const o = win(t, 21.4 + k * 0.25, 38.9, 0.4) * (1 - sumShow * 0);
        if (o <= 0) return null;
        return (
          <div key={k} style={{ position: "absolute", left: BX(k), top: B_BOT + 10, width: BW, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 24, color: cat.c, opacity: o * (1 - prog(t, 35.4, 35.8)) }}>
            {cat.name}
          </div>
        );
      })}
      {win(t, 27.6, 31.2, 0.3) > 0 && (
        <div
          style={{
            position: "absolute",
            left: 1040,
            top: 300 - 6,
            opacity: 0,
          }}
        />
      )}
      {win(t, 27.7, 30.5, 0.3) > 0 && (
        <div
          style={{
            position: "absolute",
            left: 1236,
            top: 290,
            padding: "6px 22px",
            borderRadius: 999,
            background: C.text,
            color: "#07101F",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 26,
            opacity: win(t, 27.7, 30.5, 0.3),
            transform: `scale(${0.7 + 0.3 * eb(t, 27.7, 28.2)})`,
          }}
        >
          Buckets
        </div>
      )}

      {/* ───────── Summary rows inside buckets + result cards ───────── */}
      {CATS.map((cat, k) => {
        if (sumShow <= 0) return null;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: BX(k) + 20,
              top: STACK_BOT - 52 + 6,
              width: 290,
              height: 44,
              opacity: sumShow,
              borderRadius: 10,
              background: `${cat.c}33`,
              border: `2px solid ${C.blue}`,
              boxShadow: `0 0 20px ${C.blue}99`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 25,
              color: C.text,
              transform: `scale(${0.8 + 0.2 * eb(t, 34.3, 34.9)})`,
            }}
          >
            Σ {fmt(SUMS[k])}
          </div>
        );
      })}
      {CATS.map((cat, k) => {
        const a = 35.6 + k * 0.45;
        const o = prog(t, a, a + 0.5);
        if (o <= 0) return null;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: BX(k),
              top: 812 + (1 - eo(t, a, a + 0.6)) * 60,
              width: BW,
              height: 100,
              opacity: o,
              borderRadius: 20,
              background: C.card,
              border: `2.5px solid ${C.blue}`,
              boxShadow: `0 0 20px ${C.blue}66`,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim, marginTop: 10 }}>category_id = {cat.id} → SUM</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46, color: cat.c }}>{fmt(SUMS[k] * eo(t, a + 0.1, a + 1.0))}</div>
          </div>
        );
      })}

      {/* ───────── Bottom tag (22s–38s) ───────── */}
      <Banner x={780} y={940} w={1070} a={22.0} b={38.6} color={C.blue} fs={23}>
        GROUP BY category_id ──► Groups Identical Keys into Separate Buckets
      </Banner>
    </AbsoluteFill>
  );
};
