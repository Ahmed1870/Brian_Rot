import React from 'react';
import {C, SCENES} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, lerp, ramp} from '../lib/anim';
import {SPRINGS, sp} from '../utils/springConfigs';
import {SceneShell} from '../lib/ui';
import {Paper} from './Paper';

const T0 = SCENES.s2.from;
const TABS = ['ميزانية', 'تسعير', 'فواتير', 'مذاكرة'];

/** Frames 132-270: matte acrylic shelf slides in, its doors snap open, an emerald "100% مجاناً" stamp pops out. */
export const Scene2_ValueBurst: React.FC<{f: number}> = ({f}) => {
  const slide = sp(f, SPRINGS.main, T0);
  const open = easeOut(ramp(f, T0 + 18, T0 + 34));
  const seal = sp(f, SPRINGS.snap, T0 + 26);
  const exit = easeOut(ramp(f, 252, 270));
  const count = Math.round(100 * easeOut(ramp(f, T0 + 30, T0 + 62)));
  const head = sp(f, SPRINGS.text, T0 + 8);
  const wob = Math.sin((f - T0) / 7) * 1.2 * seal;
  const door = (side: 1 | -1) => ({
    position: 'absolute' as const, top: 0, bottom: 0, width: '50%', [side === 1 ? 'right' : 'left']: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.20), rgba(255,255,255,0.07))', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    border: '2px solid rgba(255,255,255,0.35)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)', transform: `translateX(${side * open * 470}px)`, borderRadius: 18,
  });
  return (
    <SceneShell dur={SCENES.s2.dur} fadeIn={10} fadeOut={12}>
      {/* headline */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 190, direction: 'rtl', fontFamily: CAIRO, color: C.cream, opacity: clamp(head * 3), transform: `translateY(${(1 - Math.min(1, head)) * 50 - exit * 400}px)`}}>
        <div style={{fontWeight: 900, fontSize: 124, lineHeight: 1.1}}>قسم كامل</div>
        <div style={{fontWeight: 900, fontSize: 84, lineHeight: 1.2}}>شيتات وقوالب <span style={{direction: 'ltr', color: C.yellow}}>Excel</span></div>
        <div style={{height: 8, width: `${easeOut(ramp(f, T0 + 14, T0 + 40)) * 100}%`, background: C.emerald, marginTop: 14}} />
      </div>

      {/* acrylic shelf */}
      <div style={{position: 'absolute', left: 90, top: 640, width: 900, height: 760, transform: `translateX(${(1 - Math.min(1.05, slide)) * 1100 + exit * 1100}px)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: '#1B1C20', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 40px 70px rgba(0,0,0,0.55)'}} />
        {/* paper templates standing in the shelf */}
        {TABS.map((t, i) => {
          const rise = easeOut(ramp(f, T0 + 24 + i * 5, T0 + 40 + i * 5));
          return (
            <Paper key={i} r={10} style={{position: 'absolute', left: 60 + i * 205, bottom: 70, width: 190, height: 520, transform: `translateY(${(1 - rise) * 120}px) rotate(${(i - 1.5) * 2.2}deg)`, transformOrigin: '50% 100%', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 78, background: C.emerald, color: C.cream, fontFamily: CAIRO, fontWeight: 900, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl'}}>{t}</div>
              {Array.from({length: 6}, (_, r) => <div key={r} style={{position: 'absolute', left: 16, right: 16, top: 110 + r * 62, height: 36, borderRadius: 4, background: r % 2 ? 'rgba(13,148,136,0.18)' : 'rgba(24,24,27,0.10)'}} />)}
            </Paper>
          );
        })}
        {/* acrylic front lip */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, borderRadius: '0 0 22px 22px', background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderTop: '2px solid rgba(255,255,255,0.45)', borderBottom: '2px solid rgba(255,255,255,0.2)'}} />
        {/* sliding doors */}
        <div style={door(1)} /><div style={door(-1)} />
        {/* emerald stamp */}
        {f >= T0 + 24 ? (
          <div style={{position: 'absolute', left: 450 - 170, top: 340 - 170 - Math.min(1, seal) * 300, width: 340, height: 340, borderRadius: '50%', background: C.emerald, color: C.cream, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', fontFamily: CAIRO, boxShadow: '0 26px 40px rgba(0,0,0,0.5), inset 0 0 0 10px rgba(244,241,234,0.9), inset 0 0 0 16px #0D9488', transform: `scale(${0.4 + 0.6 * Math.min(1.1, seal)}) rotate(${-8 + wob}deg)`, opacity: clamp(seal * 3)}}>
            <div style={{fontWeight: 900, fontSize: 112, lineHeight: 1, direction: 'ltr'}}>{count}%</div>
            <div style={{fontWeight: 900, fontSize: 64, lineHeight: 1.1}}>مجاناً</div>
          </div>
        ) : null}
      </div>
    </SceneShell>
  );
};
