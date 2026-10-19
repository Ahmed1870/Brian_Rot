import React from 'react';
import {C, SCENES} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, ramp, sp, SP} from '../lib/anim';
import {IsoBoxes, IsoFloor} from '../lib/IsoView';
import {isoP} from '../lib/iso';
import {ISO3, MEAN3, MEDIAN, SORTED, s3Boxes} from '../lib/scenegeo';
import {Burst, Ring, SceneShell} from '../lib/ui';
import {GlassBadge} from './GlassBadge';

const BEAM = 936;

const Step: React.FC<{f: number; at: number; n: string; t: string}> = ({f, at, n, t}) => {
  const s = sp(f, SP.pop, at);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 22px 8px 26px', borderRadius: 999, border: `2px solid ${C.emerald}`, background: 'rgba(16,185,129,0.12)',
      fontFamily: CAIRO, fontWeight: 900, fontSize: 30, color: C.text, direction: 'rtl', opacity: clamp(s * 3), transform: `scale(${Math.max(0, s)})`}}>
      <span style={{width: 38, height: 38, borderRadius: '50%', background: C.emerald, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26}}>{n}</span>{t}
    </div>
  );
};

/** Frames 786-1110: sort the numbers, cut the middle card with an emerald beam, reveal the Median. */
export const Scene3_MedianSolution: React.FC<{f: number}> = ({f}) => {
  const o = ISO3;
  const boxes = s3Boxes(f);
  const beam = ramp(f, BEAM, BEAM + 24);
  const flick = 0.85 + 0.15 * Math.sin(f * 0.8);
  const medX = 3 * 150 + 50;
  const top = isoP(medX, MEDIAN * 0.8, 50, o);
  const res = sp(f, SP.pop, 1000);
  const lines = ramp(f, 962, 990);
  const meanA = isoP(-60, MEAN3 * 0.8, 50, o), meanB = isoP(1000, MEAN3 * 0.8, 50, o);
  const medA = isoP(-60, MEDIAN * 0.8, 50, o), medB = isoP(1000, MEDIAN * 0.8, 50, o);
  const outTop = isoP(6 * 150 + 50, 520 * 0.8, 50, o);
  return (
    <SceneShell dur={SCENES.s3.dur} fadeIn={12} fadeOut={12}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: ramp(f, 792, 808), transform: `scale(${0.8 + 0.2 * Math.min(1, sp(f, SP.pop, 792))})`}}>
        <GlassBadge title="الوسيط · Median" sub="الرقم اللي في النص بالضبط" accent={C.emerald} titleSize={66} subSize={32} f={f} radius={56} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', padding: '0 40px'}}>
        {f >= 826 ? <Step f={f} at={826} n="1" t="رتّب الأرقام" /> : null}
        {f >= 936 ? <Step f={f} at={936} n="2" t="خد اللي في النص" /> : null}
        {f >= 990 ? <Step f={f} at={990} n="3" t="تجاهل الشاذ" /> : null}
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id="s3beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.emerald} stopOpacity="0" /><stop offset="1" stopColor={C.emerald} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <IsoFloor o={o} x0={-100} x1={1100} z0={-100} z1={200} step={150} op={0.85} />
        {lines > 0 ? (
          <>
            <line x1={meanA[0]} y1={meanA[1]} x2={meanB[0]} y2={meanB[1]} stroke={C.coral} strokeWidth={4} strokeDasharray="14 10" opacity={lines} />
            <line x1={medA[0]} y1={medA[1]} x2={medB[0]} y2={medB[1]} stroke={C.emerald} strokeWidth={5} opacity={lines} />
          </>
        ) : null}
        <IsoBoxes boxes={boxes} o={o} />
        {beam > 0 ? (
          <g opacity={flick}>
            <rect x={top[0] - 60} y={560} width={120} height={Math.max(0, (top[1] - 560) * beam)} fill="url(#s3beam)" opacity={0.28} />
            <rect x={top[0] - 22} y={560} width={44} height={Math.max(0, (top[1] - 560) * beam)} fill="url(#s3beam)" opacity={0.55} />
            <rect x={top[0] - 5} y={560} width={10} height={Math.max(0, (top[1] - 560) * beam)} fill="#ECFDF5" />
            <circle cx={top[0]} cy={top[1]} r={24 + 8 * Math.sin(f / 4)} fill="#ECFDF5" opacity={beam} />
          </g>
        ) : null}
        <Ring f={f} start={BEAM + 20} x={top[0]} y={top[1]} max={190} life={26} color={C.emerald} w={7} />
        <Burst f={f} start={BEAM + 20} x={top[0]} y={top[1]} count={40} speed={22} life={36} size={5} gravity={0.18} seed={13} colors={[C.emerald, '#A7F3D0', C.text]} />
      </svg>
      {/* value labels */}
      {SORTED.map((v, i) => {
        const p = isoP(i * 150 + 50, v * 0.8, 50, o);
        const isMed = i === 3, isOut = v === 520;
        return f >= 880 ? (
          <div key={i} style={{position: 'absolute', left: p[0] - 60, top: p[1] - 62, width: 120, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: isMed ? 40 : 30,
            color: isMed && beam > 0.3 ? C.emerald : isOut && beam > 0.3 ? C.coral : C.text, opacity: ramp(f, 890, 910)}}>{v}K</div>
        ) : null;
      })}
      {f >= 964 ? <div style={{position: 'absolute', left: outTop[0] - 70, top: outTop[1] - 118, width: 140, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900, fontSize: 34, color: C.coral, opacity: ramp(f, 964, 984)}}>شاذ ✕</div> : null}
      {lines > 0 ? (
        <>
          <div style={{position: 'absolute', left: meanB[0] - 250, top: meanB[1] - 66, padding: '2px 18px', borderRadius: 999, background: C.coral, fontFamily: CAIRO, fontWeight: 900, fontSize: 28, color: C.text, opacity: lines}}>Mean {Math.round(MEAN3)}K</div>
          <div style={{position: 'absolute', left: medB[0] - 250, top: medB[1] + 8, padding: '2px 18px', borderRadius: 999, background: C.emerald, fontFamily: CAIRO, fontWeight: 900, fontSize: 28, color: C.bg, opacity: lines}}>Median {MEDIAN}K</div>
        </>
      ) : null}
      {/* result */}
      {f >= 1000 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', opacity: clamp(res * 3), transform: `scale(${0.7 + 0.3 * Math.min(1.08, res)})`}}>
          <GlassBadge title={`الوسيط = ${MEDIAN}K EGP`} sub="الحقيقة الصافية بدون تضليل" accent={C.emerald} titleSize={62} subSize={32} f={f} radius={48} />
        </div>
      ) : null}
    </SceneShell>
  );
};
