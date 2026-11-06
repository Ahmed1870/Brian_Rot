import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['CREATE OR REPLACE VIEW', C.amber], [' v_monthly_sales_summary ', C.text], ['AS', C.pink]],
  [['SELECT', C.pink], [" DATE_TRUNC('month', o.order_date) ", C.text], ['AS', C.pink], [' sales_month,', C.text]],
  [['       p.category_name, ', C.text], ['SUM', C.blue], ['(o.total_amount) ', C.text], ['AS', C.pink], [' monthly_revenue', C.text]],
  [['FROM', C.pink], [' orders o ', C.text], ['JOIN', C.pink], [' products p ', C.text], ['ON', C.pink], [' o.product_id = p.product_id', C.text]],
  [['GROUP BY', C.pink], [' 1, 2;', C.text]],
];
const ROWS = [['2026-01', 'Electronics', '182,400'], ['2026-01', 'Fashion', '96,300'], ['2026-02', 'Electronics', '201,900'], ['2026-02', 'Fashion', '88,700'], ['2026-03', 'Electronics', '224,500'], ['2026-03', 'Fashion', '105,200']];
const Q2 = 'SELECT * FROM v_monthly_sales_summary;';

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s5.code, R = B.s5.report;
  const size = fs('FROM orders o JOIN products p ON o.product_id = p.product_id', K.w - 60, 26, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 480) * total);
  const stamp = ease(prog(f, 800, 860));

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="واجهة ملخص المبيعات" en="Enterprise View · v_monthly_sales_summary" chip="SC 05 · ENTERPRISE" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 24, top: 28 + i * 64, height: 64, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 24, right: 24, top: 410, direction: 'ltr', opacity: prog(f, 560, 620)}}>
          <Tag color={C.blue}>ANALYST · ONE LINE</Tag>
          <div style={{marginTop: 12, borderRadius: 14, border: `3px solid ${C.blue}`, background: 'rgba(56,189,248,0.08)', padding: '14px 20px', fontFamily: mono, fontWeight: 700, whiteSpace: 'nowrap', fontSize: fs(Q2, K.w - 100, 30, mono), color: C.text}}>
            <span style={{color: C.pink}}>SELECT</span> * <span style={{color: C.pink}}>FROM</span> v_monthly_sales_summary;
          </div>
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 26, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 700, 760)}}>3 جداول ← منظور واحد ← بيانات العملاء الشخصية مخفية</div>
      </Card>

      <Card box={R} accent={C.green} at={520}>
        <div style={{position: 'absolute', left: 22, top: 18, direction: 'ltr'}}><Tag color={C.green}>v_monthly_sales_summary</Tag></div>
        <div style={{position: 'absolute', right: 18, top: 10, width: 66, height: 66, borderRadius: 33, border: `5px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.green, opacity: stamp, transform: `scale(${0.6 + 0.4 * stamp}) rotate(-10deg)`}}>✓</div>
        <div style={{position: 'absolute', left: 22, right: 22, top: 96, display: 'flex', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 19, color: C.dim}}><span style={{width: 150}}>sales_month</span><span style={{width: 220}}>category_name</span><span>monthly_revenue</span></div>
        {ROWS.map((r, i) => {
          const t = ease(prog(f, 600 + i * 40, 650 + i * 40));
          return (
            <div key={i} style={{position: 'absolute', left: 18, right: 18, top: 130 + i * 78, height: 64, borderRadius: 12, border: `2px solid ${C.green}`, background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', padding: '0 16px', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.text, opacity: t, transform: `translateY(${(1 - t) * 24}px)`}}>
              <span style={{width: 150}}>{r[0]}</span><span style={{width: 220}}>{r[1]}</span><span style={{color: C.green}}>${r[2]}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 22, right: 22, bottom: 24, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 880, 940)}}>حوكمة بيانات + شغل أسهل للمحللين ✓</div>
      </Card>

      <Caption from={60} to={540} color={C.green}>Enterprise Views ──► Encapsulates Complex Multi-Table Aggregations</Caption>
      <Caption from={660} to={1080} color={C.green}>Data Governance ──► Simplifies Analyst Workflows & Guarantees Compliance</Caption>
    </Scene>
  );
};
