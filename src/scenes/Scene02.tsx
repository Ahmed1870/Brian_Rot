import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const DISCOUNT: (number | null)[] = [10, null, 15, 5, null, 20, 10, null, 5, 15]; // 10 rows, 3 NULL
const RP = 33, R0 = 130; // row pitch / first row offset inside a card

const Panel: React.FC<{box: typeof B.s2.left; all: boolean; start: number; at: number}> = ({box, all, start, at}) => {
  const f = useCurrentFrame();
  const col = all ? C.blue : C.green;
  const q = all ? 'COUNT(*)' : 'COUNT(discount)';
  const pr = prog(f, start, start + 330);
  const laserI = pr * 10; // fractional row index under the laser
  let count = 0;
  for (let i = 0; i < 10; i++) if (laserI >= i + 0.5 && (all || DISCOUNT[i] !== null)) count++;
  const done = pr >= 1;

  return (
    <Card box={box} accent={col} at={at}>
      <div style={{position: 'absolute', left: 30, top: 18, height: 56, display: 'flex', alignItems: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, whiteSpace: 'nowrap', fontSize: fs('SELECT COUNT(discount) FROM sales;', box.w - 60, 36, mono), color: C.text}}>
        <span style={{color: C.pink}}>SELECT</span>&nbsp;<span style={{color: col}}>{q}</span>&nbsp;<span style={{color: C.pink}}>FROM</span>&nbsp;sales;
      </div>
      <svg width={box.w} height={box.h} style={{position: 'absolute', inset: 0}}>
        <Defs />
        <text x={46} y={118} fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim}>id</text>
        <text x={400} y={118} textAnchor="end" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim}>discount</text>
        {DISCOUNT.map((d, i) => {
          const y = R0 + i * RP;
          const passed = laserI >= i + 0.5;
          const isNull = d === null;
          const counted = passed && (all || !isNull);
          const skipped = passed && !all && isNull;
          const flash = skipped ? Math.max(0, 1 - (laserI - i - 0.5) * 1.5) : 0;
          return (
            <g key={i} opacity={prog(f, at + 10 + i * 4, at + 30 + i * 4)}>
              <rect x={30} y={y} width={400} height={RP - 4} rx={8} fill={counted ? (all ? 'rgba(56,189,248,0.20)' : 'rgba(16,185,129,0.20)') : C.panel2} stroke={skipped ? C.amber : 'transparent'} strokeWidth={2} />
              {flash > 0 && <rect x={30} y={y} width={400} height={RP - 4} rx={8} fill={C.amber} opacity={flash * 0.5} />}
              <text x={46} y={y + 22} fontFamily={mono} fontSize={21} fontWeight={700} fill={C.text}>{i + 1}</text>
              <text x={414} y={y + 22} textAnchor="end" fontFamily={mono} fontSize={21} fontWeight={700} fill={isNull ? C.amber : C.text}>{isNull ? 'NULL' : d + '%'}</text>
            </g>
          );
        })}
        {/* laser scanning line */}
        {pr > 0 && pr < 1 && <rect x={22} y={R0 + laserI * RP - 3} width={416} height={5} rx={3} fill={col} filter="url(#glow)" />}
      </svg>

      {/* result block */}
      <div style={{position: 'absolute', left: 470, right: 30, top: 130, textAlign: 'center', opacity: prog(f, start - 10, start + 20)}}>
        <Tag color={col}>{q}</Tag>
        <div style={{fontFamily: mono, fontWeight: 700, fontSize: 170, lineHeight: 1.05, color: col, marginTop: 14}}>{count}</div>
        <div style={{fontFamily: cairo, fontWeight: 900, fontSize: 30, color: done ? col : C.dim, direction: 'rtl', marginTop: 10, opacity: done ? 1 : 0.5}}>
          {all ? 'كل الأسطر حتى اللي فيها NULL' : 'القيم الموجودة بس، NULL متجاهَل'}
        </div>
      </div>
    </Card>
  );
};

const FUNCS = [
  {k: 'COUNT', ar: 'عدّ', c: C.blue},
  {k: 'SUM', ar: 'مجموع', c: C.green},
  {k: 'AVG', ar: 'متوسط', c: C.amber},
  {k: 'MIN', ar: 'أقل قيمة', c: C.pink},
  {k: 'MAX', ar: 'أكبر قيمة', c: C.red},
];

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const F = B.s2.funcs;
  return (
    <Scene dur={S.s2.dur} accent={C.green}>
      <Title ar="الدوال الخمس الكبرى" en="COUNT(*) vs COUNT(column)" chip="SC 02 · BIG FIVE" accent={C.green} />
      <Panel box={B.s2.left} all start={20} at={6} />
      <Panel box={B.s2.right} all={false} start={360} at={20} />

      <div style={{position: 'absolute', left: F.x, top: F.y, width: F.w, height: F.h, display: 'flex', gap: 25, direction: 'ltr'}}>
        {FUNCS.map((fn, i) => {
          const o = ease(prog(f, 840 + i * 22, 880 + i * 22));
          return (
            <div key={fn.k} style={{flex: 1, borderRadius: 24, border: `3px solid ${fn.c}`, background: 'linear-gradient(160deg, #223047, #16203A)', boxShadow: '0 18px 40px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: o, transform: `translateY(${(1 - o) * 40}px)`}}>
              <div style={{fontFamily: mono, fontWeight: 700, fontSize: 46, color: fn.c}}>{fn.k}()</div>
              <div style={{fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text, direction: 'rtl'}}>{fn.ar}</div>
            </div>
          );
        })}
      </div>

      <Caption from={60} to={600} color={C.blue}>COUNT(*) ──► Counts All Rows (Including NULLs)</Caption>
      <Caption from={720} to={1260} color={C.green}>COUNT(column) ──► Counts Non-NULL Values Only</Caption>
    </Scene>
  );
};
