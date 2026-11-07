import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Enterprise Performance Tuning &amp; Server Security Concept
// PG16 engine wrapped in purple security shield; memory valves (blue) connect to green backup vault
// Anchors (scene-local seconds):
//   1.0 welcome | 6.0 Performance Tuning | 18.0 disaster recovery | 28.0 seal | 35.0 production-ready
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const engineP = pop(f, t(6));
  const shieldP = pop(f, t(9));
  const sealP = pop(f, t(28));
  const prodP = pop(f, t(35));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="ضبط أداء السيرفر وتأمين البيانات والنسخ الاحتياطي | Performance Tuning, Security &amp; Backup — Module 16" from={sec(2)} to={sec(18)} color={C.purple} />

      {/* LEFT: Intro code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="admin_intro.sql · Performance, Security &amp; Backup (PostgreSQL 16)"
          lines={[
            '-- Lesson 67 · Enterprise Administration',
            '-- 3 pillars: tuning · security · backup',
            '',
            '-- 1) Memory tuning (postgresql.conf)',
            "ALTER SYSTEM SET shared_buffers = '4GB';",
            "ALTER SYSTEM SET work_mem = '64MB';",
            '',
            '-- 2) Security (GRANT / REVOKE / RLS)',
            'CREATE ROLE readonly_analyst WITH LOGIN;',
            'GRANT SELECT ON ALL TABLES IN SCHEMA public;',
            '',
            '-- 3) Backup (pg_dump binary)',
            'pg_dump -F c -b -f manzooma_v2_prod.dump',
          ]}
          start={t(1.5)}
          cps={0.55}
          size={15}
          accent={C.purple}
          hl={4}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Enterprise administration golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>Memory Tuning</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>RBAC Roles</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>RLS Policies</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>pg_dump Backup</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>45s Recovery ✓</Chip>
        </div>
      </div>

      {/* Performance &amp; Security seal panel */}
      <Win x={80} y={570} w={680} h={330} title="performance security engine ──► tuning + RBAC + backup (purple shield)" accent={C.purple} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 14, color: C.purple, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          memory tuning → role locks → encrypted backup → disaster recovery
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={prodP} size={16} color={C.purple} /> Secured Engine
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 70}}>
          {/* Memory tuning (left) */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <rect x={20} y={30} width={170} height={70} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={105} y={55} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Memory Tuning</text>
            <text x={105} y={75} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">shared_buffers · work_mem</text>
            <text x={105} y={90} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">maintenance_work_mem</text>
          </g>

          {/* Arrow to engine core */}
          <g style={{opacity: clamp(pop(f, t(11)))}}>
            <line x1={192} y1={65} x2={250} y2={65} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="244,59 244,71 258,65" fill={C.blue} />
          </g>

          {/* PG16 engine with shield (center) */}
          <g style={{opacity: clamp(engineP)}}>
            <ellipse cx={325} cy={65} rx={70 + pulse * 6} ry={70 + pulse * 6} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={3} strokeDasharray="8 6" opacity={0.5} />
            {/* Shield outline */}
            <path d="M 325 25 L 365 40 L 365 80 Q 365 100 325 110 Q 285 100 285 80 L 285 40 Z" fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.purple})`}} />
            <text x={325} y={62} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">PostgreSQL 16</text>
            <text x={325} y={78} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Engine + Shield</text>
            <text x={325} y={92} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">manzooma_store_v2</text>
          </g>

          {/* Arrow to backup vault */}
          <g style={{opacity: clamp(pop(f, t(13)))}}>
            <line x1={365} y1={65} x2={420} y2={65} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="414,59 414,71 428,65" fill={C.green} />
            <text x={392} y={55} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_dump</text>
          </g>

          {/* Backup vault (right) */}
          <g style={{opacity: clamp(shieldP)}}>
            <rect x={430} y={30} width={170} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={8} />
            <text x={515} y={55} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Backup Vault</text>
            <text x={515} y={75} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">manzooma_v2_prod.dump</text>
            <text x={515} y={90} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">encrypted · 248 MB</text>
          </g>

          {/* Bottom: 3 pillars */}
          <g style={{opacity: clamp(sealP)}}>
            <text x={325} y={150} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">3 Enterprise Administration Pillars</text>
            {[
              {label: 'Tuning', val: '60% faster', color: C.blue, x: 80},
              {label: 'Security', val: '5 roles · RLS', color: C.purple, x: 240},
              {label: 'Backup', val: '45s recovery', color: C.green, x: 400},
            ].map((p, i) => (
              <g key={i}>
                <rect x={p.x} y={165} width={150} height={36} fill={`${p.color}22`} stroke={p.color} strokeWidth={2} rx={6} />
                <text x={p.x + 75} y={180} fill={p.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{p.label}</text>
                <text x={p.x + 75} y={195} fill={C.text} fontSize={9} fontFamily={MONO} textAnchor="middle">{p.val}</text>
              </g>
            ))}
            <text x={325} y={215} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Performance Tuning &amp; Enterprise Security Engine sealed</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>tuning → shield → backup</span>
          <span>Enterprise ✓</span>
        </div>
      </Win>

      {/* RIGHT: Big visualization — 3-pillar administration pipeline */}
      <Win x={800} y={170} w={1040} h={720} title="enterprise administration pipeline ──► 3 pillars (tuning · security · backup) protect PG16" accent={C.purple} opacity={clamp(lin(f, t(6), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.purple, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Manzooma Store V2 · 3-pillar admin · memory tuning · RBAC + RLS · pg_dump encrypted backup
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>3 pillars</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{sealP > 0.5 ? 'secured ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={610} style={{position: 'absolute', left: 20, top: 70}}>
          {/* === Pillar 1: Memory Tuning (blue, top-left) === */}
          <g style={{opacity: clamp(pop(f, t(6)))}}>
            <rect x={20} y={10} width={300} height={180} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.blue}66)`}} />
            <text x={170} y={35} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Pillar 1 · Memory Tuning</text>
            {/* 4 memory bars */}
            {[
              {label: 'shared_buffers', val: '4GB', pct: 0.85, color: C.blue},
              {label: 'work_mem', val: '64MB', pct: 0.6, color: C.amber},
              {label: 'maintenance_work_mem', val: '512MB', pct: 0.7, color: C.purple},
              {label: 'effective_cache_size', val: '12GB', pct: 0.75, color: C.green},
            ].map((m, i) => (
              <g key={i}>
                <text x={30} y={65 + i * 28} fill={C.text} fontSize={10} fontFamily={MONO} fontWeight={700}>{m.label}</text>
                <rect x={30} y={70 + i * 28} width={200} height={10} fill={C.deep} stroke={C.border} strokeWidth={1} rx={2} />
                <rect x={30} y={70 + i * 28} width={200 * m.pct} height={10} fill={m.color} rx={2} style={{filter: `drop-shadow(0 0 4px ${m.color})`}} />
                <text x={290} y={80 + i * 28} fill={m.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{m.val}</text>
              </g>
            ))}
          </g>

          {/* === Pillar 2: Security &amp; RBAC (purple, top-center) === */}
          <g style={{opacity: clamp(pop(f, t(10)))}}>
            <rect x={340} y={10} width={320} height={180} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.purple}66)`}} />
            <text x={500} y={35} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Pillar 2 · Security &amp; RBAC</text>
            {/* Shield icon */}
            <path d="M 500 50 L 540 65 L 540 105 Q 540 125 500 135 Q 460 125 460 105 L 460 65 Z" fill={`${C.purple}33`} stroke={C.purple} strokeWidth={2} />
            <text x={500} y={95} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Least</text>
            <text x={500} y={110} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Privilege</text>
            {/* Roles listed */}
            <text x={500} y={155} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">GRANT · REVOKE · CREATE POLICY</text>
            <text x={500} y={172} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">5 roles · 12 RLS policies</text>
          </g>

          {/* === Pillar 3: Backup &amp; Recovery (green, top-right) === */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <rect x={680} y={10} width={300} height={180} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.green}66)`}} />
            <text x={830} y={35} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Pillar 3 · Backup &amp; Recovery</text>
            {/* Vault icon */}
            <rect x={770} y={50} width={120} height={80} fill={`${C.green}33`} stroke={C.green} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 8px ${C.green}66)`}} />
            <circle cx={830} cy={90} r={20} fill={`${C.deep}cc`} stroke={C.green} strokeWidth={2} />
            <line x1={820} y1={90} x2={840} y2={90} stroke={C.green} strokeWidth={2} />
            <line x1={830} y1={80} x2={830} y2={100} stroke={C.green} strokeWidth={2} />
            <text x={830} y={150} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_dump · pg_restore</text>
            <text x={830} y={170} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">248 MB · 45s recovery</text>
          </g>

          {/* === PG16 engine at center (bottom) === */}
          <g style={{opacity: clamp(pop(f, t(18)))}}>
            <line x1={170} y1={190} x2={420} y2={250} stroke={C.blue} strokeWidth={2} strokeDasharray="4 3" opacity={0.5} />
            <line x1={500} y1={190} x2={420} y2={250} stroke={C.purple} strokeWidth={2} strokeDasharray="4 3" opacity={0.5} />
            <line x1={830} y1={190} x2={580} y2={250} stroke={C.green} strokeWidth={2} strokeDasharray="4 3" opacity={0.5} />

            {/* Engine + shield */}
            <ellipse cx={500} cy={300} rx={140 + pulse * 8} ry={140 + pulse * 8} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={3} strokeDasharray="8 6" opacity={0.4} />
            <rect x={380} y={240} width={240} height={120} fill={`${C.deep}cc`} stroke={C.purple} strokeWidth={4} rx={18} style={{filter: `drop-shadow(0 0 ${12 + pulse * 10}px ${C.purple})`}} />
            <text x={500} y={285} fill={C.purple} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">PostgreSQL 16</text>
            <text x={500} y={307} fill={C.text} fontSize={13} fontFamily={MONO} textAnchor="middle">Server + Shield</text>
            <text x={500} y={325} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">3-pillar protected</text>
            <text x={500} y={345} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">manzooma_store_v2</text>
          </g>

          {/* Result banner */}
          {sealP > 0.5 ? (
            <g style={{opacity: clamp(pop(f, t(28)))}}>
              <rect x={150} y={420} width={700} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={450} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Enterprise Admin Sealed · 60% faster queries · 45s recovery · 100% secured</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={500} y={500} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">
            {f < t(6) ? 'PG16 server unconfigured · no protection' :
              f < t(28) ? 'applying 3 pillars: tuning · security · backup...' :
              '✓ server tuned · roles locked · backup vaulted · production-ready'}
          </text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>tuning</span>
          <span style={{color: C.purple}}>security</span>
          <span style={{color: C.green}}>backup ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`}}>
          <Check p={sealP} size={36} color={C.purple} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>Performance &amp; Security · Sealed ✓</div>
        </div>
      </div>

      {/* Production chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(prodP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={prodP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Backup Vault · 45s ✓</div>
        </div>
      </div>

      <Caption text="shared_buffers ──► GRANT/REVOKE ──► RLS ──► pg_dump ──► WAL ──► pg_hba.conf ──► Enterprise ✓" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
