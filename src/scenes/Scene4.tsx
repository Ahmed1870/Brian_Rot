import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {EVALUATION_CRITERIA} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, Warn, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): Senior Technical Evaluation — Structural Thinking & Memory Safety
// Radar chart evaluating: Scalable Queries, Memory Safety, FK Integrity, Index Awareness, Architectural Thinking
// Anchors: 131.0 Scalable Queries | 136.0 work_mem | 140.0 ON DELETE | 145.0 radar | 150.0 top candidate | 155.0 seal
const S = START.s4;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.green);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131), 14));
  const radarP = pop(f, t(131));
  const evalP = pop(f, t(145));
  const sealP = pop(f, t(155));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Radar sweep progress
  const sweepProg = clamp(lin(f, t(145), sec(10)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="التقييم التقني للشركات الكبرى | Senior Engineering Evaluation Radar (Module 16)" from={sec(2)} to={sec(38)} color={C.purple} />

      {/* LEFT: Evaluation criteria code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={400}
          title="senior_evaluation.sql · EXPLAIN ANALYZE + scalable queries (PostgreSQL 16)"
          lines={[
            '-- Senior Interviewer Evaluation',
            '-- Tests structural thinking, not memorization',
            '',
            '-- 1) Scalable query with Index Scan',
            'EXPLAIN ANALYZE',
            '  SELECT * FROM store_orders',
            '  WHERE customer_id = 4821;',
            '-- ✓ Index Scan · 0.4ms (not Seq Scan)',
            '',
            '-- 2) Memory safety check',
            "SHOW work_mem; -- 64MB · no disk spill",
            '',
            '-- 3) FK integrity design',
            '-- ON DELETE RESTRICT (financial tables)',
            '-- ON DELETE CASCADE (order_items)',
            '',
            '-- 4) Index awareness',
            '-- B-Tree for equality · GIN for text',
            '-- GiST for spatial · Hash for KV',
          ]}
          start={t(131)}
          cps={0.5}
          size={13}
          accent={C.purple}
          hl={4}
          hlColor={C.green}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 590, width: 680, opacity: clamp(radarP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Senior evaluation golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>Scalable Queries</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>work_mem Safety</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>FK Integrity</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>Index Awareness</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>Top Candidate ✓</Chip>
        </div>
      </div>

      {/* Top candidate badge */}
      <Win x={80} y={660} w={680} h={240} title="evaluation result ──► top candidate · 92% average score" accent={C.green} opacity={clamp(lin(f, t(150), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 14, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Senior interviewer verdict · structural thinking · production-ready
        </div>

        <svg width={640} height={160} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Score gauge */}
          <g style={{opacity: clamp(pop(f, t(150)))}}>
            <text x={100} y={30} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Average Score</text>
            <text x={100} y={75} fill={C.green} fontSize={36} fontFamily={MONO} fontWeight={700} textAnchor="middle">92%</text>
            <text x={100} y={95} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">all criteria passed</text>
            <rect x={180} y={50} width={440} height={32} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={8} />
            <text x={400} y={72} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ TOP CANDIDATE · SQL Data Analyst · Hired</text>
            <text x={400} y={110} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">scalable queries · memory safety · FK integrity · index awareness · architectural thinking</text>
            <text x={400} y={130} fill={C.gold} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">🎓 Manzooma Certified · Production-Ready Professional</text>
          </g>
        </svg>
      </Win>

      {/* RIGHT: Evaluation radar chart */}
      <Win x={800} y={170} w={1040} h={730} title="senior evaluation radar ──► 5 criteria · 92% average · top candidate" accent={C.purple} opacity={clamp(lin(f, t(136), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.purple, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Senior Engineering Radar · 5 evaluation axes · structural thinking · not memorization
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.purple} style={{fontSize: 12, padding: '4px 10px'}}>5 axes</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{sweepProg > 0.95 ? 'top ✓' : 'evaluating...'}</Chip>
        </div>

        <svg width={1000} height={620} style={{position: 'absolute', left: 20, top: 70}}>
          {/* Radar chart (pentagon) */}
          <g style={{opacity: clamp(radarP)}}>
            <text x={500} y={20} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Evaluation Radar · 5 Axes</text>

            {/* Pentagon grid (3 levels) */}
            {[0.33, 0.66, 1.0].map((level, li) => {
              const r = 150 * level;
              const points = EVALUATION_CRITERIA.map((_, i) => {
                const angle = (i * 72 - 90) * Math.PI / 180;
                const x = 350 + r * Math.cos(angle);
                const y = 200 + r * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ');
              return <polygon key={li} points={points} fill="none" stroke={C.border} strokeWidth={1} opacity={0.4} />;
            })}

            {/* Axis lines */}
            {EVALUATION_CRITERIA.map((_, i) => {
              const angle = (i * 72 - 90) * Math.PI / 180;
              const x = 350 + 150 * Math.cos(angle);
              const y = 200 + 150 * Math.sin(angle);
              return <line key={i} x1={350} y1={200} x2={x} y2={y} stroke={C.border} strokeWidth={1} opacity={0.4} />;
            })}

            {/* Score polygon (filled) */}
            {(() => {
              const points = EVALUATION_CRITERIA.map((c, i) => {
                const angle = (i * 72 - 90) * Math.PI / 180;
                const r = 150 * (c.score / 100) * sweepProg;
                const x = 350 + r * Math.cos(angle);
                const y = 200 + r * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ');
              return <polygon points={points} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />;
            })()}

            {/* Score dots + labels */}
            {EVALUATION_CRITERIA.map((c, i) => {
              const color = colorOf(c.color);
              const angle = (i * 72 - 90) * Math.PI / 180;
              const r = 150 * (c.score / 100) * sweepProg;
              const x = 350 + r * Math.cos(angle);
              const y = 200 + r * Math.sin(angle);
              const labelR = 180;
              const lx = 350 + labelR * Math.cos(angle);
              const ly = 200 + labelR * Math.sin(angle);
              return (
                <g key={i} style={{opacity: clamp(sweepProg - i * 0.1)}}>
                  <circle cx={x} cy={y} r={6} fill={color} stroke={C.bg} strokeWidth={2} />
                  <text x={lx} y={ly} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{c.criterion}</text>
                  <text x={lx} y={ly + 14} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">{c.score}%</text>
                </g>
              );
            })}

            {/* Center label */}
            <text x={350} y={195} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">92%</text>
            <text x={350} y={210} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">avg score</text>
          </g>

          {/* Evaluation criteria table (right side) */}
          <g style={{opacity: clamp(evalP)}}>
            <rect x={560} y={30} width={420} height={320} fill={`${C.deep}cc`} stroke={C.purple} strokeWidth={2.5} rx={10} />
            <text x={770} y={55} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Evaluation Criteria · 5 Axes</text>
            {EVALUATION_CRITERIA.map((c, i) => {
              const color = colorOf(c.color);
              const p = clamp(sweepProg - i * 0.1);
              return (
                <g key={i} style={{opacity: clamp(p)}}>
                  <rect x={580} y={70 + i * 52} width={380} height={44} fill={`${color}11`} stroke={color} strokeWidth={1.5} rx={6} />
                  <text x={600} y={90 + i * 52} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700}>{c.criterion}</text>
                  <text x={600} y={106 + i * 52} fill={C.muted} fontSize={9} fontFamily={MONO}>{c.detail}</text>
                  {/* Score bar */}
                  <rect x={850} y={82 + i * 52} width={90} height={10} fill={C.deep} stroke={color} strokeWidth={1} rx={3} />
                  <rect x={850} y={82 + i * 52} width={90 * (c.score / 100) * p} height={10} fill={color} rx={3} />
                  <text x={945} y={91 + i * 52} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{c.score}%</text>
                </g>
              );
            })}
          </g>

          {/* Result banner */}
          {sealP > 0.5 ? (
            <g style={{opacity: clamp(pop(f, t(155)))}}>
              <rect x={150} y={380} width={700} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={410} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Evaluation Sealed · 92% avg · top candidate · SQL Professional · production-ready 🎓</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={500} y={460} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">
            {f < t(145) ? 'preparing evaluation radar...' :
              f < t(155) ? 'sweeping radar axes · evaluating structural thinking...' :
              '✓ all 5 criteria passed · top candidate · hired'}
          </text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>5 evaluation axes</span>
          <span style={{color: C.green}}>92% · top candidate 🎓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`}}>
          <Check p={sealP} size={36} color={C.purple} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>Evaluation · Sealed ✓</div>
        </div>
      </div>

      {/* Top candidate badge bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(pop(f, t(160)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.gold}`, borderRadius: 14, background: `${C.gold}0d`}}>
          <Check p={pop(f, t(160))} size={36} color={C.gold} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.gold, fontWeight: 700}}>Top Candidate 🎓</div>
        </div>
      </div>

      <Caption text="Scalable Queries ──► work_mem ──► ON DELETE ──► B-Tree vs GIN ──► architectural thinking ──► 92% · top candidate ✓" from={t(150)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
