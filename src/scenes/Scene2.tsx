// SC02 — Calculation Tree & Dirty Flag Cascade (00:40-01:25).
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Stage, TopBadge, Caption, Check, Mix} from '../kit';
import {VOLATILE_FNS} from '../data';

const SC = {from: 1200, dur: 1350};

export const Scene2: React.FC = () => {
  const local = useCurrentFrame();

  // Normal tree reveal (0-360)
  const treeP = interpolate(local, [0, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Dirty flag cascade (360-840)
  const dirtyP = interpolate(local, [360, 540], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cascadeP = interpolate(local, [540, 840], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Final seal
  const sealP = interpolate(local, [1080, 1200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Tree node positions (root + 3 branches × 3 children)
  const tree = {
    root: {x: 250, y: 60, label: 'B2 =SUM(D2:D5)'},
    branches: [
      {x: 90, y: 200, label: 'D2 =A2*B2'},
      {x: 250, y: 200, label: 'D3 =A3*B3'},
      {x: 410, y: 200, label: 'D4 =OFFSET(...)'},
    ],
    leaves: [
      {x: 60, y: 340, label: 'A2'},
      {x: 130, y: 340, label: 'B2'},
      {x: 220, y: 340, label: 'A3'},
      {x: 290, y: 340, label: 'B3'},
      {x: 380, y: 340, label: 'A4 ⚠'},
      {x: 450, y: 340, label: 'TODAY() ⚠'},
    ],
  };

  return (
    <Stage dur={SC.dur} inFx="left" outFx="left">
      <TopBadge text="Calculation Dependency Tree ──► Normal Formulas Recalc Only Changed Branches" from={60} to={720} color={C.green} />

      {/* LEFT: Dependency tree visualization */}
      <div style={{position: 'absolute', left: 80, top: 180, width: 920, height: 680, opacity: treeP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'Calculation Dependency Tree'}</div>
        <div style={{position: 'relative', width: '100%', height: 600, background: C.card, border: `2px solid ${dirtyP > 0.3 ? C.red : C.green}`, borderRadius: 12, padding: 24, boxShadow: `0 0 30px ${dirtyP > 0.3 ? C.red : C.green}33`}}>

          <svg width="840" height="560" style={{position: 'absolute', left: 24, top: 24}}>
            {/* Edges root → branches */}
            {tree.branches.map((b, i) => (
              <line key={`b${i}`} x1={tree.root.x} y1={tree.root.y + 20} x2={b.x} y2={b.y - 10} stroke={cascadeP > 0.3 ? C.red : C.green} strokeWidth="2.5" opacity={0.8} />
            ))}
            {/* Edges branches → leaves */}
            {tree.leaves.map((l, i) => {
              const branchIdx = Math.floor(i / 2);
              const b = tree.branches[branchIdx];
              return <line key={`l${i}`} x1={b.x} y1={b.y + 20} x2={l.x} y2={l.y - 10} stroke={cascadeP > (i / tree.leaves.length) ? C.red : C.muted} strokeWidth="2" opacity={cascadeP > (i / tree.leaves.length) ? 0.8 : 0.4} />;
            })}
          </svg>

          {/* Root node */}
          <div style={{position: 'absolute', left: 24 + tree.root.x - 90, top: 24 + tree.root.y - 10, padding: '10px 16px', background: C.deep, border: `2px solid ${C.blue}`, borderRadius: 8, fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700, boxShadow: `0 0 15px ${C.blue}66`, whiteSpace: 'nowrap'}}>
            {tree.root.label}
          </div>

          {/* Branch nodes */}
          {tree.branches.map((b, i) => {
            const isVolatile = i === 2 && dirtyP > 0.3;
            const isCascaded = cascadeP > 0.2;
            return (
              <div key={i} style={{position: 'absolute', left: 24 + b.x - 70, top: 24 + b.y - 10, padding: '8px 14px', background: C.deep, border: `2px solid ${isVolatile ? C.red : isCascaded ? C.amber : C.green}`, borderRadius: 8, fontFamily: MONO, fontSize: 14, color: isVolatile ? C.red : isCascaded ? C.amber : C.green, fontWeight: 700, whiteSpace: 'nowrap'}}>
                {b.label}
              </div>
            );
          })}

          {/* Leaf nodes */}
          {tree.leaves.map((l, i) => {
            const isVolatile = l.label.includes('⚠');
            const isCascaded = cascadeP > (i / tree.leaves.length);
            return (
              <div key={i} style={{position: 'absolute', left: 24 + l.x - 30, top: 24 + l.y - 10, padding: '6px 10px', background: C.deep, border: `1px solid ${isVolatile ? C.red : isCascaded ? C.amber : C.border}`, borderRadius: 6, fontFamily: MONO, fontSize: 13, color: isVolatile ? C.red : isCascaded ? C.amber : C.muted, fontWeight: 600, whiteSpace: 'nowrap'}}>
                {l.label}
              </div>
            );
          })}

          {/* Dirty flag badge */}
          {dirtyP > 0.3 && (
            <div style={{position: 'absolute', right: 24, top: 24, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: `${C.red}22`, border: `2px solid ${C.red}`, borderRadius: 8, opacity: dirtyP}}>
              <svg width="32" height="32" viewBox="0 0 32 32"><path d="M4 22 L16 4 L28 22 Z" fill="none" stroke={C.red} strokeWidth="2.5" strokeLinejoin="round" /><line x1="16" y1="12" x2="16" y2="17" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" /><circle cx="16" cy="20" r="1.5" fill={C.red} /></svg>
              <div>
                <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.red}}>{'DIRTY FLAG'}</div>
                <div style={{fontFamily: MONO, fontSize: 11, color: C.muted}}>{'forced cascade'}</div>
              </div>
            </div>
          )}

          {/* Edit trigger indicator */}
          <div style={{position: 'absolute', right: 24, bottom: 24, padding: '10px 16px', background: C.deep, border: `1px solid ${C.border}`, borderRadius: 6, fontFamily: MONO, fontSize: 13, color: C.muted, opacity: cascadeP}}>
            {'edit empty cell → 50K recalc'}
          </div>
        </div>
      </div>

      {/* RIGHT: 8 Volatile Functions list */}
      <div style={{position: 'absolute', right: 80, top: 180, width: 760, height: 680, opacity: treeP}}>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 14}}>{'The 8 Volatile Culprits'}</div>
        <div style={{background: C.card, border: `2px solid ${C.red}`, borderRadius: 12, padding: 18, height: 600, boxShadow: `0 0 30px ${C.red}33`}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
            {VOLATILE_FNS.map((fn, i) => {
              const p = interpolate(local, [120 + i * 40, 160 + i * 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={i} style={{padding: '14px 16px', background: C.deep, border: `1px solid ${C.red}`, borderRadius: 8, opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
                  <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.red}}>{fn.n}</div>
                  <div style={{fontFamily: FONT, fontSize: 12, color: C.muted, marginTop: 2}}>{fn.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Warning banner */}
          <div style={{marginTop: 16, padding: 16, background: `${C.red}22`, border: `1px solid ${C.red}`, borderRadius: 8}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6}}>
              <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2 L22 20 H2 Z" fill="none" stroke={C.red} strokeWidth="2" /><line x1="12" y1="9" x2="12" y2="14" stroke={C.red} strokeWidth="2" /><circle cx="12" cy="17" r="1.2" fill={C.red} /></svg>
              <div style={{fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.red}}>{'Domino Recalculation Effect'}</div>
            </div>
            <div style={{fontFamily: FONT, fontSize: 13, color: C.muted, lineHeight: 1.6}}>
              {'أي تعديل (حتى في خلية فارغة) يجبر Excel على إعادة حساب كل الصيغ المعتمدة على هذه الدوال'}
            </div>
          </div>
        </div>
      </div>

      {/* Final seal */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', justifyContent: 'center', opacity: sealP}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.red}`, borderRadius: 999, padding: '12px 30px', boxShadow: `0 0 30px ${C.red}33`}}>
          <Mix style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.red}}>{'8 Volatile Functions ──► TODAY, NOW, RAND, RANDBETWEEN, OFFSET, INDIRECT, INFO, CELL'}</Mix>
        </div>
      </div>

      <Caption text="Calculation Dependency Tree ──► Normal Formulas Recalc Only Changed Branches" from={60} to={720} tone="ok" />
      <Caption text="The 8 Volatile Culprits ──► TODAY, NOW, RAND, RANDBETWEEN, OFFSET, INDIRECT, INFO, CELL" from={840} to={1320} tone="normal" />
    </Stage>
  );
};
