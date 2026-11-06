import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['CREATE UNIQUE INDEX', C.purple], [' idx_customers_email', C.text]],
  [['  ON', C.pink], [' customers(email);', C.text]],
  [['CREATE INDEX', C.blue], [' idx_pending_orders', C.text]],
  [['  ON', C.pink], [' orders(order_id)', C.text]],
  [['  WHERE', C.pink], [" order_status = 'pending';", C.amber]],
];
const PEND = [['#7301', 'أحمد', '$420'], ['#7302', 'سارة', '$180'], ['#7305', 'منى', '$960']];

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s5.code, R = B.s5.report;
  const size = fs("  WHERE order_status = 'pending';", K.w - 70, 36, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 480) * total);
  const stamp = ease(prog(f, 800, 860));

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="فهرسة منظومة ستور" en="UNIQUE (Email) + Partial (Pending)" chip="SC 05 · ENTERPRISE" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 24, top: 40 + i * 78, height: 78, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 26, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 540, 600)}}>فهرس فريد للإيميل + فهرس جزئي للطلبات المعلقة</div>
      </Card>

      <Card box={R} accent={C.green} at={520}>
        <div style={{position: 'absolute', left: 22, top: 18, direction: 'ltr'}}><Tag color={C.purple}>CUSTOMERS · UNIQUE EMAIL</Tag></div>
        <div style={{position: 'absolute', right: 18, top: 8, width: 62, height: 62, borderRadius: 31, border: `5px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.green, opacity: stamp, transform: `scale(${0.6 + 0.4 * stamp}) rotate(-10deg)`}}>✓</div>
        <div style={{position: 'absolute', left: 22, right: 22, top: 74, display: 'flex', gap: 16, direction: 'ltr', opacity: prog(f, 600, 650)}}>
          {[['0', 'duplicate emails', C.green], ['1.2M', 'customers', C.text]].map(([v, l, c]) => (
            <div key={l as string} style={{flex: 1, height: 110, borderRadius: 14, border: `3px solid ${C.line}`, background: C.panel2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 44, color: c as string}}>{v}</span>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.dim}}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 22, top: 216, direction: 'ltr', opacity: prog(f, 680, 720)}}><Tag color={C.amber}>PENDING QUEUE · PARTIAL INDEX</Tag></div>
        {PEND.map((p, i) => {
          const t = ease(prog(f, 700 + i * 36, 750 + i * 36));
          return (
            <div key={i} style={{position: 'absolute', left: 22, right: 22, top: 258 + i * 62, height: 52, borderRadius: 12, border: `2px solid ${C.amber}`, background: 'rgba(245,158,11,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.text, opacity: t, transform: `translateY(${(1 - t) * 20}px)`}}>
              <span>{p[0]}</span><span style={{fontFamily: cairo}}>{p[1]}</span><span style={{color: C.amber}}>{p[2]}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 22, right: 22, top: 460, display: 'flex', justifyContent: 'center', opacity: prog(f, 860, 910)}}>
          <span style={{fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.bg, background: C.green, borderRadius: 999, padding: '6px 26px'}}>0.4 ms · 1,240 of 8M rows</span>
        </div>
        <div style={{position: 'absolute', left: 22, right: 22, bottom: 24, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 900, 960)}}>صفر تكرار، وطابور الطلبات بيفتح في لحظة ✓</div>
      </Card>

      <Caption from={60} to={540} color={C.green}>Enterprise Indexing ──► UNIQUE Index (Email) + Partial Index (Pending Orders)</Caption>
      <Caption from={660} to={1080} color={C.green}>Production Analytics ──► Zero Duplication & Sub-Millisecond Pending Queue</Caption>
    </Scene>
  );
};
