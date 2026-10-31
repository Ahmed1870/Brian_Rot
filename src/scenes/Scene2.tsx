import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, H, W} from '../theme';
import {Fade, Kinetic, lerp, prog, sec} from '../kit';

// Scene 2 (frames 1200-2700, global 40-90s): the system is only as fast as its slowest stage.
const S = 40;
const ROWS = [
  {ar: 'الإعلانات', unit: 'عميل', n: '400', w: 800, y: 560, g: 71.5},
  {ar: 'المبيعات', unit: 'صفقة', n: '200', w: 400, y: 860, g: 75.0},
  {ar: 'التشغيل والشحن', unit: 'طلب فقط', n: '50', w: 100, y: 1160, g: 80.3},
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const move = prog(f, sec(58 - S), 40);
  const eqTop = lerp(700, 1610, move);
  const eqScale = lerp(1.1, 0.62, move);
  const dash = -f * 2.2;
  const alert = prog(f, sec(82 - S), 20);
  const pulse = 0.55 + 0.45 * Math.sin(f / 6);
  const result = prog(f, sec(87.5 - S), 25);

  return (
    <Fade dur={1500}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 150, opacity: prog(f, sec(58 - S), 5)}}>
        <Kinetic text="نظرية الاختناقات" start={sec(58 - S)} size={82} />
        <Kinetic text="[[(Theory of Constraints)]]" start={sec(60 - S)} size={44} color={C.slate400} weight={600} />
      </div>

      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        {ROWS.slice(0, 2).map((r, i) => {
          const next = ROWS[i + 1];
          const p = prog(f, sec(next.g - S) - 10, 24);
          return (
            <line key={i} x1={540} x2={540} y1={r.y + 74} y2={next.y - 52} stroke={i === 1 ? C.crimson : C.slate500} strokeWidth={4} strokeDasharray="10 14" strokeDashoffset={dash} opacity={p} />
          );
        })}
        {ROWS.map((r, i) => {
          const p = prog(f, sec(r.g - S), 26);
          const hot = i === 2;
          return (
            <g key={r.ar} opacity={p}>
              <text x={1000} y={r.y} textAnchor="end" fontFamily={FONT} fontSize={46} fontWeight={700} fill={hot ? C.crimson : C.white}>{r.ar}</text>
              <text x={80} y={r.y} textAnchor="start" fontFamily={FONT} fontSize={92} fontWeight={700} fill={hot ? C.crimson : C.white}>{r.n}</text>
              <text x={80} y={r.y + 46} textAnchor="start" fontFamily={FONT} fontSize={32} fill={C.slate400}>{r.unit}</text>
              <rect x={540 - (r.w * p) / 2} y={r.y + 20} width={r.w * p} height={38} rx={19} fill={hot ? C.crimson : i === 0 ? C.slate400 : C.slate500} />
              {hot && <circle cx={540} cy={r.y + 39} r={46} fill="none" stroke={C.crimson} strokeWidth={4} opacity={alert * pulse} />}
            </g>
          );
        })}
        <text x={540} y={ROWS[2].y + 140} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={700} fill={C.crimson} opacity={alert}>Bottleneck</text>
      </svg>

      <div style={{position: 'absolute', left: 80, right: 80, top: 1400, textAlign: 'center', opacity: result, transform: `translateY(${(1 - result) * 20}px)`, fontFamily: FONT, fontSize: 58, fontWeight: 700, color: C.white, direction: 'rtl'}}>
        إنتاجية الشركة كلها = <span dir="ltr" style={{color: C.crimson, unicodeBidi: 'isolate', display: 'inline-block'}}>50</span> فقط
      </div>

      <div style={{position: 'absolute', left: 80, right: 80, top: eqTop, transform: `scale(${eqScale})`, transformOrigin: '50% 0%'}}>
        <Kinetic text="إنتاجية البيزنس = سرعة {{أبطأ مرحلة}}" start={sec(42 - S)} size={84} align="center" />
      </div>
    </Fade>
  );
};
