import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FPS, HEIGHT, WIDTH} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, hash, ramp} from './anim';

/** Chalkboard: matte slate, faint eraser smudges, soft vignette. No glow. */
export const Board: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.board}}>
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <radialGradient id="boardV" cx="50%" cy="46%" r="75%"><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.45" /></radialGradient>
        <linearGradient id="smudge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.035" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      {Array.from({length: 9}, (_, i) => (
        <rect key={i} x={hash(i * 3.1) * 1500} y={hash(i * 7.7) * 900} width={300 + hash(i) * 420} height={60 + hash(i * 2) * 90} fill="url(#smudge)" transform={`rotate(${(hash(i * 5) - 0.5) * 14} 960 540)`} />
      ))}
      <rect width={WIDTH} height={HEIGHT} fill="url(#boardV)" />
      <rect x={20} y={20} width={WIDTH - 40} height={HEIGHT - 40} fill="none" stroke="rgba(234,234,234,0.10)" strokeWidth={3} rx={8} />
    </svg>
  </AbsoluteFill>
);

/** Scene wrapper: fades in, and "erases" at the end with a sweeping eraser band. */
export const Sheet: React.FC<{f: number; from: number; to: number; eraseFrames?: number; children: React.ReactNode}> = ({f, from, to, eraseFrames = 14, children}) => {
  if (f < from - 2 || f > to + eraseFrames + 2) return null;
  const inn = ramp(f, from, from + 8);
  const er = ramp(f, to, to + eraseFrames);
  return (
    <AbsoluteFill style={{opacity: inn}}>
      <AbsoluteFill style={{clipPath: er > 0 ? `inset(0 0 0 ${er * 100}%)` : undefined}}>{children}</AbsoluteFill>
      {er > 0 && er < 1 ? (
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${er * 100}%`, width: 120, transform: 'translateX(-100%)', background: 'linear-gradient(90deg, rgba(26,29,32,0), rgba(26,29,32,1) 70%)'}} />
      ) : null}
    </AbsoluteFill>
  );
};

/** Lesson header chip (top-left). */
export const Header: React.FC<{f: number; label: string; n: number}> = ({f, label, n}) => (
  <div style={{position: 'absolute', left: 70, top: 44, display: 'flex', alignItems: 'center', gap: 18, fontFamily: CAIRO, opacity: clamp(ramp(f, 0, 12))}}>
    <div style={{width: 48, height: 48, borderRadius: '50%', border: `3px solid ${C.yellow}`, color: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 26}}>{n}</div>
    <div style={{fontWeight: 700, fontSize: 30, color: C.dim, letterSpacing: 2}}>LESSON 24 · RFM ANALYSIS · <span style={{color: C.chalk}}>{label}</span></div>
  </div>
);
