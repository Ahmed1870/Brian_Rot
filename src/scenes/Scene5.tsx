import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, S, S5_CARDS} from '../theme';
import {KText, Scene, prog} from '../components/common';

const steps = [
  {n: '1', t: 'احسب التكلفة المتغيرة بجدية', d: 'اجرد كل بند لكل بيعة: خامات، تغليف، شحن، عمولات، إعلان', icon: 'calc'},
  {n: '2', t: 'ارفع هامش المساهمة للوحدة', d: 'قلّل تكلفة الإنتاج والتوريد أو ارفع قيمة المنتج وسعره', icon: 'up'},
  {n: '3', t: 'اضغط فترة استرداد الـ CAC', d: 'أقصر مدة ممكنة = تدفق نقدي أقوى وسيولة أعلى', icon: 'clock'},
];

const Icon: React.FC<{k: string; color: string}> = ({k, color}) => (
  <svg width={110} height={110} viewBox="0 0 110 110" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    {k === 'calc' && (<><rect x={22} y={10} width={66} height={90} rx={8} /><line x1={36} y1={32} x2={74} y2={32} /><circle cx={40} cy={55} r={3} /><circle cx={55} cy={55} r={3} /><circle cx={70} cy={55} r={3} /><circle cx={40} cy={78} r={3} /><circle cx={55} cy={78} r={3} /><circle cx={70} cy={78} r={3} /></>)}
    {k === 'up' && (<><polyline points="12,88 42,56 62,72 98,22" /><polyline points="72,22 98,22 98,48" /></>)}
    {k === 'clock' && (<><circle cx={55} cy={55} r={42} /><polyline points="55,28 55,55 78,68" /></>)}
  </svg>
);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Scene dur={S.s5.dur}>
      <KText at={5} top={110} size={64}>
        منظومة مالية محكمة في 3 خطوات
      </KText>

      {steps.map((s, i) => {
        const at = S5_CARDS[i];
        const p = spring({frame: f - at, fps, config: {damping: 15, stiffness: 110}});
        const o = prog(f, at, at + 14);
        const top = 330 + i * 440;
        const accent = i === 0 ? C.red : C.green;
        return (
          <div key={i} className="absolute w-full" style={{top, opacity: o, transform: `translateY(${(1 - p) * 120}px)`, direction: 'rtl', padding: '0 70px'}}>
            <div style={{height: 3, background: C.slate, width: `${interpolate(p, [0, 1], [0, 100])}%`, marginBottom: 36}} />
            <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
              <div style={{fontSize: 190, fontWeight: 900, color: accent, lineHeight: 1, width: 150, textAlign: 'center'}}>{s.n}</div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 58, fontWeight: 900, color: C.white, lineHeight: 1.3}}>{s.t}</div>
                <div style={{fontSize: 36, fontWeight: 700, color: C.dim, marginTop: 14, lineHeight: 1.5}}>{s.d}</div>
              </div>
              <Icon k={s.icon} color={accent} />
            </div>
          </div>
        );
      })}

      <KText at={1000} top={1700} size={50} color={C.green}>
        الأرقام الصح = بيزنس يعيش ويكبر
      </KText>
    </Scene>
  );
};
