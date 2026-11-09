import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {NAMES7, fmt2, fmtInt} from '../data';
import type {CellV, MenuItem} from '../kit';
import {Caption, Chip, Cursor, ExcelApp, ExcelWindow, Menu, MENU_ITEM_H, Ripple, Stage, Warn, clamp, dwell, menuItemY, pop, prog, sec, track} from '../kit';
import {CAM_SHEET, RangeFx, SmartTag, Tri, cellRect, center, typeIn} from '../l7';

// SC04: data traps. Anchors (s): 133.6 traps | 136.2 text number | 138.8 SUM/AVERAGE ignore | 143.3 COUNT | 145.3 COUNTA | 148.8 N/A | 150.4 stops | 152.6 error | 155.4 clean | 157.7 convert | 161.6 fixed
const S = START.s4;
const t = (g: number) => sec(g - S);
const cw4 = (c: number) => [0, 90, 140, 110, 160][c] ?? 64;
const G0 = {colW: cw4};
const AMT0 = [1200, 2500, 1800, 900, 3400, 600];
const MENU: MenuItem[] = [
  {label: 'Convert to Number', hot: true}, {label: 'Help on this error'}, {label: '', sep: true},
  {label: 'Ignore Error'}, {label: 'Edit in Formula Bar'}, {label: '', sep: true}, {label: 'Error Checking Options...'},
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const within = (a: number, b: number) => at(a) && !at(b);

  const converted = at(157.7);
  const hasErr = within(148.8, 161.6);
  const typingNA = within(147.8, 148.8);
  const typing900 = within(160.8, 161.6);
  const nums = [AMT0[0], AMT0[1], converted ? AMT0[2] : null, hasErr ? null : AMT0[3], AMT0[4], AMT0[5]];
  const total = nums.reduce<number>((a, b) => a + (b ?? 0), 0);
  const cnt = nums.filter((v) => v !== null).length;
  const res = [hasErr ? '#N/A' : fmtInt(total), hasErr ? '#N/A' : fmt2(total / cnt), String(cnt), '6'];
  const should = ['10,400', '1,733.33', '6', '6'];
  const ok = res.map((v, i) => v === should[i]);

  const cellFn = (r: number, c: number): CellV | undefined => {
    if (r === 1 && c <= 3) return {t: ['Order ID', 'Customer', 'Amount'][c - 1], b: true, bg: '#E2EFDA', al: c === 3 ? 'r' : 'l'};
    if (r >= 2 && r <= 7) {
      const i = r - 2;
      if (c === 1) return {t: `ORD-${1001 + i}`};
      if (c === 2) return {t: NAMES7[i]};
      if (c === 3) {
        if (r === 5 && typingNA) return {t: typeIn('=NA()', f, t(147.8), sec(0.8)), al: 'l'};
        if (r === 5 && typing900) return {t: typeIn('900', f, t(160.8), sec(0.6)), al: 'l'};
        if (r === 5 && hasErr) return {t: '#N/A', al: 'c'};
        if (r === 4 && !converted) return {t: '1,800', al: 'l'};
        return {t: fmtInt(AMT0[i]), num: AMT0[i], al: 'r'};
      }
    }
    if (r === 8 && c >= 2 && c <= 4) return {t: ['Function', 'Result', 'Formula'][c - 2], b: true, bg: '#E2EFDA'};
    if (r >= 9 && r <= 12) {
      const i = r - 9;
      if (c === 2) return {t: ['SUM', 'AVERAGE', 'COUNT', 'COUNTA'][i], b: true};
      if (c === 3) return {t: res[i], al: res[i] === '#N/A' ? 'c' : 'r', num: res[i] === '#N/A' ? undefined : 1, b: true};
      if (c === 4) return {t: ['=SUM(C2:C7)', '=AVERAGE(C2:C7)', '=COUNT(C2:C7)', '=COUNTA(C2:C7)'][i], color: '#616161'};
    }
    return undefined;
  };

  // cursor / selection
  const c4 = center(cellRect(4, 3, G0));
  const c5 = center(cellRect(5, 3, G0));
  const tag = { x: cellRect(4, 3, G0).x - 21, y: cellRect(4, 3, G0).y + 11 };
  const menuX = cellRect(4, 3, G0).x - 30, menuY = cellRect(4, 3, G0).y + 22;
  const itemC = { x: menuX + 80, y: menuItemY(menuY, MENU, 0, MENU_ITEM_H, 4, true) };
  const pts = dwell([
    {f: t(130.0), x: 760, y: 470},
    {f: t(135.9), x: c4.x, y: c4.y},
    {f: t(147.2), x: c4.x, y: c4.y},
    {f: t(147.6), x: c5.x, y: c5.y},
    {f: t(155.0), x: c5.x, y: c5.y},
    {f: t(155.3), x: c4.x, y: c4.y},
    {f: t(156.2), x: tag.x, y: tag.y},
    {f: t(157.4), x: itemC.x, y: itemC.y},
    {f: t(159.9), x: itemC.x, y: itemC.y},
    {f: t(160.2), x: c5.x, y: c5.y},
    {f: t(163.0), x: c5.x + 120, y: c5.y + 140},
  ]);
  const cur = track(f, pts);
  const clicks = [136.2, 147.6, 155.3, 156.3, 157.7, 160.3];

  let sel = {r1: 1, c1: 1, r2: 1, c2: 1}; let active = {r: 1, c: 1}; let nameBox = 'A1'; let formula = 'Order ID';
  const pick = (r: number, cc: number, fm: string) => { sel = {r1: r, c1: cc, r2: r, c2: cc}; active = {r, c: cc}; nameBox = `C${r}`; formula = fm; };
  if (at(136.2)) pick(4, 3, '1,800');
  if (at(147.6)) pick(5, 3, typingNA ? '=NA()' : '900');
  if (at(148.8)) pick(6, 3, '');
  if (at(155.3)) pick(4, 3, '1,800');
  if (at(157.7)) pick(4, 3, '1800');
  if (at(160.3)) pick(5, 3, typing900 ? '900' : '=NA()');
  if (at(161.6)) pick(6, 3, '');

  const showTag = within(136.3, 147.6) || within(155.4, 157.7);
  const menuOpen = within(156.4, 157.9);
  const triP = at(157.7) ? 0 : 1;
  const trapP = prog(f, t(136.0), 12) * (1 - prog(f, t(147.0), 10));
  const errP = prog(f, t(148.8), 10) * (1 - prog(f, t(161.4), 8));
  const sumHot = within(138.8, 147.4) ? 1 : 0;
  const warn = pop(f, t(133.4)) * (1 - prog(f, t(135.4), 10));
  const panelP = prog(f, t(138.4), 16);
  const rowAt = [139.0, 140.4, 143.3, 145.3];
  const title = at(155.0) ? ['Clean → Verify → Report', C.green] : at(147.4) ? ['Error Propagation', C.red] : ['The Text-Number Trap', C.amber];
  const fixed = prog(f, t(161.8), 14);
  const rowColors = ['SUM', 'AVERAGE', 'COUNT', 'COUNTA'];

  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="zoom">
      <ExcelWindow cam={CAM_SHEET}>
        <ExcelApp file="Book1" nameBox={nameBox} formula={formula} fbEdit={typingNA || typing900} colW={cw4} cell={cellFn} sel={sel} active={active} thumb={0} thumbSize={0.55}>
          <Tri rect={cellRect(4, 3, G0)} p={triP} />
          <RangeFx rect={cellRect(4, 3, G0)} color={C.amber} p={trapP} fill={0.2} label="Number stored as text" labelDx={118} />
          <RangeFx rect={cellRect(5, 3, G0)} color={C.red} p={errP} fill={0.2} label="#N/A" labelDx={118} />
          <RangeFx rect={cellRect(9, 3, G0)} color={hasErr ? C.red : sumHot ? C.amber : C.green} p={clamp(sumHot + (hasErr ? 1 : 0) + fixed)} fill={0.16} />
          <RangeFx rect={cellRect(10, 3, G0)} color={hasErr ? C.red : sumHot ? C.amber : C.green} p={clamp(sumHot + (hasErr ? 1 : 0) + fixed)} fill={0.16} />
          {showTag ? <SmartTag rect={cellRect(4, 3, G0)} open={menuOpen} /> : null}
          {menuOpen ? <Menu x={menuX} y={menuY} w={236} items={MENU} title="Number Stored as Text" /> : null}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} />; })}
          <Cursor x={cur.x} y={cur.y} down={clicks.some((c) => f >= t(c) && f < t(c) + 4)} />
        </ExcelApp>
      </ExcelWindow>

      <div style={{position: 'absolute', left: 0, right: 0, top: 68, display: 'flex', justifyContent: 'center', opacity: warn, transform: `scale(${0.8 + 0.2 * warn})`}} dir="ltr">
        <div style={{display: 'flex', alignItems: 'center', gap: 20, border: `3px solid ${C.red}`, borderRadius: 999, padding: '10px 36px', background: C.card, boxShadow: `0 0 30px ${C.red}66`}}>
          <Warn size={46} />
          <div style={{fontFamily: MONO, fontSize: 36, fontWeight: 700, color: C.text}}>DATA TRAPS</div>
        </div>
      </div>

      <div dir="ltr" style={{position: 'absolute', left: 880, top: 220, width: 940, opacity: panelP}}>
        <div style={{borderRadius: 26, border: `2px solid ${title[1]}`, background: 'rgba(15,23,42,0.94)', padding: '22px 30px', boxShadow: `0 30px 80px rgba(2,6,23,.75), 0 0 36px ${title[1]}44`}}>
          <div style={{fontFamily: MONO, fontSize: 32, fontWeight: 700, color: title[1] as string}}>{title[0]}</div>
          <div style={{display: 'flex', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`, padding: '14px 0 8px', marginTop: 8}}>
            <div style={{flex: 1.2}}>Function</div><div style={{flex: 1, textAlign: 'right'}}>Result</div><div style={{flex: 1, textAlign: 'right'}}>Should be</div><div style={{width: 70}} />
          </div>
          {rowColors.map((name, i) => {
            const p = prog(f, t(rowAt[i]), 12);
            const bad = !ok[i];
            const col = bad ? (res[i] === '#N/A' ? C.red : C.amber) : C.green;
            return (
              <div key={name} style={{display: 'flex', alignItems: 'center', height: 62, fontFamily: MONO, fontSize: 30, fontWeight: 700, borderBottom: `1px solid ${C.border}`, opacity: p, transform: `translateX(${(1 - p) * -24}px)`}}>
                <div style={{flex: 1.2, color: C.text}}>{name}</div>
                <div style={{flex: 1, textAlign: 'right', color: col}}>{res[i]}</div>
                <div style={{flex: 1, textAlign: 'right', color: C.muted}}>{should[i]}</div>
                <div style={{width: 70, textAlign: 'center', fontSize: 30, color: col}}>{bad ? '⚠' : '✓'}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 880, top: 770, opacity: prog(f, t(139.6), 12) * (1 - prog(f, t(147.0), 10))}}><Chip color={C.amber}>⚠ 1,800 silently missing from the total</Chip></div>
      <div style={{position: 'absolute', left: 880, top: 770, opacity: prog(f, t(152.4), 12) * (1 - prog(f, t(155.0), 10))}}><Chip color={C.red}>SUM stops → returns the same #N/A</Chip></div>
      <div style={{position: 'absolute', left: 880, top: 770, opacity: fixed}}><Chip color={C.green}>✓ Clean data → reliable totals</Chip></div>

      <Caption text="Text-Numbers Trap ──► SUM & COUNT Ignore Text-Formatted Numbers" from={t(131.6)} to={t(147.0)} tone="danger" />
      <Caption text="Formula Errors (#VALUE!) ──► Halts Aggregation & Propagates Error to Total" from={t(147.2)} to={t(166.0)} tone="danger" />
    </Stage>
  );
};
