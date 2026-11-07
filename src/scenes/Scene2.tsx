import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {MEMORY_PARAMS, SECURITY_ROLES} from '../data';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Triple Administration Benchmark — Memory Tuning (blue) vs RBAC (purple) vs Backup (green)
// Anchors: 41.5 tuning | 45 shared_buffers | 52 GRANT/REVOKE | 60 pg_dump | 68 least privilege | 75 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.green);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tunP = pop(f, t(41.5));
  const secP = pop(f, t(52));
  const bkP = pop(f, t(60));
  const sealP = pop(f, t(75));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Slider animation
  const sliderProg = clamp(lin(f, t(45), sec(8)));
  // Backup capsule fill
  const backupFill = clamp(lin(f, t(60), sec(8)));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="المحاور الثلاثة للضبط والإدارة | Tuning · Roles · Backup Strategy (Module 16)" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* THREE pillars side-by-side */}
      {/* Pillar 1: Memory Tuning (blue) */}
      <Win x={80} y={170} w={580} h={580} title="pillar 1 ──► memory tuning (blue) ──► postgresql.conf parameters" accent={C.blue} opacity={clamp(lin(f, t(41), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.blue, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          postgresql.conf · shared_buffers · work_mem · maintenance_work_mem
        </div>

        <svg width={540} height={480} style={{position: 'absolute', left: 18, top: 50}}>
          {/* 4 memory parameter sliders */}
          {MEMORY_PARAMS.map((m, i) => {
            const color = colorOf(m.color);
            const p = clamp(tunP - i * 0.1);
            // Slider position based on m.pct
            const sliderX = 200 + (m.pct / 100) * 250;
            return (
              <g key={i} style={{opacity: clamp(p)}}>
                <text x={20} y={30 + i * 90} fill={color} fontSize={12} fontFamily={MONO} fontWeight={700}>{m.name}</text>
                <text x={20} y={48 + i * 90} fill={C.muted} fontSize={9} fontFamily={MONO}>{m.desc}</text>
                {/* Track */}
                <rect x={200} y={50 + i * 90} width={260} height={12} fill={C.deep} stroke={color} strokeWidth={1.5} rx={4} />
                {/* Filled portion (animated) */}
                <rect x={200} y={50 + i * 90} width={260 * (m.pct / 100) * sliderProg} height={12} fill={color} rx={4} style={{filter: `drop-shadow(0 0 4px ${color})`}} />
                {/* Slider thumb */}
                <circle cx={200 + 260 * (m.pct / 100) * sliderProg} cy={56 + i * 90} r={9} fill={color} stroke={C.bg} strokeWidth={2} style={{filter: `drop-shadow(0 0 6px ${color})`}} />
                {/* Value */}
                <text x={475} y={60 + i * 90} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{m.value}</text>
              </g>
            );
          })}

          {/* Bottom: tuning result */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={400} width={500} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={270} y={425} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ 60% faster queries · no memory bottlenecks</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>4 params tuned</span>
          <span style={{color: C.green}}>60% faster ✓</span>
        </div>
      </Win>

      {/* Pillar 2: Security &amp; RBAC (purple) */}
      <Win x={680} y={170} w={580} h={580} title="pillar 2 ──► security roles (purple) ──► GRANT · REVOKE · RLS" accent={C.purple} opacity={clamp(lin(f, t(52), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.purple, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Least Privilege · CREATE ROLE · GRANT · REVOKE · CREATE POLICY
        </div>

        <svg width={540} height={480} style={{position: 'absolute', left: 18, top: 50}}>
          {/* 4 roles with lock icons */}
          {SECURITY_ROLES.map((r, i) => {
            const color = colorOf(r.color);
            const p = clamp(secP - i * 0.1);
            return (
              <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 20}px, 0)`}}>
                <rect x={20} y={20 + i * 100} width={500} height={80} fill={`${color}22`} stroke={color} strokeWidth={2} rx={10} style={{filter: `drop-shadow(0 0 4px ${color}66)`}} />
                {/* Lock icon */}
                <g transform={`translate(40, ${40 + i * 100})`}>
                  <rect x={0} y={10} width={20} height={18} fill={color} rx={2} />
                  <path d="M 4 10 V 5 a 6 6 0 0 1 12 0 V 10" fill="none" stroke={color} strokeWidth={2} />
                </g>
                <text x={80} y={50 + i * 100} fill={color} fontSize={13} fontFamily={MONO} fontWeight={700}>{r.name}</text>
                <text x={80} y={68 + i * 100} fill={C.muted} fontSize={10} fontFamily={MONO}>privileges: {r.privileges}</text>
                <text x={80} y={84 + i * 100} fill={C.muted} fontSize={10} fontFamily={MONO}>tables: {r.tables}</text>
                {/* RLS badge */}
                {r.canWrite === false && r.canAdmin === false ? (
                  <g>
                    <rect x={430} y={45 + i * 100} width={70} height={22} fill={`${C.green}22`} stroke={C.green} strokeWidth={1.5} rx={4} />
                    <text x={465} y={60 + i * 100} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">RLS ✓</text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* Bottom: least privilege principle */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={430} width={500} height={40} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2.5} rx={8} />
            <text x={270} y={455} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ 4 roles · 12 RLS policies · least privilege enforced</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>GRANT · REVOKE</span>
          <span style={{color: C.green}}>RLS ✓</span>
        </div>
      </Win>

      {/* Pillar 3: Backup &amp; Disaster Recovery (green) */}
      <Win x={1280} y={170} w={560} h={580} title="pillar 3 ──► backup vault (green) ──► pg_dump · pg_restore" accent={C.green} opacity={clamp(lin(f, t(60), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          pg_dump -F c · encrypted · 248 MB · 45s recovery
        </div>

        <svg width={520} height={480} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Backup capsule (top) */}
          <g style={{opacity: clamp(bkP)}}>
            <rect x={20} y={20} width={480} height={120} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.green}66)`}} />
            <text x={260} y={45} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">encrypted backup capsule</text>
            {/* Capsule visual */}
            <rect x={50} y={60} width={400} height={50} fill={C.deep} stroke={C.green} strokeWidth={2} rx={25} />
            <rect x={50} y={60} width={400 * backupFill} height={50} fill={C.green} rx={25} opacity={0.4} style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
            <text x={260} y={92} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">manzooma_v2_prod.dump</text>
          </g>

          {/* pg_dump flow */}
          <g style={{opacity: clamp(bkP)}}>
            <rect x={20} y={160} width={140} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={6} />
            <text x={90} y={180} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">PG16 server</text>
            <text x={90} y={198} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">manzooma_store_v2</text>

            <line x1={160} y1={185} x2={200} y2={185} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="194,179 194,191 208,185" fill={C.green} />
            <text x={180} y={175} fill={C.green} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_dump</text>

            <rect x={210} y={160} width={140} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 4px ${C.green}66)`}} />
            <text x={280} y={180} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">.dump file</text>
            <text x={280} y={198} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">248 MB · encrypted</text>

            <line x1={350} y1={185} x2={390} y2={185} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="384,179 384,191 398,185" fill={C.green} />
            <text x={370} y={175} fill={C.green} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_restore</text>

            <rect x={400} y={160} width={100} height={50} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} rx={6} />
            <text x={450} y={180} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">restore</text>
            <text x={450} y={198} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">45s</text>
          </g>

          {/* Schedule visualization */}
          <g style={{opacity: clamp(bkP)}}>
            <text x={260} y={245} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Backup Schedule · pg_cron</text>
            {['02:00', '06:00', '10:00', '14:00', '18:00', '22:00'].map((time, i) => {
              const done = i < Math.floor(backupFill * 6);
              return (
                <g key={i}>
                  <rect x={20 + i * 80} y={260} width={70} height={40} fill={done ? `${C.green}22` : `${C.deep}cc`} stroke={done ? C.green : C.border} strokeWidth={1.5} rx={6} />
                  <text x={55 + i * 80} y={278} fill={done ? C.green : C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{time}</text>
                  <text x={55 + i * 80} y={293} fill={done ? C.green : C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">{done ? '✓' : '...'}</text>
                </g>
              );
            })}
          </g>

          {/* Bottom: recovery seal */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={330} width={480} height={140} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={260} y={358} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Disaster Recovery Stats</text>
            <text x={100} y={390} fill={C.green} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">248 MB</text>
            <text x={100} y={410} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">backup size</text>
            <text x={260} y={390} fill={C.green} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">45s</text>
            <text x={260} y={410} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">recovery time</text>
            <text x={420} y={390} fill={C.green} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">100%</text>
            <text x={420} y={410} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">data integrity</text>
            <text x={260} y={450} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ zero data loss · production-ready</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>pg_dump · pg_restore</span>
          <span style={{color: C.green}}>45s recovery ✓</span>
        </div>
      </Win>

      {/* Bottom seal bar */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 770, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 28px ${C.green}44`}}>
          <Check p={sealP} size={44} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Triple Administration Engine · Sealed ✓</div>
          <div style={{display: 'flex', gap: 8}}>
            <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>tuning ✓</Chip>
            <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>RBAC ✓</Chip>
            <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>backup ✓</Chip>
          </div>
        </div>
      </div>

      <Caption text="shared_buffers ──► work_mem ──► GRANT/REVOKE ──► RLS ──► pg_dump ──► pg_restore ──► disaster recovery ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
