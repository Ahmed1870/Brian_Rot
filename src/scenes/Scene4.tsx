import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC04 (frames 3745-4930, global 124.8-164.3s): DELETE (DML, row level, FK-guarded) vs TRUNCATE (DDL, page reset).
const S = 124.83;
const t = (g: number) => sec(g - S);

const CUST = [
  {id: 8, n: 'Mona'},
  {id: 9, n: 'Karim'},
  {id: 10, n: 'Nour'},
  {id: 5, n: 'Sara'},
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const intro = prog(f, t(126.4), 24);
  const rowHi = prog(f, t(132.1), 16);
  const dissolve = prog(f, t(136.1), sec(1.6));
  const fkLines = prog(f, t(139.9), 24);
  const tryDel = prog(f, t(142.8), 14);
  const shield = pop(f, t(144.9));
  const tOn = prog(f, t(147.2), 22);
  const ddl = pop(f, t(149.6));
  const sweep = prog(f, t(151.2), sec(1.8));
  const reset = pop(f, t(153.4));
  const pages = prog(f, t(153.6), sec(2.3));
  const fkErr = pop(f, t(156.4));
  const seq = Math.round(lerp(4821, 1, reset > 0.5 ? 1 : 0));
  const shake = f >= t(144.9) && f < t(147) ? Math.sin(f * 2.6) * 6 : 0;

  return (
    <Stage dur={1185} inFx="up" outFx="zoom">
      <TopBadge text="الحذف الآمن | DELETE مقابل TRUNCATE" from={t(126.4)} to={t(146)} color={C.red} />

      {/* divider */}
      <div style={{position: 'absolute', left: 959, top: 150, width: 2, height: 770, background: C.border, opacity: intro}} />

      {/* ---------- left: DELETE ---------- */}
      <div dir="ltr" style={{position: 'absolute', left: 90, top: 150, opacity: intro}}>
        <Chip color={C.blue}>DELETE FROM · DML</Chip>
      </div>
      <Editor x={90} y={200} w={820} h={150} title="delete.sql" lines={['DELETE FROM customers', 'WHERE customer_id = 10;']} start={t(129.9)} cps={0.8} size={26} accent={C.blue} opacity={intro} />

      <Win x={90} y={380} w={820} h={380} title="customers" accent={C.border} opacity={intro}>
        <div dir="ltr" style={{padding: '12px 14px'}}>
          {CUST.map((r) => {
            const isTarget = r.id === 10;
            const isFk = r.id === 5;
            const dis = isTarget ? dissolve : 0;
            return (
              <div key={r.id} style={{display: 'flex', alignItems: 'center', height: 72, marginBottom: 8, borderRadius: 12, padding: '0 20px', fontFamily: MONO, fontSize: 28, color: C.text, background: isTarget && rowHi > 0.5 && dis < 0.1 ? `${C.blue}22` : isFk && tryDel > 0.4 ? `${C.red}22` : C.deep, border: `2px solid ${isFk && shield > 0.3 ? C.red : isTarget && rowHi > 0.5 ? C.blue : C.border}`, opacity: 1 - dis, transform: `translateX(${isFk ? shake : dis * 60}px) scaleY(${1 - 0.3 * dis})`}}>
                <span style={{width: 90, color: C.muted}}>{r.id}</span>
                <span style={{flex: 1}}>{r.n}</span>
                {isFk && <span style={{fontSize: 20, color: C.amber, opacity: fkLines}}>3 orders ↗</span>}
              </div>
            );
          })}
        </div>
      </Win>

      {/* orders link for FK */}
      <div dir="ltr" style={{position: 'absolute', left: 90, top: 790, width: 820, height: 110, borderRadius: 20, border: `2px solid ${shield > 0.3 ? C.red : C.border}`, background: shield > 0.3 ? `${C.red}14` : C.card, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 20, opacity: fkLines}}>
        <svg width={64} height={72} viewBox="0 0 80 92" style={{transform: `scale(${0.8 + 0.2 * clamp(shield)})`, opacity: shield > 0.1 ? 1 : 0.35}}>
          <path d="M40 4 L74 18 V46 C74 66 58 80 40 88 C22 80 6 66 6 46 V18 Z" fill={`${C.red}22`} stroke={shield > 0.1 ? C.red : C.muted} strokeWidth={5} />
        </svg>
        <div>
          <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: shield > 0.3 ? C.red : C.muted}}>FOREIGN KEY · ON DELETE RESTRICT</div>
          <Mix style={{fontSize: 28, color: C.text}}>{shield > 0.3 ? 'مرفوض: العميل له طلبات قائمة' : 'orders.customer_id → customers'}</Mix>
        </div>
      </div>

      {/* ---------- right: TRUNCATE ---------- */}
      <div dir="ltr" style={{position: 'absolute', left: 1010, top: 150, opacity: lerp(0.35, 1, tOn)}}>
        <Chip color={C.amber}>TRUNCATE · DDL</Chip>
      </div>
      <Editor x={1010} y={200} w={820} h={150} title="truncate.sql" lines={['TRUNCATE TABLE logs;']} start={t(147.3)} cps={0.7} size={30} accent={C.amber} opacity={lerp(0.35, 1, tOn)} />

      <Win x={1010} y={380} w={820} h={380} title="logs" accent={C.border} opacity={lerp(0.4, 1, tOn)}>
        <div dir="ltr" style={{padding: '14px 18px'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12}}>
            {Array.from({length: 18}).map((_, i) => {
              const col = i % 6;
              const gone = clamp((sweep * 7 - col) / 1.2) ;
              return (
                <div key={i} style={{height: 74, borderRadius: 12, background: `${C.amber}${gone > 0.5 ? '00' : '22'}`, border: `2px ${gone > 0.5 ? 'dashed' : 'solid'} ${gone > 0.5 ? C.border : C.amber}`, opacity: gone > 0.5 ? 0.3 : 1, fontFamily: MONO, fontSize: 16, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {gone > 0.5 ? '' : `page ${i}`}
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', top: 0, bottom: 0, left: lerp(0, 820, sweep), width: 6, background: C.amber, boxShadow: `0 0 24px ${C.amber}`, opacity: sweep > 0 && sweep < 1 ? 1 : 0}} />
          <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 18, fontFamily: MONO, fontSize: 24, color: C.text}}>
            <span style={{color: C.muted}}>log_id sequence</span>
            <span style={{fontSize: 44, fontWeight: 700, color: reset > 0.5 ? C.green : C.amber}}>{seq}</span>
            {reset > 0.5 && <span style={{color: C.green, fontSize: 22, transform: `scale(${reset})`}}>↺ reset to 1</span>}
          </div>
        </div>
      </Win>

      <div dir="ltr" style={{position: 'absolute', left: 1010, top: 790, width: 820, display: 'flex', gap: 18, alignItems: 'center', opacity: ddl > 0 ? 1 : 0}}>
        <div style={{transform: `scale(${clamp(ddl)})`, transformOrigin: 'left center'}}><Chip color={C.amber}>DDL command · data pages wiped at once</Chip></div>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 1010, top: 840, width: 820, borderRadius: 16, border: `2px solid ${C.red}`, background: `${C.red}14`, padding: '12px 22px', fontFamily: MONO, fontSize: 21, color: C.red, opacity: clamp(fkErr), transform: `translateY(${(1 - clamp(fkErr)) * 14}px)`}}>
        ERROR: cannot truncate a table referenced in a foreign key constraint
      </div>

      <Caption text="DELETE FROM customers WHERE customer_id = 10;  (DML Row Delete)" from={t(129.5)} to={t(146)} />
      <Caption text="TRUNCATE TABLE logs;  (DDL Fast Data Page Reset)" from={t(147.5)} to={t(163)} />
    </Stage>
  );
};
