import React from 'react';
import {W, H, clamp, eio} from '../theme';

const ROWS = [
  {y0: 0, y1: 360, dir: 1},
  {y0: 360, y1: 640, dir: -1},
  {y0: 640, y1: H, dir: 1},
];
const PASS = 0.3;

/** clip-path للمشهد اللي بيتمسح: 3 تمريرات (ذهاب/إياب/ذهاب) بالممسحة. */
export const eraseClip = (t: number, e: number): string | undefined => {
  const u = t - e;
  if (u <= 0) return undefined;
  const parts = ROWS.map((r, i) => {
    const k = eio((u - i * PASS) / PASS);
    if (r.dir === 1) {
      const x = W * k;
      return `M ${x} ${r.y0} H ${W} V ${r.y1} H ${x} Z`;
    }
    const x = W * (1 - k);
    return `M 0 ${r.y0} H ${x} V ${r.y1} H 0 Z`;
  });
  return `path('${parts.join(' ')}')`;
};

/** الممسحة نفسها + أثر الغبار الأبيض وراها. */
export const Eraser: React.FC<{t: number; e: number}> = ({t, e}) => {
  const u = t - e;
  if (u <= -0.05 || u > 3) return null;
  const rows = ROWS.map((r, i) => {
    const local = u - i * PASS;
    const k = eio(local / PASS);
    const x = r.dir === 1 ? W * k : W * (1 - k);
    const active = local > 0 && local < PASS;
    const trailOp = local > 0 ? 0.16 * (1 - clamp((local - PASS) / 1.4)) : 0;
    return {r, x, active, trailOp, i};
  });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <defs>
        <linearGradient id="smudgeR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
      </defs>
      <g style={{filter: 'blur(16px)'}}>
        {rows.map(({r, x, trailOp, i}) => (
          <rect key={i} x={r.dir === 1 ? 0 : x} y={r.y0 + 30} width={r.dir === 1 ? x : W - x} height={r.y1 - r.y0 - 60} fill="#fff" opacity={trailOp * 0.55} />
        ))}
      </g>
      {rows.map(({r, x, active, i}) =>
        active ? (
          <g key={i} transform={`translate(${x} ${(r.y0 + Math.min(r.y1, 930)) / 2}) rotate(${r.dir === 1 ? -4 : 4})`}>
            <rect x={-150} y={-16} width={300} height={74} rx={10} fill="#2B2724" />
            <rect x={-150} y={-62} width={300} height={52} rx={10} fill="#7A4D22" />
            <rect x={-150} y={-62} width={300} height={14} rx={7} fill="#A5703A" opacity={0.7} />
            <circle cx={-90} cy={30} r={9} fill="#fff" opacity={0.15} />
            <circle cx={40} cy={36} r={12} fill="#fff" opacity={0.12} />
            <ellipse cx={r.dir === 1 ? -170 : 170} cy={20} rx={60} ry={70} fill="#fff" opacity={0.1} />
          </g>
        ) : null,
      )}
    </svg>
  );
};
