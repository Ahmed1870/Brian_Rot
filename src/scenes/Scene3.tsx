import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, clamp, lerp, pop, prog, sec} from '../kit';

// SC03 (frames 2550-3900, global 85-130s): a function on the column defeats a plain index; an expression index fixes it.
const S = 85;
const t = (g: number) => sec(g - S);
const Q = "WHERE LOWER(email) = 'admin@manzooma.com'";

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const ed = prog(f, t(86.4), 16);
  const swap = prog(f, t(102.2), 12);
  const flowA = prog(f, t(92.2), 24);
  const aArrow = prog(f, t(96.0), sec(2.2));
  const wrap = pop(f, t(99.5));
  const blocked = pop(f, t(100.7));
  const seq = pop(f, t(101.6));
  const flowB = prog(f, t(102.7), 24);
  const pre = prog(f, t(107.6), 24);
  const bArrow = prog(f, t(110.2), sec(1.2));
  const hit = pop(f, t(111.4));
  const logn = pop(f, t(113.4));
  const cpu = pop(f, t(116.2));
  const done = pop(f, t(124.0));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="فهارس التعبيرات | Expression Indexes" from={t(86.4)} to={t(100)} color={C.purple} />

      <div style={{opacity: 1 - swap}}>
        <Editor x={90} y={150} w={1250} h={130} title="plain_index.sql" lines={['CREATE INDEX idx_users_email ON users (email);']} start={t(86.6)} cps={1.4} size={26} accent={C.border} opacity={ed} />
      </div>
      <div style={{opacity: swap, position: 'absolute', inset: 0}}>
        <Editor x={90} y={150} w={1250} h={130} title="expression_index.sql" lines={['CREATE INDEX idx_users_lower_email ON users (LOWER(email));']} start={t(102.8)} cps={1.2} size={26} accent={C.purple} />
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {/* flow A: plain index ignored */}
        <g opacity={flowA}>
          <rect x={90} y={320} width={1740} height={260} rx={26} fill={C.card} stroke={blocked > 0.3 ? C.red : C.border} strokeWidth={2} />
          <text x={120} y={362} fontFamily={MONO} fontSize={22} fontWeight={700} fill={C.red}>plain index on (email)</text>
          <rect x={120} y={400} width={640} height={70} rx={14} fill={C.deep} stroke={C.border} strokeWidth={2} />
          <text x={140} y={444} fontFamily={MONO} fontSize={24} fill={C.text}>{Q}</text>
          <line x1={760} y1={435} x2={760 + 150 * aArrow} y2={435} stroke={C.muted} strokeWidth={5} strokeDasharray="10 8" />
          <rect x={930} y={395} width={300} height={80} rx={14} fill={C.deep} stroke={blocked > 0.3 ? C.red : C.blue} strokeWidth={3} />
          <text x={1080} y={443} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.blue}>idx_users_email</text>
          <g opacity={clamp(wrap)}>
            <rect x={820} y={500} width={170} height={44} rx={10} fill={`${C.amber}26`} stroke={C.amber} strokeWidth={2} />
            <text x={905} y={530} textAnchor="middle" fontFamily={MONO} fontSize={20} fontWeight={700} fill={C.amber}>LOWER(email)</text>
            <text x={1010} y={530} fontFamily={MONO} fontSize={19} fill={C.muted}>≠ stored values</text>
          </g>
          <g opacity={clamp(blocked)} stroke={C.red} strokeWidth={9} strokeLinecap="round">
            <line x1={1040} y1={415} x2={1120} y2={455} />
            <line x1={1120} y1={415} x2={1040} y2={455} />
          </g>
          <line x1={1230} y1={435} x2={1330} y2={435} stroke={C.red} strokeWidth={5} opacity={clamp(seq)} />
          <rect x={1330} y={395} width={460} height={80} rx={14} fill={`${C.red}1F`} stroke={C.red} strokeWidth={3} opacity={clamp(seq)} />
          <text x={1560} y={445} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.red} opacity={clamp(seq)}>Sequential Scan ✕</text>
        </g>

        {/* flow B: expression index */}
        <g opacity={flowB}>
          <rect x={90} y={620} width={1740} height={260} rx={26} fill={C.card} stroke={hit > 0.3 ? C.green : C.border} strokeWidth={2} />
          <text x={120} y={662} fontFamily={MONO} fontSize={22} fontWeight={700} fill={C.purple}>expression index on (LOWER(email))</text>
          <rect x={120} y={700} width={640} height={70} rx={14} fill={C.deep} stroke={C.border} strokeWidth={2} />
          <text x={140} y={744} fontFamily={MONO} fontSize={24} fill={C.text}>{Q}</text>
          <line x1={760} y1={735} x2={760 + 150 * bArrow} y2={735} stroke={C.green} strokeWidth={6} />
          <rect x={930} y={680} width={300} height={110} rx={14} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} style={{filter: hit > 0.3 ? `drop-shadow(0 0 ${12 * glow}px ${C.green})` : 'none'}} />
          <text x={1080} y={712} textAnchor="middle" fontFamily={MONO} fontSize={19} fill={C.purple}>idx_users_lower_email</text>
          {['admin@manzooma.com', 'sara@mail.com'].map((v, i) => (
            <text key={v} x={1080} y={744 + i * 28} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={C.text} opacity={pre}>{v}</text>
          ))}
          <line x1={1230} y1={735} x2={1330} y2={735} stroke={C.green} strokeWidth={6} opacity={clamp(hit)} />
          <rect x={1330} y={695} width={460} height={80} rx={14} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} opacity={clamp(hit)} />
          <text x={1560} y={745} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.green} opacity={clamp(hit)}>Index Scan ✓</text>
        </g>
      </svg>

      <div dir="ltr" style={{position: 'absolute', left: 1360, top: 150, display: 'flex', flexDirection: 'column', gap: 14, width: 470}}>
        <div style={{transform: `scale(${clamp(pre)})`, opacity: clamp(pre), transformOrigin: 'left center'}}><Chip color={C.purple} style={{fontSize: 22}}>value pre-computed & indexed</Chip></div>
        <div style={{transform: `scale(${clamp(logn)})`, opacity: clamp(logn), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 24, background: `${C.green}26`}}>O(log n)</Chip></div>
        <div style={{transform: `scale(${clamp(cpu)})`, opacity: clamp(cpu), transformOrigin: 'left center'}}><Chip color={C.amber} style={{fontSize: 20}}>small CPU cost on INSERT / UPDATE</Chip></div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 893, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: clamp(done)}}>
        <Check p={clamp(done)} size={34} />
        <Mix style={{fontSize: 26, fontWeight: 700, color: C.green}}>الدالة اتحسبت مسبقاً… فالبحث بيضرب الفهرس مباشرة</Mix>
      </div>

      <Caption text="CREATE INDEX ON users (LOWER(email)) ──► Pre-computes & Indexes Expressions" from={t(103.0)} to={t(111)} />
      <Caption text="Speed Upgrade ──► Converts Function Sequential Scans to O(log n) Index Scan" from={t(111.6)} to={t(127.6)} />
    </Stage>
  );
};
