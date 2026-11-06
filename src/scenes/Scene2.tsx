import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, lerp, prog, typed, useT, win } from "../lib";

const CUST: [number, string][] = [
  [1, "Ali"],
  [2, "Sara"],
  [3, "Omar"],
  [4, "Mona"],
  [5, "Hany"],
];
const ORD: (number | null)[] = [2, 3, null];
const PX = [70, 980], PW = 870, PY = 190, PH = 520;
const CY = (i: number) => 150 + i * 52;
const OY = (k: number) => 150 + k * 52;
const matchIdx = (id: number) => ORD.indexOf(id);

const Lists: React.FC<{ nullPulse?: boolean; probe?: { chip: number } | null; verdict?: (i: number) => "yes" | "no" | "unk" | null }> = ({ nullPulse, probe, verdict }) => (
  <>
    <div style={{ position: "absolute", left: 26, top: 108, fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.dim }}>customers</div>
    <div style={{ position: "absolute", left: 330, top: 108, fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.dim }}>orders.customer_id</div>
    {CUST.map(([id, n], i) => {
      const v = verdict ? verdict(i) : null;
      const col = v === "yes" ? C.green : v === "unk" ? C.red : v === "no" ? C.dim : C.line;
      return (
        <div key={id} style={{ position: "absolute", left: 20, top: CY(i), width: 270, height: 44, borderRadius: 10, background: v === "yes" ? `${C.green}22` : "#1B2740", border: `2px solid ${col}`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 12px", fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.text }}>
          <span>{id} · {n}</span>
          <span style={{ color: col, fontSize: 15 }}>{v === "yes" ? "✓ match" : v === "unk" ? "UNKNOWN ?" : v === "no" ? "no match" : ""}</span>
        </div>
      );
    })}
    {ORD.map((v, k) => {
      const isNull = v === null;
      const hot = probe && probe.chip === k;
      const c = isNull ? C.red : C.blue;
      return (
        <div key={k} style={{ position: "absolute", left: 330, top: OY(k), width: 150, height: 44, borderRadius: 10, background: `${c}${hot ? "44" : isNull && nullPulse ? "38" : "18"}`, border: `${hot || (isNull && nullPulse) ? 3 : 2}px solid ${c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "40px", color: isNull ? "#FCA5A5" : C.text }}>
          {isNull ? "NULL" : v}
        </div>
      );
    })}
  </>
);

export const Scene2: React.FC = () => {
  const t = useT();

  /* left panel: IN → NOT IN */
  const notIn = t > 56.0;
  const l1 = notIn ? typed("WHERE id NOT IN (SELECT customer_id FROM orders);", t, 56.0, 57.2) : typed("WHERE id IN (SELECT customer_id FROM orders);", t, 49.6, 52.4);
  const leftVerdict = (i: number) => {
    if (notIn) return t > 58.6 + i * 0.4 ? ("unk" as const) : null;
    return null;
  };
  const trap = t > 61.2;
  const shake = t > 61.2 && t < 62.0 ? Math.sin((t - 61.2) * 90) * 8 * (1 - prog(t, 61.2, 62.0)) : 0;

  /* right panel: EXISTS probe */
  const S = (i: number) => 68.8 + i * 1.4;
  const rightVerdict = (i: number) => {
    const m = matchIdx(CUST[i][0]);
    const total = m >= 0 ? 0.3 * (m + 1) : 0.9;
    if (t < S(i) + total + 0.1) return null;
    return m >= 0 ? ("yes" as const) : ("no" as const);
  };
  const probeNow = (() => {
    for (let i = 0; i < 5; i++) {
      const m = matchIdx(CUST[i][0]);
      const dt = t - S(i);
      const total = m >= 0 ? 0.3 * (m + 1) : 0.9;
      if (dt >= 0 && dt < total) return { i, chip: Math.min(2, Math.floor(dt / 0.3)), dt };
    }
    return null;
  })();

  return (
    <AbsoluteFill>
      <div style={{ opacity: eo(t, 41.2, 41.9), transform: `translateX(${shake}px)` }}>
        <Window x={PX[0]} y={PY} w={PW} h={PH} title={notIn ? "NOT IN" : "IN"} color={trap ? C.red : C.amber} glow={trap ? 1 : 0}>
          <div style={{ position: "absolute", left: 24, top: 12 }}>
            <CodeLine text={typed("SELECT name FROM customers", t, 42.5, 44.5)} fs={20} />
          </div>
          <div style={{ position: "absolute", left: 24, top: 48 }}>
            <CodeLine text={l1} fs={20} caret={(t > 49.6 && t < 52.5) || (t > 56 && t < 57.3)} />
          </div>
          <Lists nullPulse={t > 58.4 && t < 63} verdict={leftVerdict} />
          {/* IN works */}
          {!notIn && t > 52.8 && (
            <div style={{ position: "absolute", left: 520, top: 150, width: 330, opacity: prog(t, 52.8, 53.4) }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.dim, marginBottom: 8 }}>result</div>
              {["Sara", "Omar"].map((n) => (
                <div key={n} style={{ height: 44, marginBottom: 8, borderRadius: 10, border: `2px solid ${C.green}`, background: `${C.green}1E`, fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "40px", paddingLeft: 14, color: C.text }}>
                  {n} ✓
                </div>
              ))}
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.amber, marginTop: 6 }}>IN ✓ works</div>
            </div>
          )}
          {/* NOT IN trap */}
          {trap && (
            <div style={{ position: "absolute", left: 520, top: 150, width: 330, height: 200, borderRadius: 18, background: `${C.red}1C`, border: `3px solid ${C.red}`, padding: "16px 18px", opacity: prog(t, 61.2, 61.7) }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.red }}>Empty Result Set</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.text, marginTop: 8 }}>x NOT IN (…, NULL) ➔ UNKNOWN</div>
              <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 28, color: C.text, direction: "rtl", marginTop: 14 }}>فخ الـ NULL ✕</div>
            </div>
          )}
        </Window>
      </div>

      {t > 64.4 && (
        <div style={{ opacity: eo(t, 64.4, 65.1) }}>
          <Window x={PX[1]} y={PY} w={PW} h={PH} title="WHERE EXISTS · Semi-Join" color={C.green} glow={t > 65 ? 1 : 0}>
            <div style={{ position: "absolute", left: 24, top: 12 }}>
              <CodeLine text="SELECT name FROM customers c" fs={20} />
            </div>
            <div style={{ position: "absolute", left: 24, top: 48 }}>
              <CodeLine text={typed("WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);", t, 64.8, 68.4)} fs={17} caret={t < 68.5} />
            </div>
            <Lists probe={probeNow ? { chip: probeNow.chip } : null} verdict={rightVerdict} />
            {probeNow && (
              <div style={{ position: "absolute", left: lerp(296, 326, eio(t, S(probeNow.i) + probeNow.chip * 0.3, S(probeNow.i) + probeNow.chip * 0.3 + 0.3)), top: lerp(CY(probeNow.i) + 14, OY(probeNow.chip) + 14, eio(t, S(probeNow.i) + probeNow.chip * 0.3, S(probeNow.i) + probeNow.chip * 0.3 + 0.3)), width: 18, height: 18, borderRadius: 9, background: C.green, border: "2px solid #fff", boxShadow: `0 0 12px ${C.green}` }} />
            )}
            {t > 70.2 && (
              <div style={{ position: "absolute", left: 520, top: 150, width: 330, opacity: prog(t, 70.2, 70.8) }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.dim, marginBottom: 8 }}>result</div>
                {[{ n: "Sara", a: 69.5 }, { n: "Omar", a: 70.8 }].map((r) =>
                  t > r.a ? (
                    <div key={r.n} style={{ height: 44, marginBottom: 8, borderRadius: 10, border: `2px solid ${C.green}`, background: `${C.green}1E`, fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "40px", paddingLeft: 14, color: C.text }}>
                      {r.n} ✓
                    </div>
                  ) : null,
                )}
              </div>
            )}
            {t > 76.0 && (
              <div style={{ position: "absolute", left: 520, top: 290, width: 330, borderRadius: 14, border: `2.5px solid ${C.green}`, background: `${C.green}16`, padding: "10px 14px", opacity: prog(t, 76.0, 76.6) }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.green }}>stops at 1st match</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.green }}>NULL ignored safely ✓</div>
              </div>
            )}
          </Window>
        </div>
      )}

      {/* IN / EXISTS pills */}
      {[
        { a: 47.6, x: 560, s: "IN", c: C.amber },
        { a: 48.2, x: 860, s: "EXISTS", c: C.green },
      ].map((p) => {
        const e = eb(t, p.a, p.a + 0.4);
        return e > 0 ? (
          <div key={p.s} style={{ position: "absolute", left: p.x, top: 736, width: 200, height: 52, opacity: Math.min(1, e * 1.5) * (1 - prog(t, 79.0, 79.4)), transform: `scale(${0.8 + 0.2 * Math.min(1, e)})`, borderRadius: 14, background: `${p.c}18`, border: `3px solid ${p.c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 26, lineHeight: "46px", color: p.c }}>
            {p.s}
          </div>
        ) : null;
      })}
      {[
        { a: 79.2, x: 560, s: "FASTEST ⚡", c: C.amber },
        { a: 80.1, x: 900, s: "SAFEST ✓", c: C.green },
      ].map((p) => {
        const e = eb(t, p.a, p.a + 0.5);
        return e > 0 ? (
          <div key={p.s} style={{ position: "absolute", left: p.x, top: 736, width: 290, height: 60, opacity: Math.min(1, e * 1.5), transform: `scale(${0.8 + 0.2 * Math.min(1, e)})`, borderRadius: 16, background: `${p.c}1E`, border: `3px solid ${p.c}`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, lineHeight: "54px", color: p.c }}>
            {p.s}
          </div>
        ) : null;
      })}

      <Banner x={70} y={900} w={1780} a={49.4} b={64.5} color={C.red} fs={26}>
        NOT IN (Subquery) ──► Dangerous NULL Trap (Returns Empty Set)
      </Banner>
      <Banner x={70} y={900} w={1780} a={65.0} b={84.6} color={C.green} fs={26}>
        WHERE EXISTS (Subquery) ──► Semi-Join Scan (Fast &amp; NULL-Safe)
      </Banner>
    </AbsoluteFill>
  );
};
