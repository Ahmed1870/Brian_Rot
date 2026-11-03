import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ORDERS, statusColor} from '../data';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, clamp, lerp, pop, prog, sec} from '../kit';

// SC03 (global 86.5-132.5s): the modern PostgreSQL FILTER clause vs the verbose CASE WHEN, then the "internal gate" pipeline.
// Anchors (s): 88.3 verbose CASE WHEN | 92.6 PostgreSQL standard | 98.1 "FILTER!" | 99.4 simplify | 104.8 SUM FILTER | 108.9 COUNT FILTER
// 112.6 easier to read | 115.5 engine applies the filter | 119.1 internal gate | 121.6 before the aggregate call | 124.4 efficiency
const S = START.s3;
const t = (g: number) => sec(g - S);

const OLD = ["SUM(CASE WHEN status = 'Completed'", '    THEN total_amount', '    ELSE 0 END) AS completed_sales,', "COUNT(CASE WHEN status = 'Cancelled'", '    THEN 1 END) AS cancelled_count'];
const NEW = ['SUM(total_amount)', "  FILTER (WHERE status = 'Completed')", '  AS completed_sales,', "COUNT(*) FILTER (WHERE status = 'Cancelled')", '  AS cancelled_count'];

// pipeline
const PIPE_Y = 520;
const GATE_X = 880;
const CHIP_W = 236;
const SPAWN0 = 116.3;
const SPAWN_GAP = 0.85;
const SEC_TO_GATE = 1.5;
const SEC_TO_ENGINE = 1.1;

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const ph1 = 1 - prog(f, t(114.4), 14);
  const ph2 = prog(f, t(115.0), 16);

  // ---- phase 1 helpers
  const oldIn = prog(f, t(88.3), 20);
  const stdChip = pop(f, t(92.6));
  const bigWord = pop(f, t(98.07)) * (1 - prog(f, t(99.3), 8));
  const tpl = pop(f, t(99.44));
  const newIn = prog(f, t(99.6), 20);
  const readable = prog(f, t(112.6), 20);

  // ---- phase 2 helpers
  const gateIn = pop(f, t(115.5));
  let engine = 0;
  let blocked = 0;
  let open = 0;
  const chips = ORDERS.map((o, i) => {
    const e = (f - t(SPAWN0 + i * SPAWN_GAP)) / 30; // seconds since spawn
    if (e < 0) return null;
    const comp = o.status === 'Completed';
    let X = lerp(60, 620, clamp(e / SEC_TO_GATE));
    let y = 0;
    let op = 1;
    let sc = 1;
    let flash = 0;
    if (comp) {
      if (e > SEC_TO_GATE) X = lerp(620, 1100, clamp((e - SEC_TO_GATE) / SEC_TO_ENGINE));
      const absorbT = SEC_TO_GATE + SEC_TO_ENGINE;
      if (e > absorbT) {
        op = 1 - clamp((e - absorbT) / 0.3);
        sc = 1 - 0.4 * clamp((e - absorbT) / 0.3);
        engine += o.amount;
      }
      open = Math.max(open, clamp(1 - Math.abs(X - 640) / 240));
    } else if (e > SEC_TO_GATE) {
      flash = e < SEC_TO_GATE + 0.35 ? 1 : 0;
      const fall = clamp((e - SEC_TO_GATE - 0.35) / 0.7);
      y = 150 * fall;
      op = 1 - fall;
      blocked += 1;
    }
    if (op <= 0.01) return null;
    const col = statusColor(o.status);
    return (
      <div key={o.id} dir="ltr" style={{position: 'absolute', left: X, top: PIPE_Y - 32 + y, width: CHIP_W, height: 64, borderRadius: 14, background: flash ? `${C.red}33` : C.card, border: `2px solid ${flash ? C.red : col}`, boxShadow: comp && X > 620 ? `0 0 22px ${C.green}77` : 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontFamily: MONO, fontSize: 19, color: C.text, opacity: op, transform: `scale(${sc})`}}>
        <span style={{color: C.muted}}>#{o.id}</span>
        <span style={{color: col, fontWeight: 700}}>{o.status}</span>
        <span style={{marginLeft: 'auto'}}>{o.amount}</span>
      </div>
    );
  });
  const gap = 12 + 100 * open;
  const gatePulse = prog(f, t(119.13), 10) * (1 - prog(f, t(121), 20));
  const arrowPulse = prog(f, t(121.55), 10) * (1 - prog(f, t(123.5), 20));
  const ansi = pop(f, t(124.4));

  return (
    <Stage dur={1380} inFx="up" outFx="left">
      <TopBadge text="عبارة FILTER · الأنيقة في PostgreSQL" from={t(88.6)} to={t(106)} color={C.blue} />

      {/* ================= phase 1: verbose vs clean */}
      <div style={{opacity: ph1}}>
        <div style={{position: 'absolute', left: 90, top: 215, opacity: oldIn}}>
          <Chip color={C.red} style={{fontSize: 24}}>
            <Mix>الأسلوب القديم</Mix> · CASE WHEN
          </Chip>
        </div>
        <Editor x={90} y={330} w={870} h={320} title="old_style.sql" lines={OLD} start={t(88.5)} cps={0.95} size={23} accent={C.red} opacity={oldIn * (1 - 0.55 * readable)} />

        <div style={{position: 'absolute', left: 990, top: 215, opacity: clamp(stdChip)}}>
          <Chip color={C.blue} style={{fontSize: 24}}>PostgreSQL 16 · SQL Standard</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 990, top: 262, fontFamily: MONO, fontSize: 70, fontWeight: 700, color: C.blue, textShadow: `0 0 30px ${C.blue}`, opacity: clamp(bigWord), transform: `scale(${0.8 + 0.2 * clamp(bigWord)})`, transformOrigin: 'left center'}}>FILTER</div>
        <div dir="ltr" style={{position: 'absolute', left: 990, top: 268, display: 'flex', gap: 14, opacity: clamp(tpl), transform: `translateY(${(1 - clamp(tpl)) * 16}px)`}}>
          <Chip color={C.green} style={{fontSize: 24}}>SUM(…)</Chip>
          <Chip color={C.blue} style={{fontSize: 24, boxShadow: `0 0 22px ${C.blue}66`}}>FILTER</Chip>
          <Chip color={C.amber} style={{fontSize: 24}}>(WHERE …)</Chip>
        </div>
        <Editor x={990} y={330} w={840} h={320} title="filter_style.sql" lines={NEW} start={t(103.9)} cps={0.75} size={25} accent={C.blue} opacity={newIn} />

        <div dir="ltr" style={{position: 'absolute', left: 90, top: 690, width: 870, opacity: readable, transform: `translateY(${(1 - readable) * 20}px)`}}>
          <Chip color={C.red} style={{fontSize: 24}}>CASE داخل SUM ✗ · مكتظ</Chip>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 990, top: 690, width: 840, opacity: readable, transform: `translateY(${(1 - readable) * 20}px)`}}>
          <Chip color={C.green} style={{fontSize: 24}}>aggregate → FILTER ✓ · يُقرأ كجملة</Chip>
          <Mix style={{display: 'block', marginTop: 20, fontSize: 34, fontWeight: 700, color: C.text}}>أسهل في القراءة وأنظف في الكتابة</Mix>
        </div>
      </div>

      {/* ================= phase 2: the filter gate pipeline */}
      <div style={{opacity: ph2}}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 205, textAlign: 'center', fontFamily: MONO, fontSize: 34, color: C.text}}>
          SUM(total_amount) <span style={{color: C.blue, fontWeight: 700, textShadow: `0 0 18px ${C.blue}88`}}>FILTER</span> (WHERE status = <span style={{color: C.amber}}>'Completed'</span>)
        </div>

        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <line x1={40} y1={PIPE_Y} x2={1330} y2={PIPE_Y} stroke={C.border} strokeWidth={3} strokeDasharray="10 12" />
          <line x1={GATE_X + 14} y1={PIPE_Y} x2={1330} y2={PIPE_Y} stroke={C.green} strokeWidth={4} opacity={0.35 + 0.65 * arrowPulse} />
          <polygon points={`1316,${PIPE_Y - 14} 1344,${PIPE_Y} 1316,${PIPE_Y + 14}`} fill={C.green} opacity={0.5 + 0.5 * arrowPulse} />
          {/* gate bars */}
          <g opacity={clamp(gateIn)}>
            <rect x={GATE_X} y={PIPE_Y - 150} width={28} height={150 - gap / 2} rx={8} fill={C.blue} style={{filter: `drop-shadow(0 0 ${10 + 18 * gatePulse}px ${C.blue})`}} />
            <rect x={GATE_X} y={PIPE_Y + gap / 2} width={28} height={150 - gap / 2} rx={8} fill={C.blue} style={{filter: `drop-shadow(0 0 ${10 + 18 * gatePulse}px ${C.blue})`}} />
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 60, top: 372, opacity: clamp(gateIn)}}>
          <Chip color={C.muted} style={{fontSize: 20}}>orders ▸ rows stream</Chip>
        </div>
        <div style={{position: 'absolute', left: GATE_X - 190, top: 352 - 56, width: 408, textAlign: 'center', opacity: clamp(gateIn)}}>
          <Chip color={C.blue} style={{fontSize: 22, boxShadow: `0 0 ${26 * gatePulse}px ${C.blue}`}}>FILTER GATE</Chip>
          <div style={{marginTop: 8, opacity: 0.4 + 0.6 * gatePulse}}>
            <Mix style={{fontSize: 26, fontWeight: 700, color: C.text}}>البوابة الداخلية</Mix>
          </div>
        </div>

        {chips}

        {/* engine */}
        <div style={{position: 'absolute', left: 1330, top: PIPE_Y - 130, width: 460, height: 260, borderRadius: 24, background: C.deep, border: `2px solid ${C.green}`, boxShadow: `0 0 ${24 + 30 * arrowPulse}px ${C.green}44`, opacity: clamp(gateIn)}}>
          <div dir="ltr" style={{padding: '24px 30px'}}>
            <div style={{fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 700}}>SUM(total_amount)</div>
            <div style={{fontFamily: MONO, fontSize: 92, fontWeight: 700, lineHeight: 1.2, color: C.text}}>{engine}</div>
            <div style={{fontFamily: MONO, fontSize: 21, color: C.muted}}>completed_sales</div>
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: GATE_X - 130, top: 700, width: 288, textAlign: 'center', opacity: clamp(gateIn)}}>
          <Chip color={C.red} style={{fontSize: 22}}>filtered out ✗ {blocked}</Chip>
        </div>

        {/* ANSI / efficiency badge */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', gap: 24, opacity: clamp(ansi), transform: `scale(${0.92 + 0.08 * clamp(ansi)})`}}>
          <Chip color={C.blue} style={{fontSize: 28, padding: '10px 28px'}}>PostgreSQL · SQL Standard</Chip>
          <Chip color={C.green} style={{fontSize: 28, padding: '10px 28px'}}>
            <Mix>كود أنظف · تنفيذ أسرع</Mix>
          </Chip>
        </div>
      </div>

      <Caption text="SUM(total_amount) FILTER (WHERE status = 'Completed')" from={t(104.6)} to={t(113.6)} />
      <Caption text="PostgreSQL ANSI Standard ──► Cleaner Syntax & Optimized Engine Execution" from={t(121.8)} to={t(130.2)} />
    </Stage>
  );
};
