import React from 'react';
import {BRAND, C, SCENES} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, ramp, sp, SP} from '../lib/anim';
import {IconFb, IconIg, IconPhone, IconTt, IconYt, Ring, SceneShell, glass} from '../lib/ui';
import {LogoMark} from '../lib/Logo';
import {GlassBadge} from './GlassBadge';

const T0 = SCENES.s5.from;
const TAU = Math.PI * 2;
const LOGO = {main: C.text, bars: C.emerald, chart: C.yellow, bg: C.bg};

/** Frames 1476-1800: the Monzoma Digital seal, official WhatsApp, handle, pulsing yellow CTA. */
export const Scene5_BrandContactCTA: React.FC<{f: number}> = ({f}) => {
  const t = f - T0;
  const seal = sp(f, SP.heavy, T0 + 2);
  const wa = sp(f, SP.pop, 1482);
  const hd = sp(f, SP.pop, 1574);
  const cta = sp(f, SP.pop, 1642);
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.28);
  const ring = f > 1642 ? ((f - 1642) % 26) / 26 : 1;
  return (
    <SceneShell dur={SCENES.s5.dur} fadeIn={12} fadeOut={0}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs><path id="s5ring" d="M -236 0 A 236 236 0 1 1 236 0 A 236 236 0 1 1 -236 0" /></defs>
        <g transform={`translate(540 480) scale(${0.5 + 0.5 * Math.min(1.08, seal)})`} opacity={clamp(seal * 3)}>
          <circle r={272} fill="none" stroke="rgba(248,250,252,0.35)" strokeWidth={2} strokeDasharray="3 13" transform={`rotate(${t * 0.3})`} />
          <circle r={256} fill="none" stroke={C.text} strokeWidth={3} />
          <circle r={206} fill="rgba(248,250,252,0.06)" stroke="rgba(248,250,252,0.4)" strokeWidth={2} />
          <circle r={186} fill="none" stroke={C.emerald} strokeWidth={2} opacity={0.5 + 0.3 * pulse} />
          {Array.from({length: 60}, (_, i) => {
            const a = (i / 60) * TAU;
            return <line key={i} x1={Math.cos(a) * 262} y1={Math.sin(a) * 262} x2={Math.cos(a) * (i % 5 ? 272 : 288)} y2={Math.sin(a) * (i % 5 ? 272 : 288)} stroke={C.text} strokeWidth={i % 5 ? 1.5 : 3} opacity={0.5} />;
          })}
          <g transform={`rotate(${t * 0.5})`}>
            <text fontFamily={CAIRO} fontWeight={900} fontSize={24} fill={C.text} letterSpacing={6} opacity={0.85}>
              <textPath href="#s5ring" textLength={1470} lengthAdjust="spacing">MONZOMA DIGITAL · DATA ANALYTICS · MONZOMA DIGITAL · DATA ANALYTICS ·</textPath>
            </text>
          </g>
          <g transform="translate(0 0) scale(1.05) translate(-180 -138)"><LogoMark f={Math.max(0, t - 10)} colors={LOGO} pulse={false} /></g>
        </g>
        <Ring f={f} start={T0 + 2} x={540} y={480} max={620} life={30} color={C.yellow} w={7} />
        {f >= 1642 && ring < 1 ? <rect x={540 - 380 - ring * 130} y={1396 - 75 - ring * 55} width={760 + ring * 260} height={150 + ring * 110} rx={90} fill="none" stroke={C.yellow} strokeWidth={4} opacity={(1 - ring) * 0.8} /> : null}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 86, color: C.text, opacity: clamp(seal * 3), transform: `translateY(${(1 - Math.min(1, seal)) * 40}px)`}}>
        {BRAND.name}
      </div>
      {f >= 1482 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center', opacity: clamp(wa * 3), transform: `scale(${0.7 + 0.3 * Math.min(1.08, wa)})`}}>
          <GlassBadge title={BRAND.phoneIntl} sub={`واتساب · ${BRAND.phoneLocal}`} accent="#22C55E" titleSize={64} subSize={34} f={f} radius={50} icon={<IconPhone s={72} />} style={{direction: 'ltr'}} />
        </div>
      ) : null}
      {f >= 1574 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1160, textAlign: 'center', opacity: clamp(hd * 3), transform: `scale(${0.7 + 0.3 * Math.min(1.08, hd)})`}}>
          <div style={{...glass({r: 60, glow: 24}), display: 'inline-flex', alignItems: 'center', gap: 18, padding: '16px 40px', direction: 'ltr', borderColor: 'rgba(248,250,252,0.5)'}}>
            <IconFb s={52} /><IconIg s={52} /><IconTt s={52} c={C.text} /><IconYt s={52} />
            <div style={{fontFamily: CAIRO, fontWeight: 900, fontSize: 46, color: C.text, marginLeft: 6}}>{BRAND.handle}</div>
          </div>
        </div>
      ) : null}
      {f >= 1642 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', opacity: clamp(cta * 3), transform: `scale(${Math.max(0, cta) * (1 + 0.045 * pulse)})`}}>
          <div style={{display: 'inline-block', padding: '26px 64px', borderRadius: 999, background: C.yellow, fontFamily: CAIRO, fontWeight: 900, fontSize: 58, color: C.bg, direction: 'rtl',
            boxShadow: `0 0 ${30 + 50 * pulse}px ${C.yellow}, 0 0 ${80 * pulse}px ${C.yellow}88`}}>
            اكتب "مهتم" في التعليقات
          </div>
        </div>
      ) : null}
    </SceneShell>
  );
};
