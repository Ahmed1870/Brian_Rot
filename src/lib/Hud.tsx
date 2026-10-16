import React from 'react';
import {useCurrentFrame} from 'remotion';
import {BRAND, C, DURATION} from '../theme';
import {CAIRO, GROTESK} from '../fonts';
import {LogoMark} from './Logo';
import {IconCap, IconFb, IconGlobe, IconIg, IconPhone, IconTt, IconYt, glass} from './ui';

const TAU = Math.PI * 2;

const Side: React.FC<{x: number; rot: number; icon: React.ReactNode; text: string}> = ({x, rot, icon, text}) => (
  <div style={{position: 'absolute', left: x, top: 880, width: 640, height: 64, transform: `translate(-50%, -50%) rotate(${rot}deg)`,
    ...glass({r: 32, glow: 24}), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, direction: 'ltr'}}>
    {icon}
    <div style={{fontFamily: GROTESK, fontWeight: 700, fontSize: 29, color: '#fff', letterSpacing: 0.5}}>{text}</div>
  </div>
);

/** Permanent native-glass branding frame: logo, status, phone, socials, side URL badges. */
export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / DURATION;
  const pulse = 0.5 + 0.5 * Math.sin(TAU * 5 * t);
  return (
    <>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id="frameG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.cyan} /><stop offset="0.5" stopColor={C.gold} /><stop offset="1" stopColor={C.cyan} />
          </linearGradient>
        </defs>
        <rect x={22} y={22} width={1036} height={1876} rx={52} fill="none" stroke="url(#frameG)" strokeWidth={2.4} opacity={0.55 + 0.25 * pulse} />
        <rect x={36} y={36} width={1008} height={1848} rx={42} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />
        {[[22, 22, 1, 1], [1058, 22, -1, 1], [22, 1898, 1, -1], [1058, 1898, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M${x} ${y + sy * 90} V${y} H${x + sx * 90}`} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
        ))}
      </svg>

      {/* top HUD */}
      <div style={{position: 'absolute', left: 60, top: 64, width: 960, height: 150, ...glass({r: 44, glow: 36}), backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', gap: 22, padding: '0 34px', direction: 'ltr'}}>
        <svg width={118} height={106} viewBox="33 6 294 264"><LogoMark f={999} pulse={false} /></svg>
        <div style={{flex: 1}}>
          <div style={{fontFamily: GROTESK, fontWeight: 700, fontSize: 46, color: '#fff', letterSpacing: 2, lineHeight: 1.05}}>MONZOMA DIGITAL</div>
          <div style={{fontFamily: GROTESK, fontWeight: 500, fontSize: 24, color: C.gold, letterSpacing: 6, marginTop: 6}}>GOMAA INTELLIGENCE</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderRadius: 30, background: 'rgba(34,197,94,.14)', border: '1.5px solid rgba(34,197,94,.7)'}}>
          <div style={{width: 18, height: 18, borderRadius: '50%', background: '#22C55E', boxShadow: `0 0 ${10 + pulse * 18}px #22C55E`, opacity: 0.6 + pulse * 0.4}} />
          <div style={{fontFamily: CAIRO, fontWeight: 900, fontSize: 28, color: '#86EFAC', direction: 'rtl'}}>متاح الآن</div>
        </div>
      </div>

      {/* side badges */}
      <Side x={52} rot={-90} icon={<IconCap s={34} />} text={BRAND.solutions} />
      <Side x={1028} rot={90} icon={<IconGlobe s={34} />} text={BRAND.analytics} />

      {/* bottom HUD */}
      <div style={{position: 'absolute', left: 60, top: 1590, width: 960, height: 268, ...glass({r: 48, glow: 40}), backdropFilter: 'blur(10px)', direction: 'ltr'}}>
        <div style={{position: 'absolute', left: 40, right: 40, top: 28, display: 'flex', alignItems: 'center', gap: 22}}>
          <IconPhone s={62} />
          <div style={{fontFamily: GROTESK, fontWeight: 700, fontSize: 58, color: '#fff', letterSpacing: 2, flex: 1, textShadow: '0 0 22px rgba(0,240,255,.5)'}}>{BRAND.phone}</div>
          <div style={{fontFamily: CAIRO, fontWeight: 700, fontSize: 26, color: C.cyan, direction: 'rtl', textAlign: 'right', lineHeight: 1.2}}>واتساب<br />واتصال</div>
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 128, height: 2, background: `linear-gradient(90deg, ${C.cyan}, ${C.gold}, ${C.cyan})`, opacity: 0.5}} />
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 26, display: 'flex', alignItems: 'center', gap: 16}}>
          <IconFb s={44} /><IconIg s={44} /><IconTt s={44} /><IconYt s={44} />
          <div style={{flex: 1, textAlign: 'right', fontFamily: GROTESK, fontWeight: 700, fontSize: 30, color: '#fff', lineHeight: 1.25}}>
            <div>{BRAND.handleA}</div><div>{BRAND.handleB}</div>
          </div>
        </div>
      </div>
    </>
  );
};
