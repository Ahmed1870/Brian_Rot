import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner } from "../components/common";
import { C, eb, eo, prog, useT, win } from "../lib";

const PURPLE = "#A855F7";
const BW = 150, LA = 250, LB = 520, BAR_Y = 350;
// [x, label, time]
const A_OPS: [number, string, number][] = [[200, "BEGIN", 3.0], [640, "READ", 5.0], [1100, "WRITE", 8.0], [1500, "COMMIT", 11.0]];
const B_OPS: [number, string, number][] = [[420, "BEGIN", 4.0], [640, "WRITE", 6.5], [1100, "READ", 9.5], [1380, "COMMIT", 12.0]];

export const Scene1: React.FC = () => {
  const t = useT();
  const alert = win(t, 20.0, 40.0, 0.4);
  const pulse = 0.55 + 0.45 * Math.sin(t * 6);

  const block = (x: number, label: string, a: number, lane: "A" | "B") => {
    const e = eb(t, a, a + 0.6);
    if (e <= 0) return null;
    const c = lane === "A" ? C.blue : PURPLE;
    const y = lane === "A" ? LA : LB;
    const touches = label === "READ" || label === "WRITE";
    const hot = alert > 0 && touches && (x === 640 || x === 1100);
    return (
      <div key={lane + label + x}>
        {touches && (
          <div style={{ position: "absolute", left: x + BW / 2 - 3, top: lane === "A" ? y + 35 : BAR_Y + 70, width: 6, height: lane === "A" ? BAR_Y - y - 35 : y - 35 - (BAR_Y + 70), background: hot ? C.red : c, opacity: Math.min(1, e) }} />
        )}
        <div style={{ position: "absolute", left: x, top: y - 35, width: BW, height: 70, opacity: Math.min(1, e * 1.5), transform: `translateY(${(lane === "A" ? -1 : 1) * (1 - Math.min(1, e)) * 50}px)`, borderRadius: 14, background: `${hot ? C.red : c}22`, border: `3px solid ${hot ? C.red : c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "64px", color: C.text }}>
          {label}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 116, width: 1000, height: 58, opacity: win(t, 2.0, 18.0, 0.6), transform: `translateY(${(1 - prog(t, 2.0, 2.7)) * -24}px)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, borderRadius: 999, border: `2px solid ${C.blue}88`, background: "#0B1B33" }}>
        <span style={{ fontFamily: AR, fontWeight: 900, fontSize: 28, color: C.text, direction: "rtl" }}>مستويات العزل ومشكلات التزامن</span>
        <span style={{ color: C.blue, fontSize: 26 }}>|</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.blue }}>Isolation Levels &amp; Anomalies</span>
      </div>

      {/* lanes */}
      {[
        { y: LA, c: C.blue, n: "Tx A" },
        { y: LB, c: PURPLE, n: "Tx B" },
      ].map((l, i) => (
        <div key={l.n}>
          <div style={{ position: "absolute", left: 90, top: l.y - 3, width: 1700 * eo(t, 1.4 + i * 0.3, 3.0 + i * 0.3), height: 6, borderRadius: 3, background: l.c, opacity: 0.8 }} />
          <div style={{ position: "absolute", left: 90, top: l.y - 62, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: l.c, opacity: prog(t, 1.6, 2.2) }}>{l.n}</div>
        </div>
      ))}
      {/* shared table bar */}
      <div style={{ position: "absolute", left: 140, top: BAR_Y, width: 1640, height: 70, opacity: eo(t, 2.2, 3.0), borderRadius: 16, background: C.card2, border: `3px solid ${alert > 0 ? C.red : C.line}`, boxShadow: alert > 0 ? `0 0 ${Math.round(12 + 8 * pulse)}px ${C.red}` : "none", fontFamily: MONO, fontWeight: 700, fontSize: 26, lineHeight: "64px", color: C.text, textAlign: "center" }}>
        store_orders · shared table
      </div>
      {A_OPS.map(([x, l, a]) => block(x, l, a, "A"))}
      {B_OPS.map(([x, l, a]) => block(x, l, a, "B"))}

      {/* previous lessons */}
      {[
        { a: 11.5, s: "Transactions ✓", x: 140 },
        { a: 15.5, s: "Savepoints ✓", x: 470 },
      ].map((p) => {
        const e = eb(t, p.a, p.a + 0.5);
        return e > 0 ? (
          <div key={p.s} style={{ position: "absolute", left: p.x, top: 640, width: 300, height: 60, opacity: Math.min(1, e * 1.5) * (1 - prog(t, 19.5, 20.0)), transform: `scale(${0.8 + 0.2 * Math.min(1, e)})`, borderRadius: 16, background: `${C.green}18`, border: `3px solid ${C.green}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "54px", color: C.green }}>
            {p.s}
          </div>
        ) : null;
      })}
      {win(t, 6.0, 11.0, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 140, top: 640, fontFamily: AR, fontWeight: 900, fontSize: 40, color: C.text, direction: "rtl", opacity: win(t, 6.0, 11.0, 0.4) }}>الوحدة الثالثة عشرة · المعاملات والتحكم في التزامن</div>
      )}

      {/* alert + engine badges */}
      {alert > 0 && (
        <div style={{ position: "absolute", left: 140, top: 636, width: 640, height: 76, opacity: Math.min(1, alert), borderRadius: 18, background: `${C.red}1E`, border: `3px solid ${C.red}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, lineHeight: "70px", color: C.red, transform: `scale(${0.9 + 0.1 * eb(t, 20.0, 20.5)})` }}>
          ⚠ Concurrency Anomalies Alert
        </div>
      )}
      {t > 20.7 && (
        <div style={{ position: "absolute", left: 820, top: 636, width: 640, height: 76, opacity: Math.min(prog(t, 20.7, 21.3), 1), borderRadius: 18, background: `${C.green}1E`, border: `3px solid ${C.green}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, lineHeight: "70px", color: C.green, transform: `scale(${0.9 + 0.1 * eb(t, 20.7, 21.3)})` }}>
          Isolation Levels Engine
        </div>
      )}

      {/* hundreds of users */}
      {win(t, 25.6, 38.9, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 140, top: 740, width: 1640, height: 110, opacity: win(t, 25.6, 38.9, 0.5) }}>
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 30 + i * 70, top: 40 + Math.sin(t * 3 + i) * 12, width: 40, height: 40, borderRadius: 20, background: i % 2 === 0 ? `${C.blue}66` : `${PURPLE}66`, border: `2px solid ${i % 2 === 0 ? C.blue : PURPLE}` }} />
          ))}
          <div style={{ position: "absolute", left: 0, top: -4, width: 1640, textAlign: "center", fontFamily: AR, fontWeight: 900, fontSize: 30, color: C.text, direction: "rtl", opacity: prog(t, 25.9, 26.5) }}>مئات المستخدمين في نفس اللحظة</div>
        </div>
      )}
      {win(t, 31.1, 36.0, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 1480, top: 636, width: 300, height: 76, borderRadius: 18, background: `${C.red}1E`, border: `3px solid ${C.red}`, textAlign: "center", fontFamily: AR, fontWeight: 900, fontSize: 28, lineHeight: "70px", color: C.red, direction: "rtl", opacity: win(t, 31.1, 36.0, 0.4) }}>
          أخطاء محاسبية ✕
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={22.0} b={39.8} color={C.blue} fs={25}>
        Concurrent Transactions ──► Requires Isolation Safeguards Against Data Conflicts
      </Banner>
    </AbsoluteFill>
  );
};
