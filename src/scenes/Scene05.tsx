import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['CREATE INDEX', C.green], [' idx_products_attrs_path ', C.text], ['ON', C.pink], [' store_products', C.text]],
  [['  USING', C.pink], [' GIN ', C.green], ['(attributes jsonb_path_ops);', C.text]],
  [['SELECT', C.pink], [' product_name, attributes ', C.text], ['FROM', C.pink], [' store_products', C.text]],
  [['WHERE', C.pink], [' attributes ', C.text], ['@>', C.blue], [` '{"brand": "Manzooma", "in_stock": true}';`, C.amber]],
];
const RES = [['Manzooma Pro Laptop', '$1,450'], ['Manzooma Mouse X', '$39'], ['Manzooma Keyboard K2', '$89'], ['Manzooma Display 27"', '$320']];

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s5.code, R = B.s5.shop;
  const size = fs(`WHERE attributes @> '{"brand": "Manzooma", "in_stock": true}';`, K.w - 60, 30, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 480) * total);
  const stamp = ease(prog(f, 800, 860));

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="تسريع بحث الكتالوج" en="Enterprise Catalog Search · GIN + @>" chip="SC 05 · ENTERPRISE" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 24, top: 40 + i * 86, height: 86, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 26, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 540, 600)}}>فهرس GIN + معامل الاحتواء = بحث لحظي</div>
      </Card>

      <Card box={R} accent={C.green} at={520}>
        <div style={{position: 'absolute', left: 22, top: 18, direction: 'ltr'}}><Tag color={C.green}>MANZOOMA STORE · CATALOG</Tag></div>
        <div style={{position: 'absolute', right: 18, top: 8, width: 62, height: 62, borderRadius: 31, border: `5px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.green, opacity: stamp, transform: `scale(${0.6 + 0.4 * stamp}) rotate(-10deg)`}}>✓</div>
        <div style={{position: 'absolute', left: 22, right: 22, top: 80, display: 'flex', gap: 12, direction: 'ltr', opacity: prog(f, 580, 620)}}>
          {['brand: Manzooma', 'in_stock: true'].map((c) => (<span key={c} style={{fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.blue, border: `2px solid ${C.blue}`, borderRadius: 999, padding: '4px 16px'}}>{c}</span>))}
        </div>
        <div style={{position: 'absolute', left: 22, right: 22, top: 140, display: 'flex', gap: 16, direction: 'ltr', opacity: prog(f, 640, 700)}}>
          <div style={{flex: 1, height: 110, borderRadius: 14, border: `3px solid ${C.line}`, background: C.panel2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.text}}>100,000+</span><span style={{fontFamily: mono, fontWeight: 700, fontSize: 18, color: C.dim}}>products</span>
          </div>
          <div style={{flex: 1, height: 110, borderRadius: 14, border: `3px solid ${C.green}`, background: 'rgba(16,185,129,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 44, color: C.green}}>0.8 ms</span><span style={{fontFamily: mono, fontWeight: 700, fontSize: 18, color: C.dim}}>filter time</span>
          </div>
        </div>
        {RES.map((r, i) => {
          const t = ease(prog(f, 700 + i * 36, 750 + i * 36));
          return (
            <div key={i} style={{position: 'absolute', left: 22, right: 22, top: 280 + i * 76, height: 64, borderRadius: 12, border: `2px solid ${C.green}`, background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 23, color: C.text, opacity: t, transform: `translateY(${(1 - t) * 20}px)`}}>
              <span>{r[0]}</span><span style={{color: C.green}}>{r[1]}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 22, right: 22, bottom: 22, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 900, 960)}}>أسرع 100 مرة وقت الضغط العالي ✓</div>
      </Card>

      <Caption from={60} to={540} color={C.green}>Enterprise Catalog Search ──► Sub-Millisecond Filter via GIN Index & @&gt;</Caption>
      <Caption from={660} to={1080} color={C.green}>Production JSONB Performance ──► 100x Faster Product Queries Under Heavy Traffic</Caption>
    </Scene>
  );
};
