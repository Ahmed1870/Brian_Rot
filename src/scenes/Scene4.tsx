import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {cwO, ordCell} from '../data';
import {CAM0, Caption, Chip, Cursor, ExcelApp, ExcelWindow, Ripple, Stage, camLerp, dwell, prog, sec, track} from '../kit';
import {CAM_SHEET, RangeFx, cellRect, center} from '../l7';
import {DvDialog, InputNote, MsgBox} from '../dv';

// SC04: alert styles + input message. Anchors (s): 130 Error Alert tab | 136.6 Stop | 142 Warning | 145.8 Information | 148.8 Input Message | 154.2 OK | 154.8 D12 note | 157.5 guidance
const S = START.s4;
const t = (g: number) => sec(g - S);
const G0 = {colW: cwO};
const DX = 300, DY = 190;
const TT = 'Sales Amount', MM = 'Enter a whole number between 1 and 100,000.';
const MSG = {Stop: "Sales must be a whole number between 1 and 100,000.", Warning: "Sales is outside the usual range. Continue?", Information: "Value is outside the usual range. It will be accepted."} as const;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);
  const cam = camLerp(CAM0, CAM_SHEET, prog(f, t(129.9), 30));

  const d12 = center(cellRect(12, 4, G0));
  const tabErr = {x: DX + 14 + 210 + 48, y: DY + 32 + 8 + 12}, tabIn = {x: DX + 14 + 98 + 56, y: DY + 32 + 8 + 12};
  const okBtn = {x: DX + 470 - 190 + 43, y: DY + 32 + 342 + 13};
  const styleBox = {x: DX + 24 + 140, y: DY + 32 + 100};
  const pts = dwell([
    {f: t(129.9), x: 700, y: 560},
    {f: t(131.0), x: tabErr.x, y: tabErr.y},
    {f: t(134.4), x: tabErr.x, y: tabErr.y},
    {f: t(136.0), x: styleBox.x, y: styleBox.y},
    {f: t(147.9), x: styleBox.x, y: styleBox.y},
    {f: t(148.6), x: tabIn.x, y: tabIn.y},
    {f: t(153.8), x: okBtn.x, y: okBtn.y},
    {f: t(154.6), x: d12.x, y: d12.y},
    {f: t(168.5), x: d12.x, y: d12.y},
  ]);
  const cur = track(f, pts);
  const clicks = [131.2, 136.5, 142.0, 145.8, 148.7, 154.0, 154.7];

  const style = at(145.8) ? 'Information' : at(142.0) ? 'Warning' : 'Stop';
  const tab = at(148.7) ? 'Input Message' : at(131.0) ? 'Error Alert' : 'Settings';
  const dlg = prog(f, t(130.2), 12) * (1 - prog(f, t(154.4), 8));
  const boxP = (a: number, b: number) => prog(f, t(a), 8) * (1 - prog(f, t(b), 8));
  const box = style === 'Stop' ? boxP(137.0, 141.6) : style === 'Warning' ? boxP(142.4, 145.4) : boxP(146.2, 148.4);
  const col = style === 'Stop' ? C.red : style === 'Warning' ? C.amber : C.blue;
  const inTitle = at(149.4) ? TT.slice(0, Math.min(TT.length, Math.floor((f - t(149.4)) / 2) + 1)) : '';
  const inMsg = at(150.8) ? MM.slice(0, Math.min(MM.length, Math.floor((f - t(150.8)) / 1.3) + 1)) : '';
  const note = prog(f, t(155.0), 10);
  const noteFx = prog(f, t(155.0), 10);
  const glow = tab === 'Input Message' ? (within(149.2, 150.7) ? 'title' : within(150.7, 153.8) ? 'msg' : null) : (within(135.8, 148.3) ? 'style' : null);

  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="zoom">
      <ExcelWindow cam={cam}>
        <ExcelApp file="Orders" nameBox={at(154.7) ? 'D12' : 'D2'} formula={at(154.7) ? '' : '2400'} colW={cwO} cell={(r, c) => ordCell(r, c)} sel={at(154.7) ? {r1: 12, c1: 4, r2: 12, c2: 4} : {r1: 2, c1: 4, r2: 100, c2: 4}} active={at(154.7) ? {r: 12, c: 4} : {r: 2, c: 4}} thumb={0} thumbSize={0.55}>
          <RangeFx rect={cellRect(12, 4, G0)} color={C.blue} p={noteFx} fill={0.12} />
          <DvDialog x={DX} y={DY} p={dlg} tab={tab as 'Settings'} allow="Whole number" min="1" max="100000" style={style} title="Invalid Sales" msg={MSG[style]} inTitle={inTitle} inMsg={inMsg} glow={glow as 'style' | null} glowColor={col} okHot={within(153.6, 154.4)} blink={Math.floor(f / 8) % 2 === 0} />
          <MsgBox x={DX + 480} y={DY + 40} p={box} kind={style} title="Invalid Sales" msg={MSG[style]} glow={col} />
          <InputNote x={cellRect(12, 4, G0).x + 8} y={cellRect(12, 4, G0).y + 26} p={note} title={TT} msg={MM} glow={C.blue} />
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: boxP(137.0, 141.6)}}><Chip color={C.red}>Stop ──► hard block</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: boxP(142.4, 145.4)}}><Chip color={C.amber}>Warning ──► soft alert, user can continue</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: boxP(146.2, 148.4)}}><Chip color={C.blue}>Information ──► informs only</Chip></div>
      <Caption text="Error Alert Styles ──► Stop (Hard Block) vs Warning (Soft Alert) vs Information (Informative)" from={t(132.0)} to={t(148.4)} />
      <Caption text="Guidance UI ──► Input Messages Display Helpful Tooltips Before User Types Data" from={t(156.0)} to={t(168.0)} tone="ok" />
    </Stage>
  );
};
