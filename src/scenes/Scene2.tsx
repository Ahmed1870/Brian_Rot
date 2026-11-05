import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DUPLICATE_DATES} from '../data';

// SC02 (40-85s): ROWS vs RANGE — Physical Row Count vs Logical Value Scope with Ties
// Anchors: 41.0 ROWS RANGE | 45.0 physical | 52.0 RANGE | 60.0 ties | 68.0 duplicate | 75.0 difference | 80.0 operational
const S = START.s2;
const t = (g: number) => sec(g - S);

const ROW_H = 56;
const ROW0 = 56;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  // Scan progress — current row moves down
  const scanProg = clamp(lin(f, t(48), sec(28)));
  const currentRowIdx = Math.floor(scanProg * DUPLICATE_DATES.length);

  // For the ROWS demo: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  // For RANGE demo: RANGE includes all peer rows (same date)
  const getCurrentDate = (idx: number) => DUPLICATE_DATES[idx]?.date ?? '';

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="التحديد الفيزيائي مقابل المنطقي | ROWS vs RANGE & Ties" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* LEFT: ROWS — physical row count */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={130}
          title="ROWS ──► Physical Row Count"
          lines={['SUM(amount) OVER(ORDER BY date', '  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)']}
          start={t(41.5)}
          cps={0.8}
          size={18}
          accent={C.blue}
          hl={1}
          hlColor={C.blue}
        />
        <Win x={80} y={330} w={860} h={570} title="ROWS · strict 3-row offset (ignores ties)" accent={C.blue} opacity={leftP}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 60}}>row</span>
            <span style={{width: 150}}>date</span>
            <span style={{width: 100, textAlign: 'right'}}>amount</span>
            <span style={{flex: 1, textAlign: 'right', color: C.blue}}>in_frame?</span>
          </div>

          {DUPLICATE_DATES.map((row, i) => {
            const isCurrent = i === currentRowIdx && scanProg < 1;
            const isInFrame = i >= currentRowIdx - 2 && i <= currentRowIdx && scanProg > 0;
            return (
              <div key={row.row} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 22, background: isInFrame ? `${C.blue}22` : 'transparent', border: `2px solid ${isCurrent ? C.blue : 'transparent'}`, color: C.text, opacity: isInFrame || isCurrent ? 1 : 0.4, zIndex: 2}}>
                <span style={{width: 50, color: C.muted}}>#{row.row}</span>
                <span style={{width: 140, color: C.blue}}>{row.date}</span>
                <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.amount}</span>
                <span style={{flex: 1, textAlign: 'right', color: isInFrame ? C.blue : '#475569', fontWeight: 700}}>
                  {isInFrame ? '✓ in frame' : '—'}
                </span>
              </div>
            );
          })}

          {/* Frame overlay — exactly 3 rows */}
          {scanProg > 0 && scanProg < 1 ? (
            <div style={{position: 'absolute', left: 8, right: 8, top: ROW0 + Math.max(0, currentRowIdx - 2) * ROW_H + 2, height: Math.min(3, currentRowIdx + 1) * ROW_H - 4, borderRadius: 10, border: `3px solid ${C.blue}`, background: `${C.blue}0a`, boxShadow: `0 0 20px ${C.blue}55`, pointerEvents: 'none', zIndex: 1}} />
          ) : null}

          {/* Bottom summary */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <span>3 physical rows always</span>
            <span>ignores duplicate dates</span>
          </div>
        </Win>
      </div>

      {/* RIGHT: RANGE — logical value scope (includes peers) */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={130}
          title="RANGE ──► Logical Value Scope"
          lines={['SUM(amount) OVER(ORDER BY date', '  RANGE BETWEEN 2 PRECEDING AND CURRENT ROW)']}
          start={t(52.5)}
          cps={0.8}
          size={18}
          accent={C.amber}
          hl={1}
          hlColor={C.amber}
        />
        <Win x={980} y={330} w={860} h={570} title="RANGE · expands to include all peer rows (same date)" accent={C.amber} opacity={rightP}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 60}}>row</span>
            <span style={{width: 150}}>date</span>
            <span style={{width: 100, textAlign: 'right'}}>amount</span>
            <span style={{flex: 1, textAlign: 'right', color: C.amber}}>in_frame?</span>
          </div>

          {/* RANGE frame overlay — includes all rows with same date as current */}
          {(() => {
            if (scanProg <= 0 || scanProg >= 1) return null;
            const curDate = getCurrentDate(currentRowIdx);
            const peerStart = DUPLICATE_DATES.findIndex((r) => r.date === curDate);
            const peerEnd = DUPLICATE_DATES.reduce((acc, r, i) => r.date === curDate ? i : acc, -1);
            if (peerStart < 0) return null;
            return (
              <div style={{position: 'absolute', left: 8, right: 8, top: ROW0 + peerStart * ROW_H + 2, height: (peerEnd - peerStart + 1) * ROW_H - 4, borderRadius: 10, border: `3px solid ${C.amber}`, background: `${C.amber}0d`, boxShadow: `0 0 20px ${C.amber}55`, pointerEvents: 'none', zIndex: 1}} />
            );
          })()}

          {DUPLICATE_DATES.map((row, i) => {
            const isCurrent = i === currentRowIdx && scanProg < 1;
            const curDate = getCurrentDate(currentRowIdx);
            const isInFrame = scanProg > 0 && row.date === curDate;
            return (
              <div key={row.row} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 22, background: isInFrame ? `${C.amber}22` : 'transparent', border: `2px solid ${isCurrent ? C.amber : 'transparent'}`, color: C.text, opacity: isInFrame || isCurrent ? 1 : 0.4, zIndex: 2}}>
                <span style={{width: 50, color: C.muted}}>#{row.row}</span>
                <span style={{width: 140, color: C.amber}}>{row.date}</span>
                <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.amount}</span>
                <span style={{flex: 1, textAlign: 'right', color: isInFrame ? C.amber : '#475569', fontWeight: 700}}>
                  {isInFrame ? '✓ peer' : '—'}
                </span>
              </div>
            );
          })}

          {/* Bottom summary */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <span>expands to include all peers</span>
            <span>same date = same frame</span>
          </div>
        </Win>
      </div>

      <Caption text="ROWS ──► Physical Row Count (Strict Row Offsets)" from={t(42)} to={t(60)} />
      <Caption text="RANGE ──► Logical Value Scope (Includes Duplicate Peer Rows)" from={t(62)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
