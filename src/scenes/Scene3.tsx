import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, S, S3_FIX} from '../theme';
import {KText, Scene, Stack, prog} from '../components/common';

const CX = 540, CY = 860, R = 270;
const P = (deg: number, r = R) => ({x: CX + r * Math.cos((deg * Math.PI) / 180), y: CY + r * Math.sin((deg * Math.PI) / 180)});
const nodes = [
  {deg: -90, at: 60, label: 'أداء الموظف', n: '1'},
  {deg: 30, at: 140, label: 'قياس لحظي', n: '2'},
  {deg: 150, at: 220, label: 'تصحيح تلقائي', n: '3'},
];
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const fix = prog(f, S3_FIX, S3_FIX + 90); // 0 -> 1 turns green
  const col = mix([220, 20, 60], [16, 185, 129], fix);

  // deviation: dot drifts away from the loop (red phase), then is pulled back instantly (green phase)
  const dev = interpolate(f, [260, 480, S3_FIX + 80], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ang = -90 + (f * 2.2) % 360;
  const dotR = R + dev * (60 + 40 * Math.sin(f * 0.15));
  const dot = P(ang, dotR);
  const loopOp = prog(f, 40, 70);

  return (
    <Scene dur={S.s3.dur}>
      <Stack top={90} gap={8}>
        <KText at={5} size={68}>التغذية الراجعة اللحظية</KText>
        <KText at={25} size={36} color={C.dim} weight={700} ltr>Instant Feedback Loops</KText>
      </Stack>

      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} opacity={loopOp}>
        {/* arcs between nodes */}
        {nodes.map((nd, i) => {
          const a = P(nd.deg + 12);
          const b = P(nd.deg + 108);
          const tip = nd.deg + 108;
          const t = P(tip);
          return (
            <g key={i}>
              <path d={`M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeDasharray={fix < 1 ? '4 18' : undefined} />
              <polygon points="-20,-16 20,0 -20,16" fill={col} transform={`translate(${t.x} ${t.y}) rotate(${tip + 90})`} />
            </g>
          );
        })}

        {/* deviation ghost: where the dot should be */}
        {dev > 0.05 && <circle cx={P(ang).x} cy={P(ang).y} r={10} fill="none" stroke={C.slate} strokeWidth={3} />}
        {dev > 0.05 && <line x1={P(ang).x} y1={P(ang).y} x2={dot.x} y2={dot.y} stroke={C.red} strokeWidth={3} strokeDasharray="6 6" />}
        <circle cx={dot.x} cy={dot.y} r={20} fill={dev > 0.05 ? C.red : col} />

        {/* nodes */}
        {nodes.map((nd, i) => {
          const p = P(nd.deg);
          const o = prog(f, nd.at, nd.at + 20);
          return (
            <g key={i} opacity={o}>
              <circle cx={p.x} cy={p.y} r={46} fill={C.bg} stroke={col} strokeWidth={8} />
              <text x={p.x} y={p.y + 17} textAnchor="middle" fontSize={50} fontWeight={900} fill={C.white}>{nd.n}</text>
            </g>
          );
        })}

        {/* labels OUTSIDE the loop */}
        <text x={540} y={P(-90).y - 78} textAnchor="middle" fontSize={50} fontWeight={900} fill={C.white} opacity={prog(f, 60, 80)}>أداء الموظف</text>
        <text x={P(30).x} y={P(30).y + 100} textAnchor="middle" fontSize={46} fontWeight={900} fill={C.white} opacity={prog(f, 140, 160)}>قياس لحظي</text>
        <text x={P(150).x} y={P(150).y + 100} textAnchor="middle" fontSize={46} fontWeight={900} fill={C.white} opacity={prog(f, 220, 240)}>تصحيح تلقائي</text>

        {/* center status (inside the loop, away from nodes) */}
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize={60} fontWeight={900} fill={col}>{fix < 1 ? 'انحراف' : 'منتظم'}</text>
        <text x={CX} y={CY + 62} textAnchor="middle" fontSize={32} fontWeight={700} fill={C.dim}>{fix < 1 ? 'يُكتشف آخر الشهر' : 'يُصحَّح في ساعته'}</text>
      </svg>

      <Stack top={1340} gap={16}>
        <KText at={80} size={46} color={C.dim} weight={700}>بدل ما تستنى آخر الشهر عشان تحاسبهم</KText>
        <KText at={380} size={56} color={C.white}>النظام بيكشف الانحراف في ساعته</KText>
        <KText at={S3_FIX} size={64} color={C.green}>ويصلّحه تلقائياً</KText>
        <KText at={800} size={44} color={C.white} weight={700}>الموظف شايف أثر شغله لحظياً = تحكم ذاتي</KText>
      </Stack>
    </Scene>
  );
};
