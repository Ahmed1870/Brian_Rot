import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Card} from '../components/Card';
import {Code, CodeLine} from '../components/Code';
import {appear} from '../components/Text';
import {Tag} from '../components/Tag';
import {eo, fmt, prog, pulse} from '../lib/anim';

const S = TL.cues.sc05;
const Q: CodeLine[] = ['EXPLAIN (ANALYZE, BUFFERS)', 'SELECT customer_id, SUM(total_amount)', 'FROM store_orders GROUP BY 1;'].map((text, i) => ({text, at: S.typeT + i * 1.5}));
const IX: CodeLine[] = [{text: 'CREATE INDEX idx_orders_cust_amt', at: S.idx}, {text: '  ON store_orders (customer_id, total_amount);', at: S.idx + 1.4}];

export const Scene5: React.FC<{t: number}> = ({t}) => {
  const en = appear(t, TL.scenes[4].start + 0.3, TL.scenes[4].start + 1.3);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const p = eo(prog(t, S.drop, S.drop + 2.4));
  const ms = 4120 * Math.pow(1.82 / 4120, p);
  const stamp = prog(t, S.seal, S.seal + 0.55);
  const sc = stamp <= 0 ? 0 : stamp < 1 ? 1.8 - 0.8 * eo(stamp) : 1;
  const done = p >= 1;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="Enterprise Query Diagnostics" body="──► EXPLAIN ANALYZE Benchmarking" color={D.code} size={27} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="Optimization Impact" body="──► Execution Time: 4,120 ms ➔ 1.82 ms" color={D.cat} size={27} /></div>
      <div style={{opacity: en}}><Code lines={Q} t={t} x={60} y={190} w={1000} h={250} title="diagnose.sql" fontSize={25} lineH={50} /></div>
      {t >= S.idx - 0.3 ? <div style={{opacity: appear(t, S.idx - 0.3, S.idx)}}><Code lines={IX} t={t} x={60} y={470} w={1000} h={190} title="add_index.sql" fontSize={24} lineH={52} accent={D.cat} /></div> : null}
      <div style={{position: 'absolute', left: 60, top: 700, width: 1000, fontFamily: FONT_AR, fontWeight: 800, fontSize: 30, color: C.dim, direction: 'rtl', opacity: appear(t, S.idx + 3, S.idx + 4), lineHeight: 1.5}}>فهرس مغطّي ← يتحول الاستعلام من <span style={{color: D.err}}>Seq Scan</span> إلى <span style={{color: D.cat}}>Index Only Scan</span></div>

      <Card x={1100} y={190} w={760} h={700} c={done ? D.cat : D.err} glow={22 + 18 * warm * (done ? 1 : 0)} op={en}>
        <div style={{padding: '24px 34px'}}>
          <div style={{fontFamily: FONT_MONO, fontSize: 22, color: C.mute, letterSpacing: 2}}>EXECUTION TIME</div>
          <div style={{marginTop: 26, opacity: appear(t, S.typeT + 4.5, S.typeT + 5.5)}}>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: D.err}}>BEFORE INDEX · Seq Scan</div>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 68, color: D.err, textShadow: `0 0 22px ${D.err}66`}}>4,120.00 ms</div>
            <div style={{height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.07)'}}><div style={{width: '100%', height: 24, borderRadius: 12, background: D.err}} /></div>
          </div>
          <div style={{marginTop: 60, opacity: appear(t, S.drop - 0.4, S.drop + 0.4)}}>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26, color: D.cat}}>AFTER INDEX · Index Only Scan</div>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 68, color: D.cat, textShadow: `0 0 22px ${D.cat}66`}}>{done ? '1.82' : ms >= 100 ? fmt(ms) : ms.toFixed(2)} ms</div>
            <div style={{height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.07)'}}><div style={{width: `${Math.max(1.5, (ms / 4120) * 100)}%`, height: 24, borderRadius: 12, background: D.cat}} /></div>
          </div>
          {done ? <div style={{marginTop: 40, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 40, color: D.cat, opacity: appear(t, S.drop + 2.4, S.drop + 3)}}>≈ 2,264× faster</div> : null}
        </div>
      </Card>
      {sc > 0 ? (
        <div style={{position: 'absolute', left: 1360, top: 740, opacity: Math.min(1, stamp * 4), transform: `rotate(-8deg) scale(${sc})`}}>
          <div style={{padding: '12px 28px', borderRadius: 18, border: `5px double ${D.cat}`, background: 'rgba(11,18,34,0.92)', boxShadow: `0 0 ${30 + 20 * warm}px ${D.cat}`, textAlign: 'center'}}>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 38, color: D.cat}}>BENCHMARK ✓</div>
            <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 22, color: C.text, direction: 'rtl'}}>اعتماد التسريع المؤسسي</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
