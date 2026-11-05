import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {BRANCHES, B_TOTAL, QS, Q_TOTAL, SALES} from '../data';

// SC05 (170-209s): quarterly sales matrix per branch with FILTER.
// Anchors (s): 171.2 enterprise | 179.8 quarterly distribution | 186.7 FILTER with SUM | 192.9 decision makers | 201.2 expansion + logistics
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const seal = clamp(pop(f, t(192.9)));
  const hl = clamp(lin(f, t(186.7), 14));
  const rows = [...BRANCHES.map((b, i) => ({name: b, vals: SALES[i], total: B_TOTAL[i]})), {name: 'TOTAL', vals: Q_TOTAL, total: B_TOTAL.reduce((a, b) => a + b, 0)}];
  return (
    <Stage dur={1170} inFx="morph" outFx="fade">
      <TopBadge text="التوزيع الرباعي | Quarterly Executive Matrix" from={sec(1)} to={sec(36)} color={C.amber} />

      <Editor x={80} y={170} w={1120} h={310} title="Query Editor" lines={['SELECT branch_name,', '  SUM(amount) FILTER (WHERE EXTRACT(QUARTER FROM sale_date) = 1) AS Q1_sales,', '  SUM(amount) FILTER (WHERE EXTRACT(QUARTER FROM sale_date) = 2) AS Q2_sales,', '  SUM(amount) FILTER (WHERE EXTRACT(QUARTER FROM sale_date) = 3) AS Q3_sales,', '  SUM(amount) FILTER (WHERE EXTRACT(QUARTER FROM sale_date) = 4) AS Q4_sales', 'FROM branch_sales GROUP BY branch_name;']} start={t(171.2)} cps={1.4} size={21} hl={f >= t(186.7) ? 1 : -1} hlColor={C.green} />

      <div dir="ltr" style={{position: 'absolute', left: 1260, top: 190, display: 'flex', alignItems: 'center', gap: 14, opacity: seal, transform: `scale(${0.85 + 0.15 * seal}) rotate(-3deg)`, background: C.card, border: `3px solid ${C.green}`, borderRadius: 18, padding: '10px 26px', fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green}}>
        <Check p={seal} size={42} /> MATRIX APPROVED
      </div>
      <div style={{position: 'absolute', left: 1260, top: 300, opacity: clamp(pop(f, t(201.2)))}}><Chip color={C.amber} style={{fontSize: 24}}>supports expansion plans</Chip></div>
      <div style={{position: 'absolute', left: 1260, top: 366, opacity: clamp(pop(f, t(203.0)))}}><Chip color={C.blue} style={{fontSize: 24}}>logistics &amp; inventory efficiency</Chip></div>

      <Win x={80} y={510} w={1760} h={380} title="quarterly_sales_report · one row per branch" accent={C.green}>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 0, height: 50, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 26, fontWeight: 700}}>
          <span style={{width: 300, color: C.muted}}>branch_name</span>
          {QS.map((q) => <span key={q} style={{width: 270, textAlign: 'center', color: hl > 0.3 ? C.green : C.muted}}>{q}_sales</span>)}
          <span style={{flex: 1, textAlign: 'right', color: C.muted}}>total</span>
        </div>
        {rows.map((r, ri) => {
          const last = ri === rows.length - 1;
          return (
            <div key={r.name} dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 54 + ri * 64, height: 58, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 30, fontWeight: 700, borderTop: last ? `2px solid ${C.border}` : 'none'}}>
              <span style={{width: 300, color: last ? C.amber : C.text}}>{r.name}</span>
              {r.vals.map((v, qi) => {
                const p = clamp(lin(f, t(179.8 + ri * 1.0 + qi * 0.25), 12));
                return <span key={qi} style={{width: 270, textAlign: 'center', color: last ? C.amber : C.text, opacity: p, transform: `translateX(${(1 - p) * 40}px)`}}>{v}K</span>;
              })}
              <span style={{flex: 1, textAlign: 'right', color: C.green, opacity: clamp(lin(f, t(179.8 + ri * 1.0 + 1.1), 12))}}>{r.total}K</span>
            </div>
          );
        })}
      </Win>
      <Caption text="Enterprise Matrix ──► Quarterly Sales Breakdown (Q1-Q4) per Branch" from={t(174)} to={t(190)} />
      <Caption text="Executive Reporting ──► High-Density Comparison Matrix in Single Rows" from={t(193)} to={sec(38.5)} tone="ok" />
    </Stage>
  );
};
