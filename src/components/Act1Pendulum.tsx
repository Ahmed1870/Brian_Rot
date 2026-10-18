import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {clamp, easeOut, hash, ramp} from '../lib/anim';
import {act1Prims} from '../lib/world';
import {Prims} from '../lib/Prims';
import {EditorialText} from './EditorialText';

const TAU = Math.PI * 2;

/** Act I (0-150): concrete pendulum swings right, its shadow swings LEFT and cracks the frosted glass (frame 90).
 *  Frames 148-190: the camera dives through the crack (zoom + shard burst + emerald light leak). */
export const Act1Pendulum: React.FC<{f: number; text?: boolean}> = ({f, text = true}) => {
  const {prims, impactScreen} = act1Prims(f);
  const [ix, iy] = impactScreen;
  const dive = ramp(f, 148, 188);
  const z = Math.exp(Math.log(9) * dive * dive);
  const out = f >= 168 ? 1 - ramp(f, 168, 190) : 1;
  const flash = f >= 90 ? Math.max(0, 1 - (f - 90) / 7) * 0.28 : 0;
  const shards = f >= 140 ? Array.from({length: 26}, (_, i) => {
    const a = hash(i * 1.9) * TAU;
    const r0 = 18 + hash(i * 2.7) * 120;
    const t = ramp(f, 140 + hash(i) * 8, 188);
    const d = r0 + 700 * easeOut(t) * (0.4 + hash(i * 3.3));
    const cx = ix + Math.cos(a) * d, cy = iy + Math.sin(a) * d;
    const s = 16 + hash(i * 4.4) * 60;
    const rot = a + t * 3 * (hash(i * 5.5) - 0.5);
    const pts = [0, 1, 2].map((k) => `${(cx + Math.cos(rot + k * 2.2) * s * (1 + t * 2)).toFixed(1)},${(cy + Math.sin(rot + k * 2.2) * s * (1 + t * 2)).toFixed(1)}`).join(' ');
    return <polygon key={i} points={pts} fill="rgba(243,244,246,0.10)" stroke="rgba(250,250,250,0.75)" strokeWidth={2} opacity={1 - ramp(t, 0.5, 1)} />;
  }) : null;
  const leak = ramp(f, 118, 176);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="a1spot" cx="82%" cy="14%" r="70%">
            <stop offset="0" stopColor="#F3F4F6" stopOpacity="0.16" /><stop offset="1" stopColor="#F3F4F6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="a1leak" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#FAFAFA" stopOpacity="0.95" /><stop offset="0.35" stopColor="#10B981" stopOpacity="0.6" /><stop offset="1" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <filter id="a1soft"><feGaussianBlur stdDeviation="0.6" /></filter>
        </defs>
        <rect width={1080} height={1920} fill={C.bg} />
        <g transform={`translate(${ix} ${iy}) scale(${z}) translate(${-ix} ${-iy})`}>
          <Prims prims={prims} />
          <rect width={1080} height={1920} fill="url(#a1spot)" />
          {leak > 0 ? <circle cx={ix} cy={iy} r={40 + 520 * leak * leak} fill="url(#a1leak)" opacity={0.85 * leak} /> : null}
          {shards}
        </g>
        <rect width={1080} height={1920} fill="#FAFAFA" opacity={flash} />
        <rect width={1080} height={1920} fill="url(#a1vig)" />
        <defs>
          <radialGradient id="a1vig" cx="50%" cy="48%" r="75%">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
        </defs>
      </svg>
      {text ? (
        <EditorialText f={f} y={1480} size={116} lead={1.12}
          kicker={{text: 'THE MUSEUM OF FUTURES THAT NEVER HAPPENED', from: 6, to: 128}}
          lines={[{words: [{t: 'متحف'}, {t: 'المستقبل'}], from: 4, to: 132}, {words: [{t: 'الذي'}, {t: 'لم'}, {t: 'يحدث', c: C.concrete}], from: 22, to: 132}]} />
      ) : null}
    </AbsoluteFill>
  );
};
