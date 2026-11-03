import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner, CodeLine, Window } from "../components/common";
import { C, eb, eio, eo, lerp, prog, typed, useT, win } from "../lib";

// customers: [name, hasOrders]
const CUST: [string, boolean][] = [
  ["Ali", true],
  ["Sara", true],
  ["Omar", false],
  ["Mona", true],
  ["Hany", false],
];
const CX = 1000, S1 = 1290, WALL = 1560, RES = 1660, CWD = 150;
const rowY = (i: number) => 250 + i * 92;

export const Scene4: React.FC = () => {
  const t = useT();
  const fixed = t > 159.4; // INNER → LEFT edit
  const L = [
    typed("FROM customers c", t, 133.0, 134.4),
    typed("LEFT JOIN orders o ON c.customer_id = o.customer_id", t, 134.6, 137.6),
    typed("INNER JOIN order_items oi ON o.order_id = oi.order_id;", t, 137.8, 140.6),
  ];
  const lastLine = fixed ? "LEFT JOIN order_items oi ON o.order_id = oi.order_id;" : L[2];

  // phase 1 (trap) 141.7 → 156 ; phase 2 (fix) 160.6 → 168
  const run = (i: number, base: number) => {
    const dt = t - (base + i * 0.35);
    return dt;
  };
  const chip = (i: number, base: number, safe: boolean) => {
    const has = CUST[i][1];
    const dt = run(i, base);
    if (dt < 0) return null;
    // x path: CX → S1 (1.2s) → WALL (1.2s) → RES
    let x = CX, o = 1, col: string = C.blue, label = CUST[i][0], hit = 0;
    if (dt < 1.2) {
      x = lerp(CX, S1, eio(dt, 0, 1.2));
    } else {
      label = has ? `${CUST[i][0]} · order` : `${CUST[i][0]} · NULL`;
      col = has ? C.blue : C.amber;
      if (dt < 2.4) x = lerp(S1, WALL - CWD - 10, eio(dt, 1.2, 2.4));
      else if (!has && !safe) {
        const p = prog(dt, 2.4, 3.1);
        x = WALL - CWD - 10 + Math.sin(p * 20) * 6;
        col = C.red;
        o = 1 - p;
        hit = 1 - p;
      } else {
        const p = eio(dt, 2.4, 3.4);
        x = lerp(WALL - CWD - 10, RES, p);
        col = safe && !has ? C.green : C.green;
      }
    }
    return { x, o, col, label, hit, done: dt > 3.4, vanished: !has && !safe && dt > 3.1 };
  };

  const trapOn = prog(t, 141.2, 142.0) * (1 - prog(t, 156.4, 157.2));
  const fixOn = prog(t, 159.0, 159.8);
  const wallRed = t > 143.8 && !fixed;
  const survivors1 = CUST.filter((c, i) => c[1] && t > 141.8 + i * 0.35 + 3.4).length;
  const vanished = CUST.filter((c, i) => !c[1] && t > 141.8 + i * 0.35 + 3.1).length;

  return (
    <AbsoluteFill>
      {/* warning title */}
      <div style={{ position: "absolute", left: 70, top: 112, width: 930, opacity: win(t, 132.4, 170.6, 0.6), fontFamily: AR, fontWeight: 900, fontSize: 34, color: C.text, direction: "rtl", textAlign: "right" }}>
        فخ دمج <span style={{ color: C.amber, fontFamily: MONO }}>LEFT JOIN</span> مع <span style={{ color: C.red, fontFamily: MONO }}>INNER JOIN</span>
      </div>

      <div style={{ opacity: eo(t, 132.6, 133.2) }}>
        <Window x={70} y={190} w={930} h={300} title="customers_report.sql" glow={t > 136 && t < 157 ? 1 : 0} color={fixed ? C.green : C.red}>
          {[L[0], L[1]].map((s, i) => (
            <div key={i} style={{ position: "absolute", left: 22, top: 18 + i * 44 }}>
              <CodeLine text={s} fs={20} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 22, top: 106 }}>
            <CodeLine text={lastLine} fs={20} caret={t > 137.8 && t < 140.7} override={fixed ? "#6EE7B7" : t > 143.8 && t < 159.4 ? "#FCA5A5" : undefined} />
          </div>
          {!fixed && t > 143.8 && (
            <div style={{ position: "absolute", right: 20, bottom: 14, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.red }}>INNER ▸ kills NULL rows ✕</div>
          )}
          {fixed && (
            <div style={{ position: "absolute", right: 20, bottom: 14, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.green, opacity: fixOn }}>all LEFT ▸ NULL rows safe ✓</div>
          )}
        </Window>
      </div>

      {/* left lower: explanation */}
      {win(t, 141.0, 156.6, 0.5) > 0 && (
        <div style={{ position: "absolute", left: 70, top: 530, width: 930, opacity: win(t, 141.0, 156.6, 0.5) }}>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 30, color: C.text, direction: "rtl", textAlign: "right", lineHeight: 1.5 }}>
            الـ <span style={{ color: C.amber, fontFamily: MONO }}>LEFT JOIN</span> حافظ على العملاء الخاملين (NULL)
          </div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 30, color: C.text, direction: "rtl", textAlign: "right", lineHeight: 1.5, opacity: prog(t, 146.0, 146.8) }}>
            والـ <span style={{ color: C.red, fontFamily: MONO }}>INNER JOIN</span> اللاحق بيمسحهم بدون ما تاخد بالك!
          </div>
        </div>
      )}
      {fixed && (
        <div style={{ position: "absolute", left: 70, top: 530, width: 930, opacity: fixOn }}>
          <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 34, color: C.green, direction: "rtl", textAlign: "right" }}>القاعدة الذهبية</div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 28, color: C.text, direction: "rtl", textAlign: "right", lineHeight: 1.5 }}>
            كل السلسلة <span style={{ fontFamily: MONO, color: C.green }}>LEFT JOIN</span>، أو تأكد إن الشروط اللاحقة ما بتلغيش مرونة الـ Outer Joins
          </div>
        </div>
      )}

      {/* pipeline stage */}
      <div style={{ position: "absolute", left: 1040, top: 160, width: 810, height: 540, borderRadius: 24, background: C.card2, border: `2px solid ${C.line}`, opacity: eo(t, 133.4, 134.4) }} />
      <div style={{ position: "absolute", left: CX, top: 178, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.dim }}>customers</div>
      <div style={{ position: "absolute", left: S1 - 10, top: 178, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.amber }}>LEFT JOIN</div>
      <div style={{ position: "absolute", left: WALL - 40, top: 178, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: fixed ? C.green : C.red, opacity: win(t, 133.4, 170.6, 0.5) }}>{fixed ? "LEFT JOIN" : "INNER JOIN"}</div>
      <div style={{ position: "absolute", left: RES + 10, top: 178, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.green }}>result</div>
      {/* wall */}
      <div
        style={{
          position: "absolute",
          left: WALL,
          top: 215,
          width: fixed ? 8 : 14,
          height: 455,
          borderRadius: 7,
          background: fixed ? C.green : t > 143.0 ? C.red : C.dim,
          opacity: fixed ? 0.5 : 1,
          boxShadow: wallRed ? `0 0 14px ${C.red}` : "none",
        }}
      />
      {/* customer starting chips (idle) */}
      {CUST.map((c, i) => {
        const e = eb(t, 134.0 + i * 0.2, 134.6 + i * 0.2);
        const started = fixed ? t > 160.6 + i * 0.35 : t > 141.8 + i * 0.35;
        if (started) return null;
        return e > 0 ? (
          <div key={c[0]} style={{ position: "absolute", left: CX, top: rowY(i), width: CWD, height: 52, opacity: Math.min(1, e * 1.5), borderRadius: 12, background: `${C.blue}22`, border: `2.5px solid ${C.blue}`, fontFamily: MONO, fontWeight: 700, fontSize: 21, lineHeight: "47px", textAlign: "center", color: C.text }}>
            {c[0]}
          </div>
        ) : null;
      })}
      {/* phase 1 chips */}
      {!fixed &&
        CUST.map((c, i) => {
          const ch = chip(i, 141.8, false);
          if (!ch || ch.o <= 0) return null;
          return (
            <div key={c[0]} style={{ position: "absolute", left: ch.x, top: rowY(i), width: CWD, height: 52, opacity: ch.o, borderRadius: 12, background: `${ch.col}26`, border: `2.5px solid ${ch.col}`, boxShadow: ch.hit > 0 ? `0 0 16px ${C.red}` : "none", fontFamily: MONO, fontWeight: 700, fontSize: 17, lineHeight: "47px", textAlign: "center", color: C.text }}>
              {ch.label}
            </div>
          );
        })}
      {/* phase 2 chips (after the fix) */}
      {fixed &&
        CUST.map((c, i) => {
          const ch = chip(i, 160.6, true);
          if (!ch) return null;
          return (
            <div key={c[0]} style={{ position: "absolute", left: ch.x, top: rowY(i), width: CWD, height: 52, opacity: ch.o, borderRadius: 12, background: `${ch.col}26`, border: `2.5px solid ${ch.col}`, fontFamily: MONO, fontWeight: 700, fontSize: 17, lineHeight: "47px", textAlign: "center", color: C.text }}>
              {ch.label}
            </div>
          );
        })}

      {/* counters */}
      {trapOn > 0 && (
        <div style={{ position: "absolute", left: 1040, top: 716, width: 810, height: 80, borderRadius: 18, background: `${C.red}16`, border: `3px solid ${C.red}`, opacity: trapOn, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: "74px", color: C.red }}>
          5 customers ▸ {5 - vanished} rows &nbsp;(-{vanished} NULL lost)
        </div>
      )}
      {fixOn > 0 && (
        <div style={{ position: "absolute", left: 1040, top: 716, width: 810, height: 80, borderRadius: 18, background: `${C.green}16`, border: `3px solid ${C.green}`, opacity: fixOn, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: "74px", color: C.green }}>
          5 customers ▸ 5 rows ✓ (NULLs safe)
        </div>
      )}

      <Banner x={70} y={900} w={1780} a={140.0} b={155.6} color={C.red} fs={25}>
        Sequential Trap: Subsequent INNER JOIN Destroys Previous LEFT JOIN NULLs!
      </Banner>
      <Banner x={70} y={900} w={1780} a={158.4} b={170.6} color={C.green} fs={25}>
        Golden Rule: Maintain Outer Join Consistency Across the Pipeline
      </Banner>
      <div style={{ display: "none" }}>{survivors1}</div>
    </AbsoluteFill>
  );
};
