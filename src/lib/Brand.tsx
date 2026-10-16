import React from 'react';
import {useCurrentFrame} from 'remotion';
import {BRAND, C, CENTER, T} from '../theme';
import {GROTESK, MONO, ORB} from '../fonts';
import {clamp, easeInOut, easeOut, ramp, sp, SP} from './anim';
import {LOGO_BRAND, LOGO_CENTER, LogoMark} from './Logo';
import {IconCap, IconGlobe, IconPhone, glass} from './ui';

/** Native cyber brand card: converges, liquid-settles the logo, then collapses into the first-frame light point. */
export const Brand: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.s5) return null;
  const g = f - T.s5;
  const build = sp(f, SP.bouncy, T.s5 + 4);
  const col = easeInOut(ramp(f, T.collapse, 1046));
  const scale = Math.max(0.0001, (0.55 + 0.45 * Math.min(1.06, build)) * (1 - col * 0.999));
  const out = 1 - ramp(f, T.collapse + 6, 1040);
  const liquid = 34 * (1 - ramp(f, T.s5 + 10, T.s5 + 56));
  const shine = ramp(f, T.s5 + 44, T.s5 + 84);
  const row = (d: number, icon: React.ReactNode, text: string, c: string, y: number) => {
    const s = sp(f, SP.bouncy, T.s5 + d);
    return (
      <div key={text} style={{position: 'absolute', left: 50, right: 50, top: y, height: 76, ...glass({r: 38, glow: 22}), borderColor: c, display: 'flex', alignItems: 'center', gap: 18,
        padding: '0 28px', direction: 'ltr', opacity: clamp(s * 3), transform: `translateX(${(1 - Math.min(1, s)) * 120}px)`}}>
        {icon}
        <div style={{fontFamily: MONO, fontSize: 33, color: '#fff', letterSpacing: 1}}>{text}</div>
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: CENTER.x - 450, top: CENTER.y - 400, width: 900, height: 800, opacity: out,
      transform: `scale(${scale})`, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', inset: 0, ...glass({r: 46, glow: 60, tint: 'rgba(0,240,255,0.18)'}), borderColor: C.cyan, backdropFilter: 'blur(14px)'}} />
      {/* sweeping scan highlight */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 46, overflow: 'hidden', pointerEvents: 'none'}}>
        <div style={{position: 'absolute', top: -40, bottom: -40, left: `${-30 + shine * 160}%`, width: 120, transform: 'skewX(-20deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)'}} />
      </div>
      <svg width={900} height={800} viewBox="0 0 900 800" style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency={0.012 + 0.004 * Math.sin(f / 9)} numOctaves={2} seed={3} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={liquid} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g transform={`translate(450 175) scale(1.05) translate(${-LOGO_CENTER.x} ${-LOGO_CENTER.y})`} filter={liquid > 0.5 ? 'url(#liquid)' : undefined}
          style={{filter: liquid > 0.5 ? undefined : 'drop-shadow(0 0 14px rgba(0,240,255,.6))'}}>
          <LogoMark f={Math.max(0, g - 6)} colors={LOGO_BRAND} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 322, textAlign: 'center', fontFamily: ORB, fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: 5,
        textShadow: '0 0 24px rgba(0,240,255,.8)', opacity: easeOut(ramp(f, T.s5 + 26, T.s5 + 44)), transform: `scale(${1 + 0.1 * (1 - easeOut(ramp(f, T.s5 + 26, T.s5 + 48)))})`}}>
        {BRAND.name}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 408, textAlign: 'center', fontFamily: GROTESK, fontWeight: 500, fontSize: 30, color: C.gold, letterSpacing: 3,
        opacity: easeOut(ramp(f, T.s5 + 36, T.s5 + 52))}}>{BRAND.sub}</div>
      {row(46, <IconCap s={44} />, BRAND.solutions, C.gold, 478)}
      {row(54, <IconGlobe s={44} />, BRAND.analytics, C.cyan, 568)}
      {row(62, <IconPhone s={44} />, BRAND.whatsapp, C.green, 658)}
    </div>
  );
};
