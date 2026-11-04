import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC02 (frames 1200-2550, global 40-85s): scalar subquery in WHERE = a dynamic filter line on the price ruler.
const S = 40;
const t = (g: number) => sec(g - S);
const PRODUCTS = [
  {n: 'Pen', p: 12},
  {n: 'Notebook', p: 18},
  {n: 'Cable', p: 25},
  {n: 'Mouse', p: 32},
  {n: 'Keyboard', p: 40},
  {n: 'Webcam', p: 55},
  {n: 'Monitor', p: 68},
  {n: 'Laptop', p: 114},
];
const RH = 56;
const K = 5.0; // px per price unit
const BARX = 190;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(44), 24);
  const laser = prog(f, t(61.3), sec(1.6));
  const decide = prog(f, t(63.6), sec(2));
  const change = prog(f, t(79.8), sec(1.6));
  const dyn = pop(f, t(75.5));
  const price = (i: number) => (i === 4 ? lerp(40, 90, change) : PRODUCTS[i].p);
  const avg = (364 + (price(4) - 40)) / 8;
  const lineX = BARX + avg * K;
  const pass = (i: number) => price(i) > avg;
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  const passers = PRODUCTS.map((_, i) => i).filter(pass);

  return (
    <Stage dur={1350} inFx="zoom" outFx="left">
      <TopBadge text="الاستعلام الفرعي في WHERE | Dynamic Filtering" from={t(41.2)} to={t(60)} color={C.blue} />

      <Editor x={90} y={150} w={1100} h={200} title="above_average.sql" lines={['SELECT product_name, unit_price FROM products', 'WHERE unit_price > (SELECT AVG(unit_price) FROM products);']} start={t(41.4)} cps={1.4} size={24} accent={C.blue} />

      <div dir="ltr" style={{position: 'absolute', left: 1230, top: 160, display: 'flex', flexDirection: 'column', gap: 16, width: 600}}>
        <div style={{opacity: prog(f, t(47.1), 18)}}><Chip color={C.blue} style={{fontSize: 26}}>inner query runs FIRST</Chip></div>
        <div style={{opacity: prog(f, t(61.3), 18)}}><Chip color={C.green} style={{fontSize: 26}}>fixed criterion: ${avg.toFixed(2)}</Chip></div>
      </div>

      {/* price ruler with rows */}
      <Win x={90} y={380} w={1000} h={520} title="products · price ruler" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{position: 'relative', padding: '0 0 0 0'}}>
          {PRODUCTS.map((r, i) => {
            const d = prog(f, t(63.6) + i * 8, 14);
            const ok = pass(i);
            const barW = price(i) * K * clamp(tbl);
            return (
              <div key={r.n} style={{position: 'absolute', left: 14, right: 14, top: 8 + i * RH, height: RH - 8, borderRadius: 10, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 22, color: C.text, background: laser > 0.9 && d > 0.3 ? (ok ? `${C.green}14` : `${C.red}14`) : 'transparent', opacity: laser > 0.9 && d > 0.3 && !ok ? 0.45 : 1}}>
                <div style={{width: 160, paddingLeft: 10}}>{r.n}</div>
                <div style={{position: 'absolute', left: BARX - 14, top: 9, height: RH - 26, width: barW, borderRadius: 6, background: laser > 0.9 && d > 0.3 ? (ok ? C.green : C.red) : '#475569'}} />
                <div style={{position: 'absolute', left: BARX - 14 + barW + 10, color: C.muted, fontSize: 20}}>{Math.round(price(i))}</div>
              </div>
            );
          })}
          <div style={{position: 'absolute', left: lineX - 14, top: 0, width: 5, height: 456 * laser, background: C.green, boxShadow: `0 0 ${18 + 8 * glow}px ${C.green}`, borderRadius: 3}} />
          <div style={{position: 'absolute', left: lineX - 14 - 52, top: 460, fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green, opacity: laser}}>${avg.toFixed(2)}</div>
        </div>
      </Win>

      {/* result */}
      <Win x={1130} y={380} w={700} h={330} title="result · price > average" accent={passers.length ? C.green : C.border} opacity={tbl}>
        <div dir="ltr" style={{padding: '12px 22px', fontFamily: MONO, fontSize: 24, color: C.text}}>
          {passers.map((i, k) => {
            const p = pop(f, i === 4 ? t(82.4) : t(64.5) + k * 10);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', height: 56, marginBottom: 6, borderRadius: 10, border: `2px solid ${C.green}`, background: `${C.green}1A`, padding: '0 18px', opacity: clamp(p), transform: `translateX(${(1 - clamp(p)) * -120}px)`}}>
                <span style={{width: 230}}>{PRODUCTS[i].n}</span>
                <span style={{color: C.green, fontWeight: 700}}>{Math.round(price(i))}</span>
              </div>
            );
          })}
        </div>
      </Win>

      <div style={{position: 'absolute', left: 1130, top: 740, width: 700, opacity: clamp(dyn), transform: `scale(${0.9 + 0.1 * clamp(dyn)})`, transformOrigin: 'left top'}}>
        <Chip color={C.green} style={{fontSize: 26, background: `${C.green}26`}}>Dynamic ✓ adapts to price changes</Chip>
        <Mix style={{display: 'block', fontSize: 30, color: C.text, marginTop: 14}}>{change > 0.1 ? 'سعر Keyboard ارتفع ← المتوسط اتغير ← النتيجة اتحدّثت تلقائياً' : 'لا حاجة لكتابة المتوسط بيدك'}</Mix>
      </div>

      <Caption text="WHERE unit_price > (SELECT AVG(unit_price) FROM products)" from={t(47.5)} to={t(60.5)} />
      <Caption text="Dynamic Filtering ──► Automatically Adapts to Database Price Changes" from={t(75.8)} to={t(84)} />
    </Stage>
  );
};
