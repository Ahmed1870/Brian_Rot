import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Editor, Kpi, Mix, Stage, TopBadge, clamp, lin, pop, sec} from '../kit';
import {PHONES} from '../data';

// SC01 (0-43s): LENGTH - character indexing ruler + integrity validation.
// Anchors (s): 0.5 welcome | 8.8 real world | 18.0 LENGTH | 20.3 walks the string | 23.7 counts | 29.4 integrity | 34.2 phone numbers
const S = START.s1;
const t = (g: number) => sec(g - S);
const TXT = '01012345678';
const CW = 112;
const X0 = (1920 - TXT.length * CW + 12) / 2;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const count = Math.ceil(lin(f, t(20.3), sec(8.6)) * TXT.length);
  const done = f >= t(29.4) && count >= TXT.length;
  const ruler = clamp(lin(f, t(20.0), 14));

  return (
    <Stage dur={1290} inFx="zoom" outFx="left">
      <TopBadge text="دوال النصوص المتقدمة | Advanced String Manipulation" from={sec(2)} to={sec(18)} color={C.purple} />

      <Editor x={80} y={180} w={800} h={170} title="Query Editor" lines={['SELECT phone, LENGTH(phone)', 'FROM customers;']} start={t(18.0)} cps={0.9} size={28} hl={f > t(20) ? 0 : -1} hlColor={C.purple} />
      <Kpi x={960} y={186} w={880} h={150} label="LENGTH(phone)" ar="عدد الخانات النصية" value={String(count)} color={done ? C.green : C.purple} p={lin(f, t(18.8), 14)} glow={done ? 1 : 0} />

      {/* the string bar */}
      {TXT.split('').map((ch, i) => {
        const p = clamp(pop(f, t(8.8 + i * 0.12)));
        const hit = i < count;
        const col = done ? C.green : hit ? C.purple : C.blue;
        return (
          <div key={i} dir="ltr" style={{position: 'absolute', left: X0 + i * CW, top: 410, width: 100, height: 96, borderRadius: 14, border: `4px solid ${col}`, background: `${col}22`, color: C.text, fontFamily: MONO, fontSize: 54, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p, transform: `scale(${0.7 + 0.3 * p})`, boxShadow: done ? `0 0 24px ${C.green}88` : 'none'}}>
            {ch}
          </div>
        );
      })}
      <div dir="ltr" style={{position: 'absolute', left: X0 - 10, top: 372, fontFamily: MONO, fontSize: 22, color: C.muted, opacity: clamp(lin(f, t(8.8), 14))}}>phone = '{TXT}'</div>

      {/* indexing ruler */}
      <div style={{position: 'absolute', left: X0, top: 528, width: TXT.length * CW - 12, height: 6, borderRadius: 3, background: C.purple, opacity: 0.8 * ruler}} />
      {TXT.split('').map((_, i) => (
        <div key={i} dir="ltr" style={{position: 'absolute', left: X0 + i * CW, top: 540, width: 100, textAlign: 'center', fontFamily: MONO, fontSize: 32, fontWeight: 700, color: C.purple, opacity: i < count ? 1 : 0}}>
          {i + 1}
        </div>
      ))}

      {/* validation cards */}
      {PHONES.map((p, i) => {
        const pp = clamp(pop(f, t(34.2 + i * 0.7)));
        const ok = p.v.length === 11;
        const col = ok ? C.green : C.red;
        return (
          <div key={p.v} dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 80 + i * 600, top: 680, width: 560, height: 210, borderRadius: 22, border: `3px solid ${col}`, background: `${col}14`, opacity: pp, transform: `translateY(${(1 - pp) * 30}px)`, padding: '20px 28px', fontFamily: MONO, boxShadow: `0 0 ${ok ? 30 : 18}px ${col}44`}}>
            <div style={{fontSize: 38, fontWeight: 700, color: C.text}}>{p.v}</div>
            <div style={{fontSize: 28, color: C.muted, marginTop: 8}}>LENGTH = <span style={{color: col, fontWeight: 700}}>{p.v.length}</span></div>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, fontSize: 30, fontWeight: 700, color: col}}>
              {ok ? <Check p={pp} size={44} /> : <span style={{fontSize: 40}}>✗</span>}
              {ok ? 'valid · 11 digits' : p.note}
            </div>
          </div>
        );
      })}
      <Caption text="LENGTH(phone) ──► Counts Character Bytes & Validates Data Integrity" from={sec(22)} to={sec(40)} />
    </Stage>
  );
};
