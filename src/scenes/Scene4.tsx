import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner } from "../components/common";
import { C, eb, eio, eo, lerp, prog, useT, win } from "../lib";

const KC = [C.blue, C.green, C.amber];
const LX = [70, 990];
const LY = 180, LW = 860, LH = 600;

const HASH_KEYS = [2, 1, 3, 1, 3, 2, 1, 2, 3];
const HASH_T0 = 140.4, HASH_STEP = 0.9, HASH_FLY = 0.7;
const SORT_KEYS = [1, 1, 1, 2, 2, 2, 3, 3, 3];
const sortX = (n: number) => 40 + n * 80 + Math.floor(n / 3) * 28;

const Chip: React.FC<{ k: number; x: number; y: number; o?: number; lit?: boolean; w?: number }> = ({ k, x, y, o = 1, lit, w = 68 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 46,
      opacity: o,
      borderRadius: 11,
      background: lit ? KC[k - 1] : `${KC[k - 1]}33`,
      border: `2.5px solid ${KC[k - 1]}`,
      boxShadow: lit ? `0 0 20px ${KC[k - 1]}AA` : "none",
      color: lit ? "#07101F" : C.text,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 26,
      lineHeight: "41px",
      textAlign: "center",
    }}
  >
    {k}
  </div>
);

const Gauge: React.FC<{ y: number; label: string; fill: number; color: string; limit?: boolean; note?: string }> = ({ y, label, fill, color, limit, note }) => (
  <div style={{ position: "absolute", left: 40, top: y, width: 780 }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.dim, display: "flex", justifyContent: "space-between" }}>
      <span>{label}</span>
      <span style={{ color }}>{note}</span>
    </div>
    <div style={{ position: "relative", marginTop: 8, height: 28, borderRadius: 14, background: "#0B1222", border: `2px solid ${C.line}` }}>
      <div style={{ width: `${Math.max(0.6, fill * 100)}%`, height: "100%", borderRadius: 12, background: color, boxShadow: `0 0 18px ${color}99` }} />
      {limit && <div style={{ position: "absolute", left: "85%", top: -8, width: 4, height: 40, background: C.red }} />}
    </div>
  </div>
);

export const Scene4: React.FC = () => {
  const t = useT();

  const hashAct = win(t, 139.2, 149.2, 0.4);
  const grpAct = win(t, 149.2, 158.6, 0.4);
  const laneOp = (i: number) => {
    const base = eo(t, 133.4 + i * 0.4, 134.6 + i * 0.4);
    const dimTo = i === 0 ? 0.42 : 0.42;
    // while the other lane is active, dim this lane
    const other = i === 0 ? grpAct : hashAct;
    return base * (1 - other * (1 - dimTo));
  };

  // hash table counters
  const cnt = [0, 0, 0];
  const placed = HASH_KEYS.map((k, n) => {
    const done = t >= HASH_T0 + n * HASH_STEP + HASH_FLY;
    if (done) cnt[k - 1]++;
    return done;
  });
  const processed = placed.filter(Boolean).length;
  const memFill = (processed / 9) * 0.72 + 0.03 * Math.sin(t * 7) * (processed > 0 ? 1 : 0);

  const beam = lerp(40, 806, eio(t, 153.5, 158.0));
  const treeHot = win(t, 149.9, 153.6, 0.3);

  return (
    <AbsoluteFill>
      {/* title chip */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 118,
          width: 800,
          height: 52,
          borderRadius: 999,
          border: `2px solid ${C.blue}77`,
          background: "#0B1B33",
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 25,
          lineHeight: "48px",
          color: C.blue,
          opacity: win(t, 133.0, 171.0, 0.6),
        }}
      >
        PostgreSQL 16 · Execution Strategy Visualizer
      </div>

      {/* lanes */}
      {[0, 1].map((i) => {
        const c = i === 0 ? C.amber : C.green;
        const act = i === 0 ? hashAct : grpAct;
        const o = laneOp(i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LX[i] + (i === 0 ? -1 : 1) * (1 - eo(t, 133.4 + i * 0.4, 134.8 + i * 0.4)) * 300,
              top: LY,
              width: LW,
              height: LH,
              opacity: o,
              borderRadius: 28,
              background: `linear-gradient(170deg, ${c}${act > 0 ? "1E" : "0E"}, ${C.card2})`,
              border: `${act > 0 ? 4 : 2}px solid ${act > 0 ? c : C.line}`,
              boxShadow: act > 0 ? `0 0 ${Math.min(20, 50 * act)}px ${c}66` : "none",
            }}
          >
            <div style={{ position: "absolute", left: 40, top: 26, fontFamily: MONO, fontWeight: 700, fontSize: i === 0 ? 46 : 42, color: c }}>
              {i === 0 ? "Hash Aggregate" : "Group Aggregate"}
            </div>
            <div style={{ position: "absolute", left: 40, top: 86, fontFamily: AR, fontWeight: 700, fontSize: 30, color: C.text, direction: "rtl" }}>
              {i === 0 ? "بيانات غير مرتبة" : "بيانات مرتبة · B-Tree Index"}
            </div>

            {i === 0 && (
              <>
                {/* queue */}
                {HASH_KEYS.map((k, n) => {
                  const ts = HASH_T0 + n * HASH_STEP;
                  const p = eio(t, ts, ts + HASH_FLY);
                  const slot = HASH_KEYS.slice(0, n).filter((q) => q === k).length;
                  const x = lerp(40 + n * 86, 470 + slot * 0, p);
                  const y = lerp(166, 258 + (k - 1) * 72 - Math.sin(Math.PI * p) * 40, p);
                  const appear = eo(t, 134.6 + n * 0.1, 135.4 + n * 0.1);
                  const o2 = p >= 1 ? 0 : appear;
                  return o2 > 0 ? <Chip key={n} k={k} x={x} y={y} o={o2} w={lerp(68, 60, p)} /> : null;
                })}
                <div style={{ position: "absolute", left: 40, top: 218, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: prog(t, 135.5, 136.2) }}>unsorted input ▸</div>
                {/* hash table */}
                <div style={{ position: "absolute", left: 440, top: 222, width: 380, height: 258, borderRadius: 18, background: "#0B1222", border: `2.5px solid ${C.amber}`, opacity: eo(t, 138.4, 139.4) }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.amber, margin: "6px 0 0 18px" }}>hash table · work_mem</div>
                </div>
                {[1, 2, 3].map((k) => (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: 458,
                      top: 258 + (k - 1) * 72,
                      width: 344,
                      height: 56,
                      borderRadius: 12,
                      background: `${KC[k - 1]}18`,
                      border: `2px solid ${KC[k - 1]}88`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 18px",
                      opacity: eo(t, 138.6 + k * 0.15, 139.6 + k * 0.15),
                      fontFamily: MONO,
                      fontWeight: 700,
                      fontSize: 26,
                      color: C.text,
                    }}
                  >
                    <span style={{ color: KC[k - 1] }}>key {k}</span>
                    <span>count = {cnt[k - 1]}</span>
                  </div>
                ))}
                <Gauge y={510} label="work_mem" fill={memFill} color={C.amber} limit note={processed > 4 ? "extra memory ▲" : ""} />
              </>
            )}

            {i === 1 && (
              <>
                {/* B-Tree icon */}
                <svg width={240} height={206} style={{ position: "absolute", left: 590, top: 6, opacity: eo(t, 134.8, 135.8) }}>
                  {[[120, 30, 50, 100], [120, 30, 190, 100], [50, 100, 20, 165], [50, 100, 80, 165], [190, 100, 160, 165], [190, 100, 220, 165]].map((l, n) => (
                    <line key={n} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={treeHot > 0 ? C.green : C.line} strokeWidth={3} />
                  ))}
                  {[[120, 30], [50, 100], [190, 100], [20, 165], [80, 165], [160, 165], [220, 165]].map((p, n) => (
                    <circle key={n} cx={p[0]} cy={p[1]} r={n < 3 ? 17 : 13} fill="#0B1222" stroke={treeHot > 0 ? C.green : C.dim} strokeWidth={3.5} />
                  ))}
                  <text x={120} y={202} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={17} fill={treeHot > 0 ? C.green : C.dim}>B-Tree Index</text>
                </svg>
                <div style={{ position: "absolute", left: 40, top: 222, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: prog(t, 149.4, 150.2) }}>pre-sorted via index ▸</div>
                {/* sorted ribbon */}
                {SORT_KEYS.map((k, n) => {
                  const a = eo(t, 149.6 + n * 0.08, 150.5 + n * 0.08);
                  const lit = beam > sortX(n) + 34;
                  return a > 0 ? <Chip key={n} k={k} x={sortX(n)} y={270 + (1 - a) * -30} o={a} lit={lit} /> : null;
                })}
                {/* beam */}
                {t > 153.3 && t < 158.6 && (
                  <>
                    <div style={{ position: "absolute", left: beam - 2, top: 244, width: 5, height: 120, background: C.green, boxShadow: `0 0 20px ${C.green}`, opacity: win(t, 153.3, 158.6, 0.2) }} />
                    <div style={{ position: "absolute", left: beam - 80, top: 244, width: 80, height: 120, background: `linear-gradient(90deg, transparent, ${C.green}33)`, opacity: win(t, 153.3, 158.6, 0.2) }} />
                  </>
                )}
                {/* group results */}
                {[0, 1, 2].map((g) => {
                  const endX = sortX(g * 3 + 2) + 68;
                  const a = beam > endX ? eb(t, 153.5 + (endX - 40) / 766 * 4.5, 153.5 + (endX - 40) / 766 * 4.5 + 0.6) : 0;
                  if (a <= 0) return null;
                  return (
                    <div
                      key={g}
                      style={{
                        position: "absolute",
                        left: sortX(g * 3),
                        top: 390 + (1 - Math.min(1, a)) * -30,
                        width: 3 * 80 - 12,
                        height: 56,
                        opacity: Math.min(1, a),
                        borderRadius: 12,
                        background: `${KC[g]}2A`,
                        border: `2.5px solid ${C.green}`,
                        fontFamily: MONO,
                        fontWeight: 700,
                        fontSize: 22,
                        color: C.text,
                        textAlign: "center",
                        lineHeight: "50px",
                      }}
                    >
                      key {g + 1} → 3 rows
                    </div>
                  );
                })}
                <Gauge y={510} label="hash memory" fill={0.0} color={C.green} note="≈ 0" />
              </>
            )}
          </div>
        );
      })}

      {/* strategy captions */}
      <Banner x={70} y={808} w={1780} a={139.8} b={149.0} color={C.amber} fs={27}>
        Hash Aggregate ──► Builds Hash Table in work_mem (Unsorted Data)
      </Banner>
      <Banner x={70} y={808} w={1780} a={149.5} b={159.0} color={C.green} fs={27}>
        Group Aggregate ──► Streams Pre-Sorted B-Tree Data (Zero Hash Overhead)
      </Banner>

      {/* speed comparison */}
      {win(t, 159.6, 171.4, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 808, width: 1780, height: 230, opacity: win(t, 159.6, 171.4, 0.5) }}>
          {[
            { y: 0, c: C.amber, label: "Hash Aggregate", w: 1180, a: 160.2, note: "unindexed" },
            { y: 86, c: C.green, label: "Group Aggregate + B-Tree Index", w: 150, a: 161.2, note: "indexed" },
          ].map((b, i) => (
            <div key={i} style={{ position: "absolute", left: 0, top: b.y, width: 1780, height: 66 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 520, fontFamily: MONO, fontWeight: 700, fontSize: 25, lineHeight: "66px", color: b.c }}>{b.label}</div>
              <div style={{ position: "absolute", left: 540, top: 8, height: 50, width: b.w * eio(t, b.a, b.a + 2.2), borderRadius: 14, background: b.c, boxShadow: `0 0 20px ${b.c}77` }} />
              <div style={{ position: "absolute", left: 540 + b.w * eio(t, b.a, b.a + 2.2) + 16, top: 0, fontFamily: MONO, fontSize: 22, lineHeight: "66px", color: C.dim }}>{b.note}</div>
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              left: 1180,
              top: 60,
              fontFamily: AR,
              fontWeight: 900,
              fontSize: 50,
              color: C.green,
              direction: "rtl",
              opacity: prog(t, 164.0, 164.8),
              transform: `scale(${0.8 + 0.2 * eb(t, 164.0, 164.8)})`,
              transformOrigin: "left center",
            }}
          >
            فهرس صح = سرعة أضعاف
          </div>
          <div style={{ position: "absolute", left: 0, top: 184, width: 1780, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.text, opacity: prog(t, 167.0, 167.8) }}>
            Right Index ⇒ <span style={{ color: C.green }}>Stream</span>, Not <span style={{ color: C.amber }}>Hash</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
