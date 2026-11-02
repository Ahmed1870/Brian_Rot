import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec, typed} from '../kit';

// SC05 (frames 5100-6300, global 170-210s): Connection Refused -> restart service -> workspace ready.
const S = 170;
const t = (g: number) => sec(g - S);
const SERVICES = ['Windows Update', 'postgresql-x64-16', 'Print Spooler', 'Windows Time'];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const win = prog(f, 0, 24);
  const err = prog(f, t(175.6), 14);
  const shake = f >= t(175.6) && f < t(178.6) ? Math.sin(f * 2.2) * 8 * (1 - prog(f, t(175.6), sec(3))) : 0;
  const svcStop = prog(f, t(179.8), 20);
  const portClosed = pop(f, t(182.9));
  const toggle = prog(f, t(186.0), 18);
  const running = toggle > 0.5;
  const cmd = typed('net start postgresql-x64-16', f, t(184.0), 0.9);
  const cmdOk = prog(f, t(186.4), 14);
  const fixed = prog(f, t(187.7), 20);
  const chk = [pop(f, t(188.2)), pop(f, t(189.8)), pop(f, t(191.5))];
  const ready = prog(f, t(193.3), 28);
  const dashDim = 1 - 0.85 * ready;
  const tile1 = pop(f, t(196.0));
  const tile2 = pop(f, t(197.2));
  const tile3 = pop(f, t(198.4));
  const file = pop(f, t(199.6));
  const units = prog(f, t(203.4), 24);

  return (
    <Stage dur={1200} inFx="up" outFx="down">
      <TopBadge text="Troubleshooting · تشخيص بيئة العمل" from={t(171.5)} to={t(188)} color={C.red} />

      <div style={{opacity: dashDim}}>
        {/* pgAdmin error */}
        <Win x={110} y={150} w={760} h={400} title="pgAdmin 4 — Connect to Server" accent={fixed > 0.5 ? C.green : C.red} opacity={win} scale={1}>
          <div style={{position: 'absolute', left: 36, right: 36, top: 34, transform: `translateX(${shake}px)`}}>
            <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 20, background: fixed > 0.5 ? `${C.green}1A` : `${C.red}1A`, border: `2px solid ${fixed > 0.5 ? C.green : C.red}`, borderRadius: 18, padding: '24px 28px', opacity: clamp(err) }}>
              <svg width={64} height={64} viewBox="0 0 64 64">
                {fixed > 0.5 ? (
                  <polyline points="14,34 28,48 52,18" fill="none" stroke={C.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <g stroke={C.red} strokeWidth={8} strokeLinecap="round">
                    <line x1={16} y1={16} x2={48} y2={48} />
                    <line x1={48} y1={16} x2={16} y2={48} />
                  </g>
                )}
              </svg>
              <div>
                <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: fixed > 0.5 ? C.green : C.red}}>{fixed > 0.5 ? 'Connected' : 'Connection Refused'}</div>
                <div style={{fontFamily: MONO, fontSize: 21, color: C.muted, marginTop: 6}}>{fixed > 0.5 ? 'localhost:5432 · PostgreSQL 16' : 'could not connect to server: localhost:5432'}</div>
              </div>
            </div>
            <div style={{display: 'flex', gap: 18, marginTop: 28, flexWrap: 'wrap'}}>
              <div style={{opacity: svcStop}}><Chip color={C.amber}><Mix>الخدمة متوقفة</Mix></Chip></div>
              <div style={{transform: `scale(${portClosed})`, opacity: clamp(portClosed)}}><Chip color={C.red}><Mix>البورت مغلق</Mix></Chip></div>
            </div>
          </div>
        </Win>

        {/* Windows Services */}
        <Win x={950} y={150} w={860} h={560} title="Windows Services (services.msc)" accent={C.border} opacity={win}>
          <div style={{padding: '20px 26px'}}>
            {SERVICES.map((s, i) => {
              const hot = i === 1;
              return (
                <div key={s} dir="ltr" style={{display: 'flex', alignItems: 'center', height: 96, borderRadius: 16, padding: '0 22px', marginBottom: 14, background: hot ? C.deep : 'transparent', border: hot ? `2px solid ${running ? C.green : C.red}` : `2px solid transparent`, fontFamily: MONO, fontSize: 28, color: hot ? C.text : C.muted}}>
                  <div style={{width: 18, height: 18, borderRadius: 9, background: hot ? (running ? C.green : C.red) : C.border, marginRight: 20, boxShadow: hot && running ? `0 0 14px ${C.green}` : 'none'}} />
                  <span style={{flex: 1}}>{s}</span>
                  {hot && (
                    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                      <span style={{fontSize: 22, color: running ? C.green : C.red}}>{running ? 'Running' : 'Stopped'}</span>
                      <div style={{width: 96, height: 46, borderRadius: 23, background: running ? C.green : C.border, position: 'relative', boxShadow: running ? `0 0 18px ${C.green}88` : 'none'}}>
                        <div style={{position: 'absolute', top: 5, left: lerp(6, 56, toggle), width: 36, height: 36, borderRadius: 18, background: C.text}} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Win>

        {/* Terminal alternative */}
        <Win x={110} y={600} w={760} h={160} title="Terminal (Admin)" accent={C.border} opacity={win}>
          <div dir="ltr" style={{padding: '18px 26px', fontFamily: MONO, fontSize: 26, color: C.text}}>
            <div><span style={{color: C.green}}>&gt;</span> {cmd}{cmd.length < 28 && cmd.length > 0 ? <span style={{color: C.green}}>▌</span> : null}</div>
            <div style={{color: C.green, fontSize: 22, marginTop: 10, opacity: cmdOk}}>The postgresql-x64-16 service was started successfully.</div>
          </div>
        </Win>

        {/* readiness checklist */}
        <div dir="ltr" style={{position: 'absolute', left: 110, right: 110, top: 790, display: 'flex', gap: 22, justifyContent: 'center'}}>
          {['Workspace prepared', 'Latest version installed', 'Connection tested'].map((c, i) => (
            <div key={c} style={{display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `2px solid ${C.green}`, borderRadius: 16, padding: '12px 24px', fontFamily: MONO, fontSize: 25, color: C.text, opacity: clamp(chk[i]), transform: `translateY(${(1 - clamp(chk[i])) * 24}px)`}}>
              <Check p={chk[i]} size={38} />
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Workspace Ready overlay */}
      <div style={{position: 'absolute', left: 260, top: 170, width: 1400, height: 700, borderRadius: 28, background: C.card, border: `2px solid ${C.green}`, boxShadow: `0 40px 110px rgba(2,6,23,.75), 0 0 80px ${C.green}22`, opacity: ready, transform: `scale(${0.86 + 0.14 * ready})`}}>
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 44, fontFamily: MONO, fontSize: 60, fontWeight: 700, color: C.text}}>Workspace <span style={{color: C.green}}>Ready</span></div>
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 128, fontFamily: MONO, fontSize: 28, color: C.muted}}>Prepared for Manzooma Store DDL Deployment</div>
        <div dir="ltr" style={{position: 'absolute', left: 60, right: 60, top: 220, display: 'flex', gap: 24}}>
          {[
            {n: 'PostgreSQL 16', c: C.green, p: tile1},
            {n: 'pgAdmin 4', c: C.blue, p: tile2},
            {n: 'localhost:5432', c: C.amber, p: tile3},
          ].map((x) => (
            <div key={x.n} style={{flex: 1, height: 150, borderRadius: 20, background: C.deep, border: `2px solid ${x.c}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `scale(${0.8 + 0.2 * x.p})`, opacity: clamp(x.p)}}>
              <Check p={x.p} size={44} color={x.c} />
              <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.text}}>{x.n}</div>
            </div>
          ))}
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 60, top: 420, display: 'flex', alignItems: 'center', gap: 22, opacity: clamp(file), transform: `translateX(${(1 - clamp(file)) * -40}px)`}}>
          <svg width={52} height={64} viewBox="0 0 52 64">
            <path d="M6 2 H34 L48 16 V62 H6 Z" fill="none" stroke={C.blue} strokeWidth={4} />
            <text x={26} y={46} textAnchor="middle" fontFamily={MONO} fontSize={16} fontWeight={700} fill={C.blue}>SQL</text>
          </svg>
          <div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.text}}>manzooma_store<span style={{color: C.blue}}>.sql</span></div>
            <div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginTop: 4}}>CREATE · INSERT · SELECT</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 560, opacity: units, transform: `translateY(${(1 - units) * 20}px)`}}>
          <Mix style={{fontSize: 38, fontWeight: 600, color: C.text}}>البيئة المثالية لتطبيق مفاهيم الوحدات الأولى عملياً</Mix>
        </div>
      </div>

      <Caption text="Fix: Connection Refused ──► Restart PostgreSQL Windows Service" from={t(172)} to={t(188)} />
      <Caption text="Workspace Ready ──► Prepared for Manzooma Store DDL Deployment" from={t(192)} to={t(206)} />
    </Stage>
  );
};
