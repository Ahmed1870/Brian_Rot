import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Bottom, Canvas, Fade, Kinetic, Show, Top, lerp, prog, sec} from '../kit';

// Scene 3 (frames 2400-3750, global 80-125s): the one-question filter, then the OMTM moving through 5 growth stages.
const S = 80;
const t = (g: number) => sec(g - S);

const ACTIONS = [
  {a: 'حملة لزيادة الزيارات', ok: false, g: 81.0, v: 88.8},
  {a: 'تحسين تجربة أول أسبوع للعميل', ok: true, g: 83.6, v: 89.4},
  {a: 'تغيير ألوان الموقع', ok: false, g: 86.2, v: 90.0},
];

const STAGES = [
  {en: 'Empathy', ar: 'التعاطف', g: 91.0},
  {en: 'Stickiness', ar: 'الالتصاق', g: 98.3},
  {en: 'Virality', ar: 'الانتشار', g: 107.2},
  {en: 'Revenue', ar: 'الإيراد', g: 114.8},
  {en: 'Scale', ar: 'التوسع', g: 118.8},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const aOut = 1 - prog(f, t(90.4), 14);
  const bIn = prog(f, t(91.0), 20);
  const idx = [1, 2, 3, 4].reduce((s, k) => s + prog(f, t(STAGES[k].g), 24), 0);
  const active = Math.floor(idx + 0.15);
  const rowY = (i: number) => 100 + i * 170;

  return (
    <Fade dur={1350}>
      <Top>
        <Show from={t(80.2)} to={t(87.6)}>
          <Kinetic text="بيقطع الشك والجدال في الاجتماعات" start={t(80.2)} size={68} />
        </Show>
        <Show from={t(87.9)} to={t(90.5)}>
          <Kinetic text="هل الإجراء ده هيحرك المؤشر الأهم النهاردة؟" start={t(87.9)} size={62} />
        </Show>
        <Show from={t(91.0)}>
          <Kinetic text="رقم {{متحرك}} مش ثابت" start={t(91.0)} size={80} />
          <Kinetic text="[[Stage-Driven Metric]]" start={t(92.6)} size={42} color={C.slate400} weight={600} />
        </Show>
      </Top>

      <Canvas>
        {/* Phase A: filter three candidate actions with one question */}
        <g opacity={aOut}>
          {ACTIONS.map((r, i) => {
            const y = 190 + i * 250;
            const p = prog(f, t(r.g), 22);
            const v = prog(f, t(r.v), 14);
            const col = r.ok ? C.emerald : C.crimson;
            return (
              <g key={r.a} opacity={p} transform={`translate(0 ${(1 - p) * 30})`}>
                <line x1={60} x2={1020} y1={y + 70} y2={y + 70} stroke={C.line} strokeWidth={2} />
                <text x={1010} y={y} textAnchor="end" fontFamily={FONT} fontSize={46} fontWeight={600} fill={C.white}>{r.a}</text>
                <text x={1010} y={y + 52} textAnchor="end" fontFamily={FONT} fontSize={32} fill={v > 0.5 ? col : C.slate500}>{v > 0.5 ? (r.ok ? 'يحرك المؤشر' : 'لا يحرك المؤشر') : 'قيد الاختبار...'}</text>
                <circle cx={110} cy={y + 20} r={44} fill="none" stroke={v > 0.5 ? col : C.slate600} strokeWidth={5} />
                {v > 0.5 && r.ok && <polyline points={`${88},${y + 22} ${104},${y + 38} ${134},${y + 4}`} fill="none" stroke={col} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
                {v > 0.5 && !r.ok && (
                  <g stroke={col} strokeWidth={8} strokeLinecap="round">
                    <line x1={92} y1={y + 2} x2={128} y2={y + 38} />
                    <line x1={128} y1={y + 2} x2={92} y2={y + 38} />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Phase B: five-stage slider */}
        <g opacity={bIn}>
          <line x1={110} x2={110} y1={rowY(0)} y2={rowY(4)} stroke={C.slate700} strokeWidth={4} />
          <line x1={110} x2={110} y1={rowY(0)} y2={lerp(rowY(0), rowY(4), idx / 4)} stroke={C.emerald} strokeWidth={6} />
          {STAGES.map((s, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <g key={s.en}>
                <circle cx={110} cy={rowY(i)} r={on ? 22 : 14} fill={on ? C.emerald : done ? C.emerald : C.bg} stroke={on || done ? C.emerald : C.slate600} strokeWidth={4} />
                <text x={190} y={rowY(i) + 16} textAnchor="start" fontFamily={FONT} fontSize={on ? 58 : 46} fontWeight={700} fill={on ? C.white : done ? C.slate400 : C.slate600}>{s.en}</text>
                <text x={1010} y={rowY(i) + 14} textAnchor="end" fontFamily={FONT} fontSize={on ? 40 : 34} fontWeight={600} fill={on ? C.emerald : C.slate600}>{s.ar}</text>
              </g>
            );
          })}
        </g>
      </Canvas>

      <Bottom>
        <Show from={t(91.4)} to={t(98.1)}>
          <Kinetic text="OMTM الحالي:" start={t(91.4)} size={38} color={C.emerald} weight={600} />
          <Kinetic text="عدد العملاء المؤكدين للمشكلة" start={t(92.2)} size={64} />
        </Show>
        <Show from={t(98.4)} to={t(107.0)}>
          <Kinetic text="OMTM الحالي:" start={t(98.4)} size={38} color={C.emerald} weight={600} />
          <Kinetic text="معدل الاحتفاظ [[Retention]]" start={t(99.2)} size={68} />
        </Show>
        <Show from={t(107.3)} to={t(114.6)}>
          <Kinetic text="OMTM الحالي:" start={t(107.3)} size={38} color={C.emerald} weight={600} />
          <Kinetic text="نسبة الانتشار [[K-Factor]]" start={t(108)} size={68} />
        </Show>
        <Show from={t(114.9)} to={t(118.6)}>
          <Kinetic text="OMTM الحالي:" start={t(114.9)} size={38} color={C.emerald} weight={600} />
          <Kinetic text="هامش المساهمة" start={t(115.6)} size={68} />
        </Show>
        <Show from={t(118.9)}>
          <Kinetic text="OMTM الحالي:" start={t(118.9)} size={38} color={C.emerald} weight={600} />
          <Kinetic text="الربحية الصافية" start={t(119.6)} size={68} />
        </Show>
      </Bottom>
    </Fade>
  );
};
