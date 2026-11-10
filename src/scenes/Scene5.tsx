import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BIG_LAST, BIG_ROWS, bigSale, fmtInt} from '../data';
import {CAM0, Caption, Chip, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec} from '../kit';

const S = START.s5;
const t = (g: number) => sec(g - S);
const colW = (c: number) => [0, 90, 180, 100, 110, 120][c] ?? XL.colW;

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  let cam = CAM0;
  cam = camLerp(cam, {fx: 340, fy: 200, z: 1.35}, prog(f, t(173), 24));
  cam = camLerp(cam, CAM0, prog(f, t(180), 24));
  cam = camLerp(cam, {fx: 600, fy: 580, z: 1.4}, prog(f, t(182), 30));
  cam = camLerp(cam, CAM0, prog(f, t(190), 30));

  const opened = f >= t(171);
  const flash = opened ? 0.7 * (1 - prog(f, t(171), 14)) : 0;
  const processed = f >= t(178);
  const processP = processed ? prog(f, t(178.5), 18) : 0;
  const processedRows = Math.floor(processP * BIG_ROWS);
  const jumpBottom = f >= t(185);
  let scroll = {r: 1, c: 1};
  if (jumpBottom) scroll = {r: BIG_LAST - 19, c: 1};
  const sealP = prog(f, t(190), 18);
  const statusLeft = opened ? (processed ? `${fmtInt(processedRows)} of 50,000 rows accumulated` : '50,000 rows loaded') : 'Ready';

  const cell = (r: number, c: number) => {
    if (r === 1) {
      const h = ['OrderID', 'Product', 'Branch', 'Amount', 'Running Balance'];
      if (c < 1 || c > 5) return undefined;
      return {t: h[c - 1], b: true, bg: processed ? '#D1FAE5' : '#E2EFDA', al: c >= 4 ? 'r' : 'l', color: processed ? '#107C41' : undefined};
    }
    const n = r - 1;
    if (n < 1 || n > BIG_ROWS) return undefined;
    const s = bigSale(n);
    const isFilled = processedRows >= n;
    if (processed) {
      switch (c) {
        case 1: return isFilled ? {t: s.id, color: '#107C41'} : {t: ''};
        case 2: return isFilled ? {t: s.product, color: '#107C41'} : {t: ''};
        case 3: return isFilled ? {t: s.branch, color: '#107C41'} : {t: ''};
        case 4: return isFilled ? {t: fmtInt(s.amount), al: 'r', color: '#107C41'} : {t: '', al: 'r'};
        case 5: return isFilled ? {t: fmtInt(s.amount * n), al: 'r', color: '#107C41', b: true} : {t: '', al: 'r'};
      }
    } else {
      switch (c) {
        case 1: return {t: s.id};
        case 2: return {t: s.product};
        case 3: return {t: s.branch};
        case 4: return {t: fmtInt(s.amount), al: 'r'};
      }
    }
  };

  const g = geo(1, 0, 1);
  return (
    <Stage dur={SCENES.s5.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp file={opened ? 'manzooma_sales_2026' : 'Book1'} nameBox="A1" formula="" tab="Data"
          cell={cell as any} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          scroll={scroll} thumb={jumpBottom ? 1 : processP} thumbSize={opened ? 0.02 : 0.55}
          statusLeft={statusLeft} sheet="Sales"
        >
          {processed && processP > 0 && processP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 24}}>
              <line x1={g.rowW} y1={g.rowsTop + (g.rowsBottom - g.rowsTop) * processP} x2={g.rowW + colW(1) + colW(2) + colW(3) + colW(4) + colW(5)} y2={g.rowsTop + (g.rowsBottom - g.rowsTop) * processP} stroke={C.green} strokeWidth={3} opacity={0.9} />
            </svg>
          ) : null}
          {processed ? <Neon x={g.rowW} y={g.rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4) + colW(5)} h={g.rowsBottom - g.rowsTop} color={C.green} p={prog(f, t(178), 12) * 0.3 * (1 - prog(f, t(210), 12))} label="SCAN running balance enterprise data" labelBelow /> : null}
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 770, background: '#fff', opacity: flash, pointerEvents: 'none', borderRadius: 14}} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(171), 12) * (1 - prog(f, t(210), 12))}}><Chip color={C.green}>manzooma_sales_2026.xlsx</Chip></div>
      <div style={{position: 'absolute', left: 560, top: 82, opacity: prog(f, t(173), 12) * (1 - prog(f, t(210), 12))}}><Chip color={C.blue}>SCAN + REDUCE · 50,000 rows · Accumulation</Chip></div>
      <div style={{position: 'absolute', left: 1330, top: 320, width: 330, textAlign: 'center', opacity: sealP, transform: `scale(${0.7 + 0.3 * sealP})`}}>
        <svg width={230} height={230} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -6}}>ACCUMULATION VERIFIED</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>{`50,000 rows · <2ms`}</div>
      </div>
      <TopBadge text="Enterprise Array Accumulation ──► Calculate 50,000 Running Balances Instantly" from={t(171.0)} to={t(190.0)} />
      <Caption text="Sub-Millisecond Accumulation ──► High-Speed SCAN & REDUCE Execution in <2ms" from={t(190.0)} to={t(209.0)} tone="ok" />
    </Stage>
  );
};
