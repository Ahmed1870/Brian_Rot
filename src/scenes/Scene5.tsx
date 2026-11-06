import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, pop, prog, sec} from '../kit';

// SC05 (frames 5100-6300, global 170-210s): regional benchmarking - region average and variance per branch (illustrative, K EGP).
const S = 170;
const t = (g: number) => sec(g - S);
const B = [
  {n: 'Nasr City', r: 1, v: 520},
  {n: 'Maadi', r: 1, v: 480},
  {n: 'Heliopolis', r: 1, v: 610},
  {n: 'Smouha', r: 2, v: 350},
  {n: 'Stanley', r: 2, v: 420},
  {n: 'Montaza', r: 2, v: 380},
];
const AVG: Record<number, number> = {1: 536.67, 2: 383.33};
const RH = 50;

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(180.0), 24);
  const avgFill = (i: number) => pop(f, t(183.6) + i * 14);
  const varFill = (i: number) => pop(f, t(189.2) + i * 12);
  const seal = pop(f, t(196.0));
  const hi = prog(f, t(199.4), 20);
  const noJoin = pop(f, t(205.0));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  return (
    <Stage dur={1200} inFx="zoom" outFx="down">
      <TopBadge text="التطبيقات المؤسسية | Regional Benchmarking" from={t(171.4)} to={t(184)} color={C.green} />

      <Editor x={90} y={150} w={1250} h={240} title="variance_report.sql" lines={['SELECT branch_name, region_id, total_revenue,', '       AVG(total_revenue) OVER(PARTITION BY region_id) AS region_avg,', '       ROUND(total_revenue - AVG(total_revenue) OVER(PARTITION BY region_id), 2)', '       AS variance_from_avg FROM branch_performance;']} start={t(172.0)} cps={1.0} size={22} accent={C.green} />

      <Win x={90} y={420} w={1250} h={430} title="branch_performance · K EGP (illustrative)" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{padding: '0 22px'}}>
          <div style={{display: 'flex', height: 40, alignItems: 'center', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 230, paddingLeft: 12}}>branch_name</div>
            <div style={{width: 130}}>region_id</div>
            <div style={{width: 200}}>total_revenue</div>
            <div style={{width: 220, color: C.green, fontWeight: 700}}>region_avg</div>
            <div style={{color: C.amber, fontWeight: 700}}>variance_from_avg</div>
          </div>
          {B.map((r, i) => {
            const va = r.v - AVG[r.r];
            const up = va >= 0;
            const rowHi = hi > 0.5;
            return (
              <div key={r.n} style={{display: 'flex', alignItems: 'center', height: RH, fontFamily: MONO, fontSize: 23, color: C.text, borderBottom: `1px solid ${C.border}`, background: rowHi ? `${up ? C.green : C.red}10` : 'transparent', opacity: clamp(tbl * 1.4 - i * 0.05)}}>
                <div style={{width: 230, paddingLeft: 12}}>{r.n}</div>
                <div style={{width: 130, color: r.r === 1 ? C.blue : C.purple, fontWeight: 700}}>{r.r}</div>
                <div style={{width: 200}}>{r.v}</div>
                <div style={{width: 220, color: C.green, fontWeight: 700, opacity: clamp(avgFill(i)), transform: `translateX(${(1 - clamp(avgFill(i))) * 50}px)`}}>{AVG[r.r].toFixed(2)}</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, color: up ? C.green : C.red, fontWeight: 700, opacity: clamp(varFill(i)), transform: `translateX(${(1 - clamp(varFill(i))) * 50}px)`}}>
                  <span style={{display: 'inline-block', width: Math.abs(va) * 2.2, height: 14, borderRadius: 7, background: up ? C.green : C.red}} />
                  {up ? '+' : '−'}{Math.abs(va).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </Win>

      <div dir="ltr" style={{position: 'absolute', left: 1390, top: 420, width: 440, display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{opacity: hi}}><Chip color={C.green} style={{fontSize: 22}}>▲ ahead of its region</Chip></div>
        <div style={{opacity: hi}}><Chip color={C.red} style={{fontSize: 22}}>▼ behind its region</Chip></div>
        <div style={{opacity: clamp(noJoin), transform: `scale(${0.9 + 0.1 * clamp(noJoin)})`, transformOrigin: 'left center'}}><Chip color={C.blue} style={{fontSize: 22}}>no JOIN · no subquery</Chip></div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${clamp(seal)})`, opacity: clamp(seal), transformOrigin: 'left center'}}>
          <Check p={clamp(seal)} size={50} />
          <Chip color={C.green} style={{fontSize: 22, boxShadow: `0 0 ${16 * glow}px ${C.green}55`}}>Executive Variance Seal</Chip>
        </div>
        <Mix style={{fontSize: 24, color: C.muted, display: 'block'}}>الانحراف محسوب عن متوسط المنطقة (region_avg)</Mix>
      </div>

      <Caption text="Enterprise Analytics ──► Regional Benchmarking & Financial Variance" from={t(180.2)} to={t(194.4)} />
      <Caption text="Single-Query Precision ──► Identifies Outliers Without Joins or Subqueries" from={t(195.8)} to={t(207.4)} />
    </Stage>
  );
};
