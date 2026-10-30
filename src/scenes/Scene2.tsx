import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, S, S2_LOSS, S2_REVEAL, S2_SURGE} from '../theme';
import {KText, Scene, fmt, prog} from '../components/common';

const SC = 0.62; // px per EGP
const ZERO = 780; // baseline y for 0 EGP (inside svg local)
const COLW = 150;
const GAP = 16;
const colX = (i: number) => 1080 - 70 - (i + 1) * COLW - i * GAP; // RTL: price at the right

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const adsVal = interpolate(f, [S2_SURGE, S2_SURGE + 120], [400, 550], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const margin = 1000 - 300 - 100 - 100 - adsVal;
  const varCosts = 300 + 100 + 100 + adsVal;
  const neg = margin < 0;

  const items = [
    {label: 'سعر البيع', a: 0, b: 1000, color: C.white},
    {label: 'خامات', a: 1000, b: 700, color: C.red, v: 300},
    {label: 'شحن', a: 700, b: 600, color: C.red, v: 100},
    {label: 'بوابة دفع', a: 600, b: 500, color: C.red, v: 100},
    {label: 'إعلانات', a: 500, b: 500 - adsVal, color: C.red, v: adsVal},
    {label: 'الهامش', a: 0, b: margin, color: neg ? C.red : C.green},
  ];

  const y = (v: number) => ZERO - v * SC;

  return (
    <Scene dur={S.s2.dur}>
      <KText at={5} top={90} size={60}>
        تفكيك اقتصاديات الوحدة
      </KText>
      <KText at={20} top={175} size={38} color={C.dim} weight={700} ltr>
        Unit Economics
      </KText>

      {/* live readouts */}
      <div className="absolute w-full flex justify-around" style={{top: 270, direction: 'rtl'}}>
        {[
          {t: 'سعر البيع', v: '1,000', c: C.white},
          {t: 'التكاليف المتغيرة', v: fmt(varCosts), c: C.red},
          {t: 'هامش المساهمة', v: fmt(margin), c: neg ? C.red : C.green},
        ].map((r, i) => (
          <div key={i} style={{textAlign: 'center', opacity: prog(f, 20 + i * 15, 45 + i * 15)}}>
            <div style={{fontSize: 34, color: C.dim, fontWeight: 700}}>{r.t}</div>
            <div style={{fontSize: 74, color: r.c, fontWeight: 900, direction: 'ltr', fontVariantNumeric: 'tabular-nums'}}>
              {r.v} <span style={{fontSize: 30}}>ج.م</span>
            </div>
          </div>
        ))}
      </div>

      {/* waterfall */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, top: 380}}>
        <line x1={50} y1={ZERO} x2={1030} y2={ZERO} stroke={C.slate} strokeWidth={3} />
        {items.map((it, i) => {
          const rp = prog(f, S2_REVEAL[i], S2_REVEAL[i] + 40);
          if (rp <= 0) return null;
          const top = Math.min(y(it.a), y(it.b));
          const hh = Math.abs(y(it.a) - y(it.b)) * rp;
          const yy = it.b >= it.a ? y(it.b) + (Math.abs(y(it.a) - y(it.b)) - hh) : top;
          const x = colX(i);
          const showLabelY = Math.max(y(it.a), y(it.b)) + 46;
          const valTxt = i === 0 ? '1,000' : i === 5 ? fmt(margin) : '-' + fmt(it.v ?? 0);
          return (
            <g key={i} opacity={rp}>
              <rect x={x} y={yy} width={COLW} height={Math.max(hh, 4)} fill={it.color} rx={4} />
              <text x={x + COLW / 2} y={Math.min(y(it.a), y(it.b)) - 18} textAnchor="middle" fontSize={44} fontWeight={900} fill={it.color} style={{fontVariantNumeric: 'tabular-nums'}}>
                {valTxt}
              </text>
              <text x={x + COLW / 2} y={Math.max(showLabelY, ZERO + 60)} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.dim}>
                {it.label}
              </text>
              {i > 0 && i < 5 && (
                <line x1={x + COLW} y1={y(it.a)} x2={x + COLW + GAP} y2={y(it.a)} stroke={C.slate} strokeWidth={2} strokeDasharray="6 5" />
              )}
            </g>
          );
        })}
      </svg>

      <KText at={S2_REVEAL[5] + 40} top={1290} size={44} color={C.green} weight={700} style={{opacity: f > S2_SURGE ? 0 : undefined}}>
        باقي لك من كل بيعة: 100 ج.م فقط
      </KText>

      <KText at={S2_SURGE - 20} top={1290} size={52} color={C.red} style={{opacity: f < S2_SURGE - 20 ? 0 : 1}}>
        المنافسة ترفع الإعلان: 400 ← 550
      </KText>
      <KText at={S2_SURGE + 130} top={1390} size={64} color={C.red}>
        خسارة 50 ج.م في كل بيعة!
      </KText>

      <KText at={S2_LOSS} top={1500} size={44} color={C.dim} weight={700}>
        تبيع 1,000 قطعة
      </KText>
      <KText at={S2_LOSS + 40} top={1580} size={120} color={C.red} ltr>
        -50,000 ج.م
      </KText>
      <KText at={S2_LOSS + 90} top={1740} size={44} color={C.white} weight={700}>
        كاش بينزف من الخزينة بدون ما تحس
      </KText>
    </Scene>
  );
};
