import React from "react";
import { AbsoluteFill } from "remotion";
import { AR, MONO } from "../theme";
import { Banner } from "../components/common";
import { C, eb, eio, eo, lerp, prog, rnd, useT, win } from "../lib";

type St = { key: string; ar: string; c: string; arrive: number };
// arrival times of the light pulse (seconds) — tied to the narration of each station
const ST: St[] = [
  { key: "FROM", ar: "جلب الجدول", c: C.blue, arrive: 51.3 },
  { key: "WHERE", ar: "تصفية الصفوف", c: C.amber, arrive: 55.2 },
  { key: "GROUP BY", ar: "تقسيم لأوعية", c: C.blue, arrive: 61.4 },
  { key: "HAVING", ar: "تصفية المجموعات", c: C.green, arrive: 66.0 },
  { key: "SELECT", ar: "اختيار الأعمدة", c: C.blue, arrive: 72.4 },
  { key: "ORDER BY", ar: "ترتيب النتائج", c: C.blue, arrive: 75.3 },
  { key: "LIMIT", ar: "تحديد العدد", c: C.blue, arrive: 77.9 },
];
const SX = (i: number) => 105 + i * 250;
const SW = 210;
const SY = 200;
const MON = { x: 105, y: 460, w: 1710, h: 460 };
const END_T = 84.6;

const Bars: React.FC<{ vals: number[]; x: number; y: number; w: number; c: string; h?: number; labels?: string[] }> = ({ vals, x, y, w, c, h = 34, labels }) => (
  <>
    {vals.map((v, i) => (
      <g key={i}>
        <rect x={x} y={y + i * (h + 12)} width={(w * v) / Math.max(...vals)} height={h} rx={8} fill={`${c}CC`} />
        {labels && (
          <text x={x + 14} y={y + i * (h + 12) + h * 0.7} fontFamily={MONO} fontSize={20} fontWeight={700} fill="#07101F">
            {labels[i]}
          </text>
        )}
      </g>
    ))}
  </>
);

/** local illustration for each station, drawn in the monitor (origin = top-left of the right area) */
const Illustration: React.FC<{ i: number; lt: number }> = ({ i, lt }) => {
  const c = ST[i].c;
  const OX = 640;
  const rowsData = [1200, 150, 800, 95, 650, 220, 830, 420];
  switch (i) {
    case 0: {
      return (
        <g transform={`translate(${OX} 40)`}>
          <g transform="translate(40 120)">
            <ellipse cx="80" cy="30" rx="80" ry="30" fill="none" stroke={c} strokeWidth="5" />
            <path d="M0 30v150c0 17 36 30 80 30s80-13 80-30V30" fill="none" stroke={c} strokeWidth="5" />
            <path d="M0 105c0 17 36 30 80 30s80-13 80-30" fill="none" stroke={c} strokeWidth="5" />
            <text x="80" y="260" textAnchor="middle" fontFamily={MONO} fontSize="24" fontWeight="700" fill={c}>disk</text>
          </g>
          <rect x="380" y="30" width="600" height="380" rx="20" fill={C.card2} stroke={C.line} strokeWidth="2" />
          <text x="410" y="74" fontFamily={MONO} fontSize="24" fontWeight="700" fill={C.text}>orders</text>
          {rowsData.map((v, k) => {
            const a = eo(lt, 0.3 + k * 0.28, 1.1 + k * 0.28);
            return (
              <g key={k} opacity={Math.min(1, a * 1.5)}>
                <rect x={lerp(100, 410, a)} y={lerp(180, 100 + k * 38, a)} width={540} height={30} rx={8} fill={`${c}33`} stroke={c} strokeWidth="1.5" />
                <text x={lerp(116, 426, a)} y={lerp(201, 121 + k * 38, a)} fontFamily={MONO} fontSize="19" fill={C.text}>{`#${101 + k}  ·  total_amount = ${v}`}</text>
              </g>
            );
          })}
        </g>
      );
    }
    case 1: {
      const gateX = OX + 520;
      return (
        <g transform="translate(0 40)">
          <rect x={gateX - 10} y={10} width={20} height={400} rx={10} fill={C.amber} opacity={0.9} />
          <text x={gateX} y={450} textAnchor="middle" fontFamily={MONO} fontSize="26" fontWeight="700" fill={C.amber}>WHERE total_amount &gt; 200</text>
          {rowsData.map((v, k) => {
            const pass = v > 200;
            const a = prog(lt, 0.3 + k * 0.33, 2.6 + k * 0.33);
            const x = lerp(OX + 230, gateX - 20, Math.min(a * 1.6, 1)) + (pass ? Math.max(0, a - 0.6) * 1.6 * 330 : 0);
            const fall = !pass ? eio(lt, 0.3 + k * 0.33 + 1.5, 0.3 + k * 0.33 + 2.2) : 0;
            return (
              <g key={k} opacity={eo(lt, 0.1 + k * 0.1, 0.5 + k * 0.1) * (1 - fall)} transform={`translate(0 ${fall * 70})`}>
                <rect x={x - 220} y={14 + k * 48} width={200} height={38} rx={9} fill={pass ? `${C.amber}33` : `${C.red}33`} stroke={pass ? C.amber : C.red} strokeWidth="2" />
                <text x={x - 204} y={40 + k * 48} fontFamily={MONO} fontSize="21" fill={C.text}>{`#${101 + k} · ${v}`}</text>
                {!pass && a > 0.55 && <text x={x - 36} y={40 + k * 48} fontFamily={MONO} fontSize="26" fontWeight="700" fill={C.red}>✕</text>}
              </g>
            );
          })}
        </g>
      );
    }
    case 2: {
      const cats = [C.blue, C.green, C.amber];
      const keys = [1, 2, 1, 3, 2, 1, 3, 2];
      const cnt = [0, 0, 0];
      return (
        <g transform={`translate(${OX} 30)`}>
          {cats.map((cc, k) => (
            <g key={k} transform={`translate(${60 + k * 330} 0)`}>
              <path d="M0 150V320q0 40 40 40h200q40 0 40-40V150" fill={`${cc}10`} stroke={cc} strokeWidth="4" />
              <text x="140" y="130" textAnchor="middle" fontFamily={MONO} fontSize="24" fontWeight="700" fill={cc}>{`key = ${k + 1}`}</text>
            </g>
          ))}
          {keys.map((kk, n) => {
            const slot = cnt[kk - 1]++;
            const a = eio(lt, 0.4 + n * 0.32, 1.2 + n * 0.32);
            const k = kk - 1;
            return (
              <rect key={n} x={lerp(500, 80 + k * 330, a)} y={lerp(-10, 310 - slot * 44, a)} width={240} height={36} rx={9} fill={`${cats[k]}55`} stroke={cats[k]} strokeWidth="2" opacity={Math.min(1, a * 3)} />
            );
          })}
        </g>
      );
    }
    case 3: {
      const sums = [3480, 1600, 650];
      const cs = [C.blue, C.green, C.amber];
      const nm = ["Electronics", "Fashion", "Grocery"];
      const gx = OX + 700;
      return (
        <g transform="translate(0 50)">
          <rect x={gx - 10} y={0} width={20} height={380} rx={10} fill={C.green} />
          <text x={gx} y={420} textAnchor="middle" fontFamily={MONO} fontSize="26" fontWeight="700" fill={C.green}>HAVING SUM(total_amount) &gt; 1000</text>
          {sums.map((s, k) => {
            const pass = s > 1000;
            const a = eio(lt, 0.4 + k * 0.5, 2.6 + k * 0.5);
            const x = lerp(OX, pass ? gx + 80 : gx - 250, a);
            const op = pass ? 1 : 1 - prog(lt, 3.0 + k * 0.5, 3.8 + k * 0.5);
            return (
              <g key={k} opacity={op}>
                <rect x={x} y={20 + k * 118} width={250} height={92} rx={16} fill={`${cs[k]}22`} stroke={pass ? C.green : C.red} strokeWidth="3" />
                <text x={x + 22} y={58 + k * 118} fontFamily={MONO} fontSize="22" fill={C.dim}>{nm[k]}</text>
                <text x={x + 22} y={92 + k * 118} fontFamily={MONO} fontSize="34" fontWeight="700" fill={C.text}>{`Σ ${s.toLocaleString("en-US")}`}</text>
                {lt > 2.3 + k * 0.5 && <text x={x + 205} y={64 + k * 118} fontFamily={MONO} fontSize="38" fontWeight="700" fill={pass ? C.green : C.red}>{pass ? "✓" : "✕"}</text>}
              </g>
            );
          })}
        </g>
      );
    }
    case 4: {
      const cols = ["order_id", "category_id", "order_date", "total_amount", "status"];
      const keep = [1, 3];
      return (
        <g transform={`translate(${OX} 50)`}>
          {cols.map((cn, k) => {
            const kept = keep.includes(k);
            const a = eio(lt, 1.2, 2.2);
            const x = kept ? lerp(k * 205, (keep.indexOf(k)) * 260 + 150, a) : k * 205;
            const op = kept ? 1 : 1 - a;
            return (
              <g key={k} opacity={op}>
                <rect x={x} y={20} width={190} height={340} rx={14} fill={kept ? `${C.blue}22` : C.card2} stroke={kept ? C.blue : C.line} strokeWidth={kept ? 4 : 2} />
                <text x={x + 95} y={62} textAnchor="middle" fontFamily={MONO} fontSize="20" fontWeight="700" fill={kept ? C.blue : C.dim}>{cn}</text>
                {[0, 1, 2, 3, 4, 5].map((r) => (
                  <rect key={r} x={x + 20} y={90 + r * 44} width={150} height={26} rx={7} fill={kept ? `${C.blue}55` : "#243249"} />
                ))}
              </g>
            );
          })}
        </g>
      );
    }
    case 5: {
      const vals = [3480, 650, 1600, 5200, 2100];
      const names = ["Electronics", "Grocery", "Fashion", "Beauty", "Home"];
      const order = [3, 0, 4, 2, 1];
      const a = eio(lt, 1.0, 2.4);
      return (
        <g transform={`translate(${OX} 40)`}>
          {vals.map((v, n) => {
            const pos = lerp(n, order.indexOf(n), a);
            return (
              <g key={n} transform={`translate(0 ${pos * 76})`}>
                <rect x={0} y={0} width={(900 * v) / 5200} height={60} rx={12} fill={`${C.blue}AA`} />
                <text x={18} y={39} fontFamily={MONO} fontSize="26" fontWeight="700" fill="#07101F">{`${names[n]}  ${v.toLocaleString("en-US")}`}</text>
              </g>
            );
          })}
          <text x={930} y={40} fontFamily={MONO} fontSize="26" fontWeight="700" fill={C.blue}>DESC ▼</text>
        </g>
      );
    }
    default: {
      const vals = [5200, 3480, 2100, 1600, 650];
      const names = ["Beauty", "Electronics", "Home", "Fashion", "Grocery"];
      const cut = eio(lt, 1.0, 1.8);
      return (
        <g transform={`translate(${OX} 40)`}>
          {vals.map((v, n) => (
            <g key={n} opacity={n < 3 ? 1 : 1 - cut * 0.85}>
              <rect x={0} y={n * 76} width={(900 * v) / 5200} height={60} rx={12} fill={n < 3 ? `${C.blue}AA` : "#475569"} />
              <text x={18} y={n * 76 + 39} fontFamily={MONO} fontSize="26" fontWeight="700" fill="#07101F">{`${names[n]}  ${v.toLocaleString("en-US")}`}</text>
            </g>
          ))}
          <line x1={-20} y1={3 * 76 - 8} x2={1000} y2={3 * 76 - 8} stroke={C.red} strokeWidth="4" strokeDasharray="16 10" strokeDashoffset={-lt * 60} opacity={cut} />
          <text x={940} y={3 * 76 - 22} fontFamily={MONO} fontSize="28" fontWeight="700" fill={C.red} opacity={cut}>LIMIT 3</text>
        </g>
      );
    }
  }
};

export const Scene2: React.FC = () => {
  const t = useT();

  // pulse position
  const ptsT = [49.6, ...ST.map((s) => s.arrive)];
  const ptsX = [60, ...ST.map((_, i) => SX(i) + SW / 2)];
  let px = ptsX[0];
  for (let i = 0; i < ptsT.length - 1; i++) {
    if (t >= ptsT[i] && t <= ptsT[i + 1]) px = lerp(ptsX[i], ptsX[i + 1], eio(t, ptsT[i], ptsT[i + 1]));
    else if (t > ptsT[i + 1]) px = ptsX[i + 1];
  }
  const pulseOn = prog(t, 49.4, 49.9) * (1 - prog(t, 80.5, 81.5));

  // active station = last arrived
  let active = -1;
  ST.forEach((s, i) => {
    if (t >= s.arrive - 0.15) active = i;
  });

  return (
    <AbsoluteFill>
      {/* title */}
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 118,
          width: 1710,
          textAlign: "center",
          opacity: win(t, 42.3, 83.5, 0.6),
          fontFamily: AR,
          fontWeight: 900,
          fontSize: 38,
          color: C.text,
          direction: "rtl",
        }}
      >
        الترتيب المنطقي للتنفيذ <span style={{ color: C.blue }}>|</span> <span style={{ fontFamily: MONO, fontSize: 32, color: C.blue }}>Logical Query Execution Order</span>
      </div>

      {/* connector line + pulse */}
      <svg width={1840} height={130} viewBox="40 120 1840 130" style={{ position: "absolute", left: 40, top: 120, zIndex: 5 }}>
        <defs>
          <filter id="s2g" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <line x1={SX(0) + SW / 2} y1={SY - 16} x2={SX(6) + SW / 2} y2={SY - 16} stroke={C.line} strokeWidth={6} opacity={prog(t, 43.5, 45)} />
        <line x1={SX(0) + SW / 2} y1={SY - 16} x2={Math.max(SX(0) + SW / 2, px)} y2={SY - 16} stroke={C.blue} strokeWidth={6} opacity={pulseOn} />
        <g opacity={pulseOn}>
          <circle cx={px} cy={SY - 16} r={26} fill={C.blue} opacity={0.35} />
          <circle cx={px} cy={SY - 16} r={11} fill="#fff" />
        </g>
      </svg>

      {/* stations */}
      {ST.map((s, i) => {
        const a = eb(t, 42.6 + i * 0.5, 43.4 + i * 0.5);
        if (a <= 0) return null;
        const isActive = i === active;
        const visited = i < active;
        const lit = isActive ? 1 : visited ? 0.45 : 0;
        const bump = isActive ? 1 + 0.05 * Math.sin((t - s.arrive) * 6) * Math.max(0, 1 - (t - s.arrive) / 1.5) : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: SX(i),
              top: SY + (1 - a) * 70,
              width: SW,
              height: 190,
              opacity: Math.min(1, a * 1.4),
              transform: `scale(${bump})`,
              borderRadius: 24,
              background: `linear-gradient(180deg, ${s.c}${isActive ? "30" : "10"}, ${C.card2})`,
              border: `${isActive ? 4 : 2}px solid ${lit > 0 ? s.c : C.line}`,
              boxShadow: isActive ? `0 0 20px ${s.c}88` : "none",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 12,
                width: 36,
                height: 36,
                borderRadius: 18,
                background: lit > 0 ? s.c : C.line,
                color: "#07101F",
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 22,
                lineHeight: "36px",
              }}
            >
              {i + 1}
            </div>
            <div style={{ marginTop: 62, fontFamily: MONO, fontWeight: 700, fontSize: s.key.length > 7 ? 29 : 34, color: lit > 0 ? s.c : C.text }}>{s.key}</div>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 25, color: C.dim, marginTop: 10, direction: "rtl" }}>{s.ar}</div>
            {i === 1 && prog(t, 44.5, 45.2) > 0 && (
              <div style={{ position: "absolute", bottom: -34, left: 0, width: SW, fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.amber, opacity: prog(t, 44.5, 45.2) }}>rows ▸ before</div>
            )}
            {i === 3 && prog(t, 44.8, 45.5) > 0 && (
              <div style={{ position: "absolute", bottom: -34, left: 0, width: SW, fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.green, opacity: prog(t, 44.8, 45.5) }}>groups ▸ after</div>
            )}
          </div>
        );
      })}

      {/* monitor */}
      {t > 50.2 && t < END_T && (
        <div
          style={{
            position: "absolute",
            left: MON.x,
            top: MON.y,
            width: MON.w,
            height: MON.h,
            opacity: win(t, 50.2, END_T - 0.1, 0.5),
            borderRadius: 26,
            background: "#0B1222",
            border: `2px solid ${C.line}`,
            overflow: "hidden",
            boxShadow: "none",
          }}
        >
          {ST.map((s, i) => {
            const a0 = s.arrive - 0.35;
            const a1 = i < 6 ? ST[i + 1].arrive - 0.35 : END_T;
            const o = i === 0 ? Math.min(prog(t, a0, a0 + 0.4), 1 - prog(t, a1 - 0.3, a1)) : Math.min(prog(t, a0, a0 + 0.4), 1 - prog(t, a1 - 0.3, a1));
            if (o <= 0) return null;
            const lt = t - s.arrive;
            const desc: Record<string, [string, string]> = {
              FROM: ["جلب الجدول من القرص", "Reads the whole table from disk"],
              WHERE: ["تصفية الصفوف الفردية قبل التجميع", "Row filter — runs BEFORE grouping"],
              "GROUP BY": ["تقسيم الباقي لأوعية فئوية", "Splits the remaining rows into buckets"],
              HAVING: ["تصفية المجموعات بعد التجميع", "Group filter — runs AFTER grouping"],
              SELECT: ["استقطاع الأعمدة والنتائج", "Picks the final columns & aggregates"],
              "ORDER BY": ["ترتيب المجموعات النهائية", "Sorts the final groups"],
              LIMIT: ["تقييد المخرجات", "Caps how many rows are returned"],
            };
            return (
              <div key={i} style={{ position: "absolute", inset: 0, opacity: o, transform: `translateX(${(1 - eo(t, a0, a0 + 0.5)) * 60}px)` }}>
                <div style={{ position: "absolute", left: 40, top: 40, width: 560 }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 54, color: s.c }}>{s.key}</div>
                  <div style={{ fontFamily: AR, fontWeight: 900, fontSize: 34, color: C.text, direction: "rtl", textAlign: "left", marginTop: 14, width: 540 }}>{desc[s.key][0]}</div>
                  <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 22, color: C.dim, marginTop: 16 }}>{desc[s.key][1]}</div>
                </div>
                <svg width={MON.w} height={MON.h} style={{ position: "absolute", left: 0, top: 0 }}>
                  <Illustration i={i} lt={lt} />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* captions */}
      <Banner x={105} y={950} w={1710} a={42.8} b={61.5} color={C.blue} fs={29}>
        FROM ──► WHERE ──► GROUP BY ──► HAVING ──► SELECT ──► ORDER BY
      </Banner>
      <Banner x={105} y={950} w={1710} a={64.0} b={84.3} color={C.green} fs={27}>
        <span style={{ color: C.amber }}>WHERE</span> filters rows BEFORE grouping  |  <span style={{ color: C.green }}>HAVING</span> filters groups AFTER grouping
      </Banner>
    </AbsoluteFill>
  );
};

void rnd;
