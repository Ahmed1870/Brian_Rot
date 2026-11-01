import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Bottom, Canvas, Fade, Kinetic, Show, Top, lerp, prog, sec} from '../kit';

// Scene 4 (frames 3750-4950, global 125-165s): frozen metric -> actionability gauge -> threshold.
const S = 125;
const t = (g: number) => sec(g - S);
const GX = 540;
const GY = 470;
const GR = 330;

const arc = (a0: number, a1: number, r: number) => {
  const x0 = GX + r * Math.cos(a0);
  const y0 = GY + r * Math.sin(a0);
  const x1 = GX + r * Math.cos(a1);
  const y1 = GY + r * Math.sin(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();

  // Phase 0: frozen metric vs. a company that keeps growing
  const p0 = (1 - prog(f, t(131.0), 12)) * prog(f, t(125.1), 14);
  const travel = prog(f, t(125.4), sec(5.6));
  const cx = lerp(140, 900, travel);

  // Phase 1-2: gauge
  const gIn = prog(f, t(131.6), 22) * (1 - prog(f, t(152.7), 12));
  const v = 0.5 + 0.04 * Math.sin(f / 9) * (1 - prog(f, t(143.5), 10)) - 0.42 * prog(f, t(143.5), 25) + 0.85 * prog(f, t(148.4), 30);
  const ang = Math.PI + Math.PI * Math.min(1, Math.max(0, v));
  const nx = GX + (GR - 70) * Math.cos(ang);
  const ny = GY + (GR - 70) * Math.sin(ang);
  const good = prog(f, t(148.4), 30);

  // Phase 3: threshold
  const thIn = prog(f, t(153.0), 20);
  const fill = prog(f, t(153.8), sec(8.5));
  const val = Math.round(fill * 62);
  const BX = 120;
  const BW = 840;
  const crossed = fill * 62 >= 40;
  const next = prog(f, t(160.2), 22);

  return (
    <Fade dur={1200}>
      <Top>
        <Show from={t(125.1)} to={t(131.0)}>
          <Kinetic text="تثبيت نفس المؤشر = {{عمى تنفيذي}}" start={t(125.1)} size={70} />
        </Show>
        <Show from={t(131.3)} to={t(152.7)}>
          <Kinetic text="اختبار القابلية للإجراء" start={t(131.3)} size={78} />
          <Kinetic text="[[Actionable vs Vanity Metrics]]" start={t(133)} size={40} color={C.slate400} weight={600} />
        </Show>
        <Show from={t(153.0)}>
          <Kinetic text="حدد خط {{العتبة}} الحرج" start={t(153.0)} size={78} />
          <Kinetic text="[[Threshold Target]]" start={t(154.4)} size={42} color={C.slate400} weight={600} />
        </Show>
      </Top>

      <Canvas>
        {/* Phase 0 */}
        <g opacity={p0}>
          <line x1={100} x2={980} y1={440} y2={440} stroke={C.slate600} strokeWidth={4} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={140 + i * 190} x2={140 + i * 190} y1={425} y2={455} stroke={C.slate600} strokeWidth={4} />
          ))}
          <line x1={140} x2={cx} y1={380} y2={380} stroke={C.crimson} strokeWidth={5} strokeDasharray="12 10" />
          <line x1={140} x2={140} y1={366} y2={394} stroke={C.crimson} strokeWidth={5} />
          <line x1={cx} x2={cx} y1={366} y2={394} stroke={C.crimson} strokeWidth={5} />
          <text x={(140 + cx) / 2} y={340} textAnchor="middle" fontFamily={FONT} fontSize={42} fontWeight={700} fill={C.crimson} opacity={travel}>عمى تنفيذي</text>
          <circle cx={140} cy={440} r={20} fill={C.crimson} />
          <text x={140} y={520} textAnchor="start" fontFamily={FONT} fontSize={36} fill={C.slate400}>المؤشر المثبّت</text>
          <circle cx={cx} cy={440} r={26} fill={C.emerald} />
          <text x={cx} y={520} textAnchor="middle" fontFamily={FONT} fontSize={36} fill={C.white}>الشركة</text>
        </g>

        {/* Phase 1-2: gauge */}
        <g opacity={gIn}>
          <path d={arc(Math.PI, Math.PI * 1.34, GR)} fill="none" stroke={C.crimson} strokeWidth={46} />
          <path d={arc(Math.PI * 1.34, Math.PI * 1.66, GR)} fill="none" stroke={C.slate600} strokeWidth={46} />
          <path d={arc(Math.PI * 1.66, Math.PI * 2, GR)} fill="none" stroke={C.emerald} strokeWidth={46} />
          <line x1={GX} y1={GY} x2={nx} y2={ny} stroke={C.white} strokeWidth={10} strokeLinecap="round" />
          <circle cx={GX} cy={GY} r={24} fill={good > 0.5 ? C.emerald : C.white} />
          <text x={GX - GR} y={GY + 64} textAnchor="middle" fontFamily={FONT} fontSize={30} fill={C.slate500}>رقم شرفي</text>
          <text x={GX + GR} y={GY + 64} textAnchor="middle" fontFamily={FONT} fontSize={30} fill={C.slate500}>قرار مباشر</text>

          <text x={80} y={650} textAnchor="start" fontFamily={FONT} fontSize={40} fontWeight={700} fill={C.crimson}>مؤشرات شرفية</text>
          <text x={80} y={716} textAnchor="start" fontFamily={FONT} fontSize={38} fill={C.white} opacity={prog(f, t(143.7), 16)}>تحميلات التطبيق</text>
          <text x={80} y={776} textAnchor="start" fontFamily={FONT} fontSize={38} fill={C.white} opacity={prog(f, t(145.6), 16)}>زيارات الصفحة</text>

          <text x={1000} y={650} textAnchor="end" fontFamily={FONT} fontSize={40} fontWeight={700} fill={C.emerald}>مؤشرات القرار</text>
          <text x={1000} y={716} textAnchor="end" fontFamily={FONT} fontSize={38} fill={C.white} opacity={prog(f, t(148.4), 16)}>معدل الاحتفاظ</text>
          <text x={1000} y={776} textAnchor="end" fontFamily={FONT} fontSize={38} fontWeight={700} fill={C.emerald} opacity={prog(f, t(148.8), 16)}>Retention</text>
        </g>

        {/* Phase 3: threshold */}
        <g opacity={thIn}>
          <text x={540} y={230} textAnchor="middle" fontFamily={FONT} fontSize={170} fontWeight={700} fill={crossed ? C.emerald : C.white}>{val}%</text>
          <text x={540} y={300} textAnchor="middle" fontFamily={FONT} fontSize={36} fill={C.slate400}>معدل الاحتفاظ</text>
          <rect x={BX} y={400} width={BW} height={70} rx={35} fill={C.line} />
          <rect x={BX} y={400} width={Math.max(0.1, (BW * fill * 62) / 100)} height={70} rx={35} fill={crossed ? C.emerald : C.crimson} />
          <line x1={BX + BW * 0.4} x2={BX + BW * 0.4} y1={370} y2={500} stroke={C.white} strokeWidth={5} strokeDasharray="10 8" />
          <text x={BX + BW * 0.4} y={350} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={700} fill={C.white}>العتبة 40%</text>
          <g opacity={next} transform={`translate(0 ${(1 - next) * 30})`}>
            <path d="M540 520 L540 590 M514 566 L540 592 L566 566" fill="none" stroke={C.emerald} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <text x={540} y={660} textAnchor="middle" fontFamily={FONT} fontSize={38} fill={C.slate400}>المؤشر التالي</text>
            <text x={540} y={740} textAnchor="middle" fontFamily={FONT} fontSize={64} fontWeight={700} fill={C.emerald}>Virality K-Factor</text>
          </g>
          <text x={1040} y={860} textAnchor="end" fontFamily={FONT} fontSize={22} fill={C.slate600}>رقم توضيحي</text>
        </g>
      </Canvas>

      <Bottom>
        <Show from={t(137.2)} to={t(148.3)}>
          <Kinetic text="الرقم الشرفي = {{إحساس صوري}} بالنجاح" start={t(137.2)} size={62} />
        </Show>
        <Show from={t(148.5)} to={t(152.7)}>
          <Kinetic text="المؤشر الحقيقي = {{قرار}} مباشر" start={t(148.5)} size={64} color={C.white} />
        </Show>
        <Show from={t(159.0)}>
          <Kinetic text="أول ما تتجاوزها... تنتقل للمؤشر {{التالي}}" start={t(159.0)} size={58} />
        </Show>
      </Bottom>
    </Fade>
  );
};
