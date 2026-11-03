import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, fs, prog} from '../common';

const COLS = 12, ROWS = 4, N = COLS * ROWS;
const root = {x: 440, y: 140};
const mids = [{x: 190, y: 250}, {x: 440, y: 250}, {x: 690, y: 250}];
const leaves = [100, 230, 360, 490, 620, 760].map((x, i) => ({x, y: 370, p: Math.floor(i / 2)}));

const Node: React.FC<{x: number; y: number; w: number; on: boolean; label?: string}> = ({x, y, w, on, label}) => (
  <g filter={on ? 'url(#glow)' : undefined}>
    <rect x={x - w / 2} y={y - 24} width={w} height={48} rx={12} fill={on ? 'rgba(16,185,129,0.25)' : C.bg2} stroke={on ? C.green : C.line} strokeWidth={on ? 5 : 3} />
    {label && <text x={x} y={y + 9} textAnchor="middle" fontFamily={mono} fontSize={24} fontWeight={700} fill={on ? C.text : C.dim}>{label}</text>}
  </g>
);

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const sc = prog(f, 60, 900);
  const scanned = Math.floor(sc * N);
  const rows = Math.round(sc * 100000);
  const jMin = prog(f, 600, 690); // MIN: leftmost leaf
  const jMax = prog(f, 840, 930); // MAX: rightmost leaf
  const t = B.s5.idx;
  const minOn = jMin > 0, maxOn = jMax > 0;
  const laser = jMax > 0 && jMax < 1 ? {p: jMax, side: 2} : jMin > 0 && jMin < 1 ? {p: jMin, side: 0} : null;

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="تسريع MIN و MAX بالفهرس" en="B-Tree Index Seek" chip="SC 05 · PERFORMANCE" accent={C.green} />

      {/* no index: full scan */}
      <Card box={B.s5.seq} accent={C.red} at={8}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'ltr'}}>
          <span style={{fontFamily: mono, fontSize: 32, fontWeight: 700, color: C.red}}>MIN(price) · no index</span>
          <span style={{fontFamily: mono, fontSize: 34, fontWeight: 700, color: C.text}}>{rows.toLocaleString('en-US')}</span>
        </div>
        <svg width={B.s5.seq.w} height={B.s5.seq.h} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: N}, (_, i) => {
            const x = 30 + (i % COLS) * 68, y = 110 + Math.floor(i / COLS) * 72;
            const done = i < scanned, cur = i === scanned;
            return <rect key={i} x={x} y={y} width={60} height={60} rx={10} fill={cur ? C.amber : done ? '#475569' : C.bg2} stroke={cur ? C.amber : C.line} strokeWidth={cur ? 4 : 2} opacity={prog(f, 20, 50)} />;
          })}
          <text x={440} y={440} textAnchor="middle" fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.dim}>بيقرا الـ 100,000 صف كلها</text>
        </svg>
      </Card>

      {/* with B-Tree: index only seek */}
      <Card box={t} accent={C.green} at={24}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'ltr'}}>
          <span style={{fontFamily: mono, fontSize: 32, fontWeight: 700, color: C.green}}>MIN / MAX · B-Tree</span>
          <span style={{fontFamily: mono, fontSize: 36, fontWeight: 700, color: jMin >= 1 ? C.green : C.dim}}>{jMin >= 1 ? '0.0001 s' : '— s'}</span>
        </div>
        <svg width={t.w} height={t.h} style={{position: 'absolute', inset: 0}}>
          <Defs />
          {mids.map((m, i) => (<line key={'a' + i} x1={root.x} y1={root.y + 24} x2={m.x} y2={m.y - 24} stroke={(minOn && i === 0) || (maxOn && i === 2) ? C.green : C.line} strokeWidth={(minOn && i === 0) || (maxOn && i === 2) ? 6 : 3} />))}
          {leaves.map((l, i) => {
            const hot = (minOn && i === 0 && jMin > 0.5) || (maxOn && i === 5 && jMax > 0.5);
            return <line key={'b' + i} x1={mids[l.p].x} y1={mids[l.p].y + 24} x2={l.x} y2={l.y - 24} stroke={hot ? C.green : C.line} strokeWidth={hot ? 6 : 3} />;
          })}
          <Node x={root.x} y={root.y} w={150} on={minOn} label="root" />
          {mids.map((m, i) => (<Node key={i} x={m.x} y={m.y} w={130} on={(minOn && i === 0 && jMin > 0.25) || (maxOn && i === 2 && jMax > 0.25)} />))}
          {leaves.map((l, i) => (<Node key={i} x={l.x} y={l.y} w={100} on={(minOn && i === 0 && jMin > 0.6) || (maxOn && i === 5 && jMax > 0.6)} label={i === 0 && jMin > 0.6 ? 'MIN' : i === 5 && jMax > 0.6 ? 'MAX' : undefined} />))}
          {laser && (() => {
            const L = laser.side === 0 ? {x: 100, y: 370, m: {x: 190, y: 250}} : {x: 760, y: 370, m: {x: 690, y: 250}};
            const p = laser.p;
            const pt = p < 0.33 ? {x: root.x + (L.m.x - root.x) * (p / 0.33), y: root.y + (L.m.y - root.y) * (p / 0.33)} : {x: L.m.x + (L.x - L.m.x) * ((p - 0.33) / 0.67), y: L.m.y + (L.y - L.m.y) * ((p - 0.33) / 0.67)};
            return <circle cx={pt.x} cy={pt.y} r={12} fill={C.text} filter="url(#glow)" />;
          })()}
          <text x={100} y={436} textAnchor="middle" fontFamily={mono} fontSize={24} fontWeight={700} fill={C.green} opacity={prog(f, 690, 720)}>19.90</text>
          <text x={760} y={436} textAnchor="middle" fontFamily={mono} fontSize={24} fontWeight={700} fill={C.green} opacity={prog(f, 930, 960)}>9,990</text>
        </svg>
      </Card>

      <Card box={B.s5.bad} accent={C.red} at={560}>
        <div style={{padding: '18px 30px', direction: 'ltr'}}>
          <Tag color={C.red}>SEQ SCAN ✗</Tag>
          <div style={{marginTop: 14, fontFamily: mono, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', fontSize: fs('Seq Scan on products · 100,000 rows', 820, 38, mono)}}>Seq Scan on products · 100,000 rows</div>
          <div style={{marginTop: 12, fontFamily: cairo, fontWeight: 700, fontSize: 27, color: C.red, direction: 'rtl', textAlign: 'left'}}>مسح كامل للجدول، بطيء</div>
        </div>
      </Card>
      <Card box={B.s5.good} accent={C.green} at={620}>
        <div style={{padding: '18px 30px', direction: 'ltr'}}>
          <Tag color={C.green}>INDEX ONLY SEEK ✓</Tag>
          <div style={{marginTop: 14, fontFamily: mono, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', fontSize: fs('Index Only Scan · LIMIT 1 · 1 row', 820, 38, mono)}}>Index Only Scan · LIMIT 1 · 1 row</div>
          <div style={{marginTop: 12, fontFamily: cairo, fontWeight: 700, fontSize: 27, color: C.green, direction: 'rtl', textAlign: 'left'}}>قفزة مباشرة لأول أو آخر ورقة في الشجرة</div>
        </div>
      </Card>

      <Caption from={60} to={540} color={C.red}>MIN() / MAX() without Index ──► Full Table Scan (Slow)</Caption>
      <Caption from={660} to={1080} color={C.green}>MIN() / MAX() with B-Tree ──► Index Only Seek (0.0001s Lightning Fast)</Caption>
    </Scene>
  );
};
