import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, cardStyle, prog, sec} from '../kit';

// Scene 2 (frames 1050-2550, global 35-85s): three marketing receptors as stacked cards, lit in sequence.
const S = 35;
const TOPS = [440, 810, 1180];
const H_CARD = 330;

const Icon: React.FC<{n: number; on: number}> = ({n, on}) => {
  const col = on > 0.5 ? C.white : C.slate600;
  return (
    <svg width={150} height={150} viewBox="0 0 150 150" style={{flexShrink: 0}}>
      {n === 1 && (
        <g fill="none" stroke={col} strokeWidth={5}>
          <circle cx={75} cy={75} r={62} />
          <circle cx={75} cy={75} r={40} />
          <circle cx={75} cy={75} r={16} fill={on > 0.5 ? C.emerald : col} stroke="none" />
        </g>
      )}
      {n === 2 && (
        <g fill="none" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="12,30 52,62 84,50 128,112" stroke={on > 0.5 ? C.crimson : col} />
          <polyline points="100,112 128,112 128,84" stroke={on > 0.5 ? C.crimson : col} />
        </g>
      )}
      {n === 3 && (
        <g fill="none" stroke={col} strokeWidth={6} strokeLinecap="round">
          <polyline points="14,50 14,14 50,14" />
          <polyline points="100,14 136,14 136,50" />
          <polyline points="136,100 136,136 100,136" />
          <polyline points="50,136 14,136 14,100" />
          <rect x={52} y={52} width={46} height={46} fill={on > 0.5 ? C.emerald : col} stroke="none" />
        </g>
      )}
    </svg>
  );
};

const CARDS = [
  {n: 1, en: 'Receptive State', ar: 'حالة الاستقبال', d: 'الوصول للعميل لحظة بحثه عن الحل', g: 45.7},
  {n: 2, en: 'Loss Aversion', ar: 'تجنب الخسارة', d: 'إظهار تكلفة تأجيل القرار كل يوم', g: 54.7},
  {n: 3, en: 'Frame & Positioning', ar: 'إعادة التأطير', d: 'وضع المنتج في فئة ذهنية تحسم المقارنة', g: 66.8},
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = 1 + 0.03 * prog(f, 0, 1500);
  return (
    <Fade dur={1500}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 150}}>
        <Kinetic text="سيكولوجية التسويق" start={sec(1)} size={84} />
        <Kinetic text="[[(Marketing Psychology)]]" start={sec(2.5)} size={46} color={C.slate400} weight={600} />
      </div>

      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 40%'}}>
        {CARDS.map((c, i) => {
          const appear = prog(f, sec(5 + i * 0.6), 28);
          const on = prog(f, sec(c.g - S), 22);
          return (
            <div key={c.n} style={cardStyle(TOPS[i], H_CARD, on, appear)}>
              <div style={{flex: 1, paddingLeft: 30}}>
                <div style={{fontFamily: FONT, fontSize: 36, fontWeight: 600, color: C.slate500}}>
                  <L>0{c.n}</L>
                </div>
                <div dir="ltr" style={{fontFamily: FONT, fontSize: 58, fontWeight: 700, color: C.white, textAlign: 'right', lineHeight: 1.2}}>{c.en}</div>
                <div style={{fontFamily: FONT, fontSize: 40, fontWeight: 600, color: on > 0.5 ? C.white : C.slate400, marginTop: 4}}>{c.ar}</div>
                <div style={{fontFamily: FONT, fontSize: 32, color: C.slate400, marginTop: 8, lineHeight: 1.4}}>{c.d}</div>
              </div>
              <Icon n={c.n} on={on} />
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 80, right: 80, top: 1590}}>
        <Kinetic text="العميل يشتري عندما يلمس خطابك {{مستقبلاً جاهزاً}} داخله" start={sec(76 - S)} size={52} color={C.slate400} weight={600} />
      </div>
    </Fade>
  );
};
