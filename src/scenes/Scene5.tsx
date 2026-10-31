import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, cardStyle, prog, sec} from '../kit';

// Scene 5 (frames 5400-6750, global 180-225s): three-step roadmap as stacked vertical cards.
const S = 180;
const TOPS = [440, 810, 1180];
const STEPS = [
  {n: 1, t: 'هندسة الخطاب على الـ [[Receptors]]', d: 'رسالة تبدأ من احتياج العميل الحقيقي', g: 186.6},
  {n: 2, t: 'خفض احتكاك الصفقة [[(Zero Friction)]]', d: 'اقضِ على المخاطرة وتعقيد الخطوات', g: 195.6},
  {n: 3, t: 'الربط التحليلي للمسار', d: 'قِس كفاءة كل جنيه من الانتباه حتى الإيراد', g: 203.2},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Fade dur={1350}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 150}}>
        <Kinetic text="خارطة الطريق التنفيذية" start={sec(0.8)} size={80} />
        <Kinetic text="3 خطوات للتكامل بين التسويق والمبيعات" start={sec(2.2)} size={42} color={C.slate400} weight={600} />
      </div>

      {STEPS.map((s, i) => {
        const appear = prog(f, sec(s.g - S), 28);
        return (
          <div key={s.n} style={cardStyle(TOPS[i], 330, 1, appear)}>
            <div style={{flex: 1, paddingLeft: 20}}>
              <div style={{fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.white, lineHeight: 1.3}}>
                {s.t.split(/(\[\[.+?\]\])|\s+/).filter(Boolean).map((w, k) =>
                  w.startsWith('[[') ? (
                    <L key={k} style={{margin: '0 8px'}}>{w.slice(2, -2)}</L>
                  ) : (
                    <span key={k} style={{margin: '0 8px'}}>{w}</span>
                  ),
                )}
              </div>
              <div style={{fontFamily: FONT, fontSize: 34, color: C.slate400, marginTop: 14, lineHeight: 1.4}}>{s.d}</div>
            </div>
            <div style={{fontFamily: FONT, fontSize: 150, fontWeight: 700, color: i === 2 ? C.emerald : C.slate600, lineHeight: 1, width: 120, textAlign: 'center'}}>{s.n}</div>
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 80, right: 80, top: 1590}}>
        <Kinetic text="منظومة ديجيتال تفكك المسار وتتحكم في أرقام نموك" start={sec(212 - S)} size={54} color={C.white} />
      </div>
    </Fade>
  );
};
