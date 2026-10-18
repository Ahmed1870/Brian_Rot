import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND, C} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeInOut, easeOut, lerp, ramp} from '../lib/anim';
import {CAMF, dioramaPrims, modelPrims} from '../lib/world';
import {Prims} from '../lib/Prims';
import {LogoMark} from '../lib/Logo';
import {SPRINGS, sp} from '../utils/springConfigs';

const TAU = Math.PI * 2;
export const SEAL = {x: 540, y: 760};
/** Doorway in the seal core: a 216x384 (9:16) opening. The loop zoom plunges through it into Act I. */
export const DOOR = {w: 216, h: 384, q: 0.2};
const LOGO = {main: C.concrete, bars: C.emerald, chart: C.cream, bg: C.bg};

/** Act IV (510-720): the model condenses into the executive glass seal. Frames 676-720: plunge through the core. */
export const Act4BrandSeal: React.FC<{f: number}> = ({f}) => {
  const t = f - 510;
  const {prims} = dioramaPrims(510, false);
  const bgFade = 1 - ramp(t, 3, 40);
  const cond = easeInOut(ramp(t, 0, 28));
  const coreY = lerp(1133, SEAL.y - 192, cond);
  const lock = sp(f, SPRINGS.snap, 514);
  const pulse = 0.5 + 0.5 * Math.sin(t / 9);
  const rot = t * 0.22;
  const sealScale = (1 + 0.55 * (1 - Math.min(1.08, lock))) * (t >= 4 ? 1 : 0);
  const open = easeOut(ramp(t, 8, 44));
  const wm = 'Monzoma Digital'.split('');
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="a4fan" cx="50%" cy="100%" r="100%">
            <stop offset="0" stopColor="#FAFAFA" stopOpacity="0.95" /><stop offset="0.45" stopColor="#10B981" stopOpacity="0.7" /><stop offset="1" stopColor="#10B981" stopOpacity="0.15" />
          </radialGradient>
          <radialGradient id="a4glow" cx="50%" cy="40%" r="60%">
            <stop offset="0" stopColor="#10B981" stopOpacity="0.22" /><stop offset="1" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="a4vig" cx="50%" cy="46%" r="78%">
            <stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
          <path id="a4ring" d="M -338 0 A 338 338 0 1 1 338 0 A 338 338 0 1 1 -338 0" />
        </defs>
        <rect width={1080} height={1920} fill={C.bg} />
        <g opacity={bgFade}><Prims prims={prims} /></g>
        <rect width={1080} height={1920} fill="url(#a4glow)" opacity={open} />

        {/* the balanced model condenses into the seal's core light */}
        {t < 36 ? (
          <g opacity={1 - ramp(t, 20, 36)} transform={`translate(540 ${coreY}) scale(${1 - 0.96 * cond}) translate(-540 -1133)`}>
            <Prims prims={modelPrims(CAMF, 1, f)} />
          </g>
        ) : null}
        {t < 40 ? <circle cx={540} cy={coreY} r={(10 + 26 * cond) * (1 - ramp(t, 30, 40))} fill="#FAFAFA" opacity={0.9} /> : null}

        {/* the executive glass seal */}
        {sealScale > 0 ? (
          <g transform={`translate(${SEAL.x} ${SEAL.y}) scale(${sealScale})`} opacity={clamp(lock * 3)}>
            <circle r={392} fill="none" stroke="rgba(243,244,246,0.35)" strokeWidth={2} strokeDasharray="3 14" transform={`rotate(${rot})`} />
            <circle r={372} fill="none" stroke={C.concrete} strokeWidth={3} opacity={0.85} />
            <circle r={300} fill="rgba(243,244,246,0.055)" stroke="rgba(243,244,246,0.4)" strokeWidth={2} />
            <circle r={262} fill="none" stroke={C.emerald} strokeWidth={2} opacity={0.55 + 0.25 * pulse} />
            {Array.from({length: 72}, (_, i) => {
              const a = (i / 72) * TAU;
              return <line key={i} x1={Math.cos(a) * 304} y1={Math.sin(a) * 304} x2={Math.cos(a) * (i % 6 ? 318 : 332)} y2={Math.sin(a) * (i % 6 ? 318 : 332)} stroke={C.concrete} strokeWidth={i % 6 ? 1.5 : 3} opacity={0.5} />;
            })}
            <g transform={`rotate(${rot * 0.6})`} opacity={open}>
              <text fontFamily={CAIRO} fontWeight={800} fontSize={27} fill={C.cream} opacity={0.88} letterSpacing={7}>
                <textPath href="#a4ring" startOffset="0" textLength={2090} lengthAdjust="spacing">
                  MONZOMA DIGITAL · ANALYTICS · MONZOMA DIGITAL · ANALYTICS · MONZOMA DIGITAL · ANALYTICS ·
                </textPath>
              </text>
            </g>
            {/* arched doorway: fanlight + voussoir frame; the 216x384 opening is the portal */}
            <g opacity={open}>
              <path d={`M ${-DOOR.w / 2 - 22} ${DOOR.h / 2 + 8} V ${-DOOR.h / 2} A ${DOOR.w / 2 + 22} ${DOOR.w / 2 + 22} 0 0 1 ${DOOR.w / 2 + 22} ${-DOOR.h / 2} V ${DOOR.h / 2 + 8}`}
                fill="none" stroke={C.concrete} strokeWidth={6} strokeLinejoin="round" />
              <path d={`M ${-DOOR.w / 2} ${-DOOR.h / 2} A ${DOOR.w / 2} ${DOOR.w / 2} 0 0 1 ${DOOR.w / 2} ${-DOOR.h / 2} Z`} fill="url(#a4fan)" opacity={0.7 + 0.3 * pulse} stroke={C.concrete} strokeWidth={3} />
              {Array.from({length: 7}, (_, i) => {
                const a = Math.PI + ((i + 1) / 8) * Math.PI;
                return <line key={i} x1={0} y1={-DOOR.h / 2} x2={Math.cos(a) * DOOR.w / 2} y2={-DOOR.h / 2 + Math.sin(a) * DOOR.w / 2} stroke={C.concrete} strokeWidth={2} opacity={0.6} />;
              })}
              <rect x={-16} y={-DOOR.h / 2 - DOOR.w / 2 - 36} width={32} height={40} fill={C.concrete} />
              <rect x={-DOOR.w / 2 - 4} y={-DOOR.h / 2 - 4} width={DOOR.w + 8} height={DOOR.h + 8} fill="#05070C" stroke={C.concrete} strokeWidth={3} />
              <rect x={-150} y={DOOR.h / 2 + 8} width={300} height={22} fill={C.concrete} opacity={0.92} />
            </g>
          </g>
        ) : null}
        {t >= 4 && t < 26 ? <circle cx={SEAL.x} cy={SEAL.y} r={380 + 520 * easeOut(ramp(t, 4, 26))} fill="none" stroke={C.cream} strokeWidth={6 * (1 - ramp(t, 4, 26))} opacity={1 - ramp(t, 4, 26)} /> : null}

        {/* brand */}
        <g transform="translate(452 1111) scale(0.6)" opacity={ramp(t, 36, 44)}>
          <LogoMark f={Math.max(0, t - 36)} colors={LOGO} pulse={false} />
        </g>
        <rect width={1080} height={1920} fill="url(#a4vig)" />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1310, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 88, color: C.cream, display: 'flex', justifyContent: 'center'}}>
        {wm.map((ch, i) => {
          const s = sp(f, SPRINGS.text, 552 + i * 2);
          return <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: clamp(s * 3), transformOrigin: '50% 90%', textShadow: '0 4px 26px rgba(0,0,0,0.7)',
            transform: `translateY(${(1 - s) * 60}px) scale(${1 - (1 - s) * 0.25}, ${1 + (1 - s) * 0.6})`}}>{ch}</span>;
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1450, textAlign: 'center', opacity: easeOut(ramp(t, 66, 84)), transform: `translateY(${(1 - easeOut(ramp(t, 66, 84))) * 24}px)`}}>
        <div style={{display: 'inline-block', padding: '14px 46px', borderRadius: 999, border: '2px solid rgba(243,244,246,0.5)', background: 'rgba(243,244,246,0.06)', fontFamily: CAIRO, fontWeight: 800, fontSize: 34,
          color: C.emerald, direction: 'ltr', letterSpacing: 1.5, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)'}}>{BRAND.url}</div>
      </div>
    </AbsoluteFill>
  );
};
