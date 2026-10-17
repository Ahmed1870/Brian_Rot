import React from 'react';
import {CAIRO} from '../fonts';
import {C, STARTS} from '../theme';
import {clamp, easeOut, ramp, sp, SP} from '../lib/anim';
import {IconFb, IconIg, IconTt, IconYt} from '../lib/ui';
import {LogoMark} from '../lib/Logo';
import {GlassBadge} from './GlassBadge';

const T0 = STARTS[3];
const TAU = Math.PI * 2;
const MONO_LOGO = {main: C.white, bars: C.cyan, chart: C.yellow, bg: C.bg};

/** Frames 780-1050: locked holographic seal, social handle, pulsing CTA. */
export const SealScene: React.FC<{f: number}> = ({f}) => {
  const t = f - T0;
  const lock = sp(f, {stiffness: 220, damping: 11, mass: 0.7}, T0);
  const rot = t * 0.35;
  const handle = sp(f, SP.bouncy, T0 + 18);
  const cta = sp(f, SP.pop, T0 + 52); // "واكتب كلمة مهتم" ~ 27.7s
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.26);
  const ring = (t > 52 ? ((t - 52) % 24) / 24 : 1);
  const flash = Math.max(0, 1 - (f - T0) / 9);
  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 6px)'}} />
      {/* seal */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <path id="sealText" d="M540 380 A310 310 0 1 1 539.9 380" />
        </defs>
        <g transform={`translate(540 700) scale(${0.55 + 0.45 * Math.min(1.08, lock)}) rotate(${(1 - Math.min(1, lock)) * -120})`} opacity={clamp(lock * 3)}>
          <circle r={352} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2} strokeDasharray="3 12" transform={`rotate(${rot})`} />
          <circle r={262} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.8} />
          <circle r={236} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
          {Array.from({length: 72}, (_, i) => {
            const a = (i / 72) * TAU;
            return <line key={i} x1={Math.cos(a) * 262} y1={Math.sin(a) * 262} x2={Math.cos(a) * (i % 6 ? 276 : 292)} y2={Math.sin(a) * (i % 6 ? 276 : 292)} stroke="#fff" strokeWidth={i % 6 ? 2 : 4} opacity={0.55} />;
          })}
        </g>
        <g transform={`translate(540 700) rotate(${rot * 0.8}) translate(-540 -700)`} opacity={clamp(lock * 3)}>
          <text fontFamily={CAIRO} fontWeight={800} fontSize={34} fill="#fff" letterSpacing={6} transform="translate(0 320)">
            <textPath href="#sealText" startOffset="0">MONZOMA DIGITAL • DATA INTELLIGENCE • ANALYTICS • </textPath>
          </text>
        </g>
        <g transform={`translate(540 700) scale(${1.5 * (0.6 + 0.4 * Math.min(1.1, lock))}) translate(-180 -138)`} opacity={clamp(lock * 3)}>
          <LogoMark f={Math.max(0, f - T0 - 6)} colors={MONO_LOGO} pulse={false} />
        </g>
        <rect width={1080} height={1920} fill="#fff" opacity={flash * 0.5} />
      </svg>

      <div style={{position: 'absolute', left: 0, right: 0, top: 1100, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 92, color: C.white,
        opacity: clamp(lock * 3), transform: `translateY(${(1 - Math.min(1, lock)) * 60}px)`}}>
        Monzoma Digital
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1215, textAlign: 'center', fontFamily: CAIRO, fontWeight: 800, fontSize: 36, color: C.cyan, direction: 'rtl', opacity: clamp(lock * 3)}}>
        حلول وتحليل البيانات
      </div>

      {/* handle across 4 platforms */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: clamp(handle * 3), transform: `scale(${0.8 + 0.2 * Math.min(1.1, handle)})`}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, padding: '16px 40px', borderRadius: 999, direction: 'ltr', background: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
          backdropFilter: 'blur(14px)', border: '2px solid rgba(255,255,255,0.5)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)'}}>
          <IconFb s={52} /><IconIg s={52} /><IconTt s={52} /><IconYt s={52} />
          <div style={{fontFamily: CAIRO, fontWeight: 800, fontSize: 44, color: C.white, marginLeft: 8}}>@monzoma.digital</div>
        </div>
      </div>

      {/* pulsing CTA */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1480, textAlign: 'center', opacity: clamp(cta * 3), transform: `scale(${Math.max(0, cta) * (1 + 0.045 * pulse)})`}}>
        {t > 52 ? <div style={{position: 'absolute', left: '50%', top: '50%', width: 760 + ring * 260, height: 150 + ring * 110, marginLeft: -(380 + ring * 130), marginTop: -(75 + ring * 55),
          borderRadius: 999, border: `4px solid ${C.yellow}`, opacity: (1 - ring) * 0.8}} /> : null}
        <div style={{display: 'inline-block', padding: '26px 70px', borderRadius: 999, background: C.yellow, fontFamily: CAIRO, fontWeight: 900, fontSize: 58, color: C.bg, direction: 'rtl',
          boxShadow: `0 0 ${30 + 50 * pulse}px ${C.yellow}, 0 0 ${80 * pulse}px ${C.yellow}88`}}>
          اكتب "مهتم" في التعليقات
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1650, textAlign: 'center', fontFamily: CAIRO, fontWeight: 800, fontSize: 34, color: C.dim, direction: 'rtl',
        opacity: easeOut(ramp(t, 100, 124))}}>
        يوصلك رابط البداية فوراً
      </div>
    </div>
  );
};
