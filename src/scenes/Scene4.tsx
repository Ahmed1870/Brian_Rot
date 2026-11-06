import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Warn, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): Deadlock Detection & Error 40P01
// Anchors: 131.0 deadlock | 136.0 circular | 140.0 timeout | 145.0 detector | 150.0 40P01 | 155.0 abort | 160.0 seal | 165.0 retry
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const dlP = clamp(lin(f, t(131.5), 14));
  const circP = clamp(lin(f, t(136), 14));
  const timeoutP = clamp(lin(f, t(140), 14));
  const detectorP = pop(f, t(145));
  const errP = pop(f, t(150));
  const abortP = pop(f, t(155));
  const sealP = pop(f, t(160));
  const retryP = pop(f, t(165));

  // Deadlock timeout countdown (e.g., 1s default in PG)
  const countdownProg = clamp(lin(f, t(140), sec(10)));
  const countdownLeft = Math.max(0, 1 - countdownProg);

  // Circular loop animation - rotating arrow around the deadlock cycle
  const loopAngle = (f * 4) % 360;

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="اكتشاف الجمود وخطأ 40P01 | Deadlock Detection & Error 40P01" from={sec(2)} to={sec(40)} color={C.red} />

      {/* LEFT: Circular dependency loop (TX A ↔ TX B) */}
      <Win x={80} y={180} w={860} h={460} title="circular dependency ──► deadlock loop (TX A ↔ TX B)" accent={C.red} opacity={dlP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
          TX A holds row 101 ──► waits for row 202 · TX B holds row 202 ──► waits for row 101
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>{circP > 0.5 ? 'cycle ✓' : '...'}</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{timeoutP > 0.5 ? 'timeout running' : '...'}</Chip>
        </div>

        <svg width={820} height={360} style={{position: 'absolute', left: 20, top: 60}}>
          {/* TX A block (top-left) */}
          <rect x={40} y={50} width={220} height={100} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 10px ${C.blue}44)`}} />
          <text x={150} y={80} fill={C.blue} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX A</text>
          <text x={150} y={104} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">HOLDS: row 101</text>
          <text x={150} y={122} fill={C.red} fontSize={11} fontFamily={MONO} textAnchor="middle">WAITS: row 202</text>
          <text x={150} y={140} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">SELECT ... FOR UPDATE;</text>

          {/* TX B block (top-right) */}
          <rect x={560} y={50} width={220} height={100} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 10px ${C.purple}44)`}} />
          <text x={670} y={80} fill={C.purple} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX B</text>
          <text x={670} y={104} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">HOLDS: row 202</text>
          <text x={670} y={122} fill={C.red} fontSize={11} fontFamily={MONO} textAnchor="middle">WAITS: row 101</text>
          <text x={670} y={140} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">SELECT ... FOR UPDATE;</text>

          {/* Circular loop arrows (red) - top arc TX A → TX B */}
          <path d="M 260 100 Q 410 30 560 100" fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="8 4" style={{filter: `drop-shadow(0 0 6px ${C.red})`}} />
          <polygon points="552,92 552,108 568,100" fill={C.red} />
          <text x={410} y={50} fill={C.red} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">waits for row 202 →</text>

          {/* Bottom arc TX B → TX A (forming the cycle) */}
          <path d="M 560 130 Q 410 220 260 130" fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="8 4" style={{filter: `drop-shadow(0 0 6px ${C.red})`}} />
          <polygon points="268,122 268,138 252,130" fill={C.red} />
          <text x={410} y={210} fill={C.red} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">← waits for row 101</text>

          {/* Rotating cycle indicator */}
          <g transform={`rotate(${loopAngle} 410 130)`}>
            <circle cx={410} cy={130} r={18} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="30 6" style={{filter: `drop-shadow(0 0 8px ${C.red})`}} />
            <polygon points="416,124 416,136 428,130" fill={C.red} />
          </g>

          {/* Deadlock warning */}
          {circP > 0.5 ? (
            <g style={{opacity: clamp(pop(f, t(138)))}}>
              <rect x={250} y={240} width={320} height={50} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 14px ${C.red})`}} />
              <text x={410} y={272} fill={C.red} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚠ Deadlock cycle detected</text>
            </g>
          ) : null}

          <text x={410} y={320} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">both TXs wait forever without intervention ──► Postgres must break the cycle</text>
          <text x={410} y={340} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">deadlock_timeout (1s default) ──► Deadlock Detector wakes up</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>TX A ──► waits</span>
          <span>cycle ✓</span>
          <span>TX B ──► waits</span>
        </div>
      </Win>

      {/* RIGHT: Deadlock Detector + 40P01 error capsule */}
      <Win x={980} y={180} w={860} h={720} title="deadlock detector ──► 40P01 error capsule ──► TX B aborted" accent={C.amber} opacity={timeoutP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          Deadlock Detector (amber clock) ──► counts deadlock_timeout ──► breaks the cycle
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{detectorP > 0.5 ? 'Detector ON' : '...'}</Chip>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>{errP > 0.5 ? '40P01 raised' : '...'}</Chip>
        </div>

        <svg width={820} height={620} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Deadlock Detector clock (amber, ticking down) */}
          <g style={{opacity: clamp(detectorP)}}>
            <circle cx={200} cy={120} r={70} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={4} style={{filter: `drop-shadow(0 0 14px ${C.amber}66)`}} />
            {/* Clock tick marks */}
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg - 90) * Math.PI / 180;
              return <line key={deg} x1={200 + Math.cos(rad) * 60} y1={120 + Math.sin(rad) * 60} x2={200 + Math.cos(rad) * 68} y2={120 + Math.sin(rad) * 68} stroke={C.amber} strokeWidth={3} />;
            })}
            {/* Hour hand (fixed) */}
            <line x1={200} y1={120} x2={200} y2={90} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
            {/* Minute hand (rotates with countdown) */}
            <line
              x1={200}
              y1={120}
              x2={200 + Math.cos((countdownProg * 360 - 90) * Math.PI / 180) * 50}
              y2={120 + Math.sin((countdownProg * 360 - 90) * Math.PI / 180) * 50}
              stroke={C.amber}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={200} cy={120} r={4} fill={C.amber} />
            <text x={200} y={215} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Deadlock Detector</text>
            <text x={200} y={235} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">deadlock_timeout ≈ 1s</text>
            <text x={200} y={255} fill={countdownLeft < 0.2 ? C.red : C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">
              {countdownLeft < 0.05 ? 'TRIGGERED!' : `countdown: ${(countdownLeft * 1.0).toFixed(2)}s`}
            </text>
          </g>

          {/* Right side: deadlock_timeout config */}
          <g style={{opacity: clamp(detectorP)}}>
            <rect x={320} y={60} width={470} height={130} fill={`${C.deep}`} stroke={C.amber} strokeWidth={2} rx={10} />
            <text x={335} y={86} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700}>── postgresql.conf ──</text>
            <text x={335} y={112} fill={C.muted} fontSize={12} fontFamily={MONO}>deadlock_timeout = 1s</text>
            <text x={335} y={134} fill={C.muted} fontSize={11} fontFamily={MONO}>log_lock_waits = on</text>
            <text x={335} y={154} fill={C.muted} fontSize={11} fontFamily={MONO}>lock_timeout = 0 (off)</text>
            <text x={335} y={174} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>✓ periodic check: every deadlock_timeout</text>
          </g>

          {/* Cycle break arrow */}
          {countdownLeft < 0.1 ? (
            <g style={{opacity: clamp(pop(f, t(149)))}}>
              <path d="M 200 220 L 200 290" stroke={C.red} strokeWidth={4} strokeDasharray="6 4" />
              <polygon points="192,284 208,284 200,300" fill={C.red} />
              <text x={200} y={270} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">break!</text>
            </g>
          ) : null}

          {/* 40P01 error capsule (purple) */}
          <g style={{opacity: clamp(errP)}}>
            <rect
              x={80}
              y={310}
              width={660}
              height={110}
              fill={`${C.purple}22`}
              stroke={C.purple}
              strokeWidth={4}
              rx={55}
              style={{filter: `drop-shadow(0 0 18px ${C.purple})`}}
            />
            <text x={410} y={350} fill={C.purple} fontSize={28} fontFamily={MONO} fontWeight={700} textAnchor="middle">40P01: deadlock_detected</text>
            <text x={410} y={378} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">ERROR:  deadlock detected · DETAIL:  Process ... waits for ShareLock on transaction ...</text>
            <text x={410} y={400} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">SQLSTATE: 40P01 ──► one TX aborted to break the cycle</text>
          </g>

          {/* TX B aborted status (right) */}
          <g style={{opacity: clamp(abortP)}}>
            <rect x={430} y={450} width={360} height={100} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 10px ${C.red}66)`}} />
            <text x={610} y={480} fill={C.red} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX B ──► ABORTED ✗</text>
            <text x={610} y={504} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">sacrificed to break the deadlock</text>
            <text x={610} y={522} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">ROLLBACK executed automatically</text>
            <text x={610} y={540} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">→ app should retry the transaction</text>
          </g>

          {/* TX A continues status (left) */}
          <g style={{opacity: clamp(abortP)}}>
            <rect x={40} y={450} width={360} height={100} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 10px ${C.green}44)`}} />
            <text x={220} y={480} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX A ──► CONTINUES ✓</text>
            <text x={220} y={504} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">acquires row 202 lock</text>
            <text x={220} y={522} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">proceeds to COMMIT ✓</text>
            <text x={220} y={540} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">→ completes successfully</text>
          </g>

          {/* Retry guidance banner */}
          {retryP > 0 ? (
            <g style={{opacity: clamp(retryP)}}>
              <rect x={40} y={570} width={750} height={40} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={8} style={{filter: `drop-shadow(0 0 8px ${C.amber}44)`}} />
              <text x={415} y={596} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">↻ App retries TX B ──► on retry both rows acquired in same order ──► no second deadlock</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>deadlock_timeout (1s)</span>
          <span>40P01 ──► TX B aborted</span>
          <span>TX A continues ✓</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 80, top: 670, width: 860, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Deadlock Auto-Resolved ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>40P01 ──► cycle broken ──► TX B ROLLBACK ──► TX A COMMIT</div>
          </div>
        </div>
      </div>

      {/* Retry guidance chip */}
      <div style={{position: 'absolute', left: 80, top: 790, width: 860, opacity: clamp(retryP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`}}>
          <Check p={retryP} size={32} color={C.amber} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.amber, fontWeight: 700}}>App retries TX B · acquire locks in deterministic order · idempotent ✓</div>
        </div>
      </div>

      <Caption text="Deadlock ──► Detector (1s) ──► 40P01 ──► TX B Abort ──► TX A Continues ──► Retry" from={t(150)} to={sec(40)} tone="danger" />
    </Stage>
  );
};
