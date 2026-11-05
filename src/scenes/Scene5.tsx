import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_REVENUE, SMOOTHED_5DAY} from '../data';

// SC05 (170-210s): Enterprise 5-Day Smoothed Revenue & Financial Trend Dashboard
// Anchors: 171.0 enterprise | 175.0 moving avg | 180.0 ROWS BETWEEN 3 PRECEDING | 185.0 smoothing | 192.0 trend | 200.0 dashboard | 205.0 executive
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const chartP = clamp(lin(f, t(185), 16));
  const sealP = pop(f, t(200));

  // Chart progressive growth
  const growProg = clamp(lin(f, t(186), sec(18)));
  const visibleRows = Math.max(1, Math.floor(growProg * DAILY_REVENUE.length));

  // Chart layout
  const CHART_X = 80;
  const CHART_Y = 50;
  const CHART_W = 1560;
  const CHART_H = 250;
  const maxDaily = Math.max(...DAILY_REVENUE.map((r) => r.amount));
  const maxSmoothed = Math.max(...SMOOTHED_5DAY);

  const xFor = (i: number) => CHART_X + (i / (DAILY_REVENUE.length - 1)) * CHART_W;
  const yForDaily = (v: number) => CHART_Y + CHART_H - (v / maxDaily) * CHART_H;
  const yForSmoothed = (v: number) => CHART_Y + CHART_H - (v / maxDaily) * CHART_H;

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | 5-Day Smoothed Revenue Dashboard" from={sec(1)} to={sec(38)} color={C.green} />

      <Editor
        x={80}
        y={170}
        w={880}
        h={200}
        title="Enterprise Query · manzooma_store_db"
        lines={[
          'SELECT order_date, total_revenue,',
          '  ROUND(AVG(total_revenue) OVER(',
          '    ORDER BY order_date',
          '    ROWS BETWEEN 3 PRECEDING AND 1 FOLLOWING), 2)',
          '    AS smoothed_5day_avg',
          'FROM daily_store_revenue;',
        ]}
        start={t(171.5)}
        cps={0.65}
        size={16}
        hl={f >= t(175) ? 2 : -1}
        hlColor={f >= t(175) ? C.green : C.blue}
      />

      {/* Report panel right of editor */}
      <Win x={1000} y={170} w={840} h={200} title="executive report · trend_smoothing" accent={C.green} opacity={clamp(lin(f, t(192), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          5-Day Rolling Average
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 46, right: 24, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 18, padding: '4px 14px'}}>3 PRECEDING</Chip>
          <Chip color={C.green} style={{fontSize: 18, padding: '4px 14px'}}>CURRENT ROW</Chip>
          <Chip color={C.amber} style={{fontSize: 18, padding: '4px 14px'}}>1 FOLLOWING</Chip>
          <Chip color={C.purple} style={{fontSize: 18, padding: '4px 14px'}}>smoothed</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700}}>
            eliminates volatility ✓
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(sealP), transform: `scale(${0.85 + 0.15 * clamp(sealP)})`}}>
            <Check p={sealP} size={40} color={C.green} />
            <div style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Seal ✓</div>
          </div>
        </div>
      </Win>

      {/* Dual chart at the bottom — daily (jagged red) + smoothed (green) */}
      <Win x={80} y={390} w={1760} h={500} title="daily revenue (jagged) vs 5-day smoothed avg (green trend)" accent={C.green} opacity={chartP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          enterprise financial dashboard · trend line smoothing
        </div>
        <svg width={1760} height={430} style={{position: 'absolute', left: 0, top: 40}}>
          {/* Axes */}
          <line x1={CHART_X} y1={CHART_Y + CHART_H} x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          <line x1={CHART_X} y1={CHART_Y} x2={CHART_X} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />

          {/* Y-axis labels */}
          {[0, 0.5, 1].map((p, i) => (
            <g key={i}>
              <line x1={CHART_X - 5} y1={CHART_Y + CHART_H - p * CHART_H} x2={CHART_X} y2={CHART_Y + CHART_H - p * CHART_H} stroke={C.muted} strokeWidth={1} />
              <text x={CHART_X - 10} y={CHART_Y + CHART_H - p * CHART_H + 5} fill={C.muted} fontSize={14} fontFamily={MONO} textAnchor="end">{Math.round(p * maxDaily).toLocaleString()}</text>
            </g>
          ))}

          {/* X-axis labels */}
          {DAILY_REVENUE.map((r, i) => i % 2 === 0 ? (
            <text key={r.day} x={xFor(i)} y={CHART_Y + CHART_H + 22} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">d{r.day}</text>
          ) : null)}

          {/* Daily revenue line — jagged red */}
          {visibleRows > 1 ? (
            <polyline
              points={DAILY_REVENUE.slice(0, visibleRows).map((r, i) => `${xFor(i)},${yForDaily(r.amount)}`).join(' ')}
              fill="none"
              stroke={C.red}
              strokeWidth={2}
              opacity={0.5}
            />
          ) : null}
          {DAILY_REVENUE.slice(0, visibleRows).map((r, i) => (
            <circle key={'d' + r.day} cx={xFor(i)} cy={yForDaily(r.amount)} r={5} fill={C.red} opacity={0.6} />
          ))}

          {/* Smoothed 5-day avg line — green */}
          {visibleRows > 1 ? (
            <polyline
              points={DAILY_REVENUE.slice(0, visibleRows).map((r, i) => `${xFor(i)},${yForSmoothed(SMOOTHED_5DAY[i])}`).join(' ')}
              fill="none"
              stroke={C.green}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{filter: `drop-shadow(0 0 8px ${C.green}88)`}}
            />
          ) : null}
          {DAILY_REVENUE.slice(0, visibleRows).map((r, i) => (
            <circle key={'s' + r.day} cx={xFor(i)} cy={yForSmoothed(SMOOTHED_5DAY[i])} r={6} fill={C.green} />
          ))}

          {/* Legend */}
          <g>
            <rect x={CHART_X + CHART_W - 340} y={CHART_Y + 10} width={320} height={64} fill={C.deep} stroke={C.border} strokeWidth={1} rx={8} />
            <line x1={CHART_X + CHART_W - 320} y1={CHART_Y + 28} x2={CHART_X + CHART_W - 280} y2={CHART_Y + 28} stroke={C.red} strokeWidth={2} opacity={0.6} />
            <text x={CHART_X + CHART_W - 270} y={CHART_Y + 33} fill={C.text} fontSize={13} fontFamily={MONO}>daily revenue (jagged)</text>
            <line x1={CHART_X + CHART_W - 320} y1={CHART_Y + 54} x2={CHART_X + CHART_W - 280} y2={CHART_Y + 54} stroke={C.green} strokeWidth={5} />
            <text x={CHART_X + CHART_W - 270} y={CHART_Y + 59} fill={C.text} fontSize={13} fontFamily={MONO}>5-day smoothed avg (trend)</text>
          </g>
        </svg>

        {/* Bottom KPIs */}
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 20, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.red}}>daily: ${DAILY_REVENUE[visibleRows - 1]?.amount ?? 0}</span>
          <span style={{color: C.green}}>smoothed: ${SMOOTHED_5DAY[visibleRows - 1]?.toFixed(2) ?? '0.00'}</span>
          <span style={{color: C.amber}}>{visibleRows}/{DAILY_REVENUE.length} days</span>
        </div>
      </Win>

      <Caption text="Enterprise Financial Framing ──► ROWS BETWEEN 3 PRECEDING AND 1 FOLLOWING" from={t(175)} to={t(195)} />
      <Caption text="Trend Line Smoothing ──► Eliminates Daily Volatility for Executive Reporting" from={t(197)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
