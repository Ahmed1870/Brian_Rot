import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {KPI_CARDS} from '../data';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Multi-Stage Analytical Techniques — CTEs (blue) + Window Functions (purple) + KPIs (green)
// Each stage shows: input → technique → output; KPI cards pop up with real values
// Anchors: 41.5 CTEs | 45 window | 52 CASE WHEN | 60 KPIs | 68 CLV | 75 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'purple' ? C.purple : k === 'amber' ? C.amber : C.green);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cteP = pop(f, t(41.5));
  const winP = pop(f, t(45));
  const caseP = pop(f, t(52));
  const kpiP = pop(f, t(60));
  const sealP = pop(f, t(75));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // KPI card reveal progress
  const kpiReveal = clamp(lin(f, t(60), sec(8)));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="الدمج التحليلي المركب | CTEs + Window Functions + CASE WHEN → CLV · MRR · Churn (Module 16)" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* THREE pipeline stages side-by-side (top half) */}
      {/* Stage 1: CTEs (blue) */}
      <Win x={80} y={170} w={580} h={400} title="stage 1 ──► multi-stage CTEs (blue) ──► break pipeline into named stages" accent={C.blue} opacity={clamp(lin(f, t(41), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.blue, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          WITH monthly_sales AS (...), cohorts AS (...), growth AS (...)
        </div>

        <svg width={540} height={300} style={{position: 'absolute', left: 18, top: 50}}>
          {/* CTE chain visualization */}
          <g style={{opacity: clamp(cteP)}}>
            {/* CTE 1 */}
            <rect x={20} y={20} width={500} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 4px ${C.blue}66)`}} />
            <text x={40} y={45} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700}>CTE 1:</text>
            <text x={120} y={45} fill={C.text} fontSize={10} fontFamily={MONO}>monthly_sales</text>
            <text x={300} y={45} fill={C.muted} fontSize={10} fontFamily={MONO}>→ daily aggregation</text>
            <text x={450} y={45} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700}>✓</text>

            {/* Connector */}
            <line x1={270} y1={70} x2={270} y2={90} stroke={C.blue} strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
            <polygon points="265,84 275,84 270,94" fill={C.blue} />

            {/* CTE 2 */}
            <rect x={20} y={100} width={500} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={40} y={125} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700}>CTE 2:</text>
            <text x={120} y={125} fill={C.text} fontSize={10} fontFamily={MONO}>customer_cohorts</text>
            <text x={300} y={125} fill={C.muted} fontSize={10} fontFamily={MONO}>→ NTILE(4) bucketing</text>
            <text x={450} y={125} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700}>✓</text>

            <line x1={270} y1={150} x2={270} y2={170} stroke={C.blue} strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
            <polygon points="265,164 275,164 270,174" fill={C.blue} />

            {/* CTE 3 */}
            <rect x={20} y={180} width={500} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={40} y={205} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700}>CTE 3:</text>
            <text x={120} y={205} fill={C.text} fontSize={10} fontFamily={MONO}>growth_metrics</text>
            <text x={300} y={205} fill={C.muted} fontSize={10} fontFamily={MONO}>→ LAG · cumulative SUM</text>
            <text x={450} y={205} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700}>✓</text>

            {/* Bottom note */}
            <text x={270} y={265} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">3 chained CTEs · single query · linear data flow</text>
            <text x={270} y={282} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ stage 1 sealed · modular & readable</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>CTE 1 · 2 · 3</span>
          <span style={{color: C.green}}>chained ✓</span>
        </div>
      </Win>

      {/* Stage 2: Window Functions (purple) */}
      <Win x={680} y={170} w={580} h={400} title="stage 2 ──► window functions (purple) ──► LAG · SUM OVER · NTILE" accent={C.purple} opacity={clamp(lin(f, t(45), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.purple, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          SUM(revenue) OVER (ORDER BY month) · LAG(revenue) OVER (...)
        </div>

        <svg width={540} height={300} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Window function illustration: cumulative trend line */}
          <g style={{opacity: clamp(winP)}}>
            <text x={270} y={20} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">cumulative revenue trend · windowed</text>

            {/* Axes */}
            <line x1={40} y1={40} x2={40} y2={200} stroke={C.border} strokeWidth={1.5} />
            <line x1={40} y1={200} x2={500} y2={200} stroke={C.border} strokeWidth={1.5} />

            {/* Grid */}
            {[60, 100, 140, 180].map((y) => (
              <line key={y} x1={40} y1={y} x2={500} y2={y} stroke={C.border} strokeWidth={0.5} opacity={0.3} />
            ))}

            {/* Cumulative line (drawing in) */}
            {(() => {
              const points = [80, 120, 160, 200, 240, 280, 320, 360, 400, 460];
              const ys = [180, 165, 155, 140, 125, 115, 100, 90, 78, 65];
              const drawProg = clamp(lin(f, t(45), sec(8)));
              const maxIdx = Math.floor(drawProg * (points.length - 1));
              return (
                <>
                  <polyline
                    points={points.slice(0, maxIdx + 1).map((px, i) => `${px},${ys[i]}`).join(' ')}
                    fill="none"
                    stroke={C.purple}
                    strokeWidth={3}
                    style={{filter: `drop-shadow(0 0 6px ${C.purple})`}}
                  />
                  {/* LAG marker - current vs previous */}
                  {maxIdx > 0 ? (
                    <g>
                      <circle cx={points[maxIdx]} cy={ys[maxIdx]} r={6} fill={C.purple} style={{filter: `drop-shadow(0 0 6px ${C.purple})`}} />
                      <circle cx={points[maxIdx - 1]} cy={ys[maxIdx - 1]} r={5} fill={C.amber} stroke={C.amber} strokeWidth={2} />
                      <line x1={points[maxIdx - 1]} y1={ys[maxIdx - 1]} x2={points[maxIdx]} y2={ys[maxIdx]} stroke={C.amber} strokeWidth={2} strokeDasharray="4 3" />
                      <text x={points[maxIdx] + 10} y={ys[maxIdx] - 5} fill={C.purple} fontSize={10} fontFamily={MONO} fontWeight={700}>current</text>
                      <text x={points[maxIdx - 1] - 30} y={ys[maxIdx - 1] - 8} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700}>LAG</text>
                    </g>
                  ) : null}
                  {/* X axis labels */}
                  {points.map((px, i) => i % 2 === 0 ? (
                    <text key={i} x={px} y={215} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">M{i + 1}</text>
                  ) : null)}
                  <text x={270} y={235} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">months →</text>
                </>
              );
            })()}
          </g>

          {/* Window function legend */}
          <g style={{opacity: clamp(winP)}}>
            <text x={270} y={265} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">window: ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</text>
            <text x={270} y={282} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ stage 2 sealed · cumulative trends</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>LAG · SUM OVER</span>
          <span style={{color: C.amber}}>cumulative trend ✓</span>
        </div>
      </Win>

      {/* Stage 3: CASE WHEN KPIs (green) */}
      <Win x={1280} y={170} w={560} h={400} title="stage 3 ──► CASE WHEN → KPIs (green) ──► CLV · MRR · Churn" accent={C.green} opacity={clamp(lin(f, t(52), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          CASE WHEN prev_mrr &gt; 0 THEN (mrr - prev_mrr) / prev_mrr ELSE 0 END
        </div>

        <svg width={520} height={300} style={{position: 'absolute', left: 18, top: 50}}>
          {/* CASE WHEN flow */}
          <g style={{opacity: clamp(caseP)}}>
            <rect x={20} y={20} width={170} height={60} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={105} y={45} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">input rows</text>
            <text x={105} y={65} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">monthly_sales</text>

            <line x1={192} y1={50} x2={230} y2={50} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="224,44 224,56 238,50" fill={C.green} />
            <text x={211} y={40} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">CASE</text>

            <rect x={240} y={20} width={170} height={60} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 6px ${C.green}66)`}} />
            <text x={325} y={45} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">CASE WHEN</text>
            <text x={325} y={65} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">growth_pct · retention</text>
          </g>

          {/* KPI mini-cards (pop later) */}
          <g style={{opacity: clamp(kpiP)}}>
            <text x={270} y={120} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">KPI outputs · 4 cards</text>
            {[
              {name: 'CLV', val: '4820', color: C.green, x: 20},
              {name: 'MRR', val: '1.24M', color: C.blue, x: 140},
              {name: 'Churn', val: '3.2%', color: C.amber, x: 260},
              {name: 'Retn', val: '94.1%', color: C.green, x: 380},
            ].map((k, i) => {
              const p = clamp(kpiReveal - i * 0.12);
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(0, ${(1 - p) * 14}px)`}}>
                  <rect x={k.x} y={140} width={110} height={70} fill={`${k.color}22`} stroke={k.color} strokeWidth={2} rx={8} />
                  <text x={k.x + 55} y={165} fill={k.color} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.name}</text>
                  <text x={k.x + 55} y={190} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{k.val}</text>
                </g>
              );
            })}
            <text x={270} y={250} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">executive-grade outputs · automated monthly</text>
            <text x={270} y={270} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ stage 3 sealed · KPI cards rendered</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>CASE WHEN</span>
          <span style={{color: C.green}}>4 KPIs ✓</span>
        </div>
      </Win>

      {/* BOTTOM: full KPI cards row with formulas */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 590, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center'}}>
          {KPI_CARDS.map((k, i) => {
            const color = colorOf(k.color);
            const p = clamp(pop(f, t(70 + i * 0.8)));
            return (
              <div key={k.name} style={{opacity: clamp(p), transform: `translateY(${(1 - p) * 18}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 18px', border: `2px solid ${color}`, borderRadius: 14, background: `${color}0d`, minWidth: 220}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
                  <Check p={p} size={20} color={color} />
                  <span dir="ltr" style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color}}>{k.name}</span>
                </div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, textAlign: 'center'}}>{k.full}</div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.text, fontWeight: 700, marginTop: 4}}>{k.value}</div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: k.trend.startsWith('+') ? C.green : C.red, marginTop: 2}}>{k.trend}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '10px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 28px ${C.green}44`}}>
          <Check p={sealP} size={40} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Multi-Stage Analytics Pipeline · Sealed ✓</div>
          <div style={{display: 'flex', gap: 8}}>
            <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>CTEs ✓</Chip>
            <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>window ✓</Chip>
            <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>KPIs ✓</Chip>
          </div>
        </div>
      </div>

      <Caption text="CTEs ──► window functions ──► CASE WHEN ──► CLV · MRR · Churn · Retention ──► executive KPIs ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
