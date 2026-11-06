import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {JOB_QUEUE_LINES, TABLE_LOCK_LEVELS} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): Table Locks & SKIP LOCKED
// Anchors: 86.0 table locks | 90.0 8 levels | 95.0 LOCK TABLE | 100.0 SKIP LOCKED | 110.0 job queue | 118.0 leap | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

// Job queue items — some locked by other TXs
const JOBS = [
  {id: 1, status: 'locked', color: C.red},
  {id: 2, status: 'locked', color: C.red},
  {id: 3, status: 'free', color: C.green},
  {id: 4, status: 'locked', color: C.red},
  {id: 5, status: 'free', color: C.green},
  {id: 6, status: 'locked', color: C.red},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const tableP = clamp(lin(f, t(86.5), 14));
  const lockTableP = pop(f, t(95));
  const skipP = clamp(lin(f, t(100), 14));
  const queueP = clamp(lin(f, t(110), 14));
  // Leap animation: arrow moves from left to right, leaping over locked jobs
  const leapProg = clamp(lin(f, t(118), sec(7)));
  const leapX = lerp(20, 660, leapProg);
  // Determine which job the arrow has reached
  const leapJobIdx = Math.min(JOBS.length - 1, Math.floor(leapProg * JOBS.length));
  const grabbedJob = JOBS.find((j, i) => j.status === 'free' && i >= leapJobIdx);
  const sealP = pop(f, t(125));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="أقفال الجداول و SKIP LOCKED | Table Locks & SKIP LOCKED Job Queue" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: 8 table lock levels list */}
      <Win x={80} y={180} w={820} h={720} title="table lock levels ──► 8 strength levels (low → high)" accent={C.amber} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          ACCESS SHARE → ACCESS EXCLUSIVE ──► escalating conflict
        </div>

        <div style={{position: 'absolute', right: 18, top: 14}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={lockTableP} size={16} color={C.amber} /> LOCK TABLE IN MODE
          </Chip>
        </div>

        {/* Lock levels list */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 60, bottom: 60, overflow: 'hidden'}}>
          {TABLE_LOCK_LEVELS.map((lvl, i) => {
            const ap = clamp(lin(f, t(86.5 + i * 0.6), 14));
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', marginBottom: 6, border: `2px solid ${lvl.color}`, borderRadius: 10, background: `${lvl.color}0d`, opacity: clamp(ap), transform: `translateX(${(1 - clamp(ap)) * -30}px)`}}>
                <div style={{width: 30, height: 30, borderRadius: 6, background: `${lvl.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, color: lvl.color, border: `1px solid ${lvl.color}`}}>{i + 1}</div>
                <div style={{flex: 1}}>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 15, fontWeight: 700, color: lvl.color}}>{lvl.level}</div>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 1}}>{lvl.desc}</div>
                </div>
                <div style={{fontFamily: MONO, fontSize: 11, color: C.muted, textAlign: 'right'}}>
                  <div>strength</div>
                  <div style={{color: lvl.color, fontWeight: 700}}>{'█'.repeat(i + 1)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>LOCK TABLE x IN SHARE MODE;</span>
          <span>8 levels</span>
        </div>
      </Win>

      {/* RIGHT TOP: SKIP LOCKED code editor */}
      <Editor
        x={940}
        y={180}
        w={900}
        h={220}
        title="Query Editor · SKIP LOCKED job queue"
        lines={JOB_QUEUE_LINES.concat(['-- grabs first free job', '-- skips locked (busy) rows'])}
        start={t(86.5)}
        cps={0.7}
        size={15}
        accent={C.green}
        hl={1}
        hlColor={C.green}
      />

      {/* RIGHT BOTTOM: Job queue with leap animation */}
      <Win x={940} y={420} w={900} h={480} title="job_queue table ──► SKIP LOCKED leaps over locked rows" accent={C.green} opacity={queueP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          green arrow leaps over locked jobs ──► grabs first free row (job_id 3)
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>🔒 locked (other TX)</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>✓ free</Chip>
        </div>

        {/* SVG job queue + leap animation */}
        <svg width={860} height={360} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Job queue header */}
          <rect x={20} y={20} width={820} height={36} fill={C.deep} stroke={C.border} strokeWidth={2} rx={6} />
          <text x={60} y={44} fill={C.muted} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">job_id</text>
          <text x={250} y={44} fill={C.muted} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">status</text>
          <text x={450} y={44} fill={C.muted} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">payload</text>
          <text x={700} y={44} fill={C.muted} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">row lock</text>

          {/* Job queue rows */}
          {JOBS.map((job, i) => {
            const y = 64 + i * 42;
            const isGrabbed = grabbedJob && grabbedJob.id === job.id && leapProg > 0.9;
            const isPassed = i < leapJobIdx || (i === leapJobIdx && leapProg > 0.5);
            return (
              <g key={i}>
                <rect
                  x={20}
                  y={y}
                  width={820}
                  height={38}
                  fill={isGrabbed ? `${C.green}33` : job.status === 'locked' ? `${C.red}14` : `${C.green}11`}
                  stroke={isGrabbed ? C.green : job.status === 'locked' ? C.red : C.border}
                  strokeWidth={isGrabbed ? 3 : 1.5}
                  rx={6}
                  style={isGrabbed ? {filter: `drop-shadow(0 0 10px ${C.green})`} : undefined}
                />
                <text x={60} y={y + 24} fill={isGrabbed ? C.green : C.text} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">#{job.id}</text>
                <text x={250} y={y + 24} fill={job.color} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{job.status === 'locked' ? '🔒 locked' : '✓ free'}</text>
                <text x={450} y={y + 24} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">{`email_send_${job.id}.json`}</text>
                <text x={700} y={y + 24} fill={job.color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{job.status === 'locked' ? '🔒 TX-' + (job.id + 100) : (isGrabbed ? '🔒 TX-me (grabbed)' : '— free —')}</text>
              </g>
            );
          })}

          {/* Green arrow leaping over locked jobs to grab first free */}
          <g style={{opacity: clamp(pop(f, t(118)))}}>
            {/* Arc path showing the leap */}
            <path
              d={`M ${20 + leapX} 250 Q ${20 + leapX} ${150 - Math.sin(leapProg * Math.PI) * 80} ${20 + leapX} 250`}
              fill="none"
              stroke={C.green}
              strokeWidth={3}
              strokeDasharray="6 4"
              opacity={0.6}
            />
            {/* Arrow head position based on leapProg */}
            <g transform={`translate(${20 + leapX}, 220)`}>
              <circle cx={0} cy={0} r={16} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} />
              <text x={0} y={5} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">→</text>
            </g>
            {/* Label following arrow */}
            <text x={20 + leapX} y={280} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">SKIP LOCKED</text>
          </g>

          {/* Result banner */}
          {leapProg > 0.9 ? (
            <g style={{opacity: clamp(pop(f, t(124)))}}>
              <rect x={150} y={300} width={560} height={46} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={430} y={329} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Grabbed job_id = 3 (first free row) ──► other TXs skipped</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>SKIP LOCKED ──► no wait</span>
          <span>{leapProg > 0.9 ? '✓ grabbed job_id 3' : 'leaping...'}</span>
          <span>queue workers ✓</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Table Locks · SKIP LOCKED · Job Queue Concurrency ✓</div>
        </div>
      </div>

      <Caption text="LOCK TABLE IN MODE ──► 8 Levels ──► FOR UPDATE SKIP LOCKED ──► Job Queue Leap" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
