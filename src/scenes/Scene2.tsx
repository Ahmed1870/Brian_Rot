import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, pop, prog, sec} from '../kit';

// SC02 (frames 1170-2375, global 39-79.2s): LEFT JOIN + WHERE right.pk IS NULL = anti-join (inactive entities).
const S = 39.0;
const t = (g: number) => sec(g - S);
const ROWS = [
  {n: 'Ahmed', o: '101', nul: false},
  {n: 'Ahmed', o: '102', nul: false},
  {n: 'Sara', o: '103', nul: false},
  {n: 'Omar', o: 'NULL', nul: true},
  {n: 'Mona', o: '104', nul: false},
  {n: 'Karim', o: 'NULL', nul: true},
];
const RH = 52;
const TOP0 = 56 + 44;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(42.0), 24);
  const scan = prog(f, t(52.9), sec(5.2));
  const scanY = TOP0 + scan * ROWS.length * RH;
  const out = (i: number) => prog(f, t(62.6) + i * 14, 24);
  const anti = pop(f, t(65.8));
  const churn = pop(f, t(71.0));
  const seg = prog(f, t(72.7), 24);
  const glow = 0.5 + 0.5 * Math.sin(f / 7);

  return (
    <Stage dur={1205} inFx="zoom" outFx="left">
      <TopBadge text="كشف الكيانات الخاملة | Anti-Join" from={t(40.5)} to={t(60)} color={C.red} />

      <Editor x={90} y={150} w={1120} h={250} title="inactive_customers.sql" lines={['SELECT c.customer_id, c.first_name, o.order_id', 'FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id', 'WHERE o.order_id IS NULL;']} start={t(41.0)} cps={1.2} size={24} accent={C.red} />

      {/* explainers */}
      <div dir="ltr" style={{position: 'absolute', left: 1250, top: 160, width: 580, display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{transform: `scale(${clamp(anti)})`, opacity: clamp(anti), transformOrigin: 'left center'}}><Chip color={C.red} style={{fontSize: 26}}>WHERE o.order_id IS NULL</Chip></div>
        <div style={{transform: `scale(${clamp(anti)})`, opacity: clamp(anti), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 26}}>= Anti-Join</Chip></div>
        <div style={{transform: `scale(${clamp(churn)})`, opacity: clamp(churn), transformOrigin: 'left center'}}><Chip color={C.amber} style={{fontSize: 26}}>Churn Analysis</Chip></div>
      </div>

      {/* LEFT JOIN result with laser */}
      <Win x={90} y={430} w={1000} h={470} title="LEFT JOIN result" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{position: 'relative', padding: '8px 22px 0 22px'}}>
          <div style={{display: 'flex', fontFamily: MONO, fontSize: 19, color: C.muted, height: 38, alignItems: 'center', borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 300}}>first_name</div>
            <div>order_id</div>
          </div>
          {ROWS.map((r, i) => {
            const y = 46 + i * RH;
            const hit = r.nul && scanY > TOP0 + (i + 0.5) * RH - 56 + 56 ? 1 : 0;
            const hot = r.nul && scan * ROWS.length > i + 0.5;
            return (
              <div key={i} style={{position: 'absolute', left: 22, right: 22, top: y, height: RH - 6, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24, color: C.text, borderRadius: 10, background: hot ? `${C.red}26` : C.deep, border: `2px solid ${hot ? C.red : C.border}`, boxShadow: hot ? `0 0 ${16 * glow}px ${C.red}66` : 'none', opacity: clamp(tbl)}}>
                <div style={{width: 300, paddingLeft: 14}}>{r.n}</div>
                <div style={{color: r.nul ? C.amber : C.text, fontWeight: r.nul ? 700 : 400}}>{r.o}</div>
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 8, right: 8, top: scanY - 56 - 4, height: 6, borderRadius: 3, background: C.red, boxShadow: `0 0 22px ${C.red}`, opacity: scan > 0 && scan < 1 ? 1 : 0}} />
        </div>
      </Win>

      {/* isolated churn table */}
      <Win x={1150} y={430} w={680} h={300} title="churn_candidates" accent={out(0) > 0.2 ? C.green : C.border} opacity={prog(f, t(61.8), 20)}>
        <div dir="ltr" style={{padding: '14px 22px', fontFamily: MONO, fontSize: 24, color: C.text}}>
          {['Omar', 'Karim'].map((n, i) => (
            <div key={n} style={{display: 'flex', alignItems: 'center', height: 64, marginBottom: 12, borderRadius: 12, border: `2px solid ${C.green}`, background: `${C.green}1F`, padding: '0 20px', boxShadow: `0 0 ${14 * glow * out(i)}px ${C.green}55`, opacity: clamp(out(i)), transform: `translateX(${(1 - clamp(out(i))) * -420}px)`}}>
              <span style={{width: 200}}>{n}</span>
              <span style={{color: C.amber}}>0 orders</span>
            </div>
          ))}
        </div>
      </Win>
      <div style={{position: 'absolute', left: 1150, top: 760, width: 680, opacity: seg}}>
        <Mix style={{fontSize: 34, fontWeight: 700, color: C.text, display: 'block'}}>عملاء بدون أي عملية شراء — شريحة تسويقية مستهدفة</Mix>
      </div>

      <Caption text="WHERE o.order_id IS NULL ──► Anti-Join / Inactive Entity Isolation" from={t(47)} to={t(66)} />
      <Caption text="Churn Analysis ──► Pinpoints Customers with Zero Purchase History" from={t(66.5)} to={t(78)} />
    </Stage>
  );
};
