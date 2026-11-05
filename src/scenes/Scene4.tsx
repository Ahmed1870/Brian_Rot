import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine } from "../components/common";
import { C, eb, eio, eo, fmt, prog, useT, win } from "../lib";

const LANES = [
  { k: "val1", v: "'0122334455'", n: "phone", y: 300 },
  { k: "val2", v: "'0109876543'", n: "mobile", y: 420 },
  { k: "val3", v: "'N/A'", n: "default", y: 540 },
];

export const Scene4: React.FC = () => {
  const t = useT();
  const probeX = 330 + 160 * eio(t, 145.9, 147.4);
  const found = t > 148.8;
  const cut = (i: number) => (i === 0 ? 0 : eb(t, 149.4 + (i - 1) * 0.3, 149.9 + (i - 1) * 0.3));
  const ramIn = eo(t, 153.5, 154.3);
  const rows = Math.round(2000000 * eio(t, 163.0, 168.0));
  const slices = Math.floor(Math.max(0, t - 156.5) * 6);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 560, top: 112, width: 800, height: 50, borderRadius: 999, border: `2px solid ${C.blue}77`, background: "#0B1B33", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "46px", color: C.blue, opacity: win(t, 135.0, 174.8, 0.6) }}>
        PostgreSQL 16 · Evaluation Engine
      </div>

      {/* intro */}
      {win(t, 135.0, 145.2, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 200, width: 1030, textAlign: "center", opacity: win(t, 135.0, 145.2, 0.5) }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 52, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 135.0, 136.0)) * 40}px)` }}>
            بدون أي جهد إضافي
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.green, marginTop: 24, opacity: prog(t, 142.4, 143.2) }}>Short-Circuit Evaluation</div>
        </div>
      )}

      {/* COALESCE evaluator */}
      {t > 145.4 && (
        <div style={{ position: "absolute", left: 70, top: 190, width: 1030, height: 520, opacity: eo(t, 145.4, 146.0), borderRadius: 24, background: C.card2, border: `2.5px solid ${found ? C.green : C.blue}` }}>
          <div style={{ margin: "18px 0 0 30px" }}>
            <CodeLine text="COALESCE(val1, val2, val3)" fs={30} />
          </div>
        </div>
      )}
      {t > 145.6 &&
        LANES.map((l, i) => {
          const cc = cut(i);
          const dead = i > 0 && cc > 0;
          const hot = i === 0 && found;
          return (
            <div key={l.k}>
              <div style={{ position: "absolute", left: 100, top: l.y, width: 970, height: 84, borderRadius: 16, background: dead ? "#0B1222" : hot ? `${C.green}1E` : "#1B2740", border: `3px solid ${dead ? C.line : hot ? C.green : C.blue}`, opacity: dead ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.text }}>
                <span style={{ color: hot ? C.green : C.blue }}>{l.k}</span>
                <span>{l.v}</span>
                <span style={{ fontSize: 20, color: C.dim }}>{l.n}</span>
              </div>
              {dead && (
                <div style={{ position: "absolute", left: 100, top: l.y, width: 970, height: 84, borderRadius: 16, background: `${C.red}10`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 26, lineHeight: "80px", color: C.red, opacity: Math.min(1, cc * 1.5) }}>
                  ✂ skipped — never evaluated
                </div>
              )}
            </div>
          );
        })}
      {t > 145.9 && t < 150 && (
        <div style={{ position: "absolute", left: probeX - 15, top: LANES[0].y + 27, width: 30, height: 30, borderRadius: 15, background: found ? C.green : C.blue, border: "3px solid #fff", boxShadow: `0 0 16px ${found ? C.green : C.blue}`, opacity: win(t, 145.9, 150, 0.2) }} />
      )}
      {found && (
        <div style={{ position: "absolute", left: 100, top: 636, width: 970, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.green, opacity: prog(t, 148.8, 149.4) }}>
          first non-NULL found ➔ STOP
        </div>
      )}
      {t > 150.3 && (
        <div style={{ position: "absolute", left: 440, top: 722, width: 260, height: 64, borderRadius: 16, background: `${C.green}1E`, border: `3px solid ${C.green}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, lineHeight: "58px", color: C.green, opacity: prog(t, 150.3, 150.9), transform: `scale(${0.8 + 0.2 * eb(t, 150.3, 151.0)})` }}>
          0.0001 s
        </div>
      )}

      {/* RAM panel */}
      {ramIn > 0 && (
        <div style={{ position: "absolute", left: 1140, top: 190, width: 710, height: 520, opacity: ramIn, transform: `translateX(${(1 - ramIn) * 140}px)`, borderRadius: 24, background: "#0B1222", border: `3px solid ${C.blue}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.blue, margin: "18px 0 0 28px" }}>RAM execution</div>
          {[
            { a: 154.1, s: "NULLIF ✓ short-circuit", c: C.green },
            { a: 154.6, s: "GREATEST ✓ in memory", c: C.amber },
          ].map((p, i) => (
            <div key={p.s} style={{ position: "absolute", left: 28 + i * 0, top: 80 + i * 66, width: 654, height: 54, borderRadius: 14, background: `${p.c}18`, border: `2.5px solid ${p.c}`, fontFamily: MONO, fontWeight: 700, fontSize: 23, lineHeight: "50px", paddingLeft: 20, color: p.c, opacity: prog(t, p.a, p.a + 0.4) }}>
              {p.s}
            </div>
          ))}
          <div style={{ position: "absolute", left: 28, top: 232, display: "flex", gap: 8, flexWrap: "wrap", width: 654 }}>
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: 6, background: i < slices ? C.blue : "#17223A", border: `2px solid ${i < slices ? C.blue : C.line}` }} />
            ))}
          </div>
          {t > 158.4 && (
            <div style={{ position: "absolute", left: 28, top: 330, width: 654, height: 64, borderRadius: 14, border: `2.5px dashed ${C.dim}`, fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "60px", textAlign: "center", color: C.dim, opacity: prog(t, 158.4, 159.0) }}>
              <span style={{ textDecoration: "line-through" }}>DISK read</span> · Zero Disk I/O ✓
            </div>
          )}
          {t > 163.0 && (
            <div style={{ position: "absolute", left: 28, top: 414, width: 654, textAlign: "center", opacity: prog(t, 163.0, 163.6) }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.green }}>{fmt(rows)} rows</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.dim }}>response &lt; 1 ms</div>
            </div>
          )}
        </div>
      )}

      {win(t, 170.2, 175.2, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 808, width: 1780, textAlign: "center", opacity: win(t, 170.2, 175.2, 0.4), fontFamily: AR, fontWeight: 900, fontSize: 38, color: C.text, direction: "rtl" }}>
          أول قيمة تنفع = <span style={{ color: C.green }}>توقف فوراً</span> · كله في الـ <span style={{ color: C.blue, fontFamily: MONO }}>RAM</span>
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={141.4} b={152.6} color={C.blue} fs={25}>
        PostgreSQL Evaluation Engine ──► Short-Circuit Logic in COALESCE &amp; NULLIF
      </Banner>
      <Banner x={70} y={900} w={1780} a={153.4} b={169.6} color={C.green} fs={25}>
        Memory Execution ──► Zero Disk I/O &amp; Sub-Millisecond CPU Response
      </Banner>
    </AbsoluteFill>
  );
};
