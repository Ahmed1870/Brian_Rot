import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, clamp, lerp, pop, prog, sec} from '../kit';

// SC03 (frames 2667-3879, global 88.9-129.3s): B-Tree index scan (pre-sorted) vs QuickSort in work_mem (+ disk spill).
const S = 88.9;
const t = (g: number) => sec(g - S);

const quickSteps = (): number[][] => {
  const a = [7, 3, 11, 2, 9, 5, 1, 8, 4, 12, 6, 10];
  const out = [a.slice()];
  const qs = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const p = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] < p) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
        out.push(a.slice());
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    out.push(a.slice());
    qs(lo, i - 1);
    qs(i + 1, hi);
  };
  qs(0, a.length - 1);
  return out;
};
const QS = quickSteps();

const LEAVES = [
  [1, 2],
  [3, 4],
  [5, 6],
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const ed = prog(f, t(89.6), 16);
  const decision = prog(f, t(94.5), 22);
  const leftOn = prog(f, t(99.4), 22);
  const laser = prog(f, t(106.2), sec(2.2));
  const zero = pop(f, t(107.6));
  const rightOn = prog(f, t(109.2), 22);
  const fetch = prog(f, t(110.0), sec(4.2));
  const qs = prog(f, t(115.6), sec(5.6));
  const step = QS[Math.min(QS.length - 1, Math.floor(qs * (QS.length - 1)))];
  const spill = prog(f, t(122.0), sec(3.6));
  const slow = pop(f, t(126.0));
  const pulse = 0.5 + 0.5 * Math.sin(f / 8);

  // B-tree geometry (left panel, local coordinates of an 840x560 area)
  const leafX = [90, 290, 490];
  const reveal = (i: number) => clamp(laser * 3.2 - i);

  return (
    <Stage dur={1212} inFx="left" outFx="up">
      <TopBadge text="كواليس الفرز | Sort Engine Mechanics" from={t(90.4)} to={t(104)} color={C.blue} />

      <Editor x={90} y={150} w={900} h={130} title="query.sql" lines={['SELECT * FROM orders ORDER BY order_date;']} start={t(90.4)} cps={1.2} size={26} accent={C.border} opacity={ed} />

      {/* decision */}
      <div dir="ltr" style={{position: 'absolute', left: 1040, top: 150, width: 790, height: 130, borderRadius: 22, background: C.card, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, opacity: decision}}>
        <span style={{fontFamily: MONO, fontSize: 28, color: C.text}}>Index on the sort column?</span>
        <Chip color={C.green} style={{opacity: leftOn > 0.1 ? 1 : 0.4}}>YES</Chip>
        <Chip color={C.amber} style={{opacity: rightOn > 0.1 ? 1 : 0.4}}>NO</Chip>
      </div>

      {/* LEFT: B-tree index scan */}
      <div style={{position: 'absolute', left: 90, top: 320, width: 840, height: 580, borderRadius: 24, background: C.card, border: `2px solid ${leftOn > 0.5 ? C.green : C.border}`, boxShadow: laser > 0 ? `0 0 ${40 * pulse}px ${C.green}33` : 'none', opacity: lerp(0.4, 1, leftOn), overflow: 'hidden'}}>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 22}}>
          <Chip color={C.green}>B-Tree Index Scan</Chip>
        </div>
        <svg width={840} height={580} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={250} y={110} width={140} height={54} rx={12} fill={C.deep} stroke={C.green} strokeWidth={3} />
          <text x={320} y={146} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.green}>root</text>
          {leafX.map((x, i) => (
            <g key={i}>
              <line x1={320} y1={164} x2={x + 60} y2={250} stroke={C.green} strokeWidth={3} opacity={0.6} />
              <rect x={x} y={250} width={120} height={64} rx={12} fill={C.deep} stroke={reveal(i) > 0.3 ? C.green : C.border} strokeWidth={3} />
              <text x={x + 60} y={290} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={reveal(i) > 0.3 ? C.green : C.muted}>{LEAVES[i].join(' · ')}</text>
            </g>
          ))}
          {/* sorted output stream */}
          <line x1={80} y1={330} x2={80 + 600 * clamp(laser)} y2={330} stroke={C.green} strokeWidth={6} strokeLinecap="round" opacity={laser > 0 && laser < 1 ? 1 : 0} />
          <text x={80} y={455} fontFamily={MONO} fontSize={22} fill={C.muted}>pre-sorted output</text>
          {[1, 2, 3, 4, 5, 6].map((n, i) => {
            const show = clamp(laser * 6.2 - i);
            return (
              <g key={n} opacity={show} transform={`translate(${80 + i * 100} ${480 + (1 - show) * -40})`}>
                <rect width={84} height={56} rx={12} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} />
                <text x={42} y={38} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.green}>{n}</text>
              </g>
            );
          })}
        </svg>
        <div dir="ltr" style={{position: 'absolute', right: 26, top: 24, textAlign: 'right', fontFamily: MONO}}>
          <div style={{fontSize: 20, color: C.muted}}>RAM used</div>
          <div style={{fontSize: 40, fontWeight: 700, color: C.green}}>0 MB</div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 28, bottom: 18, transform: `scale(${clamp(zero)})`, transformOrigin: 'left bottom', opacity: clamp(zero)}}>
          <Chip color={C.green} style={{fontSize: 24}}>Zero-Cost Pre-Sorted Data Retrieval ✓</Chip>
        </div>
      </div>

      {/* RIGHT: work_mem QuickSort */}
      <div style={{position: 'absolute', left: 990, top: 320, width: 840, height: 580, borderRadius: 24, background: C.card, border: `2px solid ${rightOn > 0.5 ? C.amber : C.border}`, opacity: lerp(0.4, 1, rightOn), overflow: 'hidden'}}>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 22}}>
          <Chip color={C.amber}>QuickSort in work_mem</Chip>
        </div>
        <svg width={840} height={580} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={40} y={110} width={560} height={300} rx={18} fill={C.deep} stroke={C.amber} strokeWidth={3} strokeDasharray="12 8" />
          <text x={60} y={140} fontFamily={MONO} fontSize={20} fill={C.amber}>work_mem (RAM)</text>
          {step.map((v, i) => {
            const inFetch = clamp(fetch * 13 - i);
            return <rect key={i} x={60 + i * 44} y={390 - v * 20} width={34} height={v * 20} rx={6} fill={C.amber} opacity={0.35 + 0.65 * inFetch} />;
          })}
          {/* spill bars flowing to disk */}
          {[0, 1, 2, 3, 4].map((i) => {
            const p = clamp(spill * 1.6 - i * 0.18);
            return <rect key={i} x={lerp(520, 690, p)} y={lerp(330, 430, p)} width={30} height={46} rx={6} fill={C.red} opacity={p > 0 && p < 1 ? 1 : p >= 1 ? 0.6 : 0} />;
          })}
          <g transform="translate(715 470)" opacity={clamp(spill * 2)}>
            <ellipse cx={0} cy={50} rx={62} ry={18} fill="#7F1D1D" />
            <rect x={-62} y={-10} width={124} height={60} fill="#B91C1C" />
            <ellipse cx={0} cy={-10} rx={62} ry={18} fill={C.red} />
          </g>
          <text x={715} y={560} textAnchor="middle" fontFamily={MONO} fontSize={19} fill={C.red} opacity={clamp(spill * 2)}>Disk Spilling</text>
        </svg>
        <div dir="ltr" style={{position: 'absolute', left: 28, bottom: 24, display: 'flex', gap: 14, opacity: clamp(slow)}}>
          <Chip color={C.red} style={{fontSize: 22, transform: `scale(${clamp(slow)})`}}>Slow query ✕</Chip>
        </div>
      </div>

      <Caption text="B-Tree Index Scan ──► Zero-Cost Pre-Sorted Data Retrieval" from={t(100)} to={t(108.5)} />
      <Caption text="In-Memory QuickSort (work_mem) ──► RAM Sort Overhead" from={t(110)} to={t(127.5)} />
    </Stage>
  );
};
