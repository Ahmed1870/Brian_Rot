import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {EMAILS} from '../data';

// SC05 (174-211.5s): REPLACE - legacy domain swap across all rows.
// Anchors (s): 178.4 enterprise | 185.5 REPLACE searches | 190.0 swap | 193.0 old domains | 200.3 combining | 206.3 standardized
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const hl = clamp(lin(f, t(185.5), 16));
  const stamp = clamp(pop(f, t(193.0)));
  return (
    <Stage dur={1125} inFx="up" outFx="fade">
      <TopBadge text="استبدال الأنماط | Global Pattern Swap with REPLACE" from={sec(1)} to={sec(32)} color={C.amber} />

      <Editor x={80} y={170} w={1160} h={240} title="Query Editor" lines={['SELECT email,', "  REPLACE(email, '@old-domain.com', '@manzooma.com')", '  AS updated_email', 'FROM employees;']} start={t(178.4)} cps={1.0} size={26} hl={f > t(185.5) ? 1 : -1} hlColor={C.amber} />

      <div style={{position: 'absolute', left: 1290, top: 200, width: 550, display: 'flex', justifyContent: 'center', opacity: stamp, transform: `scale(${0.8 + 0.2 * stamp}) rotate(-4deg)`}}>
        <div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, border: `4px solid ${C.green}`, borderRadius: 18, padding: '14px 30px', fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.green, background: `${C.green}14`}}>
          <Check p={stamp} size={52} /> APPROVED
        </div>
      </div>

      <Win x={80} y={440} w={1760} h={440} title="employees" accent={C.border}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, display: 'flex', alignItems: 'center', padding: '0 40px', fontFamily: MONO, fontSize: 26, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 780}}>email</span>
          <span>updated_email</span>
        </div>
        {EMAILS.map((e, i) => {
          const user = e.split('@')[0];
          const p = clamp(lin(f, t(179.5 + i * 0.5), 12));
          const flip = clamp(lin(f, t(190.0 + i * 0.5), 12));
          const flipped = flip >= 0.5;
          const sy = Math.abs(Math.cos(flip * Math.PI));
          return (
            <div key={e} dir="ltr" style={{position: 'absolute', left: 24, right: 24, top: 64 + i * 80, height: 68, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: MONO, fontSize: 36, opacity: p}}>
              <span style={{width: 756}}>
                <span style={{color: C.text}}>{user}</span>
                <span style={{color: C.amber, fontWeight: 700, background: `${C.amber}${hl > 0.3 ? '33' : '00'}`, borderRadius: 6, padding: '0 4px', boxShadow: hl > 0.3 ? `0 0 16px ${C.amber}66` : 'none'}}>@old-domain.com</span>
              </span>
              <span style={{color: C.muted, marginRight: 34, opacity: flip > 0 ? 1 : 0.3}}>→</span>
              <span style={{display: 'inline-block', transform: `scaleY(${flip > 0 && flip < 1 ? Math.max(0.05, sy) : 1})`, opacity: flip > 0 ? 1 : 0}}>
                <span style={{color: C.text}}>{user}</span>
                <span style={{color: flipped ? C.green : C.amber, fontWeight: 700, textShadow: flipped ? `0 0 14px ${C.green}` : 'none'}}>{flipped ? '@manzooma.com' : '@old-domain.com'}</span>
              </span>
            </div>
          );
        })}
      </Win>
      <div dir="ltr" style={{position: 'absolute', right: 80, top: 880, opacity: clamp(lin(f, t(206.3), 16)), display: 'none'}}>
        <Chip color={C.green}>standardized</Chip>
      </div>
      <Caption text="REPLACE(email, 'old', 'new') ──► Global Pattern Swap across Columns" from={t(179)} to={t(194)} />
      <Caption text="Enterprise Transformation ──► Standardizes Legacy Records & Domains" from={t(196)} to={t(210)} tone="ok" />
    </Stage>
  );
};
