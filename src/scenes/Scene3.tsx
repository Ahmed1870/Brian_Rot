import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, lin, pop, sec} from '../kit';
import {BENCHMARK} from '../data';

// SC03 (85-130s): Direct Indexing & Benchmark Acceleration
// Anchors: 86.0 index | 90.0 CREATE INDEX | 95.0 B-Tree GIN | 100.0 benchmark | 110.0 acceleration | 118.0 minutes | 125.0 milliseconds
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const benchmarkP = clamp(lin(f, t(95), 16));
  // Benchmark timer drops from 4.2 min to 0.002 sec
  const dropProg = clamp(lin(f, t(100), sec(18)));
  const sealP = pop(f, t(118));

  // Interpolate the displayed time
  const currentMs = lerp(BENCHMARK.beforeMs, BENCHMARK.afterMs, dropProg);
  const currentLabel = dropProg < 0.5 ? BENCHMARK.beforeLabel : BENCHMARK.afterLabel;
  const currentColor = dropProg < 0.5 ? C.red : C.green;

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="الفهارس المباشرة وتسريع الاستعلامات | Direct Indexing & Benchmark" from={sec(2)} to={sec(40)} color={C.green} />

      {/* SQL editor at top */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={150}
          title="PostgreSQL · Direct Indexing on Materialized View"
          lines={[
            'CREATE UNIQUE INDEX idx_mv_sales_id ON mv_annual_sales (sales_id);',
            'CREATE INDEX idx_mv_sales_date ON mv_annual_sales (order_date);',
          ]}
          start={t(86.5)}
          cps={0.8}
          size={18}
          accent={C.green}
          hl={1}
          hlColor={C.green}
        />
      </div>

      {/* LEFT: Index types */}
      <Win x={80} y={350} w={700} h={530} title="index types · direct on MatView" accent={C.blue} opacity={clamp(lin(f, t(90), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          custom indexes on materialized view
        </div>
        <div style={{position: 'absolute', left: 18, right: 18, top: 50, display: 'flex', flexDirection: 'column', gap: 14}}>
          {[
            {type: 'B-Tree', desc: 'range & equality queries', color: C.blue},
            {type: 'GIN', desc: 'full-text & array search', color: C.green},
            {type: 'GiST', desc: 'geometric & overlap', color: C.amber},
            {type: 'UNIQUE', desc: 'required for CONCURRENTLY', color: C.purple},
          ].map((idx, i) => {
            const visible = clamp(pop(f, t(92 + i * 1.2)));
            return (
              <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: `2px solid ${idx.color}`, borderRadius: 10, background: `${idx.color}0d`, opacity: visible, transform: `translateX(${(1 - visible) * 20}px)`}}>
                <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color: idx.color, width: 100}}>{idx.type}</span>
                <span style={{fontFamily: MONO, fontSize: 16, color: C.muted, flex: 1}}>{idx.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Advantage callout */}
        <div style={{position: 'absolute', left: 18, right: 18, bottom: 60, padding: '12px 16px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, opacity: clamp(pop(f, t(110)))}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Zero JOIN overhead at runtime</div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 4}}>pre-computed aggregations + direct index scan</div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          CREATE INDEX ON mv_name(...)
        </div>
      </Win>

      {/* RIGHT: Benchmark timer */}
      <Win x={820} y={350} w={1020} h={530} title="execution benchmark · before vs after indexing" accent={C.green} opacity={benchmarkP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          query execution time acceleration
        </div>

        {/* Large benchmark display */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30}}>
          {/* Before label */}
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, fontWeight: 700}}>BEFORE (no index · live JOINs)</div>

          {/* Big timer */}
          <div style={{
            fontFamily: MONO,
            fontSize: 80,
            fontWeight: 700,
            color: currentColor,
            textShadow: `0 0 24px ${currentColor}88`,
            transition: 'none',
          }}>
            {currentLabel}
          </div>

          {/* Progress bar showing drop */}
          <div style={{width: 700, height: 20, borderRadius: 10, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(1 - dropProg) * 100}%`, background: `linear-gradient(90deg, ${C.red}, ${C.amber})`, borderRadius: 10}} />
            <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${dropProg * 100}%`, background: `linear-gradient(90deg, ${C.amber}, ${C.green})`, borderRadius: 10}} />
          </div>

          {/* After label */}
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, fontWeight: 700}}>AFTER (MatView + Index Scan)</div>

          {/* Result comparison */}
          <div style={{display: 'flex', gap: 40, marginTop: 10}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 28, color: C.red, fontWeight: 700, textDecoration: 'line-through'}}>{BENCHMARK.beforeLabel}</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>live query</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', fontSize: 36, color: C.amber}}>──►</div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: dropProg > 0.5 ? 1 : 0.4}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 28, color: C.green, fontWeight: 700, textShadow: `0 0 16px ${C.green}88`}}>{BENCHMARK.afterLabel}</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>Index Scan ✓</div>
            </div>
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep, opacity: clamp(sealP)}}>
          ✓ 4.2 Minutes ➔ 0.002 Seconds · zero JOIN overhead
        </div>
      </Win>

      <Caption text="CREATE INDEX ON mv_annual_sales (order_date) ──► Direct Indexing on MatView" from={t(90)} to={t(108)} />
      <Caption text="Execution Acceleration ──► 4.2 Minutes ➔ 0.002 Seconds (Zero JOIN Overhead)" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
