import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {FK_INDEX_CHECKS, SYSTEM_CATALOG} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): PostgreSQL 16 Engine Mechanics — Shared Schema & B-Tree FK Checks
// pg_class / pg_attribute system catalogs map to parallel tables; automatic B-Tree indexes execute FK validation
// Anchors (scene-local seconds):
//   131.0 shared schema | 136.0 pg_class | 140.0 pg_attribute | 145.0 B-Tree | 150.0 FK checks | 155.0 seal
const S = START.s4;
const t = (g: number) => sec(g - S);

const fmtTuples = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131), 14));
  const sharedP = pop(f, t(131));
  const catP = pop(f, t(136));
  const btreeP = pop(f, t(145));
  const fkP = pop(f, t(150));
  const sealP = pop(f, t(155));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // FK validation progress
  const fkProg = clamp(lin(f, t(150), sec(8)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="هندسة المحرك الداخلية | Shared Schema · pg_class · pg_attribute · B-Tree FK Indexes (Module 16)" from={sec(2)} to={sec(38)} color={C.purple} />

      {/* LEFT: Engine internals code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="engine_internals.sql · system catalog inspection (PostgreSQL 16)"
          lines={[
            '-- Shared Schema Architecture',
            'CREATE SCHEMA IF NOT EXISTS manzooma_store_v2;',
            'SET search_path TO manzooma_store_v2;',
            '',
            '-- System catalog: registered tables',
            "SELECT relname, relkind, reltuples",
            '  FROM pg_class',
            "  WHERE relkind = 'r' AND relname LIKE 'store_%'",
            '  ORDER BY relname;',
            '',
            '-- pg_attribute: column metadata',
            "SELECT attname, typname FROM pg_attribute",
            '  JOIN pg_type ON pg_type.oid = atttypid',
            "  WHERE attrelid = 'store_orders'::regclass;",
          ]}
          start={t(131)}
          cps={0.55}
          size={14}
          accent={C.purple}
          hl={5}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(sharedP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Engine mechanics golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>Shared Schema</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>pg_class</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>pg_attribute</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>B-Tree FK index</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>sub-ms validation ✓</Chip>
        </div>
      </div>

      {/* B-Tree FK checks benchmark panel */}
      <Win x={80} y={570} w={680} h={330} title="fk validation benchmark ──► automated B-Tree index checks (sub-ms)" accent={C.green} opacity={clamp(lin(f, t(145), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.green}}>
          Each FK lookup = 1 B-Tree index probe · no Seq Scan · avg 0.04ms per check
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{fkProg > 0.95 ? 'all passed ✓' : 'checking...'}</Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 18, top: 50}}>
          {/* FK check rows */}
          {FK_INDEX_CHECKS.map((c, i) => {
            const p = clamp(fkProg - i * 0.15);
            return (
              <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 20}px, 0)`}}>
                <rect x={10} y={10 + i * 40} width={620} height={32} fill={`${C.green}11`} stroke={C.green} strokeWidth={1.5} rx={6} />
                <text x={20} y={31 + i * 40} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700}>{c.table}.{c.fk_col}</text>
                <text x={250} y={31 + i * 40} fill={C.muted} fontSize={10} fontFamily={MONO}>→</text>
                <text x={280} y={31 + i * 40} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700}>{c.parent}</text>
                <text x={450} y={31 + i * 40} fill={c.action === 'CASCADE' ? C.purple : C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>{c.action}</text>
                <text x={580} y={31 + i * 40} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{c.latency_ms}ms</text>
                {/* Check mark */}
                {p > 0.8 ? (
                  <g>
                    <circle cx={615} cy={26 + i * 40} r={8} fill={`${C.green}22`} stroke={C.green} strokeWidth={1.5} />
                    <polyline points={`611,${26 + i * 40} 614,${29 + i * 40} 620,${23 + i * 40}`} fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* Footer */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={10} y={180} width={620} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={8} />
            <text x={320} y={204} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ 4 FK checks · avg 0.04ms · B-Tree probed (no Seq Scan)</text>
          </g>
        </svg>
      </Win>

      {/* RIGHT: System catalog + B-Tree visualization */}
      <Win x={800} y={170} w={1040} h={730} title="engine core ──► pg_class catalog (purple) ──► B-Tree FK index routing (green)" accent={C.purple} opacity={clamp(lin(f, t(136), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.purple}}>
          PostgreSQL 16 Shared Schema · system catalogs manage parallel tables · automatic B-Tree FK indexes route validation
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.purple} style={{fontSize: 12, padding: '4px 10px'}}>pg_class</Chip>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{fkProg > 0.05 && fkProg < 0.99 ? 'routing...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{fkProg > 0.95 ? 'FK ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={610} style={{position: 'absolute', left: 20, top: 60}}>
          {/* === TOP: pg_class catalog table === */}
          <g style={{opacity: clamp(catP)}}>
            <text x={500} y={20} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_class ──► system catalog · parallel tables registered for the manzooma_store_v2 schema</text>

            {/* Header */}
            <rect x={40} y={40} width={920} height={28} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={1.5} rx={6} />
            <text x={80} y={58} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">relname</text>
            <text x={320} y={58} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">relkind</text>
            <text x={460} y={58} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">reltuples</text>
            <text x={620} y={58} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">n_att</text>
            <text x={760} y={58} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">btree_idx</text>
            <text x={900} y={58} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">catalog ✓</text>

            {/* Rows */}
            {SYSTEM_CATALOG.map((row, i) => {
              const rowP = clamp(catP - i * 0.06);
              const color = i % 2 === 0 ? C.blue : C.green;
              return (
                <g key={i} style={{opacity: clamp(rowP)}}>
                  <rect x={40} y={70 + i * 26} width={920} height={22} fill={`${color}11`} stroke={color} strokeWidth={1} rx={4} />
                  <text x={80} y={86 + i * 26} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.relname}</text>
                  <text x={320} y={86 + i * 26} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">{row.relkind}</text>
                  <text x={460} y={86 + i * 26} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{fmtTuples(row.reltuples)}</text>
                  <text x={620} y={86 + i * 26} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">{row.n_att}</text>
                  <text x={760} y={86 + i * 26} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ auto</text>
                  <text x={900} y={86 + i * 26} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓</text>
                </g>
              );
            })}
          </g>

          {/* === MIDDLE: B-Tree FK routing === */}
          <g style={{opacity: clamp(btreeP)}}>
            <text x={500} y={295} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">B-Tree FK Index Routing ──► instant key validation without Seq Scan</text>

            {/* B-Tree visualization */}
            {/* Root */}
            <rect x={460} y={320} width={80} height={36} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.green})`}} />
            <text x={500} y={342} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">root</text>

            {/* Connectors */}
            <line x1={500} y1={356} x2={340} y2={396} stroke={C.green} strokeWidth={2} opacity={0.6} />
            <line x1={500} y1={356} x2={500} y2={396} stroke={C.green} strokeWidth={2} opacity={0.6} />
            <line x1={500} y1={356} x2={660} y2={396} stroke={C.green} strokeWidth={2} opacity={0.6} />

            {/* 3 internal nodes */}
            {[340, 500, 660].map((x, i) => (
              <g key={i}>
                <rect x={x - 40} y={396} width={80} height={32} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
                <text x={x} y={416} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">node {i + 1}</text>
              </g>
            ))}

            {/* Leaf row with key positions */}
            {[180, 280, 380, 480, 580, 680, 780].map((x, i) => {
              const isProbe = i === 3 && fkProg > 0.3;
              return (
                <g key={i}>
                  <line x1={[340, 500, 660][i < 3 ? 0 : i < 5 ? 1 : 2]} y1={428} x2={x} y2={470} stroke={C.green} strokeWidth={1} opacity={0.4} />
                  <rect x={x - 30} y={470} width={60} height={32} fill={isProbe ? `${C.amber}33` : `${C.green}11`} stroke={isProbe ? C.amber : C.green} strokeWidth={isProbe ? 3 : 1.5} rx={6} style={isProbe ? {filter: `drop-shadow(0 0 8px ${C.amber})`} : {}} />
                  <text x={x} y={490} fill={isProbe ? C.amber : C.green} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">leaf {i + 1}</text>
                </g>
              );
            })}

            {/* Probe annotation */}
            <g style={{opacity: clamp(fkP)}}>
              <text x={480} y={520} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">↑ B-Tree probe · O(log n) · locates FK target in 1 hop</text>
            </g>
          </g>

          {/* Result banner */}
          {fkProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(155)))}}>
              <rect x={200} y={550} width={600} height={48} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={580} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Shared Schema Sealed · pg_class · B-Tree FK · sub-ms · production-ready</text>
            </g>
          ) : null}
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>pg_class · pg_attribute</span>
          <span style={{color: C.green}}>B-Tree · sub-ms ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`}}>
          <Check p={sealP} size={36} color={C.purple} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>Shared Schema · Sealed ✓</div>
        </div>
      </div>

      {/* FK validation badge bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(pop(f, t(160)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={pop(f, t(160))} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>B-Tree FK · 0.04ms ✓</div>
        </div>
      </div>

      <Caption text="pg_class ──► pg_attribute ──► Shared Schema ──► B-Tree FK ──► instant validation ──► sub-ms ✓" from={t(150)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
