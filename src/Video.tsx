import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COL, FPS, VOICE_FILE} from './theme';
import {Caption, CycleRow, ExcelFrame, ExcelWindow, FONT, KeyCap, Logo, StageBg, Tone, TopBadge, View, ease, fade, pg} from './kit';
import {ANCH, SCENE_END, SCENE_START} from './sync';
import {s1, s2, s3, s4, s5, T1, T4, T5} from './scenes28';
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
  {a: 22, b: 38, text: 'Instant Summarization ──► Insert PivotTable from tbl_Sales (Zero Formula Writing)', tone: 'green'},
  {a: 42, b: 60, text: 'Pivot 4-Zone Control ──► Filters | Columns | Rows | Values', tone: 'purple'},
  {a: 64, b: 82, text: 'Value Field Settings ──► Switch SUM to AVERAGE or % of Grand Total', tone: 'blue', tag: {t: 'Show Values As', tone: 'blue'}},
  {a: 88, b: 106, text: 'Report Layout Architecture ──► Design ──► Report Layout ──► Show in Tabular Form', tone: 'amber'},
  {a: 110, b: 128, text: 'Clean Data Export ──► Repeat All Item Labels Removes Compact Overlaps for BI Readiness', tone: 'purple', tag: {t: 'Flat Table', tone: 'purple'}},
  {a: 132, b: 148, text: 'Interactive Analytics ──► Insert Slicers & Timelines for Visual Multi-Dimensional Filtering', tone: 'blue'},
  {a: 152, b: 168, text: 'Dynamic Refresh Engine ──► PivotTable Analyze ──► Refresh Auto-Updates on Table Expansion', tone: 'green'},
  {a: 172, b: 188, text: 'Enterprise Pivot Aggregation ──► Summarize 50,000 Sales Rows Instantly into Executive Dashboards', tone: 'blue'},
  {a: 192, b: 208, text: 'Zero Formula Overhead ──► High-Speed Multi-Dimensional Summarization & Refresh', tone: 'green', tag: {t: 'Verified', tone: 'green'}},
];
type Hint = {a: number; b: number; keys: string[]; press: number[]; cyc?: string[]};
const S = SCENE_START;
const hint = (si: number, rel: number, keys: string[]): Hint => ({a: S[si] + rel - 0.5, b: S[si] + rel + 1.2, keys, press: [S[si] + rel]});
const HINTS: Hint[] = [
  hint(0, T1.down, ['Ctrl', '↓']), hint(0, T1.home, ['Ctrl', 'Home']),
  hint(3, T4.down, ['Ctrl', '↓']), hint(3, T4.paste, ['Ctrl', 'V']),
  hint(4, T5.down1, ['Ctrl', '↓']), hint(4, T5.home, ['Ctrl', 'Home']),
];
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
        <div dir="ltr" style={{fontFamily: FONT.ar, fontWeight: 700, fontSize: 34, color: COL.text}}>Lesson 28 / 76</div>
      </div>
      {BUILD.map((_, i) => (
        <Sequence key={i} from={SCENE_START[i] * FPS - PREROLL[i]} durationInFrames={(SCENE_END[i] - SCENE_START[i]) * FPS + PREROLL[i]}>
          <ExcelScene i={i}/>
        </Sequence>
      ))}
      <Sequence from={SCENE_START[5] * FPS - PRE} durationInFrames={(SCENE_END[5] - SCENE_START[5]) * FPS + PRE}>
        <ClosingScene/>
      </Sequence>
      <TopBadge f={f} a={60} b={540} ar="الدرس 28 من 76 | الوحدة 6 من 14" en="Pivot Tables Engine"/>
      {CAPS.map((c) => <Caption key={c.a} f={f} a={c.a * FPS} b={c.b * FPS} text={c.text} tone={c.tone} tag={c.tag}/>)}
      <KeyLayer T={T}/>
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: pg(f, 7140, 7200), pointerEvents: 'none'}}/>
    </AbsoluteFill>
  );
};
