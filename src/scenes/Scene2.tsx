import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Bottom, Canvas, Fade, Kinetic, Show, Top, lerp, prog, rnd, sec} from '../kit';

// Scene 2 (frames 1050-2400, global 35-80s): arrows from every department snap onto one compass target.
const S = 35;
const TAU = Math.PI * 2;
const CX = 540;
const CY = 445;
const wrap = (x: number) => (((x + Math.PI) % TAU) + TAU) % TAU - Math.PI;
const SRC = [
  {x: 170, y: 150, l: 'تسويق', ly: 82},
  {x: 910, y: 150, l: 'مبيعات', ly: 82},
  {x: 170, y: 740, l: 'تطوير', ly: 830},
  {x: 910, y: 740, l: 'تشغيل', ly: 830},
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const ringIn = prog(f, sec(47.2 - S), 40);
  const m = prog(f, sec(61.3 - S), sec(7));
  const centerIn = prog(f, sec(60.9 - S), 20);
  const pulse = m > 0.95 ? 0.5 + 0.5 * Math.sin(f / 7) : 0;

  const arrows: React.ReactNode[] = [];
  SRC.forEach((s, si) => {
    for (let a = 0; a < 3; a++) {
      const id = si * 3 + a;
      const sx = s.x + (a - 1) * 40;
      const sy = s.y;
      const appear = prog(f, sec(35.6 - S) + id * 4, 14);
      const ang0 = rnd(id, 1) * TAU;
      const toC = Math.atan2(CY - sy, CX - sx);
      const ang = ang0 + 0.35 * Math.sin(f / 20 + id) * (1 - m) + wrap(toC - ang0) * m;
      const dist = Math.hypot(CX - sx, CY - sy);
      const len = lerp(130 + rnd(id, 2) * 60, dist - 62, m);
      const tx = sx + Math.cos(ang) * len;
      const ty = sy + Math.sin(ang) * len;
      const col = interpolateColors(m, [0, 0.6, 1], [C.crimson, C.crimson, C.emerald]);
      const h1 = `${tx - 30 * Math.cos(ang - 0.5)},${ty - 30 * Math.sin(ang - 0.5)}`;
      const h2 = `${tx - 30 * Math.cos(ang + 0.5)},${ty - 30 * Math.sin(ang + 0.5)}`;
      arrows.push(
        <g key={id} opacity={appear}>
          <line x1={sx} y1={sy} x2={tx} y2={ty} stroke={col} strokeWidth={7} strokeLinecap="round" />
          <polyline points={`${h1} ${tx},${ty} ${h2}`} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={sx} cy={sy} r={8} fill={C.slate500} />
        </g>,
      );
    }
  });

  return (
    <Fade dur={1350}>
      <Top>
        <Show from={sec(35.2 - S)} to={sec(46.9 - S)}>
          <Kinetic text="متابعة كل الأرقام = {{لا تركيز}} على أي شيء" start={sec(35.2 - S)} size={66} />
        </Show>
        <Show from={sec(47.2 - S)} to={sec(60.6 - S)}>
          <Kinetic text="[[Lean Analytics]]" start={sec(47.2 - S)} size={92} />
          <Kinetic text="أليستير كرول وبنيامين يوسكوفيتز" start={sec(48.5 - S)} size={40} color={C.slate400} weight={600} />
        </Show>
        <Show from={sec(60.9 - S)}>
          <Kinetic text="المؤشر الوحيد الأهم [[(OMTM)]]" start={sec(60.9 - S)} size={78} />
          <Kinetic text="[[One Metric That Matters]]" start={sec(62.6 - S)} size={42} color={C.slate400} weight={600} />
        </Show>
      </Top>

      <Canvas>
        {[70, 140, 210].map((r, i) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke={i === 0 ? C.emerald : C.slate600} strokeWidth={i === 0 ? 5 : 3} strokeDasharray={`${ringIn * 2 * Math.PI * r} ${2 * Math.PI * r}`} opacity={0.4 + 0.6 * ringIn} />
        ))}
        <line x1={CX - 250} x2={CX + 250} y1={CY} y2={CY} stroke={C.slate700} strokeWidth={2} opacity={ringIn} />
        <line x1={CX} x2={CX} y1={CY - 250} y2={CY + 250} stroke={C.slate700} strokeWidth={2} opacity={ringIn} />
        <circle cx={CX} cy={CY} r={70 + 40 * pulse} fill="none" stroke={C.emerald} strokeWidth={4} opacity={0.5 * (1 - pulse)} />
        <circle cx={CX} cy={CY} r={36} fill={C.emerald} opacity={centerIn} />
        <text x={CX} y={CY + 8} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={700} fill="#0D0D0D" opacity={centerIn}>OMTM</text>
        {arrows}
        {SRC.map((s) => (
          <text key={s.l} x={s.x} y={s.ly} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={600} fill={C.slate400}>{s.l}</text>
        ))}
      </Canvas>

      <Bottom>
        <Show from={sec(70.4 - S)}>
          <Kinetic text="بوصلة رقمية {{موحدة}}" start={sec(70.4 - S)} size={68} />
          <Kinetic text="كل الأقسام بتبصّ في اتجاه واحد" start={sec(72 - S)} size={40} color={C.slate400} weight={600} />
        </Show>
      </Bottom>
    </Fade>
  );
};
