import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Sql, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec, typed} from '../kit';

// SC03 (85-130s): infinite loop hazard vs termination conditions.
// Anchors (s): 86.2 warning | 98.0 empty set stops | 107.4 cyclic data | 114.8 termination condition | 121.6 level < 5 | 123.5 path array
const S = START.s3;
const t = (g: number) => sec(g - S);
const RING = [
  {n: 'Ahmed', a: -90},
  {n: 'Omar', a: 30},
  {n: 'Hany', a: 150},
];
const ROWS = [
  {l: 'level 1', v: '1 row', ok: true},
  {l: 'level 2', v: '2 rows', ok: true},
  {l: 'level 3', v: '3 rows', ok: true},
  {l: 'level 4', v: '2 rows', ok: true},
  {l: 'level 5', v: '∅ empty set → STOP', ok: false},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const shieldAt = t(114.8);
  const shield = clamp(lin(f, shieldAt, 22));
  const frozen = f >= shieldAt + 22;
  const spinStart = t(86.2);
  const spin = frozen ? (shieldAt + 22 - spinStart) * 5 : Math.max(0, f - spinStart) * 5;
  const code = typed('WHERE h.level < 5', f, t(121.6), 0.7);
  const warn = clamp(pop(f, t(94)));
  const cyc = clamp(lin(f, t(107.4), 14));
  const col = frozen ? C.green : C.red;
  const cx = 430;
  const cy = 450;
  const R = 150;
  return (
    <Stage dur={1350} inFx="up" outFx="down">
      <TopBadge text="الحماية من الحلقات | Termination Conditions" from={sec(1)} to={sec(40)} color={C.red} />

      <Win x={80} y={180} w={860} h={640} title="cyclic data · infinite loop" accent={col} opacity={clamp(lin(f, t(86.2), 14))}>
        <svg width={860} height={584} style={{position: 'absolute', left: 0, top: 0}}>
          <g transform={`rotate(${spin} ${cx} ${cy - 236})`}>
            <circle cx={cx} cy={cy - 236} r={R} fill="none" stroke={col} strokeWidth={6} strokeDasharray="30 20" opacity={0.8} style={{filter: `drop-shadow(0 0 12px ${col})`}} />
            <polygon points={`${cx + R - 14},${cy - 236 - 6} ${cx + R + 14},${cy - 236 - 6} ${cx + R},${cy - 236 + 22}`} fill={col} />
          </g>
          {RING.map((r, i) => {
            const x = cx + R * Math.cos((r.a * Math.PI) / 180);
            const y = cy - 236 + R * Math.sin((r.a * Math.PI) / 180);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={42} fill={C.card} stroke={col} strokeWidth={4} />
                <text x={x} y={y + 8} textAnchor="middle" fill={C.text} fontFamily={MONO} fontSize={22} fontWeight={700}>{r.n}</text>
              </g>
            );
          })}
        </svg>
        <div dir="ltr" style={{position: 'absolute', left: 40, right: 40, top: 410, fontFamily: MONO, fontSize: 24, color: C.muted, textAlign: 'center', opacity: cyc}}>
          Ahmed manages Omar · Omar manages Hany · Hany manages Ahmed
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 80, right: 80, top: 36, height: 90, borderRadius: 18, border: `3px solid ${C.red}`, background: `${C.bg}f2`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: warn * (frozen ? 0 : 1), transform: `scale(${0.85 + 0.15 * warn})`, fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.red, boxShadow: `0 0 26px ${C.red}77`}}>
          <Warn size={50} /> Infinite Loop Warning!
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 0, height: 20 + 380 * shield, background: `linear-gradient(${C.green}00, ${C.green}33)`, borderBottom: `5px solid ${C.green}`, boxShadow: `0 8px 24px ${C.green}`, opacity: shield > 0 ? 1 : 0, display: shield >= 1 ? 'none' : 'block'}} />
        <div dir="ltr" style={{position: 'absolute', left: 40, right: 40, top: 480, textAlign: 'center', fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green, opacity: clamp(lin(f, shieldAt + 22, 12))}}>
          ✓ blocked by the termination condition
        </div>
      </Win>

      <Win x={980} y={180} w={860} h={640} title="safe recursion" accent={C.green} opacity={clamp(lin(f, t(98.0), 14))}>
        {ROWS.map((r, i) => {
          const p = clamp(lin(f, t(98.0 + i * 1.5), 12));
          return (
            <div key={i} dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 30, right: 30, top: 20 + i * 68, height: 58, borderRadius: 12, border: `2px solid ${r.ok ? C.border : C.green}`, background: r.ok ? 'transparent' : `${C.green}22`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontFamily: MONO, fontSize: 28, opacity: p, transform: `translateX(${(1 - p) * 30}px)`, boxShadow: r.ok ? 'none' : `0 0 22px ${C.green}88`}}>
              <span style={{color: C.muted}}>{r.l}</span>
              <span style={{color: r.ok ? C.text : C.green, fontWeight: 700}}>{r.v}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 30, top: 380, opacity: clamp(pop(f, t(114.8)))}}><Chip color={C.amber} style={{fontSize: 26}}>Termination Condition · max depth</Chip></div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 450, fontFamily: MONO, fontSize: 36}}><Sql text={code} /></div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 520, opacity: clamp(pop(f, t(123.5)))}}><Chip color={C.purple} style={{fontSize: 22}}>or track a path array · block repeats</Chip></div>
      </Win>
      <Caption text="Missing Termination Condition ──► Infinite Loop Hazard (Server Crash)" from={t(88)} to={t(106)} tone="danger" />
      <Caption text="Empty Set Check / Max Depth Limit ──► Safely Stops Recursive Execution" from={t(113)} to={sec(44.5)} tone="ok" />
    </Stage>
  );
};
