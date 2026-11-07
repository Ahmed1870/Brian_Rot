import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['CREATE INDEX', C.green], [' idx_products_attrs_gin ', C.text], ['ON', C.pink], [' store_products', C.text]],
  [['  USING', C.pink], [' GIN ', C.green], ['(attributes ', C.text], ['jsonb_path_ops', C.amber], [');', C.text]],
];
const ENT = [['brand:Manzooma', '1, 4, 9'], ['color:Red', '2, 4'], ['specs.ram:16GB', '4'], ['in_stock:true', '1, 2, 4']];
const EX = [160, 450, 750, 1040];
const BUILD = 450; // 3001

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s3.code, T = B.s3.tree, M = B.s3.cmp;
  const size = fs('CREATE INDEX idx_products_attrs_gin ON store_products', K.w - 80, 44, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 300) * total);
  const rootOn = prog(f, BUILD, BUILD + 30);
  const cmp = ease(prog(f, BUILD + 200, BUILD + 330));

  return (
    <Scene dur={S.s3.dur} accent={C.green}>
      <Title ar="فهارس GIN المعكوسة" en="GIN Inverted Index · jsonb_path_ops" chip="SC 03 · GIN" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 36, top: 16 + i * 70, height: 70, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
      </Card>

      <Card box={T} accent={f >= BUILD ? C.green : C.line} at={300}>
        <div style={{position: 'absolute', left: 24, top: 16, direction: 'ltr'}}><Tag color={C.green}>GIN TREE · KEY → ROW IDs</Tag></div>
        <svg width={T.w} height={T.h} style={{position: 'absolute', inset: 0}}>
          <Defs />
          {EX.map((x, i) => {
            const t = prog(f, BUILD + 20 + i * 30, BUILD + 60 + i * 30);
            const p = prog(f, BUILD + 110 + i * 30, BUILD + 150 + i * 30);
            return (
              <g key={i}>
                <line x1={600} y1={106} x2={600 + (x - 600) * t} y2={106 + (182 - 106) * t} stroke={C.green} strokeWidth={5} opacity={t > 0 ? 1 : 0} />
                <line x1={x} y1={240} x2={x} y2={240 + 100 * p} stroke={C.green} strokeWidth={5} opacity={p > 0 ? 1 : 0} />
                <g opacity={t}>
                  <rect x={x - 125} y={182} width={250} height={58} rx={14} fill={C.bg2} stroke={C.green} strokeWidth={4} />
                  <text x={x} y={219} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.text}>{ENT[i][0]}</text>
                </g>
                <g opacity={p}>
                  <rect x={x - 115} y={340} width={230} height={64} rx={14} fill="rgba(16,185,129,0.14)" stroke={C.green} strokeWidth={3} />
                  <text x={x} y={379} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.green}>rows: {ENT[i][1]}</text>
                </g>
              </g>
            );
          })}
          <g opacity={rootOn} filter="url(#glow)">
            <rect x={500} y={52} width={200} height={56} rx={14} fill={C.bg2} stroke={C.green} strokeWidth={5} />
            <text x={600} y={89} textAnchor="middle" fontFamily={mono} fontSize={26} fontWeight={700} fill={C.green}>GIN INDEX</text>
          </g>
        </svg>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 12, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, BUILD + 260, BUILD + 320)}}>المستند اتفكّك لمفردات، وكل مفردة عارفة صفوفها</div>
      </Card>

      <Card box={M} accent={C.amber} at={BUILD + 150}>
        <div style={{position: 'absolute', left: 24, top: 16, direction: 'ltr'}}><Tag color={C.amber}>OPERATOR CLASSES</Tag></div>
        {[
          {n: 'jsonb_ops', d: '@>  ?  ?|  ?&', w: 100, c: C.dim, ar: 'الافتراضي: أكبر ويدعم كل المعاملات'},
          {n: 'jsonb_path_ops', d: '@>  only', w: 58, c: C.green, ar: 'أصغر وأسرع لـ @> بس'},
        ].map((o, i) => (
          <div key={o.n} style={{position: 'absolute', left: 24, right: 24, top: 70 + i * 190, direction: 'ltr', opacity: cmp}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontWeight: 700, fontSize: 26, color: o.c === C.dim ? C.text : C.green}}><span>{o.n}</span><span style={{fontSize: 22, color: C.dim}}>{o.d}</span></div>
            <div style={{height: 28, borderRadius: 14, background: 'rgba(100,116,139,0.3)', marginTop: 10}}><div style={{width: `${o.w * cmp}%`, height: '100%', borderRadius: 14, background: o.c === C.dim ? C.row : C.green}} /></div>
            <div style={{marginTop: 10, direction: 'rtl', fontFamily: cairo, fontWeight: 700, fontSize: 24, color: o.c === C.dim ? C.amber : C.green}}>{o.ar}</div>
          </div>
        ))}
      </Card>

      <Caption from={90} to={630} color={C.green}>CREATE INDEX idx_name ON table USING GIN (jsonb_column);</Caption>
      <Caption from={750} to={1230} color={C.green}>jsonb_path_ops ──► Faster & Smaller GIN Indexing Optimized for @&gt; Queries</Caption>
    </Scene>
  );
};
