import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BIG_LAST, BIG_ROWS, bigSale, fmtInt} from '../data';
import {
  CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, clamp, dwell, geo, prog, sec, track, cellCenter,
} from '../kit';

// SC05: Enterprise Unpivoting on 50,000 rows.
const S = START.s5;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 110, 180, 100, 110][c] ?? XL.colW;

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();

  let cam = CAM0;
  cam = camLerp(cam, {fx: 340, fy: 200, z: 1.35}, prog(f, t(173), 24));
  cam = camLerp(cam, CAM0, prog(f, t(180), 24));
  cam = camLerp(cam, {fx: 600, fy: 580, z: 1.4}, prog(f, t(182), 30));
  cam = camLerp(cam, CAM0, prog(f, t(190), 30));

  const opened = f >= t(171);
  const flash = opened ? 0.7 * (1 - prog(f, t(171), 14)) : 0;
  const unpivoted = f >= t(178);
  const unpivotP = unpivoted ? prog(f, t(178.5), 18) : 0;
  const unpivotedRows = Math.floor(unpivotP * BIG_ROWS);
  const jumpBottom = f >= t(185);

  let scroll = {r: 1, c: 1};
  if (jumpBottom) scroll = {r: BIG_LAST - 19, c: 1};

  const sealP = prog(f, t(190), 18);
  const statusLeft = opened ? (unpivoted ? `${fmtInt(unpivotedRows)} of 50,000 rows unpivoted` : '50,000 matrix rows loaded') : 'Ready';

  const cell = (r: number, c: number) => {
    if (r === 1) {
      const h = unpivoted ? ['OrderID', 'Product', 'Month', 'Sales'] : ['OrderID', 'Product', 'Matrix Cols...'];
      if (c < 1 || c > 4) return undefined;
      return {t: h[c - 1], b: true, bg: unpivoted ? '#D1FAE5' : '#FEE2E2', al: c === 4 ? 'r' : 'l', color: unpivoted ? '#107C41' : '#991B1B'};
    }
    const n = r - 1;
    if (n < 1 || n > BIG_ROWS) return undefined;
    const s = bigSale(n);
    const isFilled = unpivotedRows >= n;
    if (unpivoted) {
      switch (c) {
        case 1: return isFilled ? {t: s.id, color: '#107C41'} : {t: ''};
        case 2: return isFilled ? {t: s.product, color: '#107C41'} : {t: ''};
        case 3: return isFilled ? {t: s.month, color: '#107C41'} : {t: ''};
        case 4: return isFilled ? {t: fmtInt(s.sales), al: 'r', color: '#107C41'} : {t: '', al: 'r'};
      }
    } else {
      switch (c) {
        case 1: return {t: s.id};
        case 2: return {t: s.product};
        case 3: return {t: 'Jan|Feb|Mar|...'};
        case 4: return undefined;
      }
    }
  };

  const g = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s5.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file={opened ? 'manzooma_sales_2026' : 'Book1'}
          nameBox="A1" formula="" tab="Data"
          cell={cell as any} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          scroll={scroll} thumb={jumpBottom ? 1 : unpivotP} thumbSize={opened ? 0.02 : 0.55}
          statusLeft={statusLeft}
          sheet="Sales"
        >
          {/* Unpivot sweep */}
          {unpivoted && unpivotP > 0 && unpivotP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 24}}>
              <line x1={g.rowW} y1={g.rowsTop + (g.rowsBottom - g.rowsTop) * unpivotP} x2={g.rowW + colW(1) + colW(2) + colW(3) + colW(4)} y2={g.rowsTop + (g.rowsBottom - g.rowsTop) * unpivotP} stroke={C.green} strokeWidth={3} opacity={0.9} />
            </svg>
          ) : null}
          {/* Flat table border */}
          {unpivoted ? (
            <Neon x={g.rowW} y={g.rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={g.rowsBottom - g.rowsTop} color={C.green} p={prog(f, t(178), 12) * 0.3 * (1 - prog(f, t(210), 12))} label="Normalized flat table" labelBelow />
          ) : null}
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 770, background: '#fff', opacity: flash, pointerEvents: 'none', borderRadius: 14}} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(171), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.green}>manzooma_sales_2026.xlsx</Chip>
      </div>
      <div style={{position: 'absolute', left: 560, top: 82, opacity: prog(f, t(173), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.blue}>Unpivot Other Columns · 50,000 rows · BI-ready</Chip>
      </div>

      {/* Enterprise seal */}
      <div style={{position: 'absolute', left: 1330, top: 320, width: 330, textAlign: 'center', opacity: sealP, transform: `scale(${0.7 + 0.3 * sealP})`}}>
        <svg width={230} height={230} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -6}}>UNPIVOT VERIFIED</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>50,000 rows · &lt;2ms</div>
      </div>

      <TopBadge text="Enterprise Data Normalization ──► Unpivot 50,000 Matrix Rows into Clean Flat Table" from={t(171.0)} to={t(190.0)} />
      <Caption text={`BI-Ready Architecture ──► Seamless Integration with Pivot Tables & Data Models in <2ms`} from={t(190.0)} to={t(209.0)} tone="ok" />
    </Stage>
  );
};
