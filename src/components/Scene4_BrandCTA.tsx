import React from 'react';
import {BRAND, C, SCENES} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, ramp} from '../lib/anim';
import {SPRINGS, sp} from '../utils/springConfigs';
import {IconFb, IconIg, IconPhone, IconTt, IconYt, SceneShell} from '../lib/ui';
import {LogoMark} from '../lib/Logo';
import {Paper} from './Paper';

const T0 = SCENES.s4.from;
const TAU = Math.PI * 2;
const LOGO = {main: C.carbon, bars: C.emerald, chart: C.yellow, bg: C.cream};

/** Frames 396-600: the cream seal locks into a steel ring; WhatsApp + handle are shown VISUALLY (never spoken); the CTA pulses. */
export const Scene4_BrandCTA: React.FC<{f: number}> = ({f}) => {
  const t = f - T0;
  const lock = sp(f, SPRINGS.snap, T0);
  const wa = sp(f, SPRINGS.main, T0 + 10);
  const hd = sp(f, SPRINGS.main, 426);
  const cta = sp(f, SPRINGS.snap, 474);
  const pulse = 0.5 + 0.5 * Math.sin((f - 474) * 0.3);
  const ringRot = (1 - Math.min(1, lock)) * -140;
  return (
    <SceneShell dur={SCENES.s4.dur} fadeIn={12} fadeOut={0}>
      {/* seal */}
      <div style={{position: 'absolute', left: 540 - 270, top: 190, width: 540, height: 540, opacity: clamp(lock * 3), transform: `scale(${1.35 - 0.35 * Math.min(1.06, lock)})`}}>
        {/* steel locking ring */}
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 20deg, #6B6F76, #D5D8DC, #8C9097, #E8EAED, #6B6F76, #BFC3C8, #7C8087, #D5D8DC, #6B6F76)', transform: `rotate(${ringRot}deg)`,
          boxShadow: '0 30px 50px rgba(0,0,0,0.55), inset 0 0 0 3px rgba(255,255,255,0.35)'}}>
          {Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * TAU;
            return <div key={i} style={{position: 'absolute', left: 270 + Math.cos(a) * 246 - 9, top: 270 + Math.sin(a) * 246 - 9, width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #F1F2F4, #6B6F76)', boxShadow: '0 1px 2px rgba(0,0,0,.5)'}} />;
          })}
        </div>
        {/* cream letterpress disc */}
        <div style={{position: 'absolute', left: 36, top: 36, width: 468, height: 468, borderRadius: '50%', background: `radial-gradient(circle at 35% 25%, #FBF9F4, ${C.cream} 55%, #E4DFD2)`, boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.25), inset 0 -4px 10px rgba(255,255,255,0.6)'}}>
          <svg width={468} height={468} viewBox="0 0 468 468" style={{position: 'absolute', left: 0, top: 0}}>
            <circle cx={234} cy={234} r={212} fill="none" stroke={C.carbon} strokeWidth={2.5} opacity={0.75} />
            <circle cx={234} cy={234} r={196} fill="none" stroke={C.carbon} strokeWidth={1.2} opacity={0.5} strokeDasharray="2 7" />
            <circle cx={234} cy={234} r={150} fill="none" stroke={C.emerald} strokeWidth={2} opacity={0.8} />
            <g transform="translate(234 222) scale(1.0) translate(-180 -138)"><LogoMark f={Math.max(0, t - 6)} colors={LOGO} pulse={false} /></g>
          </svg>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 750, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 84, color: C.cream, opacity: clamp(lock * 3), transform: `translateY(${(1 - Math.min(1, lock)) * 40}px)`}}>{BRAND.name}</div>

      {/* WhatsApp badge: digits are visual only */}
      {f >= T0 + 10 ? (
        <div style={{position: 'absolute', left: 90, top: 900, width: 900, opacity: clamp(wa * 3), transform: `translateY(${(1 - Math.min(1, wa)) * 80}px) rotate(${(1 - Math.min(1, wa)) * -3}deg)`}}>
          <Paper r={26} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 34px', direction: 'ltr'}}>
            <div style={{width: 104, height: 104, borderRadius: '50%', background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IconPhone s={62} c={C.cream} /></div>
            <div style={{fontFamily: CAIRO, color: C.carbon, lineHeight: 1.05}}>
              <div style={{fontWeight: 700, fontSize: 32, direction: 'rtl', color: C.emerald}}>واتساب</div>
              <div style={{fontWeight: 900, fontSize: 84, letterSpacing: 1}}>{BRAND.waLocal}</div>
              <div style={{fontWeight: 700, fontSize: 40, opacity: 0.75}}>{BRAND.waIntl}</div>
            </div>
          </Paper>
        </div>
      ) : null}

      {/* social handle */}
      {f >= 426 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1170, textAlign: 'center', opacity: clamp(hd * 3), transform: `translateY(${(1 - Math.min(1, hd)) * 60}px)`}}>
          <Paper r={60} style={{display: 'inline-flex', alignItems: 'center', gap: 20, padding: '16px 42px', direction: 'ltr'}}>
            <IconFb s={54} /><IconIg s={54} /><IconTt s={54} c={C.carbon} /><IconYt s={54} />
            <div style={{fontFamily: CAIRO, fontWeight: 900, fontSize: 50, color: C.carbon, marginLeft: 8}}>{BRAND.handle}</div>
          </Paper>
        </div>
      ) : null}

      {/* pulsing warm-yellow CTA */}
      {f >= 474 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1350, textAlign: 'center', opacity: clamp(cta * 3), transform: `scale(${Math.max(0, cta) * (1 + 0.04 * pulse)})`}}>
          <div style={{display: 'inline-block', padding: '26px 66px', borderRadius: 28, background: C.yellow, color: C.carbon, fontFamily: CAIRO, fontWeight: 900, fontSize: 60, direction: 'rtl',
            boxShadow: `0 ${10 + 6 * pulse}px 0 #A16207, 0 ${26 + 12 * pulse}px 34px rgba(0,0,0,0.5)`}}>
            اكتب "مهتم" في التعليقات
          </div>
        </div>
      ) : null}
    </SceneShell>
  );
};
