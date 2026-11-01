import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card } from '../../components/common';
import { p, lin, win } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s2;
const COLS = [
  { k: 'id', w: 120 },
  { k: 'full_name', w: 300 },
  { k: 'phone_number', w: 330 },
  { k: 'email', w: 370 },
  { k: 'city', w: 240 },
];
const ROWS = [
  ['1', 'أحمد محمود', '01000000001', 'ahmed@mail.com', 'القاهرة'],
  ['2', 'سارة علي', '01112345678', 'sara@mail.com', 'الإسكندرية'],
  ['3', 'خالد حسن', '01234567890', 'khaled@mail.com', 'الجيزة'],
  ['4', 'منى سمير', '01555555555', 'mona@mail.com', 'القاهرة'],
  ['5', 'يوسف كمال', '01099999999', 'yousef@mail.com', 'أسوان'],
];
const TW = COLS.reduce((a, c) => a + c.w, 0);
const TX = (1920 - TW) / 2, TY = 330, HH = 70, RH = 78;
const colX = (i: number) => TX + COLS.slice(0, i).reduce((a, c) => a + c.w, 0);
const ARABIC = new Set([1, 4]);

export const Scene02: React.FC<{ t: number }> = ({ t }) => {
  const tk = p(t, T.tableAt, 0.8);
  const rowK = p(t, T.row[0], 0.9) * (1 - p(t, T.row[1] - 0.2, 0.4));
  const rowSlide = lin(t, T.row[0], 1.2); // horizontal slide of the highlight
  const colK = p(t, T.col[0], 0.9);
  const colSlideY = lin(t, T.col[0], 1.0); // vertical slide
  const extra = p(t, T.colExtra, 0.6);
  const PC = 2; // phone_number column
  const tableH = HH + ROWS.length * RH;

  return (
    <g>
      {/* intro title */}
      <Reveal t={t} at={40.6} until={47.2} dy={16}>
        <AR x={960} y={150} size={60} weight={900}>تشريح بنية الجدول</AR>
        <EN x={960} y={206} size={32} fill={C.client} weight={600}>Two dimensions: Row × Column</EN>
      </Reveal>

      <g opacity={tk} transform={`translate(0 ${(1 - tk) * 28})`}>
        <Card x={TX - 30} y={TY - 30} w={TW + 60} h={tableH + 60} stroke={C.client} glow={0.5} r={26} />
        {/* header */}
        {COLS.map((c, i) => (
          <g key={c.k}>
            <rect x={colX(i) + 4} y={TY} width={c.w - 8} height={HH - 10} rx={10} fill={C.client} opacity={0.2} />
            <EN x={colX(i) + c.w / 2} y={TY + 38} size={24} fill={C.client} weight={600}>{c.k}</EN>
          </g>
        ))}
        {/* rows */}
        {ROWS.map((r, ri) => {
          const y = TY + HH + ri * RH;
          return (
            <g key={ri}>
              <rect x={TX} y={y} width={TW} height={RH - 10} rx={12} fill={ri % 2 ? C.cardDeep : '#243247'} />
              {r.map((v, ci) =>
                ARABIC.has(ci) ? (
                  <AR key={ci} x={colX(ci) + COLS[ci].w / 2} y={y + 48} size={30} weight={400}>{v}</AR>
                ) : (
                  <EN key={ci} x={colX(ci) + COLS[ci].w / 2} y={y + 46} size={24}>{v}</EN>
                )
              )}
            </g>
          );
        })}

        {/* ROW highlight (emerald) sliding in horizontally */}
        <g opacity={rowK}>
          <rect x={TX + (1 - rowSlide) * -TW} y={TY + HH - 4} width={TW} height={RH - 2} rx={14} fill={C.db} opacity={0.28} stroke={C.db} strokeWidth={4} />
        </g>

        {/* COLUMN highlight (amber) sliding in vertically */}
        <g opacity={colK}>
          <rect x={colX(PC) + 2} y={TY - 6 - (1 - colSlideY) * 120} width={COLS[PC].w - 4} height={tableH * colSlideY + 6} rx={14} fill={C.opt} opacity={0.22} stroke={C.opt} strokeWidth={4} />
        </g>
        <g opacity={extra * 0.9}>
          <rect x={colX(3) + 2} y={TY - 6} width={COLS[3].w - 4} height={tableH + 6} rx={14} fill={C.opt} opacity={0.12} stroke={C.opt} strokeWidth={3} strokeDasharray="10 10" strokeDashoffset={-t * 30} />
        </g>
      </g>

      {/* row label + overlay */}
      <Reveal t={t} at={T.row[0]} until={T.row[1]} dy={18}>
        <AR x={960} y={160} size={46} weight={900} fill={C.db}>الصف (Row / Record) = كيان فردي واحد</AR>
        <EN x={960} y={212} size={30} fill={C.db} weight={600}>Single Instance</EN>
        <path d={`M ${TX - 70} ${TY + HH + RH / 2} H ${TX - 18}`} stroke={C.db} strokeWidth={6} strokeLinecap="round" />
        <path d={`M ${TX - 32} ${TY + HH + RH / 2 - 14} L ${TX - 10} ${TY + HH + RH / 2} L ${TX - 32} ${TY + HH + RH / 2 + 14} Z`} fill={C.db} />
        <EN x={TX - 90} y={TY + HH + RH / 2 + 8} size={24} anchor="end" fill={C.db}>Tuple</EN>
      </Reveal>

      {/* column label + overlay */}
      <Reveal t={t} at={T.col[0]} until={T.col[1]} dy={18}>
        <AR x={960} y={160} size={46} weight={900} fill={C.opt}>العمود (Column / Attribute) = خاصية مشتركة</AR>
        <EN x={960} y={212} size={30} fill={C.opt} weight={600}>Shared Property</EN>
        <g>
          <path d={`M ${colX(PC) + COLS[PC].w / 2} ${TY + tableH + 70} V ${TY + tableH + 28}`} stroke={C.opt} strokeWidth={6} strokeLinecap="round" />
          <path d={`M ${colX(PC) + COLS[PC].w / 2 - 14} ${TY + tableH + 42} L ${colX(PC) + COLS[PC].w / 2} ${TY + tableH + 20} L ${colX(PC) + COLS[PC].w / 2 + 14} ${TY + tableH + 42} Z`} fill={C.opt} />
          <EN x={colX(PC) + COLS[PC].w / 2} y={TY + tableH + 112} size={26} fill={C.opt}>Attribute: phone_number</EN>
        </g>
      </Reveal>
    </g>
  );
};
