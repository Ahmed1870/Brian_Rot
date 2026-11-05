import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_REVENUE, MOVING_AVGS} from '../data';

// SC03 (85-130s): Moving Averages — Explicit ROWS Frame & Trend Smoothing
// Anchors (s): 86.0 moving averages | 95.0 7 days | 100.0 ROWS BETWEEN 6 PRECEDING | 110.0 slides down | 118.0 smoothing | 125.0 trend
const S = START.s3;
const t = (g: number) => sec(g - S);

const ROW_H = 38;
const ROW0 = 50;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const tableP = clamp(lin(f, t(95), 14));
  // Sliding 7-row window: starts at t(100), reaches bottom by t(125)
  const scanProg = clamp(lin(f, t(100), sec(24)));
  const currentRow = Math.floor(scanProg * (DAILY_REVENUE.length - 1));
  const WINDOW_SIZE = 7;
  const windowStart = Math.max(0, currentRow - WINDOW_SIZE + 1);

  // Chart data points (visible up to currentRow)
  const chartPoints = DAILY_REVENUE.slice(0, currentRow + 1);

  // Chart layout (right panel)
  const CHART_X = 60;
  const CHART_Y = 80;
  const CHART_W = 760;
  const CHART_H = 240;
  const maxDaily = Math.max(...DAILY_REVENUE.map((r) => r.amount));
  const maxMavg = Math.max(...MOVING_AVGS);
  const maxVal = Math.max(maxDaily, maxMavg) * 1.1;

  const xFor = (i: number) => CHART_X + (i / (DAILY_REVENUE.length - 1)) * CHART_W;
  const yForDaily = (v: number) => CHART_Y + CHART_H - (v / maxVal) * CHART_H;
  const yForMavg = (v: number) => CHART_Y + CHART_H - (v / maxVal) * CHART_H;

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="المتوسطات المتحركة | Moving Averages & Trend Smoothing" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* Editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={250}
          title="PostgreSQL · 7-Day Moving Average"
          lines={[
            'SELECT order_date, daily_sales,',
            '       AVG(daily_sales) OVER(',
            '         ORDER BY order_date',
            '         ROWS BETWEEN 6 PRECEDING',
            '           AND CURRENT ROW',
            '       ) AS mavg_7days',
            'FROM daily_revenue;',
          ]}
          start={t(86.5)}
          cps={0.85}
          size={18}
          accent={C.amber}
          hl={f >= t(95) ? 3 : -1}
          hlColor={C.amber}
        />
      </div>

      {/* Window explainer */}
      <div style={{position: 'absolute', left: 80, top: 450, width: 860, opacity: clamp(lin(f, t(95), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ explicit ROWS frame</div>
        <div style={{display: 'flex', gap: 14, flexWrap: 'wrap'}}>
          <Chip color={C.amber}>ROWS BETWEEN 6 PRECEDING</Chip>
          <Chip color={C.green}>AND CURRENT ROW</Chip>
          <Chip color={C.blue}>fixed 7-row window</Chip>
        </div>
      </div>

      {/* Volatility → smooth callout */}
      <div style={{position: 'absolute', left: 80, top: 550, width: 860, opacity: clamp(pop(f, t(118)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={pop(f, t(118))} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>volatile daily → smooth trend</div>
            <Mix style={{fontSize: 18, color: C.muted}}>تنعيم التذبذب اليومي لكشف الاتجاه العام</Mix>
          </div>
        </div>
      </div>

      {/* Chart on the right — daily sales (jagged red) + moving avg (smooth green) */}
      <Win x={960} y={180} w={880} h={380} title="trend smoothing chart" accent={C.green} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 20, color: C.green}}>
          daily sales (jagged) vs 7-day moving avg (smooth)
        </div>
        <svg width={880} height={340} style={{position: 'absolute', left: 0, top: 40}}>
          {/* Axes */}
          <line x1={CHART_X} y1={CHART_Y + CHART_H} x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          <line x1={CHART_X} y1={CHART_Y} x2={CHART_X} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          {/* Y-axis labels */}
          {[0, 0.5, 1].map((p, i) => (
            <g key={i}>
              <line x1={CHART_X - 5} y1={CHART_Y + CHART_H - p * CHART_H} x2={CHART_X} y2={CHART_Y + CHART_H - p * CHART_H} stroke={C.muted} strokeWidth={1} />
              <text x={CHART_X - 10} y={CHART_Y + CHART_H - p * CHART_H + 5} fill={C.muted} fontSize={14} fontFamily={MONO} textAnchor="end">{Math.round(p * maxVal).toLocaleString()}</text>
            </g>
          ))}
          {/* X-axis labels (every other day) */}
          {DAILY_REVENUE.map((r, i) => i % 3 === 0 ? (
            <text key={r.day} x={xFor(i)} y={CHART_Y + CHART_H + 22} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">d{r.day}</text>
          ) : null)}

          {/* Daily sales line — jagged red */}
          {chartPoints.length > 1 ? (
            <polyline
              points={chartPoints.map((r, i) => `${xFor(i)},${yForDaily(r.amount)}`).join(' ')}
              fill="none"
              stroke={C.red}
              strokeWidth={2}
              opacity={0.55}
            />
          ) : null}
          {/* Daily sales dots */}
          {chartPoints.map((r, i) => (
            <circle key={r.day} cx={xFor(i)} cy={yForDaily(r.amount)} r={4} fill={C.red} opacity={0.7} />
          ))}

          {/* Moving average line — smooth green */}
          {chartPoints.length > 1 ? (
            <polyline
              points={chartPoints.map((r, i) => `${xFor(i)},${yForMavg(MOVING_AVGS[i])}`).join(' ')}
              fill="none"
              stroke={C.green}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.95}
              style={{filter: `drop-shadow(0 0 6px ${C.green})`}}
            />
          ) : null}
          {/* Moving avg dots */}
          {chartPoints.map((r, i) => (
            <circle key={'m' + r.day} cx={xFor(i)} cy={yForMavg(MOVING_AVGS[i])} r={5} fill={C.green} />
          ))}

          {/* Current day marker */}
          {currentRow >= 0 && currentRow < DAILY_REVENUE.length ? (
            <line x1={xFor(currentRow)} y1={CHART_Y} x2={xFor(currentRow)} y2={CHART_Y + CHART_H} stroke={C.amber} strokeWidth={2} strokeDasharray="4 4" opacity={0.7} />
          ) : null}
        </svg>
      </Win>

      {/* Sliding window table on the right-bottom */}
      <Win x={960} y={580} w={880} h={340} title="sliding 7-row window" accent={C.amber} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 50}}>day</span>
          <span style={{width: 150}}>order_date</span>
          <span style={{width: 100, textAlign: 'right'}}>daily</span>
          <span style={{flex: 1, textAlign: 'right', color: C.green}}>mavg_7</span>
        </div>
        {/* Sliding window overlay (amber box around 7 rows) */}
        {scanProg > 0 && scanProg < 1 ? (
          <div style={{position: 'absolute', left: 8, right: 8, top: ROW0 + windowStart * ROW_H + 2, height: Math.min(WINDOW_SIZE, currentRow + 1) * ROW_H - 4, borderRadius: 8, border: `3px solid ${C.amber}`, background: `${C.amber}14`, boxShadow: `0 0 20px ${C.amber}66`, pointerEvents: 'none', zIndex: 1}} />
        ) : null}
        {DAILY_REVENUE.slice(0, 8).map((row, i) => {
          const inWindow = i >= windowStart && i <= currentRow && scanProg > 0;
          const isCurrent = i === currentRow && scanProg < 1;
          return (
            <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 4, height: ROW_H - 8, borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: MONO, fontSize: 20, color: C.text, opacity: inWindow || isCurrent ? 1 : 0.4, zIndex: 2}}>
              <span style={{width: 40, color: C.muted}}>#{row.day}</span>
              <span style={{width: 140, color: C.blue}}>{row.date}</span>
              <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>{row.amount.toLocaleString()}</span>
              <span style={{flex: 1, textAlign: 'right', color: inWindow || isCurrent ? C.green : '#475569', fontWeight: 700}}>
                {inWindow || isCurrent ? MOVING_AVGS[i].toFixed(2) : '—'}
              </span>
            </div>
          );
        })}
      </Win>

      <Caption text="AVG(daily_sales) OVER(ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)" from={t(95)} to={t(115)} />
      <Caption text="7-Day Moving Average ──► Smooths Out Daily Volatility to Reveal Trend" from={t(117)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
