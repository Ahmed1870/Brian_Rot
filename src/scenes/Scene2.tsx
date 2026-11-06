import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {PERF_BENCHMARK} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Performance Benchmark — Standard View re-computes (4.8s) vs Materialized View reads disk cache (0.4ms)
// Anchors: 41.0 standard | 45.0 re-compute | 52.0 materialized | 60.0 cache | 68.0 0.4ms | 75.0 green | 80.0 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(45), 14));
  // Standard view re-computation progress (slow)
  const recomputeProg = clamp(lin(f, t(45), sec(8)));
  // Materialized view cache-read progress (instant)
  const cacheProg = clamp(lin(f, t(60), sec(4)));
  const fastP = pop(f, t(68));
  const greenP = pop(f, t(75));
  const sealP = pop(f, t(80));

  // Standard clock: red hand sweeps 4.8s worth (slow)
  const stdClockAngle = recomputeProg * 360;
  // Materialized clock: green hand snaps instantly
  const matClockAngle = cacheProg > 0.05 ? 360 : 0;

  // Standard view execution time elapsed
  const stdMs = Math.round(recomputeProg * PERF_BENCHMARK.standardViewMs);
  // Materialized view execution time elapsed (jumps to 0.4ms)
  const matMs = cacheProg > 0.05 ? PERF_BENCHMARK.materializedViewMs : 0;

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="مقارنة الأداء | Performance Benchmark — Standard View (4.8s) vs Materialized View (0.4ms)" from={sec(2)} to={sec(40)} color={C.green} />

      {/* LEFT: Standard View — re-computes query on every read (4.8s) */}
      <Win x={80} y={170} w={860} h={720} title="standard view ──► re-computes JOIN + GROUP BY on every read (4.8s)" accent={C.red} opacity={leftP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
          every read re-runs the full query ──► 4.8s execution time ──► slow
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>Standard View</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{recomputeProg > 0.05 && recomputeProg < 0.99 ? 'Re-computing...' : 'idle'}</Chip>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>Slow ✗</Chip>
        </div>

        {/* Standard view query editor (red) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 56}}>
          <Editor
            x={0}
            y={0}
            w={824}
            h={210}
            title="standard_view.sql · re-computes on every SELECT"
            lines={[
              'CREATE VIEW vw_region_sales AS',
              '  SELECT region, SUM(total_amount) AS total',
              '  FROM store_orders',
              '  GROUP BY region;',
              '',
              'SELECT * FROM vw_region_sales;',
            ]}
            start={t(41.5)}
            cps={0.5}
            size={14}
            accent={C.red}
            hl={5}
            hlColor={C.red}
          />
        </div>

        {/* SVG: red clock + re-computation cycle */}
        <svg width={824} height={360} style={{position: 'absolute', left: 18, top: 290}}>
          {/* Red clock (left side) */}
          <g style={{opacity: clamp(pop(f, t(45)))}}>
            <circle cx={180} cy={140} r={90} fill={`${C.red}11`} stroke={C.red} strokeWidth={4} style={{filter: `drop-shadow(0 0 12px ${C.red}66)`}} />
            {/* Clock ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const rad = (deg - 90) * Math.PI / 180;
              return (
                <line key={i} x1={180 + 80 * Math.cos(rad)} y1={140 + 80 * Math.sin(rad)} x2={180 + 88 * Math.cos(rad)} y2={140 + 88 * Math.sin(rad)} stroke={C.red} strokeWidth={2} opacity={0.6} />
              );
            })}
            {/* Spinning hand */}
            <line x1={180} y1={140} x2={180 + 60 * Math.cos((stdClockAngle - 90) * Math.PI / 180)} y2={140 + 60 * Math.sin((stdClockAngle - 90) * Math.PI / 180)} stroke={C.red} strokeWidth={4} strokeLinecap="round" />
            <circle cx={180} cy={140} r={6} fill={C.red} />
            <text x={180} y={258} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">re-computing...</text>
            <text x={180} y={278} fill={C.red} fontSize={22} fontFamily={MONO} fontWeight={700} textAnchor="middle">{stdMs}ms</text>
          </g>

          {/* Re-computation cycle text (right side) */}
          <g style={{opacity: clamp(pop(f, t(48)))}}>
            <text x={460} y={70} fill={C.red} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">every SELECT re-runs:</text>
            {/* Steps */}
            <rect x={360} y={90} width={240} height={36} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={6} />
            <text x={480} y={113} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">1. parse + plan</text>
            <rect x={360} y={132} width={240} height={36} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={6} />
            <text x={480} y={155} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">2. scan store_orders</text>
            <rect x={360} y={174} width={240} height={36} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={6} />
            <text x={480} y={197} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">3. GROUP BY region</text>
            <rect x={360} y={216} width={240} height={36} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={6} />
            <text x={480} y={239} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">4. SUM(total_amount)</text>
            <text x={480} y={280} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⏱ 4.8 seconds total</text>
          </g>

          {/* Result row count */}
          <g style={{opacity: clamp(pop(f, t(55)))}}>
            <rect x={120} y={310} width={580} height={36} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={8} />
            <text x={410} y={333} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚠ slow · 4.8s execution · re-computes every read · CPU heavy</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>standard view</span>
          <span>re-compute ✗</span>
          <span>4.8s ✗</span>
        </div>
      </Win>

      {/* RIGHT: Materialized View — reads pre-computed disk cache (0.4ms) */}
      <Win x={980} y={170} w={860} h={720} title="materialized view ──► reads pre-computed disk cache (0.4ms)" accent={C.green} opacity={rightP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          cache read instantly ──► 0.4ms execution ──► 12000× faster
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>Materialized View</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{cacheProg > 0.05 && cacheProg < 0.99 ? 'Cache hit...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>Fast ✓</Chip>
        </div>

        {/* Materialized view query editor (green) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 56}}>
          <Editor
            x={0}
            y={0}
            w={824}
            h={210}
            title="materialized_view.sql · reads pre-computed cache"
            lines={[
              'CREATE MATERIALIZED VIEW mv_sales AS',
              '  SELECT region, SUM(total_amount) AS total',
              '  FROM store_orders',
              '  GROUP BY region;',
              '',
              'SELECT * FROM mv_sales;',
            ]}
            start={t(52)}
            cps={0.5}
            size={14}
            accent={C.green}
            hl={5}
            hlColor={C.green}
          />
        </div>

        {/* SVG: green clock + cache read */}
        <svg width={824} height={360} style={{position: 'absolute', left: 18, top: 290}}>
          {/* Green clock (left side) - snaps instantly */}
          <g style={{opacity: clamp(pop(f, t(60)))}}>
            <circle cx={180} cy={140} r={90} fill={`${C.green}11`} stroke={C.green} strokeWidth={4} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            {/* Clock ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const rad = (deg - 90) * Math.PI / 180;
              return (
                <line key={i} x1={180 + 80 * Math.cos(rad)} y1={140 + 80 * Math.sin(rad)} x2={180 + 88 * Math.cos(rad)} y2={140 + 88 * Math.sin(rad)} stroke={C.green} strokeWidth={2} opacity={0.6} />
              );
            })}
            {/* Snapped hand (instant) */}
            <line x1={180} y1={140} x2={180 + 60 * Math.cos((matClockAngle - 90) * Math.PI / 180)} y2={140 + 60 * Math.sin((matClockAngle - 90) * Math.PI / 180)} stroke={C.green} strokeWidth={4} strokeLinecap="round" />
            <circle cx={180} cy={140} r={6} fill={C.green} />
            <text x={180} y={258} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">cache read ✓</text>
            <text x={180} y={278} fill={C.green} fontSize={22} fontFamily={MONO} fontWeight={700} textAnchor="middle">{matMs}ms</text>
          </g>

          {/* Cache hit steps (right side) */}
          <g style={{opacity: clamp(pop(f, t(62)))}}>
            <text x={460} y={70} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">cache read instantly:</text>
            <rect x={360} y={90} width={240} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={480} y={113} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">1. read mv_sales</text>
            <rect x={360} y={132} width={240} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={480} y={155} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">2. return cached rows</text>
            <rect x={360} y={174} width={240} height={36} fill={`${C.green}11`} stroke={C.border} strokeWidth={2} strokeDasharray="4 4" rx={6} opacity={0.4} />
            <text x={480} y={197} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">3. ✗ (skipped)</text>
            <rect x={360} y={216} width={240} height={36} fill={`${C.green}11`} stroke={C.border} strokeWidth={2} strokeDasharray="4 4" rx={6} opacity={0.4} />
            <text x={480} y={239} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">4. ✗ (skipped)</text>
            <text x={480} y={280} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚡ 0.4ms total · 12000× faster</text>
          </g>

          {/* Fast result banner */}
          <g style={{opacity: clamp(fastP)}}>
            <rect x={120} y={310} width={580} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 10px ${C.green}66)`}} />
            <text x={410} y={333} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ fast · 0.4ms execution · pre-computed cache · zero CPU</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>materialized view</span>
          <span style={{color: C.green}}>cache hit ✓</span>
          <span style={{color: C.green}}>0.4ms ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-center */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 910, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 32px ${C.green}44`}}>
          <Check p={sealP} size={48} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Performance Benchmark Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>Standard View 4.8s vs Materialized View 0.4ms · 12000× faster · pre-computed cache wins</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16, padding: '6px 16px', border: `2px solid ${C.green}`, borderRadius: 999, background: `${C.green}1a`}}>
            <Check p={greenP} size={22} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>0.4ms ✓</span>
          </div>
        </div>
      </div>

      <Caption text="Standard View 4.8s ──► Re-Compute ──► Materialized View 0.4ms ──► Cache Hit ──► 12000× Faster ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
