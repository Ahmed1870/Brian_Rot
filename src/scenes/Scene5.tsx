import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {BIG_LAST, BIG_ROWS, bigSale, fmtInt} from '../data';
import {
  CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, clamp, dwell, geo, prog, sec, track, typed, cellCenter,
} from '../kit';

// SC05: Enterprise LET + SEQUENCE optimization on 50,000 rows.
const S = START.s5;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 110, 160, 100, 110, 100][c] ?? XL.colW;
const FORMULA = '=LET(Sales, E2:E50001, Tier, IF(Sales>5000, 5%, IF(Sales>1000, 3%, 1%)), Sales*Tier)';

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();

  let cam = CAM0;
  cam = camLerp(cam, {fx: 340, fy: 200, z: 1.35}, prog(f, t(173), 24));
  cam = camLerp(cam, CAM0, prog(f, t(180), 24));
  cam = camLerp(cam, {fx: 600, fy: 580, z: 1.4}, prog(f, t(182), 30));
  cam = camLerp(cam, CAM0, prog(f, t(190), 30));

  const opened = f >= t(171);
  const flash = opened ? 0.7 * (1 - prog(f, t(171), 14)) : 0;

  const typedFormula = typed(FORMULA, f, t(173), 0.9);
  const typingDone = f >= t(184);
  const fillP = typingDone ? prog(f, t(184.5), 20) : 0;
  const filledRows = Math.floor(fillP * BIG_ROWS);
  const jumpBottom = f >= t(188);

  let scroll = {r: 1, c: 1};
  if (jumpBottom) scroll = {r: BIG_LAST - 19, c: 1};

  const sealP = prog(f, t(190), 18);
  const statusLeft = opened ? `${fmtInt(filledRows)} of 50,000 rows computed` : 'Ready';

  const cell = (r: number, c: number) => {
    if (r === 1) {
      const h = ['OrderID', 'Product', 'Qty', 'Total', 'Commission'];
      if (c < 1 || c > 5) return undefined;
      return {t: h[c - 1], b: true, bg: '#E2EFDA', al: c >= 3 && c <= 5 ? 'r' : 'l'};
    }
    const n = r - 1;
    if (n < 1 || n > BIG_ROWS) return undefined;
    const s = bigSale(n);
    const isFilled = filledRows >= n;
    switch (c) {
      case 1: return {t: s.id};
      case 2: return {t: s.product};
      case 3: return {t: String(s.qty), al: 'r'};
      case 4: return {t: 'EGP ' + fmtInt(s.total), al: 'r'};
      case 5: return isFilled ? {t: 'EGP ' + fmtInt(Math.round(s.commission)), al: 'r', color: '#107C41'} : {t: '', al: 'r'};
    }
  };

  // Cursor: formula bar → Enter
  const fbY = geo(1, 0, 1).fbTop + 14;
  const f2 = cellCenter(2, 5, {colW});
  const pts = dwell([
    {f: t(173), x: 200, y: fbY},
    {f: t(184), x: f2.x, y: f2.y},
    {f: t(186), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [184];

  const g = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s5.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file={opened ? 'manzooma_sales_2026' : 'Book1'}
          nameBox="E2" formula={typedFormula} fbEdit={f >= t(173) && f < t(184.5)}
          cell={cell as any} colW={colW}
          sel={{r1: 2, c1: 5, r2: 2, c2: 5}} active={{r: 2, c: 5}}
          scroll={scroll} thumb={jumpBottom ? 1 : fillP} thumbSize={opened ? 0.02 : 0.55}
          statusLeft={statusLeft}
          sheet="Sales"
        >
          {typingDone ? (
            <Neon x={g.rowW + colW(1) + colW(2) + colW(3) + colW(4)} y={g.rowsTop} w={colW(5)} h={g.rowsBottom - g.rowsTop} color={C.green} p={prog(f, t(184), 12) * 0.4 * (1 - prog(f, t(210), 12))} label="LET commission spill" labelBelow />
          ) : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} hide={f > t(186)} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 80, top: 150, width: 1760, height: 770, background: '#fff', opacity: flash, pointerEvents: 'none', borderRadius: 14}} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(171), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.green}>manzooma_sales_2026.xlsx</Chip>
      </div>
      <div style={{position: 'absolute', left: 560, top: 82, opacity: prog(f, t(173), 12) * (1 - prog(f, t(210), 12))}}>
        <Chip color={C.blue}>LET + SEQUENCE · 50,000 rows · 70% faster</Chip>
      </div>

      {/* Enterprise seal */}
      <div style={{position: 'absolute', left: 1330, top: 320, width: 330, textAlign: 'center', opacity: sealP, transform: `scale(${0.7 + 0.3 * sealP})`}}>
        <svg width={230} height={230} viewBox="0 0 230 230">
          <circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} />
          <circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" />
          <polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.green, marginTop: -6}}>OPTIMIZATION VERIFIED</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.text}}>70% less overhead · &lt;2ms</div>
      </div>

      <TopBadge text="Enterprise Calculation Optimization ──► Process 50,000 Sales Rows via LET + SEQUENCE" from={t(171.0)} to={t(190.0)} />
      <Caption text="High-Speed Performance ──► 70% Reduction in Calculation Overhead in <2ms" from={t(190.0)} to={t(209.0)} tone="ok" />
    </Stage>
  );
};
