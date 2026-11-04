import React from 'react';
import {C, FONT_MONO} from '../theme';
import {eo, prog, seg} from '../lib/anim';
import {pop} from './Text';

// Headline tag used by every scene: coloured head + body, pops in, slides out at the end of its window.
export const Tag: React.FC<{t: number; range: number[]; head: string; body?: string; color: string; size?: number}> = ({t, range, head, body, color, size = 26}) => {
  const p = pop(t, range[0], range[0] + 0.8) * (1 - seg(t, range[1] - 0.4, range[1]));
  if (p <= 0.01) return null;
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 28px', borderRadius: 16, background: `${color}22`, border: `2px solid ${color}`, fontFamily: FONT_MONO, fontWeight: 700, fontSize: size, color: C.text, whiteSpace: 'nowrap', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -40}px)`, boxShadow: `0 0 30px ${color}44`}}>
      <span style={{color}}>{head}</span>
      {body ? <span>{body}</span> : null}
    </div>
  );
};
export const draw = (t: number, a: number, d = 1) => eo(prog(t, a, a + d));
