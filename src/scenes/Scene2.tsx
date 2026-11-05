import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {CUSTOMER_ORDERS} from '../data';

// SC02 (40-85s): LEAD() — Forward Lookahead with Default Fallback
// Anchors (s): 41.0 LEAD | 45.0 forward | 52.0 next order | 60.0 default value | 68.0 NULL | 75.0 churn | 80.0 safe
const S = START.s2;
const t = (g: number) => sec(g - S);

const ROW_H = 52;
const ROW0 = 50;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(41.5), 14));
  const tableP = clamp(lin(f, t(45), 14));
  // LEAD arrow moves down: starts at t(48), reaches last row by t(72)
  const scanProg = clamp(lin(f, t(48), sec(24)));
  const currentRow = Math.floor(scanProg * (CUSTOMER_ORDERS.length - 1));
  const shieldP = pop(f, t(60));
  const sealP = pop(f, t(75));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="الاستشراف المستقبلي | LEAD() & Forward Lookahead" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* Editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={250}
          title="PostgreSQL · LEAD with Default Fallback"
          lines={[
            'SELECT customer_id, order_date,',
            '       LEAD(order_date, 1, \'2099-12-31\')',
            '         OVER(PARTITION BY customer_id',
            '               ORDER BY order_date)',
            '         AS next_order_date',
            'FROM orders;',
          ]}
          start={t(41.5)}
          cps={0.75}
          size={18}
          accent={C.amber}
          hl={f >= t(45) ? 1 : -1}
          hlColor={C.amber}
        />
      </div>

      {/* Default shield explainer */}
      <div style={{position: 'absolute', left: 80, top: 430, width: 860, opacity: clamp(lin(f, t(52), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ default fallback shield</div>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.amber}>LEAD(offset=1)</Chip>
          <Chip color={C.green}>default = '2099-12-31'</Chip>
          <Chip color={C.red}>prevents NULL</Chip>
        </div>
      </div>

      {/* Churn analysis callout */}
      <div style={{position: 'absolute', left: 80, top: 530, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={sealP} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Churn window detected</div>
            <Mix style={{fontSize: 18, color: C.muted}}>قياس الفارق الزمني للطلب القادم</Mix>
          </div>
        </div>
      </div>

      {/* Customer orders table on the right */}
      <Win x={960} y={180} w={880} h={720} title="orders · LEAD next_order_date" accent={C.amber} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 90}}>cust_id</span>
          <span style={{width: 150}}>order_date</span>
          <span style={{width: 120, textAlign: 'right'}}>amount</span>
          <span style={{flex: 1, textAlign: 'right', color: C.amber}}>next_order_date</span>
        </div>
        {CUSTOMER_ORDERS.map((row, i) => {
          const isCurrent = i === currentRow && scanProg < 1;
          const isDone = i < currentRow;
          const isLastInPartition = i === CUSTOMER_ORDERS.length - 1 || CUSTOMER_ORDERS[i + 1].customer_id !== row.customer_id;
          const nextDate = isLastInPartition ? '2099-12-31' : CUSTOMER_ORDERS[i + 1].order_date;
          const showShield = isLastInPartition && (isDone || isCurrent);
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 21, background: isCurrent ? `${C.amber}33` : isDone ? `${C.green}0e` : 'transparent', border: `2px solid ${isCurrent ? C.amber : showShield ? C.green : 'transparent'}`, color: C.text, opacity: isDone || isCurrent ? 1 : 0.4}}>
              <span style={{width: 80, color: C.blue, fontWeight: 700}}>{row.customer_id}</span>
              <span style={{width: 140, color: C.text}}>{row.order_date}</span>
              <span style={{width: 110, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.amount}</span>
              <span style={{flex: 1, textAlign: 'right', fontWeight: 700, color: showShield ? C.green : (isDone || isCurrent) ? C.amber : '#475569'}}>
                {(isDone || isCurrent) ? (
                  <>
                    {nextDate}
                    {showShield ? <span style={{color: C.green, marginLeft: 8, fontSize: 18}}>🛡 default</span> : null}
                  </>
                ) : '—'}
              </span>
            </div>
          );
        })}

        {/* LEAD arrow — forward lookahead from current row to next */}
        {scanProg > 0 && scanProg < 1 && currentRow < CUSTOMER_ORDERS.length - 1 ? (
          <svg width={880} height={720} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
            <line
              x1={350}
              y1={ROW0 + currentRow * ROW_H + ROW_H / 2}
              x2={350}
              y2={ROW0 + (currentRow + 1) * ROW_H + ROW_H / 2}
              stroke={C.amber}
              strokeWidth={3}
              strokeDasharray="6 4"
              opacity={0.9}
            />
            <polygon
              points={`344,${ROW0 + (currentRow + 1) * ROW_H + ROW_H / 2 - 8} 356,${ROW0 + (currentRow + 1) * ROW_H + ROW_H / 2 - 8} 350,${ROW0 + (currentRow + 1) * ROW_H + ROW_H / 2}`}
              fill={C.amber}
            />
            <text x={370} y={ROW0 + (currentRow + 0.5) * ROW_H + ROW_H / 2 + 5} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700}>LEAD offset=1</text>
          </svg>
        ) : null}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.amber, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>LEAD(order_date, 1, '2099-12-31')</span>
          <span>{currentRow}/{CUSTOMER_ORDERS.length - 1} rows processed</span>
        </div>
      </Win>

      <Caption text="LEAD(order_date, 1, '2099-12-31') OVER(ORDER BY order_date)" from={t(42)} to={t(60)} />
      <Caption text="Forward Lookahead ──► Measures Time to Next Order & Churn Windows" from={t(62)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
