import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {mono} from '../fonts';
import {Caption, Panel, Scene, Title, prog} from '../common';

const BASE = 760; // chart baseline y
const K = 3.1; // px per $K

const Bar: React.FC<{cx: number; value: number; ghost?: number; color: string; p: number; label: string; labelColor?: string}> = ({cx, value, ghost, color, p, label, labelColor = C.text}) => (
  <g>
    {ghost !== undefined && <rect x={cx - 100} y={BASE - ghost * K} width={200} height={ghost * K} rx={8} fill="none" stroke={C.dim} strokeWidth={3} strokeDasharray="10 8" opacity={p} />}
    <rect x={cx - 100} y={BASE - value * K * p} width={200} height={value * K * p} rx={8} fill={color} />
    <text x={cx} y={BASE - value * K * p - 16} textAnchor="middle" fontSize={38} fontWeight={700} fill={labelColor} fontFamily={mono} opacity={p}>${Math.round(value * p)}K</text>
    <text x={cx} y={BASE + 44} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.dim} fontFamily={mono}>{label}</text>
  </g>
);

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const pw = prog(f, 80, 330); // wrong chart grow
  const pr = prog(f, 760, 1010); // right chart grow
  const block = prog(f, 360, 440);

  return (
    <Scene dur={S.s5.dur}>
      <Title ar="الأثر التحليلي في تقارير المبيعات" en="GROUP BY on a global business day" />

      <Panel x={80} y={200} w={840} h={660} stroke={C.red} style={{opacity: prog(f, 20, 50)}} />
      <Panel x={1000} y={200} w={840} h={660} stroke={C.green} style={{opacity: prog(f, 700, 740)}} />

      <div className="absolute" style={{left: 80, top: 212, width: 840, textAlign: 'center', fontFamily: mono, fontSize: 36, fontWeight: 700, color: C.red, opacity: prog(f, 30, 60)}}>GROUP BY TIMESTAMP</div>
      <div className="absolute" style={{left: 1000, top: 212, width: 840, textAlign: 'center', fontFamily: mono, fontSize: 36, fontWeight: 700, color: C.green, opacity: prog(f, 710, 740)}}>GROUP BY TIMESTAMPTZ</div>

      {/* badges inside panels, below headers */}
      <div className="absolute" style={{left: 140, top: 268, width: 720, textAlign: 'center', color: C.red, fontSize: 30, fontWeight: 900, direction: 'rtl', opacity: prog(f, 470, 500)}}>
        تنبيه تدقيق: عجز مطابقة $18K
      </div>
      <div className="absolute" style={{left: 1060, top: 268, width: 720, textAlign: 'center', color: C.green, fontSize: 30, fontWeight: 900, direction: 'rtl', opacity: prog(f, 1040, 1070)}}>
        مطابقة 100% — Perfect Match
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* LEFT: wrong day assignment */}
        <line x1={140} y1={BASE} x2={860} y2={BASE} stroke={C.line} strokeWidth={3} />
        <g opacity={prog(f, 60, 90)}>
          <Bar cx={330} value={118} ghost={100} color={C.red} p={pw} label="Nov 1" />
          <Bar cx={680} value={102} ghost={120} color={C.red} p={pw} label="Nov 2" />
        </g>
        {/* NY 11PM block that got stuck on the wrong day */}
        <g opacity={block}>
          <rect x={230} y={BASE - 118 * K * pw} width={200} height={18 * K} rx={6} fill={C.amber} />
          <text x={330} y={BASE - 118 * K * pw + 18 * K / 2 + 11} textAnchor="middle" fontSize={26} fontWeight={700} fill={C.bg} fontFamily={mono}>NY 11PM</text>
          <path d={`M 430 ${BASE - 118 * K * pw + 28} C 520 ${BASE - 118 * K * pw - 40}, 580 ${BASE - 118 * K * pw - 40}, 640 ${BASE - 118 * K * pw + 4}`} fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray="8 8" opacity={prog(f, 440, 480)} />
          <text x={535} y={BASE - 118 * K * pw - 40} textAnchor="middle" fontSize={26} fontWeight={700} fill={C.amber} fontFamily={mono} opacity={prog(f, 440, 480)}>should be Nov 2</text>
        </g>

        {/* RIGHT: aligned */}
        <g opacity={prog(f, 740, 770)}>
          <line x1={1060} y1={BASE} x2={1780} y2={BASE} stroke={C.line} strokeWidth={3} />
          <Bar cx={1250} value={100} ghost={100} color={C.green} p={pr} label="Nov 1" />
          <Bar cx={1600} value={120} ghost={120} color={C.green} p={pr} label="Nov 2" />
        </g>
      </svg>

      <Caption from={60} to={600} color={C.red} size={40}>TIMESTAMP Trap: Orders Shifted to Wrong Financial Day</Caption>
      <Caption from={750} to={1260} color={C.green} size={40}>TIMESTAMPTZ Grouping: Perfect Financial Day Alignment</Caption>
    </Scene>
  );
};
