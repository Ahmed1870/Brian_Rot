import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MONO} from '../fonts';
import {C, CX, CY, clamp, hash, ss} from '../theme';
import {HOLE} from '../camera';
import {RiseText} from '../components/RiseText';
import {Typed} from '../components/Typed';

const F = 300;
const face: React.CSSProperties = {
  position: 'absolute',
  width: F,
  height: F,
  boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.78)',
  backgroundColor: 'rgba(8,8,8,0.92)',
  backgroundImage: `linear-gradient(${C.hair} 1px, transparent 1px), linear-gradient(90deg, ${C.hair} 1px, transparent 1px)`,
  backgroundSize: '26px 26px',
  transformStyle: 'preserve-3d',
};

/** العالم 2: مكعب بيتفرد بطيّ هيدروليكي → لوحة تحكم شبكية + ليزر + رابط analytics. */
export const World2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const fold = (t0: number, damping = 12, stiffness = 60) => spring({frame: f - Math.round(t0 * fps), fps, config: {damping, stiffness, mass: 1.3}});
  const pD = fold(8.4);
  const pU = fold(8.6);
  const pL = fold(8.8);
  const pR = fold(9.0);
  const pB = fold(9.3);
  const avg = clamp((pD + pU + pL + pR + pB) / 5, 0, 1);
  const content = ss(9.5, 10.4, t);
  const rx = -26 * (1 - avg) + 4 * Math.sin(t * 2) * (1 - avg);
  const ry = -34 * (1 - avg) + 25 * Math.sin(t * 1.6) * (1 - avg);
  const zc = (F / 2) * (1 - avg);
  const laser = ss(9.8, 10.6, t);
  const sweepY = CY - 560 + ((t * 420) % 1120);

  const Bars = () => (
    <svg width={F} height={F} viewBox="0 0 260 260" style={{opacity: content}}>
      <text x={14} y={26} fontFamily={MONO} fontSize={16} fill={C.mute}>REVENUE LEAK</text>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const h = 40 + 130 * (0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.3)) * ss(10, 11, t);
        return <rect key={i} x={22 + i * 36} y={230 - h} width={22} height={h} fill={i === 4 ? C.yellow : C.white} />;
      })}
    </svg>
  );
  const Line = () => (
    <svg width={F} height={F} viewBox="0 0 260 260" style={{opacity: content}}>
      <text x={14} y={26} fontFamily={MONO} fontSize={16} fill={C.mute}>FORECAST</text>
      <polyline fill="none" stroke={C.cyan} strokeWidth={4} points={new Array(10).fill(0).map((_, i) => `${20 + i * 24},${190 - i * 9 - 18 * Math.sin(i * 1.3 + t * 2)}`).join(' ')} />
      <circle cx={20 + ((t * 3) % 9) * 24} cy={150} r={7} fill={C.yellow} />
    </svg>
  );
  const Gauge = () => (
    <svg width={F} height={F} viewBox="0 0 260 260" style={{opacity: content}}>
      <text x={14} y={26} fontFamily={MONO} fontSize={16} fill={C.mute}>HEALTH</text>
      <circle cx={130} cy={140} r={78} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={14} />
      <circle cx={130} cy={140} r={78} fill="none" stroke={C.yellow} strokeWidth={14} strokeDasharray={`${490 * 0.74 * ss(10, 11.5, t)} 600`} transform="rotate(-90 130 140)" />
      <text x={130} y={152} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill={C.white}>{Math.round(74 * ss(10, 11.5, t))}%</text>
    </svg>
  );
  const Lights = () => (
    <svg width={F} height={F} viewBox="0 0 260 260" style={{opacity: content}}>
      <text x={14} y={26} fontFamily={MONO} fontSize={16} fill={C.mute}>SYSTEMS</text>
      {new Array(6).fill(0).map((_, i) => (
        <g key={i}>
          <circle cx={36} cy={62 + i * 32} r={9} fill={hash(Math.floor(t * 2), i, 1) > 0.35 ? C.cyan : C.yellow} />
          <rect x={62} y={56 + i * 32} width={40 + hash(i, 3, 3) * 120} height={10} fill="rgba(255,255,255,0.7)" />
        </g>
      ))}
    </svg>
  );
  const Term = () => (
    <svg width={F} height={F} viewBox="0 0 260 260" style={{opacity: content}}>
      {['> rescue --business', '> fix leaks ........ OK', '> clean data ....... OK', '> build dashboards . OK', '> decide faster'].map((l, i) => (
        <text key={i} x={14} y={44 + i * 28} fontFamily={MONO} fontSize={15} fill={i === 4 ? C.yellow : C.white}>{l}</text>
      ))}
    </svg>
  );
  const Center = () => (
    <svg width={F} height={F} viewBox="0 0 260 260" style={{opacity: content}}>
      <path d="M20 60 V20 H60 M200 20 H240 V60 M240 200 V240 H200 M60 240 H20 V200" fill="none" stroke={C.yellow} strokeWidth={4} />
      <text x={130} y={236} textAnchor="middle" fontFamily={MONO} fontSize={15} fill={C.mute}>LASER ALIGN</text>
      <circle cx={130} cy={130} r={HOLE + 8} fill="none" stroke={C.yellow} strokeWidth={4} />
      <circle cx={130} cy={130} r={HOLE + 22} fill="none" stroke={C.white} strokeWidth={1.5} strokeDasharray="4 8" />
    </svg>
  );

  return (
    <>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g stroke={C.white} strokeWidth={1.2} opacity={0.07}>
          {new Array(13).fill(0).map((_, i) => (
            <line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={1920} />
          ))}
          {new Array(22).fill(0).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 90} x2={1080} y2={i * 90} />
          ))}
        </g>
      </svg>

      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, perspective: 2000, perspectiveOrigin: `${CX}px ${CY}px`}}>
        <div style={{position: 'absolute', left: CX, top: CY, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translateZ(${zc}px) rotateX(${rx}deg) rotateY(${ry}deg)`}}>
          <div style={{...face, left: -F / 2, top: -F / 2}}>
            <Center />
            <div style={{...face, left: 0, top: -F, transformOrigin: '50% 100%', transform: `rotateX(${90 * (1 - pU)}deg)`}}>
              <Bars />
            </div>
            <div style={{...face, left: 0, top: F, transformOrigin: '50% 0%', transform: `rotateX(${-90 * (1 - pD)}deg)`}}>
              <Line />
              <div style={{...face, left: 0, top: F, transformOrigin: '50% 0%', transform: `rotateX(${-90 * (1 - pB)}deg)`}}>
                <Term />
              </div>
            </div>
            <div style={{...face, left: -F, top: 0, transformOrigin: '100% 50%', transform: `rotateY(${-90 * (1 - pL)}deg)`}}>
              <Gauge />
            </div>
            <div style={{...face, left: F, top: 0, transformOrigin: '0% 50%', transform: `rotateY(${90 * (1 - pR)}deg)`}}>
              <Lights />
            </div>
          </div>
        </div>
      </div>

      {/* خطوط الليزر والمحاذاة */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, opacity: laser}}>
        <line x1={CX - 540 * laser} y1={CY} x2={CX + 540 * laser} y2={CY} stroke={C.yellow} strokeWidth={2} style={{filter: `drop-shadow(0 0 8px ${C.yellow})`}} />
        <line x1={CX} y1={CY - 800 * laser} x2={CX} y2={CY + 800 * laser} stroke={C.yellow} strokeWidth={2} style={{filter: `drop-shadow(0 0 8px ${C.yellow})`}} />
        {new Array(21).fill(0).map((_, i) => (
          <line key={i} x1={CX - 520 + i * 52} y1={CY - 10} x2={CX - 520 + i * 52} y2={CY + 10} stroke={C.white} strokeWidth={2} opacity={0.6} />
        ))}
        <rect x={90} y={sweepY} width={900} height={3} fill={C.cyan} opacity={0.55} />
      </svg>

      <Typed text="BUSINESS RESCUE & DATA ANALYTICS" y={228} size={44} start={8.9} cps={34} />
      <div style={{position: 'absolute', left: 90, top: 290, width: 900 * ss(9.6, 10.4, t), height: 5, background: C.yellow}} />
      <RiseText text="B2B SERVICES  ·  RESTRUCTURING  ·  DASHBOARDS" mono y={318} size={26} start={9.9} weight={500} color={C.cyan} />
      <Typed text="analytics.gomaaintelligence.me" y={1520} size={52} start={10.8} cps={17} fill={C.yellow} />
      <RiseText text="خدمات احترافية لإنقاذ وتطوير شغلك بالبيانات" y={1600} size={46} start={12.9} weight={700} color={C.white} />
    </>
  );
};
