import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ACID_PROPERTIES} from '../data';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): ACID Properties Breakdown — Atomicity · Consistency · Isolation · Durability
// Anchors: 41.0 ACID | 45.0 Atomicity | 52.0 Consistency | 60.0 Isolation | 68.0 Durability | 75.0 shield | 80.0 production
const S = START.s2;
const t = (g: number) => sec(g - S);

// Activation start times (in seconds) for each ACID property
const ACID_STARTS = [45, 52, 60, 68];

// Icon renderer per ACID letter
const AcIcon: React.FC<{icon: string; color: string; size?: number}> = ({icon, color, size = 60}) => {
  switch (icon) {
    case 'atom':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60">
          <ellipse cx={30} cy={30} rx={26} ry={10} fill="none" stroke={color} strokeWidth={2.5} />
          <ellipse cx={30} cy={30} rx={26} ry={10} fill="none" stroke={color} strokeWidth={2.5} transform="rotate(60 30 30)" />
          <ellipse cx={30} cy={30} rx={26} ry={10} fill="none" stroke={color} strokeWidth={2.5} transform="rotate(120 30 30)" />
          <circle cx={30} cy={30} r={5} fill={color} />
        </svg>
      );
    case 'balance':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60">
          <line x1={30} y1={6} x2={30} y2={48} stroke={color} strokeWidth={3} />
          <line x1={10} y1={18} x2={50} y2={18} stroke={color} strokeWidth={3} />
          <polygon points="6,28 14,28 10,18" fill="none" stroke={color} strokeWidth={2} />
          <polygon points="46,28 54,28 50,18" fill="none" stroke={color} strokeWidth={2} />
          <rect x={22} y={48} width={16} height={6} fill={color} />
        </svg>
      );
    case 'wall':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60">
          <rect x={8} y={14} width={18} height={14} fill="none" stroke={color} strokeWidth={2.5} />
          <rect x={30} y={14} width={18} height={14} fill="none" stroke={color} strokeWidth={2.5} />
          <rect x={18} y={32} width={20} height={14} fill="none" stroke={color} strokeWidth={2.5} />
          <rect x={8} y={32} width={8} height={14} fill="none" stroke={color} strokeWidth={2.5} />
          <rect x={40} y={32} width={12} height={14} fill="none" stroke={color} strokeWidth={2.5} />
        </svg>
      );
    case 'shield':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60">
          <path d="M30 6 L50 14 V30 C50 42 40 50 30 54 C20 50 10 42 10 30 V14 Z" fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
          <polyline points="20,30 27,37 42,22" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const acidP = clamp(lin(f, t(41.5), 14));
  const shieldP = pop(f, t(75));
  const prodP = pop(f, t(80));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="خصائص ACID الأربع | ACID Properties — Transaction Guarantees" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* Top: ACID banner with all four letters */}
      <Win x={80} y={170} w={1760} h={150} title="ACID ──► four transaction guarantees" accent={C.blue} opacity={acidP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.blue}}>
          Atomicity · Consistency · Isolation · Durability ──► zero data corruption
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 50, display: 'flex', gap: 18, justifyContent: 'center'}}>
          {ACID_PROPERTIES.map((p, i) => {
            const ap = clamp(pop(f, t(41.5 + i * 0.4)));
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 22px', border: `2px solid ${p.color}`, borderRadius: 14, background: `${p.color}0d`, opacity: clamp(ap), transform: `scale(${0.9 + 0.1 * clamp(ap)})`}}>
                <div style={{width: 44, height: 44, borderRadius: 10, background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 26, fontWeight: 700, color: p.color}}>{p.letter}</div>
                <div>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 17, fontWeight: 700, color: p.color}}>{p.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Win>

      {/* Four large ACID property blocks activating in sequence */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 350, display: 'flex', gap: 18}}>
        {ACID_PROPERTIES.map((p, i) => {
          const startSec = ACID_STARTS[i];
          const actP = clamp(lin(f, t(startSec), sec(6)));
          const isActive = actP > 0.5;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                position: 'relative',
                height: 480,
                borderRadius: 22,
                background: isActive ? `${p.color}14` : C.card,
                border: `3px solid ${isActive ? p.color : C.border}`,
                boxShadow: isActive ? `0 0 32px ${p.color}66` : '0 16px 40px rgba(2,6,23,0.5)',
                opacity: clamp(actP * 0.5 + 0.5),
                transform: `scale(${0.94 + 0.06 * clamp(actP)})`,
              }}
            >
              {/* Header bar */}
              <div style={{height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, borderBottom: `1px solid ${isActive ? p.color : C.border}`}}>
                <div style={{width: 52, height: 52, borderRadius: 12, background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 30, fontWeight: 700, color: p.color, border: `2px solid ${p.color}`}}>{p.letter}</div>
                <AcIcon icon={p.icon} color={isActive ? p.color : C.muted} size={44} />
              </div>
              {/* Property name + description */}
              <div style={{padding: '18px 16px', textAlign: 'center'}}>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: isActive ? p.color : C.muted, marginBottom: 10}}>{p.name}</div>
                <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text, lineHeight: 1.5, minHeight: 56}}>{p.desc}</div>
              </div>
              {/* Detail box */}
              <div style={{margin: '0 16px', padding: '12px 14px', border: `1px solid ${isActive ? p.color : C.border}`, borderRadius: 10, background: C.deep, fontFamily: MONO, fontSize: 12, color: C.text, lineHeight: 1.6, minHeight: 150}}>
                {i === 0 && (
                  <>
                    <div style={{color: p.color, fontWeight: 700, marginBottom: 4}}>All-or-Nothing</div>
                    <div style={{color: C.muted}}>BEGIN ──► DML block</div>
                    <div style={{color: C.muted}}>fail anywhere ──► ROLLBACK</div>
                    <div style={{color: C.muted}}>no partial writes ✓</div>
                  </>
                )}
                {i === 1 && (
                  <>
                    <div style={{color: p.color, fontWeight: 700, marginBottom: 4}}>Valid State</div>
                    <div style={{color: C.muted}}>constraints ✓</div>
                    <div style={{color: C.muted}}>triggers ✓</div>
                    <div style={{color: C.muted}}>cascade rules ✓</div>
                    <div style={{color: C.green}}>DB always consistent ✓</div>
                  </>
                )}
                {i === 2 && (
                  <>
                    <div style={{color: p.color, fontWeight: 700, marginBottom: 4}}>Concurrency</div>
                    <div style={{color: C.muted}}>TX1 ──┐</div>
                    <div style={{color: C.muted}}>TX2 ──┤ wall</div>
                    <div style={{color: C.muted}}>no interference ✓</div>
                    <div style={{color: C.green}}>serializable ✓</div>
                  </>
                )}
                {i === 3 && (
                  <>
                    <div style={{color: p.color, fontWeight: 700, marginBottom: 4}}>Crash-Proof</div>
                    <div style={{color: C.muted}}>WAL log flush</div>
                    <div style={{color: C.muted}}>fsync() on commit</div>
                    <div style={{color: C.muted}}>power-fail safe</div>
                    <div style={{color: C.green}}>permanent on disk ✓</div>
                  </>
                )}
              </div>
              {/* Status chip */}
              <div style={{position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', justifyContent: 'center'}}>
                <Chip color={isActive ? p.color : C.border} style={{fontSize: 13, padding: '4px 14px'}}>
                  {isActive ? (
                    <>
                      <Check p={1} size={20} color={p.color} /> Active
                    </>
                  ) : (
                    'idle'
                  )}
                </Chip>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shield badge — Zero Data Corruption Under System Crashes */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 855, display: 'flex', justifyContent: 'center', opacity: clamp(shieldP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 32px ${C.green}44`}}>
          <svg width={52} height={52} viewBox="0 0 60 60">
            <path d="M30 6 L50 14 V30 C50 42 40 50 30 54 C20 50 10 42 10 30 V14 Z" fill={`${C.green}22`} stroke={C.green} strokeWidth={3} strokeLinejoin="round" />
            <polyline points="20,30 27,37 42,22" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Zero Data Corruption Under System Crashes ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>ACID guarantees · production-grade integrity</div>
          </div>
          {prodP > 0 ? (
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 20, padding: '6px 16px', border: `2px solid ${C.amber}`, borderRadius: 999, background: `${C.amber}1a`}}>
              <Check p={1} size={22} color={C.amber} />
              <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700}}>Production-Ready</span>
            </div>
          ) : null}
        </div>
      </div>

      <Caption text="ACID ──► Atomicity · Consistency · Isolation · Durability ──► Zero Data Corruption" from={t(75)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
