import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, lerp, prog} from '../common';

const ROWS = [
  {p: 'كيبورد ميكانيكي', price: 350, city: 'القاهرة'},
  {p: 'ماوس لاسلكي', price: 120, city: 'الجيزة'},
  {p: 'شاشة 27 بوصة', price: 2400, city: 'القاهرة'},
  {p: 'سماعة بلوتوث', price: 480, city: 'الإسكندرية'},
  {p: 'كاميرا ويب', price: 90, city: 'الجيزة'},
  {p: 'هارد خارجي', price: 650, city: 'القاهرة'},
  {p: 'شاحن سريع', price: 210, city: 'أسوان'},
  {p: 'حامل لابتوب', price: 160, city: 'الجيزة'},
];
const OK1 = ROWS.map((r) => r.price >= 100 && r.price <= 500);
const OK2 = ROWS.map((r, i) => OK1[i] && (r.city === 'القاهرة' || r.city === 'الجيزة'));
const rank = (ok: boolean[], i: number) => ok.slice(0, i).filter(Boolean).length;
const T1 = 450, T2 = 900; // apply BETWEEN / apply IN
const RH = 66, RY = 96;

const CODE = [
  {t: 'SELECT product, unit_price, city', at: 0},
  {t: 'FROM products', at: 0},
  {t: 'WHERE unit_price BETWEEN 100 AND 500', at: 0},
  {t: "  AND city IN ('القاهرة', 'الجيزة');", at: 700},
];
const KW = ['SELECT', 'FROM', 'WHERE', 'BETWEEN', 'AND', 'IN'];

const Code: React.FC<{text: string; shown: number}> = ({text, shown}) => (
  <>
    {(text.match(/'[^']*'|[A-Za-z_]+|\s+|[^\sA-Za-z_']+/g) ?? []).reduce<{out: React.ReactNode[]; used: number}>((acc, tk, i) => {
      const take = Math.max(0, Math.min(tk.length, shown - acc.used));
      const color = tk.startsWith("'") ? C.amber : KW.includes(tk) ? C.pink : /^\d+$/.test(tk) ? C.blue : tk === 'unit_price' || tk === 'city' ? C.text : C.text;
      if (take > 0) acc.out.push(<span key={i} style={{color, fontWeight: KW.includes(tk) ? 700 : 400, whiteSpace: 'pre', unicodeBidi: 'isolate'}}>{tk.slice(0, take)}</span>);
      acc.used += tk.length;
      return acc;
    }, {out: [], used: 0}).out}
  </>
);

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const t = B.s3.table;
  const live = ROWS.filter((_, i) => (f < T1 ? true : f < T2 ? OK1[i] : OK2[i])).length;
  const op = f < T1 ? -1 : f < T2 ? 4 : 5; // highlighted operator chip

  return (
    <Scene dur={S.s3.dur} accent={C.amber}>
      <Title ar="الفلترة الدقيقة بـ WHERE" en="Comparison · BETWEEN · IN" chip="SC 03 · WHERE" accent={C.amber} />

      {/* editor */}
      <Card box={B.s3.editor} accent={C.line} at={6}>
        <div style={{height: 52, background: C.panel, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', direction: 'ltr'}}>
          {[C.red, C.amber, C.green].map((c) => (<span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />))}
          <span style={{marginLeft: 12, fontFamily: mono, fontSize: 22, color: C.dim}}>filter_products.sql</span>
        </div>
        {CODE.map((l, i) => {
          const total = l.t.length;
          const start = l.at + (i < 3 ? i * 90 : 0);
          const shown = Math.floor(prog(f, start, start + (i === 3 ? 150 : 80 + total * 2)) * total);
          return (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 78 + i * 76, height: 64, display: 'flex', alignItems: 'center', fontFamily: `${mono}, ${cairo}`, fontSize: 29, direction: 'ltr', background: (i === 2 && f >= T1 - 60 && f < T2 - 60) || (i === 3 && f >= T2 - 60) ? 'rgba(245,158,11,0.10)' : 'transparent'}}>
              <span style={{width: 64, textAlign: 'right', paddingRight: 22, color: C.line, fontSize: 24}}>{i + 1}</span>
              <Code text={l.t} shown={shown} />
            </div>
          );
        })}
      </Card>

      {/* operator chips */}
      <Card box={B.s3.chips} accent={C.line} at={40}>
        <div style={{display: 'flex', gap: 14, padding: '28px 28px 0', direction: 'ltr', flexWrap: 'nowrap'}}>
          {['=', '<>', '>', '<', 'BETWEEN', 'IN'].map((o, i) => {
            const on = op === i;
            return (
              <div key={o} style={{height: 70, minWidth: i < 4 ? 78 : 188, padding: '0 14px', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 30, fontWeight: 700, color: on ? C.bg : C.text, background: on ? C.amber : 'rgba(51,65,85,0.5)', border: `2px solid ${on ? C.amber : C.line}`}}>{o}</div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, bottom: 26, fontFamily: cairo, fontWeight: 700, fontSize: 30, color: f < T1 ? C.dim : C.text, direction: 'rtl', textAlign: 'right'}}>
          {f < T1 ? 'معاملات المقارنة: = ، <> ، > ، <' : f < T2 ? 'BETWEEN ← نطاق الأسعار من 100 إلى 500' : 'IN ← قائمة مدن محددة فقط'}
        </div>
      </Card>

      {/* products table */}
      <Card box={t} accent={C.line} at={20}>
        <div style={{position: 'absolute', left: 24, right: 24, top: 24, height: 56, display: 'flex', alignItems: 'center', fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.dim, direction: 'ltr'}}>
          <span style={{width: 330}}>product</span><span style={{width: 200}}>unit_price</span><span>city</span>
        </div>
        {ROWS.map((r, i) => {
          const s1 = f < T1 ? i : lerp(i, OK1[i] ? rank(OK1, i) : i, ease(prog(f, T1 + 30, T1 + 110)));
          const slot = f < T2 ? s1 : lerp(s1, OK2[i] ? rank(OK2, i) : s1, ease(prog(f, T2 + 30, T2 + 110)));
          const drop = ease(prog(f, 50 + i * 10, 80 + i * 10));
          const gone1 = !OK1[i] ? prog(f, T1, T1 + 50) : 0;
          const gone2 = OK1[i] && !OK2[i] ? prog(f, T2, T2 + 50) : 0;
          const gone = Math.max(gone1, gone2);
          const hot = OK1[i] && f >= T1 && f < T2 ? 1 : OK2[i] && f >= T2 ? 1 : 0;
          const snap = OK2[i] && f > T2 + 100 ? 1 + 0.02 * Math.sin(prog(f, T2 + 100, T2 + 140) * Math.PI) : 1;
          return (
            <div key={i} style={{position: 'absolute', left: 20, right: 20, top: RY + slot * RH - (1 - drop) * 70, height: RH - 8, borderRadius: 14, display: 'flex', alignItems: 'center', padding: '0 16px', direction: 'ltr', opacity: drop * (1 - gone), transform: `translateX(${gone * 120}px) scale(${snap})`, background: hot ? 'rgba(16,185,129,0.18)' : 'rgba(51,65,85,0.35)', border: `2px solid ${hot ? C.green : 'transparent'}`}}>
              <span style={{width: 330, fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text, direction: 'rtl', textAlign: 'left'}}>{r.p}</span>
              <span style={{width: 200, fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text}}>{r.price}</span>
              <span style={{fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text}}>{r.city}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 14, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'ltr'}}>
          <Tag color={C.dim}>MATCHING ROWS</Tag>
          <span style={{fontFamily: mono, fontSize: 32, fontWeight: 700, color: live < 8 ? C.green : C.text}}>{live} / 8</span>
        </div>
      </Card>

      <Caption from={90} to={630} color={C.amber}>WHERE unit_price BETWEEN 100 AND 500</Caption>
      <Caption from={750} to={1230} color={C.green}>{"WHERE city IN ('القاهرة', 'الجيزة')"}</Caption>
    </Scene>
  );
};
