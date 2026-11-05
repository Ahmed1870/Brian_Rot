import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {RANK_RESULTS} from '../data';

// SC02 (40-85s): PERCENT_RANK() vs CUME_DIST()
// Anchors (s): 41.0 relative | 45.0 PERCENT_RANK | 52.0 rank-1/total-1 | 60.0 CUME_DIST | 68.0 cumulative | 75.0 comparison | 80.0 precise
const S = START.s2;
const t = (g: number) => sec(g - S);

const ROW_H = 56;
const ROW0 = 56;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  // Scan progress for both panels
  const scanProg = clamp(lin(f, t(48), sec(30)));
  const currentRow = Math.floor(scanProg * RANK_RESULTS.length);

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="الرتبة النسبية والتوزيع التراكمي | PERCENT_RANK vs CUME_DIST" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* LEFT: PERCENT_RANK */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={130}
          title="PERCENT_RANK() · relative rank scale"
          lines={['PERCENT_RANK() OVER(ORDER BY sales) AS pct_rank']}
          start={t(41.5)}
          cps={0.85}
          size={18}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
        <Win x={80} y={330} w={860} h={570} title="PERCENT_RANK · (rank - 1) / (total_rows - 1)" accent={C.blue} opacity={leftP}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 60}}>day</span>
            <span style={{width: 100, textAlign: 'right'}}>sales</span>
            <span style={{flex: 1, textAlign: 'right', color: C.blue}}>pct_rank (0.00 → 1.00)</span>
          </div>

          {/* Vertical scale bar on the right side of the table */}
          <div style={{position: 'absolute', right: 14, top: ROW0 + 10, bottom: 60, width: 8, borderRadius: 4, background: C.deep, border: `1px solid ${C.border}`}}>
            {scanProg > 0 ? (
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${scanProg * 100}%`, background: `linear-gradient(180deg, ${C.blue}, ${C.blue}44)`, borderRadius: 4, boxShadow: `0 0 12px ${C.blue}`}} />
            ) : null}
            {/* Scale labels */}
            <div dir="ltr" style={{position: 'absolute', right: 14, top: -6, fontFamily: MONO, fontSize: 14, color: C.blue}}>1.00</div>
            <div dir="ltr" style={{position: 'absolute', right: 14, bottom: -6, fontFamily: MONO, fontSize: 14, color: C.muted}}>0.00</div>
          </div>

          {RANK_RESULTS.map((row, i) => {
            const isCurrent = i === currentRow && scanProg < 1;
            const isDone = i < currentRow;
            return (
              <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 80, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 22, background: isCurrent ? `${C.blue}33` : 'transparent', border: `2px solid ${isCurrent ? C.blue : 'transparent'}`, color: C.text, opacity: isDone || isCurrent ? 1 : 0.4}}>
                <span style={{width: 50, color: C.muted}}>d{row.day}</span>
                <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.sales}</span>
                <span style={{flex: 1, textAlign: 'right', color: (isDone || isCurrent) ? C.blue : '#475569', fontWeight: 700, fontSize: 24}}>
                  {(isDone || isCurrent) ? row.percentRank.toFixed(4) : '—'}
                </span>
              </div>
            );
          })}

          {/* Formula footer */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
            (rank - 1) / (total_rows - 1) · first row = 0.0000
          </div>
        </Win>
      </div>

      {/* RIGHT: CUME_DIST */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={130}
          title="CUME_DIST() · cumulative distribution"
          lines={['CUME_DIST() OVER(ORDER BY sales) AS cume_dist']}
          start={t(52.5)}
          cps={0.85}
          size={18}
          accent={C.green}
          hl={0}
          hlColor={C.green}
        />
        <Win x={980} y={330} w={860} h={570} title="CUME_DIST · rows ≤ current / total_rows" accent={C.green} opacity={rightP}>
          <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
            <span style={{width: 60}}>day</span>
            <span style={{width: 100, textAlign: 'right'}}>sales</span>
            <span style={{flex: 1, textAlign: 'right', color: C.green}}>cume_dist (0.00 → 1.00)</span>
          </div>

          {/* Vertical scale bar */}
          <div style={{position: 'absolute', right: 14, top: ROW0 + 10, bottom: 60, width: 8, borderRadius: 4, background: C.deep, border: `1px solid ${C.border}`}}>
            {scanProg > 0 ? (
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${scanProg * 100}%`, background: `linear-gradient(180deg, ${C.green}, ${C.green}44)`, borderRadius: 4, boxShadow: `0 0 12px ${C.green}`}} />
            ) : null}
            <div dir="ltr" style={{position: 'absolute', right: 14, top: -6, fontFamily: MONO, fontSize: 14, color: C.green}}>1.00</div>
            <div dir="ltr" style={{position: 'absolute', right: 14, bottom: -6, fontFamily: MONO, fontSize: 14, color: C.muted}}>0.00</div>
          </div>

          {RANK_RESULTS.map((row, i) => {
            const isCurrent = i === currentRow && scanProg < 1;
            const isDone = i < currentRow;
            return (
              <div key={row.day} dir="ltr" style={{position: 'absolute', left: 12, right: 80, top: ROW0 + i * ROW_H + 3, height: ROW_H - 6, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 22, background: isCurrent ? `${C.green}33` : 'transparent', border: `2px solid ${isCurrent ? C.green : 'transparent'}`, color: C.text, opacity: isDone || isCurrent ? 1 : 0.4}}>
                <span style={{width: 50, color: C.muted}}>d{row.day}</span>
                <span style={{width: 90, color: C.text, fontWeight: 700, textAlign: 'right'}}>${row.sales}</span>
                <span style={{flex: 1, textAlign: 'right', color: (isDone || isCurrent) ? C.green : '#475569', fontWeight: 700, fontSize: 24}}>
                  {(isDone || isCurrent) ? row.cumeDist.toFixed(4) : '—'}
                </span>
              </div>
            );
          })}

          {/* Formula footer */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
            rows ≤ current / total_rows · last row = 1.0000
          </div>
        </Win>
      </div>

      <Caption text="PERCENT_RANK() ──► Relative Rank Scale: (rank - 1) / (total_rows - 1)" from={t(42)} to={t(60)} />
      <Caption text="CUME_DIST() ──► Cumulative Distribution: rows_with_val_less_equal / total_rows" from={t(62)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
