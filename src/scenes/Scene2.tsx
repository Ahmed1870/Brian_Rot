import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {NORMALIZATION_STEPS} from '../data';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, Warn, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Database Normalization — 1NF (red), 2NF (amber), 3NF (green)
// Show problem → fix transition with before/after table snippets
// Anchors: 41.5 normalization engine | 45 1NF | 52 2NF | 60 3NF | 68 anomaly | 75 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'red' ? C.red : k === 'amber' ? C.amber : C.green);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const engineP = pop(f, t(41.5));
  const oneP = pop(f, t(45));
  const twoP = pop(f, t(52));
  const threeP = pop(f, t(60));
  const anomalyP = pop(f, t(68));
  const sealP = pop(f, t(75));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="قواعد التطبيع الهيكلي | 1NF Atomic · 2NF Full Dependency · 3NF Transitive Elimination (Module 16)" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* THREE normalization steps side-by-side */}
      {NORMALIZATION_STEPS.map((step, i) => {
        const color = colorOf(step.color);
        const cardP = clamp(pop(f, t(41 + i * 8)));
        const isActive = i === 0 ? oneP > 0.4 : i === 1 ? twoP > 0.4 : threeP > 0.4;
        const x = 80 + i * 600;
        const w = 580;
        return (
          <Win key={step.nf} x={x} y={170} w={w} h={580} title={`normalization step ──► ${step.nf} ${step.title} (${step.color})`} accent={color} opacity={cardP}>
            <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color}}>
              {step.nf} · {step.title}
            </div>

            <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
              <Chip color={color} style={{fontSize: 12, padding: '4px 10px'}}>{isActive ? 'active ✓' : '...'}</Chip>
            </div>

            <svg width={540} height={480} style={{position: 'absolute', left: 18, top: 50}}>
              {/* NF badge (big) */}
              <g style={{opacity: clamp(cardP)}}>
                <rect x={180} y={10} width={180} height={50} fill={`${color}33`} stroke={color} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${6 + pulse * 4}px ${color})`}} />
                <text x={270} y={42} fill={color} fontSize={26} fontFamily={MONO} fontWeight={700} textAnchor="middle">{step.nf}</text>
              </g>

              {/* PROBLEM box (red-ish warning) */}
              <g style={{opacity: clamp(cardP)}}>
                <text x={270} y={90} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">PROBLEM</text>
                <rect x={20} y={100} width={500} height={50} fill={`${C.red}11`} stroke={C.red} strokeWidth={2} strokeDasharray="5 4" rx={8} />
                <text x={270} y={130} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{step.problem}</text>
              </g>

              {/* BEFORE example (un-normalized) */}
              <g style={{opacity: clamp(cardP)}}>
                <text x={20} y={180} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700}>BEFORE</text>
                <rect x={20} y={190} width={500} height={40} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1.5} rx={6} />
                <text x={270} y={216} fill={C.red} fontSize={11} fontFamily={MONO} textAnchor="middle" textDecoration="line-through">{step.example_before}</text>
              </g>

              {/* Arrow down */}
              <g style={{opacity: clamp(cardP)}}>
                <line x1={270} y1={234} x2={270} y2={264} stroke={color} strokeWidth={3} strokeDasharray="6 4" opacity={0.8} />
                <polygon points="264,258 276,258 270,272" fill={color} />
                <text x={300} y={252} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700}>{step.nf} fix</text>
              </g>

              {/* FIX description */}
              <g style={{opacity: clamp(cardP)}}>
                <rect x={20} y={280} width={500} height={50} fill={`${color}11`} stroke={color} strokeWidth={2} rx={8} />
                <text x={270} y={310} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{step.fix}</text>
              </g>

              {/* AFTER example (normalized) */}
              <g style={{opacity: clamp(cardP)}}>
                <text x={20} y={360} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700}>AFTER · NORMALIZED</text>
                <rect x={20} y={370} width={500} height={50} fill={`${color}22`} stroke={color} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 6px ${color}66)`}} />
                <text x={270} y={396} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{step.example_after}</text>
              </g>

              {/* Status row at bottom */}
              <g style={{opacity: clamp(cardP)}}>
                <text x={270} y={450} fill={color} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">
                  {step.nf === '1NF' ? 'eliminates repeating groups' : step.nf === '2NF' ? 'eliminates partial dependencies' : 'eliminates transitive dependencies'}
                </text>
              </g>
            </svg>

            <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
              <span style={{color: C.red}}>before</span>
              <span style={{color}}>{step.nf} · applied</span>
              <span style={{color: C.green}}>normalized ✓</span>
            </div>
          </Win>
        );
      })}

      {/* Bottom: normalization engine pipeline summary */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 770, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '16px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 28px ${C.green}44`, flexWrap: 'wrap'}}>
          <Check p={sealP} size={44} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Normalization Engine · Sealed ✓</div>
          <div style={{display: 'flex', gap: 8, marginLeft: 8}}>
            <Chip color={C.red} style={{fontSize: 14, padding: '4px 12px'}}>1NF atomic</Chip>
            <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>2NF full dep</Chip>
            <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>3NF transitive ✓</Chip>
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginLeft: 'auto'}}>eliminates redundancy · prevents data anomalies under heavy traffic</div>
        </div>
      </div>

      {/* Anomaly warning panel */}
      {anomalyP > 0.5 ? (
        <div style={{position: 'absolute', left: 80, right: 80, top: 870, opacity: clamp(anomalyP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 22px', border: `2px solid ${C.red}`, borderRadius: 14, background: `${C.red}0d`}}>
            <Warn size={36} color={C.red} />
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700}}>Anomalies prevented: insertion · update · deletion — guaranteed by 3NF compliance</div>
          </div>
        </div>
      ) : null}

      <Caption text="1NF ──► atomic values ──► 2NF ──► full dependency ──► 3NF ──► transitive elimination ──► data integrity ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
