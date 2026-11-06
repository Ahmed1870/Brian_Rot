import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): BEGIN, COMMIT & ROLLBACK — Branching Execution Paths
// Anchors: 86.0 BEGIN | 90.0 autocommit | 95.0 COMMIT | 100.0 ROLLBACK | 110.0 branch | 118.0 permanent | 125.0 reversal
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const beginP = clamp(lin(f, t(86.5), 14));
  const acP = pop(f, t(90));
  const commitP = clamp(lin(f, t(95), sec(8)));
  const rollbackP = clamp(lin(f, t(100), sec(8)));
  const branchP = pop(f, t(110));
  const permP = pop(f, t(118));
  const revP = pop(f, t(125));

  // Branch path glow animation
  const branchProg = clamp(lin(f, t(110), sec(10)));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="BEGIN · COMMIT · ROLLBACK | Transaction Control Statements" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: Code editor with BEGIN statement */}
      <div style={{opacity: beginP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={240}
          title="Query Editor · BEGIN opens explicit transaction"
          lines={[
            'BEGIN;',
            'UPDATE accounts SET balance = balance - 500',
            '  WHERE id = 101;',
            'UPDATE accounts SET balance = balance + 500',
            '  WHERE id = 202;',
            'COMMIT; -- or ROLLBACK;',
          ]}
          start={t(86.5)}
          cps={0.78}
          size={16}
          accent={C.amber}
          hl={0}
          hlColor={C.amber}
        />
      </div>

      {/* Autocommit Disabled badge */}
      <div style={{position: 'absolute', left: 80, top: 440, width: 820, opacity: clamp(acP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`, boxShadow: `0 0 24px ${C.amber}33`}}>
          <svg width={42} height={42} viewBox="0 0 42 42">
            <circle cx={21} cy={21} r={19} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} />
            <line x1={11} y1={11} x2={31} y2={31} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
            <line x1={31} y1={11} x2={11} y2={31} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
          </svg>
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.amber, fontWeight: 700}}>Autocommit Disabled ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>BEGIN ──► statements grouped into a single transaction unit</div>
          </div>
        </div>
      </div>

      {/* Transaction control statements panel */}
      <Win x={80} y={540} w={820} h={360} title="transaction control statements ──► lifecycle" accent={C.amber} opacity={clamp(lin(f, t(95), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          BEGIN ──► DML ──► COMMIT (success) or ROLLBACK (failure)
        </div>

        <svg width={780} height={260} style={{position: 'absolute', left: 20, top: 50}}>
          {/* BEGIN box */}
          <rect x={20} y={100} width={130} height={60} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.amber}66)`}} />
          <text x={85} y={128} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEGIN;</text>
          <text x={85} y={148} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">open TX</text>

          {/* DML block */}
          <rect x={180} y={100} width={170} height={60} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={10} />
          <text x={265} y={128} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML block</text>
          <text x={265} y={148} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">UPDATE / INSERT / DELETE</text>

          {/* Decision diamond */}
          <polygon points="430,80 510,130 430,180 350,130" fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} />
          <text x={430} y={128} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">success?</text>
          <text x={430} y={146} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">decision</text>

          {/* Arrows from BEGIN to DML */}
          <line x1={150} y1={130} x2={180} y2={130} stroke={C.amber} strokeWidth={3} />
          <polygon points="174,124 174,136 188,130" fill={C.amber} />
          {/* Arrow DML to decision */}
          <line x1={350} y1={130} x2={350} y2={130} stroke={C.amber} strokeWidth={3} />
          <polygon points="344,124 344,136 358,130" fill={C.amber} />

          {/* COMMIT path (green - up-right) */}
          <path d="M 510 130 Q 600 130 620 80" fill="none" stroke={C.green} strokeWidth={3} strokeDasharray={commitP > 0.5 ? 'none' : '6 4'} style={{filter: commitP > 0.5 ? `drop-shadow(0 0 6px ${C.green})` : 'none'}} />
          <polygon points="614,74 614,86 628,80" fill={C.green} />
          <text x={565} y={100} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>yes ✓</text>
          <rect x={630} y={50} width={140} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} />
          <text x={700} y={78} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">COMMIT;</text>
          <text x={700} y={98} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">permanent ✓</text>

          {/* ROLLBACK path (red - down-right) */}
          <path d="M 510 130 Q 600 130 620 180" fill="none" stroke={C.red} strokeWidth={3} strokeDasharray={rollbackP > 0.5 ? 'none' : '6 4'} style={{filter: rollbackP > 0.5 ? `drop-shadow(0 0 6px ${C.red})` : 'none'}} />
          <polygon points="614,174 614,186 628,180" fill={C.red} />
          <text x={565} y={170} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700}>no ✗</text>
          <rect x={630} y={150} width={140} height={60} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} rx={10} />
          <text x={700} y={178} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">ROLLBACK;</text>
          <text x={700} y={198} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">reverted ✗</text>

          {/* Bottom caption */}
          <text x={390} y={240} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">autocommit = OFF inside BEGIN block · explicit close required</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>BEGIN ──► opens TX</span>
          <span>COMMIT ──► success</span>
          <span>ROLLBACK ──► fail</span>
        </div>
      </Win>

      {/* RIGHT: COMMIT vs ROLLBACK comparison panels */}
      <Win x={940} y={180} w={900} h={720} title="execution branch ──► COMMIT vs ROLLBACK outcomes" accent={C.green} opacity={clamp(lin(f, t(110), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          two possible outcomes from BEGIN ──► DML ──► branch
        </div>

        {/* Branch chip */}
        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{branchP > 0.5 ? 'COMMIT path ✓' : '...'}</Chip>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>{branchP > 0.5 ? 'ROLLBACK path' : '...'}</Chip>
        </div>

        {/* SVG branching diagram */}
        <svg width={880} height={440} style={{position: 'absolute', left: 10, top: 60}}>
          {/* BEGIN node at top */}
          <rect x={380} y={10} width={140} height={60} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.amber}66)`}} />
          <text x={450} y={38} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEGIN;</text>
          <text x={450} y={58} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">transaction start</text>

          {/* DML block */}
          <line x1={450} y1={70} x2={450} y2={100} stroke={C.amber} strokeWidth={3} />
          <polygon points="444,94 456,94 450,108" fill={C.amber} />
          <rect x={340} y={110} width={220} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={10} />
          <text x={450} y={142} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML statements execute</text>

          {/* Branch point */}
          <line x1={450} y1={160} x2={450} y2={190} stroke={C.amber} strokeWidth={3} />
          <circle cx={450} cy={195} r={8} fill={C.amber} />

          {/* Two branch lines */}
          {/* COMMIT path - green left */}
          <path d={`M 450 195 Q 450 240 200 240 L 200 280`} fill="none" stroke={C.green} strokeWidth={branchProg > 0.3 ? 4 : 2} strokeDasharray={branchProg > 0.5 ? 'none' : '6 4'} style={{filter: branchProg > 0.5 ? `drop-shadow(0 0 8px ${C.green})` : 'none'}} />
          <text x={280} y={220} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700}>success path →</text>

          {/* ROLLBACK path - red right */}
          <path d={`M 450 195 Q 450 240 700 240 L 700 280`} fill="none" stroke={C.red} strokeWidth={branchProg > 0.3 ? 4 : 2} strokeDasharray={branchProg > 0.5 ? 'none' : '6 4'} style={{filter: branchProg > 0.5 ? `drop-shadow(0 0 8px ${C.red})` : 'none'}} />
          <text x={560} y={220} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700}>← failure path</text>

          {/* COMMIT outcome box */}
          <rect x={60} y={280} width={280} height={150} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 14px ${C.green}66)`}} />
          <text x={200} y={310} fill={C.green} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">COMMIT;</text>
          <text x={200} y={340} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">→ permanent disk write</text>
          <text x={200} y={360} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">WAL flushed · fsync()</text>
          <text x={200} y={378} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">visible to all sessions</text>
          <text x={200} y={400} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{permP > 0.5 ? '✓ changes permanent' : '...'}</text>

          {/* ROLLBACK outcome box */}
          <rect x={560} y={280} width={280} height={150} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 14px ${C.red}66)`}} />
          <text x={700} y={310} fill={C.red} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">ROLLBACK;</text>
          <text x={700} y={340} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">→ full state reversal</text>
          <text x={700} y={360} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">all DML undone</text>
          <text x={700} y={378} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">DB returns to pre-BEGIN</text>
          <text x={700} y={400} fill={C.red} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{revP > 0.5 ? '✗ changes reverted' : '...'}</text>

          {/* Status checks */}
          {permP > 0.5 ? (
            <g>
              <circle cx={28} cy={355} r={14} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} />
              <text x={28} y={360} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓</text>
            </g>
          ) : null}
          {revP > 0.5 ? (
            <g>
              <circle cx={852} cy={355} r={14} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} />
              <text x={852} y={360} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✗</text>
            </g>
          ) : null}
        </svg>

        {/* Outcome summary footer */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 540, display: 'flex', gap: 14}}>
          <div style={{flex: 1, padding: '14px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`, opacity: clamp(permP)}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, marginBottom: 4}}>✓ COMMIT Outcome</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text, lineHeight: 1.5}}>
              all DML made permanent · WAL flushed to disk · visible to other sessions · power-fail safe · cannot be undone.
            </div>
          </div>
          <div style={{flex: 1, padding: '14px', border: `2px solid ${C.red}`, borderRadius: 12, background: `${C.red}0d`, opacity: clamp(revP)}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700, marginBottom: 4}}>✗ ROLLBACK Outcome</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.text, lineHeight: 1.5}}>
              all DML reverted · DB restored to pre-BEGIN state · changes discarded · trigger / app errors or explicit cancel.
            </div>
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>COMMIT ──► permanent ✓</span>
          <span>two possible outcomes</span>
          <span style={{color: C.red}}>ROLLBACK ──► reverted ✗</span>
        </div>
      </Win>

      <Caption text="BEGIN ──► Autocommit OFF ──► COMMIT (permanent ✓) OR ROLLBACK (reverted ✗)" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
