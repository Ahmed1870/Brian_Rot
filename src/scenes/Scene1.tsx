import React from 'react';
import TL from '../timeline.json';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {ChaosSheet, ROW1_Y, SHEET_X0, SHEET_Y0} from '../components/ChaosSheet';
import {Burst} from '../components/Particles';
import {Bi, Pill, appear, pop} from '../components/Text';
import {clamp, eio, eo, fmt, hash, mix, prog, pulse, seg, shake, soft} from '../lib/anim';

const S = TL.cues.sc01;
const CX = 370;
const CY = 200;
const CW = 1180;
const CH = 680;
const STRIP_H = 52;

const SERIES = Array.from({length: 30}, (_, i) => 90 + i * 3.2 + Math.sin(i * 0.8) * 26 + hash(i * 2.1) * 30);
const CATS = [
  {n: 'إلكترونيات', v: 0.42, c: C.accent},
  {n: 'إكسسوارات', v: 0.27, c: C.violet},
  {n: 'منزل', v: 0.19, c: C.green},
  {n: 'أخرى', v: 0.12, c: C.amber},
];

const FileIcon: React.FC<{s?: number}> = ({s = 52}) => (
  <svg width={s} height={s} viewBox="0 0 52 52">
    <rect x="3" y="3" width="46" height="46" rx="10" fill="#16A34A" />
    <path d="M17 15 L35 37 M35 15 L17 37" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" />
  </svg>
);

const GHOSTS = ['Manzooma_Sales_FINAL.xlsx', 'Manzooma_Sales_FINAL_v2_NEW.xlsx', 'Manzooma_Sales_FINAL_REAL!!.xlsx', 'نسخة احتياطية - لا تحذف.xlsx', 'Manzooma_Sales_FINAL_v3 (copy).xlsx', 'Sales_backup_old_2025.xlsx', 'Manzooma_Sales_FINAL_v2 (1).xlsx', 'مبيعات_معدلة_أحمد.xlsx'];
const TOASTS = [
  {t: 17.4, x: 250, y: 330, txt: '#REF!', c: C.red},
  {t: 19.0, x: 1330, y: 290, txt: 'Circular reference warning', c: C.amber},
  {t: 21.0, x: 330, y: 780, txt: '#N/A', c: C.red},
  {t: 23.3, x: 1180, y: 720, txt: 'Excel is not responding', c: C.red},
  {t: 25.8, x: 640, y: 300, txt: 'File is locked for editing', c: C.amber},
  {t: 29.8, x: 1260, y: 880, txt: 'Do you want to save changes?', c: C.amber},
];

const Dashboard: React.FC<{t: number; flat: number; widgets: number}> = ({t, flat, widgets}) => {
  const cnt = eo(prog(t, S.counts[0], S.counts[1]));
  const lineP = eo(prog(t, 0.8, 4.5));
  const pts = SERIES.map((v, i) => `${(i / 29) * 660 + 30},${270 - (v - 80) * 1.15}`).join(' ');
  const kpis = [
    {l: 'إجمالي الإيرادات', v: 1250000 * cnt, u: 'EGP', d: '▲ 12.4%', big: true},
    {l: 'صافي الأرباح', v: 487300 * cnt, u: 'EGP', d: '▲ 8.1%', big: false},
    {l: 'عدد الطلبات', v: 3412 * cnt, u: '', d: '▲ 5.7%', big: false},
  ];
  const live = 0.5 + 0.5 * pulse(t, 1.4);
  const stripCells: [string, string, number][] = [['A1', 'Manzooma Store Analytics', 340], ['B1', '1,250,000 EGP', 220], ['C1', '487,300 EGP', 200], ['D1', '3,412', 130], ['E1', '▲ 12.4%', 150], ['F1', 'LIVE', 140]];
  return (
    <div style={{position: 'absolute', left: CX, top: CY, width: CW, height: mix(CH, STRIP_H, flat), borderRadius: mix(30, 8, flat), background: 'linear-gradient(160deg, #22304A 0%, #1B2740 100%)', border: `2px solid ${flat > 0.5 ? C.accent : 'rgba(255,255,255,0.16)'}`, boxShadow: `0 40px 120px rgba(0,0,0,0.55), 0 0 ${60 - 40 * flat}px rgba(56,189,248,${0.28 - 0.1 * flat})`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: CW, height: CH, opacity: widgets, transform: `scale(${1 - flat * 0.04})`, transformOrigin: '50% 0%'}}>
        <div style={{position: 'absolute', left: 32, top: 26, right: 32, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${C.accent}, ${C.violet})`}} />
            <span style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, color: C.text}}>Manzooma Store</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Pill size={20} mono bg="rgba(52,211,153,0.14)" color={C.green} border="rgba(52,211,153,0.5)"><span style={{width: 10, height: 10, borderRadius: 5, background: C.green, opacity: 0.4 + live * 0.6}} />LIVE</Pill>
            <Pill size={20} mono bg="rgba(255,255,255,0.06)" color={C.dim} border="rgba(255,255,255,0.14)">LAST 30 DAYS</Pill>
          </div>
        </div>
        {kpis.map((k, i) => {
          const a = appear(t, 0.3 + i * 0.25, 1.1 + i * 0.25);
          return (
            <div key={i} style={{position: 'absolute', left: 32 + i * 380, top: 108, width: 356, height: 150, borderRadius: 22, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)', opacity: a, transform: `translateY(${(1 - a) * 24}px)`, padding: '18px 24px', boxSizing: 'border-box'}}>
              <div style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 24, color: C.dim, direction: 'rtl', textAlign: 'right'}}>{k.l}</div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8, direction: 'ltr'}}>
                <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: k.big ? 54 : 50, color: C.text, letterSpacing: -2}}>{fmt(k.v)}</span>
                {k.u ? <span style={{fontFamily: FONT_MONO, fontSize: 24, color: C.accent}}>{k.u}</span> : null}
              </div>
              <div style={{marginTop: 4, fontFamily: FONT_MONO, fontSize: 22, fontWeight: 700, color: C.green}}>{k.d}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 32, top: 280, width: 720, height: 310, borderRadius: 22, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', opacity: appear(t, 0.9, 1.6)}}>
          <div style={{position: 'absolute', right: 24, top: 14, fontFamily: FONT_AR, fontWeight: 700, fontSize: 22, color: C.dim}}>المبيعات اليومية</div>
          <svg width="720" height="310" style={{position: 'absolute', left: 0, top: 0}}>
            <defs>
              <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={C.accent} stopOpacity="0.35" />
                <stop offset="1" stopColor={C.accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((g) => (
              <line key={g} x1="30" x2="690" y1={90 + g * 58} y2={90 + g * 58} stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
            ))}
            <polygon points={`30,290 ${pts} 690,290`} fill="url(#dashArea)" opacity={lineP} />
            <polyline points={pts} fill="none" stroke={C.accent} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - lineP} />
            <circle cx={30 + 660 * lineP} cy={270 - (SERIES[Math.min(29, Math.round(lineP * 29))] - 80) * 1.15} r={9} fill={C.text} stroke={C.accent} strokeWidth="4" />
          </svg>
        </div>
        <div style={{position: 'absolute', left: 772, top: 280, width: 376, height: 310, borderRadius: 22, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', opacity: appear(t, 1.1, 1.8)}}>
          <div style={{position: 'absolute', right: 24, top: 14, fontFamily: FONT_AR, fontWeight: 700, fontSize: 22, color: C.dim}}>حسب الفئة</div>
          <svg width="376" height="310">
            {(() => {
              let acc = 0;
              const sweep = eo(prog(t, 1.4, 4));
              return CATS.map((c, i) => {
                const len = c.v * sweep;
                const el = <circle key={i} cx="110" cy="176" r="64" fill="none" stroke={c.c} strokeWidth="30" pathLength={1} strokeDasharray={`${Math.max(0, len - 0.012)} 1`} strokeDashoffset={-acc} transform="rotate(-90 110 176)" />;
                acc += len;
                return el;
              });
            })()}
            {CATS.map((c, i) => (
              <g key={i}>
                <rect x="230" y={104 + i * 44} width="16" height="16" rx="4" fill={c.c} />
                <text x="258" y={118 + i * 44} fontFamily={FONT_AR} fontWeight="600" fontSize="22" fill={C.text}>{c.n}</text>
              </g>
            ))}
          </svg>
        </div>
        <div style={{position: 'absolute', left: 32, top: 608, right: 32, height: 46, display: 'flex', gap: 14, direction: 'rtl', alignItems: 'center', opacity: appear(t, 1.6, 2.3)}}>
          {['سماعة بلوتوث', 'شاحن سريع 65W', 'كيبورد ميكانيكي', 'ماوس لاسلكي'].map((p, i) => (
            <Pill key={i} size={20} bg="rgba(255,255,255,0.06)" color={C.text} border="rgba(255,255,255,0.14)">{p}</Pill>
          ))}
        </div>
      </div>
      {/* collapsed strip = "row 1" of the sheet */}
      <div style={{position: 'absolute', left: 0, top: 0, width: CW, height: STRIP_H, opacity: prog(flat, 0.7, 1), display: 'flex', alignItems: 'center', fontFamily: FONT_MONO, fontSize: 22, color: C.text}}>
        {stripCells.map(([a, v, w]) => (
          <div key={a} style={{width: w, height: STRIP_H, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', boxSizing: 'border-box', borderRight: '1.5px solid rgba(255,255,255,0.14)', color: a === 'E1' ? C.green : C.text}}>
            <span style={{fontSize: 14, color: C.mute}}>{a}</span>
            <span style={{fontWeight: 700}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Scene1: React.FC<{t: number}> = ({t}) => {
  // ---------------- camera ----------------
  const FOCUS_REV = {x: CX + 32 + 178, y: CY + 108 + 92};
  let s = 1;
  let fx = 960;
  let fy = 540;
  let rx = 0;
  let rz = 0;
  if (t < S.zoomOut[0]) {
    const p = soft(prog(t, 0.2, 9.5));
    s = mix(3.2, 1.12, p) - 0.07 * prog(t, 9.5, 12);
    fx = mix(FOCUS_REV.x, 960, p);
    fy = mix(FOCUS_REV.y, 540, p);
  } else {
    const p = eio(prog(t, S.zoomOut[0], S.zoomOut[1]));
    const d = prog(t, S.zoomOut[1], 35);
    s = mix(1.05, 0.5, p) - 0.08 * d;
    fx = mix(960, 900, p) + 700 * d;
    fy = mix(540, 1280, p) + 500 * d;
    rx = mix(0, 30, p) + 4 * d;
    rz = mix(0, -15, p) - 2 * d;
  }
  const sh = shake(t, t > 28 && t < 28.7 ? 14 * (1 - prog(t, 28, 28.7)) : 0.4);
  const cam = `perspective(2600px) rotateX(${rx}deg) rotateZ(${rz + sh.r}deg) scale(${s}) translate(${960 - fx + sh.x}px, ${540 - fy + sh.y}px)`;

  const flat = eio(prog(t, S.collapse[0], S.collapse[1]));
  const widgets = 1 - prog(t, S.collapse[0], S.collapse[0] + 0.9);
  const reveal = eo(prog(t, S.collapse[0] + 0.3, S.zoomOut[1] + 1));
  const reveR = reveal * 9500;
  const streak = Math.sin(clamp(prog(t, S.zoomOut[0], S.zoomOut[0] + 2.4)) * Math.PI);

  // ---------------- overlays ----------------
  const titleIn = appear(t, S.title[0], S.title[0] + 0.8) * (1 - seg(t, S.title[1] - 0.6, S.title[1]));
  const fileP = pop(t, S.file[0], S.file[0] + 0.9);
  const fileOut = seg(t, S.file[1] - 0.5, S.file[1]);
  const banP = prog(t, S.banner[0], S.banner[0] + 0.35);
  const banIn = eo(banP);
  const flash = 1 - prog(t, S.banner[0], S.banner[0] + 0.5);
  const fillGlow = 0.5 + 0.5 * pulse(t, 0.9);
  const stripe = (t * 60) % 74;

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />

      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '960px 540px', transform: cam}}>
        <div style={{position: 'absolute', left: SHEET_X0, top: SHEET_Y0, width: 7800, height: 4600, clipPath: `circle(${reveR}px at ${960 - SHEET_X0}px ${ROW1_Y + 26 - SHEET_Y0}px)`}}>
          <ChaosSheet />
        </div>
        <Dashboard t={t} flat={flat} widgets={widgets} />
        <Burst x={CX} y={CY} w={CW} h={CH} p={prog(t, S.collapse[0], S.collapse[1] + 0.8)} n={150} seed={3} colors={[C.accent, '#F8FAFC', C.violet, C.green]} spread={420} lift={-260} size={14} />
      </div>

      {streak > 0.02 ? (
        <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, opacity: streak * 0.55}}>
          {Array.from({length: 36}).map((_, i) => {
            const a = (i / 36) * Math.PI * 2 + hash(i) * 0.1;
            const r0 = 260 + hash(i * 3) * 240;
            const r1 = r0 + 160 + hash(i * 5) * 500;
            return <line key={i} x1={960 + Math.cos(a) * r0} y1={540 + Math.sin(a) * r0} x2={960 + Math.cos(a) * r1} y2={540 + Math.sin(a) * r1} stroke="#F8FAFC" strokeWidth={2 + hash(i * 7) * 3} opacity={0.15 + hash(i * 9) * 0.45} />;
          })}
        </svg>
      ) : null}

      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: 'radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(11,18,34,0.55) 75%, #0B1222 100%)', opacity: reveal, pointerEvents: 'none'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 320, background: 'linear-gradient(180deg, rgba(11,18,34,0.9), transparent)', opacity: reveal, pointerEvents: 'none'}} />

      {titleIn > 0.01 ? (
        <div style={{position: 'absolute', left: 72, top: 64, opacity: titleIn, transform: `translateY(${(1 - titleIn) * -18}px)`}}>
          <Bi en="Manzooma Store Analytics" ar="لوحة مبيعات منظومة" first="en" size={44} t={t} start={S.title[0] + 0.1} />
          <div style={{height: 3, width: 760 * eo(prog(t, S.title[0] + 0.3, S.title[0] + 1.6)), background: `linear-gradient(90deg, ${C.accent}, transparent)`, marginTop: 14, borderRadius: 2}} />
        </div>
      ) : null}

      {GHOSTS.map((g, i) => {
        const t0 = S.ghosts[0] + i * 1.15;
        const p = prog(t, t0, t0 + 7);
        if (p <= 0 || p >= 1) return null;
        const y = mix(1130, -140, p);
        const x = 90 + hash(i * 4.1) * 1250;
        const op = Math.min(1, p * 6) * Math.min(1, (1 - p) * 6) * 0.82;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: op, transform: `rotate(${(hash(i * 2.7) - 0.5) * 14}deg) scale(${0.92 + hash(i) * 0.25})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px 10px 12px', borderRadius: 16, background: 'rgba(30,41,59,0.92)', border: '1.5px solid rgba(255,255,255,0.16)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)'}}>
              <FileIcon s={40} />
              <span style={{fontFamily: FONT_MONO, fontSize: 25, color: C.text, unicodeBidi: 'plaintext'}}>{g}</span>
            </div>
          </div>
        );
      })}

      {TOASTS.map((q, i) => {
        const p = prog(t, q.t, q.t + 2.6);
        if (p <= 0 || p >= 1) return null;
        const a = Math.min(1, p * 8) * Math.min(1, (1 - p) * 6);
        return (
          <div key={i} style={{position: 'absolute', left: q.x, top: q.y, opacity: a, transform: `scale(${0.85 + 0.15 * eo(Math.min(1, p * 6))})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 14, background: 'rgba(15,23,42,0.94)', borderLeft: `6px solid ${q.c}`, boxShadow: `0 14px 40px rgba(0,0,0,0.55), 0 0 26px ${q.c}55`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: C.text}}>
              <svg width="30" height="30" viewBox="0 0 30 30"><path d="M15 3 L28 26 L2 26 Z" fill={q.c} /><rect x="13.5" y="11" width="3" height="8" rx="1.5" fill="#0F172A" /><circle cx="15" cy="22.5" r="1.8" fill="#0F172A" /></svg>
              {q.txt}
            </div>
          </div>
        );
      })}

      {t >= S.file[0] - 0.1 && t < S.file[1] + 0.2 ? (
        <div style={{position: 'absolute', left: 0, top: 70, width: 1920, display: 'flex', justifyContent: 'center', opacity: (1 - fileOut) * Math.min(1, fileP * 1.4), transform: `translateY(${(1 - fileP) * -90}px)`}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 40px 18px 24px', borderRadius: 26, background: 'rgba(15,23,42,0.94)', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 30px 90px rgba(0,0,0,0.6), 0 0 50px rgba(22,163,74,0.35)'}}>
              <FileIcon s={64} />
              <span style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 52, color: C.text, letterSpacing: -1}}>Manzooma_Sales_FINAL_v2.xlsx</span>
            </div>
            <div style={{display: 'flex', gap: 14}}>
              <Pill mono size={22} bg="rgba(251,191,36,0.14)" color={C.amber} border="rgba(251,191,36,0.5)">48,213 rows</Pill>
              <Pill mono size={22} bg="rgba(251,191,36,0.14)" color={C.amber} border="rgba(251,191,36,0.5)">187 columns</Pill>
              <Pill mono size={22} bg="rgba(239,68,68,0.14)" color="#FCA5A5" border="rgba(239,68,68,0.5)">214 MB</Pill>
            </div>
          </div>
        </div>
      ) : null}

      {banP > 0 ? (
        <div style={{position: 'absolute', left: 0, top: 410, width: 1920, height: 250, opacity: Math.min(1, banP * 3), transform: `scale(${mix(1.35, 1, banIn)}) translate(${(hash(Math.floor(t * 30)) - 0.5) * 8 * flash}px, 0px)`, transformOrigin: '960px 125px'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 250, background: `linear-gradient(180deg, #B91C1C, ${C.red} 50%, #B91C1C)`, boxShadow: `0 0 ${70 + fillGlow * 60}px rgba(239,68,68,0.7)`}} />
          <div style={{position: 'absolute', left: -80, top: 0, width: 2080, height: 26, background: `repeating-linear-gradient(-45deg, #0F172A 0px, #0F172A 18px, ${C.amber} 18px, ${C.amber} 37px)`, transform: `translateX(${stripe}px)`}} />
          <div style={{position: 'absolute', left: -80, bottom: 0, width: 2080, height: 26, background: `repeating-linear-gradient(-45deg, #0F172A 0px, #0F172A 18px, ${C.amber} 18px, ${C.amber} 37px)`, transform: `translateX(${-stripe}px)`}} />
          <div style={{position: 'absolute', left: 0, top: 26, width: 1920, height: 198, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36}}>
            <svg width="110" height="110" viewBox="0 0 104 104" style={{filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))'}}><path d="M52 8 L98 90 L6 90 Z" fill={C.amber} stroke="#0F172A" strokeWidth="5" strokeLinejoin="round" /><rect x="48" y="38" width="8" height="30" rx="4" fill="#0F172A" /><circle cx="52" cy="78" r="5" fill="#0F172A" /></svg>
            <Bi ar="فوضى الملفات المسطحة" en="Flat File Chaos" size={84} t={t} start={S.banner[0] + 0.15} color="#fff" sep={C.amber} weight={900} gap={30} />
          </div>
        </div>
      ) : null}
      {flash > 0 && t >= S.banner[0] ? <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: '#fff', opacity: flash * 0.22, pointerEvents: 'none'}} /> : null}
    </div>
  );
};
