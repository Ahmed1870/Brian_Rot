import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_REVENUE, RUNNING_TOTALS, MOVING_AVGS} from '../data';

// SC05 (170-210s): Enterprise YTD Revenue & Cash Flow Dashboard
// Anchors (s): 171.0 enterprise | 175.0 YTD | 180.0 SUM OVER | 185.0 weekly moving avg | 192.0 cash flow | 200.0 dual chart | 205.0 executive
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const chartP = clamp(lin(f, t(185), 16));
  const sealP = pop(f, t(200));
  // Chart grows progressively
  const growProg = clamp(lin(f, t(186), sec(18)));
  const visibleRows = Math.max(1, Math.floor(growProg * DAILY_REVENUE.length));

  // Chart layout
  const CHART_X = 60;
  const CHART_Y = 50;
  const CHART_W = 1080;
  const CHART_H = 250;
  const maxCum = RUNNING_TOTALS[RUNNING_TOTALS.length - 1];
  const maxDaily = Math.max(...DAILY_REVENUE.map((r) => r.amount));
  const maxMavg = Math.max(...MOVING_AVGS);

  const xFor = (i: number) => CHART_X + (i / (DAILY_REVENUE.length - 1)) * CHART_W;
  const yForCum = (v: number) => CHART_Y + CHART_H - (v / maxCum) * CHART_H;
  const yForMavg = (v: number) => CHART_Y + CHART_H - (v / (maxMavg * 1.3)) * CHART_H;

  // Build area path for cumulative
  const cumPoints = DAILY_REVENUE.slice(0, visibleRows).map((r, i) => `${xFor(i)},${yForCum(RUNNING_TOTALS[i])}`);
  const cumAreaPath = cumPoints.length > 0
    ? `M ${CHART_X},${CHART_Y + CHART_H} L ${cumPoints.join(' L ')} L ${xFor(visibleRows - 1)},${CHART_Y + CHART_H} Z`
    : '';

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | Enterprise YTD & Cash Flow Analytics" from={sec(1)} to={sec(38)} color={C.green} />

      <Editor
        x={80}
        y={170}
        w={880}
        h={240}
        title="Enterprise YTD Query · manzooma_store_db"
        lines={[
          'SELECT order_date, daily_revenue,',
          '  SUM(daily_revenue) OVER(',
          '    ORDER BY order_date) AS ytd_cumulative,',
          '  ROUND(AVG(daily_revenue) OVER(',
          '    ORDER BY order_date',
          '    ROWS BETWEEN 6 PRECEDING',
          '      AND CURRENT ROW), 2) AS weekly_mavg',
          'FROM store_sales_summary;',
        ]}
        start={t(171.5)}
        cps={0.7}
        size={18}
        hl={f >= t(180) ? 1 : -1}
        hlColor={f >= t(180) ? C.green : C.blue}
      />

      {/* Report panel right of editor */}
      <Win x={1000} y={170} w={840} h={240} title="executive report · cash_flow_dashboard" accent={C.green} opacity={clamp(lin(f, t(192), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 14, fontFamily: MONO, fontSize: 20, color: C.green}}>
          Dual Trend & Accumulation
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 50, right: 24, display: 'flex', gap: 14, flexWrap: 'wrap'}}>
          <Chip color={C.green}>YTD cumulative ✓</Chip>
          <Chip color={C.blue}>weekly mavg ✓</Chip>
          <Chip color={C.amber}>single query ✓</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>
            cash flow tracking ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* Dual chart at the bottom — full width */}
      <Win x={80} y={440} w={1760} h={440} title="YTD cumulative revenue (area) + weekly moving avg (line)" accent={C.green} opacity={chartP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          enterprise financial dashboard · manzooma_store_db
        </div>
        <svg width={1760} height={370} style={{position: 'absolute', left: 0, top: 40}}>
          {/* Axes */}
          <line x1={CHART_X} y1={CHART_Y + CHART_H} x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          <line x1={CHART_X} y1={CHART_Y} x2={CHART_X} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          {/* Y-axis labels (cumulative - left) */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <g key={i}>
              <line x1={CHART_X - 5} y1={CHART_Y + CHART_H - p * CHART_H} x2={CHART_X} y2={CHART_Y + CHART_H - p * CHART_H} stroke={C.muted} strokeWidth={1} />
              <text x={CHART_X - 10} y={CHART_Y + CHART_H - p * CHART_H + 5} fill={C.green} fontSize={14} fontFamily={MONO} textAnchor="end">{Math.round(p * maxCum).toLocaleString()}</text>
            </g>
          ))}
          {/* Right Y-axis labels (mavg - right) */}
          {[0, 0.5, 1].map((p, i) => (
            <g key={i}>
              <line x1={CHART_X + CHART_W} y1={CHART_Y + CHART_H - p * CHART_H} x2={CHART_X + CHART_W + 5} y2={CHART_Y + CHART_H - p * CHART_H} stroke={C.muted} strokeWidth={1} />
              <text x={CHART_X + CHART_W + 10} y={CHART_Y + CHART_H - p * CHART_H + 5} fill={C.blue} fontSize={14} fontFamily={MONO} textAnchor="start">{Math.round(p * maxMavg * 1.3).toLocaleString()}</text>
            </g>
          ))}
          {/* X-axis labels */}
          {DAILY_REVENUE.map((r, i) => i % 2 === 0 ? (
            <text key={r.day} x={xFor(i)} y={CHART_Y + CHART_H + 20} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">d{r.day}</text>
          ) : null)}

          {/* Cumulative area — green */}
          {cumAreaPath ? (
            <>
              <path d={cumAreaPath} fill={`${C.green}33`} stroke="none" />
              <polyline
                points={cumPoints.join(' ')}
                fill="none"
                stroke={C.green}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{filter: `drop-shadow(0 0 8px ${C.green}88)`}}
              />
              {/* Cumulative dots */}
              {DAILY_REVENUE.slice(0, visibleRows).map((r, i) => (
                <circle key={'c' + r.day} cx={xFor(i)} cy={yForCum(RUNNING_TOTALS[i])} r={5} fill={C.green} />
              ))}
            </>
          ) : null}

          {/* Moving average line — blue */}
          {visibleRows > 1 ? (
            <>
              <polyline
                points={DAILY_REVENUE.slice(0, visibleRows).map((r, i) => `${xFor(i)},${yForMavg(MOVING_AVGS[i])}`).join(' ')}
                fill="none"
                stroke={C.blue}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{filter: `drop-shadow(0 0 6px ${C.blue}88)`}}
              />
              {DAILY_REVENUE.slice(0, visibleRows).map((r, i) => (
                <circle key={'m' + r.day} cx={xFor(i)} cy={yForMavg(MOVING_AVGS[i])} r={4} fill={C.blue} />
              ))}
            </>
          ) : null}

          {/* Legend */}
          <g>
            <rect x={CHART_X + CHART_W - 320} y={CHART_Y + 10} width={300} height={70} fill={C.deep} stroke={C.border} strokeWidth={1} rx={8} />
            <line x1={CHART_X + CHART_W - 300} y1={CHART_Y + 30} x2={CHART_X + CHART_W - 260} y2={CHART_Y + 30} stroke={C.green} strokeWidth={4} />
            <text x={CHART_X + CHART_W - 250} y={CHART_Y + 35} fill={C.text} fontSize={14} fontFamily={MONO}>YTD cumulative (area)</text>
            <line x1={CHART_X + CHART_W - 300} y1={CHART_Y + 58} x2={CHART_X + CHART_W - 260} y2={CHART_Y + 58} stroke={C.blue} strokeWidth={4} />
            <text x={CHART_X + CHART_W - 250} y={CHART_Y + 63} fill={C.text} fontSize={14} fontFamily={MONO}>weekly moving avg (line)</text>
          </g>
        </svg>

        {/* Bottom KPIs */}
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 14, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 22, fontWeight: 700, paddingTop: 10, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>YTD total: {RUNNING_TOTALS[visibleRows - 1]?.toLocaleString() ?? 0}</span>
          <span style={{color: C.blue}}>weekly mavg: {MOVING_AVGS[visibleRows - 1]?.toFixed(2) ?? '0.00'}</span>
          <span style={{color: C.amber}}>{visibleRows}/{DAILY_REVENUE.length} days</span>
        </div>
      </Win>

      <Caption text="Enterprise Financial Analytics ──► YTD Cumulative Revenue & Weekly Moving Avg" from={t(175)} to={t(195)} />
      <Caption text="Cash Flow Dashboard ──► Dual Trend & Accumulation Tracking in a Single Query" from={t(197)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
