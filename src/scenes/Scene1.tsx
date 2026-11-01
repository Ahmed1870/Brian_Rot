import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Bottom, Canvas, Fade, Kinetic, Show, Top, prog, rnd, sec} from '../kit';

// Scene 1 (frames 0-1050, global 0-35s): 20 charts of noise, then a blackout and a single number.
const CELL_W = 240;
const CELL_H = 150;

const MiniChart: React.FC<{k: number; f: number}> = ({k, f}) => {
  const col = k % 4;
  const row = Math.floor(k / 4);
  const x = 30 + col * (CELL_W + 20);
  const y = 13 + row * (CELL_H + 26);
  const appear = prog(f, sec(0.5) + k * 5, 16);
  const off = prog(f, sec(28.9) + k * 2, 8);
  const noise = prog(f, sec(10.3), 30);
  const stroke = interpolateColors(noise, [0, 1], [C.slate400, k % 2 === 0 ? C.crimson : C.slate400]);
  const type = k % 4;
  const pts = Array.from({length: 8}, (_, i) => ({
    x: 18 + (i * (CELL_W - 36)) / 7,
    y: 128 - (0.2 + 0.75 * rnd(k * 9 + i, 3)) * 80,
  }));
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const flick = 0.85 + 0.15 * Math.sin(f / 7 + k);
  return (
    <g transform={`translate(${x} ${y})`} opacity={appear * (1 - off) * flick}>
      <rect width={CELL_W} height={CELL_H} rx={12} fill={C.panel} stroke={C.line} strokeWidth={2} />
      <rect x={18} y={16} width={60 + rnd(k, 8) * 70} height={8} rx={4} fill={C.slate600} />
      {type === 0 && <path d={line} fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />}
      {type === 1 &&
        pts.slice(0, 6).map((p, i) => (
          <rect key={i} x={20 + i * 34} y={p.y} width={22} height={132 - p.y} rx={3} fill={stroke} opacity={0.9} />
        ))}
      {type === 2 && <path d={`${line} L${pts[7].x} 132 L${pts[0].x} 132 Z`} fill={stroke} fillOpacity={0.3} stroke={stroke} strokeWidth={3} />}
      {type === 3 && (
        <g>
          <path d={line} fill="none" stroke={stroke} strokeWidth={3} />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={5} fill={stroke} />
          ))}
        </g>
      )}
    </g>
  );
};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const t20 = prog(f, sec(29.2), 10) * (1 - prog(f, sec(30.6), 10));
  const one = prog(f, sec(30.9), 18);

  return (
    <Fade dur={1050} inF={1}>
      <Top>
        <Kinetic text="20 مؤشر في التقارير... وبدون نمو؟" start={sec(0.5)} size={74} />
      </Top>

      <Canvas>
        {Array.from({length: 20}).map((_, k) => (
          <MiniChart key={k} k={k} f={f} />
        ))}
        <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontSize={400} fontWeight={700} fill={C.crimson} opacity={t20} transform={`translate(0 0) scale(1)`}>20</text>
        <g opacity={one} transform={`translate(540 ${440}) scale(${1.5 - 0.5 * one}) translate(-540 -440)`}>
          <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontSize={460} fontWeight={700} fill={C.white}>1</text>
          <text x={540} y={700} textAnchor="middle" fontFamily={FONT} fontSize={44} fill={C.slate400}>رقم واحد فقط</text>
        </g>
      </Canvas>

      <Bottom>
        <Show from={sec(10.3)} to={sec(28.5)}>
          <Kinetic text="فخ {{تشتت لوحات القيادة}}" start={sec(10.3)} size={72} />
          <Kinetic text="[[Dashboard Paralysis]]" start={sec(11.8)} size={42} color={C.slate400} weight={600} />
        </Show>
        <Show from={sec(31.6)}>
          <Kinetic text="مفيش حد عنده إجابة {{موحدة}}" start={sec(31.6)} size={68} />
        </Show>
      </Bottom>
    </Fade>
  );
};
