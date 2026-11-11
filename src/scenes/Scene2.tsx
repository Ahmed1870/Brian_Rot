import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Editor, Kpi, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC02 (42.5-86s): reading the Seq Scan node in EXPLAIN (ANALYZE, BUFFERS).
// Anchors (s): 42.7 read the node | 48.8 run EXPLAIN | 57.6 Rows Removed by Filter | 60.5 volume read from disk | 67.3 find columns missing indexes
const S = START.s2;
const t = (g: number) => sec(g - S);
const LINES = [
  'EXPLAIN (ANALYZE, BUFFERS)',
  "SELECT * FROM store_orders WHERE status = 'COMPLETED';",
  '',
  'Seq Scan on store_orders  (cost=0.00..21450.00 rows=50000)',
  "  Filter: (status = 'COMPLETED'::text)",
  '  Rows Removed by Filter: 950000',
  '  Buffers: shared read=12000',
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const hl = f >= t(63.5) ? 6 : f >= t(57.6) ? 5 : f >= t(50.5) ? 3 : -1;
  const blocks = Math.min(12, Math.max(0, Math.floor((f - t(49.5)) / sec(0.85)) + 1));
  const bar = clamp(lin(f, t(57.6), 30));
  return (
    <Stage dur={1305} inFx="left" outFx="left">
      <TopBadge text="تشريح خطة التنفيذ | EXPLAIN ANALYZE BUFFERS" from={sec(1)} to={sec(16)} color={C.blue} />

      <Editor x={80} y={180} w={1100} h={400} title="EXPLAIN" lines={LINES} start={t(48.8)} cps={1.0} size={24} hl={hl} hlColor={C.red} accent={hl >= 0 ? C.red : C.border} />
      <div style={{position: 'absolute', left: 80, top: 596, opacity: clamp(pop(f, t(42.7)))}}><Chip color={C.blue} style={{fontSize: 24}}>Plan Node · Seq Scan</Chip></div>

      <Win x={1220} y={180} w={620} h={400} title="Shared Read Blocks" accent={blocks > 0 ? C.red : C.border}>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 18, display: 'flex', flexWrap: 'wrap', gap: 12, width: 560}}>
          {Array.from({length: 12}, (_, i) => (
            <div key={i} style={{boxSizing: 'border-box', width: 78, height: 70, borderRadius: 12, border: `3px solid ${i < blocks ? C.red : C.border}`, background: i < blocks ? `${C.red}33` : 'transparent', boxShadow: i === blocks - 1 ? `0 0 18px ${C.red}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 20, color: i < blocks ? C.red : C.muted}}>
              pg{i + 1}
            </div>
          ))}
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 214, width: 560, fontFamily: MONO, fontSize: 21, color: C.muted, opacity: clamp(bar)}}>Rows Removed by Filter vs rows kept</div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 252, width: 560, height: 40, borderRadius: 10, overflow: 'hidden', background: C.deep, border: `2px solid ${C.border}`, opacity: clamp(bar)}}>
          <div style={{width: `${95 * bar}%`, height: '100%', background: C.red}} />
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 300, fontFamily: MONO, fontSize: 21, color: C.text, opacity: clamp(bar)}}><span style={{color: C.red}}>950,000 discarded</span> · <span style={{color: C.green}}>50,000 kept</span></div>
      </Win>

      <Kpi x={80} y={670} w={500} label="Seq Scan cost" ar="التكلفة" value="21,450" color={C.red} p={lin(f, t(50.5), 14)} glow={hl === 3 ? 1 : 0} />
      <Kpi x={600} y={670} w={640} label="Rows Removed by Filter" ar="صفوف مستبعدة" value="950,000" color={C.red} p={lin(f, t(57.6), 14)} glow={hl === 5 ? 1 : 0} />
      <Kpi x={1260} y={670} w={580} label="Shared Read Blocks" ar="قراءات من القرص" value="12,000" color={C.amber} p={lin(f, t(63.5), 14)} glow={hl === 6 ? 1 : 0} />
      <div style={{position: 'absolute', left: 80, top: 790, opacity: clamp(pop(f, t(67.3)))}}>
        <Chip color={C.green} style={{fontSize: 26}}>→ add indexes on the filter columns</Chip>
      </div>

      <Caption text={'Seq Scan Cost Analysis ──► High Cost & Huge "Rows Removed by Filter" Volume'} from={t(44)} to={t(60)} tone="danger" />
      <Caption text="Shared Read Blocks ──► High Disk I/O Caused by Missing Targeted Indexes" from={t(63)} to={sec(43)} tone="danger" />
    </Stage>
  );
};
