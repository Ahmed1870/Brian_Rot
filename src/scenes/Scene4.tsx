import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine } from "../components/common";
import { C, eb, eo, fmt, prog, typed, useT, win } from "../lib";

const PURPLE = "#A855F7";
const LX = [70, 990];
const LY = 170, LW = 860, LH = 600;
const ACC: [string, number][] = [["A-101", 1200], ["A-102", 850], ["A-103", 2300], ["A-104", 640]];

export const Scene4: React.FC = () => {
  const t = useT();
  const snapAct = win(t, 137.8, 150.8, 0.4);
  const ssiAct = win(t, 151.0, 169.9, 0.4);
  const laneOp = (i: number) => eo(t, 131.0 + i * 0.4, 132.2 + i * 0.4) * (1 - (i === 0 ? ssiAct : snapAct) * 0.5);
  const flash = t > 147.0 && t < 147.7 ? 1 - prog(t, 147.0, 147.7) : 0;
  const drift = (i: number) => (t > 148.2 ? Math.floor((t - 148.2) * (7 + i * 3)) * (i % 2 === 0 ? 5 : -3) : 0);
  const abort = eb(t, 156.2, 156.8);
  const err = eb(t, 158.8, 159.5);
  const retryLines = [
    "for attempt in range(3):",
    "    try:",
    "        run_transaction()",
    "        break",
    "    except SerializationFailure:  # 40001",
    "        continue",
  ];

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 560, top: 112, width: 800, height: 50, borderRadius: 999, border: `2px solid ${C.blue}77`, background: "#0B1B33", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "46px", color: C.blue, opacity: win(t, 130.8, 169.9, 0.6) }}>
        PostgreSQL 16 · MVCC Snapshot Engine
      </div>

      {[0, 1].map((i) => {
        const c = i === 0 ? C.blue : PURPLE;
        const act = i === 0 ? snapAct : ssiAct;
        return (
          <div key={i} style={{ position: "absolute", left: LX[i] + (i === 0 ? -1 : 1) * (1 - eo(t, 131.0 + i * 0.4, 132.4 + i * 0.4)) * 300, top: LY, width: LW, height: LH, opacity: laneOp(i), borderRadius: 28, background: `linear-gradient(170deg, ${c}${act > 0 ? "1E" : "0E"}, ${C.card2})`, border: `${act > 0 ? 4 : 2}px solid ${act > 0 ? c : C.line}`, boxShadow: act > 0 ? `0 0 20px ${c}55` : "none", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 40, top: 24, fontFamily: MONO, fontWeight: 700, fontSize: 38, color: c }}>{i === 0 ? "Snapshot Isolation" : "Serializable · SSI"}</div>
            <div style={{ position: "absolute", left: 40, top: 76, fontFamily: AR, fontWeight: 700, fontSize: 27, color: C.text, direction: "rtl" }}>{i === 0 ? "لقطة مجمدة بدون تعطيل القراءة" : "كشف التضارب وإلغاء معاملة"}</div>

            {i === 0 && (
              <>
                {/* live table */}
                <div style={{ position: "absolute", left: 40, top: 140, width: 380, height: 300, borderRadius: 18, background: "#0B1222", border: `2.5px solid ${C.amber}`, opacity: eo(t, 132.8, 133.6) }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.amber, margin: "8px 0 0 16px" }}>live table · changing</div>
                  {ACC.map(([id, v], k) => (
                    <div key={id} style={{ position: "absolute", left: 14, top: 48 + k * 60, width: 352, height: 50, borderRadius: 10, background: `${C.amber}18`, border: `2px solid ${C.amber}77`, display: "flex", justifyContent: "space-between", padding: "0 14px", fontFamily: MONO, fontWeight: 700, fontSize: 21, lineHeight: "46px", color: C.text }}>
                      <span>{id}</span>
                      <span style={{ color: C.amber }}>{fmt(v + drift(k))}</span>
                    </div>
                  ))}
                </div>
                {/* snapshot */}
                {t > 147.0 && (
                  <div style={{ position: "absolute", left: 440, top: 140, width: 380, height: 300, borderRadius: 18, background: "#0B1222", border: `3px solid ${C.blue}`, boxShadow: `0 0 18px ${C.blue}66`, opacity: prog(t, 147.0, 147.6) }}>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.blue, margin: "8px 0 0 16px" }}>snapshot · frozen ❄</div>
                    {ACC.map(([id, v], k) => (
                      <div key={id} style={{ position: "absolute", left: 14, top: 48 + k * 60, width: 352, height: 50, borderRadius: 10, background: `${C.blue}18`, border: `2px solid ${C.blue}77`, display: "flex", justifyContent: "space-between", padding: "0 14px", fontFamily: MONO, fontWeight: 700, fontSize: 21, lineHeight: "46px", color: C.text }}>
                        <span>{id}</span>
                        <span style={{ color: "#7DD3FC" }}>{fmt(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {flash > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, background: "#fff", opacity: flash * 0.6 }} />}
                {t > 138.2 && (
                  <div style={{ position: "absolute", left: 40, top: 470, padding: "8px 24px", borderRadius: 999, border: `2.5px solid ${C.blue}`, background: `${C.blue}18`, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.blue, opacity: prog(t, 138.2, 138.8) }}>MVCC · reads never block</div>
                )}
                {t > 148.2 && (
                  <div style={{ position: "absolute", left: 40, top: 530, width: 780, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.green, opacity: prog(t, 148.2, 148.8) }}>
                    transaction keeps reading from the snapshot ✓
                  </div>
                )}
              </>
            )}

            {i === 1 && (
              <>
                {t > 151.6 && (
                  <>
                    {[{ n: "Tx A", c: C.blue, x: 40 }, { n: "Tx B", c: PURPLE, x: 440 }].map((tx, k) => (
                      <div key={tx.n} style={{ position: "absolute", left: tx.x, top: 140, width: 380, height: 90, borderRadius: 16, background: `${tx.c}18`, border: `3px solid ${k === 1 && abort > 0.5 ? C.red : tx.c}`, opacity: k === 1 && abort > 0.5 ? 0.5 : prog(t, 151.6, 152.2), textAlign: "center" }}>
                        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: k === 1 && abort > 0.5 ? C.red : tx.c, marginTop: 8 }}>{tx.n}</div>
                        <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>{k === 1 && abort > 0.5 ? "cancelled ✕" : "reads & writes"}</div>
                      </div>
                    ))}
                    <div style={{ position: "absolute", left: 40, top: 250, width: 780, height: 70, borderRadius: 16, background: `${PURPLE}16`, border: `2.5px dashed ${PURPLE}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: "64px", color: PURPLE, opacity: prog(t, 153.2, 153.8) }}>
                      SSI · conflict check {t > 155.7 ? "⚠ cycle" : "…"}
                    </div>
                  </>
                )}
                {err > 0 && (
                  <div style={{ position: "absolute", left: 40, top: 340, width: 780, height: 80, borderRadius: 16, background: `${PURPLE}22`, border: `3px solid ${PURPLE}`, opacity: Math.min(1, err * 1.4), transform: `scale(${0.9 + 0.1 * Math.min(1, err)})`, padding: "8px 18px" }}>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: PURPLE }}>ERROR: 40001: could not serialize</div>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: PURPLE }}>access due to concurrent update</div>
                  </div>
                )}
                {t > 160.6 && (
                  <div style={{ position: "absolute", left: 40, top: 436, width: 780, height: 150, borderRadius: 16, background: "#0B1222", border: `2.5px solid ${C.green}`, padding: "6px 18px", opacity: prog(t, 160.6, 161.1) }}>
                    {retryLines.map((s, k) => {
                      const txt = typed(s, t, 160.8 + k * 0.9, 161.6 + k * 0.9);
                      return txt.length > 0 ? (
                        <div key={k} style={{ position: "absolute", left: 18, top: 6 + k * 23 }}>
                          <CodeLine text={txt} fs={16} />
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      {win(t, 132.4, 137.4, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 560, top: 790, width: 800, textAlign: "center", opacity: win(t, 132.4, 137.4, 0.4), fontFamily: AR, fontWeight: 900, fontSize: 36, color: C.text, direction: "rtl" }}>
          كواليس <span style={{ color: C.blue, fontFamily: MONO }}>PostgreSQL 16</span>
        </div>
      )}
      {t > 164.2 && (
        <div style={{ position: "absolute", left: 990, top: 790, width: 860, textAlign: "center", fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.green, direction: "rtl", opacity: prog(t, 164.2, 164.8) }}>
          Retry Loop في التطبيق ↻
        </div>
      )}

      <Banner x={70} y={850} w={1780} a={137.8} b={150.8} color={C.blue} fs={24}>
        Snapshot Isolation (MVCC) ──► Freezes Data State at Transaction Start
      </Banner>
      <Banner x={70} y={850} w={1780} a={151.2} b={169.8} color={PURPLE} fs={24}>
        Serialization Failure (40001) ──► Requires Client-Side Retry Logic
      </Banner>
    </AbsoluteFill>
  );
};
