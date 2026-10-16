import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, DURATION} from '../theme';
import {hash} from './anim';

const TAU = Math.PI * 2;

/** Luxury dark space. Every motion is periodic in 450 frames => loops seamlessly. */
export const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / DURATION;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <radialGradient id="core" cx="50%" cy="45%" r="62%">
          <stop offset="0" stopColor="#14214F" stopOpacity="0.95" />
          <stop offset="0.55" stopColor={C.navy} stopOpacity="0.6" />
          <stop offset="1" stopColor={C.bg} stopOpacity="1" />
        </radialGradient>
        <radialGradient id="floor" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={C.gold} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill={C.bg} />
      <rect width={1080} height={1920} fill="url(#core)" />
      {[0, 1, 2].map((i) => {
        const x = ((f / 150 + i / 3) % 1);
        return <circle key={i} cx={540} cy={860} r={80 + x * 900} fill="none" stroke={i % 2 ? C.gold : C.cyan} strokeWidth={2.5 * (1 - x) + 0.4} opacity={(1 - x) * 0.28} />;
      })}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={540} cy={860} r={330 + i * 62 + Math.sin(TAU * 2 * t + i) * 12} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth={1.2} />
      ))}
      <ellipse cx={540} cy={1360} rx={380 + Math.sin(TAU * 3 * t) * 20} ry={60} fill="url(#floor)" />
      {Array.from({length: 90}, (_, i) => {
        const x = hash(i * 1.7) * 1080 + Math.sin(TAU * (1 + (i % 3)) * t + i) * 18;
        const y = hash(i * 2.9) * 1920 + Math.cos(TAU * (1 + (i % 2)) * t + i * 2) * 26;
        return <circle key={i} cx={x} cy={y} r={0.8 + hash(i * 4.1) * 1.8} fill={i % 4 === 0 ? C.gold : C.cyan}
          opacity={0.12 + 0.35 * (0.5 + 0.5 * Math.sin(TAU * 2 * t + i))} />;
      })}
    </svg>
  );
};
