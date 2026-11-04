import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, pop, prog, sec} from '../kit';

// SC03 (frames 2550-3900, global 85-130s): scalar subquery in SELECT = a fixed benchmark column + per-row difference.
const S = 85;
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
const AVG = 45.5;
const RH = 44;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(86.4), 24);
  const colHi1 = prog(f, t(105.6), 16) * (1 - prog(f, t(109.0), 10));
  const colHi2 = prog(f, t(109.1), 16);
  const chip1 = pop(f, t(93.3));
  const chip2 = pop(f, t(99.0));
  const chip3 = pop(f, t(113.3));
  const done = pop(f, t(125.6));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="الاستعلام الفرعي في SELECT | Global Benchmarking" from={t(86.2)} to={t(104)} color={C.amber} />

      <Editor x={90} y={150} w={1050} h={250} title="benchmark.sql" lines={['SELECT product_name, unit_price,', '       (SELECT AVG(unit_price) FROM products) AS global_avg', 'FROM products;']} start={t(86.3)} cps={1.2} size={24} accent={C.amber} />

      <div dir="ltr" style={{position: 'absolute', left: 1180, top: 160, display: 'flex', flexDirection: 'column', gap: 16, width: 650}}>
        <div style={{transform: `scale(${clamp(chip1)})`, opacity: clamp(chip1), transformOrigin: 'left center'}}><Chip color={C.blue} style={{fontSize: 26}}>computed ONCE</Chip></div>
        <div style={{transform: `scale(${clamp(chip2)})`, opacity: clamp(chip2), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 26}}>repeated beside every row</Chip></div>
        <div style={{transform: `scale(${clamp(chip3)})`, opacity: clamp(chip3), transformOrigin: 'left center'}}><Chip color={C.amber} style={{fontSize: 26}}>price − global_avg  (same row)</Chip></div>
      </div>

      <Win x={90} y={430} w={1740} h={470} title="result" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{position: 'relative', padding: '0 24px'}}>
          <div style={{display: 'flex', height: 40, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 340, paddingLeft: 12, color: colHi1 > 0.3 ? C.blue : C.muted}}>product_name</div>
            <div style={{width: 260, color: colHi1 > 0.3 ? C.blue : C.muted}}>unit_price</div>
            <div style={{width: 320, color: C.green, fontWeight: 700, opacity: prog(f, t(93.3), 14)}}>global_avg</div>
            <div style={{color: C.amber, fontWeight: 700, opacity: prog(f, t(113.3), 14)}}>difference</div>
          </div>
          {PRODUCTS.map((r, i) => {
            const rowIn = clamp(tbl * 1.4 - i * 0.05);
            const g = pop(f, t(93.3) + 6 + i * 7);
            const d = prog(f, t(113.8) + i * 9, 16);
            const diff = r.p - AVG;
            return (
              <div key={r.n} style={{display: 'flex', alignItems: 'center', height: RH, fontFamily: MONO, fontSize: 24, color: C.text, borderBottom: `1px solid ${C.border}`, opacity: rowIn, background: colHi1 > 0.3 ? `${C.blue}0F` : 'transparent'}}>
                <div style={{width: 340, paddingLeft: 12}}>{r.n}</div>
                <div style={{width: 260}}>{r.p}</div>
                <div style={{width: 320, color: C.green, fontWeight: 700, opacity: clamp(g), transform: `translateX(${(1 - clamp(g)) * 120}px)`, background: colHi2 > 0.4 ? `${C.green}1F` : 'transparent', borderRadius: 8, boxShadow: colHi2 > 0.4 ? `0 0 ${10 * glow}px ${C.green}44` : 'none'}}>$45.50</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, color: diff >= 0 ? C.green : C.amber, fontWeight: 700, opacity: d}}>
                  <svg width={34} height={26} viewBox="0 0 34 26"><path d={diff >= 0 ? 'M4 20 L17 6 L30 20' : 'M4 6 L17 20 L30 6'} fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {diff >= 0 ? '+' : '−'}{Math.abs(diff).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </Win>

      <div style={{position: 'absolute', left: 0, right: 0, top: 905, display: 'flex', justifyContent: 'center', opacity: clamp(done)}}>
        <Chip color={C.amber} style={{fontSize: 24}}><Mix>رؤية تحليلية بدون استعلامات دمج معقدة</Mix></Chip>
      </div>

      <Caption text="SELECT product_name, unit_price, (SELECT AVG(...) FROM products)" from={t(87)} to={t(104)} />
      <Caption text="Global Benchmarking ──► Appends Fixed Scalar Metric to Every Row" from={t(105.8)} to={t(124.5)} />
    </Stage>
  );
};
