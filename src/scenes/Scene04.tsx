import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, lerp, prog} from '../common';

const DATA = [{n: 'كيبورد', v: 1200}, {n: 'لابتوب', v: 3400}, {n: 'ماوس', v: 900}, {n: 'شاشة', v: 2600}, {n: 'سماعة', v: 1800}, {n: 'شاحن', v: 500}];
const SORTED = [...DATA].sort((a, b) => b.v - a.v);
const RY = 120, RP = 80;
const slotOf = (n: string) => SORTED.findIndex((x) => x.n === n);

const Row: React.FC<{x: number; y: number; w: number; name: string; val: number; color: string; rank?: number; o?: number}> = ({x, y, w, name, val, color, rank, o = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: RP - 14, borderRadius: 14, border: `3px solid ${color}`, background: C.panel2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', direction: 'ltr', opacity: o}}>
    {rank !== undefined && <span style={{width: 50, height: 44, borderRadius: 10, background: color, color: C.bg, fontFamily: mono, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{rank}</span>}
    <span style={{fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.text, flex: 1, textAlign: 'center', direction: 'rtl'}}>{name}</span>
    <span style={{fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.text}}>${val}</span>
  </div>
);

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const I = B.s4.input, So = B.s4.sort, W = B.s4.win, O = B.s4.out;
  const sortP = ease(prog(f, 120, 380));
  const stamp = (i: number) => prog(f, 460 + i * 60, 500 + i * 60);
  const sweep = prog(f, 450, 450 + 6 * 60);
  const mem = ease(prog(f, 100, 360));
  const wActive = f >= 450;
  const card = (box: typeof I, color: string, tag: string, at: number, active: boolean, children: React.ReactNode, note?: string) => (
    <Card box={box} accent={active ? color : C.line} at={at}>
      <div style={{position: 'absolute', left: 24, top: 22, direction: 'ltr'}}><Tag color={color}>{tag}</Tag></div>
      {children}
      {note && <div style={{position: 'absolute', left: 24, right: 24, bottom: 22, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 26, color}}>{note}</div>}
    </Card>
  );

  return (
    <Scene dur={S.s4.dur} accent={C.amber}>
      <Title ar="كواليس تنفيذ دوال الترتيب" en="Sort Node ➔ WindowAgg Node" chip="SC 04 · ENGINE" accent={C.amber} />

      {card(I, C.dim, 'INPUT · UNSORTED', 6, true, DATA.map((d, i) => <Row key={i} x={20} y={RY + i * RP} w={I.w - 40} name={d.n} val={d.v} color={C.line} o={prog(f, 20 + i * 10, 50 + i * 10)} />))}

      {card(So, C.amber, 'SORT NODE · work_mem', 24, f >= 100 && f < 450, (
        <>
          {DATA.map((d, i) => <Row key={i} x={20} y={lerp(RY + i * RP, RY + slotOf(d.n) * RP, sortP)} w={So.w - 40} name={d.n} val={d.v} color={sortP > 0.95 ? C.amber : C.line} o={prog(f, 100 + i * 8, 130 + i * 8)} />)}
          <div style={{position: 'absolute', left: 24, right: 24, bottom: 76, direction: 'ltr', opacity: prog(f, 100, 140)}}>
            <div style={{height: 16, background: 'rgba(100,116,139,0.35)', borderRadius: 8, overflow: 'hidden'}}><div style={{width: `${mem * 100}%`, height: '100%', background: C.amber}} /></div>
          </div>
        </>
      ), 'فرز في الذاكرة')}

      {card(W, C.blue, 'WINDOWAGG NODE', 40, wActive && sweep < 1, (
        <>
          {SORTED.map((d, i) => <Row key={i} x={20} y={RY + i * RP} w={W.w - 40} name={d.n} val={d.v} color={stamp(i) > 0.5 ? C.blue : C.line} rank={stamp(i) > 0.5 ? i + 1 : undefined} o={prog(f, 440 + i * 4, 470 + i * 4)} />)}
        </>
      ), 'مسح واحد (Single Pass)')}

      {card(O, C.green, 'OUTPUT · RANKED', 56, f > 450 + 6 * 60, (
        <>
          {SORTED.map((d, i) => <Row key={i} x={20} y={RY + i * RP} w={O.w - 40} name={d.n} val={d.v} color={C.green} rank={i + 1} o={stamp(i)} />)}
        </>
      ), 'الرتب جاهزة بالذاكرة')}

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {[I.x + I.w, So.x + So.w, W.x + W.w].map((x, i) => {
          const on = prog(f, i === 0 ? 100 : i === 1 ? 420 : 440 + 6 * 60, i === 0 ? 140 : i === 1 ? 460 : 840 + 40);
          return (
            <g key={i} opacity={on}>
              <line x1={x + 4} y1={540} x2={x + 36} y2={540} stroke={[C.amber, C.blue, C.green][i]} strokeWidth={6} strokeLinecap="round" />
              <polygon points={`${x + 40},540 ${x + 26},530 ${x + 26},550`} fill={[C.amber, C.blue, C.green][i]} />
            </g>
          );
        })}
        {sweep > 0 && sweep < 1 && <rect x={W.x + 10} y={W.y + RY + sweep * 6 * RP - 6} width={W.w - 20} height={6} rx={3} fill={C.blue} filter="url(#glow)" />}
      </svg>

      <Caption from={60} to={540} color={C.amber}>PostgreSQL Engine Execution: Sort Node ➔ WindowAgg Node</Caption>
      <Caption from={660} to={1080} color={C.green}>In-Memory Ranking ──► Single-Pass Evaluation in work_mem</Caption>
    </Scene>
  );
};
