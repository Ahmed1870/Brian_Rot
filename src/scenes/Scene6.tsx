import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Logo } from "../components/common";
import { C, eb, eio, eo, prog, useT } from "../lib";

const PURPLE = "#A855F7";
const SKILLS = [
  { a: 213.2, t: "Anomalies", ar: "Dirty · Non-Repeatable · Phantom", c: C.red },
  { a: 214.4, t: "Isolation Levels", ar: "RC · RR · Serializable", c: C.blue },
  { a: 215.6, t: "Snapshot · SSI", ar: "لقطة مجمدة وكشف التضارب", c: PURPLE },
  { a: 216.7, t: "Retry on 40001", ar: "حلقة إعادة المحاولة", c: C.green },
];
const BAR_X = 260, BAR_W = 1400, BAR_Y = 618;

export const Scene6: React.FC = () => {
  const t = useT();
  const cardIn = eo(t, 209.1, 210.4);
  const logoIn = eb(t, 209.6, 210.6);
  const badge = eb(t, 211.0, 211.7);
  const check = prog(t, 211.3, 211.9);
  const fill = eio(t, 212.2, 217.6) * 0.75;
  const pct = Math.round(fill * 100);
  const done = prog(t, 217.8, 218.5);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 160, top: 70 + (1 - cardIn) * 80, width: 1600, height: 940, opacity: cardIn, borderRadius: 44, background: "linear-gradient(160deg, #1E293BCC 0%, #0F172AE6 55%, #0B1B33E6 100%)", border: `2px solid ${C.blue}55` }} />
      <div style={{ position: "absolute", left: 840, top: 92, opacity: Math.min(1, logoIn * 1.4), transform: `scale(${0.7 + 0.3 * Math.min(1.1, logoIn)})`, willChange: "transform" }}>
        <Logo size={240} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 336, width: 1600, textAlign: "center", opacity: prog(t, 210.0, 210.8), transform: `translateY(${(1 - eo(t, 210.0, 211.0)) * 30}px)` }}>
        <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", lineHeight: 1.15 }}>
          منظومة <span style={{ color: C.blue }}>أكاديمي</span>
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.blue, letterSpacing: 2 }}>Manzooma SQL Masterclass</div>
      </div>

      <div style={{ position: "absolute", left: 250, top: 488, width: 1420, height: 70, borderRadius: 999, background: `${C.green}1E`, border: `3px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: Math.min(1, badge * 1.5), transform: `scale(${0.85 + 0.15 * Math.min(1.1, badge)})` }}>
        <svg width={46} height={46} viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="21" fill={C.green} />
          <path d="M12 24 L20 32 L35 15" fill="none" stroke="#07101F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
        </svg>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, color: C.text }}>
          Lesson 55 Completed: <span style={{ color: C.green }}>Isolation Levels &amp; Concurrency Mastered</span>
        </span>
      </div>

      <div style={{ position: "absolute", left: BAR_X, top: BAR_Y - 44, width: BAR_W, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 21, opacity: prog(t, 212.0, 212.6) }}>
        <span style={{ color: C.dim }}>MODULE 13 · TRANSACTIONS &amp; CONCURRENCY CONTROL</span>
        <span style={{ color: C.green, fontSize: 28 }}>{pct}%</span>
      </div>
      <div style={{ position: "absolute", left: BAR_X, top: BAR_Y, width: BAR_W, height: 28, borderRadius: 14, background: "#0B1222", border: `2px solid ${C.line}`, opacity: prog(t, 212.0, 212.6) }}>
        <div style={{ width: `${Math.max(0.5, fill * 100)}%`, height: "100%", borderRadius: 12, background: `linear-gradient(90deg, ${C.blue}, ${C.green})` }} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 656, width: 1600, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.green, opacity: done }}>
        75% of Module 13 Completed · Isolation Levels &amp; Concurrency Mastered
      </div>

      <div style={{ position: "absolute", left: 160, top: 704, width: 1600, display: "flex", justifyContent: "center", gap: 20 }}>
        {SKILLS.map((s, i) => {
          const e = eb(t, s.a, s.a + 0.6);
          return (
            <div key={i} style={{ width: 360, height: 84, borderRadius: 20, background: `${s.c}16`, border: `2.5px solid ${s.c}`, textAlign: "center", opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 40}px)` }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, color: s.c, marginTop: 8 }}>{s.t}</div>
              <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 19, color: C.text, direction: "rtl" }}>{s.ar}</div>
            </div>
          );
        })}
      </div>

      {(() => {
        const e = eb(t, 221.2, 222.0);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 210, top: 818, width: 700, height: 160, borderRadius: 26, background: `${C.blue}14`, border: `3px solid ${C.blue}`, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`, padding: "14px 30px" }}>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", textAlign: "right" }}>الشيتات والتمارين التطبيقية</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim, marginTop: 4 }}>isolation level scripts · practice sheets</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 31, color: C.blue, marginTop: 10, textDecoration: "underline", textUnderlineOffset: 8 }}>solutions.gomaaintelligence.me</div>
          </div>
        );
      })()}

      {(() => {
        const e = eb(t, 225.3, 226.1);
        if (e <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 950, top: 818, width: 760, height: 160, borderRadius: 26, background: `${C.violet}14`, border: `3px solid ${C.violet}`, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`, padding: "12px 30px" }}>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 24, color: C.violet, direction: "rtl", textAlign: "right" }}>الدرس القادم · ختام الوحدة 13</div>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 29, color: C.text, direction: "rtl", textAlign: "right" }}>الدرس 56: أقفال الصفوف والجداول</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.violet, marginTop: 4, opacity: prog(t, 228.0, 228.6) }}>Row-Level &amp; Table-Level Locking</div>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 19, color: C.dim, marginTop: 4, opacity: prog(t, 231.3, 231.9) }}>SELECT … FOR UPDATE · LOCK TABLE</div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
