import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {PIPELINE_CTE_CODE, REFRESH_CODE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): Materialized View Caching & Refresh Strategy
// Code editor writes CREATE MATERIALIZED VIEW mv_executive_summary AS WITH ...
// Result panel glows green; REFRESH CONCURRENTLY activates with zero-downtime animation
// Anchors (scene-local seconds):
//   86.0 CREATE MATERIALIZED VIEW | 92.0 CTE pipeline | 100.0 REFRESH | 105.0 CONCURRENTLY | 110.0 zero-downtime | 120.0 production-ready
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86), 14));
  const mvP = pop(f, t(86));
  const refP = pop(f, t(100));
  const concP = pop(f, t(105));
  const prodP = pop(f, t(120));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Refresh animation: rotating arrows + progress bar
  const refreshProg = clamp(lin(f, t(105), sec(6)));
  // Cache fill animation
  const cacheFill = clamp(lin(f, t(100), sec(8)));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="الصياغة المتقدمة وحفظ المخرجات | CREATE MATERIALIZED VIEW · REFRESH CONCURRENTLY (Module 16)" from={sec(2)} to={sec(40)} color={C.green} />

      {/* LEFT: Big DDL pipeline editor (CTEs + CREATE MATERIALIZED VIEW) */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={1100}
          h={560}
          title="mv_executive_summary.sql · CREATE MATERIALIZED VIEW + 3-CTE pipeline (PostgreSQL 16)"
          lines={PIPELINE_CTE_CODE}
          start={t(86)}
          cps={0.6}
          size={14}
          accent={C.green}
          hl={1}
          hlColor={C.green}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 745, width: 1100, opacity: clamp(mvP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Materialized view golden rule</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>CREATE MATERIALIZED VIEW</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>3 chained CTEs</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>LAG · SUM OVER</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>CASE WHEN growth_pct</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>cached on disk ✓</Chip>
        </div>
      </div>

      {/* Production-ready bar */}
      <div style={{position: 'absolute', left: 80, top: 870, width: 1100, opacity: clamp(prodP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={prodP} size={40} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Materialized View · Cached · REFRESH CONCURRENTLY ✓ zero-downtime executive reporting</div>
        </div>
      </div>

      {/* RIGHT: Materialized View caching visualization */}
      <Win x={1200} y={170} w={640} h={720} title="materialized view cache ──► green = cached · amber = refreshing · red = stale" accent={C.green} opacity={clamp(lin(f, t(90), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          mv_executive_summary · disk-cached · sub-ms queries
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{cacheFill > 0.95 ? 'cached ✓' : 'caching...'}</Chip>
        </div>

        <svg width={600} height={620} style={{position: 'absolute', left: 18, top: 70}}>
          {/* MV disk icon (big) */}
          <g style={{opacity: clamp(mvP)}}>
            <circle cx={300} cy={80} r={50 + pulse * 4} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.green})`}} />
            <text x={300} y={75} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">MATERIALIZED</text>
            <text x={300} y={92} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">VIEW</text>
            <text x={300} y={145} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">mv_executive_summary · 38.6 MB on disk</text>
          </g>

          {/* Cache fill bar */}
          <g style={{opacity: clamp(mvP)}}>
            <text x={300} y={180} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">cache fill progress</text>
            <rect x={50} y={190} width={500} height={20} fill={C.deep} stroke={C.border} strokeWidth={1.5} rx={4} />
            <rect x={50} y={190} width={500 * cacheFill} height={20} fill={C.green} rx={4} style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
            <text x={300} y={225} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{Math.round(cacheFill * 100)}% cached · {Math.round(cacheFill * 12)} months of KPIs</text>
          </g>

          {/* REFRESH CONCURRENTLY visualization */}
          <g style={{opacity: clamp(refP)}}>
            <text x={300} y={270} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">REFRESH MATERIALIZED VIEW CONCURRENTLY</text>

            {/* Refresh icon (rotating arrows) */}
            <g transform={`translate(300, 320) rotate(${refreshProg * 360})`}>
              <path d="M -25 0 A 25 25 0 1 1 18 18" fill="none" stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
              <polygon points="18,18 22,10 12,12" fill={C.amber} />
            </g>
            <text x={300} y={370} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">refreshing in background...</text>
            <text x={300} y={388} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">no read locks · queries continue serving</text>

            {/* Refresh progress bar */}
            <rect x={100} y={410} width={400} height={16} fill={C.deep} stroke={C.amber} strokeWidth={1.5} rx={4} />
            <rect x={100} y={410} width={400 * refreshProg} height={16} fill={C.amber} rx={4} style={{filter: `drop-shadow(0 0 6px ${C.amber})`}} />
            <text x={300} y={445} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{Math.round(refreshProg * 100)}% · {Math.round(refreshProg * 8)}s of 8s</text>
          </g>

          {/* CONCURRENTLY indicator */}
          <g style={{opacity: clamp(concP)}}>
            <rect x={100} y={475} width={400} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={300} y={500} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">CONCURRENTLY ✓</text>
            <text x={300} y={520} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">queries served without interruption</text>
          </g>

          {/* Result: zero-downtime */}
          <g style={{opacity: clamp(prodP)}}>
            <rect x={50} y={555} width={500} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={300} y={585} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ zero-downtime refresh · executive reports always live</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>cached · 38.6 MB</span>
          <span style={{color: C.amber}}>REFRESH CONCURRENTLY</span>
          <span style={{color: C.green}}>zero-downtime ✓</span>
        </div>
      </Win>

      <Caption text="CREATE MATERIALIZED VIEW ──► CTE pipeline ──► disk cache ──► REFRESH CONCURRENTLY ──► zero-downtime ✓" from={t(95)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
