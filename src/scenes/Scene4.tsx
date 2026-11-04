import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Editor, Stage, TopBadge, clamp, lin, pop, sec} from '../kit';

// SC04 (132-174s): TRIM / LTRIM / RTRIM - squeegee wipe + JOIN fix.
// Anchors (s): 132.7 biggest problems | 139.2 JOIN failures | 142.8 TRIM family | 150.0 TRIM wipes | 158.0 LTRIM/RTRIM | 162.8 100% clean
const S = START.s4;
const t = (g: number) => sec(g - S);
const CW = 44;
const TEXT = 'user@domain.com';
const PAD = 3 * CW;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const show = clamp(lin(f, t(132.7), 16));
  const wipe = clamp(lin(f, t(150.0), sec(4)));
  const fixed = f >= t(160.5);
  const pad = PAD * (1 - wipe);
  const total = 2 * pad + TEXT.length * CW;
  const left = 960 - total / 2;
  const beamOn = wipe > 0 && wipe < 1;
  const join = clamp(lin(f, t(139.2), 16));
  const textCol = wipe >= 1 ? C.blue : C.text;

  return (
    <Stage dur={1260} inFx="up" outFx="morph">
      <TopBadge text="تطهير المسافات | TRIM, LTRIM & RTRIM" from={sec(1)} to={sec(40)} color={C.blue} />

      <Editor x={80} y={180} w={800} h={170} title="Query Editor" lines={['SELECT TRIM(email)', 'FROM users;']} start={t(142.8)} cps={0.9} size={28} hl={f > t(150) ? 0 : -1} hlColor={C.blue} />
      <div style={{position: 'absolute', left: 960, top: 196, display: 'flex', gap: 14, flexWrap: 'wrap', width: 880}}>
        {[['TRIM · both sides', 150.0, C.blue], ['LTRIM · left only', 158.0, C.amber], ['RTRIM · right only', 158.8, C.amber]].map(([l, at, col]) => (
          <div key={String(l)} style={{opacity: clamp(pop(f, t(at as number)))}}><Chip color={col as string} style={{fontSize: 26}}>{l as string}</Chip></div>
        ))}
      </div>

      {/* the dirty string */}
      <div dir="ltr" style={{position: 'absolute', left: left - 24, top: 430, height: 96, display: 'flex', alignItems: 'center', opacity: show, fontFamily: MONO, fontSize: 44, fontWeight: 700}}>
        <span style={{color: C.muted, width: 24}}>'</span>
        <div style={{width: pad, height: 80, background: `repeating-linear-gradient(45deg, ${C.red}44, ${C.red}44 8px, transparent 8px, transparent 16px)`, borderRadius: 8, overflow: 'hidden', opacity: pad > 1 ? 1 : 0}} />
        <div style={{width: TEXT.length * CW, textAlign: 'center', color: textCol, background: `${wipe >= 1 ? C.blue : C.card}${wipe >= 1 ? '22' : ''}`, border: `3px solid ${wipe >= 1 ? C.blue : C.border}`, borderRadius: 12, height: 80, lineHeight: '74px', boxShadow: wipe >= 1 ? `0 0 28px ${C.blue}88` : 'none', whiteSpace: 'nowrap'}}>{TEXT}</div>
        <div style={{width: pad, height: 80, background: `repeating-linear-gradient(45deg, ${C.red}44, ${C.red}44 8px, transparent 8px, transparent 16px)`, borderRadius: 8, overflow: 'hidden', opacity: pad > 1 ? 1 : 0}} />
        <span style={{color: C.muted, width: 24, marginLeft: 6}}>'</span>
      </div>
      {beamOn ? (
        <>
          <div style={{position: 'absolute', left: left + pad - 4, top: 410, width: 8, height: 136, background: C.amber, boxShadow: `0 0 22px 6px ${C.amber}`, borderRadius: 4}} />
          <div style={{position: 'absolute', left: left + total - pad - 4, top: 410, width: 8, height: 136, background: C.amber, boxShadow: `0 0 22px 6px ${C.amber}`, borderRadius: 4}} />
        </>
      ) : null}
      <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 552, textAlign: 'center', fontFamily: MONO, fontSize: 26, color: wipe >= 1 ? C.blue : C.red, opacity: show}}>
        {wipe >= 1 ? 'LENGTH = 15 · clean ✓' : 'LENGTH = 21 · 6 hidden spaces'}
      </div>

      {/* JOIN comparison */}
      <div dir="ltr" style={{position: 'absolute', left: 240, right: 240, top: 650, height: 230, borderRadius: 22, background: C.card, border: `3px solid ${fixed ? C.green : C.red}`, opacity: join, padding: '20px 36px', fontFamily: MONO, boxShadow: `0 0 28px ${fixed ? C.green : C.red}44`}}>
        <div style={{fontSize: 26, color: C.muted}}>orders.email  {fixed ? '=' : '≠'}  users.email</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 14, fontSize: 34, color: C.text}}>
          <span style={{background: C.deep, padding: '8px 16px', borderRadius: 10, whiteSpace: 'pre'}}>{fixed ? 'user@domain.com' : "'   user@domain.com   '"}</span>
          <span style={{color: fixed ? C.green : C.red, fontSize: 56, fontWeight: 700}}>{fixed ? '=' : '≠'}</span>
          <span style={{background: C.deep, padding: '8px 16px', borderRadius: 10}}>user@domain.com</span>
        </div>
        <div style={{marginTop: 14, fontSize: 32, fontWeight: 700, color: fixed ? C.green : C.red}}>{fixed ? '✓ JOIN matches 100%' : '✗ JOIN fails — 0 rows matched'}</div>
      </div>

      <Caption text="TRIM(BOTH ' ' FROM text) ──► Strips Leading & Trailing Whitespaces" from={t(144)} to={t(160)} />
      <Caption text="Data Cleansing ──► Prevents Join Failures Caused by Hidden Spaces" from={t(161.5)} to={sec(41.5)} tone="ok" />
    </Stage>
  );
};
