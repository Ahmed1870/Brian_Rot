import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC05 (170-209s): enterprise cohort query, JOIN duplication vs IN, clean report.
// Anchors (s): 171.1 enterprise | 177.7 isolate cohorts | 181.2 without need | 184.9 repeating rows | 187.2 merge IN and ALL | 193.8 customers | 197.9 products | 202.1 gives you
const S = START.s5;
const t = (g: number) => sec(g - S);
const VIP = ['Ali', 'Omar', 'Hany', 'Laila'];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const joinP = clamp(pop(f, t(177.7)));
  const inP = clamp(pop(f, t(181.2)));
  const prodP = clamp(lin(f, t(197.9), 16));
  const sealP = clamp(pop(f, t(202.1)));
  const hl = f >= t(187.2) ? 3 : f >= t(172) ? 1 : -1;

  return (
    <Stage dur={1170} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | Enterprise Cohort Filtering" from={sec(1)} to={sec(36)} color={C.amber} />

      <Editor x={80} y={170} w={980} h={420} title="Cohort Query" lines={['SELECT name FROM customers', 'WHERE id IN (', '  SELECT customer_id FROM orders', '  WHERE total_amount > ALL (', '    SELECT AVG(total_amount)', '    FROM orders GROUP BY region_id', '  )', ');']} start={t(171.1)} cps={0.9} size={26} hl={hl} hlColor={hl === 3 ? C.amber : C.blue} />

      <Win x={1100} y={170} w={740} h={420} title="report · vip_customers" accent={C.green} opacity={clamp(lin(f, t(193.0), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 18, fontFamily: MONO, fontSize: 24, color: C.green}}>High-value cohort</div>
        {VIP.map((n, i) => {
          const p = clamp(pop(f, t(193.8 + i * 0.7)));
          return (
            <div key={n} dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 28 + (i % 2) * 330, top: 70 + Math.floor(i / 2) * 120, width: 305, height: 98, borderRadius: 16, border: `3px solid ${C.green}`, background: `${C.green}18`, opacity: p, transform: `scale(${0.8 + 0.2 * p})`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.text}}>
              <Check p={p} size={44} />
              {n}
            </div>
          );
        })}
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 310, opacity: prodP}}>
          <Chip color={C.amber} style={{fontSize: 24}}>or products: price &gt; ALL (avg per category)</Chip>
        </div>
      </Win>

      <div dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 80, top: 630, width: 460, height: 260, borderRadius: 22, border: `3px solid ${C.red}`, background: `${C.red}12`, opacity: joinP, transform: `scale(${0.9 + 0.1 * joinP})`, fontFamily: MONO, padding: '16px 26px'}}>
        <div style={{fontSize: 26, fontWeight: 700, color: C.red}}>JOIN ✗ duplicates</div>
        {['Ali', 'Ali', 'Ali', 'Omar', 'Omar'].map((n, i) => (
          <div key={i} style={{fontSize: 26, color: C.text, opacity: 0.85, marginTop: 6}}>{n}</div>
        ))}
      </div>
      <div dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 580, top: 630, width: 460, height: 260, borderRadius: 22, border: `3px solid ${C.green}`, background: `${C.green}12`, opacity: inP, transform: `scale(${0.9 + 0.1 * inP})`, fontFamily: MONO, padding: '16px 26px'}}>
        <div style={{fontSize: 26, fontWeight: 700, color: C.green}}>IN ✓ each once</div>
        {['Ali', 'Omar', 'Hany', 'Laila'].map((n, i) => (
          <div key={i} style={{fontSize: 26, color: C.text, marginTop: 6}}>{n}</div>
        ))}
      </div>

      <div style={{boxSizing: 'border-box', position: 'absolute', left: 1100, top: 630, width: 740, height: 260, borderRadius: 22, background: C.card, border: `2px solid ${C.amber}`, opacity: sealP, transform: `scale(${0.92 + 0.08 * sealP})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, padding: '0 40px'}}>
        {['Precision Marketing', 'Outlier Detection', 'No JOIN duplicates'].map((s) => (
          <div key={s} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO, fontSize: 32, fontWeight: 700, color: C.text}}>
            <Check p={sealP} size={44} color={C.amber} />
            {s}
          </div>
        ))}
      </div>

      <Caption text="Clean Subquery Filtering ──► Isolates High-Value Cohorts Without JOIN Duplication" from={t(177.7)} to={t(193)} />
      <Caption text="Enterprise Value ──► Precision Marketing & Outlier Detection" from={t(201)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
