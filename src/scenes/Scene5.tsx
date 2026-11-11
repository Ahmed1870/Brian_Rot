import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC05 (168.9-205.9s): tuning store_orders - 5.2 s Seq Scan becomes a 0.6 ms Index Scan.
// Anchors (s): 169.1 production scenario | 179.7 composite index on date + status | 186.6 plan flips to Index Scan | 192.1 5 s down to under 1 ms
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const flip = f >= t(186.6);
  const bar = clamp(lin(f, t(175), sec(4)));
  const seal = clamp(pop(f, t(192.1)));
  return (
    <Stage dur={1110} inFx="morph" outFx="fade">
      <TopBadge text="التطبيق المؤسسي | Enterprise Query Tuning" from={sec(1)} to={sec(16)} color={C.green} />

      <Editor x={80} y={180} w={1180} h={330} title="manzooma_store_db" lines={['EXPLAIN ANALYZE SELECT * FROM store_orders', "WHERE order_date >= '2026-01-01'", "  AND status = 'COMPLETED';", '-- Seq Scan on store_orders  (5.2 s)', 'CREATE INDEX idx_orders_date_status', '  ON store_orders(order_date, status);']} start={t(169.1)} cps={0.48} size={22} hl={f >= t(179.7) ? 4 : f >= t(172) ? 3 : -1} hlColor={f >= t(179.7) ? C.green : C.red} />

      <Win x={1300} y={180} w={540} h={330} title="Execution plan" accent={flip ? C.green : C.red}>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 26, fontFamily: MONO, fontSize: 26, fontWeight: 700, color: flip ? C.green : C.red}}>{flip ? 'Index Scan' : 'Seq Scan'}</div>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 70, fontFamily: MONO, fontSize: 20, color: C.muted}}>{flip ? 'using idx_orders_date_status' : 'on store_orders'}</div>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 118, fontFamily: MONO, fontSize: 84, fontWeight: 700, color: flip ? C.green : C.red}}>{flip ? '0.6ms' : '5.2s'}</div>
        <div dir="ltr" style={{position: 'absolute', left: 28, top: 214, fontFamily: MONO, fontSize: 20, color: C.muted}}>Execution Time</div>
      </Win>

      <Win x={80} y={540} w={1180} h={340} title="query response time" accent={C.border}>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 30, width: 200, fontFamily: MONO, fontSize: 22, color: C.muted}}>Seq Scan</div>
        <div dir="ltr" style={{position: 'absolute', left: 240, top: 24, width: 880, height: 40, borderRadius: 10, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
          <div style={{width: `${100 * bar}%`, height: '100%', background: C.red}} />
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 110, width: 200, fontFamily: MONO, fontSize: 22, color: C.muted}}>Index Scan</div>
        <div dir="ltr" style={{position: 'absolute', left: 240, top: 104, width: 880, height: 40, borderRadius: 10, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden'}}>
          <div style={{width: `${1.2 * clamp(lin(f, t(186.6), 14))}%`, height: '100%', background: C.green, minWidth: flip ? 8 : 0}} />
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 240, top: 160, fontFamily: MONO, fontSize: 24, color: C.red, opacity: bar}}>5.2 s</div>
        <div dir="ltr" style={{position: 'absolute', left: 420, top: 160, fontFamily: MONO, fontSize: 24, color: C.green, opacity: clamp(lin(f, t(188), 14))}}>0.6 ms</div>
        <div style={{position: 'absolute', left: 30, top: 222, opacity: clamp(pop(f, t(192.1)))}}><Chip color={C.green} style={{fontSize: 26}}>~8,600× faster</Chip></div>
      </Win>

      <div style={{position: 'absolute', left: 1300, top: 540, width: 540, height: 340, borderRadius: 22, border: `3px solid ${C.green}`, background: `${C.green}14`, boxShadow: `0 0 ${36 * seal}px ${C.green}66`, opacity: seal, transform: `scale(${0.9 + 0.1 * seal})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
        <Check p={seal} size={110} />
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.green}}>Enterprise Quality Seal</div>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 21, color: C.text}}>sub-millisecond Index Scan</div>
      </div>

      <Caption text="Enterprise Query Tuning ──► Resolving Seq Scan Bottlenecks on store_orders" from={t(170.5)} to={t(186)} />
      <Caption text="Production Performance ──► Replaced Full Table Scan with Sub-Millisecond Index Scan" from={t(190)} to={sec(36.5)} tone="ok" />
    </Stage>
  );
};
