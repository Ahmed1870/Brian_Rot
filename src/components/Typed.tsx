import React from 'react';
import {useCurrentFrame} from 'remotion';
import {MONO} from '../fonts';
import {C, clamp, CX} from '../theme';

type Props = {text: string; y: number; size: number; start: number; cps?: number; fill?: string; weight?: number; flash?: boolean; x?: number};

/** نص يتكتب بسرعة ليزرية مع ومضات (أصفر/أبيض) على آخر حرف. */
export const Typed: React.FC<Props> = ({text, y, size, start, cps = 16, fill = C.white, weight = 700, flash = true, x = CX}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  if (t < start) return null;
  const n = Math.min(text.length, Math.floor((t - start) * cps) + 1);
  const w = text.length * 0.6 * size;
  const left = x - w / 2;
  const typing = n < text.length;
  const blink = Math.floor(f / 6) % 2 === 0;
  return (
    <div style={{position: 'absolute', left, top: y, width: w + 40, fontFamily: MONO, fontWeight: weight, fontSize: size, lineHeight: 1.2, whiteSpace: 'pre', color: fill, direction: 'ltr'}}>
      {text.slice(0, n - (typing ? 1 : 0))}
      {typing && <span style={{color: flash && f % 4 < 2 ? C.yellow : C.white, textShadow: `0 0 18px ${C.yellow}`}}>{text[n - 1]}</span>}
      {(typing || blink) && <span style={{display: 'inline-block', width: size * 0.12, height: size * 0.95, marginLeft: 4, background: C.yellow, verticalAlign: 'text-bottom'}} />}
      <span style={{display: 'none'}}>{clamp(0)}</span>
    </div>
  );
};
