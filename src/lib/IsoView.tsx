import React from 'react';
import {Iso, IBox, boxPolys, sortBoxes} from './iso';

/** Renders iso boxes as SVG groups (painter-sorted). */
export const IsoBoxes: React.FC<{boxes: IBox[]; o: Iso}> = ({boxes, o}) => (
  <>
    {sortBoxes(boxes).map((b, i) => (
      <g key={b.key ?? i}>
        {boxPolys(b, o).map((p, j) => (
          <polygon key={j} points={p.pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ')} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw}
            strokeDasharray={p.dash ? '8 7' : undefined} strokeLinejoin="round" />
        ))}
      </g>
    ))}
  </>
);

/** Diamond floor slab with grid lines. */
export const IsoFloor: React.FC<{o: Iso; x0: number; x1: number; z0: number; z1: number; step?: number; op?: number}> = ({o, x0, x1, z0, z1, step = 100, op = 1}) => {
  const P = (x: number, z: number) => {
    const px = o.cx + (x - z) * 0.866 * o.s, py = o.cy + (x + z) * 0.5 * o.s;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  };
  const lines: React.ReactNode[] = [];
  for (let x = x0; x <= x1; x += step) lines.push(<polyline key={`x${x}`} points={`${P(x, z0)} ${P(x, z1)}`} stroke="rgba(248,250,252,0.10)" strokeWidth={1.5} fill="none" />);
  for (let z = z0; z <= z1; z += step) lines.push(<polyline key={`z${z}`} points={`${P(x0, z)} ${P(x1, z)}`} stroke="rgba(248,250,252,0.10)" strokeWidth={1.5} fill="none" />);
  return (
    <g opacity={op}>
      <polygon points={`${P(x0, z0)} ${P(x1, z0)} ${P(x1, z1)} ${P(x0, z1)}`} fill="rgba(30,41,59,0.75)" stroke="rgba(248,250,252,0.25)" strokeWidth={2} />
      {lines}
    </g>
  );
};
