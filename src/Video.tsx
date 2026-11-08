import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COL, FPS, VOICE_FILE} from './theme';
import {Caption, CycleRow, ExcelFrame, ExcelWindow, FONT, KeyCap, Logo, StageBg, Tone, TopBadge, View, ease, fade, pg} from './kit';
import {ANCH, SCENE_END, SCENE_START} from './sync';
import {s1, s2, s3, s4, s5, T5} from './scenes10';
import {Closing} from './closing';

type Build = (t: number) => {v: View; zoom: number; zx: number; zy: number};
const BUILD: Build[] = [s1, s2, s3, s4, s5];
const PRE = 15;
const PREROLL = [0, 0, PRE, PRE, PRE, PRE];
const ENTER = ['none', 'none', 'right', 'below', 'expand', 'fade'];
const EXIT = ['none', 'left', 'up', 'fade', 'fade', 'none'];

const fx = (i: number, f: number, dur: number) => {
  const pin = ease(pg(f, 0, PRE)), pout = ease(pg(f, dur - PRE, dur));
  let tx = 0, ty = 0, sc = 1, op = 1;
  if (PREROLL[i] > 0) {
    if (ENTER[i] === 'right') tx = (1 - pin) * 1920;
    if (ENTER[i] === 'below') ty = (1 - pin) * 1080;
    if (ENTER[i] === 'expand') { sc = 0.94 + 0.06 * pin; op = pin; }
    if (ENTER[i] === 'fade') op = pin;
  }
  if (EXIT[i] === 'left') tx = -pout * 1920;
  if (EXIT[i] === 'up') ty = -pout * 1080;
  if (EXIT[i] === 'fade') { op *= 1 - pout; sc *= 1 + 0.03 * pout; }
  return {tx, ty, sc, op};
};

const ExcelScene: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const dur = SCENE_END[i] * FPS - SCENE_START[i] * FPS + PREROLL[i];
  const t = (f - PREROLL[i]) / FPS;
  const {v, zoom, zx, zy} = BUILD[i](t);
  const e = fx(i, f, dur);
  return (
    <ExcelFrame tx={e.tx} ty={e.ty} sc={e.sc} op={e.op} zoom={zoom} zx={zx} zy={zy}>
      <ExcelWindow v={v}/>
    </ExcelFrame>
  );
};
const ClosingScene: React.FC = () => {
  const f = useCurrentFrame();
  const o = ease(pg(f, 0, PRE));
  return <div style={{position: 'absolute', inset: 0, opacity: o}}><Closing t={(f - PRE) / FPS}/></div>;
};

// ---------- on-screen typography (outside the artwork) ----------
const CAPS: {a: number; b: number; text: string; tone: Tone; tag?: {t: string; tone: Tone}}[] = [
  {a: 22, b: 38, text: 'Unhandled Errors ──► Propagate to Aggregates (SUM/AVERAGE Halt completely)', tone: 'red', tag: {t: 'Report Broken', tone: 'red'}},
  {a: 42, b: 60, text: 'Universal Protection ──► IFERROR Catches ALL Errors & Replaces with Safe Values', tone: 'green'},
  {a: 64, b: 82, text: 'Safe Formula: =IFERROR(C2/D2, 0) ──► Replaces #DIV/0! with 0', tone: 'green', tag: {t: 'Shield Active', tone: 'green'}},
  {a: 88, b: 106, text: 'IFERROR Trap ──► Overuse Hides Critical Calculation Bugs (#DIV/0!)', tone: 'amber'},
  {a: 110, b: 128, text: 'IFNA Precision ──► Catches ONLY #N/A Missing Data While Preserving Math Audit', tone: 'purple'},
  {a: 132, b: 148, text: 'Numeric Fallback (0) ──► Essential for Columns Included in Later Math Operations', tone: 'green'},
  {a: 152, b: 168, text: 'Text Fallback ("" / "Pending") ──► Clean Visuals or Descriptive Audit Indicators', tone: 'blue'},
  {a: 172, b: 188, text: 'Enterprise Error Shield ──► Fortify 50,000 Sales Calculations via IFERROR & IFNA', tone: 'blue'},
  {a: 192, b: 208, text: 'Zero-Breakage Models ──► Instant Error Fallback & Clean Executive Reporting', tone: 'green', tag: {t: 'Verified', tone: 'green'}},
];
type Hint = {a: number; b: number; keys: string[]; press: number[]; cyc?: string[]};
const S = SCENE_START;
const HINTS: Hint[] = [
  {a: S[4] + T5.down1 - 0.5, b: S[4] + T5.down1 + 1.2, keys: ['Ctrl', '↓'], press: [S[4] + T5.down1]},
  {a: S[4] + T5.home - 0.5, b: S[4] + T5.home + 1.2, keys: ['Ctrl', 'Home'], press: [S[4] + T5.home]},
  {a: S[4] + T5.down2 - 0.5, b: S[4] + T5.down2 + 1.2, keys: ['Ctrl', '↓'], press: [S[4] + T5.down2]},
];
const Chip: React.FC<{label: string; sub?: string; c: string; on: boolean}> = ({label, sub, c, on}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 16px', borderRadius: 12, background: on ? `${c}26` : '#1E293B', border: `2px solid ${on ? c : '#334155'}`, boxShadow: on ? `0 0 18px ${c}77` : undefined, opacity: on ? 1 : 0.5}}>
    <span style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 28, color: on ? c : COL.muted}}>{label}</span>
    {sub ? <span style={{fontFamily: FONT.mono, fontSize: 22, color: COL.text}}>{sub}</span> : null}
  </div>
);
const AnatomyBar: React.FC<{T: number}> = ({T}) => {
  const a = ANCH[1][1] + 0.5, b = ANCH[1][4] + 4;
  if (T < a || T > b) return null;
  const o = fade(T * FPS, a * FPS, b * FPS, 12);
  return (
    <div style={{position: 'absolute', left: 140, width: 1360, top: 8, height: 84, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, opacity: o}}>
      <Chip label="IFERROR(" c={COL.muted} on/>
      <Chip label="value" sub="C2/D2" c={COL.blue} on={T >= ANCH[1][1] + 0.9}/>
      <Chip label="," c={COL.muted} on/>
      <Chip label="value_if_error" sub="0" c={COL.green} on={T >= ANCH[1][1] + 3.2}/>
      <Chip label=")" c={COL.muted} on/>
    </div>
  );
};
const KeyLayer: React.FC<{T: number}> = ({T}) => {
  const h = HINTS.find((x) => T >= x.a && T <= x.b);
  if (!h) return null;
  const o = fade(T * FPS, h.a * FPS, h.b * FPS, 8);
  const down = h.press.some((p) => T >= p && T <= p + 0.28);
  const n = h.press.filter((p) => T >= p).length;
  return (
    <div style={{position: 'absolute', right: 48, top: 976, height: 88, display: 'flex', alignItems: 'center', gap: 26, opacity: o}}>
      {h.cyc ? <CycleRow states={h.cyc} idx={n % h.cyc.length} c={COL.amber}/> : null}
      <div style={{display: 'flex', gap: 10}}>{h.keys.map((k) => <KeyCap key={k} label={k} down={down} w={k.length > 2 ? 132 : 88}/>)}</div>
    </div>
  );
};

export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const T = f / FPS;
  const hideStage = 1 - pg(f, 6285, 6300);
  return (
    <AbsoluteFill style={{backgroundColor: COL.slate, overflow: 'hidden'}}>
      <Audio src={staticFile(VOICE_FILE)}/>
      <StageBg/>
      <div style={{position: 'absolute', left: 48, top: 16, opacity: hideStage}}><Logo h={68}/></div>
      <div style={{position: 'absolute', right: 48, top: 14, textAlign: 'right', opacity: hideStage}}>
        <div dir="ltr" style={{fontFamily: FONT.ar, fontSize: 20, color: COL.muted}}>Excel From Zero to Professional</div>
        <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 34, color: COL.text}}>Lesson 10</div>
      </div>
      {BUILD.map((_, i) => (
        <Sequence key={i} from={SCENE_START[i] * FPS - PREROLL[i]} durationInFrames={(SCENE_END[i] - SCENE_START[i]) * FPS + PREROLL[i]}>
          <ExcelScene i={i}/>
        </Sequence>
      ))}
      <Sequence from={SCENE_START[5] * FPS - PRE} durationInFrames={(SCENE_END[5] - SCENE_START[5]) * FPS + PRE}>
        <ClosingScene/>
      </Sequence>
      <TopBadge f={f} a={60} b={540} ar="معالجة الأخطاء والتحكم في المخرجات" en="Error Handling & Dynamic Fallback Engine"/>
      {CAPS.map((c) => <Caption key={c.a} f={f} a={c.a * FPS} b={c.b * FPS} text={c.text} tone={c.tone} tag={c.tag}/>)}
      <KeyLayer T={T}/>
      <AnatomyBar T={T}/>
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: pg(f, 7140, 7200), pointerEvents: 'none'}}/>
    </AbsoluteFill>
  );
};
