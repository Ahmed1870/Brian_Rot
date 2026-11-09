import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {cwO, ordCell} from '../data';
import type {CellV} from '../kit';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Ripple, Stage, camLerp, dwell, prog, sec, track} from '../kit';
import {CAM_SHEET, RangeFx, cellRect, center, typeIn} from '../l7';
import {DvDialog, MsgBox} from '../dv';

// SC03: custom rules. Anchors (s): 86 A2:A100 | 88.8 dialog | 91.4 Custom | 96.3 COUNTIF | 99.6 OK | 101 CUST-101 | 104.5 Stop | 108.2 C2:C100 | 109.9 AND | 115 reject | 117 accept | 118 summary
const S = START.s3;
const t = (g: number) => sec(g - S);
const G0 = {colW: cwO};
const DX = 620, DY = 190;
const F1 = '=COUNTIF(A:A,A2)=1';
const F2 = '=AND(C2>=DATE(2026,1,1),C2<=DATE(2026,12,31))';

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(85.2), 40));

  const a10 = center(cellRect(10, 1, G0)), c10 = center(cellRect(10, 3, G0));
  const allowBox = {x: DX + 24 + 140, y: DY + 32 + 82 + 12};
  const item = (i: number) => ({x: DX + 24 + 100, y: DY + 32 + 108 + i * 22 + 11});
  const fmBox = {x: DX + 24 + 210, y: DY + 32 + 136 + 12};
  const okBtn = {x: DX + 470 - 190 + 43, y: DY + 32 + 342 + 13};
  const pts = dwell([
    {f: t(84.92), x: 700, y: 520},
    {f: t(88.4), x: 700, y: 520},
    {f: t(90.2), x: allowBox.x, y: allowBox.y},
    {f: t(91.0), x: allowBox.x, y: allowBox.y},
    {f: t(91.4), x: item(7).x, y: item(7).y},
    {f: t(95.6), x: fmBox.x, y: fmBox.y},
    {f: t(99.3), x: okBtn.x, y: okBtn.y},
    {f: t(100.4), x: a10.x, y: a10.y},
    {f: t(107.6), x: a10.x, y: a10.y},
    {f: t(108.0), x: 700, y: 520},
    {f: t(112.6), x: fmBox.x, y: fmBox.y},
    {f: t(113.2), x: okBtn.x, y: okBtn.y},
    {f: t(114.4), x: c10.x, y: c10.y},
    {f: t(129.0), x: c10.x, y: c10.y},
  ]);
  const cur = track(f, pts);
  const clicks = [91.0, 91.5, 99.4, 101.0, 113.3, 115.0, 117.0];

  const extra: Record<string, CellV> = {};
  const dup = typeIn('CUST-101', f, t(101.0), sec(1.6));
  const typingDup = within(101.0, 104.5);
  if (typingDup) extra['10,1'] = {t: dup, al: 'l'}; else if (within(104.5, 108)) extra['10,1'] = {t: 'CUST-101', al: 'l'};
  const bad = typeIn('5/3/2025', f, t(115.0), sec(0.9)), good = typeIn('5/3/2026', f, t(117.0), sec(0.9));
  const typingBad = within(115.0, 117.0 - 0.2 * 0) && !at(116.6), typingGood = within(117.0, 118.2);
  if (typingBad) extra['10,3'] = {t: bad, al: 'l'}; else if (within(116.6, 117.0)) extra['10,3'] = {t: '5/3/2025', al: 'l'};
  if (typingGood) extra['10,3'] = {t: good, al: 'l'}; else if (at(118.2)) extra['10,3'] = {t: '5/3/2026', al: 'r', num: 1};

  let sel = {r1: 1, c1: 1, r2: 1, c2: 1}; let active = {r: 1, c: 1}; let nameBox = 'A1'; let formula = 'Customer ID';
  const nb1 = within(86.0, 87.8), nb2 = within(108.2, 109.4);
  const nbText = nb1 ? typeIn('A2:A100', f, t(86.0), sec(1.5)) : typeIn('C2:C100', f, t(108.2), sec(1.0));
  if (at(87.8)) { sel = {r1: 2, c1: 1, r2: 100, c2: 1}; active = {r: 2, c: 1}; nameBox = 'A2'; formula = 'CUST-101'; }
  if (at(100.4)) { sel = {r1: 10, c1: 1, r2: 10, c2: 1}; active = {r: 10, c: 1}; nameBox = 'A10'; formula = typingDup ? dup : within(104.5, 108) ? 'CUST-101' : ''; }
  if (nb1 || nb2) nameBox = nbText;
  if (at(109.4)) { sel = {r1: 2, c1: 3, r2: 100, c2: 3}; active = {r: 2, c: 3}; nameBox = 'C2'; formula = '1/12/2026'; }
  if (at(114.4)) { sel = {r1: 10, c1: 3, r2: 10, c2: 3}; active = {r: 10, c: 3}; nameBox = 'C10'; formula = typingBad ? bad : typingGood ? good : at(118.2) ? '5/3/2026' : ''; }
  const editing = typingDup || typingBad || typingGood;

  const dlg1 = prog(f, t(88.8), 12) * (1 - prog(f, t(99.9), 8));
  const dlg2 = prog(f, t(109.0), 12) * (1 - prog(f, t(113.8), 8));
  const dlgP = Math.max(dlg1, dlg2);
  const second = at(108.5);
  const fText = second ? typeIn(F2, f, t(109.9), sec(2.5)) : typeIn(F1, f, t(96.3), sec(2.7));
  const allowShown = at(91.4) || second ? 'Custom' : 'Any value';
  const listOpen = within(90.3, 91.5) ? 1 : 0;
  const glow = within(89.4, 90.2) ? 'allow' : (at(96.3) && !at(99.4)) || (at(109.9) && !at(113.2)) ? 'formula' : null;
  const stopA = prog(f, t(104.5), 8) * (1 - prog(f, t(107.6), 8));
  const stopB = prog(f, t(116.4), 8) * (1 - prog(f, t(116.9), 3));
  const stopAny = Math.max(stopA, stopB);
  const purpleFx = prog(f, t(104.4), 8) * (1 - prog(f, t(108), 10));
  const dupHalo = prog(f, t(104.4), 8) * (1 - prog(f, t(107.8), 10));
  const okFx = prog(f, t(118.0), 10) * (1 - prog(f, t(122.0), 14));
  const keyP = prog(f, t(88.2), 6) * (1 - prog(f, t(89.6), 8));

  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="up">
      <ExcelWindow cam={cam} glow={dupHalo > 0.3 ? C.purple : undefined}>
        <ExcelApp file="Orders" nameBox={nameBox} nameEdit={nb1 || nb2} formula={formula} fbEdit={editing} colW={cwO} cell={(r, c) => ordCell(r, c, extra)} sel={sel} active={active} thumb={0} thumbSize={0.55}>
          <RangeFx rect={cellRect(10, 1, G0)} color={C.purple} p={purpleFx} fill={0.2} label="Duplicate blocked" labelDx={108} />
          <RangeFx rect={cellRect(10, 3, G0)} color={C.green} p={okFx} fill={0.2} label="In FY 2026" labelDx={110} />
          <DvDialog x={DX} y={DY} p={dlgP} tab="Settings" allow={allowShown as 'Custom'} formula={fText} allowOpen={listOpen} hiItem={listOpen ? 'Custom' : null} glow={glow as 'formula' | null} glowColor={C.purple} focus={glow === 'formula' ? 'formula' : undefined} blink={Math.floor(f / 8) % 2 === 0} okHot={within(99.2, 99.9) || within(113.0, 113.6)} />
          <MsgBox x={660} y={290} p={stopAny} kind="Stop" title="Microsoft Excel" msg="This value doesn't match the data validation restrictions defined for this cell." hot={-1} glow={C.purple} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>
      <KeyBadge keys={['Alt', 'A', 'V', 'V']} p={keyP} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(104.6), 8) * (1 - prog(f, t(108), 10))}}><Chip color={C.purple}>COUNTIF = 2 ──► rule is FALSE ──► rejected</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(118.3), 10) * (1 - prog(f, t(128.4), 10))}}><Chip color={C.green}>✓ Only dates inside fiscal year 2026</Chip></div>
      <Caption text="Custom Validation Formula ──► =COUNTIF(A:A, A2)=1 Prevents Duplicate Entry at Input Time" from={t(91.5)} to={t(108.0)} />
      <Caption text="Logical Boundaries ──► Use AND/OR Logic to Enforce Strict Business Rules" from={t(110.0)} to={t(128.4)} tone="ok" />
    </Stage>
  );
};
