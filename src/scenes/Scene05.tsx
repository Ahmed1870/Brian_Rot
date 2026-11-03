import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['SELECT', C.pink], [' p.product_name, b.branch_name,', C.text]],
  [['       ', C.text], ['COALESCE', C.green], ['(SUM(s.amount), 0) AS sales', C.text]],
  [['FROM', C.pink], [' products p ', C.text], ['CROSS JOIN', C.amber], [' branches b', C.text]],
  [['LEFT JOIN', C.blue], [' sales s', C.text]],
  [['  ON', C.pink], [' s.product_id = p.product_id', C.text]],
  [['  AND', C.pink], [' s.branch_id = b.branch_id', C.text]],
  [['GROUP BY', C.pink], [' p.product_name, b.branch_name;', C.text]],
];
const PROD = ['لابتوب', 'ماوس', 'كيبورد', 'شاشة'];
const BR = ['القاهرة', 'الإسكندرية', 'أسوان'];
const VAL: (number | null)[][] = [[12400, 8300, null], [3200, null, 900], [null, 4100, null], [15800, 7200, 2600]];
const LAB = [
  {t: 'CROSS JOIN = الهيكل', c: C.amber}, {t: 'LEFT JOIN = الأرقام الفعلية', c: C.blue}, {t: 'COALESCE = أصفار صريحة', c: C.green},
];

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s5.code, R = B.s5.report;
  const size = fs('       COALESCE(SUM(s.amount), 0) AS sales', K.w - 70, 32, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 520) * total);
  const fill = prog(f, 320, 560); // actuals arrive
  const zero = ease(prog(f, 750, 810)); // NULL -> 0
  const CX = 200, CW = 180, CY = 140, RH = 100;

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="التكنيك الذهبي" en="CROSS JOIN + LEFT JOIN + COALESCE" chip="SC 05 · ZERO-GAP REPORT" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, background: C.panel, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', direction: 'ltr'}}>
          {[C.red, C.amber, C.green].map((c) => (<span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />))}
          <span style={{marginLeft: 12, fontFamily: mono, fontSize: 22, color: C.dim}}>zero_gap_report.sql</span>
        </div>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 30, top: 90 + i * 66, height: 66, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 24, display: 'flex', flexDirection: 'column', gap: 6, direction: 'rtl'}}>
          {LAB.map((l, i) => (<div key={i} style={{fontFamily: cairo, fontWeight: 900, fontSize: 26, color: l.c, opacity: prog(f, 540 + i * 40, 580 + i * 40)}}>{l.t}</div>))}
        </div>
      </Card>

      <Card box={R} accent={C.green} at={120}>
        <div style={{position: 'absolute', left: 24, top: 22, direction: 'ltr'}}><Tag color={C.green}>SALES REPORT · 4 × 3</Tag></div>
        {BR.map((b, j) => (<div key={b} style={{position: 'absolute', left: CX + j * CW, top: 84, width: CW - 12, textAlign: 'center', fontFamily: cairo, fontWeight: 900, fontSize: 24, color: C.green, opacity: prog(f, 200 + j * 8, 230 + j * 8)}}>{b}</div>))}
        {PROD.map((p, i) => (<div key={p} style={{position: 'absolute', left: 14, top: CY + i * RH, width: CX - 30, height: RH - 14, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: cairo, fontWeight: 900, fontSize: 24, color: C.blue, opacity: prog(f, 200 + i * 8, 230 + i * 8)}}>{p}</div>))}
        {PROD.flatMap((_, i) => BR.map((__, j) => {
          const v = VAL[i][j];
          const appear = prog(f, 220 + (i * 3 + j) * 8, 250 + (i * 3 + j) * 8);
          const isNull = v === null;
          const zeroed = isNull && zero > 0.5;
          const txt = v !== null ? Math.round(v * fill).toLocaleString('en-US') : fill < 0.6 ? '—' : zeroed ? '0' : 'NULL';
          const col = zeroed ? C.green : isNull && fill >= 0.6 ? C.amber : C.text;
          return (
            <div key={`${i}-${j}`} style={{position: 'absolute', left: CX + j * CW, top: CY + i * RH, width: CW - 12, height: RH - 14, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: v !== null && v > 9999 ? 30 : 32, color: col, background: zeroed ? `rgba(16,185,129,${0.12 + 0.12 * zero})` : 'rgba(15,23,42,0.6)', border: `3px solid ${zeroed ? C.green : isNull && fill >= 0.6 ? C.amber : C.line}`, opacity: appear}}>{txt}</div>
          );
        }))}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, 880, 940)}}>الأصفار بتكشف الأماكن الراكدة ✓</div>
      </Card>

      <Caption from={60} to={540} color={C.blue}>CROSS JOIN (Skeleton) + LEFT JOIN (Actuals) + COALESCE(sales, 0)</Caption>
      <Caption from={660} to={1080} color={C.green}>Zero-Gap Reporting ──► Highlights Stagnant Outlets with Explicit Zeros</Caption>
    </Scene>
  );
};
