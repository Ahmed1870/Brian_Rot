import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card } from '../../components/common';
import { p, lin, win, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s2;
const COLS = ['order_id', 'customer_id', 'product', 'amount'];
const DATA = [
  ['5001', '101', 'Laptop', '1,250'],
  ['5002', '105', 'Monitor', '380'],
  ['5003', '105', 'Keyboard', '95'],
  ['5004', '108', 'Headset', '140'],
];
const TX = 360, CW = 300, TY = 190, RH = 50; // logical table geometry
const GX = 384, GY = 760, PW = 64, PH = 44, GAP = 8, GCOLS = 16, GROWS = 4;
const TARGET = { r: 1, c: 9 }; // page that holds the matching row
const ROW_HI = 2; // data row (0-based) highlighted in logical table (customer 105)

const pageUsed = (r: number, c: number) => (r * 7 + c * 3) % 5 !== 0;

export const Scene02: React.FC<{ t: number }> = ({ t }) => {
  const tx = GX + TARGET.c * (PW + GAP) + PW / 2;
  const ty = GY + TARGET.r * (PH + GAP) + PH / 2;
  const hi = p(t, T.translateAt, 0.6);
  const beamDown = lin(t, T.translateAt + 0.4, 1.4);
  const scanK = lin(t, T.scanAt, T.scanDur);
  const scanY = 190 + scanK * 830;
  const rowY = TY + RH * (ROW_HI + 1);

  return (
    <g>
      {/* logical card */}
      <Reveal t={t} at={T.logical[0] - 0.8} dy={30}>
        <Card x={160} y={60} w={1600} h={410} stroke={C.client} glow={win(t, T.logical[0], T.logical[1] + 4)} />
        <Reveal t={t} at={T.logical[0]} dur={0.6} dy={14} until={77.5}>
          <AR x={960} y={122} size={46} weight={900}>النموذج المنطقي: جداول وصفوف</AR>
          <EN x={960} y={162} size={26} fill={C.client} weight={600}>Logical Model (Human Friendly)</EN>
        </Reveal>
        {/* table */}
        <g>
          <EN x={TX - 40} y={TY + 33} size={24} anchor="end" fill={C.opt} weight={600}>Orders</EN>
          {COLS.map((c, i) => (
            <g key={c}>
              <rect x={TX + i * CW} y={TY} width={CW - 6} height={RH - 6} rx={8} fill={C.client} opacity={0.22} />
              <EN x={TX + i * CW + 16} y={TY + 29} size={22} anchor="start" fill={C.client} weight={600}>{c}</EN>
            </g>
          ))}
          {DATA.map((row, r) => {
            const k = p(t, T.logical[0] + 0.5 + r * 0.25, 0.5);
            const y = TY + RH * (r + 1);
            const on = r === ROW_HI ? hi : 0;
            return (
              <g key={r} opacity={k}>
                <rect x={TX} y={y} width={CW * 4 - 6} height={RH - 6} rx={8} fill={C.opt} opacity={0.08 + 0.3 * on} />
                {row.map((v, i) => (
                  <EN key={i} x={TX + i * CW + 16} y={y + 29} size={22} anchor="start" fill={on > 0.2 ? C.opt : C.text}>{v}</EN>
                ))}
              </g>
            );
          })}
        </g>
      </Reveal>

      {/* physical card */}
      <Reveal t={t} at={T.physical[0] - 0.8} dy={30}>
        <Card x={160} y={610} w={1600} h={430} stroke={C.db} glow={win(t, T.physical[0], T.physical[1] + 4)} />
        <Reveal t={t} at={T.physical[0]} dur={0.6} dy={14} until={77.5}>
          <AR x={960} y={672} size={46} weight={900}>التخزين الفيزيائي: صفحات بيانات 8KB</AR>
          <EN x={960} y={712} size={26} fill={C.db} weight={600}>Physical Storage (Data Pages)</EN>
        </Reveal>
        {Array.from({ length: GROWS * GCOLS }).map((_, i) => {
          const r = Math.floor(i / GCOLS);
          const c = i % GCOLS;
          const k = p(t, T.physical[0] + 0.4 + (c + r * 2) * 0.05, 0.4);
          const isT = r === TARGET.r && c === TARGET.c;
          const used = pageUsed(r, c);
          return (
            <rect
              key={i}
              x={GX + c * (PW + GAP)}
              y={GY + r * (PH + GAP)}
              width={PW}
              height={PH}
              rx={8}
              fill={isT ? C.db : used ? C.db : C.line}
              opacity={k * (isT ? 0.35 + 0.65 * hi : used ? 0.28 : 0.5)}
              stroke={isT && hi > 0.1 ? C.text : 'none'}
              strokeWidth={3}
            />
          );
        })}
        <g opacity={hi}>
          <EN x={960} y={1010} size={26} fill={C.db} weight={600}>Page #42 · 8 KB · offset 0x1F40</EN>
        </g>
      </Reveal>

      {/* translator engine */}
      <Reveal t={t} at={T.scanAt - 2} dy={0}>
        <g transform={`translate(960 540)`}>
          <circle r={58} fill={C.cardDeep} stroke={C.opt} strokeWidth={4} />
          <g transform={`rotate(${t * 40})`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={-8} y={-52} width={16} height={18} rx={4} fill={C.opt} transform={`rotate(${i * 45})`} />
            ))}
            <circle r={26} fill="none" stroke={C.opt} strokeWidth={5} />
          </g>
          <circle r={8} fill={C.opt} />
        </g>
        <AR x={880} y={532} size={30} fill={C.opt} anchor="start">محرك الترجمة</AR>
        <EN x={1040} y={532} size={26} anchor="start" fill={C.muted}>Translator Engine</EN>
      </Reveal>

      {/* beams */}
      <g opacity={win(t, T.translateAt, 78, 0.4)}>
        <path d={`M 960 598 L ${tx} ${ty - PH / 2}`} stroke={C.db} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - beamDown} />
        <path d={`M ${960} ${rowY + 20} L 960 482`} stroke={C.opt} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lin(t, T.translateAt, 0.6)} />
      </g>

      {/* scan line sweeping top to bottom */}
      {scanK > 0 && scanK < 1 && (
        <g opacity={keys(scanK, [0, 0.08, 0.92, 1], [0, 1, 1, 0])}>
          <rect x={200} y={scanY - 18} width={1520} height={36} fill={C.client} opacity={0.08} />
          <rect x={200} y={scanY - 3} width={1520} height={6} rx={3} fill={C.client} opacity={0.85} />
        </g>
      )}
    </g>
  );
};
