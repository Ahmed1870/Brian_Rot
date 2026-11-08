import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BIG_LAST, BIG_ROWS, bigSale, fmtInt} from '../data';
import {
  CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, clamp, dwell, geo, prog, sec, track, cellCenter,
} from '../kit';

// SC05: Enterprise Formula Auditing on 50,000 rows.
const S = START.s5;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 110, 180, 90, 120, 120][c] ?? XL.colW;

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();

  let cam = CAM0;
  cam = camLerp(cam, {fx: 340, fy: 200, z: 1.35}, prog(f, t(173), 24));
  cam = camLerp(cam, CAM0, prog(f, t(180), 24));
  cam = camLerp(cam, {fx: 600, fy: 580, z: 1.4}, prog(f, t(182), 30));
  cam = camLerp(cam, CAM0, prog(f, t(190), 30));

  const opened = f >= t(171);
  const flash = opened ? 0.7 * (1 - prog(f, t(171), 14)) : 0;
  const scanned = f >= t(178);
  const scanP = scanned ? prog(f, t(178.5), 18) : 0;
  const scannedRows = Math.floor(scanP * BIG_ROWS);
  const jumpBottom = f >= t(185);

  let scroll = {r: 1, c: 1};
  if (jumpBottom) scroll = {r: BIG_LAST - 19, c: 1};

  const sealP = prog(f, t(190), 18);
  const statusLeft = opened ? (scanned ? `${fmtInt(scannedRows)} of 50,000 rows audited` : '50,000 rows loaded') : 'Ready';

  const cell = (r: number, c: number) => {
    if (r === 1) {
      const h = ['OrderID', 'Product', 'Qty', 'Price', 'Total', 'Status'];
      if (c < 1 || c > 6) return undefined;
      return {t: h[c - 1], b: true, bg: scanned ? '#D1FAE5' : '#E2EFDA', al: c >= 3 && c <= 5 ? 'r' : 'l', color: scanned && c === 6 ? '#107C41' : undefined};
    }
    const n = r - 1;
    if (n < 1 || n > BIG_ROWS) return undefined;
    const s = bigSale(n);
    const isScanned = scannedRows >= n;
    switch (c) {
      case 1: return {t: s.id};
      case 2: return {t: s.product};
      case 3: return {t: String(s.qty), al: 'r'};
      case 4: return {t: 'EGP ' + fmtInt(s.price), al: 'r'};
      case 5: return {t: 'EGP ' + fmtInt(s.total), al: 'r'};
      case 6: {
        if (!isScanned) return {t: ''};
        if (s.error) {
          // After scan: errors are highlighted but marked as "Fixed"
          if (scanP > 0.5) return {t: 'Fixed ✓', color: '#107C41'};
          return {t: '#SPILL!', color: '#EF4444', bg: '#FEE2E2'};
        }
        return {t: 'OK', color: '#107C41'};
      }
    }
  };

  // Cursor: Formula Auditing icon → scan trigger
  const fbY = geo(1, 0, 1).fbTop + 14;
  const auditIconX = 880;
  const ribbonY = geo(1, 0, 1).rowsTop - 50;
  const pts = dwell([
    {f: t(173), x: auditIconX, y: ribbonY},
    {f: t(178), x: auditIconX, y: ribbonY},
    {f: t(180), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [173, 178];

  const g = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s5.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file={opened ? 'manzooma_sales_2026' : 'Book1'}
          nameBox="A1" formula="" tab="Formulas"
          cell={cell as any} colW={colW}
          sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          scroll={scroll} thumb={jumpBottom ? 1 : scanP} thumbSize={opened ? 0.02 : 0.55}
          statusLeft={statusLeft}
          sheet="Sales"
        >
          {/* Scan sweep line */}
          {scanned && scanP > 0 && scanP < 1 ? (
            <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 24}}>
              <line x1={g.rowW} y1={g.rowsTop + (g.rowsBottom - g.rowsTop) * scanP} x2={XL.W - XL.vbar} y2={g.rowsTop + (g.rowsBottom - g.rowsTop) * scanP} stroke={C.blue} strokeWidth={3} opacity={0.9} />
            </svg>
          ) : null}
          {/* Audited data border */}
          {scanned ? (
            <Neon x={g.rowW} y={g.rowsTop} w={XL.W - g.rowW - XL.vbar} h={g.rowsBottom - g.rowsTop} color={C.green} p={scanP * 0.3 * (1 - prog(f, t(210), 12))} label="Audited & error-free" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} hide={f > t(181)} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 770, background: '#fff', opacity: flash, pointerEvents: 'none', borderRadius: 14}} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(171), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.green}>manzooma_sales_2026.xlsx</Chip>
      </div>
      <div style={{position: 'absolute', left: 560, top: 82, opacity: prog(f, t(173), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.blue}>Formula Auditing · 50,000 rows · Zero bugs</Chip>
      </div>

      {/* Enterprise seal */}
      <div style={{position: 'absolute', left: 1330, top: 320, width: 330, textAlign: 'center', opacity: sealP, transform: `scale(${0.7 + 0.3 * sealP})`}}>
        <svg width={230} height={230} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -6}}>DIAGNOSTICS VERIFIED</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>Zero structural bugs · &lt;2ms</div>
      </div>

      <TopBadge text="Enterprise Formula Auditing ──► Scan 50,000 Rows for Calculation & Spill Errors" from={t(171.0)} to={t(190.0)} />
      <Caption text="Zero Structural Bugs ──► Full Diagnostics & Safe Exception Handling in <2ms" from={t(190.0)} to={t(209.0)} tone="ok" />
    </Stage>
  );
};
