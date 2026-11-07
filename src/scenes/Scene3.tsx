import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ADMIN_COMMANDS, BACKUP_RESTORE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): Administration Commands &amp; Backup CLI Execution
// Code editor types CREATE ROLE, GRANT, CREATE POLICY, pg_dump CLI
// Anchors (scene-local seconds):
//   86.0 CREATE ROLE | 92.0 GRANT | 100.0 RLS | 105.0 pg_dump | 110.0 pg_restore | 120.0 production-ready
const S = START.s3;
const t = (g: number) => sec(g - S);

interface ExecStep {
  cmd: string;
  status: 'pending' | 'running' | 'done';
  color: string;
  output: string;
}

const EXEC_STEPS: ExecStep[] = [
  {cmd: 'CREATE ROLE readonly_analyst', status: 'done', color: 'blue', output: 'role created ✓'},
  {cmd: 'GRANT SELECT ON ALL TABLES', status: 'done', color: 'blue', output: 'privileges granted ✓'},
  {cmd: 'CREATE ROLE db_admin', status: 'done', color: 'purple', output: 'superuser role ✓'},
  {cmd: 'ALTER TABLE ... ENABLE RLS', status: 'done', color: 'amber', output: 'RLS enabled ✓'},
  {cmd: 'CREATE POLICY orders_isolation', status: 'done', color: 'amber', output: 'policy attached ✓'},
  {cmd: 'pg_dump -F c -b -f manzooma_v2.dump', status: 'done', color: 'green', output: '248 MB written ✓'},
];

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.green);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86), 14));
  const createP = pop(f, t(86));
  const grantP = pop(f, t(92));
  const rlsP = pop(f, t(100));
  const dumpP = pop(f, t(105));
  const restoreP = pop(f, t(110));
  const prodP = pop(f, t(120));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // CLI execution progress
  const execProg = clamp(lin(f, t(86), sec(20)));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="الأوامر الأمنية وعبارات التصدير | CREATE ROLE · GRANT · RLS · pg_dump (Module 16)" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: Admin commands editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={880}
          h={560}
          title="admin_commands.sql · CREATE ROLE · GRANT · RLS · pg_dump (PostgreSQL 16)"
          lines={ADMIN_COMMANDS}
          start={t(86)}
          cps={0.5}
          size={13}
          accent={C.purple}
          hl={1}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 745, width: 880, opacity: clamp(createP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Administration golden rule</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>CREATE ROLE</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>GRANT</Chip>
          <Chip color={C.red} style={{fontSize: 14, padding: '4px 12px'}}>REVOKE</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>CREATE POLICY</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>RLS</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>pg_dump -F c</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>pg_restore</Chip>
        </div>
      </div>

      {/* Production-ready bar */}
      <div style={{position: 'absolute', left: 80, top: 870, width: 880, opacity: clamp(prodP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={prodP} size={40} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Admin Commands · Executed ✓ roles created · RLS enabled · dump exported</div>
        </div>
      </div>

      {/* RIGHT: CLI execution stream + backup/restore flow */}
      <Win x={980} y={170} w={860} h={730} title="cli execution stream ──► CREATE ROLE · GRANT · RLS · pg_dump · pg_restore" accent={C.green} opacity={clamp(lin(f, t(90), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          CLI stream · 6 sequential steps · all executed · 248 MB dump written
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{execProg > 0.95 ? '6/6 done ✓' : `${Math.floor(execProg * 6)}/6`}</Chip>
        </div>

        <svg width={820} height={620} style={{position: 'absolute', left: 18, top: 70}}>
          {/* Header */}
          <rect x={10} y={10} width={800} height={28} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1} rx={6} />
          <text x={30} y={29} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">#</text>
          <text x={80} y={29} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700}>COMMAND</text>
          <text x={500} y={29} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700}>STATUS</text>
          <text x={700} y={29} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700}>OUTPUT</text>

          {/* 6 execution steps */}
          {EXEC_STEPS.map((step, i) => {
            const color = colorOf(step.color);
            const p = clamp(execProg - i * 0.12);
            return (
              <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 30}px, 0)`}}>
                <rect x={10} y={50 + i * 56} width={800} height={48} fill={`${color}11`} stroke={color} strokeWidth={1.5} rx={6} />
                <text x={30} y={78 + i * 56} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{i + 1}</text>
                <text x={80} y={78 + i * 56} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700}>{step.cmd}</text>
                {/* Status pill */}
                <rect x={500} y={62 + i * 56} width={120} height={22} fill={`${color}22`} stroke={color} strokeWidth={1.5} rx={11} />
                <text x={560} y={77 + i * 56} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{p > 0.5 ? '✓ done' : 'pending'}</text>
                {/* Output */}
                <text x={700} y={78 + i * 56} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700}>{p > 0.5 ? step.output : '...'}</text>
              </g>
            );
          })}

          {/* Backup &amp; restore flow (bottom) */}
          <g style={{opacity: clamp(pop(f, t(110)))}}>
            <rect x={10} y={400} width={800} height={120} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={410} y={425} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Backup &amp; Restore Pipeline</text>
            {/* Flow nodes */}
            <rect x={30} y={445} width={140} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={6} />
            <text x={100} y={465} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">PG16 live</text>
            <text x={100} y={482} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">manzooma_store_v2</text>

            <line x1={170} y1={470} x2={210} y2={470} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="204,464 204,476 218,470" fill={C.green} />

            <rect x={220} y={445} width={140} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 6px ${C.green}66)`}} />
            <text x={290} y={465} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_dump</text>
            <text x={290} y={482} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">-F c -b · 248 MB</text>

            <line x1={360} y1={470} x2={400} y2={470} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="394,464 394,476 408,470" fill={C.green} />

            <rect x={410} y={445} width={140} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={480} y={465} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">.dump file</text>
            <text x={480} y={482} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">encrypted</text>

            <line x1={550} y1={470} x2={590} y2={470} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="584,464 584,476 598,470" fill={C.purple} />

            <rect x={600} y={445} width={140} height={50} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} rx={6} />
            <text x={670} y={465} fill={C.purple} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_restore</text>
            <text x={670} y={482} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">-j 4 · 45s</text>
          </g>

          {/* Performance footer */}
          <g style={{opacity: clamp(prodP)}}>
            <rect x={10} y={545} width={800} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={410} y={572} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Admin Commands Sealed · 6 steps · 248 MB backup · 45s recovery · production-ready</text>
            <text x={410} y={592} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">least privilege enforced · RLS active · encrypted dump · disaster-ready</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>CREATE ROLE · GRANT</span>
          <span style={{color: C.amber}}>RLS · POLICY</span>
          <span style={{color: C.green}}>pg_dump · 248 MB ✓</span>
        </div>
      </Win>

      <Caption text="CREATE ROLE ──► GRANT ──► REVOKE ──► CREATE POLICY ──► pg_dump ──► pg_restore ──► 248 MB ✓" from={t(95)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
