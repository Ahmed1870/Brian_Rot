import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S, S4_UNLOCK} from '../theme';
import {KText, Scene, Stack, prog} from '../components/common';

const WX = 810; // wrong path column (right)
const RX = 270; // right path column (left)
const wrong = [
  [WX, 480], [WX, 540], [WX + 130, 620], [WX - 130, 720], [WX + 130, 820], [WX - 130, 920], [WX, 1010], [WX, 1090],
];
const lenOf = (pts: number[][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const pointAt = (pts: number[][], u: number) => {
  let d = u * lenOf(pts);
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= seg) return {x: pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * d) / seg, y: pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * d) / seg};
    d -= seg;
  }
  return {x: pts[pts.length - 1][0], y: pts[pts.length - 1][1]};
};

const Lock: React.FC<{x: number; y: number; open: boolean; color: string}> = ({x, y, open, color}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-44} y={0} width={88} height={70} rx={10} fill={color} />
    <path d={open ? 'M -26 0 L -26 -26 A 26 26 0 0 1 26 -26' : 'M -26 0 L -26 -30 A 26 26 0 0 1 26 -30 L 26 0'} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
    <circle cx={0} cy={35} r={8} fill={C.bg} />
  </g>
);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const unlocked = f >= S4_UNLOCK;
  const appear = prog(f, 40, 80);

  return (
    <Scene dur={S.s4.dur}>
      <Stack top={90} gap={8}>
        <KText at={5} size={64}>هندسة بيئة العمل</KText>
        <KText at={25} size={36} color={C.dim} weight={700} ltr>Choice Architecture</KText>
      </Stack>

      {/* column headers: y 330 */}
      <div className="absolute w-full flex" style={{top: 330, direction: 'rtl', opacity: appear}}>
        <div style={{width: 540, textAlign: 'center', fontSize: 44, fontWeight: 900, color: C.red}}>مسار معقد = مقفول</div>
        <div style={{width: 540, textAlign: 'center', fontSize: 44, fontWeight: 900, color: C.white}}>مسار مباشر = مفتوح</div>
      </div>

      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} opacity={appear}>
        {/* WRONG path */}
        <polyline points={wrong.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.red} strokeWidth={8} strokeLinejoin="round" strokeDasharray="2 14" strokeLinecap="round" />
        {[[WX + 60, 620], [WX - 60, 720], [WX + 60, 820], [WX - 60, 920]].map(([x, y], i) => (
          <rect key={i} x={x - 55} y={y - 12} width={110} height={24} rx={4} fill={C.red} opacity={0.9} />
        ))}
        <Lock x={WX} y={1130} open={false} color={C.red} />

        {/* RIGHT path */}
        <line x1={RX} y1={480} x2={RX} y2={1090} stroke={C.white} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
        {Array.from({length: 6}, (_, i) => (
          <polyline key={i} points={`${RX - 22},${560 + i * 90} ${RX},${590 + i * 90} ${RX + 22},${560 + i * 90}`} fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
        ))}
        <Lock x={RX} y={1130} open={unlocked} color={unlocked ? C.green : C.slate} />

        {/* people (dots) */}
        {Array.from({length: 5}, (_, k) => {
          const t = Math.max(0, f - 120 - k * 40);
          const u = Math.min(0.2 + k * 0.045, t * 0.0016);
          const p = pointAt(wrong, u);
          return t > 0 ? <circle key={'w' + k} cx={p.x} cy={p.y} r={16} fill={C.dim} /> : null;
        })}
        {Array.from({length: 5}, (_, k) => {
          const t = f - 120 - k * 40;
          if (t < 0) return null;
          const y = 480 + ((t * 5) % 620);
          return <circle key={'r' + k} cx={RX} cy={y} r={16} fill={unlocked ? C.green : C.white} />;
        })}
      </svg>

      <Stack top={1330} gap={18}>
        <KText at={300} size={70}>سهّل الصح ← صعّب الخطأ</KText>
        <KText at={500} size={44} color={C.dim} weight={700}>حواجز تصميمية بتمنع الغلط من الأساس</KText>
        <KText at={S4_UNLOCK} size={50} color={C.green}>ابنِ بيئة تجبرهم يتصرفوا صح بشكل طبيعي</KText>
      </Stack>
    </Scene>
  );
};
