import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, fmt, prog, typed, useT, win } from "../lib";

const LINES: [string, number, number][] = [
  ["BEGIN;", 182.4, 183.2],
  ["SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;", 183.4, 185.8],
  ["SELECT SUM(total_amount) FROM store_orders;  -- Consistent snapshot across execution", 185.8, 189.6],
  ["COMMIT;", 198.0, 198.8],
];
const BRANCHES = ["Cairo", "Alexandria", "Giza", "Mansoura", "Luxor", "Aswan", "Tanta", "Suez"];
const BASE = 12480350;

export const Scene5: React.FC = () => {
  const t = useT();
  const typing = (t > 182.4 && t < 189.7) || (t > 198 && t < 198.9);
  const caret = LINES.findIndex(([, a, b]) => t >= a && t < b);
  const intro = win(t, 170.8, 181.8, 0.5);
  const live = t > 189.9 ? BASE + Math.floor((t - 189.9) * 4300) : BASE;
  const stamp = eb(t, 196.2, 196.8);

  return (
    <AbsoluteFill>
      {intro > 0 && (
        <div style={{ position: "absolute", left: 160, top: 300, width: 1600, textAlign: "center", opacity: intro }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 60, color: C.text, direction: "rtl", transform: `translateY(${(1 - eo(t, 170.8, 171.9)) * 40}px)` }}>
            تقارير المبيعات والمخازن <span style={{ color: C.green }}>الختامية</span>
          </div>
          <div style={{ marginTop: 28, display: "inline-block", padding: "12px 40px", borderRadius: 18, border: `3px solid ${C.violet}`, background: `${C.violet}18`, fontFamily: MONO, fontWeight: 700, fontSize: 36, color: C.violet, opacity: prog(t, 176.9, 177.5), transform: `scale(${0.85 + 0.15 * eb(t, 176.9, 177.6)})` }}>
            REPEATABLE READ
          </div>
        </div>
      )}

      {t > 181.9 && (
        <div style={{ opacity: eo(t, 181.9, 182.5), transform: `translateX(${(1 - eo(t, 181.9, 182.6)) * -100}px)` }}>
          <Window x={70} y={150} w={1000} h={300} title="audit_report.sql" glow={typing ? 1 : 0}>
            {LINES.map(([txt, a, b], i) => {
              const s = typed(txt, t, a, b);
              return s.length > 0 ? (
                <div key={i} style={{ position: "absolute", left: 22, top: 18 + i * 56 }}>
                  <CodeLine text={s} fs={18} caret={caret === i} />
                </div>
              ) : null;
            })}
          </Window>
        </div>
      )}

      {/* LIVE vs REPORT */}
      {t > 189.9 && (
        <>
          <div style={{ position: "absolute", left: 70, top: 490, width: 490, height: 220, borderRadius: 22, background: `${C.amber}14`, border: `3px solid ${C.amber}`, opacity: prog(t, 189.9, 190.5), textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.amber, marginTop: 18 }}>LIVE total · changing</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.text, marginTop: 28 }}>{fmt(live)}</div>
            <div style={{ fontFamily: MONO, fontSize: 19, color: C.dim, marginTop: 14 }}>new sales every millisecond</div>
          </div>
          <div style={{ position: "absolute", left: 580, top: 490, width: 490, height: 220, borderRadius: 22, background: `${C.green}14`, border: `3px solid ${C.green}`, boxShadow: `0 0 18px ${C.green}55`, opacity: prog(t, 190.3, 190.9), textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.green, marginTop: 18 }}>REPORT total · snapshot</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: "#6EE7B7", marginTop: 28 }}>{fmt(BASE)}</div>
            <div style={{ fontFamily: MONO, fontSize: 19, color: C.dim, marginTop: 14 }}>stable for the whole transaction</div>
          </div>
        </>
      )}
      {win(t, 194.2, 207.6, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 735, width: 1000, display: "flex", gap: 20, justifyContent: "center", opacity: win(t, 194.2, 207.6, 0.4) }}>
          {[{ a: 194.5, s: "STABLE ✓" }, { a: 195.9, s: "100% MATCH ✓" }, { a: 197.0, s: "ZERO ACCOUNTING CONFLICTS ✓" }].map((p) => (
            <div key={p.s} style={{ padding: "8px 22px", borderRadius: 14, border: `3px solid ${C.green}`, background: `${C.green}18`, fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.green, opacity: prog(t, p.a, p.a + 0.4) }}>
              {p.s}
            </div>
          ))}
        </div>
      )}

      {/* branch feed */}
      {t > 189.6 && (
        <div style={{ position: "absolute", left: 1110, top: 150, width: 740, height: 560, opacity: eo(t, 189.6, 190.4), borderRadius: 24, background: C.card2, border: `2.5px solid ${C.amber}88` }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", textAlign: "right", margin: "14px 26px 0 0" }}>مئات الفروع بتسجل مبيعات</div>
          {BRANCHES.map((b, i) => {
            const n = Math.floor((t - 189.9) * (3 + (i % 4)) + i * 7);
            const blink = Math.sin(t * 8 + i * 1.7) > 0.6;
            return (
              <div key={b} style={{ position: "absolute", left: 20, top: 74 + i * 59, width: 700, height: 50, borderRadius: 10, background: blink ? `${C.amber}22` : "#1B2740", border: `2px solid ${blink ? C.amber : C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.text }}>
                <span>{b}</span>
                <span style={{ color: C.amber }}>+{Math.max(0, n)} sales</span>
              </div>
            );
          })}
        </div>
      )}

      {stamp > 0 && (
        <div style={{ position: "absolute", left: 700, top: 360, width: 340, height: 100, borderRadius: 14, border: `6px solid ${C.green}`, color: C.green, fontFamily: MONO, fontWeight: 700, fontSize: 25, textAlign: "center", lineHeight: "44px", paddingTop: 4, background: "#0B1222E0", transform: `rotate(-8deg) scale(${1.6 - 0.6 * stamp})`, opacity: Math.min(1, stamp * 1.5) * (1 - prog(t, 205.0, 205.6)) }}>
          AUDIT REPORT
          <br />
          100% CONSISTENT ✓
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={172.0} b={189.6} color={C.violet} fs={25}>
        Enterprise Financial Reporting ──► Repeatable Read Isolation Safeguard
      </Banner>
      <Banner x={70} y={900} w={1780} a={190.0} b={208.8} color={C.green} fs={25}>
        Production Analytics ──► 100% Consistent Audit Reports Under Heavy Concurrency
      </Banner>
    </AbsoluteFill>
  );
};
