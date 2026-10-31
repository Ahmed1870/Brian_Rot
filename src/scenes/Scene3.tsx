import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, cardStyle, lerp, prog, sec} from '../kit';

// Scene 3 (frames 2550-4050, global 85-135s): friction bars shrink away, then value outgrows price.
const S = 85;
const FRICTION = [
  {t: 'مخاطرة متوقعة', g: 99.3},
  {t: 'خطوات معقدة', g: 100.9},
  {t: 'ضغط بيعي', g: 102.8},
];
const Q = [
  {t: 'هل العميل مناسب فعلاً للخدمة؟', g: 113.6},
  {t: 'هل القيمة أكبر بكثير من السعر؟', g: 116.8},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cardA = prog(f, sec(3), 28);
  const cardB = prog(f, sec(6), 28);
  const fricDone = prog(f, sec(103 - S), 30);
  const valueP = prog(f, sec(111.5 - S), sec(5));
  const BARW = 780;

  return (
    <Fade dur={1500}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 150}}>
        <Kinetic text="سيكولوجية المبيعات" start={sec(0.5)} size={84} />
        <Kinetic text="[[(Sales Psychology)]]" start={sec(2)} size={46} color={C.slate400} weight={600} />
      </div>

      {/* Card A: friction elimination */}
      <div style={{...cardStyle(430, 620, 1, cardA), display: 'block', padding: '40px 48px'}}>
        <div style={{fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.white}}>
          إزالة احتكاك الشراء <L style={{color: fricDone > 0.5 ? C.emerald : C.slate400, fontSize: 40}}>(Zero Friction)</L>
        </div>
        {FRICTION.map((r, i) => {
          const shrink = prog(f, sec(r.g - S), 26);
          return (
            <div key={r.t} style={{marginTop: 44}}>
              <div style={{fontFamily: FONT, fontSize: 36, color: C.slate400}}>{r.t}</div>
              <div style={{position: 'relative', height: 26, marginTop: 12}}>
                <div style={{position: 'absolute', right: 0, top: 0, height: 26, width: BARW, background: C.line, borderRadius: 13}} />
                <div style={{position: 'absolute', right: 0, top: 0, height: 26, width: lerp(BARW * (0.9 - i * 0.12), 0, shrink), background: C.crimson, borderRadius: 13}} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Card B: value qualification */}
      <div style={{...cardStyle(1110, 640, 1, cardB), display: 'block', padding: '40px 48px'}}>
        <div style={{fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.white}}>
          تأهيل العميل <L style={{color: C.slate400, fontSize: 40}}>(Value Qualification)</L>
        </div>
        <div style={{marginTop: 40, fontFamily: FONT, fontSize: 34, color: C.slate400}}>السعر</div>
        <div style={{position: 'relative', height: 26, marginTop: 10}}>
          <div style={{position: 'absolute', right: 0, height: 26, width: BARW * 0.45, background: C.slate500, borderRadius: 13}} />
        </div>
        <div style={{marginTop: 28, fontFamily: FONT, fontSize: 34, color: C.slate400}}>القيمة المتوقعة</div>
        <div style={{position: 'relative', height: 26, marginTop: 10}}>
          <div style={{position: 'absolute', right: 0, height: 26, width: lerp(BARW * 0.2, BARW, valueP), background: C.emerald, borderRadius: 13}} />
        </div>
        {Q.map((q) => {
          const p = prog(f, sec(q.g - S), 22);
          return (
            <div key={q.t} style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 20, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
              <svg width={44} height={44} viewBox="0 0 44 44">
                <polyline points="6,24 18,36 38,8" fill="none" stroke={C.emerald} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{fontFamily: FONT, fontSize: 38, color: C.white}}>{q.t}</div>
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 80, right: 80, top: 1790}}>
        <Kinetic text="الثقة تزيد... والصفقة تُقفل" start={sec(124.7 - S)} size={50} color={C.slate400} weight={600} />
      </div>
    </Fade>
  );
};
