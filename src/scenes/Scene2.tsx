import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec, typed} from '../kit';

// SC02 (frames 1200-2550, global 40-85s): the three critical installer choices.
const S = 40;
const t = (g: number) => sec(g - S);
const STEPS = ['Installation Directory', 'Select Components', 'Data Directory', 'Password', 'Port', 'Locale', 'Summary'];
const CRIT = [3, 4, 5];

const Card: React.FC<{p: number; top: number; accent: string; children: React.ReactNode}> = ({p, top, accent, children}) => (
  <div style={{position: 'absolute', left: 30, right: 30, top: top + (1 - p) * 70, height: 176, borderRadius: 20, background: C.deep, border: `2px solid ${p > 0.3 ? accent : C.border}`, opacity: clamp(p), display: 'flex', alignItems: 'center', padding: '0 34px', gap: 30}}>
    {children}
  </div>
);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const win = prog(f, 0, 26);
  const c1 = pop(f, t(49.5));
  const c2 = pop(f, t(59.5));
  const c3 = pop(f, t(70.5));
  const active = f >= t(70.5) ? 5 : f >= t(59.5) ? 4 : f >= t(49.5) ? 3 : 1;

  const pw = typed('••••••••••', f, t(50.2), 0.28);
  const lock = prog(f, t(54.9), 14);
  const scan = prog(f, t(60.2), sec(5.4));
  const okPort = pop(f, t(66.0));
  const fw = prog(f, t(66.8), 20);
  const chip1 = pop(f, t(73.6));
  const chip2 = pop(f, t(74.6));
  const warn = prog(f, t(76.8), 22);

  return (
    <Stage dur={1350} inFx="zoom" outFx="left">
      <TopBadge text="EnterpriseDB Installer · 3 نقاط حاسمة" from={t(41.5)} to={t(60)} color={C.amber} />

      <Win x={120 + (1 - win) * 80} y={150} w={1680} h={760} title="PostgreSQL 16 Setup — EnterpriseDB" accent={C.border} opacity={win}>
        {/* stepper rail */}
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 400, background: C.deep, padding: '34px 30px', borderRight: `1px solid ${C.border}`}}>
          {STEPS.map((s, i) => {
            const crit = CRIT.includes(i);
            const on = i === active;
            const done = i < active;
            return (
              <div key={s} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 16, height: 74, fontFamily: MONO, fontSize: 24, color: on ? C.text : done ? C.muted : '#64748B'}}>
                <div style={{width: 26, height: 26, borderRadius: 13, background: done ? C.green : on ? C.amber : 'transparent', border: `3px solid ${done ? C.green : on ? C.amber : C.border}`}} />
                <span style={{fontWeight: on ? 700 : 400}}>{s}</span>
                {crit && <span style={{marginLeft: 'auto', fontSize: 15, color: C.amber, border: `1px solid ${C.amber}`, borderRadius: 6, padding: '1px 8px'}}>CRITICAL</span>}
              </div>
            );
          })}
        </div>

        {/* cards */}
        <div style={{position: 'absolute', left: 400, right: 0, top: 0, bottom: 0}}>
          <Card p={c1} top={24} accent={C.amber}>
            <svg width={96} height={110} viewBox="0 0 96 110">
              <path d={`M24 ${50 - 16 * (1 - lock)} V32 a24 24 0 0 1 48 0 V${50 - 16 * (1 - lock)}`} fill="none" stroke={C.amber} strokeWidth={9} strokeLinecap="round" />
              <rect x={10} y={50} width={76} height={54} rx={12} fill={C.amber} />
              <circle cx={48} cy={76} r={9} fill={C.deep} />
            </svg>
            <div style={{flex: 1}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.text}}>Superuser: <span style={{color: C.amber}}>postgres</span></div>
              <div dir="ltr" style={{marginTop: 12, display: 'inline-block', minWidth: 380, fontFamily: MONO, fontSize: 30, letterSpacing: 4, color: C.text, background: C.bg, border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>{pw || ' '}</div>
            </div>
            <Chip color={C.amber}>Database Superuser</Chip>
          </Card>

          <Card p={c2} top={224} accent={C.green}>
            <div style={{position: 'relative'}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 58, fontWeight: 700, color: C.text, background: C.bg, border: `2px solid ${C.border}`, borderRadius: 14, padding: '6px 26px', overflow: 'hidden'}}>
                5432
                <div style={{position: 'absolute', top: 0, bottom: 0, left: `${scan * 100}%`, width: 6, background: C.green, opacity: scan > 0 && scan < 1 ? 0.9 : 0}} />
              </div>
            </div>
            <div style={{flex: 1}}>
              <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 28, color: C.green, fontWeight: 700}}>
                <Check p={okPort} size={40} /> No Port Conflict
              </div>
              <div dir="ltr" style={{marginTop: 10, fontFamily: MONO, fontSize: 22, color: C.muted, opacity: fw, transform: `translateY(${(1 - fw) * 10}px)`}}>Firewall: allow inbound TCP 5432</div>
            </div>
            <svg width={80} height={92} viewBox="0 0 80 92" style={{opacity: fw}}>
              <path d="M40 4 L74 18 V46 C74 66 58 80 40 88 C22 80 6 66 6 46 V18 Z" fill={`${C.green}22`} stroke={C.green} strokeWidth={5} />
              <polyline points="26,46 36,57 56,34" fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Card>

          <Card p={c3} top={424} accent={C.blue}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 28, color: C.text}}>
              <div style={{color: C.muted, fontSize: 20, marginBottom: 6}}>Locale</div>
              <div style={{background: C.bg, border: `2px solid ${C.border}`, borderRadius: 12, padding: '10px 22px', minWidth: 400, display: 'flex', justifyContent: 'space-between'}}>
                <span>[Default locale]</span>
                <span style={{color: C.blue}}>▾</span>
              </div>
            </div>
            <Chip color={C.blue} style={{fontSize: 34, padding: '10px 26px'}}>UTF-8</Chip>
            <div style={{display: 'flex', gap: 16, flex: 1, justifyContent: 'flex-end'}}>
              <div style={{transform: `scale(${chip1})`}}><Chip color={C.green}><Mix>العربية ✓</Mix></Chip></div>
              <div style={{transform: `scale(${chip2})`}}><Chip color={C.green}>Dates ✓</Chip></div>
            </div>
          </Card>

          <div style={{position: 'absolute', left: 30, right: 30, top: 614, height: 78, borderRadius: 16, background: `${C.red}1A`, border: `2px solid ${C.red}`, opacity: warn, transform: `translateY(${(1 - warn) * 20}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
            <Mix style={{fontSize: 32, fontWeight: 600, color: C.text}}>خطأ في كلمة السر أو البورت</Mix>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 26, color: C.red}}>→ pgAdmin ✕ Engine</span>
          </div>
        </div>
      </Win>

      <Caption text="Superuser: postgres ──► Root Database Credentials" from={t(42)} to={t(60)} />
      <Caption text="Default Port: 5432 | Locale: UTF-8 (Arabic & UTF Support)" from={t(64)} to={t(82)} />
    </Stage>
  );
};
