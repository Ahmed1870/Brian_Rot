import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = {t: string; c?: string};
const CODE: Seg[][] = [
  [{t: 'SELECT', c: C.pink}, {t: ' c.first_name, o.order_date, p.product_name, oi.quantity'}],
  [{t: 'FROM', c: C.pink}, {t: ' customers c'}],
  [{t: 'INNER JOIN', c: C.pink}, {t: ' orders o ON c.customer_id = o.customer_id'}],
  [{t: 'INNER JOIN', c: C.pink}, {t: ' order_items oi ON o.order_id = oi.order_id'}],
  [{t: 'INNER JOIN', c: C.pink}, {t: ' products p ON oi.product_id = p.product_id;'}],
];
const LONGEST = 'SELECT c.first_name, o.order_date, p.product_name, oi.quantity';
const NODES = [
  {n: 'customers', a: 'c', c: C.blue}, {n: 'orders', a: 'o', c: C.amber}, {n: 'order_items', a: 'oi', c: C.pink}, {n: 'products', a: 'p', c: C.green},
];
const KEYS = ['customer_id', 'order_id', 'product_id'];
const ITEMS = [{p: 'حامل لابتوب', q: 1}, {p: 'ماوس لاسلكي', q: 2}, {p: 'كيبورد ميكانيكي', q: 1}];

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s5.code, P = B.s5.pipe, V = B.s5.invoice;
  const size = fs(LONGEST, K.w - 60, 30, mono);
  const lh = 80;
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s.t.length, 0), 0);
  let shown = Math.floor(prog(f, 20, 520) * total);
  // when each JOIN line is complete -> link lights up
  const linkAt = [250, 340, 430];
  const NW = 150, GAP = 70, X0 = P.x + (P.w - (4 * NW + 3 * GAP)) / 2, NY = P.y + 90;
  const nx = (i: number) => X0 + i * (NW + GAP);
  const stamp = ease(prog(f, 640, 700));
  const inv = prog(f, 600, 650);

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="الربط متعدد الجداول" en="Multi-Table INNER JOIN" chip="SC 05 · REPORTING" accent={C.green} />

      {/* code editor */}
      <Card box={K} accent={C.line} at={6}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, background: C.panel, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', direction: 'ltr'}}>
          {[C.red, C.amber, C.green].map((c) => (<span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />))}
          <span style={{marginLeft: 12, fontFamily: mono, fontSize: 22, color: C.dim}}>invoice_report.sql</span>
        </div>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 30, top: 100 + i * lh, height: lh, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr', color: C.text, background: 'transparent'}}>
            {l.map((s, j) => {
              const take = Math.max(0, Math.min(s.t.length, shown));
              shown -= s.t.length;
              return <span key={j} style={{color: s.c ?? C.text}}>{s.t.slice(0, take)}</span>;
            })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 28, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.green, opacity: prog(f, 560, 610)}}>4 جداول ← استعلام واحد ← تقرير كامل</div>
      </Card>

      {/* pipeline */}
      <Card box={P} accent={C.line} at={30} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {NODES.slice(0, 3).map((n, i) => {
          const lit = prog(f, linkAt[i], linkAt[i] + 50);
          const x1 = nx(i) + NW, x2 = nx(i + 1), y = NY + 40;
          return (
            <g key={'k' + i}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.line} strokeWidth={6} strokeLinecap="round" />
              <line x1={x1} y1={y} x2={x1 + (x2 - x1) * lit} y2={y} stroke={C.blue} strokeWidth={8} strokeLinecap="round" filter="url(#glow)" />
              <text x={(x1 + x2) / 2} y={NY + 140} textAnchor="middle" fontFamily={mono} fontSize={20} fontWeight={700} fill={C.blue} opacity={lit}>{KEYS[i]}</text>
              <line x1={(x1 + x2) / 2} y1={y + 12} x2={(x1 + x2) / 2} y2={NY + 118} stroke={C.blue} strokeWidth={2} opacity={lit * 0.6} />
            </g>
          );
        })}
        {NODES.map((n, i) => {
          const reveal = prog(f, 40 + i * 12, 70 + i * 12);
          const on = i === 0 || f >= linkAt[i - 1] + 30;
          return (
            <g key={n.n} opacity={reveal}>
              <rect x={nx(i)} y={NY} width={NW} height={80} rx={18} fill={on ? 'rgba(15,23,42,0.9)' : C.panel2} stroke={on ? n.c : C.line} strokeWidth={on ? 5 : 3} filter={on ? 'url(#glow)' : undefined} />
              <text x={nx(i) + NW / 2} y={NY + 36} textAnchor="middle" fontFamily={mono} fontSize={fs(n.n, NW - 20, 24, mono)} fontWeight={700} fill={C.text}>{n.n}</text>
              <text x={nx(i) + NW / 2} y={NY + 64} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={n.c}>{n.a}</text>
            </g>
          );
        })}
      </svg>

      {/* invoice */}
      <Card box={V} accent={C.green} at={560}>
        <div style={{position: 'absolute', left: 30, top: 22, width: 520, direction: 'ltr', opacity: inv}}>
          <Tag color={C.green}>INVOICE #1001</Tag>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.dim}}>
            <span style={{fontFamily: cairo, color: C.text, fontSize: 28}}>أحمد</span><span>2026-11-01</span>
          </div>
          {ITEMS.map((it, i) => (
            <div key={i} style={{marginTop: 10, height: 50, borderRadius: 12, background: 'rgba(16,185,129,0.12)', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', opacity: prog(f, 620 + i * 26, 650 + i * 26)}}>
              <span style={{fontFamily: cairo, fontWeight: 700, fontSize: 26, color: C.text}}>{it.p}</span>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.green}}>× {it.q}</span>
            </div>
          ))}
        </div>
        {/* stamp column (kept separate from the table) */}
        <div style={{position: 'absolute', right: 30, top: 40, width: 250, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: stamp, transform: `scale(${0.6 + 0.4 * stamp}) rotate(-8deg)`}}>
          <div style={{width: 230, height: 230, borderRadius: 115, border: `8px solid ${C.green}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4}}>
            <div style={{fontFamily: mono, fontWeight: 700, fontSize: 56, color: C.green}}>100%</div>
            <div style={{fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.green}}>INTEGRITY ✓</div>
          </div>
        </div>
      </Card>

      <Caption from={60} to={540} color={C.blue}>Multi-Table INNER JOIN ──► Links Customers ➔ Orders ➔ Items ➔ Products</Caption>
      <Caption from={660} to={1080} color={C.green}>Enterprise Value ──► Unified Single-Query Financial & Line-Item Reporting</Caption>
    </Scene>
  );
};
