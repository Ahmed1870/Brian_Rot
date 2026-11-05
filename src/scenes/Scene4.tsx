import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Stage, TopBadge, clamp, lerp, pop, prog, sec, typed} from '../kit';

// SC04 (frames 3900-5100, global 130-170s): Sort Node -> WindowAgg Node, evaluated in one pass inside work_mem.
const S = 130;
const t = (g: number) => sec(g - S);
const COLX = [100, 570, 1040, 1510];
const COLW = 340;
const AMT = [120, 80, 150, 60, 200, 90];
const RUN = AMT.map((_, i) => AMT.slice(0, i + 1).reduce((a, b) => a + b, 0));
const DAY = ['01-Jan', '02-Jan', '03-Jan', '04-Jan', '05-Jan', '06-Jan'];
const SH = [3, 1, 5, 0, 4, 2]; // unsorted scan order (data index per slot)
const Y0 = 250;
const SP = 66;
const PLAN = ['WindowAgg', '  ->  Sort', '        Sort Key: sale_date', '        Sort Method: quicksort  Memory: 25kB', '        ->  Seq Scan on sales'];

const Header: React.FC<{i: number; n: string; sub: string; color: string; p: number}> = ({i, n, sub, color, p}) => (
  <div dir="ltr" style={{position: 'absolute', left: COLX[i], top: 150, width: COLW, opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
    <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color}}>{n}</div>
    <div style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>{sub}</div>
  </div>
);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const h1 = prog(f, t(131.6), 20);
  const h2 = prog(f, t(142.4), 20);
  const h3 = prog(f, t(144.6), 20);
  const h4 = prog(f, t(161.8), 20);
  const sortMv = prog(f, t(148.2), sec(4.0));
  const toWin = prog(f, t(153.9), sec(1.2));
  const probe = clamp((f - t(157.5)) / sec(0.7), 0, 6);
  const single = pop(f, t(157.5));
  const res = (i: number) => pop(f, t(162.0) + i * 7);
  const eff = pop(f, t(166.4));
  const plan = typed(PLAN.join('\n'), f, t(142.6), 1.4).split('\n');
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  const panel = (i: number, color: string, on: number) => (
    <div style={{position: 'absolute', left: COLX[i], top: 200, width: COLW, height: 450, borderRadius: 22, background: C.card, border: `2px solid ${on > 0.4 ? color : C.border}`, opacity: clamp(0.4 + 0.6 * on), boxShadow: on > 0.4 ? `0 0 ${22 * glow}px ${color}33` : 'none'}} />
  );

  return (
    <Stage dur={1200} inFx="up" outFx="zoom">
      <TopBadge text="كواليس PostgreSQL | Sort Node ➔ WindowAgg Node" from={t(131.4)} to={t(146)} color={C.blue} />

      <Header i={0} n="① Seq Scan" sub="rows arrive unsorted" color={C.muted} p={h1} />
      <Header i={1} n="② Sort Node" sub="quicksort in work_mem" color={C.amber} p={h2} />
      <Header i={2} n="③ WindowAgg Node" sub="running sum · single pass" color={C.blue} p={h3} />
      <Header i={3} n="④ Result" sub="running_total ready" color={C.green} p={h4} />
      {panel(0, C.muted, h1)}
      {panel(1, C.amber, h2)}
      {panel(2, C.blue, h3)}
      {panel(3, C.green, h4)}

      {/* moving cards */}
      {DAY.map((d, i) => {
        const slot = SH.indexOf(i);
        const y1 = Y0 + slot * SP;
        const y2 = Y0 + i * SP;
        const y = lerp(y1, y2, sortMv);
        const x = f < t(153.9) ? lerp(COLX[0] + 20, COLX[1] + 20, sortMv) : lerp(COLX[1] + 20, COLX[2] + 20, toWin);
        const appear = prog(f, t(131.8) + slot * 6, 16);
        const shown = probe > i;
        const now = probe > i && probe < i + 1;
        return (
          <div key={d} dir="ltr" style={{position: 'absolute', left: x, top: y, width: 300, height: 54, borderRadius: 12, background: C.deep, border: `2px solid ${f >= t(153.9) ? C.blue : sortMv > 0.05 ? C.amber : C.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: MONO, fontSize: 22, color: C.text, opacity: appear, boxShadow: now ? `0 0 18px ${C.green}` : 'none'}}>
            <span>{d}</span>
            <span style={{color: C.muted}}>{AMT[i]}</span>
            <span style={{color: C.green, fontWeight: 700, opacity: shown ? 1 : 0, minWidth: 54, textAlign: 'right'}}>{RUN[i]}</span>
          </div>
        );
      })}
      {/* sweep line in WindowAgg */}
      <div style={{position: 'absolute', left: COLX[2] + 10, width: COLW - 20, top: Y0 + (probe - 0.1) * SP, height: 5, background: C.green, boxShadow: `0 0 18px ${C.green}`, borderRadius: 3, opacity: probe > 0 && probe < 6 ? 1 : 0}} />

      {/* result rows */}
      <div dir="ltr" style={{position: 'absolute', left: COLX[3] + 20, top: Y0, width: 300}}>
        {DAY.map((d, i) => (
          <div key={d} style={{height: 54, marginBottom: SP - 54, borderRadius: 12, border: `2px solid ${C.green}`, background: `${C.green}1A`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: MONO, fontSize: 22, color: C.text, opacity: clamp(res(i)), transform: `translateX(${(1 - clamp(res(i))) * -60}px)`}}>
            <span>{d}</span>
            <span style={{color: C.green, fontWeight: 700}}>{RUN[i]}</span>
          </div>
        ))}
      </div>

      <div dir="ltr" style={{position: 'absolute', left: COLX[2], top: 662, transform: `scale(${clamp(single)})`, opacity: clamp(single), transformOrigin: 'left center'}}><Chip color={C.blue} style={{fontSize: 22}}>Single Pass</Chip></div>
      <div dir="ltr" style={{position: 'absolute', left: COLX[3], top: 662, display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${clamp(eff)})`, opacity: clamp(eff), transformOrigin: 'left center'}}><Check p={clamp(eff)} size={34} /><Chip color={C.green} style={{fontSize: 22}}>instant on huge date series</Chip></div>

      {/* EXPLAIN plan */}
      <div dir="ltr" style={{position: 'absolute', left: 100, top: 712, width: 1750, height: 196, borderRadius: 18, background: C.deep, border: `2px solid ${C.border}`, padding: '14px 26px', fontFamily: MONO, fontSize: 22, lineHeight: '32px', color: C.text, opacity: prog(f, t(142.4), 18)}}>
        {PLAN.map((l, i) => {
          const v = plan[i] ?? '';
          const c = /WindowAgg/.test(v) ? C.blue : /Sort/.test(v) ? C.amber : C.text;
          return <div key={i} style={{whiteSpace: 'pre', color: c}}>{v}</div>;
        })}
      </div>

      <Caption text="PostgreSQL Execution Pipeline: Sort Node ➔ WindowAgg Node" from={t(138.6)} to={t(153)} />
      <Caption text="In-Memory Accumulation ──► Evaluates Running Sums in work_mem Efficiently" from={t(157.6)} to={t(168.6)} />
    </Stage>
  );
};
