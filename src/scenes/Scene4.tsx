import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, lerp, prog, sec} from '../kit';

// Scene 4 (frames 3600-4950 = global 120s-165s): unit-economics dashboard (illustrative numbers)
const MONTHS = 6;
const BW = 110;
const STEP = 165;
const BASE = 470;
const HT = 400;
const BASE_COST = 38; // unavoidable cost-to-serve (% of revenue)
const target = (i: number) => 62 - i * 4.6;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const morph = (i: number) => prog(f, sec(9.3) + i * 10, 70);
  const cost = (i: number) => lerp(62, target(i), morph(i));
  const m5 = morph(MONTHS - 1);

  const cards = [
    {label: 'تكلفة تقديم الخدمة', value: lerp(62, 39.5, m5), color: C.white},
    {label: 'هامش المساهمة', value: 100 - lerp(62, 39.5, m5), color: C.white},
    {label: 'تكلفة الاختناقات', value: lerp(24, 1.5, m5), color: C.crimson},
  ];

  return (
    <Fade dur={1350}>
      <div style={{position: 'absolute', left: 160, right: 160, top: 80}}>
        <Kinetic text="اقتصاديات الوحدة [[(Unit Economics)]]" start={sec(0.6)} size={64} />
      </div>
      <div style={{position: 'absolute', left: 160, right: 160, top: 185}}>
        <Kinetic text="تفكيك الاختناقات التشغيلية = حماية الأرباح" start={sec(137.99 - 120)} size={46} color={C.slate400} weight={600} />
      </div>

      <div style={{position: 'absolute', left: 120, top: 310, width: 1100, height: 620, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, opacity: prog(f, sec(1.5), 25)}}>
        <svg viewBox="0 0 1100 620" width={1100} height={620}>
          {[0, 25, 50, 75, 100].map((v) => (
            <line key={v} x1={40} x2={1060} y1={BASE - (v / 100) * HT} y2={BASE - (v / 100) * HT} stroke={C.slate600} strokeOpacity={0.3} strokeDasharray="4 8" />
          ))}
          {Array.from({length: MONTHS}).map((_, i) => {
            const g = prog(f, sec(2.5) + i * 6, 30);
            const c = cost(i);
            const hBase = (BASE_COST / 100) * HT * g;
            const hWaste = (Math.max(0, c - BASE_COST) / 100) * HT * g;
            const hMargin = ((100 - c) / 100) * HT * g;
            const x = 80 + i * STEP;
            return (
              <g key={i}>
                <rect x={x} y={BASE - hBase} width={BW} height={hBase} fill={C.slate600} />
                <rect x={x} y={BASE - hBase - hWaste} width={BW} height={hWaste} fill={C.crimson} />
                <rect x={x} y={BASE - hBase - hWaste - hMargin} width={BW} height={hMargin} fill={C.white} />
                {g > 0.9 && (
                  <text x={x + BW / 2} y={BASE - hBase - hWaste - hMargin + 36} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={700} fill="#0D0D0D">
                    {Math.round(100 - c)}%
                  </text>
                )}
                <text x={x + BW / 2} y={BASE + 40} textAnchor="middle" fontFamily={FONT} fontSize={26} fill={C.slate400}>
                  الشهر {i + 1}
                </text>
              </g>
            );
          })}
          {[
            {c: C.slate600, t: 'تكلفة التسليم الأساسية', x: 1060},
            {c: C.crimson, t: 'تكلفة الاختناقات', x: 760},
            {c: C.white, t: 'هامش المساهمة', x: 500},
          ].map((l) => (
            <g key={l.t}>
              <rect x={l.x - 22} y={558} width={22} height={22} fill={l.c} />
              <text x={l.x - 34} y={577} textAnchor="end" fontFamily={FONT} fontSize={26} fill={C.slate400}>
                {l.t}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {cards.map((c, i) => {
        const p = prog(f, sec(2.5) + i * 12, 25);
        return (
          <div key={c.label} style={{position: 'absolute', right: 120, width: 520, height: 180, top: 310 + i * 220, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: '26px 34px', boxSizing: 'border-box', direction: 'rtl', opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
            <div style={{fontFamily: FONT, fontSize: 30, color: C.slate400}}>{c.label}</div>
            <div style={{fontFamily: FONT, fontSize: 80, fontWeight: 700, color: c.color, lineHeight: 1.15}}>
              <L>{Math.round(c.value)}%</L>
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', right: 120, bottom: 40, fontFamily: FONT, fontSize: 22, color: C.slate600, direction: 'rtl'}}>
        النسب من الإيراد لكل عميل — بيانات توضيحية
      </div>
    </Fade>
  );
};
