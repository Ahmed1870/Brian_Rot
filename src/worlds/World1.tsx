import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AR} from '../fonts';
import {C, CX, CY, clamp, lerp, ss} from '../theme';
import {HOLE} from '../camera';
import {RiseText} from '../components/RiseText';

const T0 = 0.2; // الصدمة (بعد 0.2s صمت)
const VL = new Array(13).fill(0).map((_, i) => i * 90);
const HL = new Array(22).fill(0).map((_, i) => i * 90);
const SEG = 24;

/** العالم 1: "بتخسر" بحجم ضخم + Cyber Grid Warp + ثقب = تجويف حرف الخاء. */
export const World1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  if (t < T0) return null;
  const amp = 70 * Math.exp(-(t - T0) * 2.0);
  const p = spring({frame: f - Math.round(T0 * fps), fps, config: {damping: 7, stiffness: 170, mass: 0.9}});
  const sc = lerp(1.4, 1, Math.min(1.15, p));
  const split = 16 * Math.exp(-(t - T0) * 2.6) * Math.sin(f * 2.3);
  const warpA = clamp(amp / 70);
  const txt: React.CSSProperties = {position: 'absolute', left: 0, width: 1080, top: CY - 330, height: 660, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl', fontFamily: AR, fontWeight: 700, fontSize: 350, lineHeight: 1, transform: `scale(${sc})`, whiteSpace: 'pre'};
  const l2 = clamp((t - 0.95) / 0.35);
  const rim = 0.6 + 0.4 * Math.sin(t * 9);

  return (
    <>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g fill="none" stroke={C.white} strokeWidth={1.2} opacity={0.07 + 0.05 * ss(0.2, 1.2, t)}>
          {VL.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={1920} />
          ))}
          {HL.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={1080} y2={y} />
          ))}
        </g>
        {amp > 0.6 && (
          <g fill="none" stroke={C.cyan} strokeWidth={2.4} opacity={0.15 + 0.7 * warpA}>
            {VL.map((x, i) => (
              <polyline key={`wv${x}`} points={new Array(SEG + 1).fill(0).map((_, s) => `${x + amp * Math.sin((s / SEG) * 9 + i * 0.8 + t * 16)},${(s / SEG) * 1920}`).join(' ')} />
            ))}
            {HL.map((y, i) => (
              <polyline key={`wh${y}`} points={new Array(SEG + 1).fill(0).map((_, s) => `${(s / SEG) * 1080},${y + amp * Math.sin((s / SEG) * 7 + i * 0.6 - t * 15)}`).join(' ')} />
            ))}
          </g>
        )}
      </svg>

      <div style={{...txt, color: C.cyan, transform: `${txt.transform} translateX(${-split}px)`, mixBlendMode: 'screen', opacity: 0.85}}>بتخسر</div>
      <div style={{...txt, color: C.yellow, transform: `${txt.transform} translateX(${split}px)`, mixBlendMode: 'screen', opacity: 0.85}}>بتخسر</div>
      <div style={{...txt, color: C.white, textShadow: `0 0 ${10 + 24 * warpA}px rgba(255,255,255,0.8)`}}>بتخسر</div>

      <div style={{position: 'absolute', left: 0, width: 1080, top: CY + 300, textAlign: 'center', direction: 'rtl', fontFamily: AR, fontWeight: 700, fontSize: 150, lineHeight: 1.1, color: C.yellow, opacity: l2, transform: `translateY(${(1 - l2) * 60}px)`, textShadow: `0 0 26px ${C.yellow}88`}}>وأنت مش داري!</div>

      <RiseText text="SYSTEM ALERT // DATA LOSS DETECTED" mono y={150} size={28} start={1.3} weight={500} color={C.mute} align="left" x={540} w={900} rise={20} />
      <RiseText text="ERRORS · NOISE · MISSING DATA · WRONG DECISIONS" mono y={1700} size={26} start={1.6} weight={500} color={C.yellow} x={540} w={960} rise={20} />

      {/* حلقة الثقب (تجويف الخاء) */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={CX} cy={CY} r={HOLE + 4} fill="none" stroke={C.cyan} strokeWidth={5} opacity={rim} />
        <circle cx={CX} cy={CY} r={HOLE + 16} fill="none" stroke={C.white} strokeWidth={1.5} opacity={0.5} strokeDasharray="5 9" />
        <circle cx={CX} cy={CY} r={HOLE + 32} fill="none" stroke={C.yellow} strokeWidth={1.5} opacity={0.35 * rim} />
      </svg>
      <div style={{position: 'absolute', left: 90, top: 190, width: 14, height: 14, borderRadius: 7, background: C.yellow, opacity: Math.floor(f / 8) % 2 ? 1 : 0.2}} />
    </>
  );
};
