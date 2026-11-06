import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';
import {SELECTIVITY} from '../data';

// SC04 (130-170s): pg_statistic & Selectivity — Optimizer Routing Seq Scan vs Index Scan
// Anchors: 131.0 optimizer | 136.0 pg_statistic | 140.0 selectivity | 145.0 0.001 | 150.0 index scan | 155.0 route | 160.0 seal | 165.0 fast
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131.5), 14));
  const statP = clamp(lin(f, t(136), 14));
  // Selectivity gauge fill
  const selProg = clamp(lin(f, t(140), sec(8)));
  // Routing decision animation
  const routeProg = clamp(lin(f, t(150), sec(10)));
  const sealP = pop(f, t(160));
  const fastP = pop(f, t(165));

  // Interpolated selectivity value
  const selVal = lerp(1, SELECTIVITY.highValue, selProg);
  // Cost values
  const seqCost = lerp(0, 5432.10, clamp(lin(f, t(150), 8)));
  const idxCost = lerp(0, 12.45, clamp(lin(f, t(153), 8)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="pg_statistic والانتقائية | pg_statistic & Selectivity — Optimizer Routing" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={140}
          title="PostgreSQL 16 · EXPLAIN ANALYZE · selectivity estimation"
          lines={[
            'EXPLAIN SELECT * FROM store_orders WHERE total_amount > 5000;',
            '-- pg_statistic histogram ──► optimizer estimates selectivity',
          ]}
          start={t(131.5)}
          cps={0.78}
          size={16}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* LEFT: pg_statistic catalog with selectivity gauge */}
      <Win x={80} y={340} w={860} h={540} title="pg_statistic catalog ──► selectivity calculation" accent={C.amber} opacity={statP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          pg_statistic · most_common_vals + histogram_bounds
        </div>

        {/* Catalog table */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 60, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, lineHeight: 1.6}}>
          <div style={{color: '#64748B', fontSize: 11, marginBottom: 6}}>pg_statistic · table=store_orders · column=total_amount</div>
          <div><span style={{color: C.amber}}>starelid</span>      : 16384 (store_orders)</div>
          <div><span style={{color: C.amber}}>staattnum</span>     : 5</div>
          <div><span style={{color: C.amber}}>stadistinct</span>   : -0.85 (≈ 85% distinct)</div>
          <div><span style={{color: C.amber}}>stanullfrac</span>   : 0.02</div>
          <div><span style={{color: C.amber}}>histogram_bounds</span>: [0, 250, 1200, ... 5000, ... 99999]</div>
        </div>

        {/* Selectivity gauge */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 230, padding: '14px 16px', border: `2px solid ${selProg > 0.7 ? C.green : C.amber}`, borderRadius: 10, background: selProg > 0.7 ? `${C.green}0d` : `${C.amber}0d`}}>
          <div dir="ltr" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
            <span style={{fontFamily: MONO, fontSize: 15, color: C.text, fontWeight: 700}}>Selectivity estimate</span>
            <span style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: selProg > 0.7 ? C.green : C.amber}}>
              {selVal.toFixed(3)}
            </span>
          </div>
          {/* Gauge bar */}
          <div style={{height: 18, borderRadius: 9, background: C.border, overflow: 'hidden'}}>
            <div
              style={{
                height: '100%',
                width: `${selProg * 100}%`,
                background: `linear-gradient(90deg, ${C.green}, ${C.amber})`,
                borderRadius: 9,
              }}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: MONO, fontSize: 11, color: C.muted}}>
            <span style={{color: C.green}}>0.001 (high sel)</span>
            <span>← Index Scan favored</span>
            <span style={{color: C.red}}>1.0 (low sel)</span>
          </div>
        </div>

        {/* Decision matrix */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 360, display: 'flex', gap: 12}}>
          <div style={{flex: 1, padding: '12px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, opacity: selProg > 0.7 ? 1 : 0.4}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, marginBottom: 4}}>High Selectivity</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>sel &lt; 0.05 → Index Scan</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 4}}>few matching rows</div>
          </div>
          <div style={{flex: 1, padding: '12px', border: `2px solid ${C.red}`, borderRadius: 10, background: `${C.red}0d`, opacity: selProg < 0.3 ? 0.4 : 1}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, marginBottom: 4}}>Low Selectivity</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text}}>sel &gt; 0.20 → Seq Scan</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 4}}>most rows match</div>
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>pg_statistic · histogram_bounds</span>
          <span>{selProg > 0.7 ? '✓ 0.001 = high selectivity' : 'estimating...'}</span>
        </div>
      </Win>

      {/* RIGHT: Execution plan routing — Seq Scan vs Index Scan */}
      <Win x={980} y={340} w={860} h={540} title="execution plan routing ──► Optimizer picks Index Scan" accent={C.green} opacity={clamp(lin(f, t(150), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          optimizer evaluates costs ──► routes to lowest plan
        </div>

        {/* Two competing plans */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 60, display: 'flex', gap: 14}}>
          {/* Seq Scan — high cost */}
          <div style={{flex: 1, padding: '14px', border: `2px solid ${routeProg > 0.5 ? C.red : C.border}`, borderRadius: 10, background: routeProg > 0.3 ? `${C.red}0d` : 'transparent'}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, marginBottom: 6}}>Seq Scan ✗</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginBottom: 8}}>on store_orders</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text, marginBottom: 4}}>
              cost: <span style={{color: C.red, fontWeight: 700, fontSize: 18}}>{seqCost.toFixed(2)}</span>
            </div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>rows: 1,000,000</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>full table scan</div>
          </div>

          {/* Index Scan — low cost (winner) */}
          <div style={{flex: 1, padding: '14px', border: `2px solid ${routeProg > 0.5 ? C.green : C.border}`, borderRadius: 10, background: routeProg > 0.3 ? `${C.green}0d` : 'transparent', boxShadow: routeProg > 0.9 ? `0 0 24px ${C.green}66` : 'none'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Index Scan ✓</div>
              {routeProg > 0.9 ? <Check p={1} size={24} color={C.green} /> : null}
            </div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginBottom: 8}}>using idx_total_amount</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text, marginBottom: 4}}>
              cost: <span style={{color: C.green, fontWeight: 700, fontSize: 18}}>{idxCost.toFixed(2)}</span>
            </div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>rows: ~1000</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.green}}>sel = 0.001</div>
          </div>
        </div>

        {/* Cost comparison bar */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 250, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginBottom: 8}}>cost comparison (log scale)</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.red, width: 80}}>Seq Scan</span>
            <div style={{flex: 1, height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${Math.min(100, 100 - routeProg * 95)}%`, background: C.red, borderRadius: 7}} />
            </div>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.red, fontWeight: 700, width: 70, textAlign: 'right'}}>{seqCost.toFixed(0)}</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.green, width: 80}}>Index Scan</span>
            <div style={{flex: 1, height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${Math.max(5, routeProg * 8)}%`, background: C.green, borderRadius: 7}} />
            </div>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.green, fontWeight: 700, width: 70, textAlign: 'right'}}>{idxCost.toFixed(0)}</span>
          </div>
        </div>

        {/* Winner routing banner */}
        {routeProg > 0.9 ? (
          <div style={{position: 'absolute', left: 18, right: 18, top: 380, padding: '12px 14px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, opacity: clamp(sealP)}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, marginBottom: 4}}>✓ Optimizer routed to: Index Scan</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>selectivity 0.001 · cost reduction {(5432.10 / 12.45).toFixed(0)}× faster · 99.9% rows pruned</div>
          </div>
        ) : null}

        {/* Fast chip */}
        <div style={{position: 'absolute', right: 18, top: 480, opacity: clamp(fastP)}}>
          <Chip color={C.green} style={{fontSize: 16, padding: '6px 16px'}}>
            <Check p={1} size={22} color={C.green} /> {fastP > 0 ? '437× Faster ✓' : '...'}
          </Chip>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>planner · cost-based</span>
          <span>pg_statistic → selectivity</span>
          <span>WINNER: Index Scan</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>pg_statistic · Selectivity 0.001 · Index Scan ✓</div>
        </div>
      </div>

      <Caption text="pg_statistic ──► selectivity 0.001 ──► Optimizer Routes to Index Scan (437× faster)" from={t(150)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
