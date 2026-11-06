import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine } from "../components/common";
import { C, eb, eio, eo, fmt, prog, useT, win } from "../lib";

const LX = [70, 990];
const LY = 170, LW = 860, LH = 600;

export const Scene4: React.FC = () => {
  const t = useT();
  const inlAct = win(t, 139.4, 158.6, 0.4);
  const bufAct = win(t, 158.8, 169.9, 0.4);
  const laneOp = (i: number) => eo(t, 130.4 + i * 0.4, 131.6 + i * 0.4) * (1 - (i === 0 ? bufAct : inlAct) * 0.5);
  const merge = eio(t, 150.7, 154.4);
  const buf = eo(t, 163.4, 165.6);
  const gauge = eo(t, 164.7, 166.4) * 0.55;
  const rows = Math.round(1000000 * eio(t, 163.6, 165.4));

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 560, top: 112, width: 800, height: 50, borderRadius: 999, border: `2px solid ${C.blue}77`, background: "#0B1B33", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "46px", color: C.blue, opacity: win(t, 130.2, 169.9, 0.6) }}>
        PostgreSQL 16 · Optimizer Plan
      </div>

      {[0, 1].map((i) => {
        const c = i === 0 ? C.blue : C.green;
        const act = i === 0 ? inlAct : bufAct;
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
            <div style={{ position: "absolute", left: 40, top: 24, fontFamily: MONO, fontWeight: 700, fontSize: 40, color: c }}>{i === 0 ? "CTE Inlining" : "CTE Scan Buffer"}</div>
            <div style={{ position: "absolute", left: 40, top: 80, fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, direction: "rtl" }}>{i === 0 ? "مرة واحدة ➔ دمج تلقائي" : "عدة مرات ➔ بافر في الذاكرة"}</div>

            {i === 0 && (
              <>
                {t > 143.4 && (
                  <div style={{ position: "absolute", left: 40, top: 140, width: 780, height: 250, borderRadius: 16, background: "#0B1222", border: `2px solid ${C.blue}88`, opacity: prog(t, 143.4, 144.0) }}>
                    <div style={{ opacity: 1 - merge }}>
                      {["WITH t AS (", "  SELECT * FROM orders WHERE total > 500", ")", "SELECT * FROM t WHERE customer_id = 7;"].map((s, k) => (
                        <div key={k} style={{ position: "absolute", left: 24, top: 16 + k * 46, opacity: k === 0 || k === 2 ? 1 - merge : 1, transform: k === 1 ? `translateY(${merge * 46}px)` : undefined }}>
                          <CodeLine text={s} fs={20} />
                        </div>
                      ))}
                    </div>
                    <div style={{ opacity: merge }}>
                      {["SELECT * FROM orders", "WHERE total > 500", "  AND customer_id = 7;"].map((s, k) => (
                        <div key={k} style={{ position: "absolute", left: 24, top: 16 + k * 46 }}>
                          <CodeLine text={s} fs={20} override={k >= 1 ? "#7DD3FC" : undefined} />
                        </div>
                      ))}
                    </div>
                    <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.blue, opacity: prog(t, 153.8, 154.4) }}>merged ✓</div>
                  </div>
                )}
                {t > 144.4 && (
                  <div style={{ position: "absolute", left: 40, top: 410, padding: "8px 22px", borderRadius: 999, border: `2.5px solid ${C.blue}`, background: `${C.blue}18`, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.blue, opacity: prog(t, 144.4, 145.0) }}>used ONCE · non-recursive</div>
                )}
                {t > 154.4 && (
                  <div style={{ position: "absolute", left: 40, top: 470, width: 380, height: 56, borderRadius: 14, border: `2.5px solid ${C.violet}`, background: `${C.violet}18`, fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "52px", textAlign: "center", color: C.violet, opacity: prog(t, 154.4, 155.0) }}>
                    SubPlan inside Query Planner
                  </div>
                )}
                {t > 155.9 && (
                  <div style={{ position: "absolute", left: 440, top: 470, width: 380, height: 56, borderRadius: 14, border: `2.5px solid ${C.green}`, background: `${C.green}18`, fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "52px", textAlign: "center", color: C.green, opacity: prog(t, 155.9, 156.5) }}>
                    Index Scan ✓ · no extra cost
                  </div>
                )}
              </>
            )}

            {i === 1 && (
              <>
                {t > 158.9 && (
                  <>
                    <div style={{ position: "absolute", left: 40, top: 150, width: 380, height: 70, borderRadius: 14, background: `${C.blue}16`, border: `2.5px solid ${C.blue}`, fontFamily: MONO, fontWeight: 700, fontSize: 22, lineHeight: "66px", textAlign: "center", color: C.text, opacity: prog(t, 158.9, 159.5) }}>
                      WITH totals AS (…)
                    </div>
                    {[0, 1].map((k) => (
                      <div key={k} style={{ position: "absolute", left: 440 + k * 0, top: 240 + k * 70, width: 380, height: 56, borderRadius: 12, background: "#1B2740", border: `2px solid ${C.line}`, fontFamily: MONO, fontWeight: 700, fontSize: 19, lineHeight: "52px", paddingLeft: 16, color: C.text, opacity: prog(t, 160.2 + k * 0.8, 160.8 + k * 0.8) }}>
                        {k === 0 ? "main query · use #1 → totals" : "main query · use #2 → totals"}
                      </div>
                    ))}
                    <div style={{ position: "absolute", left: 40, top: 240, fontFamily: AR, fontWeight: 900, fontSize: 28, color: C.amber, direction: "rtl", opacity: prog(t, 159.4, 160.0) }}>اتنادت عدة مرات</div>
                  </>
                )}
                {buf > 0 && (
                  <div style={{ position: "absolute", left: 40, top: 392, width: 780, height: 90, opacity: Math.min(1, buf * 1.5), transform: `scaleY(${0.5 + 0.5 * buf})`, transformOrigin: "top", borderRadius: 16, background: `${C.green}18`, border: `3px solid ${C.green}` }}>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.green, margin: "10px 0 0 22px" }}>CTE Scan · work_mem buffer</div>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.text, margin: "6px 0 0 22px" }}>{fmt(rows)} rows cached · computed ONCE</div>
                  </div>
                )}
                {t > 164.7 && (
                  <div style={{ position: "absolute", left: 40, top: 504, width: 780 }}>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.dim }}>work_mem</div>
                    <div style={{ marginTop: 6, height: 26, borderRadius: 13, background: "#0B1222", border: `2px solid ${C.line}` }}>
                      <div style={{ width: `${Math.max(1, gauge * 100)}%`, height: "100%", borderRadius: 11, background: C.green }} />
                    </div>
                  </div>
                )}
                {t > 168.0 && (
                  <div style={{ position: "absolute", left: 40, top: 556, width: 780, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.green, opacity: prog(t, 168.0, 168.6) }}>
                    ✓ no re-evaluation · fewer disk reads
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      {win(t, 131.4, 139.2, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 560, top: 790, width: 800, textAlign: "center", opacity: win(t, 131.4, 139.2, 0.5), fontFamily: AR, fontWeight: 900, fontSize: 36, color: C.text, direction: "rtl" }}>
          تطوّر مذهل في معالجة الـ <span style={{ color: C.blue, fontFamily: MONO }}>CTEs</span>
        </div>
      )}

      <Banner x={70} y={808} w={1780} a={139.5} b={158.5} color={C.blue} fs={25}>
        PostgreSQL 16 Optimizer ──► Automatic CTE Inlining for Single-Use CTEs
      </Banner>
      <Banner x={70} y={808} w={1780} a={158.9} b={169.8} color={C.green} fs={25}>
        CTE Scan Buffer ──► In-Memory Caching in work_mem for Multi-Use CTEs
      </Banner>
    </AbsoluteFill>
  );
};
