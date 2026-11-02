import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC03 (frames 2550-3900, global 85-130s): the Data Directory and its two key config files.
const S = 85;
const t = (g: number) => sec(g - S);
const CW = 18; // monospace char width @30px
const LH = 54; // code line height
const CODE_X = 40;

const FILES = [
  {n: 'base/', d: true},
  {n: 'global/', d: true},
  {n: 'pg_wal/', d: true},
  {n: 'PG_VERSION', d: false},
  {n: 'postgresql.conf', d: false, key: 1},
  {n: 'pg_hba.conf', d: false, key: 2},
  {n: 'pg_ident.conf', d: false},
];

const CONF = [
  {c: '# - Memory -', mute: true},
  {c: 'shared_buffers = 128MB', hot: 1},
  {c: '# - Connections -', mute: true},
  {c: 'max_connections = 100', hot: 2},
  {c: "listen_addresses = 'localhost'", hot: 3},
  {c: 'port = 5432', hot: 3},
];

const col = (s: string, w: number) => s.padEnd(w, ' ');
const HBA = [
  {c: '# ' + col('TYPE', 6) + col('DATABASE', 10) + col('USER', 6) + col('ADDRESS', 15) + 'METHOD', mute: true},
  {c: col('local', 8) + col('all', 10) + col('all', 6) + col('', 15) + 'scram-sha-256'},
  {c: col('host', 8) + col('all', 10) + col('all', 6) + col('127.0.0.1/32', 15) + 'scram-sha-256'},
  {c: col('host', 8) + col('all', 10) + col('all', 6) + col('::1/128', 15) + 'scram-sha-256'},
];
// column highlight ranges (in characters) for the hba lines
const HBA_COLS = [
  {n: 'type', a: 0, b: 8, g: 116.8, label: 'TYPE'},
  {n: 'who', a: 8, b: 24, g: 118.4, label: 'DATABASE · USER'},
  {n: 'ip', a: 24, b: 39, g: 120.7, label: 'IP'},
  {n: 'method', a: 39, b: 52, g: 122.0, label: 'scram-sha-256'},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const open = prog(f, 0, 30);
  const sel = f >= t(106.7) ? 2 : f >= t(97.8) ? 1 : 0;
  const swap = prog(f, t(106.7), 14);
  // laser for postgresql.conf sweeps lines top -> bottom between 98s and 106s
  const laser = prog(f, t(98.2), sec(7.6));
  const laserY = lerp(0, CONF.length * LH, laser);
  const gate = prog(f, t(110.6), 24);
  const token = prog(f, t(120.7), sec(2.6));
  const badge = pop(f, t(124.7));
  const shield = prog(f, t(122.0), 22);

  const lineHot = (hot: number | undefined, i: number) => {
    if (!hot) return 0;
    const start = hot === 1 ? 98.8 : hot === 2 ? 103.0 : 105.0;
    return prog(f, t(start), 16);
  };

  return (
    <Stage dur={1350} inFx="left" outFx="morph">
      <TopBadge text="Data Directory · ملفان بيحكموا المحرك" from={t(86.6)} to={t(97)} color={C.blue} />

      {/* explorer */}
      <Win x={110} y={150} w={560} h={740} title="Data Directory" accent={C.border} opacity={open}>
        <div dir="ltr" style={{padding: '16px 24px', fontFamily: MONO, fontSize: 17, color: C.muted, borderBottom: `1px solid ${C.border}`}}>C:\Program Files\PostgreSQL\16\data</div>
        {FILES.map((fl, i) => {
          const p = prog(f, t(87.2) + i * 8, 18);
          const on = fl.key === sel;
          return (
            <div key={fl.n} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 16, height: 74, margin: '0 14px', padding: '0 14px', borderRadius: 12, opacity: p, transform: `translateX(${(1 - p) * -40}px)`, background: on ? `${C.blue}22` : 'transparent', border: on ? `2px solid ${C.blue}` : '2px solid transparent', fontFamily: MONO, fontSize: 26, color: on ? C.text : C.muted}}>
              <svg width={30} height={26} viewBox="0 0 30 26">
                {fl.d ? <path d="M2 4 H12 L15 8 H28 V24 H2 Z" fill={C.amber} opacity={0.85} /> : <path d="M5 1 H20 L27 8 V25 H5 Z" fill="none" stroke={on ? C.blue : C.muted} strokeWidth={2.5} />}
              </svg>
              {fl.n}
            </div>
          );
        })}
      </Win>

      {/* viewer */}
      <Win x={710} y={150} w={1100} h={740} title={sel === 2 ? 'pg_hba.conf' : sel === 1 ? 'postgresql.conf' : 'Select a file...'} accent={sel ? C.blue : C.border} opacity={open}>
        {sel === 0 && (
          <div dir="ltr" style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 28, color: C.muted}}>Select a file...</div>
        )}

        {sel === 1 && (
          <div style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', left: CODE_X, top: 28}}>
              {CONF.map((l, i) => {
                const h = lineHot(l.hot, i);
                return (
                  <div key={i} dir="ltr" style={{height: LH, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 30, color: l.mute ? '#64748B' : C.text, background: `rgba(56,189,248,${0.16 * h})`, borderRadius: 8, paddingRight: 16, marginLeft: -12, paddingLeft: 12, width: 640}}>
                    <span style={{color: '#475569', width: 44}}>{i + 1}</span>
                    {l.c}
                  </div>
                );
              })}
              <div style={{position: 'absolute', left: -12, width: 660, top: laserY - 2, height: 4, background: C.green, opacity: laser > 0 && laser < 1 ? 1 : 0, boxShadow: `0 0 18px ${C.green}`}} />
            </div>
            {/* annotations */}
            <div style={{position: 'absolute', left: 40, right: 40, top: 28 + CONF.length * LH + 30, display: 'flex', gap: 20}}>
              {[
                {a: 'shared_buffers', ar: 'ذاكرة الكاش', g: 99.5, c: C.blue},
                {a: 'max_connections', ar: 'أقصى اتصالات', g: 103.0, c: C.amber},
                {a: 'port · network', ar: 'منافذ الشبكة', g: 105.2, c: C.green},
              ].map((x) => {
                const p = pop(f, t(x.g));
                return (
                  <div key={x.a} style={{flex: 1, borderRadius: 16, background: C.deep, border: `2px solid ${x.c}`, padding: '16px 18px', transform: `scale(${0.8 + 0.2 * p})`, opacity: clamp(p)}}>
                    <div dir="ltr" style={{fontFamily: MONO, fontSize: 21, fontWeight: 700, color: x.c}}>{x.a}</div>
                    <Mix style={{fontSize: 28, color: C.text}}>{x.ar}</Mix>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sel === 2 && (
          <div style={{position: 'absolute', inset: 0, opacity: swap}}>
            <div style={{position: 'absolute', left: CODE_X, top: 28}}>
              {HBA.map((l, i) => (
                <div key={i} dir="ltr" style={{height: LH, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 30, color: l.mute ? '#64748B' : C.text, whiteSpace: 'pre'}}>{l.c}</div>
              ))}
              {HBA_COLS.map((c) => {
                const p = prog(f, t(c.g), 16);
                const col2 = c.n === 'method' ? C.green : c.n === 'ip' ? C.amber : C.blue;
                return (
                  <div key={c.n} style={{position: 'absolute', left: 44 + c.a * CW - 6, top: -4, width: (c.b - c.a) * CW + 8, height: HBA.length * LH + 8, border: `2px solid ${col2}`, background: `${col2}${p > 0.5 ? '1F' : '00'}`, borderRadius: 10, opacity: p}}>
                    <div dir="ltr" style={{position: 'absolute', left: 0, bottom: -34, fontFamily: MONO, fontSize: 19, fontWeight: 700, color: col2, whiteSpace: 'nowrap'}}>{c.label}</div>
                  </div>
                );
              })}
            </div>

            {/* gate flow: client token -> rule gate -> server */}
            <svg width={1100} height={380} style={{position: 'absolute', left: 0, top: 330, opacity: gate}}>
              <g transform="translate(0 20)">
                <circle cx={110} cy={150} r={44} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={4} />
                <text x={110} y={158} textAnchor="middle" fontFamily={MONO} fontSize={18} fontWeight={700} fill={C.blue}>client</text>
                <path d="M470 60 V230 H640 V60 A85 85 0 0 0 470 60 Z" fill="none" stroke={shield > 0.5 ? C.green : C.amber} strokeWidth={6} />
                <rect x={500} y={118} width={110} height={112} fill={C.deep} />
                <text x={555} y={146} textAnchor="middle" fontFamily={MONO} fontSize={15} fill={C.amber}>host</text>
                <text x={555} y={172} textAnchor="middle" fontFamily={MONO} fontSize={15} fill={C.amber}>127.0.0.1/32</text>
                <text x={555} y={198} textAnchor="middle" fontFamily={MONO} fontSize={15} fill={C.green}>scram-sha-256</text>
                <rect x={890} y={104} width={120} height={92} rx={14} fill={`${C.green}22`} stroke={C.green} strokeWidth={4} />
                <text x={950} y={158} textAnchor="middle" fontFamily={MONO} fontSize={20} fontWeight={700} fill={C.green}>server</text>
                <line x1={156} y1={150} x2={470} y2={150} stroke={C.border} strokeWidth={3} strokeDasharray="10 8" />
                <line x1={640} y1={150} x2={890} y2={150} stroke={C.border} strokeWidth={3} strokeDasharray="10 8" />
                <g opacity={token > 0 ? 1 : 0}>
                  <rect x={lerp(130, 880, token) - 38} y={132} width={76} height={36} rx={18} fill={shield > 0.5 && token > 0.45 ? C.green : C.amber} />
                  <text x={lerp(130, 880, token)} y={157} textAnchor="middle" fontFamily={MONO} fontSize={17} fontWeight={700} fill="#0F172A">IP ok</text>
                </g>
              </g>
            </svg>
          </div>
        )}

        {/* engineer badge */}
        <div style={{position: 'absolute', right: 34, top: 28, transform: `scale(${badge})`, transformOrigin: 'top right', opacity: clamp(badge)}}>
          <Chip color={C.green} style={{fontSize: 26, padding: '10px 22px'}}><Mix>مهندس قواعد بيانات ✓</Mix></Chip>
        </div>
      </Win>

      <Caption text="postgresql.conf ──► Shared Buffers & Max Connections Tuning" from={t(88)} to={t(106)} />
      <Caption text="pg_hba.conf ──► Host-Based Authentication (scram-sha-256 Encryption)" from={t(110)} to={t(126)} />
    </Stage>
  );
};
