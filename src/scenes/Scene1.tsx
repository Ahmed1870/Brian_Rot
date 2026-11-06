import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Stage, TopBadge, clamp, lerp, pop, prog, sec} from '../kit';

// SC01 (frames 0-1200): multi-column index fusion (left) vs expression index pipeline (right).
const t = (g: number) => sec(g);
const COLS = ['branch_id', 'order_date', 'status'];
const EMAILS = [
  {a: 'Ahmed@Mail.com', b: 'ahmed@mail.com'},
  {a: 'SARA@mail.com', b: 'sara@mail.com'},
  {a: 'Omar@Mail.COM', b: 'omar@mail.com'},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const panels = prog(f, t(3), 26);
  const expChip = pop(f, t(13.0));
  const mcChip = pop(f, t(16.4));
  const fuse = prog(f, t(19.6), sec(5.0));
  const tree = prog(f, t(24.8), 24);
  const exp = prog(f, t(28.0), 22);
  const piston = f >= t(28.4) ? Math.sin((f - t(28.4)) / 7) : 0;
  const out = (i: number) => prog(f, t(30.0) + i * 22, 20);
  const badge = pop(f, t(35.0));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  return (
    <Stage dur={1200} inFx="none" outFx="zoom">
      <TopBadge text="الفهارس المركبة والتعبيرية | Multi-Column & Expression Indexes" from={t(2)} to={t(18)} color={C.blue} />

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={90} y={180} width={840} height={620} rx={26} fill={C.card} stroke={fuse > 0.9 ? C.blue : C.border} strokeWidth={2} opacity={panels} />
        <rect x={990} y={180} width={840} height={620} rx={26} fill={C.card} stroke={exp > 0.5 ? C.purple : C.border} strokeWidth={2} opacity={panels} />

        {/* LEFT: three columns fuse into one composite B-tree */}
        {COLS.map((c, i) => {
          const startX = 150 + i * 250;
          const x = lerp(startX, 360, fuse);
          const y = lerp(300, 300 + i * 0, fuse);
          return (
            <g key={c} opacity={panels * (1 - 0.0 * fuse)}>
              <rect x={x} y={y + i * lerp(0, 0, fuse)} width={lerp(210, 330, fuse)} height={lerp(150, 64, fuse)} rx={14} fill={`${C.blue}${fuse > 0.9 ? '1A' : '33'}`} stroke={C.blue} strokeWidth={3} transform={`translate(0 ${fuse * i * 70 - fuse * 70})`} />
              <text x={x + lerp(105, 165, fuse)} y={y + lerp(86, 40, fuse) + (fuse * i * 70 - fuse * 70)} textAnchor="middle" fontFamily={MONO} fontSize={24} fontWeight={700} fill={C.blue}>{c}</text>
            </g>
          );
        })}
        <g opacity={tree}>
          <line x1={525} y1={470} x2={380} y2={600} stroke={C.blue} strokeWidth={3} />
          <line x1={525} y1={470} x2={525} y2={600} stroke={C.blue} strokeWidth={3} />
          <line x1={525} y1={470} x2={670} y2={600} stroke={C.blue} strokeWidth={3} />
          {[380, 525, 670].map((x) => (
            <rect key={x} x={x - 60} y={600} width={120} height={50} rx={10} fill={C.deep} stroke={C.blue} strokeWidth={2} />
          ))}
          <text x={525} y={700} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.muted}>(branch_id, order_date, status)</text>
        </g>

        {/* RIGHT: expression pipeline */}
        <g opacity={exp}>
          {EMAILS.map((e, i) => (
            <g key={i}>
              <text x={1030} y={290 + i * 90} fontFamily={MONO} fontSize={24} fill={C.muted}>{e.a}</text>
              <line x1={1330} y1={282 + i * 90} x2={1400} y2={282 + i * 90} stroke={C.border} strokeWidth={3} strokeDasharray="6 6" />
            </g>
          ))}
          <rect x={1400} y={250} width={150} height={290 + piston * 10} rx={16} fill={`${C.amber}26`} stroke={C.amber} strokeWidth={4} />
          <text x={1475} y={380} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.amber}>LOWER()</text>
          <rect x={1420} y={262 + (1 + piston) * 10} width={110} height={26} rx={8} fill={C.amber} opacity={0.8} />
        </g>
        {EMAILS.map((e, i) => (
          <g key={i} opacity={out(i)}>
            <line x1={1550} y1={282 + i * 90} x2={1600} y2={282 + i * 90} stroke={C.purple} strokeWidth={3} />
            <rect x={1600} y={258 + i * 90} width={210} height={46} rx={10} fill={`${C.purple}26`} stroke={C.purple} strokeWidth={2} />
            <text x={1705} y={288 + i * 90} textAnchor="middle" fontFamily={MONO} fontSize={19} fontWeight={700} fill={C.purple}>{e.b}</text>
          </g>
        ))}
        <text x={1410} y={700} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.muted} opacity={exp}>stored pre-computed in the index</text>
      </svg>

      <div dir="ltr" style={{position: 'absolute', left: 120, top: 205, transform: `scale(${clamp(mcChip)})`, opacity: clamp(mcChip), transformOrigin: 'left center'}}><Chip color={C.blue} style={{fontSize: 26}}>Multi-Column Index</Chip></div>
      <div dir="ltr" style={{position: 'absolute', left: 1020, top: 205, transform: `scale(${clamp(expChip)})`, opacity: clamp(expChip), transformOrigin: 'left center'}}><Chip color={C.purple} style={{fontSize: 26}}>Expression Index</Chip></div>

      <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: clamp(badge), transform: `scale(${0.9 + 0.1 * clamp(badge)})`}}>
        <Check p={clamp(badge)} size={44} />
        <Chip color={C.green} style={{fontSize: 28, background: `${C.green}26`, boxShadow: `0 0 ${20 * glow}px ${C.green}55`}}>Advanced Indexing Pipelines</Chip>
      </div>

      <Caption text="Multi-Column (col1, col2) | Expression Index (LOWER(column))" from={t(22)} to={t(38)} />
    </Stage>
  );
};
