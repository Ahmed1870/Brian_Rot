import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {INTERVIEW_SKILLS} from '../data';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): GitHub Documentation vs Technical Interviews
// Left: README/ERD documentation (blue); Right: Technical interview skills (purple/green)
// Anchors: 41.5 GitHub | 45 README | 52 ERD | 60 interviews | 68 Window Functions | 75 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.green);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const ghP = pop(f, t(41.5));
  const readmeP = pop(f, t(45));
  const erdP = pop(f, t(52));
  const intP = pop(f, t(60));
  const sealP = pop(f, t(75));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="أركان البورتفوليو واختبارات التوظيف | GitHub README · ERD · Technical Interviews (Module 16)" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: GitHub Documentation (blue) */}
      <Win x={80} y={170} w={860} h={580} title="github portfolio documentation (blue) ──► README · ERD · performance metrics" accent={C.blue} opacity={clamp(lin(f, t(41), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.blue, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Professional README.md · ERD diagrams · DDL/DML scripts · performance benchmarks
        </div>

        <svg width={820} height={480} style={{position: 'absolute', left: 18, top: 50}}>
          {/* README.md file preview */}
          <g style={{opacity: clamp(readmeP)}}>
            <rect x={20} y={10} width={780} height={220} fill={`${C.deep}cc`} stroke={C.blue} strokeWidth={2.5} rx={10} />
            <rect x={20} y={10} width={780} height={28} fill={C.blue} rx={10} />
            <text x={40} y={29} fill={C.bg} fontSize={12} fontFamily={MONO} fontWeight={700}>README.md · Manzooma-Store-V2-Capstone</text>
            <text x={40} y={60} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700}># Manzooma Store V2 — Enterprise SQL Capstone</text>
            <text x={40} y={85} fill={C.text} fontSize={11} fontFamily={MONO}>## 1. Business Problem</text>
            <text x={40} y={102} fill={C.muted} fontSize={10} fontFamily={MONO}>E-commerce analytics: millions of daily transactions across 5 branches</text>
            <text x={40} y={122} fill={C.text} fontSize={11} fontFamily={MONO}>## 2. Data Architecture (ERD)</text>
            <text x={40} y={139} fill={C.muted} fontSize={10} fontFamily={MONO}>15 relational tables · 1NF/2NF/3NF normalized · 28 FK · 22 CHECK · 17 UNIQUE</text>
            <text x={40} y={159} fill={C.text} fontSize={11} fontFamily={MONO}>## 3. Analytics Pipeline</text>
            <text x={40} y={176} fill={C.muted} fontSize={10} fontFamily={MONO}>Multi-stage CTEs · Window Functions · Materialized Views · 0.4ms cached</text>
            <text x={40} y={196} fill={C.text} fontSize={11} fontFamily={MONO}>## 4. Performance Benchmarks</text>
            <text x={40} y={213} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>✓ Query: 10min → 0.4s (1500× speedup) · 60% faster · 45s recovery</text>
          </g>

          {/* ERD diagram preview */}
          <g style={{opacity: clamp(erdP)}}>
            <rect x={20} y={250} width={780} height={180} fill={`${C.deep}cc`} stroke={C.purple} strokeWidth={2.5} rx={10} />
            <text x={40} y={275} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700}>📊 ERD Diagram — 7 Core Entities</text>
            {/* Mini ERD entities */}
            {[
              {name: 'customers', color: C.blue, x: 40, y: 290},
              {name: 'branches', color: C.green, x: 40, y: 360},
              {name: 'products', color: C.amber, x: 200, y: 290},
              {name: 'orders', color: C.purple, x: 360, y: 290},
              {name: 'order_items', color: C.red, x: 520, y: 290},
              {name: 'inventory', color: C.blue, x: 360, y: 360},
              {name: 'audit_logs', color: C.purple, x: 520, y: 360},
            ].map((e, i) => (
              <g key={i}>
                <rect x={e.x} y={e.y} width={140} height={50} fill={`${e.color}22`} stroke={e.color} strokeWidth={2} rx={6} />
                <text x={e.x + 70} y={e.y + 22} fill={e.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{e.name}</text>
                <text x={e.x + 70} y={e.y + 38} fill={C.muted} fontSize={8} fontFamily={MONO} textAnchor="middle">PK · FK</text>
              </g>
            ))}
            {/* Connection lines */}
            <line x1={180} y1={315} x2={200} y2={315} stroke={C.blue} strokeWidth={1.5} opacity={0.5} />
            <line x1={340} y1={315} x2={360} y2={315} stroke={C.amber} strokeWidth={1.5} opacity={0.5} />
            <line x1={500} y1={315} x2={520} y2={315} stroke={C.purple} strokeWidth={1.5} opacity={0.5} />
            <line x1={430} y1={340} x2={430} y2={360} stroke={C.purple} strokeWidth={1.5} opacity={0.5} />
            <text x={410} y={430} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Professional ERD · referential integrity documented</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>README · ERD</span>
          <span style={{color: C.green}}>documented ✓</span>
        </div>
      </Win>

      {/* RIGHT: Technical Interview Skills (purple/green) */}
      <Win x={960} y={170} w={880} h={580} title="technical interview skills (purple) ──► Performance Tuning · Window Functions · CTEs · Indexes" accent={C.purple} opacity={clamp(lin(f, t(52), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.purple, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Technical Interviews · 6 core skills · mastery scores · B-Tree vs GIN
        </div>

        <svg width={840} height={480} style={{position: 'absolute', left: 18, top: 50}}>
          {/* 6 skill rows with mastery bars */}
          {INTERVIEW_SKILLS.map((sk, i) => {
            const color = colorOf(sk.color);
            const p = clamp(intP - i * 0.1);
            const barP = clamp(pop(f, t(60 + i * 1.5)));
            return (
              <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 20}px, 0)`}}>
                <rect x={20} y={20 + i * 72} width={800} height={60} fill={`${color}11`} stroke={color} strokeWidth={2} rx={8} />
                {/* Skill name */}
                <text x={40} y={45 + i * 72} fill={color} fontSize={14} fontFamily={MONO} fontWeight={700}>{sk.skill}</text>
                <text x={40} y={65 + i * 72} fill={C.muted} fontSize={10} fontFamily={MONO}>{sk.detail}</text>
                {/* Mastery bar */}
                <rect x={500} y={35 + i * 72} width={260} height={14} fill={C.deep} stroke={color} strokeWidth={1} rx={4} />
                <rect x={500} y={35 + i * 72} width={260 * (sk.mastery / 100) * barP} height={14} fill={color} rx={4} style={{filter: `drop-shadow(0 0 4px ${color})`}} />
                <text x={780} y={46 + i * 72} fill={color} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{sk.mastery}%</text>
                {/* Check mark */}
                <circle cx={800} cy={50 + i * 72} r={10} fill={`${C.green}22`} stroke={C.green} strokeWidth={1.5} />
                <polyline points={`795,${50 + i * 72} 799,${54 + i * 72} 806,${46 + i * 72}`} fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}

          {/* Bottom seal */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={460} width={800} height={32} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={8} />
            <text x={410} y={481} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ All 6 skills mastered · interview-ready · 90%+ average mastery</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>6 skills evaluated</span>
          <span style={{color: C.green}}>90%+ mastery ✓</span>
        </div>
      </Win>

      {/* Bottom seal bar */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 770, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 28px ${C.green}44`}}>
          <Check p={sealP} size={44} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Portfolio + Interview Engine · Sealed ✓</div>
          <div style={{display: 'flex', gap: 8}}>
            <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>GitHub ✓</Chip>
            <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>interviews ✓</Chip>
            <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>90%+ ✓</Chip>
          </div>
        </div>
      </div>

      <Caption text="GitHub README ──► ERD diagrams ──► performance benchmarks ──► technical interviews ──► Window Functions ──► CTEs ──► B-Tree vs GIN ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
