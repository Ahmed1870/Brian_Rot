import React from 'react';
import {C, CENTER} from '../theme';
import {clamp, hash} from './anim';

const TAU = Math.PI * 2;
const R = 330;

type P = {x: number; y: number; z: number};
const proj = (p: P, yaw: number, tilt: number) => {
  const x1 = p.x * Math.cos(yaw) + p.z * Math.sin(yaw);
  const z1 = -p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
  const y2 = p.y * Math.cos(tilt) - z1 * Math.sin(tilt);
  const z2 = p.y * Math.sin(tilt) + z1 * Math.cos(tilt);
  const k = 1500 / (1500 + z2);
  return {x: CENTER.x + x1 * k, y: CENTER.y + y2 * k, z: z2};
};
const sph = (th: number, ph: number, r = R): P => ({x: r * Math.sin(th) * Math.cos(ph), y: r * Math.cos(th), z: r * Math.sin(th) * Math.sin(ph)});

/** Wireframe hologram sphere with gold liquid particles. reveal 0..1 = scanline progress. */
export const HoloSphere: React.FC<{f: number; reveal: number; color?: string; jitter?: number; alpha?: number}> = ({f, reveal, color = C.cyan, jitter = 0, alpha = 1}) => {
  const yaw = f * 0.013;
  const tilt = 0.38;
  const jx = (hash(f * 1.7) - 0.5) * jitter;
  const jy = (hash(f * 2.3) - 0.5) * jitter;
  const lines: React.ReactNode[] = [];
  const mk = (pts: P[], key: string, closed: boolean) => {
    const q = pts.map((p) => proj(p, yaw, tilt));
    const z = q.reduce((a, p) => a + p.z, 0) / q.length;
    const d = q.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + (closed ? ' Z' : '');
    lines.push(<path key={key} d={d} fill="none" stroke={color} strokeWidth={1.6} opacity={(0.28 + 0.55 * clamp(0.5 - z / (R * 2))) * alpha} />);
  };
  for (let i = 1; i < 10; i++) mk(Array.from({length: 56}, (_, k) => sph((i / 10) * Math.PI, (k / 56) * TAU)), `lat${i}`, true);
  for (let i = 0; i < 18; i++) mk(Array.from({length: 40}, (_, k) => sph((k / 39) * Math.PI, (i / 18) * TAU)), `lon${i}`, false);
  const sparks = Array.from({length: 170}, (_, i) => {
    const th = hash(i * 1.3) * Math.PI;
    const ph = hash(i * 2.9) * TAU + f * (0.01 + hash(i) * 0.03);
    const r = R * (1 + 0.06 * Math.sin(f * 0.05 + i));
    const q = proj(sph(th, ph, r), yaw, tilt);
    return <circle key={i} cx={q.x} cy={q.y} r={1.2 + hash(i * 4.1) * 2.4} fill={i % 4 ? C.gold : '#fff'} opacity={(0.3 + 0.6 * clamp(0.5 - q.z / (R * 2))) * alpha} />;
  });
  const scanY = CENTER.y - R - 30 + reveal * (R * 2 + 60);
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: 0.88 + 0.12 * hash(Math.floor(f / 2))}}>
      <defs><clipPath id="holoClip"><rect x={0} y={0} width={1080} height={scanY} /></clipPath></defs>
      <g transform={`translate(${jx} ${jy})`}>
        <g clipPath="url(#holoClip)" style={{mixBlendMode: 'screen'}}>
          {lines}
          {sparks}
        </g>
        {reveal > 0 && reveal < 1 ? (
          <g>
            <rect x={160} y={scanY - 70} width={760} height={70} fill="url(#scanTrail)" />
            <rect x={140} y={scanY - 2} width={800} height={4} fill="#fff" style={{filter: 'drop-shadow(0 0 12px #00F0FF)'}} />
            <defs>
              <linearGradient id="scanTrail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={C.cyan} stopOpacity="0" /><stop offset="1" stopColor={C.cyan} stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </g>
        ) : null}
      </g>
    </svg>
  );
};
