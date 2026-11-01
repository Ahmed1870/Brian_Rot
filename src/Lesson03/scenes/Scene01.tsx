import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, PersonIcon } from '../../components/common';
import { p, lin, win, keys, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s1;
const NAMES = ['أحمد محمود', 'سارة علي', 'خالد حسن', 'منى سمير'];
const TX = 360, TW = 1200, TY = 300, RH = 100;

export const Scene01: React.FC<{ t: number }> = ({ t }) => {
  const iconIn = p(t, T.iconAt, 0.9);
  const morph = p(t, T.morphAt, 1.6);
  // main icon travels from center stage into the first table row slot
  const ix = keys(morph, [0, 1], [960, TX + 80]);
  const iy = keys(morph, [0, 1], [480, TY + 72 + (RH - 14) / 2 + 8]);
  const isc = keys(morph, [0, 1], [1.6, 0.42]);
  const ring = 1 + 0.06 * Math.sin(t * 3);
  const side = p(t, T.sideIcons, 0.8) * (1 - p(t, T.morphAt, 0.6));
  const tableK = p(t, T.morphAt + 0.5, 0.8);
  const setK = p(t, T.entitySet, 0.8);

  return (
    <g>
      <Header t={t} a={T.header[0]} b={T.header[1]} ar="الكيان في العالم الحقيقي" en="Real-World Entity" />

      {/* real-world stage */}
      {t < T.morphAt + 2 && (
        <g opacity={(1 - p(t, T.morphAt + 1.2, 0.6))}>
          <g opacity={iconIn * (t < T.morphAt ? 1 : 0)}>
            <circle cx={960} cy={480} r={170 * ring} fill="none" stroke={C.client} strokeWidth={5} opacity={0.35} />
            <circle cx={960} cy={480} r={140} fill="none" stroke={C.client} strokeWidth={3} strokeDasharray="10 14" strokeDashoffset={-t * 40} opacity={0.7} />
          </g>
          <g opacity={side}>
            <g transform="translate(560 480)">
              <rect x={-60} y={-50} width={120} height={100} rx={12} fill={C.cardDeep} stroke={C.opt} strokeWidth={5} />
              <path d="M -60 -20 H 60 M 0 -50 V -20" stroke={C.opt} strokeWidth={5} />
              <AR x={0} y={110} size={34} fill={C.opt}>المنتج</AR>
              <EN x={0} y={146} size={22} fill={C.muted}>Product</EN>
            </g>
            <g transform="translate(1360 480)">
              <path d="M -50 -64 H 50 V 64 L 33 52 L 17 64 L 0 52 L -17 64 L -33 52 L -50 64 Z" fill={C.cardDeep} stroke={C.db} strokeWidth={5} strokeLinejoin="round" />
              <path d="M -26 -30 H 26 M -26 -6 H 26 M -26 18 H 6" stroke={C.db} strokeWidth={5} strokeLinecap="round" />
              <AR x={0} y={110} size={34} fill={C.db}>الطلب</AR>
              <EN x={0} y={146} size={22} fill={C.muted}>Order</EN>
            </g>
          </g>
        </g>
      )}
      {/* customers table */}
      <g opacity={tableK} transform={`translate(0 ${(1 - tableK) * 30})`}>
        <rect x={TX - 14} y={TY - 14} width={TW + 28} height={4 * RH + 100} rx={30} fill="none" stroke={C.client} strokeWidth={5} opacity={0.35 + 0.5 * bump(t, T.entitySet, 1.6)} />
        <Card x={TX} y={TY} w={TW} h={4 * RH + 72} stroke={C.client} glow={0.6 + setK * 0.8} />
        <EN x={TX + 40} y={TY + 46} size={32} anchor="start" fill={C.client} weight={600}>customers</EN>
        {NAMES.map((n, i) => {
          const rk = i === 0 ? 1 : p(t, T.morphAt + 1 + i * 0.4, 0.5);
          const y = TY + 72 + i * RH;
          return (
            <g key={i} opacity={rk}>
              <rect x={TX + 20} y={y} width={TW - 40} height={RH - 14} rx={14} fill={i % 2 ? C.cardDeep : '#243247'} />
              {i > 0 && <PersonIcon x={TX + 80} y={y + (RH - 14) / 2 + 8} s={0.42} bag={false} />}
              <AR x={TX + 300} y={y + 58} size={36} anchor="middle">{n}</AR>
              <EN x={TX + TW - 60} y={y + 56} size={28} anchor="end" fill={C.muted}>{`id = ${i + 1}`}</EN>
            </g>
          );
        })}
      </g>

      <g opacity={iconIn}>
        <PersonIcon x={ix} y={iy} s={isc} />
        {t < T.morphAt && (
          <g opacity={p(t, 4, 0.8)}>
            <AR x={960} y={740} size={42} fill={C.client}>العميل</AR>
            <EN x={960} y={780} size={26} fill={C.muted}>Customer</EN>
          </g>
        )}
      </g>

      {/* entity set label */}
      <g opacity={setK} transform={`translate(0 ${(1 - setK) * 16})`}>
        <AR x={960} y={862} size={44} fill={C.client}>مجموعة كيانات متجانسة</AR>
        <EN x={960} y={902} size={28} fill={C.client} weight={600}>Entity Set</EN>
      </g>

      {/* structural mapping */}
      <g opacity={win(t, T.mapping[0], T.mapping[1])}>
        <Arrowed y={992} left="Entity: Customer" right="Table: customers" size={38} />
      </g>
    </g>
  );
};
