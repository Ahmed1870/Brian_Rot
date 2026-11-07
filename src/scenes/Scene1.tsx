import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): End-to-End Analytics Pipeline Concept
// Raw relational data → glowing blue 2D pipeline tubes → executive KPI dashboard
// Green badge: "End-to-End Analytics Pipeline Engine"
// Anchors (scene-local seconds):
//   1.0 welcome | 6.0 Analytics Pipeline | 18.0 raw → KPI | 28.0 seal | 35.0 production-ready
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const pipelineP = pop(f, t(6));
  const flowP = pop(f, t(14));
  const sealP = pop(f, t(28));
  const prodP = pop(f, t(35));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  // Data flow progress through pipeline tubes (left → right)
  const flowProg = clamp(lin(f, t(6), sec(20)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="بناء خطوط التحليل والتقارير التنفيذية المعقدة | End-to-End Analytics Pipeline — Module 16" from={sec(2)} to={sec(18)} color={C.green} />

      {/* LEFT: Intro code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="analytics_intro.sql · Manzooma Store V2 (PostgreSQL 16)"
          lines={[
            '-- Lesson 66 · End-to-End Analytics Pipeline',
            'WITH',
            '  monthly_sales AS (...),',
            '  customer_cohorts AS (...),',
            '  growth_metrics AS (...)',
            'SELECT * FROM growth_metrics',
            '  ORDER BY month DESC;',
            '',
            '-- Pipeline: raw orders → CTEs → KPIs',
            '-- Caches results in MATERIALIZED VIEW',
            '-- Module 16: 50% progress · lesson 2 of N',
          ]}
          start={t(1.5)}
          cps={0.55}
          size={15}
          accent={C.blue}
          hl={1}
          hlColor={C.green}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Analytics pipeline golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>Multi-Stage CTEs</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>Window Functions</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>CASE WHEN</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>MATERIALIZED VIEW</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>0.4ms ✓</Chip>
        </div>
      </div>

      {/* Pipeline Engine seal panel */}
      <Win x={80} y={570} w={680} h={330} title="analytics pipeline engine ──► raw data → executive KPIs (green seal)" accent={C.green} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 14, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          raw relational data → CTE stages → window functions → KPI cards → materialized view
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={prodP} size={16} color={C.green} /> Pipeline Engine
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 70}}>
          {/* Raw data source (left) */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <rect x={20} y={40} width={140} height={80} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={90} y={68} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">raw data</text>
            <text x={90} y={86} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">store_orders</text>
            <text x={90} y={102} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">12.6M rows</text>
            <text x={90} y={118} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">raw transactions</text>
          </g>

          {/* Arrow into pipeline */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <line x1={162} y1={80} x2={220} y2={80} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="214,74 214,86 228,80" fill={C.blue} />
            <text x={191} y={70} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">feed</text>
          </g>

          {/* Pipeline tube (center, glowing) */}
          <g style={{opacity: clamp(pipelineP)}}>
            <rect x={230} y={40} width={180} height={80} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={320} y={68} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Analytics Pipeline</text>
            <text x={320} y={88} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">CTEs · Window · CASE</text>
            <text x={320} y={104} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">3-stage transform</text>
            {/* Flowing data dots inside the pipeline */}
            {[0, 1, 2, 3].map((i) => {
              const dotProg = ((flowProg * 4) + i * 0.25) % 1;
              return <circle key={i} cx={240 + dotProg * 160} cy={80} r={3} fill={C.green} style={{filter: `drop-shadow(0 0 4px ${C.green})`}} />;
            })}
          </g>

          {/* Arrow into KPI dashboard */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <line x1={412} y1={80} x2={470} y2={80} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="464,74 464,86 478,80" fill={C.green} />
            <text x={442} y={70} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">render</text>
          </g>

          {/* KPI dashboard (right) */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <rect x={480} y={40} width={140} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={8} />
            <text x={550} y={68} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">KPI dashboard</text>
            <text x={550} y={86} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">CLV · MRR · Churn</text>
            <text x={550} y={102} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">Retention rate</text>
            <text x={550} y={118} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">0.4ms ✓</text>
          </g>

          {/* Bottom: production-ready */}
          <g style={{opacity: clamp(sealP)}}>
            <text x={320} y={170} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✗ before: 10 minutes (raw aggregation per request)</text>
            <text x={320} y={195} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ after: 0.4ms (cached materialized view) · 1500× speedup</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>raw → pipeline</span>
          <span>KPI ✓</span>
        </div>
      </Win>

      {/* RIGHT: Big visualization — pipeline flow with CTE stages */}
      <Win x={800} y={170} w={1040} h={720} title="analytics pipeline flow ──► raw data → CTE stages → window functions → KPI dashboard" accent={C.blue} opacity={clamp(lin(f, t(6), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.blue, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Manzooma Store V2 · 12.6M raw rows → 3 CTE stages → 4 KPI cards · 0.4ms cached execution
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>3 CTE stages</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{flowP > 0.5 ? 'flowing ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={610} style={{position: 'absolute', left: 20, top: 70}}>
          {/* Raw data source (left) */}
          <g style={{opacity: clamp(pop(f, t(6)))}}>
            <rect x={20} y={40} width={180} height={100} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={12} />
            <text x={110} y={68} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">RAW DATA</text>
            <text x={110} y={90} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">store_orders · 12.6M</text>
            <text x={110} y={110} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">store_order_items · 41.2M</text>
            <text x={110} y={128} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">raw transactions</text>
          </g>

          {/* Pipeline tube 1: monthly_sales CTE */}
          <g style={{opacity: clamp(pop(f, t(10)))}}>
            <line x1={202} y1={90} x2={260} y2={90} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="254,84 254,96 268,90" fill={C.blue} />
            <rect x={270} y={50} width={180} height={80} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${6 + pulse * 4}px ${C.blue})`}} />
            <text x={360} y={78} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">CTE 1 · monthly_sales</text>
            <text x={360} y={98} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">GROUP BY month, customer</text>
            <text x={360} y={116} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">SUM(total_amount) AS revenue</text>
            {/* Flowing dots */}
            {[0, 1, 2].map((i) => {
              const p = ((flowProg * 3) + i * 0.33) % 1;
              return <circle key={i} cx={280 + p * 160} cy={90} r={3} fill={C.green} style={{filter: `drop-shadow(0 0 4px ${C.green})`}} />;
            })}
          </g>

          {/* Pipeline tube 2: customer_cohorts CTE (purple) */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <line x1={452} y1={90} x2={510} y2={90} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="504,84 504,96 518,90" fill={C.purple} />
            <rect x={520} y={50} width={180} height={80} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${6 + pulse * 4}px ${C.purple})`}} />
            <text x={610} y={78} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">CTE 2 · cohorts</text>
            <text x={610} y={98} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">NTILE(4) · cohort_id</text>
            <text x={610} y={116} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">LAG · SUM OVER window</text>
          </g>

          {/* Pipeline tube 3: growth_metrics CTE (green) */}
          <g style={{opacity: clamp(pop(f, t(18)))}}>
            <line x1={702} y1={90} x2={760} y2={90} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="754,84 754,96 768,90" fill={C.green} />
            <rect x={770} y={50} width={200} height={80} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${6 + pulse * 4}px ${C.green})`}} />
            <text x={870} y={78} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">CTE 3 · growth_metrics</text>
            <text x={870} y={98} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">CASE WHEN growth_pct</text>
            <text x={870} y={116} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">cumulative_revenue</text>
          </g>

          {/* Materialized view (bottom center) */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <line x1={870} y1={132} x2={870} y2={170} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="864,164 876,164 870,178" fill={C.green} />
            <rect x={620} y={180} width={500} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.green})`}} />
            <text x={870} y={210} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE MATERIALIZED VIEW mv_executive_summary</text>
            <text x={870} y={232} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">cached · REFRESH CONCURRENTLY · 0.4ms query</text>
          </g>

          {/* KPI cards (4 cards at bottom) */}
          <g style={{opacity: clamp(pop(f, t(24)))}}>
            <text x={400} y={290} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Executive KPI Dashboard · 4 cards</text>
            {[
              {name: 'CLV', value: 'EGP 4,820', color: C.green, x: 30},
              {name: 'MRR', value: 'EGP 1.24M', color: C.blue, x: 240},
              {name: 'Churn', value: '3.2%', color: C.amber, x: 450},
              {name: 'Retention', value: '94.1%', color: C.green, x: 660},
            ].map((k, i) => {
              const kP = clamp(pop(f, t(24 + i * 0.6)));
              return (
                <g key={i} style={{opacity: clamp(kP), transform: `translate(0, ${(1 - kP) * 20}px)`}}>
                  <rect x={k.x} y={310} width={200} height={90} fill={`${k.color}22`} stroke={k.color} strokeWidth={2.5} rx={10} style={{filter: `drop-shadow(0 0 6px ${k.color}66)`}} />
                  <text x={k.x + 100} y={338} fill={k.color} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.name}</text>
                  <text x={k.x + 100} y={365} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.value}</text>
                  <text x={k.x + 100} y={386} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">✓ auto-calculated</text>
                </g>
              );
            })}
          </g>

          {/* Production-ready footer */}
          {flowProg > 0.7 ? (
            <g style={{opacity: clamp(pop(f, t(28)))}}>
              <rect x={150} y={440} width={700} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={472} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Pipeline Sealed · raw → CTEs → window functions → KPIs · 0.4ms cached</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={500} y={530} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">
            {f < t(6) ? 'raw data ready · pipeline offline' :
              f < t(20) ? 'pumping through CTE stages...' :
              '✓ pipeline live · 4 KPIs rendered · production-ready'}
          </text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>raw data</span>
          <span style={{color: C.blue}}>CTEs · window</span>
          <span style={{color: C.green}}>KPIs · 0.4ms ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Analytics Pipeline · Sealed ✓</div>
        </div>
      </div>

      {/* Production chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(prodP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={prodP} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>Pipeline Engine · 0.4ms ✓</div>
        </div>
      </div>

      <Caption text="raw data ──► CTE stages ──► window functions ──► CASE WHEN ──► KPI cards ──► materialized view ──► 0.4ms ✓" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
