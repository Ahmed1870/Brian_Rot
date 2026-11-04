import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, mix, prog, pulse} from '../lib/anim';

const S = TL.cues.sc04;
const PUR = '#A855F7';
const CODE: CodeLine[] = [
  {text: 'SELECT c.name FROM customers c', at: 130.7}, {text: 'WHERE EXISTS (', at: 131.6},
  {text: '  SELECT 1 FROM orders o', at: 132.4}, {text: '  WHERE o.customer_id = c.customer_id', at: 133.2}, {text: ');', at: 134.4},
];
const NODES = [
  {id: 'root', x: 1230, y: 200, w: 520, label: 'Hash Semi Join', sub: 'EXISTS → semi-join', c: PUR, at: S.rewrite + 1.0},
  {id: 'a', x: 980, y: 400, w: 440, label: 'Seq Scan on customers c', sub: 'outer rows', c: D.code, at: S.rewrite + 2.0},
  {id: 'b', x: 1450, y: 400, w: 400, label: 'Hash', sub: 'work_mem', c: D.key, at: S.rewrite + 2.4},
  {id: 'c', x: 1450, y: 590, w: 400, label: 'Index Scan on orders o', sub: 'index probing', c: D.cat, at: S.rewrite + 3.2},
];
const EDGES = [['root', 'a'], ['root', 'b'], ['b', 'c']];
const nd = (id: string) => NODES.find((n) => n.id === id)!;

export const Scene4: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 130.3, 131.3);
  const rw = eo(prog(t, S.rewrite, S.rewrite + 1.4));
  const loop = (t * 1.2) % 1;
  const hashP = back(prog(t, S.hash, S.hash + 0.8));
  const mem = eo(prog(t, S.hash, S.hash + 2.5));
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const anti = t > S.rewrite + 4 && Math.floor((t - S.rewrite - 4) / 3) % 2 === 1;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="Query Planner Optimization" body="──► Rewrites EXISTS Subqueries to Semi-Joins" color={D.code} size={26} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="Index Probing & Hash Anti-Join" body="──► Eliminates Row-by-Row Overhead" color={D.code} size={26} /></div>
      <div style={{opacity: enter}}><Code lines={CODE} t={t} x={60} y={190} w={860} h={300} title="exists.sql" fontSize={24} lineH={44} accent={PUR} /></div>

      {/* before: mechanical row-by-row loop */}
      <div style={{position: 'absolute', left: 60, top: 520, width: 860, height: 330, borderRadius: 24, border: `2px solid ${D.err}${rw > 0.5 ? '44' : 'AA'}`, background: 'rgba(30,41,59,0.8)', padding: '22px 30px', boxSizing: 'border-box', opacity: (1 - 0.65 * rw) * enter}}>
        <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 28, color: D.err, direction: 'rtl', textDecoration: rw > 0.6 ? 'line-through' : 'none'}}>التنفيذ المنطقي: حلقة صفًا بصف</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, fontFamily: FONT_MONO, fontSize: 25, color: C.text}}>
            <span style={{width: 150}}>customer {i + 1}</span>
            <div style={{flex: 1, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden'}}><div style={{position: 'absolute', left: `${((loop + i * 0.3) % 1) * 90}%`, width: '14%', height: 22, borderRadius: 11, background: D.err}} /></div>
            <span style={{color: D.err}}>scan orders</span>
          </div>
        ))}
      </div>

      {/* after: optimizer plan tree */}
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {EDGES.map(([a, b]) => {
          const A = nd(a), B = nd(b);
          const p = eo(prog(t, B.at - 0.5, B.at + 0.4));
          return <line key={a + b} x1={A.x + A.w / 2} y1={A.y + 90} x2={A.x + A.w / 2 + (B.x + B.w / 2 - A.x - A.w / 2) * p} y2={A.y + 90 + (B.y - A.y - 90) * p} stroke={D.code} strokeWidth="5" strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${D.code})`}} />;
        })}
      </svg>
      {NODES.map((n) => {
        const p = back(prog(t, n.at, n.at + 0.7));
        const label = n.id === 'root' && anti ? 'Hash Anti Join' : n.label;
        const sub = n.id === 'root' && anti ? 'NOT EXISTS → anti-join' : n.sub;
        return (
          <div key={n.id} style={{position: 'absolute', left: n.x, top: n.y, width: n.w, height: 90, borderRadius: 20, background: `${n.c}26`, border: `3px solid ${n.c}`, opacity: Math.min(1, p * 2), transform: `scale(${0.8 + 0.2 * p})`, boxShadow: `0 0 ${24 + 16 * warm}px ${n.c}55`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 22px'}}>
            <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, color: C.text}}>{label}</span>
            <span style={{fontFamily: FONT_MONO, fontSize: 19, color: n.c}}>{sub}</span>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 980, top: 740, width: 880, opacity: Math.min(1, hashP * 1.6), transform: `translateY(${(1 - hashP) * 30}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: D.key}}><span>work_mem</span><span>Hash built in memory ✓</span></div>
        <div style={{height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.07)', marginTop: 10}}><div style={{width: `${mix(10, 62, mem)}%`, height: 26, borderRadius: 13, background: D.key}} /></div>
        <div style={{display: 'flex', gap: 14, marginTop: 24}}>
          {[['Row-by-row', 0.92, D.err], ['Semi-Join', 0.22, D.code]].map(([l, w, c]) => (
            <div key={l as string} style={{flex: 1}}><div style={{fontFamily: FONT_MONO, fontSize: 21, color: c as string, fontWeight: 800}}>{l}</div><div style={{height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.07)', marginTop: 6}}><div style={{width: `${(w as number) * 100 * mem}%`, height: 20, borderRadius: 10, background: c as string}} /></div></div>
          ))}
        </div>
      </div>
    </div>
  );
};
