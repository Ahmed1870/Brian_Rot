import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BIG_LAST, BIG_ROWS, CUSTOMERS, fmtInt, sale} from '../data';
import {
  CAM0, Caption, Chip, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, geo, prog, sec,
} from '../kit';

// SC05: Enterprise VLOOKUP merge on manzooma_sales_2026.xlsx (50,000 rows).
// Anchors (s): 171.0 file opens | 173.0 formula entered | 175.0 fill sweeps | 178.0 jump to bottom | 185.0 enterprise seal
const S = START.s5;
const t = (g: number) => sec(g - S);

const salesColW = (c: number) => {
  const w = [0, 100, 120, 200, 110, 100];
  return c < w.length ? w[c] : XL.colW;
};

const custName = (id: string) => {
  const c = CUSTOMERS.find((x) => x.id === id);
  return c ? c.name : '#N/A';
};

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();

  // camera: full → formula area → full → bottom → seal
  let cam = CAM0;
  cam = camLerp(cam, {fx: 360, fy: 200, z: 1.4}, prog(f, t(173), 24));
  cam = camLerp(cam, CAM0, prog(f, t(178), 24));
  cam = camLerp(cam, {fx: 700, fy: 600, z: 1.5}, prog(f, t(180), 30));
  cam = camLerp(cam, CAM0, prog(f, t(188), 30));

  // file open flash
  const opened = f >= t(171);
  const flash = opened ? 0.7 * (1 - prog(f, t(171), 14)) : 0;

  // fill animation
  const fillP = prog(f, t(175), 30); // 1s to fill 50k rows
  const filledRows = Math.floor(fillP * BIG_ROWS);

  // jump to bottom
  const jumpBottom = f >= t(178);

  // scroll
  let scroll = {r: 1, c: 1};
  if (f >= t(175) && f < t(178)) {
    scroll = {r: Math.max(1, Math.min(BIG_LAST - 19, filledRows - 9)), c: 1};
  } else if (jumpBottom) {
    scroll = {r: BIG_LAST - 19, c: 1};
  }

  // enterprise seal
  const sealP = prog(f, t(185), 18);

  // status
  const statusLeft = opened ? `${fmtInt(filledRows)} of 50,000 records merged` : 'Ready';

  const cell = (r: number, c: number) => {
    if (r === 1) {
      const h = ['OrderID', 'CustomerID', 'CustomerName', 'Branch', 'Total'];
      if (c < 1 || c > 5) return undefined;
      return {t: h[c - 1], b: true, bg: '#E2EFDA', al: c === 5 ? 'r' : 'l'};
    }
    const n = r - 1;
    if (n < 1 || n > BIG_ROWS) return undefined;
    const s = sale(n);
    const isFilled = filledRows >= n;
    switch (c) {
      case 1: return {t: s.id};
      case 2: return {t: s.customerId};
      case 3: return isFilled ? {t: custName(s.customerId), color: '#107C41'} : {t: ''};
      case 4: return {t: s.branch};
      case 5: return {t: fmtInt(s.total), al: 'r', num: s.total};
    }
  };

  const g = geo(1, 0, 1);
  const custColX = g.rowW + salesColW(1) + salesColW(2);

  return (
    <Stage dur={SCENES.s5.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file={opened ? 'manzooma_sales_2026' : 'Book1'}
          nameBox="C2" formula="=VLOOKUP([@CustomerID], tbl_Customers, 2, FALSE)" fbEdit={false}
          cell={cell as any} colW={salesColW}
          sel={{r1: 2, c1: 3, r2: 2, c2: 3}} active={{r: 2, c: 3}}
          scroll={scroll} thumb={jumpBottom ? 1 : fillP} thumbSize={opened ? 0.02 : 0.55}
          statusLeft={statusLeft}
          sheet="Sales"
        >
          {/* fill sweep line */}
          {fillP > 0 && fillP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 24}}>
              <line x1={custColX} y1={g.rowsTop} x2={custColX + salesColW(3)} y2={g.rowsTop} stroke={C.green} strokeWidth={3} opacity={0.9}>
                <animate attributeName="y1" values={`${g.rowsTop};${g.rowsBottom}`} dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="y2" values={`${g.rowsTop};${g.rowsBottom}`} dur="0.8s" repeatCount="indefinite" />
              </line>
            </svg>
          ) : null}

          {/* column highlight */}
          <Neon x={custColX} y={g.colTop} w={salesColW(3)} h={g.rowsBottom - g.colTop} color={C.green} p={prog(f, t(173), 12) * 0.4 * (1 - prog(f, t(210), 12))} label="VLOOKUP column" />
        </ExcelApp>
      </ExcelWindow>

      {/* file open flash */}
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 770, background: '#fff', opacity: flash, pointerEvents: 'none', borderRadius: 14}} />

      {/* file chip */}
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(171), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.green}>manzooma_sales_2026.xlsx</Chip>
      </div>

      {/* row count chip */}
      <div style={{position: 'absolute', left: 560, top: 82, opacity: prog(f, t(173), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.blue}>50,000 rows · VLOOKUP merge</Chip>
      </div>

      {/* enterprise seal */}
      <div style={{position: 'absolute', left: 1330, top: 320, width: 330, textAlign: 'center', opacity: sealP, transform: `scale(${0.7 + 0.3 * sealP})`}}>
        <svg width={230} height={230} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -6}}>VLOOKUP VERIFIED</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>50,000 records merged in &lt;5ms</div>
      </div>

      <TopBadge text="Enterprise Data Merging ──► Link 50,000 Sales Records to Customer Master File via VLOOKUP" from={t(171)} to={t(185)} />
      <Caption text="Exact Match Lookup ──► Flawless Automated Data Fetching in <5ms" from={t(185)} to={t(209)} tone="ok" />
    </Stage>
  );
};
