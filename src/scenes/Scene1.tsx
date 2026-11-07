import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Card} from '../components/Card';
import {Code, CodeLine} from '../components/Code';
import {Bi, appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc01;
const CODE: CodeLine[] = ['SELECT customer_id, SUM(total_amount)', 'FROM store_orders', "WHERE order_date >= '2026-01-01'", 'GROUP BY customer_id;'].map((text, i) => ({text, at: 1.6 + i * 1.3}));
const CAND = [{l: 'Seq Scan', cost: '0.00..35.50', y: 190}, {l: 'Index Scan', cost: '0.29..8.31', y: 370}, {l: 'Bitmap Heap Scan', cost: '4.30..12.80', y: 550}];

export const Scene1: React.FC<{t: number}> = ({t}) => {
  const badgeP = pop(t, S.badge[0], S.badge[0] + 0.8) * (1 - seg(t, S.badge[1] - 0.4, S.badge[1]));
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const opt = back(prog(t, S.opt, S.opt + 0.8));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 0, top: 92, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, badgeP * 1.5), transform: `translateY(${(1 - badgeP) * -60}px)`}}>
        {badgeP > 0.01 ? <div style={{padding: '16px 50px', borderRadius: 999, background: 'rgba(30,41,59,0.95)', border: `2px solid ${D.code}`, boxShadow: `0 0 40px ${D.code}55`}}><Bi ar="تحليل خطط التنفيذ" en="Query Execution Plan (EXPLAIN)" size={48} t={t} start={S.badge[0] + 0.15} /></div> : null}
      </div>
      <div style={{position: 'absolute', left: 60, top: 96, height: 60}}><Tag t={t} range={S.tag} head="Query Planner" body="──► Generates Execution Tree & Cost Estimates" color={D.code} size={27} /></div>
      <div style={{opacity: appear(t, 0.5, 1.4)}}><Code lines={CODE} t={t} x={60} y={200} w={780} h={300} title="query.sql" fontSize={25} lineH={48} /></div>
      <Card x={900} y={290} w={260} h={150} c={D.code} glow={30 + 20 * warm} op={appear(t, 2, 3)}>
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}><div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: D.code}}>Query</div><div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: C.text}}>Planner</div></div>
      </Card>
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        <line x1="840" y1="350" x2="900" y2="365" stroke={D.code} strokeWidth="5" strokeDasharray="8 8" opacity={appear(t, 2, 3)} />
        {CAND.map((c, i) => {
          const p = eo(prog(t, S.branch + i * 0.8, S.branch + 1.2 + i * 0.8));
          return <path key={i} d={`M1160 365 C 1230 365 1230 ${c.y + 70} 1300 ${c.y + 70}`} fill="none" stroke={i === 1 && opt > 0.1 ? D.cat : D.code} strokeWidth="5" pathLength={1} strokeDasharray={`${p} 1`} style={{filter: `drop-shadow(0 0 8px ${i === 1 && opt > 0.1 ? D.cat : D.code})`}} />;
        })}
      </svg>
      {CAND.map((c, i) => {
        const p = back(prog(t, S.branch + 0.8 + i * 0.8, S.branch + 1.5 + i * 0.8));
        const win = i === 1;
        const col = win && opt > 0.1 ? D.cat : D.code;
        return (
          <Card key={c.l} x={1300} y={c.y} w={560} h={140} c={col} glow={win ? 20 + 30 * opt : 14} op={Math.min(1, p * 2) * (win ? 1 : 1 - 0.55 * opt)}>
            <div style={{padding: '22px 30px', transform: `scale(${win ? 1 + 0.03 * opt : 1})`}}>
              <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 34, color: C.text}}>{c.l}</div>
              <div style={{fontFamily: FONT_MONO, fontSize: 25, color: win && opt > 0.1 ? D.cat : D.key, marginTop: 8}}>cost={c.cost}</div>
            </div>
          </Card>
        );
      })}
      {opt > 0.02 ? <div style={{position: 'absolute', left: 1300, top: 740, width: 560, opacity: Math.min(1, opt * 2), transform: `scale(${0.8 + 0.2 * opt})`, transformOrigin: '0 0'}}><div style={{padding: '14px 26px', borderRadius: 999, background: `${D.cat}26`, border: `2.5px solid ${D.cat}`, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, color: D.cat, textAlign: 'center', boxShadow: `0 0 ${24 + 14 * warm}px ${D.cat}`}}>Cost-Based Optimization ✓</div></div> : null}
      <div style={{position: 'absolute', left: 60, top: 560, width: 780, fontFamily: FONT_AR, fontWeight: 800, fontSize: 32, color: C.dim, direction: 'rtl', lineHeight: 1.5, opacity: appear(t, 8, 9)}}>خطة التنفيذ = خريطة معمارية يصممها الـ <span style={{color: D.code}}>Query Planner</span> لاختيار المسار الأقل تكلفة بدل التخمين</div>
    </div>
  );
};
