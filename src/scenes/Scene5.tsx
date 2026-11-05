import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {REGIONAL_SALES} from '../data';

// SC05 (170-210s): Enterprise Regional Sales Monthly Dashboard
// Anchors: 171.0 enterprise | 175.0 mv_regional | 180.0 unique index | 185.0 partial | 192.0 dashboard | 200.0 instant | 205.0 seal
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const dashboardP = clamp(lin(f, t(185), 16));
  const sealP = pop(f, t(200));

  // Chart progressive reveal
  const revealProg = clamp(lin(f, t(186), sec(18)));
  const visibleRows = Math.max(1, Math.floor(revealProg * REGIONAL_SALES.length));

  // Chart layout
  const CHART_X = 160;
  const CHART_Y = 50;
  const CHART_W = 1480;
  const CHART_H = 200;
  const maxRevenue = Math.max(...REGIONAL_SALES.map((r) => r.revenue));

  const xFor = (i: number) => CHART_X + (i / (REGIONAL_SALES.length - 1)) * CHART_W;
  const yFor = (v: number) => CHART_Y + CHART_H - (v / maxRevenue) * CHART_H;

  const regionColors: {[key: string]: string} = {
    Cairo: C.blue,
    Alexandria: C.green,
    Giza: C.amber,
  };

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | Regional Sales Monthly Pipeline" from={sec(1)} to={sec(38)} color={C.green} />

      <Editor
        x={80}
        y={170}
        w={880}
        h={260}
        title="Enterprise MatView · mv_regional_sales_monthly"
        lines={[
          'CREATE MATERIALIZED VIEW mv_regional_sales_monthly AS',
          "  SELECT region_id, DATE_TRUNC('month', order_date) AS m_date,",
          '         SUM(total_amount) AS revenue',
          '  FROM store_orders GROUP BY 1, 2;',
          'CREATE UNIQUE INDEX idx_mv_reg_m',
          '  ON mv_regional_sales_monthly (region_id, m_date);',
        ]}
        start={t(171.5)}
        cps={0.6}
        size={15}
        hl={4}
        hlColor={C.green}
      />

      {/* Report panel right of editor */}
      <Win x={1000} y={170} w={840} h={260} title="executive report · regional sales BI" accent={C.green} opacity={clamp(lin(f, t(192), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          Regional Sales Pipeline
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 46, right: 24, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>UNIQUE index</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>partial index</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>hybrid view</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>pg_cron</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>
            instant dashboard ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* Dashboard chart at bottom */}
      <Win x={80} y={450} w={1760} h={440} title="mv_regional_sales_monthly · executive BI dashboard" accent={C.green} opacity={dashboardP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          monthly revenue per region · instant load from materialized snapshot
        </div>
        <svg width={1760} height={380} style={{position: 'absolute', left: 0, top: 40}}>
          {/* Axes */}
          <line x1={CHART_X} y1={CHART_Y + CHART_H} x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          <line x1={CHART_X} y1={CHART_Y} x2={CHART_X} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          {/* Y-axis labels */}
          {[0, 0.5, 1].map((p, i) => (
            <g key={i}>
              <line x1={CHART_X - 5} y1={CHART_Y + CHART_H - p * CHART_H} x2={CHART_X} y2={CHART_Y + CHART_H - p * CHART_H} stroke={C.muted} strokeWidth={1} />
              <text x={CHART_X - 10} y={CHART_Y + CHART_H - p * CHART_H + 5} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="end">{Math.round(p * maxRevenue / 1000)}K</text>
            </g>
          ))}
          {/* X-axis labels */}
          {REGIONAL_SALES.map((r, i) => i % 2 === 0 ? (
            <text key={i} x={xFor(i)} y={CHART_Y + CHART_H + 22} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">{r.region_name.substring(0, 3)}-{r.month.substring(5)}</text>
          ) : null)}

          {/* Bars */}
          {REGIONAL_SALES.slice(0, visibleRows).map((row, i) => {
            const barW = 120;
            const barH = (row.revenue / maxRevenue) * CHART_H;
            const barX = xFor(i) - barW / 2;
            const barY = CHART_Y + CHART_H - barH;
            const color = regionColors[row.region_name] || C.blue;
            return (
              <g key={i}>
                <rect x={barX} y={barY} width={barW} height={barH} fill={`${color}cc`} stroke={color} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 6px ${color}88)`}} />
                <text x={xFor(i)} y={barY - 8} fill={color} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">${(row.revenue / 1000).toFixed(0)}K</text>
              </g>
            );
          })}
        </svg>

        {/* Bottom KPIs */}
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 12, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 20, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>total: ${REGIONAL_SALES.slice(0, visibleRows).reduce((a, b) => a + b.revenue, 0).toLocaleString()}</span>
          <span style={{color: C.blue}}>{visibleRows}/{REGIONAL_SALES.length} rows loaded</span>
          <span style={{color: C.amber}}>load: 0.002s</span>
        </div>
      </Win>

      <Caption text="Enterprise Reporting Pipeline ──► Layered MatView + Partial Indexes" from={t(175)} to={t(195)} />
      <Caption text="Production Analytics ──► Instant Executive Dashboard Delivery" from={t(197)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
