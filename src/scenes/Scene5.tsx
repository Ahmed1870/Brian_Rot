import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, S, S5_CARDS} from '../theme';
import {KText, Scene, Stack, prog} from '../components/common';

const steps = [
  {n: '1', t: 'صحّح جدول الحوافز', d: 'اربط المكافأة بالنتائج النهائية مش بالأنشطة الجانبية', icon: 'scale', c: C.red},
  {n: '2', t: 'ابنِ Feedback Loops لحظية', d: 'لوحات قيادة تخلي الموظف شايف أثر شغله فوراً', icon: 'loop', c: C.green},
  {n: '3', t: 'بسّط المسار الصحيح', d: 'اضغط خطوات الصح وحط حواجز قدّام الغلط', icon: 'path', c: C.white},
];

const Icon: React.FC<{k: string; color: string}> = ({k, color}) => (
  <svg width={110} height={110} viewBox="0 0 110 110" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    {k === 'scale' && (<><line x1={55} y1={12} x2={55} y2={98} /><line x1={20} y1={30} x2={90} y2={30} /><path d="M 20 30 L 6 62 H 34 Z" /><path d="M 90 30 L 76 62 H 104 Z" /><line x1={30} y1={98} x2={80} y2={98} /></>)}
    {k === 'loop' && (<><path d="M 82 30 A 38 38 0 1 0 90 62" /><polyline points="86,10 84,32 62,30" /></>)}
    {k === 'path' && (<><polyline points="20,95 20,55 90,55 90,15" /><polyline points="72,32 90,14 108,32" /></>)}
  </svg>
);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Scene dur={S.s5.dur}>
      <Stack top={100} gap={8}>
        <KText at={5} size={60}>منظومة ذاتية التشغيل</KText>
        <KText at={20} size={44} color={C.dim} weight={700}>في 3 خطوات</KText>
      </Stack>

      {steps.map((s, i) => {
        const at = S5_CARDS[i];
        const p = spring({frame: f - at, fps, config: {damping: 15, stiffness: 110}});
        const o = prog(f, at, at + 14);
        return (
          <div key={i} className="absolute w-full" style={{top: 340 + i * 410, opacity: o, transform: `translateY(${(1 - p) * 120}px)`, direction: 'rtl', padding: '0 70px'}}>
            <div style={{height: 3, background: C.slate, width: `${interpolate(p, [0, 1], [0, 100])}%`, marginBottom: 34}} />
            <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
              <div style={{fontSize: 180, fontWeight: 900, color: s.c, lineHeight: 1, width: 130, textAlign: 'center'}}>{s.n}</div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 54, fontWeight: 900, color: C.white, lineHeight: 1.3}}>{s.t}</div>
                <div style={{fontSize: 34, fontWeight: 700, color: C.dim, marginTop: 12, lineHeight: 1.5}}>{s.d}</div>
              </div>
              <Icon k={s.icon} color={s.c} />
            </div>
          </div>
        );
      })}

      <Stack top={1640} gap={10}>
        <KText at={900} size={46} color={C.dim} weight={700}>من إدارة الأفراد</KText>
        <KText at={940} size={58} color={C.green}>إلى إدارة النظام اللي بيدير الأفراد</KText>
      </Stack>
    </Scene>
  );
};
