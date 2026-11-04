import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';

// SC02 (40-85s): top-to-bottom evaluation, first match wins, ELSE protects from NULL.
// Anchors (s): 41.1 power of CASE | 53.6 top to bottom | 57.4 first true stops | 64.5 no match -> ELSE | 71.6 no ELSE -> NULL | 77.3 so always ELSE
const S = START.s2;
const t = (g: number) => sec(g - S);
const LH = 44.8;
const lineY = (i: number) => 180 + 56 + 18 + LH * (i + 0.5);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const scan = lin(f, t(53.6), sec(3.8));
  const locked = f >= t(57.4);
  const y = lineY(1) + (lineY(2) - lineY(1)) * Math.min(1, scan);
  const rows = [
    {l: '7200 >= 10000', r: 'FALSE', c: C.red, at: 55.0},
    {l: '7200 >= 5000', r: 'TRUE ✓', c: C.green, at: 57.4},
  ];
  const elseP = clamp(pop(f, t(64.5)));
  const noElse = clamp(pop(f, t(71.6)));
  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="التقييم التسلسلي | Sequential Evaluation & ELSE" from={sec(1)} to={sec(40)} color={C.amber} />

      <Editor x={80} y={180} w={980} h={340} title="Query Editor" lines={['CASE', "  WHEN total_amount >= 10000 THEN 'Gold'", "  WHEN total_amount >= 5000  THEN 'Silver'", "  ELSE 'Standard'", 'END AS customer_tier']} start={t(41.1)} cps={1.1} size={28} hl={locked ? 2 : -1} hlColor={C.green} />
      {scan > 0 && !locked ? (
        <div style={{position: 'absolute', left: 90, width: 960, top: y - 2, height: 5, background: C.amber, boxShadow: `0 0 20px 5px ${C.amber}`, borderRadius: 3}} />
      ) : null}
      {locked ? (
        <div dir="ltr" style={{position: 'absolute', left: 700, top: lineY(3) - 20, fontFamily: MONO, fontSize: 24, color: C.muted, opacity: clamp(lin(f, t(57.4), 14))}}>⏹ rest skipped</div>
      ) : null}

      <Win x={1100} y={180} w={740} h={340} title="total_amount = 7200" accent={locked ? C.green : C.border} opacity={clamp(lin(f, t(53.0), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 24}}>
          {rows.map((r, i) => {
            const p = clamp(lin(f, t(r.at), 12));
            return (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', height: 64, alignItems: 'center', fontFamily: MONO, fontSize: 32, opacity: p, transform: `translateX(${(1 - p) * 24}px)`}}>
                <span style={{color: C.text}}>{r.l}</span>
                <span style={{color: r.c, fontWeight: 700}}>{r.r}</span>
              </div>
            );
          })}
          <div style={{marginTop: 18, display: 'flex', justifyContent: 'center', opacity: clamp(lin(f, t(58.2), 14))}}>
            <Chip color={C.green} style={{fontSize: 34, padding: '10px 34px'}}>→ 'Silver'</Chip>
          </div>
        </div>
      </Win>

      {/* ELSE demo: with vs without */}
      <div dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 80, top: 560, width: 860, height: 330, borderRadius: 22, background: C.card, border: `3px solid ${C.green}`, opacity: elseP, transform: `translateY(${(1 - elseP) * 30}px)`, padding: '20px 30px', fontFamily: MONO}}>
        <div style={{fontSize: 28, fontWeight: 700, color: C.green}}>WITH ELSE · total_amount = 3100</div>
        <div style={{fontSize: 25, color: C.muted, marginTop: 14, lineHeight: 1.5}}>WHEN … &gt;= 10000 → no<br />WHEN … &gt;= 5000 → no<br /><span style={{color: C.green}}>ELSE 'Standard'</span></div>
        <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 16}}>
          <Check p={elseP} size={50} />
          <span style={{fontSize: 40, fontWeight: 700, color: C.text}}>'Standard'</span>
        </div>
      </div>
      <div dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 980, top: 560, width: 860, height: 330, borderRadius: 22, background: C.card, border: `3px solid ${C.red}`, opacity: noElse, transform: `translateY(${(1 - noElse) * 30}px)`, padding: '20px 30px', fontFamily: MONO, boxShadow: `0 0 30px ${C.red}44`}}>
        <div style={{fontSize: 28, fontWeight: 700, color: C.red}}>WITHOUT ELSE · total_amount = 3100</div>
        <div style={{fontSize: 25, color: C.muted, marginTop: 14, lineHeight: 1.5}}>WHEN … &gt;= 10000 → no<br />WHEN … &gt;= 5000 → no<br /><span style={{color: C.red}}>(nothing matches)</span></div>
        <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 16}}>
          <Warn size={56} />
          <span style={{fontSize: 44, fontWeight: 700, color: C.red, textShadow: `0 0 18px ${C.red}`}}>NULL</span>
        </div>
      </div>
      <Caption text="Top-to-Bottom Evaluation ──► First Matching WHEN Clause Wins" from={t(53.6)} to={t(63)} />
      <Caption text="Mandatory ELSE Clause ──► Prevents Unexpected NULL Outputs" from={t(71.6)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
