import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_AMOUNTS} from '../data';

// SC03 (85-130s): FIRST_VALUE & LAST_VALUE — Frame Trap & Explicit Fix
// Anchors (s): 86.0 FIRST_VALUE | 90.0 LAST_VALUE | 95.0 trap | 100.0 CURRENT ROW | 110.0 explicit frame | 118.0 full | 125.0 correct
const S = START.s3;
const t = (g: number) => sec(g - S);

const ROW_H = 50;
const ROW0 = 50;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(86.5), 14));
  const trapP = clamp(lin(f, t(90), 14));
  const fixP = clamp(lin(f, t(110), 16));
  const sealP = pop(f, t(120));

  // Scan progress for both panels
  const trapScan = clamp(lin(f, t(92), sec(16)));
  const fixScan = clamp(lin(f, t(112), sec(16)));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="حدود النافذة | FIRST_VALUE & LAST_VALUE Frame Trap" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: The Trap — LAST_VALUE with default frame */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={150}
          title="THE TRAP · Default Frame"
          lines={['LAST_VALUE(amount) OVER(ORDER BY date)']}
          start={t(86.5)}
          cps={0.9}
          size={18}
          accent={C.red}
          hl={0}
          hlColor={C.red}
        />
        <Win x={80} y={340} w={860} h={560} title="last_value · WRONG (trapped at CURRENT ROW)" accent={C.red} opacity={trapP}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 60}}>day</span>
            <span style={{width: 140}}>date</span>
            <span style={{width: 100, textAlign: 'right'}}>amount</span>
            <span style={{flex: 1, textAlign: 'right', color: C.red}}>last_value (WRONG)</span>
          </div>

          {/* Red frame overlay — stops at current row */}
          {trapScan > 0 && trapScan < 1 ? (
            <div style={{position: 'absolute', left: 8, right: 8, top: ROW0, height: trapScan * DAILY_AMOUNTS.length * ROW_H, borderRadius: 10, border: `3px solid ${C.red}`, background: `${C.red}10`, boxShadow: `0 0 20px ${C.red}55`, pointerEvents: 'none'}} />
          ) : null}

          {DAILY_AMOUNTS.map((row, i) => {
            const currentRow = Math.floor(trapScan * DAILY_AMOUNTS.length);
            const isCurrent = i === currentRow - 1 && trapScan < 1;
            const isDone = i < currentRow;
            const wrongLastValue = row.amount; // LAST_VALUE with default frame returns current row's value
            return (
              <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 20, background: isCurrent ? `${C.red}33` : 'transparent', border: `2px solid ${isCurrent ? C.red : 'transparent'}`, color: C.text, opacity: isDone || isCurrent ? 1 : 0.4, zIndex: 2}}>
                <span style={{width: 50, color: C.muted}}>#{row.day}</span>
                <span style={{width: 150, color: C.blue}}>{row.date}</span>
                <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>{row.amount}</span>
                <span style={{flex: 1, textAlign: 'right', color: (isDone || isCurrent) ? C.red : '#475569', fontWeight: 700}}>
                  {(isDone || isCurrent) ? wrongLastValue : '—'}
                </span>
              </div>
            );
          })}

          {/* Warning footer */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 50, display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <Warn size={36} color={C.red} />
            <span>frame stops at CURRENT ROW → wrong value!</span>
          </div>
        </Win>
      </div>

      {/* RIGHT: The Fix — Explicit ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING */}
      <div style={{opacity: fixP, transform: `translateX(${(1 - fixP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={150}
          title="THE FIX · Explicit Full Frame"
          lines={['LAST_VALUE(amount) OVER(ORDER BY date', '  ROWS BETWEEN UNBOUNDED PRECEDING', '    AND UNBOUNDED FOLLOWING)']}
          start={t(110.5)}
          cps={0.7}
          size={16}
          accent={C.green}
          hl={1}
          hlColor={C.green}
        />
        <Win x={980} y={340} w={860} h={560} title="last_value · CORRECT (full frame)" accent={C.green} opacity={fixP}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 60}}>day</span>
            <span style={{width: 140}}>date</span>
            <span style={{width: 100, textAlign: 'right'}}>amount</span>
            <span style={{flex: 1, textAlign: 'right', color: C.green}}>last_value (CORRECT)</span>
          </div>

          {/* Purple full-frame overlay — covers entire table */}
          {fixScan > 0 ? (
            <div style={{position: 'absolute', left: 8, right: 8, top: ROW0, bottom: 60, borderRadius: 10, border: `3px solid ${C.purple}`, background: `${C.purple}10`, boxShadow: `0 0 24px ${C.purple}55`, pointerEvents: 'none'}} />
          ) : null}

          {DAILY_AMOUNTS.map((row, i) => {
            const currentRow = Math.floor(fixScan * DAILY_AMOUNTS.length);
            const isCurrent = i === currentRow - 1 && fixScan < 1;
            const isDone = i < currentRow;
            const correctLastValue = DAILY_AMOUNTS[DAILY_AMOUNTS.length - 1].amount; // 1850
            return (
              <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 20, background: isCurrent ? `${C.green}22` : 'transparent', border: `2px solid ${isCurrent ? C.green : 'transparent'}`, color: C.text, opacity: isDone || isCurrent ? 1 : 0.4, zIndex: 2}}>
                <span style={{width: 50, color: C.muted}}>#{row.day}</span>
                <span style={{width: 150, color: C.blue}}>{row.date}</span>
                <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>{row.amount}</span>
                <span style={{flex: 1, textAlign: 'right', color: (isDone || isCurrent) ? C.green : '#475569', fontWeight: 700}}>
                  {(isDone || isCurrent) ? correctLastValue : '—'}
                </span>
              </div>
            );
          })}

          {/* Success footer */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 50, display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep, opacity: clamp(sealP)}}>
            <Check p={sealP} size={36} color={C.green} />
            <span>full frame → correct last value: {DAILY_AMOUNTS[DAILY_AMOUNTS.length - 1].amount} ✓</span>
          </div>
        </Win>
      </div>

      <Caption text="LAST_VALUE() Danger Trap ──► Default Frame Stops at CURRENT ROW" from={t(90)} to={t(108)} tone="danger" />
      <Caption text="Explicit Frame: ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING" from={t(112)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
