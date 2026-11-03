import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, fs, lerp, prog} from '../common';

const ORD = [{id: '#1', a: '2,400', ok: true}, {id: '#2', a: '1,150', ok: true}, {id: '#3', a: '860', ok: true}, {id: '#4', a: '3,200', ok: false}, {id: '#5', a: '540', ok: false}];
const PAY = [{id: 'P1', r: '→ #1', ok: true}, {id: 'P2', r: '→ #2', ok: true}, {id: 'P3', r: '→ #3', ok: true}, {id: 'P4', r: '→ ?', ok: false}, {id: 'P5', r: '→ ?', ok: false}];
const REP = [
  {t: 'طلب #4 بدون دفع', c: C.amber, k: 'UNPAID'}, {t: 'طلب #5 بدون دفع', c: C.amber, k: 'UNPAID'},
  {t: 'دفعة P4 بدون طلب', c: C.purple, k: 'ORPHAN'}, {t: 'دفعة P5 بدون طلب', c: C.purple, k: 'ORPHAN'},
];
const RY = 92, RP = 64;
const QUERY = [
  [['SELECT', C.pink], [' o.order_id, p.payment_id, o.total_amount, p.amount_paid', C.text]],
  [['FROM', C.pink], [' orders o ', C.text], ['FULL OUTER JOIN', C.pink], [' payments p ON o.order_id = p.order_id', C.text]],
  [['WHERE', C.pink], [' o.order_id ', C.text], ['IS NULL OR', C.pink], [' p.payment_id ', C.text], ['IS NULL;', C.pink]],
] as const;
const LONG = 'FROM orders o FULL OUTER JOIN payments p ON o.order_id = p.order_id';

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = prog(f, 360, 700); // red laser across both tables
  const extract = prog(f, 840, 1000);
  const size = fs(LONG, B.s2.code.w - 80, 36, mono);
  const total = QUERY.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 300) * total);
  const laserY = (b: {y: number}) => b.y + RY + sweep * 5 * RP - 4;

  const table = (box: typeof B.s2.orders, title: string, color: string, rows: {id: string; sub: string; ok: boolean}[]) => (
    <Card box={box} accent={color} at={20}>
      <div style={{position: 'absolute', left: 24, top: 20, direction: 'ltr'}}><Tag color={color}>{title}</Tag></div>
      {rows.map((r, i) => {
        const hit = sweep * 5 > i + 0.5;
        const bad = hit && !r.ok;
        return (
          <div key={i} style={{position: 'absolute', left: 20, right: 20, top: RY + i * RP, height: RP - 10, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', direction: 'ltr', background: bad ? 'rgba(239,68,68,0.20)' : C.panel2, border: `2px solid ${bad ? C.red : r.ok && hit ? C.blue : C.line}`, opacity: prog(f, 40 + i * 10, 70 + i * 10)}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text}}>{r.id}</span>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: bad ? C.red : C.dim}}>{r.sub}</span>
          </div>
        );
      })}
    </Card>
  );

  return (
    <Scene dur={S.s2.dur} accent={C.red}>
      <Title ar="المطابقة والتدقيق المالي" en="Reconciliation Auditing" chip="SC 02 · AUDIT" accent={C.red} />

      <Card box={B.s2.code} accent={C.line} at={6}>
        {QUERY.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 36, top: 22 + i * 56, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr', height: 56}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
      </Card>

      {table(B.s2.orders, 'orders', C.amber, ORD.map((o) => ({id: o.id, sub: o.a, ok: o.ok})))}
      {table(B.s2.pays, 'payments', C.purple, PAY.map((p) => ({id: p.id, sub: p.r, ok: p.ok})))}

      {/* dual laser scanner (one line per table) */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {sweep > 0 && sweep < 1 && [B.s2.orders, B.s2.pays].map((b, i) => (
          <rect key={i} x={b.x + 12} y={laserY(b)} width={b.w - 24} height={6} rx={3} fill={C.red} filter="url(#glow)" />
        ))}
      </svg>

      {/* audit report */}
      <Card box={B.s2.report} accent={C.green} at={780}>
        <div style={{position: 'absolute', left: 24, top: 20, direction: 'ltr'}}><Tag color={C.green}>RECONCILIATION REPORT</Tag></div>
        {REP.map((r, i) => (
          <div key={i} style={{position: 'absolute', left: 20, right: 20, top: RY + i * 74, height: 62, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', background: 'rgba(16,185,129,0.12)', border: `2px solid ${C.green}`, opacity: prog(f, 860 + i * 30, 890 + i * 30), transform: `translateX(${(1 - prog(f, 860 + i * 30, 900 + i * 30)) * -60}px)`}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 22, color: r.c}}>{r.k}</span>
            <span style={{fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text}}>{r.t}</span>
          </div>
        ))}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 22, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.green, opacity: extract}}>التسوية المالية: الفجوات على الطرفين ✓</div>
      </Card>

      <Caption from={90} to={630} color={C.red}>WHERE o.id IS NULL OR p.id IS NULL ──► Financial Reconciliation Isolation</Caption>
      <Caption from={750} to={1230} color={C.green}>Audit Value ──► Pinpoints Unpaid Orders & Orphaned Payments Simultaneously</Caption>
    </Scene>
  );
};
