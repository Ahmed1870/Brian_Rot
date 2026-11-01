import React from 'react';
import TL from '../timeline.json';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {Bg, Glass} from '../components/Glass';
import {Burst} from '../components/Particles';
import {Bi, appear, pop} from '../components/Text';
import {eio, eo, hash, mix, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc05;
const CARD_W = 440;
const CARD_H = 600;
const CARD_Y = 250;
const CARD_X = [120, 740, 1360];

type Card = {id: string; title: string; ar: string; color: string; fields: [string, string, string][]};
const CARDS: Card[] = [
  {id: 'customers', title: 'Customers', ar: 'العملاء', color: C.accent, fields: [['id', 'INT', 'PK'], ['name', 'TEXT', ''], ['phone', 'TEXT', ''], ['email', 'TEXT', ''], ['city', 'TEXT', '']]},
  {id: 'orders', title: 'Orders', ar: 'الطلبات', color: C.violet, fields: [['order_id', 'INT', 'PK'], ['customer_id', 'INT', 'FK'], ['product_id', 'INT', 'FK'], ['qty', 'INT', ''], ['order_date', 'DATE', '']]},
  {id: 'products', title: 'Products', ar: 'المنتجات', color: C.green, fields: [['product_id', 'INT', 'PK'], ['name', 'TEXT', ''], ['price', 'DECIMAL', ''], ['category', 'TEXT', '']]},
];
const fieldCY = (i: number) => CARD_Y + 90 + i * 46 + 23;
const sampleY = (r: number) => CARD_Y + 392 + r * 58;

// flat-file table the chips start from
const FX = [250, 400, 610, 840, 1090, 1240];
const FY = [400, 482, 564];
type Chip = {id: string; text: string; ar?: boolean; sx: number; sy: number; ex: number; ey: number; delay: number; merge?: boolean; color: string};
const FLAT = [
  ['#1041', 'أحمد محمود', '01099999999', 'كيبورد ميكانيكي', '1150', '1'],
  ['#1042', 'أحمد محمود', '01099999999', 'ماوس لاسلكي', '280', '2'],
  ['#1043', 'سارة علي', '01112223334', 'سماعة بلوتوث', '450', '1'],
];
const CUST_COL = [28, 100, 262];
const ORD_COL = [28, 128, 238, 350];
const PROD_COL = [28, 100, 322];
const CHIPS: Chip[] = [];
FLAT.forEach((row, r) => {
  const custRow = r === 2 ? 1 : 0;
  const base = 0.12 * r;
  CHIPS.push({id: `o${r}`, text: row[0], sx: FX[0], sy: FY[r], ex: CARD_X[1] + ORD_COL[0], ey: sampleY(r), delay: base, color: C.violet});
  CHIPS.push({id: `n${r}`, text: row[1], ar: true, sx: FX[1], sy: FY[r], ex: CARD_X[0] + CUST_COL[1], ey: sampleY(custRow), delay: base + 0.35, merge: r === 1, color: C.accent});
  CHIPS.push({id: `p${r}`, text: row[2], sx: FX[2], sy: FY[r], ex: CARD_X[0] + CUST_COL[2], ey: sampleY(custRow), delay: base + 0.5, merge: r === 1, color: C.accent});
  CHIPS.push({id: `pr${r}`, text: row[3], ar: true, sx: FX[3], sy: FY[r], ex: CARD_X[2] + PROD_COL[1], ey: sampleY(r), delay: base + 0.65, color: C.green});
  CHIPS.push({id: `pc${r}`, text: row[4], sx: FX[4], sy: FY[r], ex: CARD_X[2] + PROD_COL[2], ey: sampleY(r), delay: base + 0.8, color: C.green});
  CHIPS.push({id: `q${r}`, text: row[5], sx: FX[5], sy: FY[r], ex: CARD_X[1] + ORD_COL[3], ey: sampleY(r), delay: base + 0.95, color: C.violet});
});
// chips that only appear (keys / foreign keys)
const KEYS: {text: string; x: number; y: number; fk: boolean; d: number}[] = [
  {text: '1', x: CARD_X[0] + CUST_COL[0], y: sampleY(0), fk: false, d: 0},
  {text: '2', x: CARD_X[0] + CUST_COL[0], y: sampleY(1), fk: false, d: 0.1},
  {text: '1', x: CARD_X[1] + ORD_COL[1], y: sampleY(0), fk: true, d: 0.2},
  {text: '1', x: CARD_X[1] + ORD_COL[1], y: sampleY(1), fk: true, d: 0.3},
  {text: '2', x: CARD_X[1] + ORD_COL[1], y: sampleY(2), fk: true, d: 0.4},
  {text: '1', x: CARD_X[1] + ORD_COL[2], y: sampleY(0), fk: true, d: 0.5},
  {text: '2', x: CARD_X[1] + ORD_COL[2], y: sampleY(1), fk: true, d: 0.6},
  {text: '3', x: CARD_X[1] + ORD_COL[2], y: sampleY(2), fk: true, d: 0.7},
  {text: '1', x: CARD_X[2] + PROD_COL[0], y: sampleY(0), fk: false, d: 0.8},
  {text: '2', x: CARD_X[2] + PROD_COL[0], y: sampleY(1), fk: false, d: 0.9},
  {text: '3', x: CARD_X[2] + PROD_COL[0], y: sampleY(2), fk: false, d: 1.0},
];

const ChipView: React.FC<{text: string; ar?: boolean; color: string; hi?: number}> = ({text, ar, color, hi = 0}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', height: 40, padding: '0 12px', borderRadius: 10, background: `${color}22`, border: `1.5px solid ${color}${hi > 0 ? 'FF' : '88'}`, fontFamily: ar ? FONT_AR : FONT_MONO, fontWeight: 600, fontSize: ar ? 22 : 20, color: C.text, whiteSpace: 'nowrap', unicodeBidi: 'plaintext', boxShadow: hi > 0 ? `0 0 ${20 * hi}px ${color}` : undefined}}>{text}</div>
);

const bez = (p0: number, p1: number, p2: number, p3: number, u: number) => {
  const v = 1 - u;
  return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3;
};

export const Scene5: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 155.05, 155.8);
  const lift = seg(t, 156.6, 158.2);
  const orbitAmp = seg(t, 160, 165);
  const orbit = Math.sin((t - 158) * 0.42);
  const rotY = orbit * 17 * orbitAmp;
  const rotX = 7 * orbitAmp + Math.cos((t - 158) * 0.3) * 2 * orbitAmp;
  const finalP = eio(prog(t, S.title[0] - 0.4, S.title[0] + 1.4));
  const planeScale = mix(1, 0.84, finalP);
  const planeY = mix(0, -62, finalP);

  const cardP = (i: number) => pop(t, 158.4 + i * 0.35, 159.6 + i * 0.35);
  const schemaP = (i: number, k: number) => appear(t, 159.6 + i * 0.3 + k * 0.12, 160.2 + i * 0.3 + k * 0.12);

  // threads
  const thr1 = {a: {x: CARD_X[0] + CARD_W, y: fieldCY(0)}, b: {x: CARD_X[1], y: fieldCY(1)}};
  const thr2 = {a: {x: CARD_X[2], y: fieldCY(0)}, b: {x: CARD_X[1] + CARD_W, y: fieldCY(2)}};
  const mk = (a: {x: number; y: number}, b: {x: number; y: number}) => {
    const dx = Math.abs(b.x - a.x) * 0.5;
    const dir = b.x > a.x ? 1 : -1;
    return {d: `M${a.x} ${a.y} C${a.x + dir * dx} ${a.y} ${b.x - dir * dx} ${b.y} ${b.x} ${b.y}`, c1x: a.x + dir * dx, c2x: b.x - dir * dx};
  };
  const p1 = mk(thr1.a, thr1.b);
  const p2 = mk(thr2.a, thr2.b);
  const draw = seg(t, S.threads[0], S.threads[0] + 3.4);
  const snapFlash = 1 - prog(t, S.snap, S.snap + 0.7);
  const locked = t >= S.snap;
  const pulseU = (t * 0.45) % 1;

  // demo: delete an order, the customer survives
  const demoOn = t >= S.demo[0];
  const demoP = prog(t, S.demo[0] + 1.5, S.demo[0] + 3.2);
  const goneRow = demoP > 0.35;
  const warn = 0.5 + 0.5 * pulse(t, 0.9);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} tint={C.accent} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: enter, perspective: '1900px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '960px 540px', transform: `translateY(${planeY}px) scale(${planeScale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`}}>
          {/* flat table scaffold fading out */}
          <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, opacity: 1 - lift}}>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="220" x2="1400" y1={372 + i * 82} y2={372 + i * 82} stroke="#334155" strokeWidth="2" />
            ))}
            {FX.map((x, i) => (
              <line key={i} x1={x - 24} x2={x - 24} y1="372" y2="618" stroke="#334155" strokeWidth="2" />
            ))}
          </svg>
          {t < 158.4 ? (
            <div style={{position: 'absolute', left: 220, top: 300, width: 1180, display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 20, color: C.mute, opacity: 1 - lift, padding: '0 6px'}}>
              {['order', 'customer', 'phone', 'product', 'price', 'qty'].map((h, i) => (
                <span key={i} style={{position: 'absolute', left: FX[i] - 220}}>{h}</span>
              ))}
            </div>
          ) : null}

          {/* entity cards */}
          {CARDS.map((c, i) => {
            const p = cardP(i);
            const glow = locked ? 24 + 22 * snapFlash : 12;
            return (
              <div key={c.id} style={{position: 'absolute', left: CARD_X[i], top: CARD_Y, width: CARD_W, height: CARD_H, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`}}>
                <Glass w={CARD_W} h={CARD_H} r={30} tint={c.color} glow={glow} t={t + i * 2} style={{border: `2px solid ${c.color}88`}}>
                  <div style={{position: 'absolute', left: 0, top: 0, width: CARD_W, height: 74, background: `linear-gradient(90deg, ${c.color}55, ${c.color}11)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxSizing: 'border-box'}}>
                    <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 36, color: C.text}}>{c.title}</span>
                    <span style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 30, color: c.color}}>{c.ar}</span>
                  </div>
                  {c.fields.map((f, k) => (
                    <div key={f[0]} style={{position: 'absolute', left: 22, right: 22, top: 90 + k * 46, height: 42, display: 'flex', alignItems: 'center', gap: 12, borderRadius: 10, background: f[2] ? `${c.color}1F` : 'rgba(255,255,255,0.03)', padding: '0 14px', opacity: schemaP(i, k), transform: `translateX(${(1 - schemaP(i, k)) * -20}px)`}}>
                      <span style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, color: C.text, flex: 1}}>{f[0]}</span>
                      <span style={{fontFamily: FONT_MONO, fontSize: 17, color: C.mute}}>{f[1]}</span>
                      {f[2] ? <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 16, color: C.bg, background: f[2] === 'PK' ? C.amber : C.violet, borderRadius: 7, padding: '2px 9px'}}>{f[2]}</span> : null}
                    </div>
                  ))}
                  <div style={{position: 'absolute', left: 22, right: 22, top: 344, height: 2, background: `${c.color}55`, opacity: schemaP(i, 5)}} />
                </Glass>
              </div>
            );
          })}

          {/* flying chips */}
          {CHIPS.map((ch) => {
            const start = 158.2 + ch.delay;
            const u = eo(prog(t, start, start + 1.7));
            const arc = Math.sin(u * Math.PI);
            const fl = (1 - u) * lift;
            const fx = Math.sin(t * 1.3 + ch.sx * 0.01) * 8 * fl;
            const fy = Math.cos(t * 1.1 + ch.sy * 0.02) * 10 * fl;
            const x = mix(ch.sx, ch.ex, u) + fx;
            const y = mix(ch.sy, ch.ey, u) + fy - arc * 90 * (hash(ch.delay * 9) + 0.4);
            const op = ch.merge ? 1 - prog(u, 0.7, 1) : 1;
            const sc = 1 + 0.12 * lift * (1 - u) + 0.1 * arc;
            if (op <= 0.01) return null;
            const rowIdx = Number(ch.id.slice(-1));
            const demoGone = demoOn && rowIdx === 2 && !ch.merge && (ch.id[0] === 'o' || ch.id[0] === 'q') ? 1 - eo(prog(demoP, 0, 0.5)) : 1;
            return (
              <div key={ch.id} style={{position: 'absolute', left: x, top: y, opacity: op * demoGone * (t < 156 ? enter : 1), transform: `scale(${sc}) rotate(${(hash(ch.delay * 4) - 0.5) * 8 * arc}deg)`}}>
                <ChipView text={ch.text} ar={ch.ar} color={ch.color} hi={arc} />
              </div>
            );
          })}
          {KEYS.map((k, i) => {
            const a = appear(t, 162.6 + k.d * 0.8, 163.4 + k.d * 0.8);
            const orderRow2 = demoOn && k.fk && k.y === sampleY(2) ? 1 - eo(prog(demoP, 0, 0.5)) : demoOn && k.fk && k.x === CARD_X[1] + ORD_COL[2] && k.text === '3' ? 1 - eo(prog(demoP, 0, 0.5)) : 1;
            return (
              <div key={i} style={{position: 'absolute', left: k.x, top: k.y, opacity: a * orderRow2, transform: `scale(${0.8 + 0.2 * a})`}}>
                <ChipView text={k.text} color={k.fk ? C.violet : C.amber} hi={locked && k.fk ? 0.4 * snapFlash : 0} />
              </div>
            );
          })}
          {demoOn ? <Burst x={CARD_X[1] + 20} y={sampleY(2) - 4} w={400} h={48} p={prog(demoP, 0, 0.9)} n={90} seed={5} colors={[C.violet, '#F8FAFC', C.red]} spread={200} lift={90} size={9} /> : null}
          {demoOn ? (
            <div style={{position: 'absolute', left: CARD_X[0] + CUST_COL[0] - 10, top: sampleY(1) - 8, width: 400, height: 56, borderRadius: 14, border: `2px solid ${C.green}`, boxShadow: `0 0 ${20 + 16 * warn}px ${C.green}`, opacity: appear(t, S.demo[0] + 2.4, S.demo[0] + 3.2)}} />
          ) : null}

          {/* PK -> FK light threads */}
          <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <defs>
              <linearGradient id="thrA" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={C.accent} />
                <stop offset="1" stopColor={C.violet} />
              </linearGradient>
              <linearGradient id="thrB" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={C.green} />
                <stop offset="1" stopColor={C.violet} />
              </linearGradient>
            </defs>
            {[
              {p: p1, g: 'url(#thrA)', a: thr1.a, b: thr1.b},
              {p: p2, g: 'url(#thrB)', a: thr2.a, b: thr2.b},
            ].map((th, i) => {
              const px = bez(th.a.x, th.p.c1x, th.p.c2x, th.b.x, pulseU);
              const py = bez(th.a.y, th.a.y, th.b.y, th.b.y, pulseU);
              return (
                <g key={i} opacity={draw > 0 ? 1 : 0}>
                  <path d={th.p.d} fill="none" stroke={th.g} strokeWidth={16} opacity={0.22 + 0.5 * snapFlash} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
                  <path d={th.p.d} fill="none" stroke={snapFlash > 0.3 ? '#fff' : th.g} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
                  {draw > 0.98 ? <circle cx={px} cy={py} r={11} fill="#fff" style={{filter: `drop-shadow(0 0 12px ${C.accent})`}} /> : null}
                  {draw > 0.98 ? <circle cx={bez(th.a.x, th.p.c1x, th.p.c2x, th.b.x, (pulseU + 0.5) % 1)} cy={bez(th.a.y, th.a.y, th.b.y, th.b.y, (pulseU + 0.5) % 1)} r={8} fill={C.accent} opacity={0.8} /> : null}
                  <circle cx={th.a.x} cy={th.a.y} r={9} fill={C.amber} opacity={draw > 0.05 ? 1 : 0} />
                  <circle cx={th.b.x} cy={th.b.y} r={9} fill={C.violet} opacity={draw > 0.95 ? 1 : 0} />
                  {locked ? (
                    <>
                      <text x={th.a.x + (th.a.x < th.b.x ? 20 : -20)} y={th.a.y - 14} textAnchor={th.a.x < th.b.x ? 'start' : 'end'} fontFamily={FONT_MONO} fontWeight="800" fontSize="28" fill={C.amber}>1</text>
                      <text x={th.b.x + (th.a.x < th.b.x ? -20 : 20)} y={th.b.y - 14} textAnchor={th.a.x < th.b.x ? 'end' : 'start'} fontFamily={FONT_MONO} fontWeight="800" fontSize="28" fill={C.violet}>∞</text>
                    </>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {demoOn ? (
            <div style={{position: 'absolute', left: CARD_X[0] - 20, top: CARD_Y + CARD_H + 24, width: 560, opacity: appear(t, S.demo[0] + 3, S.demo[0] + 3.8), transform: `translateY(${(1 - appear(t, S.demo[0] + 3, S.demo[0] + 3.8)) * 20}px)`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px', borderRadius: 18, background: 'rgba(52,211,153,0.14)', border: `2px solid ${C.green}`, direction: 'rtl'}}>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18 L14 26 L29 8" /></svg>
                <span style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 30, color: C.text}}>حُذف الطلب… وسارة ما زالت موجودة</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* entity separation header */}
      {t >= S.head[0] - 0.1 && t < S.head[1] + 0.5 ? (
        <div style={{position: 'absolute', left: 0, top: 96, width: 1920, display: 'flex', justifyContent: 'center', opacity: pop(t, S.head[0], S.head[0] + 0.8) * (1 - seg(t, S.head[1] - 0.5, S.head[1])), transform: `translateY(${(1 - pop(t, S.head[0], S.head[0] + 0.8)) * -60}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '16px 46px', borderRadius: 999, background: 'rgba(15,23,42,0.94)', border: `2px solid ${C.accent}`, boxShadow: `0 20px 70px rgba(0,0,0,0.55), 0 0 40px rgba(56,189,248,0.35)`}}>
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" stroke={C.accent} strokeWidth="4.5" strokeLinecap="round"><rect x="4" y="8" width="14" height="38" rx="4" /><rect x="20" y="8" width="14" height="38" rx="4" /><rect x="36" y="8" width="14" height="38" rx="4" /></svg>
            <Bi ar="الفصل الهيكلي للكيانات" en="Entity Separation" size={54} t={t} start={S.head[0] + 0.15} />
          </div>
        </div>
      ) : null}

      {/* glowing RDBMS title */}
      {t >= S.title[0] - 0.1 ? (
        <div style={{position: 'absolute', left: 0, top: 868, width: 1920, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: appear(t, S.title[0], S.title[0] + 0.7) * (1 - seg(t, S.title[1] - 0.3, S.title[1] + 1.5) * 0.0), transform: `scale(${0.9 + 0.1 * pop(t, S.title[0], S.title[0] + 0.9)})`}}>
          <div style={{textShadow: `0 0 ${30 + 20 * warn}px ${C.accent}, 0 0 80px rgba(56,189,248,0.6)`}}>
            <Bi ar="قاعدة البيانات العلائقية" en="Relational Database (RDBMS)" size={64} t={t} start={S.title[0] + 0.15} sep={C.accent} gap={26} />
          </div>
          <div style={{height: 4, width: 1100 * eo(prog(t, S.title[0] + 0.4, S.title[0] + 2)), borderRadius: 2, background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, boxShadow: `0 0 24px ${C.accent}`}} />
        </div>
      ) : null}

      <div style={{position: 'absolute', left: 90, top: 40, fontFamily: FONT_MONO, fontSize: 20, color: C.mute, opacity: enter}}><span style={{color: C.accent}}>SC05</span> relational / schema</div>
    </div>
  );
};
