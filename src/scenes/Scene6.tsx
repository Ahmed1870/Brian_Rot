import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Logo } from "../components/common";
import { C, eb, eio, eo, prog, useT } from "../lib";

const SKILLS = [
  { a: 219.8, t: "COALESCE", ar: "أول قيمة غير NULL", c: C.blue },
  { a: 221.0, t: "NULLIF", ar: "حماية القسمة على صفر", c: C.green },
  { a: 221.8, t: "GREATEST", ar: "أعلى قيمة في السطر", c: C.amber },
  { a: 222.6, t: "LEAST", ar: "أدنى قيمة في السطر", c: C.violet },
];
const BAR_X = 260, BAR_W = 1400, BAR_Y = 618;

export const Scene6: React.FC = () => {
  const t = useT();
  const cardIn = eo(t, 216.4, 217.7);
  const logoIn = eb(t, 217.0, 218.0);
  const badge = eb(t, 218.2, 218.9);
  const check = prog(t, 218.5, 219.1);
  const fill = eio(t, 219.6, 224.4);
  const pct = Math.round(fill * 100);
  const done = prog(t, 224.6, 225.3);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 160, top: 70 + (1 - cardIn) * 80, width: 1600, height: 940, opacity: cardIn, borderRadius: 44, background: "linear-gradient(160deg, #1E293BCC 0%, #0F172AE6 55%, #0B1B33E6 100%)", border: `2px solid ${C.blue}55` }} />
      <div style={{ position: "absolute", left: 840, top: 92, opacity: Math.min(1, logoIn * 1.4), transform: `scale(${0.7 + 0.3 * Math.min(1.1, logoIn)})`, willChange: "transform" }}>
        <Logo size={240} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 336, width: 1600, textAlign: "center", opacity: prog(t, 217.4, 218.2), transform: `translateY(${(1 - eo(t, 217.4, 218.4)) * 30}px)` }}>
        <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", lineHeight: 1.15 }}>
          منظومة <span style={{ color: C.blue }}>أكاديمي</span>
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.blue, letterSpacing: 2 }}>Manzooma SQL Masterclass</div>
      </div>

      <div style={{ position: "absolute", left: 270, top: 488, width: 1380, height: 70, borderRadius: 999, background: `${C.green}1E`, border: `3px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: Math.min(1, badge * 1.5), transform: `scale(${0.85 + 0.15 * Math.min(1.1, badge)})` }}>
        <svg width={46} height={46} viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="21" fill={C.green} />
          <path d="M12 24 L20 32 L35 15" fill="none" stroke="#07101F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
        </svg>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 27, color: C.text }}>
          Lesson 28 Completed: <span style={{ color: C.green }}>Conditional Handling &amp; Module 7 Mastered</span>
        </span>
      </div>

      <div style={{ position: "absolute", left: BAR_X, top: BAR_Y - 44, width: BAR_W, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 21, opacity: prog(t, 219.4, 220.0) }}>
        <span style={{ color: C.dim }}>MODULE 7 · STRING &amp; TEMPORAL DATA MANIPULATION</span>
        <span style={{ color: C.green, fontSize: 28 }}>{pct}%</span>
      </div>
      <div style={{ position: "absolute", left: BAR_X, top: BAR_Y, width: BAR_W, height: 28, borderRadius: 14, background: "#0B1222", border: `2px solid ${C.line}`, opacity: prog(t, 219.4, 220.0) }}>
        <div style={{ width: `${Math.max(0.5, fill * 100)}%`, height: "100%", borderRadius: 12, background: `linear-gradient(90deg, ${C.blue}, ${C.green})` }} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 656, width: 1600, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.green, opacity: done }}>
        100% Module 7 String &amp; Temporal Mastered
      </div>

      <div style={{ position: "absolute", left: 160, top: 704, width: 1600, display: "flex", justifyContent: "center", gap: 20 }}>
        {SKILLS.map((s, i) => {
          const e = eb(t, s.a, s.a + 0.6);
          return (
            <div key={i} style={{ width: 360, height: 84, borderRadius: 20, background: `${s.c}16`, border: `2.5px solid ${s.c}`, textAlign: "center", opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 40}px)` }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: s.c, marginTop: 8 }}>{s.t}</div>
              <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 22, color: C.text, direction: "rtl" }}>{s.ar}</div>
            </div>
          );
        })}
      </div>

      {(() => {
        const e = eb(t, 229.0, 229.8);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 210, top: 818, width: 700, height: 160, borderRadius: 26, background: `${C.blue}14`, border: `3px solid ${C.blue}`, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`, padding: "14px 30px" }}>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", textAlign: "right" }}>الشيتات والتمارين التطبيقية</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim, marginTop: 4 }}>missing-values control scripts · practice sheets</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 31, color: C.blue, marginTop: 10, textDecoration: "underline", textUnderlineOffset: 8 }}>solutions.gomaaintelligence.me</div>
          </div>
        );
      })()}

      {(() => {
        const e = eb(t, 232.5, 233.3);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 950, top: 818, width: 760, height: 160, borderRadius: 26, background: `${C.violet}14`, border: `3px solid ${C.violet}`, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`, padding: "12px 30px" }}>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 24, color: C.violet, direction: "rtl", textAlign: "right" }}>الدرس القادم · الوحدة الثامنة</div>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 29, color: C.text, direction: "rtl", textAlign: "right" }}>الدرس 29: التعبير الشرطي المنطقي</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.violet, marginTop: 2 }}>CASE WHEN</div>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 19, color: C.dim, marginTop: 4, whiteSpace: "pre", lineHeight: 1.5, opacity: prog(t, 236.4, 237.0) }}>{"CASE WHEN … THEN … ELSE … END"}</div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
