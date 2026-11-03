import React from 'react';
import {eo, hash} from '../lib/anim';

// Deterministic burst of square particles from a rectangle (used for dissolves / implosions)
export const Burst: React.FC<{x: number; y: number; w: number; h: number; p: number; n?: number; seed?: number; colors?: string[]; spread?: number; lift?: number; size?: number; inward?: {x: number; y: number}}> = ({x, y, w, h, p, n = 140, seed = 1, colors = ['#38BDF8', '#F8FAFC', '#A78BFA'], spread = 260, lift = 120, size = 9, inward}) => {
  if (p <= 0 || p >= 1) return null;
  const e = eo(p);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const ox = x + hash(i * 3.1 + seed) * w;
    const oy = y + hash(i * 5.7 + seed) * h;
    const ang = hash(i * 7.3 + seed) * Math.PI * 2;
    const dist = (0.3 + hash(i * 11.9 + seed)) * spread;
    let px = ox + Math.cos(ang) * dist * e;
    let py = oy + Math.sin(ang) * dist * e - lift * e;
    if (inward) {
      px = ox + (inward.x - ox) * e;
      py = oy + (inward.y - oy) * e;
    }
    const s = size * (0.4 + hash(i * 2.3 + seed)) * (1 - p * 0.7);
    items.push(<div key={i} style={{position: 'absolute', left: px, top: py, width: s, height: s, background: colors[i % colors.length], opacity: inward ? 1 - Math.pow(p, 3) : 1 - p, borderRadius: 1.5, transform: `rotate(${(hash(i) - 0.5) * 360 * e}deg)`}} />);
  }
  return <>{items}</>;
};
