import React from 'react';
import {C} from '../theme';

/** Tactile paper: warm cream, faint fibres, top light, real contact shadow (no glow). */
export const paperStyle = (o: {r?: number; shadow?: boolean; tone?: string} = {}): React.CSSProperties => ({
  background: `linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 30%), repeating-linear-gradient(97deg, rgba(0,0,0,0.012) 0 2px, rgba(0,0,0,0) 2px 5px), ${o.tone ?? C.cream}`,
  borderRadius: o.r ?? 14,
  boxShadow: o.shadow === false ? 'none' : '0 2px 0 rgba(0,0,0,0.10), 0 24px 50px rgba(0,0,0,0.45), 0 4px 10px rgba(0,0,0,0.30)',
});

export const Paper: React.FC<{style?: React.CSSProperties; r?: number; shadow?: boolean; tone?: string; children?: React.ReactNode}> = ({style, r, shadow, tone, children}) => (
  <div style={{...paperStyle({r, shadow, tone}), ...style}}>{children}</div>
);
