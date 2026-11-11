import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Kpi, Mix, Stage, TopBadge, Warn, clamp, lin, pop, sec} from '../kit';

// SC03 (86-129.7s): why the engine ignores an index - implicit casting.
// Anchors (s): 86.2 reasons | 92.7 implicit casting | 102.2 functions / small tables | 111.4 rewrite the query
const S = START.s3;
const t = (g: number) => sec(g - S);

const Card: React.FC<{x: number; title: string; sub: string; color: string; p: number; on?: boolean}> = ({x, title, sub, color, p, on}) => (
  <div style={{position: 'absolute', left: x, top: 180, width: 560, height: 118, borderRadius: 18, border: `3px solid ${color}`, background: `${color}${on ? '26' : '14'}`, boxShadow: on ? `0 0 26px ${color}66` : 'none', opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 24}px)`, padding: '16px 24px', boxSizing: 'border-box'}}>
    <Mix style={{fontSize: 28, fontWeight: 700, color: C.text, display: 'block'}}>{title}</Mix>
    <div dir="ltr" style={{marginTop: 8, fontFamily: MONO, fontSize: 21, color}}>{sub}</div>
  </div>
);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const fixOp = clamp(lin(f, t(110.8), 12));
  return (
    <Stage dur={1310} inFx="up" outFx="down">
      <TopBadge text="أسباب المسح التتابعي | Forced Seq Scans & Implicit Casting" from={sec(1)} to={sec(40)} color={C.amber} />

      <Card x={80} title="① غياب الفهرس No Index" sub="WHERE / JOIN columns" color={C.amber} p={lin(f, t(87), 14)} />
      <Card x={680} title="② التحويل الضمني Implicit Cast" sub="order_code TEXT vs numeric 101" color={C.red} p={lin(f, t(92.7), 14)} on={f >= t(92.7) && f < t(102)} />
      <Card x={1280} title="③ دوال وجداول صغيرة Functions" sub="LOWER(col) · tiny table" color={C.amber} p={lin(f, t(102.2), 14)} on={f >= t(102.2) && f < t(110)} />

      <Editor x={80} y={330} w={880} h={250} title="bad_query.sql" lines={['-- order_code is TEXT', 'SELECT * FROM store_orders', 'WHERE order_code = 101;']} start={t(93.6)} cps={0.9} size={24} hl={f >= t(97.5) ? 2 : -1} hlColor={C.red} accent={C.red} />
      <Editor x={980} y={330} w={860} h={250} title="fixed_query.sql" lines={['-- literal matches the TEXT type', 'SELECT * FROM store_orders', "WHERE order_code = '101';"]} start={t(111.4)} cps={0.9} size={24} hl={f >= t(115) ? 2 : -1} hlColor={C.green} accent={C.green} opacity={fixOp} />

      <div dir="ltr" style={{position: 'absolute', left: 80, top: 610, width: 880, height: 96, borderRadius: 18, border: `3px solid ${C.red}`, background: `${C.red}1f`, opacity: clamp(pop(f, t(97))), display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', boxSizing: 'border-box', fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.red}}>
        <Warn size={52} /> Implicit Cast Disables Index → Seq Scan
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 980, top: 610, width: 860, height: 96, borderRadius: 18, border: `3px solid ${C.green}`, background: `${C.green}1f`, opacity: clamp(pop(f, t(115.2))), display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', boxSizing: 'border-box', fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.green}}>
        <Check p={clamp(pop(f, t(115.2)))} size={52} /> Index Scan Activated
      </div>

      <div style={{position: 'absolute', left: 80, top: 740, opacity: clamp(pop(f, t(102.6)))}}><Chip color={C.amber} style={{fontSize: 24}}>{"LOWER(order_code) = '101'  ✗ wraps the column"}</Chip></div>
      <div style={{position: 'absolute', left: 80, top: 800, opacity: clamp(pop(f, t(106)))}}><Chip color={C.amber} style={{fontSize: 24}}>tiny table → Optimizer prefers Seq Scan</Chip></div>
      <Kpi x={980} y={740} w={860} label="plan after the fix" ar="الخطة بعد التعديل" value="Index Scan" color={C.green} p={lin(f, t(116.5), 14)} glow={clamp(lin(f, t(116.5), 14))} />
      <div style={{position: 'absolute', left: 80, top: 860, opacity: clamp(pop(f, t(118)))}}><Chip color={C.green} style={{fontSize: 24}}>align data types · never wrap indexed columns in functions</Chip></div>

      <Caption text="Implicit Type Casting ──► Forces Engine to Bypass Indexes & Fallback to Seq Scan" from={t(90)} to={t(108)} tone="danger" />
      <Caption text="Query Fix ──► Align Data Types & Avoid Wrapping Columns in Unindexed Functions" from={t(110)} to={sec(43)} tone="ok" />
    </Stage>
  );
};
