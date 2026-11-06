import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_MVIEW_LINES} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Caching Capstone — BI dashboard reads pre-computed monthly figures in 0.4ms
// Anchors: 171.0 enterprise | 175.0 caching | 180.0 monthly | 185.0 dashboard | 192.0 0.4ms | 200.0 module 14 seal | 205.0 complete
const S = START.s5;
const t = (g: number) => sec(g - S);

// Monthly revenue bar data
const MONTHLY_BARS = [
  {label: 'Jan', h: 0.42},
  {label: 'Feb', h: 0.58},
  {label: 'Mar', h: 0.71},
  {label: 'Apr', h: 0.55},
  {label: 'May', h: 0.83},
  {label: 'Jun', h: 0.92},
  {label: 'Jul', h: 0.68},
  {label: 'Aug', h: 0.77},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const cacheP = clamp(lin(f, t(175), 14));
  const dashP = clamp(lin(f, t(185), 14));
  // SELECT * FROM mv_store_monthly_performance → 0.4ms response
  const flowProg = clamp(lin(f, t(192), sec(8)));
  const sealP = pop(f, t(200));
  const doneP = pop(f, t(205));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="كاشينج المؤسسات | Enterprise Caching Capstone (mv_store_monthly_performance · Module 14 Mastery)" from={sec(1)} to={sec(38)} color={C.green} />

      {/* LEFT: Enterprise MV editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={820}
          h={300}
          title="Enterprise · CREATE MATERIALIZED VIEW mv_store_monthly_performance"
          lines={ENTERPRISE_MVIEW_LINES.concat([
            '',
            '-- pre-computes monthly revenue per product',
            '-- UNIQUE INDEX enables REFRESH CONCURRENTLY',
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
      <div style={{position: 'absolute', left: 80, top: 490, width: 820, opacity: clamp(cacheP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Enterprise materialized view characteristics:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>DATE_TRUNC month ✓</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>SUM revenue ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>UNIQUE INDEX ✓</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>Heap + B-Tree ✓</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>CONCURRENTLY ✓</Chip>
        </div>
      </div>

      {/* BI dashboard connection editor */}
      <div style={{position: 'absolute', left: 80, top: 560, width: 820, opacity: clamp(lin(f, t(192), 14))}}>
        <Editor
          x={0}
          y={0}
          w={820}
          h={130}
          title="BI Tool · dashboard query (reads pre-computed cache in 0.4ms)"
          lines={[
            'SELECT month, product_id, revenue',
            '  FROM mv_store_monthly_performance',
            '  ORDER BY month DESC;',
          ]}
          start={t(192)}
          cps={0.6}
          size={14}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* Module 14 Mastery Seal at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 720, width: 820, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={sealP} size={44} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Module 14 Mastery Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>Materialized Views · Pre-Computed Cache · REFRESH CONCURRENTLY · Heap + B-Tree · Enterprise caching</div>
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', border: `2px solid ${C.green}`, borderRadius: 999, background: `${C.green}1a`}}>
            <Check p={doneP} size={22} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Complete ✓</span>
          </div>
        </div>
      </div>

      {/* RIGHT: BI dashboard panel */}
      <Win x={940} y={170} w={900} h={720} title="BI dashboard ──► powered by mv_store_monthly_performance (0.4ms cache read)" accent={C.blue} opacity={dashP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          BI dashboard ──► reads pre-computed monthly figures ──► 0.4ms response time
        </div>

        <div style={{position: 'absolute', right: 24, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{flowProg > 0.95 ? 'Live ✓' : 'connecting...'}</Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>mv_store_monthly_performance</Chip>
        </div>

        {/* SVG: data flow + KPIs + monthly chart */}
        <svg width={860} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* MV node (top-left) */}
          <rect x={20} y={20} width={280} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.green}44)`}} />
          <text x={160} y={48} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">mv_store_monthly_performance</text>
          <text x={160} y={70} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">month · product_id · revenue</text>
          <text x={160} y={88} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">pre-computed · cached on disk · B-Tree indexed</text>

          {/* Flowing data arrow to dashboard */}
          <line x1={300} y1={60} x2={400 + flowProg * 200} y2={60} stroke={C.blue} strokeWidth={3.5} strokeDasharray="8 4" opacity={0.4 + 0.6 * flowProg} />
          <polygon points={`${400 + flowProg * 200 - 8},52 ${400 + flowProg * 200 - 8},68 ${400 + flowProg * 200 + 4},60`} fill={C.blue} />
          <text x={340} y={42} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">0.4ms cache read ──►</text>

          {/* Dashboard node (top-right) */}
          <rect x={620} y={20} width={220} height={80} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.blue}44)`}} />
          <text x={730} y={48} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">BI Dashboard</text>
          <text x={730} y={70} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">Monthly Revenue</text>
          <text x={730} y={88} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">real-time · cache-backed</text>

          {/* KPI cards row */}
          <g style={{opacity: clamp(pop(f, t(187)))}}>
            <rect x={20} y={140} width={200} height={90} fill={`${C.card}`} stroke={C.green} strokeWidth={2} rx={10} />
            <text x={120} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">QUERY TIME</text>
            <text x={120} y={200} fill={C.green} fontSize={26} fontFamily={MONO} fontWeight={700} textAnchor="middle">0.4ms</text>
            <text x={120} y={220} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">▲ 12000× faster than live</text>

            <rect x={240} y={140} width={200} height={90} fill={`${C.card}`} stroke={C.blue} strokeWidth={2} rx={10} />
            <text x={340} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">MONTHLY REVENUE</text>
            <text x={340} y={200} fill={C.blue} fontSize={24} fontFamily={MONO} fontWeight={700} textAnchor="middle">EGP 2.4M</text>
            <text x={340} y={220} fill={C.blue} fontSize={11} fontFamily={MONO} textAnchor="middle">▲ 18.2% YoY</text>

            <rect x={460} y={140} width={200} height={90} fill={`${C.card}`} stroke={C.purple} strokeWidth={2} rx={10} />
            <text x={560} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">PRODUCTS TRACKED</text>
            <text x={560} y={200} fill={C.purple} fontSize={24} fontFamily={MONO} fontWeight={700} textAnchor="middle">148</text>
            <text x={560} y={220} fill={C.purple} fontSize={11} fontFamily={MONO} textAnchor="middle">across 8 months</text>

            <rect x={680} y={140} width={160} height={90} fill={`${C.card}`} stroke={C.amber} strokeWidth={2} rx={10} />
            <text x={760} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">REFRESH</text>
            <text x={760} y={200} fill={C.amber} fontSize={22} fontFamily={MONO} fontWeight={700} textAnchor="middle">CONCURRENTLY</text>
            <text x={760} y={220} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">non-blocking ✓</text>
          </g>

          {/* Bar chart: monthly revenue */}
          <g style={{opacity: clamp(pop(f, t(189)))}}>
            <text x={20} y={270} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700}>Monthly Revenue (last 8 months · from cache)</text>
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
            {MONTHLY_BARS.map((bar, i) => {
              const barH = bar.h * 250 * flowProg;
              const x = 90 + i * 94;
              const y = 540 - barH;
              const colors = [C.green, C.blue, C.purple, C.amber, C.green, C.blue, C.purple, C.amber];
              return (
                <g key={i}>
                  <rect x={x} y={y} width={70} height={barH} fill={`url(#barGrad5_${i})`} rx={4} style={{filter: `drop-shadow(0 0 6px ${colors[i]}66)`}} />
                  <defs>
                    <linearGradient id={`barGrad5_${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[i]} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={colors[i]} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <text x={x + 35} y={560} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{bar.label}</text>
                  <text x={x + 35} y={y - 6} fill={colors[i]} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{Math.round(bar.h * 100)}</text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>mv_store_monthly_performance</span>
          <span style={{color: flowProg >= 1 ? C.green : C.amber}}>{flowProg >= 1 ? '✓ 0.4ms · dashboard live' : flowProg > 0 ? `connecting... ${Math.round(flowProg * 100)}%` : 'idle'}</span>
          <span style={{color: C.blue}}>production ✓</span>
        </div>
      </Win>

      <Caption text="CREATE MATERIALIZED VIEW ──► UNIQUE INDEX ──► BI Dashboard ──► 0.4ms Cache ──► Module 14 Seal ✓" from={t(192)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
