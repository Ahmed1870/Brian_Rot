import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, lerp, prog, sec} from '../kit';

// Scene 4 (frames 4050-5400, global 135-180s): mobile conversion analytics dashboard (illustrative data).
const S = 135;
const STEPS = [
  {t: 'مشاهدات', w: 1.0, v: '100%'},
  {t: 'اهتمام', w: 0.62, v: '62%'},
  {t: 'عميل مؤهل', w: 0.14, v: '14%'},
  {t: 'صفقة', w: 0.05, v: '5%'},
];

const panel: React.CSSProperties = {
  position: 'absolute',
  left: 80,
  right: 80,
  background: C.panel,
  border: `2px solid ${C.line}`,
  borderRadius: 24,
  boxSizing: 'border-box',
  direction: 'rtl',
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const kpi = prog(f, sec(144.8 - S), 30);
  const cmpIn = prog(f, sec(158 - S), 30);
  const costIn = prog(f, sec(158.5 - S), sec(4));
  const fun = prog(f, sec(5), 28);
  const drop = prog(f, sec(166.9 - S), 25);
  const BW = 700;

  return (
    <Fade dur={1350}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 150}}>
        <Kinetic text="تحليل كفاءة التحويل" start={sec(0.6)} size={78} />
        <Kinetic text="[[Conversion Analytics]]" start={sec(2)} size={44} color={C.slate400} weight={600} />
      </div>

      {/* KPI row */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 400, display: 'flex', gap: 24, direction: 'rtl', opacity: kpi, transform: `translateY(${(1 - kpi) * 30}px)`}}>
        {[
          {l: 'Attention Ratio', v: `${(lerp(0, 3.1, kpi)).toFixed(1)}%`, c: C.white},
          {l: 'Qualified Close Rate', v: `${Math.round(lerp(0, 24, kpi))}%`, c: C.emerald},
        ].map((k) => (
          <div key={k.l} style={{flex: 1, background: C.panel, border: `2px solid ${C.line}`, borderRadius: 24, padding: '28px 30px', boxSizing: 'border-box'}}>
            <div dir="ltr" style={{fontFamily: FONT, fontSize: 32, color: C.slate400, textAlign: 'right'}}>{k.l}</div>
            <div style={{fontFamily: FONT, fontSize: 88, fontWeight: 700, color: k.c, lineHeight: 1.15}}>
              <L>{k.v}</L>
            </div>
          </div>
        ))}
      </div>

      {/* Cost comparison */}
      <div style={{...panel, top: 660, height: 440, padding: '36px 40px', opacity: cmpIn, transform: `translateY(${(1 - cmpIn) * 30}px)`}}>
        <div style={{fontFamily: FONT, fontSize: 40, fontWeight: 700, color: C.white}}>
          <L>Cost per Attention</L> مقابل <L>Cost per Qualified Lead</L>
        </div>
        <div style={{marginTop: 40, fontFamily: FONT, fontSize: 34, color: C.slate400}}>تكلفة الانتباه</div>
        <div style={{position: 'relative', height: 30, marginTop: 10}}>
          <div style={{position: 'absolute', right: 0, height: 30, width: BW * 0.07 * costIn, background: C.slate400, borderRadius: 15}} />
        </div>
        <div style={{marginTop: 34, fontFamily: FONT, fontSize: 34, color: C.slate400}}>تكلفة العميل المؤهل</div>
        <div style={{position: 'relative', height: 30, marginTop: 10}}>
          <div style={{position: 'absolute', right: 0, height: 30, width: BW * 0.9 * costIn, background: C.white, borderRadius: 15}} />
        </div>
      </div>

      {/* Funnel drop-off */}
      <div style={{...panel, top: 1140, height: 620, padding: '36px 40px', opacity: fun}}>
        <div style={{fontFamily: FONT, fontSize: 40, fontWeight: 700, color: C.white}}>أين يتراجع العميل؟</div>
        {STEPS.map((s, i) => {
          const g = prog(f, sec(6 + i * 0.5), 30);
          const hot = i === 2 ? drop : 0;
          return (
            <div key={s.t} style={{marginTop: 34}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontSize: 34, color: hot > 0.5 ? C.crimson : C.slate400}}>
                <span>{s.t}</span>
                <L>{s.v}</L>
              </div>
              <div style={{position: 'relative', height: 28, marginTop: 8}}>
                <div style={{position: 'absolute', right: 0, height: 28, width: BW * s.w * g, background: hot > 0.5 ? C.crimson : i === 3 ? C.emerald : C.slate500, borderRadius: 14}} />
              </div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 40, bottom: 28, fontFamily: FONT, fontSize: 34, fontWeight: 700, color: C.crimson, opacity: drop}}>نقطة التراجع ←</div>
      </div>
      <div style={{position: 'absolute', right: 80, top: 1790, fontFamily: FONT, fontSize: 22, color: C.slate600, direction: 'rtl'}}>بيانات توضيحية</div>
    </Fade>
  );
};
