import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC04 (130-170s): short-circuit evaluation inside PostgreSQL.
// Anchors (s): 131.2 engineering side | 144.0 first branch true | 150.1 no extra CPU | 152.3 fast tree evaluation | 162.3 response speed
const S = START.s4;
const t = (g: number) => sec(g - S);
const BR = [
  {l: "WHEN total_spent >= 10000", r: "'Gold'"},
  {l: "WHEN total_spent >= 5000", r: "'Silver'"},
  {l: "WHEN total_spent >= 1000", r: "'Bronze'"},
  {l: 'ELSE', r: "'Standard'"},
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const win = clamp(lin(f, t(131.2), 16));
  const hit = clamp(lin(f, t(144.0), 10));
  const cut = clamp(lin(f, t(144.0) + 8, 14));
  const ram = clamp(lin(f, t(150.1), 18));
  const cpu = clamp(lin(f, t(152.3), 24));
  const pulse = f > t(137) && f < t(144.0) ? 0.5 + 0.5 * Math.sin(f * 0.5) : 0;

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | PostgreSQL Short-Circuit Evaluation" from={sec(1)} to={sec(40)} color={C.blue} />

      <Win x={80} y={180} w={1000} h={700} title="Execution Branch Evaluator · total_spent = 12500" accent={C.blue} opacity={win}>
        {BR.map((b, i) => {
          const first = i === 0;
          const skipped = !first && cut > 0;
          const col = first && hit > 0 ? C.green : skipped ? '#475569' : i === 0 && pulse > 0 ? C.amber : C.blue;
          const p = clamp(lin(f, t(132.5 + i * 0.7), 14));
          return (
            <div key={i} dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 28, right: 28, top: 22 + i * 100, height: 84, borderRadius: 16, border: `3px solid ${col}`, background: `${col}${first && hit > 0 ? '30' : '14'}`, display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: MONO, fontSize: 28, color: skipped ? '#64748B' : C.text, opacity: p * (skipped ? 1 - 0.35 * cut : 1), boxShadow: first && hit > 0 ? `0 0 30px ${C.green}77` : pulse > 0 && first ? `0 0 ${20 * pulse}px ${C.amber}` : 'none', textDecoration: skipped ? 'line-through' : 'none'}}>
              <span style={{flex: 1}}>{b.l}</span>
              <span style={{color: skipped ? '#64748B' : C.text, fontWeight: 700, textDecoration: 'none'}}>{b.r}</span>
              <span style={{width: 250, textAlign: 'right', fontWeight: 700, textDecoration: 'none', color: first && hit > 0 ? C.green : '#64748B'}}>
                {first && hit > 0 ? 'TRUE · 0.0001s' : skipped ? '⏹ skipped' : ''}
              </span>
            </div>
          );
        })}
        {/* CPU efficiency */}
        <div dir="ltr" style={{position: 'absolute', left: 28, right: 28, top: 440, opacity: cpu}}>
          <div style={{fontFamily: MONO, fontSize: 24, color: C.muted}}>CPU cycles per row</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 10}}>
            <div style={{height: 36, width: 700 * cpu, borderRadius: 10, background: `${C.red}88`}} />
            <span style={{fontFamily: MONO, fontSize: 26, color: C.red}}>4 · all branches</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
            <div style={{height: 36, width: 175 * cpu, borderRadius: 10, background: C.green, boxShadow: `0 0 20px ${C.green}88`}} />
            <span style={{fontFamily: MONO, fontSize: 26, color: C.green}}>1 · short-circuit</span>
          </div>
        </div>
      </Win>

      <Win x={1120} y={180} w={720} h={700} title="RAM" accent={ram > 0.5 ? C.blue : C.border} opacity={win}>
        {BR.map((b, i) => {
          const live = i === 0;
          const iso = !live && ram > 0;
          return (
            <div key={i} dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 30 + (i % 2) * 330, top: 30 + Math.floor(i / 2) * 190, width: 300, height: 160, borderRadius: 16, border: `3px ${iso ? 'dashed' : 'solid'} ${live && hit > 0 ? C.blue : iso ? '#475569' : C.border}`, background: live && hit > 0 ? `${C.blue}22` : C.deep, color: iso ? '#64748B' : C.text, fontFamily: MONO, fontSize: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: live && hit > 0 ? `0 0 26px ${C.blue}88` : 'none'}}>
              <div style={{fontWeight: 700, fontSize: 28}}>branch {i + 1}</div>
              <div style={{fontSize: 22}}>{live && hit > 0 ? 'loaded ✓' : iso ? 'isolated · not read' : 'pending'}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 30, top: 430, opacity: clamp(pop(f, t(162.3)))}}>
          <Chip color={C.blue} style={{fontSize: 26}}>millions of rows · milliseconds</Chip>
        </div>
      </Win>

      <Caption text="PostgreSQL Evaluation Engine ──► Short-Circuiting in CASE WHEN Expressions" from={t(138)} to={t(150)} />
      <Caption text="CPU Efficiency ──► Bypasses Remaining Branches Upon First Match" from={t(153)} to={sec(39)} tone="ok" />
    </Stage>
  );
};
