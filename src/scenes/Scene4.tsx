import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, clamp, lerp, pop, prog, sec} from '../kit';

// SC04 (frames 3900-5100, global 130-170s): the optimizer needs an exact expression match; maintenance_work_mem builds indexes.
const S = 130;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const panels = prog(f, t(131.4), 26);
  const node = prog(f, t(133.0), 20);
  const q1 = prog(f, t(134.9), 20);
  const link1 = prog(f, t(136.4), sec(2.0));
  const ok1 = pop(f, t(138.6));
  const q2 = prog(f, t(142.5), 20);
  const link2 = prog(f, t(143.6), sec(1.6));
  const brk = pop(f, t(145.4));
  const seq = pop(f, t(147.0));
  const exact = pop(f, t(150.6));
  const mem = prog(f, t(155.1), 24);
  const buf = prog(f, t(156.0), sec(4.6));
  const build = prog(f, t(158.5), sec(5.0));
  const bg = pop(f, t(164.7));
  const calm = pop(f, t(166.4));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  return (
    <Stage dur={1200} inFx="up" outFx="zoom">
      <TopBadge text="كواليس PostgreSQL 16 | Optimizer & maintenance_work_mem" from={t(131.4)} to={t(146)} color={C.blue} />

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={90} y={170} width={840} height={710} rx={26} fill={C.card} stroke={brk > 0.3 ? C.red : link1 > 0.9 ? C.green : C.border} strokeWidth={2} opacity={panels} />
        <rect x={990} y={170} width={840} height={710} rx={26} fill={C.card} stroke={mem > 0.3 ? C.blue : C.border} strokeWidth={2} opacity={panels} />

        {/* index definition */}
        <g opacity={node}>
          <rect x={290} y={220} width={440} height={80} rx={16} fill={`${C.purple}26`} stroke={C.purple} strokeWidth={4} />
          <text x={510} y={254} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={C.muted}>index definition</text>
          <text x={510} y={284} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.purple}>LOWER(email)</text>
        </g>

        {/* query 1: exact match */}
        <g opacity={q1}>
          <rect x={130} y={450} width={360} height={80} rx={14} fill={C.deep} stroke={C.border} strokeWidth={2} />
          <text x={310} y={500} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.text}>WHERE LOWER(email)</text>
          <line x1={420} y1={450} x2={420 + (510 - 420) * link1 + 0} y2={450 - 150 * link1} stroke={C.green} strokeWidth={6} strokeLinecap="round" />
          <g opacity={clamp(ok1)}>
            <circle cx={470} cy={380} r={26} fill={`${C.green}22`} stroke={C.green} strokeWidth={4} />
            <polyline points="458,380 466,389 484,370" fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        {/* query 2: different function */}
        <g opacity={q2}>
          <rect x={540} y={450} width={360} height={80} rx={14} fill={C.deep} stroke={C.border} strokeWidth={2} />
          <text x={720} y={500} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.text}>WHERE UPPER(email)</text>
          <line x1={720} y1={450} x2={720 - 110 * link2} y2={450 - 100 * link2} stroke={C.red} strokeWidth={6} strokeDasharray="10 8" strokeLinecap="round" />
          <g opacity={clamp(brk)} stroke={C.red} strokeWidth={8} strokeLinecap="round">
            <line x1={600} y1={366} x2={640} y2={406} />
            <line x1={640} y1={366} x2={600} y2={406} />
          </g>
        </g>
        <g opacity={clamp(seq)}>
          <rect x={540} y={580} width={360} height={70} rx={14} fill={`${C.red}1F`} stroke={C.red} strokeWidth={3} />
          <text x={720} y={625} textAnchor="middle" fontFamily={MONO} fontSize={24} fontWeight={700} fill={C.red}>Seq Scan fallback</text>
        </g>

        {/* RIGHT: maintenance_work_mem */}
        <g opacity={mem}>
          <text x={1030} y={230} fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.blue}>maintenance_work_mem</text>
          <rect x={1030} y={260} width={760} height={90} rx={16} fill={C.deep} stroke={C.border} strokeWidth={2} />
          <rect x={1036} y={266} width={Math.max(4, 748 * buf)} height={78} rx={12} fill={`${C.blue}55`} stroke={C.blue} strokeWidth={3} />
          <text x={1410} y={316} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.text}>RAM buffer {Math.round(buf * 100)}%</text>

          <text x={1030} y={440} fontFamily={MONO} fontSize={24} fill={C.muted}>CREATE INDEX (branch_id, order_date, …)</text>
          <rect x={1030} y={466} width={760} height={46} rx={23} fill={C.deep} stroke={C.border} strokeWidth={2} />
          <rect x={1030} y={466} width={760 * build} height={46} rx={23} fill={C.blue} />
          <text x={1790} y={560} textAnchor="end" fontFamily={MONO} fontSize={22} fill={C.muted}>{Math.round(build * 100)}% built</text>
        </g>
      </svg>

      <div dir="ltr" style={{position: 'absolute', left: 130, top: 700, display: 'flex', flexDirection: 'column', gap: 14, width: 780}}>
        <div style={{transform: `scale(${clamp(exact)})`, opacity: clamp(exact), transformOrigin: 'left center'}}><Chip color={C.amber} style={{fontSize: 22}}>one different function = no match</Chip></div>
        <div style={{opacity: clamp(exact)}}><Mix style={{fontSize: 26, color: C.muted}}>الدقة البرمجية التامة لضمان تطابق الشفرات</Mix></div>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 1030, top: 640, display: 'flex', flexDirection: 'column', gap: 16, width: 780}}>
        <div style={{transform: `scale(${clamp(bg)})`, opacity: clamp(bg), transformOrigin: 'left center'}}><Chip color={C.blue} style={{fontSize: 24}}>background build</Chip></div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${clamp(calm)})`, opacity: clamp(calm), transformOrigin: 'left center'}}><Check p={clamp(calm)} size={40} /><Chip color={C.green} style={{fontSize: 22, background: `${C.green}26`, boxShadow: `0 0 ${14 * glow}px ${C.green}44`}}>server stays responsive</Chip></div>
      </div>

      <Caption text="Optimizer Requirement ──► Strict Literal Match of Expression Syntax" from={t(134.9)} to={t(151.8)} />
      <Caption text="Background Build ──► maintenance_work_mem Buffers Multi-Column Index Build" from={t(155.4)} to={t(168.4)} />
    </Stage>
  );
};
