import React from 'react';
import {staticFile} from 'remotion';
import {useT, ramp} from '../lib/anim';
import {AR, Rich} from '../lib/ui';
import {a} from '../sync';
import {COL, LESSON, FONT_AR, FONT_MONO} from '../theme';
import {Sfx} from '../lib/scene41';

const FN = [['VALUES', 12.7], ['DISTINCT', 13.4], ['SELECTEDVALUE', 14.0], ['HASONEVALUE', 14.7]] as const;
export const S1_SFX: Sfx[] = [...FN.map(([, t]): Sfx => ({t, n: 'pop'})), {t: a(1, 2), n: 'pop'}, {t: a(1, 3), n: 'pop'}, {t: a(1, 4), n: 'pop'}];

const Pill: React.FC<{t: string; o: number; bg?: string; size?: number; mono?: boolean}> = ({t, o, bg = '#fff', size = 40, mono}) => (
  <div style={{...AR, direction: mono ? 'ltr' : 'rtl', textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`, fontSize: size, fontFamily: mono ? FONT_MONO : FONT_AR, fontWeight: 600, padding: '12px 32px', borderRadius: 14, background: bg, border: `2px solid ${COL.line}`, color: COL.ink}}>{t}</div>
);

export const Scene1: React.FC = () => {
  const T = useT();
  return (
    <div style={{position: 'absolute', inset: 0, background: COL.bg, fontFamily: FONT_AR}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 14, background: COL.yellow}} />
      <img src={staticFile('logo.svg')} width={170} height={170} style={{position: 'absolute', left: 875, top: 60, opacity: ramp(T, 0.1, 0.6)}} />
      <div style={{...AR, textAlign: 'center', position: 'absolute', left: 0, width: 1920, top: 250, fontSize: 120, fontWeight: 700, color: COL.ink, opacity: ramp(T, 0.2, 0.6)}}>الدرس {LESSON.num}</div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 410, textAlign: 'center', fontSize: 66, fontWeight: 700, color: COL.ink, fontFamily: FONT_MONO, direction: 'ltr', opacity: ramp(T, 1.0, 0.6)}}>VALUES · DISTINCT</div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 500, textAlign: 'center', fontSize: 66, fontWeight: 700, color: COL.ink, fontFamily: FONT_MONO, direction: 'ltr', opacity: ramp(T, 1.0, 0.6)}}>SELECTEDVALUE · HASONEVALUE</div>
      <div style={{...AR, textAlign: 'center', position: 'absolute', left: 0, width: 1920, top: 610, fontSize: 38, color: COL.sub, opacity: ramp(T, 2.5, 0.6)}}><Rich t="الوحدة: أساسيات {{DAX}}" /></div>
      <div style={{position: 'absolute', left: 810, top: 675, width: 300, height: 8, background: COL.yellow, borderRadius: 4}} />
      <div style={{position: 'absolute', left: 0, width: 1920, top: 740, display: 'flex', justifyContent: 'center', gap: 24, direction: 'ltr'}}>
        {FN.map(([n, t]) => <Pill key={n} t={n} o={ramp(T, t, 0.4)} bg={COL.blueSoft} size={34} mono />)}
      </div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 860, display: 'flex', justifyContent: 'center', gap: 28, direction: 'rtl'}}>
        <Pill t="القيم الفريدة" o={ramp(T, a(1, 2), 0.4)} bg={COL.yellowSoft} />
        <Pill t="الاختيارات داخل التقرير" o={ramp(T, a(1, 3), 0.4)} bg={COL.yellowSoft} />
        <Pill t="معلومات ديناميكية" o={ramp(T, a(1, 4), 0.4)} bg={COL.yellowSoft} />
      </div>
    </div>
  );
};
