import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Mix, Sql, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec, typed} from '../kit';

// SC01 (frames 0-1230, global 0-41s): DML writes to Shared Buffers + WAL before the disk.
const t = (g: number) => sec(g);
const COLX = [100, 570, 1040, 1510];
const COLW = 340;
const TOP = 210;
const COLH = 470;
const MID = TOP + COLH / 2;

const Header: React.FC<{i: number; n: string; sub: string; color: string; p: number}> = ({i, n, sub, color, p}) => (
  <div dir="ltr" style={{position: 'absolute', left: COLX[i], top: 150, width: COLW, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
    <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color}}>{n}</div>
    <div style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginTop: 2}}>{sub}</div>
  </div>
);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const p0 = prog(f, t(4.3), 22);
  const p1 = prog(f, t(5.4), 22);
  const p2 = prog(f, t(6.5), 22);
  const p3 = prog(f, t(7.6), 22);
  const chips = [pop(f, t(13.4)), pop(f, t(14.6)), pop(f, t(16.0))];
  const code = ['UPDATE products', 'SET unit_price = 120', 'WHERE product_id = 7;'];
  const typedCode = typed(code.join('\n'), f, t(20.2), 0.55).split('\n');
  const blocked = prog(f, t(22.1), 18);
  const ramPulse = prog(f, t(23.7), sec(1.3));
  const ramHit = pop(f, t(24.9));
  const walPulse = prog(f, t(26.3), sec(1.5));
  const walRec = pop(f, t(27.8));
  const walName = prog(f, t(28.9), 20);
  const laser = prog(f, t(26.6), sec(1.6));
  const shield = pop(f, t(33.8));
  const outage = f >= t(36.4) && f < t(37.8);
  const recovered = pop(f, t(37.9));
  const pulse = 0.5 + 0.5 * Math.sin(f / 8);

  const flowDot = (a: number, b: number, p: number, color: string) =>
    p > 0 && p < 1 ? (
      <g>
        <circle cx={lerp(a, b, p)} cy={MID} r={22} fill={color} opacity={0.22} />
        <circle cx={lerp(a, b, p)} cy={MID} r={9} fill={color} />
      </g>
    ) : null;

  return (
    <Stage dur={1230} inFx="none" outFx="zoom">
      <TopBadge text="لغة معالجة البيانات | DML (Data Manipulation Language)" from={t(2)} to={t(18)} />

      <Header i={0} n="1 · DML Editor" sub="INSERT · UPDATE · DELETE" color={C.text} p={p0} />
      <Header i={1} n="2 · Shared Buffers" sub="RAM — fast, volatile" color={C.blue} p={p1} />
      <Header i={2} n="3 · Write-Ahead Log" sub="WAL — durable record" color={C.amber} p={p2} />
      <Header i={3} n="4 · Data Files" sub="Disk — written later" color={C.muted} p={p3} />

      {/* 1 · editor */}
      <Win x={COLX[0]} y={TOP} w={COLW} h={COLH} title="DML Editor" accent={C.border} opacity={p0}>
        <div dir="ltr" style={{position: 'absolute', inset: 0, background: C.deep, padding: 22, fontFamily: MONO, fontSize: 20}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24}}>
            {['INSERT', 'UPDATE', 'DELETE'].map((c, i) => (
              <div key={c} style={{transform: `scale(${chips[i]})`, transformOrigin: 'left center', opacity: clamp(chips[i])}}>
                <Chip color={i === 0 ? C.blue : i === 1 ? C.amber : C.red}>{c}</Chip>
              </div>
            ))}
          </div>
          {typedCode.map((l, i) => (
            <div key={i} style={{whiteSpace: 'pre', minHeight: 32}}>
              <Sql text={l} />
            </div>
          ))}
        </div>
      </Win>

      {/* 2 · RAM */}
      <div style={{position: 'absolute', left: COLX[1], top: TOP, width: COLW, height: COLH, borderRadius: 22, background: C.card, border: `2px solid ${ramHit > 0.5 ? C.blue : C.border}`, boxShadow: `0 26px 70px rgba(2,6,23,.55), 0 0 ${40 * ramHit * pulse}px ${C.blue}33`, opacity: p1}}>
        <div style={{position: 'absolute', left: 30, top: 34, display: 'grid', gridTemplateColumns: 'repeat(3, 84px)', gap: 18}}>
          {Array.from({length: 12}).map((_, i) => {
            const hot = i === 7;
            return (
              <div key={i} dir="ltr" style={{height: 84, borderRadius: 14, background: hot && ramHit > 0.4 ? `${C.blue}44` : C.deep, border: `2px solid ${hot && ramHit > 0.4 ? C.blue : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 17, color: hot ? C.blue : '#475569', transform: hot ? `scale(${1 + 0.08 * ramHit})` : 'none'}}>
                {hot && ramHit > 0.4 ? '120' : `p${i}`}
              </div>
            );
          })}
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 30, bottom: 34, opacity: clamp(ramHit)}}>
          <Chip color={C.blue}>dirty page</Chip>
        </div>
      </div>

      {/* 3 · WAL */}
      <div style={{position: 'absolute', left: COLX[2], top: TOP, width: COLW, height: COLH, borderRadius: 22, background: C.card, border: `2px solid ${walRec > 0.4 ? C.amber : C.border}`, boxShadow: `0 26px 70px rgba(2,6,23,.55), 0 0 ${40 * walRec * pulse}px ${C.amber}44`, opacity: p2, overflow: 'hidden'}}>
        <div dir="ltr" style={{padding: '34px 26px', fontFamily: MONO, fontSize: 19, color: C.muted}}>
          {['0/16B3A00 · INSERT', '0/16B3A28 · UPDATE', '0/16B3A50 · COMMIT'].map((l, i) => (
            <div key={l} style={{height: 54, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', opacity: 0.5}}>{l}</div>
          ))}
          <div style={{height: 64, marginTop: 10, borderRadius: 12, background: `${C.amber}${walRec > 0.3 ? '2A' : '00'}`, border: `2px solid ${walRec > 0.3 ? C.amber : 'transparent'}`, display: 'flex', alignItems: 'center', padding: '0 12px', color: C.amber, fontWeight: 700, opacity: clamp(walRec), transform: `translateX(${(1 - clamp(walRec)) * -30}px)`}}>0/16B3A78 · UPDATE ✓</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150 + laser * 250, height: 5, background: C.amber, boxShadow: `0 0 20px ${C.amber}`, opacity: laser > 0 && laser < 1 ? 1 : 0}} />
        <div dir="ltr" style={{position: 'absolute', left: 26, bottom: 30, opacity: walName}}>
          <Chip color={C.amber}>fsync · durable</Chip>
        </div>
      </div>

      {/* 4 · disk */}
      <div style={{position: 'absolute', left: COLX[3], top: TOP, width: COLW, height: COLH, borderRadius: 22, background: C.card, border: `2px dashed ${C.border}`, opacity: p3 * 0.8}}>
        <svg width={COLW} height={COLH}>
          <g transform="translate(170 210)" opacity={0.55}>
            <ellipse cx={0} cy={80} rx={96} ry={26} fill="#334155" />
            <rect x={-96} y={-60} width={192} height={140} fill="#475569" />
            <ellipse cx={0} cy={-60} rx={96} ry={26} fill="#64748B" />
          </g>
          <text x={COLW / 2} y={380} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={C.muted}>checkpoint later</text>
        </svg>
      </div>

      {/* flow arrows */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1].map((i) => (
          <line key={i} x1={COLX[i] + COLW + 10} x2={COLX[i + 1] - 10} y1={MID} y2={MID} stroke={i === 0 ? C.blue : C.amber} strokeWidth={5} strokeDasharray="12 10" opacity={prog(f, t(5.4 + i * 1.1), 20) * 0.7} />
        ))}
        <line x1={COLX[2] + COLW + 10} x2={COLX[3] - 10} y1={MID} y2={MID} stroke={C.muted} strokeWidth={5} strokeDasharray="4 12" opacity={blocked * 0.8} />
        <g opacity={blocked}>
          <circle cx={(COLX[2] + COLW + COLX[3]) / 2} cy={MID} r={26} fill={C.bg} stroke={C.red} strokeWidth={4} />
          <g stroke={C.red} strokeWidth={6} strokeLinecap="round">
            <line x1={(COLX[2] + COLW + COLX[3]) / 2 - 11} y1={MID - 11} x2={(COLX[2] + COLW + COLX[3]) / 2 + 11} y2={MID + 11} />
            <line x1={(COLX[2] + COLW + COLX[3]) / 2 + 11} y1={MID - 11} x2={(COLX[2] + COLW + COLX[3]) / 2 - 11} y2={MID + 11} />
          </g>
        </g>
        {flowDot(COLX[0] + COLW, COLX[1], ramPulse, C.blue)}
        {flowDot(COLX[1] + COLW, COLX[2], walPulse, C.amber)}
      </svg>

      {/* durability shield */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 730, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 36, opacity: clamp(shield), transform: `scale(${0.85 + 0.15 * clamp(shield)})`}}>
        <svg width={92} height={104} viewBox="0 0 80 92">
          <path d="M40 4 L74 18 V46 C74 66 58 80 40 88 C22 80 6 66 6 46 V18 Z" fill={`${C.green}22`} stroke={C.green} strokeWidth={5} />
          <polyline points="26,46 36,57 56,34" fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <Mix style={{fontSize: 44, fontWeight: 700, color: C.text, display: 'block'}}>سلامة المعاملات حتى لو انقطع التيار</Mix>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 24, color: C.green, marginTop: 4, opacity: clamp(recovered)}}>✓ Recovered by replaying the WAL</div>
        </div>
      </div>

      {/* power outage flicker */}
      {outage && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 130, height: 590, background: 'rgba(2,6,23,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={120} height={150} viewBox="0 0 60 80">
            <polygon points="36,2 10,46 28,46 22,78 52,32 33,32" fill={C.amber} />
          </svg>
        </div>
      )}

      <Caption text="DML Execution ──► Shared Buffers (RAM) ──► Write-Ahead Log (WAL)" from={t(22)} to={t(38)} />
    </Stage>
  );
};
