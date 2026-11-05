import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, lin, pop, sec} from '../kit';
import {COST_BENCHMARK} from '../data';

// SC04 (130-170s): Query Cost Drop & maintenance_work_mem
// Anchors: 131.0 engine | 136.0 cost | 140.0 45210 | 145.0 8.42 | 150.0 maintenance_work_mem | 155.0 buffer | 160.0 stable | 165.0 seal
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const engineP = clamp(lin(f, t(131.5), 16));
  const costP = clamp(lin(f, t(136), 16));
  const memP = clamp(lin(f, t(150), 16));
  const sealP = pop(f, t(160));

  // Cost drop animation
  const costDrop = clamp(lin(f, t(137), sec(14)));
  const currentCost = lerp(COST_BENCHMARK.beforeCost, COST_BENCHMARK.afterCost, costDrop);
  const currentColor = costDrop < 0.5 ? C.red : C.green;

  // Memory buffer animation
  const memFill = clamp(lin(f, t(151), sec(12)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | Query Cost Drop & maintenance_work_mem" from={sec(2)} to={sec(40)} color={C.green} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: engineP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={120}
          title="EXPLAIN · Before vs After MatView Optimization"
          lines={[
            'BEFORE: Seq Scan on store_orders  (cost=0.00..45210.00 rows=10000000)',
            'AFTER:  Index Scan on mv_sales_summary  (cost=0.29..8.42 rows=42)',
          ]}
          start={t(131.5)}
          cps={0.75}
          size={16}
          accent={C.green}
          hl={1}
          hlColor={C.green}
        />
      </div>

      {/* LEFT: Cost drop visualization */}
      <Win x={80} y={320} w={860} h={460} title="execution cost reduction · 45,210 → 8.42" accent={C.green} opacity={costP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          query cost plunge · optimization impact
        </div>

        {/* Big cost display */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, fontWeight: 700}}>EXECUTION COST</div>
          <div style={{
            fontFamily: MONO,
            fontSize: 72,
            fontWeight: 700,
            color: currentColor,
            textShadow: `0 0 24px ${currentColor}88`,
          }}>
            {currentCost >= 100 ? Math.round(currentCost).toLocaleString() : currentCost.toFixed(2)}
          </div>

          {/* Progress bar */}
          <div style={{width: 600, height: 20, borderRadius: 10, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(1 - costDrop) * 100}%`, background: `linear-gradient(90deg, ${C.red}, ${C.amber})`, borderRadius: 10}} />
            <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${costDrop * 100}%`, background: `linear-gradient(90deg, ${C.amber}, ${C.green})`, borderRadius: 10}} />
          </div>

          {/* Before/After labels */}
          <div style={{display: 'flex', gap: 40, marginTop: 10}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, color: C.red, fontWeight: 700, textDecoration: 'line-through'}}>45,210</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>before (live JOINs)</div>
            </div>
            <div style={{fontSize: 28, color: C.amber}}>──►</div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: costDrop > 0.5 ? 1 : 0.4}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 700, textShadow: `0 0 12px ${C.green}88`}}>8.42</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>after (MatView + Index)</div>
            </div>
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep, opacity: clamp(sealP)}}>
          ✓ 99.98% cost reduction · 45,210 → 8.42
        </div>
      </Win>

      {/* RIGHT: maintenance_work_mem buffer */}
      <Win x={980} y={320} w={860} h={460} title="maintenance_work_mem · index build buffer" accent={C.blue} opacity={memP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          RAM allocation for background index rebuild
        </div>

        {/* Memory buffer visualization */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 60}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 8}}>maintenance_work_mem usage</div>
          <div style={{height: 180, borderRadius: 14, background: C.deep, border: `3px solid ${C.border}`, overflow: 'hidden', position: 'relative'}}>
            {/* Fill */}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${memFill * 100}%`, background: `linear-gradient(180deg, ${C.blue}44, ${C.blue}88)`, borderRadius: 14, transition: 'none'}}>
              {/* Animated lines inside buffer */}
              {Array.from({length: 5}).map((_, i) => (
                <div key={i} style={{position: 'absolute', left: 10, right: 10, top: `${i * 20 + 10}%`, height: 2, background: `${C.blue}33`, borderRadius: 1}} />
              ))}
            </div>
            {/* Label inside */}
            <div dir="ltr" style={{position: 'absolute', left: 20, top: 20, fontFamily: MONO, fontSize: 24, color: C.blue, fontWeight: 700}}>
              {Math.round(memFill * 100)}% allocated
            </div>
            {/* Label below */}
            <div dir="ltr" style={{position: 'absolute', right: 20, bottom: 20, fontFamily: MONO, fontSize: 16, color: C.muted}}>
              index build in progress
            </div>
          </div>

          {/* Benefits */}
          <div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10}}>
            {[
              {label: 'buffers index construction', color: C.blue},
              {label: 'compares diffs during CONCURRENTLY', color: C.green},
              {label: 'no CPU/RAM spikes', color: C.amber},
            ].map((item, i) => {
              const visible = clamp(pop(f, t(153 + i * 1.2)));
              return (
                <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', border: `2px solid ${item.color}`, borderRadius: 8, background: `${item.color}0d`, opacity: visible}}>
                  <Check p={visible} size={24} color={item.color} />
                  <span style={{fontFamily: MONO, fontSize: 16, color: item.color, fontWeight: 700}}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          maintenance_work_mem · stable background rebuild
        </div>
      </Win>

      <Caption text="Query Cost Reduction ──► Execution Cost Drops from 45,210 to 8.42" from={t(136)} to={t(150)} />
      <Caption text="Memory Allocation ──► maintenance_work_mem Buffers Index Build During Refresh" from={t(152)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
