import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, ShieldIcon } from '../../components/common';
import { p, lin, win } from '../../anim';
import { PRODUCTS } from '../../data';
import tl from '../../timeline.json';

const T = tl.s1;
const TX = 100, TY = 290, HDR = 54, RH = 100;

export const Scene01: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.tableAt, 0.9);
  const mod = p(t, T.moduleAt, 0.6);
  const hyb = p(t, T.hybridAt, 0.6);
  const caps = p(t, T.capsAt, 0.6);
  const merge = p(t, T.mergeAt, 1.2);
  const srv = p(t, T.serverAt, 0.7);
  const aw = 150 + 410 * merge; // attributes column width grows
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1]} ar="التعامل مع البيانات غير المهيكلة" en="JSON & JSONB Data Types" y={105} color={C.client} />

      {/* module badge */}
      <g opacity={mod} transform={`translate(0 ${(1 - mod) * -12})`}>
        <rect x={50} y={86} width={440} height={44} rx={22} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
        <EN x={270} y={115} size={19} fill={C.db} weight={600}>Module 15 · Semi-Structured Data</EN>
      </g>

      {/* relational table with a growing JSONB column */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={70} y={190} w={1190} h={560} stroke={merge > 0.3 ? C.client : C.line} glow={0.3 + 0.5 * merge} r={24} />
        <EN x={100} y={238} size={26} anchor="start" fill={C.client} weight={600}>store_products</EN>
        <g opacity={hyb}>
          <rect x={700} y={216} width={530} height={44} rx={22} fill={C.client} opacity={0.18} stroke={C.client} strokeWidth={3} />
          <EN x={965} y={246} size={20} fill={C.client} weight={600}>Hybrid Relational / NoSQL Engine</EN>
        </g>
        {/* header */}
        {[['product_id', 110, 0], ['name', 190, 110], ['price', 140, 300]].map(([h, w, off]) => (
          <g key={h as string}>
            <rect x={TX + (off as number) + 3} y={TY} width={(w as number) - 6} height={HDR - 8} rx={10} fill={C.client} opacity={0.2} />
            <EN x={TX + (off as number) + (w as number) / 2} y={TY + 32} size={17} fill={C.client} weight={600}>{h as string}</EN>
          </g>
        ))}
        <rect x={TX + 443} y={TY} width={aw - 6} height={HDR - 8} rx={10} fill={C.db} opacity={0.22} />
        <EN x={TX + 443 + (aw - 6) / 2} y={TY + 32} size={20} fill={C.db} weight={600}>attributes · JSONB</EN>
        {PRODUCTS.map((r, i) => {
          const y = TY + HDR + i * RH;
          const rk = p(t, T.tableAt + 0.4 + i * 0.25, 0.5);
          return (
            <g key={r.id} opacity={rk}>
              <rect x={TX} y={y} width={443 + aw} height={RH - 10} rx={12} fill={i % 2 ? '#172033' : '#243247'} />
              <EN x={TX + 55} y={y + 52} size={22}>{String(r.id)}</EN>
              <AR x={TX + 205} y={y + 54} size={28}>{r.n}</AR>
              <EN x={TX + 370} y={y + 52} size={22}>{r.price}</EN>
              {/* collapsed placeholder → expanded document tree */}
              <g opacity={1 - merge}>
                <EN x={TX + 443 + 75} y={y + 52} size={26} fill={C.muted}>{'{ … }'}</EN>
              </g>
              <g opacity={merge}>
                {r.attrs.map((a, j) => (
                  <g key={a} transform={`translate(${TX + 458 + (j % 2) * 215} ${y + 8 + Math.floor(j / 2) * 40})`}>
                    <rect width={205} height={32} rx={16} fill={C.client} opacity={0.2} stroke={C.client} strokeWidth={2} />
                    <EN x={102} y={22} size={15} fill={C.text} weight={600}>{a}</EN>
                  </g>
                ))}
              </g>
            </g>
          );
        })}
      </g>

      {/* RDBMS + NoSQL merging into the table */}
      <g opacity={k}>
        <g transform={`translate(${1290 - 40 * merge} 200)`}>
          <Card x={0} y={0} w={540} h={250} stroke={C.db} glow={0.3} r={22} />
          <ShieldIcon x={110} y={130} s={0.62} color={C.db} fillOp={0.25} />
          <AR x={510} y={100} size={34} anchor="start" fill={C.db}>موثوقية RDBMS</AR>
          <EN x={510} y={150} size={22} anchor="end" fill={C.muted}>ACID · constraints · joins</EN>
        </g>
        <g transform={`translate(${1290 - 40 * merge} 480)`}>
          <Card x={0} y={0} w={540} h={250} stroke={C.client} glow={0.3} r={22} />
          <g transform="translate(110 125)" stroke={C.client} strokeWidth={6} fill="none" strokeLinecap="round">
            <path d="M 0 -55 V -20 M 0 -20 L -45 30 M 0 -20 L 45 30 M 0 -20 V 40" />
            <circle cx={0} cy={-62} r={14} fill={C.cardDeep} />
            {[-45, 0, 45].map((x) => <circle key={x} cx={x} cy={45} r={13} fill={C.cardDeep} />)}
          </g>
          <AR x={510} y={100} size={34} anchor="start" fill={C.client}>مرونة NoSQL</AR>
          <EN x={510} y={150} size={22} anchor="end" fill={C.muted}>flexible JSON documents</EN>
        </g>
        <path d="M 1270 325 H 1230 M 1270 605 H 1230" stroke={C.opt} strokeWidth={5} strokeLinecap="round" strokeDasharray="10 8" strokeDashoffset={-t * 60} opacity={merge} />
      </g>

      {/* JSON / JSONB capsules */}
      <g opacity={caps}>
        {[['JSON', C.opt, 130], ['JSONB', C.db, 430]].map(([n, c, x]) => (
          <g key={n as string} transform={`translate(${x} 790) scale(${0.85 + 0.15 * caps})`}>
            <rect x={0} y={0} width={260} height={80} rx={40} fill={c as string} opacity={0.18} stroke={c as string} strokeWidth={4} />
            <EN x={130} y={52} size={34} fill={c as string} weight={600}>{n as string}</EN>
          </g>
        ))}
      </g>

      {/* enterprise server stamp */}
      <g opacity={srv} transform={`translate(0 ${(1 - srv) * 14})`}>
        <rect x={740} y={790} width={1090} height={80} rx={40} fill={C.db} opacity={0.14} stroke={C.db} strokeWidth={3} />
        <AR x={1780} y={843} size={32} anchor="start" fill={C.db}>مستندات مرنة داخل السيرفر المؤسسي المعتمد</AR>
      </g>

      <g opacity={win(t, T.cap[0], T.cap[1], 0.4)}>
        <Arrowed y={985} left="Hybrid Database Model" right="Combines RDBMS Reliability with NoSQL Document Flexibility" leftColor={C.client} rightColor={C.text} size={22} />
      </g>
    </g>
  );
};
