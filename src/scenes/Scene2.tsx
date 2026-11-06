import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eo, prog, typed, useT, win } from "../lib";

// [total_sales, qty]
const DATA: [number, number][] = [
  [500, 5],
  [300, 0],
  [240, 4],
];
const PX = [70, 980], PW = 870, PY = 190, PH = 500;
const ROWY = (i: number) => 150 + i * 62;

const Table: React.FC<{ x: number; resHead: string; res: (i: number) => { v: string; c: string } | null; hot?: number }> = ({ resHead, res, hot = -1 }) => (
  <>
    <div style={{ position: "absolute", left: 26, top: 112, width: 820, display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.dim }}>
      <span>total_sales</span>
      <span>qty</span>
      <span>{resHead}</span>
    </div>
    {DATA.map(([s, q], i) => {
      const r = res(i);
      return (
        <div key={i} style={{ position: "absolute", left: 18, top: ROWY(i), width: 834, height: 52, borderRadius: 12, background: i === hot ? `${C.amber}1E` : "#1B2740", border: `2px solid ${i === hot ? C.amber : C.line}`, display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", alignItems: "center", padding: "0 8px 0 8px", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.text }}>
          <span style={{ paddingLeft: 10 }}>{s}</span>
          <span style={{ color: q === 0 ? C.red : C.text }}>{q}</span>
          <span style={{ color: r ? r.c : C.dim }}>{r ? r.v : "…"}</span>
        </div>
      );
    })}
  </>
);

export const Scene2: React.FC = () => {
  const t = useT();
  const shake = t > 50.5 && t < 51.3 ? Math.sin((t - 50.5) * 90) * 9 * (1 - prog(t, 50.5, 51.3)) : 0;
  const crash = t >= 50.5;

  const leftRes = (i: number) => {
    if (i === 0) return t > 49.2 ? { v: "100.00", c: "#6EE7B7" } : null;
    if (i === 1) return crash ? { v: "ERROR ✕", c: C.red } : null;
    return crash ? { v: "— not executed", c: C.dim } : null;
  };
  const rightRes = (i: number) => {
    const a = [65.2, 66.2, 68.2][i];
    if (t < a) return null;
    if (i === 0) return { v: "100.00", c: "#6EE7B7" };
    if (i === 1) return t > 66.9 ? { v: "NULL  ✓ safe", c: C.green } : { v: "NULLIF(0,0) …", c: C.amber };
    return { v: "60.00", c: "#6EE7B7" };
  };

  return (
    <AbsoluteFill>
      {/* LEFT: unprotected */}
      <div style={{ opacity: eo(t, 45.4, 46.1), transform: `translateX(${shake}px)` }}>
        <Window x={PX[0]} y={PY} w={PW} h={PH} title="without protection" color={crash ? C.red : C.blue} glow={crash ? 1 : 0}>
          <div style={{ position: "absolute", left: 26, top: 16 }}>
            <CodeLine text={typed("SELECT total_sales / qty AS unit_price", t, 46.1, 48.6)} fs={22} caret={t < 48.7} />
          </div>
          <div style={{ position: "absolute", left: 26, top: 56 }}>
            <CodeLine text={typed("FROM sales;", t, 48.6, 49.2)} fs={22} caret={t >= 48.6 && t < 49.3} />
          </div>
          <Table x={0} resHead="unit_price" res={leftRes} hot={crash ? 1 : -1} />
          {crash && (
            <div style={{ position: "absolute", left: 18, top: 342, width: 834, height: 78, borderRadius: 16, background: `${C.red}1E`, border: `3px solid ${C.red}`, opacity: prog(t, 50.5, 50.9), padding: "10px 22px" }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.red }}>{typed("ERROR: division by zero", t, 50.6, 52.4)}</div>
              <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 22, color: C.text, direction: "rtl", opacity: prog(t, 52.4, 52.9) }}>انهيار — التنفيذ وقف فوراً</div>
            </div>
          )}
        </Window>
      </div>

      {/* RIGHT: NULLIF truth table, then protected query */}
      {win(t, 53.6, 59.3, 0.4) > 0 && (
        <div style={{ position: "absolute", left: PX[1], top: PY, width: PW, height: PH, opacity: win(t, 53.6, 59.3, 0.4), borderRadius: 22, background: "#0B1222", border: `2.5px solid ${C.green}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.green, margin: "22px 0 0 30px" }}>NULLIF(a, b)</div>
          {[
            { a: 55.4, l: "NULLIF(5, 5)", r: "NULL", c: C.green, n: "متساويتين ➔ NULL" },
            { a: 58.0, l: "NULLIF(5, 0)", r: "5", c: C.blue, n: "مختلفتين ➔ القيمة الأولى" },
          ].map((row, i) => {
            const e = eb(t, row.a, row.a + 0.5);
            return (
              <div key={i} style={{ position: "absolute", left: 28, top: 100 + i * 150, width: 814, height: 124, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - Math.min(1, e)) * 100}px)`, borderRadius: 18, background: `${row.c}16`, border: `3px solid ${row.c}`, padding: "14px 26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.text }}>
                  <span>{row.l}</span>
                  <span style={{ color: row.c }}>➔ {row.r}</span>
                </div>
                <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, direction: "rtl", marginTop: 10 }}>{row.n}</div>
              </div>
            );
          })}
        </div>
      )}
      {t > 59.3 && (
        <div style={{ opacity: eo(t, 59.3, 60.0) }}>
          <Window x={PX[1]} y={PY} w={PW} h={PH} title="with NULLIF" color={C.green} glow={t > 65 ? 1 : 0}>
            <div style={{ position: "absolute", left: 26, top: 16 }}>
              <CodeLine text={typed("SELECT total_sales / NULLIF(qty, 0) AS unit_price", t, 60.0, 63.6)} fs={20} caret={t < 63.7} />
            </div>
            <div style={{ position: "absolute", left: 26, top: 56 }}>
              <CodeLine text={typed("FROM sales;", t, 63.6, 64.4)} fs={22} caret={t >= 63.6 && t < 64.5} />
            </div>
            <Table x={0} resHead="unit_price" res={rightRes} hot={t > 66.2 && t < 71 ? 1 : -1} />
            {t > 66.5 && (
              <div style={{ position: "absolute", left: 18, top: 342, width: 834, height: 78, borderRadius: 16, background: `${C.green}1A`, border: `3px solid ${C.green}`, opacity: prog(t, 66.5, 67.1), padding: "10px 22px" }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, color: C.green }}>qty 0 ➔ NULL ➔ total ÷ NULL = NULL</div>
                <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 22, color: C.text, direction: "rtl", opacity: prog(t, 71.0, 71.6) }}>بدون خطأ وبدون وقف التنفيذ</div>
              </div>
            )}
          </Window>
        </div>
      )}

      {/* shield */}
      {t > 71.2 && (
        <div style={{ position: "absolute", left: 980, top: 716, width: 870, height: 84, borderRadius: 18, background: `${C.green}1E`, border: `3px solid ${C.green}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: "78px", color: C.green, opacity: prog(t, 71.2, 71.8), transform: `scale(${0.9 + 0.1 * eb(t, 71.2, 71.9)})` }}>
          ZERO-DIVISION SHIELD ✓
        </div>
      )}
      {t > 79.7 && (
        <div style={{ position: "absolute", left: 70, top: 716, width: 870, height: 84, borderRadius: 18, background: `${C.green}16`, border: `3px solid ${C.green}`, textAlign: "center", fontFamily: AR, fontWeight: 900, fontSize: 34, lineHeight: "78px", color: C.text, direction: "rtl", opacity: prog(t, 79.7, 80.3) }}>
          حماية من الانهيار المفاجئ
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={46.0} b={64.6} color={C.red} fs={26}>
        total / 0 ──► ERROR: division by zero (System Crash)
      </Banner>
      <Banner x={70} y={900} w={1780} a={65.0} b={85.8} color={C.green} fs={26}>
        total / NULLIF(qty, 0) ──► Safely Produces NULL (Zero-Division Safe)
      </Banner>
    </AbsoluteFill>
  );
};
