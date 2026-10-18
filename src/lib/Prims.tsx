import React from 'react';
import {Prim, sortPrims} from './engine';

/** Painter's-algorithm SVG renderer for engine primitives. */
export const Prims: React.FC<{prims: Prim[]}> = ({prims}) => (
  <>
    {sortPrims(prims).map((p, i) => {
      if (p.k === 'poly') {
        return <polygon key={i} points={p.pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ')} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw ?? 1} strokeLinejoin="round" />;
      }
      if (p.k === 'line') {
        return <line key={i} x1={p.a[0]} y1={p.a[1]} x2={p.b[0]} y2={p.b[1]} stroke={p.stroke} strokeWidth={p.sw} strokeLinecap="round" />;
      }
      return <circle key={i} cx={p.p[0]} cy={p.p[1]} r={p.r} fill={p.fill} />;
    })}
  </>
);
