import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S, S4_NODE0, S4_STEP} from '../theme';
import {KText, Scene, fmt, prog} from '../components/common';

const balances = [-1000, -800, -600, -400, -200, 0, 200];
const Y0 = 470;
const DY = 140;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const lineP = prog(f, S4_NODE0, S4_NODE0 + 6 * S4_STEP + 30);
  const frozenAt = S4_NODE0 + 7 * S4_STEP + 40;

  return (
    <Scene dur={S.s4.dur}>
      <KText at={5} top={90} size={58}>
        فترة استرداد تكلفة العميل
      </KText>
      <KText at={25} top={175} size={40} color={C.dim} weight={700} ltr>
        CAC Payback Period
      </KText>

      <KText at={60} top={300} size={44} color={C.white} weight={700}>
        صرفت 1,000 ج.م إعلانات ← العميل يدخّل 200 ج.م/شهر
      </KText>

      {/* vertical timeline */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={540} y1={Y0} x2={540} y2={Y0 + DY * 6} stroke={C.slate} strokeWidth={4} opacity={0.5} />
        <line x1={540} y1={Y0} x2={540} y2={Y0 + DY * 6 * lineP} stroke={lineP > 0.83 ? C.green : C.red} strokeWidth={8} strokeLinecap="round" />
        {balances.map((b, i) => {
          const t = S4_NODE0 + i * S4_STEP;
          const p = prog(f, t, t + 20);
          if (p <= 0) return null;
          const y = Y0 + DY * i;
          const color = b < 0 ? C.red : C.green;
          const isZero = b === 0;
          return (
            <g key={i} opacity={p}>
              <circle cx={540} cy={y} r={isZero ? 26 : 18} fill={isZero ? C.white : color} />
              {/* month label on the right (RTL start) */}
              <text x={600} y={y + 14} fontSize={42} fontWeight={700} fill={C.white} textAnchor="start">
                {i === 0 ? 'اليوم: صرف الإعلان' : `الشهر ${i}`}
              </text>
              {/* balance on the left */}
              <text x={480} y={y + 18} fontSize={56} fontWeight={900} fill={color} textAnchor="end" style={{fontVariantNumeric: 'tabular-nums'}}>
                {b > 0 ? '+' : ''}{fmt(b)}
              </text>
              {isZero && (
                <text x={600} y={y + 62} fontSize={32} fontWeight={700} fill={C.green} textAnchor="start">
                  استرجعت الألف جنيه
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <KText at={S4_NODE0 + 5 * S4_STEP + 20} top={1480} size={60} color={C.green}>
        5 شهور لاسترداد التكلفة
      </KText>

      <KText at={frozenAt} top={1590} size={46} color={C.white} weight={700}>
        طول ما الفترة طويلة... رأس المال العامل مجمّد
      </KText>
      <KText at={frozenAt + 70} top={1680} size={42} color={C.red} weight={700}>
        100 عميل جديد = 100,000 ج.م محبوسة في الإعلانات
      </KText>
      <KText at={frozenAt + 150} top={1770} size={44} color={C.white}>
        اضغط فترة الاسترداد = سيولة أكثر
      </KText>
    </Scene>
  );
};
