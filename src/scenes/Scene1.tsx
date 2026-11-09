import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {cwO, ordCell} from '../data';
import type {CellV} from '../kit';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Ripple, Stage, TopBadge, camLerp, clamp, dwell, lerp, prog, sec, track} from '../kit';
import {CAM_SHEET, RangeFx, cellRect, center, typeIn} from '../l7';
import {DvDialog, MsgBox, Shield} from '../dv';

// SC01: why validation. Anchors (s): 8.9 invalid text accepted | 14.5 shield | 16.6 select D2:D100 | 20.0 Data Validation | 28.2 date | 29.6 whole number | 31.9 list | 36.0 OK | 37.7 Stop alert
const S = START.s1;
const t = (g: number) => sec(g - S);
const G0 = {colW: cwO};
const DX = 620, DY = 190;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(6.3), 50));

  const d10 = center(cellRect(10, 4, G0));
  const okBtn = {x: DX + 470 - 190 + 43, y: DY + 32 + 342 + 13};
  const allowBox = {x: DX + 24 + 140, y: DY + 32 + 82 + 12};
  const item = (i: number) => ({x: DX + 24 + 100, y: DY + 32 + 108 + i * 22 + 11});
  const pts = dwell([
    {f: t(0), x: 780, y: 520},
    {f: t(8.7), x: d10.x, y: d10.y},
    {f: t(12.5), x: d10.x, y: d10.y},
    {f: t(13.2), x: 700, y: 520},
    {f: t(23.8), x: 700, y: 520},
    {f: t(24.4), x: allowBox.x, y: allowBox.y},
    {f: t(27.6), x: allowBox.x, y: allowBox.y},
    {f: t(28.2), x: item(4).x, y: item(4).y},
    {f: t(29.6), x: item(1).x, y: item(1).y},
    {f: t(31.9), x: item(3).x, y: item(3).y},
    {f: t(33.4), x: item(1).x, y: item(1).y},
    {f: t(35.7), x: okBtn.x, y: okBtn.y},
    {f: t(36.2), x: d10.x, y: d10.y},
    {f: t(39.8), x: d10.x, y: d10.y},
  ]);
  const cur = track(f, pts);
  const clicks = [8.9, 24.6, 33.6, 36.0, 36.3];

  // cell D10
  const typing1 = within(9.2, 10.6), typing2 = within(36.5, 37.5);
  const accepted = within(10.6, 13.0);
  const extra: Record<string, CellV> = {};
  if (typing1) extra['10,4'] = {t: typeIn('abc', f, t(9.2), sec(0.8)), al: 'l'};
  else if (typing2) extra['10,4'] = {t: typeIn('abc', f, t(36.5), sec(0.8)), al: 'l'};
  else if (accepted) extra['10,4'] = {t: 'abc', al: 'l'};
  else if (within(37.5, 40)) extra['10,4'] = {t: 'abc', al: 'l'};
  const editing = typing1 || typing2 || within(37.5, 40);

  // name box typing D2:D100
  const nbTyping = within(16.6, 18.8);
  const nbText = typeIn('D2:D100', f, t(16.6), sec(1.6));
  let sel = {r1: 1, c1: 1, r2: 1, c2: 1}; let active = {r: 1, c: 1}; let nameBox = 'A1'; let formula = 'Customer ID';
  if (at(8.9)) { sel = {r1: 10, c1: 4, r2: 10, c2: 4}; active = {r: 10, c: 4}; nameBox = 'D10'; formula = typing1 ? extra['10,4'].t : accepted ? 'abc' : ''; }
  if (at(13.0) && !at(16.6)) formula = '';
  if (nbTyping) nameBox = nbText;
  if (at(18.8)) { sel = {r1: 2, c1: 4, r2: 100, c2: 4}; active = {r: 2, c: 4}; nameBox = 'D2'; formula = '2400'; }
  if (at(36.3)) { sel = {r1: 10, c1: 4, r2: 10, c2: 4}; active = {r: 10, c: 4}; nameBox = 'D10'; formula = editing ? (extra['10,4']?.t ?? '') : ''; }

  // dialog state
  const dlg = prog(f, t(20.0), 14) * (1 - prog(f, t(36.3), 8));
  const allowText = at(33.6) ? 'Whole number' : 'Any value';
  const listOpen = within(27.6, 33.7) ? 1 : 0;
  const hi = within(28.2, 29.6) ? 'Date' : within(29.6, 31.9) ? 'Whole number' : within(31.9, 33.4) ? 'List' : at(33.4) ? 'Whole number' : null;
  const glow = within(20.8, 27.4) ? 'allow' : at(34.2) && !at(34.6) ? 'min' : at(34.6) ? 'max' : null;
  const alertP = prog(f, t(37.7), 10);
  const shieldP = prog(f, t(14.5), 12) * (1 - prog(f, t(18.4), 10));
  const hit = Math.max(0, 1 - Math.abs(f - t(15.7)) / 14);
  const tokX = f < t(15.7) ? lerp(930, 1135, clamp((f - t(15.0)) / sec(0.7))) : lerp(1135, 900, clamp((f - t(15.7)) / sec(0.8)));
  const keyP = prog(f, t(19.4), 6) * (1 - prog(f, t(21.2), 8));

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="zoom">
      <ExcelWindow cam={cam} glow={hit > 0.3 ? C.blue : undefined}>
        <ExcelApp file="Orders" nameBox={nameBox} nameEdit={nbTyping} formula={formula} fbEdit={editing} colW={cwO} cell={(r, c) => ordCell(r, c, extra)} sel={sel} active={active} thumb={0} thumbSize={0.55}>
          <RangeFx rect={cellRect(10, 4, G0)} color={C.red} p={prog(f, t(10.8), 8) * (1 - prog(f, t(12.9), 8))} fill={0.16} label="Invalid" labelDx={110} />
          <DvDialog x={DX} y={DY} p={dlg} tab="Settings" allow={allowText as 'Whole number'} min={at(34.2) ? typeIn('1', f, t(34.2), 6) : ''} max={at(34.6) ? typeIn('100000', f, t(34.6), sec(0.7)) : ''} allowOpen={listOpen} hiItem={hi as 'Date' | null} glow={glow as 'allow' | null} glowColor={C.green} okHot={within(35.6, 36.3)} />
          <MsgBox x={660} y={290} p={alertP} kind="Stop" title="Microsoft Excel" msg="This value doesn't match the data validation restrictions defined for this cell." hot={at(39.0) ? 0 : -1} glow={C.blue} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>

      <TopBadge text="الدرس 22 من 76 | الوحدة 5 من 14 ──► Data Quality & Validation Engine" from={t(2.0)} to={t(18.0)} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(11.0), 8) * (1 - prog(f, t(12.9), 8))}}><Chip color={C.red}>✗ Text accepted in a numeric column</Chip></div>
      <div style={{position: 'absolute', left: 1180, top: 300, opacity: shieldP}}><Shield p={shieldP} hit={hit} /></div>
      <div style={{position: 'absolute', left: tokX, top: 372, opacity: shieldP, fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.red, background: C.card, border: `2px solid ${C.red}`, borderRadius: 10, padding: '2px 14px'}}>abc</div>
      <div style={{position: 'absolute', left: 1130, top: 520, opacity: shieldP}}><Chip color={C.blue}>VALIDATION SHIELD</Chip></div>
      <KeyBadge keys={['Alt', 'A', 'V', 'V']} p={keyP} />
      <Caption text="Data Validation ──► Restrict Inputs via Custom Rules, Lists, & Logical Constraints" from={t(22.0)} to={t(38.0)} />
    </Stage>
  );
};
