import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC05 (frames 4755-5890, global 158.5-196.3s): multi-table LEFT JOIN -> funnel, retention, activation, churn (illustrative numbers).
const S = 158.5;
const t = (g: number) => sec(g - S);
const CODE = [
  'SELECT c.customer_id,',
  '  COUNT(DISTINCT o.order_id) AS total_orders,',
  '  COUNT(DISTINCT r.review_id) AS total_reviews',
  'FROM customers c',
  'LEFT JOIN orders o ON c.customer_id = o.customer_id',
  'LEFT JOIN reviews r ON o.order_id = r.order_id',
  'GROUP BY c.customer_id;',
];
const KPI = [
  {k: 'Activation', v: 64, u: '%', c: C.green, g: 182.0},
  {k: 'Retention', v: 42, u: '%', c: C.blue, g: 175.6},
  {k: 'Churn', v: 36, u: '%', c: C.red, g: 185.0},
  {k: 'Avg rating', v: 4.3, u: '★', c: C.amber, g: 187.3},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const n1 = pop(f, t(168.0));
  const n2 = pop(f, t(170.9));
  const n3 = pop(f, t(172.4));
  const dash = prog(f, t(174.4), 24);
  const fun = (i: number) => prog(f, t(177.8) + i * 14, sec(2));
  const seal = pop(f, t(191.5));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);
  const BW = 640;

  return (
    <Stage dur={1135} inFx="zoom" outFx="down">
      <TopBadge text="التحليل المؤسسي | Multi-Table LEFT JOIN" from={t(159.8)} to={t(170)} color={C.blue} />

      <Editor x={90} y={150} w={1100} h={400} title="funnel_analysis.sql" lines={CODE} start={t(160.2)} cps={1.9} size={22} accent={C.blue} />

      {/* table chain */}
      <div dir="ltr" style={{position: 'absolute', left: 1230, top: 170, width: 600, fontFamily: MONO}}>
        {[
          {n: 'customers', c: C.blue, p: n1},
          {n: 'orders', c: C.green, p: n2},
          {n: 'reviews', c: C.amber, p: n3},
        ].map((x, i) => (
          <div key={x.n}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, height: 70, borderRadius: 16, border: `2px solid ${x.c}`, background: `${x.c}1A`, padding: '0 24px', fontSize: 28, color: C.text, opacity: clamp(x.p), transform: `translateX(${(1 - clamp(x.p)) * 40}px)`}}>
              <span style={{color: x.c, fontWeight: 700}}>{i === 0 ? 'FROM' : 'LEFT JOIN'}</span>
              {x.n}
            </div>
            {i < 2 && <div style={{height: 34, marginLeft: 40, borderLeft: `4px dashed ${C.border}`}} />}
          </div>
        ))}
      </div>

      {/* funnel dashboard */}
      <Win x={90} y={580} w={1000} h={320} title="customer funnel" accent={C.border} opacity={dash}>
        <div dir="ltr" style={{padding: '18px 26px', fontFamily: MONO}}>
          {[
            {n: 'Customers', v: 100, c: C.blue, l: '1,000'},
            {n: 'Placed orders', v: 64, c: C.green, l: '640'},
            {n: 'Left reviews', v: 41, c: C.amber, l: '410'},
          ].map((r, i) => (
            <div key={r.n} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18}}>
              <span style={{width: 190, fontSize: 22, color: C.muted}}>{r.n}</span>
              <div style={{width: BW, height: 44, background: C.deep, borderRadius: 10, overflow: 'hidden'}}>
                <div style={{width: (BW * r.v * fun(i)) / 100, height: '100%', background: r.c, borderRadius: 10}} />
              </div>
              <span style={{fontSize: 26, color: C.text, fontWeight: 700, opacity: fun(i)}}>{r.l}</span>
            </div>
          ))}
        </div>
      </Win>

      {/* KPIs */}
      <div dir="ltr" style={{position: 'absolute', left: 1130, top: 580, width: 700, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        {KPI.map((k) => {
          const p = prog(f, t(k.g), 24);
          const val = k.u === '★' ? (k.v * p).toFixed(1) : String(Math.round(k.v * p));
          return (
            <div key={k.k} style={{height: 140, borderRadius: 20, border: `2px solid ${k.c}`, background: C.card, padding: '16px 24px', opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
              <div style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>{k.k}</div>
              <div style={{fontFamily: MONO, fontSize: 64, fontWeight: 700, color: k.c, lineHeight: 1.1}}>{val}<span style={{fontSize: 34}}>{k.u}</span></div>
            </div>
          );
        })}
      </div>

      <div dir="ltr" style={{position: 'absolute', left: 1130, top: 862, display: 'flex', alignItems: 'center', gap: 16, opacity: clamp(seal), transform: `scale(${0.85 + 0.15 * clamp(seal)})`, transformOrigin: 'left center'}}>
        <Check p={clamp(seal)} size={44} />
        <Chip color={C.green} style={{fontSize: 24, boxShadow: `0 0 ${18 * glow}px ${C.green}55`}}>Enterprise Metric Seal · illustrative data</Chip>
      </div>

      <Caption text="Multi-Table LEFT JOIN ──► Customer ➔ Orders ➔ Reviews Funnel" from={t(166.5)} to={t(177)} />
      <Caption text="Enterprise Value ──► Computes Retention, Activation & Churn Rates" from={t(178)} to={t(195)} />
    </Stage>
  );
};
