import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, S, S1_FALL, S1_LEAVE} from '../theme';
import {KText, Scene, Stack, prog} from '../components/common';

const COLS = 5;
const arrows = Array.from({length: 10}, (_, i) => ({
  x: 190 + (i % COLS) * 175,
  y: i < COLS ? 880 : 1080,
  rest: 1270,
  stagger: (i % COLS) * 6 + (i < COLS ? 0 : 10),
  rot: (i % 2 ? 1 : -1) * (25 + i * 7),
}));

const Arrow: React.FC<{x: number; y: number; color: string; rot?: number}> = ({x, y, color, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <line x1={0} y1={55} x2={0} y2={-25} stroke={color} strokeWidth={14} strokeLinecap="round" />
    <polyline points="-32,-8 0,-52 32,-8" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const away = Easing.in(Easing.cubic)(prog(f, S1_LEAVE, S1_LEAVE + 90));
  const sway = f < S1_LEAVE ? Math.sin(f * 0.22) * 16 : 0;
  const mx = 540 + sway + away * 760;
  const my = 640 + (f < S1_LEAVE ? Math.abs(Math.sin(f * 0.22)) * -8 : 0);
  const strings = f < S1_FALL - 20;

  return (
    <Scene dur={S.s1.dur}>
      {/* title zone: y 100 - 430 */}
      <Stack top={100} gap={10}>
        <KText at={5} size={84}>بتدير الموظفين بنفسك؟</KText>
        <KText at={30} size={58} color={C.red}>فخ الإدارة التفصيلية</KText>
        <KText at={45} size={36} color={C.dim} weight={700} ltr>Micro-Management</KText>
      </Stack>

      {/* diagram zone: y 500 - 1320 */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* strings */}
        {strings &&
          arrows.map((a, i) => {
            const lift = f < S1_LEAVE ? Math.max(0, Math.sin(f * 0.2 - i * 0.7)) * 16 : 0;
            return (
              <line key={'s' + i} x1={mx} y1={my + 50} x2={a.x} y2={a.y - 70 - lift} stroke={C.slate} strokeWidth={3} opacity={0.8} strokeDasharray={f > S1_LEAVE ? '8 8' : undefined} />
            );
          })}

        {/* manager (flat figure) */}
        <g transform={`translate(${mx} ${my})`}>
          <circle cx={0} cy={0} r={36} fill={C.white} />
          <path d="M -62 120 Q -62 52 0 52 Q 62 52 62 120 Z" fill={C.white} />
          <line x1={-50} y1={78} x2={-90} y2={40} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
          <line x1={50} y1={78} x2={90} y2={40} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
        </g>

        {/* 10 arrows = 10 employees */}
        {arrows.map((a, i) => {
          const lift = f < S1_LEAVE ? Math.max(0, Math.sin(f * 0.2 - i * 0.7)) * 16 : 0;
          const t = Math.max(0, f - S1_FALL - a.stagger);
          const maxDy = a.rest - a.y;
          const dy = Math.min(maxDy, 0.07 * t * t);
          const k = Math.min(1, dy / maxDy);
          const fell = t > 0;
          const appear = prog(f, 20 + i * 4, 40 + i * 4);
          return (
            <g key={i} opacity={appear}>
              <Arrow x={a.x} y={a.y - lift + dy} color={fell ? C.red : C.white} rot={a.rot * k} />
            </g>
          );
        })}
        <line x1={90} y1={1330} x2={990} y2={1330} stroke={C.slate} strokeWidth={3} opacity={prog(f, S1_FALL, S1_FALL + 30)} />
      </svg>

      {/* text zone: y 1400+ */}
      <Stack top={1400} gap={16}>
        <KText at={150} size={46} color={C.dim} weight={700}>مقتنع إن الشغل مش هيتم إلا بإشرافك؟</KText>
        <KText at={S1_FALL + 40} size={62} color={C.red}>المنظومة بتقف أول ما المدير يغيب!</KText>
        <KText at={S1_FALL + 160} size={44} color={C.white} weight={700}>
          إدارة مباشرة = وقت قيادة مهدور + فريق هش
        </KText>
      </Stack>
    </Scene>
  );
};
