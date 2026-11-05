import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {ENTERPRISE_COHORT, CUSTOMER_ORDERS} from '../data';

// SC05 (170-210s): Enterprise MoM Revenue Growth & Customer Journey Dashboard
// Anchors (s): 171.0 enterprise | 175.0 MoM | 180.0 LAG | 185.0 FIRST_VALUE | 192.0 LTV | 200.0 cohort | 205.0 executive
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const dashboardP = clamp(lin(f, t(185), 16));
  const sealP = pop(f, t(200));

  // MoM chart progressive growth
  const growProg = clamp(lin(f, t(186), sec(18)));
  const visibleRows = Math.max(1, Math.floor(growProg * ENTERPRISE_COHORT.length));

  // Chart layout
  const CHART_X = 80;
  const CHART_Y = 50;
  const CHART_W = 1560;
  const CHART_H = 220;
  const maxSales = Math.max(...ENTERPRISE_COHORT.map((r) => r.sales));

  const xFor = (i: number) => CHART_X + (i / (ENTERPRISE_COHORT.length - 1)) * CHART_W;
  const yFor = (v: number) => CHART_Y + CHART_H - (v / maxSales) * CHART_H;

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | MoM Growth & Customer Journey" from={sec(1)} to={sec(38)} color={C.green} />

      <Editor
        x={80}
        y={170}
        w={880}
        h={260}
        title="Enterprise Query · manzooma_store_db"
        lines={[
          'SELECT customer_id, order_date, amount,',
          '  LAG(amount, 1, 0) OVER(',
          '    PARTITION BY customer_id ORDER BY order_date)',
          '    AS prev_amount,',
          '  FIRST_VALUE(amount) OVER(',
          '    PARTITION BY customer_id ORDER BY order_date',
          '    ROWS BETWEEN UNBOUNDED PRECEDING',
          '      AND UNBOUNDED FOLLOWING)',
          '    AS first_purchase_amount',
          'FROM customer_orders;',
        ]}
        start={t(171.5)}
        cps={0.65}
        size={16}
        hl={f >= t(180) ? 1 : -1}
        hlColor={f >= t(180) ? C.blue : C.green}
      />

      {/* Report panel right of editor */}
      <Win x={1000} y={170} w={840} h={260} title="executive report · mom_growth_dashboard" accent={C.green} opacity={clamp(lin(f, t(192), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          MoM Revenue Growth & LTV
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 48, right: 24, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.blue}>LAG prev_amount</Chip>
          <Chip color={C.amber}>FIRST_VALUE</Chip>
          <Chip color={C.green}>MoM %</Chip>
          <Chip color={C.purple}>LTV tracking</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>
            cohort retention ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* MoM bar chart dashboard at the bottom */}
      <Win x={80} y={450} w={1760} h={430} title="MoM revenue growth % · enterprise dashboard" accent={C.green} opacity={dashboardP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          month-over-month growth · manzooma_store_db
        </div>
        <svg width={1760} height={370} style={{position: 'absolute', left: 0, top: 40}}>
          {/* Axes */}
          <line x1={CHART_X} y1={CHART_Y + CHART_H} x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          <line x1={CHART_X} y1={CHART_Y} x2={CHART_X} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          {/* Zero line for growth % */}
          <line x1={CHART_X} y1={CHART_Y + CHART_H / 2} x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H / 2} stroke={C.muted} strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
          <text x={CHART_X - 10} y={CHART_Y + CHART_H / 2 + 5} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="end">0%</text>

          {/* Bars — MoM growth % */}
          {ENTERPRISE_COHORT.slice(0, visibleRows).map((row, i) => {
            const growth = row.mom_pct;
            if (growth === null) return null;
            const barH = Math.abs(growth) * 4;
            const barW = 140;
            const barX = xFor(i) - barW / 2;
            const isPositive = growth >= 0;
            const barY = isPositive ? CHART_Y + CHART_H / 2 - barH : CHART_Y + CHART_H / 2;
            const color = isPositive ? C.green : C.red;
            return (
              <g key={row.month}>
                <rect x={barX} y={barY} width={barW} height={barH} fill={`${color}cc`} stroke={color} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 6px ${color}88)`}} />
                <text x={xFor(i)} y={isPositive ? barY - 8 : barY + barH + 18} fill={color} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">{growth > 0 ? '+' : ''}{growth}%</text>
                <text x={xFor(i)} y={CHART_Y + CHART_H + 22} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">{row.month}</text>
              </g>
            );
          })}

          {/* First month label */}
          {visibleRows > 0 ? (
            <text x={xFor(0)} y={CHART_Y + CHART_H + 22} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">{ENTERPRISE_COHORT[0].month}</text>
          ) : null}
        </svg>

        {/* Bottom KPIs */}
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 12, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>+{ENTERPRISE_COHORT.filter(r => r.mom_pct !== null && r.mom_pct > 0).length} growth months</span>
          <span style={{color: C.red}}>{ENTERPRISE_COHORT.filter(r => r.mom_pct !== null && r.mom_pct < 0).length} decline months</span>
          <span style={{color: C.amber}}>{visibleRows}/{ENTERPRISE_COHORT.length} months</span>
        </div>
      </Win>

      <Caption text="Enterprise Analytics ──► MoM Revenue Growth % & Customer Journey Metrics" from={t(175)} to={t(195)} />
      <Caption text="Cohort Retention ──► Benchmarks Initial Purchase vs Subsequent Orders" from={t(197)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
