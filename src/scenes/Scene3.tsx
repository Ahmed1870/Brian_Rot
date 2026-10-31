import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, H, W} from '../theme';
import {Fade, Kinetic, L, lerp, prog, sec} from '../kit';

// Scene 3 (frames 2700-4200, global 90-140s): first the pile-up from pushing ads, then the cycle-time collapse.
const S = 90;
const PHASE_B = 16.7; // local seconds (global 106.7)

// Phase A: crimson pile at the gate
const PILE_COLS = 5;
const PILE_ROWS = 8;

// Phase B: cycle-time bar
const BAR_X = 380;
const BAR_W = 90;
const BAR_TOP = 520;
const WORK = 56;
const GAP_BASE = 150;
const GAPS = [
  {t: 'انتظار موافقة المدير', g: 125.1},
  {t: 'انتظار بين قسم وقسم', g: 127.7},
  {t: 'نماذج وتطبيقات معقدة', g: 130.3},
  {t: 'خطوة بلا قيمة للعميل', g: 134.2},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const aOut = 1 - prog(f, sec(PHASE_B - 0.8), 18);
  const bIn = prog(f, sec(PHASE_B), 24);

  // ---- Phase A
  const blocks: React.ReactNode[] = [];
  const total = PILE_COLS * PILE_ROWS;
  for (let k = 0; k < total; k++) {
    const row = Math.floor(k / PILE_COLS);
    const col = k % PILE_COLS;
    const p = prog(f, sec(3) + k * 8, 20);
    if (p <= 0) continue;
    const x = 540 - (PILE_COLS * 62) / 2 + col * 62;
    const y = 1180 - (row + 1) * 46 - (1 - p) * 120;
    blocks.push(<rect key={k} x={x} y={y} width={54} height={38} rx={6} fill={C.crimson} opacity={p * (0.55 + 0.45 * (1 - row / PILE_ROWS))} />);
  }
  const cons = [
    {t: 'ربكة تشغيلية', g: 102.7},
    {t: 'تلف في الجودة', g: 103.8},
    {t: 'تراكم الديون', g: 104.9},
  ];

  // ---- Phase B
  let yy = BAR_TOP;
  const segs: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];
  let avgC = 0;
  for (let i = 0; i < 9; i++) {
    if (i % 2 === 0) {
      segs.push(<rect key={`w${i}`} x={BAR_X} y={yy} width={BAR_W} height={WORK} rx={8} fill={C.emerald} />);
      yy += WORK;
    } else {
      const gi = (i - 1) / 2;
      const c = prog(f, sec(135.6 - S) + gi * 8, 40);
      avgC += c / 4;
      const h = lerp(GAP_BASE, 12, c);
      segs.push(<rect key={`g${i}`} x={BAR_X} y={yy} width={BAR_W} height={h} fill={C.slate700} opacity={1 - c} />);
      segs.push(<rect key={`e${i}`} x={BAR_X} y={yy} width={BAR_W} height={h} fill={C.emerald} opacity={c} />);
      const lp = prog(f, sec(GAPS[gi].g - S), 22);
      labels.push(
        <g key={`l${i}`} opacity={lp * (1 - c)}>
          <line x1={BAR_X + BAR_W + 16} x2={BAR_X + BAR_W + 70} y1={yy + h / 2} y2={yy + h / 2} stroke={C.slate500} strokeDasharray="4 8" />
          <text x={1000} y={yy + h / 2 + 12} textAnchor="end" fontFamily={FONT} fontSize={38} fill={C.slate400}>{GAPS[gi].t}</text>
        </g>,
      );
      yy += h;
    }
  }
  const days = Math.round(lerp(12, 4, avgC));
  const done = prog(f, sec(139 - S), 20);

  return (
    <Fade dur={1500}>
      {/* Phase A */}
      <div style={{opacity: aOut}}>
        <div style={{position: 'absolute', left: 80, right: 80, top: 150}}>
          <Kinetic text="زيادة الإعلانات قبل حل الاختناق" start={sec(92 - S)} size={64} />
          <Kinetic text="= {{ضغط}} لا نمو" start={sec(98.9 - S)} size={64} color={C.white} />
        </div>
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <line x1={540 - 170} x2={540 + 170} y1={1182} y2={1182} stroke={C.slate500} strokeWidth={4} />
          <rect x={540 - 22} y={1182} width={44} height={70} fill={C.slate600} opacity={0.6} />
          {blocks}
          <text x={540} y={1300} textAnchor="middle" fontFamily={FONT} fontSize={36} fill={C.slate500}>الاختناق</text>
          <path d="M120 760 L120 560 M90 600 L120 560 L150 600" fill="none" stroke={C.emerald} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={prog(f, sec(94 - S), 20)} />
          <text x={120} y={820} textAnchor="middle" fontFamily={FONT} fontSize={34} fill={C.slate400} opacity={prog(f, sec(94 - S), 20)}>الإعلانات</text>
        </svg>
        {cons.map((c) => {
          const p = prog(f, sec(c.g - S), 20);
          return (
            <div key={c.t} style={{position: 'absolute', left: 80, right: 80, top: 1380 + cons.indexOf(c) * 100, direction: 'rtl', fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.crimson, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
              ✕ {c.t}
            </div>
          );
        })}
      </div>

      {/* Phase B */}
      <div style={{opacity: bIn}}>
        <div style={{position: 'absolute', left: 80, right: 80, top: 150}}>
          <Kinetic text="إزالة الهدر وتقليل الـ [[Cycle Time]]" start={sec(PHASE_B + 0.3)} size={70} />
        </div>
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          {segs}
          {labels}
        </svg>
        <div style={{position: 'absolute', left: 80, top: 520, width: 240, direction: 'rtl'}}>
          <div style={{fontFamily: FONT, fontSize: 34, color: C.slate400}}>زمن الدورة</div>
          <div style={{fontFamily: FONT, fontSize: 130, fontWeight: 700, lineHeight: 1.05, color: days <= 5 ? C.emerald : C.white}}>
            <L>{days}</L>
          </div>
          <div style={{fontFamily: FONT, fontSize: 38, color: C.slate400}}>يوم</div>
        </div>
        <div style={{position: 'absolute', left: 80, right: 80, top: 1580}}>
          <Kinetic text="إلغاء الانتظار ← {{تسريع}} تدفق العمل" start={sec(135.6 - S)} size={56} color={C.white} />
        </div>
        <div style={{position: 'absolute', left: 80, top: 1862, fontFamily: FONT, fontSize: 22, color: C.slate600, direction: 'rtl', opacity: done}}>بيانات توضيحية</div>
      </div>
    </Fade>
  );
};
