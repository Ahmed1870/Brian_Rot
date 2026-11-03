import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const NAMES = ['أحمد', 'سارة', 'منى', 'كريم', 'ليلى'];
const GRID = 5, CELL = 52, PITCH = 60;

const Line: React.FC<{k?: string; v: string; w: number}> = ({k, v, w}) => (
  <div style={{whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, color: C.text, fontSize: fs('INNER JOIN orders o ON c.customer_id = o.customer_id;'.slice(0, 40), w, 28, mono), lineHeight: 1.5}}>
    {k && <span style={{color: C.pink}}>{k}</span>}{v}
  </div>
);

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const L = B.s2.left, R = B.s2.right;
  const boom = ease(prog(f, 360, 800)); // cartesian explosion progress
  const cells = Math.round(boom * 25);
  const rowsCount = cells === 25 ? '5 × 5 = 25' : `${cells}`;
  const big = prog(f, 800, 860);
  const shield = ease(prog(f, 840, 900));

  return (
    <Scene dur={S.s2.dur} accent={C.red}>
      <Title ar="الصياغة الصريحة مقابل الضمنية" en="INNER JOIN ... ON vs FROM A, B" chip="SC 02 · ANSI SQL" accent={C.red} />

      {/* LEFT: implicit comma join */}
      <Card box={L} accent={C.red} at={6}>
        <div style={{position: 'absolute', left: 30, top: 24, right: 30, direction: 'ltr', opacity: prog(f, 20, 60)}}>
          <Tag color={C.red}>IMPLICIT · OLD STYLE</Tag>
          <div style={{marginTop: 12}}>
            <Line k="SELECT" v=" *" w={L.w - 60} />
            <Line k="FROM" v=" customers, orders;" w={L.w - 60} />
            <div style={{fontFamily: mono, fontSize: 24, fontWeight: 700, color: C.amber, marginTop: 4, opacity: prog(f, 200, 240)}}>-- نسيت WHERE ⚠</div>
          </div>
        </div>

        <svg width={L.w} height={L.h} style={{position: 'absolute', inset: 0}}>
          <Defs />
          {/* 5x5 combinations grid fills up */}
          {Array.from({length: GRID * GRID}, (_, i) => {
            const r = Math.floor(i / GRID), c = i % GRID;
            const x = 200 + c * PITCH, y = 250 + r * PITCH;
            const on = i < cells;
            return <rect key={i} x={x} y={y} width={CELL} height={CELL} rx={10} fill={on ? 'rgba(239,68,68,0.55)' : C.panel2} stroke={on ? C.red : C.line} strokeWidth={2} />;
          })}
          {NAMES.map((n, i) => (
            <text key={'n' + i} x={140} y={250 + i * PITCH + 34} textAnchor="end" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.dim} opacity={prog(f, 240, 280)}>{n}</text>
          ))}
          {[101, 102, 103, 104, 105].map((o, i) => (
            <text key={'o' + i} x={200 + i * PITCH + CELL / 2} y={236} textAnchor="middle" fontFamily={mono} fontSize={20} fontWeight={700} fill={C.dim} opacity={prog(f, 240, 280)}>{o}</text>
          ))}
        </svg>
        {/* counter + alert */}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, direction: 'ltr'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', opacity: prog(f, 360, 400)}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.dim}}>ROWS RETURNED</span>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 46, color: C.red}}>{rowsCount}</span>
          </div>
          <div style={{marginTop: 8, whiteSpace: 'nowrap', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.red, direction: 'rtl', textAlign: 'center', opacity: big}}>ضرب كارتيزي: ملايين الصفوف لو الجداول كبيرة!</div>
        </div>
      </Card>

      {/* RIGHT: explicit INNER JOIN ... ON */}
      <Card box={R} accent={C.green} at={20}>
        <div style={{position: 'absolute', left: 30, top: 24, right: 30, direction: 'ltr', opacity: prog(f, 120, 160)}}>
          <Tag color={C.green}>EXPLICIT · ANSI</Tag>
          <div style={{marginTop: 12}}>
            <Line k="SELECT" v=" *" w={R.w - 60} />
            <Line k="FROM" v=" customers c" w={R.w - 60} />
            <Line k="INNER JOIN" v=" orders o" w={R.w - 60} />
            <Line k="  ON" v=" c.customer_id = o.customer_id;" w={R.w - 60} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 290, direction: 'ltr'}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{marginBottom: 8, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.12)', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', opacity: prog(f, 480 + i * 24, 510 + i * 24)}}>
              <span style={{fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text}}>{NAMES[i]}</span>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.green}}>#{101 + i}</span>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl', opacity: shield, transform: `scale(${0.9 + 0.1 * shield})`}}>
          <svg width={70} height={78} viewBox="0 0 70 78" style={{flexShrink: 0}}>
            <path d="M35 4 L64 16 V40 C64 58 50 70 35 75 C20 70 6 58 6 40 V16 Z" fill="rgba(16,185,129,0.2)" stroke={C.green} strokeWidth={5} />
            <polyline points="21,40 31,50 50,28" fill="none" stroke={C.green} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.green}}>المحرك يرفض التنفيذ من غير شرط الربط</div>
        </div>
      </Card>

      <Caption from={60} to={600} color={C.red}>Implicit Join (FROM A, B) ──► Risk of Accidental Cartesian Product</Caption>
      <Caption from={720} to={1260} color={C.green}>Explicit INNER JOIN ... ON ──► ANSI Standard Protection & Clarity</Caption>
    </Scene>
  );
};
