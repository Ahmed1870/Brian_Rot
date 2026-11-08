import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {smallCell} from '../data';
import {
  dwell, CAM0, CAM_DLG, CAM_NB, CAM_QAT, Caption, Cursor, ExcelApp, ExcelWindow, KeyBadge, LeftItem, Menu, OptionsDialog, QAT_LISTS, QAT_MENU, Ripple, Stage,
  clamp, camLerp, menuItemY, optOk, prog, qatAddBtn, qatArrowCx, qatCx, qatLeftItemPos, qatRemoveBtn, qatRightItemPos, sec, track,
} from '../kit';

// SC02: Quick Access Toolbar customization + Alt shortcuts.
// Anchors (s): 44.8 QAT | 51.64 arrow | 52.71 More Commands | 57.33 Paste Values | 59.14 AutoFilter | 61.48 Sort | 62.82 Clear Formats | 67.26 Alt | 68.34 Alt+1 | 70.16 Alt+2
const S = START.s2;
const t = (g: number) => sec(g - S);

const BASE_RIGHT: LeftItem[] = [{label: 'Save', icon: 'save'}, {label: 'Undo', icon: 'undo'}, {label: 'Redo', icon: 'redo'}];
const ADDS: Array<{at: number; item: LeftItem}> = [
  {at: 57.6, item: {label: 'Paste Values', icon: 'pasteValues'}},
  {at: 59.65, item: {label: 'Filter', icon: 'filter'}},
  {at: 61.75, item: {label: 'Sort Ascending', icon: 'sortAsc'}},
  {at: 63.15, item: {label: 'Clear Formats', icon: 'clearFormats'}},
];
const REMOVES = [54.4, 55.15, 55.85];
const FINAL_QAT = ['pasteValues', 'filter', 'sortAsc', 'clearFormats'];
const CLICKS = [51.64, 52.75, 53.95, 54.4, 54.75, 55.15, 55.45, 55.85, 57.2, 57.6, 59.0, 59.65, 61.1, 61.75, 62.55, 63.15, 65.2];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);

  // camera: QAT -> dialog -> QAT -> full -> name box
  let cam = CAM_QAT;
  cam = camLerp(cam, CAM_DLG, prog(f, t(52.7), 40));
  cam = camLerp(cam, CAM_QAT, prog(f, t(65.3), 40));
  cam = camLerp(cam, CAM0, prog(f, t(71.6), 50));
  cam = camLerp(cam, CAM_NB, prog(f, t(76.6), 60));

  const dlgIn = prog(f, t(52.95), 14), dlgOut = prog(f, t(65.4), 10);
  const dlgP = dlgIn * (1 - dlgOut);
  const menuOpen = at(51.7) && !at(52.78);
  const qatN = at(65.5) ? 4 : 3;
  const qat = at(65.5) ? FINAL_QAT : ['save', 'undo', 'redo'];
  const arrowX = qatArrowCx(3);

  // dialog data
  let right = BASE_RIGHT.filter((_, i) => i >= REMOVES.filter((r) => at(r)).length);
  right = right.concat(ADDS.filter((a) => at(a.at)).map((a) => a.item));
  const list = at(62.2) ? 'clear' : at(60.7) ? 'sort' : at(58.6) ? 'filter' : at(56.5) ? 'paste' : 'popular';
  const leftIdx: Record<string, number> = {paste: 6, filter: 2, sort: 5, clear: 3};
  const selTimes: Record<string, [number, number]> = {paste: [57.2, 57.6], filter: [59.0, 59.65], sort: [61.1, 61.75], clear: [62.55, 63.15]};
  const sT = selTimes[list];
  const leftSel = sT && f >= t(sT[0]) && f < t(sT[1]) + 4 ? leftIdx[list] : -1;
  const removing = REMOVES.findIndex((r) => f >= t(r) - 14 && f < t(r) + 4);
  const rightSel = removing >= 0 ? 0 : -1;
  const flyAdd = ADDS.find((a) => f >= t(a.at) && f < t(a.at) + 12);
  const flying = flyAdd ? {item: flyAdd.item, t: clamp((f - t(flyAdd.at)) / 12)} : null;
  const addHot = ADDS.some((a) => Math.abs(f - t(a.at)) < 5);
  const removeHot = REMOVES.some((r) => Math.abs(f - t(r)) < 5);
  const okHot = Math.abs(f - t(65.2)) < 6;

  // cursor path
  const mY = menuItemY(32, QAT_MENU, 14);
  const L = (i: number) => qatLeftItemPos(i);
  const R = qatRightItemPos(0);
  const add = qatAddBtn(), rem = qatRemoveBtn(), ok = optOk();
  const pts = dwell([
    {f: t(42.1), x: 700, y: 330},
    {f: t(51.3), x: arrowX, y: 16},
    {f: t(52.1), x: arrowX + 40, y: mY},
    {f: t(53.0), x: R.x + 10, y: R.y + 150},
    {f: t(53.9), x: R.x, y: R.y},
    {f: t(54.35), x: rem.x, y: rem.y},
    {f: t(54.7), x: R.x, y: R.y},
    {f: t(55.1), x: rem.x, y: rem.y},
    {f: t(55.4), x: R.x, y: R.y},
    {f: t(55.8), x: rem.x, y: rem.y},
    {f: t(57.1), x: L(6).x, y: L(6).y},
    {f: t(57.55), x: add.x, y: add.y},
    {f: t(58.95), x: L(2).x, y: L(2).y},
    {f: t(59.6), x: add.x, y: add.y},
    {f: t(61.05), x: L(5).x, y: L(5).y},
    {f: t(61.7), x: add.x, y: add.y},
    {f: t(62.5), x: L(3).x, y: L(3).y},
    {f: t(63.1), x: add.x, y: add.y},
    {f: t(65.15), x: ok.x, y: ok.y},
    {f: t(66.4), x: 760, y: 360},
  ]);
  const cur = track(f, pts);
  const curHide = f > t(66.6) || f < t(42.1);
  const down = CLICKS.some((c) => f >= t(c) && f < t(c) + 4);

  // Alt key tips
  const tips = prog(f, t(67.3), 10);
  const hot = f >= t(70.16) && f < t(72.5) ? 1 : f >= t(68.34) && f < t(70.0) ? 0 : -1;
  const keys = f >= t(70.16) ? ['Alt', '2'] : f >= t(68.34) ? ['Alt', '1'] : ['Alt'];
  const keyP = prog(f, t(67.3), 8) * (1 - prog(f, t(73.0), 10));
  const filterOn = f >= t(70.6) && f < t(77.0);

  return (
    <Stage dur={SCENES.s2.dur} inFx="none" outFx="none">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Book1" qat={qat} qatTips={tips * (f < t(77) ? 1 : 0)} qatHot={hot}
          nameBox="A1" formula="Order ID" cell={smallCell} sel={{r1: 1, c1: 1, r2: 1, c2: 1}} active={{r: 1, c: 1}}
          filterCols={filterOn ? [1, 2, 3, 4, 5, 6, 7, 8] : undefined} thumb={0} thumbSize={0.55}
        >
          {menuOpen ? <Menu x={arrowX - 24} y={32} w={232} items={QAT_MENU.map((m, i) => (i === 14 && f > t(52.4) ? {...m, hot: true} : m))} title="Customize Quick Access Toolbar" /> : null}
          {menuOpen ? null : null}
          {dlgP > 0.01 ? (
            <OptionsDialog s={{page: 'Quick Access Toolbar', p: dlgP, leftList: list, leftCombo: list === 'popular' ? 'Popular Commands' : 'All Commands', leftSel, rightItems: right, rightSel, addHot, removeHot, okHot, flying}} />
          ) : null}
          {tips > 0.5 && f < t(77)
            ? FINAL_QAT.map((id, i) => (
              <div key={'chip' + id} style={{position: 'absolute', left: qatCx(i) - 16, top: 41, width: 32, height: 16, borderRadius: 4, background: C.green, color: '#04130C', fontFamily: 'Consolas, "DejaVu Sans Mono", monospace', fontWeight: 700, fontSize: 9.5, textAlign: 'center', lineHeight: '16px', zIndex: 29, boxShadow: `0 0 ${hot === i ? 16 : 6}px ${C.green}`, opacity: tips, transform: hot === i ? 'scale(1.18)' : 'none'}}>Alt+{i + 1}</div>
            ))
            : null}
          {CLICKS.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>
      <KeyBadge keys={keys} p={keyP} />
      <Caption text="Customizing QAT ──► Add: Paste Values | Filter | Sort | Clear Formats" from={t(44.4)} to={t(64.0)} />
      <Caption text="Speed Mastery ──► Trigger Tools Instantly via Alt + 1, Alt + 2, Alt + 3 Shortcuts" from={t(67.2)} to={t(78.4)} tone="ok" />
    </Stage>
  );
};
