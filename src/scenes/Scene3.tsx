import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, prog, typed, useT, win } from "../lib";

const PURPLE = "#A855F7";
type Lv = { k: string; c: string; y: number; x: number; a: number; on: number; prev: [boolean, boolean, boolean] };
const LEVELS: Lv[] = [
  { k: "SERIALIZABLE", c: C.green, y: 190, x: 1080, a: 111.3, on: 116.1, prev: [true, true, true] },
  { k: "REPEATABLE READ", c: PURPLE, y: 350, x: 1040, a: 101.7, on: 108.2, prev: [true, true, true] },
  { k: "READ COMMITTED", c: C.blue, y: 510, x: 1000, a: 94.7, on: 96.3, prev: [true, false, false] },
];
const ANOM = ["Dirty", "Non-Rep", "Phantom"];
const CW = 770, CH = 140;

export const Scene3: React.FC = () => {
  const t = useT();
  const lvl = t < 108.2 ? "READ COMMITTED" : t < 116.1 ? "REPEATABLE READ" : "SERIALIZABLE";
  const setLine = t < 107.4 ? typed("SET TRANSACTION ISOLATION LEVEL READ COMMITTED;", t, 89.8, 93.2) : t < 115.3 ? typed("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;", t, 107.4, 109.4) : typed("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;", t, 115.3, 117.0);
  const comment = t > 116.6 ? "-- strict sequential equivalence" : t > 109.6 ? "-- stable reports, no phantoms" : t > 96.8 ? "-- default level" : "";
  const begin = typed("BEGIN;", t, 86.9, 87.8);
  const typing = (t > 86.9 && t < 93.3) || (t > 107.4 && t < 109.5) || (t > 115.3 && t < 117.1);
  const activeIdx = lvl === "SERIALIZABLE" ? 0 : lvl === "REPEATABLE READ" ? 1 : 2;
  const slider = eio(t, 121.1, 127.0);

  return (
    <AbsoluteFill>
      {t > 86.6 && (
        <div style={{ opacity: eo(t, 86.6, 87.3), transform: `translateX(${(1 - eo(t, 86.6, 87.4)) * -100}px)` }}>
          <Window x={70} y={190} w={900} h={300} title="isolation_level.sql" glow={typing ? 1 : 0}>
            <div style={{ position: "absolute", left: 26, top: 20 }}>
              <CodeLine text={begin} fs={24} caret={t < 88.0} />
            </div>
            <div style={{ position: "absolute", left: 26, top: 66 }}>
              <CodeLine text={setLine} fs={22} caret={typing && t > 89.8} />
            </div>
            <div style={{ position: "absolute", left: 26, top: 114 }}>
              <CodeLine text={comment} fs={20} />
            </div>
            {t > 90.7 && t < 94.6 && (
              <div style={{ position: "absolute", left: 26, top: 170, fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.dim, direction: "rtl", opacity: win(t, 90.7, 94.6, 0.3) }}>
                فور كتابة <span style={{ fontFamily: MONO, color: C.blue }}>BEGIN</span> نحدد مستوى العزل
              </div>
            )}
          </Window>
        </div>
      )}

      {/* ladder */}
      {LEVELS.map((l, i) => {
        const e = eb(t, 90.2 + (2 - i) * 0.4, 90.9 + (2 - i) * 0.4);
        if (e <= 0) return null;
        const on = i === activeIdx && t >= l.on;
        const reached = t >= l.on;
        return (
          <div key={l.k} style={{ position: "absolute", left: l.x, top: l.y, width: CW, height: CH, opacity: Math.min(1, e * 1.4) * (reached ? 1 : 0.5), transform: `translateX(${(1 - Math.min(1, e)) * 160}px)`, borderRadius: 22, background: `${l.c}${on ? "26" : "10"}`, border: `${on ? 5 : 2.5}px solid ${on ? l.c : `${l.c}88`}`, boxShadow: on ? `0 0 20px ${l.c}77` : "none", padding: "14px 26px" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: l.c }}>{l.k}{i === 2 ? "  (default)" : ""}</div>
            <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
              {ANOM.map((an, k) => (
                <div key={an} style={{ flex: 1, height: 52, borderRadius: 12, background: l.prev[k] ? `${C.green}22` : `${C.red}16`, border: `2px solid ${l.prev[k] ? C.green : `${C.red}99`}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "48px", color: l.prev[k] ? C.green : C.red }}>
                  {an} {l.prev[k] ? "✓" : "✕"}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {/* shield pointer */}
      {t > 96.3 && (
        <div style={{ position: "absolute", left: LEVELS[activeIdx].x - 52, top: LEVELS[activeIdx].y + 46, width: 50, fontFamily: MONO, fontWeight: 700, fontSize: 40, color: LEVELS[activeIdx].c, opacity: prog(t, 96.3, 96.8) }}>
          ▶
        </div>
      )}

      {/* performance vs isolation */}
      {win(t, 121.1, 128.8, 0.4) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 560, width: 900, opacity: win(t, 121.1, 128.8, 0.4) }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 32, color: C.text, direction: "rtl", textAlign: "center" }}>مرونة بين الأداء وقوة العزل</div>
          <div style={{ position: "relative", marginTop: 30, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${C.blue}, ${PURPLE}, ${C.green})` }}>
            <div style={{ position: "absolute", left: `${slider * 100}%`, top: -13, marginLeft: -20, width: 40, height: 40, borderRadius: 20, background: C.text, border: `4px solid ${C.amber}` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontFamily: MONO, fontWeight: 700, fontSize: 24 }}>
            <span style={{ color: C.blue }}>◀ PERFORMANCE</span>
            <span style={{ color: C.green }}>ISOLATION STRENGTH ▶</span>
          </div>
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={94.6} b={101.4} color={C.blue} fs={25}>
        Default ──► Read Committed Guarantees Committed Data Only
      </Banner>
      <Banner x={70} y={900} w={1780} a={101.8} b={111.0} color={PURPLE} fs={25}>
        SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
      </Banner>
      <Banner x={70} y={900} w={1780} a={111.4} b={128.8} color={C.green} fs={24}>
        Serializable ──► Highest Isolation Level (Guarantees Strict Sequential Execution)
      </Banner>
    </AbsoluteFill>
  );
};
