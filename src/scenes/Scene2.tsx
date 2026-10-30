import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, prog, sec} from '../kit';

// Scene 2 (frames 900-2250 = global 30s-75s): the five engines. Cues are global seconds from the voiceover.
const S = 30;
const ENG = [
  {n: 1, en: 'Value Creation', ar: 'خلق القيمة', g: 40.5},
  {n: 2, en: 'Marketing', ar: 'التسويق', g: 44.1},
  {n: 3, en: 'Sales', ar: 'المبيعات', g: 48.0},
  {n: 4, en: 'Value Delivery', ar: 'تقديم القيمة', g: 53.3},
  {n: 5, en: 'Finance', ar: 'المالية', g: 60.1},
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const e4 = sec(53.3 - S);
  const e5 = sec(60.1 - S);
  const zoomAmt = Math.max(0, prog(f, e4, 24) - prog(f, e5, 30));
  const focus = prog(f, sec(63 - S), 30);
  const bar = prog(f, e4 + 10, 30);

  return (
    <Fade dur={1350}>
      <div style={{position: 'absolute', left: 160, right: 160, top: 100}}>
        <Kinetic text="المحركات الخمسة للبيزنس" start={sec(1)} size={68} />
      </div>
      <div style={{position: 'absolute', left: 160, right: 160, top: 205, direction: 'rtl', fontFamily: FONT, fontSize: 32, color: C.slate400, opacity: prog(f, sec(2), 25)}}>
        <L>The Personal MBA</L> — <L>Josh Kaufman</L>
      </div>

      <div
        dir="rtl"
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 400,
          display: 'flex',
          alignItems: 'flex-start',
          transform: `scale(${1 + 0.12 * zoomAmt})`,
          transformOrigin: '600px 50%',
        }}
      >
        {ENG.map((e, i) => {
          const p = prog(f, sec(e.g - S), 24);
          const isFour = e.n === 4;
          const dim = isFour ? 1 : 1 - 0.55 * focus;
          const conn = i < ENG.length - 1 ? prog(f, sec(ENG[i + 1].g - S) - 6, 22) : 0;
          return (
            <React.Fragment key={e.n}>
              <div style={{width: 320, textAlign: 'center', opacity: p * dim, transform: `translateY(${(1 - p) * 40}px)`, flexShrink: 0}}>
                <div style={{fontFamily: FONT, fontSize: 170, fontWeight: 700, lineHeight: 1, color: isFour ? C.white : C.slate600}}>{e.n}</div>
                <div dir="ltr" style={{fontFamily: FONT, fontSize: 42, fontWeight: 700, color: C.white, marginTop: 18}}>{e.en}</div>
                <div style={{fontFamily: FONT, fontSize: 34, color: C.slate400, marginTop: 8}}>{e.ar}</div>
                {isFour && <div style={{height: 6, background: C.crimson, marginTop: 26, width: '70%', marginInline: 'auto', transform: `scaleX(${bar})`}} />}
              </div>
              {i < ENG.length - 1 && (
                <div style={{flex: 1, height: 3, background: C.slate700, marginTop: 85, marginInline: 16, transform: `scaleX(${conn})`, transformOrigin: 'right'}} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 160, right: 160, top: 800}}>
        <Kinetic text="تقديم القيمة هو اختبار الوعد على أرض الواقع" start={sec(66 - S)} size={54} color={C.slate400} weight={600} />
      </div>
    </Fade>
  );
};
