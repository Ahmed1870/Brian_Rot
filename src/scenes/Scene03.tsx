import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, prog} from '../common';

const ROWS = [{e: 'أحمد (CEO)', m: null}, {e: 'سارة', m: 'أحمد'}, {e: 'منى', m: 'أحمد'}, {e: 'كريم', m: 'سارة'}, {e: 'ليلى', m: 'سارة'}] as const;
const RY = 250, RP = 62;

const Case: React.FC<{box: typeof B.s3.inner; left: boolean; t0: number}> = ({box, left, t0}) => {
  const f = useCurrentFrame();
  const col = left ? C.blue : C.red;
  const drop = prog(f, t0 + 150, t0 + 260); // CEO row disappears (INNER only)
  const nul = ease(prog(f, t0 + 120, t0 + 200)); // NULL block slides in (LEFT only)
  const shake = !left && f > t0 + 150 && f < t0 + 260 ? Math.sin(f * 2.5) * 8 : 0;
  return (
    <Card box={box} accent={col} at={t0 === 0 ? 6 : t0}>
      <div style={{position: 'absolute', left: 30, top: 20, direction: 'ltr'}}><Tag color={col}>{left ? 'LEFT JOIN' : 'INNER JOIN'}</Tag></div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 62, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text, lineHeight: 1.45, whiteSpace: 'pre'}}>
        <div><span style={{color: C.pink}}>FROM</span> employees e</div>
        <div><span style={{color: left ? C.blue : C.red}}>{left ? 'LEFT JOIN' : 'INNER JOIN'}</span> employees m</div>
        <div>{'  '}<span style={{color: C.pink}}>ON</span> e.manager_id = m.employee_id;</div>
      </div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 206, display: 'flex', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 22}}>
        <span style={{width: 400, color: C.blue}}>employee</span><span style={{color: C.purple}}>manager</span>
      </div>
      {ROWS.map((r, i) => {
        const ceo = i === 0;
        const gone = ceo && !left && drop > 0;
        const o = prog(f, t0 + 20 + i * 14, t0 + 50 + i * 14);
        return (
          <div key={i} style={{position: 'absolute', left: 30, right: 30, top: RY + i * RP, height: RP - 10, display: 'flex', gap: 16, direction: 'ltr', opacity: gone ? 1 : o, transform: gone ? `translateX(${shake}px)` : undefined}}>
            {gone ? (
              <div style={{flex: 1, borderRadius: 14, border: `3px dashed ${C.red}`, background: `rgba(239,68,68,${0.12 + 0.1 * drop})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: cairo, fontWeight: 900, fontSize: 26, color: C.red}}>سطر الـ CEO اتمسح! manager_id IS NULL</div>
            ) : (
              <>
                <div style={{width: 400, borderRadius: 14, border: `2px solid ${ceo && left ? C.blue : C.line}`, background: ceo && left ? 'rgba(56,189,248,0.16)' : C.panel2, display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text}}>{r.e}</div>
                <div style={{flex: 1, borderRadius: 14, border: `2px solid ${ceo && left ? C.amber : C.line}`, background: ceo && left ? 'rgba(245,158,11,0.16)' : C.panel2, display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: ceo ? mono : cairo, fontWeight: 700, fontSize: 28, color: ceo ? C.amber : C.text, opacity: ceo ? nul : 1, transform: ceo ? `translateX(${(1 - nul) * 120}px)` : undefined}}>{ceo ? 'NULL' : r.m}</div>
              </>
            )}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: col, textAlign: 'center', opacity: prog(f, t0 + (left ? 260 : 200), t0 + (left ? 320 : 260))}}>
        {left ? 'رأس المؤسسة محفوظ، والمدير NULL' : 'فقدنا رأس المؤسسة نهائياً!'}
      </div>
    </Card>
  );
};

export const Scene03: React.FC = () => (
  <Scene dur={S.s3.dur} accent={C.red}>
    <Title ar="حماية قمة الهرم الإداري" en="INNER JOIN vs LEFT JOIN for the CEO" chip="SC 03 · TOP LEVEL" accent={C.red} />
    <Case box={B.s3.inner} left={false} t0={0} />
    <Case box={B.s3.left} left t0={450} />
    <Caption from={90} to={630} color={C.red}>INNER JOIN Hazard ──► Drops CEO Record (where manager_id IS NULL)!</Caption>
    <Caption from={750} to={1230} color={C.green}>LEFT JOIN Solution ──► Preserves Top Level Leadership with NULL Manager</Caption>
  </Scene>
);
