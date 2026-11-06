import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Stage, TopBadge, clamp, lerp, pop, prog, sec, typed} from '../kit';

// SC04 (frames 3900-5100, global 130-170s): WindowAgg node - sort by PARTITION BY in work_mem, then one sweep.
const S = 130;
const t = (g: number) => sec(g - S);
const COLX = [100, 570, 1040, 1510];
const COLW = 340;
const PCOL = [C.blue, C.purple, C.amber];
// sorted order (by category): index = rank
const D = [
  {n: 'Mouse', c: 0, a: 80},
  {n: 'Keyboard', c: 0, a: 150},
  {n: 'Laptop', c: 1, a: 1200},
  {n: 'Monitor', c: 1, a: 600},
  {n: 'Chair', c: 2, a: 450},
  {n: 'Desk', c: 2, a: 700},
];
const AVG = [115, 115, 900, 900, 575, 575];
const SH = [2, 4, 0, 5, 3, 1]; // scan order: data index per slot
const Y0 = 250;
const SP = 66;
const PLAN = ['WindowAgg', '  ->  Sort', '        Sort Key: category_id', '        Sort Method: quicksort  Memory: 25kB', '        ->  Seq Scan on product_sales'];

const Header: React.FC<{i: number; n: string; sub: string; color: string; p: number}> = ({i, n, sub, color, p}) => (
  <div dir="ltr" style={{position: 'absolute', left: COLX[i], top: 150, width: COLW, opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
    <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color}}>{n}</div>
    <div style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>{sub}</div>
  </div>
);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const h1 = prog(f, t(131.4), 20);
  const h3 = prog(f, t(137.7), 20);
  const h2 = prog(f, t(143.4), 20);
  const h4 = prog(f, t(157.6), 20);
  const mem = pop(f, t(145.4));
  const sortMv = prog(f, t(143.8), sec(3.0));
  const toWin = prog(f, t(147.6), sec(1.0));
  const probe = clamp((f - t(148.8)) / sec(1.33), 0, 6);
  const single = pop(f, t(156.9));
  const res = (i: number) => pop(f, t(157.8) + i * 6);
  const eff = pop(f, t(160.3));
  const ms = pop(f, t(162.3));
  const big = pop(f, t(167.0));
  const plan = typed(PLAN.join('\n'), f, t(143.6), 1.4).split('\n');
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  const panel = (i: number, color: string, on: number) => (
    <div style={{position: 'absolute', left: COLX[i], top: 200, width: COLW, height: 450, borderRadius: 22, background: C.card, border: `2px solid ${on > 0.4 ? color : C.border}`, opacity: clamp(0.4 + 0.6 * on), boxShadow: on > 0.4 ? `0 0 ${22 * glow}px ${color}33` : 'none'}} />
  );

  return (
    <Stage dur={1200} inFx="up" outFx="zoom">
      <TopBadge text="كواليس PostgreSQL 16 | WindowAgg Node" from={t(131.4)} to={t(146)} color={C.blue} />

      <Header i={0} n="① Seq Scan" sub="rows arrive mixed" color={C.muted} p={h1} />
      <Header i={1} n="② Sort by PARTITION BY" sub="in work_mem" color={C.amber} p={h2} />
      <Header i={2} n="③ WindowAgg Node" sub="one sweep · single pass" color={C.blue} p={h3} />
      <Header i={3} n="④ Result" sub="metric appended per row" color={C.green} p={h4} />
      {panel(0, C.muted, h1)}
      {panel(1, C.amber, h2)}
      {panel(2, C.blue, h3)}
      {panel(3, C.green, h4)}

      {D.map((d, i) => {
        const slot = SH.indexOf(i);
        const y = lerp(Y0 + slot * SP, Y0 + i * SP, sortMv);
        const x = f < t(147.6) ? lerp(COLX[0] + 20, COLX[1] + 20, sortMv) : lerp(COLX[1] + 20, COLX[2] + 20, toWin);
        const appear = prog(f, t(131.8) + slot * 6, 16);
        const shown = probe > i;
        const now = probe > i && probe < i + 1;
        return (
          <div key={d.n} dir="ltr" style={{position: 'absolute', left: x, top: y, width: 300, height: 54, borderRadius: 12, background: C.deep, border: `2px solid ${PCOL[d.c]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontFamily: MONO, fontSize: 20, color: C.text, opacity: appear, boxShadow: now ? `0 0 18px ${C.green}` : 'none'}}>
            <span style={{width: 100}}>{d.n}</span>
            <span style={{color: C.muted}}>{d.a}</span>
            <span style={{color: C.green, fontWeight: 700, opacity: shown ? 1 : 0, minWidth: 56, textAlign: 'right'}}>{AVG[i]}</span>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: COLX[2] + 10, width: COLW - 20, top: Y0 + (probe - 0.1) * SP, height: 5, background: C.green, boxShadow: `0 0 18px ${C.green}`, borderRadius: 3, opacity: probe > 0 && probe < 6 ? 1 : 0}} />

      <div dir="ltr" style={{position: 'absolute', left: COLX[3] + 20, top: Y0, width: 300}}>
        {D.map((d, i) => (
          <div key={d.n} style={{height: 54, marginBottom: SP - 54, borderRadius: 12, border: `2px solid ${PCOL[d.c]}`, background: `${C.green}14`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontFamily: MONO, fontSize: 20, color: C.text, opacity: clamp(res(i)), transform: `translateX(${(1 - clamp(res(i))) * -60}px)`}}>
            <span style={{width: 100}}>{d.n}</span>
            <span style={{color: C.green, fontWeight: 700}}>{AVG[i]}</span>
          </div>
        ))}
      </div>

      <div dir="ltr" style={{position: 'absolute', left: COLX[1], top: 662, transform: `scale(${clamp(mem)})`, opacity: clamp(mem), transformOrigin: 'left center'}}><Chip color={C.amber} style={{fontSize: 22}}>work_mem</Chip></div>
      <div dir="ltr" style={{position: 'absolute', left: COLX[2], top: 662, transform: `scale(${clamp(single)})`, opacity: clamp(single), transformOrigin: 'left center'}}><Chip color={C.blue} style={{fontSize: 22}}>Single Pass</Chip></div>
      <div dir="ltr" style={{position: 'absolute', left: COLX[3], top: 662, display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${clamp(eff)})`, opacity: clamp(eff), transformOrigin: 'left center'}}><Check p={clamp(eff)} size={34} /><Chip color={C.green} style={{fontSize: 22}}>no re-read from disk</Chip></div>
      <div dir="ltr" style={{position: 'absolute', left: COLX[3], top: 706, display: 'flex', gap: 12, opacity: 1}}>
        <div style={{transform: `scale(${clamp(ms)})`, transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 18}}>milliseconds</Chip></div>
        <div style={{transform: `scale(${clamp(big)})`, transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 18}}>millions of rows</Chip></div>
      </div>

      <div dir="ltr" style={{position: 'absolute', left: 100, top: 760, width: 1090, height: 160, borderRadius: 18, background: C.deep, border: `2px solid ${C.border}`, padding: '10px 24px', fontFamily: MONO, fontSize: 20, lineHeight: '28px', color: C.text, opacity: prog(f, t(143.4), 18)}}>
        {PLAN.map((l, i) => {
          const v = plan[i] ?? '';
          const c = /WindowAgg/.test(v) ? C.blue : /Sort/.test(v) ? C.amber : C.text;
          return <div key={i} style={{whiteSpace: 'pre', color: c}}>{v}</div>;
        })}
      </div>

      <Caption text="PostgreSQL Query Engine ──► Executes via Specialized WindowAgg Node" from={t(137.9)} to={t(146.8)} />
      <Caption text="In-Memory Partition Sort ──► Sorts Partitions in work_mem for Fast Evaluation" from={t(148.4)} to={t(168.6)} />
    </Stage>
  );
};
