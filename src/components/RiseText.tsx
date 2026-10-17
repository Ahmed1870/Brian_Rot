import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AR, MONO} from '../fonts';
import {C, CX} from '../theme';

type Props = {text: string; y: number; size: number; start: number; color?: string; weight?: number; mono?: boolean; x?: number; w?: number; glow?: string; align?: 'center' | 'right' | 'left'; rise?: number};

/** نص بيطلع بنبض (spring) + blur. start بالثواني. */
export const RiseText: React.FC<Props> = ({text, y, size, start, color = C.white, weight = 700, mono = false, x = CX, w = 960, glow, align = 'center', rise = 50}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f - Math.round(start * fps);
  if (t < 0) return null;
  const p = spring({frame: t, fps, config: {damping: 15, stiffness: 130}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y,
        width: w,
        textAlign: align,
        direction: mono ? 'ltr' : 'rtl',
        fontFamily: mono ? MONO : AR,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.2,
        color,
        whiteSpace: 'pre',
        opacity: interpolate(t, [0, 6], [0, 1], {extrapolateRight: 'clamp'}),
        transform: `translateY(${(1 - p) * rise}px)`,
        filter: `blur(${Math.max(0, 1 - p) * 8}px)`,
        textShadow: glow ? `0 0 22px ${glow}` : undefined,
      }}
    >
      {text}
    </div>
  );
};
