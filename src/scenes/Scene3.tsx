import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {CUSTOMERS} from '../data';
import {
  CAM0, Caption, ExcelApp, ExcelWindow, Neon, Stage, TopBadge, XL, camLerp, clamp, colHeaderCenter, geo, prog, sec,
} from '../kit';

// SC03: The Left-Lookup Barrier — VLOOKUP cannot fetch data left of the lookup column.
// Anchors (s): 86.0 table appears | 90.0 formula shown | 95.0 left-arrow attempt | 100.0 barrier impact + #N/A | 105.0 explanation
const S = START.s3;
const t = (g: number) => sec(g - S);

// Rearranged customers: A=CustomerName, B=Address, C=CustomerID (key is RIGHTMOST → left lookup needed)
const leftColW = (c: number) => [0, 200, 280, 120][c] ?? XL.colW;

const leftCell = (r: number, c: number) => {
  if (r === 1) {
    const h = ['CustomerName', 'Address', 'CustomerID'];
    if (c < 1 || c > 3) return undefined;
    return {t: h[c - 1], b: true, bg: '#E2EFDA', al: 'l'};
  }
  const row = CUSTOMERS[r - 2];
  if (!row || c < 1 || c > 3) return undefined;
  switch (c) {
    case 1: return {t: row.name};
    case 2: return {t: row.address};
    default: return {t: row.id};
  }
};

const lCell = (r: number, c: number) => {
  const g = geo(1, 0, 1);
  let x = g.rowW;
  for (let i = 1; i < c; i++) x += leftColW(i);
  return {x: x + leftColW(c) / 2, y: g.rowsTop + (r - 1) * XL.rowH + XL.rowH / 2};
};

/** Concrete barrier wall graphic drawn in Excel logical coordinates. */
const Barrier: React.FC<{x: number; impactP: number}> = ({x, impactP}) => {
  const f = useCurrentFrame();
  const g = geo(1, 0, 1);
  const top = g.colTop;
  const h = g.rowsBottom - g.colTop;
  const pulse = 0.7 + 0.3 * Math.sin(f * 0.15);
  return (
    <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 28}}>
      {/* barrier wall */}
      <rect x={x - 8} y={top} width={16} height={h} fill="#1E0A0A" stroke={C.red} strokeWidth={3} />
      {/* hazard stripes */}
      {Array.from({length: Math.floor(h / 24)}, (_, i) => (
        <line key={i} x1={x - 8} y1={top + i * 24 + 12} x2={x + 8} y2={top + i * 24} stroke={C.amber} strokeWidth={3} />
      ))}
      {/* glow */}
      <rect x={x - 12} y={top} width={24} height={h} fill="none" stroke={C.red} strokeWidth={2} opacity={pulse * (0.5 + 0.5 * impactP)} />
      {/* impact flash */}
      {impactP > 0 && impactP < 1 ? (
        <>
          <circle cx={x} cy={top + h / 2} r={20 + 60 * impactP} fill="none" stroke={C.red} strokeWidth={4} opacity={(1 - impactP) * 0.8} />
          <circle cx={x} cy={top + h / 2} r={10 + 30 * impactP} fill={C.red} opacity={(1 - impactP) * 0.3} />
        </>
      ) : null}
      {/* label */}
      <rect x={x - 80} y={top - 26} width={160} height={22} fill={C.red} rx={4} />
      <text x={x} y={top - 10} textAnchor="middle" fill="#fff" fontFamily="Consolas, monospace" fontSize={14} fontWeight={700}>LEFT BARRIER</text>
    </svg>
  );
};

/** Left-pointing lookup arrow that travels from column C toward column A. */
const LeftArrow: React.FC<{p: number; blocked: boolean; barrierX: number}> = ({p, blocked, barrierX}) => {
  const g = geo(1, 0, 1);
  const startX = lCell(2, 3).x; // column C (CustomerID)
  const endX = lCell(2, 1).x;   // column A (CustomerName)
  const y = lCell(2, 1).y;
  const arrowX = startX + (endX - startX) * (blocked ? Math.min(p, 0.7) : p);
  const actualEnd = blocked ? Math.max(arrowX, barrierX + 12) : endX;

  return (
    <svg width={XL.W} height={XL.H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 27}}>
      {/* arrow trail */}
      <line x1={startX} y1={y} x2={actualEnd} y2={y} stroke={C.red} strokeWidth={4} strokeDasharray="8 4" opacity={0.8} />
      {/* arrowhead pointing LEFT */}
      {(!blocked || p < 0.7) && actualEnd < startX ? (
        <polygon points={`${actualEnd - 12},${y - 8} ${actualEnd},${y} ${actualEnd - 12},${y + 8}`} fill={C.red} />
      ) : null}
      {/* "CUST-002" label on the arrow */}
      <rect x={startX - 50} y={y - 38} width={100} height={20} fill={C.amber} rx={3} />
      <text x={startX} y={y - 24} textAnchor="middle" fill="#0F172A" fontFamily="Consolas, monospace" fontSize={13} fontWeight={700}>CUST-002</text>
    </svg>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();

  const cam = camLerp(CAM0, {fx: 340, fy: 300, z: 1.2}, prog(f, t(2), 30));

  // formula appearance
  const formulaP = prog(f, t(90 - S), 12);

  // column highlights
  const colCHighlight = prog(f, t(88), 12) * (1 - prog(f, t(130), 12)); // CustomerID (lookup target)
  const colAHighlight = prog(f, t(89), 12) * (1 - prog(f, t(130), 12)); // CustomerName (desired return)

  // left arrow animation (95-100s)
  const arrowP = prog(f, t(95), 24);
  const impactP = prog(f, t(99), 14);
  const blocked = arrowP > 0.5;

  // #N/A result
  const naP = prog(f, t(100), 12) * (1 - prog(f, t(130), 12));

  const g = geo(1, 0, 1);
  const barrierX = g.rowW + leftColW(1) + 2; // left edge of column B (between A and B)
  const colC = lCell(1, 3);
  const colA = lCell(1, 1);

  return (
    <Stage dur={SCENES.s3.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Customers_Rearranged.xlsx" nameBox="C2" formula='=VLOOKUP("CUST-002", A1:C16, ???, FALSE)'
          cell={leftCell as any} colW={leftColW}
          sel={{r1: 2, c1: 3, r2: 2, c2: 3}} active={{r: 2, c: 3}} thumb={0} thumbSize={0.55}
        >
          {/* highlight column C (CustomerID — desired lookup column) */}
          <Neon x={colC.x - leftColW(3) / 2} y={g.colTop} w={leftColW(3)} h={g.rowsBottom - g.colTop} color={C.amber} p={colCHighlight * 0.5} label="Lookup key (col 3)" />
          {/* highlight column A (CustomerName — desired return, LEFT of lookup) */}
          <Neon x={colA.x - leftColW(1) / 2} y={g.colTop} w={leftColW(1)} h={g.rowsBottom - g.colTop} color={C.green} p={colAHighlight * 0.5} label="Target (col 1)" />
          {/* barrier wall */}
          <Barrier x={barrierX} impactP={impactP} />
          {/* left-pointing lookup arrow */}
          {arrowP > 0 ? <LeftArrow p={arrowP} blocked={blocked} barrierX={barrierX} /> : null}
          {/* #N/A result badge */}
          {naP > 0 ? (
            <div style={{position: 'absolute', left: lCell(2, 3).x + 60, top: lCell(2, 3).y - 16, opacity: naP, transform: `scale(${0.7 + 0.3 * naP})`}}>
              <div style={{background: C.red, color: '#fff', fontFamily: 'Consolas, monospace', fontSize: 28, fontWeight: 700, padding: '6px 24px', borderRadius: 8, boxShadow: `0 0 30px ${C.red}88`}}>
                #N/A
              </div>
            </div>
          ) : null}
        </ExcelApp>
      </ExcelWindow>
      <TopBadge text="The Left-Lookup Blindspot ──► VLOOKUP Cannot Fetch Data Left of the Lookup Column" from={t(88)} to={t(120)} />
      <Caption text="Architectural Barrier ──► Lookup Column MUST Always Be Column #1 in the Array" from={t(105)} to={t(129)} tone="danger" />
    </Stage>
  );
};
