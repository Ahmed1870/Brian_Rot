import React from 'react';
import {CAIRO} from '../fonts';
import {C, CAPTIONS} from '../theme';
import {clamp} from '../lib/anim';
import {SPRINGS, sp} from '../utils/springConfigs';

/** Kinetic Arabic captions (the VO transcript), word-by-word spring, at the bottom of the frame. */
export const Captions: React.FC<{f: number}> = ({f}) => (
  <>
    {CAPTIONS.map((c, ci) => {
      if (f < c.from || f > c.to + 24) return null;
      const words = c.text.split(' ');
      return (
        <div key={ci} style={{position: 'absolute', left: 50, right: 50, top: 1610, height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl', columnGap: 13, fontFamily: CAIRO, fontWeight: 900, fontSize: 52, lineHeight: 1.45,
            color: C.text, textAlign: 'center', textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>
            {words.map((w, i) => {
              const s = sp(f, SPRINGS.text, c.from + i * 3);
              const ex = clamp(sp(f, SPRINGS.soft, c.to + i));
              const hot = /المتوسط|Mean|الوسيط|Median|مفلسين|الخدعة|مهتم/.test(w);
              return (
                <span key={i} style={{display: 'inline-block', opacity: clamp(s * 3) * (1 - ex), transformOrigin: '50% 90%',
                  color: /مفلسين|الخدعة/.test(w) ? C.coral : /الوسيط|Median/.test(w) ? C.emerald : /مهتم/.test(w) ? C.yellow : C.text,
                  transform: `translateY(${(1 - s) * 40 - ex * 30}px) scale(${1 - (1 - s) * 0.25}, ${1 + (1 - s) * 0.5})`, fontWeight: hot ? 900 : 900}}>{w}</span>
              );
            })}
          </div>
        </div>
      );
    })}
  </>
);
