import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {CUSTOMER_SPENDING, NTILE_QUARTILES, REGION_SLA} from '../data';

// SC05 (170-210s): Enterprise Customer Quartiles & Logistics P95 SLA Dashboard
// Anchors (s): 171.0 enterprise | 175.0 NTILE(4) CTE | 180.0 PERCENTILE_CONT(0.95) | 185.0 P95 SLA | 192.0 logistics | 200.0 dashboard | 205.0 executive
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const dashboardP = clamp(lin(f, t(185), 16));
  const sealP = pop(f, t(200));

  // Dashboard progressive reveal
  const revealProg = clamp(lin(f, t(186), sec(18)));
  const visibleQuartiles = Math.max(1, Math.floor(revealProg * 4));
  const visibleRegions = Math.max(1, Math.floor(revealProg * REGION_SLA.length));

  const qColors = [C.green, C.blue, C.amber, C.purple];
  const qLabels = ['VIP', 'High', 'Mid', 'Low'];

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | RFM Quartiles & P95 SLA Dashboard" from={sec(1)} to={sec(38)} color={C.green} />

      <Editor
        x={80}
        y={170}
        w={880}
        h={300}
        title="Enterprise CTE · manzooma_store_db"
        lines={[
          'WITH CustomerQuartiles AS (',
          '  SELECT customer_id, total_spent,',
          '         NTILE(4) OVER(ORDER BY total_spent DESC)',
          '           AS quartile',
          '  FROM customer_stats',
          ')',
          'SELECT region_id,',
          '  PERCENTILE_CONT(0.95) WITHIN GROUP',
          '    (ORDER BY delivery_hours) AS p95_sla',
          'FROM delivery_logs GROUP BY region_id;',
        ]}
        start={t(171.5)}
        cps={0.6}
        size={15}
        hl={f >= t(175) ? 2 : -1}
        hlColor={f >= t(180) ? C.green : C.purple}
      />

      {/* Report panel right of editor */}
      <Win x={1000} y={170} w={840} h={280} title="executive report · RFM + P95 SLA" accent={C.green} opacity={clamp(lin(f, t(192), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          VIP Cohorts & Delivery Percentiles
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 48, right: 24, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.purple}>NTILE(4) quartiles</Chip>
          <Chip color={C.green}>P95 SLA</Chip>
          <Chip color={C.amber}>GROUP BY region</Chip>
          <Chip color={C.blue}>CTE pipeline</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>
            executive benchmarking ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* Dashboard — customer quartiles (left) */}
      <Win x={80} y={470} w={880} h={420} title="customer quartiles · NTILE(4)" accent={C.purple} opacity={dashboardP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.purple}}>
          RFM customer tiering
        </div>
        <div style={{position: 'absolute', left: 18, right: 18, top: 50, display: 'flex', gap: 14}}>
          {[0, 1, 2, 3].map((qi) => {
            const visible = qi < visibleQuartiles;
            const count = qi < 2 ? 3 : 2;
            const totalSpent = CUSTOMER_SPENDING.filter((_, i) => NTILE_QUARTILES[i] === qi + 1).reduce((a, c) => a + c.total_spent, 0);
            return (
              <div key={qi} dir="ltr" style={{flex: 1, padding: '14px 12px', border: `2px solid ${qColors[qi]}`, borderRadius: 12, background: visible ? `${qColors[qi]}0d` : 'transparent', opacity: visible ? 1 : 0.3, transform: visible ? 'translateY(0)' : 'translateY(20px)'}}>
                <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: qColors[qi], textAlign: 'center'}}>Q{qi + 1}</div>
                <div style={{fontFamily: MONO, fontSize: 14, color: C.muted, textAlign: 'center', marginTop: 4}}>{qLabels[qi]}</div>
                <div style={{fontFamily: MONO, fontSize: 16, color: C.text, textAlign: 'center', marginTop: 8, fontWeight: 700}}>{count} customers</div>
                <div style={{fontFamily: MONO, fontSize: 14, color: C.muted, textAlign: 'center', marginTop: 4}}>${totalSpent.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
        {/* VIP highlight bar */}
        {visibleQuartiles >= 1 ? (
          <div style={{position: 'absolute', left: 18, right: 18, bottom: 60, padding: '12px 18px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`, opacity: clamp(pop(f, t(195)))}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Q1 VIP = top 25% spenders isolated ✓</div>
          </div>
        ) : null}
        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>NTILE(4) OVER(ORDER BY total_spent DESC)</span>
          <span>{visibleQuartiles}/4 quartiles</span>
        </div>
      </Win>

      {/* Dashboard — P95 SLA per region (right) */}
      <Win x={1000} y={470} w={840} h={420} title="logistics P95 SLA · PERCENTILE_CONT(0.95)" accent={C.green} opacity={dashboardP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          delivery hours P95 per region
        </div>
        <div style={{position: 'absolute', left: 18, right: 18, top: 50, bottom: 60}}>
          {REGION_SLA.map((r, i) => {
            const visible = i < visibleRegions;
            const isOverSla = r.p95_sla > 5.0;
            const color = isOverSla ? C.red : C.green;
            const maxSla = Math.max(...REGION_SLA.map((s) => s.p95_sla));
            const barW = (r.p95_sla / maxSla) * 100;
            return (
              <div key={r.region} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0', opacity: visible ? 1 : 0.3, transform: visible ? 'translateX(0)' : 'translateX(20px)'}}>
                <span style={{fontFamily: MONO, fontSize: 18, color: C.blue, width: 120}}>{r.region}</span>
                <div style={{flex: 1, height: 24, borderRadius: 12, background: C.deep, border: `1px solid ${C.border}`, overflow: 'hidden', position: 'relative'}}>
                  <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: visible ? `${barW}%` : '0%', background: color, borderRadius: 12, transition: 'none'}} />
                </div>
                <span style={{fontFamily: MONO, fontSize: 20, fontWeight: 700, color, width: 80, textAlign: 'right'}}>{r.p95_sla.toFixed(1)}h</span>
                <span style={{fontFamily: MONO, fontSize: 14, color: C.muted, width: 80, textAlign: 'right'}}>{r.deliveries} del.</span>
              </div>
            );
          })}
        </div>
        {/* SLA threshold indicator */}
        <div style={{position: 'absolute', left: 18, right: 18, bottom: 60, padding: '10px 14px', border: `2px solid ${C.amber}`, borderRadius: 10, background: `${C.amber}0d`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.amber, fontWeight: 700}}>SLA threshold: 5.0h · red = over limit</div>
        </div>
        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>PERCENTILE_CONT(0.95) WITHIN GROUP</span>
          <span>{visibleRegions}/{REGION_SLA.length} regions</span>
        </div>
      </Win>

      <Caption text="Enterprise Analytics ──► RFM Customer Quartiles & Logistics P95 SLA" from={t(175)} to={t(195)} />
      <Caption text="Executive Benchmarking ──► Isolates VIP Cohorts & Service Delivery Percentiles" from={t(197)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
