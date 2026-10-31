import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, H, W} from '../theme';
import {Fade, Kinetic, lerp, prog, rnd, sec} from '../kit';

// Scene 1 (frames 0-1200, global 0-40s): everyone is busy, but all flow jams at one narrow neck.
const CX = 540;
const TOP = 520;
const NECK = 1020;
const BOT = 1500;
const LANES = [-0.8, -0.4, 0, 0.4, 0.8];
const JAM0 = sec(18.7);
const JAM1 = sec(29.2);
const COUNT = 330;
const GAP = 3;

const hw = (y: number) => lerp(470, 34, Math.min(1, Math.max(0, (y - TOP) / (NECK - TOP))));

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const jam = prog(f, JAM0, 35);

  const dots: React.ReactNode[] = [];
  for (let i = 0; i < COUNT; i++) {
    const spawn = sec(0.3) + i * GAP;
    const t = (f - spawn) / (130 + rnd(i, 7) * 30);
    if (t < 0) continue;
    const lane = LANES[Math.floor(rnd(i, 5) * 5)];
    const u = lane + (rnd(i, 1) - 0.5) * 0.22;
    const passes = spawn < JAM0 ? true : rnd(i, 2) < 0.04;
    const yFree = lerp(TOP, BOT, Math.min(1, t));
    let y = yFree;
    let stopped = false;
    if (!passes) {
      const depth = 340 * Math.pow(rnd(i, 6), 0.7) * prog(spawn, JAM0, JAM1 - JAM0);
      const limit = NECK - 14 - depth;
      if (yFree >= limit) {
        y = limit;
        stopped = true;
      }
    } else if (t > 1) {
      continue;
    }
    const x = CX + u * hw(y);
    dots.push(<circle key={i} cx={x} cy={y} r={8} fill={stopped ? C.crimson : C.slate400} opacity={stopped ? 0.95 : 0.9} />);
  }

  const wall = jam > 0.3 ? C.crimson : C.slate500;
  const busy = prog(f, sec(3), 25);
  const out = prog(f, sec(18.7), 30);
  const prod = Math.round(lerp(100, 12, prog(f, sec(18.7), sec(8))));

  return (
    <Fade dur={1200} inF={1}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <polyline points={`${CX - 470},${TOP} ${CX - 34},${NECK} ${CX - 34},${NECK + 100}`} fill="none" stroke={wall} strokeWidth={5} strokeLinejoin="round" />
        <polyline points={`${CX + 470},${TOP} ${CX + 34},${NECK} ${CX + 34},${NECK + 100}`} fill="none" stroke={wall} strokeWidth={5} strokeLinejoin="round" />
        {dots}
        <text x={1000} y={400} textAnchor="end" fontFamily={FONT} fontSize={66} fontWeight={700} fill={C.white} opacity={busy}>100%</text>
        <text x={1000} y={452} textAnchor="end" fontFamily={FONT} fontSize={34} fill={C.slate400} opacity={busy}>انشغال الفريق</text>
        <text x={80} y={400} textAnchor="start" fontFamily={FONT} fontSize={66} fontWeight={700} fill={C.crimson} opacity={out}>{prod}%</text>
        <text x={80} y={452} textAnchor="start" fontFamily={FONT} fontSize={34} fill={C.slate400} opacity={out}>الإنتاج الفعلي</text>
        <text x={CX} y={BOT + 60} textAnchor="middle" fontFamily={FONT} fontSize={34} fill={C.slate500} opacity={busy}>الناتج</text>
      </svg>

      <div style={{position: 'absolute', left: 80, right: 80, top: 110}}>
        <Kinetic text="الفرق كلها شغالة... والأرباح واقفة؟" start={sec(0.8)} size={76} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1600}}>
        <Kinetic text="فخ {{انشغال الفريق المزيف}}" start={sec(18.7)} size={66} />
      </div>
      <div style={{position: 'absolute', left: 80, top: 1862, fontFamily: FONT, fontSize: 22, color: C.slate600, direction: 'rtl', opacity: out}}>بيانات توضيحية</div>
    </Fade>
  );
};
