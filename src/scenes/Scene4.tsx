import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine } from "../components/common";
import { C, eb, eio, eo, fmt, lerp, prog, useT, win } from "../lib";

const LX = [70, 990];
const LY = 170, LW = 860, LH = 600;
const TEMP: [number, number][] = [
  [101, 1850],
  [102, 920],
  [103, 2400],
  [104, 610],
];

export const Scene4: React.FC = () => {
  const t = useT();
  const scanAct = win(t, 138.0, 145.7, 0.4);
  const flatAct = win(t, 145.7, 169.8, 0.4);
  const laneOp = (i: number) => {
    const base = eo(t, 130.4 + i * 0.4, 131.6 + i * 0.4);
    return base * (1 - (i === 0 ? flatAct : scanAct) * 0.55);
  };
  const gauge = eo(t, 143.0, 144.8) * 0.72;
  const flat = eio(t, 152.7, 157.6);
  const nodeA = eb(t, 138.6, 139.2);
  const nodeB = eb(t, 141.2, 141.8);
  const nodeC = eb(t, 142.0, 142.6);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 560, top: 112, width: 800, height: 50, borderRadius: 999, border: `2px solid ${C.blue}77`, background: "#0B1B33", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "46px", color: C.blue, opacity: win(t, 130.0, 174.8, 0.6) }}>
        PostgreSQL 16 · Optimizer Visualizer
      </div>

      {[0, 1].map((i) => {
        const c = i === 0 ? C.amber : C.green;
        const act = i === 0 ? scanAct : flatAct;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LX[i] + (i === 0 ? -1 : 1) * (1 - eo(t, 130.4 + i * 0.4, 131.8 + i * 0.4)) * 300,
              top: LY,
              width: LW,
              height: LH,
              opacity: laneOp(i),
              borderRadius: 28,
              background: `linear-gradient(170deg, ${c}${act > 0 ? "1E" : "0E"}, ${C.card2})`,
              border: `${act > 0 ? 4 : 2}px solid ${act > 0 ? c : C.line}`,
              boxShadow: act > 0 ? `0 0 20px ${c}55` : "none",
            }}
          >
            <div style={{ position: "absolute", left: 40, top: 24, fontFamily: MONO, fontWeight: 700, fontSize: i === 0 ? 44 : 38, color: c }}>{i === 0 ? "Subquery Scan" : "Subquery Flattening"}</div>
            <div style={{ position: "absolute", left: 40, top: 80, fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, direction: "rtl" }}>{i === 0 ? "استعلام معقد ➔ جدول مؤقت" : "استعلام بسيط ➔ دمج مباشر"}</div>

            {i === 0 && (
              <>
                {[
                  { y: 150, s: "Outer Query", c: C.blue, e: nodeA },
                  { y: 240, s: "Subquery Scan on customer_summary", c: C.amber, e: nodeB },
                  { y: 330, s: "inner: HashAggregate (orders)", c: C.violet, e: nodeC },
                ].map((n, k) => (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: 40,
                      top: n.y,
                      width: 400,
                      height: 62,
                      opacity: Math.min(1, n.e * 1.5),
                      transform: `translateX(${(1 - Math.min(1, n.e)) * -80}px)`,
                      borderRadius: 14,
                      background: `${n.c}1E`,
                      border: `2.5px solid ${n.c}`,
                      fontFamily: MONO,
                      fontWeight: 700,
                      fontSize: n.s.length > 28 ? 17 : 21,
                      lineHeight: "57px",
                      textAlign: "center",
                      color: C.text,
                    }}
                  >
                    {n.s}
                  </div>
                ))}
                {[0, 1].map((k) => (
                  <div key={k} style={{ position: "absolute", left: 238, top: 212 + k * 90, width: 4, height: 28, background: C.line, opacity: prog(t, 141.4 + k * 0.4, 141.9 + k * 0.4) }} />
                ))}
                {/* temp table */}
                <div style={{ position: "absolute", left: 480, top: 150, width: 340, height: 242, borderRadius: 18, background: "#0B1222", border: `2.5px solid ${C.amber}`, opacity: eo(t, 142.2, 143.0) }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.amber, margin: "8px 0 0 16px" }}>temp table · work_mem</div>
                  {TEMP.map(([id, v], k) => {
                    const e = eb(t, 142.6 + k * 0.5, 143.1 + k * 0.5);
                    return (
                      <div key={id} style={{ position: "absolute", left: 14, top: 46 + k * 48, width: 312, height: 40, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - Math.min(1, e)) * 60}px)`, borderRadius: 9, background: `${C.amber}1E`, border: `2px solid ${C.amber}88`, display: "flex", justifyContent: "space-between", padding: "0 14px", fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "36px", color: C.text }}>
                        <span>{id}</span>
                        <span>{fmt(v)}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ position: "absolute", left: 40, top: 470, width: 780 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim, display: "flex", justifyContent: "space-between" }}>
                    <span>work_mem</span>
                    <span style={{ color: C.amber }}>{gauge > 0.4 ? "RAM overhead ▲" : ""}</span>
                  </div>
                  <div style={{ marginTop: 8, height: 28, borderRadius: 14, background: "#0B1222", border: `2px solid ${C.line}` }}>
                    <div style={{ width: `${Math.max(0.6, gauge * 100)}%`, height: "100%", borderRadius: 12, background: C.amber }} />
                  </div>
                </div>
              </>
            )}

            {i === 1 && (
              <>
                {t > 148.9 && (
                  <div style={{ position: "absolute", left: 40, top: 140, width: 780, height: 270, borderRadius: 16, background: "#0B1222", border: `2px solid ${C.green}88`, opacity: prog(t, 148.9, 149.6) }}>
                    {/* nested form */}
                    <div style={{ opacity: 1 - flat, transform: `translateX(${flat * 40}px)` }}>
                      {["SELECT *", "FROM (", "   SELECT * FROM orders WHERE total_amount > 500", ") AS o", "WHERE o.customer_id = 7;"].map((s, k) => (
                        <div key={k} style={{ position: "absolute", left: 24, top: 16 + k * 46, opacity: k === 1 || k === 3 ? 1 - flat : 1, transform: k === 2 ? `translateX(${-flat * 44}px) translateY(${-flat * 46}px)` : undefined }}>
                          <CodeLine text={s} fs={20} />
                        </div>
                      ))}
                    </div>
                    {/* flattened form */}
                    <div style={{ opacity: flat }}>
                      {["SELECT *", "FROM orders", "WHERE total_amount > 500", "  AND customer_id = 7;"].map((s, k) => (
                        <div key={k} style={{ position: "absolute", left: 24, top: 16 + k * 46 }}>
                          <CodeLine text={s} fs={20} override={k >= 2 ? "#6EE7B7" : undefined} />
                        </div>
                      ))}
                    </div>
                    <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.green, opacity: prog(t, 157.4, 158.0) }}>inlined ✓</div>
                  </div>
                )}
                {t > 148.9 && (
                  <div style={{ position: "absolute", left: 40, top: 424, fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.dim, opacity: prog(t, 148.9, 149.6) }}>Query Planner ▸ simple subquery</div>
                )}
                {t > 158.0 && (
                  <div style={{ position: "absolute", left: 40, top: 462, width: 380, height: 56, borderRadius: 14, border: `2.5px dashed ${C.dim}`, fontFamily: MONO, fontWeight: 700, fontSize: 19, lineHeight: "52px", textAlign: "center", color: C.dim, opacity: prog(t, 158.0, 158.6) }}>
                    <span style={{ textDecoration: "line-through" }}>temp table</span> eliminated ✕
                  </div>
                )}
                {t > 160.0 && (
                  <div style={{ position: "absolute", left: 440, top: 462, width: 380, height: 56, borderRadius: 14, border: `2.5px solid ${C.green}`, background: `${C.green}16`, fontFamily: MONO, fontWeight: 700, fontSize: 19, lineHeight: "52px", textAlign: "center", color: C.green, opacity: prog(t, 160.0, 160.6) }}>
                    memory overhead = 0
                  </div>
                )}
                {t > 166.7 && (
                  <div style={{ position: "absolute", left: 40, top: 530, width: 780, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 46, color: C.green, opacity: prog(t, 166.7, 167.3), transform: `scale(${lerp(1.4, 1, eb(t, 166.7, 167.4))})` }}>
                    ⚡ 0.001 s
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* two techniques chip */}
      {win(t, 134.8, 138.0, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 560, top: 780, width: 800, textAlign: "center", opacity: win(t, 134.8, 138.0, 0.4), fontFamily: AR, fontWeight: 900, fontSize: 36, color: C.text, direction: "rtl" }}>
          تقنيتين في غاية الذكاء: <span style={{ color: C.amber, fontFamily: MONO }}>Scan</span> أو <span style={{ color: C.green, fontFamily: MONO }}>Flattening</span>
        </div>
      )}
      {win(t, 170.2, 175.2, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 808, width: 1780, textAlign: "center", opacity: win(t, 170.2, 175.2, 0.4), fontFamily: AR, fontWeight: 900, fontSize: 38, color: C.text, direction: "rtl" }}>
          المحرك بيختار بنفسه: <span style={{ color: C.amber }}>Scan للمعقد</span> · <span style={{ color: C.green }}>Flattening للبسيط</span>
        </div>
      )}

      <Banner x={70} y={808} w={1780} a={138.4} b={145.7} color={C.amber} fs={26}>
        Subquery Scan ──► Materializes Temporary Table in RAM (Complex Logic)
      </Banner>
      <Banner x={70} y={808} w={1780} a={146.0} b={169.8} color={C.green} fs={26}>
        Subquery Flattening ──► Optimizer Inlines Subquery to Eliminate Memory Overhead
      </Banner>
    </AbsoluteFill>
  );
};
