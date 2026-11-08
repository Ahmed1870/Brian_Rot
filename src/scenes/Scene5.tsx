import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BIG_LAST, BIG_ROWS, fmtInt, sale} from '../data';
import {CAM0, Caption, Chip, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec} from '../kit';
import {LiquidSpill, SpillBorder} from '../fx';

// SC05: Enterprise Dynamic Array deployment on manzooma_sales_2026.xlsx (50,000 rows).
const S = START.s5;
const t = (g: number) => sec(g - S);

const salesColW = (c: number) => {
  const w = [0, 110, 200, 110, 140, 120];
  return c < w.length ? w[c] : XL.colW;
};

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();

  let cam = CAM0;
  cam = camLerp(cam, {fx: 360, fy: 200, z: 1.35}, prog(f, t(173), 24));
  cam = camLerp(cam, CAM0, prog(f, t(180), 24));
  cam = camLerp(cam, {fx: 700, fy: 600, z: 1.4}, prog(f, t(182), 30));
  cam = camLerp(cam, CAM0, prog(f, t(190), 30));

  const opened = f >= t(171);
  const flash = opened ? 0.7 * (1 - prog(f, t(171), 14)) : 0;
  const fillP = prog(f, t(175), 22);
  const filledRows = Math.floor(fillP * BIG_ROWS);
  const jumpBottom = f >= t(180);

  let scroll = {r: 1, c: 1};
  if (f >= t(175) && f < t(180)) {
    scroll = {r: Math.max(1, Math.min(BIG_LAST - 19, filledRows - 9)), c: 1};
  } else if (jumpBottom) {
    scroll = {r: BIG_LAST - 19, c: 1};
  }

  const sealP = prog(f, t(190), 18);
  const statusLeft = opened ? `${fmtInt(filledRows)} of 50,000 rows spilled` : 'Ready';

  const cell = (r: number, c: number) => {
    if (r === 1) {
      const h = ['OrderID', 'Product', 'Qty', 'Price', 'Total'];
      if (c < 1 || c > 5) return undefined;
      return {t: h[c - 1], b: true, bg: '#E2EFDA', al: c >= 3 && c <= 5 ? 'r' : 'l'};
    }
    const n = r - 1;
    if (n < 1 || n > BIG_ROWS) return undefined;
    const s = sale(n);
    const isFilled = filledRows >= n;
    switch (c) {
      case 1: return {t: s.id};
      case 2: return {t: s.product};
      case 3: return {t: String(s.qty), al: 'r'};
      case 4: return {t: 'EGP ' + fmtInt(s.price), al: 'r'};
      case 5: return isFilled ? {t: 'EGP ' + fmtInt(s.total), al: 'r', color: '#107C41'} : {t: '', al: 'r'};
    }
  };

  const g = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s5.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file={opened ? 'manzooma_sales_2026' : 'Book1'}
          nameBox="E2" formula='=[@Qty]*[@Price]   (spills to 50,000 rows)'
          cell={cell as any} colW={salesColW}
          sel={{r1: 2, c1: 5, r2: 2, c2: 5}} active={{r: 2, c: 5}}
          scroll={scroll} thumb={jumpBottom ? 1 : fillP} thumbSize={opened ? 0.02 : 0.55}
          statusLeft={statusLeft}
          sheet="Sales"
        >
          {/* Liquid spill flow on column E */}
          {fillP > 0 && fillP < 1 ? (
            <LiquidSpill x={g.rowW + salesColW(1) + salesColW(2) + salesColW(3) + salesColW(4)} topY={g.rowsTop} bottomY={g.rowsBottom} w={salesColW(5)} p={fillP} color={C.blue} />
          ) : null}
          {/* Spill border on column E */}
          <SpillBorder x={g.rowW + salesColW(1) + salesColW(2) + salesColW(3) + salesColW(4)} y={g.rowsTop} w={salesColW(5)} h={g.rowsBottom - g.rowsTop} p={prog(f, t(173), 12) * 0.6 * (1 - prog(f, t(210), 12))} color={C.blue} label="50,000-row Spill" />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 770, background: '#fff', opacity: flash, pointerEvents: 'none', borderRadius: 14}} />

      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(171), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.green}>manzooma_sales_2026.xlsx</Chip>
      </div>
      <div style={{position: 'absolute', left: 560, top: 82, opacity: prog(f, t(173), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.blue}>Dynamic Array · 50,000 rows · Zero Drag-Fill</Chip>
      </div>

      {/* Enterprise seal */}
      <div style={{position: 'absolute', left: 1330, top: 320, width: 330, textAlign: 'center', opacity: sealP, transform: `scale(${0.7 + 0.3 * sealP})`}}>
        <svg width={230} height={230} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -6}}>DYNAMIC ARRAY VERIFIED</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>Zero Drag-Fill · &lt;2ms</div>
      </div>

      <TopBadge text="Enterprise Array Deployment ──► Process 50,000 Sales Rows via Single Dynamic Array Formula" from={t(171.0)} to={t(190.0)} />
      <Caption text="Zero Drag-Fill ──► Instant Multi-Row Calculation Spilling in <2ms" from={t(190.0)} to={t(209.0)} tone="ok" />
    </Stage>
  );
};
