import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {hash} from './anim';

/** Persistent matrix space: perspective floor grid + drifting dust + deep radial. */
export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const H = 1000;
  const rows = Array.from({length: 16}, (_, k) => {
    const t = ((k + (f * 0.025) % 1) / 16);
    return H + (1920 - H) * Math.pow(t, 2.2);
  });
  const cols = Array.from({length: 17}, (_, i) => (i - 8) * 1.0);
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="46%" r="65%">
          <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.55" />
          <stop offset="55%" stopColor={C.bg} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.cyan} stopOpacity="0" />
          <stop offset="1" stopColor={C.cyan} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={C.bg} />
      <rect width={1080} height={1920} fill="url(#bgGlow)" />
      <g stroke="url(#floorFade)" strokeWidth={1.3} opacity={0.5}>
        {rows.map((y, i) => <line key={i} x1={0} y1={y} x2={1080} y2={y} />)}
        {cols.map((c, i) => <line key={i} x1={540} y1={H} x2={540 + c * 330} y2={1920} />)}
      </g>
      {Array.from({length: 70}, (_, i) => {
        const x = hash(i * 1.7) * 1080;
        const y = (((hash(i * 2.9) * 1920 - f * (0.25 + hash(i) * 0.9)) % 1920) + 1920) % 1920;
        return <circle key={i} cx={x} cy={y} r={0.8 + hash(i * 4.1) * 1.8} fill={i % 5 === 0 ? C.gold : C.cyan}
          opacity={0.15 + hash(i * 6.3) * 0.45} />;
      })}
    </svg>
  );
};
