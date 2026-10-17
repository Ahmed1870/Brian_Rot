import React from 'react';
import {CAIRO} from '../fonts';
import {C, STARTS} from '../theme';
import {clamp, easeOut, ramp, sp, SP} from '../lib/anim';
import {IconCheck, IconFb} from '../lib/ui';
import {GlassBadge} from './GlassBadge';

const T0 = STARTS[1];
const LESSONS = ['الجداول والمقاييس', 'قراءة الأرقام صح', 'أول تقرير تعمله'];

const cardBase = (open: number, origin: string, hot: number, accent: string): React.CSSProperties => ({
  position: 'absolute', top: 300, width: 470, height: 1320, borderRadius: 48, overflow: 'hidden',
  background: 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))',
  border: `3px solid ${hot > 0.5 ? accent : 'rgba(255,255,255,0.28)'}`,
  boxShadow: hot > 0.5 ? `0 0 60px ${accent}66, inset 0 0 60px ${accent}14` : 'inset 0 1px 0 rgba(255,255,255,0.3)',
  transformOrigin: origin, transform: `scaleX(${Math.max(0.0001, open)})`, opacity: clamp(open * 4),
});

/** Frames 240-540: the screen splits into two parallel learning cards. */
export const SplitScreen: React.FC<{f: number}> = ({f}) => {
  const t = f - T0;
  const open = sp(f, SP.bouncy, T0);
  const hotL = ramp(t, 6, 14) * (1 - ramp(t, 104, 112));   // "على الفيس"
  const hotR = ramp(t, 112, 120) * (1 - ramp(t, 250, 258)); // "كورس الـ SQL على موقعنا"
  const winIn = easeOut(ramp(t, 40, 80));
  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: easeOut(ramp(t, 0, 14))}}>
        <GlassBadge title="Monzoma Digital" accent={C.cyan} titleSize={40} f={f} />
      </div>
      {/* split seam */}
      <div style={{position: 'absolute', left: 539, top: 300 + 660 * (1 - Math.min(1, open)), width: 2, height: 1320 * Math.min(1, open), background: C.white, opacity: 0.8}} />

      {/* LEFT: Facebook basics */}
      <div style={{...cardBase(open, '100% 50%', hotL, C.cyan), left: 50}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center'}}><IconFb s={170} /></div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 290, textAlign: 'center'}}>
          <GlassBadge title="أساسيات التحليل" sub="على صفحتنا في فيسبوك" accent={C.cyan} titleSize={46} subSize={28} f={f} radius={44} />
        </div>
        {LESSONS.map((l, i) => {
          const a = easeOut(ramp(t, 30 + i * 10, 46 + i * 10));
          return (
            <div key={i} style={{position: 'absolute', left: 36, right: 36, top: 560 + i * 130, height: 100, borderRadius: 28, background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', direction: 'rtl',
              opacity: a, transform: `translateX(${(1 - a) * -80}px)`}}>
              <IconCheck s={44} c={C.cyan} />
              <div style={{fontFamily: CAIRO, fontWeight: 800, fontSize: 36, color: C.white}}>{l}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 36, right: 36, bottom: 70, textAlign: 'center'}}>
          <div style={{display: 'inline-block', padding: '12px 36px', borderRadius: 999, background: C.yellow, fontFamily: CAIRO, fontWeight: 900, fontSize: 36, color: C.bg}}>مجاناً ويومياً</div>
        </div>
      </div>

      {/* RIGHT: free SQL course + portal window */}
      <div style={{...cardBase(open, '0% 50%', hotR, C.yellow), left: 560}}>
        <div style={{position: 'absolute', left: 16, right: 16, top: 70, textAlign: 'center'}}>
          <GlassBadge title="منصة التعليم المجاني" sub="solutions.gomaaintelligence.me" subLtr accent={C.yellow} titleSize={42} subSize={23} f={f} radius={44} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 96, color: C.white, lineHeight: 1.1, direction: 'rtl'}}>
          كورس <span style={{color: C.cyan}}>SQL</span>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center'}}>
          <div style={{display: 'inline-block', padding: '8px 34px', borderRadius: 999, background: C.yellow, fontFamily: CAIRO, fontWeight: 900, fontSize: 40, color: C.bg}}>مجاني</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', fontFamily: CAIRO, fontWeight: 800, fontSize: 34, color: C.dim, direction: 'rtl', opacity: winIn}}>
          طبّق عملياً على بيانات حقيقية
        </div>
      </div>
      {/* portal window frame (child layer is composited exactly into x 615..975, y 760..1400) */}
      <div style={{position: 'absolute', left: 607, top: 752, width: 376, height: 656, border: `5px solid ${C.yellow}`, borderRadius: 4, opacity: winIn,
        boxShadow: `0 0 ${30 + 20 * hotR}px ${C.yellow}88`}} />
      <div style={{position: 'absolute', left: 607, top: 1420, width: 376, textAlign: 'center', fontFamily: CAIRO, fontWeight: 800, fontSize: 28, color: C.yellow, direction: 'rtl', opacity: winIn}}>
        معاينة: لوحة القرار
      </div>
    </div>
  );
};
