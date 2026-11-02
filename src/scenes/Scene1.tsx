import React from 'react';
import TL from '../timeline.json';
import {C, K, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Bi, appear, pop} from '../components/Text';
import {back, ei, eo, mix, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc01;
const CX = [430, 960, 1490];
const CY = 330;
const CW = 380;
const CH = 400;

type Box = {key: string; color: string; title: string; sub: string; icon: string};
const BOXES: Box[] = [
  {key: 'txt', color: K.txt, title: 'TEXT', sub: 'VARCHAR · TEXT', icon: 'Aa'},
  {key: 'num', color: K.num, title: 'NUMERIC', sub: 'INT · NUMERIC · FLOAT', icon: '123'},
  {key: 'bool', color: K.bool, title: 'BOOLEAN', sub: 'TRUE · FALSE', icon: '✓/✕'},
];
const ITEMS: {box: number; text: string; ar?: boolean}[] = [
  {box: 0, text: 'ahmed@mail.com'},
  {box: 1, text: '1250.50'},
  {box: 2, text: 'TRUE'},
  {box: 0, text: 'سماعة بلوتوث', ar: true},
  {box: 1, text: '42'},
  {box: 2, text: 'FALSE'},
];
const FALL = 1.15;

const wave = (w: number, y: number, t: number, amp: number): string => {
  let d = `M0 ${y}`;
  for (let x = 0; x <= w; x += 20) d += ` L${x} ${y + Math.sin(x * 0.03 + t * 3) * amp}`;
  return d + ` L${w} 600 L0 600 Z`;
};

export const Scene1: React.FC<{t: number}> = ({t}) => {
  const surge = Math.sin(prog(t, S.absorb, S.absorb + 1.6) * Math.PI);
  const levels = BOXES.map((_, bi) => {
    let lv = 0.08;
    ITEMS.forEach((it, i) => {
      if (it.box === bi) lv += 0.13 * eo(prog(t, S.drops[i] - 0.1, S.drops[i] + 0.7));
    });
    return Math.min(0.78, lv + 0.06 * surge);
  });
  const pulses = BOXES.map((_, bi) => {
    let p = 0;
    ITEMS.forEach((it, i) => {
      if (it.box === bi) p = Math.max(p, Math.sin(prog(t, S.drops[i], S.drops[i] + 0.7) * Math.PI) * (t >= S.drops[i] ? 1 : 0));
    });
    return p;
  });

  const badgeP = pop(t, S.badge[0], S.badge[0] + 0.8) * (1 - seg(t, S.badge[1] - 0.4, S.badge[1]));
  const metricP = pop(t, S.metric[0], S.metric[0] + 0.8);
  const rej = prog(t, S.reject - 1.0, S.reject + 1.6);
  const gaugeP = eo(prog(t, S.gauge[0], S.gauge[0] + 3));

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />

      {/* top badge: philosophy, then the metric tag */}
      <div style={{position: 'absolute', left: 0, top: 92, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, badgeP * 1.5), transform: `translateY(${(1 - badgeP) * -60}px) scale(${0.92 + 0.08 * badgeP})`}}>
        {badgeP > 0.01 ? (
          <div style={{padding: '18px 54px', borderRadius: 999, background: 'rgba(30,41,59,0.95)', border: `2px solid ${K.txt}`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${K.txt}44`}}>
            <Bi ar="أنواع البيانات: اختيار وعاء التخزين" en="Data Types Philosophy" size={52} t={t} start={S.badge[0] + 0.15} />
          </div>
        ) : null}
      </div>
      <div style={{position: 'absolute', left: 0, top: 96, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, metricP * 1.5), transform: `translateY(${(1 - metricP) * -60}px)`}}>
        {metricP > 0.01 ? (
          <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '16px 44px', borderRadius: 22, background: 'rgba(16,185,129,0.14)', border: `2px solid ${K.num}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34, color: C.text, boxShadow: `0 0 36px ${K.num}44`}}>
            <span style={{color: K.num}}>Correct Type</span>
            <svg width="120" height="24" viewBox="0 0 120 24"><line x1="0" y1="12" x2={104 * eo(prog(t, S.metric[0] + 0.3, S.metric[0] + 1.3))} y2="12" stroke={K.num} strokeWidth="4" strokeLinecap="round" /><path d="M96 4 L114 12 L96 20" fill="none" stroke={K.num} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={prog(t, S.metric[0] + 1, S.metric[0] + 1.3)} /></svg>
            <span>Optimized Storage &amp; High Query Speed</span>
          </div>
        ) : null}
      </div>

      {/* containers */}
      {BOXES.map((b, i) => {
        const inP = pop(t, 0.6 + i * 0.35, 1.6 + i * 0.35);
        const sc = (0.8 + 0.2 * inP) * (1 + 0.05 * pulses[i]);
        const lvY = 40 + (1 - levels[i]) * (CH - 60);
        const idc = 'clip' + i;
        const bright = i === 2 && rej > 0 && rej < 1 ? Math.sin(rej * Math.PI) : 0;
        return (
          <div key={b.key} style={{position: 'absolute', left: CX[i] - CW / 2 - 12, top: CY - 10, width: CW + 24, height: CH + 140, opacity: Math.min(1, inP * 1.6), transform: `scale(${sc})`, transformOrigin: '50% 55%'}}>
            <svg width={CW + 24} height={CH + 140} viewBox={`-12 -10 ${CW + 24} ${CH + 140}`} style={{overflow: 'visible'}}>
              <defs>
                <clipPath id={idc}><rect x="0" y="22" width={CW} height={CH - 22} rx="34" /></clipPath>
                <linearGradient id={'lg' + i} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={b.color} stopOpacity="0.9" />
                  <stop offset="1" stopColor={b.color} stopOpacity="0.45" />
                </linearGradient>
              </defs>
              <rect x="0" y="22" width={CW} height={CH - 22} rx="34" fill="rgba(30,41,59,0.9)" />
              <g clipPath={`url(#${idc})`}>
                <path d={wave(CW, lvY, t + i, 7 + 6 * pulses[i])} fill={`url(#lg${i})`} />
                <path d={wave(CW, lvY + 8, t * 1.3 + i * 2, 5)} fill={b.color} opacity="0.25" />
              </g>
              <text x={CW / 2} y={CH * 0.5} textAnchor="middle" fontFamily={FONT_MONO} fontWeight="800" fontSize="110" fill={b.color} opacity={0.22 + 0.1 * pulse(t + i, 3)}>{b.icon}</text>
              <rect x="0" y="22" width={CW} height={CH - 22} rx="34" fill="none" stroke={bright > 0 ? K.err : b.color} strokeWidth={5 + 5 * bright} />
              <rect x="-10" y="0" width={CW + 20} height="36" rx="18" fill="#0F172A" stroke={bright > 0 ? K.err : b.color} strokeWidth="5" />
              <text x={CW / 2} y={CH + 62} textAnchor="middle" fontFamily={FONT_MONO} fontWeight="800" fontSize="52" fill={b.color}>{b.title}</text>
              <text x={CW / 2} y={CH + 108} textAnchor="middle" fontFamily={FONT_MONO} fontWeight="500" fontSize="24" fill={C.dim}>{b.sub}</text>
            </svg>
            {i === 2 && rej > 0 && rej < 1 ? <div style={{position: 'absolute', left: 0, top: CH + 130, width: CW + 24, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 20, color: K.err, opacity: Math.sin(rej * Math.PI)}}>ERROR: invalid input syntax for type boolean: "999"</div> : null}
          </div>
        );
      })}

      {/* falling data chips */}
      {ITEMS.map((it, i) => {
        const land = S.drops[i];
        const p = prog(t, land - FALL, land);
        if (t < land - FALL || t > land + 0.55) return null;
        const after = prog(t, land, land + 0.55);
        const y = t < land ? mix(-70, CY + 20, ei(p)) : mix(CY + 20, CY + 130, eo(after));
        const sc = t < land ? 1 : 1 - 0.75 * eo(after);
        const color = BOXES[it.box].color;
        return (
          <div key={i} style={{position: 'absolute', left: CX[it.box] - 120 + Math.sin(p * 3) * 10 * (1 - p), top: y, width: 240, display: 'flex', justifyContent: 'center', opacity: 1 - after * 0.6, transform: `scale(${sc})`}}>
            <div style={{padding: '10px 28px', borderRadius: 16, background: color, color: C.bg, fontFamily: it.ar ? FONT_AR : FONT_MONO, fontWeight: 800, fontSize: 32, whiteSpace: 'nowrap', boxShadow: `0 10px 30px ${color}88`}}>{it.text}</div>
          </div>
        );
      })}

      {/* rejected chip: a number tries to enter the BOOLEAN container */}
      {rej > 0 && rej < 1 ? (() => {
        const down = prog(rej, 0, 0.4);
        const up = prog(rej, 0.45, 1);
        const y = rej < 0.45 ? mix(-60, CY - 36, ei(down)) : mix(CY - 36, -60, eo(up));
        return (
          <div style={{position: 'absolute', left: CX[2] - 120, top: y, width: 240, display: 'flex', justifyContent: 'center', transform: `rotate(${rej > 0.45 ? (rej - 0.45) * 40 : 0}deg)`}}>
            <div style={{padding: '10px 28px', borderRadius: 16, background: K.num, color: C.bg, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 32}}>999</div>
          </div>
        );
      })() : null}

      {/* storage gauge */}
      {t >= S.gauge[0] - 0.2 ? (
        <div style={{position: 'absolute', left: 280, top: 880, width: 1360, opacity: appear(t, S.gauge[0] - 0.2, S.gauge[0] + 0.6)}}>
          {[
            {label: 'Wrong type', ar: 'نوع غير مناسب', w: 0.92, c: K.err},
            {label: 'Correct type', ar: 'النوع الصحيح', w: 0.38, c: K.num},
          ].map((r, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 14}}>
              <div style={{width: 250, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, color: r.c}}>{r.label}</div>
              <div style={{flex: 1, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
                <div style={{width: `${r.w * 100 * gaugeP}%`, height: 34, borderRadius: 17, background: `linear-gradient(90deg, ${r.c}99, ${r.c})`}} />
              </div>
              <div style={{width: 210, fontFamily: FONT_AR, fontWeight: 700, fontSize: 24, color: C.dim, direction: 'rtl'}}>{r.ar}</div>
            </div>
          ))}
          <div style={{position: 'absolute', right: -20, top: -44, fontFamily: FONT_MONO, fontSize: 20, color: C.mute, letterSpacing: 2}}>DISK · RAM</div>
        </div>
      ) : null}
    </div>
  );
};
