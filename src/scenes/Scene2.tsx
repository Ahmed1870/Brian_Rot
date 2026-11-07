import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Card} from '../components/Card';
import {Code, CodeLine} from '../components/Code';
import {appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, prog, pulse} from '../lib/anim';

const S = TL.cues.sc02;
const PUR = '#A855F7';
const L: CodeLine[] = [{text: 'EXPLAIN SELECT * FROM orders WHERE customer_id = 42;', at: S.typeT, dt: 0.04}];
const R: CodeLine[] = [{text: 'EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;', at: S.analyze, dt: 0.035}];
const G: CodeLine[] = [{text: 'BEGIN;', at: S.guard + 0.5}, {text: 'EXPLAIN ANALYZE UPDATE orders SET status = 1;', at: S.guard + 1.1, dt: 0.03}, {text: 'ROLLBACK;', at: S.guard + 2.6}];

export const Scene2: React.FC<{t: number}> = ({t}) => {
  const en = appear(t, TL.scenes[1].start + 0.3, TL.scenes[1].start + 1.3);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const tm = eo(prog(t, S.timing, S.timing + 2.2));
  const dimL = 1 - 0.45 * eo(prog(t, S.analyze - 0.5, S.analyze + 0.5));
  const guard = back(prog(t, S.guard, S.guard + 0.8));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="EXPLAIN" body="──► Static Planner Estimates (Zero Data Mutation)" color={D.key} size={27} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="EXPLAIN ANALYZE" body="──► Real Execution + Actual Timing (actual time)" color={D.cat} size={27} /></div>

      <div style={{opacity: en * dimL}}>
        <Card x={60} y={190} w={880} h={700} c={D.key} glow={20}><div style={{position: 'absolute', left: 30, top: 18, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 38, color: D.key}}>EXPLAIN</div></Card>
        <Code lines={L} t={t} x={90} y={260} w={820} h={140} title="static.sql" fontSize={23} lineH={52} accent={D.key} />
        <div style={{position: 'absolute', left: 90, top: 430, fontFamily: FONT_MONO, fontSize: 21, color: C.text, opacity: appear(t, S.typeT + 3, S.typeT + 4), lineHeight: 1.6}}>Seq Scan on orders  (cost=0.00..35.50 rows=2550 width=42)<br /><span style={{color: C.mute}}>  Filter: (customer_id = 42)</span></div>
        <div style={{position: 'absolute', left: 90, top: 580, width: 820, opacity: appear(t, S.typeT + 4, S.typeT + 5)}}>
          <div style={{padding: '14px 24px', borderRadius: 16, background: `${D.key}22`, border: `2px solid ${D.key}`, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 25, color: D.key}}>Static Estimation Only (No Execution)</div>
          <div style={{height: 26, borderRadius: 13, marginTop: 18, background: `repeating-linear-gradient(45deg, ${D.key}88 0px, ${D.key}88 14px, ${D.key}33 14px, ${D.key}33 28px)`}} />
          <div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 28, color: C.dim, direction: 'rtl', marginTop: 18}}>تقدير نظري من إحصائيات pg_statistic بدون تشغيل الاستعلام</div>
        </div>
      </div>

      <div style={{opacity: en * (0.5 + 0.5 * eo(prog(t, S.analyze - 0.5, S.analyze + 0.5)))}}>
        <Card x={980} y={190} w={880} h={700} c={D.cat} glow={20 + 16 * warm * (t > S.analyze ? 1 : 0)}><div style={{position: 'absolute', left: 30, top: 18, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 38, color: D.cat}}>EXPLAIN ANALYZE</div></Card>
        <Code lines={R} t={t} x={1010} y={260} w={820} h={140} title="real.sql" fontSize={19} lineH={52} accent={D.cat} />
        <div style={{position: 'absolute', left: 1010, top: 425, fontFamily: FONT_MONO, fontSize: 21, color: C.text, opacity: appear(t, S.analyze + 2.5, S.analyze + 3.5), lineHeight: 1.6}}>Seq Scan on orders  (cost=0.00..35.50 rows=2550 width=42)<br /><span style={{color: D.cat}}>  (actual time=0.018..0.042 rows=2550 loops=1)</span></div>
        <div style={{position: 'absolute', left: 1010, top: 540, width: 820, opacity: appear(t, S.timing - 0.3, S.timing + 0.4)}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}><span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 70, color: D.cat, textShadow: `0 0 24px ${D.cat}66`}}>{(0.042 * tm).toFixed(3)}</span><span style={{fontFamily: FONT_MONO, fontSize: 28, color: C.dim}}>ms · actual time</span></div>
          <div style={{height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.08)', marginTop: 8}}><div style={{width: `${100 * tm}%`, height: 20, borderRadius: 10, background: D.cat}} /></div>
        </div>
      </div>
      {guard > 0.02 ? (
        <div style={{position: 'absolute', left: 1010, top: 700, width: 820, opacity: Math.min(1, guard * 2), transform: `scale(${0.9 + 0.1 * guard})`, transformOrigin: '0 0'}}>
          <div style={{borderRadius: 20, background: `${PUR}1F`, border: `2.5px solid ${PUR}`, padding: '14px 22px', boxShadow: `0 0 ${24 + 14 * warm}px ${PUR}66`}}>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: PUR, marginBottom: 6}}>DML Actions Execute for Real ──► Wrap with ROLLBACK</div>
            <div style={{fontFamily: FONT_MONO, fontSize: 22, color: C.text, lineHeight: 1.5}}><span style={{color: D.code}}>BEGIN</span>;<br /><span style={{color: D.code}}>EXPLAIN ANALYZE UPDATE</span> orders SET status = 1;<br /><span style={{color: PUR, fontWeight: 800}}>ROLLBACK;</span> <span style={{color: C.dim, fontFamily: FONT_AR}}>— يمنع تعديل البيانات الحية</span></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
