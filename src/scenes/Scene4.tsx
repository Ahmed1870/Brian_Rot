import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, lerp, prog, sec} from '../kit';

// Scene 4 (frames 4200-5550, global 140-185s): operational throughput -> cash flow (illustrative numbers).
const S = 140;
const BW = 800;

const panel = (top: number, height: number, appear: number): React.CSSProperties => ({
  position: 'absolute',
  left: 80,
  right: 80,
  top,
  height,
  background: C.panel,
  border: `2px solid ${C.line}`,
  borderRadius: 24,
  boxSizing: 'border-box',
  direction: 'rtl',
  padding: '34px 40px',
  opacity: appear,
  transform: `translateY(${(1 - appear) * 40}px)`,
});

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const a1 = prog(f, sec(143 - S), 28);
  const a2 = prog(f, sec(151.7 - S), 28);
  const a3 = prog(f, sec(179.8 - S), 28);

  // WIP share of working capital: 30% -> 62% (stuck) -> 18% (released)
  const wip = lerp(30, 62, prog(f, sec(162.2 - S), sec(4))) - lerp(0, 44, prog(f, sec(170.5 - S), sec(5)));
  const cash = 100 - wip;

  // cycle-to-cash days: 30 -> 15
  const drop = prog(f, sec(176.5 - S), sec(3));
  const days = Math.round(lerp(30, 15, drop));
  const y2 = lerp(40, 170, drop);

  const checks = [
    {t: 'نفس الموارد المتاحة', g: 180.2},
    {t: 'بدون تمويل خارجي أو ديون جديدة', g: 182.6},
  ];

  return (
    <Fade dur={1350}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 130}}>
        <Kinetic text="ربط التشغيل بالتدفق النقدي" start={sec(140.5 - S)} size={74} />
        <Kinetic text="[[Throughput Accounting & Cash Flow]]" start={sec(142 - S)} size={38} color={C.slate400} weight={600} />
      </div>

      {/* Card 1: where is the money stuck */}
      <div style={panel(430, 440, a1)}>
        <div style={{fontFamily: FONT, fontSize: 42, fontWeight: 700, color: C.white}}>أين يتجمد رأس المال؟</div>
        <div style={{display: 'flex', direction: 'rtl', height: 70, marginTop: 40, borderRadius: 14, overflow: 'hidden'}}>
          <div style={{width: (BW * cash) / 100, background: C.emerald}} />
          <div style={{width: (BW * wip) / 100, background: C.crimson}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 36, direction: 'rtl'}}>
          <div>
            <div style={{fontFamily: FONT, fontSize: 34, color: C.slate400}}>تدفق نقدي صافي</div>
            <div style={{fontFamily: FONT, fontSize: 84, fontWeight: 700, color: C.emerald, lineHeight: 1.1}}><L>{Math.round(cash)}%</L></div>
          </div>
          <div style={{textAlign: 'left'}}>
            <div dir="ltr" style={{fontFamily: FONT, fontSize: 34, color: C.slate400}}>WIP</div>
            <div style={{fontFamily: FONT, fontSize: 84, fontWeight: 700, color: C.crimson, lineHeight: 1.1}}><L>{Math.round(wip)}%</L></div>
          </div>
        </div>
      </div>

      {/* Card 2: cycle-to-cash */}
      <div style={panel(910, 500, a2)}>
        <div style={{fontFamily: FONT, fontSize: 42, fontWeight: 700, color: C.white}}>زمن تحويل الطلب إلى كاش</div>
        <svg width={800} height={330} viewBox="0 0 800 330" style={{marginTop: 16}}>
          <line x1={20} x2={780} y1={290} y2={290} stroke={C.slate600} />
          <line x1={140} x2={660} y1={40} y2={40} stroke={C.slate600} strokeDasharray="6 10" />
          <line x1={140} y1={40} x2={660} y2={y2} stroke={drop > 0.5 ? C.emerald : C.crimson} strokeWidth={7} strokeLinecap="round" />
          <circle cx={140} cy={40} r={14} fill={C.crimson} />
          <circle cx={660} cy={y2} r={14} fill={drop > 0.5 ? C.emerald : C.crimson} />
          <text x={140} y={330} textAnchor="middle" fontFamily={FONT} fontSize={32} fill={C.slate400}>الآن</text>
          <text x={660} y={330} textAnchor="middle" fontFamily={FONT} fontSize={32} fill={C.slate400}>بعد إزالة الاختناق</text>
          <text x={140} y={92} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={700} fill={C.crimson}>30</text>
          <text x={660} y={y2 + 62} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={700} fill={drop > 0.5 ? C.emerald : C.crimson}>{days}</text>
          <text x={400} y={150} textAnchor="middle" fontFamily={FONT} fontSize={34} fill={C.slate400} opacity={drop}>يوم ← للنصف</text>
        </svg>
      </div>

      {/* Card 3 */}
      <div style={{...panel(1450, 300, a3), display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26}}>
        {checks.map((c) => {
          const p = prog(f, sec(c.g - S), 20);
          return (
            <div key={c.t} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
              <svg width={44} height={44} viewBox="0 0 44 44">
                <polyline points="6,24 18,36 38,8" fill="none" stroke={C.emerald} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{fontFamily: FONT, fontSize: 42, fontWeight: 600, color: C.white}}>{c.t}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', right: 80, top: 1790, fontFamily: FONT, fontSize: 22, color: C.slate600, direction: 'rtl'}}>بيانات توضيحية</div>
    </Fade>
  );
};
