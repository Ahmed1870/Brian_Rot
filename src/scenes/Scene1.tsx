import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC01 (frames 0-1200, global 0-40s): the engine runs as a background service; pgAdmin is only a client.
const t = (g: number) => sec(g);

const Cylinder: React.FC<{glow: number}> = ({glow}) => (
  <g>
    <ellipse cx={0} cy={96} rx={104} ry={30} fill="#065F46" />
    <rect x={-104} y={-70} width={208} height={166} fill="#047857" />
    <ellipse cx={0} cy={-70} rx={104} ry={30} fill="#34D399" />
    {[-8, 40].map((y) => (
      <path key={y} d={`M-104 ${y} A104 30 0 0 0 104 ${y}`} fill="none" stroke="#065F46" strokeWidth={5} />
    ))}
    <circle cx={64} cy={64} r={7} fill="#A7F3D0" opacity={0.6 + 0.4 * glow} />
    <circle cx={64} cy={16} r={7} fill="#A7F3D0" opacity={0.6 + 0.4 * glow} />
  </g>
);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const split = prog(f, 0, 34);
  const tags = prog(f, t(9.6), 24);
  const engOn = prog(f, t(16.4), 24);
  const svcIn = prog(f, t(19.9), 22);
  const portP = pop(f, t(24.4));
  const guiOn = prog(f, t(26.6), 24);
  const link = prog(f, t(29.6), sec(3.4));
  const linked = link > 0.98;
  const warn = prog(f, t(35.0), 22);
  const closeP = prog(f, t(35.6), 26);
  const pulse = 0.5 + 0.5 * Math.sin(f / 9);
  const engineScale = 1 + 0.04 * engOn * (0.6 + 0.4 * pulse);

  return (
    <Stage dur={1200} inFx="none" outFx="zoom">
      <TopBadge text="المعمارية المزدوجة | Database Engine vs GUI Client" from={t(2)} to={t(18)} />

      {/* component tags */}
      <div style={{position: 'absolute', left: 110, top: 168, opacity: tags}}>
        <Chip color={C.blue}><Mix>المكوّن 2 · الواجهة</Mix></Chip>
      </div>
      <div style={{position: 'absolute', left: 1110, top: 168, opacity: tags}}>
        <Chip color={C.green}><Mix>المكوّن 1 · المحرك</Mix></Chip>
      </div>

      {/* pgAdmin client (left) */}
      <Win x={110 - (1 - split) * 200} y={230} w={700} h={520} title="pgAdmin 4 — GUI Client" accent={guiOn > 0.5 ? C.blue : C.border} opacity={split * lerp(1, 0.32, closeP)} scale={lerp(1, 0.93, closeP)}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 210, background: C.deep, padding: 20, borderRight: `1px solid ${C.border}`}}>
          {['Servers', 'PostgreSQL 16', 'Databases', 'Login Roles', 'Tablespaces'].map((r, i) => (
            <div key={r} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 19, color: i === 1 ? C.text : C.muted, marginBottom: 22, paddingLeft: i > 0 && i < 4 ? 18 : 0}}>
              <div style={{width: 12, height: 12, borderRadius: 3, background: i === 1 ? C.blue : C.border}} />
              {r}
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 230, right: 24, top: 20, bottom: 20}}>
          <div style={{display: 'flex', gap: 10, marginBottom: 24}}>
            {['Dashboard', 'Properties', 'SQL'].map((tb, i) => (
              <div key={tb} dir="ltr" style={{fontFamily: MONO, fontSize: 18, padding: '6px 14px', borderRadius: 8, background: i === 0 ? `${C.blue}33` : 'transparent', color: i === 0 ? C.blue : C.muted}}>{tb}</div>
            ))}
          </div>
          <svg width={430} height={290}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const h = 40 + ((i * 53) % 150) + 30 * Math.sin(f / 18 + i);
              return <rect key={i} x={i * 60} y={270 - h} width={40} height={h} rx={6} fill={C.blue} opacity={0.35 + 0.1 * i} />;
            })}
            <line x1={0} x2={430} y1={272} y2={272} stroke={C.border} />
          </svg>
        </div>
        <div style={{position: 'absolute', right: 22, top: -44, width: 30, height: 30, borderRadius: 15, background: closeP > 0.1 ? C.red : 'transparent', opacity: closeP}} />
      </Win>

      {/* engine (right) */}
      <div style={{position: 'absolute', left: 1110 + (1 - split) * 200, top: 230, width: 700, height: 520, borderRadius: 22, background: C.card, border: `2px solid ${engOn > 0.5 ? C.green : C.border}`, boxShadow: `0 26px 70px rgba(2,6,23,.55), 0 0 ${60 * engOn * pulse}px ${C.green}33`, opacity: split, transform: `scale(${engineScale})`}}>
        <svg width={700} height={520} style={{position: 'absolute', left: 0, top: 0}}>
          <g transform="translate(350 230)">
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const a = f / 70 + (k * Math.PI) / 3;
              return <circle key={k} cx={Math.cos(a) * 250} cy={Math.sin(a) * 78} r={8} fill={C.green} opacity={0.15 + 0.45 * engOn} />;
            })}
            <ellipse cx={0} cy={0} rx={250} ry={78} fill="none" stroke={C.green} strokeOpacity={0.25 * engOn} strokeDasharray="6 10" />
            <Cylinder glow={pulse} />
          </g>
          <text x={350} y={395} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={700} fill={C.text}>PostgreSQL Engine</text>
        </svg>
        <div style={{position: 'absolute', left: 36, right: 36, bottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: svcIn, transform: `translateY(${(1 - svcIn) * 24}px)`}}>
          <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 24, color: C.text}}>
            <svg width={34} height={34} viewBox="0 0 34 34" style={{transform: `rotate(${f * 3}deg)`}}>
              <circle cx={17} cy={17} r={8} fill="none" stroke={C.green} strokeWidth={4} />
              {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
                <rect key={k} x={15} y={1} width={4} height={7} fill={C.green} transform={`rotate(${k * 45} 17 17)`} />
              ))}
            </svg>
            Windows Service · Daemon
          </div>
          <div style={{width: 16, height: 16, borderRadius: 8, background: C.green, boxShadow: `0 0 ${12 * pulse}px ${C.green}`}} />
        </div>
        <div style={{position: 'absolute', right: 30, top: 24, transform: `scale(${portP})`, transformOrigin: 'top right'}}>
          <Chip color={C.amber}>Port 5432</Chip>
        </div>
      </div>

      {/* TCP pipeline */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={810} y1={490} x2={810 + 300 * link} y2={490} stroke={C.amber} strokeWidth={6} strokeDasharray="16 10" strokeDashoffset={-f * 1.5} strokeLinecap="round" />
        <circle cx={810} cy={490} r={14} fill={C.blue} opacity={split * lerp(1, 0.3, closeP)} />
        <circle cx={1110} cy={490} r={14} fill={linked ? C.green : C.border} />
        {linked && <circle cx={1110} cy={490} r={14 + 16 * pulse} fill="none" stroke={C.green} strokeWidth={3} opacity={0.6 * (1 - pulse)} />}
        {linked &&
          closeP < 0.3 &&
          [0, 1, 2, 3].map((k) => {
            const p = (f * 0.018 + k / 4) % 1;
            return (
              <g key={k}>
                <circle cx={lerp(810, 1110, p)} cy={490} r={16} fill={C.amber} opacity={0.22} />
                <circle cx={lerp(810, 1110, p)} cy={490} r={7} fill={C.amber} />
              </g>
            );
          })}
        {linked && closeP >= 0.3 && (
          <g opacity={clamp(closeP)}>
            <line x1={810} y1={490} x2={1110} y2={490} stroke={C.green} strokeWidth={6} strokeDasharray="16 10" strokeDashoffset={-f * 1.5} />
          </g>
        )}
        <text x={960} y={452} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.amber} opacity={clamp(link * 2)}>localhost:5432</text>
      </svg>

      {/* persistence warning */}
      <div style={{position: 'absolute', left: 330, right: 330, top: 790, opacity: warn, transform: `translateY(${(1 - warn) * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, background: C.card, border: `2px solid ${C.amber}`, borderRadius: 20, padding: '16px 28px'}}>
          <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.amber}}>!</div>
          <div>
            <Mix style={{fontSize: 40, fontWeight: 700, color: C.text}}>إغلاق pgAdmin ≠ إيقاف السيرفر</Mix>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, marginTop: 2}}>Engine keeps running in the background</div>
          </div>
        </div>
      </div>

      <Caption text="pgAdmin GUI ──[TCP Port 5432]──► PostgreSQL Background Service" from={t(22)} to={t(34.5)} />
    </Stage>
  );
};
