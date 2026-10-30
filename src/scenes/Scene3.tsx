import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, lerp, prog, rnd, sec} from '../kit';

// Scene 3 (frames 2250-3600 = global 75s-120s): customer funnel with leakage at Value Delivery
const S = 75;
const CX = 640;
const Y0 = 80;
const Y1 = 760;
const LEAK_Y = 440;
const hw = (y: number) => lerp(400, 150, (y - Y0) / (Y1 - Y0));
const COUNT = 250;
const GAP = 5;

const STAGES = [
  {y: 170, ar: 'التسويق'},
  {y: 345, ar: 'المبيعات'},
  {y: 515, ar: 'تقديم القيمة'},
  {y: 680, ar: 'العميل المتكرر'},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const hot = prog(f, sec(80.7 - S), 20);

  const dots: React.ReactNode[] = [];
  for (let i = 0; i < COUNT; i++) {
    const spawn = sec(0.4) + i * GAP;
    const life = 210 + rnd(i, 3) * 50;
    const t = (f - spawn) / life;
    if (t < 0 || t > 1) continue;
    let y = lerp(Y0, Y1, t);
    const u = (rnd(i, 1) - 0.5) * 1.7;
    const leakProb = interpolate(spawn, [sec(5), sec(7.5)], [0.06, 0.68], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const leaks = rnd(i, 2) < leakProb;
    let x = CX + u * hw(y);
    let fill = C.slate400;
    let op = Math.min(1, t * 20);
    if (leaks && y > LEAK_Y) {
      const k = (y - LEAK_Y) / (Y1 - LEAK_Y);
      const side = u >= 0 ? 1 : -1;
      x += side * Math.pow(k, 1.3) * 480;
      y += k * 60;
      fill = C.crimson;
      op *= 1 - k * 0.9;
    }
    dots.push(<circle key={i} cx={x} cy={y} r={6} fill={fill} opacity={op} />);
  }

  const edge = (sign: number, y1: number, y2: number) => `${CX + sign * hw(y1)},${y1} ${CX + sign * hw(y2)},${y2}`;

  const churn = lerp(8, 41, prog(f, sec(91.3 - S), sec(8)));
  const cac = lerp(1, 2.4, prog(f, sec(99.5 - S), sec(8)));
  const ltv = lerp(100, 35, prog(f, sec(104.3 - S), sec(8)));

  const Metric: React.FC<{label: string; value: string; cue: number; top: number}> = ({label, value, cue, top}) => {
    const p = prog(f, sec(cue - S), 24);
    return (
      <div style={{position: 'absolute', right: 120, width: 640, top, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, direction: 'rtl'}}>
        <div style={{fontFamily: FONT, fontSize: 30, color: C.slate400}}>{label}</div>
        <div style={{fontFamily: FONT, fontSize: 84, fontWeight: 700, color: C.white, lineHeight: 1.1}}>
          <L>{value}</L>
        </div>
      </div>
    );
  };

  return (
    <Fade dur={1350}>
      <svg width={1100} height={860} style={{position: 'absolute', left: 40, top: 120}}>
        <g transform="translate(0 -40)">
          <polyline points={edge(-1, Y0, Y1)} fill="none" stroke={C.slate500} strokeWidth={3} />
          <polyline points={edge(1, Y0, Y1)} fill="none" stroke={C.slate500} strokeWidth={3} />
          <polyline points={edge(-1, 430, 540)} fill="none" stroke={C.crimson} strokeWidth={7} opacity={hot} />
          <polyline points={edge(1, 430, 540)} fill="none" stroke={C.crimson} strokeWidth={7} opacity={hot} />
          {[260, 430, 600].map((y) => (
            <line key={y} x1={CX - hw(y)} x2={CX + hw(y)} y1={y} y2={y} stroke={C.slate600} strokeOpacity={0.5} strokeDasharray="6 10" />
          ))}
          {dots}
          {STAGES.map((s, i) => (
            <text key={s.ar} x={200} y={s.y + 10} textAnchor="end" fontFamily={FONT} fontSize={32} fontWeight={600} fill={i === 2 ? (hot > 0.5 ? C.crimson : C.white) : C.slate400}>
              {s.ar}
            </text>
          ))}
        </g>
      </svg>

      <div style={{position: 'absolute', right: 120, width: 640, top: 100}}>
        <Kinetic text="ارتفاع الـ [[!Churn Rate]] = انهيار الـ [[LTV]]" start={sec(91.3 - S)} size={50} />
      </div>
      <div style={{position: 'absolute', right: 120, width: 640, top: 260}}>
        <Kinetic text="تضاعف تكلفة الاستحواذ [[(CAC)]]" start={sec(99.5 - S)} size={50} />
      </div>

      <Metric label="معدل التسرب" value={`${Math.round(churn)}%`} cue={91.3} top={440} />
      <Metric label="تكلفة الاستحواذ" value={`×${cac.toFixed(1)}`} cue={99.5} top={590} />
      <Metric label="القيمة الممتدة للعميل (مؤشر)" value={`${Math.round(ltv)}`} cue={104.3} top={740} />

      <div style={{position: 'absolute', right: 120, width: 640, top: 920}}>
        <Kinetic text="بدل ما تتوسع، بتوسع نزيفك المالي" start={sec(110.8 - S)} size={40} weight={600} color={C.slate400} />
      </div>
      <div style={{position: 'absolute', left: 60, bottom: 36, fontFamily: FONT, fontSize: 22, color: C.slate600, direction: 'rtl'}}>
        بيانات توضيحية لنمذجة الفكرة
      </div>
    </Fade>
  );
};
