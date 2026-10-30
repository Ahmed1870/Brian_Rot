import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, S} from '../theme';
import {KText, Scene, fmt, prog} from '../components/common';

const N = 12;
const pts = Array.from({length: N + 1}, (_, i) => {
  const x = 90 + (900 / N) * i;
  const base = 1180 - (480 * i) / N;
  const wob = i % 3 === 0 ? 0 : i % 3 === 1 ? 14 : -10;
  return {x, y: base + wob * (i > 0 ? 1 : 0)};
});

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const revenue = interpolate(f, [30, 330], [0, 1_000_000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const draw = prog(f, 60, 360); // line drawing progress
  const shatter = Math.max(0, f - 450);

  // cash line (red) draws after the shatter
  const cashP = prog(f, 480, 900);
  const cx = 90 + 900 * cashP;
  const cy = 760 + (1190 - 760) * cashP;

  return (
    <Scene dur={S.s1.dur}>
      <KText at={5} top={110} size={84}>
        تبيع بـ مليون جنيه...
      </KText>
      <KText at={420} top={215} size={110} color={C.red}>
        وتخسر؟
      </KText>

      {/* revenue counter */}
      <div className="absolute w-full text-center" style={{top: 400, direction: 'ltr', color: C.white, fontWeight: 900}}>
        <span style={{fontSize: 150, fontVariantNumeric: 'tabular-nums'}}>{fmt(revenue)}</span>
        <span style={{fontSize: 56, color: C.dim, marginLeft: 20}}>ج.م</span>
      </div>
      <KText at={40} top={590} size={40} color={C.dim} weight={700}>
        المبيعات الشهرية (Top-Line)
      </KText>

      {/* chart */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={90} y1={1200} x2={990} y2={1200} stroke={C.slate} strokeWidth={3} />
        <line x1={90} y1={640} x2={90} y2={1200} stroke={C.slate} strokeWidth={3} />

        {pts.slice(0, -1).map((p, i) => {
          const q = pts[i + 1];
          const segP = Math.max(0, Math.min(1, draw * N - i));
          if (segP <= 0) return null;
          const k = i + 1;
          const dy = shatter * (2 + k * 0.35) * (shatter / 40);
          const rot = shatter * (i % 2 ? 0.9 : -0.9);
          const op = interpolate(shatter, [0, 80, 140], [1, 1, 0], {extrapolateRight: 'clamp'});
          const mx = (p.x + q.x) / 2;
          const my = (p.y + q.y) / 2;
          return (
            <g key={i} opacity={op} transform={`translate(0 ${dy}) rotate(${rot} ${mx} ${my})`}>
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x + (q.x - p.x) * segP}
                y2={p.y + (q.y - p.y) * segP}
                stroke={C.white}
                strokeWidth={9}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* red falling arrows = cash leaking */}
        {Array.from({length: 7}, (_, i) => {
          const start = 470 + i * 25;
          const lf = f - start;
          if (lf < 0) return null;
          const x = 140 + i * 140;
          const y = 700 + ((lf * 7) % 520);
          const o = Math.min(1, lf / 10) * interpolate(f, [900, 960], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <g key={'a' + i} opacity={o}>
              <line x1={x} y1={y - 60} x2={x} y2={y} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
              <polyline points={`${x - 26},${y - 24} ${x},${y + 6} ${x + 26},${y - 24}`} fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}

        {/* cash line */}
        {cashP > 0 && (
          <>
            <line x1={90} y1={760} x2={cx} y2={cy} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={16} fill={C.red} />
          </>
        )}
      </svg>
      <KText at={560} top={1240} size={46} color={C.red} weight={700}>
        خط السيولة النقدية ↓
      </KText>

      <KText at={620} top={1330} size={72} color={C.white}>
        فخ «وهم المبيعات الكبيرة»
      </KText>

      <KText at={800} top={1470} size={50} color={C.white} weight={700}>
        المبيعات: <span style={{color: C.white}}>1,000,000 ج.م</span>
      </KText>
      <KText at={950} top={1560} size={50} color={C.red} weight={900}>
        الخزينة: 0 ج.م
      </KText>
      <KText at={1100} top={1650} size={42} color={C.dim} weight={700}>
        المصاريف تُدفع من قروض وتأجيل التزامات الموردين
      </KText>
    </Scene>
  );
};
