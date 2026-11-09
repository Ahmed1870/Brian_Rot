import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COL, FPS, VOICE_FILE} from './theme';
import {Caption, CycleRow, ExcelFrame, ExcelWindow, FONT, KeyCap, Logo, StageBg, Tone, TopBadge, View, ease, fade, pg} from './kit';
import {ANCH, SCENE_END, SCENE_START} from './sync';
import {s1, s2, s3, s4, s5, T4, T5} from './scenes20';
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
  {a: 22, b: 38, text: 'TEXTBEFORE & TEXTAFTER ──► =TEXTBEFORE(text, "@") / =TEXTAFTER(text, "@")', tone: 'blue'},
  {a: 42, b: 60, text: 'TEXTSPLIT Mechanics ──► =TEXTSPLIT(text, col_delimiter, [row_delimiter])', tone: 'amber'},
  {a: 64, b: 82, text: 'TEXTJOIN Engine ──► =TEXTJOIN(delimiter, ignore_empty, text_range)', tone: 'green', tag: {t: 'Merge', tone: 'green'}},
  {a: 88, b: 106, text: 'Data Hygiene Trio ──► TRIM (Removes Extra Spaces) + CLEAN (Removes Non-Printable Chars)', tone: 'purple'},
  {a: 110, b: 128, text: 'SUBSTITUTE Master ──► Replaces Specific Characters Natively Across Text Strings', tone: 'purple', tag: {t: 'Purple Scanner', tone: 'purple'}},
  {a: 132, b: 148, text: 'Master Text Pipeline ──► =TRIM(TEXTSPLIT(TEXTBEFORE(Emails, "@"), "."))', tone: 'green'},
  {a: 152, b: 168, text: 'Single-Cell Parsing ──► Extracts, Splits & Cleans Full Names in 1 Formula', tone: 'green'},
  {a: 172, b: 188, text: 'Enterprise Text Sanitation ──► Parse & Clean 50,000 Customer Records Instantly', tone: 'blue'},
  {a: 192, b: 208, text: 'Modern Text Standards ──► Zero Flash-Fill Dependency & Instant Dynamic Array Parsing', tone: 'green', tag: {t: 'Verified', tone: 'green'}},
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
const Arr: React.FC = () => <svg width="34" height="16" viewBox="0 0 34 16"><path d="M2 8h26M21 2l8 6-8 6" stroke={COL.muted} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const AnatomyBar: React.FC<{T: number}> = ({T}) => {
  const a = S[3] + T4.s[0] - 4, b = ANCH[3][2] + 9;
  if (T < a || T > b) return null;
  const o = fade(T * FPS, a * FPS, b * FPS, 12);
  return (
    <div style={{position: 'absolute', left: 140, width: 1360, top: 8, height: 84, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: o}}>
      <Chip label="TEXTBEFORE" sub="ahmed.ali" c={COL.blue} on={T >= S[3] + T4.s[0] - 3.5}/>
      <Arr/>
      <Chip label="TEXTSPLIT" sub="ahmed | ali" c={COL.amber} on={T >= S[3] + T4.s[1] - 3.5}/>
      <Arr/>
      <Chip label="TRIM" sub="clean" c={COL.green} on={T >= S[3] + T4.s[2] - 2.7}/>
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
        <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 34, color: COL.text}}>Lesson 20 / 76</div>
      </div>
      {BUILD.map((_, i) => (
        <Sequence key={i} from={SCENE_START[i] * FPS - PREROLL[i]} durationInFrames={(SCENE_END[i] - SCENE_START[i]) * FPS + PREROLL[i]}>
          <ExcelScene i={i}/>
        </Sequence>
      ))}
      <Sequence from={SCENE_START[5] * FPS - PRE} durationInFrames={(SCENE_END[5] - SCENE_START[5]) * FPS + PRE}>
        <ClosingScene/>
      </Sequence>
      <TopBadge f={f} a={60} b={540} ar="الدرس 20 من 76 | الوحدة 4 من 14" en="Advanced Text Parsing Engine"/>
      {CAPS.map((c) => <Caption key={c.a} f={f} a={c.a * FPS} b={c.b * FPS} text={c.text} tone={c.tone} tag={c.tag}/>)}
      <KeyLayer T={T}/>
      <AnatomyBar T={T}/>
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: pg(f, 7140, 7200), pointerEvents: 'none'}}/>
    </AbsoluteFill>
  );
};
