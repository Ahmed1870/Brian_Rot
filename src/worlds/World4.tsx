import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AR, MONO} from '../fonts';
import {C, CX, clamp, ss} from '../theme';
import {Logo} from '../components/Logo';
import {RiseText} from '../components/RiseText';

const SEAL_Y = 625;
const BADGE_Y = 1010;
const TAU = Math.PI * 2;

const ROWS = [
  {label: 'الخدمات', value: 'analytics.gomaaintelligence.me', t: 28.0, y: 1215},
  {label: 'التعليم', value: 'solutions.gomaaintelligence.me', t: 28.4, y: 1290},
  {label: 'السوشيال ميديا', value: '@monzoma.digital', t: 28.8, y: 1365},
  {label: 'الواتساب المباشر', value: '+20 1019672878', t: 29.4, y: 1490},
];

/** العالم 4: ختم هولوجرامي + بيانات البراند + أيقونة التعليقات 3D "اكتب مهتم". */
export const World4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const sealP = spring({frame: f - Math.round(26.7 * fps), fps, config: {damping: 14, stiffness: 90}});
  const flick = 0.88 + 0.12 * Math.sin(f * 2.9) * Math.sin(f * 0.7);
  const bp = spring({frame: f - Math.round(30.0 * fps), fps, config: {damping: 9, stiffness: 140, mass: 0.9}});
  const pulse = t > 30 ? 1 + 0.025 * Math.sin((t - 30) * 6) : 1;
  const sway = 10 * Math.sin(t * 1.7);
  const burstK = clamp((t - 30.0) / 0.6);

  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: 'radial-gradient(ellipse at 50% 35%, rgba(0,240,255,0.14), rgba(0,0,0,0) 55%)'}} />

      {/* الختم الهولوجرامي */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, opacity: clamp(sealP * 1.5) * flick, transform: `scale(${0.7 + 0.3 * Math.min(sealP, 1.1)})`, transformOrigin: `${CX}px ${SEAL_Y}px`}}>
        <g transform={`rotate(${t * 22} ${CX} ${SEAL_Y})`}>
          <circle cx={CX} cy={SEAL_Y} r={215} fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="3 14" opacity={0.7} />
        </g>
        <g transform={`rotate(${-t * 40} ${CX} ${SEAL_Y})`}>
          <circle cx={CX} cy={SEAL_Y} r={190} fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.85} style={{filter: `drop-shadow(0 0 10px ${C.cyan})`}} />
          {new Array(72).fill(0).map((_, i) => {
            const a = (i / 72) * TAU;
            const long = i % 6 === 0;
            return <line key={i} x1={CX + Math.cos(a) * 196} y1={SEAL_Y + Math.sin(a) * 196} x2={CX + Math.cos(a) * (long ? 214 : 206)} y2={SEAL_Y + Math.sin(a) * (long ? 214 : 206)} stroke={C.cyan} strokeWidth={long ? 3 : 1.5} opacity={0.8} />;
          })}
        </g>
        <g transform={`rotate(${t * 70} ${CX} ${SEAL_Y})`}>
          {[0, 120, 240].map((a) => (
            <path key={a} d={`M ${CX + 165 * Math.cos((a * Math.PI) / 180)} ${SEAL_Y + 165 * Math.sin((a * Math.PI) / 180)} A 165 165 0 0 1 ${CX + 165 * Math.cos(((a + 70) * Math.PI) / 180)} ${SEAL_Y + 165 * Math.sin(((a + 70) * Math.PI) / 180)}`} fill="none" stroke={C.yellow} strokeWidth={7} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${C.yellow})`}} />
          ))}
        </g>
        <Logo uid="s-c" inline white x={CX - 4} y={SEAL_Y} scale={0.55} reveal={ss(26.9, 27.9, t)} shine={-1} opacity={0.5} />
        <Logo uid="s-y" inline white x={CX + 4} y={SEAL_Y} scale={0.55} reveal={ss(26.9, 27.9, t)} shine={-1} opacity={0.3} />
        <Logo uid="s-w" inline white x={CX} y={SEAL_Y} scale={0.55} reveal={ss(26.9, 27.9, t)} shine={-0.3 + 1.6 * ss(28.0, 28.9, t)} />
        <defs>
          <clipPath id="seal-clip">
            <circle cx={CX} cy={SEAL_Y} r={215} />
          </clipPath>
        </defs>
        <g clipPath="url(#seal-clip)" opacity={0.28}>
          {new Array(36).fill(0).map((_, i) => (
            <rect key={i} x={CX - 220} y={SEAL_Y - 220 + i * 12 + ((t * 40) % 12)} width={440} height={2} fill={C.cyan} />
          ))}
        </g>
      </svg>

      <RiseText text="أحمد جمعة | Ahmed Gomaa" y={125} size={64} start={26.9} color={C.white} />
      <RiseText text="DATA ANALYST" mono y={205} size={34} start={27.1} color={C.cyan} weight={500} />
      <RiseText text="Monzoma Digital" y={252} size={84} start={27.3} color={C.yellow} glow={`${C.yellow}88`} />

      {/* بيانات البراند */}
      {ROWS.map((r) => {
        const p = spring({frame: f - Math.round(r.t * fps), fps, config: {damping: 14, stiffness: 120}});
        if (p <= 0) return null;
        return (
          <div key={r.label} style={{position: 'absolute', left: 90, top: r.y, width: 900, height: 64, opacity: clamp(p * 2), transform: `translateX(${(1 - Math.min(p, 1)) * 120}px)`, display: 'flex', direction: 'rtl', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.18)'}}>
            <span style={{fontFamily: AR, fontWeight: 700, fontSize: 36, color: C.yellow}}>{r.label}</span>
            <span style={{fontFamily: MONO, fontWeight: 700, fontSize: r.value.length > 26 ? 30 : 34, color: C.white, direction: 'ltr'}}>{r.value}</span>
          </div>
        );
      })}
      <RiseText text="TikTok  |  YouTube  |  Instagram  |  Facebook" mono y={1432} size={27} start={29.0} weight={500} color={C.cyan} />

      {/* أيقونة التعليقات ثلاثية الأبعاد */}
      {bp > 0.001 && (
        <>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, opacity: 1 - burstK}}>
            {new Array(24).fill(0).map((_, i) => {
              const a = (i / 24) * TAU;
              const r0 = 150 + 500 * burstK;
              const r1 = r0 + 90 + 160 * burstK;
              return <line key={i} x1={CX + Math.cos(a) * r0} y1={BADGE_Y + Math.sin(a) * r0 * 0.8} x2={CX + Math.cos(a) * r1} y2={BADGE_Y + Math.sin(a) * r1 * 0.8} stroke={i % 2 ? C.yellow : C.white} strokeWidth={i % 3 === 0 ? 6 : 3} strokeLinecap="round" />;
            })}
          </svg>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, perspective: 1600, perspectiveOrigin: `${CX}px ${BADGE_Y}px`}}>
            <div style={{position: 'absolute', left: CX - 430, top: BADGE_Y - 125, width: 860, height: 250, transformStyle: 'preserve-3d', transform: `rotateY(${sway}deg) rotateX(${-4 + 3 * Math.sin(t * 1.3)}deg) scale(${Math.min(bp, 1.12) * pulse})`}}>
              {[7, 6, 5, 4, 3, 2, 1].map((z) => (
                <div key={z} style={{position: 'absolute', inset: 0, borderRadius: 84, background: z > 4 ? '#7A6C00' : '#B89F00', transform: `translateZ(${-z * 6}px)`}} />
              ))}
              <div style={{position: 'absolute', inset: 0, borderRadius: 84, background: C.yellow, boxShadow: `0 0 60px ${C.yellow}aa`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, direction: 'rtl'}}>
                <div style={{fontFamily: AR, fontWeight: 700, fontSize: 66, lineHeight: 1.15, color: C.ink, textAlign: 'center'}}>
                  اكتب <span style={{background: C.ink, color: C.yellow, padding: '0 20px', borderRadius: 18}}>"مهتم"</span> في التعليقات
                </div>
              </div>
              <div style={{position: 'absolute', left: 90, top: 236, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderTop: `64px solid ${C.yellow}`, transform: 'translateZ(0px)'}} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
