import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, cardStyle, prog, sec} from '../kit';

// Scene 5 (frames 5550-6750, global 185-225s): the 3-step fix as stacked cards.
const S = 185;
const TOPS = [440, 810, 1180];

const Icon: React.FC<{n: number}> = ({n}) => (
  <svg width={140} height={140} viewBox="0 0 140 140" style={{flexShrink: 0}}>
    {n === 1 && (
      <g fill="none" stroke={C.crimson} strokeWidth={6} strokeLinecap="round">
        <circle cx={70} cy={70} r={46} />
        <circle cx={70} cy={70} r={8} fill={C.crimson} stroke="none" />
        <line x1={70} y1={8} x2={70} y2={34} />
        <line x1={70} y1={106} x2={70} y2={132} />
        <line x1={8} y1={70} x2={34} y2={70} />
        <line x1={106} y1={70} x2={132} y2={70} />
      </g>
    )}
    {n === 2 && (
      <g strokeLinecap="round">
        {[28, 64, 100].map((y) => (
          <line key={y} x1={14} x2={110} y1={y} y2={y} stroke={C.emerald} strokeWidth={14} />
        ))}
        <line x1={126} x2={126} y1={14} y2={116} stroke={C.crimson} strokeWidth={8} />
      </g>
    )}
    {n === 3 && (
      <g fill="none" stroke={C.emerald} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="40,14 70,44 100,14" />
        <polyline points="40,126 70,96 100,126" />
        <line x1={20} x2={120} y1={70} y2={70} />
      </g>
    )}
  </svg>
);

const STEPS = [
  {n: 1, t: 'حدد الـ [[Bottleneck]] بوضوح', d: 'بدقة ومن غير مجاملة لأي قسم', g: 189.7},
  {n: 2, t: 'طوّع باقي الأقسام لسرعته', d: 'استغل طاقة الاختناق لأقصى درجة', g: 201.4},
  {n: 3, t: 'بسّط الإجراءات واضغط الزمن', d: 'قصّر زمن الدورة التشغيلية', g: 212.7},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Fade dur={1200}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 150}}>
        <Kinetic text="علاج الاختناق في 3 خطوات" start={sec(185.7 - S)} size={80} />
        <Kinetic text="هندسة العمليات بأسلوب تنفيذي" start={sec(187 - S)} size={42} color={C.slate400} weight={600} />
      </div>

      {STEPS.map((s, i) => {
        const appear = prog(f, sec(s.g - S), 28);
        return (
          <div key={s.n} style={cardStyle(TOPS[i], 330, 1, appear)}>
            <div style={{flex: 1, paddingLeft: 20}}>
              <div style={{fontFamily: FONT, fontSize: 36, fontWeight: 600, color: C.slate500}}><L>0{s.n}</L></div>
              <div style={{fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.white, lineHeight: 1.3}}>
                {s.t.split(/(\[\[.+?\]\])|\s+/).filter(Boolean).map((w, k) =>
                  w.startsWith('[[') ? (
                    <L key={k} style={{margin: '0 8px', color: C.crimson}}>{w.slice(2, -2)}</L>
                  ) : (
                    <span key={k} style={{margin: '0 8px'}}>{w}</span>
                  ),
                )}
              </div>
              <div style={{fontFamily: FONT, fontSize: 34, color: C.slate400, marginTop: 10, lineHeight: 1.4}}>{s.d}</div>
            </div>
            <Icon n={s.n} />
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 80, right: 80, top: 1590}}>
        <Kinetic text="في منظومة ديجيتال بنبني الخريطة التشغيلية ونعالج النزيف {{فوراً}}" start={sec(217.9 - S)} size={50} />
      </div>
    </Fade>
  );
};
