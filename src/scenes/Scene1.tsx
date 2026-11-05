import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {MONTHLY_SALES, MOM_GROWTH} from '../data';

// SC01 (0-40s): LAG() — Backward Shift Vector
// Anchors (s): 1.0 welcome | 5.0 LAG | 9.0 backward | 14.0 offset | 20.0 MoM | 28.0 growth | 35.0 self-join
const S = START.s1;
const t = (g: number) => sec(g - S);

const ROW_H = 58;
const ROW0 = 56;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const tableP = clamp(lin(f, t(4), 14));
  // LAG arrow moves down row by row: starts at t(8), reaches last row by t(28)
  const scanProg = clamp(lin(f, t(8), sec(20)));
  const currentRow = Math.floor(scanProg * (MONTHLY_SALES.length - 1));
  const sealP = pop(f, t(33));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="دوال الإزاحة والقياس الزمني | Offset & Navigation Window Functions" from={sec(2)} to={sec(18)} />

      {/* SQL editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={240}
          title="Query Editor"
          lines={[
            'SELECT month, sales,',
            '       LAG(sales, 1, 0) OVER(',
            '         ORDER BY month',
            '       ) AS prev_sales',
            'FROM monthly_sales;',
          ]}
          start={t(2)}
          cps={0.85}
          size={20}
          accent={C.blue}
          hl={f >= t(5) ? 1 : -1}
          hlColor={C.blue}
        />
      </div>

      {/* Concept callout */}
      <div style={{position: 'absolute', left: 80, top: 410, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 10}}>◆ backward shift</div>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.blue}>LAG(sales, 1, 0)</Chip>
          <Chip color={C.green}>offset = 1</Chip>
          <Chip color={C.amber}>no SELF JOIN needed</Chip>
        </div>
      </div>

      {/* Performance badge */}
      <div style={{position: 'absolute', left: 80, top: 530, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `2px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`}}>
          <Check p={sealP} size={44} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>MoM Growth % ready</div>
            <Mix style={{fontSize: 18, color: C.muted}}>نسبة النمو الشهري في استعلام واحد</Mix>
          </div>
        </div>
      </div>

      {/* Monthly sales table on the right */}
      <Win x={940} y={180} w={900} h={720} title="monthly_sales · LAG demo" accent={C.blue} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: ROW0, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 120}}>month</span>
          <span style={{width: 130, textAlign: 'right'}}>sales</span>
          <span style={{width: 140, textAlign: 'right', color: C.blue}}>prev_sales</span>
          <span style={{flex: 1, textAlign: 'right', color: C.green}}>mom_growth_pct</span>
        </div>
        {MONTHLY_SALES.map((row, i) => {
          const isCurrent = i === currentRow + 1 && scanProg < 1 && i > 0;
          const isDone = i <= currentRow + 1 && i > 0;
          const prevSales = i === 0 ? null : MONTHLY_SALES[i - 1].sales;
          const growth = MOM_GROWTH[i];
          return (
            <div key={row.month} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: ROW0 + i * ROW_H + 4, height: ROW_H - 8, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 22, background: isCurrent ? `${C.blue}33` : isDone ? `${C.green}0e` : 'transparent', border: `2px solid ${isCurrent ? C.blue : 'transparent'}`, color: C.text, opacity: isDone || isCurrent || i === 0 ? 1 : 0.4}}>
              <span style={{width: 110, color: C.blue}}>{row.month}</span>
              <span style={{width: 120, color: C.text, fontWeight: 700, textAlign: 'right'}}>{row.sales.toLocaleString()}</span>
              <span style={{width: 130, textAlign: 'right', color: prevSales !== null && (isDone || isCurrent) ? C.blue : '#475569', fontWeight: 700}}>
                {prevSales !== null && (isDone || isCurrent) ? prevSales.toLocaleString() : i === 0 ? '0 (default)' : '—'}
              </span>
              <span style={{flex: 1, textAlign: 'right', fontWeight: 700, fontSize: 22, color: growth !== null && (isDone || isCurrent) ? (growth >= 0 ? C.green : C.red) : '#475569'}}>
                {growth !== null && (isDone || isCurrent) ? `${growth >= 0 ? '+' : ''}${growth}%` : i === 0 ? '— (first)' : '—'}
              </span>
            </div>
          );
        })}

        {/* LAG arrow indicator — shows backward shift from prev row to current */}
        {scanProg > 0 && scanProg < 1 && currentRow + 1 < MONTHLY_SALES.length ? (
          <svg width={900} height={720} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
            {/* Arrow from prev row (up) to current row (down) */}
            <line
              x1={300}
              y1={ROW0 + currentRow * ROW_H + ROW_H / 2}
              x2={300}
              y2={ROW0 + (currentRow + 1) * ROW_H + ROW_H / 2}
              stroke={C.blue}
              strokeWidth={3}
              strokeDasharray="6 4"
              opacity={0.9}
            />
            {/* Arrowhead pointing down */}
            <polygon
              points={`294,${ROW0 + (currentRow + 1) * ROW_H + ROW_H / 2 - 8} 306,${ROW0 + (currentRow + 1) * ROW_H + ROW_H / 2 - 8} 300,${ROW0 + (currentRow + 1) * ROW_H + ROW_H / 2}`}
              fill={C.blue}
            />
            <text x={320} y={ROW0 + (currentRow + 0.5) * ROW_H + ROW_H / 2 + 5} fill={C.blue} fontSize={16} fontFamily={MONO} fontWeight={700}>LAG offset=1</text>
          </svg>
        ) : null}

        {/* Bottom summary */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>LAG(sales, 1, 0)</span>
          <span>{currentRow + 1}/{MONTHLY_SALES.length - 1} rows computed</span>
        </div>
      </Win>

      <Caption text="LAG(sales, 1, 0) OVER(ORDER BY month) ──► Fetches Previous Row Value" from={t(22)} to={sec(38)} />
    </Stage>
  );
};
