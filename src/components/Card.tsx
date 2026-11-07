import React from 'react';

export const Card: React.FC<{x: number; y: number; w: number; h: number; c: string; glow?: number; op?: number; children?: React.ReactNode}> = ({x, y, w, h, c, glow = 22, op = 1, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 24, background: 'rgba(30,41,59,0.86)', border: `2.5px solid ${c}`, boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 ${glow}px ${c}55`, opacity: op, boxSizing: 'border-box'}}>{children}</div>
);
