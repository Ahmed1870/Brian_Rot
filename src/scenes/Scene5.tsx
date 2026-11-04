import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, fmt, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc05;
const T0 = S.typeT;
const CODE: CodeLine[] = [
  'SELECT e.first_name, e.salary, e.department_id', 'FROM employees e', 'WHERE e.salary > (', '    SELECT AVG(salary) FROM employees', '    WHERE department_id = e.department_id',
  ') AND NOT EXISTS (', '    SELECT 1 FROM disciplinary_actions d', '    WHERE d.employee_id = e.employee_id', ');',
].map((text, i) => ({text, at: T0 + i * 1.9, dt: 0.03}));
const CARDS = [
  {n: 'أحمد', d: 'Sales', s: 9000, avg: 8500, bad: false}, {n: 'عمر', d: 'HR', s: 7500, avg: 7000, bad: true}, {n: 'ياسمين', d: 'IT', s: 13000, avg: 12000, bad: false},
];

export const Scene5: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 170.3, 171.3);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const audit = prog(t, 188.6, 190);
  const out = eo(prog(t, 191, 192.6));
  const stamp = prog(t, S.seal, S.seal + 0.55);
  const stampP = stamp <= 0 ? 0 : stamp < 1 ? 1.8 - 0.8 * eo(stamp) : 1;
  const count = t > 192.6 ? 2 : 3;
  let slot = 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="Enterprise Subqueries" body="──► Correlated Salary Benchmark + NOT EXISTS Audit" color={D.code} size={26} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="Sub-Millisecond Execution" body="──► Zero Row Duplication & Clean Business Logic" color={D.cat} size={26} /></div>
      <div style={{opacity: enter}}><Code lines={CODE} t={t} x={60} y={190} w={940} h={560} title="hr_report.sql" fontSize={24} lineH={50} /></div>

      {/* executive HR report */}
      <div style={{position: 'absolute', left: 1040, top: 190, width: 820, height: 700, borderRadius: 28, background: 'linear-gradient(160deg,#22304A,#1B2740)', border: `2.5px solid ${D.cat}`, boxShadow: `0 28px 70px rgba(0,0,0,0.5), 0 0 ${24 + 22 * warm * (t > S.seal ? 1 : 0)}px ${D.cat}66`, opacity: appear(t, 172, 173), overflow: 'hidden'}}>
        <div style={{height: 84, background: `linear-gradient(90deg, ${D.cat}55, ${D.cat}11)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px'}}>
          <span style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 36, color: C.text}}>تقرير الموارد البشرية</span>
          <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: D.cat}}>{count} employees</span>
        </div>
        {CARDS.map((c, i) => {
          const inP = back(prog(t, 182.5 + i * 0.9, 183.3 + i * 0.9));
          const flagged = c.bad && audit > 0;
          const gone = c.bad ? out : 0;
          const myIdx = CARDS.slice(0, i).filter((x) => !x.bad || out < 1).length;
          const y = 106 + (c.bad ? 0 : 0) + i * 150 - (CARDS.slice(0, i).filter((x) => x.bad).length) * 150 * out;
          slot += 1;
          return (
            <div key={c.n} style={{position: 'absolute', left: 24, right: 24, top: y, height: 132, borderRadius: 20, background: flagged ? `rgba(127,29,29,${0.35 * (1 - gone)})` : `${D.cat}1F`, border: `2px solid ${flagged ? D.err : D.cat}`, opacity: Math.min(1, inP * 2) * (1 - gone), transform: `translateX(${(1 - inP) * 120 + (flagged && gone < 1 ? Math.sin(t * 70) * 6 * (1 - audit * 0.0) : 0) + gone * 300}px)`, display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px'}}>
              <div style={{width: 70, height: 70, borderRadius: 35, background: flagged ? D.err : D.cat, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_AR, fontWeight: 900, fontSize: 38, color: C.bg}}>{c.n[0]}</div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 38, color: C.text}}>{c.n} <span style={{fontFamily: FONT_MONO, fontSize: 21, color: C.mute}}>{c.d}</span></div>
                <div style={{fontFamily: FONT_MONO, fontSize: 23, color: C.dim}}>salary {fmt(c.s)} &gt; avg {fmt(c.avg)}</div>
              </div>
              {flagged ? <span style={{padding: '8px 18px', borderRadius: 12, background: D.err, color: '#fff', fontFamily: FONT_AR, fontWeight: 800, fontSize: 24}}>مخالفة إدارية ✕</span> : <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: D.cat, opacity: t > 189 ? 1 : 0.0}}>✓</span>}
            </div>
          );
        })}
        {audit > 0 ? <div style={{position: 'absolute', left: 30, bottom: 28, fontFamily: FONT_MONO, fontSize: 21, color: C.dim, opacity: Math.min(1, audit * 2)}}>NOT EXISTS → disciplinary_actions: employee 4 (عمر) ✕</div> : null}
        {stampP > 0 ? (
          <div style={{position: 'absolute', right: 30, bottom: 70, opacity: Math.min(1, stamp * 4), transform: `rotate(-8deg) scale(${stampP})`}}>
            <div style={{padding: '12px 28px', borderRadius: 18, border: `5px double ${D.cat}`, background: 'rgba(11,18,34,0.92)', boxShadow: `0 0 ${30 + 20 * warm}px ${D.cat}`, textAlign: 'center'}}>
              <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: D.cat}}>VERIFIED ✓</div>
              <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 22, color: C.text, direction: 'rtl'}}>اعتماد الأداء التنفيذي</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
