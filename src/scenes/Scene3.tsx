import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';
import {DELIVERY_HOURS, PERCENTILE_RESULTS} from '../data';

// SC03 (85-130s): PERCENTILE_CONT() vs PERCENTILE_DISC() — WITHIN GROUP, NO OVER()
// Anchors (s): 86.0 percentile | 90.0 CONT | 95.0 interpolation | 100.0 DISC | 110.0 discrete | 118.0 WITHIN GROUP | 125.0 no OVER
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const chartP = clamp(lin(f, t(90), 16));
  const contP = clamp(lin(f, t(92), 16));
  const discP = clamp(lin(f, t(100), 16));
  const alertP = pop(f, t(118));

  // Chart layout
  const CHART_X = 80;
  const CHART_Y = 50;
  const CHART_W = 980;
  const CHART_H = 260;
  const maxVal = Math.max(...DELIVERY_HOURS) * 1.1;
  const sorted = [...DELIVERY_HOURS].sort((a, b) => a - b);

  const xFor = (i: number) => CHART_X + (i / (sorted.length - 1)) * CHART_W;
  const yFor = (v: number) => CHART_Y + CHART_H - (v / maxVal) * CHART_H;

  // Interpolated point position for P=0.90
  // P=0.90 means index = 0.90 * (n-1) = 0.90 * 9 = 8.1
  const p90Index = 0.90 * (sorted.length - 1);
  const p90LowerIdx = Math.floor(p90Index);
  const p90UpperIdx = Math.ceil(p90Index);
  const p90Frac = p90Index - p90LowerIdx;
  const contVal = sorted[p90LowerIdx] + (sorted[p90UpperIdx] - sorted[p90LowerIdx]) * p90Frac;
  const discVal = sorted[p90LowerIdx]; // first value where cumulative dist >= 0.90

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="الاستكمال الخطي والقيمة المنفصلة | PERCENTILE_CONT vs PERCENTILE_DISC" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* SQL editor — with WITHIN GROUP, NO OVER() */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={170}
          title="PostgreSQL · Ordered-Set Aggregates (WITHIN GROUP, NOT OVER)"
          lines={[
            'SELECT category_id,',
            '  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY delivery_hours) AS cont_p90,',
            '  PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY delivery_hours) AS disc_p90',
            'FROM delivery_logs GROUP BY category_id;',
          ]}
          start={t(86.5)}
          cps={0.7}
          size={18}
          accent={C.amber}
          hl={f >= t(90) ? 1 : f >= t(100) ? 2 : -1}
          hlColor={f >= t(100) ? C.green : C.amber}
        />
      </div>

      {/* NO OVER() alert */}
      <div style={{position: 'absolute', left: 80, top: 370, width: 540, opacity: clamp(alertP)}}>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', border: `2px solid ${C.red}`, borderRadius: 12, background: `${C.red}0d`}}>
          <Warn size={36} color={C.red} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700}}>OVER() NOT supported</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 4}}>Ordered-Set Aggregates use WITHIN GROUP + GROUP BY</div>
          </div>
        </div>
      </div>

      {/* Function comparison chips */}
      <div style={{position: 'absolute', left: 80, top: 470, width: 540, opacity: clamp(lin(f, t(95), 14))}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', border: `2px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`}}>
            <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.amber, width: 180}}>PERCENTILE_CONT</span>
            <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>linear interpolation → fractional</span>
          </div>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`}}>
            <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.green, width: 180}}>PERCENTILE_DISC</span>
            <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>first discrete value ≥ percentile</span>
          </div>
        </div>
      </div>

      {/* Statistical plot on the right — showing interpolation vs discrete */}
      <Win x={660} y={370} w={1180} h={530} title="delivery_hours · P90 interpolation vs discrete snap" accent={C.amber} opacity={chartP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 20, color: C.amber}}>
          sorted delivery_hours → P=0.90
        </div>
        <svg width={1180} height={470} style={{position: 'absolute', left: 0, top: 40}}>
          {/* Axes */}
          <line x1={CHART_X} y1={CHART_Y + CHART_H} x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />
          <line x1={CHART_X} y1={CHART_Y} x2={CHART_X} y2={CHART_Y + CHART_H} stroke={C.border} strokeWidth={2} />

          {/* Data points (sorted delivery hours) */}
          {sorted.map((v, i) => (
            <g key={i}>
              <circle cx={xFor(i)} cy={yFor(v)} r={6} fill={C.blue} stroke={C.bg} strokeWidth={2} />
              <text x={xFor(i)} y={yFor(v) - 14} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">{v.toFixed(1)}s</text>
              <text x={xFor(i)} y={CHART_Y + CHART_H + 22} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">#{i + 1}</text>
            </g>
          ))}

          {/* Connecting line */}
          {sorted.length > 1 ? (
            <polyline
              points={sorted.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ')}
              fill="none"
              stroke={C.border}
              strokeWidth={2}
              opacity={0.5}
            />
          ) : null}

          {/* PERCENTILE_CONT — interpolated point (amber) */}
          {contP > 0 ? (
            <g opacity={clamp(contP)}>
              {/* Interpolation line between the two neighboring points */}
              <line
                x1={xFor(p90LowerIdx)}
                y1={yFor(sorted[p90LowerIdx])}
                x2={xFor(p90UpperIdx)}
                y2={yFor(sorted[p90UpperIdx])}
                stroke={C.amber}
                strokeWidth={4}
                strokeDasharray="6 4"
                style={{filter: `drop-shadow(0 0 6px ${C.amber})`}}
              />
              {/* Interpolated point */}
              <circle cx={xFor(p90Index)} cy={yFor(contVal)} r={12} fill={C.amber} stroke={C.bg} strokeWidth={3} style={{filter: `drop-shadow(0 0 12px ${C.amber})`}} />
              <rect x={xFor(p90Index) - 90} y={yFor(contVal) - 40} width={180} height={26} fill={C.deep} stroke={C.amber} strokeWidth={1} rx={6} opacity={0.9} />
              <text x={xFor(p90Index)} y={yFor(contVal) - 22} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">CONT P90 = {contVal.toFixed(2)}s</text>
              <text x={xFor(p90Index)} y={yFor(contVal) + 28} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">interpolated</text>
            </g>
          ) : null}

          {/* PERCENTILE_DISC — discrete snap point (green) */}
          {discP > 0 ? (
            <g opacity={clamp(discP)}>
              {/* Arrow from interpolated point down to discrete value */}
              <line
                x1={xFor(p90Index)}
                y1={yFor(contVal)}
                x2={xFor(p90LowerIdx)}
                y2={yFor(discVal)}
                stroke={C.green}
                strokeWidth={3}
                strokeDasharray="4 3"
              />
              {/* Discrete point — highlighted existing data point */}
              <circle cx={xFor(p90LowerIdx)} cy={yFor(discVal)} r={14} fill="none" stroke={C.green} strokeWidth={4} style={{filter: `drop-shadow(0 0 10px ${C.green})`}} />
              <rect x={xFor(p90LowerIdx) - 90} y={yFor(discVal) + 20} width={180} height={26} fill={C.deep} stroke={C.green} strokeWidth={1} rx={6} opacity={0.9} />
              <text x={xFor(p90LowerIdx)} y={yFor(discVal) + 38} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">DISC P90 = {discVal.toFixed(2)}s</text>
              <text x={xFor(p90LowerIdx)} y={yFor(discVal) + 56} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">first discrete value</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom result comparison */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 50, display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>CONT: {PERCENTILE_RESULTS.p90_cont}s</span>
          <span style={{color: C.green}}>DISC: {PERCENTILE_RESULTS.p90_disc}s</span>
        </div>
      </Win>

      <Caption text="PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY ...)" from={t(90)} to={t(108)} />
      <Caption text="PERCENTILE_DISC(0.90) WITHIN GROUP (ORDER BY ...)" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
