import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {PG_ROLES_CATALOG, WAL_CONFIG} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, Warn, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): PostgreSQL 16 Engine Mechanics — WAL Stream &amp; pg_hba.conf Authentication
// WAL stream (blue) logs transactions; pg_hba.conf + pg_roles authenticate (green)
// Anchors (scene-local seconds):
//   131.0 WAL | 136.0 pg_hba.conf | 140.0 pg_roles | 145.0 auth | 150.0 crash recovery | 155.0 seal
const S = START.s4;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.green);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131), 14));
  const walP = pop(f, t(131));
  const hbaP = pop(f, t(136));
  const rolesP = pop(f, t(140));
  const authP = pop(f, t(145));
  const crashP = pop(f, t(150));
  const sealP = pop(f, t(155));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // WAL stream flow progress
  const walFlow = clamp(lin(f, t(131), sec(15)));
  // Auth check progress
  const authProg = clamp(lin(f, t(145), sec(8)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="هندسة المحرك الداخلية | Write-Ahead Logging · pg_hba.conf · pg_roles (Module 16)" from={sec(2)} to={sec(38)} color={C.purple} />

      {/* LEFT: WAL config editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={400}
          title="engine_internals.sql · WAL config &amp; pg_hba.conf (PostgreSQL 16)"
          lines={WAL_CONFIG}
          start={t(131)}
          cps={0.5}
          size={13}
          accent={C.purple}
          hl={6}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 590, width: 680, opacity: clamp(walP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Engine mechanics golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>WAL stream</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>pg_hba.conf</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>pg_roles</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>crash recovery ✓</Chip>
        </div>
      </div>

      {/* Crash recovery benchmark panel */}
      <Win x={80} y={660} w={680} h={240} title="crash recovery benchmark ──► WAL guarantees zero data loss" accent={C.green} opacity={clamp(lin(f, t(150), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 14, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          WAL replays on crash restart · guaranteed ACID durability
        </div>

        <svg width={640} height={160} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Before (no WAL, red) */}
          <g style={{opacity: clamp(pop(f, t(150)))}}>
            <text x={20} y={20} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700}>without WAL · data loss on crash</text>
            <rect x={20} y={28} width={280} height={32} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} rx={6} strokeDasharray="6 4" opacity={0.6} />
            <text x={160} y={48} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">uncommitted transactions lost</text>
          </g>

          {/* After (WAL, green) */}
          <g style={{opacity: clamp(pop(f, t(151)))}}>
            <text x={20} y={80} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>with WAL · zero data loss · crash recovery</text>
            <rect x={20} y={88} width={280} height={32} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={6} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
            <text x={160} y={108} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">WAL replayed · all tx recovered ✓</text>
          </g>

          {/* Recovery time */}
          <g style={{opacity: clamp(pop(f, t(155)))}}>
            <text x={450} y={20} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">recovery time</text>
            <text x={450} y={55} fill={C.green} fontSize={28} fontFamily={MONO} fontWeight={700} textAnchor="middle">8s</text>
            <text x={450} y={75} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">avg replay</text>
            <rect x={320} y={88} width={300} height={32} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={470} y={108} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ crash-safe · ACID durable</text>
          </g>
        </svg>
      </Win>

      {/* RIGHT: WAL stream + pg_hba authentication */}
      <Win x={800} y={170} w={1040} h={730} title="engine core ──► WAL stream (blue) → pg_hba.conf → pg_roles authentication (green)" accent={C.purple} opacity={clamp(lin(f, t(136), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.purple, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          PostgreSQL 16 Shared Memory &amp; WAL Engine · crash-safe · per-request auth validation
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.blue} style={{fontSize: 12, padding: '4px 10px'}}>WAL stream</Chip>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{walFlow > 0.05 && walFlow < 0.99 ? 'logging...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{authProg > 0.95 ? 'auth ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={620} style={{position: 'absolute', left: 20, top: 70}}>
          {/* === TOP: WAL stream (blue) === */}
          <g style={{opacity: clamp(walP)}}>
            <text x={500} y={20} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Write-Ahead Logging (WAL) ──► transactions logged before commit</text>

            {/* Transaction source */}
            <rect x={40} y={40} width={160} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={120} y={62} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">transactions</text>
            <text x={120} y={80} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">INSERT · UPDATE · DELETE</text>

            {/* Arrow into WAL */}
            <line x1={200} y1={65} x2={250} y2={65} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="244,59 244,71 258,65" fill={C.blue} />
            <text x={225} y={55} fill={C.blue} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">log first</text>

            {/* WAL stream (animated flow) */}
            <rect x={260} y={40} width={420} height={50} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={470} y={62} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">WAL stream · /pg_wal/</text>
            <text x={470} y={80} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">sequential log files · 16 MB each</text>
            {/* Flowing WAL records */}
            {[0, 1, 2, 3, 4].map((i) => {
              const dotProg = ((walFlow * 5) + i * 0.2) % 1;
              return <circle key={i} cx={270 + dotProg * 400} cy={65} r={4} fill={C.green} style={{filter: `drop-shadow(0 0 4px ${C.green})`}} />;
            })}

            {/* Arrow to disk */}
            <line x1={680} y1={65} x2={730} y2={65} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="724,59 724,71 738,65" fill={C.green} />

            {/* Disk storage */}
            <rect x={740} y={40} width={220} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={8} />
            <text x={850} y={62} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">disk + archive</text>
            <text x={850} y={80} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">/archive/ · crash-safe</text>
          </g>

          {/* === MIDDLE: pg_hba.conf authentication === */}
          <g style={{opacity: clamp(hbaP)}}>
            <text x={500} y={130} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_hba.conf ──► client authentication rules (per-connection check)</text>

            {/* 3 connection attempts */}
            {[
              {user: 'readonly_analyst', ip: '10.0.0.5', allowed: true, color: C.green},
              {user: 'db_admin', ip: '10.0.0.10', allowed: true, color: C.green},
              {user: 'unknown', ip: '203.0.113.5', allowed: false, color: C.red},
            ].map((c, i) => {
              const cP = clamp(authProg - i * 0.2);
              return (
                <g key={i} style={{opacity: clamp(cP)}}>
                  <rect x={40 + i * 320} y={150} width={280} height={50} fill={`${c.color}22`} stroke={c.color} strokeWidth={2} rx={6} />
                  <text x={180 + i * 320} y={170} fill={c.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">user: {c.user}</text>
                  <text x={180 + i * 320} y={186} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">ip: {c.ip}</text>
                  {/* Status */}
                  <rect x={140 + i * 320} y={195} width={80} height={22} fill={c.allowed ? `${C.green}22` : `${C.red}22`} stroke={c.allowed ? C.green : C.red} strokeWidth={1.5} rx={4} />
                  <text x={180 + i * 320} y={210} fill={c.allowed ? C.green : C.red} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{c.allowed ? '✓ accept' : '✗ reject'}</text>
                </g>
              );
            })}
          </g>

          {/* === BOTTOM: pg_roles catalog === */}
          <g style={{opacity: clamp(rolesP)}}>
            <text x={500} y={260} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_roles catalog ──► 5 registered roles · per-request permission check</text>

            {/* Header */}
            <rect x={40} y={280} width={920} height={28} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1} rx={6} />
            <text x={100} y={298} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">rolname</text>
            <text x={350} y={298} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">rolsuper</text>
            <text x={500} y={298} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">rolcanlogin</text>
            <text x={700} y={298} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">method</text>
            <text x={880} y={298} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">status</text>

            {/* Role rows */}
            {PG_ROLES_CATALOG.map((r, i) => {
              const color = colorOf(r.color);
              const p = clamp(rolesP - i * 0.06);
              return (
                <g key={i} style={{opacity: clamp(p)}}>
                  <rect x={40} y={310 + i * 28} width={920} height={24} fill={`${color}11`} stroke={color} strokeWidth={1} rx={4} />
                  <text x={100} y={327 + i * 28} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{r.rolname}</text>
                  <text x={350} y={327 + i * 28} fill={r.rolsuper ? C.red : C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">{r.rolsuper ? 'true' : 'false'}</text>
                  <text x={500} y={327 + i * 28} fill={r.rolcanlogin ? C.green : C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">{r.rolcanlogin ? 'true' : 'false'}</text>
                  <text x={700} y={327 + i * 28} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">scram-sha-256</text>
                  <text x={880} y={327 + i * 28} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓</text>
                </g>
              );
            })}
          </g>

          {/* Result banner */}
          {authProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(155)))}}>
              <rect x={150} y={490} width={700} height={48} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={520} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ WAL + pg_hba + pg_roles · sealed · crash-safe · auth-validated · production-ready</text>
            </g>
          ) : null}
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>WAL · /pg_wal/</span>
          <span style={{color: C.amber}}>pg_hba.conf</span>
          <span style={{color: C.green}}>auth ✓ · crash-safe</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={sealP} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>WAL Engine · Sealed ✓</div>
        </div>
      </div>

      {/* Auth badge bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(pop(f, t(160)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={pop(f, t(160))} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>pg_hba · auth ✓</div>
        </div>
      </div>

      <Caption text="WAL stream ──► /pg_wal/ ──► pg_hba.conf ──► pg_roles ──► scram-sha-256 ──► crash recovery ✓" from={t(150)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
