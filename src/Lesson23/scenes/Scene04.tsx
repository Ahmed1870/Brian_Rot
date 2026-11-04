import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, CodeBlock } from '../../components/common';
import type { Tok } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s4;

const ROWS = ['c1  أحمد', 'c2  سارة', 'c3  خالد', 'c4  منى'];

const PNode: React.FC<{ x: number; y: number; w: number; label: string; sub?: string; color: string; k: number }> = ({ x, y, w, label, sub, color, k }) => (
  <g opacity={k} transform={`translate(${x} ${y + (1 - k) * 18})`}>
    <rect x={-w / 2} y={-34} width={w} height={sub ? 76 : 62} rx={16} fill={C.cardDeep} stroke={color} strokeWidth={4} />
    <EN x={0} y={sub ? -2 : 8} size={22} fill={color} weight={600}>{label}</EN>
    {sub && <EN x={0} y={28} size={16} fill={C.muted}>{sub}</EN>}
  </g>
);

export const Scene04: React.FC<{ t: number }> = ({ t }) => {
  const left = p(t, T.loopAt, 0.8);
  const plan = p(t, T.plannerAt, 0.7);
  const rw = lin(t, T.rewriteAt, 2.2);
  const node = (at: number) => p(t, at, 0.6);
  const term = p(t, T.termAt, 0.6);
  const kill = p(t, T.killAt, 0.6);
  const mem = p(t, T.memAt, 0.7);
  const sub = p(t, T.subAt, 0.6);
  const alt = Math.floor(t * 0.5) % 2;
  const spin = t * 50;

  return (
    <g>
      <Header t={t} a={T.loopAt} b={T.plannerAt + 0.5} ar="كواليس المحرك" en="Query Planner Optimization" y={105} color={C.client} />

      {/* logical: row-by-row loop */}
      <g opacity={left} transform={`translate(0 ${(1 - left) * 20})`}>
        <Card x={90} y={190} w={780} h={620} stroke={kill > 0 ? C.line : C.opt} glow={kill > 0 ? 0 : 0.4} r={24} />
        <EN x={120} y={236} size={24} anchor="start" fill={C.opt} weight={600}>logical plan · row-by-row</EN>
        <CodeBlock lines={[[['WHERE ', C.accent], ['EXISTS ', C.db], ['(…)', C.text]]]} x={120} y={290} size={30} />
        {ROWS.map((r, i) => {
          const a = (t * 0.9 + i * 0.25) % 1;
          return (
            <g key={i} transform={`translate(120 ${330 + i * 100})`}>
              <rect width={720} height={80} rx={16} fill={C.cardDeep} stroke={C.line} strokeWidth={2} />
              <AR x={150} y={52} size={30} anchor="start" fill={C.text}>{r.split('  ')[1]}</AR>
              <EN x={190} y={50} size={24} fill={C.muted}>{r.split('  ')[0]}</EN>
              <g transform={`translate(420 40) rotate(${spin + i * 90})`} opacity={1 - 0.7 * kill}>
                <path d="M -22 0 A 22 22 0 1 1 0 22" fill="none" stroke={C.opt} strokeWidth={6} strokeLinecap="round" />
                <path d="M 6 14 L 0 24 L -8 16" fill="none" stroke={C.opt} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <EN x={600} y={50} size={22} fill={C.opt}>{`scan orders ×6`}</EN>
              <rect x={0} y={0} width={720 * a} height={4} rx={2} fill={C.opt} opacity={0.7 * (1 - kill)} />
            </g>
          );
        })}
        <g opacity={kill}>
          <path d="M 140 350 L 840 710 M 840 350 L 140 710" stroke={C.accent} strokeWidth={10} strokeLinecap="round" opacity={0.75} />
          <rect x={250} y={742} width={500} height={50} rx={25} fill={C.accent} opacity={0.18} stroke={C.accent} strokeWidth={3} />
          <EN x={500} y={776} size={22} fill="#FCA5A5" weight={600}>mechanical loop overhead removed</EN>
        </g>
      </g>

      {/* planner gear + rewrite beam */}
      <g opacity={plan}>
        <g transform={`translate(960 480)`}>
          <circle r={56} fill={C.cardDeep} stroke={C.purple} strokeWidth={5} />
          <g transform={`rotate(${spin})`}>
            {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-7} y={-52} width={14} height={16} rx={3} fill={C.purple} transform={`rotate(${i * 45})`} />)}
            <circle r={22} fill="none" stroke={C.purple} strokeWidth={5} />
          </g>
        </g>
        <EN x={960} y={580} size={20} fill={C.purple} weight={600}>Query Planner</EN>
        <AR x={960} y={612} size={22} fill={C.muted}>إعادة كتابة تلقائية</AR>
      </g>
      {rw > 0 && (
        <g opacity={rw < 1 ? 1 : 0.35}>
          <path d="M 870 480 H 900 M 1020 480 H 1040" stroke={C.purple} strokeWidth={6} strokeLinecap="round" strokeDasharray="10 10" strokeDashoffset={-t * 90} />
        </g>
      )}

      {/* physical plan tree */}
      <g opacity={plan * 0.5 + 0.5 * node(T.rewriteAt)} >
        <Card x={1040} y={190} w={790} h={620} stroke={rw > 0 ? C.purple : C.line} glow={node(T.rewriteAt) * 0.6} r={24} />
        <EN x={1070} y={236} size={24} anchor="start" fill={C.purple} weight={600}>physical plan · hash join</EN>
      </g>
      <path d="M 1435 330 L 1260 410 M 1435 330 L 1610 410 M 1610 456 L 1610 520" stroke={C.purple} strokeWidth={4} fill="none" opacity={node(T.rewriteAt + 2)} />
      <PNode x={1435} y={296} w={300} label={alt && term > 0.5 ? 'Hash Anti Join' : 'Hash Semi Join'} sub={alt && term > 0.5 ? 'NOT EXISTS' : 'EXISTS'} color={C.purple} k={node(T.rewriteAt)} />
      <PNode x={1260} y={434} w={260} label="Seq Scan" sub="customers" color={C.client} k={node(T.rewriteAt + 2)} />
      <PNode x={1610} y={434} w={220} label="Hash" sub="in work_mem" color={C.purple} k={node(T.rewriteAt + 3.2)} />
      <PNode x={1610} y={556} w={300} label="Index Scan" sub="orders_customer_idx" color={C.client} k={node(T.rewriteAt + 4.6)} />

      {/* terms */}
      <g opacity={term}>
        <rect x={1070} y={660} width={350} height={46} rx={23} fill={C.purple} opacity={0.18} stroke={C.purple} strokeWidth={3} />
        <EN x={1245} y={692} size={20} fill={C.purple} weight={600}>EXISTS → Hash Semi-Join</EN>
        <rect x={1450} y={660} width={360} height={46} rx={23} fill={C.purple} opacity={0.18} stroke={C.purple} strokeWidth={3} />
        <EN x={1630} y={692} size={20} fill={C.purple} weight={600}>NOT EXISTS → Hash Anti-Join</EN>
      </g>

      {/* work_mem + index probing */}
      <g opacity={mem}>
        <rect x={1070} y={730} width={740} height={64} rx={16} fill={C.client} opacity={0.12} stroke={C.client} strokeWidth={3} />
        <EN x={1130} y={770} size={22} anchor="start" fill={C.client} weight={600}>work_mem</EN>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={1280 + i * 62} y={744} width={48} height={36} rx={8} fill={C.client} opacity={0.25 + 0.5 * (((t * 2 + i * 0.37) % 1) > 0.5 ? 1 : 0.2)} />
        ))}
        <EN x={1780} y={770} size={18} anchor="end" fill={C.client}>index probing</EN>
      </g>

      <g opacity={sub}>
        <rect x={470} y={846} width={980} height={78} rx={39} fill={C.client} opacity={0.14} stroke={C.client} strokeWidth={3} />
        <AR x={1380} y={898} size={32} anchor="start" fill={C.client}>أجزاء من المليثانية</AR>
        <EN x={820} y={896} size={28} fill={C.client} weight={600}>⚡ sub-millisecond existence check</EN>
      </g>

      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={985} left="Query Planner Optimization" right="Rewrites EXISTS Subqueries to Semi-Joins" leftColor={C.purple} rightColor={C.text} size={30} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={985} left="Index Probing & Hash Anti-Join" right="Eliminates Row-by-Row Overhead" leftColor={C.client} rightColor={C.text} size={30} />
      </g>
    </g>
  );
};
