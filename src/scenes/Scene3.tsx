import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {LIVE_CODING_QUERY, THINK_ALOUD_STEPS} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): Think Aloud & Live Coding Strategy
// Interview simulator: 5 Think Aloud steps + live coding query with CTEs and 0.4s execution
// Anchors: 86.0 Think Aloud | 92.0 Clarify | 100.0 CTEs | 105.0 Complexity | 110.0 Optimize | 120.0 sealed
const S = START.s3;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.green);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86), 14));
  const thinkP = pop(f, t(86));
  const stepsP = pop(f, t(92));
  const queryP = pop(f, t(100));
  const execP = pop(f, t(110));
  const prodP = pop(f, t(120));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Step reveal progress
  const stepReveal = clamp(lin(f, t(92), sec(15)));
  // Execution progress
  const execProg = clamp(lin(f, t(110), sec(8)));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="استراتيجية التفكير الصوتي | Think Aloud · Live Coding · CTEs · 0.4s Execution (Module 16)" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: Live coding query editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={880}
          h={560}
          title="live_coding_interview.sql · Think Aloud Solution (PostgreSQL 16)"
          lines={LIVE_CODING_QUERY}
          start={t(86)}
          cps={0.45}
          size={13}
          accent={C.amber}
          hl={1}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 745, width: 880, opacity: clamp(thinkP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Think Aloud golden rule</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>Think Aloud</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>Multi-stage CTEs</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>LAG · Window</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>0.4s execution</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>Interview pass ✓</Chip>
        </div>
      </div>

      {/* Production-ready bar */}
      <div style={{position: 'absolute', left: 80, top: 870, width: 880, opacity: clamp(prodP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={prodP} size={40} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Live Coding · Aced ✓ Think Aloud strategy · CTEs · 0.4s · interview passed</div>
        </div>
      </div>

      {/* RIGHT: Think Aloud steps + execution panel */}
      <Win x={980} y={170} w={860} h={730} title="think aloud strategy ──► 5 steps · live coding · 0.4s execution" accent={C.amber} opacity={clamp(lin(f, t(90), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.amber, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Think Aloud Method · 5 sequential steps · clarify → CTEs → code → complexity → optimize
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{execProg > 0.95 ? '0.4s ✓' : 'executing...'}</Chip>
        </div>

        <svg width={820} height={620} style={{position: 'absolute', left: 18, top: 70}}>
          {/* 5 Think Aloud steps */}
          <text x={410} y={10} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Think Aloud · 5 Steps</text>
          {THINK_ALOUD_STEPS.map((step, i) => {
            const color = colorOf(step.color);
            const p = clamp(stepReveal - i * 0.12);
            const isActive = i === Math.floor(stepReveal * 5) && stepReveal < 1;
            return (
              <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 20}px, 0)`}}>
                <rect x={20} y={30 + i * 70} width={780} height={56} fill={isActive ? `${color}33` : `${color}11`} stroke={color} strokeWidth={isActive ? 3 : 2} rx={10} style={isActive ? {filter: `drop-shadow(0 0 8px ${color})`} : {}} />
                <circle cx={50} cy={58 + i * 70} r={18} fill={`${color}22`} stroke={color} strokeWidth={2} />
                <text x={50} y={64 + i * 70} fill={color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{step.step}</text>
                <text x={85} y={52 + i * 70} fill={color} fontSize={13} fontFamily={MONO} fontWeight={700}>{step.title}</text>
                <text x={85} y={70 + i * 70} fill={C.muted} fontSize={10} fontFamily={MONO}>{step.desc}</text>
                {/* Icon */}
                <text x={770} y={64 + i * 70} fill={color} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{step.icon}</text>
              </g>
            );
          })}

          {/* Execution result panel */}
          <g style={{opacity: clamp(execP)}}>
            <rect x={20} y={400} width={780} height={130} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={410} y={425} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Execution Result · 0.4s ✓</text>
            {/* 4 KPI cards */}
            {[
              {label: 'Execution time', value: '0.4s', color: C.green, x: 40},
              {label: 'Index used', value: 'B-Tree', color: C.blue, x: 230},
              {label: 'CTEs', value: '2 stages', color: C.purple, x: 420},
              {label: 'Scan type', value: 'Index Scan', color: C.green, x: 610},
            ].map((k, i) => {
              const p = clamp(execProg - i * 0.15);
              return (
                <g key={i} style={{opacity: clamp(p)}}>
                  <rect x={k.x} y={440} width={160} height={70} fill={`${k.color}22`} stroke={k.color} strokeWidth={2} rx={8} />
                  <text x={k.x + 80} y={465} fill={k.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.label}</text>
                  <text x={k.x + 80} y={490} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{k.value}</text>
                </g>
              );
            })}
            <text x={410} y={518} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ no Seq Scan · work_mem safe · scalable · interview aced</text>
          </g>

          {/* Performance footer */}
          <g style={{opacity: clamp(prodP)}}>
            <rect x={20} y={555} width={780} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={410} y={585} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Live Coding Sealed · Think Aloud · 0.4s · interview passed · production-ready</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>Think Aloud</span>
          <span style={{color: C.green}}>0.4s · interview ✓</span>
        </div>
      </Win>

      <Caption text="Think Aloud ──► clarify ──► structure CTEs ──► write code ──► discuss complexity ──► optimize indexes ──► 0.4s ✓" from={t(95)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
