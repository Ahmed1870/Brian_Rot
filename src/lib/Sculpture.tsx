import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, DURATION} from '../theme';
import {clamp, easeOut, hash} from './anim';
import {FACES, STRANDS, SAMPLES, VERTS, mixAt, proj43, rot4, scaleAt, strandPoint, toScreen} from './quantum';

const TAU = Math.PI * 2;
const CX = 540;
const CY = 860;
const S = 165;
const GOLD = [251, 191, 36];
const CYAN = [0, 240, 255];
const col = (g: number, a = 1) => {
  const r = Math.round(GOLD[0] + (CYAN[0] - GOLD[0]) * g);
  const gg = Math.round(GOLD[1] + (CYAN[1] - GOLD[1]) * g);
  const b = Math.round(GOLD[2] + (CYAN[2] - GOLD[2]) * g);
  return `rgba(${r},${gg},${b},${a})`;
};

/** 4D tesseract turning inside-out -> liquid gold/cyan torus -> collapses to a point -> bursts back to frame 0. */
export const Sculpture: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / DURATION;
  const m = mixAt(t);
  const sc = scaleAt(t) * (1 + 0.03 * Math.sin(TAU * 2 * t));
  const P = (p: [number, number, number]) => toScreen(p, t, CX, CY, S, sc);

  // flowing strands (3 stacked strokes = glow without filters)
  const strands = Array.from({length: STRANDS}, (_, j) => {
    const pts = Array.from({length: SAMPLES}, (_, i) => P(strandPoint(j, i / (SAMPLES - 1), t, m)));
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const km = pts[SAMPLES >> 1].k;
    const g = 0.5 + 0.5 * Math.sin(TAU * ((j / STRANDS) * 2 + t));
    const w = Math.max(0.6, 2.4 * km);
    return (
      <g key={j}>
        <path d={d} fill="none" stroke={col(g, 0.07)} strokeWidth={w * 6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={col(g, 0.22)} strokeWidth={w * 2.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={col(g, 0.95)} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  });

  // glass faces of the tesseract (fade out as it turns liquid)
  const faces = m < 0.98
    ? FACES.map((fc, i) => {
        const q = fc.map((v) => P(proj43(rot4(v, t))));
        const z = q.reduce((a, p) => a + p.z, 0) / 4;
        return {i, q, z};
      })
        .sort((a, b) => b.z - a.z)
        .map(({i, q}) => (
          <polygon key={i} points={q.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
            fill={i % 2 ? 'rgba(0,240,255,0.055)' : 'rgba(251,191,36,0.05)'} stroke="rgba(255,255,255,0.22)" strokeWidth={1.2} />
        ))
    : null;
  const verts = m < 0.98
    ? VERTS.map((v, i) => {
        const p = P(proj43(rot4(v, t)));
        return <circle key={i} cx={p.x} cy={p.y} r={5 * p.k} fill="#fff" />;
      })
    : null;

  // sparkles riding the strands, attracting / repelling
  const sparks = Array.from({length: 420}, (_, k) => {
    const j = k % STRANDS;
    const u = (hash(k * 1.7) + (1 + (k % 3)) * t) % 1;
    const ph = hash(k * 2.9) * TAU;
    const p3 = strandPoint(j, u, t, m);
    const pulse = 1 + 0.14 * Math.sin(TAU * 2 * t + ph);
    const p = P([p3[0] * pulse, p3[1] * pulse, p3[2] * pulse]);
    const tw = 0.5 + 0.5 * Math.sin(TAU * 3 * t + ph);
    return <circle key={k} cx={p.x} cy={p.y} r={Math.max(0.3, (1.2 + hash(k) * 2.8) * p.k * (0.4 + tw))}
      fill={k % 5 === 0 ? '#fff' : col(hash(k * 5.1), 1)} opacity={0.35 + tw * 0.65} />;
  });

  // big-bang burst that straddles the loop seam
  const uu = (t - 0.9 + 1) % 1;
  const q = clamp((uu - 0.04) / 0.16);
  const burst = uu > 0.04 && uu < 0.2
    ? Array.from({length: 110}, (_, i) => {
        const a = hash(i * 3.3) * TAU;
        const r = (120 + hash(i * 7.1) * 560) * easeOut(q);
        return <circle key={i} cx={CX + Math.cos(a) * r} cy={CY + Math.sin(a) * r} r={(1 + hash(i) * 3.5) * (1 - q)} fill={col(hash(i * 9.1))} opacity={1 - q} />;
      })
    : null;
  const core = (1 - scaleAt(t)) > 0.3;

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <g>{faces}</g>
      <g style={{mixBlendMode: 'screen'}}>{strands}</g>
      <g opacity={1 - m}>{verts}</g>
      <g style={{mixBlendMode: 'screen'}}>{sparks}</g>
      <g>{burst}</g>
      {core ? <circle cx={CX} cy={CY} r={10 + (1 - scaleAt(t)) * 26} fill="#fff" style={{filter: 'drop-shadow(0 0 18px #FBBF24)'}} /> : null}
     
    </svg>
  );
};
