import React from 'react';
import {CAIRO} from '../fonts';
import {C, CAPTIONS} from '../theme';
import {clamp} from '../lib/anim';
import {SPRINGS, sp} from '../utils/springConfigs';

/** Kinetic Arabic captions at the bottom: the VO transcript, word-by-word. */
export const Captions: React.FC<{f: number}> = ({f}) => (
  <>
    {CAPTIONS.map((c, ci) => {
      if (f < c.from || f > c.to + 22) return null;
      return (
        <div key={ci} style={{position: 'absolute', left: 50, right: 50, top: 1640, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl', columnGap: 13, fontFamily: CAIRO, fontWeight: 900, fontSize: 52, lineHeight: 1.45, textAlign: 'center'}}>
            {c.text.split(' ').map((w, i) => {
              const s = sp(f, SPRINGS.text, c.from + i * 2.5);
              const ex = clamp(sp(f, SPRINGS.soft, c.to + i));
              const col = /مهتم/.test(w) ? C.yellow : /مجانية|مجاناً|100%/.test(w) ? '#2DD4BF' : C.cream;
              return <span key={i} style={{display: 'inline-block', color: col, opacity: clamp(s * 3) * (1 - ex), transformOrigin: '50% 90%', textShadow: '0 3px 14px rgba(0,0,0,0.7)',
                transform: `translateY(${(1 - s) * 36 - ex * 28}px) scale(${1 - (1 - s) * 0.25}, ${1 + (1 - s) * 0.5})`}}>{w}</span>;
            })}
          </div>
        </div>
      );
    })}
  </>
);
