import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_TUNING, ENTERPRISE_TUNING_CODE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Security &amp; Disaster Recovery Deployment on manzooma_store_v2
// Memory tuning + role hardening + encrypted dump export · 60% faster + 45s recovery
// Module 16 75% Capstone seal
// Anchors (scene-local seconds):
//   171.0 manzooma_store_v2 | 175.0 ALTER SYSTEM | 180.0 pg_dump | 190.0 60% faster | 200.0 Module 16 75% Seal
const S = START.s5;
const t = (g: number) => sec(g - S);

interface MetricRow {
  label: string;
  before: string;
  after: string;
  delta: string;
  color: string;
  isPositive: boolean;
}

const METRICS: MetricRow[] = [
  {label: 'Query latency (avg)', before: '2400ms', after: '960ms', delta: '-60%', color: 'green', isPositive: true},
  {label: 'Recovery time', before: '15min', after: '45s', delta: '-95%', color: 'green', isPositive: true},
  {label: 'Memory utilization', before: '92%', after: '67%', delta: '-27%', color: 'blue', isPositive: true},
  {label: 'Secured roles', before: '2', after: '5', delta: '+150%', color: 'purple', isPositive: true},
  {label: 'RLS policies active', before: '0', after: '12', delta: '+12', color: 'amber', isPositive: true},
  {label: 'Backup encryption', before: 'none', after: 'AES-256', delta: 'secured', color: 'green', isPositive: true},
];

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.green);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171), 14));
  const depP = pop(f, t(171));
  const alterP = pop(f, t(175));
  const dumpP = pop(f, t(180));
  const fastP = pop(f, t(190));
  const sealP = pop(f, t(200));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Execution progress
  const execProg = clamp(lin(f, t(180), sec(10)));
  // Metrics reveal
  const metricReveal = clamp(lin(f, t(184), sec(8)));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيقات المؤسسية | Enterprise Security &amp; Disaster Recovery · manzooma_store_v2 (Module 16)" from={sec(2)} to={sec(38)} color={C.green} />

      {/* LEFT: Enterprise tuning code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={860}
          h={460}
          title="enterprise_tuning.sql · ALTER SYSTEM + pg_dump on manzooma_store_v2 (PostgreSQL 16)"
          lines={ENTERPRISE_TUNING_CODE}
          start={t(171)}
          cps={0.5}
          size={14}
          accent={C.green}
          hl={4}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 645, width: 860, opacity: clamp(depP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Module 16 capstone — 75% progress · enterprise admin deployed</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>ALTER SYSTEM</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>5 roles</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>12 RLS policies</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>248 MB dump</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>60% faster ✓</Chip>
        </div>
      </div>

      {/* Module 16 75% Capstone Seal */}
      <Win x={80} y={725} w={860} h={220} title="module 16 75% capstone seal ──► performance, security &amp; backup mastered" accent={C.green} opacity={clamp(sealP)}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 22px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Check p={sealP} size={64} color={C.green} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 26, color: C.green, fontWeight: 700}}>Module 16 · 75% Capstone Seal ✓</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 4}}>Enterprise Performance Tuning · Security &amp; RBAC · Backup &amp; Disaster Recovery · 60% faster · 45s recovery · encrypted</div>
            </div>
          </div>
          {/* Progress bar at 75% */}
          <div style={{width: '100%', height: 18, borderRadius: 9, background: C.deep, overflow: 'hidden', border: `2px solid ${C.green}`}}>
            <div style={{width: `${0.75 * sealP * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 9, boxShadow: `0 0 ${10 + pulse * 6}px ${C.green}`}} />
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700}}>{ENTERPRISE_TUNING.encryptedDump} · {ENTERPRISE_TUNING.speedupPct}% faster queries · {ENTERPRISE_TUNING.recoverySeconds}s recovery · Module 16 at 75%</div>
        </div>
      </Win>

      {/* RIGHT: Enterprise dashboard with metrics before/after */}
      <Win x={960} y={170} w={880} h={780} title="enterprise admin dashboard ──► 6 before/after metrics · 100% production-ready" accent={C.green} opacity={clamp(lin(f, t(175), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Manzooma Store V2 · admin dashboard · tuning · security · backup · 6 metrics improved
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{execProg > 0.05 && execProg < 0.99 ? 'deploying...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{execProg > 0.95 ? '6/6 ✓' : `${Math.floor(execProg * 6)}/6`}</Chip>
        </div>

        <svg width={840} height={680} style={{position: 'absolute', left: 18, top: 70}}>
          {/* 4 KPI mini-cards (top) */}
          <g style={{opacity: clamp(depP)}}>
            {[
              {label: 'Query Speedup', value: `+${ENTERPRISE_TUNING.speedupPct}%`, color: C.green, x: 20},
              {label: 'Recovery Time', value: `${ENTERPRISE_TUNING.recoverySeconds}s`, color: C.blue, x: 220},
              {label: 'Backup Size', value: `${ENTERPRISE_TUNING.backupSizeMb} MB`, color: C.amber, x: 420},
              {label: 'RLS Policies', value: `${ENTERPRISE_TUNING.rlsPoliciesActive}`, color: C.purple, x: 620},
            ].map((k, i) => {
              const p = clamp(pop(f, t(180 + i * 0.4)));
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(0, ${(1 - p) * 14}px)`}}>
                  <rect x={k.x} y={10} width={200} height={70} fill={`${k.color}22`} stroke={k.color} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 6px ${k.color}66)`}} />
                  <text x={k.x + 100} y={32} fill={k.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.label}</text>
                  <text x={k.x + 100} y={58} fill={C.text} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.value}</text>
                </g>
              );
            })}
          </g>

          {/* Before/After metrics table */}
          <g style={{opacity: clamp(depP)}}>
            {/* Header */}
            <rect x={20} y={100} width={800} height={32} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1} rx={6} />
            <text x={50} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">METRIC</text>
            <text x={300} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEFORE</text>
            <text x={500} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">AFTER</text>
            <text x={680} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">DELTA</text>
            <text x={790} y={120} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">STATUS</text>

            {/* 6 metric rows */}
            {METRICS.map((m, i) => {
              const color = colorOf(m.color);
              const p = clamp(metricReveal - i * 0.1);
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 30}px, 0)`}}>
                  <rect x={20} y={136 + i * 50} width={800} height={44} fill={`${color}11`} stroke={color} strokeWidth={1.5} rx={6} />
                  <text x={50} y={162 + i * 50} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{m.label}</text>
                  <text x={300} y={162 + i * 50} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{m.before}</text>
                  <text x={500} y={162 + i * 50} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{m.after}</text>
                  <text x={680} y={162 + i * 50} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{m.delta}</text>
                  <circle cx={790} cy={158 + i * 50} r={9} fill={`${C.green}22`} stroke={C.green} strokeWidth={1.5} />
                  <polyline points={`785,${158 + i * 50} 789,${162 + i * 50} 795,${154 + i * 50}`} fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
          </g>

          {/* Performance footer */}
          <g style={{opacity: clamp(fastP)}}>
            <rect x={20} y={460} width={800} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={420} y={488} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ 60% faster query times · 45s disaster recovery · 100% secured</text>
            <text x={420} y={510} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">memory tuned · roles hardened · encrypted backup · production-ready</text>
          </g>

          {/* Module 16 75% progress footer */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={555} width={800} height={80} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={420} y={580} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Module 16 · Capstone Project &amp; Portfolio — 75% Complete</text>
            <rect x={120} y={595} width={600} height={14} fill={C.deep} stroke={C.green} strokeWidth={1} rx={4} />
            <rect x={120} y={595} width={450 * sealP} height={14} fill={C.green} rx={4} style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
            <text x={420} y={625} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">Lesson 67 of Module 16 · performance, security &amp; backup mastered · ready for Lesson 68 finale</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>tuning</span>
          <span style={{color: C.green}}>60% faster · 45s recovery</span>
          <span style={{color: C.green}}>Module 16 · 75% ✓</span>
        </div>
      </Win>

      <Caption text="ALTER SYSTEM ──► shared_buffers ──► CREATE ROLE ──► RLS ──► pg_dump ──► 60% faster ──► 45s recovery ──► Module 16 75% ✓" from={t(180)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
