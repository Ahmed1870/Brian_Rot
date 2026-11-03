import React from 'react';
import {C, FONT_AR, FONT_MONO} from '../theme';
import {back, eo, prog} from '../lib/anim';

type Ch = {children?: React.ReactNode};

// Word-by-word reveal. Arabic is never split into letters (that would break shaping).
export const WordReveal: React.FC<{text: string; t: number; start: number; step?: number; rtl?: boolean; color?: string; rise?: number}> = ({text, t, start, step = 0.07, rtl, color, rise = 22}) => {
  const words = text.split(' ');
  return (
    <span style={{direction: rtl ? 'rtl' : 'ltr', unicodeBidi: 'isolate', color}}>
      {words.map((w, i) => {
        const p = eo(prog(t, start + i * step, start + i * step + 0.55));
        return (
          <React.Fragment key={i}>
            <span style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * rise}px)`}}>{w}</span>
            {i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
};

// "Arabic | English" (or English first) headline exactly as written in the production plan.
export const Bi: React.FC<{ar: string; en: string; first?: 'ar' | 'en'; size?: number; t: number; start: number; color?: string; enColor?: string; weight?: number; sep?: string; gap?: number; stack?: boolean}> = ({ar, en, first = 'ar', size = 44, t, start, color = C.text, enColor, weight = 800, sep = C.accent, gap = 18, stack}) => {
  const A = <WordReveal text={ar} t={t} start={start} rtl color={color} />;
  const E = (
    <span style={{fontFamily: FONT_MONO, fontWeight: 600, fontSize: size * 0.8, color: enColor || color, letterSpacing: -0.5}}>
      <WordReveal text={en} t={t} start={start + 0.2} />
    </span>
  );
  const bar = <span style={{width: 3, height: size * 0.9, background: sep, borderRadius: 2, opacity: eo(prog(t, start + 0.1, start + 0.5))}} />;
  if (stack) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, fontFamily: FONT_AR, fontWeight: weight, fontSize: size, lineHeight: 1.2}}>
        <div style={{direction: 'rtl', width: '100%'}}>{A}</div>
        <div style={{width: '100%', direction: 'ltr', display: 'flex', alignItems: 'center', gap: 12}}>{bar}{E}</div>
      </div>
    );
  }
  return (
    <div style={{display: 'flex', direction: first === 'ar' ? 'rtl' : 'ltr', alignItems: 'center', gap, fontFamily: FONT_AR, fontWeight: weight, fontSize: size, lineHeight: 1.25, whiteSpace: 'nowrap'}}>
      {first === 'ar' ? (<>{A}{bar}{E}</>) : (<>{E}{bar}{A}</>)}
    </div>
  );
};

export const Pill: React.FC<Ch & {bg?: string; color?: string; border?: string; size?: number; mono?: boolean; pad?: string; style?: React.CSSProperties}> = ({children, bg = 'rgba(56,189,248,0.14)', color = C.accent, border = 'rgba(56,189,248,0.45)', size = 22, mono, pad = '6px 16px', style}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, background: bg, color, border: `1.5px solid ${border}`, borderRadius: 999, padding: pad, fontSize: size, fontFamily: mono ? FONT_MONO : FONT_AR, fontWeight: 700, whiteSpace: 'nowrap', ...style}}>{children}</span>
);

export const Keycap: React.FC<{label: string; down: number; size?: number}> = ({label, down, size = 30}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: size * 3, height: size * 1.9, padding: '0 24px', borderRadius: 12, fontFamily: FONT_MONO, fontWeight: 700, fontSize: size, color: C.text, background: down > 0.5 ? C.accent2 : '#334155', boxShadow: down > 0.5 ? `0 2px 0 #0369a1, 0 0 30px rgba(56,189,248,.6)` : '0 8px 0 #1e293b, 0 12px 24px rgba(0,0,0,.45)', transform: `translateY(${down > 0.5 ? 6 : 0}px)`, border: '1.5px solid rgba(255,255,255,.18)'}}>
    {label}
  </div>
);

export const appear = (t: number, a: number, b = a + 0.6) => eo(prog(t, a, b));
export const pop = (t: number, a: number, b = a + 0.7) => back(prog(t, a, b));
