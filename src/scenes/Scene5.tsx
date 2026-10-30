import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, prog, sec} from '../kit';

// Scene 5 (frames 4950-5850 = global 165s-195s): three-step roadmap
const S = 165;
const ROWS = [
  {n: 1, t: 'قياس الفجوة الميدانية', d: 'الوعد التسويقي مقابل الواقع التشغيلي', g: 167.4, y: 270},
  {n: 2, t: 'معالجة الـ Bottlenecks', d: 'إزالة نقاط الاختناق في مسار التسليم', g: 175.8, y: 500},
  {n: 3, t: 'ربط الجودة بالربحية', d: 'تكلفة التسليم مقابل هامش المساهمة لكل عميل', g: 186.9, y: 730},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Fade dur={900}>
      <div style={{position: 'absolute', left: 160, right: 160, top: 90}}>
        <Kinetic text="خارطة الطريق التنفيذية" start={sec(0.6)} size={64} />
      </div>

      {ROWS.map((r, i) => {
        const p = prog(f, sec(r.g - S), 26);
        const line = i > 0 ? prog(f, sec(r.g - S) - 8, 22) : 0;
        const prevY = i > 0 ? ROWS[i - 1].y : 0;
        return (
          <React.Fragment key={r.n}>
            {i > 0 && (
              <div style={{position: 'absolute', right: 160 + 56, width: 3, top: prevY + 140, height: (r.y - 10) - (prevY + 140), background: C.slate600, transform: `scaleY(${line})`, transformOrigin: 'top'}} />
            )}
            <div dir="rtl" style={{position: 'absolute', right: 160, top: r.y, display: 'flex', alignItems: 'flex-start', gap: 48, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
              <div style={{width: 112, textAlign: 'center', fontFamily: FONT, fontSize: 130, fontWeight: 700, lineHeight: 1, color: C.white}}>{r.n}</div>
              <div>
                <div style={{fontFamily: FONT, fontSize: 64, fontWeight: 700, color: C.white, lineHeight: 1.25}}>
                  {r.t.split(' ').map((w, k) =>
                    /[A-Za-z]/.test(w) ? (
                      <span key={k} dir="ltr" style={{unicodeBidi: 'isolate', display: 'inline-block', margin: '0 8px'}}>{w}</span>
                    ) : (
                      <span key={k} style={{margin: '0 8px'}}>{w}</span>
                    ),
                  )}
                </div>
                <div style={{fontFamily: FONT, fontSize: 34, color: C.slate400, marginTop: 8}}>{r.d}</div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div style={{position: 'absolute', left: 160, right: 160, top: 960}}>
        <Kinetic text="من الأداء الميداني إلى الربح المباشر" start={sec(190 - S)} size={44} color={C.slate400} weight={600} />
      </div>
    </Fade>
  );
};
