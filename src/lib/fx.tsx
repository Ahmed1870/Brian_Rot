import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, CENTER, DURATION, T} from '../theme';
import {MONO, ORB} from '../fonts';
import {clamp, easeOut, hash, ramp} from './anim';

/** Digital rain + distant lit skyline + haze. Rain speeds are integer laps over 1050 frames => loop-safe. */
export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <radialGradient id="haze" cx="50%" cy="45%" r="70%">
          <stop offset="0" stopColor="#0B2A5C" stopOpacity="0.55" />
          <stop offset="0.6" stopColor={C.navy} stopOpacity="0.5" />
          <stop offset="1" stopColor={C.bg} stopOpacity="1" />
        </radialGradient>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A3A6B" stopOpacity="0" />
          <stop offset="1" stopColor="#0A3A6B" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={C.bg} />
      <rect width={1080} height={1920} fill="url(#haze)" />
      {Array.from({length: 24}, (_, i) => {
        const w = 50 + hash(i * 3.1) * 90;
        const x = (i / 24) * 1100 - 20;
        const h = 150 + hash(i * 5.7) * 420;
        return (
          <g key={i} opacity={0.9}>
            <rect x={x} y={1920 - h} width={w} height={h} fill="#030814" stroke="rgba(0,240,255,0.10)" />
            {Array.from({length: 14}, (_, k) => {
              const on = hash(i * 31 + k * 7 + Math.floor(f / (40 + (k % 5) * 12))) > 0.62;
              return on ? <rect key={k} x={x + 8 + (k % 3) * (w / 3.4)} y={1920 - h + 14 + Math.floor(k / 3) * 34} width={9} height={14}
                fill={hash(i + k) > 0.7 ? C.gold : C.cyan} opacity={0.5} /> : null;
            })}
          </g>
        );
      })}
      <rect y={1200} width={1080} height={720} fill="url(#fog)" />
      {Array.from({length: 120}, (_, i) => {
        const lap = 1 + (i % 3);
        const y = (((hash(i * 2.9) * 1920 + (f * 1920 * lap) / DURATION) % 1920) + 1920) % 1920;
        const x = hash(i * 1.7) * 1080;
        const len = 40 + hash(i * 4.4) * 150;
        return <line key={i} x1={x} y1={y} x2={x - 3} y2={y + len} stroke={i % 9 === 0 ? C.magenta : C.cyan} strokeWidth={1 + (i % 3) * 0.6}
          opacity={0.08 + hash(i * 6.2) * 0.22} />;
      })}
    </svg>
  );
};

/** CRT scanlines + grain-ish flicker + vignette. */
export const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.16,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 2px, transparent 4px)'}} />
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}} />
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: '#fff', opacity: hash(f * 1.3) > 0.97 ? 0.035 : 0}} />
    </>
  );
};

/** The shared light point: first frame == last frame => seamless loop. */
export const CoreDot: React.FC = () => {
  const f = useCurrentFrame();
  const r = f < 40 ? 9 * (1 - 0.55 * ramp(f, 10, 26)) * (1 - ramp(f, 26, 40)) : 9 * ramp(f, T.collapse + 22, 1046);
  if (r < 0.2) return null;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <circle cx={CENTER.x} cy={CENTER.y} r={r * 3.2} fill="rgba(0,240,255,0.22)" />
      <circle cx={CENTER.x} cy={CENTER.y} r={r} fill="#fff" style={{filter: 'drop-shadow(0 0 16px #00F0FF)'}} />
    </svg>
  );
};

/** Cyberpunk neon text: typed reveal, RGB split, slice glitch. Lines separated by '|'. */
export const GlitchText: React.FC<{
  text: string; y: number; size: number; from: number; to?: number; color?: string;
  glitch?: number; type?: boolean; spacing?: number; font?: string;
}> = ({text, y, size, from, to, color = C.cyan, glitch = 0.4, type = true, spacing = 4, font}) => {
  const f = useCurrentFrame();
  if (f < from || (to !== undefined && f > to + 8)) return null;
  const lines = text.split('|');
  const total = lines.join('').length;
  const shown = type ? Math.floor((f - from) * 1.25) : total;
  const out = to === undefined ? 0 : ramp(f, to, to + 8);
  const g = glitch * (hash(Math.floor(f / 2) + from) > 0.72 ? 1 : 0.12) + (f - from < 10 ? 0.6 : 0);
  const dx = (hash(f * 3.1 + from) - 0.5) * 16 * g;
  let used = 0;
  const render = (extra: React.CSSProperties) => (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - size * 0.7, textAlign: 'center', fontFamily: font ?? ORB, fontWeight: 700, fontSize: size,
      letterSpacing: spacing, lineHeight: 1.18, whiteSpace: 'pre', ...extra}}>
      {lines.map((ln, i) => {
        const n = Math.max(0, Math.min(ln.length, shown - used));
        used += ln.length;
        return <div key={i}>{ln.slice(0, n) || '\u00A0'}</div>;
      })}
    </div>
  );
  const cursor = type && shown < total + 14 && Math.floor(f / 4) % 2 === 0;
  const common: React.CSSProperties = {opacity: clamp(ramp(f, from, from + 4) * (1 - out))};
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', ...common}}>
      {(used = 0, render({color: C.red, transform: `translateX(${-3 - dx}px)`, mixBlendMode: 'screen', opacity: 0.8}))}
      {(used = 0, render({color: C.cyan, transform: `translateX(${3 + dx}px)`, mixBlendMode: 'screen', opacity: 0.8}))}
      {(used = 0, render({color, textShadow: `0 0 10px ${color}, 0 0 34px ${color}`, transform: `translateX(${dx * 0.3}px)`}))}
      {g > 0.5 ? (used = 0, render({color: '#fff', clipPath: `inset(${30 + hash(f) * 30}% 0 ${30 - hash(f * 2) * 25}% 0)`, transform: `translateX(${dx * 2.5}px)`})) : null}
      {cursor ? <div style={{position: 'absolute', left: 0, right: 0, top: y + size * (lines.length - 0.5) * 1.18, textAlign: 'center', fontFamily: MONO, fontSize: size * 0.5, color}}>_</div> : null}
    </div>
  );
};

export const Shock: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = f - at;
  if (t < 0 || t > 50) return null;
  const rings = [{c: C.gold, d: 0, w: 14}, {c: C.cyan, d: 4, w: 9}, {c: '#fff', d: 8, w: 4}, {c: C.magenta, d: 12, w: 6}];
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      {rings.map((r, i) => {
        const k = clamp((t - r.d) / 36);
        return k > 0 ? <circle key={i} cx={CENTER.x} cy={CENTER.y} r={easeOut(k) * 1500} fill="none" stroke={r.c} strokeWidth={r.w * (1 - k) + 0.5} opacity={1 - k} /> : null;
      })}
      <rect x={0} y={CENTER.y - 5 * (1 - t / 50)} width={1080} height={Math.max(0, 10 * (1 - t / 50))} fill="#fff" opacity={0.85 * (1 - t / 50)} />
    </svg>
  );
};
