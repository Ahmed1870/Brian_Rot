import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Arrowed, MiniTable, LockIcon } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, bump, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s2;
const COLS: Col[] = [
  { k: 'id', w: 80 },
  { k: 'name', w: 220, ar: true },
  { k: 'email', w: 300, color: C.client },
  { k: 'phone', w: 220 },
];
const ROWS = [['1', 'أحمد محمود', 'ahmed@mail.com', '0100000001'], ['2', 'سارة علي', 'sara@mail.com', '0111234567'], ['3', 'خالد حسن', 'user@test.com', '0122223333']];
const TX = 100, TY = 256, HDR = 54, RH = 62;
const EMX = TX + 80 + 220; // email column x
const LEAVES = ['ahmed', 'ali', 'khaled', 'mona', 'sara', 'user@'];
const CH = [1195, 1420, 1645];

const Node: React.FC<{ x: number; y: number; w: number; h: number; k: number; label?: string; hot?: string }> = ({ x, y, w, h, k, label, hot }) => (
  <g opacity={k} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={C.cardDeep} stroke={hot ?? C.db} strokeWidth={4} />
    {label && <EN x={0} y={7} size={18} fill={hot ?? C.db} weight={600}>{label}</EN>}
  </g>
);

export const Scene02: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.tableAt, 0.9);
  const nn = p(t, T.notNullAt, 0.5);
  const uq = p(t, T.uniqueAt, 0.5);
  const lockK = p(t, T.notNullAt + 0.3, 0.45);
  const nullFly = lin(t, T.notNullAt + 2.2, 2.2); // NULL row attempts
  const dupFly = lin(t, T.dupAt, 2.0);
  const tree = (at: number) => p(t, at, 0.5);
  const root = tree(T.treeAt), kids = tree(T.treeAt + 2.8), leaves = (i: number) => tree(T.treeAt + 4.2 + i * 0.35);
  const search = lin(t, T.searchAt, 2.4);
  const comb = p(t, T.combineAt, 0.7);
  const EMW = 300;
  const ghostX = (f: number) => keys(f, [0, 0.5, 0.62, 1], [TX + 700, TX + 120, TX + 120 + 0, TX + 700]);
  const bounce1 = keys(nullFly, [0, 0.5, 1], [0, 1, 0]);
  const bounce2 = keys(dupFly, [0, 0.5, 1], [0, 1, 0]);
  const redLine = bump(t, T.dupAt + 1.0, 1.0);
  const blueFlash = bump(t, T.notNullAt + 3.1, 0.9);

  return (
    <g>
      {/* customers + constraint code */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={TX - 30} y={190} w={880} h={400} stroke={C.line} glow={0.3} r={24} />
        <EN x={TX} y={238} size={26} anchor="start" fill={C.client} weight={600}>customers</EN>
        <MiniTable x={TX} y={TY} cols={COLS} rows={ROWS} rowH={RH} hdrH={HDR} fs={22} />
        {/* email column highlight + lock */}
        <g opacity={nn}>
          <rect x={EMX + 3} y={TY - 4} width={EMW - 6} height={HDR + 4 * RH - 8} rx={12} fill="none" stroke={C.client} strokeWidth={4} opacity={0.5 + 0.5 * blueFlash} />
          <rect x={EMX + 3} y={TY} width={EMW - 6} height={HDR + 3 * RH - 14} rx={12} fill={C.client} opacity={0.08} />
        </g>
        <g opacity={lockK}><LockIcon x={EMX + 262} y={TY + 26} s={0.42} color={C.client} closed={lockK} /></g>
        <g opacity={uq}>
          <rect x={EMX + EMW - 290} y={TY - 30} width={96} height={26} rx={13} fill={C.db} opacity={0.25} stroke={C.db} strokeWidth={2} />
          <EN x={EMX + EMW - 242} y={TY - 11} size={15} fill={C.db} weight={600}>UNIQUE</EN>
        </g>
        {/* NULL attempt (bounces off the lock) */}
        {nullFly > 0 && nullFly < 1 && (
          <g opacity={1 - 0.0} transform={`translate(${TX + 430 - 180 * bounce1} ${TY + HDR + 3 * RH})`}>
            <rect x={0} y={0} width={360} height={RH - 8} rx={12} fill="#3A2030" stroke={C.accent} strokeWidth={3} />
            <AR x={70} y={38} size={24} fill="#FCA5A5">عمر زكي</AR>
            <EN x={250} y={37} size={22} fill="#FCA5A5" weight={600}>NULL</EN>
          </g>
        )}
        {nullFly > 0.45 && nullFly < 1 && (
          <g opacity={win(nullFly, 0.45, 1, 0.15)}>
            <EN x={EMX + 150} y={TY + HDR + 3 * RH + RH + 22} size={18} fill={C.accent}>✗ NULL rejected — NOT NULL</EN>
          </g>
        )}
        {/* duplicate attempt */}
        {dupFly > 0 && dupFly < 1 && (
          <g transform={`translate(${TX + 430 - 180 * bounce2} ${TY + HDR + 3 * RH})`}>
            <rect x={0} y={0} width={360} height={RH - 8} rx={12} fill="#3A2030" stroke={C.accent} strokeWidth={3} />
            <AR x={70} y={38} size={24} fill="#FCA5A5">عمر زكي</AR>
            <EN x={240} y={37} size={18} fill="#FCA5A5" weight={600}>user@test.com</EN>
          </g>
        )}
        <g opacity={redLine}>
          <rect x={EMX + EMW - 8} y={TY - 6} width={8} height={HDR + 4 * RH} rx={4} fill={C.accent} />
          <rect x={EMX + EMW - 20} y={TY - 6} width={32} height={HDR + 4 * RH} rx={10} fill={C.accent} opacity={0.2} />
        </g>
        <g opacity={win(t, T.dupAt + 1.0, T.dupAt + 4, 0.3)}>
          <EN x={TX + 400} y={TY + HDR + 4 * RH + 24} size={18} fill={C.accent}>duplicate key value violates unique constraint</EN>
        </g>
      </g>

      {/* constraint code line builds up */}
      <Reveal t={t} at={T.tableAt + 0.8} dy={14}>
        <Card x={TX - 30} y={640} w={880} h={110} stroke={C.line} r={20} />
        <text x={TX + 10} y={706} fontFamily={FONT_MONO} fontSize={32} fontWeight={600} direction="ltr">
          <tspan fill={C.text}>email VARCHAR(255)</tspan>
          <tspan fill={C.client} opacity={nn}>{nn > 0 ? ' NOT NULL' : ''}</tspan>
          <tspan fill={C.db}>{uq > 0 ? ' UNIQUE' : ''}</tspan>
        </text>
      </Reveal>
      <g opacity={comb} transform={`translate(0 ${(1 - comb) * 14})`}>
        <rect x={TX - 30} y={790} width={880} height={82} rx={41} fill={C.db} opacity={0.15} stroke={C.db} strokeWidth={3} />
        <AR x={TX + 810 - 40} y={842} size={34} anchor="start" fill={C.db}>حقل إجباري وفريد</AR>
        <EN x={TX + 330} y={840} size={26} fill={C.db} weight={600}>NOT NULL + UNIQUE</EN>
      </g>

      {/* B-Tree index layer */}
      <g opacity={root}>
        <Card x={1010} y={190} w={820} h={700} stroke={C.db} glow={0.5} r={24} />
        <EN x={1420} y={242} size={30} fill={C.db} weight={600}>B-Tree Index</EN>
        <EN x={1420} y={278} size={20} fill={C.muted}>auto-created by UNIQUE</EN>
      </g>
      <path d={`M ${EMX + EMW + 30} ${TY + 20} C 960 ${TY - 40} 990 330 1010 330`} stroke={C.db} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-t * 40} fill="none" opacity={root * 0.6} />
      <Node x={1420} y={350} w={190} h={58} k={root} label="[ m | s ]" />
      {CH.map((cx, i) => (
        <g key={i}>
          <path d={`M 1420 380 L ${cx} 450`} stroke={C.db} strokeWidth={4} fill="none" opacity={kids} />
          <Node x={cx} y={480} w={160} h={54} k={kids} label={['[ a–l ]', '[ m–r ]', '[ s–z ]'][i]} />
        </g>
      ))}
      {LEAVES.map((l, i) => {
        const cx = CH[Math.floor(i / 2)] + (i % 2 ? 54 : -54);
        const isHot = i === 5 && search > 0.35 && search < 1;
        const isBad = i === 5 && redLine > 0.1;
        return (
          <g key={l}>
            <path d={`M ${CH[Math.floor(i / 2)]} 508 L ${cx} 590`} stroke={C.db} strokeWidth={3} fill="none" opacity={leaves(i)} />
            <Node x={cx} y={620} w={98} h={46} k={leaves(i)} label={l} hot={isBad ? C.accent : isHot ? C.opt : undefined} />
          </g>
        );
      })}
      {/* search path highlight */}
      {search > 0 && search < 1.05 && (
        <g opacity={win(search, 0, 1.05, 0.15)}>
          <path d="M 1420 380 L 1645 450 M 1645 508 L 1699 590" stroke={C.opt} strokeWidth={7} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, search * 1.2)} opacity={0.9} />
          <rect x={1370} y={700} width={300} height={56} rx={28} fill={C.opt} opacity={0.18} stroke={C.opt} strokeWidth={3} />
          <EN x={1520} y={737} size={24} fill={C.opt} weight={600}>⚡ lookup: 0.001 s</EN>
        </g>
      )}

      {/* captions */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={985} left="NOT NULL" right="Mandatory Data Presence" leftColor={C.client} rightColor={C.text} size={36} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={985} left="UNIQUE Constraint" right="Auto-Creates B-Tree Index Under the Hood" leftColor={C.db} rightColor={C.text} size={32} />
      </g>
    </g>
  );
};
