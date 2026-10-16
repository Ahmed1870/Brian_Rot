import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {MONO} from '../fonts';
import {CX, CY, clamp, lerp, ss} from '../engine';

const TAU = Math.PI * 2;

/** عدّاد Hyper-Speed 0.00 → 3.99 (3 ثواني) وبيرجع 0.00 قبل نهاية اللوب. */
export const Counter: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const value = t < 3 ? 3.99 * Math.pow(t / 3, 1.6) : t < 9.5 ? 3.99 : 0;
  const alpha = t < 5 ? 1 - ss(3, 3.6, t) : ss(9.5, 9.8, t);
  if (alpha <= 0.002) return null;
  const scale = t < 5 ? 1 - 0.85 * ss(3, 3.6, t) : lerp(0.15, 1, ss(9.5, 9.8, t));
  const split = t < 3 ? 2 + 7 * ss(0, 3, t) : t < 5 ? 9 : 2;
  const prog = t < 3 ? value / 3.99 : t < 9.5 ? 1 : 0;
  const spin = (f / 300) * 360 * 6; // 6 لفّات في 10 ثواني (لوب تام)
  const txt = value.toFixed(2);
  const R = 330;

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: alpha, perspective: 1400}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, transform: `scale(${scale})`, transformOrigin: `${CX}px ${CY}px`}}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={6} />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${prog} 1`} transform={`rotate(-90 ${CX} ${CY})`} style={{filter: `drop-shadow(0 0 10px ${C.cyan})`}} />
        <g transform={`rotate(${spin} ${CX} ${CY})`}>
          {new Array(60).fill(0).map((_, k) => {
            const a = (k / 60) * TAU;
            const long = k % 5 === 0;
            return <line key={k} x1={CX + Math.cos(a) * (R + 22)} y1={CY + Math.sin(a) * (R + 22)} x2={CX + Math.cos(a) * (R + (long ? 52 : 38))} y2={CY + Math.sin(a) * (R + (long ? 52 : 38))} stroke={k % 15 === 0 ? C.gold : C.cyan} strokeWidth={long ? 4 : 2} opacity={0.75} />;
          })}
        </g>
        <g transform={`rotate(${-spin * 0.5} ${CX} ${CY})`} opacity={0.5}>
          <circle cx={CX} cy={CY} r={R - 40} fill="none" stroke={C.blue} strokeWidth={2} strokeDasharray="4 18" />
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: 1080,
          top: CY - 150,
          textAlign: 'center',
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 260,
          lineHeight: '300px',
          color: C.white,
          transform: `rotateX(${14 * Math.sin((TAU * t) / 10)}deg) scale(${scale})`,
          textShadow: `${-split}px 0 0 rgba(0,240,255,0.6), ${split}px 0 0 rgba(255,190,40,0.6), 0 0 30px ${C.cyan}, 0 0 90px ${C.blue}`,
          letterSpacing: -6,
        }}
      >
        {txt}
      </div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: CY + 150, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: 34, letterSpacing: 18, color: C.cyan, opacity: 0.85, transform: `scale(${scale})`}}>SEC</div>
    </div>
  );
};
