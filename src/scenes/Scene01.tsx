import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const TBL = [
  {n: 'sales', x: 90, y: 290, w: 420, c: C.blue, cols: ['id', 'product_id', 'customer_id', 'amount'], rows: [['1', '7', '12', '320'], ['2', '4', '9', '150'], ['3', '7', '3', '480']]},
  {n: 'products', x: 680, y: 240, w: 440, c: C.amber, cols: ['id', 'name', 'category'], rows: [['7', 'لابتوب', 'Electronics'], ['4', 'جاكيت', 'Fashion']]},
  {n: 'customers', x: 680, y: 560, w: 440, c: C.purple, cols: ['id', 'name', 'city'], rows: [['12', 'أحمد', 'القاهرة'], ['9', 'سارة', 'الجيزة']]},
];
const VROWS = [['2026-01', 'Electronics', '182,400'], ['2026-01', 'Fashion', '96,300'], ['2026-02', 'Electronics', '201,900']];
const Q = ['CREATE VIEW v_sales AS', 'SELECT date_trunc(\'month\', s.sale_date),', '       p.category, SUM(s.amount)', 'FROM sales s JOIN products p ... GROUP BY 1,2;'];

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const L = B.s1.tables, V = B.s1.view;
  const glass = ease(prog(f, 181, 290));
  const cond = ease(prog(f, 330, 540));
  const badge = ease(prog(f, 541, 600));
  const tblOp = 1 - 0.7 * cond;

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="المناظير والواجهات البرمجية" en="Standard Views · CREATE VIEW" chip="SC 01 · VIRTUAL TABLE" accent={C.blue} />

      <Card box={L} accent={C.line} at={4} />
      {/* physical tables + JOIN lines */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: tblOp, transform: `scale(${1 - 0.04 * cond})`, transformOrigin: `${L.x + L.w / 2}px ${L.y + L.h / 2}px`}}>
        {TBL.map((t, ti) => (
          <div key={t.n} style={{position: 'absolute', left: t.x, top: t.y, width: t.w, borderRadius: 18, border: `3px solid ${t.c}`, background: C.panel2, direction: 'ltr', opacity: prog(f, 20 + ti * 20, 60 + ti * 20)}}>
            <div style={{padding: '10px 18px', fontFamily: mono, fontWeight: 700, fontSize: 26, color: t.c}}>{t.n}</div>
            <div style={{display: 'flex', padding: '0 18px', fontFamily: mono, fontWeight: 700, fontSize: 18, color: C.dim}}>{t.cols.map((c) => <span key={c} style={{flex: 1}}>{c}</span>)}</div>
            {t.rows.map((r, i) => (<div key={i} style={{display: 'flex', padding: '6px 18px', fontFamily: mono, fontSize: 22, fontWeight: 700, color: C.text}}>{r.map((v, j) => <span key={j} style={{flex: 1, fontFamily: /[ء-ي]/.test(v) ? cairo : mono}}>{v}</span>)}</div>))}
            <div style={{height: 10}} />
          </div>
        ))}
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: tblOp}}>
        <Defs />
        <path d="M 510 370 C 590 370, 600 330, 680 330" fill="none" stroke={C.blue} strokeWidth={5} strokeDasharray="10 8" opacity={prog(f, 90, 130)} filter="url(#glow)" />
        <path d="M 510 460 C 590 460, 600 650, 680 650" fill="none" stroke={C.blue} strokeWidth={5} strokeDasharray="10 8" opacity={prog(f, 100, 140)} filter="url(#glow)" />
      </svg>
      {/* glass overlay frame (a frame, never covering text) */}
      <div style={{position: 'absolute', left: L.x + 8, top: L.y + 8, width: L.w - 16, height: L.h - 16, borderRadius: 22, border: `4px solid ${C.blue}`, background: 'rgba(56,189,248,0.07)', transform: `scaleY(${glass})`, transformOrigin: 'top', opacity: glass}} />
      <div style={{position: 'absolute', left: L.x + 24, top: L.y + 14, direction: 'ltr', opacity: glass}}><span style={{fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.bg, background: C.blue, borderRadius: 999, padding: '4px 16px'}}>Virtual Table Overlay</span></div>

      {/* the simple view */}
      <Card box={V} accent={C.blue} at={330}>
        <div style={{position: 'absolute', left: 26, right: 26, top: 24, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, lineHeight: 1.5}}>
          {Q.map((l, i) => (<div key={i} style={{whiteSpace: 'pre', fontSize: fs(Q[3], V.w - 52, 24, mono), color: i === 0 ? C.blue : C.text, opacity: prog(f, 340 + i * 16, 370 + i * 16)}}>{l}</div>))}
        </div>
        <div style={{position: 'absolute', left: 26, right: 26, top: 220, direction: 'ltr', opacity: prog(f, 440, 480)}}>
          <Tag color={C.blue}>SELECT * FROM v_sales</Tag>
          {VROWS.map((r, i) => (<div key={i} style={{marginTop: 10, height: 54, borderRadius: 12, border: `2px solid ${C.blue}`, background: 'rgba(56,189,248,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.text, opacity: prog(f, 450 + i * 14, 480 + i * 14)}}><span>{r[0]}</span><span>{r[1]}</span><span style={{color: C.green}}>{r[2]}</span></div>))}
        </div>
        <div style={{position: 'absolute', left: 26, right: 26, bottom: 28, opacity: badge, transform: `scale(${0.9 + 0.1 * badge})`}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, border: `3px solid ${C.green}`, borderRadius: 18, background: 'rgba(16,185,129,0.14)', padding: '12px 10px', direction: 'ltr'}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.green}}>Zero Disk Storage</span><span style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.text}}>0 MB</span>
          </div>
          <div style={{marginTop: 10, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 26, color: C.green}}>جدول افتراضي: كود استعلام بس</div>
        </div>
      </Card>

      <Caption from={60} to={540} ltr={false} color={C.blue}>المناظير والواجهات البرمجية | Standard Views (CREATE VIEW)</Caption>
      <Caption from={660} to={1140} color={C.green}>CREATE VIEW v_sales AS SELECT ... ──► Virtual Table (Zero Disk Storage)</Caption>
    </Scene>
  );
};
