import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, ease, lerp, prog, sec} from '../kit';

// Scene 1 (frames 0-900): the delivery gap, as a chart
const W = 1500;
const H = 520;
const N = 12;
const budget = [18, 22, 28, 35, 44, 52, 61, 70, 79, 88, 95, 100];
const ret = [92, 90, 86, 80, 72, 62, 52, 42, 34, 28, 24, 20];
const X = (i: number) => (i / (N - 1)) * W;
const Y = (v: number) => H - 20 - (v / 100) * (H - 70);
const pathOf = (a: number[]) => a.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
const headY = (a: number[], p: number) => {
  const idx = p * (N - 1);
  const i = Math.min(N - 2, Math.floor(idx));
  return Y(lerp(a[i], a[i + 1], idx - i));
};

// polygon between the lines after they cross (cross at index ~5.53)
const gapPoints = (() => {
  const pts: string[] = [`${X(5.526).toFixed(1)},${Y(56.7).toFixed(1)}`];
  for (let i = 6; i < N; i++) pts.push(`${X(i).toFixed(1)},${Y(budget[i]).toFixed(1)}`);
  for (let i = N - 1; i >= 6; i--) pts.push(`${X(i).toFixed(1)},${Y(ret[i]).toFixed(1)}`);
  return pts.join(' ');
})();

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const pB = prog(f, sec(0.5), sec(8.5));
  const pR = prog(f, sec(9.3), sec(11));
  const gapIn = prog(f, sec(20), sec(2));
  const labelIn = prog(f, sec(22.5), 25);
  const zoom = interpolate(f, [0, 22, 900], [1.28, 1.0, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const dim = 1 - 0.55 * prog(f, sec(22.5), 20);

  return (
    <Fade dur={900} inF={1} outF={10}>
      <div style={{position: 'absolute', left: 130, top: 60, width: 1660, transform: `scale(${zoom})`, transformOrigin: '50% 40%'}}>
        <svg viewBox={`-10 0 ${W + 190} ${H}`} width={1660} style={{display: 'block'}}>
          {[25, 50, 75, 100].map((v) => (
            <line key={v} x1={0} x2={W} y1={Y(v)} y2={Y(v)} stroke={C.slate600} strokeOpacity={0.35} strokeDasharray="6 10" />
          ))}
          <line x1={0} x2={W} y1={Y(0)} y2={Y(0)} stroke={C.slate500} strokeOpacity={0.6} />

          <polygon points={gapPoints} fill={C.crimson} fillOpacity={0.14 * gapIn} />

          <path d={pathOf(budget)} pathLength={1} fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - pB} />
          <circle cx={pB * W} cy={headY(budget, pB)} r={9} fill={C.white} opacity={pB > 0 ? 1 : 0} />

          <path d={pathOf(ret)} pathLength={1} fill="none" stroke={C.crimson} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - pR} />
          <circle cx={pR * W} cy={headY(ret, pR)} r={10} fill={C.crimson} opacity={pR > 0 ? 1 : 0} />

          <text x={W} y={Y(100) - 22} textAnchor="end" fill={C.white} fontFamily={FONT} fontSize={34} fontWeight={600} opacity={prog(f, sec(8), 20)}>
            ميزانية التسويق
          </text>
          <text x={W} y={Y(20) + 52} textAnchor="end" fill={C.crimson} fontFamily={FONT} fontSize={34} fontWeight={600} opacity={prog(f, sec(19), 20)}>
            العملاء المتبقون
          </text>

          <g opacity={labelIn}>
            <line x1={W + 50} x2={W + 50} y1={Y(97)} y2={Y(23)} stroke={C.crimson} strokeWidth={3} />
            <line x1={W + 38} x2={W + 62} y1={Y(97)} y2={Y(97)} stroke={C.crimson} strokeWidth={3} />
            <line x1={W + 38} x2={W + 62} y1={Y(23)} y2={Y(23)} stroke={C.crimson} strokeWidth={3} />
            <text x={W - 30} y={(Y(97) + Y(23)) / 2 + 12} textAnchor="end" fill={C.white} fontFamily={FONT} fontSize={44} fontWeight={700}>
              فجوة التسليم
            </text>
          </g>
        </svg>
      </div>

      <div style={{position: 'absolute', left: 160, right: 160, top: 650, opacity: dim}}>
        <Kinetic text="الشركات لا تفشل بسبب نقص المبيعات..." start={sec(1)} size={72} />
      </div>
      <div style={{position: 'absolute', left: 160, right: 160, top: 790}}>
        <Kinetic text="المشكلة في {{فجوة التسليم}} [[!(Delivery Gap)]]" start={sec(22.5)} size={72} />
      </div>
    </Fade>
  );
};
