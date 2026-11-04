import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Logo } from "../components/common";
import { C, eb, eio, eo, prog, useT } from "../lib";

const SKILLS = [
  { a: 217.4, t: "Derived Tables", ar: "استعلام فرعي في FROM", c: C.blue },
  { a: 218.5, t: "Mandatory Alias", ar: "اسم مستعار إلزامي", c: C.green },
  { a: 219.5, t: "AVG(SUM) in 2 steps", ar: "تجميع على تجميع", c: C.violet },
  { a: 220.5, t: "Flattening", ar: "تفتيت الاستعلام البسيط", c: C.amber },
];
const FUNCS = [
  { a: 236.5, s: "LENGTH" },
  { a: 237.1, s: "SUBSTRING" },
  { a: 237.9, s: "CONCAT" },
  { a: 238.8, s: "TRIM" },
  { a: 239.2, s: "REPLACE" },
];
const BAR_X = 260, BAR_W = 1400, BAR_Y = 618;

export const Scene6: React.FC = () => {
  const t = useT();
  const cardIn = eo(t, 213.5, 214.8);
  const logoIn = eb(t, 214.0, 215.0);
  const badge = eb(t, 215.6, 216.3);
  const check = prog(t, 215.9, 216.5);
  const fill = eio(t, 217.0, 221.4);
  const pct = Math.round(fill * 100);
  const done = prog(t, 221.4, 222.1);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 70 + (1 - cardIn) * 80,
          width: 1600,
          height: 940,
          opacity: cardIn,
          borderRadius: 44,
          background: "linear-gradient(160deg, #1E293BCC 0%, #0F172AE6 55%, #0B1B33E6 100%)",
          border: `2px solid ${C.blue}55`,
        }}
      />
      <div style={{ position: "absolute", left: 840, top: 92, opacity: Math.min(1, logoIn * 1.4), transform: `scale(${0.7 + 0.3 * Math.min(1.1, logoIn)})`, willChange: "transform" }}>
        <Logo size={240} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 336, width: 1600, textAlign: "center", opacity: prog(t, 214.5, 215.3), transform: `translateY(${(1 - eo(t, 214.5, 215.5)) * 30}px)` }}>
        <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", lineHeight: 1.15 }}>
          منظومة <span style={{ color: C.blue }}>أكاديمي</span>
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.blue, letterSpacing: 2 }}>Manzooma SQL Masterclass</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 300,
          top: 488,
          width: 1320,
          height: 70,
          borderRadius: 999,
          background: `${C.green}1E`,
          border: `3px solid ${C.green}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          opacity: Math.min(1, badge * 1.5),
          transform: `scale(${0.85 + 0.15 * Math.min(1.1, badge)})`,
        }}
      >
        <svg width={46} height={46} viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="21" fill={C.green} />
          <path d="M12 24 L20 32 L35 15" fill="none" stroke="#07101F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
        </svg>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.text }}>
          Lesson 24 Completed: <span style={{ color: C.green }}>Derived Tables &amp; Module 6 Mastered</span>
        </span>
      </div>

      <div style={{ position: "absolute", left: BAR_X, top: BAR_Y - 44, width: BAR_W, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 22, opacity: prog(t, 216.8, 217.4) }}>
        <span style={{ color: C.dim }}>MODULE 6 · SUBQUERIES &amp; NESTED QUERIES</span>
        <span style={{ color: C.green, fontSize: 28 }}>{pct}%</span>
      </div>
      <div style={{ position: "absolute", left: BAR_X, top: BAR_Y, width: BAR_W, height: 28, borderRadius: 14, background: "#0B1222", border: `2px solid ${C.line}`, opacity: prog(t, 216.8, 217.4) }}>
        <div style={{ width: `${Math.max(0.5, fill * 100)}%`, height: "100%", borderRadius: 12, background: `linear-gradient(90deg, ${C.blue}, ${C.green})` }} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 656, width: 1600, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.green, opacity: done }}>
        100% Module 6 Subqueries Completed
      </div>

      <div style={{ position: "absolute", left: 160, top: 704, width: 1600, display: "flex", justifyContent: "center", gap: 20 }}>
        {SKILLS.map((s, i) => {
          const e = eb(t, s.a, s.a + 0.6);
          return (
            <div key={i} style={{ width: 360, height: 84, borderRadius: 20, background: `${s.c}16`, border: `2.5px solid ${s.c}`, textAlign: "center", opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 40}px)` }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: s.c, marginTop: 8 }}>{s.t}</div>
              <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 22, color: C.text, direction: "rtl" }}>{s.ar}</div>
            </div>
          );
        })}
      </div>

      {(() => {
        const e = eb(t, 227.0, 227.8);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 210, top: 818, width: 700, height: 160, borderRadius: 26, background: `${C.blue}14`, border: `3px solid ${C.blue}`, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`, padding: "14px 30px" }}>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", textAlign: "right" }}>الشيتات والتمارين التطبيقية</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim, marginTop: 4 }}>derived tables scripts · practice sheets</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 31, color: C.blue, marginTop: 10, textDecoration: "underline", textUnderlineOffset: 8 }}>solutions.gomaaintelligence.me</div>
          </div>
        );
      })()}

      {(() => {
        const e = eb(t, 231.4, 232.2);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 950, top: 818, width: 760, height: 160, borderRadius: 26, background: `${C.violet}14`, border: `3px solid ${C.violet}`, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`, padding: "12px 30px" }}>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 24, color: C.violet, direction: "rtl", textAlign: "right" }}>الدرس القادم · الوحدة السابعة</div>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 30, color: C.text, direction: "rtl", textAlign: "right" }}>الدرس 25: دوال النصوص المتقدمة</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.violet, marginTop: 2 }}>Advanced String Functions</div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {FUNCS.map((f) => (
                <span key={f.s} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, color: C.text, padding: "3px 9px", borderRadius: 8, border: `1.5px solid ${C.violet}`, background: `${C.violet}22`, opacity: prog(t, f.a, f.a + 0.3) }}>
                  {f.s}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
