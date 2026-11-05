import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['WITH', C.pink], [' RankedSales ', C.text], ['AS', C.pink], [' (', C.text]],
  [['  SELECT', C.pink], [' product_name, category_id, revenue,', C.text]],
  [['         ', C.text], ['DENSE_RANK()', C.green], [' OVER(', C.text], ['PARTITION BY', C.pink], [' category_id', C.text]],
  [['                           ', C.text], ['ORDER BY', C.pink], [' revenue ', C.text], ['DESC', C.pink], [') ', C.text], ['AS', C.pink], [' rk', C.text]],
  [['  FROM', C.pink], [' product_sales', C.text]],
  [[')', C.text]],
  [['SELECT', C.pink], [' * ', C.text], ['FROM', C.pink], [' RankedSales ', C.text], ['WHERE', C.pink], [' rk <= 3;', C.green]],
];
const CATS = [
  {c: 'إلكترونيات', col: C.blue, items: [['لابتوب', '48,200'], ['سماعة', '31,500'], ['ماوس', '29,800']]},
  {c: 'ملابس', col: C.amber, items: [['جاكيت', '22,400'], ['حذاء', '19,900'], ['تيشيرت', '18,700']]},
  {c: 'أثاث', col: C.purple, items: [['مكتب', '35,100'], ['كرسي', '27,600'], ['رف', '14,300']]},
];

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s5.code, R = B.s5.report;
  const size = fs('                           ORDER BY revenue DESC) AS rk', K.w - 70, 28, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 480) * total);
  const stamp = ease(prog(f, 640, 700));

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="أفضل المبيعات وحظر التكرار" en="Top-N per Category · Deduplication" chip="SC 05 · ENTERPRISE" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 24, top: 30 + i * 66, height: 66, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.amber, opacity: prog(f, 700, 760)}}>ROW_NUMBER() = 1 ← نشيل التكرار ونحتفظ بسطر واحد</div>
      </Card>

      <Card box={R} accent={C.green} at={300}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.green}>TOP-3 PER CATEGORY</Tag></div>
        <div style={{position: 'absolute', right: 20, top: 8, width: 70, height: 70, borderRadius: 35, border: `5px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.green, opacity: stamp, transform: `scale(${0.6 + 0.4 * stamp}) rotate(-10deg)`}}>✓</div>
        {CATS.map((c, ci) => (
          <div key={ci} style={{position: 'absolute', left: 20, right: 20, top: 84 + ci * 178, height: 166, borderRadius: 18, border: `3px solid ${c.col}`, background: C.panel2, opacity: prog(f, 340 + ci * 90, 380 + ci * 90)}}>
            <div style={{height: 38, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: cairo, fontWeight: 900, fontSize: 24, color: c.col, direction: 'rtl'}}>{c.c}</div>
            {c.items.map((it, ii) => {
              const t = ease(prog(f, 380 + ci * 90 + ii * 24, 420 + ci * 90 + ii * 24));
              return (
                <div key={ii} style={{height: 40, margin: '0 12px 2px', display: 'flex', alignItems: 'center', gap: 14, direction: 'ltr', opacity: t, transform: `translateX(${(1 - t) * 50}px)`}}>
                  <span style={{width: 40, height: 32, borderRadius: 8, background: C.green, color: C.bg, fontFamily: mono, fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ii + 1}</span>
                  <span style={{flex: 1, fontFamily: cairo, fontWeight: 700, fontSize: 24, color: C.text, direction: 'rtl', textAlign: 'left'}}>{it[0]}</span>
                  <span style={{fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.dim}}>${it[1]}</span>
                </div>
              );
            })}
          </div>
        ))}
      </Card>

      <Caption from={60} to={540} color={C.green}>Enterprise Top-N Filtering ──► CTE + DENSE_RANK() OVER(PARTITION BY)</Caption>
      <Caption from={660} to={1080} color={C.amber}>Deduplication Strategy ──► ROW_NUMBER() Deduplication in Production</Caption>
    </Scene>
  );
};
