import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_REVENUE, RUNNING_TOTALS} from '../data';

// SC01 (0-40s): Window Frame & Implicit Default — RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
// Anchors: 1.0 welcome | 5.0 window frame | 9.0 ORDER BY | 14.0 implicit | 20.0 UNBOUNDED | 28.0 cumulative | 35.0 secret
const S = START.s1;
const t = (g: number) => sec(g - S);

const ROW_H = 50;
const ROW0 = 56;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const tableP = clamp(lin(f, t(4), 14));
  // Frame expands from row 1 down to current row
  const scanProg = clamp(lin(f, t(8), sec(22)));
  const currentRow = Math.floor(scanProg * DAILY_REVENUE.length);
  const sealP = pop(f, t(33));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="تصميم الأطر الزمنية والحدود | Window Framing Boundaries" from={sec(2)} to={sec(18)} />

      {/* SQL editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={200}
          title="Query Editor"
          lines={[
            'SELECT day, amount,',
            '       SUM(amount) OVER(',
            '         ORDER BY day',
            '       ) AS running_total',
            'FROM daily_revenue;',
          ]}
          start={t(2)}
          cps={0.85}
          size={18}
          accent={C.blue}
          hl={f >= t(5) ? 1 : -1}
          hlColor={C.blue}
        />
      </div>

      {/* Concept callout */}
      <div style={{position: 'absolute', left: 80, top: 400, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ implicit frame</div>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.blue}>Window Frame</Chip>
          <Chip color={C.green}>UNBOUNDED PRECEDING</Chip>
          <Chip color={C.amber}>CURRENT ROW</Chip>
        </div>
      </div>

      {/* Performance badge */}
      <div style={{position: 'absolute', left: 80, top: 510, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={sealP} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Cumulative totals ready</div>
            <Mix style={{fontSize: 18, color: C.muted}}>المجاميع التراكمية في إطار ضمني</Mix>
          </div>
        </div>
      </div>

      {/* Daily revenue table on the right with floating frame overlay */}
      <Win x={940} y={180} w={900} h={720} title="daily_revenue · implicit window frame" accent={C.blue} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 60}}>day</span>
          <span style={{width: 150}}>date</span>
          <span style={{width: 120, textAlign: 'right'}}>amount</span>
          <span style={{flex: 1, textAlign: 'right', color: C.blue}}>running_total</span>
        </div>

        {/* Blue floating window frame overlay — expands from row 1 to current */}
        {scanProg > 0 && scanProg < 1 ? (
          <div style={{position: 'absolute', left: 8, right: 8, top: ROW0, height: scanProg * DAILY_REVENUE.length * ROW_H, borderRadius: 10, border: `3px solid ${C.blue}`, background: `${C.blue}0d`, boxShadow: `0 0 24px ${C.blue}55`, pointerEvents: 'none', zIndex: 1}} />
        ) : null}

        {/* "Window Frame" label on the overlay */}
        {scanProg > 0 && scanProg < 1 ? (
          <div dir="ltr" style={{position: 'absolute', left: 20, top: ROW0 + 4, fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, opacity: 0.9, zIndex: 3, background: C.deep, padding: '2px 8px', borderRadius: 6}}>
            Window Frame ►
          </div>
        ) : null}

        {DAILY_REVENUE.map((row, i) => {
          const isInside = i < currentRow;
          const isCurrent = i === currentRow - 1 && scanProg < 1;
          const total = RUNNING_TOTALS[i];
          return (
            <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 22, background: isCurrent ? `${C.blue}22` : 'transparent', color: C.text, opacity: isInside || isCurrent ? 1 : 0.4, zIndex: 2}}>
              <span style={{width: 50, color: C.muted}}>d{row.day}</span>
              <span style={{width: 140, color: C.blue}}>{row.date}</span>
              <span style={{width: 110, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.amount}</span>
              <span style={{flex: 1, textAlign: 'right', color: (isInside || isCurrent) ? C.green : '#475569', fontWeight: 700, fontSize: 24}}>
                {(isInside || isCurrent) ? total.toLocaleString() : '—'}
              </span>
            </div>
          );
        })}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</span>
          <span>{currentRow}/{DAILY_REVENUE.length} rows in frame</span>
        </div>
      </Win>

      <Caption text="Implicit Frame: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW" from={t(22)} to={sec(38)} />
    </Stage>
  );
};
