import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const COLS = 12, ROWS = 4, N = COLS * ROWS;
const TARGET = 41; // the row we are looking for

// B-Tree geometry (local to the card)
const root = {x: 440, y: 150};
const mids = [{x: 190, y: 270}, {x: 440, y: 270}, {x: 690, y: 270}];
const leaves = [100, 230, 360, 490, 620, 760].map((x, i) => ({x, y: 390, p: Math.floor(i / 2)}));
const PATH_LEAF = 3; // leaf holding the target (child of middle node 1)

const Node: React.FC<{x: number; y: number; w: number; on: boolean; label?: string; color: string}> = ({x, y, w, on, label, color}) => (
  <g filter={on ? 'url(#glow)' : undefined}>
    <rect x={x - w / 2} y={y - 24} width={w} height={48} rx={12} fill={on ? 'rgba(16,185,129,0.25)' : C.bg2} stroke={on ? color : C.line} strokeWidth={on ? 5 : 3} />
    {label && <text x={x} y={y + 9} textAnchor="middle" fontFamily={mono} fontSize={24} fontWeight={700} fill={on ? C.text : C.dim}>{label}</text>}
  </g>
);

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const sc = prog(f, 60, 900);
  const scanned = Math.floor(sc * N);
  const ms = Math.round(sc * 1240);
  const jump = prog(f, 660, 760); // laser jump along the B-Tree
  const t = B.s5.idx;
  const hitRoot = jump > 0, hitMid = jump > 0.35, hitLeaf = jump > 0.7;

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="هندسة الأداء: Seq Scan مقابل Index Scan" en="Query Performance Benchmark" chip="SC 05 · PERFORMANCE" accent={C.green} />

      {/* ---- sequential scan ---- */}
      <Card box={B.s5.seq} accent={C.red} at={8}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'ltr'}}>
          <span style={{fontFamily: mono, fontSize: 34, fontWeight: 700, color: C.red}}>Seq Scan</span>
          <span style={{fontFamily: mono, fontSize: 40, fontWeight: 700, color: C.text}}>{ms.toLocaleString('en-US')} ms</span>
        </div>
        <svg width={B.s5.seq.w} height={B.s5.seq.h} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: N}, (_, i) => {
            const x = 30 + (i % COLS) * 68, y = 110 + Math.floor(i / COLS) * 72;
            const done = i < scanned, cur = i === scanned;
            const isT = i === TARGET && done;
            return <rect key={i} x={x} y={y} width={60} height={60} rx={10} fill={isT ? C.red : cur ? C.amber : done ? '#475569' : C.bg2} stroke={cur ? C.amber : C.line} strokeWidth={cur ? 4 : 2} opacity={prog(f, 20, 50)} />;
          })}
          <text x={440} y={440} textAnchor="middle" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.dim}>بيقرا صفحات الجدول واحدة واحدة</text>
        </svg>
      </Card>

      {/* ---- index scan ---- */}
      <Card box={t} accent={C.green} at={24}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'ltr'}}>
          <span style={{fontFamily: mono, fontSize: 34, fontWeight: 700, color: C.green}}>Index Scan · B-Tree</span>
          <span style={{fontFamily: mono, fontSize: 40, fontWeight: 700, color: jump >= 1 ? C.green : C.dim}}>{jump >= 1 ? '0.001 s' : '— s'}</span>
        </div>
        <svg width={t.w} height={t.h} style={{position: 'absolute', inset: 0}}>
          <Defs />
          {mids.map((m, i) => (<line key={'a' + i} x1={root.x} y1={root.y + 24} x2={m.x} y2={m.y - 24} stroke={hitMid && i === 1 ? C.green : C.line} strokeWidth={hitMid && i === 1 ? 6 : 3} />))}
          {leaves.map((l, i) => (<line key={'b' + i} x1={mids[l.p].x} y1={mids[l.p].y + 24} x2={l.x} y2={l.y - 24} stroke={hitLeaf && i === PATH_LEAF ? C.green : C.line} strokeWidth={hitLeaf && i === PATH_LEAF ? 6 : 3} />))}
          <Node x={root.x} y={root.y} w={150} on={hitRoot} label="root" color={C.green} />
          {mids.map((m, i) => (<Node key={i} x={m.x} y={m.y} w={130} on={hitMid && i === 1} color={C.green} />))}
          {leaves.map((l, i) => (<Node key={i} x={l.x} y={l.y} w={100} on={hitLeaf && i === PATH_LEAF} label={hitLeaf && i === PATH_LEAF ? 'row ✓' : undefined} color={C.green} />))}
          {/* laser beam */}
          {jump > 0 && jump < 1 && <circle cx={jump > 0.7 ? 490 : 440} cy={jump > 0.7 ? 390 : jump > 0.35 ? 270 : 150} r={12} fill={C.text} filter="url(#glow)" />}
          <text x={440} y={440} textAnchor="middle" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.dim}>بيقفز مباشرة للصف المطلوب</text>
        </svg>
      </Card>

      {/* ---- SARGable comparison ---- */}
      <Card box={B.s5.bad} accent={C.red} at={560}>
        <div style={{padding: '18px 30px', direction: 'ltr'}}>
          <Tag color={C.red}>NOT SARGable ✗</Tag>
          <div style={{marginTop: 14, fontFamily: mono, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', fontSize: fs('WHERE unit_price * 1.1 > 100', 820, 38, mono)}}>WHERE unit_price * 1.1 &gt; 100</div>
          <div style={{marginTop: 12, fontFamily: cairo, fontWeight: 700, fontSize: 27, color: C.red, direction: 'rtl', textAlign: 'left'}}>الحساب على العمود بيمنع استخدام الفهرس</div>
        </div>
      </Card>
      <Card box={B.s5.good} accent={C.green} at={620}>
        <div style={{padding: '18px 30px', direction: 'ltr'}}>
          <Tag color={C.green}>SARGable ✓</Tag>
          <div style={{marginTop: 14, fontFamily: mono, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', fontSize: fs('WHERE unit_price > 90.91', 820, 38, mono)}}>WHERE unit_price &gt; 90.91</div>
          <div style={{marginTop: 12, fontFamily: cairo, fontWeight: 700, fontSize: 27, color: C.green, direction: 'rtl', textAlign: 'left'}}>العمود لوحده ← الفهرس يشتغل ويقفز للنتيجة</div>
        </div>
      </Card>

      <Caption from={60} to={540} color={C.red}>Sequential Scan ──► Reads Entire Table Disk Pages (Slow)</Caption>
      <Caption from={660} to={1080} color={C.green}>Index Scan ──► Direct B-Tree Lookup (0.001s Lightning Fast)</Caption>
    </Scene>
  );
};
