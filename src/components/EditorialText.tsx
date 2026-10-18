import React from 'react';
import {CAIRO} from '../fonts';
import {C} from '../theme';
import {clamp} from '../lib/anim';
import {SPRINGS, sp} from '../utils/springConfigs';

export type TWord = {t: string; c?: string};
export type TLine = {words: TWord[]; from: number; to?: number};

/** Spatial editorial typography: Cairo Black, word-by-word spring rise, optional exit, optional English kicker. */
export const EditorialText: React.FC<{
  f: number;
  lines: TLine[];
  y: number;
  size: number;
  lead?: number;
  kicker?: {text: string; from: number; to?: number};
}> = ({f, lines, y, size, lead = 1.45, kicker}) => (
  <>
    {kicker && f >= kicker.from && (kicker.to === undefined || f < kicker.to + 20) ? (
      <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 1.1, textAlign: 'center', fontFamily: CAIRO, fontWeight: 800, fontSize: 24, letterSpacing: 7,
        color: C.concrete, opacity: 0.7 * clamp(sp(f, SPRINGS.text, kicker.from) * 2) * (kicker.to === undefined ? 1 : 1 - clamp((f - kicker.to) / 14))}}>
        {kicker.text}
      </div>
    ) : null}
    {lines.map((ln, li) => {
      if (f < ln.from || (ln.to !== undefined && f > ln.to + 24)) return null;
      return (
        <div key={li} style={{position: 'absolute', left: 40, right: 40, top: y + li * size * lead, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl',
          columnGap: size * 0.26, fontFamily: CAIRO, fontWeight: 900, fontSize: size, lineHeight: 1.2, textAlign: 'center'}}>
          {ln.words.map((w, i) => {
            const s = sp(f, SPRINGS.text, ln.from + i * 5);
            const ex = ln.to === undefined ? 0 : clamp(sp(f, SPRINGS.camera, ln.to + i * 2));
            return (
              <span key={i} style={{display: 'inline-block', color: w.c ?? C.cream, opacity: clamp(s * 3) * (1 - ex), transformOrigin: '50% 90%',
                textShadow: '0 4px 24px rgba(0,0,0,0.7)', transform: `translateY(${(1 - s) * size * 0.8 - ex * size * 0.6}px) scale(${1 - (1 - s) * 0.25}, ${1 + (1 - s) * 0.6})`}}>
                {w.t}
              </span>
            );
          })}
        </div>
      );
    })}
  </>
);
