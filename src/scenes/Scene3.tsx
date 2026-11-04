import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Cell, Chip, Editor, Stage, TopBadge, clamp, lin, pop, sec} from '../kit';
import {PRICES, PRICE_SET} from '../data';

// SC03 (85-130s): > ANY vs > ALL on a price ruler.
// Anchors (s): 86.1 also | 95.0 ANY | 98.2 checks | 105.2 "> ANY" equals | 110.0 ALL | 118.3 "> ALL" | 122.9 enables
const S = START.s3;
const t = (g: number) => sec(g - S);
const X = (v: number) => 160 + v * 3.6;
const RY = 560;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const anyOn = lin(f, t(95.0), 18);
  const allOn = lin(f, t(110.0), 18);
  const anyDim = clamp(lin(f, t(110.0), 20));
  const anyEval = f >= t(98.2);
  const allEval = f >= t(114.5);

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="مقارنة المصفوفات | Array Comparison: ANY & ALL" from={sec(2)} to={sec(40)} color={C.green} />

      <div style={{opacity: clamp(lin(f, t(95.0), 16))}}>
        <Editor x={80} y={180} w={860} h={130} title="ANY" lines={['WHERE price > ANY (100, 200, 300)']} start={t(95.0)} cps={1.0} size={30} accent={C.green} />
      </div>
      <div style={{opacity: clamp(lin(f, t(110.0), 16))}}>
        <Editor x={980} y={180} w={860} h={130} title="ALL" lines={['WHERE price > ALL (100, 200, 300)']} start={t(110.0)} cps={1.0} size={30} accent={C.amber} />
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {/* zones */}
        <rect x={X(100)} y={400} width={X(450) - X(100)} height={320} fill={C.green} opacity={0.12 * anyOn * (1 - 0.8 * anyDim)} />
        <rect x={X(300)} y={400} width={X(450) - X(300)} height={320} fill={C.amber} opacity={0.16 * allOn} />
        {/* ruler */}
        <line x1={X(0)} y1={RY} x2={X(450)} y2={RY} stroke={C.border} strokeWidth={6} strokeLinecap="round" />
        {[0, 100, 200, 300, 400].map((v) => (
          <g key={v}>
            <line x1={X(v)} y1={RY - 10} x2={X(v)} y2={RY + 10} stroke={C.muted} strokeWidth={3} />
            <text x={X(v)} y={RY + 42} fill={C.muted} fontSize={22} fontFamily={MONO} textAnchor="middle">{v}</text>
          </g>
        ))}
        {/* threshold lines */}
        <line x1={X(100)} y1={380} x2={X(100)} y2={380 + 340 * anyOn} stroke={C.green} strokeWidth={5} opacity={1 - 0.6 * anyDim} />
        <line x1={X(300)} y1={380} x2={X(300)} y2={380 + 340 * allOn} stroke={C.amber} strokeWidth={5} />
        <text x={X(100)} y={366} fill={C.green} fontSize={28} fontFamily={MONO} fontWeight={700} textAnchor="middle" opacity={anyOn}>MIN = 100</text>
        <text x={X(300)} y={366} fill={C.amber} fontSize={28} fontFamily={MONO} fontWeight={700} textAnchor="middle" opacity={allOn}>MAX = 300</text>
        {/* set markers */}
        {PRICE_SET.map((v, i) => {
          const p = clamp(pop(f, t(86.6 + i * 0.6)));
          return (
            <g key={v} opacity={p}>
              <circle cx={X(v)} cy={RY} r={20 * p} fill={C.blue} stroke={C.bg} strokeWidth={4} />
              <text x={X(v)} y={RY - 34} fill={C.blue} fontSize={26} fontFamily={MONO} fontWeight={700} textAnchor="middle">{v}</text>
            </g>
          );
        })}
      </svg>
      <div dir="ltr" style={{position: 'absolute', left: 160, top: 640, fontFamily: MONO, fontSize: 24, color: C.blue, opacity: clamp(lin(f, t(86.1), 16))}}>subquery → [100, 200, 300]</div>

      {/* product dots */}
      {PRICES.map((p, i) => {
        const show = clamp(lin(f, t(89 + i * 0.5), 14));
        const passAny = p.p > 100;
        const passAll = p.p > 300;
        let color: string = C.muted;
        let mark = '';
        if (allEval) {
          color = passAll ? C.amber : '#475569';
          mark = passAll ? '✓' : '✗';
        } else if (anyEval && f < t(110)) {
          color = passAny ? C.green : C.red;
          mark = passAny ? '✓' : '✗';
        }
        return (
          <div key={p.n} dir="ltr" style={{position: 'absolute', left: X(p.p) - 70, top: 760, width: 140, textAlign: 'center', opacity: show, transform: `translateY(${(1 - show) * 24}px)`}}>
            <div style={{margin: '0 auto', width: 56, height: 56, borderRadius: 28, border: `4px solid ${color}`, background: `${color}33`, color, fontFamily: MONO, fontSize: 30, fontWeight: 700, lineHeight: '48px'}}>{mark}</div>
            <div style={{fontFamily: MONO, fontSize: 22, color: C.text, marginTop: 6}}>{p.n}</div>
            <div style={{fontFamily: MONO, fontSize: 22, color}}>{p.p}</div>
          </div>
        );
      })}
      <div dir="ltr" style={{position: 'absolute', right: 80, top: 680, display: 'flex', gap: 14, opacity: clamp(lin(f, t(122.9), 16))}}>
        <Chip color={C.green}>&gt; ANY → 4 rows</Chip>
        <Chip color={C.amber}>&gt; ALL → 2 rows</Chip>
      </div>

      <Caption text="> ANY ([100, 200, 300]) ──► Greater than MIN value (> 100)" from={t(98.2)} to={t(109)} />
      <Caption text="> ALL ([100, 200, 300]) ──► Greater than MAX value (> 300)" from={t(118.3)} to={sec(44.5)} />
    </Stage>
  );
};
