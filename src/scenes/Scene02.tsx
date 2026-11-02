import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

const COLS = ['id', 'first_name', 'last_name', 'email', 'phone', 'city', 'address', 'notes'];

/** semi-circle gauge, local coords */
const Gauge: React.FC<{cx: number; cy: number; r: number; v: number; color: string; label: string}> = ({cx, cy, r, v, color, label}) => {
  const a = Math.PI * (1 - v);
  const x = cx + r * Math.cos(a), y = cy - r * Math.sin(a);
  return (
    <g>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={C.line} strokeWidth={22} strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x} ${y}`} fill="none" stroke={color} strokeWidth={22} strokeLinecap="round" />
      <text x={cx} y={cy - 12} textAnchor="middle" fontFamily={mono} fontSize={54} fontWeight={700} fill={color}>{Math.round(v * 100)}%</text>
      <text x={cx} y={cy + 40} textAnchor="middle" fontFamily={mono} fontSize={26} fontWeight={700} fill={C.dim}>{label}</text>
    </g>
  );
};

const Half: React.FC<{box: typeof B.s2.left; bad: boolean}> = ({box, bad}) => {
  const f = useCurrentFrame();
  const col = bad ? C.red : C.green;
  const head = bad ? 'SELECT *' : 'SELECT first_name, email';
  const pipeH = bad ? 118 : 34;
  const pipeY = 322; // local center
  const ram = bad ? 0.95 * ease(prog(f, 60, 560)) : 0.18 * ease(prog(f, 380, 700));
  return (
    <Card box={box} accent={col} at={bad ? 8 : 24}>
      <svg width={box.w} height={box.h} style={{position: 'absolute', inset: 0}}>
        <Defs />
        <text x={32} y={74} fontFamily={mono} fontSize={fs(head, box.w - 64, 50, mono)} fontWeight={700} fill={col}>{head}</text>
        {/* column chips: 4 per row */}
        {COLS.map((c, i) => {
          const keep = bad || c === 'first_name' || c === 'email';
          const x = 32 + (i % 4) * 208, y = 110 + Math.floor(i / 4) * 58;
          return (
            <g key={c} opacity={prog(f, 30 + i * 5, 50 + i * 5)}>
              <rect x={x} y={y} width={196} height={46} rx={12} fill={keep ? (bad ? 'rgba(239,68,68,0.20)' : 'rgba(16,185,129,0.22)') : 'rgba(51,65,85,0.45)'} stroke={keep ? col : C.line} strokeWidth={2} />
              <text x={x + 98} y={y + 31} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={keep ? C.text : C.dim}>{c}</text>
            </g>
          );
        })}
        {/* pipe */}
        <rect x={32} y={pipeY - pipeH / 2} width={box.w - 64} height={pipeH} rx={pipeH / 2} fill={C.bg2} stroke={col} strokeWidth={4} />
        {bad ? (
          // clogged: big blocks pile up and jitter before the right end
          Array.from({length: 16}, (_, k) => {
            const lane = k % 2;
            const base = 60 + k * 40;
            const x = Math.min(base + ((f * 0.8 + k * 13) % 30), box.w - 150 - (k % 5) * 6);
            const j = Math.sin(f * 0.9 + k) * 4;
            return <rect key={k} x={x} y={pipeY - 52 + lane * 48 + j} width={34} height={34} rx={6} fill={C.red} opacity={f > 40 ? 0.9 : 0} />;
          })
        ) : (
          Array.from({length: 8}, (_, k) => {
            const u = ((f - 360) * 0.02 + k / 8) % 1;
            return f > 360 ? <rect key={k} x={lerp(40, box.w - 70, u)} y={pipeY - 9} width={24} height={18} rx={5} fill={C.green} filter="url(#glow)" /> : null;
          })
        )}
        {/* gauge + status */}
        <Gauge cx={box.w / 2} cy={560} r={118} v={ram} color={col} label="RAM" />
        <text x={box.w / 2} y={640} textAnchor="middle" fontFamily={cairo} fontSize={fs(bad ? 'اختناق في الشبكة وضغط على الذاكرة' : 'استقطاع موجّه، وشبكة خفيفة وسريعة', box.w - 80, 32)} fontWeight={900} fill={bad ? C.red : C.green} opacity={prog(f, bad ? 300 : 540, bad ? 340 : 580)}>
          {bad ? 'اختناق في الشبكة وضغط على الذاكرة' : 'استقطاع موجّه، وشبكة خفيفة وسريعة'}
        </text>
      </svg>
      {!bad && (
        <div style={{position: 'absolute', right: 32, top: 400, opacity: prog(f, 840, 880), transform: `scale(${0.8 + 0.2 * ease(prog(f, 840, 880))})`, background: 'rgba(16,185,129,0.16)', border: `2px solid ${C.green}`, borderRadius: 16, padding: '10px 20px', textAlign: 'center'}}>
          <Tag color={C.green}>NETWORK I/O</Tag>
          <div style={{fontFamily: mono, fontSize: 44, fontWeight: 700, color: C.text}}>−80%</div>
        </div>
      )}
    </Card>
  );
};

export const Scene02: React.FC = () => (
  <Scene dur={S.s2.dur} accent={C.red}>
    <Title ar="فخ SELECT * والاستقطاع الموجّه" en="Projection & Selective Retrieval" chip="SC 02 · PROJECTION" accent={C.red} />
    <Half box={B.s2.left} bad />
    <Half box={B.s2.right} bad={false} />
    <Caption from={60} to={600} color={C.red}>SELECT * ──► High RAM Usage & Network Bottleneck</Caption>
    <Caption from={720} to={1260} color={C.green}>SELECT col1, col2 ──► Precise Projection & Optimized I/O</Caption>
  </Scene>
);
