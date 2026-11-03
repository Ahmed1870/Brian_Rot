import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC05 (frames 5036-6339, global 167.9-211.3s): High OFFSET trap vs Keyset (seek) pagination. Numbers are illustrative.
const S = 167.85;
const t = (g: number) => sec(g - S);
const COLS = 20;
const ROWS = 9;

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const left = prog(f, t(169.4), 24);
  const reads = prog(f, t(178.4), sec(6.1));
  const dump = prog(f, t(184.9), sec(2.4));
  const strain = prog(f, t(187.8), 20);
  const right = prog(f, t(191.8), 24);
  const seek = prog(f, t(204.9), sec(1.2));
  const instant = pop(f, t(207.4));
  const cmp = prog(f, t(209.2), 24);
  const count = Math.round(lerp(0, 100000, reads));
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  const shake = f >= t(187.8) && f < t(190.8) ? Math.sin(f * 2.2) * 5 : 0;
  const lit = Math.floor(reads * COLS * ROWS);

  return (
    <Stage dur={1303} inFx="zoom" outFx="down">
      <TopBadge text="فخ الـ High OFFSET | Pagination at Scale" from={t(169.4)} to={t(176)} color={C.red} />

      {/* LEFT: OFFSET trap */}
      <Win x={90} y={150} w={840} h={750} title="OFFSET 100000 · the trap" accent={C.red} opacity={left}>
        <div style={{transform: `translateX(${shake}px)`}}>
          <div dir="ltr" style={{margin: '16px 24px 0 24px', background: C.deep, borderRadius: 14, padding: '10px 18px', fontFamily: MONO, fontSize: 21, color: C.text, minHeight: 90}}>
            <div><span style={{color: C.blue, fontWeight: 700}}>ORDER BY</span> order_id <span style={{color: C.blue, fontWeight: 700}}>DESC</span></div>
            <div><span style={{color: C.blue, fontWeight: 700}}>LIMIT</span> <span style={{color: C.green}}>10</span> <span style={{color: C.blue, fontWeight: 700}}>OFFSET</span> <span style={{color: C.green}}>100000</span>;</div>
          </div>

          {/* rows read grid */}
          <div style={{position: 'absolute', left: 30, top: 150, width: 780}}>
            <div style={{display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 5}}>
              {Array.from({length: COLS * ROWS}).map((_, i) => {
                const readNow = i < lit;
                const keep = i >= COLS * ROWS - 10;
                const gone = dump > 0.2 && !keep;
                return <div key={i} style={{height: 28, borderRadius: 5, background: gone ? '#1E293B' : keep && dump > 0.8 ? C.green : readNow ? C.red : C.deep, opacity: gone ? 0.25 : readNow ? 0.9 : 0.6, transform: gone ? `translateY(${dump * 18}px) scale(${1 - dump * 0.4})` : 'none'}} />;
              })}
            </div>
          </div>

          <div dir="ltr" style={{position: 'absolute', left: 30, top: 440, width: 780, fontFamily: MONO}}>
            <div style={{fontSize: 22, color: C.muted}}>rows read & scanned</div>
            <div style={{fontSize: 76, fontWeight: 700, color: C.red, lineHeight: 1.1}}>{count.toLocaleString('en-US')}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, opacity: dump}}>
              <svg width={44} height={52} viewBox="0 0 44 52"><path d="M8 14 H36 L33 50 H11 Z" fill="none" stroke={C.red} strokeWidth={4} strokeLinejoin="round" /><line x1={4} y1={10} x2={40} y2={10} stroke={C.red} strokeWidth={4} strokeLinecap="round" /><line x1={16} y1={4} x2={28} y2={4} stroke={C.red} strokeWidth={4} strokeLinecap="round" /></svg>
              <span style={{fontSize: 24, color: C.red}}>99,990 rows thrown away</span>
            </div>
          </div>

          {/* strain meters */}
          <div dir="ltr" style={{position: 'absolute', left: 30, top: 640, width: 780, opacity: strain}}>
            {[
              {n: 'Disk I/O', c: C.red},
              {n: 'RAM', c: C.red},
            ].map((m, i) => (
              <div key={m.n} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12, fontFamily: MONO, fontSize: 21, color: C.muted}}>
                <span style={{width: 110}}>{m.n}</span>
                <div style={{flex: 1, height: 18, borderRadius: 9, background: C.deep, overflow: 'hidden'}}>
                  <div style={{width: `${(88 + 8 * pulse) * strain}%`, height: '100%', background: m.c}} />
                </div>
              </div>
            ))}
            <div style={{fontFamily: MONO, fontSize: 24, color: C.red, fontWeight: 700}}>≈ 2.4 s · slow I/O ✕</div>
          </div>
        </div>
      </Win>

      {/* RIGHT: keyset pagination */}
      <Win x={990} y={150} w={840} h={750} title="Keyset Pagination · seek method" accent={C.green} opacity={lerp(0.35, 1, right)}>
      </Win>
      <div dir="ltr" style={{position: 'absolute', left: 1014, top: 222, width: 792, opacity: right}}>
        <div style={{background: C.deep, borderRadius: 14, padding: '10px 18px', fontFamily: MONO, fontSize: 21, color: C.text, minHeight: 120}}>
          {(() => {
            const full = ['WHERE order_id < last_seen_id', 'ORDER BY order_id DESC', 'LIMIT 10;'];
            const joined = full.join('\n');
            const n = Math.floor(clamp((f - t(198.8)) * 0.9, 0, joined.length));
            const vis = joined.slice(0, n).split('\n');
            return full.map((_, i) => (
              <div key={i} style={{whiteSpace: 'pre', minHeight: 30}}>
                {(vis[i] ?? '').split(/(WHERE|ORDER BY|DESC|LIMIT|10)/).map((p, k) => (
                  <span key={k} style={{color: /^(WHERE|ORDER BY|DESC|LIMIT)$/.test(p) ? C.blue : p === '10' ? C.green : C.text, fontWeight: /^(WHERE|ORDER BY|DESC|LIMIT)$/.test(p) ? 700 : 400}}>{p}</span>
                ))}
              </div>
            ));
          })()}
        </div>
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: right}}>
        {/* index tree */}
        <g transform="translate(1020 400)">
          <rect x={280} y={0} width={140} height={52} rx={12} fill={C.deep} stroke={C.green} strokeWidth={3} />
          <text x={350} y={34} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={C.green}>B-Tree</text>
          {[60, 280, 500].map((x, i) => (
            <g key={x}>
              <line x1={350} y1={52} x2={x + 70} y2={140} stroke={C.green} strokeWidth={3} opacity={0.6} />
              <rect x={x} y={140} width={140} height={56} rx={12} fill={C.deep} stroke={i === 1 && seek > 0.5 ? C.green : C.border} strokeWidth={3} />
              <text x={x + 70} y={176} textAnchor="middle" fontFamily={MONO} fontSize={18} fill={i === 1 && seek > 0.5 ? C.green : C.muted}>{['…', 'last_seen_id', '…'][i]}</text>
            </g>
          ))}
          {/* laser seek */}
          <line x1={350} y1={52} x2={lerp(350, 350, seek)} y2={lerp(52, 140, seek)} stroke={C.green} strokeWidth={8} strokeLinecap="round" opacity={seek > 0 && seek < 1 ? 1 : 0} />
          <circle cx={350} cy={lerp(52, 140, seek)} r={14} fill={C.green} opacity={seek > 0 && seek < 1 ? 1 : 0} />
        </g>
        {/* 10 result rows */}
        {Array.from({length: 10}).map((_, i) => {
          const p = clamp(pop(f, t(205.8) + i * 2));
          return <rect key={i} x={1040 + i * 76} y={680} width={66} height={46} rx={10} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} opacity={p} />;
        })}
      </svg>

      <div dir="ltr" style={{position: 'absolute', left: 1014, top: 750, width: 792, display: 'flex', alignItems: 'center', gap: 22, opacity: clamp(instant), transform: `scale(${0.85 + 0.15 * clamp(instant)})`, transformOrigin: 'left center'}}>
        <Check p={clamp(instant)} size={50} />
        <span style={{fontFamily: MONO, fontSize: 64, fontWeight: 700, color: C.green}}>0.001 s</span>
        <span style={{fontFamily: MONO, fontSize: 22, color: C.muted}}>instant seek</span>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 1014, top: 840, width: 792, opacity: cmp}}>
        <Chip color={C.green} style={{fontSize: 22}}>vs ≈ 2.4 s with OFFSET 100000 (illustrative)</Chip>
      </div>

      <Caption text="High OFFSET Trap ──► Engine Reads & Drops 100,000 Rows (Slow I/O)" from={t(175.6)} to={t(190)} />
      <Caption text="Keyset Pagination (Seek Method) ──► WHERE id < last_id (Instant)" from={t(199)} to={t(210.5)} />
    </Stage>
  );
};
