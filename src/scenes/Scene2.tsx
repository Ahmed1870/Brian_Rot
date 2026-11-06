import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Partial Recovery Comparison — Without SAVEPOINT (full crash) vs With SAVEPOINT (rescue)
// Anchors: 41.0 crash | 45.0 without savepoint | 52.0 ROLLBACK TO SAVEPOINT | 60.0 rescue | 68.0 prior work | 75.0 green | 80.0 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

// Shared step set used in both panels
const STEPS = [
  {label: 'BEGIN', desc: 'open', kind: 'start'},
  {label: 'INSERT order', desc: 'step 1', kind: 'dml'},
  {label: 'UPDATE stock', desc: 'step 2', kind: 'dml'},
  {label: 'DELETE coupon', desc: 'ERROR', kind: 'error'},
  {label: 'COMMIT', desc: 'close', kind: 'close'},
];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const compP = clamp(lin(f, t(41.5), 14));
  const withoutP = clamp(lin(f, t(45), sec(6)));
  const withP = clamp(lin(f, t(52), sec(6)));
  // Crash animation on the left (without savepoint)
  const crashProg = clamp(lin(f, t(45), sec(8)));
  // Rescue animation on the right (with savepoint)
  const rescueProg = clamp(lin(f, t(52), sec(8)));
  const priorP = pop(f, t(68));
  const greenP = pop(f, t(75));
  const sealP = pop(f, t(80));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="مقارنة الاسترداد الجزئي | Partial Recovery — Without vs With SAVEPOINT" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* Header banner */}
      <Win x={80} y={170} w={1760} h={130} title="partial recovery comparison ──► same steps · two outcomes" accent={C.blue} opacity={compP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.blue}}>
          Without SAVEPOINT ──► full ROLLBACK (all DML lost)  ·  With SAVEPOINT ──► ROLLBACK TO (only error reverted)
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 50, display: 'flex', gap: 18, justifyContent: 'center'}}>
          <Chip color={C.red} style={{fontSize: 16, padding: '6px 18px', opacity: clamp(withoutP)}}>✗ Without SAVEPOINT · full crash</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '6px 18px', opacity: clamp(withP)}}>✓ With SAVEPOINT · partial rescue</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '6px 18px'}}>same DML · same error · different outcome</Chip>
        </div>
      </Win>

      {/* LEFT: Without SAVEPOINT — full crash */}
      <Win x={80} y={320} w={860} h={580} title="without SAVEPOINT ──► full ROLLBACK · all DML lost" accent={C.red} opacity={withoutP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
          DELETE fails ──► no anchor ──► ROLLBACK reverts EVERYTHING
        </div>

        <div style={{position: 'absolute', right: 18, top: 14}}>
          <Chip color={crashProg > 0.6 ? C.red : C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            {crashProg > 0.6 ? '✗ Full Crash' : 'running...'}
          </Chip>
        </div>

        <svg width={820} height={490} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Steps */}
          {STEPS.map((s, i) => {
            const itemProg = clamp((crashProg * STEPS.length) - i);
            const isError = s.kind === 'error';
            const isClose = s.kind === 'close';
            const crashed = crashProg > 0.5;
            // Without savepoint: all steps lost (red) after crash
            const color = crashed ? C.red : (isError ? C.red : (s.kind === 'start' ? C.amber : (isClose ? C.green : C.blue)));
            const y = 30 + i * 70;
            return (
              <g key={i} style={{opacity: clamp(itemProg)}}>
                <rect x={20} y={y} width={380} height={56} fill={`${color}22`} stroke={color} strokeWidth={crashed ? 2 : 3} rx={10} style={crashed ? {filter: 'none'} : (isError ? {filter: `drop-shadow(0 0 8px ${C.red}55)`} : undefined)} />
                <text x={40} y={y + 26} fill={color} fontSize={16} fontFamily={MONO} fontWeight={700}>{s.label}</text>
                <text x={40} y={y + 46} fill={C.muted} fontSize={12} fontFamily={MONO}>{s.desc}</text>
                {/* Status indicator on right */}
                {crashed && !isClose ? (
                  <g>
                    <circle cx={380} cy={y + 28} r={14} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} />
                    <line x1={372} y1={20} x2={388} y2={36} stroke={C.red} strokeWidth={3} strokeLinecap="round" transform={`translate(0, ${y - 20})`} />
                    <line x1={388} y1={20} x2={372} y2={36} stroke={C.red} strokeWidth={3} strokeLinecap="round" transform={`translate(0, ${y - 20})`} />
                  </g>
                ) : null}
                {/* Connector arrow */}
                {i < STEPS.length - 1 ? (
                  <g>
                    <line x1={210} y1={y + 56} x2={210} y2={y + 70} stroke={crashed ? C.red : C.border} strokeWidth={2} />
                  </g>
                ) : null}
                {/* Strike-through when crashed */}
                {crashed && !isClose ? <line x1={20} y1={y + 28} x2={360} y2={y + 28} stroke={C.red} strokeWidth={2} strokeDasharray="6 4" opacity={0.7} /> : null}
              </g>
            );
          })}

          {/* Full ROLLBACK banner */}
          {crashProg > 0.7 ? (
            <g style={{opacity: clamp(pop(f, t(60)))}}>
              <rect x={420} y={150} width={380} height={200} fill={`${C.red}11`} stroke={C.red} strokeWidth={3} strokeDasharray="8 5" rx={14} style={{filter: `drop-shadow(0 0 14px ${C.red}55)`}} />
              <text x={610} y={190} fill={C.red} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">✗ Full ROLLBACK</text>
              <text x={610} y={220} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">all DML reverted</text>
              <text x={610} y={244} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">INSERT lost ✗</text>
              <text x={610} y={268} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">UPDATE lost ✗</text>
              <text x={610} y={292} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">COMMIT never reached</text>
              <text x={610} y={324} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">no partial recovery</text>
            </g>
          ) : null}

          {/* Bottom outcome label */}
          <text x={410} y={460} fill={crashProg > 0.5 ? C.red : C.muted} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">
            {crashProg > 0.5 ? '✗ entire transaction reverted · prior work lost' : 'executing DML block...'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>no SAVEPOINT</span>
          <span>1 error → all lost ✗</span>
          <span>full ROLLBACK</span>
        </div>
      </Win>

      {/* RIGHT: With SAVEPOINT — partial rescue */}
      <Win x={960} y={320} w={880} h={580} title="with SAVEPOINT ──► ROLLBACK TO · only error reverted" accent={C.green} opacity={withP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          SAVEPOINT sp_b ──► ROLLBACK TO sp_b ──► prior DML preserved
        </div>

        <div style={{position: 'absolute', right: 18, top: 14}}>
          <Chip color={rescueProg > 0.6 ? C.green : C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            {rescueProg > 0.6 ? '✓ Partial Rescue' : 'rolling back to sp_b...'}
          </Chip>
        </div>

        <svg width={840} height={490} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Steps with SAVEPOINT markers */}
          {STEPS.map((s, i) => {
            const itemProg = clamp((rescueProg * STEPS.length) - i);
            const isError = s.kind === 'error';
            const isClose = s.kind === 'close';
            const rescued = rescueProg > 0.5;
            // With savepoint: only error reverted, others preserved (green)
            const color = rescued ? (isError ? C.red : (s.kind === 'start' ? C.amber : (isClose ? C.green : C.green))) : (isError ? C.red : (s.kind === 'start' ? C.amber : (isClose ? C.green : C.blue)));
            const y = 30 + i * 70;
            return (
              <g key={i} style={{opacity: clamp(itemProg)}}>
                <rect x={20} y={y} width={380} height={56} fill={`${color}22`} stroke={color} strokeWidth={rescued && !isError ? 3 : 2} rx={10} style={rescued && !isError ? {filter: `drop-shadow(0 0 6px ${C.green}55)`} : (isError ? {filter: `drop-shadow(0 0 8px ${C.red}55)`} : undefined)} />
                <text x={40} y={y + 26} fill={color} fontSize={16} fontFamily={MONO} fontWeight={700}>{s.label}</text>
                <text x={40} y={y + 46} fill={C.muted} fontSize={12} fontFamily={MONO}>{s.desc}</text>
                {/* Status indicator */}
                {rescued && !isClose ? (
                  <g>
                    {isError ? (
                      <>
                        <circle cx={380} cy={y + 28} r={14} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} />
                        <line x1={372} y1={20} x2={388} y2={36} stroke={C.red} strokeWidth={3} strokeLinecap="round" transform={`translate(0, ${y - 20})`} />
                        <line x1={388} y1={20} x2={372} y2={36} stroke={C.red} strokeWidth={3} strokeLinecap="round" transform={`translate(0, ${y - 20})`} />
                      </>
                    ) : (
                      <>
                        <circle cx={380} cy={y + 28} r={14} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} />
                        <polyline points="372,28 378,34 390,22" fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" transform={`translate(0, ${y - 20})`} />
                      </>
                    )}
                  </g>
                ) : null}
                {i < STEPS.length - 1 ? (
                  <g>
                    <line x1={210} y1={y + 56} x2={210} y2={y + 70} stroke={rescued ? C.green : C.border} strokeWidth={2} />
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* SAVEPOINT marker labels */}
          <g style={{opacity: clamp(rescueProg)}}>
            <rect x={410} y={82} width={200} height={26} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
            <text x={510} y={100} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">SAVEPOINT sp_b (after UPDATE)</text>
            <line x1={410} y1={95} x2={400} y2={95} stroke={C.blue} strokeWidth={2} strokeDasharray="4 3" />
          </g>

          {/* Partial rescue banner */}
          {rescueProg > 0.7 ? (
            <g style={{opacity: clamp(pop(f, t(60)))}}>
              <rect x={420} y={150} width={380} height={200} fill={`${C.green}11`} stroke={C.green} strokeWidth={3} strokeDasharray="8 5" rx={14} style={{filter: `drop-shadow(0 0 14px ${C.green}55)`}} />
              <text x={610} y={190} fill={C.green} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ ROLLBACK TO sp_b</text>
              <text x={610} y={220} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">only DELETE reverted</text>
              <text x={610} y={244} fill={C.green} fontSize={13} fontFamily={MONO} textAnchor="middle">INSERT preserved ✓</text>
              <text x={610} y={268} fill={C.green} fontSize={13} fontFamily={MONO} textAnchor="middle">UPDATE preserved ✓</text>
              <text x={610} y={292} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">COMMIT still reachable</text>
              <text x={610} y={324} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">partial recovery ✓</text>
            </g>
          ) : null}

          {/* Bottom outcome label */}
          <text x={420} y={460} fill={rescueProg > 0.5 ? C.green : C.muted} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">
            {rescueProg > 0.5 ? '✓ prior DML preserved · only error reverted' : 'executing DML block...'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>SAVEPOINT sp_b</span>
          <span>1 error → only error lost</span>
          <span>partial rescue ✓</span>
        </div>
      </Win>

      {/* Prior work + green seals */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(priorP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={priorP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Prior Work Preserved ✓</div>
        </div>
      </div>

      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(greenP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`}}>
          <Check p={greenP} size={36} color={C.amber} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700}}>Partial Recovery Seal ✓</div>
        </div>
      </div>

      <Caption text="Without SAVEPOINT ──► Full Crash ✗  ·  With SAVEPOINT ──► ROLLBACK TO ──► Rescue ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
