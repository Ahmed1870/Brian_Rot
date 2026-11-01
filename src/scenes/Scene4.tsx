import React from 'react';
import TL from '../timeline.json';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {Bg, Glass} from '../components/Glass';
import {Cursor, Ripples} from '../components/Cursor';
import {Bi, appear, pop} from '../components/Text';
import {CursorKey, cursorAt, eo, fmt, hash, mix, prog, pulse, rng, seg, shake} from '../lib/anim';

const S = TL.cues.sc04;

type Dept = {id: string; label: string; ar: string; color: string; value: string; arrive: number; start: {x: number; y: number}; target: {x: number; y: number}; card: {x: number; y: number}};
const DEPTS: Dept[] = [
  {id: 'sales', label: 'Sales', ar: 'المبيعات', color: '#38BDF8', value: '1,250', arrive: 118.5, start: {x: 140, y: 150}, target: {x: 800, y: 468}, card: {x: 90, y: 250}},
  {id: 'finance', label: 'Finance', ar: 'المالية', color: '#34D399', value: '1,300', arrive: 119.1, start: {x: 1760, y: 150}, target: {x: 1110, y: 468}, card: {x: 1410, y: 250}},
  {id: 'shipping', label: 'Shipping', ar: 'الشحن', color: '#FBBF24', value: '1,275', arrive: 119.7, start: {x: 140, y: 980}, target: {x: 800, y: 540}, card: {x: 90, y: 470}},
  {id: 'support', label: 'Support', ar: 'الدعم', color: '#F472B6', value: '1,260', arrive: 120.3, start: {x: 1760, y: 980}, target: {x: 1110, y: 540}, card: {x: 1410, y: 470}},
];

// deterministic click times per cursor: rapid until 128s, slower until the freeze
const CLICKS: number[][] = DEPTS.map((d, i) => {
  const out: number[] = [];
  let t = d.arrive + 0.2;
  while (t < 147) {
    out.push(t);
    const dense = t < S.clicks[1];
    t += (dense ? 0.16 : 0.42) + hash(t * 7 + i) * (dense ? 0.14 : 0.3);
  }
  return out;
});

const Warn: React.FC<{s?: number; c?: string}> = ({s = 60, c = C.amber}) => (
  <svg width={s} height={s} viewBox="0 0 104 104"><path d="M52 8 L98 90 L6 90 Z" fill={c} stroke="#0F172A" strokeWidth="5" strokeLinejoin="round" /><rect x="48" y="38" width="8" height="30" rx="4" fill="#0F172A" /><circle cx="52" cy="78" r="5" fill="#0F172A" /></svg>
);

export const Scene4: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 115.1, 116);
  const stress = prog(t, 118, 148);
  const frozen = t >= S.freeze;
  const modalP = pop(t, S.modal[0], S.modal[0] + 0.6);
  const modalOn = t >= S.modal[0];
  const amp = modalOn ? 14 * (1 - prog(t, S.modal[0], S.modal[0] + 1.2)) + 1.2 : 1 + 24 * Math.pow(stress, 2.2);
  const sh = shake(t, enter < 1 ? 0 : amp);
  const warn = 0.5 + 0.5 * pulse(t, 0.7);
  const redTint = Math.min(1, stress * 0.9) * 0.35;

  const active = t >= 119.2 && t < S.modal[0];
  const cycle = Math.floor(t * 9) % 4;
  const cd = DEPTS[cycle];
  const rgb = active ? 1 + 5 * stress : 0;
  const cellText = !active ? '1,000' : cd.value;

  const rawP = prog(t, 126, S.freeze);
  const stutter = rawP < 1 ? Math.floor(rawP * 99 * (1 + 0.04 * Math.sin(t * 9))) : 99;
  const pct = Math.min(99, Math.max(0, stutter));
  const spin = frozen ? 0 : t * 360;

  const mP = eo(prog(t, S.badge2[0], S.badge2[1] + 2));
  const metrics = [
    {l: 'FILE SIZE', ar: 'حجم الملف', v: `${fmt(rng(t, 130, 146, 84, 412))} MB`, f: mix(0.18, 1, mP), c: C.amber},
    {l: 'OPEN TIME', ar: 'زمن الفتح', v: `${fmt(rng(t, 130, 146, 3, 47))} s`, f: mix(0.08, 0.95, mP), c: C.red},
    {l: 'ROWS', ar: 'عدد الصفوف', v: `${fmt(rng(t, 130, 146, 48213, 212480))}`, f: mix(0.22, 1, mP), c: C.violet},
  ];

  const b1In = pop(t, S.badge1[0], S.badge1[0] + 0.8);
  const b1Out = seg(t, S.badge1[1] - 0.4, S.badge1[1]);
  const b2In = pop(t, S.badge2[0], S.badge2[0] + 0.8);
  const b2Out = seg(t, S.badge2[1] + 2.2, S.badge2[1] + 2.8);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden', background: C.bg}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)`, transformOrigin: '960px 540px', opacity: enter}}>
        <Bg t={t} tint={stress > 0.3 ? C.red : C.accent} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(239,68,68,${redTint}) 100%)`}} />

        <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, opacity: 0.55}}>
          {Array.from({length: 8}).map((_, i) => (
            <line key={'h' + i} x1={560} x2={1360} y1={360 + i * 70} y2={360 + i * 70} stroke="#334155" strokeWidth="1.5" />
          ))}
          {Array.from({length: 6}).map((_, i) => (
            <line key={'v' + i} y1={360} y2={360 + 7 * 70} x1={560 + i * 160} x2={560 + i * 160} stroke="#334155" strokeWidth="1.5" />
          ))}
        </svg>
        <div style={{position: 'absolute', left: 860, top: 322, width: 200, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: C.accent}}>A</div>
        <div style={{position: 'absolute', left: 700, top: 482, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: C.mute}}>12</div>

        <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0}}>
          {DEPTS.map((d, i) => {
            const a = appear(t, d.arrive - 0.4, d.arrive + 0.4);
            const x1 = d.card.x < 960 ? d.card.x + 420 : d.card.x;
            const x2 = d.card.x < 960 ? 760 : 1160;
            return <line key={d.id} x1={x1} y1={d.card.y + 85} x2={x2} y2={500 + (i % 2 ? 24 : -24)} stroke={d.color} strokeWidth="4" strokeDasharray="6 12" strokeDashoffset={-t * 60} opacity={a * (0.35 + 0.5 * (cycle === i ? 1 : 0.3))} />;
          })}
        </svg>
        {DEPTS.map((d, i) => {
          const a = pop(t, d.arrive - 0.4, d.arrive + 0.5);
          const typedLen = Math.floor(prog(t, d.arrive + 0.3, d.arrive + 1.3) * d.value.length);
          const saving = !frozen && Math.floor(t * 3 + i) % 2 === 0;
          return (
            <div key={d.id} style={{position: 'absolute', left: d.card.x, top: d.card.y, width: 420, height: 170, opacity: Math.min(1, a * 1.5) * (modalOn ? 0.4 : 1), transform: `scale(${0.85 + 0.15 * a})`}}>
              <Glass w={420} h={170} r={24} tint={d.color} glow={cycle === i && active ? 40 : 14} t={t} style={{border: `2px solid ${d.color}`}}>
                <div style={{padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 10}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                      <span style={{width: 16, height: 16, borderRadius: 8, background: d.color, boxShadow: `0 0 14px ${d.color}`}} />
                      <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: d.color}}>{d.label}</span>
                      <span style={{fontFamily: FONT_AR, fontWeight: 600, fontSize: 22, color: C.dim}}>{d.ar}</span>
                    </div>
                    <span style={{fontFamily: FONT_MONO, fontSize: 16, color: frozen ? C.red : C.mute}}>{frozen ? 'NOT RESPONDING' : saving ? 'saving…' : 'editing'}</span>
                  </div>
                  <div style={{fontFamily: FONT_MONO, fontSize: 24, color: C.dim}}>A12 ←</div>
                  <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 46, color: C.text}}>{d.value.slice(0, typedLen)}<span style={{opacity: Math.floor(t * 4) % 2, color: d.color}}>|</span></div>
                </div>
              </Glass>
            </div>
          );
        })}

        <div style={{position: 'absolute', left: 760, top: 432, width: 400, height: 136}}>
          {DEPTS.map((d, i) => (
            <div key={d.id} style={{position: 'absolute', left: -8 + (i % 2) * 16 * stress, top: -8 + Math.floor(i / 2) * 16 * stress, width: 416, height: 152, borderRadius: 10, border: `4px solid ${d.color}`, opacity: active ? (cycle === i ? 1 : 0.45) : 0, boxShadow: cycle === i ? `0 0 40px ${d.color}` : undefined}} />
          ))}
          <div style={{position: 'absolute', left: 0, top: 0, width: 400, height: 136, borderRadius: 8, background: 'rgba(15,23,42,0.96)', border: `3px solid ${active ? cd.color : C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 84, color: active ? cd.color : C.text, textShadow: rgb > 0 ? `${rgb}px 0 rgba(239,68,68,0.9), ${-rgb}px 0 rgba(56,189,248,0.9)` : undefined}}>{cellText}</div>
          {active && !frozen ? (
            <div style={{position: 'absolute', left: 0, top: -58, display: 'flex', gap: 10, alignItems: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, color: '#FCA5A5', opacity: 0.5 + 0.5 * warn}}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#FCA5A5" strokeWidth="3"><rect x="5" y="12" width="16" height="11" rx="3" /><path d="M8 12V8a5 5 0 0 1 10 0v4" /></svg>
              locked by {DEPTS[(cycle + 1) % 4].label}
            </div>
          ) : null}
        </div>

        {DEPTS.map((d, i) => {
          const keys: CursorKey[] = [
            {x: d.start.x, y: d.start.y, arrive: 0, depart: d.arrive - 1.5},
            {x: d.target.x, y: d.target.y, arrive: d.arrive, depart: 999},
          ];
          const c = cursorAt(keys, t);
          const jitterOn = t >= d.arrive && !frozen;
          const jx = jitterOn ? (hash(Math.floor(t * 18) + i * 5.3) - 0.5) * (10 + 22 * stress) : 0;
          const jy = jitterOn ? (hash(Math.floor(t * 18) + i * 8.1) - 0.5) * (10 + 22 * stress) : 0;
          const op = appear(t, d.arrive - 1.7, d.arrive - 1.2) * (modalOn ? 1 - seg(t, S.modal[0], S.modal[0] + 0.5) : 1);
          return (
            <React.Fragment key={d.id}>
              <Ripples t={t} x={c.x + jx} y={c.y + jy} clicks={CLICKS[i]} color={d.color} />
              <Cursor x={c.x + jx} y={c.y + jy} color={d.color} label={d.label} opacity={op} />
            </React.Fragment>
          );
        })}

        {t >= 126 ? (
          <div style={{position: 'absolute', left: 390, top: 880, width: 1140, opacity: appear(t, 126, 127)}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: frozen ? '#FCA5A5' : C.text, direction: 'rtl'}}>
                <svg width="34" height="34" viewBox="0 0 34 34" style={{transform: `rotate(${spin}deg)`}}><circle cx="17" cy="17" r="12" fill="none" stroke={frozen ? C.red : C.accent} strokeWidth="5" strokeDasharray="50 30" strokeLinecap="round" /></svg>
                {frozen ? 'لا يستجيب… Saving' : 'جاري الحفظ… Saving'}
              </div>
              <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: frozen ? C.red : C.accent, opacity: frozen && Math.floor(t * 8) % 5 === 0 ? 0.3 : 1}}>{pct}%</div>
            </div>
            <div style={{height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.08)', overflow: 'hidden'}}>
              <div style={{width: `${pct}%`, height: 24, borderRadius: 12, background: frozen ? `repeating-linear-gradient(45deg, ${C.red} 0px, ${C.red} 14px, #B91C1C 14px, #B91C1C 28px)` : `linear-gradient(90deg, ${C.accent2}, ${C.accent})`}} />
            </div>
          </div>
        ) : null}
        {t >= S.badge2[0] - 0.2 ? (
          <div style={{position: 'absolute', left: 390, top: 700, width: 1140, display: 'flex', gap: 30, opacity: Math.min(1, b2In * 1.4) * (modalOn ? 0.35 : 1)}}>
            {metrics.map((m, i) => (
              <div key={i} style={{flex: 1, height: 150, borderRadius: 22, background: 'rgba(30,41,59,0.92)', border: `2px solid ${m.c}66`, padding: '16px 24px', boxSizing: 'border-box', boxShadow: `0 0 28px ${m.c}33`}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 18, color: C.mute, letterSpacing: 2}}>
                  <span>{m.l}</span>
                  <span style={{fontFamily: FONT_AR, letterSpacing: 0, fontSize: 20}}>{m.ar}</span>
                </div>
                <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 50, color: m.c, margin: '6px 0 10px'}}>{m.v}</div>
                <div style={{height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)'}}>
                  <div style={{width: `${m.f * 100}%`, height: 10, borderRadius: 5, background: m.c}} />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {t >= S.badge1[0] - 0.1 && t < S.badge1[1] + 0.3 ? (
          <div style={{position: 'absolute', left: 0, top: 96, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, b1In * 1.4) * (1 - b1Out), transform: `translateY(${(1 - b1In) * -70}px) scale(${0.92 + 0.08 * b1In})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '18px 48px 18px 36px', borderRadius: 999, background: 'rgba(15,23,42,0.95)', border: `2px solid ${C.amber}`, boxShadow: `0 20px 70px rgba(0,0,0,0.55), 0 0 ${30 + warn * 30}px rgba(251,191,36,0.4)`}}>
              <Warn s={56} />
              <Bi ar="صراع التزامن" en="Concurrency Conflicts" size={54} t={t} start={S.badge1[0] + 0.15} sep={C.amber} />
            </div>
          </div>
        ) : null}
        {t >= S.badge2[0] - 0.1 && t < S.badge2[1] + 3 ? (
          <div style={{position: 'absolute', left: 0, top: 96, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, b2In * 1.4) * (1 - b2Out), transform: `translateY(${(1 - b2In) * -70}px) scale(${0.92 + 0.08 * b2In})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '18px 48px 18px 36px', borderRadius: 999, background: 'rgba(15,23,42,0.95)', border: `2px solid ${C.red}`, boxShadow: `0 20px 70px rgba(0,0,0,0.55), 0 0 ${30 + warn * 30}px rgba(239,68,68,0.45)`}}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={C.red} strokeWidth="5" strokeLinecap="round"><ellipse cx="28" cy="14" rx="18" ry="7" /><path d="M10 14v14c0 4 8 7 18 7s18-3 18-7V14M10 28v14c0 4 8 7 18 7s18-3 18-7V28" /></svg>
              <Bi ar="تضخم المساحة والبطء" en="File Size Bottleneck" size={52} t={t} start={S.badge2[0] + 0.15} sep={C.red} />
            </div>
          </div>
        ) : null}
      </div>

      {modalOn ? (
        <>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: `rgba(127,29,29,${0.5 * Math.min(1, (t - S.modal[0]) * 4)})`}} />
          {t < S.modal[0] + 0.25 ? <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: '#fff', opacity: 0.55 * (1 - prog(t, S.modal[0], S.modal[0] + 0.25))}} /> : null}
          <div style={{position: 'absolute', left: 560, top: 290, width: 800, height: 450, transform: `translate(${sh.x * 0.6}px, ${sh.y * 0.6}px) scale(${0.7 + 0.3 * modalP})`, opacity: Math.min(1, modalP * 2)}}>
            <div style={{position: 'relative', width: 800, height: 450, borderRadius: 14, background: '#F1F5F9', border: '2px solid #94A3B8', boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(239,68,68,0.5)', overflow: 'hidden'}}>
              <div style={{height: 54, background: 'linear-gradient(90deg, #991B1B, #DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, color: '#fff'}}>
                <span>Microsoft Excel</span>
                <span style={{width: 34, height: 34, borderRadius: 6, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>×</span>
              </div>
              <div style={{display: 'flex', gap: 30, padding: '36px 40px 0'}}>
                <svg width="104" height="104" viewBox="0 0 104 104"><circle cx="52" cy="52" r="46" fill="#DC2626" /><path d="M34 34 L70 70 M70 34 L34 70" stroke="#fff" strokeWidth="11" strokeLinecap="round" /></svg>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: '#991B1B', lineHeight: 1.2, textShadow: t < S.modal[0] + 0.6 ? '2px 0 rgba(56,189,248,0.7), -2px 0 rgba(239,68,68,0.5)' : undefined}}>CRITICAL ERROR:<br />File Corrupted</div>
                  <div style={{fontFamily: FONT_MONO, fontSize: 22, color: '#334155', marginTop: 18, lineHeight: 1.4}}>Manzooma_Sales_FINAL_v2.xlsx<br />cannot be opened or repaired.</div>
                </div>
              </div>
              <div style={{position: 'absolute', right: 34, bottom: 28, display: 'flex', gap: 16}}>
                <div style={{width: 150, height: 54, borderRadius: 8, background: '#E2E8F0', border: '2px solid #94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, color: '#334155'}}>Details</div>
                <div style={{width: 150, height: 54, borderRadius: 8, background: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, color: '#fff'}}>OK</div>
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 5px)', pointerEvents: 'none'}} />
        </>
      ) : null}
    </div>
  );
};
