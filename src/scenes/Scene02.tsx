import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['SELECT', C.pink], [' e.first_name ', C.blue], ['AS', C.pink], [' employee_name,', C.text]],
  [['       m.first_name ', C.purple], ['AS', C.pink], [' manager_name', C.text]],
  [['FROM', C.pink], [' employees ', C.text], ['e', C.blue]],
  [['INNER JOIN', C.pink], [' employees ', C.text], ['m', C.purple]],
  [['  ON', C.pink], [' e.manager_id = m.employee_id;', C.text]],
];
const PAIRS = [['سارة', 'أحمد'], ['منى', 'أحمد'], ['كريم', 'سارة'], ['ليلى', 'سارة']];

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s2.code, A = B.s2.alias, R = B.s2.result;
  const size = fs('SELECT e.first_name AS employee_name,', K.w - 70, 34, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 330) * total);
  const ok = ease(prog(f, 840, 900));

  return (
    <Scene dur={S.s2.dur} accent={C.green}>
      <Title ar="الأسماء المستعارة e و m" en="Explicit Table Aliases" chip="SC 02 · ALIASES" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 30, top: 34 + i * 62, height: 62, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
      </Card>

      <Card box={A} accent={ok > 0.5 ? C.green : C.line} at={300}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 24, display: 'flex', gap: 24, direction: 'ltr'}}>
          {[{a: 'e', t: 'Employees', ar: 'الموظفون', c: C.blue}, {a: 'm', t: 'Managers', ar: 'المديرون', c: C.purple}].map((x) => (
            <div key={x.a} style={{flex: 1, height: 100, borderRadius: 18, border: `3px solid ${x.c}`, background: C.panel2, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px'}}>
              <span style={{width: 56, height: 56, borderRadius: 28, background: x.c, color: C.bg, fontFamily: mono, fontWeight: 700, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{x.a}</span>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text}}>employees</span>
              <span style={{fontFamily: cairo, fontWeight: 900, fontSize: 28, color: x.c, marginLeft: 'auto'}}>{x.ar}</span>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 150, direction: 'ltr', display: 'flex', gap: 20, fontFamily: mono, fontWeight: 700, fontSize: 26}}>
          <span style={{color: C.blue, border: `2px solid ${C.blue}`, borderRadius: 12, padding: '6px 16px'}}>AS employee_name</span>
          <span style={{color: C.purple, border: `2px solid ${C.purple}`, borderRadius: 12, padding: '6px 16px'}}>AS manager_name</span>
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 22, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.green, opacity: ok}}>الغموض اتحسم: كل عمود له نسخته ✓</div>
      </Card>

      <Card box={R} accent={C.green} at={540}>
        <div style={{position: 'absolute', left: 28, top: 22, direction: 'ltr'}}><Tag color={C.green}>RESULT</Tag></div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 70, display: 'flex', justifyContent: 'space-between', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 22}}>
          <span style={{color: C.blue, width: 330}}>employee_name</span><span style={{color: C.purple, width: 330}}>manager_name</span>
        </div>
        {PAIRS.map((p, i) => {
          const t = ease(prog(f, 561 + i * 40, 610 + i * 40));
          return (
            <div key={i} style={{position: 'absolute', left: 28, right: 28, top: 116 + i * 76, height: 62, display: 'flex', gap: 16, direction: 'ltr', opacity: t, transform: `translateX(${(1 - t) * -80}px)`}}>
              <div style={{width: 330, borderRadius: 14, border: `2px solid ${C.green}`, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text}}>{p[0]}</div>
              <div style={{flex: 1, borderRadius: 14, border: `2px solid ${C.green}`, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text}}>{p[1]}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 28, right: 28, bottom: 28, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.green, opacity: prog(f, 760, 810)}}>كل موظف وجنبه مديره المباشر</div>
      </Card>

      <Caption from={90} to={630} color={C.blue}>FROM employees e INNER JOIN employees m ON e.manager_id = m.employee_id</Caption>
      <Caption from={750} to={1230} color={C.green}>Explicit Aliases (e, m) ──► Maps Employee Records to Manager Records</Caption>
    </Scene>
  );
};
