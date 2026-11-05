import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_REVENUE, RUNNING_TOTALS} from '../data';

// SC02 (40-85s): Implicit Frame — RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
// Anchors (s): 41.0 implicit | 45.0 RANGE | 52.0 UNBOUNDED PRECEDING | 60.0 CURRENT ROW | 68.0 stretches | 75.0 RANGE vs ROWS | 80.0 careful
const S = START.s2;
const t = (g: number) => sec(g - S);

const ROW_H = 42;
const ROW0 = 52;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(41.5), 14));
  const revealP = clamp(lin(f, t(45), 16));
  // Window frame stretches down with the probe
  const scanProg = clamp(lin(f, t(50), sec(28)));
  const currentRow = Math.floor(scanProg * DAILY_REVENUE.length);
  const warnP = clamp(pop(f, t(75)));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="الإطار الافتراضي | Implicit Frame: RANGE vs ROWS" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* Editor on the left — reveals implicit frame */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={240}
          title="PostgreSQL · Implicit Frame Reveal"
          lines={[
            'SUM(amount) OVER(',
            '  ORDER BY order_date',
            '  -- implicit:',
            '  RANGE BETWEEN UNBOUNDED',
            '    PRECEDING AND CURRENT ROW',
            ')',
          ]}
          start={t(41.5)}
          cps={0.85}
          size={20}
          accent={C.purple}
          hl={f >= t(45) ? 3 : -1}
          hlColor={C.purple}
        />
      </div>

      {/* Frame explainer below editor */}
      <div style={{position: 'absolute', left: 80, top: 470, width: 820, opacity: revealP}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ frame boundary</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', border: `2px solid ${C.purple}`, borderRadius: 12, background: `${C.purple}0d`}}>
            <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.purple, width: 220}}>UNBOUNDED PRECEDING</span>
            <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>starts from row 1 (absolute)</span>
          </div>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`}}>
            <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.green, width: 220}}>CURRENT ROW</span>
            <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>up to the current row</span>
          </div>
        </div>
      </div>

      {/* RANGE warning at bottom of left column */}
      <div style={{position: 'absolute', left: 80, top: 690, width: 820, opacity: clamp(warnP)}}>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 16px', border: `2px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`}}>
          <Warn size={40} color={C.amber} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.amber, fontWeight: 700}}>RANGE groups equal dates</div>
            <Mix style={{fontSize: 16, color: C.muted}}>استخدم ROWS لتفادي تجميع التواريخ المتطابقة</Mix>
          </div>
        </div>
      </div>

      {/* Table on the right with purple frame overlay */}
      <Win x={940} y={180} w={900} h={720} title="window scope · expanding RANGE frame" accent={C.purple} opacity={revealP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 60}}>day</span>
          <span style={{width: 160}}>order_date</span>
          <span style={{width: 120, textAlign: 'right'}}>amount</span>
          <span style={{flex: 1, textAlign: 'right', color: C.purple}}>running_total</span>
        </div>

        {/* Purple frame overlay — stretches from row 1 to current row */}
        {scanProg > 0 && scanProg < 1 ? (
          <div style={{position: 'absolute', left: 8, right: 8, top: ROW0, height: scanProg * DAILY_REVENUE.length * ROW_H, borderRadius: 10, border: `3px solid ${C.purple}`, background: `${C.purple}14`, boxShadow: `0 0 24px ${C.purple}66`, pointerEvents: 'none'}} />
        ) : null}

        {DAILY_REVENUE.map((row, i) => {
          const isInside = i < currentRow;
          const isCurrent = i === currentRow - 1 && scanProg < 1;
          const total = RUNNING_TOTALS[i];
          return (
            <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 4, height: ROW_H - 8, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: MONO, fontSize: 22, color: C.text, opacity: isInside || isCurrent ? 1 : 0.4, zIndex: 2}}>
              <span style={{width: 48, color: C.muted}}>#{row.day}</span>
              <span style={{width: 148, color: C.blue}}>{row.date}</span>
              <span style={{width: 110, color: C.text, fontWeight: 700, textAlign: 'right'}}>{row.amount.toLocaleString()}</span>
              <span style={{flex: 1, textAlign: 'right', color: isInside || isCurrent ? C.purple : '#475569', fontWeight: 700, fontSize: 24}}>
                {isInside || isCurrent ? total.toLocaleString() : '—'}
              </span>
            </div>
          );
        })}

        {/* Current row indicator */}
        {scanProg < 1 && scanProg > 0 ? (
          <div style={{position: 'absolute', right: 18, top: ROW0 + scanProg * DAILY_REVENUE.length * ROW_H - 14, fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700, opacity: 0.9}}>
            ◄ CURRENT ROW
          </div>
        ) : null}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.purple, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>window expands ↓ each row</span>
          <span>{currentRow}/{DAILY_REVENUE.length} rows in frame</span>
        </div>
      </Win>

      <Caption text="Implicit Frame: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW" from={t(42)} to={t(60)} />
      <Caption text="Window Scope ──► Accumulates All Previous Rows Up To Current Row" from={t(62)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
