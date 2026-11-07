import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ERD_ENTITIES, ERD_RELATIONS} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Module 16 Launch & Capstone ERD Architecture
// 2D grid assembles entity blocks; neon-blue lines draw ERD; green Module 16 Capstone badge
// Anchors (scene-local seconds):
//   1.0 welcome | 6.0 Manzooma Store V2 | 18.0 referential integrity | 28.0 seal | 35.0 production-ready
const S = START.s1;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'green' ? C.green : k === 'amber' ? C.amber : k === 'purple' ? C.purple : C.red);

// 7 ERD entities laid out in a 2D grid (positions stored in data.ts).
// Manually choose an SVG canvas: 1700 wide x 700 tall.

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const gridP = clamp(lin(f, t(1.5), 14));
  const erdP = pop(f, t(6));
  const relP = pop(f, t(14));
  const sealP = pop(f, t(28));
  const prodP = pop(f, t(35));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);

  // Lookup entity position by name
  const findEntity = (name: string) => ERD_ENTITIES.find((e) => e.name === name)!;

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="هندسة وتصميم قاعدة بيانات مشروع متكامل | Manzooma Store V2 Capstone — Module 16 Launch" from={sec(2)} to={sec(18)} color={C.green} />

      {/* LEFT: Intro / welcome code editor (small) */}
      <div style={{opacity: gridP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="capstone_intro.sql · Manzooma Store V2 (PostgreSQL 16)"
          lines={[
            '-- Lesson 65 · Module 16 begins',
            'CREATE SCHEMA IF NOT EXISTS manzooma_store_v2;',
            'SET search_path TO manzooma_store_v2;',
            '',
            '-- 15-table relational capstone schema',
            '-- Normalization: 1NF · 2NF · 3NF',
            '-- Constraints: PK · FK · CHECK · UNIQUE',
            '-- ON DELETE RESTRICT (orders) · CASCADE (items)',
            '-- Target: millions of transactions / day',
          ]}
          start={t(1.5)}
          cps={0.55}
          size={15}
          accent={C.green}
          hl={1}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Module 16 Capstone golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>ERD Architecture</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>1NF · 2NF · 3NF</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>DDL Constraints</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>15 Relational Tables</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>Module 16 ✓</Chip>
        </div>
      </div>

      {/* Module 16 Capstone Launch seal */}
      <Win x={80} y={570} w={680} h={330} title="module 16 launch ──► capstone project & portfolio (green seal)" accent={C.green} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 14, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          15 modules mastered · 65 lessons · capstone schema begins now
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={prodP} size={16} color={C.green} /> Module 16
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 70}}>
          {/* 15 modules journey bar */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <text x={320} y={20} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Module journey · 15 of 15 modules → now starting Module 16 (Capstone)</text>
            {Array.from({length: 16}, (_, i) => {
              const done = i < 15;
              const isCurrent = i === 15;
              const x = 20 + i * 38;
              const color = done ? C.green : isCurrent ? C.amber : C.border;
              return (
                <g key={i}>
                  <rect x={x} y={40} width={32} height={32} fill={`${color}22`} stroke={color} strokeWidth={2} rx={4} style={isCurrent ? {filter: `drop-shadow(0 0 8px ${color})`} : {}} />
                  <text x={x + 16} y={70} fill={color} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">{i + 1}</text>
                </g>
              );
            })}
            <text x={320} y={108} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Modules 1–15 mastered · Module 16 (Capstone) starts NOW</text>
          </g>

          {/* Bottom: production-ready */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={130} width={600} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${12 + pulse * 8}px ${C.green})`}} />
            <text x={320} y={158} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Module 16 Capstone Project &amp; Portfolio</text>
            <text x={320} y={178} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">Manzooma Store V2 — scalable relational model for millions of transactions</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>SCHEMA → manzooma_store_v2</span>
          <span>Module 16 ✓</span>
        </div>
      </Win>

      {/* RIGHT: ERD visualization */}
      <Win x={800} y={170} w={1040} h={720} title="capstone ERD architecture ──► 7 core entities (15-table schema preview)" accent={C.blue} opacity={clamp(lin(f, t(6), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.blue, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          Manzooma Store V2 ERD · 7 core entities · referential integrity
        </div>

        <div style={{position: 'absolute', right: 18, top: 60, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>7 core entities</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{relP > 0.5 ? 'relations ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={610} style={{position: 'absolute', left: 20, top: 60}}>
          {/* === Relationship lines (drawn first, behind entities) === */}
          <g style={{opacity: clamp(relP)}}>
            {ERD_RELATIONS.map((rel, i) => {
              const from = findEntity(rel.from);
              const to = findEntity(rel.to);
              const color = colorOf(rel.color);
              const x1 = from.x + 100;
              const y1 = from.y + 80;
              const x2 = to.x + 100;
              const y2 = to.y + 80;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;
              const drawProg = clamp(pop(f, t(14 + i * 0.3)));
              return (
                <g key={i} style={{opacity: clamp(drawProg)}}>
                  <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * drawProg} y2={y1 + (y2 - y1) * drawProg} stroke={color} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} style={{filter: `drop-shadow(0 0 4px ${color}66)`}} />
                  {/* Cardinality label */}
                  <g style={{opacity: drawProg > 0.5 ? 1 : 0}}>
                    <rect x={midX - 22} y={midY - 12} width={44} height={20} fill={`${C.deep}cc`} stroke={color} strokeWidth={1.5} rx={4} />
                    <text x={midX} y={midY + 3} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{rel.label}</text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* === Entity cards === */}
          {ERD_ENTITIES.map((e, i) => {
            const color = colorOf(e.color);
            const eP = clamp(pop(f, t(6 + i * 0.5)));
            const w = 200;
            const h = 160;
            return (
              <g key={e.name} style={{opacity: clamp(eP), transform: `translate(0, ${(1 - eP) * 20}px)`}}>
                {/* Entity header bar */}
                <rect x={e.x} y={e.y} width={w} height={32} fill={`${color}33`} stroke={color} strokeWidth={2.5} rx={6} style={{filter: `drop-shadow(0 0 6px ${color}66)`}} />
                <text x={e.x + w / 2} y={e.y + 22} fill={color} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{e.name}</text>
                {/* Entity body */}
                <rect x={e.x} y={e.y + 32} width={w} height={e.fields.length * 22 + 8} fill={`${C.deep}cc`} stroke={color} strokeWidth={1.5} rx={6} />
                {e.fields.map((fld, fi) => {
                  const isPK = fld.includes('PK');
                  const isFK = fld.includes('FK');
                  const isUQ = fld.includes('UQ');
                  const fldColor = isPK ? C.amber : isFK ? C.purple : isUQ ? C.green : C.text;
                  return (
                    <text key={fi} x={e.x + 12} y={e.y + 32 + 18 + fi * 22} fill={fldColor} fontSize={10} fontFamily={MONO} fontWeight={isPK || isFK || isUQ ? 700 : 400}>{fld}</text>
                  );
                })}
              </g>
            );
          })}

          {/* Result banner */}
          {relP > 0.7 ? (
            <g style={{opacity: clamp(pop(f, t(28)))}}>
              <rect x={150} y={550} width={700} height={48} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={578} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ ERD Sealed · 7 core entities · 6 referential relationships · Module 16 capstone launched</text>
            </g>
          ) : null}
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>ERD · 7 entities</span>
          <span style={{color: C.amber}}>1:N relations</span>
          <span style={{color: C.green}}>referential integrity ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Capstone ERD · Sealed ✓</div>
        </div>
      </div>

      {/* Production-ready chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(prodP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={prodP} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>Module 16 · Launched ✓</div>
        </div>
      </div>

      <Caption text="SCHEMA ──► manzooma_store_v2 ──► ERD architecture ──► 7 entities ──► referential integrity ──► Module 16 ✓" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
