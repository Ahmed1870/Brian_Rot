import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Bottom, Canvas, Fade, Kinetic, Show, Top, prog, sec} from '../kit';

// Scene 5 (frames 4950-5850, global 165-195s): the three-step alignment checklist.
const S = 165;
const CARDS = [
  {n: 1, l1: 'حدد الاختناق', l2: 'الأكبر حالياً', d: 'شخّص المرحلة التشغيلية لشركتك', g: 166.9, y: 20},
  {n: 2, l1: 'اختر مؤشراً واحداً', l2: 'يحل المشكلة', d: 'وشيل باقي الأرقام من الشاشة الرئيسية', g: 170.8, y: 310},
  {n: 3, l1: 'ارفع المؤشر حتى', l2: 'العتبة المطلوبة', d: 'اربط حوافز كل الفرق بتحريكه', g: 177.6, y: 600},
];

const Icon: React.FC<{n: number}> = ({n}) => (
  <g transform="translate(70 40)">
    {n === 1 && (
      <g fill="none" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="0,150 0,110 50,110 50,70 100,70 100,30" stroke={C.slate500} />
        <circle cx={100} cy={30} r={14} fill={C.crimson} stroke="none" />
      </g>
    )}
    {n === 2 && (
      <g fill="none" strokeWidth={6}>
        <circle cx={60} cy={80} r={64} stroke={C.slate600} />
        <circle cx={60} cy={80} r={38} stroke={C.slate600} />
        <circle cx={60} cy={80} r={14} fill={C.emerald} stroke="none" />
      </g>
    )}
    {n === 3 && (
      <g>
        <rect x={0} y={20} width={130} height={26} rx={13} fill={C.line} />
        <rect x={0} y={20} width={96} height={26} rx={13} fill={C.emerald} />
        <line x1={78} x2={78} y1={0} y2={66} stroke={C.white} strokeWidth={4} strokeDasharray="6 6" />
        <polyline points="20,130 60,100 90,116 130,84" fill="none" stroke={C.emerald} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </g>
);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Fade dur={900}>
      <Top>
        <Kinetic text="ضبط البوصلة في 3 خطوات" start={sec(165.4 - S)} size={80} />
        <Kinetic text="[[OMTM Alignment Checklist]]" start={sec(167 - S)} size={40} color={C.slate400} weight={600} />
      </Top>

      <Canvas>
        {CARDS.map((c) => {
          const p = prog(f, sec(c.g - S), 26);
          return (
            <g key={c.n} opacity={p} transform={`translate(0 ${c.y + (1 - p) * 50})`}>
              <rect x={40} y={0} width={1000} height={250} rx={26} fill={C.panel} stroke={C.line} strokeWidth={2} />
              <text x={1000} y={150} textAnchor="end" fontFamily={FONT} fontSize={130} fontWeight={700} fill={c.n === 2 ? C.emerald : C.slate600}>{c.n}</text>
              <text x={880} y={88} textAnchor="end" fontFamily={FONT} fontSize={50} fontWeight={700} fill={C.white}>{c.l1}</text>
              <text x={880} y={150} textAnchor="end" fontFamily={FONT} fontSize={50} fontWeight={700} fill={C.white}>{c.l2}</text>
              <text x={880} y={214} textAnchor="end" fontFamily={FONT} fontSize={32} fill={C.slate400}>{c.d}</text>
              <Icon n={c.n} />
            </g>
          );
        })}
      </Canvas>

      <Bottom>
        <Show from={sec(185 - S)}>
          <Kinetic text="لوحة تحكم تنفيذية تكشف لك الـ [[OMTM]] بأرقام {{لحظية}}" start={sec(185 - S)} size={58} />
        </Show>
      </Bottom>
    </Fade>
  );
};
