import React from 'react';
import ENV from '../voiceEnv.json';
import TL from '../timeline.json';
import {C, FONT_MONO} from '../theme';
import {clamp} from '../lib/anim';

// Persistent overlay: lesson tag (top-right), voice-level meter (bottom-left), scene progress (bottom edge).
export const Hud: React.FC<{frame: number; t: number}> = ({frame, t}) => {
  const env = ENV as number[];
  const bars: React.ReactNode[] = [];
  for (let i = 0; i < 30; i++) {
    const f = clamp(frame - (29 - i) * 2, 0, env.length - 1);
    const v = env[f] || 0;
    bars.push(<div key={i} style={{width: 6, height: 5 + v * 34, borderRadius: 3, background: v > 0.08 ? C.accent : C.line, opacity: 0.35 + 0.65 * (i / 29)}} />);
  }
  const inCta = t >= 195;
  return (
    <>
      <div style={{position: 'absolute', right: 52, top: 34, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT_MONO, fontSize: 19, color: C.dim, letterSpacing: 0.5, opacity: 0.9}}>
        <span style={{width: 10, height: 10, borderRadius: 5, background: C.accent, boxShadow: `0 0 12px ${C.accent}`}} />
        <span>LESSON 01 · SQL From Zero to Professional</span>
      </div>
      {!inCta ? (
        <div style={{position: 'absolute', left: 52, bottom: 30, display: 'flex', alignItems: 'flex-end', gap: 4, height: 44, opacity: 0.75}}>
          {bars}
          <span style={{marginLeft: 10, fontFamily: FONT_MONO, fontSize: 15, color: C.mute}}>VO</span>
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 0, bottom: 0, width: 1920, height: 6, background: 'rgba(148,163,184,0.12)'}}>
        <div style={{width: `${(t / TL.duration) * 100}%`, height: 6, background: `linear-gradient(90deg, ${C.accent2}, ${C.accent})`}} />
        {TL.scenes.slice(1).map((s) => (
          <div key={s.id} style={{position: 'absolute', left: `${(s.start / TL.duration) * 100}%`, top: 0, width: 3, height: 6, background: C.bg}} />
        ))}
      </div>
    </>
  );
};
