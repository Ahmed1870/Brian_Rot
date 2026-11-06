import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_VIEW_LINES} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise BI View Integration
// Anchors: 171.0 enterprise | 175.0 BI | 180.0 view | 185.0 dashboard | 192.0 SELECT | 200.0 seal | 205.0 production
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const viewP = clamp(lin(f, t(180), 14));
  const dashP = clamp(lin(f, t(185), 14));
  // SELECT * FROM vw_store_sales_summary query flowing to dashboard
  const flowProg = clamp(lin(f, t(192), sec(8)));
  const sealP = pop(f, t(200));
  const prodP = pop(f, t(205));

  // Bar chart heights (sales by product) — interpolate with flow progress
  const bars = [
    {label: 'Mouse', h: 0.45},
    {label: 'Keyboard', h: 0.78},
    {label: 'Cable', h: 0.32},
    {label: 'Webcam', h: 0.62},
    {label: 'Adapter', h: 0.51},
  ];

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="تكامل العروض في بيئة المؤسسات | Enterprise BI View Integration (vw_store_sales_summary)" from={sec(1)} to={sec(38)} color={C.green} />

      {/* LEFT: Enterprise view editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={820}
          h={300}
          title="Enterprise · CREATE VIEW vw_store_sales_summary (manzooma_store_db)"
          lines={ENTERPRISE_VIEW_LINES.concat([
            '',
            '-- single view joins 3 tables',
            '-- BI tools query this, not base tables',
          ])}
          start={t(171.5)}
          cps={0.45}
          size={14}
          accent={C.green}
          hl={0}
          hlColor={C.green}
        />
      </div>

      {/* View definition chip panel */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 820, opacity: clamp(lin(f, t(180), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Enterprise view characteristics:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>3-table JOIN ✓</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>orders</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>customers</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>products</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>BI-ready ✓</Chip>
        </div>
      </div>

      {/* BI dashboard connection editor */}
      <div style={{position: 'absolute', left: 80, top: 560, width: 820, opacity: clamp(lin(f, t(192), 14))}}>
        <Editor
          x={0}
          y={0}
          w={820}
          h={130}
          title="BI Tool · dashboard query (clean single-line access)"
          lines={[
            'SELECT * FROM vw_store_sales_summary',
            '  WHERE total_amount > 100',
            '  ORDER BY total_amount DESC;',
          ]}
          start={t(192)}
          cps={0.6}
          size={14}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* Seal at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 720, width: 820, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={sealP} size={44} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Enterprise Quality Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>Single source of truth · BI consumes one view · 3 base tables joined once</div>
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', border: `2px solid ${C.blue}`, borderRadius: 999, background: `${C.blue}1a`}}>
            <Check p={prodP} size={22} color={C.blue} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700}}>Production ✓</span>
          </div>
        </div>
      </div>

      {/* RIGHT: BI dashboard panel */}
      <Win x={940} y={170} w={900} h={720} title="BI dashboard ──► powered by vw_store_sales_summary view" accent={C.blue} opacity={dashP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          BI dashboard ──► single view ──► real-time sales by product
        </div>

        <div style={{position: 'absolute', right: 24, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{flowProg > 0.95 ? 'Live ✓' : 'connecting...'}</Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>vw_store_sales_summary</Chip>
        </div>

        {/* SVG: data flow from view to dashboard + chart */}
        <svg width={860} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* View node (top-left) */}
          <rect x={20} y={20} width={260} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.green}44)`}} />
          <text x={150} y={48} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">vw_store_sales_summary</text>
          <text x={150} y={70} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">SELECT * FROM vw_store_sales_summary</text>
          <text x={150} y={88} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">order_id · customer_name · product_name · total_amount</text>

          {/* Flowing data arrow to dashboard */}
          <line x1={280} y1={60} x2={400 + flowProg * 200} y2={60} stroke={C.blue} strokeWidth={3.5} strokeDasharray="8 4" opacity={0.4 + 0.6 * flowProg} />
          <polygon points={`${400 + flowProg * 200 - 8},52 ${400 + flowProg * 200 - 8},68 ${400 + flowProg * 200 + 4},60`} fill={C.blue} />
          <text x={340} y={42} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">data flows ──►</text>

          {/* Dashboard node (top-right) */}
          <rect x={620} y={20} width={220} height={80} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.blue}44)`}} />
          <text x={730} y={48} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">BI Dashboard</text>
          <text x={730} y={70} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">Sales by Product</text>
          <text x={730} y={88} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">real-time · refreshes on view query</text>

          {/* KPI cards row */}
          <g style={{opacity: clamp(pop(f, t(187)))}}>
            <rect x={20} y={140} width={200} height={90} fill={`${C.card}`} stroke={C.green} strokeWidth={2} rx={10} />
            <text x={120} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">TOTAL SALES</text>
            <text x={120} y={200} fill={C.green} fontSize={24} fontFamily={MONO} fontWeight={700} textAnchor="middle">EGP 48,250</text>
            <text x={120} y={220} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">▲ 12.4% vs last week</text>

            <rect x={240} y={140} width={200} height={90} fill={`${C.card}`} stroke={C.blue} strokeWidth={2} rx={10} />
            <text x={340} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">ORDERS</text>
            <text x={340} y={200} fill={C.blue} fontSize={24} fontFamily={MONO} fontWeight={700} textAnchor="middle">182</text>
            <text x={340} y={220} fill={C.blue} fontSize={11} fontFamily={MONO} textAnchor="middle">▲ 8 this week</text>

            <rect x={460} y={140} width={200} height={90} fill={`${C.card}`} stroke={C.purple} strokeWidth={2} rx={10} />
            <text x={560} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">CUSTOMERS</text>
            <text x={560} y={200} fill={C.purple} fontSize={24} fontFamily={MONO} fontWeight={700} textAnchor="middle">94</text>
            <text x={560} y={220} fill={C.purple} fontSize={11} fontFamily={MONO} textAnchor="middle">▲ 5 new</text>

            <rect x={680} y={140} width={160} height={90} fill={`${C.card}`} stroke={C.amber} strokeWidth={2} rx={10} />
            <text x={760} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">AVG ORDER</text>
            <text x={760} y={200} fill={C.amber} fontSize={24} fontFamily={MONO} fontWeight={700} textAnchor="middle">EGP 265</text>
            <text x={760} y={220} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">▲ 3.2%</text>
          </g>

          {/* Bar chart: sales by product */}
          <g style={{opacity: clamp(pop(f, t(189)))}}>
            <text x={20} y={270} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700}>Sales by Product (last 7 days)</text>
            {/* Chart axes */}
            <line x1={50} y1={290} x2={50} y2={540} stroke={C.border} strokeWidth={2} />
            <line x1={50} y1={540} x2={840} y2={540} stroke={C.border} strokeWidth={2} />
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((v, i) => (
              <g key={i}>
                <text x={40} y={545 - i * 62} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="end">{v}%</text>
                <line x1={50} y1={540 - i * 62} x2={840} y2={540 - i * 62} stroke={C.border} strokeWidth={0.5} opacity={0.4} />
              </g>
            ))}
            {/* Bars */}
            {bars.map((bar, i) => {
              const barH = bar.h * 250 * flowProg;
              const x = 90 + i * 150;
              const y = 540 - barH;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={100} height={barH} fill={`url(#barGrad${i})`} rx={4} style={{filter: `drop-shadow(0 0 6px ${[C.green, C.blue, C.purple, C.amber, C.red][i]}66)`}} />
                  <defs>
                    <linearGradient id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={[C.green, C.blue, C.purple, C.amber, C.red][i]} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={[C.green, C.blue, C.purple, C.amber, C.red][i]} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <text x={x + 50} y={560} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{bar.label}</text>
                  <text x={x + 50} y={y - 6} fill={[C.green, C.blue, C.purple, C.amber, C.red][i]} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{Math.round(bar.h * 100)}</text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>vw_store_sales_summary</span>
          <span style={{color: flowProg >= 1 ? C.green : C.amber}}>{flowProg >= 1 ? '✓ dashboard live' : flowProg > 0 ? `connecting... ${Math.round(flowProg * 100)}%` : 'idle'}</span>
          <span style={{color: C.blue}}>production ✓</span>
        </div>
      </Win>

      <Caption text="CREATE VIEW vw_store_sales_summary ──► BI Dashboard ──► SELECT * ──► Production Seal ✓" from={t(192)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
