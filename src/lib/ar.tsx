import React from 'react';
import {C, CAPTIONS, fr} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, ramp, sp, SP} from './anim';

/** Arabic text in the DOM (flawless RTL shaping). typed = character typewriter, else word-by-word spring. */
export const ArText: React.FC<{
  f: number; from: number; text: string; top: number; left?: number; width?: number; size?: number; color?: string; weight?: number;
  align?: 'right' | 'center' | 'left'; typed?: boolean; cps?: number; op?: number; lh?: number; to?: number;
}> = ({f, from, text, top, left = 60, width = 960, size = 56, color = C.chalk, weight = 900, align = 'center', typed = false, cps = 0.9, op = 1, lh = 1.4, to}) => {
  if (f < from || (to !== undefined && f > to + 24)) return null;
  const base: React.CSSProperties = {position: 'absolute', left, top, width, direction: 'rtl', textAlign: align, fontFamily: CAIRO, fontWeight: weight, fontSize: size, lineHeight: lh, color, opacity: op};
  if (typed) {
    const n = Math.min(text.length, Math.floor((f - from) * cps));
    return <div style={base}>{text.slice(0, n)}<span style={{opacity: n < text.length ? 1 : 0, color: C.yellow}}>|</span></div>;
  }
  const words = text.split(' ');
  const ex = to === undefined ? 0 : clamp(sp(f, SP.soft, to));
  return (
    <div style={{...base, display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-start' : 'flex-end', columnGap: size * 0.26}}>
      {words.map((w, i) => {
        const s = sp(f, SP.text, from + i * 3);
        return <span key={i} style={{display: 'inline-block', opacity: clamp(s * 3) * (1 - ex), transformOrigin: '50% 90%', transform: `translateY(${(1 - s) * size * 0.5 - ex * size * 0.4}px) scale(${1 - (1 - s) * 0.2}, ${1 + (1 - s) * 0.4})`}}>{w}</span>;
      })}
    </div>
  );
};

/** Bottom captions: the VO transcript. */
export const Captions: React.FC<{f: number; hideAfter?: number}> = ({f, hideAfter = 76}) => (
  <>
    {CAPTIONS.map((c, i) => {
      const a = fr(c.from), b = fr(c.to);
      if (f < a || f > b + 20 || c.from >= hideAfter) return null;
      const words = c.text.split(' ');
      return (
        <div key={i} style={{position: 'absolute', left: 50, right: 50, top: 1740, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl', columnGap: 11, fontFamily: CAIRO, fontWeight: 900, fontSize: 42, lineHeight: 1.4, textAlign: 'center', color: C.chalk, textShadow: '0 3px 12px rgba(0,0,0,0.8)'}}>
            {words.map((w, k) => {
              const s = sp(f, SP.text, a + k * 2.5);
              const ex = clamp(sp(f, SP.soft, b + k));
              const hot = /Lift|Apriori|Support|Confidence|الرفع|الدعم|الثقة/.test(w);
              return <span key={k} style={{display: 'inline-block', color: hot ? C.yellow : C.chalk, opacity: clamp(s * 3) * (1 - ex), transform: `translateY(${(1 - s) * 30 - ex * 24}px) scale(${1 - (1 - s) * 0.2}, ${1 + (1 - s) * 0.4})`}}>{w}</span>;
            })}
          </div>
        </div>
      );
    })}
  </>
);

export const Header: React.FC<{f: number; label: string; n: number}> = ({f, label, n}) => (
  <div style={{position: 'absolute', left: 50, top: 48, display: 'flex', alignItems: 'center', gap: 16, fontFamily: CAIRO, opacity: ramp(f, 0, 12)}}>
    <div style={{width: 46, height: 46, borderRadius: '50%', border: `3px solid ${C.yellow}`, color: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 24}}>{n}</div>
    <div style={{fontWeight: 700, fontSize: 26, color: C.dim, letterSpacing: 2}}>LESSON 28 · MARKET BASKET · <span style={{color: C.chalk}}>{label}</span></div>
  </div>
);
