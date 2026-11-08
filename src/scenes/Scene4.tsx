import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {fmtInt, fmtStat, smallCell, statsOf} from '../data';
import {
  dwell, AC, AutoCorrectDialog, CAM0, CAM_DLG, CAM_MENU, CAM_STATUS, Caption, Chip, Cursor, ExcelApp, ExcelWindow, KeyBadge, Menu, Neon, OPT, OptionsDialog, Ripple, Stage, XL, camLerp,
  cellCenter, clamp, geo, menuHeight, menuItemY, optNavY, optOk, prog, sec, statusMenuItems, track,
} from '../kit';

// SC04: Status Bar customization + Excel Options (Alt+F+T).
// Anchors (s): 125.3 Status Bar | 128.76 right-click | 132.69 Numerical Count | 134.55 Average | 135.92 Sum | 137.23 Min | 138.61 Max | 146.74 Alt+F+T | 147.71 kill auto-format | 151.22 Automatic Calculation
const S = START.s4;
const t = (g: number) => sec(g - S);
const MENU_H = 20;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  let cam = CAM_STATUS;
  cam = camLerp(cam, CAM_MENU, prog(f, t(128.3), 30));
  cam = camLerp(cam, CAM_STATUS, prog(f, t(139.5), 30));
  cam = camLerp(cam, CAM_DLG, prog(f, t(146.7), 40));
  cam = camLerp(cam, CAM0, prog(f, t(157.6), 50));

  // status bar toggles
  const onNum = prog(f, t(132.85), 8), onMin = prog(f, t(137.4), 8), onMax = prog(f, t(138.75), 8);
  const menuOn: Record<string, number> = {'Numerical Count': onNum, Minimum: onMin, Maximum: onMax};
  const items0 = statusMenuItems(menuOn);
  const idx = (n: string) => items0.findIndex((m) => m.label === n);
  const hotLabel = f >= t(139.0) ? '' : f >= t(138.5) ? 'Maximum' : f >= t(137.1) ? 'Minimum' : f >= t(135.8) ? 'Sum' : f >= t(134.4) ? 'Average' : f >= t(132.6) ? 'Numerical Count' : '';
  const items = items0.map((m) => (m.label === hotLabel ? {...m, hot: true} : m));
  const mh = menuHeight(items, MENU_H);
  const mY = XL.H - XL.status - mh;
  const mX = 850;
  const menuOpen = at(128.9) && !at(139.4);

  // selection (stats source)
  let sel = {r1: 2, c1: 7, r2: 19, c2: 7};
  let active = {r: 2, c: 7};
  if (at(142.0)) sel = {r1: 2, c1: 5, r2: 19, c2: 7};
  if (at(144.2)) sel = {r1: 1, c1: 1, r2: 19, c2: 8};
  const st = statsOf(sel.r1, sel.c1, sel.r2, sel.c2);
  const stats: Array<[string, string]> = [['Average', fmtStat(st.avg)], ['Count', fmtInt(st.count)]];
  if (onNum > 0.5) stats.push(['Numerical Count', fmtInt(st.numCount)]);
  if (onMin > 0.5) stats.push(['Min', fmtStat(st.min)]);
  if (onMax > 0.5) stats.push(['Max', fmtStat(st.max)]);
  stats.push(['Sum', fmtStat(st.sum)]);
  const glow = prog(f, t(139.5), 12) * (1 - prog(f, t(146.0), 12));
  const statNeon = prog(f, t(125.3), 12) * (1 - prog(f, t(128.6), 10));

  // dialogs
  const dlgP = prog(f, t(147.2), 14) * (1 - prog(f, t(156.5), 10));
  const page = at(151.45) ? 'Formulas' : at(148.0) ? 'Proofing' : 'General';
  const acP = prog(f, t(149.1), 12) * (1 - prog(f, t(151.0), 10));
  const chk = (a: number) => 1 - prog(f, t(a), 9);
  const checks: [number, number, number] = [chk(149.6), chk(150.0), chk(150.4)];
  const calcGlow = at(151.5) ? 0.5 + 0.5 * Math.sin(f * 0.2) : 0;

  const cOf = (r: number, c: number) => cellCenter(r, c, {});
  const g2 = cOf(2, 7), g19 = cOf(19, 7), e2 = cOf(2, 5), a1 = cOf(1, 1), h19 = cOf(19, 8);
  const mi = (n: string) => ({x: mX + 80, y: menuItemY(mY, items, idx(n), MENU_H)});
  const proof = {x: OPT.x + 100, y: optNavY('Proofing')};
  const forms = {x: OPT.x + 100, y: optNavY('Formulas')};
  const acBtn = {x: OPT.x + 200 + 560 + 80, y: OPT.y + 32 + 72 + 13};
  const acCheck = (i: number) => ({x: AC.x + 43, y: AC.y + 32 + 96 + [0, 66, 90][i] + 9});
  const acOkPos = {x: AC.x + AC.w - 196 + 42, y: AC.y + AC.h - 27};
  const ok = optOk();
  const pts = dwell([
    {f: t(121.7), x: 760, y: 330},
    {f: t(128.3), x: 900, y: XL.H - 12},
    {f: t(129.2), x: mi('Cell Mode').x, y: mi('Cell Mode').y},
    {f: t(132.55), x: mi('Numerical Count').x, y: mi('Numerical Count').y},
    {f: t(134.5), x: mi('Average').x, y: mi('Average').y},
    {f: t(135.9), x: mi('Sum').x, y: mi('Sum').y},
    {f: t(137.2), x: mi('Minimum').x, y: mi('Minimum').y},
    {f: t(138.6), x: mi('Maximum').x, y: mi('Maximum').y},
    {f: t(139.6), x: 700, y: 400},
    {f: t(141.8), x: e2.x, y: e2.y},
    {f: t(142.4), x: g19.x, y: g19.y},
    {f: t(143.9), x: a1.x, y: a1.y},
    {f: t(144.5), x: h19.x, y: h19.y},
    {f: t(147.6), x: 760, y: 330},
    {f: t(147.95), x: proof.x, y: proof.y},
    {f: t(148.85), x: acBtn.x, y: acBtn.y},
    {f: t(149.55), x: acCheck(0).x, y: acCheck(0).y},
    {f: t(149.95), x: acCheck(1).x, y: acCheck(1).y},
    {f: t(150.35), x: acCheck(2).x, y: acCheck(2).y},
    {f: t(150.95), x: acOkPos.x, y: acOkPos.y},
    {f: t(151.42), x: forms.x, y: forms.y},
    {f: t(155.0), x: forms.x + 30, y: forms.y + 40},
    {f: t(156.2), x: ok.x, y: ok.y},
    {f: t(157.5), x: 760, y: 330},
  ]);
  const cur = track(f, pts);
  const clickAt = [128.76, 132.7, 137.2, 138.6, 147.95, 148.9, 149.6, 150.0, 150.4, 150.95, 151.42, 156.2];
  const keyFor = f >= t(147.0) ? ['Alt', 'F', 'T'] : f >= t(146.6) ? ['Alt', 'F'] : ['Alt'];
  const keyP = prog(f, t(146.2), 8) * (1 - prog(f, t(149.0), 10));
  const lockChip = prog(f, t(156.6), 12) * (1 - prog(f, t(160.4), 12));
  const g0 = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s4.dur} inFx="none" outFx="none">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Book1" qat={['pasteValues', 'filter', 'sortAsc', 'clearFormats']} nameBox={at(144.2) ? 'A1' : at(142.0) ? 'E2' : 'G2'}
          formula={at(144.2) ? 'Order ID' : at(142.0) ? '=E2*F2' : '=E2*F2'} cell={smallCell} sel={sel} active={at(144.2) ? {r: 1, c: 1} : at(142.0) ? {r: 2, c: 5} : active}
          stats={stats} statsGlow={glow} thumb={0} thumbSize={0.55}
        >
          <Neon x={0} y={XL.H - XL.status} w={XL.W} h={XL.status} color={C.amber} p={statNeon} />
          {menuOpen ? <Menu x={mX} y={mY} w={340} items={items} itemH={MENU_H} /> : null}
          {dlgP > 0.01 ? <OptionsDialog s={{page, p: dlgP, calcRadio: 0, calcGlow, acBtnHot: at(148.7) && !at(149.2), okHot: Math.abs(f - t(156.2)) < 6}} /> : null}
          {acP > 0.01 ? <AutoCorrectDialog p={acP} checks={checks} okHot={Math.abs(f - t(150.95)) < 6} /> : null}
          {clickAt.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clickAt.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>
      <KeyBadge keys={keyFor} p={keyP} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: lockChip}}>
        <Chip color={C.amber}>✓ Setup locked</Chip>
      </div>
      <Caption text="Status Bar Setup ──► Enable: Average | Count | Numerical Count | Min | Max | Sum" from={t(125.5)} to={t(141.8)} />
      <Caption text="Excel Options (Alt + F + T) ──► Lock Automatic Calculation & Kill Auto-Format" from={t(146.4)} to={t(159.6)} />
      <div style={{display: 'none'}}>{g0.fbTop}{clamp(0)}</div>
    </Stage>
  );
};
