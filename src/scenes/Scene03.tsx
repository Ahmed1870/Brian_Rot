import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['SELECT', C.pink], [' product_name, category_id, revenue,', C.text]],
  [['       ', C.text], ['ROW_NUMBER()', C.green], [' OVER(', C.text], ['PARTITION BY', C.pink], [' category_id ', C.text], ['ORDER BY', C.pink], [' revenue ', C.text], ['DESC', C.pink], [') ', C.text], ['AS', C.pink], [' item_rank', C.text]],
  [['FROM', C.pink], [' product_sales;', C.text]],
];
const CATS = [
  {id: 1, col: C.blue, t0: 450, items: [['لابتوب', 4800], ['شاشة', 3100], ['ماوس', 1200], ['كيبورد', 900]]},
  {id: 2, col: C.amber, t0: 700, items: [['جاكيت', 2200], ['حذاء', 1900], ['تيشيرت', 1500], ['شنطة', 800]]},
];
const RY = 78, RP = 80, RH = 66;

const Part: React.FC<{box: typeof B.s3.cat1; c: typeof CATS[number]}> = ({box, c}) => {
  const f = useCurrentFrame();
  const stamped = c.items.filter((_, i) => f >= c.t0 + 30 + i * 50).length; // counter value
  const pulse = c.id === 2 && f >= c.t0 - 10 && f < c.t0 + 40 ? 1 - Math.abs(f - c.t0 - 10) / 30 : 0;
  return (
    <Card box={box} accent={c.col} at={c.t0 - 30}>
      <div style={{position: 'absolute', left: 28, top: 18, direction: 'ltr'}}><Tag color={c.col}>category_id = {c.id}</Tag></div>
      <div style={{position: 'absolute', right: 24, top: 10, direction: 'ltr', display: 'flex', alignItems: 'center', gap: 10, fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.dim, transform: `scale(${1 + 0.25 * pulse})`}}>
        counter <span style={{minWidth: 54, textAlign: 'center', background: pulse > 0 ? C.green : C.panel2, color: pulse > 0 ? C.bg : C.green, border: `3px solid ${C.green}`, borderRadius: 12, padding: '2px 10px', fontSize: 30}}>{stamped}</span>
      </div>
      {c.items.map((it, i) => {
        const st = ease(prog(f, c.t0 + 30 + i * 50, c.t0 + 70 + i * 50));
        return (
          <div key={i} style={{position: 'absolute', left: 20, right: 20, top: RY + i * RP, height: RH, borderRadius: 14, border: `3px solid ${c.col}`, background: C.panel2, display: 'flex', alignItems: 'center', gap: 18, padding: '0 18px', direction: 'ltr', opacity: prog(f, c.t0 + i * 10, c.t0 + 30 + i * 10)}}>
            <div style={{width: 80, height: 48, borderRadius: 12, background: C.green, color: C.bg, fontFamily: mono, fontWeight: 700, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: st, transform: `scale(${0.7 + 0.3 * st})`}}>{i + 1}</div>
            <span style={{flex: 1, fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.text, direction: 'rtl', textAlign: 'left', marginLeft: 20}}>{it[0]}</span>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text}}>${(it[1] as number).toLocaleString('en-US')}</span>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 20, right: 20, bottom: 14, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 26, color: c.col, opacity: prog(f, c.t0 + (c.id === 1 ? 230 : 240), c.t0 + (c.id === 1 ? 280 : 290))}}>
        {c.id === 1 ? 'ترقيم القسم الأول: 1 → 4' : 'العداد رجع لـ 1: ترقيم مستقل بالكامل'}
      </div>
    </Card>
  );
};

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s3.code;
  const size = fs('       ROW_NUMBER() OVER(PARTITION BY category_id ORDER BY revenue DESC) AS item_rank', K.w - 70, 34, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 300) * total);
  const badge = ease(prog(f, 900, 960));
  return (
    <Scene dur={S.s3.dur} accent={C.amber}>
      <Title ar="الترتيب الفئوي المستقل" en="PARTITION BY + ORDER BY" chip="SC 03 · PARTITION" accent={C.amber} />
      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 36, top: 18 + i * 56, height: 56, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', right: 30, top: 0, height: 56, display: 'flex', alignItems: 'center', opacity: badge, fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, direction: 'rtl'}} />
      </Card>
      {CATS.map((c) => <Part key={c.id} box={c.id === 1 ? B.s3.cat1 : B.s3.cat2} c={c} />)}
      <div style={{position: 'absolute', left: 60, top: 404, width: 1800, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 24, color: C.green, opacity: badge, height: 24, lineHeight: '24px'}}>كل قسم له ترقيم مستقل ✓</div>
      <Caption from={90} to={630} color={C.amber}>ROW_NUMBER() OVER(PARTITION BY category_id ORDER BY revenue DESC)</Caption>
      <Caption from={750} to={1230} color={C.green}>Partition Reset ──► Zeroes Out Counter for Independent Category Ranking</Caption>
    </Scene>
  );
};
