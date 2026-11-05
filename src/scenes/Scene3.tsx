import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_REVENUE} from '../data';

// SC03 (85-130s): INTERVAL & UNBOUNDED — Advanced Time-Series & Full Scope
// Anchors: 86.0 GROUPS | 90.0 INTERVAL 7 days | 95.0 gaps | 100.0 UNBOUNDED | 110.0 full | 118.0 absolute | 125.0 stable
const S = START.s3;
const t = (g: number) => sec(g - S);

const ROW_H = 46;
const ROW0 = 46;

// Extended data with gaps for INTERVAL demo
const GAPPED_DATES = [
  {day: 1, date: '2024-06-01', amount: 1200},
  {day: 2, date: '2024-06-03', amount: 950},
  {day: 3, date: '2024-06-05', amount: 1450},
  {day: 4, date: '2024-06-09', amount: 800},
  {day: 5, date: '2024-06-12', amount: 1600},
  {day: 6, date: '2024-06-15', amount: 1100},
  {day: 7, date: '2024-06-20', amount: 1850},
  {day: 8, date: '2024-06-25', amount: 1300},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const intervalP = clamp(lin(f, t(90), 16));
  const fullP = clamp(lin(f, t(100), 16));

  // INTERVAL window slides down — purple frame covering 7-day range
  const intervalScan = clamp(lin(f, t(92), sec(18)));
  const currentIntervalRow = Math.floor(intervalScan * GAPPED_DATES.length);

  // Full scope bar — green, covers entire table
  const fullScan = clamp(lin(f, t(102), sec(12)));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="الأطر الزمنية والمجالات الكاملة | INTERVAL & UNBOUNDED Scopes" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* SQL editor at top — full width */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={210}
          title="PostgreSQL 16 · Advanced Window Framing"
          lines={[
            'SELECT order_date, total_amount,',
            "  AVG(total_amount) OVER(ORDER BY order_date",
            "    RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW) AS real_7day_avg,",
            '  MAX(total_amount) OVER(ORDER BY order_date',
            '    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS absolute_max',
            'FROM sales_log;',
          ]}
          start={t(86.5)}
          cps={0.6}
          size={15}
          accent={C.purple}
          hl={f >= t(100) ? 4 : f >= t(90) ? 2 : -1}
          hlColor={f >= t(100) ? C.green : C.purple}
        />
      </div>

      {/* LEFT: INTERVAL window visualization */}
      <Win x={80} y={390} w={880} h={510} title="RANGE BETWEEN INTERVAL '7 days' PRECEDING · jumps gaps" accent={C.purple} opacity={intervalP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          purple frame glides across real dates (7-day window)
        </div>

        {/* Purple interval frame overlay */}
        {intervalScan > 0 && intervalScan < 1 && currentIntervalRow < GAPPED_DATES.length ? (
          <div style={{position: 'absolute', left: 8, right: 8, top: ROW0 + Math.max(0, currentIntervalRow - 2) * ROW_H + 2, height: Math.min(3, currentIntervalRow + 1) * ROW_H - 4, borderRadius: 10, border: `3px solid ${C.purple}`, background: `${C.purple}0d`, boxShadow: `0 0 20px ${C.purple}55`, pointerEvents: 'none', zIndex: 1}} />
        ) : null}

        {GAPPED_DATES.map((row, i) => {
          const isCurrent = i === currentIntervalRow && intervalScan < 1;
          const isInFrame = intervalScan > 0 && i >= currentIntervalRow - 2 && i <= currentIntervalRow;
          // Check for date gaps
          const prevDate = i > 0 ? GAPPED_DATES[i - 1].date : null;
          const hasGap = prevDate !== null && prevDate !== row.date;
          return (
            <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 20, background: isInFrame ? `${C.purple}22` : 'transparent', border: `2px solid ${isCurrent ? C.purple : 'transparent'}`, color: C.text, opacity: isInFrame || isCurrent ? 1 : 0.4, zIndex: 2}}>
              <span style={{width: 50, color: C.muted}}>d{row.day}</span>
              <span style={{width: 140, color: C.purple}}>{row.date}</span>
              {hasGap ? <span style={{width: 50, color: C.amber, fontSize: 14}}>gap</span> : <span style={{width: 50}} />}
              <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.amount}</span>
              <span style={{flex: 1, textAlign: 'right', color: isInFrame ? C.purple : '#475569', fontWeight: 700}}>
                {isInFrame ? '✓ in 7d' : '—'}
              </span>
            </div>
          );
        })}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.purple, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>INTERVAL '7 days' PRECEDING</span>
          <span>jumps date gaps ✓</span>
        </div>
      </Win>

      {/* RIGHT: UNBOUNDED full scope */}
      <Win x={980} y={390} w={860} h={510} title="ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING" accent={C.green} opacity={fullP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          green bar covers entire table (absolute max)
        </div>

        {/* Green full-scope overlay — covers entire table progressively */}
        {fullScan > 0 ? (
          <div style={{position: 'absolute', left: 8, right: 8, top: ROW0, height: fullScan * GAPPED_DATES.length * ROW_H, borderRadius: 10, border: `3px solid ${C.green}`, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}55`, pointerEvents: 'none', zIndex: 1}} />
        ) : null}

        {GAPPED_DATES.map((row, i) => {
          const isInScope = fullScan > i / GAPPED_DATES.length;
          return (
            <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 20, background: isInScope ? `${C.green}14` : 'transparent', color: C.text, opacity: isInScope ? 1 : 0.4, zIndex: 2}}>
              <span style={{width: 50, color: C.muted}}>d{row.day}</span>
              <span style={{width: 140, color: C.green}}>{row.date}</span>
              <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.amount}</span>
              <span style={{flex: 1, textAlign: 'right', color: isInScope ? C.green : '#475569', fontWeight: 700}}>
                {isInScope ? '✓ in scope' : '—'}
              </span>
            </div>
          );
        })}

        {/* Absolute max badge */}
        {fullScan >= 1 ? (
          <div style={{position: 'absolute', right: 30, bottom: 60, display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(pop(f, t(118))), transform: `scale(${0.85 + 0.15 * clamp(pop(f, t(118)))})`}}>
            <Check p={pop(f, t(118))} size={40} color={C.green} />
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>MAX = $1,850 ✓</div>
          </div>
        ) : null}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>UNBOUNDED PRECEDING → UNBOUNDED FOLLOWING</span>
          <span>full table scope</span>
        </div>
      </Win>

      <Caption text="RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW" from={t(90)} to={t(108)} />
      <Caption text="Full Window Scope ──► ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
