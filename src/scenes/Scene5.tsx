import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_PIPELINE_CODE, EXECUTIVE_DASHBOARD} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Executive Dashboard Deployment on manzooma_store_v2
// REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_kpis → 0.4ms query · 1500× speedup
// Module 16 50% Capstone seal expands
// Anchors (scene-local seconds):
//   171.0 manzooma_store_v2 | 175.0 REFRESH | 180.0 SELECT dashboard | 190.0 0.4ms | 200.0 Module 16 50% Seal
const S = START.s5;
const t = (g: number) => sec(g - S);

interface DashboardRow {
  month: string;
  mrr: string;
  cumulative: string;
  growth: string;
  retention: string;
  topProduct: string;
  isLatest: boolean;
}

const DASHBOARD_ROWS: DashboardRow[] = [
  {month: '2025-11', mrr: 'EGP 1.24M', cumulative: 'EGP 14.8M', growth: '+8.7%', retention: '94.1%', topProduct: 'Manzooma Pro 16"', isLatest: true},
  {month: '2025-10', mrr: 'EGP 1.14M', cumulative: 'EGP 13.6M', growth: '+5.2%', retention: '93.4%', topProduct: 'Manzooma Pro 16"', isLatest: false},
  {month: '2025-09', mrr: 'EGP 1.08M', cumulative: 'EGP 12.4M', growth: '+3.1%', retention: '92.8%', topProduct: 'Manzooma Air 13"', isLatest: false},
  {month: '2025-08', mrr: 'EGP 1.05M', cumulative: 'EGP 11.3M', growth: '+2.4%', retention: '92.1%', topProduct: 'Manzooma Air 13"', isLatest: false},
  {month: '2025-07', mrr: 'EGP 1.02M', cumulative: 'EGP 10.3M', growth: '+1.8%', retention: '91.5%', topProduct: 'Manzooma Mini', isLatest: false},
  {month: '2025-06', mrr: 'EGP 1.00M', cumulative: 'EGP 9.3M', growth: '+0.9%', retention: '90.9%', topProduct: 'Manzooma Mini', isLatest: false},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171), 14));
  const depP = pop(f, t(171));
  const refP = pop(f, t(175));
  const dashP = pop(f, t(180));
  const fastP = pop(f, t(190));
  const sealP = pop(f, t(200));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Query execution progress
  const queryProg = clamp(lin(f, t(180), sec(8)));
  // Row reveal progress
  const rowReveal = clamp(lin(f, t(184), sec(8)));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيقات المؤسسية | Executive Dashboard · pipeline_executive_kpis · mv_daily_kpis (Module 16)" from={sec(2)} to={sec(38)} color={C.green} />

      {/* LEFT: Enterprise pipeline code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={860}
          h={460}
          title="pipeline_executive_kpis.sql · REFRESH + SELECT dashboard (manzooma_store_v2)"
          lines={ENTERPRISE_PIPELINE_CODE}
          start={t(171)}
          cps={0.5}
          size={14}
          accent={C.green}
          hl={2}
          hlColor={C.amber}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 645, width: 860, opacity: clamp(depP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Module 16 capstone — 50% progress · executive analytics pipeline live</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>REFRESH CONCURRENTLY</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>mv_daily_kpis</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>0.4ms execution</Chip>
          <Chip color={C.red} style={{fontSize: 14, padding: '4px 12px'}}>10 min → 0.4s = 1500×</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>Module 16 · 50% ✓</Chip>
        </div>
      </div>

      {/* Module 16 50% Capstone Seal */}
      <Win x={80} y={725} w={860} h={220} title="module 16 50% capstone seal ──► executive analytics pipeline mastered" accent={C.green} opacity={clamp(sealP)}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 22px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Check p={sealP} size={64} color={C.green} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 26, color: C.green, fontWeight: 700}}>Module 16 · 50% Capstone Seal ✓</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 4}}>Executive Analytics Pipeline · CTEs · Window Functions · Materialized View · Parallel Workers · 1500× speedup</div>
            </div>
          </div>
          {/* Progress bar at 50% */}
          <div style={{width: '100%', height: 18, borderRadius: 9, background: C.deep, overflow: 'hidden', border: `2px solid ${C.green}`}}>
            <div style={{width: `${0.5 * sealP * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 9, boxShadow: `0 0 ${10 + pulse * 6}px ${C.green}`}} />
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>pipeline_executive_kpis live · {EXECUTIVE_DASHBOARD.afterMs}ms · {EXECUTIVE_DASHBOARD.uptime} uptime · production-ready · Module 16 at 50%</div>
        </div>
      </Win>

      {/* RIGHT: Executive KPI Dashboard */}
      <Win x={960} y={170} w={880} h={780} title="executive dashboard ──► mv_daily_kpis · 6 months · 0.4ms cached execution" accent={C.green} opacity={clamp(lin(f, t(175), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Manzooma Store V2 · executive KPI dashboard · 6 months cached · {EXECUTIVE_DASHBOARD.afterMs}ms
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{queryProg > 0.05 && queryProg < 0.99 ? 'querying...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{queryProg > 0.95 ? `${EXECUTIVE_DASHBOARD.afterMs}ms ✓` : '...'}</Chip>
        </div>

        <svg width={840} height={680} style={{position: 'absolute', left: 18, top: 70}}>
          {/* 4 KPI mini-cards (top) */}
          <g style={{opacity: clamp(dashP)}}>
            {[
              {label: 'Monthly Revenue', value: EXECUTIVE_DASHBOARD.monthlyRevenue, color: C.green, x: 20},
              {label: 'Retention Rate', value: EXECUTIVE_DASHBOARD.retentionRate, color: C.blue, x: 220},
              {label: 'Top Product', value: EXECUTIVE_DASHBOARD.topProduct, color: C.amber, x: 420},
              {label: 'Last Refresh', value: EXECUTIVE_DASHBOARD.lastRefresh, color: C.purple, x: 620},
            ].map((k, i) => {
              const p = clamp(pop(f, t(180 + i * 0.5)));
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(0, ${(1 - p) * 14}px)`}}>
                  <rect x={k.x} y={10} width={200} height={70} fill={`${k.color}22`} stroke={k.color} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 6px ${k.color}66)`}} />
                  <text x={k.x + 100} y={32} fill={k.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.label}</text>
                  <text x={k.x + 100} y={56} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.value}</text>
                </g>
              );
            })}
          </g>

          {/* Dashboard results table */}
          <g style={{opacity: clamp(dashP)}}>
            {/* Header */}
            <rect x={20} y={100} width={800} height={32} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1} rx={6} />
            <text x={50} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">MONTH</text>
            <text x={180} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">MRR</text>
            <text x={320} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">CUMULATIVE</text>
            <text x={470} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">GROWTH</text>
            <text x={600} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">RETENTION</text>
            <text x={750} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">TOP PRODUCT</text>

            {/* Rows */}
            {DASHBOARD_ROWS.map((row, i) => {
              const p = clamp(rowReveal - i * 0.12);
              const isLatest = row.isLatest;
              const rowColor = isLatest ? C.green : C.border;
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 30}px, 0)`}}>
                  <rect x={20} y={136 + i * 50} width={800} height={44} fill={isLatest ? `${C.green}22` : `${C.deep}88`} stroke={rowColor} strokeWidth={isLatest ? 2 : 1} rx={6} />
                  <text x={50} y={162 + i * 50} fill={isLatest ? C.green : C.text} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.month}</text>
                  <text x={180} y={162 + i * 50} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.mrr}</text>
                  <text x={320} y={162 + i * 50} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{row.cumulative}</text>
                  <text x={470} y={162 + i * 50} fill={row.growth.startsWith('+') ? C.green : C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.growth}</text>
                  <text x={600} y={162 + i * 50} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.retention}</text>
                  <text x={750} y={162 + i * 50} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">{row.topProduct}</text>
                  {isLatest ? (
                    <g>
                      <rect x={770} y={148 + i * 50} width={36} height={20} fill={`${C.green}33`} stroke={C.green} strokeWidth={1.5} rx={4} />
                      <text x={788} y={162 + i * 50} fill={C.green} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">LIVE</text>
                    </g>
                  ) : null}
                </g>
              );
            })}
          </g>

          {/* Performance footer */}
          <g style={{opacity: clamp(fastP)}}>
            <rect x={20} y={460} width={800} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={420} y={488} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ {EXECUTIVE_DASHBOARD.afterMs}ms execution · 1500× speedup over raw aggregation</text>
            <text x={420} y={510} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">10 minutes → 0.4 seconds · production-ready · executive leadership certified</text>
          </g>

          {/* Module 16 50% progress footer */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={555} width={800} height={80} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={420} y={580} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Module 16 · Capstone Project & Portfolio — 50% Complete</text>
            <rect x={120} y={595} width={600} height={14} fill={C.deep} stroke={C.green} strokeWidth={1} rx={4} />
            <rect x={120} y={595} width={300 * sealP} height={14} fill={C.green} rx={4} style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
            <text x={420} y={625} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">Lesson 66 of Module 16 · analytics pipeline mastered · ready for Lesson 67</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>REFRESH CONCURRENTLY</span>
          <span style={{color: C.green}}>{EXECUTIVE_DASHBOARD.afterMs}ms · 1500× faster</span>
          <span style={{color: C.green}}>Module 16 · 50% ✓</span>
        </div>
      </Win>

      <Caption text="pipeline_executive_kpis ──► REFRESH CONCURRENTLY ──► mv_daily_kpis ──► 0.4ms ──► 1500× speedup ──► Module 16 50% ✓" from={t(180)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
