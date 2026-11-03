import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Arabic, Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, lerp, prog, typed, useT, win } from "../lib";

const rowTop = (i: number) => 18 + i * 40;

// 8 order rows: [id, amount, region, outcome]  outcome: 0 pass · 1 rejected by gate 1 · 2 rejected by gate 2
const ROWS: [number, number, string, number][] = [
  [501, 1200, "R1", 0],
  [502, 90, "R1", 1],
  [503, 860, "R2", 0],
  [504, 700, "R3", 2],
  [505, 430, "R1", 0],
  [506, 55, "R2", 1],
  [507, 980, "R2", 0],
  [508, 640, "R4", 2],
];
const S0 = 54.0, STEP = 1.1;
const X0 = 1075, G1 = 1330, G2 = 1480, XR = 1700, CHW = 175;

const chipState = (dt: number, outcome: number) => {
  // returns [x, opacity, color]
  const x1 = G1 - CHW - 4;
  const x2 = G2 - CHW - 4;
  if (dt < 0) return [X0, 0, C.blue] as const;
  if (dt < 1.1) return [lerp(X0, x1, eio(dt, 0, 1.1)), Math.min(1, dt * 4), C.blue] as const;
  if (outcome === 1) {
    const p = prog(dt, 1.1, 1.9);
    return [lerp(x1, X0 - 50, eio(p, 0, 1)), 1 - p, C.red] as const;
  }
  if (dt < 2.0) return [lerp(x1, x2, eio(dt, 1.1, 2.0)), 1, C.amber] as const;
  if (outcome === 2) {
    const p = prog(dt, 2.0, 2.8);
    return [lerp(x2, x1 - 40, eio(p, 0, 1)), 1 - p, C.red] as const;
  }
  const p = prog(dt, 2.0, 3.0);
  return [lerp(x2, XR + 8, eio(p, 0, 1)), 1 - Math.max(0, (p - 0.85) / 0.15), C.green] as const;
};

export const Scene2: React.FC = () => {
  const t = useT();

  const L = [
    typed("FROM orders o", t, 43.0, 44.4),
    typed("INNER JOIN discounts d", t, 44.4, 46.4),
    typed("  ON o.total_amount >= d.threshold_amount", t, 47.6, 50.4),
    typed("  AND o.region_id = d.region_id;", t, 50.5, 53.0),
  ];
  const caret = t < 44.4 ? 0 : t < 47.6 ? 1 : t < 50.5 ? 2 : t < 53.1 ? 3 : -1;

  const stage = Math.min(prog(t, 52.6, 53.4), 1 - prog(t, 67.2, 67.9));
  const ram = ROWS.filter((r, i) => r[3] === 0 && t >= S0 + i * STEP + 3.0).length;

  // second half: on-the-fly lanes
  const lanes = prog(t, 67.9, 68.7);
  const laneChip = (lane: 0 | 1, idx: number) => {
    const rej = idx % 2 === 1;
    const ts = 73.2 + idx * 0.25;
    const p = eio(t, ts, ts + 1.1);
    const x0 = 1170 + idx * 52;
    const stopAt = 1565;
    const toRam = 1672 + (idx % 4) * 38;
    const stopped = lane === 0 && rej;
    const x = stopped ? lerp(x0, stopAt - 30, p) : lerp(x0, toRam, p);
    const lateRej = lane === 1 && rej && t > 79.0;
    const o = stopped ? 1 - Math.max(0, (p - 0.8) / 0.2) : 1;
    const col = stopped ? (p > 0.7 ? C.red : C.blue) : lateRej ? C.red : p >= 1 ? C.green : C.blue;
    return { x, o, col, arrived: !stopped && p >= 1 };
  };
  const ramA = [...Array(8).keys()].filter((i) => laneChip(0, i).arrived).length;
  const ramB = [...Array(8).keys()].filter((i) => laneChip(1, i).arrived).length;
  const fillA = (ramA / 8) * eo(t, 76.6, 80.7) + (1 - eo(t, 76.6, 80.7)) * (ramA / 8);
  const fillB = ramB / 8;

  return (
    <AbsoluteFill>
      <div style={{ opacity: eo(t, 42.2, 42.9), transform: `translateX(${(1 - eo(t, 42.2, 43.0)) * -100}px)` }}>
        <Window x={70} y={150} w={930} h={340} title="admin_report.sql" glow={t > 43 && t < 53.3 ? 1 : 0}>
          {L.map((s, i) =>
            s.length > 0 ? (
              <div key={i} style={{ position: "absolute", left: 24, top: rowTop(i) }}>
                <CodeLine text={s} fs={24} caret={caret === i} />
              </div>
            ) : null,
          )}
        </Window>
      </div>

      {/* condition 1 AND condition 2 */}
      {[
        { x: 70, a: 52.4, c: C.blue, k: "condition 1", code: "o.total_amount >= d.threshold_amount", ar: "شرط المبلغ" },
        { x: 590, a: 53.6, c: C.violet, k: "condition 2", code: "o.region_id = d.region_id", ar: "شرط المنطقة الجغرافية" },
      ].map((cd, i) => {
        const e = eb(t, cd.a, cd.a + 0.6);
        return e > 0 ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cd.x,
              top: 530,
              width: 410,
              height: 170,
              opacity: Math.min(1, e * 1.5),
              transform: `translateY(${(1 - Math.min(1, e)) * 40}px)`,
              borderRadius: 20,
              background: `${cd.c}14`,
              border: `3px solid ${cd.c}`,
              padding: "14px 18px",
            }}
          >
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: cd.c }}>{cd.k}</div>
            <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 18, color: C.text, marginTop: 8, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{cd.code}</div>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 26, color: C.text, direction: "rtl", marginTop: 8 }}>{cd.ar}</div>
          </div>
        ) : null;
      })}
      {t > 53.0 && (
        <div
          style={{
            position: "absolute",
            left: 490,
            top: 590,
            width: 90,
            height: 54,
            borderRadius: 27,
            background: C.green,
            color: "#07101F",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            lineHeight: "54px",
            textAlign: "center",
            transform: `scale(${eb(t, 53.0, 53.5)})`,
          }}
        >
          AND
        </div>
      )}

      {/* ── stage: dual filter gate ── */}
      {stage > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: stage }}>
          <div style={{ position: "absolute", left: 1060, top: 150, width: 790, height: 520, borderRadius: 24, background: C.card2, border: `2px solid ${C.line}` }} />
          <div style={{ position: "absolute", left: 1085, top: 160, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.dim }}>DUAL FILTER GATE · orders ▸</div>
          {[
            { x: G1, l: "amount ≥ threshold" },
            { x: G2, l: "region match" },
          ].map((g, i) => (
            <div key={i}>
              <div style={{ position: "absolute", left: g.x - 6, top: 200, width: 12, height: 400, borderRadius: 6, background: C.amber }} />
              <div style={{ position: "absolute", left: g.x - 90, top: 612, width: 180, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 15, color: C.amber }}>{g.l}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: XR - 6, top: 200, width: 150, height: 400, borderRadius: 16, border: `3px solid ${C.green}`, background: `${C.green}10` }}>
            <div style={{ position: "absolute", left: 0, top: 6, width: 150, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.green }}>RAM</div>
            <div style={{ position: "absolute", left: 0, bottom: 10, width: 150, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.green }}>{ram}</div>
          </div>
          {ROWS.map((r, i) => {
            const [x, o, col] = chipState(t - (S0 + i * STEP), r[3]);
            if (o <= 0) return null;
            const y = 215 + (i % 6) * 62;
            return (
              <div
                key={r[0]}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: CHW,
                  height: 42,
                  opacity: o,
                  borderRadius: 10,
                  background: `${col}2A`,
                  border: `2.5px solid ${col}`,
                  boxShadow: col === C.red ? `0 0 12px ${C.red}` : "none",
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 17,
                  lineHeight: "37px",
                  textAlign: "center",
                  color: C.text,
                }}
              >
                #{r[0]} · {r[1]} · {r[2]}
              </div>
            );
          })}
        </div>
      )}

      {/* ── second half: ON vs WHERE ── */}
      {lanes > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: lanes * (1 - prog(t, 85.0, 85.5)) }}>
          <div style={{ position: "absolute", left: 1060, top: 150, width: 790, height: 520, borderRadius: 24, background: C.card2, border: `2px solid ${C.line}` }} />
          {[
            { lane: 0 as const, y: 190, c: C.green, title: "ON (inside the join)", a: 70.1, fill: fillA },
            { lane: 1 as const, y: 410, c: C.amber, title: "WHERE (after the join)", a: 71.3, fill: fillB },
          ].map((ln) => (
            <div key={ln.lane} style={{ opacity: prog(t, ln.a, ln.a + 0.5) }}>
              <div style={{ position: "absolute", left: 1090, top: ln.y, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: ln.c }}>{ln.title}</div>
              <div style={{ position: "absolute", left: 1560, top: ln.y + 50, width: 10, height: 110, borderRadius: 5, background: ln.c }} />
              <div style={{ position: "absolute", left: 1660, top: ln.y + 50, width: 170, height: 110, borderRadius: 14, border: `3px solid ${ln.c}`, background: `${ln.c}10` }}>
                <div style={{ position: "absolute", left: 0, bottom: 0, width: 170, height: 104 * Math.min(1, ln.fill), borderRadius: 11, background: `${ln.c}66` }} />
                <div style={{ position: "absolute", left: 0, top: 4, width: 170, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.text }}>RAM</div>
              </div>
              {[...Array(8).keys()].map((idx) => {
                const ch = laneChip(ln.lane, idx);
                return (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: ch.x,
                      top: ln.y + 78,
                      width: 44,
                      height: 34,
                      opacity: ch.o,
                      borderRadius: 8,
                      background: `${ch.col}33`,
                      border: `2.5px solid ${ch.col}`,
                    }}
                  />
                );
              })}
            </div>
          ))}
          {t > 79.0 && (
            <div style={{ position: "absolute", left: 1090, top: 600, width: 740, fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.dim, opacity: prog(t, 79.0, 79.6) }}>
              WHERE: rows enter RAM first, rejected later &nbsp;|&nbsp; ON: rejected rows never enter RAM
            </div>
          )}
        </div>
      )}
      {win(t, 70.4, 85.2, 0.5) > 0 && (
        <Arabic x={70} y={730} w={930} fs={34} color={C.text} o={win(t, 70.4, 85.2, 0.5)}>
          التصفية جوه <span style={{ color: C.green, fontFamily: MONO }}>ON</span> بدل <span style={{ color: C.amber, fontFamily: MONO }}>WHERE</span> = صفوف أقل في الذاكرة
        </Arabic>
      )}
      {t > 83.0 && (
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 790,
            width: 560,
            height: 70,
            borderRadius: 18,
            background: `${C.green}1E`,
            border: `3px solid ${C.green}`,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            lineHeight: "64px",
            color: C.green,
            textAlign: "center",
            opacity: Math.min(prog(t, 83.0, 83.5), 1 - prog(t, 85.9, 86.4)),
            transform: `scale(${0.85 + 0.15 * eb(t, 83.0, 83.6)})`,
          }}
        >
          SERVER EFFICIENCY ▲
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={43.2} b={61.5} color={C.blue} fs={27}>
        ON condition1 AND condition2 ──► Composite Join Logic
      </Banner>
      <Banner x={70} y={900} w={1780} a={69.0} b={85.8} color={C.green} fs={27}>
        On-the-Fly Filtering ──► Filters Rows During Join Step to Conserve RAM
      </Banner>
    </AbsoluteFill>
  );
};
