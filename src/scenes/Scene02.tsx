import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['SELECT', C.pink], [' customer_id, order_date,', C.text]],
  [['       LEAD', C.amber], ["(order_date, 1, '2099-12-31')", C.text]],
  [['         OVER(', C.text], ['PARTITION BY', C.pink], [' customer_id ', C.text], ['ORDER BY', C.pink], [' order_date) ', C.text], ['AS', C.pink], [' next_order_date', C.text]],
  [['FROM', C.pink], [' orders;', C.text]],
];
const ROWS = [
  {c: 101, d: '2026-01-05', n: '2026-01-20', days: 15}, {c: 101, d: '2026-01-20', n: '2026-02-18', days: 29}, {c: 101, d: '2026-02-18', n: null, days: null},
  {c: 102, d: '2026-01-10', n: '2026-03-02', days: 51}, {c: 102, d: '2026-03-02', n: null, days: null},
];
const RY = 100, RP = 64, RH = 54;
const X = {c: 24, d: 170, n: 560, g: 960};

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s2.code, T = B.s2.table, H = B.s2.shield;
  const size = fs("         OVER(PARTITION BY customer_id ORDER BY order_date) AS next_order_date", K.w - 70, 30, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 300) * total);
  const L = (i: number) => 360 + i * 55; // leap time per row
  const cy = (i: number) => T.y + RY + i * RP + RH / 2;
  const cell = (x: number, w: number, i: number, txt: string, color: string, border: string, bg: string, o = 1) => (
    <div style={{position: 'absolute', left: x, top: RY + i * RP, width: w, height: RH, borderRadius: 12, border: `3px solid ${border}`, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 26, color, opacity: o, direction: 'ltr'}}>{txt}</div>
  );

  return (
    <Scene dur={S.s2.dur} accent={C.amber}>
      <Title ar="الاستشراف بـ LEAD" en="LEAD · Forward Lookahead" chip="SC 02 · LEAD" accent={C.amber} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 30, top: 14 + i * 50, height: 50, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
      </Card>

      <Card box={T} accent={C.line} at={300}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.amber}>orders · PARTITION BY customer</Tag></div>
        <div style={{position: 'absolute', left: 0, top: 62, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.dim}}>
          <span style={{position: 'absolute', left: X.c + 6}}>customer</span>
          <span style={{position: 'absolute', left: X.d + 6}}>order_date</span>
          <span style={{position: 'absolute', left: X.n + 6, color: C.amber, whiteSpace: 'nowrap'}}>next_order_date</span>
          <span style={{position: 'absolute', left: X.g + 6, color: C.green}}>days</span>
        </div>
        {ROWS.map((r, i) => {
          const on = f >= L(i);
          const boundary = r.n === null;
          const fixed = boundary && f >= L(i) + 90;
          const o = prog(f, 320 + i * 10, 350 + i * 10);
          return (
            <React.Fragment key={i}>
              {cell(X.c, 130, i, String(r.c), C.text, C.line, C.panel2, o)}
              {cell(X.d, 280, i, r.d, C.text, on && !boundary ? C.amber : C.line, C.panel2, o)}
              {cell(X.n, 330, i, !on ? '' : boundary ? (fixed ? '2099-12-31' : 'NULL') : r.n!, boundary ? (fixed ? C.green : C.amber) : C.amber, !on ? C.line : boundary ? (fixed ? C.green : C.amber) : C.amber, !on ? C.panel2 : boundary ? (fixed ? 'rgba(16,185,129,0.14)' : 'rgba(245,158,11,0.14)') : 'rgba(245,158,11,0.10)', on ? 1 : 0.3)}
              {cell(X.g, 170, i, boundary ? '—' : String(r.days), r.days ? C.green : C.dim, C.line, C.panel2, on ? 1 : 0.3)}
            </React.Fragment>
          );
        })}
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {ROWS.map((r, i) => {
          if (i === ROWS.length - 1 || r.n === null) return null;
          const t = prog(f, L(i), L(i) + 30);
          if (t <= 0 || f > L(i) + 70) return null;
          const x1 = T.x + X.d + 280, x2 = T.x + X.n;
          const yFrom = cy(i + 1), yTo = cy(i);
          return (
            <g key={i} filter="url(#glow)">
              <line x1={x1} y1={yFrom} x2={x1 + (x2 - x1) * t} y2={yFrom + (yTo - yFrom) * t} stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
              <circle cx={x1 + (x2 - x1) * t} cy={yFrom + (yTo - yFrom) * t} r={9} fill={C.text} />
            </g>
          );
        })}
      </svg>

      <Card box={H} accent={f >= 600 ? C.green : C.amber} at={420}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.green}>DEFAULT FALLBACK</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 70, display: 'flex', alignItems: 'center', gap: 14, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 28}}>
          <span style={{color: C.amber, border: `3px solid ${C.amber}`, borderRadius: 12, padding: '4px 14px', textDecoration: f >= 600 ? 'line-through' : 'none'}}>NULL</span>
          <span style={{color: C.dim}}>→</span>
          <span style={{color: C.green, border: `3px solid ${C.green}`, borderRadius: 12, padding: '4px 14px', opacity: prog(f, 600, 650)}}>2099-12-31</span>
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 170, direction: 'rtl', fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text, lineHeight: 1.5, opacity: prog(f, 600, 660)}}>الصف الأخير للعميل مفيش بعده طلب، فالقيمة الافتراضية بتمنع الـ NULL.</div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 840, 900)}}>الأيام بين الطلبات ← تحليل التسرب Churn ✓</div>
      </Card>

      <Caption from={90} to={630} color={C.amber}>{"LEAD(order_date, 1, '2099-12-31') OVER(ORDER BY order_date)"}</Caption>
      <Caption from={750} to={1230} color={C.green}>Forward Lookahead ──► Measures Time to Next Order & Churn Windows</Caption>
    </Scene>
  );
};
