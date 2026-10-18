import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CAIRO} from '../fonts';
import {C, CX, clamp, eo, hash, ss, TIME} from '../theme';
import {Logo} from './Logo';

const RC = {x: CX, y: 700};
const RR = 230;
const TAU = Math.PI * 2;
const RING = `M ${RC.x} ${RC.y - RR} A ${RR} ${RR} 0 1 1 ${RC.x - 0.001} ${RC.y - RR}`;
const GAP = 0.72; // الحلقة ناقصة (72% من الحقيقة)

const rise = (p: number, dy = 50): React.CSSProperties => ({opacity: clamp(p * 2), transform: `translateY(${(1 - Math.min(p, 1)) * dy}px)`, filter: `blur(${Math.max(0, 1 - p) * 8}px)`});

/** المشهد 3: الأحمر بينكمش في حلقة تركيز ناقصة (72%) → "المعلومة الناقصة" → الحلقة بتكتمل زمردي = ختم Monzoma Digital + بادج الرابط. */
export const Resolution: React.FC<{t: number}> = ({t}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (s: number, damping = 14, stiffness = 110) => spring({frame: f - Math.round(s * fps), fps, config: {damping, stiffness}});

  if (t < 9.1) return null;

  const ringIn = eo((t - 9.6) / 0.9);
  const ringScale = 0.6 + 0.4 * ringIn;
  const redDraw = GAP * eo((t - 9.7) / 0.8);
  const sealP = eo((t - TIME.seal) / 0.9);
  const redFade = 1 - sealP;
  const pct = t < TIME.seal ? Math.round(72 * eo((t - 9.8) / 0.8)) : Math.round(72 + 28 * sealP);
  const pctOp = 1 - ss(12.3, 12.7, t);
  const lockFlash = t >= TIME.lock ? Math.exp(-(t - TIME.lock) * 5) : 0;
  const lockPulse = clamp((t - TIME.lock) / 0.6);
  const pctColor = t >= TIME.lock && t < TIME.seal + 0.3 ? C.red : t >= TIME.seal ? C.emerald : C.white;

  const textOut = 1 - ss(11.65, 12.05, t);
  const logoReveal = ss(12.3, 13.3, t);
  const shine = -0.4 + 1.8 * ss(13.5, 14.4, t) + (t > 16.4 ? 1.8 * ss(16.4, 17.3, t) - 1.8 : 0);
  const rot = ((t - 12.8) * 30) % 360;

  // خطوط حمرا متشتتة بتنسحب للحلقة
  const lines = new Array(34).fill(0).map((_, i) => {
    const a = hash(i, 1) * TAU;
    const r0 = 700 + hash(i, 2) * 900;
    const k = eo((t - 9.2 - hash(i, 3) * 0.25) / 0.55);
    const head = lerpN(r0, RR + 10, k);
    const tail = lerpN(r0 + 220, RR + 10, Math.max(0, k - 0.18));
    return {a, head, tail, op: (1 - ss(0.85, 1, k)) * (k > 0 ? 1 : 0), w: 2 + hash(i, 4) * 4};
  });

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
      {/* توهج الزمرد خلف الختم */}
      <div style={{position: 'absolute', left: RC.x - 700, top: RC.y - 700, width: 1400, height: 1400, borderRadius: 700, background: `radial-gradient(circle, rgba(16,185,129,${0.28 * sealP}), rgba(16,185,129,0) 62%)`}} />
      <div style={{position: 'absolute', left: RC.x - 640, top: RC.y - 640, width: 1280, height: 1280, borderRadius: 640, background: `radial-gradient(circle, rgba(239,68,68,${0.2 * redFade * ringIn}), rgba(239,68,68,0) 60%)`}} />

      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        {lines.map((l, i) =>
          l.op > 0.01 ? (
            <line key={i} x1={RC.x + Math.cos(l.a) * l.tail} y1={RC.y + Math.sin(l.a) * l.tail} x2={RC.x + Math.cos(l.a) * l.head} y2={RC.y + Math.sin(l.a) * l.head} stroke={C.red} strokeWidth={l.w} strokeLinecap="round" opacity={l.op * 0.85} />
          ) : null,
        )}
        <g transform={`translate(${RC.x} ${RC.y}) scale(${ringScale}) translate(${-RC.x} ${-RC.y})`} opacity={ringIn}>
          <circle cx={RC.x} cy={RC.y} r={RR} fill="rgba(15,23,42,0.55)" stroke="rgba(248,250,252,0.12)" strokeWidth={34} />
          <circle cx={RC.x} cy={RC.y} r={RR + 36} fill="none" stroke="rgba(248,250,252,0.08)" strokeWidth={2} />
          <path d={RING} fill="none" stroke={C.red} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={`${redDraw} 1`} opacity={redFade} style={{filter: 'drop-shadow(0 0 16px rgba(239,68,68,0.8))'}} />
          {t >= TIME.lock && t < TIME.seal + 0.4 && (
            <circle cx={RC.x + Math.cos(-Math.PI / 2 + GAP * TAU) * RR} cy={RC.y + Math.sin(-Math.PI / 2 + GAP * TAU) * RR} r={24 + 50 * lockPulse} fill="none" stroke={C.red} strokeWidth={5 * (1 - lockPulse) + 1} opacity={1 - lockPulse} />
          )}
          <path d={RING} fill="none" stroke={C.emerald} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={`${sealP} 1`} style={{filter: 'drop-shadow(0 0 18px rgba(16,185,129,0.85))'}} />
          {sealP > 0.98 && (
            <g transform={`rotate(${rot} ${RC.x} ${RC.y})`}>
              <path d={RING} fill="none" stroke="#ECFDF5" strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray="0.06 1" opacity={0.9} />
            </g>
          )}
        </g>
      </svg>

      {/* النسبة جوه الحلقة */}
      {pctOp > 0.01 && (
        <div style={{position: 'absolute', left: RC.x - 200, top: RC.y - 130, width: 400, textAlign: 'center', opacity: ringIn * pctOp, fontFamily: CAIRO, fontWeight: 900, fontSize: 150, lineHeight: 1.1, color: pctColor, direction: 'ltr', textShadow: `0 0 30px ${pctColor}88`, transform: `scale(${1 + 0.12 * lockFlash})`}}>
          {pct}%
          <div style={{fontSize: 34, fontWeight: 700, color: C.mute, direction: 'rtl', textShadow: 'none', marginTop: -6}}>من الحقيقة</div>
        </div>
      )}

      {/* اللوجو (الختم) */}
      {logoReveal > 0 && <Logo uid="seal" c1="#34D399" c2="#10B981" x={RC.x} y={RC.y} scale={0.64} reveal={logoReveal} shine={shine} opacity={clamp(logoReveal * 2)} />}

      {/* النص التحريري */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: textOut}}>
        {t >= 9.55 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1040, textAlign: 'center', direction: 'rtl', fontFamily: CAIRO, fontWeight: 900, fontSize: 124, lineHeight: 1.2, color: C.white, ...rise(sp(9.55))}}>أخطر معلومة</div>}
        {t >= 10.0 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1190, textAlign: 'center', direction: 'rtl', fontFamily: CAIRO, fontWeight: 700, fontSize: 68, lineHeight: 1.2, color: 'rgba(248,250,252,0.8)', ...rise(sp(10.0))}}>مش المعلومة الخاطئة..</div>}
        {t >= 10.98 && (
          <div style={{position: 'absolute', left: 0, width: 1080, top: 1300, textAlign: 'center', direction: 'rtl', fontFamily: CAIRO, fontWeight: 900, fontSize: 112, lineHeight: 1.2, color: C.red, textShadow: '0 0 40px rgba(239,68,68,0.7)', ...rise(sp(10.98, 11, 160), 30)}}>
            المعلومة <span style={{boxShadow: `0 6px 0 ${C.red}`}}>الناقصة!</span>
          </div>
        )}
      </div>

      {/* البراند */}
      {t >= 12.2 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1040, textAlign: 'center', direction: 'rtl', fontFamily: CAIRO, fontWeight: 900, fontSize: 118, lineHeight: 1.2, color: C.white, ...rise(sp(12.2))}}>منظومة ديجيتال</div>}
      {t >= 12.5 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1190, textAlign: 'center', direction: 'ltr', fontFamily: CAIRO, fontWeight: 700, fontSize: 52, letterSpacing: 8, color: C.emerald, ...rise(sp(12.5))}}>MONZOMA DIGITAL</div>}
      {t >= 12.7 && (
        <div style={{position: 'absolute', left: 130, top: 1384, width: 820, height: 112, borderRadius: 56, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, direction: 'ltr', background: 'linear-gradient(135deg, rgba(16,185,129,0.20), rgba(16,185,129,0.06))', boxShadow: `inset 0 0 0 2px rgba(16,185,129,0.6), 0 0 50px rgba(16,185,129,0.25)`, opacity: clamp(sp(12.7, 12, 140) * 2), transform: `scale(${0.85 + 0.15 * Math.min(sp(12.7, 12, 140), 1.1)})`}}>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 14 a4 4 0 0 0 5.7 0 l3-3 a4 4 0 0 0-5.7-5.7 l-1 1" />
            <path d="M14 10 a4 4 0 0 0-5.7 0 l-3 3 a4 4 0 0 0 5.7 5.7 l1-1" />
          </svg>
          <span style={{fontFamily: CAIRO, fontWeight: 700, fontSize: 40, color: C.white}}>analytics.gomaaintelligence.me</span>
          <div style={{position: 'absolute', top: -20, left: `${((((t - 13.6) * 0.35) % 1.3) - 0.2) * 100}%`, width: 120, height: 160, transform: 'rotate(18deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))'}} />
        </div>
      )}
    </div>
  );
};

function lerpN(a: number, b: number, k: number) {
  return a + (b - a) * k;
}
