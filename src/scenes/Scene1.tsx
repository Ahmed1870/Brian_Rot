import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Mix, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {CASE_RESULTS, CHAOTIC_EMAILS} from '../data';

// SC01 (0-40s): Case Normalization — LOWER, UPPER, INITCAP
// Anchors (s): 1.0 welcome | 5.5 case sensitivity problem | 9.0 search fails | 14.0 LOWER | 19.0 UPPER | 24.0 INITCAP | 30.0 unified | 35.0 reliable
const S = START.s1;
const t = (g: number) => sec(g - S);

/** Render a string with per-character transformation + color sweep. */
const TransformRow: React.FC<{
  y: number;
  mode: 'lower' | 'upper' | 'initcap';
  color: string;
  label: string;
  start: number;
  end: number;
  active: boolean;
}> = ({y, mode, color, label, start, end, active}) => {
  const f = useCurrentFrame();
  const gateP = clamp(lin(f, start, 12));
  // Progress: 0..1 of how many chars have been processed
  const processingDur = end - start;
  const prog2 = clamp(lin(f, start + 12, processingDur - 12));
  const charProgress = Math.floor(prog2 * CASE_RESULTS.raw.length);

  const transform = (ch: string, idx: number): string => {
    if (idx >= charProgress) return ch;
    if (mode === 'lower') return ch.toLowerCase();
    if (mode === 'upper') return ch.toUpperCase();
    // initcap
    const prev = idx > 0 ? CASE_RESULTS.raw[idx - 1] : ' ';
    const isWordStart = /[^a-zA-Z0-9]/.test(prev) || idx === 0;
    return isWordStart ? ch.toUpperCase() : ch.toLowerCase();
  };

  // Layout: raw text at x=120 (width ~520), gate at x=680, result at x=740
  const GATE_X = 680;
  const RAW_X = 120;
  const RESULT_X = 740;

  return (
    <>
      {/* Row label */}
      <div dir="ltr" style={{position: 'absolute', left: 80, top: y - 30, fontFamily: MONO, fontSize: 20, fontWeight: 700, color, opacity: gateP}}>
        {label}
      </div>

      {/* Raw text (left of gate) — always visible, chars get dimmed as they're processed */}
      <div dir="ltr" style={{position: 'absolute', left: RAW_X, top: y, fontFamily: MONO, fontSize: 28, fontWeight: 700, letterSpacing: 1, whiteSpace: 'pre'}}>
        {CASE_RESULTS.raw.split('').map((ch, i) => {
          const processed = i < charProgress;
          return (
            <span key={i} style={{color: processed ? '#475569' : C.muted, opacity: processed ? 0.5 : 1}}>
              {ch}
            </span>
          );
        })}
      </div>

      {/* Gate (vertical laser line) */}
      <div style={{position: 'absolute', left: GATE_X - 2, top: y - 6, width: 4, height: 44, background: color, opacity: gateP, boxShadow: `0 0 ${active ? 24 : 10}px ${color}`}} />
      {/* Gate glow ring */}
      <div style={{position: 'absolute', left: GATE_X - 14, top: y - 10, width: 28, height: 52, borderRadius: 14, border: `2px solid ${color}`, opacity: gateP * (active ? 0.8 : 0.3), background: `${color}11`}} />

      {/* Arrow */}
      <div dir="ltr" style={{position: 'absolute', left: GATE_X + 20, top: y + 2, fontFamily: MONO, fontSize: 24, color, opacity: gateP}}>
        ──►
      </div>

      {/* Result text (right of gate) — chars appear as they're processed */}
      <div dir="ltr" style={{position: 'absolute', left: RESULT_X, top: y, fontFamily: MONO, fontSize: 28, fontWeight: 700, letterSpacing: 1, whiteSpace: 'pre'}}>
        {CASE_RESULTS.raw.split('').map((ch, i) => {
          const processed = i < charProgress;
          if (!processed) return <span key={i} style={{color: '#334155', opacity: 0.3}}>{transform(ch, i) === ' ' ? ' ' : '·'}</span>;
          return (
            <span key={i} style={{color, textShadow: `0 0 8px ${color}88`}}>
              {transform(ch, i)}
            </span>
          );
        })}
      </div>

      {/* Status indicator */}
      <div dir="ltr" style={{position: 'absolute', left: GATE_X - 50, top: y + 44, width: 100, textAlign: 'center', fontFamily: MONO, fontSize: 16, color: active ? color : '#475569', opacity: gateP}}>
        {active ? '◆ active' : prog2 >= 1 ? '◆ done ✓' : '◆ idle'}
      </div>
    </>
  );
};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();

  // Show chaotic emails cycling
  const emailIdx = Math.floor(Math.max(0, (f - t(2))) / 90) % CHAOTIC_EMAILS.length;
  const email = CHAOTIC_EMAILS[Math.max(0, emailIdx)];

  // Lower gate active 6-13s, upper 13-20s, initcap 20-30s
  const lowerActive = f >= t(6) && f < t(13.5);
  const upperActive = f >= t(14) && f < t(20.5);
  const initcapActive = f >= t(21) && f < t(30);

  const tableP = clamp(lin(f, t(30), 16));
  const sealP = pop(f, t(35));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="تنسيق حالة الأحرف | String Case Normalization" from={sec(2)} to={sec(18)} />

      {/* chaotic email display top-left */}
      <div style={{position: 'absolute', left: 80, top: 175, opacity: clamp(lin(f, t(1), 12))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 8}}>◆ raw input · chaotic case</div>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.red, padding: '10px 18px', border: `2px dashed ${C.red}`, borderRadius: 12, background: `${C.red}0d`, minWidth: 460, display: 'inline-block'}}>
          {email}
        </div>
      </div>

      {/* problem callout top-right */}
      <div style={{position: 'absolute', right: 80, top: 175, width: 560, opacity: clamp(lin(f, t(5.5), 16))}}>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginBottom: 8}}>◆ problem</div>
        <div style={{padding: '12px 18px', border: `2px solid ${C.red}`, borderRadius: 12, background: `${C.red}0d`}}>
          <Mix style={{fontSize: 24, color: C.text, lineHeight: 1.4, display: 'block'}}>
            البحث المباشر يفشل حين تختلف حالة الأحرف
          </Mix>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 700, marginTop: 6}}>
            → Case Sensitivity Trap
          </div>
        </div>
      </div>

      {/* 3 case-normalization rows */}
      <TransformRow y={340} mode="lower" color={C.blue} label="LOWER()" start={t(6)} end={t(13)} active={lowerActive} />
      <TransformRow y={500} mode="upper" color={C.amber} label="UPPER()" start={t(14)} end={t(20)} active={upperActive} />
      <TransformRow y={660} mode="initcap" color={C.green} label="INITCAP()" start={t(21)} end={t(30)} active={initcapActive} />

      {/* Unified result table at the bottom */}
      <Win x={80} y={770} w={1760} h={150} title="normalized output · reliable search base" accent={C.green} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 28, right: 28, top: 12, height: 32, display: 'flex', gap: 28, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 180}}>function</span>
          <span style={{flex: 1}}>result</span>
          <span style={{width: 280}}>use case</span>
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 50, bottom: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
          {[
            {fn: 'LOWER()', res: CASE_RESULTS.lower, uc: 'email matching', color: C.blue, p: pop(f, t(31))},
            {fn: 'UPPER()', res: CASE_RESULTS.upper, uc: 'constants / codes', color: C.amber, p: pop(f, t(32))},
            {fn: 'INITCAP()', res: CASE_RESULTS.initcap, uc: 'display names', color: C.green, p: pop(f, t(33))},
          ].map((r) => (
            <div key={r.fn} dir="ltr" style={{display: 'flex', gap: 28, alignItems: 'center', opacity: clamp(r.p), transform: `translateX(${(1 - clamp(r.p)) * 30}px)`}}>
              <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color: r.color, width: 180}}>{r.fn}</div>
              <div style={{fontFamily: MONO, fontSize: 22, color: r.color, flex: 1, fontWeight: 700}}>{r.res}</div>
              <div style={{fontFamily: MONO, fontSize: 18, color: C.muted, width: 280}}>{r.uc}</div>
            </div>
          ))}
        </div>
      </Win>

      <Caption text="LOWER() | UPPER() | INITCAP() ──► Normalizes Text for Reliable Search" from={t(22)} to={sec(38)} />
    </Stage>
  );
};
