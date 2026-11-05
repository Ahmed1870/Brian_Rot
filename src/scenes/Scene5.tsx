import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC05 (frames 5100-6300, global 170-210s): YTD cumulative revenue curve for Manzooma Store (illustrative numbers).
const S = 170;
const t = (g: number) => sec(g - S);
const DAILY = [320, 410, 280, 520, 450, 610, 390, 700, 560, 650];
const CUM = DAILY.map((_, i) => DAILY.slice(0, i + 1).reduce((a, b) => a + b, 0));
const TARGET = DAILY.map((_, i) => 460 * (i + 1));
const PX = 0.082;
const X0 = 70;
const STEPW = 88;
const BASE = 430;

const stepPath = (vals: number[], p: number) => {
  let d = `M${X0} ${BASE}`;
  vals.forEach((v, i) => {
    const x = X0 + i * STEPW;
    const y = BASE - v * PX;
    d += ` L${x} ${y} L${x + STEPW} ${y}`;
  });
  return d + ` L${X0 + vals.length * STEPW} ${BASE} Z`;
};

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const chart = prog(f, t(184.6), 24);
  const bars = (i: number) => prog(f, t(185.0) + i * 9, 16);
  const cumP = prog(f, t(188.2), sec(4.2));
  const idx = Math.min(9, Math.floor(cumP * 10 - 0.001));
  const one = pop(f, t(192.8));
  const tgt = prog(f, t(197.1), sec(2.0));
  const cmp = pop(f, t(199.8));
  const seal = pop(f, t(203.9));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);
  const W = STEPW * 10;

  return (
    <Stage dur={1200} inFx="zoom" outFx="down">
      <TopBadge text="التطبيقات المؤسسية | Enterprise Analytics (YTD)" from={t(171.4)} to={t(184)} color={C.green} />

      <Editor x={90} y={150} w={1100} h={200} title="ytd_report.sql" lines={['SELECT order_date, daily_revenue,', '       SUM(daily_revenue) OVER(ORDER BY order_date) AS ytd_cumulative_revenue', 'FROM daily_sales_summary;']} start={t(175.3)} cps={1.7} size={22} accent={C.green} />

      <Win x={90} y={380} w={1120} h={520} title="Cumulative Revenue Curve" accent={cumP > 0 ? C.green : C.border} opacity={chart}>
        <svg width={1120} height={464} viewBox="0 0 1120 464">
          <defs>
            <clipPath id="s5clip"><rect x={0} y={0} width={X0 + W * cumP} height={464} /></clipPath>
          </defs>
          <line x1={X0} x2={X0 + W + 10} y1={BASE} y2={BASE} stroke={C.border} strokeWidth={2} />
          {[1000, 2000, 3000, 4000].map((v) => (
            <g key={v}>
              <line x1={X0} x2={X0 + W} y1={BASE - v * PX} y2={BASE - v * PX} stroke={C.border} strokeDasharray="6 10" opacity={0.6} />
              <text x={X0 - 10} y={BASE - v * PX + 6} textAnchor="end" fontFamily={MONO} fontSize={16} fill={C.muted}>{v}</text>
            </g>
          ))}
          {DAILY.map((v, i) => (
            <rect key={i} x={X0 + i * STEPW + 22} y={BASE - v * PX * bars(i) * 1.0} width={44} height={v * PX * bars(i)} rx={5} fill={C.blue} opacity={0.85} />
          ))}
          <g clipPath="url(#s5clip)">
            <path d={stepPath(CUM, 1)} fill={`${C.green}33`} stroke={C.green} strokeWidth={4} strokeLinejoin="round" />
          </g>
          <g opacity={tgt}>
            <polyline points={TARGET.map((v, i) => `${X0 + i * STEPW + STEPW / 2},${BASE - v * PX}`).join(' ')} fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray="12 8" />
            <text x={X0 + W - 6} y={BASE - TARGET[9] * PX + 26} textAnchor="end" fontFamily={MONO} fontSize={20} fill={C.amber}>target</text>
          </g>
          {cumP > 0 && cumP < 1 && <circle cx={X0 + W * cumP} cy={BASE - CUM[Math.max(0, idx)] * PX} r={10} fill={C.green} />}
        </svg>
      </Win>

      {/* KPI panel */}
      <div dir="ltr" style={{position: 'absolute', left: 1250, top: 150, width: 580, display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{borderRadius: 22, border: `2px solid ${C.blue}`, background: C.card, padding: '16px 28px', opacity: chart}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>daily_revenue · day {cumP > 0 ? idx + 1 : '—'}</div>
          <div style={{fontFamily: MONO, fontSize: 56, fontWeight: 700, color: C.blue}}>{cumP > 0 ? DAILY[Math.max(0, idx)] : 0}</div>
        </div>
        <div style={{borderRadius: 22, border: `2px solid ${C.green}`, background: C.card, padding: '16px 28px', opacity: chart, boxShadow: `0 0 ${20 * glow * cumP}px ${C.green}44`}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>ytd_cumulative_revenue</div>
          <div style={{fontFamily: MONO, fontSize: 76, fontWeight: 700, color: C.green, lineHeight: 1.1}}>{cumP > 0 ? CUM[Math.max(0, idx)].toLocaleString('en-US') : 0}</div>
        </div>
        <div style={{transform: `scale(${clamp(one)})`, opacity: clamp(one), transformOrigin: 'left center'}}><Chip color={C.blue} style={{fontSize: 22}}>one query: daily + cumulative</Chip></div>
        <div style={{transform: `scale(${clamp(cmp)})`, opacity: clamp(cmp), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 22, background: `${C.green}26`}}>actual 4,890 vs target 4,600 · +6%</Chip></div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${clamp(seal)})`, opacity: clamp(seal), transformOrigin: 'left center'}}>
          <Check p={clamp(seal)} size={50} />
          <Chip color={C.green} style={{fontSize: 22, boxShadow: `0 0 ${16 * glow}px ${C.green}55`}}>Executive Financial Seal</Chip>
        </div>
        <Mix style={{fontSize: 22, color: C.muted}}>أرقام توضيحية</Mix>
      </div>

      <Caption text="Enterprise Analytics ──► Year-to-Date (YTD) Cumulative Revenue Curve" from={t(175.6)} to={t(184.2)} />
      <Caption text="Financial Tracking ──► Monitors Cash Flow Growth & Sales Velocity" from={t(194.6)} to={t(207)} />
    </Stage>
  );
};
