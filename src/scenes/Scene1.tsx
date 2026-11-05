import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Arabic, Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, lerp, prog, typed, useT, win } from "../lib";

// [customer, phone, mobile]
const ROWS: [string, string | null, string | null][] = [
  ["Ali", null, "0101234567"],
  ["Sara", "0122334455", "0109876543"],
  ["Omar", null, null],
  ["Mona", null, "0111222333"],
  ["Hany", null, null],
];
const TX = 70, TY = 190;
const COLX = [90, 300, 560, 820];
const COLW = [200, 250, 250, 230];
const RY = (i: number) => TY + 120 + i * 66;
const S0 = 27.0, STEP = 1.15;
const landOf = (r: [string, string | null, string | null]) => (r[1] ? 0 : r[2] ? 1 : 2);
const cellC = (c: number) => COLX[c] + COLW[c] / 2;

export const Scene1: React.FC = () => {
  const t = useT();
  const valueOf = (r: [string, string | null, string | null]) => (r[1] ? r[1] : r[2] ? r[2] : "N/A");

  return (
    <AbsoluteFill>
      {/* top badge 2s–18s */}
      <div style={{ position: "absolute", left: 70, top: 116, width: 1000, height: 58, opacity: win(t, 2.0, 18.0, 0.6), transform: `translateY(${(1 - prog(t, 2.0, 2.7)) * -24}px)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, borderRadius: 999, border: `2px solid ${C.blue}88`, background: "#0B1B33" }}>
        <span style={{ fontFamily: AR, fontWeight: 900, fontSize: 30, color: C.text, direction: "rtl" }}>التحكم في القيم المفقودة</span>
        <span style={{ color: C.blue, fontSize: 26 }}>|</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.blue }}>Handling Missing Values (COALESCE)</span>
      </div>

      {/* table */}
      <div style={{ position: "absolute", left: TX - (1 - eo(t, 1.0, 2.0)) * 500, top: TY, width: 1000, height: 460, borderRadius: 24, background: C.card2, border: `2px solid ${C.line}` }}>
        <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.blue }}>customers</div>
      </div>
      {["customer", "phone", "mobile", "contact"].map((h, c) => (
        <div key={h} style={{ position: "absolute", left: COLX[c], top: TY + 74, width: COLW[c], textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 19, color: c === 3 ? C.green : C.dim, opacity: eo(t, 1.6, 2.4) }}>
          {h}
        </div>
      ))}
      {ROWS.map((r, i) => {
        const a = eb(t, 2.0 + i * 0.22, 2.7 + i * 0.22);
        const pulse = t > 14.9 && t < 19.0 ? 0.5 + 0.5 * Math.sin(t * 7) : 0;
        const s = S0 + i * STEP;
        const land = landOf(r);
        const done = t > s + 0.3 * (land + 1) + 0.15;
        const cells = [r[0], r[1], r[2]];
        return (
          <div key={r[0]} style={{ position: "absolute", left: 0, top: 0, opacity: Math.min(1, a * 1.5) }}>
            <div style={{ position: "absolute", left: 80, top: RY(i) - 4, width: 980, height: 56, borderRadius: 12, background: "#1B2740", border: `1.5px solid ${C.line}` }} />
            {cells.map((v, c) => {
              const isNull = v === null;
              return (
                <div key={c} style={{ position: "absolute", left: COLX[c], top: RY(i), width: COLW[c], textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, lineHeight: "48px", color: isNull ? C.red : C.text, opacity: isNull ? 0.7 + 0.3 * pulse : 1 }}>
                  {isNull ? "NULL" : v}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: COLX[3], top: RY(i) + 2, width: COLW[3], height: 44, borderRadius: 10, background: done ? `${valueOf(r) === "N/A" ? C.amber : C.green}28` : "transparent", border: `2px ${done ? "solid" : "dashed"} ${done ? (valueOf(r) === "N/A" ? C.amber : C.green) : C.line}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 21, lineHeight: "40px", color: valueOf(r) === "N/A" ? C.amber : "#6EE7B7" }}>
              {done ? valueOf(r) : ""}
            </div>
          </div>
        );
      })}

      {/* scanning beam */}
      {ROWS.map((r, i) => {
        const s = S0 + i * STEP;
        const land = landOf(r);
        const dt = t - s;
        if (dt < 0 || dt > 0.3 * (land + 1) + 0.6) return null;
        const pts = [120, cellC(1), cellC(2), COLX[3] + 40];
        const seg = Math.min(land, Math.floor(dt / 0.3));
        const x = lerp(pts[seg], pts[seg + 1], eio(t, s + seg * 0.3, s + seg * 0.3 + 0.3));
        const fin = dt >= 0.3 * (land + 1);
        return (
          <div key={r[0]}>
            <div style={{ position: "absolute", left: 90, top: RY(i) + 21, width: Math.max(0, x - 90), height: 5, background: `linear-gradient(90deg, transparent, ${C.blue})`, opacity: 0.7 }} />
            <div style={{ position: "absolute", left: x - 11, top: RY(i) + 14, width: 22, height: 22, borderRadius: 11, background: fin ? C.green : C.blue, border: "2px solid #fff", boxShadow: `0 0 14px ${fin ? C.green : C.blue}` }} />
          </div>
        );
      })}

      {/* code window */}
      {t > 24.6 && (
        <div style={{ opacity: eo(t, 24.6, 25.2), transform: `translateX(${(1 - eo(t, 24.6, 25.3)) * 100}px)` }}>
          <Window x={1130} y={190} w={720} h={250} title="contact_list.sql" glow={t < 30 ? 1 : 0}>
            {[typed("SELECT customer,", t, 25.0, 25.8), typed("  COALESCE(phone, mobile, 'N/A') AS contact", t, 25.8, 29.2), typed("FROM customers;", t, 29.2, 30.0)].map((s, i) =>
              s.length > 0 ? (
                <div key={i} style={{ position: "absolute", left: 22, top: 18 + i * 40 }}>
                  <CodeLine text={s} fs={21} caret={t < 30.1 && t > 25 && (i === 0 ? t < 25.8 : i === 1 ? t >= 25.8 && t < 29.2 : t >= 29.2)} />
                </div>
              ) : null,
            )}
          </Window>
        </div>
      )}
      {win(t, 30.0, 33.6, 0.4) > 0 && (
        <Arabic x={1130} y={470} w={720} fs={32} color={C.text} o={win(t, 30.0, 33.6, 0.4)}>
          بتمشي من <span style={{ color: C.blue, fontFamily: MONO }}>اليسار لليمين</span> وترجع أول قيمة مش NULL
        </Arabic>
      )}

      {/* real-world problem */}
      {win(t, 9.7, 19.4, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 1130, top: 200, width: 720, opacity: win(t, 9.7, 19.4, 0.5) }}>
          {[
            { a: 14.9, s: "قيم مفقودة NULL", c: C.amber },
            { a: 16.3, s: "قسمة صفرية ÷ 0", c: C.red },
            { a: 17.5, s: "انهيار الاستعلام ✕", c: C.red },
          ].map((p, i) => {
            const e = eb(t, p.a, p.a + 0.5);
            return (
              <div key={i} style={{ marginBottom: 20, height: 80, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - Math.min(1, e)) * 120}px)`, borderRadius: 18, background: `${p.c}16`, border: `3px solid ${p.c}`, fontFamily: AR, fontWeight: 900, fontSize: 36, lineHeight: "74px", color: C.text, textAlign: "center", direction: "rtl" }}>
                {p.s}
              </div>
            );
          })}
        </div>
      )}

      {/* defaults examples */}
      {win(t, 36.0, 44.8, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 1130, top: 520, width: 720, opacity: win(t, 36.0, 44.8, 0.5) }}>
          <div style={{ height: 86, borderRadius: 18, background: `${C.amber}16`, border: `3px solid ${C.amber}`, textAlign: "center", opacity: prog(t, 39.4, 40.0), marginBottom: 18 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.amber, marginTop: 8 }}>phone NULL ➔ 'N/A'</div>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 24, color: C.text, direction: "rtl" }}>غير متوفر</div>
          </div>
          <div style={{ height: 86, borderRadius: 18, background: `${C.green}16`, border: `3px solid ${C.green}`, textAlign: "center", opacity: prog(t, 42.8, 43.4) }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.green, marginTop: 8 }}>COALESCE(discount, 0)</div>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 24, color: C.text, direction: "rtl" }}>الخصم المفقود ➔ صفر بدون تعطل</div>
          </div>
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={22.0} b={44.8} color={C.blue} fs={26}>
        COALESCE(phone, mobile, 'N/A') ──► Returns First Non-NULL Value
      </Banner>
    </AbsoluteFill>
  );
};
