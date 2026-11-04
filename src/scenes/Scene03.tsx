import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Title, ease, fs, lerp, prog} from '../common';

const SPEND = [9800, 9100, 8700, 8200, 7600, 6900, 6400, 5800, 5300, 4900, 4400, 3900, 3500, 3100, 2800, 2400, 2000, 1600, 1100, 700];
const QC = [C.green, C.amber, C.blue, C.dim];
const CUT = 450; // 3001: lasers cut the dataset
const QUERY = ['SELECT customer_id, total_spent,', '       NTILE(4) OVER(ORDER BY total_spent DESC) AS spending_quartile', 'FROM customer_spending;'];

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s3.code, A = B.s3.area;
  const size = fs(QUERY[1], K.w - 80, 38, mono);
  const total = QUERY.reduce((a, l) => a + l.length, 0);
  let shown = Math.floor(prog(f, 20, 300) * total);
  const move = ease(prog(f, CUT + 90, CUT + 200));
  const laser = prog(f, CUT, CUT + 90);
  const colW = A.w / 4;

  return (
    <Scene dur={S.s3.dur} accent={C.purple}>
      <Title ar="التقسيم إلى شرائح متساوية" en="NTILE(4) · Quartile Buckets" chip="SC 03 · NTILE" accent={C.purple} />

      <Card box={K} accent={C.line} at={6}>
        {QUERY.map((l, i) => {
          const take = Math.max(0, Math.min(l.length, shown)); shown -= l.length;
          return <div key={i} style={{position: 'absolute', left: 36, top: 18 + i * 56, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr', color: C.text, height: 56}}>{l.slice(0, take).split(/(SELECT|NTILE|OVER|ORDER BY|DESC|AS|FROM)/).map((t, j) => <span key={j} style={{color: t === 'NTILE' ? C.purple : /^(SELECT|OVER|ORDER BY|DESC|AS|FROM)$/.test(t) ? C.pink : C.text}}>{t}</span>)}</div>;
        })}
      </Card>

      {/* four bucket cards appear after the cut */}
      {[0, 1, 2, 3].map((q) => (
        <div key={q} style={{position: 'absolute', left: A.x + q * colW + 8, top: A.y, width: colW - 16, height: A.h, borderRadius: 24, border: `3px solid ${QC[q]}`, background: `rgba(15,23,42,0.5)`, opacity: ease(prog(f, CUT + 60, CUT + 140))}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 14, textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: 28, color: QC[q]}}>Q{q + 1}{q === 0 ? ' · TOP 25% VIP' : ''}</div>
        </div>
      ))}

      {/* 20 customers: one block -> four buckets */}
      {SPEND.map((s, i) => {
        const q = Math.floor(i / 5), r = i % 5;
        const g = {x: A.x + 14 + (i % 10) * 177, y: A.y + 150 + Math.floor(i / 10) * 100};
        const b = {x: A.x + q * colW + 36, y: A.y + 70 + r * 76};
        const x = lerp(g.x, b.x, move), y = lerp(g.y, b.y, move);
        const w = lerp(165, colW - 72, move);
        const vip = q === 0 && move > 0.95;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: lerp(76, 64, move), borderRadius: 14, border: `2px solid ${move > 0.5 ? QC[q] : C.line}`, background: vip ? 'rgba(16,185,129,0.20)' : C.panel2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', direction: 'ltr', fontFamily: mono, fontWeight: 700, opacity: prog(f, 40 + i * 6, 70 + i * 6)}}>
            <span style={{fontSize: 22, color: C.dim}}>C{101 + i}</span>
            <span style={{fontSize: w > 200 ? 26 : 22, color: C.text}}>${s.toLocaleString('en-US')}</span>
            {move > 0.9 && w > 200 && <span style={{fontSize: 20, color: QC[q]}}>q{q + 1}</span>}
          </div>
        );
      })}

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {[1, 2, 3].map((k) => laser > 0 && laser < 1 ? <rect key={k} x={A.x + k * colW - 4} y={A.y} width={8} height={A.h * laser} rx={4} fill={C.purple} filter="url(#glow)" /> : null)}
      </svg>
      <div style={{position: 'absolute', left: A.x, top: A.y + 20, width: A.w, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.dim, opacity: prog(f, 80, 120) * (1 - prog(f, CUT, CUT + 40))}}>20 عميل مرتّبين بالإنفاق (مثال لـ 100)</div>

      <Caption from={90} to={630} color={C.purple}>NTILE(4) OVER(ORDER BY total_spent DESC) ──► Divides Rows into 4 Equal Buckets</Caption>
      <Caption from={750} to={1230} color={C.green}>Quartile Distribution ──► Segments Top 25%, VIPs & Percentile Cohorts</Caption>
    </Scene>
  );
};
