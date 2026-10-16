import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {AR, MONO} from '../fonts';
import {Logo} from './Logo';

const TAU = Math.PI * 2;
const glass = {fill: 'rgba(12,20,40,0.62)', stroke: 'rgba(255,255,255,0.24)', strokeWidth: 2} as const;

/** إطار الهوية الدائم: حدود نيون زجاجية + شريط علوي (لوجو + Online) + شريط سفلي + بادجات الجنب. كله دوري (لوب). */
export const HUD: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const pulse = 0.65 + 0.35 * Math.sin(TAU * sec); // 1Hz
  const sweep = ((f / 300) * 2) % 1; // لفّتين حوالين الإطار في 10 ثواني
  const ripple = sec % 1;

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="hud-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.cyan} />
          <stop offset="50%" stopColor={C.blue} />
          <stop offset="100%" stopColor={C.cyan} />
        </linearGradient>
      </defs>

      {/* حدود نيون زجاجية */}
      <rect x={20} y={20} width={1040} height={1880} rx={64} fill="none" stroke="url(#hud-grad)" strokeWidth={4} opacity={0.9} style={{filter: `drop-shadow(0 0 ${10 + 6 * pulse}px ${C.cyan})`}} />
      <rect x={20} y={20} width={1040} height={1880} rx={64} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="0.1 0.9" strokeDashoffset={-sweep} style={{filter: `drop-shadow(0 0 10px ${C.cyan})`}} />
      {[[44, 44, 1, 1], [1036, 44, -1, 1], [44, 1876, 1, -1], [1036, 1876, -1, -1]].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M ${x} ${y + sy * 64} V ${y} H ${x + sx * 64}`} fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
      ))}

      {/* الشريط العلوي: لوجو + Online */}
      <rect x={90} y={84} width={900} height={124} rx={42} {...glass} />
      <Logo uid="hud" inline x={176} y={150} scale={0.2} reveal={1} shine={-1} />
      <text x={262} y={140} fontFamily={AR} fontWeight={700} fontSize={40} fill={C.white}>
        Monzoma Digital
      </text>
      <text x={264} y={180} fontFamily={MONO} fontWeight={500} fontSize={25} fill={C.cyan} letterSpacing={1}>
        Gomaa Intelligence
      </text>
      <rect x={742} y={118} width={216} height={56} rx={28} fill="rgba(34,197,94,0.14)" stroke={C.green} strokeWidth={2} />
      <circle cx={782} cy={146} r={8 + 16 * ripple} fill="none" stroke={C.green} strokeWidth={2} opacity={1 - ripple} />
      <circle cx={782} cy={146} r={9} fill={C.green} style={{filter: `drop-shadow(0 0 ${6 + 6 * pulse}px ${C.green})`}} />
      <text x={808} y={156} fontFamily={MONO} fontWeight={500} fontSize={28} fill={C.white} letterSpacing={2}>
        ONLINE
      </text>

      {/* بادجات الجنب */}
      <g transform="translate(62 700) rotate(-90)">
        <rect x={-318} y={-36} width={636} height={72} rx={36} {...glass} stroke={C.cyan} opacity={0.95} />
        <text x={0} y={10} textAnchor="middle" fontFamily={MONO} fontWeight={500} fontSize={27} fill={C.white}>
          solutions.gomaaintelligence.me
        </text>
      </g>
      <g transform="translate(1018 700) rotate(90)">
        <rect x={-318} y={-36} width={636} height={72} rx={36} {...glass} stroke={C.gold} opacity={0.95} />
        <text x={0} y={10} textAnchor="middle" fontFamily={MONO} fontWeight={500} fontSize={27} fill={C.white}>
          analytics.gomaaintelligence.me
        </text>
      </g>

      {/* الشريط السفلي */}
      <rect x={90} y={1612} width={900} height={160} rx={44} {...glass} />
      <g transform="translate(168 1672)" fill="none" stroke={C.green} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M-22 -8 C-22 -22 -10 -26 -4 -24 L2 -12 L-6 -6 C-4 2 2 8 10 10 L16 2 L28 8 C28 18 22 24 10 22 C-8 20 -22 6 -22 -8 Z" transform="scale(0.9)" />
      </g>
      <text x={216} y={1692} fontFamily={MONO} fontWeight={500} fontSize={50} fill={C.white} letterSpacing={1}>
        +20 1019672878
      </text>
      <text x={540} y={1744} textAnchor="middle" fontFamily={MONO} fontWeight={500} fontSize={29} fill={C.cyan} opacity={0.75 + 0.25 * pulse}>
        @monzoma.digital  /  @monzoma_digital
      </text>
    </svg>
  );
};
