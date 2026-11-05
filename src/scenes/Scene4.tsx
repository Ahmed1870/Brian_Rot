import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, PipeNode, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC04 (130-170s): PostgreSQL 16 Rewrite Rule Engine
// Anchors: 131.0 engine | 136.0 rewrite | 140.0 WHERE | 145.0 base table | 150.0 execution plan | 155.0 zero overhead | 160.0 in-memory | 165.0 fast
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const engineP = clamp(lin(f, t(131.5), 16));
  const rewriteP = clamp(lin(f, t(136), 16));
  const outputP = clamp(lin(f, t(145), 16));
  const sealP = pop(f, t(155));

  // Rewrite transformation animation
  const rewriteProg = clamp(lin(f, t(137), sec(14)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | Rewrite Rule Engine" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: engineP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={150}
          title="EXPLAIN · View DML Rewrite"
          lines={[
            'UPDATE v_active_products SET price = 150 WHERE product_id = 101;',
            '-- Rewrite Rule Engine transforms this into:',
            'UPDATE products SET price = 150 WHERE product_id = 101 AND status = \'active\';',
          ]}
          start={t(131.5)}
          cps={0.7}
          size={16}
          accent={C.amber}
          hl={1}
          hlColor={C.amber}
        />
      </div>

      {/* Input: View DML (blue) */}
      <div style={{position: 'absolute', left: 80, top: 320, width: 380, opacity: engineP}}>
        <div style={{padding: '16px 18px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, marginBottom: 8}}>1. Input · View DML</div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.text, lineHeight: 1.5}}>
            UPDATE v_active_products<br/>
            SET price = 150<br/>
            WHERE product_id = 101;
          </div>
        </div>
      </div>

      {/* Arrow to engine */}
      <div style={{position: 'absolute', left: 480, top: 380, opacity: engineP}}>
        <svg width={80} height={30}>
          <line x1={0} y1={15} x2={65} y2={15} stroke={C.muted} strokeWidth={3} strokeDasharray="5 3" />
          <polygon points="60,9 60,21 72,15" fill={C.muted} />
        </svg>
      </div>

      {/* Rewrite Rule Engine node (amber) */}
      <PipeNode x={580} y={350} w={560} h={230} label="Rewrite Rule Engine" sublabel="merges view WHERE + base table target" color={C.amber} p={rewriteP} glow={f >= t(136)}>
        <div style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.amber}}>
          transforming query...
        </div>
        {/* Progress indicator */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 50, height: 24, borderRadius: 12, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${rewriteProg * 100}%`, background: `linear-gradient(90deg, ${C.amber}, ${C.green})`, borderRadius: 12}} />
        </div>
        <div dir="ltr" style={{position: 'absolute', right: 18, top: 80, fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700}}>
          {Math.round(rewriteProg * 100)}% rewritten
        </div>
        {/* Steps */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 90, display: 'flex', flexDirection: 'column', gap: 6}}>
          {[
            {step: 'parse view definition', done: rewriteProg > 0.2},
            {step: 'merge WHERE conditions', done: rewriteProg > 0.5},
            {step: 'rewrite to base table', done: rewriteProg > 0.8},
          ].map((s, i) => (
            <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 14, color: s.done ? C.green : C.muted}}>
              <span style={{color: s.done ? C.green : '#475569'}}>{s.done ? '✓' : '○'}</span>
              <span>{s.step}</span>
            </div>
          ))}
        </div>
      </PipeNode>

      {/* Arrow to output */}
      <div style={{position: 'absolute', left: 1160, top: 380, opacity: outputP}}>
        <svg width={80} height={30}>
          <line x1={0} y1={15} x2={65} y2={15} stroke={C.green} strokeWidth={3} strokeDasharray="5 3" />
          <polygon points="60,9 60,21 72,15" fill={C.green} />
        </svg>
      </div>

      {/* Output: Base Table DML (green) */}
      <div style={{position: 'absolute', left: 1260, top: 320, width: 580, opacity: outputP}}>
        <div style={{padding: '16px 18px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`, boxShadow: `0 0 20px ${C.green}44`}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, marginBottom: 8}}>3. Output · Base Table DML</div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.text, lineHeight: 1.5}}>
            UPDATE products SET price = 150<br/>
            WHERE product_id = 101<br/>
            AND status = 'active';
          </div>
        </div>
      </div>

      {/* Performance badges */}
      <div style={{position: 'absolute', left: 80, top: 560, width: 1760, opacity: clamp(sealP), display: 'flex', justifyContent: 'center', gap: 20}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={sealP} size={40} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Zero Memory Overhead</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', border: `2px solid ${C.blue}`, borderRadius: 16, background: `${C.blue}0d`}}>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.blue, fontWeight: 700}}>⚡</div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.blue, fontWeight: 700}}>In-Memory Transformation</div>
        </div>
      </div>

      <Caption text="PostgreSQL Rewrite Engine ──► Rewrites View DML to Base Table DML" from={t(136)} to={t(150)} />
      <Caption text="Zero Memory Overhead ──► In-Memory Query Transformation" from={t(152)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
