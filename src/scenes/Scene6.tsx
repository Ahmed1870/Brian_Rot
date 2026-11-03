import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Logo } from "../components/common";
import { C, eb, eio, eo, lerp, prog, useT } from "../lib";

const NX = (i: number) => 260 + i * 100;
const NY = 618;

const SKILLS = [
  { a: 218.7, t: "GROUP BY", ar: "تجميع فئوي", c: C.blue },
  { a: 220.9, t: "HAVING", ar: "تصفية المجموعات", c: C.green },
  { a: 222.5, t: "Execution Order", ar: "خط سير الاستعلام", c: C.violet },
  { a: 224.0, t: "PostgreSQL", ar: "Hash vs Group", c: C.amber },
];

export const Scene6: React.FC = () => {
  const t = useT();
  const cardIn = eo(t, 213.7, 215.0);
  const logoIn = eb(t, 215.2, 216.2);
  const pulse = 0.5; // constant: animated blur shadows are expensive to rasterise
  const glowOp = 0.7 + 0.3 * Math.sin(t * 2.4);
  const badge = eb(t, 216.6, 217.3);
  const check = prog(t, 216.9, 217.5);
  const filled = (i: number) => prog(t, 217.4 + i * 0.5, 217.9 + i * 0.5);
  const burst = eo(t, 224.6, 225.6);

  return (
    <AbsoluteFill>
      {/* glass card */}
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
          boxShadow: "none",
        }}
      />
      {/* logo + title */}
      <div style={{ position: "absolute", left: 840, top: 92, opacity: Math.min(1, logoIn * 1.4), transform: `scale(${0.7 + 0.3 * Math.min(1.1, logoIn)})`, transformOrigin: "center", willChange: "transform" }}>
        <div style={{ position: "absolute", left: -20, top: -20, width: 280, height: 280, borderRadius: 140, background: "radial-gradient(#38BDF83C, transparent 70%)", opacity: glowOp, willChange: "opacity" }} />
        <Logo size={240} style={{ position: "relative" }} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 336, width: 1600, textAlign: "center", opacity: prog(t, 215.6, 216.4), transform: `translateY(${(1 - eo(t, 215.6, 216.6)) * 30}px)` }}>
        <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 64, color: C.text, direction: "rtl", lineHeight: 1.15 }}>
          منظومة <span style={{ color: C.blue }}>أكاديمي</span>
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.blue, letterSpacing: 2 }}>Manzooma SQL Masterclass</div>
      </div>

      {/* completed badge */}
      <div
        style={{
          position: "absolute",
          left: 330,
          top: 488,
          width: 1260,
          height: 70,
          borderRadius: 999,
          background: `${C.green}1E`,
          border: `3px solid ${C.green}`,
          boxShadow: `0 0 ${Math.min(20, 30 + 14 * pulse)}px ${C.green}66`,
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
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 31, color: C.text }}>
          Lesson 14 Completed: <span style={{ color: C.green }}>GROUP BY &amp; HAVING Mastered</span>
        </span>
      </div>

      {/* lesson progress path */}
      <svg width={1600} height={170} viewBox="160 535 1600 170" style={{ position: "absolute", left: 160, top: 535 }}>
        <defs>
          <filter id="s6g" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <line x1={NX(0)} y1={NY} x2={NX(14)} y2={NY} stroke={C.line} strokeWidth={6} strokeLinecap="round" opacity={prog(t, 217.0, 217.6)} />
        <line x1={NX(0)} y1={NY} x2={lerp(NX(0), NX(13), eio(t, 217.4, 224.4))} y2={NY} stroke={C.green} strokeWidth={6} strokeLinecap="round" opacity={prog(t, 217.0, 217.6)} />
        {Array.from({ length: 15 }, (_, i) => {
          const f = i < 14 ? filled(i) : 0;
          const isNext = i === 14;
          const nextA = eb(t, 233.6, 234.4);
          if (isNext && nextA <= 0) return null;
          const r = 21;
          return (
            <g key={i} opacity={prog(t, 217.0 + i * 0.03, 217.4 + i * 0.03)}>
              {i === 13 && burst > 0 && <circle cx={NX(i)} cy={NY} r={r + 40 * burst} fill="none" stroke={C.green} strokeWidth={4} opacity={1 - burst} />}
              {i === 13 && f > 0 && <circle cx={NX(i)} cy={NY} r={r + 9} fill={C.green} opacity={0.28} />}
              <circle
                cx={NX(i)}
                cy={NY}
                r={isNext ? r * Math.min(1.1, nextA) : r}
                fill={f > 0 ? C.green : "#0B1222"}
                stroke={isNext ? C.blue : f > 0 ? C.green : C.line}
                strokeWidth={4}
                strokeDasharray={isNext ? "7 6" : undefined}
                opacity={isNext ? Math.min(1, nextA) : 1}
              />
              <text x={NX(i)} y={NY + 8} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={i >= 9 ? 19 : 22} fill={f > 0 ? "#07101F" : isNext ? C.blue : C.dim} opacity={isNext ? Math.min(1, nextA) : 1}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 160, top: 650, width: 1600, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.green, opacity: prog(t, 224.8, 225.6) }}>
        Grouped Aggregations Mastered
      </div>

      {/* skills */}
      <div style={{ position: "absolute", left: 160, top: 696, width: 1600, display: "flex", justifyContent: "center", gap: 20 }}>
        {SKILLS.map((s, i) => {
          const e = eb(t, s.a, s.a + 0.6);
          return (
            <div
              key={i}
              style={{
                width: 330,
                height: 84,
                borderRadius: 20,
                background: `${s.c}16`,
                border: `2.5px solid ${s.c}`,
                boxShadow: `0 0 20px ${s.c}44`,
                textAlign: "center",
                opacity: Math.min(1, e * 1.5),
                transform: `translateY(${(1 - Math.min(1, e)) * 40}px)`,
              }}
            >
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 27, color: s.c, marginTop: 8 }}>{s.t}</div>
              <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 23, color: C.text, direction: "rtl" }}>{s.ar}</div>
            </div>
          );
        })}
      </div>

      {/* resources */}
      {(() => {
        const e = eb(t, 229.4, 230.2);
        if (e <= 0) return null;
        return (
          <div
            style={{
              position: "absolute",
              left: 210,
              top: 806,
              width: 700,
              height: 170,
              borderRadius: 26,
              background: `${C.blue}14`,
              border: `3px solid ${C.blue}`,
              boxShadow: `0 0 ${Math.min(20, 28 + 14 * pulse)}px ${C.blue}55`,
              opacity: Math.min(1, e * 1.5),
              transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`,
              padding: "14px 30px",
            }}
          >
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", textAlign: "right" }}>الشيتات والتمارين التطبيقية</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim, marginTop: 4 }}>GROUP BY scripts · practice sheets</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 31, color: C.blue, marginTop: 10, textDecoration: "underline", textUnderlineOffset: 8 }}>solutions.gomaaintelligence.me</div>
          </div>
        );
      })()}

      {/* next lesson */}
      {(() => {
        const e = eb(t, 233.5, 234.3);
        if (e <= 0) return null;
        return (
          <div
            style={{
              position: "absolute",
              left: 950,
              top: 806,
              width: 760,
              height: 170,
              borderRadius: 26,
              background: `${C.violet}14`,
              border: `3px solid ${C.violet}`,
              boxShadow: `0 0 ${Math.min(20, 28 + 14 * pulse)}px ${C.violet}55`,
              opacity: Math.min(1, e * 1.5),
              transform: `translateY(${(1 - Math.min(1, e)) * 50}px)`,
              padding: "12px 30px",
            }}
          >
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 24, color: C.violet, direction: "rtl", textAlign: "right" }}>الدرس القادم</div>
            <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 29, color: C.text, direction: "rtl", textAlign: "right" }}>
              الدرس 15: دمج الدوال الشرطية مع التجميع
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.violet, marginTop: 2 }}>CASE WHEN in Aggregations</div>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 20, color: C.dim, marginTop: 4, whiteSpace: "pre", lineHeight: 1.5 }}>
              {"SUM(CASE WHEN total_amount > 500 THEN 1 ELSE 0 END)"}
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
