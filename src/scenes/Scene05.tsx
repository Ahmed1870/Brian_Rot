import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['SELECT', C.pink], [' customer_id, order_date, amount,', C.text]],
  [['  LAG', C.blue], ['(amount, 1, 0) ', C.text], ['OVER(PARTITION BY', C.pink], [' customer_id', C.text]],
  [['    ORDER BY', C.pink], [' order_date) ', C.text], ['AS', C.pink], [' prev_amount,', C.text]],
  [['  FIRST_VALUE', C.green], ['(amount) ', C.text], ['OVER(PARTITION BY', C.pink], [' customer_id', C.text]],
  [['    ORDER BY', C.pink], [' order_date', C.text]],
  [['    ROWS BETWEEN UNBOUNDED PRECEDING', C.purple]],
  [['    AND UNBOUNDED FOLLOWING) ', C.purple], ['AS', C.pink], [' first_amount', C.text]],
  [['FROM', C.pink], [' customer_orders;', C.text]],
];
const AMT = [200, 260, 240, 360, 420];
const DATES = ['01-05', '01-20', '02-18', '03-09', '03-30'];
const FIRST = 200;
const COLS = [{k: 'date', x: 16, w: 110}, {k: 'amount', x: 136, w: 100}, {k: 'prev', x: 246, w: 100}, {k: 'MoM %', x: 356, w: 130}, {k: 'first', x: 496, w: 100}, {k: 'vs first', x: 606, w: 130}];
const pct = (a: number, b: number) => `${a >= b ? '+' : ''}${(((a - b) / b) * 100).toFixed(1)}%`;

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s5.code, R = B.s5.report;
  const size = fs('  FIRST_VALUE(amount) OVER(PARTITION BY customer_id', K.w - 60, 28, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 500) * total);
  const stamp = ease(prog(f, 800, 860));

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="نمو المبيعات ورحلة العميل" en="MoM Growth & Customer Journey" chip="SC 05 · ENTERPRISE" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 24, top: 30 + i * 70, height: 70, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 24, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 540, 600)}}>LAG + FIRST_VALUE في استعلام واحد</div>
      </Card>

      <Card box={R} accent={C.green} at={520}>
        <div style={{position: 'absolute', left: 20, top: 18, direction: 'ltr'}}><Tag color={C.green}>CUSTOMER 101 · JOURNEY</Tag></div>
        <div style={{position: 'absolute', right: 18, top: 10, width: 66, height: 66, borderRadius: 33, border: `5px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.green, opacity: stamp, transform: `scale(${0.6 + 0.4 * stamp}) rotate(-10deg)`}}>✓</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 96, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 18, color: C.dim}}>
          {COLS.map((c) => (<span key={c.k} style={{position: 'absolute', left: c.x + 4, whiteSpace: 'nowrap', color: c.k === 'prev' ? C.blue : c.k === 'first' ? C.green : C.dim}}>{c.k}</span>))}
        </div>
        {AMT.map((a, i) => {
          const prev = i === 0 ? 0 : AMT[i - 1];
          const t = ease(prog(f, 600 + i * 40, 650 + i * 40));
          const vals = [DATES[i], '$' + a, '$' + prev, i === 0 ? 'n/a' : pct(a, prev), '$' + FIRST, pct(a, FIRST)];
          return (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 130 + i * 70, height: 56, direction: 'ltr', opacity: t, transform: `translateY(${(1 - t) * 24}px)`}}>
              {COLS.map((c, j) => {
                const v = vals[j];
                const neg = v.startsWith('-');
                const color = c.k === 'prev' ? C.blue : c.k === 'first' ? C.green : (c.k === 'MoM %' || c.k === 'vs first') ? (v === 'n/a' ? C.dim : neg ? C.red : C.green) : C.text;
                return <div key={c.k} style={{position: 'absolute', left: c.x, top: 0, width: c.w, height: 56, borderRadius: 10, border: `2px solid ${C.line}`, background: C.panel2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 22, color}}>{v}</div>;
              })}
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, direction: 'rtl', textAlign: 'center', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 860, 920)}}>القيمة الممتدة للعميل LTV بتزيد ✓</div>
      </Card>

      <Caption from={60} to={540} color={C.green}>Enterprise Analytics ──► MoM Revenue Growth % & Customer Journey Metrics</Caption>
      <Caption from={660} to={1080} color={C.green}>Cohort Retention ──► Benchmarks Initial Purchase vs Subsequent Orders</Caption>
    </Scene>
  );
};
