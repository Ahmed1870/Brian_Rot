import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, fmt, lerp, prog, typed, useT, win } from "../lib";

const EX = 100, EY = 150, EW = 1020, EH = 520;
const LH = 43;
const rowTop = (i: number) => 24 + i * LH;

const PIPE = [
  { k: "FROM", c: C.blue, ar: "جلب الصفوف" },
  { k: "WHERE", c: C.amber, ar: "يشوف صفوف فردية بس" },
  { k: "GROUP BY", c: C.blue, ar: "بتتكوّن المجموعات هنا" },
  { k: "HAVING", c: C.green, ar: "يشوف المجموعات الجاهزة" },
];
const PX = 1170, PW = 650, PY = (i: number) => 190 + i * 136, PH = 96;

const RESULT = [
  { id: 1, name: "Electronics", v: 48200, ok: true },
  { id: 2, name: "Fashion", v: 31750, ok: true },
  { id: 4, name: "Beauty", v: 12300, ok: true },
  { id: 3, name: "Grocery", v: 9640, ok: false },
];

export const Scene3: React.FC = () => {
  const t = useT();

  /* ───── code state ───── */
  const L0 = typed("SELECT category_id, SUM(total_amount)", t, 97.5, 99.2);
  const L1 = typed("FROM orders", t, 99.2, 100.0);
  const L2 = typed("WHERE SUM(total_amount) > 10000", t, 100.8, 103.4);
  const fixed = t > 126.0;
  const gText = typed(fixed ? "GROUP BY category_id" : "GROUP BY category_id;", t, 103.4, 104.2);
  const L4 = typed("HAVING SUM(total_amount) > 10000;", t, 126.6, 129.8);

  const whereOut = prog(t, 125.0, 125.8);
  const gMove = eio(t, 125.6, 126.4);
  const err = t >= 104.3 && t < 125.0;
  const shake = t > 104.3 && t < 105.1 ? Math.sin((t - 104.3) * 90) * 10 * (1 - prog(t, 104.3, 105.1)) : 0;
  const ok = prog(t, 129.8, 130.4);
  const edColor = ok > 0 ? C.green : err ? C.red : C.blue;
  const caretRow = t < 99.2 ? 0 : t < 100.8 ? 1 : t < 103.4 ? 2 : t < 104.3 ? 3 : t > 126.6 && t < 129.9 ? 3 : -1;

  const errCard = win(t, 104.3, 125.2, 0.5);
  const okCard = prog(t, 129.8, 130.5);
  const arena = win(t, 88.2, 97.4, 0.5);
  const pipe = Math.min(prog(t, 97.6, 98.6), 1 - prog(t, 126.0, 126.8));
  const result = prog(t, 126.8, 127.6);

  return (
    <AbsoluteFill>
      {/* ───────── arena: WHERE vs HAVING ───────── */}
      {arena > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: arena }}>
          {[
            { x: 140, c: C.amber, k: "WHERE", en: "Row Filter", ar: "بتصفّي الصفوف الفردية", a: 95.1, from: -1 },
            { x: 1030, c: C.green, k: "HAVING", en: "Group Filter", ar: "بتصفّي المجموعات الجاهزة", a: 95.75, from: 1 },
          ].map((s, i) => {
            const e = eb(t, 88.6 + i * 0.35, 89.6 + i * 0.35);
            const hit = win(t, s.a, s.a + 1.6, 0.25);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: s.x + (1 - e) * 420 * s.from,
                  top: 250,
                  width: 750,
                  height: 470,
                  borderRadius: 34,
                  background: `linear-gradient(160deg, ${s.c}22, ${C.card2})`,
                  border: `${3 + hit * 3}px solid ${s.c}`,
                  boxShadow: `0 0 ${Math.min(20, 30 + hit * 60)}px ${s.c}${hit > 0 ? "99" : "44"}`,
                  transform: `scale(${1 + hit * 0.04})`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 86, color: s.c, marginTop: 60 }}>{s.k}</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: C.text, marginTop: 10 }}>{s.en}</div>
                <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 44, color: C.text, marginTop: 24, direction: "rtl" }}>{s.ar}</div>
                <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 22 }}>{i === 0 ? "BEFORE  GROUP BY" : "AFTER  GROUP BY"}</div>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 960 - 62,
              top: 430,
              width: 124,
              height: 124,
              borderRadius: 62,
              background: C.red,
              color: "#fff",
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 54,
              lineHeight: "124px",
              textAlign: "center",
              transform: `scale(${eb(t, 89.4, 90.2)}) rotate(${Math.sin(t * 3) * 4}deg)`,
              boxShadow: `0 0 20px ${C.red}99`,
            }}
          >
            VS
          </div>
          <div style={{ position: "absolute", left: 0, top: 770, width: 1920, textAlign: "center", fontFamily: AR, fontWeight: 900, fontSize: 42, color: C.text, direction: "rtl", opacity: prog(t, 91.0, 91.8) }}>
            أشهر مواجهة وأكبر مصدر للأخطاء في المقابلات الفنية
          </div>
        </div>
      )}

      {/* ───────── editor ───────── */}
      {t > 96.9 && (
        <div style={{ opacity: eo(t, 96.9, 97.6), transform: `translateX(${shake}px) translateY(${(1 - eo(t, 96.9, 97.6)) * 40}px)` }}>
          <Window x={EX} y={EY} w={EW} h={EH} title="manzooma_store_db — query.sql" color={edColor} glow={err || ok > 0 ? 1 : 0}>
            <svg width={EW} height={EH - 52} style={{ position: "absolute", left: 0, top: 0 }}>
              {err && L2.length > 25 && (
                <path
                  d={`M 28 ${rowTop(2) + 36} ${Array.from({ length: 31 }, (_, n) => `L ${28 + (n + 1) * 16} ${rowTop(2) + 36 + (n % 2 === 0 ? -5 : 3)}`).join(" ")}`}
                  stroke={C.red}
                  strokeWidth={3}
                  fill="none"
                  opacity={1 - whereOut}
                />
              )}
            </svg>
            <div style={{ position: "absolute", left: 28, top: rowTop(0) }}>
              <CodeLine text={L0} caret={caretRow === 0} />
            </div>
            <div style={{ position: "absolute", left: 28, top: rowTop(1) }}>
              <CodeLine text={L1} caret={caretRow === 1} />
            </div>
            {t < 125.9 && (
              <div
                style={{
                  position: "absolute",
                  left: 28 + whereOut * 120,
                  top: rowTop(2),
                  opacity: 1 - whereOut,
                  textDecoration: whereOut > 0 ? "line-through" : "none",
                }}
              >
                <CodeLine text={L2} caret={caretRow === 2} override={err ? "#FCA5A5" : undefined} />
                {err && L2.length > 25 && (
                  <span style={{ position: "absolute", left: 560, top: 2, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.red }}>✕</span>
                )}
              </div>
            )}
            {gText.length > 0 && (
              <div style={{ position: "absolute", left: 28, top: lerp(rowTop(3), rowTop(2), gMove) }}>
                <CodeLine text={gText} caret={caretRow === 3 && t < 104.3} />
              </div>
            )}
            {L4.length > 0 && (
              <div style={{ position: "absolute", left: 28, top: rowTop(3) }}>
                <CodeLine text={L4} caret={t < 129.9} override={ok > 0 ? "#6EE7B7" : undefined} />
              </div>
            )}
            {err && (
              <div style={{ position: "absolute", right: 24, bottom: 18, fontFamily: MONO, fontSize: 19, color: C.red, fontWeight: 700 }}>
                WHERE ▸ aggregate ✕
              </div>
            )}
            {ok > 0 && (
              <div style={{ position: "absolute", right: 24, bottom: 18, fontFamily: MONO, fontSize: 19, color: C.green, fontWeight: 700, opacity: ok }}>
                HAVING ▸ aggregate ✓
              </div>
            )}
          </Window>
        </div>
      )}

      {/* rejection beam (editor → engine) */}
      {t > 104.3 && t < 107 && (
        <svg width={580} height={200} viewBox="620 280 580 200" style={{ position: "absolute", left: 620, top: 280 }}>
          <path
            d={`M 640 333 C 860 333, 960 ${PY(1) + 48}, ${PX} ${PY(1) + 48}`}
            fill="none"
            stroke={C.red}
            strokeWidth={5}
            strokeDasharray="22 14"
            strokeDashoffset={-t * 400}
            opacity={win(t, 104.3, 107, 0.3)}
          />
        </svg>
      )}

      {/* ───────── error / success card ───────── */}
      {errCard > 0 && (
        <div
          style={{
            position: "absolute",
            left: EX,
            top: 700 + (1 - eb(t, 104.3, 104.9)) * 60,
            width: EW,
            height: 150,
            opacity: errCard,
            borderRadius: 22,
            background: `${C.red}1C`,
            border: `3px solid ${C.red}`,
            boxShadow: `0 0 ${Math.min(20, 30 + 25 * Math.abs(Math.sin(t * 6)))}px ${C.red}66`,
            padding: "20px 30px",
          }}
        >
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.red }}>
            {typed("ERROR: aggregate functions are not allowed in WHERE", t, 105.2, 110.2)}
          </div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, marginTop: 14, direction: "rtl", opacity: prog(t, 110.4, 111.2) }}>
            المحرك رفض الاستعلام — WHERE بتشتغل قبل التجميع
          </div>
        </div>
      )}
      {okCard > 0 && (
        <div
          style={{
            position: "absolute",
            left: EX,
            top: 700 + (1 - eo(t, 129.8, 130.5)) * 50,
            width: EW,
            height: 150,
            opacity: okCard,
            borderRadius: 22,
            background: `${C.green}1C`,
            border: `3px solid ${C.green}`,
            boxShadow: `0 0 20px ${C.green}66`,
            padding: "20px 30px",
          }}
        >
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.green }}>✓ Query OK — 3 rows returned</div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, marginTop: 14, direction: "rtl" }}>
            HAVING بتتنفذ بعد GROUP BY — الشرط التجميعي مكانه هنا
          </div>
        </div>
      )}

      {/* ───────── engine pipeline (right) ───────── */}
      {pipe > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: pipe }}>
          <div style={{ position: "absolute", left: PX, top: 130, width: PW, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.dim }}>ENGINE ORDER</div>
          {PIPE.map((p, i) => {
            const isWhere = i === 1;
            const isGroup = i === 2;
            const hot = (isWhere && t > 100.8 && t < 125.4) || (i === 3 && t > 126.8);
            const ghost = isGroup && t > 113.6 && t < 125.4;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: PX,
                  top: PY(i) + (1 - eo(t, 98 + i * 0.2, 98.8 + i * 0.2)) * 50,
                  width: PW,
                  height: PH,
                  borderRadius: 20,
                  background: `${p.c}${hot ? "26" : "10"}`,
                  border: `${hot ? 4 : 2}px ${ghost ? "dashed" : "solid"} ${hot || ghost ? (ghost ? C.dim : p.c) : C.line}`,
                  boxShadow: hot ? `0 0 20px ${p.c}77` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 30px",
                  opacity: ghost ? 0.7 : 1,
                }}
              >
                <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: p.c }}>{p.k}</span>
                <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 26, color: ghost ? C.red : C.text, direction: "rtl" }}>{ghost ? "لسه مفيش مجموعات ✕" : p.ar}</span>
              </div>
            );
          })}
          {/* connectors */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: PX + PW / 2 - 3, top: PY(i) + PH, width: 6, height: 40, background: C.line }} />
          ))}
                  </div>
      )}

      {/* ───────── result table (right) ───────── */}
      {result > 0 && (
        <div style={{ position: "absolute", left: PX, top: 150, width: PW, opacity: result }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.dim, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            <span>category</span>
            <span>SUM(total_amount)</span>
          </div>
          {RESULT.map((r, i) => {
            const a = 127.4 + i * 0.5;
            const e = eb(t, a, a + 0.6);
            const rej = !r.ok;
            const strike = rej ? prog(t, a + 1.4, a + 2.0) : 0;
            return (
              <div
                key={r.id}
                style={{
                  height: 112,
                  marginBottom: 18,
                  borderRadius: 20,
                  background: strike > 0.5 ? `${C.red}12` : `${C.green}16`,
                  border: `3px solid ${strike > 0.5 ? C.red : C.green}`,
                  boxShadow: strike > 0.5 ? "none" : `0 0 ${Math.min(20, 26 + 10 * Math.sin(t * 4 + i))}px ${C.green}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 28px",
                  opacity: e > 0 ? (strike > 0.5 ? 0.55 : 1) : 0,
                  transform: `translateX(${(1 - Math.min(1, e)) * 160}px)`,
                }}
              >
                <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.text }}>
                  {r.id} · {r.name}
                </span>
                <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38, color: strike > 0.5 ? C.red : C.green, textDecoration: strike > 0.5 ? "line-through" : "none" }}>
                  {fmt(r.v)} {strike > 0.5 ? "✕" : "✓"}
                </span>
              </div>
            );
          })}
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.dim, textAlign: "center", opacity: prog(t, 129.4, 130.0) }}>
            9,640 &lt; 10,000 → rejected after aggregation
          </div>
        </div>
      )}

      {/* ───────── captions ───────── */}
      <Banner x={100} y={900} w={1720} a={104.6} b={125.2} color={C.red} fs={28}>
        WHERE SUM(...) &gt; 10000 ──► ERROR: aggregate functions not allowed in WHERE
      </Banner>
      <Banner x={100} y={900} w={1720} a={126.0} b={132.2} color={C.green} fs={28}>
        HAVING SUM(...) &gt; 10000 ──► Evaluates Condition Post-Aggregation
      </Banner>
    </AbsoluteFill>
  );
};
