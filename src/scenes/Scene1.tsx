import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_REVENUE, RUNNING_TOTALS} from '../data';

// SC01 (0-40s): Running Totals — Dynamic Sequential Accumulation
// Anchors (s): 1.0 welcome | 5.0 ORDER BY | 9.0 transformation | 14.0 running total | 20.0 step by step | 28.0 growth curve | 35.0 financial path
const S = START.s1;
const t = (g: number) => sec(g - S);

const ROW_H = 42;
const ROW0 = 56;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const tableP = clamp(lin(f, t(4), 14));
  // Accumulator probe slides down: starts at t(8), reaches row 12 by t(30)
  const scanProg = clamp(lin(f, t(8), sec(22)));
  const currentRow = Math.floor(scanProg * DAILY_REVENUE.length);
  const sealP = pop(f, t(33));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="التجميع التراكمي والمحاسبي | Running Totals & Cumulative Windows" from={sec(2)} to={sec(18)} />

      {/* SQL editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={220}
          title="Query Editor"
          lines={[
            'SELECT order_date, amount,',
            '       SUM(amount) OVER(',
            '         ORDER BY order_date',
            '       ) AS running_total',
            'FROM daily_revenue;',
          ]}
          start={t(2)}
          cps={0.9}
          size={20}
          accent={C.green}
          hl={f >= t(5) ? 1 : -1}
          hlColor={C.green}
        />
      </div>

      {/* Concept callout below editor */}
      <div style={{position: 'absolute', left: 80, top: 410, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 8}}>◆ transformation</div>
        <div style={{display: 'flex', gap: 14, flexWrap: 'wrap'}}>
          <Chip color={C.blue}>static → dynamic</Chip>
          <Chip color={C.green}>+ ORDER BY</Chip>
          <Chip color={C.amber}>cumulative sum</Chip>
        </div>
      </div>

      {/* Performance badge */}
      <div style={{position: 'absolute', left: 80, top: 510, opacity: clamp(pop(f, t(28)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={pop(f, t(28))} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Single-pass growth curve</div>
            <Mix style={{fontSize: 18, color: C.muted}}>منحنى النمو المالي خطوة بخطوة</Mix>
          </div>
        </div>
      </div>

      {/* Daily revenue table on the right */}
      <Win x={940} y={180} w={900} h={720} title="daily_revenue · running_total" accent={C.green} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 60}}>day</span>
          <span style={{width: 160}}>order_date</span>
          <span style={{width: 120, textAlign: 'right'}}>amount</span>
          <span style={{flex: 1, textAlign: 'right', color: C.green}}>running_total</span>
        </div>
        {DAILY_REVENUE.map((row, i) => {
          const isCurrent = i === currentRow - 1 && scanProg < 1;
          const isDone = i < currentRow;
          const total = RUNNING_TOTALS[i];
          return (
            <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 4, height: ROW_H - 8, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: MONO, fontSize: 22, background: isCurrent ? `${C.green}33` : isDone ? `${C.green}11` : 'transparent', border: `2px solid ${isCurrent ? C.green : 'transparent'}`, color: C.text, opacity: isDone || isCurrent ? 1 : 0.5}}>
              <span style={{width: 48, color: C.muted}}>#{row.day}</span>
              <span style={{width: 148, color: C.blue}}>{row.date}</span>
              <span style={{width: 110, color: C.text, fontWeight: 700, textAlign: 'right'}}>{row.amount.toLocaleString()}</span>
              <span style={{flex: 1, textAlign: 'right', color: C.green, fontWeight: 700, fontSize: 24}}>
                {isDone || isCurrent ? (
                  <>
                    {total.toLocaleString()}
                    {isCurrent ? <span style={{color: C.amber, marginLeft: 8}}>◄ accumulating</span> : null}
                  </>
                ) : (
                  <span style={{color: '#475569'}}>—</span>
                )}
              </span>
            </div>
          );
        })}

        {/* Accumulator probe — neon blue line that slides down */}
        {scanProg < 1 && scanProg > 0 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: ROW0 + scanProg * DAILY_REVENUE.length * ROW_H, height: 3, background: C.blue, boxShadow: `0 0 22px ${C.blue}`}} />
        ) : null}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>final running_total</span>
          <span>{RUNNING_TOTALS[RUNNING_TOTALS.length - 1].toLocaleString()}</span>
        </div>
      </Win>

      <Caption text="SUM(amount) OVER(ORDER BY order_date) ──► Builds Dynamic Cumulative Totals" from={t(22)} to={sec(38)} />
    </Stage>
  );
};
