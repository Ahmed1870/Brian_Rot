import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const FIX = 450; // aliases appear / code is rewritten
const KW = ['SELECT', 'FROM', 'INNER', 'JOIN', 'ON'];

type Seg = {t: string; c?: string};
const OLD: Seg[][] = [
  [{t: 'SELECT', c: C.pink}, {t: ' '}, {t: 'customer_id', c: C.red}, {t: ', first_name, order_date'}],
  [{t: 'FROM', c: C.pink}, {t: ' customers '}, {t: 'INNER JOIN', c: C.pink}, {t: ' orders'}],
  [{t: '  ON', c: C.pink}, {t: ' customers.customer_id = orders.customer_id;'}],
];
const NEW: Seg[][] = [
  [{t: 'SELECT', c: C.pink}, {t: ' '}, {t: 'c.customer_id', c: C.blue}, {t: ', c.first_name, '}, {t: 'o.order_date', c: C.blue}],
  [{t: 'FROM', c: C.pink}, {t: ' customers '}, {t: 'c', c: C.blue}],
  [{t: 'INNER JOIN', c: C.pink}, {t: ' orders '}, {t: 'o', c: C.blue}],
  [{t: '  ON', c: C.pink}, {t: ' '}, {t: 'c.customer_id', c: C.blue}, {t: ' = '}, {t: 'o.customer_id', c: C.blue}, {t: ';'}],
];

const Typed: React.FC<{lines: Seg[][]; start: number; end: number; size: number; top: number; lh: number; x: number}> = ({lines, start, end, size, top, lh, x}) => {
  const f = useCurrentFrame();
  const total = lines.reduce((a, l) => a + l.reduce((b, s) => b + s.t.length, 0), 0);
  let shown = Math.floor(prog(f, start, end) * total);
  return (
    <>
      {lines.map((l, i) => {
        const parts = l.map((s, j) => {
          const take = Math.max(0, Math.min(s.t.length, shown));
          shown -= s.t.length;
          return <span key={j} style={{color: s.c ?? C.text}}>{s.t.slice(0, take)}</span>;
        });
        return <div key={i} style={{position: 'absolute', left: x, top: top + i * lh, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr', height: lh}}>{parts}</div>;
      })}
    </>
  );
};

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const E = B.s3.editor, T = B.s3.tables;
  const fixed = f >= FIX;
  const size = fs('  ON customers.customer_id = orders.customer_id;', E.w - 70, 32, mono);
  const err = prog(f, 150, 190);
  const shake = f > 150 && f < 200 ? Math.sin(f * 2.4) * 8 * (1 - (f - 150) / 50) : 0;
  const ok = prog(f, 800, 850);
  const alias = ease(prog(f, FIX + 70, FIX + 120));
  const beam = prog(f, FIX + 140, FIX + 220);
  const join = prog(f, 840, 900);
  const RH = 58, AY = T.y + 40, BY = T.y + 360;
  const rowY = (top: number, i: number) => top + 60 + i * RH;

  return (
    <Scene dur={S.s3.dur} accent={C.red}>
      <Title ar="غموض أسماء الأعمدة" en="Ambiguous Column & Table Aliases" chip="SC 03 · ALIASES" accent={C.red} />

      {/* editor */}
      <Card box={E} accent={fixed ? C.blue : C.red} at={6}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, background: C.panel, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', direction: 'ltr'}}>
          {[C.red, C.amber, C.green].map((c) => (<span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />))}
          <span style={{marginLeft: 12, fontFamily: mono, fontSize: 22, color: C.dim}}>customer_orders.sql</span>
        </div>
      </Card>
      <div style={{position: 'absolute', left: E.x, top: E.y, width: E.w, height: E.h, transform: `translateX(${shake}px)`}}>
        {!fixed && <Typed lines={OLD} start={20} end={150} size={size} top={90} lh={56} x={36} />}
        {fixed && <Typed lines={NEW} start={FIX} end={FIX + 280} size={size} top={90} lh={56} x={36} />}
        {/* squiggle under the ambiguous token (before the fix) */}
        {!fixed && err > 0 && <div style={{position: 'absolute', left: 36 + 7 * size * 0.6, top: 90 + 40, width: 11 * size * 0.6, height: 5, background: C.red, borderRadius: 3, opacity: err}} />}
      </div>

      {/* error / success card (below the code lines) */}
      <div style={{position: 'absolute', left: E.x + 36, top: E.y + 400, width: E.w - 72, height: 190, borderRadius: 20, background: fixed ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.16)', border: `3px solid ${fixed ? C.green : C.red}`, padding: '20px 28px', direction: 'ltr', opacity: fixed ? ok : err, boxSizing: 'border-box'}}>
        <Tag color={fixed ? C.green : C.red}>{fixed ? 'QUERY OK' : 'ERROR'}</Tag>
        <div style={{marginTop: 12, fontFamily: mono, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', fontSize: fs('column reference "customer_id" is ambiguous', E.w - 130, 36, mono)}}>
          {fixed ? 'c.customer_id → customers' : 'column reference "customer_id" is ambiguous'}
        </div>
        <div style={{marginTop: 10, fontFamily: cairo, fontWeight: 700, fontSize: 28, color: fixed ? C.green : C.amber, direction: 'rtl', textAlign: 'left'}}>
          {fixed ? 'كل عمود له مالك واضح ← الكود نظيف' : 'المحرك مش عارف customer_id يقصد أي جدول'}
        </div>
      </div>
      <div style={{position: 'absolute', left: E.x + 36, top: E.y + 610, width: E.w - 72, direction: 'rtl', fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.dim, opacity: prog(f, 900, 950)}}>c = customers ، o = orders</div>

      {/* tables */}
      <Card box={T} accent={C.line} at={20} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {[{top: AY, name: 'customers', al: 'c', rows: ['customer_id', 'first_name', 'email'], tags: ['PK', '', '']}, {top: BY, name: 'orders', al: 'o', rows: ['order_id', 'customer_id', 'order_date'], tags: ['PK', 'FK', '']}].map((tb, ti) => (
          <g key={tb.name} opacity={prog(f, 30 + ti * 14, 60 + ti * 14)}>
            <rect x={T.x + 30} y={tb.top} width={T.w - 60} height={60 + 3 * RH} rx={18} fill={C.panel2} stroke={C.line} strokeWidth={3} />
            <text x={T.x + 52} y={tb.top + 40} fontFamily={mono} fontSize={30} fontWeight={700} fill={C.text}>{tb.name}</text>
            {/* alias badge */}
            <g opacity={alias} transform={`translate(0 ${(1 - alias) * -10})`}>
              <rect x={T.x + T.w - 130} y={tb.top + 10} width={70} height={40} rx={20} fill={C.blue} />
              <text x={T.x + T.w - 95} y={tb.top + 40} textAnchor="middle" fontFamily={mono} fontSize={28} fontWeight={700} fill={C.bg}>{tb.al}</text>
            </g>
            {tb.rows.map((r, i) => {
              const amb = r === 'customer_id';
              const flash = !fixed && amb ? 0.5 + 0.5 * Math.sin(f * 0.3) : 0;
              const lit = fixed && amb && beam > 0;
              return (
                <g key={r}>
                  <rect x={T.x + 44} y={rowY(tb.top, i)} width={T.w - 88} height={RH - 8} rx={12} fill={lit ? 'rgba(56,189,248,0.18)' : C.bg2} stroke={lit ? C.blue : amb && !fixed && err > 0 ? C.red : C.line} strokeWidth={lit ? 4 : 2} />
                  {flash > 0 && err > 0 && <rect x={T.x + 44} y={rowY(tb.top, i)} width={T.w - 88} height={RH - 8} rx={12} fill={C.red} opacity={flash * 0.25 * err} />}
                  <text x={T.x + 64} y={rowY(tb.top, i) + 34} fontFamily={mono} fontSize={26} fontWeight={700} fill={lit ? C.text : C.dim}>{lit ? `${tb.al}.${r}` : r}</text>
                  {tb.tags[i] && <text x={T.x + T.w - 64} y={rowY(tb.top, i) + 34} textAnchor="end" fontFamily={mono} fontSize={22} fontWeight={700} fill={tb.tags[i] === 'PK' ? C.amber : C.green}>{tb.tags[i]}</text>}
                </g>
              );
            })}
          </g>
        ))}
        {/* PK -> FK bridge after the fix */}
        <g opacity={join}>
          <line x1={T.x + T.w - 36} y1={rowY(AY, 0) + 24} x2={T.x + T.w - 36} y2={rowY(BY, 1) + 24} stroke={C.blue} strokeWidth={6} strokeDasharray="12 10" strokeDashoffset={-f * 3} strokeLinecap="round" filter="url(#glow)" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: T.x + 30, top: T.y + T.h - 62, width: T.w - 60, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.blue, opacity: prog(f, 600, 650)}}>c.customer_id ← بيحسم الملكية</div>

      <Caption from={90} to={630} color={C.red}>{'ERROR: column reference "customer_id" is ambiguous'}</Caption>
      <Caption from={750} to={1230} color={C.green}>Table Aliases (c, o) ──► Explicit Column Qualification (c.customer_id)</Caption>
    </Scene>
  );
};
