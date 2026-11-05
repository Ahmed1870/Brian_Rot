import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec, typed} from '../kit';

// SC02 (frames 1200-2550, global 40-85s): the implicit frame RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.
const S = 40;
const t = (g: number) => sec(g - S);
const DAYS = ['01-Jan', '02-Jan', '03-Jan', '04-Jan', '05-Jan', '06-Jan', '07-Jan', '08-Jan'];
const AMT = [120, 80, 150, 60, 200, 90, 130, 170];
const RH = 42;
const HEAD = 40;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(44.2), 24);
  const ghost = prog(f, t(45.8), 18) * (1 - prog(f, t(56.0), 10));
  const implicit = typed('RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW', f, t(56.2), 0.9);
  const frameIn = prog(f, t(66.2), 18);
  const curLbl = pop(f, t(68.1));
  const step = clamp((f - t(72.7)) / sec(10.4), 0, 1) * 7;
  const cur = Math.round(step);
  const ptr = frameIn > 0 ? (f < t(72.7) ? 0 : lerp(0, 7, clamp((f - t(72.7)) / sec(10.4)))) : 0;
  const sum = AMT.slice(0, cur + 1).reduce((a, b) => a + b, 0);
  const formula = AMT.slice(0, cur + 1).join(' + ');
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  const stretch = prog(f, t(75.5), 20);
  const badge = pop(f, t(81.5));

  return (
    <Stage dur={1350} inFx="zoom" outFx="left">
      <TopBadge text="الإطار الافتراضي | Implicit Window Frame" from={t(41.4)} to={t(60)} color={C.purple} />

      <Editor x={90} y={150} w={1100} h={200} title="running_total.sql" lines={['SELECT sale_date, amount,', '       SUM(amount) OVER(ORDER BY sale_date) AS running_total', 'FROM sales;']} start={t(41.5)} cps={1.5} size={24} accent={C.blue} />

      {/* implicit frame text */}
      <div dir="ltr" style={{position: 'absolute', left: 90, top: 368, width: 1100, height: 60, borderRadius: 14, border: `2px dashed ${C.purple}`, background: `${C.purple}14`, display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: MONO, fontSize: 24, color: C.text}}>
        <span style={{color: C.purple, fontWeight: 700, marginRight: 14, opacity: ghost + (implicit ? 1 : 0) > 0 ? 1 : 0}}>implicit ▸</span>
        {implicit ? (
          <span>{implicit.split(/(RANGE|BETWEEN|UNBOUNDED|PRECEDING|AND|CURRENT|ROW)/).map((p, i) => <span key={i} style={{color: /^(RANGE|BETWEEN|UNBOUNDED|PRECEDING|AND|CURRENT|ROW)$/.test(p) ? C.purple : C.text, fontWeight: /^(RANGE|BETWEEN|UNBOUNDED|PRECEDING|AND|CURRENT|ROW)$/.test(p) ? 700 : 400}}>{p}</span>)}</span>
        ) : (
          <span style={{opacity: ghost * 0.5, color: C.muted}}>(hidden default frame)</span>
        )}
      </div>

      {/* table */}
      <Win x={90} y={450} w={1100} h={450} title="sales" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{position: 'relative', padding: '0 22px'}}>
          <div style={{display: 'flex', height: HEAD, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 230, paddingLeft: 12}}>sale_date</div>
            <div style={{width: 200}}>amount</div>
            <div style={{color: C.blue, fontWeight: 700}}>running_total</div>
          </div>
          {DAYS.map((d, i) => {
            const inFrame = frameIn > 0 && i <= cur;
            const sumHere = AMT.slice(0, i + 1).reduce((a, b) => a + b, 0);
            return (
              <div key={d} style={{display: 'flex', alignItems: 'center', height: RH, fontFamily: MONO, fontSize: 23, color: C.text, borderBottom: `1px solid ${C.border}`, opacity: clamp(tbl * 1.3 - i * 0.04)}}>
                <div style={{width: 230, paddingLeft: 12, color: inFrame ? C.purple : C.text}}>{d}</div>
                <div style={{width: 200, color: inFrame ? C.purple : C.text, fontWeight: inFrame ? 700 : 400}}>{AMT[i]}</div>
                <div style={{color: C.green, fontWeight: 700, opacity: frameIn > 0 && i <= cur ? 1 : 0}}>{sumHere}</div>
              </div>
            );
          })}
          {/* elastic purple frame */}
          <div style={{position: 'absolute', left: 8, right: 8, top: HEAD + 2, height: frameIn * (ptr + 1) * RH - 4, borderRadius: 10, background: `${C.purple}2A`, border: `3px solid ${C.purple}`, boxShadow: `0 0 ${18 * glow}px ${C.purple}66`, opacity: frameIn}} />
          <div style={{position: 'absolute', left: 430, top: HEAD + 4 + ptr * RH, opacity: clamp(curLbl) * frameIn}}>
            <Chip color={C.green} style={{fontSize: 18, padding: '2px 12px'}}>CURRENT ROW</Chip>
          </div>
          <div style={{position: 'absolute', left: 700, top: HEAD + 4, opacity: frameIn}}>
            <Chip color={C.purple} style={{fontSize: 18, padding: '2px 12px'}}>UNBOUNDED PRECEDING</Chip>
          </div>
        </div>
      </Win>

      {/* formula card */}
      <div dir="ltr" style={{position: 'absolute', left: 1240, top: 150, width: 590, display: 'flex', flexDirection: 'column', gap: 22}}>
        <div style={{borderRadius: 22, border: `2px solid ${C.purple}`, background: C.card, padding: '24px 28px', opacity: frameIn}}>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>window = row 1 → current row</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.purple, marginTop: 10, minHeight: 70, lineHeight: 1.4, wordBreak: 'break-all'}}>{formula}</div>
          <div style={{fontFamily: MONO, fontSize: 80, fontWeight: 700, color: C.green, lineHeight: 1.1}}>= {sum}</div>
        </div>
        <div style={{opacity: stretch, transform: `translateY(${(1 - stretch) * 20}px)`}}><Chip color={C.purple} style={{fontSize: 24}}>frame grows with every row</Chip></div>
        <div style={{transform: `scale(${clamp(badge)})`, opacity: clamp(badge), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 24, background: `${C.green}26`}}>row by row ✓</Chip></div>
      </div>

      <Caption text="Implicit Frame: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW" from={t(56.6)} to={t(70.8)} />
      <Caption text="Window Scope ──► Accumulates All Previous Rows Up To Current Row" from={t(73)} to={t(83.4)} />
    </Stage>
  );
};
