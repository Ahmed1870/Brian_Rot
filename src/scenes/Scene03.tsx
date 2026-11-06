import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

const MERGED = ['SELECT s.sale_date, p.category,', '       SUM(s.amount)', 'FROM sales s JOIN products p', '  ON s.product_id = p.product_id', "WHERE p.category = 'X'", 'GROUP BY 1, 2;'];
const PLAN = [['Hash Join', C.amber], ['Index Scan · sales (idx_sales_product)', C.green], ['Index Scan · products (pkey)', C.green]];
const MERGE = 450; // 3001

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const U = B.s3.userq, R = B.s3.rewriter, P = B.s3.plan;
  const fly = ease(prog(f, 300, MERGE));
  const gear = f * 3;
  const merged = f >= MERGE;

  return (
    <Scene dur={S.s3.dur} accent={C.blue}>
      <Title ar="محرك إعادة الكتابة" en="PostgreSQL 16 · Query Rewriter" chip="SC 03 · REWRITER" accent={C.blue} />

      <Card box={U} accent={C.line} at={6}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.dim}>YOUR QUERY</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 70, direction: 'ltr', borderRadius: 14, border: `3px solid ${C.blue}`, background: C.panel2, padding: '12px 16px', fontFamily: mono, fontWeight: 700, fontSize: fs("WHERE category = 'X';", 440, 26, mono), color: C.text, lineHeight: 1.5, opacity: prog(f, 20, 60)}}>
          <div><span style={{color: C.pink}}>SELECT</span> * <span style={{color: C.pink}}>FROM</span> v_sales</div>
          <div><span style={{color: C.pink}}>WHERE</span> category = 'X';</div>
        </div>
        <div style={{position: 'absolute', left: 24, top: 250, direction: 'ltr', opacity: prog(f, 80, 120)}}><Tag color={C.amber}>VIEW DEFINITION</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 296, direction: 'ltr', borderRadius: 14, border: `3px solid ${C.amber}`, background: C.panel2, padding: '12px 16px', fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.text, lineHeight: 1.5, whiteSpace: 'pre', opacity: prog(f, 90, 130)}}>
          <div style={{color: C.amber}}>v_sales AS</div><div>SELECT … FROM sales s</div><div>JOIN products p …</div><div>GROUP BY 1, 2</div>
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 26, color: C.dim, opacity: prog(f, 200, 250)}}>المنظور مش جدول منفصل</div>
      </Card>

      <Card box={R} accent={merged ? C.blue : C.line} at={30}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.blue}>QUERY REWRITER</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 66, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.text}}>{merged ? 'استعلام واحد موحّد' : 'بيدمج تعريف المنظور في استعلامك'}</div>
        {!merged && (
          <svg width={R.w} height={R.h} style={{position: 'absolute', inset: 0, opacity: prog(f, 100, 140) * (1 - fly)}}>
            <g transform={`translate(${R.w / 2} 380) rotate(${gear})`}>
              {Array.from({length: 8}, (_, i) => (<rect key={i} x={-14} y={-96} width={28} height={36} rx={6} fill={C.blue} transform={`rotate(${i * 45})`} />))}
              <circle r={74} fill={C.bg2} stroke={C.blue} strokeWidth={10} /><circle r={26} fill={C.blue} />
            </g>
          </svg>
        )}
        {merged && (
          <div style={{position: 'absolute', left: 24, right: 24, top: 130, direction: 'ltr', borderRadius: 14, border: `3px solid ${C.blue}`, background: 'rgba(56,189,248,0.10)', padding: '14px 18px', fontFamily: mono, fontWeight: 700, fontSize: fs('  ON s.product_id = p.product_id', R.w - 100, 26, mono), color: C.text, lineHeight: 1.6, whiteSpace: 'pre'}}>
            {MERGED.map((l, i) => (<div key={i} style={{opacity: prog(f, MERGE + i * 14, MERGE + 30 + i * 14), color: /^(SELECT|FROM|WHERE|GROUP)/.test(l) ? C.text : C.text}}>{l}</div>))}
          </div>
        )}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 26, color: C.blue, opacity: prog(f, MERGE + 120, MERGE + 170)}}>اندماج كامل في شجرة الاستعلام</div>
      </Card>

      <Card box={P} accent={merged ? C.green : C.line} at={60}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.green}>EXECUTION PLAN</Tag></div>
        {PLAN.map((p, i) => {
          const t = ease(prog(f, MERGE + 40 + i * 50, MERGE + 90 + i * 50));
          return (
            <div key={i} style={{position: 'absolute', left: 24 + i * 22, right: 24, top: 90 + i * 118, height: 98, borderRadius: 16, border: `3px solid ${p[1]}`, background: C.panel2, display: 'flex', alignItems: 'center', padding: '0 16px', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: fs('Index Scan · sales (idx_sales_product)', P.w - 120, 22, mono), color: C.text, opacity: t, transform: `translateX(${(1 - t) * 40}px)`}}>{p[0] as string}</div>
          );
        })}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, direction: 'rtl', textAlign: 'center', fontFamily: cairo, fontWeight: 900, fontSize: 26, color: C.green, lineHeight: 1.4, opacity: prog(f, 900, 960)}}>الأداء = فهارس الجداول الأصلية</div>
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {fly > 0 && fly < 1 && [0, 1].map((k) => (
          <rect key={k} x={lerp(U.x + U.w - 40, R.x + R.w / 2 - 60, fly)} y={lerp(U.y + 120 + k * 200, R.y + 330 + k * 30, fly)} width={120} height={46} rx={12} fill={k === 0 ? C.blue : C.amber} opacity={0.85} filter="url(#glow)" />
        ))}
      </svg>

      <Caption from={90} to={630} color={C.blue}>PostgreSQL Query Rewriter ──► Merges View Definition into Query Tree</Caption>
      <Caption from={750} to={1230} color={C.green}>Execution Strategy ──► Performance Depends Fully on Underlying Table Indexes</Caption>
    </Scene>
  );
};
